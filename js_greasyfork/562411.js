// ==UserScript==
// @name         labo.tv 2chnews Dark Mode Force
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  強制的に黒背景＋文字色調整
// @match        http://labo.tv/2chnews/*
// @match        https://labo.tv/2chnews/*
// @grant        none
// @license　　　adsamalu4kia
// @downloadURL https://update.greasyfork.org/scripts/562411/labotv%202chnews%20Dark%20Mode%20Force.user.js
// @updateURL https://update.greasyfork.org/scripts/562411/labotv%202chnews%20Dark%20Mode%20Force.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        html, body {
            background: #000 !important;
            color: #ddd !important;
        }

        table, div, td, span, p {
            background: transparent !important;
            color: #ddd !important;
        }

        a {
            color: #6ab0ff !important;
        }

        /* iframe 内の 2ch ビューアを強制反転 */
        iframe {
            filter: invert(1) hue-rotate(180deg) !important;
            background: #000 !important;
        }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.documentElement.appendChild(style);
})();