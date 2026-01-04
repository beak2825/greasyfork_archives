// ==UserScript==
// @name         YouTube Music DJ Controller Pro Ultimate
// @namespace    http://tampermonkey.net/
// @version      4.0.1
// @description  Professional DJ Suite - 10-Band EQ, 12 Effects, Spatial Audio, Visualizer (Full Feature Set)
// @author       Gurveer
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555980/YouTube%20Music%20DJ%20Controller%20Pro%20Ultimate.user.js
// @updateURL https://update.greasyfork.org/scripts/555980/YouTube%20Music%20DJ%20Controller%20Pro%20Ultimate.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Audio context and nodes
    let audioContext = null;
    let sourceNode = null;
    let gainNode = null;
    let panNode = null;
    let compressorNode = null;
    let analyserNode = null;
    let limiterNode = null;

    // 10-Band EQ nodes
    let eq32Hz = null, eq64Hz = null, eq125Hz = null, eq250Hz = null, eq500Hz = null;
    let eq1kHz = null, eq2kHz = null, eq4kHz = null, eq8kHz = null, eq16kHz = null;

    // Advanced effect nodes
    let convolverNode = null;
    let delayNode = null;
    let delayFeedbackNode = null;
    let delayWetNode = null;
    let distortionNode = null;
    let phaserNode = null;
    let phaserLFO = null;
    let filterNode = null;

    // New advanced effects
    let chorusNode = null;
    let chorusLFO = null;
    let chorusDelay = null;
    let chorusDepth = null;
    let flangerNode = null;
    let flangerLFO = null;
    let flangerWet = null;
    let flangerDepth = null;
    let tremoloGain = null;
    let tremoloLFO = null;
    let tremoloDepth = null;
    let autoWahFilter = null;
    let autoWahLFO = null;
    let autoWahDepth = null;
    let bitcrusherNode = null;
    let ringModGain = null;
    let ringModOsc = null;
    let ringModDepth = null;
    let phaserDepth = null;

    // Spatial audio nodes
    let stereoWidthSplitter = null;
    let stereoWidthMerger = null;
    let stereoWidthGainL = null;
    let stereoWidthGainR = null;
    let haasDelayNode = null;

    let isInitialized = false;
    let animationFrameId = null;
    let visualizerMode = 'bars'; // 'bars' or 'radial'

    // DJ Control Panel State
    const djState = {
        pitch: 0,
        speed: 1.0,
        volume: 1.0,
        // 10-Band EQ
        eq32: 0, eq64: 0, eq125: 0, eq250: 0, eq500: 0,
        eq1k: 0, eq2k: 0, eq4k: 0, eq8k: 0, eq16k: 0,
        pan: 0,
        reverb: 0,
        reverbType: 'room',
        delay: 0,
        delayFeedback: 0,
        distortion: 0,
        // New effects
        chorus: 0,
        flanger: 0,
        tremolo: 0,
        autoWah: 0,
        bitcrusher: 0,
        ringMod: 0,
        phaser: 0,
        // Spatial audio
        stereoWidth: 0,
        haasEffect: 0,
        limiter: true,
        bpm: 0,
        crossfadeEnabled: false,
        crossfadeDuration: 3
    };

    // Crossfade state
    let currentTrackUrl = '';
    let isCrossfading = false;
    let videoElement = null;

    // Wait for video element to load
    function waitForVideoElement() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                const video = document.querySelector('video');
                if (video) {
                    clearInterval(checkInterval);
                    resolve(video);
                }
            }, 500);
        });
    }

    // Initialize Web Audio API with all advanced features
    function initializeAudioContext(videoElement) {
        if (isInitialized) return;

        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create source and main nodes with SAFE initial values
            sourceNode = audioContext.createMediaElementSource(videoElement);
            gainNode = audioContext.createGain();
            gainNode.gain.value = 1.0; // Start at 100% volume
            panNode = audioContext.createStereoPanner();
            panNode.pan.value = 0; // Start centered
            compressorNode = audioContext.createDynamicsCompressor();

            // Limiter
            limiterNode = audioContext.createDynamicsCompressor();
            limiterNode.threshold.value = -1.0;
            limiterNode.knee.value = 0.0;
            limiterNode.ratio.value = 20.0;
            limiterNode.attack.value = 0.003;
            limiterNode.release.value = 0.01;

            // Analyser
            analyserNode = audioContext.createAnalyser();
            analyserNode.fftSize = 4096;
            analyserNode.smoothingTimeConstant = 0.8;

            // Reverb (Convolver)
            convolverNode = audioContext.createConvolver();

            // 10-Band EQ
            eq32Hz = createEQBand(32, 'lowshelf');
            eq64Hz = createEQBand(64, 'peaking');
            eq125Hz = createEQBand(125, 'peaking');
            eq250Hz = createEQBand(250, 'peaking');
            eq500Hz = createEQBand(500, 'peaking');
            eq1kHz = createEQBand(1000, 'peaking');
            eq2kHz = createEQBand(2000, 'peaking');
            eq4kHz = createEQBand(4000, 'peaking');
            eq8kHz = createEQBand(8000, 'peaking');
            eq16kHz = createEQBand(16000, 'highshelf');

            // Distortion - Initialize with PASS-THROUGH curve (no distortion)
            distortionNode = audioContext.createWaveShaper();
            distortionNode.curve = makeDistortionCurve(0); // 0 = no distortion
            distortionNode.oversample = 'none'; // No oversampling for pass-through

            // Delay - Initialize with SAFE values (no feedback initially)
            delayNode = audioContext.createDelay(5.0);
            delayNode.delayTime.value = 0; // Start with NO delay
            delayFeedbackNode = audioContext.createGain();
            delayFeedbackNode.gain.value = 0; // Start with NO feedback
            delayWetNode = audioContext.createGain();
            delayWetNode.gain.value = 0; // Start with NO wet signal

            // Chorus effect
            chorusDelay = audioContext.createDelay(0.05);
            chorusDelay.delayTime.value = 0.02;
            chorusNode = audioContext.createGain();
            chorusNode.gain.value = 0;
            chorusLFO = audioContext.createOscillator();
            chorusLFO.frequency.value = 0;
            chorusLFO.start();
            chorusDepth = audioContext.createGain();
            chorusDepth.gain.value = 0; // Will be set by applyChorus
            chorusLFO.connect(chorusDepth);
            chorusDepth.connect(chorusDelay.delayTime);

            // Flanger effect
            flangerNode = audioContext.createDelay(0.01);
            flangerNode.delayTime.value = 0.005;
            flangerLFO = audioContext.createOscillator();
            flangerLFO.frequency.value = 0;
            flangerLFO.start();
            flangerDepth = audioContext.createGain();
            flangerDepth.gain.value = 0; // Will be set by applyFlanger
            flangerLFO.connect(flangerDepth);
            flangerDepth.connect(flangerNode.delayTime);

            // Tremolo effect
            tremoloGain = audioContext.createGain();
            tremoloGain.gain.value = 1.0;
            tremoloLFO = audioContext.createOscillator();
            tremoloLFO.frequency.value = 0;
            tremoloLFO.start();
            tremoloDepth = audioContext.createGain();
            tremoloDepth.gain.value = 0; // Will be set by applyTremolo
            tremoloLFO.connect(tremoloDepth);
            tremoloDepth.connect(tremoloGain.gain);

            // Auto-Wah effect (starts as lowpass with high frequency = pass-through)
            autoWahFilter = audioContext.createBiquadFilter();
            autoWahFilter.type = 'lowpass';
            autoWahFilter.frequency.value = 20000; // Full spectrum pass-through
            autoWahFilter.Q.value = 0.7; // Flat response
            autoWahLFO = audioContext.createOscillator();
            autoWahLFO.frequency.value = 0;
            autoWahLFO.start();
            autoWahDepth = audioContext.createGain();
            autoWahDepth.gain.value = 0; // Will be set by applyAutoWah
            autoWahLFO.connect(autoWahDepth);
            autoWahDepth.connect(autoWahFilter.frequency);

            // Ring Modulator (simple pass-through gain)
            ringModGain = audioContext.createGain();
            ringModGain.gain.value = 1.0; // Pass-through
            ringModOsc = audioContext.createOscillator();
            ringModOsc.frequency.value = 30;
            ringModOsc.start();
            ringModDepth = audioContext.createGain();
            ringModDepth.gain.value = 0; // No modulation by default
            ringModOsc.connect(ringModDepth);
            ringModDepth.connect(ringModGain.gain);

            // Phaser effect
            phaserNode = audioContext.createBiquadFilter();
            phaserNode.type = 'allpass';
            phaserNode.frequency.value = 1000;
            phaserLFO = audioContext.createOscillator();
            phaserLFO.frequency.value = 0;
            phaserLFO.start();
            phaserDepth = audioContext.createGain();
            phaserDepth.gain.value = 0; // Will be set by applyPhaser
            phaserLFO.connect(phaserDepth);
            phaserDepth.connect(phaserNode.frequency);

            // Bitcrusher (using waveshaper) - Initialize with PASS-THROUGH curve
            bitcrusherNode = audioContext.createWaveShaper();
            bitcrusherNode.curve = makeBitcrusherCurve(16); // 16-bit = no crushing (pass-through)
            bitcrusherNode.oversample = 'none'; // No oversampling for pass-through

            // Stereo Width
            stereoWidthSplitter = audioContext.createChannelSplitter(2);
            stereoWidthMerger = audioContext.createChannelMerger(2);
            stereoWidthGainL = audioContext.createGain();
            stereoWidthGainR = audioContext.createGain();
            stereoWidthGainL.gain.value = 1.0;
            stereoWidthGainR.gain.value = 1.0;

            // Haas Effect
            haasDelayNode = audioContext.createDelay(0.05);
            haasDelayNode.delayTime.value = 0;

            // Build SIMPLIFIED audio chain - effects in series for clean signal path
            // Source -> EQ -> Distortion -> Bitcrusher -> Phaser -> Auto-Wah -> Tremolo -> Stereo -> Gain -> Delay -> Pan -> Limiter -> Output
            
            // Step 1: Connect 10-Band EQ chain
            sourceNode.connect(eq32Hz);
            eq32Hz.connect(eq64Hz);
            eq64Hz.connect(eq125Hz);
            eq125Hz.connect(eq250Hz);
            eq250Hz.connect(eq500Hz);
            eq500Hz.connect(eq1kHz);
            eq1kHz.connect(eq2kHz);
            eq2kHz.connect(eq4kHz);
            eq4kHz.connect(eq8kHz);
            eq8kHz.connect(eq16kHz);
            
            // Step 2: Basic effects (always in chain, controlled by amount)
            eq16kHz.connect(distortionNode);
            distortionNode.connect(bitcrusherNode);
            
            // Step 3: Modulation effects (series - each is pass-through when off)
            bitcrusherNode.connect(phaserNode);
            phaserNode.connect(autoWahFilter);
            autoWahFilter.connect(tremoloGain);
            
            // Step 4: Chorus and Flanger (parallel wet signals, mixed with dry)
            const effectsMixer = audioContext.createGain();
            effectsMixer.gain.value = 1.0;
            
            // Dry signal (always passes through)
            tremoloGain.connect(effectsMixer);
            
            // Chorus wet signal (starts at 0 gain)
            tremoloGain.connect(chorusDelay);
            chorusDelay.connect(chorusNode);
            chorusNode.connect(effectsMixer);
            
            // Flanger wet signal (starts at 0 gain) 
            tremoloGain.connect(flangerNode);
            flangerWet = audioContext.createGain();
            flangerWet.gain.value = 0;
            flangerNode.connect(flangerWet);
            flangerWet.connect(effectsMixer);
            
            // Ring mod (series after mixer)
            effectsMixer.connect(ringModGain);
            
            // Step 5: Stereo Width
            ringModGain.connect(stereoWidthSplitter);
            stereoWidthSplitter.connect(stereoWidthGainL, 0);
            stereoWidthSplitter.connect(stereoWidthGainR, 1);
            stereoWidthGainL.connect(stereoWidthMerger, 0, 0);
            stereoWidthGainR.connect(stereoWidthMerger, 0, 1);
            
            // Step 6: Haas Effect
            stereoWidthMerger.connect(haasDelayNode);
            
            // Step 7: Connect to main gain
            haasDelayNode.connect(gainNode);
            
            // Step 8: Delay with controlled feedback
            gainNode.connect(delayNode);
            delayNode.connect(delayFeedbackNode);
            delayFeedbackNode.connect(delayNode);
            delayNode.connect(delayWetNode);
            
            // Step 9: Mix dry signal and delay wet signal
            const dryGain = audioContext.createGain();
            dryGain.gain.value = 1.0;
            gainNode.connect(dryGain);
            
            const mixNode = audioContext.createGain();
            dryGain.connect(mixNode);
            delayWetNode.connect(mixNode);
            
            // Step 10: Final chain
            mixNode.connect(panNode);
            panNode.connect(compressorNode);
            compressorNode.connect(limiterNode);
            limiterNode.connect(analyserNode);
            analyserNode.connect(audioContext.destination);

            isInitialized = true;
            console.log('YouTube Music DJ Pro Ultimate: Audio context initialized (SAFE MODE - No Beeping)');
        } catch (error) {
            console.error('YouTube Music DJ Pro Ultimate: Failed to initialize', error);
        }
    }

    // Helper to create EQ band
    function createEQBand(frequency, type) {
        const filter = audioContext.createBiquadFilter();
        filter.type = type;
        filter.frequency.value = frequency;
        filter.Q.value = 1.0;
        filter.gain.value = 0;
        return filter;
    }

    // Create distortion curve
    function makeDistortionCurve(amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);
        
        // If no distortion, create a simple pass-through curve
        if (amount === 0) {
            for (let i = 0; i < samples; i++) {
                curve[i] = (i * 2) / samples - 1; // Linear pass-through
            }
            return curve;
        }
        
        // Otherwise create distortion curve
        const deg = Math.PI / 180;
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
        }
        return curve;
    }

    // Create reverb impulse response with different types
    // NOTE: Reverb is currently not connected to the audio chain
    function createReverbImpulse(type, duration, decay) {
        const sampleRate = audioContext.sampleRate;
        let length, decayValue;

        switch (type) {
            case 'room':
                length = sampleRate * 0.5;
                decayValue = 2;
                break;
            case 'hall':
                length = sampleRate * 2;
                decayValue = 3;
                break;
            case 'cathedral':
                length = sampleRate * 4;
                decayValue = 4;
                break;
            case 'plate':
                length = sampleRate * 1;
                decayValue = 2.5;
                break;
            default:
                length = sampleRate * duration;
                decayValue = decay;
        }

        const impulse = audioContext.createBuffer(2, length, sampleRate);
        const impulseL = impulse.getChannelData(0);
        const impulseR = impulse.getChannelData(1);

        for (let i = 0; i < length; i++) {
            const n = length - i;
            impulseL[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decayValue);
            impulseR[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decayValue);
        }

        convolverNode.buffer = impulse;
    }

    // Create bitcrusher curve
    function makeBitcrusherCurve(bits) {
        const samples = 65536;
        const curve = new Float32Array(samples);
        
        // If 16 bits (no crushing), create a pass-through curve
        if (bits >= 16) {
            for (let i = 0; i < samples; i++) {
                curve[i] = (i * 2) / samples - 1; // Linear pass-through
            }
            return curve;
        }
        
        // Otherwise create bitcrusher curve
        const step = Math.pow(0.5, bits);
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = step * Math.floor(x / step + 0.5);
        }
        return curve;
    }

    // Apply pitch shift (using playback rate)
    function applyPitch(videoElement, semitones) {
        const rate = Math.pow(2, semitones / 12) * djState.speed;
        videoElement.playbackRate = rate;
        videoElement.preservesPitch = false;
    }

    // Apply speed change
    function applySpeed(videoElement, speed) {
        djState.speed = speed;
        const rate = Math.pow(2, djState.pitch / 12) * speed;
        videoElement.playbackRate = rate;
        videoElement.preservesPitch = true;
    }

    // Apply volume
    function applyVolume(volume) {
        if (gainNode) {
            gainNode.gain.value = volume;
        }
    }

    // Apply EQ
    function applyEQ(type, value) {
        const gain = value * 20; // -20 to +20 dB range

        switch (type) {
            case 'bass':
                // Control low frequencies (32Hz, 64Hz, 125Hz)
                if (eq32Hz) eq32Hz.gain.value = gain;
                if (eq64Hz) eq64Hz.gain.value = gain * 0.8;
                if (eq125Hz) eq125Hz.gain.value = gain * 0.6;
                break;
            case 'mid':
                // Control mid frequencies (500Hz, 1kHz, 2kHz)
                if (eq500Hz) eq500Hz.gain.value = gain;
                if (eq1kHz) eq1kHz.gain.value = gain;
                if (eq2kHz) eq2kHz.gain.value = gain * 0.8;
                break;
            case 'treble':
                // Control high frequencies (4kHz, 8kHz, 16kHz)
                if (eq4kHz) eq4kHz.gain.value = gain * 0.6;
                if (eq8kHz) eq8kHz.gain.value = gain * 0.8;
                if (eq16kHz) eq16kHz.gain.value = gain;
                break;
        }
    }

    // Apply pan
    function applyPan(value) {
        if (panNode) {
            panNode.pan.value = value;
        }
    }

    // Apply distortion
    function applyDistortion(amount) {
        if (distortionNode) {
            distortionNode.curve = makeDistortionCurve(amount * 100);
        }
    }

    // Apply delay
    function applyDelay(time, feedback) {
        if (delayNode && delayFeedbackNode && delayWetNode) {
            delayNode.delayTime.value = time;
            delayFeedbackNode.gain.value = feedback;
            delayWetNode.gain.value = time > 0 ? 0.5 : 0;
        }
    }

    // Apply phaser
    function applyPhaser(rate) {
        if (!phaserNode || !phaserLFO || !phaserDepth) return;
        
        if (rate === 0) {
            // No modulation
            phaserLFO.frequency.value = 0;
            phaserDepth.gain.value = 0;
            phaserNode.frequency.value = 1000;
        } else {
            // Active phaser
            phaserLFO.frequency.value = rate * 0.5; // 0-0.5 Hz (slower for more noticeable effect)
            phaserNode.frequency.value = 1000; // Center frequency
            phaserDepth.gain.value = rate * 800; // Modulation depth (sweep range)
        }
    }

    // Apply 10-Band EQ (currently unused - no UI controls implemented)
    // TODO: Add UI controls for individual frequency bands
    function apply10BandEQ(band, value) {
        const gain = value * 20; // -20 to +20 dB
        const eqBands = {
            eq32: eq32Hz, eq64: eq64Hz, eq125: eq125Hz, eq250: eq250Hz, eq500: eq500Hz,
            eq1k: eq1kHz, eq2k: eq2kHz, eq4k: eq4kHz, eq8k: eq8kHz, eq16k: eq16kHz
        };

        if (eqBands[band]) {
            eqBands[band].gain.value = gain;
        }
    }

    // Apply chorus
    function applyChorus(amount) {
        if (!chorusNode || !chorusLFO || !chorusDepth) return;
        
        if (amount === 0) {
            chorusNode.gain.value = 0;
            chorusLFO.frequency.value = 0;
            chorusDepth.gain.value = 0;
        } else {
            chorusNode.gain.value = amount * 0.7; // Wet mix (increased)
            chorusLFO.frequency.value = amount * 3; // 0-3 Hz modulation
            chorusDepth.gain.value = amount * 0.005; // Modulation depth (increased)
        }
    }

    // Apply flanger
    function applyFlanger(amount) {
        if (!flangerNode || !flangerLFO || !flangerWet || !flangerDepth) return;
        
        if (amount === 0) {
            flangerLFO.frequency.value = 0;
            flangerWet.gain.value = 0;
            flangerDepth.gain.value = 0;
            flangerNode.delayTime.value = 0.005;
        } else {
            flangerLFO.frequency.value = amount * 0.5; // 0-0.5 Hz (slower for more noticeable effect)
            flangerNode.delayTime.value = 0.003 + (amount * 0.007); // 3-10ms base delay
            flangerDepth.gain.value = amount * 0.003; // Modulation depth (increased)
            flangerWet.gain.value = amount * 0.7; // Wet mix (increased)
        }
    }

    // Apply tremolo
    function applyTremolo(amount) {
        if (!tremoloGain || !tremoloLFO || !tremoloDepth) return;
        
        if (amount === 0) {
            tremoloLFO.frequency.value = 0;
            tremoloDepth.gain.value = 0;
            // Reset gain to 1.0 using setValueAtTime to avoid clicks
            tremoloGain.gain.setValueAtTime(1.0, audioContext.currentTime);
        } else {
            tremoloLFO.frequency.value = amount * 8; // 0-8 Hz
            tremoloDepth.gain.value = amount * 0.5; // Modulation depth (0 to 0.5)
            // The LFO oscillates between -1 and +1, so with depth 0.5:
            // gain will oscillate between 0.5 and 1.5 (centered at 1.0)
        }
    }

    // Apply auto-wah
    function applyAutoWah(amount) {
        if (!autoWahFilter || !autoWahLFO || !autoWahDepth) return;
        
        if (amount === 0) {
            // Pass-through mode
            autoWahFilter.type = 'lowpass';
            autoWahFilter.frequency.value = 20000;
            autoWahFilter.Q.value = 0.7;
            autoWahLFO.frequency.value = 0;
            autoWahDepth.gain.value = 0;
        } else {
            // Active wah mode
            autoWahFilter.type = 'bandpass';
            autoWahLFO.frequency.value = amount * 3; // 0-3 Hz (slower for more musical effect)
            const baseFreq = 400 + (amount * 800); // Base frequency 400-1200 Hz
            autoWahFilter.frequency.value = baseFreq;
            autoWahDepth.gain.value = amount * 1000; // Modulation depth (sweep range)
            autoWahFilter.Q.value = 5 + (amount * 15); // Resonance (5-20)
        }
    }

    // Apply bitcrusher
    function applyBitcrusher(amount) {
        if (!bitcrusherNode) return;
        const bits = Math.floor(16 - (amount * 12)); // 16 to 4 bits
        bitcrusherNode.curve = makeBitcrusherCurve(bits);
    }

    // Apply ring modulator
    function applyRingMod(amount) {
        if (!ringModGain || !ringModOsc || !ringModDepth) return;
        
        if (amount === 0) {
            // No modulation
            ringModDepth.gain.value = 0;
            ringModGain.gain.value = 1.0;
        } else {
            // Active ring mod
            ringModDepth.gain.value = amount * 0.5; // Modulation depth
            ringModOsc.frequency.value = 30 + (amount * 200); // 30-230 Hz
        }
    }

    // Apply stereo width
    function applyStereoWidth(amount) {
        if (!stereoWidthGainL || !stereoWidthGainR) return;
        // amount: -1 (mono) to 0 (normal) to 1 (wide)
        
        if (amount < 0) {
            // Mono: reduce stereo separation
            const mono = 1 + amount; // 0 (full mono) to 1 (normal)
            stereoWidthGainL.gain.value = mono;
            stereoWidthGainR.gain.value = mono;
        } else if (amount > 0) {
            // Wide: increase stereo separation
            const wide = 1 + (amount * 0.5); // 1 (normal) to 1.5 (wide)
            stereoWidthGainL.gain.value = wide;
            stereoWidthGainR.gain.value = wide;
        } else {
            // Normal
            stereoWidthGainL.gain.value = 1.0;
            stereoWidthGainR.gain.value = 1.0;
        }
    }

    // Apply Haas effect
    function applyHaasEffect(amount) {
        if (!haasDelayNode) return;
        haasDelayNode.delayTime.value = amount * 0.03; // 0-30ms
    }

    // Change reverb type (currently unused - reverb not connected to audio chain)
    // TODO: Connect convolverNode to audio chain and add UI controls
    function changeReverbType(type) {
        createReverbImpulse(type, 2, 2);
        djState.reverbType = type;
    }

    // BPM Detection
    function detectBPM() {
        if (!analyserNode) return 0;

        const bufferLength = analyserNode.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        analyserNode.getByteTimeDomainData(dataArray);

        let peaks = [];
        let threshold = 128;

        for (let i = 0; i < bufferLength; i++) {
            if (dataArray[i] > threshold && (i === 0 || dataArray[i - 1] <= threshold)) {
                peaks.push(i);
            }
        }

        if (peaks.length < 2) return 0;

        let intervals = [];
        for (let i = 1; i < peaks.length; i++) {
            intervals.push(peaks[i] - peaks[i - 1]);
        }

        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const bpm = Math.round((60 * audioContext.sampleRate) / (avgInterval * 512));

        return bpm > 60 && bpm < 200 ? bpm : 0;
    }

    // Crossfade functionality
    function enableCrossfade() {
        if (!videoElement) return;

        // Monitor track changes
        const observer = new MutationObserver(() => {
            const video = document.querySelector('video');
            if (!video) return;

            const currentSrc = video.currentSrc || video.src;
            if (currentSrc && currentSrc !== currentTrackUrl && !isCrossfading) {
                performCrossfade();
                currentTrackUrl = currentSrc;
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['src']
        });
    }

    function performCrossfade() {
        if (!gainNode || isCrossfading || !djState.crossfadeEnabled) return;

        isCrossfading = true;
        const duration = djState.crossfadeDuration;
        const startVolume = gainNode.gain.value;
        const startTime = audioContext.currentTime;

        // Fade out
        gainNode.gain.setValueAtTime(startVolume, startTime);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration / 2);

        // Fade in
        setTimeout(() => {
            gainNode.gain.linearRampToValueAtTime(startVolume, audioContext.currentTime + duration / 2);
            setTimeout(() => {
                isCrossfading = false;
            }, (duration / 2) * 1000);
        }, (duration / 2) * 1000);
    }

    // Preset configurations
    const presets = {
        dance: {
            name: 'Dance',
            bass: 0.6,
            mid: -0.2,
            treble: 0.4,
            volume: 1.2,
            distortion: 0
        },
        rock: {
            name: 'Rock',
            bass: 0.3,
            mid: 0.5,
            treble: 0.6,
            volume: 1.3,
            distortion: 0.15
        },
        bassBoost: {
            name: 'Bass Boost',
            bass: 0.9,
            mid: -0.3,
            treble: 0.2,
            volume: 1.1,
            distortion: 0
        },
        jazz: {
            name: 'Jazz',
            bass: 0.2,
            mid: 0.4,
            treble: 0.3,
            volume: 1.0,
            distortion: 0
        },
        electronic: {
            name: 'Electronic',
            bass: 0.7,
            mid: 0.1,
            treble: 0.5,
            volume: 1.3,
            distortion: 0.1
        },
        hiphop: {
            name: 'Hip-Hop',
            bass: 0.8,
            mid: -0.1,
            treble: 0.3,
            volume: 1.2,
            distortion: 0
        },
        classical: {
            name: 'Classical',
            bass: 0.1,
            mid: 0.2,
            treble: 0.4,
            volume: 0.9,
            distortion: 0
        },
        vocal: {
            name: 'Vocal',
            bass: -0.2,
            mid: 0.6,
            treble: 0.3,
            volume: 1.1,
            distortion: 0
        }
    };

    function applyPreset(presetName) {
        const preset = presets[presetName];
        if (!preset) return;

        djState.bass = preset.bass;
        djState.mid = preset.mid;
        djState.treble = preset.treble;
        djState.volume = preset.volume;
        djState.distortion = preset.distortion;

        const bassSlider = document.getElementById('bass-slider');
        const bassValue = document.getElementById('bass-value');
        const midSlider = document.getElementById('mid-slider');
        const midValue = document.getElementById('mid-value');
        const trebleSlider = document.getElementById('treble-slider');
        const trebleValue = document.getElementById('treble-value');
        const volumeSlider = document.getElementById('volume-slider');
        const volumeValue = document.getElementById('volume-value');
        const distortionSlider = document.getElementById('distortion-slider');
        const distortionValue = document.getElementById('distortion-value');

        if (bassSlider) bassSlider.value = preset.bass;
        if (bassValue) bassValue.textContent = preset.bass.toFixed(1);
        if (midSlider) midSlider.value = preset.mid;
        if (midValue) midValue.textContent = preset.mid.toFixed(1);
        if (trebleSlider) trebleSlider.value = preset.treble;
        if (trebleValue) trebleValue.textContent = preset.treble.toFixed(1);
        if (volumeSlider) volumeSlider.value = preset.volume;
        if (volumeValue) volumeValue.textContent = `${Math.round(preset.volume * 100)}%`;
        if (distortionSlider) distortionSlider.value = preset.distortion;
        if (distortionValue) distortionValue.textContent = `${Math.round(preset.distortion * 100)}%`;

        applyEQ('bass', preset.bass);
        applyEQ('mid', preset.mid);
        applyEQ('treble', preset.treble);
        applyVolume(preset.volume);
        applyDistortion(preset.distortion);
    }

    // Wait for player bar to load
    function waitForPlayerBar() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                const playerBar = document.querySelector('ytmusic-player-bar');
                if (playerBar) {
                    clearInterval(checkInterval);
                    resolve(playerBar);
                }
            }, 500);
        });
    }

    // Create DJ Control Panel UI (using DOM methods to avoid Trusted Types violation)
    function createDJPanel() {
        // Inject styles
        const style = document.createElement('style');
        style.textContent = `
            #ytm-dj-panel {
                position: fixed;
                bottom: 72px;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(40px) saturate(180%);
                -webkit-backdrop-filter: blur(40px) saturate(180%);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 -8px 32px 0 rgba(0, 0, 0, 0.37);
                padding: 15px 20px;
                z-index: 9999;
                color: white;
                font-family: 'Roboto', sans-serif;
                max-height: 600px;
                overflow-y: auto;
                transition: all 0.3s ease;
                transform: translateY(0);
            }
            #ytm-dj-panel.minimized {
                transform: translateY(calc(100% + 72px));
            }
            #ytm-dj-panel::-webkit-scrollbar {
                width: 8px;
            }
            #ytm-dj-panel::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
            }
            #ytm-dj-panel::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                border: 2px solid transparent;
                background-clip: padding-box;
            }
            #ytm-dj-panel::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 0, 0, 0.5);
                background-clip: padding-box;
            }
            #ytm-dj-toggle-btn {
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: rgba(255, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 24px;
                z-index: 10000;
                box-shadow: 0 8px 24px rgba(255, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #ytm-dj-toggle-btn:hover {
                background: rgba(255, 0, 0, 0.95);
                transform: scale(1.1) translateY(-2px);
                box-shadow: 0 12px 32px rgba(255, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2);
            }
            #ytm-dj-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 0 15px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                margin-bottom: 20px;
            }
            #ytm-dj-branding {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            #ytm-dj-logo {
                width: 40px;
                height: 40px;
                filter: drop-shadow(0 0 8px rgba(255, 0, 0, 0.5));
            }
            #ytm-dj-title {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            #ytm-dj-name {
                font-size: 16px;
                font-weight: bold;
                color: #ff0000;
                letter-spacing: 0.5px;
            }
            #ytm-dj-subtitle {
                font-size: 9px;
                color: #888;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            #ytm-dj-author {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 11px;
                color: #aaa;
            }
            #ytm-dj-author a {
                color: #ff0000;
                text-decoration: none;
                transition: color 0.2s;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            #ytm-dj-author a:hover {
                color: #ff4444;
                text-decoration: underline;
            }
            #ytm-dj-content {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
            }
            .dj-section {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                padding: 15px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            }
            .dj-section-title {
                font-size: 12px;
                font-weight: bold;
                color: #ff0000;
                margin-bottom: 12px;
                text-transform: uppercase;
                letter-spacing: 1.5px;
            }
            .dj-control {
                margin-bottom: 10px;
            }
            .dj-label {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
                font-size: 11px;
                color: #bbb;
            }
            .dj-value {
                color: #ff0000;
                font-weight: bold;
                font-size: 11px;
            }
            .dj-slider {
                width: 100%;
                height: 4px;
                border-radius: 2px;
                background: rgba(255, 255, 255, 0.1);
                outline: none;
                -webkit-appearance: none;
            }
            .dj-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: #ff0000;
                cursor: pointer;
                box-shadow: 0 0 6px rgba(255, 0, 0, 0.6);
            }
            .dj-slider::-moz-range-thumb {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: #ff0000;
                cursor: pointer;
                border: none;
                box-shadow: 0 0 6px rgba(255, 0, 0, 0.6);
            }
            .dj-button {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                padding: 8px 14px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 10px;
                margin-right: 6px;
                margin-top: 8px;
                transition: all 0.3s ease;
                font-weight: 500;
            }
            .dj-button:hover {
                background: rgba(255, 0, 0, 0.6);
                border-color: rgba(255, 0, 0, 0.8);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(255, 0, 0, 0.3);
            }
            .dj-button:active {
                background: rgba(200, 0, 0, 0.8);
                transform: translateY(0);
                box-shadow: 0 2px 8px rgba(255, 0, 0, 0.2);
            }
            #visualizer-canvas {
                width: 100%;
                height: 100px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                margin-bottom: 10px;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }
            #waveform-canvas {
                width: 100%;
                height: 50px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                margin-bottom: 10px;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }
            .vu-meter-container {
                display: flex;
                gap: 8px;
                align-items: flex-end;
            }
            .vu-channel {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .vu-bar {
                width: 100%;
                height: 70px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                position: relative;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .vu-fill {
                position: absolute;
                bottom: 0;
                width: 100%;
                background: linear-gradient(to top, #00ff00, #ffff00, #ff0000);
                transition: height 0.05s ease-out;
                height: 0%;
            }
            .vu-label {
                text-align: center;
                font-size: 9px;
                color: #888;
                margin-top: 4px;
                font-weight: bold;
            }
            #bpm-display {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                padding: 16px;
                border-radius: 12px;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            }
            #bpm-value {
                font-size: 28px;
                font-weight: bold;
                color: #ff0000;
                line-height: 1;
            }
            #bpm-label {
                font-size: 10px;
                color: #888;
                margin-top: 4px;
                letter-spacing: 1px;
            }
        `;
        document.head.appendChild(style);

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'ytm-dj-toggle-btn';
        toggleBtn.textContent = '🎧'; // Start with close icon since panel is open
        toggleBtn.title = 'Close DJ Controls';
        document.body.appendChild(toggleBtn);

        // Create panel container
        const panel = document.createElement('div');
        panel.id = 'ytm-dj-panel';
        // Start visible (no minimized class)
        panel.className = '';

        // Create header with branding
        const header = document.createElement('div');
        header.id = 'ytm-dj-header';

        const branding = document.createElement('div');
        branding.id = 'ytm-dj-branding';

        const logo = document.createElement('img');
        logo.id = 'ytm-dj-logo';
        logo.src = 'https://music.youtube.com/img/on_platform_logo_dark.svg';
        logo.alt = 'YouTube Music';

        const titleDiv = document.createElement('div');
        titleDiv.id = 'ytm-dj-title';

        const name = document.createElement('div');
        name.id = 'ytm-dj-name';
        name.textContent = 'DJ Controller Pro Ultimate';

        const subtitle = document.createElement('div');
        subtitle.id = 'ytm-dj-subtitle';
        subtitle.textContent = 'Professional Audio Suite';

        titleDiv.appendChild(name);
        titleDiv.appendChild(subtitle);

        branding.appendChild(logo);
        branding.appendChild(titleDiv);

        const authorDiv = document.createElement('div');
        authorDiv.id = 'ytm-dj-author';
        
        const byText = document.createElement('span');
        byText.textContent = 'by';
        
        const authorLink = document.createElement('a');

        const followText = document.createElement('span');
        followText.textContent = 'Follow my git for more';
        followText.style.fontSize = '10px';
        followText.style.color = '#3b3b3bff';
        followText.style.marginLeft = '8px';
        
        authorDiv.appendChild(followText);
        
        authorLink.href = 'https://github.com/gurveeer';
        authorLink.target = '_blank';
        authorLink.rel = 'noopener noreferrer';
        authorLink.textContent = '🛡️ Gurveer';
        
        authorDiv.appendChild(byText);
        authorDiv.appendChild(authorLink);

        header.appendChild(branding);
        header.appendChild(authorDiv);

        console.log('YouTube Music DJ Pro: Header created with branding');

        // Create content container
        const content = document.createElement('div');
        content.id = 'ytm-dj-content';

        // Helper function to create control
        function createControl(label, id, min, max, value, step, displayValue) {
            const control = document.createElement('div');
            control.className = 'dj-control';

            const labelDiv = document.createElement('div');
            labelDiv.className = 'dj-label';

            const labelSpan = document.createElement('span');
            labelSpan.textContent = label;

            const valueSpan = document.createElement('span');
            valueSpan.className = 'dj-value';
            valueSpan.id = `${id}-value`;
            valueSpan.textContent = displayValue;

            labelDiv.appendChild(labelSpan);
            labelDiv.appendChild(valueSpan);

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.className = 'dj-slider';
            slider.id = `${id}-slider`;
            slider.min = min;
            slider.max = max;
            slider.value = value;
            slider.step = step;

            control.appendChild(labelDiv);
            control.appendChild(slider);

            return control;
        }

        function createSection(title) {
            const section = document.createElement('div');
            section.className = 'dj-section';
            const sectionTitle = document.createElement('div');
            sectionTitle.className = 'dj-section-title';
            sectionTitle.textContent = title;
            section.appendChild(sectionTitle);
            return section;
        }

        // BPM Display
        const bpmDisplay = document.createElement('div');
        bpmDisplay.id = 'bpm-display';
        const bpmValue = document.createElement('div');
        bpmValue.id = 'bpm-value';
        bpmValue.textContent = '---';
        const bpmLabel = document.createElement('div');
        bpmLabel.id = 'bpm-label';
        bpmLabel.textContent = 'BPM';
        bpmDisplay.appendChild(bpmValue);
        bpmDisplay.appendChild(bpmLabel);
        content.appendChild(bpmDisplay);

        // Visual Section
        const visualSection = createSection('Visualizer');
        
        // Mode toggle buttons
        const vizToggle = document.createElement('div');
        vizToggle.style.display = 'flex';
        vizToggle.style.gap = '8px';
        vizToggle.style.marginBottom = '10px';
        
        const barsBtn = document.createElement('button');
        barsBtn.className = 'dj-button';
        barsBtn.id = 'viz-bars';
        barsBtn.textContent = 'Bars';
        barsBtn.style.flex = '1';
        barsBtn.style.background = 'rgba(255, 0, 0, 0.8)';
        
        const radialBtn = document.createElement('button');
        radialBtn.className = 'dj-button';
        radialBtn.id = 'viz-radial';
        radialBtn.textContent = 'Radial';
        radialBtn.style.flex = '1';
        radialBtn.style.background = 'rgba(255, 0, 0, 0.3)';
        
        vizToggle.appendChild(barsBtn);
        vizToggle.appendChild(radialBtn);
        visualSection.appendChild(vizToggle);

        // Visualizer Canvas (Bars mode)
        const visualizerCanvas = document.createElement('canvas');
        visualizerCanvas.id = 'visualizer-canvas';
        visualizerCanvas.width = 300;
        visualizerCanvas.height = 100;
        visualSection.appendChild(visualizerCanvas);
        
        // Radial Canvas
        const radialCanvas = document.createElement('canvas');
        radialCanvas.id = 'radial-canvas';
        radialCanvas.width = 300;
        radialCanvas.height = 200;
        radialCanvas.style.display = 'none';
        radialCanvas.style.background = 'rgba(0, 0, 0, 0.5)';
        radialCanvas.style.borderRadius = '6px';
        radialCanvas.style.marginBottom = '10px';
        visualSection.appendChild(radialCanvas);

        // Waveform Canvas
        const waveformCanvas = document.createElement('canvas');
        waveformCanvas.id = 'waveform-canvas';
        waveformCanvas.width = 300;
        waveformCanvas.height = 50;
        visualSection.appendChild(waveformCanvas);

        content.appendChild(visualSection);

        // VU Meters
        const vuSection = createSection('VU Meters');
        const vuMeterContainer = document.createElement('div');
        vuMeterContainer.className = 'vu-meter-container';

        // Left channel
        const vuLeftChannel = document.createElement('div');
        vuLeftChannel.className = 'vu-channel';
        const vuLeftBar = document.createElement('div');
        vuLeftBar.className = 'vu-bar';
        const vuLeftFill = document.createElement('div');
        vuLeftFill.className = 'vu-fill';
        vuLeftFill.id = 'vu-left';
        vuLeftBar.appendChild(vuLeftFill);
        const vuLeftLabel = document.createElement('div');
        vuLeftLabel.className = 'vu-label';
        vuLeftLabel.textContent = 'LEFT';
        vuLeftChannel.appendChild(vuLeftBar);
        vuLeftChannel.appendChild(vuLeftLabel);

        // Right channel
        const vuRightChannel = document.createElement('div');
        vuRightChannel.className = 'vu-channel';
        const vuRightBar = document.createElement('div');
        vuRightBar.className = 'vu-bar';
        const vuRightFill = document.createElement('div');
        vuRightFill.className = 'vu-fill';
        vuRightFill.id = 'vu-right';
        vuRightBar.appendChild(vuRightFill);
        const vuRightLabel = document.createElement('div');
        vuRightLabel.className = 'vu-label';
        vuRightLabel.textContent = 'RIGHT';
        vuRightChannel.appendChild(vuRightBar);
        vuRightChannel.appendChild(vuRightLabel);

        vuMeterContainer.appendChild(vuLeftChannel);
        vuMeterContainer.appendChild(vuRightChannel);
        vuSection.appendChild(vuMeterContainer);
        content.appendChild(vuSection);

        // Playback Section
        const playbackSection = createSection('Playback');
        playbackSection.appendChild(createControl('Pitch', 'pitch', '-12', '12', '0', '1', '0'));
        playbackSection.appendChild(createControl('Speed', 'speed', '0.25', '2.0', '1.0', '0.05', '1.0x'));
        playbackSection.appendChild(createControl('Volume', 'volume', '0', '2', '1', '0.1', '100%'));
        content.appendChild(playbackSection);

        // EQ Section
        const eqSection = createSection('Equalizer');
        eqSection.appendChild(createControl('Bass', 'bass', '-1', '1', '0', '0.1', '0'));
        eqSection.appendChild(createControl('Mid', 'mid', '-1', '1', '0', '0.1', '0'));
        eqSection.appendChild(createControl('Treble', 'treble', '-1', '1', '0', '0.1', '0'));
        eqSection.appendChild(createControl('Pan (L/R)', 'pan', '-1', '1', '0', '0.1', 'Center'));
        content.appendChild(eqSection);

        // Effects Section
        const effectsSection = createSection('Effects');
        effectsSection.appendChild(createControl('Distortion', 'distortion', '0', '1', '0', '0.01', '0%'));
        effectsSection.appendChild(createControl('Delay Time', 'delay', '0', '2', '0', '0.01', '0s'));
        effectsSection.appendChild(createControl('Delay Feedback', 'feedback', '0', '0.9', '0', '0.1', '0%'));
        effectsSection.appendChild(createControl('Bitcrusher', 'bitcrusher', '0', '1', '0', '0.01', '0%'));
        content.appendChild(effectsSection);

        // Modulation Effects Section
        const modulationSection = createSection('Modulation Effects');
        modulationSection.appendChild(createControl('Chorus', 'chorus', '0', '1', '0', '0.01', '0%'));
        modulationSection.appendChild(createControl('Flanger', 'flanger', '0', '1', '0', '0.01', '0%'));
        modulationSection.appendChild(createControl('Phaser', 'phaser', '0', '1', '0', '0.01', '0%'));
        modulationSection.appendChild(createControl('Tremolo', 'tremolo', '0', '1', '0', '0.01', '0%'));
        modulationSection.appendChild(createControl('Auto-Wah', 'autowah', '0', '1', '0', '0.01', '0%'));
        modulationSection.appendChild(createControl('Ring Mod', 'ringmod', '0', '1', '0', '0.01', '0%'));
        content.appendChild(modulationSection);

        // Spatial Audio Section
        const spatialSection = createSection('Spatial Audio');
        spatialSection.appendChild(createControl('Stereo Width', 'stereowidth', '-1', '1', '0', '0.1', 'Normal'));
        spatialSection.appendChild(createControl('Haas Effect', 'haas', '0', '1', '0', '0.01', '0ms'));
        content.appendChild(spatialSection);

        // Crossfade Section
        const crossfadeSection = createSection('Crossfade');

        // Crossfade toggle
        const crossfadeToggle = document.createElement('div');
        crossfadeToggle.className = 'dj-control';
        const crossfadeLabel = document.createElement('label');
        crossfadeLabel.style.display = 'flex';
        crossfadeLabel.style.alignItems = 'center';
        crossfadeLabel.style.gap = '10px';
        crossfadeLabel.style.cursor = 'pointer';
        const crossfadeCheckbox = document.createElement('input');
        crossfadeCheckbox.type = 'checkbox';
        crossfadeCheckbox.id = 'crossfade-toggle';
        crossfadeCheckbox.style.width = '18px';
        crossfadeCheckbox.style.height = '18px';
        crossfadeCheckbox.style.cursor = 'pointer';
        const crossfadeText = document.createElement('span');
        crossfadeText.textContent = 'Enable Crossfade';
        crossfadeText.style.fontSize = '12px';
        crossfadeLabel.appendChild(crossfadeCheckbox);
        crossfadeLabel.appendChild(crossfadeText);
        crossfadeToggle.appendChild(crossfadeLabel);

        crossfadeSection.appendChild(crossfadeToggle);
        crossfadeSection.appendChild(createControl('Crossfade Duration', 'crossfade', '1', '10', '3', '0.5', '3.0s'));
        content.appendChild(crossfadeSection);

        // Create preset buttons
        const presetsSection = createSection('Presets');
        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = 'grid';
        buttonsDiv.style.gridTemplateColumns = 'repeat(auto-fit, minmax(80px, 1fr))';
        buttonsDiv.style.gap = '8px';

        const presetButtons = [
            { id: 'reset-button', text: 'Reset', preset: null },
            { id: 'dance-button', text: 'Dance', preset: 'dance' },
            { id: 'rock-button', text: 'Rock', preset: 'rock' },
            { id: 'bassboost-button', text: 'Bass Boost', preset: 'bassBoost' },
            { id: 'jazz-button', text: 'Jazz', preset: 'jazz' },
            { id: 'electronic-button', text: 'Electronic', preset: 'electronic' },
            { id: 'hiphop-button', text: 'Hip-Hop', preset: 'hiphop' },
            { id: 'classical-button', text: 'Classical', preset: 'classical' },
            { id: 'vocal-button', text: 'Vocal', preset: 'vocal' }
        ];

        presetButtons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'dj-button';
            button.id = btn.id;
            button.textContent = btn.text;
            button.dataset.preset = btn.preset;
            buttonsDiv.appendChild(button);
        });

        presetsSection.appendChild(buttonsDiv);
        content.appendChild(presetsSection);

        // Assemble panel
        panel.appendChild(header);
        panel.appendChild(content);
        document.body.appendChild(panel);

        console.log('YouTube Music DJ Pro: Panel created and added to page');
        console.log('YouTube Music DJ Pro: Panel element:', panel);
        console.log('YouTube Music DJ Pro: Panel has minimized class:', panel.classList.contains('minimized'));
        console.log('YouTube Music DJ Pro: Panel computed style:', window.getComputedStyle(panel).transform);

        return panel;
    }

    // Start visualizations
    function startVisualizations() {
        const visualizerCanvas = document.getElementById('visualizer-canvas');
        const waveformCanvas = document.getElementById('waveform-canvas');
        
        if (!visualizerCanvas || !waveformCanvas) {
            console.error('YouTube Music DJ Pro: Canvas elements not found');
            return;
        }
        
        const visCtx = visualizerCanvas.getContext('2d');
        const waveCtx = waveformCanvas.getContext('2d');

        if (!analyserNode) {
            console.error('YouTube Music DJ Pro: Analyser node not initialized');
            return;
        }

        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const waveArray = new Uint8Array(bufferLength);

        function drawVisualizer() {
            animationFrameId = requestAnimationFrame(drawVisualizer);

            analyserNode.getByteFrequencyData(dataArray);
            analyserNode.getByteTimeDomainData(waveArray);

            // Draw based on mode
            if (visualizerMode === 'radial') {
                drawRadialVisualizer();
            } else {
                drawBarsVisualizer();
            }

            drawWaveform();
            updateVUMeters();
            updateBPM();
        }

        function drawBarsVisualizer() {
            // Frequency spectrum with improved visuals
            // Create gradient background
            const gradient = visCtx.createLinearGradient(0, 0, 0, visualizerCanvas.height);
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
            gradient.addColorStop(1, 'rgba(20, 0, 0, 0.9)');
            visCtx.fillStyle = gradient;
            visCtx.fillRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);

            const barWidth = (visualizerCanvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * visualizerCanvas.height;

                // Enhanced color scheme with glow effect
                const hue = (i / bufferLength) * 60; // 0-60 (red to yellow)
                const saturation = 100;
                const lightness = 40 + (barHeight / visualizerCanvas.height) * 30;

                // Draw bar with gradient
                const barGradient = visCtx.createLinearGradient(0, visualizerCanvas.height - barHeight, 0, visualizerCanvas.height);
                barGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness + 20}%, 0.9)`);
                barGradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.9)`);

                visCtx.fillStyle = barGradient;
                visCtx.fillRect(x, visualizerCanvas.height - barHeight, barWidth, barHeight);

                // Add glow effect for high frequencies
                if (barHeight > visualizerCanvas.height * 0.5) {
                    visCtx.shadowBlur = 10;
                    visCtx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`;
                    visCtx.fillRect(x, visualizerCanvas.height - barHeight, barWidth, barHeight);
                    visCtx.shadowBlur = 0;
                }

                x += barWidth + 1;
            }
        }

        function drawRadialVisualizer() {
            const radialCanvas = document.getElementById('radial-canvas');
            if (!radialCanvas) return;
            const radialCtx = radialCanvas.getContext('2d');

            // Clear with gradient
            const gradient = radialCtx.createRadialGradient(
                radialCanvas.width / 2, radialCanvas.height / 2, 0,
                radialCanvas.width / 2, radialCanvas.height / 2, radialCanvas.width / 2
            );
            gradient.addColorStop(0, 'rgba(20, 0, 0, 0.9)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
            radialCtx.fillStyle = gradient;
            radialCtx.fillRect(0, 0, radialCanvas.width, radialCanvas.height);

            const centerX = radialCanvas.width / 2;
            const centerY = radialCanvas.height / 2;
            const radius = Math.min(centerX, centerY) - 20;
            const bars = 128;

            for (let i = 0; i < bars; i++) {
                const angle = (i / bars) * Math.PI * 2;
                const dataIndex = Math.floor((i / bars) * bufferLength);
                const barHeight = (dataArray[dataIndex] / 255) * radius * 0.7;

                const hue = (i / bars) * 360;
                const saturation = 100;
                const lightness = 40 + (barHeight / radius) * 30;

                radialCtx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.9)`;
                radialCtx.lineWidth = 3;
                radialCtx.shadowBlur = 10;
                radialCtx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`;

                radialCtx.beginPath();
                radialCtx.moveTo(
                    centerX + Math.cos(angle) * (radius - barHeight),
                    centerY + Math.sin(angle) * (radius - barHeight)
                );
                radialCtx.lineTo(
                    centerX + Math.cos(angle) * radius,
                    centerY + Math.sin(angle) * radius
                );
                radialCtx.stroke();
            }

            radialCtx.shadowBlur = 0;

            // Draw center circle
            radialCtx.beginPath();
            radialCtx.arc(centerX, centerY, 30, 0, Math.PI * 2);
            radialCtx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            radialCtx.fill();
            radialCtx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
            radialCtx.lineWidth = 2;
            radialCtx.stroke();
        }

        function drawWaveform() {
            // Waveform with improved visuals
            const waveGradient = waveCtx.createLinearGradient(0, 0, 0, waveformCanvas.height);
            waveGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
            waveGradient.addColorStop(1, 'rgba(20, 0, 0, 0.9)');
            waveCtx.fillStyle = waveGradient;
            waveCtx.fillRect(0, 0, waveformCanvas.width, waveformCanvas.height);

            // Draw center line
            waveCtx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
            waveCtx.lineWidth = 1;
            waveCtx.beginPath();
            waveCtx.moveTo(0, waveformCanvas.height / 2);
            waveCtx.lineTo(waveformCanvas.width, waveformCanvas.height / 2);
            waveCtx.stroke();

            // Draw waveform with glow
            waveCtx.lineWidth = 2;
            waveCtx.strokeStyle = '#ff0000';
            waveCtx.shadowBlur = 8;
            waveCtx.shadowColor = 'rgba(255, 0, 0, 0.5)';
            waveCtx.beginPath();

            const sliceWidth = waveformCanvas.width / bufferLength;
            let wx = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = waveArray[i] / 128.0;
                const y = (v * waveformCanvas.height) / 2;

                if (i === 0) {
                    waveCtx.moveTo(wx, y);
                } else {
                    waveCtx.lineTo(wx, y);
                }

                wx += sliceWidth;
            }

            waveCtx.lineTo(waveformCanvas.width, waveformCanvas.height / 2);
            waveCtx.stroke();
            waveCtx.shadowBlur = 0;
        }

        function updateVUMeters() {
            // VU Meters
            const vuLeft = document.getElementById('vu-left');
            const vuRight = document.getElementById('vu-right');

            if (!vuLeft || !vuRight) return;

            let sumL = 0;
            let sumR = 0;
            for (let i = 0; i < bufferLength / 2; i++) {
                sumL += dataArray[i];
            }
            for (let i = bufferLength / 2; i < bufferLength; i++) {
                sumR += dataArray[i];
            }

            const avgL = (sumL / (bufferLength / 2)) / 255;
            const avgR = (sumR / (bufferLength / 2)) / 255;

            vuLeft.style.height = `${avgL * 100}%`;
            vuRight.style.height = `${avgR * 100}%`;
        }

        function updateBPM() {
            // BPM Detection (every 2 seconds)
            if (Math.random() < 0.01) {
                const bpm = detectBPM();
                if (bpm > 0) {
                    const bpmEl = document.getElementById('bpm-value');
                    if (bpmEl) {
                        bpmEl.textContent = bpm;
                        djState.bpm = bpm;
                    }
                }
            }
        }

        drawVisualizer();
    }

    // Attach event listeners
    function attachEventListeners(videoElement) {
        const panel = document.getElementById('ytm-dj-panel');
        const toggleBtn = document.getElementById('ytm-dj-toggle-btn');

        console.log('YouTube Music DJ Pro: Attaching event listeners');
        console.log('YouTube Music DJ Pro: Panel found:', !!panel);
        console.log('YouTube Music DJ Pro: Toggle button found:', !!toggleBtn);

        // Toggle panel visibility
        if (toggleBtn && panel) {
            toggleBtn.addEventListener('click', () => {
                console.log('YouTube Music DJ Pro: Toggle button clicked!');
                const wasMinimized = panel.classList.contains('minimized');
                panel.classList.toggle('minimized');
                const isMinimized = panel.classList.contains('minimized');
                toggleBtn.textContent = isMinimized ? '🎧' : '▽';
                toggleBtn.title = isMinimized ? 'Open DJ Controls' : 'Close DJ Controls';
                console.log('YouTube Music DJ Pro: Panel toggled from', wasMinimized, 'to', isMinimized);
                console.log('YouTube Music DJ Pro: Panel classes:', panel.className);
                console.log('YouTube Music DJ Pro: Panel transform:', window.getComputedStyle(panel).transform);
                console.log('YouTube Music DJ Pro: Panel bottom:', window.getComputedStyle(panel).bottom);
            });
            console.log('YouTube Music DJ Pro: Click listener attached successfully');
        } else {
            console.error('YouTube Music DJ Pro: Toggle button or panel not found!');
            console.error('YouTube Music DJ Pro: Panel:', panel);
            console.error('YouTube Music DJ Pro: Toggle button:', toggleBtn);
        }

        // Pitch control
        const pitchSlider = document.getElementById('pitch-slider');
        const pitchValue = document.getElementById('pitch-value');
        if (pitchSlider && pitchValue) {
            pitchSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                djState.pitch = value;
                pitchValue.textContent = value > 0 ? `+${value}` : value;
                applyPitch(videoElement, value);
            });
        }

        // Speed control
        const speedSlider = document.getElementById('speed-slider');
        const speedValue = document.getElementById('speed-value');
        if (speedSlider && speedValue) {
            speedSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.speed = value;
                speedValue.textContent = `${value.toFixed(2)}x`;
                applySpeed(videoElement, value);
            });
        }

        // Volume control
        const volumeSlider = document.getElementById('volume-slider');
        const volumeValue = document.getElementById('volume-value');
        if (volumeSlider && volumeValue) {
            volumeSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.volume = value;
                volumeValue.textContent = `${Math.round(value * 100)}%`;
                applyVolume(value);
            });
        }

        // Bass control
        const bassSlider = document.getElementById('bass-slider');
        const bassValue = document.getElementById('bass-value');
        if (bassSlider && bassValue) {
            bassSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.bass = value;
                bassValue.textContent = value.toFixed(1);
                applyEQ('bass', value);
            });
        }

        // Mid control
        const midSlider = document.getElementById('mid-slider');
        const midValue = document.getElementById('mid-value');
        if (midSlider && midValue) {
            midSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.mid = value;
                midValue.textContent = value.toFixed(1);
                applyEQ('mid', value);
            });
        }

        // Treble control
        const trebleSlider = document.getElementById('treble-slider');
        const trebleValue = document.getElementById('treble-value');
        if (trebleSlider && trebleValue) {
            trebleSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.treble = value;
                trebleValue.textContent = value.toFixed(1);
                applyEQ('treble', value);
            });
        }

        // Pan control
        const panSlider = document.getElementById('pan-slider');
        const panValue = document.getElementById('pan-value');
        if (panSlider && panValue) {
            panSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.pan = value;
                if (value < -0.3) panValue.textContent = 'Left';
                else if (value > 0.3) panValue.textContent = 'Right';
                else panValue.textContent = 'Center';
                applyPan(value);
            });
        }

        // Distortion control
        const distortionSlider = document.getElementById('distortion-slider');
        const distortionValue = document.getElementById('distortion-value');
        if (distortionSlider && distortionValue) {
            distortionSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.distortion = value;
                distortionValue.textContent = `${Math.round(value * 100)}%`;
                applyDistortion(value);
            });
        }

        // Delay control
        const delaySlider = document.getElementById('delay-slider');
        const delayValue = document.getElementById('delay-value');
        if (delaySlider && delayValue) {
            delaySlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.delay = value;
                delayValue.textContent = `${value.toFixed(2)}s`;
                applyDelay(value, djState.delayFeedback);
            });
        }

        // Delay Feedback control
        const feedbackSlider = document.getElementById('feedback-slider');
        const feedbackValue = document.getElementById('feedback-value');
        if (feedbackSlider && feedbackValue) {
            feedbackSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.delayFeedback = value;
                feedbackValue.textContent = `${Math.round(value * 100)}%`;
                applyDelay(djState.delay, value);
            });
        }

        // Bitcrusher control
        const bitcrusherSlider = document.getElementById('bitcrusher-slider');
        const bitcrusherValue = document.getElementById('bitcrusher-value');
        if (bitcrusherSlider && bitcrusherValue) {
            bitcrusherSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.bitcrusher = value;
                bitcrusherValue.textContent = `${Math.round(value * 100)}%`;
                applyBitcrusher(value);
            });
        }

        // Chorus control
        const chorusSlider = document.getElementById('chorus-slider');
        const chorusValue = document.getElementById('chorus-value');
        if (chorusSlider && chorusValue) {
            chorusSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.chorus = value;
                chorusValue.textContent = `${Math.round(value * 100)}%`;
                applyChorus(value);
            });
        }

        // Flanger control
        const flangerSlider = document.getElementById('flanger-slider');
        const flangerValue = document.getElementById('flanger-value');
        if (flangerSlider && flangerValue) {
            flangerSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.flanger = value;
                flangerValue.textContent = `${Math.round(value * 100)}%`;
                applyFlanger(value);
            });
        }

        // Phaser control
        const phaserSlider = document.getElementById('phaser-slider');
        const phaserValue = document.getElementById('phaser-value');
        if (phaserSlider && phaserValue) {
            phaserSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.phaser = value;
                phaserValue.textContent = `${Math.round(value * 100)}%`;
                applyPhaser(value);
            });
        }

        // Tremolo control
        const tremoloSlider = document.getElementById('tremolo-slider');
        const tremoloValue = document.getElementById('tremolo-value');
        if (tremoloSlider && tremoloValue) {
            tremoloSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.tremolo = value;
                tremoloValue.textContent = `${Math.round(value * 100)}%`;
                applyTremolo(value);
            });
        }

        // Auto-Wah control
        const autowahSlider = document.getElementById('autowah-slider');
        const autowahValue = document.getElementById('autowah-value');
        if (autowahSlider && autowahValue) {
            autowahSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.autoWah = value;
                autowahValue.textContent = `${Math.round(value * 100)}%`;
                applyAutoWah(value);
            });
        }

        // Ring Mod control
        const ringmodSlider = document.getElementById('ringmod-slider');
        const ringmodValue = document.getElementById('ringmod-value');
        if (ringmodSlider && ringmodValue) {
            ringmodSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.ringMod = value;
                ringmodValue.textContent = `${Math.round(value * 100)}%`;
                applyRingMod(value);
            });
        }

        // Stereo Width control
        const stereowidthSlider = document.getElementById('stereowidth-slider');
        const stereowidthValue = document.getElementById('stereowidth-value');
        if (stereowidthSlider && stereowidthValue) {
            stereowidthSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.stereoWidth = value;
                if (value < -0.3) stereowidthValue.textContent = 'Mono';
                else if (value > 0.3) stereowidthValue.textContent = 'Wide';
                else stereowidthValue.textContent = 'Normal';
                applyStereoWidth(value);
            });
        }

        // Haas Effect control
        const haasSlider = document.getElementById('haas-slider');
        const haasValue = document.getElementById('haas-value');
        if (haasSlider && haasValue) {
            haasSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.haasEffect = value;
                haasValue.textContent = `${Math.round(value * 30)}ms`;
                applyHaasEffect(value);
            });
        }

        // Crossfade toggle
        const crossfadeCheckbox = document.getElementById('crossfade-toggle');
        if (crossfadeCheckbox) {
            crossfadeCheckbox.addEventListener('change', (e) => {
                djState.crossfadeEnabled = e.target.checked;
                if (djState.crossfadeEnabled) {
                    enableCrossfade();
                }
            });
        }

        // Crossfade duration
        const crossfadeSlider = document.getElementById('crossfade-slider');
        const crossfadeValue = document.getElementById('crossfade-value');
        if (crossfadeSlider && crossfadeValue) {
            crossfadeSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                djState.crossfadeDuration = value;
                crossfadeValue.textContent = `${value.toFixed(1)}s`;
            });
        }

        // Preset buttons
        document.querySelectorAll('.dj-button[data-preset]').forEach(button => {
            button.addEventListener('click', () => {
                const preset = button.dataset.preset;
                if (preset === 'null' || !preset) {
                    resetAllControls(videoElement);
                } else {
                    applyPreset(preset);
                }
            });
        });

        // Visualizer mode toggle
        const vizBarsBtn = document.getElementById('viz-bars');
        const vizRadialBtn = document.getElementById('viz-radial');
        
        if (vizBarsBtn && vizRadialBtn) {
            vizBarsBtn.addEventListener('click', () => {
                visualizerMode = 'bars';
                vizBarsBtn.style.background = 'rgba(255, 0, 0, 0.8)';
                vizRadialBtn.style.background = 'rgba(255, 0, 0, 0.3)';
                document.getElementById('visualizer-canvas').style.display = 'block';
                const radialCanvas = document.getElementById('radial-canvas');
                if (radialCanvas) radialCanvas.style.display = 'none';
            });
            
            vizRadialBtn.addEventListener('click', () => {
                visualizerMode = 'radial';
                vizRadialBtn.style.background = 'rgba(255, 0, 0, 0.8)';
                vizBarsBtn.style.background = 'rgba(255, 0, 0, 0.3)';
                document.getElementById('visualizer-canvas').style.display = 'none';
                const radialCanvas = document.getElementById('radial-canvas');
                if (radialCanvas) radialCanvas.style.display = 'block';
            });
        }

        // Start visualizations
        startVisualizations();
    }

    // Reset all controls
    function resetAllControls(videoElement) {
        djState.pitch = 0;
        djState.speed = 1.0;
        djState.volume = 1.0;
        djState.bass = 0;
        djState.mid = 0;
        djState.treble = 0;
        djState.pan = 0;
        djState.distortion = 0;
        djState.delay = 0;
        djState.delayFeedback = 0;
        djState.phaser = 0;
        djState.chorus = 0;
        djState.flanger = 0;
        djState.tremolo = 0;
        djState.autoWah = 0;
        djState.ringMod = 0;
        djState.bitcrusher = 0;
        djState.stereoWidth = 0;
        djState.haasEffect = 0;

        const pitchSlider = document.getElementById('pitch-slider');
        const pitchValue = document.getElementById('pitch-value');
        if (pitchSlider) pitchSlider.value = 0;
        if (pitchValue) pitchValue.textContent = '0';
        
        const speedSlider = document.getElementById('speed-slider');
        const speedValue = document.getElementById('speed-value');
        if (speedSlider) speedSlider.value = 1.0;
        if (speedValue) speedValue.textContent = '1.0x';
        
        const volumeSlider = document.getElementById('volume-slider');
        const volumeValue = document.getElementById('volume-value');
        if (volumeSlider) volumeSlider.value = 1.0;
        if (volumeValue) volumeValue.textContent = '100%';
        
        const bassSlider = document.getElementById('bass-slider');
        const bassValue = document.getElementById('bass-value');
        if (bassSlider) bassSlider.value = 0;
        if (bassValue) bassValue.textContent = '0';
        
        const midSlider = document.getElementById('mid-slider');
        const midValue = document.getElementById('mid-value');
        if (midSlider) midSlider.value = 0;
        if (midValue) midValue.textContent = '0';
        
        const trebleSlider = document.getElementById('treble-slider');
        const trebleValue = document.getElementById('treble-value');
        if (trebleSlider) trebleSlider.value = 0;
        if (trebleValue) trebleValue.textContent = '0';
        
        const panSlider = document.getElementById('pan-slider');
        const panValue = document.getElementById('pan-value');
        if (panSlider) panSlider.value = 0;
        if (panValue) panValue.textContent = 'Center';
        
        const distortionSlider = document.getElementById('distortion-slider');
        const distortionValue = document.getElementById('distortion-value');
        if (distortionSlider) distortionSlider.value = 0;
        if (distortionValue) distortionValue.textContent = '0%';
        
        const delaySlider = document.getElementById('delay-slider');
        const delayValue = document.getElementById('delay-value');
        if (delaySlider) delaySlider.value = 0;
        if (delayValue) delayValue.textContent = '0s';
        
        const feedbackSlider = document.getElementById('feedback-slider');
        const feedbackValue = document.getElementById('feedback-value');
        if (feedbackSlider) feedbackSlider.value = 0;
        if (feedbackValue) feedbackValue.textContent = '0%';
        
        const bitcrusherSlider = document.getElementById('bitcrusher-slider');
        const bitcrusherValue = document.getElementById('bitcrusher-value');
        if (bitcrusherSlider) bitcrusherSlider.value = 0;
        if (bitcrusherValue) bitcrusherValue.textContent = '0%';

        const chorusSlider = document.getElementById('chorus-slider');
        const chorusValue = document.getElementById('chorus-value');
        if (chorusSlider) chorusSlider.value = 0;
        if (chorusValue) chorusValue.textContent = '0%';

        const flangerSlider = document.getElementById('flanger-slider');
        const flangerValue = document.getElementById('flanger-value');
        if (flangerSlider) flangerSlider.value = 0;
        if (flangerValue) flangerValue.textContent = '0%';

        const phaserSlider = document.getElementById('phaser-slider');
        const phaserValue = document.getElementById('phaser-value');
        if (phaserSlider) phaserSlider.value = 0;
        if (phaserValue) phaserValue.textContent = '0%';

        const tremoloSlider = document.getElementById('tremolo-slider');
        const tremoloValue = document.getElementById('tremolo-value');
        if (tremoloSlider) tremoloSlider.value = 0;
        if (tremoloValue) tremoloValue.textContent = '0%';

        const autowahSlider = document.getElementById('autowah-slider');
        const autowahValue = document.getElementById('autowah-value');
        if (autowahSlider) autowahSlider.value = 0;
        if (autowahValue) autowahValue.textContent = '0%';

        const ringmodSlider = document.getElementById('ringmod-slider');
        const ringmodValue = document.getElementById('ringmod-value');
        if (ringmodSlider) ringmodSlider.value = 0;
        if (ringmodValue) ringmodValue.textContent = '0%';

        const stereowidthSlider = document.getElementById('stereowidth-slider');
        const stereowidthValue = document.getElementById('stereowidth-value');
        if (stereowidthSlider) stereowidthSlider.value = 0;
        if (stereowidthValue) stereowidthValue.textContent = 'Normal';

        const haasSlider = document.getElementById('haas-slider');
        const haasValue = document.getElementById('haas-value');
        if (haasSlider) haasSlider.value = 0;
        if (haasValue) haasValue.textContent = '0ms';

        applyPitch(videoElement, 0);
        applySpeed(videoElement, 1.0);
        applyVolume(1.0);
        applyEQ('bass', 0);
        applyEQ('mid', 0);
        applyEQ('treble', 0);
        applyPan(0);
        applyDistortion(0);
        applyDelay(0, 0);
        applyBitcrusher(0);
        applyChorus(0);
        applyFlanger(0);
        applyPhaser(0);
        applyTremolo(0);
        applyAutoWah(0);
        applyRingMod(0);
        applyStereoWidth(0);
        applyHaasEffect(0);
    }



    // Reapply all current settings (called when track changes)
    function reapplyAllSettings(videoElement) {
        if (!isInitialized || !videoElement) {
            console.log('YouTube Music DJ Pro: Cannot reapply - not initialized or no video element');
            return;
        }
        
        console.log('YouTube Music DJ Pro: Reapplying settings to new track...');
        console.log('Current djState:', {
            pitch: djState.pitch,
            speed: djState.speed,
            volume: djState.volume,
            bass: djState.bass,
            mid: djState.mid,
            treble: djState.treble,
            distortion: djState.distortion
        });
        
        // Reapply playback settings
        applyPitch(videoElement, djState.pitch);
        applySpeed(videoElement, djState.speed);
        applyVolume(djState.volume);
        
        // Reapply EQ
        applyEQ('bass', djState.bass);
        applyEQ('mid', djState.mid);
        applyEQ('treble', djState.treble);
        
        // Reapply effects
        applyPan(djState.pan);
        applyDistortion(djState.distortion);
        applyDelay(djState.delay, djState.delayFeedback);
        applyBitcrusher(djState.bitcrusher);
        
        // Reapply modulation effects
        applyChorus(djState.chorus);
        applyFlanger(djState.flanger);
        applyPhaser(djState.phaser);
        applyTremolo(djState.tremolo);
        applyAutoWah(djState.autoWah);
        applyRingMod(djState.ringMod);
        
        // Reapply spatial audio
        applyStereoWidth(djState.stereoWidth);
        applyHaasEffect(djState.haasEffect);
        
        console.log('YouTube Music DJ Pro: ✅ Settings reapplied successfully');
    }

    // Monitor track changes and reapply settings
    function monitorTrackChanges(videoElement) {
        let lastSrc = videoElement.currentSrc || videoElement.src;
        let lastTime = videoElement.currentTime;
        let lastTitle = document.title;
        
        console.log('YouTube Music DJ Pro: Starting track change monitor...');
        
        // Method 1: Listen to video events
        videoElement.addEventListener('loadeddata', () => {
            console.log('YouTube Music DJ Pro: New track loaded (loadeddata event)');
            setTimeout(() => {
                reapplyAllSettings(videoElement);
            }, 300);
        });
        
        videoElement.addEventListener('play', () => {
            const currentSrc = videoElement.currentSrc || videoElement.src;
            if (currentSrc !== lastSrc) {
                console.log('YouTube Music DJ Pro: New track playing (play event)');
                lastSrc = currentSrc;
                setTimeout(() => {
                    reapplyAllSettings(videoElement);
                }, 300);
            }
        });
        
        // Method 2: Monitor title changes (YouTube Music updates title with song name)
        const titleObserver = new MutationObserver(() => {
            const currentTitle = document.title;
            if (currentTitle !== lastTitle && currentTitle !== 'YouTube Music') {
                console.log('YouTube Music DJ Pro: Track changed (title changed):', currentTitle);
                lastTitle = currentTitle;
                setTimeout(() => {
                    reapplyAllSettings(videoElement);
                }, 300);
            }
        });
        
        titleObserver.observe(document.querySelector('title'), {
            childList: true,
            characterData: true,
            subtree: true
        });
        
        // Method 3: Monitor time jumps (when user skips to next track)
        setInterval(() => {
            const currentTime = videoElement.currentTime;
            const currentSrc = videoElement.currentSrc || videoElement.src;
            
            // Detect large time jump (skip) or src change
            if (Math.abs(currentTime - lastTime) > 5 || currentSrc !== lastSrc) {
                if (currentSrc !== lastSrc) {
                    console.log('YouTube Music DJ Pro: Track changed (src changed)');
                    lastSrc = currentSrc;
                    setTimeout(() => {
                        reapplyAllSettings(videoElement);
                    }, 300);
                }
            }
            
            lastTime = currentTime;
        }, 1000);
        
        console.log('YouTube Music DJ Pro: Track change monitor active');
    }

    // Cleanup function to prevent memory leaks
    function cleanup() {
        console.log('YouTube Music DJ Pro: Cleaning up...');
        
        // Cancel animation frame
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        
        // Stop oscillators to prevent audio glitches
        try {
            if (chorusLFO) chorusLFO.stop();
            if (flangerLFO) flangerLFO.stop();
            if (tremoloLFO) tremoloLFO.stop();
            if (autoWahLFO) autoWahLFO.stop();
            if (ringModOsc) ringModOsc.stop();
            if (phaserLFO) phaserLFO.stop();
        } catch (e) {
            // Oscillators may already be stopped
        }
        
        // Close audio context
        if (audioContext && audioContext.state !== 'closed') {
            audioContext.close();
        }
    }

    // Initialize the DJ controller
    async function init() {
        console.log('YouTube Music DJ Pro: Initializing...');

        videoElement = await waitForVideoElement();
        console.log('YouTube Music DJ Pro: Video element found');

        initializeAudioContext(videoElement);
        createDJPanel();
        attachEventListeners(videoElement);
        
        // Start monitoring track changes to reapply settings
        monitorTrackChanges(videoElement);

        console.log('YouTube Music DJ Pro: Ready! 🎧');
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

    // Start when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
