// ==UserScript==
// @name         Vouch Checkout
// @namespace    Violentmonkey Scripts
// @version      0.3
// @match        https://app.vouchconcierge.com/hotelboss/*
// @description  for vouch checkout room
// @author       Eric
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561660/Vouch%20Checkout.user.js
// @updateURL https://update.greasyfork.org/scripts/561660/Vouch%20Checkout.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Helper: wait for element by ID, then delay 1s before click
    function waitAndClickById(id) {
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                const el = document.getElementById(id);
                if (el) {
                    clearInterval(timer);
                    clearTimeout(timeoutTimer);
                    console.log("Found:", id, "→ waiting 1s before click...");
                    setTimeout(() => {
                        el.click();
                        console.log("Clicked:", id);
                        resolve(el);
                    }, 1000);
                }
            }, 500); // hardcoded polling interval

            const timeoutTimer = setTimeout(() => {
                clearInterval(timer);
                console.warn("Timeout waiting for:", id);
                reject(new Error(`Timeout: ${id} not found within 120s`));
            }, 120000);
        });
    }

    // Process one pair sequentially
    async function processPair(roomNum, lastName) {
        // Re-query fresh DOM elements each time
        const roomInput = document.getElementById("fetchbyroomid-form-roomnumber");
        const lastNameInput = document.getElementById("fetchbyroomid-form-lastname");
        const checkoutButton = document.getElementById("fetchbyroomid-button-checkout");

        if (!roomInput || !lastNameInput || !checkoutButton) {
            console.error("❌ Required form elements not found on this page");
            return;
        }

        // Fill inputs
        roomInput.value = roomNum;
        roomInput.dispatchEvent(new Event("input", { bubbles: true }));

        lastNameInput.value = lastName;
        lastNameInput.dispatchEvent(new Event("input", { bubbles: true }));

        // Click initial checkout → triggers page load
        checkoutButton.click();

        try {
            await waitAndClickById("checkout-button-checkout");
            await waitAndClickById("fetchbynumber-button-checkout");
            await waitAndClickById("completed-checkout-secondary-message");

            // Navigate to target URL
            window.location.href = "https://app.vouchconcierge.com/hotelboss/checkout#/fetchbyroomid";

            // After navigation, wait for fetch-by-room-number field, then click
            await waitAndClickById("fetchbyroomid-form-roomnumber");

            console.log(`✅ Checked out room ${roomNum} for ${lastName}`);
        } catch (err) {
            console.error(`❌ Failed processing room ${roomNum}:`, err.message);
        }
    }

    function getClip() {
        return navigator.clipboard.readText().then(text => text).catch(() => { return prompt("paste"); });
    }

    window.addEventListener('keyup', function (e) {
        if (e.altKey) {
            const key = e.key.toLowerCase();
            if (key == "c") {
                (async () => {
                    let parts = await getClip();
                    parts = parts.split(",");
                    for (let i = 0; i < parts.length; i += 2) {
                        const roomNum = parts[i];
                        const lastName = parts[i + 1];
                        await processPair(roomNum, lastName);
                    }
                    console.log("🎉 All rooms processed");
                })();
            }
        }
    });
})();