// ==UserScript==
// @name        c.ai auto-remove slowmode popup
// @namespace   Violentmonkey Scripts
// @match       https://character.ai/chat/*
// @grant       none
// @version     1.0
// @author      Kana
// @license     MIT
// @description i was annoyed at the popup so i got rid of it
// @downloadURL https://update.greasyfork.org/scripts/555963/cai%20auto-remove%20slowmode%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/555963/cai%20auto-remove%20slowmode%20popup.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const selector = "#chat-messages > div.flex.items-center.justify-center.my-2.cursor-pointer";
    function removeTarget() {
        const el = document.querySelector(selector);
        if (el) {
            el.remove();
            console.log("Removed target element");
        }
    }
    removeTarget();
    const observer = new MutationObserver(() => removeTarget());
    observer.observe(document.body, { childList: true, subtree: true });
})();
