// ==UserScript==
// @name         Alt Text Tooltip for Images
// @description  Show the alt text as a tooltip when hovering over images
// @match        *://*/*
// @version 0.0.1.20251110191738
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/555442/Alt%20Text%20Tooltip%20for%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/555442/Alt%20Text%20Tooltip%20for%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add event listener to show tooltip when hovering over an image
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('mouseover', function() {
            // Set the tooltip text to the alt text of the image
            img.title = img.alt;
        });
    });

})();
