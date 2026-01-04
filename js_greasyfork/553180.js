// ==UserScript==
// @name         Spotify Ad Skipper (Background Pro X+)
// @name:zh-CN   Spotify 广告跳过器（后台专业增强版+）
// @namespace    https://github.com/xai-enhanced
// @version      1.2.3
// @description  Skips ads precisely without affecting normal track playback
// @description:zh-cn 精准跳过广告，不影响正常歌曲播放
// @author       Grok Enhanced
// @match        https://open.spotify.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=open.spotify.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553180/Spotify%20Ad%20Skipper%20%28Background%20Pro%20X%2B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553180/Spotify%20Ad%20Skipper%20%28Background%20Pro%20X%2B%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const DEFAULT_CONFIG = {
        CHECK_INTERVAL: 800,
        DYNAMIC_INTERVAL: true,
        MAX_ATTEMPTS: 10,
        DEBOUNCE_MS: 1500,
        ENABLE_MUTE_FALLBACK: true,
        ENABLE_NEXT_FALLBACK: true,
        RESTORE_VOLUME: true,
        LOG_LEVEL: 'info',
        LANGUAGE_PREFERENCE: 'auto',
        ERROR_REPORTING: true,
        SHOW_NOTIFICATIONS: true,
        MIN_AD_DURATION: 5000,
        UI_THEME: 'auto',
        BACKGROUND_CHECK_INTERVAL: 2500,
        USE_WEB_WORKER: true,
        WAKE_LOCK_FALLBACK: false,
        BACKGROUND_SKIP_PRIORITY: 'mute',
        RANDOMIZE_INTERVAL: true,
        BROWSER_OPTIMIZATION: 'auto',
        FALLBACK_DETECTION: true,
        MAX_NOTIFICATION_QUEUE: 3,
        ENABLE_NETWORK_MONITOR: true,
        MEMORY_CLEANUP_INTERVAL: 3600000,
        AD_CONFIDENCE_THRESHOLD: 0.7
    };

    let CONFIG = { ...DEFAULT_CONFIG };
    function loadConfig() {
        const saved = localStorage.getItem('spotifyAdSkipperConfig');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(CONFIG, parsed, {
                MIN_AD_DURATION: parsed.MIN_AD_DURATION || 5000,
                AD_CONFIDENCE_THRESHOLD: parsed.AD_CONFIDENCE_THRESHOLD || 0.7
            });
        }
    }
    loadConfig();

    // State Management
    let state = {
        isAdPlaying: false,
        lastAdTime: 0,
        checkAttempts: 0,
        intervalId: null,
        muteStateBeforeAd: null,
        volumeLevelBeforeAd: null,
        lastTrackInfo: null,
        detectionHistory: [],
        adStartTime: 0,
        currentTrackStartTime: 0,
        stats: JSON.parse(localStorage.getItem('adSkipperStats') || '{"adsSkipped":0,"adsMuted":0,"totalAdTime":0,"backgroundAdsHandled":0}'),
        isBackground: false,
        worker: null,
        notificationQueue: new WeakMap(),
        pendingNotifications: [],
        lastBrowserCheck: 0,
        browserFeatures: null,
        showingNotification: false
    };

    // Language Support (Chinese and English only)
    const LANG = {
        adTitles: {
            en: ['advertisement', 'sponsored', 'ad break'],
            zh: ['广告', '赞助', '广告时段']
        },
        skipLabels: {
            en: ['skip', 'next'],
            zh: ['跳过', '下一首']
        },
        notifications: {
            en: {
                adDetected: 'Ad detected, handling...',
                adSkipped: 'Ad skipped successfully',
                adMuted: 'Ad muted',
                volumeRestored: 'Volume restored',
                backgroundMode: 'Running in background mode',
                browserLimit: 'Browser limits background operations, may affect ad handling',
                workerFallback: 'Web Worker unavailable, switched to fallback mode',
                adBlocked: 'Ad blocked (total handled: %d)',
                configSaved: 'Settings saved',
                configReset: 'Settings reset',
                trackProtected: 'Normal track detected, protection active'
            },
            zh: {
                adDetected: '检测到广告，正在处理...',
                adSkipped: '广告已成功跳过',
                adMuted: '广告已静音',
                volumeRestored: '音量已恢复',
                backgroundMode: '后台模式运行中',
                browserLimit: '浏览器限制后台操作，可能影响广告处理',
                workerFallback: 'Web Worker不可用，已切换到备用模式',
                adBlocked: '广告已拦截（共处理: %d 个）',
                configSaved: '设置已保存',
                configReset: '设置已重置',
                trackProtected: '检测到正常曲目，已保护播放'
            }
        }
    };

    // Logger
    const logger = {
        debug: (...args) => CONFIG.LOG_LEVEL === 'debug' && console.log(`[${new Date().toISOString().slice(11,19)}] [Spotify Ad Skipper] DEBUG:`, ...args),
        info: (...args) => ['info', 'debug'].includes(CONFIG.LOG_LEVEL) && console.log(`[${new Date().toISOString().slice(11,19)}] [Spotify Ad Skipper] INFO:`, ...args),
        error: (...args) => console.error(`[${new Date().toISOString().slice(11,19)}] [Spotify Ad Skipper] ERROR:`, ...args),
        reportError: (error) => {
            if (!CONFIG.ERROR_REPORTING) return;
            const errorData = {
                browser: { name: navigator.userAgent, features: browser.getFeatures() },
                time: new Date().toISOString(),
                error: error.message,
                stack: error.stack,
                url: window.location.href,
                version: '1.2.3',
                isBackground: state.isBackground
            };
            const errors = JSON.parse(localStorage.getItem('adSkipperErrors') || '[]');
            errors.push(errorData);
            if (errors.length > 10) errors.shift();
            localStorage.setItem('adSkipperErrors', JSON.stringify(errors));
            logger.error('错误已记录（共', errors.length, '条）');
        },
        updateStats: (type) => {
            if (type === 'skip') state.stats.adsSkipped++;
            if (type === 'mute') state.stats.adsMuted++;
            if (state.isBackground && (type === 'skip' || type === 'mute')) {
                state.stats.backgroundAdsHandled++;
            }
            localStorage.setItem('adSkipperStats', JSON.stringify(state.stats));
            const total = state.stats.adsSkipped + state.stats.adsMuted;
            if (total > 0 && total % 5 === 0) {
                dom.showNotification('adBlocked', 'info', total);
            }
        }
    };

    // Browser Features
    const browser = {
        getFeatures() {
            if (state.browserFeatures && Date.now() - state.lastBrowserCheck < 3600000) {
                return state.browserFeatures;
            }
            const features = {
                wakeLock: 'wakeLock' in navigator,
                webWorker: 'Worker' in window,
                visibilityApi: 'visibilityState' in document,
                backgroundThrottling: false,
                isChrome: /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent),
                isFirefox: /Firefox/.test(navigator.userAgent),
                isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
                lowBattery: false
            };
            if ('getBattery' in navigator) {
                navigator.getBattery().then(battery => {
                    features.lowBattery = battery.level < 0.2 || !battery.charging;
                    if (features.lowBattery) {
                        CONFIG.BACKGROUND_CHECK_INTERVAL = Math.max(3000, CONFIG.BACKGROUND_CHECK_INTERVAL);
                        logger.debug('检测到低电量模式，延长检测间隔');
                    }
                });
            }
            state.browserFeatures = features;
            state.lastBrowserCheck = Date.now();
            return features;
        },
        autoOptimizeConfig() {
            if (CONFIG.BROWSER_OPTIMIZATION !== 'auto') return;
            const features = this.getFeatures();
            if (features.isSafari) {
                CONFIG.USE_WEB_WORKER = false;
                CONFIG.BACKGROUND_CHECK_INTERVAL = Math.max(3000, CONFIG.BACKGROUND_CHECK_INTERVAL);
                logger.debug('Safari优化：禁用Web Worker，延长检测间隔');
            }
            if (features.isFirefox || features.lowBattery) {
                CONFIG.WAKE_LOCK_FALLBACK = false;
                logger.debug('Firefox或低电量优化：禁用唤醒锁');
            }
            try {
                new Blob([''], { type: 'application/javascript' });
            } catch (e) {
                CONFIG.USE_WEB_WORKER = false;
                logger.debug('CSP阻止Web Worker，禁用');
                dom.showNotification('workerFallback');
            }
        }
    };

    // DOM Utilities
    const dom = {
        safeQuery: (selector) => {
            try {
                return document.querySelector(selector) || null;
            } catch (e) {
                logger.error('DOM查询失败:', selector, e);
                return null;
            }
        },
        safeClick: async (element, options = {}) => {
            if (!element) return false;
            try {
                const clickDelay = options.delay || Math.random() * 100 + 50;
                const click = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                setTimeout(() => element.dispatchEvent(click), clickDelay);
                logger.debug(`点击元素 [${element.tagName}] (延迟: ${Math.round(clickDelay)}ms)`);
                return true;
            } catch (e) {
                logger.error('点击元素失败:', e);
                logger.reportError(e);
                return false;
            }
        },
        getVolumeLevel: () => {
            const volumeSlider = dom.safeQuery('[data-testid="volume-bar"] input');
            return volumeSlider ? parseFloat(volumeSlider.value) : null;
        },
        setVolumeLevel: async (level) => {
            const volumeSlider = dom.safeQuery('[data-testid="volume-bar"] input');
            if (!volumeSlider) return false;
            volumeSlider.value = level;
            const changeEvent = new Event('input', { bubbles: true });
            volumeSlider.dispatchEvent(changeEvent);
            await new Promise(resolve => setTimeout(resolve, 100));
            logger.debug('音量设置为:', level);
            return true;
        },
        simulateKeyPress: (key = 'ArrowRight') => {
            const keyEvent = new KeyboardEvent('keydown', { bubbles: true, key });
            document.dispatchEvent(keyEvent);
            logger.debug(`模拟键盘按键: ${key}`);
        },
        updateTheme: () => {
            const spotifyRoot = document.querySelector('[data-testid="root"]');
            const isDark = CONFIG.UI_THEME === 'dark' || 
                          (CONFIG.UI_THEME === 'auto' && spotifyRoot?.classList.contains('dark'));
            document.documentElement.style.setProperty('--ad-skipper-bg', isDark ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)');
            document.documentElement.style.setProperty('--ad-skipper-text', isDark ? '#fff' : '#000');
            document.documentElement.style.setProperty('--ad-skipper-shadow', isDark ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.3)');
        },
        showNotification: (messageKey, type = 'info', ...args) => {
            if (!CONFIG.SHOW_NOTIFICATIONS) return;
            let message = LANG.notifications[dom.getLang()][messageKey] || messageKey;
            if (args.length && message.includes('%')) {
                message = message.replace(/%d/g, args[0] || '');
            }
            if (state.isBackground) {
                const pending = JSON.parse(localStorage.getItem('pendingNotifications') || '[]');
                if (pending.some(item => item.message === message)) return;
                pending.push({ message, type, time: Date.now() });
                localStorage.setItem('pendingNotifications', JSON.stringify(pending.slice(-CONFIG.MAX_NOTIFICATION_QUEUE)));
                return;
            }
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.bottom = '20px';
            container.style.left = '20px';
            container.style.zIndex = '1000000';
            const notification = document.createElement('div');
            notification.className = `ad-skipper-notification ${type}`;
            notification.textContent = message;
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '6px';
            notification.style.background = 'var(--ad-skipper-bg)';
            notification.style.color = 'var(--ad-skipper-text)';
            notification.style.boxShadow = 'var(--ad-skipper-shadow)';
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            container.appendChild(notification);
            document.body.appendChild(container);
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateY(0)';
            }, 10);
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(20px)';
                setTimeout(() => container.remove(), 300);
            }, 2500);
        },
        isPlaying: () => {
            const playPauseBtn = dom.safeQuery('[data-testid="control-button-playpause"]');
            const media = document.querySelector('audio, video');
            return (playPauseBtn?.ariaLabel?.includes('暂停') || 
                    playPauseBtn?.ariaLabel?.includes('Pause') ||
                    (media && !media.paused));
        },
        getLang: () => {
            return CONFIG.LANGUAGE_PREFERENCE === 'auto' 
                ? (navigator.language.includes('zh') ? 'zh' : 'en') 
                : CONFIG.LANGUAGE_PREFERENCE;
        },
        getStableTrackInfo() {
            const trackName = dom.safeQuery('[data-testid="now-playing-widget"] [data-testid="track-title"]')?.textContent?.trim() || '';
            const artistName = dom.safeQuery('[data-testid="now-playing-widget"] [data-testid="artist-name"]')?.textContent?.trim() || '';
            return trackName && artistName ? `${trackName} - ${artistName}` : null;
        }
    };

    // Ad Detector
    class AdDetector {
        constructor() {
            this.detectionRules = [
                () => LANG.adTitles[dom.getLang()]?.some(keyword => 
                    document.title.toLowerCase().includes(keyword.toLowerCase())),
                () => !!dom.safeQuery('[data-testid="ad-badge"], [aria-label*="ad"], [class*="ad-"][class*="badge"]'),
                () => {
                    const trackInfo = dom.getStableTrackInfo();
                    if (!trackInfo || !state.lastTrackInfo) return false;
                    const isRecentTrackChange = Date.now() - state.currentTrackStartTime < 3000;
                    return trackInfo !== state.lastTrackInfo && !isRecentTrackChange;
                },
                () => {
                    const skipButton = dom.safeQuery('[data-testid="control-button-skip"], [aria-label*="skip"], [aria-label*="Skip"]');
                    return !!skipButton && !skipButton.disabled;
                },
                () => {
                    const media = document.querySelector('audio, video');
                    return media && (media.src.includes('ad') || media.src.includes('sponsor') || media.src.includes('advertisement'));
                }
            ];
            this.fallbackRules = [
                () => !!document.querySelector('.ad-container, [data-ad-type], [role="banner"]'),
                () => {
                    const progressBar = dom.safeQuery('[data-testid="progress-bar"]');
                    if (!progressBar) return false;
                    const currentTime = parseFloat(progressBar.getAttribute('aria-valuenow') || 0);
                    const duration = parseFloat(progressBar.getAttribute('aria-valuemax') || 0);
                    return duration > 0 && duration < 30 && currentTime / duration > 0.8;
                }
            ];
            this.adThreshold = CONFIG.AD_CONFIDENCE_THRESHOLD;
            this.normalThreshold = 0.3;
        }
        
        detect() {
            const currentTrack = dom.getStableTrackInfo();
            if (currentTrack && currentTrack !== state.lastTrackInfo) {
                state.lastTrackInfo = currentTrack;
                state.currentTrackStartTime = Date.now();
                logger.debug(`检测到新曲目: ${currentTrack}`);
            }
            
            let results = this.detectionRules.map(rule => rule() ? 1 : 0);
            let finalScore = this.calculateScore(results);
            
            if (CONFIG.FALLBACK_DETECTION && finalScore > 0.3 && finalScore < this.adThreshold) {
                const fallbackResults = this.fallbackRules.map(rule => rule() ? 1 : 0);
                const fallbackScore = fallbackResults.reduce((sum, val) => sum + val, 0) / fallbackResults.length;
                finalScore = finalScore * 0.8 + fallbackScore * 0.2;
                logger.debug(`备用检测得分: ${fallbackScore.toFixed(2)}, 最终得分: ${finalScore.toFixed(2)}`);
            }
            
            if (Date.now() - state.currentTrackStartTime < 3000) {
                logger.debug(`新曲目保护期（${Math.round((3000 - (Date.now() - state.currentTrackStartTime))/1000)}s），强制降低广告判定概率`);
                finalScore = finalScore * 0.3;
            }
            
            if (state.isBackground && !dom.isPlaying()) {
                logger.debug('后台未播放，不判定为广告');
                return false;
            }
            
            logger.debug(`广告检测得分: ${finalScore.toFixed(2)} (阈值: ${this.adThreshold})`);
            return state.isAdPlaying 
                ? finalScore > this.normalThreshold 
                : finalScore > this.adThreshold;
        }
        
        calculateScore(results) {
            state.detectionHistory.push(results);
            if (state.detectionHistory.length > 5) state.detectionHistory.shift();
            
            const ruleWeights = [1.5, 2.0, 1.0, 2.0, 1.8];
            const weightedScores = state.detectionHistory.map((hist, idx) => {
                const timeWeight = (idx + 1) / state.detectionHistory.length;
                return hist.reduce((sum, val, i) => sum + val * timeWeight * ruleWeights[i], 0);
            });
            const totalWeight = ruleWeights.reduce((a, b) => a + b, 0) * state.detectionHistory.length;
            return totalWeight > 0 ? weightedScores.reduce((sum, score) => sum + score, 0) / totalWeight : 0;
        }
    }

    // Ad Handler
    class AdHandler {
        trySkipButton() {
            if (Date.now() - state.adStartTime < CONFIG.MIN_AD_DURATION) {
                logger.debug(`广告时长不足${CONFIG.MIN_AD_DURATION/1000}秒，暂不跳过`);
                return false;
            }
            
            const skipButton = dom.safeQuery('[data-testid="control-button-skip"], [aria-label*="skip"], [aria-label*="Skip"]');
            if (skipButton && dom.safeClick(skipButton, { delay: 300 })) {
                state.stats.totalAdTime += Date.now() - state.adStartTime;
                dom.showNotification('adSkipped');
                logger.updateStats('skip');
                this.resetState();
                return true;
            }
            return false;
        }
        
        tryNextButton() {
            if (!CONFIG.ENABLE_NEXT_FALLBACK) return false;
            
            if (Date.now() - state.adStartTime < CONFIG.MIN_AD_DURATION) {
                logger.debug(`广告时长不足${CONFIG.MIN_AD_DURATION/1000}秒，暂不使用下一首备用`);
                return false;
            }
            
            const nextButton = dom.safeQuery('[data-testid="control-button-next"], [aria-label*="下一首"], [aria-label*="Next"]');
            if (nextButton && dom.safeClick(nextButton, { delay: 300 })) {
                state.stats.totalAdTime += Date.now() - state.adStartTime;
                dom.showNotification('adSkipped');
                logger.updateStats('skip');
                this.resetState();
                return true;
            }
            dom.simulateKeyPress('ArrowRight');
            return false;
        }
        
        async tryMute() {
            if (!CONFIG.ENABLE_MUTE_FALLBACK) return false;
            
            const volumeSlider = dom.safeQuery('[data-testid="volume-bar"] input');
            if (!volumeSlider || volumeSlider.value === '0') return false;
            
            state.muteStateBeforeAd = volumeSlider.value !== '0';
            state.volumeLevelBeforeAd = dom.getVolumeLevel();
            
            if (await dom.setVolumeLevel(0)) {
                dom.showNotification('adMuted');
                logger.updateStats('mute');
                return true;
            }
            return false;
        }
        
        async restoreVolume() {
            if (!CONFIG.RESTORE_VOLUME || state.volumeLevelBeforeAd === null) return;
            
            const currentTrack = dom.getStableTrackInfo();
            if (currentTrack && state.lastTrackInfo === currentTrack) {
                if (await dom.setVolumeLevel(state.volumeLevelBeforeAd)) {
                    dom.showNotification('volumeRestored');
                    state.volumeLevelBeforeAd = null;
                }
            }
        }
        
        resetState() {
            state.isAdPlaying = false;
            state.checkAttempts = 0;
            state.adStartTime = 0;
            state.lastAdTime = Date.now();
        }
        
        async handleAd() {
            state.checkAttempts++;
            if (state.checkAttempts > CONFIG.MAX_ATTEMPTS) {
                logger.error('达到最大尝试次数，放弃处理');
                this.resetState();
                return false;
            }
            
            if (CONFIG.BACKGROUND_SKIP_PRIORITY === 'mute' && state.isBackground) {
                if (await this.tryMute()) return true;
                if (this.trySkipButton()) return true;
                if (this.tryNextButton()) return true;
            } else {
                if (this.trySkipButton()) return true;
                if (await this.tryMute()) return true;
                if (this.tryNextButton()) return true;
            }
            return false;
        }
    }

    // Configuration Panel
    class ConfigPanel {
        constructor() {
            this.panel = null;
            this.container = null;
            this.initStyle();
            this.createTriggerButton();
            this.createPanel();
        }

        initStyle() {
            if (document.getElementById('ad-skipper-global-style')) return;
            const style = document.createElement('style');
            style.id = 'ad-skipper-global-style';
            style.textContent = `
                .ad-skipper-config-container {
                    position: fixed !important;
                    z-index: 1000000 !important;
                    top: 20px !important;
                    right: 20px !important;
                    transform: translateZ(0);
                }
                .ad-skipper-trigger {
                    position: fixed !important;
                    z-index: 1000001 !important;
                    bottom: 20px !important;
                    right: 20px !important;
                    width: 48px !important;
                    height: 48px !important;
                    border-radius: 50% !important;
                    background: #1db954 !important;
                    color: white !important;
                    border: none !important;
                    cursor: pointer !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
                    font-size: 24px !important;
                    transition: transform 0.3s ease, background 0.3s ease !important;
                }
                .ad-skipper-trigger:hover {
                    transform: scale(1.1) !important;
                    background: #1ed760 !important;
                }
                .ad-skipper-config {
                    width: 320px;
                    padding: 20px;
                    border-radius: 8px;
                    background: var(--ad-skipper-bg);
                    color: var(--ad-skipper-text);
                    box-shadow: var(--ad-skipper-shadow);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                    font-size: 14px;
                }
                .ad-skipper-config h3 {
                    margin: 0 0 12px 0;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(128,128,128,0.3);
                }
                .ad-skipper-config label {
                    display: flex;
                    align-items: center;
                    margin: 10px 0;
                }
                .ad-skipper-config input[type="checkbox"] {
                    margin-right: 10px;
                }
                .ad-skipper-config input[type="range"] {
                    width: 100%;
                    margin: 10px 0;
                }
                .ad-skipper-config .range-label {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    margin-top: 5px;
                }
                .ad-skipper-config button {
                    width: 100%;
                    padding: 10px;
                    margin-top: 12px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.2s;
                }
                .ad-skipper-config button:hover {
                    filter: brightness(1.1);
                    transform: scale(1.02);
                }
            `;
            document.head.appendChild(style);
        }

        createTriggerButton() {
            let trigger = document.querySelector('.ad-skipper-trigger');
            if (trigger) return trigger;
            trigger = document.createElement('button');
            trigger.className = 'ad-skipper-trigger';
            trigger.textContent = '⚙️';
            trigger.title = dom.getLang() === 'zh' ? '广告跳过器设置' : 'Ad Skipper Settings';
            trigger.onclick = () => this.togglePanel();
            document.body.appendChild(trigger);
            return trigger;
        }

        createPanel() {
            if (this.panel) {
                this.updatePanelTheme();
                return;
            }

            this.container = document.createElement('div');
            this.container.className = 'ad-skipper-config-container';
            this.container.style.display = 'none';

            this.panel = document.createElement('div');
            this.panel.className = 'ad-skipper-config';
            
            const title = document.createElement('h3');
            title.textContent = dom.getLang() === 'zh' ? '广告跳过器设置' : 'Ad Skipper Settings';
            this.panel.appendChild(title);

            const stats = document.createElement('div');
            stats.style.margin = '10px 0';
            stats.style.padding = '10px';
            stats.style.borderRadius = '4px';
            stats.style.background = 'rgba(0,0,0,0.1)';
            stats.innerHTML = `
                <p><strong>${dom.getLang() === 'zh' ? '统计信息' : 'Statistics'}</strong></p>
                <p>${dom.getLang() === 'zh' ? '跳过广告' : 'Ads Skipped'}: ${state.stats.adsSkipped}</p>
                <p>${dom.getLang() === 'zh' ? '静音广告' : 'Ads Muted'}: ${state.stats.adsMuted}</p>
                <p>${dom.getLang() === 'zh' ? '后台处理' : 'Background Ads Handled'}: ${state.stats.backgroundAdsHandled}</p>
                <p>${dom.getLang() === 'zh' ? '节省时间' : 'Time Saved'}: ${Math.round(state.stats.totalAdTime / 1000)}s</p>
            `;
            this.panel.appendChild(stats);

            const browserInfo = document.createElement('div');
            browserInfo.style.margin = '10px 0';
            browserInfo.style.padding = '10px';
            browserInfo.style.borderRadius = '4px';
            browserInfo.style.background = 'rgba(0,0,0,0.1)';
            const features = browser.getFeatures();
            browserInfo.innerHTML = `
                <p style="margin: 0 0 5px 0;"><strong>${dom.getLang() === 'zh' ? '浏览器信息' : 'Browser Info'}:</strong></p>
                <p style="margin: 2px 0;">Web Worker: ${features.webWorker ? (dom.getLang() === 'zh' ? '支持' : 'Supported') : (dom.getLang() === 'zh' ? '不支持' : 'Not Supported')}</p>
                <p style="margin: 2px 0;">${dom.getLang() === 'zh' ? '唤醒锁' : 'Wake Lock'}: ${features.wakeLock ? (dom.getLang() === 'zh' ? '支持' : 'Supported') : (dom.getLang() === 'zh' ? '不支持' : 'Not Supported')}</p>
                <p style="margin: 2px 0;">${dom.getLang() === 'zh' ? '后台限制' : 'Background Throttling'}: ${features.backgroundThrottling ? (dom.getLang() === 'zh' ? '存在' : 'Present') : (dom.getLang() === 'zh' ? '无' : 'None')}</p>
            `;
            this.panel.appendChild(browserInfo);

            ['ENABLE_MUTE_FALLBACK', 'ENABLE_NEXT_FALLBACK', 'RESTORE_VOLUME', 'SHOW_NOTIFICATIONS'].forEach(key => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = CONFIG[key];
                checkbox.id = key;
                checkbox.onchange = () => {
                    CONFIG[key] = checkbox.checked;
                    this.saveConfig();
                };
                const label = document.createElement('label');
                label.htmlFor = key;
                label.textContent = dom.getLang() === 'zh' ? {
                    ENABLE_MUTE_FALLBACK: '启用静音备用',
                    ENABLE_NEXT_FALLBACK: '启用下一首备用',
                    RESTORE_VOLUME: '恢复音量',
                    SHOW_NOTIFICATIONS: '显示通知'
                }[key] : {
                    ENABLE_MUTE_FALLBACK: 'Enable Mute Fallback',
                    ENABLE_NEXT_FALLBACK: 'Enable Next Track Fallback',
                    RESTORE_VOLUME: 'Restore Volume',
                    SHOW_NOTIFICATIONS: 'Show Notifications'
                }[key];
                label.prepend(checkbox);
                this.panel.appendChild(label);
            });

            const thresholdLabel = document.createElement('label');
            thresholdLabel.textContent = dom.getLang() === 'zh' ? '广告检测灵敏度（数值越高越严格）' : 'Ad Detection Sensitivity (Higher = stricter)';
            this.panel.appendChild(thresholdLabel);
            
            const thresholdInput = document.createElement('input');
            thresholdInput.type = 'range';
            thresholdInput.min = 0.5;
            thresholdInput.max = 0.9;
            thresholdInput.step = 0.05;
            thresholdInput.value = CONFIG.AD_CONFIDENCE_THRESHOLD;
            thresholdInput.onchange = () => {
                CONFIG.AD_CONFIDENCE_THRESHOLD = parseFloat(thresholdInput.value);
                this.saveConfig();
                adDetector.adThreshold = CONFIG.AD_CONFIDENCE_THRESHOLD;
            };
            this.panel.appendChild(thresholdInput);
            
            const thresholdValues = document.createElement('div');
            thresholdValues.className = 'range-label';
            thresholdValues.innerHTML = `
                <span>${dom.getLang() === 'zh' ? '灵敏' : 'Sensitive'}</span>
                <span>${CONFIG.AD_CONFIDENCE_THRESHOLD.toFixed(2)}</span>
                <span>${dom.getLang() === 'zh' ? '严格' : 'Strict'}</span>
            `;
            this.panel.appendChild(thresholdValues);

            const minAdLabel = document.createElement('label');
            minAdLabel.textContent = dom.getLang() === 'zh' ? '广告最短时长（毫秒）' : 'Minimum Ad Duration (ms)';
            this.panel.appendChild(minAdLabel);
            
            const minAdInput = document.createElement('input');
            minAdInput.type = 'range';
            minAdInput.min = 2000;
            minAdInput.max = 10000;
            minAdInput.step = 1000;
            minAdInput.value = CONFIG.MIN_AD_DURATION;
            minAdInput.onchange = () => {
                CONFIG.MIN_AD_DURATION = parseInt(minAdInput.value);
                this.saveConfig();
            };
            this.panel.appendChild(minAdInput);
            
            const minAdValues = document.createElement('div');
            minAdValues.className = 'range-label';
            minAdValues.innerHTML = `
                <span>2s</span>
                <span>${CONFIG.MIN_AD_DURATION/1000}s</span>
                <span>10s</span>
            `;
            this.panel.appendChild(minAdValues);

            const saveBtn = document.createElement('button');
            saveBtn.textContent = dom.getLang() === 'zh' ? '保存设置' : 'Save Settings';
            saveBtn.style.background = '#1db954';
            saveBtn.style.color = 'white';
            saveBtn.onclick = () => {
                this.saveConfig();
                dom.showNotification('configSaved');
                this.togglePanel();
            };
            this.panel.appendChild(saveBtn);

            const resetBtn = document.createElement('button');
            resetBtn.textContent = dom.getLang() === 'zh' ? '重置设置' : 'Reset Settings';
            resetBtn.style.background = '#ff5555';
            resetBtn.style.color = 'white';
            resetBtn.onclick = () => {
                if (confirm(dom.getLang() === 'zh' ? '确定要重置所有设置吗？' : 'Are you sure to reset all settings?')) {
                    localStorage.removeItem('spotifyAdSkipperConfig');
                    localStorage.removeItem('adSkipperStats');
                    localStorage.removeItem('pendingNotifications');
                    Object.assign(CONFIG, DEFAULT_CONFIG);
                    Object.assign(state.stats, {
                        adsSkipped: 0,
                        adsMuted: 0,
                        totalAdTime: 0,
                        backgroundAdsHandled: 0
                    });
                    dom.showNotification('configReset');
                    this.togglePanel();
                    window.location.reload();
                }
            };
            this.panel.appendChild(resetBtn);

            const errorExportBtn = document.createElement('button');
            errorExportBtn.textContent = dom.getLang() === 'zh' ? '导出错误日志' : 'Export Error Logs';
            errorExportBtn.style.background = '#ff9900';
            errorExportBtn.style.color = 'white';
            errorExportBtn.onclick = () => {
                const errors = JSON.parse(localStorage.getItem('adSkipperErrors') || '[]');
                const json = JSON.stringify(errors, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'adSkipperErrors.json';
                a.click();
                URL.revokeObjectURL(url);
                dom.showNotification('错误日志已导出', 'info');
            };
            this.panel.appendChild(errorExportBtn);

            this.container.appendChild(this.panel);
            document.body.appendChild(this.container);
        }

        saveConfig() {
            localStorage.setItem('spotifyAdSkipperConfig', JSON.stringify(CONFIG));
        }

        togglePanel() {
            if (!this.panel) this.createPanel();
            this.container.style.display = this.container.style.display === 'none' ? 'block' : 'none';
        }

        updatePanelTheme() {
            dom.updateTheme();
            if (!this.panel) return;
            this.panel.style.background = 'var(--ad-skipper-bg)';
            this.panel.style.color = 'var(--ad-skipper-text)';
            this.panel.style.boxShadow = 'var(--ad-skipper-shadow)';
        }
    }

    // Web Worker
    function initWebWorker() {
        const features = browser.getFeatures();
        if (!CONFIG.USE_WEB_WORKER || !features.webWorker) {
            logger.info('Web Worker不可用，回退到主线程');
            dom.showNotification('workerFallback');
            return;
        }
        try {
            const workerCode = `
                let checkInterval, detectionHistory = [];
                self.onmessage = (e) => {
                    try {
                        if (e.data.type === 'start') {
                            if (checkInterval) clearInterval(checkInterval);
                            checkInterval = setInterval(() => self.postMessage({ type: 'check' }), e.data.interval);
                        } else if (e.data.type === 'updateData') {
                            const { title, adTitles, progress, duration, trackInfo, trackStartTime, minAdDuration } = e.data;
                            const results = [
                                adTitles.some(keyword => title.toLowerCase().includes(keyword.toLowerCase())),
                                progress > 0 && duration < 30 && (progress / duration) > 0.8,
                                title.includes(' - ') && trackInfo !== e.data.lastTrackInfo && Date.now() - trackStartTime > 3000
                            ].map(r => r ? 1 : 0);
                            detectionHistory.push(results);
                            if (detectionHistory.length > 5) detectionHistory.shift();
                            const ruleWeights = [2.0, 1.5, 1.0];
                            const weightedScore = detectionHistory.reduce((sum, hist, idx) => {
                                const timeWeight = (idx + 1) / detectionHistory.length;
                                return sum + hist.reduce((s, v, i) => s + v * timeWeight * ruleWeights[i], 0);
                            }, 0) / (ruleWeights.reduce((a, b) => a + b, 0) * detectionHistory.length);
                            const isNewTrack = Date.now() - trackStartTime < 3000;
                            const finalScore = isNewTrack ? weightedScore * 0.3 : weightedScore;
                            self.postMessage({ 
                                type: 'result', 
                                isAd: finalScore > e.data.threshold && Date.now() - trackStartTime > minAdDuration
                            });
                        } else if (e.data.type === 'stop') {
                            clearInterval(checkInterval);
                            checkInterval = null;
                        } else if (e.data.type === 'ping') {
                            self.postMessage({ type: 'pong' });
                        }
                    } catch (e) {
                        self.postMessage({ type: 'error', error: e.message });
                    }
                };
            `;
            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const workerUrl = URL.createObjectURL(blob);
            state.worker = new Worker(workerUrl);
            state.worker.onerror = (e) => {
                logger.error('Web Worker错误:', e);
                logger.reportError(e);
                state.worker.terminate();
                state.worker = null;
                dom.showNotification('workerFallback');
            };
            state.worker.onmessage = (e) => {
                if (e.data.type === 'error') {
                    logger.error('Worker内部错误:', e.data.error);
                    return;
                }
                if (e.data.type === 'check' && state.isBackground) {
                    const progressBar = dom.safeQuery('[data-testid="progress-bar"]');
                    const progress = progressBar ? parseFloat(progressBar.getAttribute('aria-valuenow') || 0) : 0;
                    const duration = progressBar ? parseFloat(progressBar.getAttribute('aria-valuemax') || 0) : 0;
                    state.worker.postMessage({
                        type: 'updateData',
                        title: document.title,
                        adTitles: LANG.adTitles[dom.getLang()] || LANG.adTitles.en,
                        progress,
                        duration,
                        trackInfo: dom.getStableTrackInfo(),
                        lastTrackInfo: state.lastTrackInfo,
                        trackStartTime: state.currentTrackStartTime,
                        threshold: CONFIG.AD_CONFIDENCE_THRESHOLD,
                        minAdDuration: CONFIG.MIN_AD_DURATION
                    });
                } else if (e.data.type === 'result' && state.isBackground) {
                    if (e.data.isAd && !state.isAdPlaying) {
                        logger.debug('Worker检测到广告');
                        state.isAdPlaying = true;
                        state.adStartTime = Date.now();
                        dom.showNotification('adDetected');
                        new AdHandler().handleAd();
                    } else if (!e.data.isAd && state.isAdPlaying) {
                        new AdHandler().restoreVolume();
                        state.isAdPlaying = false;
                    }
                }
            };
            state.worker.postMessage({
                type: 'start',
                interval: CONFIG.BACKGROUND_CHECK_INTERVAL
            });
            setInterval(() => {
                if (state.worker) {
                    state.worker.postMessage({ type: 'ping' });
                }
            }, 5000);
            logger.debug('Web Worker初始化成功');
        } catch (e) {
            logger.error('Web Worker初始化失败:', e);
            logger.reportError(e);
            state.worker = null;
            dom.showNotification('workerFallback');
        }
    }

    // Main Loop
    async function checkAds() {
        try {
            if (state.isBackground && state.worker) return;
            
            const detector = new AdDetector();
            const isAd = detector.detect();
            
            if (isAd && !state.isAdPlaying) {
                const secondCheck = await new Promise(resolve => {
                    setTimeout(() => resolve(detector.detect()), 300);
                });
                if (secondCheck) {
                    state.isAdPlaying = true;
                    state.adStartTime = Date.now();
                    dom.showNotification('adDetected');
                    await new AdHandler().handleAd();
                } else {
                    logger.debug('二次检测否定广告判定，避免误判');
                }
            } else if (!isAd && state.isAdPlaying) {
                await new AdHandler().restoreVolume();
                state.isAdPlaying = false;
                dom.showNotification('trackProtected');
            } else if (isAd && state.isAdPlaying) {
                await new AdHandler().handleAd();
            }
        } catch (e) {
            logger.error('广告检测循环错误:', e);
            logger.reportError(e);
        }
    }

    // Start Checking
    function startChecking() {
        clearInterval(state.intervalId);
        const getInterval = () => {
            const base = state.isBackground ? CONFIG.BACKGROUND_CHECK_INTERVAL : CONFIG.CHECK_INTERVAL;
            return CONFIG.RANDOMIZE_INTERVAL 
                ? base * (0.8 + Math.random() * 0.4) 
                : base;
        };
        state.intervalId = setInterval(checkAds, getInterval());
        logger.debug(`开始广告检测循环，初始间隔: ${getInterval()}ms`);
    }

    // Handle Visibility Change
    function handleVisibilityChange() {
        const wasBackground = state.isBackground;
        state.isBackground = document.visibilityState !== 'visible';
        
        if (state.isBackground && !wasBackground) {
            logger.debug('切换到后台模式');
            dom.showNotification('backgroundMode');
            if (browser.getFeatures().backgroundThrottling) {
                dom.showNotification('browserLimit');
            }
            startChecking();
            initWebWorker();
        } else if (!state.isBackground && wasBackground) {
            logger.debug('切换到前台模式');
            if (state.worker) {
                state.worker.postMessage({ type: 'stop' });
                state.worker.terminate();
                state.worker = null;
            }
            const pending = JSON.parse(localStorage.getItem('pendingNotifications') || '[]');
            pending.forEach(item => dom.showNotification(item.message, item.type));
            localStorage.removeItem('pendingNotifications');
            startChecking();
        }
    }

    // Initialization
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', start);
        } else {
            start();
        }
    }

    function start() {
        dom.updateTheme();
        browser.autoOptimizeConfig();
        const configPanel = new ConfigPanel();
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                configPanel.togglePanel();
            }
        });
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        startChecking();
        
        setInterval(() => {
            logger.debug('执行内存清理');
            state.detectionHistory = state.detectionHistory.slice(-2);
            state.lastBrowserCheck = 0;
        }, CONFIG.MEMORY_CLEANUP_INTERVAL);
        
        logger.info('Spotify广告跳过器初始化完成 (v1.2.3)');
    }

    const adDetector = new AdDetector();
    init();
})();