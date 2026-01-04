// ==UserScript==
// @name         adblock
// @namespace    adblock
// @version      0.0.1
// @description  all adblock
// @author       1984kg
// @include      /^https?:\/\/([^.]+\.)?(blacktoon|booktoki|newtoki|manatoki)\d+\.(com|net)\//
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551940/adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/551940/adblock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // https://greasyfork.org/
    // @match       *://*/**/
    // @match        https://blacktoon395.com/
    // @include      /^https?:\/\/([^.]+\.)?blacktoon\d+\.com\//
    //if (!/blacktoon\d+\.com/.test(location.hostname)) return;

    const domains = ['blacktoon.com', 'booktoki.com', 'newtoki.com', 'manatoki.net'];
    const domain = document.domain.replace(/[0-9]/g, '');

    if (domains.includes(domain) > -1) {
        adblock(domain);
    }

})();

function adblock(domain) {
    switch (domain) {
        case "blacktoon.com":
            blacktoon();
            break;
        case "booktoki.com":
        case "newtoki.com":
        case "manatoki.net":
            toki();
            break;
    };
}

function blacktoon() {
    if (['/cookie.html', '/lander'].includes(document.location.pathname) == false) {
        document.querySelectorAll('div.banner, nav.mb-nav').forEach(e => e.remove());
    }
}

function toki() {
    document.querySelectorAll('#hd_pop, .sidebar-toggle, .navbar-custom-menu > ul > li:nth-child(n+2), nav .navbar-toggle, #main-banner-view, #id_mbv, .view-title, .basic-banner, .widget-side-line > div, .board-tail-banner').forEach(e => e.remove());
    document.querySelector('#id_mbv')?.parentNode.remove();
}
