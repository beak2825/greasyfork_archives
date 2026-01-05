// ==UserScript==
// @name       Nathan Labat HIT Helper
// @namespace  http://ericfraze.com
// @version    0.3
// @description  Copies the result number for "Find the number of google search results"
// @include    https://www.google.com*
// @include    http://www.google.com*
// @copyright  2014+, Eric Fraze
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant           GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/5695/Nathan%20Labat%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/5695/Nathan%20Labat%20HIT%20Helper.meta.js
// ==/UserScript==

$(document).ready(function() {
    $("body").click(function() {
        if ( $("#resultStats").length ) {
            var str = $("#resultStats").text();
            var reg = /(?:^|\s)([1-9](?:\d*|(?:\d{0,2})(?:,\d{3})*)(?:\.\d*[1-9])?|0?\.\d*[1-9]|0)(?:\s|$)/;
            number = reg.exec(str);
            
            GM_setClipboard(number[1]);
        }else{
            GM_setClipboard(0);
        }
    });
});
/*
 * var reg = /[1-9](?:\d{0,2})(?:,\d{3})*(?:\.\d*[1-9])?|0?\.\d*[1-9]|0/g;
var newstr = str.replace(re, "$2, $1");
*/