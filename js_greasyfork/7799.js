// ==UserScript==
// @name        Auto-focus on first textbox
// @namespace   http://userscripts.org/users/23652
// @description Auto-focuses on the first/main textbox of a site
// @include     http://*.youtube.com/*
// @include     https://*.youtube.com/*
// @include     http://*.facebook.com/*
// @include     https://*.facebook.com/*
// @include     http://*
// @include     https://*
// @exclude     file://*
// @copyright   JoeSimmons
// @version     1.0.4
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/7799/Auto-focus%20on%20first%20textbox.user.js
// @updateURL https://update.greasyfork.org/scripts/7799/Auto-focus%20on%20first%20textbox.meta.js
// ==/UserScript==

/* CHANGELOG

    1.0.4 (4/30/2015)
        - added a system where it makes sure the textbox is focused, especially for trouble sites like youtube

    1.0.3 (1/30/2015)
        - added some small delays for YouTube for it to work
        - removed the use of JSL; it's unnecessary

*/

(function () {
    'use strict';

    // make sure the page is not in a frame
    if (window.frameElement || window !== window.top) { return; }

    var domain = window.document.domain,
        rDomain = /([a-z0-9]+\.)?([a-z0-9-]+(\.[a-z0-9]+)+)$/,
        site = '',
        delay = 500, // by default, use a fairly slow interval as most sites don't mess with focus too much
        e = document.querySelector('input[type="text"], input[type="search"], textarea'),
        timeStart = Date.now(),
        cancelled = false,
        len, intv;

    function cancel () {
        if (cancelled === false) {
            cancelled = true;
            window.clearInterval(intv);

            window.removeEventListener('keydown', cancel, false);
            window.removeEventListener('mousedown', cancel, false);
            window.removeEventListener('dblclick', cancel, false);
            window.removeEventListener('dragstart', cancel, false);
            window.removeEventListener('scroll', cancel, false);
            window.removeEventListener('unload', cancel, false);
        }
    }

    function doFocus(element, length) {
        var diff = Date.now() - timeStart;

        // don't run this function after user input is detected
        if (cancelled === true) {
            return;
        }

        // focus the text box
        element.focus();

        // highlight its text
        if (length > 0 && typeof element.setSelectionRange === 'function') {
            element.setSelectionRange(length, length);
        }

        // stop focusing if 10 seconds has passed
        if (diff > 9999) {
            cancel();
        }
    }

    // grab the domain minus the subdomain
    if ( domain.match(rDomain) ) {
        site = domain.match(rDomain)[2];
    }

    // this section is for sites that require special attention ;)
    switch (site) {
        case 'youtube.com': {
            // youtube is known to take focus away after it's been focused, so we do it often
            e = document.querySelector('#masthead-search-term');
            delay = 100;
            break;
        }
        case 'userscripts.org': case 'google.com': {
            e = document.querySelector('input[name="q"]');
            break;
        }
        case 'facebook.com': {
            e = document.querySelector('textarea[name="xhpc_message_text"], textarea[name="xhpc_message"]');
            delay = 750;
            break;
        }
    }

    // if the element exists and is visible (in-view), then proceed
    if (e && Math.max(e.offsetWidth, e.offsetHeight) > 0) {
        len = e.value.length;

        if (typeof e.focus === 'function') {
            // keep auto-focusing until the user inputs an action, but not longer than 10 seconds
            intv = window.setInterval(doFocus, delay, e, len);

            window.addEventListener('keydown', cancel, false);
            window.addEventListener('mousedown', cancel, false);
            window.addEventListener('dblclick', cancel, false);
            window.addEventListener('dragstart', cancel, false);
            window.addEventListener('scroll', cancel, false);
            window.addEventListener('unload', cancel, false);
        }
    }
}());