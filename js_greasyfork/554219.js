// ==UserScript==
// @name         Thingiverse Navigation Helpers
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Tools for Thingiverse. Adding ability to navigate easier using Left and Right Arrow key
// @author       Mirido
// @license      MIT
// @match        https://www.thingiverse.com/*
// @exclude      https://www.thingiverse.com/thing:*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thingiverse.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554219/Thingiverse%20Navigation%20Helpers.user.js
// @updateURL https://update.greasyfork.org/scripts/554219/Thingiverse%20Navigation%20Helpers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.key == 'ArrowRight' || event.key == 'ArrowLeft') {
            event.preventDefault();

            const url = new URL(window.location.href);

            const params = new URLSearchParams(window.location.search);
            const paramValue = params.get('page');
            if (paramValue == null) {
                if (event.key == 'ArrowLeft') return;
                url.searchParams.append('page', 2);
            } else {
                if (event.key == 'ArrowRight') {
                    url.searchParams.set('page', parseInt(paramValue) + 1);
                } else {
                    if (paramValue == 2) {
                        url.searchParams.delete('page');
                    } else {
                        url.searchParams.set('page', parseInt(paramValue) - 1);
                    }
                }
            }
            window.location.href = url.toString();
        }
    });
})();