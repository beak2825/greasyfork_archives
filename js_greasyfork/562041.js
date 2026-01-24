// ==UserScript==
// @name         YouTube Speed Control (v14)
// @namespace    http://tampermonkey.net/
// @author       Solomon
// @license      CC-BY-4.0
// @version      14
// @description  Modern speed button with per-channel memory. Automatically remembers your preferred speed for each channel.
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562041/YouTube%20Speed%20Control%20%28v14%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562041/YouTube%20Speed%20Control%20%28v14%29.meta.js
// ==/UserScript==

/*
 * ═══════════════════════════════════════════════════════════════════════════
 * 📋 CHANGELOG
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Previous Features (Preserved):
 * ✅ Speed options: 1x, 1.25x, 1.5x, 1.75x, 2x
 * ✅ Remember speed preference
 * ✅ Keyboard shortcuts: [ ] \ P
 * ✅ Double-click to reset to 1x
 * ✅ Modern red button design
 * ✅ Positioned next to channel/like buttons
 *
 * 🆕 NEW in v14:
 * ✨ Per-channel speed memory - automatically remembers speed for each channel
 * ✨ Channel indicator shows when using channel-specific speed
 * ✨ Falls back to default speed for new/unknown channels
 * ✨ Toggle between global and per-channel mode
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════

    const SPEEDS = [1, 1.25, 1.5, 1.75, 2];
    const STORAGE_KEYS = {
        SAVE_ENABLED: 'yt_speed_save_v14',
        DEFAULT_SPEED: 'yt_speed_default_v14',
        CHANNEL_SPEEDS: 'yt_speed_channels_v14',
        PER_CHANNEL_MODE: 'yt_speed_perchannel_v14'
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 STATE
    // ═══════════════════════════════════════════════════════════════════════════

    const state = {
        currentSpeed: 1,
        currentChannel: null,
        isOpen: false,
        inserted: false,
        btn: null,
        menu: null
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 💾 STORAGE FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    // Initialize defaults
    if (localStorage.getItem(STORAGE_KEYS.SAVE_ENABLED) === null) {
        localStorage.setItem(STORAGE_KEYS.SAVE_ENABLED, 'true');
    }
    if (localStorage.getItem(STORAGE_KEYS.PER_CHANNEL_MODE) === null) {
        localStorage.setItem(STORAGE_KEYS.PER_CHANNEL_MODE, 'true');
    }
    if (localStorage.getItem(STORAGE_KEYS.CHANNEL_SPEEDS) === null) {
        localStorage.setItem(STORAGE_KEYS.CHANNEL_SPEEDS, '{}');
    }

    const isSaveEnabled = () => localStorage.getItem(STORAGE_KEYS.SAVE_ENABLED) === 'true';
    const isPerChannelMode = () => localStorage.getItem(STORAGE_KEYS.PER_CHANNEL_MODE) === 'true';

    const getDefaultSpeed = () => parseFloat(localStorage.getItem(STORAGE_KEYS.DEFAULT_SPEED)) || 1;
    const setDefaultSpeed = (speed) => localStorage.setItem(STORAGE_KEYS.DEFAULT_SPEED, String(speed));

    const getChannelSpeeds = () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHANNEL_SPEEDS)) || {};
        } catch {
            return {};
        }
    };

    const setChannelSpeed = (channelId, speed) => {
        if (!channelId) return;
        const speeds = getChannelSpeeds();
        speeds[channelId] = speed;
        localStorage.setItem(STORAGE_KEYS.CHANNEL_SPEEDS, JSON.stringify(speeds));
    };

    const getChannelSpeed = (channelId) => {
        if (!channelId) return null;
        const speeds = getChannelSpeeds();
        return speeds[channelId] || null;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔍 CHANNEL DETECTION
    // ═══════════════════════════════════════════════════════════════════════════

    function getCurrentChannel() {
        // Try multiple methods to get channel identifier

        // Method 1: Channel link in video owner section
        const ownerLink = document.querySelector(
            '#owner a[href*="/@"], ' +
            '#owner a[href*="/channel/"], ' +
            '#owner a[href*="/c/"], ' +
            'ytd-video-owner-renderer a[href*="/@"], ' +
            'ytd-video-owner-renderer a[href*="/channel/"]'
        );

        if (ownerLink) {
            const href = ownerLink.getAttribute('href');
            if (href) {
                // Extract @handle or channel ID
                const handleMatch = href.match(/\/@([^/?]+)/);
                if (handleMatch) return '@' + handleMatch[1];

                const channelMatch = href.match(/\/channel\/([^/?]+)/);
                if (channelMatch) return channelMatch[1];

                const customMatch = href.match(/\/c\/([^/?]+)/);
                if (customMatch) return 'c/' + customMatch[1];
            }
        }

        // Method 2: Channel name element
        const channelName = document.querySelector(
            '#owner #channel-name a, ' +
            '#owner ytd-channel-name a, ' +
            'ytd-video-owner-renderer #channel-name a'
        );

        if (channelName) {
            const href = channelName.getAttribute('href');
            if (href) {
                const handleMatch = href.match(/\/@([^/?]+)/);
                if (handleMatch) return '@' + handleMatch[1];
            }
            // Fallback to channel name text
            const name = channelName.textContent?.trim();
            if (name) return 'name:' + name;
        }

        return null;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 STYLES
    // ═══════════════════════════════════════════════════════════════════════════

    const css = document.createElement('style');
    css.textContent = `
        #ytspeed-wrapper {
            display: inline-flex !important;
            align-items: center !important;
            position: relative !important;
            margin-left: 8px !important;
            margin-right: 8px !important;
            vertical-align: middle !important;
        }

        /* ===== MAIN BUTTON ===== */
        #ytspeed-btn {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            height: 36px !important;
            padding: 0 16px !important;
            background: #cc0000 !important;
            color: #ffffff !important;
            border: none !important;
            border-radius: 18px !important;
            font-family: "YouTube Sans", "Roboto", Arial, sans-serif !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            user-select: none !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
        }

        #ytspeed-btn:hover {
            background: #aa0000 !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }

        #ytspeed-btn:active {
            transform: translateY(0) scale(0.98) !important;
        }

        #ytspeed-btn.open {
            background: #990000 !important;
        }

        /* 🆕 v14: Channel indicator */
        #ytspeed-btn.has-channel {
            background: linear-gradient(135deg, #cc0000 0%, #ff6600 100%) !important;
        }

        /* Icon */
        .ytspeed-icon {
            font-size: 14px !important;
            line-height: 1 !important;
        }

        /* Speed text */
        .ytspeed-text {
            font-size: 14px !important;
            font-weight: 600 !important;
            line-height: 1 !important;
        }

        /* 🆕 v14: Channel badge */
        .ytspeed-channel-badge {
            font-size: 10px !important;
            background: rgba(255,255,255,0.2) !important;
            padding: 2px 6px !important;
            border-radius: 10px !important;
            margin-left: 4px !important;
        }

        /* ===== DROPDOWN MENU ===== */
        #ytspeed-menu {
            position: absolute !important;
            bottom: calc(100% + 10px) !important;
            left: 50% !important;
            transform: translateX(-50%) scale(0.95) !important;
            opacity: 0 !important;
            visibility: hidden !important;
            background: #282828 !important;
            border: 1px solid #404040 !important;
            border-radius: 12px !important;
            padding: 8px !important;
            min-width: 160px !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important;
            z-index: 9999 !important;
            font-family: "YouTube Sans", "Roboto", Arial, sans-serif !important;
            transition: all 0.2s ease !important;
        }

        #ytspeed-menu.open {
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateX(-50%) scale(1) !important;
        }

        /* Menu arrow */
        #ytspeed-menu::after {
            content: "" !important;
            position: absolute !important;
            bottom: -8px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            border-left: 8px solid transparent !important;
            border-right: 8px solid transparent !important;
            border-top: 8px solid #282828 !important;
        }

        /* ===== SPEED OPTIONS ===== */
        .ytspeed-item {
            padding: 10px 16px !important;
            color: #ffffff !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            text-align: center !important;
            border-radius: 8px !important;
            margin: 2px 0 !important;
            transition: background 0.15s ease !important;
        }

        .ytspeed-item:hover {
            background: #404040 !important;
        }

        .ytspeed-item.active {
            background: #cc0000 !important;
            color: #ffffff !important;
        }

        /* ===== DIVIDER ===== */
        .ytspeed-divider {
            height: 1px !important;
            background: #404040 !important;
            margin: 8px 4px !important;
        }

        /* ===== TOGGLE OPTIONS ===== */
        .ytspeed-toggle-row {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 8px 12px !important;
            color: #aaaaaa !important;
            font-size: 12px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            border-radius: 8px !important;
            transition: all 0.15s ease !important;
        }

        .ytspeed-toggle-row:hover {
            background: #353535 !important;
            color: #ffffff !important;
        }

        /* Toggle switch */
        .ytspeed-toggle {
            position: relative !important;
            width: 36px !important;
            height: 20px !important;
            background: #555555 !important;
            border-radius: 10px !important;
            cursor: pointer !important;
            transition: background 0.2s ease !important;
        }

        .ytspeed-toggle.on {
            background: #cc0000 !important;
        }

        .ytspeed-toggle::after {
            content: "" !important;
            position: absolute !important;
            top: 2px !important;
            left: 2px !important;
            width: 16px !important;
            height: 16px !important;
            background: #ffffff !important;
            border-radius: 50% !important;
            transition: left 0.2s ease !important;
        }

        .ytspeed-toggle.on::after {
            left: 18px !important;
        }

        /* 🆕 v14: Channel info display */
        .ytspeed-channel-info {
            padding: 8px 12px !important;
            background: #1a1a1a !important;
            border-radius: 8px !important;
            margin-bottom: 8px !important;
            font-size: 11px !important;
            color: #888888 !important;
            text-align: center !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
        }

        .ytspeed-channel-info strong {
            color: #ff6600 !important;
            font-weight: 600 !important;
        }
    `;
    document.head.appendChild(css);

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎛️ UI CREATION
    // ═══════════════════════════════════════════════════════════════════════════

    function createElements() {
        const wrapper = document.createElement('div');
        wrapper.id = 'ytspeed-wrapper';

        // Main button
        state.btn = document.createElement('button');
        state.btn.id = 'ytspeed-btn';
        state.btn.title = 'Playback Speed (Double-click to reset)';

        const icon = document.createElement('span');
        icon.className = 'ytspeed-icon';
        icon.textContent = '⚡';

        const text = document.createElement('span');
        text.className = 'ytspeed-text';
        text.id = 'ytspeed-text';
        text.textContent = state.currentSpeed + 'x';

        state.btn.appendChild(icon);
        state.btn.appendChild(text);

        // Dropdown menu
        state.menu = document.createElement('div');
        state.menu.id = 'ytspeed-menu';

        // 🆕 v14: Channel info display
        const channelInfo = document.createElement('div');
        channelInfo.className = 'ytspeed-channel-info';
        channelInfo.id = 'ytspeed-channel-info';
        channelInfo.innerHTML = 'Channel: <strong>detecting...</strong>';
        state.menu.appendChild(channelInfo);

        // Speed options
        SPEEDS.forEach(speed => {
            const item = document.createElement('div');
            item.className = 'ytspeed-item' + (Math.abs(speed - state.currentSpeed) < 0.01 ? ' active' : '');
            item.setAttribute('data-speed', speed);
            item.textContent = speed + 'x';
            item.onclick = (e) => {
                e.stopPropagation();
                setSpeed(speed);
            };
            state.menu.appendChild(item);
        });

        // Divider
        const divider1 = document.createElement('div');
        divider1.className = 'ytspeed-divider';
        state.menu.appendChild(divider1);

        // 🆕 v14: Per-channel mode toggle
        const perChannelRow = document.createElement('div');
        perChannelRow.className = 'ytspeed-toggle-row';
        perChannelRow.innerHTML = `
            <span>Per-Channel</span>
            <div class="ytspeed-toggle ${isPerChannelMode() ? 'on' : ''}" id="ytspeed-perchannel-toggle"></div>
        `;
        perChannelRow.onclick = (e) => {
            e.stopPropagation();
            const toggle = document.getElementById('ytspeed-perchannel-toggle');
            const newValue = !isPerChannelMode();
            localStorage.setItem(STORAGE_KEYS.PER_CHANNEL_MODE, newValue ? 'true' : 'false');
            toggle.classList.toggle('on', newValue);
            loadSpeedForCurrentChannel();
        };
        state.menu.appendChild(perChannelRow);

        // Remember toggle
        const rememberRow = document.createElement('div');
        rememberRow.className = 'ytspeed-toggle-row';
        rememberRow.innerHTML = `
            <span>Remember</span>
            <div class="ytspeed-toggle ${isSaveEnabled() ? 'on' : ''}" id="ytspeed-remember-toggle"></div>
        `;
        rememberRow.onclick = (e) => {
            e.stopPropagation();
            const toggle = document.getElementById('ytspeed-remember-toggle');
            const newValue = !isSaveEnabled();
            localStorage.setItem(STORAGE_KEYS.SAVE_ENABLED, newValue ? 'true' : 'false');
            toggle.classList.toggle('on', newValue);
            if (newValue) saveCurrentSpeed();
        };
        state.menu.appendChild(rememberRow);

        wrapper.appendChild(state.btn);
        wrapper.appendChild(state.menu);

        // Button click - toggle menu
        state.btn.onclick = (e) => {
            e.stopPropagation();
            state.isOpen = !state.isOpen;
            state.menu.classList.toggle('open', state.isOpen);
            state.btn.classList.toggle('open', state.isOpen);
            updateChannelInfo();
        };

        // Double-click - reset to 1x
        state.btn.ondblclick = (e) => {
            e.stopPropagation();
            setSpeed(1);
        };

        return wrapper;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔄 SPEED MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    function setSpeed(speed) {
        state.currentSpeed = speed;

        // Apply to video
        const video = document.querySelector('video');
        if (video) video.playbackRate = speed;

        // Save speed
        if (isSaveEnabled()) {
            saveCurrentSpeed();
        }

        updateUI();
        console.log(`[YouTube Speed v14] ⚡ Speed set to ${speed}x` + 
            (isPerChannelMode() && state.currentChannel ? ` for ${state.currentChannel}` : ' (global)'));
    }

    function saveCurrentSpeed() {
        if (isPerChannelMode() && state.currentChannel) {
            // Save per-channel
            setChannelSpeed(state.currentChannel, state.currentSpeed);
        } else {
            // Save global default
            setDefaultSpeed(state.currentSpeed);
        }
    }

    function loadSpeedForCurrentChannel() {
        // Detect current channel
        state.currentChannel = getCurrentChannel();

        let speed = getDefaultSpeed();

        if (isPerChannelMode() && state.currentChannel) {
            const channelSpeed = getChannelSpeed(state.currentChannel);
            if (channelSpeed !== null) {
                speed = channelSpeed;
                console.log(`[YouTube Speed v14] 📺 Loaded ${speed}x for channel: ${state.currentChannel}`);
            } else {
                console.log(`[YouTube Speed v14] 📺 New channel: ${state.currentChannel}, using default ${speed}x`);
            }
        }

        state.currentSpeed = speed;
        applySpeed();
        updateUI();
    }

    function applySpeed() {
        const video = document.querySelector('video');
        if (video && Math.abs(video.playbackRate - state.currentSpeed) > 0.01) {
            video.playbackRate = state.currentSpeed;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 UI UPDATES
    // ═══════════════════════════════════════════════════════════════════════════

    function updateUI() {
        // Update button text
        const text = document.getElementById('ytspeed-text');
        if (text) text.textContent = state.currentSpeed + 'x';

        // Update button style for channel mode
        if (state.btn) {
            const hasChannelSpeed = isPerChannelMode() && state.currentChannel && getChannelSpeed(state.currentChannel) !== null;
            state.btn.classList.toggle('has-channel', hasChannelSpeed);
        }

        // Update active speed in menu
        if (state.menu) {
            state.menu.querySelectorAll('.ytspeed-item').forEach(item => {
                const speed = parseFloat(item.getAttribute('data-speed'));
                item.classList.toggle('active', Math.abs(speed - state.currentSpeed) < 0.01);
            });
        }

        updateChannelInfo();
    }

    function updateChannelInfo() {
        const channelInfo = document.getElementById('ytspeed-channel-info');
        if (!channelInfo) return;

        state.currentChannel = getCurrentChannel();

        if (state.currentChannel) {
            const displayName = state.currentChannel.startsWith('@') 
                ? state.currentChannel 
                : state.currentChannel.startsWith('name:') 
                    ? state.currentChannel.substring(5) 
                    : state.currentChannel.substring(0, 15) + '...';

            const savedSpeed = getChannelSpeed(state.currentChannel);
            if (savedSpeed !== null && isPerChannelMode()) {
                channelInfo.innerHTML = `📺 <strong>${displayName}</strong> → ${savedSpeed}x`;
            } else {
                channelInfo.innerHTML = `📺 <strong>${displayName}</strong> <span style="color:#666">(new)</span>`;
            }
        } else {
            channelInfo.innerHTML = 'Channel: <strong>detecting...</strong>';
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 📍 INSERTION
    // ═══════════════════════════════════════════════════════════════════════════

    function insertButton() {
        if (document.getElementById('ytspeed-wrapper')) {
            state.inserted = true;
            state.btn = document.getElementById('ytspeed-btn');
            state.menu = document.getElementById('ytspeed-menu');
            return;
        }

        const targets = [
            '#owner',
            '#top-row #owner',
            'ytd-watch-metadata #owner',
            '#above-the-fold #owner'
        ];

        let owner = null;
        for (const sel of targets) {
            owner = document.querySelector(sel);
            if (owner) break;
        }

        if (!owner) return;

        const wrapper = createElements();

        if (owner.nextSibling) {
            owner.parentNode.insertBefore(wrapper, owner.nextSibling);
        } else {
            owner.parentNode.appendChild(wrapper);
        }

        state.inserted = true;
        console.log('[YouTube Speed v14] ⚡ Button inserted!');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ⌨️ KEYBOARD SHORTCUTS
    // ═══════════════════════════════════════════════════════════════════════════

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

        if (e.key === '[') setSpeed(Math.max(0.25, state.currentSpeed - 0.25));
        if (e.key === ']') setSpeed(Math.min(4, state.currentSpeed + 0.25));
        if (e.key === '\\') setSpeed(1);
        if (e.key === 'p' || e.key === 'P') setSpeed(1.25);
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // 🖱️ CLOSE MENU ON OUTSIDE CLICK
    // ═══════════════════════════════════════════════════════════════════════════

    document.addEventListener('click', (e) => {
        if (state.isOpen && state.btn && state.menu && 
            e.target !== state.btn && !state.btn.contains(e.target) && !state.menu.contains(e.target)) {
            state.isOpen = false;
            state.menu.classList.remove('open');
            state.btn.classList.remove('open');
        }
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════

    function init() {
        insertButton();
        loadSpeedForCurrentChannel();
    }

    init();

    // Watch for page changes
    const observer = new MutationObserver(() => {
        if (!document.getElementById('ytspeed-wrapper')) state.inserted = false;
        if (!state.inserted) init();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // YouTube SPA navigation
    document.addEventListener('yt-navigate-finish', () => {
        state.inserted = false;
        state.currentChannel = null;
        setTimeout(init, 500);
    });

    // Keep speed applied
    setInterval(applySpeed, 1000);

    // Periodically check for channel changes (for playlists, autoplay)
    setInterval(() => {
        const newChannel = getCurrentChannel();
        if (newChannel && newChannel !== state.currentChannel) {
            console.log(`[YouTube Speed v14] 📺 Channel changed: ${state.currentChannel} → ${newChannel}`);
            loadSpeedForCurrentChannel();
        }
    }, 2000);

})();