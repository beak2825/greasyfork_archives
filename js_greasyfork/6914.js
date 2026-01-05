// ==UserScript==
// @name       Grocery ROI Kosher HIT Helper
// @author Dormammu
// @version    5.0
// @description helps with hits
// @match       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  you gurl
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6914/Grocery%20ROI%20Kosher%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6914/Grocery%20ROI%20Kosher%20HIT%20Helper.meta.js
// ==/UserScript==

// press 1 to select the first K image
$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="B00EP0PGVY_Kosher_3"]').click(); }
});

// press 2 to select the second K image
$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $('input[value="B00EP0PGVY_Kosher_2"]').click(); }
});

// press 3 to select U image
$(window).keyup(function(oph) { 
    if (oph.which == 51) {  $('input[value="B00EP0PGVY_Kosher_1"]').click(); }
});

// press A to select Other Kosher
$(window).keyup(function(oph) { 
    if (oph.which == 65) {  $('input[value="Other Kosher"]').click(); }
});

// press S to select None Of The Above
$(window).keyup(function(oph) { 
    if (oph.which == 83) {  $('input[value="None of the above"]').click(); }
});

// press D to select Poor Image Quality
$(window).keyup(function(oph) { 
    if (oph.which == 68) {  $('input[value="Poor image quality"]').click(); }
});


// press Enter to submit the hit
$(window).keyup(function(oph) { 
    if (oph.which == 13) {  $( "#submitButton" ).click();  }
});

document.getElementsByClassName('panel panel-primary')[0].style.display='none';