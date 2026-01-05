// ==UserScript==
// @name   Instant.ly HIT Helper
// @author notzingy
// @version   2.0
// @description helps with hits
// @match       https://us1428.crowdcomputingsystems.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6998/Instantly%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6998/Instantly%20HIT%20Helper.meta.js
// ==/UserScript==

$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="valid_pic"]').click(); }
});

$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $('input[value="invalid_url"]').click(); }
});

$(window).keyup(function(oph) { 
    if (oph.which == 51) {  $('input[value="low_res"]').click(); }
});

$(window).keyup(function(oph) { 
    if (oph.which == 52) {  $('input[value="invalid_pic"]').click(); }
});

$(window).keyup(function(oph) { 
    if (oph.which == 53) {  $('input[value="other"]').click(); }
});

// comment out this function to disable window popups of products
$("a").each(function() {
    if (this.href.indexOf('http://s3.amazonaws.com/') != -1) {
     window.open(this.href, this.target, "height=800,width=600");
    }
});