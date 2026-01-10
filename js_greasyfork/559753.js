// ==UserScript==
// @name         Vinted Country & City Filter (client-side)
// @namespace    https://greasyfork.org/en/users/1550823-nigel1992
// @version      1.4.1.1
// @description  Adds a country and city indicator to Vinted items and allows client-side visual filtering by including/excluding selected countries. The script uses Vinted’s public item API to retrieve country and city information. It does not perform purchases, send messages, or modify anything on Vinted servers.
// @author       Nigel1992
// @license      MIT
// @match        https://www.vinted.nl/*
// @match        https://www.vinted.be/*
// @match        https://www.vinted.fr/*
// @match        https://www.vinted.it/*
// @match        https://www.vinted.es/*
// @match        https://www.vinted.de/*
// @match        https://www.vinted.se/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559753/Vinted%20Country%20%20City%20Filter%20%28client-side%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559753/Vinted%20Country%20%20City%20Filter%20%28client-side%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =========================
       Page Filter - Only run on homepage and catalog pages
    ========================== */

    function isAllowedPage() {
        const path = location.pathname;
        // Allow: homepage ("/"), catalog pages ("/catalog/..."), and search results
        return path === '/' ||
               path.startsWith('/catalog') ||
               path.startsWith('/vetements') ||  // French catalog
               path.startsWith('/kleding') ||    // Dutch catalog
               path.startsWith('/ropa') ||       // Spanish catalog
               path.startsWith('/abbigliamento') || // Italian catalog
               path.startsWith('/kleidung') ||   // German catalog
               path.startsWith('/kläder');       // Swedish catalog
    }

    // Exit early if not on an allowed page
    if (!isAllowedPage()) {
        return;
    }

    /*
    USER INFORMATION (Greasy Fork transparency):

    - This script retrieves country and city information via Vinted’s own API:
      /api/v2/items/{id}/details
    - Filtering is purely visual (opacity and grayscale) and does not affect
      Vinted search results or server-side filters.
    - The script may temporarily pause if Vinted returns a 403 (captcha)
      or 429 (rate limit). In this case the user must manually solve the captcha.
    - No data is sent to third parties. The script contains no tracking,
      advertising, miners, or other self-gain functionality.
    */

    /* =========================
       Settings & state
    ========================== */

    let includedCountries = JSON.parse(sessionStorage.getItem('vinted_included_countries') || '[]');
    let isFilterEnabled = sessionStorage.getItem('vinted_filter_enabled') !== 'false'; // Default: enabled
    let isProcessing = false;
    let isPausedForCaptcha = false;
    let captchaPopup = null;
    let captchaCheckInterval = null;
    let isWaitingForEnglish = false;
    let englishCheckComplete = false;
    let darkMode = sessionStorage.getItem('vinted_dark_mode') === 'true';
    let countrySectionCollapsed = sessionStorage.getItem('vinted_country_collapsed') === 'true';
    let isPaused = false;
    let flaggedSellers = new Set(JSON.parse(localStorage.getItem('vinted_flagged_sellers') || '[]'));

    const processedItems = new Map();
    const queue = [];
    const CACHE_PREFIX = 'vinted_item_';
    const PRESETS_PREFIX = 'vinted_preset_';

    const countryToFlag = {
        netherlands: '🇳🇱',
        belgium: '🇧🇪',
        france: '🇫🇷',
        germany: '🇩🇪',
        spain: '🇪🇸',
        italy: '🇮🇹',
        portugal: '🇵🇹',
        poland: '🇵🇱',
        uk: '🇬🇧',
        sweden: '🇸🇪',
        denmark: '🇩🇰',
        finland: '🇫🇮'
    };

    /* =========================
       Auto Captcha Solver
    ========================== */

    function openCaptchaPopup() {
        const apiUrl = `https://${location.hostname}/api/v2/items/1/details`;
        
        // Close existing popup if any
        if (captchaPopup && !captchaPopup.closed) {
            captchaPopup.close();
        }
        
        // Open small popup window
        captchaPopup = window.open(
            apiUrl,
            'VintedCaptcha',
            'width=500,height=600,scrollbars=yes,resizable=yes'
        );
        
        updateStatusMessage('🔓 Solving captcha... complete it in the popup');
        
        // Start checking if captcha is solved
        startCaptchaCheck();
    }

    function startCaptchaCheck() {
        // Clear any existing interval
        if (captchaCheckInterval) {
            clearInterval(captchaCheckInterval);
        }
        
        captchaCheckInterval = setInterval(async () => {
            try {
                // Try to fetch the API to see if captcha is solved
                const response = await fetch(
                    `https://${location.hostname}/api/v2/items/1/details`,
                    { credentials: 'include' }
                );
                
                // If we no longer get 403, captcha is solved
                if (response.status !== 403) {
                    const text = await response.text();
                    try {
                        let data = JSON.parse(text);
                        // Handle array response: [{"code":104,...}]
                        if (Array.isArray(data)) {
                            data = data[0] || {};
                        }
                        // Check if we get the "not found" response or valid data (means captcha is solved)
                        if (data.code === 104 || data.message_code === 'not_found' || data.item) {
                            console.log('[Vinted Filter] Captcha solved! Response:', data);
                            onCaptchaSolved();
                            return;
                        }
                    } catch (parseError) {
                        // If response is not JSON but status is OK, captcha might be solved
                        if (response.ok) {
                            console.log('[Vinted Filter] Captcha appears solved (non-JSON response)');
                            onCaptchaSolved();
                            return;
                        }
                        // Also check if the HTML response contains "message_code" (captcha solved)
                        if (text.includes('message_code')) {
                            console.log('[Vinted Filter] Captcha solved! Found message_code in HTML response');
                            onCaptchaSolved();
                            return;
                        }
                    }
                }
            } catch (e) {
                console.log('[Vinted Filter] Captcha check error:', e);
                // Ignore errors, keep checking
            }
        }, 1500); // Check every 1.5 seconds
    }

    function onCaptchaSolved() {
        // Stop checking
        if (captchaCheckInterval) {
            clearInterval(captchaCheckInterval);
            captchaCheckInterval = null;
        }
        
        // Close popup
        if (captchaPopup && !captchaPopup.closed) {
            captchaPopup.close();
            captchaPopup = null;
        }
        
        // Resume processing
        isPausedForCaptcha = false;
        const warningEl = document.getElementById('vinted-captcha-warning');
        if (warningEl) {
            warningEl.style.display = 'none';
        }
        
        updateStatusMessage('✅ Captcha solved! Resuming...');
        
        // Small delay before resuming
        setTimeout(() => {
            updateStatusMessage('Processing items...');
        }, 1500);
    }

    /* =========================
       UI Menu - Enhanced GUI
    ========================== */

    function createMenu() {
        // Don't show menu on API pages
        if (location.pathname.startsWith('/api')) return;

        if (document.getElementById('vinted-filter-menu')) return;

        const menu = document.createElement('div');
        menu.id = 'vinted-filter-menu';
        const maxHeight = Math.max(window.innerHeight * 0.5, 300); // 50% of screen height, min 300px
        menu.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999999;
            background: linear-gradient(135deg, ${darkMode ? '#1e1e1e 0%, #2d2d2d 100%' : '#ffffff 0%, #f8f9fa 100%'});
            border: 2px solid #007782;
            padding: 20px;
            border-radius: 16px;
            box-shadow: 0 12px 40px rgba(0,119,130,0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            min-width: 280px;
            max-width: 320px;
            max-height: ${maxHeight}px;
            overflow-y: auto;
            transition: all 0.3s ease;
            color: ${darkMode ? '#fff' : '#333'};
        `;

        const hiddenCount = Array.from(processedItems.values()).filter(item => item.country && !includedCountries.includes(item.country) && includedCountries.length > 0).length;

        menu.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid ${darkMode ? '#444' : '#e0e0e0'};">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 24px;">🌍</span>
                    <strong style="color: #007782; font-size: 18px; font-weight: 600;">Location Filter</strong>
                </div>
                <div style="display: flex; gap: 4px;">
                    <button id="vinted-dark-toggle" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #666; padding: 4px 8px; border-radius: 4px; transition: background 0.2s;" title="Toggle dark mode">${darkMode ? '☀️' : '🌙'}</button>
                    <button id="vinted-pause-toggle" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #666; padding: 4px 8px; border-radius: 4px; transition: background 0.2s;" title="${isPaused ? 'Resume processing' : 'Pause processing'}">${isPaused ? '▶' : '⏸'}</button>
                    <button id="vinted-toggle-menu" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #666; padding: 4px 8px; border-radius: 4px; transition: background 0.2s;" title="Minimize (Alt+V)">−${hiddenCount > 0 ? ` (${hiddenCount})` : ''}</button>
                </div>
            </div>

            <div id="vinted-menu-content">
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px;
                    background: ${darkMode ? '#333' : '#f0f9f9'};
                    border-radius: 10px;
                    margin-bottom: 16px;
                    border: 2px solid #007782;
                ">
                    <span style="color: ${darkMode ? '#ddd' : '#333'}; font-weight: 500; font-size: 14px;">Filter Active</span>
                    <label style="
                        position: relative;
                        display: inline-block;
                        width: 50px;
                        height: 26px;
                        cursor: pointer;
                    ">
                        <input type="checkbox" id="vinted-filter-toggle" ${isFilterEnabled ? 'checked' : ''} style="
                            opacity: 0;
                            width: 0;
                            height: 0;
                        ">
                        <span id="vinted-toggle-slider" style="
                            position: absolute;
                            cursor: pointer;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background-color: ${isFilterEnabled ? '#007782' : '#ccc'};
                            transition: 0.3s;
                            border-radius: 26px;
                        ">
                            <span style="
                                position: absolute;
                                content: '';
                                height: 20px;
                                width: 20px;
                                left: ${isFilterEnabled ? '27px' : '3px'};
                                bottom: 3px;
                                background-color: white;
                                transition: 0.3s;
                                border-radius: 50%;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                            "></span>
                        </span>
                    </label>
                </div>

                <div id="vinted-presets-section" style="margin-bottom: 16px; padding: 12px; background: ${darkMode ? '#333' : '#f5f5f5'}; border-radius: 10px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                        <label style="color: ${darkMode ? '#ddd' : '#333'}; font-weight: 500; font-size: 14px;">Presets:</label>
                        <button id="vinted-quick-save-preset" style="
                            padding: 4px 8px;
                            background: #007782;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-weight: 500;
                            cursor: pointer;
                            font-size: 11px;
                            transition: background 0.2s;
                        " onmouseover="this.style.background='#005f6b'" onmouseout="this.style.background='#007782'" title="Save current filter as preset">💾 Save</button>
                    </div>
                    <select id="vinted-preset-select" style="
                        width: 100%;
                        padding: 6px;
                        background: ${darkMode ? '#444' : 'white'};
                        color: ${darkMode ? '#fff' : '#000'};
                        border: 1px solid #007782;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 12px;
                        margin-bottom: 6px;
                    ">
                        <option value="">-- Select preset --</option>
                    </select>
                    <div style="display: flex; gap: 6px;">
                        <button id="vinted-load-preset" style="
                            flex: 1;
                            padding: 6px;
                            background: #4caf50;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-weight: 500;
                            cursor: pointer;
                            font-size: 11px;
                            transition: background 0.2s;
                        " onmouseover="this.style.background='#388e3c'" onmouseout="this.style.background='#4caf50'" title="Load selected preset">Load</button>
                        <button id="vinted-delete-preset" style="
                            flex: 1;
                            padding: 6px;
                            background: #f44336;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-weight: 500;
                            cursor: pointer;
                            font-size: 11px;
                            transition: background 0.2s;
                        " onmouseover="this.style.background='#d32f2f'" onmouseout="this.style.background='#f44336'" title="Delete selected preset">Delete</button>
                    </div>
                    <div style="display: flex; gap: 6px; margin-top: 6px;">
                        <button id="vinted-export-presets" style="
                            flex: 1;
                            padding: 6px;
                            background: #2196f3;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-weight: 500;
                            cursor: pointer;
                            font-size: 11px;
                            transition: background 0.2s;
                        " onmouseover="this.style.background='#1976d2'" onmouseout="this.style.background='#2196f3'" title="Export all presets as JSON">📥 Export</button>
                        <button id="vinted-import-presets" style="
                            flex: 1;
                            padding: 6px;
                            background: #ff9800;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-weight: 500;
                            cursor: pointer;
                            font-size: 11px;
                            transition: background 0.2s;
                        " onmouseover="this.style.background='#f57c00'" onmouseout="this.style.background='#ff9800'" title="Import presets from JSON">📤 Import</button>
                    </div>
                </div>

                <div id="vinted-filter-options" style="${isFilterEnabled ? '' : 'opacity: 0.5; pointer-events: none;'}">
                <div style="margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                        <label style="display: block; color: ${darkMode ? '#ddd' : '#333'}; font-weight: 500; font-size: 14px;">
                            Include Countries:
                        </label>
                        <button id="vinted-toggle-countries" style="
                            background: #007782;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            padding: 2px 8px;
                            font-size: 11px;
                            cursor: pointer;
                            transition: background 0.2s;
                        " onmouseover="this.style.background='#005f6b'" onmouseout="this.style.background='#007782'" title="${countrySectionCollapsed ? 'Expand' : 'Collapse'}">${countrySectionCollapsed ? '▶' : '▼'}</button>
                    </div>
                    <div id="vinted-country-checkboxes" style="
                        display: ${countrySectionCollapsed ? 'none' : 'grid'};
                        grid-template-columns: 1fr 1fr;
                        gap: 8px;
                        max-height: 200px;
                        overflow-y: auto;
                    ">
                        <label style="display: flex; align-items: center; gap: 6px; padding: 6px; border-radius: 6px; cursor: pointer; transition: background 0.2s; color: ${darkMode ? '#ddd' : '#333'};" onmouseover="this.style.background='${darkMode ? '#444' : '#f0f0f0'}'" onmouseout="this.style.background='transparent'">
                            <input type="checkbox" id="include-netherlands" style="margin: 0;">
                            <span>🇳🇱 Netherlands</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; padding: 6px; border-radius: 6px; cursor: pointer; transition: background 0.2s; color: ${darkMode ? '#ddd' : '#333'};" onmouseover="this.style.background='${darkMode ? '#444' : '#f0f0f0'}'" onmouseout="this.style.background='transparent'">
                            <input type="checkbox" id="include-belgium" style="margin: 0;">
                            <span>🇧🇪 Belgium</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; padding: 6px; border-radius: 6px; cursor: pointer; transition: background 0.2s; color: ${darkMode ? '#ddd' : '#333'};" onmouseover="this.style.background='${darkMode ? '#444' : '#f0f0f0'}'" onmouseout="this.style.background='transparent'">
                            <input type="checkbox" id="include-france" style="margin: 0;">
                            <span>🇫🇷 France</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; padding: 6px; border-radius: 6px; cursor: pointer; transition: background 0.2s; color: ${darkMode ? '#ddd' : '#333'};" onmouseover="this.style.background='${darkMode ? '#444' : '#f0f0f0'}'" onmouseout="this.style.background='transparent'">
                            <input type="checkbox" id="include-germany" style="margin: 0;">
                            <span>🇩🇪 Germany</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; padding: 6px; border-radius: 6px; cursor: pointer; transition: background 0.2s; color: ${darkMode ? '#ddd' : '#333'};" onmouseover="this.style.background='${darkMode ? '#444' : '#f0f0f0'}'" onmouseout="this.style.background='transparent'">
                            <input type="checkbox" id="include-spain" style="margin: 0;">
                            <span>🇪🇸 Spain</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; padding: 6px; border-radius: 6px; cursor: pointer; transition: background 0.2s; color: ${darkMode ? '#ddd' : '#333'};" onmouseover="this.style.background='${darkMode ? '#444' : '#f0f0f0'}'" onmouseout="this.style.background='transparent'">
                            <input type="checkbox" id="include-italy" style="margin: 0;">
                            <span>🇮🇹 Italy</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; padding: 6px; border-radius: 6px; cursor: pointer; transition: background 0.2s; color: ${darkMode ? '#ddd' : '#333'};" onmouseover="this.style.background='${darkMode ? '#444' : '#f0f0f0'}'" onmouseout="this.style.background='transparent'">
                            <input type="checkbox" id="include-portugal" style="margin: 0;">
                            <span>🇵🇹 Portugal</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; padding: 6px; border-radius: 6px; cursor: pointer; transition: background 0.2s; color: ${darkMode ? '#ddd' : '#333'};" onmouseover="this.style.background='${darkMode ? '#444' : '#f0f0f0'}'" onmouseout="this.style.background='transparent'">
                            <input type="checkbox" id="include-poland" style="margin: 0;">
                            <span>🇵🇱 Poland</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; padding: 6px; border-radius: 6px; cursor: pointer; transition: background 0.2s; color: ${darkMode ? '#ddd' : '#333'};" onmouseover="this.style.background='${darkMode ? '#444' : '#f0f0f0'}'" onmouseout="this.style.background='transparent'">
                            <input type="checkbox" id="include-sweden" style="margin: 0;">
                            <span>🇸🇪 Sweden</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; padding: 6px; border-radius: 6px; cursor: pointer; transition: background 0.2s; color: ${darkMode ? '#ddd' : '#333'};" onmouseover="this.style.background='${darkMode ? '#444' : '#f0f0f0'}'" onmouseout="this.style.background='transparent'">
                            <input type="checkbox" id="include-denmark" style="margin: 0;">
                            <span>🇩🇰 Denmark</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; padding: 6px; border-radius: 6px; cursor: pointer; transition: background 0.2s; color: ${darkMode ? '#ddd' : '#333'};" onmouseover="this.style.background='${darkMode ? '#444' : '#f0f0f0'}'" onmouseout="this.style.background='transparent'">
                            <input type="checkbox" id="include-finland" style="margin: 0;">
                            <span>🇫🇮 Finland</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; padding: 6px; border-radius: 6px; cursor: pointer; transition: background 0.2s; color: ${darkMode ? '#ddd' : '#333'};" onmouseover="this.style.background='${darkMode ? '#444' : '#f0f0f0'}'" onmouseout="this.style.background='transparent'">
                            <input type="checkbox" id="include-uk" style="margin: 0;">
                            <span>🇬🇧 United Kingdom</span>
                        </label>
                    </div>
                </div>

                <div style="background: ${darkMode ? '#333' : '#f5f5f5'}; border-radius: 10px; padding: 12px; margin-bottom: 12px;">
                    <div id="vinted-match-count" style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 8px;
                    " title="Items not excluded by your country filter (shown at full opacity)">
                        <span style="color: ${darkMode ? '#aaa' : '#666'}; font-size: 13px; font-weight: 500;">✅ Shown Items:</span>
                        <span id="vinted-match-number" style="
                            background: #4caf50;
                            color: white;
                            padding: 4px 12px;
                            border-radius: 12px;
                            font-weight: 600;
                            font-size: 14px;
                            min-width: 40px;
                            text-align: center;
                        ">0</span>
                    </div>
                    <div id="vinted-total-count" style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 8px;
                    " title="Total number of items on the current page that have been scanned for location data">
                        <span style="color: ${darkMode ? '#aaa' : '#666'}; font-size: 13px; font-weight: 500;">📦 Total on Page:</span>
                        <span id="vinted-total-number" style="
                            background: #2196f3;
                            color: white;
                            padding: 4px 12px;
                            border-radius: 12px;
                            font-weight: 600;
                            font-size: 14px;
                            min-width: 40px;
                            text-align: center;
                        ">0</span>
                    </div>
                    <!-- Duplicates stat removed in 1.4.1.1 hotfix -->
                    <div id="vinted-queue-count" style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    " title="Items currently waiting to be scanned for location data via the API">
                        <span style="color: ${darkMode ? '#aaa' : '#666'}; font-size: 13px; font-weight: 500;">⏳ In Queue:</span>
                        <span id="vinted-queue-number" style="
                            background: #ff9800;
                            color: white;
                            padding: 4px 12px;
                            border-radius: 12px;
                            font-weight: 600;
                            font-size: 14px;
                            min-width: 40px;
                            text-align: center;
                        ">0</span>
                    </div>
                </div>

                <div id="vinted-progress-bar-container" style="
                    background: #e0e0e0;
                    border-radius: 10px;
                    height: 8px;
                    margin-bottom: 12px;
                    overflow: hidden;
                    display: none;
                ">
                    <div id="vinted-progress-bar" style="
                        background: linear-gradient(90deg, #007782, #00a8b5);
                        height: 100%;
                        width: 0%;
                        transition: width 0.3s ease;
                        border-radius: 10px;
                    "></div>
                </div>

                <div id="vinted-language-warning" style="
                    display: none;
                    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
                    border: 2px solid #ffc107;
                    padding: 14px;
                    border-radius: 10px;
                    font-size: 13px;
                    margin-bottom: 12px;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 10px;
                        font-weight: 600;
                        color: #856404;
                    ">
                        <span style="font-size: 20px;">⚠️</span>
                        <span>Language Warning</span>
                    </div>
                    <p style="margin: 0; color: #856404; line-height: 1.5;">
                        This script only works when Vinted is set to <strong>English</strong>. Please change your language to English in your Vinted settings to use this filter.
                    </p>
                </div>

                <div id="vinted-status-message" style="
                    font-size: 12px;
                    color: ${darkMode ? '#aaa' : '#666'};
                    text-align: center;
                    padding: 8px;
                    background: ${darkMode ? '#333' : '#f9f9f9'};
                    border-radius: 8px;
                    margin-bottom: 12px;
                    min-height: 20px;
                ">Ready to filter items...</div>

                <div id="vinted-captcha-warning" style="
                    display: none;
                    background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
                    border: 2px solid #f44336;
                    padding: 14px;
                    border-radius: 10px;
                    font-size: 13px;
                    margin-top: 12px;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 10px;
                        font-weight: 600;
                        color: #c62828;
                    ">
                        <span style="font-size: 20px;">⚠️</span>
                        <span>API Blocked</span>
                    </div>
                    <p style="margin: 0 0 12px 0; color: #555; line-height: 1.5;">
                        Solving captcha automatically. Complete it in the popup window.
                    </p>
                    <button id="vinted-open-captcha" style="
                        width: 100%;
                        padding: 10px;
                        background: #f44336;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 13px;
                        margin-bottom: 8px;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#d32f2f'" onmouseout="this.style.background='#f44336'">
                        🔓 Reopen Captcha Popup
                    </button>
                    <button id="vinted-resume" style="
                        width: 100%;
                        padding: 10px;
                        background: #4caf50;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 13px;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#388e3c'" onmouseout="this.style.background='#4caf50'">
                        ✅ Resume Manually
                    </button>
                </div>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 12px;">
                    <button id="vinted-reset-stats" style="
                        flex: 1;
                        padding: 10px;
                        background: #9c27b0;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 500;
                        cursor: pointer;
                        font-size: 12px;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#7b1fa2'" onmouseout="this.style.background='#9c27b0'" title="Reset stats counters">📊 Reset Stats</button>
                    <button id="vinted-clear-cache" style="
                        flex: 1;
                        padding: 10px;
                        background: #757575;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 500;
                        cursor: pointer;
                        font-size: 12px;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#616161'" onmouseout="this.style.background='#757575'" title="Clear cached item data">
                        🗑️ Clear Cache
                    </button>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 8px;">
                    <a href="https://greasyfork.org/en/scripts/559753-vinted-country-city-filter-client-side/feedback" target="_blank" style="
                        flex: 1;
                        padding: 8px;
                        background: #007782;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 500;
                        cursor: pointer;
                        font-size: 11px;
                        text-align: center;
                        text-decoration: none;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#005f6b'" onmouseout="this.style.background='#007782'">
                        💬 Feedback
                    </a>
                    <a href="https://greasyfork.org/en/scripts/559753-vinted-country-city-filter-client-side/feedback" target="_blank" style="
                        flex: 1;
                        padding: 8px;
                        background: #dc3545;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 500;
                        cursor: pointer;
                        font-size: 11px;
                        text-align: center;
                        text-decoration: none;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#c82333'" onmouseout="this.style.background='#dc3545'">
                        🐛 Report Issue
                    </a>
                </div>

                <div style="
                    text-align: center;
                    font-size: 10px;
                    color: ${darkMode ? '#555' : '#999'};
                    margin-top: 12px;
                    padding-top: 8px;
                    border-top: 1px solid ${darkMode ? '#444' : '#eee'};
                ">
                    v1.4.1.1 • Jan 10, 2026
                </div>
            </div>
        `;

        document.body.appendChild(menu);

        // Dark mode toggle
        document.getElementById('vinted-dark-toggle').addEventListener('click', () => {
            darkMode = !darkMode;
            sessionStorage.setItem('vinted_dark_mode', darkMode);
            // Recreate menu to apply theme
            document.getElementById('vinted-filter-menu').remove();
        });

        // Pause/Resume toggle
        const pauseBtn = document.getElementById('vinted-pause-toggle');
        pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            pauseBtn.textContent = isPaused ? '▶' : '⏸';
            pauseBtn.title = isPaused ? 'Resume processing' : 'Pause processing';
            if (isPaused) {
                updateStatusMessage('⏸ Paused');
            } else {
                updateStatusMessage('▶ Resuming...');
                setTimeout(() => updateStatusMessage('Processing items...'), 800);
                applyFilter();
            }
        });

        // Country section collapse toggle
        document.getElementById('vinted-toggle-countries').addEventListener('click', () => {
            countrySectionCollapsed = !countrySectionCollapsed;
            sessionStorage.setItem('vinted_country_collapsed', countrySectionCollapsed);
            const checkboxes = document.getElementById('vinted-country-checkboxes');
            const btn = document.getElementById('vinted-toggle-countries');
            if (countrySectionCollapsed) {
                checkboxes.style.display = 'none';
                btn.textContent = '▶';
            } else {
                checkboxes.style.display = 'grid';
                btn.textContent = '▼';
            }
        });

        // Preset management functions
        function getPresets() {
            const presetsJson = localStorage.getItem('vinted_presets') || '{}';
            return JSON.parse(presetsJson);
        }

        function savePreset(name, data) {
            const presets = getPresets();
            presets[name] = data;
            localStorage.setItem('vinted_presets', JSON.stringify(presets));
            refreshPresetSelect();
        }

        function deletePreset(name) {
            const presets = getPresets();
            delete presets[name];
            localStorage.setItem('vinted_presets', JSON.stringify(presets));
            refreshPresetSelect();
        }

        function loadPreset(name) {
            const presets = getPresets();
            if (presets[name]) {
                includedCountries = presets[name].countries || [];
                sessionStorage.setItem('vinted_included_countries', JSON.stringify(includedCountries));
                // Update checkboxes
                document.querySelectorAll('#vinted-country-checkboxes input[type="checkbox"]').forEach(cb => {
                    const country = cb.id.replace('include-', '');
                    cb.checked = includedCountries.includes(country);
                });
                applyFilter();
                updateStatusMessage(`Preset "${name}" loaded!`);
            }
        }

        function refreshPresetSelect() {
            const select = document.getElementById('vinted-preset-select');
            const presets = getPresets();
            select.innerHTML = '<option value="">-- Select preset --</option>';
            Object.keys(presets).forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                select.appendChild(option);
            });
        }

        refreshPresetSelect();

        // Quick save preset
        document.getElementById('vinted-quick-save-preset').addEventListener('click', () => {
            const name = prompt('Enter preset name:', '');
            if (name && name.trim()) {
                savePreset(name.trim(), { countries: includedCountries });
                updateStatusMessage(`Preset "${name}" saved!`);
            }
        });

        // Load preset
        document.getElementById('vinted-load-preset').addEventListener('click', () => {
            const select = document.getElementById('vinted-preset-select');
            if (select.value) {
                loadPreset(select.value);
            }
        });

        // Delete preset
        document.getElementById('vinted-delete-preset').addEventListener('click', () => {
            const select = document.getElementById('vinted-preset-select');
            if (select.value && confirm(`Delete preset "${select.value}"?`)) {
                deletePreset(select.value);
                updateStatusMessage('Preset deleted!');
            }
        });

        // Export presets
        document.getElementById('vinted-export-presets').addEventListener('click', () => {
            const presets = getPresets();
            const json = JSON.stringify(presets, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'vinted-presets.json';
            a.click();
            URL.revokeObjectURL(url);
            updateStatusMessage('Presets exported!');
        });

        // Import presets
        document.getElementById('vinted-import-presets').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        try {
                            const imported = JSON.parse(ev.target.result);
                            const presets = getPresets();
                            Object.assign(presets, imported);
                            localStorage.setItem('vinted_presets', JSON.stringify(presets));
                            refreshPresetSelect();
                            updateStatusMessage('Presets imported successfully!');
                        } catch (err) {
                            alert('Invalid JSON file!');
                        }
                    };
                    reader.readAsText(file);
                }
            });
            input.click();
        });

        // Reset stats
        document.getElementById('vinted-reset-stats').addEventListener('click', () => {
            if (confirm('Reset all statistics counters?')) {
                // Stats will reset on next filter apply
                updateStatusMessage('Stats reset!');
            }
        });
        const countryCheckboxes = document.querySelectorAll('#vinted-country-checkboxes input[type="checkbox"]');
        countryCheckboxes.forEach(checkbox => {
            const country = checkbox.id.replace('include-', '');
            checkbox.checked = includedCountries.includes(country);
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    if (!includedCountries.includes(country)) {
                        includedCountries.push(country);
                    }
                } else {
                    includedCountries = includedCountries.filter(c => c !== country);
                }
                sessionStorage.setItem('vinted_included_countries', JSON.stringify(includedCountries));
                const includedNames = includedCountries.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ');
                updateStatusMessage(includedCountries.length > 0 ? `Showing only ${includedNames}...` : 'Showing all countries...');
                applyFilter();
            });
        });

        // Filter enable/disable toggle
        const filterToggle = document.getElementById('vinted-filter-toggle');
        filterToggle.addEventListener('change', () => {
            isFilterEnabled = filterToggle.checked;
            sessionStorage.setItem('vinted_filter_enabled', isFilterEnabled);
            
            const slider = document.getElementById('vinted-toggle-slider');
            const knob = slider.querySelector('span');
            const filterOptions = document.getElementById('vinted-filter-options');
            
            if (isFilterEnabled) {
                slider.style.backgroundColor = '#007782';
                knob.style.left = '27px';
                filterOptions.style.opacity = '1';
                filterOptions.style.pointerEvents = 'auto';
                updateStatusMessage('Filter enabled. Processing items...');
                applyFilter();
            } else {
                slider.style.backgroundColor = '#ccc';
                knob.style.left = '3px';
                filterOptions.style.opacity = '0.5';
                filterOptions.style.pointerEvents = 'none';
                updateStatusMessage('Filter disabled. Browsing normally.');
                // Reset all items to normal visibility
                resetAllItems();
            }
        });

        // Toggle menu minimize/expand
        let isMinimized = false;
        document.getElementById('vinted-toggle-menu').addEventListener('click', () => {
            isMinimized = !isMinimized;
            const content = document.getElementById('vinted-menu-content');
            const toggleBtn = document.getElementById('vinted-toggle-menu');
            const hiddenCount = Array.from(processedItems.values()).filter(item => item.country && includedCountries.length > 0 && !includedCountries.includes(item.country)).length;
            if (isMinimized) {
                content.style.display = 'none';
                toggleBtn.textContent = `+${hiddenCount > 0 ? ` (${hiddenCount})` : ''}`;
                toggleBtn.title = 'Expand';
                menu.style.minWidth = 'auto';
                menu.style.width = '200px';
            } else {
                content.style.display = 'block';
                toggleBtn.textContent = `−${hiddenCount > 0 ? ` (${hiddenCount})` : ''}`;
                toggleBtn.title = 'Minimize (Alt+V)';
                menu.style.minWidth = '280px';
                menu.style.width = 'auto';
            }
        });

        // Keyboard shortcut: Alt+V to toggle menu
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'v') {
                const toggleBtn = document.getElementById('vinted-toggle-menu');
                if (toggleBtn) toggleBtn.click();
            }
        });

        document.getElementById('vinted-open-captcha').onclick = () => {
            openCaptchaPopup();
        };

        document.getElementById('vinted-resume').onclick = () => {
            // Stop captcha checking
            if (captchaCheckInterval) {
                clearInterval(captchaCheckInterval);
                captchaCheckInterval = null;
            }
            // Close popup if open
            if (captchaPopup && !captchaPopup.closed) {
                captchaPopup.close();
                captchaPopup = null;
            }
            isPausedForCaptcha = false;
            document.getElementById('vinted-captcha-warning').style.display = 'none';
            updateStatusMessage('Resuming processing...');
        };

        // Clear cache button
        document.getElementById('vinted-clear-cache').onclick = () => {
            if (confirm('Clear all cached item data? This will re-process all items.')) {
                processedItems.clear();
                queue.length = 0;
                clearItemCache();
                updateStatusMessage('Cache cleared. Rescanning items...');
                updateQueueStatus();
                applyFilter();
            }
        };

        // Make menu draggable
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        const header = menu.querySelector('div:first-child');

        header.style.cursor = 'move';
        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.id === 'vinted-toggle-menu') return;
            initialX = e.clientX - menu.offsetLeft;
            initialY = e.clientY - menu.offsetTop;
            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                menu.style.left = currentX + 'px';
                menu.style.top = currentY + 'px';
                menu.style.right = 'auto';
            }
        }

        function dragEnd() {
            isDragging = false;
        }

        // Handle window resize to adjust menu height responsively
        window.addEventListener('resize', () => {
            const maxHeight = Math.max(window.innerHeight * 0.5, 300);
            menu.style.maxHeight = maxHeight + 'px';
        });
    }

    function updateStatusMessage(message) {
        const statusEl = document.getElementById('vinted-status-message');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    // Flagged seller badge handling
    function updateAllItemsForSeller(seller) {
        // Update all items from this seller
        processedItems.forEach(item => {
            if (item.seller === seller) {
                updateSellerFlagBadge(item);
            }
        });
    }

    function updateSellerFlagBadge(item) {
        if (!item?.element || !item?.seller) return;
        let badge = item.element.querySelector('.vinted-flag-badge');
        const isFlagged = flaggedSellers.has(item.seller);
        if (!badge) {
            badge = document.createElement('button');
            badge.className = 'vinted-flag-badge';
            badge.style.cssText = `
                position: absolute;
                top: 36px;
                left: 8px;
                background: ${isFlagged ? 'linear-gradient(135deg, #ffb74d 0%, #ff9800 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)'};
                color: ${isFlagged ? 'white' : '#333'};
                border: 2px solid ${isFlagged ? '#ff9800' : '#007782'};
                padding: 3px 7px;
                font-size: 11px;
                border-radius: 8px;
                cursor: pointer;
                z-index: 12;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            `;
            badge.addEventListener('click', (e) => {
                e.preventDefault();
                const sellerToUpdate = item.seller;
                if (flaggedSellers.has(sellerToUpdate)) {
                    flaggedSellers.delete(sellerToUpdate);
                } else {
                    flaggedSellers.add(sellerToUpdate);
                }
                localStorage.setItem('vinted_flagged_sellers', JSON.stringify(Array.from(flaggedSellers)));
                // Update all items from this seller
                updateAllItemsForSeller(sellerToUpdate);
            });
            item.element.style.position = 'relative';
            item.element.appendChild(badge);
        }
        badge.textContent = isFlagged ? '🚩' : '🏷️';
        badge.title = (isFlagged ? 'Unflag seller ' : 'Flag seller ') + (item.seller || '');
        badge.style.background = isFlagged ? 'linear-gradient(135deg, #ffb74d 0%, #ff9800 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)';
        badge.style.borderColor = isFlagged ? '#ff9800' : '#007782';
        badge.style.color = isFlagged ? 'white' : '#333';
    }

    /* =========================
       Scan items
    ========================== */

    function scanItems() {
        // Don't scan if filter is disabled or paused
        if (!isFilterEnabled || isPausedForCaptcha || isWaitingForEnglish || !englishCheckComplete || isPaused) return;

        const items = document.querySelectorAll(
            '[data-testid^="product-item"], [data-testid*="item"], a[href*="/items/"], [class*="ItemBox"], [class*="item-box"], [class*="feed-grid"] a[href*="/items/"], [class*="ProductCard"], [class*="product-card"]'
        );

        items.forEach(el => {
            const link = el.closest('a[href*="/items/"]') || el.querySelector('a[href*="/items/"]');
            if (!link) return;

            const match = link.href.match(/\/items\/(\d+)/);
            if (!match) return;

            const itemId = match[1];
            if (processedItems.has(itemId)) return;

            const overlay = document.createElement('div');
            overlay.textContent = '⏳ Loading...';
            overlay.style.cssText = `
                position: absolute;
                top: 8px;
                left: 8px;
                background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%);
                padding: 6px 10px;
                font-size: 11px;
                font-weight: 500;
                border-radius: 8px;
                border: 2px solid #007782;
                pointer-events: none;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                z-index: 10;
                color: #007782;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                backdrop-filter: blur(4px);
                transition: all 0.3s ease;
            `;

            el.style.position = 'relative';
            el.appendChild(overlay);

            const itemData = {
                id: itemId,
                element: el,
                overlay: overlay,
                country: '',
                seller: ''
            };

            processedItems.set(itemId, itemData);
            // Load cached items instantly without queueing
            const cachedData = getCachedItem(itemId);
            if (cachedData) {
                const country = cachedData.country;
                const city = cachedData.city;
                const flag = countryToFlag[country] || '🏳️';

                itemData.country = country;
                itemData.seller = cachedData.username || '';
                itemData.overlay.textContent = city
                    ? `${flag} ${country.charAt(0).toUpperCase() + country.slice(1)}, ${city}`
                    : `${flag} ${country.charAt(0).toUpperCase() + country.slice(1)}`;

                // Enhanced overlay styling after loading
                itemData.overlay.style.background = 'linear-gradient(135deg, rgba(76,175,80,0.95) 0%, rgba(56,142,60,0.95) 100%)';
                itemData.overlay.style.color = 'white';
                itemData.overlay.style.borderColor = '#4caf50';
                itemData.overlay.style.fontSize = '10px';
                itemData.overlay.style.padding = '5px 9px';

                updateSellerFlagBadge(itemData);
                applyFilter();
                updateQueueStatus();
            } else {
                queue.push(itemData);
            }
        });

        updateQueueStatus();
    }

    /* =========================
       Cache functions
    ========================== */

    function getCachedItem(itemId) {
        try {
            const cached = localStorage.getItem(CACHE_PREFIX + itemId);
            return cached ? JSON.parse(cached) : null;
        } catch (e) {
            console.warn('Error reading from cache:', e);
            return null;
        }
    }

    function setCachedItem(itemId, country, city, username = '') {
        try {
            const data = { country: country.toLowerCase(), city, username, timestamp: Date.now() };
            localStorage.setItem(CACHE_PREFIX + itemId, JSON.stringify(data));
        } catch (e) {
            console.warn('Error writing to cache:', e);
        }
    }

    function clearItemCache() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(CACHE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (e) {
            console.warn('Error clearing cache:', e);
        }
    }

    /* =========================
       API processing
    ========================== */

    async function processQueue() {
        // Don't process if filter is disabled or paused
        if (!isFilterEnabled || isProcessing || isPausedForCaptcha || queue.length === 0 || isWaitingForEnglish || !englishCheckComplete || isPaused) return;

        isProcessing = true;
        const item = queue.shift();

        // Check cache first
        const cachedData = getCachedItem(item.id);
        if (cachedData) {
            // Use cached data
            const country = cachedData.country;
            const city = cachedData.city;
            const flag = countryToFlag[country] || '🏳️';

            item.country = country;
            item.seller = cachedData.username || '';
            item.overlay.textContent = city
                ? `${flag} ${country.charAt(0).toUpperCase() + country.slice(1)}, ${city}`
                : `${flag} ${country.charAt(0).toUpperCase() + country.slice(1)}`;

            // Enhanced overlay styling after loading
            item.overlay.style.background = 'linear-gradient(135deg, rgba(76,175,80,0.95) 0%, rgba(56,142,60,0.95) 100%)';
            item.overlay.style.color = 'white';
            item.overlay.style.borderColor = '#4caf50';
            item.overlay.style.fontSize = '10px';
            item.overlay.style.padding = '5px 9px';

            updateSellerFlagBadge(item);
            applyFilter();
            updateQueueStatus();
            setTimeout(() => (isProcessing = false), 100);
            return;
        }

        try {
            const response = await fetch(
                `https://${location.hostname}/api/v2/items/${item.id}/details`
            );

            if (response.status === 403) {
                isPausedForCaptcha = true;
                queue.unshift(item);
                const warningEl = document.getElementById('vinted-captcha-warning');
                if (warningEl) {
                    warningEl.style.display = 'block';
                }
                // Auto-open captcha popup
                openCaptchaPopup();
                isProcessing = false;
                return;
            }

            if (response.status === 429) {
                queue.unshift(item);
                setTimeout(() => (isProcessing = false), 10000);
                return;
            }

            if (response.ok) {
                const data = await response.json();
                const country = data?.item?.user?.country_title_local || 'Unknown';
                const city = data?.item?.user?.city || '';
                const username = data?.item?.user?.login || data?.item?.user?.username || '';
                const flag = countryToFlag[country.toLowerCase()] || '🏳️';

                item.country = country.toLowerCase();
                item.seller = username;
                item.overlay.textContent = city
                    ? `${flag} ${country}, ${city}`
                    : `${flag} ${country}`;

                // Cache the data
                setCachedItem(item.id, country, city, username);

                // Enhanced overlay styling after loading
                item.overlay.style.background = 'linear-gradient(135deg, rgba(76,175,80,0.95) 0%, rgba(56,142,60,0.95) 100%)';
                item.overlay.style.color = 'white';
                item.overlay.style.borderColor = '#4caf50';
                item.overlay.style.fontSize = '10px';
                item.overlay.style.padding = '5px 9px';

                updateSellerFlagBadge(item);
                applyFilter();
                updateQueueStatus();
            }
        } catch (e) {
            console.error('Error fetching item:', item.id, e);
        }

        setTimeout(() => (isProcessing = false), 1000);
    }

    /* =========================
       Filtering & status
    ========================== */

    function applyFilter() {
        // Skip filtering if disabled
        if (!isFilterEnabled) {
            resetAllItems();
            return;
        }

        let matches = 0;
        let total = 0;

        processedItems.forEach(item => {
            if (!item.country) return;
            total++;

            const match = includedCountries.length === 0 || includedCountries.includes(item.country);

            item.element.style.opacity = match ? '1' : '0.1';
            item.element.style.filter = match ? 'none' : 'grayscale(100%)';
            item.element.style.transition = 'opacity 0.3s ease, filter 0.3s ease';

            if (match) matches++;
        });

        // Update match count
        const matchNumberEl = document.getElementById('vinted-match-number');
        if (matchNumberEl) {
            matchNumberEl.textContent = matches;
            // Animate the number change
            matchNumberEl.style.transform = 'scale(1.2)';
            setTimeout(() => {
                matchNumberEl.style.transform = 'scale(1)';
            }, 200);
        }

        // Update total count
        const totalNumberEl = document.getElementById('vinted-total-number');
        if (totalNumberEl) {
            totalNumberEl.textContent = total;
        }

        // Update progress bar
        updateProgressBar();
    }

    function resetAllItems() {
        // Reset all items to normal visibility and remove overlays when filter is disabled
        processedItems.forEach(item => {
            item.element.style.opacity = '1';
            item.element.style.filter = 'none';
            item.element.style.transition = 'opacity 0.3s ease, filter 0.3s ease';
            
            // Remove the country overlay
            if (item.overlay && item.overlay.parentNode) {
                item.overlay.remove();
            }
        });
        
        // Clear processed items and queue
        processedItems.clear();
        queue.length = 0;
        
        // Update counters
        const matchNumberEl = document.getElementById('vinted-match-number');
        const totalNumberEl = document.getElementById('vinted-total-number');
        // Duplicates stat removed in 1.4.1.1
        const queueNumberEl = document.getElementById('vinted-queue-number');
        if (matchNumberEl) matchNumberEl.textContent = '-';
        if (totalNumberEl) totalNumberEl.textContent = '-';
        // No duplicates counter to reset
        if (queueNumberEl) queueNumberEl.textContent = '0';
        
        // Hide progress bar
        const progressContainer = document.getElementById('vinted-progress-bar-container');
        if (progressContainer) progressContainer.style.display = 'none';
    }

    function updateQueueStatus() {
        const queueNumberEl = document.getElementById('vinted-queue-number');
        if (queueNumberEl) {
            queueNumberEl.textContent = queue.length;
            // Animate if queue is active
            if (queue.length > 0) {
                queueNumberEl.style.animation = 'pulse 1s infinite';
            } else {
                queueNumberEl.style.animation = 'none';
            }
        }

        // Update status message
        if (isPaused) {
            updateStatusMessage('⏸ Paused');
            updateProgressBar();
            return;
        }
        if (queue.length > 0) {
            updateStatusMessage(`Processing ${queue.length} item${queue.length !== 1 ? 's' : ''}...`);
        } else if (processedItems.size > 0) {
            const processedCount = Array.from(processedItems.values()).filter(item => item.country).length;
            updateStatusMessage(`✓ Processed ${processedCount} item${processedCount !== 1 ? 's' : ''}`);
        }

        updateProgressBar();
    }

    function updateProgressBar() {
        const progressContainer = document.getElementById('vinted-progress-bar-container');
        const progressBar = document.getElementById('vinted-progress-bar');

        if (!progressContainer || !progressBar) return;

        const total = processedItems.size;
        const processed = Array.from(processedItems.values()).filter(item => item.country).length;

        if (total > 0) {
            const percentage = (processed / total) * 100;
            progressBar.style.width = percentage + '%';
            progressContainer.style.display = 'block';
        } else {
            progressContainer.style.display = 'none';
        }
    }

    /* =========================
       Language Check
    ========================== */

    function checkLanguage() {
        const warningEl = document.getElementById('vinted-language-warning');
        if (!warningEl) {
            // If menu doesn't exist yet, wait a bit and check again
            return false;
        }

        let isEnglish = false;

        // Method 1: Check desktop language selector button text
        const langButton = document.querySelector('[data-testid="language-selector-button"]');
        if (langButton) {
            const label = langButton.querySelector('.web_ui__Button__label');
            if (label) {
                const buttonText = label.textContent.trim().toUpperCase();
                if (buttonText === 'EN' || buttonText === 'ENG') {
                    isEnglish = true;
                }
            }
        }

        // Method 2: Check if English option is selected (has bold/amplified classes)
        if (!isEnglish) {
            const englishOption = document.querySelector('[data-testid="language-option-EN"]');
            if (englishOption) {
                const content = englishOption.querySelector('[data-testid="language-option-EN--content"]');
                if (content) {
                    const textElements = content.querySelectorAll('.web_ui__Text__amplified, .web_ui__Text__bold');
                    if (textElements.length >= 2) { // Both title and subtitle should be bold when selected
                        isEnglish = true;
                    }
                }
            }
        }

        // Method 3: Check mobile language display (in settings)
        if (!isEnglish) {
            const mobileLangCells = document.querySelectorAll('.web_ui__Cell__content');
            for (const cell of mobileLangCells) {
                const title = cell.querySelector('h3.web_ui__Text__amplified');
                const subtitle = cell.querySelector('h3.web_ui__Text__muted');
                if (title && subtitle) {
                    const titleText = title.textContent.trim().toLowerCase();
                    const subtitleText = subtitle.textContent.trim().toLowerCase();
                    if ((titleText === 'english' || titleText === 'en') &&
                        (subtitleText === 'english' || subtitleText === '(english)')) {
                        isEnglish = true;
                        break;
                    }
                }
            }
        }

        // Method 4: Check URL parameter (some Vinted sites use ?locale=en)
        if (!isEnglish) {
            const urlParams = new URLSearchParams(window.location.search);
            const locale = urlParams.get('locale');
            if (locale && locale.toLowerCase().startsWith('en')) {
                isEnglish = true;
            }
        }

        // Handle language state
        if (isEnglish) {
            // English detected
            if (isWaitingForEnglish) {
                isWaitingForEnglish = false;
                englishCheckComplete = true;
                warningEl.style.display = 'none';
                updateStatusMessage('✓ English detected. Starting to process items...');

                // Clear any existing items and restart fresh
                processedItems.clear();
                queue.length = 0;

                // Small delay before resuming
                setTimeout(() => {
                    updateStatusMessage('Ready to filter items...');
                }, 1500);
            } else {
                // Already in English, just hide warning
                warningEl.style.display = 'none';
                if (!englishCheckComplete) {
                    englishCheckComplete = true;
                }
            }
        } else {
            // Not English - show warning
            if (!isWaitingForEnglish) {
                isWaitingForEnglish = true;
                englishCheckComplete = false;
                updateStatusMessage('⚠️ Please switch to English to use this filter');
            }
            warningEl.style.display = 'block';
        }

        return isEnglish;
    }

    // Track navigation changes (SPA navigation)
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // Reset English check on navigation
            if (isWaitingForEnglish) {
                englishCheckComplete = false;
            }
        }
    });
    urlObserver.observe(document, { subtree: true, childList: true });

    /* =========================
       CSS Animations
    ========================== */

    function injectStyles() {
        if (document.getElementById('vinted-filter-styles')) return;

        const style = document.createElement('style');
        style.id = 'vinted-filter-styles';
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            #vinted-filter-menu {
                animation: slideIn 0.4s ease-out;
            }
            #vinted-country-select:hover {
                transform: translateY(-1px);
            }
            #vinted-country-select:active {
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    /* =========================
       Timers
    ========================== */

    injectStyles();

    // Initial language check on load
    function initialLanguageCheck() {
        const isEnglish = checkLanguage();
        if (!isEnglish) {
            isWaitingForEnglish = true;
            englishCheckComplete = false;
        } else {
            englishCheckComplete = true;
        }
    }

    // Wait a bit for page to load before first check
    setTimeout(initialLanguageCheck, 1000);

    setInterval(createMenu, 1000);
    setInterval(scanItems, 2000);
    setInterval(processQueue, 200);
    setInterval(checkLanguage, 2000); // Check language every 2 seconds

})();
