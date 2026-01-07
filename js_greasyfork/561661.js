// ==UserScript==
// @name               LANraragi 推荐栏
// @namespace     https://github.com/Kelcoin
// @version            1.2
// @description     基于标签为 LANraragi 阅读器下方推荐区：猜你喜欢 & 同作者
// @author             Kelcoin
// @match              *://*/reader?id=*
// @grant               none
// @icon                 https://github.com/Difegue/LANraragi/raw/dev/public/favicon.ico
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/561661/LANraragi%20%E6%8E%A8%E8%8D%90%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/561661/LANraragi%20%E6%8E%A8%E8%8D%90%E6%A0%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==========================================
    // 配置
    // ==========================================
    const CONFIG = {
        // 每个视图最多显示多少个归档
        perViewLimit: 13,

        // 总共最多显示多少个归档（猜你喜欢 + 同作者）
        totalLimit: 26,

        // 是否在加载完成后自动展开
        autoExpand: false,

        // 用于“猜你喜欢”中随机选取标签的命名空间
        likeNamespaces: ['female', 'male', 'others'],

        // 如果 likeNamespaces 里一个都没有，就退而求其次
        likeFallbackNamespaces: ['character', 'parody'],

        // 高权重标签：命中这些标签会获得更高的权重分数 (原 HIGH_WEIGHT_TAGS)
        highWeightTags: [
            'female:netorare', 'female:mind control', 'female:corruption',
            'female:tomboy', 'female:big breast', 'female:swimsuit',
            'female:pantyhose', 'female:stockings', 'female:lolicon',
            'female:harem', 'female:futanari', 'female:anal',
            'female:public use', 'female:bbw', 'female:yuri',
            'female:anal intercourse', 'female:paizuri', 'female:dark skin',
            'female:huge breasts', 'female:dickgirl on female', 'female:hairy',
            'male:netorare', 'male:tomgirl', 'male:harem',
            'male:shotacon', 'male:gender change', 'male:virginity',
            'mixed:incest', 'mixed:group'
        ],

        // 推荐缓存时间（毫秒），默认 24 小时
        cacheExpiry: 24 * 60 * 60 * 1000,

        // Search API 基础路径（相对当前站点）
        apiBase: '/api/search',

        // 是否在加载时打印 debug 信息
        debug: false
    };

    // ==========================================
    // 样式：阅读器下方的卡片区域
    // ==========================================
    const style = document.createElement('style');
        style.textContent = `
        #lrr-rec-app-wrapper {
            width: 100%;
            margin: 24px 0 0 0;
            box-sizing: border-box;
        }

        #lrr-rec-app {
            width: 100%;
            display: flex;
            justify-content: center;
            box-sizing: border-box;
        }

        #lrr-rec-container {
            width: 100%;
            max-width: 1400px;
            box-sizing: border-box;
            background: #1C1E24;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(140, 160, 190, 0.2);
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
            will-change: max-height;
            max-height: 340px;
            opacity: 1;
            transform: translateY(0);
        }

        #lrr-rec-container.collapsed {
            max-height: 46px;
            transition: max-height 0.35s cubic-bezier(0, 1, 0.5, 1), opacity 0.3s ease;
        }


        .lrr-rec-header {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px;
            height: 44px;
            min-height: 44px;
            flex: 0 0 44px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            background: #1C1E24;
            font-size: 14px;
            color: #e3e9f3;
            user-select: none;
            pointer-events: none;
        }

        #lrr-rec-container.collapsed .lrr-rec-header {
            border-bottom: 1px solid transparent;
        }

        .lrr-rec-tabs {
            display: flex;
            gap: 10px;
            align-items: center;
            height: 100%;
            pointer-events: auto;
        }

        #lrr-rec-status-msg {
            position: absolute;
            right: 48px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
            color: #ffd54f;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
            white-space: nowrap;
        }
        #lrr-rec-status-msg.visible {
            opacity: 1;
        }

        .lrr-rec-tab-btn {
            background: transparent;
            border: 1px solid;
            color: var(--text-secondary, #a7b1c2);
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .lrr-rec-tab-btn:hover {
            background: #4a9ff0;
            color: #fff;
            border-color: rgba(206, 224, 255, 0.55) !important;
            transform: translateY(-1px);
        }

        .lrr-rec-tab-btn.active {
            background: #4a9ff0;
            color: #f7fbff !important;
            border-color: rgba(206, 224, 255, 0.55) !important;
            font-weight: 600 !important;
        }

        .lrr-rec-toggle {
            pointer-events: auto;
            cursor: pointer;
            color: #fff;
            opacity: 0.8;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            transition: all 0.2s;
        }

        .lrr-rec-toggle:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.1);
        }

        .lrr-rec-arrow-icon {
            display: none;
        }

        /* 箭头图标 */
        .lrr-rec-toggle::after {
            content: '';
            display: block;
            width: 0;
            height: 0;
            border-style: solid;
            transition: transform 0.3s ease;
            border-width: 6px 5px 0 5px;
            border-color: #e3e9f3 transparent transparent transparent;
            transform: rotate(0deg);
        }

        #lrr-rec-container.collapsed .lrr-rec-toggle::after {
            transform: rotate(180deg);
        }

        .lrr-rec-scroll-view {
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            overflow-y: hidden;
            gap: 10px;
            padding: 12px 16px 14px;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
        }
        .lrr-rec-scroll-view::-webkit-scrollbar { display: none; }

        .lrr-rec-card {
            flex: 0 0 140px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            text-decoration: none;
            position: relative;
            transition: transform 0.2s;
            color: inherit;
        }
        .lrr-rec-card:hover { transform: translateY(-3px); }

        .lrr-rec-thumb {
            width: 140px;
            height: 200px;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            background: #222;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .lrr-rec-thumb-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.3s;
        }
        .lrr-rec-card:hover .lrr-rec-thumb-img { transform: scale(1.05); }

        .lrr-rec-title {
            font-size: 12px;
            color: #e3e9f3;
            line-height: 1.3;
            max-height: 32px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        .lrr-rec-tags {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: auto;
            max-height: 100%;
            padding: 24px 4px 4px 4px;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 60%, rgba(0, 0, 0, 0.0) 100%);
            display: flex;
            flex-direction: column-reverse;
            gap: 3px;
            box-sizing: border-box;
            pointer-events: none;
        }

        .lrr-rec-row {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            gap: 3px;
            width: 100%;
            min-width: 0;
        }

        .lrr-rec-row:empty {
            display: none;
        }

        .lrr-rec-tag {
            display: inline-flex;
            align-items: center;
            font-size: 9px;
            padding: 1px 4px;
            border-radius: 3px;
            color: #fff;
            background: rgba(255, 255, 255, 0.18);
            backdrop-filter: blur(4px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 0 1 auto;
            min-width: 0;
            max-width: 100%;
        }

        .lrr-rec-tag.lrr-rec-tag-match {
            box-shadow: 0 0 4px rgba(255, 255, 255, 0.35);
            background: rgba(255, 255, 255, 0.25);
        }

        .lrr-rec-view-hidden {
            display: none !important;
        }
        .lrr-rec-loading {
            padding: 24px 12px;
            color: #aaa;
            font-style: italic;
            font-size: 13px;
        }
        `;
    document.head.appendChild(style);

    // ==========================================
    // 工具函数
    // ==========================================

    function logDebug(...args) {
        if (CONFIG.debug) {
            console.log('[LRR Rec]', ...args);
        }
    }

    // --- 高权重标签表 ---
    // 在相似度判定时，命中这些标签会获得更高的权重分数
    // 你可以在这里添加你认为更能决定相似度的标签（如特定角色、特定play等）
    const HIGH_WEIGHT_TAGS = new Set([
        'female:netorare', 'female:mind control', 'female:corruption',
        'female:tomboy', 'female:big breast', 'female:swimsuit',
        'female:pantyhose', 'female:stockings', 'female:lolicon',
        'female:harem', 'female:futanari', 'female:anal',
        'female:public use', 'female:bbw', 'female:yuri',
        'female:anal intercourse', 'female:paizuri', 'female:dark skin',
        'female:huge breasts', 'female:dickgirl on female', 'female:hairy',
        'male:netorare', 'male:tomgirl', 'male:harem',
        'male:shotacon', 'male:gender change', 'male:virginity',
        'mixed:incest', 'mixed:group'
    ]);

    // 从 DOM 获取当前归档标签 + 显示文本
    function getCurrentArchiveTags() {
        const tagElements = document.querySelectorAll('#tagContainer .gt a');

        const tags = new Set();
        const tagsLower = new Set();
        const artistTags = new Set();
        const artistTagsLower = new Set();
        const categoryTags = new Set();
        const categoryTagsLower = new Set();
        const displayTextMap = new Map();

        // --- 黑名单标签列表 ---
        const blacklistedTags = [
            'other:extraneous ads',
            // 你可以在这里添加更多想屏蔽的具体标签
        ];

        tagElements.forEach(el => {
            let rawTag = el.getAttribute('search') || '';
            if (!rawTag && el.href && el.href.includes('q=')) {
                try {
                    rawTag = decodeURIComponent(el.href.split('q=')[1]);
                } catch (e) { /* ignore */ }
            }
            rawTag = rawTag.replace(/"/g, '').trim();

            if (!rawTag) return;

            const lowerKey = rawTag.toLowerCase();

            // --- 修改：检查是否在黑名单中 ---
            if (blacklistedTags.includes(lowerKey)) {
                return; // 如果在黑名单中，直接跳过，不添加到集合中
            }

            tags.add(rawTag);
            tagsLower.add(lowerKey);

            const prefix = rawTag.split(':')[0].toLowerCase();
            if (prefix === 'artist' || prefix === 'group') {
                artistTags.add(rawTag);
                artistTagsLower.add(lowerKey);
            }
            if (prefix === 'category') {
                categoryTags.add(rawTag);
                categoryTagsLower.add(lowerKey);
            }

            const displayText = (el.textContent || '').trim() || rawTag.split(':')[1] || rawTag;
            displayTextMap.set(lowerKey, displayText);
        });

        return {
            all: tags,
            allLower: tagsLower,
            artists: artistTags,
            artistsLower: artistTagsLower,
            categories: categoryTags,
            categoriesLower: categoryTagsLower,
            displayTextMap
        };
    }

    // 基于 Search API 搜索归档
    async function searchArchives(filter) {
        const params = new URLSearchParams();
        params.set('category', '');
        if (filter) params.set('filter', filter);
        params.set('start', '-1');
        params.set('sortby', 'title');
        params.set('order', 'asc');

        const url = `${CONFIG.apiBase}?${params.toString()}`;
        logDebug('Search:', url);

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return Array.isArray(json.data) ? json.data : [];
        } catch (e) {
            console.error('LRR Rec: searchArchives error', e);
            return [];
        }
    }

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function sample(arr, n) {
        if (arr.length <= n) return arr.slice();
        return shuffle(arr).slice(0, n);
    }

    function archiveHasSameCategory(archiveTagsStr, currentCategoryLowerSet) {
        if (!archiveTagsStr || currentCategoryLowerSet.size === 0) return false;
        const lowers = archiveTagsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        return lowers.some(t => currentCategoryLowerSet.has(t));
    }

    function getMatchedSetForArchive(archiveTagsStr, sourceTagsLower) {
        const matched = new Set();
        if (!archiveTagsStr) return matched;
        archiveTagsStr.split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
            const lowerKey = t.toLowerCase();
            if (sourceTagsLower.has(lowerKey)) {
                matched.add(lowerKey);
            }
        });
        return matched;
    }

    // --- 相似度计算函数 ---
    function calculateArchiveSimilarity(sourceTagsLower, candidateTagsStr, highWeightSet) {
        if (!candidateTagsStr) return 0;

        const candidateTags = candidateTagsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        let totalScore = 0;

        candidateTags.forEach(tag => {
            if (sourceTagsLower.has(tag)) {
                // 1. 计算原始得分
                let rawPoints = 1; // 基础分
                if (highWeightSet && highWeightSet.has(tag)) {
                    rawPoints += 3; // 高权重额外加分
                }

                // 2. 生成随机系数 (0.85 ~ 1.15)
                const randomFactor = 0.85 + (Math.random() * 0.3);

                // 3. 累加经随机浮动处理后的分数
                totalScore += rawPoints * randomFactor;
            }
        });

        return totalScore;
    }

    // 渲染标签 HTML
    function renderTags(tagsStr, sourceTagsLower, sourceDisplayTextMap, matchedSet) {
        if (!tagsStr) return '';

        const rawTags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
        if (rawTags.length === 0) return '';

        // 归一化命名空间
        const normalizeNs = ns =>
            (ns || 'other')
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '')      // "date added" -> "dateadded"
                .replace(/_/g, '');       // "date_added" -> "dateadded"

        // 不显示的命名空间
        const hiddenNamespaces = [
            'category',
            'uploader',
            'source',
            'language',
            'timestamp',
            'dateadded' // 覆盖 date added / date-added / date_added
        ];

        const primaryNamespaces = ['female', 'male', 'others'];
        const secondaryNamespaces = ['parody', 'character', 'artist', 'group'];

        // 预处理 + 过滤隐藏命名空间
        const processed = rawTags
            .map((tag, index) => {
                const lowerKey = tag.toLowerCase();
                const parts = tag.split(':');
                const rawNs = parts.length > 1 ? parts[0] : 'other';
                const ns = normalizeNs(rawNs);

                if (hiddenNamespaces.includes(ns)) {
                    return null;
                }

                const rawValue = parts.length > 1 ? parts.slice(1).join(':') : tag;

                let displayText = rawValue || tag;

                if (sourceDisplayTextMap && sourceDisplayTextMap.has(lowerKey)) {
                    const mapped = sourceDisplayTextMap.get(lowerKey);
                    if (mapped && mapped !== rawValue) {
                        displayText = mapped;
                    }
                }

                return {
                    raw: tag,
                    ns,
                    displayText,
                    index,
                    length: displayText.length
                };
            })
            .filter(Boolean);

        if (processed.length === 0) return '';

        // 简单洗牌
        function shuffleLocal(arr) {
            const a = arr.slice();
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }

        // 分组：primary / secondary / others
        const primary = [];
        const secondary = [];
        const others = [];
        for (const item of processed) {
            if (primaryNamespaces.includes(item.ns)) {
                primary.push(item);
            } else if (secondaryNamespaces.includes(item.ns)) {
                secondary.push(item);
            } else {
                others.push(item);
            }
        }

        const MAX_TAGS_PER_CARD = 5;
        const picked = [];

        // 1. 从 primary 随机取
        const primaryShuffled = shuffleLocal(primary);
        for (const t of primaryShuffled) {
            if (picked.length >= MAX_TAGS_PER_CARD) break;
            picked.push(t);
        }

        // 2. 不足 5 个，从 secondary 随机补
        if (picked.length < MAX_TAGS_PER_CARD && secondary.length > 0) {
            const secondaryShuffled = shuffleLocal(secondary);
            for (const t of secondaryShuffled) {
                if (picked.length >= MAX_TAGS_PER_CARD) break;
                picked.push(t);
            }
        }

        if (picked.length === 0) return '';

        // 排布优化：长标签优先，便于“下行更满”
        picked.sort((a, b) => b.length - a.length);

        // —— 分成最多两行 —— //
        const bottomRow = [];
        const topRow = [];
        let bottomLen = 0;
        let topLen = 0;

        for (const item of picked) {
            // 简单装箱：总长度更短的那行先放，保证底行尽量更满
            if (bottomLen <= topLen) {
                bottomRow.push(item);
                bottomLen += item.length;
            } else {
                topRow.push(item);
                topLen += item.length;
            }
        }

        // 行内顺序按原 index 排一下，避免完全乱序
        bottomRow.sort((a, b) => a.index - b.index);
        topRow.sort((a, b) => a.index - b.index);

        // 构造单个标签 HTML
        const buildTag = info => {
            const { raw, ns, displayText } = info;
            const nsClass = `${ns}-tag lrr-tag-${ns}`;
            const isMatch = matchedSet && matchedSet.has(raw.toLowerCase());
            const matchClass = isMatch ? 'lrr-rec-tag-match' : '';
            const spanCls = `${nsClass} lrr-rec-tag ${matchClass}`.trim();

            return (
                `<span class="${spanCls}"` +
                ` data-ns="${ns}"` +
                ` data-val="${raw}"` +
                ` search="${raw}"` +
                ` title="${raw}">` +
                `${displayText}` +
                `</span>`
            );
        };

        const rowsHtml = [];

        if (topRow.length > 0) {
            rowsHtml.push(
                `<div class="lrr-rec-row lrr-rec-row-top">` +
                topRow.map(buildTag).join('') +
                `</div>`
            );
        }

        if (bottomRow.length > 0) {
            rowsHtml.push(
                `<div class="lrr-rec-row lrr-rec-row-bottom">` +
                bottomRow.map(buildTag).join('') +
                `</div>`
            );
        }

        return rowsHtml.join('');
    }

    function createCardHTML(archive, matchedSet, sourceTagsLower, sourceDisplayTextMap) {
        const id = archive.arcid;
        const title = archive.title;
        const thumbUrl = `/api/archives/${id}/thumbnail`;
        const readerUrl = `/reader?id=${id}`;

        const tagsHtml = renderTags(
            archive.tags || '',
            sourceTagsLower,
            sourceDisplayTextMap,
            matchedSet || new Set()
        );

        return `
    <div class="lrr-rec-card" data-arcid="${id}">
        <a href="${readerUrl}" title="${title}">
            <div class="lrr-rec-thumb">
                <img src="${thumbUrl}" loading="lazy" alt="" class="lrr-rec-thumb-img" onerror="this.removeAttribute('onerror'); this.src='/img/no_thumb.png';">
                <div class="lrr-rec-tags">
                    ${tagsHtml}
                </div>
            </div>
            <div class="lrr-rec-title">${title}</div>
        </a>
    </div>
    `;
    }

    // ==========================================
    // 主逻辑
    // ==========================================
    async function init() {
        // --- 0. 扩展配置项：自动展开 ---
        if (typeof CONFIG.autoExpand === 'undefined') {
            CONFIG.autoExpand = false;
        }

        const currentId = new URLSearchParams(window.location.search).get('id');
        if (!currentId) return;

        // --- 1. 构建布局（默认收起） ---
        const mainContainer = document.querySelector('.ido') || document.querySelector('#ido') || document.body;
        const wrapper = document.createElement('div');
        wrapper.id = 'lrr-rec-app-wrapper';

        const arrowSvg = `<svg class="lrr-rec-arrow-icon" viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>`;

        const app = document.createElement('div');
        app.id = 'lrr-rec-app';
        app.innerHTML = `
            <div id="lrr-rec-container" class="collapsed">
                <div class="lrr-rec-header" id="lrr-rec-header-bar">
                    <div class="lrr-rec-tabs">
                        <button class="lrr-rec-tab-btn active" data-target="sim">猜你喜欢</button>
                        <button class="lrr-rec-tab-btn" data-target="artist" id="lrr-rec-btn-artist" style="display:none">同作者</button>
                    </div>
                    <span id="lrr-rec-status-msg">正在生成推荐...</span>
                    <div class="lrr-rec-toggle" title="展开/收起">
                        ${arrowSvg}
                    </div>
                </div>
                <div id="lrr-rec-view-sim" class="lrr-rec-scroll-view">
                    <div class="lrr-rec-loading">正在分析标签并搜索...</div>
                </div>
                <div id="lrr-rec-view-artist" class="lrr-rec-scroll-view lrr-rec-view-hidden"></div>
            </div>
        `;
        wrapper.appendChild(app);

        const footerElement = document.querySelector('p.ip');
        if (footerElement && footerElement.parentNode) {
            footerElement.parentNode.insertBefore(wrapper, footerElement);
        } else {
            mainContainer.appendChild(wrapper);
        }

        const container = document.getElementById('lrr-rec-container');
        const headerBar = document.getElementById('lrr-rec-header-bar');

        const btnSim = app.querySelector('[data-target="sim"]');
        const btnArtist = document.getElementById('lrr-rec-btn-artist');
        const viewSim = document.getElementById('lrr-rec-view-sim');
        const viewArtist = document.getElementById('lrr-rec-view-artist');

        // 初始收起
        viewSim.classList.add('lrr-rec-view-hidden');
        viewArtist.classList.add('lrr-rec-view-hidden');
        container.style.maxHeight = `${headerBar.offsetHeight}px`;

        const switchTab = (target) => {
            if (target === 'sim') {
                btnSim.classList.add('active');
                btnArtist.classList.remove('active');
                viewSim.classList.remove('lrr-rec-view-hidden');
                viewArtist.classList.add('lrr-rec-view-hidden');
            } else {
                btnSim.classList.remove('active');
                btnArtist.classList.add('active');
                viewSim.classList.add('lrr-rec-view-hidden');
                viewArtist.classList.remove('lrr-rec-view-hidden');
            }
        };
        btnSim.onclick = () => switchTab('sim');
        btnArtist.onclick = () => switchTab('artist');

        const enableHorizontalScroll = (el) => {
            el.addEventListener('wheel', (evt) => {
                if (evt.deltaY !== 0) {
                    evt.preventDefault();
                    el.scrollLeft += evt.deltaY;
                }
            }, { passive: false });
        };
        enableHorizontalScroll(viewSim);
        enableHorizontalScroll(viewArtist);

        const togglePanel = () => {
            const isCollapsed = container.classList.contains('collapsed');
            if (isCollapsed) {
                container.classList.remove('collapsed');
                const activeTarget = btnArtist.classList.contains('active') ? 'artist' : 'sim';
                switchTab(activeTarget);
                container.style.maxHeight = '';
            } else {
                container.classList.add('collapsed');
                container.style.maxHeight = '';
            }
        };

        headerBar.addEventListener('click', (e) => {
            if (e.target.closest('.lrr-rec-tab-btn')) return;
            togglePanel();
        });

        await new Promise(r => setTimeout(r, 800));

        // --- 数据准备 ---
        const sourceData = getCurrentArchiveTags();
        const sourceTagsLower = sourceData.allLower;
        const sourceArtist = Array.from(sourceData.artists);
        const sourceCategoryLower = sourceData.categoriesLower;
        const sourceDisplayTextMap = sourceData.displayTextMap;

        // 将 Config 中的高权重标签转为 Set，提升查找性能
        const highWeightSet = new Set(CONFIG.highWeightTags || []);

        logDebug('Current tags:', sourceData);

        // --- 渲染辅助函数 ---
        const renderArchiveList = (archives, containerEl) => {
            if (!archives || archives.length === 0) return false;
            const html = archives.map(arc => {
                const matchedSet = getMatchedSetForArchive(arc.tags || '', sourceTagsLower);
                return createCardHTML(arc, matchedSet, sourceTagsLower, sourceDisplayTextMap);
            }).join('');
            containerEl.innerHTML = html;
            return true;
        };

        let remainingTotal = CONFIG.totalLimit;

        // ==========================================
        // 核心构建逻辑 (修改为返回数据而非直接操作 DOM，以便缓存)
        // ==========================================

        async function buildYouMayLikeData() {
            if (remainingTotal <= 0) return [];

            const viewLimit = Math.min(CONFIG.perViewLimit, remainingTotal);

            const pickTags = (namespaces, fallbackNamespaces) => {
                const primary = [];
                const fallback = [];
                sourceData.all.forEach(raw => {
                    const parts = raw.split(':');
                    if (parts.length <= 1) return;
                    const ns = parts[0].toLowerCase();
                    if (namespaces.includes(ns)) primary.push(raw);
                    else if (fallbackNamespaces.includes(ns)) fallback.push(raw);
                });
                let base = primary.length > 0 ? primary : fallback;
                if (base.length === 0) return [];

                let maxSearchCount = 3;
                const totalTagsCount = sourceData.all.size;
                if (totalTagsCount > 40) {
                    maxSearchCount = 7;
                } else if (totalTagsCount > 20) {
                    maxSearchCount = 5;
                }

                const count = Math.min(maxSearchCount, Math.max(1, base.length));
                return sample(base, count);
            };

            const queryTags = pickTags(CONFIG.likeNamespaces, CONFIG.likeFallbackNamespaces);
            logDebug('Like query tags:', queryTags);

            if (!queryTags || queryTags.length === 0) return [];

            const allResultsMap = new Map();
            for (const tag of queryTags) {
                const filter = `${tag}$`;
                const data = await searchArchives(filter);
                data.forEach(arc => {
                    if (arc.arcid === currentId) return;
                    if (!allResultsMap.has(arc.arcid)) allResultsMap.set(arc.arcid, arc);
                });
            }

            let allResults = Array.from(allResultsMap.values());
            if (allResults.length === 0) return [];

            // 计算相似度 (传入 highWeightSet)
            allResults.forEach(arc => {
                arc._simScore = calculateArchiveSimilarity(sourceTagsLower, arc.tags || '', highWeightSet);
            });

            const sameCategory = [];
            const otherCategory = [];

            allResults.forEach(arc => {
                if (archiveHasSameCategory(arc.tags || '', sourceCategoryLower)) {
                    sameCategory.push(arc);
                } else {
                    otherCategory.push(arc);
                }
            });

            const sortByScoreDesc = (a, b) => b._simScore - a._simScore;
            let picked = [];

            if (sameCategory.length > 0) {
                sameCategory.sort(sortByScoreDesc);
                if (sameCategory.length >= viewLimit) {
                    picked = sameCategory.slice(0, viewLimit);
                } else {
                    picked = [...sameCategory];
                    const needMore = viewLimit - picked.length;
                    if (otherCategory.length > 0) {
                        otherCategory.sort(sortByScoreDesc);
                        picked = picked.concat(otherCategory.slice(0, needMore));
                    }
                }
            } else {
                otherCategory.sort(sortByScoreDesc);
                picked = otherCategory.slice(0, viewLimit);
            }

            remainingTotal = Math.max(0, remainingTotal - picked.length);
            return picked;
        }

        async function buildSameAuthorData() {
            if (remainingTotal <= 0) return [];
            if (!Array.isArray(sourceArtist) || sourceArtist.length === 0) return [];

            const viewLimit = Math.min(CONFIG.perViewLimit, remainingTotal);
            if (viewLimit <= 0) return [];

            const allResultsMap = new Map();
            const searchPromises = sourceArtist.map(tag => {
                const filter = `${tag}$`;
                return searchArchives(filter)
                    .then(data => ({ tag, data }))
                    .catch(e => {
                        logDebug('buildSameAuthor search error for tag:', tag, e);
                        return { tag, data: [] };
                    });
            });

            const allSearchResults = await Promise.all(searchPromises);

            for (const { data } of allSearchResults) {
                if (!Array.isArray(data) || data.length === 0) continue;
                data.forEach(arc => {
                    if (!arc || arc.arcid == null) return;
                    if (arc.arcid === currentId) return;
                    if (!allResultsMap.has(arc.arcid)) {
                        allResultsMap.set(arc.arcid, arc);
                    }
                });
            }

            const allResults = Array.from(allResultsMap.values());
            if (allResults.length === 0) return [];

            const shuffled = shuffle(allResults);
            const picked = shuffled.slice(0, viewLimit);

            remainingTotal = Math.max(0, remainingTotal - picked.length);
            return picked;
        }

        // ==========================================
        // 执行逻辑：缓存检查 -> 生成 -> 渲染 -> 保存
        // ==========================================
        try {
            const cacheKey = `lrr_rec_cache_v1_${currentId}`;
            let cachedData = null;

            // 1. 尝试读取缓存
            try {
                const raw = localStorage.getItem(cacheKey);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    const now = Date.now();
                    if (parsed && (now - parsed.timestamp < CONFIG.cacheExpiry)) {
                        cachedData = parsed;
                        logDebug('Loaded recommendations from cache');
                    } else {
                        logDebug('Cache expired or invalid');
                    }
                }
            } catch (e) {
                console.warn('LRR Rec: Cache read error', e);
            }

            let simResult = [];
            let artistResult = [];

            if (cachedData) {
                // 2A. 命中缓存：直接使用数据
                simResult = cachedData.sim || [];
                artistResult = cachedData.artist || [];
            } else {
                // 2B. 未命中缓存：执行构建逻辑
                simResult = await buildYouMayLikeData();
                artistResult = await buildSameAuthorData();

                // 写入缓存 (仅当有数据时)
                if (simResult.length > 0 || artistResult.length > 0) {
                    try {
                        const payload = {
                            timestamp: Date.now(),
                            sim: simResult,
                            artist: artistResult
                        };
                        localStorage.setItem(cacheKey, JSON.stringify(payload));
                    } catch (e) {
                        console.warn('LRR Rec: Cache write error', e);
                    }
                }
            }

            // 3. 渲染视图
            if (simResult.length > 0) {
                renderArchiveList(simResult, viewSim);
            } else {
                viewSim.innerHTML = `<div class="lrr-rec-loading">暂无推荐结果。</div>`;
            }

            if (artistResult.length > 0) {
                renderArchiveList(artistResult, viewArtist);
                btnArtist.style.display = 'block';
                btnArtist.innerText = '同作者';
            }

            // 4. 后续 UI 状态更新
            if (CONFIG.autoExpand) {
                if (container.classList.contains('collapsed')) {
                    container.classList.remove('collapsed');
                    // 优先显示同作者（如果有），否则显示猜你喜欢 (根据逻辑需求调整，此处保持优先 Sim，除非用户点击)
                    // 如果你想让同作者有数据时优先切过去，可以在这里判断。目前逻辑保持默认 Sim。
                    const activeTarget = btnArtist.classList.contains('active') ? 'artist' : 'sim';
                    switchTab(activeTarget);
                    container.style.maxHeight = '';
                }
                const statusMsg = document.getElementById('lrr-rec-status-msg');
                if (statusMsg) statusMsg.style.display = 'none';
            } else {
                const statusMsg = document.getElementById('lrr-rec-status-msg');
                if (statusMsg) {
                    statusMsg.innerText = '推荐已就绪';
                    setTimeout(() => { statusMsg.style.opacity = '0'; }, 3000);
                }
            }

        } catch (e) {
            console.error(e);
            viewSim.innerHTML = `<div class="lrr-rec-loading">加载失败</div>`;
        }
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();