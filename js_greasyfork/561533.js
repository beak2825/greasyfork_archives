// ==UserScript==
// @name         威软去广告
// @namespace    https://weiruan.tech/
// @version      1.1.0
// @description  去除各大视频网站广告，保持原始界面不变 - 威软科技制作
// @author       威软科技制作
// @match        *://*.youku.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.iq.com/*
// @match        *://*.qq.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.mgtv.com/*
// @match        *://*.youtube.com/*
// @match        *://*.ixigua.com/*
// @match        *://*.sohu.com/*
// @match        *://*.le.com/*
// @match        *://*.pptv.com/*
// @match        *://*.tudou.com/*
// @match        *://*.acfun.cn/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561533/%E5%A8%81%E8%BD%AF%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/561533/%E5%A8%81%E8%BD%AF%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置 ==========
    const CONFIG = {
        debug: true,  // 开启调试模式查看日志
        checkInterval: 200,    // 广告检测间隔 (毫秒)
        youtubeCheckInterval: 100  // YouTube专用检测间隔
    };

    // ========== 日志工具 ==========
    const log = {
        info: (msg) => CONFIG.debug && console.log(`[威软去广告] ${msg}`),
        warn: (msg) => CONFIG.debug && console.warn(`[威软去广告] ${msg}`),
        error: (msg) => console.error(`[威软去广告] ${msg}`)
    };

    log.info('威软去广告脚本 v1.1.0 已加载 - 威软科技制作');

    // ========== 获取当前站点 ==========
    function getCurrentSite() {
        const hostname = location.hostname;
        if (hostname.includes('youtube.com')) return 'youtube';
        if (hostname.includes('youku.com')) return 'youku';
        if (hostname.includes('iqiyi.com')) return 'iqiyi';
        if (hostname.includes('qq.com')) return 'qq';
        if (hostname.includes('bilibili.com')) return 'bilibili';
        if (hostname.includes('mgtv.com')) return 'mgtv';
        if (hostname.includes('ixigua.com')) return 'ixigua';
        return 'other';
    }

    // ========================================================
    // YouTube 专用广告处理
    // ========================================================
    const YouTubeAdBlocker = {
        isProcessing: false,
        lastAdTime: 0,

        init() {
            log.info('YouTube广告拦截器初始化');
            this.startMonitoring();
            this.injectStyles();
        },

        // 注入CSS - 只隐藏广告覆盖层，不影响视频播放器
        injectStyles() {
            const css = `
                /* 隐藏广告覆盖层和提示，但不隐藏视频 */
                .ytp-ad-overlay-slot,
                .ytp-ad-text-overlay,
                .ytp-ad-overlay-container,
                .ytp-ad-overlay-image,
                ytd-display-ad-renderer,
                ytd-promoted-sparkles-web-renderer,
                ytd-promoted-sparkles-text-search-renderer,
                ytd-companion-slot-renderer,
                ytd-action-companion-ad-renderer,
                ytd-watch-next-secondary-results-renderer ytd-compact-promoted-video-renderer,
                ytd-player-legacy-desktop-watch-ads-renderer,
                #player-ads,
                #masthead-ad,
                ytd-banner-promo-renderer,
                ytd-video-masthead-ad-v3-renderer,
                ytd-primetime-promo-renderer,
                .ytd-rich-item-renderer:has(ytd-ad-slot-renderer),
                ytd-ad-slot-renderer,
                ytd-in-feed-ad-layout-renderer,
                ytd-reel-video-renderer:has(.ytd-ad-slot-renderer),
                .ytp-suggested-action,
                .ytp-featured-product,
                .iv-branding {
                    display: none !important;
                }

                /* 隐藏广告跳过倒计时文字，但保留跳过按钮 */
                .ytp-ad-preview-container {
                    opacity: 0.3 !important;
                }
            `;

            const style = document.createElement('style');
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
            log.info('YouTube CSS样式已注入');
        },

        // 开始监控
        startMonitoring() {
            // 高频率检测广告
            setInterval(() => this.handleAds(), CONFIG.youtubeCheckInterval);

            // 监听DOM变化
            const observer = new MutationObserver(() => {
                this.handleAds();
            });

            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    observer.observe(document.body, { childList: true, subtree: true });
                });
            }
        },

        // 处理广告
        handleAds() {
            this.skipAd();
            this.speedUpAd();
            this.removeAdOverlays();
        },

        // 点击跳过按钮
        skipAd() {
            // 各种跳过按钮选择器
            const skipSelectors = [
                '.ytp-ad-skip-button',
                '.ytp-ad-skip-button-modern',
                '.ytp-skip-ad-button',
                'button.ytp-ad-skip-button-modern',
                '.ytp-ad-skip-button-container button',
                '[class*="skip"] button',
                '.videoAdUiSkipButton',
                '.ytp-ad-skip-button-slot button'
            ];

            for (const selector of skipSelectors) {
                const skipButton = document.querySelector(selector);
                if (skipButton && skipButton.offsetParent !== null) {
                    skipButton.click();
                    log.info('已点击跳过广告按钮');
                    return true;
                }
            }
            return false;
        },

        // 加速并跳过不可跳过的广告
        speedUpAd() {
            const video = document.querySelector('video.html5-main-video');
            if (!video) return;

            // 检测是否正在播放广告
            const isAdPlaying = this.isAdPlaying();

            if (isAdPlaying) {
                const now = Date.now();
                if (now - this.lastAdTime > 500) {
                    log.info('检测到广告正在播放，正在跳过...');
                    this.lastAdTime = now;
                }

                // 静音
                video.muted = true;

                // 尝试直接跳到视频结尾
                if (video.duration && isFinite(video.duration)) {
                    video.currentTime = video.duration;
                    log.info('已跳转到广告结尾');
                }

                // 如果无法跳转，则加速播放
                if (video.playbackRate !== 16) {
                    video.playbackRate = 16;
                    log.info('已将广告播放速度设为16倍');
                }
            } else {
                // 广告结束，恢复正常
                if (video.playbackRate === 16) {
                    video.playbackRate = 1;
                    video.muted = false;
                    log.info('广告结束，已恢复正常播放');
                }
            }
        },

        // 检测是否正在播放广告
        isAdPlaying() {
            // 方法1: 检查广告相关元素
            const adIndicators = [
                '.ytp-ad-player-overlay',
                '.ytp-ad-player-overlay-instream-info',
                '.ytp-ad-text',
                '.ytp-ad-preview-container',
                '.ytp-ad-simple-ad-badge',
                '.ad-showing',
                '.ytp-ad-skip-button-container'
            ];

            for (const selector of adIndicators) {
                const el = document.querySelector(selector);
                if (el && el.offsetParent !== null) {
                    return true;
                }
            }

            // 方法2: 检查播放器类名
            const player = document.querySelector('.html5-video-player');
            if (player && player.classList.contains('ad-showing')) {
                return true;
            }

            // 方法3: 检查视频元素的广告属性
            const video = document.querySelector('video.html5-main-video');
            if (video) {
                const adModule = document.querySelector('.ytp-ad-module');
                if (adModule && adModule.children.length > 0) {
                    return true;
                }
            }

            return false;
        },

        // 移除广告覆盖层
        removeAdOverlays() {
            const overlaySelectors = [
                '.ytp-ad-overlay-slot',
                '.ytp-ad-overlay-container',
                '.ytp-ad-text-overlay'
            ];

            overlaySelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el.innerHTML.trim()) {
                        el.innerHTML = '';
                        log.info(`已清空广告覆盖层: ${selector}`);
                    }
                });
            });
        }
    };

    // ========================================================
    // 哔哩哔哩专用处理
    // ========================================================
    const BilibiliAdBlocker = {
        init() {
            log.info('哔哩哔哩广告拦截器初始化');
            this.injectStyles();
        },

        injectStyles() {
            const css = `
                .ad-report,
                .bili-ad,
                .video-card-ad-small,
                .ad-floor-cover,
                .floor-single-card,
                .activity-banner,
                .slide-ad-exp,
                .video-page-game-card,
                .video-page-special-card-small,
                .bili-video-card__info--ad,
                [class*="ad-report"],
                .pop-live-small-mode,
                .desktop-download-tip,
                .storage-box,
                .eva-banner {
                    display: none !important;
                }
            `;
            const style = document.createElement('style');
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        }
    };

    // ========================================================
    // 优酷专用处理
    // ========================================================
    const YoukuAdBlocker = {
        init() {
            log.info('优酷广告拦截器初始化');
            this.injectStyles();
            this.startMonitoring();
        },

        injectStyles() {
            const css = `
                .advertise-layer,
                .ad-layer,
                .youku-layer-ad,
                .yk-ad,
                .player-ad-tips,
                .ad-tips,
                .h5-ext-ad,
                .h5-layer-ad,
                .advertise,
                [class*="yk_ad"],
                [class*="youku-ad"] {
                    display: none !important;
                }
            `;
            const style = document.createElement('style');
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        },

        startMonitoring() {
            setInterval(() => {
                // 尝试跳过广告
                const skipBtn = document.querySelector('.advertise-skip, .skip-ad, [class*="skip"]');
                if (skipBtn) {
                    skipBtn.click();
                    log.info('已跳过优酷广告');
                }
            }, CONFIG.checkInterval);
        }
    };

    // ========================================================
    // 爱奇艺专用处理
    // ========================================================
    const IqiyiAdBlocker = {
        init() {
            log.info('爱奇艺广告拦截器初始化');
            this.injectStyles();
            this.startMonitoring();
        },

        injectStyles() {
            const css = `
                .iqp-ad,
                .cupid-wrap,
                .cupid-player,
                .skippable-ad,
                .ad-pause,
                .qy-ad,
                .iqp-ads,
                [class*="cupid"],
                [class*="iqp-ad"],
                .pause-ad-container {
                    display: none !important;
                }
            `;
            const style = document.createElement('style');
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        },

        startMonitoring() {
            setInterval(() => {
                const skipBtn = document.querySelector('.skippable-ad-skip, [class*="skip"]');
                if (skipBtn) {
                    skipBtn.click();
                    log.info('已跳过爱奇艺广告');
                }
            }, CONFIG.checkInterval);
        }
    };

    // ========================================================
    // 腾讯视频专用处理
    // ========================================================
    const QQVideoAdBlocker = {
        init() {
            log.info('腾讯视频广告拦截器初始化');
            this.injectStyles();
            this.startMonitoring();
        },

        injectStyles() {
            const css = `
                .txp_ad,
                .txp_ads,
                .ad_area,
                .txp_pause_ad,
                .mod_ad,
                #adPlayer,
                [class*="txp_ad"],
                [class*="txp-ad"] {
                    display: none !important;
                }
            `;
            const style = document.createElement('style');
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        },

        startMonitoring() {
            setInterval(() => {
                const skipBtn = document.querySelector('.txp_ad_skip, [class*="skip"]');
                if (skipBtn) {
                    skipBtn.click();
                    log.info('已跳过腾讯视频广告');
                }
            }, CONFIG.checkInterval);
        }
    };

    // ========================================================
    // 通用广告拦截
    // ========================================================
    const GenericAdBlocker = {
        init() {
            log.info('通用广告拦截器初始化');
            this.blockAdRequests();
        },

        // 拦截广告网络请求
        blockAdRequests() {
            const adPatterns = [
                /doubleclick\.net/i,
                /googlesyndication\.com/i,
                /googleadservices\.com/i,
                /moatads\.com/i,
                /adnxs\.com/i,
                /adsense/i,
                /atm\.youku\.com/i,
                /cupid\.iqiyi\.com/i,
                /btrace\.qq\.com/i
            ];

            // 拦截 XMLHttpRequest
            const originalXHROpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url, ...args) {
                if (typeof url === 'string' && adPatterns.some(p => p.test(url))) {
                    log.info(`已拦截广告请求: ${url.substring(0, 60)}...`);
                    return;
                }
                return originalXHROpen.call(this, method, url, ...args);
            };

            // 拦截 Fetch
            const originalFetch = window.fetch;
            window.fetch = function(url, ...args) {
                const urlStr = typeof url === 'string' ? url : url.url || '';
                if (adPatterns.some(p => p.test(urlStr))) {
                    log.info(`已拦截广告Fetch: ${urlStr.substring(0, 60)}...`);
                    return Promise.resolve(new Response('', { status: 200 }));
                }
                return originalFetch.call(this, url, ...args);
            };

            log.info('网络请求拦截已启用');
        }
    };

    // ========================================================
    // 主初始化
    // ========================================================
    function init() {
        const site = getCurrentSite();
        log.info(`当前站点: ${site}`);

        // 通用拦截
        GenericAdBlocker.init();

        // 根据站点初始化专用拦截器
        switch (site) {
            case 'youtube':
                YouTubeAdBlocker.init();
                break;
            case 'bilibili':
                BilibiliAdBlocker.init();
                break;
            case 'youku':
                YoukuAdBlocker.init();
                break;
            case 'iqiyi':
                IqiyiAdBlocker.init();
                break;
            case 'qq':
                QQVideoAdBlocker.init();
                break;
            default:
                log.info('使用通用广告拦截');
        }

        log.info('威软去广告初始化完成 - 威软科技制作');
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();