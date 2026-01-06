// ==UserScript==
// @name         SillyTavern Mobile Suite (Smart Selector + Gemini Manager)
// @namespace    http://tampermonkey.net/
// @version      26.4
// @description  Tích hợp: Chọn Char/Scene & Quản lý Key Gemini & Auto Set First Message + Reset Chat.
// @author       You
// @match        http://127.0.0.1:8000/*
// @match        https://aistudio.google.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.cohere.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560645/SillyTavern%20Mobile%20Suite%20%28Smart%20Selector%20%2B%20Gemini%20Manager%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560645/SillyTavern%20Mobile%20Suite%20%28Smart%20Selector%20%2B%20Gemini%20Manager%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- KIỂM TRA MÔI TRƯỜNG ---
    const isST = location.href.includes('127.0.0.1:8000');
    const isGoogle = location.href.includes('aistudio.google.com');

    // =================================================================================
    // PHẦN 1: GEMINI KEY SNIFFER (CHỈ CHẠY TRÊN GOOGLE AI STUDIO)
    // =================================================================================
    if (isGoogle) {
        console.log('💎 [Gemini Suite] Sniffer Active...');
        const DB_KEYS = 'tm_st_keys_v18';
        let capturedRaw = new Set();
        let syncTimeout = null;

        GM_addStyle(`
            .tm-toast {
                position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
                background: #2ecc71; color: white; padding: 12px 25px;
                border-radius: 50px; font-family: sans-serif; font-weight: bold;
                z-index: 9999999; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                opacity: 0; transition: all 0.5s; pointer-events: none;
            }
            .tm-toast.show { opacity: 1; bottom: 50px; }
        `);

        function showGoogleToast(msg) {
            let t = document.querySelector('.tm-toast') || document.createElement('div');
            t.className = 'tm-toast';
            document.body.appendChild(t);
            t.textContent = msg;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 3000);
        }

        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener('load', () => {
                const txt = this.responseText;
                if (txt && txt.includes('AIza')) {
                    const matches = txt.match(/AIza[0-9A-Za-z-_]{35}/g);
                    if (matches) {
                        matches.forEach(k => capturedRaw.add(k));
                        clearTimeout(syncTimeout);
                        syncTimeout = setTimeout(smartSync, 2000);
                    }
                }
            });
            originalOpen.apply(this, arguments);
        };

        function smartSync() {
            const currentStoredKeys = GM_getValue(DB_KEYS, []);
            const rawKeys = Array.from(capturedRaw);
            let newKeysAdded = 0;
            const tempMapping = [];
            const mappedSuffixes = new Set();

            document.querySelectorAll('tr, div[role="row"]').forEach(row => {
                const text = row.innerText;
                const sMatch = text.match(/\.\.\.([0-9A-Za-z-_]{4})/);
                if (sMatch) {
                    const suffix = sMatch[1];
                    const fullKey = rawKeys.find(k => k.endsWith(suffix));
                    if (fullKey) {
                        const name = text.split('\n')[0].trim();
                        tempMapping.push({ key: fullKey, name: name, suffix: suffix });
                        mappedSuffixes.add(suffix);
                    }
                }
            });

            rawKeys.forEach(k => {
                const suffix = k.slice(-4);
                if (!mappedSuffixes.has(suffix)) {
                    tempMapping.push({ key: k, name: 'System/Hidden', suffix: suffix });
                }
            });

            const updatedKeys = [...currentStoredKeys];
            tempMapping.forEach(newItem => {
                const exists = updatedKeys.some(oldItem => oldItem.key === newItem.key);
                if (!exists) {
                    updatedKeys.push(newItem);
                    newKeysAdded++;
                }
            });

            if (newKeysAdded > 0) {
                GM_setValue(DB_KEYS, updatedKeys);
                showGoogleToast(`✅ Đã thêm ${newKeysAdded} Key mới (Tổng: ${updatedKeys.length})`);
            }
        }
        return;
    }

    // =================================================================================
    // PHẦN 2: SILLY TAVERN INTEGRATION (CHẠY TRÊN ST)
    // =================================================================================
    if (isST) {
        // --- CONFIG ---
        const DEFAULT_COHERE_KEY = "G8bhf4y7cgSeOExs0MTwfLAXm4MRn1kR1C9J7VeH";
        const DEFAULT_COHERE_MODEL = "command-a-03-2025";

        // --- API COHERE ---
        function callCohereExtraction(text) {
            return new Promise((resolve, reject) => {
                const apiKey = GM_getValue("st_cohere_key", DEFAULT_COHERE_KEY);
                const model = GM_getValue("st_cohere_model", DEFAULT_COHERE_MODEL);
                const prompt = `You are a smart analyzer. Extract a Name or Title.
RULES: 1. Multiple Characters: Join names with " - ". 2. Single Character: Return name. 3. Scenario: Short descriptive title (Max 5 words).
OUTPUT: ONLY the string. No quotes.
TEXT: ${text.substring(0, 4000)}`;

                GM_xmlhttpRequest({
                    method: "POST", url: "https://api.cohere.com/v2/chat",
                    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json", "Client-Name": "ST_Userscript_Smart" },
                    data: JSON.stringify({ model: model, messages: [{ role: "user", content: prompt }], temperature: 0.2, max_tokens: 50 }),
                    onload: (res) => {
                        if (res.status >= 200 && res.status < 300) {
                            try { resolve(JSON.parse(res.responseText).message?.content?.[0]?.text?.trim() || "Unknown"); } catch (e) { reject("Lỗi JSON"); }
                        } else reject(`HTTP ${res.status}`);
                    }, onerror: () => reject("Lỗi kết nối")
                });
            });
        }

        function fetchCohereModels() {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET", url: "https://api.cohere.com/v1/models",
                    headers: { "Authorization": `Bearer ${GM_getValue("st_cohere_key", DEFAULT_COHERE_KEY)}`, "Content-Type": "application/json" },
                    onload: (res) => {
                        if (res.status === 200) try { resolve(JSON.parse(res.responseText).models.sort((a,b) => a.name.localeCompare(b.name))); } catch (e) { reject("Lỗi parse"); } else reject(res.status);
                    }, onerror: () => reject("Lỗi mạng")
                });
            });
        }

        function showModelSelector(models) {
            const old = document.getElementById('st-model-modal'); if (old) old.remove();
            const currentModel = GM_getValue("st_cohere_model", DEFAULT_COHERE_MODEL);
            GM_addStyle(`#st-model-modal{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);z-index:999999;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(2px)}.st-modal-box{background:#1e1e1e;border:1px solid #444;display:flex;flex-direction:column;border-radius:12px;overflow:hidden;width:400px;max-height:80vh}.st-modal-header{padding:15px;border-bottom:1px solid #333;font-weight:bold;color:#fff;background:#252525;display:flex;justify-content:space-between}.st-modal-list{overflow-y:auto;flex-grow:1}.st-model-item{padding:14px;border-bottom:1px solid #2a2a2a;color:#ccc;cursor:pointer;display:flex;justify-content:space-between}.st-model-item.active{color:#fff;font-weight:bold;background:#2e7d32}`);
            const modal = document.createElement('div'); modal.id = 'st-model-modal';
            let listHtml = '';
            models.forEach(m => { listHtml += `<div class="st-model-item ${m.name===currentModel?'active':''}" data-name="${m.name}"><span>${m.name}</span></div>`; });
            modal.innerHTML = `<div class="st-modal-box"><div class="st-modal-header"><span>Chọn Model</span><div onclick="this.closest('#st-model-modal').remove()" style="cursor:pointer">✕</div></div><div class="st-modal-list">${listHtml}</div></div>`;
            document.body.appendChild(modal);
            modal.querySelectorAll('.st-model-item').forEach(i => i.onclick = () => { GM_setValue("st_cohere_model", i.getAttribute('data-name')); showSelectorToast(`✅ Saved: ${i.getAttribute('data-name')}`, 'success'); modal.remove(); });
        }

        // --- MENU ---
        let registeredMenuIds = [];
        function rebuildMasterMenu() {
            registeredMenuIds.forEach(id => GM_unregisterMenuCommand(id)); registeredMenuIds = [];
            const mode = GM_getValue("st_mobile_mode", 'auto');
            registeredMenuIds.push(GM_registerMenuCommand(mode === 'auto' ? "🔄 Chế độ: AUTO" : "🔄 Chế độ: MANUAL", () => { GM_setValue("st_mobile_mode", mode === 'auto' ? 'manual' : 'auto'); rebuildMasterMenu(); showSelectorToast("Đã đổi chế độ", 'info'); }));
            registeredMenuIds.push(GM_registerMenuCommand("✏️ Nhập tên Manual", () => { const n = prompt("Tên:", GM_getValue("st_mobile_manual_name", '')); if(n!==null) GM_setValue("st_mobile_manual_name", n.trim()); }));
            registeredMenuIds.push(GM_registerMenuCommand("🔑 Cohere API Key", () => { const k = prompt("Cohere Key:", GM_getValue("st_cohere_key", DEFAULT_COHERE_KEY)); if(k!==null) GM_setValue("st_cohere_key", k.trim()); }));
            registeredMenuIds.push(GM_registerMenuCommand("⚙️ Cohere Model", () => fetchCohereModels().then(showModelSelector)));
            registeredMenuIds.push(GM_registerMenuCommand("🔑 Gemini Manager", toggleGeminiManager));
        }

        // --- HELPERS ---
        const KEY_MODE = "st_mobile_mode", KEY_MANUAL_NAME = "st_mobile_manual_name", KEY_CACHE_NAME = "st_mobile_cache_name";
        const selState = { char: { content: null, domElement: null }, scene: { content: null, domElement: null }, isRunning: false };
        const sleep = ms => new Promise(r => setTimeout(r, ms));

        function showSelectorToast(msg, type = 'info') {
            let toast = document.getElementById('st-mobile-toast');
            if (!toast) { toast = document.createElement('div'); toast.id = 'st-mobile-toast'; document.body.appendChild(toast); }
            const colors = { success: '#2e7d32', error: '#c62828', warn: '#ef6c00', process: '#1565c0', analyzing: '#8e44ad', info: '#333' };
            toast.textContent = msg; toast.style.backgroundColor = colors[type] || '#333';
            toast.className = 'show';
            if (toast.timeout) clearTimeout(toast.timeout); toast.timeout = setTimeout(() => { toast.className = ''; }, 3000);
        }

        GM_addStyle(`
            #st-mobile-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); padding: 10px 20px; border-radius: 20px; color: white; font-weight: bold; font-family: sans-serif; font-size: 14px; z-index: 99999; box-shadow: 0 4px 10px rgba(0,0,0,0.5); transition: transform 0.3s ease; max-width: 90%; text-align: center; pointer-events: none; }
            #st-mobile-toast.show { transform: translateX(-50%) translateY(0); }
            .st-btn-custom { cursor: pointer; display: inline-flex; justify-content: center; align-items: center; transition: color 0.2s, transform 0.1s; margin-right: 2px; }
            .st-btn-custom:hover { color: #fff; text-shadow: 0 0 5px white; } .st-btn-custom:active { transform: scale(0.9); }
            .st-active-char { color: #4caf50 !important; text-shadow: 0 0 8px #4caf50; }
            .st-active-scene { color: #ff9800 !important; text-shadow: 0 0 8px #ff9800; }
            .st-analyzing { color: #d500f9 !important; animation: st-spin 1s infinite linear; }
            @keyframes st-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            body.st-mode-chat .st-grp-creator { display: none !important; }
            body.st-mode-creator .st-btn-chat { display: none !important; }
            .mes_buttons .st-grp-creator { display: inline-flex; gap: 5px; margin-right: 5px; border-right: 1px solid #444; padding-right: 5px; }
        `);

        // --- LOGIC ---
        function startDynamicVisibilityLoop() {
            setInterval(() => {
                const nameH2 = document.querySelector('h2.interactable');
                const isCreator = (nameH2 ? nameH2.innerText : document.querySelector('#right-nav-panel .ch_name')?.innerText || '').trim().toLowerCase() === 'char creator';
                document.body.classList.toggle('st-mode-creator', isCreator);
                document.body.classList.toggle('st-mode-chat', !isCreator);
            }, 500);
        }

        function getTargetName() {
            if (GM_getValue(KEY_MODE, 'auto') === 'manual') { const n = GM_getValue(KEY_MANUAL_NAME, '').trim(); return n ? { name: n, source: 'manual' } : { name: null, error: "Chưa nhập tên thủ công!" }; }
            const c = GM_getValue(KEY_CACHE_NAME, null); return c ? { name: c, source: 'cache' } : { name: null, error: "Chưa chọn Char!" };
        }

        async function getRawContentFromMessage(mesDiv) {
            const existing = mesDiv.querySelector('textarea.edit_textarea'); if (existing) return existing.value;
            const editBtn = mesDiv.querySelector('.mes_edit'); if (!editBtn) return mesDiv.querySelector('.mes_text')?.innerText || "";
            editBtn.click();
            const area = await new Promise(r => { let i=0, int=setInterval(() => { const el=mesDiv.querySelector('textarea.edit_textarea'); if(el){clearInterval(int);r(el);} if(++i>25){clearInterval(int);r(null);} }, 100); });
            if (!area) return "";
            const val = area.value;
            const btns = mesDiv.querySelector('.mes_edit_buttons');
            if(btns) { let x=Array.from(btns.querySelectorAll('.mes_button')).find(b=>b.innerHTML.includes('fa-times')||b.title?.includes('cancel')); if(!x && btns.children.length) x=btns.lastElementChild; if(x) x.click(); }
            return val;
        }

        async function forceAnalyzeName(btn, content) {
            if (selState.isRunning) return;
            btn.classList.add('st-analyzing'); showSelectorToast("🧠 Đang phân tích...", "analyzing");
            try { const n = await callCohereExtraction(content); if(n && n!=="Unknown") { GM_setValue(KEY_CACHE_NAME, n); showSelectorToast(`✅ Tên: ${n}`, 'success'); } else showSelectorToast("⚠️ Không tìm thấy tên!", 'warn'); }
            catch(e) { showSelectorToast("❌ Lỗi API!", 'error'); } finally { btn.classList.remove('st-analyzing'); }
        }

        async function handleSelection(type, btn, content) {
            if (selState.isRunning) return;
            if (selState[type].domElement === btn) {
                btn.classList.remove(type==='char'?'st-active-char':'st-active-scene');
                selState[type].content = null; selState[type].domElement = null;
                showSelectorToast(`Đã bỏ chọn ${type}`, 'info'); return;
            }
            if(selState[type].domElement) selState[type].domElement.classList.remove(type==='char'?'st-active-char':'st-active-scene');
            selState[type].content = content; selState[type].domElement = btn;

            if (type === 'char') {
                if (GM_getValue(KEY_MODE, 'auto') === 'manual') { btn.classList.add('st-active-char'); showSelectorToast(`✅ Manual: ${GM_getValue(KEY_MANUAL_NAME)}`, 'success'); return; }
                const c = GM_getValue(KEY_CACHE_NAME, null);
                if (c) { btn.classList.add('st-active-char'); showSelectorToast(`✅ Cache: ${c}`, 'success'); return; }
                btn.classList.add('st-analyzing'); showSelectorToast("🧠 AI đang tìm tên...", "analyzing");
                try {
                    const n = await callCohereExtraction(content);
                    btn.classList.remove('st-analyzing'); btn.classList.add('st-active-char');
                    if (n && n !== "Unknown") { GM_setValue(KEY_CACHE_NAME, n); showSelectorToast(`✅ Đã định danh: ${n}`, 'success'); }
                    else showSelectorToast("⚠️ Không tìm thấy tên!", 'warn');
                } catch (e) { btn.classList.remove('st-analyzing'); showSelectorToast("❌ Lỗi API", 'error'); }
            } else { btn.classList.add('st-active-scene'); showSelectorToast("✅ Đã lấy Scene", 'success'); }
        }

        async function runAutomation() {
            if (selState.isRunning) return;
            const t = getTargetName(); if (!t.name) return showSelectorToast("❌ " + t.error, 'error');
            if (!selState.char.content && !selState.scene.content) return showSelectorToast("⚠️ Chưa chọn nội dung!", 'warn');
            selState.isRunning = true; showSelectorToast(`⏳ Import: "${t.name}"...`, 'process');
            try {
                document.getElementById('rightNavDrawerIcon')?.click(); await sleep(300);
                document.getElementById('rm_button_characters')?.click(); await sleep(400);
                let found = false;
                const items = document.querySelectorAll('.character_select');
                for (const i of items) if (i.querySelector('.ch_name')?.innerText.trim().toLowerCase() === t.name.toLowerCase()) { i.click(); found = true; break; }
                if (!found) {
                    showSelectorToast(`➕ Tạo mới: ${t.name}`, 'process');
                    document.getElementById('rm_button_create')?.click(); await sleep(500);
                    const i = document.getElementById('character_name_pole'); if(i) { Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(i, t.name); i.dispatchEvent(new Event('input', {bubbles:true})); }
                }
                await sleep(600);
                if (selState.char.content) { const a = document.getElementById('description_textarea'); if(a) { Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(a, selState.char.content); a.dispatchEvent(new Event('input', {bubbles:true})); } }
                if (selState.scene.content) { const a = document.getElementById('firstmessage_textarea'); if(a) { Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(a, selState.scene.content); a.dispatchEvent(new Event('input', {bubbles:true})); } }
                if (!found) { await sleep(500); document.getElementById('create_button_label')?.click(); }
                showSelectorToast(`✅ Xong!`, 'success');
                if(selState.char.domElement) selState.char.domElement.classList.remove('st-active-char');
                if(selState.scene.domElement) selState.scene.domElement.classList.remove('st-active-scene');
                selState.char.content=null; selState.scene.content=null; selState.char.domElement=null; selState.scene.domElement=null;
            } catch (e) { console.error(e); showSelectorToast("❌ Lỗi Auto", 'error'); } finally { selState.isRunning = false; }
        }

        // --- BUTTONS ---
        function addButtons(mesDiv) {
            const mesButtons = mesDiv.querySelector('.mes_buttons');
            if (!mesButtons || mesButtons.querySelector('.st-custom-group')) return;

            const container = document.createElement('div');
            container.className = 'st-custom-group'; container.style.display = 'inline-flex'; container.style.alignItems = 'center';

            const creatorGroup = document.createElement('div'); creatorGroup.className = 'st-grp-creator';
            const mkBtn = (cls, icon, title, cb) => {
                const b = document.createElement('div'); b.className = `mes_button st-btn-custom ${cls} fa-solid ${icon} interactable`;
                b.title = title; b.onclick = (e) => { e.stopPropagation(); cb(b); }; return b;
            };

            creatorGroup.append(
                mkBtn('st-btn-re', 'fa-rotate', 'Re-analyze', () => forceAnalyzeName(creatorGroup.firstChild, mesDiv.querySelector('.mes_text').innerText.trim())),
                mkBtn('st-btn-char', 'fa-user-tag', 'Character', () => handleSelection('char', creatorGroup.children[1], mesDiv.querySelector('.mes_text').innerText.trim())),
                mkBtn('st-btn-scene', 'fa-scroll', 'Scene', async (b) => {
                    if (selState.scene.domElement === b) { handleSelection('scene', b, null); return; }
                    b.classList.add('st-analyzing'); const raw = await getRawContentFromMessage(mesDiv); b.classList.remove('st-analyzing');
                    if (raw) handleSelection('scene', b, raw); else showSelectorToast("Lỗi lấy Text", "warn");
                }),
                mkBtn('st-btn-import', 'fa-file-import', 'Import', () => runAutomation())
            );

            // LOGIC MỚI: SET FIRST MESSAGE + AUTO RESET
            const btnFirst = mkBtn('st-btn-chat', 'fa-quote-left', 'Set First Message & Reset', async () => {
                const text = await getRawContentFromMessage(mesDiv); if (!text) return;
                const area = document.getElementById('firstmessage_textarea');
                if (area) {
                    Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(area, text);
                    area.dispatchEvent(new Event('input', { bubbles: true }));
                    showSelectorToast("📝 Đã set First Message. Đang reset...", 'process');

                    // AUTO RESET SEQUENCE
                    const btnStart = document.getElementById('option_start_new_chat');
                    if (btnStart) {
                        btnStart.click(); await sleep(500); // Wait popup
                        const chk = document.getElementById('del_chat_checkbox');
                        if (chk && !chk.checked) chk.click(); await sleep(300); // Check delete
                        const yesBtn = Array.from(document.querySelectorAll('.popup-button-ok')).find(b => b.offsetParent !== null); // Find visible Yes
                        if (yesBtn) { yesBtn.click(); showSelectorToast("✅ Đã tạo chat mới!", 'success'); }
                    }
                } else showSelectorToast("⚠️ Hãy mở thẻ nhân vật trước!", 'warn');
            });

            container.appendChild(creatorGroup); container.appendChild(btnFirst);
            const edit = mesButtons.querySelector('.mes_edit');
            if (edit) mesButtons.insertBefore(container, edit); else mesButtons.appendChild(container);
        }

        // --- GEMINI ---
        const DB = { KEYS: 'tm_st_keys_v18', IDX: 'tm_st_idx_v18', LIMITS: 'tm_st_limits_v18' };
        let gemKeys = [], gemIdx = 0, gemLimits = {}, gemIsLocked = false, gemIsGenerating = false;
        const TARGET_SOURCE = 'makersuite';

        const loadGeminiData = () => { gemKeys = GM_getValue(DB.KEYS, []); gemIdx = GM_getValue(DB.IDX, 0); gemLimits = GM_getValue(DB.LIMITS, {}); };
        const saveGeminiData = () => { GM_setValue(DB.KEYS, gemKeys); GM_setValue(DB.IDX, gemIdx); GM_setValue(DB.LIMITS, gemLimits); };

        const GemCore = {
            async connect(apiKey) {
                const elSource = document.getElementById('chat_completion_source'); if (!elSource || elSource.value !== TARGET_SOURCE) return;
                GemUI.status("🎬 Đang nạp key...", "yellow");
                try {
                    const setBtn = document.querySelector('div[data-key="api_key_makersuite"]'); if (setBtn) setBtn.click(); await sleep(500);
                    const del = document.querySelector('button[data-action="delete-secret"]'); if (del) { del.click(); await sleep(400); const y = document.querySelector('.popup-button-ok'); if(y) y.click(); await sleep(400); const o = document.querySelector('.popup-button-ok'); if(o) o.click(); await sleep(400); }
                    const input = document.querySelector('#api_key_makersuite'); if(input){ Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(input, apiKey); input.dispatchEvent(new Event('input', {bubbles:true})); await sleep(100); input.dispatchEvent(new Event('change', {bubbles:true})); }
                    await sleep(500); document.getElementById('api_button_openai')?.click(); GemUI.status("✅ Key Ready!", "#2ecc71"); GemUI.render();
                } catch (e) { console.error(e); GemUI.status("❌ Lỗi nạp key", "red"); }
            }
        };

        const GemUI = {
            init() {
                GM_addStyle(`#tm-manager{position:fixed;top:15vh;left:50%;transform:translateX(-50%);width:85%;max-width:380px;max-height:60vh;background:#111;color:#eee;border:1px solid #444;border-radius:12px;z-index:20001;padding:0;font-family:sans-serif;box-shadow:0 10px 40px rgba(0,0,0,0.9);display:none;flex-direction:column}.tm-header-row{flex-shrink:0;display:flex;justify-content:space-between;align-items:center;padding:8px 15px;border-bottom:1px solid #333;background:#1a1a1a}.tm-title{font-weight:bold;color:#3498db;font-size:14px}.tm-close-btn{font-size:20px;color:#e74c3c;cursor:pointer}.tm-body{padding:8px;display:flex;flex-direction:column;overflow:hidden;height:100%}.tm-list{flex-grow:1;overflow-y:auto;background:#000;border:1px solid #333;margin-bottom:8px;border-radius:5px}.tm-item{padding:8px 10px;border-bottom:1px solid #222;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:13px}.tm-item.active{background:#1a5276;border-left:3px solid #3498db}.tm-tag{background:#922b21;color:white;font-size:9px;padding:1px 4px;border-radius:3px;margin-left:3px}.tm-btn{width:100%;padding:8px;border:none;border-radius:5px;color:white;font-weight:bold;cursor:pointer;margin-top:5px;font-size:13px}#tm-status-text{text-align:center;font-size:11px;margin-top:5px;color:#888;font-style:italic}`);
                const p = document.createElement('div'); p.id = 'tm-manager';
                p.innerHTML = `<div class="tm-header-row"><div class="tm-title">Gemini Manager <span id="tm-count-badge" style="background:#444;color:#fff;padding:1px 6px;border-radius:10px;font-size:11px;margin-left:5px">0</span></div><div class="tm-close-btn" id="tm-btn-close">×</div></div><div class="tm-body"><div class="tm-list" id="tm-list-box"></div><div style="flex-shrink:0"><button class="tm-btn" style="background:#d35400" id="tm-btn-run">⚡ KẾT NỐI</button><div style="display:flex;gap:5px;"><button class="tm-btn" style="background:#7d3c98" id="tm-btn-refresh">🔄 Refresh</button><button class="tm-btn" style="background:#922b21" id="tm-btn-clear">🗑️ Clear</button></div><div id="tm-status-text">Ready</div></div></div>`;
                document.body.appendChild(p);
                document.getElementById('tm-btn-close').onclick=()=>{p.style.display='none'}; document.getElementById('tm-btn-refresh').onclick=()=>{loadGeminiData();GemUI.render();GemUI.status("Đã cập nhật!");}; document.getElementById('tm-btn-clear').onclick=()=>{if(confirm("Xóa hết?")){GM_setValue(DB.KEYS,[]);loadGeminiData();GemUI.render();}}; document.getElementById('tm-btn-run').onclick=()=>{if(gemKeys[gemIdx]){gemIsLocked=false;GemCore.connect(gemKeys[gemIdx].key);}};
            },
            render() {
                const box=document.getElementById('tm-list-box'); const bdg=document.getElementById('tm-count-badge');
                box.innerHTML=''; if(bdg)bdg.textContent=gemKeys.length;
                if(!gemKeys.length){box.innerHTML='<div style="padding:15px;text-align:center;color:#666;font-size:12px;">Chưa có key.</div>';return;}
                gemKeys.forEach((k,i)=>{
                    const d=document.createElement('div'); d.className=`tm-item ${i===gemIdx?'active':''}`;
                    const t=(gemLimits[k.key]||[]).map(x=>`<span class="tm-tag">${x}</span>`).join('');
                    d.innerHTML=`<div><b>${k.name}</b><br><small style="opacity:0.5">...${k.suffix}</small></div><div>${t}</div>`;
                    d.onclick=()=>{gemIdx=i;saveGeminiData();GemUI.render();gemIsGenerating=false;}; box.appendChild(d);
                });
            },
            status(m,c="#888"){const s=document.getElementById('tm-status-text');if(s){s.textContent=m;s.style.color=c;}}
        };

        const GemAuto = {
            init() {
                document.addEventListener('click', (e) => { if(document.getElementById('chat_completion_source')?.value===TARGET_SOURCE && e.target.closest('#send_but, #regenerate_but, .fa-paper-plane')) { gemIsGenerating=true; GemUI.status("🚀 Đang gửi...", "yellow"); } }, true);
                new MutationObserver((ms) => {
                    if(document.getElementById('chat_completion_source')?.value!==TARGET_SOURCE) return;
                    if(gemIsGenerating && !gemIsLocked) for(const m of ms) for(const n of m.addedNodes) if(n.nodeType===1 && n.classList.contains('mes') && !n.classList.contains('last_mes_user')) { this.onSuccess(); return; }
                    if(!gemIsLocked) { const t=document.querySelector('.toast-body, .toast-message'); if(t && t.innerText && this.isErr(t.innerText) && !t.dataset.processed) { t.dataset.processed="true"; this.rotate(t); } }
                }).observe(document.body, {childList:true, subtree:true});
            },
            isErr(t){return ["429","quota","exhausted","limit reached"].some(x=>t.toLowerCase().includes(x));},
            onSuccess(){ gemIsGenerating=false; GemUI.status("✨ OK.", "#2ecc71"); const k=gemKeys[gemIdx].key, m=document.getElementById('model_google_select')?.value||'unknown'; if(gemLimits[k]?.includes(m)){gemLimits[k]=gemLimits[k].filter(x=>x!==m); if(!gemLimits[k].length)delete gemLimits[k]; saveGeminiData(); GemUI.render();} },
            async rotate(el){
                if(gemIsLocked)return; gemIsLocked=true; gemIsGenerating=false; const m=document.getElementById('model_google_select')?.value||'unknown', k=gemKeys[gemIdx].key;
                if(!gemLimits[k])gemLimits[k]=[]; if(!gemLimits[k].includes(m))gemLimits[k].push(m); saveGeminiData();
                gemIdx=(gemIdx+1)%gemKeys.length; saveGeminiData(); GemUI.render(); GemUI.status(`🛑 Lỗi ${m}. Đổi Key ${gemIdx+1}...`, "orange");
                await GemCore.connect(gemKeys[gemIdx].key); if(el){let c=0;while(document.body.contains(el)&&c<30){await sleep(500);c++;}} GemUI.status("✅ Ready.", "#2ecc71"); gemIsLocked=false;
            }
        };

        function toggleGeminiManager() { const p=document.getElementById('tm-manager'); if(p){p.style.display=p.style.display==='none'?'flex':'none';if(p.style.display==='flex'){loadGeminiData();GemUI.render();}} }

        // --- INIT ---
        rebuildMasterMenu(); GemUI.init(); GemAuto.init(); loadGeminiData(); startDynamicVisibilityLoop();
        const obs = new MutationObserver(() => { const c = document.getElementById('chat'); if (c) c.querySelectorAll('.mes').forEach(addButtons); });
        const bodyObs = new MutationObserver(() => { const c = document.getElementById('chat'); if (c) { c.querySelectorAll('.mes').forEach(addButtons); obs.observe(c, { childList: true, subtree: true }); bodyObs.disconnect(); } });
        bodyObs.observe(document.body, { childList: true, subtree: true });
        setInterval(() => { const el = document.getElementById('chat_completion_source'), p = document.getElementById('tm-manager'); if (el && p && el.value !== TARGET_SOURCE && p.style.display !== 'none') p.style.display = 'none'; }, 1000);
    }
})();