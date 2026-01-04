// ==UserScript==
// @name         Blooket Sidebar Page Buttons (Above Bottom Row)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  jsjsjjs
// @match        https://*.blooket.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556021/Blooket%20Sidebar%20Page%20Buttons%20%28Above%20Bottom%20Row%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556021/Blooket%20Sidebar%20Page%20Buttons%20%28Above%20Bottom%20Row%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTONS = [
        { label: "Games",   icon: "fas fa-gamepad",   href: "/games" },
        { label: "Chat",    icon: "fas fa-comments",  href: "/chat" },
        { label: "Plugins", icon: "fas fa-plug",      href: "/plugins" },
        { label: "Themes",  icon: "fas fa-palette",   href: "/themes" }
    ];

    function waitForSidebar() {
        const sidebar = document.querySelector("div._sidebar_l4eyq_1");
        const sample  = document.querySelector("a._pageButton_l4eyq_70");
        const bottom  = document.querySelector("div._bottomRow_l4eyq_112");

        if (!sidebar || !sample || !bottom) {
            requestAnimationFrame(waitForSidebar);
            return;
        }

        injectButtons(sidebar, sample, bottom);
    }

    function injectButtons(sidebar, sample, bottom) {
        if (sidebar.dataset.customAdded === "true") return;
        sidebar.dataset.customAdded = "true";

        BUTTONS.forEach(btn => {
            const clone = sample.cloneNode(true);

            // Replace icon
            const icon = clone.querySelector("i");
            if (icon) icon.className = `_pageIcon_l4eyq_100 ${btn.icon}`;

            // Replace text
            const text = clone.querySelector("div");
            if (text) text.textContent = btn.label;

            // Update link
            clone.href = btn.href;

            // Insert above the bottom row
            sidebar.insertBefore(clone, bottom);
        });
    }

    waitForSidebar();
})();
