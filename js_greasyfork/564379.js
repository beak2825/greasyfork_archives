// ==UserScript==
// @name         Claude Response Notification (v4)
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Plays a notification sound when Claude finishes generating a response
// @author       Solomon
// @match        https://claude.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         https://claude.ai/favicon.ico
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/564379/Claude%20Response%20Notification%20%28v4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564379/Claude%20Response%20Notification%20%28v4%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // 💾 STATE
    // ═══════════════════════════════════════════════════════════════════════════

    let isGenerating = false;
    let audioContext = null;

    function getSettings() {
        return {
            enabled: GM_getValue('enabled', true),
            volume: GM_getValue('volume', 0.5)
        };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔊 AUDIO - Using HTML5 Audio with data URI (most compatible)
    // ═══════════════════════════════════════════════════════════════════════════

    function playNotificationSound() {
        const settings = getSettings();
        if (!settings.enabled) {
            console.log('🔔 Sound disabled');
            return;
        }

        console.log('🔔 Attempting to play sound...');

        // Method 1: Try HTML5 Audio with a simple beep WAV
        try {
            // This is a tiny valid WAV file - a short beep
            const wavData = createBeepWav(800, 0.15); // 800Hz, 150ms
            const blob = new Blob([wavData], { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);

            const audio = new Audio(url);
            audio.volume = settings.volume;

            audio.play()
                .then(() => {
                    console.log('🔔 Sound played successfully!');
                    showVisualIndicator();
                    // Clean up
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                })
                .catch(e => {
                    console.log('🔔 HTML5 Audio failed, trying Web Audio API...', e);
                    playWebAudioBeep();
                });
        } catch (e) {
            console.log('🔔 WAV creation failed, trying Web Audio API...', e);
            playWebAudioBeep();
        }
    }

    // Create a simple WAV file in memory
    function createBeepWav(frequency, duration) {
        const sampleRate = 44100;
        const numSamples = Math.floor(sampleRate * duration);
        const buffer = new ArrayBuffer(44 + numSamples * 2);
        const view = new DataView(buffer);

        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + numSamples * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true); // fmt chunk size
        view.setUint16(20, 1, true); // PCM format
        view.setUint16(22, 1, true); // mono
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true); // byte rate
        view.setUint16(32, 2, true); // block align
        view.setUint16(34, 16, true); // bits per sample
        writeString(36, 'data');
        view.setUint32(40, numSamples * 2, true);

        // Generate sine wave with envelope
        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            // Envelope: quick attack, longer decay
            const envelope = Math.min(1, i / (sampleRate * 0.01)) * Math.exp(-3 * t / duration);
            const sample = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.8;
            view.setInt16(44 + i * 2, sample * 32767, true);
        }

        return buffer;
    }

    // Fallback: Web Audio API oscillator
    function playWebAudioBeep() {
        const settings = getSettings();

        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Resume if suspended
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            // Volume envelope
            const now = audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(settings.volume, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

            oscillator.start(now);
            oscillator.stop(now + 0.2);

            console.log('🔔 Web Audio beep played!');
            showVisualIndicator();
        } catch (e) {
            console.error('🔔 Web Audio also failed:', e);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 👁️ VISUAL INDICATOR
    // ═══════════════════════════════════════════════════════════════════════════

    function showVisualIndicator() {
        const existing = document.getElementById('claude-notif-bell');
        if (existing) existing.remove();

        const bell = document.createElement('div');
        bell.id = 'claude-notif-bell';
        bell.textContent = '🔔';
        bell.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            box-shadow: 0 4px 20px rgba(245, 158, 11, 0.6);
            z-index: 2147483647;
            animation: bellPop 0.5s ease-out, bellFade 0.5s ease-in 1.5s forwards;
            pointer-events: none;
        `;

        // Add animation styles
        if (!document.getElementById('claude-notif-styles')) {
            const styles = document.createElement('style');
            styles.id = 'claude-notif-styles';
            styles.textContent = `
                @keyframes bellPop {
                    0% { transform: scale(0); opacity: 0; }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes bellFade {
                    to { transform: scale(0.5); opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(bell);
        setTimeout(() => bell.remove(), 2500);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔍 DETECTION - Is Claude generating?
    // ═══════════════════════════════════════════════════════════════════════════

    function isClaudeGenerating() {
        // Check for stop button by aria-label
        const stopBtn = document.querySelector('button[aria-label*="Stop"]');
        if (stopBtn) return true;

        // Check for streaming data attribute
        if (document.querySelector('[data-is-streaming="true"]')) return true;

        // Check all buttons for stop icon (square/rect in SVG)
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
            const svg = btn.querySelector('svg');
            if (svg && svg.querySelector('rect')) {
                // Make sure it's not just any button with rect
                const parent = btn.closest('form');
                if (parent) return true;
            }
        }

        // Check for loading animations
        if (document.querySelector('[class*="animate-pulse"]')) return true;
        if (document.querySelector('[class*="streaming"]')) return true;

        return false;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 MAIN LOOP
    // ═══════════════════════════════════════════════════════════════════════════

    function checkGeneration() {
        const generating = isClaudeGenerating();

        if (generating && !isGenerating) {
            isGenerating = true;
            console.log('🔔 Claude started generating...');
        } else if (!generating && isGenerating) {
            isGenerating = false;
            console.log('🔔 Claude finished generating!');
            playNotificationSound();
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ⚙️ MENU
    // ═══════════════════════════════════════════════════════════════════════════

    GM_registerMenuCommand('🔔 Toggle Sound', () => {
        const enabled = !GM_getValue('enabled', true);
        GM_setValue('enabled', enabled);
        alert(`🔔 Sound: ${enabled ? 'ON ✅' : 'OFF ❌'}`);
    });

    GM_registerMenuCommand('🔊 Set Volume', () => {
        const current = Math.round(GM_getValue('volume', 0.5) * 100);
        const input = prompt('Volume (0-100):', current);
        if (input !== null) {
            GM_setValue('volume', Math.min(1, Math.max(0, parseInt(input) / 100)));
        }
    });

    GM_registerMenuCommand('🎧 TEST SOUND', () => {
        console.log('🔔 Manual test...');
        playNotificationSound();
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 START
    // ═══════════════════════════════════════════════════════════════════════════

    console.log('🔔 Claude Response Notification v4 loaded!');
    setInterval(checkGeneration, 500);

})();