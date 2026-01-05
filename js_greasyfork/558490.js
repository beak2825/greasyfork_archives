// ==UserScript==
// @name         98堂助手
// @namespace    https://greasyfork.org/users/1546436-zasternight
// @version      5.2.3
// @description  98堂增强脚本 - 自动签到、快速回复、一键评分、无缝翻页、图片预览、快速购买、搜索结果筛选等
// @author       zasternight
// @match        *://*.sehuatang.net/*
// @match        *://*.sehuatang.org/*
// @match        *://*.98t.la/*
// @match        *://*.sehuatang.mb/*
// @exclude      *://*.sehuatang.net/plugin.php*
// @icon         https://www.sehuatang.net/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558490/98%E5%A0%82%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558490/98%E5%A0%82%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ==================== 配置常量 ====================
    const CONFIG = {
        VERSION: "3.3.0",
        CACHE_EXPIRE: 24 * 60 * 60 * 1000,
        DEBOUNCE_DELAY: 150,
        IMAGE_PREVIEW_COUNT: 4,
        REQUEST_TIMEOUT: 10000,
    };

    const baseURL = window.location.origin;

    const FORUM_OPTIONS = [
        { value: 2, label: "原创自拍" }, { value: 36, label: "亚洲无码" }, { value: 37, label: "亚洲有码" },
        { value: 103, label: "高清中文" }, { value: 107, label: "三级写真" }, { value: 38, label: "欧美无码" },
        { value: 39, label: "H动漫" }, { value: 115, label: "AI专区" }, { value: 104, label: "综合讨论" },
    ];

    // 搜索页面使用的完整板块选项
    const SEARCH_FORUM_OPTIONS = [
        { value: 95, label: "综合区" },
        { value: 166, label: "AI区" },
        { value: 141, label: "原创区" },
        { value: 142, label: "转帖区" },
        { value: 96, label: "投诉区" },
        { value: 97, label: "出售区" },
        { value: 143, label: "悬赏区" },
        { value: 2, label: "国产原创" },
        { value: 36, label: "亚洲无码" },
        { value: 37, label: "亚洲有码" },
        { value: 103, label: "中文字幕" },
        { value: 107, label: "三级写真" },
        { value: 160, label: "VR视频区" },
        { value: 104, label: "素人有码" },
        { value: 38, label: "欧美无码" },
        { value: 151, label: "4K原版" },
        { value: 152, label: "韩国主播" },
        { value: 39, label: "动漫原创" },
        { value: 154, label: "文学区原创人生" },
        { value: 135, label: "文学区乱伦人妻" },
        { value: 137, label: "文学区青春校园" },
        { value: 138, label: "文学区武侠玄幻" },
        { value: 136, label: "文学区激情都市" },
        { value: 139, label: "文学区TXT下载" },
        { value: 145, label: "原档自提字幕区" },
        { value: 146, label: "原档自译字幕区" },
        { value: 121, label: "原档字幕分享区" },
        { value: 159, label: "原档新作区" },
        { value: 41, label: "在线国产自拍" },
        { value: 109, label: "在线中文字幕" },
        { value: 42, label: "在线日韩无码" },
        { value: 43, label: "在线日韩有码" },
        { value: 44, label: "在线欧美风情" },
        { value: 45, label: "在线卡通动漫" },
        { value: 46, label: "在线剧情三级" },
        { value: 155, label: "图区原创自拍" },
        { value: 125, label: "图区转帖自拍" },
        { value: 50, label: "图区华人街拍" },
        { value: 48, label: "图区亚洲性爱" },
        { value: 49, label: "图区欧美性爱" },
        { value: 117, label: "图区卡通动漫" },
        { value: 165, label: "图区套图下载" },
    ];

    const REPLY_TEMPLATES = [
        "感谢分享！", "好资源，收藏了！", "楼主辛苦了！", "谢谢楼主分享！", "支持一下！",
        "很棒的内容！", "感谢楼主！", "好东西，感谢！", "收藏学习了！", "支持原创！",
        "谢谢楼主分享，辛苦了！", "感谢分享，这个资源很不错。", "楼主好人，一生平安！",
        "支持一下，感谢无私奉献。", "非常感谢，找了好久了！", "前排支持，感谢楼主分享。",
    ];

    // ==================== 工具函数 ====================
    const Utils = {
        debounce(fn, delay) { let timer; return function (...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay); }; },
        throttle(fn, limit) { let inThrottle; return function (...args) { if (!inThrottle) { fn.apply(this, args); inThrottle = true; setTimeout(() => (inThrottle = false), limit); } }; },
        extractTid(url) { const m = url.match(/tid=(\d+)|thread-(\d+)/); return m ? m[1] || m[2] : null; },
        getQueryParams(url) {
            const params = {};
            const pathPattern = /forum-(\d+)-(\d+)\.html/;
            const pathMatch = pathPattern.exec(url);
            if (pathMatch && pathMatch.length === 3) {
                params.fid = pathMatch[1];
                params.page = pathMatch[2];
            }
            try {
                new URL(url, baseURL).searchParams.forEach((v, k) => (params[k] = v));
            } catch (e) { }
            return params;
        },
        parseHTML(html) { return new DOMParser().parseFromString(html, "text/html"); },
        parseXML(xml) { return new DOMParser().parseFromString(xml, "text/xml"); },
        async copyToClipboard(text) { try { await navigator.clipboard.writeText(text); return true; } catch { const ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;left:-9999px"; document.body.appendChild(ta); ta.select(); const r = document.execCommand("copy"); ta.remove(); return r; } },
        randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
        sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); },
    };

    // ==================== 缓存管理 ====================
    const CacheManager = {
        prefix: "t98_cache_",
        get(key) {
            try {
                const d = localStorage.getItem(this.prefix + key);
                if (!d) return null;
                const data = JSON.parse(d);
                if (data?.expire > Date.now()) return data.value;
                this.remove(key);
            } catch { }
            return null;
        },
        set(key, value, expire = CONFIG.CACHE_EXPIRE) {
            try {
                localStorage.setItem(this.prefix + key, JSON.stringify({ value, expire: Date.now() + expire }));
            } catch (e) {
                this.clearExpired();
            }
        },
        remove(key) { localStorage.removeItem(this.prefix + key); },
        clear() {
            Object.keys(localStorage).filter(k => k.startsWith(this.prefix)).forEach(key => localStorage.removeItem(key));
        },
        clearExpired() {
            Object.keys(localStorage).filter(k => k.startsWith(this.prefix)).forEach(key => {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data && Date.now() > data.expire) localStorage.removeItem(key);
                } catch { localStorage.removeItem(key); }
            });
        },
    };

    // ==================== 请求管理 ====================
    const RequestManager = {
        queue: [], running: 0, maxConcurrent: 3,
        async fetch(url, options = {}) {
            return new Promise((resolve, reject) => {
                this.queue.push({ url, options, resolve, reject });
                this.processQueue();
            });
        },
        async processQueue() {
            if (this.running >= this.maxConcurrent || !this.queue.length) return;
            this.running++;
            const { url, options, resolve, reject } = this.queue.shift();
            try { const r = await fetch(url, { ...options, credentials: "same-origin" }); resolve(r); } catch (e) { reject(e); } finally { this.running--; this.processQueue(); }
        },};

    // ==================== 设置管理 ====================
    const SettingsManager = {
        cache: null,
        defaults: {
            tipsText: "98堂助手", logoText: "感谢分享", maxGradeThread: 10, showImageButton: "show",
            autoPagination: true, displayThreadImages: true, displayThreadBuyInfo: true, enableTitleStyle: true,
            titleStyleSize: 20, titleStyleWeight: 700, showAvatar: true, defaultSwipeToSearch: true,
            isShowWatermarkMessage: true, qiandaoTip: true, displayBlockedTips: true, blockingIndex: false,
            showDown: true, showCopyCode: true, showFastPost: true, showFastReply: true, showQuickGrade: true,
            showQuickStar: true, showClickDouble: true, showViewRatings: true, showPayLog: true, showFastCopy: true,
            blockedUsers: [], excludePostOptions: [], excludeOptions: ["度盘", "夸克", "内容隐藏", "搬运", "SHA1"],
            blockMedals: 0, resizeMedals: 0, replaceMedals: 0, imageSize: "50px", imageUrl: "",
            menuButtonIsVisible: true, orderFids: [], excludeGroup: [], TIDGroup: [],
            searchFilterForums: [], searchFilterKeywords: [],
            stats: { totalReplies: 0, totalGrades: 0, totalStars: 0, totalSigns: 0 },
        },
        get(forceRefresh = false) {
            if (!this.cache || forceRefresh) {
                this.cache = {};
                Object.keys(this.defaults).forEach((k) => {
                    const v = GM_getValue(k);
                    if (v !== undefined) {
                        if ((k === 'excludeGroup' || k === 'TIDGroup' || k === 'orderFids' ||
                             k === 'searchFilterForums' || k === 'searchFilterKeywords') && typeof v === 'string') {
                            try {
                                this.cache[k] = JSON.parse(v);
                            } catch {
                                this.cache[k] = this.defaults[k];
                            }
                        } else {
                            this.cache[k] = v;
                        }
                    } else {
                        this.cache[k] = this.defaults[k];
                    }
                });
            }
            return { ...this.cache };
        },
        set(key, value) { GM_setValue(key, value); if (this.cache) this.cache[key] = value; },
        save(settings) { Object.entries(settings).forEach(([k, v]) => this.set(k, v)); this.cache = settings; },
        updateStats(type) {
            const stats = this.get().stats || {};
            const key = type === 'reply' ? 'totalReplies' : type === 'grade' ? 'totalGrades' : type === 'star' ? 'totalStars' : 'totalSigns';
            stats[key] = (stats[key] || 0) + 1;
            this.set("stats", stats);
        },};

    // ==================== UI 组件 ====================
// ==================== UI 模块 ====================
const UI = {
    // 创建按钮容器
    createContainer() {
        const container = document.createElement("div");
        container.id = "t98-btn-container";
        container.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: flex-end;
        `;
        return container;
    },

    // 创建按钮
    createButton(id, text, onClick, options = {}) {
        const btn = document.createElement("button");
        btn.id = `t98-${id}`;
        btn.className = "t98-btn";
        btn.textContent = text;
        btn.style.cssText = `
            padding: 12px 20px;
            border: none;
            border-radius: 12px;
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            white-space: nowrap;
        `;

        if (options.style) {
            Object.assign(btn.style, options.style);
        }

        btn.onmouseenter = () => {
            btn.style.transform = "translateY(-2px)";
            btn.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
        };
        btn.onmouseleave = () => {
            btn.style.transform = "translateY(0)";
            btn.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
        };

        btn.onclick = onClick;
        return btn;
    },

    // 显示提示
    showTooltip(message, duration = 3000) {
        const existing = document.querySelector(".t98-tooltip");
        if (existing) existing.remove();

        const tooltip = document.createElement("div");
        tooltip.className = "t98-tooltip";
        tooltip.textContent = message;
        tooltip.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            padding: 15px 30px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 500;
            box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
            z-index: 10002;
            animation: t98-fadeIn 0.3s ease;
        `;

        document.body.appendChild(tooltip);

        setTimeout(() => {
            tooltip.style.animation = "t98-fadeOut 0.3s ease forwards";
            setTimeout(() => tooltip.remove(), 300);
        }, duration);
    },

    // 显示确认对话框
    showConfirm(message, onConfirm, onCancel) {
        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            z-index: 10003;
            display: flex;
            justify-content: center;
            align-items: center;animation: t98-fadeIn 0.2s ease;
        `;

        const modal = document.createElement("div");
        modal.style.cssText = `
            background: #fff;
            padding: 30px;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: t98-scaleIn 0.3s ease;
            max-width: 400px;
        `;

        modal.innerHTML = `
            <p style="margin: 0 0 25px; font-size: 16px; color: #333;">${message}</p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button id="t98-confirm-cancel" style="
                    padding: 12px 30px;
                    border: 2px solid #ddd;
                    background: #fff;
                    color: #666;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                ">取消</button>
                <button id="t98-confirm-ok" style="
                    padding: 12px 30px;
                    border: none;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #fff;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                ">确定</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        modal.querySelector("#t98-confirm-ok").onclick = () => {
            overlay.remove();
            if (onConfirm) onConfirm();
        };

        modal.querySelector("#t98-confirm-cancel").onclick = () => {
            overlay.remove();
            if (onCancel) onCancel();
        };

        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
                if (onCancel) onCancel();
            }
        };
    },

    // 点击特效
    showClickEffect(x, y, text) {
        const effect = document.createElement("div");
        effect.textContent = text;
        effect.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            color: #667eea;
            font-size: 16px;
            font-weight: bold;
            pointer-events: none;
            z-index: 10000;
            animation: t98-float 1s ease-out forwards;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    },
};

    // ==================== 高级搜索筛选模块 ====================
