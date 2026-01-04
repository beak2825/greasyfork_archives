// ==UserScript==
// @name FlatMMO Action Progress Bar
// @namespace com.dounford.flatmmo
// @version  QoLpacked - Current
// @description Big QoL - Trackers *Meteor,Storm,Bondfire,eviltree*, Worship Hotkeys, Loot highlights * Objects, Digspots * And more.
// @author UseMyLoot
// @match *://flatmmo.com/play.php*
// @grant none
// @require https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/555056/FlatMMO%20Action%20Progress%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/555056/FlatMMO%20Action%20Progress%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================================
    // I. CORE CONSTANTS & STATE (Shared)
    // ===================================
    const PLUGIN_ID = 'flatmmo-progress-bar';
    const PROGRESS_BAR_TAG = 'PROGRESS_BAR=';
    const GROUND_ITEM_TAG = 'GROUND_ITEM=';
    const CHAT_LOCAL_MESSAGE = 'CHAT_LOCAL_MESSAGE=';
    const INNER_HTML_TAGS = 'INNER_HTML_TAGS=';

    // Progress Bar Configuration (Stable)
    const BAR_WIDTH = '220px';
    const BAR_HEIGHT = '20px';
    const MARGIN_TOP = '5px';

    // Visualizer State (External to class for loop/listeners)
    let overlayCanvas = null;
    let ctx = null;
    let TILE_SIZE = 64; // Default to 64
    let overlayRequested = false;
    let gameCanvasOffset = { x: 0, y: 0 };
    let gameIsFocused = document.visibilityState === 'visible';

    // Tracker State
    let meteorData = {
        location: 'Unknown',
        timestamp: 'N/A'
    };
    let treeData = {
        location: 'Unknown',
        timestamp: 'N/A'
    };
    let stormData = { status: 'Inactive', timestamp: 'N/A' };
    let bondfireData = { status: 'Inactive', timestamp: 'N/A' };
    let playersOnlineCount = '...';

    // Bondfire Countdown State
    let bondfireRemainingSeconds = 0; // Holds the total seconds for countdown
    let bondfireCountdownIntervalId = null; // Holds the interval ID

    // Pet Hider State
    let isPetsHidden = false; // Tracks current state based on config

    // Worship Hotkey State
    let areHotkeysActive = true; // Default state from config

    // --- Overlay Drag State ---
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let overlayConfig = JSON.parse(localStorage.getItem('fmg-overlay-config')) || {
        top: 100,
        left: 100
    };

    // Helper functions (assume existence of game globals for objects/items)
    function getGroundItems() { return (typeof ground_items !== 'undefined') ? ground_items : []; }
    function getMapObjects() { return (typeof map_objects !== 'undefined') ? map_objects : {}; }

    // Object List for Configuration (For Object Filtering Feature)
    const DIG_SPOT_NAMES = ['stardust_dig_spot', 'deep_dig_spot', 'deep_dig_spot_mega', 'dig_spot'];
    const OTHER_OBJECT_NAMES = [
        'wood_tree', 'stone_rock', 'copper_rock', 'iron_rock', 'silver_rock', 'gold_rock', 'crystal_rock',
        'titanium_rock', 'shrub', 'cave_entrance', 'ore_vein', 'deposit_box', 'chest', 'altar', 'portal', 'bank_chest', 'well'
    ];
    const OBJECT_NAMES = [...DIG_SPOT_NAMES, ...OTHER_OBJECT_NAMES];


    // ===================================
    // II. THEMES & COLORS (Progress Bar & Tracker)
    // ===================================
    const THEMES = {
        'default': { name: 'Default (Blue)', gradient: 'linear-gradient(90deg, #1098AD, #13BDEB, #1098AD)', container_bg: '#1a1a1a' },
        'green': { name: 'Green Theme', gradient: 'linear-gradient(90deg, #109849, #13EB5F, #109849)', container_bg: '#1a1a1a' },
        'red': { name: 'Red Theme', gradient: 'linear-gradient(90deg, #AD1010, #EB1313, #AD1010)', container_bg: '#1a1a1a' },
        'gold': { name: 'Gold Theme', gradient: 'linear-gradient(90deg, #AD8D10, #EBD513, #AD1010)', container_bg: '#1a1a1a' },
        'pumpkin': { name: 'Pumpkin Theme', gradient: 'linear-gradient(90deg, #662500, #FF6F00, #662500)', container_bg: '#4a3c35' },
        'sea': { name: 'Deep Sea Theme', gradient: 'linear-gradient(90deg, #0d253f, #01b4e4, #0d253f)', container_bg: '#05121f' },
        'mystic': { name: 'Mystic Vale Theme', gradient: 'linear-gradient(90deg, #6A6E94, #9598B9, #6A6E94)', container_bg: '#3c3e57' },
        'omboko': { name: 'Omboko Theme', gradient: 'linear-gradient(90deg, #1D2319, #4B682E, #1D2319)', container_bg: '#0f120e' }
    };

    const TEXT_COLORS = {
        'white': { name: 'White', color: '#f0f0f0', isDark: false },
        'light_gray': { name: 'Light Gray', color: '#aaaaaa', isDark: true },
        'orange': { name: 'Orange', color: '#FFB84D', isDark: false },
        'gold_theme': { name: 'Gold Theme', color: '#FFD700', isDark: false },
        'green_glow': { name: 'Green Glow', color: '#57FF89', isDark: false },
        'cyber_purple': { name: 'Cyber Purple', color: '#B300FF', isDark: false },
        'aqua': { name: 'Aqua', color: '#00FFFF', isDark: false },
        'vibrant_pink': { name: 'Vibrant Pink', color: '#FF3399', isDark: false },
        'pumpkin_text': { name: 'Theme: Pumpkin', color: '#FF8C00', isDark: false },
        'sea_text': { name: 'Theme: Deep Sea', color: '#01b4e4', isDark: false },
        'mystic_text': { name: 'Theme: Mystic', color: '#ffffff', isDark: false },
        'omboko_text': { name: 'Theme: Omboko', color: '#82CD47', isDark: false }
    };

    // ===================================
    // III. CSS STYLES
    // ===================================
    const CSS_STYLES = `
    /* Progress Bar Styles */
    #ui-panel-inventory {
        position: relative;
    }
    #flatmmo-action-bar-wrapper {
        margin-top: ${MARGIN_TOP};
        margin-bottom: 5px;
        position: relative;
    }
    #flatmmo-action-bar-container {
        width: ${BAR_WIDTH};
        height: ${BAR_HEIGHT};
        margin: 0 auto; /* <-- This will center it horizontally */
        border: 1px solid #444;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
        z-index: 99999;
        position: relative;
    }
    #flatmmo-action-bar-fill {
        height: 100%;
        width: 0%;
        transition: width var(--fmgpb-transition-speed, 0.1s) ease-out;
    }
    #flatmmo-action-bar-text-overlay {
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        z-index: 100000;
        line-height: ${BAR_HEIGHT};
        color: var(--fmgpb-text-color, #f0f0f0);
        text-shadow: var(--fmgpb-text-shadow, 0 0 3px #000);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: ${BAR_HEIGHT};
        text-align: center;
    }
    #flatmmo-compact-text-wrapper {
        position: absolute;
        top: 2px;
        right: 5px;
        line-height: 1;
        z-index: 100001;
        font-size: 12px;
        font-weight: bold;
        display: none;
    }

    /* Tracker Styles (Right Side Group - Top Bar) */
    .fmg-tracker-display-wrapper {
        font-family: 'Inter', sans-serif;
        font-size: 11px;
        text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
        line-height: 1.2;
        text-align: right;
        padding: 2px 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: 5px;
        box-sizing: border-box;
        border-radius: 4px;
        transition: color 0.2s, opacity 0.2s;
    }
    .fmg-tracker-display-wrapper span {
        display: block;
        line-height: 1.1;
    }

    /* Tracker Positioning - Higher order number moves it RIGHT */
    /* Player Count (Far Left of the event group) - New Top Bar Order */
    #fmg-player-count-wrapper { order: 95; }
    /* Bondfire (Next to Player Count) */
    #fmg-bondfire-display-wrapper { order: 96; margin-right: 2px; }
    /* Storm (Next to Bondfire) */
    #fmg-storm-display-wrapper { order: 97; margin-right: 2px; }
    /* Evil Tree Tracker Styles (Next to Storm) */
    #fmg-tree-display-wrapper { order: 98; margin-right: 2px; }
    /* Meteor Tracker Styles (Far Right Placement) */
    #fmg-meteor-display-wrapper { order: 99; }

    /* Player Count Styles (Top Bar) */
    #fmg-player-count-wrapper {
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        font-weight: bold;
        text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
        line-height: 1;
        padding: 0 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        order: 1;
        transition: color 0.2s, opacity 0.2s;
    }

    /* =================================== */
    /* FLOATING TRACKER OVERLAY STYLES */
    /* =================================== */
    /* The main wrapper is just for position/drag/resize */
    #fmg-tracker-overlay {
        position: fixed;
        z-index: 100002;
        min-width: 150px;
        min-height: 50px;
        resize: both; /* Allow resizing */
        overflow: hidden; /* Hide scrollbars */
        display: none;
        cursor: grab;
        /* No background or border here */
    }

    /* The inner div handles the visual style and content */
    #fmg-tracker-overlay-bg {
        width: 100%;
        height: 100%;
        /* Background color and opacity set by JS in onConfigsChanged */
        background-color: #1a1a1a;
        border: 1px solid #444;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        padding: 8px 10px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px; /* Use gap for spacing between trackers */
    }

    #fmg-tracker-overlay.dragging {
        cursor: grabbing;
    }
    #fmg-tracker-overlay-header {
        width: 100%;
        text-align: center;
        font-size: 10px;
        color: #999;
        user-select: none;
        padding-bottom: 3px;
        margin-bottom: 5px;
        border-bottom: 1px dashed #333;
    }

    /* UNIVERSAL STYLES FOR OVERLAY TRACKER ITEMS (INCLUDING PLAYER COUNT) */
    #fmg-tracker-overlay .fmg-tracker-display-wrapper {
        /* Override default top-bar settings for overlay */
        order: initial;
        margin: 0;
        width: 100%;
        text-align: center;
        padding: 0;
        box-sizing: border-box;
        line-height: 1.0;
        /* Reset font-size from top-bar */
        font-size: initial;
    }

    /* Primary Status/Location Line: Bolder and Scales */
    #fmg-tracker-overlay .fmg-tracker-display-wrapper > .fmg-location-span,
    #fmg-tracker-overlay .fmg-tracker-display-wrapper > .fmg-status-span,
    /* Player Count Alignment Fix: Target the primary span inside its new wrapper */
    #fmg-tracker-overlay #fmg-player-count-overlay-wrapper > .fmg-player-count-span {
        font-size: 1.8vmin; /* Scales with the smaller of the viewport height/width */
        font-weight: 800; /* Extra bold */
        line-height: 1.1;
        text-transform: uppercase;
        display: block;
        white-space: nowrap; /* Prevent wrapping for better scaling */
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* Secondary Timer/Timestamp Line: Regular size and Scales */
    #fmg-tracker-overlay .fmg-tracker-display-wrapper > .fmg-timestamp-span {
        font-size: 1.4vmin; /* Slightly smaller than status */
        font-weight: 600; /* Semi-bold for readability */
        opacity: 0.9;
        line-height: 1.1;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* Player Count Container - Now aligned with fmg-tracker-display-wrapper */
    /* We still need a unique wrapper for player count to treat it as a two-line block */
    #fmg-player-count-overlay-wrapper {
        width: 100%;
        text-align: center;
        display: flex;
        flex-direction: column; /* To align with tracker style */
        justify-content: center;
    }

    /* CSS Variable Defaults */
    :root {
        --fmgpb-transition-speed: 0.1s;
    }
    `;

    // ===================================
    // IV. CORE LOGIC HELPERS
    // ===================================

    /**
     * Determines if a tracker is currently active.
     * @param {string} id - The base ID of the tracker (e.g., 'fmg-storm').
     * @returns {boolean} True if the tracker is active, false otherwise.
     */
    function getTrackerStatus(id) {
        switch (id) {
            case 'fmg-storm':
                return stormData.status.toLowerCase() === 'active';
            case 'fmg-bondfire':
                return bondfireData.status.toLowerCase() === 'active';
            case 'fmg-tree':
                // Tree is active if location is NOT 'Unknown' AND NOT 'None'
                return treeData.location.toLowerCase() !== 'unknown' && treeData.location.toLowerCase() !== 'none';
            case 'fmg-meteor':
                // Meteor is active if location is NOT 'Unknown'
                return meteorData.location.toLowerCase() !== 'unknown';
            default:
                return false;
        }
    }


    // ===================================
    // V. PROGRESS BAR LOGIC
    // ===================================
    function updateProgressBar(currentTick, maxTick) {
        const barWrapper = document.getElementById('flatmmo-action-bar-wrapper');
        const barTextOverlay = document.getElementById('flatmmo-action-bar-text-overlay');
        const barFill = document.getElementById('flatmmo-action-bar-fill');
        const compactText = document.getElementById('flatmmo-compact-text-wrapper');

        if (!barWrapper || !barTextOverlay || !barFill || !compactText) {
            return;
        }

        const progressPercent = (currentTick / maxTick) * 100;

        let display_text = 'Idle';

        if (currentTick > 0 && currentTick <= maxTick) {
            display_text = `${currentTick} / ${maxTick} Ticks`;
        } else if (currentTick > maxTick && maxTick > 0) {
            display_text = 'Action Completed!';
            setTimeout(() => {
                barTextOverlay.textContent = 'Idle';
                compactText.textContent = 'Idle';
            }, 500);
        }

        barTextOverlay.textContent = display_text;
        compactText.textContent = display_text;

        const isCompact = barWrapper.style.display === 'none';

        if (!isCompact) {
            if (currentTick > 0 && currentTick <= maxTick && maxTick > 0) {
                barFill.style.width = `${progressPercent.toFixed(2)}%`;
            }
            else if (currentTick > maxTick && maxTick > 0) {
                barFill.style.width = '100%';
                setTimeout(() => {
                    barFill.style.width = '0%';
                }, 500);
            }
            else if (currentTick === 0 || maxTick === 0) {
                barFill.style.width = '0%';
            }
        } else {
            barFill.style.width = '0%';
        }
    }

    // ===================================
    // VI. TRACKER DISPLAY LOGIC (Individual)
    // ===================================

    function updateMeteorDisplay(plugin) {
        const topBarWrapper = document.getElementById('fmg-meteor-display-wrapper');
        const overlayWrapper = document.getElementById('fmg-meteor-overlay-wrapper');

        const enabled = plugin.getConfig('meteor_tracker_enabled');

        // Hide/Show for Top Bar
        if (topBarWrapper) topBarWrapper.style.display = enabled && !plugin.getConfig('overlay_enabled') ? 'flex' : 'none';

        // Hide/Show for Overlay (Wrapper's parent is the background div which handles the flex layout)
        if (overlayWrapper) overlayWrapper.parentElement.style.display = enabled && plugin.getConfig('overlay_enabled') ? 'flex' : 'none';

        if (enabled) {
            const wrappers = [topBarWrapper, overlayWrapper].filter(w => w);
            const colorKey = plugin.getConfig('meteor_text_color');
            const color = TEXT_COLORS[colorKey] || TEXT_COLORS['gold_theme'];
            let opacity = plugin.getConfig('meteor_opacity');

            const isInactive = getTrackerStatus('fmg-meteor') === false;
            const dimOpacityValue = plugin.getConfig('inactive_dim_opacity');

            if (overlayWrapper && isInactive) {
                opacity = dimOpacityValue;
            }

            const locationText = isInactive
                ? 'METEOR: UNKNOWN'
                : `METEOR: ${meteorData.location.toUpperCase()}`;

            const timestampText = meteorData.timestamp !== 'N/A'
                ? `Expires: ${meteorData.timestamp.replace(' UTC', '')}`
                : 'Expires: N/A';

            wrappers.forEach(displayWrapper => {
                displayWrapper.style.color = color.color;
                displayWrapper.style.opacity = opacity;
                displayWrapper.style.backgroundColor = 'transparent';

                const locationDisplay = displayWrapper.querySelector('#fmg-meteor-location, .fmg-location-span');
                const timestampDisplay = displayWrapper.querySelector('#fmg-meteor-timestamp, .fmg-timestamp-span');

                if (locationDisplay) locationDisplay.textContent = locationText;
                if (timestampDisplay) timestampDisplay.textContent = timestampText;
            });
        }
    }

    function updateEvilTreeDisplay(plugin) {
        const topBarWrapper = document.getElementById('fmg-tree-display-wrapper');
        const overlayWrapper = document.getElementById('fmg-tree-overlay-wrapper');

        const enabled = plugin.getConfig('tree_tracker_enabled');

        if (topBarWrapper) topBarWrapper.style.display = enabled && !plugin.getConfig('overlay_enabled') ? 'flex' : 'none';
        if (overlayWrapper) overlayWrapper.parentElement.style.display = enabled && plugin.getConfig('overlay_enabled') ? 'flex' : 'none';

        if (enabled) {
            const wrappers = [topBarWrapper, overlayWrapper].filter(w => w);
            const colorKey = plugin.getConfig('tree_text_color');
            const color = TEXT_COLORS[colorKey] || TEXT_COLORS['green_glow'];
            let opacity = plugin.getConfig('tree_opacity');

            const isInactive = getTrackerStatus('fmg-tree') === false;
            const dimOpacityValue = plugin.getConfig('inactive_dim_opacity');

            if (overlayWrapper && isInactive) {
                opacity = dimOpacityValue;
            }

            const locationText = isInactive
                ? 'TREE: NONE'
                : `TREE: ${treeData.location.toUpperCase()}`;

            const timestampText = treeData.timestamp !== 'N/A'
                ? `Expires: ${treeData.timestamp.replace(' UTC', '')}`
                : 'Expires: N/A';

            wrappers.forEach(displayWrapper => {
                displayWrapper.style.color = color.color;
                displayWrapper.style.opacity = opacity;
                displayWrapper.style.backgroundColor = 'transparent';

                const locationDisplay = displayWrapper.querySelector('#fmg-tree-location, .fmg-location-span');
                const timestampDisplay = displayWrapper.querySelector('#fmg-tree-timestamp, .fmg-timestamp-span');

                if (locationDisplay) locationDisplay.textContent = locationText;
                if (timestampDisplay) timestampDisplay.textContent = timestampText;
            });
        }
    }

    function updateStormDisplay(plugin) {
        const topBarWrapper = document.getElementById('fmg-storm-display-wrapper');
        const overlayWrapper = document.getElementById('fmg-storm-overlay-wrapper');
        if (!topBarWrapper && !overlayWrapper) return;

        const enabled = plugin.getConfig('storm_tracker_enabled');

        if (topBarWrapper) topBarWrapper.style.display = enabled && !plugin.getConfig('overlay_enabled') ? 'flex' : 'none';
        if (overlayWrapper) overlayWrapper.parentElement.style.display = enabled && plugin.getConfig('overlay_enabled') ? 'flex' : 'none';

        if (enabled) {
            const wrappers = [topBarWrapper, overlayWrapper].filter(w => w);
            const colorKey = plugin.getConfig('storm_text_color');
            const color = TEXT_COLORS[colorKey] || TEXT_COLORS['aqua'];
            let opacity = plugin.getConfig('storm_opacity');

            const isInactive = getTrackerStatus('fmg-storm') === false;
            const dimOpacityValue = plugin.getConfig('inactive_dim_opacity');

            if (overlayWrapper && isInactive) {
                opacity = dimOpacityValue;
            }

            const statusText = isInactive
                ? `STORM: INACTIVE`
                : `STORM: ACTIVE`;

            const timestampText = stormData.timestamp !== 'N/A'
                ? `Ends: ${stormData.timestamp.replace(' UTC', '')}`
                : 'Ends: N/A';

            wrappers.forEach(displayWrapper => {
                displayWrapper.style.color = color.color;
                displayWrapper.style.opacity = opacity;

                const statusDisplay = displayWrapper.querySelector('#fmg-storm-status, .fmg-status-span');
                const timestampDisplay = displayWrapper.querySelector('#fmg-storm-timestamp, .fmg-timestamp-span');

                if (statusDisplay) statusDisplay.textContent = statusText;
                if (timestampDisplay) timestampDisplay.textContent = timestampText;
            });
        }
    }

    // ===================================
    // VII. BONDFIRE TRACKER LOGIC (LIVE COUNTDOWN)
    // ===================================

    /**
     * Helper to format total seconds into HH:MM:SS string.
     * @param {number} totalSeconds
     * @returns {string} Formatted time string.
     */
    function formatTime(totalSeconds) {
        if (totalSeconds < 0) return '0:00:00';

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        // Return H:MM:SS format, only padding minutes and seconds
        const m = minutes.toString().padStart(2, '0');
        const s = seconds.toString().padStart(2, '0');

        return `${hours}:${m}:${s}`;
    }

    /**
     * Parses HH:MM:SS string to total seconds.
     * @param {string} timeString - e.g., "3:11:31"
     * @returns {number} Total seconds.
     */
    function timeStringToSeconds(timeString) {
        const parts = timeString.split(':').map(p => parseInt(p.trim(), 10));
        let seconds = 0;

        if (parts.length === 3) {
            seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            // Assume MM:SS if only two parts
            seconds = parts[0] * 60 + parts[1];
        } else if (parts.length === 1) {
            // Assume seconds if only one part
            seconds = parts[0];
        }
        return seconds;
    }

    /**
     * Starts the 1-second interval for the Bondfire timer.
     * @param {string} initialTimeString - HH:MM:SS time remaining.
     * @param {object} plugin - The plugin instance.
     */
    function startBondfireCountdown(initialTimeString, plugin) {
        // Clear any existing timer
        if (bondfireCountdownIntervalId) {
            clearInterval(bondfireCountdownIntervalId);
        }

        // Set initial state
        bondfireRemainingSeconds = timeStringToSeconds(initialTimeString);

        // Only start if time is actually remaining
        if (bondfireRemainingSeconds <= 0) {
            bondfireData.status = 'Inactive';
            bondfireData.timestamp = 'N/A';
            updateBondfireDisplay(plugin);
            return;
        }

        bondfireData.status = 'Active';
        // Set the initial formatted time before starting the loop
        bondfireData.timestamp = formatTime(bondfireRemainingSeconds);
        updateBondfireDisplay(plugin);

        // Start the countdown interval
        bondfireCountdownIntervalId = setInterval(() => {
            if (bondfireRemainingSeconds > 0) {
                bondfireRemainingSeconds--;
                // Update the state with the live ticking time
                bondfireData.timestamp = formatTime(bondfireRemainingSeconds);
                updateBondfireDisplay(plugin); // Update the display with the new time
            } else {
                // Countdown finished
                clearInterval(bondfireCountdownIntervalId);
                bondfireCountdownIntervalId = null;
                bondfireData.status = 'Inactive';
                bondfireData.timestamp = 'N/A';
                updateBondfireDisplay(plugin); // Final update to show inactive
            }
        }, 1000);
    }

    function updateBondfireDisplay(plugin) {
        const topBarWrapper = document.getElementById('fmg-bondfire-display-wrapper');
        const overlayWrapper = document.getElementById('fmg-bondfire-overlay-wrapper');
        if (!topBarWrapper && !overlayWrapper) return;

        const enabled = plugin.getConfig('bondfire_tracker_enabled');

        if (topBarWrapper) topBarWrapper.style.display = enabled && !plugin.getConfig('overlay_enabled') ? 'flex' : 'none';
        if (overlayWrapper) overlayWrapper.parentElement.style.display = enabled && plugin.getConfig('overlay_enabled') ? 'flex' : 'none';

        if (enabled) {
            const wrappers = [topBarWrapper, overlayWrapper].filter(w => w);
            const colorKey = plugin.getConfig('bondfire_text_color');
            const color = TEXT_COLORS[colorKey] || TEXT_COLORS['vibrant_pink'];
            let opacity = plugin.getConfig('bondfire_opacity');

            const isInactive = getTrackerStatus('fmg-bondfire') === false;
            const dimOpacityValue = plugin.getConfig('inactive_dim_opacity');

            if (overlayWrapper && isInactive) {
                opacity = dimOpacityValue;
            }

            const statusText = isInactive
                ? `BONDFIRE: INACTIVE`
                : `BONDFIRE: ACTIVE`;

            // Use the live-ticking timestamp from the state
            const timestampText = bondfireData.timestamp !== 'N/A'
                ? `Timer: ${bondfireData.timestamp}`
                : 'Timer: N/A';

            wrappers.forEach(displayWrapper => {
                displayWrapper.style.color = color.color;
                displayWrapper.style.opacity = opacity;

                const statusDisplay = displayWrapper.querySelector('#fmg-bondfire-status, .fmg-status-span');
                const timestampDisplay = displayWrapper.querySelector('#fmg-bondfire-timestamp, .fmg-timestamp-span');

                if (statusDisplay) statusDisplay.textContent = statusText;
                if (timestampDisplay) timestampDisplay.textContent = timestampText;
            });
        }
    }

    // ===================================
    // VIII. MASTER PARSING LOGIC (Custom Channel)
    // ===================================

    function parseCustomDounbotStatus(payload, plugin) {
        const DEBUG = plugin.getConfig('debug');

        // The data is contained within the payload of the custom message.
        const parts = payload.split(':');

        // Locate the start of the timer data
        const commandIndex = parts.indexOf('timers');
        const timerDataRaw = (commandIndex !== -1 && commandIndex + 1 < parts.length)
                             ? parts.slice(commandIndex + 1).join(':')
                             : payload; // Fallback to entire payload if structure is flat

        // The data is separated by the pipe character '|'
        const timerData = timerDataRaw.split('|').map(s => s.trim());

        if (timerData.length !== 4) {
            if (DEBUG) console.warn(`[Dounbot Debug] Custom payload split into ${timerData.length} parts (expected 4): "${payload}"`);
            return false;
        }

        const [treeRaw, stormRaw, meteorRaw, bondfireRaw] = timerData;

        if (DEBUG) console.log(`[Dounbot Debug] Custom Data: Tree='${treeRaw}', Storm='${stormRaw}', Meteor='${meteorRaw}', Bondfire='${bondfireRaw}'`);

        // Helper function to extract location and time from a string (UTC format)
        const extractEventData = (rawText, defaultLoc) => {
            const utcMatch = rawText.match(/\[(\d{2}:\d{2} UTC)\]/i);

            if (utcMatch) {
                // Found a UTC time, extract location before it
                const locationRaw = rawText.substring(0, utcMatch.index).trim();
                return {
                    location: locationRaw || defaultLoc,
                    timestamp: utcMatch[1].trim()
                };
            }
            return {
                location: defaultLoc,
                timestamp: 'N/A'
            };
        };


        // --- 1. Evil Tree Data ---
        const treeResult = extractEventData(treeRaw, 'None');
        treeData.location = treeResult.location.toLowerCase() === 'none' ? 'None' : treeResult.location;
        treeData.timestamp = treeResult.timestamp;

        // --- 2. Storm Data (FIXED STATUS LOGIC) ---
        const stormTimeMatch = stormRaw.match(/\[(\d{2}:\d{2} UTC)\]/i);

        // If a UTC time is present, the storm is ACTIVE, regardless of the text string
        if (stormTimeMatch) {
            stormData.status = 'Active';
            stormData.timestamp = stormTimeMatch[1].trim();
        } else {
            stormData.status = 'Inactive';
            stormData.timestamp = 'N/A';
        }

        // --- 3. Meteor Data ---
        const meteorResult = extractEventData(meteorRaw, 'Unknown');
        meteorData.location = meteorResult.location.toLowerCase() === 'unknown' ? 'Unknown' : meteorResult.location;
        meteorData.timestamp = meteorResult.timestamp;

        // --- 4. Bondfire Data (LIVE COUNTDOWN LOGIC) ---
        if (bondfireRaw.toLowerCase() === 'inactive') {
            bondfireData.status = 'Inactive';
            bondfireData.timestamp = 'N/A';
            if (bondfireCountdownIntervalId) {
                clearInterval(bondfireCountdownIntervalId);
                bondfireCountdownIntervalId = null;
            }
        } else {
            // Check if it's a duration (H:MM:SS or HH:MM:SS)
            const durationMatch = bondfireRaw.match(/(\d{1,2}:\d{2}:\d{2})/);
            if (durationMatch) {
                // START THE LIVE COUNTDOWN
                startBondfireCountdown(durationMatch[1], plugin);
            } else {
                // Fallback for unexpected active format without duration
                bondfireData.status = 'Active';
                bondfireData.timestamp = bondfireRaw;
            }
        }

        // Update all displays and trigger sort
        updateEvilTreeDisplay(plugin);
        updateMeteorDisplay(plugin);
        updateStormDisplay(plugin);
        updateBondfireDisplay(plugin);

        // Re-sort the overlay elements immediately after data refresh
        if (plugin.getConfig('overlay_enabled')) {
            plugin.sortTrackerOverlay();
        }

        return true;
    }


    // ===================================
    // IX. PLAYER COUNT LOGIC
    // ===================================
    function updatePlayersOnlineDisplay(plugin) {
        const topBarSpan = document.getElementById('fmg-player-count-span');
        const topBarWrapper = document.getElementById('fmg-player-count-wrapper');
        const overlaySpan = document.getElementById('fmg-player-count-overlay-span');
        const overlayWrapper = document.getElementById('fmg-player-count-overlay-wrapper');

        if (!topBarWrapper && !overlayWrapper) return;

        const enabled = plugin.getConfig('player_count_enabled');

        if (topBarWrapper) topBarWrapper.style.display = enabled && !plugin.getConfig('overlay_enabled') ? 'flex' : 'none';
        if (overlayWrapper) overlayWrapper.parentElement.style.display = enabled && plugin.getConfig('overlay_enabled') ? 'flex' : 'none';

        if (enabled) {
            const wrappers = [topBarWrapper, overlayWrapper].filter(w => w);
            const colorKey = plugin.getConfig('player_count_text_color');
            const color = TEXT_COLORS[colorKey] || TEXT_COLORS['white'];
            let opacity = plugin.getConfig('player_count_opacity');

            const isLowActivity = playersOnlineCount === '...' || parseInt(playersOnlineCount) < 100; // Define 'low' activity threshold for dimming
            const dimOpacityValue = plugin.getConfig('inactive_dim_opacity');

            // Conditional Dimming for Overlay Only
            if (overlayWrapper && isLowActivity) {
                opacity = dimOpacityValue;
            }

            // Format the count text the same way for both display locations
            const countText = `PLAYERS: ${playersOnlineCount}`;
            const countSubtitle = isLowActivity ? 'Low Activity' : 'Online';

            wrappers.forEach(displayWrapper => {
                displayWrapper.style.color = color.color;
                displayWrapper.style.opacity = opacity;

                // For the overlay, we use the primary and secondary spans
                const primarySpan = displayWrapper.querySelector('.fmg-player-count-span');
                const secondarySpan = displayWrapper.querySelector('.fmg-timestamp-span');

                if (primarySpan) primarySpan.textContent = countText;

                // Only overlay has the secondary span for subtitle
                if (overlayWrapper && secondarySpan) secondarySpan.textContent = countSubtitle;
            });

            // Set text content for top bar span (it's a single line display)
            if (topBarSpan) topBarSpan.textContent = countText;
        }
    }

    function parsePlayersOnlineMessage(data, plugin) {
        // 1. Parse from INNER_HTML_TAGS=players-online~[count]...
        if (data.startsWith(INNER_HTML_TAGS)) {
            const match = data.match(/^INNER_HTML_TAGS=players-online~([0-9]+)/);
            if (match) {
                playersOnlineCount = match[1];
                updatePlayersOnlineDisplay(plugin);
                return true;
            }
        }

        // 2. Parse from CHAT_LOCAL_MESSAGE for /who command (long list)
        if (data.startsWith(CHAT_LOCAL_MESSAGE)) {
            const parts = data.substring(CHAT_LOCAL_MESSAGE.length).split('~');
            const full_text = parts[1] || '';

            // Check if the message is a list of players (assuming > 50 names for /who)
            if (full_text.includes(',')) {
                const names = full_text.split(',').filter(name => name.trim().length > 0);
                if (names.length > 50) {
                    playersOnlineCount = names.length.toString();
                    updatePlayersOnlineDisplay(plugin);
                    return true;
                }
            }
        }

        return false;
    }

    // ===================================
    // X. PET HIDER LOGIC (V5 - Anti-Flicker Fix)
    // ===================================

    /**
     * Core logic: Toggles the visibility of all pet NPCs using the is_hidden property.
     * This is called on config change and periodically to catch newly spawned/re-rendered pets.
     *
     * @param {boolean} hide - True to hide, False to show.
     * @param {object} plugin - The plugin instance (for getConfig/debug).
     */
    function togglePetVisibility(hide, plugin) {
        // Check global game variable for NPCs
        if (typeof npcs === 'undefined') {
            if (plugin.getConfig('debug')) console.warn("FlatMMO Pet Hider: 'npcs' is undefined. Cannot apply setting.");
            return;
        }

        const allNpcs = npcs;
        const targetHiddenState = hide;
        let count = 0;
        let reHiddenCount = 0; // Track how many were actively re-hidden

        for (const uuid in allNpcs) {
            if (Object.hasOwnProperty.call(allNpcs, uuid)) {
                const npc = allNpcs[uuid];

                // --- PET IDENTIFICATION LOGIC ---
                let isPet = false;
                const npcName = (npc.name || '').toLowerCase();

                // 1. Check for Generic Pet
                if (npcName.includes('pet') || npcName === 'seagull_pet') {
                    isPet = true;
                }

                // 2. Handle the "Seagull" Exception (Only a pet if it has a pet_of owner)
                else if (npcName === 'seagull') {
                    // The game uses this property on seagulls when they are player pets
                    if (typeof npc.pet_of === 'string' && npc.pet_of.length > 0) {
                        isPet = true;
                    } else {
                        isPet = false;
                    }
                }


                if (isPet) {
                    // --- ANTI-FLICKER FIX (V5) ---
                    // If we want to hide pets, but this pet is currently NOT hidden, force the state.
                    if (hide && npc.is_hidden !== true) {
                        npc.is_hidden = true;
                        reHiddenCount++; // Track the active fix
                    } else if (!hide && npc.is_hidden !== false) {
                        npc.is_hidden = false;
                        reHiddenCount++;
                    }

                    // Set the property the game uses to skip drawing
                    npc.is_hidden = targetHiddenState;

                    // Secondary (Opacity) fix for immediate redraw (if supported)
                    if (typeof npc.set_opacity === 'function') {
                        const targetOpacity = hide ? 0.0 : 1.0;
                        npc.set_opacity(targetOpacity);
                    }
                    count++;
                }
            }
        }

        // Update the script's internal state
        isPetsHidden = hide;

        if (plugin.getConfig('debug')) {
            if (hide && reHiddenCount > 0) {
                 console.log(`[${plugin.id}] Pet Hider: Fixed **${reHiddenCount}** flickering/re-spawned pets. Total **${count}** pets processed.`);
            } else {
                 console.log(`[${plugin.id}] Pet NPCs set to ${hide ? 'HIDDEN' : 'VISIBLE'} (is_hidden=${targetHiddenState}). Total **${count}** processed.`);
            }
        }
    }

    // =================================================================
    // XI. WORSHIP HOTKEYS INTEGRATION
    // =================================================================

    // --- Core Delay Fix ---
    const SAFE_ACTION_DELAY_MS = 100; // Delay between the tile click and the command send

    // --- COOLDOWN DURATION ---
    const COMMAND_COOLDOWN_MS = 1000; // 1 second cooldown after command execution

    // --- LOGGING COLORS ---
    const SUCCESS_LOG_COLOR = '#ffa412'; // Bright Orange for successful commands
    const COOLDOWN_LOG_COLOR = '#e74c3c'; // Bright Red for cooldown warnings

    // --- Worship Commands (Keys 1 through 6) ---
    const WORSHIP_COMMANDS = [
    { key: '1', command: 'USE_WORSHIP=dig', action: 'Worship: Dig' },
    { key: '2', command: 'USE_WORSHIP=teleport_everbrook', action: 'Teleport: Everbrook' },
    { key: '3', command: 'USE_WORSHIP=teleport_mysticvale', action: 'Teleport: Mysticvale' },
    { key: '4', command: 'USE_WORSHIP=teleport_omboko', action: 'Teleport: Omboko' },
    { key: '6', command: 'USE_WORSHIP=teleport_jafa_outpost', action: 'Teleport: Jafa Outpost' },
    { key: '5', command: 'USE_WORSHIP=teleport_dock_haven', action: 'Teleport: Dock Haven' }
    ];

    // Internal state tracking for numeric keys
    let is1Held = false;
    let is2Held = false;
    let is3Held = false;
    let is4Held = false;
    let is5Held = false;
    let isOnCooldown = false;
    let isPatched = false;
    let original_send_unrepeatable_bytes = null;

    /**
     * Sends the command to the server after a slight delay for safety.
     */
    function safeSend(commandToSend, actionName, tileValue) {
        if (!original_send_unrepeatable_bytes) {
            console.error('[Worship Mod] safeSend called before original function was patched.');
            return;
        }

        // --- COOLDOWN CHECK ---
        if (isOnCooldown) {
            console.log(`%c[Worship Mod] Cooldown active. Cannot execute: ${actionName}`, `color: ${COOLDOWN_LOG_COLOR}; font-weight: bold;`);
            return;
        }

        // 1. Set cooldown
        isOnCooldown = true;
        setTimeout(() => {
            isOnCooldown = false;
            console.log('%c[Worship Mod] Cooldown finished. Ready for next command.', 'color: #7f8c8d;');
        }, COMMAND_COOLDOWN_MS); // Reset after 1 second

        console.log(`%c[Worship Mod] Triggered: ${actionName}`, `color: ${SUCCESS_LOG_COLOR}; font-weight: bold;`);

        // 2. Send the initial tile click first (mimics legitimate interaction)
        original_send_unrepeatable_bytes.call(window, tileValue);

        // 3. Send the actual command after a slight delay
        setTimeout(function() {
            original_send_unrepeatable_bytes.call(window, commandToSend);
            console.log(`%c[Worship Mod] Command Sent: ${commandToSend}`, `color: ${SUCCESS_LOG_COLOR};`);
        }, SAFE_ACTION_DELAY_MS);
    }

    function getKeyHeldStatus(key) {
        switch(key) {
            case '1': return is1Held;
            case '2': return is2Held;
            case '3': return is3Held;
            case '4': return is4Held;
            case '5': return is5Held;
            default: return false;
        }
    }

    // --- KEY DOWN LISTENER (Sets the flags) ---
    document.addEventListener('keydown', function(event) {
        // Only track key presses if hotkeys are globally active
        if (!areHotkeysActive) return;

        const key = event.key;
        const activeElement = document.activeElement;
        const isTypingActive = (
            activeElement && (
                activeElement.tagName.toLowerCase() === 'input' ||
                activeElement.tagName.toLowerCase() === 'textarea' ||
                activeElement.id === 'chat' ||
                activeElement.classList.contains('chat-text')
            )
        );

        if (!isTypingActive) {
            if (key === '1') { is1Held = true; }
            else if (key === '2') { is2Held = true; }
            else if (key === '3') { is3Held = true; }
            else if (key === '4') { is4Held = true; }
            else if (key === '5') { is5Held = true; }
        }
    }, true);

