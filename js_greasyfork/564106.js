// ==UserScript==
// @name         R34 App - Ultimate Experience (v21 - Pause Fix)
// @namespace    http://tampermonkey.net/
// @version      21.0
// @description  Strict Autoplay cut, Fixed Pause logic, Tags UI z-index, Video Controls, Scroll Mode
// @author       You
// @match        *://r34.app/*
// @match        *://rule34.xxx/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564106/R34%20App%20-%20Ultimate%20Experience%20%28v21%20-%20Pause%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564106/R34%20App%20-%20Ultimate%20Experience%20%28v21%20-%20Pause%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 0. Boot Configuration ---
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    // --- State Management ---
    const STATE = {
        currentIndex: 0,
        isOverlayActive: false,
        isIndexCollapsed: false,
        scaleMode: 'contain',
        scrollRafId: null,
        autoPlayTimeout: null,
        observer: null,
        isDragging: false,
        isManuallyPaused: false // New flag to prevent fighting the user
    };

    // --- 1. CSS Injection ---
    const styles = `
        /* Controls */
        #r34-controls {
            position: fixed; bottom: 60px; right: 30px;
            display: flex; flex-direction: column; gap: 12px;
            z-index: 2000000000;
        }
        .r34-btn {
            background: rgba(0, 0, 0, 0.6); color: white;
            border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 50%;
            width: 55px; height: 55px; font-size: 24px;
            cursor: pointer; backdrop-filter: blur(8px);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .r34-btn:hover { background: rgba(0, 0, 0, 0.8); transform: scale(1.1); border-color: #fff; }
        .r34-btn.active { background: #48bb78; border-color: #48bb78; box-shadow: 0 0 15px rgba(72, 187, 120, 0.5); }

        /* Index Display */
        #r34-index-display {
            position: fixed; top: 15px; right: 15px;
            background: rgba(0, 0, 0, 0.7); color: white;
            padding: 6px 12px; border-radius: 8px;
            font-family: 'Courier New', monospace; font-weight: bold; font-size: 14px;
            cursor: pointer; z-index: 2000000000;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease; user-select: none;
            backdrop-filter: blur(4px);
        }
        #r34-index-display.collapsed {
            width: 8px; height: 8px; padding: 0; overflow: hidden; opacity: 0.5;
            background: white; border-radius: 50%; border: none;
        }

        /* Overlay */
        #r34-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: black;
            z-index: 1999999999;
            display: none; align-items: center; justify-content: center;
            flex-direction: column; overflow: hidden;
        }
        #r34-overlay.visible { display: flex; }
        #r34-overlay.fit-width {
            display: block; overflow-y: auto; overflow-x: hidden;
        }

        /* Media */
        .r34-media {
            max-width: 100%; max-height: 100%;
            width: 100%; height: 100%;
            object-fit: contain; outline: none; display: none;
        }

        #r34-overlay.fit-width .r34-media {
            width: 100%; height: auto;
            max-width: none; max-height: none;
            object-fit: default; display: none; margin: 0 auto;
        }
        #r34-overlay.fit-width .r34-media[style*="display: block"] {
            display: block !important;
        }

        #r34-loading {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            color: #888; font-family: sans-serif; pointer-events: none;
        }

        /* Video UI */
        #r34-video-ui {
            position: fixed; bottom: 0; left: 0; width: 100%;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
            padding: 10px 20px 25px 20px;
            display: none; flex-direction: row; align-items: center; gap: 15px;
            z-index: 2000000000;
        }

        #r34-seek-bar {
            flex-grow: 1; -webkit-appearance: none; appearance: none;
            height: 4px; background: rgba(255,255,255,0.3);
            border-radius: 2px; outline: none; cursor: pointer; transition: height 0.2s;
        }
        #r34-seek-bar:hover { height: 6px; }
        #r34-seek-bar::-webkit-slider-thumb {
            -webkit-appearance: none; appearance: none;
            width: 12px; height: 12px; border-radius: 50%;
            background: #48bb78; cursor: pointer; transition: transform 0.2s;
        }
        #r34-seek-bar::-webkit-slider-thumb:hover { transform: scale(1.3); }
        #r34-time-display {
            color: white; font-family: monospace; font-size: 13px;
            min-width: 100px; text-align: right; text-shadow: 0 1px 2px black;
        }

        /* Z-Index Fixes */
        div[role="dialog"],
        div[id^="headlessui-dialog"],
        div[id^="headlessui-portal"],
        div[class*="z-50"],
        div[class*="z-[100]"] {
            z-index: 2147483647 !important;
            position: relative;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);


    // --- 2. DOM Helpers ---

    function getCenteredPostIndex() {
        const el = document.elementFromPoint(window.innerWidth/2, window.innerHeight/2);
        if (!el) return -1;
        const li = el.closest('li[data-index]');
        return li ? parseInt(li.getAttribute('data-index')) : -1;
    }

    function getPostByIndex(idx) {
        return document.querySelector(`li[data-index="${idx}"]`);
    }

    // --- 3. Strict Playback Control ---

    function stopAllPlayback() {
        const ovVid = document.getElementById('r34-player-video');
        if (ovVid) ovVid.pause();

        document.querySelectorAll('video').forEach(v => {
            if (!v.paused) v.pause();
        });
    }

    // --- 4. Navigation ---

    function navigateTo(index) {
        if (index < 0) index = 0;

        stopAllPlayback();

        // Reset manual pause state because we are moving to a new video
        STATE.isManuallyPaused = false;
        STATE.currentIndex = index;

        updateUI();

        const post = getPostByIndex(index);

        if (post) {
            post.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            const approxY = index * 800;
            window.scrollTo({ top: approxY, behavior: 'auto' });
        }

        if (STATE.isOverlayActive) {
            document.getElementById('r34-overlay').scrollTop = 0;
            syncOverlay();
        } else {
            if (STATE.autoPlayTimeout) clearTimeout(STATE.autoPlayTimeout);
            STATE.autoPlayTimeout = setTimeout(handleBackgroundAutoplay, 250);
        }
    }

    // --- 5. Sync Engine ---

    function syncOverlay() {
        const post = getPostByIndex(STATE.currentIndex);
        const ovVid = document.getElementById('r34-player-video');
        const ovImg = document.getElementById('r34-player-image');
        const loader = document.getElementById('r34-loading');
        const videoUI = document.getElementById('r34-video-ui');

        ovVid.style.display = 'none';
        ovImg.style.display = 'none';
        videoUI.style.display = 'none';

        loader.style.display = 'block';
        loader.innerText = `Seeking #${STATE.currentIndex}...`;

        ovVid.pause();

        if (!post) return;

        const v = post.querySelector('video');
        const i = post.querySelector('img');

        if (v) {
            ovVid.style.display = 'block';
            videoUI.style.display = 'flex';

            ovVid.src = v.currentSrc || v.src;
            ovVid.muted = false;

            if (v.currentTime > 0) ovVid.currentTime = v.currentTime;
            else ovVid.currentTime = 0;

            // Only play if not paused manually
            if (!STATE.isManuallyPaused) {
                ovVid.play().catch(() => { ovVid.muted = true; ovVid.play(); });
            }
            loader.style.display = 'none';
        } else if (i) {
            ovImg.style.display = 'block';
            ovImg.src = i.src;
            loader.style.display = 'none';
        }
    }

    function startObserver() {
        if (STATE.observer) return;
        STATE.observer = new MutationObserver(() => {
            if (STATE.isOverlayActive) {
                const post = getPostByIndex(STATE.currentIndex);
                if (post && document.getElementById('r34-loading').style.display !== 'none') {
                    syncOverlay();
                }
            } else {
                if (STATE.autoPlayTimeout) clearTimeout(STATE.autoPlayTimeout);
                STATE.autoPlayTimeout = setTimeout(handleBackgroundAutoplay, 300);
            }
        });
        STATE.observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- 6. UI & Controls ---

    function updateUI() {
        const display = document.getElementById('r34-index-display');
        display.innerText = STATE.isIndexCollapsed ? '' : `#${STATE.currentIndex}`;
        if(STATE.isIndexCollapsed) display.classList.add('collapsed');
        else display.classList.remove('collapsed');
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    function setupVideoControls(videoElement) {
        const seekBar = document.getElementById('r34-seek-bar');
        const timeDisplay = document.getElementById('r34-time-display');

        videoElement.addEventListener('timeupdate', () => {
            if (!STATE.isDragging) {
                const val = (videoElement.currentTime / videoElement.duration) * 100;
                if (!isNaN(val)) seekBar.value = val;
                timeDisplay.innerText = `${formatTime(videoElement.currentTime)} / ${formatTime(videoElement.duration)}`;
            }
        });

        seekBar.addEventListener('input', () => {
            STATE.isDragging = true;
            const time = (seekBar.value / 100) * videoElement.duration;
            timeDisplay.innerText = `${formatTime(time)} / ${formatTime(videoElement.duration)}`;
        });

        seekBar.addEventListener('change', () => {
            STATE.isDragging = false;
            const time = (seekBar.value / 100) * videoElement.duration;
            videoElement.currentTime = time;
        });
    }

    function togglePlay() {
        // Toggle the manual pause state
        STATE.isManuallyPaused = !STATE.isManuallyPaused;

        if (STATE.isOverlayActive) {
            const v = document.getElementById('r34-player-video');
            if (v.style.display === 'block') {
                if (STATE.isManuallyPaused) v.pause();
                else v.play();
            }
        } else {
            const post = getPostByIndex(STATE.currentIndex);
            if (post) {
                const btn = post.querySelector('.fluid_control_playpause');
                if (btn) btn.click();
                else {
                    const v = post.querySelector('video');
                    if (v) {
                        if (STATE.isManuallyPaused) v.pause();
                        else v.play();
                    }
                }
            }
        }
    }

    function toggleOverlay() {
        STATE.isOverlayActive = !STATE.isOverlayActive;
        const ov = document.getElementById('r34-overlay');
        const btn = document.getElementById('r34-mode-btn');

        if (STATE.isOverlayActive) {
            ov.classList.add('visible');
            btn.classList.add('active');
            document.body.style.overflow = 'hidden';
            syncOverlay();

            if (STATE.scaleMode === 'cover') ov.classList.add('fit-width');
            else ov.classList.remove('fit-width');

        } else {
            ov.classList.remove('visible');
            btn.classList.remove('active');
            document.body.style.overflow = '';
            document.getElementById('r34-player-video').pause();
            navigateTo(STATE.currentIndex);
        }
    }

    function toggleScaleMode() {
        const ov = document.getElementById('r34-overlay');
        const btn = document.getElementById('r34-scale-btn');

        if (STATE.scaleMode === 'contain') {
            STATE.scaleMode = 'cover';
            ov.classList.add('fit-width');
            btn.innerHTML = '↔️';
            btn.classList.add('active');
            btn.title = "Mode: Fit Width (Scroll Enabled)";
        } else {
            STATE.scaleMode = 'contain';
            ov.classList.remove('fit-width');
            btn.innerHTML = '↕️';
            btn.classList.remove('active');
            btn.title = "Mode: Fit Screen (Wheel Nav)";
            ov.scrollTop = 0;
        }
    }

    function triggerAction(token) {
        const post = getPostByIndex(STATE.currentIndex);
        if (!post) return;
        let btn = Array.from(post.querySelectorAll('button')).find(b =>
            b.innerText.toLowerCase().includes(token.toLowerCase()) && b.innerText.trim().length > 0
        );
        if (btn) btn.click();
    }

    function handleBackgroundAutoplay() {
        if (STATE.isOverlayActive) return;

        // If user manually paused, do NOT restart video
        if (STATE.isManuallyPaused) return;

        const post = getPostByIndex(STATE.currentIndex);
        if (post) {
            const v = post.querySelector('video');
            document.querySelectorAll('video').forEach(vid => { if (vid !== v) vid.pause(); });

            if (v && v.paused) {
                v.muted = false; v.loop = true;
                v.play().catch(() => { v.muted = true; v.play(); });
            }
        }
    }

    // --- 7. Init ---

    function init() {
        const c = document.createElement('div');
        c.id = 'r34-controls';

        const makeBtn = (icon, title, fn) => {
            const b = document.createElement('button');
            b.className = 'r34-btn'; b.innerHTML = icon; b.title = title;
            b.onclick = (e) => { e.stopPropagation(); fn(e); };
            return b;
        };

        c.append(
            makeBtn('🔍', 'Search', () => document.querySelector('button[aria-label="Search posts"]')?.click()),
            makeBtn('🏷️', 'Tags', () => triggerAction('tags')),
            (function(){
                const b = makeBtn('↕️', 'Mode: Fit Screen', toggleScaleMode);
                b.id = 'r34-scale-btn';
                return b;
            })(),
            makeBtn('⬇️', 'Download', () => triggerAction('button[aria-label="Download post"]')),
            (function(){
                const b = makeBtn('📱', 'TikTok Mode', toggleOverlay);
                b.id = 'r34-mode-btn'; return b;
            })(),
            makeBtn('⏯', 'Play/Pause', togglePlay)
        );
        document.body.appendChild(c);

        const disp = document.createElement('div');
        disp.id = 'r34-index-display';
        disp.onclick = () => { STATE.isIndexCollapsed = !STATE.isIndexCollapsed; updateUI(); };
        document.body.appendChild(disp);
        updateUI();

        const ov = document.createElement('div');
        ov.id = 'r34-overlay';

        const v = document.createElement('video');
        v.id = 'r34-player-video'; v.className = 'r34-media'; v.loop = true; v.onclick = togglePlay;
        const i = document.createElement('img');
        i.id = 'r34-player-image'; i.className = 'r34-media';
        const l = document.createElement('div');
        l.id = 'r34-loading';

        const vidUI = document.createElement('div');
        vidUI.id = 'r34-video-ui';

        const seek = document.createElement('input');
        seek.type = 'range'; seek.id = 'r34-seek-bar'; seek.min = 0; seek.max = 100; seek.value = 0;

        const time = document.createElement('div');
        time.id = 'r34-time-display'; time.innerText = '0:00 / 0:00';

        vidUI.append(seek, time);
        ov.append(l, v, i, vidUI);
        document.body.appendChild(ov);

        setupVideoControls(v);
        startObserver();
        setTimeout(() => navigateTo(0), 500);
    }

    // --- 8. Listeners ---

    window.addEventListener('scroll', () => {
        if (!STATE.scrollRafId) {
            STATE.scrollRafId = requestAnimationFrame(() => {
                if (!STATE.isOverlayActive) {
                    const idx = getCenteredPostIndex();
                    if (idx !== -1 && idx !== STATE.currentIndex) {
                        STATE.currentIndex = idx;
                        // Index changed, so reset manual pause state
                        STATE.isManuallyPaused = false;
                        updateUI();
                        if (STATE.autoPlayTimeout) clearTimeout(STATE.autoPlayTimeout);
                        STATE.autoPlayTimeout = setTimeout(handleBackgroundAutoplay, 250);
                    }
                }
                STATE.scrollRafId = null;
            });
        }
    }, { passive: true });

    window.addEventListener('wheel', (e) => {
        if (!STATE.isOverlayActive) return;
        if (STATE.scaleMode === 'cover') { e.stopPropagation(); return; }

        e.preventDefault();
        e.stopImmediatePropagation();

        if (STATE.autoPlayTimeout) clearTimeout(STATE.autoPlayTimeout);
        STATE.autoPlayTimeout = setTimeout(() => {
            if (e.deltaY > 0) navigateTo(STATE.currentIndex + 1);
            else if (e.deltaY < 0) navigateTo(STATE.currentIndex - 1);
        }, 50);
    }, { passive: false });

    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;

        if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); navigateTo(STATE.currentIndex + 1); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); navigateTo(STATE.currentIndex - 1); }
    });

    window.addEventListener('load', init);

})();