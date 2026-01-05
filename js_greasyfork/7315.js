// ==UserScript==
// @name       Grocery ROI Hit Helper
// @author Dormammu
// @version    9.0
// @description helps with hits
// @match       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/7315/Grocery%20ROI%20Hit%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/7315/Grocery%20ROI%20Hit%20Helper.meta.js
// ==/UserScript==

// press 1 to select the No For ALl
$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="None of the above"]').click(); }
});

$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $( "#submitButton" ).click();  }
});

$("a").each(function() {
    if (this.href.indexOf('Https://amazon.com') != -1) {
     window.open(this.href, this.target, "height=800,width=600");
    }
});