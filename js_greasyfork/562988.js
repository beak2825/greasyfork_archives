// ==UserScript==
// @name         Instagram Video Controls - Enhanced State
// @name:ru      Instagram Видео Контролы - Сохранение настроек
// @version      1.0
// @description  Persistent volume, minimalist UI, clean text-based speed selector, and PiP support for all Instagram videos.
// @description:ru Сохраняет громкость и скорость для всех видео. Минималистичный интерфейс, текстовый выбор скорости, режим "Картинка в картинке".
// @author       FerNikoMF
// @match        https://www.instagram.com/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/1384659
// @downloadURL https://update.greasyfork.org/scripts/562988/Instagram%20Video%20Controls%20-%20Enhanced%20State.user.js
// @updateURL https://update.greasyfork.org/scripts/562988/Instagram%20Video%20Controls%20-%20Enhanced%20State.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================================================
    // CONFIGURATION & STORAGE
    // ==========================================================================
    const STORAGE_KEY = 'ig_enhanced_controls_v1';
    
    // Default settings
    let appSettings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { 
        volume: 0.3, 
        muted: false, 
        speed: 1 
    };

    const saveSettings = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appSettings));
    };

    // ==========================================================================
    // ICONS (SVG)
    // ==========================================================================
    const ICONS = {
        play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
        pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
        volumeOn: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
        volumeOff: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
        fullscreen: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
        pip: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/></svg>'
    };

    // ==========================================================================
    // STYLES INJECTION
    // ==========================================================================
    const injectStyles = () => {
        if (document.getElementById('ig-custom-css')) return;
        const style = document.createElement("style");
        style.id = 'ig-custom-css';
        style.textContent = `
            /* --- Main Panel --- */
            .ig-cc-panel {
                position: absolute; bottom: 10px; left: 10px; right: 10px;
                display: flex !important; align-items: center !important; gap: 6px !important;
                background: rgba(20, 20, 20, 0.9) !important;
                backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
                padding: 6px 10px !important; border-radius: 12px !important;
                opacity: 0; transition: opacity 0.2s ease;
                z-index: 2147483647 !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.6) !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                height: 40px !important; box-sizing: border-box !important;
            }
            .ig-cc-wrapper:hover .ig-cc-panel, .ig-cc-panel.visible { opacity: 1 !important; }

            /* --- Buttons --- */
            .ig-cc-btn {
                all: unset !important; background: transparent !important; 
                border: none !important; cursor: pointer !important; color: white !important;
                width: 28px !important; height: 28px !important; padding: 4px !important; 
                border-radius: 6px !important; display: flex !important; 
                align-items: center !important; justify-content: center !important;
                flex-shrink: 0 !important; opacity: 0.9; 
                transition: transform 0.1s !important; box-sizing: border-box !important;
            }
            .ig-cc-btn:hover { background: rgba(255,255,255,0.2) !important; opacity: 1; transform: scale(1.05); }
            .ig-cc-btn svg { width: 100%; height: 100%; display: block; fill: white; pointer-events: none; }

            /* --- Time Display --- */
            .ig-cc-time { 
                font-family: monospace, sans-serif !important; font-size: 11px !important; color: #ddd !important; 
                min-width: 70px !important; text-align: center !important; pointer-events: none; user-select: none;
                flex-shrink: 0 !important;
            }

            /* --- Progress Bar --- */
            .ig-cc-progress { 
                flex-grow: 1 !important; margin: 0 8px !important; height: 100% !important; 
                display: flex !important; align-items: center !important; cursor: pointer !important;
            }

            /* --- Volume Slider (Expandable) --- */
            .ig-cc-vol-wrap { 
                position: relative !important; display: flex !important; align-items: center !important; 
                flex-shrink: 0 !important; height: 100% !important;
            }
            .ig-cc-vol-slider { 
                width: 0 !important; opacity: 0 !important; overflow: hidden !important; 
                transition: width 0.2s ease, opacity 0.2s ease, margin 0.2s ease !important; 
                margin-left: 0 !important; height: 100% !important; display: flex !important; align-items: center !important;
            }
            .ig-cc-vol-wrap:hover .ig-cc-vol-slider, .ig-cc-vol-slider:active { 
                width: 60px !important; opacity: 1 !important; margin-left: 8px !important; 
            }

            /* --- Range Input Styling --- */
            input[type=range].ig-range { 
                -webkit-appearance: none !important; appearance: none !important;
                background: transparent !important; cursor: pointer !important; width: 100% !important;
                margin: 0 !important; padding: 0 !important; border: none !important; height: 20px !important;
            }
            input[type=range].ig-range:focus { outline: none !important; }
            input[type=range].ig-range::-webkit-slider-runnable-track { 
                height: 4px !important; background: rgba(255,255,255,0.3) !important; border-radius: 2px !important;
            }
            input[type=range].ig-range::-webkit-slider-thumb { 
                -webkit-appearance: none !important; appearance: none !important;
                height: 12px !important; width: 12px !important; border-radius: 50% !important; 
                background: white !important; margin-top: -4px !important; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.5) !important;
            }

            /* --- Clean Text Speed Selector --- */
            .ig-cc-speed { 
                -webkit-appearance: none !important; -moz-appearance: none !important; appearance: none !important;
                background: transparent !important; color: #ddd !important; border: none !important;
                font-family: sans-serif !important; font-size: 13px !important; font-weight: bold !important;
                text-align: center !important; padding: 0 2px !important; margin: 0 4px !important;
                cursor: pointer !important; outline: none !important; height: 100% !important;
                flex-shrink: 0 !important; width: auto !important; min-width: 25px !important;
            }
            .ig-cc-speed:hover { color: white !important; transform: scale(1.1); }
            .ig-cc-speed::-ms-expand { display: none; }
            .ig-cc-speed option { background: #222 !important; color: white !important; font-size: 13px !important; }
        `;
        document.head.appendChild(style);
    };

    // ==========================================================================
    // LOGIC & CONTROLLER
    // ==========================================================================
    
    // Force global settings on a video element
    function applyGlobalState(video) {
        if (Math.abs(video.volume - appSettings.volume) > 0.01 || video.muted !== appSettings.muted) {
            video.volume = appSettings.volume;
            video.muted = appSettings.muted;
        }
        if (Math.abs(video.playbackRate - appSettings.speed) > 0.01) {
            video.playbackRate = appSettings.speed;
        }
    }

    // Initialize custom player for a video
    function mountControls(video) {
        if (video.dataset.hasCustomControls) return;
        video.dataset.hasCustomControls = "true";
        
        applyGlobalState(video);
        video.removeAttribute("controls");

        // Create Panel
        const panel = document.createElement("div");
        panel.className = "ig-cc-panel";
        panel.innerHTML = `
            <button class="ig-cc-btn play-pause">${ICONS.play}</button>
            <span class="ig-cc-time">0:00 / 0:00</span>
            <div class="ig-cc-progress">
                <input type="range" class="ig-range progress-bar" min="0" max="100" step="0.1" value="0">
            </div>
            <div class="ig-cc-vol-wrap">
                <button class="ig-cc-btn mute">${appSettings.muted ? ICONS.volumeOff : ICONS.volumeOn}</button>
                <div class="ig-cc-vol-slider">
                    <input type="range" class="ig-range volume-bar" min="0" max="1" step="0.01" value="${appSettings.volume}">
                </div>
            </div>
            <select class="ig-cc-speed" title="Playback Speed">
                <option value="0.25">0.25x</option>
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
                <option value="2.5">2.5x</option>
                <option value="3">3x</option>
                <option value="4">4x</option>
            </select>
            <button class="ig-cc-btn pip" title="Picture-in-Picture">${ICONS.pip}</button>
            <button class="ig-cc-btn fullscreen" title="Fullscreen">${ICONS.fullscreen}</button>
        `;

        // Mount to wrapper
        const wrapper = video.parentNode;
        wrapper.classList.add('ig-cc-wrapper');
        if (getComputedStyle(wrapper).position === 'static') wrapper.style.position = "relative";
        wrapper.appendChild(panel);

        // --- Event Handlers ---
        const ui = {
            play: panel.querySelector(".play-pause"),
            progress: panel.querySelector(".progress-bar"),
            time: panel.querySelector(".ig-cc-time"),
            mute: panel.querySelector(".mute"),
            vol: panel.querySelector(".volume-bar"),
            speed: panel.querySelector(".ig-cc-speed"),
            fs: panel.querySelector(".fullscreen"),
            pip: panel.querySelector(".pip")
        };

        ui.speed.value = appSettings.speed;

        // Prevent Instagram interactions when clicking controls
        const stopProp = (e) => e.stopPropagation();
        ['click', 'dblclick', 'mousedown', 'touchstart', 'pointerdown'].forEach(evt => panel.addEventListener(evt, stopProp));

        // Play/Pause Logic
        ui.play.onclick = () => video.paused ? video.play() : video.pause();
        const updatePlayIcon = () => ui.play.innerHTML = video.paused ? ICONS.play : ICONS.pause;
        video.addEventListener('play', () => { updatePlayIcon(); applyGlobalState(video); });
        video.addEventListener('pause', updatePlayIcon);

        // Progress Logic
        video.addEventListener("timeupdate", () => {
            if (!video.duration) return;
            if (document.activeElement !== ui.progress) {
                ui.progress.value = (video.currentTime / video.duration) * 100;
                const val = ui.progress.value;
                ui.progress.style.background = `linear-gradient(to right, white 0%, white ${val}%, rgba(255,255,255,0.2) ${val}%, rgba(255,255,255,0.2) 100%)`;
            }
            ui.time.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        });
        ui.progress.addEventListener("input", () => { video.currentTime = (ui.progress.value / 100) * video.duration; });

        // Volume Logic
        const updateVolumeUI = () => {
            const isMuted = video.muted || video.volume === 0;
            ui.mute.innerHTML = isMuted ? ICONS.volumeOff : ICONS.volumeOn;
            ui.vol.value = isMuted ? 0 : video.volume;
        };
        
        ui.vol.addEventListener("input", () => {
            appSettings.volume = parseFloat(ui.vol.value);
            appSettings.muted = appSettings.volume === 0;
            saveSettings();
            syncAllVideos();
        });
        
        ui.mute.onclick = () => {
            appSettings.muted = !appSettings.muted;
            if (!appSettings.muted && appSettings.volume === 0) appSettings.volume = 0.5;
            saveSettings();
            syncAllVideos();
        };
        video.addEventListener('volumechange', updateVolumeUI);

        // Speed Logic
        ui.speed.addEventListener("change", () => {
            appSettings.speed = parseFloat(ui.speed.value);
            saveSettings();
            syncAllVideos();
        });

        // FS & PiP
        ui.fs.onclick = () => document.fullscreenElement ? document.exitFullscreen() : (wrapper.requestFullscreen ? wrapper.requestFullscreen() : video.webkitEnterFullscreen?.());
        ui.pip.onclick = () => document.pictureInPictureElement ? document.exitPictureInPicture() : video.requestPictureInPicture();

        // Auto-Hide Panel
        let hideTimer;
        const togglePanel = () => {
            panel.classList.add('visible');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => { if(!video.paused) panel.classList.remove('visible'); }, 2500);
        };
        wrapper.addEventListener("mousemove", togglePanel);
        video.addEventListener("play", togglePanel);
        video.addEventListener("pause", () => panel.classList.add('visible'));

        updateVolumeUI();
    }

    // --- Helpers ---
    function formatTime(s) {
        if (!s || isNaN(s)) return "0:00";
        return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
    }

    function syncAllVideos() {
        document.querySelectorAll('video').forEach(v => {
            v.volume = appSettings.volume;
            v.muted = appSettings.muted;
            v.playbackRate = appSettings.speed;
        });
        document.querySelectorAll('.ig-cc-speed').forEach(s => s.value = appSettings.speed);
    }

    // --- Initialization ---
    injectStyles();

    const observer = new MutationObserver((mutations) => {
        if (mutations.some(m => m.addedNodes.length)) {
            document.querySelectorAll("video").forEach(v => { applyGlobalState(v); mountControls(v); });
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Fallback Polling
    setInterval(() => {
        document.querySelectorAll("video").forEach(v => {
            if (!v.paused && Math.abs(v.volume - appSettings.volume) > 0.05) v.volume = appSettings.volume;
            if(!v.dataset.hasCustomControls) mountControls(v);
        });
    }, 1000);

})();