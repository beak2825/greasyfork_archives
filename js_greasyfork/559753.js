// ==UserScript==
// @name         Vinted Country & City Filter (client-side)
// @namespace    https://greasyfork.org/en/users/1550823-nigel1992
// @version      1.1.9
// @description  Adds a country and city indicator to Vinted items and allows client-side visual filtering by item location. The script uses Vinted’s public item API to retrieve country and city information. It does not perform purchases, send messages, or modify anything on Vinted servers.
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

    let selectedCountry = sessionStorage.getItem('vinted_filter_country') || '';
    let isFilterEnabled = sessionStorage.getItem('vinted_filter_enabled') !== 'false'; // Default: enabled
    let isProcessing = false;
    let isPausedForCaptcha = false;
    let captchaPopup = null;
    let captchaCheckInterval = null;
    let isWaitingForEnglish = false;
    let englishCheckComplete = false;

    const processedItems = new Map();
    const queue = [];

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
        menu.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999999;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border: 2px solid #007782;
            padding: 20px;
            border-radius: 16px;
            box-shadow: 0 12px 40px rgba(0,119,130,0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            min-width: 280px;
            max-width: 320px;
            transition: all 0.3s ease;
        `;

        menu.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #e0e0e0;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 24px;">🌍</span>
                    <strong style="color: #007782; font-size: 18px; font-weight: 600;">Location Filter</strong>
                </div>
                <button id="vinted-toggle-menu" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #666; padding: 4px 8px; border-radius: 4px; transition: background 0.2s;" title="Minimize">−</button>
            </div>

            <div id="vinted-menu-content">
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px;
                    background: #f0f9f9;
                    border-radius: 10px;
                    margin-bottom: 16px;
                    border: 2px solid #007782;
                ">
                    <span style="color: #333; font-weight: 500; font-size: 14px;">Filter Active</span>
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

                <div id="vinted-filter-options" style="${isFilterEnabled ? '' : 'opacity: 0.5; pointer-events: none;'}">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500; font-size: 14px;">
                        Filter by Country:
                    </label>
                    <select id="vinted-country-select" style="
                        width: 100%;
                        padding: 12px;
                        border: 2px solid #ddd;
                        border-radius: 8px;
                        font-size: 14px;
                        background: white;
                        cursor: pointer;
                        transition: all 0.2s;
                        font-family: inherit;
                    ">
                        <option value="">🌐 Show All Countries</option>
                        <option value="netherlands">🇳🇱 Netherlands</option>
                        <option value="belgium">🇧🇪 Belgium</option>
                        <option value="france">🇫🇷 France</option>
                        <option value="germany">🇩🇪 Germany</option>
                        <option value="spain">🇪🇸 Spain</option>
                        <option value="italy">🇮🇹 Italy</option>
                        <option value="portugal">🇵🇹 Portugal</option>
                        <option value="poland">🇵🇱 Poland</option>
                        <option value="sweden">🇸🇪 Sweden</option>
                        <option value="denmark">🇩🇰 Denmark</option>
                        <option value="finland">🇫🇮 Finland</option>
                        <option value="uk">🇬🇧 United Kingdom</option>
                    </select>
                </div>

                <div style="background: #f5f5f5; border-radius: 10px; padding: 12px; margin-bottom: 12px;">
                    <div id="vinted-match-count" style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 8px;
                    " title="Items matching your selected country filter (shown at full opacity)">
                        <span style="color: #666; font-size: 13px; font-weight: 500;">✅ Matching Filter:</span>
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
                        <span style="color: #666; font-size: 13px; font-weight: 500;">📦 Total on Page:</span>
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
                    <div id="vinted-queue-count" style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    " title="Items currently waiting to be scanned for location data via the API">
                        <span style="color: #666; font-size: 13px; font-weight: 500;">⏳ In Queue:</span>
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
                    color: #666;
                    text-align: center;
                    padding: 8px;
                    background: #f9f9f9;
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

                <button id="vinted-clear-cache" style="
                    width: 100%;
                    padding: 10px;
                    background: #757575;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    font-size: 12px;
                    margin-top: 12px;
                    transition: background 0.2s;
                " onmouseover="this.style.background='#616161'" onmouseout="this.style.background='#757575'" title="Clear cached item data">
                    🗑️ Clear Cache
                </button>

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
                    color: #999;
                    margin-top: 12px;
                    padding-top: 8px;
                    border-top: 1px solid #eee;
                ">
                    v1.1.9 • Jan 4, 2026
                </div>
            </div>
        `;

        document.body.appendChild(menu);

        const select = document.getElementById('vinted-country-select');
        select.value = selectedCountry;

        // Enhanced select styling on hover/focus
        select.addEventListener('mouseenter', () => {
            select.style.borderColor = '#007782';
            select.style.boxShadow = '0 0 0 3px rgba(0,119,130,0.1)';
        });
        select.addEventListener('mouseleave', () => {
            if (document.activeElement !== select) {
                select.style.borderColor = '#ddd';
                select.style.boxShadow = 'none';
            }
        });
        select.addEventListener('focus', () => {
            select.style.borderColor = '#007782';
            select.style.boxShadow = '0 0 0 3px rgba(0,119,130,0.1)';
        });
        select.addEventListener('blur', () => {
            select.style.borderColor = '#ddd';
            select.style.boxShadow = 'none';
        });

        select.addEventListener('change', () => {
            selectedCountry = select.value;
            sessionStorage.setItem('vinted_filter_country', selectedCountry);
            updateStatusMessage(selectedCountry ? `Filtering by ${select.options[select.selectedIndex].text.replace(/^[^\s]+\s/, '')}...` : 'Showing all countries...');
            applyFilter();
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
            if (isMinimized) {
                content.style.display = 'none';
                toggleBtn.textContent = '+';
                toggleBtn.title = 'Expand';
                menu.style.minWidth = 'auto';
                menu.style.width = '200px';
            } else {
                content.style.display = 'block';
                toggleBtn.textContent = '−';
                toggleBtn.title = 'Minimize';
                menu.style.minWidth = '280px';
                menu.style.width = 'auto';
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
    }

    function updateStatusMessage(message) {
        const statusEl = document.getElementById('vinted-status-message');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    /* =========================
       Scan items
    ========================== */

    function scanItems() {
        // Don't scan if filter is disabled
        if (!isFilterEnabled || isPausedForCaptcha || isWaitingForEnglish || !englishCheckComplete) return;

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
                country: ''
            };

            processedItems.set(itemId, itemData);
            queue.push(itemData);
        });

        updateQueueStatus();
    }

    /* =========================
       API processing
    ========================== */

    async function processQueue() {
        // Don't process if filter is disabled
        if (!isFilterEnabled || isProcessing || isPausedForCaptcha || queue.length === 0 || isWaitingForEnglish || !englishCheckComplete) return;

        isProcessing = true;
        const item = queue.shift();

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
                const flag = countryToFlag[country.toLowerCase()] || '🏳️';

                item.country = country.toLowerCase();
                item.overlay.textContent = city
                    ? `${flag} ${country}, ${city}`
                    : `${flag} ${country}`;

                // Enhanced overlay styling after loading
                item.overlay.style.background = 'linear-gradient(135deg, rgba(76,175,80,0.95) 0%, rgba(56,142,60,0.95) 100%)';
                item.overlay.style.color = 'white';
                item.overlay.style.borderColor = '#4caf50';
                item.overlay.style.fontSize = '10px';
                item.overlay.style.padding = '5px 9px';

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

            const match =
                !selectedCountry || item.country === selectedCountry;

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
        const queueNumberEl = document.getElementById('vinted-queue-number');
        if (matchNumberEl) matchNumberEl.textContent = '-';
        if (totalNumberEl) totalNumberEl.textContent = '-';
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
