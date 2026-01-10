// ==UserScript==
// @name         Fix ChatGPT firefox
// @namespace   shakda
// @version      1.0.1
// @description  JS patche for sometimes broken chatgpt
// @match        https://chatgpt.com/*
// @grant        none
// @license     MIT
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/562053/Fix%20ChatGPT%20firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/562053/Fix%20ChatGPT%20firefox.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const oldMeasure = performance.measure
    performance.measure = (...args) => {}
})();