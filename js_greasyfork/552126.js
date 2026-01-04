// ==UserScript==
// @version 1
// @name         Jenkins center header
// @namespace    http://tampermonkey.net/
// @description  flex is king
// @author       Louis Yvelin
// @match        https://jenkins.teads.net/*
// @icon         https://info.teads.com/hubfs/Teads_July2018%20Theme/Images/logo-teads-white.png
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/552126/Jenkins%20center%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/552126/Jenkins%20center%20header.meta.js
// ==/UserScript==

(function() {
    let header = document.querySelector("#page-header > div.page-header__brand");
    header.style.display = 'flex';
    header.style.alignItems = 'center';
})();