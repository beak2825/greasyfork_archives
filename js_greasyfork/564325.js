// ==UserScript==
// @name         Gemini GG-BOOM (v38.0 Logic Fix)
// @namespace    http://tampermonkey.net/
// @version      38.0
// @description  Gemini 助手：基于几何算法彻底修复滚动误判。UI完美版/纯净DOM/全功能。
// @author       cshaizhihao
// @license      MIT
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/564325/Gemini%20GG-BOOM%20%28v380%20Logic%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564325/Gemini%20GG-BOOM%20%28v380%20Logic%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("🚀 GG-BOOM v38.0: 几何滚动修复版启动...");

    // ==========================================
    // 1. 样式 (保持 v37.0 完美界面不动)
    // ==========================================
    const css = `
        :root {
            --gg-border: #444;
            --gg-text: #eee;
            --gg-panel-bg-idle: rgba(20, 20, 20, 0.75);
            --gg-panel-bg-hover: rgba(20, 20, 20, 0.98);
            --gg-btn-bg: rgba(255, 255, 255, 0.08);
            --gg-hover: rgba(255, 255, 255, 0.15);
            --gg-radius: 10px;
            --gg-font: system-ui, -apple-system, sans-serif;
            --gg-ball-bg: linear-gradient(135deg, #667eea, #764ba2);
        }

        [data-gg-theme="minimal"] { --gg-panel-bg-idle: rgba(30,30,30,0.8); --gg-panel-bg-hover: #222; --gg-border: #555; --gg-ball-bg: #333; }
        [data-gg-theme="cyber"] { --gg-panel-bg-idle: rgba(5, 15, 30, 0.8); --gg-panel-bg-hover: #050f1e; --gg-border: #00e5ff; --gg-text: #00e5ff; --gg-ball-bg: linear-gradient(135deg, #00c6ff, #0072ff); }
        [data-gg-theme="cartoon"] { --gg-panel-bg-idle: rgba(255, 240, 245, 0.85); --gg-panel-bg-hover: #fff0f5; --gg-border: #ffb7b2; --gg-text: #555; --gg-btn-bg: rgba(0,0,0,0.05); --gg-ball-bg: linear-gradient(135deg, #ff9a9e, #fad0c4); }
        [data-gg-theme="china"] { --gg-panel-bg-idle: rgba(249, 247, 240, 0.9); --gg-panel-bg-hover: #f9f7f0; --gg-border: #8b4513; --gg-text: #3e2723; --gg-ball-bg: linear-gradient(135deg, #c0392b, #8e44ad); }

        #gg-btn {
            position: fixed; top: 100px; right: 20px;
            width: 48px; height: 48px;
            background: var(--gg-ball-bg);
            border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            cursor: move; z-index: 2147483647;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.2);
            user-select: none; font-size: 24px; color: #fff;
            opacity: 0.4; transition: opacity 0.3s, transform 0.2s;
        }
        #gg-btn:hover { opacity: 1; transform: scale(1.1); filter: brightness(1.2); }
        #gg-btn.led::after {
            content: ''; position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px;
            border-radius: 14px; z-index: -1;
            background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
            background-size: 400%; animation: gg-glow 20s linear infinite; opacity: 0; transition: opacity 0.3s;
        }
        #gg-btn:hover.led::after { opacity: 1; }
        #gg-btn svg { width: 24px; height: 24px; color: white; pointer-events: none; }

        #gg-panel {
            position: fixed; top: 50%; left: 50%;
            width: 340px; height: auto;
            min-width: 250px; min-height: 300px;
            background: var(--gg-panel-bg-idle); color: var(--gg-text);
            border: 1px solid var(--gg-border); border-radius: var(--gg-radius);
            box-shadow: 0 20px 60px rgba(0,0,0,0.6);
            z-index: 2147483647;
            font-family: var(--gg-font); font-size: 13px;
            display: none; flex-direction: column;
            padding: 12px; gap: 10px;
            backdrop-filter: blur(8px);
            transition: background-color 0.3s;
        }
        #gg-panel:hover { background: var(--gg-panel-bg-hover); box-shadow: 0 25px 70px rgba(0,0,0,0.8); }

        .gg-resize {
            position: absolute; bottom: 0; right: 0;
            width: 20px; height: 20px; cursor: nwse-resize;
            background: linear-gradient(135deg, transparent 50%, var(--gg-border) 50%);
            opacity: 0.6; z-index: 20; border-bottom-right-radius: var(--gg-radius);
        }
        .gg-resize:hover { opacity: 1; background: linear-gradient(135deg, transparent 50%, #fff 50%); }

        .gg-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--gg-border); padding-bottom: 8px; margin-bottom: 2px; cursor: move; flex-shrink: 0; }
        .gg-title { font-weight: 800; font-size: 15px; }
        .gg-close { cursor: pointer; opacity: 0.6; padding: 4px 8px; font-weight: bold; } .gg-close:hover { opacity: 1; background: rgba(255,255,255,0.1); border-radius: 4px; }

        .gg-scroll { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-right: 4px; }
        .gg-scroll::-webkit-scrollbar { width: 6px; }
        .gg-scroll::-webkit-scrollbar-thumb { background: var(--gg-border); border-radius: 3px; }

        .gg-box { background: rgba(255,255,255,0.03); border-radius: 6px; padding: 8px; display: flex; flex-direction: column; gap: 6px; border: 1px solid transparent; }
        .gg-label { font-size: 11px; font-weight: bold; opacity: 0.5; text-transform: uppercase; margin-bottom: 2px; }

        .gg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .gg-act {
            background: var(--gg-btn-bg); border: 1px solid var(--gg-border);
            color: var(--gg-text); padding: 8px 4px; border-radius: 4px;
            text-align: center; cursor: pointer; transition: background 0.1s;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .gg-act:hover { background: var(--gg-hover); border-color: rgba(255,255,255,0.5); }
        .gg-act.active { border-color: #4caf50; color: #4caf50; font-weight: bold; background: rgba(76, 175, 80, 0.1); }
        .gg-act.recording { background: #d32f2f; color: #fff; animation: gg-pulse 1s infinite; }

        .gg-sel { width: 100%; padding: 6px; background: rgba(0,0,0,0.2); color: var(--gg-text); border: 1px solid var(--gg-border); border-radius: 4px; outline: none; }

        #gg-outline { min-height: 100px; max-height: 400px; overflow-y: auto; font-size: 12px; display: flex; flex-direction: column; gap: 2px; }
        .gg-ol-item { padding: 4px 6px; cursor: pointer; border-left: 2px solid transparent; opacity: 0.7; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .gg-ol-item:hover { background: var(--gg-btn-bg); border-left-color: var(--gg-text); opacity: 1; }

        .gg-chips { display: flex; flex-wrap: wrap; gap: 4px; }
        .gg-chip { padding: 3px 10px; background: var(--gg-btn-bg); border-radius: 10px; font-size: 12px; cursor: pointer; border: 1px solid var(--gg-border); opacity: 0.8; }
        .gg-chip:hover { border-color: var(--gg-text); opacity: 1; transform: translateY(-1px); }

        body.gg-wide .conversation-container, body.gg-wide main, body.gg-wide .input-area-container { max-width: 95% !important; margin: 0 auto !important; width: 95% !important; }
        #gg-eye-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 2147483646; display: none; transition: background 0.3s; }

        @keyframes gg-pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
        @keyframes gg-glow { 0% { background-position: 0 0; } 50% { background-position: 400% 0; } 100% { background-position: 0 0; } }
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // ==========================================
    // 2. 状态与配置
    // ==========================================
    let state = {
        theme: localStorage.getItem('gg_theme') || 'minimal',
        customKey: JSON.parse(localStorage.getItem('gg_key')) || { key: 'Enter', ctrl: true },
        isRecording: false,
        autoScroll: false,
        eyeMode: 0,
        prompts: JSON.parse(localStorage.getItem('gg_prompts')) || ['继续', '详细解释', '翻译', '润色', '总结']
    };
    const themes = { 'minimal': '⬜ 极简黑', 'cyber': '🤖 赛博蓝', 'cartoon': '🧸 糖果白', 'china': '🏮 中国风' };

    // ==========================================
    // 3. DOM 工具
    // ==========================================
    function mk(tag, className, text, events = {}) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text) el.textContent = text;
        for (const [k, v] of Object.entries(events)) el.addEventListener(k, v);
        return el;
    }

    function mkSvg() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5");
        svg.appendChild(path);
        return svg;
    }

    // ==========================================
    // 4. UI 构建
    // ==========================================
    function createUI() {
        if (document.getElementById('gg-btn')) return;

        const btn = mk('div', 'led', '');
        btn.id = 'gg-btn';
        updateThemeIcon(btn);
        document.body.appendChild(btn);

        const panel = mk('div', '', '');
        panel.id = 'gg-panel';
        panel.setAttribute('data-gg-theme', state.theme);

        const header = mk('div', 'gg-header');
        header.appendChild(mk('div', 'gg-title', 'GG-BOOM v38.0'));
        header.appendChild(mk('div', 'gg-close', '✕ 关闭', {
            click: () => { panel.style.display = 'none'; btn.style.display = 'flex'; }
        }));
        panel.appendChild(header);

        const scroll = mk('div', 'gg-scroll');

        const boxSet = mk('div', 'gg-box');
        boxSet.appendChild(mk('div', 'gg-label', '设置'));
        const themeSel = mk('select', 'gg-sel', '', {
            change: (e) => {
                state.theme = e.target.value;
                localStorage.setItem('gg_theme', state.theme);
                panel.setAttribute('data-gg-theme', state.theme);
                updateThemeIcon(btn);
            }
        });
        for (let k in themes) {
            const op = mk('option', '', themes[k]);
            op.value = k;
            if (k === state.theme) op.selected = true;
            themeSel.appendChild(op);
        }
        boxSet.appendChild(themeSel);
        const keyBtn = mk('div', 'gg-act', getKeyText(), { click: () => startRecording(keyBtn) });
        boxSet.appendChild(keyBtn);
        scroll.appendChild(boxSet);

        const boxTool = mk('div', 'gg-box');
        boxTool.appendChild(mk('div', 'gg-label', '工具'));
        const grid = mk('div', 'gg-grid');

        const bWide = mk('div', 'gg-act', '🖥️ 宽屏模式', { click: () => toggleWide(bWide) });
        const bScroll = mk('div', 'gg-act', '⬇️ 回到底部', { click: () => doSafeScroll(true) });
        const bAuto = mk('div', 'gg-act', '📜 自动滚动', { click: () => toggleAuto(bAuto) });
        const bCopy = mk('div', 'gg-act', '📄 纯净复制', { click: (e) => doCopy(e.target) });
        const bExport = mk('div', 'gg-act', '💾 导出MD', { click: () => doExport() });
        const bEye = mk('div', 'gg-act', '👁️ 护眼模式', { click: (e) => toggleEye(e.target) });
        const bReset = mk('div', 'gg-act', '🔄 重置位置', { click: () => resetPos(btn, panel) });

        grid.append(bWide, bScroll, bAuto, bCopy, bExport, bEye, bReset);
        boxTool.appendChild(grid);
        scroll.appendChild(boxTool);

        const boxChip = mk('div', 'gg-box');
        boxChip.appendChild(mk('div', 'gg-label', '快捷提示词'));
        const chips = mk('div', 'gg-chips');
        renderPrompts(chips);
        boxChip.appendChild(chips);
        scroll.appendChild(boxChip);

        const boxOl = mk('div', 'gg-box');
        boxOl.style.flex = "1";
        const olHead = mk('div', 'gg-label', '对话大纲');
        const reBtn = mk('span', '', ' 🔄');
        reBtn.style.cursor = 'pointer';
        reBtn.onclick = () => refreshOutline(olContent);
        olHead.appendChild(reBtn);
        boxOl.appendChild(olHead);

        const olContent = mk('div', '');
        olContent.id = 'gg-outline';
        boxOl.appendChild(olContent);
        scroll.appendChild(boxOl);

        panel.appendChild(scroll);

        const resizer = mk('div', 'gg-resize');
        initResize(resizer, panel);
        panel.appendChild(resizer);

        const overlay = mk('div', '');
        overlay.id = 'gg-eye-overlay';
        document.body.appendChild(overlay);

        document.body.appendChild(panel);

        initDrag(btn, panel);
        initDrag(panel, null, header);

        setTimeout(() => refreshOutline(olContent), 1000);
        setInterval(() => { if (state.autoScroll) autoScrollLogic(); }, 500);
    }

    // ==========================================
    // 5. 核心逻辑 (几何算法修复)
    // ==========================================

    function updateThemeIcon(btn) {
        btn.textContent = '';
        // 只有中国风显示灯笼，其他一律小火箭
        if (state.theme === 'china') {
            btn.textContent = '🏮';
        } else {
            btn.appendChild(mkSvg());
        }
    }

    // ★★★ 几何锁定算法：根据位置和大小判断谁是聊天框 ★★★
    function getSafeScroller() {
        // 查找所有可能有滚动条的元素
        const potentials = document.querySelectorAll('infinite-scroller, .conversation-container, main, div');

        for (let el of potentials) {
            // 排除看不见的元素
            if (el.offsetParent === null) continue;

            const rect = el.getBoundingClientRect();

            // 1. 宽度检测：聊天框通常占据屏幕的一半以上，侧边栏通常小于300-400px
            if (rect.width < 450) continue;

            // 2. 位置检测：聊天框左边距通常大于200px (避开左侧边栏)
            if (rect.left < 200) continue;

            // 3. 滚动检测：内容必须超过容器高度
            if (el.scrollHeight > el.clientHeight) {
                // 找到符合几何特征的元素，这必定是主聊天框
                return el;
            }
        }

        // 保底：如果 body 是主滚动条
        if (document.body.scrollHeight > window.innerHeight) return window;
        return null;
    }

    function doSafeScroll(smooth) {
        const scroller = getSafeScroller();
        if (scroller) {
            scroller.scrollTo({ top: scroller.scrollHeight, behavior: smooth ? 'smooth' : 'instant' });
        }
    }

    function autoScrollLogic() {
        const scroller = getSafeScroller();
        if (!scroller) return;

        // 兼容 window 和 element
        const isWin = scroller === window;
        const scrollHeight = isWin ? document.body.scrollHeight : scroller.scrollHeight;
        const scrollTop = isWin ? window.scrollY : scroller.scrollTop;
        const clientHeight = isWin ? window.innerHeight : scroller.clientHeight;

        const dist = scrollHeight - scrollTop - clientHeight;

        // 柔性吸附：距离底部小于 200px 时才滚
        if (dist < 200) {
            scroller.scrollTo({ top: scrollHeight, behavior: 'instant' });
        }
    }

    function toggleEye(btn) {
        state.eyeMode = (state.eyeMode + 1) % 4;
        const ov = document.getElementById('gg-eye-overlay');
        const modes = [
            { t: '👁️ 护眼: 关', c: '', d: 'none' },
            { t: '👁️ 豆沙绿', c: '#e8f5e9', d: 'block', m: 'multiply' },
            { t: '👁️ 护眼黄', c: '#fff3e0', d: 'block', m: 'multiply' },
            { t: '👁️ 夜间灰', c: 'rgba(0,0,0,0.5)', d: 'block', m: 'normal' }
        ];
        const m = modes[state.eyeMode];
        btn.textContent = m.t;
        ov.style.display = m.d;
        ov.style.backgroundColor = m.c;
        if(m.m) ov.style.mixBlendMode = m.m;
    }

    function refreshOutline(box) {
        box.textContent = '';
        const queries = document.querySelectorAll('.user-query-text, .query-text, [data-test-id="user-query"]');
        if (queries.length === 0) {
            box.appendChild(mk('div', 'gg-ol-item', '暂无大纲'));
            return;
        }
        queries.forEach((q, idx) => {
            const txt = q.innerText.split('\n')[0].substring(0, 30);
            const item = mk('div', 'gg-ol-item', `${idx+1}. ${txt}...`);
            item.onclick = () => q.scrollIntoView({ behavior: 'smooth', block: 'center' });
            box.appendChild(item);
        });
    }

    // 拖拽逻辑
    function initDrag(el, trigger, handle) {
        const h = handle || el;
        let isDrag = false, sx, sy, il, it, moved = false;

        if (el.id === 'gg-btn' || el.id === 'gg-panel') {
            const pos = JSON.parse(localStorage.getItem('gg_pos_' + el.id));
            if (pos) { el.style.left = pos.l; el.style.top = pos.t; el.style.right = 'auto'; }
        }

        h.addEventListener('mousedown', e => {
            if(e.button !== 0) return;
            isDrag = true; moved = false;
            sx = e.clientX; sy = e.clientY;
            il = el.offsetLeft; it = el.offsetTop;
            e.preventDefault();
        });

        window.addEventListener('mousemove', e => {
            if (!isDrag) return;
            const dx = e.clientX - sx;
            const dy = e.clientY - sy;
            if(Math.abs(dx)>2 || Math.abs(dy)>2) moved = true;
            el.style.left = (il + dx) + 'px';
            el.style.top = (it + dy) + 'px';
            el.style.right = 'auto';
        });

        window.addEventListener('mouseup', () => {
            if (!isDrag) return;
            isDrag = false;
            localStorage.setItem('gg_pos_' + el.id, JSON.stringify({l: el.style.left, t: el.style.top}));

            if (!moved && trigger) {
                el.style.display = 'none';
                trigger.style.display = 'flex';
                if(trigger.id === 'gg-panel' && !localStorage.getItem('gg_pos_gg-panel')) {
                    trigger.style.left = '50%'; trigger.style.top = '50%';
                    trigger.style.transform = 'translate(-50%, -50%)';
                } else if (trigger.id === 'gg-panel') {
                     trigger.style.transform = 'none';
                }
            }
        });
    }

    function initResize(handle, panel) {
        let isResizing = false, sx, sy, sw, sh;
        handle.addEventListener('mousedown', e => {
            e.stopPropagation(); e.preventDefault();
            isResizing = true;
            sx = e.clientX; sy = e.clientY;
            sw = panel.offsetWidth; sh = panel.offsetHeight;
        });
        window.addEventListener('mousemove', e => {
            if(!isResizing) return;
            const newW = sw + (e.clientX - sx);
            const newH = sh + (e.clientY - sy);
            if (newW > 250) panel.style.width = newW + 'px';
            if (newH > 300) panel.style.height = newH + 'px';
            panel.style.maxHeight = 'none';
        });
        window.addEventListener('mouseup', () => isResizing = false);
    }

    function toggleWide(btn) {
        document.body.classList.toggle('gg-wide');
        btn.classList.toggle('active');
    }

    function toggleAuto(btn) {
        state.autoScroll = !state.autoScroll;
        btn.classList.toggle('active');
    }

    function doCopy(btn) {
        const msgs = document.querySelectorAll('.model-response-text');
        if(!msgs.length) return;
        let txt = msgs[msgs.length-1].innerText.replace(/\*\*(.*?)\*\*/g, '$1');
        navigator.clipboard.writeText(txt).then(() => {
            const old = btn.textContent; btn.textContent = '✅';
            setTimeout(() => btn.textContent = old, 1000);
        });
    }

    function doExport() {
        let md = "# Gemini Chat\n\n" + document.body.innerText;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([md], {type: 'text/markdown'}));
        a.download = `Gemini_${Date.now()}.md`;
        a.click();
    }

    function renderPrompts(container) {
        container.textContent = '';
        state.prompts.forEach(p => {
            const c = mk('div', 'gg-chip', p, { click: () => insertText(p) });
            container.appendChild(c);
        });
        const add = mk('div', 'gg-chip', '+', {
            click: () => {
                const n = prompt("添加快捷词:");
                if(n) { state.prompts.push(n); localStorage.setItem('gg_prompts', JSON.stringify(state.prompts)); renderPrompts(container); }
            }
        });
        add.style.color = '#4caf50';
        container.appendChild(add);
    }

    function insertText(t) {
        const el = document.querySelector('div[contenteditable="true"]');
        if(el) { el.focus(); document.execCommand('insertText', false, t); }
    }

    function getKeyText() {
        const k = state.customKey;
        let s = '';
        if(k.ctrl) s+='Ctrl+'; if(k.alt) s+='Alt+'; if(k.shift) s+='Shift+';
        return '⌨️ 发送: ' + s + k.key;
    }

    function startRecording(btn) {
        state.isRecording = true;
        btn.textContent = '🔴 按键...';
        btn.classList.add('recording');
        const h = (e) => {
            e.preventDefault(); e.stopPropagation();
            if(['Control','Shift','Alt'].includes(e.key)) return;
            state.customKey = { key: e.key, ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey };
            localStorage.setItem('gg_key', JSON.stringify(state.customKey));
            state.isRecording = false;
            btn.classList.remove('recording');
            btn.textContent = getKeyText();
            window.removeEventListener('keydown', h, true);
        };
        window.addEventListener('keydown', h, true);
    }

    function resetPos(btn, panel) {
        btn.style.top = '100px'; btn.style.right = '20px'; btn.style.left = 'auto';
        panel.style.top = '50%'; panel.style.left = '50%'; panel.style.transform = 'translate(-50%, -50%)';
        panel.style.width = '340px'; panel.style.height = 'auto';
        localStorage.removeItem('gg_pos_gg-btn');
        localStorage.removeItem('gg_pos_gg-panel');
        alert('位置与大小已重置');
    }

    window.addEventListener('keydown', e => {
        if(state.isRecording) return;
        const t = e.target;
        if(t.getAttribute('contenteditable')==='true' || t.tagName==='TEXTAREA') {
            const k = state.customKey;
            if(e.key === k.key && e.ctrlKey === k.ctrl && e.altKey === k.alt && e.shiftKey === k.shift) {
                e.preventDefault(); e.stopPropagation();
                const b = document.querySelector('button[aria-label*="Send"], button[aria-label*="发送"]');
                if(b) b.click();
            } else if(e.key==='Enter' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                e.preventDefault(); e.stopPropagation();
                document.execCommand('insertText', false, '\n');
            }
        }
    }, true);

    const obs = new MutationObserver(() => { if(!document.getElementById('gg-btn')) createUI(); });
    obs.observe(document.body, {childList:true, subtree:true});
    createUI();

})();