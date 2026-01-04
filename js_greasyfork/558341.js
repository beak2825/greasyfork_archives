// ==UserScript==
// @name         DeepSeek Personalization and System Prompts Injector
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Personalization UI + robust prompt injection for chat.deepseek.com
// @match        https://chat.deepseek.com
// @match        https://chat.deepseek.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558341/DeepSeek%20Personalization%20and%20System%20Prompts%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/558341/DeepSeek%20Personalization%20and%20System%20Prompts%20Injector.meta.js
// ==/UserScript==
 
(function () {
    "use strict";
 
    const DEBUG = false; // Set to true for debugging
    const APP = 'ds_personalization_v3';
    const STATE_KEY = `${APP}_state`;
    const API_PATTERNS = ['/api/v0/chat/completion', '/chat/completions', '/v1/chat/completions'];
 
    const DEFAULT = {
        jailbreak: '',
        custom_instructions: '',
        name_user: '',
        nickname_user: '',
        occupation_user: '',
        about_user: ''
    };
 
    // ---------- STORAGE ----------
    const gmGet = (key, def = null) => {
        try { const v = GM_getValue(key); return v === undefined ? def : v; } catch { return def; }
    };
    const gmSet = (key, val) => { try { GM_setValue(key, val); } catch {} };
    
    const loadState = () => Object.assign({}, DEFAULT, gmGet(STATE_KEY, DEFAULT));
    const saveState = (state) => gmSet(STATE_KEY, state);
    
    let state = loadState();
    const log = (...args) => DEBUG && console.log('[DS-PERSONAL]', ...args);
    
    // ---------- CHAT ID TRACKING ----------
    const interceptedInstances = new WeakSet();
    let currentChatId = null;
    
    const getChatId = () => {
        const match = location.pathname.match(/\/a\/chat\/s\/([a-f0-9-]+)/);
        if (match) {
            const id = match[1];
            if (currentChatId !== id) {
                log('New chat:', id);
                currentChatId = id;
            }
            return id;
        }
        
        if (!currentChatId || !location.pathname.includes('chat')) {
            currentChatId = 'chat_' + Date.now();
        }
        return currentChatId;
    };
    
    const firstSentKey = (id) => `${APP}_sent_${id}`;
    
    // ---------- STYLES ----------
    GM_addStyle(`
        #ds_btn{position:fixed;top:16px;right:16px;z-index:2147483646;padding:8px 12px;border-radius:8px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3)}
        #ds_panel{position:fixed;top:56px;right:16px;z-index:2147483646;width:400px;max-height:80vh;overflow:auto;padding:12px;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,0.2)}
        #ds_panel label{display:block;margin-top:8px;font-weight:600}
        #ds_panel textarea,#ds_panel input[type=text]{width:100%;box-sizing:border-box;padding:6px;margin-top:4px;border-radius:4px;resize:none;overflow-y:auto}
        #ds_panel hr{border:1px solid #888;margin:8px 0}
        #ds_panel button{cursor:pointer;padding:6px 12px;border-radius:4px;margin-right:8px}
        
        #ds_panel{scrollbar-width:thin;scrollbar-color:#555 #2d2d2d}
        #ds_panel::-webkit-scrollbar{width:8px}
        #ds_panel::-webkit-scrollbar-track{background:#2d2d2d;border-radius:4px}
        #ds_panel::-webkit-scrollbar-thumb{background:#555;border-radius:4px}
        #ds_panel::-webkit-scrollbar-thumb:hover{background:#666}
        
        #ds_panel textarea,#ds_panel input[type=text]{scrollbar-width:thin;scrollbar-color:#555 #2d2d2d}
        #ds_panel textarea::-webkit-scrollbar,#ds_panel input[type=text]::-webkit-scrollbar{width:8px}
        #ds_panel textarea::-webkit-scrollbar-track,#ds_panel input[type=text]::-webkit-scrollbar-track{background:#2d2d2d;border-radius:4px}
        #ds_panel textarea::-webkit-scrollbar-thumb,#ds_panel input[type=text]::-webkit-scrollbar-thumb{background:#555;border-radius:4px}
        
        #ds_panel.light{scrollbar-color:#c1c1c1 #f1f1f1}
        #ds_panel.light::-webkit-scrollbar-track{background:#f1f1f1}
        #ds_panel.light::-webkit-scrollbar-thumb{background:#c1c1c1}
        #ds_panel.light::-webkit-scrollbar-thumb:hover{background:#a1a1a1}
        #ds_panel.light textarea,#ds_panel.light input[type=text]{scrollbar-color:#c1c1c1 #f1f1f1}
        #ds_panel.light textarea::-webkit-scrollbar-track,#ds_panel.light input[type=text]::-webkit-scrollbar-track{background:#f1f1f1}
        #ds_panel.light textarea::-webkit-scrollbar-thumb,#ds_panel.light input[type=text]::-webkit-scrollbar-thumb{background:#c1c1c1}
    `);
 
    // ---------- UI ----------
    const buildUI = () => {
        if (document.getElementById('ds_btn')) return;
        
        const btn = document.createElement('button');
        btn.id = 'ds_btn';
        btn.textContent = 'Personalization';
        document.documentElement.appendChild(btn);
 
        const panel = document.createElement('div');
        panel.id = 'ds_panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <label>JailBreak</label>
            <textarea id='ds_jail' rows='3' placeholder='Sent once at the beginning of each chat'></textarea>
            <label>Custom Instructions</label>
            <textarea id='ds_inst' rows='3' placeholder='How should DeepSeek act?'></textarea>
            <label>About You</label><hr>
            <label>Name</label>
            <input id='ds_name' type='text' placeholder='Your name'>
            <label>Nickname</label>
            <input id='ds_nick' type='text' placeholder='What should DeepSeek call you?'>
            <label>Occupation</label>
            <input id='ds_job' type='text' placeholder='Your occupation'>
            <label>More About You</label>
            <textarea id='ds_about' rows='3' placeholder='What should DeepSeek know about you?'></textarea>
            <hr>
            <button id='ds_save'>Save</button>
            <button id='ds_reset'>Reset</button>
            <div id='ds_msg' style='margin-top:8px;font-size:13px'></div>
        `;
        document.documentElement.appendChild(panel);
        
        // Auto-expand textareas
        ['ds_jail', 'ds_inst', 'ds_about'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 154) + 'px';
            });
        });
        
        btn.onclick = () => {
            const isHidden = panel.style.display === 'none';
            panel.style.display = isHidden ? 'block' : 'none';
            if (isHidden) loadUI();
        };
        
        const showMsg = (msg) => {
            const el = document.getElementById('ds_msg');
            if (el) { el.textContent = msg; setTimeout(() => el.textContent = '', 1800); }
        };
        
        document.getElementById('ds_save').onclick = () => {
            state.jailbreak = document.getElementById('ds_jail').value || '';
            state.custom_instructions = document.getElementById('ds_inst').value || '';
            state.name_user = document.getElementById('ds_name').value || '';
            state.nickname_user = document.getElementById('ds_nick').value || '';
            state.occupation_user = document.getElementById('ds_job').value || '';
            state.about_user = document.getElementById('ds_about').value || '';
            saveState(state);
            showMsg('Saved');
        };
        
        document.getElementById('ds_reset').onclick = () => {
            if (confirm('Reset all settings?')) {
                state = Object.assign({}, DEFAULT);
                saveState(state);
                loadUI();
                showMsg('Reset');
            }
        };
        
        applyTheme();
    };
    
    const loadUI = () => {
        try {
            document.getElementById('ds_jail').value = state.jailbreak || '';
            document.getElementById('ds_inst').value = state.custom_instructions || '';
            document.getElementById('ds_name').value = state.name_user || '';
            document.getElementById('ds_nick').value = state.nickname_user || '';
            document.getElementById('ds_job').value = state.occupation_user || '';
            document.getElementById('ds_about').value = state.about_user || '';
        } catch {}
    };
 
    // ---------- THEME ----------
    const applyTheme = () => {
        const body = document.body;
        if (!body) return;
        
        const isDark = body.classList.contains('dark') || 
                       body.getAttribute('data-ds-dark-theme') === 'dark' ||
                       (window.getComputedStyle(body).backgroundColor.match(/rgb\((\d+)/) || [])[1] < 128;
        
        const panel = document.getElementById('ds_panel');
        const btn = document.getElementById('ds_btn');
        if (!panel) return;
        
        // Preserve display state
        const currentDisplay = panel.style.display;
        
        panel.className = isDark ? '' : 'light';
        
        const colors = isDark ? 
            {bg: '#1a1a1a', fg: '#e0e0e0', border: '#333', input: '#2d2d2d', button: '#333'} :
            {bg: '#fff', fg: '#1a1a1a', border: '#ddd', input: '#f5f5f5', button: '#f0f0f0'};
        
        panel.style.cssText = `display:${currentDisplay};background:${colors.bg};color:${colors.fg};border:1px solid ${colors.border}`;
        btn.style.cssText = `background:${colors.button};color:${colors.fg};border:1px solid ${colors.border}`;
        
        panel.querySelectorAll('textarea,input[type=text]').forEach(el => {
            el.style.cssText = `background:${colors.input};color:${colors.fg};border:1px solid ${colors.border}`;
        });
        
        panel.querySelectorAll('button').forEach(el => {
            el.style.cssText = `background:${colors.button};color:${colors.fg};border:1px solid ${colors.border}`;
        });
    };
    
    // Observe theme changes
    const observer = new MutationObserver(() => applyTheme());
    if (document.body) {
        observer.observe(document.body, {attributes: true, attributeFilter: ['class', 'data-ds-dark-theme']});
    }
    
    // ---------- MESSAGE BUILDING ----------
    const buildSystemMsg = () => {
        const parts = [];
        
        if (state.jailbreak?.trim()) parts.push(`Guidelines:\n${state.jailbreak.trim()}`);
        if (state.custom_instructions?.trim()) parts.push(`Instructions:\n${state.custom_instructions.trim()}`);
        
        const userInfo = [];
        if (state.name_user?.trim()) userInfo.push(`- Name: ${state.name_user}`);
        if (state.nickname_user?.trim()) userInfo.push(`- Nickname: ${state.nickname_user}`);
        if (state.occupation_user?.trim()) userInfo.push(`- Occupation: ${state.occupation_user}`);
        if (state.about_user?.trim()) userInfo.push(`- Additional:\n\n${state.about_user}`);
        
        if (userInfo.length) parts.push(`User Information:\n\n${userInfo.join('\n\n')}`);
        
        return parts.length ? parts.join('\n\n') : null;
    };
 
    // ---------- REQUEST MODIFICATION ----------
    const modifyRequest = (body) => {
        if (!body) return body;
        
        let data, isString = false;
        
        if (typeof body === 'string') {
            try { data = JSON.parse(body); isString = true; } catch { return body; }
        } else if (typeof body === 'object') {
            data = body;
        } else {
            return body;
        }
        
        const chatId = getChatId();
        const key = firstSentKey(chatId);
        const sent = localStorage.getItem(key) === '1';
        
        // Handle messages array
        if (Array.isArray(data.messages) && data.messages.length && !sent) {
            const hasSystem = data.messages.some(m => m.role === 'system');
            if (!hasSystem) {
                const content = buildSystemMsg();
                if (content) {
                    data.messages.unshift({role: 'system', content});
                    localStorage.setItem(key, '1');
                    log('System msg added');
                }
            }
            return isString ? JSON.stringify(data) : data;
        }
        
        // Handle prompt field
        if (typeof data.prompt === 'string' && !sent) {
            const content = buildSystemMsg();
            if (content) {
                const clean = data.prompt.replace(/^User:\s*/, '');
                const sys = JSON.stringify({role: "system", content});
                const usr = JSON.stringify({role: "user", type: "message", content: [{type: "input_text", text: clean}]});
                data.prompt = `[SYSTEM INSTRUCTIONS]/\n${'─'.repeat(50)}\n\n${sys},\n\n${'─'.repeat(50)}\n\n[USER MESSAGE]/${usr}`;
                localStorage.setItem(key, '1');
                log('Prompt modified');
            }
            return isString ? JSON.stringify(data) : data;
        }
        
        return body;
    };
 
    // ---------- INTERCEPTION ----------
    const interceptXHR = () => {
        const XHR = unsafeWindow.XMLHttpRequest;
        if (!XHR || interceptedInstances.has(XHR.prototype)) return;
        
        const origOpen = XHR.prototype.open;
        const origSend = XHR.prototype.send;
        
        XHR.prototype.open = function(method, url, ...args) {
            this._dsUrl = url;
            return origOpen.call(this, method, url, ...args);
        };
        
        XHR.prototype.send = function(body) {
            if (this._dsUrl && API_PATTERNS.some(p => this._dsUrl.includes(p))) {
                arguments[0] = modifyRequest(body);
            }
            return origSend.apply(this, arguments);
        };
        
        interceptedInstances.add(XHR.prototype);
    };
    
    const interceptFetch = () => {
        const orig = unsafeWindow.fetch;
        if (!orig || interceptedInstances.has(orig)) return;
        
        unsafeWindow.fetch = async function(input, init = {}) {
            const url = typeof input === 'string' ? input : input.url || '';
            if (API_PATTERNS.some(p => url.includes(p))) {
                const clone = Object.assign({}, init);
                if (clone.body) {
                    if (clone.body instanceof Blob) {
                        const text = await clone.body.text();
                        const mod = modifyRequest(text);
                        if (mod !== text) clone.body = new Blob([mod], {type: 'application/json'});
                    } else if (typeof clone.body === 'string') {
                        clone.body = modifyRequest(clone.body);
                    }
                }
                return orig.call(this, input, clone);
            }
            return orig.call(this, input, init);
        };
        
        Object.setPrototypeOf(unsafeWindow.fetch, orig);
        interceptedInstances.add(orig);
    };
    
    const interceptWS = () => {
        const WS = unsafeWindow.WebSocket;
        if (!WS || interceptedInstances.has(WS)) return;
        
        unsafeWindow.WebSocket = function(url, protocols) {
            const ws = new WS(url, protocols);
            const origSend = ws.send;
            ws.send = function(data) {
                if (typeof data === 'string') {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.prompt || parsed.messages) {
                            return origSend.call(this, modifyRequest(data));
                        }
                    } catch {}
                }
                return origSend.call(this, data);
            };
            return ws;
        };
        
        Object.setPrototypeOf(unsafeWindow.WebSocket, WS);
        interceptedInstances.add(WS);
    };
    
    const applyInterceptions = () => {
        interceptXHR();
        interceptFetch();
        interceptWS();
    };
    
    // ---------- INIT ----------
    buildUI();
    applyInterceptions();
    
    // Reapply interceptions
    let count = 0;
    const interval = setInterval(() => {
        applyInterceptions();
        if (++count > 20) clearInterval(interval);
    }, 500);
    
    // Monitor URL changes
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            getChatId();
            applyInterceptions();
        }
    }).observe(document, {subtree: true, childList: true});
    
    // DOM ready handlers
    const init = () => { buildUI(); applyTheme(); };
    window.addEventListener('DOMContentLoaded', init);
    if (document.readyState !== 'loading') setTimeout(init, 200);
    
    // Menu command
    GM_registerMenuCommand?.('Open Personalization Panel', () => 
        document.getElementById('ds_btn')?.click()
    );
    
    log('Initialized v3.4');
})();