// --- KEY UP LISTENER (RESETS FLAGS) ---
document.addEventListener('keyup', function(event) {
    // Always reset the flags when the key is released, regardless of hotkey state
    if (event.key === '1') { is1Held = false; }
    else if (event.key === '2') { is2Held = false; }
    else if (event.key === '3') { is3Held = false; }
    else if (event.key === '4') { is4Held = false; }
    else if (event.key === '5') { is5Held = false; }
}, true);

// --- PATCH SEND FUNCTION (Intercepts Map Click to send commands) ---
function patchSendFunction() {
    if (isPatched) return;

    if (typeof window.send_unrepeatable_bytes !== 'function') {
        setTimeout(patchSendFunction, 50);
        return;
    }

    original_send_unrepeatable_bytes = window.send_unrepeatable_bytes;

    window.send_unrepeatable_bytes = function(value) {

        // --- Intercepting CLICKED_TILE to apply hotkey actions (keys 1-5) ---
        if (value.startsWith('CLICKED_TILE=')) {

            // Check the global toggle state for hotkeys
            if (areHotkeysActive) {
                let commandToSend = null;
                let actionName = '';
                const tileValue = value;

                // Check which hotkey is currently held down
                for (const item of WORSHIP_COMMANDS) {
                    if (getKeyHeldStatus(item.key)) {
                        commandToSend = item.command;
                        actionName = item.action;
                        break; // Found the hotkey, stop looking
                    }
                }

                if (commandToSend) {
                    safeSend(commandToSend, actionName, tileValue);
                    return; // Prevent the default CLICKED_TILE action
                }
            }
        }

        // Fallback: execute the original function if no hotkey was used or hotkeys are disabled
        original_send_unrepeatable_bytes.call(this, value);
    };

    isPatched = true;
    console.log(`%c[FlatMMO Mod V13.2] Worship Hotkeys Patch ENABLED.`, 'color: #8A2BE2; font-weight: bold;');
}

