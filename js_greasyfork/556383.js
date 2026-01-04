// ==UserScript==
// @name         AI 聊天侧边导航 (Gemini & ChatGPT)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  A unified side navigation for both Gemini and ChatGPT. Auto-detects platform, tracks questions, and prevents lag.
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

    // === 1. Configuration & Strategy Definitions (配置与策略定义) ===
    
    const CONFIG = {
        sidebarWidth: '60px',
        hoverWidth: '300px',
        maxItems: 10,         // Keep last 10 items
        labelLen: 30,         // Visual truncation length
        tooltipLen: 100,      // Tooltip truncation length (Performance)
        zIndex: 9999,
        debug: false
    };

    // Define platform-specific logic (Strategy Pattern)
    const STRATEGIES = {
        gemini: {
            name: 'Gemini',
            color: '#a8c7fa', // Google Blue
            // Logic to find message elements
            getElements: () => {
                const els = document.querySelectorAll('user-query');
                // Filter invisible elements (virtualization check)
                return Array.from(els).filter(el => el.getBoundingClientRect().height > 0);
            },
            // Logic to extract text from a specific element
            extractText: (el) => {
                const textContainer = el.querySelector('.query-text');
                if (textContainer) return textContainer.innerText;
                
                // Fallback cleanup
                const clone = el.cloneNode(true);
                clone.querySelectorAll('.file-preview-container, button, mat-icon').forEach(n => n.remove());
                return clone.innerText;
            }
        },
        chatgpt: {
            name: 'ChatGPT',
            color: '#10a37f', // OpenAI Green
            getElements: () => {
                const els = document.querySelectorAll('[data-message-author-role="user"]');
                return Array.from(els).filter(el => el.getBoundingClientRect().height > 0);
            },
            extractText: (el) => {
                const textContainer = el.querySelector('.whitespace-pre-wrap');
                return textContainer ? textContainer.innerText : el.innerText;
            }
        }
    };

    // === 2. Runtime Detection (运行时检测) ===
    
    let currentStrategy = null;
    const host = window.location.hostname;

    if (host.includes('gemini.google.com')) {
        currentStrategy = STRATEGIES.gemini;
    } else if (host.includes('chatgpt.com')) {
        currentStrategy = STRATEGIES.chatgpt;
    } else {
        console.log('[AI Nav] Unknown platform, script disabled.');
        return; // Exit if not on supported site
    }

    console.log(`[AI Nav] Activated for: ${currentStrategy.name}`);

    // === 3. Core Logic (核心逻辑) ===

    let lastFingerprint = "";
    let observer = null;
    let navigationContainer = null;
    let updateTimeout = null;

    // Inject CSS with dynamic color variable
    function injectStyles() {
        const styleId = 'ai-nav-styles';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
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
                align-items: flex-end; 
                pointer-events: none; 
                transition: opacity 0.2s;
            }
            
            .ai-nav-item {
                pointer-events: auto; 
                background-color: rgba(32, 33, 35, 0.90); 
                backdrop-filter: blur(4px);
                color: #e3e3e3; 
                padding: 0; 
                border-radius: 8px 0 0 8px; 
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
            }

            .ai-nav-item:hover { 
                width: ${CONFIG.hoverWidth}; 
                background-color: #444; 
                border-color: var(--ai-nav-active-color); 
                z-index: 10000; 
            }

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
                opacity: 1; 
            }
        `;
        document.head.appendChild(style);
    }

    function cleanText(text) {
        if (!text) return "";
        // Performance optimization: truncate early in memory
        if (text.length > 500) text = text.substring(0, 500);
        return text.replace(/\s+/g, ' ').trim();
    }

    function updateNavigation() {
        // Pause observer to prevent recursive loops
        if (observer) observer.disconnect();

        try {
            if (!navigationContainer) {
                navigationContainer = document.createElement('div');
                navigationContainer.id = 'ai-nav-sidebar';
                document.body.appendChild(navigationContainer);
            }
            
            // 1. Get Raw Elements via Strategy
            const rawElements = currentStrategy.getElements();
            
            // 2. Process Data
            const messageData = [];
            rawElements.forEach(el => {
                const rawTxt = currentStrategy.extractText(el);
                const text = cleanText(rawTxt);
                const display = text.length > 0 ? text : "[File/Image]";
                
                messageData.push({
                    el: el,
                    text: display,
                    top: el.getBoundingClientRect().top // For sorting check
                });
            });

            // Ensure sorted (mostly for safety)
            messageData.sort((a, b) => a.top - b.top);

            const totalCount = messageData.length;
            const startIndex = Math.max(0, totalCount - CONFIG.maxItems);
            const displayItems = messageData.slice(startIndex);

            // 3. Fingerprinting (Diffing)
            const newFingerprint = totalCount + "|" + displayItems.map(m => m.text.substring(0, 10)).join('');

            if (newFingerprint !== lastFingerprint) {
                lastFingerprint = newFingerprint;
                navigationContainer.replaceChildren();

                displayItems.forEach((item, i) => {
                    const realIndex = startIndex + i + 1;
                    const tag = document.createElement('div');
                    tag.className = 'ai-nav-item';
                    
                    // Label Truncation
                    let label = item.text;
                    if (label.length > CONFIG.labelLen) label = label.substring(0, CONFIG.labelLen) + '...';
                    
                    // Tooltip Truncation
                    let tooltip = item.text;
                    if (tooltip.length > CONFIG.tooltipLen) tooltip = tooltip.substring(0, CONFIG.tooltipLen) + '...';
                    tag.title = tooltip;

                    tag.innerHTML = `
                        <div class="nav-icon">Q${realIndex}</div>
                        <div class="nav-text">${label}</div>
                    `;

                    tag.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        item.el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        
                        // Generic Highlight Effect
                        const target = item.el; // Strategy could provide inner target, but container is usually fine
                        const oldTrans = target.style.transition;
                        target.style.transition = 'background-color 0.5s ease';
                        target.style.backgroundColor = 'rgba(128, 128, 128, 0.2)'; // Neutral highlight
                        setTimeout(() => { 
                            target.style.backgroundColor = ''; 
                            target.style.transition = oldTrans;
                        }, 1000);
                    });

                    navigationContainer.appendChild(tag);
                });
            }

        } catch (e) {
            console.error("[AI Nav] Error:", e);
        }

        // Resume observer
        if (observer) observer.observe(document.body, { childList: true, subtree: true });
    }

    // 4. Init & Observer
    function init() {
        injectStyles();
        
        // Debounce
        const runUpdate = () => {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(updateNavigation, 500);
        };

        observer = new MutationObserver((mutations) => {
            if (mutations[0].target.closest('#ai-nav-sidebar')) return;
            runUpdate();
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Initial Scan
        setTimeout(updateNavigation, 1500);
        
        // URL Watcher (SPA support)
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                lastFingerprint = ""; 
                setTimeout(updateNavigation, 1000);
            }
        }, 1000);
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

})();
