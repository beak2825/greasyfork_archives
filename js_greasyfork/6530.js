// ==UserScript==
// @name   Matching TOTW hit helper
// @author Dormammu
// @version    4.0
// @description helps with hits
// @match       https://s3.amazonaws.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6530/Matching%20TOTW%20hit%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6530/Matching%20TOTW%20hit%20helper.meta.js
// ==/UserScript==

// press 1 for match
$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="confirm_match"]').click(); }
});

// press 2 for no match
$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $('input[value="confirm_nomatch"]').click(); }
});

// press 3 to submit the hit
$(window).keyup(function(oph) { 
    if (oph.which == 51) {  $( ".btn.btn-primary.btn-block.btn-large" ).click();  }
});