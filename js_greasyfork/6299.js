// ==UserScript==
// @name       TOTW Hotels
// @author Dormammu
// @version    6.0
// @description helps with hits
// @match       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  you gurl
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6299/TOTW%20Hotels.user.js
// @updateURL https://update.greasyfork.org/scripts/6299/TOTW%20Hotels.meta.js
// ==/UserScript==

// press 1 to select all Best Western
$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="Best Western"]').prop('checked',true); }
});

// press 2 to select Best Western Plus
$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $('input[value="Best Western Plus"]').prop('checked',true); }
});

// press 3 to select Best Western Premier
$(window).keyup(function(oph) { 
    if (oph.which == 51) {  $('input[value="Best Western Premier"]').prop('checked',true); }
});

// press 4 to select None
$(window).keyup(function(oph) { 
    if (oph.which == 52) {  $('input[value="none"]').prop('checked',true); }
});