// ==UserScript==
// @name         AI对话窗口侧边导航栏 (ChatGPT & Gemini)
// @name:en      AI Chat Window Navigation Sidebar (ChatGPT & Gemini)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为 ChatGPT 和 Gemini 对话页面添加侧边悬浮目录，自动生成当前对话的问题列表，点击快速跳转。
// @description:en Add a floating navigation sidebar to ChatGPT and Gemini chat windows, automatically generating a list of questions for quick scrolling.
// @author       zhe ren
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562763/AI%E5%AF%B9%E8%AF%9D%E7%AA%97%E5%8F%A3%E4%BE%A7%E8%BE%B9%E5%AF%BC%E8%88%AA%E6%A0%8F%20%28ChatGPT%20%20Gemini%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562763/AI%E5%AF%B9%E8%AF%9D%E7%AA%97%E5%8F%A3%E4%BE%A7%E8%BE%B9%E5%AF%BC%E8%88%AA%E6%A0%8F%20%28ChatGPT%20%20Gemini%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 (可在代码中修改) ---
    const CONFIG = {
        scanInterval: 1000, // 扫描频率(ms)
        title: '对话导航',   // 目录标题
        minWidth: '200px',  // 最小宽度
        maxWidth: '260px',  // 最大宽度
        maxTextLength: 20   // 目录单行最大字数
    };

    // --- 样式定义 ---
    const styles = `
        #ai-toc-container {
            position: fixed;
            top: 100px;
            right: 20px;
            width: auto;
            min-width: ${CONFIG.minWidth};
            max-width: ${CONFIG.maxWidth};
            max-height: 70vh;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: opacity 0.3s;
        }
        
        @media (prefers-color-scheme: dark) {
            #ai-toc-container {
                background: #1e1e1e;
                border-color: #333;
                color: #e0e0e0;
            }
        }

        #ai-toc-header {
            padding: 12px 16px;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            border-bottom: 1px solid #f3f4f6;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f9fafb;
            user-select: none;
        }

        @media (prefers-color-scheme: dark) {
            #ai-toc-header {
                background: #2d2d2d;
                color: #fff;
                border-bottom-color: #333;
            }
        }

        #ai-toc-body {
            overflow-y: auto;
            padding: 8px 0;
            flex-grow: 1;
            scrollbar-width: thin;
        }
        
        #ai-toc-body::-webkit-scrollbar { width: 4px; }
        #ai-toc-body::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }

        .ai-toc-item {
            padding: 8px 16px;
            font-size: 13px;
            color: #6b7280;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            transition: all 0.2s;
            line-height: 1.5;
            border-left: 3px solid transparent; 
        }

        .ai-toc-item:hover {
            background: #f3f4f6;
            color: #111827;
            border-left-color: #3b82f6;
            padding-left: 19px; /* hover时稍微右移一点，增加动感 */
        }

        @media (prefers-color-scheme: dark) {
            .ai-toc-item { color: #9ca3af; }
            .ai-toc-item:hover { background: #333; color: #fff; border-left-color: #60a5fa;}
        }

        .toc-collapsed #ai-toc-body { display: none; }
        .toc-collapsed { width: auto !important; min-width: auto !important; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // --- UI 创建 ---
    function createUI() {
        if (document.getElementById('ai-toc-container')) return;
        const container = document.createElement('div');
        container.id = 'ai-toc-container';
        container.innerHTML = `
            <div id="ai-toc-header"><span>${CONFIG.title}</span> <span style="font-size:12px">▼</span></div>
            <div id="ai-toc-body"></div>
        `;
        document.body.appendChild(container);
        
        const header = container.querySelector('#ai-toc-header');
        header.addEventListener('click', () => {
            container.classList.toggle('toc-collapsed');
            const arrow = header.querySelector('span:last-child');
            arrow.innerText = container.classList.contains('toc-collapsed') ? '◀' : '▼';
        });
    }

    // --- 核心逻辑 ---
    function scanQuestions() {
        const body = document.getElementById('ai-toc-body');
        if (!body) return;

        let questions = [];

        // 适配 ChatGPT
        if (location.host.includes('chatgpt.com')) {
            const userMessages = document.querySelectorAll('div[data-message-author-role="user"]');
            userMessages.forEach(msg => {
                questions.push({ element: msg, text: msg.innerText || "图片/附件提问" });
            });
        } 
        // 适配 Gemini
        else if (location.host.includes('gemini.google.com')) {
            const queries = document.querySelectorAll('user-query, .user-query-text, h2[data-test-id="user-query"]');
            const seen = new Set();
            queries.forEach(q => {
                if(!seen.has(q) && q.innerText.trim().length > 0) {
                     questions.push({ element: q, text: q.innerText });
                     seen.add(q);
                }
            });
        }

        if (questions.length === 0) {
            body.innerHTML = '<div style="padding:10px; color:#999; text-align:center; font-size:12px">等待对话...</div>';
            return;
        }

        // 构建列表
        const fragment = document.createDocumentFragment();
        questions.forEach((q, index) => {
            let cleanText = q.text.replace(/\n/g, ' ').trim();
            if (cleanText.length > CONFIG.maxTextLength) {
                cleanText = cleanText.substring(0, CONFIG.maxTextLength) + '...';
            }
            if (cleanText.length === 0) cleanText = `Question ${index + 1}`;

            const item = document.createElement('div');
            item.className = 'ai-toc-item';
            item.innerText = cleanText;
            item.title = q.text;

            item.addEventListener('click', (e) => {
                e.preventDefault();
                q.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });

            fragment.appendChild(item);
        });

        // 简单Diff：只有内容变了才更新DOM，避免闪烁
        if (body.childElementCount !== questions.length || 
            (body.firstChild && body.firstChild.innerText !== fragment.firstChild.innerText)) {
             body.innerHTML = '';
             body.appendChild(fragment);
        }
    }

    // --- 启动逻辑 ---
    function init() {
        createUI();
        setInterval(scanQuestions, CONFIG.scanInterval);
    }

    window.addEventListener('load', init);
    
    // 监听 URL 变化 (SPA 路由适配)
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(() => { 
                const body = document.getElementById('ai-toc-body');
                if(body) body.innerHTML = ''; 
                scanQuestions(); 
            }, 1000);
        }
    }).observe(document, {subtree: true, childList: true});

})();