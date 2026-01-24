// ==UserScript==
// @name         Instagram Ultimate Video Controls
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      1.7.5
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Adds video controls to Instagram: seekable progress bar, volume/speed sliders, Picture-in-Picture, fullscreen, and full keyboard shortcuts. Sleek auto-hiding UI that respects native play/pause behavior.
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563904/Instagram%20Ultimate%20Video%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/563904/Instagram%20Ultimate%20Video%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================================================
    // SECTION 1: CONFIGURATION
    // ==========================================================================
    const CONFIG = {
        DEFAULT_VOLUME: 0.5,
        DEFAULT_SPEED: 1,
        DEFAULT_MUTED: true,
        SPEEDS: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4],
        LONG_PRESS_SPEED: 2,
        LONG_PRESS_DELAY: 200,
        SEEK_TIME: 5,
        FRAME_TIME: 1/30,
        UI_HIDE_DELAY: 1000,              // Auto-hide delay in ms (1 second)
        UI_HIDE_WHEN_PAUSED: true,        // Whether to auto-hide UI when video is paused
        DEBOUNCE_DELAY: 300,
        MIN_PANEL_WIDTH_FOR_INLINE: 400,  // Pixels - below this, use stacked layout
        WHEEL_VOLUME_STEP: 0.05,          // Volume change per scroll step
        WHEEL_SPEED_STEP: 1,              // Speed index change per scroll step
        WHEEL_SEEK_STEP: 2,               // Seconds to seek per scroll step
    };

    const ICONS = {
        play: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
        pause: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`,
        volumeHigh: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`,
        volumeMuted: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`,
        fullscreen: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`,
        exitFullscreen: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`,
        pip: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/></svg>`,
        settings: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`,

    };

    // ==========================================================================
    // SECTION 2: STATE MANAGEMENT (Auto-unmute persisted via GM storage)
    // ==========================================================================
    const State = {
        data: null,
        listeners: new Set(),

        init() {
            // Load auto-unmute preference from GM storage
            let autoUnmute = false;
            try {
                if (typeof GM_getValue === 'function') {
                    autoUnmute = GM_getValue('autoUnmute', false);
                }
            } catch (e) {
                console.warn('[IGU] GM_getValue not available:', e);
            }

            this.data = {
                volume: CONFIG.DEFAULT_VOLUME,
                speed: CONFIG.DEFAULT_SPEED,
                muted: autoUnmute ? false : CONFIG.DEFAULT_MUTED,
                autoUnmute: autoUnmute,
            };
            return this;
        },

        get(key) {
            return this.data[key];
        },

        set(key, value) {
            this.data[key] = value;
            this.notify();
        },

        setAutoUnmute(value) {
            this.data.autoUnmute = value;
            try {
                if (typeof GM_setValue === 'function') {
                    GM_setValue('autoUnmute', value);
                }
            } catch (e) {
                console.warn('[IGU] GM_setValue not available:', e);
            }
            if (value) {
                this.data.muted = false;
                this.applyToAll();
            }
            this.notify();
        },

        subscribe(callback) {
            this.listeners.add(callback);
            return () => this.listeners.delete(callback);
        },

        notify() {
            this.listeners.forEach(cb => cb(this.data));
        },

        applyToVideo(video) {
            if (!video) return;
            video.volume = this.data.volume;
            video.playbackRate = this.data.speed;
            // Apply muted state - autoUnmute takes priority
            if (this.data.autoUnmute) {
                video.muted = false;
            } else {
                video.muted = this.data.muted;
            }
        },

        applyToAll() {
            document.querySelectorAll('video').forEach(v => this.applyToVideo(v));
        }
    };

    // ==========================================================================
    // SECTION 3: VOLUME/SPEED PERSISTENCE ENGINE
    // ==========================================================================
    // We no longer override muted property - let Instagram and native buttons work normally.
    // We only apply our volume level when unmuted.
    const AudioEngine = {
        init() {
            // Watch for new videos
            const observer = new MutationObserver(mutations => {
                mutations.forEach(m => {
                    m.addedNodes.forEach(node => {
                        if (node.nodeName === 'VIDEO') {
                            this.setupVideo(node);
                        } else if (node.querySelectorAll) {
                            node.querySelectorAll('video').forEach(v => this.setupVideo(v));
                        }
                    });
                });
            });

            observer.observe(document.documentElement, { childList: true, subtree: true });

            // Setup existing videos
            document.querySelectorAll('video').forEach(v => this.setupVideo(v));
        },

        setupVideo(video) {
            if (video._audioEngineSetup) return;
            video._audioEngineSetup = true;

            // Track user's explicit mute intent - null means no user action yet
            video._userMuteIntent = null;
            // Track if initial auto-unmute setup is complete
            video._autoUnmuteApplied = false;

            // Apply our preferred volume level
            video.volume = State.get('volume');

            // Apply auto-unmute if enabled - only during initial setup
            if (State.get('autoUnmute')) {
                video.muted = false;
                // Instagram often re-mutes after initial load, so re-apply after delays
                // But only if user hasn't manually changed mute state
                const applyAutoUnmute = () => {
                    if (State.get('autoUnmute') && video._userMuteIntent === null) {
                        video.muted = false;
                    }
                };
                setTimeout(applyAutoUnmute, 100);
                setTimeout(applyAutoUnmute, 500);
                setTimeout(() => {
                    video._autoUnmuteApplied = true;
                }, 600);
            } else {
                video._autoUnmuteApplied = true;
            }

            // Listen for volume changes to sync volume level only
            // Muted state is tracked separately via user intent
            video.addEventListener('volumechange', () => {
                // Always sync volume level
                State.data.volume = video.volume;

                // Don't sync muted state from external changes - respect user intent
                // Only update UI to reflect current state
                State.notify();
            });
        },

        // Apply volume to a video
        applyVolume(video, volume) {
            video.volume = volume;
        }
    };

    // ==========================================================================
    // SECTION 4: VIDEO STATE TRACKER (Tracks user intent for PiP)
    // ==========================================================================
    const VideoStateTracker = {
        // Track which videos the user has explicitly paused
        pausedByUser: new WeakSet(),

        markPausedByUser(video) {
            this.pausedByUser.add(video);
        },

        markPlayedByUser(video) {
            this.pausedByUser.delete(video);
        }
    };

    // ==========================================================================
    // SECTION 5: UTILITIES
    // ==========================================================================
    const Utils = {
        formatTime(seconds) {
            if (!seconds || isNaN(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },

        debounce(fn, delay) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => fn(...args), delay);
            };
        },

        clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        },

        getClosestVideo() {
            let closest = null;
            let minDistance = Infinity;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            document.querySelectorAll('video').forEach(video => {
                const rect = video.getBoundingClientRect();
                if (rect.width < 50 || rect.height < 50) return;

                const vidCenterX = rect.left + rect.width / 2;
                const vidCenterY = rect.top + rect.height / 2;
                const distance = Math.hypot(centerX - vidCenterX, centerY - vidCenterY);

                if (distance < minDistance) {
                    minDistance = distance;
                    closest = video;
                }
            });

            return closest;
        },

        isInputFocused() {
            const active = document.activeElement;
            return active && (
                active.tagName === 'INPUT' ||
                active.tagName === 'TEXTAREA' ||
                active.isContentEditable ||
                active.contentEditable === 'true'
            );
        }
    };

    // ==========================================================================
    // SECTION 6: STYLES
    // ==========================================================================
    const Styles = {
        inject() {
            if (document.getElementById('ig-ultimate-styles')) return;

            const css = document.createElement('style');
            css.id = 'ig-ultimate-styles';
            css.textContent = `
                /* Main Control Panel - overlay at bottom of video, compact */
                .igu-panel {
                    position: absolute !important;
                    bottom: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    background: linear-gradient(transparent 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.9) 100%) !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    opacity: 0 !important;
                    transition: opacity 0.2s ease !important;
                    z-index: 2147483647 !important;
                    pointer-events: none !important;
                }

                .igu-wrapper.ui-visible .igu-panel {
                    opacity: 1 !important;
                    pointer-events: auto !important;
                }

                .igu-controls {
                    display: flex;
                    align-items: center;
                    gap: 0;
                    min-height: 32px;
                    padding: 0;
                    margin: 0 !important;
                }

                /* Buttons - edge-to-edge, no radius */
                .igu-btn {
                    all: unset;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: white;
                    border-radius: 0;
                    transition: background 0.15s;
                    flex-shrink: 0;
                }

                .igu-btn:hover {
                    background: rgba(255,255,255,0.2);
                }

                .igu-btn:active {
                    background: rgba(255,255,255,0.3);
                }

                .igu-btn svg {
                    width: 18px;
                    height: 18px;
                }

                /* Timeline / Progress Bar - full width, same height as buttons */
                .igu-timeline {
                    flex: 1;
                    height: 32px;
                    display: flex;
                    align-items: stretch;
                    cursor: pointer;
                    position: relative;
                    margin: 0 !important;
                    padding: 0 !important;
                }

                .igu-timeline-track {
                    width: 100%;
                    height: 100%;
                    background: rgba(255,255,255,0.25);
                    border-radius: 0;
                    overflow: hidden;
                    position: relative;
                }

                .igu-timeline-progress {
                    height: 100%;
                    background: linear-gradient(90deg, #0095f6, #00d4ff);
                    border-radius: 0;
                    width: 0%;
                    position: absolute;
                    top: 0;
                    left: 0;
                }

                /* Stacked mode: progress bar spans full width edge-to-edge, same height */
                .igu-panel.stacked .igu-timeline {
                    height: 32px;
                }

                .igu-timeline-thumb {
                    position: absolute;
                    right: -6px;
                    top: 50%;
                    transform: translateY(-50%) scale(0);
                    width: 12px;
                    height: 12px;
                    background: white;
                    border-radius: 50%;
                    box-shadow: 0 0 4px rgba(0,0,0,0.5);
                    transition: transform 0.15s;
                    z-index: 2;
                }

                .igu-timeline:hover .igu-timeline-thumb {
                    transform: translateY(-50%) scale(1);
                }

                .igu-timeline-tooltip {
                    position: absolute;
                    bottom: 100%;
                    background: rgba(0,0,0,0.9);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 0;
                    font-size: 12px;
                    font-family: monospace;
                    transform: translateX(-50%);
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.15s;
                    margin-bottom: 2px;
                    white-space: nowrap;
                }

                .igu-timeline:hover .igu-timeline-tooltip {
                    opacity: 1;
                }

                /* Time labels inside progress bar - perfectly centered */
                .igu-time-current,
                .igu-time-duration {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    color: white;
                    font-size: 10px;
                    font-family: monospace;
                    line-height: 1;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
                    pointer-events: none;
                    user-select: none;
                    z-index: 3;
                    padding: 0 5px;
                }

                .igu-time-current {
                    left: 0;
                }

                .igu-time-duration {
                    right: 0;
                }

                /* Volume Control */
                .igu-volume-wrap {
                    display: flex;
                    align-items: center;
                    position: relative;
                }

                .igu-slider-popup {
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.95);
                    border-radius: 0;
                    padding: 6px 4px;
                    margin-bottom: 0;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.15s, visibility 0.15s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    width: 32px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                    z-index: 2147483650;
                }

                .igu-volume-wrap:hover .igu-slider-popup,
                .igu-speed-wrap:hover .igu-slider-popup {
                    opacity: 1;
                    visibility: visible;
                }

                .igu-slider-value {
                    color: white;
                    font-size: 9px;
                    font-weight: bold;
                    font-family: monospace;
                    white-space: nowrap;
                }

                /* Auto-unmute checkbox */
                .igu-auto-unmute-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 6px 4px;
                    cursor: pointer;
                    position: relative;
                    border-bottom: 1px solid rgba(255,255,255,0.2);
                    margin-bottom: 4px;
                }

                .igu-auto-unmute-checkbox {
                    width: 14px;
                    height: 14px;
                    cursor: pointer;
                    accent-color: #0095f6;
                    margin: 0;
                }

                /* Custom tooltip system - appears above elements */
                .igu-tooltip {
                    position: fixed;
                    background: rgba(0,0,0,0.95);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    white-space: nowrap;
                    pointer-events: none;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.15s, visibility 0.15s;
                    z-index: 2147483650;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                }

                .igu-tooltip.visible {
                    opacity: 1;
                    visibility: visible;
                }

                .igu-tooltip::after {
                    content: '';
                    position: absolute;
                    border: 5px solid transparent;
                }

                .igu-tooltip.arrow-bottom::after {
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border-top-color: rgba(0,0,0,0.95);
                }

                .igu-tooltip.arrow-left::after {
                    top: 50%;
                    right: 100%;
                    transform: translateY(-50%);
                    border-right-color: rgba(0,0,0,0.95);
                }

                .igu-tooltip.arrow-right::after {
                    top: 50%;
                    left: 100%;
                    transform: translateY(-50%);
                    border-left-color: rgba(0,0,0,0.95);
                }

                /* Vertical Range Slider */
                .igu-range-vertical {
                    -webkit-appearance: none;
                    appearance: none;
                    background: transparent;
                    cursor: pointer;
                    width: 60px;
                    height: 20px;
                    transform: rotate(-90deg);
                    transform-origin: center;
                    margin: 20px 0;
                    touch-action: none;
                }

                .igu-range-vertical::-webkit-slider-runnable-track {
                    height: 4px;
                    background: rgba(255,255,255,0.3);
                    border-radius: 2px;
                }

                .igu-range-vertical::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: white;
                    border-radius: 50%;
                    margin-top: -6px;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.5);
                    cursor: grab;
                }

                .igu-range-vertical::-webkit-slider-thumb:active {
                    cursor: grabbing;
                    transform: scale(1.1);
                }

                .igu-range-vertical::-moz-range-track {
                    height: 4px;
                    background: rgba(255,255,255,0.3);
                    border-radius: 2px;
                }

                .igu-range-vertical::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    background: white;
                    border-radius: 50%;
                    border: none;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.5);
                    cursor: grab;
                }

                .igu-range-vertical::-moz-range-thumb:active {
                    cursor: grabbing;
                    transform: scale(1.1);
                }

                /* Speed Control */
                .igu-speed-wrap {
                    display: flex;
                    align-items: center;
                    position: relative;
                }

                .igu-speed-btn {
                    all: unset;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: white;
                    font-size: 11px;
                    font-weight: bold;
                    font-family: monospace;
                    padding: 0 8px;
                    height: 32px;
                    border-radius: 0;
                    background: rgba(255,255,255,0.1);
                    min-width: 36px;
                    text-align: center;
                    transition: background 0.15s;
                }

                .igu-speed-btn:hover {
                    background: rgba(255,255,255,0.2);
                }

                .igu-speed-btn:active {
                    background: rgba(255,255,255,0.3);
                }

                /* Range Inputs */
                input[type="range"].igu-range {
                    -webkit-appearance: none;
                    appearance: none;
                    background: transparent;
                    cursor: pointer;
                    width: 100%;
                    height: 20px;
                    margin: 0;
                    padding: 0;
                }

                input[type="range"].igu-range::-webkit-slider-runnable-track {
                    height: 4px;
                    background: rgba(255,255,255,0.3);
                    border-radius: 2px;
                }

                input[type="range"].igu-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    background: white;
                    border-radius: 50%;
                    margin-top: -4px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
                }

                input[type="range"].igu-range::-moz-range-track {
                    height: 4px;
                    background: rgba(255,255,255,0.3);
                    border-radius: 2px;
                }

                input[type="range"].igu-range::-moz-range-thumb {
                    width: 12px;
                    height: 12px;
                    background: white;
                    border-radius: 50%;
                    border: none;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
                }

                /* Background Play Indicator */
                .igu-bgplay {
                    opacity: 0.6;
                    transition: opacity 0.15s;
                }

                .igu-bgplay.active {
                    opacity: 1;
                    color: #00ff88;
                }

                /* Hint Overlay - centered above controls */
                .igu-hint {
                    position: absolute;
                    bottom: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.85);
                    color: white;
                    padding: 8px 14px;
                    border-radius: 0;
                    font-size: 16px;
                    font-weight: bold;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.15s;
                    z-index: 2147483645;
                }

                .igu-hint.show {
                    opacity: 1;
                }

                /* Stacked layout - progress bar on top spanning full width, then buttons below */
                .igu-panel.stacked .igu-controls {
                    flex-wrap: wrap;
                    gap: 0;
                }

                .igu-panel.stacked .igu-timeline {
                    order: -1;
                    width: 100%;
                    flex: none;
                    margin: 0 !important;
                }

                /* In stacked mode, first button (play) touches left edge */
                .igu-panel.stacked .igu-btn:first-of-type {
                    margin-left: 0;
                }

                /* In stacked mode, last button (fullscreen) touches right edge */
                .igu-panel.stacked .igu-btn:last-of-type {
                    margin-right: 0;
                }

                /* Wrapper positioning - contain controls within video bounds */
                .igu-wrapper {
                    position: relative !important;
                    overflow: hidden !important;
                }





                /* Hide Instagram's native controls overlay */
                .igu-wrapper > div[data-instancekey] > div:first-child {
                    z-index: 1 !important;
                }

                /* Ensure video is clickable */
                .igu-wrapper video {
                    position: relative;
                    z-index: 0;
                }



                /* Instagram native button containers - position dynamically above our controls */
                /* Uses --igu-panel-height CSS variable set by JavaScript */

                /* Mute/audio button container (right side) */
                .igu-wrapper div:has(> button[aria-label="Toggle audio"]),
                .igu-wrapper div:has(> button[aria-label*="audio"]) {
                    position: absolute !important;
                    bottom: calc(var(--igu-panel-height, 36px) + 8px) !important;
                    top: auto !important;
                    right: 8px !important;
                    left: auto !important;
                    z-index: 2147483646 !important;
                    opacity: 0 !important;
                    transition: opacity 0.2s ease, bottom 0.15s ease !important;
                    pointer-events: none !important;
                }

                .igu-wrapper.ui-visible div:has(> button[aria-label="Toggle audio"]),
                .igu-wrapper.ui-visible div:has(> button[aria-label*="audio"]) {
                    opacity: 1 !important;
                    pointer-events: auto !important;
                }

                /* Tags/person button container (left side) */
                /* Note: aria-label="Tags" is on the SVG inside the button, not the button itself */
                .igu-wrapper div:has(> button svg[aria-label="Tags"]),
                .igu-wrapper div:has(> button svg[aria-label*="Tags"]) {
                    position: absolute !important;
                    bottom: calc(var(--igu-panel-height, 36px) + 8px) !important;
                    top: auto !important;
                    left: 8px !important;
                    right: auto !important;
                    z-index: 2147483646 !important;
                    opacity: 0 !important;
                    transition: opacity 0.2s ease, bottom 0.15s ease !important;
                    pointer-events: none !important;
                }

                .igu-wrapper.ui-visible div:has(> button svg[aria-label="Tags"]),
                .igu-wrapper.ui-visible div:has(> button svg[aria-label*="Tags"]) {
                    opacity: 1 !important;
                    pointer-events: auto !important;
                }
            `;

            document.head.appendChild(css);
        }
    };

    // ==========================================================================
    // SECTION 7: TOOLTIP MANAGER
    // ==========================================================================
    const TooltipManager = {
        element: null,
        hideTimeout: null,

        init() {
            if (this.element) return;

            this.element = document.createElement('div');
            this.element.className = 'igu-tooltip';
            document.body.appendChild(this.element);
        },

        /**
         * Show tooltip with specified position preference
         * @param {string} text - Tooltip text
         * @param {HTMLElement} targetElement - Element to position relative to
         * @param {string} position - 'above' (default), 'left', or 'right'
         */
        show(text, targetElement, position = 'above') {
            if (!this.element) this.init();

            clearTimeout(this.hideTimeout);

            this.element.textContent = text;
            this.element.className = 'igu-tooltip visible';

            const rect = targetElement.getBoundingClientRect();

            // Temporarily show to measure
            this.element.style.left = '-9999px';
            this.element.style.top = '-9999px';
            const tooltipRect = this.element.getBoundingClientRect();

            let left, top, arrowClass;

            if (position === 'left') {
                // Position to the left of element
                left = rect.left - tooltipRect.width - 8;
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                arrowClass = 'arrow-right';
            } else if (position === 'right') {
                // Position to the right of element
                left = rect.right + 8;
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                arrowClass = 'arrow-left';
            } else {
                // Position above element (default)
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                top = rect.top - tooltipRect.height - 8;
                arrowClass = 'arrow-bottom';

                // Fallback to below if no room above
                if (top < 5) {
                    top = rect.bottom + 8;
                    arrowClass = ''; // No arrow for fallback position
                }
            }

            // Keep within viewport horizontally
            if (left < 5) left = 5;
            if (left + tooltipRect.width > window.innerWidth - 5) {
                left = window.innerWidth - tooltipRect.width - 5;
            }

            // Keep within viewport vertically
            if (top < 5) top = 5;
            if (top + tooltipRect.height > window.innerHeight - 5) {
                top = window.innerHeight - tooltipRect.height - 5;
            }

            this.element.classList.add(arrowClass);
            this.element.style.left = `${left}px`;
            this.element.style.top = `${top}px`;
        },

        hide() {
            if (!this.element) return;
            this.hideTimeout = setTimeout(() => {
                this.element.classList.remove('visible');
            }, 50);
        },

        /**
         * Attach tooltip to an element
         * @param {HTMLElement} element - Target element
         * @param {string} text - Tooltip text
         * @param {string} position - 'above' (default), 'left', or 'right'
         */
        attach(element, text, position = 'above') {
            element.addEventListener('mouseenter', () => this.show(text, element, position));
            element.addEventListener('mouseleave', () => this.hide());
            element.addEventListener('focus', () => this.show(text, element, position));
            element.addEventListener('blur', () => this.hide());
        }
    };

    // ==========================================================================
    // SECTION 8: VIDEO CONTROLS UI
    // ==========================================================================
    class VideoControlsUI {
        constructor(video) {
            this.video = video;
            this.isDragging = false;
            this.hideTimeout = null;
            this.hintTimeout = null;
            this.isInPiP = false;
            this.mouseActivityTimeout = null;
            this.isHoveringControls = false;

            this.createUI();
            this.attachEvents();
            this.applyState();
            this.checkLayoutSpace(); // Initial layout check
        }

        createUI() {
            // Wrapper
            const wrapper = this.video.parentElement;
            wrapper.classList.add('igu-wrapper');
            if (getComputedStyle(wrapper).position === 'static') {
                wrapper.style.position = 'relative';
            }

            // Main panel
            this.panel = document.createElement('div');
            this.panel.className = 'igu-panel';

            // Controls row
            const controls = document.createElement('div');
            controls.className = 'igu-controls';

            // Play/Pause button
            this.playBtn = this.createButton('igu-btn igu-play', ICONS.play, () => this.togglePlay());

            // Timeline (includes time labels inside)
            this.timeline = this.createTimeline();

            // Volume control
            this.volumeWrap = this.createVolumeControl();

            // Speed control
            this.speedWrap = this.createSpeedControl();

            // PiP button
            this.pipBtn = this.createButton('igu-btn', ICONS.pip, () => this.togglePiP());
            TooltipManager.attach(this.pipBtn, 'Picture-in-Picture (P)');

            // Fullscreen button
            this.fsBtn = this.createButton('igu-btn', ICONS.fullscreen, () => this.toggleFullscreen());
            TooltipManager.attach(this.fsBtn, 'Fullscreen (F)');

            // Assemble controls - volume and speed next to play button
            // Timeline has flex: 1, pip has margin-left: auto to push pip/fs to the right
            // No margins on edge buttons for corner accessibility
            this.pipBtn.style.marginLeft = 'auto';
            this.playBtn.style.marginLeft = '0';
            this.fsBtn.style.marginRight = '0';

            controls.append(
                this.playBtn,
                this.volumeWrap,
                this.speedWrap,
                this.timeline,
                this.pipBtn,
                this.fsBtn
            );

            this.panel.appendChild(controls);
            wrapper.appendChild(this.panel);

            // Hint overlay
            this.hint = document.createElement('div');
            this.hint.className = 'igu-hint';
            wrapper.appendChild(this.hint);

            // Prevent Instagram events
            this.panel.addEventListener('click', e => e.stopPropagation());
            this.panel.addEventListener('dblclick', e => e.stopPropagation());
            this.panel.addEventListener('mousedown', e => e.stopPropagation());
        }

        createButton(className, icon, onClick) {
            const btn = document.createElement('button');
            btn.className = className;
            btn.innerHTML = icon;
            btn.addEventListener('click', onClick);
            return btn;
        }

        createTimeline() {
            const timeline = document.createElement('div');
            timeline.className = 'igu-timeline';

            const track = document.createElement('div');
            track.className = 'igu-timeline-track';

            this.progress = document.createElement('div');
            this.progress.className = 'igu-timeline-progress';

            const thumb = document.createElement('div');
            thumb.className = 'igu-timeline-thumb';

            this.tooltip = document.createElement('div');
            this.tooltip.className = 'igu-timeline-tooltip';
            this.tooltip.textContent = '0:00';

            // Time labels inside progress bar
            this.timeCurrent = document.createElement('span');
            this.timeCurrent.className = 'igu-time-current';
            this.timeCurrent.textContent = '0:00';

            this.timeDuration = document.createElement('span');
            this.timeDuration.className = 'igu-time-duration';
            this.timeDuration.textContent = '0:00';

            this.progress.appendChild(thumb);
            track.appendChild(this.progress);
            track.appendChild(this.timeCurrent);
            track.appendChild(this.timeDuration);
            timeline.appendChild(track);
            timeline.appendChild(this.tooltip);

            // Timeline events
            timeline.addEventListener('mousedown', e => this.startSeek(e));
            timeline.addEventListener('mousemove', e => this.updateTooltip(e));

            // Wheel scroll to seek on timeline
            timeline.addEventListener('wheel', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const delta = e.deltaY > 0 ? -CONFIG.WHEEL_SEEK_STEP : CONFIG.WHEEL_SEEK_STEP;
                this.seekRelative(delta);
            }, { passive: false });

            return timeline;
        }

        createVolumeControl() {
            const wrap = document.createElement('div');
            wrap.className = 'igu-volume-wrap';

            this.muteBtn = this.createButton('igu-btn', ICONS.volumeHigh, () => this.toggleMute());
            TooltipManager.attach(this.muteBtn, 'Volume (M)', 'left');

            // Vertical slider popup
            const popup = document.createElement('div');
            popup.className = 'igu-slider-popup';

            // Auto-unmute checkbox at top of popup
            const autoUnmuteWrap = document.createElement('label');
            autoUnmuteWrap.className = 'igu-auto-unmute-wrap';

            this.autoUnmuteCheckbox = document.createElement('input');
            this.autoUnmuteCheckbox.type = 'checkbox';
            this.autoUnmuteCheckbox.className = 'igu-auto-unmute-checkbox';
            this.autoUnmuteCheckbox.checked = State.get('autoUnmute');

            autoUnmuteWrap.appendChild(this.autoUnmuteCheckbox);
            TooltipManager.attach(autoUnmuteWrap, 'Auto-unmute videos on page load (saved)');

            this.autoUnmuteCheckbox.addEventListener('change', (e) => {
                e.stopPropagation();
                const checked = this.autoUnmuteCheckbox.checked;
                State.setAutoUnmute(checked);
                if (checked) {
                    // When enabling auto-unmute, unmute immediately and set user intent
                    this.video._userMuteIntent = false;
                    this.video.muted = false;
                    this.updateVolumeUI();
                    this.showHint('🔊 Auto-unmute ON');
                } else {
                    this.showHint('🔇 Auto-unmute OFF');
                }
            });

            this.volumeValue = document.createElement('span');
            this.volumeValue.className = 'igu-slider-value';
            this.volumeValue.textContent = Math.round(State.get('volume') * 100) + '%';

            this.volumeSlider = document.createElement('input');
            this.volumeSlider.type = 'range';
            this.volumeSlider.className = 'igu-range-vertical';
            this.volumeSlider.min = '0';
            this.volumeSlider.max = '1';
            this.volumeSlider.step = '0.01';
            this.volumeSlider.value = State.get('volume');

            this.volumeSlider.addEventListener('input', (e) => {
                e.stopPropagation();
                const vol = parseFloat(this.volumeSlider.value);
                State.set('volume', vol);
                if (vol > 0 && State.get('muted')) {
                    State.set('muted', false);
                }
                this.volumeValue.textContent = Math.round(vol * 100) + '%';
                this.applyVolume();
                this.showHint(`${Math.round(vol * 100)}%`);
            });

            // Also handle change event for reliability
            this.volumeSlider.addEventListener('change', (e) => {
                e.stopPropagation();
                const vol = parseFloat(this.volumeSlider.value);
                State.set('volume', vol);
                if (vol > 0 && State.get('muted')) {
                    State.set('muted', false);
                }
                this.volumeValue.textContent = Math.round(vol * 100) + '%';
                this.applyVolume();
                this.showHint(`${Math.round(vol * 100)}%`);
            });

            popup.append(autoUnmuteWrap, this.volumeValue, this.volumeSlider);
            wrap.append(this.muteBtn, popup);

            // Wheel scroll to adjust volume
            wrap.addEventListener('wheel', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const delta = e.deltaY > 0 ? -CONFIG.WHEEL_VOLUME_STEP : CONFIG.WHEEL_VOLUME_STEP;
                this.adjustVolume(delta);
            }, { passive: false });

            return wrap;
        }

        createSpeedControl() {
            const wrap = document.createElement('div');
            wrap.className = 'igu-speed-wrap';

            this.speedBtn = document.createElement('button');
            this.speedBtn.className = 'igu-speed-btn';
            this.speedBtn.textContent = State.get('speed') + 'x';
            TooltipManager.attach(this.speedBtn, 'Speed ([ / ])', 'right');

            // Vertical slider popup
            const popup = document.createElement('div');
            popup.className = 'igu-slider-popup';

            this.speedValue = document.createElement('span');
            this.speedValue.className = 'igu-slider-value';
            this.speedValue.textContent = State.get('speed') + 'x';

            this.speedSlider = document.createElement('input');
            this.speedSlider.type = 'range';
            this.speedSlider.className = 'igu-range-vertical';
            this.speedSlider.min = '0';
            this.speedSlider.max = String(CONFIG.SPEEDS.length - 1);
            this.speedSlider.step = '1';
            this.speedSlider.value = String(CONFIG.SPEEDS.indexOf(State.get('speed')));

            this.speedSlider.addEventListener('input', (e) => {
                e.stopPropagation();
                const idx = parseInt(this.speedSlider.value, 10);
                const speed = CONFIG.SPEEDS[idx];
                if (speed !== undefined) {
                    State.set('speed', speed);
                    this.video.playbackRate = speed;
                    this.speedBtn.textContent = speed + 'x';
                    this.speedValue.textContent = speed + 'x';
                    this.showHint(`${speed}x`);
                }
            });

            // Also handle change event for reliability
            this.speedSlider.addEventListener('change', (e) => {
                e.stopPropagation();
                const idx = parseInt(this.speedSlider.value, 10);
                const speed = CONFIG.SPEEDS[idx];
                if (speed !== undefined) {
                    State.set('speed', speed);
                    this.video.playbackRate = speed;
                    this.speedBtn.textContent = speed + 'x';
                    this.speedValue.textContent = speed + 'x';
                    this.showHint(`${speed}x`);
                }
            });

            // Click button to cycle speeds
            this.speedBtn.addEventListener('click', () => {
                const currentIdx = CONFIG.SPEEDS.indexOf(State.get('speed'));
                const nextIdx = (currentIdx + 1) % CONFIG.SPEEDS.length;
                const speed = CONFIG.SPEEDS[nextIdx];
                State.set('speed', speed);
                this.video.playbackRate = speed;
                this.speedBtn.textContent = speed + 'x';
                this.speedValue.textContent = speed + 'x';
                this.speedSlider.value = String(nextIdx);
                this.showHint(speed + 'x');
            });

            popup.append(this.speedValue, this.speedSlider);
            wrap.append(this.speedBtn, popup);

            // Wheel scroll to adjust speed
            wrap.addEventListener('wheel', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const direction = e.deltaY > 0 ? -CONFIG.WHEEL_SPEED_STEP : CONFIG.WHEEL_SPEED_STEP;
                this.cycleSpeed(direction);
            }, { passive: false });

            return wrap;
        }

        attachEvents() {
            // Video events
            this.video.addEventListener('play', () => this.updatePlayButton());
            this.video.addEventListener('pause', () => this.updatePlayButton());
            this.video.addEventListener('timeupdate', () => this.updateTime());
            this.video.addEventListener('loadedmetadata', () => this.updateTime());
            this.video.addEventListener('volumechange', () => this.updateVolumeUI());
            this.video.addEventListener('ratechange', () => {
                this.updateSpeedUI();
            });

            // Show panel on mouse activity
            const wrapper = this.video.parentElement;

            // Track mouse position for reliable hover detection
            wrapper.addEventListener('mousemove', (e) => {
                this.lastMousePos = { x: e.clientX, y: e.clientY };
                this.handleMouseActivity();
            });

            wrapper.addEventListener('mouseenter', () => this.handleMouseActivity());
            wrapper.addEventListener('mouseleave', () => {
                this.lastMousePos = null; // Clear mouse position when leaving
                this.clearHideTimer();
                this.hideUI();
            });

            // Track mouse position when over panel too
            this.panel.addEventListener('mousemove', (e) => {
                this.lastMousePos = { x: e.clientX, y: e.clientY };
            });

            // Listen for fullscreen changes
            document.addEventListener('fullscreenchange', () => {
                // Reset mouse position - coordinates are invalid after fullscreen change
                this.lastMousePos = null;

                // Show UI briefly after transition
                this.handleMouseActivity();
                this.checkLayoutSpace();

                // Force hide after delay to reset state properly
                // This ensures auto-hide works correctly in new mode
                setTimeout(() => {
                    if (!this.isMouseOverPanel() && !this.isKeyboardFocusActive()) {
                        this.hideUI();
                        // Then re-enable normal tracking
                        this.scheduleHideUI();
                    }
                }, CONFIG.UI_HIDE_DELAY + 100);
            });

            // Click handling is now done at document level - see MainController

            // PiP event handlers
            this.video.addEventListener('enterpictureinpicture', () => {
                this.isInPiP = true;
            });

            this.video.addEventListener('leavepictureinpicture', () => {
                this.isInPiP = false;
                // Pause when leaving PiP to prevent unwanted autoplay
                VideoStateTracker.markPausedByUser(this.video);
                this.video.pause();
            });

            // Check layout on resize and zoom
            window.addEventListener('resize', () => this.checkLayoutSpace());

            // Use ResizeObserver for more reliable size detection
            if (window.ResizeObserver) {
                this.resizeObserver = new ResizeObserver(() => this.checkLayoutSpace());
                this.resizeObserver.observe(wrapper);
            }

            // State changes
            State.subscribe(() => this.applyState());

            // Prevent auto-hide when hovering over slider popups
            const sliderPopups = this.panel.querySelectorAll('.igu-slider-popup');
            sliderPopups.forEach(popup => {
                popup.addEventListener('mouseenter', () => {
                    this.clearHideTimer();
                });
                popup.addEventListener('mouseleave', () => {
                    this.scheduleHideUI();
                });
            });
        }

        // ==========================================================================
        // SECTION 8 VIDEO CONTROLS UI METHODS
        // ==========================================================================

        togglePlay() {
            if (this.video.paused) {
                VideoStateTracker.markPlayedByUser(this.video);
                this.video.play().catch(() => {});
                // No hint - center button already shows state
            } else {
                VideoStateTracker.markPausedByUser(this.video);
                this.video.pause();
                // No hint - center button already shows state
            }
        }

        updatePlayButton() {
            const isPaused = this.video.paused;
            this.playBtn.innerHTML = isPaused ? ICONS.play : ICONS.pause;

            // Update wrapper class for CSS targeting
            const wrapper = this.video.parentElement;
            wrapper.classList.toggle('video-paused', isPaused);

            // When paused, show UI initially but allow it to hide based on config
            if (isPaused) {
                this.showUI();
                // Still schedule hide if config allows hiding when paused
                if (CONFIG.UI_HIDE_WHEN_PAUSED) {
                    this.scheduleHideUI();
                }
            }
        }

        toggleMute() {
            const newMuted = !this.video.muted;
            // Track that user explicitly set mute state
            this.video._userMuteIntent = newMuted;
            this.video.muted = newMuted;
            State.set('muted', newMuted);
            this.showHint(newMuted ? '🔇' : '🔊');
            this.updateVolumeUI();
        }

        applyVolume() {
            const vol = State.get('volume');

            this.video.volume = vol;
            this.updateVolumeUI();
        }

        updateVolumeUI() {
            const muted = this.video.muted;
            const vol = this.video.volume;

            this.muteBtn.innerHTML = (muted || vol === 0) ? ICONS.volumeMuted : ICONS.volumeHigh;
            this.volumeSlider.value = vol;
            this.volumeValue.textContent = Math.round(vol * 100) + '%';

            // Sync checkbox state
            if (this.autoUnmuteCheckbox) {
                this.autoUnmuteCheckbox.checked = State.get('autoUnmute');
            }

            // Sync volume to state (but NOT muted - that's handled by user intent)
            State.data.volume = vol;
        }

        updateSpeedUI() {
            const speed = State.get('speed');
            const idx = CONFIG.SPEEDS.indexOf(speed);
            this.speedBtn.textContent = speed + 'x';
            this.speedValue.textContent = speed + 'x';
            this.speedSlider.value = String(idx >= 0 ? idx : CONFIG.SPEEDS.indexOf(1));
        }

        checkLayoutSpace() {
            // Use wrapper width as the reference - more stable across zoom levels
            const wrapper = this.video.parentElement;
            if (!wrapper) return;

            const wrapperWidth = wrapper.offsetWidth;

            // Simple threshold: if wrapper is narrow, use stacked layout
            const useStacked = wrapperWidth < CONFIG.MIN_PANEL_WIDTH_FOR_INLINE;
            this.panel.classList.toggle('stacked', useStacked);
            // Also add class to wrapper for CSS targeting of hint and native buttons
            wrapper.classList.toggle('stacked', useStacked);

            // Set panel height as CSS variable for native button positioning
            // Use requestAnimationFrame to ensure layout is calculated after class changes
            requestAnimationFrame(() => {
                const panelHeight = this.panel.offsetHeight;
                if (panelHeight > 0) {
                    wrapper.style.setProperty('--igu-panel-height', `${panelHeight}px`);
                }
            });
        }

        updateTime() {
            if (!this.video.duration) return;

            const current = this.video.currentTime;
            const duration = this.video.duration;

            // Update time labels inside progress bar
            this.timeCurrent.textContent = Utils.formatTime(current);
            this.timeDuration.textContent = Utils.formatTime(duration);

            // Update progress bar
            if (!this.isDragging) {
                const percent = (current / duration) * 100;
                this.progress.style.width = `${percent}%`;
            }
        }

        startSeek(e) {
            this.isDragging = true;
            this.seek(e);

            const onMove = (e) => this.seek(e);
            const onUp = () => {
                this.isDragging = false;
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        }

        seek(e) {
            const rect = this.timeline.getBoundingClientRect();
            const percent = Utils.clamp((e.clientX - rect.left) / rect.width, 0, 1);
            const time = percent * this.video.duration;

            this.video.currentTime = time;
            this.progress.style.width = `${percent * 100}%`;
            this.tooltip.textContent = Utils.formatTime(time);
            this.tooltip.style.left = `${percent * 100}%`;
            this.showHint(Utils.formatTime(time));
        }

        updateTooltip(e) {
            if (this.isDragging) return;

            const rect = this.timeline.getBoundingClientRect();
            const percent = Utils.clamp((e.clientX - rect.left) / rect.width, 0, 1);
            const time = percent * this.video.duration;

            this.tooltip.textContent = Utils.formatTime(time);
            this.tooltip.style.left = `${percent * 100}%`;
        }

        toggleFullscreen() {
            const wrapper = this.video.parentElement;

            if (document.fullscreenElement) {
                document.exitFullscreen();
                this.fsBtn.innerHTML = ICONS.fullscreen;
            } else {
                (wrapper.requestFullscreen || wrapper.webkitRequestFullscreen ||
                 this.video.webkitEnterFullscreen)?.call(wrapper);
                this.fsBtn.innerHTML = ICONS.exitFullscreen;
            }

            // Reset UI visibility state after fullscreen toggle
            // This ensures auto-hide works correctly in fullscreen
            setTimeout(() => {
                this.handleMouseActivity();
            }, 100);
        }

        togglePiP() {
            if (document.pictureInPictureElement) {
                // When exiting PiP, mark as paused so it doesn't auto-resume
                VideoStateTracker.markPausedByUser(this.video);
                document.exitPictureInPicture().catch(() => {});
            } else if (this.video.requestPictureInPicture) {
                this.video.requestPictureInPicture().catch(() => {});
            }
        }

        handleMouseActivity() {
            const wrapper = this.video.parentElement;
            if (!wrapper) return;

            // Show UI
            wrapper.classList.add('ui-visible');

            // Clear any existing hide timer and schedule a new one
            this.clearHideTimer();
            this.scheduleHideUI();
        }

        // Check if mouse is over any interactive control element
        isMouseOverInteractiveElement() {
            if (!this.lastMousePos) return false;

            const { x, y } = this.lastMousePos;
            const elementAtPoint = document.elementFromPoint(x, y);

            if (!elementAtPoint) return false;

            // Check if element is within our panel
            if (!this.panel.contains(elementAtPoint)) return false;

            // Check if it's an interactive element or child of one
            const interactiveSelectors = [
                '.igu-btn',
                '.igu-speed-btn',
                '.igu-timeline',
                '.igu-slider-popup',
                '.igu-range-vertical',
                '.igu-auto-unmute-wrap',
                '.igu-auto-unmute-checkbox',
                'input[type="range"]',
                'input[type="checkbox"]',
                'button'
            ];

            return interactiveSelectors.some(selector =>
                elementAtPoint.matches(selector) || elementAtPoint.closest(selector)
            );
        }

        clearHideTimer() {
            if (this.mouseActivityTimeout) {
                clearTimeout(this.mouseActivityTimeout);
                this.mouseActivityTimeout = null;
            }
        }

        // Check if mouse is actually over the panel using element bounds
        isMouseOverPanel() {
            if (!this.panel || !this.lastMousePos) return false;
            const rect = this.panel.getBoundingClientRect();
            const { x, y } = this.lastMousePos;
            return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        }

        // True only for keyboard navigation focus (so mouse-click focus doesn't keep UI visible forever)
        isKeyboardFocusActive() {
            const active = document.activeElement;
            if (!active || !(active instanceof Element)) return false;
            if (!this.panel || !this.panel.contains(active)) return false;

            try {
                return active.matches(':focus-visible');
            } catch (_) {
                return false;
            }
        }

        scheduleHideUI() {
            this.clearHideTimer();

            this.mouseActivityTimeout = setTimeout(() => {
                // Check all conditions that should prevent hiding
                const isOverPanel = this.isMouseOverPanel();
                const isOverInteractive = this.isMouseOverInteractiveElement();
                const keyboardFocusActive = this.isKeyboardFocusActive();
                const shouldHide = !this.isDragging && !isOverPanel && !isOverInteractive && !keyboardFocusActive;

                if (shouldHide) {
                    this.hideUI();
                } else {
                    // Re-schedule if conditions weren't met
                    this.scheduleHideUI();
                }
            }, CONFIG.UI_HIDE_DELAY);
        }

        hideUI() {
            const wrapper = this.video.parentElement;
            if (!wrapper) return;

            // If a control is focused due to mouse click (not focus-visible), blur it so UI can hide.
            const active = document.activeElement;
            if (active && active instanceof HTMLElement && this.panel && this.panel.contains(active)) {
                let focusVisible = false;
                try { focusVisible = active.matches(':focus-visible'); } catch (_) {}
                if (!focusVisible) {
                    active.blur();
                }
            }

            // Clear the timer
            this.clearHideTimer();

            // Remove the visible class
            wrapper.classList.remove('ui-visible');
        }

        showUI() {
            const wrapper = this.video.parentElement;
            wrapper.classList.add('ui-visible');
        }

        showHint(text) {
            this.hint.textContent = text;
            this.hint.classList.add('show');

            clearTimeout(this.hintTimeout);
            this.hintTimeout = setTimeout(() => {
                this.hint.classList.remove('show');
            }, 800);
        }

        applyState() {
            const state = State.data;

            this.video.volume = state.volume;
            this.video.playbackRate = state.speed;

            // Determine the intended mute state:
            // 1. If user has explicitly set mute intent, use that
            // 2. Else if autoUnmute is enabled and initial setup is done, keep unmuted
            // 3. Otherwise, don't override (let current state remain)
            if (this.video._userMuteIntent !== null) {
                // User explicitly set mute state - respect it
                this.video.muted = this.video._userMuteIntent;
            } else if (state.autoUnmute && this.video._autoUnmuteApplied) {
                // AutoUnmute is on and setup is complete - enforce unmuted
                // This handles the "first play after load" case
                this.video.muted = false;
            }

            this.volumeSlider.value = state.volume;
            this.speedSlider.value = String(CONFIG.SPEEDS.indexOf(state.speed));
            this.updateVolumeUI();
            this.updateSpeedUI();
            this.updatePlayButton();
            this.checkLayoutSpace();
        }

        seekRelative(seconds) {
            const newTime = Utils.clamp(
                this.video.currentTime + seconds,
                0,
                this.video.duration
            );
            this.video.currentTime = newTime;
            this.showHint(`${seconds > 0 ? '+' : ''}${seconds}s`);
        }

        seekFrame(frames) {
            const frameTime = frames * CONFIG.FRAME_TIME;
            this.video.pause();
            this.video.currentTime = Utils.clamp(
                this.video.currentTime + frameTime,
                0,
                this.video.duration
            );
        }

        adjustVolume(delta) {
            const newVol = Utils.clamp(State.get('volume') + delta, 0, 1);
            State.set('volume', newVol);
            if (newVol > 0) State.set('muted', false);
            this.applyVolume();
            this.showHint(`${Math.round(newVol * 100)}%`);
        }

        cycleSpeed(direction) {
            const speeds = CONFIG.SPEEDS;
            const current = State.get('speed');
            const idx = speeds.indexOf(current);
            const newIdx = Utils.clamp(idx + direction, 0, speeds.length - 1);
            const newSpeed = speeds[newIdx];

            State.set('speed', newSpeed);
            this.video.playbackRate = newSpeed;
            this.updateSpeedUI();
            this.showHint(`${newSpeed}x`);
        }

        setSpeedTemporary(speed) {
            this.originalSpeed = this.video.playbackRate;
            this.video.playbackRate = speed;
            this.showHint(`${speed}x ⏩`);
        }

        restoreSpeed() {
            if (this.originalSpeed !== undefined) {
                this.video.playbackRate = this.originalSpeed;
                this.showHint(`${this.originalSpeed}x`);
                this.originalSpeed = undefined;
            }
        }

        destroy() {
            this.clearHideTimer();
            clearTimeout(this.hintTimeout);

            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
            }

            this.panel.remove();
            this.hint.remove();

            const wrapper = this.video.parentElement;
            if (wrapper) {
                wrapper.classList.remove('igu-wrapper', 'video-paused', 'ui-visible');
            }
        }
    }

    // ==========================================================================
    // SECTION 9: KEYBOARD SHORTCUTS
    // ==========================================================================
    const KeyboardHandler = {
        longPressTimer: null,
        isLongPress: false,
        activeUI: null,

        init() {
            document.addEventListener('keydown', (e) => this.handleKeyDown(e), { capture: true });
            document.addEventListener('keyup', (e) => this.handleKeyUp(e), { capture: true });
        },

        setActiveUI(ui) {
            this.activeUI = ui;
        },

        handleKeyDown(e) {
            // Skip if typing in input
            if (Utils.isInputFocused()) return;

            const video = Utils.getClosestVideo();
            if (!video) return;

            // Find the UI for this video
            const ui = this.findUIForVideo(video);
            if (!ui) return;

            // Reset UI visibility timer on any keyboard activity
            ui.handleMouseActivity();

            const key = e.key.toLowerCase();
            let handled = true;

            switch (key) {
                // Play/Pause
                case ' ':
                case 'k':
                    e.preventDefault();
                    ui.togglePlay();
                    break;

                // Seek
                case 'arrowleft':
                case 'j':
                    e.preventDefault();
                    ui.seekRelative(-CONFIG.SEEK_TIME);
                    break;

                case 'arrowright':
                    e.preventDefault();
                    // Long press detection for speed boost
                    if (!this.longPressTimer && !this.isLongPress) {
                        this.longPressTimer = setTimeout(() => {
                            this.isLongPress = true;
                            ui.setSpeedTemporary(CONFIG.LONG_PRESS_SPEED);
                        }, CONFIG.LONG_PRESS_DELAY);
                    }
                    break;

                case 'l':
                    e.preventDefault();
                    ui.seekRelative(CONFIG.SEEK_TIME);
                    break;

                // Frame stepping
                case ',':
                    e.preventDefault();
                    ui.seekFrame(-1);
                    break;

                case '.':
                    e.preventDefault();
                    ui.seekFrame(1);
                    break;

                // Volume
                case 'arrowup':
                    e.preventDefault();
                    ui.adjustVolume(0.05);
                    break;

                case 'arrowdown':
                    e.preventDefault();
                    ui.adjustVolume(-0.05);
                    break;

                case 'm':
                    e.preventDefault();
                    ui.toggleMute();
                    break;

                // Speed
                case '<':
                case '[':
                    e.preventDefault();
                    ui.cycleSpeed(-1);
                    break;

                case '>':
                case ']':
                    e.preventDefault();
                    ui.cycleSpeed(1);
                    break;

                // Fullscreen
                case 'f':
                    e.preventDefault();
                    ui.toggleFullscreen();
                    break;

                // Picture-in-Picture
                case 'p':
                    e.preventDefault();
                    ui.togglePiP();
                    break;

                // Number keys for seeking (0-9)
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    e.preventDefault();
                    const percent = parseInt(key) * 10;
                    video.currentTime = (percent / 100) * video.duration;
                    ui.showHint(`${percent}%`);
                    break;

                // Home/End
                case 'home':
                    e.preventDefault();
                    video.currentTime = 0;
                    ui.showHint('Start');
                    break;

                case 'end':
                    e.preventDefault();
                    video.currentTime = video.duration;
                    ui.showHint('End');
                    break;

                default:
                    handled = false;
            }

            if (handled) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        },

        handleKeyUp(e) {
            if (Utils.isInputFocused()) return;

            const key = e.key.toLowerCase();

            if (key === 'arrowright') {
                // Clear long press timer
                if (this.longPressTimer) {
                    clearTimeout(this.longPressTimer);
                    this.longPressTimer = null;
                }

                const video = Utils.getClosestVideo();
                const ui = video ? this.findUIForVideo(video) : null;

                // Reset UI visibility timer on keyboard activity
                if (ui) ui.handleMouseActivity();

                if (this.isLongPress) {
                    // Was long press - restore speed
                    this.isLongPress = false;
                    if (ui) ui.restoreSpeed();
                } else {
                    // Was short press - seek forward
                    if (ui) ui.seekRelative(CONFIG.SEEK_TIME);
                }

                e.preventDefault();
                e.stopPropagation();
            }
        },

        findUIForVideo(video) {
            // Look for the UI panel in the video's parent
            const wrapper = video.closest('.igu-wrapper');
            if (!wrapper) return null;

            // Find the VideoControlsUI instance
            // We'll store references in a global map
            return videoUIMap.get(video);
        }
    };

    // ==========================================================================
    // SECTION 11: MAIN CONTROLLER
    // ==========================================================================
    const videoUIMap = new WeakMap();
    const processedVideos = new WeakSet();

    const MainController = {
        observer: null,

        init() {
            // Initialize core systems
            State.init();
            AudioEngine.init();
            Styles.inject();
            TooltipManager.init();
            KeyboardHandler.init();

            // Process existing videos
            this.processAllVideos();

            // Watch for new videos
            this.observer = new MutationObserver(
                Utils.debounce(() => this.processAllVideos(), 200)
            );

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Re-apply volume/speed state when returning to tab (not play state)
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    // Only re-apply volume and speed, not muted state
                    document.querySelectorAll('video').forEach(v => {
                        v.volume = State.get('volume');
                        v.playbackRate = State.get('speed');
                    });
                }
            });

            console.log('🎬 Instagram Ultimate Video Controls loaded!');
        },

        processAllVideos() {
            document.querySelectorAll('video').forEach(video => {
                this.processVideo(video);
            });
        },

        processVideo(video) {
            if (processedVideos.has(video)) return;

            // Skip tiny videos (likely thumbnails)
            const rect = video.getBoundingClientRect();
            if (rect.width < 100 || rect.height < 100) return;

            // Skip videos without proper container
            const wrapper = video.parentElement;
            if (!wrapper) return;

            processedVideos.add(video);

            // Apply initial state
            State.applyToVideo(video);

            // Create UI
            const ui = new VideoControlsUI(video);
            videoUIMap.set(video, ui);

            // Cleanup when video is removed
            const cleanupObserver = new MutationObserver(() => {
                if (!document.contains(video)) {
                    ui.destroy();
                    videoUIMap.delete(video);
                    processedVideos.delete(video);
                    cleanupObserver.disconnect();
                }
            });

            cleanupObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };

    // ==========================================================================
    // SECTION 12: ADDITIONAL FEATURES
    // ==========================================================================

    // Double-click to fullscreen
    document.addEventListener('dblclick', (e) => {
        const wrapper = e.target.closest('.igu-wrapper');
        if (!wrapper) return;

        // Don't intercept double-clicks on our controls or native Instagram buttons
        if (e.target.closest('.igu-panel') || e.target.closest('button')) {
            return;
        }

        const video = wrapper.querySelector('video');
        if (video) {
            const ui = videoUIMap.get(video);
            if (ui) {
                e.preventDefault();
                e.stopPropagation();
                ui.toggleFullscreen();
            }
        }
    }, { capture: true });

    // Scroll wheel volume control (when hovering video)
    document.addEventListener('wheel', (e) => {
        const video = e.target.closest('.igu-wrapper video');
        if (video && e.shiftKey) {
            e.preventDefault();
            const ui = videoUIMap.get(video);
            if (ui) {
                ui.adjustVolume(e.deltaY > 0 ? -0.05 : 0.05);
            }
        }
    }, { passive: false });

    // ==========================================================================
    // SECTION 13: INITIALIZATION
    // ==========================================================================

    // Start as early as possible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => MainController.init());
    } else {
        MainController.init();
    }

    // Also run on full load as backup
    window.addEventListener('load', () => {
        setTimeout(() => MainController.processAllVideos(), 1000);
    });

})();