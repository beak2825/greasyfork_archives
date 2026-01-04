// ==UserScript==
// @name         Remove Youtube in-feed sponsor video ads suggestions
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides youtube in-feed sponsor video ads suggestions from homepage and video page
// @author       Shadterra
// @license         MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549632/Remove%20Youtube%20in-feed%20sponsor%20video%20ads%20suggestions.user.js
// @updateURL https://update.greasyfork.org/scripts/549632/Remove%20Youtube%20in-feed%20sponsor%20video%20ads%20suggestions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeAds() {
        const ads = document.querySelectorAll(
            "ytd-ad-slot-renderer, ytd-rich-item-renderer:has(> #content > ytd-ad-slot-renderer)"
        );
        ads.forEach(ad => ad.remove());
    }
    window.addEventListener('load', removeAds);

    const observer = new MutationObserver(removeAds);
    observer.observe(document.body, { childList: true, subtree: true });
})();