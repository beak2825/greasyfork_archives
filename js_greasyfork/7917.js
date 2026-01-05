// ==UserScript==
// @name         CH MTG Report Warning
// @author       clickhappier
// @namespace    clickhappier
// @description  Make it obvious if you click on 'Report' instead of 'Reputation' for a post on the MTurkGrind forum (Xenforo).
// @version      1.0c
// @match        http://www.mturkgrind.com/*
// @match        http://mturkgrind.com/*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/7917/CH%20MTG%20Report%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/7917/CH%20MTG%20Report%20Warning.meta.js
// ==/UserScript==


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('form[action*="report"] { background-color: #FA840E ! important; }');  // orange background for report form dialog
addGlobalStyle('a.report { color: #FA840E ! important; }');  // orange text for report links
addGlobalStyle('a.report:before, a.report:after { content: "!!" }');  // add exclamation points to report links
