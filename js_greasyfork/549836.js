// ==UserScript==
// @name         Work.ink Auto Clicker Human-Like
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Auto clicks Work.ink buttons with human-like mouse events, random delays
// @author       Shiva
// @match        *://*.work.ink/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549836/Workink%20Auto%20Clicker%20Human-Like.user.js
// @updateURL https://update.greasyfork.org/scripts/549836/Workink%20Auto%20Clicker%20Human-Like.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🔹 Helper: random wait (1–3s by default)
    function wait(min = 1000, max = 3000) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // 🔹 Human-like click for normal steps
    function simulateMouseClick(element) {
        if (!element) return false;

        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();

        const rect = element.getBoundingClientRect();
        const clientX = rect.left + rect.width / 2 + (Math.random() * 4 - 2); // jitter
        const clientY = rect.top + rect.height / 2 + (Math.random() * 4 - 2);

        const opts = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX,
            clientY,
            screenX: window.screenX + clientX,
            screenY: window.screenY + clientY,
            buttons: 1
        };

        const events = [
            "pointerover", "pointerenter", "mouseover", "mouseenter",
            "pointerdown", "mousedown",
            "pointerup", "mouseup", "click"
        ];

        events.forEach((type, i) => {
            setTimeout(() => {
                element.dispatchEvent(new PointerEvent(type, opts));
            }, i * (10 + Math.random() * 30));
        });

        return true;
    }

    // 🔹 Helper: wait for element
    function waitForElement(selector, timeout = 60000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const interval = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(interval);
                    resolve(el);
                } else if (Date.now() - start > timeout) {
                    clearInterval(interval);
                    reject(`Timeout waiting for element: ${selector}`);
                }
            }, 500);
        });
    }

    // 🔹 YOUR ORIGINAL final button logic (unchanged)
    function waitAndClickFinalButton(selector, delay = 1000) {
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el && !el.disabled && el.offsetParent !== null) {
                console.log("✅ Final button is now enabled. Clicking...");

                el.scrollIntoView({ behavior: "smooth", block: "center" });
                el.focus();

                ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(type => {
                    el.dispatchEvent(new MouseEvent(type, {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        buttons: 1
                    }));
                });

                console.log("✅ Final button clicked. Stopping retries.");
                clearInterval(interval);
            } else {
                console.log("⏳ Final button still disabled. Waiting...");
            }
        }, delay);
    }

    // 🔹 Step sequence
    (async function runSteps() {
        try {
            const el1 = await waitForElement('div.button.large.accessBtn');
            console.log("Step 1: Go To Destination");
            await wait();
            simulateMouseClick(el1);

            const adsBtn = await waitForElement('button:contains("Continue With Ads")');
            console.log("Step 2: Continue With Ads");
            await wait();
            simulateMouseClick(adsBtn);

            const el2 = await waitForElement('div.button.large.accessBtn');
            console.log("Step 3: Go To Destination Again");
            await wait();
            simulateMouseClick(el2);

            const finalBtn = await waitForElement('button span:contains("Proceed to Safe Destination")');
            console.log("Step 4: Proceed to Safe Destination");
            await wait();
            simulateMouseClick(finalBtn.closest("button"));

            console.log("⏳ Waiting for final access button...");
            waitAndClickFinalButton('#access-offers', 5000);

        } catch (err) {
            console.error("⚠️ Script error:", err);
        }
    })();

    // 🔹 Add :contains() pseudo support
    (function() {
        const contains = (selector) => {
            const regex = /:contains\(["']?(.+?)["']?\)/;
            if (!regex.test(selector)) return null;
            const text = selector.match(regex)[1];
            const baseSelector = selector.replace(regex, '');
            return [...document.querySelectorAll(baseSelector)]
                .find(el => el.textContent.trim().includes(text));
        };

        document.querySelector = new Proxy(document.querySelector, {
            apply(target, thisArg, args) {
                if (args[0].includes(':contains')) {
                    return contains(args[0]);
                }
                return Reflect.apply(target, thisArg, args);
            }
        });
    })();

    // 🔹 Remove "done" banners
    const observer = new MutationObserver(() => {
        const banner = document.querySelector('.done-banner-container');
        if (banner) banner.remove();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
