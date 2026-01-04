// ==UserScript==
// @name         Universal Video Caption (Sidebar UI)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Overlay custom subtitles (.srt) on any HTML5 video. Interactive elements moved to a persistent sidebar.
// @author       an-swe
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559042/Universal%20Video%20Caption%20%28Sidebar%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559042/Universal%20Video%20Caption%20%28Sidebar%20UI%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. CSS Styles ---
    const STYLES = `
        /* --- Overlay (Ghost Mode) --- */
        .uvc-ghost-container {
            position: absolute;
            pointer-events: none;
            z-index: 2147483646;
            overflow: hidden;
        }

        .uvc-overlay {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            font-family: Arial, sans-serif;
            font-weight: bold;
            text-shadow: 2px 2px 2px #000;
            border-radius: 5px;
            pointer-events: none;
            transition: opacity 0.2s ease-out;
            width: 80%;
            padding: 5px 10px;
            bottom: 5%;
            height: fit-content;
            width: fit-content;
        }

        .uvc-prev-line {
            font-size: 0.8em;
            display: block;
            margin-bottom: 5px;
        }

        .uvc-drag-over {
            outline: 5px dashed #007bff;
            outline-offset: -5px;
            background-color: rgba(0, 123, 255, 0.1);
        }

        /* --- Theatre Mode (Custom Player) --- */
        .uvc-custom-player-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: calc(100% - 320px); /* Occupy space left of sidebar */
            height: 100vh;
            background: #000;
            z-index: 2147483646; /* Just below sidebar */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        /* If sidebar is closed, take full width */
        body.uvc-sidebar-closed .uvc-custom-player-wrapper {
            width: 100%;
        }

        .uvc-custom-player-wrapper:fullscreen {
            width: 100vw;
            height: 100vh;
            z-index: 2147483647;
        }

        .uvc-custom-canvas {
            width: 100%;
            height: 100%;
            object-fit: contain;
            background: #000;
        }

        .uvc-custom-controls {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 10px;
            background: rgba(0,0,0,0.7);
            display: flex;
            gap: 10px;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .uvc-custom-player-wrapper:hover .uvc-custom-controls { opacity: 1; }

        .uvc-ctrl-btn {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 5px;
        }
        .uvc-ctrl-btn:hover { color: #007bff; }

        .uvc-seek-bar {
            flex-grow: 1;
            cursor: pointer;
        }

        .uvc-time-display {
            font-family: monospace;
            color: #ddd;
            font-size: 12px;
        }

        /* Sidebar Styles */
        .uvc-sidebar-toggle {
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            background: #333;
            color: #eee;
            padding: 10px 5px;
            border-radius: 5px 0 0 5px;
            cursor: pointer;
            z-index: 2147483647;
            font-family: sans-serif;
            font-size: 12px;
            box-shadow: -2px 0 5px rgba(0,0,0,0.5);
            writing-mode: vertical-rl;
            text-orientation: mixed;
            border: 1px solid #444;
            border-right: none;
        }

        .uvc-sidebar {
            position: fixed;
            top: 0;
            right: -320px; /* Hidden by default */
            width: 320px;
            height: 100vh;
            background-color: #1a1a1a;
            color: #eee;
            z-index: 2147483647;
            box-shadow: -5px 0 15px rgba(0,0,0,0.7);
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
            font-family: sans-serif;
            font-size: 13px;
            border-left: 1px solid #333;
        }

        .uvc-sidebar.open {
            right: 0;
        }

        .uvc-sidebar-header {
            padding: 15px;
            background: #252525;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
        }

        .uvc-sidebar-scroll {
            flex-grow: 1;
            overflow-y: auto;
            padding: 0;
            display: flex;
            flex-direction: column;
        }

        .uvc-section {
            padding: 15px;
            border-bottom: 1px solid #333;
        }

        .uvc-section-title {
            font-weight: bold;
            color: #aaa;
            margin-bottom: 10px;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
        }

        .uvc-row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
        .uvc-row label { font-size: 12px; color: #ccc; display: flex; justify-content: space-between; }
        .uvc-input { background: #333; border: 1px solid #444; color: white; padding: 4px; border-radius: 4px; width: 100%; box-sizing: border-box; }
        .uvc-checkbox { cursor: pointer; margin-left: 8px; }

        .uvc-btn { background: #007bff; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; width: 100%; text-align: center; }
        .uvc-btn:hover { background: #0056b3; }
        .uvc-btn.secondary { background: #444; border: 1px solid #555; }
        .uvc-btn.secondary:hover { background: #555; }

        /* Timeline Specifics */
        .uvc-timeline-container {
            flex-grow: 1;
            overflow-y: auto;
            background: #111;
        }
        .uvc-ts-row { padding: 8px 12px; border-bottom: 1px solid #222; cursor: pointer; font-size: 12px; line-height: 1.4; }
        .uvc-ts-row:hover { background: #2a2a2a; }
        .uvc-ts-row.active { background: #007bff; color: white; border-left: 4px solid #fff; }
        .uvc-ts-meta { color: #888; margin-bottom: 3px; font-family: monospace; font-size: 11px; }
        .uvc-ts-row.active .uvc-ts-meta { color: #ddd; }

        /* Collapsible details styling */
        details { margin-bottom: 5px; }
        details > summary { cursor: pointer; color: #bbb; padding: 5px 0; font-weight: bold; outline: none; }
        details > summary:hover { color: #fff; }
        details[open] > summary { border-bottom: 1px solid #333; margin-bottom: 10px; }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);


    // --- 2. Helpers ---
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '00:00:00';
        const date = new Date(0);
        date.setMilliseconds(seconds * 1000);
        return date.toISOString().substr(11, 12);
    };

    const parseSRT = (text) => {
        const subs = [];
        const pattern = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n\n|\n*$)/g;
        const timeToSec = (t) => {
            const [h, m, s] = t.split(':');
            return (+h) * 3600 + (+m) * 60 + parseFloat(s.replace(',', '.'));
        };

        const normalizedText = text.replace(/\r\n|\r/g, '\n').trim();
        let lastIndex = 0;
        let match;

        while ((match = pattern.exec(normalizedText)) !== null) {
            lastIndex = match.index + match[0].length;
             subs.push({
                 start: timeToSec(match[2]),
                 end: timeToSec(match[3]),
                 text: match[4].replace(/\n/g, '<br>')
             });
         }

         if (subs.length === 0 && normalizedText.trim().length > 0) {
             throw new Error("SRT format error: No valid subtitle entries found.");
         }
        return subs;
    };

    const sanitizeSubtitleText = (text) => {
        text = text.replace(/\{[^}]*\}/g, '').trim();
        text = text.replace(/<\/?[^>]+(>|$)/g, '').trim();
        return text;
    };

    const getUrlKey = () => {
        const url = window.location.href.split('?')[0].split('#')[0];
        return 'uvc_cache_' + btoa(url);
    };

    // --- 3. Persistence & Config ---
    const DEFAULT_CONFIG = {
        fontSizeRatio: 3.5,
        color: '#ffffff',
        bgColor: '#000000',
        bgOpacity: 70,
        offsetMs: 0,
        dualLineEnabled: false,
        dualLineOpacity: 60,
        alignTop: false
    };

    const getConfig = () => {
        try {
            const saved = JSON.parse(localStorage.getItem('uvc_config'));
            return { ...DEFAULT_CONFIG, ...(saved || {}) };
        } catch { return DEFAULT_CONFIG; }
    };

    const saveConfig = (cfg) => localStorage.setItem('uvc_config', JSON.stringify(cfg));

    const constructBgColor = (color, opacity) => {
        const hexMatch = color.match(/^#?([a-f\d]{6})$/i);
        if (hexMatch) {
            const bigint = parseInt(hexMatch[1], 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
        }
        return `rgba(0, 0, 0, ${opacity / 100})`;
    };


    // --- 4. The Core Class ---
    class CaptionInstance {
        constructor(video) {
            this.video = video;
            this.subs = [];
            this.config = getConfig();

            // UI Elements
            this.overlay = null;
            this.ghostContainer = null;
            this.sidebar = null;
            this.timelineContainer = null;
            this.toggleBtn = null;
            this.statusSpan = null;

            CaptionInstance.dragDropSetup = CaptionInstance.dragDropSetup || false;

            // State
            this.cachedIndex = 0;
            this.fileInput = null;
            this.isSidebarOpen = false;
            this.isCustomPlayerActive = false;
            this.customPlayerWrapper = null;
            this.customCanvas = null;
            this.ctx = null;
            this.animationFrameId = null;

            this.init();
        }

        init() {
            // 1. Create Ghost Container (attached to body, overlays video)
            this.ghostContainer = document.createElement('div');
            this.ghostContainer.className = 'uvc-ghost-container';
            document.body.appendChild(this.ghostContainer);

            // 2. Create Overlay (Text) inside Ghost
            this.overlay = document.createElement('div');
            this.overlay.className = 'uvc-overlay';
            this.updateStyles();
            this.ghostContainer.appendChild(this.overlay);

            // 3. Input handling (Create first so UI can reference it)
            this.fileInput = document.createElement('input');
            this.fileInput.type = 'file';
            this.fileInput.accept = '.srt';
            this.fileInput.style.display = 'none';
            this.fileInput.onchange = (e) => this.handleSrtFile(e.target.files[0], true);
            document.body.appendChild(this.fileInput);

            // 4. Build The Persistent Sidebar
            this.buildSidebarUI();

            // 5. Listeners & Position Tracking
            this.video.addEventListener('timeupdate', () => this.onTimeUpdate());
            this.video.addEventListener('seeking', () => this.onTimeUpdate());
            new ResizeObserver(() => this.updateStyles()).observe(this.video);

            // Start Ghost Tracking
            this.trackVideoPosition();
            window.addEventListener('resize', () => this.trackVideoPosition());
            window.addEventListener('scroll', () => this.trackVideoPosition(), true);

            // Fullscreen handling
            document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
            document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange()); // Safari/Old Chrome

            // 6. Check Cache
            if (!CaptionInstance.dragDropSetup) {
                this.setupGlobalDragAndDrop(this.handleSrtFile.bind(this));
                CaptionInstance.dragDropSetup = true;
            }
            if (!this.loadFromCache()) {
                this.updateControlStatus(false);
            }
        }

        handleFullscreenChange() {
            const fsEl = document.fullscreenElement || document.webkitFullscreenElement;

            if (fsEl) {
                // Entered Fullscreen
                this.isFullscreen = true;

                // If the fullscreen element is NOT the video itself (e.g. a wrapper div),
                // we move the ghost container inside it to ensure visibility.
                if (fsEl !== this.video) {
                    fsEl.appendChild(this.ghostContainer);
                    this.ghostContainer.style.position = 'absolute';
                    this.ghostContainer.style.top = '0';
                    this.ghostContainer.style.left = '0';
                    this.ghostContainer.style.width = '100%';
                    this.ghostContainer.style.height = '100%';
                    this.ghostContainer.style.zIndex = '2147483647';
                } else {
                    // If the video ITSELF is fullscreen, we can't append child to it.
                    // We keep it on body, but it might be hidden by the browser's top layer.
                    // Best effort: ensure max z-index.
                    // Some browsers might show it if we are lucky, but usually not.
                    // A robust fix for raw video fullscreen requires wrapping the video, which is invasive.
                    // For now, we stick to body and hope.
                    document.body.appendChild(this.ghostContainer);
                }
            } else {
                // Exited Fullscreen
                this.isFullscreen = false;
                document.body.appendChild(this.ghostContainer);
                // trackVideoPosition will resume updating styles
            }

            // Force an update
            this.trackVideoPosition();
        }

        // --- UI CONSTRUCTION ---
        buildSidebarUI() {
            // 1. Sidebar Container
            this.sidebar = document.createElement('div');
            this.sidebar.className = 'uvc-sidebar';

            // 2. Toggle Button
            this.toggleBtn = document.createElement('div');
            this.toggleBtn.className = 'uvc-sidebar-toggle';
            this.toggleBtn.innerHTML = '⚙️ Captions';
            this.toggleBtn.onclick = () => this.toggleSidebar();

            // 3. Sidebar Header
            const header = document.createElement('div');
            header.className = 'uvc-sidebar-header';
            header.innerHTML = `
                <span>Universal Captions</span>
                <span id="uvc-close-sidebar" style="cursor:pointer; font-size:16px;">✕</span>
            `;

            // 4. Main Scroll Area
            const scrollArea = document.createElement('div');
            scrollArea.className = 'uvc-sidebar-scroll';

            // --- Controls Section ---
            const controls = document.createElement('div');
            controls.className = 'uvc-section';
            controls.innerHTML = `
                <div class="uvc-row" style="display:flex; gap:10px; align-items:center;">
                    <button class="uvc-btn" id="uvc-upload-btn">📁 Load SRT</button>
                    <button class="uvc-btn secondary" id="uvc-theatre-btn" title="Theatre Mode">🎭</button>
                </div>
                <div id="uvc-status-text" style="color:#888; font-size:12px; margin-top:5px;">Waiting...</div>
            `;
            controls.querySelector('#uvc-upload-btn').onclick = () => this.fileInput.click();
            controls.querySelector('#uvc-theatre-btn').onclick = () => this.toggleTheatreMode();

            // --- Section: Configuration (Collapsible) ---
            const configSection = document.createElement('div');
            configSection.className = 'uvc-section';
            configSection.innerHTML = `
                <details open>
                    <summary>Display Settings</summary>

                    <div class="uvc-row">
                        <label>Size (%) <span id="val-size">${this.config.fontSizeRatio}</span></label>
                        <input type="range" class="uvc-input" min="1" max="10" step="0.1" value="${this.config.fontSizeRatio}" id="inp-size">
                    </div>

                    <div class="uvc-row">
                        <label>Sync Offset (ms)</label>
                        <input type="number" class="uvc-input" value="${this.config.offsetMs}" step="100" id="inp-offset">
                    </div>

                    <div class="uvc-row">
                        <label>Background Opacity <span id="val-opacity">${this.config.bgOpacity}%</span></label>
                        <input type="range" class="uvc-input" min="0" max="100" step="5" value="${this.config.bgOpacity}" id="inp-opacity">
                    </div>

                    <div style="display: flex; gap: 5px;">
                        <input type="color" class="uvc-input" value="${this.config.bgColor}" id="inp-bgColor" title="Background Color" style="height:30px;">
                        <input type="color" class="uvc-input" value="${this.config.color}" id="inp-fontColor" title="Font Color" style="height:30px;">
                    </div>

                    <div style="margin-top:10px; display:flex; justify-content:space-between;">
                        <label style="cursor:pointer"><input type="checkbox" id="inp-align-top" ${this.config.alignTop ? 'checked' : ''}> Align Top</label>
                        <label style="cursor:pointer"><input type="checkbox" id="inp-dual-enabled" ${this.config.dualLineEnabled ? 'checked' : ''}> Dual Line</label>
                    </div>
                </details>
            `;

            // --- Section: Timeline Container ---
            const timelineSection = document.createElement('div');
            timelineSection.className = 'uvc-timeline-container';
            timelineSection.id = 'uvc-timeline';
            timelineSection.innerHTML = `<div style="padding:20px; text-align:center; color:#555;">Subtitles will appear here</div>`;

            // Assemble
            scrollArea.appendChild(controls);
            scrollArea.appendChild(configSection);
            scrollArea.appendChild(timelineSection);

            this.sidebar.appendChild(header);
            this.sidebar.appendChild(scrollArea);

            document.body.appendChild(this.toggleBtn);
            document.body.appendChild(this.sidebar);

            // References
            this.statusSpan = controls.querySelector('#uvc-status-text');
            this.timelineContainer = timelineSection;

            // --- Binding Events ---
            this.bindSidebarEvents(configSection, header);
        }

        bindSidebarEvents(configSection, header) {
            // Close / Open
            header.querySelector('#uvc-close-sidebar').onclick = () => this.toggleSidebar(false);

            // Settings Inputs
            const updateVal = (id, val) => configSection.querySelector(id).innerText = val;

            configSection.querySelector('#inp-size').oninput = (e) => {
                this.config.fontSizeRatio = parseFloat(e.target.value);
                updateVal('#val-size', this.config.fontSizeRatio);
                this.updateStyles();
                saveConfig(this.config);
            };

            configSection.querySelector('#inp-offset').onchange = (e) => {
                const newOffset = parseInt(e.target.value, 10);
                if (isNaN(newOffset)) return;

                // Adjust subs
                const delta = (newOffset - this.config.offsetMs) / 1000;
                this.subs.forEach(s => { s.start += delta; s.end += delta; });

                this.config.offsetMs = newOffset;
                saveConfig(this.config);
                this.renderTimeline();
                this.onTimeUpdate();
            };

            configSection.querySelector('#inp-opacity').oninput = (e) => {
                this.config.bgOpacity = parseInt(e.target.value);
                updateVal('#val-opacity', this.config.bgOpacity + '%');
                this.updateStyles();
                saveConfig(this.config);
            };

            configSection.querySelector('#inp-bgColor').oninput = (e) => {
                this.config.bgColor = e.target.value;
                this.updateStyles();
                saveConfig(this.config);
            };

            configSection.querySelector('#inp-fontColor').oninput = (e) => {
                this.config.color = e.target.value;
                this.updateStyles();
                saveConfig(this.config);
            };

            configSection.querySelector('#inp-align-top').onchange = (e) => {
                this.config.alignTop = e.target.checked;
                this.updateStyles();
                saveConfig(this.config);
            };

            configSection.querySelector('#inp-dual-enabled').onchange = (e) => {
                this.config.dualLineEnabled = e.target.checked;
                this.onTimeUpdate();
                saveConfig(this.config);
            };
        }

        toggleSidebar(forceState) {
            if (typeof forceState !== 'undefined') {
                this.isSidebarOpen = forceState;
            } else {
                this.isSidebarOpen = !this.isSidebarOpen;
            }

            if (this.isSidebarOpen) {
                this.sidebar.classList.add('open');
                document.body.classList.remove('uvc-sidebar-closed');
                // Scroll active into view when opening
                this.highlightSidebar(this.cachedIndex, 'auto');
            } else {
                this.sidebar.classList.remove('open');
                document.body.classList.add('uvc-sidebar-closed');
            }
        }

        renderTimeline() {
            if (!this.subs.length) return;

            this.timelineContainer.innerHTML = '';

            this.subs.forEach((s, i) => {
                const row = document.createElement('div');
                row.className = 'uvc-ts-row';
                row.id = `ts-row-${i}`;
                row.innerHTML = `
                    <div class="uvc-ts-meta">${formatTime(s.start)} &rarr; ${formatTime(s.end)}</div>
                    <div>${s.text}</div>
                `;
                row.onclick = () => {
                    this.video.currentTime = Math.max(0, s.start);
                    this.video.play();
                };
                this.timelineContainer.appendChild(row);
            });
        }

        // --- THEATRE MODE (Custom Player) ---
        toggleTheatreMode() {
            if (this.isCustomPlayerActive) {
                this.closeTheatreMode();
            } else {
                this.openTheatreMode();
            }
        }

        openTheatreMode() {
            if (this.isCustomPlayerActive) return;
            this.isCustomPlayerActive = true;

            // Create Wrapper
            this.customPlayerWrapper = document.createElement('div');
            this.customPlayerWrapper.className = 'uvc-custom-player-wrapper';

            // Create Canvas
            this.customCanvas = document.createElement('canvas');
            this.customCanvas.className = 'uvc-custom-canvas';
            this.ctx = this.customCanvas.getContext('2d');

            // Create Controls
            const controls = document.createElement('div');
            controls.className = 'uvc-custom-controls';

            // Play/Pause
            const playBtn = document.createElement('button');
            playBtn.className = 'uvc-ctrl-btn';
            playBtn.innerHTML = this.video.paused ? '▶' : '⏸';
            playBtn.onclick = () => this.togglePlay();
            this.customControls = { playBtn };

            // Seek Bar
            const seekBar = document.createElement('input');
            seekBar.type = 'range';
            seekBar.className = 'uvc-seek-bar';
            seekBar.min = 0;
            seekBar.max = this.video.duration || 100;
            seekBar.value = this.video.currentTime;
            seekBar.oninput = (e) => { this.video.currentTime = e.target.value; };
            this.customControls.seekBar = seekBar;

            // Time Display
            const timeDisplay = document.createElement('div');
            timeDisplay.className = 'uvc-time-display';
            timeDisplay.innerText = '00:00 / 00:00';
            this.customControls.timeDisplay = timeDisplay;

            // Fullscreen Button
            const fsBtn = document.createElement('button');
            fsBtn.className = 'uvc-ctrl-btn';
            fsBtn.innerHTML = '⛶';
            fsBtn.onclick = () => this.toggleCustomFullscreen();

            // Close Button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'uvc-ctrl-btn';
            closeBtn.innerHTML = '✕';
            closeBtn.onclick = () => this.closeTheatreMode();

            controls.appendChild(playBtn);
            controls.appendChild(seekBar);
            controls.appendChild(timeDisplay);
            controls.appendChild(fsBtn);
            controls.appendChild(closeBtn);

            this.customPlayerWrapper.appendChild(this.customCanvas);
            this.customPlayerWrapper.appendChild(controls);
            document.body.appendChild(this.customPlayerWrapper);

            // Move Ghost Container to Wrapper
            this.customPlayerWrapper.appendChild(this.ghostContainer);
            this.ghostContainer.style.zIndex = '2147483648'; // Above canvas

            // Start Loop
            this.renderLoop();
        }

        closeTheatreMode() {
            if (!this.isCustomPlayerActive) return;
            this.isCustomPlayerActive = false;

            if (document.fullscreenElement) document.exitFullscreen();

            cancelAnimationFrame(this.animationFrameId);

            // Move Ghost back to body
            document.body.appendChild(this.ghostContainer);

            this.customPlayerWrapper.remove();
            this.customPlayerWrapper = null;
            this.customCanvas = null;
            this.ctx = null;
        }

        togglePlay() {
            if (this.video.paused) this.video.play(); else this.video.pause();
            this.updateCustomControls();
        }

        toggleCustomFullscreen() {
            if (!document.fullscreenElement) {
                this.customPlayerWrapper.requestFullscreen().catch(err => console.log(err));
            } else {
                document.exitFullscreen();
            }
        }

        updateCustomControls() {
            if (!this.customControls) return;
            this.customControls.playBtn.innerHTML = this.video.paused ? '▶' : '⏸';
            this.customControls.seekBar.value = this.video.currentTime;
            this.customControls.timeDisplay.innerText = formatTime(this.video.currentTime) + ' / ' + formatTime(this.video.duration);
        }

        renderLoop() {
            if (!this.isCustomPlayerActive) return;

            if (this.video.readyState >= 2) {
                this.customCanvas.width = this.video.videoWidth;
                this.customCanvas.height = this.video.videoHeight;
                this.ctx.drawImage(this.video, 0, 0, this.customCanvas.width, this.customCanvas.height);
            }

            this.updateCustomControls();
            this.animationFrameId = requestAnimationFrame(() => this.renderLoop());
        }

        // --- GHOST TRACKING ---
        trackVideoPosition() {
            if (!this.video || !this.ghostContainer) return;

            // If Theatre Mode is active, the ghost is inside the wrapper (relative/absolute)
            // We just need to ensure it matches the canvas size
            if (this.isCustomPlayerActive && this.customCanvas) {
                // In theatre mode, the canvas is object-fit: contain.
                // We need to calculate the actual displayed video rect within the wrapper.
                // For simplicity in this PoC, we'll just match the wrapper size,
                // but ideally we'd calculate the aspect ratio box.
                // Since ghost is child of wrapper, top/left 0 is fine if wrapper is relative.
                // But wrapper is flex...

                // Let's just set it to 100% of wrapper for now.
                this.ghostContainer.style.position = 'absolute';
                this.ghostContainer.style.top = '0';
                this.ghostContainer.style.left = '0';
                this.ghostContainer.style.width = '100%';
                this.ghostContainer.style.height = '100%';

                requestAnimationFrame(() => this.trackVideoPosition());
                return;
            }

            // Normal Mode Tracking
            const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
            const isWrapperFullscreen = fsEl && fsEl !== this.video;

            if (!isWrapperFullscreen) {
                const rect = this.video.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

                this.ghostContainer.style.position = 'absolute';
                this.ghostContainer.style.width = rect.width + 'px';
                this.ghostContainer.style.height = rect.height + 'px';
                this.ghostContainer.style.top = (rect.top + scrollTop) + 'px';
                this.ghostContainer.style.left = (rect.left + scrollLeft) + 'px';
                this.ghostContainer.style.zIndex = '2147483646';
            }

            requestAnimationFrame(() => this.trackVideoPosition());
        }

        // --- SUBTITLE LOGIC ---
        processSubtitles(srtText) {
            const parsed = parseSRT(srtText);
            const offsetSec = this.config.offsetMs / 1000;
            this.subs = parsed.map(s => ({
                start: s.start + offsetSec,
                end: s.end + offsetSec,
                text: sanitizeSubtitleText(s.text)
            }));
            this.cachedIndex = 0;
            this.renderTimeline();
        }

        updateControlStatus(isLoaded) {
            if (isLoaded) {
                this.statusSpan.innerHTML = '✅ Loaded (' + this.subs.length + ' lines)';
                this.statusSpan.style.color = '#4CAF50';
                this.toggleSidebar(true); // Auto open sidebar on load
            } else {
                this.statusSpan.innerHTML = 'No subtitles loaded';
                this.statusSpan.style.color = '#bbb';
            }
        }

        updateStyles() {
            if (!this.overlay) return;
            const h = this.video.offsetHeight;
            this.overlay.style.fontSize = (h * (this.config.fontSizeRatio / 100)) + 'px';
            this.overlay.style.color = this.config.color;
            this.overlay.style.backgroundColor = constructBgColor(this.config.bgColor, this.config.bgOpacity);

            if (this.config.alignTop) {
                this.overlay.style.top = '5%';
                this.overlay.style.bottom = '';
            } else {
                this.overlay.style.bottom = '5%';
                this.overlay.style.top = '';
            }
        }

        loadFromCache() {
            const srtText = localStorage.getItem(getUrlKey());
            if (srtText) {
                try {
                    this.processSubtitles(srtText);
                    this.updateControlStatus(true);
                    this.statusSpan.innerHTML = '🧠 Loaded from Cache';
                    return true;
                } catch (err) {
                    localStorage.removeItem(getUrlKey());
                }
            }
            return false;
        }

        handleSrtFile(file, resetInput = false) {
            if (!file || !file.name.toLowerCase().endsWith('.srt')) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const srtText = evt.target.result;
                    this.processSubtitles(srtText);
                    localStorage.setItem(getUrlKey(), srtText);
                    this.updateControlStatus(true);
                    this.onTimeUpdate();
                } catch (err) {
                    alert('Failed to parse SRT');
                }
            };
            reader.readAsText(file);
            if (resetInput && this.fileInput) this.fileInput.value = '';
        }

        setupGlobalDragAndDrop(handler) {
            const body = document.body;
            let dragCounter = 0;
            const preventDefaults = (e) => { e.preventDefault(); e.stopPropagation(); };
            const handleDrop = (e) => {
                body.classList.remove('uvc-drag-over');
                const dt = e.dataTransfer;
                const files = dt.files;
                if (files.length > 0) handler(files[0], true);
            };

            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                document.addEventListener(eventName, preventDefaults, false);
            });

            document.addEventListener('dragenter', (e) => {
                dragCounter++;
                if (e.dataTransfer && Array.from(e.dataTransfer.items).some(i => i.kind === 'file')) {
                    body.classList.add('uvc-drag-over');
                }
            }, false);

            document.addEventListener('dragleave', () => {
                dragCounter--;
                if (dragCounter <= 0) body.classList.remove('uvc-drag-over');
            }, false);

            document.addEventListener('drop', handleDrop, false);
        }

        onTimeUpdate() {
            if (!this.subs.length) return;

            const time = this.video.currentTime;
            let activeSub = null;

            if (this.subs[this.cachedIndex] && time >= this.subs[this.cachedIndex].start && time <= this.subs[this.cachedIndex].end) {
                activeSub = this.subs[this.cachedIndex];
            }
            else if (this.subs[this.cachedIndex + 1] && time >= this.subs[this.cachedIndex + 1].start && time <= this.subs[this.cachedIndex + 1].end) {
                this.cachedIndex++;
                activeSub = this.subs[this.cachedIndex];
            }
            else {
                let foundIndex = this.subs.findIndex(s => time >= s.start && time <= s.end);
                if (foundIndex !== -1) {
                    this.cachedIndex = foundIndex;
                    activeSub = this.subs[foundIndex];
                }

                if (!activeSub) {
                    for (let i = this.subs.length - 1; i >= 0; i--) {
                        if (time >= this.subs[i].start) {
                            this.cachedIndex = i;
                            activeSub = this.subs[i];
                            break;
                        }
                    }
                }
             }

            let overlayContent = '';

            if (activeSub) {
                const currentIndex = this.cachedIndex;
                if (this.config.dualLineEnabled && currentIndex > 0) {
                    const prevSub = this.subs[currentIndex - 1];
                    const sanitizedText = sanitizeSubtitleText(prevSub.text);
                    const opacityStyle = `opacity: ${this.config.dualLineOpacity / 100};`;
                    overlayContent += `<span class="uvc-prev-line" style="${opacityStyle}">${sanitizedText}</span>`;
                }

                const sanitizedMainText = sanitizeSubtitleText(activeSub.text);
                overlayContent += `<span>${sanitizedMainText}</span>`;

                this.overlay.innerHTML = overlayContent;
                this.overlay.style.display = 'block';
                const behavior = this.video.seeking ? 'smooth' : null;
                this.highlightSidebar(this.cachedIndex, behavior);
            } else if (this.overlay.style.display === 'block') {
                this.overlay.style.display = 'none';
            }
        }

        highlightSidebar(index, scrollBehavior = null) {
            if (!this.timelineContainer) return;

            const activeClass = 'active';
            const prev = this.timelineContainer.querySelector('.' + activeClass);
            if (prev) prev.classList.remove(activeClass);

            const curr = document.getElementById(`ts-row-${index}`);
            if (curr) {
                curr.classList.add(activeClass);
            }
        }
    }

    // --- 5. Initialization ---
    const seenVideos = new WeakSet();

    const initVideo = (video) => {
        if (seenVideos.has(video)) return;
        if (video.offsetWidth < window.innerWidth / 4) return;
        seenVideos.add(video);
        new CaptionInstance(video);
    };

    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeName === 'VIDEO') initVideo(node);
                if (node.querySelectorAll) node.querySelectorAll('video').forEach(initVideo);
            });
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
    document.querySelectorAll('video').forEach(initVideo);

})();