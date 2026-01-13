// ==UserScript==
// @name         Disguise AI-Assistants as Wikipedia Tab 🤫
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces tab title and favicon with Wikipedia's
// @author       Agreasyforkuser
// @match        https://chatgpt.com/*
// @match        https://chat.qwen.ai/*
// @match        https://chat.deepseek.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562431/Disguise%20AI-Assistants%20as%20Wikipedia%20Tab%20%F0%9F%A4%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/562431/Disguise%20AI-Assistants%20as%20Wikipedia%20Tab%20%F0%9F%A4%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NEW_TITLE = "Wikipedia";
    const WIKI_ICON = 'https://en.wikipedia.org/static/favicon/wikipedia.ico?' + Date.now();

    function replaceFaviconAndTitle() {
        // Update tab title
        document.title = NEW_TITLE;
        // Remove all existing favicon links
        document.querySelectorAll('link[rel*="icon"], link[rel="shortcut icon"]').forEach(el => el.remove());
        // Inject custom favicon
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/x-icon';
        link.href = WIKI_ICON;
        document.head.appendChild(link);
    }

    // Wait until the page is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            replaceFaviconAndTitle();
            setInterval(replaceFaviconAndTitle, 10000);
        });
    } else {
        // if Page is already loaded
        replaceFaviconAndTitle();
        setInterval(replaceFaviconAndTitle, 10000);
    }
})();