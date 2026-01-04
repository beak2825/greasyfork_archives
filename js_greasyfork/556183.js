// ==UserScript==
// @name         MediaForge - Smooth, flowing control over media playback
// @namespace    https://github.com/aezizhu/video-enhancement-core
// @version      2.3
// @description  A lightweight video enhancement script focusing on core features: speed, volume, picture, and playback control.
// @author       aezi zhu
// @match        *://*/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @run-at       document-start
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/556183/MediaForge%20-%20Smooth%2C%20flowing%20control%20over%20media%20playback.user.js
// @updateURL https://update.greasyfork.org/scripts/556183/MediaForge%20-%20Smooth%2C%20flowing%20control%20over%20media%20playback.meta.js
// ==/UserScript==
/*
 * Copyright (c) 2025, aezi zhu (github.com/aezizhu)
 * This script is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
 * You are free to use this script for personal, non-commercial purposes.
 * Any other use, including redistribution or commercial use, requires explicit permission from the author.
 * For full license details, see the LICENSE file or visit: https://creativecommons.org/licenses/by-nc-nd/4.0/
 */
(function () {
    'use strict';
    // --------------------------------------------------------------------------------
    // 1. Configuration Management (Simplified)
    // --------------------------------------------------------------------------------
    const config = {
        prefix: '_h5player_core_',
        defaultSettings: {
            playbackRate: 1.0,
            volume: 1.0,
            enableHotkeys: true,
            // Filter initial values
            filters: {
                brightness: 1,
                contrast: 1,
                saturate: 1,
                hue: 0,
                blur: 0,
            },
            // Transform initial values
            transform: {
                rotate: 0,
                scaleX: 1,
                scaleY: 1,
                translateX: 0,
                translateY: 0,
            },
            // Hotkey definitions
            hotkeys: {
                // Playback Speed
                'c': { action: 'adjustPlaybackRate', value: 0.1, desc: 'Increase Speed' },
                'x': { action: 'adjustPlaybackRate', value: -0.1, desc: 'Decrease Speed' },
                'z': { action: 'setPlaybackRate', value: 1.0, desc: 'Reset Speed' },
                '1': { action: 'setPlaybackRate', value: 1.0, desc: 'Set Speed to 1x' },
                '2': { action: 'setPlaybackRate', value: 2.0, desc: 'Set Speed to 2x' },
                '3': { action: 'setPlaybackRate', value: 3.0, desc: 'Set Speed to 3x' },
                '4': { action: 'setPlaybackRate', value: 4.0, desc: 'Set Speed to 4x' },
                // Playback Control
                'space': { action: 'togglePlay', desc: 'Toggle Play/Pause' },
                'arrowright': { action: 'seek', value: 5, desc: 'Seek Forward 5s' },
                'arrowleft': { action: 'seek', value: -5, desc: 'Seek Backward 5s' },
                'ctrl+arrowright': { action: 'seek', value: 30, desc: 'Seek Forward 30s' },
                'ctrl+arrowleft': { action: 'seek', value: -30, desc: 'Seek Backward 30s' },
                'f': { action: 'frame', value: 1, desc: 'Next Frame' },
                'd': { action: 'frame', value: -1, desc: 'Previous Frame' },
                // Volume Control
                'arrowup': { action: 'adjustVolume', value: 0.05, desc: 'Volume Up 5%' },
                'arrowdown': { action: 'adjustVolume', value: -0.05, desc: 'Volume Down 5%' },
                'ctrl+arrowup': { action: 'adjustVolume', value: 0.2, desc: 'Volume Up 20%' },
                'ctrl+arrowdown': { action: 'adjustVolume', value: -0.2, desc: 'Volume Down 20%' },
                // Picture Enhancement
                'w': { action: 'adjustFilter', filter: 'brightness', value: 0.1, desc: 'Increase Brightness' },
                'e': { action: 'adjustFilter', filter: 'brightness', value: -0.1, desc: 'Decrease Brightness' },
                'r': { action: 'adjustFilter', filter: 'contrast', value: 0.1, desc: 'Increase Contrast' },
                't': { action: 'adjustFilter', filter: 'contrast', value: -0.1, desc: 'Decrease Contrast' },
                'y': { action: 'adjustFilter', filter: 'saturate', value: 0.1, desc: 'Increase Saturation' },
                'u': { action: 'adjustFilter', filter: 'saturate', value: -0.1, desc: 'Decrease Saturation' },
                'i': { action: 'adjustFilter', filter: 'hue', value: 15, desc: 'Increase Hue' },
                'o': { action: 'adjustFilter', filter: 'hue', value: -15, desc: 'Decrease Hue' },
                'j': { action: 'adjustFilter', filter: 'blur', value: 1, desc: 'Increase Blur' },
                'k': { action: 'adjustFilter', filter: 'blur', value: -1, desc: 'Decrease Blur' },
                's': { action: 'toggleRotation', desc: 'Rotate 90deg' },
                'm': { action: 'toggleMirror', axis: 'X', desc: 'Horizontal Mirror' },
                'shift+m': { action: 'toggleMirror', axis: 'Y', desc: 'Vertical Mirror' },
                'q': { action: 'resetFilterAndTransform', desc: 'Reset All Picture Adjustments' },
                // Display & Fullscreen
                'enter': { action: 'toggleFullScreen', desc: 'Toggle Browser Fullscreen' },
                'shift+enter': { action: 'toggleWebFullScreen', desc: 'Toggle Web Fullscreen' },
                'escape': { action: 'exitWebFullScreen', desc: 'Exit Web Fullscreen' },
                'shift+p': { action: 'togglePictureInPicture', desc: 'Toggle Picture-in-Picture' },
                'shift+s': { action: 'capture', desc: 'Screenshot' },
                // Media Download
                'shift+d': { action: 'download', desc: 'Download Media' },
            }
        },
        get(key) {
            if (typeof GM_getValue === 'undefined') return this.defaultSettings[key];
            return GM_getValue(this.prefix + key, this.defaultSettings[key]);
        },
        set(key, value) {
            if (typeof GM_setValue === 'undefined') return;
            GM_setValue(this.prefix + key, value);
        }
    };
    // --------------------------------------------------------------------------------
    // 2. Core Utilities
    // --------------------------------------------------------------------------------
    function isEditable(target) {
        // 1. Get the true active element, penetrating Shadow DOMs (Critical for Reddit & modern sites)
        let activeEl = document.activeElement;
        while (activeEl && activeEl.shadowRoot && activeEl.shadowRoot.activeElement) {
            activeEl = activeEl.shadowRoot.activeElement;
        }
        // Check the true active element
        if (activeEl && activeEl !== document.body && activeEl !== document.documentElement) {
            if (activeEl.isContentEditable) return true;
            if (activeEl.tagName && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName)) return true;
            const role = activeEl.getAttribute('role');
            if (role && ['textbox', 'searchbox', 'combobox'].includes(role)) return true;
        }
        // 2. Fallback: Check the event target
        if (!target || !target.nodeType || target.nodeType !== 1) return false;
        // Check if element itself is editable
        if (target.isContentEditable) return true;
        if (target.tagName && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return true;
        const targetRole = target.getAttribute('role');
        if (targetRole && ['textbox', 'searchbox', 'combobox'].includes(targetRole)) return true;
        // Check if target is inside an editable element
        let element = target.parentElement;
        while (element && element !== document.body) {
            if (element.isContentEditable) return true;
            if (element.tagName && ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) return true;
            const role = element.getAttribute('role');
            if (role && ['textbox', 'searchbox', 'combobox'].includes(role)) return true;
            element = element.parentElement;
        }
        return false;
    }
    let _toastTimeout = null;
    function showToast(message, duration = 2000) {
        if (!document.body) return; // Ensure body exists
        let toast = document.querySelector('.enhancement-core-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'enhancement-core-toast';
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                z-index: 2147483647;
                font-family: sans-serif;
                font-size: 14px;
                transition: opacity 0.3s;
                opacity: 0;
                pointer-events: none;
            `;
            document.body.appendChild(toast);
        }
        // Clear previous timeout to prevent race conditions
        if (_toastTimeout) {
            clearTimeout(_toastTimeout);
        }
        toast.textContent = message;
        toast.style.opacity = '1';
        _toastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
            _toastTimeout = null;
        }, duration);
    }
    // --------------------------------------------------------------------------------
    // 3. Media Element Controller
    // --------------------------------------------------------------------------------
    class MediaController {
        constructor(mediaElement) {
            this.media = mediaElement;
            this.filters = { ...config.get('filters') };
            this.transform = { ...config.get('transform') };
            this._restoreTimeout = null;
            this._isRestoring = false;
            this._listeners = []; // Store listener references for cleanup
            this.init();
        }
        init() {
            // Restore last known settings if available
            this.media.playbackRate = config.get('playbackRate');
            this.media.volume = config.get('volume');
            this.applyStyles();
            // Set up event listeners to restore playback rate when video loads
            this.setupPlaybackRateRestoration();
        }
        // Add event listener and track it for cleanup
        _addListener(target, event, handler) {
            target.addEventListener(event, handler);
            this._listeners.push({ target, event, handler });
        }
        // Remove all tracked listeners (cleanup)
        destroy() {
            if (this._restoreTimeout) {
                clearTimeout(this._restoreTimeout);
            }
            for (const { target, event, handler } of this._listeners) {
                target.removeEventListener(event, handler);
            }
            this._listeners = [];
        }
        restorePlaybackRate() {
            // Skip if already restoring to prevent infinite loops
            if (this._isRestoring) return;
            const savedRate = config.get('playbackRate');
            const currentRate = this.media.playbackRate;
            // Only restore if rate differs from saved value
            if (Math.abs(currentRate - savedRate) > 0.01) {
                this._isRestoring = true;
                this.media.playbackRate = savedRate;
                if (window._debugHotkeys_) {
                    console.log('[restorePlaybackRate]', {
                        currentRate: currentRate,
                        savedRate: savedRate,
                        restored: true
                    });
                }
                // Reset flag after a short delay
                setTimeout(() => {
                    this._isRestoring = false;
                }, 100);
            }
        }
        setupPlaybackRateRestoration() {
            // Debounced restoration function
            const debouncedRestore = () => {
                if (this._restoreTimeout) {
                    clearTimeout(this._restoreTimeout);
                }
                this._restoreTimeout = setTimeout(() => {
                    this.restorePlaybackRate();
                }, 100);
            };
            const rateChangeHandler = () => {
                if (!this._isRestoring) {
                    debouncedRestore();
                }
            };
            // Listen to video lifecycle events (tracked for cleanup)
            this._addListener(this.media, 'loadedmetadata', debouncedRestore);
            this._addListener(this.media, 'canplay', debouncedRestore);
            this._addListener(this.media, 'play', debouncedRestore);
            this._addListener(this.media, 'ratechange', rateChangeHandler);
        }
        applyStyles() {
            const filterStr = `brightness(${this.filters.brightness}) contrast(${this.filters.contrast}) saturate(${this.filters.saturate}) hue-rotate(${this.filters.hue}deg) blur(${this.filters.blur}px)`;
            const transformStr = `rotate(${this.transform.rotate}deg) scaleX(${this.transform.scaleX}) scaleY(${this.transform.scaleY}) translateX(${this.transform.translateX}px) translateY(${this.transform.translateY}px)`;
            // Only apply filter if any values are non-default
            const hasFilterChanges = this.filters.brightness !== 1 || this.filters.contrast !== 1 ||
                                    this.filters.saturate !== 1 || this.filters.hue !== 0 || this.filters.blur !== 0;
            if (hasFilterChanges) {
                this.media.style.filter = filterStr;
            } else {
                this.media.style.filter = '';
            }
            // Only apply transform if any values are non-default
            const hasTransformChanges = this.transform.rotate !== 0 || this.transform.scaleX !== 1 ||
                                       this.transform.scaleY !== 1 || this.transform.translateX !== 0 ||
                                       this.transform.translateY !== 0;
            if (hasTransformChanges) {
                this.media.style.transform = transformStr;
            } else {
                this.media.style.transform = '';
            }
        }
        // --- Actions ---
        togglePlay() {
            this.media.paused ? this.media.play() : this.media.pause();
        }
        seek(seconds) {
            this.media.currentTime += seconds;
            showToast(`Seek ${seconds > 0 ? '+' : ''}${seconds}s`);
        }
        frame(direction) {
            if (this.media.paused) {
                this.media.currentTime += direction * (1 / 60); // Assuming 60fps
            }
        }
        adjustVolume(delta) {
            let newVolume = this.media.volume + delta;
            // Fix floating-point precision by rounding to 2 decimal places
            newVolume = Math.round(newVolume * 100) / 100;
            newVolume = Math.max(0, Math.min(2, newVolume)); // Clamp between 0% and 200%
            this.media.volume = newVolume;
            config.set('volume', newVolume);
            showToast(`Volume: ${Math.round(newVolume * 100)}%`);
        }
        adjustPlaybackRate(delta) {
            if (window._debugHotkeys_) {
                console.log('[adjustPlaybackRate]', {
                    currentRate: this.media.playbackRate,
                    delta: delta,
                    expectedNewRate: this.media.playbackRate + delta
                });
            }
            let newRate = this.media.playbackRate + delta;
            // Fix floating-point precision by rounding to 1 decimal place
            newRate = Math.round(newRate * 10) / 10;
            newRate = Math.max(0.1, Math.min(16, newRate));
            // Set flag to prevent restoration during our own changes
            this._isRestoring = true;
            this.media.playbackRate = newRate;
            config.set('playbackRate', newRate);
            showToast(`Speed: ${newRate.toFixed(1)}x`);
            // Reset flag after a short delay
            setTimeout(() => {
                this._isRestoring = false;
            }, 100);
        }
        setPlaybackRate(rate) {
            // Set flag to prevent restoration during our own changes
            this._isRestoring = true;
            this.media.playbackRate = rate;
            config.set('playbackRate', rate);
            showToast(`Speed: ${rate.toFixed(1)}x`);
            // Reset flag after a short delay
            setTimeout(() => {
                this._isRestoring = false;
            }, 100);
        }
        adjustFilter(filter, delta) {
            this.filters[filter] += delta;
            // Fix floating-point precision for non-integer filters
            if (filter !== 'hue' && filter !== 'blur') {
                this.filters[filter] = Math.round(this.filters[filter] * 10) / 10;
            }
            if (filter === 'blur') this.filters[filter] = Math.max(0, this.filters[filter]);
            else if (filter !== 'hue') this.filters[filter] = Math.max(0, this.filters[filter]);
            this.applyStyles();
            config.set('filters', this.filters);
            const value = this.filters[filter];
            const displayValue = (filter === 'hue' || filter === 'blur') ? Math.round(value) : value.toFixed(1);
            showToast(`${filter.charAt(0).toUpperCase() + filter.slice(1)}: ${displayValue}`);
        }
        toggleRotation() {
            this.transform.rotate = (this.transform.rotate + 90) % 360;
            this.applyStyles();
            config.set('transform', this.transform);
            showToast(`Rotation: ${this.transform.rotate}°`);
        }
        toggleMirror(axis) {
            if (axis === 'X') this.transform.scaleX *= -1;
            if (axis === 'Y') this.transform.scaleY *= -1;
            this.applyStyles();
            config.set('transform', this.transform);
            const direction = axis === 'X' ? 'Horizontal' : 'Vertical';
            const state = (axis === 'X' ? this.transform.scaleX : this.transform.scaleY) < 0 ? 'ON' : 'OFF';
            showToast(`${direction} Mirror: ${state}`);
        }
        resetFilterAndTransform() {
            // Reset all filters to default values
            this.filters = {
                brightness: 1,
                contrast: 1,
                saturate: 1,
                hue: 0,
                blur: 0,
            };
            // Reset all transforms to default values
            this.transform = {
                rotate: 0,
                scaleX: 1,
                scaleY: 1,
                translateX: 0,
                translateY: 0,
            };
            this.applyStyles();
            config.set('filters', this.filters);
            config.set('transform', this.transform);
            showToast('All picture adjustments reset');
        }
        toggleFullScreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.error(err));
            } else {
                document.exitFullscreen();
            }
        }
        toggleWebFullScreen() {
            // Site-specific web fullscreen selectors (preferred method)
            const siteSelectors = {
                'youtube.com': 'button.ytp-size-button',
                'bilibili.com': ['.bpx-player-ctrl-web-enter', '.bpx-player-ctrl-web-leave', '.squirtle-pagefullscreen-inactive', '.squirtle-pagefullscreen-active'],
                'live.bilibili.com': '.bilibili-live-player-video-controller-web-fullscreen-btn button',
                'douyin.com': '.xgplayer-page-full-screen',
                'live.douyin.com': '.xgplayer-page-full-screen'
            };
            // Try site-specific button first
            const hostname = window.location.hostname;
            for (const [domain, selector] of Object.entries(siteSelectors)) {
                if (hostname.includes(domain)) {
                    const selectors = Array.isArray(selector) ? selector : [selector];
                    for (const sel of selectors) {
                        const button = document.querySelector(sel);
                        if (button && getComputedStyle(button).display !== 'none') {
                            button.click();
                            showToast('Web Fullscreen Toggled');
                            return;
                        }
                    }
                }
            }
            // Fallback: CSS-based web fullscreen
            if (!document.getElementById('web-fullscreen-style')) {
                const style = document.createElement('style');
                style.id = 'web-fullscreen-style';
                style.textContent = `
                    .web-fullscreen {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        max-width: none !important;
                        max-height: none !important;
                        z-index: 2147483646 !important;
                        object-fit: contain !important;
                        background: #000 !important;
                    }
                `;
                document.head.appendChild(style);
            }
            const isEntering = !this.media.classList.contains('web-fullscreen');
            if (isEntering) {
                // Remove web-fullscreen from other videos
                document.querySelectorAll('.web-fullscreen').forEach(el => {
                    if (el !== this.media) {
                        el.classList.remove('web-fullscreen');
                    }
                });
                this.media.classList.add('web-fullscreen');
                showToast('Web Fullscreen: ON');
            } else {
                this.media.classList.remove('web-fullscreen');
                showToast('Web Fullscreen: OFF');
            }
        }
        exitWebFullScreen() {
            // Exit web fullscreen for all videos
            const webFullscreenVideos = document.querySelectorAll('.web-fullscreen');
            if (webFullscreenVideos.length > 0) {
                webFullscreenVideos.forEach(el => el.classList.remove('web-fullscreen'));
                showToast('Web Fullscreen: OFF');
                return true;
            }
            return false;
        }
        togglePictureInPicture() {
            if (document.pictureInPictureElement === this.media) {
                document.exitPictureInPicture().catch(err => {
                    if (window._debugHotkeys_) console.error('PiP exit failed:', err);
                    showToast('Failed to exit Picture-in-Picture.');
                });
            } else if (this.media.requestPictureInPicture) {
                this.media.requestPictureInPicture().catch(err => {
                    if (window._debugHotkeys_) console.error('PiP request failed:', err);
                    showToast('Failed to enter Picture-in-Picture. Video may be DRM protected.');
                });
            } else {
                showToast('Picture-in-Picture is not supported for this media.');
            }
        }
        capture() {
            if (!this.media || this.media.tagName.toLowerCase() !== 'video') {
                showToast('Capture is only available for video elements.');
                return;
            }
            const width = this.media.videoWidth;
            const height = this.media.videoHeight;
            if (!width || !height) {
                showToast('No video frame available to capture.');
                return;
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(this.media, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                if (!blob) {
                    showToast('Failed to capture frame.');
                    return;
                }
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `capture-${new Date().toISOString()}.png`;
                a.click();
                URL.revokeObjectURL(url);
                showToast('Screenshot saved!');
            });
        }
        download() {
            if (this.media.src) {
                showToast('Starting download...');
                const a = document.createElement('a');
                a.href = this.media.src;
                a.target = '_blank';
                // Try to add a download attribute, might not always work due to CORS
                try {
                    const url = new URL(this.media.src);
                    const filename = url.pathname.split('/').pop();
                    a.download = filename;
                } catch (e) {
                    a.download = 'media_file';
                }
                a.click();
            } else {
                showToast('No media source found to download.');
            }
        }
    }
    // --------------------------------------------------------------------------------
    // 4. Main Script Logic
    // --------------------------------------------------------------------------------
    let activeController = null;
    const controllers = new WeakMap();
    function initializeMedia(mediaElement) {
        if (controllers.has(mediaElement)) return;
        // Simple check to avoid enhancing tiny or ad-like videos (only for video elements)
        if (mediaElement.tagName === 'VIDEO') {
            if (mediaElement.videoWidth < 200 || mediaElement.videoHeight < 150) {
                if (mediaElement.duration < 30) return; // Ignore short ad clips
            }
        }
        if (window._debugHotkeys_) {
            console.log('Enhancement Core: Initializing new media element', mediaElement);
        }
        const controller = new MediaController(mediaElement);
        controllers.set(mediaElement, controller);
        // Auto-set active controller if it's the first one found
        if (!activeController) {
            activeController = controller;
            if (window._debugHotkeys_) {
                console.log('[Controller] Auto-activated first detected media');
            }
        }
        // Use tracked listeners for proper cleanup
        const mouseenterHandler = () => {
            activeController = controller;
            if (window._debugHotkeys_) {
                console.log('[Controller] Activated via mouseenter');
            }
        };
        const playHandler = () => {
            activeController = controller;
            if (window._debugHotkeys_) {
                console.log('[Controller] Activated via play event');
            }
        };
        const focusHandler = () => {
            activeController = controller;
            if (window._debugHotkeys_) {
                console.log('[Controller] Activated via focus');
            }
        };
        controller._addListener(mediaElement, 'mouseenter', mouseenterHandler);
        controller._addListener(mediaElement, 'play', playHandler);
        controller._addListener(mediaElement, 'focus', focusHandler);
    }
    // --- Robust Detection (Prototype Hijacking) ---
    // Inspired by h5player, this ensures we catch videos even in Shadow DOM
    (function hijackPrototype() {
        const _play = HTMLMediaElement.prototype.play;
        const _pause = HTMLMediaElement.prototype.pause;
        const _load = HTMLMediaElement.prototype.load;
        HTMLMediaElement.prototype.play = function () {
            initializeMedia(this);
            return _play.apply(this, arguments);
        };
        HTMLMediaElement.prototype.pause = function () {
            initializeMedia(this);
            return _pause.apply(this, arguments);
        };
        HTMLMediaElement.prototype.load = function () {
            initializeMedia(this);
            return _load.apply(this, arguments);
        };
    })();
    // --- Hotkey Handler ---
    function keydownEvent(event) {
        // Check if hotkeys are enabled
        if (!config.get('enableHotkeys')) return;
        // CRITICAL: Always allow typing in editable fields
        if (isEditable(event.target)) return;
        // Auto-activate controller if none is active
        if (!activeController) {
            const mediaElements = document.querySelectorAll('video, audio');
            for (const mediaElement of mediaElements) {
                if (controllers.has(mediaElement)) {
                    activeController = controllers.get(mediaElement);
                    if (window._debugHotkeys_) {
                        console.log('[Hotkey] Auto-activated media element');
                    }
                    break;
                }
            }
        }
        if (!activeController) return;
        // Build hotkey string
        const modifiers = [];
        if (event.ctrlKey) modifiers.push('ctrl');
        if (event.shiftKey) modifiers.push('shift');
        if (event.altKey) modifiers.push('alt');
        if (event.metaKey) modifiers.push('meta');
        let key = event.key.toLowerCase();
        // Normalize key names
        if (event.code === 'Space' || event.keyCode === 32) key = 'space';
        if (key === ' ' || key === 'spacebar') key = 'space';
        const hotkeyStr = modifiers.length > 0 ? `${modifiers.join('+')}+${key}` : key;
        if (window._debugHotkeys_) {
            console.log(`[Hotkey] Detected: ${hotkeyStr}`);
        }
        // Look up action in config
        const actionDef = config.get('hotkeys')[hotkeyStr];
        if (actionDef) {
            const { action, value, filter, axis } = actionDef;
            if (typeof activeController[action] === 'function') {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                // Dispatch action with appropriate arguments
                if (filter !== undefined) {
                    activeController[action](filter, value);
                } else if (axis !== undefined) {
                    activeController[action](axis);
                } else if (value !== undefined) {
                    activeController[action](value);
                } else {
                    activeController[action]();
                }
                if (window._debugHotkeys_) {
                    console.log(`[Hotkey] Triggered action: ${action}`);
                }
            }
        }
    }
    document.addEventListener('keydown', keydownEvent, true);
    window.addEventListener('keydown', keydownEvent, true);
    function keyupEvent(event) {
        // Check if hotkeys are enabled
        if (!config.get('enableHotkeys')) return;
        // CRITICAL: Always allow typing in editable fields
        if (isEditable(event.target)) return;
        // Build hotkey string (same logic as keydown)
        const modifiers = [];
        if (event.ctrlKey) modifiers.push('ctrl');
        if (event.shiftKey) modifiers.push('shift');
        if (event.altKey) modifiers.push('alt');
        if (event.metaKey) modifiers.push('meta');
        let key = event.key.toLowerCase();
        // Normalize key names
        if (event.code === 'Space' || event.keyCode === 32) key = 'space';
        if (key === ' ' || key === 'spacebar') key = 'space';
        const hotkeyStr = modifiers.length > 0 ? `${modifiers.join('+')}+${key}` : key;
        // Look up action in config
        const actionDef = config.get('hotkeys')[hotkeyStr];
        if (actionDef) {
            // If it's a handled hotkey, suppress the keyup event
            // This prevents websites (like YouTube) from triggering their own action on keyup
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            if (window._debugHotkeys_) {
                console.log(`[Hotkey] Suppressed keyup for: ${hotkeyStr}`);
            }
        }
    }
    document.addEventListener('keyup', keyupEvent, true);
    window.addEventListener('keyup', keyupEvent, true);
    // --- Media Detection ---
    function findMediaElements() {
        document.querySelectorAll('video, audio').forEach(initializeMedia);
    }
    // Use MutationObserver to detect dynamically added media
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // ELEMENT_NODE
                        if (node.matches('video, audio')) {
                            initializeMedia(node);
                        } else if (node.querySelector) {
                            node.querySelectorAll('video, audio').forEach(initializeMedia);
                        }
                    }
                });
            }
        }
    });
    // Start observing
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    // Initial scan
    findMediaElements();
    // Auto-activate the first video after a short delay
    setTimeout(() => {
        if (!activeController) {
            const firstVideo = document.querySelector('video');
            if (firstVideo) {
                const controller = controllers.get(firstVideo);
                if (controller) {
                    activeController = controller;
                    if (window._debugHotkeys_) {
                        console.log('Auto-activated first video for hotkey control');
                    }
                }
            }
        }
    }, 1000);
    // Only show loading message in debug mode to avoid console spam
    if (window._debugHotkeys_) {
        console.log('MediaForge loaded. Copyright (c) 2025, aezi zhu (github.com/aezizhu)');
        console.log('Videos will auto-activate after 1 second, or hover/play to activate');
    }
})();
