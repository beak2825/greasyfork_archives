// ==UserScript==
// @name              Sort Youtube Playlist by Duration (Advanced)
// @namespace         https://github.com/L0garithmic/ytsort/
// @version           4.6.0
// @description       Sorts youtube playlist by duration
// @author            L0garithmic
// @license           GPL-2.0-only
// @match             http://*.youtube.com/*
// @match             https://*.youtube.com/*
// @supportURL        https://github.com/L0garithmic/ytsort/
// @grant             none
// @run-at            document-idle
// @downloadURL https://update.greasyfork.org/scripts/552228/Sort%20Youtube%20Playlist%20by%20Duration%20%28Advanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552228/Sort%20Youtube%20Playlist%20by%20Duration%20%28Advanced%29.meta.js
// ==/UserScript==

/**
 *  Changelog 10/19/2025 (v4.6.0)
 *  - Added missing-video tolerance setting with 0-100% range (default 10%)
 *  - Adaptive reload now accepts tolerance to keep sorts moving on partial loads
 *  - Improved logging when sorting proceeds under the configured tolerance
 *
 *  Changelog 10/12/2025 (v4.5.0)
 *  - Added Settings Panel for persistent configuration management
 *  - Settings saved to localStorage and persist across sessions
 *  - Settings include: default sort mode, auto-scroll, scroll retry time, log preferences
 *  - Added Dry Run Mode to preview sort order without applying changes
 *  - Dry Run shows before/after comparison with confirmation prompt
 *  - Safer for large playlists - verify sort logic before committing
 *  - Settings panel accessible via dedicated button
 *
 *  Changelog 10/12/2025 (v4.4.0)
 *  - Added "Export" button to export playlist data as CSV
 *  - Export includes: position, title, duration (formatted & seconds), URL, video ID
 *  - Fixed move counter to show actual move number vs total moves needed
 *  - Move counter now shows (1/10) instead of (9/269) for better clarity
 *  - Auto-generates filename with playlist ID and date
 *  - CSV properly escapes special characters in video titles
 *
 *  Changelog 10/12/2025 (v4.3.0)
 *  - Added "Only include specific lengths" filter feature
 *  - Filter inputs now use minutes instead of seconds for easier configuration
 *  - Title tiebreaker always enabled (videos with same duration sorted alphabetically)
 *  - Filtered videos are moved to the end of the playlist
 *  - Filter settings shown in log when sorting starts
 *
 *  Changelog 10/12/2025 (v4.2.0)
 *  - Added "Stats" button (compact size) for playlist analysis
 *  - Shows total duration, average length, shortest/longest videos
 *  - Removed distribution chart for cleaner output
 *  - Auto-opens log console when Stats is clicked
 *  - Counts unavailable/private videos
 *  - Provides quick insights before sorting
 *
 *  Changelog 10/12/2025 (v4.1.1)
 *  - Fixed random scrolling behavior after sort completion
 *  - Increased log retention from 100 to 1000 messages
 *  - Added warning about not switching back to YouTube's auto-sort methods
 *  - Added version number display (visible when expanded)
 *  - Version number now included in verbose logs for troubleshooting
 *  - Scroll to top after sort completes to stabilize view
 *
 *  Changelog 10/10/2025 (v4.1.0)
 *  - Added "Copy Console" button to copy all logs to clipboard
 *  - MAJOR FIX: Completely rewrote lazy loading prevention
 *  - Now reloads entire playlist before each sort iteration
 *  - Scrolls to bottom then top to ensure all videos are loaded
 *  - Verifies video count before each sort
 *  - Reduces sort iterations significantly (more reliable)
 *  - Better error messages when playlist cannot be maintained
 *
 *  Changelog 10/10/2025 (v4.0.3)
 *  - Added scrollable console log with timestamps
 *  - Log auto-scrolls to show latest messages
 *  - Added Clear Log button
 *  - Enhanced logging with emojis and visual separators
 *  - All actions are now logged in real-time
 *  - Console shows up to 100 most recent messages
 *  - Added progress indicators for sorting steps
 *
 *  Changelog 10/10/2025 (v4.0.2)
 *  - Fixed YouTube's lazy loading causing videos to unload during sorting
 *  - Added smart viewport positioning to keep videos loaded
 *  - Both modes now check for new content before sorting
 *  - Waits for stable state (no new videos for 3 attempts) before sorting
 *  - Increased delays between sort operations for better stability
 *  - Better error handling when playlist state cannot be maintained
 *
 *  Changelog 10/10/2025 (v4.0.1)
 *  - Fixed annoying continuous scroll/load/refresh loop
 *  - Added max retry limit to prevent infinite scrolling
 *  - Improved early exit when no progress is detected (3 attempts)
 *  - Better scroll detection to stop when already at bottom
 *  - Clear feedback for "Sort only loaded" mode
 *
 *  Changelog 10/10/2025 (v4.0.0)
 *  - Fixed video count detection to work with new YouTube layout
 *  - Improved "Sort all" mode to reliably load all videos in playlist
 *  - Enhanced progress feedback during video loading
 *  - Modernized UI with better styling (rounded buttons, gradients, smooth transitions)
 *  - Added dark mode support
 *  - Better retry logic with progress tracking
 *
 *  Changelog 08/08/2024
 *  - Attempt to address the most serious of buggy code, script should now work in all but the longest playlist.
 */

/* jshint esversion: 8 */

