// ==UserScript==
// @name         Badfish hit helper
// @author       notzingy
// @version      2.0
// @description  lol
// @match 		https://s3.amazonaws.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6435/Badfish%20hit%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6435/Badfish%20hit%20helper.meta.js
// ==/UserScript==

$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $( ".tick.yes_default" ).click();  }
});

$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $( ".tick.not_default" ).click();  }
});