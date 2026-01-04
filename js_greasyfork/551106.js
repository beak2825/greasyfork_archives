// ==UserScript==
// @name         Terminalsim
// @description  turn every font on WebSim to Terminal (yes this was made with ai im sorry)
// @version      epic
// @author       ninjaboy (epic_guy)
// @match        https://websim.com/*
// @match        https://*.websim.com/*
// @match        *://*websim.*/*
// @icon         https://websim.ai/favicon.ico
// @run-at       document-start
// @license MIT
// @namespace ninjaboy999096.vercel.app
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551106/Terminalsim.user.js
// @updateURL https://update.greasyfork.org/scripts/551106/Terminalsim.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const css = `
        /* force Terminal font everywhere */
        * {
            font-family: "Terminal", monospace !important;
        }
    `;

    const styleTag = document.createElement('style');
    styleTag.setAttribute('data-terminalsim', 'true');
    styleTag.appendChild(document.createTextNode(css));

    const insertStyle = () => {
        if (!document.documentElement) return setTimeout(insertStyle, 2);
        const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        head.appendChild(styleTag);
    };
    insertStyle();

    console.log('TerminalSim: All fonts forced to Terminal.');
})();
