// ==UserScript==
// @name       Grocery ROI .04 hit helper
// @author Dormammu
// @version    4.0
// @description helps with hits
// @match       https://s3.amazonaws.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @require     //cdn.jsdelivr.net/jquery.unveiljs/1.3.0/jquery.unveil.js
// @copyright  you gurl
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6804/Grocery%20ROI%2004%20hit%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6804/Grocery%20ROI%2004%20hit%20helper.meta.js
// ==/UserScript==

// press 1 to select None Of The Above
$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[name="None of the above"]').click(); }
});

// press 2 to submit the hit
$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $( "#submitButton" ).click();  }
});