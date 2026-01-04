// ==UserScript==
// @name         Instagram Right-Click (Images Only)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enable right-click on Instagram images
// @author       aurangzeb
// @license      MIT
// @match        https://www.instagram.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557100/Instagram%20Right-Click%20%28Images%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557100/Instagram%20Right-Click%20%28Images%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('mousedown', function(e) {
        if (e.button === 2) {
            let elements = document.elementsFromPoint(e.clientX, e.clientY);
            let imgIndex = elements.findIndex(el => el.tagName === 'IMG');
            if (imgIndex !== -1) {
                let overlays = elements.slice(0, imgIndex);
                overlays.forEach(el => el.style.pointerEvents = 'none');
                setTimeout(() => {
                    overlays.forEach(el => el.style.pointerEvents = 'auto');
                }, 200);
            }
        }
    }, true);
})();