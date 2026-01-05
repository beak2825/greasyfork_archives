// ==UserScript==
// @name       Dick Stone .04 HIT HELPER
// @author Dormammu
// @version    9.0
// @description helps with hits
// @match       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  you gurl
// @namespace Https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6924/Dick%20Stone%2004%20HIT%20HELPER.user.js
// @updateURL https://update.greasyfork.org/scripts/6924/Dick%20Stone%2004%20HIT%20HELPER.meta.js
// ==/UserScript==

// press 1 to select the first K image
$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="a) Yes."]').click(); }
});

// press 2 to select the second K image
$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $('input[value="b) No."]').click(); }
});

// press Enter to submit the hit
$(window).keyup(function(oph) { 
    if (oph.which == 13) {  $( "#submit-btn" ).click();  }
});

// open twitter links in new window
$("a").each(function() {
    if (this.href.indexOf('https://twitter.com') != -1) {
     window.open(this.href, this.target, "height=800,width=600");
    }
});