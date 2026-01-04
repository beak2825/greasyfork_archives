// ==UserScript==
// @name         Block backdrops-container on Torn
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides elements with the class "backdrops-container"
// @author       BritishBenji
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551159/Block%20backdrops-container%20on%20Torn.user.js
// @updateURL https://update.greasyfork.org/scripts/551159/Block%20backdrops-container%20on%20Torn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('.backdrops-container { display: none !important; }');
})();