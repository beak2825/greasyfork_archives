// ==UserScript==
// @name           CPV Link Skipper
// @author         .
// @description    Skip shit
// @license        ISC http://opensource.org/licenses/ISC
// @version        0.61
// @grant          unsafeWindow
// @include       *shr77.com/*
// @include       *utm_source=CPVLINK&utm_medium=interstitial*
// @namespace https://greasyfork.org/users/645
// @downloadURL https://update.greasyfork.org/scripts/691/CPV%20Link%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/691/CPV%20Link%20Skipper.meta.js
// ==/UserScript==
// fires when gbar is found or added to document.
var $ = unsafeWindow.jQuery;
var timeoutId;
var done = false;
function redirect(elem) {
    href = elem.getAttribute('href');
    if (!done && typeof href != 'undefined' && href.match(/^https?.*$/)) {
        clearTimeout(timeoutId);
        done = true;
        document.location = href;
        return true;
    }
    return false;
}

function redirect2(v) {
    if (!done && typeof v == 'string' && v.match(/^https?.*$/)) {
        clearTimeout(timeoutId);
        done = true;
        document.location = v;
        return true;
    }
    return false;
}


(function () {
    var elem;
    //Third attempt; from https://github.com/devnoname120/nopicads/blob/shr77.com/src/sites/link/shr77.com.js
    var link = document.head.innerHTML.match(/\$\('a#loading'\)\.attr\('href',"([^"]+)"\);/);
    //No match in head? Try the body    
    link = !link ? document.body.innerHTML.match(/\$\('a#loading'\)\.attr\('href',"([^"]+)"\);/) : link;
    
    //piss off
    if (unsafeWindow.jQuery)
        unsafeWindow.jQuery("#jw-player").remove();

    if (!link || !redirect2(link[1]) ) {
        //Second attempt
        //Override jQuery animate for instant shit
        if (typeof unsafeWindow.jQuery != 'undefined') {
            var oldfn = unsafeWindow.jQuery.fn.animate;
            unsafeWindow.jQuery.fn.animate = function (a, b, c) {
                c();
            }
        }
        //Moar

        if (typeof unsafeWindow.setInterval != 'undefined') {
            var oldfn = unsafeWindow.setInterval;
            unsafeWindow.setInterval = function (a, b) {
                return oldfn(a, 50);
            }
        }
        if (typeof unsafeWindow.num != 'undefined') {
            unsafeWindow.num = 0;
            if (typeof timeoutId == 'undefined') {
                timeoutId = setInterval(function () {
                    if ((elem = document.getElementById('loading'))) {
                        redirect(elem);
                    }
                }, 50);
            }
        }
    }
}) ();
