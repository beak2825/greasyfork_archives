// ==UserScript==
// @name         Youtube MP3 Downloader
// @namespace    http://youtubemp3.comoj.com
// @version      1.6
// @description  Youtube mp3 download
// @author       r0ckc3
// @grant        none
// @require     https://code.jquery.com/jquery-1.11.2.min.js
// @include 		http://youtube.com/*
// @include 		http://www.youtube.com/*
// @include 		https://youtube.com/*
// @include 		https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/7756/Youtube%20MP3%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/7756/Youtube%20MP3%20Downloader.meta.js
// ==/UserScript==

$(document).ready(function(){
     var linkPath ='http://YouTubeInMP3.com/fetch/?video='+encodeURIComponent(document.URL)+"&hq=1";
        $(  '<a id="youtube2mp3" class="yt-uix-button yt-uix-button-default" href="'+linkPath+'" style="margin-left: 8px; height: 26px; padding: 0 22px; /* background-color: #e62117; */"><img src="http://youtubeinmp3.com/icon/download.png" style="vertical-align:middle;color: white;"> <span class="yt-uix-button-content" style="line-height: 25px; /* font-variant: small-caps; */ font-size: 12px; /* color: #fefefe; */">MP3 Download</span></a>').insertAfter( "#watch7-subscription-container" );
 });
