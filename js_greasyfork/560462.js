// ==UserScript==
// @name         GeoGuessr Export Toolkit (GET)
// @version      1.4
// @namespace    https://github.com/asmodeo
// @icon         https://parmageo.vercel.app/gg.ico
// @description  Export GeoGuessr rounds to JSON or Map-Making.App with tags, auto-send to MMA, and Google Maps short URL generation.
// @author       Parma
// @match        *://*.geoguessr.com/*
// @license      MIT
// @connect      nominatim.openstreetmap.org
// @connect      flagcdn.com
// @connect      map-making.app
// @connect      www.google.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/560462/GeoGuessr%20Export%20Toolkit%20%28GET%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560462/GeoGuessr%20Export%20Toolkit%20%28GET%29.meta.js
// ==/UserScript==

// Inject icon button styles
(function () {
    if (!document.querySelector('#geoget-icon-styles')) {
        const style = document.createElement('style');
        style.id = 'geoget-icon-styles';
        style.textContent = `
            .geoget-btn-success path {
                fill: #10b981;
            }
            .geoget-btn-error path {
                fill: #ef4444;
            }
            .geoget-btn-loading path {
                fill: #3b82f6;
                animation: geoget-spin 1s linear infinite;
                transform-origin: center;
            }
            @keyframes geoget-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .geoget-pulse-success {
                animation: geoget-pulse-success 0.5s ease-in-out;
            }
            @keyframes geoget-pulse-success {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            .geoget-pulse-error {
                animation: geoget-pulse-error 0.5s ease-in-out;
            }
            @keyframes geoget-pulse-error {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            .geoget-sent-indicator {
                display: inline-flex;
                align-items: center;
                margin-left: 4px;
                font-size: 11px;
                color: #10b981;
                gap: 2px;
            }
        `;
        document.head.appendChild(style);
    }
})();

