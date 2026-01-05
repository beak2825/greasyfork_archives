// ==UserScript==
// @name       Sears HITS
// @author Dormammu
// @version    6.0
// @description helps with hits
// @match       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  you gurl
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6872/Sears%20HITS.user.js
// @updateURL https://update.greasyfork.org/scripts/6872/Sears%20HITS.meta.js
// ==/UserScript==

// press 1 to fill in box with NA
$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('#web_url').val($('#web_url').val()+'NA'); }
});

// press 2 to fill in box with NR
$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $('#web_url').val($('#web_url').val()+'NR'); }
});

// press 3 to submit the hit
$(window).keyup(function(oph) { 
    if (oph.which == 51) {  $( "#submitButton" ).click();  }
});