// ==UserScript==
// @name        bring back the realkana fish
// @namespace   Violentmonkey Scripts
// @match       *://*.realkana.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2026-01-19, 5:09:30 a.m.
// @run-at        document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563228/bring%20back%20the%20realkana%20fish.user.js
// @updateURL https://update.greasyfork.org/scripts/563228/bring%20back%20the%20realkana%20fish.meta.js
// ==/UserScript==

new MutationObserver(function(mutations) {
     var box = document.querySelector('.mui-m7rx7e.MuiBox-root');
        if (box) {
            box.style.backgroundImage = "url('https://i.imgur.com/coKIyVo.jpeg')";
            box.style.backgroundSize = "cover";
            this.disconnect(); // disconnect the observer
        }
    }
).observe(document, {childList: true, subtree: true});