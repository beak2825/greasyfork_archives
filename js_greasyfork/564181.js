// ==UserScript==
// @name         Torn Test Ping
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Testing notifications
// @author       Deviyl
// @match        https://www.torn.com/*
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/564181/Torn%20Test%20Ping.user.js
// @updateURL https://update.greasyfork.org/scripts/564181/Torn%20Test%20Ping.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const btn = document.createElement("button");
    btn.innerHTML = "test ping";
    btn.style.position = "fixed";
    btn.style.top = "10px";
    btn.style.left = "10px";
    btn.style.zIndex = "999999";
    btn.style.padding = "10px";
    btn.style.backgroundColor = "#333";
    btn.style.color = "#fff";
    btn.style.cursor = "pointer";

    const triggerPing = (source) => {
        GM_notification({
            title: `Torn Ping (${source})`,
            text: `Triggered at ${new Date().toLocaleTimeString()}`,
            timeout: 4000
        });
    };

    btn.addEventListener("click", () => triggerPing("Manual"));
    document.body.appendChild(btn);

    let lastNotifiedMinute = -1;

    const checkTime = () => {
        const now = new Date();
        const currentMinute = now.getMinutes();
        if (currentMinute % 2 !== 0 && currentMinute !== lastNotifiedMinute) {
            lastNotifiedMinute = currentMinute;
            triggerPing("Auto: Odd Minute");
        }
    };
    setInterval(checkTime, 5000);

})();