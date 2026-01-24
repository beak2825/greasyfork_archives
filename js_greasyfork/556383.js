// ==UserScript==
// @name         AI 聊天侧边导航 (Gemini & ChatGPT)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  A unified side navigation for both Gemini and ChatGPT. Auto-detects platform, tracks questions, and prevents lag. (Fixed CSP + Restored Style)
// @author       YunAsimov
// @homepageURL  https://github.com/YunAsimov/AI-Chat-Navigator
// @supportURL   https://github.com/YunAsimov/AI-Chat-Navigator/issues
// @license      MIT
// @match        https://gemini.google.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @downloadURL https://update.greasyfork.org/scripts/556383/AI%20%E8%81%8A%E5%A4%A9%E4%BE%A7%E8%BE%B9%E5%AF%BC%E8%88%AA%20%28Gemini%20%20ChatGPT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556383/AI%20%E8%81%8A%E5%A4%A9%E4%BE%A7%E8%BE%B9%E5%AF%BC%E8%88%AA%20%28Gemini%20%20ChatGPT%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 0. Security Fix: Trusted Types Policy (关键修复) ===
    // 即使改回旧样式，这个 Policy 依然必须保留，否则在 Gemini 上操作 innerHTML 会报错
    const ttPolicy = typeof trustedTypes !== 'undefined' ?
        trustedTypes.createPolicy('ai-chat-navigator-policy', {
            createHTML: (string) => string,
        }) :
        { createHTML: (string) => string };

    // === 1. Configuration & Strategy Definitions ===
    
    const CONFIG = {
        sidebarWidth: '60px',
        hoverWidth: '300px',    // 悬停展开宽度
        maxItems: 10,           // 保留最近 10 条
        labelLen: 50,           // 文本截断长度
        updateDebounce: 500,    // 防抖
        scanDelay: 1500,        // 初始扫描延迟
        zIndex: 9999
    };

    const STRATEGIES = {
        gemini: {
            host: 'gemini.google.com',
            color: '#a8c7fa', // Google Blue
            userMsgSelector: '.user-query-container .query-text', 
            userMsgSelectorBackup: 'user-query .query-text-line',
            scrollTarget: (el) => el.closest('.user-query-container') || el,
            getText: (el) => el.innerText || el.textContent || "",
            ignore: '#ai-nav-sidebar'
        },
        chatgpt: {
            host: 'chatgpt.com',
            color: '#10a37f', // OpenAI Green
            userMsgSelector: 'div[data-message-author-role="user"] > div',
            scrollTarget: (el) => el,
            getText: (el) => el.innerText || el.textContent || "",
            ignore: '#ai-nav-sidebar'
        }
    };

    // Detect Platform
    const currentStrategy = Object.values(STRATEGIES).find(s => location.host === s.host);
    if (!currentStrategy) {
        console.log('[AI Nav] Site not supported, script disabled.');
        return;
    }
    console.log(`[AI Nav] Activated for: ${currentStrategy.host}`);

    // Global State
    let observer = null;
    let updateTimeout = null;
    let lastFingerprint = "";

    // === 2. Style Injection (恢复 2.0 版本的样式) ===
    function injectStyles() {
        // 使用 Trusted Types 兼容的方式创建样式
        const styleContent = `
            :root {
                --ai-nav-active-color: ${currentStrategy.color};
            }
            #ai-nav-sidebar {
                position: fixed; 
                top: 80px; 
                right: 10px; 
                width: ${CONFIG.sidebarWidth};
                display: flex; 
                flex-direction: column; 
                gap: 6px; 
                z-index: ${CONFIG.zIndex};
                align-items: flex-end; /* 让条目从右向左生长 */
                pointer-events: none; /* 让点击穿透空白区域 */
                transition: opacity 0.2s;
            }
            
            .ai-nav-item {
                pointer-events: auto; 
                background-color: rgba(32, 33, 35, 0.90); 
                backdrop-filter: blur(4px);
                color: #e3e3e3; 
                padding: 0; 
                border-radius: 8px 0 0 8px; /* 左侧圆角，右侧直角 */
                cursor: pointer;
                transition: width 0.2s cubic-bezier(0.2, 0, 0, 1); 
                width: 40px; 
                height: 40px;
                display: flex; 
                align-items: center; 
                font-family: sans-serif; 
                font-size: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1); 
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                overflow: hidden; 
                white-space: nowrap;
                user-select: none;
            }

            .ai-nav-item:hover { 
                width: ${CONFIG.hoverWidth}; /* 悬停时展开宽度 */
                background-color: #444; 
                border-color: var(--ai-nav-active-color); 
                z-index: 10000; 
            }

            /* 左侧的序号图标 Q1, Q2... */
            .ai-nav-item .nav-icon { 
                min-width: 40px; 
                height: 40px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-weight: bold; 
                flex-shrink: 0; 
                color: var(--ai-nav-active-color); 
            }

            /* 右侧的文本内容 */
            .ai-nav-item .nav-text { 
                opacity: 0; 
                margin-left: 8px; 
                margin-right: 12px; 
                overflow: hidden; 
                text-overflow: ellipsis; 
                color: #ececf1; 
                transition: opacity 0.2s; 
                font-size: 12px; 
            }

            .ai-nav-item:hover .nav-text { 
                opacity: 1; /* 展开时显示文本 */
            }

            /* 高亮动画 */
            @keyframes ai-nav-flash {
                0% { background-color: rgba(var(--ai-nav-active-color), 0.3); }
                100% { background-color: transparent; }
            }
            .ai-nav-highlight {
                animation: ai-nav-flash 1.5s ease-out;
            }
        `;
        const style = document.createElement('style');
        style.textContent = styleContent;
        document.head.appendChild(style);
    }

    // === 3. Core Logic ===
    
    function getQuestions() {
        let elements = Array.from(document.querySelectorAll(currentStrategy.userMsgSelector));
        
        if (elements.length === 0 && currentStrategy.userMsgSelectorBackup) {
            elements = Array.from(document.querySelectorAll(currentStrategy.userMsgSelectorBackup));
        }

        const items = elements.map((el, index) => {
            let text = currentStrategy.getText(el).trim();
            if (!text) text = "[File/Image Upload]"; 
            
            // Cleanup extra newlines
            text = text.replace(/\s+/g, ' ');

            const id = `nav-${index}-${text.substring(0, 5)}`;
            
            return {
                element: el,
                text: text,
                id: id,
                index: index
            };
        });

        return items.slice(-CONFIG.maxItems); 
    }

    function createSidebar() {
        let sidebar = document.getElementById('ai-nav-sidebar');
        if (!sidebar) {
            sidebar = document.createElement('div');
            sidebar.id = 'ai-nav-sidebar';
            document.body.appendChild(sidebar);
        }
        return sidebar;
    }

    function updateNavigation() {
        if (observer) observer.disconnect();

        try {
            const questions = getQuestions();
            
            // Fingerprinting
            const currentFingerprint = questions.map(q => q.text).join('|');
            if (currentFingerprint === lastFingerprint) {
                if (observer) observer.observe(document.body, { childList: true, subtree: true });
                return; 
            }
            lastFingerprint = currentFingerprint;

            const sidebar = createSidebar();
            
            // Safe Clear using Trusted Types
            sidebar.innerHTML = ttPolicy.createHTML(''); 

            questions.forEach((q, i) => {
                const realIndex = (questions.length - i); // 倒序或者正序，这里用倒序展示逻辑可能更好，或者保持Q1, Q2..
                // 为了保持和 v2.0 一致的 Q1, Q2 逻辑 (通常是最上面是 Q1)
                // 但因为我们 slice 了最后 10 条，所以序号应该是全局的还是相对的？
                // 这里为了简单直观，显示相对序号 Q1..Q10
                const displayIndex = i + 1;

                const navItem = document.createElement('div');
                navItem.className = 'ai-nav-item';
                
                // Text Truncation
                let displayText = q.text;
                if (displayText.length > CONFIG.labelLen) {
                    displayText = displayText.substring(0, CONFIG.labelLen) + '...';
                }

                // === 构建内部 DOM 结构 (Safe DOM Creation) ===
                // 不使用 innerHTML 拼接，完全符合 CSP 安全规范
                
                // 1. Icon 部分 (Q1, Q2...)
                const iconDiv = document.createElement('div');
                iconDiv.className = 'nav-icon';
                iconDiv.innerText = `Q${displayIndex}`;
                
                // 2. Text 部分
                const textDiv = document.createElement('div');
                textDiv.className = 'nav-text';
                textDiv.innerText = displayText;

                // 3. 组装
                navItem.appendChild(iconDiv);
                navItem.appendChild(textDiv);
                
                // Tooltip
                navItem.title = q.text.substring(0, 200);

                // Click Event
                navItem.onclick = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    
                    const target = currentStrategy.scrollTarget(q.element);
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Highlight
                    target.style.transition = 'background-color 0.5s ease';
                    target.style.backgroundColor = 'rgba(128, 128, 128, 0.2)';
                    setTimeout(() => { 
                        target.style.backgroundColor = ''; 
                    }, 1000);
                };

                sidebar.appendChild(navItem);
            });

            console.log(`[AI Nav] Updated: ${questions.length} items.`);

        } catch (e) {
            console.error("[AI Nav] Error:", e);
        }

        if (observer) observer.observe(document.body, { childList: true, subtree: true });
    }

    // === 4. Init & Observer ===
    function init() {
        injectStyles();
        
        const runUpdate = () => {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(updateNavigation, CONFIG.updateDebounce);
        };

        observer = new MutationObserver((mutations) => {
            const relevantMutation = mutations.some(m => !m.target.closest('#ai-nav-sidebar'));
            if (relevantMutation) {
                runUpdate();
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        setTimeout(updateNavigation, CONFIG.scanDelay);
        
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                lastFingerprint = ""; 
                setTimeout(updateNavigation, 1000);
            }
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();