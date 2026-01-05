// ==UserScript==
// @name   OCMP School Hit Helper
// @author Dormammu
// @version    4.0
// @description helps with hits
// @match       https://demo-fin.crowdcomputingsystems.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6515/OCMP%20School%20Hit%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6515/OCMP%20School%20Hit%20Helper.meta.js
// ==/UserScript==

$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="yes"]').prop('checked',true); }
});
