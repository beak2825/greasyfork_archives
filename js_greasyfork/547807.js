// ==UserScript==
// @name        nodeseek 自动代码高亮 (Highlight.js + 复制按钮)
// @namespace   http://tampermonkey.net/
// @version     4.2
// @description 自动检测并高亮 nodeseek 内的代码块（支持自动语言识别），并添加一个“复制”按钮。
// @author      三七
// @match       https://*.nodeseek.com/*
// @match       https://*.deepflood.com/* 
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @connect     cdn.jsdelivr.net
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547807/nodeseek%20%E8%87%AA%E5%8A%A8%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE%20%28Highlightjs%20%2B%20%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547807/nodeseek%20%E8%87%AA%E5%8A%A8%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE%20%28Highlightjs%20%2B%20%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置部分 ---
    const HLJS_CSS_URL = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/base16/humanoid-light.min.css";
    const HLJS_JS_URL = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/highlight.min.js";

    // --- 复制按钮的样式 (完全可自定义) ---
    GM_addStyle(`
        pre > code.hljs {
            position: relative;
        }
        .copy-code-button {
            position: absolute;
            top: 0.5em;
            right: 0.5em;
            padding: 4px 8px;
            font-size: 12px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #ccc;
            background-color: #444;
            border: 1px solid #666;
            border-radius: 4px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s ease-in-out, background-color 0.2s, color 0.2s, border-color 0.2s;
            z-index: 10;
        }
        pre:hover .copy-code-button {
            opacity: 1;
        }
        .copy-code-button:hover {
            background-color: #555;
            color: #fff;
        }
        .copy-code-button.copied {
            background-color: #28a745; /* 成功时用绿色 */
            color: white;
            border-color: #28a745;
        }
    `);

    // --- 核心逻辑 (loadScript 和 debounce 保持不变) ---

    let hljsLoaded = false;
    let hljsLoading = false;

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function loadScript(url, callback) {
        if (hljsLoaded) {
            if (callback) callback();
            return;
        }
        if (hljsLoading) {
            document.addEventListener('hljs-loaded', callback, { once: true });
            return;
        }
        hljsLoading = true;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const script = document.createElement('script');
                script.textContent = response.responseText;
                document.head.appendChild(script).remove();
                hljsLoaded = true;
                hljsLoading = false;
                console.log(`[Auto Highlighter] Loaded JS: ${url}`);
                document.dispatchEvent(new Event('hljs-loaded'));
                if (callback) callback();
            },
            onerror: function(response) {
                console.error(`[Auto Highlighter] Failed to load script ${url}:`, response);
                hljsLoading = false;
            }
        });
    }

    // --- 添加复制按钮的函数 (已修复) ---
    function addCopyButtons() {
        document.querySelectorAll('pre > code.hljs').forEach(codeBlock => {
            if (codeBlock.querySelector('.copy-code-button')) {
                return;
            }

            const button = document.createElement('button');
            button.className = 'copy-code-button';
            button.textContent = '复制'; // [汉化] 默认文字

            button.addEventListener('click', (event) => {
                // [BUG 修复]
                // 1. 克隆 codeBlock 节点，这样我们不会影响原始 DOM
                const codeClone = codeBlock.cloneNode(true);
                // 2. 从克隆的节点中移除按钮
                const buttonInClone = codeClone.querySelector('.copy-code-button');
                if (buttonInClone) {
                    buttonInClone.remove();
                }
                // 3. 现在从干净的克隆节点获取文本
                const codeToCopy = codeClone.innerText;

                navigator.clipboard.writeText(codeToCopy).then(() => {
                    button.textContent = '已复制!'; // [汉化] 成功提示
                    button.classList.add('copied');
                    setTimeout(() => {
                        button.textContent = '复制'; // [汉化] 恢复默认
                        button.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('复制失败: ', err);
                    button.textContent = '错误'; // [汉化] 失败提示
                });
            });

            codeBlock.appendChild(button);
        });
    }


    function findAndHighlight() {
        const codeBlocks = document.querySelectorAll('pre > code:not(.hljs)');
        if (codeBlocks.length > 0) {
            console.log(`[Auto Highlighter] Found ${codeBlocks.length} unhighlighted code blocks.`);
            loadScript(HLJS_JS_URL, () => {
                if (typeof hljs !== 'undefined') {
                    console.log('[Auto Highlighter] Highlighting now...');
                    codeBlocks.forEach(element => {
                        hljs.highlightElement(element);
                    });
                    console.log('[Auto Highlighter] Highlighting complete.');
                    addCopyButtons();
                } else {
                    console.warn('[Auto Highlighter] hljs not available for highlighting.');
                }
            });
        }
        addCopyButtons();
    }

    // --- 启动逻辑 ---

    GM_addStyle('@import url("' + HLJS_CSS_URL + '");');
    const debouncedFindAndHighlight = debounce(findAndHighlight, 300);
    setTimeout(findAndHighlight, 100);
    window.addEventListener('load', findAndHighlight);

    const observer = new MutationObserver(() => {
        debouncedFindAndHighlight();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
