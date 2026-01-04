// ==UserScript==
// @name         Gemini 回复折叠器 (最终版)
// @name:zh-CN   Gemini 回复折叠器 (最终版)
// @namespace    http://tampermonkey.net/
// @version      5.4
// @description  最终集大成版。支持SPA导航，采用事件委托，按钮前置，结构清晰，性能卓越。
// @description:zh-CN 最终集大成版。支持SPA导航，采用事件委托，按钮前置，结构清晰，性能卓越。
// @author       Gemini & Ma
// @match        https://gemini.google.com/app/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551270/Gemini%20%E5%9B%9E%E5%A4%8D%E6%8A%98%E5%8F%A0%E5%99%A8%20%28%E6%9C%80%E7%BB%88%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551270/Gemini%20%E5%9B%9E%E5%A4%8D%E6%8A%98%E5%8F%A0%E5%99%A8%20%28%E6%9C%80%E7%BB%88%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置中心 ---
    const CONFIG = {
        selectors: {
            landmark: '.restart-chat-button-scroll-placeholder',
            chatContainer: '.content-container',
            modelResponse: 'model-response',
            responseBody: '.response-content, .markdown',
            messageActions: 'message-actions',
        },
        classes: {
            processed: 'collapsible-processed',
            collapsible: 'collapsible-response',
            expanded: 'expanded',
            preview: 'paragraph-preview',
            ellipsis: 'paragraph-ellipsis',
            originalContentWrapper: 'original-content-wrapper',
            button: 'mdc-icon-button mat-mdc-icon-button mat-mdc-button-base mat-mdc-tooltip-trigger icon-button mat-unthemed gemini-collapser-button', // 添加了自定义类名
            icon: 'mat-icon notranslate google-symbols mat-ligature-font mat-icon-no-color'
        },
        delays: {
            renderSettle: 500,
            processResponse: 100
        },
        attributes: {
            tooltip: 'mattooltip'
        },
        text: {
            collapseTooltip: '收起回复',
            expandTooltip: '展开回复',
            ellipsis: '[...]',
            collapseIcon: 'expand_less',
            expandIcon: 'expand_more'
        }
    };

    // --- 样式注入 ---
    GM_addStyle(`
        .paragraph-preview { padding: 0.1em 0; }
        .paragraph-ellipsis { text-align: center; color: var(--text-color-secondary); font-style: italic; padding: 8px 0; letter-spacing: 4px; }
        .collapsible-response > .original-content-wrapper { display: none !important; }
        .collapsible-response > .paragraph-preview { display: block !important; }
        .collapsible-response.expanded > .original-content-wrapper { display: block !important; }
        .collapsible-response.expanded > .paragraph-preview { display: none !important; }

        /* 按钮前置样式 */
        model-response {
            position: relative !important;
        }
        .gemini-collapser-button {
            position: absolute;
            top: 4px;
            right: 4px;
            z-index: 10;
        }
    `);

    // --- 核心功能函数 ---

    const createToggleButton = (responseBody, isExpandedByDefault) => {
        const toggleButton = document.createElement('button');
        toggleButton.className = CONFIG.classes.button;

        const matIcon = document.createElement('mat-icon');
        matIcon.className = CONFIG.classes.icon;
        toggleButton.appendChild(matIcon);

        const updateButtonState = (isExpanded) => {
            matIcon.textContent = isExpanded ? CONFIG.text.collapseIcon : CONFIG.text.expandIcon;
            toggleButton.setAttribute(CONFIG.attributes.tooltip, isExpanded ? CONFIG.text.collapseTooltip : CONFIG.text.expandTooltip);
        };
        
        updateButtonState(isExpandedByDefault);
        return toggleButton;
    };

    const createPreviewElement = (responseBody) => {
        const topLevelBlocks = Array.from(responseBody.children);
        if (topLevelBlocks.length <= 1) return null;

        const previewDiv = document.createElement('div');
        previewDiv.className = CONFIG.classes.preview;
        const allParagraphs = Array.from(responseBody.querySelectorAll('p'));

        if (allParagraphs.length > 0) {
            previewDiv.appendChild(allParagraphs[0].cloneNode(true));
            if (allParagraphs.length > 1) {
                const ellipsisDiv = document.createElement('div');
                ellipsisDiv.className = CONFIG.classes.ellipsis;
                ellipsisDiv.textContent = CONFIG.text.ellipsis;
                previewDiv.appendChild(ellipsisDiv);
                previewDiv.appendChild(allParagraphs[allParagraphs.length - 1].cloneNode(true));
            }
        } else {
            previewDiv.appendChild(topLevelBlocks[0].cloneNode(true));
        }
        return previewDiv;
    };

    const processResponse = (messageActions, isNewResponse) => {
        const modelResponse = messageActions.closest(CONFIG.selectors.modelResponse);
        if (!modelResponse || modelResponse.classList.contains(CONFIG.classes.processed)) {
            return;
        }
        modelResponse.classList.add(CONFIG.classes.processed);

        setTimeout(() => {
            const responseBody = modelResponse.querySelector(CONFIG.selectors.responseBody);
            if (!responseBody) return;

            const previewDiv = createPreviewElement(responseBody);
            if (!previewDiv) return;

            const contentWrapper = document.createElement('div');
            contentWrapper.className = CONFIG.classes.originalContentWrapper;
            while (responseBody.firstChild) {
                contentWrapper.appendChild(responseBody.firstChild);
            }
            responseBody.appendChild(previewDiv);
            responseBody.appendChild(contentWrapper);
            responseBody.classList.add(CONFIG.classes.collapsible);
            if (isNewResponse) {
                responseBody.classList.add(CONFIG.classes.expanded);
            }

            const toggleButton = createToggleButton(responseBody, isNewResponse);
            modelResponse.prepend(toggleButton);

        }, CONFIG.delays.processResponse);
    };

    // --- 观察者逻辑 ---
    let mainObserver = null;
    let bootstrapObserver = null;

    const initializeForChat = () => {
        if (bootstrapObserver) bootstrapObserver.disconnect();
        if (mainObserver) mainObserver.disconnect();

        bootstrapObserver = new MutationObserver((mutations, observer) => {
            const landmark = document.querySelector(CONFIG.selectors.landmark);
            if (landmark) {
                observer.disconnect();

                setTimeout(() => {
                    const chatContainer = document.querySelector(CONFIG.selectors.chatContainer);
                    if (chatContainer) {
                        if (chatContainer._collapserClickHandler) {
                            chatContainer.removeEventListener('click', chatContainer._collapserClickHandler);
                        }
                        const clickHandler = (event) => {
                            const toggleButton = event.target.closest('.gemini-collapser-button');
                            if (!toggleButton) return;

                            const modelResponse = toggleButton.closest(CONFIG.selectors.modelResponse);
                            if (!modelResponse) return;

                            const responseBody = modelResponse.querySelector(CONFIG.selectors.responseBody);
                            if (!responseBody) return;
                            
                            const isNowExpanded = responseBody.classList.toggle(CONFIG.classes.expanded);
                            
                            const matIcon = toggleButton.querySelector('mat-icon');
                            if (matIcon) {
                                matIcon.textContent = isNowExpanded ? CONFIG.text.collapseIcon : CONFIG.text.expandIcon;
                                toggleButton.setAttribute(CONFIG.attributes.tooltip, isNowExpanded ? CONFIG.text.collapseTooltip : CONFIG.text.expandTooltip);
                            }
                        };
                        chatContainer.addEventListener('click', clickHandler);
                        chatContainer._collapserClickHandler = clickHandler;

                        mainObserver = new MutationObserver((mutations) => {
                            for (const mutation of mutations) {
                                for (const node of mutation.addedNodes) {
                                    if (node.nodeType === Node.ELEMENT_NODE) {
                                        const actions = node.matches(CONFIG.selectors.messageActions) ? [node] : node.querySelectorAll(CONFIG.selectors.messageActions);
                                        actions.forEach(action => processResponse(action, true));
                                    }
                                }
                            }
                        });
                        mainObserver.observe(chatContainer, { childList: true, subtree: true });
                        
                        chatContainer.querySelectorAll(CONFIG.selectors.messageActions).forEach(actions => processResponse(actions, false));
                    }
                }, CONFIG.delays.renderSettle);
            }
        });
        bootstrapObserver.observe(document.body, { childList: true, subtree: true });
    };

    // --- URL导航侦听器 ---
    let lastProcessedUrl = '';
    const navigationObserverLoop = () => {
        requestAnimationFrame(() => {
            if (window.location.href !== lastProcessedUrl) {
                lastProcessedUrl = window.location.href;
                initializeForChat();
            }
            navigationObserverLoop();
        });
    };

    // --- 启动脚本 ---
    navigationObserverLoop();

})();