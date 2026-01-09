// ==UserScript==
// @name         Is This Song 432Hz?
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Real-time audio analysis with Hz Pitch Scanner, Spectrogram, and Binaural Phase Scope.
// @author       432enjoyer
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561945/Is%20This%20Song%20432Hz.user.js
// @updateURL https://update.greasyfork.org/scripts/561945/Is%20This%20Song%20432Hz.meta.js
// ==/UserScript==

(function() {
    'use strict';
if (window.top !== window.self) return;

    // [PATCH v98] Session Type Tracker
    // Determines if the script loaded in 'Shorts Mode' or 'Standard Mode'
    if (typeof window.hzSessionMode === 'undefined') {
        window.hzSessionMode = window.location.pathname.includes('/shorts/') ? 'shorts' : 'standard';
    }

    // --- PATCH v87: WINDOW MANAGER (BRING TO FRONT) ---
    // Start higher than current CSS (100000)
    window.hzGlobalZ = 100005; 
    document.addEventListener('mousedown', function(e) {
        // Detect clicks on any of the 3 specific modal IDs
        const win = e.target.closest('#hz-evidence-modal, #hz-spectro-modal, #hz-binaural-modal');
        if (win) {
            window.hzGlobalZ++;
            win.style.zIndex = window.hzGlobalZ;
        }
    }, true); // 'true' enables Capture Phase (vital for this to work with drag handlers)
    

    // --- GLOBAL AUDIO INFRASTRUCTURE (v84) ---
    window.ensureGlobalAudio = function(video) {
        // 1. Initialize Context
        if (!window.hzAudioCtx || window.hzAudioCtx.state === 'closed') {
            window.hzAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (window.hzAudioCtx.state === 'suspended') window.hzAudioCtx.resume();

        // 2. Initialize Stream (Once)
        if (!window.hzStream || window.hzStream.active === false) {
            window.hzStream = video.mozCaptureStream ? video.mozCaptureStream() : video.captureStream();
        }

        // 3. Initialize Hearing Path (Once - Prevents Deep Fry & Sound Loss)
        if (!window.hzHearSource) {
            window.hzHearSource = window.hzAudioCtx.createMediaStreamSource(window.hzStream);
            window.hzHearSource.connect(window.hzAudioCtx.destination);
            console.log('Hz Scanner: Global Hearing Path Established');
        }
        
        return window.hzAudioCtx;
    }

    // [PATCH v104] 'PLAYING' EVENT + STABILIZATION DELAY
    // We wait for the 'playing' event (media flowing).
    // We then wait 700ms to ensure the buffer is healthy before hijacking.
    document.addEventListener('playing', function(e){
        if(e.target.tagName === 'VIDEO') {
            const ctx = window.hzAudioCtx;
            if (ctx) {
                if (ctx.state === 'suspended') ctx.resume();

                setTimeout(() => {
                    // Check if engine is running AND video is still playing
                    if (ctx.state === 'running' && !e.target.paused) {
                        if (window.ensureGlobalAudio) {
                             // Disconnect old
                             if (window.hzHearSource) {
                                 try { window.hzHearSource.disconnect(); } catch(err){}
                                 window.hzHearSource = null;
                             }
                             if (window.hzStream) { window.hzStream = null; }
                             // Connect new
                             window.ensureGlobalAudio(e.target); window.dispatchEvent(new Event('hz-audio-restabilized')); } } }, 700); // 700ms Stabilization Delay
            }
        }
    }, true);
    

    // --- HELPER: HANDLE SHORTS VS STANDARD VIDEO ---
    function getActiveVideo() {
        // 1. Try to find the active Shorts video (the one currently on screen)
        const activeShort = document.querySelector('ytd-reel-video-renderer[is-active] video');
        if (activeShort) return activeShort;

        // 2. Fallback to standard video player
        return document.querySelector('video');
    }

    // --- INJECT PROFESSIONAL STYLES ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* MASTER SIDEBAR CSS */
        #hz-master-sidebar {
            position: fixed; top: 30%; right: 0;
            display: flex; flex-direction: column;
            background: #111; border: 1px solid #333; border-right: none;
            border-radius: 4px 0 0 4px;
            box-shadow: -4px 4px 10px rgba(0,0,0,0.5);
            z-index: 99999; width: 130px; padding: 5px;
            font-family: 'Segoe UI', sans-serif;
        }
        .hz-sidebar-header {
            color: #666; font-size: 13px; font-weight: 800;
            text-align: center; margin-bottom: 5px; letter-spacing: 1px;
            border-bottom: 1px solid #333; padding-bottom: 4px;
            cursor: move;
        }
        .hz-side-btn {
            background: #222; border: 1px solid #444; border-radius: 4px; color: #888;
            padding: 10px 0; margin-bottom: 4px;
            font-size: 13px; font-weight: 700; cursor: pointer;
            text-align: center; transition: all 0.2s; width: 100%;
        }
        .hz-side-btn:hover { background: #333; color: #fff; }
        
        /* ACTIVE STATES */
        .hz-btn-system-off { border-left: 3px solid #c0392b; color: #aaa; }
        .hz-btn-system-on  { border-left: 3px solid #2ecc71; background: #1a1a1a; color: #fff; text-shadow: 0 0 5px #2ecc71; }
        
        .hz-btn-active { 
            border-left: 3px solid #ffffff; 
            background: #181818; color: #ffffff; 
        }
        
        /* Modal Styles (Preserved/Tweaked) */
        .hz-panel { font-family: 'Segoe UI', Roboto, sans-serif; background: #121212; border: 1px solid #333; color: #eee; box-shadow: 0 10px 30px rgba(0,0,0,0.8); border-radius: 4px; display: flex; flex-direction: column; }
        .hz-header { background: #1a1a1a; padding: 8px 12px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; user-select: none; cursor: move; }
        .hz-title { font-size: 16px; font-weight: 700; letter-spacing: 0.5px; color: #fff; text-transform: none; }
        .hz-btn-close { background: none; border: none; color: #888; cursor: pointer; font-size: 14px; }
        .hz-btn-close:hover { color: #fff; }

        .hz-toolbar { display: flex; gap: 8px; padding: 8px; background: #181818; border-bottom: 1px solid #2a2a2a; align-items: center; font-size: 14px; }
        .hz-btn { background: #2a2a2a; border: 1px solid #444; color: #ccc; padding: 4px 10px; border-radius: 2px; cursor: pointer; font-size: 14px; font-weight: 600; transition: background 0.2s; }
        .hz-btn:hover { background: #3a3a3a; color: #fff; }
        .hz-btn.active { background: #d35400; color: #fff; border-color: #e67e22; }
        .hz-btn.toggle-on { background: #f1c40f; color: #000; border-color: #f39c12; } .hz-btn.toggle-on:hover { background: #ffdd57 !important; color: #000; }
        
        /* ... (rest of metric styles preserved below) ... */
        .hz-canvas-wrapper { position: relative; flex: 1; background: #000; overflow: hidden; min-height:  100px; cursor: crosshair; }
        .hz-overlay-info { position: absolute; top: 10px; left: 10px; pointer-events: none; font-family: 'Consolas', monospace; font-size: 14px; line-height: 1.4; background: rgba(0,0,0,0.6); padding: 4px; border-radius: 3px; }
        .hz-telemetry-grid { display: grid; grid-template-columns: 1.2fr 0.9fr 1.2fr 1.2fr; gap: 1px; background: #333; border-top: 1px solid #333; height: 135px; flex-shrink: 0; }
        .hz-telemetry-col { background: #121212; display: flex; flex-direction: column; padding: 0; }
        .hz-metric-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; border-bottom: 1px solid #1f1f1f; height: 100%; }
        .hz-metric-row:last-child { border-bottom: none; }
        .hz-label { font-size: 13px; color: #777; font-weight: 600; text-transform: uppercase; }
        .hz-value { font-family: 'Consolas', monospace; font-size: 15px; font-weight: bold; color: #ddd; }
        .hz-resize-handle { position:absolute; bottom:0; right:0; width:20px; height:20px; cursor:nwse-resize; zIndex:100002; }
    `;
    document.head.appendChild(style);

    // --- STATE ---
    let isScanning = false;
    // [PATCH v130] Auto-Rehook on Stream Refresh
    window.addEventListener('hz-audio-restabilized', () => {
        if (isScanning && typeof ensureAudioConnection === 'function') {
            const v = getActiveVideo();
            if(v) ensureAudioConnection(v);
        }
    });
    let totalScanDuration = 0;
    let lastScanTick = 0;
    let audioCtx, source, stream;
    let analyser, scriptNode;
    let uiUpdateInterval;
    let animationFrameId;

    let tolerance = 10;
    let scanMode = 'standard';
    let showHistory = true;
let showLive = true; // [PATCH v117]
let isSmooth = true;

    // --- FORENSIC DATA ---
    const HISTOGRAM_BINS = 800;
    let chromaHistogram = new Float32Array(HISTOGRAM_BINS).fill(0);
    let accumulatedHistogram = new Float32Array(HISTOGRAM_BINS).fill(0);
    let totalValidSeconds = 0;
    let lastDetectedHz = 0;
    let signalQuality = 0;
    let transientLock = 0;

    // --- HYBRID CALCULATION STATE ---
    // 1. Average (For Standard Mode)
    let totalCentsDeviationSum = 0;
    let totalCentsDeviationCount = 0;
    let averageRefHz = 0;
    // 2. Peak (For Percussion Mode)
    let peakRefHz = 0;

    // --- VIEW STATE ---
    let modalPrefs = { x: null, y: null, w: 800, h: 550 };
    let interaction = { mode: null, el: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0 };
    let graphMouse = { active: false, x: 0 };

    // --- COLORS ---
    const COL_440 = { hex: '#3498db', r: 52, g: 152, b: 219 };
    const COL_432 = { hex: '#2ecc71', r: 46, g: 204, b: 113 };

    // --- 1. UI Setup (Small Widget) ---
    
    // --- MASTER FORENSIC SIDEBAR ---
    let systemAudioEnabled = false;

    function toggleSystemAudio() {
        const btn = document.getElementById('hz-btn-system');
        if(!systemAudioEnabled) {
            // TURN ON
            const video = getActiveVideo();
            if(video) {
                try {
                    ensureAudioConnection(video);
                    if(audioCtx.state === 'suspended') audioCtx.resume();
                    systemAudioEnabled = true;
                    btn.innerText = "SYSTEM: ON";
                    btn.classList.remove('hz-btn-system-off');
                    btn.classList.add('hz-btn-system-on');
                } catch(e) { console.error(e); }
            } else {
                btn.innerText = "NO VIDEO";
                setTimeout(() => btn.innerText = "SYSTEM: OFF", 1000);
            }
        } else {
            // TURN OFF (Optional logic, usually we just leave it on)
            // But user might want to disconnect
            systemAudioEnabled = false;
            btn.innerText = "SYSTEM: OFF";
            btn.classList.remove('hz-btn-system-on');
            btn.classList.add('hz-btn-system-off');
            stopScan(); // Stop main scanner
            if(typeof SpectrogramMod !== 'undefined') SpectrogramMod.stop(); 
            if(typeof BinauralMod !== 'undefined') BinauralMod.stop();
        }
    }

    function createMasterSidebar() {
        if (document.getElementById('hz-master-sidebar')) {
            updateSidebarStates();
            return;
        }

        const bar = document.createElement('div');
        bar.id = 'hz-master-sidebar';
        bar.innerHTML = `
            <div class="hz-sidebar-header">HZ SCANNER</div>
            
            
            <button id="hz-btn-tuning" class="hz-side-btn">TUNING</button>
            <button id="hz-btn-spectro" class="hz-side-btn">SPECTRUM</button>
            <button id="hz-btn-binaural" class="hz-side-btn">BINAURAL</button>
        `;

        document.body.appendChild(bar);

        // Bind Events
        
        
        document.getElementById('hz-btn-tuning').onclick = () => {
             
             toggleScan(); // Main Script Toggle
        };
        
        document.getElementById('hz-btn-spectro').onclick = () => {
             
             if(typeof SpectrogramMod !== 'undefined') SpectrogramMod.toggle();
        };

        document.getElementById('hz-btn-binaural').onclick = () => {
             
             if(typeof BinauralMod !== 'undefined') BinauralMod.toggle();
        };

        setupInteraction(bar, bar.querySelector('.hz-sidebar-header'));
    }

    // Helper to keep buttons highlighted when windows are open
    function updateSidebarStates() {
        const tuningBtn = document.getElementById('hz-btn-tuning');
        const specBtn = document.getElementById('hz-btn-spectro');
        const binBtn = document.getElementById('hz-btn-binaural');

        if(tuningBtn) {
            const win = document.getElementById('hz-evidence-modal');
            if(win) tuningBtn.classList.add('hz-btn-active'); else tuningBtn.classList.remove('hz-btn-active');
        }

        if(specBtn) {
             // Spectrogram Module Window ID check (assuming ID is hz-evidence-modal, wait... 
             // IMPORTANT: Each module uses 'hz-evidence-modal' as ID. 
             // We need to fix the ID collision in the sub-modules or check context. 
             // Actually, the previous script replaced the ID, so currently only ONE window can be open at a time 
             // if they share IDs. 
             // However, for this patch, we will assume the UserScript merges unique IDs or replaces content.
             // If unique IDs are needed, we should patch modules to use unique IDs.
             // Let's assume unique IDs: 'hz-spectro-modal', 'hz-binaural-modal' 
             // (We will patch the modules to use these IDs next).
             const win = document.getElementById('hz-spectro-modal');
             if(win) specBtn.classList.add('hz-btn-active'); else specBtn.classList.remove('hz-btn-active');
        }

        if(binBtn) {
             const win = document.getElementById('hz-binaural-modal');
             if(win) binBtn.classList.add('hz-btn-active'); else binBtn.classList.remove('hz-btn-active');
        }
    }
    

    function createControlPanel() { return; // Old panel disabled

        if (document.getElementById('hz-control-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'hz-control-panel';
        panel.className = 'hz-panel';
        Object.assign(panel.style, {
            position: 'fixed', top: '80px', right: '20px', zIndex: '99999',
            width: '210px', height: 'auto'
        });

        panel.innerHTML = `
            <div class="hz-header">
                <span class="hz-title">Hz Scanner (12-TET)</span>
                <span style="color:#666; cursor:grab">≡</span>
            </div>
            <div style="padding: 10px;">
                <button id="hz-scan-btn" class="hz-btn" title="Fix Audio | Start Scan" style="width:100%; margin-bottom:8px;">TUNING</button>
                <button id="hz-graph-btn" class="hz-btn" style="width:100%;">📊 Dashboard</button>
                <div style="display:flex; gap:5px; margin-top:5px;">
                    <button id="hz-spectro-btn" class="hz-btn" style="width:50%; background:#222; border:1px solid #444;">🌊 Spectro</button>
                    <button id="hz-binaural-btn" class="hz-btn" style="width:50%; background:#222; border:1px solid #444;">🧠 Binaural</button>
                </div>
            </div>
            <div style="position:absolute; bottom:0; right:0; width:15px; height:15px; cursor:nwse-resize;"></div>
        `;

        document.body.appendChild(panel);

        document.getElementById('hz-btn-tuning').onclick = () => toggleScan();
        document.getElementById('hz-graph-btn').onclick = () => openEvidenceModal();
        // Use try-catch or Optional Chaining checks in case modules load slowly, 
        // though strictly they are defined in the same scope.
        document.getElementById('hz-spectro-btn').onclick = () => { if(typeof SpectrogramMod !== 'undefined') SpectrogramMod.toggle(); };
        document.getElementById('hz-binaural-btn').onclick = () => { if(typeof BinauralMod !== 'undefined') BinauralMod.toggle(); };

        setupInteraction(panel, panel.querySelector('.hz-header'));
    }

    // --- 2. Audio Logic ---
    async function toggleScan() {
        const scanBtn = document.getElementById('hz-btn-tuning');
        const video = getActiveVideo(); // SHORTS FIX

        if (isScanning) {
            stopScan();
            // User requested click-to-close behavior
            const win = document.getElementById('hz-evidence-modal');
            if(win) win.remove();
            return;
        }
        if (!video || video.paused) {
            const originalText = scanBtn.innerText;
            scanBtn.innerText = "PLAY VIDEO FIRST";
            setTimeout(() => { scanBtn.innerText = originalText; }, 1500);
            return;
        }
        if (!document.getElementById('hz-evidence-modal')) openEvidenceModal();
        startScan(video, scanBtn);
    }

    
    function ensureAudioConnection(video) {
        try {
            audioCtx = ensureGlobalAudio(video);
            cleanupAudioNodes(); // Clear local tool nodes

            // Create Local Disposable Source for Analysis Only
            source = audioCtx.createMediaStreamSource(window.hzStream);
            
            scriptNode = audioCtx.createScriptProcessor(2048, 1, 1);
            scriptNode.onaudioprocess = performForensicDataScan;
            
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 32768;
            analyser.smoothingTimeConstant = 0.0;
            
            
            // [PATCH v85] Vitality: Force browser to process data via muted path
            const zGain = audioCtx.createGain();
            zGain.gain.value = 0.0001; // [PATCH v86] Anti-optimization // Silence this path
            source.connect(analyser);
            source.connect(scriptNode);
            scriptNode.connect(zGain); // Keep script processor alive
            analyser.connect(zGain);   // Keep analyser alive
            zGain.connect(audioCtx.destination);
    
            
            // NOTE: We do NOT connect 'source' to destination here. 
            // The global hzHearSource handles that.
            
        } catch (e) { console.error("Hz Scanner: Audio Init Failed", e); }
    }
    

    function getForensicPitch(analyserNode) {
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);
        analyserNode.getFloatFrequencyData(dataArray);
        const sampleRate = audioCtx.sampleRate;

        let maxEnergy = -Infinity;
        let bestBin = -1;
        const minBin = Math.floor(40 * analyserNode.fftSize / sampleRate);
        const maxBin = Math.floor(4000 * analyserNode.fftSize / sampleRate);

        for (let i = minBin; i < maxBin; i++) {
            if (dataArray[i] > maxEnergy) { maxEnergy = dataArray[i]; bestBin = i; }
        }

        if (maxEnergy < -65) return { hz: 0, quality: 0 };

        let hz = bestBin * (sampleRate / analyserNode.fftSize);

        if (scanMode === 'percussion') {
            if (transientLock > 0) { transientLock--; return { hz: 0, quality: 0 }; }
            if (bestBin > 0 && bestBin < bufferLength - 1) {
                const prev = dataArray[bestBin - 1]; const next = dataArray[bestBin + 1];
                const p = 0.5 * (prev - next) / (prev - 2 * maxEnergy + next);
                hz = (bestBin + p) * (sampleRate / analyserNode.fftSize);
            }
            if (maxEnergy > -40) {
                transientLock = 5;
                return { hz: hz, quality: 1.0 };
            }
            return { hz: 0, quality: 0 };
        } else {
            let neighborSum = 0; let neighborCount = 0;
            for (let j = -10; j <= 10; j++) {
                if (j === 0) continue;
                if (bestBin + j >= 0 && bestBin + j < bufferLength) {
                    neighborSum += dataArray[bestBin + j]; neighborCount++;
                }
            }
            const prominence = maxEnergy - (neighborSum / neighborCount);
            if (prominence < 12) return { hz: 0, quality: 0 };

            if (bestBin > 0 && bestBin < bufferLength - 1) {
                const prev = dataArray[bestBin - 1]; const next = dataArray[bestBin + 1];
                const p = 0.5 * (prev - next) / (prev - 2 * maxEnergy + next);
                hz = (bestBin + p) * (sampleRate / analyserNode.fftSize);
            }
            let q = Math.min(Math.max((prominence - 12) / 28, 0), 1);
            return { hz: hz, quality: q };
        }
    }

    function performForensicDataScan(e) {
        const video = getActiveVideo(); // SHORTS FIX
        if (video && (video.paused || video.seeking)) return;

        const result = getForensicPitch(analyser);
        const threshold = scanMode === 'percussion' ? 0.8 : 0.1;

        if (result.quality >= threshold) {
            lastDetectedHz = result.hz;
            signalQuality = result.quality;
            const bufferDuration = e.inputBuffer.length / e.inputBuffer.sampleRate;
            totalValidSeconds += bufferDuration;

            // --- HISTOGRAM ---
            const centsFromC0 = 1200 * Math.log2(result.hz / 16.3516);
            let foldedCents = centsFromC0 % 1200;
            if (foldedCents < 0) foldedCents += 1200;
            const binIndex = Math.floor((foldedCents / 1200) * HISTOGRAM_BINS);
            if (binIndex >= 0 && binIndex < HISTOGRAM_BINS) {
                const energy = scanMode === 'percussion' ? 5.0 : (0.15 * result.quality);
                chromaHistogram[binIndex] += energy;
                if (chromaHistogram[binIndex] > 1.0) chromaHistogram[binIndex] = 1.0;
                accumulatedHistogram[binIndex] += energy;
            }

            // --- STANDARD MODE: AVERAGE CALCULATION ---
            const centsFromA440 = 1200 * Math.log2(result.hz / 440);
            const nearestSemitone = Math.round(centsFromA440 / 100) * 100;
            const deviation = centsFromA440 - nearestSemitone;
            if (Math.abs(deviation) < 50) {
                totalCentsDeviationSum += deviation;
                totalCentsDeviationCount++;
                const avgDev = totalCentsDeviationSum / totalCentsDeviationCount;
                averageRefHz = 440 * Math.pow(2, avgDev / 1200);
            }

            // --- PERCUSSION MODE: PEAK CALCULATION (ARCHITECTURE FIX) ---
            if (scanMode === 'percussion') {
                let maxVal = 0;
                let maxIdx = 0;
                // Find the peak in the history
                for(let i=0; i<HISTOGRAM_BINS; i++) {
                    if(accumulatedHistogram[i] > maxVal) {
                        maxVal = accumulatedHistogram[i];
                        maxIdx = i;
                    }
                }
                // Calculate Ref based on that peak
                if (maxVal > 0) {
                     const cents = (maxIdx / HISTOGRAM_BINS) * 1200;
                     const nearest440 = Math.round(cents / 100) * 100;
                     const pDeviation = cents - nearest440;
                     peakRefHz = 440 * Math.pow(2, pDeviation / 1200);
                }
            }

        } else { signalQuality = 0; }

        const decay = scanMode === 'percussion' ? 0.90 : 0.98;
        for (let i = 0; i < HISTOGRAM_BINS; i++) chromaHistogram[i] *= decay;
    }

    function startScan(video, btn) {
        isScanning = true;
        totalScanDuration = 0;
        lastScanTick = performance.now();
        // Reset Stats
        chromaHistogram.fill(0);
        accumulatedHistogram.fill(0);
        totalValidSeconds = 0;
        totalCentsDeviationSum = 0;
        totalCentsDeviationCount = 0;
        peakRefHz = 0;
        averageRefHz = 0;

        ensureAudioConnection(video);
        btn.innerText = "TUNING: ON";
        btn.classList.add('hz-btn-active');

        uiUpdateInterval = setInterval(() => {
            const now = performance.now();
            const dt = (now - lastScanTick) / 1000;
            lastScanTick = now;

            if (video && (video.paused || video.seeking)) {
                // [PATCH v107] Static UI: btn.innerText = "PAUSED";
                // [PATCH v106] No Orange: btn.style.borderColor = "#e67e22";
                return;
            }
            // [PATCH v106] CSS Priority: btn.style.borderColor = "#444";

            if (!video.paused && !video.seeking) {
                totalScanDuration += dt;
            }

            if (signalQuality < 0.1) {
                // [PATCH v105] Static UI: btn.innerText = scanMode === 'percussion' ? "Waiting..." : "Analyzing...";
            } else {
                // --- HYBRID DISPLAY LOGIC ---
                let displayRef = 0;

                if (scanMode === 'standard') {
                    // Standard: Use Average (Better for Vibrato)
                    if (totalCentsDeviationCount > 10) displayRef = averageRefHz;
                } else {
                    // Percussion: Use Peak (Better for Noise)
                    if (peakRefHz > 0 && totalValidSeconds > 2) displayRef = peakRefHz;
                }

                if (displayRef > 0) {
                    // [PATCH v105] Static UI: btn.innerText = `${displayRef.toFixed(1)}Hz`;
                } else {
                    btn.innerText = "TUNING: ON";
                }
            }
        }, 100);
        startVisualLoop();
    }

    function startVisualLoop() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        function loop() {
            if (!isScanning) return;
            const modal = document.getElementById('hz-evidence-modal');
            if (modal) {
                const chromaCanvas = modal.querySelector('#hz-chroma-canvas');
                if(chromaCanvas) drawDashboardAnalysis(chromaCanvas);
            }
            animationFrameId = requestAnimationFrame(loop);
        }
        loop();
    }

    function stopScan() {
        isScanning = false;
        clearInterval(uiUpdateInterval);
        cancelAnimationFrame(animationFrameId);
        cleanupAudioNodes();
        const scanBtn = document.getElementById('hz-btn-tuning');
        if(scanBtn) {
            scanBtn.innerText = 'TUNING';
            scanBtn.classList.remove('hz-btn-active');
            // [PATCH v106] CSS Priority: scanBtn.style.borderColor = "#444";
        }
    }

    
    function cleanupAudioNodes() {
        // [PATCH v84] Safe Disposal - Only kills local tool nodes
        if (source) {
            try { source.disconnect(); } catch(e){} // Disconnects from analyser/scriptNode
            source = null;
        }
        if (scriptNode) { try{scriptNode.disconnect();}catch(e){} scriptNode = null; }
        // We do NOT nullify stream or audioCtx, they are global now
    }
    

    function openEvidenceModal() {
        if(document.getElementById('hz-evidence-modal')) { renderModalContent(); return; }

        const modal = document.createElement('div');
        modal.id = 'hz-evidence-modal';
        modal.className = 'hz-panel';

        const x = modalPrefs.x !== null ? modalPrefs.x : (window.innerWidth/2 - 360);
        const y = modalPrefs.y !== null ? modalPrefs.y : (window.innerHeight/2 - 250);

        Object.assign(modal.style, {
            position: 'fixed', top: y+'px', left: x+'px',
            width: modalPrefs.w+'px', height: modalPrefs.h+'px',
            zIndex: ++window.hzGlobalZ, minWidth: '550px', minHeight: '320px'
        });

        const resizer = document.createElement('div');
        Object.assign(resizer.style, {
            position:'absolute', bottom:0, right:0, width:'20px', height:'20px', cursor:'nwse-resize', zIndex:100002
        });
        resizer.className = 'hz-resize-handle';
        modal.appendChild(resizer);

        document.body.appendChild(modal);
        renderModalContent();
        setupInteraction(modal, modal.querySelector('.hz-header'));
        if (isScanning) startVisualLoop();
    }

    function renderModalContent() {
        const modal = document.getElementById('hz-evidence-modal');
        if(!modal) return;

        modal.innerHTML = `
            <div class="hz-header">
                <span class="hz-title">Tuning (12-TET)<span style="font-family:'Consolas', monospace; font-size:12px; color:#555; font-weight:normal; margin-left:12px; letter-spacing:0;">40Hz-4k | &gt;-65dB | 32k FFT | Parabolic Interp.</span></span>
                <button id="hz-close" class="hz-btn-close">✖</button>
            </div>

            <div class="hz-toolbar">
                <button id="hz-mode-toggle" title="Standard: vocals, strings, synths&#013;Percussion: drums, beats" class="hz-btn ${scanMode !== 'standard' ? 'active' : ''}">
                    ${scanMode==='standard' ? '🎻 Mode: Standard' : '🥁 Mode: Percussion'}
                </button>
                <button id="hz-hist-toggle" title="Cumulative tuning history" class="hz-btn ${showHistory ? 'toggle-on' : ''}">
                    ${showHistory ? 'Average: ON' : 'Average: OFF'}
                </button>
                <div class="hz-slider-group" title="Detection tolerance (± cents)">
                    <span class="hz-label" style="position:relative; bottom:8px;">Tol</span>
                    <input type="range" id="hz-tol-slider" min="3" max="10" value="${tolerance}" class="hz-slider">
                    <span id="tol-val" style="font-family:monospace; width:25px; position:relative; bottom:8px;">${tolerance}c</span>
                </div>
            </div>

            <div class="hz-canvas-wrapper">
                <canvas id="hz-chroma-canvas" style="width:100%; height:100%; display:block;"></canvas>
                <div class="hz-overlay-info">
                    <div style="margin-bottom:6px; padding-bottom:4px; border-bottom:1px solid rgba(255,255,255,0.2); display:flex; align-items:center;">
                        <span id="status-dot" style="width:8px; height:8px; border-radius:50%; background:#777; display:inline-block; margin-right:6px;"></span>
                        <span id="hz-graph-status" style="font-weight:bold; color:#eee; font-size:12px; opacity:0.5;">IDLE</span>
                    </div>
                    <div style="color:${COL_432.hex}; font-weight:bold;">▮ 432 Hz (Verdi)</div>
                    <div style="color:${COL_440.hex}; font-weight:bold;">▮ 440 Hz (ISO)</div>
                </div>
            </div>

            <div class="hz-telemetry-grid">
                <!-- COL 1.5: REFERENCE & LOCK -->
                <div class="hz-telemetry-col" style="border-right:1px solid #222;">
                    <div class="hz-metric-row">
                        <span class="hz-label" style="color:#fff;" title="Estimated reference pitch">Ref ≈</span>
                        <span id="hz-ref-val" class="hz-value">--</span>
                    </div>
                    <!-- NEW ROW ADDED BELOW -->
                    <div class="hz-metric-row" style="border-top:1px solid #333;">
                        <span class="hz-label" title="Chromatic alignment: strength of alignment to 432Hz or 440Hz scales">Lock</span>
                        <span id="hz-confidence-val" class="hz-value" style="font-size:15px; white-space:nowrap;">--</span>
                    </div>
                </div>

                
                <!-- COL 1: SESSION STATS -->
                <div class="hz-telemetry-col" style="border-right:1px solid #222;">
                    <div class="hz-metric-row">
                        <span class="hz-label" title="Total time containing valid pitch">Duration</span>
                        <span id="hz-sample-time" class="hz-value">0s</span>
                    </div>
                    <div class="hz-metric-row">
                        <span class="hz-label" title="Signal Saturation: (Valid Time / Total Scan Time)">Density</span>
                        <span id="hz-density-val" class="hz-value" style="color:#3498db;">--</span>
                    </div>
                    <div class="hz-metric-row">
                        <span class="hz-label" title="Tuning Integrity: (On-Grid Energy / Total Energy)">Yield</span>
                        <span id="hz-yield-val" class="hz-value">--</span>
                    </div>
                    <div class="hz-metric-row">
                        <span class="hz-label" title="Session Score: (Density × Yield)">Precision</span>
                        <span id="hz-zonetime-val" class="hz-value" style="color:#e67e22;">--</span>
                    </div>
                </div>
                <!-- COL 2: FULL SPECTRUM -->
                <div class="hz-telemetry-col" style="border-right:1px solid #222;">
                    <div class="hz-metric-row" style="background:#1a1a1a;">
                        <span class="hz-label" title="Analysis of all notes combined">Full Spectrum</span>
                        <span style="font-size:13px; color:#666; font-weight:bold;" title="Live | Average">LIVE | AVG</span>
                    </div>
                    <div class="hz-metric-row">
                        <span class="hz-label" style="color:${COL_432.hex}; font-size:15px;">432 Hz</span>
                        <div>
                             <span id="fs-432-live" class="hz-value">--</span>
                             <span style="color:#444;">|</span>
                             <span id="fs-432-avg" class="hz-value" style="color:#777;">--</span>
                        </div>
                    </div>
                    <div class="hz-metric-row">
                        <span class="hz-label" style="color:${COL_440.hex}; font-size:15px;">440 Hz</span>
                        <div>
                             <span id="fs-440-live" class="hz-value">--</span>
                             <span style="color:#444;">|</span>
                             <span id="fs-440-avg" class="hz-value" style="color:#777;">--</span>
                        </div>
                    </div>
                </div>

                <!-- COL 3: ANCHOR POINTS -->
                <div class="hz-telemetry-col">
                    <div class="hz-metric-row" style="background:#1a1a1a;">
                        <span class="hz-label" title="Analysis of loudest note">Signal Anchor</span>
                         <span style="font-size:13px; color:#666; font-weight:bold;" title="Live | Average">LIVE | AVG</span>
                    </div>
                    <div class="hz-metric-row">
                        <span class="hz-label" style="color:${COL_432.hex}; font-size:15px;">432 Pk</span>
                        <div>
                             <span id="an-432-live" class="hz-value">--</span>
                             <span style="color:#444;">|</span>
                             <span id="an-432-avg" class="hz-value" style="color:#777;">--</span>
                        </div>
                    </div>
                    <div class="hz-metric-row">
                        <span class="hz-label" style="color:${COL_440.hex}; font-size:15px;">440 Pk</span>
                        <div>
                             <span id="an-440-live" class="hz-value">--</span>
                             <span style="color:#444;">|</span>
                             <span id="an-440-avg" class="hz-value" style="color:#777;">--</span>
                        </div>
                    </div>
                </div>
            </div>

            

            <div class="hz-resize-handle" style="position:absolute; bottom:0; right:0; width:20px; height:20px; cursor:nwse-resize; zIndex:100002"></div>
        `;

        document.getElementById('hz-close').onclick = () => { stopScan(); modal.remove(); };

        const cvs = document.getElementById('hz-chroma-canvas');
        if(cvs) {
            cvs.addEventListener('mouseenter', () => { graphMouse.active = true; });
            cvs.addEventListener('mouseleave', () => { graphMouse.active = false; });
            cvs.addEventListener('mousemove', (e) => {
                const r = cvs.getBoundingClientRect();
                graphMouse.x = e.clientX - r.left;
            });
        }

        const slider = document.getElementById('hz-tol-slider');
        slider.oninput = (e) => {
            tolerance = parseInt(e.target.value);
            document.getElementById('tol-val').innerText = tolerance + "c";
        };

        const mBtn = document.getElementById('hz-mode-toggle');
        mBtn.onclick = () => {
             if (scanMode === 'standard') {
                scanMode = 'percussion';
                mBtn.innerHTML = '🥁 Mode: Percussion';
                mBtn.classList.add('hz-btn-active');
            } else {
                scanMode = 'standard';
                mBtn.innerHTML = '🎻 Mode: Standard';
                mBtn.classList.remove('hz-btn-active');
            }
            // Reset Data
            chromaHistogram.fill(0);
            accumulatedHistogram.fill(0);
            totalValidSeconds = 0;
            totalScanDuration = 0;
            totalCentsDeviationSum = 0;
            totalCentsDeviationCount = 0;
            peakRefHz = 0;
            averageRefHz = 0;
        };

        const hBtn = document.getElementById('hz-hist-toggle');
        hBtn.onclick = () => {
            showHistory = !showHistory;
            if(showHistory) {
                hBtn.innerText = "Average: ON";
                hBtn.classList.add('toggle-on');
            } else {
                hBtn.innerText = "Average: OFF";
                hBtn.classList.remove('toggle-on');
            }
        };

        setupInteraction(modal, modal.querySelector('.hz-header'));
    }

    function drawDashboardAnalysis(canvas) {
        const rect = canvas.getBoundingClientRect();

        // --- RETINA FIX: Use Math.floor ---
        const domWidth = Math.floor(rect.width);
        const domHeight = Math.floor(rect.height);

        if(canvas.width !== domWidth || canvas.height !== domHeight) {
             canvas.width = domWidth;
             canvas.height = domHeight;
        }

        const ctx = canvas.getContext('2d');
        const w = canvas.width; const h = canvas.height;
        const pxPerCent = w / 1200; const shift432 = 31.8;

        const statusEl = document.getElementById('hz-graph-status');
        const statusDot = document.getElementById('status-dot');

        if(statusEl) {
             const video = getActiveVideo(); // SHORTS FIX
             if(video && (video.paused || video.seeking)) {
                 statusEl.innerText = "FROZEN (VIDEO PAUSED)";
                 statusEl.style.color = "#e67e22";
                 statusDot.style.background = "#e67e22";
             } else if (signalQuality < 0.1) {
                statusEl.innerText = "SEARCHING FOR SIGNAL...";
                statusEl.style.color = "#777";
                statusDot.style.background = "#777";
            } else {
                // [PATCH v113] Smart Tracking Color (Green=432, Blue=440)
                const c440 = 1200 * Math.log2(lastDetectedHz / 440);
                const d440 = Math.abs(c440 - Math.round(c440/100)*100);
                
                const c432 = 1200 * Math.log2(lastDetectedHz / 432);
                const d432 = Math.abs(c432 - Math.round(c432/100)*100);
                
                // If closer to 440 grid, use Blue. Else Green.
                const trkColor = (d440 < d432) ? "#3498db" : "#2ecc71";

                statusEl.innerText = `TRACKING SIGNAL: ${lastDetectedHz.toFixed(2)}Hz`;
                statusEl.style.color = trkColor;
                statusDot.style.background = trkColor;
            }
        }

        ctx.fillStyle = '#050505'; ctx.fillRect(0,0,w,h);

        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(${COL_440.r}, ${COL_440.g}, ${COL_440.b}, 0.3)`;
        ctx.setLineDash([2, 4]);
        for (let i = 0; i <= 1200; i += 100) { const x = i * pxPerCent; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        ctx.strokeStyle = `rgba(${COL_432.r}, ${COL_432.g}, ${COL_432.b}, 0.3)`;
        ctx.setLineDash([2, 4]);
        for (let i = 0; i < 1200; i += 100) {
            let centsPos = i - shift432;
            if (centsPos < 0) centsPos += 1200;
            const x = centsPos * pxPerCent;
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        ctx.setLineDash([]);

        ctx.fillStyle = `rgba(${COL_440.r}, ${COL_440.g}, ${COL_440.b}, 0.1)`;
        for (let i = 0; i <= 1200; i += 100) {
            const x = i * pxPerCent;
            const width = (tolerance * 2) * pxPerCent;
            ctx.fillRect(x - width/2, 0, width, h);
        }
        ctx.fillStyle = `rgba(${COL_432.r}, ${COL_432.g}, ${COL_432.b}, 0.1)`;
        for (let i = 0; i < 1200; i += 100) {
            let centsPos = i - shift432; if (centsPos < 0) centsPos += 1200;
            const x = centsPos * pxPerCent;
            const width = (tolerance * 2) * pxPerCent;
            ctx.fillRect(x - width/2, 0, width, h);
        }

        let fullLive440 = 0, fullLive432 = 0;
        let liveMaxVal = 0, liveMaxIndex = 0;
        let peakH440 = 0, peakIdx440 = 0;
        let peakH432 = 0, peakIdx432 = 0;
        let fullAvg440 = 0, fullAvg432 = 0;
        let totalSpectrumEnergy = 0;
        let maxAccumulated = 0;
        let maxAccumulatedIndex = 0;

        for(let i=0; i<HISTOGRAM_BINS; i++) {
            if(accumulatedHistogram[i] > maxAccumulated) {
                maxAccumulated = accumulatedHistogram[i];
                maxAccumulatedIndex = i;
            }
        }

        ctx.fillStyle = 'rgba(230, 230, 230, 0.9)';
        ctx.beginPath(); ctx.moveTo(0, h);

        for (let i = 0; i < HISTOGRAM_BINS; i++) {
            const val = chromaHistogram[i];
            const x = (i / HISTOGRAM_BINS) * w;
            const y = h - (val * h * 0.9);
            ctx.lineTo(x, y);

            if (val > liveMaxVal) { liveMaxVal = val; liveMaxIndex = i; }

            if (val > 0.01) {
                const {d440, d432} = getDistanceScore(i);
                if (d440 < tolerance) fullLive440 += val;
                if (d432 < tolerance) fullLive432 += val;
            }

            const accVal = accumulatedHistogram[i];
            if(accVal > 0) {
                totalSpectrumEnergy += accVal;
                const {d440, d432} = getDistanceScore(i);
                if (d440 < tolerance) fullAvg440 += accVal;
                if (d432 < tolerance) fullAvg432 += accVal;
                if(d440 < tolerance && accVal > peakH440) { peakH440 = accVal; peakIdx440 = i; }
                if(d432 < tolerance && accVal > peakH432) { peakH432 = accVal; peakIdx432 = i; }
            }
        }
        ctx.lineTo(w, h); ctx.fill();

        if (showHistory && maxAccumulated > 0) {
            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            let started = false;
            for(let i=0; i<HISTOGRAM_BINS; i++) {
                const normVal = accumulatedHistogram[i] / maxAccumulated;
                const x = (i / HISTOGRAM_BINS) * w;
                const y = h - (normVal * h * 0.9);
                if (!started) { ctx.moveTo(x, y); started = true; }
                else { ctx.lineTo(x, y); }
            }
            ctx.stroke();

            if(peakH440 > 0) {
                const px = (peakIdx440 / HISTOGRAM_BINS) * w;
                const normH = peakH440 / maxAccumulated;
                const py = h - (normH * h * 0.9) - 10;
                ctx.strokeStyle = COL_440.hex; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI*2); ctx.stroke();
            }
            if(peakH432 > 0) {
                const px = (peakIdx432 / HISTOGRAM_BINS) * w;
                const normH = peakH432 / maxAccumulated;
                const py = h - (normH * h * 0.9) - 10;
                ctx.strokeStyle = COL_432.hex; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI*2); ctx.stroke();
            }
        }

        if (liveMaxVal > 0.1) {
            const px = (liveMaxIndex / HISTOGRAM_BINS) * w;
            const py = h - (liveMaxVal * h * 0.9) - 8;
            ctx.fillStyle = '#e67e22'; ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI*2); ctx.fill();
        }

        if (graphMouse.active) {
            const mx = graphMouse.x;
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.setLineDash([]);
            ctx.beginPath(); ctx.moveTo(mx, 0); ctx.lineTo(mx, h); ctx.stroke();

            const cents = (mx / w) * 1200;
            const nearestNoteIdx = Math.round(cents / 100);
            const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B','C'];
            const noteName = notes[nearestNoteIdx % 12];
            const noteDev = cents - (nearestNoteIdx * 100);

            const nearest440 = Math.round(cents / 100) * 100;
            const dev440 = cents - nearest440;
            const dev432 = (cents - (nearest440 - 31.8));

            const fmt = (n) => (n >= 0 ? "+" : "") + n.toFixed(1);

            const boxW = 205; const boxH = 65; // Expanded Size
            const boxX = w - boxW - 10; const boxY = 10;

            ctx.fillStyle = 'rgba(20, 20, 20, 0.9)';
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 1;
            ctx.fillRect(boxX, boxY, boxW, boxH);
            ctx.strokeRect(boxX, boxY, boxW, boxH);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 15px monospace'; // 12px -> 15px
            ctx.textAlign = 'left';
            // Adjusted Y offset (+20)
            ctx.fillText(`${noteName} ${fmt(noteDev)}c (${Math.round(cents)}c)`, boxX + 8, boxY + 20);

            ctx.font = '16px monospace'; // 11px -> 13px
            ctx.fillStyle = COL_440.hex;
            // Adjusted Y offsets for spacing
            ctx.fillText(`Δ ISO (440): ${fmt(dev440)}c`, boxX + 8, boxY + 40);
            ctx.fillStyle = COL_432.hex;
            ctx.fillText(`Δ VER (432): ${fmt(dev432)}c`, boxX + 8, boxY + 56);
        }

        let droneLive440 = 0, droneLive432 = 0;
        if (liveMaxVal > 0.1) {
            const {d440, d432} = getDistanceScore(liveMaxIndex);
            if (d440 < tolerance) droneLive440 = liveMaxVal;
            if (d432 < tolerance) droneLive432 = liveMaxVal;
        }

        const droneAvg440 = peakH440;
        const droneAvg432 = peakH432;

        updateDashboard(fullLive440, fullLive432, fullAvg440, fullAvg432, droneLive440, droneLive432, droneAvg440, droneAvg432, totalSpectrumEnergy);
    }

    function getDistanceScore(binIndex) {
        const currentCents = (binIndex / HISTOGRAM_BINS) * 1200;
        const nearest440 = Math.round(currentCents / 100) * 100;
        const dist440 = Math.abs(currentCents - nearest440);
        let dist432 = Math.min(Math.abs((currentCents % 100) - (100 - 31.8)), Math.abs((currentCents % 100) + 31.8));
        return { d440: dist440, d432: dist432 };
    }







    function getGridLockScore(histogram, targetRef) {
        let onGridEnergy = 0;
        let totalEnergy = 0;
        let shiftCents = 1200 * Math.log2(targetRef / 440);

        // Use the global tolerance variable (set by slider)
        // Ensure we have a sane minimum for calculation (prevent 0 division or extreme strictness)
        const calcTolerance = Math.max(tolerance, 3);

        for (let i = 0; i < histogram.length; i++) {
            const val = histogram[i];
            if (val < 0.001) continue;

            totalEnergy += val;

            const currentCents = (i / histogram.length) * 1200;

            // Normalize the grid offset
            let relativeCents = (currentCents - shiftCents + 1200) % 1200;

            const nearestSemitone = Math.round(relativeCents / 100) * 100;
            const distance = Math.abs(relativeCents - nearestSemitone);

            // USE THE GLOBAL TOLERANCE VARIABLE
            if (distance <= calcTolerance) {
                onGridEnergy += val;
            }
        }

        if (totalEnergy === 0) return 0;
        return (onGridEnergy / totalEnergy);
    }







    function updateDashboard(fl440, fl432, fa440, fa432, dl440, dl432, da440, da432, totalEnergy) {
        // [PATCH v112] Flexible Color Scaler (0% Sat -> 100% Sat)
        const getGradColor = (pct, hue) => {
             const p = Math.min(100, Math.max(0, pct));
             return `hsl(${hue}, ${p}%, 60%)`;
        };
        // [PATCH v112] Formatter with Hue Support
        const fmtVal = (a, b, hue) => {
             const t = a + b;
             if (t < 0.0001) return `<span style="color:#555">--</span>`;
             const p = Math.round((a/t)*100);
             return `<span style="color:${getGradColor(p, hue)}">${p}%</span>`;
        };

        const setHtml = (id, val) => { const el = document.getElementById(id); if(el) el.innerHTML = val; };

        // 1. Time
        let capStr = "0s";
        if (totalValidSeconds < 60) capStr = Math.floor(totalValidSeconds) + "s";
        else capStr = Math.floor(totalValidSeconds/60) + "m " + Math.floor(totalValidSeconds%60) + "s";
        setHtml('hz-sample-time', capStr);

        // 2. Yield
        let yieldPct = 0;
        const usedEnergy = fa440 + fa432;
        if (totalEnergy > 0) yieldPct = Math.round((usedEnergy / totalEnergy) * 100);
        setHtml('hz-yield-val', `<span style="color:${getGradColor(yieldPct, 45)};">${yieldPct}%</span>`);

        // 3. Density
        let densityPct = 0;
        if (totalScanDuration > 0) {
            densityPct = Math.round((totalValidSeconds / totalScanDuration) * 100);
            if(densityPct > 100) densityPct = 100;
        }
        setHtml('hz-density-val', `<span style="color:${getGradColor(densityPct, 45)};">${densityPct}%</span>`);

        // 4. Zone Time
        let zoneTimePct = 0;
        if(totalScanDuration > 0 && totalEnergy > 0) {
            const zoneFraction = usedEnergy / totalEnergy;
            const timeInZone = totalValidSeconds * zoneFraction;
            zoneTimePct = Math.round((timeInZone / totalScanDuration) * 100);
            if(zoneTimePct > 100) zoneTimePct = 100;
        }
        setHtml('hz-zonetime-val', `<span style="color:${getGradColor(zoneTimePct, 45)};">${zoneTimePct}%</span>`);

        // 5. REF HZ (HYBRID)
        const refEl = document.getElementById('hz-ref-val');
        if (refEl) {
             let displayRef = 0;
             if (scanMode === 'standard') {
                 if (totalCentsDeviationCount > 10) displayRef = averageRefHz;
             } else {
                 if (peakRefHz > 0) displayRef = peakRefHz;
             }

             if (displayRef === 0) {
                 refEl.innerHTML = '<span style="color:#555">--</span>';
             } else {
                 refEl.innerHTML = `<span style="color:#fff">${displayRef.toFixed(2)} Hz</span>`;
             }
        }

        // Full Spectrum Stats
        setHtml('fs-432-live', fmtVal(fl432, fl440, 140));
        setHtml('fs-440-live', fmtVal(fl440, fl432, 205));
        setHtml('fs-432-avg', fmtVal(fa432, fa440, 140));
        setHtml('fs-440-avg', fmtVal(fa440, fa432, 205));

        // Anchor Stats
        setHtml('an-432-live', fmtVal(dl432, dl440, 140));
        setHtml('an-440-live', fmtVal(dl440, dl432, 205));
        setHtml('an-432-avg', fmtVal(da432, da440, 140));
        setHtml('an-440-avg', fmtVal(da440, da432, 205));




// --- IMPROVED COHESION LOGIC (AUTO-DETECT) ---
        const confEl = document.getElementById('hz-confidence-val');
        if (confEl) {
            // 1. Calculate scores for both grids regardless of Peak Ref
            const score432 = getGridLockScore(accumulatedHistogram, 432);
            const score440 = getGridLockScore(accumulatedHistogram, 440);

            let label = "--";
            let color = "#555";
            let displayScore = 0;

            // 2. Compare them. Who is winning?
            if (score432 > score440) {
                // The audio fits the 432 grid better
                displayScore = score432;

                if (displayScore > 0.50) {
                    label = "VERDI (TIGHT)";
                    color = "#2ecc71"; // Green
                } else if (displayScore > 0.30) {
                    label = "VERDI (DRIFT)";
                    color = "#f1c40f"; // Yellow
                } else {
                    label = "VERDI (WEAK)";
                    color = "#e74c3c"; // Red
                }
            } else {
                // The audio fits the 440 grid better (or neither)
                displayScore = score440;

                if (displayScore > 0.50) {
                    label = "ISO (STD)";
                    color = "#3498db"; // Blue
                } else if (displayScore > 0.30) {
                     label = "ISO (DRIFT)";
                     color = "#9b59b6"; // Purple
                } else {
                    label = "UNCLEAR";
                    color = "#777"; // Grey
                }
            }

            // 3. Render
            if (totalEnergy > 0) {
                const pct = Math.round(displayScore * 100);
                confEl.innerHTML = `<span style="color:${color}; font-weight:bold;">${label} ${pct}%</span>`;
            } else {
                confEl.innerHTML = `<span style="color:#555">--</span>`;
            }
        }



    }

    function setupInteraction(element, handle) {
        if(!handle) handle = element;
        handle.onmousedown = (e) => {
            interaction = { mode: 'drag', startX: e.clientX, startY: e.clientY, el: element };
            const r = element.getBoundingClientRect();
            element.style.left = r.left+'px'; element.style.top = r.top+'px'; element.style.transform='none';
        };
        const resizer = element.querySelector('.hz-resize-handle');
        if(resizer) {
            resizer.onmousedown = (e) => {
                interaction = { mode: 'resize', startX: e.clientX, startY: e.clientY, startWidth: element.offsetWidth, startHeight: element.offsetHeight, el: element };
                e.stopPropagation();
            };
        }
    }

    document.addEventListener('mousemove', (e) => {
        if(!interaction.mode) return;
        e.preventDefault();
        const dx = e.clientX - interaction.startX;
        const dy = e.clientY - interaction.startY;
        if(interaction.mode === 'drag') {
            interaction.el.style.transform = `translate(${dx}px, ${dy}px)`;
        }
        else if(interaction.mode === 'resize') {
            interaction.el.style.width = Math.max(500, interaction.startWidth + dx) + 'px';
            interaction.el.style.height = Math.max( 320, interaction.startHeight + dy) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        if(interaction.mode === 'drag' && interaction.el) {
            const r = interaction.el.getBoundingClientRect();
            interaction.el.style.left = r.left+'px'; interaction.el.style.top = r.top+'px'; interaction.el.style.transform = 'none';
            if(interaction.el.id === 'hz-evidence-modal') { modalPrefs.x = r.left; modalPrefs.y = r.top; }
        } else if (interaction.mode === 'resize' && interaction.el) {
            modalPrefs.w = interaction.el.offsetWidth;
            modalPrefs.h = interaction.el.offsetHeight;
        }
        interaction.mode = null;
    });

    
    window.addEventListener('yt-navigate-finish', () => {
        // [PATCH v99] Visual Format Switch Handler
        // Detects Shorts<->Standard switch, wipes sidebar UI, shows message, then reloads.
        const currentMode = window.location.pathname.includes('/shorts/') ? 'shorts' : 'standard';
        
        if (window.hzSessionMode && window.hzSessionMode !== currentMode) {
            console.log('Hz Scanner: Format change detected. Initiating visual reload sequence...');

            // 1. Locate the Sidebar
            const bar = document.getElementById('hz-master-sidebar');
            if (bar) {
                // 2. Wipe existing buttons
                bar.innerHTML = '';
                
                // 3. Style for Warning State
                Object.assign(bar.style, {
                    background: '#c0392b', // Red warning color
                    borderColor: '#e74c3c',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '10px'
                });

                // 4. Inject Message
                bar.innerHTML = `
                    <div style="font-size:15px; font-weight:900; margin-bottom:5px;">⚠️ UPDATE</div>
                    <div style="font-size:13px; font-weight:bold;">FORMAT CHANGED</div>
                    <div style="font-size:12px; margin-top:5px; opacity:0.8;">Refreshing Audio Engine...</div>
                    <div style="font-size:12px; margin-top:2px; opacity:0.8;">(Please Wait)</div>
                `;
            }

            // 5. Reload after short delay to let user see message
            setTimeout(() => {
                window.location.reload();
            }, 2500);
            
            return; // Stop execution of other cleanup tasks
        }
        window.hzSessionMode = currentMode;
        // [PATCH v84] Full Reset
        if(window.hzHearSource) { try{window.hzHearSource.disconnect();}catch(e){} window.hzHearSource=null; }
        if(window.hzStream) { window.hzStream = null; }
        // [PATCH v100 AUDIO FIX] We do NOT close the context here. 
        // Closing it kills the hardware connection for the next video. 
        // Instead, we just let the graph disconnect (handled above) and suspend the context. 
        // [PATCH v102] Passive Navigation. 
        // We removed the premature audio hook logic here. 
        // Audio handover is now handled by the global 'play' listener.// window.hzAudioCtx = null; // KEEP ALIVE
        
        stopScan();
        if(document.getElementById('hz-evidence-modal')) document.getElementById('hz-evidence-modal').remove();
        
        // Sub-modules are handled by their own listeners, but we cleaned global refs above
    });
    

    setInterval(createMasterSidebar, 1000);




    // --- MODULE: SpectrogramMod ---
    const SpectrogramMod = (function() {
        if (window.top !== window.self) return;

    // [PATCH v98] Session Type Tracker
    // Determines if the script loaded in 'Shorts Mode' or 'Standard Mode'
    if (typeof window.hzSessionMode === 'undefined') {
        window.hzSessionMode = window.location.pathname.includes('/shorts/') ? 'shorts' : 'standard';
    }

    // --- PATCH v87: WINDOW MANAGER (BRING TO FRONT) ---
    // Start higher than current CSS (100000)
    window.hzGlobalZ = 100005; 
    document.addEventListener('mousedown', function(e) {
        // Detect clicks on any of the 3 specific modal IDs
        const win = e.target.closest('#hz-evidence-modal, #hz-spectro-modal, #hz-binaural-modal');
        if (win) {
            window.hzGlobalZ++;
            win.style.zIndex = window.hzGlobalZ;
        }
    }, true); // 'true' enables Capture Phase (vital for this to work with drag handlers)
    

    // --- GLOBAL AUDIO INFRASTRUCTURE (v84) ---
    window.ensureGlobalAudio = function(video) {
        // 1. Initialize Context
        if (!window.hzAudioCtx || window.hzAudioCtx.state === 'closed') {
            window.hzAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (window.hzAudioCtx.state === 'suspended') window.hzAudioCtx.resume();

        // 2. Initialize Stream (Once)
        if (!window.hzStream || window.hzStream.active === false) {
            window.hzStream = video.mozCaptureStream ? video.mozCaptureStream() : video.captureStream();
        }

        // 3. Initialize Hearing Path (Once - Prevents Deep Fry & Sound Loss)
        if (!window.hzHearSource) {
            window.hzHearSource = window.hzAudioCtx.createMediaStreamSource(window.hzStream);
            window.hzHearSource.connect(window.hzAudioCtx.destination);
            console.log('Hz Scanner: Global Hearing Path Established');
        }
        
        return window.hzAudioCtx;
    }
    

// /* =========================================
//    1. CSS STYLES
//    ========================================= */
const style = document.createElement('style');
style.innerHTML = `
    /* Base Button Style */
    .hz-btn {
        background: #2a2a2a;
        border: 1px solid #444;
        color: #ccc;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: background 0.2s;
        font-family: Segoe UI, sans-serif;
        margin-right: 8px; /* Spacing between buttons in footer */
    }

    /* Hover State */
    .hz-btn:hover {
        background: #3a3a3a;
        color: #fff;
    }

    /* ACTIVE STATE (Yellow - History) */
    .hz-btn.toggle-on-hist {
        background: #00d2ff;
        color: #000;
        border-color: #00aaff;
    } .hz-btn.toggle-on-hist:hover { background: #40dcff !important; color: #000; }

    /* ACTIVE STATE (Cyan - LTAS) */
    .hz-btn.toggle-on-ltas {
        background: #f1c40f;
        color: #000;
        border-color: #f39c12;
    } .hz-btn.toggle-on-ltas:hover { background: #ffdd57 !important; color: #000; }

    /* Close Button Specifics */
    
    .hz-btn.toggle-on-live {
        background: #00ffcc;
        color: #000;
        border-color: #00aa88;
    } .hz-btn.toggle-on-live:hover { background: #55ffdd !important; color: #000; }
    .hz-btn.toggle-on-smooth { background: #2a2a2a; color: #ccc; border-color: #444; } .hz-btn.toggle-on-smooth:hover { background: #3a3a3a !important; }
    .hz-close-btn {
        background: #333;
        border-color: #555;
    }
    .hz-close-btn:hover {
        background: #c0392b;
        border-color: #e74c3c;
    }
`;
document.head.appendChild(style);

// --- STATE VARIABLES ---
let isScanning = false;
    window.addEventListener('hz-audio-restabilized', () => {
        if (isScanning) {
            const v = document.querySelector('video');
            if(v) ensureAudioConnection(v);
        }
    });
let audioCtx, source, stream, analyser;
let uiUpdateInterval;
let animationFrameId;

// HISTORY STATE (Max Hold)
let showHistory = true;
let showLive = true; // [PATCH v117]
let isSmooth = true;
let accumulatedHistogram = null; // Float32Array
    let flashHz=0; let flashOp=0; let flashCol="#fff"; // [PATCH v139] Flash State

// LTAS STATE (Average)
let showLTAS = true;
let ltasSum = null; // Float32Array (Accumulator)
let ltasCount = 0;  // Frame counter
let lastLiveFrame = null; // [PATCH v118] Frozen buffer

// --- ZOOM & VIEW STATE ---
let spectrumView = {
    minHz: 20,
    maxHz: 22050,
    isDragging: false,
    dragStartX: 0,
    dragStartMin: 0,
    dragStartMax: 0
};

// --- WINDOW STATE MEMORY ---
let modalPrefs = {
    x: null,
    y: null,
    w: 800,
    h: 550
};

// --- MOUSE HOVER STATE ---
let hoverState = {
    canvasId: null,
    x: 0,
    y: 0,
    width: 0,
    height: 0
};

// --- INTERACTION STATE ---
let interaction = {
    mode: null,
    el: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    aspectRatio: 1,
    fontRatio: 20
};

// --- 1. UI Setup (Main Control Panel) ---
function createControlPanel() { return; // Disabled 
/*
    if (document.getElementById('hz-control-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'hz-control-panel';

    Object.assign(panel.style, {
        position: 'fixed', top: '80px', right: '20px', zIndex: '99999',
        width: '200px', height: 'auto',
        backgroundColor: '#151515', borderRadius: '0.5em',
        border: '1px solid #333',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '11px',
        transform: 'translate3d(0px, 0px, 0px)',
        overflow: 'hidden'
    });

    const header = document.createElement('div');
    header.id = 'hz-panel-header';
    Object.assign(header.style, {
        padding: '0.6em 1em', background: '#222',
        borderBottom: '1px solid #333',
        borderRadius: '0.5em 0.5em 0 0', cursor: 'move',
        color: '#ccc', fontSize: '1.1em', fontWeight: 'bold', letterSpacing: '0.05em',
        display: 'flex', justifyContent: 'space-between', flexShrink: '0', userSelect: 'none'
    });
    header.innerHTML = `<span>SPECTROGRAM</span><span style="color:#555">≡</span>`;

    const content = document.createElement('div');
    Object.assign(content.style, {
        padding: '0.8em', display: 'flex', flexDirection: 'column', gap: '0.2em',
        flexGrow: '1', overflow: 'hidden'
    });

    const scanBtn = document.createElement('button');
    scanBtn.id = 'hz-scan-btn';
    scanBtn.innerText = 'SPECTRUM';
    styleButton(scanBtn, '#222');
    scanBtn.onclick = toggleScan;

    content.appendChild(scanBtn);

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'hz-resize-handle';
    Object.assign(resizeHandle.style, {
        position: 'absolute', bottom: '0', right: '0',
        width: '1.5em', height: '1.5em', cursor: 'nwse-resize',
        background: 'transparent',
        zIndex: '100001'
    });

    panel.appendChild(header);
    panel.appendChild(content);
    panel.appendChild(resizeHandle);
    */
}

function styleButton(btn, bgColor) {
    Object.assign(btn.style, {
        padding: '0.6em 0.4em', backgroundColor: bgColor, color: '#fff',
        border: '1px solid #444', borderRadius: '0.3em', cursor: 'pointer',
        fontSize: '1em', fontWeight: 'bold', fontFamily: 'Segoe UI, sans-serif',
        boxShadow: '0 0.2em 0.4em rgba(0,0,0,0.2)', transition: 'background 0.3s',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        height: '2.8em'
    });
}

// --- 2. Audio Logic ---
async function toggleScan() {
    const scanBtn = document.getElementById('hz-btn-spectro');
    const allVideos = document.querySelectorAll('video');
    let video = null;
    for (let v of allVideos) {
        if (!v.paused && v.readyState > 0) {
            video = v;
            break;
        }
    }
    if (!video) video = document.querySelector('video');

    if (isScanning) {
        stopScan();
        closeModal();
        return;
    }

    if (!video || video.paused) {
        const originalText = scanBtn.innerText;
        scanBtn.innerText = "PLAY VIDEO FIRST";
        setTimeout(() => { scanBtn.innerText = originalText; }, 1500);
        return;
    }

    accumulatedHistogram = null; // Reset max history
    ltasSum = null; // Reset LTAS
    ltasCount = 0;

    openEvidenceModal();
    startScan(video, scanBtn);
}


        function ensureAudioConnection(video) {
            try {
                if (typeof window.ensureGlobalAudio !== 'function') { console.error("Global Audio Missing"); return; }
                audioCtx = window.ensureGlobalAudio(video); if(!audioCtx) return;
                cleanupAudioNodes();

                source = audioCtx.createMediaStreamSource(window.hzStream);
                analyser = audioCtx.createAnalyser();
                analyser.fftSize = 32768;
                analyser.smoothingTimeConstant = isSmooth ? 0.85 : 0.0;

                // Init Buffers (Preserve Data on Unpause)
                if (!accumulatedHistogram || accumulatedHistogram.length !== analyser.frequencyBinCount) {
                    accumulatedHistogram = new Float32Array(analyser.frequencyBinCount);
                }
                if (!ltasSum || ltasSum.length !== analyser.frequencyBinCount) {
                    ltasSum = new Float32Array(analyser.frequencyBinCount);
                    ltasCount = 0;
                }

                
                // [PATCH v85] Vitality: Force browser to process data via muted path
                const zGain = audioCtx.createGain();
                zGain.gain.value = 0.0001; // [PATCH v86] Anti-optimization
                source.connect(analyser);
                analyser.connect(zGain);
                zGain.connect(audioCtx.destination);
    
            } catch (e) { console.error("Audio connection attempt failed", e); }
        }
        

function getNoteName(freq) {
    if(!freq) return "--";
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const midiNum = 12 * Math.log2(freq / 440) + 69;
    const noteIndex = Math.round(midiNum) % 12;
    const octave = Math.floor(Math.round(midiNum) / 12) - 1;
    let noteName = notes[noteIndex];
    if (noteIndex < 0) noteName = notes[noteIndex + 12];
    if(!noteName) return "--";
    return `${noteName}${octave}`;
}

// --- VISUAL LOOP ---
function startVisualLoop() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    function loop() {
        const modal = document.getElementById('hz-spectro-modal');
        if (!modal) return;

        if (isScanning) {
             const spectrumCanvas = modal.querySelector('#hz-spectrum-canvas');
             if(spectrumCanvas) drawInteractiveSpectrum(spectrumCanvas);
        }
        animationFrameId = requestAnimationFrame(loop);
    }
    loop();
}

function startScan(video, activeBtn) {
    isScanning = true;
    activeBtn.innerText = 'SPECTRUM: ON';
    activeBtn.classList.add('hz-btn-active');

    try {
        ensureAudioConnection(video);
        startVisualLoop();
    } catch (e) { console.error(e); stopScan(); }
}

function stopScan() {
    isScanning = false;
    clearInterval(uiUpdateInterval);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    cleanupAudioNodes();
    const scanBtn = document.getElementById('hz-btn-spectro');
    if(scanBtn) {
        scanBtn.innerText = 'SPECTRUM';
        scanBtn.classList.remove('hz-btn-active');
    }
}

// --- 4. Modal & Drag/Resize Logic ---
function openEvidenceModal() {
    if(document.getElementById('hz-spectro-modal')) { renderModalContent(); return; }

    const modal = document.createElement('div');
    modal.id = 'hz-spectro-modal';

    let targetX, targetY;
    if (modalPrefs.x !== null && modalPrefs.y !== null) {
        targetX = modalPrefs.x; targetY = modalPrefs.y;
    } else {
        targetX = (window.innerWidth / 2) - 400; targetY = (window.innerHeight / 2) - 275;
    }

    Object.assign(modal.style, {
        position: 'fixed', top: targetY + 'px', left: targetX + 'px',
        width: modalPrefs.w + 'px', height: modalPrefs.h + 'px',
        fontSize: (modalPrefs.w / 50) + 'px',
        backgroundColor: '#151515', borderRadius: '4px',
        boxShadow: '0 15px 50px rgba(0,0,0,0.9)', zIndex: ++window.hzGlobalZ,
        color: '#eee', fontFamily: 'Segoe UI, sans-serif', border: '1px solid #333',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: 'translate3d(0,0,0)'
    });

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'hz-resize-handle';
    Object.assign(resizeHandle.style, {
        position: 'absolute', bottom: '0', right: '0',
        width: '2em', height: '2em', cursor: 'nwse-resize',
        background: 'transparent',
        zIndex: '100001'
    });
    modal.appendChild(resizeHandle);

    document.body.appendChild(modal);
    renderModalContent();

    if (isScanning) startVisualLoop();
}

function lockPositionToPixels(el) {
    const rect = el.getBoundingClientRect();
    el.style.left = rect.left + 'px'; el.style.top = rect.top + 'px';
    el.style.right = 'auto'; el.style.bottom = 'auto'; el.style.transform = 'translate3d(0,0,0)';
}

function handleMouseDown(e) {
    const resizeTarget = e.target.closest('.hz-resize-handle');
    const dragTarget = e.target.closest('#hz-spectro-header') ? document.getElementById('hz-spectro-modal') :
                       e.target.closest('#hz-panel-header') ? document.getElementById('hz-control-panel') : null;
    const spectrumCanvas = e.target.id === 'hz-spectrum-canvas' ? e.target : null;

    if (spectrumCanvas) {
        e.preventDefault();
        spectrumView.isDragging = true;
        spectrumView.dragStartX = e.clientX;
        spectrumView.dragStartMin = spectrumView.minHz;
        spectrumView.dragStartMax = spectrumView.maxHz;
        return;
    }

    if (resizeTarget) {
        e.preventDefault();
        const targetEl = resizeTarget.closest('#hz-spectro-modal');
        if (!targetEl) return;
        lockPositionToPixels(targetEl);
        interaction.mode = 'resize'; interaction.el = targetEl;
        interaction.startX = e.clientX; interaction.startY = e.clientY;
        interaction.startWidth = targetEl.offsetWidth; interaction.startHeight = targetEl.offsetHeight;
        interaction.aspectRatio = interaction.startWidth / interaction.startHeight;
        interaction.fontRatio = (targetEl.id === 'hz-control-panel') ? 20 : 50;
        return;
    }
    if (dragTarget) {
        lockPositionToPixels(dragTarget);
        interaction.mode = 'drag'; interaction.el = dragTarget;
        interaction.startX = e.clientX; interaction.startY = e.clientY;
    }
}

function handleMouseMove(e) {
    if (spectrumView.isDragging) {
        e.preventDefault();
        const spectrumCanvas = document.getElementById('hz-spectrum-canvas');
        if(!spectrumCanvas) return;

        const w = spectrumCanvas.width;
        const dxPixels = e.clientX - spectrumView.dragStartX;
        const minLog = Math.log10(spectrumView.dragStartMin);
        const maxLog = Math.log10(spectrumView.dragStartMax);
        const range = maxLog - minLog;
        const pctMoved = dxPixels / w; // [PATCH v134] Retina Fix
        const shift = range * pctMoved;
        const newMinLog = minLog - shift;
        const newMaxLog = maxLog - shift;

        if (newMinLog >= Math.log10(1) && newMaxLog <= Math.log10(24000)) {
            spectrumView.minHz = Math.pow(10, newMinLog);
            spectrumView.maxHz = Math.pow(10, newMaxLog);
        }
        return;
    }

    if (!interaction.mode || !interaction.el) return;
    e.preventDefault();
    const dx = e.clientX - interaction.startX; const dy = e.clientY - interaction.startY;
    if (interaction.mode === 'resize') {
        let newWidth = Math.max(150, interaction.startWidth + dx);
        let newHeight = newWidth / interaction.aspectRatio;
        if(interaction.el.id === 'hz-spectro-modal') newHeight = Math.max(200, interaction.startHeight + dy);

        interaction.el.style.width = newWidth + 'px'; interaction.el.style.height = newHeight + 'px';
        interaction.el.style.fontSize = (newWidth / interaction.fontRatio) + 'px';
    } else if (interaction.mode === 'drag') {
        interaction.el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }
}

function handleMouseUp(e) {
    spectrumView.isDragging = false;
    if (interaction.el) {
        if (interaction.mode === 'drag') {
            const rect = interaction.el.getBoundingClientRect();
            interaction.el.style.left = rect.left + 'px'; interaction.el.style.top = rect.top + 'px';
            interaction.el.style.transform = 'translate3d(0,0,0)';
        }
        if (interaction.el.id === 'hz-spectro-modal') {
             const rect = interaction.el.getBoundingClientRect();
             modalPrefs.x = rect.left; modalPrefs.y = rect.top; modalPrefs.w = rect.width; modalPrefs.h = rect.height;
        }
    }
    interaction.mode = null; interaction.el = null;
}

function handleWheel(e) {
    const cv = document.getElementById('hz-spectrum-canvas');
    if(cv && e.target === cv) {
        e.preventDefault();

        const rect = cv.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const w = rect.width;

        const minLog = Math.log10(spectrumView.minHz);
        const maxLog = Math.log10(spectrumView.maxHz);
        const range = maxLog - minLog;

        const r = mouseX / w;
        const mouseLogFreq = minLog + (range * r);
        const zoomFactor = e.deltaY < 0 ? 0.9 : 1.1;
        const newRange = range * zoomFactor;

        let newMinLog = mouseLogFreq - (newRange * r);
        let newMaxLog = mouseLogFreq + (newRange * (1 - r));

        if (newMinLog < Math.log10(1)) newMinLog = Math.log10(1);
        if (newMaxLog > Math.log10(24000)) newMaxLog = Math.log10(24000);

        if (newMaxLog - newMinLog > 0.05) {
            spectrumView.minHz = Math.pow(10, newMinLog);
            spectrumView.maxHz = Math.pow(10, newMaxLog);

            // --- PATCH v97: SYNC SLIDER TO WHEEL ---
            const sl = document.getElementById('hz-spec-zoom-slider');
            if(sl) {
                const curSpan = newMaxLog - newMinLog;
                // Constants must match the slider logic
                const maxS = 3.04; const minS = 0.05;
                // Inverse lerp: calculate t from span
                let t = (maxS - curSpan) / (maxS - minS);
                if(t < 0) t = 0; if(t > 1) t = 1;
                sl.value = Math.round(t * 1000);
            }
        }
    }
}

document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('wheel', handleWheel, { passive: false });

// --- Modal Content ---
function renderModalContent() {
    const modal = document.getElementById('hz-spectro-modal');
    if(!modal) return;

    let resizeHandle = modal.querySelector('.hz-resize-handle');

    let header = `
        <div id="hz-spectro-header" style="
            padding: 8px 12px; background: #222; border-bottom: 1px solid #444;
            cursor: move; border-radius: 0; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; user-select:none;">
            <div><span style="font-weight: bold; color: #fff; font-size: 16px; letter-spacing: 0.5px;">Spectrum</span><span style="font-family:'Consolas', monospace; font-size:12px; color:#555; margin-left:12px;">1Hz-24kHz | Log Scale | 32k FFT | 0.85 Smooth | LTAS</span></div><button id="hz-spectro-close" class="hz-btn-close">✖</button>
        </div>
    `;

    let contentHTML = `
        <div style="flex: 1; display: flex; flex-direction: column; padding: 0; overflow: hidden; min-height: 0; background: #000; position: relative;">
             <div class="hz-overlay-info" style="top:10px; left:10px;">
                <div style="color:#00ffcc; font-weight:bold;">▮ Live (Green)</div>
                <div style="color:#00d2ff; font-weight:bold;">▮ Peak (Cyan)</div>
                <div style="color:#f1c40f; font-weight:bold;">▮ Avg (Yellow)</div>
             </div>
             <canvas id="hz-spectrum-canvas"  style="width: 100%; height: 100%; display: block; cursor: crosshair;"></canvas>
        </div>`;

    // FOOTER CONTROLS
    let footer = `
        <div style="padding: 0.8em; border-top: 1px solid #333; background: #151515; flex-shrink: 0; display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex;">
                <button id="hz-win-smooth-toggle" title="Blur (0.85) | Raw (0.0)" class="hz-btn ${isSmooth ? 'toggle-on-smooth' : ''}">${isSmooth ? 'Smooth: ON' : 'Raw: ON'}</button>
                <button id="hz-win-live-toggle" title="Current signal" class="hz-btn ${showLive ? 'toggle-on-live' : ''}">${showLive ? 'Live: ON' : 'Live: OFF'}</button>
                <button id="hz-win-hist-toggle" title="Max Hold: highest point reached" class="hz-btn ${showHistory ? 'toggle-on-hist' : ''}">${showHistory ? 'Peak: ON' : 'Peak: OFF'}</button>
                <button id="hz-win-ltas-toggle" title="Long-term average (LTAS)" class="hz-btn ${showLTAS ? 'toggle-on-ltas' : ''}">${showLTAS ? 'Average: ON' : 'Average: OFF'}</button>
                <button id="hz-win-reset-btn" class="hz-btn">Reset</button>
            </div>
            <div style="display:flex; gap:10px; align-items:center; margin-right:25px;">
                <div style="display:flex; gap:4px;">
                    <button id="hz-set-432" class="hz-btn" style="color:#2ecc71; border-color:#27ae60;" title="Pan to 432Hz">432</button>
                    <button id="hz-set-440" class="hz-btn" style="color:#3498db; border-color:#2980b9;" title="Pan to 440Hz">440</button>
                    <div style="display:flex; align-items:center; border:1px solid #8e44ad; border-radius:4px; overflow:hidden; height:32px; margin-left:0px;"><input type="number" id="hz-custom-input" value="528" style="width:50px; background:#181818; border:none; color:#9b59b6; font-family:monospace; font-weight:bold; font-size:14px; text-align:center; outline:none; -moz-appearance:textfield;" title="Type frequency, press Enter or GO"><button id="hz-custom-go" style="background:#2a2a2a; border:none; border-left:1px solid #8e44ad; color:#9b59b6; font-size:14px; cursor:pointer; padding:0 12px; font-weight:bold; height:100%;">GO</button></div>
                </div>
                <div style="display:flex; align-items:center; gap:5px;">
                    <span class="hz-label" style="position:relative; bottom:2px;">Zoom</span>
                    <input type="range" id="hz-spec-zoom-slider" min="0" max="1000" value="0" style="width:100px; cursor:pointer;">
                </div>
            </div>
            
        </div>
    `;

    modal.innerHTML = header + contentHTML + footer;

    if(!resizeHandle) {
         resizeHandle = document.createElement('div');
         resizeHandle.className = 'hz-resize-handle';
         Object.assign(resizeHandle.style, {
            position: 'absolute', bottom: '0', right: '0',
            width: '2em', height: '2em', cursor: 'nwse-resize',
            background: 'transparent',
            zIndex: '100001'
        });
    }
    modal.appendChild(resizeHandle);

    // --- BIND FOOTER BUTTONS ---
    const liveBtn = document.getElementById('hz-win-live-toggle');
    const histBtn = document.getElementById('hz-win-hist-toggle');
    const ltasBtn = document.getElementById('hz-win-ltas-toggle');
    const resetBtn = document.getElementById('hz-win-reset-btn');
    const closeBtn = document.getElementById('hz-spectro-close');

    // Smooth Toggle
    const smoothBtn = document.getElementById('hz-win-smooth-toggle');
    smoothBtn.onclick = () => {
        isSmooth = !isSmooth;
        if(analyser) analyser.smoothingTimeConstant = isSmooth ? 0.85 : 0.0;
        smoothBtn.innerText = isSmooth ? "Smooth: ON" : "Raw: ON";
        if(isSmooth) {
            smoothBtn.classList.add('toggle-on-smooth');
        } else {
            smoothBtn.classList.remove('toggle-on-smooth');
        }
    };

    // [PATCH v117] Live Toggle
    liveBtn.onclick = () => {
        showLive = !showLive;
        if(showLive) {
            liveBtn.innerText = "Live: ON";
            liveBtn.classList.add('toggle-on-live');
        } else {
            liveBtn.innerText = "Live: OFF";
            liveBtn.classList.remove('toggle-on-live');
        }
    };

    histBtn.onclick = () => {
        showHistory = !showHistory;
        if(showHistory) {
            histBtn.innerText = "Peak: ON";
            histBtn.classList.add('toggle-on-hist');
        } else {
            histBtn.innerText = "Peak: OFF";
            histBtn.classList.remove('toggle-on-hist');
        }
    };

    ltasBtn.onclick = () => {
        showLTAS = !showLTAS;
        if(showLTAS) {
            ltasBtn.innerText = "Average: ON";
            ltasBtn.classList.add('toggle-on-ltas');
        } else {
            ltasBtn.innerText = "Average: OFF";
            ltasBtn.classList.remove('toggle-on-ltas');
        }
    };

    resetBtn.onclick = () => {
        if(accumulatedHistogram) accumulatedHistogram.fill(0);
        if(ltasSum) ltasSum.fill(0);
        ltasCount = 0;
    };

    // --- PATCH v94: PAN & SLIDER ---
    const panTo = (hz) => {
        const minLog = Math.log10(spectrumView.minHz);
        const maxLog = Math.log10(spectrumView.maxHz);
        const span = maxLog - minLog;
        const targetLog = Math.log10(hz);
        
        // Center the view on target, preserving current zoom (span)
        let nMin = targetLog - span/2; let nMax = targetLog + span/2; const lMax = Math.log10(24000); if(nMax > lMax) { nMax = lMax; nMin = nMax - span; } const lMin = Math.log10(1); if(nMin < lMin) { nMin = lMin; nMax = nMin + span; } spectrumView.minHz = Math.pow(10, nMin); spectrumView.maxHz = Math.pow(10, nMax);
    };
    
    document.getElementById('hz-set-432').onclick = () => { panTo(432); flashHz=432; flashOp=1; flashCol='#2ecc71'; };
    document.getElementById('hz-set-440').onclick = () => { panTo(440); flashHz=440; flashOp=1; flashCol='#3498db'; };
    const cIn = document.getElementById('hz-custom-input'); const cGo = document.getElementById('hz-custom-go'); const doCustom = () => { let v = parseFloat(cIn.value); if(isNaN(v)) return; if(v < 1) v = 1; if(v > 24000) v = 24000; cIn.value = v; panTo(v); flashHz=v; flashOp=1; flashCol='#9b59b6'; }; if(cGo) cGo.onclick = doCustom; if(cIn) cIn.onkeydown = (e) => { if(e.key==='Enter') doCustom(); };

    const zSlider = document.getElementById('hz-spec-zoom-slider');
    if (zSlider) {
        zSlider.oninput = (e) => {
            const v = parseInt(e.target.value);
            // 0 = Wide (Span ~3.0), 1000 = Tight (Span ~0.02)
            const maxS = 3.04; const minS = 0.05; 
            const t = v / 1000;
            const newSpan = maxS - (t * (maxS - minS));
            
            const curMin = Math.log10(spectrumView.minHz);
            const curMax = Math.log10(spectrumView.maxHz);
            const center = (curMin + curMax) / 2;
            
            spectrumView.minHz = Math.pow(10, center - newSpan/2);
            spectrumView.maxHz = Math.pow(10, center + newSpan/2);
        };
    }

    closeBtn.onclick = () => {
        stopScan();
        closeModal();
    };

    const cv = modal.querySelector('canvas');
    if(cv) {
        cv.addEventListener('mousemove', (e) => {
            const rect = cv.getBoundingClientRect();
            hoverState.canvasId = cv.id;
            hoverState.x = (e.clientX - rect.left) * (cv.width / rect.width);
            hoverState.y = (e.clientY - rect.top) * (cv.height / rect.height);
        });
        cv.addEventListener('mouseleave', () => { hoverState.canvasId = null; });
    }
}

function checkResize(canvas) {
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width; canvas.height = rect.height;
    }
}

// INTERACTIVE SPECTRUM WITH HISTORY
function drawInteractiveSpectrum(canvas) {
    if (!canvas || !analyser) return;
    
    // [PATCH v118] Render even when paused (for Zoom/Pan)
    checkResize(canvas);
    const ctx = canvas.getContext('2d');
    const w = canvas.width; const h = canvas.height;

    const bufferLength = analyser.frequencyBinCount;
    
    // Allocate persistent buffer if needed
    if (!lastLiveFrame || lastLiveFrame.length !== bufferLength) {
        lastLiveFrame = new Uint8Array(bufferLength);
    }

    const vid = document.querySelector('video');
    // Only update data if video is actually playing
    if (vid && !vid.paused && !vid.seeking) {
        // [PATCH v158] Silence Gate: Prevent visual drop during re-hook
            const tmpFrame = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(tmpFrame);
            // Check for signal existence (sparse check)
            let hasSig = false; 
            for(let i=0; i<bufferLength; i+=50) { if(tmpFrame[i] > 0) { hasSig = true; break; } }
            
            // Only update display if we have actual audio, otherwise hold previous frame
            if(hasSig) {
                lastLiveFrame.set(tmpFrame);
            }

        // --- DATA PROCESSING (Only when playing) ---
        // 1. Accumulate Peak
        if (accumulatedHistogram && accumulatedHistogram.length === bufferLength) {
            for (let i = 0; i < bufferLength; i++) {
                if (lastLiveFrame[i] > accumulatedHistogram[i]) {
                    accumulatedHistogram[i] = lastLiveFrame[i];
                }
            }
        }

        // 2. Accumulate Average
        if (ltasSum && ltasSum.length === bufferLength) {
            ltasCount++;
            for (let i = 0; i < bufferLength; i++) {
                ltasSum[i] += lastLiveFrame[i];
            }
        }
    }
    
    // Use the frozen frame for drawing
    const dataArray = lastLiveFrame;

    // --- DRAWING ---
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    const titleFontSize = Math.max(10, w / 45);
    ctx.fillStyle = '#aaa';
    ctx.font = `${titleFontSize}px sans-serif`;
    ctx.textAlign = 'left';
    // Legend handled by HTML overlay

    // --- PEAK DETECTION (ALL LAYERS) ---
    let maxAmp = 0;
    let maxBin = 0;
    // [PATCH v141] Fix Drift: Track neighbors from the winning layer only
    let subPrev = 0; let subNext = 0; let subMax = 0;

    // 1. Check Live
    if (showLive) {
        for(let i=0; i<bufferLength; i++) {
            if(dataArray[i] > maxAmp) { 
                maxAmp = dataArray[i]; 
                maxBin = i; 
                subPrev = dataArray[i-1]||0; subNext = dataArray[i+1]||0; subMax = dataArray[i];
            }
        }
    }
    // 2. Check Peak (History)
    if (showHistory && accumulatedHistogram) {
        for(let i=0; i<bufferLength; i++) {
            if(accumulatedHistogram[i] > maxAmp) { 
                maxAmp = accumulatedHistogram[i]; 
                maxBin = i; 
                subPrev = accumulatedHistogram[i-1]||0; subNext = accumulatedHistogram[i+1]||0; subMax = accumulatedHistogram[i];
            }
        }
    }
    // 3. Check Average (LTAS)
    if (showLTAS && ltasSum && ltasCount > 0) {
        for(let i=0; i<bufferLength; i++) {
            let v = ltasSum[i] / ltasCount;
            if(v > maxAmp) { 
                maxAmp = v; 
                maxBin = i; 
                // Normalize neighbors for interpolation
                subPrev = (ltasSum[i-1]||0)/ltasCount; subNext = (ltasSum[i+1]||0)/ltasCount; subMax = v;
            }
        }
    }

    const sampleRate = audioCtx.sampleRate;
    const binSize = sampleRate / analyser.fftSize;
    let peakHz = maxBin * binSize;
        
        // [PATCH v141] Parabolic Interpolation (Context Aware)
        // Uses the capture neighbors (subPrev/subNext) instead of live dataArray
        if (maxBin > 0 && maxBin < bufferLength - 1) {
            // Prevent division by zero if flat
            if ((subPrev - 2 * subMax + subNext) !== 0) {
                const p = 0.5 * (subPrev - subNext) / (subPrev - 2 * subMax + subNext);
                peakHz = (maxBin + p) * binSize;
            }
        }

    if (maxAmp > 10) {
        ctx.textAlign = 'right';
        ctx.fillStyle = '#e67e22';
        ctx.font = `bold ${titleFontSize}px monospace`;
        ctx.fillText(`Peak: ${peakHz.toFixed(1)} Hz`, w - 10, titleFontSize + 5);
    }

    // --- HELPER: Coordinate Mapping ---
    const minLog = Math.log10(spectrumView.minHz);
    const maxLog = Math.log10(spectrumView.maxHz);
    const logRange = maxLog - minLog;

    function getX(freq) {
        if(freq <= spectrumView.minHz) return 0;
        if(freq >= spectrumView.maxHz) return w;
        const logF = Math.log10(freq);
        return ((logF - minLog) / logRange) * w;
    }

    function getFreqFromX(x) {
        const r = x / w;
        const logFreq = minLog + (r * logRange);
        return Math.pow(10, logFreq);
    }

    // --- 1. DRAW LTAS (AVERAGE) LAYER (Cyan Line) ---
    if (showLTAS && ltasSum && ltasCount > 0) {
        ctx.strokeStyle = '#f1c40f'; // Yellow for Average
        ctx.lineWidth = 2;
        ctx.beginPath();
        let started = false;
        for(let x = 0; x <= w; x+=2) {
            const freq = getFreqFromX(x);
            const binIndex = Math.round(freq * analyser.fftSize / sampleRate);
            if (binIndex >= 0 && binIndex < bufferLength) {
                // Calculate Average for this bin
                const avgVal = ltasSum[binIndex] / ltasCount;
                const normVal = avgVal / 255.0; // Normalize 0-1
                const y = h - (normVal * h);

                if (!started) { ctx.moveTo(x, y); started = true; }
                else { ctx.lineTo(x, y); }
            }
        }
        ctx.stroke();
    }

    // --- 2. DRAW HISTORY LAYER (Yellow Line) ---
    if (showHistory && accumulatedHistogram) {
        ctx.strokeStyle = '#00d2ff'; // Cyan matches .toggle-on
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        let started = false;
        for(let x = 0; x <= w; x+=2) {
            const freq = getFreqFromX(x);
            const binIndex = Math.round(freq * analyser.fftSize / sampleRate);
            if (binIndex >= 0 && binIndex < bufferLength) {
                const val = accumulatedHistogram[binIndex];
                const normVal = val / 255.0;
                const y = h - (normVal * h);
                if (!started) { ctx.moveTo(x, y); started = true; }
                else { ctx.lineTo(x, y); }
            }
        }
        ctx.stroke();
    }

    // --- 3. DRAW LIVE SPECTRUM (Solid) ---
    if (showLive) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        for(let x = 0; x <= w; x+=2) {
            const freq = getFreqFromX(x);
            const binIndex = Math.round(freq * analyser.fftSize / sampleRate);
            if (binIndex >= 0 && binIndex < bufferLength) {
                const v = dataArray[binIndex] / 255.0;
                const y = h - (v * h);
                ctx.lineTo(x, y);
            }
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = 'rgba(30, 30, 30, 0.5)'; // More transparent fill to see LTAS behind
        ctx.fill();
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // --- DRAW PEAK MARKER ---
    if (peakHz >= spectrumView.minHz && peakHz <= spectrumView.maxHz && maxAmp > 20) {
        const peakX = getX(peakHz);
        const peakY = h - ((maxAmp / 255.0) * h);
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.moveTo(peakX, peakY - 10);
        ctx.lineTo(peakX - 5, peakY - 18);
        ctx.lineTo(peakX + 5, peakY - 18);
        ctx.fill();
    }

    // --- GRID LINES ---
    const gridFontSize = Math.max(9, w / 65);
    ctx.font = `${gridFontSize}px monospace`;
    ctx.textAlign = 'center';

    let gridStep = 100;
    if (spectrumView.maxHz - spectrumView.minHz < 500) gridStep = 50;
    if (spectrumView.maxHz - spectrumView.minHz < 100) gridStep = 10;
    if (spectrumView.maxHz - spectrumView.minHz < 20) gridStep = 1;
    if (spectrumView.maxHz - spectrumView.minHz > 2000) gridStep = 1000;

    const startGrid = Math.floor(spectrumView.minHz / gridStep) * gridStep;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    for(let f = startGrid; f < spectrumView.maxHz; f += gridStep) {
        if(f < spectrumView.minHz) continue;
        const gx = getX(f);
        ctx.moveTo(gx, 0); ctx.lineTo(gx, h);
    }
    ctx.stroke();

    // --- LABELS ---
    ctx.fillStyle = '#ffffff';
    for(let f = startGrid; f < spectrumView.maxHz; f += gridStep) {
        if(f < spectrumView.minHz) continue;
        const gx = getX(f);
        ctx.fillText(`${f}`, gx, h - 5);
    }

    
    // --- FLASH EFFECT [PATCH v139] ---
    if (flashOp > 0.005) {
        const fx = getX(flashHz);
        if (fx >= 0 && fx <= w) {
            ctx.save();
            ctx.globalAlpha = flashOp;
            ctx.strokeStyle = flashCol;
            ctx.lineWidth = 2;
            ctx.shadowColor = flashCol;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.moveTo(fx, 0);
            ctx.lineTo(fx, h);
            ctx.stroke();
            ctx.restore();
        }
        flashOp *= 0.995; // Fade out
    }

    // --- HOVER TOOLTIP ---
    if (hoverState.canvasId === canvas.id) {
        const mouseFreq = getFreqFromX(hoverState.x);
        const mouseBin = Math.round(mouseFreq * analyser.fftSize / sampleRate);
        const amp = dataArray[mouseBin] || 0;
        const histAmp = accumulatedHistogram ? (accumulatedHistogram[mouseBin] || 0) : 0;
        const ltasAmp = (ltasSum && ltasCount > 0) ? (ltasSum[mouseBin] / ltasCount) : 0;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(hoverState.x, 0);
        ctx.lineTo(hoverState.x, h);
        ctx.stroke();
        ctx.setLineDash([]);

        const note = getNoteName(mouseFreq);
        // Fixed Info Box (Top Right)
        const boxW = 120; const boxH = 95; // Compact Size
        const boxX = w - boxW - 10; const boxY = 35;

        ctx.fillStyle = 'rgba(20, 20, 20, 0.9)';
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        ctx.fillRect(boxX, boxY, boxW, boxH);
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        ctx.font = 'bold 15px monospace'; // 12px -> 15px
        ctx.textAlign = 'left';
        ctx.fillStyle = '#fff';
        // Adjusted Y offsets
        ctx.fillText(`${mouseFreq.toFixed(1)} Hz`, boxX + 8, boxY + 20);
        ctx.fillText(`Note: ${getNoteName(mouseFreq)}`, boxX + 8, boxY + 38);
        
        ctx.font = '16px monospace'; // 11px -> 13px
        ctx.fillStyle = '#00ffcc'; 
        ctx.fillText(`Live: ${Math.floor(amp/255*100)}%`, boxX + 8, boxY + 56);
        ctx.fillStyle = '#00d2ff'; 
        ctx.fillText(`Peak: ${Math.floor(histAmp/255*100)}%`, boxX + 8, boxY + 70);
        ctx.fillStyle = '#f1c40f'; 
        ctx.fillText(`Avg : ${Math.floor(ltasAmp/255*100)}%`, boxX + 8, boxY + 84);
    }
}

function closeModal() {
    const m = document.getElementById('hz-spectro-modal');
    if (m) m.remove();
    if (interaction.el === m) { interaction.mode = null; interaction.el = null; }
}


    function cleanupAudioNodes() {
        // [PATCH v84] Safe Disposal - Only kills local tool nodes
        if (source) {
            try { source.disconnect(); } catch(e){} // Disconnects from analyser/scriptNode
            source = null;
        }
        if (scriptNode) { try{scriptNode.disconnect();}catch(e){} scriptNode = null; }
        // We do NOT nullify stream or audioCtx, they are global now
    }
    


    window.addEventListener('yt-navigate-finish', () => {
        // [PATCH v98] Format Switch Auto-Reload
        // If we switch from Shorts to Standard (or vice versa), force a reload to fix audio bugs.
        const currentMode = window.location.pathname.includes('/shorts/') ? 'shorts' : 'standard';
        
        if (window.hzSessionMode && window.hzSessionMode !== currentMode) {
            console.log('Hz Scanner: Format change detected (' + window.hzSessionMode + ' -> ' + currentMode + '). Reloading...');
            window.location.reload();
            return;
        }
        window.hzSessionMode = currentMode;
        // [PATCH v84] Full Reset
        if(window.hzHearSource) { try{window.hzHearSource.disconnect();}catch(e){} window.hzHearSource=null; }
        if(window.hzStream) { window.hzStream = null; }
        // [PATCH v100 AUDIO FIX] We do NOT close the context here. 
        // Closing it kills the hardware connection for the next video. 
        // Instead, we just let the graph disconnect (handled above) and suspend the context. 
        // [PATCH v102] Passive Navigation. 
        // We removed the premature audio hook logic here. 
        // Audio handover is now handled by the global 'play' listener.// window.hzAudioCtx = null; // KEEP ALIVE
        
        stopScan();
        interaction.mode = null; interaction.el = null; // Fix Ghost Drag
        if(document.getElementById('hz-spectro-modal')) document.getElementById('hz-spectro-modal').remove();
        
        // Sub-modules are handled by their own listeners, but we cleaned global refs above
    });
    

// [Disabled internal widget creation]


        
        // Expose the toggle function to the main script
        return {
            toggle: toggleScan, stop: stopScan
        };
    })();
    


    // --- MODULE: BinauralMod ---
    const BinauralMod = (function() {
        // --- BUG FIX: PREVENT RUNNING IN IFRAMES (CHAT) ---
if (window.top !== window.self) return;

    // [PATCH v98] Session Type Tracker
    // Determines if the script loaded in 'Shorts Mode' or 'Standard Mode'
    if (typeof window.hzSessionMode === 'undefined') {
        window.hzSessionMode = window.location.pathname.includes('/shorts/') ? 'shorts' : 'standard';
    }

    // --- PATCH v87: WINDOW MANAGER (BRING TO FRONT) ---
    // Start higher than current CSS (100000)
    window.hzGlobalZ = 100005; 
    document.addEventListener('mousedown', function(e) {
        // Detect clicks on any of the 3 specific modal IDs
        const win = e.target.closest('#hz-evidence-modal, #hz-spectro-modal, #hz-binaural-modal');
        if (win) {
            window.hzGlobalZ++;
            win.style.zIndex = window.hzGlobalZ;
        }
    }, true); // 'true' enables Capture Phase (vital for this to work with drag handlers)
    

    // --- GLOBAL AUDIO INFRASTRUCTURE (v84) ---
    window.ensureGlobalAudio = function(video) {
        // 1. Initialize Context
        if (!window.hzAudioCtx || window.hzAudioCtx.state === 'closed') {
            window.hzAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (window.hzAudioCtx.state === 'suspended') window.hzAudioCtx.resume();

        // 2. Initialize Stream (Once)
        if (!window.hzStream || window.hzStream.active === false) {
            window.hzStream = video.mozCaptureStream ? video.mozCaptureStream() : video.captureStream();
        }

        // 3. Initialize Hearing Path (Once - Prevents Deep Fry & Sound Loss)
        if (!window.hzHearSource) {
            window.hzHearSource = window.hzAudioCtx.createMediaStreamSource(window.hzStream);
            window.hzHearSource.connect(window.hzAudioCtx.destination);
            console.log('Hz Scanner: Global Hearing Path Established');
        }
        
        return window.hzAudioCtx;
    }
    

let isScanning = false;
    window.addEventListener('hz-audio-restabilized', () => {
        if (isScanning) {
            const v = document.querySelector('video');
            if(v) ensureAudioConnection(v);
        }
    });

let audioCtx, source, stream;
let analyserL, analyserR, splitter;
let scriptNode;
let uiUpdateInterval;
let animationFrameId;

// --- OPTIMIZED BUFFERS (PRE-ALLOCATED) ---
let scopeDataL = null;
let scopeDataR = null;

// --- DATA BUFFERS ---
let leftHz = 0;
let rightHz = 0;

// --- WINDOW STATE MEMORY ---
let modalPrefs = {
    x: null,
    y: null,
    w: 600,
    h: 580
};

// --- INTERACTION STATE ---
let interaction = {
    mode: null,
    el: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    aspectRatio: 1,
    fontRatio: 20
};

// --- 1. UI Setup (Control Panel) ---
function createControlPanel() { return; // Disabled 
/*
    if (document.getElementById('hz-control-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'hz-control-panel';

    Object.assign(panel.style, {
        position: 'fixed', top: '80px', right: '20px', zIndex: '99999',
        width: '230px', height: 'auto',
        backgroundColor: '#151515', borderRadius: '0.5em',
        border: '1px solid #333',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '11px',
        transform: 'translate3d(0px, 0px, 0px)',
        overflow: 'hidden'
    });

    const header = document.createElement('div');
    header.id = 'hz-panel-header';
    Object.assign(header.style, {
        padding: '0.6em 1em', background: '#222',
        borderBottom: '1px solid #333',
        borderRadius: '0.5em 0.5em 0 0', cursor: 'move',
        color: '#ccc', fontSize: '1.1em', fontWeight: 'bold', letterSpacing: '0.05em',
        display: 'flex', justifyContent: 'space-between', flexShrink: '0', userSelect: 'none'
    });
    header.innerHTML = `<span>HZ SCANNER (Binaural)</span><span style="color:#555">≡</span>`;

    const content = document.createElement('div');
    Object.assign(content.style, {
        padding: '0.8em', display: 'flex', flexDirection: 'column', gap: '0.5em',
        flexGrow: '1', overflow: 'hidden'
    });

    const row1 = document.createElement('div');
    row1.style.display = 'flex';
    row1.style.gap = '0.5em';

    const binauralBtn = document.createElement('button');
    binauralBtn.id = 'hz-binaural-btn';
    binauralBtn.innerText = '🧠 Start Binaural Scan';
    binauralBtn.title = "Start Analysis";
    styleButton(binauralBtn, '#222');
    binauralBtn.style.flex = "1";
    binauralBtn.onclick = () => toggleScan();

    const graphBtn = document.createElement('button');
    graphBtn.id = 'hz-graph-btn';
    graphBtn.innerText = '📊 Open Forensic Report';
    styleButton(graphBtn, '#444');
    graphBtn.style.display = 'block';
    graphBtn.style.width = '100%';
    graphBtn.onclick = () => openEvidenceModal();

    row1.appendChild(binauralBtn);
    content.appendChild(row1);
    content.appendChild(graphBtn);

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'hz-resize-handle';
    Object.assign(resizeHandle.style, {
        position: 'absolute', bottom: '0', right: '0',
        width: '1.5em', height: '1.5em', cursor: 'nwse-resize',
        background: 'transparent',
        zIndex: '100001'
    });

    panel.appendChild(header);
    panel.appendChild(content);
    panel.appendChild(resizeHandle);
    */
}

function styleButton(btn, bgColor) {
    Object.assign(btn.style, {
        padding: '0.6em 0.4em', backgroundColor: bgColor, color: '#fff',
        border: '1px solid #444', borderRadius: '0.3em', cursor: 'pointer',
        fontSize: '1em', fontWeight: 'bold', fontFamily: 'Segoe UI, sans-serif',
        boxShadow: '0 0.2em 0.4em rgba(0,0,0,0.2)', transition: 'background 0.3s',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        height: '2.8em'
    });
}

// --- 2. Audio Logic ---
async function toggleScan() {
    const binBtn = document.getElementById('hz-btn-binaural');

    // Always get the current fresh video element
    const video = document.querySelector('video');

    if (isScanning) {
            stopScan();
            closeModal(); // Ensure window closes on toggle
            return;
        }

    if (!video || video.paused) {
        const originalText = binBtn.innerText;
        binBtn.innerText = "PLAY VIDEO FIRST";
        setTimeout(() => { binBtn.innerText = originalText; }, 1500);
        return;
    }

    
    if (!document.getElementById('hz-binaural-modal')) { 
        openEvidenceModal(); 
    } else {
        renderModalContent(true);
    }
    
    startScan(video, binBtn);
}

function resetState() {
    leftHz = 0; rightHz = 0;
    // Clear data buffers
    scopeDataL = null;
    scopeDataR = null;

    const binBtn = document.getElementById('hz-btn-binaural');

    if(binBtn) {
        delete binBtn.dataset.l; delete binBtn.dataset.r; delete binBtn.dataset.beat;
        binBtn.innerText = 'BINAURAL'; binBtn.classList.remove('hz-btn-active'); binBtn.style.backgroundColor=''; binBtn.style.borderColor=''; 
    }
}


        
        function ensureAudioConnection(video) {
            try {
                if (typeof window.ensureGlobalAudio !== 'function') { console.error("Global Audio Missing"); return; }
                audioCtx = window.ensureGlobalAudio(video); if(!audioCtx) return;
                cleanupAudioNodes();

                source = audioCtx.createMediaStreamSource(window.hzStream);
                
                scriptNode = audioCtx.createScriptProcessor(2048, 1, 1);
                scriptNode.onaudioprocess = function(e) {
                    if (!isScanning) return;
                    performForensicDataScan();
                };
                
                splitter = audioCtx.createChannelSplitter(2);
                analyserL = audioCtx.createAnalyser();
                analyserR = audioCtx.createAnalyser();
                analyserL.fftSize = 16384;
                analyserR.fftSize = 16384;

                
                // [PATCH v85] Vitality: Force browser to process data via muted path
                const zGain = audioCtx.createGain();
                zGain.gain.value = 0.0001; // [PATCH v86] Anti-optimization

                source.connect(scriptNode);
                source.connect(splitter);
                splitter.connect(analyserL, 0);
                splitter.connect(analyserR, 1);
                
                // Force signal flow
                scriptNode.connect(zGain);
                analyserL.connect(zGain); 
                analyserR.connect(zGain);
                zGain.connect(audioCtx.destination);
    
                
            } catch (e) { console.error("Audio connection attempt failed", e); }
        }
        
        

// --- 3. MATH HELPERS ---

function getPitch(analyserNode, minHz) {
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    analyserNode.getFloatFrequencyData(dataArray);

    const sampleRate = audioCtx.sampleRate;
    const minBin = Math.floor(minHz * analyserNode.fftSize / sampleRate);
    const maxBin = Math.floor(2000 * analyserNode.fftSize / sampleRate);

    let bestBin = -1;
    let bestScore = -Infinity;

    for (let i = minBin; i < maxBin; i++) {
        if (dataArray[i] < -70) continue;

        let score = (dataArray[i] + 100);

        const h2 = i * 2;
        const h3 = i * 3;
        const h4 = i * 4;

        if (h2 < bufferLength && dataArray[h2] > -70) score += (dataArray[h2] + 100) * 0.5;
        if (h3 < bufferLength && dataArray[h3] > -70) score += (dataArray[h3] + 100) * 0.33;
        if (h4 < bufferLength && dataArray[h4] > -70) score += (dataArray[h4] + 100) * 0.25;

        if (score > bestScore) {
            bestScore = score;
            bestBin = i;
        }
    }

    if (bestBin > 0) {
        const rawVal = dataArray[bestBin];
        if (rawVal > -65) {
            let freq = bestBin * (sampleRate / analyserNode.fftSize);
            const prev = dataArray[bestBin - 1];
            const next = dataArray[bestBin + 1];

            if (prev && next) {
                const p = 0.5 * (prev - next) / (prev - 2 * rawVal + next);
                freq = (bestBin + p) * (sampleRate / analyserNode.fftSize);
            }
            return freq;
        }
    }
    return null;
}

function performForensicDataScan() {
    const l = getPitch(analyserL, 4);
    const r = getPitch(analyserR, 4);
    if (l) leftHz = l; if (r) rightHz = r;
}

// --- VISUAL LOOP ---
function startVisualLoop() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    function loop() {
        const modal = document.getElementById('hz-binaural-modal');
        if (!modal) return;

        if (isScanning) {
             const lissajousCanvas = modal.querySelector('#hz-lissajous-canvas');
             if(lissajousCanvas) drawLissajous(lissajousCanvas);
        }
        animationFrameId = requestAnimationFrame(loop);
    }
    loop();
}

function startScan(video, activeBtn) {
    resetState();
    isScanning = true;

    
    activeBtn.innerText = 'BINAURAL: ON';
    activeBtn.classList.add('hz-btn-active');

    try {
        ensureAudioConnection(video);
        uiUpdateInterval = setInterval(() => {
            updateBinauralUI(activeBtn);
        }, 1000);
        startVisualLoop();
    } catch (e) { console.error(e); stopScan(); }
}

function stopScan() {
    isScanning = false;
    clearInterval(uiUpdateInterval);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    cleanupAudioNodes();
    const binBtn = document.getElementById('hz-btn-binaural');
    if(binBtn) {  binBtn.innerText = 'BINAURAL'; binBtn.classList.remove('hz-btn-active'); binBtn.style.backgroundColor=''; binBtn.style.borderColor='';}
}

function updateBinauralUI(btn) {
        const modal = document.getElementById('hz-binaural-modal');
        const vid = document.querySelector('video');
        
        // 1. Safety Check
        if (vid && vid.paused) return;

        // 2. Data Check (Handle 0 values gracefully)
        const l = leftHz || 0;
        const r = rightHz || 0;
        
        // 3. Calculate Beat
        const beat = Math.abs(l - r);
        
        // 4. Update Button Text [PATCH v132]
        // Consistency: Static text only, match other modules
        btn.innerText = "BINAURAL: ON";

        // 5. Save Data for Modal
        btn.dataset.l = l.toFixed(1); 
        btn.dataset.r = r.toFixed(1); 
        btn.dataset.beat = beat.toFixed(2);

        // 6. Update Modal if open
        if (modal) {
            const lVal = modal.querySelector('.hz-bin-l'); 
            const rVal = modal.querySelector('.hz-bin-r'); 
            const beatVal = modal.querySelector('.hz-bin-beat');
            if (lVal) lVal.innerText = l.toFixed(1) + " Hz";
            if (rVal) rVal.innerText = r.toFixed(1) + " Hz";
            if (beatVal) beatVal.innerText = beat.toFixed(2) + " Hz";
        }
    }

// --- 4. Modal & Drag/Resize Logic ---
function openEvidenceModal() {
    if(document.getElementById('hz-binaural-modal')) { renderModalContent(true); return; }

    const modal = document.createElement('div');
    modal.id = 'hz-binaural-modal';

    let targetX, targetY;
    if (modalPrefs.x !== null && modalPrefs.y !== null) {
        targetX = modalPrefs.x; targetY = modalPrefs.y;
    } else {
        targetX = (window.innerWidth / 2) - 300; targetY = (window.innerHeight / 2) - 290;
    }

    Object.assign(modal.style, {
        position: 'fixed', top: targetY + 'px', left: targetX + 'px',
        width: modalPrefs.w + 'px', height: modalPrefs.h + 'px',
        fontSize: (modalPrefs.w / 50) + 'px',
        backgroundColor: '#151515', borderRadius: '4px',
        boxShadow: '0 15px 50px rgba(0,0,0,0.9)', zIndex: ++window.hzGlobalZ,
        color: '#eee', fontFamily: 'Segoe UI, sans-serif', border: '1px solid #333',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: 'translate3d(0,0,0)'
    });

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'hz-resize-handle';
    Object.assign(resizeHandle.style, {
        position: 'absolute', bottom: '0', right: '0',
        width: '2em', height: '2em', cursor: 'nwse-resize',
        background: 'transparent',
        zIndex: '100001'
    });
    modal.appendChild(resizeHandle);

    document.body.appendChild(modal);
    renderModalContent(true);

    if (isScanning) startVisualLoop();
}

function lockPositionToPixels(el) {
    const rect = el.getBoundingClientRect();
    el.style.left = rect.left + 'px'; el.style.top = rect.top + 'px';
    el.style.right = 'auto'; el.style.bottom = 'auto'; el.style.transform = 'translate3d(0,0,0)';
}

function handleMouseDown(e) {
    const resizeTarget = e.target.closest('.hz-resize-handle');
    const dragTarget = e.target.closest('#hz-binaural-header') ? document.getElementById('hz-binaural-modal') :
                       e.target.closest('#hz-panel-header') ? document.getElementById('hz-control-panel') : null;

    if (resizeTarget) {
        e.preventDefault();
        const targetEl = resizeTarget.closest('#hz-binaural-modal');
        if (!targetEl) return;
        lockPositionToPixels(targetEl);
        interaction.mode = 'resize'; interaction.el = targetEl;
        interaction.startX = e.clientX; interaction.startY = e.clientY;
        interaction.startWidth = targetEl.offsetWidth; interaction.startHeight = targetEl.offsetHeight;
        interaction.aspectRatio = interaction.startWidth / interaction.startHeight;
        interaction.fontRatio = (targetEl.id === 'hz-control-panel') ? 20 : 50;
        return;
    }
    if (dragTarget) {
        lockPositionToPixels(dragTarget);
        interaction.mode = 'drag'; interaction.el = dragTarget;
        interaction.startX = e.clientX; interaction.startY = e.clientY;
    }
}

function handleMouseMove(e) {
    if (!interaction.mode || !interaction.el) return;
    e.preventDefault();
    const dx = e.clientX - interaction.startX; const dy = e.clientY - interaction.startY;
    if (interaction.mode === 'resize') {
        let newWidth = Math.max(150, interaction.startWidth + dx);
        let newHeight = newWidth / interaction.aspectRatio;
        interaction.el.style.width = newWidth + 'px'; interaction.el.style.height = newHeight + 'px';
        interaction.el.style.fontSize = (newWidth / interaction.fontRatio) + 'px';
    } else if (interaction.mode === 'drag') {
        interaction.el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }
}

function handleMouseUp(e) {
    if (interaction.el) {
        if (interaction.mode === 'drag') {
            const rect = interaction.el.getBoundingClientRect();
            interaction.el.style.left = rect.left + 'px'; interaction.el.style.top = rect.top + 'px';
            interaction.el.style.transform = 'translate3d(0,0,0)';
        }
        if (interaction.el.id === 'hz-binaural-modal') {
             const rect = interaction.el.getBoundingClientRect();
             modalPrefs.x = rect.left; modalPrefs.y = rect.top; modalPrefs.w = rect.width; modalPrefs.h = rect.height;
        }
    }
    interaction.mode = null; interaction.el = null;
}

document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);

// --- Modal Content ---
function renderModalContent(forceRebuild) {
    const modal = document.getElementById('hz-binaural-modal');
    if(!modal) return;

    let resizeHandle = modal.querySelector('.hz-resize-handle');

    let header = `
        <div id="hz-binaural-header" style="
            padding: 8px 12px; background: #222; border-bottom: 1px solid #444;
            cursor: move; border-radius: 0; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; user-select:none;">
            <div><span style="font-weight: bold; color: #fff; font-size: 16px; letter-spacing: 0.5px;">Binaural</span><span style="font-family:'Consolas', monospace; font-size:12px; color:#555; margin-left:12px;">4Hz-2kHz | &gt;-70dB | 16k FFT | Sum(H1-H4) | Retrace Filter</span></div><button id="hz-binaural-close" class="hz-btn-close">✖</button>
        </div>
    `;

    let contentHTML = "";
    // BINAURAL CONTENT ONLY
    const btn = document.getElementById('hz-btn-binaural');
    const l = btn.dataset.l || "---"; const r = btn.dataset.r || "---"; const beat = btn.dataset.beat || "---";
    contentHTML = `
        <div style="flex: 1; display: flex; flex-direction: column; padding: 1.5em; overflow: hidden; min-height: 0;">

            <!-- Range Info Removed -->

            <div style="display:flex; justify-content:space-between; margin-bottom:1em; text-align:center; flex-shrink:0;">
                <div style="background:#222; padding:0.8em; border-radius:0.5em; width:30%;">
                    <span style="color:#aaa; font-size:1.3em;">Left</span><br>
                    <strong class="hz-bin-l" style="font-size:2.4em; color:#fff">${l}</strong>
                </div>
                <div style="background:#333; padding:0.8em; border-radius:0.5em; width:30%; border:1px solid #c0392b">
                    <span style="color:#aaa; font-size:1.3em;">Difference</span><br>
                    <strong class="hz-bin-beat" style="font-size:2.4em; color:#f1c40f">${beat}</strong>
                </div>
                <div style="background:#222; padding:0.8em; border-radius:0.5em; width:30%;">
                    <span style="color:#aaa; font-size:1.3em;">Right</span><br>
                    <strong class="hz-bin-r" style="font-size:2.4em; color:#fff">${r}</strong>
                </div>
            </div>

            <!-- External Label Removed -->

            <div style="background:#050505; border:1px solid #444; border-radius:0.5em; display: flex; flex-direction: column; flex: 1; overflow: hidden; position: relative;">
                    <canvas id="hz-lissajous-canvas" style="width: 100%; height: 100%; display: block;"></canvas>
            </div>
        </div>`;

    let footer = ""; // Residual line removed

    modal.innerHTML = header + contentHTML + footer;

    if(!resizeHandle) {
         resizeHandle = document.createElement('div');
         resizeHandle.className = 'hz-resize-handle';
         Object.assign(resizeHandle.style, {
            position: 'absolute', bottom: '0', right: '0',
            width: '2em', height: '2em', cursor: 'nwse-resize',
            background: 'transparent',
            zIndex: '100001'
        });
    }
    modal.appendChild(resizeHandle);
    document.getElementById('hz-binaural-close').onclick = () => { stopScan(); closeModal(); };
}

// --- OPTIMIZED DRAW LOOP ---
function checkResize(canvas) {
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width; canvas.height = rect.height;
    }
}

function drawLissajous(canvas) {
    if (!canvas || !analyserL || !analyserR) return;

    // --- CHECK ACTIVE VIDEO ---
    const vid = document.querySelector('video');
    if (vid && vid.paused) return;

    checkResize(canvas);
    const ctx = canvas.getContext('2d', { alpha: false });
    const w = canvas.width; const h = canvas.height;
    const cx = w / 2; const cy = h / 2;

    // FADE EFFECT
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, w, h);

    // BUFFERS
    const bufferLen = analyserL.frequencyBinCount;
    if (!scopeDataL || scopeDataL.length !== bufferLen) {
        scopeDataL = new Float32Array(bufferLen);
        scopeDataR = new Float32Array(bufferLen);
    }
    analyserL.getFloatTimeDomainData(scopeDataL);
    analyserR.getFloatTimeDomainData(scopeDataR);

    ctx.lineWidth = 1.0;
    ctx.strokeStyle = '#00ffcc';
    ctx.shadowBlur = 0;
    ctx.beginPath();

    const step = 1;
    const drawLimit = 3000; // Limits how much history we draw
    let startIdx = 0;
    if (bufferLen > drawLimit) startIdx = bufferLen - drawLimit;

    // SCALING
    const scale = (Math.min(w, h) / 2) * 0.9;
    const s = scale * 1.41421;

    // --- NEW: RETRACE REMOVAL VARIABLES ---
    let prevX = null;
    let prevY = null;
    // If the beam jumps more than 20% of the screen width in 1 sample, it's a glitch/retrace.
    // We use squared distance to avoid slow Math.sqrt calculations.
    const maxJumpSq = (w * 0.2) ** 2;

    for (let i = startIdx; i < bufferLen; i += step) {
        const L = scopeDataL[i];
        const R = scopeDataR[i];

        const x = cx + (L - R) * s;
        const y = cy - (L + R) * s;

        if (i === startIdx) {
            ctx.moveTo(x, y);
        } else {
            // Calculate distance squared from previous point
            const dx = x - prevX;
            const dy = y - prevY;
            const distSq = (dx * dx) + (dy * dy);

            // If the distance is HUGE, it's a retrace line. Don't draw it.
            if (distSq > maxJumpSq) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        prevX = x;
        prevY = y;
    }
    ctx.stroke();

    // UI OVERLAYS
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();

    // --- PATCH v145: CONFIGURABLE LABELS ---
    const labelSize = w / 33;
    const infoSize = labelSize * 0.75;
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(170, 170, 170, 0.8)";
    ctx.font = `${infoSize}px monospace`;
    ctx.fillText("Phase Scope | Vertical = Mono", 15, infoSize + 15);


    const fontSize = w / 45;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; ctx.font = `bold ${fontSize}px monospace`;
    ctx.textAlign = 'center'; ctx.fillText("+1", cx, fontSize + 5); ctx.fillText("-1", cx, h - 5);
}

function closeModal() {
    const m = document.getElementById('hz-binaural-modal');
    if (m) m.remove();
    if (interaction.el === m) { interaction.mode = null; interaction.el = null; }
}


        function cleanupAudioNodes() {
            if (source) { try { source.disconnect(); } catch(e) {} source = null; }
            if (splitter) { try { splitter.disconnect(); } catch(e) {} splitter = null; }
            if (scriptNode) { try { scriptNode.disconnect(); } catch(e) {} scriptNode = null; }
            scopeDataL = null; scopeDataR = null;
        }
        


    window.addEventListener('yt-navigate-finish', () => {
        // [PATCH v98] Format Switch Auto-Reload
        // If we switch from Shorts to Standard (or vice versa), force a reload to fix audio bugs.
        const currentMode = window.location.pathname.includes('/shorts/') ? 'shorts' : 'standard';
        
        if (window.hzSessionMode && window.hzSessionMode !== currentMode) {
            console.log('Hz Scanner: Format change detected (' + window.hzSessionMode + ' -> ' + currentMode + '). Reloading...');
            window.location.reload();
            return;
        }
        window.hzSessionMode = currentMode;
        // [PATCH v84] Full Reset
        if(window.hzHearSource) { try{window.hzHearSource.disconnect();}catch(e){} window.hzHearSource=null; }
        if(window.hzStream) { window.hzStream = null; }
        // [PATCH v100 AUDIO FIX] We do NOT close the context here. 
        // Closing it kills the hardware connection for the next video. 
        // Instead, we just let the graph disconnect (handled above) and suspend the context. 
        // [PATCH v102] Passive Navigation. 
        // We removed the premature audio hook logic here. 
        // Audio handover is now handled by the global 'play' listener.// window.hzAudioCtx = null; // KEEP ALIVE
        
        stopScan();
        interaction.mode = null; interaction.el = null; // Fix Ghost Drag
        if(document.getElementById('hz-binaural-modal')) document.getElementById('hz-binaural-modal').remove();
        
        // Sub-modules are handled by their own listeners, but we cleaned global refs above
    });
    

// [Disabled internal widget creation]


        
        // Expose the toggle function to the main script
        return {
            toggle: toggleScan, stop: stopScan
        };
    })();
    
})();