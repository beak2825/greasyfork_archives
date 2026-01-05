// ==UserScript==
// @name         Project Free Tv - skip waiting Ads (free-tv-video-online.info)
// @version      0.3
// @description  Skips the 10 second waiting ads when transitioning to player on free-tv-video-online.info by converting links
// @author       manni
// @match        *://www.free-tv-video-online.info/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/9751
// @downloadURL https://update.greasyfork.org/scripts/8614/Project%20Free%20Tv%20-%20skip%20waiting%20Ads%20%28free-tv-video-onlineinfo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/8614/Project%20Free%20Tv%20-%20skip%20waiting%20Ads%20%28free-tv-video-onlineinfo%29.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", replaceLinks, false );

if( document.readyState === "complete" ) {
    replaceLinks();
}

function replaceLinks() {
    $(this).find(".mnllinklist").each(function() {
        $(this).find("a").each(function() {
            var old = $(this).attr('href');
            old = old.replace("/interstitial2.html?lnk=", "");
            old = old.replace(/%2F/g, "/");
            old = old.replace(/%3F/g, "?");
            old = old.replace(/%3D/g, "=");
            $(this).attr('href' , old);
        });
    });
}