// ==UserScript==
// @name         b站动态体验优化·禁止动态跳转与评论快速收起
// @namespace    https://space.bilibili.com/11768481
// @version      2.5
// @description  1. 禁止B站动态主体点击跳转，方便选择文字。2. 打开评论区时，生成一个“收起评论并定位”的悬浮按钮。
// @author       伊墨墨
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/users/1449730-%E4%BC%8A%E5%A2%A8
// @downloadURL https://update.greasyfork.org/scripts/551752/b%E7%AB%99%E5%8A%A8%E6%80%81%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%C2%B7%E7%A6%81%E6%AD%A2%E5%8A%A8%E6%80%81%E8%B7%B3%E8%BD%AC%E4%B8%8E%E8%AF%84%E8%AE%BA%E5%BF%AB%E9%80%9F%E6%94%B6%E8%B5%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/551752/b%E7%AB%99%E5%8A%A8%E6%80%81%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%C2%B7%E7%A6%81%E6%AD%A2%E5%8A%A8%E6%80%81%E8%B7%B3%E8%BD%AC%E4%B8%8E%E8%AF%84%E8%AE%BA%E5%BF%AB%E9%80%9F%E6%94%B6%E8%B5%B7.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // --- 样式部分 ---
    GM_addStyle(`
    /* 悬浮按钮样式 */
    #bili-dyn-quick-close-btn {
        position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
        z-index: 9999; height: 48px; padding: 0 50px; border-radius: 50px;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        font-size: 16px; color: rgba(0, 0, 0, 0.7); padding-bottom: 2px;
        background-color: rgba(255, 255, 255, 0.4); backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(10px); border: 1.5px solid rgba(255, 255, 255, 0.6);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        transition: all 0.35s cubic-bezier(0.19, 1, 0.22, 1); overflow: hidden;
    }
    #bili-dyn-quick-close-btn:before {
        content: ''; position: absolute; z-index: -1; top: 0; left: 0;
        width: 100%; height: 100%;
        background-image: linear-gradient(45deg, #00a1d6, #fb7299, #00a1d6);
        background-size: 300% 300%; opacity: 0; transition: opacity 0.4s ease;
    }
    #bili-dyn-quick-close-btn:hover {
        color: #fff; border-color: rgba(255, 255, 255, 0.8);
        transform: translateX(-50%) translateY(-6px) scale(1.08);
        box-shadow: 0 0 25px rgba(0, 161, 214, 0.6), 0 0 45px rgba(251, 114, 153, 0.5);
    }
    #bili-dyn-quick-close-btn:hover:before {
        opacity: 0.8; animation: gradient-flow 4s ease infinite;
    }
    @keyframes gradient-flow {
        0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; }
    }
    
    /* 强制更改鼠标样式，提示用户该区域不会跳转 */
    .dyn-card-opus__summary, 
    .bili-dyn-content__forw__desc, 
    .bili-dyn-content__orig__desc, 
    .bili-rich-text__content {
        cursor: text !important;
    }

    /* --- 精准跳转触发区样式 (仅前几个字) --- */
    .bili-dyn-jump-trigger {
        cursor: pointer !important;
        position: relative;
        font-weight: bold;
        color: #fb7299 !important; /* B站粉 */
        text-shadow: 1px 1px 1px rgba(251, 114, 153, 0.2); 
        text-decoration: underline;
        text-decoration-style: dotted; 
        text-underline-offset: 4px;
        margin-right: 2px;
        transition: all 0.2s ease;
        padding: 0 2px;
        border-radius: 4px;
        display: inline; /* 确保内联显示 */
    }
    .bili-dyn-jump-trigger:hover {
        background-color: rgba(251, 114, 153, 0.1);
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }
    .bili-dyn-jump-trigger::before {
        content: '🔗';
        font-size: 0.75em;
        margin-right: 1px;
        opacity: 0.6;
        vertical-align: 1px;
    }
    `);

    // ============================================================
    // 工具函数：智能回顶
    // ============================================================
    const smartScrollTo = (element) => {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = rect.top + scrollTop - 80;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    };

    // ============================================================
    // 核心功能一：全局捕获拦截 (白名单机制)
    // ============================================================
    
    const TEXT_CONTAINER_SELECTOR = `
        .dyn-card-opus__summary,       /* 原创动态 */
        .bili-dyn-content__forw__desc, /* 转发动态 */
        .bili-dyn-content__orig__desc, /* 历史动态 */
        .bili-rich-text__content,      /* 通用富文本 */
        [data-module="desc"]           /* 旧版兼容 */
    `;

    // 白名单：这些元素保持原样，允许点击
    const INTERACTIVE_SELECTOR = `
        .dyn-card-opus__summary__action, /* 原创动态底部展开 */
        .bili-rich-text__action,         /* 转发/折叠内容的展开收起按钮 */
        .bili-rich-text-module,          /* @人、#话题 */
        .bili-rich-text-viewpic,         /* 查看图片链接 */
        .bili-dyn-jump-trigger,          /* 【关键】我们生成的4字跳转按钮 */
        .jump-link,                      /* 各种链接 */
        .opus-text-rich-hl,              /* 富文本高亮(如话题/抽奖) */
        a,                               /* 所有a标签 */
        img,                             /* 表情包图片 */
        video,                           /* 视频控件 */
        canvas                           /* 绘制区域 */
    `;

    document.addEventListener('click', (e) => {
        const target = e.target;

        // 1. 展开/收起 自动回顶逻辑
        if (target.matches('.bili-rich-text__action') || target.matches('.dyn-card-opus__summary__action')) {
            if (target.innerText.includes('收起')) {
                const dynItem = target.closest('.bili-dyn-item');
                if (dynItem) {
                    const scrollTarget = dynItem.querySelector('.bili-dyn-item__main');
                    setTimeout(() => smartScrollTo(scrollTarget), 10);
                }
            }
        }

        // 2. 阻止跳转逻辑
        const textContainer = target.closest(TEXT_CONTAINER_SELECTOR);
        if (textContainer) {
            const isInteractive = target.closest(INTERACTIVE_SELECTOR);
            if (!isInteractive) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }
    }, true);

    // ============================================================
    // 功能补充：文本切割术 (排除评论/互动区)
    // ============================================================
    const splitTextAndAddTrigger = (container) => {
        if (container.dataset.jumpProcessed) return;

        const contentContainers = container.querySelectorAll('.bili-rich-text__content, .opus-paragraph-children');

        contentContainers.forEach(wrapper => {
            if (wrapper.dataset.jumpProcessed) return;

            // 【关键修改】如果这个文本容器在“互动区域/评论区”内，直接跳过，不加链接
            // .bili-dyn-interaction 包含了下方的点赞/评论列表
            // .bili-dyn-card-link-common 包含了游戏/番剧卡片
            if (wrapper.closest('.bili-dyn-interaction') || 
                wrapper.closest('.bili-dyn-card-link-common')) {
                return; 
            }

            // 1. 自定义过滤器
            const filter = {
                acceptNode: function(node) {
                    if (node.textContent.trim().length === 0) return NodeFilter.FILTER_SKIP;
                    
                    let parent = node.parentNode;
                    while (parent && parent !== wrapper) {
                        if (parent.tagName === 'A' || 
                            parent.classList.contains('bili-rich-text-module') || 
                            parent.classList.contains('opus-text-rich-hl') ||
                            parent.classList.contains('bili-dyn-jump-trigger')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        parent = parent.parentNode;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            };

            // 2. 深度优先寻找【第一个】纯净文本
            const walker = document.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT, filter, false);
            const firstCleanTextNode = walker.nextNode();

            // 3. 找到后处理
            if (firstCleanTextNode) {
                const textContent = firstCleanTextNode.textContent;
                const splitIndex = 4;

                const triggerSpan = document.createElement('span');
                triggerSpan.className = 'bili-dyn-jump-trigger';
                triggerSpan.title = "点击此处跳转详情";

                if (textContent.length > splitIndex) {
                    const firstPart = textContent.substring(0, splitIndex);
                    const secondPart = textContent.substring(splitIndex);
                    triggerSpan.textContent = firstPart;
                    firstCleanTextNode.parentNode.insertBefore(triggerSpan, firstCleanTextNode);
                    firstCleanTextNode.textContent = secondPart;
                } else {
                    triggerSpan.textContent = textContent;
                    firstCleanTextNode.parentNode.insertBefore(triggerSpan, firstCleanTextNode);
                    firstCleanTextNode.parentNode.removeChild(firstCleanTextNode);
                }
                
                wrapper.dataset.jumpProcessed = "true";
            }
        });
    };

    // ============================================================
    // 功能二：悬浮按钮 (收起评论区 + 智能回顶)
    // ============================================================
    const BUTTON_ID = 'bili-dyn-quick-close-btn';
    const removeQuickCloseButton = () => {
        const btn = document.getElementById(BUTTON_ID);
        if (btn) btn.remove();
    };

    const createQuickCloseButton = (dynItemNode) => {
        removeQuickCloseButton();
        
        const scrollTarget = dynItemNode.querySelector('.bili-dyn-item__main');
        const commentToggleButton = dynItemNode.querySelector('.bili-dyn-action[data-type="comment"]');
        
        if (!scrollTarget || !commentToggleButton) return;

        const btn = document.createElement('div');
        btn.id = BUTTON_ID;
        btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M12.71,9.29l4-4a1,1,0,0,0-1.42-1.42L13,6.17V3A1,1,0,0,0,11,3V6.17L8.71,3.87A1,1,0,0,0,7.29,5.29l4,4A1,1,0,0,0,12.71,9.29Z"/>
            <path d="M20,2H4A2,2,0,0,0,2,4V16a2,2,0,0,0,2,2h4.59l3.7,3.71a1,1,0,0,0,1.42,0L17.41,18H20a2,2,0,0,0,2-2V4A2,2,0,0,0,20,2ZM4,16V4H20l.02,12H17a1,1,0,0,0-.71.29L13,19.59l-3.29-3.3A1,1,0,0,0,9,16H4Z"/>
        </svg>`;

        btn.addEventListener('click', () => {
            commentToggleButton.click();
            smartScrollTo(scrollTarget);
        });
        document.body.appendChild(btn);
    };

    // ============================================================
    // 观察者模式：监听动态加载
    // ============================================================
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        // 1. 处理评论区
                        const commentPanel = node.matches('.bili-dyn-item__panel') ? node : node.querySelector('.bili-dyn-item__panel');
                        if (commentPanel) {
                            const listItem = commentPanel.closest('.bili-dyn-list__item');
                            if (listItem) {
                                const dynItem = listItem.querySelector('.bili-dyn-item');
                                if (dynItem) createQuickCloseButton(dynItem);
                            } else {
                                const dynItem = commentPanel.closest('.bili-dyn-item');
                                if (dynItem) createQuickCloseButton(dynItem);
                            }
                        }

                        // 2. 处理文本
                        if (node.matches('.bili-dyn-list__item') || 
                            node.querySelector('.bili-rich-text__content') || 
                            node.classList.contains('bili-rich-text__content')) {
                            splitTextAndAddTrigger(node);
                        }
                    }
                });
            }
            if (mutation.removedNodes.length > 0) {
                mutation.removedNodes.forEach(node => {
                    if (node.nodeType === 1 && (node.matches('.bili-dyn-item__panel') || node.querySelector('.bili-dyn-item__panel'))) {
                        removeQuickCloseButton();
                    }
                });
            }
        }
    });

    const startObserver = () => {
        const targetNode = document.querySelector('.bili-dyn-list');
        if (targetNode) {
            observer.observe(targetNode.parentElement, { childList: true, subtree: true });
            splitTextAndAddTrigger(document.body);
        } else {
            if(document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
                splitTextAndAddTrigger(document.body);
            } else {
                setTimeout(startObserver, 1000);
            }
        }
    };
    startObserver();
})();