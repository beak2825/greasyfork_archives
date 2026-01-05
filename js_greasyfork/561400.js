// ==UserScript==
// @name         Dark Mode
// @namespace    https://github.com/Alir85
// @version      1.0.0
// @description  Enable dark mode
// @author       Ali Rogers
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561400/Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/561400/Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        html {
            filter: invert(1) hue-rotate(180deg) contrast(0.8);
        }

        img,
        video,
        picture,
        canvas,
        iframe,
        embed {
            filter: invert(1) hue-rotate(180deg);
        }
   `;

    const styleElement = document.createElement('style');
    styleElement.textContent = css;

})();