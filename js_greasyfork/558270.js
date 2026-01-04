// ==UserScript==
// @name         Universal Force to High-Fidelity Video 
// @namespace    https://github.com/aezizhu/Universal-High-Fidelity-Video-Automation
// @version      0.1.1
// @homepageURL  https://github.com/aezizhu/Universal-High-Fidelity-Video-Automation
// @source       https://github.com/aezizhu/Universal-High-Fidelity-Video-Automation
// @supportURL   https://github.com/aezizhu/Universal-High-Fidelity-Video-Automation/issues
// @compatible   chrome Tampermonkey
// @description  Force highest quality on YouTube, Netflix, Vimeo, Twitch, Bilibili, Prime Video, Disney+, HBO Max, Twitter/X, Facebook, Dailymotion & more
// @author       aezizhu
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558270/Universal%20Force%20to%20High-Fidelity%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/558270/Universal%20Force%20to%20High-Fidelity%20Video.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==========================================
    // Core Infrastructure: Constants & Config
    // ==========================================

    const LOG_PREFIX = '[UVHF]';

    const DEFAULT_CONFIG = {
        enabled: true,
        targetResolution: 'max', // 'max', '4k', '2k', '1080p'
        forceAV1: true,
        allow60fps: true,
        autoSkipAds: true,
        speedHackAds: false, // Opt-in, experimental
        redirectShorts: true,
        volumeOverride: -1, // -1 means disabled
        debugMode: false,
        excludedDomains: []
    };

    // Graceful GM API wrapper for environments where some APIs are missing.
    const GMShim = {
        get: typeof GM_getValue === 'function' ? GM_getValue : () => null,
        set: typeof GM_setValue === 'function' ? GM_setValue : () => undefined,
        addListener: typeof GM_addValueChangeListener === 'function' ? GM_addValueChangeListener : null,
        registerMenu: typeof GM_registerMenuCommand === 'function' ? GM_registerMenuCommand : null
    };

    /**
     * Configuration Manager
     * Handles persistent storage and cross-tab synchronization.
     */
    class ConfigManager {
        constructor() {
            this.config = { ...DEFAULT_CONFIG };
            this.listeners = [];
            this.load();
            this.initSync();
        }

        load() {
            try {
                const stored = GMShim.get('uvhf_config');
                if (stored) {
                    const parsed = typeof stored === 'string' ? JSON.parse(stored) : stored;
                    if (parsed && typeof parsed === 'object') {
                        this.config = { ...DEFAULT_CONFIG, ...parsed }; // Merge to handle new keys
                    }
                }
            } catch (e) {
                console.error(`${LOG_PREFIX} Failed to load config:`, e);
            }
        }

        save() {
            try {
                GMShim.set('uvhf_config', JSON.stringify(this.config));
            } catch (e) {
                console.error(`${LOG_PREFIX} Failed to save config:`, e);
            }
        }

        get(key) {
            return this.config[key];
        }

        set(key, value) {
            this.config[key] = value;
            this.save();
            this.notifyListeners(key, value);
        }

        addListener(callback) {
            this.listeners.push(callback);
        }

        notifyListeners(key, value) {
            this.listeners.forEach(cb => cb(key, value));
        }

        initSync() {
            if (typeof GMShim.addListener !== 'function') {
                Logger.warn('Value change listener not available; sync disabled.');
                return;
            }

            GMShim.addListener('uvhf_config', (name, oldVal, newVal, remote) => {
                if (remote) {
                    this.load();
                    Logger.log('Config synced from another tab');
                    // We might need to trigger a re-eval if critical settings changed
                }
            });
        }

        isDomainExcluded() {
            const hostname = window.location.hostname;
            return this.config.excludedDomains.some(domain => hostname.includes(domain));
        }
    }

    // ==========================================
    // Core Infrastructure: Logging & UI
    // ==========================================

    /**
     * Logger Utility
     * Centralized logging with debug mode support.
     */
    const Logger = {
        log: (...args) => {
            if (Config.get('debugMode')) {
                console.log(LOG_PREFIX, ...args);
            }
        },
        info: (...args) => {
            console.info(LOG_PREFIX, ...args);
        },
        warn: (...args) => {
            console.warn(LOG_PREFIX, ...args);
        },
        error: (...args) => {
            console.error(LOG_PREFIX, ...args);
        }
    };


    // ==========================================
    // Phase 3: Discovery Layer
    // ==========================================

    const ShadowRegistry = new WeakMap();

    /**
     * Intercepts Element.prototype.attachShadow to track closed shadow roots.
     * Must run at document-start.
     */
    function installShadowProxy() {
        try {
            if (!Element.prototype.attachShadow) return;
            const originalAttachShadow = Element.prototype.attachShadow;
            Element.prototype.attachShadow = function (init) {
                const root = originalAttachShadow.call(this, init);
                ShadowRegistry.set(this, root);
                return root;
            };
            Logger.info('Element.prototype.attachShadow proxied.');
        } catch (e) {
            Logger.error('Failed to proxy attachShadow:', e);
        }
    }

    /**
     * Discovery Layer
     * Recursively traverses DOM and Shadow DOMs to find video elements.
     */
    class DiscoveryEngine {
        constructor() {
            this.videoElements = new Set();
            this.observers = new Map(); // root -> MutationObserver
            // Debounce scan requests to improve performance
            this.scanQueue = new Set();
            this.scanTimer = null;
        }

        init() {
            // Start observing the main document
            if (document.body) {
                this.observe(document.body);
                this.scan(document.body);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    this.observe(document.body);
                    this.scan(document.body);
                });
            }
        }

        /**
         * Recursively scans a root and its children/shadow roots for video elements.
         */
        scan(root) {
            if (!root) return;

            // 1. Check direct video elements
            // We use querySelectorAll to find nested ones in light DOM
            try {
                const videos = root.querySelectorAll('video');
                videos.forEach(v => this.registerVideo(v));
            } catch (e) {
                Logger.warn('Video query failed', e);
            }

            // 2. Check for shadow roots (Recursive Step)
            // Note: querySelectorAll('*') is expensive on large trees, 
            // but necessary to find elements with shadow roots.
            // Optimization: Only scan custom elements (containing '-') or specific known containers?
            // For universal support, we must scan '*' but we can rely on MutationObserver for updates.
            try {
                const candidates = root.querySelectorAll('*');
                candidates.forEach(el => {
                    this.checkShadow(el);
                });
            } catch (e) {
                Logger.warn('Shadow candidate scan failed', e);
            }
        }

        checkShadow(el) {
            let shadow = el.shadowRoot;
            if (!shadow && ShadowRegistry.has(el)) {
                shadow = ShadowRegistry.get(el);
            }

            if (shadow && !this.observers.has(shadow)) {
                Logger.log('Scanning new Shadow Root:', el);
                this.observe(shadow);
                this.scan(shadow);
            }
        }

        registerVideo(videoEl) {
            if (this.videoElements.has(videoEl)) return;
            this.videoElements.add(videoEl);
            Logger.info('Found video element:', videoEl.src || '<no-src>');

            // TODO: Hook into Orchestrator or Decision Engine
            // window.dispatchEvent(new CustomEvent('uvhf-video-found', { detail: videoEl }));
        }

        observe(targetNode) {
            if (!targetNode || this.observers.has(targetNode)) return;

            if (typeof MutationObserver !== 'function') return;
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // Check if the node itself is a video
                                if (node.tagName === 'VIDEO') this.registerVideo(node);

                                // Check if it has a shadow root immediately
                                this.checkShadow(node);

                                // Scan its subtree
                                this.scan(node);
                            }
                        });
                    }
                });
            });

            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
            this.observers.set(targetNode, observer);
        }
    }

    // ==========================================
    // Phase 4: Orchestration Layer
    // ==========================================

    const MSG_TYPE = {
        HELLO: 'UVHF_HELLO',
        REGISTER: 'UVHF_REGISTER',
        SET_QUALITY: 'UVHF_SET_QUALITY',
        ACK: 'UVHF_ACK'
    };

    class OrchestrationEngine {
        constructor() {
            this.isTop = (window === window.top);
            this.agents = new Map(); // sourceWindow -> metadata
            this.agentId = Math.random().toString(36).substr(2, 9);
        }

        init() {
            window.addEventListener('message', this.handleMessage.bind(this));

            if (this.isTop) {
                Logger.info(`Orchestrator: Controller started (ID: ${this.agentId})`);
            } else {
                Logger.info(`Orchestrator: Agent started (ID: ${this.agentId})`);
                this.sendHello();
            }
        }

        handleMessage(event) {
            const data = event.data;
            if (!data || !data.uvhf_type) return;

            switch (data.uvhf_type) {
                case MSG_TYPE.HELLO:
                    if (this.isTop) this.handleHello(event.source, data.payload);
                    break;
                case MSG_TYPE.SET_QUALITY:
                    Logger.log('Received quality command:', data.payload);
                    // TODO: Trigger Quality Engine
                    break;
            }
        }

        sendHello() {
            try {
                window.top.postMessage({
                    uvhf_type: MSG_TYPE.HELLO,
                    payload: {
                        id: this.agentId,
                        url: window.location.href
                    }
                }, '*');
            } catch (e) {
                Logger.warn('Failed to post HELLO to top window', e);
            }
        }

        handleHello(sourceWindow, payload) {
            if (!this.agents.has(sourceWindow)) {
                this.agents.set(sourceWindow, payload);
                Logger.info('Orchestrator: Registered agent from', payload.url);
            }
        }

        broadcast(type, payload) {
            if (!this.isTop) return;
            this.agents.forEach((meta, win) => {
                try {
                    win.postMessage({
                        uvhf_type: type,
                        payload: payload
                    }, '*');
                } catch (e) {
                    this.agents.delete(win);
                }
            });
        }

        jailbreakIframe(iframe) {
            if (iframe.hasAttribute('sandbox')) {
                const val = iframe.getAttribute('sandbox');
                // Check if it's missing critical permissions
                if (val.trim() !== '' && (!val.includes('allow-scripts') || !val.includes('allow-same-origin'))) {
                    Logger.warn('Orchestrator: Jailbreaking restrictive iframe:', iframe);
                    // Add necessary permissions
                    let newVal = val + ' allow-scripts allow-same-origin allow-forms allow-popups allow-presentation';
                    iframe.setAttribute('sandbox', newVal);
                }
            }
        }
    }

    // ==========================================
    // Phase 5: State Management & SPA Support
    // ==========================================

    class StateManager {
        constructor() {
            this.lastUrl = location.href;
        }

        init() {
            this.hookHistory();
            window.addEventListener('popstate', () => this.handleNavigation());
            window.addEventListener('locationchange', () => this.handleNavigation());
        }

        hookHistory() {
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = function (...args) {
                const ret = originalPushState.apply(this, args);
                window.dispatchEvent(new Event('locationchange'));
                return ret;
            };

            history.replaceState = function (...args) {
                const ret = originalReplaceState.apply(this, args);
                window.dispatchEvent(new Event('locationchange'));
                return ret;
            };
        }

        handleNavigation() {
            // Some SPAs update URL multiple times or strangely, checks are good
            // but we might want to re-scan even if URL is same but content swapped (rare but possible)
            // For now, strict URL change + debounce is safer.
            // Check if URL actually changed or if it was just a hash change? 
            // Generic video sites might use hash.

            // We'll trust the event fire for now.
            Logger.info('SPA Navigation detected, scheduling scan.');

            // Allow DOM to settle (hydration)
            // Long debounce because frameworks are slow
            setTimeout(() => {
                Logger.log('Triggering re-scan after navigation');
                // Access global Discovery instance
                if (typeof Discovery !== 'undefined') {
                    Discovery.scan(document.body);
                }
            }, 1000);
        }
    }

    // ==========================================
    // Phase 6: Quality Decision Logic
    // ==========================================

    class QualityEngine {
        constructor() {
            this.codecBonus = {
                'av1': 200,
                'vp9': 100,
                'h264': 0,
                'avc1': 0
            };
        }

        /**
         * Parses text labels (e.g. "1080p60") into numeric data.
         */
        parseLabel(label) {
            if (typeof label !== 'string') return null;
            const original = label;
            label = label.toLowerCase();

            const result = {
                height: 0,
                fps: 30,
                isHDR: label.includes('hdr'),
                isPremium: label.includes('premium') || label.includes('vip') || label.includes('plus') || label.includes('lock'),
                score: 0,
                originalLabel: original
            };

            // Resolution
            const resMatch = label.match(/(\d{3,4})[p|k]?/);
            if (resMatch) {
                let val = parseInt(resMatch[1]);
                if (val < 10) val *= 1000; // 4K -> 4000ish (usually 2160 but label might say 4k)
                result.height = val;
            } else if (label.includes('4k') || label.includes('uhd')) {
                result.height = 2160;
            } else if (label.includes('8k')) {
                result.height = 4320;
            } else if (label.includes('hd')) {
                result.height = 1080; // optimistic default
            }

            // FPS
            if (label.includes('60') || label.includes('50')) {
                result.fps = 60;
            }

            result.score = this.calculateScore(result);
            return result;
        }

        calculateScore(meta) {
            // Block premium content if logic dictates. 
            // We give it a massive penalty so it's never selected automatically.
            if (meta.isPremium) return -99999;

            let score = meta.height * 10;
            if (meta.fps > 30) score += 100;
            if (meta.isHDR) score += 50;

            return score;
        }

        async checkDRM() {
            if (navigator.requestMediaKeySystemAccess) {
                try {
                    await navigator.requestMediaKeySystemAccess('com.widevine.alpha', [{
                        initDataTypes: ['cenc'],
                        videoCapabilities: [{ contentType: 'video/mp4; codecs="avc1.42E01E"' }]
                    }]);
                    return true;
                } catch (e) {
                    Logger.warn('Widevine DRM check failed');
                    return false;
                }
            }
            return true;
        }
    }

    // ==========================================
    // Phase 7: Interaction Layer
    // ==========================================

    class InteractionEngine {

        /**
         * Dispatches a highly realistic trusted event.
         */
        click(element) {
            if (!element) return;

            const rect = element.getBoundingClientRect();
            // Randomize click position slightly within the element to mitigate bot detection
            const x = rect.left + (rect.width / 2) + (Math.random() * 4 - 2);
            const y = rect.top + (rect.height / 2) + (Math.random() * 4 - 2);

            const eventOptions = {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: x,
                clientY: y,
                buttons: 1
            };

            // Simulate sequence: mousemove -> mousedown -> mouseup -> click
            element.dispatchEvent(new MouseEvent('mousemove', eventOptions));
            element.dispatchEvent(new MouseEvent('mousedown', eventOptions));
            element.dispatchEvent(new MouseEvent('mouseup', eventOptions));
            element.dispatchEvent(new MouseEvent('click', eventOptions));

            Logger.log('Simulated trusted click on:', element);
        }

        /**
         * Wakes up the player controls by moving mouse over the container.
         */
        wakeControls(container) {
            if (!container) return;
            const rect = container.getBoundingClientRect();

            container.dispatchEvent(new MouseEvent('mousemove', {
                bubbles: true,
                clientX: rect.left + 50,
                clientY: rect.top + 50,
                view: window
            }));
            Logger.log('Waking controls on:', container);
        }

        async waitForElement(selector, root = document, timeout = 3000) {
            if (root.querySelector(selector)) return root.querySelector(selector);

            // MutationObserver preferred, fallback to polling if unavailable
            return new Promise(resolve => {
                let timerId;
                const finish = (value) => {
                    if (observer && observer.disconnect) observer.disconnect();
                    if (timerId) clearInterval(timerId);
                    resolve(value);
                };

                let observer = null;
                if (typeof MutationObserver === 'function') {
                    observer = new MutationObserver(() => {
                        const el = root.querySelector(selector);
                        if (el) finish(el);
                    });
                    observer.observe(root, { childList: true, subtree: true });
                } else {
                    timerId = setInterval(() => {
                        const el = root.querySelector(selector);
                        if (el) finish(el);
                    }, 150);
                }

                setTimeout(() => finish(null), timeout);
            });
        }

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    // ==========================================
    // Phase 8: Platform Modules
    // ==========================================

    class PlatformModule {
        constructor(name) {
            this.name = name;
        }
        run() { }
    }

    class YouTubeModule extends PlatformModule {
        constructor() {
            super('YouTube');
        }

        async run() {
            if (!location.hostname.includes('youtube.com')) return;
            Logger.info('YouTube Module Activated');

            this.checkShorts();
            window.addEventListener('locationchange', () => this.checkShorts());
            this.hookPlayer();

            if (Config.get('autoSkipAds')) {
                setInterval(() => this.checkAds(), 1000);
            }
        }

        checkAds() {
            const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .videoAdUiSkipButton');
            if (skipBtn) {
                Logger.info('Clicking Ad Skip Button');
                skipBtn.click();
            }
        }

        checkShorts() {
            if (Config.get('redirectShorts') && location.pathname.startsWith('/shorts/')) {
                const videoId = location.pathname.split('/shorts/')[1];
                if (videoId) {
                    Logger.info('Redirecting Shorts to Watch URL');
                    location.replace('/watch?v=' + videoId);
                }
            }
        }

        async hookPlayer() {
            const player = await Interaction.waitForElement('#movie_player', document, 8000);
            if (!player) {
                Logger.warn('YouTube player not found; skipping quality hook.');
                return;
            }

            Logger.info('YouTube Player API Hooked');
            this.enforceQuality(player);
            setInterval(() => this.enforceQuality(player), 5000);
        }

        enforceQuality(player) {
            try {
                const levels = player.getAvailableQualityLevels?.();
                if (!levels || !levels.length) return;

                const best = levels.find((lvl) => lvl !== 'auto') || levels[0];
                if (!best) return;

                const current = player.getPlaybackQuality?.();
                if (current === best) return;

                if (typeof player.setPlaybackQualityRange === 'function') {
                    player.setPlaybackQualityRange(best, best);
                } else if (typeof player.setPlaybackQuality === 'function') {
                    player.setPlaybackQuality(best);
                }

                Logger.info('Enforced YouTube Quality:', best);
            } catch (e) {
                Logger.warn('Failed to enforce YouTube quality', e);
            }
        }
    }

    class VimeoModule extends PlatformModule {
        constructor() {
            super('Vimeo');
        }

        async run() {
            if (!location.hostname.includes('vimeo.com')) return;
            Logger.info('Vimeo Module Activated');

            this.hookPlayer();
            window.addEventListener('locationchange', () => this.hookPlayer());
        }

        async hookPlayer() {
            await Interaction.sleep(2000);
            setInterval(() => this.enforceQuality(), 3000);
        }

        enforceQuality() {
            try {
                // Vimeo stores player in window
                const player = unsafeWindow.vimeo?.Player || document.querySelector('iframe[src*="player.vimeo"]');

                // Try settings button approach
                const settingsBtn = document.querySelector('[aria-label="Settings"], .vp-prefs, [class*="QualityMenu"]');
                if (settingsBtn && !this._menuOpened) {
                    Interaction.click(settingsBtn);
                    this._menuOpened = true;

                    setTimeout(() => {
                        const qualityOptions = document.querySelectorAll('[role="menuitemradio"], [class*="quality"] button, [class*="Quality"] li');
                        if (qualityOptions.length > 0) {
                            // First option is usually highest
                            const highest = Array.from(qualityOptions).find(el => {
                                const text = el.textContent.toLowerCase();
                                return text.includes('4k') || text.includes('2160') || text.includes('1440') || text.includes('1080');
                            }) || qualityOptions[0];

                            if (highest) {
                                Interaction.click(highest);
                                Logger.info('Vimeo: Selected quality option');
                            }
                        }
                        this._menuOpened = false;
                    }, 500);
                }
            } catch (e) {
                Logger.warn('Vimeo quality enforcement failed', e);
            }
        }
    }

    class TwitchModule extends PlatformModule {
        constructor() {
            super('Twitch');
            this._enforced = false;
        }

        async run() {
            if (!location.hostname.includes('twitch.tv')) return;
            Logger.info('Twitch Module Activated');

            await Interaction.sleep(3000);
            setInterval(() => this.enforceQuality(), 5000);
        }

        async enforceQuality() {
            if (this._enforced) return;

            try {
                // Find settings cog
                const settingsBtn = document.querySelector('[data-a-target="player-settings-button"], [aria-label="Settings"]');
                if (!settingsBtn) return;

                Interaction.click(settingsBtn);
                await Interaction.sleep(300);

                // Find Quality option in menu
                const qualityBtn = document.querySelector('[data-a-target="player-settings-menu-item-quality"]');
                if (qualityBtn) {
                    Interaction.click(qualityBtn);
                    await Interaction.sleep(300);

                    // Select highest quality (first non-auto option)
                    const qualityOptions = document.querySelectorAll('[data-a-target="player-settings-submenu-quality-option"] input');
                    for (const option of qualityOptions) {
                        const label = option.closest('label')?.textContent || '';
                        if (!label.toLowerCase().includes('auto')) {
                            option.click();
                            Logger.info('Twitch: Set quality to', label);
                            this._enforced = true;
                            break;
                        }
                    }
                }

                // Close menu
                document.body.click();
            } catch (e) {
                Logger.warn('Twitch quality enforcement failed', e);
            }
        }
    }

    class BilibiliModule extends PlatformModule {
        constructor() {
            super('Bilibili');
        }

        async run() {
            if (!location.hostname.includes('bilibili.com')) return;
            Logger.info('Bilibili Module Activated');

            await Interaction.sleep(2000);
            this.enforceQuality();
            setInterval(() => this.enforceQuality(), 5000);
        }

        enforceQuality() {
            try {
                // Bilibili uses bpx-player
                const qualityBtn = document.querySelector('.bpx-player-ctrl-quality, .squirtle-quality-wrap');
                if (!qualityBtn) return;

                // Hover to show menu
                qualityBtn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

                setTimeout(() => {
                    // Find quality options - higher number = better quality
                    const options = document.querySelectorAll('.bpx-player-ctrl-quality-menu-item, .squirtle-quality-item');
                    if (options.length > 0) {
                        // First option is usually highest
                        const highest = options[0];
                        if (highest && !highest.classList.contains('bpx-state-active') && !highest.classList.contains('active')) {
                            Interaction.click(highest);
                            Logger.info('Bilibili: Selected highest quality');
                        }
                    }

                    // Close menu
                    qualityBtn.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
                }, 300);
            } catch (e) {
                Logger.warn('Bilibili quality enforcement failed', e);
            }
        }
    }

    class DailymotionModule extends PlatformModule {
        constructor() {
            super('Dailymotion');
        }

        async run() {
            if (!location.hostname.includes('dailymotion.com')) return;
            Logger.info('Dailymotion Module Activated');

            await Interaction.sleep(2000);
            setInterval(() => this.enforceQuality(), 5000);
        }

        enforceQuality() {
            try {
                const settingsBtn = document.querySelector('[aria-label="Settings"], .PlayerControls__settingsButton___');
                if (!settingsBtn) return;

                Interaction.click(settingsBtn);

                setTimeout(() => {
                    const qualityOption = document.querySelector('[data-testid="quality-selector"], [class*="quality"]');
                    if (qualityOption) {
                        Interaction.click(qualityOption);

                        setTimeout(() => {
                            const options = document.querySelectorAll('[role="option"], [class*="QualityItem"]');
                            for (const opt of options) {
                                const text = opt.textContent.toLowerCase();
                                if (text.includes('1080') || text.includes('720') || text.includes('hd')) {
                                    Interaction.click(opt);
                                    Logger.info('Dailymotion: Selected quality');
                                    break;
                                }
                            }
                        }, 300);
                    }
                }, 300);
            } catch (e) {
                Logger.warn('Dailymotion quality enforcement failed', e);
            }
        }
    }

    class NetflixModule extends PlatformModule {
        constructor() {
            super('Netflix');
            this._enforced = false;
        }

        async run() {
            if (!location.hostname.includes('netflix.com')) return;
            Logger.info('Netflix Module Activated');

            // Netflix uses Cadmium player - we need to intercept playback settings
            this.hookNetflix();
            window.addEventListener('locationchange', () => {
                this._enforced = false;
                this.hookNetflix();
            });
        }

        async hookNetflix() {
            await Interaction.sleep(3000);
            setInterval(() => this.enforceQuality(), 2000);
        }

        enforceQuality() {
            if (this._enforced) return;

            try {
                // Netflix stores player API in netflix.appContext
                const videoPlayer = unsafeWindow.netflix?.appContext?.state?.playerApp?.getAPI?.()?.videoPlayer;
                if (videoPlayer) {
                    const playerSessionIds = videoPlayer.getAllPlayerSessionIds?.();
                    if (playerSessionIds?.length > 0) {
                        const player = videoPlayer.getVideoPlayerBySessionId?.(playerSessionIds[0]);
                        if (player) {
                            // Force highest bitrate
                            const tracks = player.getVideoTracks?.();
                            if (tracks?.length > 0) {
                                // Sort by bitrate descending
                                const sorted = [...tracks].sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
                                const highest = sorted[0];
                                if (highest) {
                                    player.setVideoTrack?.(highest.trackId, true);
                                    Logger.info('Netflix: Set to highest bitrate track');
                                    this._enforced = true;
                                }
                            }
                        }
                    }
                }

                // Fallback: keyboard shortcut approach
                if (!this._enforced) {
                    // Ctrl+Shift+Alt+S opens Netflix debug menu on some versions
                    // We'll try the settings menu instead
                    this.trySettingsMenu();
                }
            } catch (e) {
                Logger.warn('Netflix quality enforcement failed', e);
            }
        }

        async trySettingsMenu() {
            // Look for audio/subtitle menu which sometimes has quality
            const menuBtn = document.querySelector('[data-uia="control-audio-subtitle"]');
            if (menuBtn) {
                // Netflix auto-selects based on bandwidth, harder to override via UI
                Logger.log('Netflix: Using adaptive streaming, API override attempted');
            }
        }
    }

    class AmazonPrimeModule extends PlatformModule {
        constructor() {
            super('Amazon Prime');
            this._enforced = false;
        }

        async run() {
            if (!location.hostname.includes('primevideo.com') && !location.hostname.includes('amazon.com/gp/video')) return;
            Logger.info('Amazon Prime Module Activated');

            await Interaction.sleep(3000);
            setInterval(() => this.enforceQuality(), 3000);
        }

        async enforceQuality() {
            if (this._enforced) return;

            try {
                // Find quality/settings button
                const settingsBtn = document.querySelector('[class*="settingsButton"], [aria-label="Options"], [class*="atvwebplayersdk-options"]');
                if (!settingsBtn) return;

                Interaction.click(settingsBtn);
                await Interaction.sleep(500);

                // Look for quality option
                const qualityBtn = document.querySelector('[class*="qualityButton"], [data-testid="quality-selector"]');
                if (qualityBtn) {
                    Interaction.click(qualityBtn);
                    await Interaction.sleep(300);

                    const options = document.querySelectorAll('[class*="qualityOption"], [role="option"]');
                    for (const opt of options) {
                        const text = opt.textContent.toLowerCase();
                        if (text.includes('best') || text.includes('uhd') || text.includes('4k') || text.includes('hd')) {
                            Interaction.click(opt);
                            Logger.info('Amazon Prime: Selected highest quality');
                            this._enforced = true;
                            break;
                        }
                    }
                }

                document.body.click();
            } catch (e) {
                Logger.warn('Amazon Prime quality enforcement failed', e);
            }
        }
    }

    class DisneyPlusModule extends PlatformModule {
        constructor() {
            super('Disney+');
            this._enforced = false;
        }

        async run() {
            if (!location.hostname.includes('disneyplus.com')) return;
            Logger.info('Disney+ Module Activated');

            await Interaction.sleep(3000);
            setInterval(() => this.enforceQuality(), 3000);
        }

        async enforceQuality() {
            if (this._enforced) return;

            try {
                // Disney+ settings icon
                const settingsBtn = document.querySelector('[aria-label="Audio and Subtitles"], [data-testid="settings-button"]');
                if (settingsBtn) {
                    // Disney+ typically auto-selects best quality based on connection
                    // Limited manual override available
                    Logger.log('Disney+: Using adaptive streaming');
                    this._enforced = true;
                }
            } catch (e) {
                Logger.warn('Disney+ quality enforcement failed', e);
            }
        }
    }

    class HBOMaxModule extends PlatformModule {
        constructor() {
            super('HBO Max');
            this._enforced = false;
        }

        async run() {
            if (!location.hostname.includes('max.com') && !location.hostname.includes('hbomax.com')) return;
            Logger.info('HBO Max Module Activated');

            await Interaction.sleep(3000);
            setInterval(() => this.enforceQuality(), 3000);
        }

        async enforceQuality() {
            if (this._enforced) return;

            try {
                const settingsBtn = document.querySelector('[data-testid="settings-button"], [aria-label="Settings"]');
                if (settingsBtn) {
                    Interaction.click(settingsBtn);
                    await Interaction.sleep(300);

                    const qualityOption = document.querySelector('[data-testid="quality-option"]');
                    if (qualityOption) {
                        Interaction.click(qualityOption);
                        await Interaction.sleep(300);

                        const options = document.querySelectorAll('[role="option"], [data-testid*="quality"]');
                        for (const opt of options) {
                            const text = opt.textContent.toLowerCase();
                            if (text.includes('max') || text.includes('high') || text.includes('best')) {
                                Interaction.click(opt);
                                Logger.info('HBO Max: Selected highest quality');
                                this._enforced = true;
                                break;
                            }
                        }
                    }
                }
            } catch (e) {
                Logger.warn('HBO Max quality enforcement failed', e);
            }
        }
    }

    class FacebookModule extends PlatformModule {
        constructor() {
            super('Facebook');
        }

        async run() {
            if (!location.hostname.includes('facebook.com')) return;
            Logger.info('Facebook Video Module Activated');

            setInterval(() => this.enforceQuality(), 3000);
        }

        enforceQuality() {
            try {
                // Facebook video settings
                const videos = document.querySelectorAll('video');
                for (const video of videos) {
                    // Look for HD toggle near video
                    const container = video.closest('[data-video-id], [class*="video"]');
                    if (container) {
                        const hdBtn = container.querySelector('[aria-label*="HD"], [class*="HDLabel"]');
                        if (hdBtn && !hdBtn.classList.contains('selected')) {
                            Interaction.click(hdBtn);
                            Logger.info('Facebook: Enabled HD');
                        }
                    }
                }
            } catch (e) {
                Logger.warn('Facebook quality enforcement failed', e);
            }
        }
    }

    class TwitterModule extends PlatformModule {
        constructor() {
            super('Twitter/X');
        }

        async run() {
            if (!location.hostname.includes('twitter.com') && !location.hostname.includes('x.com')) return;
            Logger.info('Twitter/X Video Module Activated');

            setInterval(() => this.enforceQuality(), 3000);
        }

        enforceQuality() {
            try {
                // Twitter video settings gear
                const settingsBtns = document.querySelectorAll('[aria-label="Settings"], [data-testid="settings"]');
                for (const btn of settingsBtns) {
                    const video = btn.closest('[data-testid="videoPlayer"]')?.querySelector('video');
                    if (video && !this._processed?.has(video)) {
                        this._processed = this._processed || new WeakSet();
                        this._processed.add(video);

                        Interaction.click(btn);
                        setTimeout(() => {
                            const qualityOptions = document.querySelectorAll('[role="menuitemradio"]');
                            // Pick first (highest) option
                            if (qualityOptions.length > 0) {
                                Interaction.click(qualityOptions[0]);
                                Logger.info('Twitter: Selected highest quality');
                            }
                        }, 300);
                    }
                }
            } catch (e) {
                Logger.warn('Twitter quality enforcement failed', e);
            }
        }
    }

    class TikTokModule extends PlatformModule {
        constructor() {
            super('TikTok');
        }

        async run() {
            if (!location.hostname.includes('tiktok.com')) return;
            Logger.info('TikTok Module Activated');

            // TikTok doesn't have quality selector - uses adaptive streaming
            // But we can try to force higher quality via player settings
            Logger.log('TikTok: Using adaptive streaming');
        }
    }

    class GenericVideoModule extends PlatformModule {
        constructor() {
            super('Generic');
            this._processedVideos = new WeakSet();
        }

        async run() {
            // Skip if a specific module already handles this site
            const hostname = location.hostname;
            const knownPlatforms = [
                'youtube.com', 'vimeo.com', 'twitch.tv', 'bilibili.com', 'dailymotion.com',
                'netflix.com', 'primevideo.com', 'amazon.com', 'disneyplus.com',
                'max.com', 'hbomax.com', 'facebook.com', 'twitter.com', 'x.com', 'tiktok.com'
            ];
            if (knownPlatforms.some(h => hostname.includes(h))) {
                return;
            }

            Logger.info('Generic Video Module Activated for:', hostname);

            // Run periodically to catch dynamically loaded players
            setInterval(() => this.scanAndEnforce(), 3000);
            this.scanAndEnforce();
        }

        scanAndEnforce() {
            // Strategy 1: Look for common quality selector patterns
            this.tryGenericQualityMenu();

            // Strategy 2: Handle HTML5 video with multiple sources
            this.handleMultiSourceVideos();
        }

        tryGenericQualityMenu() {
            // Common selectors for quality buttons across many players
            const qualitySelectors = [
                '[aria-label*="uality"]',
                '[aria-label*="ettings"]',
                '[title*="uality"]',
                '[class*="quality"]',
                '[class*="Quality"]',
                '[class*="settings"]',
                '[class*="Settings"]',
                '.vjs-quality-selector',
                '.jw-settings-quality',
                '[data-quality]',
                '.plyr__menu',
                '.video-quality',
                '.resolution-selector'
            ];

            for (const selector of qualitySelectors) {
                try {
                    const btn = document.querySelector(selector);
                    if (btn && !this._processedVideos.has(btn)) {
                        this._processedVideos.add(btn);
                        this.openAndSelectHighest(btn);
                        return;
                    }
                } catch (e) {}
            }
        }

        async openAndSelectHighest(menuBtn) {
            Interaction.click(menuBtn);
            await Interaction.sleep(500);

            // Look for quality options
            const optionSelectors = [
                '[role="menuitem"]',
                '[role="option"]',
                '[class*="quality"] li',
                '[class*="quality"] button',
                '[data-quality]',
                '.vjs-menu-item',
                '.jw-settings-content-item'
            ];

            for (const selector of optionSelectors) {
                const options = document.querySelectorAll(selector);
                if (options.length > 0) {
                    // Score each option and pick the best
                    let best = null;
                    let bestScore = -1;

                    for (const opt of options) {
                        const text = opt.textContent.toLowerCase();
                        let score = 0;

                        if (text.includes('4k') || text.includes('2160')) score = 2160;
                        else if (text.includes('1440') || text.includes('2k')) score = 1440;
                        else if (text.includes('1080')) score = 1080;
                        else if (text.includes('720')) score = 720;
                        else if (text.includes('480')) score = 480;
                        else if (text.includes('hd')) score = 1080;
                        else if (text.includes('high')) score = 720;

                        // Skip auto options
                        if (text.includes('auto')) score = -1;

                        if (score > bestScore) {
                            bestScore = score;
                            best = opt;
                        }
                    }

                    if (best) {
                        Interaction.click(best);
                        Logger.info('Generic: Selected quality option', best.textContent.trim());
                        return;
                    }
                }
            }

            // Close menu if nothing found
            document.body.click();
        }

        handleMultiSourceVideos() {
            const videos = document.querySelectorAll('video');
            for (const video of videos) {
                if (this._processedVideos.has(video)) continue;

                const sources = video.querySelectorAll('source');
                if (sources.length > 1) {
                    this._processedVideos.add(video);

                    // Find highest quality source
                    let best = null;
                    let bestScore = -1;

                    for (const source of sources) {
                        const src = source.src || '';
                        const label = source.getAttribute('label') || source.getAttribute('data-quality') || src;
                        let score = 0;

                        if (label.includes('4k') || label.includes('2160')) score = 2160;
                        else if (label.includes('1440')) score = 1440;
                        else if (label.includes('1080')) score = 1080;
                        else if (label.includes('720')) score = 720;
                        else if (label.includes('480')) score = 480;

                        if (score > bestScore) {
                            bestScore = score;
                            best = source;
                        }
                    }

                    if (best && video.src !== best.src) {
                        const currentTime = video.currentTime;
                        const paused = video.paused;

                        video.src = best.src;
                        video.currentTime = currentTime;
                        if (!paused) video.play();

                        Logger.info('Generic: Switched to highest quality source');
                    }
                }
            }
        }
    }

    class PlatformRegistry {
        constructor() {
            this.modules = [
                new YouTubeModule(),
                new VimeoModule(),
                new TwitchModule(),
                new BilibiliModule(),
                new DailymotionModule(),
                new NetflixModule(),
                new AmazonPrimeModule(),
                new DisneyPlusModule(),
                new HBOMaxModule(),
                new FacebookModule(),
                new TwitterModule(),
                new TikTokModule(),
                new GenericVideoModule()
            ];
        }

        init() {
            this.modules.forEach(m => m.run());
        }
    }

    // ==========================================
    // Phase 10: User Interface (Menu)
    // ==========================================

    function initMenu() {
        if (typeof GMShim.registerMenu !== 'function') {
            Logger.warn('Menu commands not available in this environment.');
            return;
        }

        GMShim.registerMenu(`Toggle Script (${Config.get('enabled') ? 'ON' : 'OFF'})`, () => {
            Config.set('enabled', !Config.get('enabled'));
            location.reload();
        });

        GMShim.registerMenu(`Force AV1: ${Config.get('forceAV1') ? 'ON' : 'OFF'}`, () => {
            Config.set('forceAV1', !Config.get('forceAV1'));
        });

        GMShim.registerMenu(`Redirect Shorts: ${Config.get('redirectShorts') ? 'ON' : 'OFF'}`, () => {
            Config.set('redirectShorts', !Config.get('redirectShorts'));
        });

        GMShim.registerMenu(`Exclude ${location.hostname}`, () => {
            const list = Config.get('excludedDomains');
            if (!list.includes(location.hostname)) {
                list.push(location.hostname);
                Config.set('excludedDomains', list);
                location.reload();
            }
        });

        if (Config.get('debugMode')) {
            GMShim.registerMenu('Dump Debug Info', () => {
                console.log(unsafeWindow.__uvhf_debug);
            });
        }
    }

    // ==========================================
    // Initialization
    // ==========================================

    const Config = new ConfigManager();
    const Orchestrator = new OrchestrationEngine();
    const State = new StateManager();
    const Quality = new QualityEngine();
    const Interaction = new InteractionEngine();
    const Platforms = new PlatformRegistry();

    // Install proxy immediately (Phase 3)
    installShadowProxy();

    const Discovery = new DiscoveryEngine();

    // Expose for debugging
    unsafeWindow.__uvhf_debug = {
        Config,
        Logger,
        Discovery,
        Orchestrator,
        State,
        Quality,
        Interaction,
        Platforms
    };

    Logger.info('Core infrastructure initialized.');

    // Initialize Menu (Phase 10)
    initMenu();

    if (Config.isDomainExcluded()) {
        Logger.info('Domain excluded by user configuration. Script stopping.');
        return;
    }

    if (!Config.get('enabled')) {
        Logger.info('Script disabled by user.');
        return;
    }

    Orchestrator.init();
    Discovery.init();
    State.init();
    Platforms.init();

    // End of Script

})();