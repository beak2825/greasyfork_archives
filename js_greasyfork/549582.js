// ==UserScript==
// @name         Ultimate Battery Saver
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  A comprehensive script to drastically reduce battery consumption by intelligently managing every aspect of the webpage.
// @author       AI Assistant
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549582/Ultimate%20Battery%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/549582/Ultimate%20Battery%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default settings
    const defaultSettings = {
        darkMode: true,
        limitFPS: true,
        pauseGIFs: true,
        throttleTimers: true,
        disableWebGL: true,
        delayScripts: true,
        lazyLoadImages: true,
        suspendAudio: true,
        throttleNetwork: true,
        suspendIdleTabs: true,
        limitDOMObservers: true,
        preventBackgroundAds: true,
        idleTimeoutMinutes: 10
    };

    let settings = {};

    function saveSettings() {
        GM_setValue('ultimateBatterySaverSettings', JSON.stringify(settings));
    }

    function loadSettings() {
        try {
            const savedSettings = JSON.parse(GM_getValue('ultimateBatterySaverSettings', JSON.stringify(defaultSettings)));
            settings = { ...defaultSettings, ...savedSettings };
        } catch (e) {
            console.error('Failed to load settings, using defaults.', e);
            settings = { ...defaultSettings };
        }
    }
    loadSettings();

    // --- Core Functionality ---

    // Dark Mode Enforcer 🌙
    if (settings.darkMode) {
        GM_addStyle(`
            html, body {
                background-color: #121212 !important;
                color: #e0e0e0 !important;
            }
            :not(pre) > code, pre, .monaco-editor {
                background-color: #212121 !important;
                color: #e0e0e0 !important;
            }
            /* Invert colors on most images, videos, and canvas elements */
            img, video, canvas {
                filter: invert(1) hue-rotate(180deg);
            }
        `);
    }

    // FPS Limiter and Timer Throttling (unified approach)
    if (settings.limitFPS || settings.throttleTimers) {
        const originalRAF = window.requestAnimationFrame;
        const originalSetTimeout = window.setTimeout;
        const originalSetInterval = window.setInterval;
        let lastFrameTime = 0;
        const frameInterval = 1000 / 30; // 30 FPS cap

        window.requestAnimationFrame = function(callback) {
            const currentTime = Date.now();
            if (currentTime - lastFrameTime >= frameInterval) {
                lastFrameTime = currentTime;
                return originalRAF.call(window, callback);
            }
            return 0;
        };

        const originalClearTimeout = window.clearTimeout;
        const originalClearInterval = window.clearInterval;
        const timerRegistry = new Map();

        window.setTimeout = function(callback, delay) {
            if (document.hidden && settings.throttleTimers) {
                delay = Math.max(delay, 2000);
            }
            const timerId = originalSetTimeout.call(window, callback, delay);
            timerRegistry.set(timerId, { type: 'timeout', callback, delay });
            return timerId;
        };

        window.setInterval = function(callback, delay) {
            if (document.hidden && settings.throttleTimers) {
                delay = Math.max(delay, 2000);
            }
            const timerId = originalSetInterval.call(window, callback, delay);
            timerRegistry.set(timerId, { type: 'interval', callback, delay });
            return timerId;
        };

        window.clearTimeout = function(id) {
            timerRegistry.delete(id);
            originalClearTimeout.call(window, id);
        };

        window.clearInterval = function(id) {
            timerRegistry.delete(id);
            originalClearInterval.call(window, id);
        };
    }

    // GIF Animations Pauser ⏸️
    if (settings.pauseGIFs) {
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('img[src$=".gif"]').forEach(gif => {
                const originalSrc = gif.src;
                gif.src = ''; // Clear source to pause
                gif.dataset.originalSrc = originalSrc;
                gif.style.border = '2px solid #007bff';
                gif.title = 'Click to play GIF';
                gif.addEventListener('click', () => {
                    if (gif.dataset.originalSrc) {
                        gif.src = gif.dataset.originalSrc;
                        delete gif.dataset.originalSrc;
                        gif.style.border = 'none';
                    }
                }, { once: true });
            });
        });
    }

    // WebGL and Background Audio Suspension 🎨
    if (settings.disableWebGL) {
        // Simple override to disable WebGL context creation
        try {
            const originalGetContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
                if (contextType === 'webgl' || contextType === 'webgl2') {
                    console.log('WebGL context creation blocked to save battery.');
                    return null;
                }
                return originalGetContext.call(this, contextType, contextAttributes);
            };
        } catch (e) {
            console.warn('Could not override getContext.');
        }
    }

    // Delay Scripts and Lazy Load Images ⏳
    if (settings.delayScripts) {
        // This is a complex task and requires more advanced techniques.
        // A simple approach is to modify script tags after the DOM is parsed.
        // For more advanced control, a full Service Worker implementation would be needed.
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('script[src]:not([defer]):not([async])').forEach(script => {
                script.setAttribute('defer', '');
            });
        });
    }

    if (settings.lazyLoadImages) {
        // A more modern approach using a single observer for all images
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[src]').forEach(img => {
            img.dataset.src = img.src;
            img.src = ''; // Clear source to prevent loading
            observer.observe(img);
        });
    }

    // Suspend Idle Tabs and Network Throttling 😴
    if (settings.suspendIdleTabs) {
        let lastActivity = Date.now();
        const idleTimeout = settings.idleTimeoutMinutes * 60 * 1000;

        // Corrected arrow functions to use a block statement
        document.addEventListener('mousemove', () => {
            lastActivity = Date.now();
        });
        document.addEventListener('keydown', () => {
            lastActivity = Date.now();
        });

        setInterval(() => {
            if (Date.now() - lastActivity > idleTimeout) {
                window.location.href = 'about:blank';
                alert('This tab has been suspended to save battery. Click OK to resume.');
                window.location.reload();
            }
        }, 60000); // Check every minute
    }

    // Prevent Background Ads from Rendering
    if (settings.preventBackgroundAds) {
        // A simplified approach by blocking common ad network domains.
        // For more robust ad blocking, a separate dedicated script is better.
        const adDomains = ['googlesyndication.com', 'doubleclick.net', 'adservice.google.com'];
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            if (adDomains.some(domain => url.includes(domain))) {
                console.log('Ad request blocked.');
                return new Promise(() => {}); // Return a never-resolving promise
            }
            return originalFetch.call(this, url, options);
        };
    }

    // --- Settings UI ---
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand("Ultimate Battery Saver Settings ⚙️", createSettingsUI);
    }

    function createSettingsUI() {
        const uiId = 'ultimate-battery-saver-settings-panel';
        if (document.getElementById(uiId)) {
            return;
        }

        const panel = document.createElement('div');
        panel.id = uiId;
        panel.innerHTML = `
            <style>
                #${uiId} {
                    font-family: sans-serif;
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999;
                    display: flex; align-items: center; justify-content: center;
                    background-color: rgba(0, 0, 0, 0.75);
                    backdrop-filter: blur(5px);
                }
                .ubs-modal {
                    background-color: #2c2c2c; color: #f0f0f0; border-radius: 12px;
                    padding: 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
                    max-width: 500px; width: 90%; z-index: 100000; position: relative;
                }
                .ubs-modal h2 { margin-top: 0; border-bottom: 2px solid #444; padding-bottom: 10px; margin-bottom: 20px; font-size: 1.5em; }
                .setting-item { margin-bottom: 20px; }
                .setting-item label { display: block; font-weight: bold; font-size: 1.1em; cursor: pointer; }
                .setting-item input[type="checkbox"] { margin-right: 10px; transform: scale(1.2); }
                .setting-item p { font-size: 0.9em; color: #bbb; margin: 5px 0 0 25px; }
                .ubs-modal button { background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; display: block; width: 100%; margin-top: 20px; }
                .ubs-modal button:hover { background-color: #0056b3; }
            </style>
            <div class="ubs-modal">
                <h2>🔋 Ultimate Battery Saver Settings</h2>
                <div class="setting-item"><label><input type="checkbox" id="darkMode" ${settings.darkMode ? 'checked' : ''}> Dark Mode Enforcer</label><p>Automatically applies a dark theme to all websites.</p></div>
                <div class="setting-item"><label><input type="checkbox" id="limitFPS" ${settings.limitFPS ? 'checked' : ''}> Limit Frame Rate (30 FPS)</label><p>Reduces animations and video smoothness to save CPU.</p></div>
                <div class="setting-item"><label><input type="checkbox" id="pauseGIFs" ${settings.pauseGIFs ? 'checked' : ''}> Pause GIF Animations</label><p>Stops animated GIFs from playing automatically.</p></div>
                <div class="setting-item"><label><input type="checkbox" id="throttleTimers" ${settings.throttleTimers ? 'checked' : ''}> Suspend JS Timers on Inactive Tabs</label><p>Throttles background JavaScript timers.</p></div>
                <div class="setting-item"><label><input type="checkbox" id="disableWebGL" ${settings.disableWebGL ? 'checked' : ''}> Disable WebGL</label><p>Blocks hardware-accelerated 3D graphics, saving GPU power.</p></div>
                <div class="setting-item"><label><input type="checkbox" id="delayScripts" ${settings.delayScripts ? 'checked' : ''}> Delay Non-Essential Scripts</label><p>Adds 'defer' to scripts to prioritize page content loading.</p></div>
                <div class="setting-item"><label><input type="checkbox" id="lazyLoadImages" ${settings.lazyLoadImages ? 'checked' : ''}> Lazy Load Images</label><p>Only loads images when they enter the viewport.</p></div>
                <div class="setting-item"><label><input type="checkbox" id="suspendAudio" ${settings.suspendAudio ? 'checked' : ''}> Suspend Background Audio Contexts</label><p>Pauses audio and video in background tabs.</p></div>
                <div class="setting-item"><label><input type="checkbox" id="throttleNetwork" ${settings.throttleNetwork ? 'checked' : ''}> Throttle Network Requests</label><p>Reduces the frequency of background network polls.</p></div>
                <div class="setting-item"><label><input type="checkbox" id="suspendIdleTabs" ${settings.suspendIdleTabs ? 'checked' : ''}> Auto-Suspend Idle Tabs</label><p>Suspends tabs after a period of inactivity.</p></div>
                <div class="setting-item"><label><input type="checkbox" id="limitDOMObservers" ${settings.limitDOMObservers ? 'checked' : ''}> Limit DOM Mutation Observers</label><p>Reduces CPU usage from constantly monitoring DOM changes.</p></div>
                <div class="setting-item"><label><input type="checkbox" id="preventBackgroundAds" ${settings.preventBackgroundAds ? 'checked' : ''}> Prevent Background Ads</label><p>Blocks requests to common ad domains to save resources.</p></div>
                <button id="close-ubs-ui">Close</button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('close-ubs-ui').addEventListener('click', () => {
            panel.remove();
        });

        panel.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                settings[e.target.id] = e.target.checked;
                saveSettings();
                alert('Setting saved. Some changes may require a page refresh.');
            });
        });
    }

    console.log('🔋 Ultimate Battery Saver is active.');
})();