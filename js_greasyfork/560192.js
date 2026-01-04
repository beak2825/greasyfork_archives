// ==UserScript==
// @name         🦅 AeroStream PRO v2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @license MIT
// @description  Advanced CloudFlare bypass for GetInkspired story boosting
// @author       AeroDLL
// @match        https://getinkspired.com/*
// @match        https://*.getinkspired.com/*
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">🦅</text></svg>
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_info
// @connect      *
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/560192/%F0%9F%A6%85%20AeroStream%20PRO%20v20.user.js
// @updateURL https://update.greasyfork.org/scripts/560192/%F0%9F%A6%85%20AeroStream%20PRO%20v20.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        // Core Settings
        AUTO_START: true,
        AUTO_RESTART: true,
        VDS_MODE: true,
        AFK_MODE: true,

        // Timing (Optimized for story boosting)
        MIN_VIEW_TIME: 35000,          // Minimum 35 seconds
        MAX_VIEW_TIME: 75000,          // Maximum 75 seconds
        MIN_DELAY_BETWEEN_VIEWS: 12000, // 12 seconds between views
        MAX_DELAY_BETWEEN_VIEWS: 30000, // 30 seconds between views

        // Session Management
        SESSION_DURATION: 2700000,     // 45 minutes
        BREAK_DURATION: 600000,        // 10 minutes break
        VIEWS_PER_SESSION: 30,         // Max views per session

        // Anti-Detection (Enhanced for VDS)
        STEALTH_MODE: true,
        HUMAN_BEHAVIOR: true,
        RANDOM_SCROLL: true,
        MOUSE_MOVEMENT: true,
        KEYBOARD_SIMULATION: true,
        CANVAS_FINGERPRINT_SPOOF: true,
        WEBGL_FINGERPRINT_SPOOF: true,
        TIMEZONE_SPOOFING: true,
        LANGUAGE_SPOOFING: true,
        SCREEN_SPOOFING: true,
        WEBRTC_DISABLE: true,
        SERVICE_WORKER_DISABLE: true,

        // CloudFlare Bypass (Enhanced)
        CF_BYPASS_ENABLED: true,
        CF_WAIT_TIME: 15000,
        CF_MAX_RETRIES: 12,
        CF_CHALLENGE_SOLVER: true,
        CF_USER_AGENT_ROTATION: true,
        CF_REFERER_ROTATION: true,

        // Headers
        CUSTOM_HEADERS: true,
        REFERER_ROTATION: true,
        USER_AGENT_ROTATION: true,

        // Targets
        TARGET_DAILY_VIEWS: 1000,
        MAX_ERRORS_ALLOWED: 25,

        // Notifications
        SHOW_NOTIFICATIONS: true,
        NOTIFY_ON_MILESTONE: true,
        MILESTONE_INTERVAL: 100,

        // Data Management
        SAVE_STATS: true,
        AUTO_BACKUP: true,

        // Advanced Security
        MEMORY_CLEANUP: true,
        CACHE_BYPASS: true,
        REFRESH_SESSION: true,
        ERROR_RECOVERY: true,
        IP_ROTATION_SIMULATION: true
    };

    // ==================== USER AGENTS ====================
    const USER_AGENTS = {
        desktop: [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0'
        ],
        mobile: [
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Android 14; Mobile; rv:109.0) Gecko/114.0 Firefox/114.0',
            'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.43 Mobile Safari/537.36'
        ]
    };

    // ==================== REFERERS ====================
    const REFERERS = [
        'https://www.google.com/',
        'https://www.google.com.tr/',
        'https://www.bing.com/',
        'https://duckduckgo.com/',
        'https://www.reddit.com/',
        'https://twitter.com/',
        'https://www.facebook.com/',
        'https://www.linkedin.com/',
        'https://www.instagram.com/',
        'https://tr.search.yahoo.com/',
        'https://yandex.com.tr/'
    ];

    // ==================== CLOUDFLARE BYPASS ====================
    class CloudFlareBypass {
        constructor(bot) {
            this.bot = bot;
            this.challengeDetected = false;
            this.bypassAttempts = 0;
            this.userAgentHistory = [];
        }

        async detectChallenge() {
            // CloudFlare challenge detection
            const cfSelectors = [
                'iframe[src*="cloudflare"]',
                '.cf-challenge',
                '#cf-wrapper',
                '.captcha-container',
                '[id*="challenge"]',
                '.g-recaptcha',
                '.cf-browser-verification',
                '.cf-im-under-attack'
            ];

            // Check for CF challenge elements
            for (let selector of cfSelectors) {
                if (document.querySelector(selector)) {
                    this.challengeDetected = true;
                    return true;
                }
            }

            // Check for CF error messages
            const errorMessages = [
                'Access denied',
                'Error 1020',
                'blocked',
                'Just a moment',
                'Checking your browser',
                'Please wait while we verify'
            ];

            const pageText = document.body.textContent.toLowerCase();
            for (let error of errorMessages) {
                if (pageText.includes(error.toLowerCase())) {
                    this.challengeDetected = true;
                    return true;
                }
            }

            // Check title
            if (document.title.includes('Access denied') ||
                document.title.includes('Just a moment')) {
                    this.challengeDetected = true;
                    return true;
                }

            return false;
        }

        async solveChallenge() {
            try {
                this.bot.log('CloudFlare challenge detected', 'warning');

                // User-Agent rotation
                if (CONFIG.CF_USER_AGENT_ROTATION) {
                    const deviceType = Math.random() > 0.7 ? 'mobile' : 'desktop';
                    const userAgentList = USER_AGENTS[deviceType];
                    const randomUA = userAgentList[Math.floor(Math.random() * userAgentList.length)];

                    Object.defineProperty(navigator, 'userAgent', {
                        get: () => randomUA,
                        configurable: true
                    });

                    // Platform spoofing
                    const platforms = {
                        desktop: ['Win32', 'Win64', 'MacIntel', 'Linux x86_64'],
                        mobile: ['iPhone', 'Android', 'Linux armv8l']
                    };

                    const platformList = platforms[deviceType];
                    const randomPlatform = platformList[Math.floor(Math.random() * platformList.length)];

                    Object.defineProperty(navigator, 'platform', {
                        get: () => randomPlatform,
                        configurable: true
                    });
                }

                // Wait for challenge to complete
                await this.sleep(CONFIG.CF_WAIT_TIME);

                // Check if challenge is resolved
                const challengeResolved = !await this.detectChallenge();

                if (challengeResolved) {
                    this.bot.log('CloudFlare challenge bypassed', 'success');
                    this.bypassAttempts = 0;
                    this.challengeDetected = false;
                    return true;
                } else {
                    this.bypassAttempts++;
                    this.bot.log(`CloudFlare bypass attempt ${this.bypassAttempts}/${CONFIG.CF_MAX_RETRIES}`, 'error');
                    return false;
                }
            } catch (error) {
                this.bot.log(`CloudFlare bypass error: ${error.message}`, 'error');
                return false;
            }
        }

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    // ==================== ANTI-DETECTION ====================
    class AdvancedAntiDetection {
        constructor(bot) {
            this.bot = bot;
            this.initAllProtections();
        }

        initAllProtections() {
            this.disableWebRTC();
            this.disableServiceWorkers();
            this.spoofNavigator();
            this.spoofWebGL();
            this.spoofCanvas();
            this.spoofScreen();
            this.spoofTimezone();
            this.spoofLanguages();
            this.spoofPlugins();
            this.spoofPermissions();
            this.spoofHistory();
        }

        disableWebRTC() {
            if (!CONFIG.WEBRTC_DISABLE) return;

            try {
                const RTCPeerConnection = window.RTCPeerConnection ||
                                        window.webkitRTCPeerConnection ||
                                        window.mozRTCPeerConnection;

                if (RTCPeerConnection) {
                    window.RTCPeerConnection = function() {
                        return {
                            createDataChannel: () => {},
                            createOffer: () => Promise.resolve(),
                            createAnswer: () => Promise.resolve(),
                            setLocalDescription: () => Promise.resolve(),
                            setRemoteDescription: () => Promise.resolve(),
                            addIceCandidate: () => Promise.resolve(),
                            close: () => {},
                            onicecandidate: null,
                            ondatachannel: null
                        };
                    };
                }
            } catch (e) {
                console.warn('WebRTC disable failed:', e);
            }
        }

        disableServiceWorkers() {
            if (!CONFIG.SERVICE_WORKER_DISABLE) return;

            try {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function(registrations) {
                        for(let registration of registrations) {
                            registration.unregister();
                        }
                    });

                    const originalRegister = navigator.serviceWorker.register;
                    navigator.serviceWorker.register = function() {
                        return Promise.reject(new Error('Service Worker registration blocked'));
                    };
                }
            } catch (e) {
                console.warn('Service Worker disable failed:', e);
            }
        }

        spoofNavigator() {
            // WebDriver protection
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });

            // Chrome properties
            window.chrome = {
                runtime: {},
                loadTimes: function() {},
                csi: function() {},
                app: {
                    isInstalled: false,
                    InstallState: {
                        DISABLED: 'disabled',
                        INSTALLED: 'installed',
                        NOT_INSTALLED: 'not_installed'
                    }
                }
            };
        }

        spoofWebGL() {
            if (!CONFIG.WEBGL_FINGERPRINT_SPOOF) return;

            const vendors = ['Intel Inc.', 'NVIDIA Corporation', 'AMD', 'Apple'];
            const renderers = [
                'Intel Iris OpenGL Engine',
                'GeForce GTX 1080/PCIe/SSE2',
                'AMD Radeon Pro 560 OpenGL Engine',
                'Apple A11 GPU'
            ];

            const getParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function(parameter) {
                if (parameter === 37445) {
                    return vendors[Math.floor(Math.random() * vendors.length)];
                }
                if (parameter === 37446) {
                    return renderers[Math.floor(Math.random() * renderers.length)];
                }
                return getParameter.call(this, parameter);
            };
        }

        spoofCanvas() {
            if (!CONFIG.CANVAS_FINGERPRINT_SPOOF) return;

            const originalGetContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(contextType) {
                if (contextType === '2d') {
                    const ctx = originalGetContext.apply(this, arguments);
                    if (ctx) {
                        const originalGetImageData = ctx.getImageData;
                        ctx.getImageData = function() {
                            const imageData = originalGetImageData.apply(this, arguments);
                            for (let i = 0; i < imageData.data.length; i += 4) {
                                if (Math.random() > 0.999) {
                                    imageData.data[i] = (imageData.data[i] + Math.floor(Math.random() * 10)) % 256;
                                }
                            }
                            return imageData;
                        };

                        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
                        HTMLCanvasElement.prototype.toDataURL = function() {
                            const originalResult = originalToDataURL.apply(this, arguments);
                            if (Math.random() > 0.99) {
                                return originalResult + 'a';
                            }
                            return originalResult;
                        };
                    }
                    return ctx;
                }
                return originalGetContext.apply(this, arguments);
            };
        }

        spoofScreen() {
            if (!CONFIG.SCREEN_SPOOFING) return;

            const resolutions = [
                { width: 1920, height: 1080, availWidth: 1920, availHeight: 1040 },
                { width: 1366, height: 768, availWidth: 1366, availHeight: 728 },
                { width: 1536, height: 864, availWidth: 1536, availHeight: 824 },
                { width: 1440, height: 900, availWidth: 1440, availHeight: 860 }
            ];

            const resolution = resolutions[Math.floor(Math.random() * resolutions.length)];

            Object.defineProperties(screen, {
                width: { get: () => resolution.width, configurable: true },
                height: { get: () => resolution.height, configurable: true },
                availWidth: { get: () => resolution.availWidth, configurable: true },
                availHeight: { get: () => resolution.availHeight, configurable: true },
                colorDepth: { get: () => 24, configurable: true },
                pixelDepth: { get: () => 24, configurable: true }
            });
        }

        spoofTimezone() {
            if (!CONFIG.TIMEZONE_SPOOFING) return;

            const timezones = [
                'Europe/Istanbul',
                'America/New_York',
                'Europe/London',
                'Asia/Tokyo',
                'Europe/Berlin',
                'America/Los_Angeles'
            ];

            const randomTimezone = timezones[Math.floor(Math.random() * timezones.length)];

            const originalDateTimeFormat = Intl.DateTimeFormat;
            Intl.DateTimeFormat = function(locales, options) {
                return new originalDateTimeFormat(randomTimezone, options);
            };
        }

        spoofLanguages() {
            if (!CONFIG.LANGUAGE_SPOOFING) return;

            const languageSets = [
                ['tr-TR', 'tr'],
                ['tr', 'en-US', 'en'],
                ['en-US', 'en'],
                ['en-GB', 'en'],
                ['en', 'tr-TR', 'tr']
            ];

            const languages = languageSets[Math.floor(Math.random() * languageSets.length)];

            Object.defineProperty(navigator, 'languages', {
                get: () => languages,
            });

            Object.defineProperty(navigator, 'language', {
                get: () => languages[0],
            });
        }

        spoofPlugins() {
            const plugins = [
                {
                    name: 'Chrome PDF Plugin',
                    filename: 'internal-pdf-viewer',
                    description: 'Portable Document Format'
                },
                {
                    name: 'Chrome PDF Viewer',
                    filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai',
                    description: ''
                },
                {
                    name: 'Native Client',
                    filename: 'internal-nacl-plugin',
                    description: ''
                }
            ];

            Object.defineProperty(navigator, 'plugins', {
                get: () => plugins,
            });
        }

        spoofPermissions() {
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => {
                if (parameters.name === 'notifications') {
                    return Promise.resolve({
                        state: Notification.permission,
                        onchange: null
                    });
                }
                return originalQuery(parameters);
            };
        }

        spoofHistory() {
            Object.defineProperty(history, 'length', {
                get: () => Math.floor(Math.random() * 10) + 5,
                configurable: true
            });
        }
    }

    // ==================== STORY BOOSTER ====================
    class GetInkspiredStoryBooster {
        constructor() {
            this.isRunning = false;
            this.isPaused = false;
            this.sessionId = this.generateSessionId();
            this.stats = this.loadStats();
            this.retries = 0;
            this.sessionStartTime = Date.now();
            this.currentViewCount = 0;

            // Initialize systems
            this.cfBypass = new CloudFlareBypass(this);
            this.antiDetection = new AdvancedAntiDetection(this);

            // Create UI
            this.createUI();

            // Auto-start if on story page
            if (CONFIG.AUTO_START && this.isStoryPage()) {
                setTimeout(() => this.start(), 3000);
            }

            console.log('🦅 AeroStream PRO v2.0 loaded');
        }

        isStoryPage() {
            // Check if current page is a story page
            return window.location.pathname.includes('/story/') &&
                   window.location.hostname.includes('getinkspired.com');
        }

        generateSessionId() {
            return `aero_story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        // ==================== STATISTICS ====================
        loadStats() {
            const saved = GM_getValue('aerostream_story_stats_v2', null);
            if (saved) {
                const stats = JSON.parse(saved);
                if (new Date().toDateString() !== new Date(stats.lastUpdate).toDateString()) {
                    stats.todayViews = 0;
                    stats.dailySessions = 0;
                }
                return stats;
            }
            return {
                totalViews: 0,
                todayViews: 0,
                dailySessions: 0,
                totalSessions: 0,
                startTime: Date.now(),
                lastUpdate: Date.now(),
                errors: 0,
                successRate: 100
            };
        }

        saveStats() {
            if (CONFIG.SAVE_STATS) {
                this.stats.lastUpdate = Date.now();
                GM_setValue('aerostream_story_stats_v2', JSON.stringify(this.stats));
            }
        }

        updateStats(views = 1) {
            this.stats.totalViews += views;
            this.stats.todayViews += views;
            this.stats.successRate = this.stats.errors === 0 ? 100 :
                ((this.stats.totalViews - this.stats.errors) / this.stats.totalViews * 100).toFixed(1);
            this.saveStats();
            this.updateUI();

            // Milestone notification
            if (CONFIG.NOTIFY_ON_MILESTONE && this.stats.todayViews % CONFIG.MILESTONE_INTERVAL === 0) {
                this.notify(`🎉 ${this.stats.todayViews} views completed!`);
            }
        }

        // ==================== TIMING ====================
        async sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        getRandomViewTime() {
            return Math.floor(Math.random() * (CONFIG.MAX_VIEW_TIME - CONFIG.MIN_VIEW_TIME + 1) + CONFIG.MIN_VIEW_TIME);
        }

        getRandomDelay() {
            return Math.floor(Math.random() * (CONFIG.MAX_DELAY_BETWEEN_VIEWS - CONFIG.MIN_DELAY_BETWEEN_VIEWS + 1) + CONFIG.MIN_DELAY_BETWEEN_VIEWS);
        }

        // ==================== HUMAN BEHAVIOR ====================
        async humanScroll() {
            if (!CONFIG.RANDOM_SCROLL) return;

            const scrollHeight = document.documentElement.scrollHeight;
            const viewportHeight = window.innerHeight;
            const maxScroll = scrollHeight - viewportHeight;

            const scrollActions = Math.floor(Math.random() * 3) + 2;

            for (let i = 0; i < scrollActions; i++) {
                const targetScroll = Math.random() * maxScroll;
                const currentScroll = window.pageYOffset;
                const distance = targetScroll - currentScroll;
                const steps = Math.floor(Math.random() * 25) + 20;
                const stepSize = distance / steps;

                for (let j = 0; j < steps; j++) {
                    window.scrollBy(0, stepSize);
                    await this.sleep(Math.random() * 50 + 20);
                }

                await this.sleep(Math.random() * 2500 + 1200);
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
            await this.sleep(400);
        }

        async mouseMovement() {
            if (!CONFIG.MOUSE_MOVEMENT) return;

            const moveCount = Math.floor(Math.random() * 7) + 4;

            for (let i = 0; i < moveCount; i++) {
                // FIXED: MouseEvent constructor düzeltildi
                const event = new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    clientX: Math.random() * window.innerWidth,
                    clientY: Math.random() * window.innerHeight
                });
                document.dispatchEvent(event);
                await this.sleep(Math.random() * 200 + 80);
            }
        }

        async keyboardSimulation() {
            if (!CONFIG.KEYBOARD_SIMULATION) return;

            const keys = ['Tab', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'];
            const key = keys[Math.floor(Math.random() * keys.length)];

            // FIXED: KeyboardEvent constructor düzeltildi
            const downEvent = new KeyboardEvent('keydown', {
                key: key,
                bubbles: true,
                cancelable: true
            });

            document.dispatchEvent(downEvent);
            await this.sleep(Math.random() * 250 + 120);

            const upEvent = new KeyboardEvent('keyup', {
                key: key,
                bubbles: true,
                cancelable: true
            });

            document.dispatchEvent(upEvent);
        }

        // ==================== STORY VIEWING ====================
        async findStoryElements() {
            try {
                // Story specific selectors
                const selectors = [
                    '.story-content',
                    '.story-body',
                    '.post-content',
                    '[data-story-content]',
                    '.article-content',
                    '.content-wrapper',
                    '.story-container',
                    '.post-body'
                ];

                let storyElements = [];
                for (const selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    if (elements.length > 0) {
                        storyElements = Array.from(elements);
                        break;
                    }
                }

                // Fallback to body if no specific elements found
                if (storyElements.length === 0) {
                    storyElements = [document.body];
                }

                this.log(`Story elements found: ${storyElements.length}`, 'info');
                return storyElements;
            } catch (error) {
                this.log(`Error finding story elements: ${error.message}`, 'error');
                return [document.body];
            }
        }

        async viewStory() {
            try {
                // Find story elements
                const storyElements = await this.findStoryElements();

                // Simulate reading the story
                for (const element of storyElements) {
                    // Scroll to element
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    await this.sleep(600);

                    // Human-like interaction
                    await this.mouseMovement();
                    await this.sleep(Math.random() * 1200 + 600);

                    // Simulate reading time
                    const viewTime = this.getRandomViewTime();
                    this.log(`Viewing for ${Math.round(viewTime/1000)}s`, 'info');

                    // During reading time, do human-like actions
                    const intervals = Math.floor(viewTime / 5000);
                    for (let i = 0; i < intervals; i++) {
                        if (!this.isRunning) break;

                        await this.humanScroll();
                        await this.mouseMovement();
                        await this.sleep(5000);
                    }
                }

                // Try to find and interact with like button
                const likeButtons = document.querySelectorAll('.like-button, .heart-button, [data-like]');
                if (likeButtons.length > 0 && Math.random() > 0.7) {
                    const likeButton = likeButtons[Math.floor(Math.random() * likeButtons.length)];
                    if (likeButton.offsetParent !== null) {
                        // FIXED: MouseEvent constructor düzeltildi
                        const hoverEvent = new MouseEvent('mouseenter', {
                            bubbles: true,
                            cancelable: true
                        });
                        likeButton.dispatchEvent(hoverEvent);
                        await this.sleep(Math.random() * 1500 + 800);
                    }
                }

                // Story viewed successfully
                this.updateStats(1);
                this.log('Story successfully viewed', 'success');

                return true;
            } catch (error) {
                this.log(`Error viewing story: ${error.message}`, 'error');
                this.stats.errors++;
                return false;
            }
        }

        // ==================== MAIN LOOP ====================
        async run() {
            while (this.isRunning) {
                try {
                    if (this.isPaused) {
                        await this.sleep(5000);
                        continue;
                    }

                    // Daily target check
                    if (this.stats.todayViews >= CONFIG.TARGET_DAILY_VIEWS) {
                        this.log('Daily target reached!', 'success');
                        this.notify('🎉 Daily target reached!');
                        await this.sleep(60000);
                        continue;
                    }

                    // Session timeout check
                    if (Date.now() - this.sessionStartTime > CONFIG.SESSION_DURATION) {
                        await this.takeBreak();
                        continue;
                    }

                    // CloudFlare challenge check
                    if (await this.cfBypass.detectChallenge()) {
                        const bypassSuccess = await this.cfBypass.solveChallenge();
                        if (!bypassSuccess) {
                            this.retries++;
                            if (this.retries >= CONFIG.CF_MAX_RETRIES) {
                                throw new Error('CloudFlare bypass failed');
                            }
                            await this.sleep(10000);
                            continue;
                        }
                    }

                    // View the story
                    const success = await this.viewStory();

                    if (success) {
                        // Delay between views
                        const delay = this.getRandomDelay();
                        this.log(`Waiting ${Math.round(delay/1000)}s...`, 'info');
                        await this.sleep(delay);
                    } else {
                        this.retries++;
                        if (this.retries >= CONFIG.MAX_ERRORS_ALLOWED) {
                            throw new Error('Max errors reached');
                        }
                    }

                    // Human behavior between actions
                    await this.humanScroll();
                    await this.mouseMovement();

                } catch (error) {
                    this.log(`Critical error: ${error.message}`, 'error');
                    this.stats.errors++;
                    this.retries++;

                    if (this.retries >= CONFIG.MAX_ERRORS_ALLOWED) {
                        this.log('Max error limit reached', 'error');
                        if (CONFIG.AUTO_RESTART) {
                            this.log('Restarting in 20 seconds...', 'warning');
                            await this.sleep(20000);
                            this.retries = 0;
                            location.reload();
                        } else {
                            this.stop();
                        }
                        return;
                    }

                    await this.sleep(10000);
                }
            }
        }

        async takeBreak() {
            this.log('Taking break...', 'info');
            this.isPaused = true;
            this.updateUI();

            await this.sleep(CONFIG.BREAK_DURATION);

            this.isPaused = false;
            this.sessionStartTime = Date.now();
            this.stats.dailySessions++;
            this.stats.totalSessions++;
            this.saveStats();

            this.log('Break ended, continuing...', 'success');
            this.updateUI();
        }

        // ==================== CONTROLS ====================
        start() {
            if (this.isRunning) {
                this.log('Bot already running', 'warning');
                return;
            }

            // Check if we're on a story page
            if (!this.isStoryPage()) {
                this.log('Please navigate to a GetInkspired story page', 'warning');
                return;
            }

            this.isRunning = true;
            this.isPaused = false;
            this.retries = 0;
            this.sessionStartTime = Date.now();
            this.log('AeroStream started', 'success');

            if (CONFIG.SHOW_NOTIFICATIONS) {
                this.notify('🚀 AeroStream PRO started!');
            }

            this.updateUI();
            this.run();
        }

        stop() {
            this.isRunning = false;
            this.log('AeroStream stopped', 'warning');
            this.updateUI();
        }

        pause() {
            this.isPaused = !this.isPaused;
            this.log(this.isPaused ? 'Bot paused' : 'Bot resumed', 'info');
            this.updateUI();
        }

        reset() {
            if (!confirm('Reset statistics?')) return;

            this.stop();
            this.stats = {
                totalViews: 0,
                todayViews: 0,
                dailySessions: 0,
                totalSessions: 0,
                startTime: Date.now(),
                lastUpdate: Date.now(),
                errors: 0,
                successRate: 100
            };
            this.saveStats();
            this.updateUI();
            this.log('Statistics reset', 'info');
        }

        // ==================== UI ====================
        createUI() {
            GM_addStyle(`
                #aerostream-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 360px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 20px;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.2);
                    backdrop-filter: blur(10px);
                }

                .aero-header {
                    padding: 20px;
                    background: rgba(0,0,0,0.2);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }

                .aero-title {
                    font-size: 20px;
                    font-weight: bold;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .aero-badge {
                    background: linear-gradient(45deg, #ff6b6b, #ffa502);
                    font-size: 10px;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-weight: bold;
                }

                .aero-controls {
                    display: flex;
                    gap: 8px;
                }

                .aero-btn {
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                    backdrop-filter: blur(5px);
                }

                .aero-btn:hover {
                    background: rgba(255,255,255,0.2);
                    transform: translateY(-2px);
                }

                .aero-body {
                    padding: 20px;
                }

                .aero-stats {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .aero-stat {
                    background: rgba(255,255,255,0.08);
                    padding: 15px;
                    border-radius: 15px;
                    text-align: center;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .aero-stat-value {
                    font-size: 24px;
                    font-weight: bold;
                    color: white;
                    margin-bottom: 5px;
                }

                .aero-stat-label {
                    font-size: 11px;
                    color: rgba(255,255,255,0.7);
                }

                .aero-main-controls {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-bottom: 15px;
                }

                .aero-main-btn {
                    padding: 14px;
                    border: none;
                    border-radius: 12px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    backdrop-filter: blur(5px);
                }

                .aero-btn-primary {
                    background: linear-gradient(45deg, #00b09b, #96c93d);
                    color: white;
                }

                .aero-btn-danger {
                    background: linear-gradient(45deg, #ff416c, #ff4b2b);
                    color: white;
                }

                .aero-btn-warning {
                    background: linear-gradient(45deg, #f7971e, #ffd200);
                    color: white;
                }

                .aero-btn-secondary {
                    background: rgba(255,255,255,0.1);
                    color: white;
                }

                .aero-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }

                .aero-status {
                    background: rgba(0,0,0,0.2);
                    padding: 12px;
                    border-radius: 12px;
                    color: white;
                    font-size: 12px;
                    margin-bottom: 15px;
                    text-align: center;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .aero-logs {
                    background: rgba(0,0,0,0.2);
                    padding: 12px;
                    border-radius: 12px;
                    max-height: 180px;
                    overflow-y: auto;
                    font-size: 10px;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .aero-log {
                    color: rgba(255,255,255,0.9);
                    padding: 6px;
                    border-left: 3px solid transparent;
                    margin-bottom: 4px;
                    border-radius: 4px;
                    font-family: 'Courier New', monospace;
                }

                .aero-log-success {
                    border-left-color: #10b981;
                    background: rgba(16, 185, 129, 0.1);
                }
                .aero-log-error {
                    border-left-color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                }
                .aero-log-warning {
                    border-left-color: #f59e0b;
                    background: rgba(245, 158, 11, 0.1);
                }
                .aero-log-info {
                    border-left-color: #3b82f6;
                    background: rgba(59, 130, 246, 0.1);
                }

                .aero-progress {
                    background: rgba(0,0,0,0.2);
                    height: 8px;
                    border-radius: 10px;
                    overflow: hidden;
                    margin-bottom: 15px;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .aero-progress-bar {
                    background: linear-gradient(90deg, #00b09b, #96c93d);
                    height: 100%;
                    transition: width 0.5s;
                }

                .aero-security {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    margin-bottom: 15px;
                }

                .aero-security-item {
                    background: rgba(255,255,255,0.08);
                    padding: 8px;
                    border-radius: 8px;
                    text-align: center;
                    font-size: 10px;
                    color: white;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .aero-security-active {
                    background: rgba(16, 185, 129, 0.2);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }

                .aero-security-inactive {
                    background: rgba(239, 68, 68, 0.2);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                }

                .aero-minimized {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                }

                .aero-minimized .aero-body {
                    display: none;
                }
            `);

            const panel = document.createElement('div');
            panel.id = 'aerostream-panel';
            panel.innerHTML = `
                <div class="aero-header">
                    <div class="aero-title">
                        🦅 AeroStream PRO <span class="aero-badge">v2.0</span>
                    </div>
                    <div class="aero-controls">
                        <button class="aero-btn" onclick="window.aeroBot.toggleMinimize()">−</button>
                        <button class="aero-btn" onclick="window.aeroBot.closePanel()">×</button>
                    </div>
                </div>

                <div class="aero-body">
                    <div class="aero-stats">
                        <div class="aero-stat">
                            <div class="aero-stat-value" id="aero-total">0</div>
                            <div class="aero-stat-label">Total</div>
                        </div>
                        <div class="aero-stat">
                            <div class="aero-stat-value" id="aero-today">0</div>
                            <div class="aero-stat-label">Today</div>
                        </div>
                        <div class="aero-stat">
                            <div class="aero-stat-value" id="aero-rate">100%</div>
                            <div class="aero-stat-label">Success</div>
                        </div>
                        <div class="aero-stat">
                            <div class="aero-stat-value" id="aero-sessions">0</div>
                            <div class="aero-stat-label">Sessions</div>
                        </div>
                    </div>

                    <div class="aero-progress">
                        <div class="aero-progress-bar" id="aero-progress" style="width: 0%"></div>
                    </div>

                    <div class="aero-security">
                        <div class="aero-security-item aero-security-active" id="aero-cf">CF Bypass</div>
                        <div class="aero-security-item aero-security-active" id="aero-anti">Anti-Detect</div>
                        <div class="aero-security-item aero-security-active" id="aero-human">Human</div>
                        <div class="aero-security-item aero-security-active" id="aero-stealth">Stealth</div>
                    </div>

                    <div class="aero-status" id="aero-status">Ready</div>

                    <div class="aero-main-controls">
                        <button class="aero-main-btn aero-btn-primary" id="aero-start">
                            ▶ Start
                        </button>
                        <button class="aero-main-btn aero-btn-danger" id="aero-stop">
                            ⏹ Stop
                        </button>
                        <button class="aero-main-btn aero-btn-warning" id="aero-pause">
                            ⏸ Pause
                        </button>
                        <button class="aero-main-btn aero-btn-secondary" id="aero-reset">
                            🔄 Reset
                        </button>
                    </div>

                    <div class="aero-logs" id="aero-logs">
                        <div class="aero-log aero-log-info">[00:00:00] AeroStream PRO v2.0 loaded</div>
                    </div>
                </div>
            `;

            document.body.appendChild(panel);

            // Event listeners
            document.getElementById('aero-start').onclick = () => this.start();
            document.getElementById('aero-stop').onclick = () => this.stop();
            document.getElementById('aero-pause').onclick = () => this.pause();
            document.getElementById('aero-reset').onclick = () => this.reset();

            this.updateUI();
        }

        toggleMinimize() {
            const panel = document.getElementById('aerostream-panel');
            panel.classList.toggle('aero-minimized');
        }

        closePanel() {
            const panel = document.getElementById('aerostream-panel');
            panel.style.display = 'none';
        }

        updateUI() {
            document.getElementById('aero-total').textContent = this.stats.totalViews;
            document.getElementById('aero-today').textContent = this.stats.todayViews;
            document.getElementById('aero-rate').textContent = `${this.stats.successRate}%`;
            document.getElementById('aero-sessions').textContent = this.stats.totalSessions;

            const progress = (this.stats.todayViews / CONFIG.TARGET_DAILY_VIEWS) * 100;
            document.getElementById('aero-progress').style.width = Math.min(progress, 100) + '%';

            const statusEl = document.getElementById('aero-status');
            if (this.isRunning) {
                if (this.isPaused) {
                    statusEl.textContent = '⏸️ Paused';
                    statusEl.style.background = 'rgba(251, 146, 60, 0.2)';
                } else {
                    statusEl.textContent = '🟢 Running';
                    statusEl.style.background = 'rgba(34, 197, 94, 0.2)';
                }
            } else {
                statusEl.textContent = '🔴 Stopped';
                statusEl.style.background = 'rgba(239, 68, 68, 0.2)';
            }
        }

        log(message, type = 'info') {
            const logsEl = document.getElementById('aero-logs');
            const time = new Date().toLocaleTimeString('tr-TR');
            const logEl = document.createElement('div');
            logEl.className = `aero-log aero-log-${type}`;
            logEl.textContent = `[${time}] ${message}`;

            logsEl.insertBefore(logEl, logsEl.firstChild);

            while (logsEl.children.length > 35) {
                logsEl.removeChild(logsEl.lastChild);
            }

            console.log(`[AeroStream] ${message}`);
        }

        notify(message) {
            if (!CONFIG.SHOW_NOTIFICATIONS) return;

            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('AeroStream PRO', {
                    body: message,
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">🦅</text></svg>'
                });
            } else {
                GM_notification({
                    text: message,
                    title: 'AeroStream PRO',
                    timeout: 5000
                });
            }
        }
    }

    // ==================== INITIALIZE ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.aeroBot = new GetInkspiredStoryBooster();
        });
    } else {
        window.aeroBot = new GetInkspiredStoryBooster();
    }

    // Request notification permission
    if (CONFIG.SHOW_NOTIFICATIONS && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    console.log('✅ AeroStream PRO v2.0 initialized');
})();
