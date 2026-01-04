// ==UserScript==
// @name         HTML 实时渲染器 (带全屏功能)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @match        *://*/*
// @description  在任意网页打开一个悬浮窗，粘贴HTML代码并实时预览，支持全屏
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560900/HTML%20%E5%AE%9E%E6%97%B6%E6%B8%B2%E6%9F%93%E5%99%A8%20%28%E5%B8%A6%E5%85%A8%E5%B1%8F%E5%8A%9F%E8%83%BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560900/HTML%20%E5%AE%9E%E6%97%B6%E6%B8%B2%E6%9F%93%E5%99%A8%20%28%E5%B8%A6%E5%85%A8%E5%B1%8F%E5%8A%9F%E8%83%BD%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 定义面板的 HTML 结构 (增加了全屏按钮)
    const panelHTML = `
        <div id="html-preview-panel" style="display: none;">
            <div class="header">
                <span style="font-weight:bold;">HTML 渲染器</span>
                <div class="header-controls">
                    <button id="toggle-fullscreen-btn" title="全屏/还原">□</button>
                    <button id="close-btn" title="关闭">×</button>
                </div>
            </div>
            <div class="content">
                <textarea id="html-source" placeholder="在此粘贴 HTML/CSS/JS 代码..."></textarea>
                <div class="iframe-container">
                    <iframe id="preview-frame"></iframe>
                </div>
            </div>
            <div class="actions">
                <span class="tip">快捷键: Ctrl + Enter 渲染</span>
                <div>
                    <button id="render-btn">渲染 (Render)</button>
                    <button id="clear-btn">清空</button>
                </div>
            </div>
        </div>
    `;

    // 2. 定义面板的 CSS 样式 (增加了 .fullscreen-mode 类)
    const panelCSS = `
        #html-preview-panel {
            position: fixed;
            top: 50px;
            right: 50px;
            width: 800px;
            height: 600px;
            background: #fff;
            border: 1px solid #ccc;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 99999;
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            font-family: sans-serif;
            transition: all 0.3s ease; /* 添加过渡动画 */
        }

        /* 全屏模式的样式 */
        #html-preview-panel.fullscreen-mode {
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
            border: none !important;
        }

        #html-preview-panel .header {
            background: #2c3e50;
            color: #fff;
            padding: 10px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        /* 全屏时去掉头部圆角 */
        #html-preview-panel.fullscreen-mode .header {
            border-radius: 0;
        }

        #html-preview-panel .header-controls button {
            background: none;
            border: none;
            color: #fff;
            font-size: 18px;
            cursor: pointer;
            padding: 0 8px;
            line-height: 1;
        }
        #html-preview-panel .header-controls button:hover {
            color: #ddd;
        }

        #html-preview-panel .content {
            flex: 1;
            display: flex;
            padding: 10px;
            gap: 10px;
            overflow: hidden;
            background: #f0f2f5;
        }
        #html-preview-panel textarea {
            flex: 1;
            resize: none;
            padding: 15px;
            font-family: 'Consolas', 'Monaco', monospace;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.5;
            outline: none;
        }
        #html-preview-panel textarea:focus {
            border-color: #007bff;
        }
        #html-preview-panel .iframe-container {
            flex: 1;
            border: 1px solid #ddd;
            background: #fff;
            border-radius: 4px;
            overflow: hidden;
        }
        #html-preview-panel iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        #html-preview-panel .actions {
            padding: 10px 15px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff;
        }
        #html-preview-panel .actions .tip {
            font-size: 12px;
            color: #888;
        }
        #html-preview-panel .actions button {
            padding: 8px 20px;
            margin-left: 10px;
            cursor: pointer;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: bold;
        }
        #html-preview-panel .actions button:hover {
            background: #0056b3;
        }
        #html-preview-panel .actions button#clear-btn {
            background: #6c757d;
        }
        #html-preview-panel .actions button#clear-btn:hover {
            background: #5a6268;
        }
    `;

    GM_addStyle(panelCSS);

    const div = document.createElement('div');
    div.innerHTML = panelHTML;
    document.body.appendChild(div);

    // 获取元素
    const panel = document.getElementById('html-preview-panel');
    const source = document.getElementById('html-source');
    const iframe = document.getElementById('preview-frame');
    const closeBtn = document.getElementById('close-btn');
    const toggleFullscreenBtn = document.getElementById('toggle-fullscreen-btn');
    const renderBtn = document.getElementById('render-btn');
    const clearBtn = document.getElementById('clear-btn');

    // 菜单命令
    GM_registerMenuCommand("打开/关闭 HTML 渲染器", togglePanel);

    function togglePanel() {
        if (panel.style.display === 'none') {
            panel.style.display = 'flex';
        } else {
            panel.style.display = 'none';
        }
    }

    // 渲染逻辑
    function render() {
        const code = source.value;
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(code);
        doc.close();
    }

    // 全屏切换逻辑
    function toggleFullscreen() {
        panel.classList.toggle('fullscreen-mode');
        // 切换图标
        if (panel.classList.contains('fullscreen-mode')) {
            toggleFullscreenBtn.innerHTML = '❐'; // 还原图标
            toggleFullscreenBtn.title = "还原窗口";
        } else {
            toggleFullscreenBtn.innerHTML = '□'; // 全屏图标
            toggleFullscreenBtn.title = "全屏显示";
        }
    }

    // 事件监听
    closeBtn.addEventListener('click', togglePanel);
    toggleFullscreenBtn.addEventListener('click', toggleFullscreen);
    renderBtn.addEventListener('click', render);

    clearBtn.addEventListener('click', () => {
        if(confirm("确定清空代码吗？")) {
            source.value = '';
            render();
        }
    });

    source.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            render();
        }
    });

})();