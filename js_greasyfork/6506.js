// ==UserScript==
// @name   Machine Learning Hit Helper
// @author Dormammu
// @version    4.0
// @description helps with hits
// @match       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6506/Machine%20Learning%20Hit%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6506/Machine%20Learning%20Hit%20Helper.meta.js
// ==/UserScript==

$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="true"]').prop('checked',true); }
});

$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $('input[value="false"]').prop('checked',true); }
});

$(window).keyup(function(oph) { 
    if (oph.which == 51) {  $( "#submitButton" ).click();  }
});