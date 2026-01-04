// ==UserScript==
// @name         reCAPTCHA Human Mouse Assist (Profiles)
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Human-like mouse movement with vertical micro-errors and motion profiles (user-initiated only)
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559583/reCAPTCHA%20Human%20Mouse%20Assist%20%28Profiles%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559583/reCAPTCHA%20Human%20Mouse%20Assist%20%28Profiles%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /************** НАСТРОЙКИ **************/
    // slow | normal | confident
    const PROFILE = 'normal';

    const PROFILES = {
        slow: {
            jitterX: 1.2,
            jitterY: 2.2,
            skipChance: 0.15,
            pauseChance: 0.12,
            pauseMin: 40,
            pauseMax: 120
        },
        normal: {
            jitterX: 0.8,
            jitterY: 1.4,
            skipChance: 0.08,
            pauseChance: 0.06,
            pauseMin: 20,
            pauseMax: 70
        },
        confident: {
            jitterX: 0.5,
            jitterY: 0.9,
            skipChance: 0.03,
            pauseChance: 0.02,
            pauseMin: 10,
            pauseMax: 30
        }
    };

    const cfg = PROFILES[PROFILE] || PROFILES.normal;

    let active = false;
    let lastX = 0;
    let lastY = 0;

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function jitter(value, strength) {
        return value + rand(-strength, strength);
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    document.addEventListener('mousedown', e => {
        active = true;
        lastX = e.clientX;
        lastY = e.clientY;
    }, true);

    document.addEventListener('mouseup', () => {
        active = false;
    }, true);

    document.addEventListener('mousemove', async e => {
        if (!active) return;

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;

        lastX = e.clientX;
        lastY = e.clientY;

        // иногда пропускаем событие — как у человека
        if (Math.random() < cfg.skipChance) return;

        // микро-паузы
        if (Math.random() < cfg.pauseChance) {
            await sleep(rand(cfg.pauseMin, cfg.pauseMax));
        }

        const ev = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: jitter(e.clientX, cfg.jitterX),
            clientY: jitter(e.clientY, cfg.jitterY)
        });

        e.target.dispatchEvent(ev);
    }, true);

})();
