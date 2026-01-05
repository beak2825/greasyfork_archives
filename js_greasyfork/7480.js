// ==UserScript==
// @name       Amazon Hits
// @author Dormammu
// @version    9.0
// @description helps with hits
// @match       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/7480/Amazon%20Hits.user.js
// @updateURL https://update.greasyfork.org/scripts/7480/Amazon%20Hits.meta.js
// ==/UserScript==

$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="4"]').click(); }
});