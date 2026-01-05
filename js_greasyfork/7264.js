// ==UserScript==
// @name       Sears
// @author Dormammu
// @version    9.0
// @description helps with hits
// @match       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/7264/Sears.user.js
// @updateURL https://update.greasyfork.org/scripts/7264/Sears.meta.js
// ==/UserScript==

// open twitter links in new window
$("a").each(function() {
    if (this.href.indexOf('"hre"http://') != -1) {
     window.open(this.href, this.target, "height=800,width=600");
    }
});

$('#country').val($('#country').val()+'N/A'); 
$('#zipcode').val($('#zipcode').val()+'N/A');

// press 1 to submit the hit
$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $( "#submitButton" ).click();  }
});