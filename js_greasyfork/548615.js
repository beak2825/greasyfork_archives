// ==UserScript==
// @name        YouTube Mobile Redirect (Safe)
// @namespace   youtube-mobile-redirect
// @match       https://www.youtube.com/*
// @run-at      document-start
// @grant       none
// @version     2
// @description Redirects to m.youtube.com only if user agent is mobile
// @downloadURL https://update.greasyfork.org/scripts/548615/YouTube%20Mobile%20Redirect%20%28Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548615/YouTube%20Mobile%20Redirect%20%28Safe%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

    if (isMobileUA && window.location.hostname === 'www.youtube.com') {
        window.location.replace(
            'https://m.youtube.com' + window.location.pathname + window.location.search
        );
    }
})();