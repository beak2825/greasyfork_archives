// ==UserScript==
// @name         Work.ink Auto Clicker + Discord Key Sender
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Fully automated Work.ink clicker, grabs key safely, sends to Discord, loops
// @author       Flawless
// @match        *://*.work.ink/*
// @match        *://*.hydrogen.sh/*   // adjust if your key page has a different domain
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/550696/Workink%20Auto%20Clicker%20%2B%20Discord%20Key%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/550696/Workink%20Auto%20Clicker%20%2B%20Discord%20Key%20Sender.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WEBHOOK_URL = "https://discord.com/api/webhooks/1420865263443775509/ZbPDgxiiPbT2Gqdof_UWkSgc2U6lBrMgPOh5KAibxOqb63-753kVGm7WAhstSOKFED26";

    function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

    // 🔹 Send key to Discord
    function sendToDiscord(content) {
        GM_xmlhttpRequest({
            method: "POST",
            url: WEBHOOK_URL,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ content }),
            onload: () => console.log("✅ Sent to Discord:", content),
            onerror: err => console.error("⚠️ Discord error:", err)
        });
    }

    // ✅ Hydrogen key page handling
    if (location.hostname.includes("hydrogen.sh")) {
        let keyElement = document.querySelector("input[type='text'], #key, .key, .copy-target");
        let key = keyElement ? (keyElement.value || keyElement.textContent) : null;

        // Fallback: search body for a long alphanumeric string
        if (!key) {
            let match = document.body.innerText.match(/[A-Za-z0-9\-_]{20,}/);
            if (match) key = match[0];
        }

        if (key) {
            console.log("🔑 Key detected:", key);
            GM_setClipboard(key);
            sendToDiscord(`🔑 New key found: \`${key}\``);

            // Reload Work.ink after delay
            setTimeout(() => { window.location.href = "https://work.ink/1ZsA/7qn7g0gf#google_vignette"; }, 5000);
        } else {
            console.warn("⚠️ No key detected on this page");
            sendToDiscord("⚠️ Key not detected on Hydrogen page");
        }
        return;
    }

    // ✅ Work.ink automation
    async function runSteps() {
        function simulateClick(el) { if (el) el.click(); }

        function waitForSelector(selector, timeout = 30000) {
            return new Promise((resolve, reject) => {
                const start = Date.now();
                const interval = setInterval(() => {
                    const el = document.querySelector(selector);
                    if (el) { clearInterval(interval); resolve(el); }
                    else if (Date.now() - start > timeout) { clearInterval(interval); reject("Timeout: " + selector); }
                }, 500);
            });
        }

        try {
            // Step 1
            let btn1 = await waitForSelector("div.button.large.accessBtn");
            await wait(2000); simulateClick(btn1);

            // Step 2
            let ads = await waitForSelector('button:contains("Continue With Ads")');
            await wait(2000); simulateClick(ads);

            // Step 3
            let btn2 = await waitForSelector("div.button.large.accessBtn");
            await wait(2000); simulateClick(btn2);

            // Step 4 - Final missing button
            let finalBtn = await waitForSelector('button span:contains("Proceed to Safe Destination")');
            await wait(2000); simulateClick(finalBtn.closest("button"));
            console.log("✅ Proceeded to Safe Destination. Waiting for key page...");

        } catch (e) {
            console.error("⚠️ Automation error:", e);
            sendToDiscord("⚠️ Work.ink automation error: " + e);
        }
    }

    setTimeout(runSteps, 2000);

})();