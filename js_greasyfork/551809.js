// ==UserScript==
// @name         X → XCancel Redirect
// @namespace    http://tampermonkey.net/
// @version      v3.0
// @license      MIT
// @description  Instantly redirects x.com to xcancel.com, replacing current tab.
// @author       83
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551809/X%20%E2%86%92%20XCancel%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/551809/X%20%E2%86%92%20XCancel%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const newUrl = location.href.replace('https://x.com', 'https://xcancel.com');
    if (newUrl !== location.href) {
    location.replace(newUrl);
    }
})();
