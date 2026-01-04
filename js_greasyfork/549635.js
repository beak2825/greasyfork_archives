// ==UserScript==
// @name         GeoGuessr Liked Maps Widget
// @version      0.9.15
// @namespace    https://github.com/asmodeo
// @icon         https://parmageo.vercel.app/gg.ico
// @description  Creates a widget on the GeoGuessr start page featuring your liked maps
// @author       Parma
// @match        https://www.geoguessr.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      geoguessr.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549635/GeoGuessr%20Liked%20Maps%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/549635/GeoGuessr%20Liked%20Maps%20Widget.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // ======================
    // Constants & Configuration
    // ======================
    const CONFIG = {
        STORAGE_KEY: 'geoguessr_liked_maps',
        FOLDERS_STORAGE_KEY: 'geoguessr_liked_maps_folders',
        SORT_STORAGE_KEY: 'geoguessr_sort_preference',
        SELECTED_FOLDER_STORAGE_KEY: 'geoguessr_selected_folder',
        PINNED_MAPS_STORAGE_KEY: 'geoguessr_pinned_maps',
    };
    const REQUEST_HEADERS = {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache',
                'User-Agent': 'GeoGuessrLikedMapsWidget/0.9.15 (UserScript; https://greasyfork.org/)'
            }
    const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 hours in ms

    // ======================
    // State Management
    // ======================
    let currentPathname = window.location.pathname;
    let widgetInitialized = false;
    let likedMaps = [];
    let likedMapsFolders = [];
    let filteredMaps = [];
    let searchTerm = '';
    let currentSort = GM_getValue(CONFIG.SORT_STORAGE_KEY, 'default');
    let currentFolderId = GM_getValue(CONFIG.SELECTED_FOLDER_STORAGE_KEY, 'all');
    let pinnedMapIds = new Set();
    let tooltip = null;


    let initialDataLoaded = false;

    // ======================
    // Utility Functions
    // ======================

    /**
     * Checks if the current page is GeoGuessr's home/start page.
     * @returns {boolean}
     */
    function isHomePage() {
        return window.location.pathname === '/' || window.location.pathname === '';
    }

    /**
     * Trims Unicode control and invisible formatting characters from a string.
     * @param {string} str - Input string
     * @returns {string}
     */
    function trimSpecialCharacters(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/^[\s\u0000-\u001F\u007F-\u009F\u2000-\u200F\u2028-\u202F\u2060-\u206F\uFEFF\uFFF0-\uFFFF]*/, '');
    }

    /**
     * Returns a debounced version of the provided function.
     * @template T
     * @param {(...args: T[]) => void} func
     * @param {number} delay - Milliseconds to delay
     * @returns {(...args: T[]) => void}
     */
    function debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    }

    /**
     * Finds a class name that starts with the given prefix.
     * @param {string} prefix
     * @returns {string}
     */
    function getClassName(prefix) {
        const el = document.querySelector(`[class*="${prefix}"]`);
        return el ? [...el.classList].find(cls => cls.startsWith(prefix)) || '' : '';
    }

    /**
     * Returns a space-separated string of all classes from an element that contains the prefix.
     * @param {string} prefix
     * @returns {string}
     */
    function getClassList(prefix) {
        const el = document.querySelector(`[class*="${prefix}"]`);
        return el ? Array.from(el.classList).join(' ') : '';
    }

    // ======================
    // Auto-Sync Management
    // ======================

    // Auto-sync state
    let lastSyncTimestamp = GM_getValue('geoguessr_last_sync_timestamp', 0);
    let autoSyncTimerId = null;

    /**
     * Clears any pending auto-sync timer.
     */
    function clearAutoSync() {
        if (autoSyncTimerId) {
            clearTimeout(autoSyncTimerId);
            autoSyncTimerId = null;
        }
    }

    /**
     * Starts initial or scheduled sync based on last sync timestamp.
     */
    function startAutoSync() {
        clearAutoSync();

        if (!isHomePage() || document.hidden) return;

        const timeSinceLastSync = Date.now() - lastSyncTimestamp;
        const syncImmediately = lastSyncTimestamp === 0 || timeSinceLastSync >= ONE_DAY_MS;

        if (syncImmediately) {
            console.log('GeoGuessr Liked Maps Widget: Performing auto-sync');
            fetchLikedMapsAndFolders((success) => {
                if (success) {
                    lastSyncTimestamp = Date.now();
                    GM_setValue('geoguessr_last_sync_timestamp', lastSyncTimestamp);
                }
                // Schedule next sync in exactly 24 hours
                autoSyncTimerId = setTimeout(startAutoSync, ONE_DAY_MS);
            });
        } else {
            // Schedule sync for when 24 hours have passed since last sync
            const timeUntilNextSync = ONE_DAY_MS - timeSinceLastSync;
            console.log(`GeoGuessr Liked Maps Widget: Next auto-sync in ${Math.round(timeUntilNextSync / (60 * 60 * 1000))} hours`);
            autoSyncTimerId = setTimeout(startAutoSync, timeUntilNextSync);
        }
    }

    // Handle page visibility
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearAutoSync();
        } else if (isHomePage()) {
            startAutoSync();
        }
    });

    // ======================
    // Map & Folder Data Management
    // ======================

    /**
     * Sorts an array of maps according to the current sort preference.
     * @param {Array} maps - Array of map objects
     * @returns {Array} Sorted array
     */
    function sortMaps(maps) {
        const sorted = [...maps];
        switch (currentSort) {
            case 'a-z':
                return sorted.sort((a, b) => trimSpecialCharacters(a.name).localeCompare(trimSpecialCharacters(b.name), undefined, { sensitivity: 'base' }));
            case 'z-a':
                return sorted.sort((a, b) => trimSpecialCharacters(b.name).localeCompare(trimSpecialCharacters(a.name), undefined, { sensitivity: 'base' }));
            case 'creator':
                return sorted.sort((a, b) => {
                    const creatorA = (a.inExplorerMode ? '_CLASSIC_MAP_' : (a.creator?.nick || 'Unknown')).toLowerCase();
                    const creatorB = (b.inExplorerMode ? '_CLASSIC_MAP_' : (b.creator?.nick || 'Unknown')).toLowerCase();
                    return creatorA.localeCompare(creatorB);
                });
            case 'updated':
                return sorted.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
            default:
                return sorted;
        }
    }

    /**
     * Filters and sorts maps based on current folder, search term, and pin state.
     */
    function filterAndSortMaps() {
        let filtered = [...likedMaps];

        // Apply folder filter
        if (currentFolderId !== 'all') {
            const folder = likedMapsFolders.find(f => f.id === currentFolderId);
            if (folder?.likeIds) {
                const folderIds = new Set(folder.likeIds);
                filtered = filtered.filter(map => folderIds.has(map.id));
            }
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(map =>
                trimSpecialCharacters(map.name).toLowerCase().includes(searchTerm)
            );
        }

        // Separate pinned/unpinned and sort each group
        const pinned = filtered.filter(map => pinnedMapIds.has(map.id));
        const unpinned = filtered.filter(map => !pinnedMapIds.has(map.id));
        filteredMaps = [...sortMaps(pinned), ...sortMaps(unpinned)];
    }

    /**
     * Fetches liked maps and folders from GeoGuessr API and updates internal state.
     * @param {Function} callback - Called with (success: boolean)
     */
    function fetchLikedMapsAndFolders(callback) {
        let mapsFetched = false;
        let foldersFetched = false;
        let mapsData = null;
        let foldersData = null;
        let hasFatalError = false;

        const handleError = (message, detail) => {
            console.error(message, detail);
            showError(message);
            showSyncFeedback(false);
            if (typeof callback === 'function') callback(false);
        };

        const handleFatalError = (message, detail) => {
            console.error(message, detail);
            showError(message);
            showSyncFeedback(false);
            hasFatalError = true;
            if (typeof callback === 'function') callback(false);
        };

        const checkDone = () => {
            if (!mapsFetched || !foldersFetched || hasFatalError) return;

            try {
                // Use existing data if fetch failed but we have cached data
                if (!mapsData) mapsData = likedMaps;
                if (!foldersData) foldersData = likedMapsFolders;
                // Process maps
                const likedMapIds = new Set(mapsData.map(m => m.id));
                let storedPinned;
                try {
                    storedPinned = JSON.parse(GM_getValue(CONFIG.PINNED_MAPS_STORAGE_KEY, '[]'));
                } catch (e) {
                    console.warn('Invalid pinned maps in storage, resetting.', e);
                    storedPinned = [];
                }
                const cleansedPinned = storedPinned.filter(id => likedMapIds.has(id));
                pinnedMapIds = new Set(cleansedPinned);
                GM_setValue(CONFIG.PINNED_MAPS_STORAGE_KEY, JSON.stringify(cleansedPinned));

                // Update globals
                likedMaps = mapsData;
                likedMapsFolders = foldersData || [];

                // Validate folder selection
                if (currentFolderId !== 'all' && !likedMapsFolders.some(f => f.id === currentFolderId)) {
                    currentFolderId = 'all';
                    GM_setValue(CONFIG.SELECTED_FOLDER_STORAGE_KEY, currentFolderId);
                    updateFolderButtonStyle();
                }

                GM_setValue(CONFIG.STORAGE_KEY, JSON.stringify(likedMaps));
                GM_setValue(CONFIG.FOLDERS_STORAGE_KEY, JSON.stringify(likedMapsFolders));

                filterAndSortMaps();
                initialDataLoaded = true;
                if (widgetInitialized) updateWidgetContent();
                showSyncFeedback(true);
                if (typeof callback === 'function') callback(true);
            } catch (e) {
                handleFatalError('Error processing maps/folders', e);
            }
        };

        // Fetch maps
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://www.geoguessr.com/api/v3/likes?count=0',
            headers: REQUEST_HEADERS,
            onload: function (response) {
                const ok = response.status >= 200 && response.status < 300;
                if (!ok) {
                    console.error('Failed to fetch liked maps', response.status);
                    showSyncFeedback(false);
                    mapsFetched = true;
                    checkDone();
                    return;
                }
                try {
                    mapsData = JSON.parse(response.responseText);
                    mapsFetched = true;
                    checkDone();
                } catch (e) {
                    console.error('Error parsing liked maps data', e);
                    showSyncFeedback(false);
                    mapsFetched = true;
                    checkDone();
                }
            },
            onerror: function (error) {
                console.error('Error fetching liked maps', error);
                showSyncFeedback(false);
                mapsFetched = true;
                checkDone();
            }
        });

        // Fetch folders
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://www.geoguessr.com/api/v3/likes/folders',
            headers: REQUEST_HEADERS,
            onload: function (response) {
                const ok = response.status >= 200 && response.status < 300;
                if (ok) {
                    try {
                        foldersData = JSON.parse(response.responseText);
                    } catch (e) {
                        console.error('Error parsing folders:', e);
                    }
                } else {
                    console.warn('Failed to fetch liked map folders. Status:', response.status);
                }
                foldersFetched = true;
                checkDone();
            },
            onerror: function (error) {
                console.warn('Error fetching liked map folders:', error);
                foldersFetched = true;
                checkDone();
            }
        });
    }

    /**
     * Attempts to load liked maps/folders from storage early to populate the widget.
     */
    function loadLikedMapsEarly() {
        let hasError = false;

        // Load maps
        const storedMaps = GM_getValue(CONFIG.STORAGE_KEY, null);
        if (storedMaps) {
            try {
                const parsed = JSON.parse(storedMaps);
                likedMaps = Array.isArray(parsed) ? parsed : [];
                if (!Array.isArray(parsed)) {
                    console.warn('Stored maps is not an array, resetting');
                    likedMaps = [];
                    hasError = true;
                }
            } catch (e) {
                console.error('Error parsing stored maps:', e);
                likedMaps = [];
                hasError = true;
            }
        } else {
            hasError = true;
        }

        // Load folders
        const storedFolders = GM_getValue(CONFIG.FOLDERS_STORAGE_KEY, null);
        if (storedFolders) {
            try {
                const parsed = JSON.parse(storedFolders);
                likedMapsFolders = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                console.error('Error parsing stored folders:', e);
                likedMapsFolders = [];
            }
        }

        // Load pinned maps
        const storedPinned = GM_getValue(CONFIG.PINNED_MAPS_STORAGE_KEY, '[]');
        try {
            const parsedPinned = JSON.parse(storedPinned);
            pinnedMapIds = new Set(Array.isArray(parsedPinned) ? parsedPinned : []);
        } catch (e) {
            console.error('Error parsing stored pinned maps:', e);
            pinnedMapIds = new Set();
        }

        if (hasError) {
            fetchLikedMapsAndFolders();
        } else {
            filterAndSortMaps();
            initialDataLoaded = true;
        }
    }

    // ======================
    // UI & Tooltip Management
    // ======================

    /**
     * Removes any visible tooltip.
     */
    function removeTooltip() {
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }

    /**
     * Shows a tooltip with map metadata near the triggering element.
     * @param {Object} map - Map object
     * @param {Element} element - Trigger element
     */
    function showMapTooltip(map, element) {
        removeTooltip();
        const coordinateCount = map.coordinateCount || 'Unknown';
        const updatedAt = map.updatedAt ? new Date(map.updatedAt).toLocaleDateString() : 'Unknown';
        const description = map.description || 'No description available.';
        const tags = map.tags || [];

        tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-header">
                <div class="tooltip-locations">${coordinateCount} locations</div>
                <div class="tooltip-updated">Updated: ${updatedAt}</div>
            </div>
            <div class="tooltip-description">${description}</div>
            ${tags.length > 0 ? `
                <div class="tooltip-tags">
                    ${tags.map(tag => `<span class="tooltip-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
        `;
        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const left = rect.left - tooltipRect.width;
        const top = rect.top + rect.height * 2;
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        setTimeout(() => tooltip.classList.add('visible'), 10);
    }

    /**
     * Updates visual state of folder button when a folder is selected.
     */
    function updateFolderButtonStyle() {
        const foldersButton = document.querySelector('.folders-button');
        if (!foldersButton) return;
        foldersButton.classList.toggle('active-folder', currentFolderId !== 'all');
    }

    /**
     * Shows temporary visual feedback on sync button (success/error).
     * @param {boolean} success
     */
    function showSyncFeedback(success) {
        const syncButton = document.querySelector('.sync-button');
        if (!syncButton) return;
        const iconElement = syncButton.querySelector('.button_icon_widget');
        if (!iconElement) return;
        if (!syncButton.dataset.originalIcon) {
            syncButton.dataset.originalIcon = iconElement.innerHTML;
        }

        syncButton.classList.remove('syncing', 'sync-success', 'sync-error');

        if (success) {
            iconElement.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
            syncButton.classList.add('sync-success');
        } else {
            iconElement.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
            syncButton.classList.add('sync-error');
        }

        setTimeout(() => {
            syncButton.classList.remove('sync-success', 'sync-error');
            if (syncButton.dataset.originalIcon) {
                iconElement.innerHTML = syncButton.dataset.originalIcon;
            }
        }, 2000);
    }

    /**
     * Displays an error message in the widget content area.
     * @param {string} message
     */
    function showError(message) {
        updateWidgetContent(message);
    }

    // ======================
    // Widget Management
    // ======================

    /**
     * Removes the widget and any associated UI (e.g., tooltip).
     */
    function removeWidget() {
        const widget = document.getElementById('geoguessr-liked-maps-widget');
        if (widget) widget.remove();
        removeTooltip();
        clearAutoSync();
    }

    /**
     * Queries the right sidebar container.
     * @returns {Element|null}
     */
    function getRightSidebar() {
        return document.querySelector('[class*="pro-user-start-page_right"]');
    }

    /**
     * Creates the initial skeleton of the widget DOM.
     * @returns {HTMLDivElement}
     */
    function createWidgetSkeleton() {
        const widget = document.createElement('div');
        widget.className = getClassName('widget_root');
        widget.id = 'geoguessr-liked-maps-widget';

        const widgetBorder = document.createElement('div');
        widgetBorder.className = getClassName('widget_widgetBorder');
        widgetBorder.style.setProperty('--slideInDirection', '1');

        const widgetOuter = document.createElement('div');
        widgetOuter.className = getClassName('widget_widgetOuter');

        const widgetInner = document.createElement('div');
        widgetInner.className = getClassName('widget_widgetInner');

        const header = document.createElement('div');
        header.className = getClassName('widget_header');
        header.innerHTML = `
            <div class="${getClassName('widget_title')}">
                <label style="--fs:var(--font-size-16);--lh:var(--line-height-16)" class="${getClassList('label_label')}">Liked Maps</label>
            </div>
            <div class="${getClassName('widget_rightSlot') || 'widget_rightSlot'}">
                <div class="transforming-search-container">
                    <button class="search-toggle-button" title="Search Maps">
                        <span class="button_icon_widget">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                        </span>
                    </button>
                    <input type="text" class="map-search-input hidden" placeholder="Search..." value="${searchTerm}" />
                    <button class="clear-search-button ${!searchTerm ? 'hidden' : ''}" title="Clear search">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
                <button class="folders-button" title="Select Folder">
                    <span class="button_icon_widget">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2zM4 18V6h5.17l2 2H20v10H4z"/>
                        </svg>
                    </span>
                </button>
                <div class="sort-container">
                    <button class="sort-button" title="Sort Maps">
                        <span class="button_icon_widget">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
                            </svg>
                        </span>
                    </button>
                </div>
                <button class="sync-button" title="Sync Liked Maps & Folders">
                    <span class="button_icon_widget">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26l1.45-1.45c-.42-.99-.69-2.06-.69-3.21 0-3.31 2.69-6 6-6zm6.76 1.74l-1.45 1.45c.42.99.69 2.06.69 3.21 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
                        </svg>
                    </span>
                </button>
            </div>`;

        widgetInner.appendChild(header);

        const dividerWrapper = document.createElement('div');
        dividerWrapper.className = getClassName('widget_dividerWrapper');
        widgetInner.appendChild(dividerWrapper);

        const contentArea = document.createElement('div');
        contentArea.className = 'liked-maps-content';
        contentArea.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #a0aec0;">
            <div class="loading-spinner" style="margin-bottom: 10px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26l1.45-1.45c-.42-.99-.69-2.06-.69-3.21 0-3.31 2.69-6 6-6zm6.76 1.74l-1.45 1.45c.42.99.69 2.06.69 3.21 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
                </svg>
            </div>
            <div style="font-size: 12px;">Loading liked maps...</div>
        </div>`;

        widgetInner.appendChild(contentArea);
        widgetOuter.appendChild(widgetInner);
        widgetBorder.appendChild(widgetOuter);
        widget.appendChild(widgetBorder);
        return widget;
    }

    /**
     * Updates widget content with current filtered maps or error state.
     * @param {string|null} errorMessage
     */
    function updateWidgetContent(errorMessage = null) {
        const widget = document.getElementById('geoguessr-liked-maps-widget');
        if (!widget) return;
        const contentArea = widget.querySelector('.liked-maps-content');
        if (!contentArea) return;

        let mapItemsHTML = '';
        if (errorMessage) {
            mapItemsHTML = `
                <div style="padding: 20px; text-align: center; color: #897c99ff;">
                    <div style="margin-bottom: 10px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v2z"/>
                        </svg>
                    </div>
                    <div style="font-size: 12px;">${errorMessage}</div>
                </div>`;
        } else if (!filteredMaps || filteredMaps.length === 0) {
            mapItemsHTML = `
                <div style="padding: 20px; text-align: center; color: #a0aec0;">
                    <div style="margin-bottom: 10px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l5-5-5-5v10z"/>
                        </svg>
                    </div>
                    <div style="font-size: 12px;">${likedMaps.length === 0 ? 'No liked maps found. Click sync to load your liked maps.' : 'No maps match your search.'}</div>
                </div>`;
        } else {
            filteredMaps.forEach((map) => {
                const originalIndex = likedMaps.findIndex(m => m.id === map.id);
                const creatorName = map.inExplorerMode ? '_CLASSIC_MAP_' : (map.creator?.nick || 'Unknown');
                const creatorUrl = map.inExplorerMode ? null : (map.creator?.url || null);
                const collaboratorCount = map.collaborators ? map.collaborators.length : 0;
                const creatorDisplay = collaboratorCount > 0 ?
                    `${creatorName} (+${collaboratorCount})` : creatorName;
                const backgroundClass = map.inExplorerMode ? 'map-avatar_classic' :
                    `map-avatar_${map.avatar?.background || 'day'}`;
                const isPinned = pinnedMapIds.has(map.id);
                const pinIconHtml = `
                    <div class="pin-icon ${isPinned ? 'pinned' : ''}"
                         data-map-id="${map.id}"
                         title="${isPinned ? 'Unpin map' : 'Pin map'}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </div>`;
                mapItemsHTML += `
                    <div class="liked-map-item" data-map-index="${originalIndex}">
                        ${pinIconHtml}
                        <div class="map-thumbnail ${backgroundClass}"></div>
                        <div class="liked-map-name">${map.name}</div>
                        ${map.inExplorerMode ? '<div class="official-badge">Classic</div>' :
                        creatorUrl ? `<a href="${creatorUrl}" class="liked-map-creator" onclick="event.stopPropagation();">${creatorDisplay}</a>` :
                            `<div class="liked-map-creator">${creatorDisplay}</div>`
                    }
                        <div class="liked-map-info-icon" data-map-index="${originalIndex}">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                            </svg>
                        </div>
                    </div>`;
            });
        }

        const clearButton = widget.querySelector('.clear-search-button');
        if (clearButton) {
            clearButton.classList.toggle('hidden', !searchTerm);
        }

        contentArea.innerHTML = `<div style="padding: 6px 8px 12px 8px;">${mapItemsHTML}</div>`;
        attachMapItemListeners(contentArea);
    }

    /**
     * Inserts widget into the right sidebar, returning success state.
     * @param {Element} widget
     * @returns {boolean}
     */
    function mountInSidebar(widget) {
        const rightSidebar = getRightSidebar();
        if (!rightSidebar) return false;
        const existing = rightSidebar.querySelector('#geoguessr-liked-maps-widget');
        if (existing) existing.remove();
        rightSidebar.prepend(widget);
        return true;
    }

    /**
     * Creates and mounts the widget if on home page.
     * @returns {Element|null}
     */
    function createWidget() {
        if (!isHomePage()) {
            removeWidget();
            return null;
        }

        const rightSidebar = getRightSidebar();
        if (!rightSidebar) return null;
        removeWidget();

        const widget = createWidgetSkeleton();
        if (mountInSidebar(widget)) {
            setupWidgetInteractions(widget);
            widgetInitialized = true;

            setTimeout(() => {
                const widgetBorder = widget.querySelector('[class*="widget_widgetBorder"]');
                if (widgetBorder) {
                    widgetBorder.classList.remove(getClassName('widget_hasLoaded'));
                    void widgetBorder.offsetWidth;
                    widgetBorder.classList.add(getClassName('widget_hasLoaded'));
                }
                updateWidgetContent();
            }, 50);

            // Fallback content update
            setTimeout(() => {
                const contentArea = widget.querySelector('.liked-maps-content');
                if (contentArea && contentArea.innerHTML.includes('Loading liked maps...')) {
                    console.log('GeoGuessr Liked Maps Widget: Fallback content update triggered');
                    updateWidgetContent();
                }
            }, 2000);
            return widget;
        }
        return null;
    }

    // ======================
    // Widget Interaction Handlers
    // ======================

    /**
     * Clears the current search term and updates the widget.
     */
    function clearSearch() {
        searchTerm = '';
        filterAndSortMaps();
        updateWidgetContent();
        const searchInput = document.querySelector('.map-search-input');
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
    }

    /**
     * Attaches event listeners to map items (click, tooltip, pin).
     * @param {Element} container
     */
    function attachMapItemListeners(container) {
        const mapItems = container.querySelectorAll('.liked-map-item');
        mapItems.forEach(item => {
            item.addEventListener('click', function (e) {
                if (!e.target.closest('.liked-map-info-icon') && !e.target.closest('.pin-icon')) {
                    const mapIndex = this.dataset.mapIndex;
                    const map = likedMaps[mapIndex];
                    if (!map?.url) return;
                    e.preventDefault();
                    if (e.ctrlKey || e.metaKey) {
                        window.open(map.url, '_blank');
                    } else if (e.button === 0) {
                        window.location.href = map.url;
                    }
                }
            });
        });

        const infoIcons = container.querySelectorAll('.liked-map-info-icon');
        infoIcons.forEach(icon => {
            icon.addEventListener('mouseover', function (e) {
                const mapIndex = this.dataset.mapIndex;
                if (mapIndex !== undefined && likedMaps[mapIndex]) {
                    showMapTooltip(likedMaps[mapIndex], this);
                }
            });
            icon.addEventListener('mouseout', removeTooltip);
        });

        const pinIcons = container.querySelectorAll('.pin-icon');
        pinIcons.forEach(pinIcon => {
            pinIcon.addEventListener('click', function (e) {
                e.stopPropagation();
                const mapId = this.getAttribute('data-map-id');
                const isPinned = pinnedMapIds.has(mapId);
                if (isPinned) {
                    pinnedMapIds.delete(mapId);
                    this.classList.remove('pinned');
                    this.setAttribute('title', 'Pin map');
                } else {
                    pinnedMapIds.add(mapId);
                    this.classList.add('pinned');
                    this.setAttribute('title', 'Unpin map');
                }
                GM_setValue(CONFIG.PINNED_MAPS_STORAGE_KEY, JSON.stringify([...pinnedMapIds]));
                filterAndSortMaps();
                updateWidgetContent();
            });
        });
    }

    /**
     * Sets up all interactive elements in the widget (buttons, inputs, dropdowns).
     * @param {Element} widget
     */
    function setupWidgetInteractions(widget) {
        let activeSortDropdown = null;
        let activeFoldersDropdown = null;
        let sortOutsideClickHandler = null;
        let foldersOutsideClickHandler = null;

        const closeAllDropdowns = () => {
            const closeDropdown = (dropdown, handler, setter) => {
                if (dropdown?.parentNode) dropdown.parentNode.remove();
                if (handler) document.removeEventListener('click', handler);
                setter(null);
            };
            closeDropdown(activeSortDropdown, sortOutsideClickHandler, d => { activeSortDropdown = d; sortOutsideClickHandler = null; });
            closeDropdown(activeFoldersDropdown, foldersOutsideClickHandler, d => { activeFoldersDropdown = d; foldersOutsideClickHandler = null; });
            activeSortDropdown = null;
            activeFoldersDropdown = null;
            sortOutsideClickHandler = null;
            foldersOutsideClickHandler = null;
        };

        document.addEventListener('click', (ev) => {
            const widgetEl = document.getElementById('geoguessr-liked-maps-widget');
            if (widgetEl && !widgetEl.contains(ev.target)) closeAllDropdowns();
        });

        // === Folders Dropdown ===
        const foldersButton = widget.querySelector('.folders-button');
        if (foldersButton) {
            foldersButton.addEventListener('click', function (e) {
                e.stopPropagation();
                if (activeFoldersDropdown) {
                    closeAllDropdowns();
                    return;
                }
                closeAllDropdowns();

                const folderDropdown = document.createElement('div');
                folderDropdown.className = 'folder-dropdown body-dropdown visible';

                const fragment = document.createDocumentFragment();
                const allOption = document.createElement('div');
                allOption.className = 'folder-option';
                allOption.innerHTML = `
                    <label class="folder-radio-label">
                        <input type="radio" name="folder" value="all">
                        <span class="radio-custom"></span>
                        <span class="folder-label-text">All (${likedMaps.length})</span>
                    </label>`;
                fragment.appendChild(allOption);

                likedMapsFolders.forEach(folder => {
                    const count = folder.likeIds?.length || 0;
                    const opt = document.createElement('div');
                    opt.className = 'folder-option';
                    opt.innerHTML = `
                        <label class="folder-radio-label">
                            <input type="radio" name="folder" value="${folder.id}">
                            <span class="radio-custom"></span>
                            <span class="folder-label-text">${folder.displayName} (${count})</span>
                        </label>`;
                    fragment.appendChild(opt);
                });

                folderDropdown.appendChild(fragment);
                folderDropdown.querySelectorAll('input[name="folder"]').forEach(radio => {
                    radio.checked = radio.value === currentFolderId;
                    radio.addEventListener('change', function () {
                        if (this.checked) {
                            currentFolderId = this.value;
                            GM_setValue(CONFIG.SELECTED_FOLDER_STORAGE_KEY, currentFolderId);
                            filterAndSortMaps();
                            updateWidgetContent();
                            updateFolderButtonStyle();
                            closeAllDropdowns();
                        }
                    });
                });

                const container = document.createElement('div');
                container.className = 'folder-container';
                container.style.position = 'absolute';
                container.style.zIndex = '3';
                const rect = foldersButton.getBoundingClientRect();
                const parentRect = foldersButton.offsetParent?.getBoundingClientRect() || rect;
                container.style.top = `${rect.bottom - parentRect.top}px`;
                container.style.right = `${parentRect.right - rect.right - 54}px`;
                container.appendChild(folderDropdown);
                folderDropdown.style.cssText = 'position:relative;top:2px;right:0;min-width:' + Math.max(130, rect.width) + 'px';
                foldersButton.offsetParent?.appendChild(container);
                activeFoldersDropdown = folderDropdown;

                foldersOutsideClickHandler = (ev) => {
                    const dropdownContainer = activeFoldersDropdown?.parentNode;
                    if (!dropdownContainer || dropdownContainer.contains(ev.target) || foldersButton.contains(ev.target)) return;
                    closeAllDropdowns();
                };
                setTimeout(() => document.addEventListener('click', foldersOutsideClickHandler), 10);
            });
        }
        updateFolderButtonStyle();

        // === Sort Dropdown ===
        const sortButton = widget.querySelector('.sort-button');
        if (sortButton) {
            const sortOptions = [
                { value: 'default', label: 'Default' },
                { value: 'a-z', label: 'A-Z' },
                { value: 'z-a', label: 'Z-A' },
                { value: 'creator', label: 'Creator' },
                { value: 'updated', label: 'Last Updated' }
            ];

            sortButton.addEventListener('click', function (e) {
                e.stopPropagation();
                if (activeSortDropdown) {
                    closeAllDropdowns();
                    return;
                }
                closeAllDropdowns();

                activeSortDropdown = document.createElement('div');
                activeSortDropdown.className = 'sort-dropdown body-dropdown visible';
                activeSortDropdown.innerHTML = sortOptions.map(opt => `
                    <div class="sort-option">
                        <label class="sort-radio-label">
                            <input type="radio" name="sort" value="${opt.value}" ${opt.value === currentSort ? 'checked' : ''}>
                            <span class="radio-custom"></span>
                            <span class="sort-label-text">${opt.label}</span>
                        </label>
                    </div>
                `).join('');

                activeSortDropdown.querySelectorAll('input[name="sort"]').forEach(radio => {
                    radio.addEventListener('change', function () {
                        if (this.checked) {
                            currentSort = this.value;
                            GM_setValue(CONFIG.SORT_STORAGE_KEY, currentSort);
                            filterAndSortMaps();
                            updateWidgetContent();
                            closeAllDropdowns();
                        }
                    });
                });

                const sortContainer = document.createElement('div');
                sortContainer.className = 'sort-container';
                sortContainer.style.cssText = 'position:absolute;z-index:3;';
                const rect = sortButton.getBoundingClientRect();
                const parentRect = sortButton.offsetParent?.getBoundingClientRect() || rect;
                sortContainer.style.top = `${rect.bottom - parentRect.top}px`;
                sortContainer.style.right = `${parentRect.right - rect.right - 54}px`;
                sortContainer.appendChild(activeSortDropdown);
                activeSortDropdown.style.cssText = 'position:relative;top:2px;right:0;min-width:' + Math.max(130, rect.width) + 'px';
                sortButton.offsetParent?.appendChild(sortContainer);

                sortOutsideClickHandler = (ev) => {
                    const container = activeSortDropdown?.parentNode;
                    if (!container || container.contains(ev.target) || sortButton.contains(ev.target)) return;
                    closeAllDropdowns();
                };
                setTimeout(() => document.addEventListener('click', sortOutsideClickHandler), 10);
            });
        }

        // === Sync Button ===
        const syncButton = widget.querySelector('.sync-button');
        if (syncButton) {
            syncButton.addEventListener('click', function () {
                closeAllDropdowns();
                this.classList.add('syncing');
                clearAutoSync();
                fetchLikedMapsAndFolders((success) => {
                    if (success) {
                        lastSyncTimestamp = Date.now();
                        GM_setValue('geoguessr_last_sync_timestamp', lastSyncTimestamp);
                    }
                    startAutoSync();
                });
            });
        }

        // === Search Input ===
        const searchInput = widget.querySelector('.map-search-input');
        if (searchInput) {
            if (searchTerm) setTimeout(() => searchInput.focus(), 100);
            const debouncedSearch = debounce(() => {
                filterAndSortMaps();
                updateWidgetContent();
            }, 300);
            searchInput.addEventListener('input', () => {
                searchTerm = trimSpecialCharacters(searchInput.value).toLowerCase();
                debouncedSearch();
            });
        }

        // === Clear Search ===
        const clearButton = widget.querySelector('.clear-search-button');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                closeAllDropdowns();
                clearSearch();
            });
        }

        // === Search Toggle ===
        const searchToggleButton = widget.querySelector('.search-toggle-button');
        const transformingSearchContainer = widget.querySelector('.transforming-search-container');
        if (searchToggleButton && searchInput) {
            let isSearchExpanded = !!searchTerm;
            const toggleSearch = (expand = !isSearchExpanded) => {
                if (expand) {
                    transformingSearchContainer.classList.add('expanded');
                    searchInput.classList.remove('hidden');
                    searchInput.focus();
                    isSearchExpanded = true;
                } else {
                    transformingSearchContainer.classList.remove('expanded');
                    searchInput.classList.add('hidden');
                    isSearchExpanded = false;
                }
            };

            searchToggleButton.addEventListener('click', (e) => {
                e.stopPropagation();
                closeAllDropdowns();
                toggleSearch();
            });

            searchInput.addEventListener('focusout', () => {
                setTimeout(() => {
                    if (isSearchExpanded && !searchTerm) {
                        const active = document.activeElement;
                        if (![searchInput, searchToggleButton, clearButton].includes(active)) {
                            toggleSearch(false);
                        }
                    }
                }, 0);
            });
        }
    }

    // ======================
    // Page & Observer Management
    // ======================

    /**
     * Checks for page navigation and reinitializes widget if needed.
     */
    function checkPageChange() {
        if (window.location.pathname !== currentPathname) {
            currentPathname = window.location.pathname;
            if (!isHomePage()) {
                removeWidget();
                widgetInitialized = false;
                clearAutoSync();
            } else {
                setTimeout(tryInitializeWidget, 200);
            }
        }
    }

    /**
     * Attempts to initialize the widget if conditions are met.
     */
    function tryInitializeWidget() {
        if (!isHomePage()) return;
        const existingWidget = document.getElementById('geoguessr-liked-maps-widget');
        const rightSidebar = getRightSidebar();
        if (!existingWidget && rightSidebar) {
            widgetInitialized = false;
            setTimeout(() => {
                const freshWidget = createWidget();
                if (freshWidget && !autoSyncTimerId) {
                    startAutoSync();
                    widgetInitialized = true;
                }
            }, 100);
        } else if (existingWidget && rightSidebar) {
            const widgetBorder = existingWidget.querySelector('[class*="widget_widgetBorder"]');
            if (widgetBorder) {
                widgetBorder.classList.remove(getClassName('widget_hasLoaded'));
                void widgetBorder.offsetWidth;
                widgetBorder.classList.add(getClassName('widget_hasLoaded'));
            }
            setTimeout(() => {
                const contentArea = existingWidget.querySelector('.liked-maps-content');
                if (contentArea && contentArea.innerHTML.includes('Loading liked maps...')) {
                    updateWidgetContent();
                }
            }, 1000);
        }
    }

    /**
     * Main initialization logic with fallbacks.
     */
    function initializeWidget() {
        if (widgetInitialized || !isHomePage()) return;
        if (!initialDataLoaded) loadLikedMapsEarly();

        const checkReady = setInterval(() => {
            const rightSidebar = getRightSidebar();
            if (rightSidebar && rightSidebar.offsetWidth > 0) {
                clearInterval(checkReady);
                const widget = createWidget();
                if (widget) {
                    startAutoSync();
                    setTimeout(() => {
                        const widgetBorder = widget.querySelector('[class*="widget_widgetBorder"]');
                        if (widgetBorder) widgetBorder.classList.add(getClassName('widget_hasLoaded'));
                    }, 50);
                    widgetInitialized = true;
                }
            }
        }, 100);

        setTimeout(() => {
            clearInterval(checkReady);
            if (!widgetInitialized) {
                console.log("GeoGuessr Liked Maps Widget: Fallback initialization triggered.");
                const widget = createWidget();
                if (widget) {
                    startAutoSync();
                    widgetInitialized = true;
                }
            }
        }, 2000);
    }

    // ======================
    // Styling
    // ======================

    /**
     * Injects all required CSS styles into the document head.
     */
    function addCustomStyles() {
        const styles = `
        [class*="pro-user-start-page_right"] {
            box-sizing: border-box !important;
        }
        #geoguessr-liked-maps-widget {
            position: relative;
            flex: 1 1 0;
            min-height: 130px;
            max-height: 648px;
        }
        #geoguessr-liked-maps-widget [class*="widget_widgetBorder"] {
            --slideInDirection: -1;
            -webkit-backdrop-filter: blur(.5rem);
            backdrop-filter: blur(.5rem);
            background: color-mix(in srgb, var(--ds-color-purple-100) 90%, transparent);
            border: .0625rem solid var(--ds-color-purple-80, var(--ds-color-purple-80));
            border-radius: 1rem;
            min-height: 1rem;
            height: 100%;
            opacity: 0;
            padding: .25rem;
            transform: translateX(calc(110% * min(var(--slideInDirection), var(--allElementsOnLeftSide))));
            transition: all .75s cubic-bezier(.44,0,0,1);
            animation: forceSlideIn 0.75s cubic-bezier(.44,0,0,1) 2s forwards;
            display: flex;
            flex-direction: column;
        }
        #geoguessr-liked-maps-widget [class*="widget_widgetBorder"][class*="widget_hasLoaded"] {
            opacity: 1;
            transform: translateX(0);
            animation: none;
        }
        #geoguessr-liked-maps-widget [class*="widget_widgetBorder"][class*="widget_slideInRight"] {
            --slideInDirection: 1;
        }
        @keyframes forceSlideIn {
            0% { opacity: 0; transform: translateX(calc(110% * min(var(--slideInDirection), var(--allElementsOnLeftSide)))); }
            100% { opacity: 1; transform: translateX(0); }
        }
        #geoguessr-liked-maps-widget [class*="widget_widgetOuter"] {
            background: linear-gradient(hsla(0,0%,100%,.039), hsla(0,0%,100%,.012) 2.5rem);
            border-radius: .75rem;
            box-shadow: inset 0 0 .25rem var(--ds-color-purple-70);
            height: 100%;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
            width: 100%;
            display: flex;
            flex-direction: column;
        }
        #geoguessr-liked-maps-widget [class*="widget_widgetInner"] {
            --padding: 1rem;
            display: flex;
            flex-direction: column;
            position: relative;
            height: 100%;
            min-height: 0;
        }
        #geoguessr-liked-maps-widget [class*="widget_header"] {
            align-items: center;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            min-height: 1.5rem;
            padding: calc(var(--padding)*.75) var(--padding) calc(var(--padding)*.5);
            flex-shrink: 0;
        }
        #geoguessr-liked-maps-widget [class*="widget_header"] [class*="widget_title"] {
            position: relative;
        }
        #geoguessr-liked-maps-widget [class*="widget_header"] > [class*="widget_rightSlot"] > a,
        #geoguessr-liked-maps-widget [class*="widget_header"] > [class*="widget_rightSlot"] > button {
            margin: 0 !important;
        }
        #geoguessr-liked-maps-widget [class*="widget_rightSlot"] {
            display: flex;
            gap: 8px !important;
        }
        #geoguessr-liked-maps-widget [class*="widget_dividerWrapper"] {
            margin: 0 var(--padding);
            width: calc(100% - var(--padding)*2);
            flex-shrink: 0;
        }
        #geoguessr-liked-maps-widget .loading-spinner {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        #geoguessr-liked-maps-widget .sort-button,
        #geoguessr-liked-maps-widget .sync-button,
        #geoguessr-liked-maps-widget .folders-button {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 28px !important;
            width: 28px !important;
            min-width: 28px !important;
            padding: 0 !important;
            border: none !important;
            box-sizing: border-box !important;
            margin-top: 0px !important;
            border-radius: 50% !important;
        }
        #geoguessr-liked-maps-widget .sort-button,
        #geoguessr-liked-maps-widget .sync-button,
        #geoguessr-liked-maps-widget .folders-button,
        #geoguessr-liked-maps-widget .search-toggle-button {
            background: rgba(255, 255, 255, 0.1);
            color: #e2e8f0;
        }
        #geoguessr-liked-maps-widget .sort-button:hover,
        #geoguessr-liked-maps-widget .sync-button:hover,
        #geoguessr-liked-maps-widget .folders-button:hover,
        #geoguessr-liked-maps-widget .search-toggle-button:hover {
            background: rgba(255, 255, 255, 0.15);
            cursor: pointer;
        }
        #geoguessr-liked-maps-widget .button_icon_widget {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 14px !important;
            height: 14px !important;
            margin: 0 !important;
        }
        #geoguessr-liked-maps-widget .button_icon_widget svg {
            width: 100%;
            height: 100%;
            display: block;
        }
        #geoguessr-liked-maps-widget .sync-button.sync-success {
            animation: pulseSuccess 0.5s ease-in-out;
            background: #48bb78 !important;
            color: white !important;
        }
        #geoguessr-liked-maps-widget .sync-button.sync-error {
            animation: pulseError 0.5s ease-in-out;
            background: #f56565 !important;
            color: white !important;
        }
        @keyframes pulseSuccess {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
            50% { transform: scale(1.05); }
            70% { box-shadow: 0 0 0 10px rgba(72, 187, 120, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
        }
        @keyframes pulseError {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 101, 101, 0.7); }
            50% { transform: scale(1.05); }
            70% { box-shadow: 0 0 0 10px rgba(245, 101, 101, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 101, 101, 0); }
        }
        #geoguessr-liked-maps-widget .sync-button.syncing {
            animation: spin 1s linear infinite;
        }
        #geoguessr-liked-maps-widget .transforming-search-container {
            position: relative;
            display: flex;
            align-items: center;
            height: 28px;
            width: 28px;
            transition: width 0.3s ease;
        }
        #geoguessr-liked-maps-widget .search-toggle-button {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 28px !important;
            width: 28px !important;
            min-width: 28px !important;
            padding: 0 !important;
            border: none !important;
            box-sizing: border-box !important;
            margin-top: 0px !important;
            border-radius: 50% !important;
            cursor: pointer;
        }
        #geoguessr-liked-maps-widget .map-search-input {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            color: #e2e8f0;
            padding: 6px 8px 6px 28px;
            font-size: 12px;
            font-family: 'ggfont', sans-serif;
            height: 28px;
            width: 100%;
            box-sizing: border-box;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.15s ease, transform 0.15s ease;
        }
        #geoguessr-liked-maps-widget .transforming-search-container.expanded {
            width: 112px;
        }
        #geoguessr-liked-maps-widget .transforming-search-container.expanded .search-toggle-button {
            background: transparent !important;
            border: none !important;
            color: #a0aec0 !important;
        }
        #geoguessr-liked-maps-widget .transforming-search-container.expanded .map-search-input {
            opacity: 1;
            pointer-events: all;
            transform: translateX(0);
        }
        #geoguessr-liked-maps-widget .clear-search-button {
            position: absolute;
            right: 6px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #a0aec0;
            background: #202020;
            cursor: pointer;
            padding: 2px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
            z-index: 2;
        }
        #geoguessr-liked-maps-widget .clear-search-button:hover {
            color: #a0aec0;
            transform: scale(1.1) translateY(-50%);
        }
        #geoguessr-liked-maps-widget .clear-search-button.hidden {
            display: none;
        }
        #geoguessr-liked-maps-widget .sort-container {
            position: relative;
            display: flex;
            align-items: center;
            z-index: 3;
        }
        #geoguessr-liked-maps-widget .sort-dropdown,
        #geoguessr-liked-maps-widget .folder-dropdown {
            position: relative;
            background: #2d3748;
            border: 1px solid #4a5568;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            min-width: 130px;
            opacity: 0;
            transition: opacity 0.15s ease;
            z-index: 4;
        }
        #geoguessr-liked-maps-widget .sort-dropdown.visible,
        #geoguessr-liked-maps-widget .folder-dropdown.visible {
            opacity: 1;
        }
        #geoguessr-liked-maps-widget .sort-option,
        #geoguessr-liked-maps-widget .folder-option {
            padding: 0;
        }
        #geoguessr-liked-maps-widget .sort-radio-label,
        #geoguessr-liked-maps-widget .folder-radio-label {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            font-size: 12px;
            color: #e2e8f0;
            cursor: pointer;
            transition: background 0.15s ease;
            user-select: none;
        }
        #geoguessr-liked-maps-widget .sort-radio-label:hover,
        #geoguessr-liked-maps-widget .folder-radio-label:hover {
            background: rgba(255, 255, 255, 0.08);
        }
        #geoguessr-liked-maps-widget .sort-radio-label input[type="radio"],
        #geoguessr-liked-maps-widget .folder-radio-label input[type="radio"] {
            display: none;
        }
        #geoguessr-liked-maps-widget .radio-custom {
            width: 12px;
            height: 12px;
            border: 2px solid #a0aec0;
            border-radius: 50%;
            position: relative;
            flex-shrink: 0;
            transition: all 0.15s ease;
        }
        #geoguessr-liked-maps-widget .sort-dropdown .sort-radio-label input[type="radio"]:checked + .radio-custom,
        #geoguessr-liked-maps-widget .folder-dropdown .folder-radio-label input[type="radio"]:checked + .radio-custom {
            border-color: #63b3ed;
            background: #63b3ed;
        }
        #geoguessr-liked-maps-widget .sort-dropdown .sort-radio-label input[type="radio"]:checked + .radio-custom::after,
        #geoguessr-liked-maps-widget .folder-dropdown .folder-radio-label input[type="radio"]:checked + .radio-custom::after {
            content: '';
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        #geoguessr-liked-maps-widget .sort-label-text,
        #geoguessr-liked-maps-widget .folder-label-text {
            min-width: 80px;
            margin-left: 8px;
            flex-grow: 1;
        }
        #geoguessr-liked-maps-widget .liked-maps-content {
            flex: 1;
            overflow-y: auto;
            min-height: 0;
        }
        #geoguessr-liked-maps-widget .liked-map-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 10px;
            border-radius: 8px;
            margin-bottom: 3px;
            cursor: pointer;
            transition: all 0.15s ease;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
        }
        #geoguessr-liked-maps-widget .liked-map-item:hover {
            background: rgba(255, 255, 255, 0.08) !important;
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        #geoguessr-liked-maps-widget .pin-icon {
            width: 16px;
            height: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.15s ease;
            opacity: 1;
            padding: 6px;
            margin: -6px;
        }
        #geoguessr-liked-maps-widget .pin-icon:hover {
            transform: scale(1.1);
        }
        #geoguessr-liked-maps-widget .pin-icon:active {
            transform: scale(1.2);
        }
        #geoguessr-liked-maps-widget .pin-icon svg {
            width: 100%;
            height: 100%;
            display: block;
            fill: transparent;
            stroke: #a0aec0;
            stroke-width: 1.5;
            transition: all 0.15s ease;
        }
        #geoguessr-liked-maps-widget .pin-icon:hover svg {
            stroke: #e2e8f0;
            filter: drop-shadow(0 0 3px rgba(226, 232, 240, 0.5));
        }
        #geoguessr-liked-maps-widget .pin-icon.pinned svg {
            fill: #f8bf02;
            stroke: none;
            filter: drop-shadow(0 0 4px rgba(248, 191, 2, 0.6));
            animation: gentle-shimmer 3s ease-in-out infinite;
        }
        #geoguessr-liked-maps-widget .pin-icon.pinned:hover svg {
            fill: #ffd700;
            filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.8));
            animation: none;
        }
        @keyframes gentle-shimmer {
            0%, 100% { filter: drop-shadow(0 0 4px rgba(248, 191, 2, 0.6)); }
            50% { filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.4)) drop-shadow(0 0 2px rgba(255, 255, 255, 0.3)); }
        }
        #geoguessr-liked-maps-widget .map-avatar_day { background: #d4eaed; }
        #geoguessr-liked-maps-widget .map-avatar_morning { background: linear-gradient(180deg, #c2db9c, #6eafe0); }
        #geoguessr-liked-maps-widget .map-avatar_evening { background: linear-gradient(180deg, #a25e92, #01354b); }
        #geoguessr-liked-maps-widget .map-avatar_night { background: #01354b; }
        #geoguessr-liked-maps-widget .map-avatar_darknight { background: linear-gradient(180deg, #3c1d35, #01354b); }
        #geoguessr-liked-maps-widget .map-avatar_sunrise { background: linear-gradient(180deg, #f8ab12, #e7861f); }
        #geoguessr-liked-maps-widget .map-avatar_sunset { background: linear-gradient(180deg, #b34692, #ec6079); }
        #geoguessr-liked-maps-widget .map-avatar_classic { background: #c52626; }
        #geoguessr-liked-maps-widget .map-thumbnail {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2px solid white;
            flex-shrink: 0;
        }
        #geoguessr-liked-maps-widget .liked-map-name {
            font-size: 12px;
            font-weight: 600;
            color: #e2e8f0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 1;
            min-width: 0;
        }
        #geoguessr-liked-maps-widget .liked-map-creator {
            font-size: 11px;
            color: var(--ds-color-white-40);
            font-style: italic;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: auto;
            min-width: unset;
            text-align: right;
            margin-right: 4px;
            text-decoration: none;
            transition: color 0.15s ease;
        }
        #geoguessr-liked-maps-widget .liked-map-creator:hover {
            color: #e2e8f0 !important;
            transform: scale(1.05);
        }
        #geoguessr-liked-maps-widget .official-badge {
            background: linear-gradient(135deg, #9900ffff, #6b03a7ff);
            color: #ffffffff !important;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 3px 6px;
            border-radius: 4px;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 4px rgba(174, 0, 255, 0.3);
            margin-left: auto;
            white-space: nowrap;
        }
        #geoguessr-liked-maps-widget .liked-map-info-icon {
            width: 14px;
            height: 14px;
            color: #a0aec0;
            cursor: help;
            opacity: 0.7;
            transition: all 0.15s ease;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #geoguessr-liked-maps-widget .liked-map-info-icon:hover {
            opacity: 1;
            color: #e2e8f0;
            transform: scale(1.1);
        }
        #geoguessr-liked-maps-widget .liked-maps-content::-webkit-scrollbar {
            width: 8px;
        }
        #geoguessr-liked-maps-widget .liked-maps-content::-webkit-scrollbar-track {
            background: transparent;
        }
        #geoguessr-liked-maps-widget .liked-maps-content::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            border: 2px solid transparent;
            background-clip: padding-box;
        }
        #geoguessr-liked-maps-widget .liked-maps-content::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        #geoguessr-liked-maps-widget .liked-maps-content::-webkit-scrollbar-button {
            display: none;
        }
        #geoguessr-liked-maps-widget .liked-maps-content {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }
        .map-tooltip {
            position: fixed;
            background: #2d3748;
            border: 1px solid #4a5568;
            border-radius: 6px;
            padding: 12px;
            font-size: 12px;
            color: #e2e8f0;
            max-width: 300px;
            min-width: 250px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        .map-tooltip.visible {
            opacity: 1;
        }
        .tooltip-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-weight: 600;
        }
        .tooltip-locations {
            color: #63b3ed;
        }
        .tooltip-updated {
            color: #a0aec0;
            font-size: 11px;
        }
        .tooltip-description {
            margin-bottom: 12px;
            line-height: 1.4;
        }
        .tooltip-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: 12px;
        }
        .tooltip-tag {
            background: rgba(255, 255, 255, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
        }
        #geoguessr-liked-maps-widget .folders-button.active-folder {
            outline: 1px solid rgba(255, 255, 255, 0.33) !important;
            outline-offset: -1px;
            border-radius: 50%;
        }`;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // ======================
    // Main Init
    // ======================

    function init() {
        addCustomStyles();
        loadLikedMapsEarly();

        const sidebarObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    const mightContainSidebar = addedNodes.some(node =>
                        node.nodeType === Node.ELEMENT_NODE &&
                        (node.matches('[class*="pro-user-start-page_right"]') ||
                            node.querySelector?.('[class*="pro-user-start-page_right"]'))
                    );
                    if (mightContainSidebar && isHomePage()) {
                        tryInitializeWidget();
                    }
                }
            }
        });
        sidebarObserver.observe(document.body, { childList: true, subtree: true });

        let lastUrl = location.href;
        const urlObserver = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                checkPageChange();
            }
        });
        urlObserver.observe(document, { subtree: true, childList: true });

        initializeWidget();
    }

    window.addEventListener('load', init);
})();