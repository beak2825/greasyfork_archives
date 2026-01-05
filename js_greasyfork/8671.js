// ==UserScript==
// @name       jawz DCF
// @version    1.0
// @description  something useful
// @match      https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant		GM_setClipboard
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/8671/jawz%20DCF.user.js
// @updateURL https://update.greasyfork.org/scripts/8671/jawz%20DCF.meta.js
// ==/UserScript==

var test = $('body').text();
var test2 = test.match("discern the gender of(.*)");
test2[1] = test2[1].substring(3, test2[1].length);
GM_setClipboard(test2[1])

var elink = document.links
elink = elink[0].href
    
var halfScreen = screen.width/2; 
var windowHeight = screen.height; 
var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
popupW = window.open(elink,'remote','height=' + windowHeight + ',width=' + halfScreen + ', left=' + halfScreen + ',top=0' + specs,false);