// ==UserScript==
// @name         Threads 影片音量控制增強
// @name:zh-TW   Threads 影片音量控制增強
// @name:zh-CN   Threads 视频音量控制增强
// @name:en      Threads Video Volume Control Enhancement
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  為 Threads 影片添加音量控制、進度時間顯示和播放按鈕
// @description:zh-TW  為 Threads 影片添加音量控制、進度時間顯示和播放按鈕
// @description:zh-CN  为 Threads 视频添加音量控制、进度时间显示和播放按钮
// @description:en     Add volume control, progress time display and play button for Threads videos
// @license      MIT
// @author       movwei
// @match        https://www.threads.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553160/Threads%20%E5%BD%B1%E7%89%87%E9%9F%B3%E9%87%8F%E6%8E%A7%E5%88%B6%E5%A2%9E%E5%BC%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/553160/Threads%20%E5%BD%B1%E7%89%87%E9%9F%B3%E9%87%8F%E6%8E%A7%E5%88%B6%E5%A2%9E%E5%BC%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const detectLanguage = () => {
        const lang = navigator.language || navigator.userLanguage;
        if (lang.includes('zh-CN')) return 'zh-CN';
        if (lang.includes('zh') || lang.includes('TW')) return 'zh-TW';
        return 'en';
    };

    const currentLang = detectLanguage();

    const translations = {
        'zh-TW': {
            muted: '已靜音',
            unmute: '取消靜音',
            mute: '靜音'
        },
        'zh-CN': {
            muted: '已静音',
            unmute: '取消静音',
            mute: '静音'
        },
        'en': {
            muted: 'Muted',
            unmute: 'Unmute',
            mute: 'Mute'
        }
    };

    const t = translations[currentLang] || translations.en;

    let savedVolume = 0.5;
    const loadSavedVolume = () => {
        try {
            const saved = localStorage.getItem('threads-saved-volume');
            if (saved !== null) {
                const vol = parseFloat(saved);
                if (!isNaN(vol) && vol >= 0 && vol <= 1) {
                    savedVolume = vol;
                }
            }
        } catch (e) {
        }
    };

    const saveVolume = (volume) => {
        savedVolume = Math.max(0, Math.min(1, volume));
        try {
            localStorage.setItem('threads-saved-volume', savedVolume.toString());
        } catch (e) {
        }
    };

    loadSavedVolume();

    const style = document.createElement('style');
    style.textContent = `
        .threads-video-controls {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 5;
            pointer-events: none;
        }

        .threads-play-button {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: auto;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 6px;
            flex-shrink: 0;
        }

        .threads-play-button:hover {
            background: rgba(0, 0, 0, 0.8);
        }

        .threads-video-item:hover .threads-play-button,
        .threads-video-item.paused .threads-play-button {
            opacity: 1;
        }

        .threads-video-item.paused .threads-play-button {
            opacity: 1 !important;
        }

        .threads-play-button svg {
            width: 16px;
            height: 16px;
            fill: white;
        }

        .threads-video-item .threads-volume-control {
            position: absolute;
            right: 8px !important;
            bottom: 50px !important;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: auto;
            padding: 4px 3px;
            background: none;
            border-radius: 12px;
            z-index: 6;
        }

        .threads-video-item:hover .threads-volume-control {
            opacity: 1;
        }

        .threads-video-item .threads-volume-label {
            font-size: 11px;
            color: #fff;
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
            min-width: 28px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .threads-video-item .threads-volume-slider {
            width: 3px;
            height: 60px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 2px;
            position: relative;
            cursor: pointer;
        }

        .threads-video-item .threads-volume-fill {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: #fff;
            border-radius: 2px;
            transition: height 0.1s ease;
        }

        .threads-video-item .threads-time-display {
            position: absolute;
            left: 8px;
            bottom: 8px;
            font-size: 11px;
            color: #fff;
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            padding: 6px 10px;
            background: none;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            z-index: 6;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .threads-video-item:hover .threads-time-display {
            opacity: 1;
        }

        .threads-video-item.threads-video-expanded .threads-volume-control {
            right: 23px !important;
            bottom: 90px !important;
        }

        .threads-video-item.threads-video-expanded .threads-time-display {
            bottom: 25px !important;
        }
    `;
    document.head.appendChild(style);

    function formatTime(seconds) {
        if (!isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function createSVG(type) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        if (type === 'play') {
            path.setAttribute('d', 'M8 5v14l11-7z');
        } else if (type === 'pause') {
            path.setAttribute('d', 'M6 4h4v16H6V4zm8 0h4v16h-4V4z');
        }

        svg.appendChild(path);
        return svg;
    }

    function createPlayButton(video, timeDisplay, wrapper) {
        const playButton = document.createElement('div');
        playButton.className = 'threads-play-button';

        const playIcon = createSVG('play');
        const pauseIcon = createSVG('pause');

        playButton.appendChild(video.paused ? playIcon : pauseIcon);

        video.addEventListener('play', () => {
            while (playButton.firstChild) {
                playButton.removeChild(playButton.firstChild);
            }
            playButton.appendChild(createSVG('pause'));
            wrapper.classList.remove('paused');
        });

        video.addEventListener('pause', () => {
            while (playButton.firstChild) {
                playButton.removeChild(playButton.firstChild);
            }
            playButton.appendChild(createSVG('play'));
            wrapper.classList.add('paused');
        });

        timeDisplay.insertBefore(playButton, timeDisplay.firstChild);

        if (video.paused) {
            wrapper.classList.add('paused');
        }

        timeDisplay.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    }

    function createVolumeControl(video, wrapper) {
        const existingControl = wrapper.querySelector('.threads-video-controls');
        if (existingControl) return;

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'threads-video-controls';

        const volumeControl = document.createElement('div');
        volumeControl.className = 'threads-volume-control';

        const volumeLabel = document.createElement('div');
        volumeLabel.className = 'threads-volume-label';

        const volumeSlider = document.createElement('div');
        volumeSlider.className = 'threads-volume-slider';

        const volumeFill = document.createElement('div');
        volumeFill.className = 'threads-volume-fill';

        volumeSlider.appendChild(volumeFill);
        volumeControl.appendChild(volumeLabel);
        volumeControl.appendChild(volumeSlider);

        const timeDisplay = document.createElement('div');
        timeDisplay.className = 'threads-time-display';

        const timeText = document.createElement('span');
        timeText.textContent = '0:00 / 0:00';
        timeDisplay.appendChild(timeText);

        createPlayButton(video, timeDisplay, wrapper);

        controlsDiv.appendChild(volumeControl);
        controlsDiv.appendChild(timeDisplay);
        wrapper.appendChild(controlsDiv);

        video.addEventListener('volumechange', () => {
            if (video.muted === false && video.volume === 0) {
                video.volume = savedVolume;
            }
        });

        function positionControls() {
            const hasExpandedClass = wrapper.classList.contains('threads-video-expanded');
            const hasExpandedParent = wrapper.closest('.threads-video-expanded') !== null;
            const hasTimeline = wrapper.querySelector('#barcelona-video-timeline') !== null;
            const isExpanded = hasExpandedClass || hasExpandedParent || hasTimeline;

            if (isExpanded) {
                wrapper.classList.add('threads-video-expanded');
                volumeControl.style.bottom = '';
                volumeControl.style.right = '';
                timeDisplay.style.bottom = '';
                return;
            } else {
                wrapper.classList.remove('threads-video-expanded');
            }

            let bottomBase = 50;
            let rightBase = 8;

            const base = wrapper.closest('.threads-video-item') || wrapper.parentElement || wrapper;
            const selector = 'button[aria-label*="靜音"],button[aria-label*="Mute"],button[aria-label*="Unmute"],[data-testid*="mute"],[class*="mute"]';
            let muteBtn = base.querySelector(selector);

            if (!muteBtn) {
                const baseRect = base.getBoundingClientRect();
                const candidates = Array.from(document.querySelectorAll(selector)).filter(el => {
                    const r = el.getBoundingClientRect();
                    const visible = r.width > 0 && r.height > 0;
                    const intersects = !(r.right < baseRect.left || r.left > baseRect.right || r.bottom < baseRect.top || r.top > baseRect.bottom);
                    return visible && intersects;
                });
                if (candidates.length) {
                    candidates.sort((a, b) => {
                        const ra = a.getBoundingClientRect();
                        const rb = b.getBoundingClientRect();
                        const da = (baseRect.right - ra.left) + (baseRect.bottom - ra.top);
                        const db = (baseRect.right - rb.left) + (baseRect.bottom - rb.top);
                        return da - db;
                    });
                    muteBtn = candidates[0];
                }
            }

            if (muteBtn) {
                const muteRect = muteBtn.getBoundingClientRect();
                const baseRect = (base || wrapper).getBoundingClientRect();
                const minGapY = (muteRect.height || 32) + 16;
                const minGapX = (muteRect.width || 32) + 12;
                const overlapY = Math.max(0, baseRect.bottom - muteRect.top);
                const overlapX = Math.max(0, baseRect.right - muteRect.left);

                if (overlapY < minGapY) bottomBase += (minGapY - overlapY);
                if (overlapX < minGapX) rightBase += (minGapX - overlapX);
            }

            volumeControl.style.bottom = `${bottomBase}px`;
            volumeControl.style.right = `${rightBase}px`;

            let timeBottom = 8;
            const timeline = wrapper.querySelector('#barcelona-video-timeline');
            if (timeline) {
                const tlRect = timeline.getBoundingClientRect();
                const wrapRect = wrapper.getBoundingClientRect();
                const needsRaise = (wrapRect.bottom - tlRect.top) + 8;
                timeBottom = Math.max(timeBottom, needsRaise);
            }
            timeDisplay.style.bottom = `${timeBottom}px`;
        }

        function updateVolumeDisplay() {
            const volume = video.muted ? 0 : video.volume;
            volumeFill.style.height = `${volume * 100}%`;
            volumeLabel.textContent = `${Math.round(volume * 100)}%`;
        }

        function updateVolume(e) {
            const rect = volumeSlider.getBoundingClientRect();
            const y = rect.bottom - e.clientY;
            const percent = Math.max(0, Math.min(1, y / rect.height));

            video.volume = percent;
            saveVolume(percent);
            updateVolumeDisplay();

            if (percent > 0 && video.muted) {
                video.muted = false;
            }
        }

        try { positionControls(); } catch {}

        let isDragging = false;
        let currentSlider = null;

        volumeSlider.addEventListener('mousedown', (e) => {
            isDragging = true;
            currentSlider = volumeSlider;
            updateVolume(e);
            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && currentSlider === volumeSlider) {
                updateVolume(e);
            }
        });

        document.addEventListener('mouseup', () => {
            if (currentSlider === volumeSlider) {
                isDragging = false;
                currentSlider = null;
            }
        });

        volumeSlider.addEventListener('click', (e) => {
            updateVolume(e);
            e.stopPropagation();
        });

        video.addEventListener('volumechange', updateVolumeDisplay);

        video.addEventListener('timeupdate', () => {
            const current = formatTime(video.currentTime);
            const duration = formatTime(video.duration || 0);
            const timeTextEl = timeDisplay.querySelector('span');
            if (timeTextEl) {
                timeTextEl.textContent = `${current} / ${duration}`;
            }
        });

        video.addEventListener('loadedmetadata', () => {
            const current = formatTime(video.currentTime);
            const duration = formatTime(video.duration);
            const timeTextEl = timeDisplay.querySelector('span');
            if (timeTextEl) {
                timeTextEl.textContent = `${current} / ${duration}`;
            }
        });

        video.volume = savedVolume;
        updateVolumeDisplay();

        const reposition = () => { try { positionControls(); } catch {} };
        window.addEventListener('resize', reposition, { passive: true });
        video.addEventListener('loadedmetadata', reposition);
        video.addEventListener('play', reposition);
        video.addEventListener('pause', reposition);

        try {
            const ro = new ResizeObserver(reposition);
            ro.observe(wrapper);
        } catch {}
    }

    function findVideoWrapper(video) {
        let wrapper = video.closest('[data-visualcompletion="ignore"]');
        if (wrapper) {
            let parent = wrapper.parentElement;
            while (parent && parent !== document.body) {
                if (parent.querySelector('#barcelona-video-timeline')) {
                    parent.style.position = 'relative';
                    parent.classList.add('threads-video-item', 'threads-video-expanded');
                    return parent;
                }
                parent = parent.parentElement;
            }
        }

        wrapper = video.closest('[id*="barcelona-video-timeline"]')?.parentElement;
        if (wrapper) {
            wrapper.style.position = 'relative';
            wrapper.classList.add('threads-video-item', 'threads-video-expanded');
            return wrapper;
        }

        wrapper = video.closest('.x1i64f0b');
        if (wrapper) {
            wrapper.style.position = 'relative';
            wrapper.classList.add('threads-video-item', 'threads-video-expanded');
            return wrapper;
        }

        wrapper = video.closest('.xmper1u');
        if (wrapper) {
            wrapper.style.position = 'relative';
            wrapper.classList.add('threads-video-item');
            return wrapper;
        }

        wrapper = video.closest('.x10y9f9r');
        if (wrapper) {
            wrapper.style.position = 'relative';
            wrapper.classList.add('threads-video-item');
            return wrapper;
        }

        let current = video.parentElement;
        let depth = 0;
        while (current && depth < 15) {
            const style = window.getComputedStyle(current);
            if (style.position === 'relative' || style.position === 'absolute') {
                current.classList.add('threads-video-item');
                return current;
            }
            current = current.parentElement;
            depth++;
        }

        const parent = video.parentElement;
        if (parent) {
            parent.style.position = 'relative';
            parent.classList.add('threads-video-item');
            return parent;
        }

        return null;
    }

    function processVideo(video) {
        if (video.dataset.threadsEnhanced) return;
        video.dataset.threadsEnhanced = 'true';

        const wrapper = findVideoWrapper(video);
        if (!wrapper) return;

        if (wrapper.dataset.threadsControlsAdded) return;
        wrapper.dataset.threadsControlsAdded = 'true';

        createVolumeControl(video, wrapper);
    }

    const observer = new MutationObserver((mutations) => {
        const videos = document.querySelectorAll('video');
        videos.forEach(processVideo);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(() => {
        const videos = document.querySelectorAll('video');
        videos.forEach(processVideo);
    }, 1000);

    setInterval(() => {
        const videos = document.querySelectorAll('video:not([data-threads-enhanced])');
        videos.forEach(processVideo);
    }, 2000);
})();