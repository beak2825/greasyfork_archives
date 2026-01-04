// ==UserScript==
// @name         Scribe.rip Dark Scrollbar
// @namespace    test
// @version      1.0
// @match        *://scribe.rip/*
// @run-at       document-start
// @license      Unlicense
// @description Dark Scrollbar for Scribe.rip (it probably has one already but Chrome is not getting it, this is my scotch tape fix for it)
// @downloadURL https://update.greasyfork.org/scripts/556943/Scriberip%20Dark%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/556943/Scriberip%20Dark%20Scrollbar.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const css = `
        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }
        ::-webkit-scrollbar-track {
            background: #111;
        }
        ::-webkit-scrollbar-thumb {
            background: #444;
            border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #666;
        }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.documentElement.appendChild(style);
})();
