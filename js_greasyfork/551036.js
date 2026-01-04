// ==UserScript==
// @name         Kemono Tweaks & Player
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Fetches post title for accuracy, features an expandable title header for long names, and plays .wav/.mp3 files in a feature-rich audio player modal with glassmorphism UI and album art.
// @match        https://kemono.cr/*
// @author       medy17
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551036/Kemono%20Tweaks%20%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/551036/Kemono%20Tweaks%20%20Player.meta.js
// ==/UserScript==

(function () {
    "use strict";

    try {
        const style = document.createElement("style");
        style.textContent = `
    :root {
        --c-primary: #3a86ff;
        --c-secondary: #007bff;
        --brilliant-white: #ffffff;
        --glass-bg: rgba(30, 30, 30, 0.85);
        --glass-border: rgba(255, 255, 255, 0.1);
    }
    .post-card { position: relative !important; }
    .post-card__header { padding: 5px !important; z-index: 1 !important; color: #fff !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; max-width: 100% !important; display: block !important; position: relative !important; }
    .post-card:hover .post-card__header { white-space: normal !important; overflow: visible !important; background: #2e1905 !important; color: #fff !important; padding: 4px 6px !important; z-index: 9999 !important; position: absolute !important; width: auto !important; max-width: 300px !important; border-radius: 6px !important; }

    /* Modal Overlay & Positioning */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 10000; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease, background 0.3s ease; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); }
    .modal-overlay.show { opacity: 1; }

    /* Minimized State */
    .modal-overlay.minimized { background: rgba(0, 0, 0, 0); pointer-events: none; backdrop-filter: none; -webkit-backdrop-filter: none; justify-content: flex-end; align-items: flex-end; }
    .modal-overlay.minimized #audio-player-container { transform: scale(1); width: 420px; margin: 20px; pointer-events: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .modal-overlay.minimized .album-art { display: none; }
    .modal-overlay.minimized .player-content-wrapper { gap: 0; }
    .modal-overlay.minimized .audio-loader { display: none; }

    /* Main Player Container */
    #audio-player-container {
        position: relative;
        z-index: 1;
        background-color: var(--glass-bg);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        border: 1px solid var(--glass-border);
        width: 90%;
        max-width: 650px;
        transform: scale(0.95) translateY(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 25px;
        box-sizing: border-box;
    }
    .modal-overlay.show #audio-player-container { transform: scale(1) translateY(0); }

    /* Dynamic Background */
    .player-backdrop { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; background-size: cover; background-position: center; opacity: 0.2; filter: blur(40px) saturate(150%); pointer-events: none; }

    /* Flex Layout for Art + Controls */
    .player-content-wrapper { display: flex; gap: 20px; align-items: center; position: relative; z-index: 2; }

    /* Album Art */
    .album-art { width: 110px; height: 110px; border-radius: 8px; background-size: cover; background-position: center; background-color: rgba(255,255,255,0.05); box-shadow: 0 8px 20px rgba(0,0,0,0.3); flex-shrink: 0; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.1); }
    .album-art svg { width: 40%; height: 40%; color: rgba(255,255,255,0.2); }

    /* Window Controls */
    .window-controls { position: absolute; top: 1rem; right: 1rem; z-index: 20; display: flex; gap: 8px; }
    .control-btn { background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.1); font-size: 1.5rem; color: var(--brilliant-white); cursor: pointer; padding: 0.5rem; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
    .control-btn:hover { background: rgba(255, 255, 255, 0.15); color: var(--c-primary); }
    #close-audio-btn:hover { color: #ff4d4d; }

    /* Typography & Layout */
    .main-column { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }

    .audio-title-container { display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; margin-bottom: 15px; padding-right: 80px; }
    .audio-title { flex: 1; min-width: 0; font-size: 1.1em; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 2px 4px rgba(0,0,0,0.5); margin: 0; }
    .expand-arrow { flex-shrink: 0; font-size: 0.9em; color: #aaa; transition: transform 0.3s ease; }
    .audio-title-container.expanded .audio-title { white-space: normal; overflow-wrap: break-word; }
    .audio-title-container.expanded .expand-arrow { transform: rotate(180deg); }

    /* Controls */
    .audio-controls-container { color: #fff; user-select: none; width: 100%; }
    .audio-controls-container button { background: none; border: none; color: #fff; padding: 0; cursor: pointer; opacity: 0.9; transition: opacity 0.2s; }
    .audio-controls-container button:hover { opacity: 1; }
    .audio-controls-container button svg { width: 24px; height: 24px; display: block; stroke-width: 2; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3)); }

    .controls { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; }
    .controls-left, .controls-right { display: flex; align-items: center; gap: 1rem; }

    .play-pause-btn { background: #fff !important; color: #000 !important; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
    .play-pause-btn svg { width: 18px !important; height: 18px !important; margin-left: 1px; }
    .play-pause-btn .play-icon { display: block; fill: currentColor; stroke: none !important; }
    .play-pause-btn .pause-icon { display: none; fill: currentColor; stroke: none !important; }
    #audio-player-container:not(.paused) .play-pause-btn .play-icon { display: none; }
    #audio-player-container:not(.paused) .play-pause-btn .pause-icon { display: block; margin-left: 0; }

    /* Fixed Volume UI to prevent jitter */
    .volume-container { display: flex; align-items: center; gap: 8px; }
    .volume-slider { width: 70px; height: 4px; cursor: pointer; -webkit-appearance: none; appearance: none; background: rgba(255, 255, 255, 0.3); border-radius: 3px; }
    .volume-btn svg { stroke-width: 0; fill: currentColor; width: 20px !important; height: 20px !important; }
    .volume-btn .low-volume-icon, .volume-btn .muted-icon { display: none; }

    .time-container { font-size: 0.85rem; font-family: monospace; min-width: 90px; white-space: nowrap; text-align: center; color: rgba(255,255,255,0.7); }

    /* Timeline */
    .timeline-container { padding: 10px 0; cursor: pointer; margin-top: 5px; }
    .timeline-container:hover .timeline { height: 6px; }
    .timeline-container:hover .timeline .progress-bar::after { transform: translateY(-50%) scale(1); }
    .timeline { height: 4px; width: 100%; background-color: rgba(255, 255, 255, 0.15); border-radius: 3px; position: relative; transition: height 0.2s ease; }
    .timeline .progress-bar { height: 100%; width: 0%; background: linear-gradient(90deg, var(--c-primary), var(--c-secondary)); border-radius: 3px; position: relative; transition: width 0.1s linear; }
    .timeline .progress-bar::after { content: ''; position: absolute; right: -6px; top: 50%; transform: translateY(-50%) scale(0); width: 12px; height: 12px; border-radius: 50%; background-color: var(--brilliant-white); box-shadow: 0 2px 4px rgba(0,0,0,0.3); transition: transform 0.2s; }
    .timeline .buffered-bar, .timeline .hover-indicator { position: absolute; top: 0; left: 0; height: 100%; width: 0; background-color: rgba(255, 255, 255, 0.2); border-radius: 3px; }

    input[type=range].volume-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; background-color: #fff; height: 12px; width: 12px; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }

    .audio-loader { margin-top: 10px; }
    .audio-progress-bar { width: 100%; background-color: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; height: 6px; }
    .audio-progress-fill { width: 0%; height: 100%; background-image: linear-gradient(45deg, var(--c-secondary), var(--c-primary)); transition: width 0.1s linear; }
    .audio-progress-text { font-size: 0.75em; color: rgba(255,255,255,0.6); text-align: center; margin-top: 6px; }
    `;
        (document.head || document.documentElement).appendChild(style);
    } catch (e) {
    }

    const shim = function () {
        try {
            const S = String.prototype;
            const origSlice = S.slice;
            const origConcat = S.concat;
            let lastSliceValue = null;
            let lastSliceSource = null;
            Object.defineProperty(S, "slice", {
                configurable: true,
                writable: true,
                value: function (start, end) {
                    const src = String(this);
                    const out = origSlice.call(src, start, end);
                    if (
                        start === 0 &&
                        end === 50 &&
                        typeof out === "string" &&
                        src.length > 50
                    ) {
                        lastSliceValue = out;
                        lastSliceSource = src;
                    } else {
                        lastSliceValue = null;
                        lastSliceSource = null;
                    }
                    return out;
                },
            });
            Object.defineProperty(S, "concat", {
                configurable: true,
                writable: true,
                value: function (...args) {
                    try {
                        if (
                            (this === "" || String(this) === "") &&
                            args.length === 2 &&
                            args[1] === "..." &&
                            typeof args[0] === "string" &&
                            lastSliceValue !== null &&
                            args[0] === lastSliceValue
                        ) {
                            return lastSliceSource;
                        }
                    } catch (e) {
                    }
                    return origConcat.apply(this, args);
                },
            });
        } catch (e) {
        }
    };

    try {
        const s = document.createElement("script");
        s.textContent = `(${shim})();`;
        (document.head || document.documentElement).appendChild(s);
        s.remove();
    } catch (e) {
    }

    const audioPlayer = (() => {
        let isInitialized = false;
        let modalOverlay,
            playerContainer,
            backdropEl,
            albumArtEl,
            audio,
            closeBtn,
            minimizeBtn,
            titleContainer,
            titleEl,
            loaderContainer,
            progressFill,
            progressText,
            controlsContainer,
            playPauseBtn,
            volumeBtn,
            volumeSlider,
            currentTimeEl,
            totalTimeEl,
            timelineContainer,
            progressBar,
            bufferedBar,
            hoverIndicator,
            downloadBtn;

        let currentAudioUrl = null;
        let currentFileName = "";
        let activeRequest = null;
        let lastVolume = 1;

        const genericMusicIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,3V12.26C11.5,12.09 11,12 10.5,12C8,12 6,14 6,16.5C6,19 8,21 10.5,21C13,21 15,19 15,16.5V6H19V3H12Z" /></svg>`;

        function init() {
            if (isInitialized) return;

            const playerTemplate = `
        <div class="modal-overlay" id="audioModal" style="display: none;">
            <div id="audio-player-container">
                <div class="player-backdrop"></div>

                <div class="window-controls">
                    <button id="minimize-audio-btn" class="control-btn" aria-label="Minimize"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19,13H5V11H19V13Z" /></svg></button>
                    <button id="close-audio-btn" class="control-btn" aria-label="Close"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg></button>
                </div>

                <div class="player-content-wrapper">
                    <div class="album-art">
                        ${genericMusicIcon}
                    </div>

                    <div class="main-column">
                        <div class="audio-title-container">
                            <span class="expand-arrow">▼</span>
                            <h3 class="audio-title"></h3>
                        </div>

                        <audio id="audio-element" preload="metadata"></audio>

                        <div class="audio-loader">
                            <div class="audio-progress-bar"><div class="audio-progress-fill"></div></div>
                            <div class="audio-progress-text">Buffering...</div>
                        </div>

                        <div class="audio-controls-container" style="display:none;">
                            <div class="timeline-container">
                                <div class="timeline">
                                    <div class="hover-indicator"></div><div class="buffered-bar"></div><div class="progress-bar"></div>
                                </div>
                            </div>
                            <div class="controls">
                                <div class="controls-left">
                                    <button class="play-pause-btn" aria-label="Play/Pause">
                                        <svg class="play-icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                        <svg class="pause-icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                                    </button>
                                    <div class="volume-container">
                                        <button class="volume-btn" aria-label="Mute/Unmute">
                                            <svg class="high-volume-icon" viewBox="0 0 24 24"><path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" /></svg>
                                            <svg class="low-volume-icon" viewBox="0 0 24 24"><path d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" /></svg>
                                            <svg class="muted-icon" viewBox="0 0 24 24"><path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,12.22 16.47,12.43 16.43,12.64L14,10.21V7.97C15.5,8.71 16.5,10.23 16.5,12Z" /></svg>
                                        </button>
                                        <input class="volume-slider" type="range" min="0" max="1" step="any" value="1">
                                    </div>
                                    <div class="time-container"><span class="current-time">0:00</span> / <span class="total-time">0:00</span></div>
                                </div>
                                <div class="controls-right"><button class="download-btn" aria-label="Download Audio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg></button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
            const tempContainer = document.createElement("div");
            tempContainer.innerHTML = playerTemplate.trim();
            document.body.appendChild(tempContainer.firstChild);

            modalOverlay = document.getElementById("audioModal");
            playerContainer = document.getElementById("audio-player-container");
            backdropEl = playerContainer.querySelector('.player-backdrop');
            albumArtEl = playerContainer.querySelector('.album-art');
            audio = document.getElementById("audio-element");
            closeBtn = document.getElementById("close-audio-btn");
            minimizeBtn = document.getElementById("minimize-audio-btn");
            titleContainer = playerContainer.querySelector(".audio-title-container");
            titleEl = titleContainer.querySelector(".audio-title");
            loaderContainer = playerContainer.querySelector(".audio-loader");
            progressFill = playerContainer.querySelector(".audio-progress-fill");
            progressText = playerContainer.querySelector(".audio-progress-text");
            controlsContainer = playerContainer.querySelector(
                ".audio-controls-container",
            );
            playPauseBtn = playerContainer.querySelector(".play-pause-btn");
            volumeBtn = playerContainer.querySelector(".volume-btn");
            volumeSlider = playerContainer.querySelector(".volume-slider");
            currentTimeEl = playerContainer.querySelector(".current-time");
            totalTimeEl = playerContainer.querySelector(".total-time");
            timelineContainer = playerContainer.querySelector(
                ".timeline-container",
            );
            progressBar = playerContainer.querySelector(".progress-bar");
            bufferedBar = playerContainer.querySelector(".buffered-bar");
            hoverIndicator = playerContainer.querySelector(".hover-indicator");
            downloadBtn = playerContainer.querySelector(".download-btn");

            bindEvents();
            isInitialized = true;
        }

        const formatBytes = (bytes, d = 2) =>
            bytes === 0
                ? "0 Bytes"
                : `${parseFloat((bytes / Math.pow(1024, Math.floor(Math.log(bytes) / Math.log(1024)))).toFixed(d < 0 ? 0 : d))} ${["Bytes", "KB", "MB", "GB", "TB"][Math.floor(Math.log(bytes) / Math.log(1024))]}`;

        function bindEvents() {
            closeBtn.addEventListener("click", close);
            minimizeBtn.addEventListener("click", toggleMinimize);

            // CHANGED: Click outside now minimizes instead of closing
            modalOverlay.addEventListener("click", (e) => {
                if (e.target === modalOverlay) {
                    toggleMinimize(e);
                }
            });

            titleContainer.addEventListener("click", () =>
                titleContainer.classList.toggle("expanded"),
            );
            playPauseBtn.addEventListener("click", togglePlay);
            audio.addEventListener("play", () =>
                playerContainer.classList.remove("paused"),
            );
            audio.addEventListener("pause", () =>
                playerContainer.classList.add("paused"),
            );
            audio.addEventListener("loadedmetadata", handleMetadataLoaded);
            audio.addEventListener("timeupdate", handleTimeUpdate);
            audio.addEventListener("progress", handleBufferUpdate);
            audio.addEventListener("volumechange", updateVolumeUI);
            volumeBtn.addEventListener("click", toggleMute);
            volumeSlider.addEventListener(
                "input",
                (e) => (audio.volume = e.target.value),
            );
            downloadBtn.addEventListener("click", downloadAudio);
            timelineContainer.addEventListener("mousemove", handleTimelineHover);
            timelineContainer.addEventListener("click", handleTimelineSeek);
        }

        function toggleMinimize(e) {
            e.stopPropagation();
            modalOverlay.classList.toggle('minimized');
            const svg = minimizeBtn.querySelector("svg");
            const isMinimized = modalOverlay.classList.contains("minimized");

            // FIX: Toggle scroll based on minimized state
            if (isMinimized) {
                document.body.style.overflow = ""; // Restore scrolling
                svg.innerHTML = '<path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z" />';
            } else {
                document.body.style.overflow = "hidden"; // Lock scrolling again
                svg.innerHTML = '<path d="M19,13H5V11H19V13Z" />';
            }
        }

        function handleMetadataLoaded() {
            playerContainer.classList.add("paused");
            totalTimeEl.textContent = formatTime(audio.duration);
            audio.volume = volumeSlider.value;
            updateVolumeUI();
            audio.play().catch((e) => console.error("Autoplay prevented:", e));
        }
        function togglePlay() {
            audio.paused ? audio.play() : audio.pause();
        }
        function toggleMute() {
            audio.volume > 0
                ? ((lastVolume = audio.volume), (audio.volume = 0))
                : (audio.volume = lastVolume);
        }
        function handleTimeUpdate() {
            currentTimeEl.textContent = formatTime(audio.currentTime);
            progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        }
        function handleBufferUpdate() {
            if (audio.duration > 0)
                for (let i = 0; i < audio.buffered.length; i++)
                    if (
                        audio.buffered.start(i) <= audio.currentTime &&
                        audio.currentTime <= audio.buffered.end(i)
                    ) {
                        bufferedBar.style.width = `${(audio.buffered.end(i) / audio.duration) * 100}%`;
                        break;
                    }
        }
        function handleTimelineHover(e) {
            const rect = timelineContainer.getBoundingClientRect();
            hoverIndicator.style.width = `${(Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width) * 100}%`;
        }
        function handleTimelineSeek(e) {
            const rect = timelineContainer.getBoundingClientRect();
            audio.currentTime =
                (Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width) *
                audio.duration;
        }
        function updateVolumeUI() {
            volumeSlider.value = audio.volume;
            const icons = [
                ".high-volume-icon",
                ".low-volume-icon",
                ".muted-icon",
            ].map((s) => volumeBtn.querySelector(s));
            icons.forEach((i) => (i.style.display = "none"));
            if (audio.volume === 0 || audio.muted) icons[2].style.display = "block";
            else if (audio.volume < 0.5) icons[1].style.display = "block";
            else icons[0].style.display = "block";
        }
        function formatTime(t) {
            const r = new Date(t * 1000).toISOString().substr(11, 8);
            return r.startsWith("00:") ? r.substr(3) : r;
        }
        function downloadAudio() {
            if (!audio.src) return;
            const link = document.createElement("a");
            link.href = audio.src;
            link.download = currentFileName || "kemono-audio";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        function handleKeyboardShortcuts(e) {
            if (document.activeElement.tagName.toLowerCase() === "input") return;
            switch (e.key.toLowerCase()) {
                case "escape":
                    close();
                    break;
                case " ":
                    if (document.activeElement.tagName.toLowerCase() !== "button") {
                        e.preventDefault();
                        togglePlay();
                    }
                    break;
                case "m":
                    toggleMute();
                    break;
                case "arrowright":
                    audio.currentTime = Math.min(
                        audio.duration,
                        audio.currentTime + 5,
                    );
                    break;
                case "arrowleft":
                    audio.currentTime = Math.max(0, audio.currentTime - 5);
                    break;
            }
        }

        function open(url, fileName) {
            if (currentAudioUrl) URL.revokeObjectURL(currentAudioUrl);
            currentFileName = fileName;
            titleContainer.classList.remove("expanded");

            modalOverlay.classList.remove("minimized");
            minimizeBtn.querySelector("svg").innerHTML = '<path d="M19,13H5V11H19V13Z" />';

            titleEl.textContent = fileName;
            loaderContainer.style.display = "block";
            controlsContainer.style.display = "none";
            progressFill.style.width = "0%";
            progressText.textContent = "Initializing...";
            modalOverlay.style.display = "flex";

            const img = document.querySelector('.post__thumbnail img') ||
                document.querySelector('.post__content img') ||
                document.querySelector('.user-header__avatar img') ||
                document.querySelector('img.fancy-image__image');

            if (img && img.src) {
                const src = img.src;
                backdropEl.style.backgroundImage = `url('${src}')`;
                albumArtEl.style.backgroundImage = `url('${src}')`;
                albumArtEl.innerHTML = '';
            } else {
                backdropEl.style.backgroundImage = 'none';
                albumArtEl.style.backgroundImage = 'none';
                albumArtEl.innerHTML = genericMusicIcon;
            }

            setTimeout(() => modalOverlay.classList.add("show"), 10);
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", handleKeyboardShortcuts);

            activeRequest = GM_xmlhttpRequest({
                method: "GET",
                url,
                responseType: "blob",
                onprogress: (p) => {
                    if (p.lengthComputable) {
                        const percent = Math.round((p.loaded / p.total) * 100);
                        progressFill.style.width = `${percent}%`;
                        progressText.textContent = `Downloading... ${percent}% (${formatBytes(p.loaded)} / ${formatBytes(p.total)})`;
                    }
                },
                onload: (res) => {
                    activeRequest = null;
                    currentAudioUrl = URL.createObjectURL(res.response);
                    audio.src = currentAudioUrl;
                    audio.load();
                    loaderContainer.style.display = "none";
                    controlsContainer.style.display = "block";
                },
                onerror: () => {
                    activeRequest = null;
                    progressText.textContent = "Error: Could not load audio file.";
                },
                onabort: () => (activeRequest = null),
            });
        }

        function close() {
            if (activeRequest) activeRequest.abort();
            audio.pause();
            modalOverlay.classList.remove("show");
            setTimeout(() => {
                modalOverlay.style.display = "none";
                modalOverlay.classList.remove("minimized");
                if (currentAudioUrl) {
                    URL.revokeObjectURL(currentAudioUrl);
                    currentAudioUrl = null;
                    currentFileName = "";
                    audio.removeAttribute("src");
                    audio.load();
                }
            }, 300);
            document.body.style.overflow = "";
            document.removeEventListener("keydown", handleKeyboardShortcuts);
        }

        return { init, open };
    })();

    function initializeScript() {
        audioPlayer.init();
        document.body.addEventListener("click", (e) => {
            const link = e.target.closest(
                'a[href*=".wav?f="], a[href*=".mp3?f="]',
            );
            if (link) {
                e.preventDefault();
                e.stopPropagation();

                let title = "Audio Player";

                const titleElement = document.querySelector("h1.post__title");
                if (titleElement) {
                    title = titleElement.textContent.trim();
                }
                else {
                    try {
                        const urlParams = new URLSearchParams(link.search);
                        title = decodeURIComponent(urlParams.get("f")) || title;
                    } catch {
                    }
                }

                audioPlayer.open(link.href, title);
            }
        });
    }

    if (document.body) {
        initializeScript();
    } else {
        new MutationObserver((mutations, observer) => {
            if (document.body) {
                initializeScript();
                observer.disconnect();
            }
        }).observe(document.documentElement, { childList: true });
    }
})();