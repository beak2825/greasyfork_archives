// ==UserScript==
// @name        DailyMail remove paywall only
// @description DailyMail remove paywall only and expands article
// @include     https://www.dailymail.co.uk/*
// @version     0.1
// @grant       none
// @namespace https://greasyfork.org/users/1559615
// @downloadURL https://update.greasyfork.org/scripts/562444/DailyMail%20remove%20paywall%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/562444/DailyMail%20remove%20paywall%20only.meta.js
// ==/UserScript==

(function() {
    'use strict';
        setInterval(() => {
            document.querySelector('div[itemprop=articleBody]')?.removeAttribute('style');
            document.querySelector('.related-replace-paywall')?.remove();
        }, 1000);
})();

