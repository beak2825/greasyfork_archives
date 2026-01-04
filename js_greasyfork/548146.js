// ==UserScript==
// @name         Noordhoff answers
// @version      1.2
// @description  Intercepts exercise data and renders answers, including MathML formulas.
// @match        *://apps.noordhoff.nl/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1511158
// @downloadURL https://update.greasyfork.org/scripts/548146/Noordhoff%20answers.user.js
// @updateURL https://update.greasyfork.org/scripts/548146/Noordhoff%20answers.meta.js
// ==/UserScript==

(() => {
	'use strict';

	// config
	const TARGET_OPERATION = "ContentUnitForPlayableContent";
	const DEFAULT_PANEL_WIDTH = 520;
    const COLLAPSE_HANDLE_WIDTH = 10; // How many pixels are visible when collapsed for hover
	const MAX_RAW_PREVIEW = 20000;

    // --- MathJax Integration ---
    let mathJaxLoaded = false;
    function loadMathJax() {
        if (mathJaxLoaded || window.MathJax) {
            mathJaxLoaded = true;
            return;
        }
        mathJaxLoaded = true; // Prevent multiple loads
        console.info('CUFPC-latest: Loading MathJax to render formulas.');
        window.MathJax = {
            loader: {load: ['input/mml', 'output/chtml']},
            startup: {
                ready: () => {
                    console.info('CUFPC-latest: MathJax is ready.');
                    window.MathJax.startup.defaultReady();
                }
            }
        };
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
        script.async = true;
        document.head.appendChild(script);
    }

	// panel singleton
	let panel;

    // Panel state functions, moved to outer scope for hotkey access
    function collapsePanel() {
        if (!panel) return;
        panel.classList.add('cufpc-collapsed');
        const toggle = panel.querySelector('#cufpc-toggle');
        if (toggle) toggle.textContent = '▸';
    }
    function expandPanel() {
        if (!panel) return;
        panel.classList.remove('cufpc-collapsed');
        const toggle = panel.querySelector('#cufpc-toggle');
        if (toggle) toggle.textContent = '▾';
    }
    function togglePanel() {
        if (!panel) return;
        if (panel.classList.contains('cufpc-collapsed')) expandPanel();
        else collapsePanel();
    }


	function ensurePanel() {
		if (panel) return panel;

        loadMathJax();

		panel = document.createElement('div');
		panel.id = 'cufpc-panel-latest';
		panel.innerHTML = `
            <div id="cufpc-resizer"></div>
			<div id="cufpc-topbar">
				<div id="cufpc-title">ContentUnitForPlayableContent — latest</div>
				<div id="cufpc-controls">
					<button id="cufpc-toggle" title="collapse panel">▾</button>
					<button id="cufpc-copy" title="copy latest">Copy</button>
					<button id="cufpc-download" title="download latest">⬇</button>
					<button id="cufpc-raw-toggle" title="toggle raw">Raw</button>
				</div>
			</div>
			<div id="cufpc-body">
				<div id="cufpc-meta"></div>
				<div id="cufpc-answers"></div>
				<div id="cufpc-debug" style="display:none"></div>
				<pre id="cufpc-raw" style="display:none"></pre>
			</div>
		`;

        // Set width from storage or use default
        const savedWidth = localStorage.getItem('cufpc-panel-width');
        panel.style.width = savedWidth ? savedWidth : `${DEFAULT_PANEL_WIDTH}px`;


		const style = document.createElement('style');
		style.textContent = `
			#cufpc-panel-latest {
				position: fixed;
				right: 0;
				top: 0;
				bottom: 0;
				/* width is set by JS */
				background: #0e1012;
				color: #ddd;
				font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial;
				border-left: 1px solid rgba(255,255,255,0.04);
				z-index: 2147483647;
				box-shadow: -6px 0 26px rgba(0,0,0,0.6);
				display: flex;
				flex-direction: column;
				overflow: hidden;
				font-size: 13px;
				transition: transform 200ms ease;
                transform: translateX(0);
			}
			#cufpc-panel-latest.cufpc-collapsed {
                transform: translateX(calc(100% - ${COLLAPSE_HANDLE_WIDTH}px));
			}
            #cufpc-panel-latest.cufpc-collapsed:hover {
                transform: translateX(0);
            }
            #cufpc-panel-latest.cufpc-resizing {
                transition: none !important;
            }
            #cufpc-resizer {
                position: absolute;
                left: -2px;
                top: 0;
                bottom: 0;
                width: 5px;
                cursor: ew-resize;
                z-index: 10;
            }
			#cufpc-topbar { display:flex; justify-content:space-between; align-items:center; padding:6px 8px; border-bottom:1px solid rgba(255,255,255,0.03); cursor:default; user-select:none; }
			#cufpc-controls button { background:transparent; border:1px solid rgba(255,255,255,0.03); color:#ddd; padding:4px 6px; margin-left:6px; border-radius:6px; cursor:pointer; }
			#cufpc-body { padding:8px; overflow:auto; flex:1 1 auto; transition: opacity 120ms ease; }
			#cufpc-meta { font-size:12px; opacity:0.85; margin-bottom:8px; display:flex; gap:8px; flex-wrap:wrap; }
			.cufpc-answer-card { border:1px solid rgba(255,255,255,0.03); padding:8px; border-radius:8px; margin-bottom:8px; background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent); font-size:14px; line-height:1.6; }
			.cufpc-empty { color:#f39c12; font-size:13px; padding:10px; }
			.cufpc-debug { margin-top:8px; background:rgba(255,255,255,0.02); padding:8px; border-radius:6px; font-family:monospace; font-size:12px; white-space:pre-wrap; max-height:320px; overflow:auto; }
			#cufpc-raw { margin-top:8px; background:rgba(255,255,255,0.02); padding:8px; border-radius:6px; max-height:320px; overflow:auto; white-space:pre-wrap; font-family:monospace; font-size:12px; }
			.cufpc-key { color:#9cdcfe; font-family:monospace; }
			.cufpc-string { color:#b5f4b5; }
			.cufpc-null { color:#999; }
			.cufpc-answer-content { white-space: pre-wrap; font-family: monospace; font-size: 13px; }
			.cufpc-answer-raw { margin-top:6px; font-size:12px; opacity:0.9; color:#bdbdbd; border-top:1px dashed rgba(255,255,255,0.03); padding-top:6px; }
			#cufpc-answers math { display: inline-block; vertical-align: middle; }
			.cufpc-equation {
				background: rgba(255,255,255,0.05);
				padding: 2px 6px;
				border-radius: 4px;
				font-family: monospace;
				border: 1px solid rgba(255,255,255,0.1);
				margin: 0 2px;
				display: inline-block;
			}
		`;
		document.documentElement.appendChild(style);
		document.documentElement.appendChild(panel);

        // --- Resizing Logic ---
        const resizer = panel.querySelector('#cufpc-resizer');
        resizer.addEventListener('mousedown', e => {
            e.preventDefault();
            panel.classList.add('cufpc-resizing');
            const startX = e.clientX;
            const startWidth = panel.offsetWidth;

            const doDrag = (moveEvent) => {
                const newWidth = startWidth - (moveEvent.clientX - startX);
                if (newWidth > 200) { // Min width
                    panel.style.width = newWidth + 'px';
                }
            };

            const stopDrag = () => {
                panel.classList.remove('cufpc-resizing');
                window.removeEventListener('mousemove', doDrag);
                window.removeEventListener('mouseup', stopDrag);
                localStorage.setItem('cufpc-panel-width', panel.style.width);
            };

            window.addEventListener('mousemove', doDrag);
            window.addEventListener('mouseup', stopDrag);
        });


		panel.querySelector('#cufpc-toggle').addEventListener('click', (e) => { e.stopPropagation(); togglePanel(); });
		panel.querySelector('#cufpc-copy').addEventListener('click', (e) => {
			e.stopPropagation();
			const raw = panel.dataset.latestRaw || '';
			if (!raw) return alert('No latest capture yet');
			navigator.clipboard?.writeText(raw).catch(()=>alert('Copying failed'));
		});
		panel.querySelector('#cufpc-download').addEventListener('click', (e) => {
			e.stopPropagation();
			const raw = panel.dataset.latestRaw || '';
			if (!raw) return alert('No latest capture yet');
			const blob = new Blob([raw], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `ContentUnitForPlayableContent-latest-${Date.now()}.json`;
			a.click();
			URL.revokeObjectURL(url);
		});
		panel.querySelector('#cufpc-raw-toggle').addEventListener('click', (e) => {
			e.stopPropagation();
			const rawEl = panel.querySelector('#cufpc-raw');
			rawEl.style.display = rawEl.style.display === 'none' ? 'block' : 'none';
		});
		panel.querySelector('#cufpc-topbar').addEventListener('click', (e) => {
			if (e.target && e.target.closest && e.target.closest('#cufpc-controls')) return;
			togglePanel();
		});

		const answersEl = panel.querySelector('#cufpc-answers');
		const empty = document.createElement('div');
		empty.className = 'cufpc-empty';
		empty.textContent = 'No captures yet — waiting for responses containing data.contentUnit or operationName.';
		answersEl.appendChild(empty);

		return panel;
	}

    // Hotkey to toggle panel collapsed state
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            togglePanel();
        }
    });

	function decodeHtmlEntities(s) {
		if (s === null || s === undefined) return '';
		try {
			const d = document.createElement('div');
			d.innerHTML = s;
			return d.textContent || d.innerText || '';
		} catch (e) { return String(s); }
	}

	function tryParsePossiblyEscapedJson(s) {
		if (!s || typeof s !== 'string') return null;
		let candidate = s;
		for (let i = 0; i < 4; i++) {
			const decoded = decodeHtmlEntities(candidate);
			const unescaped = decoded.replace(/\\+"/g, '"').replace(/\\+'/g, "'");
			candidate = unescaped.trim();

			if (candidate.startsWith('{') || candidate.startsWith('[')) {
				try { return JSON.parse(candidate); } catch (e) { /* keep trying */ }
			}
			if (!candidate.includes('<') && !candidate.includes('&')) break;
		}
		return null;
	}

	function extractAnswersFromJson(j) {
		const results = [];
		try {
			const cu = j?.data?.contentUnit;
			const sets = cu && Array.isArray(cu.contentSets) ? cu.contentSets : (cu?.contentSets ? [cu.contentSets] : []);
			for (const s of sets) {
				const contentArr = Array.isArray(s?.content) ? s.content : (s?.content ? [s.content] : []);
				for (const c of contentArr) {
					const portable = c?.playerPayload?.portableTextContent;
					if (portable?.answer !== undefined) {
						if (Array.isArray(portable.answer)) results.push(...portable.answer);
						else results.push(portable.answer);
					}
				}
			}
			return { answers: results };
		} catch (e) {
			return { answers: [], debug: { error: String(e) } };
		}
	}

	// Renders portable text block (custom for Noordhoff)
	function renderPortableText(block) {
		if (!block || !block._type || !Array.isArray(block.children)) return null;

		const container = document.createElement(block._type === 'p' ? 'p' : 'div');
		container.style.margin = '0';

		block.children.forEach(child => {
			if (child._type === 'span' && typeof child.text === 'string') {
				const textParts = child.text.split(/(\n)/);
				textParts.forEach(part => {
					if (part === '\n') {
						container.appendChild(document.createElement('br'));
						return;
					}
					if (part) {
						let finalElement = document.createTextNode(part);
						if (child.marks && child.marks.length > 0) {
							child.marks.slice().reverse().forEach(mark => {
								let wrapper;
								switch (mark) {
									case 'italic': wrapper = document.createElement('i'); break;
									case 'sub': wrapper = document.createElement('sub'); break;
									case 'sup': wrapper = document.createElement('sup'); break;
									case 'strong': wrapper = document.createElement('strong'); break;
									default: wrapper = document.createElement('span');
								}
								wrapper.appendChild(finalElement);
								finalElement = wrapper;
							});
						}
						container.appendChild(finalElement);
					}
				});
			} else if (child._type === 'equationInline' && typeof child.equation === 'string') {
				const equationSpan = document.createElement('span');
				equationSpan.className = 'cufpc-equation';
                // FIX: Use innerHTML to render the MathML tags, not textContent which escapes them.
				equationSpan.innerHTML = child.equation.replace(/·/g, '×');
				container.appendChild(equationSpan);
			}
		});
		return container;
	}

	function renderAnswerCard(ans, idx) {
		const card = document.createElement('div');
		card.className = 'cufpc-answer-card';

        const typesetAndReturn = (cardElement) => {
            if (cardElement.innerHTML.includes('<math') && window.MathJax?.typesetPromise) {
                setTimeout(() => {
                    try {
                        window.MathJax.typesetPromise([cardElement]).catch(err => console.error('CUFPC-latest: MathJax typeset failed:', err));
                    } catch (e) { console.error('CUFPC-latest: Error calling MathJax:', e); }
                }, 50);
            }
            return cardElement;
        };

		const hdr = document.createElement('div');
		hdr.textContent = `answer[${idx}]`;
		hdr.style.fontWeight = '700';
		hdr.style.marginBottom = '6px';
		hdr.style.fontSize = '13px';
		card.appendChild(hdr);

		const contentContainer = document.createElement('div');

		try {
			if (typeof ans === 'object' && ans !== null && ans._type === 'p' && Array.isArray(ans.children)) {
				const renderedBlock = renderPortableText(ans);
				if (renderedBlock) {
					contentContainer.appendChild(renderedBlock);
                    card.appendChild(contentContainer);
					return typesetAndReturn(card);
				}
			}

			if (typeof ans === 'string') {
				const parsed = tryParsePossiblyEscapedJson(ans);
				if (parsed !== null) return renderAnswerCard(parsed, idx);

				let decoded = ans;
				for (let i = 0; i < 3; i++) {
					const next = decodeHtmlEntities(decoded);
					if (next === decoded) break;
					decoded = next;
				}
                contentContainer.innerHTML = decoded.replace(/\n/g, '<br>');
                card.appendChild(contentContainer);
				return typesetAndReturn(card);
			}

			if (typeof ans === 'object' && ans !== null) {
				const pre = document.createElement('pre');
				pre.style.whiteSpace = 'pre-wrap';
                pre.style.fontFamily = 'monospace';
                pre.style.fontSize = '12px';
				pre.style.margin = '0';
				try { pre.textContent = JSON.stringify(ans, null, 2); } catch (e) { pre.textContent = String(ans); }
				contentContainer.appendChild(pre);
                card.appendChild(contentContainer);
				return typesetAndReturn(card);
			}

			contentContainer.textContent = String(ans);
            card.appendChild(contentContainer);
			return typesetAndReturn(card);
		} catch (e) {
			const fail = document.createElement('pre');
			fail.style.whiteSpace = 'pre-wrap';
			fail.textContent = `Failed to render answer: ${String(e)}\n\nraw: ${String(ans)}`;
			card.appendChild(fail);
			return typesetAndReturn(card);
		}
	}

	function renderLatest(info) {
		const p = ensurePanel();
		p.dataset.latestRaw = info.rawText || '';

		const meta = p.querySelector('#cufpc-meta');
		const answersEl = p.querySelector('#cufpc-answers');
		const debugEl = p.querySelector('#cufpc-debug');
		const rawEl = p.querySelector('#cufpc-raw');

		meta.innerHTML = '';
		answersEl.innerHTML = '';
		debugEl.style.display = 'none';
		// Preserve raw view state
        // rawEl.style.display = 'none';

		const t = document.createElement('span'); t.textContent = new Date(info.t).toLocaleString(); meta.appendChild(t);
		const u = document.createElement('span'); u.textContent = info.url ? (info.url.length > 80 ? info.url.slice(0,80) + '…' : info.url) : ''; meta.appendChild(u);
		const st = document.createElement('span'); st.textContent = `status: ${info.status || ''}`; meta.appendChild(st);

		let extracted = { answers: [], debug: {} };
		if (info.json) extracted = extractAnswersFromJson(info.json);
		else extracted = { answers: [], debug: { note: 'response is not valid JSON' } };

		if (extracted.answers?.length > 0) {
			extracted.answers.forEach((ans, idx) => {
				const card = renderAnswerCard(ans, idx);
				answersEl.appendChild(card);
			});
		} else {
            const empty = document.createElement('div');
            empty.className = 'cufpc-empty';
            empty.textContent = 'No answers found at the expected path.';
            answersEl.appendChild(empty);
            debugEl.textContent = `Debug Info:\n` + JSON.stringify(extracted.debug || { note: 'No debug info available.'}, null, 2);
            debugEl.style.display = 'block';
        }
        rawEl.textContent = info.rawText && info.rawText.length > MAX_RAW_PREVIEW ? info.rawText.slice(0, MAX_RAW_PREVIEW) + '\n\n…(truncated)' : info.rawText || '';
	}

	function bodyHasTargetOperation(bodyText) {
		if (!bodyText) return false;
		try {
			const data = JSON.parse(bodyText);
			return data?.operationName === TARGET_OPERATION;
		} catch (e) {
			return bodyText.includes(`"operationName":"${TARGET_OPERATION}"`);
		}
	}

	function jsonLooksLikeContentUnit(obj) {
		return !!(obj?.data?.contentUnit);
	}

	const _fetch = window.fetch;
	window.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : input?.url;
        let bodyPromise;
        if (init?.body) {
            try { bodyPromise = Promise.resolve(init.body); } catch(e) { bodyPromise = Promise.resolve(null); }
        } else {
            bodyPromise = Promise.resolve(null);
        }

        return bodyPromise.then(bodyText => {
            const thinksItShouldWatch = bodyHasTargetOperation(bodyText);
            return _fetch.apply(this, arguments).then(response => {
                try {
                    const cloned = response.clone();
                    cloned.text().then(txt => {
                        let parsed = null;
                        try { parsed = JSON.parse(txt); } catch (e) {}
                        if (thinksItShouldWatch || jsonLooksLikeContentUnit(parsed)) {
                            renderLatest({ t: Date.now(), url, status: response.status, json: parsed, rawText: txt });
                        }
                    }).catch(()=>{});
                } catch (e) {}
                return response;
            });
        });
	};

	const XHRProto = XMLHttpRequest.prototype;
	const _open = XHRProto.open;
	const _send = XHRProto.send;

	XHRProto.open = function(method, url) {
		this._cufpc_url = url;
		return _open.apply(this, arguments);
	};

	XHRProto.send = function(body) {
		this.addEventListener('load', () => {
			try {
                const thinksItShouldWatch = bodyHasTargetOperation(body);
				const txt = this.responseText;
				let parsed = null;
				try { parsed = txt ? JSON.parse(txt) : null; } catch (e) {}
				if (thinksItShouldWatch || jsonLooksLikeContentUnit(parsed)) {
					renderLatest({ t: Date.now(), url: this._cufpc_url, status: this.status, json: parsed, rawText: txt });
				}
			} catch (e) {}
		});
		return _send.apply(this, arguments);
	};

	setTimeout(() => ensurePanel(), 500);
	console.info('CUFPC-latest userscript active — capturing operationName=' + TARGET_OPERATION + ' (MathML rendering enabled via MathJax)');
})();