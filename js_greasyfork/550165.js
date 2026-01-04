// ==UserScript==
// @name         Qwen Chat - Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-submit query ONLY when URL matches: /?inputFeature=search&q=... + Clears intervals on nav
// @author       Benyamin Limanto <me@benyamin.xyz>
// @match        https://chat.qwen.ai/?inputFeature=search&q=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550165/Qwen%20Chat%20-%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/550165/Qwen%20Chat%20-%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const activeIntervals = new Set();

    function clearAllIntervals() {
        activeIntervals.forEach(id => clearInterval(id));
        activeIntervals.clear();
        console.log("[Qwen AutoSubmit] All intervals cleared.");
    }

    // Parse URL
    const url = new URL(window.location.href);
    const inputFeature = url.searchParams.get('inputFeature');
    const query = url.searchParams.get('q');

    // 🔍 DEBUG: Log raw values
    console.log(`[Qwen AutoSubmit] Parsed URL params → inputFeature: "${inputFeature}", q: "${query}"`);

    // ✅ Fix: Better condition + accurate logging
    if (inputFeature === null || inputFeature.trim().toLowerCase() !== 'search') {
        console.log(`[Qwen AutoSubmit] ❌ Script skipped: inputFeature must be 'search' (case-insensitive). Got: "${inputFeature}"`);
        return;
    }

    if (!query || query.trim() === '') {
        console.log("[Qwen AutoSubmit] ❌ Script skipped: 'q' parameter is missing or empty.");
        return;
    }

    console.log("[Qwen AutoSubmit] ✅ Conditions met. Starting auto-submit process...");

    const CHECK_INTERVAL = 300;
    const MAX_RETRIES = 20;
    let retries = 0;

    function autoSubmitQuery() {
        const input = document.querySelector("#chat-input");
        if (!input) {
            console.warn("[Qwen AutoSubmit] Input not found yet...");
            return false;
        }

        input.value = query;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();

        console.log(`[Qwen AutoSubmit] Query injected. Waiting for Send button...`);

        const waitForSendButton = setInterval(() => {
            const sendButton = document.querySelector("#send-message-button");

            if (!sendButton) {
                console.warn("[Qwen AutoSubmit] Send button still not found...");
                retries++;
                if (retries > MAX_RETRIES) {
                    clearInterval(waitForSendButton);
                    activeIntervals.delete(waitForSendButton);
                    console.error("[Qwen AutoSubmit] ❌ Timed out waiting for Send button.");
                }
                return;
            }

            if (sendButton.disabled === false && window.getComputedStyle(sendButton).display !== 'none') {
                clearInterval(waitForSendButton);
                activeIntervals.delete(waitForSendButton);
                console.log("[Qwen AutoSubmit] ✅ Send button ready. Clicking...");

                setTimeout(() => {
                    sendButton.click();
                    console.log("[Qwen AutoSubmit] 🚀 Sent successfully!");

                    monitorUrlChangeAndCleanup();
                }, 100);

            } else {
                console.log("[Qwen AutoSubmit] Send button found but not ready...");
                retries++;
                if (retries > MAX_RETRIES) {
                    clearInterval(waitForSendButton);
                    activeIntervals.delete(waitForSendButton);
                    console.error("[Qwen AutoSubmit] ❌ Timed out waiting for button to enable.");
                }
            }
        }, CHECK_INTERVAL);

        activeIntervals.add(waitForSendButton);
        return true;
    }

    function monitorUrlChangeAndCleanup() {
        const originalPath = window.location.pathname;
        const urlObserver = setInterval(() => {
            if (window.location.pathname !== originalPath) {
                console.log(`[Qwen AutoSubmit] 🔄 Detected navigation to: ${window.location.pathname}. Cleaning up...`);
                clearAllIntervals();
                clearInterval(urlObserver);
            }
        }, 500);
        activeIntervals.add(urlObserver);
    }

    if (!autoSubmitQuery()) {
        const retryInterval = setInterval(() => {
            if (autoSubmitQuery()) {
                clearInterval(retryInterval);
                activeIntervals.delete(retryInterval);
            }
        }, CHECK_INTERVAL);
        activeIntervals.add(retryInterval);
    }

})();