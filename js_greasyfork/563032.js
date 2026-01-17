// ==UserScript==
// @name         Torn Chain Timer Alarm (Background Safe)
// @namespace    https://greasyfork.org
// @version      1.1.0
// @description  Repeating alarm when Torn chain timer drops below threshold. Works even in background tabs.
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-idle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/563032/Torn%20Chain%20Timer%20Alarm%20%28Background%20Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563032/Torn%20Chain%20Timer%20Alarm%20%28Background%20Safe%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ALERT_SECONDS = 240;     // 240 seconds , can change if needed
    const BEEP_INTERVAL = 5000;    // 5 seconds

    let lastBeep = 0;
    let lastCheck = Date.now();

    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

    function getChainTime() {
        const els = document.querySelectorAll("div, span");
        for (const el of els) {
            const t = el.textContent;
            if (t.includes("Chain")) {
                const m = t.match(/(\d{1,2}:\d{2})/);
                if (m) return m[1];
            }
        }
        return null;
    }

    function monitor() {
        const now = Date.now();
        const elapsed = now - lastCheck;
        lastCheck = now;

        const time = getChainTime();
        if (!time) return;

        const [m, s] = time.split(":").map(Number);
        const total = m * 60 + s;

        if (total > 0 && total <= ALERT_SECONDS) {
            if (now - lastBeep >= BEEP_INTERVAL) {
                audio.currentTime = 0;
                audio.play().catch(() => {});
                lastBeep = now;
            }
        }
    }

    setInterval(monitor, 1000);
})();
