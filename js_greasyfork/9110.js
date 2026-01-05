// ==UserScript==
// @name       Google Maps Classic
// @namespace  http://compressedtime.com/
// @version    0.1
// @description  Google Maps never seems to remember my preference for Classic
// @match      http://maps.google.com/*
// @match      https://maps.google.com/*
// @match      http://www.google.com/maps*
// @match      https://www.google.com/maps*
// @copyright  2012+, You
// @run-at     document-start
// @downloadURL https://update.greasyfork.org/scripts/9110/Google%20Maps%20Classic.user.js
// @updateURL https://update.greasyfork.org/scripts/9110/Google%20Maps%20Classic.meta.js
// ==/UserScript==

if(typeof GM_log == 'undefined')
    GM_log = console.log;

//GM_log("typeof document.documentElement.outerHTML=" + typeof document.documentElement.outerHTML);
//GM_log("document.documentElement.outerHTML=" + document.documentElement.outerHTML);

var location = window.location.href;
if(location.match(/maps\//))
{
        // just adding output=classic to these URLs doesn't fix it
        return;
}

// XXX try to detect if we're already on classic
if(false && document.documentElement.outerHTML.match(/html class="no-maps-mini"/))
{
    /* we're already on classic */
    GM_log("Google Maps Classic: looks like we're already on classic");
}


if(!location.match(/output=classic/))
{
    window.location.href = window.location.href + '&output=classic';
}