// Start the patching loop for the hotkeys as soon as the script is loaded
patchSendFunction();

// ===================================
// XII. PLUGIN CLASS DEFINITION
// ===================================
class ActionProgressBarPlugin extends FlatMMOPlusPlugin {
    constructor() {
        const opts = {
            about: {
                name: "FlatMMO Progress Bar",
                version: "QoLpacked - Current", // Updated version
                description: "QoL-Trackers-More",
                author: "use my loot"
            },
            config: [
                // --- Progress Bar Configs ---
                { type: "separator", label: "Action Progress Bar Settings" },
                {
                    id: "compact_mode",
                    type: "boolean",
                    label: "Text only Progress Bar",
                    default: true,
                },
                {
                    id: "smooth_transition",
                    type: "boolean",
                    label: "Enable Smooth Transition",
                    default: true,
                },
                {
                    id: "bar_fill_theme",
                    type: "select",
                    label: "Bar Fill Theme",
                    default: "default",
                    options: Object.keys(THEMES).map(key => ({
                        value: key,
                        label: THEMES[key].name
                    }))
                },
                {
                    id: "text_color",
                    type: "select",
                    label: "Bar Text Color",
                    default: "white",
                    options: Object.keys(TEXT_COLORS).map(key => ({
                        value: key,
                        label: TEXT_COLORS[key].name
                    }))
                },
                {
                    id: "bar_bg_color",
                    type: "color",
                    label: "Bar Container Background Color",
                    default: "#1a1a1a"
                },

                // --- Worship Hotkey Settings (NEW SECTION) ---
                { type: "separator", label: "Worship Hotkeys" },
                {
                    id: "worship_hotkeys_enabled",
                    type: "boolean",
                    label: "Click+1,2,3,4,5 Hotkeys 2.5s Cooldown", // New Toggle
                    default: true,
                },
                {
                    id: "worship_info",
                    type: "separator", // Informational Text
                    label: "Click + 1,2,3,4,5 for Hotkey", // Simplified Label
                },

                // --- Visualizer Configs ---
                { type: "separator", label: "Visualizer Settings" },
                {
                    id: "visualizer_enabled",
                    type: "boolean",
                    label: "Enable Tile Highlights",
                    default: true,
                },
                {
                    id: "vis_toggle_loot",
                    type: "boolean",
                    label: "Toggle: Highlight Ground Loot",
                    default: true,
                },
                {
                    id: "vis_toggle_objects",
                    type: "boolean",
                    label: "Toggle: Highlight Map Objects",
                    default: true,
                },
                {
                    id: "vis_loot_opacity",
                    type: "number",
                    label: "Loot Highlight Opacity 0-1",
                    default: 0.45,
                    min: 0.1,
                    max: 1.0,
                    step: 0.05
                },
                {
                    id: "vis_object_opacity",
                    type: "number",
                    label: "Mapobject highlight Opacity 0-1",
                    default: 0.45,
                    min: 0.1,
                    max: 1.0,
                    step: 0.05
                },
                {
                    id: "vis_target_opacity",
                    type: "number",
                    label: "Digspot Highlight Opacity 0-1",
                    default: 0.55,
                    min: 0.1,
                    max: 1.0,
                    step: 0.05
                },
                {
                    id: "vis_loot_color",
                    type: "color",
                    label: "Loot Color (RGB)",
                    default: "#FFD700"
                },
                {
                    id: "vis_object_color",
                    type: "color",
                    label: "Mapobject Color (RGB)",
                    default: "#00BFFF"
                },
                {
                    id: "vis_target_color",
                    type: "color",
                    label: "Digspot Color (RGB)",
                    default: "#00FF00"
                },

                {
                    id: "vis_object_filter_mode",
                    type: "select",
                    label: "Map-Object Filter Mode",
                    default: "filtered",
                    options: [
                        { value: "all", label: "Highlight ALL Map Objects" },
                        { value: "filtered", label: "Highlight ONLY Selected Objects" },
                    ]
                },
                {
                    id: "vis_selected_objects",
                    type: "multi-select",
                    label: "Filtered Map Objects",
                    default: DIG_SPOT_NAMES,
                    options: OBJECT_NAMES.map(name => ({
                        value: name,
                        label: name.replace(/_/g, ' ').toUpperCase()
                    }))
                },

                // --- Tracker Configs ---
                { type: "separator", label: "Event Tracker Settings" },
                {
                    id: "overlay_enabled",
                    type: "boolean",
                    label: "Enable Tracker Overlay",
                    default: false,
                },
                {
                    id: "overlay_bg_opacity",
                    type: "number",
                    label: "Tracker Overlay Background Opacity 0-1",
                    default: 0.85,
                    min: 0.1,
                    max: 1.0,
                    step: 0.05
                },
                {
                    id: "inactive_dim_opacity",
                    type: "number",
                    label: "Inactive Tracker Text Dim Opacity 0-1",
                    default: 0.20,
                    min: 0.0,
                    max: 1.0,
                    step: 0.05
                },

                // --- Evil Tree Tracker Config ---
                {
                    id: "tree_tracker_enabled",
                    type: "boolean",
                    label: "Enable Evil Tree Display",
                    default: true,
                },
                {
                    id: "tree_text_color",
                    type: "select",
                    label: "Tree Display Text Color",
                    default: "green_glow",
                    options: Object.keys(TEXT_COLORS).map(key => ({
                        value: key,
                        label: TEXT_COLORS[key].name
                    }))
                },
                {
                    id: "tree_opacity",
                    type: "number",
                    label: "Tree Display Opacity 0-1",
                    default: 0.75,
                    min: 0.1,
                    max: 1.0,
                    step: 0.05
                },
                // --- Meteor Tracker Config ---
                {
                    id: "meteor_tracker_enabled",
                    type: "boolean",
                    label: "Enable Meteor Display",
                    default: true,
                },
                {
                    id: "meteor_text_color",
                    type: "select",
                    label: "Meteor Display Text Color",
                    default: "gold_theme",
                    options: Object.keys(TEXT_COLORS).map(key => ({
                        value: key,
                        label: TEXT_COLORS[key].name
                    }))
                },
                {
                    id: "meteor_opacity",
                    type: "number",
                    label: "Meteor Display Opacity 0-1",
                    default: 0.75,
                    min: 0.1,
                    max: 1.0,
                    step: 0.05
                },

                // --- Storm Tracker Config ---
                {
                    id: "storm_tracker_enabled",
                    type: "boolean",
                    label: "Enable Storm Display",
                    default: true,
                },
                {
                    id: "storm_text_color",
                    type: "select",
                    label: "Storm Display Text Color",
                    default: "aqua",
                    options: Object.keys(TEXT_COLORS).map(key => ({ value: key, label: TEXT_COLORS[key].name }))
                },
                {
                    id: "storm_opacity",
                    type: "number",
                    label: "Storm Display Opacity 0-1",
                    default: 0.75,
                    min: 0.1,
                    max: 1.0,
                    step: 0.05
                },

                // --- Bondfire Tracker Config ---
                {
                    id: "bondfire_tracker_enabled",
                    type: "boolean",
                    label: "Enable Bondfire Display",
                    default: true,
                },
                {
                    id: "bondfire_text_color",
                    type: "select",
                    label: "Bondfire Display Text Color",
                    default: "vibrant_pink",
                    options: Object.keys(TEXT_COLORS).map(key => ({ value: key, label: TEXT_COLORS[key].name }))
                },
                {
                    id: "bondfire_opacity",
                    type: "number",
                    label: "Bondfire Display Opacity 0-1",
                    default: 0.75,
                    min: 0.1,
                    max: 1.0,
                    step: 0.05
                },

                // --- Player Count Config ---
                {
                    id: "player_count_enabled",
                    type: "boolean",
                    label: "Enable Players Online Count",
                    default: true,
                },
                {
                    id: "player_count_text_color",
                    type: "select",
                    label: "Player Count Text Color",
                    default: "white",
                    options: Object.keys(TEXT_COLORS).map(key => ({
                        value: key,
                        label: TEXT_COLORS[key].name
                    }))
                },
                {
                    id: "player_count_opacity",
                    type: "number",
                    label: "Player Count Opacity 0-1",
                    default: 0.75,
                    min: 0.1,
                    max: 1.0,
                    step: 0.05
                },

                // --- Pet Hider Config ---
                { type: "separator", label: "Pet Hider Settings" },
                {
                    id: "hide_pets_enabled",
                    type: "boolean",
                    label: "Hide All Pets (Visual)",
                    default: true,
                },

                {
                    id: "debug",
                    type: "boolean",
                    label: "debug logs- not needed",
                    default: false
                }
            ]
        };
        super(PLUGIN_ID, opts);

        // Bind functions that will be used as listeners or callbacks to 'this'
        this.updateMeteorDisplayBound = updateMeteorDisplay.bind(null, this);
        this.updateEvilTreeDisplayBound = updateEvilTreeDisplay.bind(null, this);
        this.updatePlayersOnlineDisplayBound = updatePlayersOnlineDisplay.bind(null, this);
        this.updateStormDisplayBound = updateStormDisplay.bind(null, this);
        this.updateBondfireDisplayBound = updateBondfireDisplay.bind(null, this);

        // Bind core visualizer functions (which rely on 'this')
        this.renderOverlayBound = this.renderOverlay.bind(this);
        this.startOverlayLoopBound = this.startOverlayLoop.bind(this);

        if (!document.getElementById(PLUGIN_ID + '-styles')) {
            const style = document.createElement('style');
            style.id = PLUGIN_ID + '-styles';
            style.textContent = CSS_STYLES;
            document.head.appendChild(style);
        }
    }

