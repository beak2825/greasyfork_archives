// ==UserScript==
// @name         Remove layer-ui__wrapper(UI) for excalidraw.
// @version      1.1
// @description  Removes all divs with class "layer-ui__wrapper" for excalidraw.
// @author       You
// @match        *://excalidraw.com/*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/1530000
// @downloadURL https://update.greasyfork.org/scripts/553507/Remove%20layer-ui__wrapper%28UI%29%20for%20excalidraw.user.js
// @updateURL https://update.greasyfork.org/scripts/553507/Remove%20layer-ui__wrapper%28UI%29%20for%20excalidraw.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove elements
    function removeUIWrappers() {
        document.querySelectorAll('div.layer-ui__wrapper').forEach(el => {
            el.remove();
            console.log('Removed layer-ui__wrapper div');
        });
    }

    // Delay 20 seconds before running
    window.addEventListener('load', () => {
        setTimeout(() => {
            console.log('Running cleanup after 20s delay...');
            removeUIWrappers();

            // Start observing the document for dynamically added elements after that
            const observer = new MutationObserver(() => {
                removeUIWrappers();
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });

        }, 235); // 20 seconds
    });
})();
