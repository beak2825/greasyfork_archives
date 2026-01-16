// ==UserScript==
// @name         ChatGPT - Hide Old Messages
// @namespace    https://mekineer.com
// @version      1.3
// @description  Manual HIDE/SHOW button.  Purpose: Hide older ChatGPT messages to reduce UI lag/freezing.
// @author       Ross M + tweak by mekineer and Nova (ChatGPT 5.2 Thinking)
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562710/ChatGPT%20-%20Hide%20Old%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/562710/ChatGPT%20-%20Hide%20Old%20Messages.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MAX_VISIBLE_MESSAGES = 8;

    let currentThread = null;        // currently observed #thread element
    let threadObserver = null;       // MutationObserver for messages

    let hiddenMode = false;         // manual toggle
    let hiddenApplied = false;      // track whether we've actually hidden anything

    function createShowAllButton(messages) {
        const existing = document.getElementById("showAllMessagesBtn");

        const btn = existing || document.createElement("button");
        btn.textContent = hiddenMode ? "SHOW" : "HIDE";
        btn.id = "showAllMessagesBtn";
        if (!existing) {
            Object.assign(btn.style, {
                position: "fixed",
                top: "50px",
                right: "10px",
                zIndex: 9999,
                padding: "10px",
                backgroundColor: "#10a37f",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px"
            });
            document.body.appendChild(btn);
        }

        btn.onclick = () => {
            hiddenMode = !hiddenMode;
            hideOldMessages();
        };
    }

    function hideOldMessages() {
        const thread = document.querySelector("#thread");
        if (!thread) return;

        const messages = Array.from(thread.querySelectorAll("article"));
        if (messages.length > MAX_VISIBLE_MESSAGES) {
            createShowAllButton(messages);

            if (!hiddenMode) {
                if (hiddenApplied) {
                    messages.forEach(msg => (msg.style.display = ""));
                    hiddenApplied = false;
                }
                return;
            }

            messages.forEach((msg, idx) => {
                msg.style.display = (idx < messages.length - MAX_VISIBLE_MESSAGES) ? "none" : "";
            });
            hiddenApplied = true;
        } else {
            // If there are few messages, ensure they are visible and remove button if exists
            messages.forEach(msg => (msg.style.display = ""));
            hiddenApplied = false;
            const btn = document.getElementById("showAllMessagesBtn");
            if (btn) btn.remove();
        }
    }

    // Attach the message observer to the current #thread
    function attachToThread() {
        const container = document.querySelector("#thread");
        if (!container || container === currentThread) {
            return; // nothing new
        }

        currentThread = container;

        if (threadObserver) {
            threadObserver.disconnect();
        }

        threadObserver = new MutationObserver(hideOldMessages);
        threadObserver.observe(container, { childList: true, subtree: true });

        // Run once immediately for the currently loaded messages
        hideOldMessages();
    }

    // Watch the whole app for SPA route changes and DOM swaps of #thread
    const appObserver = new MutationObserver(() => {
        attachToThread();
    });

    // Start observing the whole document for changes
    appObserver.observe(document.body, { childList: true, subtree: true });

    // Initial run in case #thread is already present
    attachToThread();
})();