    onLogin() {
        // NEW: Request initial timer data
        this.sendCustom("dounbot", "timers");
        // Set up a refresh interval (e.g., every 5 minutes = 300000ms)
        this.dounbotIntervalId = setInterval(() => {
            this.sendCustom("dounbot", "timers");
        }, 300000);

        this.injectProgressBarHTML();
        this.injectMeteorTrackerHTML();
        this.injectEvilTreeTrackerHTML();
        this.injectBondfireTrackerHTML();
        this.injectStormTrackerHTML();
        // Player count top-bar injection is now done in a separate function
        this.injectPlayersOnlineHTML();

        // NEW: Inject floating tracker UI
        this.injectTrackerOverlayHTML();
        this.attachOverlayListeners();

        this.onConfigsChanged();

        // Initial sort after all elements are injected
        this.sortTrackerOverlay();

        // Pet Hider Loop Initialization
        this.startPetHiderLoop();

        // Visualizer Initialization
        if (this.getConfig('visualizer_enabled')) {
            this.attachVisibilityListener();
            if (this.createOverlayCanvas()) {
                // Start the loop after canvas creation
                this.startOverlayLoopBound();
            } else if (this.getConfig('debug')) {
                console.error(`[${this.id}] Failed to create visualizer canvas.`);
            }
        }
    }

