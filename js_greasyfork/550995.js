// ==UserScript==
// @name         AI clipboard shortcut
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Send to AI: Ctrl+Shift+A. Settings: Ctrl+Shift+S
// @author       Jouke van Dam
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @connect      openrouter.ai
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/550995/AI%20clipboard%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/550995/AI%20clipboard%20shortcut.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// ---------- Defaults ----------
	const DEFAULTS = {
		model: 'google/gemini-2.5-flash',
		reasoning: true,
		reasoning_tokens: 256,
		input_methods: ['selection','clipboard','prompt'],
		output_methods: ['insert','clipboard','toast'],
		conc_idx: 3, // 0..5
		max_output_tokens: 1024,
		page_clipboard_timeout_ms: 1500
	};

	const CONCISENESS_LEVELS = [
		'very verbose',
		'verbose',
		'normal',
		'concise',
		'very concise',
		'ultra concise'
	];

	const API_BASE = 'https://openrouter.ai/api/v1/chat/completions';

	// ---------- Storage helpers ----------
	async function getSetting(key) {
		const val = await GM_getValue('ORCS_' + key, null);
		if (val === null || typeof val === 'undefined') {
			await GM_setValue('ORCS_' + key, DEFAULTS[key]);
			console.debug('AI: defaulting', key, DEFAULTS[key]);
			return DEFAULTS[key];
		}
		return val;
	}
	async function setSetting(key, val) { await GM_setValue('ORCS_' + key, val); console.info('AI: set', key, val); return val; }
	async function resetSettings() { for (const k of Object.keys(DEFAULTS)) await GM_setValue('ORCS_' + k, DEFAULTS[k]); console.info('AI: settings reset'); showToast('Settings reset to defaults', 'info'); }

	// ---------- Toast UI (with Settings button) ----------
	function ensureToastStyle() {
		if (document.getElementById('orcs_toast_style')) return;
		const style = document.createElement('style');
		style.id = 'orcs_toast_style';
		style.textContent = `
			#orcs_toast_container { position: fixed; right: 16px; bottom: 16px; z-index: 2147483647; max-width: 46ch; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
			.orcs_toast { background: rgba(30,30,30,0.95); color: #fff; padding: 10px 14px; border-radius: 10px; margin-top: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.35); backdrop-filter: blur(4px); opacity: 0; transform: translateY(8px); transition: opacity 220ms ease, transform 220ms ease; font-size: 13px; display:flex; align-items:center; }
			.orcs_toast.show { opacity:1; transform: translateY(0); }
			.orcs_toast .msg { flex: 1; }
			.orcs_toast .btn { background: rgba(255,255,255,0.08); color: #fff; border: none; padding:6px 10px; border-radius:8px; margin-left:10px; cursor:pointer; }
			.orcs_toast.info { background: rgba(40,40,40,0.95); }
			.orcs_toast.success { background: rgba(20,120,70,0.95); }
			.orcs_toast.error { background: rgba(160,30,30,0.95); }
			.orcs_toast .small { font-size:11px; opacity:0.85; display:block; margin-top:6px; }
		`;
		document.head.appendChild(style);
		const container = document.createElement('div'); container.id = 'orcs_toast_container'; document.body.appendChild(container);
	}
	function escapeHtml(s) {
		if (!s) return '';
		return String(s).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
	}

	function showToast(message, type = 'info', duration = 5000, smallText = '') {
		try {
			ensureToastStyle();
			const container = document.getElementById('orcs_toast_container'); if (!container) return;
			const t = document.createElement('div'); t.className = `orcs_toast ${type}`;
			t.innerHTML = `<div class="msg">${escapeHtml(message)}${smallText?('<div class="small">'+escapeHtml(smallText)+'</div>'):''}</div><button class="btn" data-orcs-action="settings">Settings</button>`;
			container.appendChild(t);
			requestAnimationFrame(()=>t.classList.add('show'));
			// click handler for settings button
			t.addEventListener('click', (ev)=>{
				const btn = ev.target.closest('[data-orcs-action]'); if (!btn) return;
				if (btn.dataset.orcsAction === 'settings') { ev.stopPropagation(); showSettingsModal(); }
			});
			setTimeout(()=>{ try { t.classList.remove('show'); setTimeout(()=>t.remove(),300); } catch(e){} }, duration);
		} catch (e) { try { GM_notification && GM_notification({ title: 'AI', text: message, timeout: Math.round(duration/1000) }); } catch (er) { console.warn('toast & notification failed', er); } }
	}

	// ---------- Settings modal (user-friendly) ----------
	function ensureModalStyle() {
		if (document.getElementById('orcs_modal_style')) return;
		const style = document.createElement('style'); style.id = 'orcs_modal_style'; style.textContent = `
			#orcs_modal_backdrop { position: fixed; inset:0; background: rgba(0,0,0,0.35); z-index:2147483648; display:flex; align-items:center; justify-content:center; }
			#orcs_modal { width: min(720px, 96vw); max-height: 86vh; overflow:auto; background: #fff; color:#111; border-radius:12px; padding: 18px; box-shadow:0 12px 40px rgba(0,0,0,0.45); font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial; }
			#orcs_modal h2 { margin:0 0 10px 0; font-size:18px; }
			.orcs_row { display:flex; gap:12px; margin:8px 0; align-items:center; }
			.orcs_col { flex:1; }
			.select_list { border:1px solid #ddd; padding:8px; border-radius:8px; min-height:40px; background:#fafafa; }
			.move_btn { margin-left:6px; padding:6px 8px; }
			.modal_actions { display:flex; gap:8px; justify-content:flex-end; margin-top:12px; }
			.modal_input { width:100%; padding:8px; border-radius:6px; border:1px solid #ccc; }
			.label { font-size:13px; color:#333; margin-bottom:4px; display:block; }
			.orcs_item_row { display:flex; align-items:center; margin:6px 0; }
			.orcs_item_label { flex:1; padding-right:8px; }
			.orcs_chooser { display:flex; gap:8px; margin-top:8px; }
		`;
		document.head.appendChild(style);
	}

	async function showSettingsModal() {
		try {
			ensureModalStyle();
			// build modal element
			const backdrop = document.createElement('div'); backdrop.id = 'orcs_modal_backdrop';
			const modal = document.createElement('div'); modal.id = 'orcs_modal';
			modal.innerHTML = `
				<h2>AI — Settings</h2>
				<div class="orcs_row"><div class="orcs_col"><label class="label">Model</label><input id="orcs_model" class="modal_input"/></div><div style="width:160px;"><label class="label">Max output tokens</label><input id="orcs_max_tokens" class="modal_input" type="number"/></div></div>
				<div class="orcs_row"><div class="orcs_col"><label class="label">Conciseness</label><select id="orcs_conc" class="modal_input"></select></div><div style="width:160px;"><label class="label">Reasoning enabled</label><br/><input id="orcs_reasoning" type="checkbox"/></div></div>
				<div class="orcs_row"><div class="orcs_col"><label class="label">Reasoning tokens</label><input id="orcs_reasoning_tokens" class="modal_input" type="number"/></div><div style="width:260px;"></div></div>
				<div style="margin-top:12px;"><label class="label">Input methods (priority top→bottom)</label><div id="orcs_input_list" class="select_list"></div></div>
				<div style="margin-top:12px;"><label class="label">Output methods (priority top→bottom)</label><div id="orcs_output_list" class="select_list"></div></div>
				<div class="modal_actions">
					<button id="orcs_save" class="btn">Save</button>
					<button id="orcs_reset" class="btn">Reset</button>
					<button id="orcs_cancel" class="btn">Cancel</button>
				</div>
			`;
			backdrop.appendChild(modal); document.body.appendChild(backdrop);

			// populate values
			const model = await getSetting('model'); const max_tokens = await getSetting('max_output_tokens');
			const conc = await getSetting('conc_idx'); const reasoning = await getSetting('reasoning'); const reasoning_tokens = await getSetting('reasoning_tokens');
			const input_methods = (await getSetting('input_methods')) || DEFAULTS.input_methods;
			const output_methods = (await getSetting('output_methods')) || DEFAULTS.output_methods;

			modal.querySelector('#orcs_model').value = model || DEFAULTS.model;
			modal.querySelector('#orcs_max_tokens').value = max_tokens || DEFAULTS.max_output_tokens;
			const concSel = modal.querySelector('#orcs_conc'); CONCISENESS_LEVELS.forEach((c,i)=>{ const o = document.createElement('option'); o.value = i; o.textContent = `${i}: ${c}`; concSel.appendChild(o); }); concSel.value = String(conc || DEFAULTS.conc_idx);
			modal.querySelector('#orcs_reasoning').checked = !!reasoning;
			modal.querySelector('#orcs_reasoning_tokens').value = reasoning_tokens || DEFAULTS.reasoning_tokens;

			// helper to render reorderable list (fixed: each row has .orcs_item_row and data-value)
			function renderReorderList(container, items, available) {
				container.innerHTML = '';
				for (let i=0;i<items.length;i++) {
					const row = document.createElement('div'); row.className = 'orcs_item_row';
					const label = document.createElement('div'); label.className = 'orcs_item_label'; label.textContent = items[i]; label.dataset.value = items[i];
					const up = document.createElement('button'); up.textContent='↑'; up.className='move_btn'; up.onclick = ()=>{ if (i===0) return; [items[i-1], items[i]] = [items[i], items[i-1]]; renderReorderList(container, items, available); };
					const down = document.createElement('button'); down.textContent='↓'; down.className='move_btn'; down.onclick = ()=>{ if (i===items.length-1) return; [items[i+1], items[i]] = [items[i], items[i+1]]; renderReorderList(container, items, available); };
					const remove = document.createElement('button'); remove.textContent='✖'; remove.className='move_btn'; remove.onclick = ()=>{ items.splice(i,1); renderReorderList(container, items, available); };
					row.appendChild(label); row.appendChild(up); row.appendChild(down); row.appendChild(remove);
					container.appendChild(row);
				}
				// add chooser to append more (this chooser is not part of .orcs_item_row)
				const chooserRow = document.createElement('div'); chooserRow.className = 'orcs_chooser';
				const select = document.createElement('select'); available.forEach(a=>{ const o=document.createElement('option'); o.value=a; o.textContent=a; select.appendChild(o); }); select.className='modal_input'; select.style.flex='1';
				const add = document.createElement('button'); add.textContent='Add'; add.onclick = ()=>{ const v = select.value; if (items.indexOf(v)===-1) { items.push(v); renderReorderList(container, items, available); } };
				chooserRow.appendChild(select); chooserRow.appendChild(add); container.appendChild(chooserRow);
			}

			const inputList = modal.querySelector('#orcs_input_list'); const outputList = modal.querySelector('#orcs_output_list');
			renderReorderList(inputList, input_methods.slice(), ['selection','clipboard','prompt']);
			renderReorderList(outputList, output_methods.slice(), ['insert','clipboard','toast']);

			// button handlers
			modal.querySelector('#orcs_save').onclick = async ()=>{
				const newModel = modal.querySelector('#orcs_model').value.trim() || DEFAULTS.model;
				const newMax = Math.max(1, parseInt(modal.querySelector('#orcs_max_tokens').value,10) || DEFAULTS.max_output_tokens);
				const newConc = Math.max(0, Math.min(CONCISENESS_LEVELS.length-1, parseInt(modal.querySelector('#orcs_conc').value,10) || DEFAULTS.conc_idx));
				const newReasoning = !!modal.querySelector('#orcs_reasoning').checked;
				const newReasoningTokens = Math.max(0, parseInt(modal.querySelector('#orcs_reasoning_tokens').value,10) || DEFAULTS.reasoning_tokens);
				// read lists - only from .orcs_item_row labels
				const newInput = Array.from(inputList.querySelectorAll('.orcs_item_row .orcs_item_label')).map(n=>n.dataset.value.trim()).filter(Boolean);
				const newOutput = Array.from(outputList.querySelectorAll('.orcs_item_row .orcs_item_label')).map(n=>n.dataset.value.trim()).filter(Boolean);
				await setSetting('model', newModel);
				await setSetting('max_output_tokens', newMax);
				await setSetting('conc_idx', newConc);
				await setSetting('reasoning', newReasoning);
				await setSetting('reasoning_tokens', newReasoningTokens);
				await setSetting('input_methods', newInput.length?newInput:DEFAULTS.input_methods);
				await setSetting('output_methods', newOutput.length?newOutput:DEFAULTS.output_methods);
				showToast('Settings saved', 'success');
				backdrop.remove();
			};
			modal.querySelector('#orcs_reset').onclick = ()=>{ if (!confirm('Reset to defaults?')) return; resetSettings(); backdrop.remove(); };
			modal.querySelector('#orcs_cancel').onclick = ()=>{ backdrop.remove(); };

			// close on backdrop click (but not on modal click)
			backdrop.addEventListener('click', (ev)=>{ if (ev.target===backdrop) backdrop.remove(); });
		} catch (err) { console.error('AI: showSettingsModal error', err); }
	}

	// ---------- Page-context clipboard read ----------
	function readClipboardInPageContext(timeoutMs) {
		return new Promise((resolve)=>{
			const channel = 'orcs_clip_resp_'+Math.random().toString(36).slice(2);
			function onMessage(e) { try { if (e && e.data && e.data.__orcs_clip_channel === channel) { window.removeEventListener('message', onMessage); resolve(e.data.text||''); } } catch(e){} }
			window.addEventListener('message', onMessage);
			const script = document.createElement('script'); script.textContent = `(async function(){ try{ const t = await navigator.clipboard.readText(); window.postMessage({ __orcs_clip_channel: '${channel}', text: t }, '*'); }catch(e){ window.postMessage({ __orcs_clip_channel: '${channel}', text: '' }, '*'); } })();`;
			(document.documentElement||document.head||document.body).appendChild(script); script.remove();
			setTimeout(()=>{ window.removeEventListener('message', onMessage); resolve(''); }, timeoutMs||DEFAULTS.page_clipboard_timeout_ms);
		});
	}

	// ---------- Read input by policy ----------
	async function readSelectionOrClipboardByPolicy() {
		console.debug('AI: readSelectionOrClipboardByPolicy');
		const methods = await getSetting('input_methods');
		for (const method of methods) {
			try {
				if (method === 'selection') {
					const active = document.activeElement;
					if (active && (active.tagName==='INPUT' || active.tagName==='TEXTAREA')) {
						const s = active.selectionStart, e = active.selectionEnd; if (typeof s==='number' && e>s) { const v = active.value.substring(s,e); if (v.trim()) return v; }
					}
					try { const sel = window.getSelection(); if (sel && sel.toString().trim()) return sel.toString(); } catch(e){}
				} else if (method === 'clipboard') {
					console.debug('AI: trying clipboard (page-context)');
					const p = await readClipboardInPageContext(); if (p && p.trim()) return p;
					try { if (navigator.clipboard && navigator.clipboard.readText) { const t = await navigator.clipboard.readText(); if (t && t.trim()) return t; } } catch(e) { console.warn('AI: clipboard read failed', e); }
				} else if (method === 'prompt') {
					const p = window.prompt('Paste text here:'); if (p && p.trim()) return p;
				} else {
					console.warn('AI: unknown input method', method);
				}
			} catch (err) { console.error('AI: input method error', method, err); }
		}
		const final = window.prompt('No content found. Paste here:'); return final||'';
	}

	// ---------- Insert output by policy ----------
	async function tryInsertResponseByPolicy(text) {
		console.debug('AI: tryInsertResponseByPolicy');
		const methods = await getSetting('output_methods');
		for (const m of methods) {
			try {
				if (m === 'insert') {
					if (tryInsertIntoActiveOrSelection(text)) return true;
					continue;
				}
				if (m === 'clipboard') {
					try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); console.debug('AI: navigator clipboard write succeeded'); return true; } } catch(e) { console.warn('AI: navigator clipboard write failed', e); }
					try { GM_setClipboard(text, { type: 'text', mimetype: 'text/plain' }); console.debug('AI: GM_setClipboard succeeded'); return true; } catch(e) { console.error('AI: GM_setClipboard failed', e); }
				}
				if (m === 'toast') { showToast(text.length>300?text.slice(0,300)+'…':text,'info',8000); return true; }
			} catch(err){ console.error('AI: output method error', m, err); }
		}
		return false;
	}

	function tryInsertIntoActiveOrSelection(text) {
		try {
			const active = document.activeElement;
			if (active && (active.tagName==='INPUT' || active.tagName==='TEXTAREA')) {
				try {
					const s = active.selectionStart, e = active.selectionEnd; const before = active.value.slice(0, (typeof s==='number'?s:0)); const after = active.value.slice((typeof e==='number'?e:active.value.length)); active.value = before + text + after; const pos = before.length + text.length; try{ active.setSelectionRange(pos,pos); }catch(e){} active.dispatchEvent(new Event('input',{bubbles:true})); active.dispatchEvent(new Event('change',{bubbles:true})); return true;
				} catch(e) { console.warn('AI: failed insert into input', e); }
			}
			try {
				const sel = window.getSelection(); if (sel && sel.rangeCount>0) { const range = sel.getRangeAt(0); range.deleteContents(); const node = document.createTextNode(text); range.insertNode(node); range.setStartAfter(node); sel.removeAllRanges(); const r2 = document.createRange(); r2.setStartAfter(node); sel.addRange(r2); return true; }
			} catch(e) { console.warn('AI: failed insert into selection', e); }
		} catch(e) { console.error('AI: tryInsert error', e); }
		return false;
	}

	// ---------- Extractor ----------
	function extractTextFromResponse(json) {
		try {
			if (!json) return null;
			if (Array.isArray(json.choices) && json.choices.length>0) {
				const choice = json.choices[0];
				if (choice.message) {
					const msg = choice.message;
					if (typeof msg.content === 'string' && msg.content.trim()) return msg.content.trim();
					if (msg.content && Array.isArray(msg.content.parts)) { const j=msg.content.parts.join(''); if (j.trim()) return j.trim(); }
					if (Array.isArray(msg.content)) {
						const j = msg.content.map(b=>{ if (!b) return ''; if (typeof b==='string') return b; if (b.text) return b.text; if (b.content && typeof b.content==='string') return b.content; return JSON.stringify(b); }).join('');
						if (j.trim()) return j.trim();
					}
					if (msg.text && typeof msg.text==='string' && msg.text.trim()) return msg.text.trim();
				}
				if (choice.text && typeof choice.text==='string' && choice.text.trim()) return choice.text.trim();
			}
			if (json.output && typeof json.output==='string' && json.output.trim()) return json.output.trim();
			if (json.result && typeof json.result==='string' && json.result.trim()) return json.result.trim();
			if (json.response && typeof json.response==='string' && json.response.trim()) return json.response.trim();
		} catch(err) { console.error('AI: extract error', err); }
		return null;
	}

	// ---------- Call OpenRouter ----------
	async function callOpenRouter(apiKey, promptText) {
		const model = await getSetting('model');
		const reasoningEnabled = !!(await getSetting('reasoning'));
		const reasoningTokens = Number(await getSetting('reasoning_tokens')) || DEFAULTS.reasoning_tokens;
		const maxTokens = Number(await getSetting('max_output_tokens')) || DEFAULTS.max_output_tokens;
		const concIdx = Number(await getSetting('conc_idx')) || DEFAULTS.conc_idx;
		const concPhrase = CONCISENESS_LEVELS[concIdx] ? `Please ${CONCISENESS_LEVELS[concIdx]}.` : 'Please be concise.';
		const body = { model, messages:[ { role:'system', content: concPhrase }, { role:'user', content: promptText } ], reasoning: { enabled: reasoningEnabled, tokens: reasoningTokens }, temperature:0.2, max_tokens: maxTokens };
		console.info('AI: sending request', { model, reasoningEnabled, reasoningTokens, maxTokens, concIdx });
		console.debug('AI: request body', body);
		return new Promise((resolve,reject)=>{
			const start = Date.now();
			GM_xmlhttpRequest({ method:'POST', url: API_BASE, headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${apiKey}` }, data: JSON.stringify(body),
				onload(resp){ console.info('AI: HTTP', resp.status, resp.statusText, 'elapsed', Date.now()-start); if (resp.status>=200 && resp.status<300){ try{ const json = JSON.parse(resp.responseText); console.debug('AI: raw json', json); const text = extractTextFromResponse(json); resolve({ ok:true, text, raw:json }); }catch(e){ console.error('AI: parse error', e); reject(new Error('Failed to parse response JSON: '+e.message)); } } else { console.error('AI: HTTP error', resp.status, resp.statusText, resp.responseText); reject(new Error(`HTTP ${resp.status}: ${resp.statusText}\n${resp.responseText}`)); } },
				onerror(err){ console.error('AI: network error', err); reject(new Error('Network error: '+err)); },
				ontimeout(){ console.error('AI: timeout'); reject(new Error('Request timed out')); }
			});
		});
	}

	// ---------- Hotkeys: Ctrl+Shift+A (run), Ctrl+Shift+S (settings) ----------
	window.addEventListener('keydown', async (ev)=>{
		try{
			if (ev.ctrlKey && ev.shiftKey && (ev.key==='S' || ev.key==='s')) { ev.preventDefault(); showSettingsModal(); return; }
			if (ev.ctrlKey && ev.shiftKey && (ev.key==='A' || ev.key==='a' || ev.code==='KeyA')) {
				ev.preventDefault();
				console.info('AI: hotkey triggered');
				const apiKey = await getApiKey();
				if (!apiKey) { showToast('AI API key required (menu or prompt).','error'); console.warn('AI: missing API key'); return; }
				const clip = await readSelectionOrClipboardByPolicy();
				if (!clip || !clip.trim()) { showToast('No input found (select/copy/paste).','error'); console.warn('AI: no input'); return; }
				showToast('Sending to model...','info');
				try {
					const res = await callOpenRouter(apiKey, clip);
					if (res.ok) {
						if (res.text) {
							const ok = await tryInsertResponseByPolicy(res.text);
							if (ok) { showToast('Response delivered ✅','success'); }
							else {
								// fallback: try to copy
								try { GM_setClipboard(res.text, { type:'text', mimetype:'text/plain' }); console.debug('AI: fallback GM_setClipboard used'); showToast('Response copied to clipboard','success'); }
								catch(e){ showToast('Response received but could not deliver or copy. See console.','error'); console.warn('AI: could not deliver, text:', res.text); }
							}
						} else {
							showToast('Model returned no text. See console.','error');
							console.warn('AI: no extracted text', res.raw||res.rawText);
						}
					} else {
						showToast('No usable response. See console.','error'); console.error('AI: not-ok response', res);
					}
				} catch(err) {
					showToast('Error: '+(err.message||String(err)),'error',7000); console.error('AI: request error', err);
				}
			}
		}catch(e){ console.error('AI: keydown handler error', e); }
	});

	// ---------- API key helper & menu ----------
	async function getApiKey(){ let key = await GM_getValue('OPENROUTER_API_KEY', null); if (!key) { key = window.prompt('AI (OpenRouter) API Key (paste here) — it will be stored locally for this userscript:'); if (key) await GM_setValue('OPENROUTER_API_KEY', key.trim()); } return key; }
	try{ GM_registerMenuCommand && GM_registerMenuCommand('AI: Open settings', ()=>showSettingsModal()); } catch(e) { console.warn('AI: GM_registerMenuCommand failed', e); }

	// ---------- Init: show toast with Settings button (5s) ----------
	(async ()=>{
		console.info('AI: script active — Ctrl+Shift+A run, Ctrl+Shift+S settings');
		showToast('AI ready — click Settings to configure','info',5000,'Press Ctrl+Shift+A to send selection');
	})();

})();
