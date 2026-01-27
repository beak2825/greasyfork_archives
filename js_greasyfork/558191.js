// ==UserScript==
// @name         可视化元素选择器
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  UI极致重构：小巧悬浮球+可拖动面板。修复点击动画导致的位移Bug，完美交互体验。
// @author       pipi
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/558191/%E5%8F%AF%E8%A7%86%E5%8C%96%E5%85%83%E7%B4%A0%E9%80%89%E6%8B%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558191/%E5%8F%AF%E8%A7%86%E5%8C%96%E5%85%83%E7%B4%A0%E9%80%89%E6%8B%A9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 💎 CSS 变量
    const cssVariables = `
        :root {
            --es-glass-bg: rgba(255, 255, 255, 0.72);
            --es-glass-shadow: 0 20px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.5);
            --es-comp-bg: rgba(255, 255, 255, 0.45);
            --es-pri: linear-gradient(135deg, #c78fff 0%, #8b77ff 100%);
            --es-pri-line:#c78fff;
            --es-pri-light: rgba(99, 102, 241, 0.15);
            --es-text: #1a1c1e;
            --es-text-mut: #5f6368;
            --es-mono: "JetBrains Mono", "SF Mono", Menlo, monospace;
        }
    `;

    GM_addStyle(`
        ${cssVariables}
        .es-highlight { position: absolute; background:#cba0ff30; border: 1.5px solid var(--es-pri-line); z-index: 2147483646; pointer-events: none; display: none; border-radius: 4px; }
        .es-group-highlight { position: absolute; background: rgba(245, 158, 11, 0.08); border: 1.5px dashed #f59e0b; z-index: 2147483645; pointer-events: none; border-radius: 4px; }

        .es-panel {
            position: fixed; top: 30px; right: 30px; width: 380px;
            background: var(--es-glass-bg); backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
            border-radius: 16px; box-shadow: var(--es-glass-shadow); border: 1px solid rgba(255,255,255,0.4);
            font-family: -apple-system, system-ui, sans-serif; color: var(--es-text);
            z-index: 2147483647; display: none; overflow: hidden;
            animation: es-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes es-in { from { opacity: 0; transform: translateY(-10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .es-fab {
            position: fixed; bottom: 80px; right: 40px;
            width: 36px; height: 36px;
            background: var(--es-glass-bg); backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.6); box-shadow: 0 4px 16px rgba(0,0,0,0.1);
            border-radius: 50%; cursor: move; z-index: 2147483648;
            display: flex; align-items: center; justify-content: center;
            color: var(--es-pri); transition: background 0.2s, box-shadow 0.2s; /* ✨ 移除了 transform 动画 */
            user-select: none;
        }
        .es-fab:hover { background: #fff; box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
        .es-fab:active { background: rgba(255,255,255,0.9); } /* 点击时背景微变 */

        .es-fab svg {
            pointer-events: none; color: #8b77ff; width: 18px; height: 18px;
            transition: transform 0.15s ease; /* ✨ 动画交给图标 */
        }
        .es-fab:active svg { transform: scale(0.85); } /* ✨ 只缩放图标，不缩放容器 */

        .es-header {
            padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;
            background: rgba(255, 255, 255, 0.4); border-bottom: 1px solid rgba(0,0,0,0.05);
            cursor: move; user-select: none;
        }
        .es-title { font-size: 13px; font-weight: 800; display: flex; align-items: center; gap: 8px; color: var(--es-pri); }
        .es-badge { background: var(--es-pri); color: white; padding: 1px 6px; border-radius: 10px; font-size: 10px; display: none; }
        .es-close { cursor: pointer; color: var(--es-text-mut); padding: 4px; border-radius: 50%; }
        .es-close:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .es-content { padding: 16px; }
        .es-toolbar { display: flex; gap: 8px; margin-bottom: 16px; }
        .es-btn {
            flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px;
            padding: 8px; border: 1px solid rgba(0,0,0,0.06); border-radius: 8px;
            background: var(--es-comp-bg); font-size: 11px; font-weight: 600; cursor: pointer; transition: 0.15s; color: var(--es-text-mut);
        }
        .es-btn:hover { background: #fff; color: var(--es-pri); transform: translateY(-1px); }
        .es-btn-pri { background: var(--es-pri); color: white; border: none; }
        .es-btn-pri:hover { background: linear-gradient(135deg, #7577ff 0%, #ac9dff 100%); color: white; }

        .es-section-label { font-size: 10px; font-weight: 800; color: var(--es-text-mut); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; }
        .es-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
        .es-chip {
            font-size: 11px; font-family: var(--es-mono); padding: 4px 10px;
            background: var(--es-comp-bg); border: 1px solid rgba(0,0,0,0.04);
            border-radius: 6px; cursor: pointer; color: var(--es-text-mut);
            max-width: 100%; overflow: hidden; text-overflow: ellipsis;
        }
        .es-chip:hover { border-color: var(--es-pri); color: var(--es-pri-line); background: #fff; }
        .es-chip.active { background: var(--es-pri); color: white; border-color: var(--es-pri); }

        .es-field { margin-bottom: 12px; }
        .es-input-wrap { position: relative; }
        .es-input {
            width: 100%; padding: 10px 36px 10px 12px;
            background: var(--es-comp-bg); border: 1px solid rgba(0,0,0,0.06); border-radius: 10px;
            font-family: var(--es-mono); font-size: 11px; color: var(--es-text); box-sizing: border-box;
        }
        .es-input:focus { outline: none; border-color: var(--es-pri); background: #fff; box-shadow: 0 0 0 3px var(--es-pri-light); }
        .es-copy { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); cursor: pointer; opacity: 0.5; padding: 4px; }
        .es-copy:hover { opacity: 1; color: var(--es-pri); }

        .es-toast {
            position: fixed; top: 40px; left: 50%; transform: translateX(-50%);
            background: rgba(26, 28, 30, 0.9); backdrop-filter: blur(10px); color: white;
            padding: 8px 20px; border-radius: 50px; font-size: 12px; font-weight: 600;
            z-index: 2147483648; display: none; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
    `);

    // --- 核心变量 ---
    const isTop = window.self === window.top;
    let state = { isSelecting: false, isGroup: false, samples: [], currentEl: null, overlays: [] };
    let ui = { highlight: null, panel: null, toast: null, fab: null };

    const icons = {
        match: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>',
        copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
        close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
        inspect: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>'
    };

    function init() {
        createSharedUI();
        if (isTop) {
            createPanel();
            createFAB();
            window.addEventListener('message', handleFrameMessage);
        } else {
            window.addEventListener('message', handleTopMessage);
        }
        setupEvents();
    }

    function createSharedUI() {
        ui.highlight = document.createElement('div'); ui.highlight.className = 'es-highlight'; document.body.appendChild(ui.highlight);
        ui.toast = document.createElement('div'); ui.toast.className = 'es-toast'; document.body.appendChild(ui.toast);
    }

    // --- 创建悬浮球 ---
    function createFAB() {
        ui.fab = document.createElement('div');
        ui.fab.className = 'es-fab';
        ui.fab.innerHTML = icons.inspect;
        ui.fab.title = '拖拽移动 / 点击开始选择';
        document.body.appendChild(ui.fab);

        // 绑定拖拽
        setupDraggable(ui.fab, ui.fab);

        // 区分拖拽和点击
        let isDragging = false;
        ui.fab.addEventListener('mousedown', () => isDragging = false);
        ui.fab.addEventListener('mousemove', () => isDragging = true);
        ui.fab.addEventListener('mouseup', () => {
            if (!isDragging) {
                if (state.isSelecting || ui.panel.style.display === 'block') broadcast('CLOSE');
                else broadcast('RESET');
            }
        });
    }

    // --- 创建面板 ---
    function createPanel() {
        ui.panel = document.createElement('div');
        ui.panel.className = 'es-panel';
        ui.panel.innerHTML = `
            <div class="es-header" id="es-drag-handle">
                <div class="es-title">${icons.inspect}&nbsp; PRO SELECTOR <span class="es-badge" id="es-count">0</span></div>
                <div class="es-close" id="es-close">${icons.close}</div>
            </div>
            <div class="es-content">
                <button class="es-btn es-btn-pri" id="btn-match" style="width:100%; margin-bottom:12px">${icons.match} Smart Match</button>
                <div class="es-toolbar">
                    <button class="es-btn" id="btn-parent">Parent</button>
                    <button class="es-btn" id="btn-child">Child</button>
                    <button class="es-btn" id="btn-reset">Reset</button>
                </div>

                <div id="es-suggestions-wrap" style="display:none">
                    <div class="es-section-label">Suggestions</div>
                    <div class="es-chips" id="es-chips"></div>
                </div>

                <div class="es-field">
                    <div class="es-section-label">CSS Selector</div>
                    <div class="es-input-wrap">
                        <input type="text" class="es-input" id="inp-css" placeholder="CSS Selector">
                        <div class="es-copy" id="cp-css">${icons.copy}</div>
                    </div>
                </div>
                <div class="es-field">
                    <div class="es-input-wrap">
                        <input type="text" class="es-input" id="inp-xpath" placeholder="Smart XPath">
                        <div class="es-copy" id="cp-xpath">${icons.copy}</div>
                    </div>
                </div>
                <textarea class="es-input" id="inp-text" readonly style="height:48px;resize:none;margin-top:4px;" placeholder="Content..."></textarea>
            </div>
        `;
        document.body.appendChild(ui.panel);

        // 绑定拖拽
        setupDraggable(ui.panel, ui.panel.querySelector('#es-drag-handle'));

        const $ = (s) => ui.panel.querySelector(s);
        $('#es-close').onclick = () => broadcast('CLOSE');
        $('#btn-reset').onclick = () => broadcast('RESET');
        $('#btn-match').onclick = () => broadcast('START_GROUP');
        $('#btn-parent').onclick = () => nav('parent');
        $('#btn-child').onclick = () => nav('child');
        bindCopy($('#cp-css'), $('#inp-css'));
        bindCopy($('#cp-xpath'), $('#inp-xpath'));
    }

    // --- 核心通用功能 ---
    function setupEvents() {
        GM_registerMenuCommand('👁️ 显示/隐藏悬浮球', () => {
            if(!ui.fab) return;
            const isHidden = ui.fab.style.display === 'none';
            ui.fab.style.display = isHidden ? 'flex' : 'none';
            toast(isHidden ? '悬浮球已显示' : '悬浮球已隐藏');
        });
        GM_registerMenuCommand('🚀 强制开启', () => broadcast('RESET'));

        document.addEventListener('keydown', e => { if (e.key === 'Escape') broadcast('CLOSE'); });
        document.addEventListener('mousemove', e => {
            if (!state.isSelecting) return;
            const el = document.elementFromPoint(e.clientX, e.clientY);
            if (el && isValid(el)) highlight(el);
        }, { passive: true });
        document.addEventListener('click', e => {
            if (!state.isSelecting) return;
            if (isTop && (ui.panel.contains(e.target) || ui.fab.contains(e.target))) return;
            e.preventDefault(); e.stopPropagation();
            handleSelect(e.target);
        }, true);
    }

    function handleSelect(el) {
        if (state.isGroup) {
            if (state.samples.length > 0 && el.tagName !== state.samples[0].tagName) {
                toast(`Strict Mode: <${state.samples[0].tagName.toLowerCase()}> only.`); return;
            }
            if (!state.samples.includes(el)) state.samples.push(el);
            const sel = getGroupSelector(state.samples);
            state.isSelecting = false;
            highlightGroup(sel);
            sendUpdate({ mode: 'group', selector: sel, count: document.querySelectorAll(sel).length });
        } else {
            state.isSelecting = false;
            state.currentEl = el;
            highlight(el);
            sendUpdate({
                mode: 'single',
                chips: getCascadeSuggestions(el),
                xpath: getSmartXPath(el),
                text: (el.innerText || el.value || '').trim().substring(0, 100)
            });
        }
    }

    // --- 拖拽核心逻辑 (稳定版) ---
    function setupDraggable(element, handle) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        handle.onmousedown = (e) => {
            if (e.button !== 0) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = element.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            // 锁定坐标，防止跳动
            element.style.left = initialLeft + 'px';
            element.style.top = initialTop + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';

            if (element === ui.panel) {
                element.style.width = rect.width + 'px';
            }
        };

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            element.style.left = (initialLeft + dx) + 'px';
            element.style.top = (initialTop + dy) + 'px';
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // --- 其他辅助逻辑 ---
    function getCascadeSuggestions(el) {
        const tag = el.tagName.toLowerCase();
        const pool = [];
        if (el.id) pool.push({ label: 'ID', val: `#${CSS.escape(el.id)}` });
        ['data-testid', 'name', 'placeholder', 'aria-label'].forEach(attr => {
            const val = el.getAttribute(attr);
            if (val) pool.push({ label: 'Attr', val: `${tag}[${attr}="${val}"]` });
        });
        const clsList = Array.from(el.classList).filter(c => !c.startsWith('es-') && c.length < 20 && !/\d/.test(c));
        if (clsList.length) pool.push({ label: 'Class', val: `${tag}.${CSS.escape(clsList[0])}` });
        if (el.parentElement) {
            const index = Array.from(el.parentElement.children).indexOf(el) + 1;
            pool.push({ label: 'Nth', val: `${tag}:nth-child(${index})` });
        }
        pool.push({ label: 'Path', val: getUniqueSelector(el) });
        return pool;
    }

    function getSmartXPath(el) {
        if (el.id) return `//*[@id="${el.id}"]`;
        return getFullXPath(el);
    }

    function handleFrameMessage(e) {
        if (e.data?.type === 'ES_UPDATE') {
            broadcast('MUTEX_HL');
            ui.panel.style.display = 'block';
            e.data.payload.mode === 'group' ? updatePanelGroup(e.data.payload.selector, e.data.payload.count) : updatePanelSingle(e.data.payload);
        }
    }

    function handleTopMessage(e) {
        const c = e.data?.cmd;
        if (c === 'RESET') start();
        if (c === 'CLOSE') closeLocal();
        if (c === 'START_GROUP') startGroupModeLocal();
        if (c === 'MUTEX_HL') ui.highlight.style.display = 'none';
    }

    function broadcast(cmd) {
        if (cmd === 'CLOSE') closeLocal();
        if (cmd === 'RESET') start();
        if (cmd === 'START_GROUP') startGroupModeLocal();
        if (cmd === 'MUTEX_HL') ui.highlight.style.display = 'none';
        document.querySelectorAll('iframe').forEach(f => f.contentWindow.postMessage({type:'ES_CMD', cmd}, '*'));
    }

    function sendUpdate(payload) {
        if (isTop) handleFrameMessage({data:{type:'ES_UPDATE', payload}});
        else window.top.postMessage({type:'ES_UPDATE', payload}, '*');
    }

    function updatePanelSingle(data) {
        const $ = (s) => ui.panel.querySelector(s);
        $('#es-suggestions-wrap').style.display = 'block';
        $('#es-count').style.display = 'none';
        const chips = $('#es-chips'); chips.innerHTML = '';
        data.chips.forEach((c, idx) => {
            const chip = document.createElement('div');
            chip.className = `es-chip ${idx === 0 ? 'active' : ''}`;
            chip.textContent = c.val;
            chip.onclick = () => {
                Array.from(chips.children).forEach(ch => ch.classList.remove('active'));
                chip.classList.add('active'); $('#inp-css').value = c.val;
            };
            chips.appendChild(chip);
        });
        $('#inp-css').value = data.chips[0].val;
        $('#inp-xpath').value = data.xpath;
        $('#inp-text').value = data.text;
    }

    function updatePanelGroup(sel, count) {
        const $ = (s) => ui.panel.querySelector(s);
        $('#es-suggestions-wrap').style.display = 'none';
        $('#es-count').style.display = 'inline-block'; $('#es-count').textContent = count;
        $('#inp-css').value = sel;
    }

    function getUniqueSelector(el) {
        if (el.id) return `#${CSS.escape(el.id)}`;
        let path = [];
        while (el && el.nodeType === 1) {
            let s = el.nodeName.toLowerCase();
            const cls = Array.from(el.classList).filter(c => !c.startsWith('es-'))[0];
            if (cls) s += `.${CSS.escape(cls)}`;
            path.unshift(s); el = el.parentNode;
        }
        return path.join(' > ');
    }

    function getFullXPath(el) {
        let path = [];
        for (; el && el.nodeType === 1; el = el.parentNode) {
            let idx = 1;
            for (let s = el.previousSibling; s; s = s.previousSibling) if (s.nodeType===1 && s.tagName===el.tagName) idx++;
            path.unshift(`${el.tagName.toLowerCase()}[${idx}]`);
        }
        return '/' + path.join('/');
    }

    function getGroupSelector(elements) {
        const first = elements[0];
        const tag = first.tagName.toLowerCase();
        let commonClasses = Array.from(first.classList).filter(c => !c.startsWith('es-'));
        for (let i = 1; i < elements.length; i++) commonClasses = commonClasses.filter(c => Array.from(elements[i].classList).includes(c));
        return tag + (commonClasses.length ? '.' + commonClasses.join('.') : '');
    }

    function highlight(el) {
        const r = el.getBoundingClientRect();
        Object.assign(ui.highlight.style, { width:r.width+'px', height:r.height+'px', top:(r.top+scrollY)+'px', left:(r.left+scrollX)+'px', display:'block'});
    }
    function highlightGroup(sel) {
        clearHighlights();
        try { document.querySelectorAll(sel).forEach(el => {
            const r = el.getBoundingClientRect();
            if(r.width===0) return;
            const d = document.createElement('div'); d.className = 'es-group-highlight';
            Object.assign(d.style, { width:r.width+'px', height:r.height+'px', top:(r.top+scrollY)+'px', left:(r.left+scrollX)+'px' });
            document.body.appendChild(d); state.overlays.push(d);
        }); } catch(e){}
    }
    function start() { state.isSelecting = true; state.isGroup = false; state.samples = []; if (isTop) ui.panel.style.display = 'none'; clearHighlights(); toast("Select element..."); }
    function startGroupModeLocal() { if (!state.currentEl) return; state.isGroup = true; state.samples = [state.currentEl]; state.isSelecting = true; if(isTop) ui.panel.style.display='none'; clearHighlights(); toast("Click another element..."); }
    function clearHighlights() { state.overlays.forEach(o => o.remove()); state.overlays = []; ui.highlight.style.display = 'none'; }
    function closeLocal() { state.isSelecting = false; state.isGroup = false; if (isTop) ui.panel.style.display = 'none'; clearHighlights(); }
    function toast(m) { ui.toast.textContent = m; ui.toast.style.display = 'block'; setTimeout(() => ui.toast.style.display = 'none', 2000); }
    function isValid(el) { return el !== ui.highlight && (!isTop || !ui.panel.contains(el)) && (!ui.fab || !ui.fab.contains(el)) && !el.classList.contains('es-group-highlight'); }
    function bindCopy(b, i) { b.onclick = () => { GM_setClipboard(i.value); toast("Copied!"); }; }
    function nav(dir) { if(!state.currentEl) return; const t = dir==='parent'?state.currentEl.parentElement:state.currentEl.firstElementChild; if(t) handleSelect(t); }

    init();
})();