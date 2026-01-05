// ==UserScript==
// @name      Medication Hit Helper i forgot the name of the hit/requester lols
// @author Dormammu
// @version    11.0
// @description helps with hits
// @match       https://www.mturk.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  you gurl
// @namespace Https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/7560/Medication%20Hit%20Helper%20i%20forgot%20the%20name%20of%20the%20hitrequester%20lols.user.js
// @updateURL https://update.greasyfork.org/scripts/7560/Medication%20Hit%20Helper%20i%20forgot%20the%20name%20of%20the%20hitrequester%20lols.meta.js
// ==/UserScript==


$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="Selection_WWVz"]').click(); }
});