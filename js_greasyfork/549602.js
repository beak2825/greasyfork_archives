// ==UserScript==
// @name         Qidian.com Translate Enabler 2
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enable Google Translate on qidian.com
// @author       A nobody
// @match        https://www.qidian.com/*
// @match        *://www.qidian.com/*
// @match        *://book.qidian.com/*
// @match        *://m.qidian.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549602/Qidiancom%20Translate%20Enabler%202.user.js
// @updateURL https://update.greasyfork.org/scripts/549602/Qidiancom%20Translate%20Enabler%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here
    let html_tag = document.getElementsByTagName("html")[0];
    html_tag.setAttribute("translate", "yes");
    html_tag.classList.remove("notranslate");
})();
