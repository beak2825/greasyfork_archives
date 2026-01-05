// ==UserScript==
// @name       Nathan Labat HIT Helper
// @namespace  http://ericfraze.com
// @version    0.3
// @description  Click empty space on Google search page to copy the result number for "Find the number of google search results"
// @include    https://www.google.com*
// @include    http://www.google.com*
// @match       https://www.mturkcontent.com/dynamic/hit*
// @copyright  2014+, Eric Fraze
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant           GM_setClipboard
// @grant           GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/6076/Nathan%20Labat%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6076/Nathan%20Labat%20HIT%20Helper.meta.js
// ==/UserScript==

$(document).ready(function() {
    if ( $("strong:contains('NEW INSTRUCTIONS !!!! DON'T FORGET TO READ !')").length ){
        GM_openInTab($("a[href*='google']").prop('href'));
    }else{
        $("body").click(function() {
            if ( $("#resultStats").length ) {
                var str = $("#resultStats").text();
                var reg = /(?:^|\s)([1-9](?:\d*|(?:\d{0,2})(?:,\d{3})*)(?:\.\d*[1-9])?|0?\.\d*[1-9]|0)(?:\s|$)/;
                number = reg.exec(str);
                number[1] = number[1].replace(",", "");
                
                GM_setClipboard(number[1]);
            }else{
                GM_setClipboard(0);
            }
    	});
    }
});