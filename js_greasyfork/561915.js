// ==UserScript==
// @name        eBay Dark Mode
// @namespace   ebay-dark-mode
// @description A dark mode look for eBay
// @author      DeviousD4n
// @version     0.2
// @license     MIT
// @include     https://*.ebay.*/*
// @match       https://itm.ebaydesc.com/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/561915/eBay%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/561915/eBay%20Dark%20Mode.meta.js
// ==/UserScript==

const style = document.createElement("style");

if (location.hostname === "itm.ebaydesc.com") {

    style.textContent = `
        img, picture, video, canvas, image,
        *[style*="background-image"] {
            filter: invert(1) hue-rotate(180deg) saturate(1.12) contrast(1.05) !important;
        }
    `;
} else {

    style.textContent = `
        html {
            filter: invert(1) hue-rotate(180deg) saturate(1.12) contrast(1.05) !important;
        }

        img, picture, video, canvas, image, .gh-logo {
            filter: invert(1) hue-rotate(180deg) !important;
        }

        html, body,
        .srp-river,
        #mainContent {
            background-color: rgb(235,235,235) !important;
        }

        .vim,
        .ux-navigator__container,
        .seo-interlink {
            background: transparent !important;
        }
    `;
}

document.documentElement.appendChild(style);