// ==UserScript==
// @name         Instagram Reels Volume Control
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Нативный контроль громкости, перемотка и скорость в Instagram Reels
// @author       You
// @match        https://www.instagram.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562892/Instagram%20Reels%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/562892/Instagram%20Reels%20Volume%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let savedVolume = GM_getValue('reelsVolume', 0.5);
    let savedSpeed = GM_getValue('reelsSpeed', 1);
    const processedVideos = new WeakSet();
    const processedContainers = new WeakSet();
    const videoControls = new WeakMap();

    const style = document.createElement('style');
    style.textContent = `
        .video-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            pointer-events: none;
        }

        .video-overlay > * {
            pointer-events: auto;
        }

        .volume-control-wrapper {
            position: absolute;
            bottom: 100px;
            right: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 2;
        }

        .video-container:hover .volume-control-wrapper {
            opacity: 1;
        }

        .speed-control-wrapper {
            position: absolute;
            top: 12px;
            left: 12px;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 2;
        }

        .video-container:hover .speed-control-wrapper {
            opacity: 1;
        }

        .speed-button {
            background: rgba(0, 0, 0, 0.6);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 12px;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-weight: 500;
            backdrop-filter: blur(10px);
            transition: all 0.15s ease;
            letter-spacing: 0.3px;
        }

        .speed-button:hover {
            background: rgba(0, 0, 0, 0.75);
        }

        .speed-button:active {
            transform: scale(0.95);
        }

        .speed-menu {
            position: absolute;
            top: 100%;
            left: 0;
            margin-top: 4px;
            background: rgba(0, 0, 0, 0.85);
            border-radius: 6px;
            padding: 4px;
            display: none;
            flex-direction: column;
            gap: 2px;
            backdrop-filter: blur(20px);
            min-width: 120px;
        }

        .speed-menu.active {
            display: flex;
        }

        .speed-option {
            background: transparent;
            color: white;
            border: none;
            padding: 8px 12px;
            font-size: 13px;
            cursor: pointer;
            border-radius: 4px;
            text-align: left;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            transition: all 0.1s;
            font-weight: 400;
        }

        .speed-option:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .speed-option.active {
            background: rgba(255, 255, 255, 0.15);
            font-weight: 500;
        }

        /* Seek bar ВНУТРИ рилса, снизу по центру, выше нативных кнопок */
        .seek-bar-wrapper {
            position: absolute;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 85%;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 2;
        }

        .video-container:hover .seek-bar-wrapper {
            opacity: 1;
        }

        .seek-bar-container {
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 6px;
            padding: 8px 12px;
        }

        .seek-bar {
            width: 100%;
            height: 3px;
            -webkit-appearance: none;
            appearance: none;
            background: linear-gradient(to right,
                white 0%,
                white var(--progress, 0%),
                rgba(255, 255, 255, 0.3) var(--progress, 0%),
                rgba(255, 255, 255, 0.3) 100%);
            outline: none;
            border-radius: 2px;
            cursor: pointer;
            transition: height 0.15s;
        }

        .seek-bar:hover {
            height: 4px;
        }

        .seek-bar::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            transition: transform 0.15s;
        }

        .seek-bar::-webkit-slider-thumb:hover {
            transform: scale(1.15);
        }

        .seek-bar::-moz-range-thumb {
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            border: none;
        }

        .time-display {
            color: white;
            font-size: 11px;
            margin-top: 5px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-weight: 400;
            opacity: 0.9;
            text-align: center;
        }

        .volume-slider-container {
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 10px 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }

        .volume-slider-vertical {
            -webkit-appearance: slider-vertical;
            writing-mode: bt-lr;
            width: 3px;
            height: 80px;
            background: linear-gradient(to top,
                white 0%,
                white var(--volume-progress, 50%),
                rgba(255, 255, 255, 0.3) var(--volume-progress, 50%),
                rgba(255, 255, 255, 0.3) 100%);
            outline: none;
            border-radius: 2px;
            cursor: pointer;
        }

        .volume-slider-vertical::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            transition: transform 0.15s;
        }

        .volume-slider-vertical::-webkit-slider-thumb:hover {
            transform: scale(1.15);
        }

        .volume-slider-vertical::-moz-range-thumb {
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            border: none;
        }

        .volume-icon {
            width: 24px;
            height: 24px;
            cursor: pointer;
            transition: transform 0.15s;
        }

        .volume-icon:hover {
            transform: scale(1.1);
        }

        .volume-icon:active {
            transform: scale(0.95);
        }
    `;
    document.head.appendChild(style);

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function updateSpeedButton(video, button, menu) {
        const currentSpeed = video.playbackRate;
        const newText = currentSpeed === 1 ? '⚡ Скорость' : `⚡ ${currentSpeed}x`;
        if (button.textContent !== newText) {
            button.textContent = newText;
        }

        if (menu) {
            const options = menu.querySelectorAll('.speed-option');
            options.forEach(opt => {
                const optSpeed = parseFloat(opt.dataset.speed);
                if (Math.abs(optSpeed - currentSpeed) < 0.01) {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });
        }
    }

    function updateVolumeSlider(video, slider, icon) {
        const currentVol = video.volume;
        const sliderVal = Math.round(currentVol * 100);

        if (Math.abs(slider.value - sliderVal) > 1) {
            slider.value = sliderVal;
            slider.style.setProperty('--volume-progress', `${sliderVal}%`);
            updateVolumeIcon(icon, currentVol);
        }
    }

    function createSpeedControl(overlay, video) {
        const speedWrapper = document.createElement('div');
        speedWrapper.className = 'speed-control-wrapper';

        const currentSpeed = video.playbackRate || savedSpeed;
        const speedText = currentSpeed === 1 ? '⚡ Скорость' : `⚡ ${currentSpeed}x`;

        speedWrapper.innerHTML = `
            <button class="speed-button">${speedText}</button>
            <div class="speed-menu">
                <button class="speed-option" data-speed="0.5">0.5x</button>
                <button class="speed-option" data-speed="1">Обычная</button>
                <button class="speed-option" data-speed="1.25">1.25x</button>
                <button class="speed-option" data-speed="1.5">1.5x</button>
                <button class="speed-option" data-speed="1.75">1.75x</button>
                <button class="speed-option" data-speed="2">2x</button>
            </div>
        `;

        const button = speedWrapper.querySelector('.speed-button');
        const menu = speedWrapper.querySelector('.speed-menu');
        const options = speedWrapper.querySelectorAll('.speed-option');

        const controls = videoControls.get(video) || {};
        controls.speedButton = button;
        controls.speedMenu = menu;
        videoControls.set(video, controls);

        updateSpeedButton(video, button, menu);

        button.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.classList.toggle('active');
        });

        options.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const speed = parseFloat(this.dataset.speed);
                savedSpeed = speed;
                GM_setValue('reelsSpeed', savedSpeed);

                if (video) {
                    video.playbackRate = savedSpeed;
                    updateSpeedButton(video, button, menu);
                }

                menu.classList.remove('active');
            });
        });

        overlay.appendChild(speedWrapper);
        return speedWrapper;
    }

    function createSeekBar(overlay, video) {
        const seekWrapper = document.createElement('div');
        seekWrapper.className = 'seek-bar-wrapper';
        seekWrapper.innerHTML = `
            <div class="seek-bar-container">
                <input type="range" class="seek-bar" min="0" max="100" value="0" step="0.1" style="--progress: 0%">
                <div class="time-display">0:00 / 0:00</div>
            </div>
        `;

        const seekBar = seekWrapper.querySelector('.seek-bar');
        const timeDisplay = seekWrapper.querySelector('.time-display');
        let isSeeking = false;

        video.addEventListener('timeupdate', function() {
            if (!isSeeking && video.duration) {
                const percent = (video.currentTime / video.duration) * 100;
                seekBar.value = percent;
                seekBar.style.setProperty('--progress', `${percent}%`);
                timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
            }
        });

        video.addEventListener('loadedmetadata', function() {
            timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
        });

        seekBar.addEventListener('input', function(e) {
            e.stopPropagation();
            isSeeking = true;
            this.style.setProperty('--progress', `${this.value}%`);
            const time = (this.value / 100) * video.duration;
            timeDisplay.textContent = `${formatTime(time)} / ${formatTime(video.duration)}`;
        });

        seekBar.addEventListener('change', function(e) {
            e.stopPropagation();
            const time = (this.value / 100) * video.duration;
            video.currentTime = time;
            isSeeking = false;
        });

        overlay.appendChild(seekWrapper);
        return seekWrapper;
    }

    function createVolumeControl(overlay, video) {
        const volumeWrapper = document.createElement('div');
        volumeWrapper.className = 'volume-control-wrapper';

        const currentVol = Math.round(savedVolume * 100);
        const volumeIcon = savedVolume === 0 ?
            `<svg class="volume-icon" fill="white" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>` :
            `<svg class="volume-icon" fill="white" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>`;

        volumeWrapper.innerHTML = `
            <div class="volume-slider-container">
                <input type="range" class="volume-slider-vertical" min="0" max="100" value="${currentVol}" orient="vertical" style="--volume-progress: ${currentVol}%">
                ${volumeIcon}
            </div>
        `;

        const slider = volumeWrapper.querySelector('.volume-slider-vertical');
        const icon = volumeWrapper.querySelector('.volume-icon');

        const controls = videoControls.get(video) || {};
        controls.volumeSlider = slider;
        controls.volumeIcon = icon;
        videoControls.set(video, controls);

        slider.addEventListener('input', function(e) {
            e.stopPropagation();
            savedVolume = this.value / 100;
            GM_setValue('reelsVolume', savedVolume);
            this.style.setProperty('--volume-progress', `${this.value}%`);
            if (video) video.volume = savedVolume;
            updateVolumeIcon(icon, savedVolume);
        });

        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            if (savedVolume > 0) {
                slider.value = 0;
                savedVolume = 0;
            } else {
                slider.value = 50;
                savedVolume = 0.5;
            }
            slider.style.setProperty('--volume-progress', `${slider.value}%`);
            GM_setValue('reelsVolume', savedVolume);
            if (video) video.volume = savedVolume;
            updateVolumeIcon(icon, savedVolume);
        });

        overlay.appendChild(volumeWrapper);
        return volumeWrapper;
    }

    function updateVolumeIcon(icon, volume) {
        const newPath = volume === 0 ?
            '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>' :
            '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>';

        if (icon.innerHTML !== newPath) {
            icon.innerHTML = newPath;
        }
    }

    function setupVideo(video) {
        if (processedVideos.has(video)) return;
        processedVideos.add(video);

        video.volume = savedVolume;
        video.playbackRate = savedSpeed;

        video.addEventListener('loadedmetadata', function() {
            this.volume = savedVolume;
            this.playbackRate = savedSpeed;
        });

        video.addEventListener('play', function() {
            this.volume = savedVolume;
            this.playbackRate = savedSpeed;
        });
    }

    function processContainer(container, video) {
        if (processedContainers.has(container)) return;
        processedContainers.add(container);

        // Ищем непосредственного родителя видео, который содержит только видео
        let videoContainer = video.parentElement;

        // Проверяем, что это не слишком большой контейнер
        // Ищем ближайший div, который примерно равен размеру видео
        while (videoContainer && videoContainer !== container) {
            const rect = videoContainer.getBoundingClientRect();
            const videoRect = video.getBoundingClientRect();

            // Если контейнер примерно равен размеру видео (с небольшим запасом)
            if (Math.abs(rect.width - videoRect.width) < 50 &&
                Math.abs(rect.height - videoRect.height) < 50) {
                break;
            }
            videoContainer = videoContainer.parentElement;
            if (videoContainer === container) break;
        }

        // Если не нашли подходящий, используем прямого родителя видео
        if (!videoContainer || videoContainer === container) {
            videoContainer = video.parentElement;
        }

        videoContainer.classList.add('video-container');
        videoContainer.style.position = 'relative';

        const overlay = document.createElement('div');
        overlay.className = 'video-overlay';
        videoContainer.appendChild(overlay);

        createVolumeControl(overlay, video);
        createSeekBar(overlay, video);
        createSpeedControl(overlay, video);
    }


    function findAndProcessVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            setupVideo(video);

            const container = video.closest('div[role="presentation"]') ||
                             video.closest('article') ||
                             video.parentElement;

            if (container && !processedContainers.has(container)) {
                processContainer(container, video);
            }
        });
    }

    setInterval(function() {
        document.querySelectorAll('video').forEach(video => {
            if (Math.abs(video.volume - savedVolume) > 0.05) {
                video.volume = savedVolume;
            }
            if (Math.abs(video.playbackRate - savedSpeed) > 0.05) {
                video.playbackRate = savedSpeed;
            }

            const controls = videoControls.get(video);
            if (controls) {
                if (controls.speedButton && controls.speedMenu) {
                    updateSpeedButton(video, controls.speedButton, controls.speedMenu);
                }
                if (controls.volumeSlider && controls.volumeIcon) {
                    updateVolumeSlider(video, controls.volumeSlider, controls.volumeIcon);
                }
            }
        });
    }, 1000);

    let debounceTimer;
    const observer = new MutationObserver(function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(findAndProcessVideos, 150);
    });

    window.addEventListener('load', function() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        findAndProcessVideos();
    });

    let lastUrl = location.href;
    new MutationObserver(function() {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(findAndProcessVideos, 200);
        }
    }).observe(document, {subtree: true, childList: true});
})();
