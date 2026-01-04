// ==UserScript==
// @name         Smart ChatGPT Window Optimizer (Chat AI Response Manager)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically collapses long AI responses on ChatGPT to optimize the chat window, featuring quick toggle and content preview.
// @author       John
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556485/Smart%20ChatGPT%20Window%20Optimizer%20%28Chat%20AI%20Response%20Manager%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556485/Smart%20ChatGPT%20Window%20Optimizer%20%28Chat%20AI%20Response%20Manager%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COLLAPSED_CLASS = 'response-container-collapsed';
    const COLLAPSE_HEIGHT = '120px';
    let timeoutHandle = null;
    let initialFoldingComplete = false;

    // (样式注入和 MutationObserver 逻辑保持 V20.0 不变)
// --- 1. 注入基础样式 (V25.0: 恢复渐变和内容上滚) ---
    GM_addStyle(`
    div[data-message-author-role="user"] { cursor: pointer !important; }

    /* 核心折叠容器样式 */
    .${COLLAPSED_CLASS} {
        height: ${COLLAPSE_HEIGHT} !important;
        overflow: hidden !important;
        transition: height 0.3s ease-out;
        position: relative !important;
        border-radius: 8px !important; /* 恢复圆角 */
    }

    /* *** 1. 内容上滚：强制内容上移 90px，显示底部内容 *** */
    /* 假设内容包装器是折叠容器的第一个直接子元素 */
    .${COLLAPSED_CLASS} > div:first-child {
        margin-top: -90px !important;
    }

    /* *** 2. 渐变样式：浅蓝色渐变指示 *** */
    .${COLLAPSED_CLASS}:after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 20px;
        background: linear-gradient(to top,
            #ADD8E6 5%, /* 浅蓝色 (#ADD8E6) */
            rgba(173, 216, 230, 0.0) 100% /* 透明 */
        );
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        pointer-events: none;
        z-index: 2;
    }

    /* 统一折叠按钮样式 */
    #collapse-all-button {
        position: fixed; bottom: 20px; right: 20px; z-index: 10000;
        background-color: #4285F4; color: white; border: none;
        border-radius: 8px; padding: 10px 15px; font-size: 14px;
        cursor: pointer; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: background-color 0.2s;
    }
    #collapse-all-button:hover { background-color: #357ae8; }
`);

// --- 2. 核心函数：处理新的/未处理的聊天元素 (V24.0: 精准目标修复) ---
    function processNewElements(targetNode) {
        const triggers = targetNode.querySelectorAll('div[data-message-author-role="user"]:not([data-has-listener])');

        triggers.forEach(trigger => {
            trigger.setAttribute('data-has-listener', 'true');

            trigger.addEventListener('click', function(event) {
                event.preventDefault();

                // *** V24.0 修复：严格遵循用户指定的 3 步遍历路径 ***

                // 1. 查找上级 article
                const ancestorArticle = this.closest('article');
                if (!ancestorArticle) return;

                // 2. 查找下一个兄弟元素
                const nextSibling = ancestorArticle.nextElementSibling;
                if (!nextSibling) return;

                // 3. 在兄弟元素中查找目标 article[data-turn="assistant"]
                let targetResponse = nextSibling.querySelector('article[data-turn="assistant"]');

                // 考虑目标就是兄弟元素本身的情况 (如果它自带 data-turn="assistant" 属性)
                if (!targetResponse && nextSibling.matches('article[data-turn="assistant"]')) {
                    targetResponse = nextSibling;
                }
                if (!targetResponse) return; // 目标仍未找到，退出

                // 4. 执行折叠/展开逻辑 (使用 V21.0 的精简展开逻辑)
                if (targetResponse.classList.contains(COLLAPSED_CLASS)) {
                    // 展开
                    targetResponse.classList.remove(COLLAPSED_CLASS);
                    targetResponse.style.height = ''; // 清除内联高度
                    targetResponse.style.overflow = 'visible';
                } else {
                    // 折叠
                    targetResponse.style.height = COLLAPSE_HEIGHT;
                    targetResponse.style.overflow = 'hidden';
                    targetResponse.classList.add(COLLAPSED_CLASS);
                }
            });

            // --- 新元素保持展开 (5 秒后) ---
            if (initialFoldingComplete) {
                const ancestorArticle = trigger.closest('article');
                if (ancestorArticle) {
                    const nextSibling = ancestorArticle.nextElementSibling;
                    if (nextSibling) {
                        let targetResponse = nextSibling.querySelector('article[data-turn="assistant"]');
                        if (!targetResponse && nextSibling.matches('article[data-turn="assistant"]')) {
                            targetResponse = nextSibling;
                        }

                        if (targetResponse) {
                            targetResponse.classList.remove(COLLAPSED_CLASS);
                            targetResponse.style.height = '';
                            targetResponse.style.overflow = 'visible';
                        }
                    }
                }
            }
        });
    }

    // --- (initializeFolding, createCollapseAllButton, MutationObserver 保持 V20.0 逻辑不变) ---

    function initializeFolding() {
        const responses = document.querySelectorAll('article[data-turn="assistant"]');
        responses.forEach(response => {
            response.classList.add(COLLAPSED_CLASS);
            response.style.height = COLLAPSE_HEIGHT;
            response.style.overflow = 'hidden';
        });
        initialFoldingComplete = true;
        createCollapseAllButton();
        console.log("ChatGPT Auto-Collapse: Initial folding completed after delay.");
    }

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
    function createCollapseAllButton() {
        if (document.getElementById('collapse-all-button')) return;
        const button = document.createElement('button');
        button.id = 'collapse-all-button';
        button.textContent = getButtonTitle();
        button.addEventListener('click', function() {
            const allResponses = document.querySelectorAll('article[data-turn="assistant"]');
            allResponses.forEach(response => {
                response.style.height = COLLAPSE_HEIGHT;
                response.style.overflow = 'hidden';
                response.classList.add(COLLAPSED_CLASS);
            });
        });
        document.body.appendChild(button);
    }

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

    // 延迟 3 秒后，执行最终强制折叠
    setTimeout(initializeFolding, 3000);

})();