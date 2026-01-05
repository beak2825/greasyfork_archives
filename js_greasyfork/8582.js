// ==UserScript==
// @name       jawz John Smith
// @author		jawz
// @version    1.0
// @description Smith
// @match      https://www.google.com/evaluation/endor/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/8582/jawz%20John%20Smith.user.js
// @updateURL https://update.greasyfork.org/scripts/8582/jawz%20John%20Smith.meta.js
// ==/UserScript==

var elink = document.links
elink = elink[4].href
console.log(elink);
    
var halfScreen = screen.width/2; 
var windowHeight = screen.height; 
var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
popupW = window.open(elink,'remote','height=' + windowHeight + ',width=' + halfScreen + ', left=' + halfScreen + ',top=0' + specs,false);