// ==UserScript==
// @name       Sergey Hit Helper for dem youtube search hit things
// @author Dormammu
// @version    4.0
// @description helps with hits
// @match       https://s3.amazonaws.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  you gurl
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6321/Sergey%20Hit%20Helper%20for%20dem%20youtube%20search%20hit%20things.user.js
// @updateURL https://update.greasyfork.org/scripts/6321/Sergey%20Hit%20Helper%20for%20dem%20youtube%20search%20hit%20things.meta.js
// ==/UserScript==

// press 1 to select No
$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="no"]').prop('checked',true); }
});

// press 2 to submit the hit
$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $( "#submitButton" ).click();  }
});