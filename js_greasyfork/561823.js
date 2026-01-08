// ==UserScript==
// @name         Nyaa Visual Enhanced (Glass Edition Pro)
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Universal Nyaa previews with unified search, AniList fallback, metadata tooltips, and improved title parsing.
// @author       de.bobo0
// @match        https://nyaa.si/*
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
        size: 60,
        square: false,
        zoom: true,
        transparent: true,
        cacheExpiry: 14,
        showMetadata: true
    };

    let CONFIG = { ...DEFAULT_CONFIG, ...GM_getValue('nyaa_cfg_v10', {}) };
    let cache = GM_getValue('nyaa_universal_cache_v4', {});
    let requestQueue = [];
    let isProcessing = false;
    let tooltip = null;
    let contextMenu = null;
    let rafId = null;
    let sliderRaf = null;
    let currentContextTarget = null;

    const COVER_ASPECT_RATIO = 0.7; // width/height ratio for anime covers (roughly 2:3)

    const saveConfig = () => GM_setValue('nyaa_cfg_v10', CONFIG);
    const saveCache = () => GM_setValue('nyaa_universal_cache_v4', cache);

    // Category mappings
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

    // =============== 2. STYLES ===============
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

            /* --- Shimmer Loading Skeleton --- */
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

            /* --- Inline Images --- */
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

            .nv-img.nv-loaded {
                opacity: 1;
            }

            /* --- Category Icons --- */
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

            /* --- Modes --- */
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

            /* --- Features --- */
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

            /* --- Tooltip --- */
            #nv-tooltip {
                position: fixed; display: none; z-index: 99999; pointer-events: none;
                box-shadow: 0 10px 30px rgba(0,0,0,0.7);
                border-radius: 8px; overflow: hidden;
                background: #121212; border: 1px solid #444;
                width: 220px; line-height: 0;
            }
            #nv-tooltip img { width: 100%; height: auto; display: block; }
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
            #nv-tooltip .nv-meta-score {
                color: #ffc107;
                font-weight: bold;
            }
            #nv-tooltip .nv-meta-type {
                background: rgba(255,255,255,0.1);
                padding: 2px 6px;
                border-radius: 4px;
            }

            /* --- Context Menu --- */
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
            #nv-context-menu .nv-menu-item:hover {
                background: rgba(255,255,255,0.1);
            }
            #nv-context-menu .nv-menu-item.nv-disabled {
                opacity: 0.4;
                pointer-events: none;
            }
            #nv-context-menu .nv-menu-divider {
                height: 1px;
                background: rgba(255,255,255,0.1);
                margin: 6px 0;
            }
            #nv-context-menu .nv-menu-icon {
                width: 18px;
                text-align: center;
            }

            /* --- Unified Search Modal --- */
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
            #nv-search-modal .nv-modal-title {
                font-size: 18px;
                font-weight: bold;
                color: #fff;
            }
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
            #nv-search-modal .nv-modal-close:hover {
                background: rgba(255,255,255,0.2);
            }
            #nv-search-modal .nv-search-bar {
                display: flex;
                gap: 10px;
                margin-bottom: 16px;
            }
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
            #nv-search-modal .nv-search-input:focus {
                border-color: rgba(255,255,255,0.4);
            }
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
            #nv-search-modal .nv-search-btn:hover {
                background: #45a049;
            }
            #nv-search-modal .nv-search-btn:disabled {
                background: #555;
                cursor: not-allowed;
            }
            #nv-search-modal .nv-results-container {
                flex: 1;
                overflow-y: auto;
                padding-right: 8px;
            }
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
            }
            #nv-search-modal .nv-result-item:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 20px rgba(0,0,0,0.4);
            }
            #nv-search-modal .nv-result-item.selected {
                border-color: #4CAF50;
            }
            #nv-search-modal .nv-result-item img {
                width: 100%;
                height: 200px;
                object-fit: cover;
                display: block;
            }
            #nv-search-modal .nv-result-info {
                padding: 10px;
                color: #fff;
            }
            #nv-search-modal .nv-result-title {
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            #nv-search-modal .nv-result-meta {
                font-size: 11px;
                color: #aaa;
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
            @keyframes nv-spin {
                to { transform: rotate(360deg); }
            }
            #nv-search-modal .nv-no-results {
                text-align: center;
                padding: 60px;
                color: #888;
            }
            #nv-search-modal .nv-info-bar {
                display: flex;
                gap: 16px;
                margin-bottom: 12px;
                font-size: 12px;
                color: #888;
            }
            #nv-search-modal .nv-info-item {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            /* --- Settings Panel --- */
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

    // =============== 3. THEME ENGINE ===============
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

   // =============== 4. ENHANCED TITLE EXTRACTION ===============
