// ==UserScript==
// @name         Barcodes R' Us
// @version      1.0
// @description  press 1 to select checkbox
// @author       slinky
// @require     http://code.jquery.com/jquery-latest.min.js
// @include *
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/5988/Barcodes%20R%27%20Us.user.js
// @updateURL https://update.greasyfork.org/scripts/5988/Barcodes%20R%27%20Us.meta.js
// ==/UserScript==

$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('#Answer_3').prop('checked', true);  }
});


$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $( 'input[name="/submit"]' ).eq( 0 ).click();  }
});
