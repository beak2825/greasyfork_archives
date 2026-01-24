// ==UserScript==
// @name         Nyaa Visual Enhanced (Glass Edition Pro)
// @namespace    http://tampermonkey.net/
// @version      4.7
// @description  Universal Nyaa previews with unified search, AniList fallback, metadata tooltips, synopsis panel, and improved title parsing.
// @author       dr.bobo0
// @match        https://nyaa.si/*
// @exclude      https://nyaa.si/view/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @connect      api.jikan.moe
// @connect      graphql.anilist.co
// @downloadURL https://update.greasyfork.org/scripts/561823/Nyaa%20Visual%20Enhanced%20%28Glass%20Edition%20Pro%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561823/Nyaa%20Visual%20Enhanced%20%28Glass%20Edition%20Pro%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =============== 1. CONFIGURATION ===============
    const DEFAULT_CONFIG = {
        enabled: true,
        mode: 'inline',
        size: 80,
        square: false,
        zoom: true,
        transparent: true,
        cacheExpiry: 14,
        showMetadata: true,
        showSynopsisPanel: true,
        synopsisVisible: true,
        showConfidenceBorder: true
    };

    let CONFIG = { ...DEFAULT_CONFIG, ...GM_getValue('nyaa_cfg_v11', {}) };
    let cache = GM_getValue('nyaa_universal_cache_v5', {});
    let requestQueue = [];
    let isProcessing = false;
    let tooltip = null;
    let contextMenu = null;
    let rafId = null;
    let sliderRaf = null;
    let currentContextTarget = null;

    let isSynopsisVisible = CONFIG.synopsisVisible !== false;

    const COVER_ASPECT_RATIO = 0.7;

    const saveConfig = () => GM_setValue('nyaa_cfg_v11', CONFIG);
    const saveCache = () => GM_setValue('nyaa_universal_cache_v5', cache);

    const CATEGORY_TYPES = {
        'Anime': 'anime',
        'Anime - Anime Music Video': 'anime',
        'Anime - English-translated': 'anime',
        'Anime - Non-English-translated': 'anime',
        'Anime - Raw': 'anime',
        'Audio': 'audio',
        'Audio - Lossless': 'audio',
        'Audio - Lossy': 'audio',
        'Literature': 'manga',
        'Literature - English-translated': 'manga',
        'Literature - Non-English-translated': 'manga',
        'Literature - Raw': 'manga',
        'Live Action': 'live',
        'Live Action - English-translated': 'live',
        'Live Action - Idol/Promotional Video': 'live',
        'Live Action - Non-English-translated': 'live',
        'Live Action - Raw': 'live',
        'Pictures': 'pictures',
        'Pictures - Graphics': 'pictures',
        'Pictures - Photos': 'pictures',
        'Software': 'software',
        'Software - Applications': 'software',
        'Software - Games': 'software'
    };

    const CATEGORY_ICONS = {
        audio: '🎵',
        live: '🎬',
        software: '💾',
        pictures: '🖼️'
    };

    // =============== 2. STRING SIMILARITY (for Search Modal only) ===============

    function levenshteinDistance(str1, str2) {
        const m = str1.length;
        const n = str2.length;

        if (m === 0) return n;
        if (n === 0) return m;

        const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j - 1] + cost
                );
            }
        }

        return dp[m][n];
    }

    function normalizeTitle(title) {
        if (!title) return '';

        return title
            .toLowerCase()
            .replace(/[^\w\s\u3040-\u30ff\u4e00-\u9faf]/g, ' ')
            .replace(/\b(the|a|an)\b/gi, '')
            .replace(/\bseason\s*(\d+)/gi, 's$1')
            .replace(/\bpart\s*(\d+)/gi, 'p$1')
            .replace(/\b(\d+)(st|nd|rd|th)\b/gi, '$1')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function calculateSimilarity(str1, str2) {
        const a = normalizeTitle(str1);
        const b = normalizeTitle(str2);

        if (!a || !b) return 0;
        if (a === b) return 1;

        if (a.includes(b) || b.includes(a)) {
            const shorter = Math.min(a.length, b.length);
            const longer = Math.max(a.length, b.length);
            return 0.8 + (0.2 * (shorter / longer));
        }

        const distance = levenshteinDistance(a, b);
        const maxLength = Math.max(a.length, b.length);
        const similarity = 1 - (distance / maxLength);

        const tokensA = new Set(a.split(' ').filter(t => t.length > 1));
        const tokensB = new Set(b.split(' ').filter(t => t.length > 1));
        const intersection = [...tokensA].filter(t => tokensB.has(t));
        const union = new Set([...tokensA, ...tokensB]);
        const jaccardSimilarity = union.size > 0 ? intersection.length / union.size : 0;

        return (similarity * 0.6) + (jaccardSimilarity * 0.4);
    }

    function getTitleVariants(result) {
        const variants = [];
        if (result.malTitle) variants.push(result.malTitle);
        if (result.englishTitle) variants.push(result.englishTitle);
        if (result.romajiTitle) variants.push(result.romajiTitle);
        if (result.nativeTitle) variants.push(result.nativeTitle);
        if (result.synonyms && Array.isArray(result.synonyms)) {
            variants.push(...result.synonyms);
        }
        return [...new Set(variants.filter(Boolean))];
    }

    function scoreResult(result, searchTitle) {
        const variants = getTitleVariants(result);
        if (variants.length === 0) return 0;

        let bestScore = 0;
        for (const variant of variants) {
            const score = calculateSimilarity(variant, searchTitle);
            if (score > bestScore) {
                bestScore = score;
            }
        }

        const searchWords = normalizeTitle(searchTitle).split(' ').filter(w => w.length > 2);
        const resultWords = normalizeTitle(result.malTitle || '').split(' ').filter(w => w.length > 2);

        let exactWordMatches = 0;
        for (const word of searchWords) {
            if (resultWords.includes(word)) exactWordMatches++;
        }

        if (searchWords.length > 0) {
            const wordMatchRatio = exactWordMatches / searchWords.length;
            bestScore = (bestScore * 0.7) + (wordMatchRatio * 0.3);
        }

        return Math.min(1, bestScore);
    }

    function getConfidenceLevel(score) {
        if (score >= 0.7) return 'high';
        if (score >= 0.4) return 'medium';
        return 'low';
    }

    // =============== 3. STYLES ===============
    function injectGlobalStyles() {
        const iconHeight = CONFIG.size;
        const iconWidth = Math.round(iconHeight * COVER_ASPECT_RATIO);

        GM_addStyle(`
            :root {
                --nv-size: ${CONFIG.size}px;
                --nv-icon-width: ${iconWidth}px;
                --nv-radius: 4px;
                --nv-anim: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .nv-skeleton {
                height: var(--nv-size);
                width: var(--nv-icon-width);
                border-radius: var(--nv-radius);
                margin-right: 12px;
                vertical-align: middle;
                display: inline-block;
                background: linear-gradient(90deg,
                    rgba(128,128,128,0.1) 25%,
                    rgba(128,128,128,0.3) 50%,
                    rgba(128,128,128,0.1) 75%
                );
                background-size: 200% 100%;
                animation: nv-shimmer 1.5s infinite;
            }

            @keyframes nv-shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            .nv-img {
                height: var(--nv-size);
                width: auto;
                border-radius: var(--nv-radius);
                margin-right: 12px;
                vertical-align: middle;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                object-fit: cover;
                cursor: help;
                will-change: height, transform;
                transform: translateZ(0);
                transition: transform var(--nv-anim), opacity 0.3s;
                opacity: 0;
            }

            .nv-img.nv-loaded { opacity: 1; }

            body.nv-show-confidence .nv-img.nv-low-confidence {
                border: 2px solid #ff9800;
                box-shadow: 0 2px 5px rgba(255,152,0,0.4);
            }

            .nv-category-icon {
                font-size: calc(var(--nv-size) * 0.4);
                margin-right: 12px;
                vertical-align: middle;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: var(--nv-icon-width);
                height: var(--nv-size);
                background: rgba(128,128,128,0.15);
                border-radius: var(--nv-radius);
                opacity: 0.7;
            }

            body.nv-mode-inline .nv-img,
            body.nv-mode-inline .nv-skeleton,
            body.nv-mode-inline .nv-category-icon,
            body.nv-mode-hybrid .nv-img,
            body.nv-mode-hybrid .nv-skeleton,
            body.nv-mode-hybrid .nv-category-icon { display: inline-block; }

            body.nv-mode-hover .nv-img,
            body.nv-mode-hover .nv-skeleton,
            body.nv-mode-hover .nv-category-icon { display: none !important; }

            body.nv-mode-hover .nv-link::before {
                content: '📷'; font-size: 14px; margin-right: 6px;
                cursor: help; opacity: 0.7; vertical-align: middle;
            }
            body.nv-mode-hover .nv-link:hover::before { opacity: 1; }
            body.nv-mode-hover .nv-link.nv-no-search::before { content: ''; margin: 0; }

            body.nv-square .nv-img { width: var(--nv-size); }
            body.nv-square .nv-skeleton { width: var(--nv-size); }
            body.nv-square .nv-category-icon { width: var(--nv-size); }

            body.nv-zoom .nv-img:hover {
                transform: scale(1.15) translateZ(0);
                box-shadow: 0 5px 15px rgba(0,0,0,0.4);
                z-index: 50; position: relative;
            }

            body.nv-disabled .nv-img,
            body.nv-disabled .nv-skeleton,
            body.nv-disabled .nv-category-icon,
            body.nv-disabled .nv-link::before { display: none !important; }

            #nv-tooltip {
                position: fixed; display: none; z-index: 99999; pointer-events: none;
                box-shadow: 0 10px 30px rgba(0,0,0,0.7);
                border-radius: 8px; overflow: visible;
                background: #121212; border: 1px solid #444;
                width: 220px; line-height: 0;
            }
            #nv-tooltip .nv-tooltip-main {
                position: relative;
                border-radius: 8px;
                overflow: hidden;
                background: #121212;
            }
            #nv-tooltip img.nv-tooltip-img { width: 100%; height: auto; display: block; }
            #nv-tooltip .nv-tooltip-content {
                padding: 10px;
                font-size: 12px;
                color: #fff;
                line-height: 1.4;
                background: rgba(0,0,0,0.9);
            }
            #nv-tooltip .nv-tooltip-title {
                font-weight: bold;
                font-size: 13px;
                margin-bottom: 6px;
                color: #fff;
            }
            #nv-tooltip .nv-tooltip-meta {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 6px;
                font-size: 11px;
                color: #aaa;
            }
            #nv-tooltip .nv-meta-item {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            #nv-tooltip .nv-meta-score { color: #ffc107; font-weight: bold; }
            #nv-tooltip .nv-meta-type {
                background: rgba(255,255,255,0.1);
                padding: 2px 6px;
                border-radius: 4px;
            }
            #nv-tooltip .nv-meta-confidence {
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 4px;
            }
            #nv-tooltip .nv-meta-confidence.high { background: rgba(76,175,80,0.3); color: #81c784; }
            #nv-tooltip .nv-meta-confidence.medium { background: rgba(255,152,0,0.3); color: #ffb74d; }
            #nv-tooltip .nv-meta-confidence.low { background: rgba(244,67,54,0.3); color: #e57373; }
            #nv-tooltip .nv-shift-hint {
                font-size: 10px;
                color: #666;
                margin-top: 8px;
                text-align: center;
            }

            .nv-description-panel {
                position: absolute;
                top: 0;
                left: 230px;
                width: 280px;
                max-height: 400px;
                background: rgba(20, 20, 20, 0.85);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255,255,255,0.15);
                border-radius: 8px;
                padding: 15px;
                color: #eee;
                opacity: 0;
                transform: translateX(-15px);
                transition: opacity 0.3s ease, transform 0.3s ease;
                pointer-events: none;
                z-index: -1;
                line-height: 1.5;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            }
            .nv-description-panel.nv-visible {
                opacity: 1;
                transform: translateX(0);
                pointer-events: auto;
                z-index: 1;
            }
            .nv-description-panel h4 {
                margin: 0 0 10px 0;
                font-size: 14px;
                font-weight: bold;
                color: #fff;
                display: flex;
                align-items: center;
                gap: 6px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                padding-bottom: 8px;
            }
            .nv-description-panel .nv-synopsis-text {
                font-size: 12px;
                color: #ccc;
                line-height: 1.6;
            }
            .nv-description-panel .nv-synopsis-text p { margin: 0 0 10px 0; }
            .nv-description-panel .nv-no-synopsis { font-style: italic; color: #999; }
            .nv-description-panel .nv-synopsis-tip {
                margin-top: 12px;
                padding-top: 10px;
                border-top: 1px solid rgba(255,255,255,0.1);
                font-size: 11px;
                color: #888;
            }
            .nv-description-panel .nv-synopsis-tip strong { color: #ffa726; }

            .nv-description-panel::-webkit-scrollbar { width: 6px; }
            .nv-description-panel::-webkit-scrollbar-track {
                background: rgba(255,255,255,0.05);
                border-radius: 3px;
            }
            .nv-description-panel::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.2);
                border-radius: 3px;
            }
            .nv-description-panel::-webkit-scrollbar-thumb:hover {
                background: rgba(255,255,255,0.3);
            }

            #nv-context-menu {
                position: fixed;
                z-index: 100001;
                background: rgba(30,30,30,0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 8px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                min-width: 200px;
                padding: 6px 0;
                display: none;
            }
            #nv-context-menu .nv-menu-item {
                padding: 10px 16px;
                cursor: pointer;
                font-size: 13px;
                color: #eee;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background 0.15s;
            }
            #nv-context-menu .nv-menu-item:hover { background: rgba(255,255,255,0.1); }
            #nv-context-menu .nv-menu-item.nv-disabled { opacity: 0.4; pointer-events: none; }
            #nv-context-menu .nv-menu-divider {
                height: 1px;
                background: rgba(255,255,255,0.1);
                margin: 6px 0;
            }
            #nv-context-menu .nv-menu-icon { width: 18px; text-align: center; }

            #nv-search-modal {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.85);
                z-index: 100002;
                display: none;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            #nv-search-modal .nv-modal-content {
                background: rgba(30,30,30,0.98);
                backdrop-filter: blur(16px);
                border-radius: 12px;
                padding: 24px;
                max-width: 900px;
                max-height: 85vh;
                width: 100%;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                position: relative;
            }
            #nv-search-modal .nv-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }
            #nv-search-modal .nv-modal-title { font-size: 18px; font-weight: bold; color: #fff; }
            #nv-search-modal .nv-modal-close {
                background: rgba(255,255,255,0.1);
                border: none;
                color: #fff;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #nv-search-modal .nv-modal-close:hover { background: rgba(255,255,255,0.2); }
            #nv-search-modal .nv-search-bar { display: flex; gap: 10px; margin-bottom: 16px; }
            #nv-search-modal .nv-search-input {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 8px;
                background: rgba(255,255,255,0.1);
                color: #fff;
                font-size: 14px;
                outline: none;
            }
            #nv-search-modal .nv-search-input:focus { border-color: rgba(255,255,255,0.4); }
            #nv-search-modal .nv-search-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                background: #4CAF50;
                color: #fff;
                font-weight: bold;
                cursor: pointer;
                font-size: 14px;
            }
            #nv-search-modal .nv-search-btn:hover { background: #45a049; }
            #nv-search-modal .nv-search-btn:disabled { background: #555; cursor: not-allowed; }
            #nv-search-modal .nv-results-container { flex: 1; overflow-y: auto; padding-right: 8px; }
            #nv-search-modal .nv-results-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: 16px;
            }
            #nv-search-modal .nv-result-item {
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
                overflow: hidden;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
                border: 2px solid transparent;
                position: relative;
            }
            #nv-search-modal .nv-result-item:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 20px rgba(0,0,0,0.4);
            }
            #nv-search-modal .nv-result-item.selected { border-color: #4CAF50; }
            #nv-search-modal .nv-result-item img {
                width: 100%;
                height: 200px;
                object-fit: cover;
                display: block;
            }
            #nv-search-modal .nv-result-info { padding: 10px; color: #fff; }
            #nv-search-modal .nv-result-title {
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            #nv-search-modal .nv-result-meta { font-size: 11px; color: #aaa; }
            #nv-search-modal .nv-result-score {
                position: absolute;
                top: 8px;
                right: 8px;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: bold;
            }
            #nv-search-modal .nv-result-score.high { background: rgba(76,175,80,0.9); color: #fff; }
            #nv-search-modal .nv-result-score.medium { background: rgba(255,152,0,0.9); color: #fff; }
            #nv-search-modal .nv-result-score.low { background: rgba(244,67,54,0.9); color: #fff; }
            #nv-search-modal .nv-result-rank {
                position: absolute;
                top: 8px;
                left: 8px;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: bold;
                background: rgba(0,0,0,0.7);
                color: #fff;
            }
            #nv-search-modal .nv-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 60px;
                color: #888;
            }
            #nv-search-modal .nv-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(255,255,255,0.1);
                border-top-color: #4CAF50;
                border-radius: 50%;
                animation: nv-spin 1s linear infinite;
                margin-bottom: 16px;
            }
            @keyframes nv-spin { to { transform: rotate(360deg); } }
            #nv-search-modal .nv-no-results { text-align: center; padding: 60px; color: #888; }
            #nv-search-modal .nv-info-bar {
                display: flex;
                gap: 16px;
                margin-bottom: 12px;
                font-size: 12px;
                color: #888;
            }
            #nv-search-modal .nv-info-item { display: flex; align-items: center; gap: 4px; }

            #nv-settings {
                position: fixed; top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                width: 380px; max-width: 90%;
                padding: 25px; border-radius: 12px;
                z-index: 100000; font-family: system-ui, sans-serif;
                transition: background 0.3s, border 0.3s;
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
            }
            .nv-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }
            .nv-row label { font-size: 14px; font-weight: 600; cursor: pointer; }
            .nv-row .nv-hint { font-size: 11px; opacity: 0.6; margin-left: 4px; font-weight: normal; }
            .nv-stats { background: rgba(0,0,0,0.1); padding: 10px; border-radius: 6px; font-size: 12px; margin-bottom: 15px; text-align: center; opacity: 0.8; }
            .nv-actions { display: flex; gap: 10px; margin-top: 20px; }
            .nv-btn { flex: 1; padding: 10px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.2s; }
            .nv-btn:hover { filter: brightness(1.1); }

            input[type=range] { width: 130px; cursor: pointer; }
            input[type=checkbox] { transform: scale(1.2); cursor: pointer; }
            input[type=number] { width: 60px; padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(128,128,128,0.5); background: rgba(255,255,255,0.1); color: inherit; }

            select {
                padding: 6px; border-radius: 4px; border: 1px solid rgba(128,128,128,0.5);
                background-color: rgba(255,255,255,0.1);
                color: inherit; cursor: pointer; outline: none;
            }
            select option { background-color: #222; color: #eee; }
        `);
    }

    // =============== 4. THEME ENGINE ===============
    function getTheme() {
        const bg = getComputedStyle(document.body).backgroundColor;
        const isLight = bg.includes('255') || bg === 'rgb(242, 243, 245)';

        return isLight ? {
            bg: CONFIG.transparent ? 'rgba(255,255,255,0.65)' : '#ffffff',
            text: '#222',
            border: 'rgba(0,0,0,0.1)',
            shadow: 'rgba(0,0,0,0.15)',
            btn: '#e0e0e0', btnTxt: '#000',
            optBg: '#fff', optTxt: '#000'
        } : {
            bg: CONFIG.transparent ? 'rgba(20,20,20,0.65)' : '#1c1c1c',
            text: '#eee',
            border: 'rgba(255,255,255,0.1)',
            shadow: 'rgba(0,0,0,0.7)',
            btn: '#333', btnTxt: '#fff',
            optBg: '#222', optTxt: '#eee'
        };
    }

// =============== 5. TITLE EXTRACTION (IMPROVED) ===============
function extractAnimeTitle(rawText) {
    let title = rawText.trim();

    // Remove file extensions
    title = title.replace(/\.(mkv|mp4|avi|webm|ass|srt|rar|zip|7z|cbz|cbr|epub|pdf|mobi|azw3?)$/i, '');

    // Remove Chinese group brackets 【...】 at the start
    title = title.replace(/^【[^】]+】\s*/g, '');

    // Handle Chinese format: [Title][Episode][Metadata] after removing group
    // e.g., [暗芝居 第十六季][02][x264 1080p][CHS]
    const chineseBracketMatch = title.match(/^\[([^\]]+)\]\s*\[(\d+|EP?\d+)\]/i);
    if (chineseBracketMatch && chineseBracketMatch[1]) {
        let extracted = chineseBracketMatch[1].trim();
        // Check if it's actually a title (not just metadata)
        const isMetadata = /^(?:\d+p?|x26[45]|HEVC|AVC|AAC|FLAC|CHS|CHT|ENG|JPN|BIG5|GB)$/i.test(extracted);
        if (!isMetadata && extracted.length > 1) {
            // Remove Chinese season indicator for cleaner search
            extracted = extracted.replace(/\s*第[^季]*季\s*$/, '').trim();
            if (extracted.length > 1) {
                return extracted;
            }
        }
    }

    // Handle underscore format: [Group]_Title_-_01
    const underscoreFormatMatch = title.match(/^\[[^\]]+\]_?([^[\]]+?)_-_(?:\d+(?:[~-]\d+)?(?:v\d+)?|S\d+E\d+|EP?\d+)/i);
    if (underscoreFormatMatch && underscoreFormatMatch[1]) {
        let extracted = underscoreFormatMatch[1].replace(/_/g, ' ').trim();
        if (extracted.length > 2) {
            return extracted;
        }
    }

    // Handle underscore format without group
    const underscoreNoGroupMatch = title.match(/^([A-Za-z][A-Za-z0-9_\-!'.]+?)_-_(?:\d+(?:[~-]\d+)?(?:v\d+)?|S\d+E\d+|EP?\d+)/i);
    if (underscoreNoGroupMatch && underscoreNoGroupMatch[1]) {
        let extracted = underscoreNoGroupMatch[1].replace(/_/g, ' ').trim();
        if (extracted.length > 2 && !/^\d+$/.test(extracted)) {
            return extracted;
        }
    }

    // Handle bracket title match: [Group] [Title]
    const bracketTitleMatch = title.match(/^\[[^\]]+\]\s*\[([^\]]+)\]/);
    if (bracketTitleMatch) {
        const innerContent = bracketTitleMatch[1];
        const isMetadata = /^(?:\d+p?|S\d+E\d+|E\d+|EP\d+|CHS|CHT|ENG|JPN|BIG5|GB|WebRip|WEB-DL|HEVC|AVC|AAC|FLAC|v\d+|\d+)$/i.test(innerContent.trim());

        if (!isMetadata) {
            if (/[/／]/.test(innerContent)) {
                const parts = innerContent.split(/[/／]/);
                let extracted = (parts[1] || parts[0]).trim();
                extracted = extracted.replace(/_/g, ' ');
                if (extracted.length > 2) {
                    return extracted;
                }
            } else {
                const single = innerContent.replace(/_/g, ' ').trim();
                if (single.length > 2) {
                    return single;
                }
            }
        }
    }

    // Scene release with year
    const sceneWithYear = title.match(/^([A-Za-z0-9][A-Za-z0-9.\-']+?)\.(\d{4})\.(?:VO|VF|VOSTFR|MULTI|MULTi|FRENCH|GERMAN|ENGLISH|JAPANESE|1080p?|720p?|480p?|2160p?|BluRay|Blu-?ray|WEB|HDTV|BDRip|HDRip|DVDRip|REMUX|UHD|HDR|SDR|DTS|TrueHD|Atmos|DDP?|AC3|AAC|HEVC|AVC|H\.?26[45]|x26[45]|DoVi|Hybrid|COMPLETE|REPACK)/i);
    if (sceneWithYear && sceneWithYear[1]) {
        return sceneWithYear[1].replace(/\./g, ' ').trim();
    }

    // Clean up group tags and brackets at the start
    let cleaned = title.replace(/^[\[【][^\]】]+[\]】]\s*/g, '');
    cleaned = cleaned.replace(/^[\[【][^\]】]+[\]】]\s*/g, '');
    cleaned = cleaned.replace(/^\([^)]+\)\s*/g, '');

    // Handle | separator BEFORE / separator - take first major part
    if (/\s*\|\s*/.test(cleaned)) {
        cleaned = cleaned.split(/\s*\|\s*/)[0].trim();
    }

    // Handle slash-separated titles (multi-language: Chinese/Romaji/Japanese)
    if (/\s+[/／]\s+/.test(cleaned)) {
        const parts = cleaned.split(/\s+[/／]\s+/);
        if (parts.length >= 2) {
            // Helper to check if string is primarily Chinese (CJK without Japanese kana)
            const isPrimarilyChinese = (str) => {
                const cjk = (str.match(/[\u4e00-\u9faf\u3400-\u4dbf]/g) || []).length;
                const kana = (str.match(/[\u3040-\u30ff]/g) || []).length;
                const latin = (str.match(/[a-zA-Z]/g) || []).length;
                // If has Japanese kana, it's not "Chinese"
                if (kana > 0) return false;
                // Chinese chars must significantly outnumber Latin
                return cjk > latin;
            };

            const hasJapaneseKana = (str) => /[\u3040-\u30ff]/.test(str);

            const cleanCandidate = (str) => {
                return str
                    .replace(/\s*-\s*\d+(?:v\d+)?(?:\s.*)?$/i, '')
                    .replace(/\s*[\[\(].*$/, '')
                    .replace(/\s+\d+[-]?bit\b.*$/i, '')
                    .replace(/\s+(?:HEVC|AVC|x26[45]|H\.?26[45]|AAC|FLAC|Opus|AC3|DTS|TrueHD).*$/i, '')
                    .replace(/\s+(?:1080|720|480|2160)p?.*$/i, '')
                    .replace(/\s+(?:BDRip|BluRay|Blu-ray|WEB|HDTV|WEBRip|WEB-DL|DVDRip|REMUX).*$/i, '')
                    .trim();
            };

            let candidates = parts.map(cleanCandidate);

            // Priority 1: Japanese with hiragana/katakana (most accurate for anime databases)
            for (const candidate of candidates) {
                if (hasJapaneseKana(candidate) && candidate.length > 2) {
                    return candidate;
                }
            }

            // Priority 2: Primarily Latin/Romaji title (not Chinese with some English words)
            for (const candidate of candidates) {
                if (/[a-zA-Z]{3,}/.test(candidate) && candidate.length > 2 && !isPrimarilyChinese(candidate)) {
                    return candidate;
                }
            }

            // Priority 3: Any valid candidate (fallback)
            const validCandidate = candidates.find(c => c && c.length > 2);
            if (validCandidate) {
                return validCandidate;
            }
        }
    }

    title = cleaned;

    // Remove trailing parenthetical content
    title = title.replace(/\s*\([^)]*\)\s*$/g, '').trim();

    // Handle underscore separator
    const underscoreSepMatch = title.match(/^(.+?)_-_(?:\d+(?:[~-]\d+)?(?:v\d+)?|S\d+E\d+|EP?\d+)/i);
    if (underscoreSepMatch && underscoreSepMatch[1]) {
        let extracted = underscoreSepMatch[1].replace(/_/g, ' ').trim();
        if (extracted.length > 2) {
            return extracted;
        }
    }

    // Dot-separated patterns (scene releases)
    const dotPatterns = [
        /^(.+?)\.S\d+E\d+/i,
        /^(.+?)\.E(\d+)\./i,
        /^(.+?)\.EP\d+/i,
        /^(.+?)\.(?:MULTI|1080p?|720p?|480p?|2160p?|WEBRip|WEB-DL|BluRay|BDRip|HDTV|DVDRip)(?:\.|$)/i,
    ];

    for (const pattern of dotPatterns) {
        const match = title.match(pattern);
        if (match && match[1]) {
            const potential = match[1];
            if (potential.length > 2 && !/^\d+$/.test(potential)) {
                title = potential;
                break;
            }
        }
    }

    // Replace dots and underscores with spaces
    title = title.replace(/[._]/g, ' ');

    // Remove episode/chapter/volume patterns
    const separators = [
        // Word-based patterns (most specific - check these FIRST)
        / Chapter\s*\d+/i,
        / Ch\.?\s*\d+/i,
        / Vol\.?\s*\d+/i,
        / v\d+(?:[-~]\d+)?(?:\s|$)/i,
        / Episode \d+/i,

        // Episode/season patterns
        / - S\d+E\d+/i,
        / S\d+E\d+/i,
        / - EP?\d+/i,
        / EP?\d+(?:v\d+)?(?:\s|$)/i,

        // Number patterns with separator
        / - \d+(?:v\d+)?(?:\s|$)/i,
        / - \d+(?:~\d+)?(?:\s|$)/i,
        / \d+(?:v\d+)?\s*[\[\(]/i,

        // Year and technical patterns
        / \(\d{4}\)/,
        /\s*[\[\(][\w\d]+p[\]\)]/i,
        /\s*[\[\(](?:1080|720|480|2160)[pi]?[\]\)]/i,
        /\s*[\[\(](?:HEVC|H\.?26[45]|AV1|x26[45])[\]\)]/i,
        /\s*[\[\(](?:AAC|FLAC|Opus|AC3)[\]\)]/i,
    ];

    for (const sep of separators) {
        const match = title.search(sep);
        if (match > 0) {
            title = title.substring(0, match);
            break;
        }
    }

    // Remove trailing brackets
    title = title.replace(/\s*[\[\(][^\]\)]*[\]\)]?\s*$/g, '').trim();
    title = title.replace(/\s*[\[\(][^\]\)]*[\]\)]?\s*$/g, '').trim();

    // Remove chapter/volume patterns in brackets - handles [Chap. 1-3], [第1-3話], etc.
    title = title.replace(/\s*\[Chap\.?\s*[\d\-~]+\]/gi, '');
    title = title.replace(/\s*\[第[\d\-~]+話?\]/g, '');
    title = title.replace(/\s*\[第[\d\-~]+章?\]/g, '');

    // Remove Japanese volume indicators (第01-04巻, 第1巻, etc.)
    title = title.replace(/\s*第[\d\-~]+巻\s*$/g, '');
    title = title.replace(/\s*第[\d\-~]+話\s*$/g, '');
    title = title.replace(/\s*第[\d\-~]+章\s*$/g, '');

    // Remove common metadata tags
    title = title
        .replace(/\b(WEB|BD|DVD|Blu-?ray|HDTV|CR|Funi|AMZN|NF|B-Global|WEBRip|WEB-DL|x264|x265|HEVC|AAC|FLAC|MULTI)\b[-.\s]*/gi, '')
        .replace(/\s+Season\s*\d*$/i, '')
        .replace(/\s+Part\s*\d*$/i, '')
        .replace(/\s+Cour\s*\d*$/i, '')
        .replace(/\s+Complete$/i, '')
        .replace(/\s+Batch$/i, '')
        .replace(/\s*[-–—]\s*$/, '')
        .replace(/\s+S\d+$/i, '')
        .replace(/\s+\d+(?:st|nd|rd|th)\s+Season$/i, '')
        .trim();

    // Remove file format words at the end (standalone, not just as extensions)
    title = title.replace(/\s+(epub|pdf|mobi|azw3?|cbz|cbr|zip|rar|7z)$/i, '');

    // Remove volume/chapter ranges at the end (common in manga releases)
    // Matches: "1-26", "01-26", "1~26", "01~26", "v01-v26", etc.
    title = title.replace(/\s+v?\d+[-~]v?\d+\s*$/i, '');

    // Remove single volume numbers at the end (but be careful - only after Japanese/CJK text)
    // Matches: "Title 1", "Title 01" at the end
    title = title.replace(/([\u3040-\u30ff\u4e00-\u9faf])\s+\d{1,3}\s*$/i, '$1');

    // Remove trailing dashes, dots, underscores
    title = title.replace(/[_\-\.\s]+$/, '').trim();
    title = title.replace(/\s+/g, ' ').trim();

    return title.length > 2 ? title : null;
}

    // =============== 6. CATEGORY DETECTION ===============
    function detectCategory(row) {
        const categoryCell = row.querySelector('td:first-child a');
        if (!categoryCell) return 'anime';

        const categoryTitle = categoryCell.getAttribute('title') || categoryCell.textContent.trim();
        return CATEGORY_TYPES[categoryTitle] || 'anime';
    }

    // =============== 7. API FUNCTIONS (using first result like v10.9) ===============
    async function fetchFromJikan(title, type = 'anime') {
        const endpoint = type === 'manga' ? 'manga' : 'anime';
        const url = `https://api.jikan.moe/v4/${endpoint}?q=${encodeURIComponent(title)}&limit=10&sfw=true`;

        const response = await fetch(url);

        if (response.status === 429) throw new Error('RATE_LIMITED');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        if (!data.data || data.data.length === 0) return null;

        return data.data.map(item => ({
            imageUrl: item.images?.webp?.image_url || item.images?.jpg?.image_url,
            malId: item.mal_id,
            malTitle: item.title,
            englishTitle: item.title_english,
            romajiTitle: item.title,
            nativeTitle: item.title_japanese,
            synonyms: item.title_synonyms || [],
            score: item.score,
            year: item.year || (item.aired?.prop?.from?.year) || (item.published?.prop?.from?.year),
            episodes: item.episodes || item.chapters,
            type: item.type,
            status: item.status,
            synopsis: item.synopsis || null,
            source: 'jikan'
        }));
    }

    async function fetchFromAniList(title, type = 'anime') {
        const mediaType = type === 'manga' ? 'MANGA' : 'ANIME';
        const query = `
            query ($search: String, $type: MediaType) {
                Page(page: 1, perPage: 10) {
                    media(search: $search, type: $type, sort: SEARCH_MATCH) {
                        id
                        title { romaji english native }
                        synonyms
                        coverImage { large medium }
                        averageScore
                        seasonYear
                        episodes
                        chapters
                        format
                        status
                        description(asHtml: false)
                    }
                }
            }
        `;

        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { search: title, type: mediaType } })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        if (!data.data?.Page?.media?.length) return null;

        return data.data.Page.media.map(item => ({
            imageUrl: item.coverImage?.large || item.coverImage?.medium,
            anilistId: item.id,
            malTitle: item.title?.english || item.title?.romaji,
            englishTitle: item.title?.english,
            romajiTitle: item.title?.romaji,
            nativeTitle: item.title?.native,
            synonyms: item.synonyms || [],
            score: item.averageScore ? item.averageScore / 10 : null,
            year: item.seasonYear,
            episodes: item.episodes || item.chapters,
            type: item.format,
            status: item.status,
            synopsis: item.description || null,
            source: 'anilist'
        }));
    }

    async function searchWithFallback(title, type = 'anime') {
        // Try AniList first (better synonym support)
        try {
            const aniResult = await fetchFromAniList(title, type);
            if (aniResult && aniResult.length > 0) return aniResult;
        } catch (e) {
            console.warn('[Nyaa Preview] AniList failed, trying Jikan...', e);
        }

        // Fallback to Jikan
        try {
            return await fetchFromJikan(title, type);
        } catch (e) {
            if (e.message === 'RATE_LIMITED') throw e;
            console.error('[Nyaa Preview] All APIs failed:', e);
            return null;
        }
    }

    // =============== 8. SYNOPSIS TOGGLE ===============
    function setupSynopsisToggle() {
        document.addEventListener('keydown', (e) => {
            if (!CONFIG.showSynopsisPanel) return;
            const settingsOpen = document.getElementById('nv-settings') !== null;
            if (settingsOpen) return;

            if (e.key === 'Shift' && !e.repeat &&
                document.activeElement.tagName !== 'INPUT' &&
                document.activeElement.tagName !== 'TEXTAREA') {
                isSynopsisVisible = !isSynopsisVisible;
                CONFIG.synopsisVisible = isSynopsisVisible;
                saveConfig();

                const panel = document.querySelector('.nv-description-panel');
                if (panel) {
                    panel.classList.toggle('nv-visible', isSynopsisVisible);
                }
            }
        });
    }

    // =============== 9. MAIN LOGIC ===============
    function init() {
        injectGlobalStyles();
        createTooltip();
        createContextMenu();
        createSearchModal();
        setupSynopsisToggle();
        applyBodyClasses();
        cleanCache();

        const rows = document.querySelectorAll('tr');
        const linkMap = new Map();

        rows.forEach(row => {
            const link = row.querySelector('td:nth-child(2) > a:not(.comments)');
            if (!link) return;

            const category = detectCategory(row);
            const clean = extractAnimeTitle(link.textContent);

            link.classList.add('nv-link');
            link.dataset.category = category;
            link.dataset.cleanTitle = clean || '';

            if (['audio', 'live', 'software', 'pictures'].includes(category)) {
                injectCategoryIcon(link, category);
                link.classList.add('nv-no-search');
                return;
            }

            if (!clean) return;

            if (!linkMap.has(clean)) linkMap.set(clean, { elements: [], category });
            linkMap.get(clean).elements.push(link);

            if (cache[clean] && cache[clean].results && cache[clean].results.length > 0) {
                const idx = cache[clean].selectedIndex || 0;
                const result = cache[clean].results[idx];
                injectToLink(link, result, cache[clean], clean);
            } else if (cache[clean] && cache[clean].hidden) {
                return;
            } else if (cache[clean] && cache[clean].notFound) {
                return;
            } else if (!cache[clean]) {
                injectSkeleton(link);
            }
        });

        linkMap.forEach((data, title) => {
            if (!cache.hasOwnProperty(title)) {
                requestQueue.push({ title, elements: data.elements, category: data.category });
            }
        });

        if (!isProcessing && CONFIG.enabled) processQueue();

        document.addEventListener('click', () => hideContextMenu());
        document.addEventListener('contextmenu', handleContextMenu);

        GM_registerMenuCommand("⚙️ Settings", createSettingsUI);
    }

    function injectSkeleton(link) {
        if (link.querySelector('.nv-skeleton')) return;
        const skeleton = document.createElement('span');
        skeleton.className = 'nv-skeleton';
        link.prepend(skeleton);
    }

    function removeSkeleton(link) {
        const skeleton = link.querySelector('.nv-skeleton');
        if (skeleton) skeleton.remove();
    }

    function injectCategoryIcon(link, category) {
        if (link.querySelector('.nv-category-icon')) return;
        const icon = document.createElement('span');
        icon.className = 'nv-category-icon';
        icon.textContent = CATEGORY_ICONS[category] || '📁';
        icon.title = category.charAt(0).toUpperCase() + category.slice(1);
        link.prepend(icon);
    }

    async function processQueue() {
        if (requestQueue.length === 0 || !CONFIG.enabled) {
            isProcessing = false;
            return;
        }
        isProcessing = true;

        const { title, elements, category } = requestQueue.shift();

        if (cache.hasOwnProperty(title)) {
            if (cache[title].results?.length > 0) {
                const idx = cache[title].selectedIndex || 0;
                elements.forEach(el => {
                    removeSkeleton(el);
                    injectToLink(el, cache[title].results[idx], cache[title], title);
                });
            } else {
                elements.forEach(el => removeSkeleton(el));
            }
            setTimeout(processQueue, 50);
            return;
        }

        try {
            const type = category === 'manga' ? 'manga' : 'anime';
            const results = await searchWithFallback(title, type);

            if (results && results.length > 0) {
                // Use first result (API already sorts by relevance) - like v10.9
                const firstResult = results[0];
                const matchScore = scoreResult(firstResult, title);

                cache[title] = {
                    results: results,
                    selectedIndex: 0,  // Always use first result
                    matchScore: matchScore,
                    timestamp: Date.now(),
                    searchType: type
                };
                saveCache();

                elements.forEach(el => {
                    removeSkeleton(el);
                    injectToLink(el, firstResult, cache[title], title);
                });
            } else {
                cache[title] = { notFound: true, timestamp: Date.now() };
                saveCache();
                elements.forEach(el => removeSkeleton(el));
            }
        } catch (e) {
            if (e.message === 'RATE_LIMITED') {
                requestQueue.unshift({ title, elements, category });
                console.warn('[Nyaa Preview] Rate limited, waiting...');
                setTimeout(processQueue, 3000);
                return;
            }
            console.error('[Nyaa Preview] API Error:', e);
            elements.forEach(el => removeSkeleton(el));
        }

        setTimeout(processQueue, 700);
    }

    function injectToLink(link, result, cacheEntry, searchTitle) {
        if (!result || !result.imageUrl) return;

        removeSkeleton(link);

        // Calculate score for display purposes
        const matchScore = cacheEntry?.matchScore ?? scoreResult(result, searchTitle || link.dataset.cleanTitle);
        const confidence = getConfidenceLevel(matchScore);

        link.dataset.previewUrl = result.imageUrl;
        link.dataset.malTitle = result.malTitle || '';
        link.dataset.score = result.score || '';
        link.dataset.year = result.year || '';
        link.dataset.episodes = result.episodes || '';
        link.dataset.type = result.type || '';
        link.dataset.status = result.status || '';
        link.dataset.synopsis = result.synopsis || '';
        link.dataset.hasAlternatives = (cacheEntry?.results?.length > 1) ? 'true' : 'false';
        link.dataset.matchScore = matchScore.toFixed(2);
        link.dataset.confidence = confidence;

        let img = link.querySelector('.nv-img');
        if (!img) {
            img = document.createElement('img');
            img.className = 'nv-img';
            img.referrerPolicy = "no-referrer";
            link.prepend(img);
        }

        // Apply low confidence class based on setting
        img.classList.toggle('nv-low-confidence', confidence === 'low');

        img.src = result.imageUrl;
        img.title = result.malTitle || '';
        img.onload = () => img.classList.add('nv-loaded');

        link.removeEventListener('mouseenter', onEnter);
        link.removeEventListener('mousemove', onMove);
        link.removeEventListener('mouseleave', onLeave);

        link.addEventListener('mouseenter', onEnter);
        link.addEventListener('mousemove', onMove);
        link.addEventListener('mouseleave', onLeave);
    }

    // =============== 10. TOOLTIP ===============
    function createTooltip() {
        tooltip = document.createElement('div');
        tooltip.id = 'nv-tooltip';
        document.body.appendChild(tooltip);
    }

    function sanitizeSynopsis(text) {
        if (!text) return null;
        let cleaned = text.replace(/<br\s*\/?>/gi, '\n')
                         .replace(/<[^>]+>/g, '')
                         .replace(/&nbsp;/g, ' ')
                         .replace(/&amp;/g, '&')
                         .replace(/&lt;/g, '<')
                         .replace(/&gt;/g, '>')
                         .replace(/&quot;/g, '"')
                         .replace(/&#39;/g, "'");
        if (cleaned.length > 500) {
            cleaned = cleaned.substring(0, 500) + '...';
        }
        return cleaned;
    }

    function onEnter(e) {
        if (!CONFIG.enabled) return;
        if (CONFIG.mode === 'inline') return;

        const target = e.currentTarget;
        const url = target.dataset.previewUrl;
        const malTitle = target.dataset.malTitle;
        if (!url) return;

        const synopsis = sanitizeSynopsis(target.dataset.synopsis);
        const hasSynopsis = synopsis && synopsis.trim().length > 0;
        const matchScore = parseFloat(target.dataset.matchScore) || 0;
        const confidence = target.dataset.confidence || 'medium';
        const hasAlternatives = target.dataset.hasAlternatives === 'true';

        let html = `<div class="nv-tooltip-main">`;
        html += `<img class="nv-tooltip-img" src="${url}" referrerpolicy="no-referrer">`;
        html += `<div class="nv-tooltip-content">`;
        html += `<div class="nv-tooltip-title">${malTitle || 'Unknown'}</div>`;

        if (CONFIG.showMetadata) {
            html += `<div class="nv-tooltip-meta">`;

            if (target.dataset.score) {
                html += `<span class="nv-meta-item"><span class="nv-meta-score">★ ${target.dataset.score}</span></span>`;
            }
            if (target.dataset.year) {
                html += `<span class="nv-meta-item">📅 ${target.dataset.year}</span>`;
            }
            if (target.dataset.episodes) {
                html += `<span class="nv-meta-item">📺 ${target.dataset.episodes} eps</span>`;
            }
            if (target.dataset.type) {
                html += `<span class="nv-meta-item nv-meta-type">${target.dataset.type}</span>`;
            }

            const confidenceLabel = confidence === 'high' ? '✓ Good match' :
                                   confidence === 'medium' ? '~ Likely' : '? Uncertain';
            html += `<span class="nv-meta-item nv-meta-confidence ${confidence}">${confidenceLabel}</span>`;

            html += `</div>`;
        }

        if (hasAlternatives && confidence !== 'high') {
            html += `<div class="nv-shift-hint">💡 Right-click for alternatives</div>`;
        } else if (CONFIG.showSynopsisPanel) {
            html += `<div class="nv-shift-hint">⇧ Shift to toggle synopsis</div>`;
        }

        html += `</div>`;
        html += `</div>`;

        if (CONFIG.showSynopsisPanel) {
            html += `<div class="nv-description-panel ${isSynopsisVisible ? 'nv-visible' : ''}">`;
            html += `<h4>📖 Synopsis</h4>`;

            if (hasSynopsis) {
                html += `<div class="nv-synopsis-text">${synopsis.replace(/\n/g, '<br>')}</div>`;
            } else {
                html += `<div class="nv-synopsis-text nv-no-synopsis">No synopsis available.</div>`;
                html += `<div class="nv-synopsis-tip"><strong>Tip:</strong> Right-click → "Re-fetch from API" to load synopsis.</div>`;
            }

            html += `</div>`;
        }

        tooltip.innerHTML = html;
        tooltip.style.display = 'block';
        updateTooltipPos(e.clientX, e.clientY);
    }

    function onMove(e) {
        if (CONFIG.mode === 'inline') return;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => updateTooltipPos(e.clientX, e.clientY));
    }

    function onLeave() {
        if (rafId) cancelAnimationFrame(rafId);
        tooltip.style.display = 'none';
    }

    function updateTooltipPos(x, y) {
        const offset = 20;
        let left = x + offset;
        let top = y + offset;
        const tooltipWidth = 220;
        const panelWidth = (CONFIG.showSynopsisPanel && isSynopsisVisible) ? 290 : 0;
        const totalWidth = tooltipWidth + panelWidth;
        const h = tooltip.offsetHeight || 400;

        if (left + totalWidth > window.innerWidth) {
            left = x - totalWidth - offset;
        }
        if (top + h > window.innerHeight) top = y - h - offset;

        tooltip.style.left = Math.max(10, left) + 'px';
        tooltip.style.top = Math.max(10, top) + 'px';
    }

    // =============== 11. CONTEXT MENU ===============
    function createContextMenu() {
        contextMenu = document.createElement('div');
        contextMenu.id = 'nv-context-menu';
        contextMenu.innerHTML = `
            <div class="nv-menu-item" data-action="search">
                <span class="nv-menu-icon">🔍</span>
                <span>Search & Select Image</span>
            </div>
            <div class="nv-menu-divider"></div>
            <div class="nv-menu-item" data-action="refetch">
                <span class="nv-menu-icon">🔃</span>
                <span>Re-fetch from API</span>
            </div>
            <div class="nv-menu-item" data-action="remove">
                <span class="nv-menu-icon">❌</span>
                <span>Remove Image</span>
            </div>
        `;
        document.body.appendChild(contextMenu);
        contextMenu.addEventListener('click', handleMenuAction);
    }

    function handleContextMenu(e) {
        const link = e.target.closest('.nv-link');
        if (!link) return;
        if (link.classList.contains('nv-no-search')) return;

        e.preventDefault();
        currentContextTarget = link;

        let left = e.clientX;
        let top = e.clientY;

        contextMenu.style.display = 'block';

        const menuRect = contextMenu.getBoundingClientRect();
        if (left + menuRect.width > window.innerWidth) {
            left = window.innerWidth - menuRect.width - 10;
        }
        if (top + menuRect.height > window.innerHeight) {
            top = window.innerHeight - menuRect.height - 10;
        }

        contextMenu.style.left = left + 'px';
        contextMenu.style.top = top + 'px';
    }

    function hideContextMenu() {
        contextMenu.style.display = 'none';
    }

    function handleMenuAction(e) {
        const item = e.target.closest('.nv-menu-item');
        if (!item || item.classList.contains('nv-disabled')) return;

        const action = item.dataset.action;
        const link = currentContextTarget;
        if (!link) return;

        const title = link.dataset.cleanTitle;
        hideContextMenu();

        switch (action) {
            case 'search':
                showSearchModal(title);
                break;
            case 'refetch':
                refetchFromAPI(title);
                break;
            case 'remove':
                removeImage(title);
                break;
        }
    }

    function removeImage(title) {
        cache[title] = { hidden: true, timestamp: Date.now() };
        saveCache();

        document.querySelectorAll('.nv-link').forEach(link => {
            if (link.dataset.cleanTitle === title) {
                const img = link.querySelector('.nv-img');
                if (img) img.remove();
                link.removeAttribute('data-preview-url');
            }
        });
    }

    async function refetchFromAPI(title) {
        delete cache[title];
        saveCache();

        const links = [];
        document.querySelectorAll('.nv-link').forEach(link => {
            if (link.dataset.cleanTitle === title) {
                const img = link.querySelector('.nv-img');
                if (img) img.remove();
                injectSkeleton(link);
                links.push(link);
            }
        });

        if (links.length > 0) {
            const category = links[0].dataset.category;
            requestQueue.unshift({ title, elements: links, category });
            if (!isProcessing) processQueue();
        }
    }

    // =============== 12. SEARCH MODAL (with similarity scores for manual selection) ===============
    let searchModal = null;
    let currentSearchTitle = null;
    let currentSearchResults = [];

    function createSearchModal() {
        searchModal = document.createElement('div');
        searchModal.id = 'nv-search-modal';
        searchModal.innerHTML = `
            <div class="nv-modal-content">
                <div class="nv-modal-header">
                    <div class="nv-modal-title">🔍 Search & Select Image</div>
                    <button class="nv-modal-close">&times;</button>
                </div>
                <div class="nv-search-bar">
                    <input type="text" class="nv-search-input" placeholder="Enter anime/manga title to search...">
                    <button class="nv-search-btn">Search</button>
                </div>
                <div class="nv-info-bar">
                    <span class="nv-info-item" id="nv-detected-title"></span>
                </div>
                <div class="nv-results-container">
                    <div class="nv-results-grid"></div>
                </div>
            </div>
        `;
        document.body.appendChild(searchModal);

        const closeBtn = searchModal.querySelector('.nv-modal-close');
        const searchInput = searchModal.querySelector('.nv-search-input');
        const searchBtn = searchModal.querySelector('.nv-search-btn');

        closeBtn.addEventListener('click', () => hideSearchModal());
        searchModal.addEventListener('click', e => {
            if (e.target === searchModal) hideSearchModal();
        });

        searchBtn.addEventListener('click', () => performSearch());
        searchInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') performSearch();
        });
    }

    function showSearchModal(originalTitle) {
        currentSearchTitle = originalTitle;
        const searchInput = searchModal.querySelector('.nv-search-input');
        const infoBar = searchModal.querySelector('#nv-detected-title');
        const grid = searchModal.querySelector('.nv-results-grid');

        searchInput.value = originalTitle;
        infoBar.innerHTML = `<strong>Detected:</strong> ${originalTitle}`;

        if (cache[originalTitle]?.results?.length > 0) {
            currentSearchResults = cache[originalTitle].results;
            const selectedIdx = cache[originalTitle].selectedIndex || 0;
            renderResults(currentSearchResults, selectedIdx, originalTitle);
        } else {
            grid.innerHTML = `
                <div class="nv-no-results" style="grid-column: 1/-1;">
                    <p>Enter a search term and click Search to find images.</p>
                    <p style="font-size: 12px; margin-top: 8px;">Or the detected title will be used for automatic search.</p>
                </div>
            `;
        }

        searchModal.style.display = 'flex';
        searchInput.focus();
        searchInput.select();
    }

    function hideSearchModal() {
        searchModal.style.display = 'none';
        currentSearchTitle = null;
        currentSearchResults = [];
    }

    async function performSearch() {
        const searchInput = searchModal.querySelector('.nv-search-input');
        const searchBtn = searchModal.querySelector('.nv-search-btn');
        const grid = searchModal.querySelector('.nv-results-grid');

        const query = searchInput.value.trim();
        if (!query) return;

        searchBtn.disabled = true;
        searchBtn.textContent = 'Searching...';

        grid.innerHTML = `
            <div class="nv-loading" style="grid-column: 1/-1;">
                <div class="nv-spinner"></div>
                <div>Searching for "${query}"...</div>
            </div>
        `;

        try {
            const firstLink = document.querySelector(`.nv-link[data-clean-title="${CSS.escape(currentSearchTitle)}"]`);
            const category = firstLink?.dataset.category || 'anime';
            const type = category === 'manga' ? 'manga' : 'anime';

            const results = await searchWithFallback(query, type);

            if (results && results.length > 0) {
                currentSearchResults = results;
                renderResults(results, -1, currentSearchTitle);
            } else {
                currentSearchResults = [];
                grid.innerHTML = `
                    <div class="nv-no-results" style="grid-column: 1/-1;">
                        <p>😕 No results found for "${query}"</p>
                        <p style="font-size: 12px; margin-top: 8px;">Try a different search term or check the spelling.</p>
                    </div>
                `;
            }
        } catch (e) {
            console.error('[Nyaa Preview] Search error:', e);
            grid.innerHTML = `
                <div class="nv-no-results" style="grid-column: 1/-1;">
                    <p>❌ Search failed</p>
                    <p style="font-size: 12px; margin-top: 8px;">${e.message === 'RATE_LIMITED' ? 'Rate limited. Please wait.' : 'An error occurred.'}</p>
                </div>
            `;
        }

        searchBtn.disabled = false;
        searchBtn.textContent = 'Search';
    }

    function renderResults(results, selectedIndex, searchTitle) {
        const grid = searchModal.querySelector('.nv-results-grid');

        // Show results in original API order, but with similarity scores for reference
        grid.innerHTML = results.map((result, index) => {
            const score = scoreResult(result, searchTitle || currentSearchTitle);
            const confidence = getConfidenceLevel(score);
            const scorePercent = Math.round(score * 100);

            return `
                <div class="nv-result-item ${index === selectedIndex ? 'selected' : ''}" data-index="${index}">
                    <span class="nv-result-rank">#${index + 1}</span>
                    <span class="nv-result-score ${confidence}">${scorePercent}%</span>
                    <img src="${result.imageUrl}" referrerpolicy="no-referrer" loading="lazy" alt="${result.malTitle || ''}">
                    <div class="nv-result-info">
                        <div class="nv-result-title" title="${result.malTitle || 'Unknown'}">${result.malTitle || 'Unknown'}</div>
                        <div class="nv-result-meta">
                            ${result.year ? result.year : ''}
                            ${result.score ? ' • ★' + result.score : ''}
                            ${result.type ? ' • ' + result.type : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.nv-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.dataset.index);
                selectResult(idx);
            });
        });
    }

    function selectResult(idx) {
        if (!currentSearchTitle || !currentSearchResults[idx]) return;

        const result = currentSearchResults[idx];
        const score = scoreResult(result, currentSearchTitle);

        cache[currentSearchTitle] = {
            results: currentSearchResults,
            selectedIndex: idx,
            matchScore: score,
            timestamp: Date.now(),
            searchType: cache[currentSearchTitle]?.searchType || 'anime'
        };
        saveCache();

        document.querySelectorAll('.nv-link').forEach(link => {
            if (link.dataset.cleanTitle === currentSearchTitle) {
                injectToLink(link, result, cache[currentSearchTitle], currentSearchTitle);
            }
        });

        hideSearchModal();
    }

    // =============== 13. UI HELPERS ===============
    function applyBodyClasses() {
        const body = document.body;
        body.classList.remove('nv-disabled', 'nv-mode-inline', 'nv-mode-hover', 'nv-mode-hybrid', 'nv-square', 'nv-zoom', 'nv-show-confidence');
        if (!CONFIG.enabled) { body.classList.add('nv-disabled'); return; }
        body.classList.add(`nv-mode-${CONFIG.mode}`);
        if (CONFIG.square) body.classList.add('nv-square');
        if (CONFIG.zoom && CONFIG.mode !== 'hover') body.classList.add('nv-zoom');
        if (CONFIG.showConfidenceBorder) body.classList.add('nv-show-confidence');

        const iconWidth = Math.round(CONFIG.size * COVER_ASPECT_RATIO);
        document.documentElement.style.setProperty('--nv-size', CONFIG.size + 'px');
        document.documentElement.style.setProperty('--nv-icon-width', iconWidth + 'px');
    }

    function cleanCache() {
        const now = Date.now();
        const exp = CONFIG.cacheExpiry * 86400000;
        let dirty = false;

        Object.keys(cache).forEach(k => {
            if (!cache[k].timestamp || now - cache[k].timestamp > exp) {
                delete cache[k];
                dirty = true;
            }
        });

        if (dirty) saveCache();
    }

    // =============== 14. SETTINGS UI ===============
    function createSettingsUI() {
        if (document.getElementById('nv-settings')) return;

        const panel = document.createElement('div');
        panel.id = 'nv-settings';

        panel.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(128,128,128,0.3); padding-bottom:12px; margin-bottom:15px;">
                <h2 style="margin:0; font-size:18px;">🖼️ Visual Enhanced Pro</h2>
                <span style="font-size:10px; opacity:0.6;">v4.7/span>
            </div>

            <div class="nv-row"><label for="nv-enable">Enable Script</label><input type="checkbox" id="nv-enable"></div>

            <div class="nv-stats" id="nv-stats">Loading stats...</div>

            <div class="nv-row">
                <label>Display Mode</label>
                <select id="nv-mode">
                    <option value="inline">Inline Image</option>
                    <option value="hover">Hover Icon</option>
                    <option value="hybrid">Inline + Hover</option>
                </select>
            </div>

            <div class="nv-row">
                <label>Size: <span id="nv-size-val">${CONFIG.size}px</span></label>
                <input type="range" id="nv-size" min="30" max="150" step="5" value="${CONFIG.size}">
            </div>

            <div class="nv-row">
                <label>Cache Expiry (days)</label>
                <input type="number" id="nv-cache-expiry" min="1" max="90" value="${CONFIG.cacheExpiry}">
            </div>

            <div class="nv-row"><label for="nv-square">Square Ratio</label><input type="checkbox" id="nv-square"></div>
            <div class="nv-row"><label for="nv-zoom">Hover Zoom</label><input type="checkbox" id="nv-zoom"></div>
            <div class="nv-row"><label for="nv-metadata">Show Metadata</label><input type="checkbox" id="nv-metadata"></div>
            <div class="nv-row">
                <label for="nv-synopsis">
                    Synopsis Panel
                    <span class="nv-hint">(⇧ toggle)</span>
                </label>
                <input type="checkbox" id="nv-synopsis">
            </div>
            <div class="nv-row">
                <label for="nv-confidence">
                    Confidence Border
                    <span class="nv-hint">(orange)</span>
                </label>
                <input type="checkbox" id="nv-confidence">
            </div>
            <div class="nv-row"><label for="nv-trans">Transparent UI</label><input type="checkbox" id="nv-trans"></div>

            <div class="nv-actions">
                <button class="nv-btn" id="nv-close">Done</button>
                <button class="nv-btn" id="nv-clear" style="background:#d32f2f; color:#fff;">Clear Cache</button>
            </div>

            <div style="margin-top:15px; padding-top:12px; border-top:1px solid rgba(128,128,128,0.2); font-size:11px; opacity:0.6; text-align:center;">
                💡 Right-click images for alternatives<br>
                🎯 Orange border = uncertain match
            </div>
        `;
        document.body.appendChild(panel);

        const els = {
            enable: document.getElementById('nv-enable'),
            mode: document.getElementById('nv-mode'),
            size: document.getElementById('nv-size'),
            sizeTxt: document.getElementById('nv-size-val'),
            square: document.getElementById('nv-square'),
            zoom: document.getElementById('nv-zoom'),
            metadata: document.getElementById('nv-metadata'),
            synopsis: document.getElementById('nv-synopsis'),
            confidence: document.getElementById('nv-confidence'),
            trans: document.getElementById('nv-trans'),
            cacheExpiry: document.getElementById('nv-cache-expiry'),
            stats: document.getElementById('nv-stats')
        };

        els.enable.checked = CONFIG.enabled;
        els.mode.value = CONFIG.mode;
        els.square.checked = CONFIG.square;
        els.zoom.checked = CONFIG.zoom;
        els.metadata.checked = CONFIG.showMetadata;
        els.synopsis.checked = CONFIG.showSynopsisPanel;
        els.confidence.checked = CONFIG.showConfidenceBorder;
        els.trans.checked = CONFIG.transparent;
        els.cacheExpiry.value = CONFIG.cacheExpiry;

        const applyTheme = () => {
            const t = getTheme();
            panel.style.background = t.bg;
            panel.style.color = t.text;
            panel.style.border = `1px solid ${t.border}`;
            panel.style.boxShadow = `0 10px 40px ${t.shadow}`;

            panel.querySelectorAll('.nv-btn:not(#nv-clear)').forEach(b => {
                b.style.background = t.btn;
                b.style.color = t.btnTxt;
            });
        };
        applyTheme();

        const updateStats = () => {
            const count = Object.keys(cache).length;
            const withImages = Object.values(cache).filter(e => e.results?.length > 0).length;
            const highConf = Object.values(cache).filter(e => (e.matchScore || 0) >= 0.7).length;
            const lowConf = Object.values(cache).filter(e => e.results?.length > 0 && (e.matchScore || 0) < 0.4).length;
            const notFound = Object.values(cache).filter(e => e.notFound).length;
            const hidden = Object.values(cache).filter(e => e.hidden).length;
            const kb = (JSON.stringify(cache).length / 1024).toFixed(1);

            els.stats.innerHTML = `
                <strong>Cache:</strong> ${count} items (~${kb} KB)<br>
                <span style="font-size:11px;">
                    ✅ ${withImages} found (🎯 ${highConf} confident, ⚠ ${lowConf} uncertain)<br>
                    ❌ ${notFound} not found | 👁️ ${hidden} hidden
                </span>
            `;
        };
        updateStats();

        els.enable.addEventListener('change', e => { CONFIG.enabled = e.target.checked; saveConfig(); applyBodyClasses(); });
        els.mode.addEventListener('change', e => { CONFIG.mode = e.target.value; saveConfig(); applyBodyClasses(); });
        els.square.addEventListener('change', e => { CONFIG.square = e.target.checked; saveConfig(); applyBodyClasses(); });
        els.zoom.addEventListener('change', e => { CONFIG.zoom = e.target.checked; saveConfig(); applyBodyClasses(); });
        els.metadata.addEventListener('change', e => { CONFIG.showMetadata = e.target.checked; saveConfig(); });
        els.synopsis.addEventListener('change', e => { CONFIG.showSynopsisPanel = e.target.checked; saveConfig(); });
        els.confidence.addEventListener('change', e => { CONFIG.showConfidenceBorder = e.target.checked; saveConfig(); applyBodyClasses(); });
        els.cacheExpiry.addEventListener('change', e => { CONFIG.cacheExpiry = parseInt(e.target.value) || 14; saveConfig(); });

        els.trans.addEventListener('change', e => {
            CONFIG.transparent = e.target.checked;
            saveConfig();
            applyTheme();
        });

        els.size.addEventListener('input', e => {
            const val = e.target.value;
            els.sizeTxt.innerText = val + 'px';
            if (sliderRaf) cancelAnimationFrame(sliderRaf);
            sliderRaf = requestAnimationFrame(() => {
                const iconWidth = Math.round(parseInt(val) * COVER_ASPECT_RATIO);
                document.documentElement.style.setProperty('--nv-size', val + 'px');
                document.documentElement.style.setProperty('--nv-icon-width', iconWidth + 'px');
            });
        });

        els.size.addEventListener('change', e => {
            CONFIG.size = parseInt(e.target.value);
            saveConfig();
        });

        document.getElementById('nv-close').addEventListener('click', () => panel.remove());
        document.getElementById('nv-clear').addEventListener('click', () => {
            if (confirm("Delete all cached data? This will remove all saved images and preferences.")) {
                cache = {};
                saveCache();
                updateStats();
                location.reload();
            }
        });
    }

    init();
})();