// ==================== 高级搜索筛选模块 ====================
const AdvancedSearchModule = {
    excludeKeywords: [],
    selectedForums: new Set(),
    selectedKeywords: new Set(),
    initialized: false,
    isPanelVisible: false,

    addAdvancedSearch(settings) {
        if (document.querySelector("#t98-advanced-search-panel")) return;

        this.excludeKeywords = settings.excludeOptions || [];
        this.restoreFilterState(settings);

        // 创建侧边栏面板
        const panel = this.createSidePanel();document.body.appendChild(panel);

        // 创建折叠按钮
        const toggleBtn = this.createToggleButton();document.body.appendChild(toggleBtn);

        // 添加样式
        this.addPanelStyles();

        this.initialized = true;
        this.filterSearchResults();
    },

    restoreFilterState(settings) {
        const savedForums = settings.searchFilterForums || [];
        const savedKeywords = settings.searchFilterKeywords || [];

        if (savedForums.length > 0) {
            this.selectedForums = new Set(savedForums.map(String));
        } else {
            this.selectedForums = new Set(SEARCH_FORUM_OPTIONS.map(f => String(f.value)));
        }

        if (savedKeywords.length > 0) {
            this.selectedKeywords = new Set(savedKeywords);
        } else {
            this.selectedKeywords = new Set(this.excludeKeywords);
        }
    },

    saveFilterState() {
        SettingsManager.set('searchFilterForums', Array.from(this.selectedForums));
        SettingsManager.set('searchFilterKeywords', Array.from(this.selectedKeywords));
    },

    createToggleButton() {
        const btn = document.createElement("button");
        btn.id = "t98-toggle-search-panel";
        btn.innerHTML = "🔍 筛选";
        btn.title = "搜索筛选面板";
        btn.onclick = () => this.togglePanel();
        return btn;
    },

    togglePanel() {
        const panel = document.getElementById("t98-advanced-search-panel");
        const btn = document.getElementById("t98-toggle-search-panel");

        if (!panel) return;

        this.isPanelVisible = !this.isPanelVisible;

        if (this.isPanelVisible) {
            panel.classList.add("t98-panel-visible");
            btn.innerHTML = "✕ 关闭";
            btn.classList.add("t98-btn-active");
        } else {
            panel.classList.remove("t98-panel-visible");
            btn.innerHTML = "🔍 筛选";
            btn.classList.remove("t98-btn-active");
        }
    },

    createSidePanel() {
        const panel = document.createElement("div");
        panel.className = "t98-advanced-search";
        panel.id = "t98-advanced-search-panel";

        // 面板头部
        const header = document.createElement("div");
        header.className = "t98-panel-header";
        header.innerHTML = `
            <h3>🔍 搜索筛选</h3>
            <button class="t98-panel-close" onclick="document.getElementById('t98-toggle-search-panel').click()">✕</button>
        `;

        // 统计信息（放在顶部）
        const statsSection = document.createElement("div");
        statsSection.id = "t98-filter-stats";
        statsSection.className = "t98-filter-stats";
        statsSection.innerHTML = "筛选统计加载中...";

        // 板块筛选部分
        const forumSection = document.createElement("div");
        forumSection.className = "t98-filter-section";
        forumSection.innerHTML = `
            <div class="t98-section-header">
                <h4>📁 板块筛选 <span class="t98-count">(${SEARCH_FORUM_OPTIONS.length})</span></h4>
                <div class="t98-section-actions">
                    <button id="t98-select-all-forums" class="t98-mini-btn t98-btn-primary">全选</button>
                    <button id="t98-deselect-all-forums" class="t98-mini-btn">清空</button>
                    <button id="t98-invert-forums" class="t98-mini-btn t98-btn-secondary">反选</button>
                </div>
            </div>
            <div class="t98-checkbox-group t98-scrollbar" id="t98-forum-checkboxes"></div>
        `;

        const forumCheckboxes = forumSection.querySelector("#t98-forum-checkboxes");
        SEARCH_FORUM_OPTIONS.forEach(forum => {
            const fid = String(forum.value);
            const isChecked = this.selectedForums.has(fid);
            const label = document.createElement("label");
            label.className = `t98-checkbox-label ${isChecked ? 't98-checked' : ''}`;
            label.innerHTML = `
                <input type="checkbox" class="t98-forum-checkbox" data-fid="${fid}" ${isChecked ? 'checked' : ''}>
                <span class="t98-checkmark"></span>
                <span class="t98-label-text">${forum.label}</span>
            `;
            forumCheckboxes.appendChild(label);
        });

        // 关键词筛选部分
        const keywordSection = document.createElement("div");
        keywordSection.className = "t98-filter-section";
        keywordSection.innerHTML = `
            <div class="t98-section-header">
                <h4>🚫 排除关键词 <span class="t98-count">(${this.excludeKeywords.length})</span></h4>
                <div class="t98-section-actions">
                    <button id="t98-select-all-keywords" class="t98-mini-btn t98-btn-danger">全选</button>
                    <button id="t98-deselect-all-keywords" class="t98-mini-btn">清空</button>
                </div>
            </div>
            <div class="t98-checkbox-group" id="t98-keyword-checkboxes"></div>
        `;

        const keywordCheckboxes = keywordSection.querySelector("#t98-keyword-checkboxes");
        if (this.excludeKeywords.length > 0) {
            this.excludeKeywords.forEach((keyword, index) => {
                const isChecked = this.selectedKeywords.has(keyword);
                const label = document.createElement("label");
                label.className = `t98-checkbox-label t98-keyword-label ${isChecked ? 't98-checked' : ''}`;
                label.innerHTML = `
                    <input type="checkbox" class="t98-keyword-checkbox" data-keyword="${keyword}" data-index="${index}" ${isChecked ? 'checked' : ''}>
                    <span class="t98-checkmark"></span>
                    <span class="t98-label-text">${keyword}</span>
                `;
                keywordCheckboxes.appendChild(label);
            });
        } else {
            keywordCheckboxes.innerHTML = `<p class="t98-empty-tip">暂无排除关键词<br><small>可在设置中添加</small></p>`;
        }

        // 组装面板
        panel.appendChild(header);
        panel.appendChild(statsSection);
        panel.appendChild(forumSection);
        panel.appendChild(keywordSection);

        this.bindPanelEvents(panel);
        return panel;
    },

    addPanelStyles() {
        const styleId = "t98-search-panel-styles";
        if (document.getElementById(styleId)) return;

        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            /* 折叠按钮样式 */
            #t98-toggle-search-panel {
                position: fixed;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                z-index: 9998;
                padding: 12px 16px;
                border: none;
                border-radius: 8px 0 0 8px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: -4px 0 15px rgba(102, 126, 234, 0.3);
                transition: all 0.3s ease;
                writing-mode: horizontal-tb;
            }

            #t98-toggle-search-panel:hover {
                padding-right: 20px;
                box-shadow: -6px 0 20px rgba(102, 126, 234, 0.5);
            }

            #t98-toggle-search-panel.t98-btn-active {
                background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
                right: 320px;
                border-radius: 8px 0 0 8px;
            }

            /* 侧边栏面板样式 */
            #t98-advanced-search-panel {
                position: fixed;
                right: -320px;
                top: 0;
                width: 320px;
                height: 100vh;
                background: #fff;
                z-index: 9997;
                box-shadow: -5px 0 30px rgba(0, 0, 0, 0.15);
                transition: right 0.3s ease;
                display: flex;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            #t98-advanced-search-panel.t98-panel-visible {
                right: 0;
            }

            /* 面板头部 */
            .t98-panel-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-shrink: 0;
            }

            .t98-panel-header h3 {
                margin: 0;
                font-size: 18px;font-weight: 600;
            }

            .t98-panel-close {
                background: rgba(255,255,255,0.2);
                border: none;
                color: #fff;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.2s;
            }

            .t98-panel-close:hover {
                background: rgba(255,255,255,0.3);
            }

            /* 统计信息 */
            .t98-filter-stats {
                padding: 15px 20px;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                font-size: 13px;
                color: #666;
                text-align: center;
                border-bottom: 1px solid #eee;
                flex-shrink: 0;
            }

            .t98-filter-stats span {
                margin: 0 8px;
            }

            /* 筛选区块 */
            .t98-filter-section {
                padding: 15px 20px;
                border-bottom: 1px solid #eee;
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .t98-filter-section:last-child {
                border-bottom: none;
            }

            /* 区块头部 */
            .t98-section-header {
                margin-bottom: 12px;
                flex-shrink: 0;
            }

            .t98-section-header h4 {
                margin: 0 0 10px 0;
                font-size: 14px;
                color: #333;
                font-weight: 600;
            }

            .t98-section-header .t98-count {
                font-size: 12px;
                color: #999;
                font-weight: normal;
            }

            .t98-section-actions {
                display: flex;
                gap: 6px;
                flex-wrap: wrap;
            }

            /* 迷你按钮 */
            .t98-mini-btn {
                padding: 5px 12px;
                border: 1px solid #ddd;
                background: #fff;
                color: #666;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }

            .t98-mini-btn:hover {
                background: #f5f5f5;
            }

            .t98-mini-btn.t98-btn-primary {
                border-color: #667eea;
                color: #667eea;
            }

            .t98-mini-btn.t98-btn-primary:hover {
                background: #667eea;
                color: #fff;
            }

            .t98-mini-btn.t98-btn-secondary {
                border-color: #764ba2;
                color: #764ba2;
            }

            .t98-mini-btn.t98-btn-secondary:hover {
                background: #764ba2;
                color: #fff;
            }

            .t98-mini-btn.t98-btn-danger {
                border-color: #f5576c;
                color: #f5576c;
            }

            .t98-mini-btn.t98-btn-danger:hover {
                background: #f5576c;
                color: #fff;
            }

            /* 复选框组 */
            .t98-checkbox-group {
                flex: 1;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            /* 复选框标签 */
            .t98-checkbox-label {
                display: flex;
                align-items: center;
                padding: 8px 12px;
                background: #f8f9fa;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 13px;
            }

            .t98-checkbox-label:hover {
                background: #e9ecef;
            }

            .t98-checkbox-label.t98-checked {
                background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
                border-left: 3px solid #667eea;
            }

            .t98-checkbox-label.t98-keyword-label.t98-checked {
                background: linear-gradient(135deg, #f5576c15 0%, #f093fb15 100%);
                border-left: 3px solid #f5576c;
            }

            .t98-checkbox-label input[type="checkbox"] {
                display: none;
            }

            .t98-checkmark {
                width: 18px;
                height: 18px;
                border: 2px solid #ccc;
                border-radius: 4px;
                margin-right: 10px;
                position: relative;
                transition: all 0.2s;flex-shrink: 0;
            }

            .t98-checkbox-label.t98-checked .t98-checkmark {
                background: #667eea;
                border-color: #667eea;
            }

            .t98-checkbox-label.t98-keyword-label.t98-checked .t98-checkmark {
                background: #f5576c;
                border-color: #f5576c;
            }

            .t98-checkbox-label.t98-checked .t98-checkmark::after {
                content: "✓";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #fff;
                font-size: 12px;
                font-weight: bold;
            }

            .t98-label-text {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            /* 空提示 */
            .t98-empty-tip {
                color: #999;
                font-size: 13px;
                text-align: center;
                padding: 20px;
                margin: 0;
            }

            .t98-empty-tip small {
                color: #bbb;
            }

            /* 滚动条样式 */
            .t98-checkbox-group::-webkit-scrollbar {
                width: 6px;
            }

            .t98-checkbox-group::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }

            .t98-checkbox-group::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 3px;
            }

            /* 响应式调整 */
            @media (max-width: 768px) {
                #t98-advanced-search-panel {
                    width: 280px;
                    right: -280px;
                }

                #t98-toggle-search-panel.t98-btn-active {
                    right: 280px;
                }
            }
        `;
        document.head.appendChild(style);
    },

    bindPanelEvents(panel) {
        const self = this;

        // 板块全选
        panel.querySelector("#t98-select-all-forums")?.addEventListener("click", () => {
            panel.querySelectorAll(".t98-forum-checkbox").forEach(cb => {
                cb.checked = true;
                self.selectedForums.add(cb.dataset.fid);cb.closest('.t98-checkbox-label').classList.add('t98-checked');
            });
            self.saveFilterState();
            self.filterSearchResults();
        });

        // 板块清空
        panel.querySelector("#t98-deselect-all-forums")?.addEventListener("click", () => {
            panel.querySelectorAll(".t98-forum-checkbox").forEach(cb => {
                cb.checked = false;
                self.selectedForums.delete(cb.dataset.fid);
                cb.closest('.t98-checkbox-label').classList.remove('t98-checked');
            });
            self.saveFilterState();
            self.filterSearchResults();
        });

        // 板块反选
        panel.querySelector("#t98-invert-forums")?.addEventListener("click", () => {
            panel.querySelectorAll(".t98-forum-checkbox").forEach(cb => {
                cb.checked = !cb.checked;
                const label = cb.closest('.t98-checkbox-label');
                if (cb.checked) {
                    self.selectedForums.add(cb.dataset.fid);
                    label.classList.add('t98-checked');
                } else {
                    self.selectedForums.delete(cb.dataset.fid);
                    label.classList.remove('t98-checked');
                }
            });
            self.saveFilterState();
            self.filterSearchResults();
        });

        // 关键词全选
        panel.querySelector("#t98-select-all-keywords")?.addEventListener("click", () => {
            panel.querySelectorAll(".t98-keyword-checkbox").forEach(cb => {
                cb.checked = true;
                self.selectedKeywords.add(cb.dataset.keyword);
                cb.closest('.t98-checkbox-label').classList.add('t98-checked');
            });
            self.saveFilterState();
            self.filterSearchResults();
        });

        // 关键词清空
        panel.querySelector("#t98-deselect-all-keywords")?.addEventListener("click", () => {
            panel.querySelectorAll(".t98-keyword-checkbox").forEach(cb => {
                cb.checked = false;
                self.selectedKeywords.delete(cb.dataset.keyword);
                cb.closest('.t98-checkbox-label').classList.remove('t98-checked');
            });
            self.saveFilterState();
            self.filterSearchResults();
        });

        // 板块复选框变化
        panel.querySelectorAll(".t98-forum-checkbox").forEach(cb => {
            cb.addEventListener("change", () => {
                const label = cb.closest('.t98-checkbox-label');
                if (cb.checked) {
                    self.selectedForums.add(cb.dataset.fid);
                    label.classList.add('t98-checked');
                } else {
                    self.selectedForums.delete(cb.dataset.fid);
                    label.classList.remove('t98-checked');
                }
                self.saveFilterState();
                self.filterSearchResults();
            });
        });

        // 关键词复选框变化
        panel.querySelectorAll(".t98-keyword-checkbox").forEach(cb => {
            cb.addEventListener("change", () => {
                const label = cb.closest('.t98-checkbox-label');
                if (cb.checked) {
                    self.selectedKeywords.add(cb.dataset.keyword);
                    label.classList.add('t98-checked');
                } else {
                    self.selectedKeywords.delete(cb.dataset.keyword);
                    label.classList.remove('t98-checked');
                }
                self.saveFilterState();
                self.filterSearchResults();
            });
        });
    },

    extractFidFromLink(link) {
        if (!link) return null;
        const href = link.getAttribute("href") || "";
        const forumMatch = href.match(/forum-(\d+)-/);
        const fidMatch = href.match(/fid=(\d+)/);
        return forumMatch ? forumMatch[1] : (fidMatch ? fidMatch[1] : null);
    },

    filterSearchResults() {
        if (!this.initialized) return;

        const searchItems = document.querySelectorAll(".pbw, li.pbw, .sllt li");
        let visibleCount = 0;
        let hiddenCount = 0;
        let totalCount = 0;

        searchItems.forEach(item => {
            // 跳过预览容器和页面指示器
            if (item.classList.contains('t98-preview-container')) return;
            if (item.classList.contains('t98-page-indicator')) return;
            totalCount++;

            const itemText = item.textContent || "";
            const forumLink = item.querySelector('a[href*="forum-"], a[href*="fid="]');
            let shouldShow = true;

            // 板块筛选
            if (forumLink && this.selectedForums.size > 0 && this.selectedForums.size < SEARCH_FORUM_OPTIONS.length) {
                const fid = this.extractFidFromLink(forumLink);
                if (fid) {
                    if (!this.selectedForums.has(fid)) {
                        shouldShow = false;
                    }
                }
            }

            // 关键词筛选
            if (shouldShow && this.selectedKeywords.size > 0) {
                for (const keyword of this.selectedKeywords) {
                    if (itemText.includes(keyword)) {
                        shouldShow = false;
                        break;
                    }
                }
            }

            if (shouldShow) {
                item.style.display = "";
                item.style.opacity = "1";
                visibleCount++;
            } else {
                item.style.display = "none";
                hiddenCount++;
            }
        });

        this.updateStats(visibleCount, hiddenCount, totalCount);
        console.log(`[98堂助手] 搜索筛选: 显示 ${visibleCount} 条, 隐藏 ${hiddenCount} 条, 共 ${totalCount} 条`);

        // 筛选后检查是否需要加载更多内容
        if (typeof InfiniteScrollModule !== 'undefined' && InfiniteScrollModule.checkAfterFilter) {
            InfiniteScrollModule.checkAfterFilter();
        }
    },


    updateStats(visible, hidden, total) {
        const statsEl = document.getElementById("t98-filter-stats");
        if (statsEl) {
            statsEl.innerHTML = `
                <span style="color: #28a745;">✓ 显示: <strong>${visible}</strong></span>
                <span style="color: #dc3545;">✗ 隐藏: <strong>${hidden}</strong></span>
                <span style="color: #6c757d;">共: <strong>${total}</strong></span>
            `;
        }
    },

    processNewContent() {
        if (this.initialized) {
            this.filterSearchResults();
        }
    }
};


    // ==================== 功能模块 ====================

    // 签到模块
    const SignModule = {
        async sign(userid) {
            const today = new Date().toLocaleDateString();
            const lastSign = GM_getValue(`lastSignDate_${userid}`, null);
            if (lastSign === today) return { success: true, alreadySigned: true, message: "今日已签到" };

            const signURL = `${baseURL}/plugin.php?id=dd_sign&ac=sign&infloat=yes&handlekey=pc_click_ddsign&inajax=1&ajaxtarget=fwin_content_pc_click_ddsign`;
            try {
                const params = await this.getSignParameters(signURL);
                if (!params || params.error) return { success: false, message: params?.error || "获取签到参数失败" };
                if (!params.formhash || !params.signhash) return { success: false, message: "获取签到参数失败" };

                const secanswer = await this.getValidationResult();
                const result = await this.postSignData(params, secanswer);
                return this.parseSignResult(result, userid);
            } catch (error) {
                console.error("签到失败:", error);
                return { success: false, message: "签到出现错误" };
            }
        },
        async getSignParameters(url) {
            const response = await fetch(url);
            const contentType = response.headers.get("Content-Type");
            const text = await response.text();
            if (contentType && contentType.includes("text/xml")) {
                const xml = Utils.parseXML(text);
                const content = xml.getElementsByTagName("root")[0]?.textContent;
                if (!content) return null;
                const doc = Utils.parseHTML(content);
                const alertError = doc.querySelector(".alert_error");
                if (alertError) {
                    alertError.querySelectorAll("script").forEach((s) => s.remove());
                    return { error: alertError.textContent.trim() };
                }
                return this.extractParams(content);
            }
            return this.extractParams(text);
        },
        extractParams(html) {
            const doc = Utils.parseHTML(html);
            return {
                formhash: doc.querySelector('input[name="formhash"]')?.value,
                signtoken: doc.querySelector('input[name="signtoken"]')?.value,
                signhash: doc.querySelector('form[name="login"]')?.id?.replace("signform_", "")
            };
        },
        async getValidationResult() {
            const url = `/misc.php?mod=secqaa&action=update&idhash=qSAxcb0`;
            try {
                const response = await fetch(url);
                const text = await response.text();
                const processed = text.replace("sectplcode[2] + '", "前").replace("' + sectplcode[3]", "后");
                const match = processed.match(/前([\w\W]+)后/);
                if (!match) return 0;
                return this.computeExpression(match[1].replace("= ?", ""));
            } catch {
                return 0;
            }
        },
        computeExpression(expr) {
            const [left, operator, right] = expr.split(/([+\-*/])/);
            const a = parseFloat(left.trim()), b = parseFloat(right.trim());
            switch (operator) { case "+": return a + b; case "-": return a - b; case "*": return a * b; case "/": return a / b; default: return 0; }
        },
        async postSignData(params, secanswer) {
            const { formhash, signtoken, signhash } = params;
            const url = `${baseURL}/plugin.php?id=dd_sign&ac=sign&signsubmit=yes&handlekey=pc_click_ddsign&signhash=${signhash}&inajax=1`;
            const data = new URLSearchParams({ formhash, signtoken, secanswer, secqaahash: "qSAxcb0" });
            const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: data });
            return response.text();
        },
        parseSignResult(text, userid) {
            const today = new Date().toLocaleDateString();
            if (text.includes("已经签到过") || text.includes("重复签到")) {
                GM_setValue(`lastSignDate_${userid}`, today);
                return { success: true, message: "今天已经签到过了", alreadySigned: true };
            }
            if (text.includes("签到成功")) {
                GM_setValue(`lastSignDate_${userid}`, today);
                SettingsManager.updateStats("sign");
                return { success: true, message: "签到成功，金钱+2" };
            }
            if (text.includes("请至少发表或回复一个帖子后再来签到")) {
                return { success: false, message: "请先发帖或回复后再签到" };
            }
            return { success: false, message: "签到出现未知错误" };
        },};

// 回复模块
const ReplyModule = {
    async reply(tid, customContent = null) {
        const content = customContent || Utils.randomItem(REPLY_TEMPLATES);
        const formHash = this.getFormHash();
        const fid = this.getFid();
        if (!formHash) {
            UI.showTooltip("无法获取验证信息");
            return { success: false };
        }
        if (!fid) {
            UI.showTooltip("无法获取板块信息");
            return { success: false };
        }
        const url = `forum.php?mod=post&action=reply&fid=${fid}&tid=${tid}&extra=&replysubmit=yes&infloat=yes&handlekey=fastpost&inajax=1`;
        const data = new URLSearchParams({
            formhash: formHash,
            message: content,
            posttime: Math.floor(Date.now() / 1000).toString(),
            usesig: "1"
        });
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: data,
                credentials: "same-origin"
            });
            const text = await response.text();
            return this.parseReplyResult(text, content);
        } catch (error) {
            console.error("回复失败:", error);
            UI.showTooltip("网络请求出错");
            return { success: false, reason: "network_error" };
        }
    },
    parseReplyResult(text, content) {
        if (text.includes("succeed") || text.includes("发布成功") || text.includes("回复发布")) {
            SettingsManager.updateStats("reply");
            UI.showTooltip(`回复成功！内容: "${content.substring(0, 20)}..."`);
            setTimeout(() => location.reload(), 1500);
            return { success: true };
        }
        if (text.includes("验证码")) {
            UI.showTooltip("需要验证码，请手动回复");
            return { success: false, reason: "captcha" };
        }
        if (text.includes("间隔") || text.includes("太快")) {
            UI.showTooltip("回复太频繁，请稍后再试");
            return { success: false, reason: "too_fast" };
        }
        if (text.includes("权限")) {
            UI.showTooltip("没有回复权限");
            return { success: false, reason: "no_permission" };
        }
        console.error("回复返回:", text);
        UI.showTooltip("回复失败，请查看控制台");
        return { success: false, reason: "unknown" };
    },
    getFormHash() {
        return document.querySelector('input[name="formhash"]')?.value;
    },
    getFid() {
        const el = document.querySelector("#newspecial");
        if (el) {
            const match = /fid=(\d+)/.exec(el.getAttribute("onclick"));
            if (match) return match[1];
        }
        const params = Utils.getQueryParams(window.location.href);
        if (params.fid) return params.fid;
        const fidInput = document.querySelector('input[name="fid"]');
        if (fidInput) return fidInput.value;
        const navLink = document.querySelector('#pt .z a[href*="forum-"], #pt .z a[href*="fid="]');
        if (navLink) {
            const href = navLink.getAttribute('href');
            const fidMatch = href.match(/forum-(\d+)-|fid=(\d+)/);
            if (fidMatch) return fidMatch[1] || fidMatch[2];
        }
        return null;
    },
};


// 评分功能模块
const GradeModule = {
    async getGradeInfo(pid, tid) {
        const timestamp = Date.now();
        const url = `/forum.php?mod=misc&action=rate&tid=${tid}&pid=${pid}&infloat=yes&handlekey=rate&t=${timestamp}&inajax=1&ajaxtarget=fwin_content_rate`;
        try {
            const response = await fetch(url);
            const text = await response.text();
            const xml = Utils.parseXML(text);
            const htmlContent = xml.querySelector("root")?.textContent;
            if (!htmlContent) return { success: false, error: "获取评分信息失败" };
            const doc = Utils.parseHTML(htmlContent);
            if (htmlContent.includes("alert_error")) {
                const alert = doc.querySelector(".alert_error");
                alert?.querySelectorAll("script").forEach(s => s.remove());
                return { success: false, error: alert?.textContent.trim() };
            }
            const maxEl = doc.querySelector("#scoreoption8 li");
            if (!maxEl) return { success: false, error: "评分不足" };
            const max = parseInt(maxEl.textContent.replace("+", ""), 10);
            const left = parseInt(doc.querySelector(".dt.mbm td:last-child")?.textContent, 10) || 0;
            return {
                success: true,
                max: Math.min(max, left),
                left,
                formHash: doc.querySelector('input[name="formhash"]')?.value,
                referer: doc.querySelector('input[name="referer"]')?.value,
                handleKey: doc.querySelector('input[name="handlekey"]')?.value
            };
        } catch (error) {
            console.error("获取评分信息失败:", error);
            return { success: false, error: "网络错误" };
        }
    },
    async grade(pid, score = 1) {
        const tid = Utils.extractTid(window.location.href);
        const info = await this.getGradeInfo(pid, tid);
        if (!info.success) {
            UI.showTooltip(info.error);
            return { success: false };
        }
        const settings = SettingsManager.get();
        const actualScore = Math.min(score, info.max, settings.maxGradeThread);
        const url = "/forum.php?mod=misc&action=rate&ratesubmit=yes&infloat=yes&inajax=1";
        const data = new URLSearchParams({
            formhash: info.formHash,
            tid,
            pid,
            referer: info.referer,
            handlekey: info.handleKey,
            score8: actualScore.toString(),
            reason: settings.logoText,
            sendreasonpm: "on"
        });
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: data
            });
            const result = await response.text();
            if (result.includes("感谢您的参与") || result.includes("评分前页面")) {
                SettingsManager.updateStats("grade");
                UI.showTooltip(`+${actualScore} 评分成功！`);
                return { success: true };
            }
            UI.showTooltip("评分失败");
            return { success: false };
        } catch (error) {
            console.error("评分失败:", error);
            UI.showTooltip("评分请求失败");
            return { success: false };
        }
    },
    gradeManual(tid, pid) {
        if (typeof showWindow === 'function') {
            showWindow("rate", `forum.php?mod=misc&action=rate&tid=${tid}&pid=${pid}`);
        }
    },
};
// 收藏功能模块
const StarModule = {
    async star() {
        const tid = Utils.extractTid(window.location.href);
        const formHash = document.querySelector('input[name="formhash"]')?.value;
        if (!formHash) {
            UI.showTooltip("无法获取验证信息");
            return { success: false };
        }
        const url = `/home.php?mod=spacecp&ac=favorite&type=thread&id=${tid}&formhash=${formHash}&infloat=yes&handlekey=k_favorite&inajax=1&ajaxtarget=fwin_content_k_favorite`;
        try {
            const response = await fetch(url);
            const text = await response.text();
            if (text.includes("已收藏") || text.includes("重复收藏")) {
                UI.showTooltip("已经收藏过了");
                return { success: false, reason: "duplicate" };
            }
            if (text.includes("收藏成功")) {
                SettingsManager.updateStats("star");
                UI.showTooltip("收藏成功！");
                return { success: true };
            }
            UI.showTooltip("收藏失败");
            return { success: false };
        } catch (error) {
            console.error("收藏失败:", error);
            UI.showTooltip("收藏请求失败");
            return { success: false };
        }
    },
};
    // 购买模块
    const PayModule = {
        initialized: false,

        init() {
            if (this.initialized) return;
            this.initialized = true;
            this.processLockedElements();
            this.observePopups();
        },

        processLockedElements() {
            document.querySelectorAll(".locked").forEach(el => {
                if (el.dataset.t98Processed) return;
                el.dataset.t98Processed = "true";

                const payLink = el.querySelector('a[href*="action=pay"]');
                if (!payLink) return;

                const priceMatch = el.textContent.match(/(\d+)\s*(金钱|金币|积分)/);
                const priceText = priceMatch ? `${priceMatch[1]} ${priceMatch[2]}` : '';

                const btn = document.createElement("button");
                btn.className = "t98-quick-pay-btn";
                btn.type = "button";
                btn.innerHTML = `🛒 快速购买${priceText ? ` (${priceText})` : ''}`;
                btn.style.cssText = `display: inline-block; margin: 10px 5px; padding: 10px 20px; border: none; border-radius: 8px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #fff; font-size: 14px; font-weight: bold; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);`;

                btn.onmouseenter = () => { btn.style.transform = "translateY(-2px)"; btn.style.boxShadow = "0 6px 20px rgba(240, 147, 251, 0.6)"; };
                btn.onmouseleave = () => { btn.style.transform = "translateY(0)"; btn.style.boxShadow = "0 4px 15px rgba(240, 147, 251, 0.4)"; };

                btn.onclick = async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await this.handlePurchase(payLink.href, btn);
                };

                el.insertBefore(btn, el.firstChild);
            });
        },

        observePopups() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.id && node.id.startsWith("fwin")) {
                                setTimeout(() => this.processPopup(node), 100);
                            }
                            if (node.querySelectorAll) {
                                node.querySelectorAll('[id^="fwin"]').forEach(win => {
                                    setTimeout(() => this.processPopup(win), 100);
                                });
                            }
                        }
                    });
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        },

        processPopup(popup) {
            if (popup.dataset.t98Processed) return;
            popup.dataset.t98Processed = "true";

            const content = popup.querySelector(".c") || popup;
            const html = content.innerHTML || "";

            const isPayPopup = html.includes("购买") || html.includes("售价") || html.includes("金钱") || html.includes("金币");
            if (!isPayPopup) return;

            const form = content.querySelector("form");
            if (form) {
                this.addQuickPayButtonToForm(form, popup);
            }
        },

        addQuickPayButtonToForm(form, popup) {
            if (form.querySelector(".t98-popup-pay-btn")) return;

            form.querySelectorAll('button[name="paysubmit"], input[name="paysubmit"]').forEach(btn => {
                btn.style.display = 'none';
            });

            const formContainer = form.closest('.c') || form.parentElement;
            const priceMatch = formContainer?.textContent.match(/(\d+)\s*(金钱|金币|积分)/);
            const priceText = priceMatch ? `${priceMatch[1]} ${priceMatch[2]}` : '';

            const btn = document.createElement("button");
            btn.className = "t98-popup-pay-btn";
            btn.type = "button";
            btn.innerHTML = `🛒 快速购买${priceText ? ` (${priceText})` : ''}`;
            btn.style.cssText = `display: block; width: 100%; margin: 15px 0; padding: 12px 24px; border: none; border-radius: 8px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #fff; font-size: 15px; font-weight: bold; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);`;

            btn.onmouseenter = () => { btn.style.transform = "translateY(-2px)"; btn.style.boxShadow = "0 6px 20px rgba(240, 147, 251, 0.6)"; };
            btn.onmouseleave = () => { btn.style.transform = "translateY(0)"; btn.style.boxShadow = "0 4px 15px rgba(240, 147, 251, 0.4)"; };

            btn.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await this.submitPayForm(form, btn, popup);
            };

            const submitArea = form.querySelector(".o.pns") || form.querySelector(".pns") || form;
            submitArea.appendChild(btn);
        },

        async submitPayForm(form, btn, popup) {
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = "⏳ 购买中...";

            try {
                const formData = new FormData(form);
                if (!formData.has("paysubmit")) {
                    formData.append("paysubmit", "true");
                }

                let actionUrl = form.action || form.getAttribute("action");
                if (!actionUrl) {
                    UI.showTooltip("无法获取购买地址");
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    return;
                }

                if (!actionUrl.startsWith("http")) {
                    actionUrl = `${baseURL}/${actionUrl.replace(/^\//, '')}`;
                }

                const response = await fetch(actionUrl, {
                    method: "POST",
                    body: formData,
                    credentials: "same-origin"
                });

                const text = await response.text();
                this.handlePayResponse(text, btn, originalText, popup);

            } catch (error) {
                console.error("购买失败:", error);
                UI.showTooltip("购买请求失败: " + error.message);
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        },

        async handlePurchase(url, btn, popup = null) {
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = "⏳ 获取购买信息...";

            try {
                let fullUrl = url;
                if (!fullUrl.startsWith("http")) {
                    fullUrl = `${baseURL}/${fullUrl.replace(/^\//, '')}`;
                }

                const response = await fetch(fullUrl, { credentials: "same-origin" });
                const html = await response.text();
                const doc = Utils.parseHTML(html);

                const form = doc.querySelector("form#payform, form[action*='pay']");
                if (!form) {
                    if (html.includes("已购买") || html.includes("已经购买")) {
                        UI.showTooltip("ℹ️ 已经购买过了");
                        btn.innerHTML = "✅ 已购买";
                        btn.style.background = "linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)";
                        return;
                    }
                    if (html.includes("余额不足") || html.includes("金钱不足")) {
                        UI.showTooltip("❌ 余额不足");
                        btn.disabled = false;
                        btn.innerHTML = originalText;
                        return;
                    }

                    UI.showTooltip("无法获取购买表单，请手动购买");
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    if (typeof showWindow === 'function') {
                        showWindow('pay', url);
                    }
                    return;
                }

                btn.innerHTML = "⏳ 购买中...";

                const formData = new FormData();
                form.querySelectorAll("input").forEach(input => {
                    if (input.name) {
                        formData.append(input.name, input.value || "");
                    }
                });

                if (!formData.has("paysubmit")) {
                    formData.append("paysubmit", "true");
                }

                let formAction = form.action || form.getAttribute("action") || "";

                if (!formAction || formAction === "") {
                    formAction = `forum.php?mod=misc&action=pay&paysubmit=yes&infloat=yes&inajax=1`;
                }

                if (!formAction.startsWith("http")) {
                    formAction = `${baseURL}/${formAction.replace(/^\//, '')}`;
                }

                if (!formAction.includes("paysubmit=yes")) {
                    formAction += (formAction.includes("?") ? "&" : "?") + "paysubmit=yes";
                }
                if (!formAction.includes("infloat=yes")) {
                    formAction += "&infloat=yes";
                }
                if (!formAction.includes("inajax=")) {
                    formAction += "&inajax=1";
                }

                const submitResponse = await fetch(formAction, {
                    method: "POST",
                    body: formData,
                    credentials: "same-origin"
                });

                const resultText = await submitResponse.text();
                this.handlePayResponse(resultText, btn, originalText, popup);

            } catch (error) {
                console.error("购买失败:", error);
                UI.showTooltip("购买请求失败: " + error.message);
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        },

        handlePayResponse(text, btn, originalText, popup) {
            const successKeywords = ["购买成功", "支付成功", "购买完成", "succeed", "succeedhandle", "location.reload", "购买主题成功"];
            const alreadyKeywords = ["已购买", "已经购买", "重复购买", "您已购买"];
            const failKeywords = ["余额不足", "金钱不足", "积分不足", "权限", "失败", "错误", "error"];

            const isSuccess = successKeywords.some(k => text.toLowerCase().includes(k.toLowerCase()));
            const isAlready = alreadyKeywords.some(k => text.includes(k));
            const isFail = failKeywords.some(k => text.toLowerCase().includes(k.toLowerCase()));
            const hasRedirect = text.includes("location.href") || text.includes("location.reload") || text.includes("window.location");

            if (isSuccess || hasRedirect) {
                UI.showTooltip("✅ 购买成功！");
                btn.innerHTML = "✅ 购买成功";
                btn.style.background = "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)";

                setTimeout(() => {
                    if (popup) {
                        popup.style.display = "none";
                        const overlay = document.querySelector(".fwinmask, #fwin_mask, .mask");
                        if (overlay) overlay.style.display = "none";
                    }
                    location.reload();
                }, 1500);

            } else if (isAlready) {
                UI.showTooltip("ℹ️ 已经购买过了");
                btn.innerHTML = "✅ 已购买";
                btn.style.background = "linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)";
                btn.disabled = true;
                setTimeout(() => location.reload(), 1500);

            } else if (isFail) {
                let errorMsg = "购买失败";
                const errorMatch = text.match(/(余额不足|金钱不足|积分不足|没有权限|购买失败|错误)[^<\n]*/);
                if (errorMatch) {
                    errorMsg = errorMatch[0].trim();
                }
                UI.showTooltip("❌ " + errorMsg);
                btn.disabled = false;
                btn.innerHTML = originalText;
            } else {
                if (text.includes('name="paysubmit"') || text.includes('id="payform"')) {
                    UI.showTooltip("购买未完成，请重试或手动购买");
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                } else {
                    UI.showTooltip("操作完成，正在刷新...");
                    setTimeout(() => location.reload(), 1500);
                }
            }
        }
    };

    // ==================== 图片预览模块 ====================
    const ImagePreviewModule = {
        processing: new Set(),

        async loadPreview(link) {
            const href = link.href;
            const tid = Utils.extractTid(href);
            if (!tid) return null;

            const cached = CacheManager.get(`preview_${tid}`);
            if (cached) return cached;
            if (this.processing.has(tid)) return null;
            this.processing.add(tid);

            try {
                const response = await RequestManager.fetch(href);
                const text = await response.text();
                const doc = Utils.parseHTML(text);

                const images = Array.from(doc.querySelectorAll("img.zoom"))
                    .filter((img) => {
                        const file = img.getAttribute("file");
                        return file && !file.includes("static") && !file.includes("hrline") && !file.includes("none");
                    })
                    .slice(0, CONFIG.IMAGE_PREVIEW_COUNT)
                    .map((img) => img.getAttribute("file"));

                if (images.length > 0) {
                    CacheManager.set(`preview_${tid}`, images);
                }
                return images;
            } catch (error) {
                console.warn("加载预览失败:", href, error);
                return null;
            } finally {
                this.processing.delete(tid);
            }
        },

        createPreviewElement(images) {
            const container = document.createElement("div");
            container.className = "t98-preview-container";
            container.style.cssText = `display: flex; gap: 8px; padding: 10px; overflow-x: auto; background: #fdfdfd; border-radius: 8px; margin-top: 5px; border: 1px solid #eee;`;

            images.forEach((src) => {
                const img = document.createElement("img");
                img.src = src;
                img.loading = "lazy";
                img.style.cssText = `width: 180px; height: 135px; object-fit: cover; border-radius: 6px; cursor: pointer; transition: transform 0.2s; border: 1px solid #ddd;`;
                img.onclick = (e) => { e.stopPropagation(); this.showFullImage(src); };
                img.onmouseenter = () => (img.style.transform = "scale(1.05)");
                img.onmouseleave = () => (img.style.transform = "scale(1)");
                img.onerror = () => img.remove();
                container.appendChild(img);
            });

            return container;
        },

        async processLinks(links) {
            const settings = SettingsManager.get();
            if (!settings.displayThreadImages) return;

            const pendingLinks = links.filter(link => {
                const tbody = link.closest("tbody");
                if (!tbody) return false;
                const nextEl = tbody.nextElementSibling;
                return !(nextEl && nextEl.querySelector && nextEl.querySelector(".t98-preview-container"));
            });

            pendingLinks.forEach(link => {
                this.loadPreview(link).then(images => {
                    if (images && images.length > 0) {
                        const tbody = link.closest("tbody");
                        if (!tbody) return;

                        const nextEl = tbody.nextElementSibling;
                        if (nextEl && nextEl.querySelector && nextEl.querySelector(".t98-preview-container")) return;

                        const preview = this.createPreviewElement(images);
                        const tr = document.createElement("tr");
                        const td = document.createElement("td");
                        td.colSpan = 5;
                        td.appendChild(preview);
                        tr.appendChild(td);

                        const newTbody = document.createElement("tbody");
                        newTbody.className = "t98-preview-row";
                        newTbody.appendChild(tr);

                        tbody.after(newTbody);
                    }
                }).catch(e => console.error("Preview render err", e));
            });
        },

        // 搜索页面的图片预览处理
        async processSearchLinks(settings) {
            if (!settings.displayThreadImages) return;

            const searchItems = document.querySelectorAll("h3.xs3 a, .pbw h3 a, .sllt li h3 a");

            for (let aElement of searchItems) {
                const closestLi = aElement.closest("li") || aElement.closest(".pbw");
                if (!closestLi || closestLi.querySelector(".t98-preview-container")) continue;

                // 检查是否被隐藏
                if (closestLi.style.display === 'none') continue;

                const url = aElement.href;
                const tid = Utils.extractTid(url);
                if (!tid) continue;

                try {
                    const cached = CacheManager.get(`preview_${tid}`);
                    let images = cached;

                    if (!images) {
                        const response = await fetch(url);
                        const pageContent = await response.text();
                        const doc = Utils.parseHTML(pageContent);

                        images = Array.from(doc.querySelectorAll("img.zoom"))
                            .filter((img) => {
                                const fileValue = img.getAttribute("file");
                                return fileValue && !fileValue.includes("static") && !fileValue.includes("hrline");
                            })
                            .slice(0, 3)
                            .map((img) => img.getAttribute("file"));

                        if (images.length > 0) {
                            CacheManager.set(`preview_${tid}`, images);
                        }
                    }

                    if (images && images.length > 0) {
                        const preview = this.createPreviewElement(images);
                        closestLi.appendChild(preview);
                    }
                } catch (e) {
                    console.error("Error fetching or processing:", e);
                }
            }
        },

        showFullImage(src) {
            const overlay = document.createElement("div");
            overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10001; display: flex; justify-content: center; align-items: center; cursor: zoom-out; animation: t98-fadeIn 0.2s ease;`;

            const img = document.createElement("img");
            img.src = src;
            img.style.cssText = `max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);`;

            overlay.appendChild(img);
            overlay.onclick = () => overlay.remove();
            document.body.appendChild(overlay);

            document.addEventListener("keydown", function handler(e) {
                if (e.key === "Escape") { overlay.remove(); document.removeEventListener("keydown", handler); }
            });
        },
    };

// ==================== 无缝翻页模块（优化版 - 搜索页面延迟翻页） ====================
const InfiniteScrollModule = {
    isLoading: false,
    noMoreData: false,
    observer: null,
    pageType: null,
    currentPage: 1,
    retryCount: 0,
    maxRetry: 3,
    checkInterval: null,

    // 新增：搜索页面翻页配置
    searchPageConfig: {
        initialDelay: 2500,      // 首次翻页等待 2.5 秒
        retryDelay: 1000,        // 重试间隔 1 秒
        maxRetryAttempts: 5,     // 最多重试 5 次
        currentRetryAttempt: 0   // 当前重试次数
    },

    init(pageType) {
        const settings = SettingsManager.get();
        if (!settings.autoPagination) return;

        this.pageType = pageType;
        this.currentPage = this.getCurrentPage();
        this.retryCount = 0;
        this.searchPageConfig.currentRetryAttempt = 0;
        this.setupObserver();
        this.checkInitialLoad();

        // 搜索页面额外设置定时检查
        if (pageType === "isSearchPage") {
            this.setupScrollListener();
        }
    },

    getCurrentPage() {
        const url = window.location.href;
        const pageMatch = url.match(/[&?]page=(\d+)/) || url.match(/-(\d+)\.html/);
        return pageMatch ? parseInt(pageMatch[1], 10) : 1;
    },

    setupObserver() {
        // 移除旧的 sentinel
        const oldSentinel = document.getElementById("t98-scroll-sentinel");
        if (oldSentinel) oldSentinel.remove();

        const sentinel = document.createElement("div");
        sentinel.id = "t98-scroll-sentinel";
        sentinel.style.cssText = "height: 100px; display: flex; justify-content: center; align-items: center; margin-top: 20px;";

        let container;

        if (this.pageType === "isSearchPage") {
            container = document.querySelector(".sllt") || document.querySelector("#threadlist") ||
                       document.querySelector(".bm_c") ||
                       document.querySelector("#main");
        } else {
            container = document.querySelector("#threadlisttableid") ||
                       document.querySelector("#threadlist") ||
                       document.querySelector("#postlist") ||
                       document.querySelector(".bm_c");
        }

        if (!container) {
            console.log("[98堂助手] 未找到内容容器，无缝翻页未启用");
            return;
        }

        // 将 sentinel 添加到容器的父元素末尾
        if (container.parentNode) {
            container.parentNode.appendChild(sentinel);
        } else {
            container.appendChild(sentinel);
        }

        // 使用更激进的 rootMargin
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.isLoading && !this.noMoreData) {
                        console.log("[98堂助手] Sentinel 进入视口，触发加载");
                        this.loadNextPage();
                    }
                });
            },
            {
                rootMargin: "800px",
                threshold: 0
            }
        );

        this.observer.observe(sentinel);
    },

    // 额外的滚动监听，用于搜索页面筛选后的情况
    setupScrollListener() {
        const checkAndLoad = Utils.throttle(() => {
            if (this.isLoading || this.noMoreData) return;

            const sentinel = document.getElementById("t98-scroll-sentinel");
            if (!sentinel) return;

            const rect = sentinel.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            // 如果 sentinel 距离视口底部小于 1000px，触发加载
            if (rect.top < windowHeight + 1000) {
                console.log("[98堂助手] 滚动检测触发加载");
                this.loadNextPage();
            }
        }, 300);

        window.addEventListener("scroll", checkAndLoad, { passive: true });

        // 定时检查（处理筛选后页面高度变化的情况）
        this.checkInterval = setInterval(() => {
            if (this.noMoreData) {
                clearInterval(this.checkInterval);
                return;
            }
            checkAndLoad();
        }, 1000);
    },

    // 供外部调用，筛选后检查是否需要加载更多
    checkAfterFilter() {
        if (this.isLoading || this.noMoreData) return;

        setTimeout(() => {
            const sentinel = document.getElementById("t98-scroll-sentinel");
            if (!sentinel) return;

            const rect = sentinel.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // 筛选后如果 sentinel 在视口内或接近视口，加载更多
            if (rect.top < windowHeight + 500) {
                console.log("[98堂助手] 筛选后检测到需要加载更多");
                this.loadNextPage();
            }
        }, 200);
    },

    async loadNextPage() {
        if (this.isLoading || this.noMoreData) {
            return;
        }

        const nextLink = document.querySelector(".nxt") || document.querySelector('a.nxt');
        if (!nextLink) {
            this.noMoreData = true;
            this.showEndMessage();
            return;
        }

        this.isLoading = true;
        this.retryCount = 0;
        const sentinel = document.getElementById("t98-scroll-sentinel");

        // 搜索页面特殊处理：首次加载需要等待
        if (this.pageType === "isSearchPage") {
            await this.loadSearchPageWithDelay(nextLink, sentinel);
        } else {
            await this.loadNormalPage(nextLink, sentinel);
        }
    },

    // 新增：搜索页面延迟加载逻辑
    async loadSearchPageWithDelay(nextLink, sentinel) {
        const config = this.searchPageConfig;
        config.currentRetryAttempt = 0;

        // 显示等待提示
        if (sentinel) {
            sentinel.innerHTML = `<div style="color:#667eea"><span style="display:inline-block;animation:t98-spin 1s linear infinite">⏳</span> 等待加载第 ${this.currentPage + 1} 页 (论坛限制需等待2.5秒)...</div>`;
        }

        console.log(`[98堂助手] 搜索页面翻页：等待 ${config.initialDelay}ms 后加载`);

        // 首次等待 2.5 秒
        await Utils.sleep(config.initialDelay);

        // 尝试加载
        const success = await this.attemptLoadPage(nextLink, sentinel);

        if (!success) {
            // 加载失败，启动重试机制
            await this.retryLoadWithInterval(nextLink, sentinel);
        }
    },

    // 新增：带重试的加载机制
    async retryLoadWithInterval(nextLink, sentinel) {
        const config = this.searchPageConfig;

        while (config.currentRetryAttempt < config.maxRetryAttempts) {
            config.currentRetryAttempt++;

            if (sentinel) {
                sentinel.innerHTML = `<div style="color:#ffa502"><span style="display:inline-block;animation:t98-spin 1s linear infinite">🔄</span> 重试加载中 (${config.currentRetryAttempt}/${config.maxRetryAttempts})...</div>`;
            }

            console.log(`[98堂助手] 搜索页面翻页重试：第 ${config.currentRetryAttempt} 次，等待 ${config.retryDelay}ms`);

            // 等待 1 秒
            await Utils.sleep(config.retryDelay);

            // 重新获取下一页链接（可能已更新）
            const currentNextLink = document.querySelector(".nxt") || document.querySelector('a.nxt');
            if (!currentNextLink) {
                this.noMoreData = true;
                this.showEndMessage();
                this.isLoading = false;
                return;
            }

            const success = await this.attemptLoadPage(currentNextLink, sentinel);

            if (success) {
                console.log(`[98堂助手] 搜索页面翻页：第 ${config.currentRetryAttempt} 次重试成功`);
                return;
            }
        }

        // 所有重试都失败
        console.log(`[98堂助手] 搜索页面翻页：${config.maxRetryAttempts} 次重试均失败`);
        if (sentinel) {
            sentinel.innerHTML = `<div style="color:#ff6b6b">加载失败，<a href="javascript:void(0)" style="color:#667eea;text-decoration:underline">点击重试</a></div>`;
            sentinel.querySelector("a").onclick = () => {
                config.currentRetryAttempt = 0;
                this.isLoading = false;
                this.loadNextPage();
            };
        }
        this.isLoading = false;
    },

    // 新增：尝试加载页面（返回是否成功）
    async attemptLoadPage(nextLink, sentinel) {
        try {
            const nextUrl = nextLink.getAttribute("href");
            console.log(`[98堂助手] 尝试加载: ${nextUrl}`);

            if (sentinel && !sentinel.innerHTML.includes("重试")) {
                sentinel.innerHTML = `<div style="color:#667eea"><span style="display:inline-block;animation:t98-spin 1s linear infinite">⏳</span> 加载第 ${this.currentPage + 1} 页...</div>`;
            }

            const response = await fetch(nextUrl);

            // 检查响应状态
            if (!response.ok) {
                console.log(`[98堂助手] 请求失败，状态码: ${response.status}`);
                return false;
            }

            const text = await response.text();

            // 检查是否包含错误信息（论坛限制等）
            if (text.includes("抱歉，您在") || text.includes("秒内只能") || text.includes("操作太快")) {
                console.log("[98堂助手] 检测到论坛频率限制");
                return false;
            }

            const doc = Utils.parseHTML(text);

            const newNextLink = doc.querySelector(".nxt") || doc.querySelector('a.nxt');
            if (newNextLink) {
                nextLink.setAttribute("href", newNextLink.getAttribute("href"));
                this.currentPage++;
                console.log(`[98堂助手] 成功加载第 ${this.currentPage} 页`);
            } else {
                this.noMoreData = true;
                nextLink.remove();
                console.log("[98堂助手] 已到达最后一页");
            }

            this.addPageIndicator(this.currentPage);

            const addedElements = this.appendContent(doc);
            console.log(`[98堂助手] 添加了 ${addedElements.length} 个新元素`);

            const newPg = doc.querySelector(".pg");
            if (newPg) {
                document.querySelectorAll(".pg").forEach(pg => pg.innerHTML = newPg.innerHTML);
            }

            await this.processNewContent(addedElements);

            if (sentinel) sentinel.innerHTML = "";
            this.isLoading = false;

            // 加载完成后，检查是否需要继续加载（针对筛选后内容较少的情况）
            if (this.pageType === "isSearchPage" && !this.noMoreData) {
                setTimeout(() => {
                    this.checkAfterFilter();
                }, 300);
            }

            return true;

        } catch (error) {
            console.error("[98堂助手] 加载页面出错:", error);
            return false;
        }
    },

    // 普通页面加载（非搜索页面，保持原有逻辑）
    async loadNormalPage(nextLink, sentinel) {
        if (sentinel) {
            sentinel.innerHTML = `<div style="color:#667eea"><span style="display:inline-block;animation:t98-spin 1s linear infinite">⏳</span> 加载第 ${this.currentPage + 1} 页...</div>`;
        }

        try {
            const nextUrl = nextLink.getAttribute("href");
            console.log(`[98堂助手] 加载下一页: ${nextUrl}`);

            const response = await fetch(nextUrl);
            const text = await response.text();
            const doc = Utils.parseHTML(text);

            const newNextLink = doc.querySelector(".nxt") || doc.querySelector('a.nxt');
            if (newNextLink) {
                nextLink.setAttribute("href", newNextLink.getAttribute("href"));
                this.currentPage++;
                console.log(`[98堂助手] 成功加载第 ${this.currentPage} 页`);
            } else {
                this.noMoreData = true;
                nextLink.remove();
                console.log("[98堂助手] 已到达最后一页");
            }

            this.addPageIndicator(this.currentPage);

            const addedElements = this.appendContent(doc);
            console.log(`[98堂助手] 添加了 ${addedElements.length} 个新元素`);

            const newPg = doc.querySelector(".pg");
            if (newPg) {
                document.querySelectorAll(".pg").forEach(pg => pg.innerHTML = newPg.innerHTML);
            }

            await this.processNewContent(addedElements);

            if (sentinel) sentinel.innerHTML = "";} catch (error) {
            console.error("[98堂助手] 加载下一页失败:", error);
            this.retryCount++;

            if (sentinel) {
                if (this.retryCount < this.maxRetry) {
                    sentinel.innerHTML = `<div style="color:#ffa502">加载失败，${3-this.retryCount}秒后重试...</div>`;
                    setTimeout(() => {
                        this.isLoading = false;
                        this.loadNextPage();
                    }, 3000);
                    return;
                } else {
                    sentinel.innerHTML = `<div style="color:#ff6b6b">加载失败，<a href="javascript:void(0)" style="color:#667eea">点击重试</a></div>`;
                    sentinel.querySelector("a").onclick = () => {
                        this.retryCount = 0;
                        this.isLoading = false;
                        this.loadNextPage();
                    };
                }
            }
        } finally {
            this.isLoading = false;
        }
    },

    addPageIndicator(page) {
        let container;

        if (this.pageType === "isSearchPage") {
            container = document.querySelector(".sllt") || document.querySelector("#threadlist");
        } else if (this.pageType === "isPostPage") {
            container = document.querySelector("#postlist");
        } else {
            container = document.querySelector("#threadlisttableid") || document.querySelector("#threadlist");
        }

        if (!container) return;

        const indicator = document.createElement("div");
        indicator.className = "t98-page-indicator";
        indicator.dataset.page = page;
        indicator.style.cssText = `
            text-align: center;
            padding: 15px;
            margin: 10px 0;
            background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
            border-radius: 8px;
            color: #667eea;
            font-weight: bold;
            font-size: 14px;
        `;
        indicator.innerHTML = `📄 第 ${page} 页`;

        container.appendChild(indicator);
    },

    appendContent(doc) {
        const addedElements = [];
        let currentContainer, newContainer;

        if (this.pageType === "isPostPage") {
            currentContainer = document.querySelector("#postlist");
            newContainer = doc.querySelector("#postlist");
        } else if (this.pageType === "isSearchPage") {
            currentContainer = document.querySelector(".sllt") || document.querySelector("#threadlist");
            newContainer = doc.querySelector(".sllt") || doc.querySelector("#threadlist");

            if (currentContainer && newContainer) {
                const newItems = newContainer.querySelectorAll("li, .pbw");
                const existingIds = new Set();
                currentContainer.querySelectorAll("li a[href*='thread-'], .pbw a[href*='thread-']").forEach(a => {
                    const tid = Utils.extractTid(a.href);
                    if (tid) existingIds.add(tid);
                });

                newItems.forEach(item => {
                    const link = item.querySelector("a[href*='thread-']");
                    const tid = link ? Utils.extractTid(link.href) : null;

                    if (tid && existingIds.has(tid)) return;

                    const clone = item.cloneNode(true);
                    currentContainer.appendChild(clone);
                    addedElements.push(clone);
                });

                return addedElements;
            }
        } else {
            currentContainer = document.querySelector("#threadlisttableid") || document.querySelector("#threadlist table tbody");
            newContainer = doc.querySelector("#threadlisttableid") || doc.querySelector("#threadlist table tbody");
        }

        if (!currentContainer || !newContainer) return addedElements;

        const existingIds = new Set(Array.from(currentContainer.querySelectorAll("[id]")).map(el => el.id));

        Array.from(newContainer.children).forEach(child => {
            if (child.nodeType === 3 && !child.textContent.trim()) return;
            if (child.id && existingIds.has(child.id)) return;
            if (child.classList?.contains("separatorline")) {
                const lastChild = currentContainer.lastElementChild;
                if (lastChild?.classList?.contains("separatorline")) return;
            }

            const clone = child.cloneNode(true);
            currentContainer.appendChild(clone);
            addedElements.push(clone);
        });

        return addedElements;
    },

    async processNewContent(addedElements) {
        const settings = SettingsManager.get();

        if (settings.displayThreadImages) {
            if (this.pageType === "isSearchPage") {
                // 搜索页面：处理新加载的搜索结果的图片预览
                setTimeout(() => {
                    ImagePreviewModule.processSearchLinks(settings);
                }, 100);
            } else if (this.pageType !== "isPostPage") {
                let newLinks = [];
                if (addedElements && addedElements.length > 0) {
                    addedElements.forEach(el => {
                        const links = el.querySelectorAll ? el.querySelectorAll(".s.xst") : [];
                        newLinks.push(...Array.from(links));
                    });
                }
                if (newLinks.length > 0) {
                    ImagePreviewModule.processLinks(newLinks);
                }
            }
        }

        if (settings.enableTitleStyle) this.applyTitleStyle(settings);
        BlockModule.blockByUsers(settings);
        BlockModule.blockByTitle(settings);

        if (this.pageType === "isPostPage") {
            MedalModule.process(settings);
            PageHandler.handleAvatars(settings);
            PageHandler.addQuickActionsToReplies();
        }

        // 搜索页面：应用筛选规则
        if (this.pageType === "isSearchPage") {AdvancedSearchModule.processNewContent();
        }
    },

    applyTitleStyle(settings) {
        const style = document.getElementById("t98-title-style") || document.createElement("style");
        style.id = "t98-title-style";
        style.textContent = `.s.xst { font-size: ${settings.titleStyleSize}px !important; font-weight: ${settings.titleStyleWeight} !important; }`;
        if (!style.parentNode) document.head.appendChild(style);
    },

    showEndMessage() {
        const sentinel = document.getElementById("t98-scroll-sentinel");
        if (sentinel) {
            sentinel.innerHTML = `<div style="text-align:center;padding:20px;color:#999;font-size:14px">—— 已加载全部 ${this.currentPage} 页内容 ——</div>`;
        }
        // 清除定时检查
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
    },

    checkInitialLoad() {
        setTimeout(() => {
            if (document.body.offsetHeight <= window.innerHeight) {
                const nextLink = document.querySelector(".nxt");
                if (nextLink && !this.isLoading && !this.noMoreData) {
                    console.log("[98堂助手] 初始页面高度不足，自动加载下一页");
                    this.loadNextPage();
                }
            }
        }, 500);
    },
};



    // 内容屏蔽模块
    const BlockModule = {
        blockByUsers(settings) {
            const { blockedUsers, displayBlockedTips } = settings;
            if (!blockedUsers || blockedUsers.length === 0) return;

            blockedUsers.forEach((user) => {
                const xpathResult = document.evaluate(
                    `//table//tr[1]/td[2]//cite/a[text()="${user}"]/ancestor::tbody[1]`,
                    document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null
                );

                for (let i = 0; i < xpathResult.snapshotLength; i++) {
                    const element = xpathResult.snapshotItem(i);
                    if (displayBlockedTips) {
                        element.innerHTML = `<tr><td colspan="5" style="padding:10px;color:#999;background:#f5f5f5">🚫 已屏蔽用户 "${user}" 的内容</td></tr>`;
                    } else {
                        element.style.display = "none";
                    }
                }
            });
        },

        blockByTitle(settings) {
            const { excludePostOptions, displayBlockedTips } = settings;
            if (!excludePostOptions || excludePostOptions.length === 0) return;

            excludePostOptions.forEach((keyword) => {
                const xpathResult = document.evaluate(
                    `//table/tbody/tr/th/a[2][contains(text(),'${keyword}')]/ancestor::tbody[1]`,
                    document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null
                );

                for (let i = 0; i < xpathResult.snapshotLength; i++) {
                    const element = xpathResult.snapshotItem(i);
                    if (displayBlockedTips) {
                        element.innerHTML = `<tr><td colspan="5" style="padding:10px;color:#999;background:#f5f5f5">🚫 已屏蔽关键词 "${keyword}" 的内容</td></tr>`;
                    } else {
                        element.style.display = "none";
                    }
                }
            });
        },
    };

    // 勋章管理模块
    const MedalModule = {
        targetMedals: null,

        init() {
            const excludeNumbers = [17, 29, 31, 32, 33, 34, 35, 36, 37, 38, 110, 111, 112, 113, 114, 116, 117];
            this.targetMedals = Array.from({ length: 122 }, (_, i) => i + 14)
                .filter(n => !excludeNumbers.includes(n))
                .map(n => `medal${n}`);
        },

        process(settings) {
            if (!this.targetMedals) this.init();

            document.querySelectorAll(".md_ctrl img").forEach((img) => {
                const isTarget = this.targetMedals.some((m) => img.src.includes(m));
                if (this.shouldApply(settings.blockMedals, isTarget)) img.style.display = "none";
                if (this.shouldApply(settings.resizeMedals, isTarget)) img.style.width = settings.imageSize;
                if (this.shouldApply(settings.replaceMedals, isTarget)) {
                    img.src = settings.imageUrl;
                    img.style.width = "50px";
                }
            });
        },

        shouldApply(setting, isTarget) {
            return setting === 1 || (setting === 2 && isTarget);
        },
    };

    // 划词搜索模块
    const SearchModule = {
        init() {
            document.addEventListener("mouseup", this.handleMouseUp.bind(this));
        },

        handleMouseUp(e) {
            if (e.button !== 0) return;
            if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName.toUpperCase())) return;

            const text = window.getSelection().toString().trim();
            this.removeMenu();

            if (text.length < 2) return;
            this.showMenu(e.pageX, e.pageY, text);
        },

        showMenu(x, y, text) {
            const menu = document.createElement("div");
            menu.className = "t98-search-menu";
            menu.style.cssText = `position: absolute; left: ${x}px; top: ${y + 10}px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); z-index: 10000; animation: t98-fadeIn 0.2s ease;`;
            menu.innerHTML = `🔍 搜索: ${text.substring(0, 20)}${text.length > 20 ? "..." : ""}`;
            menu.onclick = () => { this.search(text); this.removeMenu(); };
            document.body.appendChild(menu);
            setTimeout(() => {
                document.addEventListener("click", this.removeMenu, { once: true });
            }, 100);
        },

        removeMenu() {
            document.querySelector(".t98-search-menu")?.remove();
        },

        search(query) {
            const formhash = document.querySelector('input[name="formhash"]')?.value;
            if (!formhash) {
                Utils.copyToClipboard(query);
                window.open(`${baseURL}/search.php`, "_blank");
                return;
            }

            const data = `formhash=${encodeURIComponent(formhash)}&srchtxt=${encodeURIComponent(query)}&searchsubmit=yes`;

            GM_xmlhttpRequest({
                method: "POST",
                url: `${baseURL}/search.php?mod=forum`,
                data,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Origin: baseURL, Referer: baseURL },
                onload: (res) => {
                    if (res.status === 301 || res.status === 302) {
                        const loc = res.responseHeaders.split("\n").find(h => h.toLowerCase().startsWith("location:"))?.split(":").slice(1).join(":").trim();
                        if (loc) window.open(`${baseURL}/${loc}`, "_blank");
                    } else if (res.finalUrl) {
                        window.open(res.finalUrl, "_blank");
                    }
                },
                onerror: () => UI.showTooltip("搜索请求失败"),
            });
        },
    };

    // ==================== 页面处理模块 ====================
    const PageHandler = {
        getUserId() {
            return document.querySelector(".vwmy a")?.href.match(/uid=(\d+)/)?.[1];
        },

        getPostId(el) {
            return el?.closest("table")?.id.replace("pid", "");
        },

        getPageType() {
            const url = window.location.href;
            if (/forum\.php\?mod=viewthread|\/thread-\d+-\d+-\d+\.html/.test(url)) return "isPostPage";
            if (/search\.php\?mod=forum/.test(url)) return "isSearchPage";
            if (/forum\.php\?mod=forumdisplay|\/forum-\d+-\d+\.html/.test(url)) return "isForumDisplayPage";
            if (/home\.php\?mod=space.*&do=thread/.test(url)) return "isSpacePage";
            if (/home\.php\?mod=space&do=favorite/.test(url)) return "isFavoritePage";
            if (/(forum|home)\.php\?mod=(guide|space|misc)/.test(url)) return "isMySpacePage";
            return "unknown";
        },

        getCurrentFid() {
            const params = Utils.getQueryParams(window.location.href);
            if (params.fid) return params.fid;

            const fidInput = document.querySelector('input[name="fid"]');
            if (fidInput && fidInput.value) return fidInput.value;

            const newSpecial = document.querySelector("#newspecial");
            if (newSpecial) {
                const onclick = newSpecial.getAttribute("onclick") || "";
                const match = /fid=(\d+)/.exec(onclick);
                if (match) return match[1];
            }

            const navLinks = document.querySelectorAll('#pt .z a');
            for (const link of navLinks) {
                const href = link.getAttribute('href') || '';
                const forumMatch = href.match(/forum-(\d+)-/);
                if (forumMatch) return forumMatch[1];
                const fidMatch = href.match(/fid=(\d+)/);
                if (fidMatch) return fidMatch[1];
            }

            const forumLink = document.querySelector('a[href*="forum-"][href*=".html"], a[href*="fid="]');
            if (forumLink) {
                const href = forumLink.getAttribute('href');
                const match = href.match(/forum-(\d+)-|fid=(\d+)/);
                if (match) return match[1] || match[2];
            }

            return null;
        },

        async handleForumPage(settings, container) {
            if (settings.enableTitleStyle) InfiniteScrollModule.applyTitleStyle(settings);

            if (settings.displayThreadImages) {
                const links = document.querySelectorAll(".s.xst");
                ImagePreviewModule.processLinks(Array.from(links));
            }

            BlockModule.blockByUsers(settings);
            BlockModule.blockByTitle(settings);

            const userid = this.getUserId();
            if (userid) {
                if (settings.showFastPost) {
                    container.appendChild(UI.createButton("fastPostBtn", "📝 快速发帖", () => {
                        const fid = this.getCurrentFid();
                        if (fid && typeof showWindow === 'function') {
                            showWindow("newthread", `forum.php?mod=post&action=newthread&fid=${fid}`);
                        } else {
                            UI.showTooltip("无法获取板块信息");
                        }
                    }, { style: { background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" } }));
                }
                this.addTimeSortButton(settings, container);
            }

            InfiniteScrollModule.init("isForumDisplayPage");
        },

        async handlePostPage(settings, container) {
            const tid = Utils.extractTid(window.location.href);
            const firstPost = document.querySelector(".po.hin");
            const pid = this.getPostId(firstPost);
            const userid = this.getUserId();

            const toggleImages = (show) => document.querySelectorAll("img.zoom").forEach(img => img.style.display = show ? "" : "none");
            toggleImages(settings.showImageButton === "show");

            container.appendChild(UI.createButton("toggleImgBtn", settings.showImageButton === "show" ? "🖼️ 隐藏图片" : "🖼️ 显示图片", function () {
                const isShow = this.textContent.includes("显示");
                toggleImages(isShow);
                this.textContent = isShow ? "🖼️ 隐藏图片" : "🖼️ 显示图片";
                SettingsManager.set("showImageButton", isShow ? "show" : "hide");
            }, { style: { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" } }));

            if (userid) {
                container.appendChild(UI.createButton("autoReplyBtn", "🚀 一键回复", async function () {
                    this.disabled = true;
                    this.textContent = "⏳ 回复中...";
                    const result = await ReplyModule.reply(tid);
                    if (!result.success) {
                        this.disabled = false;
                        this.textContent = "🚀 一键回复";
                    }
                }, { style: { background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" } }));

                container.appendChild(UI.createButton("customReplyBtn", "✏️ 自定义回复", () => {
                    const content = prompt("请输入回复内容:");
                    if (content?.trim()) {
                        ReplyModule.reply(tid, content.trim());
                    }
                }, { style: { background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" } }));

                if (settings.showQuickGrade && pid) {
                    container.appendChild(UI.createButton("gradeBtn", "⭐ 一键评分", async function () {
                        this.disabled = true;
                        this.textContent = "⏳ 评分中...";
                        await GradeModule.grade(pid);
                        this.disabled = false;
                        this.textContent = "⭐ 一键评分";
                    }, { style: { background: "linear-gradient(135deg, #f5af19 0%, #f12711 100%)" } }));
                }

                if (settings.showQuickStar) {
                    container.appendChild(UI.createButton("starBtn", "💖 快速收藏", async function () {
                        this.disabled = true;
                        this.textContent = "⏳ 收藏中...";
                        await StarModule.star();
                        this.disabled = false;
                        this.textContent = "💖 快速收藏";
                    }, { style: { background: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)" } }));
                }

                if (settings.showClickDouble && pid) {
                    container.appendChild(UI.createButton("doubleBtn", "🎯 一键二连", async function () {
                        this.disabled = true;
                        this.textContent = "⏳ 执行中...";
                        await GradeModule.grade(pid);
                        await StarModule.star();
                        this.disabled = false;
                        this.textContent = "🎯 一键二连";
                    }, { style: { background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" } }));
                }

                if (settings.showFastPost) {
                    container.appendChild(UI.createButton("fastPostBtn", "📝 快速发帖", () => {
                        const fid = this.getCurrentFid();
                        if (fid && typeof showWindow === 'function') {
                            showWindow("newthread", `forum.php?mod=post&action=newthread&fid=${fid}`);
                        } else {
                            UI.showTooltip("无法获取板块信息");
                        }
                    }, { style: { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" } }));}

                if (settings.showFastReply) {
                    container.appendChild(UI.createButton("fastReplyBtn", "💬 快速回复", () => {
                        const fid = this.getCurrentFid();
                        if (typeof showWindow === 'function') {
                            showWindow("reply", `forum.php?mod=post&action=reply&fid=${fid}&tid=${tid}`);
                        }
                    }, { style: { background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", color: "#333" } }));
                }}

            if (settings.showDown) this.addDownloadButton(container);
            if (settings.showCopyCode) this.addCopyCodeButton(container);
            if (settings.showViewRatings && tid) this.addViewRatingsButton(container, tid, pid);
            if (settings.showPayLog && tid) this.addPayLogButton(container, tid, pid);
            if (settings.showFastCopy) this.addFastCopyButton(container);

            this.handleAvatars(settings);
            this.addQuickActionsToReplies();
            MedalModule.process(settings);

            PayModule.init();

            InfiniteScrollModule.init("isPostPage");

            if (settings.defaultSwipeToSearch) SearchModule.init();
        },

        handleSearchPage(settings, container) {
            console.log("[98堂助手] 初始化搜索页面功能...");

            if (settings.enableTitleStyle) InfiniteScrollModule.applyTitleStyle(settings);

            // 添加高级搜索筛选面板
            AdvancedSearchModule.addAdvancedSearch(settings);

            // 处理图片预览
            if (settings.displayThreadImages) {
                ImagePreviewModule.processSearchLinks(settings);
            }

            // 初始化无缝翻页
            InfiniteScrollModule.init("isSearchPage");
        },

        handleAvatars(settings) {
            if (!settings.showAvatar) {
                document.querySelectorAll(".avatar").forEach(el => el.style.display = "none");
            }
        },

        addQuickActionsToReplies() {
            const tid = Utils.extractTid(window.location.href);
            const fid = this.getCurrentFid();document.querySelectorAll(".po.hin").forEach(post => {
                if (post.querySelector(".t98-quick-actions")) return;
                const pid = this.getPostId(post);
                if (!pid) return;

                const actionsDiv = document.createElement("div");
                actionsDiv.className = "t98-quick-actions";
                actionsDiv.style.cssText = `display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap;`;

                actionsDiv.appendChild(this.createMiniButton("💬 回复", () => {
                    if (typeof showWindow === 'function') {
                        showWindow("reply", `forum.php?mod=post&action=reply&fid=${fid}&tid=${tid}&repquote=${pid}`);
                    }
                }));

                actionsDiv.appendChild(this.createMiniButton("⭐ 评分", () => GradeModule.grade(pid)));

                actionsDiv.appendChild(this.createMiniButton("🚨 举报", () => {
                    if (typeof showWindow === 'function') {
                        showWindow(`miscreport${pid}`, `misc.php?mod=report&rtype=post&rid=${pid}&tid=${tid}&fid=${fid}`);
                    }
                }));

                post.appendChild(actionsDiv);
            });
        },

        createMiniButton(text, onClick) {
            const btn = document.createElement("button");
            btn.textContent = text;
            btn.style.cssText = `padding: 5px 12px; border: none; border-radius: 6px; background: #f0f0f0; color: #333; font-size: 12px; cursor: pointer; transition: all 0.2s;`;
            btn.onmouseenter = () => btn.style.background = "#e0e0e0";
            btn.onmouseleave = () => btn.style.background = "#f0f0f0";
            btn.onclick = onClick;
            return btn;
        },

        addDownloadButton(container) {
            container.appendChild(UI.createButton("downloadBtn", "📥 下载附件", () => {
                this.showAttachments();
            }, { style: { background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" } }));
        },

        showAttachments() {
            const attachments = [];document.querySelectorAll(".attnm a, .pattl a[href*='attachment'], a[href*='aid=']").forEach(link => {
                const href = link.getAttribute("href");
                if (href && (href.includes("attachment") || href.includes("aid="))) {
                    const name = link.textContent.trim() || "附件";
                    if (!attachments.find(a => a.href === href)) {
                        attachments.push({ name, href });
                    }
                }
            });

            document.querySelectorAll(".locked").forEach(locked => {
                const payLink = locked.querySelector('a[href*="action=pay"]');
                if (payLink) {
                    const priceMatch = locked.textContent.match(/(\d+)\s*(金钱|金币|积分)/);
                    attachments.push({
                        name: `需购买内容 ${priceMatch ? `(${priceMatch[1]} ${priceMatch[2]})` : ''}`,
                        href: payLink.href,
                        needPay: true,
                        priceText: priceMatch ? `${priceMatch[1]} ${priceMatch[2]}` : ''
                    });
                }
            });

            if (attachments.length === 0) {
                UI.showTooltip("没有找到附件");
                return;
            }

            const overlay = document.createElement("div");
            overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10001; display: flex; justify-content: center; align-items: center; animation: t98-fadeIn 0.2s ease;`;

            const modal = document.createElement("div");
            modal.style.cssText = `background: #fff; width: 90%; max-width: 500px; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: t98-scaleIn 0.3s ease;`;

            let listHtml = attachments.map((att, idx) => {
                if (att.needPay) {
                    return `
                        <div class="t98-attach-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border-bottom: 1px solid #eee;">
                            <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">🔒 ${att.name}</span>
                            <button class="t98-attach-pay-btn" data-href="${att.href}" data-idx="${idx}" style="
                                padding: 8px 16px;
                                border: none;
                                border-radius: 6px;
                                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                                color: #fff;
                                font-size: 13px;
                                cursor: pointer;
                                white-space: nowrap;
                ">🛒 快速购买</button>
                        </div>
                    `;
                } else {
                    return `
                        <div class="t98-attach-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border-bottom: 1px solid #eee;">
                            <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">📎 ${att.name}</span><a href="${att.href}" target="_blank" style="
                                padding: 8px 16px;
                                border: none;
                                border-radius: 6px;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: #fff;
                                font-size: 13px;
                                text-decoration: none;
                                white-space: nowrap;
                            ">下载</a>
                        </div>
                    `;
                }
            }).join("");

            modal.innerHTML = `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 20px; text-align: center;">
                    <h3 style="margin: 0; font-size: 18px;">📦 附件列表</h3>
                </div>
                <div style="max-height: 400px; overflow-y: auto;">
                    ${listHtml}
                </div>
                <div style="padding: 15px; text-align: center; background: #f8f9fa;">
                    <button id="t98-close-attach" style="
                        padding: 12px 40px;
                        border: none;
                        border-radius: 8px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: #fff;
                        font-size: 15px;
                        cursor: pointer;
                    ">关闭</button>
                </div>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            overlay.querySelector("#t98-close-attach").onclick = () => overlay.remove();
            overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

            modal.querySelectorAll(".t98-attach-pay-btn").forEach(btn => {
                btn.onclick = async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const href = btn.dataset.href;
                    await PayModule.handlePurchase(href, btn, overlay);
                };
            });
        },

        addCopyCodeButton(container) {
            const hasCode = document.querySelector(".blockcode, pre, code, .codetxt");
            if (!hasCode) return;

            container.appendChild(UI.createButton("copyCodeBtn", "📋 复制代码", () => {
                const codes = [];
                document.querySelectorAll(".blockcode li, .blockcode, pre, code, .codetxt").forEach(el => {
                    const text = el.textContent.trim();
                    if (text && !codes.includes(text)) codes.push(text);
                });

                const content = document.querySelector("#postlist")?.textContent || "";
                const magnetMatch = content.match(/magnet:\?xt=[^\s<>"]+/gi);
                const panMatch = content.match(/https?:\/\/(pan\.baidu\.com|www\.aliyundrive\.com|cloud\.189\.cn)[^\s<>"]+/gi);

                if (magnetMatch) codes.push(...magnetMatch);
                if (panMatch) codes.push(...panMatch);

                if (codes.length === 0) {
                    UI.showTooltip("没有找到代码或链接");
                    return;
                }

                Utils.copyToClipboard(codes.join("\n\n"));
                UI.showTooltip(`已复制 ${codes.length} 段内容`);
            }, { style: { background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", color: "#333" } }));
        },

        addViewRatingsButton(container, tid, pid) {
            container.appendChild(UI.createButton("viewRatingsBtn", "📊 查看评分", () => {
                if (typeof showWindow === 'function') {
                    showWindow("viewratings", `forum.php?mod=misc&action=viewratings&tid=${tid}&pid=${pid || 0}`);
                }
            }, { style: { background: "linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%)" } }));
        },

        addPayLogButton(container, tid, pid) {
            container.appendChild(UI.createButton("payLogBtn", "💰 购买记录", () => {
                if (typeof showWindow === 'function') {
                    showWindow("pay", `forum.php?mod=misc&action=viewpayments&tid=${tid}&pid=${pid || 0}`);
                }
            }, { style: { background: "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)" } }));
        },

        addFastCopyButton(container) {
            container.appendChild(UI.createButton("fastCopyBtn", "📄 复制帖子", () => {
                const title = document.querySelector("#thread_subject")?.textContent.trim() || "";
                const contentEl = document.querySelector(".t_f");

                if (!contentEl) {
                    UI.showTooltip("未找到帖子内容");
                    return;
                }

                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = contentEl.innerHTML;
                tempDiv.querySelectorAll("script, style, .pstatus, .tip_4").forEach(el => el.remove());
                tempDiv.querySelectorAll("img").forEach(img => {
                    const src = img.getAttribute("file") || img.getAttribute("src");
                    if (src && !src.includes("static/image")) {
                        img.replaceWith(document.createTextNode(src + "\n"));
                    } else {
                        img.remove();
                    }
                });

                const text = `标题：${title}\n\n内容：${tempDiv.textContent.replace(/&nbsp;/g, " ").replace(/\n{3,}/g, "\n\n").trim()}\n\n链接：${window.location.href}`;
                Utils.copyToClipboard(text);
                UI.showTooltip("帖子内容已复制");
            }, { style: { background: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)", color: "#333" } }));
        },

addTimeSortButton(settings, container) {
    const fid = this.getCurrentFid();
    if (!fid) return;

    const params = Utils.getQueryParams(window.location.href);
    const isCurrentlyDateline = params.orderby === "dateline";

    // 获取当前板块的排序记忆
    const sortMemoryKey = `sortOrder_fid_${fid}`;
    const savedSortOrder = GM_getValue(sortMemoryKey, "default"); // "default" 或 "dateline"

    // 如果当前URL没有排序参数，但有保存的排序偏好，则自动跳转
    if (!params.orderby && savedSortOrder === "dateline") {
        window.location.href = `${baseURL}/forum.php?mod=forumdisplay&fid=${fid}&filter=author&orderby=dateline`;
        return;
    }

    const sortBtn = UI.createButton("timeSortBtn", isCurrentlyDateline ? "🔥 默认排序" : "🕐 时间排序", () => {
        if (isCurrentlyDateline) {
            // 切换到默认排序，保存偏好
            GM_setValue(sortMemoryKey, "default");
            window.location.href = `${baseURL}/forum.php?mod=forumdisplay&fid=${fid}`;
        } else {
            // 切换到时间排序，保存偏好
            GM_setValue(sortMemoryKey, "dateline");
            window.location.href = `${baseURL}/forum.php?mod=forumdisplay&fid=${fid}&filter=author&orderby=dateline`;
        }
    }, { style: { background: "linear-gradient(135deg, #a8caba 0%, #5d4157 100%)" } });

    container.appendChild(sortBtn);
},

    };

    // ==================== 设置界面模块 ====================
    const SettingsUI = {
        show() {
            const existing = document.getElementById("t98-settings-modal");
            if (existing) { existing.remove(); return; }
            const modal = this.createModal(SettingsManager.get(true));
            document.body.appendChild(modal);
        },

        createModal(settings) {
            const overlay = document.createElement("div");
            overlay.id = "t98-settings-modal";
            overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10001; display: flex; justify-content: center; align-items: center; animation: t98-fadeIn 0.2s ease;`;

            const modal = document.createElement("div");
            modal.style.cssText = `background: #fff; width: 90%; max-width: 800px; max-height: 90vh; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 80px rgba(0,0,0,0.4); animation: t98-scaleIn 0.3s ease;`;

            modal.innerHTML = `
                <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;padding:25px;text-align:center">
                    <h2 style="margin:0;font-size:24px">⚙️ 98堂助手设置</h2>
                    <p style="margin:10px 0 0;opacity:0.8;font-size:14px">v${CONFIG.VERSION} - 搜索筛选增强版</p>
                </div>
                <div style="padding:25px;max-height:60vh;overflow-y:auto" class="t98-scrollbar">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px">
                        <div>
                            <h3 style="color:#667eea;margin:0 0 15px;font-size:16px">📝 基础设置</h3>
                            <div class="t98-form-group"><label>提示文字</label><input type="text" id="t98-tipsText" value="${settings.tipsText}"></div>
                            <div class="t98-form-group"><label>评分/特效文字</label><input type="text" id="t98-logoText" value="${settings.logoText}"></div>
                            <div class="t98-form-group"><label>评分最大值</label><input type="number" id="t98-maxGrade" value="${settings.maxGradeThread}" min="1" max="100"></div>
                            <div class="t98-form-group"><label>标题字号</label><input type="number" id="t98-titleSize" value="${settings.titleStyleSize}" min="12" max="30"></div>
                            <h3 style="color:#667eea;margin:20px 0 15px;font-size:16px">🎖️ 勋章设置</h3>
                            <div class="t98-form-group"><label>隐藏勋章</label><select id="t98-blockMedals"><option value="0" ${settings.blockMedals===0?"selected":""}>不隐藏</option><option value="1" ${settings.blockMedals===1?"selected":""}>隐藏所有</option><option value="2" ${settings.blockMedals===2?"selected":""}>仅隐藏女优勋章</option></select></div>
                            <div class="t98-form-group"><label>调整勋章大小</label><select id="t98-resizeMedals"><option value="0" ${settings.resizeMedals===0?"selected":""}>不调整</option><option value="1" ${settings.resizeMedals===1?"selected":""}>调整所有</option><option value="2" ${settings.resizeMedals===2?"selected":""}>仅调整女优勋章</option></select></div></div>
                        <div>
                            <h3 style="color:#667eea;margin:0 0 15px;font-size:16px">🔧 功能开关</h3>
                            <div class="t98-checkbox-grid">
                                ${["autoPagination","displayThreadImages","displayThreadBuyInfo","enableTitleStyle","showAvatar","defaultSwipeToSearch","isShowWatermarkMessage","qiandaoTip","displayBlockedTips","blockingIndex"].map(k => this.createCheckbox(k, {autoPagination:"自动翻页",displayThreadImages:"图片预览",displayThreadBuyInfo:"显示购买次数",enableTitleStyle:"标题样式",showAvatar:"显示头像",defaultSwipeToSearch:"划词搜索",isShowWatermarkMessage:"点击特效",qiandaoTip:"签到提示",displayBlockedTips:"屏蔽提示",blockingIndex:"屏蔽首页热门"}[k], settings[k])).join("")}
                            </div>
                <h3 style="color:#667eea;margin:20px 0 15px;font-size:16px">🎯 按钮显示</h3>
                            <div class="t98-checkbox-grid">
                                ${["showDown","showCopyCode","showFastPost","showFastReply","showQuickGrade","showQuickStar","showClickDouble","showViewRatings","showPayLog","showFastCopy"].map(k => this.createCheckbox(k, {showDown:"下载附件",showCopyCode:"复制代码",showFastPost:"快速发帖",showFastReply:"快速回复",showQuickGrade:"一键评分",showQuickStar:"快速收藏",showClickDouble:"一键二连",showViewRatings:"查看评分",showPayLog:"购买记录",showFastCopy:"复制帖子"}[k], settings[k])).join("")}
                            </div>
                        </div>
                    </div>
                    <div style="margin-top:25px">
                        <h3 style="color:#667eea;margin:0 0 15px;font-size:16px">🚫 黑名单设置</h3>
                        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px">
                            <div class="t98-form-group"><label>屏蔽用户 (每行一个)</label><textarea id="t98-blockedUsers" rows="5">${settings.blockedUsers.join("\n")}</textarea></div>
                            <div class="t98-form-group"><label>屏蔽关键词 (每行一个)</label><textarea id="t98-excludePostOptions" rows="5">${settings.excludePostOptions.join("\n")}</textarea></div>
                            <div class="t98-form-group"><label>搜索排除关键词 (每行一个)</label><textarea id="t98-excludeOptions" rows="5">${settings.excludeOptions.join("\n")}</textarea></div>
                        </div>
                    </div>
                    <div style="margin-top:25px;padding:20px;background:#f8f9fa;border-radius:12px">
                        <h3 style="color:#667eea;margin:0 0 15px;font-size:16px">📊 使用统计</h3>
                        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:15px;text-align:center">
                            ${Object.entries({totalReplies:["回复数","#667eea"],totalGrades:["评分数","#f5af19"],totalStars:["收藏数","#ee0979"],totalSigns:["签到数","#11998e"]}).map(([k,[l,c]]) => `<div style="background:#fff;padding:15px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)"><div style="font-size:24px;font-weight:bold;color:${c}">${settings.stats?.[k]||0}</div><div style="font-size:12px;color:#999;margin-top:5px">总${l}</div></div>`).join("")}
                        </div>
                    </div>
                </div>
                <div style="padding:20px 25px;background:#f8f9fa;display:flex;justify-content:space-between;align-items:center">
                    <div>
                        <button id="t98-reset-btn" style="padding:10px 20px;border:2px solid #ff6b6b;background:#fff;color:#ff6b6b;border-radius:8px;cursor:pointer;font-size:14px;">重置设置</button>
                        <button id="t98-clear-cache-btn" style="padding:10px 20px;border:2px solid #ffa502;background:#fff;color:#ffa502;border-radius:8px;cursor:pointer;font-size:14px;margin-left:10px;">清除缓存</button>
                    </div>
                    <div>
                        <button id="t98-cancel-btn" style="padding:10px 25px;border:2px solid #ddd;background:#fff;color:#666;border-radius:8px;cursor:pointer;font-size:14px;margin-right:10px;">取消</button>
                        <button id="t98-save-btn" style="padding:10px 25px;border:none;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">保存设置</button>
                    </div>
                `;

            overlay.appendChild(modal);

            const style = document.createElement("style");
            style.textContent = `
                .t98-form-group { margin-bottom: 15px; }
                .t98-form-group label { display: block; margin-bottom: 6px; font-size: 13px; color: #666; font-weight: 500; }
                .t98-form-group input, .t98-form-group select, .t98-form-group textarea { width: 100%; padding: 10px 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; transition: border-color 0.2s; box-sizing: border-box; }
                .t98-form-group input:focus, .t98-form-group select:focus, .t98-form-group textarea:focus { outline: none; border-color: #667eea; }
                .t98-checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .t98-checkbox-item { display: flex; align-items: center; padding: 8px 12px; background: #f8f9fa; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
                .t98-checkbox-item:hover { background: #e9ecef; }
                .t98-checkbox-item input { margin-right: 10px; width: 18px; height: 18px; cursor: pointer; }
                .t98-checkbox-item span { font-size: 13px; color: #333; }
            `;
            modal.appendChild(style);

            this.bindEvents(overlay, settings);
            return overlay;
        },

        createCheckbox(id, label, checked) {
            return `<label class="t98-checkbox-item"><input type="checkbox" id="t98-${id}" ${checked ? "checked" : ""}><span>${label}</span></label>`;
        },

        bindEvents(overlay, settings) {
            overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });

            overlay.querySelector("#t98-cancel-btn").onclick = () => overlay.remove();

            overlay.querySelector("#t98-save-btn").onclick = () => {
                const newSettings = SettingsManager.get();
                newSettings.tipsText = overlay.querySelector("#t98-tipsText").value;
                newSettings.logoText = overlay.querySelector("#t98-logoText").value;
                newSettings.maxGradeThread = parseInt(overlay.querySelector("#t98-maxGrade").value) || 10;
                newSettings.titleStyleSize = parseInt(overlay.querySelector("#t98-titleSize").value) || 20;
                newSettings.blockMedals = parseInt(overlay.querySelector("#t98-blockMedals").value);
                newSettings.resizeMedals = parseInt(overlay.querySelector("#t98-resizeMedals").value);

                Array.from(overlay.querySelectorAll('input[type="checkbox"]')).forEach(cb => {
                    if (cb.id.startsWith("t98-")) {
                        newSettings[cb.id.replace("t98-", "")] = cb.checked;
                    }
                });

                newSettings.blockedUsers = overlay.querySelector("#t98-blockedUsers").value.split("\n").map(s => s.trim()).filter(Boolean);
                newSettings.excludePostOptions = overlay.querySelector("#t98-excludePostOptions").value.split("\n").map(s => s.trim()).filter(Boolean);
                newSettings.excludeOptions = overlay.querySelector("#t98-excludeOptions").value.split("\n").map(s => s.trim()).filter(Boolean);

                SettingsManager.save(newSettings);
                overlay.remove();
                UI.showTooltip("设置已保存，部分设置需刷新页面生效");
            };

            overlay.querySelector("#t98-reset-btn").onclick = () => {
                UI.showConfirm("确定要重置所有设置吗？", () => {
                    Object.keys(SettingsManager.defaults).forEach(k => GM_setValue(k, SettingsManager.defaults[k]));SettingsManager.cache = null;
                    overlay.remove();
                    location.reload();
                });
            };

            overlay.querySelector("#t98-clear-cache-btn").onclick = () => {
                CacheManager.clear();
                UI.showTooltip("缓存已清除");
            };
        },
    };

    // ==================== 全局样式 ====================
    function addGlobalStyles() {
        GM_addStyle(`
            @keyframes t98-fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes t98-fadeOut { from { opacity: 1; } to { opacity: 0; } }
            @keyframes t98-scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            @keyframes t98-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes t98-float { 0% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-100px) scale(0.5); } }

            .t98-btn { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; outline: none; border: none; user-select: none; }
            .t98-btn:active { transform: scale(0.95) !important; }.t98-scrollbar::-webkit-scrollbar { width: 8px; }
            .t98-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
            .t98-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 4px; }

            .t98-tooltip { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }

            .t98-preview-container img { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

            .t98-quick-actions button:active { transform: scale(0.95); }

            /* 搜索筛选面板样式 */
            .t98-search-filter-panel {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .t98-search-filter-panel input[type="checkbox"] {
                width: 16px;
                height: 16px;
                cursor: pointer;
            }

            .t98-search-filter-panel label {
                cursor: pointer;
                transition: color 0.2s;
            }

            .t98-search-filter-panel label:hover {
                color: #667eea;
            }

            /* 页面指示器样式 */
            .t98-page-indicator {
                animation: t98-fadeIn 0.3s ease;
            }

            /* 快速购买按钮样式 */
            .t98-quick-pay-btn:active,
            .t98-popup-pay-btn:active {
                transform: scale(0.95) !important;
            }

            /* 附件弹窗样式 */
            .t98-attach-item:last-child {
                border-bottom: none !important;
            }

            .t98-attach-item:hover {
                background: #f8f9fa;
            }
        `);
    }

    // ==================== 主入口 ====================
    async function main() {
        console.log(`[98堂助手] v${CONFIG.VERSION} 启动中...`);

        addGlobalStyles();

        const settings = SettingsManager.get();
        const pageType = PageHandler.getPageType();
        const userid = PageHandler.getUserId();

        console.log(`[98堂助手] 页面类型: ${pageType}, 用户ID: ${userid || '未登录'}`);

        // 创建功能按钮容器
        const container = UI.createContainer();

        // 添加设置按钮
        container.appendChild(UI.createButton("settingsBtn", "⚙️", () => SettingsUI.show(), {
            style: {
                width: "45px",
                height: "45px",
                padding: "0",
                fontSize: "20px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            }
        }));

        // 自动签到
        if (userid && settings.qiandaoTip) {
            const signResult = await SignModule.sign(userid);
            if (signResult.success && !signResult.alreadySigned) {
                UI.showTooltip(signResult.message);
            }
        }

        // 根据页面类型处理
        switch (pageType) {
            case "isPostPage":
                await PageHandler.handlePostPage(settings, container);
                break;
            case "isForumDisplayPage":
                await PageHandler.handleForumPage(settings, container);
                break;
            case "isSearchPage":
                PageHandler.handleSearchPage(settings, container);
                break;
            case "isSpacePage":
            case "isFavoritePage":
            case "isMySpacePage":
                if (settings.displayThreadImages) {
                    const links = document.querySelectorAll(".s.xst, .xst");
                    ImagePreviewModule.processLinks(Array.from(links));
                }
                break;
            default:
                // 首页等其他页面
                if (settings.blockingIndex) {
                    document.querySelectorAll(".module.cl.xl").forEach(el => el.remove());
                }
                break;
        }

        // 添加容器到页面
        document.body.appendChild(container);

        // 监听DOM变化，处理动态加载的内容
        const observer = new MutationObserver(Utils.debounce(() => {
            if (pageType === "isPostPage") {
                PayModule.processLockedElements();
            }
        }, 500));

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log(`[98堂助手] v${CONFIG.VERSION} 初始化完成`);
    }

    // 等待DOM加载完成后执行
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", main);
    } else {
        main();
    }
})();
