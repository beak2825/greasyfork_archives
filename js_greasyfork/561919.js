// ==UserScript==
// @name         ChatGPT Code Block Scroller (v1.0)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制 ChatGPT 代码块内部滚动，限制高度为屏幕的1/3，双击代码区域切换“折叠/展开”。
// @author       User
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561919/ChatGPT%20Code%20Block%20Scroller%20%28v10%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561919/ChatGPT%20Code%20Block%20Scroller%20%28v10%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        maxHeight: '33vh',        // 限制高度为屏幕的 1/3
        width: '100%',            // 宽度与对话框齐平
        transitionTime: '0.25s',
        mainBg: '#f6f8fa',       // 背景色
        borderColor: '#d1d5da',  // 边框颜色
        monoFont: '"JetBrains Mono", "Fira Code", Consolas, Menlo, monospace'
    };

    GM_addStyle(`
        /* 代码块外层容器 */
        article pre {
            max-width: ${CONFIG.width} !important;
            margin: 1.5em auto;
            border-radius: 12px;
            border: 1px solid ${CONFIG.borderColor} !important;
            background-color: ${CONFIG.mainBg} !important;
            padding: 0;
            box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }

        /* 隐藏原生标题 */
        article pre > div.flex.items-center,
        article pre > div:first-child:not(:has(code)) {
            display: none !important;
        }

        /* 标题栏 */
        .mac-header {
            width: 100%;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: transparent;
            border-bottom: 1px solid rgba(0,0,0,0.05);
            position: relative;
            z-index: 10;
        }

        .mac-title {
            font-size: 13px;
            color: #586069;
            font-weight: 500;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            letter-spacing: 0.5px;
        }

        /* 代码块内容 */
        pre > div:has(code) {
            max-height: ${CONFIG.maxHeight} !important;
            overflow-y: auto !important;
            display: block !important;
            cursor: zoom-in !important;
            padding: 16px 20px;
            background-color: transparent !important;
            transition: max-height ${CONFIG.transitionTime} ease;
        }

        /* 滚动条美化 */
        pre > div:has(code)::-webkit-scrollbar { width: 12px; }
        pre > div:has(code)::-webkit-scrollbar-thumb {
            background-color: rgba(95, 99, 104, 0.4);
            border-radius: 99px;
        }

        /* 代码字体 */
        pre code {
            font-family: ${CONFIG.monoFont} !important;
            font-size: 13.5px !important;
            line-height: 1.6 !important;
            color: #24292e !important;
            text-shadow: none !important;
        }

        .gpt-expanded {
            max-height: 85vh !important;
            cursor: zoom-out !important;
        }
    `);

    // 添加标题栏
    function injectMacHeader(preElement) {
        if (preElement.querySelector('.mac-header')) return;
        const codeContainer = preElement.querySelector('div:has(code)');
        if (!codeContainer) return;

        let language = '';
        const codeElement = codeContainer.querySelector('code');
        if (codeElement) {
            const langMatch = codeElement.className.match(/language-([^\s"']+)/);
            if (langMatch) language = langMatch[1].toUpperCase();
        }

        const header = document.createElement('div');
        header.className = 'mac-header';
        header.innerHTML = `
            <div class="mac-title">${language || 'TEXT'}</div>
        `;
        preElement.insertBefore(header, codeContainer);
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            m.addedNodes.forEach((n) => {
                if (n.nodeType === 1 && n.matches('article pre')) {
                    injectMacHeader(n);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 双击切换展开状态
    document.addEventListener('dblclick', function(e) {
        const target = e.target;
        const scrollContainer = target.closest('pre > div:has(code)');

        if (scrollContainer) {
            const wrapper = target.closest('pre');
            const container = wrapper ? wrapper.querySelector('div:has(code)') : null;
            if (container) {
                e.preventDefault();
                e.stopPropagation();
                window.getSelection()?.removeAllRanges();
                container.classList.toggle('gpt-expanded');
            }
        }
    }, true);

    console.log('ChatGPT Code Block Scroller (v1.0) - Loaded');
})();
