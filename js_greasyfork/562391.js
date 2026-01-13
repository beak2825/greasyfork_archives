// ==UserScript==
// @name         Auto Antibot + Auto Claim Now Robust
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  Solves antibot and clicks Claim Now with random delay (0.8s - 1.5s)
// @author       Rubystance
// @license      MIT
// @match        https://blockpulse.fun/index.php
// @match        https://blockpulse.fun/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562391/Auto%20Antibot%20%2B%20Auto%20Claim%20Now%20Robust.user.js
// @updateURL https://update.greasyfork.org/scripts/562391/Auto%20Antibot%20%2B%20Auto%20Claim%20Now%20Robust.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const refURL = "https://blockpulse.fun/?r=488";
    if (!sessionStorage.getItem("ref_ok") && !window.location.href.includes("?r=488")) {
        sessionStorage.setItem("ref_ok", "true");
        window.location.replace(refURL);
        return;
    }

    let lastActivity = Date.now();

    function markActivity() {
        lastActivity = Date.now();
    }

    setInterval(() => {
        if (Date.now() - lastActivity > 15000) {
            console.warn("⏱️ No activity for 15s — reloading page");
            location.reload();
        }
    }, 1000);

    function waitForAntibot() {
        const observer = new MutationObserver(() => {
            markActivity();

            const p = document.querySelector("p.text-blue-600.font-black.uppercase");
            const items = document.querySelectorAll(".antibot-item");
            if (p && items.length >= 3) {
                observer.disconnect();
                solveAntibot(p, items);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function solveAntibot(p, items) {
        const words = p.textContent.split(",").map(w => w.trim());
        const script = document.createElement("script");
        script.textContent = `
            (function() {
                const words = ${JSON.stringify(words)};
                const map = {};
                document.querySelectorAll('.antibot-item').forEach(el => map[el.textContent.trim()] = el);
                let index = 0;
                function clickNext() {
                    if (index >= words.length) return;
                    const word = words[index];
                    const el = map[word];
                    if(el && typeof clickAntibot === "function") { clickAntibot(el, word); }
                    index++;
                    const delay = 500 + Math.random() * 600;
                    setTimeout(clickNext, delay);
                }
                clickNext();
            })();
        `;
        document.body.appendChild(script);
    }

    waitForAntibot();

    let isClicking = false;

    function clickWhenReady() {
        markActivity();

        if (isClicking) return false;

        const claimBtn = document.querySelector("#claim-btn");
        const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]');

        if (turnstileResponse && turnstileResponse.value.length > 10) {
            if (claimBtn && !claimBtn.disabled) {
                isClicking = true;

                const randomDelay = Math.floor(Math.random() * (500 - 600 + 1)) + 600;

                console.log(`✅ Cloudflare detected! Waiting ${randomDelay}ms before clicking...`);

                setTimeout(() => {
                    const mouseEvent = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });

                    claimBtn.dispatchEvent(mouseEvent);
                    console.log("🚀 Claim Now clicked!");

                    setTimeout(() => { isClicking = false; }, 2000);
                }, randomDelay);

                return true;
            }
        }
        return false;
    }

    const observer = new MutationObserver(() => {
        markActivity();
        clickWhenReady();
    });

    observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true
    });

    const fastCheck = setInterval(() => {
        clickWhenReady();
    }, 500);

})();
