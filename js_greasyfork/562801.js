// ==UserScript==
// @name         Force YouTube Fullscreen
// @namespace    lander_scripts
// @version      1.0
// @description  Adds allowfullscreen attributes to all YouTube iframes
// @author       Lander
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562801/Force%20YouTube%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/562801/Force%20YouTube%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enableFullscreen() {
        // Find all iframes that point to YouTube
        const iframes = document.querySelectorAll('iframe[src*="youtube.com/embed/"]');

        iframes.forEach(iframe => {
            // Add the standard attribute
            if (!iframe.hasAttribute('allowfullscreen')) {
                iframe.setAttribute('allowfullscreen', 'true');
            }

            // Update the Permissions Policy (the modern way browsers handle it)
            let currentAllow = iframe.getAttribute('allow') || "";
            if (!currentAllow.includes('fullscreen')) {
                iframe.setAttribute('allow', currentAllow + "; fullscreen");
            }

            // Refresh the iframe src slightly to force the browser to recognize the new permissions
            // Note: We only do this once to avoid infinite loops
            if (!iframe.dataset.fsFixed) {
                iframe.src = iframe.src;
                iframe.dataset.fsFixed = "true";
            }
        });
    }

    // Run once on load
    enableFullscreen();

    // Also watch for iframes loaded dynamically (like in "load more" sections)
    const observer = new MutationObserver(enableFullscreen);
    observer.observe(document.body, { childList: true, subtree: true });
})();