// ==UserScript==
// @name        Universal Video Maximizer
// @namespace    http://tampermonkey.net/
// @version      7.8
// @description  Ctrl+Shift+Enter = Maximize video. Uses the high-quality UI you like with custom icons.
// @author       Kristijan1001
// @match        *://*/*
// @license MIT
// @grant        none
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iNiIgZmlsbD0iIzE1MTUxNSIvPjxwYXRoIGQ9Ik0xMCA4VjE2TDE2IDEyTDEwIDhaIiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560411/Universal%20Video%20Maximizer.user.js
// @updateURL https://update.greasyfork.org/scripts/560411/Universal%20Video%20Maximizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let enabled = false;
    let overlay = null;
    let video = null;
    let originalParent = null;
    let originalNextSibling = null;
    let originalVideoStyles = null;

    // Persistent settings
    let savedVolume = parseFloat(localStorage.getItem('univ_max_volume')) || 0.7;
    let savedMuted = localStorage.getItem('univ_max_muted') === 'true';
    let savedPlaybackRate = parseFloat(localStorage.getItem('univ_max_rate')) || 1.0;

    const OVERLAY_ID = 'universal-video-overlay';

    // --- 1. SMART DETECTION (No Ads) ---
    const MIN_WIDTH = 250;
    const MIN_HEIGHT = 150;
    const MIN_DURATION = 5;

    function isSignificantVideo(el) {
        const rect = el.getBoundingClientRect();
        if (rect.width < MIN_WIDTH || rect.height < MIN_HEIGHT) return false;
        if (rect.width === 0 || rect.height === 0 || el.style.display === 'none' || el.style.visibility === 'hidden') return false;
        if (el.tagName === 'VIDEO' && el.duration && el.duration < MIN_DURATION && el.duration !== Infinity) return false;
        const className = (el.className || '').toLowerCase();
        if (className.includes('ad-preview') || className.includes('taboola') || className.includes('outbrain')) return false;
        return true;
    }

    function findMainVideo() {
        // 1. Try Video Tags
        const videos = Array.from(document.querySelectorAll('video'));
        let bestCandidate = null;
        let maxArea = 0;

        videos.forEach(v => {
            if (!isSignificantVideo(v)) return;
            const rect = v.getBoundingClientRect();
            const area = rect.width * rect.height;
            if (area > maxArea) {
                maxArea = area;
                bestCandidate = v;
            }
        });

        // 2. Try Iframes if no video found
        if (!bestCandidate) {
            const iframes = Array.from(document.querySelectorAll('iframe'));
            iframes.forEach(iframe => {
                if (!isSignificantVideo(iframe)) return;
                const src = (iframe.src || '').toLowerCase();
                const isPlayer = src.includes('player') || src.includes('embed') || src.includes('video');
                if (isPlayer) {
                    const rect = iframe.getBoundingClientRect();
                    const area = rect.width * rect.height;
                    if (area > maxArea) {
                        maxArea = area;
                        bestCandidate = iframe;
                    }
                }
            });
        }
        return bestCandidate;
    }

    // --- 2. FANCY UI STYLES (Ported from IG++) ---
    function injectStyles() {
        if (document.getElementById('univ-video-styles')) return;
        const css = `
            #${OVERLAY_ID} {
                position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important;
                background: #000 !important; z-index: 2147483647 !important; display: flex !important;
                align-items: center !important; justify-content: center !important; overflow: hidden !important;
            }
            .custom-video-container {
                position: relative; width: 100%; height: 100%; background: black; display: flex; align-items: center; justify-content: center;
            }

            /* Bottom Overlay Gradient */
            .video-controls-overlay {
                position: absolute; bottom: 0; left: 0; right: 0;
                background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
                padding: 12px 30px 20px 20px; opacity: 0; transition: opacity 0.3s ease;
                pointer-events: all; z-index: 1000010;
            }
            .video-controls-overlay:hover { opacity: 1; }

            /* Orange Gradient Progress Bar */
            .progress-container {
                width: 100%; height: 14px; background: transparent; border-radius: 10px; margin-bottom: 6px;
                cursor: pointer; position: relative; display: flex; align-items: center; padding: 5px 0;
            }
            .progress-background {
                width: 100%; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; position: relative;
            }
            .progress-fill {
                height: 100%; background: linear-gradient(90deg, #f09433, #e6683c); border-radius: 3px;
                width: 0%; transition: width 0.1s ease; position: relative;
            }
            .progress-thumb {
                position: absolute; right: -5px; top: 50%; transform: translateY(-50%); width: 12px; height: 12px;
                background: #f09433; border-radius: 50%; opacity: 0; transition: opacity 0.3s ease;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            }
            .video-controls-overlay:hover .progress-thumb { opacity: 1; }

            /* Controls Row */
            .controls-container { display: flex; align-items: center; gap: 15px; pointer-events: all; }

            /* FANCY Play Button */
            .fancy-play-btn {
                background: rgba(255,255,255,0.15);
                border: 1px solid rgba(255,255,255,0.2);
                color: white;
                cursor: pointer;
                padding: 0;
                border-radius: 50%;
                width: 45px; height: 45px;
                display: flex; align-items: center; justify-content: center;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                flex-shrink: 0;
            }
            .fancy-play-btn:hover {
                background: rgba(255,255,255,0.25);
                border-color: rgba(255,255,255,0.4);
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0,0,0,0.4);
            }
            .fancy-play-btn:active { transform: scale(0.95); }
            .fancy-play-btn svg { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4)); }

            /* Time & Speed */
            .time-display { color: white; font-size: 12px; font-weight: 600; min-width: 80px; text-shadow: 0 1px 2px rgba(0,0,0,0.8); }
            .speed-btn {
                background: rgba(255,255,255,0.2); border: none; color: white; font-size: 11px; font-weight: 600;
                cursor: pointer; padding: 4px 10px; border-radius: 12px; transition: all 0.3s ease; min-width: 40px;
            }
            .speed-btn:hover { background: rgba(255,255,255,0.3); }

            /* Volume */
            .volume-container { display: flex; align-items: center; gap: 10px; margin-left: auto; margin-right: 15px; }
            .mute-btn { background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 5px; transition: transform 0.2s; }
            .mute-btn:hover { transform: scale(1.1); }

            .volume-slider { width: 80px; height: 20px; display: flex; align-items: center; cursor: pointer; position: relative; }
            .volume-track { width: 100%; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; position: relative; }
            .volume-fill { height: 100%; background: linear-gradient(90deg, #f09433, #e6683c); border-radius: 2px; position: relative; }
            .volume-thumb {
                position: absolute; top: 50%; right: -6px; transform: translateY(-50%); width: 12px; height: 12px;
                background: white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3); cursor: grab;
            }

            /* Fancy Exit Button (Top Right) */
            .fancy-exit-btn {
                position: absolute; top: 20px; right: 20px; z-index: 1000020;
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%);
                border: 1px solid rgba(239, 68, 68, 0.6);
                color: white; padding: 8px 16px; border-radius: 16px; cursor: pointer;
                font-size: 13px; font-weight: 700; backdrop-filter: blur(20px);
                box-shadow: 0 8px 32px rgba(239, 68, 68, 0.35);
                transition: all 0.4s ease; display: flex; align-items: center; gap: 6px;
            }
            .fancy-exit-btn:hover {
                transform: translateY(-2px) scale(1.05);
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.5) 0%, rgba(220, 38, 38, 0.5) 100%);
            }
            .fancy-exit-btn:active { transform: scale(0.98); }

            html:has(#${OVERLAY_ID}) { overflow: hidden !important; }
        `;
        const style = document.createElement('style');
        style.id = 'univ-video-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // --- 3. CREATE CONTROLS (DOM) ---

    function createCustomControls(videoElement) {
        const container = document.createElement('div');
        container.className = 'custom-video-container';

        // Override video styles to fit overlay
        videoElement.style.cssText = `
            width: 100vw !important; height: 100vh !important; max-width: 100vw !important; max-height: 100vh !important;
            object-fit: contain !important; display: block !important; background: black !important; margin: 0 !important;
            border-radius: 0 !important;
        `;
        videoElement.controls = false;
        videoElement.muted = savedMuted;
        videoElement.volume = savedVolume;
        videoElement.playbackRate = savedPlaybackRate;

        // Overlay Wrapper
        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'video-controls-overlay';

        // Progress Bar
        const progContainer = document.createElement('div');
        progContainer.className = 'progress-container';
        progContainer.innerHTML = `
            <div class="progress-background">
                <div class="progress-fill"><div class="progress-thumb"></div></div>
            </div>
        `;
        const progFill = progContainer.querySelector('.progress-fill');

        // Controls Row
        const controlsRow = document.createElement('div');
        controlsRow.className = 'controls-container';

        // Animated Play Button (SVG)
        const playBtn = document.createElement('button');
        playBtn.className = 'fancy-play-btn';
        playBtn.innerHTML = `
            <svg class="play-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5v14l11-7z" fill="white"/>
            </svg>
            <svg class="pause-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:none;">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="white"/>
            </svg>
        `;

        // Time Display
        const timeDisp = document.createElement('div');
        timeDisp.className = 'time-display';
        timeDisp.textContent = '0:00 / 0:00';

        // Speed Button
        const speedBtn = document.createElement('button');
        speedBtn.className = 'speed-btn';
        speedBtn.innerHTML = savedPlaybackRate.toFixed(2) + 'x';
        speedBtn.title = 'Speed';

        // Volume
        const volContainer = document.createElement('div');
        volContainer.className = 'volume-container';

        const muteBtn = document.createElement('button');
        muteBtn.className = 'mute-btn';
        muteBtn.innerHTML = savedMuted ? '🔇' : '🔊';

        const volSlider = document.createElement('div');
        volSlider.className = 'volume-slider';
        volSlider.innerHTML = `
            <div class="volume-track">
                <div class="volume-fill" style="width: ${savedVolume * 100}%">
                    <div class="volume-thumb"></div>
                </div>
            </div>
        `;
        const volFill = volSlider.querySelector('.volume-fill');

        // Append to Overlay
        volContainer.append(muteBtn, volSlider);
        controlsRow.append(playBtn, timeDisp, speedBtn, volContainer);
        overlayDiv.append(progContainer, controlsRow);

        // Exit Button
        const exitBtn = document.createElement('button');
        exitBtn.className = 'fancy-exit-btn';
        exitBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            Exit
        `;
        exitBtn.onclick = removeMaxMode;

        container.append(videoElement, overlayDiv, exitBtn);

        // --- Logic Handlers ---

        // Toggle Play
        const updatePlayIcon = () => {
            const isPaused = videoElement.paused;
            playBtn.querySelector('.play-icon').style.display = isPaused ? 'block' : 'none';
            playBtn.querySelector('.pause-icon').style.display = isPaused ? 'none' : 'block';
        };

        const togglePlay = () => {
            if (videoElement.paused) videoElement.play().catch(e => console.warn(e));
            else videoElement.pause();
        };

        playBtn.onclick = (e) => { e.stopPropagation(); togglePlay(); };
        videoElement.onclick = (e) => {
            if(!e.target.closest('.video-controls-overlay')) togglePlay();
        };
        videoElement.addEventListener('play', updatePlayIcon);
        videoElement.addEventListener('pause', updatePlayIcon);
        updatePlayIcon();

        // Progress
        const updateTime = () => {
            if (videoElement.duration) {
                const pct = (videoElement.currentTime / videoElement.duration) * 100;
                progFill.style.width = pct + '%';
                const fmt = s => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;
                timeDisp.textContent = `${fmt(videoElement.currentTime)} / ${fmt(videoElement.duration)}`;
            }
        };
        videoElement.addEventListener('timeupdate', updateTime);

        // Seek
        let isDragging = false;
        const seek = (e) => {
            const rect = progContainer.querySelector('.progress-background').getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            if (videoElement.duration) videoElement.currentTime = pct * videoElement.duration;
        };
        progContainer.onmousedown = (e) => {
            isDragging = true; seek(e);
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', onUp);
        };
        const onDrag = (e) => { if(isDragging) seek(e); };
        const onUp = () => { isDragging = false; document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', onUp); };

        // Volume
        const updateVol = (e) => {
            const rect = volSlider.querySelector('.volume-track').getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            videoElement.volume = pct;
            if(pct > 0) videoElement.muted = false;

            savedVolume = pct;
            savedMuted = videoElement.muted;
            localStorage.setItem('univ_max_volume', savedVolume);
            localStorage.setItem('univ_max_muted', savedMuted);

            volFill.style.width = (pct * 100) + '%';
            muteBtn.innerHTML = videoElement.muted || pct === 0 ? '🔇' : '🔊';
        };

        let isVolDragging = false;
        volSlider.onmousedown = (e) => {
            isVolDragging = true; updateVol(e);
            document.addEventListener('mousemove', onVolDrag);
            document.addEventListener('mouseup', onVolUp);
        };
        const onVolDrag = (e) => { if(isVolDragging) updateVol(e); };
        const onVolUp = () => { isVolDragging = false; document.removeEventListener('mousemove', onVolDrag); document.removeEventListener('mouseup', onVolUp); };

        muteBtn.onclick = (e) => {
            e.stopPropagation();
            videoElement.muted = !videoElement.muted;
            muteBtn.innerHTML = videoElement.muted ? '🔇' : '🔊';
        };

        // Speed
        speedBtn.onclick = (e) => {
            e.stopPropagation();
            const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3.0, 3.5, 4.0];
            const idx = speeds.indexOf(savedPlaybackRate);
            savedPlaybackRate = speeds[(idx + 1) % speeds.length];
            videoElement.playbackRate = savedPlaybackRate;
            localStorage.setItem('univ_max_rate', savedPlaybackRate);
            speedBtn.innerHTML = savedPlaybackRate.toFixed(2) + 'x';
        };

        return container;
    }

    // --- 4. CORE LOGIC ---

    function createOverlay() {
        if (overlay) return overlay;
        injectStyles();
        overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;
        document.documentElement.appendChild(overlay);
        return overlay;
    }

    function applyMaxMode() {
        if (enabled) { removeMaxMode(); return; }

        video = findMainVideo();
        if (!video) {
            console.log("Universal Maximizer: No valid video found.");
            return;
        }

        // Iframe Fallback
        if (video.tagName === 'IFRAME') {
            enabled = true;
            originalParent = video.parentElement;
            originalNextSibling = video.nextSibling;
            originalVideoStyles = video.getAttribute('style');
            createOverlay();

            const c = document.createElement('div');
            c.className = 'custom-video-container';
            video.style.cssText = `width: 100%; height: 100%; object-fit: contain; background: black; border: none;`;

            const exit = document.createElement('button');
            exit.className = 'fancy-exit-btn';
            exit.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                Exit
            `;
            exit.onclick = removeMaxMode;

            c.append(video, exit);
            overlay.appendChild(c);
            return;
        }

        enabled = true;
        originalParent = video.parentElement;
        originalNextSibling = video.nextSibling;
        originalVideoStyles = video.getAttribute('style');

        createOverlay();
        const customControls = createCustomControls(video);
        overlay.appendChild(customControls);

        if (video.paused) video.play().catch(()=>{});
    }

    function removeMaxMode() {
        if (!enabled || !video) return;
        enabled = false;

        if (originalVideoStyles) video.setAttribute('style', originalVideoStyles);
        else video.removeAttribute('style');

        if (originalParent) {
            if (originalNextSibling) originalParent.insertBefore(video, originalNextSibling);
            else originalParent.appendChild(video);
        } else {
            document.body.appendChild(video);
        }

        if (overlay) {
            overlay.remove();
            overlay = null;
        }

        video = null;
        originalParent = null;
        originalNextSibling = null;
    }

    document.addEventListener('keydown', e => {
        // Trigger: Ctrl + Shift + Enter
        if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            applyMaxMode();
        }
        // Exit: Escape or Q
        else if (enabled && (e.key === 'Escape' || e.key.toLowerCase() === 'q')) {
            e.preventDefault();
            e.stopPropagation();
            removeMaxMode();
        }
        // Play/Pause: Space
        else if (enabled && e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            if (video && video.tagName === 'VIDEO') {
                if(video.paused) video.play(); else video.pause();
            }
        }
    }, true);

})();