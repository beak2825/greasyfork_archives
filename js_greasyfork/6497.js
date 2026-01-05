// ==UserScript==
// @name   PDF Hit Helper
// @author Dormammu
// @version    6.0
// @description helps with hits
// @match       Https://work.crowdsource.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace Https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6497/PDF%20Hit%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6497/PDF%20Hit%20Helper.meta.js
// ==/UserScript==


$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="yes"]').click(); }
});

$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $('input[value="no"]').click(); }
});

$(window).keyup(function(oph) { 
    if (oph.which == 51) {  $( "#submitButton" ).click();  }
});