// ==UserScript==
// @name         DotNetFiddle Font Changer
// @namespace    http://tampermonkey.net/
// @version      2025-09-22
// @description  将 DotNetFiddle 代码编辑器的字体改为 Consolas
// @author       moeote
// @match        https://dotnetfiddle.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dotnetfiddle.net
// @homepage     https://greasyfork.org/zh-CN/scripts/550379-dotnetfiddle-font-changer
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550379/DotNetFiddle%20Font%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/550379/DotNetFiddle%20Font%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .CodeMirror pre {
            font-family: Consolas, monospace !important;
        }
    `;
    document.head.appendChild(style);
})();
