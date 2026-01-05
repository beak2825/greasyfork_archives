// ==UserScript==
// @name         Twitter Zh
// @namespace    http://ayanamist.com/
// @version      0.1
// @description  Make Twitter lang=ja to lang=zh
// @author       ayanamist
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/5601/Twitter%20Zh.user.js
// @updateURL https://update.greasyfork.org/scripts/5601/Twitter%20Zh.meta.js
// ==/UserScript==
document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.forEach.call(document.querySelectorAll("*[lang=ja]"), function(el){el.setAttribute("lang","zh")});
});