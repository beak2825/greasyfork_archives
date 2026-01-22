// ==UserScript==
// @name         AI对话窗口侧边导航栏
// @name:en      AI Chat Navigation Sidebar (Clean Version)
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  支持 ChatGPT & Gemini：包含拖拽、收藏重点、一键换肤（赛博紫/极简白），适配 Gemini 安全策略，无打赏干扰。
// @description:en Support ChatGPT & Gemini: includes dragging, bookmarking, theme switching (Cyber Purple/Minimalist White), fits Gemini security policy. No donation popup.
// @author       RenZhe0228
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562763/AI%E5%AF%B9%E8%AF%9D%E7%AA%97%E5%8F%A3%E4%BE%A7%E8%BE%B9%E5%AF%BC%E8%88%AA%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/562763/AI%E5%AF%B9%E8%AF%9D%E7%AA%97%E5%8F%A3%E4%BE%A7%E8%BE%B9%E5%AF%BC%E8%88%AA%E6%A0%8F.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    // --- 1. 配置与主题 ---
    const CONFIG = {
        scanInterval: 1000,
        title: '💎 导航', 
        minWidth: '220px',
        maxWidth: '280px',
        maxTextLength: 20
    };

    const THEMES = {
        purple: {
            '--ai-toc-bg': 'rgba(20, 15, 40, 0.95)',
            '--ai-toc-border': '#7b2cbf',
            '--ai-toc-text': '#e0aaff',
            '--ai-toc-hover': 'rgba(123, 44, 191, 0.3)',
            '--ai-toc-accent': '#c77dff',
            '--ai-toc-shadow': '0 0 15px rgba(123, 44, 191, 0.4)',
            '--ai-toc-star-off': '#5a4b75',
            '--ai-toc-star-on': '#ffcc00',
            '--ai-toc-header-bg': 'linear-gradient(90deg, #3c096c 0%, #240046 100%)',
            '--ai-toc-header-text': '#ffffff'
        },
        light: {
            '--ai-toc-bg': 'rgba(255, 255, 255, 0.95)',
            '--ai-toc-border': '#e2e8f0',
            '--ai-toc-text': '#334155',
            '--ai-toc-hover': '#f1f5f9',
            '--ai-toc-accent': '#3b82f6',
            '--ai-toc-shadow': '0 4px 15px rgba(0, 0, 0, 0.1)',
            '--ai-toc-star-off': '#cbd5e1',
            '--ai-toc-star-on': '#f59e0b',
            '--ai-toc-header-bg': 'linear-gradient(90deg, #f8fafb 0%, #f1f5f9 100%)',
            '--ai-toc-header-text': '#334155'
        }
    };

    const state = {
        bookmarks: new Set(),
        currentTheme: localStorage.getItem('ai-toc-theme') || 'purple',
        isDragging: false,
        dragOffsetX: 0,
        dragOffsetY: 0
    };

    // --- 2. 样式定义 ---
    const styles = `
        #ai-toc-container {
            position: fixed; top: 100px; right: 20px; width: auto;
            min-width: ${CONFIG.minWidth}; max-width: ${CONFIG.maxWidth}; max-height: 75vh;
            background: var(--ai-toc-bg); border: 1px solid var(--ai-toc-border);
            color: var(--ai-toc-text); box-shadow: var(--ai-toc-shadow);
            border-radius: 16px; z-index: 9999; font-family: system-ui, sans-serif;
            display: flex; flex-direction: column; overflow: hidden; backdrop-filter: blur(5px);
            transition: height 0.3s, background 0.3s, border-color 0.3s;
        }
        #ai-toc-header {
            padding: 12px 16px; font-size: 14px; font-weight: 700; color: var(--ai-toc-header-text);
            border-bottom: 1px solid var(--ai-toc-border); cursor: move; display: flex;
            justify-content: space-between; align-items: center; background: var(--ai-toc-header-bg); user-select: none;
        }
        .ai-toc-controls { display: flex; gap: 10px; align-items: center; }
        .ai-toc-btn { cursor: pointer; opacity: 0.7; transition: all 0.2s; font-size: 14px; }
        .ai-toc-btn:hover { opacity: 1; transform: scale(1.1); }
        #ai-toc-body { overflow-y: auto; padding: 8px 0; flex-grow: 1; scrollbar-width: thin; }
        #ai-toc-body::-webkit-scrollbar { width: 4px; }
        #ai-toc-body::-webkit-scrollbar-thumb { background: var(--ai-toc-border); border-radius: 4px; }
        .ai-toc-item {
            padding: 8px 12px; font-size: 13px; color: var(--ai-toc-text); cursor: pointer;
            display: flex; align-items: center; transition: all 0.2s; border-left: 3px solid transparent; 
        }
        .ai-toc-item:hover { background: var(--ai-toc-hover); border-left-color: var(--ai-toc-accent); padding-left: 15px; }
        .ai-toc-item.bookmarked { background: rgba(255, 204, 0, 0.1); border-left-color: var(--ai-toc-star-on); font-weight: bold; }
        .ai-toc-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-grow: 1; pointer-events: none; }
        .ai-toc-star { font-size: 14px; margin-right: 8px; color: var(--ai-toc-star-off); transition: all 0.2s; width: 20px; text-align: center; }
        .bookmarked .ai-toc-star { color: var(--ai-toc-star-on); text-shadow: 0 0 2px var(--ai-toc-star-on); }
        .toc-collapsed #ai-toc-body { display: none; }
        .toc-collapsed { width: auto !important; min-width: auto !important; }
    `;

    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // --- 3. 核心功能 ---
    function applyTheme(container, themeName) {
        const theme = THEMES[themeName];
        for (const [key, value] of Object.entries(theme)) {
            container.style.setProperty(key, value);
        }
        localStorage.setItem('ai-toc-theme', themeName);
        state.currentTheme = themeName;
    }

    function createUI() {
        if (document.getElementById('ai-toc-container')) return;

        const container = document.createElement('div');
        container.id = 'ai-toc-container';
        applyTheme(container, state.currentTheme);

        const header = document.createElement('div');
        header.id = 'ai-toc-header';
        const titleSpan = document.createElement('span');
        titleSpan.textContent = CONFIG.title;
        
        const controls = document.createElement('div');
        controls.className = 'ai-toc-controls';

        // 🎨 换肤按钮
        const themeBtn = document.createElement('span');
        themeBtn.className = 'ai-toc-btn'; themeBtn.textContent = '🎨';
        
        // ▼ 折叠按钮
        const toggleBtn = document.createElement('span');
        toggleBtn.className = 'ai-toc-btn'; toggleBtn.textContent = '▼';

        controls.append(themeBtn, toggleBtn);
        header.append(titleSpan, controls);

        const body = document.createElement('div');
        body.id = 'ai-toc-body';

        container.append(header, body);
        document.body.appendChild(container);

        // 事件绑定
        themeBtn.onclick = () => applyTheme(container, state.currentTheme === 'purple' ? 'light' : 'purple');
        toggleBtn.onclick = () => {
            container.classList.toggle('toc-collapsed');
            toggleBtn.textContent = container.classList.contains('toc-collapsed') ? '◀' : '▼';
        };

        // 拖拽逻辑
        header.onmousedown = (e) => {
            if (e.target.closest('.ai-toc-btn')) return;
            state.isDragging = true;
            state.dragOffsetX = e.clientX - container.offsetLeft;
            state.dragOffsetY = e.clientY - container.offsetTop;
            header.style.cursor = 'grabbing';
        };
        document.onmousemove = (e) => {
            if (!state.isDragging) return;
            container.style.right = 'auto';
            container.style.left = (e.clientX - state.dragOffsetX) + 'px';
            container.style.top = (e.clientY - state.dragOffsetY) + 'px';
        };
        document.onmouseup = () => { state.isDragging = false; header.style.cursor = 'move'; };
    }

    function scanQuestions() {
        const body = document.getElementById('ai-toc-body');
        if (!body) return;

        let questions = [];
        if (location.host.includes('chatgpt.com')) {
            document.querySelectorAll('div[data-message-author-role="user"]').forEach(msg => {
                questions.push({ el: msg, text: msg.innerText || "附件提问" });
            });
        } else {
            document.querySelectorAll('user-query, .user-query-text').forEach(q => {
                if (q.innerText.trim()) questions.push({ el: q, text: q.innerText });
            });
        }

        if (questions.length === 0) {
            body.textContent = '等待对话...';
            body.style.textAlign = 'center';
            body.style.padding = '15px';
            body.style.fontSize = '12px';
            body.style.color = '#888';
            return;
        }

        const fragment = document.createDocumentFragment();
        questions.forEach((q, i) => {
            const item = document.createElement('div');
            item.className = 'ai-toc-item';
            const cleanText = q.text.replace(/\n/g, ' ').trim();
            if (state.bookmarks.has(cleanText)) item.classList.add('bookmarked');

            const star = document.createElement('span');
            star.className = 'ai-toc-star'; star.textContent = '★';
            star.onclick = (e) => {
                e.stopPropagation();
                if (state.bookmarks.has(cleanText)) state.bookmarks.delete(cleanText);
                else state.bookmarks.add(cleanText);
                scanQuestions(); // 刷新高亮状态
            };

            const text = document.createElement('span');
            text.className = 'ai-toc-text';
            text.textContent = cleanText.length > CONFIG.maxTextLength ? cleanText.slice(0, CONFIG.maxTextLength) + '...' : cleanText;

            item.append(star, text);
            item.onclick = () => q.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            fragment.appendChild(item);
        });

        body.textContent = '';
        body.appendChild(fragment);
    }

    // 初始化
    window.addEventListener('load', () => {
        createUI();
        setInterval(scanQuestions, CONFIG.scanInterval);
    });
})();