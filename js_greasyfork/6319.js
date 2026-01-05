// ==UserScript==
// @name       Ward Loving Hit Helper
// @author Dormammu
// @version    10.0
// @description helps with hits
// @match       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  you gurl
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6319/Ward%20Loving%20Hit%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6319/Ward%20Loving%20Hit%20Helper.meta.js
// ==/UserScript==

// press 1 to select all no
$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="N"]').prop('checked',true); }
});

// press M to Select Male
$(window).keyup(function(oph) { 
    if (oph.which == 77) {  $('input[value="M"]').prop('checked',true); }
});

// press M to Select Male
$(window).keyup(function(oph) { 
    if (oph.which == 70) {  $('input[value="F"]').prop('checked',true); }
});

// press H to Select Happy from dropdown
$(window).keyup(function(oph) { 
    if (oph.which == 72) {  $('.form-control option[value="happy"]').attr("selected", "selected");
 }
});