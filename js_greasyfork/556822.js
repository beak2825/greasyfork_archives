// ==UserScript==
// @name        Fix AP Classroom Math Input Error
// @namespace   Violentmonkey Scripts
// @match       *://apclassroom.collegeboard.org/*
// @grant       none
// @version     1.0
// @author      CyrilSLi
// @description Fix the issue of mathematical expressions displaying as "Math input error"
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/556822/Fix%20AP%20Classroom%20Math%20Input%20Error.user.js
// @updateURL https://update.greasyfork.org/scripts/556822/Fix%20AP%20Classroom%20Math%20Input%20Error.meta.js
// ==/UserScript==

window.MathJax = {
    version: "3.2.2",
    typesetPromise: () => {}
};