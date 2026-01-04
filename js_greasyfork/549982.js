// ==UserScript==
// @name         F95 Spoiler No AutoScroll (Mobile)
// @namespace    Violentmonkey Scripts
// @version      1.1
// @description  Prevents automatic scrolling when opening spoilers on F95zone mobile version
// @author       Nakimor
// @license MIT
// @match        https://f95zone.to/*
// @icon         https://f95zone.to/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549982/F95%20Spoiler%20No%20AutoScroll%20%28Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549982/F95%20Spoiler%20No%20AutoScroll%20%28Mobile%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Override scrollIntoView only for spoilers
    const originalScroll = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function(...args) {
        // If the element is inside a spoiler, ignore the scroll
        if (this.closest('.bbCodeSpoiler-content')) {
            return; // do nothing
        }
        // Otherwise, perform normal scroll
        return originalScroll.apply(this, args);
    };
})();