// ==UserScript==
// @name         Gemini 沉浸式阅读伴侣 | Immersive Reader
// @namespace    http://tampermonkey.net/
// @version      1.02
// @license      All Rights Reserved
// @description  让 Gemini 变身微信读书：一键解锁沉浸式护眼阅读、自动生成侧边目录、修复 Markdown 加粗显示，打造极致 AI 阅读流。
// @author       Jackey（有问题联系我，微信：ui1945)
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558217/Gemini%20%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB%E4%BC%B4%E4%BE%A3%20%7C%20Immersive%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/558217/Gemini%20%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB%E4%BC%B4%E4%BE%A3%20%7C%20Immersive%20Reader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 资源加载 ---
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://npm.elemecdn.com/lxgw-wenkai-screen-web/style.css';
    document.head.appendChild(fontLink);

    const googleFont = document.createElement('link');
    googleFont.rel = 'stylesheet';
    googleFont.href = 'https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300..700;1,300..700&display=swap';
    document.head.appendChild(googleFont);

    // --- 2. 配置管理 ---
    const defaultConfig = {
        theme: 'yellow',
        fontType: 'serif',
        fontSize: 19,
        maxWidth: 900,
        hideFooter: true,
        publicStyle: false,
        publicColor: 'yellow',
        publicType: 'half'
    };
    let stored = JSON.parse(localStorage.getItem('gemini_reader_config') || '{}');
    let config = { ...defaultConfig, ...stored };
    if (!config.publicType) config.publicType = 'half';

    // --- 3. 核心样式 ---
    const css = `
        :root {
            /* === 基础变量 === */
            --w-bg: #fff;
            --w-text: #333;
            --w-font: "Source Han Serif SC", "Noto Serif CJK SC", "Songti SC", serif;
            --w-accent-bg: #fff;
            --w-accent-text: #333;
            --w-sidebar-text: #000;
            --w-input-bg: #fff;
            --w-footer-display: none;
            --w-input-radius: 28px;
            --w-pub-high: rgba(255, 235, 59, 0.6);
            --w-pub-accent: #fbe204;
            --w-pub-text-on-high: inherit;

            /* 布局变量 */
            --w-toc-width: 280px;
        }

        /* === 1. 基因锁破解 === */
        :root, body, .theme-host, :where(.theme-host) {
            --bard-color-synthetic--chat-window-surface: var(--w-bg) !important;
            --gem-sys-color--surface: var(--w-bg) !important;
            --gem-sys-color--surface-variant: var(--w-bg) !important;
            --gem-sys-color--surface-container: var(--w-bg) !important;
            --gem-sys-color--surface-container-high: var(--w-bg) !important;
            --gem-sys-color--surface-container-low: var(--w-bg) !important;
            background-color: var(--w-bg) !important;
            color: var(--w-text) !important;
        }

        /* === 2. 容器透明化 === */
        gemini-app, main, infinite-scroller,
        .conversation-container, .response-container, .inner-container,
        .scroll-container, .input-area-container, .mat-drawer-container,
        mat-sidenav, .mat-drawer, .mat-drawer-inner-container,
        .chat-history, .explore-gems-container, conversations-list, bot-list,
        .overflow-container, mat-action-list, mat-nav-list,
        .conversation-items-container, side-nav-action-button,
        bard-sidenav, input-container
        {
            background: transparent !important;
            background-color: transparent !important;
        }

        /* === 3. 输入框修复 === */
        .input-gradient, input-container.input-gradient { background: transparent !important; pointer-events: auto !important; }
        .top-gradient-container, .scroll-container::after, .scroll-container::before { display: none !important; }
        .input-area-container { padding-bottom: 40px !important; margin-bottom: 10px !important; }

        /* === 4. 输入框美化 (含半透明磨砂效果) === */
        .input-area {
            border-radius: 32px !important;
            background-color: var(--w-input-bg) !important;
            border: 1px solid rgba(0,0,0,0.08) !important;
            overflow: hidden !important;
            transition: background-color 0.3s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
            backdrop-filter: blur(10px) !important;
        }
        .text-input-field, .ql-editor, .ql-container { border-radius: 0 !important; background: transparent !important; border: none !important; }

        /* === 5. 侧边栏深度净化 === */
        bard-sidenav .bot-new-conversation-button, bard-sidenav .mat-mdc-list-item-interactive, bard-sidenav button { background: transparent !important; border: none !important; box-shadow: none !important; }
        bard-sidenav .bot-new-conversation-button:hover, bard-sidenav .mat-mdc-list-item-interactive:hover { background-color: rgba(0,0,0,0.05) !important; border-radius: 12px !important; }
        bard-sidenav .conversation.selected { background-color: var(--w-accent-bg) !important; border-radius: 12px !important; box-shadow: 0 2px 5px rgba(0,0,0,0.03) !important; }
        bard-sidenav, bard-sidenav span, bard-sidenav mat-icon, .conversation-title, .bot-name, .gds-body-m { color: var(--w-sidebar-text) !important; }

        /* === 6. 撞色设计 === */
        .user-query-bubble-with-background, .user-query-container .query-content {
            background-color: var(--w-accent-bg) !important;
            color: var(--w-accent-text) !important;
            border-radius: 16px !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;
            border: 1px solid rgba(0,0,0,0.03) !important;
        }
        code, .code-container, pre {
            background-color: var(--w-accent-bg) !important;
            color: var(--w-text) !important;
            border-radius: 12px !important;
            font-family: "JetBrains Mono", Consolas, monospace !important;
            border: 1px solid rgba(0,0,0,0.05) !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.03) !important;
        }

        /* === 7. 排版细节 === */
        body, p, li, h1, h2, h3, div, span, button, input { font-family: var(--w-font) !important; }
        main p, .model-response-text p {
            font-size: ${config.fontSize}px !important;
            line-height: 1.8 !important;
            text-align: justify !important;
            margin-bottom: 1.5em !important;
            color: var(--w-text) !important;
        }
        /* [V1.05 调整] 恢复标准粗体
           去除之前的 font-weight: 900 !important;
           只使用 bold，让字体库自己决定最佳粗细
        */
        .query-text-line b, .query-text-line strong,
        .model-response-text b, .model-response-text strong {
             font-weight: bold !important;
             color: inherit !important;
        }

        body[data-theme="dark"] h3, body[data-theme="dark"] ul, body[data-theme="dark"] ol, body[data-theme="dark"] li::marker { color: #e0e0e0 !important; }
        hallucination-disclaimer, .hallucination-disclaimer, .footer-container { display: var(--w-footer-display) !important; opacity: 0.3; }

        /* === 8. 布局逻辑 === */

        /* A. 默认状态：居中 */
        main {
            transition: padding-right 0.4s cubic-bezier(0.2, 0, 0, 1) !important;
            box-sizing: border-box !important;
        }
        .conversation-container, .response-container, .inner-container, .input-area-container {
            max-width: ${config.maxWidth}px !important;
            margin: 0 auto !important;
            transition: max-width 0.4s ease, margin 0.4s ease, width 0.4s ease !important;
        }

        /* B. 目录展开状态 */
        body.toc-open main {
            padding-right: 320px !important;
        }

        /* 对话框体 */
        body.toc-open .conversation-container,
        body.toc-open .response-container,
        body.toc-open .inner-container {
            width: auto !important;
            max-width: ${config.maxWidth}px !important;
        }

        /* 底部输入框 */
        body.toc-open .input-area-container {
            width: calc(100% - 20px) !important;
            margin-right: 320px !important;
            margin-left: auto !important;
            max-width: 100% !important;
            min-width: 400px !important;
        }

        /* 修复跳转定位 */
        .model-response-text h1, .model-response-text h2, .model-response-text h3, .user-query-container {
            scroll-margin-top: 80px !important;
        }

        /* === 9. 智能配色 === */
        body[data-pub-color="yellow"] { --w-pub-high: rgba(255, 235, 59, 0.6); --w-pub-accent: #fbc02d; --w-pub-text-on-high: #000; }
        body[data-theme="green"][data-pub-color="yellow"] { --w-pub-high: rgba(255, 215, 0, 0.6); --w-pub-accent: #f57f17; }
        body[data-theme="dark"][data-pub-color="yellow"] { --w-pub-high: rgba(255, 235, 59, 0.4); --w-pub-accent: #fff176; --w-pub-text-on-high: #fff; }

        body[data-pub-color="blue"] { --w-pub-high: rgba(144, 202, 249, 0.6); --w-pub-accent: #1976d2; --w-pub-text-on-high: #000; }
        body[data-theme="green"][data-pub-color="blue"] { --w-pub-high: rgba(33, 150, 243, 0.4); --w-pub-accent: #1565c0; }
        body[data-theme="dark"][data-pub-color="blue"] { --w-pub-high: rgba(66, 165, 245, 0.4); --w-pub-accent: #90caf9; --w-pub-text-on-high: #fff; }

        body[data-pub-color="pink"] { --w-pub-high: rgba(244, 143, 177, 0.6); --w-pub-accent: #d81b60; --w-pub-text-on-high: #000; }
        body[data-theme="green"][data-pub-color="pink"] { --w-pub-high: rgba(233, 30, 99, 0.3); --w-pub-accent: #ad1457; }
        body[data-theme="dark"][data-pub-color="pink"] { --w-pub-high: rgba(240, 98, 146, 0.4); --w-pub-accent: #f48fb1; --w-pub-text-on-high: #fff; }

        body[data-pub-color="green"] { --w-pub-high: rgba(165, 214, 167, 0.6); --w-pub-accent: #388e3c; --w-pub-text-on-high: #000; }
        body[data-theme="green"][data-pub-color="green"] { --w-pub-high: rgba(255, 255, 255, 0.5); --w-pub-accent: #2e7d32; }
        body[data-theme="dark"][data-pub-color="green"] { --w-pub-high: rgba(129, 199, 132, 0.4); --w-pub-accent: #a5d6a7; --w-pub-text-on-high: #fff; }

        /* === 10. 公众号排版 === */
        body[data-public-style="true"] main h1, body[data-public-style="true"] .model-response-text h1,
        body[data-public-style="true"] main h2, body[data-public-style="true"] .model-response-text h2 {
            border-left: 5px solid var(--w-pub-accent) !important;
            background: linear-gradient(to right, rgba(0,0,0,0.03), transparent) !important;
            padding: 10px 15px !important;
            border-radius: 0 8px 8px 0 !important;
            margin-top: 30px !important; margin-bottom: 20px !important;
            font-weight: bold !important; color: inherit !important;
        }
        body[data-theme="dark"][data-public-style="true"] main h2 { background: linear-gradient(to right, rgba(255,255,255,0.05), transparent) !important; }

        body[data-public-style="true"] main strong, body[data-public-style="true"] main b,
        body[data-public-style="true"] .model-response-text strong, body[data-public-style="true"] .model-response-text b {
            padding: 0 3px !important; border-radius: 4px !important; color: inherit !important; background: none;
        }
        body[data-public-style="true"][data-pub-type="half"] main strong, body[data-public-style="true"][data-pub-type="half"] main b,
        body[data-public-style="true"][data-pub-type="half"] .model-response-text strong, body[data-public-style="true"][data-pub-type="half"] .model-response-text b {
            background: linear-gradient(to bottom, transparent 55%, var(--w-pub-high) 0) !important;
        }
        body[data-public-style="true"][data-pub-type="full"] main strong, body[data-public-style="true"][data-pub-type="full"] main b,
        body[data-public-style="true"][data-pub-type="full"] .model-response-text strong, body[data-public-style="true"][data-pub-type="full"] .model-response-text b {
            background-color: var(--w-pub-high) !important; color: var(--w-pub-text-on-high) !important;
        }
        body[data-public-style="true"] main blockquote, body[data-public-style="true"] .model-response-text blockquote {
            background-color: rgba(0,0,0,0.03) !important; border-left: 4px solid var(--w-pub-accent) !important;
            padding: 15px !important; border-radius: 8px !important; margin: 20px 0 !important;
        }
        body[data-theme="dark"][data-public-style="true"] main blockquote { background-color: rgba(255,255,255,0.05) !important; }
        body[data-public-style="true"] main ul, body[data-public-style="true"] main ol,
        body[data-public-style="true"] .model-response-text ul, body[data-public-style="true"] .model-response-text ol {
            background: rgba(0,0,0,0.02) !important; padding: 15px 15px 15px 35px !important;
            border-radius: 10px !important; border: 1px dashed rgba(0,0,0,0.1) !important; margin-bottom: 20px !important;
        }
        body[data-theme="dark"][data-public-style="true"] main ul { background: rgba(255,255,255,0.03) !important; border-color: rgba(255,255,255,0.1) !important; }

        /* === UI 组件: 悬浮球 & 设置面板 & 目录 === */
        #wx-fab { position: fixed; bottom: 80px; right: 30px; width: 44px; height: 44px; background: #333; color: #fff; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; cursor: move; z-index: 999999; font-size: 20px; user-select: none; transition: opacity 0.3s; opacity: 0.4; }
        #wx-fab:hover { opacity: 1; transform: scale(1.1); }

        #wx-toc-fab { position: fixed; bottom: 135px; right: 30px; width: 44px; height: 44px; background: #fff; color: #333; border: 1px solid #ddd; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999999; font-size: 18px; user-select: none; transition: all 0.3s; opacity: 0.6; }
        #wx-toc-fab:hover { opacity: 1; transform: scale(1.1); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }

        /* 目录面板 */
        #wx-toc-panel {
            position: fixed; top: 80px; right: -320px; width: var(--w-toc-width); max-height: 70vh;
            background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);
            border-radius: 16px;
            box-shadow: 0 0 20px rgba(0,0,0,0.08);
            z-index: 999998;
            padding: 20px 10px 20px 20px;
            overflow-y: auto;
            transition: right 0.4s cubic-bezier(0.19, 1, 0.22, 1);
            display: flex; flex-direction: column; gap: 8px;
            font-size: 14px; color: #333;
            border: 1px solid rgba(0,0,0,0.05);
        }
        #wx-toc-panel.active { right: 20px; }
        body[data-theme="dark"] #wx-toc-panel { background: rgba(30,30,30,0.95); border-color: rgba(255,255,255,0.1); color: #ccc; }

        /* 目录顶部栏 */
        .wx-toc-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 10px; margin-bottom: 10px; }
        .wx-toc-title { font-weight: bold; font-size: 16px; }
        .wx-toc-close { cursor: pointer; color: #999; font-size: 18px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s; }
        .wx-toc-close:hover { background: rgba(0,0,0,0.05); color: #333; }

        /* 目录项样式 */
        .wx-toc-item { cursor: pointer; padding: 6px 10px; border-radius: 6px; transition: background 0.2s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .wx-toc-item:hover { background: rgba(0,0,0,0.05); }
        .wx-toc-h1 { font-weight: bold; font-size: 14px; margin-top: 10px; color: var(--w-sidebar-text); border-left: 3px solid var(--w-pub-accent); padding-left: 8px; }
        .wx-toc-h2 { padding-left: 20px; font-size: 13px; opacity: 0.9; }
        .wx-toc-h3 { padding-left: 35px; font-size: 12px; opacity: 0.7; }
        .wx-toc-user {
            font-weight: bold; background: var(--w-accent-bg); color: var(--w-accent-text);
            margin-top: 15px; margin-bottom: 5px; padding: 8px 10px; border-radius: 8px;
            font-size: 13px; border: 1px solid rgba(0,0,0,0.05);
        }
        body[data-theme="dark"] .wx-toc-item:hover { background: rgba(255,255,255,0.1); }
        .wx-toc-empty { text-align: center; color: #999; margin-top: 20px; font-size: 13px; }

        #wx-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 380px; background: #fff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.25); padding: 25px; z-index: 1000000; display: none; flex-direction: column; gap: 20px; font-family: system-ui, -apple-system, sans-serif !important; color: #333; }
        #wx-panel.active { display: flex; }
        #wx-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); z-index: 999999; display: none; backdrop-filter: blur(2px); }
        #wx-overlay.active { display: block; }
        .wx-row-label { font-size: 14px; color: #888; margin-bottom: 8px; }
        .wx-flex-row { display: flex; gap: 10px; align-items: center; }
        .wx-color-btn { flex: 1; height: 40px; border-radius: 10px; cursor: pointer; border: 2px solid transparent; }
        .wx-color-btn.active { border-color: #333; transform: scale(0.95); }
        .wx-font-btn { flex: 1; padding: 10px 0; text-align: center; background: #f5f5f5; border-radius: 12px; font-size: 13px; cursor: pointer; color: #333; }
        .wx-font-btn.active { background: #333; color: #fff; }
        .wx-num-input { width: 50px; padding: 5px; border: 1px solid #ddd; border-radius: 6px; text-align: center; }
        input[type=range] { flex: 1; accent-color: #333; }
        .wx-switch-row { display: flex; justify-content: space-between; align-items: center; margin-top: 5px; }
        .wx-style-dot { width: 30px; height: 30px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: transform 0.2s; position: relative; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .wx-style-dot:hover { transform: scale(1.1); }
        .wx-style-dot.active { border-color: #333; transform: scale(1.1); }
        #wx-style-row { display: none; margin-top: 10px; padding-left: 5px; gap: 15px; align-items: center; justify-content: space-between;}
        #wx-style-row.visible { display: flex; animation: fadeIn 0.3s; }
        .wx-type-switch { display: flex; background: #f0f0f0; border-radius: 15px; padding: 2px; }
        .wx-type-btn { padding: 4px 12px; font-size: 12px; cursor: pointer; border-radius: 12px; color: #666; transition: all 0.2s;}
        .wx-type-btn.active { background: #fff; color: #000; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-weight: bold; }

        @keyframes fadeIn { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }
    `;
    GM_addStyle(css);

    // --- 4. 辅助函数 ---
    function createEl(tag, className, text) { const el = document.createElement(tag); if (className) el.className = className; if (text) el.textContent = text; return el; }

    // --- 5. UI 构建 (设置面板) ---
    function buildPanel() {
        if (document.getElementById('wx-panel')) return;
        const overlay = createEl('div'); overlay.id = 'wx-overlay'; overlay.onclick = closePanel; document.body.appendChild(overlay);
        const panel = createEl('div'); panel.id = 'wx-panel'; document.body.appendChild(panel);
        const closeBtn = createEl('div', null, '✕'); closeBtn.style.cssText = "position:absolute; top:20px; right:20px; cursor:pointer; font-weight:bold; color:#ccc; font-size:18px;"; closeBtn.onclick = closePanel; panel.appendChild(closeBtn);

        // 背景
        const row1 = createEl('div'); row1.appendChild(createEl('div', 'wx-row-label', '背景主题'));
        const colorContainer = createEl('div', 'wx-flex-row');
        const colors = [ { id: 'white', bg: '#fff', border: '1px solid #eee' }, { id: 'yellow', bg: '#f6f1e7' }, { id: 'green', bg: '#cce8cf' }, { id: 'dark', bg: '#222' } ];
        colors.forEach(c => { const btn = createEl('div', 'wx-color-btn'); btn.style.background = c.bg; if(c.border) btn.style.border = c.border; btn.dataset.val = c.id; btn.onclick = () => { config.theme = c.id; applyConfig(); updateUIState(); }; colorContainer.appendChild(btn); });
        row1.appendChild(colorContainer); panel.appendChild(row1);

        // 字号
        const row2 = createEl('div'); row2.appendChild(createEl('div', 'wx-row-label', '字体大小 (px)'));
        const fontRow = createEl('div', 'wx-flex-row');
        const slider = createEl('input'); slider.type = 'range'; slider.min = 14; slider.max = 30; slider.step = 1; slider.value = config.fontSize; slider.id = 'wx-fs-slider';
        const numInput = createEl('input', 'wx-num-input'); numInput.type = 'number'; numInput.value = config.fontSize; numInput.id = 'wx-fs-input';
        slider.oninput = (e) => { config.fontSize = parseInt(e.target.value); numInput.value = config.fontSize; applyConfig(); };
        numInput.oninput = (e) => { let val = parseInt(e.target.value); if(val){ config.fontSize = val; slider.value = val; applyConfig(); }};
        fontRow.appendChild(createEl('span', null, 'A-')); fontRow.appendChild(slider); fontRow.appendChild(createEl('span', null, 'A+')); fontRow.appendChild(numInput);
        row2.appendChild(fontRow); panel.appendChild(row2);

        // 宽度
        const row4 = createEl('div'); row4.appendChild(createEl('div', 'wx-row-label', '阅读宽度 (px)'));
        const widthRow = createEl('div', 'wx-flex-row');
        const wSlider = createEl('input'); wSlider.type = 'range'; wSlider.min = 600; wSlider.max = 1600; wSlider.step = 50; wSlider.value = config.maxWidth; wSlider.id = 'wx-wd-slider';
        const wInput = createEl('input', 'wx-num-input'); wInput.type = 'number'; wInput.value = config.maxWidth; wInput.id = 'wx-wd-input';
        wSlider.oninput = (e) => { config.maxWidth = parseInt(e.target.value); wInput.value = config.maxWidth; applyConfig(); };
        wInput.oninput = (e) => { let val = parseInt(e.target.value); if(val){ config.maxWidth = val; wSlider.value = val; applyConfig(); }};
        widthRow.appendChild(createEl('span', null, '窄')); widthRow.appendChild(wSlider); widthRow.appendChild(createEl('span', null, '宽')); widthRow.appendChild(wInput);
        row4.appendChild(widthRow); panel.appendChild(row4);

        // 字体 (Jost)
        const row3 = createEl('div'); row3.appendChild(createEl('div', 'wx-row-label', '字体风格'));
        const fontContainer = createEl('div', 'wx-flex-row');
        const fonts = [
            { id: 'sans', name: '思源黑体' },
            { id: 'serif', name: '思源宋体' },
            { id: 'wenkai', name: '霞鹜文楷' },
            { id: 'jost', name: 'Jost' }
        ];
        fonts.forEach(f => { const btn = createEl('div', 'wx-font-btn', f.name); btn.dataset.val = f.id; btn.onclick = () => { config.fontType = f.id; applyConfig(); updateUIState(); }; fontContainer.appendChild(btn); });
        row3.appendChild(fontContainer); panel.appendChild(row3);

        // 底部开关
        const row6 = createEl('div', 'wx-switch-row'); row6.appendChild(createEl('span', null, '隐藏底部免责声明'));
        const footerCheck = createEl('input'); footerCheck.type = 'checkbox'; footerCheck.id = 'wx-footer-check'; footerCheck.checked = config.hideFooter;
        footerCheck.onchange = (e) => { config.hideFooter = e.target.checked; applyConfig(); };
        row6.appendChild(footerCheck); panel.appendChild(row6);

        // 公众号风格开关
        const row7 = createEl('div', 'wx-switch-row'); row7.appendChild(createEl('span', null, '公众号排版风格'));
        const publicCheck = createEl('input'); publicCheck.type = 'checkbox'; publicCheck.id = 'wx-public-check'; publicCheck.checked = config.publicStyle;
        publicCheck.onchange = (e) => { config.publicStyle = e.target.checked; applyConfig(); updateUIState(); };
        row7.appendChild(publicCheck); panel.appendChild(row7);

        // 样式自定义行
        const rowStyle = createEl('div'); rowStyle.id = 'wx-style-row';
        const colorZone = createEl('div', 'wx-flex-row'); colorZone.style.gap = '8px';
        const styles = [ { id: 'yellow', bg: '#fdd835' }, { id: 'blue', bg: '#64b5f6' }, { id: 'pink', bg: '#f06292' }, { id: 'green', bg: '#81c784' } ];
        styles.forEach(s => { const dot = createEl('div', 'wx-style-dot'); dot.style.backgroundColor = s.bg; dot.dataset.val = s.id; dot.onclick = () => { config.publicColor = s.id; applyConfig(); updateUIState(); }; colorZone.appendChild(dot); });
        const typeSwitch = createEl('div', 'wx-type-switch');
        const typeHalf = createEl('div', 'wx-type-btn', '半覆盖'); typeHalf.dataset.val = 'half'; typeHalf.onclick = () => { config.publicType = 'half'; applyConfig(); updateUIState(); };
        const typeFull = createEl('div', 'wx-type-btn', '全覆盖'); typeFull.dataset.val = 'full'; typeFull.onclick = () => { config.publicType = 'full'; applyConfig(); updateUIState(); };
        typeSwitch.appendChild(typeHalf); typeSwitch.appendChild(typeFull);
        rowStyle.appendChild(colorZone); rowStyle.appendChild(typeSwitch);
        panel.appendChild(rowStyle);

        updateUIState();
    }

    // --- 6. 悬浮球 ---
    function createFab() {
        if(document.getElementById('wx-fab')) return;

        // 设置按钮
        const fab = createEl('div'); fab.id = 'wx-fab'; fab.textContent = '⚙️'; fab.title = '阅读设置';
        let isDragging = false, startX, startY, initialLeft, initialTop;
        fab.onmousedown = (e) => { isDragging = false; startX = e.clientX; startY = e.clientY; initialLeft = fab.offsetLeft; initialTop = fab.offsetTop; document.onmousemove = onMouseMove; document.onmouseup = onMouseUp; };
        function onMouseMove(e) { if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) { isDragging = true; fab.style.left = (initialLeft + e.clientX - startX) + 'px'; fab.style.top = (initialTop + e.clientY - startY) + 'px'; fab.style.bottom = 'auto'; fab.style.right = 'auto'; } }
        function onMouseUp(e) { document.onmousemove = null; document.onmouseup = null; if (!isDragging) openPanel(); }
        document.body.appendChild(fab);

        // 目录按钮
        const tocFab = createEl('div'); tocFab.id = 'wx-toc-fab'; tocFab.textContent = '📑'; tocFab.title = '内容目录';
        tocFab.onclick = toggleTocPanel;
        document.body.appendChild(tocFab);
    }

    // --- 7. 目录核心逻辑 ---
    function buildTocPanel() {
        if (document.getElementById('wx-toc-panel')) return;
        const panel = createEl('div'); panel.id = 'wx-toc-panel';

        const header = createEl('div', 'wx-toc-header');
        const title = createEl('div', 'wx-toc-title', '目录');
        const close = createEl('div', 'wx-toc-close', '✕');
        close.title = "关闭目录";
        close.onclick = toggleTocPanel;

        header.appendChild(title);
        header.appendChild(close);
        panel.appendChild(header);

        const list = createEl('div'); list.id = 'wx-toc-list';
        panel.appendChild(list);
        document.body.appendChild(panel);
    }

    function toggleTocPanel() {
        buildTocPanel();
        const panel = document.getElementById('wx-toc-panel');
        const body = document.body;

        if (panel.classList.contains('active')) {
            panel.classList.remove('active');
            body.classList.remove('toc-open');
        } else {
            generateTocContent();
            panel.classList.add('active');
            body.classList.add('toc-open');
        }
    }

    // [V1.11] 智能滚动容器探测器 (Smart Scroll Finder)
    function findScrollableParent(element) {
        let parent = element.parentElement;
        while (parent) {
            const style = window.getComputedStyle(parent);
            if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
                return parent;
            }
            parent = parent.parentElement;
        }
        return document.scrollingElement || document.body;
    }

    // [V1.11] 丝滑极速滚动算法 (兼容版)
    function fastSmoothScroll(element, offset = 80) {
        try {
            const container = findScrollableParent(element);

            if (container !== document.body && container !== document.documentElement) {
                const elementTop = element.getBoundingClientRect().top;
                const containerTop = container.getBoundingClientRect().top;
                const currentScroll = container.scrollTop;
                const targetScroll = currentScroll + (elementTop - containerTop) - offset;
                const distance = targetScroll - currentScroll;
                const duration = 400;
                let start = null;

                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percentage = 1 - Math.pow(1 - Math.min(progress / duration, 1), 3);
                    container.scrollTop = currentScroll + distance * percentage;
                    if (progress < duration) window.requestAnimationFrame(step);
                }
                window.requestAnimationFrame(step);
            }
            else {
                const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 400;
                let start = null;

                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percentage = 1 - Math.pow(1 - Math.min(progress / duration, 1), 3);
                    window.scrollTo(0, startPosition + distance * percentage);
                    if (progress < duration) window.requestAnimationFrame(step);
                }
                window.requestAnimationFrame(step);
            }
        } catch (e) {
            console.warn('FastScroll failed, using native scroll.', e);
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // [V1.04 深度修复] 文本渲染与清洗引擎 (Logic Unchanged, Visual Weight Reduced)
    function cleanAndRenderText(rootNode) {
        if (!rootNode) return;

        // 1. [清洗模式] 剔除已经加粗元素中的“幽灵星号”
        const boldElements = rootNode.querySelectorAll ?
              rootNode.querySelectorAll('b, strong') : [];

        boldElements.forEach(el => {
             const text = el.textContent;
             // 如果内容以 ** 开头并以 ** 结尾，则去除它们
             if (text.length > 4 && text.startsWith('**') && text.endsWith('**')) {
                 el.textContent = text.slice(2, -2);
             }
        });

        // 2. [渲染模式] 查找纯文本中的 Markdown 并转换
        const targets = rootNode.querySelectorAll ?
              rootNode.querySelectorAll('.query-text-line, .model-response-text p, .model-response-text li') :
              [rootNode];

        targets.forEach(el => {
            if (!el.textContent || !el.textContent.includes('**')) return;

            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
            const textNodes = [];
            let node;
            while(node = walker.nextNode()) {
                if (node.nodeValue.includes('**')) {
                    textNodes.push(node);
                }
            }

            textNodes.forEach(textNode => {
                const text = textNode.nodeValue;
                const parts = text.split(/(\*\*[\s\S]+?\*\*)/g);

                if (parts.length > 1) {
                    const fragment = document.createDocumentFragment();
                    parts.forEach(part => {
                        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                            const b = document.createElement('b');
                            b.textContent = part.slice(2, -2); // 转换时顺便去掉星号
                            fragment.appendChild(b);
                        } else {
                            fragment.appendChild(document.createTextNode(part));
                        }
                    });
                    textNode.parentNode.replaceChild(fragment, textNode);
                }
            });
        });
    }

    // 生成目录内容
    function generateTocContent() {
        const listContainer = document.getElementById('wx-toc-list');
        if (!listContainer) return;
        listContainer.replaceChildren();

        const mainContainer = document.querySelector('main');
        if (!mainContainer) {
            listContainer.appendChild(createEl('div', 'wx-toc-empty', '未找到内容'));
            return;
        }

        const allNodes = mainContainer.querySelectorAll('.query-text.gds-body-l, .model-response-text');

        if (allNodes.length === 0) {
            listContainer.appendChild(createEl('div', 'wx-toc-empty', '暂无对话'));
            return;
        }

        let hasContent = false;
        let lastText = "";

        allNodes.forEach(node => {
            if (node.classList.contains('query-text')) {
                const lines = node.querySelectorAll('.query-text-line');
                let fullText = "";
                lines.forEach(line => fullText += line.textContent + " ");
                fullText = fullText.trim().replace(/\s+/g, ' ');

                if (fullText === lastText || !fullText) return;
                lastText = fullText;

                const item = createEl('div', 'wx-toc-item wx-toc-user', fullText.substring(0, 15) + (fullText.length > 15 ? '...' : ''));
                const scrollTarget = node.closest('.user-query-container') || node;
                item.onclick = () => fastSmoothScroll(scrollTarget);
                listContainer.appendChild(item);
                hasContent = true;

                cleanAndRenderText(node);
            }
            else if (node.classList.contains('model-response-text')) {
                const headings = node.querySelectorAll('h1, h2, h3');
                headings.forEach(h => {
                    const hText = h.textContent.trim();
                    if (hText) {
                        let levelClass = 'wx-toc-h1';
                        if (h.tagName === 'H2') levelClass = 'wx-toc-h2';
                        if (h.tagName === 'H3') levelClass = 'wx-toc-h3';

                        const hItem = createEl('div', `wx-toc-item ${levelClass}`, hText);
                        hItem.onclick = () => fastSmoothScroll(h);
                        listContainer.appendChild(hItem);
                        hasContent = true;
                    }
                });

                cleanAndRenderText(node);
            }
        });

        if (!hasContent) {
            listContainer.appendChild(createEl('div', 'wx-toc-empty', '提取目录失败或无标题'));
        }
    }

    const observeDebounced = debounce(() => {
        const panel = document.getElementById('wx-toc-panel');
        const isHomePage = window.location.href === 'https://gemini.google.com/app';
        if (isHomePage && document.body.classList.contains('toc-open')) {
            toggleTocPanel();
        }

        const main = document.querySelector('main');
        if (main) cleanAndRenderText(main);

        if (panel && panel.classList.contains('active')) {
            generateTocContent();
        }
    }, 1000);

    function initObserver() {
        const target = document.querySelector('main') || document.body;
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) shouldUpdate = true;
                if (mutation.type === 'characterData') shouldUpdate = true;
            });
            if (shouldUpdate) observeDebounced();
        });
        observer.observe(target, { childList: true, subtree: true, characterData: true });
    }

    // --- 8. 调色盘 & 应用 ---
    const fontStacks = {
        sans: '"Source Han Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
        serif: '"Source Han Serif SC", "Noto Serif CJK SC", "Songti SC", serif',
        wenkai: '"LXGW WenKai Screen Web", "KaiTi", "STKaiti", serif',
        jost: '"Jost", "Source Han Sans SC", sans-serif'
    };

    const themes = {
        white:  { bg: '#ffffff', text: '#333333', accentBg: '#f7f7f7', accentText: '#333', inputBg: 'rgba(255,255,255,0.85)', sidebarText: '#000000' },
        yellow: { bg: '#f6f1e7', text: '#5b4636', accentBg: '#ffffff', accentText: '#4a3b2f', inputBg: 'rgba(255,255,255,0.7)', sidebarText: '#000000' },
        green:  { bg: '#cce8cf', text: '#222222', accentBg: '#ffffff', accentText: '#1f3322', inputBg: 'rgba(255,255,255,0.7)', sidebarText: '#000000' },
        dark:   { bg: '#1a1a1a', text: '#bfbfbf', accentBg: '#2d2d2d', accentText: '#e0e0e0', inputBg: 'rgba(42,42,42,0.8)', sidebarText: '#ffffff' }
    };

    function applyConfig() {
        const root = document.documentElement;
        const t = themes[config.theme];
        root.style.setProperty('--w-bg', t.bg);
        root.style.setProperty('--w-text', t.text);
        root.style.setProperty('--w-accent-bg', t.accentBg);
        root.style.setProperty('--w-accent-text', t.accentText);
        root.style.setProperty('--w-input-bg', t.inputBg);
        root.style.setProperty('--w-sidebar-text', t.sidebarText);
        root.style.setProperty('--w-font', fontStacks[config.fontType]);
        root.style.setProperty('--w-footer-display', config.hideFooter ? 'none' : 'block');
        document.body.setAttribute('data-public-style', config.publicStyle);
        document.body.setAttribute('data-pub-color', config.publicColor);
        document.body.setAttribute('data-pub-type', config.publicType);
        if (config.theme === 'dark') document.body.setAttribute('data-theme', 'dark');
        else if (config.theme === 'green') document.body.setAttribute('data-theme', 'green');
        else document.body.setAttribute('data-theme', 'light');

        GM_addStyle(`
            main p, .model-response-text p { font-size: ${config.fontSize}px !important; }
        `);
        localStorage.setItem('gemini_reader_config', JSON.stringify(config));
    }

    function updateUIState() {
        const panel = document.getElementById('wx-panel'); if (!panel) return;
        panel.querySelectorAll('.wx-color-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.val === config.theme));
        panel.querySelectorAll('.wx-font-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.val === config.fontType));
        document.getElementById('wx-fs-slider').value = config.fontSize; document.getElementById('wx-fs-input').value = config.fontSize;
        document.getElementById('wx-wd-slider').value = config.maxWidth; document.getElementById('wx-wd-input').value = config.maxWidth;
        document.getElementById('wx-footer-check').checked = config.hideFooter;
        document.getElementById('wx-public-check').checked = config.publicStyle;
        const styleRow = document.getElementById('wx-style-row');
        if (config.publicStyle) styleRow.classList.add('visible'); else styleRow.classList.remove('visible');
        panel.querySelectorAll('.wx-style-dot').forEach(dot => dot.classList.toggle('active', dot.dataset.val === config.publicColor));
        panel.querySelectorAll('.wx-type-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.val === config.publicType));
    }

    function openPanel() { buildPanel(); document.getElementById('wx-overlay').classList.add('active'); document.getElementById('wx-panel').classList.add('active'); updateUIState(); }
    function closePanel() { document.getElementById('wx-overlay').classList.remove('active'); document.getElementById('wx-panel').classList.remove('active'); }

    setTimeout(() => {
        applyConfig();
        createFab();
        buildTocPanel();

        if (window.location.href !== 'https://gemini.google.com/app') {
            toggleTocPanel();
        }

        initObserver();
        console.log('Gemini Reader Loaded with V1.05 (Weight Adjusted).');
    }, 1500);

})();