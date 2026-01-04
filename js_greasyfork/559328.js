// ==UserScript==
// @name         Gemini 美化 - V13.1
// @namespace    http://tampermonkey.net/
// @version      13.1
// @description  修复V13.0中误删壁纸的bug，保留输入框不透明+智能悬浮球+侧边栏透明
// @author       You
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559328/Gemini%20%E7%BE%8E%E5%8C%96%20-%20V131.user.js
// @updateURL https://update.greasyfork.org/scripts/559328/Gemini%20%E7%BE%8E%E5%8C%96%20-%20V131.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const DEFAULT_BG = "https://w.wallhaven.cc/full/wq/wallhaven-wqery6.jpg";

    // --- 1. CSS 样式 ---
    const cssContent = `
        /* 背景层 */
        #custom-bg-layer {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: -1;
            background-size: cover; background-position: center; background-repeat: no-repeat;
            pointer-events: none;
        }

        /* 全局透明 */
        body, html { background-color: transparent !important; }

        /* 内容区透明 */
        main, .main-container, scroll-view, .chat-history-container, .ql-editor {
            background-color: rgba(255, 255, 255, 0.15) !important;
            backdrop-filter: blur(0px);
        }

        /* 侧边栏通用匹配 */
        nav, aside, [role="navigation"],
        [class*="navigation"], [class*="sidebar"], [class*="drawer"] {
            background-color: transparent !important;
            background: transparent !important;
            border-right: none !important;
        }

        /* --- 底部去白线 vs 输入框还原 --- */

        /* 1. 消除底部容器背景 */
        footer, header,
        [class*="footer"], [class*="bottom-container"],
        [class*="gradient"], [class*="scrim"], [class*="mask"] {
            background: transparent !important;
            background-image: none !important;
            border: none !important;
            box-shadow: none !important;
        }

        /* 2. 恢复输入框不透明 (浅灰/深灰) */
        [class*="input-area"], [class*="InputArea"], .input-area-container,
        [class*="text-input"], [role="textbox"], .rich-textarea {
            background-color: #f0f4f9 !important; /* 浅色模式 */
            border-radius: 24px !important;
            opacity: 1 !important;
        }

        *::before, *::after { background-image: none !important; }

        /* 暗黑模式适配 */
        @media (prefers-color-scheme: dark) {
            main, .main-container { background-color: rgba(0, 0, 0, 0.3) !important; }

            /* 暗黑模式输入框 */
            [class*="input-area"], [class*="InputArea"], .input-area-container,
            [class*="text-input"], [role="textbox"], .rich-textarea {
                background-color: #1e1f20 !important;
                color: #e3e3e3 !important;
            }
        }

        /* --- 面板样式 --- */
        #ui-settings-panel {
            position: fixed; top: 20px; right: 20px; width: 260px;
            background: rgba(0, 0, 0, 0.85); color: #fff;
            padding: 16px; border-radius: 12px;
            z-index: 999999; font-family: sans-serif; font-size: 13px;
            border: 1px solid rgba(255,255,255,0.15);
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
            display: flex; flex-direction: column; gap: 12px;
            transition: opacity 0.2s;
        }
        #ui-minimized-icon {
            position: fixed; top: 20px; right: 20px;
            width: 44px; height: 44px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            color: white;
            display: flex; align-items: center; justify-content: center;
            cursor: grab; z-index: 999999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            user-select: none; font-size: 20px;
        }

        .panel-row { display: flex; flex-direction: column; gap: 6px; }
        .panel-label-row { display: flex; justify-content: space-between; color: #ccc; font-size: 12px; font-weight: 500;}
        .panel-input { width: 100%; cursor: pointer; accent-color: #4a90e2; }
        .panel-text { width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #444; background: #222; color: #fff; box-sizing: border-box; font-size: 12px;}
        .panel-btn { width: 100%; padding: 10px; background: #4a90e2; border: none; border-radius: 6px; color: white; cursor: pointer; font-weight: bold; }
        .panel-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 8px; margin-bottom: 4px; }
        .panel-title { font-size: 14px; font-weight: bold; color: white; }
        .panel-min-btn { cursor: pointer; padding: 2px 8px; font-size: 18px; color: #aaa; border-radius: 4px; line-height: 1; }
    `;

    const style = document.createElement('style');
    style.textContent = cssContent;
    document.head.appendChild(style);

    // --- 2. 纯 DOM 构建工具 ---
    function createEl(tag, props = {}, children = []) {
        const el = document.createElement(tag);
        Object.entries(props).forEach(([key, val]) => {
            if (key === 'style' && typeof val === 'object') {
                Object.assign(el.style, val);
            } else if (key === 'textContent') {
                el.textContent = val;
            } else {
                el[key] = val;
            }
        });
        children.forEach(child => {
            if (typeof child === 'string') el.appendChild(document.createTextNode(child));
            else el.appendChild(child);
        });
        return el;
    }

    // --- 3. 核心逻辑 ---
    function init() {
        let bgLayer = document.getElementById('custom-bg-layer');
        if (!bgLayer) {
            bgLayer = document.createElement('div');
            bgLayer.id = 'custom-bg-layer';
            const savedUrl = localStorage.getItem('gemini_bg_url') || DEFAULT_BG;
            bgLayer.style.backgroundImage = `url(${savedUrl})`;
            bgLayer.style.filter = 'blur(0px)';
            document.body.appendChild(bgLayer);
        }

        if (document.getElementById('ui-settings-panel')) return;

        const minIcon = createEl('div', { id: 'ui-minimized-icon', textContent: '🎨', style: { display: 'none' } });
        document.body.appendChild(minIcon);

        const titleText = createEl('span', { className: 'panel-title', textContent: '🎨 美化 (V13.1 修复版)' });
        const minBtn = createEl('span', { className: 'panel-min-btn', textContent: '—', title: '最小化' });
        const header = createEl('div', { className: 'panel-header' }, [titleText, minBtn]);

        // 模糊度
        const blurLabel = createEl('span', { textContent: '背景模糊' });
        const blurVal = createEl('span', { textContent: '0.0px', style: { color: '#4a90e2' } });
        const blurInput = createEl('input', { type: 'range', className: 'panel-input', min: '0', max: '10', step: '0.1', value: '0' });
        blurInput.addEventListener('input', (e) => {
            bgLayer.style.filter = `blur(${e.target.value}px)`;
            blurVal.textContent = e.target.value + 'px';
        });

        // 透明度
        const opLabel = createEl('span', { textContent: '界面白底浓度' });
        const opVal = createEl('span', { textContent: '15%', style: { color: '#4a90e2' } });
        const opInput = createEl('input', { type: 'range', className: 'panel-input', min: '0', max: '100', step: '1', value: '15' });
        opInput.addEventListener('input', (e) => {
            opVal.textContent = e.target.value + '%';
            updateOpacity(e.target.value);
        });

        const urlInput = createEl('input', { type: 'text', className: 'panel-text', placeholder: '输入图片直链...' });
        const saveBtn = createEl('button', { className: 'panel-btn', textContent: '应用' });
        saveBtn.addEventListener('click', () => {
            if (urlInput.value) {
                localStorage.setItem('gemini_bg_url', urlInput.value);
                bgLayer.style.backgroundImage = `url(${urlInput.value})`;
            }
        });

        const panel = createEl('div', { id: 'ui-settings-panel' }, [
            header,
            createEl('div', { className: 'panel-row' }, [createEl('div', { className: 'panel-label-row' }, [blurLabel, blurVal]), blurInput]),
            createEl('div', { className: 'panel-row' }, [createEl('div', { className: 'panel-label-row' }, [opLabel, opVal]), opInput]),
            createEl('div', { className: 'panel-row' }, [urlInput, saveBtn])
        ]);
        document.body.appendChild(panel);

        // 交互逻辑
        minBtn.addEventListener('click', () => {
            panel.style.display = 'none';
            minIcon.style.display = 'flex';
        });

        let isDragging = false, offsetX, offsetY;

        minIcon.addEventListener('click', () => {
            if (!isDragging) {
                const iconRect = minIcon.getBoundingClientRect();
                minIcon.style.display = 'none';
                panel.style.display = 'flex';

                const panelWidth = 260;
                const panelHeight = 350;
                const screenW = window.innerWidth;
                const screenH = window.innerHeight;
                let newLeft, newTop;

                if (iconRect.left > screenW / 2) newLeft = iconRect.left - panelWidth - 15;
                else newLeft = iconRect.right + 15;

                newTop = iconRect.top;
                if (newTop + panelHeight > screenH) newTop = screenH - panelHeight - 20;
                if (newTop < 20) newTop = 20;

                if (newLeft < 10) newLeft = 10;
                if (newLeft + panelWidth > screenW) newLeft = screenW - panelWidth - 10;

                panel.style.top = newTop + 'px';
                panel.style.left = newLeft + 'px';
                panel.style.right = 'auto';
            }
        });

        minIcon.addEventListener('mousedown', (e) => {
            isDragging = false; const rect = minIcon.getBoundingClientRect();
            offsetX = e.clientX - rect.left; offsetY = e.clientY - rect.top;
            document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
        });
        function onMouseMove(e) {
            isDragging = true; e.preventDefault();
            let l = e.clientX - offsetX; let t = e.clientY - offsetY;
            l = Math.max(0, Math.min(l, window.innerWidth - 44));
            t = Math.max(0, Math.min(t, window.innerHeight - 44));
            minIcon.style.left = l + 'px'; minIcon.style.top = t + 'px'; minIcon.style.right = 'auto';
        }
        function onMouseUp() { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); setTimeout(() => isDragging = false, 100); }
    }

    // --- 4. 智能猎人 (修复Bug版) ---
    function smartCleaner(opacityVal = 15) {
        const allDivs = document.body.getElementsByTagName('div');
        const screenHeight = window.innerHeight;
        const screenWidth = window.innerWidth;
        const op = opacityVal / 100;

        for (let div of allDivs) {
            // 【核心修复】白名单：绝不误删壁纸层和面板
            if (div.id === 'custom-bg-layer' || div.id === 'ui-settings-panel' || div.id === 'ui-minimized-icon') continue;
            // 也不要误删我们的面板内部元素
            if (div.closest && div.closest('#ui-settings-panel')) continue;

            const rect = div.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) continue;
            const style = window.getComputedStyle(div);
            const hasBg = (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') || (style.backgroundImage !== 'none');
            if (!hasBg) continue;

            // 1. 侧边栏主体
            if (rect.height > screenHeight * 0.8 && rect.left < 50 && rect.width < 400) {
                div.style.setProperty('background-color', `rgba(255, 255, 255, ${op})`, 'important');
                div.style.setProperty('background', `rgba(255, 255, 255, ${op})`, 'important');
            }

            // 2. 底部全宽白线条 (Footer)
            // 必须排除输入框！输入框通常高度 < 100，但 Footer 可能也是。
            // 输入框通常 class 包含 input, textarea 等。
            // 但这里我们用位置判断：Footer container 通常是全屏宽度的
            if (rect.width > screenWidth * 0.9 && rect.bottom > screenHeight - 100) {
                 div.style.setProperty('background', 'transparent', 'important');
                 div.style.setProperty('border', 'none', 'important');
            }

            // 3. 角落渐变遮罩 (左上 + 左下)
            const isTopLeft = rect.top < 100 && rect.left < 300;
            const isBottomLeft = rect.bottom > screenHeight - 100 && rect.left < 300;
            // 增加宽度限制，防止误删输入框 (输入框宽度通常 > 500)
            if ((isTopLeft || isBottomLeft) && rect.height < 150 && rect.width < 300) {
                 div.style.setProperty('background', 'transparent', 'important');
                 div.style.setProperty('background-image', 'none', 'important');
                 div.style.setProperty('box-shadow', 'none', 'important');
                 div.style.setProperty('border', 'none', 'important');
            }
        }
    }

    function updateOpacity(val) {
        const opacity = val / 100;
        const id = 'dynamic-op-style';
        let style = document.getElementById(id);
        if (!style) { style = document.createElement('style'); style.id = id; document.head.appendChild(style); }

        style.textContent = `
            main, .main-container, nav, aside, [role="navigation"] {
                background-color: rgba(255, 255, 255, ${opacity}) !important;
            }
            @media (prefers-color-scheme: dark) {
                main, nav, aside { background-color: rgba(0, 0, 0, ${opacity}) !important; }
            }
        `;
        smartCleaner(val);
    }

    setTimeout(() => {
        init();
        updateOpacity(15);
        setInterval(() => {
            const opInput = document.querySelector('input[type="range"][max="100"]');
            const val = opInput ? opInput.value : 15;
            smartCleaner(val);
        }, 800);
    }, 1500);

})();