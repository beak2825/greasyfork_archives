// ==UserScript==
// @name         Torn Redirect to Forum
// @namespace    https://torn.com/
// @version      1.0
// @description  Redirect any torn.com URL to a specific forum page
// @match        https://www.torn.com/*
// @match        http://www.torn.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560611/Torn%20Redirect%20to%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/560611/Torn%20Redirect%20to%20Forum.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const targetUrl = 'https://www.torn.com/forums.php#/p=forums&f=67&b=0&a=0';

    // Prevent infinite redirect loop
    if (window.location.href !== targetUrl) {
        window.location.replace(targetUrl);
    }
})();