function extractAnimeTitle(rawText) {
    let title = rawText.trim();

    // Remove file extension
    title = title.replace(/\.(mkv|mp4|avi|webm|ass|srt|rar|zip|7z)$/i, '');

    // === Pattern 1: Fansub format with title in second bracket ===
    // [Group][Japanese Title/Romaji Title][Quality][Episode][Subs]
    // e.g., [FLsnow][ひみつのアイプリ/Himitsu_no_Aipri][1080P][S2E39][CHS/CHT]
    const bracketTitleMatch = title.match(/^\[[^\]]+\]\s*\[([^\]]+)\]/);
    if (bracketTitleMatch) {
        const innerContent = bracketTitleMatch[1];

        // Skip if it's just metadata (quality, episode, language codes)
        const isMetadata = /^(?:\d+p?|S\d+E\d+|E\d+|EP\d+|CHS|CHT|ENG|JPN|BIG5|GB|WebRip|WEB-DL|HEVC|AVC|AAC|FLAC|v\d+|\d+)$/i.test(innerContent.trim());

        if (!isMetadata) {
            if (/[/／]/.test(innerContent)) {
                // Contains title separators (multi-language)
                const parts = innerContent.split(/[/／]/);
                // Prefer romanized/English version (usually after the slash)
                let extracted = (parts[1] || parts[0]).trim();
                extracted = extracted.replace(/_/g, ' ');
                if (extracted.length > 2) {
                    return extracted;
                }
            } else {
                // Single title in brackets
                const single = innerContent.replace(/_/g, ' ').trim();
                if (single.length > 2) {
                    return single;
                }
            }
        }
    }

    // === Pattern 2: Scene release format with year ===
    // Title.With.Dots.YEAR.Quality.rest
    // e.g., Last.Action.Hero.1993.VO.VFF.2160p.BluRay...
    const sceneWithYear = title.match(/^([A-Za-z0-9][A-Za-z0-9.\-']+?)\.(\d{4})\.(?:VO|VF|VOSTFR|MULTI|MULTi|FRENCH|GERMAN|ENGLISH|JAPANESE|1080p?|720p?|480p?|2160p?|BluRay|Blu-?ray|WEB|HDTV|BDRip|HDRip|DVDRip|REMUX|UHD|HDR|SDR|DTS|TrueHD|Atmos|DDP?|AC3|AAC|HEVC|AVC|H\.?26[45]|x26[45]|DoVi|Hybrid|COMPLETE|REPACK)/i);
    if (sceneWithYear && sceneWithYear[1]) {
        return sceneWithYear[1].replace(/\./g, ' ').trim();
    }

    // === Pattern 3: Remove group tags and handle dual-language titles ===
    // [Group] Chinese Title / Japanese Title - Episode [Quality]
    let cleaned = title.replace(/^[\[【][^\]】]+[\]】]\s*/g, '');
    cleaned = cleaned.replace(/^[\[【][^\]】]+[\]】]\s*/g, ''); // Remove second group if present

    // Remove parenthetical content at start
    cleaned = cleaned.replace(/^\([^)]+\)\s*/g, '');

    // Check for slash-separated titles (common for multi-language releases)
    if (/\s+[/／]\s+/.test(cleaned)) {
        const parts = cleaned.split(/\s+[/／]\s+/);
        if (parts.length >= 2) {
            // Process each part to remove episode numbers and quality tags
            let candidates = parts.map(p => {
                return p.replace(/\s*-\s*\d+(?:v\d+)?(?:\s.*)?$/i, '')
                        .replace(/\s*[\[\(].*$/, '')
                        .trim();
            });

            // Prefer part with Latin characters (romanized/English)
            for (const candidate of candidates) {
                if (/[a-zA-Z]{3,}/.test(candidate) && candidate.length > 2) {
                    return candidate;
                }
            }
            // Fall back to first non-empty candidate
            const validCandidate = candidates.find(c => c && c.length > 2);
            if (validCandidate) {
                return validCandidate;
            }
        }
    }

    // Continue with standard processing for other formats...
    title = cleaned;

    // Remove trailing parenthetical content (language tags etc)
    title = title.replace(/\s*\([^)]*\)\s*$/g, '');

    // Handle dot-separated filename format (common in scene releases)
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

    // Convert dots to spaces
    title = title.replace(/\./g, ' ');

    // Standard separator patterns for episode numbers etc
    const separators = [
        / - \d+(?:v\d+)?(?:\s|$)/i,
        / - \d+(?:~\d+)?(?:\s|$)/i,
        / - S\d+E\d+/i,
        / S\d+E\d+/i,
        / Episode \d+/i,
        / EP?\d+(?:v\d+)?(?:\s|$)/i,
        / - EP?\d+/i,
        / \d+(?:v\d+)?\s*[\[\(]/i,
        / \(\d{4}\)/,
        /\s*[\[\(][\w\d]+p[\]\)]/i,
        /\s*[\[\(](?:1080|720|480|2160)[pi]?[\]\)]/i,
        /\s*[\[\(](?:HEVC|H\.?26[45]|AV1|x26[45])[\]\)]/i,
        /\s*[\[\(](?:AAC|FLAC|Opus|AC3)[\]\)]/i,
        / Vol\.?\s*\d+/i,
        / Chapter\s*\d+/i,
        / Ch\.?\s*\d+/i,
    ];

    for (const sep of separators) {
        const match = title.search(sep);
        if (match > 0) {
            title = title.substring(0, match);
            break;
        }
    }

    // Clean remaining brackets and parentheses
    title = title.replace(/\s*[\[\(][^\]\)]*[\]\)]?\s*$/g, '').trim();
    title = title.replace(/\s*[\[\(][^\]\)]*[\]\)]?\s*$/g, '').trim();

    // Remove web source tags and quality indicators
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

    // Remove trailing special chars
    title = title.replace(/[_\-\.\s]+$/, '').trim();

    // Final cleanup - normalize whitespace
    title = title.replace(/\s+/g, ' ').trim();

    return title.length > 2 ? title : null;
}

    // =============== 5. CATEGORY DETECTION ===============
    function detectCategory(row) {
        const categoryCell = row.querySelector('td:first-child a');
        if (!categoryCell) return 'anime';

        const categoryTitle = categoryCell.getAttribute('title') || categoryCell.textContent.trim();
        return CATEGORY_TYPES[categoryTitle] || 'anime';
    }

    // =============== 6. API FUNCTIONS ===============
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
            score: item.score,
            year: item.year || (item.aired?.prop?.from?.year) || (item.published?.prop?.from?.year),
            episodes: item.episodes || item.chapters,
            type: item.type,
            status: item.status,
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
                        coverImage { large medium }
                        averageScore
                        seasonYear
                        episodes
                        chapters
                        format
                        status
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
            score: item.averageScore ? item.averageScore / 10 : null,
            year: item.seasonYear,
            episodes: item.episodes || item.chapters,
            type: item.format,
            status: item.status,
            source: 'anilist'
        }));
    }

    async function searchWithFallback(title, type = 'anime') {
        try {
            const jikanResult = await fetchFromJikan(title, type);
            if (jikanResult && jikanResult.length > 0) return jikanResult;
        } catch (e) {
            if (e.message === 'RATE_LIMITED') throw e;
            console.warn('[Nyaa Preview] Jikan failed, trying AniList...', e);
        }

        try {
            return await fetchFromAniList(title, type);
        } catch (e) {
            console.error('[Nyaa Preview] AniList also failed:', e);
            return null;
        }
    }

    // =============== 7. MAIN LOGIC ===============
    function init() {
        injectGlobalStyles();
        createTooltip();
        createContextMenu();
        createSearchModal();
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

            // Handle non-searchable categories
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
                injectToLink(link, result, cache[clean]);
            } else if (cache[clean] && cache[clean].hidden) {
                return;
            } else if (cache[clean] && cache[clean].notFound) {
                return;
            } else if (!cache[clean]) {
                injectSkeleton(link);
            }
        });

        // Queue uncached titles
        linkMap.forEach((data, title) => {
            if (!cache.hasOwnProperty(title)) {
                requestQueue.push({ title, elements: data.elements, category: data.category });
            }
        });

        if (!isProcessing && CONFIG.enabled) processQueue();

        // Close context menu on click elsewhere
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
                    injectToLink(el, cache[title].results[idx], cache[title]);
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
                cache[title] = {
                    results: results,
                    selectedIndex: 0,
                    timestamp: Date.now(),
                    searchType: type
                };
                saveCache();
                elements.forEach(el => {
                    removeSkeleton(el);
                    injectToLink(el, results[0], cache[title]);
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

    function injectToLink(link, result, cacheEntry) {
        if (!result || !result.imageUrl) return;

        removeSkeleton(link);

        link.dataset.previewUrl = result.imageUrl;
        link.dataset.malTitle = result.malTitle || '';
        link.dataset.score = result.score || '';
        link.dataset.year = result.year || '';
        link.dataset.episodes = result.episodes || '';
        link.dataset.type = result.type || '';
        link.dataset.status = result.status || '';
        link.dataset.hasAlternatives = (cacheEntry?.results?.length > 1) ? 'true' : 'false';

        let img = link.querySelector('.nv-img');
        if (!img) {
            img = document.createElement('img');
            img.className = 'nv-img';
            img.referrerPolicy = "no-referrer";
            link.prepend(img);
        }

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

    // =============== 8. TOOLTIP ===============
    function createTooltip() {
        tooltip = document.createElement('div');
        tooltip.id = 'nv-tooltip';
        document.body.appendChild(tooltip);
    }

    function onEnter(e) {
        if (!CONFIG.enabled) return;
        if (CONFIG.mode === 'inline') return;

        const target = e.currentTarget;
        const url = target.dataset.previewUrl;
        const malTitle = target.dataset.malTitle;
        if (!url) return;

        let html = `<img src="${url}" referrerpolicy="no-referrer">`;
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

            html += `</div>`;
        }

        html += `</div>`;

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
        const w = 280;
        const h = tooltip.offsetHeight || 400;

        if (left + w > window.innerWidth) left = x - w - offset;
        if (top + h > window.innerHeight) top = y - h - offset;

        tooltip.style.left = Math.max(10, left) + 'px';
        tooltip.style.top = Math.max(10, top) + 'px';
    }

    // =============== 9. CONTEXT MENU ===============
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

        // Position menu
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

    // =============== 10. UNIFIED SEARCH MODAL ===============
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

        // If we have cached results, show them
        if (cache[originalTitle]?.results?.length > 0) {
            currentSearchResults = cache[originalTitle].results;
            const selectedIdx = cache[originalTitle].selectedIndex || 0;
            renderResults(currentSearchResults, selectedIdx);
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
            // Get the category from the first matching link
            const firstLink = document.querySelector(`.nv-link[data-clean-title="${CSS.escape(currentSearchTitle)}"]`);
            const category = firstLink?.dataset.category || 'anime';
            const type = category === 'manga' ? 'manga' : 'anime';

            const results = await searchWithFallback(query, type);

            if (results && results.length > 0) {
                currentSearchResults = results;
                renderResults(results, -1); // No selection yet
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
                    <p style="font-size: 12px; margin-top: 8px;">${e.message === 'RATE_LIMITED' ? 'Rate limited. Please wait a moment.' : 'An error occurred.'}</p>
                </div>
            `;
        }

        searchBtn.disabled = false;
        searchBtn.textContent = 'Search';
    }

    function renderResults(results, selectedIndex) {
        const grid = searchModal.querySelector('.nv-results-grid');

        grid.innerHTML = results.map((result, idx) => `
            <div class="nv-result-item ${idx === selectedIndex ? 'selected' : ''}" data-index="${idx}">
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
        `).join('');

        // Add click handlers
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

        // Update cache
        cache[currentSearchTitle] = {
            results: currentSearchResults,
            selectedIndex: idx,
            timestamp: Date.now(),
            searchType: cache[currentSearchTitle]?.searchType || 'anime'
        };
        saveCache();

        // Update all matching links
        document.querySelectorAll('.nv-link').forEach(link => {
            if (link.dataset.cleanTitle === currentSearchTitle) {
                injectToLink(link, result, cache[currentSearchTitle]);
            }
        });

        hideSearchModal();
    }

    // =============== 11. UI HELPERS ===============
    function applyBodyClasses() {
        const body = document.body;
        body.classList.remove('nv-disabled', 'nv-mode-inline', 'nv-mode-hover', 'nv-mode-hybrid', 'nv-square', 'nv-zoom');
        if (!CONFIG.enabled) { body.classList.add('nv-disabled'); return; }
        body.classList.add(`nv-mode-${CONFIG.mode}`);
        if (CONFIG.square) body.classList.add('nv-square');
        if (CONFIG.zoom && CONFIG.mode !== 'hover') body.classList.add('nv-zoom');

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

    // =============== 12. SETTINGS UI ===============
    function createSettingsUI() {
        if (document.getElementById('nv-settings')) return;

        const panel = document.createElement('div');
        panel.id = 'nv-settings';

        panel.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(128,128,128,0.3); padding-bottom:12px; margin-bottom:15px;">
                <h2 style="margin:0; font-size:18px;">🖼️ Visual Enhanced Pro</h2>
                <span style="font-size:10px; opacity:0.6;">v4.1</span>
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
            <div class="nv-row"><label for="nv-trans">Transparent UI</label><input type="checkbox" id="nv-trans"></div>

            <div class="nv-actions">
                <button class="nv-btn" id="nv-close">Done</button>
                <button class="nv-btn" id="nv-clear" style="background:#d32f2f; color:#fff;">Clear Cache</button>
            </div>

            <div style="margin-top:15px; padding-top:12px; border-top:1px solid rgba(128,128,128,0.2); font-size:11px; opacity:0.6; text-align:center;">
                💡 Right-click on images to search & select alternatives
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
            trans: document.getElementById('nv-trans'),
            cacheExpiry: document.getElementById('nv-cache-expiry'),
            stats: document.getElementById('nv-stats')
        };

        // Sync State
        els.enable.checked = CONFIG.enabled;
        els.mode.value = CONFIG.mode;
        els.square.checked = CONFIG.square;
        els.zoom.checked = CONFIG.zoom;
        els.metadata.checked = CONFIG.showMetadata;
        els.trans.checked = CONFIG.transparent;
        els.cacheExpiry.value = CONFIG.cacheExpiry;

        // Apply Theme
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
            const notFound = Object.values(cache).filter(e => e.notFound).length;
            const hidden = Object.values(cache).filter(e => e.hidden).length;
            const kb = (JSON.stringify(cache).length / 1024).toFixed(1);
            els.stats.innerHTML = `
                <strong>Cache:</strong> ${count} items (~${kb} KB)<br>
                <span style="font-size:11px;">✅ ${withImages} found | ❌ ${notFound} not found | 👁️ ${hidden} hidden</span>
            `;
        };
        updateStats();

        // Event Listeners
        els.enable.addEventListener('change', e => { CONFIG.enabled = e.target.checked; saveConfig(); applyBodyClasses(); });
        els.mode.addEventListener('change', e => { CONFIG.mode = e.target.value; saveConfig(); applyBodyClasses(); });
        els.square.addEventListener('change', e => { CONFIG.square = e.target.checked; saveConfig(); applyBodyClasses(); });
        els.zoom.addEventListener('change', e => { CONFIG.zoom = e.target.checked; saveConfig(); applyBodyClasses(); });
        els.metadata.addEventListener('change', e => { CONFIG.showMetadata = e.target.checked; saveConfig(); });
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