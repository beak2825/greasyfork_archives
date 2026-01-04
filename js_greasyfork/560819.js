// ==UserScript==
// @name         Voice to Piano for MPP
// @namespace    butter.lot
// @version      1.0.0
// @description  Play piano with your voice harmonics on Multiplayer Piano
// @author       MrButtersLot
// @license      Beerware
// @match        *://multiplayerpiano.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560819/Voice%20to%20Piano%20for%20MPP.user.js
// @updateURL https://update.greasyfork.org/scripts/560819/Voice%20to%20Piano%20for%20MPP.meta.js
// ==/UserScript==

// "THE BEER-WARE LICENSE" (Revision 42):
// As long as you retain this notice you can do whatever you want with this stuff.
// If we meet some day, and you think this stuff is worth it, you can buy me a beer in return.

(function() {
  'use strict';

  // ============= AUDIO ANALYSIS =============

  const PIANO_MIN_MIDI = 21; // A0
  const PIANO_MAX_MIDI = 108; // C8

  function frequencyToMidi(frequency) {
    return Math.round(12 * Math.log2(frequency / 440) + 69);
  }

  function midiToNoteName(midi) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;
    const note = notes[midi % 12];
    return `${note}${octave}`;
  }

  function detectHarmonics(frequencyData, sampleRate, fftSize, threshold = 50) {
    const harmonics = [];
    const binWidth = sampleRate / fftSize;

    // Find the overall volume to normalize
    let maxMagnitude = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      if (frequencyData[i] > maxMagnitude) maxMagnitude = frequencyData[i];
    }

    // Only process if there's actual audio input
    if (maxMagnitude < threshold) return [];

    // Focus on speech-relevant frequencies and filter noise
    for (let i = 2; i < frequencyData.length / 2; i++) {
      const magnitude = frequencyData[i];

      // Use dynamic threshold - only pick strong peaks
      const dynamicThreshold = Math.max(threshold, maxMagnitude * 0.3);

      if (magnitude > dynamicThreshold) {
        const frequency = i * binWidth;

        // Focus on speech formant range (100Hz to 3500Hz)
        if (frequency >= 100 && frequency <= 3500) {
          const midi = frequencyToMidi(frequency);

          if (midi >= PIANO_MIN_MIDI && midi <= PIANO_MAX_MIDI) {
            harmonics.push({
              frequency,
              magnitude,
              midi,
              noteName: midiToNoteName(midi)
            });
          }
        }
      }
    }

    return harmonics.sort((a, b) => b.magnitude - a.magnitude);
  }

  function analyzeAudio(analyser, maxHarmonics = 8, sensitivity = 20) {
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);

    // Calculate overall audio level
    let sum = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      sum += frequencyData[i];
    }
    const avgLevel = sum / frequencyData.length;

    const harmonics = detectHarmonics(
      frequencyData,
      analyser.context.sampleRate,
      analyser.fftSize,
      sensitivity
    );

    return {
      harmonics: harmonics.slice(0, maxHarmonics),
      audioLevel: avgLevel
    };
  }

  // ============= VOICE TO PIANO ENGINE =============

  class VoiceToPiano {
    constructor() {
      this.isListening = false;
      this.audioContext = null;
      this.analyser = null;
      this.mediaStream = null;
      this.animationFrame = null;
      this.activeNotes = new Map(); // midi -> { key, velocity }
      this.sensitivity = 50; // Higher threshold for clarity
      this.maxHarmonics = 108;
      this.onHarmonicsUpdate = null;
      this.onAudioLevelUpdate = null;
    }

    async start() {
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true, // Enable to reduce feedback
            noiseSuppression: true, // Enable to clean up input
            autoGainControl: true,  // Enable to normalize volume
            sampleRate: 48000       // Higher sample rate for better quality
          }
        });

        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();

        // Settings optimized for speech clarity
        this.analyser.fftSize = 8192;
        this.analyser.smoothingTimeConstant = 0.7; // More smoothing for stability
        this.analyser.minDecibels = -70;
        this.analyser.maxDecibels = -20;

        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        source.connect(this.analyser);

        this.isListening = true;
        this.startAnalysis();
        return true;
      } catch (error) {
        console.error('Error accessing microphone:', error);
        return false;
      }
    }

    stop() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }

      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
      }

      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }

      // Release all active notes
      this.activeNotes.forEach(({ key }) => {
        if (window.MPP && window.MPP.release) {
          MPP.release(key);
        }
      });
      this.activeNotes.clear();

      this.analyser = null;
      this.isListening = false;
    }

    startAnalysis() {
      const analyze = () => {
        if (!this.analyser || !this.isListening) return;

        const result = analyzeAudio(this.analyser, this.maxHarmonics, this.sensitivity);
        const filteredHarmonics = result.harmonics;

        // Update audio level indicator
        if (this.onAudioLevelUpdate) {
          this.onAudioLevelUpdate(result.audioLevel);
        }

        if (this.onHarmonicsUpdate) {
          this.onHarmonicsUpdate(filteredHarmonics, this.activeNotes.size);
        }

        // Build set of notes that should be active
        const newActiveNotes = new Map();

        filteredHarmonics.forEach(harmonic => {
          const key = Object.keys(MPP.piano.keys)[harmonic.midi - 21];
          if (key) {
            let volume = harmonic.magnitude / 255;
            volume = Math.min(Math.max(volume, 0.1), 1);
            newActiveNotes.set(harmonic.midi, { key, volume });
          }
        });

        // Release notes that are no longer detected
        this.activeNotes.forEach(({ key }, midi) => {
          if (!newActiveNotes.has(midi)) {
            if (window.MPP && window.MPP.release) {
              MPP.release(key);
            }
          }
        });

        // Press all detected notes (including repeats)
        newActiveNotes.forEach(({ key, volume }, midi) => {
          if (window.MPP && window.MPP.press) {
            MPP.press(key, volume);
          }
        });

        // Update active notes state
        this.activeNotes = newActiveNotes;
        this.animationFrame = requestAnimationFrame(analyze);
      };

      analyze();
    }
  }

  // ============= UI STYLES =============

  const styles = `
    .voice-piano-window {
      position: fixed;
      top: 80px;
      left: 20px;
      width: 380px;
      background: #2d2d2d;
      border: 2px solid #8b5cf6;
      border-radius: 8px;
      box-shadow: 0 5px 20px rgba(139, 92, 246, 0.3);
      color: #eee;
      font-family: sans-serif;
      font-size: 14px;
      z-index: 850;
      display: none;
    }
    .voice-piano-window.visible {
      display: block;
    }
    .voice-piano-header {
      padding: 10px 12px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      cursor: move;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      border-bottom: 1px solid #7c3aed;
      user-select: none;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .voice-piano-header svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }
    .voice-piano-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .voice-piano-controls {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
    }
    .voice-piano-btn {
      background: #8b5cf6;
      border: 1px solid #7c3aed;
      color: #fff;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      flex: 1;
      justify-content: center;
    }
    .voice-piano-btn:hover {
      background: #7c3aed;
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
    }
    .voice-piano-btn.listening {
      background: #dc2626;
      border-color: #b91c1c;
    }
    .voice-piano-btn.listening:hover {
      background: #b91c1c;
    }
    .voice-piano-btn svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
    .voice-piano-slider-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .voice-piano-slider-label {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #ccc;
    }
    .voice-piano-slider {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #444;
      outline: none;
      -webkit-appearance: none;
    }
    .voice-piano-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #8b5cf6;
      cursor: pointer;
      transition: all 0.2s;
    }
    .voice-piano-slider::-webkit-slider-thumb:hover {
      background: #7c3aed;
      box-shadow: 0 0 8px rgba(139, 92, 246, 0.6);
    }
    .voice-piano-slider::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #8b5cf6;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .voice-piano-harmonics {
      max-height: 240px;
      overflow-y: auto;
      background: #222;
      border: 1px solid #444;
      border-radius: 6px;
      padding: 8px;
    }
    .voice-piano-harmonics::-webkit-scrollbar {
      width: 8px;
    }
    .voice-piano-harmonics::-webkit-scrollbar-track {
      background: #333;
      border-radius: 4px;
    }
    .voice-piano-harmonics::-webkit-scrollbar-thumb {
      background: #8b5cf6;
      border-radius: 4px;
    }
    .voice-piano-harmonic {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      margin-bottom: 6px;
      background: #2d2d2d;
      border: 1px solid #444;
      border-radius: 4px;
      font-size: 12px;
    }
    .voice-piano-harmonic-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .voice-piano-pulse {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #8b5cf6;
      animation: pulse 1s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }
    .voice-piano-note {
      font-family: monospace;
      font-weight: 600;
      color: #8b5cf6;
      min-width: 40px;
    }
    .voice-piano-freq {
      color: #999;
      font-size: 11px;
    }
    .voice-piano-magnitude {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .voice-piano-bar {
      width: 60px;
      height: 4px;
      background: #444;
      border-radius: 2px;
      overflow: hidden;
    }
    .voice-piano-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #8b5cf6, #6d28d9);
      transition: width 0.1s;
    }
    .voice-piano-status {
      text-align: center;
      padding: 12px;
      background: #222;
      border: 1px solid #444;
      border-radius: 6px;
      color: #999;
      font-style: italic;
      font-size: 13px;
    }
    .voice-piano-level {
      margin-top: 8px;
      height: 8px;
      background: #333;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }
    .voice-piano-level-bar {
      height: 100%;
      background: linear-gradient(90deg, #22c55e, #16a34a);
      transition: width 0.1s;
      box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
    }
    .voice-piano-info {
      background: #1a1a1a;
      border: 1px solid #444;
      border-radius: 6px;
      padding: 12px;
      font-size: 12px;
      color: #999;
      line-height: 1.6;
    }
    .voice-piano-info strong {
      color: #8b5cf6;
    }
  `;

  // ============= UI CREATION =============

  const ICON_MIC = `<svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`;
  const ICON_MIC_OFF = `<svg viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`;

  const playerHTML = `
    <div id="voice-piano-window" class="voice-piano-window">
      <div class="voice-piano-header">
        ${ICON_MIC}
        <span>Voice to Piano</span>
      </div>
      <div class="voice-piano-content">
        <div class="voice-piano-controls">
          <button id="voice-piano-toggle-btn" class="voice-piano-btn">
            ${ICON_MIC}
            <span>Start Listening</span>
          </button>
        </div>

        <div class="voice-piano-slider-group">
          <div class="voice-piano-slider-label">
            <span>Sensitivity</span>
            <span id="voice-piano-sensitivity-value">50</span>
          </div>
          <input type="range" id="voice-piano-sensitivity" class="voice-piano-slider" min="20" max="100" value="50">
        </div>

        <div class="voice-piano-slider-group">
          <div class="voice-piano-slider-label">
            <span>Max Notes</span>
            <span id="voice-piano-max-harmonics-value">108</span>
          </div>
          <input type="range" id="voice-piano-max-harmonics" class="voice-piano-slider" min="2" max="108" value="108">
        </div>

        <div id="voice-piano-status" class="voice-piano-status">
          Click "Start Listening" to begin
          <div class="voice-piano-level">
            <div id="voice-piano-level-bar" class="voice-piano-level-bar" style="width: 0%"></div>
          </div>
        </div>

        <div id="voice-piano-harmonics" class="voice-piano-harmonics" style="display: none;">
        </div>

        <div class="voice-piano-info">
          <strong>How it works:</strong> Your voice contains multiple frequencies. This system analyzes them in real-time and plays the corresponding piano keys.
        </div>
      </div>
    </div>
  `;

  const toggleButtonHTML = `<div class="ugly-button" id="voice-piano-menu-btn">Voice to Piano</div>`;

  // ============= INITIALIZATION =============

  document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
  document.body.insertAdjacentHTML('beforeend', playerHTML);

  const buttonsContainer = document.querySelector('#buttons');
  if (buttonsContainer) {
    buttonsContainer.insertAdjacentHTML('beforeend', toggleButtonHTML);
  } else {
    document.body.insertAdjacentHTML('beforeend', toggleButtonHTML);
  }

  // ============= UI ELEMENTS =============

  const ui = {
    window: document.getElementById('voice-piano-window'),
    header: document.querySelector('.voice-piano-header'),
    toggleBtn: document.getElementById('voice-piano-toggle-btn'),
    menuBtn: document.getElementById('voice-piano-menu-btn'),
    sensitivitySlider: document.getElementById('voice-piano-sensitivity'),
    sensitivityValue: document.getElementById('voice-piano-sensitivity-value'),
    maxHarmonicsSlider: document.getElementById('voice-piano-max-harmonics'),
    maxHarmonicsValue: document.getElementById('voice-piano-max-harmonics-value'),
    status: document.getElementById('voice-piano-status'),
    harmonicsContainer: document.getElementById('voice-piano-harmonics'),
    levelBar: document.getElementById('voice-piano-level-bar')
  };

  const engine = new VoiceToPiano();

  // ============= EVENT HANDLERS =============

  engine.onHarmonicsUpdate = (harmonics, activeCount) => {
    // Update status with active note count
    const statusText = activeCount > 0
      ? `Listening... Playing ${activeCount} note${activeCount !== 1 ? 's' : ''}`
      : 'Listening... Speak or sing to play piano';

    ui.status.childNodes[0].textContent = statusText;

    if (harmonics.length === 0) {
      ui.harmonicsContainer.innerHTML = '<div class="voice-piano-status">Listening for audio... Try speaking louder or adjusting sensitivity.</div>';
    } else {
      ui.harmonicsContainer.innerHTML = harmonics.map(h => `
        <div class="voice-piano-harmonic">
          <div class="voice-piano-harmonic-left">
            <div class="voice-piano-pulse"></div>
            <span class="voice-piano-note">${h.noteName}</span>
            <span class="voice-piano-freq">${h.frequency.toFixed(1)} Hz</span>
          </div>
          <div class="voice-piano-magnitude">
            <div class="voice-piano-bar">
              <div class="voice-piano-bar-fill" style="width: ${(h.magnitude / 255 * 100)}%"></div>
            </div>
            <span>${Math.round(h.magnitude / 255 * 100)}%</span>
          </div>
        </div>
      `).join('');
    }
  };

  engine.onAudioLevelUpdate = (level) => {
    // Update the audio level bar
    const percentage = Math.min(100, (level / 128) * 100);
    ui.levelBar.style.width = `${percentage}%`;
  };

  ui.toggleBtn.addEventListener('click', async () => {
    if (!engine.isListening) {
      const success = await engine.start();
      if (success) {
        ui.toggleBtn.classList.add('listening');
        ui.toggleBtn.innerHTML = `${ICON_MIC_OFF}<span>Stop Listening</span>`;
        ui.status.innerHTML = 'Listening... Speak or sing to play piano<div class="voice-piano-level"><div id="voice-piano-level-bar" class="voice-piano-level-bar" style="width: 0%"></div></div>';
        ui.levelBar = document.getElementById('voice-piano-level-bar');
        ui.harmonicsContainer.style.display = 'block';
        console.log('[Voice to Piano] Microphone started, analyzing audio...');
      } else {
        ui.status.textContent = 'Error: Could not access microphone. Check browser permissions.';
      }
    } else {
      engine.stop();
      ui.toggleBtn.classList.remove('listening');
      ui.toggleBtn.innerHTML = `${ICON_MIC}<span>Start Listening</span>`;
      ui.status.textContent = 'Stopped';
      ui.harmonicsContainer.style.display = 'none';
      ui.harmonicsContainer.innerHTML = '';
      ui.levelBar.style.width = '0%';
    }
  });

  ui.sensitivitySlider.addEventListener('input', (e) => {
    const value = e.target.value;
    ui.sensitivityValue.textContent = value;
    engine.sensitivity = parseInt(value);
  });

  ui.maxHarmonicsSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    ui.maxHarmonicsValue.textContent = value;
    engine.maxHarmonics = parseInt(value);
  });

  ui.menuBtn.addEventListener('click', () => {
    ui.window.classList.toggle('visible');
  });

  // ============= DRAGGABLE WINDOW =============

  let isDragging = false;
  let offsetX, offsetY;

  ui.header.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = ui.window.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      ui.window.style.left = `${e.clientX - offsetX}px`;
      ui.window.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  console.log('[Voice to Piano] Loaded successfully! Click the "Voice to Piano" button to open.');
})();