    onLogout() {
        // Clear Dounbot refresh interval
        if (this.dounbotIntervalId) {
            clearInterval(this.dounbotIntervalId);
            this.dounbotIntervalId = null;
        }
        // Clear Bondfire countdown timer
        if (bondfireCountdownIntervalId) {
            clearInterval(bondfireCountdownIntervalId);
            bondfireCountdownIntervalId = null;
        }
        // Clear Pet Hider loop
        if (this.petHiderIntervalId) {
            clearInterval(this.petHiderIntervalId);
            this.petHiderIntervalId = null;
        }
        // Clear Visualizer loop
        if (this.overlayLoopId) {
            cancelAnimationFrame(this.overlayLoopId);
            this.overlayLoopId = null;
        }
    }

    onCustomReceived(sender, plugin, command, payload) {
        if (this.getConfig('debug')) console.log(`[${this.id}] Custom Received: Sender=${sender}, Command=${command}, Payload=${payload}`);

        // Note: plugin === this (the current plugin instance)
        if (sender.toLowerCase() === 'dounbot' && command.toLowerCase() === 'timers') {
            parseCustomDounbotStatus(payload, this);
        }
    }

    onMessageReceived(data) {
        if (this.getConfig('debug')) console.log(`[${this.id}] Raw Message Received (Plugin Channel): ${data}`);

        // Progress Bar Update
        if (typeof data === 'string' && data.startsWith(PROGRESS_BAR_TAG)) {
            const match = data.match(/^PROGRESS_BAR=(\d+)~(\d+)/);
            if (match) {
                const currentTick = parseInt(match[1], 10);
                const maxTick = parseInt(match[2], 10);
                updateProgressBar(currentTick, maxTick);
            }
        }

        // Player Count Update (Still uses the old channel for player count)
        if (typeof data === 'string') {
            parsePlayersOnlineMessage(data, this);
        }

        // Visualizer Update (Loot/Object change triggers redraw)
        if (this.getConfig('visualizer_enabled') && typeof data === 'string' && data.startsWith(GROUND_ITEM_TAG)) {
            this.scheduleOverlay();
        }
    }

