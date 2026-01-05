// ==UserScript==
// @name       Tate HIT HELPER
// @author Dormammu
// @version    11.0
// @description helps with hits
// @match       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  you gurl
// @namespace Https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/7860/Tate%20HIT%20HELPER.user.js
// @updateURL https://update.greasyfork.org/scripts/7860/Tate%20HIT%20HELPER.meta.js
// ==/UserScript==

$( "#none" ).click();

// press 2 to submit the hit
$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $( "#submitButton" ).click();  }
    });