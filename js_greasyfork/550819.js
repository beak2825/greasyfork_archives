// ==UserScript==
// @name         B站推荐过滤器
// @namespace    http://tampermonkey.net/
// @homepageURL  https://github.com/StarsWhere/Bilibili-Video-Filter
// @version      7.0.0
// @description  Bilibili首页推荐过滤器：智能屏蔽广告、分类、直播和自定义关键词，支持自适应持续屏蔽、拖拽控制面板、暗黑模式切换，以及修复屏蔽后页面留白问题。优化UI交互，提升浏览体验。
// @author       StarsWhere
// @match        *://www.bilibili.com/*
// @exclude      *://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550819/B%E7%AB%99%E6%8E%A8%E8%8D%90%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/550819/B%E7%AB%99%E6%8E%A8%E8%8D%90%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // ===== 工具函数 =====
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };
    const throttle = (func, limit) => {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };
    const safeExecute = (func, errorMessage) => {
        try {
            return func();
        } catch (error) {
            console.warn(`[B站过滤插件] ${errorMessage}:`, error);
            return 0;
        }
    };
    // ===== 选择器常量 =====
    const SELECTORS = {
        CARD_CONTAINERS: '.feed-card, .bili-video-card, .bili-feed-card',
        LIVE_CARDS: '.bili-live-card, .floor-single-card',
        AD_INDICATORS: '.bili-ad, [ad-id], .ad-report, [data-report*="ad"], .bili-video-card__stats--text:is(:has-text("广告"), :has-text("推广"))',
        VIDEO_TITLES: '.bili-video-card__info--tit, .bili-video-card__info--title',
        VIDEO_AUTHORS: '.bili-video-card__info--author, .bili-video-card__info--owner',
        CATEGORY_TITLES: '.floor-title, .bili-grid-floor-header__title',
        LIVE_INDICATORS: '.bili-video-card__stats--item[title*="直播"], .live-tag, .bili-live-card__info--text, .recommend-card__live-status',
        CARD_SELECTORS: ['.feed-card', '.bili-video-card', '.bili-live-card', '.bili-feed-card', '.floor-single-card']
    };
    // ===== 配置管理器 =====
    class ConfigManager {
        constructor() {
            this.config = {};
            this.loadConfig();
        }
        loadConfig() {
            this.config = {
                video: {
                    enabled: GM_getValue('video.enabled', true),
                    blacklist: GM_getValue('video.blacklist', [])
                },
                category: {
                    enabled: GM_getValue('category.enabled', true),
                    blacklist: GM_getValue('category.blacklist', ['番剧', '直播', '国创', '综艺', '课堂', '电影', '电视剧', '纪录片', '漫画'])
                },
                ad: GM_getValue('ad', true),
                live: GM_getValue('live', true),
                continuousBlock: GM_getValue('continuousBlock', false),
                floatBtnPosition: GM_getValue('floatBtnPosition', { x: 30, y: 100 }),
                darkMode: GM_getValue('darkMode', false)
            };
        }
        get(path) {
            return path.split('.').reduce((acc, key) => acc?.[key], this.config);
        }
        setValue(key, value) {
            GM_setValue(key, value);
            const keys = key.split('.');
            let current = this.config;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
        }
        reset() {
            const keysToDelete = [
                'video.enabled', 'video.blacklist',
                'category.enabled', 'category.blacklist',
                'ad', 'live', 'continuousBlock', 'floatBtnPosition', 'darkMode',
                'videoEnabled', 'videoBlacklist', 'categoryEnabled', 'categoryBlacklist',
                'adEnabled', 'liveEnabled'
            ];
            keysToDelete.forEach(key => GM_setValue(key, undefined));
        }
    }
    const configManager = new ConfigManager();

    // ===== 自适应屏蔽器 =====
    class AdaptiveBlocker {
        constructor() {
            this.baseInterval = 2000;
            this.maxInterval = 8000;
            this.minInterval = 500;
            this.currentInterval = this.baseInterval;
            this.lastBlockCount = 0;
            this.intervalId = null;
            this.isRunning = false;
        }
        adjustInterval(currentBlockCount) {
            if (currentBlockCount > this.lastBlockCount) {
                this.currentInterval = Math.max(this.minInterval, this.currentInterval * 0.7);
            } else {
                this.currentInterval = Math.min(this.maxInterval, this.currentInterval * 1.3);
            }
            this.lastBlockCount = currentBlockCount;
        }
        start() {
            if (this.isRunning) return;
            this.isRunning = true;
            const execute = () => {
                if (!this.isRunning) return;
                const blockedCount = runAllBlockers();
                this.adjustInterval(blockedCount);
                this.intervalId = setTimeout(execute, this.currentInterval);
            };
            execute();
        }
        stop() {
            this.isRunning = false;
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
    }
    const adaptiveBlocker = new AdaptiveBlocker();
    // ===== 状态指示器 =====
    function showBlockingStatus(count = 0) {
        let indicator = document.querySelector('.block-status-indicator');
        if (!indicator) {
            const indicatorContainer = document.createElement('div');
            indicatorContainer.innerHTML = `<style>.block-status-indicator{position:fixed;top:20px;right:20px;background:rgba(0,161,214,0.9);color:#fff;padding:8px 12px;border-radius:6px;font-size:12px;z-index:9998;opacity:0;transition:opacity .3s;pointer-events:none}.block-status-indicator.show{opacity:1}</style><div class="block-status-indicator"></div>`;
            document.head.appendChild(indicatorContainer.querySelector('style'));
            indicator = indicatorContainer.querySelector('.block-status-indicator');
            document.body.appendChild(indicator);
        }
        if (count > 0) indicator.textContent = `🛡️ 已屏蔽 ${count} 项`;
        indicator.classList.add('show');
        setTimeout(() => indicator.classList.remove('show'), 1500);
    }
    // ===== 核心屏蔽功能 =====
    function removeCardElement(element) {
        if (!element || element.dataset.blocked) return false;
        const card = element.closest(SELECTORS.CARD_SELECTORS.join(', '));
        if (card && !card.dataset.blocked) {
            card.dataset.blocked = 'true';
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => card.remove(), 300);
            return true;
        }
        return false;
    }
    function blockAds() {
        if (!configManager.get('ad')) return 0;
        let blockedCount = 0;
        document.querySelectorAll(SELECTORS.AD_INDICATORS).forEach(indicator => {
            if (removeCardElement(indicator)) blockedCount++;
        });
        const recommendItem = document.querySelector(".recommended-swipe");
        if (recommendItem) {
            recommendItem.remove();
            blockedCount++;
        }
        return blockedCount;
    }
    function blockCategories() {
        if (!configManager.get('category.enabled')) return 0;
        let blockedCount = 0;
        const blacklist = configManager.get('category.blacklist') || [];
        document.querySelectorAll('.floor-single-card, .bili-grid-floor-header').forEach(card => {
            if (card.dataset.blocked) return;
            const categoryElement = card.querySelector(SELECTORS.CATEGORY_TITLES);
            if (categoryElement && blacklist.some(keyword => categoryElement.textContent.trim().includes(keyword))) {
                const floorContainer = card.closest('.bili-grid-floor') || card;
                if (floorContainer && removeCardElement(floorContainer)) blockedCount++;
            }
        });
        return blockedCount;
    }
    function blockVideos() {
        if (!configManager.get('video.enabled')) return 0;
        const blacklist = configManager.get('video.blacklist') || [];
        if (blacklist.length === 0) return 0;
        let blockedCount = 0;
        document.querySelectorAll(SELECTORS.CARD_CONTAINERS).forEach(card => {
            if (card.dataset.blocked) return;
            const title = card.querySelector(SELECTORS.VIDEO_TITLES)?.textContent.trim() || '';
            const author = card.querySelector(SELECTORS.VIDEO_AUTHORS)?.textContent.trim() || '';
            if (blacklist.some(keyword => title.includes(keyword) || author.includes(keyword))) {
                if (removeCardElement(card)) blockedCount++;
            }
        });
        return blockedCount;
    }
    function blockLive() {
        if (!configManager.get('live')) return 0;
        let blockedCount = 0;
        document.querySelectorAll(`${SELECTORS.LIVE_CARDS}, ${SELECTORS.CARD_CONTAINERS}`).forEach(card => {
            if (card.dataset.blocked) return;
            const isLive = card.querySelector(SELECTORS.LIVE_INDICATORS) ||
                card.textContent.includes('正在直播') ||
                card.querySelector('.floor-title')?.textContent.includes('直播');
            if (isLive && removeCardElement(card)) blockedCount++;
        });
        return blockedCount;
    }
    const runAllBlockers = () => {
        const totalBlocked = [blockAds, blockCategories, blockVideos, blockLive]
            .reduce((sum, func) => sum + safeExecute(func, `${func.name}执行失败`), 0);
        if (totalBlocked > 0) showBlockingStatus(totalBlocked);
        return totalBlocked;
    };
    const debouncedRunAllBlockers = debounce(runAllBlockers, 300);

    // ===== UI 组件 =====
    function injectGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --panel-bg: rgba(255, 255, 255, 0.95);
                --panel-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
                --text-primary: #18191c;
                --text-secondary: #5f6368;
                --text-tertiary: #888c92;
                --border-color: #e3e5e7;
                --hover-bg: #f1f2f3;
                --active-bg: #e7e8e9;
                --accent-blue: #00a1d6;
                --accent-blue-hover: #00b5e5;
                --accent-red: #fd4c5d;
                --accent-green: #52c41a;
                --accent-gray: #d9d9d9;
                --input-bg: #f1f2f3;
                --input-border: #e3e5e7;
                --tag-bg: #f1f2f3;
                --tag-text: #5f6368;
                --tag-hover-bg: #e7e8e9;
                --info-bg: #e6f7ff;
                --info-text: #0958d9;
            }
            body[data-theme="dark"] {
                --panel-bg: rgba(37, 37, 37, 0.95);
                --panel-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
                --text-primary: #e7e9ea;
                --text-secondary: #b0b3b8;
                --text-tertiary: #8a8d91;
                --border-color: #4d4d4d;
                --hover-bg: #4a4a4a;
                --active-bg: #5a5a5a;
                --input-bg: #3a3b3c;
                --input-border: #4d4d4d;
                --tag-bg: #3a3b3c;
                --tag-text: #e4e6eb;
                --tag-hover-bg: #5a5a5a;
                --info-bg: #263e5e;
                --info-text: #69b1ff;
            }
            .filter-panel {
                position: fixed; left: 50%; top: 50%;
                transform: translate(-50%, -50%);
                background: var(--panel-bg);
                color: var(--text-primary);
                border-radius: 16px;
                box-shadow: var(--panel-shadow);
                padding: 24px;
                z-index: 10000;
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                transition: opacity 0.3s, transform 0.3s;
                border: 1px solid var(--border-color);
            }
            .filter-panel.main-panel { width: 400px; }
            .filter-panel.sub-panel { width: 480px; max-height: 85vh; display: flex; flex-direction: column;}
            .panel-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px; border-bottom: 1px solid var(--border-color); margin-bottom: 20px; gap: 15px; }
            .panel-header h3 { margin: 0; font-size: 18px; display: flex; align-items: center; gap: 8px; }
            .panel-header .header-buttons { display: flex; align-items: center; gap: 8px; }
            .header-btn { cursor: pointer; font-size: 20px; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; transition: background .2s, color .2s; border: none; background: none; display: flex; align-items: center; justify-content: center; }
            .header-btn:hover { background: var(--hover-bg); color: var(--text-primary); }
            .switch-item { display: flex; justify-content: space-between; align-items: center; margin: 16px 0; padding: 10px; border-radius: 8px; transition: background-color 0.2s; }
            .switch-item:hover { background-color: var(--hover-bg); }
            .switch-item > div:first-child { display: flex; align-items: center; gap: 8px; }
            .switch-item span { font-size: 14px; }
            .manage-btn { color: var(--accent-blue); cursor: pointer; margin-left: 10px; padding: 6px 10px; border-radius: 6px; transition: background .2s; border: none; background: none; font-size: 13px; font-weight: 500; }
            .manage-btn:hover { background: var(--accent-blue); color: #fff; }
            .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--accent-gray); transition: .4s; border-radius: 20px; }
            .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
            .switch input:checked + .slider { background-color: var(--accent-blue); }
            .switch input:checked + .slider:before { transform: translateX(20px); }
            .continuous-block-section { background: var(--hover-bg); padding: 12px; border-radius: 8px; margin: 20px 0; }
            .status-indicator { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-left: 8px; transition: background-color 0.4s; }
            .status-indicator.status-active { background: var(--accent-green); }
            .status-indicator.status-inactive { background: var(--text-tertiary); }
            .action-buttons { display: flex; gap: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color); }
            .action-btn { flex: 1; padding: 10px 14px; border: 1px solid var(--accent-blue); background: transparent; color: var(--accent-blue); border-radius: 8px; cursor: pointer; transition: all .2s; font-size: 14px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 6px;}
            .action-btn:hover { background: var(--accent-blue); color: #fff; }
            .action-btn.primary { background: var(--accent-blue); color: #fff; }
            .action-btn.primary:hover { background: var(--accent-blue-hover); border-color: var(--accent-blue-hover); }
            .input-group { display: flex; gap: 10px; margin-bottom: 20px; }
            .input-field { flex: 1; padding: 12px; border: 1px solid var(--input-border); border-radius: 8px; font-size: 14px; background: var(--input-bg); color: var(--text-primary); }
            .input-field:focus { border-color: var(--accent-blue); outline: none; box-shadow: 0 0 0 2px rgba(0, 161, 214, 0.2); }
            .add-btn { padding: 12px 24px; background: var(--accent-blue); color: #fff; border: none; border-radius: 8px; cursor: pointer; transition: background .2s; font-weight: 500; }
            .add-btn:hover { background: var(--accent-blue-hover); }
            .item-list { overflow-y: auto; padding: 5px; margin: -5px; display: flex; flex-wrap: wrap; gap: 10px; align-content: flex-start; }
            .item-tag { display: flex; align-items: center; padding: 6px 12px; background: var(--tag-bg); color: var(--tag-text); border-radius: 16px; transition: background .2s; font-size: 13px; }
            .item-tag span { word-break: keep-all; white-space: nowrap; }
            .item-tag .delete-btn { color: var(--text-tertiary); background: none; border: none; cursor: pointer; padding: 4px; margin-left: 6px; font-size: 16px; line-height: 1; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
            .item-tag .delete-btn:hover { background: var(--active-bg); color: var(--accent-red); }
            .stats-bar { padding: 12px; border-radius: 8px; margin-bottom: 20px; background: var(--info-bg); color: var(--info-text); font-size: 14px; }
            .master-float-btn { position: fixed; background: linear-gradient(135deg, #00a1d6, #0085b3); color: #fff; padding: 12px; border-radius: 50%; z-index: 9999; cursor: grab; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: transform .2s, box-shadow .2s; user-select: none; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; font-size: 20px; -webkit-user-select: none; }
            .master-float-btn:hover { transform: scale(1.1); box-shadow: 0 6px 16px rgba(0,0,0,0.4); }
            .master-float-btn:active { cursor: grabbing; }
            .master-float-btn.dragging { opacity: .8; z-index: 10000; cursor: grabbing; transform: scale(1.05); }
        `;
        document.head.appendChild(style);
    }
    const ICONS = {
        shield: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
        close: `&times;`,
        sun: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
        moon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
        settings: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-4.44a2 2 0 0 0-2 2v.77a2 2 0 0 1-1.11 1.79l-1.33.88a2 2 0 0 0-.89 2.6l.33.6a2 2 0 0 1 0 2.12l-.33.6a2 2 0 0 0 .89 2.6l1.33.88a2 2 0 0 1 1.11 1.79V20a2 2 0 0 0 2 2h4.44a2 2 0 0 0 2-2v-.77a2 2 0 0 1 1.11-1.79l1.33-.88a2 2 0 0 0 .89-2.6l-.33-.6a2 2 0 0 1 0-2.12l.33-.6a2 2 0 0 0-.89-2.6l-1.33-.88a2 2 0 0 1-1.11-1.79V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
        list: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
        zap: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
        trash: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`
    };

    function createMainPanel() {
        const panel = document.createElement('div');
        panel.className = 'filter-panel main-panel';
        panel.style.display = 'none';
        const isDarkMode = configManager.get('darkMode');
        panel.innerHTML = `
            <div class="panel-header">
                <h3>${ICONS.shield} 智能屏蔽控制中心 v7.0.0</h3>
                <div class="header-buttons">
                    <button class="header-btn theme-toggle-btn" title="切换主题">${isDarkMode ? ICONS.sun : ICONS.moon}</button>
                    <button class="header-btn close-btn" title="关闭">${ICONS.close}</button>
                </div>
            </div>
            <div class="continuous-block-section">
                <div class="switch-item">
                    <div>${ICONS.settings}<span>自适应持续屏蔽 <span class="status-indicator ${configManager.get('continuousBlock') ? 'status-active' : 'status-inactive'}"></span></span></div>
                    <label class="switch"><input type="checkbox" id="continuous-block" ${configManager.get('continuousBlock') ? 'checked' : ''}><span class="slider"></span></label>
                </div>
                <div style="font-size:12px;color:var(--text-tertiary);margin-top:5px;padding-left:10px;">智能调节屏蔽间隔，优化性能</div>
            </div>
            <div class="switch-item"><div>${ICONS.list}<span>视频关键词屏蔽</span></div><div><label class="switch"><input type="checkbox" id="video-enabled" ${configManager.get('video.enabled') ? 'checked' : ''}><span class="slider"></span></label><button class="manage-btn" data-type="video">管理</button></div></div>
            <div class="switch-item"><div>${ICONS.list}<span>分类屏蔽</span></div><div><label class="switch"><input type="checkbox" id="category-enabled" ${configManager.get('category.enabled') ? 'checked' : ''}><span class="slider"></span></label><button class="manage-btn" data-type="category">管理</button></div></div>
            <div class="switch-item"><div>${ICONS.list}<span>广告屏蔽</span></div><label class="switch"><input type="checkbox" id="ad-enabled" ${configManager.get('ad') ? 'checked' : ''}><span class="slider"></span></label></div>
            <div class="switch-item"><div>${ICONS.list}<span>直播推荐屏蔽</span></div><label class="switch"><input type="checkbox" id="live-enabled" ${configManager.get('live') ? 'checked' : ''}><span class="slider"></span></label></div>
            <div class="action-buttons">
                <button class="action-btn primary" id="run-once">${ICONS.zap}立即执行</button>
                <button class="action-btn" id="reset-config">${ICONS.trash}重置配置</button>
            </div>
        `;
        // Event listeners
        panel.querySelector('.theme-toggle-btn').addEventListener('click', e => {
            const body = document.body;
            const currentTheme = body.dataset.theme === 'dark';
            const newTheme = !currentTheme;
            body.dataset.theme = newTheme ? 'dark' : 'light';
            configManager.setValue('darkMode', newTheme);
            e.currentTarget.innerHTML = newTheme ? ICONS.sun : ICONS.moon;
        });
        panel.querySelector('#continuous-block').addEventListener('change', e => {
            configManager.setValue('continuousBlock', e.target.checked);
            panel.querySelector('.status-indicator').className = `status-indicator ${e.target.checked ? 'status-active' : 'status-inactive'}`;
            e.target.checked ? adaptiveBlocker.start() : adaptiveBlocker.stop();
        });
        panel.querySelector('#video-enabled').addEventListener('change', e => {
            configManager.setValue('video.enabled', e.target.checked);
            runAllBlockers();
        });
        panel.querySelector('#category-enabled').addEventListener('change', e => {
            configManager.setValue('category.enabled', e.target.checked);
            runAllBlockers();
        });
        panel.querySelector('#ad-enabled').addEventListener('change', e => {
            configManager.setValue('ad', e.target.checked);
            runAllBlockers();
        });
        panel.querySelector('#live-enabled').addEventListener('change', e => {
            configManager.setValue('live', e.target.checked);
            runAllBlockers();
        });
        panel.querySelectorAll('.manage-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                showManagementPanel(btn.dataset.type);
            });
        });
        panel.querySelector('#run-once').addEventListener('click', runAllBlockers);
        panel.querySelector('#reset-config').addEventListener('click', () => {
            if (confirm('确定要重置所有配置吗？此操作不可撤销，页面将刷新。')) {
                configManager.reset();
                location.reload();
            }
        });
        panel.querySelector('.close-btn').addEventListener('click', () => panel.style.display = 'none');
        return panel;
    }

    function createSubPanel(type) {
        const isVideo = type === 'video';
        const panel = document.createElement('div');
        panel.className = 'filter-panel sub-panel';
        panel.id = `${type}-management-panel`;

        const listClass = `${type}-item-list`;
        const inputClass = `${type}-management-input`;
        const countClass = `${type}-management-count`;

        panel.innerHTML = `
            <div class="panel-header">
                <h3>${isVideo ? '📝 视频关键词管理' : '🏷️ 分类屏蔽管理'}</h3>
                <div class="header-buttons">
                    <button class="header-btn close-btn" title="关闭">${ICONS.close}</button>
                </div>
            </div>
            <div class="stats-bar">当前屏蔽${isVideo ? '关键词' : '分类'}：<span class="${countClass}">${(configManager.get(`${type}.blacklist`) || []).length}</span> 个</div>
            <div class="input-group">
                <input type="text" class="${inputClass} input-field" placeholder="输入要屏蔽的${isVideo ? '关键词（含UP主）' : '分类名称'}，回车添加">
                <button class="add-btn">添加</button>
            </div>
            <div class="item-list ${listClass}"></div>
        `;

        document.body.appendChild(panel);

        const list = panel.querySelector(`.${listClass}`);
        const countSpan = panel.querySelector(`.${countClass}`);
        const input = panel.querySelector(`.${inputClass}`);

        const updateList = () => {
            const blacklist = configManager.get(`${type}.blacklist`) || [];
            if (countSpan) countSpan.textContent = blacklist.length;
            list.innerHTML = blacklist.map(item =>
                `<div class="item-tag">
                    <span>${item}</span>
                    <button class="delete-btn" data-item="${item}" title="删除">${ICONS.close}</button>
                </div>`
            ).join('');

            list.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const itemToRemove = btn.dataset.item;
                    let currentList = configManager.get(`${type}.blacklist`) || [];
                    const newList = currentList.filter(i => i !== itemToRemove);
                    configManager.setValue(`${type}.blacklist`, newList);
                    updateList();
                    runAllBlockers();
                });
            });
        };

        const addItem = () => {
            if (!input) return;
            const item = input.value.trim();
            const currentList = configManager.get(`${type}.blacklist`) || [];
            if (item && !currentList.includes(item)) {
                const newList = [...currentList, item];
                configManager.setValue(`${type}.blacklist`, newList);
                input.value = '';
                updateList();
                runAllBlockers();
            }
            input.focus();
        };

        panel.querySelector('.add-btn')?.addEventListener('click', addItem);
        input?.addEventListener('keypress', e => {
            if (e.key === 'Enter') addItem();
        });
        panel.querySelector('.close-btn')?.addEventListener('click', () => panel.remove());
        updateList();
    }

    const showManagementPanel = type => {
        const existingPanel = document.getElementById(`${type}-management-panel`);
        if (existingPanel) {
            existingPanel.remove();
        }
        createSubPanel(type);
    };

    function createDraggableFloatBtn(mainPanelElement) {
        const btn = document.createElement('div');
        btn.className = 'master-float-btn';
        btn.title = '拖动移动位置，点击打开控制面板';
        btn.innerHTML = '🛡️';
        const pos = configManager.get('floatBtnPosition');
        btn.style.left = `${pos.x}px`;
        btn.style.bottom = `${pos.y}px`;

        let isDragging = false, hasMoved = false;
        let startX, startY, initialX, initialY;

        const handleStart = e => {
            e.preventDefault();
            isDragging = true;
            hasMoved = false;
            btn.classList.add('dragging');
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            startX = clientX;
            startY = clientY;
            const rect = btn.getBoundingClientRect();
            initialX = rect.left;
            initialY = window.innerHeight - rect.bottom;
            document.addEventListener(e.type.includes('touch') ? 'touchmove' : 'mousemove', handleMove, { passive: false });
            document.addEventListener(e.type.includes('touch') ? 'touchend' : 'mouseup', handleEnd);
        };

        const handleMove = e => {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            const deltaX = clientX - startX;
            const deltaY = startY - clientY;
            if (!hasMoved && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) hasMoved = true;

            if (hasMoved) {
                let newX = initialX + deltaX, newY = initialY + deltaY;
                newX = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, newX));
                newY = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, newY));
                btn.style.left = `${newX}px`;
                btn.style.bottom = `${newY}px`;
            }
        };

        const handleEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            btn.classList.remove('dragging');
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', handleEnd);

            if (hasMoved) {
                const rect = btn.getBoundingClientRect();
                configManager.setValue('floatBtnPosition', { x: rect.left, y: window.innerHeight - rect.bottom });
            } else {
                mainPanelElement.style.display = mainPanelElement.style.display === 'none' ? 'block' : 'none';
            }
        };

        btn.addEventListener('mousedown', handleStart);
        btn.addEventListener('touchstart', handleStart, { passive: false });

        window.addEventListener('resize', throttle(() => {
            const rect = btn.getBoundingClientRect();
            const x = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, rect.left));
            const y = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, window.innerHeight - rect.bottom));
            btn.style.left = `${x}px`;
            btn.style.bottom = `${y}px`;
        }, 100));
        return btn;
    }
    // ===== 初始化 =====
    function init() {
        injectGlobalStyles();
        if (configManager.get('darkMode')) {
            document.body.dataset.theme = 'dark';
        }

        const mainPanelElement = createMainPanel();
        const floatBtnElement = createDraggableFloatBtn(mainPanelElement);
        document.body.appendChild(mainPanelElement);
        document.body.appendChild(floatBtnElement);

        document.addEventListener('click', e => {
            const isClickInsidePanel = e.target.closest('.filter-panel');
            const isClickOnFloatBtn = floatBtnElement.contains(e.target);

            if (!isClickInsidePanel && !isClickOnFloatBtn) {
                mainPanelElement.style.display = 'none';
                const subPanels = document.querySelectorAll('.sub-panel');
                subPanels.forEach(p => p.remove());
            }
        });

        const observer = new MutationObserver(throttle(() => {
            if (!configManager.get('continuousBlock')) debouncedRunAllBlockers();
        }, 500));
        observer.observe(document.body, { childList: true, subtree: true });

        if (document.readyState === 'complete') {
            runAllBlockers();
        } else {
            window.addEventListener('load', runAllBlockers);
        }

        if (configManager.get('continuousBlock')) {
            adaptiveBlocker.start();
        }

        window.addEventListener('beforeunload', () => {
            adaptiveBlocker.stop();
            observer.disconnect();
        });
        console.log('[B站过滤插件] v7.0.0 初始化完成');
    }

    init();
})();