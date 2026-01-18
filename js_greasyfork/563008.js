// ==UserScript==
// @name         Skyskraber AU2
// @namespace    local.skyskraber.au2
// @version      1.2.0
// @description  Sends a message every 15 minutes while inactive
// @match        https://www.skyskraber.dk/chat*
// @match        https://skyskraber.dk/chat*
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/563007/Skyskraber%20Core.user.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563008/Skyskraber%20AU2.user.js
// @updateURL https://update.greasyfork.org/scripts/563008/Skyskraber%20AU2.meta.js
// ==/UserScript==

(() => {
    "use strict";

    console.log("[AU2] Script loaded, version 1.2.0");

    const CHAT_MESSAGE = "😴";
    const CHAT_INTERVAL = 15 * 60 * 1000;
    const AUTO_RESUME_MS = 3 * 60 * 1000;

    const STORAGE_OFF = "AU2_OFF";
    const STORAGE_INDICATOR = "AU2_INDICATOR_VISIBLE";

    let chatTimer = null;
    let state = "IDLE"; // IDLE | RUNNING | PAUSED | OFF
    let lastUserActionAt = Date.now();
    let au2Sending = false;
    let enabled = true;

    const isOff = () => localStorage.getItem(STORAGE_OFF) === "true";
    const setOff = v => localStorage.setItem(STORAGE_OFF, String(v));
    const indicatorVisible = () => localStorage.getItem(STORAGE_INDICATOR) !== "false";

    /******************************************************************
     * INITIALIZATION - Wait for Core
     ******************************************************************/
    async function waitForCore() {
        console.log("[AU2] waitForCore called");
        while (!window.SkyskraberCore) {
            await new Promise(r => setTimeout(r, 100));
        }
    }

    /******************************************************************
     * CHAT
     ******************************************************************/
    function sendChat() {
        console.log("[AU2] sendChat called");
        if (state !== "RUNNING" || !window.SkyskraberCore.isConnected()) return;
        au2Sending = true;
        window.SkyskraberCore.send({
            type: "chat",
            data: { message: CHAT_MESSAGE }
        });
        au2Sending = false;
    }

    function schedule(delay = CHAT_INTERVAL) {
        console.log("[AU2] schedule called with delay", delay);
        if (state !== "RUNNING") return;
        clearTimeout(chatTimer);
        chatTimer = setTimeout(() => {
            sendChat();
            schedule();
        }, delay);
    }

    function stopTimer() {
        console.log("[AU2] stopTimer called");
        clearTimeout(chatTimer);
        chatTimer = null;
    }

    /******************************************************************
     * PAUSE / RESUME
     ******************************************************************/
    function pause() {
        console.log("[AU2] pause called");
        if (state !== "RUNNING") return;
        state = "PAUSED";
        lastUserActionAt = Date.now();
        stopTimer();
        updateIndicator();
    }

    function resume() {
        console.log("[AU2] resume called");
        if (state !== "PAUSED" || isOff()) return;
        state = "RUNNING";
        schedule();
        updateIndicator();
    }

    setInterval(() => {
        if (state === "PAUSED" && Date.now() - lastUserActionAt >= AUTO_RESUME_MS) {
            resume();
        }
    }, 1000);

    /******************************************************************
     * INDICATOR
     ******************************************************************/
    function updateIndicator() {
        console.log("[AU2] updateIndicator called");
        // No longer needed - Core always shows status via buttons
    }

    /******************************************************************
     * INIT
     ******************************************************************/
    async function start() {
        console.log("[AU2] start called");
        await waitForCore();

        // Load enabled state from storage
        enabled = localStorage.getItem("AU2_ENABLED") !== "false";

        // Add enable/disable button
        window.SkyskraberCore.addIndicatorButton(enabled ? "Disable AU2" : "Enable AU2", () => {
            enabled = !enabled;
            localStorage.setItem("AU2_ENABLED", String(enabled));
        });

        // Add control buttons
        window.SkyskraberCore.addIndicatorButton("Toggle", () => {
            const off = !isOff();
            setOff(off);
            state = off ? "OFF" : (window.SkyskraberCore.isConnected() ? "RUNNING" : "IDLE");
            off ? stopTimer() : schedule();
        });

        window.SkyskraberCore.addIndicatorButton("Resume", () => {
            if (state === "PAUSED") {
                resume();
            }
        });

        // Listen for incoming messages
        window.SkyskraberCore.onMessage((msg) => {
            if (enabled && msg?.player?.newHour === true) {
                window.SkyskraberCore.send({ type: "hour" });
            }
        });

        // Listen for outgoing messages
        window.SkyskraberCore.onSend((msg) => {
            if (enabled && !au2Sending && state === "RUNNING") {
                if (msg?.type === "chat") pause();
                if (msg?.type === "move") pause();
                if (msg?.type === "goto") pause();
            }

            return true;
        });

        state = isOff() ? "OFF" : "IDLE";

        // Start running when connected
        const checkConnection = setInterval(() => {
            if (enabled && window.SkyskraberCore.isConnected() && state === "IDLE" && !isOff()) {
                state = "RUNNING";
                schedule();
                clearInterval(checkConnection);
            }
        }, 100);
    }

    console.log("[AU2] IIFE executing, about to call start()");
    start();
})();
