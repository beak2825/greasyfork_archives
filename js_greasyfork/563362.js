// ==UserScript==
// @name         虹色解除
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  虹色無効化
// @author       ワイ
// @match        https://*.open2ch.net/test/read.cgi/*
// @license	     CC0-1.0
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563362/%E8%99%B9%E8%89%B2%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/563362/%E8%99%B9%E8%89%B2%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style');
    style.textContent = `
        h1.rainbow_css {
            background: none !important;
            -webkit-background-clip: unset !important;
            -webkit-text-fill-color: red !important;
            animation: none !important;
        }
    `;
    document.head.appendChild(style);
})();