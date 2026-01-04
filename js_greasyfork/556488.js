// ==UserScript==
// @name         Smart Chat Window Optimizer (Gemini Response Manager)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically collapses long AI responses on Gemini to optimize the chat window, featuring quick toggle and content preview.
// @author       Your Name
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556488/Smart%20Chat%20Window%20Optimizer%20%28Gemini%20Response%20Manager%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556488/Smart%20Chat%20Window%20Optimizer%20%28Gemini%20Response%20Manager%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COLLAPSED_CLASS = 'response-container-collapsed';
    let timeoutHandle = null;
    let initialFoldingComplete = false;

    // --- 1. 使用 GM_addStyle 注入样式 (更新了圆角和渐变高度) ---
    GM_addStyle(`
        .avatar { cursor: pointer !important; }

        model-response.${COLLAPSED_CLASS} {
            height: 120px !important;
            overflow: hidden !important;
            transition: height 0.3s ease-out;
            position: relative !important;
            border-radius: 8px !important; /* 新增：给容器添加圆角 */
        }

        model-response.${COLLAPSED_CLASS}:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 20px; /* 调整：渐变区域高度减半 (40px -> 20px) */

            /* 渐变效果 */
            background: linear-gradient(to top,
                #ADD8E6 5%,
                rgba(173, 216, 230, 0.0) 100%
            );

            /* 新增：确保渐变层的底部圆角与容器一致 */
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;

            pointer-events: none;
            z-index: 2;
        }

        #collapse-all-button {
            position: fixed; bottom: 20px; right: 20px; z-index: 1000;
            background-color: #4285F4; color: white; border: none;
            border-radius: 8px; padding: 10px 15px; font-size: 14px;
            cursor: pointer; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.2s;
        }
        #collapse-all-button:hover { background-color: #357ae8; }
    `);

    // --- 2. 核心函数：处理新的/未处理的聊天元素 (保持不变) ---
    function processNewElements(targetNode) {
        const responses = targetNode.querySelectorAll('model-response:not([data-processed])');
        responses.forEach(response => {
            response.setAttribute('data-processed', 'true');
            if (initialFoldingComplete) {
                response.classList.remove(COLLAPSED_CLASS);
                response.style.height = 'auto'; response.style.maxHeight = 'none'; response.style.overflow = 'visible';
            }
            const avatar = response.closest('div[class]').querySelector('.avatar');
            const parentDiv = response.parentElement;
            if (avatar) {
                if (!avatar.getAttribute('data-has-listener')) {
                    avatar.setAttribute('data-has-listener', 'true');
                    avatar.addEventListener('click', function(event) {
                        event.preventDefault();
                        if (response.classList.contains(COLLAPSED_CLASS)) {
                            response.classList.remove(COLLAPSED_CLASS);
                            response.style.height = 'auto'; response.style.maxHeight = 'none'; response.style.overflow = 'visible';
                            if (parentDiv) { parentDiv.style.height = 'auto'; parentDiv.style.maxHeight = 'none'; }
                        } else {
                            response.style.height = '120px';
                            response.style.maxHeight = ''; response.style.overflow = 'hidden';
                            response.classList.add(COLLAPSED_CLASS);
                            if (parentDiv) { parentDiv.style.height = ''; parentDiv.style.maxHeight = ''; }
                        }
                    });
                }
            }
        });
    }

    // --- 3. 专用于初始加载的强制折叠函数 (保持不变) ---
    function initializeFolding() {
        const responses = document.querySelectorAll('model-response');
        responses.forEach(response => {
            response.classList.add(COLLAPSED_CLASS);
            response.style.height = '120px';
            response.style.maxHeight = '';
            response.style.overflow = 'hidden';
        });
        initialFoldingComplete = true;
        createCollapseAllButton();
        console.log("Gemini Auto-Collapse: Initial folding completed.");
    }
    // --- V28.0 新增：语言检测函数 ---
    function getButtonTitle() {
        // 获取浏览器的主要语言
        const lang = (navigator.language || navigator.userLanguage).toLowerCase();

        // 如果是中文 (zh-cn, zh-tw, zh-hk等)
        if (lang.startsWith('zh')) {
            return '折叠全部';
        } else {
            // 默认为英文，或用于所有非中文语言
            return 'Collapse All';
        }
    }
    // --- 4. 创建和处理“折叠全部”按钮 (保持不变) ---
    function createCollapseAllButton() {
        if (document.getElementById('collapse-all-button')) return;
        const button = document.createElement('button');
        button.id = 'collapse-all-button';
        button.textContent = getButtonTitle();
        button.addEventListener('click', function() {
            const allResponses = document.querySelectorAll('model-response');
            allResponses.forEach(response => {
                const parentDiv = response.parentElement;
                response.style.height = '120px';
                response.style.maxHeight = ''; response.style.overflow = 'hidden';
                response.classList.add(COLLAPSED_CLASS);
                if (parentDiv) { parentDiv.style.height = ''; parentDiv.style.maxHeight = ''; }
            });
        });
        document.body.appendChild(button);
    }

    // --- 5. MutationObserver 和 启动代码 (保持不变) ---
    const targetNode = document.body;
    const observer = new MutationObserver(() => {
        if (timeoutHandle) { clearTimeout(timeoutHandle); }
        timeoutHandle = setTimeout(() => {
            processNewElements(document);
            createCollapseAllButton();
            timeoutHandle = null;
        }, 50);
    });

    observer.observe(targetNode, { childList: true, subtree: true });
    processNewElements(document);
    createCollapseAllButton();

    // 延迟 5 秒后，执行最终强制折叠
    setTimeout(initializeFolding, 4000);

})();