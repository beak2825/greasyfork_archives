// ==UserScript==
// @name         arras.io fps limiter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  fps limiter
// @match        *://arras.io/*
// @match        *://*.arras.io/*
// @run-at       document-start
// @grant        none
// @author       ragsist
// @license      r
// @downloadURL https://update.greasyfork.org/scripts/559979/arrasio%20fps%20limiter.user.js
// @updateURL https://update.greasyfork.org/scripts/559979/arrasio%20fps%20limiter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =========================
       STATE
    ========================= */

    let fpsLimit = null;
    let enabled = false;

    let originalRAF = null;
    let originalCAF = null;
    let limiterActive = false;

    /* =========================
       NOTIFICATIONS
    ========================= */

    function notify(msg) {
        if (Notification.permission === 'granted') {
            new Notification('Arras FPS Limiter', { body: msg });
        } else {
            console.log('[FPS Limiter] ' + msg);
        }
    }

    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }

    /* =========================
       SAFE HARD FPS LIMITER
    ========================= */

    function enableLimiter() {
        if (limiterActive || !fpsLimit) return;

        originalRAF = window.requestAnimationFrame;
        originalCAF = window.cancelAnimationFrame;

        let lastExec = performance.now();

        window.requestAnimationFrame = function (cb) {
            return originalRAF(function rafWrapper(ts) {
                const interval = 1000 / fpsLimit;
                const elapsed = ts - lastExec;

                if (elapsed >= interval) {
                    lastExec = ts - (elapsed % interval);
                    cb(ts);
                } else {
                    // reschedule instead of skipping (prevents freezing)
                    originalRAF(rafWrapper);
                }
            });
        };

        window.cancelAnimationFrame = function (id) {
            return originalCAF(id);
        };

        limiterActive = true;
        notify(`FPS limiter ENABLED (${fpsLimit} FPS)`);
        console.log('[FPS LIMITER] Enabled at', fpsLimit);
    }

    function disableLimiter() {
        if (!limiterActive) return;

        window.requestAnimationFrame = originalRAF;
        window.cancelAnimationFrame = originalCAF;

        limiterActive = false;
        notify('FPS limiter DISABLED');
        console.log('[FPS LIMITER] Disabled');
    }

    function toggleLimiter() {
        enabled ? disableLimiter() : enableLimiter();
        enabled = !enabled;
    }

    /* =========================
       KEYBIND
    ========================= */

    window.addEventListener('keydown', e => {
        if (e.code === 'F8') {
            toggleLimiter();
            e.preventDefault();
        }
    }, true);

    /* =========================
       INIT
    ========================= */

    function init() {
        // Ask every page load
        let input = prompt('Enter FPS limit for Arras (5–240):', '30');
        fpsLimit = parseInt(input);

        if (isNaN(fpsLimit) || fpsLimit < 5 || fpsLimit > 240) {
            alert('Invalid FPS value. Limiter disabled.');
            return;
        }

        notify(`FPS limiter ready (${fpsLimit} FPS). Press F8 to toggle.`);
        console.log('[FPS LIMITER] Ready at', fpsLimit, 'FPS');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
