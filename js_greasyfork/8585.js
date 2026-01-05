// ==UserScript==
// @name         Shortcut for /review
// @version      1.0
// @description  Adds a keyboard shortcut [R] for /review
// @author       nicael
// @include        *://*.stackexchange.com/*
// @include        *://*stackoverflow.com/*
// @include        *://*serverfault.com/*
// @include        *://*superuser.com/*
// @include        *://*askubuntu.com/*
// @include        *://*stackapps.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/9713
// @downloadURL https://update.greasyfork.org/scripts/8585/Shortcut%20for%20review.user.js
// @updateURL https://update.greasyfork.org/scripts/8585/Shortcut%20for%20review.meta.js
// ==/UserScript==

$(document).keypress(function (event) {
                if (event.charCode == 114&&$(".keyboard-console > pre:contains('go to')").css("display")=="block") {
                    location.href="/review";
                }
            });
$(document).keypress(function (event) {
    if (event.which == 103) {
        setTimeout(function () {
            console.log($(".keyboard-console").css("display"));
            $(".keyboard-console > pre:contains('go to')").append("<b><kbd>R</kbd> review</b><rv></rv>");
            
        }, 10);

    }
});