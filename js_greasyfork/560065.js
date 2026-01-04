// ==UserScript==
// @name         NodeSeek 热榜插件
// @namespace    http://nodeseek.com/
// @version      1.0
// @description  Nodeseek 侧边栏热榜
// @author       https://www.nodeseek.com/space/10539
// @match        https://www.nodeseek.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560065/NodeSeek%20%E7%83%AD%E6%A6%9C%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/560065/NodeSeek%20%E7%83%AD%E6%A6%9C%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        apis: {
            realtime: 'https://api.bimg.eu.org/hot.json',
            daily: 'https://api.bimg.eu.org/daily.json',
            weekly: 'https://api.bimg.eu.org/weekly.json'
        },
        refreshInterval: 60 * 1000,
        defaultCount: 10,
        insertSelector: '.nsk-panel.quick-access'
    };

    GM_addStyle(`
        .nsk-hot-panel {
            margin-bottom: 15px;
            background: var(--bg-color);
            border-radius: var(--border-radius);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            overflow: hidden;
            border: 1px solid var(--border-color);
            position: relative;
        }
        .hot-header-row {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 12px; 
            position: relative;
            border-bottom: none;
            height: 24px;
        }
        .hot-icon-left {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            align-items: center;
            color: #ff4d4f;
        }
        .hot-title {
            font-size: 15px;
            font-weight: 700;
            color: var(--text-color);
            z-index: 1;
        }
        .hot-refresh-btn {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: var(--text-color-secondary);
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
        }
        .hot-refresh-btn:hover {
            background-color: var(--bg-color-grey);
            color: var(--primary-color);
        }
        .hot-refresh-btn.status-loading svg {
            animation: spin 1s linear infinite;
            transform-origin: center center;
        }
        .hot-tabs-container { padding: 8px 12px; }
        .hot-tabs-track {
            position: relative;
            background-color: var(--bg-color-grey);
            border-radius: 8px;
            padding: 3px;
            display: flex;
            height: 30px;
        }
        .hot-tab-slider {
            position: absolute;
            top: 3px;
            left: 3px;
            width: calc((100% - 6px) / 3);
            height: calc(100% - 6px);
            background-color: var(--bg-color);
            border-radius: 6px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.08);
            transition: transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1);
            z-index: 1;
        }
        .hot-tab-item {
            flex: 1;
            text-align: center;
            font-size: 13px;
            font-weight: 500;
            color: var(--text-color-secondary);
            cursor: pointer;
            z-index: 2;
            line-height: 24px;
            transition: color 0.2s;
            user-select: none;
        }
        .hot-tab-item.active { color: var(--text-color); font-weight: 700; }
        .slider-pos-0 { transform: translateX(0%); }
        .slider-pos-1 { transform: translateX(100%); }
        .slider-pos-2 { transform: translateX(200%); }
        .nsk-hot-list {
            padding: 0 !important; 
            margin: 0 !important;
            list-style: none;
            width: 100%;
        }
        .nsk-hot-list li {
            height: auto !important;
            min-height: 42px;
            padding: 6px 14px;
            width: 100%;
            box-sizing: border-box;
            border-top: 1px dashed var(--border-color);
            display: flex;
            align-items: center;
        }
        .nsk-hot-list li:first-child { border-top: 1px solid var(--border-color); }
        .nsk-hot-list li a {
            display: flex !important;
            align-items: center !important;
            text-decoration: none !important;
            color: var(--text-color);
            width: 100%;
            line-height: 1.5 !important;
        }
        .nsk-hot-list li a:hover .hot-post-title { color: var(--primary-color); }
        .hot-rank-num {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 18px;
            height: 18px;
            border-radius: 5px;
            background: var(--bg-color-grey);
            color: var(--text-color-secondary);
            font-size: 11px;
            margin-right: 12px;
            font-weight: 700;
            flex-shrink: 0;
            margin-top: 1px;
        }
        .hot-rank-1 { background: #ff4d4f !important; color: #fff !important; }
        .hot-rank-2 { background: #ff7a45 !important; color: #fff !important; }
        .hot-rank-3 { background: #ffa940 !important; color: #fff !important; }
        .hot-post-title {
            flex: 1;
            font-size: 13.5px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-line-break: anywhere;
            -webkit-box-orient: vertical;
            overflow: hidden;
            word-break: break-word;
            transition: color 0.2s;
            letter-spacing: 0.2px;
        }
        .hot-loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 320px;
            color: var(--text-color-secondary);
            gap: 12px;
        }
        .hot-loading-icon {
            color: var(--primary-color);
            opacity: 0.8;
            display: flex;
        }
        .hot-loading-container .hot-loading-icon svg {
             animation: spin 1s linear infinite;
             transform-origin: center center;
             display: block;
        }
        .hot-loading-text { font-size: 13px; opacity: 0.7; }
        .hot-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 14px;
            font-size: 11px;
            color: var(--text-color-secondary);
            background: var(--bg-color-grey);
            border-top: 1px solid var(--border-color);
        }
        .hot-expand-btn { cursor: pointer; font-weight: 500; }
        .hot-expand-btn:hover { color: var(--primary-color); }
        .hot-item-hidden { display: none !important; }
        .status-loading { color: var(--primary-color); }
        .status-error { color: #ff4d4f !important; font-weight: 600; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
    `);

    const ICONS = {
        realFire: `<svg class="iconpark-icon" style="width:1.3em;height:1.3em;vertical-align:middle;"><use href="#fire"></use></svg>`,
        refresh: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
        loading: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`,
        error: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
    };

    const UI = {
        panel: null, listUl: null, refreshBtn: null, updateTime: null,
        toggleBtn: null, toggleText: null, slider: null, tabs: []
    };

    let state = {
        currentTab: 0,
        tabKeys: ['realtime', 'daily', 'weekly'],
        isLoading: false
    };

    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function formatTimeDiff(timestamp) {
        if (!timestamp) return '--';
        const diff = Math.floor((Date.now() / 1000) - timestamp);
        if (diff < 60) return '刚刚';
        return `${Math.floor(diff / 60)}分前`;
    }

    async function fetchData(type) {
        const apiUrl = CONFIG.apis[type];
        if (!apiUrl) return null;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); 
            const response = await fetch(`${apiUrl}?t=${Date.now()}`, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error('Network error');
            return await response.json();
        } catch (error) {
            return null;
        }
    }

    function updateFooterStatus(status, timestamp = 0) {
        if (!UI.refreshBtn || !UI.updateTime) return;
        
        status === 'loading' ? UI.refreshBtn.classList.add('status-loading') : UI.refreshBtn.classList.remove('status-loading');

        UI.updateTime.classList.remove('status-error');
        if (status === 'error') {
            UI.updateTime.classList.add('status-error');
            UI.updateTime.textContent = '连接失败';
        } else if (status === 'idle') {
            UI.updateTime.textContent = timestamp > 0 ? formatTimeDiff(timestamp) + '更新' : '--';
        }
    }

    function renderList(posts) {
        if (!UI.listUl) return;

        if (!posts || posts.length === 0) {
            const isError = posts === null;
            UI.listUl.innerHTML = `
                <div class="hot-loading-container">
                    <div class="hot-loading-icon">${isError ? ICONS.error : ICONS.loading}</div>
                    <span class="hot-loading-text">${isError ? '获取失败，请重试' : '暂无数据'}</span>
                </div>`;
            if (UI.toggleBtn) UI.toggleBtn.style.display = 'none';
            return;
        }

        const html = posts.map((item, index) => {
            const post = item.post;
            const rank = index + 1;
            const isHidden = index >= CONFIG.defaultCount ? 'hot-item-hidden' : '';
            const rankClass = index < 3 ? `hot-rank-${rank}` : '';
            const score = Math.floor(item.score);
            const safeTitle = escapeHtml(post.title);
            const safeAuthor = escapeHtml(post.author);
            const tooltip = `标题：${safeTitle}&#10;作者：${safeAuthor} (ID: ${post.author_id})&#10;浏览：${post.views} | 回复：${post.comments}&#10;热度：${score}`;

            return `
                <li class="${isHidden} hot-list-item">
                    <a href="/post-${post.id}-1" title="${tooltip}">
                        <span class="hot-rank-num ${rankClass}">${rank}</span>
                        <span class="hot-post-title">${safeTitle}</span>
                    </a>
                </li>
            `;
        }).join('');

        UI.listUl.innerHTML = html;
        
        if (UI.toggleBtn) {
            UI.toggleBtn.style.display = 'block';
            UI.toggleText.textContent = '展开全部 ▼';
        }
    }

    function renderLoading() {
        if (UI.listUl) {
            UI.listUl.innerHTML = `
                <div class="hot-loading-container">
                    <div class="hot-loading-icon">${ICONS.loading}</div>
                    <span class="hot-loading-text">正在更新...</span>
                </div>
            `;
        }
        if (UI.toggleBtn) UI.toggleBtn.style.display = 'none';
    }

    async function switchTab(index) {
        if (state.isLoading) return;

        state.currentTab = index;
        state.isLoading = true;

        if (UI.slider) UI.slider.className = `hot-tab-slider slider-pos-${index}`;
        UI.tabs.forEach((el, idx) => el.classList.toggle('active', idx === index));

        updateFooterStatus('loading');
        renderLoading(); 
        
        const data = await fetchData(state.tabKeys[index]);
        state.isLoading = false;
        
        if (data && data.posts) {
            renderList(data.posts);
            updateFooterStatus('idle', data.updated_at);
        } else {
            renderList(null); 
            updateFooterStatus('error');
        }
    }

    function initPanel() {
        const target = document.querySelector(CONFIG.insertSelector);
        if (!target) return;

        const panel = document.createElement('div');
        panel.className = 'nsk-panel nsk-hot-panel';
        
        panel.innerHTML = `
            <div class="hot-header-row">
                <div class="hot-icon-left">
                    ${ICONS.realFire}
                </div>
                <div class="hot-title">
                    <span>NodeSeek 热榜</span>
                </div>
                <div class="hot-refresh-btn" id="hot-refresh-btn" title="点击刷新">
                    ${ICONS.refresh}
                </div>
            </div>

            <div class="hot-tabs-container">
                <div class="hot-tabs-track">
                    <div class="hot-tab-slider slider-pos-0" id="hot-tab-slider"></div>
                    <div class="hot-tab-item active" data-idx="0">实时</div>
                    <div class="hot-tab-item" data-idx="1">日榜</div>
                    <div class="hot-tab-item" data-idx="2">周榜</div>
                </div>
            </div>
            
            <ul class="nsk-hot-list" id="hot-list-ul"></ul>

            <div class="hot-footer">
                <div class="hot-status-text" id="hot-last-update">--</div>
                <div class="hot-expand-btn" id="hot-toggle-container">
                    <span id="hot-toggle-text">展开全部 ▼</span>
                </div>
            </div>
        `;

        target.parentNode.insertBefore(panel, target);

        UI.panel = panel;
        UI.listUl = document.getElementById('hot-list-ul');
        UI.refreshBtn = document.getElementById('hot-refresh-btn');
        UI.updateTime = document.getElementById('hot-last-update');
        UI.toggleBtn = document.getElementById('hot-toggle-container');
        UI.toggleText = document.getElementById('hot-toggle-text');
        UI.slider = document.getElementById('hot-tab-slider');
        UI.tabs = Array.from(document.querySelectorAll('.hot-tab-item'));

        UI.refreshBtn.addEventListener('click', () => switchTab(state.currentTab));
        UI.tabs.forEach((tab) => {
            tab.addEventListener('click', () => switchTab(parseInt(tab.dataset.idx)));
        });

        UI.toggleBtn.addEventListener('click', () => {
            const hiddenItems = UI.listUl.querySelectorAll('.hot-item-hidden');
            if (hiddenItems.length > 0) {
                hiddenItems.forEach(el => el.classList.remove('hot-item-hidden'));
                UI.toggleText.textContent = '收起榜单 ▲';
            } else {
                const allItems = UI.listUl.querySelectorAll('li');
                allItems.forEach((el, idx) => {
                    if (idx >= CONFIG.defaultCount) el.classList.add('hot-item-hidden');
                });
                UI.toggleText.textContent = '展开全部 ▼';
            }
        });

        switchTab(0);
        
        setInterval(() => {
            if (!document.hidden && !state.isLoading) {
                switchTab(state.currentTab);
            }
        }, CONFIG.refreshInterval);
    }

    initPanel();

})();