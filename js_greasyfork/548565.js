// ==UserScript==
// @name         Reddit Auto Original Language Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirect translated Reddit URLs to the original post
// @author       Chinchill
// @icon         https://www.redditstatic.com/shreddit/assets/favicon/64x64.png
// @match        https://www.reddit.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548565/Reddit%20Auto%20Original%20Language%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/548565/Reddit%20Auto%20Original%20Language%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);
    if (url.searchParams.has('tl')) {
        url.searchParams.delete('tl');
        window.location.replace(url.toString());
    }
})();