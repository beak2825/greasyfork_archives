// ==UserScript==
// @name         Instagram Reels ++
// @namespace    http://tampermonkey.net/
// @version      3.3.0
// @description  Full-screen reels viewer with max quality, anti-pause, and instant-load scrolling.
// @author       Kristijan1001
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551737/Instagram%20Reels%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/551737/Instagram%20Reels%20%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class InstagramFeed {
        constructor() {
            this.activePost = { element: null };
            this.activeDisplayedMedia = { element: null, placeholder: null, isClone: false };
            this.isActive = false;
            this.isNavigating = false;
            this.isWaitingForModal = false;
            this.container = null;
            this.uiElements = {};
            this.modalObserver = null;
            this.savedVolume = Math.min(1, Math.max(0, parseFloat(localStorage.getItem('igreels_volume')) || 0.7));
            this.savedMuted = localStorage.getItem('igreels_muted') === 'true';
            this.savedPlaybackRate = parseFloat(localStorage.getItem('igreels_playbackRate')) || 1.0;
            this.autoScrollDelay = parseInt(localStorage.getItem('igreels_autoScrollDelay') || '0', 10);
            this.skipCarouselMode = localStorage.getItem('igreels_skipCarousel') === 'true';
            this.autoScrollTimeoutId = null;
            this.videoEndedListener = null;
            this.boundHandleKeydown = this.handleKeydown.bind(this);
            this.isProcessingInteraction = false;
            this.userIntendedPause = false;
        }

        /* -------------------- IMPROVED MAX QUALITY LOGIC -------------------- */

        getHighQualityUrl(imgElement) {
            let bestUrl = imgElement.src;

            // 1. Check srcset for the widest available candidate
            if (imgElement.srcset) {
                const candidates = imgElement.srcset.split(',').map(s => {
                    const parts = s.trim().split(/\s+/);
                    return {
                        url: parts[0],
                        width: parts[1] ? parseInt(parts[1].replace('w', '')) : 0
                    };
                });
                candidates.sort((a, b) => b.width - a.width);
                if (candidates.length > 0) {
                    bestUrl = candidates[0].url;
                }
            }

            // 2. Aggressive URL Cleaning
            try {
                const urlObj = new URL(bestUrl);
                const cleanedPath = urlObj.pathname.replace(/\/([sp]\d+x\d+|e\d+)\//g, '/');
                if (cleanedPath !== urlObj.pathname) {
                    urlObj.pathname = cleanedPath;
                    return urlObj.toString();
                }
            } catch (e) { /* ignore */ }

            return bestUrl;
        }

        /* -------------------- CORE LOGIC -------------------- */

        setupWheelListener() {
            this.removeWheelListener();
            this.boundHandleWheel = this.handleWheel.bind(this);
            document.addEventListener('wheel', this.boundHandleWheel, { passive: false, capture: true });
        }

        removeWheelListener() {
            if (this.boundHandleWheel) {
                document.removeEventListener('wheel', this.boundHandleWheel, { capture: true });
                this.boundHandleWheel = null;
            }
        }

        handleWheel(e) {
            if (!this.isActive) return;

            if (e.target.closest('.video-controls-overlay') || e.target.closest('#igreels-autoscroll-menu')) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            const now = Date.now();
            if (now - (this.lastWheelTime || 0) < 300) return;
            this.lastWheelTime = now;

            if (this.skipCarouselMode) {
                if (e.deltaY > 0) {
                    this.smartNavigate('next');
                } else {
                    this.smartNavigate('prev');
                }
                return;
            }

            const mediaContainer = this.activePost.element?.firstElementChild;
            if (e.deltaY > 0) {
                const hasNextMedia = mediaContainer?.querySelector('button[aria-label="Next"]');
                if (hasNextMedia) {
                    this.navigateMedia('next');
                } else {
                    this.smartNavigate('next');
                }
            } else {
                const hasPrevMedia = mediaContainer?.querySelector('button[aria-label="Go back"]');
                if (hasPrevMedia) {
                    this.navigateMedia('prev');
                } else {
                    this.smartNavigate('prev');
                }
            }
        }

        sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

        intersectionArea(a, b) {
            const xOverlap = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
            const yOverlap = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
            return xOverlap * yOverlap;
        }

        extractBackgroundImageUrl(styleStr) {
            if (!styleStr || styleStr === 'none') return null;
            const m = /url\((['"]?)(.*?)\1\)/.exec(styleStr);
            return m ? m[2] : null;
        }

        async waitForImageToLoad(imgEl, timeout = 2000) {
            try {
                if (imgEl.complete && imgEl.naturalWidth > 0) return true;
                let ok = false;
                const race = new Promise((resolve) => {
                    const onload = () => { ok = true; cleanup(); resolve(true); };
                    const onerror = () => { cleanup(); resolve(false); };
                    const cleanup = () => { imgEl.removeEventListener('load', onload); imgEl.removeEventListener('error', onerror); };
                    imgEl.addEventListener('load', onload);
                    imgEl.addEventListener('error', onerror);
                    if (imgEl.decode) {
                        imgEl.decode().then(() => { ok = true; cleanup(); resolve(true); }).catch(()=>{ /* ignore */ });
                    }
                });
                const timer = new Promise(res => setTimeout(res, timeout, false));
                return await Promise.race([race, timer]) || ok;
            } catch (e) {
                return false;
            }
        }

        async waitForVideoReady(videoEl, timeout = 2000) {
            const HAVE_ENOUGH = 4;
            if (videoEl.readyState >= HAVE_ENOUGH) return true;
            return new Promise((resolve) => {
                const oncan = () => { cleanup(); resolve(true); };
                const onerr = () => { cleanup(); resolve(false); };
                const cleanup = () => { videoEl.removeEventListener('canplay', oncan); videoEl.removeEventListener('error', onerr); };
                videoEl.addEventListener('canplay', oncan);
                videoEl.addEventListener('error', onerr);
                setTimeout(() => { cleanup(); resolve(videoEl.readyState >= HAVE_ENOUGH); }, timeout);
            });
        }

        init() {
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }
            console.log('📸 IG Max Quality Reels Initializing...');
            document.removeEventListener('keydown', this.boundHandleKeydown, { capture: true });
            document.addEventListener('keydown', this.boundHandleKeydown, { capture: true });
            const setupTrigger = () => {
                const oldTrigger = document.getElementById('ig-reels-trigger');
                if (oldTrigger) oldTrigger.remove();
                this.addManualTrigger();
            };
            setTimeout(setupTrigger, 2000);
            this.setupUrlChangeObserver(setupTrigger);
            this.injectStyles();
        }

        injectStyles() {
            const css = `
                #ig-feed-container { overflow: hidden !important; }
                .igreels-controls-column { position: absolute; right: 20px; bottom: 100px; display: flex; flex-direction: column; gap: 14px; z-index: 1000002; align-items: center; pointer-events: auto; }
                .igreels-btn { background: rgba(255,255,255,0.2); border: none; border-radius: 50%; width: 45px; height: 45px; font-size: 20px; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(10px); box-shadow: 0 2px 10px rgba(0,0,0,0.3); transition: all 0.3s ease; }
                .custom-video-container input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #f09433; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
                .custom-video-container input[type="range"]::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%; background: #f09433; cursor: pointer; border: none; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
                .video-controls-overlay:hover .progress-fill .progress-thumb { opacity: 1; }
                .custom-video-container:hover .video-controls-overlay { opacity: 1; }
                @keyframes pulse-ring { 0% { transform: scale(0.95); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.7; } 100% { transform: scale(1.15); opacity: 0; } }
                @keyframes pulse-rect { 0% { transform: scale(0.98); opacity: 1; } 50% { transform: scale(1.02); opacity: 0.7; } 100% { transform: scale(1.06); opacity: 0; } }
                @keyframes heart-beat { 0%, 100% { transform: scale(1); } 25% { transform: scale(1.2); } 50% { transform: scale(1.1); } 75% { transform: scale(1.25); } }
                @keyframes float-up { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-8px) scale(1.1); opacity: 0; } }
                @keyframes float-down { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(8px) scale(1.1); opacity: 0; } }
                @keyframes bookmark-fill { 0%, 100% { transform: scale(1) rotateZ(0deg); } 50% { transform: scale(1.2) rotateZ(-5deg); } }
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
                .fancy-action-btn:hover { transform: translateY(-4px) scale(1.08); }
                .fancy-action-btn:hover .like-icon, .fancy-action-btn:hover .save-icon, .fancy-action-btn:hover .follow-icon, .fancy-action-btn:hover .arrow-icon { transform: scale(1.15); }
                .fancy-action-btn:active { transform: translateY(-2px) scale(1.02); transition: all 0.1s ease; }
                #igreels-like:hover .pulse-ring { animation: pulse-ring 1s cubic-bezier(0.4, 0, 0.6, 1) infinite !important; }
                #igreels-prev:hover .arrow-icon { animation: float-up 0.6s ease infinite; }
                #igreels-next:hover .arrow-icon { animation: float-down 0.6s ease infinite; }
                .igreels-liked .heart-path { fill: #ff306c !important; stroke: #ff306c !important; animation: heart-beat 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: center; }
                .igreels-liked { background: linear-gradient(135deg, rgba(255, 48, 108, 0.5) 0%, rgba(237, 29, 82, 0.5) 100%) !important; border-color: rgba(255, 48, 108, 0.8) !important; box-shadow: 0 12px 40px rgba(255, 48, 108, 0.5), 0 0 30px rgba(255, 48, 108, 0.3) inset !important; }
                .igreels-bookmarked .bookmark-path { fill: #ffc107 !important; stroke: #ffc107 !important; animation: bookmark-fill 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: center; }
                .igreels-bookmarked { background: linear-gradient(135deg, rgba(255, 193, 7, 0.5) 0%, rgba(255, 152, 0, 0.5) 100%) !important; border-color: rgba(255, 193, 7, 0.8) !important; box-shadow: 0 12px 40px rgba(255, 193, 7, 0.5), 0 0 30px rgba(255, 193, 7, 0.3) inset !important; }
                .igreels-following .follow-plus-v, .igreels-following .follow-plus-h { opacity: 0; transform: scale(0); }
                .igreels-following { background: linear-gradient(135deg, rgba(131, 58, 180, 0.5) 0%, rgba(195, 42, 163, 0.5) 100%) !important; border-color: rgba(131, 58, 180, 0.8) !important; box-shadow: 0 12px 40px rgba(131, 58, 180, 0.5), 0 0 30px rgba(131, 58, 180, 0.3) inset !important; }
                .igreels-following::after { content: '✓'; position: absolute; top: 50%; right: -4px; transform: translate(0, -50%); font-size: 14px; color: white; font-weight: bold; z-index: 3; text-shadow: 0 2px 8px rgba(0,0,0,0.4); }
                .custom-video-container button:hover { background: rgba(255,255,255,0.25) !important; border-color: rgba(255,255,255,0.4) !important; transform: scale(1.1); box-shadow: 0 6px 20px rgba(0,0,0,0.4) !important; }
                .custom-video-container button:active { transform: scale(0.95); }
                .custom-video-container button::before { content: ''; position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s ease; pointer-events: none; }
                .custom-video-container button:hover::before { opacity: 1; }
            `;
            const s = document.createElement('style');
            s.type = 'text/css';
            s.id = 'igreels-styles';
            s.appendChild(document.createTextNode(css));
            document.head.appendChild(s);
        }

        setupUrlChangeObserver(callback) {
            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    setTimeout(callback, 1000);
                }
            }).observe(document.body, { subtree: true, childList: true });
        }

        addManualTrigger() {
            if (document.getElementById('ig-reels-trigger')) return;
            const trigger = document.createElement('div');
            trigger.id = 'ig-reels-trigger';
            trigger.innerHTML = `
                <div class="trigger-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.59 10.59L12 3l-7.59 7.59-1.42-1.41L12 0l8.99 9-1.4 1.59z" fill="currentColor"/>
                        <path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="trigger-content">
                    <div class="trigger-title">IG Max</div>
                    <div class="trigger-subtitle">Press X</div>
                </div>
            `;

            trigger.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 1000000; display: flex; align-items: center; gap: 12px; padding: 14px 20px;
                background: linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%);
                border: 1px solid rgba(255, 0, 80, 0.3); border-radius: 16px; cursor: pointer; user-select: none;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset, 0 0 20px rgba(255, 0, 80, 0.15);
                backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%);
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); transform: translateY(0) scale(1); opacity: 1;
            `;

            const style = document.createElement('style');
            style.textContent = `
                #ig-reels-trigger { animation: slideInDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
                #ig-reels-trigger .trigger-icon { width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #ff0050 0%, #ff4081 100%); border-radius: 10px; flex-shrink: 0; box-shadow: 0 4px 16px rgba(255, 0, 80, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset; transition: all 0.3s ease; }
                #ig-reels-trigger .trigger-icon svg { color: white; width: 22px; height: 22px; animation: iconPulse 2.5s ease-in-out infinite; }
                #ig-reels-trigger .trigger-content { display: flex; flex-direction: column; gap: 1px; }
                #ig-reels-trigger .trigger-title { color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; line-height: 1.2; }
                #ig-reels-trigger .trigger-subtitle { color: rgba(255, 255, 255, 0.55); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.3px; }
                #ig-reels-trigger:hover { transform: translateY(-3px) scale(1.02); border-color: rgba(255, 0, 80, 0.5); box-shadow: 0 10px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 25px rgba(255, 0, 80, 0.25); }
                #ig-reels-trigger:hover .trigger-icon { transform: scale(1.08) rotate(5deg); box-shadow: 0 5px 16px rgba(255, 0, 80, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2) inset; }
                #ig-reels-trigger:hover .trigger-icon svg { animation: iconSpin 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
                #ig-reels-trigger:active { transform: translateY(-1px) scale(0.98); transition: all 0.1s ease; }
                #ig-reels-trigger::before { content: ''; position: absolute; inset: -2px; background: linear-gradient(135deg, #ff0050, #ff4081, #ff0050); border-radius: 14px; opacity: 0; transition: opacity 0.3s ease; z-index: -1; filter: blur(8px); }
                #ig-reels-trigger:hover::before { opacity: 0.25; animation: gradientRotate 2s linear infinite; }
                @keyframes slideInDown { from { opacity: 0; transform: translateY(-30px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes iconPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.9; } }
                @keyframes iconSpin { from { transform: rotate(0deg) scale(1); } to { transform: rotate(360deg) scale(1.08); } }
                @keyframes gradientRotate { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                @media (max-width: 768px) { #ig-reels-trigger { top: 12px; right: 12px; padding: 8px 12px; gap: 8px; } #ig-reels-trigger .trigger-icon { width: 32px; height: 32px; } #ig-reels-trigger .trigger-icon svg { width: 16px; height: 16px; } #ig-reels-trigger .trigger-title { font-size: 12px; } #ig-reels-trigger .trigger-subtitle { font-size: 9px; } }
            `;
            if (!document.getElementById('ig-reels-pulse-style')) {
                style.id = 'ig-reels-pulse-style';
                document.head.appendChild(style);
            }

            trigger.addEventListener('click', (e) => { e.stopPropagation(); this.armFeedStart(); });
            document.body.appendChild(trigger);
        }

        armFeedStart() {
            if (this.isActive || this.isWaitingForModal) return;
            const existing = this.getCurrentArticle();
            if (existing) {
                this.startFeed(existing);
                return;
            }
            const isBookmarksPage = window.location.pathname.includes('/saved/');
            if (!isBookmarksPage) {
                console.warn('No posts found on the page');
                return;
            }
            this.isWaitingForModal = true;
            const trigger = document.getElementById('ig-reels-trigger');
            if (trigger) {
                const subtitle = trigger.querySelector('.trigger-subtitle');
                if(subtitle) subtitle.textContent = "Click a post...";
            }
            this.modalObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.querySelector('div[role="dialog"] article')) {
                            this.startFeed(node.querySelector('div[role="dialog"] article'));
                            return;
                        }
                    }
                }
            });
            this.modalObserver.observe(document.body, { childList: true, subtree: true });
        }

        getCurrentArticle() {
            const modalArticle = document.querySelector('div[role="dialog"] article');
            if (modalArticle) return modalArticle;
            return this.findCentralArticle();
        }

        findCentralArticle() {
            const allArticles = Array.from(document.querySelectorAll('article'));
            if (allArticles.length === 0) return null;
            const viewportHeight = window.innerHeight;
            const viewportCenter = viewportHeight / 2;
            let closestArticle = null;
            let minDistance = Infinity;
            for (const article of allArticles) {
                if (!this.isValidArticle(article)) continue;
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
            return closestArticle;
        }

        startFeed(initialPostElement) {
            if (this.isWaitingForModal) {
                this.isWaitingForModal = false;
                if (this.modalObserver) this.modalObserver.disconnect();
            }
            console.log('🚀 Starting Max Quality Feed Mode...');
            this.isActive = true;
            this.setupWheelListener();
            const trig = document.getElementById('ig-reels-trigger');
            if (trig) trig.style.display = 'none';
            this.createContainer();
            this.updateView(initialPostElement);
        }

        exit() {
            if (!this.isActive) return;
            console.log('👋 Exiting Feed Mode...');
            this.isActive = false;
            this.isProcessingInteraction = false;
            this.stopAutoScrollTimer();
            this.removeWheelListener();
            this.restoreOriginalMediaPosition();
            if (this.container) this.container.remove();
            this.container = null;
            const closeButton = document.querySelector('div[role="dialog"] svg[aria-label="Close"]')?.closest('div[role="button"]');
            if (closeButton) closeButton.click();
            setTimeout(() => {
                const trigger = document.getElementById('ig-reels-trigger');
                if (trigger) {
                    trigger.style.display = 'flex';
                    const subtitle = trigger.querySelector('.trigger-subtitle');
                    if(subtitle) subtitle.textContent = "Press X";
                } else {
                    this.addManualTrigger();
                }
            }, 50);
        }

        isValidArticle(article) {
            if (!article) return false;
            const hasMedia = article.querySelector('video, img[src*="cdninstagram"], div[style*="background-image"]');
            if (!hasMedia) return false;
            const hasSuggestedText = article.textContent.includes('Suggested for you');
            const hasCloseButton = article.querySelector('svg[aria-label="Close"]');
            if (hasSuggestedText && hasCloseButton) {
                const rect = article.getBoundingClientRect();
                if (rect.height < 200) return false;
            }
            const rect = article.getBoundingClientRect();
            if (rect.height < 100) return false;
            article.dataset.isSuggested = hasSuggestedText ? 'true' : 'false';
            return true;
        }

        createContainer() {
            this.container = document.createElement('div');
            this.container.id = 'ig-feed-container';
            this.container.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.95); z-index: 2147483647; pointer-events: none; overflow: hidden;`;
            this.container.innerHTML = `
                <div class="media-wrapper" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; pointer-events: auto; overflow: hidden;"></div>
                <div class="ui-container" style="position: relative; z-index: 1000002; width: 100%; height: 100%; pointer-events: none;">
                    <div style="position: absolute; top: 20px; left: 20px; display: flex; flex-direction: column; align-items: flex-start; gap: 5px; pointer-events: auto;">
                        <div class="info-controls-wrapper" style="color: rgba(255,255,255,0.9); background: rgba(0,0,0,0.6); padding: 6px 10px; border-radius: 15px; font-size: 12px; backdrop-filter: blur(10px); pointer-events: auto; transition: all 0.3s ease;">
                            <div class="info-header" style="color: white; cursor: pointer; text-align: left; display: flex; align-items: center; justify-content: flex-start; gap: 5px;">
                                Keyboard Shortcuts
                                <span style="display: inline-block; width: 12px; height: 12px; background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M7.41%208.59L12%2013.17L16.59%208.59L18%2010L12%2016L6%2010L7.41%208.59Z%22%20fill%3D%22%23f09433%22%2F%3E%0A%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: center; background-size: contain; transform: rotate(0deg); transition: transform 0.3s ease-out;"></span>
                            </div>
                            <div class="controls-expanded" style="max-height: 0; overflow: hidden; opacity: 0; transition: max-height 0.3s ease-out, opacity 0.3s ease-out; padding-top: 0; font-weight: 400;">
                                • X: <span style="color:#f09433;">Enter/Exit Feed</span> <br>
                                • Scroll: <span style="color:#f09433;">⬆️/⬇️</span> <br>
                                • Cycle Media: <span style="color:#f09433;">⬅️/➡️</span> <br>
                                • Space: <span style="color:#f09433;">Play/Pause</span> <br>
                                • &lt; / &gt; : <span style="color:#f09433;">Scrub ±5s</span> <br>
                                • L: <span style="color:#f09433;">Like</span> <br>
                                • S: <span style="color:#f09433;">Save</span> <br>
                                • F: <span style="color:#f09433;">Follow</span> <br>
                                • Q/Esc: <span style="color:#f09433;">Exit</span>
                            </div>
                        </div>
                    </div>
                    <div style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; pointer-events: auto;">
                        <button id="igreels-exit" class="igreels-btn igreels-exit fancy-exit-btn" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%); border: 1px solid rgba(239, 68, 68, 0.6); padding: 10px 16px; border-radius: 16px; width: auto; height: auto; font-size: 13px; font-weight: 700; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(239, 68, 68, 0.35), 0 0 20px rgba(239, 68, 68, 0.15) inset; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; gap: 8px; position: relative; overflow: hidden;" title="Exit (Q/Esc)">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transition: all 0.3s ease;">
                                <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));"/>
                            </svg>
                            <span style="position: relative; z-index: 2;">Exit</span>
                            <div class="exit-pulse" style="position: absolute; inset: -2px; border-radius: 16px; border: 2px solid rgba(239, 68, 68, 0.6); opacity: 0; animation: pulse-rect 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
                        </button>
                        <div style="color: white; background: rgba(0,0,0,0.6); padding: 8px 12px; border-radius: 15px; font-size: 12px; font-weight: 600; backdrop-filter: blur(10px); display: flex; align-items: center; gap: 8px; pointer-events: auto; cursor: pointer;" id="igreels-autoscroll-container">  <span>Auto: <span id="igreels-autoscroll-display" style="color: #f09433;">Off</span></span>  <span style="color: #f09433;">▼</span></div><div id="igreels-autoscroll-menu" style="display: none; position: absolute; top: 90px; right: 20px; background: rgba(0,0,0,0.9); border-radius: 10px; padding: 8px; backdrop-filter: blur(10px); pointer-events: auto; z-index: 10000000;">  <div class="autoscroll-option" data-value="0" style="padding: 8px 16px; cursor: pointer; color: #f09433; border-radius: 5px; transition: background 0.2s;">Off</div>  <div class="autoscroll-option" data-value="-1" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">Auto (Smart)</div>  <div class="autoscroll-option" data-value="1000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">1s</div>  <div class="autoscroll-option" data-value="2000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">2s</div>  <div class="autoscroll-option" data-value="3000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">3s</div>  <div class="autoscroll-option" data-value="5000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">5s</div>  <div class="autoscroll-option" data-value="8000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">8s</div>  <div class="autoscroll-option" data-value="30000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">30s</div>  <div class="autoscroll-option" data-value="60000" style="padding: 8px 16px; cursor: pointer; color: white; border-radius: 5px; transition: background 0.2s;">60s</div></div>
                        <div style="color: white; background: rgba(0,0,0,0.6); padding: 8px 12px; border-radius: 15px; font-size: 12px; font-weight: 600; backdrop-filter: blur(10px); display: flex; align-items: center; gap: 8px; pointer-events: auto; cursor: pointer;">
                            <input type="checkbox" id="igreels-skip-media" style="cursor: pointer; width: 16px; height: 16px; accent-color: #f09433;">
                            <label for="igreels-skip-media" style="cursor: pointer; user-select: none;">Skip carousel</label>
                        </div>
                    </div>
                    <div class="info" style="position: absolute; bottom: 75px; left: 20px; right: 100px; color: white; background: rgba(0,0,0,0.0); padding: 20px; border-radius: 16px; max-height: 120px; overflow-y: hidden; text-shadow: 1px 1px 4px rgba(0,0,0,0.8); word-wrap: break-word; overflow-wrap: break-word; white-space: normal; pointer-events: auto;"></div>
                </div>
            `;
            const controls = document.createElement('div');
            controls.className = 'igreels-controls-column';
            controls.innerHTML = `
                <button id="igreels-like" class="igreels-btn fancy-action-btn" style="background: linear-gradient(135deg, rgba(255, 48, 108, 0.25) 0%, rgba(237, 29, 82, 0.25) 100%); border: 1px solid rgba(255, 48, 108, 0.5); border-radius: 50%; width: 54px; height: 54px; cursor: pointer; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(255, 48, 108, 0.35), 0 0 20px rgba(255, 48, 108, 0.2) inset; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;" title="Like (L)">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="like-icon" style="position: relative; z-index: 2; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); overflow: visible;">
                        <path class="heart-path" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="white" stroke-width="2" stroke-linejoin="round" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)); transition: all 0.4s ease;"/>
                    </svg>
                    <div class="pulse-ring" style="position: absolute; inset: -2px; border-radius: 50%; border: 2px solid rgba(255, 48, 108, 0.6); opacity: 0; animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
                </button>
                <button id="igreels-save" class="igreels-btn fancy-action-btn" style="background: linear-gradient(135deg, rgba(255, 193, 7, 0.25) 0%, rgba(255, 152, 0, 0.25) 100%); border: 1px solid rgba(255, 193, 7, 0.5); border-radius: 50%; width: 54px; height: 54px; cursor: pointer; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(255, 193, 7, 0.35), 0 0 20px rgba(255, 193, 7, 0.2) inset; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;" title="Save (S)">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="save-icon" style="position: relative; z-index: 2; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
                        <path class="bookmark-path" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="none" stroke="white" stroke-width="2" stroke-linejoin="round" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)); transition: all 0.4s ease;"/>
                    </svg>
                    <div class="pulse-ring" style="position: absolute; inset: -2px; border-radius: 50%; border: 2px solid rgba(255, 193, 7, 0.6); opacity: 0; animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.3s;"></div>
                </button>
                <button id="igreels-follow" class="igreels-btn fancy-action-btn" style="background: linear-gradient(135deg, rgba(131, 58, 180, 0.25) 0%, rgba(195, 42, 163, 0.25) 100%); border: 1px solid rgba(131, 58, 180, 0.5); border-radius: 50%; width: 54px; height: 54px; cursor: pointer; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(131, 58, 180, 0.35), 0 0 20px rgba(131, 58, 180, 0.2) inset; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;" title="Follow (F)">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="follow-icon" style="position: relative; z-index: 2; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
                        <circle cx="12" cy="8" r="4" stroke="white" stroke-width="2" fill="none" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));"/>
                        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="white" stroke-width="2" stroke-linecap="round" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));"/>
                        <line x1="19" y1="8" x2="19" y2="14" stroke="white" stroke-width="2" stroke-linecap="round" class="follow-plus-v" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)); transition: all 0.3s ease;"/>
                        <line x1="16" y1="11" x2="22" y2="11" stroke="white" stroke-width="2" stroke-linecap="round" class="follow-plus-h" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)); transition: all 0.3s ease;"/>
                    </svg>
                    <div class="pulse-ring" style="position: absolute; inset: -2px; border-radius: 50%; border: 2px solid rgba(131, 58, 180, 0.6); opacity: 0; animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.6s;"></div>
                </button>
                <button id="igreels-prev" class="igreels-btn fancy-action-btn" style="background: linear-gradient(135deg, rgba(100, 150, 255, 0.25) 0%, rgba(70, 120, 255, 0.25) 100%); border: 1px solid rgba(100, 150, 255, 0.5); border-radius: 50%; width: 54px; height: 54px; cursor: pointer; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(100, 150, 255, 0.35), 0 0 20px rgba(100, 150, 255, 0.2) inset; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;" title="Previous (↑)">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-icon" style="position: relative; z-index: 2; transition: all 0.3s ease;">
                        <path d="M12 19V5M5 12l7-7 7 7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));"/>
                    </svg>
                    <div class="pulse-ring" style="position: absolute; inset: -2px; border-radius: 50%; border: 2px solid rgba(100, 150, 255, 0.6); opacity: 0; animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.9s;"></div>
                </button>
                <button id="igreels-next" class="igreels-btn fancy-action-btn" style="background: linear-gradient(135deg, rgba(100, 150, 255, 0.25) 0%, rgba(70, 120, 255, 0.25) 100%); border: 1px solid rgba(100, 150, 255, 0.5); border-radius: 50%; width: 54px; height: 54px; cursor: pointer; backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(100, 150, 255, 0.35), 0 0 20px rgba(100, 150, 255, 0.2) inset; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;" title="Next (↓)">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-icon" style="position: relative; z-index: 2; transition: all 0.3s ease;">
                        <path d="M12 5v14M5 12l7 7 7-7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));"/>
                    </svg>
                    <div class="pulse-ring" style="position: absolute; inset: -2px; border-radius: 50%; border: 2px solid rgba(100, 150, 255, 0.6); opacity: 0; animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 1.2s;"></div>
                </button>
            `;
            this.container.querySelector('.ui-container').appendChild(controls);

            document.body.appendChild(this.container);
            this.uiElements = {
                mediaWrapper: this.container.querySelector('.media-wrapper'),
                info: this.container.querySelector('.info'),
                exitButton: this.container.querySelector('#igreels-exit'),
                prevButton: this.container.querySelector('#igreels-prev'),
                nextButton: this.container.querySelector('#igreels-next'),
                likeButton: this.container.querySelector('#igreels-like'),
                saveButton: this.container.querySelector('#igreels-save'),
                followButton: this.container.querySelector('#igreels-follow'),
            };
            this.uiElements.exitButton.addEventListener('click', (e) => { e.stopPropagation(); this.exit(); });
            this.uiElements.prevButton.addEventListener('click', (e) => { e.stopPropagation(); this.smartNavigate('prev'); });
            this.uiElements.nextButton.addEventListener('click', (e) => { e.stopPropagation(); this.smartNavigate('next'); });
            this.uiElements.likeButton.addEventListener('click', (e) => { e.stopPropagation(); this.toggleAction('like'); });
            this.uiElements.saveButton.addEventListener('click', (e) => { e.stopPropagation(); this.toggleAction('save'); });
            this.uiElements.followButton.addEventListener('click', (e) => { e.stopPropagation(); this.toggleFollow(); });
            this.setupKeyboardShortcutsToggle();
            this.setupSkipCarouselToggle();
            this.setupAutoScrollControls();
            for (const btn of Object.values(this.uiElements)) {
                if (btn && btn.addEventListener) {
                    btn.addEventListener('mousedown', (ev) => ev.preventDefault());
                }
            }
        }

        setupKeyboardShortcutsToggle() {
            const infoControlsWrapper = this.container.querySelector('.info-controls-wrapper');
            const controlsExpanded = this.container.querySelector('.controls-expanded');
            const infoHeader = this.container.querySelector('.info-header');
            const infoArrow = infoHeader.querySelector('span');
            let isHoveringInfo = false;
            let isInfoExpanded = false;
            let hideInfoTimeoutId = null;
            infoControlsWrapper.addEventListener('mouseenter', () => {
                isHoveringInfo = true;
                clearTimeout(hideInfoTimeoutId);
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
                hideInfoTimeoutId = setTimeout(() => {
                    if (!isHoveringInfo) {
                        controlsExpanded.style.maxHeight = '0';
                        controlsExpanded.style.opacity = '0';
                        controlsExpanded.style.paddingTop = '0';
                        infoArrow.style.transform = 'rotate(0deg)';
                        isInfoExpanded = false;
                    }
                }, 500);
            });
        }

        setupSkipCarouselToggle() {
            const checkbox = this.container.querySelector('#igreels-skip-media');
            if (checkbox) {
                checkbox.checked = this.skipCarouselMode;
                checkbox.addEventListener('change', (e) => {
                    this.skipCarouselMode = e.target.checked;
                    localStorage.setItem('igreels_skipCarousel', this.skipCarouselMode.toString());
                    console.log(`Skip carousel mode: ${this.skipCarouselMode ? 'ON' : 'OFF'}`);
                });
            }
        }

        setupAutoScrollControls() {
            const container = document.getElementById('igreels-autoscroll-container');
            const menu = document.getElementById('igreels-autoscroll-menu');
            const display = document.getElementById('igreels-autoscroll-display');

            const timeLabels = { 0: 'Off', '-1': 'Auto (Smart)', 1000: '1s', 2000: '2s', 3000: '3s', 5000: '5s', 8000: '8s', 30000: '30s', 60000: '60s' };
            display.textContent = timeLabels[this.autoScrollDelay] || 'Off';

            container.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            });

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
                    localStorage.setItem('igreels_autoScrollDelay', value.toString());
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

        startAutoScrollTimer() {
            this.stopAutoScrollTimer();
            if (!this.isActive || this.isProcessingInteraction) return;

            if (this.autoScrollDelay === -1) {
                if (this.skipCarouselMode) {
                    const video = this.uiElements.mediaWrapper.querySelector('video');
                    if (video) {
                        const onEnded = () => {
                            if (!this.isActive || this.isProcessingInteraction) return;
                            this.userIntendedPause = false; // Reset intent before auto-nav
                            this.navigatePost('next');
                        };
                        this.videoEndedListener = onEnded;
                        video.addEventListener('ended', onEnded);
                    } else {
                        this.autoScrollTimeoutId = setTimeout(() => {
                            if (!this.isActive || this.isProcessingInteraction) return;
                            this.navigatePost('next');
                        }, 3000);
                    }
                } else {
                    const video = this.uiElements.mediaWrapper.querySelector('video');
                    if (video) {
                        const onEnded = () => {
                            if (!this.isActive || this.isProcessingInteraction) return;
                            this.userIntendedPause = false;
                            this.smartNavigate('next');
                        };
                        this.videoEndedListener = onEnded;
                        video.addEventListener('ended', onEnded);
                    } else {
                        this.autoScrollTimeoutId = setTimeout(() => {
                            if (!this.isActive || this.isProcessingInteraction) return;
                            this.smartNavigate('next');
                        }, 3000);
                    }
                }
            } else if (this.autoScrollDelay > 0) {
                this.autoScrollTimeoutId = setTimeout(() => {
                    if (!this.isActive || this.isProcessingInteraction) return;
                    this.userIntendedPause = false;
                    if (this.skipCarouselMode) {
                        this.navigatePost('next');
                    } else {
                        this.smartNavigate('next');
                    }
                }, this.autoScrollDelay);
            }
        }

        stopAutoScrollTimer() {
            if (this.autoScrollTimeoutId) {
                clearTimeout(this.autoScrollTimeoutId);
                this.autoScrollTimeoutId = null;
            }
            if (this.videoEndedListener) {
                const video = this.uiElements?.mediaWrapper?.querySelector('video');
                if (video) {
                    video.removeEventListener('ended', this.videoEndedListener);
                }
                this.videoEndedListener = null;
            }
        }

        findCandidateMedia(article) {
            if (!article) return null;
            const articleRect = article.getBoundingClientRect();
            const candidates = [];
            const carouselContainer = article.querySelector('ul[style*="flex-direction"]') ||
                                    article.querySelector('div[style*="flex-direction"] ul') ||
                                     article.querySelector('div._ac7v');
            article.querySelectorAll('video, img').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.width < 12 || rect.height < 12) return;
                const alt = (el.alt || '').toLowerCase();
                const src = (el.src || '').toLowerCase();
                if (alt.includes('profile') || alt.includes('avatar') ||
                    src.includes('profile') || src.includes('avatar') ||
                    (rect.width <= 48 && rect.height <= 48)) {
                    return;
                }
                let carouselOrder = -1;
                if (carouselContainer) {
                    const carouselItems = Array.from(carouselContainer.querySelectorAll('li'));
                    for (let i = 0; i < carouselItems.length; i++) {
                        if (carouselItems[i].contains(el)) {
                            carouselOrder = i;
                            break;
                        }
                    }
                }
                const isInView = rect.top >= 0 && rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth);
                candidates.push({
                    el,
                    rect,
                    kind: el.tagName.toLowerCase(),
                    isInView,
                    area: rect.width * rect.height,
                    carouselOrder
                });
            });

            article.querySelectorAll('*').forEach(el => {
                try {
                    const cs = getComputedStyle(el);
                    const bg = cs.backgroundImage;
                    if (bg && bg !== 'none') {
                        const rect = el.getBoundingClientRect();
                        if (rect.width >= 100 && rect.height >= 100) {
                            candidates.push({ el, rect, kind: 'background', bg, area: rect.width * rect.height, carouselOrder: -1 });
                        }
                    }
                } catch (e) { /* ignore */ }
            });

            if (candidates.length === 0) return null;

            let best = null;
            let bestScore = -Infinity;
            for (const c of candidates) {
                const intersectArea = this.intersectionArea(c.rect, articleRect);
                const centerDist = Math.hypot(
                    (c.rect.left + c.rect.right) / 2 - (articleRect.left + articleRect.right) / 2,
                    (c.rect.top + c.rect.bottom) / 2 - (articleRect.top + articleRect.bottom) / 2
                );
                let score = intersectArea - centerDist;
                if (c.isInView && c.carouselOrder >= 0) {
                    score += 50000 - (c.carouselOrder * 1000);
                } else if (c.isInView) {
                    score += 10000;
                }
                if (c.area > 50000) score += 2000;
                if (score > bestScore) {
                    bestScore = score;
                    best = c;
                }
            }
            return best ? best.el : null;
        }

        getMediaIdentifier(el) {
            if (!el) return null;
            if (el.tagName === 'IMG') return el.currentSrc || el.src || el.getAttribute('src') || el.getAttribute('data-src') || null;
            if (el.tagName === 'VIDEO') return el.currentSrc || el.src || (el.querySelector('source')?.src) || null;
            const bg = getComputedStyle(el).backgroundImage;
            return this.extractBackgroundImageUrl(bg);
        }

        async pickActiveMediaWithWait(article, maxAttempts = 25, interval = 150) {
            const isSuggested = article.dataset.isSuggested === 'true';
            const adjustedAttempts = isSuggested ? 8 : maxAttempts;
            const adjustedInterval = isSuggested ? 50 : interval;

            for (let attempt = 0; attempt < adjustedAttempts; attempt++) {
                const candidate = this.findCandidateMedia(article);
                if (candidate) {
                    const id = this.getMediaIdentifier(candidate);
                    if (candidate.tagName === 'IMG') {
                        const rect = candidate.getBoundingClientRect();
                        if (rect.width > 50 && rect.height > 50) {
                            if (isSuggested) {
                                if (attempt > 0 || candidate.complete) return { el: candidate, id };
                            } else {
                                const loaded = await this.waitForImageToLoad(candidate, 1500);
                                if (loaded) return { el: candidate, id };
                            }
                        }
                    } else if (candidate.tagName === 'VIDEO') {
                        if (isSuggested) {
                            if (candidate.readyState > 0 || attempt > 1) return { el: candidate, id };
                        } else {
                            const ready = await this.waitForVideoReady(candidate, 1500);
                            if (ready) return { el: candidate, id };
                        }
                    } else {
                        const bg = getComputedStyle(candidate).backgroundImage;
                        const url = this.extractBackgroundImageUrl(bg);
                        if (url) return { el: candidate, id: url };
                    }
                }
                const waitTime = isSuggested ? 50 : Math.min(interval * (1 + attempt * 0.2), 500);
                await this.sleep(waitTime);
            }
            return null;
        }

        async mountMediaForDisplay(mediaEl) {
            this.restoreOriginalMediaPosition();
            if (mediaEl.tagName !== 'IMG' && mediaEl.tagName !== 'VIDEO') {
                const bg = getComputedStyle(mediaEl).backgroundImage;
                const url = this.extractBackgroundImageUrl(bg);
                if (!url) return null;
                const img = document.createElement('img');
                img.style.cssText = 'width: 100%; height: 100%; object-fit: contain; background: black; pointer-events: auto;';
                img.src = url;
                this.uiElements.mediaWrapper.appendChild(img);
                this.activeDisplayedMedia = { element: img, placeholder: null, isClone: true, original: mediaEl };
                await this.waitForImageToLoad(img, 1500);
                return img;
            }
            const rect = mediaEl.getBoundingClientRect();
            // IMPROVED PLACEHOLDER: Ensure it matches the original EXACTLY to prevent layout shift
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `width: ${rect.width}px; height: ${rect.height}px; flex-shrink: 0; display: block; background: transparent;`;

            if (mediaEl.parentNode) {
                try { mediaEl.parentNode.replaceChild(placeholder, mediaEl); } catch (e) { /* ignore */ }
            }
            this.activeDisplayedMedia = { element: mediaEl, placeholder, isClone: false, originalParent: placeholder.parentNode };

            if (mediaEl.tagName === 'VIDEO') {
                mediaEl.setAttribute('preload', 'auto');
                if (mediaEl.videoWidth > 0 && mediaEl.videoHeight > 0) {
                    mediaEl.style.width = '100vw';
                    mediaEl.style.height = '100vh';
                }
                // Reset intended pause state when mounting new video
                this.userIntendedPause = false;
                this.displayVideo(mediaEl);
            } else {
                const originalSrc = mediaEl.src;
                const highResUrl = this.getHighQualityUrl(mediaEl);

                mediaEl.style.cssText = `width: 100%; height: 100%; object-fit: contain; background: black; pointer-events: auto;`;

                if (highResUrl && highResUrl !== originalSrc) {
                    mediaEl.onerror = () => {
                        console.warn("Max quality image failed, reverting to standard.");
                        mediaEl.src = originalSrc;
                        mediaEl.onerror = null;
                    };
                    mediaEl.src = highResUrl;
                }
                this.uiElements.mediaWrapper.appendChild(mediaEl);
            }
            return mediaEl;
        }

        displayVideo(videoElement) {
            const mediaWrapper = this.uiElements.mediaWrapper;
            const videoContainer = document.createElement('div');
            videoContainer.className = 'custom-video-container';
            videoContainer.style.cssText = `position: relative; width: 100%; height: 100%; background: black; display: flex; align-items: center; justify-content: center; cursor: pointer; pointer-events: auto;`;
            videoElement.style.cssText = `width: 100%; height: 100%; object-fit: contain; border-radius: 0; display: block; background: black;`;

            videoElement.muted = this.savedMuted;
            videoElement.volume = this.savedVolume;
            videoElement.playbackRate = this.savedPlaybackRate;
            videoElement.loop = false;
            videoElement.controls = false;
            videoElement.preload = 'auto'; // Force buffer

            const controlsOverlay = document.createElement('div');
            controlsOverlay.className = 'video-controls-overlay';
            controlsOverlay.style.cssText = `position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%); padding: 12px 30px 12px 12px; opacity: 0; transition: opacity 0.3s ease; pointer-events: all; z-index: 1000010;`;

            const progressContainer = document.createElement('div');
            progressContainer.style.cssText = `width: 100%; height: 14px; background: transparent; border-radius: 10px; margin-bottom: 10px; cursor: pointer; pointer-events: all; position: relative; display: flex; align-items: center; padding: 5px 0;`;

            const progressBackground = document.createElement('div');
            progressBackground.style.cssText = `width: 100%; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; position: relative;`;

            const progressBar = document.createElement('div');
            progressBar.className = 'progress-fill';
            progressBar.style.cssText = `height: 100%; background: linear-gradient(90deg, #f09433, #e6683c); border-radius: 3px; width: 0%; transition: width 0.1s ease; position: relative;`;

            const progressThumb = document.createElement('div');
            progressThumb.className = 'progress-thumb';
            progressThumb.style.cssText = `position: absolute; right: -5px; top: 50%; transform: translateY(-50%); width: 10px; height: 10px; background: #f09433; border-radius: 50%; opacity: 0; transition: opacity 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.3);`;
            progressBar.appendChild(progressThumb);
            progressBackground.appendChild(progressBar);
            progressContainer.appendChild(progressBackground);

            const controlsContainer = document.createElement('div');
            controlsContainer.style.cssText = `display: flex; align-items: center; gap: 15px; pointer-events: all;`;

            const playButton = document.createElement('button');
            playButton.innerHTML = `
                <svg class="play-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transition: all 0.3s ease;">
                    <path d="M8 5v14l11-7z" fill="white" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));"/>
                </svg>
                <svg class="pause-icon" style="display: none; transition: all 0.3s ease;" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="white" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));"/>
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

            const timeDisplay = document.createElement('div');
            timeDisplay.style.cssText = `color: white; font-size: 11px; font-weight: 600; min-width: 70px; text-shadow: 0 1px 2px rgba(0,0,0,0.8);`;
            timeDisplay.textContent = '0:00 / 0:00';

            // Playback speed button
            const speedButton = document.createElement('button');
            speedButton.innerHTML = this.savedPlaybackRate.toFixed(2) + 'x';
            speedButton.style.cssText = `background: rgba(255,255,255,0.2); border: none; color: white; font-size: 11px; font-weight: 600; cursor: pointer; padding: 4px 8px; border-radius: 12px; transition: all 0.3s ease; min-width: 35px;`;
            speedButton.title = 'Playback Speed';

            const volumeContainer = document.createElement('div');
            volumeContainer.style.cssText = `display: flex; align-items: center; gap: 10px; margin-left: auto; margin-right: 25px;`;

            const muteButton = document.createElement('button');
            muteButton.innerHTML = this.savedMuted ? '🔇' : '🔊';
            muteButton.style.cssText = `background: none; border: none; color: white; font-size: 16px; cursor: pointer; padding: 6px; border-radius: 4px; transition: background 0.3s ease; flex-shrink: 0;`;

            const volumeSliderContainer = document.createElement('div');
            volumeSliderContainer.style.cssText = `width: 80px; height: 20px; display: flex; align-items: center; cursor: pointer; position: relative;`;

            const volumeTrack = document.createElement('div');
            volumeTrack.style.cssText = `width: 100%; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; position: relative;`;

            const volumeFill = document.createElement('div');
            volumeFill.style.cssText = `height: 100%; background: linear-gradient(90deg, #f09433, #e6683c); border-radius: 2px; width: ${this.savedVolume * 100}%; position: relative;`;

            const volumeThumb = document.createElement('div');
            volumeThumb.style.cssText = `position: absolute; top: 50%; right: -6px; transform: translateY(-50%); width: 12px; height: 12px; background: white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3); cursor: grab;`;

            volumeTrack.appendChild(volumeFill);
            volumeFill.appendChild(volumeThumb);
            volumeSliderContainer.appendChild(volumeTrack);
            volumeContainer.appendChild(muteButton);
            volumeContainer.appendChild(volumeSliderContainer);
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
            let isVolumeDragging = false;

            const applyVolumeSettings = () => {
                videoElement.muted = this.savedMuted;
                videoElement.volume = this.savedVolume;
                muteButton.innerHTML = this.savedMuted ? '🔇' : '🔊';
                volumeFill.style.width = (this.savedVolume * 100) + '%';
            };

            const saveVolumeSettings = () => {
                this.savedVolume = videoElement.volume;
                this.savedMuted = videoElement.muted;
                localStorage.setItem('igreels_volume', this.savedVolume.toString());
                localStorage.setItem('igreels_muted', this.savedMuted.toString());
            };

            const updateVolume = (clientX) => {
                const rect = volumeTrack.getBoundingClientRect();
                const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
                videoElement.volume = percent;
                if (percent > 0 && videoElement.muted) {
                    videoElement.muted = false;
                }
                saveVolumeSettings();
                applyVolumeSettings();
            };

            volumeSliderContainer.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                isVolumeDragging = true;
                volumeThumb.style.cursor = 'grabbing';
                updateVolume(e.clientX);
                const onMouseMove = (e) => {
                    if (isVolumeDragging) updateVolume(e.clientX);
                };
                const onMouseUp = () => {
                    isVolumeDragging = false;
                    volumeThumb.style.cursor = 'grab';
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            const togglePlayPause = () => {
                this.stopAutoScrollTimer();
                this.isProcessingInteraction = true;

                if (videoElement.paused) {
                    this.userIntendedPause = false; // User wants to play
                    applyVolumeSettings();
                    videoElement.play().catch(err => console.warn('Play failed:', err));
                } else {
                    this.userIntendedPause = true; // User intentionally paused
                    videoElement.pause();
                }

                setTimeout(() => {
                    this.isProcessingInteraction = false;
                    if (!videoElement.paused) {
                        this.startAutoScrollTimer();
                    }
                }, 300);
            };

            playButton.addEventListener('click', (e) => { e.stopPropagation(); togglePlayPause(); });
            videoElement.addEventListener('click', togglePlayPause);

            const toggleMute = () => {
                videoElement.muted = !videoElement.muted;
                saveVolumeSettings();
                applyVolumeSettings();
            };

            videoElement.addEventListener('dblclick', (e) => { e.stopPropagation(); toggleMute(); });
            muteButton.addEventListener('click', (e) => { e.stopPropagation(); toggleMute(); });

            // Playback speed control
            const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4];
            speedButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const currentIndex = speedOptions.indexOf(this.savedPlaybackRate);
                const nextIndex = (currentIndex + 1) % speedOptions.length;
                this.savedPlaybackRate = speedOptions[nextIndex];
                videoElement.playbackRate = this.savedPlaybackRate;
                speedButton.innerHTML = this.savedPlaybackRate.toFixed(2) + 'x';
                localStorage.setItem('igreels_playbackRate', this.savedPlaybackRate.toString());
            });

            const updateProgress = () => {
                 if (!isDragging && videoElement.duration) {
                    progressBar.style.width = (videoElement.currentTime / videoElement.duration) * 100 + '%';
                 }
            };

            const updateTime = () => {
                const formatTime = s => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;
                timeDisplay.textContent = `${formatTime(videoElement.currentTime||0)} / ${formatTime(videoElement.duration||0)}`;
            };

            videoElement.addEventListener('timeupdate', () => { updateProgress(); updateTime(); });
            videoElement.addEventListener('loadedmetadata', () => { updateTime(); applyVolumeSettings(); videoElement.playbackRate = this.savedPlaybackRate; });
            videoElement.addEventListener('play', updatePlayPauseIcon);
            videoElement.addEventListener('pause', updatePlayPauseIcon);
            videoElement.addEventListener('loadeddata', () => { applyVolumeSettings(); videoElement.playbackRate = this.savedPlaybackRate; updatePlayPauseIcon(); });
            videoElement.addEventListener('canplay', () => { applyVolumeSettings(); videoElement.playbackRate = this.savedPlaybackRate; });

            // ANTI-PAUSE LOCK
            // If the video pauses AND the user didn't request it, assume IG killed it due to scroll drift.
            videoElement.addEventListener('pause', (e) => {
                if (this.isActive && !this.userIntendedPause && !this.isNavigating && !this.isProcessingInteraction) {
                    // console.warn('⚠️ Detected unwanted pause (IG Scroll Drift). Forcing Play & Re-syncing...');
                    videoElement.play().catch(()=>{});
                    // Force re-sync scroll to the current post to make IG happy
                    if (this.activePost.element) {
                        this.activePost.element.scrollIntoView({ behavior: 'auto', block: 'center' });
                    }
                }
            });

            // Force playback rate persistence
            const enforceSpeed = () => {
                if (Math.abs(videoElement.playbackRate - this.savedPlaybackRate) > 0.01) {
                    videoElement.playbackRate = this.savedPlaybackRate;
                }
            };
            videoElement.addEventListener('ratechange', enforceSpeed);
            videoElement.addEventListener('playing', enforceSpeed);
            videoElement.addEventListener('play', enforceSpeed);

            const handleProgressClick = (e) => {
                this.stopAutoScrollTimer();
                this.isProcessingInteraction = true;

                const rect = progressBackground.getBoundingClientRect();
                if (videoElement.duration) videoElement.currentTime = ((e.clientX - rect.left) / rect.width) * videoElement.duration;

                setTimeout(() => {
                    this.isProcessingInteraction = false;
                    this.startAutoScrollTimer();
                }, 300);
            };

            progressContainer.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                 isDragging = true;
                 handleProgressClick(e);
                const onMove = (e) => { if(isDragging) handleProgressClick(e); };
                const onUp = () => { isDragging = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
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
                        if (!isDragging && !isVolumeDragging) {
                            controlsOverlay.style.opacity = '0';
                        }
                    }
                }
            });
            videoContainer.addEventListener('mouseleave', () => {
                isHoveringControls = false;
                if (!isDragging && !isVolumeDragging) {
                    controlsOverlay.style.opacity = '0';
                }
            });

            applyVolumeSettings();
            videoElement.playbackRate = this.savedPlaybackRate;
            speedButton.innerHTML = this.savedPlaybackRate.toFixed(2) + 'x';
            updatePlayPauseIcon();

            const playVideo = async () => {
                try {
                    if (videoElement.readyState < 2) {
                        await new Promise((resolve) => {
                            const onReady = () => {
                                videoElement.removeEventListener('canplay', onReady);
                                videoElement.removeEventListener('loadeddata', onReady);
                                resolve();
                            };
                            videoElement.addEventListener('canplay', onReady);
                            videoElement.addEventListener('loadeddata', onReady);
                            setTimeout(resolve, 1500);
                        });
                    }
                    applyVolumeSettings();
                    videoElement.playbackRate = this.savedPlaybackRate;
                    await videoElement.play();
                    applyVolumeSettings();
                    videoElement.playbackRate = this.savedPlaybackRate;
                } catch (err) {
                    console.warn('Play failed:', err);
                }
            };
            playVideo();
        }

        restoreOriginalMediaPosition() {
            const info = this.activeDisplayedMedia;
            if (!info || (!info.element && !info.placeholder)) {
                this.activeDisplayedMedia = { element: null, placeholder: null, isClone: false };
                if (this.uiElements.mediaWrapper) this.uiElements.mediaWrapper.innerHTML = '';
                return;
            }
            try {
                if (info.isClone) {
                    if (info.element && info.element.parentNode) info.element.parentNode.removeChild(info.element);
                } else {
                    const { element, placeholder } = info;
                    if (element && placeholder && placeholder.parentNode) {
                        if (element.tagName === 'VIDEO') element.pause();
                        element.style.cssText = '';
                        placeholder.parentNode.replaceChild(element, placeholder);
                    } else if (element && element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                }
            } catch (e) {}
            this.activeDisplayedMedia = { element: null, placeholder: null, isClone: false };
            if (this.uiElements.mediaWrapper) this.uiElements.mediaWrapper.innerHTML = '';
        }

        async updateView(postElement) {
            const article = postElement || document.querySelector('div[role="dialog"] article');;
            if (!article) { console.error("UpdateView: Could not find a valid post element."); this.exit(); return; }
            this.activePost.element = article;

            const currentVolume = this.savedVolume;
            const currentMuted = this.savedMuted;
            const currentPlaybackRate = this.savedPlaybackRate;

            const picked = await this.pickActiveMediaWithWait(article, 30, 110);
            if (!picked) { console.warn("Could not identify active media. Skipping display."); return; }
            const mediaEl = picked.el;
            await this.mountMediaForDisplay(mediaEl);

            this.savedVolume = currentVolume;
            this.savedMuted = currentMuted;
            this.savedPlaybackRate = currentPlaybackRate;

            let authorLink = article.querySelector('header a[role="link"]');
            if (!authorLink) {
                authorLink = article.querySelector('a[role="link"] span');
            }
            const author = authorLink?.textContent?.trim() || authorLink?.getAttribute('href')?.replace(/\//g, '') || 'Unknown';
            let caption = '';
            const captionContainer = article.querySelector('h1._aaco, h1, div[class*="Caption"], span[class*="caption"]');
            if (captionContainer) {
                caption = captionContainer.innerHTML || captionContainer.textContent;
            } else {
                const possibleCaption = article.querySelector('div[style*="webkit-box"]');
                if (possibleCaption) caption = possibleCaption.innerHTML;
            }

            this.uiElements.info.innerHTML = `<div class="author-name" style="font-weight: 700; font-size: 16px; margin-bottom: 8px; cursor: pointer;">${author}</div><div style="font-size: 14px; line-height: 1.4; opacity: 0.9; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">${caption}</div>`;
            const authorElement = this.uiElements.info.querySelector('.author-name');
            if (authorElement) {
                authorElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.open(`https://instagram.com/${author}`, '_blank');
                });
            }
            this.updateActionButtonStates();
            this.startAutoScrollTimer();
        }

        async attemptScrollToPost(element, attempts = 0, maxAttempts = 10, interval = 100) {
            if (!element || attempts >= maxAttempts) {
                console.warn('Failed to scroll post into view after multiple attempts.');
                return;
            }
            element.scrollIntoView({ behavior: 'auto', block: 'center' });
            await new Promise(resolve => setTimeout(resolve, interval));
            const rect = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const margin = 50;
            const isInView = rect.top >= -margin && rect.bottom <= viewportHeight + margin;
            if (!isInView) {
                this.attemptScrollToPost(element, attempts + 1, maxAttempts, interval);
            }
        }

        findNextArticle(currentArticle) {
            const allArticles = Array.from(document.querySelectorAll('article'));
            const currentIndex = allArticles.indexOf(currentArticle);
            for (let i = currentIndex + 1; i < allArticles.length; i++) {
                const article = allArticles[i];
                if (article !== currentArticle && this.isValidArticle(article)) {
                    return article;
                }
            }
            return null;
        }

        findPrevArticle(currentArticle) {
            const allArticles = Array.from(document.querySelectorAll('article'));
            const currentIndex = allArticles.indexOf(currentArticle);
            for (let i = currentIndex - 1; i >= 0; i--) {
                const article = allArticles[i];
                if (article !== currentArticle && this.isValidArticle(article)) {
                    return article;
                }
            }
            return null;
        }

        updateActionButtonStates() {
            if (!this.activePost.element) return;
            const isLiked = this.activePost.element.querySelector('section svg[aria-label="Unlike"]');
            const heartPath = this.uiElements.likeButton.querySelector('.heart-path');
            if (isLiked) {
                this.uiElements.likeButton.classList.add('igreels-liked');
                if (heartPath) {
                    heartPath.setAttribute('fill', '#ff306c');
                    heartPath.setAttribute('stroke', '#ff306c');
                }
            } else {
                this.uiElements.likeButton.classList.remove('igreels-liked');
                if (heartPath) {
                    heartPath.setAttribute('fill', 'none');
                    heartPath.setAttribute('stroke', 'white');
                }
            }
            const isSaved = this.activePost.element.querySelector('section svg[aria-label="Remove"]');
            const bookmarkPath = this.uiElements.saveButton.querySelector('.bookmark-path');
            if (isSaved) {
                this.uiElements.saveButton.classList.add('igreels-bookmarked');
                if (bookmarkPath) {
                    bookmarkPath.setAttribute('fill', '#ffc107');
                    bookmarkPath.setAttribute('stroke', '#ffc107');
                }
            } else {
                this.uiElements.saveButton.classList.remove('igreels-bookmarked');
                if (bookmarkPath) {
                    bookmarkPath.setAttribute('fill', 'none');
                    bookmarkPath.setAttribute('stroke', 'white');
                }
            }
            let isFollowing = false;
            const isModal = !!document.querySelector('div[role="dialog"]');
            if (isModal) {
                const headerButtons = this.activePost.element.querySelectorAll('header button');
                for (const btn of headerButtons) {
                    const text = btn.textContent.trim();
                    if (text === 'Following' || text === 'Requested') {
                        isFollowing = true;
                        break;
                    }
                }
            } else {
                const articleHeader = this.activePost.element.querySelector('header');
                if (articleHeader) {
                    const divButtons = articleHeader.querySelectorAll('div[role="button"]');
                    for (const btn of divButtons) {
                        const text = btn.textContent.trim();
                        if (text === 'Following' || text === 'Requested') {
                            isFollowing = true;
                            break;
                        }
                    }
                    if (!isFollowing) {
                        const buttons = articleHeader.querySelectorAll('button');
                        for (const btn of buttons) {
                            const text = btn.textContent.trim();
                            if (text === 'Following' || text === 'Requested') {
                                isFollowing = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (!isFollowing) {
                const followingSvg = this.activePost.element.querySelector('svg[aria-label="Following"]');
                if (followingSvg) {
                    isFollowing = true;
                }
            }
            if (isFollowing) {
                this.uiElements.followButton.classList.add('igreels-following');
            } else {
                this.uiElements.followButton.classList.remove('igreels-following');
            }
        }

        smartNavigate(direction) {
            if (this.skipCarouselMode) {
                this.navigatePost(direction);
                return;
            }
            const mediaContainer = this.activePost.element?.firstElementChild;
            if (!mediaContainer) return;
            const nextButton = mediaContainer.querySelector('button[aria-label="Next"]');
            const prevButton = mediaContainer.querySelector('button[aria-label="Go back"]');
            if (direction === 'next' && nextButton) {
                this.navigateMedia('next');
            } else if (direction === 'prev' && prevButton) {
                this.navigateMedia('prev');
            } else {
                this.navigatePost(direction);
            }
        }

        async navigatePost(direction) {
            if (this.isNavigating) return;
            this.isNavigating = true;
            this.stopAutoScrollTimer();
            this.isProcessingInteraction = true;
            const currentId = this.getMediaIdentifier(this.activeDisplayedMedia.element);
            const dialog = document.querySelector('div[role="dialog"]');
            if (dialog) {
                const svgSelector = direction === 'next' ? 'svg[aria-label="Next"]' : 'svg[aria-label="Go back"]';
                const navButton = Array.from(dialog.querySelectorAll(svgSelector)).find(svg => !svg.closest('article'))?.closest('button');
                if (!navButton) {
                    console.log(`No ${direction} post found.`);
                    this.isNavigating = false;
                    this.isProcessingInteraction = false;
                    this.startAutoScrollTimer();
                    return;
                }
                navButton.click();
                const start = Date.now();
                let success = false;
                while (Date.now() - start < 5000) {
                    await this.sleep(120);
                    const newArticle = document.querySelector('div[role="dialog"] article');
                    if (!newArticle) continue;
                    const picked = await this.pickActiveMediaWithWait(newArticle, 12, 100);
                    const newId = picked ? this.getMediaIdentifier(picked.el) : null;
                    if (newId && newId !== currentId) {
                        await this.updateView(newArticle);
                        success = true;
                        break;
                    }
                }
                if (!success) console.warn('navigatePost: timed out waiting for next post.');
            } else {
                document.body.style.scrollBehavior = 'auto';
                let nextPostElement = null;
                if (direction === 'prev') {
                    nextPostElement = this.findPrevArticle(this.activePost.element);
                } else {
                    nextPostElement = this.findNextArticle(this.activePost.element);
                }
                if (nextPostElement) {
                    await this.attemptScrollToPost(nextPostElement);
                    await this.sleep(650);
                    await this.updateView(nextPostElement);
                } else if (direction === 'next') {
                    console.log('No more visible posts. Scrolling to load more...');
                    // INSTANT LOAD LOGIC: Nudge scroll to wake up loader, then poll for new content
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
                    // Give a small nudge just in case we were already at bottom
                    setTimeout(() => window.scrollBy(0, 100), 50);

                    const start = Date.now();
                    let foundNew = false;
                    // Poll for up to 2.5 seconds, checking every 100ms
                    while (Date.now() - start < 2500) {
                        await this.sleep(100);
                        const newlyLoadedPost = this.findNextArticle(this.activePost.element);
                        if (newlyLoadedPost && newlyLoadedPost !== this.activePost.element) {
                            await this.attemptScrollToPost(newlyLoadedPost);
                            await this.sleep(300); // Short settle time
                            await this.updateView(newlyLoadedPost);
                            foundNew = true;
                            break;
                        }
                    }
                    if (!foundNew) console.log('No new posts found after waiting.');
                }
            }
            this.isNavigating = false;
            this.isProcessingInteraction = false;
            this.startAutoScrollTimer();
        }

        async navigateMedia(direction) {
            if (this.isNavigating) return;
            this.isNavigating = true;
            this.stopAutoScrollTimer();
            this.isProcessingInteraction = true;
            const mediaContainer = this.activePost.element?.firstElementChild;
            if (!mediaContainer) {
                this.isNavigating = false;
                this.isProcessingInteraction = false;
                this.startAutoScrollTimer();
                return;
            }
            const selector = direction === 'next' ? 'button[aria-label="Next"]' : 'button[aria-label="Go back"]';
            const button = mediaContainer.querySelector(selector);
            if (!button) {
                this.isNavigating = false;
                this.isProcessingInteraction = false;
                this.startAutoScrollTimer();
                return;
            }
            const currentId = this.getMediaIdentifier(this.activeDisplayedMedia.element);
            button.click();
            const start = Date.now();
            let success = false;
            while (Date.now() - start < 3500) {
                await this.sleep(120);
                const picked = await this.pickActiveMediaWithWait(this.activePost.element, 10, 100);
                if (!picked) continue;
                const newId = this.getMediaIdentifier(picked.el);
                if (newId && newId !== currentId) {
                    await this.updateView(this.activePost.element);
                    success = true;
                    break;
                }
            }
            if (!success) { await this.sleep(260); await this.updateView(this.activePost.element); }
            this.isNavigating = false;
            this.isProcessingInteraction = false;
            this.startAutoScrollTimer();
        }

        async toggleAction(type) {
            if (!this.activePost.element) return;
            const selectors = {
                like: 'section svg[aria-label="Like"], section svg[aria-label="Unlike"]',
                save: 'section svg[aria-label="Save"], section svg[aria-label="Remove"]'
            };
            const uiButton = type === 'like' ? this.uiElements.likeButton : this.uiElements.saveButton;
            uiButton.style.transform = 'scale(1.3)'; uiButton.style.filter = 'brightness(1.5)';
            const svgElement = this.activePost.element.querySelector(selectors[type]);
            if (!svgElement) { console.warn(`toggleAction: ${type} SVG not found`); return; }
            let clickableElement = svgElement.closest('[role="button"], button');
            if (clickableElement) {
                clickableElement.click();
                await this.sleep(500);
                this.updateActionButtonStates();
            } else {
                console.warn(`toggleAction: No clickable element found for ${type}`);
            }
            setTimeout(() => { uiButton.style.transform = 'scale(1)'; uiButton.style.filter = 'brightness(1)'; }, 200);
        }

        async toggleFollow() {
            if (!this.activePost.element) return;
            this.uiElements.followButton.style.transform = 'scale(1.3)';
            this.uiElements.followButton.style.filter = 'brightness(1.5)';
            const isModal = !!document.querySelector('div[role="dialog"]');
            let followButton = null;
            if (isModal) {
                const headerButtons = this.activePost.element.querySelectorAll('header button');
                for (const btn of headerButtons) {
                    const text = btn.textContent.trim();
                    if (text === 'Follow' || text === 'Following' || text === 'Unfollow' || text === 'Requested') {
                        followButton = btn;
                        break;
                    }
                }
            } else {
                const articleHeader = this.activePost.element.querySelector('header');
                if (articleHeader) {
                    const divButtons = articleHeader.querySelectorAll('div[role="button"]');
                    for (const btn of divButtons) {
                        const text = btn.textContent.trim();
                        if (text === 'Follow' || text === 'Following' || text === 'Unfollow' || text === 'Requested') {
                            followButton = btn;
                            break;
                        }
                    }
                    if (!followButton) {
                        const buttons = articleHeader.querySelectorAll('button');
                        for (const btn of buttons) {
                            const text = btn.textContent.trim();
                            if (text === 'Follow' || text === 'Following' || text.includes('Follow')) {
                                followButton = btn;
                                break;
                            }
                        }
                    }
                }
            }
            if (!followButton) {
                const allDivButtons = this.activePost.element.querySelectorAll('div[role="button"]');
                for (const btn of allDivButtons) {
                    const text = btn.textContent.trim();
                    if (text === 'Follow' || text === 'Following') {
                        followButton = btn;
                        break;
                    }
                }
            }
            if (!followButton) {
                const allButtons = this.activePost.element.querySelectorAll('button');
                for (const btn of allButtons) {
                    const text = btn.textContent.trim();
                    if (text === 'Follow' || text === 'Following') {
                        followButton = btn;
                        break;
                    }
                }
            }
            if (!followButton) {
                const followSvg = this.activePost.element.querySelector('svg[aria-label="Follow"], svg[aria-label="Following"]');
                if (followSvg) {
                    followButton = followSvg.closest('button, div[role="button"]');
                }
            }
            if (followButton) {
                console.log('Found follow button:', followButton.textContent.trim(), 'Type:', followButton.tagName);
                followButton.click();
                await this.sleep(500);
                this.updateActionButtonStates();
            } else {
                console.warn('toggleFollow: Follow button not found. Page context:', isModal ? 'modal' : 'feed');
            }
            setTimeout(() => {
                this.uiElements.followButton.style.transform = 'scale(1)';
                this.uiElements.followButton.style.filter = 'brightness(1)';
            }, 200);
        }

        handleKeydown(e) {
            if (e.key.toLowerCase() === 'x') {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (this.isActive) {
                    this.exit();
                } else {
                    this.armFeedStart();
                }
                return;
            }

            if (!this.isActive) return;

            if (/TEXTAREA|INPUT/.test(document.activeElement.tagName)) {
                if (e.key.toLowerCase() === 'q' || e.key === 'Escape') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.exit();
                }
                return;
            }

            try { e.preventDefault(); e.stopImmediatePropagation(); } catch (err) {}
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            const keyMap = {
                'ArrowUp': () => this.smartNavigate('prev'),
                'ArrowDown': () => this.smartNavigate('next'),
                'ArrowLeft': () => this.navigateMedia('prev'),
                'ArrowRight': () => this.navigateMedia('next'),
                'l': () => this.toggleAction('like'),
                's': () => this.toggleAction('save'),
                'f': () => this.toggleFollow(),
                ' ': () => {
                    this.stopAutoScrollTimer();
                    this.isProcessingInteraction = true;
                    const video = this.uiElements.mediaWrapper.querySelector('video');
                    if (video) {
                        if (video.paused) {
                            this.userIntendedPause = false;
                            video.play();
                        } else {
                            this.userIntendedPause = true;
                            video.pause();
                        }
                    }
                    setTimeout(() => {
                        this.isProcessingInteraction = false;
                        const videoCheck = this.uiElements.mediaWrapper.querySelector('video');
                        if (videoCheck && !videoCheck.paused) {
                            this.startAutoScrollTimer();
                        }
                    }, 300);
                },
                ',': () => this.scrubVideo(-5),
                '<': () => this.scrubVideo(-5),
                '.': () => this.scrubVideo(5),
                '>': () => this.scrubVideo(5),
                'Escape': () => this.exit(),
                'q': () => this.exit(),
            };
            const fn = keyMap[key];
            if (fn) fn();
        }

        scrubVideo(seconds) {
            this.stopAutoScrollTimer();
            this.isProcessingInteraction = true;
            const video = this.uiElements.mediaWrapper.querySelector('video');
            if (video) {
                video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
            }
            setTimeout(() => {
                this.isProcessingInteraction = false;
                this.startAutoScrollTimer();
            }, 300);
        }
    }

    if (window.instagramFeedInstance) {
        try { window.instagramFeedInstance.exit(); } catch (e) {}
    }
    window.instagramFeedInstance = new InstagramFeed();
    window.instagramFeedInstance.init();

})();