// Main script
(function () {
    'use strict';

    // ──────────────────────────────────────────────────────────────────────
    //  CONSTANTS & SETTINGS
    // ──────────────────────────────────────────────────────────────────────

    const PAGE_PATTERNS = {
        DUELS: /\/(?:team-)?duels\/[^\/]+\/summary/,
        BATTLE_ROYALE: /\/battle-royale\/[^\/]+\/summary/,
        RESULTS: /\/results\/[^\/]+/
    };

    const US_STATE_NAMES = {
        al: 'Alabama', ak: 'Alaska', az: 'Arizona', ar: 'Arkansas', ca: 'California', co: 'Colorado', ct: 'Connecticut', de: 'Delaware', fl: 'Florida', ga: 'Georgia',
        hi: 'Hawaii', id: 'Idaho', il: 'Illinois', in: 'Indiana', ia: 'Iowa', ks: 'Kansas', ky: 'Kentucky', la: 'Louisiana', me: 'Maine', md: 'Maryland',
        ma: 'Massachusetts', mi: 'Michigan', mn: 'Minnesota', ms: 'Mississippi', mo: 'Missouri', mt: 'Montana', ne: 'Nebraska', nv: 'Nevada', nh: 'New Hampshire', nj: 'New Jersey',
        nm: 'New Mexico', ny: 'New York', nc: 'North Carolina', nd: 'North Dakota', oh: 'Ohio', ok: 'Oklahoma', or: 'Oregon', pa: 'Pennsylvania', ri: 'Rhode Island', sc: 'South Carolina',
        sd: 'South Dakota', tn: 'Tennessee', tx: 'Texas', ut: 'Utah', vt: 'Vermont', va: 'Virginia', wa: 'Washington', wv: 'West Virginia', wi: 'Wisconsin', wy: 'Wyoming',
        dc: 'District of Columbia'
    };

    const USDC_FLAG = 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Washington%2C_D.C.svg';

    let tagSettings = {
        includeCountryCode: true,
        includeMapName: true,
        includeCustomTags: false,
        customTagsText: ''
    };

    let mmaSettings = {
        apiKey: null,
        selectedMapId: null,
        selectedMapName: null
    };

    let layoutExpanded = {
        mma: true,
        tags: true,
        rounds: true
    };

    let autoSendSettings = {
        all: false,
        duels: false,
        standard: false,
        battleRoyale: false
    };

    let submissionHistory = new Set();
    let widget = null;
    let observer = null;
    let isActive = false;
    let currentGameData = null;
    let currentGameId = null;
    let roundCheckboxes = [];
    let mmaMapsCache = null;
    let mmaMapsLoading = false;
    const countryCache = new Map();
    let saveCacheTimeout = null;
    let autoSendAttempted = false;

    // ──────────────────────────────────────────────────────────────────────
    //  UTILITY FUNCTIONS
    // ──────────────────────────────────────────────────────────────────────

    // Load settings from storage
    function loadSettings() {
        // Load Tag settings
        try {
            const tags = JSON.parse(localStorage.getItem('ggjsonexport_tag_settings'));
            if (tags && typeof tags === 'object') {
                tagSettings.includeCountryCode = !!tags.includeCountryCode;
                tagSettings.includeMapName = !!tags.includeMapName;
                tagSettings.includeCustomTags = !!tags.includeCustomTags;
                tagSettings.customTagsText = typeof tags.customTagsText === 'string' ? tags.customTagsText : '';
            }
        } catch (e) { /* ignore */ }

        // Load MMA Settings
        try {
            const mma = JSON.parse(localStorage.getItem('ggjsonexport_mma_settings'));
            if (mma && typeof mma === 'object') {
                mmaSettings.apiKey = mma.apiKey || null;
                mmaSettings.selectedMapId = mma.selectedMapId || null;
                mmaSettings.selectedMapName = mma.selectedMapName || null;
            }
        } catch (e) { /* ignore */ }

        // Load Layout Expanded Settings
        try {
            const layout = JSON.parse(localStorage.getItem('ggjsonexport_layout_expanded'));
            if (layout && typeof layout === 'object') {
                layoutExpanded.mma = layout.mma !== false;
                layoutExpanded.tags = layout.tags !== false;
                layoutExpanded.rounds = layout.rounds !== false;
            }
        } catch (e) { /* ignore */ }

        // Load Auto-Send Settings
        try {
            const autoSend = JSON.parse(localStorage.getItem('ggjsonexport_auto_send'));
            if (autoSend && typeof autoSend === 'object') {
                autoSendSettings.all = !!autoSend.all;
                autoSendSettings.duels = !!autoSend.duels;
                autoSendSettings.standard = !!autoSend.standard;
                autoSendSettings.battleRoyale = !!autoSend.battleRoyale;
            }
        } catch (e) { /* ignore */ }

        // Load Submission History
        try {
            const history = JSON.parse(localStorage.getItem('ggjsonexport_submission_history'));
            if (Array.isArray(history)) {
                submissionHistory = new Set(history);
            }
        } catch (e) { /* ignore */ }
    }

    // Save tag settings
    function saveTagSettings() {
        try {
            localStorage.setItem('ggjsonexport_tag_settings', JSON.stringify(tagSettings));
        } catch (e) { /* ignore */ }
    }

    // Save MMA settings
    function saveMmaSettings() {
        try {
            localStorage.setItem('ggjsonexport_mma_settings', JSON.stringify(mmaSettings));
        } catch (e) { /* ignore */ }
    }

    // Save layout expanded settings
    function saveLayoutExpanded() {
        try {
            localStorage.setItem('ggjsonexport_layout_expanded', JSON.stringify(layoutExpanded));
        } catch (e) { /* ignore */ }
    }

    // Save auto-send settings
    function saveAutoSendSettings() {
        try {
            localStorage.setItem('ggjsonexport_auto_send', JSON.stringify(autoSendSettings));
        } catch (e) { /* ignore */ }
    }

    // Save submission history
    function saveSubmissionHistory() {
        try {
            localStorage.setItem('ggjsonexport_submission_history', JSON.stringify([...submissionHistory]));
        } catch (e) { /* ignore */ }
    }

    // Add a game to the submission history
    function addGameToHistory(gameId) {
        if (!gameId) return;
        submissionHistory.add(gameId);
        saveSubmissionHistory();
        updateSentIndicator();
    }

    // Check if a game has been sent to MMA
    function hasGameBeenSent(gameId) {
        return gameId && submissionHistory.has(gameId);
    }

    // Parse custom tags from a comma-separated string
    function parseCustomTags(text) {
        if (!text) return [];
        return text
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
    }

    // ──────────────────────────────────────────────────────────────────────
    //  Country Code Readiness Logic
    // ──────────────────────────────────────────────────────────────────────

    // Check if all rounds have country codes when country code tag inclusion is enabled
    function areCountryCodesReady(rounds) {
        // If country code tag is disabled we don't need to wait
        if (!tagSettings.includeCountryCode) return true;
        return rounds.every(r => {
            if (!r.pano || typeof r.pano.lat !== 'number' || typeof r.pano.lng !== 'number') {
                return true;
            }
            return !!r.countryCode;
        });
    }

    // Wait for country codes to be ready if needed
    async function waitForCountryCodesIfNeeded(rounds, maxRetries = 10) {
        if (areCountryCodesReady(rounds)) return;
        for (let i = 0; i < maxRetries; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (areCountryCodesReady(rounds)) return;
        }
        console.warn('Country code resolution timed out; proceeding with export.');
    }

    // ──────────────────────────────────────────────────────────────────────
    //  PAGE DETECTION
    // ──────────────────────────────────────────────────────────────────────

    // Determine current page type
    function getCurrentPageType() {
        const path = window.location.pathname;
        if (PAGE_PATTERNS.DUELS.test(path)) return 'duels';
        if (PAGE_PATTERNS.BATTLE_ROYALE.test(path)) return 'battleroyale';
        if (PAGE_PATTERNS.RESULTS.test(path)) return 'results';
        return null;
    }

    // Get game ID from URL
    function getGameIdFromUrl() {
        const pageType = getCurrentPageType();
        const path = window.location.pathname;
        if (pageType === 'duels') {
            const match = path.match(/\/(?:team-)?duels\/([^\/]+)\/summary/);
            return match ? match[1] : null;
        }
        if (pageType === 'battleroyale') {
            const match = path.match(/\/battle-royale\/([^\/]+)\/summary/);
            return match ? match[1] : null;
        }
        if (pageType === 'results') {
            const match = path.match(/\/results\/([^\/]+)/);
            return match ? match[1] : null;
        }
        return null;
    }

    // Check if current page is supported
    function isSupportedPage() {
        return getCurrentPageType() !== null;
    }

    // ──────────────────────────────────────────────────────────────────────
    //  COUNTRY CACHE MANAGEMENT
    // ──────────────────────────────────────────────────────────────────────

    // Loads resolved country code cache
    function loadCountryCache() {
        try {
            const cached = localStorage.getItem('ggjsonexport_country_cache');
            if (cached) {
                const parsed = JSON.parse(cached);
                for (const [key, value] of Object.entries(parsed)) {
                    countryCache.set(key, value === null ? null : value);
                }
            }
        } catch (e) {
            console.warn('Failed to load country cache:', e);
        }
    }

    // Saves country code cache
    function scheduleSaveCountryCache() {
        clearTimeout(saveCacheTimeout);
        saveCacheTimeout = setTimeout(() => {
            try {
                const cacheObj = {};
                for (const [key, value] of countryCache.entries()) {
                    cacheObj[key] = value;
                }
                localStorage.setItem('ggjsonexport_country_cache', JSON.stringify(cacheObj));
            } catch (e) { /* ignore */ }
        }, 1000);
    }

    // Fetches the ISO country code for given coordinates using Nominatim
    // Uses persistent cache to avoid doing again for same coords
    async function getCountryCode(lat, lng) {
        const key = `${lat},${lng}`;
        if (countryCache.has(key)) {
            return countryCache.get(key);
        }
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en-US`;
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'GeoGuessrExportToolkit/1.4 (Userscript; https://github.com/asmodeo)'
                }
            });
            if (!res.ok) {
                console.warn('Nominatim request failed:', res.status, res.statusText);
                countryCache.set(key, null);
                scheduleSaveCountryCache();
                return null;
            }
            const data = await res.json();
            const code = data?.address?.country_code || null;
            countryCache.set(key, code);
            scheduleSaveCountryCache();
            return code;
        } catch (e) {
            console.warn('Error resolving country from Nominatim:', e);
            countryCache.set(key, null);
            scheduleSaveCountryCache();
            return null;
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    //  HELPER FUNCTIONS
    // ──────────────────────────────────────────────────────────────────────

    function getCountryName(code) {
        if (!code || code.length !== 2) return null;
        try {
            return new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase());
        } catch (e) {
            return code.toUpperCase();
        }
    }

    function hex2a(hex) {
        if (typeof hex !== 'string' || hex.length % 2 !== 0) return null;
        return hex.match(/.{2}/g)
            .map(byte => String.fromCharCode(parseInt(byte, 16)))
            .join('');
    }

    function googleMapsLink(pano) {
        if (!pano || typeof pano.lat !== 'number' || typeof pano.lng !== 'number') return null;
        const fov = 180 / Math.pow(2, pano.zoom ?? 0);
        let url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${pano.lat},${pano.lng}&heading=${pano.heading ?? 0}&pitch=${pano.pitch ?? 0}&fov=${fov}`;
        if (pano.panoId) {
            const decoded = hex2a(pano.panoId);
            if (decoded) url += `&pano=${decoded}`;
        }
        return url;
    }

    function parseRoundData(round, index = 0, isUsStateStreak = false) {
        if (!round) return null;
        const pano = (round.panorama?.lat != null && round.panorama?.lng != null)
            ? round.panorama
            : round;
        if (typeof pano.lat !== 'number' || typeof pano.lng !== 'number') {
            return { pano: null, roundNum: index + 1, countryCode: null, stateCode: null, originalIndex: index };
        }
        let countryCode = null;
        let stateCode = null;
        if (isUsStateStreak) {
            countryCode = 'US';
            stateCode = round.streakLocationCode || null;
        } else {
            countryCode =
                round.panorama?.countryCode ||
                round.answer?.countryCode ||
                round.streakLocationCode ||
                null;
        }
        const roundNum = round.roundNumber ?? (index + 1);
        return { pano, roundNum, countryCode, stateCode, originalIndex: index };
    }

    // Build MMA locations with tags
    function buildMmaLocations(selectedRounds, mapName) {
        return selectedRounds.map(r => {
            const tags = [];
            if (tagSettings.includeCountryCode && r.countryCode) {
                tags.push(r.countryCode.toUpperCase());
            }
            if (tagSettings.includeMapName && mapName) {
                tags.push(`map: ${mapName}`);
            }
            if (tagSettings.includeCustomTags) {
                const customTags = parseCustomTags(tagSettings.customTagsText);
                tags.push(...customTags);
            }
            return {
                id: -1,
                location: { lat: r.pano.lat, lng: r.pano.lng },
                panoId: r.pano.panoId ? hex2a(r.pano.panoId) : null,
                heading: r.pano.heading ?? 0,
                pitch: r.pano.pitch ?? 0,
                zoom: r.pano.zoom === 0 ? null : r.pano.zoom,
                tags: tags,
                flags: r.pano.panoId ? 1 : 0
            };
        });
    }

    // ──────────────────────────────────────────────────────────────────────
    //  UI COMPONENTS
    // ──────────────────────────────────────────────────────────────────────

    // Spinner style for flag placeholder when resolving countries
    function applySpinStyles() {
        if (document.getElementById('geoget-spin-styles')) return;
        const style = document.createElement('style');
        style.id = 'geoget-spin-styles';
        style.textContent = `
            @keyframes geoget-rotate { to { transform: rotate(360deg); } }
            .geoget-rotate-svg { animation: geoget-rotate 1.2s linear infinite; }
        `;
        document.head.appendChild(style);
    }

    // Create flag element using country code and flagcdn
    function createFlagElement(flagId, isResolving = false, isCompound = false) {
        const flag = document.createElement('span');
        flag.style.cssText = `
            display: inline-block;
            width: 24px;
            height: 16px;
            margin-left: 4px;
            cursor: default;
            vertical-align: middle;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        if (flagId) {
            const img = document.createElement('img');
            let src = '';
            if (isCompound && flagId.toLowerCase() === 'us-dc') {
                src = USDC_FLAG;
            } else {
                src = `https://flagcdn.com/${flagId.toLowerCase()}.svg`;
            }
            img.src = src;
            img.alt = '';
            img.style.cssText = `
                width: 100%;
                height: 100%;
                display: block;
                object-fit: contain;
                object-position: center;
                image-rendering: -webkit-optimize-contrast;
            `;
            img.loading = 'lazy';
            flag.appendChild(img);
            let tooltipText;
            if (isCompound) {
                const code = flagId.slice(3);
                tooltipText = US_STATE_NAMES[code] || flagId.toUpperCase();
            } else {
                tooltipText = getCountryName(flagId) || flagId.toUpperCase();
            }
            flag.title = tooltipText;
            return flag;
        }
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', '#aaa');
        svg.setAttribute('stroke-width', '1');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        if (isResolving) {
            applySpinStyles();
            svg.classList.add('geoget-rotate-svg');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z');
            svg.appendChild(path);
            flag.title = 'Resolving country...';
        } else {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z');
            svg.appendChild(path);
            flag.title = 'Country unknown';
        }
        flag.appendChild(svg);
        return flag;
    }

    // Create header section for the widget
    function createHeaderSection(title, iconSrc, hasToggle, isExpanded, onToggle, leftItems = []) {
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex; align-items: center; padding: 8px 12px;
            background: #2d2d2d; border-bottom: 1px solid #444;
            gap: 8px; flex-wrap: nowrap;
        `;
        leftItems.forEach(el => header.appendChild(el));
        const spacer = document.createElement('div');
        spacer.style.flex = '1';
        header.appendChild(spacer);
        const label = document.createElement('span');
        label.textContent = title;
        label.style.fontSize = '13px';
        header.appendChild(label);
        const icon = document.createElement('img');
        icon.src = iconSrc;
        icon.width = 16;
        icon.height = 16;
        icon.style.cursor = 'default';
        header.appendChild(icon);
        if (hasToggle) {
            const toggleBtn = createIconButton(
                isExpanded ? 'M7 10l5 5 5-5z' : 'M7 15l5-5 5 5z',
                'Toggle section',
                onToggle
            );
            toggleBtn.style.marginLeft = '4px';
            header.appendChild(toggleBtn);
        } else {
            const toggleSpacer = document.createElement('div');
            toggleSpacer.style.width = '20px';
            toggleSpacer.style.marginLeft = '4px';
            header.appendChild(toggleSpacer);
        }
        return header;
    }

    // Create button
    function createIconButton(path, title, handler) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.title = title;
        btn.style.cssText = `
            width: 20px; height: 20px; border: none; background: transparent; padding: 0;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            color: #aaa; flex-shrink: 0; transition: color 0.2s;
        `;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('fill', 'currentColor');
        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathEl.setAttribute('d', path);
        svg.appendChild(pathEl);
        btn.appendChild(svg);
        if (handler) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                handler(e);
            });
        }
        btn.addEventListener('mouseenter', () => btn.style.color = '#2196F3');
        btn.addEventListener('mouseleave', () => btn.style.color = '#aaa');
        return btn;
    }

    // Create Google Maps button
    function createMapsIconButton(link) {
        const a = document.createElement('a');
        a.href = link || '#';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.title = 'Open in Google Maps';
        a.style.cssText = `
            display: inline-block; width: 20px; height: 20px;
            background: url('https://www.google.com/s2/favicons?sz=64&domain=google.com') center/contain no-repeat;
            cursor: pointer; text-decoration: none; transition: transform 0.2s;
        `;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            if (link) window.open(link, '_blank', 'noopener,noreferrer');
        });
        a.addEventListener('mouseenter', () => a.style.transform = 'scale(1.1)');
        a.addEventListener('mouseleave', () => a.style.transform = '');
        return a;
    }

    // ──────────────────────────────────────────────────────────────────────
    //  BUTTON STATE MANAGEMENT
    // ──────────────────────────────────────────────────────────────────────

    async function withButtonState(button, operation, successMessage, errorPrefix = 'Error') {
        const originalIcon = button.innerHTML;
        // Loading state
        button.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" class="geoget-btn-loading">
      <path d="M12 4v2a6 6 0 1 0 6 6h2a8 8 0 1 1-8-8z" />
    </svg>`;
        button.classList.add('geoget-pulse');
        button.disabled = true;
        try {
            await operation();
            // Success state
            button.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" class="geoget-btn-success">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.95 8.23l-5.66 5.66a.996.996 0 0 1-1.41 0l-2.83-2.83a.996.996 0 1 1 1.41-1.41l2.12 2.12 4.95-4.95a.996.996 0 0 1 1.41 1.41z" />
      </svg>`;
            button.classList.remove('geoget-pulse');
            button.classList.add('geoget-pulse-success');
            showTempTooltip(successMessage, button);
        } catch (err) {
            // Error state
            button.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" class="geoget-btn-error">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.95 14.95l-1.41 1.41L12 13.41l-3.54 3.54-1.41-1.41L10.59 12 7.05 8.46l1.41-1.41L12 10.59l3.54-3.54 1.41 1.41L13.41 12l3.54 3.54z" />
      </svg>`;
            button.classList.remove('geoget-pulse');
            button.classList.add('geoget-pulse-error');
            showTempTooltip(`${errorPrefix}: ${err.message || 'unknown'}`, button);
        }
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.classList.remove('geoget-pulse', 'geoget-pulse-success', 'geoget-pulse-error');
            button.disabled = false;
        }, 2000);
    }

    // Sent to MMA indicator
    function updateSentIndicator() {
        const sendBtn = document.querySelector('#geoget-send-mma-btn');
        if (!sendBtn) return;
        const existingIndicator = sendBtn.parentNode.querySelector('.geoget-sent-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        if (hasGameBeenSent(currentGameId)) {
            const indicator = document.createElement('span');
            indicator.className = 'geoget-sent-indicator';
            indicator.innerHTML = `
                <svg viewBox="0 0 24 24" width="12" height="12" style="fill: #10b981;">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.95 8.23l-5.66 5.66a.996.996 0 0 1-1.41 0l-2.83-2.83a.996.996 0 1 1 1.41-1.41l2.12 2.12 4.95-4.95a.996.996 0 0 1 1.41 1.41z" />
                </svg>
                <span>Saved</span>
            `;
            indicator.title = 'Already sent to MMA';
            sendBtn.parentNode.insertBefore(indicator, sendBtn.nextSibling);
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    //  SHORT URL GENERATOR
    // ──────────────────────────────────────────────────────────────────────

    function gmFetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: (resp) => {
                    if (resp.status >= 200 && resp.status < 300) {
                        resolve(resp.responseText);
                    } else {
                        reject(new Error(`HTTP ${resp.status}`));
                    }
                },
                onerror: () => reject(new Error('Network error')),
                ontimeout: () => reject(new Error('Request timed out'))
            });
        });
    }

    async function generateShortUrl(fullUrl) {
        if (!fullUrl) throw new Error('No URL provided');
        const safeUrl = fullUrl.replace(/!/g, '*21');
        const encoded = encodeURIComponent(safeUrl);
        const rpcUrl = `https://www.google.com/maps/rpc/shorturl?pb=!1s${encoded}!2m1!7e81!6b1`;
        const response = await gmFetch(rpcUrl);
        const match = response.match(/"([^"]+)"/);
        if (!match) throw new Error('Invalid short URL response');
        return match[1];
    }

    // ──────────────────────────────────────────────────────────────────────
    //  MMA API FUNCTIONS
    // ──────────────────────────────────────────────────────────────────────

    async function mmaTestKey(apiKey) {
        const res = await fetch('https://map-making.app/api/user', {
            headers: { 'Authorization': `API ${apiKey.trim()}` }
        });
        if (!res.ok) throw new Error('Invalid API key');
        return await res.json();
    }

    async function mmaGetMaps(apiKey) {
        const res = await fetch('https://map-making.app/api/maps', {
            headers: { 'Authorization': `API ${apiKey.trim()}` }
        });
        if (!res.ok) throw new Error('Failed to fetch maps');
        return await res.json();
    }

    async function mmaImportLocations(mapId, locations) {
        const res = await fetch(`https://map-making.app/api/maps/${mapId}/locations`, {
            method: 'POST',
            headers: {
                'Authorization': `API ${mmaSettings.apiKey.trim()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                edits: [{
                    action: { type: 4 },
                    create: locations,
                    remove: []
                }]
            })
        });
        if (!res.ok) throw new Error('Failed to send locations');
        return await res.json();
    }

    // ──────────────────────────────────────────────────────────────────────
    //  EXPORT LOGIC
    // ──────────────────────────────────────────────────────────────────────

    async function performExportOperation(operation) {
        const selected = getSelectedRounds();
        if (selected.length === 0) {
            showTempTooltip('No rounds selected', document.querySelector('#geoget-send-mma-btn') || widget.querySelector('button'));
            return;
        }
        await waitForCountryCodesIfNeeded(selected);
        await operation(selected);
    }

    async function performAutoSend() {
        if (autoSendAttempted) return;
        autoSendAttempted = true;
        try {
            const mmaBtn = document.querySelector('#geoget-send-mma-btn');
            showTempTooltip('Auto-sending to MMA...', mmaBtn);
            await performExportOperation(async (selected) => {
                const locations = buildMmaLocations(selected, currentGameData.mapName);
                await mmaImportLocations(mmaSettings.selectedMapId, locations);
                addGameToHistory(currentGameId);
                showTempTooltip(`Auto-sent to '${mmaSettings.selectedMapName}'!`, mmaBtn);
            });
        } catch (err) {
            const mmaBtn = document.querySelector('#geoget-send-mma-btn');
            showTempTooltip(`Auto-send failed: ${err.message}`, mmaBtn);
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    //  WIDGET CREATION
    // ──────────────────────────────────────────────────────────────────────

    function createWidget() {
        if (widget) return widget;
        widget = document.createElement('div');
        widget.id = 'geoget-export-widget';
        widget.style.cssText = `
            position: fixed; bottom: 20px; right: 80px; width: 224px;
            background: #252525;
            color: #e6e6e6;
            border: 1px solid #444;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            z-index: 1;
            font-family: var(--default-font);
            overflow: hidden;
        `;

        // JSON Section
        const copyBtn = createIconButton(
            'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z',
            'Copy JSON',
            (e) => withButtonState(
                e.currentTarget,
                () => performExportOperation(selected => {
                    const json = buildJsonForExport(selected, currentGameData.mapName, currentGameData.gameType, currentGameId);
                    copyToClipboard(json);
                }),
                'JSON copied!',
                'Copy failed'
            )
        );
        const downloadBtn = createIconButton(
            'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v2H5z',
            'Download JSON',
            (e) => withButtonState(
                e.currentTarget,
                () => performExportOperation(selected => {
                    const json = buildJsonForExport(selected, currentGameData.mapName, currentGameData.gameType, currentGameId);
                    const filename = `${currentGameData.gameType}_${currentGameId}.json`;
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }),
                'JSON downloaded!',
                'Download failed'
            )
        );
        const jsonHeader = createHeaderSection('JSON', 'https://upload.wikimedia.org/wikipedia/commons/c/c9/JSON_vector_logo.svg', false, false, null, [copyBtn, downloadBtn]);
        widget.appendChild(jsonHeader);

        // MMA Section
        const sendMmaBtn = createIconButton(
            'M2,21L23,12L2,3V10L17,12L2,14V21Z',
            'Send to Map Making App',
            async (e) => {
                if (!mmaSettings.apiKey || !mmaSettings.selectedMapId) return;
                await withButtonState(
                    e.currentTarget,
                    () => performExportOperation(async (selected) => {
                        const locations = buildMmaLocations(selected, currentGameData.mapName);
                        await mmaImportLocations(mmaSettings.selectedMapId, locations);
                        addGameToHistory(currentGameId);
                    }),
                    `Sent to '${mmaSettings.selectedMapName}'!`,
                    'MMA error'
                );
            }
        );
        sendMmaBtn.id = 'geoget-send-mma-btn';

        function toggleMmaContent() {
            layoutExpanded.mma = !layoutExpanded.mma;
            const content = document.getElementById('geoget-mma-content');
            content.style.display = layoutExpanded.mma ? 'block' : 'none';
            saveLayoutExpanded();
            updateToggleButton('geoget-mma-section', layoutExpanded.mma);
        }

        const mmaHeader = createHeaderSection('MMA', 'https://www.google.com/s2/favicons?sz=64&domain=map-making.app', true, layoutExpanded.mma, toggleMmaContent, [sendMmaBtn]);
        mmaHeader.id = 'geoget-mma-section';
        widget.appendChild(mmaHeader);

        const mmaContent = document.createElement('div');
        mmaContent.id = 'geoget-mma-content';
        mmaContent.style.cssText = `
            display: ${layoutExpanded.mma ? 'block' : 'none'};
            padding: 8px;
            background: #1f1f1f;
            border-top: 1px solid #444;
            font-size: 12px;
            gap: 8px;
            flex-direction: column;
        `;

        function renderMmaDropdown() {
            mmaContent.innerHTML = '';
            if (!mmaSettings.apiKey) {
                const label = document.createElement('div');
                label.textContent = 'MMA API Key:';
                label.style.marginBottom = '4px';
                label.style.fontWeight = 'bold';
                const input = document.createElement('input');
                input.type = 'password';
                input.placeholder = 'Paste your key';
                input.style.width = '100%';
                input.style.padding = '4px';
                input.style.background = '#333';
                input.style.border = '1px solid #555';
                input.style.color = '#eee';
                const saveBtn = document.createElement('button');
                saveBtn.textContent = 'Save & Test';
                saveBtn.style.width = '100%';
                saveBtn.style.padding = '4px';
                saveBtn.style.marginTop = '4px';
                saveBtn.style.background = '#0060df';
                saveBtn.style.color = 'white';
                saveBtn.style.border = 'none';
                saveBtn.style.borderRadius = '3px';
                saveBtn.style.cursor = 'pointer';
                saveBtn.onclick = async () => {
                    const key = input.value.trim();
                    if (!key) return;
                    try {
                        await mmaTestKey(key);
                        mmaSettings.apiKey = key;
                        saveMmaSettings();
                        renderMmaDropdown();
                        fetchAndRenderMaps();
                    } catch (err) {
                        showTempTooltip('Invalid key: ' + err.message, saveBtn);
                    }
                };
                const disclaimer = document.createElement('div');
                disclaimer.textContent = 'Your API key is stored only in this browser.';
                disclaimer.style.fontSize = '10px';
                disclaimer.style.color = '#888';
                disclaimer.style.marginTop = '4px';
                mmaContent.append(label, input, saveBtn, disclaimer);
            } else {
                // Map dropdown
                const mapLabel = document.createElement('div');
                mapLabel.textContent = 'Map to Send Rounds';
                mapLabel.style.marginBottom = '6px';
                mapLabel.style.fontWeight = 'bold';
                mmaContent.appendChild(mapLabel);
                const selectContainer = document.createElement('div');
                selectContainer.style.marginBottom = '12px';
                const select = document.createElement('select');
                select.style.width = '100%';
                select.style.padding = '4px';
                select.style.background = '#333';
                select.style.border = '1px solid #555';
                select.style.color = '#eee';
                // Render loading state immediately
                let validMaps = mmaMapsCache ? mmaMapsCache.filter(m => !m.archivedAt) : [];
                if (mmaMapsLoading) {
                    const opt = document.createElement('option');
                    opt.textContent = 'Loading...';
                    opt.disabled = true;
                    select.appendChild(opt);
                } else if (validMaps.length > 0) {
                    // If no settings saved default to 1st map on list
                    if (!mmaSettings.selectedMapId) {
                        mmaSettings.selectedMapId = validMaps[0].id;
                        mmaSettings.selectedMapName = validMaps[0].name || '(unnamed)';
                        saveMmaSettings();
                    }
                    // Check if our selected map is valid (hasn't been deleted/archived)
                    const isValidMap = validMaps.some(map => 
                        String(map.id) === String(mmaSettings.selectedMapId)
                    );
                    // If not valid map default to 1st map on list
                    if (!isValidMap) {
                        mmaSettings.selectedMapId = validMaps[0].id;
                        mmaSettings.selectedMapName = validMaps[0].name || '(unnamed)';
                        saveMmaSettings();
                    }
                    validMaps.forEach(map => {
                        const opt = document.createElement('option');
                        opt.value = map.id;
                        opt.textContent = map.name || '(unnamed)';
                        if (String(map.id) === String(mmaSettings.selectedMapId)) opt.selected = true;
                        select.appendChild(opt);
                    });
                    select.onchange = () => {
                        mmaSettings.selectedMapId = select.value;
                        mmaSettings.selectedMapName = select.options[select.selectedIndex].text;
                        saveMmaSettings();
                        updateSendMmaButton();
                    };
                } else {
                    const opt = document.createElement('option');
                    if (mmaMapsCache === null) {
                        opt.textContent = 'Click “Save & Test” to load maps';
                    } else {
                        opt.textContent = 'No active maps found (check MMA)';
                    }
                    opt.disabled = true;
                    select.appendChild(opt);
                }

                selectContainer.appendChild(select);
                mmaContent.appendChild(selectContainer);

                // Auto-send checkboxes
                const autoSendLabel = document.createElement('div');
                autoSendLabel.textContent = 'Auto Send to MMA on Open';
                autoSendLabel.style.marginBottom = '6px';
                autoSendLabel.style.fontWeight = 'bold';
                autoSendLabel.style.marginTop = '8px';
                mmaContent.appendChild(autoSendLabel);

                // All checkbox
                const allContainer = document.createElement('label');
                allContainer.style.cssText = 'display: flex; align-items: center; gap: 6px; cursor: pointer;';
                const allCheck = document.createElement('input');
                allCheck.type = 'checkbox';
                allCheck.style.cursor = 'pointer';
                allCheck.checked = autoSendSettings.all;
                allCheck.addEventListener('change', (e) => {
                    autoSendSettings.all = e.target.checked;
                    if (autoSendSettings.all) {
                        autoSendSettings.duels = true;
                        autoSendSettings.standard = true;
                        autoSendSettings.battleRoyale = true;
                    } else {
                        autoSendSettings.duels = false;
                        autoSendSettings.standard = false;
                        autoSendSettings.battleRoyale = false;
                    }
                    updateAutoSendCheckboxes();
                    saveAutoSendSettings();
                });
                allContainer.append(allCheck, document.createTextNode('All'));
                mmaContent.appendChild(allContainer);

                // Duels checkbox
                const duelsContainer = document.createElement('label');
                duelsContainer.style.cssText = 'display: flex; align-items: center; gap: 6px; cursor: pointer;';
                const duelsCheck = document.createElement('input');
                duelsCheck.type = 'checkbox';
                duelsCheck.style.cursor = 'pointer';
                duelsCheck.checked = autoSendSettings.duels;
                duelsCheck.addEventListener('change', (e) => {
                    autoSendSettings.duels = e.target.checked;
                    updateAllCheckbox();
                    saveAutoSendSettings();
                });
                duelsContainer.append(duelsCheck, document.createTextNode('Duels'));
                mmaContent.appendChild(duelsContainer);

                // Standard checkbox
                const standardContainer = document.createElement('label');
                standardContainer.style.cssText = 'display: flex; align-items: center; gap: 6px; cursor: pointer;';
                const standardCheck = document.createElement('input');
                standardCheck.type = 'checkbox';
                standardCheck.style.cursor = 'pointer';
                standardCheck.checked = autoSendSettings.standard;
                standardCheck.addEventListener('change', (e) => {
                    autoSendSettings.standard = e.target.checked;
                    updateAllCheckbox();
                    saveAutoSendSettings();
                });
                standardContainer.append(standardCheck, document.createTextNode('Standard'));
                mmaContent.appendChild(standardContainer);

                // Battle Royale checkbox
                const brContainer = document.createElement('label');
                brContainer.style.cssText = 'display: flex; align-items: center; gap: 6px; cursor: pointer;';
                const brCheck = document.createElement('input');
                brCheck.type = 'checkbox';
                brCheck.style.cursor = 'pointer';
                brCheck.checked = autoSendSettings.battleRoyale;
                brCheck.addEventListener('change', (e) => {
                    autoSendSettings.battleRoyale = e.target.checked;
                    updateAllCheckbox();
                    saveAutoSendSettings();
                });
                brContainer.append(brCheck, document.createTextNode('Battle Royale'));
                mmaContent.appendChild(brContainer);

                function updateAllCheckbox() {
                    allCheck.checked = autoSendSettings.duels && autoSendSettings.standard && autoSendSettings.battleRoyale;
                    autoSendSettings.all = allCheck.checked;
                }

                function updateAutoSendCheckboxes() {
                    duelsCheck.checked = autoSendSettings.duels;
                    standardCheck.checked = autoSendSettings.standard;
                    brCheck.checked = autoSendSettings.battleRoyale;
                    allCheck.checked = autoSendSettings.all;
                }

                // Change API key button
                const changeKeyBtn = document.createElement('button');
                changeKeyBtn.textContent = 'Change API key';
                changeKeyBtn.style.width = '100%';
                changeKeyBtn.style.padding = '4px';
                changeKeyBtn.style.marginTop = '8px';
                changeKeyBtn.style.background = '#555';
                changeKeyBtn.style.color = '#ddd';
                changeKeyBtn.style.border = 'none';
                changeKeyBtn.style.borderRadius = '3px';
                changeKeyBtn.style.cursor = 'pointer';
                changeKeyBtn.onclick = () => {
                    mmaSettings.apiKey = null;
                    mmaSettings.selectedMapId = null;
                    saveMmaSettings();
                    renderMmaDropdown();
                };
                mmaContent.appendChild(changeKeyBtn);
            }
        }

        async function fetchAndRenderMaps() {
            if (!mmaSettings.apiKey || mmaMapsLoading) return;
            mmaMapsLoading = true;
            renderMmaDropdown(); // Show loading immediately
            try {
                mmaMapsCache = await mmaGetMaps(mmaSettings.apiKey);
            } catch (err) {
                mmaMapsCache = []; // mark as loaded (failed)
                console.error('MMA map fetch failed:', err);
            }
            mmaMapsLoading = false;
            renderMmaDropdown(); // Ensure dropdown always re-renders after fetch
        }

        renderMmaDropdown();
        if (mmaSettings.apiKey && !mmaMapsCache) fetchAndRenderMaps();
        widget.appendChild(mmaContent);

        function toggleTagsContent() {
            layoutExpanded.tags = !layoutExpanded.tags;
            const content = document.getElementById('geoget-tags-content');
            content.style.display = layoutExpanded.tags ? 'block' : 'none';
            saveLayoutExpanded();
            updateToggleButton('geoget-tags-section', layoutExpanded.tags);
        }

        const tagsHeader = createHeaderSection('TAGS', "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23aaa'><path d='M5.5,7A1.5,1.5 0 0,1 4,5.5A1.5,1.5 0 0,1 5.5,4A1.5,1.5 0 0,1 7,5.5A1.5,1.5 0 0,1 5.5,7M21.41,11.58L12.41,2.58C12.05,2.22 11.55,2 11,2H4C2.89,2 2,2.89 2,4V11C2,11.55 2.22,12.05 2.59,12.41L11.58,21.41C11.95,21.78 12.45,22 13,22C13.55,22 14.05,21.78 14.41,21.41L21.41,14.41C21.78,14.05 22,13.55 22,13C22,12.45 21.78,11.95 21.41,11.58Z'/></svg>", true, layoutExpanded.tags, toggleTagsContent, []);
        tagsHeader.id = 'geoget-tags-section';
        widget.appendChild(tagsHeader);

        const tagsContent = document.createElement('div');
        tagsContent.id = 'geoget-tags-content';
        tagsContent.style.cssText = `
            display: ${layoutExpanded.tags ? 'block' : 'none'};
            padding: 8px;
            background: #1f1f1f;
            border-top: 1px solid #444;
            font-size: 12px;
            gap: 6px;
            flex-direction: column;
        `;

        const tagsTitle = document.createElement('div');
        tagsTitle.textContent = 'Tags to include';
        tagsTitle.style.cssText = 'font-weight: bold; margin-bottom: 6px; cursor: default;';
        tagsContent.appendChild(tagsTitle);

        // Country Code
        const countryCheckContainer = document.createElement('label');
        countryCheckContainer.style.cssText = 'display: flex; align-items: center; gap: 6px; cursor: pointer;';
        const countryCheck = document.createElement('input');
        countryCheck.type = 'checkbox';
        countryCheck.style.cursor = 'pointer';
        countryCheck.checked = tagSettings.includeCountryCode;
        countryCheck.addEventListener('change', (e) => {
            tagSettings.includeCountryCode = e.target.checked;
            saveTagSettings();
        });
        countryCheckContainer.append(countryCheck, document.createTextNode('Country Code'));

        // Map Name
        const mapCheckContainer = document.createElement('label');
        mapCheckContainer.style.cssText = 'display: flex; align-items: center; gap: 6px; cursor: pointer;';
        const mapCheck = document.createElement('input');
        mapCheck.type = 'checkbox';
        mapCheck.style.cursor = 'pointer';
        mapCheck.checked = tagSettings.includeMapName;
        mapCheck.addEventListener('change', (e) => {
            tagSettings.includeMapName = e.target.checked;
            saveTagSettings();
        });
        mapCheckContainer.append(mapCheck, document.createTextNode('Map Name'));

        // Custom Tags
        const customCheckContainer = document.createElement('label');
        customCheckContainer.style.cssText = 'display: flex; align-items: center; gap: 6px; cursor: pointer;';
        const customCheck = document.createElement('input');
        customCheck.type = 'checkbox';
        customCheck.style.cursor = 'pointer';
        customCheck.checked = tagSettings.includeCustomTags;
        customCheck.addEventListener('change', (e) => {
            tagSettings.includeCustomTags = e.target.checked;
            saveTagSettings();
            customInput.disabled = !e.target.checked;
        });
        customCheckContainer.append(customCheck, document.createTextNode('Custom Tags (comma separated)'));

        const customInput = document.createElement('input');
        customInput.type = 'text';
        customInput.placeholder = 'custom, tags, here';
        customInput.value = tagSettings.customTagsText;
        customInput.disabled = !tagSettings.includeCustomTags;
        customInput.style.cssText = `
            width: 100%;
            padding: 4px;
            margin-top: 4px;
            background: #333;
            border: 1px solid #555;
            color: #eee;
            font-size: 12px;
        `;
        customInput.addEventListener('input', () => {
            tagSettings.customTagsText = customInput.value;
            saveTagSettings();
        });

        tagsContent.append(countryCheckContainer, mapCheckContainer, customCheckContainer, customInput);
        widget.appendChild(tagsContent);

        // Rounds Section
        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.id = 'geoget-select-all';
        selectAllCheckbox.title = 'Select/deselect all played rounds';
        selectAllCheckbox.checked = true;
        selectAllCheckbox.style.cursor = 'pointer';
        selectAllCheckbox.style.marginTop = '2px';
        selectAllCheckbox.addEventListener('change', toggleSelectAll);

        function toggleRoundsContent() {
            layoutExpanded.rounds = !layoutExpanded.rounds;
            const content = document.getElementById('geoget-rounds-content');
            content.style.display = layoutExpanded.rounds ? 'block' : 'none';
            saveLayoutExpanded();
            updateToggleButton('geoget-rounds-section', layoutExpanded.rounds);
        }

        const roundsHeader = createHeaderSection('ROUNDS', 'https://www.google.com/s2/favicons?sz=64&domain=google.com', true, layoutExpanded.rounds, toggleRoundsContent, [selectAllCheckbox]);
        roundsHeader.id = 'geoget-rounds-section';
        widget.appendChild(roundsHeader);

        const roundsContent = document.createElement('div');
        roundsContent.id = 'geoget-rounds-content';
        roundsContent.style.cssText = `
            display: ${layoutExpanded.rounds ? 'block' : 'none'};
            max-height: 190px; overflow-y: auto; padding: 4px;
            background: #1f1f1f;
        `;
        widget.appendChild(roundsContent);

        document.body.appendChild(widget);
        return widget;
    }

    function updateToggleButton(sectionId, isExpanded) {
        const toggleBtn = document.querySelector(`#${sectionId} button:last-child`);
        if (toggleBtn) {
            toggleBtn.innerHTML = '';
            const path = isExpanded ? 'M7 10l5 5 5-5z' : 'M7 15l5-5 5 5z';
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('width', '16');
            svg.setAttribute('height', '16');
            svg.setAttribute('fill', 'currentColor');
            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathEl.setAttribute('d', path);
            svg.appendChild(pathEl);
            toggleBtn.appendChild(svg);
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    //  ROUND ITEMS
    // ──────────────────────────────────────────────────────────────────────

    async function createRoundItem(round, originalIndex) {
        const item = document.createElement('div');
        item.style.cssText = `
            display: flex; align-items: center; padding: 5px 8px; gap: 6px;
            border-radius: 4px; font-size: 12px;
            background: #1f1f1f;
            cursor: default;
        `;
        item.addEventListener('mouseenter', () => item.style.backgroundColor = '#333333');
        item.addEventListener('mouseleave', () => item.style.backgroundColor = '#1f1f1f');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.style.marginTop = '2px';
        checkbox.style.cursor = 'pointer';
        checkbox.addEventListener('change', () => {
            updateSelectAllState();
            updateSendMmaButton();
        });

        const hasPano = round.pano && typeof round.pano.lat === 'number' && typeof round.pano.lng === 'number';
        const mapsBtn = createMapsIconButton(hasPano ? googleMapsLink(round.pano) : null);
        const shareShortLinkBtn = createShortUrlButton(hasPano ? round.pano : null);
        const roundNum = round.roundNum;
        const roundLabel = document.createElement('span');
        roundLabel.textContent = `Round ${roundNum}`;
        roundLabel.style.flex = '1';
        roundLabel.style.cursor = 'default';

        let flagEl;
        const isUsStateStreak = currentGameData?.isUsStateStreak;
        let resolvedCode = round.countryCode;
        let flagId = null;
        let isCompoundFlag = false;
        if (isUsStateStreak && round.stateCode) {
            flagId = `us-${round.stateCode}`;
            isCompoundFlag = true;
            resolvedCode = 'US';
        } else {
            if (!resolvedCode && hasPano) {
                const cacheKey = `${round.pano.lat},${round.pano.lng}`;
                if (countryCache.has(cacheKey)) {
                    const cachedCode = countryCache.get(cacheKey);
                    if (cachedCode) {
                        resolvedCode = cachedCode;
                    }
                }
            }
            if (resolvedCode) {
                flagId = resolvedCode;
            }
        }
        if (flagId) {
            flagEl = createFlagElement(flagId, false, isCompoundFlag);
            round.countryCode = resolvedCode;
        } else if (hasPano) {
            flagEl = createFlagElement(null, true);
            resolveCountryForRound(round, flagEl, originalIndex);
        } else {
            flagEl = createFlagElement(null, false);
        }

        item.append(checkbox, shareShortLinkBtn, mapsBtn, roundLabel, flagEl);
        roundCheckboxes.push({ el: checkbox, roundData: round });

        const supportedModes = ['duels', 'teamduels', 'standard', 'challenge', 'battleroyalecountries', 'battleroyaledistance'];
        if (currentGameData?.gameType && supportedModes.includes(currentGameData.gameType)) {
            item.addEventListener('click', (e) => {
                if (e.target === checkbox || e.target.closest('button, a, input')) {
                    return;
                }
                clickPageRoundByIndex(originalIndex);
            });
        }
        return item;
    }

    function createShortUrlButton(pano) {
        const fullUrl = googleMapsLink(pano);
        if (!fullUrl) {
            const btn = createIconButton(
                'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z',
                'No link available',
                null
            );
            btn.disabled = true;
            btn.style.opacity = '0.5';
            return btn;
        }
        return createIconButton(
            'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
            'Generate Short URL',
            async (e) => withButtonState(
                e.currentTarget,
                async () => {
                    const shortUrl = await generateShortUrl(fullUrl);
                    copyToClipboard(shortUrl);
                },
                'Short URL copied!',
                'Link error'
            )
        );
    }

    async function resolveCountryForRound(round, flagEl, index) {
        await new Promise(r => setTimeout(r, 1000 * index));
        if (!round.pano?.lat || !round.pano?.lng) return;
        const code = await getCountryCode(round.pano.lat, round.pano.lng);
        if (code) {
            round.countryCode = code;
            const newFlag = createFlagElement(code);
            flagEl.replaceWith(newFlag);
        } else {
            const unknownFlag = createFlagElement(null, false);
            flagEl.replaceWith(unknownFlag);
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    //  SELECTION MANAGEMENT
    // ──────────────────────────────────────────────────────────────────────

    function toggleSelectAll(e) {
        const checked = e.target.checked;
        roundCheckboxes.forEach(({ el }) => el.checked = checked);
        updateSelectAllState();
        updateSendMmaButton();
    }

    function updateSelectAllState() {
        const all = roundCheckboxes.length > 0;
        const allChecked = all && roundCheckboxes.every(({ el }) => el.checked);
        const someChecked = roundCheckboxes.some(({ el }) => el.checked);
        const selectAll = document.getElementById('geoget-select-all');
        if (selectAll) {
            selectAll.checked = allChecked;
            selectAll.indeterminate = all && !allChecked && someChecked;
            selectAll.disabled = !all;
        }
    }

    function getSelectedRounds() {
        return roundCheckboxes
            .filter(({ el }) => el.checked)
            .map(({ roundData }) => roundData);
    }

    function updateSendMmaButton() {
        const sendBtn = document.getElementById('geoget-send-mma-btn');
        if (sendBtn) {
            const hasSelection = getSelectedRounds().length > 0;
            const hasMmaConfig = mmaSettings.apiKey && mmaSettings.selectedMapId;
            sendBtn.disabled = !hasSelection || !hasMmaConfig;
            sendBtn.style.opacity = (!hasSelection || !hasMmaConfig) ? '0.5' : '1';
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    //  CLIPBOARD & EXPORT
    // ──────────────────────────────────────────────────────────────────────

    function copyToClipboard(text) {
        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(text);
        } else {
            navigator.clipboard.writeText(text).catch(() => {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            });
        }
    }

    function showTempTooltip(msg, targetElement = null) {
        const existing = document.querySelector('#geoget-tooltip');
        if (existing) existing.remove();
        if (!targetElement) return;
        const tooltip = document.createElement('div');
        tooltip.id = 'geoget-tooltip';
        tooltip.textContent = msg;
        tooltip.style.cssText = `
            position: fixed;
            background: #333;
            color: white;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 2;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
            white-space: nowrap;
        `;
        const rect = targetElement.getBoundingClientRect();
        document.body.appendChild(tooltip);
        const tooltipWidth = tooltip.offsetWidth;
        tooltip.style.left = (rect.left + rect.width / 2 - tooltipWidth / 2) + 'px';
        tooltip.style.top = (rect.top - 32) + 'px';
        setTimeout(() => tooltip.style.opacity = '1', 10);
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.remove(), 200);
        }, 1500);
    }

    function buildJsonForExport(selectedRounds, mapName, gameType, gameId) {
        const name = `${gameType}_${gameId}`;
        const coords = selectedRounds.map(r => {
            const p = r.pano;
            const tags = [];
            if (tagSettings.includeCountryCode && r.countryCode) {
                tags.push(r.countryCode.toUpperCase());
            }
            if (tagSettings.includeMapName && mapName) {
                tags.push(`map: ${mapName}`);
            }
            if (tagSettings.includeCustomTags) {
                const customTags = parseCustomTags(tagSettings.customTagsText);
                tags.push(...customTags);
            }
            const location = {
                lat: p.lat,
                lng: p.lng,
                heading: p.heading ?? 0,
                pitch: p.pitch ?? 0,
                zoom: p.zoom ?? 0,
                panoId: p.panoId ? hex2a(p.panoId) : null,
            };
            if (tags.length > 0) {
                location.extra = { tags };
            }
            return location;
        });
        return JSON.stringify({ name, customCoordinates: coords }, null, 2);
    }

    // ──────────────────────────────────────────────────────────────────────
    //  PAGE DETECTION & REACT INTEGRATION
    // ──────────────────────────────────────────────────────────────────────

    function extractGameDataFromReact(element) {
        let current = element;
        while (current && current !== document.body) {
            const fiberKey = Object.keys(current).find(k => k.startsWith('__reactFiber$'));
            if (fiberKey) {
                const result = deepSearchReactNode(current[fiberKey]);
                if (result) return result;
            }
            current = current.parentElement;
        }
        return null;
    }

    function deepSearchReactNode(node, visited = new WeakSet()) {
        if (!node || typeof node !== 'object' || visited.has(node)) return null;
        visited.add(node);
        let props = node.memoizedProps || node.pendingProps;
        if (props) {
            const found = extractFromProps(props);
            if (found) return found;
        }
        const children = props?.children;
        if (children) {
            const childArray = Array.isArray(children) ? children : [children];
            for (const child of childArray) {
                if (child && typeof child === 'object') {
                    if (child.$$typeof && child.props) {
                        const found = extractFromProps(child.props);
                        if (found) return found;
                    }
                    if (child.memoizedProps || child.pendingProps || child.child || child.sibling) {
                        const nestedResult = deepSearchReactNode(child, visited);
                        if (nestedResult) return nestedResult;
                    }
                }
            }
        }
        return deepSearchReactNode(node.child, visited) || deepSearchReactNode(node.sibling, visited);
    }

    function extractFromProps(props) {
        if (!props || typeof props !== 'object') return null;
        // Standard Game Results
        if (props.preselectedGame) {
            return {
                rounds: props.preselectedGame.rounds,
                mapName: props.preselectedGame.mapName,
                gameType: props.preselectedGame.type.toLowerCase() // 'standard', 'challenge'
            };
        }
        // Country Streaks
        if (props.selectedGame) {
            const isUsStateStreak = props.selectedGame.streakType === 'UsStateStreak'; // Special case
            return {
                rounds: props.selectedGame.rounds,
                mapName: props.selectedGame.mapName,
                gameType: props.selectedGame.streakType.toLowerCase(), // 'CountryStreak', 'UsStateStreak'
                isUsStateStreak
            };
        }
        // Duels / Team Duels
        if (props.game) {
            // Game generates sets of 5 rounds for duels, we filter only played rounds
            return {
                rounds: props.game.rounds?.filter(round => round.hasProcessedRoundTimeout) || [],
                mapName: props.game.options?.map?.name,
                gameType: props.game.gameType.toLowerCase() // 'Duels', 'TeamDuels'
            };
        }
        // Battle Royale
        if (props.children) { // Search children because we're using a parent container as target
            const children = Array.isArray(props.children) ? props.children : [props.children];
            for (const child of children) {
                if (child?.props?.summary && child?.props?.lobby) {
                    return {
                        rounds: child?.props?.summary?.rounds,
                        mapName: child?.props?.lobby?.mapName,
                        gameType: child?.props?.lobby?.gameType.toLowerCase() // 'BattleRoyaleCountries', 'BattleRoyaleDistance'
                    };
                }
            }
        }
        return null;
    }

    // ──────────────────────────────────────────────────────────────────────
    //  PAGE INTERACTION
    // ──────────────────────────────────────────────────────────────────────

    function clickPageRoundByIndex(index) {
        if (!currentGameData?.gameType || index < 0) return;
        const gameType = currentGameData.gameType;
        let roundElements = [];
        if (['duels', 'teamduels'].includes(gameType)) {
            roundElements = document.querySelectorAll('[class*="game-summary_playedRound__"]');
        } else if (['standard', 'challenge'].includes(gameType)) {
            roundElements = document.querySelectorAll(
                '[class*="coordinate-results_hideOnSmallScreen__"][class*="coordinate-results_clickableColumn__"]'
            );
        } else if (['battleroyalecountries'].includes(gameType)) {
            roundElements = document.querySelectorAll('[class*="tabs_tab__"] button');
        } else if (['battleroyaledistance'].includes(gameType)) {
            roundElements = document.querySelectorAll('[class*="distance_round__"]:not([class*="distance_header__"])');
        }
        if (index < roundElements.length) {
            roundElements[index].click();
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    //  ACTIVATION/DEACTIVATION
    // ──────────────────────────────────────────────────────────────────────

    async function activate() {
        if (isActive) return;
        let container = null;
        const pageType = getCurrentPageType();
        // Get react containers
        if (pageType === 'duels') {
            container = document.querySelector('[class*="game-summary_innerContainer_"]');
        } else if (pageType === 'battleroyale') {
            container = document.querySelector('[class*="in-game_layout_"]');
        } else if (pageType === 'results') {
            container = document.querySelector('[class*="results_container_"]');
        }
        if (!container) return;
        const game = extractGameDataFromReact(container);
        const gameId = getGameIdFromUrl();
        if (!game || !gameId) return;

        // Reset tracking variables
        roundCheckboxes = [];
        autoSendAttempted = false;
        currentGameData = game;
        currentGameId = gameId;
        createWidget();
        await updateWidgetContent();

        // Update "Already sent" indicator
        updateSentIndicator();

        // Check auto-send after a short delay
        setTimeout(() => {
            if (!autoSendAttempted && !hasGameBeenSent(currentGameId)) {
                const pageType = getCurrentPageType();
                let shouldAutoSend = false;
                if (autoSendSettings.all) {
                    shouldAutoSend = true;
                } else if (pageType === 'duels' && autoSendSettings.duels) {
                    shouldAutoSend = true;
                } else if (pageType === 'results' && autoSendSettings.standard) {
                    shouldAutoSend = true;
                } else if (pageType === 'battleroyale' && autoSendSettings.battleRoyale) {
                    shouldAutoSend = true;
                }
                if (shouldAutoSend && mmaSettings.apiKey && mmaSettings.selectedMapId) {
                    performAutoSend();
                }
            }
        }, 500);

        observer = new MutationObserver(() => { });
        observer.observe(container, { childList: true, subtree: true });
        isActive = true;
    }

    async function updateWidgetContent() {
        const content = document.getElementById('geoget-rounds-content');
        content.innerHTML = '';
        let rounds = currentGameData.rounds || [];
        const parsedRounds = rounds.map((r, idx) => parseRoundData(r, idx, currentGameData.isUsStateStreak));
        if (parsedRounds.length === 0) {
            content.textContent = 'No rounds found.';
            content.style.color = '#aaa';
            content.style.padding = '12px';
            content.style.background = 'transparent';
        } else {
            for (const parsedRound of parsedRounds) {
                const item = await createRoundItem(parsedRound, parsedRound.originalIndex);
                content.appendChild(item);
            }
        }
        updateSelectAllState();
        updateSendMmaButton();
    }

    function deactivate() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        if (widget) {
            widget.remove();
            widget = null;
        }
        isActive = false;
        currentGameData = null;
        currentGameId = null;
        roundCheckboxes = [];
        autoSendAttempted = false;
    }

    function onPageChange() {
        if (isSupportedPage()) {
            setTimeout(activate, 300);
        } else {
            deactivate();
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    //  INITIALIZATION
    // ──────────────────────────────────────────────────────────────────────

    loadSettings();
    loadCountryCache();

    // Hook into history API for SPA navigation
    const originalPush = history.pushState;
    const originalReplace = history.replaceState;
    history.pushState = function (...args) { originalPush.apply(this, args); onPageChange(); };
    history.replaceState = function (...args) { originalReplace.apply(this, args); onPageChange(); };
    window.addEventListener('popstate', onPageChange);

    // Initial activation if on a supported page
    if (isSupportedPage()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => setTimeout(activate, 300));
        } else {
            setTimeout(activate, 300);
        }
    }
})();