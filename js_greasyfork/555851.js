// ==UserScript==
// @name        Video Enhancer Color Grading (Always On)
// @version     1.1
// @description Applies a saturation(1.3) filter to all HTML5 videos.
// @match       *://*/*
// @grant       GM_addStyle
// @run-at      document-start
// @namespace https://greasyfork.org/users/1402168
// @downloadURL https://update.greasyfork.org/scripts/555851/Video%20Enhancer%20Color%20Grading%20%28Always%20On%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555851/Video%20Enhancer%20Color%20Grading%20%28Always%20On%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const saturationFilter = 'video { filter: saturate(1.3) !important; }';

    GM_addStyle(saturationFilter);

    const styleElement = document.createElement('style');
    styleElement.textContent = saturationFilter;

    const originalAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function(init) {
        const shadowRoot = originalAttachShadow.call(this, init);
        shadowRoot.appendChild(styleElement.cloneNode(true));
        return shadowRoot;
    };

    function applyToExistingShadows(rootNode) {
        rootNode.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) {
                el.shadowRoot.appendChild(styleElement.cloneNode(true));
                // Recurse in case of nested shadow DOMs
                applyToExistingShadows(el.shadowRoot);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        applyToExistingShadows(document.documentElement);
    });
})();