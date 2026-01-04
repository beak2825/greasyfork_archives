// ==UserScript==
// @name         JPMD Blog 文章高亮標記 (Checkbox Highlighter)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在 jpmdblog.com 的貼文與列表頁增加勾選方塊，懸浮清單顯示目前標記，計數器顯示「N則未讀」，頁碼可直接輸入跳轉（標記上限增加至3個）。
// @author       Gemini
// @match        https://jpmdblog.com/*
// @match        https://www.jpmdblog.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557219/JPMD%20Blog%20%E6%96%87%E7%AB%A0%E9%AB%98%E4%BA%AE%E6%A8%99%E8%A8%98%20%28Checkbox%20Highlighter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557219/JPMD%20Blog%20%E6%96%87%E7%AB%A0%E9%AB%98%E4%BA%AE%E6%A8%99%E8%A8%98%20%28Checkbox%20Highlighter%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 設定區 ---
    const CONFIG = {
        // 偵測文章的選擇器
        articleSelector: [
            'article',
            '.post',
            '.type-post',
            '.status-publish',
            '.post-card',
            '.blog-post',
            '.entry',
            'div[class*="post-"]',
            'div[class*="entry-"]',
            '.archive-item'
        ].join(', '),

        // 忽略的選擇器
        ignoreSelector: [
            '.post-content', 
            '.entry-content', 
            '.article-content',
            '.post-inner',
            '.post-navigation',
            '.post-author',
            '.related-posts'
        ].join(', '),

        // 嘗試抓取日期的選擇器
        dateSelector: [
            'time',
            '.entry-date',
            '.post-date',
            '.date',
            '.published',
            '.meta-date',
            '.post-meta', 
            '.entry-meta',
            '.meta',
            'span[class*="date"]',
            'div[class*="date"]'
        ].join(', '),
        
        // 尋找文章唯一標識符 (ID) 的方法
        linkSelector: 'a[href*="/"]', 
        
        // 高亮顏色
        highlightColor: '#fff9c4', // 淺黃色
        borderColor: '#fbc02d',    // 深黃色邊框
        
        // 儲存空間的 Key
        storageKey: 'jpmd_highlighted_posts_v1',
        
        // 最大往後搜尋頁數 (避免無限請求)
        maxSearchPages: 50,
        
        // 標記上限
        maxMarks: 3,

        // 除錯模式
        debug: true
    };

    // --- CSS 樣式注入 ---
    const styles = `
        /* 讓文章容器變成相對定位 */
        ${CONFIG.articleSelector} {
            position: relative !important;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* 隱藏不該出現的區域 */
        .sidebar .jpmd-checkbox-wrapper,
        .widget .jpmd-checkbox-wrapper,
        #secondary .jpmd-checkbox-wrapper,
        footer .jpmd-checkbox-wrapper {
            display: none !important;
        }

        /* 高亮狀態 */
        .jpmd-highlighted {
            background-color: ${CONFIG.highlightColor} !important;
            box-shadow: 0 0 15px rgba(251, 192, 45, 0.5) !important;
            border: 2px solid ${CONFIG.borderColor} !important;
            border-radius: 8px;
        }
        
        /* 定位時的閃爍效果 */
        @keyframes jpmd-flash {
            0% { box-shadow: 0 0 15px rgba(251, 192, 45, 0.5); }
            50% { box-shadow: 0 0 30px rgba(251, 192, 45, 1); transform: scale(1.02); }
            100% { box-shadow: 0 0 15px rgba(251, 192, 45, 0.5); transform: scale(1); }
        }
        .jpmd-scroll-target {
            animation: jpmd-flash 1s ease-in-out 3; /* 閃爍三次 */
        }

        /* Checkbox 容器 - 35px 圓角方形 */
        .jpmd-checkbox-wrapper {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 999990; 
            background: #ffffff;
            padding: 0;
            border-radius: 6px; 
            border: 3px solid #fbc02d; 
            box-shadow: 0 4px 8px rgba(0,0,0,0.4); 
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            width: 35px;
            height: 35px;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .jpmd-checkbox-wrapper:hover {
            transform: scale(1.15);
            box-shadow: 0 6px 12px rgba(0,0,0,0.5);
        }

        /* 隱藏原生 Checkbox 外觀，改用自定義樣式 */
        .jpmd-checkbox-wrapper input[type="checkbox"] {
            appearance: none;
            -webkit-appearance: none;
            width: 100%;
            height: 100%;
            margin: 0;
            cursor: pointer;
            outline: none;
            position: relative;
        }

        /* 自定義打勾符號 (純 CSS 繪製) */
        .jpmd-checkbox-wrapper input[type="checkbox"]:checked::after {
            content: '';
            position: absolute;
            left: 50%;
            top: 45%;
            width: 8px;
            height: 16px;
            border: solid #fbc02d;
            border-width: 0 4px 4px 0;
            transform: translate(-50%, -60%) rotate(45deg);
        }
        
        .jpmd-checkbox-wrapper:hover::after {
            content: "標記";
            position: absolute;
            top: 110%;
            right: 50%;
            transform: translateX(50%);
            background: #333;
            color: #fff;
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 4px;
            white-space: nowrap;
            pointer-events: none;
            z-index: 1000;
        }

        /* --- 懸浮框樣式 --- */
        .jpmd-float-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 1000000;
            display: flex;
            align-items: center;
        }

        /* 轉頁按鈕群組 */
        .jpmd-nav-group {
            display: flex;
            align-items: center;
            margin-right: 15px;
            background: rgba(255,255,255,0.95);
            padding: 0 5px;
            border-radius: 25px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            height: 50px;
            font-family: "Microsoft JhengHei", sans-serif;
        }
        
        .jpmd-nav-btn {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 24px;
            color: #fbc02d;
            font-weight: bold;
            user-select: none;
            border-radius: 50%;
            transition: background 0.2s, color 0.2s;
            line-height: 1;
        }
        .jpmd-nav-btn:hover {
            background: #fff9c4;
        }
        .jpmd-nav-btn.disabled {
            color: #ccc;
            cursor: default;
            background: transparent !important;
        }

        /* 頁碼輸入框樣式 */
        .jpmd-nav-curr-input {
            width: 45px;
            border: none;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            color: #555;
            outline: none;
            background: transparent;
            font-family: inherit;
            padding: 0;
            height: 30px;
            border-left: 1px solid #eee;
            border-right: 1px solid #eee;
            -moz-appearance: textfield; /* Firefox 移除上下箭頭 */
        }
        /* Chrome/Safari/Edge 移除上下箭頭 */
        .jpmd-nav-curr-input::-webkit-outer-spin-button,
        .jpmd-nav-curr-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        .jpmd-nav-curr-input:focus {
            color: #fbc02d;
            background: #fafafa;
        }

        .jpmd-float-btn {
            width: 50px;
            height: 50px;
            background: #fbc02d;
            border-radius: 50%;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            font-size: 24px;
            transition: transform 0.2s;
            user-select: none;
            position: relative;
        }
        .jpmd-float-btn:hover {
            transform: scale(1.1);
            background: #f9a825;
        }
        
        /* 新增貼文計數氣泡 */
        .jpmd-new-counter {
            font-family: "Microsoft JhengHei", "微軟正黑體", sans-serif;
            background: #9e9e9e; 
            color: white;
            font-size: 18px; 
            font-weight: bold;
            height: 50px; 
            min-width: 50px;
            padding: 0 15px; 
            border-radius: 25px; 
            margin-right: 15px; 
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: transform 0.3s, background-color 0.3s;
            pointer-events: auto; 
            cursor: pointer;      
            white-space: nowrap;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .jpmd-new-counter:hover {
            transform: scale(1.05);
        }
        .jpmd-new-counter.show {
            opacity: 1;
            transform: translateX(0);
        }

        .jpmd-float-panel {
            position: fixed;
            bottom: 90px;
            right: 30px;
            width: 320px;
            max-height: 50vh;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 1000000;
            display: none;
            flex-direction: column;
            overflow: hidden;
            font-family: sans-serif;
        }
        .jpmd-float-panel.open {
            display: flex;
        }
        .jpmd-panel-header {
            background: #fbc02d;
            color: #333;
            padding: 10px 15px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eee;
        }
        .jpmd-panel-body {
            flex: 1;
            overflow-y: auto;
            padding: 0;
            background: #fcfcfc;
        }
        .jpmd-list-item {
            padding: 10px 15px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            background: white;
            transition: background 0.2s;
        }
        .jpmd-list-item:hover {
            background: #fffde7;
        }
        .jpmd-list-item span.jpmd-title {
            color: #333;
            flex: 1;
            margin-right: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
            font-weight: 500;
        }
        .jpmd-remove-btn {
            color: #ef5350;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            line-height: 1;
            padding: 0 5px;
        }
        .jpmd-remove-btn:hover {
            color: #d32f2f;
        }
        .jpmd-empty-msg {
            padding: 30px;
            text-align: center;
            color: #999;
            font-size: 13px;
        }
        .jpmd-panel-body::-webkit-scrollbar {
            width: 6px;
        }
        .jpmd-panel-body::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 3px;
        }
    `;

    // 注入 CSS
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(styles);
    } else {
        const styleEl = document.createElement('style');
        styleEl.innerHTML = styles;
        document.head.appendChild(styleEl);
    }

    // --- 邏輯處理 ---
    let newPostCount = 0;
    let firstNewPostId = null; 
    let isCalculating = false;

    function log(...args) {
        if (CONFIG.debug) console.log('[JPMD Highlighter]', ...args);
    }

    function getStoredState() {
        const stored = localStorage.getItem(CONFIG.storageKey);
        return stored ? JSON.parse(stored) : {};
    }

    // 更新 UI 狀態以符合 stored state
    function syncUIWithState() {
        const state = getStoredState();
        const allArticles = document.querySelectorAll(CONFIG.articleSelector);
        
        allArticles.forEach(article => {
            const id = article.dataset.jpmdId || getArticleId(article);
            if (!id) return;

            const cb = article.querySelector('input[type="checkbox"]');
            if (state[id]) {
                article.classList.add('jpmd-highlighted');
                if (cb) cb.checked = true;
            } else {
                article.classList.remove('jpmd-highlighted');
                if (cb) cb.checked = false;
            }
        });
    }

    // 修改：支援多標記 (上限 3 個)
    function saveState(id, isChecked, title = null, sourceUrl = null, articleDate = 0) {
        let state = getStoredState(); 
        
        if (isChecked) {
            const keys = Object.keys(state);
            // 如果超過上限，移除最早標記的一個 (timestamp 最小的)
            if (keys.length >= CONFIG.maxMarks && !state[id]) {
                // 找出 timestamp 最小的 key
                const oldestKey = keys.reduce((a, b) => {
                    return state[a].timestamp < state[b].timestamp ? a : b;
                });
                delete state[oldestKey];
            }

            state[id] = {
                title: title || id,
                timestamp: Date.now(), 
                sourceUrl: sourceUrl,
                articleDate: articleDate 
            };
        } else {
            delete state[id];
        }
        
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
        updatePanelList(); 
        syncUIWithState(); // 同步 UI (移除被擠掉的標記)
        startGlobalCounting(); 
    }

    function normalizePath(path) {
        if (!path) return '';
        return path.endsWith('/') ? path.slice(0, -1) : path;
    }

    function getArticleTitle(article) {
        const titleEl = article.querySelector('h1, h2, h3, .entry-title, .post-title, .card-title, .title');
        return titleEl ? titleEl.innerText.trim() : '未命名文章';
    }

    function getArticleDate(article) {
        const dateEl = article.querySelector(CONFIG.dateSelector);
        let dateText = '';
        
        if (dateEl) {
            const datetimeAttr = dateEl.getAttribute('datetime');
            if (datetimeAttr) {
                const ts = Date.parse(datetimeAttr);
                if (!isNaN(ts)) return ts;
            }
            const titleAttr = dateEl.getAttribute('title');
            if (titleAttr) {
                const ts = Date.parse(titleAttr);
                if (!isNaN(ts)) return ts;
            }
            dateText = dateEl.innerText.trim();
        } else {
            dateText = article.innerText;
        }

        const datePattern = /(\d{4}[-./]\d{1,2}[-./]\d{1,2})|((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i;
        const match = dateText.match(datePattern);

        if (match) {
            let foundDateStr = match[0];
            foundDateStr = foundDateStr.replace(/\./g, '/');
            const ts = Date.parse(foundDateStr);
            if (!isNaN(ts)) return ts;
        }

        return 0; 
    }

    function buildSourceUrl(article) {
        let currentSourceUrl = window.location.href;
        if (article.id) {
            const hashIndex = currentSourceUrl.indexOf('#');
            const base = hashIndex > -1 ? currentSourceUrl.substring(0, hashIndex) : currentSourceUrl;
            currentSourceUrl = base + '#' + article.id;
        }
        return currentSourceUrl;
    }

    function getArticleId(article) {
        let link = article.querySelector('h1 a, h2 a, h3 a, .entry-title a, a.post-link, a.card-link, .post-thumbnail a');

        if (!link) {
            const candidates = article.querySelectorAll(CONFIG.linkSelector);
            for (let cand of candidates) {
                const href = cand.getAttribute('href');
                if (href && !href.includes('/tag/') && !href.includes('/category/') && !href.includes('/author/') && !href.includes('#')) {
                    link = cand;
                    break;
                }
            }
        }

        if (link) {
            try {
                return new URL(link.href).pathname;
            } catch (e) {
                return link.getAttribute('href');
            }
        }

        const isMainContent = article.querySelector('h1');
        if (isMainContent && window.location.pathname.length > 1) {
            return window.location.pathname;
        }

        return null;
    }

    function isInIgnoredArea(element) {
        return element.closest('.sidebar') || 
               element.closest('.widget') || 
               element.closest('#secondary') || 
               element.closest('.comments') || 
               element.closest('footer') ||
               element.matches(CONFIG.ignoreSelector) ||
               element.closest(CONFIG.ignoreSelector);
    }

    function getCurrentPageNumber() {
        const match = window.location.pathname.match(/\/page\/(\d+)\/?/);
        return match ? parseInt(match[1], 10) : 1;
    }

    // --- 全域計數核心邏輯 ---
    async function startGlobalCounting() {
        if (isCalculating) return;
        isCalculating = true;

        const state = getStoredState();
        const values = Object.values(state);
        let thresholdDate = 0;
        
        // 找出所有標記中日期最新的那篇，作為計數基準
        if (values.length > 0) {
            thresholdDate = values.reduce((max, item) => Math.max(max, item.articleDate || 0), 0);
        }

        if (thresholdDate === 0) {
            newPostCount = 0;
            firstNewPostId = null;
            updateNewPostCounterUI();
            isCalculating = false;
            return;
        }

        log('Starting Global Count. Threshold Date:', new Date(thresholdDate));
        updateNewPostCounterUI(true); 

        let count = 0;
        let firstId = null;
        let foundMark = false; // 是否遇到任何一個已標記的文章 (且該文章日期 <= threshold)
        // 修正邏輯：因為有多個標記，我們其實是在找「比最新標記還新」的文章。
        // 當我們遇到「最新標記的那篇文章」時，就可以停止了。
        // 也就是說，遇到 ID 在 state 裡面，且其日期 == thresholdDate 的那篇。

        let page = 1;
        const currentPage = getCurrentPageNumber();
        const countedIds = new Set();

        while (page <= CONFIG.maxSearchPages && !foundMark) {
            let doc = null;

            if (page === currentPage) {
                doc = document;
            } else {
                try {
                    const url = page === 1 ? window.location.origin : `${window.location.origin}/page/${page}/`;
                    const response = await fetch(url);
                    const text = await response.text();
                    const parser = new DOMParser();
                    doc = parser.parseFromString(text, 'text/html');
                } catch (e) {
                    console.error(`Error fetching page ${page}`, e);
                    break; 
                }
            }

            const pageArticles = doc.querySelectorAll(CONFIG.articleSelector);
            if (pageArticles.length === 0) {
                break;
            }

            for (let i = 0; i < pageArticles.length; i++) {
                const article = pageArticles[i];
                if (isInIgnoredArea(article)) continue;

                const currentId = article.dataset.jpmdId || getArticleId(article);
                if (!currentId) continue;

                if (countedIds.has(currentId)) continue;
                countedIds.add(currentId);

                // 如果這篇文章被標記了
                if (state[currentId]) {
                    // 且這篇文章的日期就是我們的基準日期 (代表遇到最新的那個標記了)
                    // 或者文章日期比基準還舊
                    const d = getArticleDate(article);
                    if (d <= thresholdDate) {
                        foundMark = true;
                        break;
                    }
                }

                const d = getArticleDate(article);
                
                if (d > thresholdDate) {
                    count++;
                    if (!firstId) firstId = currentId;
                } else if (d === thresholdDate && !foundMark) {
                    // 日期相同，但還沒遇到標記 (同日較新)
                    count++;
                    if (!firstId) firstId = currentId;
                }
            }

            page++;
        }

        newPostCount = count;
        firstNewPostId = firstId;
        isCalculating = false;
        updateNewPostCounterUI();
    }

    function processArticle(article) {
        if (article.dataset.jpmdProcessed) return;
        if (article.offsetHeight < 100 || article.offsetWidth < 100) return;
        if (isInIgnoredArea(article)) return;

        const articleId = getArticleId(article);
        if (!articleId) return;

        const currentPath = normalizePath(window.location.pathname);
        const targetId = normalizePath(articleId);

        if (targetId === currentPath && currentPath !== '' && currentPath !== '/' && currentPath !== '/index.html') {
            return;
        }
        if (article.querySelector('h1') && currentPath !== '' && currentPath !== '/' && currentPath !== '/index.html') {
            return;
        }

        const parentMatch = article.parentElement.closest(CONFIG.articleSelector);
        if (parentMatch) {
            if (parentMatch.querySelector('.jpmd-checkbox-wrapper') || parentMatch.dataset.jpmdProcessed) {
                return; 
            }
        }

        article.dataset.jpmdProcessed = 'true';
        article.dataset.jpmdId = articleId;

        if (!article.id) {
            const safeIdSuffix = articleId.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/^-+|-+$/g, '');
            const finalSuffix = safeIdSuffix.length > 2 ? safeIdSuffix : Math.random().toString(36).substr(2, 9);
            article.id = 'jpmd-' + finalSuffix;
        }

        const currentHash = window.location.hash;
        if (currentHash === '#' + article.id) {
            setTimeout(() => {
                article.scrollIntoView({ behavior: 'smooth', block: 'center' });
                article.classList.add('jpmd-scroll-target');
                setTimeout(() => {
                    article.classList.remove('jpmd-scroll-target');
                }, 3000);
            }, 600);
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'jpmd-checkbox-wrapper';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const state = getStoredState();
        if (state[articleId]) {
            checkbox.checked = true;
            article.classList.add('jpmd-highlighted');
            
            const currentSourceUrl = buildSourceUrl(article);
            const savedData = state[articleId];
            const savedUrl = (typeof savedData === 'object') ? savedData.sourceUrl : null;
            const articleDate = getArticleDate(article);

            // 更新資料：如果有欄位缺失或 URL 變更
            if (savedUrl !== currentSourceUrl || !savedData.articleDate) {
                 const currentTitle = getArticleTitle(article);
                 // 保留時間戳，只更新內容
                 saveState(articleId, true, currentTitle, currentSourceUrl, articleDate, true);
            }
        }

        checkbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            const title = getArticleTitle(article);
            const currentSourceUrl = buildSourceUrl(article);
            const articleDate = getArticleDate(article); 

            // 多標記模式下，不清除其他標記
            saveState(articleId, isChecked, title, currentSourceUrl, articleDate); 
        });

        wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        wrapper.appendChild(checkbox);
        article.appendChild(wrapper);
    }

    function scanPosts() {
        const articles = document.querySelectorAll(CONFIG.articleSelector);
        articles.forEach(processArticle);
    }

    // --- 懸浮框 UI 邏輯 ---
    
    function updateNewPostCounterUI(loading = false) {
        const counter = document.getElementById('jpmd-new-counter');
        if (counter) {
            if (loading) {
                counter.innerText = '計算中...';
                counter.style.background = '#9e9e9e';
            } else {
                counter.innerText = `${newPostCount}則未讀`; 
                if (newPostCount > 0) {
                    counter.style.background = '#ff5252'; 
                    counter.title = '點擊捲動到第一篇新貼文';
                } else {
                    counter.style.background = '#9e9e9e'; 
                    counter.title = '沒有新貼文';
                }
            }
        }
    }

    function createFloatingUI() {
        if (document.querySelector('.jpmd-float-container')) return;

        const container = document.createElement('div');
        container.className = 'jpmd-float-container';

        // 新增轉頁按鈕群組
        const navGroup = document.createElement('div');
        navGroup.className = 'jpmd-nav-group';
        
        const currentPage = getCurrentPageNumber();
        
        // 上一頁按鈕
        const prevBtn = document.createElement('div');
        prevBtn.className = 'jpmd-nav-btn prev';
        prevBtn.innerHTML = '‹';
        prevBtn.title = '上一頁';
        if (currentPage > 1) {
            prevBtn.onclick = () => {
                const target = currentPage - 1;
                window.location.href = target === 1 ? '/' : `/page/${target}/`;
            };
        } else {
            prevBtn.classList.add('disabled');
        }

        // 當前頁數/跳轉輸入框
        const currInput = document.createElement('input');
        currInput.type = 'number';
        currInput.className = 'jpmd-nav-curr-input';
        currInput.value = currentPage;
        currInput.title = '輸入頁碼後按 Enter 跳轉';
        
        currInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const target = parseInt(currInput.value, 10);
                if (!isNaN(target) && target > 0) {
                    window.location.href = target === 1 ? '/' : `/page/${target}/`;
                }
            }
        });
        
        currInput.addEventListener('focus', () => {
            currInput.select();
        });

        // 下一頁按鈕
        const nextBtn = document.createElement('div');
        nextBtn.className = 'jpmd-nav-btn next';
        nextBtn.innerHTML = '›';
        nextBtn.title = '下一頁';
        nextBtn.onclick = () => {
             window.location.href = `/page/${currentPage + 1}/`;
        };

        navGroup.appendChild(prevBtn);
        navGroup.appendChild(currInput); 
        navGroup.appendChild(nextBtn);
        
        // 計數器
        const counter = document.createElement('div');
        counter.id = 'jpmd-new-counter';
        counter.className = 'jpmd-new-counter';
        counter.innerText = '計算中...'; 
        
        counter.addEventListener('click', () => {
            if (firstNewPostId) {
                const target = document.querySelector(`[data-jpmd-id="${CSS.escape(firstNewPostId)}"]`);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    target.classList.add('jpmd-scroll-target');
                    setTimeout(() => {
                        target.classList.remove('jpmd-scroll-target');
                    }, 3000);
                } else {
                    if (confirm('第一篇未讀貼文位於其他頁面（例如首頁），是否前往該文章？')) {
                        if (firstNewPostId.startsWith('http') || firstNewPostId.startsWith('/')) {
                             window.location.href = firstNewPostId;
                        }
                    }
                }
            }
        });

        // 標記清單按鈕
        const btn = document.createElement('div');
        btn.className = 'jpmd-float-btn';
        btn.innerHTML = '★'; 
        btn.title = '顯示已標記文章';
        
        const panel = document.createElement('div');
        panel.className = 'jpmd-float-panel';
        panel.innerHTML = `
            <div class="jpmd-panel-header">
                <span>目前標記</span>
            </div>
            <div class="jpmd-panel-body" id="jpmd-panel-list">
                <!-- 列表內容 -->
            </div>
        `;
        
        container.appendChild(navGroup);
        container.appendChild(counter);
        container.appendChild(btn);
        document.body.appendChild(container);
        document.body.appendChild(panel);
        
        btn.addEventListener('click', () => {
            panel.classList.toggle('open');
            if (panel.classList.contains('open')) {
                updatePanelList();
            }
        });

        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !container.contains(e.target) && panel.classList.contains('open')) {
                panel.classList.remove('open');
            }
        });
        
        // 啟動全域計算
        startGlobalCounting();
    }

    function updatePanelList() {
        const listContainer = document.getElementById('jpmd-panel-list');
        if (!listContainer) return;
        
        const state = getStoredState();
        // 排序：依照 timestamp 新到舊
        const keys = Object.keys(state).sort((a, b) => state[b].timestamp - state[a].timestamp);
        
        if (keys.length === 0) {
            listContainer.innerHTML = '<div class="jpmd-empty-msg">尚無標記文章</div>';
            return;
        }
        
        let html = '';
        keys.forEach(key => {
            const data = state[key];
            let title = '未知標題';
            
            if (typeof data === 'object') {
                title = data.title || key;
            } else {
                title = key;
            }
            
            html += `
                <div class="jpmd-list-item">
                    <span class="jpmd-title" title="${title}">${title}</span>
                    <span class="jpmd-remove-btn" data-id="${key}" title="移除">×</span>
                </div>
            `;
        });
        
        listContainer.innerHTML = html;
        
        listContainer.querySelectorAll('.jpmd-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                saveState(id, false); 
            });
        });
    }

    // --- 啟動流程 ---
    createFloatingUI(); 
    setTimeout(scanPosts, 1000); 

    const observer = new MutationObserver((mutations) => {
        let shouldScan = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                shouldScan = true;
            }
        });
        if (shouldScan) {
            setTimeout(scanPosts, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();