// ==UserScript==
// @name         Arialsim
// @description  turn every font on WebSim to Arial (yes this was made with ai im sorry)
// @version      epic.1
// @author       ninjaboy (epic_guy)
// @match        https://websim.com/*
// @match        https://*.websim.com/*
// @match        *://*websim.*/*
// @icon         https://websim.ai/favicon.ico
// @run-at       document-start
// @license MIT
// @namespace ninjaboy999096.vercel.app
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550704/Arialsim.user.js
// @updateURL https://update.greasyfork.org/scripts/550704/Arialsim.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const styleTag = document.createElement('style');
    styleTag.setAttribute('data-arialsim', 'true');

    // Decide font size based on element size class (heuristic)
    // - bigger text: font-size >= 18px → 25px
    // - smaller text: font-size < 18px → 14.5px
    const css = `
        * {
            font-family: Arial, Helvetica, sans-serif !important;
        }
    `;

    styleTag.appendChild(document.createTextNode(css));

    const insertStyle = () => {
        if (!document.documentElement) return setTimeout(insertStyle, 2);
        const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        head.appendChild(styleTag);
    };
    insertStyle();

    console.log('Arialsim: All fonts forced to Arial.');
})();
