// ==UserScript==
// @name         10x Faster Timers and bypass 10 sec loading timers with autoclick
// @namespace    http://tampermonkey.net/
// @version      2025-11-21
// @description  Auto-submit mmodlist landing + accelerate all timers by 10x
// @author       The Viking
// @match        https://tech.unblockedgames.world/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unblockedgames.world
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558535/10x%20Faster%20Timers%20and%20bypass%2010%20sec%20loading%20timers%20with%20autoclick.user.js
// @updateURL https://update.greasyfork.org/scripts/558535/10x%20Faster%20Timers%20and%20bypass%2010%20sec%20loading%20timers%20with%20autoclick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[TM] Merged script started");

    // ---------------------------------------------------------------
    // 1. 10x FASTER TIMERS
    // ---------------------------------------------------------------
    console.log("[TM] Installing 10x faster timer hooks…");

    const _setTimeout = window.setTimeout;
    const _setInterval = window.setInterval;

    const SPEED = 0.1;  // delay * 0.1 = 10x speed

    window.setTimeout = function(callback, delay, ...args) {
        let newDelay = delay * SPEED;
        console.log(`[TM] setTimeout override: ${delay} → ${newDelay}`);
        return _setTimeout(callback, newDelay, ...args);
    };

    window.setInterval = function(callback, delay, ...args) {
        let newDelay = delay * SPEED;
        console.log(`[TM] setInterval override: ${delay} → ${newDelay}`);
        return _setInterval(callback, newDelay, ...args);
    };

    // ---------------------------------------------------------------
    // 2. AUTO-BYPASS LANDING + VERIFY BUTTON
    // ---------------------------------------------------------------
    console.log("[TM] Setting up element watchers…");

    waitForElem("#landing", (el) => {
        console.log("[TM] #landing found → submitting");
        el.submit();
    });

    waitForElem("#verify_button2", (el) => {
        console.log("[TM] #verify_button2 found → clicking");
        el.click();
    });

    // --------------------------------------------------------------------
    // Helper: Wait for any DOM element to appear
    // --------------------------------------------------------------------
    function waitForElem(selector, callback) {
        console.log("[TM] Waiting for:", selector);

        let existing = document.querySelector(selector);
        if (existing) {
            console.log("[TM] Element already exists:", selector);
            callback(existing);
            return;
        }

        const observer = new MutationObserver(() => {
            let el = document.querySelector(selector);
            if (el) {
                console.log("[TM] Element appeared:", selector);
                observer.disconnect();
                callback(el);
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

})();
