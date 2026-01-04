// ==UserScript==
// @name        Clean GitHub URLs
// @namespace   felixhummel
// @match       *://github.com/*
// @grant       none
// @version     1.0
// @author      Felix Hummel
// @description Remove tab parameters from GitHub URLs
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553594/Clean%20GitHub%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/553594/Clean%20GitHub%20URLs.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const url = new URL(window.location.href);
    if (url.searchParams.has('tab')) {
        url.searchParams.delete('tab');
        window.history.replaceState({}, document.title, url.toString());
    }
})();