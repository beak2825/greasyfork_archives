// ==UserScript==
// @name         YouTube "Latest" Filter Toggle
// @namespace    https://tampermonkey.net/
// @version      1.2
// @description  Adds a toggle button next to YouTube search filters to switch "Latest" results ON/OFF
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564385/YouTube%20%22Latest%22%20Filter%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/564385/YouTube%20%22Latest%22%20Filter%20Toggle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FILTER_PARAM = "sp=CAI%253D";
    const STORAGE_KEY = "yt-latest-filter-enabled";

    function isEnabled() {
        return localStorage.getItem(STORAGE_KEY) !== "off";
    }

    function setEnabled(state) {
        localStorage.setItem(STORAGE_KEY, state ? "on" : "off");
    }

    function applyFilterIfNeeded() {
        if (!isEnabled()) return;

        const url = new URL(location.href);

        if (url.pathname !== "/results") return;
        if (url.searchParams.has("sp")) return;

        url.search += (url.search ? "&" : "?") + FILTER_PARAM;
        location.replace(url.toString());
    }

    function createButton() {
        if (document.getElementById("yt-latest-toggle")) return;

        const button = document.createElement("button");
        button.id = "yt-latest-toggle";

        const updateText = () => {
            button.textContent = isEnabled() ? "Latest: ON" : "Latest: OFF";
            button.style.opacity = isEnabled() ? "1" : "0.5";
        };

        button.style.cssText = `
            margin-right: 12px;
            padding: 6px 10px;
            border-radius: 18px;
            border: 1px solid #3ea6ff;
            background: transparent;
            color: #3ea6ff;
            font-size: 13px;
            cursor: pointer;
            white-space: nowrap;
        `;

        button.onclick = () => {
            setEnabled(!isEnabled());
            updateText();
            applyFilterIfNeeded();
        };

        updateText();
        return button;
    }

    function insertButton() {
        const target =
            document.querySelector("ytd-search-sub-menu-renderer #container") ||
            document.querySelector("ytd-search-sub-menu-renderer");

        if (!target) return;

        if (document.getElementById("yt-latest-toggle")) return;

        const btn = createButton();
        if (btn) target.prepend(btn);
    }

    // obserwacja zmian (YouTube SPA)
    const observer = new MutationObserver(() => {
        insertButton();
        applyFilterIfNeeded();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // start
    setTimeout(() => {
        insertButton();
        applyFilterIfNeeded();
    }, 1000);

})();
