// ==UserScript==
// @name   totw hit helper
// @author Dormammu
// @version    4.0
// @description helps with hits
// @match       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6499/totw%20hit%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6499/totw%20hit%20helper.meta.js
// ==/UserScript==


$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="none"]').prop('checked',true); }
});

// press 2 to submit the hit
$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $( "#submitButton" ).click();  }
});

$('#url').val($('#url').val()+'N/A');