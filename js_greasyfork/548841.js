// ==UserScript==
// @name         ChatGPT Auto Scroll to Bottom
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically keeps ChatGPT page scrolled to the bottom
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @license      GPL-v3
// @downloadURL https://update.greasyfork.org/scripts/548841/ChatGPT%20Auto%20Scroll%20to%20Bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/548841/ChatGPT%20Auto%20Scroll%20to%20Bottom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isAtBottom() {
        return Math.abs(window.innerHeight + window.scrollY - document.body.scrollHeight) < 5;
    }

    const observer = new MutationObserver(() => {
        if (isAtBottom()) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
