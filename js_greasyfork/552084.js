// ==UserScript==
// @name         Speed-Up Timers
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Patch setInterval/setTimeout to speed up client-side countdowns so the "wait" completes faster.
// @match        https://discovery.to-travel.net/*
// @match        https://*.to-travel.net/*
// @match        https://gold-24.net/*
// @match        https://*.gold-24.net/*
// @match        https://yjiur.xyz/*
// @match        https://*.yjiur.xyz/*
// @match        https://serverguidez.com/*
// @match        https://*.serverguidez.com/*
// @match        https://uploadhaven.com/download/*
// @match        https://transfaze.com/*
// @match        https://cheaplann.com/*
// @match        https://info.quizrent.com/*
// @match        https://fileknot.io/*
// @match        https://ADD_YOUR_SITE_HERE.example/*
// @grant        none
// @icon         https://raw.githubusercontent.com/Accroon/userscript-assets/main/download.png
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552084/Speed-Up%20Timers.user.js
// @updateURL https://update.greasyfork.org/scripts/552084/Speed-Up%20Timers.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const LOG = '[TimerSpeedup]';
    const SPEED_FACTOR = 16;    // how much faster timers should run (8 => 20s ≈ 2.5s). Increase to go faster.
    const TARGET_SECONDS = 3;  // visible seconds you expect to see (used for logs/stop condition)
    const CHECK_INTERVAL = 200; // ms - how often we check for the countdown / Next button
    const MAX_RUNTIME_MS = 250 * 1000; // safety cutoff

    // Save originals
    const realSetTimeout = window.setTimeout.bind(window);
    const realSetInterval = window.setInterval.bind(window);
    const realRequestAnimationFrame = window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : null;
    const realPerformanceNow = performance && performance.now ? performance.now.bind(performance) : null;

    let patched = false;
    let checkerId = null;
    let stopTimer = null;

    // Simple helpers to detect countdown and next button
    function findCountdownNode() {
        try {
            const xpath = "//*[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'wait') or contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'seconds') or contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'loading link')]";
            const walker = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < walker.snapshotLength; i++) {
                const el = walker.snapshotItem(i);
                if (!el) continue;
                const txt = (el.innerText || el.textContent || '').trim();
                if (/\d+\s*seconds?/i.test(txt) || /\bplease wait\b/i.test(txt) || /loading link/i.test(txt)) return el;
            }
        } catch (e) { /* ignore */ }
        return null;
    }
    function parseSeconds(text) {
        if (!text) return null;
        const m = text.match(/(\d+)\s*seconds?/i);
        return m ? parseInt(m[1], 10) : null;
    }
    function findNextButton() {
        try {
            const cands = Array.from(document.querySelectorAll('button, a, input[type="button"], input[type="submit"]'));
            for (const c of cands) {
                const txt = (c.innerText || c.value || '').trim();
                if (/^next$/i.test(txt) || /next|continue|get link|proceed|continue to/i.test(txt)) return c;
            }
            return document.querySelector('#next, .next, .btn-next, [aria-label="Next"], [data-role="next"], a[href*="next"]');
        } catch (e) { return null; }
    }

    // Apply patches
    function applyPatches() {
        if (patched) return;
        patched = true;

        window.setTimeout = function (fn, delay, ...args) {
            try {
                // some calls do not pass numeric delay
                const d = typeof delay === 'number' && delay > 0 ? Math.max(0, Math.floor(delay / SPEED_FACTOR)) : delay;
                return realSetTimeout(fn, d, ...args);
            } catch (e) { return realSetTimeout(fn, delay, ...args); }
        };

        window.setInterval = function (fn, delay, ...args) {
            try {
                const d = typeof delay === 'number' && delay > 0 ? Math.max(1, Math.floor(delay / SPEED_FACTOR)) : delay;
                return realSetInterval(fn, d, ...args);
            } catch (e) { return realSetInterval(fn, delay, ...args); }
        };

        if (realRequestAnimationFrame) {
            window.requestAnimationFrame = function (cb) {
                // call rAF, keeping default behavior (we don't accelerate rAF here)
                return realRequestAnimationFrame(function (t) {
                    try { cb(t); } catch (e) { }
                });
            };
        }

        console.log(LOG, 'patched setTimeout/setInterval (SPEED_FACTOR=' + SPEED_FACTOR + ')');
    }

    // Restore originals
    function restoreOriginals() {
        if (!patched) return;
        try {
            window.setTimeout = realSetTimeout;
            window.setInterval = realSetInterval;
            if (realRequestAnimationFrame) window.requestAnimationFrame = realRequestAnimationFrame;
            patched = false;
            console.log(LOG, 'restored timer originals');
        } catch (e) {
            console.warn(LOG, 'restore error', e);
        }
    }

    // Watcher - look for countdown and Next button; stop when Next enabled or timeout
    function startWatcher() {
        const startedAt = realPerformanceNow ? realPerformanceNow() : Date.now();
        let appliedLog = false;

        checkerId = realSetInterval(function () {
            try {
                // safety cutoff
                const nowDelta = realPerformanceNow ? (realPerformanceNow() - startedAt) : (Date.now() - (startedAt || 0));
                if (nowDelta > MAX_RUNTIME_MS) {
                    console.log(LOG, 'max runtime reached, restoring originals');
                    stopAll();
                    return;
                }

                const node = findCountdownNode();
                if (node) {
                    const text = node.innerText || node.textContent || '';
                    const sec = parseSeconds(text);
                    if (sec !== null && !appliedLog) {
                        console.log(LOG, 'detected countdown =', sec + 's; speeding timers by', SPEED_FACTOR + 'x');
                        appliedLog = true;
                    }
                }

                const next = findNextButton();
                if (next) {
                    const rect = next.getBoundingClientRect ? next.getBoundingClientRect() : null;
                    const visible = rect && rect.width > 1 && rect.height > 1;
                    const disabled = next.disabled || (next.getAttribute && next.getAttribute('disabled') !== null);
                    if (visible && !disabled) {
                        console.log(LOG, 'Next visible & enabled — restoring and stopping.');
                        // optionally auto-click:
                        // try { next.click(); console.log(LOG, 'auto-clicked Next'); } catch(e){}
                        stopAll();
                    }
                }
            } catch (e) {
                console.debug(LOG, 'checker error', e);
            }
        }, CHECK_INTERVAL);
    }

    function stopAll() {
        try { if (checkerId) clearInterval(checkerId); } catch (e) {}
        restoreOriginals();
        if (stopTimer) { clearTimeout(stopTimer); stopTimer = null; }
        if (checkerId) { clearInterval(checkerId); checkerId = null; }
    }

    // Kickoff: patch ASAP and start watcher. If script is injected late, still patch and try.
    try {
        applyPatches();
        startWatcher();
        stopTimer = realSetTimeout(() => {
            console.log(LOG, 'safety timeout reached — restoring originals');
            stopAll();
        }, MAX_RUNTIME_MS + 2000);
    } catch (e) {
        console.error(LOG, 'startup error', e);
        restoreOriginals();
    }

    // restore on page unload
    window.addEventListener('beforeunload', function () {
        stopAll();
    });

})();
