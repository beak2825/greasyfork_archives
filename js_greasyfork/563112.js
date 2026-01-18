// ==UserScript==
// @name         SoundCloud Real Time Slowed & Reverb / Nightcore Maker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds A Button To Change Speed And Reverb Of A Song
// @author       PlasmaTi
// @match        https://soundcloud.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563112/SoundCloud%20Real%20Time%20Slowed%20%20Reverb%20%20Nightcore%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/563112/SoundCloud%20Real%20Time%20Slowed%20%20Reverb%20%20Nightcore%20Maker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main() {
        window.SC_FX = {
            audio: null,
            ctx: null,
            source: null,
            reverbNode: null,
            filterNode: null,
            wet: null,

            // State
            speed: 1.0,
            reverb: 0,
            mode: 'vinyl',

            engineReady: false
        };

        // --- 1. KERNEL HOOK ---
        const originalPlay = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function() {
            if (window.SC_FX.audio !== this) {
                window.SC_FX.audio = this;
                if (!this.crossOrigin) this.crossOrigin = "anonymous";

                this.addEventListener('durationchange', applyCurrentSettings);
                this.addEventListener('loadeddata', applyCurrentSettings);
                this.addEventListener('playing', () => {
                    if (window.SC_FX.reverb > 0) initAudioEngine();
                    applyCurrentSettings();
                });

                this.addEventListener('emptied', cleanupAudioGraph);
            }

            applyCurrentSettings();

            if (window.SC_FX.ctx && window.SC_FX.ctx.state === 'suspended') {
                window.SC_FX.ctx.resume();
            }

            return originalPlay.apply(this, arguments);
        };

        // --- 2. SETTINGS LOGIC ---
        function applyCurrentSettings() {
            const S = window.SC_FX;
            const a = S.audio;
            if (!a) return;

            try {
                // Apply Speed
                if (Math.abs(a.playbackRate - S.speed) > 0.001) {
                    a.playbackRate = S.speed;
                }

                // Apply Pitch Mode
                const shouldPreserve = (S.mode === 'tempo');
                if (a.preservesPitch !== shouldPreserve) a.preservesPitch = shouldPreserve;
                if (a.mozPreservesPitch !== shouldPreserve) a.mozPreservesPitch = shouldPreserve;
                if (a.webkitPreservesPitch !== shouldPreserve) a.webkitPreservesPitch = shouldPreserve;

            } catch(e) {}
        }

        // --- 3. AUDIO ENGINE ---
        function cleanupAudioGraph() {
            const S = window.SC_FX;
            S.engineReady = false;
            if (S.source) { try { S.source.disconnect(); } catch(e){} S.source = null; }
            if (S.wet) { try { S.wet.disconnect(); } catch(e){} S.wet = null; }
            if (S.filterNode) { try { S.filterNode.disconnect(); } catch(e){} S.filterNode = null; }
            if (S.reverbNode) { try { S.reverbNode.disconnect(); } catch(e){} S.reverbNode = null; }
        }

        function initAudioEngine() {
            const S = window.SC_FX;
            if (S.engineReady && S.source) {
                if (S.ctx.state === 'suspended') S.ctx.resume();
                return;
            }

            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!S.ctx) S.ctx = new AudioContext();
                if (S.ctx.state === 'suspended') S.ctx.resume();

                let stream;
                if (S.audio.captureStream) stream = S.audio.captureStream();
                else if (S.audio.mozCaptureStream) stream = S.audio.mozCaptureStream();
                else return;

                if (!S.source) {
                    S.source = S.ctx.createMediaStreamSource(stream);

                    const rate = S.ctx.sampleRate;
                    const length = rate * 2.5;
                    const impulse = S.ctx.createBuffer(2, length, rate);
                    const L = impulse.getChannelData(0);
                    const R = impulse.getChannelData(1);

                    for (let i = 0; i < length; i++) {
                        const n = i / length;
                        const decay = Math.pow(1 - n, 2.0) * Math.exp(-3 * n);
                        L[i] = (Math.random() * 2 - 1) * decay;
                        R[i] = (Math.random() * 2 - 1) * decay;
                    }

                    S.reverbNode = S.ctx.createConvolver();
                    S.reverbNode.buffer = impulse;

                    S.filterNode = S.ctx.createBiquadFilter();
                    S.filterNode.type = 'lowpass';
                    S.filterNode.frequency.value = 3000;

                    S.wet = S.ctx.createGain();
                    S.wet.gain.value = 0.0;

                    S.source.connect(S.reverbNode);
                    S.reverbNode.connect(S.filterNode);
                    S.filterNode.connect(S.wet);
                    S.wet.connect(S.ctx.destination);
                }
                S.engineReady = true;
                updateReverb();
            } catch (e) {
                console.error("SC FX Error:", e);
            }
        }

        function updateReverb() {
            const S = window.SC_FX;
            if (!S.engineReady && S.reverb > 0) initAudioEngine();
            if (S.ctx && S.ctx.state === 'suspended') S.ctx.resume();
            if (S.wet) S.wet.gain.value = parseFloat(S.reverb) * 2.0;
        }

        // --- 4. PRESET STORAGE ---
        function getPresets() {
            try {
                return JSON.parse(localStorage.getItem('sc_fx_presets') || '[]');
            } catch (e) { return []; }
        }

        function savePreset(name) {
            const S = window.SC_FX;
            const presets = getPresets();
            // Added S.reverb to the saved object
            presets.push({
                name: name,
                speed: S.speed,
                mode: S.mode,
                reverb: S.reverb
            });
            localStorage.setItem('sc_fx_presets', JSON.stringify(presets));
        }

        function deletePreset(index) {
            const presets = getPresets();
            presets.splice(index, 1);
            localStorage.setItem('sc_fx_presets', JSON.stringify(presets));
        }

        // --- 5. UI BUILDER ---
        function buildUI() {
            if (document.getElementById('sc-fx-root')) return;
            const volWrapper = document.querySelector('.playControls__volume');
            if (!volWrapper) return;

            const style = document.createElement('style');
            style.innerHTML = `
                #sc-fx-root { display: flex; align-items: center; justify-content: center; height: 100%; position: relative; margin: 0; padding-left: 6px; }
                .sc-fx-btn { border: none; background: transparent; cursor: pointer; width: auto; height: 100%; display: flex; align-items: center; justify-content: center; color: #ccc; padding: 0 4px; outline: none; }
                .sc-fx-btn:hover { color: #fff; }
                .sc-fx-btn.active { color: #f50; }
                .sc-fx-menu { display: none; position: absolute; bottom: 45px; left: 50%; transform: translateX(-50%); width: 240px; background: #111; border: 1px solid #333; border-radius: 4px; padding: 15px; z-index: 9999; box-shadow: 0 5px 15px rgba(0,0,0,0.9); font-family: Interstate, sans-serif; user-select: none; }
                .sc-fx-menu.visible { display: block; }
                .sc-fx-row { margin-bottom: 12px; }
                .sc-fx-lbl { font-size: 11px; color: #ddd; display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold; }
                .sc-fx-slider { width: 100%; height: 4px; background: #555; -webkit-appearance: none; border-radius: 2px; outline: none; cursor: pointer; display: block; margin: 0; }
                .sc-fx-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: #fff; border-radius: 50%; }
                .sc-fx-slider:hover::-webkit-slider-thumb { background: #f50; transform: scale(1.2); }
                .sc-fx-reset { width: 100%; background: #222; border: 1px solid #444; color: #aaa; padding: 6px; font-size: 11px; cursor: pointer; border-radius: 3px; font-weight: bold; margin-top: 5px; }
                .sc-fx-reset:hover { border-color: #666; color: #fff; background: #333; }
                /* PRESET STYLES */
                .sc-fx-input-group { display: flex; gap: 5px; margin-bottom: 10px; }
                .sc-fx-input { flex: 1; background: #222; border: 1px solid #444; color: #fff; border-radius: 3px; padding: 4px 6px; font-size: 11px; outline: none; }
                .sc-fx-input:focus { border-color: #f50; }
                .sc-fx-add { background: #333; border: 1px solid #444; color: #fff; cursor: pointer; width: 24px; border-radius: 3px; }
                .sc-fx-add:hover { background: #f50; border-color: #f50; }
                .sc-fx-preset-list { display: flex; flex-wrap: wrap; gap: 5px; max-height: 80px; overflow-y: auto; margin-bottom: 10px; }
                .sc-fx-chip { display: flex; align-items: center; background: #222; border: 1px solid #444; border-radius: 10px; padding: 2px 8px; font-size: 10px; color: #ccc; cursor: pointer; user-select: none; }
                .sc-fx-chip:hover { border-color: #888; color: #fff; }
                .sc-fx-chip span { margin-right: 5px; }
                .sc-fx-del { color: #666; font-weight: bold; padding: 0 2px; border-radius: 50%; }
                .sc-fx-del:hover { color: #f00; background: rgba(255,0,0,0.1); }
            `;
            document.head.appendChild(style);

            const root = document.createElement('div');
            root.id = 'sc-fx-root';

            root.innerHTML = `
                <button class="sc-fx-btn" title="FX Settings">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                        <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
                    </svg>
                </button>
                <div class="sc-fx-menu">
                    <!-- Sliders -->
                    <div class="sc-fx-row">
                        <div class="sc-fx-lbl"><span>Reverb (Warm)</span><span id="txt-rev">0%</span></div>
                        <input type="range" class="sc-fx-slider" id="inp-rev" min="0" max="1" step="0.05" value="0">
                    </div>
                    <hr style="border:0; border-top:1px solid #333; margin: 10px 0;">
                    <div class="sc-fx-row">
                        <div class="sc-fx-lbl"><span>Vinyl (Pitch & Speed)</span><span id="txt-vinyl">1.00x</span></div>
                        <input type="range" class="sc-fx-slider" id="inp-vinyl" min="0.5" max="2.0" step="0.01" value="1.0">
                    </div>
                    <div class="sc-fx-row">
                        <div class="sc-fx-lbl"><span>Tempo (Speed Only)</span><span id="txt-tempo">1.00x</span></div>
                        <input type="range" class="sc-fx-slider" id="inp-tempo" min="0.5" max="2.0" step="0.01" value="1.0">
                    </div>

                    <hr style="border:0; border-top:1px solid #333; margin: 10px 0;">

                    <!-- Presets UI -->
                    <div class="sc-fx-lbl"><span>Presets</span></div>
                    <div class="sc-fx-input-group">
                        <input type="text" id="inp-preset-name" class="sc-fx-input" placeholder="Name" maxlength="12">
                        <button id="btn-save-preset" class="sc-fx-add" title="Save current speed & reverb">+</button>
                    </div>
                    <div id="preset-list" class="sc-fx-preset-list"></div>

                    <button class="sc-fx-reset" id="btn-reset">Reset Normal</button>
                </div>
            `;

            if(volWrapper.nextSibling) volWrapper.parentNode.insertBefore(root, volWrapper.nextSibling);
            else volWrapper.parentNode.appendChild(root);

            // References
            const S = window.SC_FX;
            const btn = root.querySelector('.sc-fx-btn');
            const menu = root.querySelector('.sc-fx-menu');
            const iRev = root.querySelector('#inp-rev');
            const tRev = root.querySelector('#txt-rev');
            const iVinyl = root.querySelector('#inp-vinyl');
            const tVinyl = root.querySelector('#txt-vinyl');
            const iTempo = root.querySelector('#inp-tempo');
            const tTempo = root.querySelector('#txt-tempo');
            const btnReset = root.querySelector('#btn-reset');

            const inpName = root.querySelector('#inp-preset-name');
            const btnSave = root.querySelector('#btn-save-preset');
            const listContainer = root.querySelector('#preset-list');

            // --- MENU TOGGLE ---
            btn.onclick = (e) => {
                e.stopPropagation();
                menu.classList.toggle('visible');
                btn.classList.toggle('active', menu.classList.contains('visible'));
            };
            menu.onclick = (e) => e.stopPropagation();
            document.addEventListener('click', () => {
                menu.classList.remove('visible');
                btn.classList.remove('active');
            });

            inpName.onkeydown = (e) => e.stopPropagation();

            // --- SLIDER LOGIC ---
            function updateSlidersUI() {
                // Update Reverb Text & Slider
                iRev.value = S.reverb;
                tRev.innerText = Math.round(S.reverb*100)+'%';

                // Update Speed Text & Slider
                if (S.mode === 'vinyl') {
                    iVinyl.value = S.speed;
                    tVinyl.innerText = parseFloat(S.speed).toFixed(2) + 'x';
                    iTempo.value = 1.0;
                    tTempo.innerText = "1.00x";
                } else {
                    iTempo.value = S.speed;
                    tTempo.innerText = parseFloat(S.speed).toFixed(2) + 'x';
                    iVinyl.value = 1.0;
                    tVinyl.innerText = "1.00x";
                }
                applyCurrentSettings();
            }

            iRev.oninput = (e) => { S.reverb = e.target.value; updateReverb(); tRev.innerText = Math.round(S.reverb*100)+'%'; };

            iVinyl.oninput = (e) => {
                S.speed = e.target.value;
                S.mode = 'vinyl';
                updateSlidersUI();
            };

            iTempo.oninput = (e) => {
                S.speed = e.target.value;
                S.mode = 'tempo';
                updateSlidersUI();
            };

            // --- RESET ---
            btnReset.onclick = () => {
                S.speed = 1.0; S.reverb = 0; S.mode = 'vinyl';
                updateReverb();
                updateSlidersUI();
            };

            // --- PRESET LOGIC ---
            function renderPresets() {
                listContainer.innerHTML = '';
                const presets = getPresets();

                if (presets.length === 0) {
                    listContainer.innerHTML = '<span style="color:#555; font-size:10px; font-style:italic;">No saved presets</span>';
                    return;
                }

                presets.forEach((p, idx) => {
                    const chip = document.createElement('div');
                    chip.className = 'sc-fx-chip';
                    // Show full tooltip
                    const revTxt = p.reverb > 0 ? `, Rev: ${Math.round(p.reverb*100)}%` : '';
                    chip.title = `${p.mode === 'vinyl' ? 'Vinyl' : 'Tempo'} @ ${p.speed}x${revTxt}`;

                    chip.innerHTML = `
                        <span>${p.name}</span>
                        <div class="sc-fx-del">×</div>
                    `;

                    // Apply Preset
                    chip.onclick = () => {
                        S.speed = p.speed;
                        S.mode = p.mode;
                        S.reverb = p.reverb !== undefined ? p.reverb : 0; // Load Reverb
                        updateReverb(); // Apply Reverb Audio
                        updateSlidersUI(); // Update Visuals
                    };

                    // Delete Preset
                    const delBtn = chip.querySelector('.sc-fx-del');
                    delBtn.onclick = (e) => {
                        e.stopPropagation();
                        deletePreset(idx);
                        renderPresets();
                    };

                    listContainer.appendChild(chip);
                });
            }

            btnSave.onclick = () => {
                const name = inpName.value.trim();
                if (!name) return;
                savePreset(name);
                inpName.value = '';
                renderPresets();
            };

            renderPresets();
        }

        const waiter = setInterval(() => {
            if(document.querySelector('.playControls__volume')) {
                buildUI();
                clearInterval(waiter);
            }
        }, 500);
    }

    const script = document.createElement('script');
    script.textContent = '(' + main.toString() + ')();';
    document.documentElement.appendChild(script);
})();