// ==UserScript==
// @name         MP3 to Piano for MPP with YouTube Converter (Stable Notes)
// @namespace    butter.lot
// @version      2.1.1
// @description  Play piano with MP3 file harmonics on Multiplayer Piano + YouTube converter + Multi-file playlist + Loop + Stability-based note prioritization
// @author       MrButtersLot
// @license      Beerware
// @match        *://multiplayerpiano.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556338/MP3%20to%20Piano%20for%20MPP%20with%20YouTube%20Converter%20%28Stable%20Notes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556338/MP3%20to%20Piano%20for%20MPP%20with%20YouTube%20Converter%20%28Stable%20Notes%29.meta.js
// ==/UserScript==

// "THE BEER-WARE LICENSE" (Revision 42):
// As long as you retain this notice you can do whatever you want with this stuff.
// If we meet some day, and you think this stuff is worth it, you can buy me a beer in return.

(function() {
  'use strict';

  // ============= AUDIO ANALYSIS =============

  const PIANO_MIN_MIDI = 21; // A0
  const PIANO_MAX_MIDI = 108; // C8

  // ============= STABILITY TRACKING =============
  // Tracks note magnitude history to prioritize stable notes over flickering ones

  class NoteStabilityTracker {
    constructor(windowSize = 8, stabilityWeight = 0.6) {
      this.windowSize = windowSize; // How many frames to track
      this.stabilityWeight = stabilityWeight; // 0-1, higher = prefer stable notes more
      this.noteHistory = new Map(); // midi -> array of recent magnitudes
      this.decayRate = 0.85; // How fast old notes fade from tracking
    }

    updateNote(midi, magnitude) {
      if (!this.noteHistory.has(midi)) {
        this.noteHistory.set(midi, []);
      }

      const history = this.noteHistory.get(midi);
      history.push(magnitude);

      // Keep only the last windowSize entries
      if (history.length > this.windowSize) {
        history.shift();
      }
    }

    // Decay notes that weren't detected this frame
    decayMissingNotes(detectedMidis) {
      const detectedSet = new Set(detectedMidis);

      for (const [midi, history] of this.noteHistory.entries()) {
        if (!detectedSet.has(midi)) {
          // Add a zero magnitude to show the note disappeared
          history.push(0);
          if (history.length > this.windowSize) {
            history.shift();
          }

          // Remove if all zeros (note completely gone)
          if (history.every(m => m === 0)) {
            this.noteHistory.delete(midi);
          }
        }
      }
    }

    calculateStability(midi) {
      const history = this.noteHistory.get(midi);
      if (!history || history.length < 2) return 0;

      // Calculate variance - lower variance = more stable
      const avg = history.reduce((a, b) => a + b, 0) / history.length;
      const variance = history.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / history.length;

      // Also check for consistency (how many frames the note has been present)
      const presenceCount = history.filter(m => m > 0).length;
      const presenceRatio = presenceCount / history.length;

      // Normalize variance to 0-1 range (lower variance = higher stability)
      // Max reasonable variance for 0-255 range magnitudes
      const maxVariance = 10000;
      const normalizedVariance = Math.min(variance / maxVariance, 1);
      const stabilityFromVariance = 1 - normalizedVariance;

      // Combine variance stability with presence consistency
      return (stabilityFromVariance * 0.6) + (presenceRatio * 0.4);
    }

    calculatePriorityScore(midi, magnitude) {
      const stability = this.calculateStability(midi);
      const normalizedMagnitude = magnitude / 255;

      // Weighted combination: magnitude still matters, but stability boosts consistent notes
      const magnitudeWeight = 1 - this.stabilityWeight;
      const score = (normalizedMagnitude * magnitudeWeight) + (stability * this.stabilityWeight * normalizedMagnitude);

      return {
        score,
        stability,
        magnitude: normalizedMagnitude
      };
    }

    setStabilityWeight(weight) {
      this.stabilityWeight = Math.max(0, Math.min(1, weight));
    }

    setWindowSize(size) {
      this.windowSize = Math.max(2, Math.min(16, size));
    }

    clear() {
      this.noteHistory.clear();
    }
  }

  // Global stability tracker instance
  const stabilityTracker = new NoteStabilityTracker(8, 0.6);

  function frequencyToMidi(frequency) {
    return Math.round(12 * Math.log2(frequency / 440) + 69);
  }

  function midiToNoteName(midi) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;
    const note = notes[midi % 12];
    return `${note}${octave}`;
  }

  function detectHarmonics(frequencyData, sampleRate, fftSize, threshold = 30) {
    const harmonics = [];
    const binWidth = sampleRate / fftSize;

    let maxMagnitude = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      if (frequencyData[i] > maxMagnitude) maxMagnitude = frequencyData[i];
    }

    if (maxMagnitude < threshold) return [];

    for (let i = 2; i < frequencyData.length / 2; i++) {
      const magnitude = frequencyData[i];
      const dynamicThreshold = Math.max(threshold, maxMagnitude * 0.25);

      if (magnitude > dynamicThreshold) {
        const frequency = i * binWidth;

        if (frequency >= 50 && frequency <= 4000) {
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

    return harmonics;
  }

  function analyzeAudio(analyser, maxHarmonics = 8, sensitivity = 30) {
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);

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

    // ============= STABILITY-BASED PRIORITIZATION =============

    // Update stability tracker with all detected notes
    const detectedMidis = harmonics.map(h => h.midi);
    harmonics.forEach(h => {
      stabilityTracker.updateNote(h.midi, h.magnitude);
    });
    stabilityTracker.decayMissingNotes(detectedMidis);

    // Calculate priority scores combining magnitude and stability
    const scoredHarmonics = harmonics.map(h => {
      const { score, stability } = stabilityTracker.calculatePriorityScore(h.midi, h.magnitude);
      return {
        ...h,
        priorityScore: score,
        stability: stability
      };
    });

    // Sort by priority score (stability-weighted) instead of raw magnitude
    scoredHarmonics.sort((a, b) => b.priorityScore - a.priorityScore);

    // Deduplicate by MIDI note (keep highest priority for each note)
    const seenMidis = new Set();
    const uniqueHarmonics = scoredHarmonics.filter(h => {
      if (seenMidis.has(h.midi)) return false;
      seenMidis.add(h.midi);
      return true;
    });

    return {
      harmonics: uniqueHarmonics.slice(0, maxHarmonics),
      audioLevel: avgLevel
    };
  }

  // ============= MP3 TO PIANO ENGINE =============

  class MP3ToPiano {
    constructor() {
      this.isPlaying = false;
      this.audioContext = null;
      this.analyser = null;
      this.audioSource = null;
      this.audioBuffer = null;
      this.animationFrame = null;
      this.activeNotes = new Map();
      this.sensitivity = 30;
      this.maxHarmonics = 12;
      this.stabilityWeight = 0.6;
      this.stabilityWindow = 8;
      this.onHarmonicsUpdate = null;
      this.onAudioLevelUpdate = null;
      this.onPlaybackUpdate = null;
      this.onSongEnd = null;
      this.startTime = 0;
      this.pauseTime = 0;
      this.shouldAutoPlay = false;
    }

    async loadMP3(file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        this.audioContext = new AudioContext();
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        stabilityTracker.clear(); // Clear history when loading new song
        return true;
      } catch (error) {
        console.error('Error loading MP3:', error);
        return false;
      }
    }

    async loadMP3FromArrayBuffer(arrayBuffer) {
      try {
        this.audioContext = new AudioContext();
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        stabilityTracker.clear();
        return true;
      } catch (error) {
        console.error('Error loading MP3:', error);
        return false;
      }
    }

    start() {
      if (!this.audioBuffer || !this.audioContext) return false;

      try {
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 8192;
        this.analyser.smoothingTimeConstant = 0.6;
        this.analyser.minDecibels = -80;
        this.analyser.maxDecibels = -10;

        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = this.audioBuffer;
        this.audioSource.connect(this.analyser);
        // Don't connect to destination - we only want piano output, not original audio

        this.audioSource.onended = () => {
          this.shouldAutoPlay = this.isPlaying;
          this.stop();
          if (this.onSongEnd) {
            this.onSongEnd();
          }
        };

        const offset = this.pauseTime || 0;
        this.audioSource.start(0, offset);
        this.startTime = this.audioContext.currentTime - offset;
        this.isPlaying = true;
        this.startAnalysis();
        return true;
      } catch (error) {
        console.error('Error starting playback:', error);
        return false;
      }
    }

    pause() {
      if (!this.isPlaying) return;

      this.pauseTime = this.audioContext.currentTime - this.startTime;
      this.shouldAutoPlay = false;
      this.stop();
    }

    seek(timeInSeconds) {
      const wasPlaying = this.isPlaying;

      if (this.isPlaying) {
        this.shouldAutoPlay = false;
        this.stop();
      }

      this.pauseTime = Math.max(0, Math.min(timeInSeconds, this.getDuration()));

      if (wasPlaying) {
        this.start();
      }
    }

    stop() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }

      if (this.audioSource) {
        try {
          this.audioSource.onended = null;
          this.audioSource.stop();
        } catch (e) {
          // Already stopped or not started
        }
        this.audioSource.disconnect();
        this.audioSource = null;
      }

      this.activeNotes.forEach(({ key }) => {
        if (window.MPP && window.MPP.release) {
          MPP.release(key);
        }
      });
      this.activeNotes.clear();

      this.isPlaying = false;
    }

    reset() {
      this.shouldAutoPlay = false;
      this.stop();
      this.pauseTime = 0;
      this.startTime = 0;
      stabilityTracker.clear();
    }

    getCurrentTime() {
      if (!this.audioContext) return 0;
      if (this.isPlaying) {
        return this.audioContext.currentTime - this.startTime;
      }
      return this.pauseTime;
    }

    getDuration() {
      return this.audioBuffer ? this.audioBuffer.duration : 0;
    }

    setStabilityWeight(weight) {
      this.stabilityWeight = weight;
      stabilityTracker.setStabilityWeight(weight);
    }

    setStabilityWindow(size) {
      this.stabilityWindow = size;
      stabilityTracker.setWindowSize(size);
    }

    startAnalysis() {
      const analyze = () => {
        if (!this.analyser || !this.isPlaying) return;

        const result = analyzeAudio(this.analyser, this.maxHarmonics, this.sensitivity);
        const filteredHarmonics = result.harmonics;

        if (this.onAudioLevelUpdate) {
          this.onAudioLevelUpdate(result.audioLevel);
        }

        if (this.onHarmonicsUpdate) {
          this.onHarmonicsUpdate(filteredHarmonics, this.activeNotes.size);
        }

        if (this.onPlaybackUpdate) {
          const currentTime = this.getCurrentTime();
          const duration = this.getDuration();
          this.onPlaybackUpdate('playing', currentTime, duration);
        }

        const newActiveNotes = new Map();

        filteredHarmonics.forEach(harmonic => {
          const key = Object.keys(MPP.piano.keys)[harmonic.midi - 21];
          if (key) {
            let volume = harmonic.magnitude / 255;
            volume = Math.min(Math.max(volume, 0.1), 1);
            newActiveNotes.set(harmonic.midi, { key, volume });
          }
        });

        this.activeNotes.forEach(({ key }, midi) => {
          if (!newActiveNotes.has(midi)) {
            if (window.MPP && window.MPP.release) {
              MPP.release(key);
            }
          }
        });

        newActiveNotes.forEach(({ key, volume }, midi) => {
          if (window.MPP && window.MPP.press) {
            MPP.press(key, volume);
          }
        });

        this.activeNotes = newActiveNotes;
        this.animationFrame = requestAnimationFrame(analyze);
      };

      analyze();
    }
  }

  // ============= PLAYLIST MANAGER =============

  class PlaylistManager {
    constructor() {
      this.playlist = [];
      this.currentIndex = 0;
      this.loopEnabled = false;
      this.onPlaylistChange = null;
      this.onCurrentChange = null;
    }

    addFiles(files) {
      for (const file of files) {
        this.playlist.push({
          file: file,
          name: file.name,
          buffer: null
        });
      }
      if (this.onPlaylistChange) {
        this.onPlaylistChange(this.playlist);
      }
    }

    clear() {
      this.playlist = [];
      this.currentIndex = 0;
      if (this.onPlaylistChange) {
        this.onPlaylistChange(this.playlist);
      }
    }

    remove(index) {
      if (index >= 0 && index < this.playlist.length) {
        this.playlist.splice(index, 1);
        if (this.currentIndex >= this.playlist.length && this.playlist.length > 0) {
          this.currentIndex = this.playlist.length - 1;
        }
        if (this.onPlaylistChange) {
          this.onPlaylistChange(this.playlist);
        }
      }
    }

    getCurrent() {
      return this.playlist[this.currentIndex];
    }

    next() {
      if (this.playlist.length === 0) return null;

      if (this.currentIndex < this.playlist.length - 1) {
        this.currentIndex++;
      } else if (this.loopEnabled) {
        this.currentIndex = 0;
      } else {
        return null; // End of playlist, no loop
      }

      if (this.onCurrentChange) {
        this.onCurrentChange(this.currentIndex);
      }
      return this.getCurrent();
    }

    previous() {
      if (this.playlist.length === 0) return null;

      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else if (this.loopEnabled) {
        this.currentIndex = this.playlist.length - 1;
      } else {
        this.currentIndex = 0;
      }

      if (this.onCurrentChange) {
        this.onCurrentChange(this.currentIndex);
      }
      return this.getCurrent();
    }

    setIndex(index) {
      if (index >= 0 && index < this.playlist.length) {
        this.currentIndex = index;
        if (this.onCurrentChange) {
          this.onCurrentChange(this.currentIndex);
        }
        return this.getCurrent();
      }
      return null;
    }

    toggleLoop() {
      this.loopEnabled = !this.loopEnabled;
      return this.loopEnabled;
    }

    isEmpty() {
      return this.playlist.length === 0;
    }

    size() {
      return this.playlist.length;
    }
  }

  // ============= UI STYLES =============

  const styles = `
    .voice-piano-window {
      position: fixed;
      top: 80px;
      left: 20px;
      width: 420px;
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
    .voice-piano-file-input {
      display: none;
    }
    .voice-piano-file-label {
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
      justify-content: center;
      text-align: center;
    }
    .voice-piano-file-label:hover {
      background: #7c3aed;
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
    }
    .voice-piano-file-label svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
    .voice-piano-playlist {
      max-height: 200px;
      overflow-y: auto;
      background: #222;
      border: 1px solid #444;
      border-radius: 6px;
      padding: 8px;
    }
    .voice-piano-playlist::-webkit-scrollbar {
      width: 8px;
    }
    .voice-piano-playlist::-webkit-scrollbar-track {
      background: #333;
      border-radius: 4px;
    }
    .voice-piano-playlist::-webkit-scrollbar-thumb {
      background: #8b5cf6;
      border-radius: 4px;
    }
    .voice-piano-playlist-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      margin-bottom: 4px;
      background: #2d2d2d;
      border: 1px solid #444;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .voice-piano-playlist-item:hover {
      background: #3d3d3d;
      border-color: #8b5cf6;
    }
    .voice-piano-playlist-item.active {
      background: #8b5cf6;
      border-color: #7c3aed;
      color: #fff;
    }
    .voice-piano-playlist-item-name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 8px;
    }
    .voice-piano-playlist-remove {
      background: #dc2626;
      border: none;
      color: #fff;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
      transition: all 0.2s;
    }
    .voice-piano-playlist-remove:hover {
      background: #b91c1c;
    }
    .voice-piano-playlist-empty {
      text-align: center;
      padding: 20px;
      color: #999;
      font-style: italic;
      font-size: 12px;
    }
    .voice-piano-playlist-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding: 0 4px;
    }
    .voice-piano-playlist-title {
      font-weight: 600;
      font-size: 13px;
      color: #8b5cf6;
    }
    .voice-piano-playlist-clear {
      background: #dc2626;
      border: none;
      color: #fff;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 600;
      transition: all 0.2s;
    }
    .voice-piano-playlist-clear:hover {
      background: #b91c1c;
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
    .voice-piano-btn:disabled {
      background: #555;
      border-color: #444;
      cursor: not-allowed;
      opacity: 0.5;
    }
    .voice-piano-btn.playing {
      background: #dc2626;
      border-color: #b91c1c;
    }
    .voice-piano-btn.playing:hover:not(:disabled) {
      background: #b91c1c;
    }
    .voice-piano-btn.small {
      padding: 8px 12px;
      flex: 0;
    }
    .voice-piano-btn svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
    .voice-piano-loop-btn {
      background: #444;
      border-color: #555;
    }
    .voice-piano-loop-btn.active {
      background: #22c55e;
      border-color: #16a34a;
    }
    .voice-piano-loop-btn.active:hover {
      background: #16a34a;
    }
    .voice-piano-playback {
      background: #222;
      border: 1px solid #444;
      border-radius: 6px;
      padding: 12px;
    }
    .voice-piano-time {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #999;
      margin-bottom: 8px;
    }
    .voice-piano-progress {
      height: 8px;
      background: #333;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      transition: height 0.2s;
    }
    .voice-piano-progress:hover {
      height: 10px;
    }
    .voice-piano-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #8b5cf6, #6d28d9);
      transition: width 0.1s;
      pointer-events: none;
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
    .voice-piano-pulse.stable {
      background: #22c55e;
      animation: none;
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
    .voice-piano-note.stable {
      color: #22c55e;
    }
    .voice-piano-freq {
      color: #999;
      font-size: 11px;
    }
    .voice-piano-stability {
      color: #22c55e;
      font-size: 10px;
      margin-left: 4px;
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
    .voice-piano-bar-fill.stable {
      background: linear-gradient(90deg, #22c55e, #16a34a);
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
    .voice-piano-stability-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      color: #22c55e;
    }

    /* YouTube Converter Button Styles */
    .yt-converter-btn {
      background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
      border: 2px solid #ff0000;
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(255, 0, 0, 0.4);
    }
    .yt-converter-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 0, 0, 0.6);
      background: linear-gradient(135deg, #cc0000 0%, #990000 100%);
    }
    .yt-converter-btn svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
  `;

  // ============= UI CREATION =============

  const ICON_MUSIC = `<svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;
  const ICON_UPLOAD = `<svg viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>`;
  const ICON_PLAY = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
  const ICON_PAUSE = `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
  const ICON_STOP = `<svg viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>`;
  const ICON_NEXT = `<svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>`;
  const ICON_PREV = `<svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>`;
  const ICON_LOOP = `<svg viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>`;
  const ICON_YOUTUBE = `<svg viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z"/></svg>`;

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  const playerHTML = `
    <div id="voice-piano-window" class="voice-piano-window">
      <div class="voice-piano-header">
        ${ICON_MUSIC}
        MP3 to Piano (Stable Notes v2.1)
      </div>
      <div class="voice-piano-content">
        <input type="file" id="voice-piano-file-input" class="voice-piano-file-input" accept="audio/*" multiple>
        <label for="voice-piano-file-input" class="voice-piano-file-label">
          ${ICON_UPLOAD}
          Load MP3 File(s)
        </label>

        <a href="https://cnvmp3.com/v51" target="_blank" class="yt-converter-btn">
          ${ICON_YOUTUBE}
          Convert YouTube to MP3
        </a>

        <div id="voice-piano-playlist-container" style="display: none;">
          <div class="voice-piano-playlist-header">
            <span class="voice-piano-playlist-title">Playlist (<span id="voice-piano-playlist-count">0</span>)</span>
            <button id="voice-piano-playlist-clear" class="voice-piano-playlist-clear">Clear All</button>
          </div>
          <div id="voice-piano-playlist" class="voice-piano-playlist">
            <div class="voice-piano-playlist-empty">No songs loaded</div>
          </div>
        </div>

        <div id="voice-piano-playback" class="voice-piano-playback" style="display: none;">
          <div class="voice-piano-time">
            <span id="voice-piano-current-time">0:00</span>
            <span id="voice-piano-duration">0:00</span>
          </div>
          <div class="voice-piano-progress">
            <div id="voice-piano-progress-bar" class="voice-piano-progress-bar"></div>
          </div>
        </div>

        <div class="voice-piano-controls">
          <button id="voice-piano-prev-btn" class="voice-piano-btn small" disabled>
            ${ICON_PREV}
          </button>
          <button id="voice-piano-play-btn" class="voice-piano-btn" disabled>
            ${ICON_PLAY}
            Play
          </button>
          <button id="voice-piano-stop-btn" class="voice-piano-btn" disabled>
            ${ICON_STOP}
            Stop
          </button>
          <button id="voice-piano-next-btn" class="voice-piano-btn small" disabled>
            ${ICON_NEXT}
          </button>
          <button id="voice-piano-loop-btn" class="voice-piano-btn small voice-piano-loop-btn">
            ${ICON_LOOP}
          </button>
        </div>

        <div class="voice-piano-slider-group">
          <div class="voice-piano-slider-label">
            <span>Sensitivity</span>
            <span id="voice-piano-sensitivity-value">30</span>
          </div>
          <input type="range" id="voice-piano-sensitivity" class="voice-piano-slider" min="10" max="80" value="30">
        </div>

        <div class="voice-piano-slider-group">
          <div class="voice-piano-slider-label">
            <span>Max Notes</span>
            <span id="voice-piano-max-harmonics-value">12</span>
          </div>
          <input type="range" id="voice-piano-max-harmonics" class="voice-piano-slider" min="2" max="24" value="12">
        </div>

        <div class="voice-piano-slider-group">
          <div class="voice-piano-slider-label">
            <span>Stability Weight</span>
            <span id="voice-piano-stability-weight-value">60%</span>
          </div>
          <input type="range" id="voice-piano-stability-weight" class="voice-piano-slider" min="0" max="100" value="60">
        </div>

        <div class="voice-piano-slider-group">
          <div class="voice-piano-slider-label">
            <span>Stability Window</span>
            <span id="voice-piano-stability-window-value">8 frames</span>
          </div>
          <input type="range" id="voice-piano-stability-window" class="voice-piano-slider" min="2" max="16" value="8">
        </div>

        <div class="voice-piano-status" id="voice-piano-status">
          Load MP3 file(s) to begin
          <div class="voice-piano-level">
            <div id="voice-piano-level-bar" class="voice-piano-level-bar"></div>
          </div>
        </div>

        <div id="voice-piano-harmonics" class="voice-piano-harmonics" style="display: none;"></div>

        <div class="voice-piano-info">
          <strong>Stable Notes Mode:</strong> Prioritizes notes that remain consistent over time, reducing flicker. Higher stability weight = smoother playback with fewer jumpy notes. Stability window controls how many frames are averaged.
        </div>
      </div>
    </div>
  `;

  const toggleButtonHTML = `
<div id="voice-piano-menu-btn" class="ugly-button">MP3 to Piano</div>
`;

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
    fileInput: document.getElementById('voice-piano-file-input'),
    playlistContainer: document.getElementById('voice-piano-playlist-container'),
    playlist: document.getElementById('voice-piano-playlist'),
    playlistCount: document.getElementById('voice-piano-playlist-count'),
    playlistClear: document.getElementById('voice-piano-playlist-clear'),
    playBtn: document.getElementById('voice-piano-play-btn'),
    stopBtn: document.getElementById('voice-piano-stop-btn'),
    prevBtn: document.getElementById('voice-piano-prev-btn'),
    nextBtn: document.getElementById('voice-piano-next-btn'),
    loopBtn: document.getElementById('voice-piano-loop-btn'),
    menuBtn: document.getElementById('voice-piano-menu-btn'),
    sensitivitySlider: document.getElementById('voice-piano-sensitivity'),
    sensitivityValue: document.getElementById('voice-piano-sensitivity-value'),
    maxHarmonicsSlider: document.getElementById('voice-piano-max-harmonics'),
    maxHarmonicsValue: document.getElementById('voice-piano-max-harmonics-value'),
    stabilityWeightSlider: document.getElementById('voice-piano-stability-weight'),
    stabilityWeightValue: document.getElementById('voice-piano-stability-weight-value'),
    stabilityWindowSlider: document.getElementById('voice-piano-stability-window'),
    stabilityWindowValue: document.getElementById('voice-piano-stability-window-value'),
    status: document.getElementById('voice-piano-status'),
    harmonicsContainer: document.getElementById('voice-piano-harmonics'),
    levelBar: document.getElementById('voice-piano-level-bar'),
    playback: document.getElementById('voice-piano-playback'),
    currentTime: document.getElementById('voice-piano-current-time'),
    duration: document.getElementById('voice-piano-duration'),
    progressBar: document.getElementById('voice-piano-progress-bar')
  };

  const engine = new MP3ToPiano();
  const playlist = new PlaylistManager();

  // ============= HELPER FUNCTIONS =============

  function updatePlaylistUI() {
    ui.playlistCount.textContent = playlist.size();

    if (playlist.isEmpty()) {
      ui.playlist.innerHTML = '<div class="voice-piano-playlist-empty">No songs loaded</div>';
      ui.playlistContainer.style.display = 'none';
      ui.playBtn.disabled = true;
      ui.stopBtn.disabled = true;
      ui.prevBtn.disabled = true;
      ui.nextBtn.disabled = true;
      return;
    }

    ui.playlistContainer.style.display = 'block';

    ui.playlist.innerHTML = playlist.playlist.map((item, index) => `
      <div class="voice-piano-playlist-item ${index === playlist.currentIndex ? 'active' : ''}" data-index="${index}">
        <span class="voice-piano-playlist-item-name">${item.name}</span>
        <button class="voice-piano-playlist-remove" data-index="${index}">Remove</button>
      </div>
    `).join('');

    document.querySelectorAll('.voice-piano-playlist-item').forEach(item => {
      item.addEventListener('click', async (e) => {
        if (e.target.classList.contains('voice-piano-playlist-remove')) {
          return;
        }
        const index = parseInt(item.dataset.index);
        const success = await loadSong(index);
        if (success) {
          engine.start();
          ui.playBtn.innerHTML = `${ICON_PAUSE}Pause`;
          ui.playBtn.classList.add('playing');
          ui.status.innerHTML = 'Playing...<div class="voice-piano-level"><div id="voice-piano-level-bar" class="voice-piano-level-bar"></div></div>';
          ui.levelBar = document.getElementById('voice-piano-level-bar');
          ui.harmonicsContainer.style.display = 'block';
        }
      });
    });

    document.querySelectorAll('.voice-piano-playlist-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        playlist.remove(index);
        if (index === playlist.currentIndex && !playlist.isEmpty()) {
          loadSong(playlist.currentIndex);
        }
      });
    });

    ui.playBtn.disabled = false;
    ui.stopBtn.disabled = false;
    ui.prevBtn.disabled = false;
    ui.nextBtn.disabled = false;
  }

  async function loadSong(index = null) {
    const song = index !== null ? playlist.setIndex(index) : playlist.getCurrent();
    if (!song) return false;

    if (engine.isPlaying) {
      engine.stop();
      ui.playBtn.innerHTML = `${ICON_PLAY}Play`;
      ui.playBtn.classList.remove('playing');
      ui.harmonicsContainer.style.display = 'none';
    }

    ui.playBtn.disabled = true;
    ui.status.textContent = 'Loading MP3...';
    const success = await engine.loadMP3(song.file);

    if (success) {
      ui.playback.style.display = 'block';
      ui.duration.textContent = formatTime(engine.getDuration());
      ui.currentTime.textContent = '0:00';
      ui.status.textContent = `Ready: ${song.name}`;
      ui.playBtn.disabled = false;
      updatePlaylistUI();
      console.log('[MP3 to Piano] Loaded:', song.name);
      return true;
    } else {
      ui.status.textContent = 'Error loading MP3. Try another file.';
      ui.playBtn.disabled = false;
      return false;
    }
  }

  async function playNext() {
    const shouldAutoPlay = engine.shouldAutoPlay;

    const nextSong = playlist.next();
    if (!nextSong) {
      engine.reset();
      ui.playBtn.innerHTML = `${ICON_PLAY}Play`;
      ui.playBtn.classList.remove('playing');
      ui.status.innerHTML = 'Playlist finished<div class="voice-piano-level"><div id="voice-piano-level-bar" class="voice-piano-level-bar"></div></div>';
      ui.levelBar = document.getElementById('voice-piano-level-bar');
      ui.harmonicsContainer.style.display = 'none';
      updatePlaylistUI();
      return;
    }

    engine.reset();
    const success = await loadSong();
    if (success && shouldAutoPlay) {
      engine.start();
      ui.playBtn.innerHTML = `${ICON_PAUSE}Pause`;
      ui.playBtn.classList.add('playing');
      ui.status.innerHTML = 'Playing...<div class="voice-piano-level"><div id="voice-piano-level-bar" class="voice-piano-level-bar"></div></div>';
      ui.levelBar = document.getElementById('voice-piano-level-bar');
      ui.harmonicsContainer.style.display = 'block';
    }
  }

  async function playPrevious() {
    const shouldAutoPlay = engine.shouldAutoPlay;

    const prevSong = playlist.previous();
    if (!prevSong) return;

    engine.reset();
    const success = await loadSong();
    if (success && shouldAutoPlay) {
      engine.start();
      ui.playBtn.innerHTML = `${ICON_PAUSE}Pause`;
      ui.playBtn.classList.add('playing');
      ui.status.innerHTML = 'Playing...<div class="voice-piano-level"><div id="voice-piano-level-bar" class="voice-piano-level-bar"></div></div>';
      ui.levelBar = document.getElementById('voice-piano-level-bar');
      ui.harmonicsContainer.style.display = 'block';
    }
  }

  // ============= EVENT HANDLERS =============

  engine.onHarmonicsUpdate = (harmonics, activeCount) => {
    const statusText = activeCount > 0
      ? `Playing... ${activeCount} note${activeCount !== 1 ? 's' : ''} active`
      : 'Playing... Analyzing audio';

    ui.status.childNodes[0].textContent = statusText;

    if (harmonics.length === 0) {
      ui.harmonicsContainer.innerHTML = '<div class="voice-piano-status">Analyzing audio...</div>';
    } else {
      ui.harmonicsContainer.innerHTML = harmonics.map(h => {
        const isStable = h.stability > 0.7;
        const stabilityPercent = Math.round(h.stability * 100);
        return `
        <div class="voice-piano-harmonic">
          <div class="voice-piano-harmonic-left">
            <div class="voice-piano-pulse ${isStable ? 'stable' : ''}"></div>
            <span class="voice-piano-note ${isStable ? 'stable' : ''}">${h.noteName}</span>
            <span class="voice-piano-freq">${h.frequency.toFixed(1)} Hz</span>
            <span class="voice-piano-stability">${stabilityPercent}% stable</span>
          </div>
          <div class="voice-piano-magnitude">
            <div class="voice-piano-bar">
              <div class="voice-piano-bar-fill ${isStable ? 'stable' : ''}" style="width: ${Math.round(h.magnitude / 255 * 100)}%"></div>
            </div>
            <span>${Math.round(h.magnitude / 255 * 100)}%</span>
          </div>
        </div>
      `}).join('');
    }
  };

  engine.onAudioLevelUpdate = (level) => {
    const percentage = Math.min(100, (level / 128) * 100);
    if (ui.levelBar) {
      ui.levelBar.style.width = `${percentage}%`;
    }
  };

  engine.onPlaybackUpdate = (status, currentTime, duration) => {
    if (status === 'playing' && currentTime !== undefined && duration !== undefined) {
      ui.currentTime.textContent = formatTime(currentTime);
      ui.duration.textContent = formatTime(duration);
      const percentage = (currentTime / duration) * 100;
      ui.progressBar.style.width = `${percentage}%`;
    }
  };

  engine.onSongEnd = () => {
    if (playlist.size() === 1 || playlist.loopEnabled) {
      if (playlist.size() === 1 && playlist.loopEnabled) {
        engine.reset();
        setTimeout(() => {
          engine.start();
          ui.playBtn.innerHTML = `${ICON_PAUSE}Pause`;
          ui.playBtn.classList.add('playing');
          ui.status.innerHTML = 'Playing...<div class="voice-piano-level"><div id="voice-piano-level-bar" class="voice-piano-level-bar"></div></div>';
          ui.levelBar = document.getElementById('voice-piano-level-bar');
          ui.harmonicsContainer.style.display = 'block';
        }, 100);
      } else if (playlist.size() > 1) {
        playNext();
      } else {
        ui.playBtn.innerHTML = `${ICON_PLAY}Play`;
        ui.playBtn.classList.remove('playing');
        ui.status.innerHTML = 'Playback finished<div class="voice-piano-level"><div id="voice-piano-level-bar" class="voice-piano-level-bar"></div></div>';
        ui.levelBar = document.getElementById('voice-piano-level-bar');
        ui.harmonicsContainer.style.display = 'none';
      }
    } else if (playlist.currentIndex < playlist.size() - 1) {
      playNext();
    } else {
      ui.playBtn.innerHTML = `${ICON_PLAY}Play`;
      ui.playBtn.classList.remove('playing');
      ui.status.innerHTML = 'Playlist finished<div class="voice-piano-level"><div id="voice-piano-level-bar" class="voice-piano-level-bar"></div></div>';
      ui.levelBar = document.getElementById('voice-piano-level-bar');
      ui.harmonicsContainer.style.display = 'none';
    }
  };

  playlist.onPlaylistChange = updatePlaylistUI;
  playlist.onCurrentChange = updatePlaylistUI;

  ui.fileInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      playlist.addFiles(files);
      await loadSong(playlist.currentIndex);
    }
    e.target.value = '';
  });

  ui.playlistClear.addEventListener('click', () => {
    engine.reset();
    playlist.clear();
    ui.playback.style.display = 'none';
    ui.status.innerHTML = 'Load MP3 file(s) to begin<div class="voice-piano-level"><div id="voice-piano-level-bar" class="voice-piano-level-bar"></div></div>';
    ui.levelBar = document.getElementById('voice-piano-level-bar');
  });

  ui.playBtn.addEventListener('click', () => {
    if (!engine.isPlaying) {
      const success = engine.start();
      if (success) {
        ui.playBtn.innerHTML = `${ICON_PAUSE}Pause`;
        ui.playBtn.classList.add('playing');
        ui.status.innerHTML = 'Playing...<div class="voice-piano-level"><div id="voice-piano-level-bar" class="voice-piano-level-bar"></div></div>';
        ui.levelBar = document.getElementById('voice-piano-level-bar');
        ui.harmonicsContainer.style.display = 'block';
      }
    } else {
      engine.pause();
      ui.playBtn.innerHTML = `${ICON_PLAY}Play`;
      ui.playBtn.classList.remove('playing');
      ui.status.textContent = 'Paused';
      ui.harmonicsContainer.style.display = 'none';
    }
  });

  ui.stopBtn.addEventListener('click', () => {
    engine.reset();
    ui.playBtn.innerHTML = `${ICON_PLAY}Play`;
    ui.playBtn.classList.remove('playing');
    ui.status.textContent = 'Stopped';
    ui.harmonicsContainer.style.display = 'none';
    ui.currentTime.textContent = '0:00';
    ui.progressBar.style.width = '0%';
    if (ui.levelBar) ui.levelBar.style.width = '0%';
  });

  const progressContainer = document.querySelector('.voice-piano-progress');
  progressContainer.addEventListener('click', (e) => {
    if (!engine.audioBuffer) return;

    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = percentage * engine.getDuration();

    engine.seek(seekTime);

    ui.currentTime.textContent = formatTime(seekTime);
    ui.progressBar.style.width = `${percentage * 100}%`;
  });

  ui.nextBtn.addEventListener('click', () => {
    engine.shouldAutoPlay = engine.isPlaying;
    playNext();
  });

  ui.prevBtn.addEventListener('click', () => {
    engine.shouldAutoPlay = engine.isPlaying;
    playPrevious();
  });

  ui.loopBtn.addEventListener('click', () => {
    const loopEnabled = playlist.toggleLoop();
    ui.loopBtn.classList.toggle('active', loopEnabled);
    ui.status.textContent = loopEnabled ? 'Loop enabled' : 'Loop disabled';
    setTimeout(() => {
      if (!engine.isPlaying) {
        ui.status.textContent = playlist.isEmpty() ? 'Load MP3 file(s) to begin' : `Ready: ${playlist.getCurrent().name}`;
      }
    }, 1500);
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

  ui.stabilityWeightSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    ui.stabilityWeightValue.textContent = `${value}%`;
    engine.setStabilityWeight(value / 100);
  });

  ui.stabilityWindowSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    ui.stabilityWindowValue.textContent = `${value} frames`;
    engine.setStabilityWindow(value);
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

  console.log('[MP3 to Piano Stable Notes v2.1] Loaded successfully! Click the "MP3 to Piano" button to open.');
})();
