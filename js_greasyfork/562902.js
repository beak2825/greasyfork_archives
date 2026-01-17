// ==UserScript==
// @description  1ms script,.. if don't work tell me pls..
// @name         Taming.io AutoClick + Spike (1ms)
// @namespace    https://greasyfork.org/
// @version      2.1
// @match        https://taming.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562902/Tamingio%20AutoClick%20%2B%20Spike%20%281ms%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562902/Tamingio%20AutoClick%20%2B%20Spike%20%281ms%29.meta.js
// ==/UserScript==
 
(function () {
    'use strict';

    let enabled = true;
    let holding = false;
    let raf = null;
    let last = performance.now();
    let clicks = 0;
    const CPS = 250;

    function click() {
        const c = document.querySelector("canvas");
        if (!c) return;
        const r = c.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        c.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, clientX: x, clientY: y, buttons: 1 }));
        c.dispatchEvent(new MouseEvent("mouseup",   { bubbles: true, clientX: x, clientY: y, buttons: 1 }));
    }

    function loop() {
        if (!enabled || !holding) return;

        const now = performance.now();
        if (now - last >= 1000) {
            last = now;
            clicks = 0;
        }

        const frameClicks = Math.min(5, CPS - clicks);
        for (let i = 0; i < frameClicks; i++) {
            clicks++;
            click();
        }

        raf = requestAnimationFrame(loop);
    }

    document.addEventListener("keydown", e => {
        if (e.repeat) return;

        if (e.code === "KeyX") {
            enabled = !enabled;
            holding = false;
            cancelAnimationFrame(raf);
            return;
        }

        if (!enabled) return;

        if (e.code === "KeyC" && !holding) {
            holding = true;
            loop();
        }
    });

    document.addEventListener("keyup", e => {
        if (e.code === "KeyC") {
            holding = false;
            cancelAnimationFrame(raf);
        }
    });

})();






