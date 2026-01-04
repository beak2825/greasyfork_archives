// ==UserScript==
// @name         CyTube Full Date Timestamps (Cross-browser)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Show full date and time in chat timestamps for your view
// @match        https://cytu.be/r/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549946/CyTube%20Full%20Date%20Timestamps%20%28Cross-browser%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549946/CyTube%20Full%20Date%20Timestamps%20%28Cross-browser%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function formatDate(d) {
        return d.getFullYear() + "-" +
               String(d.getMonth() + 1).padStart(2,"0") + "-" +
               String(d.getDate()).padStart(2,"0") + " " +
               String(d.getHours()).padStart(2,"0") + ":" +
               String(d.getMinutes()).padStart(2,"0") + ":" +
               String(d.getSeconds()).padStart(2,"0");
    }

    function processNode(node) {
        if (!(node instanceof HTMLElement)) return;
        const ts = node.querySelector(".timestamp");
        if (ts && !ts.dataset.dateAdded) {
            const now = new Date();
            ts.textContent = "[" + formatDate(now) + "]";
            ts.dataset.dateAdded = "true";
        }
    }

    function initObserver() {
        const chat = document.getElementById("messagebuffer");
        if (!chat) return;

        // Process existing messages (in case user loads with backlog)
        chat.querySelectorAll(".timestamp").forEach(ts => {
            if (!ts.dataset.dateAdded) {
                const now = new Date();
                ts.textContent = "[" + formatDate(now) + "]";
                ts.dataset.dateAdded = "true";
            }
        });

        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                m.addedNodes.forEach(processNode);
            });
        });

        observer.observe(chat, { childList: true, subtree: true });
    }

    // Keep checking until #messagebuffer exists (more reliable in Firefox)
    function waitForChat() {
        const chat = document.getElementById("messagebuffer");
        if (chat) {
            initObserver();
        } else {
            setTimeout(waitForChat, 500);
        }
    }

    waitForChat();
})();