    onConfigsChanged() {
        // --- Worship Hotkey Toggle Update---
        areHotkeysActive = this.getConfig('worship_hotkeys_enabled');
        if (this.getConfig('debug')) {
            console.log(`[${this.id}] Worship Hotkeys Active: ${areHotkeysActive}`);
        }

        // --- Progress Bar Configs ---
        const barWrapper = document.getElementById('flatmmo-action-bar-wrapper');
        const barFill = document.getElementById('flatmmo-action-bar-fill');
        const compactText = document.getElementById('flatmmo-compact-text-wrapper');
        const barContainer = document.getElementById('flatmmo-action-bar-container');

        if (barWrapper && barFill && compactText && barContainer) {
            const isCompact = this.getConfig('compact_mode');
            barWrapper.style.display = isCompact ? 'none' : 'block';
            compactText.style.display = isCompact ? 'block' : 'none';

            const theme = THEMES[this.getConfig('bar_fill_theme')] || THEMES['default'];
            barFill.style.background = theme.gradient;
            barContainer.style.backgroundColor = this.getConfig('bar_bg_color');

            const colorKey = this.getConfig('text_color');
            const color = TEXT_COLORS[colorKey] || TEXT_COLORS['white'];
            let shadowValue = '0 0 3px #000';
            if (colorKey === 'light_gray' || colorKey.endsWith('_text')) {
                shadowValue = '0 0 3px rgba(0, 0, 0, 0.8)';
            }

            document.documentElement.style.setProperty('--fmgpb-text-color', color.color);
            document.documentElement.style.setProperty('--fmgpb-text-shadow', shadowValue);
            compactText.style.color = color.color;
            compactText.style.textShadow = shadowValue;

            const speed = this.getConfig('smooth_transition') ? '0.1s' : '0s';
            document.documentElement.style.setProperty('--fmgpb-transition-speed', speed);
        }

        // --- Tracker Configs ---
        const overlayDiv = document.getElementById('fmg-tracker-overlay');
        const overlayBgDiv = document.getElementById('fmg-tracker-overlay-bg'); // NEW
        const overlayEnabled = this.getConfig('overlay_enabled');

        // Apply overlay background opacity directly to the inner background div
        if (overlayBgDiv) {
            const opacity = this.getConfig('overlay_bg_opacity');
            // Hardcoded dark background color (from original CSS) + user's opacity
            overlayBgDiv.style.backgroundColor = `rgba(26, 26, 26, ${opacity})`;
        }

        // Show/hide the overlay container (the main wrapper)
        if (overlayDiv) {
            overlayDiv.style.display = overlayEnabled ? 'block' : 'none';
        }

        // Update all trackers (they now handle showing/hiding themselves based on 'overlay_enabled')
        this.updateMeteorDisplayBound();
        this.updateEvilTreeDisplayBound();
        this.updateStormDisplayBound();
        this.updateBondfireDisplayBound();
        this.updatePlayersOnlineDisplayBound();

        // Re-sort if the overlay is enabled, as opacity/visibility changes might warrant a sort
        if (overlayEnabled) {
             this.sortTrackerOverlay();
        }

        // --- Pet Hider Configs ---
        const hidePets = this.getConfig('hide_pets_enabled');
        togglePetVisibility(hidePets, this); // Apply the setting instantly

        // --- Visualizer Configs ---
        // If the visualizer is enabled/disabled, recreate the canvas if needed, or just redraw.
        if (this.getConfig('visualizer_enabled') && !overlayCanvas) {
            this.attachVisibilityListener();
            if (this.createOverlayCanvas()) {
                this.startOverlayLoopBound();
            } else if (this.getConfig('debug')) {
                console.error(`[${this.id}] Failed to create visualizer canvas.`);
            }
        } else if (!this.getConfig('visualizer_enabled') && overlayCanvas) {
            overlayCanvas.remove();
            overlayCanvas = null;
            ctx = null;
        }

        // Always schedule a redraw when config changes to update colors/opacities instantly
        this.scheduleOverlay();
    }

    // ===================================
    // XIII. HTML INJECTION AND SORTING
    // ===================================

