// ==UserScript==
// @name         GeoPixels Guild Overhaul
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Complete guild overhaul - draggable modal, XP tracking, message collapsing, responsive layout, and coordinate display in XP tracker!
// @author       ariapokoteng
// @match        *://geopixels.net/*
// @match        *://*.geopixels.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geopixels.net
// @downloadURL https://update.greasyfork.org/scripts/555902/GeoPixels%20Guild%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/555902/GeoPixels%20Guild%20Overhaul.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & State ---
    const CONFIG = {
        debugMode: false,
        timeOffset: GM_getValue('debug_time_offset', 0), // Offset in ms
        minSnapshotInterval: GM_getValue('min_snapshot_interval', 60 * 60 * 1000), // Default 1h (cached)
        maxSnapshots: GM_getValue('max_snapshots', 750) // Default 750 (cached)
    };

    // Snapshot interval presets (in milliseconds)
    const SNAPSHOT_INTERVALS = {
        HOURLY: 60 * 60 * 1000,           // 1 hour
        TWELVE_HOURS: 12 * 60 * 60 * 1000, // 12 hours
        TWENTY_FOUR_HOURS: 24 * 60 * 60 * 1000 // 24 hours
    };

    // Session-only tracking for visited map buttons
    const sessionState = {
        visitedCoords: new Set()
    };

    // --- CSS Styles ---
    const style = document.createElement('style');
    style.textContent = `
        .guild-modal-header {
            touch-action: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
        }

        .guild-modal-header span {
            touch-action: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
            display: block;
            flex: 1;
            padding-right: 10px;
        }

        .draggable-panel {
            touch-action: none !important;
        }

        /* Guild message collapsible styling */
        .guild-message-section {
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            overflow: hidden;
        }

        .guild-message-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem;
            background-color: #f9fafb;
            cursor: pointer;
            user-select: none;
        }

        .guild-message-header:hover {
            background-color: #f3f4f6;
        }

        .guild-message-toggle {
            display: inline-block;
            width: 20px;
            height: 20px;
            text-align: center;
            line-height: 20px;
            font-weight: bold;
            color: #6b7280;
            transition: transform 0.2s ease;
        }

        .guild-message-toggle.collapsed {
            transform: rotate(-90deg);
        }

        .guild-message-content {
            max-height: 500px;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
            padding: 0.75rem;
        }

        .guild-message-content.collapsed {
            max-height: 0;
            padding: 0;
        }

        /* Responsive layout for guild info grid */
        @media (max-width: 1024px) {
            #infoTab .grid.grid-cols-1.lg\\:grid-cols-3 {
                grid-template-columns: 1fr !important;
            }

            #infoTab .lg\\:col-span-2 {
                grid-column: auto !important;
            }

            #infoTab .lg\\:col-span-1 {
                grid-column: auto !important;
                order: 1;
            }

            #infoTab > .grid {
                display: flex;
                flex-direction: column;
            }

            #guildMembersContainer {
                order: 1;
                margin-top: 2rem;
            }
        }

        /* Force members container to bottom when message is collapsed */
        #infoTab.message-collapsed > .grid {
            display: block;
        }

        #infoTab.message-collapsed #guildMembersContainer {
            margin-top: 1rem;
        }

        /* Find button visited state */
        .guild-find-btn.visited {
            background-color: #a855f7 !important;
        }

        .guild-find-btn.visited:hover {
            background-color: #9333ea !important;
        }

        /* XP Changes Section */
        .xp-changes-section {
            margin-top: 1.5rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            overflow: hidden;
            width: 100%;
        }

        .xp-changes-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem;
            background-color: #f1f5f9;
            cursor: pointer;
            user-select: none;
            font-weight: 600;
            color: #334155;
        }

        .xp-changes-header:hover {
            background-color: #e2e8f0;
        }

        .xp-changes-content {
            padding: 1rem;
            background-color: white;
            display: block;
        }

        .xp-changes-content.hidden {
            display: none;
        }

        .daily-brief-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .daily-brief-table th, .daily-brief-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .daily-brief-table th {
            background-color: #f2f2f2;
        }
        .xp-gain { color: green; }
        .xp-loss { color: red; }
        .xp-neutral { color: #94a3b8; }

        /* Select dropdowns */
        select {
            border: 2px solid #3b82f6 !important;
            border-radius: 4px;
        }

        /* User cell with coordinates */
        .user-cell-content {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .user-name {
            font-weight: 500;
        }

        .user-coords {
            font-size: 13px;
        }

        /* Icons */
        .member-icon-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-left: 4px;
            border: none;
            background: transparent;
            padding: 0;
        }
        .member-icon-btn:hover {
            background-color: rgba(0,0,0,0.05);
        }
        .discord-icon { color: #5865F2; }
        .map-icon { color: #0ea5e9; }
        .map-icon.visited { color: #a855f7; }

        .control-button {
            padding: 6px 12px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s;
        }
        .control-button:hover {
            background-color: #f0f0f0;
        }
        .control-button.active {
            background-color: #3b82f6;
            color: white;
            border-color: #3b82f6;
        }

        .trash-btn {
            background: none;
            border: none;
            color: #ef4444;
            cursor: pointer;
            padding: 2px 4px;
            font-size: 12px;
        }
        .trash-btn:hover {
            color: #dc2626;
        }

        .tooltip-popup {
            position: fixed;
            background: #333;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .tooltip-popup.visible {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // --- Helper Functions ---

    function getVirtualNow() {
        return Date.now() + CONFIG.timeOffset;
    }

    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(checkInterval);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(checkInterval);
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                }
            }, 100);
        });
    }

    async function fetchUserProfile(targetUserId) {
        try {
            if (!targetUserId) {
                console.error("Missing targetId");
                return null;
            }
            const response = await fetch('/GetUserProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "targetId": parseInt(targetUserId) })
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            console.error("Failed to fetch user profile:", err);
            return null;
        }
    }

    function showTooltip(x, y, text) {
        let tooltip = document.getElementById('custom-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'custom-tooltip';
            tooltip.className = 'tooltip-popup';
            document.body.appendChild(tooltip);
        }
        tooltip.textContent = text;
        tooltip.style.left = x + 10 + 'px';
        tooltip.style.top = y + 'px';
        tooltip.classList.add('visible');

        setTimeout(() => {
            tooltip.classList.remove('visible');
        }, 2000);
    }

    // --- XP Tracking Logic ---

    function parseGuildMembers() {
        const container = document.getElementById('guildMembersContainer');
        if (!container) return null;

        const members = {};
        const memberRows = container.querySelectorAll('div.flex.items-center.justify-between.p-2.rounded-md.bg-white.shadow-sm');

        memberRows.forEach(row => {
            const nameEl = row.querySelector('p.font-semibold');
            const xpEl = row.querySelector('p.text-xs.text-gray-500');

            if (nameEl && xpEl) {
                let fullName = nameEl.textContent.trim();
                const badge = nameEl.querySelector('span');
                if (badge) {
                    fullName = fullName.replace(badge.textContent, '').trim();
                }

                const xpText = xpEl.textContent;
                const xpMatch = xpText.match(/([\d,.]+)\s*XP$/);

                // Extract Coords
                let coords = null;
                const findBtn = row.querySelector('button[onclick^="goToGridLocation"]');
                if (findBtn) {
                    const match = findBtn.getAttribute('onclick').match(/goToGridLocation\((-?\d+),\s*(-?\d+)\)/);
                    if (match) {
                        coords = [parseInt(match[1]), parseInt(match[2])];
                    }
                }

                if (fullName && xpMatch) {
                    const xp = parseInt(xpMatch[1].replace(/[.,]/g, ''), 10);
                    members[fullName] = { xp, coords };
                }
            }
        });

        return members;
    }

    function saveGuildSnapshot(members, forceNew = false) {
        const now = getVirtualNow();
        let history = GM_getValue('guild_xp_history', []);

        const lastEntry = history[history.length - 1];
        const lastBucketStart = lastEntry ? (lastEntry.bucketStartTime || lastEntry.timestamp) : 0;

        const newEntry = {
            timestamp: now,
            bucketStartTime: now,
            members: members
        };

        if (!forceNew && lastEntry && (now - lastBucketStart < CONFIG.minSnapshotInterval)) {
            newEntry.bucketStartTime = lastBucketStart;
            history[history.length - 1] = newEntry;
            if (CONFIG.debugMode) console.log('[Guild XP] Updated recent snapshot');
        } else {
            history.push(newEntry);
            console.log('[Guild XP] Created new snapshot');
        }

        if (history.length > CONFIG.maxSnapshots) {
            history = history.slice(history.length - CONFIG.maxSnapshots);
        }

        GM_setValue('guild_xp_history', history);
        return history;
    }

    function getXp(val) {
        if (typeof val === 'number') return val;
        if (val && typeof val === 'object' && val.xp !== undefined) return val.xp;
        return 0;
    }

    function getCoords(val) {
        if (val && typeof val === 'object' && val.coords) return val.coords;
        return null;
    }

    async function fetchAllGuildMembersData() {
        const currentMembers = parseGuildMembers();
        if (!currentMembers || Object.keys(currentMembers).length === 0) {
            alert('No guild members found. Please wait for members to load.');
            return null;
        }

        const memberNames = Object.keys(currentMembers);
        const allUsersData = [];
        let successCount = 0;
        let failCount = 0;

        // Show progress indicator
        const progressDiv = document.createElement('div');
        progressDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 300px;
            text-align: center;
        `;
        progressDiv.innerHTML = `
            <p style="font-weight: bold; margin-bottom: 10px;">Fetching guild member data...</p>
            <p id="progressText" style="font-size: 14px; color: #666;">0/${memberNames.length}</p>
            <div style="width: 100%; height: 20px; background: #e5e7eb; border-radius: 4px; margin-top: 10px; overflow: hidden;">
                <div id="progressBar" style="height: 100%; background: #3b82f6; width: 0%; transition: width 0.3s;"></div>
            </div>
        `;
        document.body.appendChild(progressDiv);

        // Fetch data for each member
        for (let i = 0; i < memberNames.length; i++) {
            const memberName = memberNames[i];
            const match = memberName.match(/#(\d+)$/);

            if (match) {
                const userId = match[1];
                const data = await fetchUserProfile(userId);

                if (data) {
                    allUsersData.push(data);
                    successCount++;
                } else {
                    failCount++;
                }
            } else {
                failCount++;
            }

            // Update progress
            const progressPercent = ((i + 1) / memberNames.length) * 100;
            document.getElementById('progressBar').style.width = progressPercent + '%';
            document.getElementById('progressText').textContent = `${i + 1}/${memberNames.length} (${successCount} fetched)`;
        }

        // Copy to clipboard
        const jsonString = JSON.stringify(allUsersData, null, 2);
        navigator.clipboard.writeText(jsonString).then(() => {
            progressDiv.innerHTML = `
                <p style="font-weight: bold; color: #10b981; margin-bottom: 5px;">✓ Success!</p>
                <p style="font-size: 14px; color: #666;">
                    Fetched: ${successCount} users<br>
                    Failed: ${failCount} users<br><br>
                    <strong>JSON copied to clipboard!</strong>
                </p>
            `;
            setTimeout(() => progressDiv.remove(), 3000);
        }).catch((err) => {
            progressDiv.innerHTML = `
                <p style="font-weight: bold; color: #dc2626;">Error copying to clipboard!</p>
                <p style="font-size: 12px; color: #666;">${err.message}</p>
            `;
            setTimeout(() => progressDiv.remove(), 3000);
        });

        return allUsersData;
    }

    function calculateXPChanges(oldMembers, newMembers) {
        const changes = [];

        for (const [id, oldVal] of Object.entries(oldMembers)) {
            const oldXp = getXp(oldVal);
            if (newMembers.hasOwnProperty(id)) {
                const newVal = newMembers[id];
                const newXp = getXp(newVal);
                const diff = newXp - oldXp;
                const coords = getCoords(newVal) || getCoords(oldVal);
                changes.push({ type: 'gain', id, diff, oldXp, newXp, coords });
            } else {
                const coords = getCoords(oldVal);
                changes.push({ type: 'left', id, oldXp, coords });
            }
        }

        for (const [id, newVal] of Object.entries(newMembers)) {
            if (!oldMembers.hasOwnProperty(id)) {
                const newXp = getXp(newVal);
                const coords = getCoords(newVal);
                changes.push({ type: 'join', id, newXp, coords });
            }
        }

        return changes;
    }

    // Helper function to get color based on coordinate quadrant and distance
    function getCoordinateColor(coords) {
        if (!coords || coords.length < 2) return { bg: '#f3f4f6', text: '#1f2937' };

        const x = coords[0];
        const y = coords[1];

        // Calculate distance from origin
        const distance = Math.sqrt(x * x + y * y);
        const distanceBand = Math.floor(distance / 25000);

        // Base colors for each quadrant with intensity variation (very light/transparent)
        let baseColor;

        if (x >= 0 && y >= 0) {
            // Top Right - Green tint
            const intensity = Math.min(distanceBand * 3, 15);
            baseColor = `hsl(120, 50%, ${97 - intensity}%)`;
        } else if (x < 0 && y >= 0) {
            // Top Left - Red tint
            const intensity = Math.min(distanceBand * 3, 15);
            baseColor = `hsl(0, 50%, ${97 - intensity}%)`;
        } else if (x < 0 && y < 0) {
            // Bottom Left - Blue tint
            const intensity = Math.min(distanceBand * 3, 15);
            baseColor = `hsl(240, 50%, ${97 - intensity}%)`;
        } else {
            // Bottom Right (x >= 0, y < 0) - Orange tint
            const intensity = Math.min(distanceBand * 3, 15);
            baseColor = `hsl(30, 50%, ${97 - intensity}%)`;
        }

        return {
            bg: baseColor,
            text: '#1f2937'
        };
    }

    // --- XP Changes Section (Embedded) ---
    function ensureXPChangesSection() {
        // Find the tab navigation container by looking for the Information tab button
        const infoBtn = document.getElementById('infoTabBtn');
        if (!infoBtn) {
            // If we can't even find the info button, we can't inject our tab properly.
            // Fallback to legacy if we can find the infoTab content at least.
            if (document.getElementById('infoTab')) {
                console.log('[Guild XP] Could not find tab buttons, appending to infoTab instead');
                ensureXPChangesSectionLegacy();
            }
            return;
        }

        const tabNav = infoBtn.parentElement;

        // Check if our tab already exists
        if (document.getElementById('xpTrackerTabBtn')) return;

        // Remove any existing panes to prevent duplicates
        const existingPanes = document.querySelectorAll('#xpTrackerPane');
        existingPanes.forEach(pane => pane.remove());

        // Create XP Tracker tab button
        const xpTabBtn = document.createElement('button');
        xpTabBtn.textContent = 'XP Tracker';
        xpTabBtn.id = 'xpTrackerTabBtn';

        // Copy classes from the Information button (or a sibling)
        // We want it to look like an inactive tab initially
        xpTabBtn.className = infoBtn.className;
        // Force inactive style initially
        xpTabBtn.classList.remove('text-blue-600', 'border-blue-500');
        xpTabBtn.classList.add('text-gray-500', 'border-transparent');
        xpTabBtn.style.borderBottom = '2px solid transparent';

        // Create XP Tracker tab pane
        const xpTabPane = document.createElement('div');
        xpTabPane.id = 'xpTrackerPane';
        xpTabPane.style.display = 'none';
        xpTabPane.className = 'hidden guild-tab-content';

        // Find the content container
        const infoTab = document.getElementById('infoTab');
        const contentContainer = infoTab?.parentElement;

        if (!contentContainer) {
            console.log('[Guild XP] Could not find content container');
            ensureXPChangesSectionLegacy();
            return;
        }

        // Add click handler to tab button
        xpTabBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Hide all tabs
            const allPanes = contentContainer.querySelectorAll('.guild-tab-content, [id$="Tab"], [id$="Pane"]');
            allPanes.forEach(pane => {
                pane.style.display = 'none';
                pane.classList.add('hidden');
            });

            // Deactivate all tab buttons
            const allBtns = tabNav.querySelectorAll('button');
            allBtns.forEach(btn => {
                btn.classList.remove('text-blue-600', 'border-blue-500');
                btn.classList.add('text-gray-500', 'border-transparent');
                btn.style.borderBottom = '2px solid transparent';
                btn.style.color = '';
            });

            // Show this tab
            xpTabPane.style.display = 'block';
            xpTabPane.classList.remove('hidden');

            // Activate this button
            xpTabBtn.classList.remove('text-gray-500', 'border-transparent');
            xpTabBtn.classList.add('text-blue-600', 'border-blue-500');
            xpTabBtn.style.borderBottom = '2px solid #3b82f6';
            xpTabBtn.style.color = '#3b82f6';

            // Render content
            renderXPChanges(xpTabPane);
        };

        // Hook into other tab buttons to deactivate our tab when they are clicked
        const existingTabs = tabNav.querySelectorAll('button');
        existingTabs.forEach(btn => {
            if (btn.id === 'xpTrackerTabBtn' || btn.dataset.xpTrackerHooked) return;

            const originalOnClick = btn.onclick;
            btn.onclick = (e) => {
                // Hide our tab
                xpTabPane.style.display = 'none';
                xpTabPane.classList.add('hidden');

                // Reset inline styles on other tabs so game logic can control them
                const allPanes = contentContainer.querySelectorAll('.guild-tab-content');
                allPanes.forEach(pane => {
                    if (pane.id !== 'xpTrackerPane') {
                        pane.style.display = '';
                    }
                });

                // Deactivate our button
                xpTabBtn.classList.remove('text-blue-600', 'border-blue-500');
                xpTabBtn.classList.add('text-gray-500', 'border-transparent');
                xpTabBtn.style.borderBottom = '2px solid transparent';
                xpTabBtn.style.color = '';

                // Call original handler
                if (originalOnClick) originalOnClick.call(btn, e);
            };
            btn.dataset.xpTrackerHooked = 'true';
        });

        // Append tab button to nav
        tabNav.appendChild(xpTabBtn);

        // Append tab pane to content container
        contentContainer.appendChild(xpTabPane);

        // Add observer to ensure button stays
        const navObserver = new MutationObserver((mutations) => {
            if (!document.getElementById('xpTrackerTabBtn')) {
                // Re-append if missing
                tabNav.appendChild(xpTabBtn);
            }
        });
        navObserver.observe(tabNav, { childList: true });
    }

    function ensureXPChangesSectionLegacy() {
        const infoTab = document.getElementById('infoTab');
        if (!infoTab || document.getElementById('xpChangesSection')) return;

        const section = document.createElement('div');
        section.id = 'xpChangesSection';
        section.className = 'xp-changes-section';

        const header = document.createElement('div');
        header.className = 'xp-changes-header';
        header.innerHTML = `<span>XP Changes Tracker</span><span class="toggle-icon">▼</span>`;

        const content = document.createElement('div');
        content.className = 'xp-changes-content hidden';
        content.id = 'xpChangesContent';

        header.onclick = () => {
            content.classList.toggle('hidden');
            const icon = header.querySelector('.toggle-icon');
            icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';

            if (!content.classList.contains('hidden')) {
                renderXPChanges(content);
            }
        };

        section.appendChild(header);
        section.appendChild(content);

        // Append to infoTab, after the grid
        infoTab.appendChild(section);
    }

    function collapseOtherSections() {
        const messageSection = document.querySelector('.guild-message-section');
        if (messageSection) {
            const content = messageSection.querySelector('.guild-message-content');
            const header = messageSection.querySelector('.guild-message-header');
            const toggle = messageSection.querySelector('.guild-message-toggle');
            if (content && !content.classList.contains('collapsed')) {
                content.classList.add('collapsed');
                toggle.classList.add('collapsed');
                document.getElementById('infoTab').classList.add('message-collapsed');
            }
        }
    }

    function expandOtherSections() {
        const messageSection = document.querySelector('.guild-message-section');
        if (messageSection) {
            const content = messageSection.querySelector('.guild-message-content');
            const toggle = messageSection.querySelector('.guild-message-toggle');
            if (content && content.classList.contains('collapsed')) {
                content.classList.remove('collapsed');
                toggle.classList.remove('collapsed');
                document.getElementById('infoTab').classList.remove('message-collapsed');
            }
        }
    }

    function exportToCSV(snapshots, currentMembers, fromVal, toVal) {
        // Determine which snapshots to compare based on current selection
        // If called from the button, we might need to pass these values or read them from DOM
        // But since this function was originally designed to dump EVERYTHING, let's adapt it
        // to dump the CURRENT VIEW if specific snapshots are provided, or EVERYTHING if not.

        let csvContent = '';

        if (fromVal !== undefined && toVal !== undefined) {
            // Export current view (comparison)
            const getSnapshot = (val) => val === 'current' ? { members: currentMembers } : snapshots[val];
            const fromData = getSnapshot(fromVal);
            const toData = getSnapshot(toVal);

            if (!fromData || !toData) return;

            const changes = calculateXPChanges(fromData.members, toData.members);

            // Sort (same as view)
            changes.sort((a, b) => {
                if (a.type === 'join') return -1;
                if (b.type === 'join') return 1;
                if (a.type === 'left') return 1;
                if (b.type === 'left') return -1;
                return b.diff - a.diff;
            });

            const csvRows = [
                ["Username", "Change Type", "XP Change", "Old XP", "New XP"],
                ...changes.map(c => {
                    const oldVal = c.oldXp || 0;
                    const newVal = c.newXp || 0;
                    const diff = c.diff !== undefined ? c.diff : (newVal - oldVal);
                    return [`"${c.id}"`, c.type, diff, oldVal, newVal];
                })
            ];
            csvContent = csvRows.map(e => e.join(",")).join("\n");

        } else {
            // Export Full History (Legacy behavior)
            let csv = 'Snapshot,Timestamp,User,XP\n';
            snapshots.forEach((snap, idx) => {
                const timestamp = new Date(snap.timestamp).toLocaleString();
                for (const [user, data] of Object.entries(snap.members)) {
                    const xp = data.xp || data;
                    csv += `${idx + 1},"${timestamp}","${user}",${xp}\n`;
                }
            });
            // Add current
            const now = new Date(getVirtualNow()).toLocaleString();
            for (const [user, data] of Object.entries(currentMembers)) {
                const xp = data.xp || data;
                csv += `Current,"${now}","${user}",${xp}\n`;
            }
            csvContent = csv;
        }

        // Open CSV Modal
        const csvOverlay = document.createElement('div');
        csvOverlay.style.position = 'fixed';
        csvOverlay.style.top = '0';
        csvOverlay.style.left = '0';
        csvOverlay.style.right = '0';
        csvOverlay.style.bottom = '0';
        csvOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        csvOverlay.style.zIndex = '10001';
        csvOverlay.onclick = () => { csvOverlay.remove(); csvModal.remove(); };

        const csvModal = document.createElement('div');
        csvModal.style.position = 'fixed';
        csvModal.style.top = '50%';
        csvModal.style.left = '50%';
        csvModal.style.transform = 'translate(-50%, -50%)';
        csvModal.style.backgroundColor = 'white';
        csvModal.style.padding = '20px';
        csvModal.style.borderRadius = '8px';
        csvModal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        csvModal.style.zIndex = '10002';
        csvModal.style.width = '500px';
        csvModal.style.maxWidth = '90%';
        csvModal.style.display = 'flex';
        csvModal.style.flexDirection = 'column';
        csvModal.style.gap = '10px';

        const title = document.createElement('h3');
        title.textContent = 'CSV Export';
        title.style.margin = '0 0 10px 0';
        title.style.color = '#1e293b';
        title.style.fontSize = '1.25rem';
        title.style.fontWeight = '600';

        const textarea = document.createElement('textarea');
        textarea.value = csvContent;
        textarea.style.width = '100%';
        textarea.style.height = '300px';
        textarea.style.fontFamily = 'monospace';
        textarea.style.fontSize = '12px';
        textarea.style.border = '1px solid #ccc';
        textarea.style.borderRadius = '4px';
        textarea.style.resize = 'vertical';
        textarea.readOnly = true;
        textarea.onclick = () => textarea.select();

        const btnRow = document.createElement('div');
        btnRow.style.display = 'flex';
        btnRow.style.justifyContent = 'flex-end';
        btnRow.style.gap = '10px';

        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '📋 Copy';
        copyBtn.className = 'control-button';
        copyBtn.onclick = () => {
            textarea.select();
            navigator.clipboard.writeText(csvContent).then(() => {
                const orig = copyBtn.innerHTML;
                copyBtn.innerHTML = '✅ Copied!';
                setTimeout(() => copyBtn.innerHTML = orig, 1000);
            });
        };

        const downloadBtn = document.createElement('button');
        downloadBtn.innerHTML = '💾 Download';
        downloadBtn.className = 'control-button';
        downloadBtn.style.backgroundColor = '#10b981';
        downloadBtn.style.color = 'white';
        downloadBtn.style.borderColor = '#10b981';
        downloadBtn.onclick = () => {
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", `guild_xp_export_${Date.now()}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = 'Close';
        closeBtn.className = 'control-button';
        closeBtn.onclick = () => { csvOverlay.remove(); csvModal.remove(); };

        btnRow.appendChild(copyBtn);
        btnRow.appendChild(downloadBtn);
        btnRow.appendChild(closeBtn);

        csvModal.appendChild(title);
        csvModal.appendChild(textarea);
        csvModal.appendChild(btnRow);

        document.body.appendChild(csvOverlay);
        document.body.appendChild(csvModal);
    }

    // --- History Pruning Functions ---

    function deleteAllHistory() {
        if (confirm('Delete ALL snapshots? This cannot be undone.')) {
            GM_setValue('guild_xp_history', []);
            return [];
        }
        return null;
    }

    function keepDailyHistory() {
        let history = GM_getValue('guild_xp_history', []);
        const dailyMap = new Map();

        // Group by day (YYYY-MM-DD)
        history.forEach(entry => {
            const date = new Date(entry.timestamp);
            const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

            // Keep the latest snapshot from each day
            if (!dailyMap.has(dayKey) || entry.timestamp > dailyMap.get(dayKey).timestamp) {
                dailyMap.set(dayKey, entry);
            }
        });

        const pruned = Array.from(dailyMap.values()).sort((a, b) => a.timestamp - b.timestamp);
        const removed = history.length - pruned.length;

        if (confirm(`This will keep only the latest snapshot from each day.\nSnapshots: ${history.length} → ${pruned.length} (removing ${removed}).\nContinue?`)) {
            GM_setValue('guild_xp_history', pruned);
            return pruned;
        }
        return null;
    }

    function keepWeeklyHistory() {
        let history = GM_getValue('guild_xp_history', []);
        const weeklyMap = new Map();

        // Group by week (ISO week)
        history.forEach(entry => {
            const date = new Date(entry.timestamp);
            const dayOfWeek = date.getUTCDay();
            const diff = date.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            const weekStart = new Date(date.setUTCDate(diff));
            const weekKey = weekStart.toISOString().split('T')[0]; // Start of week (YYYY-MM-DD)

            // Keep the latest snapshot from each week
            if (!weeklyMap.has(weekKey) || entry.timestamp > weeklyMap.get(weekKey).timestamp) {
                weeklyMap.set(weekKey, entry);
            }
        });

        const pruned = Array.from(weeklyMap.values()).sort((a, b) => a.timestamp - b.timestamp);
        const removed = history.length - pruned.length;

        if (confirm(`This will keep only the latest snapshot from each week.\nSnapshots: ${history.length} → ${pruned.length} (removing ${removed}).\nContinue?`)) {
            GM_setValue('guild_xp_history', pruned);
            return pruned;
        }
        return null;
    }

    function deleteHistoryOlderThan7Days() {
        let history = GM_getValue('guild_xp_history', []);
        const now = getVirtualNow();
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

        const pruned = history.filter(entry => (now - entry.timestamp) <= sevenDaysMs);
        const removed = history.length - pruned.length;

        if (confirm(`This will delete all snapshots older than 7 days.\nSnapshots: ${history.length} → ${pruned.length} (removing ${removed}).\nContinue?`)) {
            GM_setValue('guild_xp_history', pruned);
            return pruned;
        }
        return null;
    }

    function renderCleanHistoryMenu(container, onClose) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            padding: 20px;
            z-index: 10000;
            min-width: 350px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        `;

        const title = document.createElement('h3');
        title.textContent = 'Clean History Options';
        title.style.cssText = 'margin: 0 0 15px 0; font-size: 18px; font-weight: bold; color: #1f2937;';
        modal.appendChild(title);

        const buttonStyles = `
            display: block;
            width: 100%;
            padding: 10px;
            margin: 8px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
            text-align: left;
        `;

        const deleteAllBtn = document.createElement('button');
        deleteAllBtn.innerHTML = 'Select All Snapshots for Deletion';
        deleteAllBtn.style.cssText = buttonStyles + ' color: #ef4444;';
        deleteAllBtn.onmouseover = (e) => e.target.style.backgroundColor = '#fee2e2';
        deleteAllBtn.onmouseout = (e) => e.target.style.backgroundColor = 'white';
        deleteAllBtn.onclick = () => {
            const result = deleteAllHistory();
            if (result !== null) {
                onClose(result);
            }
        };
        modal.appendChild(deleteAllBtn);

        const keepDailyBtn = document.createElement('button');
        keepDailyBtn.innerHTML = 'Keep One Snapshot Per Day (Latest)';
        keepDailyBtn.style.cssText = buttonStyles + ' color: #f59e0b;';
        keepDailyBtn.onmouseover = (e) => e.target.style.backgroundColor = '#fef3c7';
        keepDailyBtn.onmouseout = (e) => e.target.style.backgroundColor = 'white';
        keepDailyBtn.onclick = () => {
            const result = keepDailyHistory();
            if (result !== null) {
                onClose(result);
            }
        };
        modal.appendChild(keepDailyBtn);

        const keepWeeklyBtn = document.createElement('button');
        keepWeeklyBtn.innerHTML = 'Keep One Snapshot Per Week (Latest)';
        keepWeeklyBtn.style.cssText = buttonStyles + ' color: #3b82f6;';
        keepWeeklyBtn.onmouseover = (e) => e.target.style.backgroundColor = '#dbeafe';
        keepWeeklyBtn.onmouseout = (e) => e.target.style.backgroundColor = 'white';
        keepWeeklyBtn.onclick = () => {
            const result = keepWeeklyHistory();
            if (result !== null) {
                onClose(result);
            }
        };
        modal.appendChild(keepWeeklyBtn);

        const delete7DaysBtn = document.createElement('button');
        delete7DaysBtn.innerHTML = 'Select Snapshots Older Than 7 Days for Deletion';
        delete7DaysBtn.style.cssText = buttonStyles + ' color: #8b5cf6;';
        delete7DaysBtn.onmouseover = (e) => e.target.style.backgroundColor = '#f3e8ff';
        delete7DaysBtn.onmouseout = (e) => e.target.style.backgroundColor = 'white';
        delete7DaysBtn.onclick = () => {
            const result = deleteHistoryOlderThan7Days();
            if (result !== null) {
                onClose(result);
            }
        };
        modal.appendChild(delete7DaysBtn);

        const cancelBtn = document.createElement('button');
        cancelBtn.innerHTML = 'Cancel';
        cancelBtn.style.cssText = buttonStyles + ' color: #6b7280; margin-top: 15px; border-top: 1px solid #ddd; padding-top: 15px;';
        cancelBtn.onmouseover = (e) => e.target.style.backgroundColor = '#f3f4f6';
        cancelBtn.onmouseout = (e) => e.target.style.backgroundColor = 'white';
        cancelBtn.onclick = () => {
            overlay.remove();
            modal.remove();
        };
        modal.appendChild(cancelBtn);

        overlay.onclick = () => {
            overlay.remove();
            modal.remove();
        };

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }

    // --- Export/Import Functions ---

    function exportSnapshots() {
        let history = GM_getValue('guild_xp_history', []);
        if (history.length === 0) {
            alert('No snapshots to export.');
            return;
        }

        const exportData = {
            version: 1,
            exportDate: new Date().toISOString(),
            snapshotCount: history.length,
            snapshots: history
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `guild_snapshots_${Date.now()}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert(`Exported ${history.length} snapshots successfully.`);
    }

    function importSnapshots() {
        if (!confirm('WARNING: Importing will ERASE all current snapshots and replace them with the imported data.\n\nAre you sure you want to continue?')) {
            return;
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importData = JSON.parse(event.target.result);

                    if (!importData.snapshots || !Array.isArray(importData.snapshots)) {
                        alert('Invalid snapshot file format.');
                        return;
                    }

                    if (importData.snapshots.length === 0) {
                        alert('No snapshots found in file.');
                        return;
                    }

                    GM_setValue('guild_xp_history', importData.snapshots);
                    alert(`Successfully imported ${importData.snapshots.length} snapshots.`);

                    // Refresh the UI if open
                    const xpTrackerPane = document.getElementById('xpTrackerPane');
                    if (xpTrackerPane && xpTrackerPane.style.display !== 'none') {
                        renderXPChanges(xpTrackerPane);
                    }
                } catch (error) {
                    alert(`Error importing file: ${error.message}`);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function renderCleanHistoryModal(onClose) {
        let history = GM_getValue('guild_xp_history', []);
        const selectedIndices = new Set();

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            padding: 20px;
            z-index: 10000;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = 'margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;';

        const title = document.createElement('h3');
        title.textContent = 'Manage Snapshots';
        title.style.cssText = 'margin: 0 0 10px 0; font-size: 18px; font-weight: bold; color: #1f2937;';
        header.appendChild(title);

        const info = document.createElement('p');
        info.textContent = `Total snapshots: ${history.length}`;
        info.style.cssText = 'margin: 0; font-size: 12px; color: #6b7280;';
        header.appendChild(info);

        modal.appendChild(header);

        // Max snapshots control
        const maxSnapshotsDiv = document.createElement('div');
        maxSnapshotsDiv.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            padding: 10px;
            background: #f9fafb;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
        `;

        const maxLabel = document.createElement('label');
        maxLabel.textContent = 'Max Snapshots:';
        maxLabel.style.cssText = 'font-weight: 600; font-size: 12px; color: #374151; user-select: none;';
        maxSnapshotsDiv.appendChild(maxLabel);

        const maxSelect = document.createElement('select');
        maxSelect.style.cssText = `
            padding: 6px 10px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            background: white;
            font-size: 12px;
            cursor: pointer;
            color: #374151;
        `;

        const presets = [50, 100, 250, 500, 750, 1000, 2500, 5000, 10000];
        presets.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            if (value === CONFIG.maxSnapshots) option.selected = true;
            maxSelect.appendChild(option);
        });

        maxSelect.onchange = (e) => {
            const newMax = parseInt(e.target.value);
            CONFIG.maxSnapshots = newMax;
            GM_setValue('max_snapshots', newMax);
        };

        maxSnapshotsDiv.appendChild(maxSelect);
        modal.appendChild(maxSnapshotsDiv);

        // Snapshot Interval Control
        const intervalDiv = document.createElement('div');
        intervalDiv.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            padding: 10px;
            background: #f9fafb;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
        `;

        const intervalLabel = document.createElement('label');
        intervalLabel.textContent = 'Snapshot Interval:';
        intervalLabel.style.cssText = 'font-weight: 600; font-size: 12px; color: #374151; user-select: none;';
        intervalDiv.appendChild(intervalLabel);

        const intervalSelect = document.createElement('select');
        intervalSelect.id = 'snapshotIntervalSelect';
        intervalSelect.style.cssText = `
            padding: 6px 10px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            background: white;
            font-size: 12px;
            cursor: pointer;
            color: #374151;
        `;

        const hourlyOpt = document.createElement('option');
        hourlyOpt.value = 'hourly';
        hourlyOpt.textContent = 'Hourly (1h)';
        intervalSelect.appendChild(hourlyOpt);

        const twelveHourOpt = document.createElement('option');
        twelveHourOpt.value = '12h';
        twelveHourOpt.textContent = '12 Hours';
        intervalSelect.appendChild(twelveHourOpt);

        const twentyFourHourOpt = document.createElement('option');
        twentyFourHourOpt.value = '24h';
        twentyFourHourOpt.textContent = '24 Hours';
        intervalSelect.appendChild(twentyFourHourOpt);

        const customOpt = document.createElement('option');
        customOpt.value = 'custom';
        customOpt.textContent = `Custom (${formatSnapshotInterval(CONFIG.minSnapshotInterval)})`;
        intervalSelect.appendChild(customOpt);

        // Set current value
        updateSnapshotIntervalDropdown(intervalSelect);

        intervalSelect.onchange = (e) => {
            const selectedValue = e.target.value;
            if (selectedValue === 'hourly') {
                CONFIG.minSnapshotInterval = SNAPSHOT_INTERVALS.HOURLY;
            } else if (selectedValue === '12h') {
                CONFIG.minSnapshotInterval = SNAPSHOT_INTERVALS.TWELVE_HOURS;
            } else if (selectedValue === '24h') {
                CONFIG.minSnapshotInterval = SNAPSHOT_INTERVALS.TWENTY_FOUR_HOURS;
            } else if (selectedValue === 'custom') {
                const userInput = prompt("Enter custom snapshot interval in minutes:", (CONFIG.minSnapshotInterval / (60 * 1000)).toString());
                if (userInput !== null && userInput.trim() !== '') {
                    const minutes = parseFloat(userInput);
                    if (!isNaN(minutes) && minutes > 0) {
                        CONFIG.minSnapshotInterval = minutes * 60 * 1000;
                        const customOption = intervalSelect.querySelector('option[value="custom"]');
                        if (customOption) {
                            customOption.textContent = `Custom (${formatSnapshotInterval(CONFIG.minSnapshotInterval)})`;
                        }
                    } else {
                        alert("Invalid input. Please enter a positive number.");
                        updateSnapshotIntervalDropdown(intervalSelect);
                        return;
                    }
                } else {
                    updateSnapshotIntervalDropdown(intervalSelect);
                    return;
                }
            }

            // Persist the change
            GM_setValue('min_snapshot_interval', CONFIG.minSnapshotInterval);
        };

        intervalDiv.appendChild(intervalSelect);
        modal.appendChild(intervalDiv);

        // Track which preset option is selected (null = none, or the option name)
        let selectedPreset = null;

        // Shortcut options - mutually exclusive checkboxes + Select All toggle
        const shortcutsDiv = document.createElement('div');
        shortcutsDiv.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 15px;
        `;

        const checkboxStyle = `
            display: flex;
            align-items: center;
            padding: 8px;
            border: 2px solid #ddd;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        `;

        const checkboxInputStyle = `
            width: 16px;
            height: 16px;
            margin-right: 8px;
            cursor: pointer;
            accent-color: #3b82f6;
        `;

        // Helper function to update preset selection
        function updatePresetSelection(newPreset) {
            selectedPreset = selectedPreset === newPreset ? null : newPreset;

            // Clear the selection if switching presets
            selectedIndices.clear();

            if (selectedPreset === 'all') {
                // Select all snapshots
                if (history.length === 0) {
                    alert('No snapshots to select.');
                    selectedPreset = null;
                } else {
                    for (let i = 0; i < history.length; i++) {
                        selectedIndices.add(i);
                    }
                }
            } else if (selectedPreset === 'daily') {
                // Keep daily
                const dailyMap = new Map();
                history.forEach((entry, idx) => {
                    const date = new Date(entry.timestamp);
                    const dayKey = date.toISOString().split('T')[0];
                    if (!dailyMap.has(dayKey)) {
                        dailyMap.set(dayKey, []);
                    }
                    dailyMap.get(dayKey).push(idx);
                });
                dailyMap.forEach(indices => {
                    for (let i = 0; i < indices.length - 1; i++) {
                        selectedIndices.add(indices[i]);
                    }
                });
            } else if (selectedPreset === 'weekly') {
                // Keep weekly
                const weeklyMap = new Map();
                history.forEach((entry, idx) => {
                    const date = new Date(entry.timestamp);
                    const dayOfWeek = date.getUTCDay();
                    const diff = date.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                    const weekStart = new Date(date.setUTCDate(diff));
                    const weekKey = weekStart.toISOString().split('T')[0];
                    if (!weeklyMap.has(weekKey)) {
                        weeklyMap.set(weekKey, []);
                    }
                    weeklyMap.get(weekKey).push(idx);
                });
                weeklyMap.forEach(indices => {
                    for (let i = 0; i < indices.length - 1; i++) {
                        selectedIndices.add(indices[i]);
                    }
                });
            } else if (selectedPreset === '7days') {
                // 7+ days old
                const now = getVirtualNow();
                const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
                history.forEach((entry, idx) => {
                    if ((now - entry.timestamp) > sevenDaysMs) {
                        selectedIndices.add(idx);
                    }
                });
            }

            renderCheckboxList();
            updateCheckboxStates();
        }

        function updateCheckboxStates() {
            allCheckbox.checked = selectedPreset === 'all';
            dailyCheckbox.checked = selectedPreset === 'daily';
            weeklyCheckbox.checked = selectedPreset === 'weekly';
            deleteOldCheckbox.checked = selectedPreset === '7days';
        }

        // All snapshots checkbox
        const allOption = document.createElement('label');
        allOption.style.cssText = checkboxStyle + ' color: #ef4444; user-select: none;';
        const allCheckbox = document.createElement('input');
        allCheckbox.type = 'checkbox';
        allCheckbox.style.cssText = checkboxInputStyle;
        const allLabel = document.createElement('span');
        allLabel.textContent = 'Select All';
        allLabel.style.cssText = 'user-select: none;';
        allOption.appendChild(allCheckbox);
        allOption.appendChild(allLabel);
        allOption.onclick = (e) => {
            if (e.target === allCheckbox) updatePresetSelection('all');
        };
        allOption.onmouseover = (e) => e.currentTarget.style.borderColor = '#ef4444';
        allOption.onmouseout = (e) => e.currentTarget.style.borderColor = selectedPreset === 'all' ? '#ef4444' : '#ddd';
        shortcutsDiv.appendChild(allOption);

        // Keep daily checkbox
        const dailyOption = document.createElement('label');
        dailyOption.style.cssText = checkboxStyle + ' color: #f59e0b; user-select: none;';
        const dailyCheckbox = document.createElement('input');
        dailyCheckbox.type = 'checkbox';
        dailyCheckbox.style.cssText = checkboxInputStyle;
        dailyCheckbox.style.accentColor = '#f59e0b';
        const dailyLabel = document.createElement('span');
        dailyLabel.textContent = 'Keep One Per Day';
        dailyLabel.style.cssText = 'user-select: none;';
        dailyOption.appendChild(dailyCheckbox);
        dailyOption.appendChild(dailyLabel);
        dailyOption.onclick = (e) => {
            if (e.target === dailyCheckbox) updatePresetSelection('daily');
        };
        dailyOption.onmouseover = (e) => e.currentTarget.style.borderColor = '#f59e0b';
        dailyOption.onmouseout = (e) => e.currentTarget.style.borderColor = selectedPreset === 'daily' ? '#f59e0b' : '#ddd';
        shortcutsDiv.appendChild(dailyOption);

        // Keep weekly checkbox
        const weeklyOption = document.createElement('label');
        weeklyOption.style.cssText = checkboxStyle + ' color: #3b82f6; user-select: none;';
        const weeklyCheckbox = document.createElement('input');
        weeklyCheckbox.type = 'checkbox';
        weeklyCheckbox.style.cssText = checkboxInputStyle;
        const weeklyLabel = document.createElement('span');
        weeklyLabel.textContent = 'Keep One Per Week';
        weeklyLabel.style.cssText = 'user-select: none;';
        weeklyOption.appendChild(weeklyCheckbox);
        weeklyOption.appendChild(weeklyLabel);
        weeklyOption.onclick = (e) => {
            if (e.target === weeklyCheckbox) updatePresetSelection('weekly');
        };
        weeklyOption.onmouseover = (e) => e.currentTarget.style.borderColor = '#3b82f6';
        weeklyOption.onmouseout = (e) => e.currentTarget.style.borderColor = selectedPreset === 'weekly' ? '#3b82f6' : '#ddd';
        shortcutsDiv.appendChild(weeklyOption);

        // 7+ days old checkbox
        const deleteOldOption = document.createElement('label');
        deleteOldOption.style.cssText = checkboxStyle + ' color: #8b5cf6; user-select: none;';
        const deleteOldCheckbox = document.createElement('input');
        deleteOldCheckbox.type = 'checkbox';
        deleteOldCheckbox.style.cssText = checkboxInputStyle;
        deleteOldCheckbox.style.accentColor = '#8b5cf6';
        const deleteOldLabel = document.createElement('span');
        deleteOldLabel.textContent = 'Delete 7+ Days Old';
        deleteOldLabel.style.cssText = 'user-select: none;';
        deleteOldOption.appendChild(deleteOldCheckbox);
        deleteOldOption.appendChild(deleteOldLabel);
        deleteOldOption.onclick = (e) => {
            if (e.target === deleteOldCheckbox) updatePresetSelection('7days');
        };
        deleteOldOption.onmouseover = (e) => e.currentTarget.style.borderColor = '#8b5cf6';
        deleteOldOption.onmouseout = (e) => e.currentTarget.style.borderColor = selectedPreset === '7days' ? '#8b5cf6' : '#ddd';
        shortcutsDiv.appendChild(deleteOldOption);

        modal.appendChild(shortcutsDiv);

        // Snapshot list container
        const listContainer = document.createElement('div');
        listContainer.style.cssText = `
            flex: 1;
            overflow-y: auto;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 10px;
            margin-bottom: 15px;
            background: #f9fafb;
        `;
        modal.appendChild(listContainer);

        function renderCheckboxList() {
            listContainer.innerHTML = '';

            if (history.length === 0) {
                listContainer.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 20px;">No snapshots available.</p>';
                return;
            }

            let currentDayKey = null;
            let useAltColor = false;

            history.forEach((entry, idx) => {
                const item = document.createElement('div');
                const isSelected = selectedIndices.has(idx);

                // Check if date changed
                const entryDate = new Date(entry.timestamp);
                const entryDayKey = entryDate.toISOString().split('T')[0]; // YYYY-MM-DD
                if (entryDayKey !== currentDayKey) {
                    currentDayKey = entryDayKey;
                    useAltColor = !useAltColor; // Toggle color when day changes
                }

                item.style.cssText = `
                    display: flex;
                    align-items: center;
                    padding: 8px;
                    margin: 4px 0;
                    background: ${isSelected ? '#fee2e2' : (useAltColor ? '#f3f4f6' : 'white')};
                    border-radius: 4px;
                    border: 1px solid ${isSelected ? '#fecaca' : '#e5e7eb'};
                    transition: background-color 0.2s, border-color 0.2s;
                `;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = selectedIndices.has(idx);
                checkbox.style.cssText = 'margin-right: 10px; cursor: pointer;';
                checkbox.onchange = (e) => {
                    if (e.target.checked) {
                        selectedIndices.add(idx);
                    } else {
                        selectedIndices.delete(idx);
                    }
                    renderCheckboxList();
                };
                item.appendChild(checkbox);

                const label = document.createElement('label');
                label.style.cssText = `flex: 1; cursor: pointer; font-size: 12px; color: ${isSelected ? '#991b1b' : '#374151'}; ${isSelected ? 'text-decoration: line-through;' : ''}`;
                label.onclick = () => {
                    checkbox.checked = !checkbox.checked;
                    if (checkbox.checked) {
                        selectedIndices.add(idx);
                    } else {
                        selectedIndices.delete(idx);
                    }
                    renderCheckboxList();
                };

                const timestamp = new Date(entry.timestamp);
                const memberCount = Object.keys(entry.members).length;
                label.innerHTML = `
                    <span style="font-weight: bold;">${idx + 1})</span>
                    ${timestamp.toLocaleString()}
                    <span style="color: ${isSelected ? '#b91c1c' : '#6b7280'};\">(${memberCount} members)</span>
                `;
                item.appendChild(label);

                listContainer.appendChild(item);
            });
        }

        renderCheckboxList();

        // Bottom buttons
        const buttonDiv = document.createElement('div');
        buttonDiv.style.cssText = `
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
        `;

        const modernButtonStyle = (bgColor, textColor, hoverBg) => `
            flex: 1;
            min-width: 120px;
            padding: 12px 16px;
            border: none;
            border-radius: 6px;
            background: ${bgColor};
            color: ${textColor};
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        `;

        const deleteSelectedBtn = document.createElement('button');
        deleteSelectedBtn.innerHTML = '🗑️ Delete Selected';
        deleteSelectedBtn.style.cssText = modernButtonStyle('#dc2626', 'white', '#991b1b');
        deleteSelectedBtn.onmouseover = (e) => {
            e.target.style.backgroundColor = '#b91c1c';
            e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
        };
        deleteSelectedBtn.onmouseout = (e) => {
            e.target.style.backgroundColor = '#dc2626';
            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        };
        deleteSelectedBtn.onclick = () => {
            if (selectedIndices.size === 0) {
                alert('No snapshots selected.');
                return;
            }
            const newHistory = history.filter((_, idx) => !selectedIndices.has(idx));
            const deleted = history.length - newHistory.length;
            if (confirm(`Delete ${deleted} snapshot(s)?`)) {
                GM_setValue('guild_xp_history', newHistory);
                overlay.remove();
                modal.remove();
                onClose(newHistory);
            }
        };
        buttonDiv.appendChild(deleteSelectedBtn);

        const exportBtn = document.createElement('button');
        exportBtn.innerHTML = '💾 Export Snapshots';
        exportBtn.style.cssText = modernButtonStyle('#3b82f6', 'white', '#1d4ed8');
        exportBtn.onmouseover = (e) => {
            e.target.style.backgroundColor = '#2563eb';
            e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
        };
        exportBtn.onmouseout = (e) => {
            e.target.style.backgroundColor = '#3b82f6';
            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        };
        exportBtn.onclick = () => {
            exportSnapshots();
        };
        buttonDiv.appendChild(exportBtn);

        const importBtn = document.createElement('button');
        importBtn.innerHTML = '📥 Import Snapshots';
        importBtn.style.cssText = modernButtonStyle('#10b981', 'white', '#047857');
        importBtn.onmouseover = (e) => {
            e.target.style.backgroundColor = '#059669';
            e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
        };
        importBtn.onmouseout = (e) => {
            e.target.style.backgroundColor = '#10b981';
            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        };
        importBtn.onclick = () => {
            importSnapshots();
        };
        buttonDiv.appendChild(importBtn);

        const cancelBtn = document.createElement('button');
        cancelBtn.innerHTML = '✕ Close';
        cancelBtn.style.cssText = modernButtonStyle('#f3f4f6', '#6b7280', '#e5e7eb');
        cancelBtn.onmouseover = (e) => {
            e.target.style.backgroundColor = '#e5e7eb';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        };
        cancelBtn.onmouseout = (e) => {
            e.target.style.backgroundColor = '#f3f4f6';
            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        };
        cancelBtn.onclick = () => {
            overlay.remove();
            modal.remove();
        };
        buttonDiv.appendChild(cancelBtn);

        modal.appendChild(buttonDiv);

        overlay.onclick = () => {
            overlay.remove();
            modal.remove();
        };

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }

    function renderXPChanges(container) {
        container.innerHTML = '';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';

        const currentMembers = parseGuildMembers();
        let history = GM_getValue('guild_xp_history', []);

        if (!currentMembers || Object.keys(currentMembers).length === 0) {
            container.innerHTML = '<p class="text-gray-500">Please wait for members to load...</p>';
            return;
        }

        // --- Controls ---
        const controls = document.createElement('div');
        controls.style.marginBottom = '15px';
        controls.style.display = 'flex';
        controls.style.flexDirection = 'column';
        controls.style.gap = '10px';

        // Snapshot Button + Action Buttons
        const snapRow = document.createElement('div');
        snapRow.style.display = 'flex';
        snapRow.style.justifyContent = 'flex-end';
        snapRow.style.gap = '8px';
        snapRow.style.flexWrap = 'wrap';

        const snapBtn = document.createElement('button');
        snapBtn.innerHTML = '📷 Take a Snapshot';
        snapBtn.className = 'control-button';
        snapBtn.onclick = () => {
            history = saveGuildSnapshot(currentMembers, true);
            renderXPChanges(container);
        };
        snapRow.appendChild(snapBtn);

        const csvBtn = document.createElement('button');
        csvBtn.innerHTML = '📥 Export CSV';
        csvBtn.className = 'control-button';
        csvBtn.onclick = () => {
            // Pass current selection to export function
            exportToCSV(history, currentMembers, fromSelect.value, toSelect.value);
        };
        snapRow.appendChild(csvBtn);

        const exportAllDataBtn = document.createElement('button');
        exportAllDataBtn.innerHTML = '🎨 Export All User Data';
        exportAllDataBtn.className = 'control-button';
        exportAllDataBtn.style.color = '#a855f7';
        exportAllDataBtn.title = 'Fetch and export all guild members\' data (including colors) as JSON';
        exportAllDataBtn.onclick = async () => {
            exportAllDataBtn.disabled = true;
            exportAllDataBtn.style.opacity = '0.5';
            await fetchAllGuildMembersData();
            exportAllDataBtn.disabled = false;
            exportAllDataBtn.style.opacity = '1';
        };
        snapRow.appendChild(exportAllDataBtn);

        const cleanBtn = document.createElement('button');
        cleanBtn.innerHTML = '🧹 Manage History';
        cleanBtn.className = 'control-button';
        cleanBtn.style.color = '#ef4444';
        cleanBtn.onclick = () => {
            renderCleanHistoryModal((newHistory) => {
                history = newHistory;
                renderXPChanges(container);
            });
        };
        snapRow.appendChild(cleanBtn);

        controls.appendChild(snapRow);

        // Selectors
        const getOptions = () => {
            const snaps = history.map((entry, index) => ({
                label: `${index + 1}) ${new Date(entry.timestamp).toLocaleString()}`,
                value: index,
                members: entry.members
            }));
            const curr = {
                label: `Now (${new Date(getVirtualNow()).toLocaleString()})`,
                value: 'current',
                members: currentMembers
            };
            return { snaps, curr, all: [...snaps, curr] };
        };

        let { snaps: snapshots, curr: currentSnapshot, all: allOptions } = getOptions();

        // Filter buttons
        const filterRow = document.createElement('div');
        filterRow.style.display = 'flex';
        filterRow.style.gap = '8px';
        filterRow.style.flexWrap = 'wrap';

        let filterMode = 'all'; // 'all', 'active', 'inactive'
        const allBtn = document.createElement('button');
        allBtn.innerHTML = 'Show All';
        allBtn.className = 'control-button active';
        allBtn.onclick = () => {
            filterMode = 'all';
            allBtn.classList.add('active');
            activeBtn.classList.remove('active');
            inactiveBtn.classList.remove('active');
            updateTable();
        };
        filterRow.appendChild(allBtn);

        const activeBtn = document.createElement('button');
        activeBtn.innerHTML = 'Active';
        activeBtn.className = 'control-button';
        activeBtn.onclick = () => {
            filterMode = 'active';
            allBtn.classList.remove('active');
            activeBtn.classList.add('active');
            inactiveBtn.classList.remove('active');
            updateTable();
        };
        filterRow.appendChild(activeBtn);

        const inactiveBtn = document.createElement('button');
        inactiveBtn.innerHTML = 'Inactive';
        inactiveBtn.className = 'control-button';
        inactiveBtn.onclick = () => {
            filterMode = 'inactive';
            allBtn.classList.remove('active');
            activeBtn.classList.remove('active');
            inactiveBtn.classList.add('active');
            updateTable();
        };
        filterRow.appendChild(inactiveBtn);
        controls.appendChild(filterRow);

        const row1 = document.createElement('div');
        row1.style.display = 'flex';
        row1.style.gap = '10px';
        row1.style.alignItems = 'center';
        row1.style.flexWrap = 'wrap';

        const fromSelect = document.createElement('select');
        fromSelect.style.flex = '1';
        fromSelect.style.padding = '4px';
        fromSelect.style.border = '2px solid #3b82f6';
        fromSelect.style.borderRadius = '4px';

        const toSelect = document.createElement('select');
        toSelect.style.flex = '1';
        toSelect.style.padding = '4px';
        toSelect.style.border = '2px solid #3b82f6';
        toSelect.style.borderRadius = '4px';

        // Populate
        allOptions.forEach(opt => {
            fromSelect.add(new Option(opt.label, opt.value));
            toSelect.add(new Option(opt.label, opt.value));
        });

        // Defaults
        if (snapshots.length >= 1) {
            fromSelect.value = snapshots[snapshots.length - 1].value;
        } else {
            fromSelect.value = 'current';
        }
        toSelect.value = 'current';

        row1.appendChild(document.createTextNode('From:'));
        row1.appendChild(fromSelect);

        // Delete "From" button
        const deleteFromBtn = document.createElement('button');
        deleteFromBtn.className = 'trash-btn';
        deleteFromBtn.innerHTML = '🗑️';
        deleteFromBtn.title = 'Delete this snapshot';
        deleteFromBtn.onclick = () => {
            const snapIndex = parseInt(fromSelect.value);
            if (snapIndex >= 0 && snapIndex < history.length) {
                if (confirm('Delete this snapshot?')) {
                    history.splice(snapIndex, 1);
                    GM_setValue('guild_xp_history', history);
                    renderXPChanges(container);
                }
            }
        };
        row1.appendChild(deleteFromBtn);

        row1.appendChild(document.createTextNode('To:'));
        row1.appendChild(toSelect);

        // Delete "To" button
        const deleteToBtn = document.createElement('button');
        deleteToBtn.className = 'trash-btn';
        deleteToBtn.innerHTML = '🗑️';
        deleteToBtn.title = 'Delete this snapshot';
        deleteToBtn.onclick = () => {
            const snapIndex = parseInt(toSelect.value);
            if (snapIndex >= 0 && snapIndex < history.length) {
                if (confirm('Delete this snapshot?')) {
                    history.splice(snapIndex, 1);
                    GM_setValue('guild_xp_history', history);
                    renderXPChanges(container);
                }
            }
        };
        row1.appendChild(deleteToBtn);

        controls.appendChild(row1);

        // Results Area
        const resultsDiv = document.createElement('div');
        resultsDiv.style.flex = '1';
        resultsDiv.style.overflowY = 'auto';
        resultsDiv.style.minHeight = '0'; // Crucial for flexbox scrolling
        resultsDiv.style.border = '1px solid #e5e7eb';
        resultsDiv.style.borderRadius = '0.5rem';

        const updateTable = () => {
            resultsDiv.innerHTML = '';
            const fromVal = fromSelect.value;
            const toVal = toSelect.value;

            const fromData = fromVal === 'current' ? currentSnapshot : snapshots[fromVal];
            const toData = toVal === 'current' ? currentSnapshot : snapshots[toVal];

            if (!fromData || !toData) return;

            let changes = calculateXPChanges(fromData.members, toData.members);

            // Apply filter
            if (filterMode === 'active') {
                changes = changes.filter(c => {
                    // Active = Joined OR Positive XP Gain
                    return c.type === 'join' || c.diff > 0;
                });
            } else if (filterMode === 'inactive') {
                changes = changes.filter(c => {
                    // Inactive = Left OR Zero/Negative XP Gain
                    return c.type === 'left' || c.diff <= 0;
                });
            }

            // Sort
            changes.sort((a, b) => {
                if (a.type === 'join') return -1;
                if (b.type === 'join') return 1;
                if (a.type === 'left') return 1;
                if (b.type === 'left') return -1;
                return b.diff - a.diff;
            });

            const table = document.createElement('table');
            table.className = 'daily-brief-table';
            table.innerHTML = `<thead><tr><th>User</th><th>Change</th><th>Details</th></tr></thead>`;
            const tbody = document.createElement('tbody');

            if (changes.length === 0) {
                tbody.innerHTML = `<tr><td colspan="3" style="text-align:center">No changes.</td></tr>`;
            } else {
                changes.forEach(change => {
                    const tr = document.createElement('tr');

                    // User Cell with Buttons and Coordinates
                    const userTd = document.createElement('td');
                    userTd.style.display = 'flex';
                    userTd.style.alignItems = 'center';
                    userTd.style.gap = '4px';

                    // Create user info (name only)
                    const nameSpan = document.createElement('span');
                    nameSpan.className = 'user-name';
                    nameSpan.textContent = change.id;

                    userTd.appendChild(nameSpan);

                    // Extract ID
                    const match = change.id.match(/#(\d+)$/);
                    if (match) {
                        const userId = match[1];
                        // Discord Button
                        const discordBtn = document.createElement('button');
                        discordBtn.className = 'member-icon-btn discord-icon';
                        discordBtn.title = 'Check Discord';
                        discordBtn.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" width="16" height="16" fill="currentColor">
                                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22c1.24-23.25-13.28-47.54-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                            </svg>
                        `;
                        discordBtn.onclick = async (e) => {
                            e.stopPropagation();
                            const data = await fetchUserProfile(userId);
                            if (data && data.discordUser) {
                                navigator.clipboard.writeText(data.discordUser).then(() => {
                                    showTooltip(e.clientX, e.clientY, `Discord ID: ${data.discordUser} copied!`);
                                });
                            } else {
                                showTooltip(e.clientX, e.clientY, 'No Discord ID found.');
                            }
                        };
                        userTd.appendChild(discordBtn);
                    }

                    // Map Button
                    if (change.coords) {
                        const mapBtn = document.createElement('button');
                        mapBtn.className = 'member-icon-btn map-icon';
                        mapBtn.title = 'Find on Map';
                        mapBtn.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="10" r="3"/>
                                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/>
                            </svg>
                        `;
                        const coordKey = `${change.coords[0]},${change.coords[1]}`;
                        if (sessionState.visitedCoords.has(coordKey)) {
                            mapBtn.classList.add('visited');
                        }
                        mapBtn.onclick = () => {
                            // Find the original Find button in the member row and click it
                            const memberName = change.id;
                            const memberRows = document.querySelectorAll('#guildMembersContainer div.flex.items-center.justify-between');
                            let found = false;
                            for (const row of memberRows) {
                                const nameEl = row.querySelector('p.font-semibold');
                                if (nameEl) {
                                    // Remove badge the same way parseGuildMembers does
                                    let displayName = nameEl.textContent.trim();
                                    const badge = nameEl.querySelector('span');
                                    if (badge) {
                                        displayName = displayName.replace(badge.textContent, '').trim();
                                    }
                                    // Match by exact name to handle both users with and without usernames
                                    if (displayName === memberName) {
                                        const findBtn = row.querySelector('button[onclick^="goToGridLocation"]');
                                        if (findBtn) {
                                            findBtn.click();
                                            found = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (!found && window.goToGridLocation) {
                                window.goToGridLocation(change.coords[0], change.coords[1]);
                            }
                            // Mark as visited
                            sessionState.visitedCoords.add(coordKey);
                            mapBtn.classList.add('visited');
                        };
                        userTd.appendChild(mapBtn);
                    }

                    // Display coordinates if available (right-aligned)
                    if (change.coords) {
                        const spacer = document.createElement('div');
                        spacer.style.flex = '1';
                        userTd.appendChild(spacer);

                        const coordsSpan = document.createElement('span');
                        coordsSpan.className = 'user-coords';

                        // Get colors based on quadrant and distance
                        const colors = getCoordinateColor(change.coords);
                        coordsSpan.style.backgroundColor = colors.bg;
                        coordsSpan.style.padding = '2px 6px';
                        coordsSpan.style.borderRadius = '3px';

                        // Create styled parts
                        const openParen = document.createElement('span');
                        openParen.style.color = colors.text;
                        openParen.textContent = '(';

                        const xVal = document.createElement('span');
                        xVal.style.color = colors.text;
                        xVal.style.fontWeight = '500';
                        xVal.textContent = change.coords[0];

                        const comma = document.createElement('span');
                        comma.style.color = colors.text;
                        comma.textContent = ', ';

                        const yVal = document.createElement('span');
                        yVal.style.color = colors.text;
                        yVal.style.fontWeight = '500';
                        yVal.textContent = change.coords[1];

                        const closeParen = document.createElement('span');
                        closeParen.style.color = colors.text;
                        closeParen.textContent = ')';

                        coordsSpan.appendChild(openParen);
                        coordsSpan.appendChild(xVal);
                        coordsSpan.appendChild(comma);
                        coordsSpan.appendChild(yVal);
                        coordsSpan.appendChild(closeParen);

                        userTd.appendChild(coordsSpan);
                    }

                    let changeCell = '';
                    if (change.type === 'gain') {
                        changeCell = change.diff > 0 ? `<td class="xp-gain">+${change.diff.toLocaleString()}</td>` :
                                     (change.diff < 0 ? `<td class="xp-loss">${change.diff.toLocaleString()}</td>` : `<td class="xp-neutral">0</td>`);
                    } else if (change.type === 'join') {
                        changeCell = `<td class="xp-gain">JOINED</td>`;
                    } else if (change.type === 'left') {
                        changeCell = `<td class="xp-loss">LEFT</td>`;
                    }

                    tr.appendChild(userTd);

                    // Change Cell
                    const changeTd = document.createElement('td');
                    changeTd.innerHTML = changeCell.replace(/^<td.*?>|<\/td>$/g, ''); // Strip outer td tags since we are creating td
                    changeTd.className = changeCell.match(/class="([^"]+)"/)?.[1] || '';
                    tr.appendChild(changeTd);

                    // Details Cell
                    const detailsTd = document.createElement('td');
                    detailsTd.textContent = `${change.oldXp?.toLocaleString() || 0} → ${change.newXp?.toLocaleString() || 0}`;
                    tr.appendChild(detailsTd);

                    tbody.appendChild(tr);
                });
            }
            table.appendChild(tbody);
            resultsDiv.appendChild(table);
        };

        fromSelect.onchange = updateTable;
        toSelect.onchange = updateTable;

        updateTable();

        container.appendChild(controls);
        container.appendChild(resultsDiv);
    }

    // --- Main Logic ---

    async function transformGuildModal() {
        try {
            await waitForElement('#myGuildModal', 10000);

            const modal = document.getElementById('myGuildModal');
            const panel = document.getElementById('myGuildPanel');

            if (!modal || !panel) {
                console.error('[Guild Modal] myGuildModal or myGuildPanel not found');
                return;
            }

            if (panel.classList.contains('draggable-panel')) {
                return;
            }

            modal.style.position = 'fixed';
            modal.style.inset = 'auto';
            modal.style.backgroundColor = 'transparent';
            modal.style.justifyContent = 'flex-start';
            modal.style.alignItems = 'flex-start';
            modal.style.padding = '0';
            modal.style.pointerEvents = 'none';

            panel.style.position = 'fixed';
            panel.style.top = '100px';
            panel.style.left = 'calc(50% - 25rem)';
            panel.style.width = '50rem';
            panel.style.maxWidth = '90vw';
            panel.style.maxHeight = '85vh';
            panel.style.zIndex = '40';
            panel.style.cursor = 'default';
            panel.style.transform = 'none';
            panel.style.opacity = '1';
            panel.style.scale = '1';
            panel.style.pointerEvents = 'auto';
            panel.classList.add('draggable-panel');

            const existingHeader = panel.querySelector('.guild-modal-header');
            if (existingHeader) existingHeader.remove();

            const headerBar = document.createElement('div');
            headerBar.className = 'guild-modal-header';
            headerBar.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 40px;
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                cursor: move;
                border-radius: 0.75rem 0.75rem 0 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 16px;
                color: white;
                font-weight: 600;
                user-select: none;
                z-index: 50;
                pointer-events: auto;
            `;

            const titleSpan = document.createElement('span');
            titleSpan.textContent = 'Guild Panel';
            titleSpan.style.cursor = 'move';

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕';
            closeBtn.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                border-radius: 4px;
                transition: background-color 0.2s;
            `;
            closeBtn.onmouseover = () => closeBtn.style.backgroundColor = 'rgba(255,255,255,0.2)';
            closeBtn.onmouseout = () => closeBtn.style.backgroundColor = 'transparent';
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                if (typeof window.toggleMyGuildModal === 'function') {
                    window.toggleMyGuildModal();
                } else {
                    const originalClose = document.querySelector('#myGuildModal .close-modal, #myGuildModal [onclick*="toggleMyGuildModal"]');
                    if (originalClose) {
                        originalClose.click();
                    } else {
                        modal.style.display = 'none';
                    }
                }
            };

            headerBar.appendChild(titleSpan);
            headerBar.appendChild(closeBtn);

            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'guild-modal-resize';
            resizeHandle.style.cssText = `
                position: absolute;
                bottom: 0;
                right: 0;
                width: 20px;
                height: 20px;
                cursor: nwse-resize;
                background: linear-gradient(135deg, transparent 0%, #3b82f6 100%);
                border-radius: 0 0 0.75rem 0;
                z-index: 51;
                pointer-events: auto;
            `;

            panel.style.paddingTop = '50px';

            if (panel.firstChild) {
                panel.insertBefore(headerBar, panel.firstChild);
            } else {
                panel.appendChild(headerBar);
            }

            panel.appendChild(resizeHandle);

            setupDragHandling(panel, titleSpan);
            setupResizeHandling(panel, resizeHandle);
            setupMessageCollapsible();
            setupContentTracking();

            console.log('[Guild Modal] Transformed to draggable floating panel');

        } catch (error) {
            console.error('[Guild Modal] Error transforming modal:', error);
        }
    }

    function setupDragHandling(panel, header) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let offsetX = 0;
        let offsetY = 0;

        const onMouseDown = (e) => {
            if (e.target.closest('.guild-modal-resize') || e.target.closest('button')) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = panel.getBoundingClientRect();
            offsetX = rect.left;
            offsetY = rect.top;

            panel.style.userSelect = 'none';

            document.addEventListener('mousemove', onMouseMove, true);
            document.addEventListener('mouseup', onMouseUp, true);

            e.preventDefault();
            e.stopPropagation();
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            const newX = offsetX + deltaX;
            const newY = offsetY + deltaY;

            const maxX = window.innerWidth - 100;
            const maxY = window.innerHeight - 100;

            const constrainedX = Math.max(-panel.offsetWidth + 100, Math.min(newX, maxX));
            const constrainedY = Math.max(0, Math.min(newY, maxY));

            panel.style.left = constrainedX + 'px';
            panel.style.top = constrainedY + 'px';
            panel.style.transform = 'none';
            panel.style.position = 'fixed';

            e.preventDefault();
            e.stopPropagation();
        };

        const onMouseUp = (e) => {
            if (isDragging) {
                isDragging = false;
                panel.style.userSelect = 'auto';
                document.removeEventListener('mousemove', onMouseMove, true);
                document.removeEventListener('mouseup', onMouseUp, true);
                e.preventDefault();
                e.stopPropagation();
            }
        };

        header.addEventListener('mousedown', onMouseDown, false);
    }

    function setupResizeHandling(panel, resizeHandle) {
        let isResizing = false;
        let startX = 0;
        let startY = 0;
        let startWidth = 0;
        let startHeight = 0;

        const onMouseDown = (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = panel.offsetWidth;
            startHeight = panel.offsetHeight;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            e.preventDefault();
        };

        const onMouseMove = (e) => {
            if (!isResizing) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            const newWidth = Math.max(400, startWidth + deltaX);
            const newHeight = Math.max(300, startHeight + deltaY);

            panel.style.width = newWidth + 'px';
            panel.style.height = newHeight + 'px';
        };

        const onMouseUp = () => {
            isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        resizeHandle.addEventListener('mousedown', onMouseDown);
    }

    function setupMessageCollapsible() {
        const infoTab = document.getElementById('infoTab');
        const messageDiv = infoTab?.querySelector('div:has(> h3:first-child):has(#guildInfoMessage)');

        if (!messageDiv) return;

        const messageSection = document.createElement('div');
        messageSection.className = 'guild-message-section';

        const messageHeader = document.createElement('div');
        messageHeader.className = 'guild-message-header';

        const toggleSpan = document.createElement('span');
        toggleSpan.className = 'guild-message-toggle';
        toggleSpan.textContent = '▼';

        const titleSpan = document.createElement('span');
        titleSpan.textContent = 'Message';
        titleSpan.style.fontWeight = '500';

        messageHeader.appendChild(toggleSpan);
        messageHeader.appendChild(titleSpan);

        const messageContent = document.createElement('div');
        messageContent.className = 'guild-message-content';

        const h3 = messageDiv.querySelector('h3');
        const p = messageDiv.querySelector('#guildInfoMessage');

        if (h3 && p) {
            messageContent.appendChild(h3.cloneNode(true));
            messageContent.appendChild(p.cloneNode(true));

            messageDiv.parentNode.replaceChild(messageSection, messageDiv);
            messageSection.appendChild(messageHeader);
            messageSection.appendChild(messageContent);

            let isCollapsed = false;

            messageHeader.addEventListener('click', () => {
                isCollapsed = !isCollapsed;
                toggleSpan.classList.toggle('collapsed', isCollapsed);
                messageContent.classList.toggle('collapsed', isCollapsed);
                infoTab.classList.toggle('message-collapsed', isCollapsed);
            });
        }
    }

    function setupContentTracking() {
        const infoTab = document.getElementById('infoTab');
        if (!infoTab) return;

        const observer = new MutationObserver((mutations) => {
            let membersUpdated = false;

            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.id === 'guildMembersContainer' || node.querySelector('#guildMembersContainer')) {
                                membersUpdated = true;
                            }
                        }
                    });
                }
            });

            if (membersUpdated || (document.getElementById('guildMembersContainer') && document.getElementById('guildMembersContainer').children.length > 1)) {
                const members = parseGuildMembers();
                if (members && Object.keys(members).length > 0) {
                    saveGuildSnapshot(members);
                }
                ensureXPChangesSection();
            }
        });

        // Initial scan
        ensureXPChangesSection();

        observer.observe(infoTab, {
            childList: true,
            subtree: true
        });
    }

    // --- Snapshot Interval Helper Functions ---

    function formatSnapshotInterval(ms) {
        const seconds = ms / 1000;
        if (seconds < 60) return `${seconds}s`;
        const minutes = seconds / 60;
        if (minutes < 60) return `${minutes.toFixed(1)}m`;
        const hours = minutes / 60;
        if (hours < 24) return `${hours.toFixed(1)}h`;
        const days = hours / 24;
        return `${days.toFixed(1)}d`;
    }

    function getSnapshotIntervalLabel(ms) {
        if (ms === SNAPSHOT_INTERVALS.HOURLY) return 'Hourly (1h)';
        if (ms === SNAPSHOT_INTERVALS.TWELVE_HOURS) return '12 Hours';
        if (ms === SNAPSHOT_INTERVALS.TWENTY_FOUR_HOURS) return '24 Hours';
        return `Custom (${formatSnapshotInterval(ms)})`;
    }

    function updateSnapshotIntervalUI() {
        const dropdown = document.getElementById('snapshotIntervalSelect');
        if (dropdown) {
            updateSnapshotIntervalDropdown(dropdown);
        }
    }

    function updateSnapshotIntervalDropdown(dropdown) {
        // Update dropdown to show current value
        if (CONFIG.minSnapshotInterval === SNAPSHOT_INTERVALS.HOURLY) {
            dropdown.value = 'hourly';
        } else if (CONFIG.minSnapshotInterval === SNAPSHOT_INTERVALS.TWELVE_HOURS) {
            dropdown.value = '12h';
        } else if (CONFIG.minSnapshotInterval === SNAPSHOT_INTERVALS.TWENTY_FOUR_HOURS) {
            dropdown.value = '24h';
        } else {
            dropdown.value = 'custom';
            const customOption = dropdown.querySelector('option[value="custom"]');
            if (customOption) {
                customOption.textContent = `Custom (${formatSnapshotInterval(CONFIG.minSnapshotInterval)})`;
            }
        }
    }

    // --- Menu Commands ---

    // Snapshot Interval Menu Commands
    GM_registerMenuCommand("Snapshot Interval: Hourly", () => {
        CONFIG.minSnapshotInterval = SNAPSHOT_INTERVALS.HOURLY;
        GM_setValue('min_snapshot_interval', CONFIG.minSnapshotInterval);
        updateSnapshotIntervalUI();
        alert(`Snapshot Interval set to: Hourly (1 hour)`);
    });

    GM_registerMenuCommand("Snapshot Interval: 12 Hours", () => {
        CONFIG.minSnapshotInterval = SNAPSHOT_INTERVALS.TWELVE_HOURS;
        GM_setValue('min_snapshot_interval', CONFIG.minSnapshotInterval);
        updateSnapshotIntervalUI();
        alert(`Snapshot Interval set to: 12 Hours`);
    });

    GM_registerMenuCommand("Snapshot Interval: 24 Hours", () => {
        CONFIG.minSnapshotInterval = SNAPSHOT_INTERVALS.TWENTY_FOUR_HOURS;
        GM_setValue('min_snapshot_interval', CONFIG.minSnapshotInterval);
        updateSnapshotIntervalUI();
        alert(`Snapshot Interval set to: 24 Hours`);
    });

    GM_registerMenuCommand("Snapshot Interval: Custom", () => {
        const userInput = prompt("Enter custom snapshot interval in minutes:", (CONFIG.minSnapshotInterval / (60 * 1000)).toString());
        if (userInput !== null && userInput.trim() !== '') {
            const minutes = parseFloat(userInput);
            if (!isNaN(minutes) && minutes > 0) {
                CONFIG.minSnapshotInterval = minutes * 60 * 1000;
                GM_setValue('min_snapshot_interval', CONFIG.minSnapshotInterval);
                updateSnapshotIntervalUI();
                alert(`Snapshot Interval set to: ${minutes} minute(s) (${(CONFIG.minSnapshotInterval / 1000).toLocaleString()} seconds)`);
            } else {
                alert("Invalid input. Please enter a positive number.");
            }
        }
    });

    GM_registerMenuCommand("Toggle Debug Mode", () => {
        CONFIG.debugMode = !CONFIG.debugMode;
        alert(`Debug Mode: ${CONFIG.debugMode ? 'ON' : 'OFF'}`);
    });

    GM_registerMenuCommand("Time Travel: Advance 1 Day", () => {
        CONFIG.timeOffset += 24 * 60 * 60 * 1000;
        GM_setValue('debug_time_offset', CONFIG.timeOffset);
        const virtualDate = new Date(getVirtualNow());
        alert(`Time Travel Active! Virtual Date: ${virtualDate.toDateString()}\nReload the page to apply.`);
    });

    GM_registerMenuCommand("Time Travel: Reset", () => {
        CONFIG.timeOffset = 0;
        GM_setValue('debug_time_offset', 0);
        alert(`Time Travel Reset. Back to reality.`);
    });

    GM_registerMenuCommand("Reset Guild XP History", () => {
        if (confirm("Are you sure you want to clear all stored Guild XP history? This cannot be undone.")) {
            GM_setValue('guild_xp_history', []);
            alert("Guild XP history has been reset.");
        }
    });

    // --- Initialization ---

    function init() {
        // Initial check
        transformGuildModal();

        // Global observer for modal re-creation
        const bodyObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.id === 'myGuildModal' || node.querySelector('#myGuildModal')) {
                            console.log('[Guild Modal] Modal detected, re-initializing...');
                            transformGuildModal();
                        }
                    }
                }
            }
        });

        bodyObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('[Guild Modal] v2.0 - Loaded with coordinate display');

})();
