// ==UserScript==
// @name         Twitch Stream Info Overlay v2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Display stream uptime, viewer count, quality, and delay in fullscreen/theater mode with customizable settings.
// @author       snook89
// @match        https://www.twitch.tv/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558657/Twitch%20Stream%20Info%20Overlay%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/558657/Twitch%20Stream%20Info%20Overlay%20v2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- UTILS & CONSTANTS ---
    const STORAGE_KEY = 'twitch-overlay-settings-v2';
    const DEFAULT_SETTINGS = {
        position: 'top-right', // top-left, top-right, bottom-left, bottom-right
        showUptime: true,
        showViewers: true,
        showQuality: false,
        showDelay: false,
        showDelay: false,
        opacity: 0.8,
        offsetX: 0,
        offsetY: 0
    };

    const POSITIONS = {
        'top-left': { top: '20px', left: '20px', bottom: 'auto', right: 'auto' },
        'top-right': { top: '20px', right: '20px', bottom: 'auto', left: 'auto' },
        'bottom-left': { bottom: '80px', left: '20px', top: 'auto', right: 'auto' }, // Adjusted for player controls space
        'bottom-right': { bottom: '80px', right: '20px', top: 'auto', left: 'auto' }
    };

    // --- SETTINGS MANAGER ---
    class SettingsManager {
        constructor() {
            this.settings = this.load();
        }

        load() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : { ...DEFAULT_SETTINGS };
            } catch (e) {
                console.error('Failed to load settings', e);
                return { ...DEFAULT_SETTINGS };
            }
        }

        save(newSettings) {
            this.settings = { ...this.settings, ...newSettings };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
            window.dispatchEvent(new CustomEvent('twitch-overlay-settings-changed', { detail: this.settings }));
        }

        get() {
            return this.settings;
        }
    }

    const settingsManager = new SettingsManager();

    // --- UI MANAGER ---
    class OverlayUI {
        constructor() {
            this.element = null;
            this.checkInterval = null;
            this.videoElement = null;
            this.container = null;
            this.streamStartTime = null;
            this.init();
        }

        init() {
            this.element = document.createElement('div');
            this.element.id = 'twitch-stream-info-overlay';
            // Initial dummy style, will be updated by updateStyle
            this.element.style.display = 'none';

            // Listen for settings changes
            window.addEventListener('twitch-overlay-settings-changed', () => this.updateStyle());

            // Start loop
            this.checkInterval = setInterval(() => this.update(), 1000);
        }

        mount(container) {
            if (this.container !== container) {
                this.container = container;
                // Move element to new container
                container.appendChild(this.element);
                this.updateStyle();
            }
        }

        updateStyle() {
            const settings = settingsManager.get();
            const pos = POSITIONS[settings.position] || POSITIONS['top-right'];

            this.element.style.cssText = `
                position: absolute; /* Absolute relative to video player container */
                background: rgba(0, 0, 0, ${settings.opacity});
                color: #efeff1;
                padding: 6px 10px;
                border-radius: 4px;
                font-family: 'Inter', 'Roobert', 'Helvetica Neue', Arial, sans-serif;
                font-size: 13px;
                z-index: 100; /* Usually enough to sit above video but below controls */
                backdrop-filter: blur(4px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                pointer-events: none;
                user-select: none;
                gap: 10px;
                align-items: center;
                white-space: nowrap;
                display: flex;
                top: ${pos.top !== 'auto' ? `calc(${pos.top} + ${settings.offsetY}px)` : 'auto'};
                bottom: ${pos.bottom !== 'auto' ? `calc(${pos.bottom} + ${settings.offsetY}px)` : 'auto'};
                left: ${pos.left !== 'auto' ? `calc(${pos.left} + ${settings.offsetX}px)` : 'auto'};
                right: ${pos.right !== 'auto' ? `calc(${pos.right} + ${settings.offsetX}px)` : 'auto'};
            `;

            if (!this.shouldShow()) {
                this.element.style.display = 'none';
            }
        }

        getVideoElement() {
            if (!this.videoElement || !document.contains(this.videoElement)) {
                this.videoElement = document.querySelector('video');
            }
            return this.videoElement;
        }

        // --- DATA FETCHING ---
        getReactInstance(element) {
            for (const key in element) {
                if (key.startsWith('__reactInternalInstance$') || key.startsWith('__reactFiber$')) {
                    return element[key];
                }
            }
            return null;
        }

        searchReactProps(fiber) {
            // Traverse up to find props with useful data
            let curr = fiber;
            while (curr) {
                if (curr.memoizedProps && curr.memoizedProps.viewerCount) {
                    return curr.memoizedProps;
                }
                curr = curr.return;
            }
            return null;
        }

        getStreamStartTime() {
            // 1. GQL Strategy (Most Reliable)
            const channelName = window.location.pathname.split('/').pop();

            // Only fetch if we haven't successfully fetched yet and we have a channel name
            if (!this.streamStartTime && channelName && !this._gqlFetching) {
                this._gqlFetching = true;

                const query = `
                    query StreamUptime($login: String!) {
                        user(login: $login) {
                            stream {
                                createdAt
                            }
                        }
                    }
                `;

                fetch('https://gql.twitch.tv/gql', {
                    method: 'POST',
                    headers: {
                        'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko', // Public key commonly used by Twitch site
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: query,
                        variables: { login: channelName }
                    })
                })
                    .then(r => r.json())
                    .then(data => {
                        if (data.data?.user?.stream?.createdAt) {
                            this.streamStartTime = new Date(data.data.user.stream.createdAt);
                        }
                    })
                    .catch(e => console.error("GQL Uptime Fetch Failed", e))
                    .finally(() => { this._gqlFetching = false; });
            }

            return this.streamStartTime;
        }

        getUptime() {
            // 1. Date Calculation Strategy
            if (!this.streamStartTime) {
                this.streamStartTime = this.getStreamStartTime();
            }

            if (this.streamStartTime) {
                const now = new Date();
                const diff = now - this.streamStartTime;
                if (diff > 0) {
                    const hours = Math.floor(diff / 3600000);
                    const minutes = Math.floor((diff % 3600000) / 60000);
                    const seconds = Math.floor((diff % 60000) / 1000);
                    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                }
            }

            return '--:--:--';
        }

        getViewers() {
            // 1. Sidebar/Metadata Strategy
            const el = document.querySelector('[data-a-target="animated-channel-viewers-count"]');
            if (el) return el.textContent.trim() + ' viewers';

            // 2. DOM Search for "viewers" text
            const viewerTexts = Array.from(document.querySelectorAll('p, span, div'));
            const target = viewerTexts.find(t =>
                t.textContent &&
                /^\d{1,3}(,\d{3})*(\.\d+)?([KkMm])? viewers?$/i.test(t.textContent.trim()) &&
                t.offsetParent !== null // Visible
            );
            if (target) return target.textContent.trim();

            return '--- viewers';
        }

        getQuality() {
            const video = this.getVideoElement();
            if (!video) return 'Unknown';
            return `${video.videoHeight}p`;
        }

        getDelay() {
            const video = this.getVideoElement();
            if (!video || !video.buffered.length) return '0s';
            const bufferEdge = video.buffered.end(video.buffered.length - 1);
            const delay = Math.max(0, bufferEdge - video.currentTime);
            return `${delay.toFixed(1)}s (buff)`;
        }

        // --- UPDATE LOOP ---
        update() {
            // 1. Find correct container to mount to (Reparenting)
            const newContainer = document.querySelector('.video-player__overlay') ||
                document.querySelector('.video-player__container') ||
                document.querySelector('.highwind-video-player__overlay');

            if (newContainer && this.container !== newContainer) {
                this.mount(newContainer);
            }

            // Force display check more aggressively
            if (!this.shouldShow()) {
                this.element.style.display = 'none';
                return;
            }

            this.element.style.display = 'flex';
            const settings = settingsManager.get();

            let html = '';

            if (settings.showUptime) {
                html += `<div style="display: flex; align-items: center; gap: 4px;">
                            <span style="color: #bf94ff;">⏱️</span>
                            <span style="font-weight: 600; font-variant-numeric: tabular-nums;">${this.getUptime()}</span>
                         </div>`;
            }

            if (settings.showViewers) {
                if (html) html += `<div style="width: 1px; height: 12px; background: rgba(255,255,255,0.2); margin: 0 4px;"></div>`;
                html += `<div style="display: flex; align-items: center; gap: 4px;">
                            <span style="color: #bf94ff;">👁️</span>
                            <span style="font-weight: 600;">${this.getViewers()}</span>
                         </div>`;
            }

            if (settings.showQuality) {
                if (html) html += `<div style="width: 1px; height: 12px; background: rgba(255,255,255,0.2); margin: 0 4px;"></div>`;
                html += `<div style="display: flex; align-items: center; gap: 4px;">
                            <span style="color: #bf94ff;">📺</span>
                            <span style="font-weight: 600;">${this.getQuality()}</span>
                         </div>`;
            }

            if (settings.showDelay) {
                if (html) html += `<div style="width: 1px; height: 12px; background: rgba(255,255,255,0.2); margin: 0 4px;"></div>`;
                html += `<div style="display: flex; align-items: center; gap: 4px;">
                            <span style="color: #bf94ff;">📡</span>
                            <span style="font-weight: 600;">${this.getDelay()}</span>
                         </div>`;
            }

            this.element.innerHTML = html;
        }

        shouldShow() {
            // Check theater or fullscreen or if we are just mounted in player
            const isFullscreen = !!document.fullscreenElement;
            const isTheater = document.body.classList.contains('theatre-mode') ||
                !!document.querySelector('.video-player__container--theatre') ||
                // Fallback: check if 'Exit Theatre Mode' button exists
                !!document.querySelector('button[aria-label="Exit Theatre Mode (alt+t)"]');

            const videoExists = !!this.getVideoElement();

            return (isFullscreen || isTheater) && videoExists;
        }
    }

    // --- SETTINGS UI ---
    class SettingsUI {
        constructor() {
            this.modalId = 'twitch-overlay-settings-modal';
            this.initObserver();
        }

        initObserver() {
            // Observe chat header to inject button
            const observer = new MutationObserver(() => this.tryInjectButton());
            observer.observe(document.body, { childList: true, subtree: true });
            // Initial check
            setTimeout(() => this.tryInjectButton(), 2000);
        }

        tryInjectButton() {
            // Find "Chat Settings" button (The gear icon)
            const chatSettingsBtn = document.querySelector('[data-a-target="chat-settings"]');
            if (chatSettingsBtn && !document.getElementById('twitch-overlay-settings-btn')) {
                const btn = document.createElement('button');
                btn.id = 'twitch-overlay-settings-btn';
                btn.innerHTML = `
                    <div style="display: flex; align-items: center; padding: 0 4px;">
                       <span style="font-size: 14px;">🛠️</span>
                    </div>
                `;
                // Mimic twitch button styles roughly
                btn.className = chatSettingsBtn.className;
                // Remove some classes if they cause layout issues, but typically keeping them matches theme
                btn.style.marginLeft = '4px';
                btn.style.cursor = 'pointer';
                btn.title = "Overlay Settings";

                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleModal();
                };

                chatSettingsBtn.parentNode.insertBefore(btn, chatSettingsBtn);
            }
        }

        toggleModal() {
            let modal = document.getElementById(this.modalId);
            if (modal) {
                modal.remove();
                return;
            }
            this.createModal();
        }

        createModal() {
            const settings = settingsManager.get();

            const modal = document.createElement('div');
            modal.id = this.modalId;
            modal.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #18181b;
                border: 1px solid #2f2f35;
                border-radius: 8px;
                padding: 20px;
                z-index: 10001;
                width: 300px;
                color: #efeff1;
                font-family: 'Inter', sans-serif;
                box-shadow: 0 10px 20px rgba(0,0,0,0.5);
            `;

            const createToggle = (label, key) => `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <label>${label}</label>
                    <input type="checkbox" id="setting-${key}" ${settings[key] ? 'checked' : ''} style="cursor: pointer;">
                </div>
            `;

            modal.innerHTML = `
                <h3 style="margin: 0 0 16px 0; font-size: 18px; border-bottom: 1px solid #333; padding-bottom: 8px;">Twitch Overlay Settings</h3>

                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px;">Position</label>
                    <select id="setting-position" style="width: 100%; padding: 6px; background: #2f2f35; color: white; border: none; border-radius: 4px;">
                        <option value="top-left" ${settings.position === 'top-left' ? 'selected' : ''}>Top Left</option>
                        <option value="top-right" ${settings.position === 'top-right' ? 'selected' : ''}>Top Right</option>
                        <option value="bottom-left" ${settings.position === 'bottom-left' ? 'selected' : ''}>Bottom Left</option>
                        <option value="bottom-right" ${settings.position === 'bottom-right' ? 'selected' : ''}>Bottom Right</option>
                    </select>
                </div>

                ${createToggle('Show Uptime', 'showUptime')}
                ${createToggle('Show Viewers', 'showViewers')}
                ${createToggle('Show Quality', 'showQuality')}
                ${createToggle('Show Delay (Buffer)', 'showDelay')}

                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px;">Opacity: <span id="opacity-val">${settings.opacity}</span></label>
                    <input type="range" id="setting-opacity" min="0.1" max="1.0" step="0.1" value="${settings.opacity}" style="width: 100%;">
                </div>

                <div style="display: flex; gap: 10px; margin-bottom: 16px;">
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 8px;">Offset X (px)</label>
                        <input type="number" id="setting-offsetX" value="${settings.offsetX}" style="width: 100%; padding: 6px; background: #2f2f35; color: white; border: none; border-radius: 4px;">
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 8px;">Offset Y (px)</label>
                        <input type="number" id="setting-offsetY" value="${settings.offsetY}" style="width: 100%; padding: 6px; background: #2f2f35; color: white; border: none; border-radius: 4px;">
                    </div>
                </div>

                <div style="margin-top: 20px; text-align: right;">
                    <button id="close-settings" style="background: #9147ff; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Save & Close</button>
                </div>
            `;

            // Overlay click to close
            const backdrop = document.createElement('div');
            backdrop.style.cssText = `
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.5); z-index: 10000;
            `;
            backdrop.onclick = () => { modal.remove(); backdrop.remove(); };

            document.body.appendChild(backdrop);
            document.body.appendChild(modal);

            // Bind events
            document.getElementById('setting-opacity').oninput = (e) => {
                document.getElementById('opacity-val').textContent = e.target.value;
            };

            document.getElementById('close-settings').onclick = () => {
                const newSettings = {
                    position: document.getElementById('setting-position').value,
                    showUptime: document.getElementById('setting-showUptime').checked,
                    showViewers: document.getElementById('setting-showViewers').checked,
                    showQuality: document.getElementById('setting-showQuality').checked,
                    showDelay: document.getElementById('setting-showDelay').checked,
                    opacity: parseFloat(document.getElementById('setting-opacity').value),
                    offsetX: parseInt(document.getElementById('setting-offsetX').value) || 0,
                    offsetY: parseInt(document.getElementById('setting-offsetY').value) || 0
                };
                settingsManager.save(newSettings);
                modal.remove();
                backdrop.remove();
            };
        }
    }

    // --- INITIALIZE ---
    function init() {
        console.log('Twitch Overlay v2 Loading...');
        new OverlayUI();
        new SettingsUI();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
