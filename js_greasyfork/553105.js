// ==UserScript==
// @name         Twitch AWA Auto Channel Switcher
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically switches between AWA live channels with X2 priority system, dynamic timing and Alienware plugin auto-load
// @author       MarvashMagalli
// @match        https://www.twitch.tv/*
// @exclude      https://www.twitch.tv/team/*
// @exclude      https://www.twitch.tv/directory/*
// @exclude      https://www.twitch.tv/popout/*
// @exclude      https://www.twitch.tv/videos/*
// @exclude      https://www.twitch.tv/settings/*
// @exclude      https://www.twitch.tv/messages/*
// @exclude      https://www.twitch.tv/wallet/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553105/Twitch%20AWA%20Auto%20Channel%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/553105/Twitch%20AWA%20Auto%20Channel%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🎮 Twitch Auto Switcher: Script started!');

    // TWO-TIER SYSTEM CONFIGURATION
    const TIER_X2 = [  // Tier 1 - X2, Higher Priority
        'alienware', 'sypherpk', 'layria', 'MoonlitCharlie', 'dikymo',
        'bifflewiffletv', 'brittnaynay33', 'damienhaas', 'EllyEN', 'erikaishii',
        'liddles', 'fooya', 'henwy', 'jess', 'Mactics', 'matthewsantoro',
        'maudegarrett', 'nicovald', 'omgchad', 'pirategray', 'redinfamy',
        'rogersbase', 'runjdrun', 'notsaige', 'sailorsnubs', 'sigils', 'ascender',
        'thegeekentry', 'TrishaHershberger', 'kelsi', 'lovinurstyle', 'theblackhokage',
        'itsizziman', '3llebelle', 'Symfuhny', 'kesslive', 'DJUnreal',
        'demshenaniganss', 'AmethystLady', 'limitlessmeta', 'cuttingcharm', 'wickerrman',
        'yun0gaming', 'blainethepaintv', 'takkundr', 'NinjaPullsGaming', 'avrondoodles',
        'blbeel', 'hazeleyedchic', 'a1phachino', 'brydraa', 'californiagurl',
        'whateverbri', 'everlynix', 'pokey_star', 'witchmob', 'narianazone', 'liz_xp',
        'NothingButSkillz', 'no_lollygaggin'
    ];

    const TIER_PARTNERS = [  // Tier 2 - Partners, Lower Priority
        'DatModz', 'Lourlo', 'RedBeard', 'SirhcEz', 'Pobelter',
        'Alixxa', 'ludwig', 'Ohmwrecker', 'Rogue', 'icecoldbrad',
        'kateebear', 'Squeex', 'Eiya', 'Kalamazi'
    ];

    // Combine for full whitelist (X2 first, then Partners)
    const CHANNEL_WHITELIST = [...TIER_X2, ...TIER_PARTNERS];

    // DYNAMIC TIMING CONFIGURATION
    const TIMING_CONFIG = {
        // Base intervals
        offlineCheck: 60000,        // 60 seconds - when offline or not in WL
        partnerCheck: 120000,       // 120 seconds - when watching partner stream (X2 upgrade checks)
        partnerStatusCheck: 30000,  // NEW: 30 seconds - partner stream status monitoring
        X2Check: 0,               // 0 seconds - no periodic checks for X2
        noStreamsFoundDelay: 300000, // 300 seconds (5 minutes) - when no live streams found

        // Other timing
        initialLoadDelay: 5000,     // 5 seconds after page load
        softNavCheckDelay: 2000,    // 2 seconds after soft navigation
        sequentialCheckDelay: 500,  // 500ms between sequential checks
        offlineDetectionDelay: 30000, // 30 seconds to confirm offline status

        // Plugin loading timing
        pluginLoadDelay: 8000,      // 8 seconds after page load
        pluginCheckInterval: 60000, // 60 seconds between checks

        debug: false
    };

    // State management
    const state = {
        isEnabled: GM_getValue('autoSwitcherEnabled', false),
        isChecking: false,
        currentLiveChannels: {
            X2: [],
            partners: []
        },
        pageLoadTime: Date.now(),
        checkIntervalId: null,
        partnerStatusIntervalId: null, // NEW: Separate interval for partner status checks
        hasInitialCheck: false,
        isAutoSwitched: GM_getValue('lastAutoSwitch', false),
        lastChannel: null,
        softNavObserver: null,
        sidebarObserver: null,
        lastCheckTime: null,
        currentTier: GM_getValue('currentTier', null),
        currentStreamer: GM_getValue('currentStreamer', null),
        sequentialCheckInProgress: false,
        currentState: 'unknown', // 'offline', 'partner', 'X2', 'not_in_wl'
        offlineDetectorInterval: null,
        lastStateChange: Date.now(),
        pluginLoadIntervalId: null,
        isAutoLoadEnabled: GM_getValue('autoLoadPlugin', true),
        noStreamsFound: false,
        noStreamsFoundTimeout: null,
        lastX2UpgradeCheck: null // NEW: Track last X2 upgrade check time
    };

    // Add custom styles
    const css = `
        .auto-switcher-ui {
            position: fixed;
            top: 80px;
            left: 60px;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #6441a5;
            border-radius: 8px;
            padding: 15px;
            color: white;
            font-family: 'Inter', sans-serif;
            min-width: 280px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
        }

        .auto-switcher-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #6441a5;
        }

        .auto-switcher-title {
            font-weight: bold;
            font-size: 14px;
            color: #bf94ff;
        }

        .auto-switcher-status {
            display: flex;
            align-items: center;
            font-size: 12px;
            margin-bottom: 10px;
        }

        .status-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
            transition: all 0.3s ease;
        }

        .status-enabled {
            background: #00ff00;
            box-shadow: 0 0 8px #00ff00;
        }

        .status-disabled {
            background: #ff4444;
            box-shadow: 0 0 8px #ff4444;
        }

        .auto-switcher-btn {
            background: #6441a5;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            margin: 2px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
            flex: 1;
        }

        .auto-switcher-btn:hover {
            background: #7d5bbe;
            transform: translateY(-1px);
        }

        .auto-switcher-btn:active {
            background: #52308c;
            transform: translateY(0);
        }

        .auto-switcher-btn-danger {
            background: #ff4444;
        }

        .auto-switcher-btn-danger:hover {
            background: #ff6666;
        }

        .auto-switcher-btn-success {
            background: #00aa00;
        }

        .auto-switcher-btn-success:hover {
            background: #00cc00;
        }

        .tier-indicator {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 3px;
            margin-left: 5px;
            font-weight: bold;
        }

        .tier-X2 {
            background: #ffaa00;
            color: black;
        }

        .tier-partners {
            background: #6441a5;
            color: white;
        }

        .channel-list {
            max-height: 150px;
            overflow-y: auto;
            margin: 10px 0;
            font-size: 11px;
            background: rgba(255,255,255,0.05);
            border-radius: 4px;
            padding: 8px;
        }

        .channel-item {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .channel-item:last-child {
            border-bottom: none;
        }

        .channel-status {
            font-weight: bold;
            font-size: 10px;
        }

        .channel-live {
            color: #00ff00;
        }

        .channel-offline {
            color: #ff4444;
        }

        .channel-checking {
            color: #ffff00;
        }

        .buttons-row {
            display: flex;
            gap: 5px;
            margin: 8px 0;
        }

        .last-check {
            font-size: 10px;
            color: #888;
            text-align: center;
            margin-top: 5px;
        }

        .next-check {
            font-size: 9px;
            color: #666;
            text-align: center;
            margin-top: 2px;
        }

        .current-stream {
            background: rgba(100, 65, 165, 0.3);
            border-left: 3px solid #bf94ff;
            padding-left: 5px;
        }

        .status-message {
            font-size: 10px;
            color: #bf94ff;
            text-align: center;
            margin: 5px 0;
            min-height: 14px;
        }

        .logic-debug {
            font-size: 9px;
            color: #666;
            margin-top: 5px;
            line-height: 1.3;
            background: rgba(255,255,255,0.05);
            padding: 5px;
            border-radius: 3px;
        }

        .state-indicator {
            font-size: 10px;
            color: #ffaa00;
            text-align: center;
            margin: 3px 0;
            font-weight: bold;
        }

        .timing-info {
            font-size: 9px;
            color: #aaa;
            text-align: center;
            margin: 2px 0;
        }

        .soft-nav-notification {
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: #ffaa00;
            color: black;
            padding: 8px 16px;
            border-radius: 5px;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }

        .timing-debug {
            font-size: 8px;
            color: #555;
            text-align: center;
            margin-top: 3px;
        }

        .tier-stats {
            font-size: 9px;
            color: #aaa;
            text-align: center;
            margin: 5px 0;
        }

        .sequential-status {
            font-size: 9px;
            color: #ffaa00;
            text-align: center;
            margin: 3px 0;
            font-style: italic;
        }

        .plugin-status {
            font-size: 10px;
            margin: 5px 0;
            text-align: center;
        }

        .no-streams-mode {
            color: #ff6666;
            font-weight: bold;
        }

        .partner-status-indicator {
            font-size: 9px;
            color: #bf94ff;
            text-align: center;
            margin: 2px 0;
            font-style: italic;
        }
    `;

    // Add styles to page
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    console.log('🎮 Styles added');

    function log(...args) {
        if (TIMING_CONFIG.debug) {
            console.log('[Twitch Auto Switcher]', ...args);
        }
    }

    // Helper function for case-insensitive comparison
    function equalsIgnoreCase(str1, str2) {
        return str1 && str2 && str1.toLowerCase() === str2.toLowerCase();
    }

    // Extract current channel from URL
    function getCurrentChannel() {
        const path = window.location.pathname.split('/').filter(Boolean);
        const channel = path[0] ? path[0].toLowerCase() : null;
        return channel;
    }

    // Determine current state based on channel and live status
    function determineCurrentState() {
        const currentChannel = getCurrentChannel();

        if (!currentChannel) {
            return 'unknown';
        }

        // Check if in whitelist
        const inWhitelist = CHANNEL_WHITELIST.some(channel =>
            equalsIgnoreCase(channel, currentChannel)
        );

        if (!inWhitelist) {
            return 'not_in_wl';
        }

        // Check tier
        const tier = getChannelTier(currentChannel);

        // If we're on a X2 channel and the page loaded successfully, assume it's live initially
        // This prevents the "OFFLINE" state when we clearly have a stream loaded
        if (tier === 'X2') {
            // If we're actually watching a X2 stream, it's very likely live
            // We'll verify this more thoroughly in the actual checks, but for UI purposes assume live
            log(`✅ Assuming X2 stream ${currentChannel} is live (page loaded successfully)`);
            return 'X2';
        }

        // For partners, use the same logic
        if (tier === 'partners') {
            log(`✅ Assuming Partner stream ${currentChannel} is live (page loaded successfully)`);
            return 'partner';
        }

        // Fallback to page analysis only for unknown cases
        const isLive = isChannelLiveFromPage();
        if (!isLive) {
            return 'offline';
        }

        return tier === 'X2' ? 'X2' : 'partner';
    }

    // Check if current channel is live by analyzing page content
    function isChannelLiveFromPage() {
        // Method 1: Check for live indicators in the page
        const liveIndicators = [
            '[data-a-target="player-overlay-player-count"]', // Viewer count
            '[data-a-target="live-channel-stream-information"]', // Live info
            '.live-indicator', // Live indicator
            '[data-test-selector="stream-info-card-component"]' // Stream info
        ];

        for (const selector of liveIndicators) {
            if (document.querySelector(selector)) {
                log(`✅ Live indicator found: ${selector}`);
                return true;
            }
        }

        // Method 2: Check for offline indicators
        const offlineIndicators = [
            '[data-a-target="channel-not-live-placeholder"]', // Offline placeholder
            '.offline' // Offline class
        ];

        for (const selector of offlineIndicators) {
            if (document.querySelector(selector)) {
                log(`❌ Offline indicator found: ${selector}`);
                return false;
            }
        }

        // Method 3: Check for video player state
        const video = document.querySelector('video');
        if (video && !video.paused && video.currentTime > 0) {
            log('✅ Video is playing');
            return true;
        }

        // Method 4: Check URL for video popout (usually means live)
        if (window.location.pathname.includes('/popout/')) {
            log('✅ In popout mode - assuming live');
            return true;
        }

        log('❓ Could not determine live status from page content');
        return false; // Default to offline if unsure
    }

    // Get current check interval based on state
    function getCurrentCheckInterval() {
        if (state.noStreamsFound) {
            return TIMING_CONFIG.noStreamsFoundDelay; // 5 minutes when no streams found
        }

        switch (state.currentState) {
            case 'offline':
            case 'not_in_wl':
                return TIMING_CONFIG.offlineCheck; // 60s - looking for ANY stream
            case 'partner':
                return TIMING_CONFIG.partnerCheck; // 120s - looking for X2 upgrade
            case 'X2':
                return TIMING_CONFIG.offlineDetectionDelay; // 30s - checking current stream only
            default:
                return TIMING_CONFIG.offlineCheck;
        }
    }

    // Get state display name
    function getStateDisplayName(state) {
        const names = {
            'offline': '🔴 OFFLINE',
            'not_in_wl': '🚫 NOT IN WL',
            'partner': '🟣 PARTNER',
            'X2': '🟠 X2',
            'unknown': '❓ UNKNOWN'
        };
        return names[state] || state;
    }

    // NEW: Update partner status display
    function updatePartnerStatusDisplay() {
        const partnerStatusElement = document.getElementById('partnerStatusInfo');
        if (!partnerStatusElement) return;

        const now = Date.now();
        const timeSinceLastX2Check = state.lastX2UpgradeCheck ?
            Math.round((now - state.lastX2UpgradeCheck) / 1000) : 'Never';
        const nextX2Check = state.lastX2UpgradeCheck ?
            Math.max(0, 120 - timeSinceLastX2Check) : 120;

        partnerStatusElement.innerHTML = `
            Status checks: Every 30s<br>
            X2 upgrade: ${nextX2Check}s
        `;
    }

    // Update timing display with state information
    function updateTimingDisplay() {
        const timingElement = document.getElementById('timingDebug');
        const stateElement = document.getElementById('currentState');
        const timingInfoElement = document.getElementById('timingInfo');

        if (!timingElement) return;

        const now = Date.now();
        const timeSinceLastCheck = state.lastCheckTime ? Math.round((now - state.lastCheckTime) / 1000) : 'Never';
        const currentInterval = getCurrentCheckInterval();
        const nextCheckIn = state.checkIntervalId && currentInterval > 0 ?
            Math.round((state.lastCheckTime + currentInterval - now) / 1000) : 'N/A';

        if (timingElement) {
            if (state.noStreamsFound) {
                timingElement.innerHTML = `<span class="no-streams-mode">No streams found - waiting 5min</span>`;
            } else {
                timingElement.innerHTML = `Last: ${timeSinceLastCheck}s ago | Next: ${nextCheckIn}s`;
            }
        }

        if (stateElement) {
            if (state.noStreamsFound) {
                stateElement.innerHTML = `<span class="no-streams-mode">State: NO STREAMS FOUND</span>`;
            } else {
                stateElement.textContent = `State: ${getStateDisplayName(state.currentState)}`;
            }
        }

        if (timingInfoElement) {
            let intervalText = '';
            if (state.noStreamsFound) {
                intervalText = 'No live streams found - waiting 5 minutes';
            } else {
                switch (state.currentState) {
                    case 'X2':
                        intervalText = 'Checking current stream every 30s';
                        break;
                    case 'partner':
                        intervalText = 'Status: 30s | X2 upgrade: 120s';
                        break;
                    case 'offline':
                    case 'not_in_wl':
                        intervalText = 'Looking for any live stream every 60s';
                        break;
                    default:
                        intervalText = 'Checking every 60s for any stream';
                }
            }
            timingInfoElement.textContent = intervalText;
        }

        // Update partner-specific display
        if (state.currentState === 'partner') {
            updatePartnerStatusDisplay();
        }
    }

    // Update last check time and state
    function updateLastCheckTime() {
        state.lastCheckTime = Date.now();
        state.currentState = determineCurrentState();

        const lastCheckElement = document.getElementById('lastCheckTime');
        if (lastCheckElement) {
            const now = new Date();
            lastCheckElement.textContent = `Last check: ${now.toLocaleTimeString()}`;
        }
        updateTimingDisplay();
    }

    // NEW: Setup partner status monitoring (30-second checks)
    function setupPartnerStatusMonitoring() {
        // Clear existing partner status interval
        if (state.partnerStatusIntervalId) {
            clearInterval(state.partnerStatusIntervalId);
            state.partnerStatusIntervalId = null;
        }

        // Only setup for partner streams
        if (state.currentState === 'partner' && state.isEnabled) {
            state.partnerStatusIntervalId = setInterval(() => {
                log('🔍 Partner status check (30s) - verifying current stream');
                checkCurrentPartnerStatus();
            }, TIMING_CONFIG.partnerStatusCheck);

            log(`✅ Partner status monitoring active (checking every ${TIMING_CONFIG.partnerStatusCheck/1000}s)`);
        }
    }

    // NEW: Check current partner stream status
    async function checkCurrentPartnerStatus() {
        const currentChannel = getCurrentChannel();
        if (!currentChannel || state.currentState !== 'partner') {
            return;
        }

        log(`🔍 Checking partner stream status: ${currentChannel}`);
        setChannelCheckingStatus(currentChannel);

        try {
            const isLive = await getStreamStatus(currentChannel);

            // Update UI with current status
            updateSingleChannelStatus(currentChannel, isLive);

            if (!isLive) {
                log(`🔴 Partner stream went offline: ${currentChannel}`);
                updateStatusMessage(`Partner stream offline - searching for replacement`);

                // Trigger immediate search for replacement
                handleChannelManagement();
            } else {
                log(`✅ Partner stream still live: ${currentChannel}`);
                // Stream is still live, no action needed
                updateLastCheckTime();
            }
        } catch (error) {
            log(`❌ Error checking partner status:`, error);
        }
    }

    // NEW: Check for X2 upgrades (120-second checks for partners)
    async function checkForX2Upgrade() {
        if (state.currentState !== 'partner') {
            return;
        }

        log('🔍 Checking for X2 upgrade (120s)');
        state.lastX2UpgradeCheck = Date.now();
        updatePartnerStatusDisplay();

        const bestX2 = await findFirstLiveChannelSequentially(TIER_X2, 'X2 Upgrade');

        if (bestX2) {
            log(`🎯 Found X2 upgrade: ${bestX2}`);
            const tier = getChannelTier(bestX2);
            switchToBestChannel(bestX2, tier);
        } else {
            log('✅ No X2 streams available for upgrade');
        }
    }

    // Setup dynamic interval based on current state
    function setupDynamicInterval() {
        // Clear existing interval
        if (state.checkIntervalId) {
            clearInterval(state.checkIntervalId);
            state.checkIntervalId = null;
        }

        const interval = getCurrentCheckInterval();

        if (interval > 0 && state.isEnabled) {
            state.checkIntervalId = setInterval(() => {
                log(`🔄 Dynamic check triggered (state: ${state.currentState}, interval: ${interval/1000}s)`);

                if (state.currentState === 'partner') {
                    // For partners, the main interval is for X2 upgrades
                    checkForX2Upgrade();
                } else {
                    // For other states, use the normal channel management
                    handleChannelManagement();
                }
            }, interval);

            log(`✅ Dynamic checks started (${interval/1000}s for ${state.currentState})`);
        } else if (state.currentState === 'X2') {
            log('⏸️ No periodic checks for X2 stream');
        }

        // Setup partner status monitoring if applicable
        setupPartnerStatusMonitoring();

        updateTimingDisplay();
    }

    // Immediate state assessment for direct navigation
    function performImmediateStateAssessment() {
        log('🔍 Performing immediate state assessment...');

        const currentChannel = getCurrentChannel();
        const tier = getChannelTier(currentChannel);

        // SIMPLE LOGIC: If we're on a known channel, set state based on tier
        if (tier === 'X2') {
            state.currentState = 'X2';
        } else if (tier === 'partners') {
            state.currentState = 'partner';
        } else if (currentChannel && !tier) {
            state.currentState = 'not_in_wl';
        } else {
            state.currentState = 'unknown';
        }

        state.lastChannel = currentChannel;
        state.lastCheckTime = Date.now(); // Set initial check time

        log(`✅ Immediate assessment: ${currentChannel} | ${state.currentState}`);
    }

    // Setup offline detection for X2 streams
    function setupX2OfflineDetection() {
        // Clear existing offline detector
        if (state.offlineDetectorInterval) {
            clearInterval(state.offlineDetectorInterval);
            state.offlineDetectorInterval = null;
        }

        // Only setup for X2 streams
        if (state.currentState === 'X2' && state.isEnabled) {
            state.offlineDetectorInterval = setInterval(() => {
                updateLastCheckTime(); // This updates the timestamp AND the state

                const currentState = determineCurrentState();
                if (currentState !== 'X2') {
                    log('🔴 X2 stream went offline, triggering check');
                    handleChannelManagement();
                }
            }, TIMING_CONFIG.offlineDetectionDelay);

            log(`✅ X2 offline detection active (checking every ${TIMING_CONFIG.offlineDetectionDelay/1000}s)`);
        }
    }

    // Handle no streams found scenario
    function handleNoStreamsFound() {
        log('❌ No live streams found - entering 5-minute wait mode');
        state.noStreamsFound = true;
        updateStatusMessage('No live channels found - waiting 5 minutes');

        // Set timeout to clear no-streams mode after 5 minutes
        state.noStreamsFoundTimeout = setTimeout(() => {
            state.noStreamsFound = false;
            log('🔄 5-minute wait over, resuming normal checks');
            updateStatusMessage('Resuming normal checks...');
            setupDynamicInterval();
        }, TIMING_CONFIG.noStreamsFoundDelay);

        setupDynamicInterval(); // This will now use the 5-minute interval
    }

    // The working plugin load function
    function forceAlienwarePluginLoad() {
        if (!state.isAutoLoadEnabled) {
            log('⏸️ Auto plugin loading disabled');
            return;
        }

        console.log('🎯 Force loading Alienware plugin...');

        const panelContainers = [
            '[data-a-target="channel-panels"]',
            '.channel-info-content',
            '.channel-root__right-column',
            '.stream-chat',
            '.tw-full-height',
            'main'
        ];

        let foundElements = 0;

        panelContainers.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && element.offsetParent !== null) {
                    foundElements++;
                    console.log(`🔄 Force re-rendering: ${selector}`);

                    // The working Method 12 approach
                    element.style.display = 'none';
                    element.offsetHeight; // Force reflow
                    element.style.display = '';

                    // Scroll element into view
                    element.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }
            });
        });

        console.log(`✅ Processed ${foundElements} elements for plugin loading`);

        // Follow-up scroll to ensure panels are visible
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 1000);
    }

    // Setup automatic plugin loading
    function setupPluginAutoLoad() {
        // Clear existing interval
        if (state.pluginLoadIntervalId) {
            clearInterval(state.pluginLoadIntervalId);
            state.pluginLoadIntervalId = null;
        }

        if (state.isAutoLoadEnabled) {
            // Initial load after delay
            setTimeout(() => {
                log('🔧 Initial plugin load triggered');
                forceAlienwarePluginLoad();
            }, TIMING_CONFIG.pluginLoadDelay);

            // Periodic checks
            state.pluginLoadIntervalId = setInterval(() => {
                log('🔧 Periodic plugin check triggered');
                forceAlienwarePluginLoad();
            }, TIMING_CONFIG.pluginCheckInterval);

            log(`✅ Auto plugin loading enabled (every ${TIMING_CONFIG.pluginCheckInterval/1000}s)`);
        } else {
            log('⏸️ Auto plugin loading disabled');
        }
    }

    // Toggle function for plugin loading
    function togglePluginAutoLoad() {
        state.isAutoLoadEnabled = !state.isAutoLoadEnabled;
        GM_setValue('autoLoadPlugin', state.isAutoLoadEnabled);

        const pluginBtn = document.getElementById('pluginToggleBtn');
        const pluginStatus = document.getElementById('pluginStatus');

        if (state.isAutoLoadEnabled) {
            pluginBtn.textContent = 'Disable Auto Scroll';
            pluginBtn.className = 'auto-switcher-btn auto-switcher-btn-danger';
            pluginStatus.textContent = 'Auto Scroll: ENABLED';
            pluginStatus.style.color = '#00ff00';
            log('✅ Auto Scrolling ENABLED');
        } else {
            pluginBtn.textContent = 'Enable Auto Scroll';
            pluginBtn.className = 'auto-switcher-btn auto-switcher-btn-success';
            pluginStatus.textContent = 'Auto Scroll: DISABLED';
            pluginStatus.style.color = '#ff4444';
            log('⏸️ Auto Scroll DISABLED');
        }

        setupPluginAutoLoad();
    }

    // Check if channel has changed (for soft navigation)
    function hasChannelChanged() {
        const currentChannel = getCurrentChannel();
        const changed = currentChannel !== state.lastChannel;

        if (changed) {
            log(`🔄 Channel changed: ${state.lastChannel} -> ${currentChannel}`);
            state.lastChannel = currentChannel;
        }

        return changed;
    }

    // Set up soft navigation detection
    function setupSoftNavDetection() {
        log('Setting up soft navigation detection...');

        // Method 1: Observe URL changes
        let lastUrl = location.href;
        state.softNavObserver = new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                if (hasChannelChanged()) {
                    log('🔍 Soft navigation detected via URL change');
                    handleSoftNavigation();
                }
            }
        });

        state.softNavObserver.observe(document, {
            subtree: true,
            childList: true
        });

        // Method 2: Observe sidebar clicks and navigation elements
        state.sidebarObserver = new MutationObserver(() => {
            const navElements = document.querySelectorAll([
                '[data-a-target="recommended-channel"]',
                '[data-test-selector="recommended-channel"]',
                '[data-a-target="side-nav-title"]',
                '.side-nav-section a[href*="/"]'
            ].join(','));

            navElements.forEach(element => {
                if (!element.hasAttribute('data-switcher-listener')) {
                    element.setAttribute('data-switcher-listener', 'true');
                    element.addEventListener('click', () => {
                        log('🔍 Sidebar navigation click detected');
                        setTimeout(() => {
                            if (hasChannelChanged()) {
                                handleSoftNavigation();
                            }
                        }, 1000);
                    });
                }
            });
        });

        state.sidebarObserver.observe(document.body, {
            subtree: true,
            childList: true
        });

        log('✅ Soft navigation detection setup complete');
    }

    // Handle soft navigation events
    function handleSoftNavigation() {
        if (!state.isEnabled) {
            log('Script disabled, ignoring soft navigation');
            return;
        }

        log('🔄 Handling soft navigation...');
        showSoftNavNotification('Channel changed - checking...');

        // UPDATE: Perform immediate assessment first
        performImmediateStateAssessment();

        setTimeout(() => {
            log('🔍 Checking channel after soft navigation');
            if (TIMING_CONFIG.debug) {
                updateLogicDebug();
            }

            // Update state and timing based on new channel
            state.currentState = determineCurrentState();
            setupDynamicInterval();
            setupX2OfflineDetection();

            // Trigger plugin load on channel change
            if (state.isAutoLoadEnabled) {
                setTimeout(() => {
                    log('🔧 Plugin load triggered after soft navigation');
                    forceAlienwarePluginLoad();
                }, TIMING_CONFIG.pluginLoadDelay);
            }

            // Always verify current channel status after navigation
            handleChannelManagement();
        }, TIMING_CONFIG.softNavCheckDelay);
    }

    // Show soft navigation notification
    function showSoftNavNotification(message) {
        const existing = document.querySelector('.soft-nav-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'soft-nav-notification';
        notification.textContent = `🎮 ${message}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Get which tier a channel belongs to
    function getChannelTier(channel) {
        if (TIER_X2.some(X2Channel => equalsIgnoreCase(X2Channel, channel))) {
            return 'X2';
        }
        if (TIER_PARTNERS.some(partnerChannel => equalsIgnoreCase(partnerChannel, channel))) {
            return 'partners';
        }
        return null;
    }

    // Check if current channel is in whitelist
    function isCurrentChannelInWhitelist() {
        const current = getCurrentChannel();
        if (!current) return false;

        const inWL = CHANNEL_WHITELIST.some(channel =>
            equalsIgnoreCase(channel, current)
        );

        log('In whitelist:', inWL);
        return inWL;
    }

    // Check if current channel is live (from state)
    function isCurrentChannelLive() {
        const current = getCurrentChannel();
        if (!current) return false;

        const tier = getChannelTier(current);
        if (!tier) return false;

        const isLive = state.currentLiveChannels[tier].some(channel =>
            equalsIgnoreCase(channel, current)
        );

        log('Is live:', isLive);
        return isLive;
    }

    // Get stream status using page content analysis
    async function getStreamStatus(channel) {
        log(`Checking status for: ${channel}`);
        try {
            const response = await fetch(`https://www.twitch.tv/${channel.toLowerCase()}`, {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Accept': 'text/html'
                }
            });

            if (!response.ok) {
                log(`Page fetch failed for ${channel}: ${response.status}`);
                return false;
            }

            const html = await response.text();

            const liveIndicators = [
                '"isLiveBroadcast"',
                '"isLive":true',
                'live-indicator',
                'streamType":"live"',
                '{"type":"live"',
                'data-test-selector="stream-info-card-component"'
            ];

            const hasLiveIndicator = liveIndicators.some(indicator => html.includes(indicator));

            if (hasLiveIndicator) {
                log(`✅ ${channel} is LIVE (found live indicators)`);
                return true;
            }

            const hasLiveElements = html.includes('data-a-target="player-overlay-player-count"') ||
                                  html.includes('data-a-target="live-channel-stream-information"');

            if (hasLiveElements) {
                log(`✅ ${channel} is LIVE (found live elements)`);
                return true;
            }

            log(`❌ ${channel} is OFFLINE (no live indicators found)`);
            return false;

        } catch (error) {
            log(`❌ Page check error for ${channel}:`, error);
            return false;
        }
    }

    // Check current channel status (lightweight monitoring)
    async function checkCurrentChannelStatus() {
        const currentChannel = getCurrentChannel();
        if (!currentChannel) return { tier: null, isLive: false };

        const tier = getChannelTier(currentChannel);
        const isLive = await getStreamStatus(currentChannel);

        log(`🔍 Current channel status: ${currentChannel} | Tier: ${tier} | Live: ${isLive}`);
        return { tier, isLive, channel: currentChannel };
    }

    // Update single channel status in UI
    function updateSingleChannelStatus(channel, isLive) {
        const channelItems = document.querySelectorAll('.channel-item');
        channelItems.forEach(item => {
            const channelSpan = item.querySelector('span:first-child');
            if (channelSpan && channelSpan.textContent.includes(channel)) {
                const statusSpan = item.querySelector('.channel-status');
                if (statusSpan) {
                    statusSpan.className = `channel-status ${isLive ? 'channel-live' : 'channel-offline'}`;
                    statusSpan.textContent = isLive ? 'LIVE' : 'OFFLINE';
                }
            }
        });
    }

    // Reset all channel statuses to empty
    function resetAllChannelStatuses() {
        const channelItems = document.querySelectorAll('.channel-item');
        channelItems.forEach(item => {
            const statusSpan = item.querySelector('.channel-status');
            if (statusSpan) {
                statusSpan.className = 'channel-status';
                statusSpan.textContent = '';
            }
        });
    }

    // Set channel status to "CHECKING..." during active checks
    function setChannelCheckingStatus(channel) {
        const channelItems = document.querySelectorAll('.channel-item');
        channelItems.forEach(item => {
            const channelSpan = item.querySelector('span:first-child');
            if (channelSpan && channelSpan.textContent.includes(channel)) {
                const statusSpan = item.querySelector('.channel-status');
                if (statusSpan) {
                    statusSpan.className = 'channel-status channel-checking';
                    statusSpan.textContent = 'CHECKING...';
                }
            }
        });
    }

    // Update sequential status
    function updateSequentialStatus(message) {
        let statusElement = document.getElementById('sequentialStatus');
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'sequentialStatus';
            statusElement.className = 'sequential-status';
            const timingDebug = document.getElementById('timingDebug');
            if (timingDebug && timingDebug.parentNode) {
                timingDebug.parentNode.insertBefore(statusElement, timingDebug);
            }
        }
        statusElement.textContent = message;
    }

    // Sequential checking - find first live channel in randomly shuffled list
    async function findFirstLiveChannelSequentially(channelList, tierName) {
        log(`🔍 Sequential check for ${tierName}: ${channelList.length} channels`);

        // Shuffle the list randomly
        const shuffledList = [...channelList];
        for (let i = shuffledList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
        }

        updateStatusMessage(`Checking ${tierName} (${shuffledList.length} channels)...`);

        // Check each channel sequentially until we find a live one
        for (const channel of shuffledList) {
            // UPDATE: Set status to "CHECKING..." before checking
            setChannelCheckingStatus(channel);
            updateSequentialStatus(`Checking: ${channel}`);

            try {
                const isLive = await getStreamStatus(channel);

                // Update UI immediately with final status
                updateSingleChannelStatus(channel, isLive);

                if (isLive) {
                    log(`✅ Found live ${tierName} channel: ${channel}`);
                    updateSequentialStatus(`Found live: ${channel}`);
                    return channel;
                }

                // Small delay between checks to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, TIMING_CONFIG.sequentialCheckDelay));

            } catch (error) {
                log(`Error checking ${channel}:`, error);
                updateSingleChannelStatus(channel, false);
            }
        }

        log(`❌ No live ${tierName} channels found`);
        updateSequentialStatus(`No live ${tierName} channels`);
        return null;
    }

    // Find best live channel with proper search priority (X2 first, then Partners)
    async function findBestLiveChannelTargeted(searchTier) {
        log(`🎯 Targeted search for: ${searchTier}`);

        if (searchTier === 'X2') {
            // X2-only search
            const liveChannel = await findFirstLiveChannelSequentially(TIER_X2, 'X2');
            if (liveChannel) {
                const tier = getChannelTier(liveChannel);
                state.currentLiveChannels[tier] = [liveChannel];
                state.currentTier = tier;
                state.currentStreamer = liveChannel;
                GM_setValue('currentTier', tier);
                GM_setValue('currentStreamer', liveChannel);

                log(`🎯 TARGETED SELECTION: Found X2 channel - ${liveChannel}`);
                updateStatusMessage(`Found X2: ${liveChannel}`);
                return { channel: liveChannel, tier: tier };
            }
        } else if (searchTier === 'any') {
            // FIX: Search X2 first, then Partners (maintain priority)
            log('🔍 Full search: Checking X2 first, then Partners');

            // First, search X2 channels
            const liveX2 = await findFirstLiveChannelSequentially(TIER_X2, 'X2');
            if (liveX2) {
                const tier = getChannelTier(liveX2);
                state.currentLiveChannels[tier] = [liveX2];
                state.currentTier = tier;
                state.currentStreamer = liveX2;
                GM_setValue('currentTier', tier);
                GM_setValue('currentStreamer', liveX2);

                log(`🎯 TARGETED SELECTION: Found X2 channel - ${liveX2}`);
                updateStatusMessage(`Found X2: ${liveX2}`);
                return { channel: liveX2, tier: tier };
            }

            // If no X2 found, search Partners
            log('🔍 No X2 streams found, checking Partners...');
            updateStatusMessage('No X2 streams, checking Partners...');
            const livePartner = await findFirstLiveChannelSequentially(TIER_PARTNERS, 'Partners');
            if (livePartner) {
                const tier = getChannelTier(livePartner);
                state.currentLiveChannels[tier] = [livePartner];
                state.currentTier = tier;
                state.currentStreamer = livePartner;
                GM_setValue('currentTier', tier);
                GM_setValue('currentStreamer', livePartner);

                log(`🎯 TARGETED SELECTION: Found Partner channel - ${livePartner}`);
                updateStatusMessage(`Found Partner: ${livePartner}`);
                return { channel: livePartner, tier: tier };
            }
        }

        log(`❌ TARGETED SELECTION: No live ${searchTier} channels found`);

        // Handle no streams found scenario
        if (searchTier === 'any') {
            handleNoStreamsFound();
        }

        return null;
    }

    // Determine what to check based on current status
    function determineCheckNeeded(currentStatus) {
        const { tier, isLive, channel } = currentStatus;

        if (!channel) {
            return { check: 'any', reason: 'No channel detected' };
        }

        if (!tier) {
            return { check: 'any', reason: 'Channel not in whitelist' };
        }

        if (!isLive) {
            return { check: 'any', reason: 'Current channel offline' };
        }

        if (tier === 'partners') {
            return { check: 'X2', reason: 'Partner live - checking for X2 upgrade' };
        }

        if (tier === 'X2') {
            return { check: 'none', reason: 'X2 live - no action needed' };
        }

        return { check: 'any', reason: 'Unknown state - full check' };
    }

    // Improved main logic with status-first approach
    async function handleChannelManagement() {
        if (state.isChecking || !state.isEnabled || state.sequentialCheckInProgress) {
            log('Skipping check: already checking or disabled');
            return;
        }

        state.isChecking = true;
        state.hasInitialCheck = true;
        state.sequentialCheckInProgress = true;

        // UPDATE: Reset all statuses at the start of a check
        resetAllChannelStatuses();

        log('=== STARTING STATUS-BASED CHANNEL CHECK ===');

        // STEP 1: ALWAYS check current status first
        const currentStatus = await checkCurrentChannelStatus();
        log(`Current status: ${currentStatus.channel} | ${currentStatus.tier} | Live: ${currentStatus.isLive}`);

        // STEP 2: Determine what (if anything) to check for
        const checkDecision = determineCheckNeeded(currentStatus);
        log(`Check decision: ${checkDecision.check} - ${checkDecision.reason}`);

        // Update state based on actual current status
        state.currentState = determineCurrentState();

        // Only update debug if debug mode is enabled
        if (TIMING_CONFIG.debug) {
            updateLogicDebug();
        }

        // STEP 3: Execute targeted check if needed
        let bestChannelResult = null;

        if (checkDecision.check === 'none') {
            log('✅ No check needed - watching optimal stream');
            updateStatusMessage(`Watching ${currentStatus.channel} (${currentStatus.tier})`);
            // UPDATE: Update current channel status since we're not doing a full check
            updateSingleChannelStatus(currentStatus.channel, true);
        } else if (checkDecision.check === 'X2') {
            bestChannelResult = await findBestLiveChannelTargeted('X2');
        } else if (checkDecision.check === 'any') {
            bestChannelResult = await findBestLiveChannelTargeted('any');
        }

        // STEP 4: Decide if switching is needed
        if (bestChannelResult && shouldSwitchBasedOnCurrentState(bestChannelResult, currentStatus)) {
            switchToBestChannel(bestChannelResult.channel, bestChannelResult.tier);
        } else if (checkDecision.check !== 'none') {
            log(`✅ Final Decision: Stay on ${currentStatus.channel}`);
            updateStatusMessage(`Watching ${currentStatus.channel} (${currentStatus.tier})`);
        }

        // Update timing based on new state
        setupDynamicInterval();
        setupX2OfflineDetection();

        log('=== STATUS-BASED CHANNEL CHECK COMPLETE ===');
        state.isChecking = false;
        state.sequentialCheckInProgress = false;
        updateLastCheckTime();
    }

    // Improved switching logic based on current state
    function shouldSwitchBasedOnCurrentState(bestChannelResult, currentStatus) {
        const { channel: bestChannel, tier: bestTier } = bestChannelResult;
        const { channel: currentChannel, tier: currentTier, isLive: currentIsLive } = currentStatus;

        // Don't switch if we're already on the best channel
        if (equalsIgnoreCase(bestChannel, currentChannel)) {
            log(`⚠️ Already on best channel: ${bestChannel}`);
            return false;
        }

        // Always switch if current channel is offline/not in WL
        if (!currentIsLive || !currentTier) {
            log(`🎯 Switching: Current channel offline/not in WL`);
            return true;
        }

        // Switch from Partner to X2 upgrade
        if (currentTier === 'partners' && bestTier === 'X2') {
            log(`🎯 Switching: Partner → X2 upgrade`);
            return true;
        }

        // Safety: Switch if current X2 not in live list
        if (currentTier === 'X2' && !state.currentLiveChannels.X2.some(ch => equalsIgnoreCase(ch, currentChannel))) {
            log(`🎯 Switching: Current X2 not in live list`);
            return true;
        }

        log(`✅ No switch needed: Optimal configuration`);
        return false;
    }

    // Switch to the chosen channel
    function switchToBestChannel(bestChannel, tier) {
        const currentChannel = getCurrentChannel();

        if (bestChannel && !equalsIgnoreCase(bestChannel, currentChannel)) {
            state.isAutoSwitched = true;
            GM_setValue('lastAutoSwitch', true);

            log(`🎯 SWITCHING to ${tier}: ${bestChannel}`);
            updateStatusMessage(`Switching to ${bestChannel}`);
            showSwitchNotification(`Switching to ${bestChannel} (${tier})`);

            setTimeout(() => {
                window.location.href = `https://www.twitch.tv/${bestChannel.toLowerCase()}`;

                // Trigger plugin load after navigation
                setTimeout(() => {
                    forceAlienwarePluginLoad();
                }, TIMING_CONFIG.pluginLoadDelay);

            }, 1000);
        } else if (bestChannel) {
            log(`⚠️ Already on best channel: ${bestChannel}`);
        } else {
            log('❌ No live channel found to switch to');
            updateStatusMessage('No live channels available');
        }
    }

    // Show notification when switching
    function showSwitchNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #6441a5;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;
        notification.textContent = `🎮 ${message}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Update status message in UI
    function updateStatusMessage(message) {
        let statusElement = document.getElementById('statusMessage');
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'statusMessage';
            statusElement.className = 'status-message';
            const channelList = document.getElementById('channelStatusList');
            if (channelList && channelList.parentNode) {
                channelList.parentNode.insertBefore(statusElement, channelList.nextSibling);
            }
        }
        statusElement.textContent = message;
        log('Status message:', message);
    }

    // Update logic debug display
    function updateLogicDebug() {
        // Only show debug info if debug mode is enabled
        if (!TIMING_CONFIG.debug) {
            let debugElement = document.getElementById('logicDebug');
            if (debugElement) {
                debugElement.remove();
            }
            return;
        }

        const currentChannel = getCurrentChannel();
        const inWhitelist = isCurrentChannelInWhitelist();
        const isLive = isCurrentChannelLive();
        const currentTier = getChannelTier(currentChannel);

        let debugElement = document.getElementById('logicDebug');
        if (!debugElement) {
            debugElement = document.createElement('div');
            debugElement.id = 'logicDebug';
            debugElement.className = 'logic-debug';
            const statusMessage = document.getElementById('statusMessage');
            if (statusMessage && statusMessage.parentNode) {
                statusMessage.parentNode.insertBefore(debugElement, statusMessage.nextSibling);
            }
        }

        debugElement.innerHTML = `
            <strong>Debug Info:</strong><br>
            Channel: ${currentChannel || 'none'}<br>
            Tier: ${currentTier || 'N/A'}<br>
            In WL: ${inWhitelist ? 'YES' : 'NO'}<br>
            Is Live: ${isLive ? 'YES' : 'NO'}<br>
            Live X2: ${state.currentLiveChannels.X2.length}<br>
            Live Partners: ${state.currentLiveChannels.partners.length}
        `;
    }

    // Update channel status display with tier information
    function updateChannelStatusDisplay() {
        const channelList = document.getElementById('channelStatusList');
        if (!channelList) return;

        const currentChannel = getCurrentChannel();

        let html = '';
        CHANNEL_WHITELIST.forEach(channel => {
            const isCurrent = equalsIgnoreCase(channel, currentChannel);
            const itemClass = isCurrent ? 'channel-item current-stream' : 'channel-item';
            const tier = getChannelTier(channel);

            // Only show X2 tag, no tag for Partners
            const tierBadge = tier === 'X2' ? `<span class="tier-indicator tier-X2">X2</span>` : '';

            // FIX: Default to empty status, not "CHECKING..."
            html += `
                <div class="${itemClass}">
                    <span>${tierBadge} ${channel}</span>
                    <span class="channel-status"></span>
                </div>
            `;
        });

        channelList.innerHTML = html;
    }

    // Helper function for timing description
    function getTimingDescription(currentState) {
        switch (currentState) {
            case 'X2':
                return 'Checking current stream every 30s';
            case 'partner':
                return 'Status: 30s | X2 upgrade: 120s';
            case 'offline':
            case 'not_in_wl':
                return 'Looking for any live stream every 60s';
            default:
                return 'Checking every 60s for any stream';
        }
    }

    // Create control UI with state information
    function createControlUI() {
        log('Creating control UI...');

        const ui = document.createElement('div');
        ui.className = 'auto-switcher-ui';
        ui.innerHTML = `
            <div class="auto-switcher-header">
                <div class="auto-switcher-title">👽AWA Auto Switcher</div>
            </div>
            <div class="auto-switcher-status">
                <div class="status-indicator ${state.isEnabled ? 'status-enabled' : 'status-disabled'}"></div>
                <span>Status: ${state.isEnabled ? 'ENABLED' : 'DISABLED'}</span>
            </div>
            <div class="state-indicator" id="currentState">State: ${getStateDisplayName(state.currentState)}</div>
            <div class="timing-info" id="timingInfo">${getTimingDescription(state.currentState)}</div>
            ${state.currentState === 'partner' ? '<div class="partner-status-indicator" id="partnerStatusInfo">Status checks: Every 30s<br>X2 upgrade: 120s</div>' : ''}
            <div class="tier-stats">
                X2: ${TIER_X2.length} | Partners: ${TIER_PARTNERS.length}
            </div>

            <div class="channel-list" id="channelStatusList">
                <!-- Channel status will be populated here -->
            </div>
            <div class="buttons-row">
                <button class="auto-switcher-btn ${state.isEnabled ? 'auto-switcher-btn-danger' : 'auto-switcher-btn-success'}" id="toggleBtn">
                    ${state.isEnabled ? 'Stop' : 'Start'}
                </button>
                <button class="auto-switcher-btn" id="checkNowBtn">Check Now</button>
            </div>
            <div class="buttons-row">
                <button class="auto-switcher-btn ${state.isAutoLoadEnabled ? 'auto-switcher-btn-danger' : 'auto-switcher-btn-success'}" id="pluginToggleBtn">
                    ${state.isAutoLoadEnabled ? 'Disable Auto Scroll' : 'Enable Auto Scroll'}
                </button>
            </div>
            <div class="last-check" id="lastCheckTime">Last check: ${state.lastCheckTime ? new Date(state.lastCheckTime).toLocaleTimeString() : 'Never'}</div>
            <div class="timing-debug" id="timingDebug">Last: Never | Next: N/A</div>
        `;

        document.body.appendChild(ui);
        log('UI added to page');

        // Initialize channel status display
        updateChannelStatusDisplay();

        // Add event listeners
        document.getElementById('toggleBtn').addEventListener('click', toggleScript);
        document.getElementById('checkNowBtn').addEventListener('click', manualCheck);
        document.getElementById('pluginToggleBtn').addEventListener('click', togglePluginAutoLoad);

        // Make UI draggable
        makeDraggable(ui);

        return ui;
    }

    // Toggle script on/off
    function toggleScript() {
        state.isEnabled = !state.isEnabled;
        GM_setValue('autoSwitcherEnabled', state.isEnabled);

        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.auto-switcher-status span');
        const toggleBtn = document.getElementById('toggleBtn');

        if (state.isEnabled) {
            statusIndicator.className = 'status-indicator status-enabled';
            statusText.textContent = 'Status: ENABLED';
            toggleBtn.textContent = 'Stop';
            toggleBtn.className = 'auto-switcher-btn auto-switcher-btn-danger';
            log('Auto switcher ENABLED');

            // Update state and setup dynamic timing
            state.currentState = determineCurrentState();
            setupDynamicInterval();
            setupX2OfflineDetection();

            // Do initial check after delay
            setTimeout(() => {
                handleChannelManagement();
            }, TIMING_CONFIG.initialLoadDelay);
        } else {
            statusIndicator.className = 'status-indicator status-disabled';
            statusText.textContent = 'Status: DISABLED';
            toggleBtn.textContent = 'Start';
            toggleBtn.className = 'auto-switcher-btn auto-switcher-btn-success';
            log('Auto switcher DISABLED');

            // Stop all checking
            if (state.checkIntervalId) {
                clearInterval(state.checkIntervalId);
                state.checkIntervalId = null;
                log('❌ Dynamic checks stopped');
            }
            if (state.partnerStatusIntervalId) {
                clearInterval(state.partnerStatusIntervalId);
                state.partnerStatusIntervalId = null;
                log('❌ Partner status monitoring stopped');
            }
            if (state.offlineDetectorInterval) {
                clearInterval(state.offlineDetectorInterval);
                state.offlineDetectorInterval = null;
                log('❌ Offline detection stopped');
            }
        }
        updateTimingDisplay();
    }

    // Smarter manual check function with state-based behavior
    function manualCheck() {
        log('Manual check triggered');

        // SMART CHECK: Different behavior based on current state
        switch (state.currentState) {
            case 'X2':
                log('🔍 Manual check: Verifying current X2 stream status');
                updateStatusMessage('Verifying current stream...');
                // Just check if current stream is still live
                const currentChannel = getCurrentChannel();
                setChannelCheckingStatus(currentChannel);

                checkCurrentChannelStatus().then(status => {
                    if (!status.isLive) {
                        log('🔴 Current X2 stream went offline, searching for replacement');
                        updateSingleChannelStatus(currentChannel, false);
                        handleChannelManagement();
                    } else {
                        log('✅ Current X2 stream still live');
                        updateSingleChannelStatus(currentChannel, true);
                        updateStatusMessage(`✓ ${status.channel} still live`);
                        updateLastCheckTime();
                    }
                });
                break;

            case 'partner':
                log('🔍 Manual check: Checking current status + X2 upgrade');
                updateStatusMessage('Checking current stream + X2 upgrade...');
                // Check current partner status AND look for X2 upgrades
                const partnerChannel = getCurrentChannel();
                setChannelCheckingStatus(partnerChannel);

                Promise.all([
                    checkCurrentChannelStatus(),
                    findBestLiveChannelTargeted('X2')
                ]).then(([currentStatus, X2Upgrade]) => {
                    // Update current partner status
                    updateSingleChannelStatus(partnerChannel, currentStatus.isLive);

                    if (!currentStatus.isLive) {
                        log('🔴 Partner stream went offline, searching for replacement');
                        handleChannelManagement();
                    } else if (X2Upgrade) {
                        log(`🎯 Found X2 upgrade: ${X2Upgrade.channel}`);
                        switchToBestChannel(X2Upgrade.channel, X2Upgrade.tier);
                    } else {
                        log('✅ Partner stream still live, no X2 upgrades available');
                        updateStatusMessage(`✓ ${partnerChannel} still live`);
                        updateLastCheckTime();
                    }
                });
                break;

            case 'offline':
            case 'not_in_wl':
            default:
                log('🔍 Manual check: Full channel search');
                // Run full check with proper priority
                handleChannelManagement();
                break;
        }
    }

    // Make UI draggable
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        const header = element.querySelector('.auto-switcher-header');
        if (!header) return;

        header.style.cursor = 'move';
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Initialize the script
    function init() {
        log('=== INITIALIZING STATUS-BASED SWITCHER ===');
        log(`X2 streamers: ${TIER_X2.length}`);
        log(`Partner streamers: ${TIER_PARTNERS.length}`);

        // Initialize channel tracking
        state.lastChannel = getCurrentChannel();

        // PERFORM ASSESSMENT FIRST
        performImmediateStateAssessment();

        // Set up soft navigation detection
        setupSoftNavDetection();

        // CREATE UI AFTER ASSESSMENT (so it shows correct data from the start)
        try {
            createControlUI();
            log('✅ UI created successfully');
        } catch (error) {
            log('❌ UI creation failed:', error);
            return;
        }

        // Update UI with correct initial state (now the UI exists)
        updateTimingDisplay();
        updateLogicDebug();

        // Setup plugin auto loading (runs regardless of main switcher state)
        setupPluginAutoLoad();

        // If script is enabled, start with dynamic timing
        if (state.isEnabled) {
            log('🔄 Script was enabled, starting status-based timing...');

            // Setup timing based on properly assessed current state
            setupDynamicInterval();
            setupX2OfflineDetection();

            // Only do initial check if needed (not for live X2 streams)
            if (state.currentState !== 'X2') {
                setTimeout(() => {
                    handleChannelManagement();
                }, TIMING_CONFIG.initialLoadDelay);
            } else {
                log('✅ Already on live X2 stream - no initial check needed');
            }
        } else {
            log('⏸️ Script is disabled on startup');
        }

        log('=== STATUS-BASED SCRIPT INITIALIZATION COMPLETE ===');
    }

    // Start the script when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();