    // --- Progress Bar HTML Injection ---
    injectProgressBarHTML() {
        const inventoryPanel = document.getElementById('ui-panel-inventory');
        const titleElement = document.querySelector('#ui-panel-inventory .ui-panel-title');

        if (inventoryPanel && titleElement) {
            if (!document.getElementById('flatmmo-compact-text-wrapper')) {
                const compactText = document.createElement('div');
                compactText.id = 'flatmmo-compact-text-wrapper';
                compactText.textContent = 'Idle';
                inventoryPanel.insertBefore(compactText, inventoryPanel.firstChild);
            }
            if (!document.getElementById('flatmmo-action-bar-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.id = 'flatmmo-action-bar-wrapper';
                const barContainer = document.createElement('div');
                barContainer.id = 'flatmmo-action-bar-container';
                const barFill = document.createElement('div');
                barFill.id = 'flatmmo-action-bar-fill';
                barContainer.appendChild(barFill);
                const barTextOverlay = document.createElement('div');
                barTextOverlay.id = 'flatmmo-action-bar-text-overlay';
                barTextOverlay.textContent = 'Idle';
                barContainer.appendChild(barTextOverlay);
                wrapper.appendChild(barContainer);
                titleElement.after(wrapper);
            }
        }
    }

    /**
     * Helper to create a unified tracker wrapper for the floating overlay.
     * @param {string} id - The base ID (e.g., 'fmg-meteor').
     * @param {string} type - 'location' or 'status' for the primary span class.
     * @returns {HTMLElement} The wrapper element.
     */
    _createOverlayTrackerElement(id, type) {
        // Create the container element (which acts as a block in the flex column)
        const container = document.createElement('div');
        container.id = `${id}-overlay-container`;
        container.style.display = 'flex'; // This container is always 'flex' or 'none'
        container.style.width = '100%';

        // Create the inner content wrapper
        const wrapper = document.createElement('div');
        wrapper.id = `${id}-overlay-wrapper`;
        wrapper.className = 'fmg-tracker-display-wrapper';

        const primarySpan = document.createElement('span');
        primarySpan.className = type === 'location' ? 'fmg-location-span' : 'fmg-status-span';

        const timestampSpan = document.createElement('span');
        timestampSpan.className = 'fmg-timestamp-span';

        wrapper.appendChild(primarySpan);
        wrapper.appendChild(timestampSpan);
        container.appendChild(wrapper);

        return container;
    }

    // --- Floating Tracker Overlay HTML Injection ---
    injectTrackerOverlayHTML() {
        const gameContainer = document.querySelector('body');
        if (!gameContainer || document.getElementById('fmg-tracker-overlay')) return;

        // 1. Outer Wrapper (Positioning/Drag/Resize)
        const overlayDiv = document.createElement('div');
        overlayDiv.id = 'fmg-tracker-overlay';

        // Apply saved position
        overlayDiv.style.top = `${overlayConfig.top}px`;
        overlayDiv.style.left = `${overlayConfig.left}px`;
        if (overlayConfig.width) overlayDiv.style.width = `${overlayConfig.width}px`;
        if (overlayConfig.height) overlayDiv.style.height = `${overlayConfig.height}px`;

        // 2. Inner Background/Content Div (Handles Background and Padding)
        const overlayBgDiv = document.createElement('div');
        overlayBgDiv.id = 'fmg-tracker-overlay-bg';

        const header = document.createElement('div');
        header.id = 'fmg-tracker-overlay-header';
        header.textContent = 'DRAG TO MOVE / RESIZE CORNER';
        overlayBgDiv.appendChild(header);

        // Player Count Container (ALWAYS first)
        const playerCountContainer = this._createOverlayTrackerElement('fmg-player-count', 'status');
        playerCountContainer.id = 'fmg-player-count-overlay-container'; // Set unique ID for container
        const primarySpan = playerCountContainer.querySelector('.fmg-status-span');
        primarySpan.id = 'fmg-player-count-overlay-span';
        primarySpan.classList.add('fmg-player-count-span');
        const wrapper = playerCountContainer.querySelector('.fmg-tracker-display-wrapper');
        wrapper.id = 'fmg-player-count-overlay-wrapper';
        overlayBgDiv.appendChild(playerCountContainer);

        // Tracker elements (will be sorted later)
        const bondfire = this._createOverlayTrackerElement('fmg-bondfire', 'status');
        const storm = this._createOverlayTrackerElement('fmg-storm', 'status');
        const tree = this._createOverlayTrackerElement('fmg-tree', 'location');
        const meteor = this._createOverlayTrackerElement('fmg-meteor', 'location');

        // Store all event trackers for sorting
        this.trackerContainers = {
            'fmg-bondfire': bondfire,
            'fmg-storm': storm,
            'fmg-tree': tree,
            'fmg-meteor': meteor
        };

        // Append all event trackers initially (the sort function will rearrange them)
        Object.values(this.trackerContainers).forEach(container => {
            overlayBgDiv.appendChild(container);
        });

        // Append inner to outer
        overlayDiv.appendChild(overlayBgDiv);

        // Append outer to body
        gameContainer.appendChild(overlayDiv);
    }

    /**
     * Sorts the tracker elements in the overlay: Active trackers first, then Inactive.
     * The Player Count element remains at the top.
     */
    sortTrackerOverlay() {
        const overlayBgDiv = document.getElementById('fmg-tracker-overlay-bg');
        if (!overlayBgDiv || !this.trackerContainers) return;

        const trackerElements = Object.entries(this.trackerContainers);

        // Sort the trackers: Active (true) comes before Inactive (false)
        trackerElements.sort(([idA], [idB]) => {
            const isActiveA = getTrackerStatus(idA);
            const isActiveB = getTrackerStatus(idB);

            // If A is active and B is inactive, A comes first (-1)
            if (isActiveA && !isActiveB) return -1;
            // If A is inactive and B is active, B comes first (1)
            if (!isActiveA && isActiveB) return 1;
            // If both are same status, maintain existing order (0)
            return 0;
        });

        // Re-append the sorted trackers to the container
        trackerElements.forEach(([, container]) => {
            overlayBgDiv.appendChild(container);
        });

        if (this.getConfig('debug')) console.log('[Tracker Overlay] Trackers sorted successfully.');
    }

    // --- Drag/Drop and Resize Listeners ---
    attachOverlayListeners() {
        const overlayDiv = document.getElementById('fmg-tracker-overlay');
        const header = document.getElementById('fmg-tracker-overlay-header');
        if (!overlayDiv || !header) return;

        const saveConfig = () => {
            overlayConfig.top = overlayDiv.offsetTop;
            overlayConfig.left = overlayDiv.offsetLeft;
            // Also save dimensions for persistence across sessions
            overlayConfig.width = overlayDiv.offsetWidth;
            overlayConfig.height = overlayDiv.offsetHeight;
            localStorage.setItem('fmg-overlay-config', JSON.stringify(overlayConfig));
        };

        const onMouseMove = (e) => {
            if (isDragging) {
                overlayDiv.style.left = `${e.clientX - dragOffsetX}px`;
                overlayDiv.style.top = `${e.clientY - dragOffsetY}px`;
            }
        };

        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                overlayDiv.classList.remove('dragging');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                saveConfig();
            }
        };

        header.addEventListener('mousedown', (e) => {
            // Check if the click is on the drag handle, not the border for resizing
            // e.button === 0 is left mouse button
            if (e.target === header && e.button === 0) {
                isDragging = true;
                overlayDiv.classList.add('dragging');
                dragOffsetX = e.clientX - overlayDiv.offsetLeft;
                dragOffsetY = e.clientY - overlayDiv.offsetTop;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            }
        });

        // Listen for resize stop (mouseup after resizing the border)
        overlayDiv.addEventListener('mouseup', saveConfig);

