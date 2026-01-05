// ==UserScript==
// @name       Ocmp50 URLS
// @author Dormammu
// @version    11.0
// @description helps with hits
// @match       https://tr-ta4.crowdcomputingsystems.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/7510/Ocmp50%20URLS.user.js
// @updateURL https://update.greasyfork.org/scripts/7510/Ocmp50%20URLS.meta.js
// ==/UserScript==

$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('.na-check').click(); }
});

$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $('.button.cc-button.submit-btn.btn.btn-primary').click(); }
});