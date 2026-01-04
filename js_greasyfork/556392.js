// ==UserScript==
// @name         🎧 YouTube Audio Enhancer Pro V9.5
// @namespace    http://tampermonkey.net/
// @version      9.5
// @description  Audio Enhancer dengan Sinkronisasi Volume YouTube, UI Glassmorphism, dan Preset Aman.
// @author       Moryata
// @match        https://www.youtube.com/*
// @match        https://music.youtube.com/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556392/%F0%9F%8E%A7%20YouTube%20Audio%20Enhancer%20Pro%20V95.user.js
// @updateURL https://update.greasyfork.org/scripts/556392/%F0%9F%8E%A7%20YouTube%20Audio%20Enhancer%20Pro%20V95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'yt_audio_enhancer_v9_5';

    // ========== CONFIGURATION ==========
    const CONFIG = {
        snapThreshold: 50,
        presets: {
            dolby:   { volume: 110, surround: 30, bass: 8,  mid: -2, treble: 8,  clarity: 6 },
            cinema:  { volume: 115, surround: 20, bass: 12, mid: -1, treble: 4,  clarity: 5 },
            gaming:  { volume: 105, surround: 10, bass: 6,  mid: 4,  treble: 10, clarity: 8 },
            basshead:{ volume: 100, surround: 5,  bass: 15, mid: -3, treble: 2,  clarity: 4 },
            vocal:   { volume: 100, surround: 0,  bass: -4, mid: 8,  treble: 4,  clarity: 7 },
            flat:    { volume: 100, surround: 0,  bass: 0,  mid: 0,  treble: 0,  clarity: 0 }
        },
        defaults: {
            active: true,
            dockY: 150,
            dockSide: 'right',
            vals: { volume: 100, surround: 0, bass: 0, mid: 0, treble: 0, clarity: 0 }
        }
    };

    let state = {
        ctx: null,
        source: null,
        nodes: {},
        analyser: null,
        active: true,
        expanded: false,
        videoElement: null,
        vals: { ...CONFIG.defaults.vals },
        ...loadSettings()
    };

    // ========== TRUSTED TYPES ==========
    const policy = window.trustedTypes?.createPolicy('ytAudioEnhancerV95', {
        createHTML: (string) => string,
    }) || { createHTML: (string) => string };

    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : CONFIG.defaults;
        } catch { return CONFIG.defaults; }
    }

    function saveSettings() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            active: state.active,
            dockY: state.dockY,
            dockSide: state.dockSide,
            vals: state.vals
        }));
    }

    // ========== UI GENERATION ==========
    function createUI() {
        if (document.getElementById('yt-ae-root')) return;

        const root = document.createElement('div');
        root.id = 'yt-ae-root';
        root.className = `${state.dockSide} ${state.active ? '' : 'bypassed'}`;
        root.style.top = `${Math.min(window.innerHeight - 60, Math.max(0, state.dockY))}px`;

        const iconSVG = `
            <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>`;

        const styles = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
                #yt-ae-root {
                    position: fixed; z-index: 2147483647; font-family: 'Inter', sans-serif;
                    display: flex; align-items: flex-start; transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                    color: #fff; user-select: none; pointer-events: none;
                }
                #yt-ae-root * { pointer-events: auto; }
                #yt-ae-root.right { right: 0; flex-direction: row; }
                #yt-ae-root.left { left: 0; flex-direction: row-reverse; }
                #yt-ae-root:not(.expanded).right { transform: translateX(calc(100% - 8px)); opacity: 0.8; }
                #yt-ae-root:not(.expanded).left { transform: translateX(calc(-100% + 8px)); opacity: 0.8; }
                #yt-ae-root:not(.expanded):hover { transform: translateX(0); opacity: 1; }

                /* HANDLE */
                .ae-tab {
                    width: 44px; height: 44px; background: rgba(10, 10, 10, 0.6);
                    backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15);
                    display: flex; justify-content: center; align-items: center; cursor: grab;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 2; transition: all 0.3s ease;
                }
                .ae-tab svg { width: 20px; height: 20px; stroke: #aaa; transition: 0.3s; }
                #yt-ae-root.active .ae-tab svg { stroke: #00e5ff; filter: drop-shadow(0 0 6px #00e5ff); }
                #yt-ae-root.bypassed .ae-tab svg { stroke: #555; }
                #yt-ae-root.right .ae-tab { border-radius: 12px 0 0 12px; border-right: none; }
                #yt-ae-root.left .ae-tab { border-radius: 0 12px 12px 0; border-left: none; }

                /* PANEL */
                .ae-panel {
                    width: 290px; background: rgba(15, 15, 20, 0.90);
                    backdrop-filter: blur(25px); padding: 24px; display: none; flex-direction: column;
                    border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 60px rgba(0,0,0,0.6);
                }
                #yt-ae-root.expanded .ae-panel { display: flex; animation: slideIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
                #yt-ae-root.right .ae-panel { border-radius: 0 0 0 20px; border-right: none; }
                #yt-ae-root.left .ae-panel { border-radius: 0 0 20px 0; border-left: none; }
                @keyframes slideIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }

                /* HEADER & CANVAS */
                .ae-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .ae-title { font-size: 13px; font-weight: 800; letter-spacing: 1px; color: #fff; }
                .ae-version { font-size: 9px; color: #00e5ff; margin-left: 5px; background: rgba(0,229,255,0.1); padding: 2px 5px; border-radius: 4px; }
                canvas#ae-vis { width: 100%; height: 50px; background: rgba(0,0,0,0.2); border-radius: 8px; margin-bottom: 20px; border-bottom: 2px solid rgba(0,229,255,0.3); }

                /* CONTROLS */
                .ae-controls { display: flex; flex-direction: column; gap: 14px; }
                .ae-row { display: flex; flex-direction: column; gap: 6px; }
                .ae-label-row { display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; color: #ccc; }
                .ae-val { color: #00e5ff; }

                input[type=range] { -webkit-appearance: none; width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 4px; cursor: pointer; outline: none; }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; background: #fff; border-radius: 50%; transition: 0.2s; }
                input[type=range]:hover::-webkit-slider-thumb { background: #00e5ff; transform: scale(1.3); box-shadow: 0 0 15px rgba(0,229,255,0.6); }

                /* PRESETS */
                .ae-presets { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 24px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); }
                .ae-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #aaa; padding: 8px 0; font-size: 10px; font-weight: 700; border-radius: 6px; cursor: pointer; transition: 0.2s; }
                .ae-btn:hover { background: rgba(0, 229, 255, 0.15); color: #fff; border-color: #00e5ff; }

                /* TOGGLE */
                .ae-switch { position: relative; width: 34px; height: 18px; }
                .ae-switch input { opacity: 0; width: 0; height: 0; }
                .ae-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255,255,255,0.1); transition: .4s; border-radius: 20px; }
                .ae-slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 3px; bottom: 3px; background-color: #888; transition: .4s; border-radius: 50%; }
                input:checked + .ae-slider { background-color: rgba(0,229,255,0.3); }
                input:checked + .ae-slider:before { transform: translateX(16px); background-color: #00e5ff; }
            </style>`;

        const htmlContent = `
            <div class="ae-tab">${iconSVG}</div>
            <div class="ae-panel">
                <div class="ae-header">
                    <div style="display:flex; align-items:center;">
                        <span class="ae-title">AUDIO ENGINE</span>
                        <span class="ae-version">V9.5</span>
                    </div>
                    <label class="ae-switch">
                        <input type="checkbox" id="ae-active-toggle" ${state.active ? 'checked' : ''}>
                        <span class="ae-slider"></span>
                    </label>
                </div>
                <canvas id="ae-vis" width="290" height="50"></canvas>
                <div class="ae-controls">
                    ${renderSlider('volume', 'Master Volume', 0, 200, '%')}
                    ${renderSlider('bass', 'Deep Bass', -15, 15, 'dB')}
                    ${renderSlider('mid', 'Vocal / Mid', -10, 10, 'dB')}
                    ${renderSlider('treble', 'Treble / Air', -10, 10, 'dB')}
                    ${renderSlider('surround', 'Surround Width', 0, 100, '%')}
                    ${renderSlider('clarity', 'Crystalizer', 0, 10, 'Lv')}
                </div>
                <div class="ae-presets">
                    <button class="ae-btn" data-p="dolby">DOLBY</button>
                    <button class="ae-btn" data-p="cinema">MOVIE</button>
                    <button class="ae-btn" data-p="gaming">GAME</button>
                    <button class="ae-btn" data-p="basshead">BASS+</button>
                    <button class="ae-btn" data-p="vocal">VOCAL</button>
                    <button class="ae-btn" data-p="flat">RESET</button>
                </div>
            </div>
        `;

        root.innerHTML = policy.createHTML(styles + htmlContent);
        document.body.appendChild(root);

        // UI Events
        const tab = root.querySelector('.ae-tab');
        let isDrag = false, startY, startTop;

        tab.addEventListener('mousedown', e => {
            isDrag = true;
            startY = e.clientY;
            startTop = parseInt(root.style.top) || 100;
            document.body.style.userSelect = 'none';
            tab.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', e => {
            if (!isDrag) return;
            const y = startTop + (e.clientY - startY);
            state.dockY = y;
            root.style.top = `${y}px`;

            if(e.clientX < CONFIG.snapThreshold) state.dockSide = 'left';
            else if (e.clientX > window.innerWidth - CONFIG.snapThreshold) state.dockSide = 'right';

            root.className = `${state.dockSide} expanded`;
        });

        window.addEventListener('mouseup', () => {
            if (isDrag) {
                isDrag = false;
                document.body.style.userSelect = '';
                tab.style.cursor = 'grab';
                root.className = `${state.dockSide} ${state.expanded ? 'expanded' : ''}`;
                saveSettings();
            }
        });

        tab.addEventListener('click', () => {
            if(!isDrag) {
                state.expanded = !state.expanded;
                root.classList.toggle('expanded', state.expanded);
                if (state.expanded && state.ctx?.state === 'suspended') state.ctx.resume();
            }
        });

        document.getElementById('ae-active-toggle').addEventListener('change', e => {
            state.active = e.target.checked;
            root.classList.toggle('active', state.active);
            root.classList.toggle('bypassed', !state.active);
            updateRouting();
            saveSettings();
        });

        root.querySelectorAll('.ae-btn').forEach(btn => {
            btn.addEventListener('click', e => applyPreset(e.target.dataset.p));
        });

        root.querySelectorAll('input[type=range]').forEach(input => {
            input.addEventListener('input', e => {
                const key = e.target.id.split('-')[1];
                state.vals[key] = parseFloat(e.target.value);
                document.getElementById(`val-${key}`).innerText = state.vals[key];
                updateAudioParams();
                saveSettings();
            });
            input.addEventListener('dblclick', e => {
                const key = e.target.id.split('-')[1];
                let def = (key === 'volume') ? 100 : 0;
                state.vals[key] = def;
                e.target.value = def;
                document.getElementById(`val-${key}`).innerText = def;
                updateAudioParams();
                saveSettings();
            });
        });

        return root;
    }

    function renderSlider(key, label, min, max, unit) {
        return `
            <div class="ae-row">
                <div class="ae-label-row">
                    <span>${label}</span>
                    <span id="val-${key}" class="ae-val">${state.vals[key]}</span>
                </div>
                <input type="range" id="sl-${key}" min="${min}" max="${max}" value="${state.vals[key]}">
            </div>
        `;
    }

    function applyPreset(name) {
        const preset = CONFIG.presets[name];
        if (!preset) return;
        state.vals = { ...preset };
        Object.keys(preset).forEach(k => {
            const el = document.getElementById(`sl-${k}`);
            if (el) el.value = preset[k];
            const disp = document.getElementById(`val-${k}`);
            if (disp) disp.innerText = preset[k];
        });
        updateAudioParams();
        saveSettings();
    }

    // ========== AUDIO ENGINE (SYNCED) ==========
    function initAudioContext(video) {
        if (state.ctx && state.videoElement === video) return;
        if (!video) return;

        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!state.ctx) state.ctx = new AC();

            // 1. Capture Stream
            try {
                if (state.source) state.source.disconnect();

                // captureStream grabs RAW audio (ignoring YouTube volume slider)
                if (video.captureStream) {
                    state.source = state.ctx.createMediaStreamSource(video.captureStream());
                } else if (video.mozCaptureStream) {
                    state.source = state.ctx.createMediaStreamSource(video.mozCaptureStream());
                } else {
                    state.source = state.ctx.createMediaElementSource(video);
                }
            } catch (e) {
                console.warn("AudioEnhancer: Capture failed.", e);
                return;
            }

            state.videoElement = video;

            // 2. Setup Nodes
            state.nodes.gain = state.ctx.createGain();
            state.nodes.bass = state.ctx.createBiquadFilter();
            state.nodes.bass.type = 'lowshelf';
            state.nodes.bass.frequency.value = 90;

            state.nodes.mid = state.ctx.createBiquadFilter();
            state.nodes.mid.type = 'peaking';
            state.nodes.mid.frequency.value = 1500;
            state.nodes.mid.Q.value = 0.8;

            state.nodes.treble = state.ctx.createBiquadFilter();
            state.nodes.treble.type = 'highshelf';
            state.nodes.treble.frequency.value = 8000;

            state.nodes.compressor = state.ctx.createDynamicsCompressor();
            state.nodes.compressor.attack.value = 0.005;

            state.nodes.limiter = state.ctx.createDynamicsCompressor();
            state.nodes.limiter.threshold.value = -2.0;
            state.nodes.limiter.ratio.value = 40.0;

            state.analyser = state.ctx.createAnalyser();
            state.analyser.fftSize = 256;
            state.analyser.smoothingTimeConstant = 0.85;

            // 3. Connect & Start
            updateRouting();
            updateAudioParams(); // Applies initial volume sync
            drawVisualizer();

            // 4. SYNC LISTENERS (Fix for separated volume)
            // When YouTube volume/mute changes, update our gain node immediately
            video.addEventListener('volumechange', () => updateAudioParams());

            // Auto-Resume
            const resumeCtx = () => { if(state.ctx.state === 'suspended') state.ctx.resume(); };
            video.addEventListener('play', resumeCtx);
            document.addEventListener('click', resumeCtx);

        } catch (e) { console.error("AE Init Error:", e); }
    }

    function updateRouting() {
        if (!state.source || !state.nodes.gain) return;

        try {
            state.source.disconnect();
            state.nodes.gain.disconnect();
            state.nodes.bass.disconnect();
            state.nodes.mid.disconnect();
            state.nodes.treble.disconnect();
            state.nodes.compressor.disconnect();
            state.nodes.limiter.disconnect();
            state.analyser.disconnect();
        } catch(e) {}

        if (state.active) {
            state.source.connect(state.nodes.gain);
            state.nodes.gain.connect(state.nodes.bass);
            state.nodes.bass.connect(state.nodes.mid);
            state.nodes.mid.connect(state.nodes.treble);
            state.nodes.treble.connect(state.nodes.compressor);
            state.nodes.compressor.connect(state.nodes.limiter);
            state.nodes.limiter.connect(state.analyser);
            state.analyser.connect(state.ctx.destination);
        } else {
            state.source.connect(state.ctx.destination);
        }
    }

    function updateAudioParams() {
        if (!state.nodes.gain) return;
        const now = state.ctx.currentTime;
        const v = state.vals;
        const video = state.videoElement;

        // --- VOLUME SYNC LOGIC ---
        // Final Gain = (Script Volume %) * (YouTube Volume Slider) * (Unmuted?)
        // This bridges the gap between raw captureStream and the UI controls
        let ytVolume = 1;
        if (video) {
            ytVolume = video.muted ? 0 : video.volume;
        }

        const finalVolume = (v.volume / 100) * ytVolume;

        state.nodes.gain.gain.setTargetAtTime(finalVolume, now, 0.05);

        // EQ & Effects
        state.nodes.bass.gain.setTargetAtTime(v.bass, now, 0.1);
        state.nodes.mid.gain.setTargetAtTime(v.mid, now, 0.1);
        state.nodes.treble.gain.setTargetAtTime(v.treble, now, 0.1);

        state.nodes.compressor.threshold.value = -24 - (v.clarity * 2);
        state.nodes.compressor.ratio.value = 1 + (v.clarity * 0.4);
        state.nodes.compressor.knee.value = 30 - (v.clarity * 2);
        state.nodes.compressor.release.value = 0.1 + (v.surround * 0.005);
    }

    // ========== VISUALIZER ==========
    function drawVisualizer() {
        if (!state.active) {
            requestAnimationFrame(drawVisualizer);
            return;
        }

        const cvs = document.getElementById('ae-vis');
        if (cvs && state.analyser && state.expanded) {
            const ctx = cvs.getContext('2d');
            const bufferLength = state.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            state.analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, cvs.width, cvs.height);

            const gradient = ctx.createLinearGradient(0, cvs.height, 0, 0);
            gradient.addColorStop(0, '#0055ff');
            gradient.addColorStop(0.5, '#00e5ff');
            gradient.addColorStop(1, '#ffffff');

            const barWidth = (cvs.width / bufferLength) * 2.2;
            let x = 0;

            ctx.fillStyle = gradient;

            for (let i = 0; i < bufferLength; i++) {
                if (i > bufferLength * 0.8) break;
                const val = dataArray[i];
                const barHeight = (val / 255) * cvs.height;
                if (barHeight > 2) ctx.fillRect(x, cvs.height - barHeight, barWidth, barHeight);
                x += barWidth + 1.5;
            }
        }
        requestAnimationFrame(drawVisualizer);
    }

    // ========== INIT ==========
    function checkVideo() {
        const video = document.querySelector('video');
        if (video && video !== state.videoElement) {
            if(video.readyState >= 1) initAudioContext(video);
            else video.addEventListener('loadedmetadata', () => initAudioContext(video), {once:true});
        }
    }

    createUI();
    const observer = new MutationObserver(() => checkVideo());
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(checkVideo, 2000);

})();