// ==UserScript==
// @name         X Reels ++ NSFW ecchi ver. (Fork)
// @name:en         X Reels ++ NSFW ecchi ver. (Fork)
// @namespace    http://tampermonkey.net/
// @version      28.8.18
// @description  Transforms the X/Twitter feed into a full-screen viewer with keyboard & mouse wheel navigation, smart auto-scroll, playback speed control, and a robust follow-and-return action.
// @description:en  Transforms the X/Twitter feed into a full-screen viewer with keyboard & mouse wheel navigation, smart auto-scroll, playback speed control, and a robust follow-and-return action.
// @author       sukimono, Original Author: Kristijan1001
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561772/X%20Reels%20%2B%2B%20NSFW%20ecchi%20ver%20%28Fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561772/X%20Reels%20%2B%2B%20NSFW%20ecchi%20ver%20%28Fork%29.meta.js
// ==/UserScript==

// Fork Attribution
// - Original Author: Kristijan1001 (https://greasyfork.org/ja/users/916612-kristijan1001)
// - Fork/Publisher: sukimono (https://greasyfork.org/ja/users/1557622-sukimono)
// This fork adds UI/UX and performance improvements while keeping the MIT license.

(function() {
    'use strict';

    class TikTokFeed {
        constructor() {
            this.activePost = { id: null, element: null, mediaItems: [], currentMediaIndex: 0 };
            this.activePlaceholder = null;
            this.activeDisplayedMediaElement = null;
            this.isActive = false;
            this.isNavigating = false;
            this.lastScrollTime = 0;
            this.container = null;
            this.likeButton = null;
            this.followButton = null;
            this.exitButton = null;
            this.scrollUpButton = null;
            this.scrollDownButton = null;
            this.savedScrollPosition = 0;
            this.mutationObserver = null;
            this.isReturningFromFollow = false;

            // Updated: Parse potentially existing smart value (-1)
            this.autoScrollDelay = parseInt(localStorage.getItem('xreels_autoScrollDelay') || '0', 10);
            this.autoScrollTimeoutId = null;
            this.videoEndedListener = null; // New listener for Smart mode
            this.autoScrollWatchdogId = null; // Watchdog timer for auto-scroll

            this.hideControlsTimeoutId = null;
            this.hideInfoTimeoutId = null;
            this.galleryIndicatorTimeout = null;

            this.savedVolume = parseFloat(localStorage.getItem('xreels_volume') || '0.7');
            this.savedMuted = localStorage.getItem('xreels_muted') === 'true';
            this.savedPlaybackRate = parseFloat(localStorage.getItem('xreels_playbackRate')) || 1.0;

            this.boundHandleWheel = null;
            this.boundHandleKeydown = null;
            this.boundHandlePopState = null;

            // マウス移動によるオートプレイ保留管理
            this.pointerMoving = false;
            this.pointerIdleTimeoutId = null;
            this.deferredAutoAdvance = null;
            this.pointerMoveRafId = null;

            // ぼかしフィルターの状態
            this.blurEnabled = localStorage.getItem('xreels_blur') === 'true';

            // パネルとメインテキストの共通スケール設定（旧キーからのフォールバックも考慮）
            const legacyTextSize = localStorage.getItem('xreels_prevTextSize') || localStorage.getItem('xreels_nextTextSize');
            const legacyImagePx = parseInt(localStorage.getItem('xreels_prevImageSize') || localStorage.getItem('xreels_nextImageSize') || '0', 10);
            const legacyImagePercent = legacyImagePx ? Math.min(100, Math.max(20, Math.round((legacyImagePx / 350) * 100))) : null;

            this.panelSettings = {
                textSize: parseInt(localStorage.getItem('xreels_textSize') || legacyTextSize || '11', 10),
                imagePercent: parseInt(localStorage.getItem('xreels_imagePercent') || (legacyImagePercent ? legacyImagePercent.toString() : '60'), 10)
            };
            
            this.hiddenPosts = []; // フィルタリングで非表示にしたポストを記録
        }

        init() {
            console.log('🔥 X Reels Initializing...');
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
                console.log('History scroll restoration set to manual.');
            }
            this.setupEventListeners();
            setTimeout(() => this.addManualTrigger(), 1000);
        }

        addManualTrigger() {
            if (window.self !== window.top) return;
            if (window.location !== window.parent.location) return;

            let trigger = document.getElementById('tiktok-trigger');
            if (trigger) trigger.remove();

            trigger = document.createElement('div');
            trigger.id = 'tiktok-trigger';
            trigger.innerHTML = `
                <div class="trigger-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.59 10.59L12 3l-7.59 7.59-1.42-1.41L12 0l8.99 9-1.4 1.59z" fill="currentColor"/>
                        <path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="trigger-content">
                    <div class="trigger-title">X Reels</div>
                    <div class="trigger-subtitle">Press X</div>
                </div>
            `;

            trigger.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 1000000;
                display: flex; align-items: center; gap: 12px;
                padding: 14px 20px;
                background: linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%);
                border: 1px solid rgba(255, 0, 80, 0.3); border-radius: 16px;
                cursor: pointer; user-select: none;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset, 0 0 20px rgba(255, 0, 80, 0.15);
                backdrop-filter: blur(20px) saturate(180%);
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                transform: translateY(0) scale(1); opacity: 1;
            `;

            const style = document.createElement('style');
            style.textContent = `
                #tiktok-trigger { animation: slideInDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
                #tiktok-trigger .trigger-icon { width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #ff0050 0%, #ff4081 100%); border-radius: 10px; flex-shrink: 0; box-shadow: 0 4px 16px rgba(255, 0, 80, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset; transition: all 0.3s ease; }
                #tiktok-trigger .trigger-icon svg { color: white; width: 22px; height: 22px; animation: iconPulse 2.5s ease-in-out infinite; }
                #tiktok-trigger .trigger-content { display: flex; flex-direction: column; gap: 1px; }
                #tiktok-trigger .trigger-title { color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; line-height: 1.2; }
                #tiktok-trigger .trigger-subtitle { color: rgba(255, 255, 255, 0.55); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.3px; }
                #tiktok-trigger:hover { transform: translateY(-3px) scale(1.02); border-color: rgba(255, 0, 80, 0.5); box-shadow: 0 10px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 25px rgba(255, 0, 80, 0.25); }
                #tiktok-trigger:hover .trigger-icon { transform: scale(1.08) rotate(5deg); box-shadow: 0 5px 16px rgba(255, 0, 80, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2) inset; }
                #tiktok-trigger:hover .trigger-icon svg { animation: iconSpin 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
                #tiktok-trigger:active { transform: translateY(-1px) scale(0.98); transition: all 0.1s ease; }
                #tiktok-trigger::before { content: ''; position: absolute; inset: -2px; background: linear-gradient(135deg, #ff0050, #ff4081, #ff0050); border-radius: 14px; opacity: 0; transition: opacity 0.3s ease; z-index: -1; filter: blur(8px); }
                #tiktok-trigger:hover::before { opacity: 0.25; animation: gradientRotate 2s linear infinite; }
                @keyframes slideInDown { from { opacity: 0; transform: translateY(-30px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes iconPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.9; } }
                @keyframes iconSpin { from { transform: rotate(0deg) scale(1); } to { transform: rotate(360deg) scale(1.08); } }
                @keyframes gradientRotate { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                @media (max-width: 768px) { #tiktok-trigger { top: 12px; right: 12px; padding: 8px 12px; gap: 8px; } #tiktok-trigger .trigger-icon { width: 32px; height: 32px; } #tiktok-trigger .trigger-icon svg { width: 16px; height: 16px; } #tiktok-trigger .trigger-title { font-size: 12px; } #tiktok-trigger .trigger-subtitle { font-size: 9px; } }
            `;
            if (!document.getElementById('xreels-pulse-style')) {
                style.id = 'xreels-pulse-style';
                document.head.appendChild(style);
            }

            trigger.addEventListener('click', () => this.startFeed());
            document.body.appendChild(trigger);
        }

        startFeed() {
            if (this.isActive) return;

            document.querySelectorAll('video').forEach(vid => {
            this.lastScrollTime = Date.now();
            });

            // フィルタリング条件を満たさないポストを全部非表示にする
            this.hideNonFilteredPosts();

            const firstPostWithMedia = this.findCentralMediaArticle();
            if (!firstPostWithMedia) {
                console.error('❌ No media found on screen. Scroll down and try again.');
                return;
            }
            this.isActive = true;
            this.createContainer();
            this.navigateToPost(firstPostWithMedia);
            const trigger = document.getElementById('tiktok-trigger');
            if (trigger) trigger.style.display = 'none';
        }

        exit() {
            console.log('👋 Exiting feed...');
            this.isActive = false;
            this.stopAutoScrollTimer();
            if (this.pointerIdleTimeoutId) {
                clearTimeout(this.pointerIdleTimeoutId);
                this.pointerIdleTimeoutId = null;
            }
            if (this.pointerMoveRafId) {
                cancelAnimationFrame(this.pointerMoveRafId);
                this.pointerMoveRafId = null;
            }
            this.deferredAutoAdvance = null;
            this.pointerMoving = false;
            clearTimeout(this.hideControlsTimeoutId);
            clearTimeout(this.hideInfoTimeoutId);

            // 非表示にしたポストを再表示
            this.showHiddenPosts();

            if (this.activeDisplayedMediaElement && this.activeDisplayedMediaElement.tagName === 'VIDEO') {
                this.activeDisplayedMediaElement.controls = false;
            }

            this.hideLoadingIndicator();
            this.restoreOriginalMediaPosition();

            if (this.activePost && this.activePost.mediaItems) {
                this.activePost.mediaItems.forEach(item => {
                    if (item.type === 'video' && item.originalElement && item.placeholder && item.placeholder.parentElement) {
                        item.originalElement.style.cssText = '';
                        if (item.originalElement.parentNode !== item.placeholder.parentElement) {
                            item.placeholder.parentElement.replaceChild(item.originalElement, item.placeholder);
                        }
                        if (!item.originalElement.paused) {
                            item.originalElement.pause();
                        }
                    }
                });
            }

            if (this.container) this.container.remove();
            this.container = null;
            document.body.style.scrollBehavior = 'auto';
            const trigger = document.getElementById('tiktok-trigger');
            if (trigger) trigger.style.display = 'inline-flex';
            this.activePost = { id: null, element: null, mediaItems: [], currentMediaIndex: 0 };
            this.activeDisplayedMediaElement = null;
            this.activePlaceholder = null;
            this.likeButton = null;
            this.followButton = null;
            this.exitButton = null;
            this.scrollUpButton = null;
            this.scrollDownButton = null;
            this.savedScrollPosition = 0;
            this.disconnectObserver();
            this.isReturningFromFollow = false;
        }

        createContainer() {
            if (this.container) this.container.remove();
            this.container = document.createElement('div');
            this.container.id = 'tiktok-feed-container';
            this.container.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.2); z-index: 2147483647;
                pointer-events: none; overflow: hidden;
            `;

            // Insert styles for Fancy Buttons
            if(!document.getElementById('xreels-fancy-buttons')) {
                const fancyButtonsStyle = document.createElement('style');
                fancyButtonsStyle.id = 'xreels-fancy-buttons';
                fancyButtonsStyle.textContent = `
                    @keyframes pulse-ring { 0% { transform: scale(0.95); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.7; } 100% { transform: scale(1.15); opacity: 0; } }
                    @keyframes pulse-rect { 0% { transform: scale(0.98); opacity: 1; } 50% { transform: scale(1.02); opacity: 0.7; } 100% { transform: scale(1.06); opacity: 0; } }
                    @keyframes heart-beat { 0%, 100% { transform: scale(1); } 25% { transform: scale(1.2); } 50% { transform: scale(1.1); } 75% { transform: scale(1.25); } }
                    @keyframes float-up { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-8px) scale(1.1); opacity: 0; } }
                    @keyframes float-down { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(8px) scale(1.1); opacity: 0; } }
                    @keyframes exit-shake { 0%, 100% { transform: translateX(0) rotate(0deg); } 25% { transform: translateX(-3px) rotate(-5deg); } 75% { transform: translateX(3px) rotate(5deg); } }
                    .fancy-exit-btn { position: relative; }
                    .fancy-exit-btn::before { content: ''; position: absolute; inset: 0; border-radius: 16px; background: radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%); opacity: 0; transition: opacity 0.4s ease; pointer-events: none; z-index: 1; }
                    .fancy-exit-btn:hover::before { opacity: 1; }
                    .fancy-exit-btn:hover { transform: translateY(-3px) scale(1.05); background: linear-gradient(135deg, rgba(239, 68, 68, 0.5) 0%, rgba(220, 38, 38, 0.5) 100%) !important; border-color: rgba(239, 68, 68, 0.9) !important; box-shadow: 0 12px 40px rgba(239, 68, 68, 0.5), 0 0 30px rgba(239, 68, 68, 0.3) inset !important; }
                    .fancy-exit-btn:hover svg { animation: exit-shake 0.5s ease; }
                    .fancy-exit-btn:hover .exit-pulse { animation: pulse-rect 1s cubic-bezier(0.4, 0, 0.6, 1) infinite !important; }
                    .fancy-exit-btn:active { transform: translateY(-1px) scale(1.02); transition: all 0.1s ease; }
                    .fancy-action-btn { position: relative; }
                    .fancy-action-btn::before { content: ''; position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%); opacity: 0; transition: opacity 0.4s ease; pointer-events: none; z-index: 1; }
                    .fancy-action-btn:hover::before { opacity: 1; }
                    .fancy-action-btn:hover { transform: translateY(-4px) scale(1.08); box-shadow: 0 12px 40px rgba(255, 255, 255, 0.2), 0 0 30px currentColor inset; }
                    .fancy-action-btn:hover .like-icon, .fancy-action-btn:hover .follow-icon, .fancy-action-btn:hover .arrow-icon { transform: scale(1.15); }
                    .fancy-action-btn:active { transform: translateY(-2px) scale(1.02); transition: all 0.1s ease; }
                    #tiktok-like-btn:hover .pulse-ring { animation: pulse-ring 1s cubic-bezier(0.4, 0, 0.6, 1) infinite !important; }
                    #tiktok-scroll-up-btn:hover .arrow-icon { animation: float-up 0.6s ease infinite; }
                    #tiktok-scroll-down-btn:hover .arrow-icon { animation: float-down 0.6s ease infinite; }
                    #tiktok-like-btn.liked .heart-path { fill: #ff1447; stroke: #ff1447; animation: heart-beat 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: center; }
                    #tiktok-like-btn.liked { background: linear-gradient(135deg, rgba(255, 20, 71, 0.5) 0%, rgba(220, 0, 50, 0.5) 100%); border-color: rgba(255, 20, 71, 0.8); box-shadow: 0 12px 40px rgba(255, 20, 71, 0.5), 0 0 30px rgba(255, 20, 71, 0.3) inset; }
                    #tiktok-follow-btn.following .follow-plus-v, #tiktok-follow-btn.following .follow-plus-h { opacity: 0; transform: scale(0); }
                    #tiktok-follow-btn.following { background: linear-gradient(135deg, rgba(29, 161, 242, 0.5) 0%, rgba(26, 140, 216, 0.5) 100%); border-color: rgba(29, 161, 242, 0.8); box-shadow: 0 12px 40px rgba(29, 161, 242, 0.5), 0 0 30px rgba(29, 161, 242, 0.3) inset; }
                    #tiktok-follow-btn.following::after { content: '✓'; position: absolute; top: 50%; right: -4px; transform: translate(0, -50%); font-size: 14px; color: white; font-weight: bold; z-index: 3; text-shadow: 0 2px 8px rgba(0,0,0,0.4); }
                `;
                document.head.appendChild(fancyButtonsStyle);
            }

            this.container.innerHTML = `
                <div class="media-wrapper" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; pointer-events: auto; overflow: hidden;"></div>
                <div class="ui-container" style="position: relative; z-index: 1000002; width: 100%; height: 100%; pointer-events: none;">

                    <div class="loading-indicator" style="display: none; position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 15px; z-index: 1000003; font-size: 12px; font-weight: 600; backdrop-filter: blur(10px); pointer-events: none;">Loading...</div>

                    <div style="position: absolute; top: 20px; left: 20px; display: flex; flex-direction: column; align-items: flex-start; gap: 5px; pointer-events: auto;">
                        <div class="info-controls-wrapper" style="color: rgba(255,255,255,0.9); background: rgba(0,0,0,0.6); padding: 6px 10px; border-radius: 15px; font-size: 12px; backdrop-filter: blur(10px); pointer-events: auto; transition: all 0.3s ease;">
                            <div class="info-header" style="color: white; cursor: pointer; text-align: left; display: flex; align-items: center; justify-content: flex-start; gap: 5px;">Keyboard Shortcuts <span style="display: inline-block; width: 12px; height: 12px; background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M7.41%208.59L12%2013.17L16.59%208.59L18%2010L12%2016L6%2010L7.41%208.59Z%22%20fill%3D%22%23FF6F61%22%2F%3E%0A%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: center; background-size: contain; transform: rotate(0deg); transition: transform 0.3s ease-out;"></span></div>
                            <div class="controls-expanded" style="max-height: 0; overflow: hidden; opacity: 0; transition: max-height 0.3s ease-out, opacity 0.3s ease-out; padding-top: 0; font-weight: 400;">
                                • X: <span style="color:#FF6F61;">Enter/Exit Feed</span> <br>
                                • Scroll: <span style="color:#FF6F61;">⬆️/⬇️</span> <br>
                                • Cycle Media: <span style="color:#FF6F61;">⬅️/➡️</span> <br>
                                • Space: <span style="color:#FF6F61;">Play/Pause</span> <br>
                                • &lt; / &gt; : <span style="color:#FF6F61;">Scrub</span> <br>
                                • L: <span style="color:#FF6F61;">Like</span> <br>
                                • F: <span style="color:#FF6F61;">Follow</span> <br>
                                • Q: <span style="color:#FF6F61;">Exit</span>
                            </div>
                        </div>
                    </div>

                    <div style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; pointer-events: auto;">
                        <button id="tiktok-exit-btn" class="fancy-exit-btn" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%); border: 1px solid rgba(239, 68, 68, 0.6); border-radius: 16px; padding: 10px 16px; color: white; font-size: 13px; font-weight: 700; cursor: pointer; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(239, 68, 68, 0.35), 0 0 20px rgba(239, 68, 68, 0.15) inset; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); pointer-events: auto; display: flex; align-items: center; gap: 8px; position: relative; overflow: hidden;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transition: all 0.3s ease;">
                                <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));"/>
                            </svg>
                            <span style="position: relative; z-index: 2;">Exit</span>
                            <div class="exit-pulse" style="position: absolute; inset: -2px; border-radius: 16px; border: 2px solid rgba(239, 68, 68, 0.6); opacity: 0; animation: pulse-rect 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
                        </button>

                        <button id="tiktok-blur-toggle" style="background: linear-gradient(135deg, rgba(120, 120, 120, 0.25) 0%, rgba(80, 80, 80, 0.25) 100%); border: 1px solid rgba(180, 180, 180, 0.5); border-radius: 12px; padding: 8px 12px; color: white; font-size: 12px; font-weight: 700; cursor: pointer; backdrop-filter: blur(14px) saturate(160%); box-shadow: 0 6px 22px rgba(0, 0, 0, 0.35); transition: all 0.3s ease; pointer-events: auto; display: flex; align-items: center; gap: 6px;">
                            <span class="blur-label">Blur: Off</span>
                        </button>

                        <div style="color: white; background: rgba(0,0,0,0.6); padding: 8px 12px; border-radius: 15px; font-size: 12px; font-weight: 600; backdrop-filter: blur(10px); display: flex; align-items: center; gap: 8px; pointer-events: auto; cursor: pointer;" id="xreels-autoscroll-container">
                            <span>Auto: <span id="xreels-autoscroll-display" style="color: #FF6F61;">Off</span></span>
                            <span style="color: #FF6F61;">▼</span>
                        </div>
                        <div id="xreels-autoscroll-menu" style="display: none; position: absolute; top: 90px; right: 20px; background: rgba(0,0,0,0.9); border-radius: 10px; padding: 8px; backdrop-filter: blur(10px); pointer-events: auto; z-index: 10000000;">
                            <div class="autoscroll-option" data-value="0" style="padding: 8px 16px; cursor: pointer; color: #FF6F61; border-radius: 5px; transition: background 0.2s;">Off</div>
                            <div class="autoscroll-option" data-value="-1" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">Auto (Smart)</div>
                            <div class="autoscroll-option" data-value="600" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">0.6s</div>
                            <div class="autoscroll-option" data-value="1000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">1s</div>
                            <div class="autoscroll-option" data-value="2000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">2s</div>
                            <div class="autoscroll-option" data-value="3000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">3s</div>
                            <div class="autoscroll-option" data-value="5000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">5s</div>
                            <div class="autoscroll-option" data-value="8000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">8s</div>
                            <div class="autoscroll-option" data-value="30000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">30s</div>
                            <div class="autoscroll-option" data-value="60000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">60s</div>
                        </div>
                    </div>

                    <div class="gallery-indicator" style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); color: white; background: rgba(0,0,0,0.8); padding: 6px 12px; border-radius: 15px; font-size: 14px; font-weight: 700; backdrop-filter: blur(10px); display: none; pointer-events: none; opacity: 1; transition: opacity 0.5s ease;"></div>

                    <div class="info" style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); width: calc(100% - 200px); max-width: 800px; text-align: center; color: white; background: linear-gradient(to top, rgba(200, 100, 200, 0.5) 0%, rgba(150, 80, 200, 0.3) 40%, transparent 100%); padding: 20px 30px 25px; border-radius: 20px; max-height: 200px; overflow-y: auto; backdrop-filter: blur(15px) saturate(120%); pointer-events: auto; box-shadow: 0 -4px 20px rgba(150, 80, 200, 0.2), inset 0 1px 0 rgba(255,255,255,0.05);"></div>

                    <div class="action-buttons" style="position: absolute; right: 20px; bottom: 100px; display: flex; flex-direction: column; gap: 14px; z-index: 1000002; pointer-events: auto;">
                        <button id="tiktok-like-btn" class="fancy-action-btn" style="background: linear-gradient(135deg, rgba(255, 20, 80, 0.25) 0%, rgba(255, 64, 129, 0.25) 100%); border: 1px solid rgba(255, 20, 80, 0.5); border-radius: 50%; width: 54px; height: 54px; cursor: pointer; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(255, 20, 80, 0.35), 0 0 20px rgba(255, 20, 80, 0.2) inset; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="like-icon" style="position: relative; z-index: 2; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); overflow: visible;">
                                <path class="heart-path" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="white" stroke-width="2" stroke-linejoin="round" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)); transition: all 0.4s ease;"/>
                            </svg>
                            <div class="pulse-ring" style="position: absolute; inset: -2px; border-radius: 50%; border: 2px solid rgba(255, 20, 80, 0.6); opacity: 0; animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
                        </button>

                        <button id="tiktok-follow-btn" class="fancy-action-btn" style="background: linear-gradient(135deg, rgba(29, 161, 242, 0.25) 0%, rgba(26, 140, 216, 0.25) 100%); border: 1px solid rgba(29, 161, 242, 0.5); border-radius: 50%; width: 54px; height: 54px; cursor: pointer; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(29, 161, 242, 0.35), 0 0 20px rgba(29, 161, 242, 0.2) inset; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="follow-icon" style="position: relative; z-index: 2; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
                                <circle cx="12" cy="8" r="4" stroke="white" stroke-width="2" fill="none" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));"/>
                                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="white" stroke-width="2" stroke-linecap="round" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));"/>
                                <line x1="19" y1="8" x2="19" y2="14" stroke="white" stroke-width="2" stroke-linecap="round" class="follow-plus-v" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)); transition: all 0.3s ease;"/>
                                <line x1="16" y1="11" x2="22" y2="11" stroke="white" stroke-width="2" stroke-linecap="round" class="follow-plus-h" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)); transition: all 0.3s ease;"/>
                            </svg>
                            <div class="pulse-ring" style="position: absolute; inset: -2px; border-radius: 50%; border: 2px solid rgba(29, 161, 242, 0.6); opacity: 0; animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s;"></div>
                        </button>

                        <button id="tiktok-scroll-up-btn" class="fancy-action-btn" style="background: linear-gradient(135deg, rgba(100, 150, 255, 0.25) 0%, rgba(70, 120, 255, 0.25) 100%); border: 1px solid rgba(100, 150, 255, 0.5); border-radius: 50%; width: 54px; height: 54px; cursor: pointer; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(100, 150, 255, 0.35), 0 0 20px rgba(100, 150, 255, 0.2) inset; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-icon" style="position: relative; z-index: 2; transition: all 0.3s ease;">
                                <path d="M12 19V5M5 12l7-7 7 7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));"/>
                            </svg>
                            <div class="pulse-ring" style="position: absolute; inset: -2px; border-radius: 50%; border: 2px solid rgba(100, 150, 255, 0.6); opacity: 0; animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s;"></div>
                        </button>

                        <button id="tiktok-scroll-down-btn" class="fancy-action-btn" style="background: linear-gradient(135deg, rgba(100, 150, 255, 0.25) 0%, rgba(70, 120, 255, 0.25) 100%); border: 1px solid rgba(100, 150, 255, 0.5); border-radius: 50%; width: 54px; height: 54px; cursor: pointer; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(100, 150, 255, 0.35), 0 0 20px rgba(100, 150, 255, 0.2) inset; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-icon" style="position: relative; z-index: 2; transition: all 0.3s ease;">
                                <path d="M12 5v14M5 12l7 7 7-7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));"/>
                            </svg>
                            <div class="pulse-ring" style="position: absolute; inset: -2px; border-radius: 50%; border: 2px solid rgba(100, 150, 255, 0.6); opacity: 0; animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 1.5s;"></div>
                        </button>

                        <button id="tiktok-replies-btn" class="fancy-action-btn" style="background: linear-gradient(135deg, rgba(150, 100, 255, 0.25) 0%, rgba(120, 70, 255, 0.25) 100%); border: 1px solid rgba(150, 100, 255, 0.5); border-radius: 50%; width: 54px; height: 54px; cursor: pointer; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(150, 100, 255, 0.35), 0 0 20px rgba(150, 100, 255, 0.2) inset; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="replies-icon" style="position: relative; z-index: 2; transition: all 0.3s ease;">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));"/>
                            </svg>
                            <div class="pulse-ring" style="position: absolute; inset: -2px; border-radius: 50%; border: 2px solid rgba(150, 100, 255, 0.6); opacity: 0; animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 2s;"></div>
                        </button>
                    </div>

                    <div id="prev-posts-panel" style="display: none; position: absolute; left: 20px; top: 20px; width: 350px; height: 400px; background: rgba(0,0,0,0.2); border-radius: 16px; padding: 0; backdrop-filter: blur(20px); z-index: 1000003; pointer-events: auto; border: 1px solid rgba(255, 127, 97, 0.5); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8); resize: both; min-width: 250px; max-width: 800px; min-height: 200px; max-height: 90vh; overflow: hidden;">
                        <div id="prev-posts-header" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: move; background: linear-gradient(135deg, rgba(255, 127, 97, 0.3) 0%, rgba(255, 97, 127, 0.3) 100%); border-radius: 16px 16px 0 0;">
                            <div style="color: #FF6F61; font-size: 10px; font-weight: 700; text-transform: uppercase; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">前のポスト</div>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <button id="prev-settings-btn" title="サイズ設定" style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 11px; padding: 4px 6px; border-radius: 8px; cursor: pointer;">⚙</button>
                                <button id="close-prev-btn" style="background: none; border: none; color: rgba(255,255,255,0.6); cursor: pointer; font-size: 14px; padding: 0 4px; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">×</button>
                            </div>
                        </div>
                        <div id="prev-settings-panel" style="display: none; position: absolute; top: 36px; right: 8px; background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 8px; z-index: 1000004; width: 200px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); backdrop-filter: blur(10px);">
                            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                                <label style="font-size: 10px; color: rgba(255,255,255,0.7); min-width: 38px;">Text</label>
                                <input type="range" id="prev-text-size-slider" min="8" max="18" step="1" style="flex: 1;" />
                                <span id="prev-text-size-value" style="font-size: 10px; color: rgba(255,255,255,0.6); min-width: 32px; text-align: right;"></span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <label style="font-size: 10px; color: rgba(255,255,255,0.7); min-width: 38px;">Image</label>
                                <input type="range" id="prev-image-size-slider" min="20" max="100" step="5" style="flex: 1;" />
                                <span id="prev-image-size-value" style="font-size: 10px; color: rgba(255,255,255,0.6); min-width: 32px; text-align: right;"></span>
                            </div>
                        </div>
                        <div id="prev-posts-content" style="color: white; font-size: 12px; line-height: 1.4; padding: 12px; overflow-y: auto; height: calc(100% - 32px);"></div>
                    </div>

                    <div id="next-posts-panel" style="display: none; position: absolute; left: 20px; bottom: 20px; width: 350px; height: 400px; background: rgba(0,0,0,0.2); border-radius: 16px; padding: 0; backdrop-filter: blur(20px); z-index: 1000003; pointer-events: auto; border: 1px solid rgba(100, 150, 255, 0.5); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8); resize: both; min-width: 250px; max-width: 800px; min-height: 200px; max-height: 90vh; overflow: hidden;">
                        <div id="next-posts-header" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: move; background: linear-gradient(135deg, rgba(100, 150, 255, 0.3) 0%, rgba(100, 200, 255, 0.3) 100%); border-radius: 16px 16px 0 0;">
                            <div style="color: #6496FF; font-size: 10px; font-weight: 700; text-transform: uppercase; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">次のポスト</div>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <button id="next-settings-btn" title="サイズ設定" style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 11px; padding: 4px 6px; border-radius: 8px; cursor: pointer;">⚙</button>
                            <button id="close-next-btn" style="background: none; border: none; color: rgba(255,255,255,0.6); cursor: pointer; font-size: 14px; padding: 0 4px; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">×</button>
                            </div>
                        </div>
                        <div id="next-settings-panel" style="display: none; position: absolute; top: 36px; right: 8px; background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 8px; z-index: 1000004; width: 200px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); backdrop-filter: blur(10px);">
                            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                                <label style="font-size: 10px; color: rgba(255,255,255,0.7); min-width: 38px;">Text</label>
                                <input type="range" id="next-text-size-slider" min="8" max="18" step="1" style="flex: 1;" />
                                <span id="next-text-size-value" style="font-size: 10px; color: rgba(255,255,255,0.6); min-width: 32px; text-align: right;"></span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <label style="font-size: 10px; color: rgba(255,255,255,0.7); min-width: 38px;">Image</label>
                                <input type="range" id="next-image-size-slider" min="20" max="100" step="5" style="flex: 1;" />
                                <span id="next-image-size-value" style="font-size: 10px; color: rgba(255,255,255,0.6); min-width: 32px; text-align: right;"></span>
                            </div>
                        </div>
                        <div id="next-posts-content" style="color: white; font-size: 12px; line-height: 1.4; padding: 12px; overflow-y: auto; height: calc(100% - 32px);"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(this.container);
            this.likeButton = this.container.querySelector('#tiktok-like-btn');
            this.followButton = this.container.querySelector('#tiktok-follow-btn');
            this.exitButton = this.container.querySelector('#tiktok-exit-btn');
            this.scrollUpButton = this.container.querySelector('#tiktok-scroll-up-btn');
            this.scrollDownButton = this.container.querySelector('#tiktok-scroll-down-btn');
            this.repliesButton = this.container.querySelector('#tiktok-replies-btn');
            this.prevPostsPanel = this.container.querySelector('#prev-posts-panel');
            this.nextPostsPanel = this.container.querySelector('#next-posts-panel');
            this.blurToggleButton = this.container.querySelector('#tiktok-blur-toggle');

            this.likeButton.addEventListener('click', () => this.toggleLike());
            this.followButton.addEventListener('click', () => this.toggleFollow());
            this.exitButton.addEventListener('click', () => this.exit());
            this.repliesButton.addEventListener('click', () => this.toggleReplies());
            this.container.querySelector('#close-prev-btn').addEventListener('click', () => this.hidePrevPosts());
            this.container.querySelector('#close-next-btn').addEventListener('click', () => this.hideNextPosts());

            if (this.blurToggleButton) {
                const label = this.blurToggleButton.querySelector('.blur-label');
                if (label) label.textContent = `Blur: ${this.blurEnabled ? 'On' : 'Off'}`;
                this.blurToggleButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleBlur();
                });
            }

            // ドラッグ移動機能
            this.setupDraggable(this.prevPostsPanel, this.container.querySelector('#prev-posts-header'), 'prev');
            this.setupDraggable(this.nextPostsPanel, this.container.querySelector('#next-posts-header'), 'next');

            // リサイズ監視
            this.setupResizeObserver(this.prevPostsPanel, 'prev');
            this.setupResizeObserver(this.nextPostsPanel, 'next');

            // 保存された位置とサイズを復元
            this.restorePanelState('prev');
            this.restorePanelState('next');

            // スライダーのイベントリスナー設定
            this.setupPanelSliders();

            const infoControlsWrapper = this.container.querySelector('.info-controls-wrapper');
            const controlsExpanded = this.container.querySelector('.controls-expanded');
            const infoHeader = this.container.querySelector('.info-header');
            const infoArrow = infoHeader.querySelector('span');

            let isHoveringInfo = false;
            let isInfoExpanded = false;

            infoControlsWrapper.addEventListener('mouseenter', () => {
                isHoveringInfo = true;
                clearTimeout(this.hideInfoTimeoutId);
                if (!isInfoExpanded) {
                    controlsExpanded.style.maxHeight = '200px';
                    controlsExpanded.style.opacity = '1';
                    controlsExpanded.style.paddingTop = '8px';
                    infoArrow.style.transform = 'rotate(180deg)';
                    isInfoExpanded = true;
                }
            });

            infoControlsWrapper.addEventListener('mouseleave', () => {
                isHoveringInfo = false;
                this.hideInfoTimeoutId = setTimeout(() => {
                    if (!isHoveringInfo) {
                        controlsExpanded.style.maxHeight = '0';
                        controlsExpanded.style.opacity = '0';
                        controlsExpanded.style.paddingTop = '0';
                        infoArrow.style.transform = 'rotate(0deg)';
                        isInfoExpanded = false;
                    }
                }, 500);
            });

            this.scrollUpButton.addEventListener('click', () => {
                const mediaNavigated = this.handleMediaNavigation('prev');
                if (!mediaNavigated) {
                    this.handlePostNavigation('prev');
                }
            });
            this.scrollDownButton.addEventListener('click', () => {
                const mediaNavigated = this.handleMediaNavigation('next');
                if (!mediaNavigated) {
                    this.handlePostNavigation('next');
                }
            });

            this.setupAutoScrollControls();
            this.setupPointerHoldForAutoScroll();
        }

        setupAutoScrollControls() {
            const container = document.getElementById('xreels-autoscroll-container');
            const menu = document.getElementById('xreels-autoscroll-menu');
            const display = document.getElementById('xreels-autoscroll-display');

            const timeLabels = { 0: 'Off', '-1': 'Auto (Smart)', 1000: '1s', 2000: '2s', 3000: '3s', 5000: '5s', 8000: '8s', 30000: '30s', 60000: '60s' };
            display.textContent = timeLabels[this.autoScrollDelay] || 'Off';

            container.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            });

            // Handle options styling via JS to match functionality without external CSS file
            document.querySelectorAll('.autoscroll-option').forEach(option => {
                option.addEventListener('mouseenter', () => {
                    option.style.background = 'rgba(255,255,255,0.1)';
                });
                option.addEventListener('mouseleave', () => {
                    option.style.background = 'transparent';
                });
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const value = parseInt(option.dataset.value, 10);
                    this.autoScrollDelay = value;
                    localStorage.setItem('xreels_autoScrollDelay', value.toString());
                    display.textContent = timeLabels[value];
                    menu.style.display = 'none';

                    if (this.isActive && (value > 0 || value === -1)) {
                        this.startAutoScrollTimer();
                    } else if (value === 0) {
                        this.stopAutoScrollTimer();
                    }
                });
            });

            document.addEventListener('click', () => {
                if (menu) menu.style.display = 'none';
            });
        }

        setupPointerHoldForAutoScroll() {
            if (!this.container) return;
            const area = this.container;
            const handleMove = () => {
                if (this.pointerMoveRafId) return;
                this.pointerMoveRafId = requestAnimationFrame(() => {
                    this.pointerMoveRafId = null;
                    this.pointerMoving = true;
                    if (this.pointerIdleTimeoutId) clearTimeout(this.pointerIdleTimeoutId);
                    this.pointerIdleTimeoutId = setTimeout(() => {
                        this.pointerMoving = false;
                        if (!this.isActive) {
                            this.deferredAutoAdvance = null;
                            return;
                        }
                        if (this.deferredAutoAdvance) {
                            const action = this.deferredAutoAdvance;
                            this.deferredAutoAdvance = null;
                            action();
                        }
                    }, 600);
                });
            };
            area.addEventListener('pointermove', handleMove, { passive: true });
        }

        maybeDeferAutoAdvance(action) {
            if (!this.isActive) return;
            if (this.pointerMoving) {
                this.deferredAutoAdvance = action;
                return;
            }
            action();
        }

        startAutoScrollTimer() {
            this.stopAutoScrollTimer();
            if (!this.isActive) return;
            if (this.autoScrollDelay === 0) return;

            // SMART MODE (-1)
            if (this.autoScrollDelay === -1) {
                if (this.activeDisplayedMediaElement && this.activeDisplayedMediaElement.tagName === 'VIDEO') {
                    // Video: Wait for end
                    const video = this.activeDisplayedMediaElement;
                    this.videoEndedListener = () => {
                        if (!this.isActive) return;
                        this.maybeDeferAutoAdvance(() => {
                            const mediaNavigated = this.handleMediaNavigation('next');
                            if (!mediaNavigated) {
                                this.handlePostNavigation('next');
                            }
                        });
                    };
                    video.addEventListener('ended', this.videoEndedListener);
                } else {
                    // Image: Wait 3 seconds
                    this.autoScrollTimeoutId = setTimeout(() => {
                        this.maybeDeferAutoAdvance(() => {
                            this.autoScrollTimeoutId = null;
                            const mediaNavigated = this.handleMediaNavigation('next');
                            if (!mediaNavigated) {
                                this.handlePostNavigation('next');
                            }
                        });
                    }, 3000);
                }
            }
            // STANDARD TIMER MODE (> 0)
            else if (this.autoScrollDelay > 0) {
                this.autoScrollTimeoutId = setTimeout(() => {
                    this.maybeDeferAutoAdvance(() => {
                        this.autoScrollTimeoutId = null;
                        const mediaNavigated = this.handleMediaNavigation('next');
                        if (!mediaNavigated) {
                            this.handlePostNavigation('next');
                        }
                    });
                }, this.autoScrollDelay);
            }

            // Watchdog: Check if auto-scroll needs to be restarted
            this.setupAutoScrollWatchdog();
        }

        setupAutoScrollWatchdog() {
            if (this.autoScrollWatchdogId) {
                clearInterval(this.autoScrollWatchdogId);
                this.autoScrollWatchdogId = null;
            }

            // ウォッチドッグは正の遅延でのみ稼働（Smartはイベントに任せる）
            if (!this.isActive || this.autoScrollDelay <= 0) return;

            this.autoScrollWatchdogId = setInterval(() => {
                if (!this.isActive || this.autoScrollDelay <= 0) {
                    clearInterval(this.autoScrollWatchdogId);
                    this.autoScrollWatchdogId = null;
                    return;
                }

                // タイマーが失敗しているかチェック
                if (!this.autoScrollTimeoutId) {
                    console.log('Auto-scroll timer stopped, restarting...');
                    this.startAutoScrollTimer();
                }
            }, 5000); // 5秒ごとにチェック
        }

        stopAutoScrollTimer() {
            if (this.autoScrollTimeoutId) {
                clearTimeout(this.autoScrollTimeoutId);
                this.autoScrollTimeoutId = null;
            }
            if (this.autoScrollWatchdogId) {
                clearInterval(this.autoScrollWatchdogId);
                this.autoScrollWatchdogId = null;
            }
            // Cleanup Video Ended Listener
            if (this.videoEndedListener && this.activeDisplayedMediaElement) {
                this.activeDisplayedMediaElement.removeEventListener('ended', this.videoEndedListener);
                this.videoEndedListener = null;
            }
        }

        async toggleLike() {
            if (!this.activePost.element) return;

            this.likeButton.style.transform = 'scale(1.3)';
            this.likeButton.style.filter = 'brightness(1.5)';
            this.likeButton.style.transition = 'transform 0.1s ease-out, filter 0.1s ease-out';

            const likeButton = this.activePost.element.querySelector('[data-testid="like"], [data-testid="unlike"]');
            if (likeButton) {
                likeButton.click();
                await new Promise(resolve => setTimeout(resolve, 250));
                this.updateLikeButtonState();
            }

            setTimeout(() => {
                this.likeButton.style.transform = 'scale(1)';
                this.likeButton.style.filter = 'brightness(1)';
                this.likeButton.style.transition = 'all 0.3s ease';
            }, 200);
        }

        async toggleFollow() {
            if (!this.activePost.element) return;

            const currentMedia = this.activePost.mediaItems[this.activePost.currentMediaIndex];
            if (!currentMedia) return;

            const contextElement = currentMedia.contextElement || this.activePost.element;
            const originalTweetId = this.activePost.id;

            this.savedScrollPosition = window.scrollY;
            this.isReturningFromFollow = true;
            console.log(`Saved scroll position: ${this.savedScrollPosition} for tweet ${originalTweetId}`);

            let userLinkToClick = contextElement.querySelector('[data-testid="User-Name"] a');
            let clickedQuoteCard = false;
            const isMainContext = contextElement === this.activePost.element;

            if (!userLinkToClick && !isMainContext) {
                 console.log("No user link found in context (likely Quote Tweet). Clicking context to navigate to tweet.");
                 userLinkToClick = contextElement.closest('[role="link"]') || contextElement;
                 clickedQuoteCard = true;
            }

            if (!userLinkToClick) {
                 if (isMainContext) {
                     console.warn("Could not find user link in main context.");
                     userLinkToClick = this.activePost.element.querySelector('[data-testid="User-Name"] a');
                 } else {
                     console.warn("Could not find actionable link in Quote Context.");
                 }
            }

            if (!userLinkToClick) {
                console.warn("Could not find user link for follow action.");
                this.isReturningFromFollow = false;
                return;
            }

            console.log(`Navigating... (QuoteCard: ${clickedQuoteCard})`);
            userLinkToClick.click();
            await new Promise(resolve => setTimeout(resolve, 1500));

            let extraDepth = 0;
            if (clickedQuoteCard) {
                 let tweetUserLink = null;
                 let loadAttempts = 0;
                 while (!tweetUserLink && loadAttempts < 20) {
                     tweetUserLink = document.querySelector('article[data-testid="tweet"] [data-testid="User-Name"] a');
                     if (!tweetUserLink) await new Promise(r => setTimeout(r, 200));
                     loadAttempts++;
                 }

                 if (tweetUserLink) {
                     console.log("On Tweet page, clicking profile link...");
                     tweetUserLink.click();
                     await new Promise(resolve => setTimeout(resolve, 1500));
                     extraDepth = 1;
                 } else {
                     console.warn("Could not find profile link on Tweet page.");
                 }
            }

            let followBtn = null;
            let attempts = 0;
            const maxAttempts = 15;
            while (!followBtn && attempts < maxAttempts) {
                followBtn = document.querySelector('[data-testid*="follow"], [aria-label*="Follow"], [aria-label*="Unfollow"]');
                if (!followBtn) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
                attempts++;
            }

            if (followBtn) {
                followBtn.click();
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                console.warn("Follow/Unfollow button not found on profile page.");
            }

            if (clickedQuoteCard && extraDepth > 0) {
                window.history.go(-2);
            } else {
                window.history.back();
            }

            await new Promise(resolve => setTimeout(resolve, 1500));

            this.showLoadingIndicator('Restoring feed position...');
            let targetPostElement = null;
            attempts = 0;
            const checkInterval = 200;
            const maxChecks = 25;

            while (!targetPostElement && attempts < maxChecks) {
                targetPostElement = document.querySelector(`article[role="article"] a[href*="/status/${originalTweetId}"]`)?.closest('article[role="article"]');
                if (!targetPostElement) {
                    await new Promise(resolve => setTimeout(resolve, checkInterval));
                }
                attempts++;
            }

            if (targetPostElement) {
                console.log(`Found original tweet element (ID: ${originalTweetId}), re-navigating...`);
                this.navigateToPost(targetPostElement);
            } else {
                console.warn(`Original tweet element (ID: ${originalTweetId}) not found after returning. Falling back to central post.`);
                this.navigateToPost(this.findCentralMediaArticle());
            }

            window.scrollTo(0, this.savedScrollPosition);
            this.hideLoadingIndicator();
            this.isReturningFromFollow = false;
        }

        updateLikeButtonState() {
            if (!this.likeButton || !this.activePost.element) return;
            const likedButton = this.activePost.element.querySelector('[data-testid="unlike"]');
            if (likedButton) {
                this.likeButton.classList.add('liked');
                const heartPath = this.likeButton.querySelector('.heart-path');
                if (heartPath) {
                    heartPath.setAttribute('fill', '#ff1447');
                    heartPath.setAttribute('stroke', '#ff1447');
                }
            } else {
                this.likeButton.classList.remove('liked');
                const heartPath = this.likeButton.querySelector('.heart-path');
                if (heartPath) {
                    heartPath.setAttribute('fill', 'none');
                    heartPath.setAttribute('stroke', 'white');
                }
            }
        }

        updateFollowButtonState() {
            if (!this.followButton || !this.activePost.element) return;

            const currentMedia = this.activePost.mediaItems[this.activePost.currentMediaIndex];
            if (!currentMedia) return;
            const contextElement = currentMedia.contextElement || this.activePost.element;

            let isFollowingTargetAuthor = false;

            const mainAuthorUnfollowBtn = contextElement.querySelector('[data-testid$="-unfollow"]');
            if (mainAuthorUnfollowBtn) {
                isFollowingTargetAuthor = true;
            } else {
                const mainAuthorFollowingText = Array.from(contextElement.querySelectorAll('[data-testid="User-Name"] ~ div button')).some(btn => {
                    const text = btn.textContent.trim();
                    return text === 'Following' || text === 'Unfollow';
                });
                if (mainAuthorFollowingText) {
                    isFollowingTargetAuthor = true;
                }
            }

            if (isFollowingTargetAuthor) {
                this.followButton.classList.add('following');
            } else {
                this.followButton.classList.remove('following');
            }
        }

        getIconFromArticle(article) {
            const iconEl = article ? article.querySelector('[data-testid="User-Name"] img[src*="profile_images"]') : null;
            return iconEl ? iconEl.src : '';
        }

        getTimestampText(currentMedia) {
            if (currentMedia && currentMedia.timestampText) return currentMedia.timestampText;
            const timeEl = this.activePost && this.activePost.element ? this.activePost.element.querySelector('time') : null;
            if (timeEl) {
                const iso = timeEl.getAttribute('datetime');
                if (iso) {
                    const parsed = new Date(iso);
                    if (!isNaN(parsed.getTime())) {
                        return parsed.toLocaleString();
                    }
                }
                return timeEl.textContent ? timeEl.textContent.trim() : '';
            }
            return '';
        }

        applyMainTextStyles() {
            if (!this.container) return;
            const textSize = Math.max(8, this.panelSettings ? this.panelSettings.textSize : 11);
            const authorSize = textSize + 5;
            const bodySize = textSize + 3;
            const metaSize = Math.max(9, textSize - 1);

            const infoEl = this.container.querySelector('.info');
            if (!infoEl) return;

            const authorEl = infoEl.querySelector('.author-name');
            const metaEl = infoEl.querySelector('.main-post-meta');
            const bodyEl = infoEl.querySelector('.main-post-text');

            if (authorEl) authorEl.style.fontSize = `${authorSize}px`;
            if (metaEl) metaEl.style.fontSize = `${metaSize}px`;
            if (bodyEl) bodyEl.style.fontSize = `${bodySize}px`;
        }

        updateUI() {
            if (!this.container || !this.activePost || !this.activePost.element) return;

            const currentMedia = this.activePost.mediaItems[this.activePost.currentMediaIndex];
            if (!currentMedia) return;

            const authorName = currentMedia.author || 'Unknown User';
            const authorHandle = currentMedia.handle;
            const tweetText = currentMedia.text || '';

            const iconUrl = currentMedia.icon || this.getIconFromArticle(this.activePost.element);
            const timestampText = this.getTimestampText(currentMedia);
            const metaParts = [];
            if (authorHandle) metaParts.push(`@${authorHandle}`);
            if (timestampText) metaParts.push(timestampText);
            const metaLine = metaParts.join(' · ');

            const infoEl = this.container.querySelector('.info');
            const iconHtml = iconUrl ? `<img class="main-post-icon" src="${iconUrl}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.35);" />` : '';
            const metaStyle = metaLine ? '' : 'display: none;';

            infoEl.innerHTML = `
                <div class="main-post-header" style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 8px;">
                    ${iconHtml}
                    <div style="display: flex; flex-direction: column; align-items: flex-start; text-align: left; gap: 2px;">
                        <div class="author-name" style="font-weight: 700; margin-bottom: 0; ${authorHandle ? 'cursor: pointer;' : ''}">${authorName}</div>
                        <div class="main-post-meta" style="color: rgba(255,255,255,0.8); font-weight: 600; ${metaStyle}">${metaLine}</div>
                    </div>
                </div>
                <div class="main-post-text" style="line-height: 1.5; opacity: 0.95;">${tweetText}</div>
            `;

            const authorElement = this.container.querySelector('.author-name');
            if (authorElement && authorHandle) {
                authorElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.open(`https://x.com/${authorHandle}`, '_blank');
                });
            }

            const galleryIndicator = this.container.querySelector('.gallery-indicator');
            if (this.activePost.mediaItems.length > 1) {
                galleryIndicator.textContent = `${this.activePost.currentMediaIndex + 1} / ${this.activePost.mediaItems.length}`;
                galleryIndicator.style.display = 'block';
                galleryIndicator.style.opacity = '1';

                if (this.galleryIndicatorTimeout) {
                    clearTimeout(this.galleryIndicatorTimeout);
                }

                this.galleryIndicatorTimeout = setTimeout(() => {
                    galleryIndicator.style.opacity = '0';
                }, 1500);
            } else {
                galleryIndicator.style.display = 'none';
            }
            this.updateLikeButtonState();
            this.updateFollowButtonState();
            this.applyMainTextStyles();
        }

        showLoadingIndicator(message = 'Loading...') {
            if (this.container) {
                const indicator = this.container.querySelector('.loading-indicator');
                if(indicator) { indicator.textContent = message; indicator.style.display = 'block'; }
            }
        }

        hideLoadingIndicator() {
            if (this.container) {
                const indicator = this.container.querySelector('.loading-indicator');
                if(indicator) indicator.style.display = 'none';
            }
        }

        toggleBlur() {
            this.blurEnabled = !this.blurEnabled;
            localStorage.setItem('xreels_blur', this.blurEnabled ? 'true' : 'false');
            const label = this.blurToggleButton ? this.blurToggleButton.querySelector('.blur-label') : null;
            if (label) label.textContent = `Blur: ${this.blurEnabled ? 'On' : 'Off'}`;
            this.applyBlurStyles();
        }

        applyBlurStyles() {
            if (!this.container) return;
            const blurFilter = this.blurEnabled ? 'blur(16px)' : 'none';
            const blurOpacity = this.blurEnabled ? '0.85' : '';

            // メイン表示（動画/画像）
            const mediaWrapper = this.container.querySelector('.media-wrapper');
            if (mediaWrapper) {
                mediaWrapper.querySelectorAll('video, img').forEach(el => {
                    el.style.filter = blurFilter;
                    el.style.opacity = blurOpacity;
                });
            }

            // パネル内の画像
            const prevContent = this.container.querySelector('#prev-posts-content');
            const nextContent = this.container.querySelector('#next-posts-content');
            [prevContent, nextContent].forEach(content => {
                if (!content) return;
                content.querySelectorAll('img.post-image').forEach(img => {
                    img.style.filter = blurFilter;
                    img.style.opacity = blurOpacity;
                });
            });
        }

        navigateToPost(targetArticleElement) {
            if (!targetArticleElement || this.isNavigating) return;
            this.isNavigating = true;
            this.stopAutoScrollTimer();
            this.restoreOriginalMediaPosition();
            this.showLoadingIndicator('Loading...');

            // ポスト移動のたびにフィルタリング非表示を実行
            this.hideNonFilteredPosts();

            if (!this.hasTargetContentWarning(targetArticleElement)) {
                this.isNavigating = false;
                this.hideLoadingIndicator();
                const fallback = this.findNextMediaArticle(targetArticleElement, false) || this.findNextMediaArticle(targetArticleElement, true);
                if (fallback) {
                    this.navigateToPost(fallback);
                }
                return;
            }

            const postTweetId = this.generateTweetId(targetArticleElement);
            const foundMediaItems = [];
            const addedElements = new Set();

            const extractMetadata = (contextEl, isMain) => {
                let author = 'Unknown User';
                let handle = '';
                let text = '';
                let icon = '';
                let timestampText = '';

                const authorEl = contextEl.querySelector('[data-testid="User-Name"] [dir="ltr"]');
                if (authorEl) {
                    author = authorEl.textContent;
                } else if (isMain) {
                    const mainAuthor = targetArticleElement.querySelector('[data-testid="User-Name"] [dir="ltr"]');
                    if (mainAuthor) author = mainAuthor.textContent;
                }

                const linkEl = contextEl.querySelector('[data-testid="User-Name"] a');
                if (linkEl) {
                    handle = linkEl.getAttribute('href');
                } else if (isMain) {
                    const mainLink = targetArticleElement.querySelector('[data-testid="User-Name"] a');
                    if (mainLink) handle = mainLink.getAttribute('href');
                } else if (!isMain && contextEl.getAttribute('role') === 'link') {
                     const quoteHref = contextEl.getAttribute('href');
                     if (quoteHref) {
                         const match = quoteHref.match(/^\/([^/]+)\/status\//);
                         if (match && match[1]) {
                             handle = '/' + match[1];
                         }
                     }
                }

                if (!handle) {
                     const userInfo = contextEl.querySelector('[data-testid="User-Name"]');
                     if (userInfo) {
                         const content = userInfo.textContent;
                         const match = content.match(/@([a-zA-Z0-9_]+)/);
                         if (match) {
                             handle = '/' + match[1];
                         }
                     }
                }

                if (handle && handle.startsWith('/')) handle = handle.substring(1);

                const textEl = contextEl.querySelector('[data-testid="tweetText"]');
                if (textEl) {
                    if (isMain) {
                        const quoteWrapper = textEl.closest('div[role="link"]');
                        if (quoteWrapper && quoteWrapper !== contextEl && targetArticleElement.contains(quoteWrapper)) {
                        }
                    }
                    text = textEl.textContent;
                }

                const iconEl = contextEl.querySelector('[data-testid="User-Name"] img[src*="profile_images"]') || targetArticleElement.querySelector('[data-testid="User-Name"] img[src*="profile_images"]');
                if (iconEl) icon = iconEl.src;

                const timeEl = contextEl.querySelector('time') || targetArticleElement.querySelector('time');
                if (timeEl) {
                    const iso = timeEl.getAttribute('datetime');
                    if (iso) {
                        const parsed = new Date(iso);
                        if (!isNaN(parsed.getTime())) {
                            timestampText = parsed.toLocaleString();
                        }
                    }
                    if (!timestampText) {
                        timestampText = timeEl.textContent ? timeEl.textContent.trim() : '';
                    }
                }

                return { author, handle, text, icon, timestampText };
            };

            const resolveContext = (mediaEl) => {
                let current = mediaEl.parentElement;
                while (current && current !== targetArticleElement) {
                    if (current.getAttribute('role') === 'link' && current.querySelector('[data-testid="User-Name"]')) {
                        return current;
                    }
                    current = current.parentElement;
                }
                return targetArticleElement;
            };

            targetArticleElement.querySelectorAll('div[data-testid="videoPlayer"] video, div[data-testid="tweetPhoto"] img').forEach(mediaEl => {
                if (addedElements.has(mediaEl)) return;

                const contextElement = resolveContext(mediaEl);
                const isMain = contextElement === targetArticleElement;
                const { author, handle, text, icon, timestampText } = extractMetadata(contextElement, isMain);

                if (mediaEl.tagName === 'VIDEO' && this.isValidMedia(mediaEl)) {
                    foundMediaItems.push({
                        type: 'video',
                        originalElement: mediaEl,
                        src: mediaEl.src,
                        placeholder: null,
                        contextElement: contextElement,
                        author: author,
                        handle: handle,
                        text: text,
                        icon: icon,
                        timestampText: timestampText
                    });
                    addedElements.add(mediaEl);
                } else if (mediaEl.tagName === 'IMG' && !mediaEl.src.includes('video_thumb') && this.isValidMedia(mediaEl)) {
                    foundMediaItems.push({
                        type: 'image',
                        originalElement: mediaEl,
                        src: this.getFullQualityImageUrl(mediaEl),
                        thumbSrc: mediaEl.src,
                        placeholder: null,
                        contextElement: contextElement,
                        author: author,
                        handle: handle,
                        text: text,
                        icon: icon,
                        timestampText: timestampText
                    });
                    addedElements.add(mediaEl);
                }
            });

            if (foundMediaItems.length === 0) {
                console.warn('No valid media found in the target article, skipping to next.');
                this.isNavigating = false;
                this.hideLoadingIndicator();
                this.handlePostNavigation('next');
                return;
            }

            this.activePost = { id: postTweetId, element: targetArticleElement, mediaItems: foundMediaItems, currentMediaIndex: 0 };
            document.body.style.scrollBehavior = 'auto';
            this.attemptScrollToPost(targetArticleElement);

            this.displayCurrentMediaItem();
            this.hideLoadingIndicator();
            this.isNavigating = false;
        }

        async attemptScrollToPost(element, attempts = 0, maxAttempts = 10, interval = 100) {
            if (!element || attempts >= maxAttempts) {
                console.warn('Failed to scroll post into view after multiple attempts.');
                return;
            }
            element.scrollIntoView({ behavior: 'auto', block: 'center' });
            await new Promise(resolve => setTimeout(resolve, interval));
            if (!this.isElementInViewport(element)) {
                this.attemptScrollToPost(element, attempts + 1, maxAttempts, interval);
            }
        }

        isElementInViewport(el) {
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            const margin = 50;
            return (
                rect.top >= -margin &&
                rect.left >= -margin &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + margin &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth) + margin
            );
        }

        displayCurrentMediaItem() {
            if (!this.activePost || !this.activePost.mediaItems || this.activePost.mediaItems.length === 0) return;
            this.restoreOriginalMediaPosition();

            const mediaItemToDisplay = this.activePost.mediaItems[this.activePost.currentMediaIndex];
            if (!mediaItemToDisplay) return;

            this.updateUI();

            const mediaWrapper = this.container.querySelector('.media-wrapper');
            mediaWrapper.innerHTML = '';

            if (mediaItemToDisplay.type === 'video') {
                this.displayVideo(mediaItemToDisplay);
            } else {
                this.displayImage(mediaItemToDisplay);
            }

            // パネルが開いていたら自動更新
            if (this.prevPostsPanel && this.prevPostsPanel.style.display !== 'none') {
                this.showPrevPosts();
            }
            if (this.nextPostsPanel && this.nextPostsPanel.style.display !== 'none') {
                this.showNextPosts();
            }

            // ぼかし反映
            this.applyBlurStyles();

            this.startAutoScrollTimer();
        }

        displayVideo(mediaItem) {
            const mediaWrapper = this.container.querySelector('.media-wrapper');
            const videoElement = mediaItem.originalElement;

            // 可能なら最高画質ソースを選択
            this.selectHighestQualityVideo(videoElement);

            if (!mediaItem.placeholder) {
                const placeholder = document.createElement('div');
                const rect = videoElement.getBoundingClientRect();
                placeholder.style.width = `${rect.width}px`;
                placeholder.style.height = `${rect.height}px`;
                mediaItem.placeholder = placeholder;

                if (videoElement.parentElement) {
                    videoElement.parentElement.replaceChild(placeholder, videoElement);
                }
            }

            this.activeDisplayedMediaElement = videoElement;

            const videoContainer = document.createElement('div');
            videoContainer.className = 'custom-video-container';
            videoContainer.style.cssText = `
                position: relative;
                width: 100%;
                height: 100%;
                background: black;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            `;

            videoElement.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 0;
                display: block;
                background: black;
            `;

            videoElement.loop = true; // GIFや動画をループ再生
            videoElement.muted = false; // 音声を有効に
            videoElement.controls = false;
            videoElement.volume = 0.05; // 5%に固定
            videoElement.playbackRate = this.savedPlaybackRate;

            // 現在のぼかし設定を反映
            if (this.blurEnabled) {
                videoElement.style.filter = 'blur(16px)';
                videoElement.style.opacity = '0.85';
            } else {
                videoElement.style.filter = 'none';
                videoElement.style.opacity = '';
            }

            const controlsOverlay = document.createElement('div');
            controlsOverlay.className = 'video-controls-overlay';
            controlsOverlay.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
                padding: 12px 30px 12px 12px;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: all;
                z-index: 1000010;
            `;

            const progressContainer = document.createElement('div');
            progressContainer.style.cssText = `
                width: 100%;
                height: 14px;
                background: transparent;
                border-radius: 10px;
                margin-bottom: 10px;
                cursor: pointer;
                pointer-events: all;
                position: relative;
                display: flex;
                align-items: center;
                padding: 5px 0;
            `;

            const progressBackground = document.createElement('div');
            progressBackground.style.cssText = `
                width: 100%;
                height: 4px;
                background: rgba(255,255,255,0.3);
                border-radius: 2px;
                position: relative;
            `;

            const progressBar = document.createElement('div');
            progressBar.className = 'progress-fill';
            progressBar.style.cssText = `
                height: 100%;
                background: linear-gradient(90deg, #FF6F61, #E63946);
                border-radius: 3px;
                width: 0%;
                transition: width 0.1s ease;
                position: relative;
            `;

            const progressThumb = document.createElement('div');
            progressThumb.style.cssText = `
                position: absolute;
                right: -5px;
                top: 50%;
                transform: translateY(-50%);
                width: 10px;
                height: 10px;
                background: #FF6F61;
                border-radius: 50%;
                opacity: 0;
                transition: opacity 0.3s ease;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            `;

            progressBar.appendChild(progressThumb);
            progressBackground.appendChild(progressBar);
            progressContainer.appendChild(progressBackground);

            const controlsContainer = document.createElement('div');
            controlsContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 15px;
                pointer-events: all;
            `;

            const playButton = document.createElement('button');
            playButton.innerHTML = `
                <svg class="play-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5v14l11-7z" fill="currentColor"/>
                </svg>
                <svg class="pause-icon" style="display: none;" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor"/>
                </svg>
            `;
            playButton.style.cssText = `
                background: rgba(255,255,255,0.15);
                border: 1px solid rgba(255,255,255,0.2);
                color: white;
                font-size: 16px;
                cursor: pointer;
                padding: 0;
                border-radius: 50%;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                position: relative;
                overflow: hidden;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                flex-shrink: 0;
            `;

            const playButtonStyle = document.createElement('style');
            playButtonStyle.textContent = `
                .custom-video-container button:hover { background: rgba(255,255,255,0.25) !important; border-color: rgba(255,255,255,0.4) !important; transform: scale(1.1); box-shadow: 0 6px 20px rgba(0,0,0,0.4) !important; }
                .custom-video-container button:active { transform: scale(0.95); }
                .custom-video-container button::before { content: ''; position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s ease; pointer-events: none; }
                .custom-video-container button:hover::before { opacity: 1; }
                .play-icon, .pause-icon { transition: all 0.3s ease; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
                .video-controls-overlay:hover .progress-fill div { opacity: 1; }
                .custom-video-container:hover .video-controls-overlay { opacity: 1; }
            `;
            document.head.appendChild(playButtonStyle);

            const timeDisplay = document.createElement('div');
            timeDisplay.style.cssText = `
                color: white;
                font-size: 11px;
                font-weight: 600;
                min-width: 70px;
                text-shadow: 0 1px 2px rgba(0,0,0,0.8);
            `;
            timeDisplay.textContent = '0:00 / 0:00';

            const speedButton = document.createElement('button');
            speedButton.innerHTML = '1.0x';
            speedButton.style.cssText = `
                background: rgba(255,255,255,0.15);
                border: 1px solid rgba(255,255,255,0.2);
                color: white;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 12px;
                transition: all 0.3s ease;
                min-width: 42px;
                text-align: center;
                flex-shrink: 0;
                backdrop-filter: blur(10px);
            `;
            speedButton.title = 'Playback Speed';

            const volumeContainer = document.createElement('div');
            volumeContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                margin-left: auto;
                margin-right: 25px;
                flex-shrink: 0;
            `;

            const muteButton = document.createElement('button');
            muteButton.innerHTML = '🔇';
            muteButton.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 14px;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background 0.3s ease;
                flex-shrink: 0;
            `;

            const volumeSlider = document.createElement('input');
            volumeSlider.type = 'range';
            volumeSlider.min = '0';
            volumeSlider.max = '100';
            volumeSlider.step = '1';
            volumeSlider.value = (this.savedVolume * 100).toString();
            volumeSlider.style.cssText = `
                width: 70px;
                height: 4px;
                background: rgba(255,255,255,0.3);
                border-radius: 2px;
                outline: none;
                cursor: pointer;
                -webkit-appearance: none;
                appearance: none;
                opacity: 0.5;
                flex-shrink: 0;
            `;

            const volumeSliderStyle = document.createElement('style');
            volumeSliderStyle.textContent = `
                .custom-video-container input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #FF6F61; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
                .custom-video-container input[type="range"]::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%; background: #FF6F61; cursor: pointer; border: none; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
            `;
            document.head.appendChild(volumeSliderStyle);

            volumeContainer.appendChild(muteButton);
            volumeContainer.appendChild(volumeSlider);

            controlsContainer.appendChild(playButton);
            controlsContainer.appendChild(timeDisplay);
            controlsContainer.appendChild(speedButton);
            controlsContainer.appendChild(volumeContainer);

            controlsOverlay.appendChild(progressContainer);
            controlsOverlay.appendChild(controlsContainer);

            videoContainer.appendChild(videoElement);
            videoContainer.appendChild(controlsOverlay);

            mediaWrapper.appendChild(videoContainer);

            let isDragging = false;

            const updatePlayPauseIcon = () => {
                const playIcon = playButton.querySelector('.play-icon');
                const pauseIcon = playButton.querySelector('.pause-icon');
                if (playIcon && pauseIcon) {
                    if (videoElement.paused) {
                        playIcon.style.display = 'block';
                        pauseIcon.style.display = 'none';
                    } else {
                        playIcon.style.display = 'none';
                        pauseIcon.style.display = 'block';
                    }
                }
            };

            const updateControlsUI = () => {
                muteButton.innerHTML = videoElement.muted ? '🔇' : '🔊';
                volumeSlider.style.opacity = videoElement.muted ? '0.5' : '1';
                volumeSlider.value = (videoElement.volume * 100).toString();
                updatePlayPauseIcon();
            };

            const togglePlayPause = () => {
                if (videoElement.paused) {
                    videoElement.play().catch(err => {
                        console.warn('Play failed:', err);
                        this.attemptVideoPlay(videoElement);
                    });
                } else {
                    // ユーザーが明示的に一時停止したことを記録
                    videoElement.pause();
                    videoElement.dataset.userPaused = 'true';
                }
            };

            playButton.addEventListener('click', (e) => {
                e.stopPropagation();
                if (videoElement.paused) {
                    delete videoElement.dataset.userPaused;
                }
                togglePlayPause();
            });

            videoElement.addEventListener('click', togglePlayPause);

            const toggleMute = () => {
                videoElement.muted = !videoElement.muted;
                this.savedMuted = videoElement.muted;
                localStorage.setItem('xreels_muted', this.savedMuted.toString());
            };

            videoElement.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                toggleMute();
            });

            muteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMute();
            });

            volumeSlider.addEventListener('input', (e) => {
                e.stopPropagation();
                const newVolume = parseFloat(e.target.value) / 100;
                videoElement.volume = newVolume;
                videoElement.muted = false;

                this.savedVolume = newVolume;
                localStorage.setItem('xreels_volume', this.savedVolume.toString());

                this.savedMuted = false;
                localStorage.setItem('xreels_muted', 'false');

                if (newVolume === 0 && !videoElement.muted) {
                    videoElement.muted = true;
                    this.savedMuted = true;
                    localStorage.setItem('xreels_muted', 'true');
                }
            });

            // UPDATED: Extended speed options
            const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4];
            speedButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const currentIndex = speedOptions.indexOf(this.savedPlaybackRate);
                const nextIndex = (currentIndex + 1) % speedOptions.length;
                this.savedPlaybackRate = speedOptions[nextIndex];
                videoElement.playbackRate = this.savedPlaybackRate;
                speedButton.innerHTML = this.savedPlaybackRate.toFixed(2) + 'x';
                localStorage.setItem('xreels_playbackRate', this.savedPlaybackRate.toString());
            });

            const updateProgress = () => {
                if (!isDragging && videoElement.duration) {
                    const progress = (videoElement.currentTime / videoElement.duration) * 100;
                    progressBar.style.width = progress + '%';
                }
            };

            const updateTime = () => {
                const formatTime = (seconds) => {
                    const mins = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return `${mins}:${secs.toString().padStart(2, '0')}`;
                };

                const current = formatTime(videoElement.currentTime || 0);
                const total = formatTime(videoElement.duration || 0);
                timeDisplay.textContent = `${current} / ${total}`;
            };

            videoElement.addEventListener('timeupdate', () => {
                updateProgress();
                updateTime();
            });

            videoElement.addEventListener('loadedmetadata', () => {
                updateTime();
                videoElement.playbackRate = this.savedPlaybackRate;
            });

            videoElement.addEventListener('loadeddata', () => {
                updateControlsUI();
                videoElement.playbackRate = this.savedPlaybackRate;
            });

            // UPDATED: Aggressive Speed Enforcement
            // Fixes issue where speed resets to 1.0x when videos loop or reload
            const enforceSpeed = () => {
                if (Math.abs(videoElement.playbackRate - this.savedPlaybackRate) > 0.01) {
                    videoElement.playbackRate = this.savedPlaybackRate;
                }
            };
            videoElement.addEventListener('ratechange', enforceSpeed);
            videoElement.addEventListener('playing', enforceSpeed);
            videoElement.addEventListener('play', enforceSpeed);

            const handleProgressClick = (e) => {
                const rect = progressBackground.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                if (videoElement.duration) {
                    videoElement.currentTime = pos * videoElement.duration;
                }
            };

            progressContainer.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                isDragging = true;
                handleProgressClick(e);

                const handleMouseMove = (e) => {
                    if (isDragging) {
                        handleProgressClick(e);
                    }
                };

                const handleMouseUp = () => {
                    isDragging = false;
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            });

            let isHoveringControls = false;
            const controlsHoverZone = 150;
            videoContainer.addEventListener('mousemove', (e) => {
                const rect = videoContainer.getBoundingClientRect();
                const distanceFromBottom = rect.bottom - e.clientY;

                if (distanceFromBottom <= controlsHoverZone) {
                    if (!isHoveringControls) {
                        isHoveringControls = true;
                        controlsOverlay.style.opacity = '1';
                    }
                } else {
                    if (isHoveringControls) {
                        isHoveringControls = false;
                        if (!isDragging) {
                            controlsOverlay.style.opacity = '0';
                        }
                    }
                }
            });
            videoContainer.addEventListener('mouseleave', () => {
                isHoveringControls = false;
                if (!isDragging) {
                    controlsOverlay.style.opacity = '0';
                }
            });

            updateControlsUI();
            videoElement.addEventListener('volumechange', updateControlsUI);
            videoElement.addEventListener('play', updatePlayPauseIcon);
            videoElement.addEventListener('pause', updatePlayPauseIcon);

            // 動画が勝手に止まらないように監視
            const playbackMonitor = setInterval(() => {
                if (!this.isActive || this.activeDisplayedMediaElement !== videoElement) {
                    clearInterval(playbackMonitor);
                    return;
                }
                // ユーザーが明示的に一時停止した場合は再生しない
                if (videoElement.dataset.userPaused === 'true') {
                    return;
                }
                // ユーザー操作以外で止まった場合、再生を再開
                if (videoElement.paused && !videoElement.ended) {
                    console.log('Video paused unexpectedly, resuming playback...');
                    videoElement.play().catch(err => console.warn('Resume play failed:', err));
                }
            }, 1000); // 1秒ごとにチェック

            videoElement.playbackRate = this.savedPlaybackRate;
            speedButton.innerHTML = this.savedPlaybackRate.toFixed(2) + 'x';

            this.attemptVideoPlay(videoElement);
        }

        async simulateTwitterPlayClick(vidEl) {
            const videoPlayerContainer = vidEl.closest('div[data-testid="videoPlayer"]');
            if (videoPlayerContainer) {
                let playButton = videoPlayerContainer.querySelector(
                    'svg[role="img"][aria-label="Play"], ' +
                    'div[role="button"][tabindex="0"][aria-label*="Play"], ' +
                    'div[data-testid="playButton"], ' +
                    'div[data-testid="SensitiveMediaDisclosure"] button, ' +
                    'div[data-testid="videoPlayer"] > div > div > div[tabindex="0"], ' +
                    'div[data-testid="tweetPhoto"] div[role="button"], ' +
                    '[data-testid="ShyPinButton"], ' +
                    'div[data-testid="play-pause-button"]'
                );

                if (!playButton) {
                    playButton = videoPlayerContainer;
                    console.log('No specific play button found, falling back to clicking video container.');
                }

                if (playButton) {
                    console.log('Attempting to simulate click on Twitter\'s video player button/container:', playButton);
                    playButton.click();
                    await new Promise(resolve => setTimeout(resolve, 100));
                    return true;
                }
            }
            return false;
        }

        async attemptVideoPlay(video) {
            let playAttempts = 0;
            const maxPlayAttempts = 15;
            const attemptInterval = 500;

            while (playAttempts < maxPlayAttempts) {
                if (!this.isActive || this.activeDisplayedMediaElement !== video) {
                    console.log('Video no longer active or feed exited, stopping autoplay attempts.');
                    video.pause();
                    return;
                }

                if (!video.paused && video.muted === false) {
                    console.log('Video is playing at 5% volume. Autoplay successful.');
                    return;
                }

                console.log(`Autoplay attempt ${playAttempts + 1}/${maxPlayAttempts} for video. State: paused=${video.paused}, muted=${video.muted}`);

                if (video.paused) {
                    try {
                        if (video.currentTime >= video.duration - 0.5) {
                            video.currentTime = 0;
                        }
                        video.muted = false;
                        video.volume = 0.05; // 5%に固定
                        await video.play();
                        console.log('Direct play attempt successful at 5% volume.');
                        video.playbackRate = this.savedPlaybackRate;
                        video.dispatchEvent(new Event('volumechange'));
                    } catch (error) {
                        console.warn(`Direct play failed (attempt ${playAttempts + 1}):`, error.name, error.message);
                        await this.simulateTwitterPlayClick(video);
                    }
                } else {
                    video.muted = false;
                    video.volume = 0.05;
                    video.playbackRate = this.savedPlaybackRate;
                    video.dispatchEvent(new Event('volumechange'));
                }

                playAttempts++;
                await new Promise(resolve => setTimeout(resolve, attemptInterval));
            }

            console.warn('All aggressive autoplay attempts exhausted. Video might require manual interaction.');
            video.controls = true;
            video.muted = false;
            video.volume = 0.05;
            video.playbackRate = this.savedPlaybackRate;
            video.dispatchEvent(new Event('volumechange'));
        }

        displayImage(mediaItem) {
            const mediaWrapper = this.container.querySelector('.media-wrapper');
            const img = document.createElement('img');
            const previewSrc = mediaItem.thumbSrc || mediaItem.src;
            img.src = previewSrc;
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 0;
                background: black;
            `;
            if (this.blurEnabled) {
                img.style.filter = 'blur(16px)';
                img.style.opacity = '0.85';
            }
            mediaWrapper.appendChild(img);
            this.activeDisplayedMediaElement = img;

            if (mediaItem.src && mediaItem.src !== previewSrc) {
                const hiResImage = new Image();
                hiResImage.onload = () => {
                    img.src = mediaItem.src;
                    if (this.blurEnabled) {
                        img.style.filter = 'blur(16px)';
                        img.style.opacity = '0.85';
                    }
                };
                hiResImage.src = mediaItem.src;
            }
        }

        restoreOriginalMediaPosition() {
            if (this.activeDisplayedMediaElement) {
                if (this.activeDisplayedMediaElement.tagName === 'VIDEO' || this.activeDisplayedMediaElement.tagName === 'IMG') {
                    this.activeDisplayedMediaElement.style.cssText = '';

                    const currentMediaItemObject = this.activePost.mediaItems.find(item => item.originalElement === this.activeDisplayedMediaElement);
                    if (currentMediaItemObject && currentMediaItemObject.placeholder && currentMediaItemObject.placeholder.parentNode) {
                        currentMediaItemObject.placeholder.parentElement.replaceChild(this.activeDisplayedMediaElement, currentMediaItemObject.placeholder);
                    } else if (this.activeDisplayedMediaElement.parentNode) {
                        this.activeDisplayedMediaElement.remove();
                    }
                }
            }
            this.activeDisplayedMediaElement = null;
        }

        handlePostNavigation(direction) {
            if (this.isNavigating) return;

            let nextPostElement = null;
            if (direction === 'prev') {
                nextPostElement = this.findNextMediaArticle(this.activePost.element, true);
            } else {
                nextPostElement = this.findNextMediaArticle(this.activePost.element, false);
            }

            if (nextPostElement) {
                this.navigateToPost(nextPostElement);
            } else {
                this.showLoadingIndicator('No more visible posts. Scrolling to load more...');
                const currentScrollY = window.scrollY;
                window.scrollBy({ top: 500, behavior: 'auto' });

                setTimeout(() => {
                    this.hideLoadingIndicator();
                    const newlyLoadedPost = this.findNextMediaArticle(this.activePost.element, false);
                    if (newlyLoadedPost && newlyLoadedPost !== this.activePost.element) {
                        this.navigateToPost(newlyLoadedPost);
                    } else {
                        window.scrollTo({ top: currentScrollY, behavior: 'auto' });
                        console.log('No new media posts found after scrolling.');
                    }
                }, 2000);
            }
        }

        handleMediaNavigation(direction) {
            if (this.isNavigating || !this.activePost || !this.activePost.mediaItems || this.activePost.mediaItems.length <= 1) {
                return false;
            }
            let newMediaIndex = this.activePost.currentMediaIndex;
            let mediaNavigated = false;

            if (direction === 'next') {
                if (newMediaIndex < this.activePost.mediaItems.length - 1) {
                    newMediaIndex++;
                    this.activePost.currentMediaIndex = newMediaIndex;
                    this.displayCurrentMediaItem();
                    mediaNavigated = true;
                }
            } else if (direction === 'prev') {
                if (newMediaIndex > 0) {
                    newMediaIndex--;
                    this.activePost.currentMediaIndex = newMediaIndex;
                    this.displayCurrentMediaItem();
                    mediaNavigated = true;
                }
            }
            return mediaNavigated;
        }

        findNextMediaArticle(currentArticle, findPrevious = false) {
            const allArticles = Array.from(document.querySelectorAll('article[role="article"]'));
            const currentIndex = currentArticle ? allArticles.indexOf(currentArticle) : -1;
            let startIndex = findPrevious ? currentIndex - 1 : currentIndex + 1;
            let endIndex = findPrevious ? -1 : allArticles.length;
            let step = findPrevious ? -1 : 1;

            for (let i = startIndex; findPrevious ? i >= endIndex : i < endIndex; i += step) {
                const article = allArticles[i];
                if (!this.hasTargetContentWarning(article)) continue;
                if (article.querySelector('div[data-testid="videoPlayer"] video, div[data-testid="tweetPhoto"] img')) {
                    const mediaEls = article.querySelectorAll('div[data-testid="videoPlayer"] video, div[data-testid="tweetPhoto"] img');
                    for (const el of mediaEls) {
                        if (this.isValidMedia(el)) {
                            return article;
                        }
                    }
                }
            }
            return null;
        }

        findCentralMediaArticle() {
            const allArticles = Array.from(document.querySelectorAll('article[role="article"]'));
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const viewportCenter = viewportHeight / 2;
            let closestArticle = null;
            let minDistance = Infinity;

            for (const article of allArticles) {
                if (!this.hasTargetContentWarning(article)) continue;
                const mediaElements = article.querySelectorAll('div[data-testid="videoPlayer"] video, div[data-testid="tweetPhoto"] img');
                let hasValidMedia = false;
                for (const el of mediaElements) {
                    if (this.isValidMedia(el)) {
                        hasValidMedia = true;
                        break;
                    }
                }

                if (hasValidMedia) {
                    const rect = article.getBoundingClientRect();
                    if (rect.bottom > 0 && rect.top < viewportHeight) {
                        const articleCenter = rect.top + rect.height / 2;
                        const distance = Math.abs(viewportCenter - articleCenter);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestArticle = article;
                        }
                    }
                }
            }
            return closestArticle;
        }

        getFullQualityImageUrl(imgElement) {
            if (!imgElement || !imgElement.src) return null;
            let src = imgElement.src;
            if (src.includes('pbs.twimg.com/media/')) {
                const url = new URL(src);
                url.searchParams.set('name', 'orig');
                src = url.href;
            }
            return src;
        }

        selectHighestQualityVideo(videoEl) {
            if (!videoEl) return;

            const candidates = [];

            const addCandidate = (src) => {
                if (!src) return;
                let score = 0;
                const resMatch = src.match(/(\d{3,4})x(\d{3,4})/);
                if (resMatch) {
                    const w = parseInt(resMatch[1], 10);
                    const h = parseInt(resMatch[2], 10);
                    score = w * h;
                }
                const pMatch = src.match(/(\d{3,4})p/);
                if (pMatch) {
                    score = Math.max(score, parseInt(pMatch[1], 10) * 1000);
                }
                const brMatch = src.match(/(?:bitrate|br|abr)[=\/](\d{3,6})/i);
                if (brMatch) {
                    score = Math.max(score, parseInt(brMatch[1], 10));
                }
                candidates.push({ src, score });
            };

            videoEl.querySelectorAll('source').forEach(source => addCandidate(source.src));
            addCandidate(videoEl.currentSrc);
            addCandidate(videoEl.src);

            if (candidates.length === 0) return;

            candidates.sort((a, b) => b.score - a.score);
            const best = candidates[0];
            if (best && best.src && videoEl.src !== best.src && videoEl.currentSrc !== best.src) {
                videoEl.src = best.src;
                videoEl.load();
            }
        }

        generateTweetId(tweet) {
            if (!tweet) return null;
            const link = tweet.querySelector('a[href*="/status/"][dir="ltr"], a[href*="/status/"]');
            if (link) {
                const match = link.href.match(/\/status\/(\d+)/);
                if (match && match[1]) return match[1];
            }
            return null;
        }

        isValidMedia(element) {
            if (!element) return false;

            if (element.tagName === 'VIDEO') {
                const container = element.closest('div[data-testid="videoPlayer"]');
                return container && element.readyState >= 0;
            } else if (element.tagName === 'IMG') {
                return element.src && element.src.includes('pbs.twimg.com/media/') && !element.src.includes('video_thumb');
            }
            return false;
        }

        hasTargetContentWarning(article) {
            if (!article) return false;
            const warningTexts = new Set([
                '内容の警告: 成人向けコンテンツ',
                '内容の警告: ヌード',
                '内容の警告: ヌードとセンシティブな内容'
            ]);

            return Array.from(article.querySelectorAll('div, span')).some(el => {
                const text = (el.textContent || '').trim();
                return warningTexts.has(text);
            });
        }

        hideNonFilteredPosts() {
            const allArticles = Array.from(document.querySelectorAll('article[role="article"]'));
            allArticles.forEach(article => {
                if (!this.hasTargetContentWarning(article)) {
                    // まだ非表示リストに入っていない場合のみ追加
                    if (!this.hiddenPosts.includes(article)) {
                        this.hiddenPosts.push(article);
                    }
                    article.style.display = 'none';
                }
            });
        }

        showHiddenPosts() {
            // 非表示にしたポストを全て再表示
            this.hiddenPosts.forEach(article => {
                article.style.display = '';
            });
            // 配列をクリア
            this.hiddenPosts = [];
        }        setupEventListeners() {
            if (this.boundHandleWheel) {
                document.removeEventListener('wheel', this.boundHandleWheel, { passive: false, capture: true });
                document.removeEventListener('keydown', this.boundHandleKeydown, { capture: true });
                window.removeEventListener('popstate', this.boundHandlePopState);
            }

            this.boundHandleWheel = this.handleWheel.bind(this);
            this.boundHandleKeydown = this.handleKeydown.bind(this);
            this.boundHandlePopState = this.handlePopState.bind(this);

            document.addEventListener('wheel', this.boundHandleWheel, { passive: false, capture: true });
            document.addEventListener('keydown', this.boundHandleKeydown, { capture: true });
            window.addEventListener('popstate', this.boundHandlePopState);
        }

        handleWheel(e) {
            if (!this.isActive) return;
            e.preventDefault();
            e.stopPropagation();
            this.lastScrollTime = Date.now();

            const direction = e.deltaY > 0 ? 'next' : 'prev';
            const mediaNavigated = this.handleMediaNavigation(direction);

            if (!mediaNavigated) {
                this.handlePostNavigation(direction);
            }
        }

        handleKeydown(e) {
            if (e.key.toLowerCase() === 'x') {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (this.isActive) {
                    this.exit();
                } else {
                    this.startFeed();
                }
                return;
            }

            if (!this.isActive) {
                return;
            }

            if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
                if (e.key.toLowerCase() === 'q') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.exit();
                }
                return;
            }

            if (e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();

                if (this.activeDisplayedMediaElement && this.activeDisplayedMediaElement.tagName === 'VIDEO') {
                    if (this.activeDisplayedMediaElement.paused) {
                        this.activeDisplayedMediaElement.play();
                    } else {
                        this.activeDisplayedMediaElement.pause();
                    }
                }
                return;
            }

            if (this.activeDisplayedMediaElement && this.activeDisplayedMediaElement.tagName === 'VIDEO') {
                const video = this.activeDisplayedMediaElement;
                const scrubAmount = 5;

                if (e.key === ',' || e.key === '<') {
                    e.preventDefault();
                    e.stopPropagation();
                    video.currentTime = Math.max(0, video.currentTime - scrubAmount);
                    return;
                } else if (e.key === '.' || e.key === '>') {
                    e.preventDefault();
                    e.stopPropagation();
                    video.currentTime = Math.min(video.duration, video.currentTime + scrubAmount);
                    return;
                }
            }

            const keyMap = {
                'q': () => this.exit(),
                'Q': () => this.exit(),
                'ArrowUp': () => { e.preventDefault(); e.stopPropagation(); this.handlePostNavigation('prev'); },
                'ArrowDown': () => { e.preventDefault(); e.stopPropagation(); this.handlePostNavigation('next'); },
                'ArrowLeft': () => { e.preventDefault(); e.stopPropagation(); this.handleMediaNavigation('prev'); },
                'ArrowRight': () => { e.preventDefault(); e.stopPropagation(); this.handleMediaNavigation('next'); },
                'l': () => { e.preventDefault(); e.stopPropagation(); this.toggleLike(); },
                'L': () => { e.preventDefault(); e.stopPropagation(); this.toggleLike(); },
                'f': () => { e.preventDefault(); e.stopPropagation(); this.toggleFollow(); },
                'F': () => { e.preventDefault(); e.stopPropagation(); this.toggleFollow(); }
            };

            if (keyMap[e.key]) {
                e.preventDefault();
                e.stopImmediatePropagation();
                keyMap[e.key]();
            }
        }

        handlePopState() {
            if (this.isActive && this.isReturningFromFollow) {
                console.log('Popstate detected, returning from follow action.');
                this.hideLoadingIndicator();
                this.isReturningFromFollow = false;
            }
        }

        disconnectObserver() {
            if (this.mutationObserver) {
                this.mutationObserver.disconnect();
                this.mutationObserver = null;
                console.log('MutationObserver disconnected.');
            }
        }

        toggleReplies() {
            if (this.prevPostsPanel.style.display === 'none' && this.nextPostsPanel.style.display === 'none') {
                this.showPrevPosts();
                this.showNextPosts();
            } else {
                this.hidePrevPosts();
                this.hideNextPosts();
            }
        }

        hidePrevPosts() {
            this.prevPostsPanel.style.display = 'none';
        }

        hideNextPosts() {
            this.nextPostsPanel.style.display = 'none';
        }

        async showPrevPosts() {
            if (!this.activePost.element) return;
            
            this.prevPostsPanel.style.display = 'block';
            const content = this.container.querySelector('#prev-posts-content');
            content.innerHTML = '<div style="text-align: center; padding: 10px; color: rgba(255,255,255,0.6); font-size: 11px;">読み込み中...</div>';

            const prevPosts = await this.fetchPrevPosts();
            
            if (prevPosts.length === 0) {
                content.innerHTML = '<div style="text-align: center; padding: 10px; color: rgba(255,255,255,0.6); font-size: 11px;">前のポストがありません</div>';
                return;
            }

            content.innerHTML = this.renderPosts(prevPosts, '#FF6F61');
            this.updatePrevPostsStyles();
            this.applyBlurStyles();
        }

        async showNextPosts() {
            if (!this.activePost.element) return;
            
            this.nextPostsPanel.style.display = 'block';
            const content = this.container.querySelector('#next-posts-content');
            content.innerHTML = '<div style="text-align: center; padding: 10px; color: rgba(255,255,255,0.6); font-size: 11px;">読み込み中...</div>';

            const nextPosts = await this.fetchNextPosts();
            
            if (nextPosts.length === 0) {
                content.innerHTML = '<div style="text-align: center; padding: 10px; color: rgba(255,255,255,0.6); font-size: 11px;">次のポストがありません</div>';
                return;
            }

            content.innerHTML = this.renderPosts(nextPosts, '#6496FF');
            this.updateNextPostsStyles();
            this.applyBlurStyles();
        }

        renderPosts(posts, borderColor) {
            let html = '';
            posts.forEach(post => {
                const isFiltered = post.hasWarning ? 'rgba(255, 215, 0, 0.5)' : borderColor;
                let mediaHtml = '';
                if (post.media && post.media.length > 0) {
                    mediaHtml = '<div class="panel-media-row" style="display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap; align-items: flex-start;">';
                    post.media.forEach(mediaUrl => {
                        mediaHtml += `<img class="post-image" src="${mediaUrl}" style="width: auto; height: auto; max-width: 100%; border-radius: 6px; object-fit: cover; box-shadow: 0 2px 6px rgba(0,0,0,0.25);" />`;
                    });
                    mediaHtml += '</div>';
                }

                const iconHtml = post.icon ? `<img src="${post.icon}" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 6px; object-fit: cover;" />` : '';
                
                html += `
                    <div class="panel-post" style="padding: 8px; margin-bottom: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; border-left: 3px solid ${isFiltered}; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
                        <div style="display: flex; align-items: center; margin-bottom: 4px;">
                            ${iconHtml}
                            <div>
                                <div style="font-weight: 700; font-size: 11px; background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${post.author}</div>
                                <div style="color: rgba(255,255,255,0.5); font-size: 10px;">@${post.handle}</div>
                            </div>
                        </div>
                        <div class="post-text" style="font-size: 11px; line-height: 1.4; color: rgba(255,255,255,0.95); margin-bottom: 4px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${post.text}</div>
                        ${mediaHtml}
                        <div style="display: flex; gap: 12px; margin-top: 6px; font-size: 10px; color: rgba(255,255,255,0.6);">
                            <span style="transition: color 0.2s;" onmouseover="this.style.color='rgba(100,200,255,0.9)'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">💬 ${post.replies || 0}</span>
                            <span style="transition: color 0.2s;" onmouseover="this.style.color='rgba(100,255,150,0.9)'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">🔁 ${post.retweets || 0}</span>
                            <span style="transition: color 0.2s;" onmouseover="this.style.color='rgba(255,100,150,0.9)'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">❤️ ${post.likes || 0}</span>
                            <span style="transition: color 0.2s;" onmouseover="this.style.color='rgba(255,200,100,0.9)'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">🔖 ${post.bookmarks || 0}</span>
                        </div>
                    </div>
                `;
            });
            return html;
        }

        async fetchPrevPosts() {
            if (!this.activePost.element) return [];

            const allArticles = Array.from(document.querySelectorAll('article[role="article"]'));
            const currentIndex = allArticles.indexOf(this.activePost.element);
            
            const prevPosts = [];

            for (let i = currentIndex - 1; i >= Math.max(currentIndex - 6, 0); i--) {
                const article = allArticles[i];
                const post = this.extractPostInfo(article);
                if (post) {
                    prevPosts.unshift(post);
                    if (prevPosts.length >= 3) break;
                }
            }

            return prevPosts;
        }

        async fetchNextPosts() {
            if (!this.activePost.element) return [];

            const allArticles = Array.from(document.querySelectorAll('article[role="article"]'));
            const currentIndex = allArticles.indexOf(this.activePost.element);
            
            const nextPosts = [];

            for (let i = currentIndex + 1; i < Math.min(currentIndex + 7, allArticles.length); i++) {
                const article = allArticles[i];
                const post = this.extractPostInfo(article);
                if (post) {
                    nextPosts.push(post);
                    if (nextPosts.length >= 3) break;
                }
            }

            return nextPosts;
        }

        extractPostInfo(article) {
            if (!article) return null;

            const authorEl = article.querySelector('[data-testid="User-Name"] [dir="ltr"]');
            const handleEl = article.querySelector('[data-testid="User-Name"] a');
            const textEl = article.querySelector('[data-testid="tweetText"]');

            if (!authorEl || !textEl) return null;

            let handle = '';
            if (handleEl) {
                const href = handleEl.getAttribute('href');
                if (href) {
                    handle = href.replace('/', '');
                }
            }

            const media = [];
            const mediaElements = article.querySelectorAll('div[data-testid="tweetPhoto"] img');
            mediaElements.forEach(img => {
                if (img.src && !img.src.includes('profile_images')) {
                    media.push(img.src);
                }
            });

            const iconEl = article.querySelector('[data-testid="User-Name"] img[src*="profile_images"]');
            const icon = iconEl ? iconEl.src : '';

            const repliesEl = article.querySelector('[data-testid="reply"]');
            const replies = repliesEl ? this.extractCount(repliesEl) : 0;

            const retweetsEl = article.querySelector('[data-testid="retweet"]');
            const retweets = retweetsEl ? this.extractCount(retweetsEl) : 0;

            const likesEl = article.querySelector('[data-testid="like"], [data-testid="unlike"]');
            const likes = likesEl ? this.extractCount(likesEl) : 0;

            const bookmarksEl = article.querySelector('[data-testid="bookmark"], [data-testid="removeBookmark"]');
            const bookmarks = bookmarksEl ? this.extractCount(bookmarksEl) : 0;

            const hasWarning = this.hasTargetContentWarning(article);

            return {
                author: authorEl.textContent || 'Unknown',
                handle: handle || 'unknown',
                text: textEl.textContent || '',
                media: media,
                icon: icon,
                replies: replies,
                retweets: retweets,
                likes: likes,
                bookmarks: bookmarks,
                hasWarning: hasWarning
            };
        }

        extractCount(element) {
            if (!element) return 0;
            const countEl = element.querySelector('[data-testid$="-count"]');
            if (countEl) {
                const text = countEl.textContent.trim();
                if (text.includes('K')) {
                    return parseFloat(text.replace('K', '')) * 1000;
                } else if (text.includes('M')) {
                    return parseFloat(text.replace('M', '')) * 1000000;
                }
                return parseInt(text, 10) || 0;
            }
            return 0;
        }

        setupDraggable(panel, header, panelType) {
            let isDragging = false;
            let currentX, currentY, initialX, initialY;

            header.addEventListener('mousedown', (e) => {
                isDragging = true;
                initialX = e.clientX - panel.offsetLeft;
                initialY = e.clientY - panel.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    panel.style.left = currentX + 'px';
                    panel.style.top = currentY + 'px';
                    panel.style.bottom = 'auto';
                }
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    this.savePanelState(panelType);
                }
            });
        }

        persistPanelSettings() {
            if (!this.panelSettings) return;
            localStorage.setItem('xreels_textSize', this.panelSettings.textSize.toString());
            localStorage.setItem('xreels_imagePercent', this.panelSettings.imagePercent.toString());
        }

        setupPanelSliders() {
            const prevTextSlider = this.container.querySelector('#prev-text-size-slider');
            const prevTextValue = this.container.querySelector('#prev-text-size-value');
            const prevImageSlider = this.container.querySelector('#prev-image-size-slider');
            const prevImageValue = this.container.querySelector('#prev-image-size-value');
            const prevSettingsBtn = this.container.querySelector('#prev-settings-btn');
            const prevSettingsPanel = this.container.querySelector('#prev-settings-panel');

            const nextTextSlider = this.container.querySelector('#next-text-size-slider');
            const nextTextValue = this.container.querySelector('#next-text-size-value');
            const nextImageSlider = this.container.querySelector('#next-image-size-slider');
            const nextImageValue = this.container.querySelector('#next-image-size-value');
            const nextSettingsBtn = this.container.querySelector('#next-settings-btn');
            const nextSettingsPanel = this.container.querySelector('#next-settings-panel');

            const clampText = (val) => Math.max(8, Math.min(18, parseInt(val, 10) || 11));
            const clampImagePercent = (val) => Math.max(20, Math.min(100, parseInt(val, 10) || 60));

            const syncTextDisplay = (size) => {
                if (prevTextSlider) prevTextSlider.value = size;
                if (nextTextSlider) nextTextSlider.value = size;
                if (prevTextValue) prevTextValue.textContent = size + 'px';
                if (nextTextValue) nextTextValue.textContent = size + 'px';
            };

            const syncImageDisplay = (percent) => {
                if (prevImageSlider) prevImageSlider.value = percent;
                if (nextImageSlider) nextImageSlider.value = percent;
                if (prevImageValue) prevImageValue.textContent = percent + '%';
                if (nextImageValue) nextImageValue.textContent = percent + '%';
            };

            const initialText = clampText(this.panelSettings.textSize);
            const initialImage = clampImagePercent(this.panelSettings.imagePercent);
            this.panelSettings.textSize = initialText;
            this.panelSettings.imagePercent = initialImage;

            syncTextDisplay(initialText);
            syncImageDisplay(initialImage);
            this.persistPanelSettings();

            const handleTextChange = (value) => {
                const size = clampText(value);
                this.panelSettings.textSize = size;
                this.persistPanelSettings();
                syncTextDisplay(size);
                this.updateAllPanelStyles();
            };

            const handleImageChange = (value) => {
                const percent = clampImagePercent(value);
                this.panelSettings.imagePercent = percent;
                this.persistPanelSettings();
                syncImageDisplay(percent);
                this.updateAllPanelStyles();
            };

            if (prevTextSlider) prevTextSlider.addEventListener('input', (e) => handleTextChange(e.target.value));
            if (nextTextSlider) nextTextSlider.addEventListener('input', (e) => handleTextChange(e.target.value));
            if (prevImageSlider) prevImageSlider.addEventListener('input', (e) => handleImageChange(e.target.value));
            if (nextImageSlider) nextImageSlider.addEventListener('input', (e) => handleImageChange(e.target.value));

            const toggleSettingsPanel = (panelToOpen, otherPanel) => {
                if (!panelToOpen) return;
                const shouldShow = panelToOpen.style.display === 'none' || panelToOpen.style.display === '';
                panelToOpen.style.display = shouldShow ? 'block' : 'none';
                if (otherPanel) otherPanel.style.display = 'none';
            };

            if (prevSettingsBtn && prevSettingsPanel) {
                prevSettingsBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleSettingsPanel(prevSettingsPanel, nextSettingsPanel);
                });
            }

            if (nextSettingsBtn && nextSettingsPanel) {
                nextSettingsBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleSettingsPanel(nextSettingsPanel, prevSettingsPanel);
                });
            }

            document.addEventListener('click', (e) => {
                if (prevSettingsPanel && !prevSettingsPanel.contains(e.target) && prevSettingsBtn && !prevSettingsBtn.contains(e.target)) {
                    prevSettingsPanel.style.display = 'none';
                }
                if (nextSettingsPanel && !nextSettingsPanel.contains(e.target) && nextSettingsBtn && !nextSettingsBtn.contains(e.target)) {
                    nextSettingsPanel.style.display = 'none';
                }
            });

            this.updateAllPanelStyles();
        }

        updatePanelStyles(panelType) {
            const clampedText = Math.max(8, this.panelSettings ? this.panelSettings.textSize : 11);
            const clampedPercent = Math.max(20, Math.min(100, this.panelSettings ? this.panelSettings.imagePercent : 60));
            const content = this.container ? this.container.querySelector(`#${panelType}-posts-content`) : null;
            if (!content) return;

            content.querySelectorAll('.post-text').forEach(el => {
                el.style.fontSize = `${clampedText}px`;
            });

            const fallbackWidth = content.clientWidth || content.offsetWidth || 0;
            content.querySelectorAll('.panel-post').forEach(postEl => {
                const baseWidth = postEl.clientWidth || fallbackWidth;
                const targetPx = baseWidth ? Math.round(baseWidth * (clampedPercent / 100)) : 0;
                postEl.querySelectorAll('.post-image').forEach(img => {
                    if (targetPx > 0) {
                        img.style.width = `${targetPx}px`;
                        img.style.maxWidth = `${targetPx}px`;
                        img.style.maxHeight = `${targetPx}px`;
                    } else {
                        img.style.width = `${clampedPercent}%`;
                        img.style.maxWidth = `${clampedPercent}%`;
                        img.style.maxHeight = `${clampedPercent}%`;
                    }
                    img.style.height = 'auto';
                });
            });
        }

        updatePrevPostsStyles() {
            this.updatePanelStyles('prev');
        }

        updateNextPostsStyles() {
            this.updatePanelStyles('next');
        }

        updateAllPanelStyles() {
            this.updatePrevPostsStyles();
            this.updateNextPostsStyles();
            this.applyMainTextStyles();
        }

        setupResizeObserver(panel, panelType) {
            if (!panel) return;
            const resizeObserver = new ResizeObserver(() => {
                this.savePanelState(panelType);
                if (panelType === 'prev') {
                    this.updatePrevPostsStyles();
                } else {
                    this.updateNextPostsStyles();
                }
            });
            resizeObserver.observe(panel);
        }

        savePanelState(panelType) {
            const panel = panelType === 'prev' ? this.prevPostsPanel : this.nextPostsPanel;
            const state = {
                left: panel.style.left,
                top: panel.style.top,
                width: panel.style.width || panel.offsetWidth + 'px',
                height: panel.style.height || panel.offsetHeight + 'px'
            };
            localStorage.setItem(`xreels_${panelType}PanelState`, JSON.stringify(state));
        }

        restorePanelState(panelType) {
            const panel = panelType === 'prev' ? this.prevPostsPanel : this.nextPostsPanel;
            const savedState = localStorage.getItem(`xreels_${panelType}PanelState`);
            if (savedState) {
                try {
                    const state = JSON.parse(savedState);
                    if (state.left) panel.style.left = state.left;
                    if (state.top) panel.style.top = state.top;
                    if (state.width) panel.style.width = state.width;
                    if (state.height) panel.style.height = state.height;
                    if (panelType === 'next' && state.top) {
                        panel.style.bottom = 'auto';
                    }
                } catch (e) {
                    console.error('Failed to restore panel state:', e);
                }
            }
        }
    }

    function onReady() {
        if (window.tikTokFeedInstance) {
            console.log('Existing TikTok Feed instance found, cleaning up...');
            if (window.tikTokFeedInstance.boundHandleWheel) {
                document.removeEventListener('wheel', window.tikTokFeedInstance.boundHandleWheel, { passive: false, capture: true });
                document.removeEventListener('keydown', window.tikTokFeedInstance.boundHandleKeydown, { capture: true });
                window.removeEventListener('popstate', window.tikTokFeedInstance.boundHandlePopState);
            }
            if (window.tikTokFeedInstance.isActive) {
                window.tikTokFeedInstance.exit();
            }
            if (window.tikTokFeedInstance.activeDisplayedMediaElement && window.tikTokFeedInstance.activeDisplayedMediaElement.tagName === 'VIDEO') {
                window.tikTokFeedInstance.activeDisplayedMediaElement.pause();
                window.tikTokFeedInstance.activeDisplayedMediaElement.muted = true;
            }

            window.tikTokFeedInstance.disconnectObserver();
            window.tikTokFeedInstance = null;
            console.log('Previous TikTok Feed instance cleaned up.');
        }

        window.tikTokFeedInstance = new TikTokFeed();
        window.tikTokFeedInstance.init();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        onReady();
    } else {
        document.addEventListener('DOMContentLoaded', onReady);
    }
})();