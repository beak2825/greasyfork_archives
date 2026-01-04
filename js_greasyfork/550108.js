// ==UserScript==
// @name         Zed City Outpost Organizer
// @namespace    http://tampermonkey.net/
// @version      5.5
// @license      GNU GPLv3
// @description  API-driven outpost sorting and filtering for Zed City with smooth UI transitions and robust navigation handling.
// @author       ohmnom
// @match        https://www.zed.city/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550108/Zed%20City%20Outpost%20Organizer.user.js
// @updateURL https://update.greasyfork.org/scripts/550108/Zed%20City%20Outpost%20Organizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        DEBUG: false,
        OUTPOST_CONTAINER_SELECTOR: '.building-icon',
        OUTPOST_WRAPPER_SELECTOR: '[class*="col-xs-12"][class*="col-sm-6"][class*="col-md-4"], .col-xs-12.col-sm-6.col-md-4',
        GRID_CONTAINER_SELECTOR: '.row.q-col-gutter-lg, .row[class*="q-col-gutter"]'
    };

    // --- Global State ---
    let myPlayerId = null;
    let rawOutpostData = null;
    let originalOrder = [];
    let currentSort = 'default';
    let currentFilter = { type: 'all', stars: 'all', owner: 'all' };
    let isReordering = false;
    let debounceTimer = null;
    let isInitialized = false;
    let urlCheckInterval = null;
    let mainObserver = null;
    let navigationDebounceTimer = null;
    let isInitializing = false;
    let lastInitTime = 0;
    const INIT_COOLDOWN = 1000; // Reduced cooldown for faster response
    let locationKey = 'default';
    let initializationTimer = null;
    let currentUrl = window.location.href; // Track current URL
    let stateTransitionTimer = null; // New timer for UI state transitions
    let allActiveTimers = new Set(); // Track all active timers

    // --- Enhanced Timer Management ---
    function setManagedTimeout(callback, delay) {
        const timerId = setTimeout(() => {
            allActiveTimers.delete(timerId);
            callback();
        }, delay);
        allActiveTimers.add(timerId);
        return timerId;
    }

    function clearManagedTimeout(timerId) {
        if (timerId) {
            clearTimeout(timerId);
            allActiveTimers.delete(timerId);
        }
    }

    function clearAllManagedTimers() {
        allActiveTimers.forEach(timerId => clearTimeout(timerId));
        allActiveTimers.clear();
    }

    // --- API Interception ---
    function processOutpostData(jsonText) {
        try {
            const data = JSON.parse(jsonText);
            rawOutpostData = data.stronghold ? Object.values(data.stronghold) : [];
            log(`Outpost API data captured with ${rawOutpostData.length} items.`);
            debouncedCheckAndStart();
        } catch (e) { console.error('[Outpost Organizer] Error parsing outpost data:', e); }
    }

    function processUserData(jsonText) {
        if (myPlayerId !== null) return;
        try {
            const data = JSON.parse(jsonText);
            myPlayerId = data.id;
            log(`Player ID captured and saved: ${myPlayerId}`);
        } catch(e) { console.error('[Outpost Organizer] Error parsing user data:', e); }
    }

    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async (url, options) => {
        const response = await originalFetch(url, options);
        if (url.includes('/api/getUser') || url.includes('/api/getStats')) {
            processUserData(await response.clone().text());
        }
        if (url.endsWith('/getOutposts')) {
            processOutpostData(await response.clone().text());
        }
        return response;
    };

    const originalXhrOpen = unsafeWindow.XMLHttpRequest.prototype.open;
    const originalXhrSend = unsafeWindow.XMLHttpRequest.prototype.send;
    unsafeWindow.XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._url = url;
        return originalXhrOpen.apply(this, [method, url, ...args]);
    };
    unsafeWindow.XMLHttpRequest.prototype.send = function(...args) {
        this.addEventListener('load', () => {
            if (this.readyState === 4 && this.status === 200) {
                if (this._url && (this._url.endsWith('/getUser') || this._url.endsWith('/getStats'))) {
                     processUserData(this.responseText);
                }
                if (this._url && this._url.endsWith('/getOutposts')) {
                    processOutpostData(this.responseText);
                }
            }
        });
        return originalXhrSend.apply(this, args);
    };

    // --- IMMEDIATE ANTI-FLASH PROTECTION ---
    const hiderStyle = document.createElement('style');
    hiderStyle.id = 'outpost-hider-style';
    hiderStyle.textContent = `
        .organizer-hiding [class*="col-xs-12"][class*="col-sm-6"][class*="col-md-4"]:has(.building-icon) {
            opacity: 0 !important; visibility: hidden !important; transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
        }
        .organizer-ready [class*="col-xs-12"][class*="col-sm-6"][class*="col-md-4"]:has(.building-icon) {
            opacity: 1 !important; visibility: visible !important;
        }
    `;

    function injectHidingCSS() {
        if (!document.getElementById('outpost-hider-style')) {
            (document.head || document.documentElement).appendChild(hiderStyle);
        }
        document.body.classList.add('organizer-hiding');
        document.body.classList.remove('organizer-ready');
    }

    // --- Enhanced Navigation and State Management ---
    function updateUIState(pathname) {
        const panel = document.getElementById('outpost-organizer-panel');
        const isMainOutpostsPage = (pathname === '/outposts');
        const isRelatedOutpostPage = pathname.startsWith('/outposts');

        // Clear any pending state transition
        if (stateTransitionTimer) {
            clearManagedTimeout(stateTransitionTimer);
            stateTransitionTimer = null;
        }

        if (isMainOutpostsPage) {
            log('On main outposts page - activating organizer');
            injectHidingCSS();
            if (panel) {
                panel.classList.remove('organizer-dormant');
                panel.style.display = ''; // Ensure panel is visible
            }
        } else if (isRelatedOutpostPage) {
            log('On individual outpost page - making panel dormant');
            if (panel) {
                panel.classList.add('organizer-dormant');
            }
            // Remove hiding classes to show content normally
            document.body.classList.remove('organizer-hiding');
            document.body.classList.add('organizer-ready');
        } else {
            log('Not on outpost-related page - hiding organizer');
            if (panel) {
                panel.classList.add('organizer-dormant');
            }
            document.body.classList.remove('organizer-hiding', 'organizer-ready');
        }
    }

    function forceCleanupOnNavigation() {
        log('Force cleaning up on navigation...');

        // Cancel all pending operations immediately
        if (initializationTimer) {
            clearManagedTimeout(initializationTimer);
            initializationTimer = null;
        }

        if (navigationDebounceTimer) {
            clearManagedTimeout(navigationDebounceTimer);
            navigationDebounceTimer = null;
        }

        if (debounceTimer) {
            clearManagedTimeout(debounceTimer);
            debounceTimer = null;
        }

        if (stateTransitionTimer) {
            clearManagedTimeout(stateTransitionTimer);
            stateTransitionTimer = null;
        }

        // Reset initialization state
        isInitializing = false;
        isReordering = false;

        log('Force cleanup completed');
    }

    if (window.location.pathname === '/outposts') {
        injectHidingCSS();
    }

    function log(...args) {
        if (CONFIG.DEBUG) console.log('[Outpost Organizer]', ...args);
    }

    function init() {
        log('Starting enhanced navigation monitoring...');
        startNavigationMonitoring();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', debouncedCheckAndStart);
        } else {
            debouncedCheckAndStart();
        }
    }

    function debouncedCheckAndStart() {
        if (navigationDebounceTimer) {
            clearManagedTimeout(navigationDebounceTimer);
        }
        navigationDebounceTimer = setManagedTimeout(checkAndStart, 50);
    }

    function startNavigationMonitoring() {
        let lastUrl = window.location.href;
        const checkUrl = () => {
            if (window.location.href !== lastUrl) {
                log('URL changed from:', lastUrl, 'to:', window.location.href);

                // Force cleanup immediately on navigation
                forceCleanupOnNavigation();

                // Update UI state immediately based on new URL
                updateUIState(window.location.pathname);

                lastUrl = window.location.href;
                currentUrl = window.location.href;

                // Then check if we need to start initialization
                debouncedCheckAndStart();
            }
        };

        if (urlCheckInterval) clearInterval(urlCheckInterval);
        urlCheckInterval = setInterval(checkUrl, 200); // More frequent checking

        window.addEventListener('popstate', checkUrl);

        const originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(history, arguments);
            checkUrl();
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            checkUrl();
        };
    }

    function checkAndStart() {
        // Verify we're still on the same URL (prevent race conditions)
        if (currentUrl !== window.location.href) {
            log('URL changed during processing, aborting checkAndStart');
            return;
        }

        // Cancel any pending initialization
        if (initializationTimer) {
            clearManagedTimeout(initializationTimer);
            initializationTimer = null;
            isInitializing = false;
            log('Cancelled previous initialization due to new navigation.');
        }

        if (isInitializing) {
            log('Initialization already in progress. Ignoring trigger.');
            return;
        }

        const now = Date.now();
        if (now - lastInitTime < INIT_COOLDOWN && isInitialized) {
            log('Skipping initialization due to cooldown');
            return;
        }

        const pathname = window.location.pathname;
        const isMainOutpostsPage = (pathname === '/outposts');

        // Update UI state immediately
        updateUIState(pathname);

        if (isMainOutpostsPage) {
            attemptStart();
        } else {
            // For non-main pages, just ensure cleanup
            if (isInitialized) {
                cleanup(true); // Soft cleanup
            }
        }
    }

    function attemptStart() {
        // Double-check URL hasn't changed
        if (currentUrl !== window.location.href) {
            log('URL changed during attemptStart, aborting');
            return;
        }

        if (isInitializing) return;
        isInitializing = true;

        if (isInitialized) cleanup(true);

        let attemptCount = 0;
        const maxAttempts = 15; // Reduced attempts for faster response

        const tryInit = () => {
            // Check if URL changed during initialization
            if (currentUrl !== window.location.href) {
                log('URL changed during initialization attempt, aborting');
                isInitializing = false;
                initializationTimer = null;
                return;
            }

            const outpostElements = document.querySelectorAll(CONFIG.OUTPOST_WRAPPER_SELECTOR);
            if (CONFIG.DEBUG) {
                 log(`Attempt ${attemptCount + 1}/${maxAttempts}: Found ${outpostElements.length} elements. API data is ${rawOutpostData ? 'CAPTURED' : 'MISSING'}.`);
            }

            if (outpostElements.length > 0 && rawOutpostData) {
                log(`Found ${outpostElements.length} elements and API data is ready. Initializing...`);
                initializationTimer = null;
                start();
            } else {
                attemptCount++;
                if (attemptCount < maxAttempts) {
                    initializationTimer = setManagedTimeout(tryInit, 200); // Faster polling
                } else {
                    log('Max retries reached. Could not find elements or API data.');
                    document.body.classList.remove('organizer-hiding');
                    document.body.classList.add('organizer-ready');
                    isInitializing = false;
                    initializationTimer = null;
                }
            }
        };

        tryInit();
    }

    function start() {
        // Final URL check before proceeding
        if (currentUrl !== window.location.href) {
            log('URL changed before start, aborting');
            isInitializing = false;
            return;
        }

        if (isInitialized) {
            log('Re-initializing with fresh data.');
            if (cacheAndMapData()) {
                applyFiltersAndSort();
            }
            isInitializing = false;
            return;
        }

        lastInitTime = Date.now();
        try {
            setupUI();
            if (cacheAndMapData()) {
                populateTypeFilter();
                loadSavedSettings();
                setupObserver();
                isInitialized = true;
                log('Script successfully initialized');
                applyFiltersAndSort();
            }
        } catch (error) {
            console.error('[Outpost Organizer] Error during initialization:', error);
            isInitialized = false;
        } finally {
            isInitializing = false;
        }
    }

    function cleanup(isSoftCleanup = false) {
        log(`Cleaning up instance... (Soft: ${isSoftCleanup})`);

        // Clear all managed timers
        clearAllManagedTimers();

        // Reset timer variables
        initializationTimer = null;
        navigationDebounceTimer = null;
        debounceTimer = null;
        stateTransitionTimer = null;

        const panel = document.getElementById('outpost-organizer-panel');
        if (panel && !isSoftCleanup) panel.remove();

        if (!isSoftCleanup) {
            document.getElementById('outpost-hider-style')?.remove();
            mainObserver?.disconnect();
            rawOutpostData = null;
        }

        document.body.classList.remove('organizer-hiding', 'organizer-ready');
        originalOrder = [];
        isReordering = false;
        isInitialized = false;
        isInitializing = false;
    }

    function setupUI() {
        if (document.getElementById('outpost-organizer-panel')) return;
        const mainContent = document.querySelector('main .q-page') || document.querySelector('main') || document.body;
        const controlPanel = document.createElement('div');
        controlPanel.id = 'outpost-organizer-panel';
        controlPanel.innerHTML = `
            <style>
                #outpost-organizer-panel {
                    transition: opacity 0.2s ease-in-out, max-height 0.25s ease-in-out, margin-bottom 0.25s ease-in-out;
                    overflow: hidden;
                    max-height: 500px;
                }
                #outpost-organizer-panel.organizer-dormant {
                    opacity: 0;
                    pointer-events: none;
                    max-height: 0px;
                    margin-bottom: 0px !important;
                }
                #outpost-organizer-panel select:hover, #outpost-organizer-panel select:focus { border-color: #0A748F; }
                #reset-filters:hover { background: #0d8ca9; }
            </style>
            <div style="background:#202327; border:1px solid #000; border-radius:4px; margin-bottom:15px; color:#d9d9d9; font-family:Roboto,sans-serif; font-size:14px; box-shadow:0 2px 10px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; cursor:pointer; background:#090a0b; border-bottom:1px solid #000; border-radius:4px 4px 0 0;" id="organizer-header">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <strong style="color:#fffc; text-transform:uppercase; font-size:11px; letter-spacing:.05em;">Outpost Organizer</strong>
                        <span id="organizer-status" style="color:#808080; font-size:11px;"></span>
                    </div>
                    <div style="color:#d9d9d9; font-size:14px;" id="toggle-organizer">▼</div>
                </div>
                <div id="organizer-content" style="padding:15px; border-top:1px solid rgba(255,255,255,.06); display:none;">
                    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:15px; margin-bottom:15px;">
                        <div>
                            <label style="display:block; margin-bottom:5px; color:#0A748F; font-weight:500; text-transform:uppercase; font-size:11px;">Owner Filter</label>
                            <select id="owner-filter" style="width:100%; padding:6px 8px; background:#121212; border:1px solid #000; color:#d9d9d9; border-radius:4px; font-size:12px; transition:border-color .2s;">
                                <option value="all">All Outposts</option> <option value="mine">My Outposts First</option> <option value="mine-only">My Outposts Only</option> <option value="others">Others Only</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block; margin-bottom:5px; color:#0A748F; font-weight:500; text-transform:uppercase; font-size:11px;">Building Type</label>
                            <select id="type-filter" style="width:100%; padding:6px 8px; background:#121212; border:1px solid #000; color:#d9d9d9; border-radius:4px; font-size:12px; transition:border-color .2s;">
                                <option value="all">All Types</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block; margin-bottom:5px; color:#0A748F; font-weight:500; text-transform:uppercase; font-size:11px;">Star Rating</label>
                            <select id="stars-filter" style="width:100%; padding:6px 8px; background:#121212; border:1px solid #000; color:#d9d9d9; border-radius:4px; font-size:12px; transition:border-color .2s;">
                                <option value="all">All Star Ratings</option> <option value="1">1 Star</option> <option value="2">2 Stars</option> <option value="3">3 Stars</option> <option value="4">4 Stars</option> <option value="5">5 Stars</option> <option value="6">6 Stars</option> <option value="7">7 Stars</option> <option value="8">8 Stars</option> <option value="9">9 Stars</option> <option value="10">10 Stars</option> <option value="high">8+ Stars</option> <option value="low">1-3 Stars</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block; margin-bottom:5px; color:#0A748F; font-weight:500; text-transform:uppercase; font-size:11px;">Sort Order</label>
                            <select id="sort-order" style="width:100%; padding:6px 8px; background:#121212; border:1px solid #000; color:#d9d9d9; border-radius:4px; font-size:12px; transition:border-color .2s;">
                                <option value="default">Default Order</option> <option value="stars-desc">Stars (High to Low)</option> <option value="stars-asc">Stars (Low to High)</option> <option value="type">Type (Alphabetical)</option>
                            </select>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <button id="reset-filters" style="padding:6px 12px; background:#0A748F; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:12px; font-weight:500; text-transform:uppercase; transition:background-color .2s;">Reset All</button>
                        <div id="outpost-stats" style="font-size:11px; color:#808080; text-align:right;"></div>
                    </div>
                </div>
            </div>`;
        mainContent.insertBefore(controlPanel, mainContent.firstChild);
        setupEventListeners();
    }

    function setupEventListeners() {
        document.getElementById('organizer-header').addEventListener('click', () => {
            const content = document.getElementById('organizer-content');
            const toggle = document.getElementById('toggle-organizer');
            const isExpanded = content.style.display !== 'none';
            content.style.display = isExpanded ? 'none' : 'block';
            toggle.textContent = isExpanded ? '▶' : '▼';
            localStorage.setItem('zed-organizer-expanded', !isExpanded);
        });
        document.getElementById('owner-filter').addEventListener('change', function() { currentFilter.owner = this.value; saveSettings(); applyFiltersAndSort(); });
        document.getElementById('type-filter').addEventListener('change', function() { currentFilter.type = this.value; saveSettings(); applyFiltersAndSort(); });
        document.getElementById('stars-filter').addEventListener('change', function() { currentFilter.stars = this.value; saveSettings(); applyFiltersAndSort(); });
        document.getElementById('sort-order').addEventListener('change', function() { currentSort = this.value; saveSettings(); applyFiltersAndSort(); });
        document.getElementById('reset-filters').addEventListener('click', resetFilters);
    }

    function cacheAndMapData() {
        const allWrappers = document.querySelectorAll(CONFIG.OUTPOST_WRAPPER_SELECTOR);
        const outpostElements = Array.from(allWrappers).filter(w => w.querySelector(CONFIG.OUTPOST_CONTAINER_SELECTOR) && !w.querySelector('.blank-building-row'));
        const blankElements = Array.from(allWrappers).filter(w => w.querySelector('.blank-building-row'));

        blankElements.forEach(blank => { blank.style.display = 'none'; });

        originalOrder = [];
        const sortedApiData = rawOutpostData.sort((a, b) => a.order - b.order);

        if (sortedApiData.length !== outpostElements.length) {
            console.error(`[Outpost Organizer] Mismatch Error: Found ${outpostElements.length} HTML elements but API returned ${sortedApiData.length} outposts. Aborting.`);
            blankElements.forEach(blank => { blank.style.display = ''; });
            return false;
        }

        outpostElements.forEach((wrapper, index) => {
            const outpostElement = wrapper.querySelector(CONFIG.OUTPOST_CONTAINER_SELECTOR);
            const apiData = sortedApiData[index];
            if (outpostElement && apiData) {
                originalOrder.push({
                    wrapper, outpost: outpostElement, originalIndex: index,
                    ownerId: parseInt(apiData.user?.id || apiData.vars.owner || 0),
                    outpostId: apiData.id, apiData: apiData
                });
            }
        });

        const outpostNames = sortedApiData.map(o => o.name).filter(Boolean).sort();
        const keyString = outpostNames.join('|');
        let hash = 0;
        for (let i = 0; i < keyString.length; i++) {
            hash = ((hash << 5) - hash) + keyString.charCodeAt(i);
            hash |= 0;
        }
        locationKey = hash.toString();
        log(`Cached and mapped ${originalOrder.length} outposts using order-based mapping.`);
        return true;
    }

    function getGridContainer() {
        const firstWrapper = document.querySelector(CONFIG.OUTPOST_WRAPPER_SELECTOR);
        return firstWrapper ? firstWrapper.parentElement : null;
    }

    function populateTypeFilter() {
        const typeFilter = document.getElementById('type-filter');
        if (!typeFilter) return;
        const types = new Set(originalOrder.map(item => item.apiData.name).filter(Boolean));
        while (typeFilter.children.length > 1) typeFilter.removeChild(typeFilter.lastChild);
        Array.from(types).sort().forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeFilter.appendChild(option);
        });
    }

    function isPlayerOwned(item) {
        if (!myPlayerId || !item.ownerId) return false;
        return item.ownerId === myPlayerId;
    }

    function getStarRating(item) { return item.apiData.vars.level; }
    function getBuildingType(item) { return item.apiData.name; }

    function applySortToItems(items, sortType) {
        return items.sort((a, b) => {
            switch (sortType) {
                case 'stars-desc': return getStarRating(b) - getStarRating(a);
                case 'stars-asc': return getStarRating(a) - getStarRating(b);
                case 'type': return getBuildingType(a).localeCompare(getBuildingType(b));
                default: return a.originalIndex - b.originalIndex;
            }
        });
    }

    function applyFiltersAndSort() {
        if (!isInitialized || originalOrder.length === 0) return;
        document.getElementById('organizer-status').textContent = '(Sorting...)';

        let filteredItems = originalOrder.filter(item => {
            const ownerCheck = currentFilter.owner === 'all' ||
                currentFilter.owner === 'mine' ||
                (currentFilter.owner === 'mine-only' && isPlayerOwned(item)) ||
                (currentFilter.owner === 'others' && !isPlayerOwned(item));
            const typeCheck = currentFilter.type === 'all' || getBuildingType(item) === currentFilter.type;
            const stars = getStarRating(item);
            const starsCheck = currentFilter.stars === 'all' ||
                (currentFilter.stars === 'high' && stars >= 8) ||
                (currentFilter.stars === 'low' && stars >= 1 && stars <= 3) ||
                (!isNaN(currentFilter.stars) && stars === parseInt(currentFilter.stars));
            return ownerCheck && typeCheck && starsCheck;
        });

        if (currentFilter.owner === 'mine') {
            const playerOwned = filteredItems.filter(isPlayerOwned);
            const others = filteredItems.filter(item => !isPlayerOwned(item));
            filteredItems = [...applySortToItems(playerOwned, currentSort), ...applySortToItems(others, currentSort)];
        } else {
            filteredItems = applySortToItems(filteredItems, currentSort);
        }

        reorderOutposts(filteredItems);
        updateStats(filteredItems.length);

        stateTransitionTimer = setManagedTimeout(() => {
            document.body.classList.remove('organizer-hiding');
            document.body.classList.add('organizer-ready');
        }, 50);
    }

    function reorderOutposts(orderedItems) {
        const container = getGridContainer();
        if (!container) return;
        isReordering = true;
        const visibleItems = new Set(orderedItems.map(item => item.wrapper));
        originalOrder.forEach(item => {
            item.wrapper.style.display = visibleItems.has(item.wrapper) ? '' : 'none';
        });
        orderedItems.forEach(item => container.appendChild(item.wrapper));
        setManagedTimeout(() => { isReordering = false; }, 100);
    }

    function saveSettings() {
        localStorage.setItem(`zed-organizer-settings-${locationKey}`, JSON.stringify({ currentSort, currentFilter }));
    }

    function loadSavedSettings() {
        try {
            const saved = localStorage.getItem(`zed-organizer-settings-${locationKey}`);
            if (saved) {
                const settings = JSON.parse(saved);
                currentSort = settings.currentSort || 'default';
                currentFilter = settings.currentFilter || { type: 'all', stars: 'all', owner: 'all' };
                log(`Loaded settings for location ${locationKey}`);
                document.getElementById('sort-order').value = currentSort;
                document.getElementById('owner-filter').value = currentFilter.owner;
                document.getElementById('type-filter').value = currentFilter.type;
                document.getElementById('stars-filter').value = currentFilter.stars;
            }
            if (localStorage.getItem('zed-organizer-expanded') === 'true') {
                document.getElementById('organizer-content').style.display = 'block';
                document.getElementById('toggle-organizer').textContent = '▼';
            }
        } catch (e) { console.error('[Outpost Organizer] Could not load saved settings:', e); }
    }

    function resetFilters() {
        currentFilter = { type: 'all', stars: 'all', owner: 'all' };
        currentSort = 'default';
        document.getElementById('owner-filter').value = 'all';
        document.getElementById('type-filter').value = 'all';
        document.getElementById('stars-filter').value = 'all';
        document.getElementById('sort-order').value = 'default';
        saveSettings();
        applyFiltersAndSort();
    }

    function updateStats(visibleCount = null) {
        const statsEl = document.getElementById('outpost-stats');
        const statusEl = document.getElementById('organizer-status');
        if (!statsEl || !statusEl) return;
        const total = originalOrder.length;
        const visible = visibleCount ?? total;
        const playerOwned = originalOrder.filter(isPlayerOwned).length;
        statsEl.innerHTML = `<div>Showing: ${visible}/${total}</div><div>Your outposts: ${playerOwned}</div>`;
        const activeFilters = [];
        if (currentFilter.owner !== 'all') activeFilters.push('owner');
        if (currentFilter.type !== 'all') activeFilters.push('type');
        if (currentFilter.stars !== 'all') activeFilters.push('stars');
        if (currentSort !== 'default') activeFilters.push('sorted');
        statusEl.textContent = activeFilters.length > 0 ? `(${activeFilters.join(', ')})` : '';
    }

    function setupObserver() {
        if (mainObserver) mainObserver.disconnect();
        mainObserver = new MutationObserver((mutations) => {
            if (isReordering) return;
            let shouldUpdate = mutations.some(m => Array.from(m.addedNodes).some(n => n.nodeType === 1 && (n.matches(CONFIG.OUTPOST_WRAPPER_SELECTOR) || n.querySelector(CONFIG.OUTPOST_WRAPPER_SELECTOR))));
            if (shouldUpdate) {
                if (debounceTimer) clearManagedTimeout(debounceTimer);
                debounceTimer = setManagedTimeout(() => {
                    log('Detected DOM changes, re-initializing...');
                    checkAndStart();
                }, 800); // Slightly longer debounce for DOM changes
            }
        });
        mainObserver.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('beforeunload', cleanup);
    init();

})();