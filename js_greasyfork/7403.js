// ==UserScript==
// @name         Disable YouTube's 'Recommended For You' Videos
// @namespace    http://www.tregware.com
// @version      1.0
// @description  enter something useful
// @author       Mason Bogert
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7403/Disable%20YouTube%27s%20%27Recommended%20For%20You%27%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/7403/Disable%20YouTube%27s%20%27Recommended%20For%20You%27%20Videos.meta.js
// ==/UserScript==

var eles = document.getElementsByClassName("video-list-item related-list-item");

for(i = 0; i < eles.length; ++i)
{
    var ele = eles[i];
    var html = ele.innerHTML;
    
    if(html.indexOf("Recommended for you") > 0)
    {
        eles[i].style.display = "none";
    }
}