        // Handle initial position update if the window resizes
        window.addEventListener('resize', saveConfig);
    }

    // --- Evil Tree Tracker HTML Injection (Top Bar) ---
    injectEvilTreeTrackerHTML() {
        const topBarDiv = document.querySelector('div.top-bar');

        if (topBarDiv && !document.getElementById('fmg-tree-display-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.id = 'fmg-tree-display-wrapper';
            wrapper.className = 'top-bar-entry top-bar-entry-right fmg-tracker-display-wrapper';

            const locationSpan = document.createElement('span');
            locationSpan.id = 'fmg-tree-location';

            const timestampSpan = document.createElement('span');
            timestampSpan.id = 'fmg-tree-timestamp';

            wrapper.appendChild(locationSpan);
            wrapper.appendChild(timestampSpan);

            // Append to the end of the top bar. The CSS order property will handle positioning.
            topBarDiv.appendChild(wrapper);

            this.updateEvilTreeDisplayBound();
        }
    }

    // --- Meteor Tracker HTML Injection (Top Bar) ---
    injectMeteorTrackerHTML() {
        const topBarDiv = document.querySelector('div.top-bar');

        if (topBarDiv && !document.getElementById('fmg-meteor-display-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.id = 'fmg-meteor-display-wrapper';
            wrapper.className = 'top-bar-entry top-bar-entry-right fmg-tracker-display-wrapper';

            const locationSpan = document.createElement('span');
            locationSpan.id = 'fmg-meteor-location';

            const timestampSpan = document.createElement('span');
            timestampSpan.id = 'fmg-meteor-timestamp';

            wrapper.appendChild(locationSpan);
            wrapper.appendChild(timestampSpan);

            // Append to the end of the top bar. The CSS order property will handle positioning.
            topBarDiv.appendChild(wrapper);

            this.updateMeteorDisplayBound();
        }
    }

    // --- Storm Tracker HTML Injection (Top Bar) ---
    injectStormTrackerHTML() {
        const topBarDiv = document.querySelector('div.top-bar');
        if (topBarDiv && !document.getElementById('fmg-storm-display-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.id = 'fmg-storm-display-wrapper';
            wrapper.className = 'top-bar-entry top-bar-entry-right fmg-tracker-display-wrapper';

            const statusSpan = document.createElement('span');
            statusSpan.id = 'fmg-storm-status';

            const timestampSpan = document.createElement('span');
            timestampSpan.id = 'fmg-storm-timestamp';

            wrapper.appendChild(statusSpan);
            wrapper.appendChild(timestampSpan);

            topBarDiv.appendChild(wrapper);
            this.updateStormDisplayBound();
        }
    }

    // --- Bondfire Tracker HTML Injection (Top Bar) ---
    injectBondfireTrackerHTML() {
        const topBarDiv = document.querySelector('div.top-bar');
        if (topBarDiv && !document.getElementById('fmg-bondfire-display-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.id = 'fmg-bondfire-display-wrapper';
            wrapper.className = 'top-bar-entry top-bar-entry-right fmg-tracker-display-wrapper';

            const statusSpan = document.createElement('span');
            statusSpan.id = 'fmg-bondfire-status';

            const timestampSpan = document.createElement('span');
            timestampSpan.id = 'fmg-bondfire-timestamp';

            wrapper.appendChild(statusSpan);
            wrapper.appendChild(timestampSpan);

            topBarDiv.appendChild(wrapper);
            this.updateBondfireDisplayBound();
        }
    }

    // --- Player Count HTML Injection (Top Bar) ---
    injectPlayersOnlineHTML() {
        const topBarDiv = document.querySelector('div.top-bar');

        if (topBarDiv && !document.getElementById('fmg-player-count-wrapper')) {

            const wrapper = document.createElement('div');
            wrapper.id = 'fmg-player-count-wrapper';
            wrapper.className = 'top-bar-entry top-bar-entry-right';

            const playerCountSpan = document.createElement('span');
            playerCountSpan.id = 'fmg-player-count-span';
            playerCountSpan.textContent = `Players: ${playersOnlineCount}`;
            wrapper.appendChild(playerCountSpan);

            topBarDiv.appendChild(wrapper);

            this.updatePlayersOnlineDisplayBound();
        }
    }

    // --- Pet Hider Loop ---
    startPetHiderLoop() {
        if (this.petHiderIntervalId) clearInterval(this.petHiderIntervalId);
        // Check every 2 seconds to hide newly spawned pets if the feature is enabled
        this.petHiderIntervalId = setInterval(() => {
            if (isPetsHidden) {
                // IMPORTANT: Call with 'true' to ensure newly spawned pets are hidden instantly.
                togglePetVisibility(true, this);
            }
        }, 2000);
    }

    // ===================================
    // XIV. VISUALIZER METHODS
    // ===================================

    tileToCanvasPixels(tileX, tileY) {
        // Math.floor is often safer for pixel drawing origins.
        return {
            x: Math.floor(tileX * TILE_SIZE + gameCanvasOffset.x),
            y: Math.floor(tileY * TILE_SIZE + gameCanvasOffset.y)
        };
    }

    drawRect(x, y, w, h, fill, strokeRGB, strokeWidth = 2, radius = 4) {
        if (!ctx) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (fill) {
            ctx.fillStyle = fill;
            ctx.fill();
        }
        if (strokeRGB) {
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = `rgb(${strokeRGB})`;
            ctx.stroke();
        }
        ctx.restore();
    }

    // --- FIX APPLIED HERE for metrics and game bounds ---
    updateCanvasMetrics() {
        if (!overlayCanvas) return false;

        const gameCanvas = document.getElementById('canvas') || document.querySelector('canvas');
        if (!gameCanvas) return false;

        // Attempt to get TILE_SIZE from game globals (essential for positioning)
        if (typeof window.TILE_SIZE !== 'undefined') {
            TILE_SIZE = window.TILE_SIZE;
        } else if (typeof window.TILE_SIZE_GLOBAL !== 'undefined') {
            TILE_SIZE = window.TILE_SIZE_GLOBAL;
        }

        const rect = gameCanvas.getBoundingClientRect();

        // Use Math.floor to ensure pixel alignment, which can help prevent white lines due to sub-pixel rendering.
        gameCanvasOffset.x = Math.floor(rect.left);
        gameCanvasOffset.y = Math.floor(rect.top);

        // Also store the game canvas dimensions to use for clipping later
        gameCanvasOffset.width = Math.floor(rect.width);
        gameCanvasOffset.height = Math.floor(rect.height);

        // The overlay canvas must cover the full viewport (window.innerWidth/Height)
        overlayCanvas.width = window.innerWidth;
        overlayCanvas.height = window.innerHeight;

        return true;
    }

    createOverlayCanvas() {
        if (overlayCanvas) return true;

        const gameContainer = document.querySelector('body');
        if (!gameContainer) return false;

        overlayCanvas = document.createElement('canvas');
        overlayCanvas.id = 'fmg-overlay-canvas';
        // FIX: Added aggressive margin/padding/border removal to prevent browser defaults
        overlayCanvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 50;
            background-color: transparent;
            margin: 0;
            padding: 0;
            border: none;
        `;

        ctx = overlayCanvas.getContext('2d');
        gameContainer.appendChild(overlayCanvas);

        // Add listener for window resizing
        window.addEventListener('resize', () => {
            this.updateCanvasMetrics();
            this.scheduleOverlay();
        });

        return this.updateCanvasMetrics();
    }

    renderOverlay() {
        if (!gameIsFocused || !overlayCanvas || !ctx || !this.getConfig('visualizer_enabled')) {
            overlayRequested = false;
            return;
        }

        overlayRequested = false;

        this.updateCanvasMetrics();

        // Clear the entire overlay canvas
        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        ctx.save();

        // --- CRITICAL FIX: Clip the drawing area to the game canvas bounds ---
        // This ensures nothing is drawn outside the actual visible game area.
        ctx.beginPath();
        ctx.rect(gameCanvasOffset.x, gameCanvasOffset.y, gameCanvasOffset.width, gameCanvasOffset.height);
        ctx.clip();
        // -------------------------------------------------------------------

        // Get color and opacity configs
        const lootOpacity = this.getConfig('vis_loot_opacity');
        const objectOpacity = this.getConfig('vis_object_opacity');
        const targetOpacity = this.getConfig('vis_target_opacity');

        // Filter mode config
        const filterMode = this.getConfig('vis_object_filter_mode');
        const selectedObjects = this.getConfig('vis_selected_objects');

        // Convert hex color to R,G,B string for CSS rgba()
        const hexToRgb = (hex) => {
            const bigint = parseInt(hex.slice(1), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `${r},${g},${b}`;
        };

        const lootColorRGB = hexToRgb(this.getConfig('vis_loot_color'));
        const objectColorRGB = hexToRgb(this.getConfig('vis_object_color'));
        const targetColorRGB = hexToRgb(this.getConfig('vis_target_color'));


        // 1. Highlight Ground Items (Loot)
        if (this.getConfig('vis_toggle_loot')) {
            const groundItems = getGroundItems() || [];
            // FIX: Use individual opacity setting for the fill color
            const lootBoxColor = `rgba(${lootColorRGB},${lootOpacity})`;

            for (let i = 0; i < groundItems.length; i++) {
                const it = groundItems[i];
                if (!it || it.x === undefined || it.y === undefined) continue;

                const pos = this.tileToCanvasPixels(it.x, it.y);

                this.drawRect(pos.x, pos.y, TILE_SIZE, TILE_SIZE, lootBoxColor, lootColorRGB, 2, 3);

                ctx.fillStyle = 'white'; // Use a standard white text color over the map
                ctx.font = 'bold 12px sans-serif';
                ctx.shadowColor = 'black';
                ctx.shadowBlur = 4;

                const name = (it.name || ('item-' + (it.uuid || i))).replace(/_/g, ' ');
                ctx.fillText(name, pos.x + 4, pos.y + TILE_SIZE - 6);

                ctx.shadowBlur = 0;
            }
        }

        // 2. Highlight Map Objects
        if (this.getConfig('vis_toggle_objects')) {
            const mapObjects = getMapObjects() || {};

            // FIX: Use individual opacity setting for the fill color
            const OBJECT_BOX_COLOR_DYNAMIC = `rgba(${objectColorRGB},${objectOpacity})`;
            const TARGET_OBJECT_COLOR_DYNAMIC = `rgba(${targetColorRGB},${targetOpacity})`;

            for (const uuid in mapObjects) {
                if (!mapObjects.hasOwnProperty(uuid)) continue;

                let objectData = mapObjects[uuid];

                if (!Array.isArray(objectData)) {
                    if (typeof objectData === 'object' && objectData !== null) {
                        objectData = [objectData];
                    } else {
                        continue;
                    }
                }

                for (const obj of objectData) {
                    const tx = obj.tileX, ty = obj.tileY;
                    const x = obj.x, y = obj.y;

                    const finalX = (tx !== undefined) ? tx : x;
                    const finalY = (ty !== undefined) ? ty : y;

                    if (finalX === undefined || finalY === undefined) continue;

                    // 3. Filtering Logic
                    const objName = obj.name || '';
                    const isTargetType = DIG_SPOT_NAMES.includes(objName);

                    if (filterMode === 'filtered') {
                        // In filtered mode, only show if it is a selected object OR it is a dig spot
                        const isSelected = selectedObjects.includes(objName);
                        if (!isSelected && !isTargetType) {
                            continue;
                        }
                    }

                    const pos = this.tileToCanvasPixels(finalX, finalY);

                    const spriteNameLower = (obj.spriteName || '').toLowerCase().trim();
                    const isReadyTarget = isTargetType && spriteNameLower !== 'none'; // Target is 'ready' if it's the right type and not a 'none' sprite

                    let boxColor = OBJECT_BOX_COLOR_DYNAMIC;
                    let borderColorRGB = objectColorRGB;

                    if (isReadyTarget) {
                        boxColor = TARGET_OBJECT_COLOR_DYNAMIC;
                        borderColorRGB = targetColorRGB;
                    }

                    this.drawRect(pos.x, pos.y, TILE_SIZE, TILE_SIZE, boxColor, borderColorRGB, 2, 3);

                    ctx.fillStyle = 'white';
                    ctx.font = 'bold 12px sans-serif';
                    ctx.shadowColor = 'black';
                    ctx.shadowBlur = 4;

                    const name = (obj.name || ('object-' + uuid)).replace(/_/g, ' ');
                    ctx.fillText(name, pos.x + 4, pos.y + 14);

                    ctx.shadowBlur = 0;
                }
            }
        }

        ctx.restore();
    }

    scheduleOverlay() {
        if (overlayRequested || !this.getConfig('visualizer_enabled')) return;
        overlayRequested = true;
        // Use the bound function for the next frame
        requestAnimationFrame(this.renderOverlayBound);
    }

    startOverlayLoop() {
        const loop = () => {
            // Only request redraw if the game is in focus (for performance)
            if (gameIsFocused) {
                this.scheduleOverlay();
            }
            // Request the next frame, using the bound loop function
            this.overlayLoopId = requestAnimationFrame(loop);
        };
        // Start the initial request
        this.overlayLoopId = requestAnimationFrame(loop);
    }

    attachVisibilityListener() {
        // Only attach once
        if (this.visibilityListenerAttached) return;

        document.addEventListener('visibilitychange', () => {
            gameIsFocused = document.visibilityState === 'visible';
            if (gameIsFocused) this.scheduleOverlay();
        });
        this.visibilityListenerAttached = true;
    }
}

// Register the plugin with FlatMMOPlus
window.FlatMMOPlus.registerPlugin(new ActionProgressBarPlugin());
})();