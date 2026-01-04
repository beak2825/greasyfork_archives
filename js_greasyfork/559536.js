// ==UserScript==
// @name         bypass rule34 video context menu
// @namespace    https://github.com/mistaairline/rule34xxx-rightclick-preventer/tree/v.1.00
// @version      1.0.1
// @description  bypass rule34 video context menu and show default browser context menu
// @match        https://rule34.xxx/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559536/bypass%20rule34%20video%20context%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/559536/bypass%20rule34%20video%20context%20menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isVideoTarget(e) {
        return e.target instanceof HTMLVideoElement ||
                e.target.closest && e.target.closest('video');
    }


    ['mousedown', 'pointerdown', 'contextmenu'].forEach(type => {
        document.addEventListener(type, function(e) {
            if (e.button !== 2) return;
            if (!isVideoTarget(e)) return;

            e.stopImmediatePropagation();

        }, true);
    });
    
})();