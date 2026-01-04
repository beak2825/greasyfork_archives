// ==UserScript==
// @name         Hochi News
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  造訪 hochi.news
// @match        https://hochi.news/articles/*.html
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552263/Hochi%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/552263/Hochi%20News.meta.js
// ==/UserScript==

(function() {
    'use strict';
    location.replace(location.pathname + '?page=1');
})();
