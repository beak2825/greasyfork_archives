// ==UserScript==
// @name   Idiap Hit Helper
// @author Dormammu
// @version    4.0
// @description helps with hits
// @match       https://www.idiap.ch/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6494/Idiap%20Hit%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6494/Idiap%20Hit%20Helper.meta.js
// ==/UserScript==

$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="2"]').prop('checked',true); }
});


$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $( "#submitRatings" ).click();  }
});