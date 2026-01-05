// ==UserScript==
// @name       Jon Bender Mysapce HIT Helper
// @author Dormammu
// @version    4.0
// @description helps with hits
// @match       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  you gurl
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6543/Jon%20Bender%20Mysapce%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6543/Jon%20Bender%20Mysapce%20HIT%20Helper.meta.js
// ==/UserScript==

// Press 1 to Mark all as yes
$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="YesMyspace"]').prop('checked',true); }
});

// Press 2 to Mark all as yes
$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $('input[value="NoMyspace"]').prop('checked',true); }
});