(function () {
    'use strict';

    const SCRIPT_VERSION = '4.6.0';

    // Settings management with localStorage
    const SETTINGS_KEY = 'yt_playlist_sorter_settings';

    /**
     * Default settings structure
     * @type {Object}
     */
    const DEFAULT_SETTINGS = {
        sortMode: 'asc',
        autoScrollInitialVideoList: 'true',
        scrollLoopTime: 600,
        logVisible: false,
        dryRunEnabled: false,
        filterEnabled: false,
        filterMinDuration: 0,
        filterMaxDuration: 36000,
        mismatchTolerancePercent: 10
    };

    /**
     * Load settings from localStorage
     * @returns {Object} Settings object
     */
    const loadSettings = () => {
        try {
            const stored = localStorage.getItem(SETTINGS_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return { ...DEFAULT_SETTINGS, ...parsed };
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
        return { ...DEFAULT_SETTINGS };
    };

    /**
     * Save settings to localStorage
     * @param {Object} settings - Settings object to save
     * @returns {void}
     */
    const saveSettings = (settings) => {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    };

    /**
     * Get current settings from UI state
     * @returns {Object} Current settings
     */
    const getCurrentSettings = () => {
        return {
            sortMode,
            autoScrollInitialVideoList,
            scrollLoopTime,
            logVisible,
            dryRunEnabled,
            filterEnabled,
            filterMinDuration,
            filterMaxDuration,
            mismatchTolerancePercent
        };
    };

    /**
     * Apply settings to UI state
     * @param {Object} settings - Settings to apply
     * @returns {void}
     */
    const applySettings = (settings) => {
        sortMode = settings.sortMode;
        autoScrollInitialVideoList = settings.autoScrollInitialVideoList;
        scrollLoopTime = settings.scrollLoopTime;
        logVisible = settings.logVisible;
        dryRunEnabled = settings.dryRunEnabled;
        filterEnabled = settings.filterEnabled;
        filterMinDuration = settings.filterMinDuration;
        filterMaxDuration = settings.filterMaxDuration;
        mismatchTolerancePercent = settings.mismatchTolerancePercent;
    };

    // Load settings on initialization
    const savedSettings = loadSettings();

    /**
     * Wait for element(s) to appear in DOM using MutationObserver
     * @param {string} selector - CSS selector to wait for
     * @param {boolean} [multiple=false] - Whether to wait for multiple elements
     * @param {Function} [callback=()=>{}] - Callback function to execute when element(s) found
     * @returns {void}
     */
    const onElementReady = (selector, multiple = false, callback = () => { }) => {
        const runCallback = () => {
            if (multiple) {
                const elements = document.querySelectorAll(selector);
                if (elements.length) {
                    callback(elements);
                    return true;
                }
            } else {
                const element = document.querySelector(selector);
                if (element) {
                    callback(element);
                    return true;
                }
            }
            return false;
        };

        if (runCallback()) {
            return;
        }

        const observer = new MutationObserver(() => {
            if (runCallback()) {
                observer.disconnect();
            }
        });

        const root = document.documentElement || document;
        observer.observe(root, { childList: true, subtree: true });

        setTimeout(() => observer.disconnect(), 30000);
    };

    /**
     * Variables and constants
     */
    const css =
        `
        .sort-playlist-wrapper {
            margin-top: 12px;
        }
        .sort-playlist-details {
            border: 1px solid rgba(48,48,48,0.4);
            border-radius: 12px;
            background: rgba(0,0,0,0.03);
            overflow: hidden;
        }
        .sort-playlist-summary {
            list-style: none;
            padding: 12px 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            color: #0f0f0f;
            user-select: none;
            justify-content: space-between;
        }
        .sort-playlist-summary::-webkit-details-marker {
            display: none;
        }
        .sort-playlist-summary::before {
            content: '▶';
            font-size: 10px;
            transition: transform 0.2s ease;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            transform: translateY(-1px);
        }
        .sort-playlist-details[open] .sort-playlist-summary::before {
            content: '▼';
        }
        .sort-playlist-title {
            flex: 1;
        }
        .sort-playlist-version {
            font-size: 11px;
            font-weight: 500;
            color: #606060;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            margin-left: auto;
        }
        .sort-playlist-details[open] .sort-playlist-version {
            opacity: 1;
        }
        .sort-playlist-content {
            padding: 12px 16px 16px;
        }
        .sort-playlist-div {
            font-size: 13px;
            padding: 8px 4px;
            font-family: "Roboto", "Arial", sans-serif;
        }
        .sort-button-wl {
            border: none;
            border-radius: 18px;
            padding: 10px 16px;
            cursor: pointer;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.2s ease;
            box-shadow: none;
            white-space: nowrap;
        }
        .sort-button-wl-default {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            font-weight: 500;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .sort-button-wl-stop {
            background: rgba(255, 255, 255, 0.1);
            color: #ff4444;
            font-weight: 600;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .sort-button-wl-default:hover {
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
        }
        .sort-button-wl-stop:hover {
            background: rgba(255, 68, 68, 0.15);
            border: 1px solid rgba(255, 68, 68, 0.3);
            transform: translateY(-1px);
        }
        .sort-button-wl-default:active {
            background: rgba(62, 166, 255, 0.25);
            transform: translateY(0);
        }
        .sort-button-wl-stop:active {
            background: rgba(255, 68, 68, 0.25);
            transform: translateY(0);
        }
        .sort-select {
            border: 1px solid #303030;
            border-radius: 8px;
            padding: 8px 12px;
            background-color: #f9f9f9;
            color: #0f0f0f;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .sort-select:hover {
            border-color: #065fd4;
            background-color: #fff;
        }
        .sort-select:focus {
            outline: none;
            border-color: #065fd4;
            box-shadow: 0 0 0 2px rgba(6,95,212,0.1);
        }
        .sort-number-input {
            border: 1px solid #303030;
            border-radius: 8px;
            padding: 8px 12px;
            background-color: #f9f9f9;
            color: #0f0f0f;
            font-size: 13px;
            width: 100px;
            transition: all 0.2s ease;
        }
        .sort-number-input:hover {
            border-color: #065fd4;
            background-color: #fff;
        }
        .sort-number-input:focus {
            outline: none;
            border-color: #065fd4;
            box-shadow: 0 0 0 2px rgba(6,95,212,0.1);
        }
        .sort-log {
            padding: 12px;
            margin-top: 8px;
            border-radius: 8px;
            background-color: #0f0f0f;
            color: #f1f1f1;
            font-family: 'Roboto Mono', monospace;
            font-size: 12px;
            line-height: 1.5;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);
            max-height: 200px;
            overflow-y: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .sort-log::-webkit-scrollbar {
            width: 8px;
        }
        .sort-log::-webkit-scrollbar-track {
            background: #1a1a1a;
            border-radius: 4px;
        }
        .sort-log::-webkit-scrollbar-thumb {
            background: #3ea6ff;
            border-radius: 4px;
        }
        .sort-log::-webkit-scrollbar-thumb:hover {
            background: #4db3ff;
        }
        .sort-log-entry {
            margin-bottom: 4px;
            padding: 2px 0;
        }
        .sort-log.sort-log-empty {
            color: #888;
        }
        .sort-log-timestamp {
            color: #888;
            margin-right: 8px;
        }
        .sort-margin-right-3px {
            margin-right: 8px;
        }
        .sort-input-label {
            display: inline-block;
            margin-right: 6px;
            color: #0f0f0f;
            font-weight: 500;
        }
        .sort-checkbox-container {
            display: inline-flex;
            align-items: center;
            margin-bottom: 4px;
            margin-right: 4px;
            font-size: 11px;
            color: #0f0f0f;
            cursor: pointer;
        }
        .sort-checkbox {
            margin-right: 4px;
            cursor: pointer;
        }
        @media (prefers-color-scheme: dark) {
            .sort-playlist-details {
                border-color: rgba(255,255,255,0.1);
                background: rgba(255,255,255,0.03);
            }
            .sort-playlist-summary {
                color: #f1f1f1;
            }
            .sort-playlist-version {
                color: #aaa;
            }
            .sort-select, .sort-number-input {
                background-color: #272727;
                color: #f1f1f1;
                border-color: #4f4f4f;
            }
            .sort-select:hover, .sort-number-input:hover {
                background-color: #3f3f3f;
                border-color: #3ea6ff;
            }
            .sort-select:focus, .sort-number-input:focus {
                border-color: #3ea6ff;
                box-shadow: 0 0 0 2px rgba(62,166,255,0.1);
            }
            .sort-input-label {
                color: #f1f1f1;
            }
            .sort-checkbox-container {
                color: #f1f1f1;
            }
            .sort-button-wl-default {
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(255, 255, 255, 0.15);
            }
            .sort-button-wl-default:hover {
                background: rgba(255, 255, 255, 0.15);
            }
            .sort-dry-run-modal {
                background-color: #212121;
                border-color: #4f4f4f;
            }
            .sort-dry-run-title {
                color: #f1f1f1;
                border-bottom-color: #4f4f4f;
            }
            .sort-dry-run-comparison {
                background-color: #181818;
                border-color: #4f4f4f;
            }
            .sort-dry-run-column h4 {
                color: #f1f1f1;
            }
            .sort-dry-run-video {
                background-color: #272727;
                border-color: #3f3f3f;
                color: #f1f1f1;
            }
        }
        .sort-settings-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #212121;
            border: 1px solid #4f4f4f;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 10000;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        .sort-settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 9999;
        }
        .sort-settings-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #4f4f4f;
            color: #f1f1f1;
        }
        .sort-settings-section {
            margin-bottom: 16px;
        }
        .sort-settings-section-title {
            font-size: 13px;
            font-weight: 600;
            color: #aaa;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        .sort-settings-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        .sort-settings-label {
            font-size: 14px;
            color: #f1f1f1;
            font-weight: normal;
        }
        .sort-settings-buttons {
            display: flex;
            gap: 8px;
            margin-top: 20px;
            justify-content: flex-end;
        }
        .sort-settings-buttons button {
            font-weight: normal;
        }
        .sort-settings-modal .sort-select,
        .sort-settings-modal .sort-number-input,
        .sort-settings-modal .sort-checkbox {
            background-color: #272727;
            color: #f1f1f1;
            border-color: #4f4f4f;
        }
        .sort-settings-modal .sort-select {
            width: 160px;
        }
        .sort-settings-modal .sort-number-input {
            width: 135px;
        }
        .sort-settings-modal .sort-select:hover,
        .sort-settings-modal .sort-number-input:hover {
            background-color: #3f3f3f;
            border-color: #3ea6ff;
        }
        .sort-settings-modal .sort-select:focus,
        .sort-settings-modal .sort-number-input:focus {
            outline: none;
            border-color: #3ea6ff;
            box-shadow: 0 0 0 2px rgba(62,166,255,0.2);
        }
        .sort-dry-run-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ccc;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10001;
            max-width: 800px;
            width: 95%;
            max-height: 85vh;
            overflow-y: auto;
        }
        .sort-dry-run-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e0e0e0;
            color: #0f0f0f;
        }
        .sort-dry-run-info {
            margin-bottom: 16px;
            padding: 12px;
            background: #f0f7ff;
            border-radius: 8px;
            font-size: 13px;
            color: #065fd4;
        }
        .sort-dry-run-comparison {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
            max-height: 400px;
            overflow-y: auto;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 12px;
            background: #fafafa;
        }
        .sort-dry-run-column {
            min-width: 0;
        }
        .sort-dry-run-column h4 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
            position: sticky;
            top: 0;
            background: #fafafa;
            padding: 8px 0;
            color: #0f0f0f;
        }
        .sort-dry-run-video {
            font-size: 12px;
            padding: 6px 8px;
            margin-bottom: 4px;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .sort-dry-run-buttons {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }
    `;

    const modeAvailable = [
        { value: 'asc', label: 'Shortest First' },
        { value: 'desc', label: 'Longest First' }
    ];

    const autoScrollOptions = [
        { value: 'true', label: 'Sort all' },
        { value: 'false', label: 'Sort only loaded' }
    ];

    // NEW YouTube architecture selectors
    const NEW_PAGE_HEADER_SELECTOR = 'yt-flexible-actions-view-model';
    const NEW_ACTIONS_ROW_SELECTOR = '.ytFlexibleActionsViewModelActionRow';

    // OLD YouTube architecture selectors
    const PLAYLIST_HEADER_SELECTOR = 'ytd-playlist-header-renderer';
    const PLAYLIST_ACTIONS_SELECTOR = 'ytd-playlist-header-renderer #actions';
    const PLAYLIST_VIDEO_LIST_SELECTOR = 'ytd-playlist-video-list-renderer';
    const PLAYLIST_VIDEO_ITEM_SELECTOR = 'ytd-playlist-video-renderer';

    const debug = false;

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let scrollLoopTime = savedSettings.scrollLoopTime;

    let sortMode = savedSettings.sortMode;

    let autoScrollInitialVideoList = savedSettings.autoScrollInitialVideoList;

    const DEFAULT_LOG_MESSAGE = '[Ready] Waiting for sort action...';
    const MAX_LOG_MESSAGES = 1000; // Increased from 100 to retain more logs

    let log = document.createElement('div');
    let logEntries = []; // Store all log messages with metadata
    let verboseMode = false; // Default to non-verbose mode
    let autoScrollLog = true; // Default to auto-scroll enabled
    let logVisible = savedSettings.logVisible; // Load from settings

    let stopSort = false;

    // Global move counter for tracking progress across all sort iterations
    let globalMoveCounter = 0;
    let globalTotalMoves = 0;

    let dryRunEnabled = savedSettings.dryRunEnabled; // Load from settings

    // Filter settings (load from saved settings)
    let filterEnabled = savedSettings.filterEnabled;
    let filterMinDuration = savedSettings.filterMinDuration; // in seconds
    let filterMaxDuration = savedSettings.filterMaxDuration; // in seconds (max)
    let mismatchTolerancePercent = savedSettings.mismatchTolerancePercent ?? DEFAULT_SETTINGS.mismatchTolerancePercent;

    // Multi-criteria sorting
    let useTitleTiebreaker = true; // Always enabled by default

    /**
     * Get all playlist video pairs (drag handle, anchor, item)
     * @returns {{drag: Element, anchor: Element, item: Element}[]} Array of video pair objects
     */
    const getPlaylistVideoPairs = () => {
        const scope = document.querySelector(PLAYLIST_VIDEO_LIST_SELECTOR) || document;
        const videoItems = scope.querySelectorAll(PLAYLIST_VIDEO_ITEM_SELECTOR);
        const pairs = [];

        videoItems.forEach(item => {
            const drag = item.querySelector('yt-icon#reorder');
            const anchor = item.querySelector('a#thumbnail');
            if (drag && anchor) {
                pairs.push({ drag, anchor, item });
            }
        });

        return pairs;
    };

    /**
     * Get video duration in seconds from a video anchor element
     * @param {Element} anchor - Video anchor element
     * @return {number|null} Duration in seconds, or null if unavailable
     */
    const getVideoDuration = (anchor) => {
        const timeSpan = anchor.querySelector("#text");
        if (!timeSpan || !timeSpan.innerText.trim()) {
            return null;
        }

        const timeDigits = timeSpan.innerText.trim().split(":").reverse();
        if (timeDigits.length === 1) {
            return null;
        }

        let seconds = parseInt(timeDigits[0]) || 0;
        if (timeDigits[1]) seconds += parseInt(timeDigits[1]) * 60;
        if (timeDigits[2]) seconds += parseInt(timeDigits[2]) * 3600;

        return seconds;
    };

    /**
     * Get video title from a video item element
     * @param {Element} item - Video item element
     * @return {string} Video title
     */
    const getVideoTitle = (item) => {
        const titleElement = item.querySelector('#video-title');
        return titleElement ? titleElement.innerText.trim() : '';
    };

    /**
     * Check if a video passes the duration filter
     * @param {number|null} duration - Video duration in seconds
     * @return {boolean} True if video passes filter
     */
    const passesFilter = (duration) => {
        if (!filterEnabled) return true;
        if (duration === null) return false; // Exclude videos without duration
        return duration >= filterMinDuration && duration <= filterMaxDuration;
    };

    /**
     * Determine if the current playlist count satisfies the configured mismatch tolerance
     * @param {number} expected - Target number of videos to load
     * @param {number} actual - Number of videos currently loaded
     * @returns {boolean} True when the difference is within tolerance limits
     */
    const isWithinMismatchTolerance = (expected, actual) => {
        if (expected <= 0) return true;
        if (mismatchTolerancePercent >= 100) return true;
        const clampedTolerance = Math.min(Math.max(mismatchTolerancePercent, 0), 100);
        const allowedMissing = Math.ceil((clampedTolerance / 100) * expected);
        return actual + allowedMissing >= expected;
    };

    /**
     * Snapshot current playlist DOM state for reuse
     * @returns {{videoPairs: Array, dragPoints: Element[], anchors: Element[], items: Element[], count: number}}
     */
    const collectPlaylistState = () => {
        const videoPairs = getPlaylistVideoPairs();
        return {
            videoPairs,
            dragPoints: videoPairs.map(pair => pair.drag),
            anchors: videoPairs.map(pair => pair.anchor),
            items: videoPairs.map(pair => pair.item),
            count: videoPairs.length
        };
    };

    /**
     * Attempt to keep the full playlist loaded by scrolling with adaptive delays
     * @param {number} targetCount - Desired number of videos in DOM
     * @param {number} [maxAttempts=5] - Maximum reload attempts before giving up
     * @returns {Promise<{state: Object, loadedCount: number, bestCount: number, attempts: number}>}
     */
    const ensureFullPlaylistLoaded = async (targetCount, maxAttempts = 5) => {
        let attempt = 0;
        let state = collectPlaylistState();
        let bestState = state;
        let bestCount = state.count;

        while (attempt < maxAttempts && bestCount < targetCount && stopSort === false) {
            if (isWithinMismatchTolerance(targetCount, bestCount)) {
                break;
            }
            const adaptiveDelay = Math.min(scrollLoopTime * (1 + attempt * 0.75), scrollLoopTime * 4);

            await autoScroll(null, adaptiveDelay);

            if (document.scrollingElement) {
                document.scrollingElement.scrollTop = 0;
            }

            await wait(adaptiveDelay);

            await autoScroll(null, adaptiveDelay);

            if (document.scrollingElement) {
                document.scrollingElement.scrollTop = 0;
            }

            await wait(Math.max(150, adaptiveDelay / 2));

            state = collectPlaylistState();
            if (state.count > bestCount) {
                bestCount = state.count;
                bestState = state;

                if (bestCount >= targetCount || isWithinMismatchTolerance(targetCount, bestCount)) {
                    break;
                }
            }

            attempt++;
        }

        return {
            state: bestState,
            loadedCount: bestState.count,
            bestCount,
            attempts: attempt,
            withinTolerance: isWithinMismatchTolerance(targetCount, bestState.count)
        };
    };

    /**
     * Fire a mouse event on an element
     * @param {string} type - Event type (e.g., 'mousemove', 'mousedown', 'dragstart')
     * @param {Element} elem - Target element to fire event on
     * @param {number} centerX - X coordinate for the event
     * @param {number} centerY - Y coordinate for the event
     * @returns {void}
     */
    let fireMouseEvent = (type, elem, centerX, centerY) => {
        const event = new MouseEvent(type, {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: centerX,
            clientY: centerY
        });

        elem.dispatchEvent(event);
    };

    /**
     * Simulate drag and drop operation between two elements
     * Fires a sequence of mouse events to replicate user drag and drop
     * @see https://ghostinspector.com/blog/simulate-drag-and-drop-javascript-casperjs/
     * @param {Element} elemDrag - Element to drag from
     * @param {Element} elemDrop - Element to drop onto
     * @returns {void}
     */
    let simulateDrag = (elemDrag, elemDrop) => {
        // calculate positions
        let pos = elemDrag.getBoundingClientRect();
        let center1X = Math.floor((pos.left + pos.right) / 2);
        let center1Y = Math.floor((pos.top + pos.bottom) / 2);
        pos = elemDrop.getBoundingClientRect();
        let center2X = Math.floor((pos.left + pos.right) / 2);
        let center2Y = Math.floor((pos.top + pos.bottom) / 2);

        // mouse over dragged element and mousedown
        fireMouseEvent("mousemove", elemDrag, center1X, center1Y);
        fireMouseEvent("mouseenter", elemDrag, center1X, center1Y);
        fireMouseEvent("mouseover", elemDrag, center1X, center1Y);
        fireMouseEvent("mousedown", elemDrag, center1X, center1Y);

        // start dragging process over to drop target
        fireMouseEvent("dragstart", elemDrag, center1X, center1Y);
        fireMouseEvent("drag", elemDrag, center1X, center1Y);
        fireMouseEvent("mousemove", elemDrag, center1X, center1Y);
        fireMouseEvent("drag", elemDrag, center2X, center2Y);
        fireMouseEvent("mousemove", elemDrop, center2X, center2Y);

        // trigger dragging process on top of drop target
        fireMouseEvent("mouseenter", elemDrop, center2X, center2Y);
        fireMouseEvent("dragenter", elemDrop, center2X, center2Y);
        fireMouseEvent("mouseover", elemDrop, center2X, center2Y);
        fireMouseEvent("dragover", elemDrop, center2X, center2Y);

        // release dragged element on top of drop target
        fireMouseEvent("drop", elemDrop, center2X, center2Y);
        fireMouseEvent("dragend", elemDrag, center2X, center2Y);
        fireMouseEvent("mouseup", elemDrag, center2X, center2Y);
    };

    /**
     * Scroll to keep a specific video in view (to prevent lazy unloading)
     * @param {number} videoIndex - Index of video to keep in view
     * @param {NodeList|Element[]} allAnchors - All video anchor elements
     * @returns {void}
     */
    let keepVideoInView = (videoIndex, allAnchors) => {
        if (!allAnchors || videoIndex >= allAnchors.length) return;

        try {
            // Scroll to keep the video in the middle of the viewport
            const targetElement = allAnchors[videoIndex];
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        } catch (e) {
            // Ignore errors if element is not found
            if (debug) console.log("Could not scroll to video:", e);
        }
    };

    /**
     * Scroll automatically to the bottom of the page (or specific scroll position)
     * @param {number|null} scrollTop - Target scroll position (null for bottom of page)
     * @returns {Promise<void>} Resolves when scrolling is complete
     */
    let autoScroll = async (scrollTop = null, customDelay = null) => {
        const element = document.scrollingElement;
        if (!element) return;

        const delay = customDelay !== null ? customDelay : scrollLoopTime;
        let currentScroll = element.scrollTop;
        const scrollDestination = scrollTop !== null ? scrollTop : element.scrollHeight;
        let scrollCount = 0;
        const maxAttempts = 3; // Reduced from implicit infinite to 3 attempts

        do {
            if (stopSort) break; // Check stopSort at the start of each iteration

            currentScroll = element.scrollTop;
            element.scrollTop = scrollDestination;
            await wait(delay);
            scrollCount++;

            // If we haven't moved in 2 attempts, we're probably at the bottom
            if (scrollCount > 1 && currentScroll === element.scrollTop) {
                break;
            }
        } while (currentScroll !== scrollDestination && scrollCount < maxAttempts && stopSort === false);
    };

    /**
     * Get current timestamp for log entries in HH:MM:SS format
     * @returns {string} Formatted timestamp string
     */
    let getTimestamp = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    /**
     * Log activities with scrollable console
     * @param {string} message - Message to log
     * @param {boolean} [append=true] - If true, append to log; if false, replace
     * @param {boolean} [isVerbose=false] - If true, only show when verbose mode is on
     * @returns {void}
     */
    let logActivity = (message, append = true, isVerbose = false) => {
        const timestamp = getTimestamp();
        const entry = {
            raw: `[${timestamp}] ${message}`,
            message,
            isVerbose
        };

        // Always log to console for debugging
        console.log(entry.raw);

        if (append) {
            logEntries.push(entry);
            if (logEntries.length > MAX_LOG_MESSAGES) {
                logEntries.shift();
            }
        } else {
            logEntries = [entry];
        }

        const shouldAutoScroll = !isVerbose || verboseMode;
        renderLogDisplay(shouldAutoScroll);
    };

    /**
     * Render log display by filtering and showing appropriate log entries
     * @param {boolean} [shouldAutoScroll=true] - Whether to auto-scroll to bottom
     * @returns {void}
     */
    function renderLogDisplay(shouldAutoScroll = true) {
        if (!logEntries.length) {
            log.textContent = DEFAULT_LOG_MESSAGE;
            log.classList.add('sort-log-empty');
            return;
        }

        const displayMessages = logEntries
            .filter(entry => !entry.isVerbose || verboseMode)
            .map(entry => entry.message);

        if (displayMessages.length === 0) {
            log.textContent = DEFAULT_LOG_MESSAGE;
            log.classList.add('sort-log-empty');
        } else {
            log.textContent = displayMessages.join('\n');
            log.classList.remove('sort-log-empty');
            if (shouldAutoScroll && autoScrollLog) {
                log.scrollTop = log.scrollHeight;
            }
        }
    }

    /**
     * Clear the log console and reset to default message
     * @returns {void}
     */
    let clearLog = () => {
        logEntries = [];
        log.textContent = DEFAULT_LOG_MESSAGE;
        log.classList.add('sort-log-empty');
    };

    /**
     * Generate menu container element and inject into YouTube page
     * Handles both NEW and OLD YouTube architecture
     * @returns {Element|null} Container element or null if parent not found
     */
    let renderContainerElement = () => {
        // Try NEW YouTube architecture first
        let actionsRow = document.querySelector(NEW_ACTIONS_ROW_SELECTOR);
        let parent = null;

        if (actionsRow) {
            // NEW architecture: Insert BELOW the button row
            parent = actionsRow.parentElement;
        } else {
            // Try OLD architecture selectors (for Watch Later / older layouts)
            // Use thumbnail-and-metadata-wrapper which appears below the buttons on Watch Later
            parent = document.querySelector('div.thumbnail-and-metadata-wrapper');

            if (!parent) {
                parent = document.querySelector(PLAYLIST_ACTIONS_SELECTOR) ||
                    document.querySelector(`${PLAYLIST_HEADER_SELECTOR} #container`) ||
                    document.querySelector(PLAYLIST_HEADER_SELECTOR);
            }
        }

        // Fallback for regular playlists (sidebar layout)
        if (!parent || parent.hasAttribute('hidden')) {
            parent = document.querySelector('ytd-playlist-sidebar-primary-info-renderer #menu');
        }

        if (!parent) {
            if (debug) console.warn('Sort Playlist: container parent not found.');
            return null;
        }

        const existing = document.querySelector('.sort-playlist-wrapper');
        if (existing) {
            existing.remove();
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'sort-playlist-wrapper';

        const details = document.createElement('details');
        details.className = 'sort-playlist-details';
        details.open = false;

        const summary = document.createElement('summary');
        summary.className = 'sort-playlist-summary';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'sort-playlist-title';
        titleSpan.innerText = 'Sort playlist by duration';

        const versionSpan = document.createElement('span');
        versionSpan.className = 'sort-playlist-version';
        versionSpan.innerText = 'v' + SCRIPT_VERSION;

        summary.appendChild(titleSpan);
        summary.appendChild(versionSpan);
        details.appendChild(summary);

        const element = document.createElement('div');
        element.className = 'sort-playlist sort-playlist-div sort-playlist-content';

        // Add buttonChild container
        const buttonChild = document.createElement('div');
        buttonChild.className = 'sort-playlist-div sort-playlist-button';
        element.appendChild(buttonChild);

        // Add selectChild container
        const selectChild = document.createElement('div');
        selectChild.className = 'sort-playlist-div sort-playlist-select';
        element.appendChild(selectChild);

        details.appendChild(element);
        wrapper.appendChild(details);

        if (actionsRow) {
            // NEW architecture: Insert wrapper as a sibling AFTER the actions row
            actionsRow.insertAdjacentElement('afterend', wrapper);
        } else {
            // OLD architecture: Append to parent (thumbnail-and-metadata-wrapper)
            parent.append(wrapper);
        }

        return element;
    };

    /**
     * Generate button element and add to button container
     * @param {Function} [click=()=>{}] - OnClick handler function
     * @param {string} [label=''] - Button label text
     * @param {boolean} [red=false] - Whether to use red styling (for stop/danger actions)
     * @returns {void}
     */
    let renderButtonElement = (click = () => { }, label = '', red = false) => {
        // Create button
        const element = document.createElement('button');
        if (red) {
            element.className = 'style-scope sort-button-wl sort-button-wl-stop sort-margin-right-3px';
        } else {
            element.className = 'style-scope sort-button-wl sort-button-wl-default sort-margin-right-3px';
        }
        element.innerText = label;
        element.onclick = click;

        // Render button
        document.querySelector('.sort-playlist-button').appendChild(element);
    };

    /**
     * Generate select dropdown element
     * @param {number} [variable=0] - Variable to update (0 for sortMode, 1 for autoScrollInitialVideoList)
     * @param {Array<{value: string, label: string}>} [options=[]] - Options to render
     * @param {string} [label=''] - Select label (currently unused)
     * @returns {void}
     */
    let renderSelectElement = (variable = 0, options = [], label = '') => {
        // Create select
        const element = document.createElement('select');
        element.className = 'style-scope sort-select sort-margin-right-3px';
        element.onchange = (e) => {
            if (variable === 0) {
                sortMode = e.target.value;
            } else if (variable === 1) {
                autoScrollInitialVideoList = e.target.value;
            }
        };

        // Create options and set initial selection
        options.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.innerText = option.label;

            // Set selected based on current variable value
            if (variable === 0 && option.value === sortMode) {
                optionElement.selected = true;
            } else if (variable === 1 && option.value === autoScrollInitialVideoList) {
                optionElement.selected = true;
            }

            element.appendChild(optionElement);
        });

        // Render select
        document.querySelector('.sort-playlist-select').appendChild(element);
    };

    /**
     * Generate number input element for scroll retry time configuration
     * @param {number} [defaultValue=0] - Default value for the input
     * @param {string} [label=''] - Label text for the input
     * @returns {void}
     */
    let renderNumberElement = (defaultValue = 0, label = '') => {
        // Create div
        const elementDiv = document.createElement('div');
        elementDiv.className = 'sort-playlist-div sort-margin-right-3px';

        // Create label
        const labelElement = document.createElement('span');
        labelElement.className = 'sort-input-label';
        labelElement.innerText = label;
        elementDiv.appendChild(labelElement);

        // Create input
        const element = document.createElement('input');
        element.type = 'number';
        element.value = defaultValue;
        element.min = '100';
        element.step = '100';
        element.className = 'style-scope sort-number-input';
        element.oninput = (e) => { scrollLoopTime = Math.max(100, +(e.target.value)); };

        // Render input
        elementDiv.appendChild(element);
        document.querySelector('div.sort-playlist').appendChild(elementDiv);
    };

    /**
     * Render filter controls (checkbox + min/max duration inputs)
     * Allows users to filter videos by duration before sorting
     * @returns {void}
     */
    let renderFilterControls = () => {
        const filterDiv = document.createElement('div');
        filterDiv.className = 'sort-playlist-div';
        filterDiv.style.marginTop = '8px';
        filterDiv.style.padding = '8px';
        filterDiv.style.borderTop = '1px solid rgba(0,0,0,0.1)';

        // Filter enable checkbox
        const filterCheckboxContainer = document.createElement('label');
        filterCheckboxContainer.className = 'sort-checkbox-container';
        filterCheckboxContainer.style.display = 'block';
        filterCheckboxContainer.style.marginBottom = '8px';

        const filterCheckbox = document.createElement('input');
        filterCheckbox.type = 'checkbox';
        filterCheckbox.className = 'sort-checkbox';
        filterCheckbox.checked = filterEnabled;
        filterCheckbox.onchange = (e) => {
            filterEnabled = e.target.checked;
            filterInputsContainer.style.display = filterEnabled ? 'block' : 'none';
        };

        const filterLabel = document.createElement('span');
        filterLabel.innerText = 'Only include specific lengths';
        filterLabel.style.fontWeight = '600';

        filterCheckboxContainer.appendChild(filterCheckbox);
        filterCheckboxContainer.appendChild(filterLabel);
        filterDiv.appendChild(filterCheckboxContainer);

        // Container for filter inputs (hidden by default)
        const filterInputsContainer = document.createElement('div');
        filterInputsContainer.style.display = filterEnabled ? 'block' : 'none';
        filterInputsContainer.style.marginLeft = '20px';

        // Min duration input
        const minDurationDiv = document.createElement('div');
        minDurationDiv.style.marginBottom = '4px';

        const minLabel = document.createElement('span');
        minLabel.className = 'sort-input-label';
        minLabel.innerText = 'Min duration (minutes): ';
        minLabel.style.fontSize = '12px';

        const minInput = document.createElement('input');
        minInput.type = 'number';
        minInput.value = Math.floor(filterMinDuration / 60);
        minInput.min = '0';
        minInput.step = '1';
        minInput.className = 'style-scope sort-number-input';
        minInput.style.width = '80px';
        minInput.oninput = (e) => { filterMinDuration = Math.max(0, parseInt(e.target.value) || 0) * 60; };

        minDurationDiv.appendChild(minLabel);
        minDurationDiv.appendChild(minInput);
        filterInputsContainer.appendChild(minDurationDiv);

        // Max duration input
        const maxDurationDiv = document.createElement('div');

        const maxLabel = document.createElement('span');
        maxLabel.className = 'sort-input-label';
        maxLabel.innerText = 'Max duration (minutes): ';
        maxLabel.style.fontSize = '12px';

        const maxInput = document.createElement('input');
        maxInput.type = 'number';
        maxInput.value = Math.floor(filterMaxDuration / 60);
        maxInput.min = '0';
        maxInput.step = '1';
        maxInput.className = 'style-scope sort-number-input';
        maxInput.style.width = '80px';
        maxInput.oninput = (e) => { filterMaxDuration = Math.max(0, parseInt(e.target.value) || 600) * 60; };

        maxDurationDiv.appendChild(maxLabel);
        maxDurationDiv.appendChild(maxInput);
        filterInputsContainer.appendChild(maxDurationDiv);

        filterDiv.appendChild(filterInputsContainer);
        document.querySelector('div.sort-playlist').appendChild(filterDiv);
    };

    /**
     * Generate log element with toggle, copy, and scroll controls
     * Creates the main logging console UI
     * @returns {void}
     */
    let renderLogElement = () => {
        // Create container for log and buttons
        const logContainer = document.createElement('div');
        logContainer.style.marginTop = '8px';

        // Create container for log controls (copy button and checkboxes)
        const logControlsRow = document.createElement('div');
        logControlsRow.style.display = logVisible ? 'flex' : 'none';
        logControlsRow.style.gap = '12px';
        logControlsRow.style.alignItems = 'center';
        logControlsRow.style.marginBottom = '4px';

        // Create copy log button
        const copyButton = document.createElement('button');
        copyButton.className = 'style-scope sort-button-wl sort-button-wl-default';
        copyButton.style.fontSize = '11px';
        copyButton.style.padding = '4px 8px';
        copyButton.innerText = 'Copy Log';
        copyButton.onclick = () => {
            const logText = logEntries.length ? logEntries.map(entry => entry.raw).join('\n') : '';
            navigator.clipboard.writeText(logText).then(() => {
                // Temporarily change button text
                const originalText = copyButton.innerText;
                copyButton.innerText = '✓ Copied!';
                setTimeout(() => {
                    copyButton.innerText = originalText;
                }, 2000);
            }).catch(err => {
                logActivity('❌ Failed to copy to clipboard');
                console.error('Copy failed:', err);
            });
        };

        // Create scroll log checkbox container
        const scrollContainer = document.createElement('label');
        scrollContainer.className = 'sort-checkbox-container';

        const scrollCheckbox = document.createElement('input');
        scrollCheckbox.type = 'checkbox';
        scrollCheckbox.className = 'sort-checkbox';
        scrollCheckbox.checked = autoScrollLog;
        scrollCheckbox.onchange = (e) => {
            autoScrollLog = e.target.checked;
            if (autoScrollLog) {
                log.scrollTop = log.scrollHeight;
            }
        };

        const scrollLabel = document.createElement('span');
        scrollLabel.innerText = 'Scroll Log';

        scrollContainer.appendChild(scrollCheckbox);
        scrollContainer.appendChild(scrollLabel);

        // Create verbose checkbox container
        const verboseContainer = document.createElement('label');
        verboseContainer.className = 'sort-checkbox-container';

        const verboseCheckbox = document.createElement('input');
        verboseCheckbox.type = 'checkbox';
        verboseCheckbox.className = 'sort-checkbox';
        verboseCheckbox.checked = verboseMode;
        verboseCheckbox.onchange = (e) => {
            verboseMode = e.target.checked;
            renderLogDisplay(false);
            logActivity(verboseMode ? 'Verbose mode enabled' : 'Verbose mode disabled');
        };

        const verboseLabel = document.createElement('span');
        verboseLabel.innerText = 'Verbose';

        verboseContainer.appendChild(verboseCheckbox);
        verboseContainer.appendChild(verboseLabel);

        // Populate log div
        log.className = 'style-scope sort-log';
        log.textContent = DEFAULT_LOG_MESSAGE;
        log.classList.add('sort-log-empty');
        log.style.display = logVisible ? 'block' : 'none';

        // Add controls to log controls row
        logControlsRow.appendChild(copyButton);
        logControlsRow.appendChild(scrollContainer);
        logControlsRow.appendChild(verboseContainer);

        // Render elements
        logContainer.appendChild(logControlsRow);
        logContainer.appendChild(log);
        document.querySelector('div.sort-playlist').appendChild(logContainer);

        // Store reference to controls row for toggling
        window.logControlsRow = logControlsRow;
    };

    /**
     * Add CSS styling to the page
     * Injects custom styles for the playlist sorter UI
     * @returns {void}
     */
    let addCssStyle = () => {
        if (document.head.querySelector('#sort-playlist-style')) {
            return;
        }
        const element = document.createElement('style');
        element.id = 'sort-playlist-style';
        element.textContent = css;
        document.head.appendChild(element);
    };

    /**
     * Show settings panel modal for configuration management
     * Allows users to configure and save default settings
     * @returns {void}
     */
    let showSettingsPanel = () => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'sort-settings-overlay';

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'sort-settings-modal';

        // Title with close button
        const titleBar = document.createElement('div');
        titleBar.className = 'sort-settings-title';
        titleBar.style.display = 'flex';
        titleBar.style.justifyContent = 'space-between';
        titleBar.style.alignItems = 'center';

        const titleText = document.createElement('span');
        titleText.textContent = '⚙️ Settings';

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '✕';
        closeButton.className = 'sort-settings-close-btn';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = '#aaa';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '0';
        closeButton.style.lineHeight = '1';
        closeButton.style.transition = 'color 0.2s';
        closeButton.onmouseover = () => { closeButton.style.color = '#f1f1f1'; };
        closeButton.onmouseout = () => { closeButton.style.color = '#aaa'; };
        closeButton.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        };

        titleBar.appendChild(titleText);
        titleBar.appendChild(closeButton);
        modal.appendChild(titleBar);

        // Sort Settings Section
        const sortSection = document.createElement('div');
        sortSection.className = 'sort-settings-section';

        const sortTitle = document.createElement('div');
        sortTitle.className = 'sort-settings-section-title';
        sortTitle.textContent = 'Sort Preferences';
        sortSection.appendChild(sortTitle);

        // Sort Mode
        const sortModeRow = document.createElement('div');
        sortModeRow.className = 'sort-settings-row';
        const sortModeLabel = document.createElement('span');
        sortModeLabel.className = 'sort-settings-label';
        sortModeLabel.textContent = 'Default Sort Mode:';
        const sortModeSelect = document.createElement('select');
        sortModeSelect.className = 'sort-select';
        modeAvailable.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            option.selected = sortMode === opt.value;
            sortModeSelect.appendChild(option);
        });
        sortModeRow.appendChild(sortModeLabel);
        sortModeRow.appendChild(sortModeSelect);
        sortSection.appendChild(sortModeRow);

        // Auto Scroll Mode
        const autoScrollRow = document.createElement('div');
        autoScrollRow.className = 'sort-settings-row';
        const autoScrollLabel = document.createElement('span');
        autoScrollLabel.className = 'sort-settings-label';
        autoScrollLabel.textContent = 'Default Auto-Scroll:';
        const autoScrollSelect = document.createElement('select');
        autoScrollSelect.className = 'sort-select';
        autoScrollOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            option.selected = autoScrollInitialVideoList === opt.value;
            autoScrollSelect.appendChild(option);
        });
        autoScrollRow.appendChild(autoScrollLabel);
        autoScrollRow.appendChild(autoScrollSelect);
        sortSection.appendChild(autoScrollRow);

        // Scroll Retry Time
        const scrollTimeRow = document.createElement('div');
        scrollTimeRow.className = 'sort-settings-row';
        const scrollTimeLabel = document.createElement('span');
        scrollTimeLabel.className = 'sort-settings-label';
        scrollTimeLabel.textContent = 'Scroll Retry Time (ms):';
        const scrollTimeInput = document.createElement('input');
        scrollTimeInput.type = 'number';
        scrollTimeInput.className = 'sort-number-input';
        scrollTimeInput.value = scrollLoopTime;
        scrollTimeInput.min = '100';
        scrollTimeInput.step = '100';
        scrollTimeRow.appendChild(scrollTimeLabel);
        scrollTimeRow.appendChild(scrollTimeInput);
        sortSection.appendChild(scrollTimeRow);

        modal.appendChild(sortSection);

        // Filter Settings Section
        const filterSection = document.createElement('div');
        filterSection.className = 'sort-settings-section';

        const filterTitle = document.createElement('div');
        filterTitle.className = 'sort-settings-section-title';
        filterTitle.textContent = 'Filter Preferences';
        filterSection.appendChild(filterTitle);

        // Enable Filter
        const filterEnableRow = document.createElement('div');
        filterEnableRow.className = 'sort-settings-row';
        const filterEnableLabel = document.createElement('span');
        filterEnableLabel.className = 'sort-settings-label';
        filterEnableLabel.textContent = 'Only Include Specific Lengths:';
        const filterEnableCheckbox = document.createElement('input');
        filterEnableCheckbox.type = 'checkbox';
        filterEnableCheckbox.className = 'sort-checkbox';
        filterEnableCheckbox.checked = filterEnabled;
        filterEnableRow.appendChild(filterEnableLabel);
        filterEnableRow.appendChild(filterEnableCheckbox);
        filterSection.appendChild(filterEnableRow);

        // Min Duration
        const minDurationRow = document.createElement('div');
        minDurationRow.className = 'sort-settings-row sort-filter-duration-row';
        minDurationRow.style.marginLeft = '20px';
        minDurationRow.style.display = filterEnabled ? 'flex' : 'none';
        const minLabel = document.createElement('span');
        minLabel.className = 'sort-settings-label';
        minLabel.textContent = 'Min Duration (minutes):';
        const minInput = document.createElement('input');
        minInput.type = 'number';
        minInput.className = 'sort-number-input';
        minInput.value = Math.floor(filterMinDuration / 60);
        minInput.min = '0';
        minInput.step = '1';
        minDurationRow.appendChild(minLabel);
        minDurationRow.appendChild(minInput);
        filterSection.appendChild(minDurationRow);

        // Max Duration
        const maxDurationRow = document.createElement('div');
        maxDurationRow.className = 'sort-settings-row sort-filter-duration-row';
        maxDurationRow.style.marginLeft = '20px';
        maxDurationRow.style.display = filterEnabled ? 'flex' : 'none';
        const maxLabel = document.createElement('span');
        maxLabel.className = 'sort-settings-label';
        maxLabel.textContent = 'Max Duration (minutes):';
        const maxInput = document.createElement('input');
        maxInput.type = 'number';
        maxInput.className = 'sort-number-input';
        maxInput.value = Math.floor(filterMaxDuration / 60);
        maxInput.min = '0';
        maxInput.step = '1';
        maxDurationRow.appendChild(maxLabel);
        maxDurationRow.appendChild(maxInput);
        filterSection.appendChild(maxDurationRow);

        // Add change handler to toggle filter inputs visibility
        filterEnableCheckbox.onchange = (e) => {
            const display = e.target.checked ? 'flex' : 'none';
            minDurationRow.style.display = display;
            maxDurationRow.style.display = display;
        };

        modal.appendChild(filterSection);

        // Other Settings Section
        const otherSection = document.createElement('div');
        otherSection.className = 'sort-settings-section';

        const otherTitle = document.createElement('div');
        otherTitle.className = 'sort-settings-section-title';
        otherTitle.textContent = 'Other Preferences';
        otherSection.appendChild(otherTitle);

        // Mismatch tolerance percent
        const toleranceRow = document.createElement('div');
        toleranceRow.className = 'sort-settings-row';
        const toleranceLabel = document.createElement('span');
        toleranceLabel.className = 'sort-settings-label';
        toleranceLabel.textContent = 'Missing Video Tolerance (%):';
        const toleranceInput = document.createElement('input');
        toleranceInput.type = 'number';
        toleranceInput.className = 'sort-number-input';
        toleranceInput.min = '0';
        toleranceInput.max = '100';
        toleranceInput.step = '1';
        toleranceInput.value = mismatchTolerancePercent;
        toleranceRow.appendChild(toleranceLabel);
        toleranceRow.appendChild(toleranceInput);
        otherSection.appendChild(toleranceRow);

        // Dry Run Mode
        const dryRunRow = document.createElement('div');
        dryRunRow.className = 'sort-settings-row';
        const dryRunLabel = document.createElement('span');
        dryRunLabel.className = 'sort-settings-label';
        dryRunLabel.textContent = 'Enable Dry Run (Preview Before Sort):';
        const dryRunCheckbox = document.createElement('input');
        dryRunCheckbox.type = 'checkbox';
        dryRunCheckbox.className = 'sort-checkbox';
        dryRunCheckbox.checked = dryRunEnabled;
        dryRunRow.appendChild(dryRunLabel);
        dryRunRow.appendChild(dryRunCheckbox);
        otherSection.appendChild(dryRunRow);

        // Log Visible by Default
        const logVisibleRow = document.createElement('div');
        logVisibleRow.className = 'sort-settings-row';
        const logVisibleLabel = document.createElement('span');
        logVisibleLabel.className = 'sort-settings-label';
        logVisibleLabel.textContent = 'Show Log by Default:';
        const logVisibleCheckbox = document.createElement('input');
        logVisibleCheckbox.type = 'checkbox';
        logVisibleCheckbox.className = 'sort-checkbox';
        logVisibleCheckbox.checked = logVisible;
        logVisibleRow.appendChild(logVisibleLabel);
        logVisibleRow.appendChild(logVisibleCheckbox);
        otherSection.appendChild(logVisibleRow);

        modal.appendChild(otherSection);

        // Buttons
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'sort-settings-buttons';

        const saveButton = document.createElement('button');
        saveButton.className = 'sort-button-wl sort-button-wl-default';
        saveButton.textContent = 'Save Settings';
        saveButton.onclick = () => {
            // Update current values
            sortMode = sortModeSelect.value;
            autoScrollInitialVideoList = autoScrollSelect.value;
            scrollLoopTime = parseInt(scrollTimeInput.value);
            mismatchTolerancePercent = Math.min(100, Math.max(0, parseInt(toleranceInput.value) || 0));
            dryRunEnabled = dryRunCheckbox.checked;
            filterEnabled = filterEnableCheckbox.checked;
            filterMinDuration = Math.max(0, parseInt(minInput.value) || 0) * 60;
            filterMaxDuration = Math.max(0, parseInt(maxInput.value) || 600) * 60;
            logVisible = logVisibleCheckbox.checked;

            // Save to localStorage
            saveSettings(getCurrentSettings());

            // Update UI (this will show/hide log based on settings)
            updateUIFromSettings();

            // Log success message (before closing modal so log is visible)
            logActivity('✅ Settings saved successfully');

            // Close modal
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        };

        const cancelButton = document.createElement('button');
        cancelButton.className = 'sort-button-wl sort-button-wl-default';
        cancelButton.style.background = '#888';
        cancelButton.textContent = 'Cancel';
        cancelButton.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        };

        const resetButton = document.createElement('button');
        resetButton.className = 'sort-button-wl sort-button-wl-stop';
        resetButton.textContent = 'Reset to Defaults';
        resetButton.onclick = () => {
            if (confirm('Reset all settings to default values?')) {
                applySettings(DEFAULT_SETTINGS);
                saveSettings(DEFAULT_SETTINGS);
                document.body.removeChild(overlay);
                document.body.removeChild(modal);
                updateUIFromSettings();
                logActivity('🔄 Settings reset to defaults');
            }
        };

        buttonsDiv.appendChild(resetButton);
        buttonsDiv.appendChild(saveButton);
        modal.appendChild(buttonsDiv);

        // Close on overlay click
        overlay.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        };

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    };

    /**
     * Update UI elements to reflect current settings
     * Updates log visibility based on saved settings
     * @returns {void}
     */
    let updateUIFromSettings = () => {
        // Update log visibility based on saved settings
        const toggleButton = document.querySelector('.sort-log-toggle-btn');
        if (toggleButton) {
            toggleButton.innerText = logVisible ? 'Hide Log' : 'Show Log';
        }
        const logControlsContainer = document.querySelector('.sort-log-controls');
        if (logControlsContainer) {
            logControlsContainer.style.display = logVisible ? 'block' : 'none';
        }
        if (log) {
            log.style.display = logVisible ? 'block' : 'none';
        }
    };

    /**
     * Perform a dry run simulation of the sort
     * Shows before/after comparison without actually moving videos
     * @returns {Promise<void>} Resolves when dry run is complete
     */
    let performDryRun = async () => {
        logActivity('🔍 Starting Dry Run Mode...');
        logActivity('📋 Analyzing current playlist order...');

        // Get current videos
        let videoPairs = getPlaylistVideoPairs();

        if (videoPairs.length === 0) {
            logActivity('❌ No videos found for dry run');
            return;
        }

        // Create before/after arrays
        const beforeOrder = [];
        const afterOrder = [];

        videoPairs.forEach((pair, index) => {
            const duration = getVideoDuration(pair.anchor);
            const title = getVideoTitle(pair.item);
            const passes = passesFilter(duration);

            const videoInfo = {
                index: index + 1,
                title: title || 'Unknown Title',
                duration: duration,
                durationFormatted: duration !== null ? formatSeconds(duration) : 'N/A',
                passes: passes
            };

            beforeOrder.push(videoInfo);
        });

        // Sort the after order based on current settings
        const sortedVideos = [...beforeOrder];

        // Separate filtered and non-filtered videos
        const passedVideos = sortedVideos.filter(v => v.passes);
        const filteredVideos = sortedVideos.filter(v => !v.passes);

        // Sort passed videos by duration (and title tiebreaker)
        passedVideos.sort((a, b) => {
            const durationA = a.duration !== null ? a.duration : -1;
            const durationB = b.duration !== null ? b.duration : -1;

            if (sortMode === 'asc') {
                if (durationA === durationB) {
                    return a.title.localeCompare(b.title);
                }
                return durationA - durationB;
            } else {
                if (durationA === durationB) {
                    return a.title.localeCompare(b.title);
                }
                return durationB - durationA;
            }
        });

        // Combine: sorted passed videos + filtered videos at end
        afterOrder.push(...passedVideos, ...filteredVideos);

        // Renumber after order
        afterOrder.forEach((video, index) => {
            video.newIndex = index + 1;
        });

        // Show modal with comparison
        showDryRunComparison(beforeOrder, afterOrder);

        logActivity('✅ Dry run complete - review changes in popup');
    };

    /**
     * Format seconds to readable time string
     * @param {number} seconds - Seconds to format
     * @returns {string} Formatted time string
     */
    let formatSeconds = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        } else {
            return `${minutes}:${String(secs).padStart(2, '0')}`;
        }
    };

    /**
     * Show dry run comparison modal
     * @param {Array} beforeOrder - Original video order
     * @param {Array} afterOrder - Predicted sorted order
     * @returns {void}
     */
    let showDryRunComparison = (beforeOrder, afterOrder) => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'sort-settings-overlay';

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'sort-dry-run-modal';

        // Title
        const title = document.createElement('div');
        title.className = 'sort-dry-run-title';
        title.textContent = '🔍 Dry Run - Sort Preview';
        modal.appendChild(title);

        // Info box
        const info = document.createElement('div');
        info.className = 'sort-dry-run-info';
        info.innerHTML = `
            <strong>Preview Mode:</strong> This shows how your playlist will be sorted without making any changes.<br>
            <strong>Mode:</strong> ${sortMode === 'asc' ? 'Shortest First' : 'Longest First'}<br>
            <strong>Videos:</strong> ${beforeOrder.length} total${filterEnabled ? ` (filter: ${Math.floor(filterMinDuration / 60)}-${Math.floor(filterMaxDuration / 60)} min)` : ''}
        `;
        modal.appendChild(info);

        // Comparison grid
        const comparison = document.createElement('div');
        comparison.className = 'sort-dry-run-comparison';

        // Before column
        const beforeColumn = document.createElement('div');
        beforeColumn.className = 'sort-dry-run-column';
        const beforeTitle = document.createElement('h4');
        beforeTitle.textContent = '📋 Current Order';
        beforeColumn.appendChild(beforeTitle);

        beforeOrder.forEach(video => {
            const videoDiv = document.createElement('div');
            videoDiv.className = 'sort-dry-run-video';
            videoDiv.textContent = `${video.index}. ${video.title.substring(0, 40)}${video.title.length > 40 ? '...' : ''} (${video.durationFormatted})`;
            if (!video.passes) {
                videoDiv.style.opacity = '0.5';
                videoDiv.style.textDecoration = 'line-through';
            }
            beforeColumn.appendChild(videoDiv);
        });

        // After column
        const afterColumn = document.createElement('div');
        afterColumn.className = 'sort-dry-run-column';
        const afterTitle = document.createElement('h4');
        afterTitle.textContent = '✨ After Sort';
        afterColumn.appendChild(afterTitle);

        afterOrder.forEach(video => {
            const videoDiv = document.createElement('div');
            videoDiv.className = 'sort-dry-run-video';
            videoDiv.textContent = `${video.newIndex}. ${video.title.substring(0, 40)}${video.title.length > 40 ? '...' : ''} (${video.durationFormatted})`;
            if (!video.passes) {
                videoDiv.style.opacity = '0.5';
                videoDiv.title = 'Filtered out - will be moved to end';
            }
            // Highlight if position changed
            if (video.index !== video.newIndex) {
                videoDiv.style.borderLeft = '3px solid #3ea6ff';
            }
            afterColumn.appendChild(videoDiv);
        });

        comparison.appendChild(beforeColumn);
        comparison.appendChild(afterColumn);
        modal.appendChild(comparison);

        // Buttons
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'sort-dry-run-buttons';

        const applyButton = document.createElement('button');
        applyButton.className = 'sort-button-wl sort-button-wl-default';
        applyButton.textContent = '✓ Apply Sort';
        applyButton.onclick = async () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
            logActivity('✅ Dry run approved - starting actual sort...');

            // Temporarily disable dry run to perform actual sort
            const wasDryRunEnabled = dryRunEnabled;
            dryRunEnabled = false;
            await activateSort();
            dryRunEnabled = wasDryRunEnabled; // Restore dry run setting
        };

        const cancelButton = document.createElement('button');
        cancelButton.className = 'sort-button-wl sort-button-wl-default';
        cancelButton.style.background = '#888';
        cancelButton.textContent = 'Cancel';
        cancelButton.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
            logActivity('🚫 Dry run cancelled - no changes made');
        };

        buttonsDiv.appendChild(cancelButton);
        buttonsDiv.appendChild(applyButton);
        modal.appendChild(buttonsDiv);

        // Close on overlay click
        overlay.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
            logActivity('🚫 Dry run cancelled - no changes made');
        };

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    };

    /**
     * Analyze playlist and show statistics (total duration, average, min/max, etc.)
     * Loads all videos in the playlist first, then calculates and displays statistics
     * @returns {Promise<void>} Resolves when analysis is complete
     */
    let analyzePlaylist = async () => {
        // Show log if it's hidden
        if (!logVisible) {
            logVisible = true;
            const toggleButton = document.querySelector('.sort-log-toggle-btn');
            if (toggleButton) {
                toggleButton.innerText = 'Hide Log';
            }
            const logControlsContainer = document.querySelector('.sort-log-controls');
            if (logControlsContainer) {
                logControlsContainer.style.display = 'block';
            }
            if (log) {
                log.style.display = 'block';
            }
        }

        clearLog();
        const details = document.querySelector('.sort-playlist-details');
        if (details && !details.open) {
            details.open = true;
        }

        logActivity("📊 Analyzing playlist...");
        logActivity("🔄 Loading all videos in playlist...");

        // Load ALL videos first (same logic as sort)
        let videoPairs = getPlaylistVideoPairs();
        let initialCount = videoPairs.length;
        let scrollRetryCount = 0;
        let maxScrollRetries = 10;
        let noProgressCount = 0;

        // Scroll to load all videos
        while (scrollRetryCount < maxScrollRetries && stopSort === false) {
            let previousCount = playlistState.count;

            logActivity("Loading videos... " + videoPairs.length + " loaded so far", true, true);

            await autoScroll();
            await wait(scrollLoopTime * 2);

            videoPairs = getPlaylistVideoPairs();

            if (previousCount === videoPairs.length) {
                noProgressCount++;
                scrollRetryCount++;

                if (noProgressCount >= 3) {
                    logActivity("✓ All available videos loaded");
                    break;
                }
            } else {
                noProgressCount = 0;
                scrollRetryCount = 0;
                logActivity("📈 Loaded " + (videoPairs.length - previousCount) + " more videos");
            }
        }

        // Get all video pairs after loading
        let allAnchors = videoPairs.map(pair => pair.anchor);

        if (allAnchors.length === 0) {
            logActivity("❌ No videos found to analyze");
            return;
        }

        logActivity("📥 Found " + allAnchors.length + " loaded videos");

        // Extract duration data
        let durations = [];
        let totalSeconds = 0;
        let validVideos = 0;
        let unavailableVideos = 0;

        for (let i = 0; i < allAnchors.length; i++) {
            let thumb = allAnchors[i];
            let timeSpan = thumb.querySelector("#text");

            if (!timeSpan || !timeSpan.innerText.trim()) {
                unavailableVideos++;
                continue;
            }

            let timeDigits = timeSpan.innerText.trim().split(":").reverse();

            // Skip if no valid time
            if (timeDigits.length === 1) {
                unavailableVideos++;
                continue;
            }

            let seconds = parseInt(timeDigits[0]) || 0;
            if (timeDigits[1]) seconds += parseInt(timeDigits[1]) * 60;
            if (timeDigits[2]) seconds += parseInt(timeDigits[2]) * 3600;

            durations.push(seconds);
            totalSeconds += seconds;
            validVideos++;
        }

        if (validVideos === 0) {
            logActivity("❌ No videos with valid durations found");
            return;
        }

        // Calculate statistics
        const avgSeconds = Math.floor(totalSeconds / validVideos);
        const minSeconds = Math.min(...durations);
        const maxSeconds = Math.max(...durations);

        // Format time helper
        const formatTime = (sec) => {
            const hours = Math.floor(sec / 3600);
            const minutes = Math.floor((sec % 3600) / 60);
            const seconds = sec % 60;

            if (hours > 0) {
                return hours + "h " + minutes + "m " + seconds + "s";
            } else if (minutes > 0) {
                return minutes + "m " + seconds + "s";
            } else {
                return seconds + "s";
            }
        };

        const formatTimeShort = (sec) => {
            const hours = Math.floor(sec / 3600);
            const minutes = Math.floor((sec % 3600) / 60);
            const seconds = sec % 60;

            if (hours > 0) {
                return hours + ":" + String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
            } else {
                return minutes + ":" + String(seconds).padStart(2, '0');
            }
        };

        // Display results
        logActivity("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        logActivity("📊 PLAYLIST ANALYSIS");
        logActivity("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        logActivity("📹 Videos analyzed: " + validVideos);
        if (unavailableVideos > 0) {
            logActivity("⚠️  Unavailable/Private: " + unavailableVideos);
        }
        logActivity("");
        logActivity("⏱️  DURATION STATISTICS:");
        logActivity("   Total Duration: " + formatTime(totalSeconds));
        logActivity("   Average Length: " + formatTime(avgSeconds));
        logActivity("   Shortest Video: " + formatTimeShort(minSeconds));
        logActivity("   Longest Video:  " + formatTimeShort(maxSeconds));
        logActivity("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        logActivity("✅ Analysis complete!");
    };

    /**
     * Export playlist data to CSV file
     * Loads all videos and generates a CSV with position, title, duration, and URL
     * @returns {Promise<void>} Resolves when export is complete and file is downloaded
     */
    let exportPlaylist = async () => {
        // Show log if it's hidden
        if (!logVisible) {
            logVisible = true;
            const toggleButton = document.querySelector('.sort-log-toggle-btn');
            if (toggleButton) {
                toggleButton.innerText = 'Hide Log';
            }
            const logControlsContainer = document.querySelector('.sort-log-controls');
            if (logControlsContainer) {
                logControlsContainer.style.display = 'block';
            }
            if (log) {
                log.style.display = 'block';
            }
        }

        clearLog();
        const details = document.querySelector('.sort-playlist-details');
        if (details && !details.open) {
            details.open = true;
        }

        logActivity("📤 Exporting playlist...");
        logActivity("🔄 Loading all videos in playlist...");

        // Load ALL videos first (same logic as sort)
        let videoPairs = getPlaylistVideoPairs();
        let scrollRetryCount = 0;
        let maxScrollRetries = 10;
        let noProgressCount = 0;

        // Scroll to load all videos
        while (scrollRetryCount < maxScrollRetries && stopSort === false) {
            let previousCount = videoPairs.length;

            logActivity("Loading videos... " + videoPairs.length + " loaded so far", true, true);

            await autoScroll();
            await wait(scrollLoopTime * 2);

            videoPairs = getPlaylistVideoPairs();

            if (previousCount === videoPairs.length) {
                noProgressCount++;
                scrollRetryCount++;

                if (noProgressCount >= 3) {
                    logActivity("✓ All available videos loaded");
                    break;
                }
            } else {
                noProgressCount = 0;
                scrollRetryCount = 0;
                logActivity("📈 Loaded " + (videoPairs.length - previousCount) + " more videos");
            }
        }

        if (videoPairs.length === 0) {
            logActivity("❌ No videos found to export");
            return;
        }

        logActivity("📥 Found " + videoPairs.length + " loaded videos");
        logActivity("📝 Generating CSV file...");

        // Build CSV content
        let csvContent = "Position,Title,Duration,URL\n";

        for (let i = 0; i < videoPairs.length; i++) {
            const pair = videoPairs[i];
            const anchor = pair.anchor;
            const item = pair.item;

            // Get video title
            const title = getVideoTitle(item);
            const escapedTitle = '"' + (title || 'Unknown').replace(/"/g, '""') + '"';

            // Get duration
            const durationSeconds = getVideoDuration(anchor);
            let durationFormatted = "N/A";

            if (durationSeconds !== null) {
                const hours = Math.floor(durationSeconds / 3600);
                const minutes = Math.floor((durationSeconds % 3600) / 60);
                const seconds = durationSeconds % 60;

                // Always format as HH:MM:SS for consistency
                durationFormatted = String(hours).padStart(2, '0') + ":" +
                    String(minutes).padStart(2, '0') + ":" +
                    String(seconds).padStart(2, '0');
            }

            // Get clean video URL (remove query parameters after video ID)
            let videoUrl = anchor.href || "";
            if (videoUrl.includes('v=')) {
                const videoId = videoUrl.split('v=')[1].split('&')[0];
                videoUrl = "https://www.youtube.com/watch?v=" + videoId;
            }

            // Build CSV row
            csvContent += (i + 1) + ",";
            csvContent += escapedTitle + ",";
            csvContent += durationFormatted + ",";
            csvContent += videoUrl + "\n";
        }

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        // Generate filename with current date
        const now = new Date();
        const dateStr = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0');
        const playlistId = window.location.search.match(/list=([^&]+)/);
        const filename = 'youtube_playlist_' + (playlistId ? playlistId[1] : 'export') + '_' + dateStr + '.csv';

        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        logActivity("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        logActivity("✅ Export complete!");
        logActivity("📁 File: " + filename);
        logActivity("📊 Exported " + videoPairs.length + " videos");
        logActivity("💾 CSV file downloaded to your Downloads folder");
        logActivity("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    };

    /**
     * Sort videos by duration (and optionally by title as tiebreaker)
     * Applies filtering if enabled and performs drag-and-drop operations
     * @param {Element[]} allAnchors - Array of video anchor elements
     * @param {Element[]} allDragPoints - Array of draggable handle elements
     * @param {Element[]} allItems - Array of video item elements
     * @param {number} expectedCount - Expected number of videos (for verification)
     * @returns {number} Number of videos sorted (position of last sorted video)
     */
    let sortVideos = (allAnchors, allDragPoints, allItems, expectedCount) => {
        let videos = [];
        let sorted = 0;
        let dragged = false;

        // Sometimes after dragging, the page is not fully loaded yet
        // This can be seen by the number of anchors not being a multiple of 100
        if (allDragPoints.length !== expectedCount || allAnchors.length !== expectedCount) {
            logActivity("Playlist is not fully loaded, waiting...");
            return 0;
        }

        for (let j = 0; j < allDragPoints.length; j++) {
            let thumb = allAnchors[j];
            let drag = allDragPoints[j];
            let item = allItems[j];

            const duration = getVideoDuration(thumb);
            const title = getVideoTitle(item);

            // Check if video passes duration filter
            if (filterEnabled && !passesFilter(duration)) {
                // Videos that don't pass filter are pushed to the end
                videos.push({
                    anchor: drag,
                    time: sortMode === "asc" ? 999999999999999999 : -1,
                    title: title,
                    originalIndex: j,
                    filtered: true
                });
                continue;
            }

            let time;
            if (duration === null) {
                // Videos without duration (unavailable/private) go to the end
                time = sortMode === "asc" ? 999999999999999999 : -1;
            } else {
                time = duration;
            }

            videos.push({
                anchor: drag,
                time: time,
                title: title,
                originalIndex: j,
                filtered: false
            });
        }

        // Sort by duration (and optionally title as tiebreaker)
        if (sortMode === "asc") {
            videos.sort((a, b) => {
                if (a.time !== b.time) {
                    return a.time - b.time;
                }
                // If durations are equal and tiebreaker is enabled, sort by title
                if (useTitleTiebreaker && a.title && b.title) {
                    return a.title.localeCompare(b.title);
                }
                return 0;
            });
        } else {
            videos.sort((a, b) => {
                if (a.time !== b.time) {
                    return b.time - a.time;
                }
                // If durations are equal and tiebreaker is enabled, sort by title
                if (useTitleTiebreaker && a.title && b.title) {
                    return a.title.localeCompare(b.title);
                }
                return 0;
            });
        }

        // Calculate total number of moves needed (videos out of place)
        // This is calculated per iteration but we'll use the global counter for display
        let totalMovesNeeded = 0;
        for (let j = 0; j < videos.length; j++) {
            if (videos[j].originalIndex !== j) {
                totalMovesNeeded++;
            }
        }

        for (let j = 0; j < videos.length; j++) {
            let originalIndex = videos[j].originalIndex;

            if (debug) {
                console.log("Loaded: " + videos.length + ". Current: " + j + ". Original: " + originalIndex + ".");
            }

            if (originalIndex !== j) {
                globalMoveCounter++; // Increment global counter for each move

                let elemDrag = videos[j].anchor;
                let elemDrop = null;
                for (let k = 0; k < videos.length; k++) {
                    if (videos[k].originalIndex === j) {
                        elemDrop = videos[k].anchor;
                        break;
                    }
                }

                if (!elemDrop) {
                    continue;
                }

                simulateDrag(elemDrag, elemDrop);
                dragged = true;
            }

            sorted = j;

            if (stopSort || dragged) {
                break;
            }
        }

        if (sorted > 0 && globalMoveCounter > 0) {
            // Calculate remaining moves
            let remainingMoves = globalTotalMoves - globalMoveCounter;
            if (remainingMoves < 0) remainingMoves = 0;
            logActivity("🔄 Moved #" + videos[sorted].originalIndex + " → #" + sorted + " (" + globalMoveCounter + "/" + globalTotalMoves + ")");
        }

        return sorted;
    };

    /**
     * Main sort activation function
     * Handles the complete sort process including:
     * - Loading all videos (or keeping current loaded set)
     * - Verifying playlist state
     * - Iteratively sorting videos by duration
     * - Managing lazy loading prevention
     * - Progress logging and error recovery
     * 
     * Note: There is an inherent limit in how fast you can sort videos due to YouTube's
     * refresh behavior. This limit also applies to manual sorting. Performance degrades
     * with playlist size (approximately +2-4 seconds per 100 videos).
     * 
     * @returns {Promise<void>} Resolves when sort is complete or stopped
     */
    let activateSort = async () => {
        // Check if dry run mode is enabled
        if (dryRunEnabled) {
            await performDryRun();
            return; // Exit early - performDryRun will call activateSort again if user confirms
        }

        // Proceed with actual sort
        clearLog();
        const details = document.querySelector('.sort-playlist-details');
        if (details && !details.open) {
            details.open = true;
        }
        logActivity("🚀 Starting sort process...");
        logActivity("ℹ️  Script version: " + SCRIPT_VERSION, true, true);

        // Try multiple selectors to get video count
        let reportedVideoCountElement = null;
        let reportedVideoCount = 0;

        // Try NEW YouTube architecture first (yt-content-metadata-view-model)
        const metadataRows = document.querySelectorAll('.yt-content-metadata-view-model__metadata-row');
        for (const row of metadataRows) {
            const spans = row.querySelectorAll('span.yt-core-attributed-string');
            for (const span of spans) {
                if (span.textContent.includes('video')) {
                    reportedVideoCountElement = span;
                    break;
                }
            }
            if (reportedVideoCountElement) break;
        }

        // Fallback to old selectors
        if (!reportedVideoCountElement) {
            reportedVideoCountElement = document.querySelector("ytd-playlist-byline-renderer .metadata-stats .byline-item.style-scope.ytd-playlist-byline-renderer span");
        }

        if (!reportedVideoCountElement) {
            reportedVideoCountElement = document.querySelector(".metadata-stats span.yt-formatted-string:first-of-type");
        }

        // Try to parse the video count
        if (reportedVideoCountElement) {
            reportedVideoCount = parseInt(reportedVideoCountElement.innerText.replace(/[^0-9]/g, ''));
        }

        // If we still don't have a count, we'll estimate it by loading all videos
        if (isNaN(reportedVideoCount) || reportedVideoCount === 0) {
            logActivity("⚠️  Could not find video count in page. Will load and count videos...");
            reportedVideoCount = -1; // Flag to indicate we need to count manually
        }

        logActivity("📊 Detected " + reportedVideoCount + " videos in playlist");
        logActivity("🔧 Sort mode: " + (sortMode === 'asc' ? 'Shortest First' : 'Longest First'));
        logActivity("📜 Auto-scroll: " + (autoScrollInitialVideoList === 'true' ? 'Sort all videos' : 'Sort only loaded'));

        if (filterEnabled) {
            const formatTime = (sec) => {
                const hours = Math.floor(sec / 3600);
                const minutes = Math.floor((sec % 3600) / 60);
                if (hours > 0) return hours + "h " + minutes + "m";
                if (minutes > 0) return minutes + "m";
                return "0m";
            };
            logActivity("🎯 Filter: " + formatTime(filterMinDuration) + " - " + formatTime(filterMaxDuration));
        }

        let playlistState = collectPlaylistState();
        let videoPairs = playlistState.videoPairs;
        let allDragPoints = playlistState.dragPoints;
        let allAnchors = playlistState.anchors;
        let allItems = playlistState.items;
        let sortedCount = 0;
        let initialVideoCount = playlistState.count;
        let highestLoadedCount = initialVideoCount;
        logActivity("📥 Currently loaded: " + initialVideoCount + " videos");

        let scrollRetryCount = 0;
        let maxScrollRetries = 10; // Maximum number of scroll retries
        let noProgressCount = 0; // Track consecutive attempts with no progress
        stopSort = false;

        // Always check for new content first (whether "Sort all" or "Sort only loaded")
        // Keep scrolling until no new videos load for 3 consecutive attempts
        while (
            document.URL.includes("playlist?list=") &&
            stopSort === false &&
            scrollRetryCount < maxScrollRetries
        ) {

            let previousCount = videoPairs.length;

            if (autoScrollInitialVideoList === 'true') {
                logActivity("Loading more videos - " + allDragPoints.length + " / " + reportedVideoCount + " videos loaded", true, true);

                if (initialVideoCount > 600) {
                    logActivity("⚠️  Sorting may take extremely long time/is likely to bug out");
                } else if (initialVideoCount > 300) {
                    logActivity("⚠️  Number of videos loaded is high, sorting may take a long time");
                }

                await autoScroll();
                // Wait for YouTube to load more content
                await wait(scrollLoopTime * 2);
            } else {
                logActivity("Checking for videos - " + allDragPoints.length + " loaded (will sort when stable)", true, true);
                // Give YouTube a moment to stabilise without loading more content
                await wait(scrollLoopTime);
            }

            playlistState = collectPlaylistState();
            videoPairs = playlistState.videoPairs;
            allDragPoints = playlistState.dragPoints;
            allAnchors = playlistState.anchors;
            allItems = playlistState.items;
            initialVideoCount = playlistState.count;
            if (initialVideoCount > highestLoadedCount) {
                highestLoadedCount = initialVideoCount;
            }

            // Check if we're making progress
            if (previousCount === initialVideoCount) {
                noProgressCount++;
                scrollRetryCount++;
                logActivity("No new videos loaded. Attempt " + noProgressCount + "/3", true, true);

                // If no progress after 3 attempts, we're done loading
                if (noProgressCount >= 3) {
                    logActivity("✓ No new content detected. Ready to sort!");
                    break;
                }
            } else {
                noProgressCount = 0; // Reset counter if we're making progress
                scrollRetryCount = 0;
                logActivity("📈 Progress: Loaded " + (initialVideoCount - previousCount) + " new videos");
            }

            // For "Sort all" mode, check if we've reached the target
            if (autoScrollInitialVideoList === 'true') {
                // If we're close to the target (within 10 videos), give it one more try
                if (((reportedVideoCount - initialVideoCount) <= 10) && noProgressCount < 2) {
                    logActivity("Almost there! " + (reportedVideoCount - initialVideoCount) + " videos remaining...", true, true);
                    continue;
                }

                // If count matches, we're done!
                if (reportedVideoCount === initialVideoCount) {
                    logActivity("🎉 All " + reportedVideoCount + " videos loaded successfully!");
                    break;
                }
            }

            // For "Sort only loaded" mode, stop after we confirm no new content
            if (autoScrollInitialVideoList === 'false' && noProgressCount >= 3) {
                break;
            }
        }

        if (scrollRetryCount >= maxScrollRetries) {
            logActivity("⚠️  Max retry attempts reached. Proceeding with " + initialVideoCount + " videos.");
        }

        logActivity("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        logActivity(initialVideoCount + " videos loaded. Starting sort...");
        if (scrollRetryCount > 5) logActivity("ℹ️  Note: Video count mismatch. This may be due to unavailable/private videos.");

        // For large playlists, we need to ensure all videos stay loaded
        logActivity("Preparing playlist for sorting...");

        // Calculate total moves needed for progress tracking
        // This gives us the initial count of videos that need to be moved
        const calculateTotalMoves = (anchors, items) => {
            let videos = [];
            for (let i = 0; i < anchors.length; i++) {
                const duration = getVideoDuration(anchors[i]);
                const title = getVideoTitle(items[i]);

                let time;
                if (filterEnabled && !passesFilter(duration)) {
                    time = sortMode === "asc" ? 999999999999999999 : -1;
                } else if (duration === null) {
                    time = sortMode === "asc" ? 999999999999999999 : -1;
                } else {
                    time = duration;
                }

                videos.push({ time, title, originalIndex: i });
            }

            // Sort to determine final order
            if (sortMode === "asc") {
                videos.sort((a, b) => {
                    if (a.time !== b.time) return a.time - b.time;
                    if (useTitleTiebreaker && a.title && b.title) {
                        return a.title.localeCompare(b.title);
                    }
                    return 0;
                });
            } else {
                videos.sort((a, b) => {
                    if (a.time !== b.time) return b.time - a.time;
                    if (useTitleTiebreaker && a.title && b.title) {
                        return a.title.localeCompare(b.title);
                    }
                    return 0;
                });
            }

            // Count videos that need to move
            let totalMoves = 0;
            for (let i = 0; i < videos.length; i++) {
                if (videos[i].originalIndex !== i) {
                    totalMoves++;
                }
            }
            return totalMoves;
        };

        // Initialize global move counters
        globalMoveCounter = 0;
        globalTotalMoves = calculateTotalMoves(allAnchors, allItems);
        if (globalTotalMoves > 0) {
            logActivity("📊 Total moves needed: " + globalTotalMoves);
        }

        scrollRetryCount = 0;
        let reloadFailures = 0; // Track consecutive reload failures
        let maxReloadFailures = 3; // Max times we can fail to reload before giving up

        while (sortedCount < initialVideoCount && stopSort === false) {
            // CRITICAL: Re-load entire playlist before each sort iteration to prevent lazy unloading
            logActivity("⚙️  Ensuring all videos are loaded before sort iteration...", true, true);

            if (autoScrollInitialVideoList === 'true') {
                const targetCount = Math.max(highestLoadedCount, initialVideoCount);
                const reloadResult = await ensureFullPlaylistLoaded(targetCount);

                playlistState = reloadResult.state;
                videoPairs = playlistState.videoPairs;
                allDragPoints = playlistState.dragPoints;
                allAnchors = playlistState.anchors;
                allItems = playlistState.items;
                const loadedCount = playlistState.count;

                if (!reloadResult.withinTolerance) {
                    reloadFailures++;
                    logActivity("⚠️  Video count mismatch! Expected ≥ " + targetCount + ", got " + reloadResult.bestCount, true, true);

                    if (reloadFailures >= maxReloadFailures) {
                        logActivity("ℹ️  Switching to adaptive partial sort to keep progress.");
                        logActivity("   Auto-scroll temporarily disabled for this run.");
                        logActivity("   Tip: Increase 'Scroll Retry Time' in settings to retry full loads.");
                        autoScrollInitialVideoList = 'false';
                        initialVideoCount = reloadResult.bestCount;
                        highestLoadedCount = reloadResult.bestCount;
                        if (initialVideoCount === 0) {
                            logActivity("❌ No videos remain loaded. Stopping sort.");
                            return;
                        }
                        if (sortedCount >= initialVideoCount) {
                            sortedCount = Math.max(0, initialVideoCount - 1);
                        }
                        globalTotalMoves = calculateTotalMoves(allAnchors, allItems);
                        reloadFailures = 0;
                    } else {
                        logActivity("Re-loading playlist (retry " + reloadFailures + "/" + maxReloadFailures + ")...", true, true);
                        await wait(Math.min(scrollLoopTime * 2, 2000));
                        continue;
                    }
                } else {
                    reloadFailures = 0;
                    if (loadedCount < targetCount && mismatchTolerancePercent > 0) {
                        if (mismatchTolerancePercent >= 100) {
                            logActivity("⚠️  Proceeding without mismatch enforcement (tolerance disabled).", true, true);
                        } else {
                            const missing = targetCount - loadedCount;
                            logActivity("⚠️  Proceeding with " + loadedCount + " videos (missing " + missing + " within " + mismatchTolerancePercent + "% tolerance).", true, true);
                        }
                    }

                    if (loadedCount > highestLoadedCount) {
                        logActivity("📈 Loaded " + (loadedCount - highestLoadedCount) + " additional videos during reload", true, true);
                    }

                    highestLoadedCount = loadedCount;

                    if (loadedCount !== initialVideoCount) {
                        initialVideoCount = loadedCount;
                        if (sortedCount >= initialVideoCount) {
                            sortedCount = Math.max(0, initialVideoCount - 1);
                        }
                        globalTotalMoves = calculateTotalMoves(allAnchors, allItems);
                    }

                    logActivity("✓ All " + initialVideoCount + " videos confirmed loaded", true, true);
                }
            } else {
                await wait(scrollLoopTime / 2);
                playlistState = collectPlaylistState();
                videoPairs = playlistState.videoPairs;
                allDragPoints = playlistState.dragPoints;
                allAnchors = playlistState.anchors;
                allItems = playlistState.items;
                const loadedCount = playlistState.count;

                if (loadedCount !== initialVideoCount) {
                    logActivity("ℹ️  Loaded video count changed from " + initialVideoCount + " to " + loadedCount + ". Using current loaded set.", true, true);
                    initialVideoCount = loadedCount;
                    if (sortedCount >= initialVideoCount) {
                        sortedCount = Math.max(0, initialVideoCount - 1);
                    }
                    globalTotalMoves = calculateTotalMoves(allAnchors, allItems);
                }

                if (initialVideoCount === 0) {
                    logActivity("❌ No videos remain loaded. Stopping sort.");
                    return;
                }

                reloadFailures = 0;
                logActivity("✓ Using currently loaded " + initialVideoCount + " videos", true, true);
            }

            // Position viewport near current sort position
            let viewportTarget = Math.max(0, Math.min(sortedCount, initialVideoCount - 1));
            keepVideoInView(viewportTarget, allAnchors);
            await wait(scrollLoopTime / 2);

            logActivity("Running sort iteration on position " + sortedCount + "...", true, true);
            sortedCount = Number(sortVideos(allAnchors, allDragPoints, allItems, initialVideoCount) + 1);

            // After each sort operation, give YouTube time to process
            await wait(scrollLoopTime * 3);
        }

        if (stopSort === true) {
            logActivity("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            logActivity("⛔ Sort cancelled by user.");
            stopSort = false;
        } else {
            // Scroll to top to stabilize the view after sorting
            if (document.scrollingElement) {
                document.scrollingElement.scrollTop = 0;
            }

            logActivity("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            logActivity("✅ Sort complete! Videos sorted: " + sortedCount);
            logActivity("🎉 Playlist is now sorted by duration!");
            logActivity("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            logActivity("⚠️  WARNING: Do NOT switch back to any of YouTube's");
            logActivity("   automatic sorting methods (Date added, Most popular, etc.)");
            logActivity("   or it will break your custom sort!");
            logActivity("   Keep it on 'Manual' to preserve your duration sort.");
        }
    };

    /**
     * Initialization wrapper for all on-screen elements
     * Sets up the UI, buttons, and event listeners for the playlist sorter
     * Handles both NEW and OLD YouTube architectures
     * @returns {void}
     */
    let init = () => {
        // Wait for either NEW or OLD architecture to load
        const waitForPlaylist = () => {
            const newArch = document.querySelector(NEW_PAGE_HEADER_SELECTOR);
            const oldArch = document.querySelector(PLAYLIST_HEADER_SELECTOR);

            if (newArch || oldArch) {
                if (!renderContainerElement()) {
                    return;
                }
                addCssStyle();

                // Apply saved settings to UI
                applySettings(savedSettings);

                // Create button container
                const buttonContainer = document.querySelector('.sort-playlist-button');

                // Main action buttons row (50% width each)
                const mainButtonsRow = document.createElement('div');
                mainButtonsRow.style.display = 'flex';
                mainButtonsRow.style.gap = '8px';
                mainButtonsRow.style.marginBottom = '12px';

                const sortButton = document.createElement('button');
                sortButton.className = 'style-scope sort-button-wl sort-button-wl-default';
                sortButton.style.flex = '1';
                sortButton.style.fontWeight = '600';
                sortButton.style.padding = '9px 16px';
                sortButton.innerText = '▶ Sort Videos';
                sortButton.onclick = async () => { await activateSort(); };

                const stopButton = document.createElement('button');
                stopButton.className = 'style-scope sort-button-wl sort-button-wl-stop';
                stopButton.style.flex = '1';
                stopButton.style.fontWeight = '600';
                stopButton.style.padding = '9px 16px';
                stopButton.innerText = '🛑 Stop Sort';
                stopButton.onclick = () => { stopSort = true; };

                mainButtonsRow.appendChild(sortButton);
                mainButtonsRow.appendChild(stopButton);
                buttonContainer.appendChild(mainButtonsRow);

                // Small utility buttons row
                const utilityButtonsRow = document.createElement('div');
                utilityButtonsRow.style.display = 'flex';
                utilityButtonsRow.style.gap = '8px';

                // Create Stats button
                const statsButton = document.createElement('button');
                statsButton.className = 'style-scope sort-button-wl sort-button-wl-default';
                statsButton.style.fontSize = '11px';
                statsButton.style.padding = '4px 8px';
                statsButton.innerText = '📊 Stats';
                statsButton.onclick = async () => { await analyzePlaylist(); };

                // Create Export button
                const exportButton = document.createElement('button');
                exportButton.className = 'style-scope sort-button-wl sort-button-wl-default';
                exportButton.style.fontSize = '11px';
                exportButton.style.padding = '4px 8px';
                exportButton.innerText = '📥 Export';
                exportButton.onclick = async () => { await exportPlaylist(); };

                // Create Settings button
                const settingsButton = document.createElement('button');
                settingsButton.className = 'style-scope sort-button-wl sort-button-wl-default';
                settingsButton.style.fontSize = '11px';
                settingsButton.style.padding = '4px 8px';
                settingsButton.innerText = '⚙️ Settings';
                settingsButton.title = 'Configure default settings';
                settingsButton.onclick = () => { showSettingsPanel(); };

                // Create Show Log button
                const showLogButton = document.createElement('button');
                showLogButton.className = 'style-scope sort-button-wl sort-button-wl-default sort-log-toggle-btn';
                showLogButton.style.fontSize = '11px';
                showLogButton.style.padding = '4px 8px';
                showLogButton.innerText = logVisible ? 'Hide Log' : 'Show Log';
                showLogButton.onclick = () => {
                    logVisible = !logVisible;
                    showLogButton.innerText = logVisible ? 'Hide Log' : 'Show Log';
                    if (window.logControlsRow) {
                        window.logControlsRow.style.display = logVisible ? 'flex' : 'none';
                    }
                    log.style.display = logVisible ? 'block' : 'none';
                };

                utilityButtonsRow.appendChild(statsButton);
                utilityButtonsRow.appendChild(exportButton);
                utilityButtonsRow.appendChild(settingsButton);
                utilityButtonsRow.appendChild(showLogButton);
                buttonContainer.appendChild(utilityButtonsRow);

                // Only render log element (all settings now in Settings panel)
                renderLogElement();

                // Apply saved settings to UI (ensures log visibility matches saved preference)
                updateUIFromSettings();
            }
        };

        // Try immediate initialization
        waitForPlaylist();

        // Also set up observer for dynamic loading
        onElementReady(NEW_PAGE_HEADER_SELECTOR, false, waitForPlaylist);
        onElementReady(PLAYLIST_HEADER_SELECTOR, false, waitForPlaylist);
    };

    /**
     * Initialise script - IIFE
     */
    (() => {
        init();
        if (window.navigation && typeof window.navigation.addEventListener === 'function') {
            window.navigation.addEventListener('navigate', navigateEvent => {
                const url = new URL(navigateEvent.destination.url);
                if (url.pathname.includes('playlist?')) {
                    init();
                }
            });
        }
    })();

})(); // Close the main IIFE wrapper