// ==UserScript==
// @name       Youtube MP3 Download Button
// @namespace  LOL
// @version    2.1
// @description  Adds a MP3 Download button next to the subscribe button, thanks to youtubeinmp3 for their simple download service (http://youtubeinmp3.com/api/). Based off magnus's youtube2mp3 code. Just used something different as it wont open another tab.
// @include http://www.youtube.com/*
// @include https://www.youtube.com/*
// @exclude http://www.youtube.com/embed/*
// @exclude https://www.youtube.com/embed/*
// @match         http://www.youtube.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/7735/Youtube%20MP3%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/7735/Youtube%20MP3%20Download%20Button.meta.js
// ==/UserScript==

        var linkPath ='http://youtubeinmp3.com/fetch/?video='+encodeURIComponent(document.URL)+"&hq=1";
        $(  '<a id="youtube2mp3" class="yt-uix-button yt-uix-button-default" href="'+linkPath+'" style="margin-left: 8px; height: 26px; padding: 0 22px; /* background-color: #e62117; */"><img src="http://youtubeinmp3.com/icon/download.png" style="vertical-align:middle;color: white;"> <span class="yt-uix-button-content" style="line-height: 25px; /* font-variant: small-caps; */ font-size: 12px; /* color: #fefefe; */">MP3 Download</span></a>').insertAfter( "#watch7-subscription-container" );   