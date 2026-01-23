// ==UserScript==
// @name         qBittorrent Healthy Torrent Marker
// @namespace    https://github.com/MankeyDoodle
// @version      3.3
// @description  Highlights torrents in qBittorrent WebUI based on seeder count health status using API. Color-codes torrents by swarm health (critical, at-risk, moderate, healthy, very healthy) with a draggable legend panel.
// @author       MankeyDoodle
// @license      MIT
// @homepageURL  https://github.com/MankeyDoodle/qbittorrent-healthy-torrent-marker
// @supportURL   https://github.com/MankeyDoodle/qbittorrent-healthy-torrent-marker/issues
// @match        *://localhost:*/
// @match        *://localhost:*/*
// @match        *://127.0.0.1:*/
// @match        *://127.0.0.1:*/*
// @match        *://*/qbittorrent/
// @match        *://*/qbittorrent/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563605/qBittorrent%20Healthy%20Torrent%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/563605/qBittorrent%20Healthy%20Torrent%20Marker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Immediate log to confirm script is running
    console.log('=== qBittorrent Health Marker: Script loaded ===');
    console.log('URL:', window.location.href);

    // Settings with defaults
    // Positions: 'top-right', 'top-left', 'bottom-right', 'bottom-left'
    let settings = {
        enabled: true,
        position: 'top-right',
        minimized: false
    };

    // Load saved settings
    function loadSettings() {
        settings.enabled = GM_getValue('healthMarker_enabled', true);
        settings.position = GM_getValue('healthMarker_position', 'top-right');
        settings.minimized = GM_getValue('healthMarker_minimized', false);
    }

    // Save settings
    function saveSettings() {
        GM_setValue('healthMarker_enabled', settings.enabled);
        GM_setValue('healthMarker_position', settings.position);
        GM_setValue('healthMarker_minimized', settings.minimized);
    }

    // Store torrent data from API
    let torrentData = {};

    // Add custom styles
    GM_addStyle(`
        /* Row highlighting based on health - only when enabled */
        body.health-marker-enabled tr.torrent-critical,
        body.health-marker-enabled tr.torrent-critical td {
            background-color: rgba(255, 0, 0, 0.2) !important;
        }
        body.health-marker-enabled tr.torrent-critical td:first-child {
            border-left: 4px solid #cc0000 !important;
        }

        body.health-marker-enabled tr.torrent-at-risk,
        body.health-marker-enabled tr.torrent-at-risk td {
            background-color: rgba(255, 193, 7, 0.2) !important;
        }
        body.health-marker-enabled tr.torrent-at-risk td:first-child {
            border-left: 4px solid #ffc107 !important;
        }

        body.health-marker-enabled tr.torrent-moderate,
        body.health-marker-enabled tr.torrent-moderate td {
            background-color: rgba(0, 102, 204, 0.15) !important;
        }
        body.health-marker-enabled tr.torrent-moderate td:first-child {
            border-left: 4px solid #0066cc !important;
        }

        body.health-marker-enabled tr.torrent-healthy,
        body.health-marker-enabled tr.torrent-healthy td {
            background-color: rgba(40, 167, 69, 0.15) !important;
        }
        body.health-marker-enabled tr.torrent-healthy td:first-child {
            border-left: 4px solid #28a745 !important;
        }

        body.health-marker-enabled tr.torrent-very-healthy,
        body.health-marker-enabled tr.torrent-very-healthy td {
            background-color: rgba(21, 87, 36, 0.2) !important;
        }
        body.health-marker-enabled tr.torrent-very-healthy td:first-child {
            border-left: 4px solid #155724 !important;
        }

        /* Torrents still seeding (not yet met 24h or ratio requirements) */
        body.health-marker-enabled tr.torrent-seeding,
        body.health-marker-enabled tr.torrent-seeding td {
            background-color: rgba(128, 128, 128, 0.15) !important;
        }
        body.health-marker-enabled tr.torrent-seeding td:first-child {
            border-left: 4px solid #888888 !important;
        }

        /* Legend panel */
        #health-legend {
            position: fixed;
            background: rgba(30, 30, 30, 0.95);
            border: 1px solid #555;
            border-radius: 8px;
            padding: 12px;
            z-index: 99999;
            font-size: 11px;
            color: #fff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            min-width: 200px;
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
        }
        #health-legend.position-top-right {
            top: 60px;
            right: 10px;
            bottom: auto;
            left: auto;
        }
        #health-legend.position-top-left {
            top: 60px;
            left: 10px;
            bottom: auto;
            right: auto;
        }
        #health-legend.position-bottom-right {
            bottom: 10px;
            right: 10px;
            top: auto;
            left: auto;
        }
        #health-legend.position-bottom-left {
            bottom: 10px;
            left: 10px;
            top: auto;
            right: auto;
        }
        #health-legend h4 {
            margin: 0 0 10px 0;
            color: #fff;
            font-size: 14px;
            border-bottom: 1px solid #555;
            padding-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #health-legend .header-title {
            flex-grow: 1;
        }
        #health-legend .header-controls {
            display: flex;
            gap: 5px;
        }
        #health-legend .header-btn {
            background: #444;
            border: none;
            color: #fff;
            width: 22px;
            height: 22px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #health-legend .header-btn:hover {
            background: #666;
        }
        #health-legend .header-btn.active {
            background: #0066cc;
        }
        #health-legend .legend-item {
            display: flex;
            align-items: center;
            margin: 6px 0;
            padding: 3px 0;
        }
        #health-legend .legend-color {
            width: 18px;
            height: 18px;
            margin-right: 10px;
            border-radius: 3px;
            flex-shrink: 0;
        }
        #health-legend .legend-text {
            flex-grow: 1;
        }
        #health-legend .legend-count {
            background: #555;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: bold;
        }
        #health-legend .btn-row {
            display: flex;
            gap: 5px;
            margin-top: 8px;
        }
        #health-legend .action-btn {
            flex: 1;
            padding: 6px 8px;
            background: #555;
            border: none;
            color: #fff;
            border-radius: 4px;
            cursor: pointer;
            font-size: 10px;
        }
        #health-legend .action-btn:hover {
            background: #666;
        }
        #health-legend .action-btn.primary {
            background: #0066cc;
        }
        #health-legend .action-btn.primary:hover {
            background: #0077ee;
        }
        #health-legend .action-btn.danger {
            background: #cc3300;
        }
        #health-legend .action-btn.danger:hover {
            background: #dd4400;
        }
        #health-legend.minimized .legend-content,
        #health-legend.minimized .btn-row,
        #health-legend.minimized .status {
            display: none;
        }
        #health-legend.minimized {
            min-width: auto;
            padding: 8px 12px;
        }
        #health-legend.minimized h4 {
            margin: 0;
            border: none;
            padding: 0;
        }
        #health-legend .status {
            font-size: 10px;
            color: #aaa;
            margin-top: 8px;
            text-align: center;
        }
        #health-legend.disabled {
            opacity: 0.7;
        }
        #health-legend.disabled .legend-content {
            opacity: 0.5;
        }
        /* Hide panel when modal dialogs are open */
        #health-legend.hidden {
            display: none !important;
        }
    `);

    // Health classification - using num_complete (seeders in swarm)
    function getHealthInfo(seeds) {
        if (seeds <= 1) return { class: 'critical', label: 'Critical (0-1)', color: '#cc0000', bg: 'rgba(255,0,0,0.3)' };
        if (seeds <= 4) return { class: 'at-risk', label: 'At Risk (2-4)', color: '#ffc107', bg: 'rgba(255,193,7,0.3)' };
        if (seeds <= 9) return { class: 'moderate', label: 'Moderate (5-9)', color: '#0066cc', bg: 'rgba(0,102,204,0.2)' };
        if (seeds <= 19) return { class: 'healthy', label: 'Healthy (10-19)', color: '#28a745', bg: 'rgba(40,167,69,0.2)' };
        return { class: 'very-healthy', label: 'Very Healthy (20+)', color: '#155724', bg: 'rgba(21,87,36,0.25)' };
    }

    // Track counts for legend
    let healthCounts = {
        seeding: 0,  // Still seeding (not yet met 24h or ratio requirements)
        critical: 0,
        'at-risk': 0,
        moderate: 0,
        healthy: 0,
        'very-healthy': 0
    };

    // Update body class based on enabled state
    function updateBodyClass() {
        if (settings.enabled) {
            document.body.classList.add('health-marker-enabled');
        } else {
            document.body.classList.remove('health-marker-enabled');
        }
    }

    // Update panel position
    function updatePanelPosition() {
        const legend = document.getElementById('health-legend');
        if (!legend) return;

        const positionStyles = {
            'top-right': { top: '60px', right: '10px', bottom: 'auto', left: 'auto' },
            'top-left': { top: '60px', left: '10px', bottom: 'auto', right: 'auto' },
            'bottom-right': { bottom: '10px', right: '10px', top: 'auto', left: 'auto' },
            'bottom-left': { bottom: '10px', left: '10px', top: 'auto', right: 'auto' }
        };

        const pos = positionStyles[settings.position] || positionStyles['top-right'];
        legend.style.top = pos.top;
        legend.style.right = pos.right;
        legend.style.bottom = pos.bottom;
        legend.style.left = pos.left;
    }

    // Cycle through positions: top-right -> bottom-right -> bottom-left -> top-left -> top-right
    function cyclePosition() {
        const positions = ['top-right', 'bottom-right', 'bottom-left', 'top-left'];
        const currentIndex = positions.indexOf(settings.position);
        const nextIndex = (currentIndex + 1) % positions.length;
        settings.position = positions[nextIndex];
        updatePanelPosition();
        saveSettings();
    }

    // Create legend panel
    function createLegend() {
        if (document.getElementById('health-legend')) {
            console.log('Health Marker: Legend already exists');
            return;
        }

        console.log('Health Marker: Creating legend panel...');

        const legend = document.createElement('div');
        legend.id = 'health-legend';

        // Apply inline styles to bypass CSP restrictions
        const positionStyles = {
            'top-right': 'top: 60px; right: 10px; bottom: auto; left: auto;',
            'top-left': 'top: 60px; left: 10px; bottom: auto; right: auto;',
            'bottom-right': 'bottom: 10px; right: 10px; top: auto; left: auto;',
            'bottom-left': 'bottom: 10px; left: 10px; top: auto; right: auto;'
        };

        legend.style.cssText = `
            position: fixed;
            ${positionStyles[settings.position] || positionStyles['top-right']}
            background: rgba(30, 30, 30, 0.95);
            border: 1px solid #555;
            border-radius: 8px;
            padding: 12px;
            z-index: 99999;
            font-size: 11px;
            color: #fff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            min-width: 200px;
            font-family: Arial, sans-serif;
        `;

        legend.innerHTML = `
            <h4>
                <span class="header-title">Torrent Health</span>
                <span class="header-controls">
                    <button class="header-btn" id="btn-toggle-side" title="Move to corner (cycles: TR->BR->BL->TL)">&#8644;</button>
                    <button class="header-btn" id="btn-minimize" title="Minimize">&#8211;</button>
                </span>
            </h4>
            <div class="legend-content">
                <div class="legend-item">
                    <div class="legend-color" style="background: rgba(128,128,128,0.2); border-left: 3px solid #888888;"></div>
                    <span class="legend-text">Seeding (&lt;24h or ratio&lt;1)</span>
                    <span class="legend-count" id="count-seeding">0</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: rgba(255,0,0,0.3); border-left: 3px solid #cc0000;"></div>
                    <span class="legend-text">Critical (0-1)</span>
                    <span class="legend-count" id="count-critical">0</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: rgba(255,193,7,0.3); border-left: 3px solid #ffc107;"></div>
                    <span class="legend-text">At Risk (2-4)</span>
                    <span class="legend-count" id="count-at-risk">0</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: rgba(0,102,204,0.2); border-left: 3px solid #0066cc;"></div>
                    <span class="legend-text">Moderate (5-9)</span>
                    <span class="legend-count" id="count-moderate">0</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: rgba(40,167,69,0.2); border-left: 3px solid #28a745;"></div>
                    <span class="legend-text">Healthy (10-19)</span>
                    <span class="legend-count" id="count-healthy">0</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: rgba(21,87,36,0.25); border-left: 3px solid #155724;"></div>
                    <span class="legend-text">Very Healthy (20+)</span>
                    <span class="legend-count" id="count-very-healthy">0</span>
                </div>
            </div>
            <div class="btn-row">
                <button class="action-btn primary" id="btn-refresh">Refresh</button>
                <button class="action-btn ${settings.enabled ? 'danger' : ''}" id="btn-toggle-enable">${settings.enabled ? 'Disable' : 'Enable'}</button>
            </div>
            <div class="status">Loading...</div>
        `;

        // Try to append to body, with fallback
        if (document.body) {
            document.body.appendChild(legend);
            console.log('Health Marker: Legend appended to body');
        } else {
            console.error('Health Marker: document.body not available!');
            return;
        }

        // Minimize button
        document.getElementById('btn-minimize').addEventListener('click', () => {
            settings.minimized = !settings.minimized;
            legend.classList.toggle('minimized');
            saveSettings();
        });

        // Toggle position button (cycles through all 4 corners)
        document.getElementById('btn-toggle-side').addEventListener('click', () => {
            cyclePosition();
        });

        // Refresh button
        document.getElementById('btn-refresh').addEventListener('click', () => {
            fetchTorrentData();
        });

        // Enable/Disable button
        document.getElementById('btn-toggle-enable').addEventListener('click', () => {
            settings.enabled = !settings.enabled;
            updateBodyClass();
            const btn = document.getElementById('btn-toggle-enable');
            btn.textContent = settings.enabled ? 'Disable' : 'Enable';
            btn.classList.toggle('danger', settings.enabled);
            legend.classList.toggle('disabled', !settings.enabled);
            saveSettings();

            if (settings.enabled) {
                applyHealthToRows();
            }
        });
    }

    // Update legend counts
    function updateLegendCounts() {
        const seedingEl = document.getElementById('count-seeding');
        const criticalEl = document.getElementById('count-critical');
        const atRiskEl = document.getElementById('count-at-risk');
        const moderateEl = document.getElementById('count-moderate');
        const healthyEl = document.getElementById('count-healthy');
        const veryHealthyEl = document.getElementById('count-very-healthy');

        if (seedingEl) seedingEl.textContent = healthCounts.seeding;
        if (criticalEl) criticalEl.textContent = healthCounts.critical;
        if (atRiskEl) atRiskEl.textContent = healthCounts['at-risk'];
        if (moderateEl) moderateEl.textContent = healthCounts.moderate;
        if (healthyEl) healthyEl.textContent = healthCounts.healthy;
        if (veryHealthyEl) veryHealthyEl.textContent = healthCounts['very-healthy'];
    }

    function updateStatus(msg) {
        const statusEl = document.querySelector('#health-legend .status');
        if (statusEl) statusEl.textContent = msg;
    }

    // Fetch torrent data from qBittorrent API
    function fetchTorrentData() {
        updateStatus('Fetching data...');

        // Get base URL - handle both /qbittorrent and /qbittorrent/ paths
        let baseUrl = window.location.origin;
        const pathParts = window.location.pathname.split('/').filter(p => p);
        if (pathParts.length > 0 && pathParts[0] === 'qbittorrent') {
            baseUrl += '/qbittorrent';
        }

        fetch(baseUrl + '/api/v2/torrents/info', {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('API request failed: ' + response.status);
            }
            return response.json();
        })
        .then(torrents => {
            console.log('Health Marker: Got', torrents.length, 'torrents from API');

            // Reset counts
            healthCounts = {
                seeding: 0,
                critical: 0,
                'at-risk': 0,
                moderate: 0,
                healthy: 0,
                'very-healthy': 0
            };

            // Constants for seeding requirements
            const HOURS_24_IN_SECONDS = 24 * 60 * 60;
            const MIN_RATIO = 1.0;
            const nowSeconds = Math.floor(Date.now() / 1000);

            // Store torrent data by hash (both original and lowercase for matching)
            torrentData = {};
            torrents.forEach(t => {
                // Only classify torrents that are actively seeding
                // States: uploading, stalledUP, queuedUP, forcedUP, checkingUP
                const seedingStates = ['uploading', 'stalledUP', 'queuedUP', 'forcedUP', 'checkingUP'];
                const isSeeding = seedingStates.includes(t.state);

                // Try multiple fields for seeder count:
                // - num_complete: total seeders in swarm (from tracker announce)
                // - num_seeds: connected seeds (less useful)
                // The UI shows "connected(total)" format like "0(18)"
                // We want the total (18), which should be num_complete
                // But if num_complete is 0 or missing, the tracker may not have reported yet
                const seeds = Math.max(t.num_complete || 0, t.num_seeds || 0);

                // Check seeding requirements: 24 hours old AND ratio >= 1.0
                const addedOn = t.added_on || 0;  // Unix timestamp when torrent was added
                const ratio = t.ratio || 0;       // Share ratio (uploaded / downloaded)
                const ageSeconds = nowSeconds - addedOn;
                const meetsTimeRequirement = ageSeconds >= HOURS_24_IN_SECONDS;
                const meetsRatioRequirement = ratio >= MIN_RATIO;
                const meetsAllRequirements = meetsTimeRequirement && meetsRatioRequirement;

                // Determine health classification
                let health = null;
                let category = null;
                if (isSeeding) {
                    if (meetsAllRequirements) {
                        health = getHealthInfo(seeds);
                        category = health.class;
                    } else {
                        // Still seeding, hasn't met requirements yet
                        category = 'seeding';
                    }
                }

                const data = {
                    name: t.name,
                    seeds: seeds,
                    state: t.state,
                    isSeeding: isSeeding,
                    health: health,
                    category: category,
                    ratio: ratio,
                    addedOn: addedOn,
                    meetsRequirements: meetsAllRequirements
                };

                // Store by both original hash and lowercase
                torrentData[t.hash] = data;
                torrentData[t.hash.toLowerCase()] = data;

                // Only count seeding torrents
                if (isSeeding && category) {
                    healthCounts[category]++;
                }
            });

            updateLegendCounts();
            applyHealthToRows();
            updateStatus('Updated: ' + new Date().toLocaleTimeString());
        })
        .catch(err => {
            console.error('Health Marker Error:', err);
            updateStatus('Error: ' + err.message);
        });
    }

    // Apply health classes to table rows
    function applyHealthToRows() {
        if (!settings.enabled) return;

        // qBittorrent WebUI stores torrent hash in the row ID
        const allRows = document.querySelectorAll('tr[id]');

        console.log('Health Marker: Found', allRows.length, 'rows with IDs');

        let matched = 0;
        allRows.forEach(row => {
            const rowId = row.id;

            // Remove existing health classes (including new seeding class)
            row.classList.remove('torrent-seeding', 'torrent-critical', 'torrent-at-risk', 'torrent-moderate', 'torrent-healthy', 'torrent-very-healthy');

            // Check both original and lowercase hash
            const torrent = torrentData[rowId] || torrentData[rowId.toLowerCase()];

            if (torrent && torrent.isSeeding && torrent.category) {
                row.classList.add('torrent-' + torrent.category);
                matched++;
            }
        });

        console.log('Health Marker: Matched', matched, 'rows to torrents');

        // If no rows matched by ID, try matching by torrent name
        if (matched === 0 && Object.keys(torrentData).length > 0) {
            console.log('Health Marker: Trying name-based matching...');
            matchByName();
        }
    }

    // Fallback: Match rows by torrent name
    function matchByName() {
        if (!settings.enabled) return;

        const allRows = document.querySelectorAll('tr');
        let matched = 0;
        const seenHashes = new Set();

        allRows.forEach(row => {
            // Remove existing health classes first (including new seeding class)
            row.classList.remove('torrent-seeding', 'torrent-critical', 'torrent-at-risk', 'torrent-moderate', 'torrent-healthy', 'torrent-very-healthy');

            const rowText = row.textContent;

            // Try to find a matching torrent by name
            for (const hash in torrentData) {
                if (seenHashes.has(hash)) continue; // Skip duplicates from lowercase keys

                const torrent = torrentData[hash];
                if (!torrent.isSeeding || !torrent.category) continue;

                // Check if the torrent name appears in this row
                if (rowText.includes(torrent.name)) {
                    row.classList.add('torrent-' + torrent.category);
                    matched++;
                    seenHashes.add(hash);
                    break;
                }
            }
        });

        console.log('Health Marker: Name-matched', matched, 'rows');
    }

    // Check for modal dialogs and hide/show panel accordingly
    function checkForModals() {
        const legend = document.getElementById('health-legend');
        if (!legend) return;

        // qBittorrent WebUI uses various modal/dialog elements
        // Check for common modal indicators:
        // - Elements with class containing 'modal', 'dialog', 'popup'
        // - MochaUI windows (qBittorrent uses MochaUI)
        // - Overlay elements
        const modalSelectors = [
            '.mocha',                    // MochaUI windows
            '.mochaOverlay',             // MochaUI overlay
            '[class*="dialog"]',         // Any dialog class
            '[class*="modal"]',          // Any modal class
            '[class*="popup"]',          // Any popup class
            '.jqmWindow',                // jQuery modal windows
            '#confirmDeletionPage',      // Delete confirmation
            '#uploadPage',               // Upload dialog
            '#downloadPage',             // Download dialog
            '#preferencesPage',          // Preferences dialog
            '#statisticsPage',           // Statistics dialog
            '#aboutPage',                // About dialog
            '.dialogOverlay'             // Generic overlay
        ];

        let modalOpen = false;

        for (const selector of modalSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                // Check if the element is visible
                const style = window.getComputedStyle(el);
                if (style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null) {
                    modalOpen = true;
                    break;
                }
            }
            if (modalOpen) break;
        }

        // Also check for any element with high z-index that might be a modal
        const highZElements = document.querySelectorAll('[style*="z-index"]');
        for (const el of highZElements) {
            if (el.id === 'health-legend') continue;
            const zIndex = parseInt(window.getComputedStyle(el).zIndex) || 0;
            const style = window.getComputedStyle(el);
            if (zIndex >= 1000 && style.display !== 'none' && style.visibility !== 'hidden') {
                // Check if it looks like a dialog (has some size)
                if (el.offsetWidth > 100 && el.offsetHeight > 100) {
                    modalOpen = true;
                    break;
                }
            }
        }

        if (modalOpen) {
            legend.classList.add('hidden');
        } else {
            legend.classList.remove('hidden');
        }
    }

    // Initialize
    function init() {
        console.log('qBittorrent Health Marker v3.3: Initializing...');

        loadSettings();
        updateBodyClass();

        // Wait for the page to load
        setTimeout(() => {
            createLegend();
            fetchTorrentData();

            // Refresh data periodically (every 60 seconds)
            setInterval(fetchTorrentData, 60000);

            // Also refresh when the table might update
            const observer = new MutationObserver(() => {
                clearTimeout(window.healthMarkerDebounce);
                window.healthMarkerDebounce = setTimeout(applyHealthToRows, 1000);

                // Check for modal dialogs and hide panel when they're open
                checkForModals();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            console.log('qBittorrent Health Marker v3.3: Ready!');
        }, 3000);
    }

    // Run when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
