// ==UserScript==
// @name       World Vision Hit Helper
// @author Dormammu
// @version    4.0
// @description helps with hits
// @match       https://worldvision1.crowdcomputingsystems.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  you gurl
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6166/World%20Vision%20Hit%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6166/World%20Vision%20Hit%20Helper.meta.js
// ==/UserScript==

// press 1 to select all YES
$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="approve"]').prop('checked',true); }
});