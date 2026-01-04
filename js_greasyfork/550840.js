// ==UserScript==
// @name         YouTube Last Watched Video Tracker
// @namespace    https://greasyfork.org/users/1513610
// @version      1.0.0
// @description  Track and find your last watched video on YouTube subscriptions page. Drag the green box to mark videos, with automatic search and history backup.
// @author       NAABO
// @match        https://www.youtube.com/feed/subscriptions*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550840/YouTube%20Last%20Watched%20Video%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/550840/YouTube%20Last%20Watched%20Video%20Tracker.meta.js
// ==/UserScript==

/*
 * YouTube Last Watched Video Tracker
 *
 * HOW TO USE:
 * 1. Go to YouTube subscriptions page
 * 2. You'll see a green "DRAG TO MARK VIDEO" box
 * 3. Drag it onto any video to mark as your last watched
 * 4. When you return, the script will automatically find and highlight that video
 * 5. Check browser console (F12) to see your video history
 *
 * FEATURES:
 * - Automatic video search with smart scrolling
 * - Video history backup (last 10 videos)
 * - Drag and drop interface
 * - Cancellable operations
 * - Accessibility support
 *
 * PRIVACY:
 * - All data stored locally in your browser
 * - No external requests or tracking
 * - No personal data collection
 */

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        SCROLL_DELAY_BASE: 800,
        SCROLL_DELAY_MIN: 400,
        SCROLL_DELAY_MAX: 1200,
        SCROLL_STEP: 500,
        VISIBILITY_CHECK_INTERVAL: 500,
        MAX_SEARCH_ATTEMPTS: 200,
        NOTIFICATION_DURATION: 3000,
        DEBOUNCE_DELAY: 300,
        ANIMATION_DURATION: 300,
        DROP_DETECTION_DELAY: 50,
        MAX_HISTORY_SIZE: 10,
        CONTENT_LOAD_TIMEOUT: 30000, // 30 seconds timeout for content loading
        RETRY_ATTEMPTS: 3
    };

    const SELECTORS = {
        VIDEO_CONTAINER: 'ytd-rich-item-renderer',
        VIDEO_LINK: 'a[href*="/watch?v="]',
        SUBSCRIPTIONS_PATH: '/feed/subscriptions'
    };

    const STYLES = {
        SUCCESS: { bg: 'linear-gradient(135deg, #00ff41, #00cc33)', color: '#000', shadow: '0 4px 20px rgba(0, 255, 65, 0.4)' },
        ERROR: { bg: 'linear-gradient(135deg, #ff4757, #ff3742)', color: '#fff', shadow: '0 4px 20px rgba(255, 71, 87, 0.4)' },
        INFO: { bg: 'linear-gradient(135deg, #3742fa, #2f3542)', color: '#fff', shadow: '0 4px 20px rgba(55, 66, 250, 0.4)' }
    };

    const VERSION = '1.0.0';

    // ==================== UTILITY CLASSES ====================
    class Logger {
        static log(msg) {
            console.log(`[YT Tracker v${VERSION}] ${new Date().toLocaleTimeString()} - ${msg}`);
        }

        static warn(msg) {
            console.warn(`[YT Tracker v${VERSION}] ${new Date().toLocaleTimeString()} - ${msg}`);
        }

        static error(msg) {
            console.error(`[YT Tracker v${VERSION}] ${new Date().toLocaleTimeString()} - ${msg}`);
        }

        static welcome() {
            console.group(`🎥 YouTube Last Watched Video Tracker v${VERSION}`);
            console.log('✅ Script loaded successfully!');
            console.log('📖 How to use:');
            console.log('   1. Drag the green box onto any video to mark as last watched');
            console.log('   2. Script will automatically find that video when you return');
            console.log('   3. Your last 3 videos are shown here as backup');
            console.log('🔒 Privacy: All data stored locally, no tracking');
            console.groupEnd();
        }

        static history(videos) {
            if (videos.length === 0) {
                console.log('📺 No video history yet. Drag the green box onto a video to start tracking!');
                return;
            }

            console.group('📺 Last 3 Watched Videos History');
            videos.forEach((video, index) => {
                const timeAgo = this._getTimeAgo(video.timestamp);
                console.log(`${index + 1}. Video ID: ${video.id} | ${timeAgo} | https://youtube.com/watch?v=${video.id}`);
            });
            console.groupEnd();
        }

        static _getTimeAgo(timestamp) {
            const now = Date.now();
            const diff = now - timestamp;
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
            if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
            if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            return 'Just now';
        }
    }

    class Utils {
        static debounce(func, delay) {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        }

        static throttle(func, delay) {
            let lastExecution = 0;
            return (...args) => {
                const now = Date.now();
                if (now - lastExecution >= delay) {
                    lastExecution = now;
                    return func.apply(this, args);
                }
            };
        }

        static getVideoId(url) {
            if (!url || typeof url !== 'string') return null;
            const match = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
            return match ? match[1] : null;
        }

        static isSubscriptionsPage() {
            return location.href.includes(SELECTORS.SUBSCRIPTIONS_PATH);
        }

        static async sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        static safeJsonParse(json, fallback = null) {
            try {
                return JSON.parse(json);
            } catch (error) {
                Logger.warn(`JSON parse failed: ${error.message}`);
                return fallback;
            }
        }

        static safeJsonStringify(obj, fallback = '[]') {
            try {
                return JSON.stringify(obj);
            } catch (error) {
                Logger.warn(`JSON stringify failed: ${error.message}`);
                return fallback;
            }
        }
    }

    // ==================== ENHANCED STORAGE MANAGER ====================
    class StorageManager {
        static save(key, value) {
            try {
                GM_setValue(key, value);
                Logger.log(`Saved ${key}: ${value}`);
                return true;
            } catch (error) {
                Logger.error(`Save failed for ${key}: ${error.message}`);
                return false;
            }
        }

        static get(key, defaultValue = null) {
            try {
                const value = GM_getValue(key, defaultValue);
                return value;
            } catch (error) {
                Logger.error(`Get failed for ${key}: ${error.message}`);
                return defaultValue;
            }
        }

        static saveVideo(videoId) {
            if (!videoId || typeof videoId !== 'string') {
                Logger.error('Invalid video ID provided');
                return false;
            }

            try {
                // Save current video (backward compatibility)
                this.save('lastVideo', videoId);

                // Get existing history
                let history = this.getVideoHistory();

                // Remove if already exists (to avoid duplicates)
                history = history.filter(video => video.id !== videoId);

                // Add new video at the beginning
                history.unshift({
                    id: videoId,
                    timestamp: Date.now(),
                    url: `https://youtube.com/watch?v=${videoId}`
                });

                // Limit history size
                if (history.length > CONFIG.MAX_HISTORY_SIZE) {
                    history = history.slice(0, CONFIG.MAX_HISTORY_SIZE);
                }

                // Save updated history
                const historyJson = Utils.safeJsonStringify(history);
                this.save('videoHistory', historyJson);

                // Display recent history in console
                this.displayRecentHistory();

                return true;
            } catch (error) {
                Logger.error(`Failed to save video with history: ${error.message}`);
                return false;
            }
        }

        static getSavedVideo() {
            return this.get('lastVideo');
        }

        static getVideoHistory() {
            const historyJson = this.get('videoHistory', '[]');
            const history = Utils.safeJsonParse(historyJson, []);

            // Validate history entries
            return history.filter(video =>
                video &&
                typeof video === 'object' &&
                video.id &&
                typeof video.id === 'string' &&
                video.timestamp &&
                typeof video.timestamp === 'number'
            );
        }

        static displayRecentHistory() {
            const history = this.getVideoHistory();
            const recent = history.slice(0, 3);
            Logger.history(recent);
        }

        static getVideoFromHistory(index) {
            const history = this.getVideoHistory();
            return history[index] || null;
        }

        // Migration for existing users
        static migrateToHistoryFormat() {
            try {
                const existingVideo = this.getSavedVideo();
                const existingHistory = this.getVideoHistory();

                if (existingVideo && existingHistory.length === 0) {
                    const historyEntry = {
                        id: existingVideo,
                        timestamp: Date.now() - (24 * 60 * 60 * 1000), // Set as 1 day ago
                        url: `https://youtube.com/watch?v=${existingVideo}`
                    };

                    const historyJson = Utils.safeJsonStringify([historyEntry]);
                    this.save('videoHistory', historyJson);
                    Logger.log(`Migrated existing video ${existingVideo} to history format`);
                    return true;
                }
                return false;
            } catch (error) {
                Logger.error(`Migration failed: ${error.message}`);
                return false;
            }
        }

        // Clear all data (for troubleshooting)
        static clearAllData() {
            try {
                this.save('lastVideo', '');
                this.save('videoHistory', '[]');
                Logger.log('All data cleared');
                return true;
            } catch (error) {
                Logger.error(`Clear data failed: ${error.message}`);
                return false;
            }
        }
    }

    // ==================== NOTIFICATION SYSTEM ====================
    class NotificationManager {
        constructor() {
            this.notifications = new WeakMap();
            this.searchNotification = null;
        }

        show(text, type = 'success') {
            if (!text || typeof text !== 'string') return;

            this._removeExistingNotification();

            const notification = this._createNotification(text, type);
            if (!notification) return;

            document.body.appendChild(notification);

            requestAnimationFrame(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(-50%) translateY(0)';
            });

            setTimeout(() => this._hideNotification(notification), CONFIG.NOTIFICATION_DURATION);
        }

        showSearch(text, progress = 0) {
            if (!text || typeof text !== 'string') return;

            if (this.searchNotification) {
                this._updateSearchNotification(text, progress);
                return;
            }

            this.searchNotification = this._createSearchNotification(text, progress);
            if (this.searchNotification) {
                document.body.appendChild(this.searchNotification);
            }
        }

        hideSearch() {
            if (this.searchNotification) {
                this._hideNotification(this.searchNotification);
                this.searchNotification = null;
            }
        }

        _removeExistingNotification() {
            const existing = document.querySelector('.yt-tracker-notif');
            if (existing) existing.remove();
        }

        _createNotification(text, type) {
            try {
                const style = STYLES[type.toUpperCase()] || STYLES.SUCCESS;
                const notification = document.createElement('div');

                notification.className = 'yt-tracker-notif';
                notification.textContent = text;
                notification.setAttribute('role', 'alert');
                notification.setAttribute('aria-live', 'polite');

                notification.style.cssText = `
                    position: fixed !important;
                    top: 20px !important;
                    left: 50% !important;
                    transform: translateX(-50%) translateY(-20px) !important;
                    background: ${style.bg} !important;
                    color: ${style.color} !important;
                    padding: 12px 24px !important;
                    border-radius: 25px !important;
                    z-index: 999999 !important;
                    font-weight: bold !important;
                    font-size: 14px !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif !important;
                    box-shadow: ${style.shadow} !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    backdrop-filter: blur(10px) !important;
                    transition: all ${CONFIG.ANIMATION_DURATION}ms ease !important;
                    opacity: 0 !important;
                    max-width: 400px !important;
                    word-wrap: break-word !important;
                `;

                return notification;
            } catch (error) {
                Logger.error(`Failed to create notification: ${error.message}`);
                return null;
            }
        }

        _createSearchNotification(text, progress) {
            try {
                const notification = document.createElement('div');
                notification.className = 'yt-tracker-search-notif';
                notification.setAttribute('role', 'dialog');
                notification.setAttribute('aria-label', 'Search Progress');

                notification.style.cssText = `
                    position: fixed !important;
                    top: 20px !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    background: linear-gradient(135deg, #1e3799, #0c2461) !important;
                    color: #ffffff !important;
                    padding: 18px 28px 22px 28px !important;
                    border-radius: 25px !important;
                    z-index: 999999 !important;
                    font-weight: bold !important;
                    font-size: 14px !important;
                    box-shadow: 0 8px 32px rgba(30, 55, 153, 0.4) !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 15px !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    backdrop-filter: blur(10px) !important;
                    min-width: 320px !important;
                    max-width: 500px !important;
                    flex-direction: column !important;
                `;

                notification.innerHTML = this._getSearchNotificationHTML(text, progress);
                this._attachCancelHandler(notification);

                return notification;
            } catch (error) {
                Logger.error(`Failed to create search notification: ${error.message}`);
                return null;
            }
        }

        _getSearchNotificationHTML(text, progress) {
            const clampedProgress = Math.min(Math.max(progress, 0), 100);
            return `
                <div style="display: flex !important; align-items: center !important; gap: 15px !important; width: 100% !important;">
                    <span style="flex: 1 !important;">${text}</span>
                    <button class="cancel-search-btn" style="
                        background: rgba(255, 87, 87, 0.2) !important;
                        border: 2px solid rgba(255, 87, 87, 0.6) !important;
                        color: #ff5757 !important;
                        font-weight: bold !important;
                        font-size: 16px !important;
                        width: 28px !important;
                        height: 28px !important;
                        border-radius: 50% !important;
                        cursor: pointer !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        padding: 0 !important;
                        line-height: 1 !important;
                        transition: all 0.2s ease !important;
                        flex-shrink: 0 !important;
                    " title="Cancel search" aria-label="Cancel search">×</button>
                </div>
                <div style="
                    width: 100% !important;
                    height: 4px !important;
                    background: rgba(255, 255, 255, 0.1) !important;
                    border-radius: 2px !important;
                    overflow: hidden !important;
                    margin-top: 8px !important;
                ">
                    <div class="progress-bar" style="
                        height: 100% !important;
                        background: linear-gradient(90deg, #00ff41, #00cc33) !important;
                        border-radius: 2px !important;
                        transition: width 0.3s ease !important;
                        width: ${clampedProgress}% !important;
                        box-shadow: 0 0 8px rgba(0, 255, 65, 0.6) !important;
                    "></div>
                </div>
            `;
        }

        _attachCancelHandler(notification) {
            if (!notification) return;

            const cancelBtn = notification.querySelector('.cancel-search-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    this.hideSearch();
                    window.dispatchEvent(new CustomEvent('ytTrackerSearchCancel'));
                });

                cancelBtn.addEventListener('mouseenter', () => {
                    cancelBtn.style.background = 'rgba(255, 87, 87, 0.4) !important';
                });

                cancelBtn.addEventListener('mouseleave', () => {
                    cancelBtn.style.background = 'rgba(255, 87, 87, 0.2) !important';
                });
            }
        }

        _updateSearchNotification(text, progress) {
            if (!this.searchNotification) return;

            const textSpan = this.searchNotification.querySelector('span');
            const progressBar = this.searchNotification.querySelector('.progress-bar');

            if (textSpan) textSpan.textContent = text;
            if (progressBar) {
                const clampedProgress = Math.min(Math.max(progress, 0), 100);
                progressBar.style.width = `${clampedProgress}%`;
            }
        }

        _hideNotification(notification) {
            if (!notification || !notification.parentNode) return;

            notification.style.opacity = '0';
            notification.style.transform = notification.classList.contains('yt-tracker-search-notif')
                ? 'translateX(-50%) translateY(-20px)'
                : 'translateX(-50%) translateY(-40px)';

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, CONFIG.ANIMATION_DURATION);
        }
    }

    // ==================== DRAG BOX COMPONENT ====================
    class DragBox {
        constructor() {
            this.element = null;
            this.isDragging = false;
            this.visibilityTimer = null;
            this.boundHandlers = new Map();
            this.isPositioned = false;
            this.retryCount = 0;

            this._createStyleSheet();
        }

        create() {
            try {
                this._removeExisting();

                this.element = document.createElement('div');
                this.element.id = 'yt-tracker-box';
                this.element.setAttribute('role', 'button');
                this.element.setAttribute('aria-label', 'Drag to mark video as last watched');
                this.element.setAttribute('tabindex', '0');

                this._applyInitialStyles();
                this._setContent('DRAG TO<br>MARK VIDEO');

                document.body.appendChild(this.element);
                this._setupEventListeners();
                this._startVisibilityGuard();

                this.isPositioned = false;
                this.retryCount = 0;
                Logger.log('Drag box created successfully');
                return true;
            } catch (error) {
                Logger.error(`Failed to create drag box: ${error.message}`);
                this._retryCreate();
                return false;
            }
        }

        _retryCreate() {
            if (this.retryCount < CONFIG.RETRY_ATTEMPTS) {
                this.retryCount++;
                Logger.log(`Retrying drag box creation (attempt ${this.retryCount}/${CONFIG.RETRY_ATTEMPTS})`);
                setTimeout(() => this.create(), 1000 * this.retryCount);
            } else {
                Logger.error('Failed to create drag box after all retry attempts');
            }
        }

        destroy() {
            try {
                this._stopVisibilityGuard();
                this._removeEventListeners();

                if (this.element && this.element.parentNode) {
                    this.element.remove();
                }

                this.element = null;
                this.isPositioned = false;
                Logger.log('Drag box destroyed');
            } catch (error) {
                Logger.error(`Failed to destroy drag box: ${error.message}`);
            }
        }

        resetToFloating() {
            if (!this.element) return;

            try {
                Logger.log('Resetting drag box to floating state');

                this.isPositioned = false;
                this.element.classList.remove('yt-tracker-pulsing');

                this._applyInitialStyles();
                this._setContent('DRAG TO<br>MARK VIDEO');

                this.element.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

                setTimeout(() => {
                    if (this.element) {
                        this.element.style.transition = 'all 0.3s ease';
                    }
                }, 500);
            } catch (error) {
                Logger.error(`Failed to reset drag box: ${error.message}`);
            }
        }

        positionOnVideo(container) {
            if (!this.element || !container) return;

            try {
                const rect = container.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

                this.element.style.position = 'absolute';
                this.element.style.left = (rect.left + scrollLeft + 10) + 'px';
                this.element.style.top = (rect.top + scrollTop + 10) + 'px';
                this.element.style.right = 'auto';

                this._updateForPositioned();
                this._setContent('✓ LAST<br>WATCHED');

                this.isPositioned = true;
                Logger.log('Box positioned on video successfully');
            } catch (error) {
                Logger.error(`Failed to position drag box: ${error.message}`);
            }
        }

        _createStyleSheet() {
            if (document.querySelector('#yt-tracker-styles')) return;

            try {
                const style = document.createElement('style');
                style.id = 'yt-tracker-styles';
                style.textContent = `
                    @keyframes yt-tracker-pulse {
                        0% {
                            box-shadow: 0 0 15px #00ff00, 0 0 30px rgba(0, 255, 0, 0.4);
                            transform: scale(1);
                        }
                        50% {
                            box-shadow: 0 0 25px #00ff00, 0 0 50px rgba(0, 255, 0, 0.6);
                            transform: scale(1.02);
                        }
                        100% {
                            box-shadow: 0 0 15px #00ff00, 0 0 30px rgba(0, 255, 0, 0.4);
                            transform: scale(1);
                        }
                    }

                    .yt-tracker-pulsing {
                        animation: yt-tracker-pulse 2s ease-in-out infinite !important;
                    }

                    @keyframes yt-tracker-glow {
                        0%, 100% { text-shadow: 0 0 5px #00ff00; }
                        50% { text-shadow: 0 0 15px #00ff00, 0 0 25px rgba(0, 255, 0, 0.8); }
                    }

                    .yt-tracker-glow-text {
                        animation: yt-tracker-glow 1.5s ease-in-out infinite !important;
                    }

                    #yt-tracker-box:focus {
                        outline: 2px solid #00ff41 !important;
                        outline-offset: 2px !important;
                    }

                    #yt-tracker-box:hover {
                        opacity: 0.9 !important;
                        transform: scale(1.05) !important;
                    }
                `;
                document.head.appendChild(style);
            } catch (error) {
                Logger.error(`Failed to create stylesheet: ${error.message}`);
            }
        }

        _removeExisting() {
            const existing = document.querySelector('#yt-tracker-box');
            if (existing) existing.remove();
        }

        _applyInitialStyles() {
            if (!this.element) return;

            this.element.style.cssText = `
                position: fixed !important;
                width: 130px !important;
                height: 85px !important;
                background: linear-gradient(135deg, rgba(0, 255, 0, 0.25), rgba(0, 200, 0, 0.15)) !important;
                border: 3px solid #00ff41 !important;
                border-radius: 12px !important;
                cursor: move !important;
                z-index: 2147483647 !important;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
                user-select: none !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif !important;
                box-shadow: 0 0 20px rgba(0, 255, 65, 0.4), inset 0 0 20px rgba(0, 255, 0, 0.1) !important;
                top: 100px !important;
                right: 20px !important;
                backdrop-filter: blur(5px) !important;
                transition: all 0.3s ease !important;
            `;
        }

        _setContent(text) {
            if (!this.element) return;

            this.element.innerHTML = `
                <div class="yt-tracker-glow-text" style="
                    text-align: center !important;
                    color: #00ff41 !important;
                    font-weight: bold !important;
                    font-size: 12px !important;
                    margin-top: 22px !important;
                    text-shadow: 0 0 8px #00ff41 !important;
                    line-height: 1.3 !important;
                    pointer-events: none !important;
                ">
                    ${text}
                </div>
            `;
        }

        _updateForPositioned() {
            if (!this.element) return;

            this.element.style.background = 'linear-gradient(135deg, rgba(0, 255, 65, 0.3), rgba(0, 200, 50, 0.2))';
            this.element.style.width = '140px';
            this.element.style.height = '90px';
            this.element.classList.add('yt-tracker-pulsing');
        }

        _setupEventListeners() {
            if (!this.element) return;

            try {
                // Mouse events
                const mouseDownHandler = this._createMouseDownHandler();
                this.element.addEventListener('mousedown', mouseDownHandler);
                this.boundHandlers.set('mousedown', mouseDownHandler);

                // Keyboard events for accessibility
                const keyDownHandler = (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const rect = this.element.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        window.dispatchEvent(new CustomEvent('ytTrackerDrop', {
                            detail: { x: centerX, y: centerY }
                        }));
                    }
                };
                this.element.addEventListener('keydown', keyDownHandler);
                this.boundHandlers.set('keydown', keyDownHandler);
            } catch (error) {
                Logger.error(`Failed to setup event listeners: ${error.message}`);
            }
        }

        _createMouseDownHandler() {
            return (e) => {
                try {
                    if (e.button !== 0) return;

                    this.isDragging = true;

                    const rect = this.element.getBoundingClientRect();
                    const startX = rect.left;
                    const startY = rect.top;
                    const mouseX = e.clientX;
                    const mouseY = e.clientY;

                    this.element.style.opacity = '0.8';
                    this.element.style.transform = 'scale(1.05)';

                    const mouseMoveHandler = (e) => {
                        if (!this.isDragging) return;

                        const newX = startX + (e.clientX - mouseX);
                        const newY = startY + (e.clientY - mouseY);

                        this.element.style.position = 'fixed';
                        this.element.style.left = newX + 'px';
                        this.element.style.top = newY + 'px';
                        this.element.style.right = 'auto';
                    };

                    const mouseUpHandler = (e) => {
                        if (!this.isDragging) return;

                        this.isDragging = false;
                        this.element.style.opacity = '1';
                        this.element.style.transform = 'scale(1)';

                        document.removeEventListener('mousemove', mouseMoveHandler);
                        document.removeEventListener('mouseup', mouseUpHandler);

                        setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('ytTrackerDrop', {
                                detail: { x: e.clientX, y: e.clientY }
                            }));
                        }, CONFIG.DROP_DETECTION_DELAY);
                    };

                    document.addEventListener('mousemove', mouseMoveHandler);
                    document.addEventListener('mouseup', mouseUpHandler);

                    e.preventDefault();
                } catch (error) {
                    Logger.error(`Mouse handler error: ${error.message}`);
                }
            };
        }

        _removeEventListeners() {
            for (const [event, handler] of this.boundHandlers) {
                if (this.element) {
                    this.element.removeEventListener(event, handler);
                }
            }
            this.boundHandlers.clear();
        }

        _startVisibilityGuard() {
            this._stopVisibilityGuard();

            this.visibilityTimer = setInterval(() => {
                if (this.element && this.element.parentNode) {
                    this.element.style.display = 'block';
                    this.element.style.visibility = 'visible';
                    this.element.style.opacity = this.element.style.opacity || '1';

                    if (!document.body.contains(this.element)) {
                        document.body.appendChild(this.element);
                    }
                }
            }, CONFIG.VISIBILITY_CHECK_INTERVAL);
        }

        _stopVisibilityGuard() {
            if (this.visibilityTimer) {
                clearInterval(this.visibilityTimer);
                this.visibilityTimer = null;
            }
        }
    }

    // ==================== VIDEO SEARCH ENGINE ====================
    class VideoSearchEngine {
        constructor(notificationManager) {
            this.notificationManager = notificationManager;
            this.isSearching = false;
            this.searchCancelled = false;
            this.scrollDelay = CONFIG.SCROLL_DELAY_BASE;

            window.addEventListener('ytTrackerSearchCancel', () => {
                this.cancelSearch();
            });
        }

        async searchForVideo(videoId) {
            if (!videoId || this.isSearching) return false;

            try {
                this.isSearching = true;
                this.searchCancelled = false;
                this.scrollDelay = CONFIG.SCROLL_DELAY_BASE;

                Logger.log(`Starting search for video: ${videoId}`);
                this.notificationManager.showSearch('🔍 Searching for your last watched video...', 0);

                if (this._findVideoInCurrentView(videoId)) {
                    this.isSearching = false;
                    return true;
                }

                const result = await this._performSmartSearch(videoId);
                this.isSearching = false;

                if (this.searchCancelled) {
                    this.notificationManager.show('🚫 Search cancelled', 'error');
                    return false;
                }

                return result;
            } catch (error) {
                Logger.error(`Search error: ${error.message}`);
                this.isSearching = false;
                this.notificationManager.hideSearch();
                this.notificationManager.show('❌ Search failed', 'error');
                return false;
            }
        }

        cancelSearch() {
            this.searchCancelled = true;
            this.isSearching = false;
            this.notificationManager.hideSearch();
            Logger.log('Search cancelled by user');
        }

        _findVideoInCurrentView(videoId) {
            try {
                const containers = document.querySelectorAll(SELECTORS.VIDEO_CONTAINER);

                for (const container of containers) {
                    const links = container.querySelectorAll(SELECTORS.VIDEO_LINK);
                    for (const link of links) {
                        if (Utils.getVideoId(link.href) === videoId) {
                            Logger.log(`Found video ${videoId} in current view`);
                            this._highlightFoundVideo(container);
                            return true;
                        }
                    }
                }
                return false;
            } catch (error) {
                Logger.error(`Error finding video in current view: ${error.message}`);
                return false;
            }
        }

        async _performSmartSearch(videoId) {
            let attempts = 0;
            let lastScrollPosition = 0;
            let stuckCount = 0;
            let lastVideoCount = this._countCurrentVideos();

            while (this.isSearching && !this.searchCancelled && attempts < CONFIG.MAX_SEARCH_ATTEMPTS) {
                attempts++;
                const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

                if (currentScrollPosition === lastScrollPosition) {
                    stuckCount++;
                    if (stuckCount >= 3) {
                        this.notificationManager.hideSearch();
                        this.notificationManager.show('❌ Reached end - video not found', 'error');
                        Logger.log('Reached end of page, video not found');
                        return false;
                    }
                } else {
                    stuckCount = 0;
                }
                lastScrollPosition = currentScrollPosition;

                const currentVideoCount = this._countCurrentVideos();
                const newVideosLoaded = currentVideoCount - lastVideoCount;
                this._adjustScrollDelay(newVideosLoaded);
                lastVideoCount = currentVideoCount;

                window.scrollBy(0, CONFIG.SCROLL_STEP);

                if (attempts % 3 === 0) {
                    const progressEstimate = Math.min((attempts * 2), 90);
                    this.notificationManager.showSearch(
                        `🔍 Searching... (${attempts} scrolls, ${currentVideoCount} videos)`,
                        progressEstimate
                    );
                }

                await Utils.sleep(this.scrollDelay);

                if (this._findVideoInCurrentView(videoId)) {
                    return true;
                }

                if (attempts % 15 === 0) {
                    Logger.log(`Search progress: attempt ${attempts}, delay: ${this.scrollDelay}ms, videos: ${currentVideoCount}`);
                }
            }

            if (!this.searchCancelled) {
                this.notificationManager.hideSearch();
                this.notificationManager.show('❌ Video not found after extensive search', 'error');
            }

            return false;
        }

        _highlightFoundVideo(container) {
            try {
                this.notificationManager.hideSearch();

                container.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('ytTrackerVideoFound', {
                        detail: { container }
                    }));
                    this.notificationManager.show('🎯 Found your video!');
                }, 1500);
            } catch (error) {
                Logger.error(`Error highlighting video: ${error.message}`);
            }
        }

        _countCurrentVideos() {
            try {
                return document.querySelectorAll(SELECTORS.VIDEO_CONTAINER).length;
            } catch (error) {
                return 0;
            }
        }

        _adjustScrollDelay(newVideosLoaded) {
            if (newVideosLoaded === 0) {
                this.scrollDelay = Math.max(CONFIG.SCROLL_DELAY_MIN, this.scrollDelay - 100);
            } else if (newVideosLoaded > 10) {
                this.scrollDelay = Math.min(CONFIG.SCROLL_DELAY_MAX, this.scrollDelay + 200);
            }
        }
    }

    // ==================== MAIN TRACKER CLASS ====================
    class YouTubeVideoTracker {
        constructor() {
            this.dragBox = null;
            this.notificationManager = new NotificationManager();
            this.searchEngine = new VideoSearchEngine(this.notificationManager);
            this.currentVideoId = null;
            this.isInitialized = false;
            this.urlChangeObserver = null;
            this.lastUrl = location.href;

            this._setupEventListeners();
        }

        async init() {
            try {
                if (!Utils.isSubscriptionsPage()) {
                    Logger.log('Not on subscriptions page, skipping initialization');
                    return;
                }

                if (this.isInitialized) {
                    Logger.log('Already initialized, skipping');
                    return;
                }

                Logger.log('Initializing YouTube video tracker...');
                Logger.welcome();

                // Migrate existing data
                const migrated = StorageManager.migrateToHistoryFormat();
                if (migrated) {
                    Logger.log('Successfully migrated existing data');
                }

                if (!(await this._waitForContent())) {
                    Logger.error('Failed to load YouTube content within timeout');
                    this.notificationManager.show('⚠️ YouTube content loading slowly. Tracker may not work properly.', 'error');
                    return;
                }

                const dragBoxCreated = this._createDragBox();
                if (dragBoxCreated) {
                    this.notificationManager.show('💚 YouTube Tracker ready! Drag the green box to mark videos.', 'success');
                } else {
                    this.notificationManager.show('❌ Failed to create tracker interface', 'error');
                    return;
                }

                // Look for saved video
                const savedVideoId = StorageManager.getSavedVideo();
                if (savedVideoId) {
                    this.currentVideoId = savedVideoId;
                    Logger.log(`Looking for saved video: ${savedVideoId}`);

                    setTimeout(() => {
                        StorageManager.displayRecentHistory();
                    }, 1000);

                    setTimeout(() => {
                        this.searchEngine.searchForVideo(savedVideoId);
                    }, 2000);
                } else {
                    // First-time user
                    setTimeout(() => {
                        Logger.log('Welcome! This is your first time using the tracker.');
                        StorageManager.displayRecentHistory();
                    }, 1000);
                }

                this.isInitialized = true;
                Logger.log('Tracker initialization complete');
            } catch (error) {
                Logger.error(`Initialization failed: ${error.message}`);
                this.notificationManager.show('❌ Tracker initialization failed', 'error');
            }
        }

        destroy() {
            try {
                Logger.log('Destroying tracker...');

                if (this.dragBox) {
                    this.dragBox.destroy();
                    this.dragBox = null;
                }

                if (this.urlChangeObserver) {
                    this.urlChangeObserver.disconnect();
                    this.urlChangeObserver = null;
                }

                this.searchEngine.cancelSearch();
                this.isInitialized = false;

                Logger.log('Tracker destroyed');
            } catch (error) {
                Logger.error(`Destroy failed: ${error.message}`);
            }
        }

        _createDragBox() {
            try {
                if (this.dragBox) {
                    this.dragBox.destroy();
                }

                this.dragBox = new DragBox();
                return this.dragBox.create();
            } catch (error) {
                Logger.error(`Failed to create drag box: ${error.message}`);
                return false;
            }
        }

        _setupEventListeners() {
            try {
                window.addEventListener('ytTrackerDrop', (e) => {
                    this._handleDrop(e.detail.x, e.detail.y);
                });

                window.addEventListener('ytTrackerVideoFound', (e) => {
                    if (this.dragBox && e.detail.container) {
                        this.dragBox.positionOnVideo(e.detail.container);
                    }
                });

                window.addEventListener('ytTrackerSearchCancel', () => {
                    if (this.dragBox && this.dragBox.isPositioned) {
                        Logger.log('Resetting drag box due to search cancellation');
                        this.dragBox.resetToFloating();
                    }
                });

                this._setupUrlChangeDetection();
            } catch (error) {
                Logger.error(`Failed to setup event listeners: ${error.message}`);
            }
        }

        _setupUrlChangeDetection() {
            try {
                const checkUrlChange = Utils.debounce(() => {
                    if (location.href !== this.lastUrl) {
                        this.lastUrl = location.href;
                        this._handleUrlChange();
                    }
                }, CONFIG.DEBOUNCE_DELAY);

                this.urlChangeObserver = new MutationObserver(checkUrlChange);
                this.urlChangeObserver.observe(document, {
                    subtree: true,
                    childList: true
                });
            } catch (error) {
                Logger.error(`Failed to setup URL change detection: ${error.message}`);
            }
        }

        _handleUrlChange() {
            Logger.log(`URL changed to: ${location.href}`);

            this.searchEngine.cancelSearch();

            if (Utils.isSubscriptionsPage()) {
                setTimeout(() => this.init(), 1000);
            } else {
                this.destroy();
            }
        }

        async _handleDrop(x, y) {
            try {
                Logger.log(`Handling drop at coordinates: ${x}, ${y}`);

                if (!this.dragBox || !this.dragBox.element) {
                    Logger.error('Drag box not available');
                    return;
                }

                const originalPointerEvents = this.dragBox.element.style.pointerEvents;
                this.dragBox.element.style.pointerEvents = 'none';

                await new Promise(resolve => requestAnimationFrame(resolve));

                const element = document.elementFromPoint(x, y);

                this.dragBox.element.style.pointerEvents = originalPointerEvents;

                if (!element) {
                    Logger.warn('Drop target not found at coordinates');
                    this.notificationManager.show('❌ Drop target not found!', 'error');
                    return;
                }

                const videoContainer = element.closest(SELECTORS.VIDEO_CONTAINER);
                if (!videoContainer) {
                    Logger.warn('Drop target is not a video container');
                    this.notificationManager.show('❌ Please drop on a video!', 'error');
                    return;
                }

                const videoLink = videoContainer.querySelector(SELECTORS.VIDEO_LINK);
                if (!videoLink) {
                    Logger.warn('Video link not found in container');
                    this.notificationManager.show('❌ Video link not found!', 'error');
                    return;
                }

                const videoId = Utils.getVideoId(videoLink.href);
                if (!videoId) {
                    Logger.warn('Could not extract video ID from link');
                    this.notificationManager.show('❌ Could not get video ID!', 'error');
                    return;
                }

                Logger.log(`Attempting to save video ID: ${videoId}`);

                if (StorageManager.saveVideo(videoId)) {
                    this.currentVideoId = videoId;
                    this.dragBox.positionOnVideo(videoContainer);
                    this.notificationManager.show('✅ Video marked as last watched!', 'success');
                    Logger.log(`Successfully marked video ${videoId} as last watched`);
                } else {
                    Logger.error('Failed to save video to storage');
                    this.notificationManager.show('❌ Failed to save video!', 'error');
                }
            } catch (error) {
                Logger.error(`Drop handling failed: ${error.message}`);
                this.notificationManager.show('❌ Error processing drop', 'error');
            }
        }

        async _waitForContent() {
            const startTime = Date.now();

            for (let i = 0; i < 30; i++) {
                await Utils.sleep(1000);

                if (Date.now() - startTime > CONFIG.CONTENT_LOAD_TIMEOUT) {
                    Logger.warn('Content loading timeout reached');
                    break;
                }

                const videos = document.querySelectorAll(SELECTORS.VIDEO_CONTAINER);
                if (videos.length > 0) {
                    Logger.log(`Content ready - ${videos.length} videos found`);
                    return true;
                }
            }
            return false;
        }
    }

    // ==================== INITIALIZATION ====================
    let tracker = null;
    let initializationAttempts = 0;

    const startTracker = () => {
        try {
            Logger.log(`Starting YouTube Last Watched Video Tracker v${VERSION}`);

            if (tracker) {
                tracker.destroy();
            }

            tracker = new YouTubeVideoTracker();

            if (Utils.isSubscriptionsPage()) {
                setTimeout(() => tracker.init(), 1000);
            }
        } catch (error) {
            Logger.error(`Failed to start tracker: ${error.message}`);

            // Retry initialization
            initializationAttempts++;
            if (initializationAttempts < CONFIG.RETRY_ATTEMPTS) {
                Logger.log(`Retrying initialization (attempt ${initializationAttempts}/${CONFIG.RETRY_ATTEMPTS})`);
                setTimeout(startTracker, 2000 * initializationAttempts);
            } else {
                Logger.error('Failed to initialize after all attempts');
            }
        }
    };

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (tracker) {
            tracker.destroy();
        }
    });

    // Error handling for uncaught errors
    window.addEventListener('error', (e) => {
        if (e.message && e.message.includes('YT Tracker')) {
            Logger.error(`Uncaught error: ${e.message}`);
        }
    });

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startTracker);
    } else {
        startTracker();
    }

    // Expose some functions for debugging (only in console)
    if (typeof window !== 'undefined') {
        window.ytTracker = {
            version: VERSION,
            clearData: () => StorageManager.clearAllData(),
            showHistory: () => StorageManager.displayRecentHistory(),
            restart: () => {
                if (tracker) tracker.destroy();
                startTracker();
            }
        };
    }

})();
