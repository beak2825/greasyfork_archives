// ==UserScript==
// @name           YouTube - Cosmic Panda Watch Page
// @id             Cosmic_Panda_Recreation
// @namespace      http://userscripts.org/users/428476
// @description    attempts to re-create cosmic panda (2011 watch6 Test) using Javascript. It has all four size buttons fully implemented, has the prev and next buttons next to player, and makes the watch page look and feel like Cosmic Panda.
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @resource       res-YouTubeCSS https://raw.githubusercontent.com/CybertronicToon/CosmicPandaWatchPage/master/src/watch6.css#3
// @resource       res-PlayerCSS https://raw.githubusercontent.com/CybertronicToon/CosmicPandaWatchPage/master/src/Watch6_Player.css#1
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @grant          GM_listValues
// @grant          GM_addStyle
// @grant          GM_getResourceText
// @grant          GM_xmlhttpRequest
// @run-at         document-end
// @include        *.youtube.com/watch*
// @include        *apis.google.com*
// @include        *plus.googleapis.com*
// @exclude        http://web.archive.org/*
// @version        1.4
// @downloadURL https://update.greasyfork.org/scripts/7962/YouTube%20-%20Cosmic%20Panda%20Watch%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/7962/YouTube%20-%20Cosmic%20Panda%20Watch%20Page.meta.js
// ==/UserScript==

var standardsizes = 0; //enable standard size options?

var enablePlTitle = 1; //enable showing playlist title with video title?

var dynamicWatch = 3; //1 = dynamic width 2 = dynamic height 3 = same as original 0 = player fills screen

var ytStage = 1;// 1 puts the player in a new element so nothing else affect its size, and makes for a more accurate re-creation. Disable if you want to use YTCenter re-sizing.

var threeDsizes = 0; //not really that useful (enables player sizes for use with double-width 3D)

var pltype = 2013;// 2012 = player from 2012 (doesn't work - was deleted). 2013 = current player (if a video doesn't play, set to 2013) 2 = Player 3 AKA grey player (WAS DELETED!! almost always worked - least buggy player and possibly faster loading) 3 = player 3 V8 version (WAS DELETED! should have always work before - has better fullscreen, and player 3 benefits)

var HTML5Style = 1 //0 = normal style HTML5 player, 1 = cosmic panda style, 2 = player 4 style

var cosmicvids = true; // cosmic panda style of related videos

var noChngPlr = false; //set to true if you don't want the player changed by the script. If using YT Center, set to true unless using player 3.

var forceHtml5 = false; //force the script to interpret the page as HTML5. (is pointless)

var ChngAct = true; //changes the actions above desc but below stage to look like Cosmic Panda

var fixLikeDislike = true;// makes like button say like, dislike say nothing, puts like/dislike numbers below like/dislike bar. requires ChngAct. NYI

var tweakDesc = true;

var saveSize = true; //makes the page go to your last selected size automatically

var fixPlaylists = true; //makes the Cosmic Panda playlist bar

var cssEllipsis = true; //gives the channel button ellipsis via CSS

var fullSugThumbs = false; //makes the cosmicvids suggested thumbnails be full size instead of partially cut off.

// 2012 = 2012
// 2011 = cospan = 2011 dark (not working)

var YTCenterColors = false; //let YouTubeCenter control player's color? (aka light (white player) or dark (cosmic panda-style) player)

// Everything below this line shouldn't be edited unless you are an advanced user and know what you are doing.









var useRemoteCss = true; //enables the use of remote CSS (don't disable unless you have a userstyle) for this

var alertsEnabled = false;






//   vi/$&7Bvideo_id%7D/default.jpg
//   vi/$image/0.jpg
//   vi/
//   http://web.archive.org/web/20111120200448/http://www.youtube.com/watch?v=NI8rQEHoE24

// sept 13 w/ 3D http://web.archive.org/web/20120413062402/http://www.youtube.com/watch?v=NI8rQEHoE24

// jan 13, last w/o gear  
// http://web.archive.org/web/20120113051535/http://www.youtube.com/watch?v=NI8rQEHoE24

// august 17th http://web.archive.org/web/20120817235249/http://www.youtube.com/watch?v=NI8rQEHoE24
// old jquery https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// new jquery https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js

var script = {};





// css and variables
script.name = "Cosmic Panda Remake";
script.shortname = "CPR";
script.mainCSS = "";
script.mainCSS = "#player-api," +
"#player-api-rental-still-frame {" +
"width: 640px !important; " +
"height: 363px !important; " +
"background: none !important;" +
"}  #page #watch7-container.watch-medium #player-api, " +
"#page #watch7-container.watch-medium #player-api-rental-still-frame {" +
"width: 854px !important; " +
"height: 483px !important;"+
"}";


script.mainCSS = "#player-api,\
#player-api-rental-still-frame,\
.watch6Stage #watch-player,\
.watch6Stage #watch-video {\
width: 640px !important; \
height: 363px !important; \
background: none !important;\
}  #page #watch7-container.watch6-large #player-api, \
#page #watch7-container.watch6-large #player-api-rental-still-frame, \
#page.watch6-large #player-api, \
#page.watch6-large #player-api-rental-still-frame,\
#page.watch6Stage.watch6-large #watch-video,\
#page.watch6Stage.watch6-large #watch-player {\
width: 1280px !important; \
height: 723px !important;\
}  #page #watch7-container.watch6-standard.watch6-large #player-api, \
#page #watch7-container.watch6-standard.watch6-large #player-api-rental-still-frame, \
#page.watch6-standard.watch6-large #player-api, \
#page.watch6-standard.watch6-large #player-api-rental-still-frame {\
width: 960px !important; \
height: 723px !important;\
}  #page #watch7-container.watch6-wide-3D.watch6-large #player-api, \
#page #watch7-container.watch6-wide-3D.watch6-large #player-api-rental-still-frame, \
#page.watch6-wide-3D.watch6-large #player-api, \
#page.watch6-wide-3D.watch6-large #player-api-rental-still-frame {\
width: 2560px !important; \
height: 723px !important;\
}  #page.watch6-playerFill #watch7-container.watch6-full #player-api,\
#page.watch6-playerFill #watch7-container.watch6-full #player-api-rental-still-frame, \
#page.watch6-playerFill.watch6-full #player-api,\
#page.watch6-playerFill.watch6-full #player-api-rental-still-frame,\
#page.watch6-playerFill.watch6Stage.watch6-full #watch-video,\
#page.watch6-playerFill.watch6Stage.watch6-full #watch-player {\
width: 100% !important;\
height: 100% !important;\
position: absolute !important;\
top: 106px !important;\
} #page.watch6Stage.watch6-playerFill.w6DynWidth.watch6-full #watch-video,\
#page.watch6Stage.watch6-playerFill.w6DynWidth.watch6-full #watch-player {\
height: 56.25vw !important;\
} #page.watch6Stage.watch6-playerFill.w6DynHeight.watch6-full #watch-video,\
#page.watch6Stage.watch6-playerFill.w6DynHeight.watch6-full #watch-player {\
width: 177.77777777vh !important;\
} #body-container.watch6-playerFill.watch6-full,  #body-container.watch6-full #page-container,\
#body-container.watch6-full #page-container #page,  #body-container.watch6-full #page-container #page #content,\
#body-container.watch6-full #page-container #page #content #watch7-container {\
position: static !important;\
}.watch6-playerFill #body-container.watch6-full #page-container #page #content #watch7-container .yt-bar,\
.watch6-playerFill #body-container.watch6-full #page-container #page .yt-bar {\
position: absolute !important;\
top: 60px !important;\
width: 100% !important;\
left: 0px !important;\
} #page.watch6-originalFill.watch6-full #watch-bar-container {\
  position: absolute !important;\
  z-index: 550 !important;\
  bottom: 0 !important;\
  left: 0 !important;\
  width: 100% !important;\
} #body-container.watch6-full #page-container #page #content #watch7-container #player #showHideButton {\
display: none !important;\
} #footer-container.watch6-full {\
display:none !important;\
} #body-container.watch6-full #page-container #page #content #watch7-container #watch7-main-container, \
#body-container.watch6-full #page-container #page #content #watch7-container #watch-main-container {\
display: none !important;\
width: 0px !important;\
height: 0px !important;\
visibility: hidden !important;\
}  #page #watch7-container.watch6-medium #player-api, \
#page #watch7-container.watch6-medium #player-api-rental-still-frame, \
#page.watch6-medium #player-api, \
#page.watch6-medium #player-api-rental-still-frame,\
#page.watch6Stage.watch6-medium #watch-video,\
#page.watch6Stage.watch6-medium #watch-player {\
width: 854px !important; \
height: 483px !important;\
}  #page #watch7-container.watch6-standard.watch6-medium #player-api, \
#page #watch7-container.watch6-standard.watch6-medium #player-api-rental-still-frame, \
#page.watch6-standard.watch6-medium #player-api, \
#page.watch6-standard.watch6-medium #player-api-rental-still-frame {\
width: 640px !important; \
height: 483px !important;\
}  #page #watch7-container.watch6-wide-3D.watch6-medium #player-api, \
#page #watch7-container.watch6-wide-3D.watch6-medium #player-api-rental-still-frame, \
#page.watch6-wide-3D.watch6-medium #player-api, \
#page.watch6-wide-3D.watch6-medium #player-api-rental-still-frame {\
width: 1708px !important; \
height: 483px !important;\
}  #page #watch7-container.watch6-wide-3D.watch6-small #player-api, \
#page #watch7-container.watch6-wide-3D.watch6-small #player-api-rental-still-frame, \
#page.watch6-wide-3D.watch6-small #player-api, \
#page.watch6-wide-3D.watch6-small #player-api-rental-still-frame {\
width: 1280px !important; \
// height: 363px !important;\
height: 420px !important;\
}  #page #watch7-container.watch6-standard.watch6-small #player-api, \
#page #watch7-container.watch6-standard.watch6-small #player-api-rental-still-frame, \
#page.watch6-standard.watch6-small #player-api, \
#page.watch6-standard.watch6-small #player-api-rental-still-frame {\
width: 480px !important; \
height: 363px !important;\
}  #page #player.watch-medium #player-api, \
#page #watch7-container.watch-large #player-api-rental-still-frame {\
width: 854px !important; \
height: 483px !important;\
} div#watch7-sidebar {\
margin-top: 0px !important;\
padding-top: 15px !important;\
} div#player {\
padding-left: 0px !important;\
} div#player #player-api {\
margin-left: auto !important;\
margin-right: auto !important;\
float: none !important;\
clear:both !important;\
}#watch-video {\
  position: relative;\
  margin: 20px auto 0;\
  margin: 0 auto 0;\
  padding-top: 20px;\
} #page.watch6-full #watch-video {\
padding-top: 0px !important;\
}body #page.watch6Stage.watch6-full #watch-stage #watch-video #watch-player {\
top: 0px !important;\
} div#watch7-container div#player {\
	border: none !important;\
	background-color: #242424 !important;\
	background-image: url(https://s.ytimg.org/img/watch6-tile-dark.png) !important;\
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAABTCAMAAADUbMsyAAAAGFBMVEUlJSUkJCQmJiYjIyMnJycoKCgiIiIhISE/mG+dAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABb5JREFUWMO1mdlyXEcMQw8Wdv7/j/PAvrJVsZORPPGLq2ZsNRcQACkOgyEYEC60NQZMAJnnzxE60WDZrcEWBApBgzHII5QUMDY1IKVAAVdOAAIBjWVFtkkQyBHCyGc2NuHD0cZJjdEYxQhXahQjU4QZgoKREUWACM1gI/Prh/ZLA8qpJVAqiJAGbIwwJkRJiF2Bi5+0ZKs2BFnFgiPXKkSAg2KlaHBkUMCSLbLhYUGJdBDx/jfV59bcKAoBWqwjOCCrtiSLJrVjhEzY5BBBMbSQ4HHwkSTgIAlsF2xjTAFOfxPQq+mgp6Pg/Vtbt+dFyT4LkYJxPaaYCSyg/pIyMEJ2DxwtSr0/qS7FOh027+xzhLJwUKyFUoY2xpUiE0kI26YlaUg3GEoKiy7L+26ptMlSyxgytlDRZi7JVFNZaDsF7FuVuQOEhRGA/pJlbZYwffD9fI+9RQELj704Pux4RsLJbNNn7izuoGoH3PKPmkgaOaQX6XUZ5vm2BMHguW3lwMTBQcYBkdZPcuHEPLWSrEVDizUBaPBQsqWv5Aq3RiG+bbVU2+5gXKHooa+AOR9cceGuLfwUvGlXSFm2k+G02NLEhATq13mxQIqK6e1zsCRZY2dup4paZXr4aJfaoG0nd56p/TEtxmAzCnag0i1CXSRZXrhsuy1hb2yit2yE44NsJGlfP8sB28MwxgPEDi4R1mLxwbjNbO8GEcm2MNFBiFutAKq3HlLjfCR8YTfKuWQJzRPDi0zzJeoDb3A4hNmGamxboQMilsymhPaflygt3U8k2DZTvkc9zorlL5mCH+wsXOMaZGf7OOLpdATKzpkwx1Yvm/YZOnsuKOojO1WwtnKxToSgWFVW1ubC+jZGq9L2ftqd0y+LzQvpLPItSIthoBI4whVm43+dbHiBY3dQz31LJw9NcyFLaRmWWgzWmY3GOIt5MSjjK6xHC9cKckykylY2hMgIVVwv8e5hvxDGSHKlNS87b2HpCS1sfTpXK3L93A91/qQ+HENBRbXWxjHcx75lfPjCfLyqpDDXrkKT9R7SYzuMvX4wCwrnIk9hx9yX7LY7Ev3GmPwnOWLDONt5tHV5VHK1SV2rm6okErNDayN5Btm2o8PwoBH9zAYh+2nlq71SuxQr2PrpBghQfwrt4FYYyWXNmLf7zUKlDkqhFGpXEa4bOLC+/qcJB2rN5c0I5wafZygqoCObYOZskN3WZfnyJ3sIuNUqzGVj/5TZUrfrCCcKh0fKtAjU4UaEbcl8KJNkrrJXJqLbDkO0hIMc26RdcxjtAjE7MB81fpfj/tBBFIlgZe2f+7jDWzEdMvAFE/T4tNmm4LWSABq8pMaWrYL2lGOgZiaxHln0cv1NrO+V+Q+yMmtcvN4ERPLsE9VKY4hV6ez6uiOTC6V9w/2Gzv73fsrbnOzZ1dPsj88VSBSpiDS+XLmk5qi7WCOPzS7KlrL9lQNx16O9bysqfpb+K43ohO6sXxu9g212/5fxYVm2a7yullqfqIjvcs+/uot/c6ff44A/lIlfe+i+H0xAtExcquAYY6/aKXAMbuhOhsfItRW73MYfI18vgpxc+3S9xR4AcJwdIiHZVTw3uF0qfxvNqwv0F8wdr0uCjLvo1qW/3wnuW/bLT3e332r0H9iHLzqh5LTGSSirzXeEgy2PHph/vj3Uc3exDSBeviBaM7JHNkeonH9cEfli9V+0O7+zUgpsQUoHuhrgdheos0D5+KEE1PyIh0f/3kF7b+yN9GwM/0M1uRh16Vbhdlxe1n6m7TiGvrJU/HQbqRUO8p/eh951TPxpY+FPDz+/SI5v+oLiH/RR6r1Rbe8+n+sLJJSK2m53t/7SEsVLiJO+Igd4OO69ybs6xBCfSqZeD4u8zk0vHOP+h3Oy+ZPzzO9s45+d0X5pVPa0997DP8TKxuI8bpxWz0AubmOpCxwC1mW2X91S3mSNP40A7/ylxF1E/wZ0FSXFIvqaewAAAABJRU5ErkJggg==) !important;\
	background-position: top left !important;\
	background-repeat: repeat !important;\
	-webkit-box-shadow: inset 0 1px 5px rgba(0,0,0,0.5) !important;\
	-moz-box-shadow: inset 0 1px 5px rgba(0,0,0,0.5) !important;\
	box-shadow: inset 0 1px 5px rgba(0,0,0,0.5) !important;\
} #player #showHideButton {\
	margin-left: auto !important;\
	margin-right: auto !important;\
	display: block !important;\
} #watch-video, #watch-player, #player #player-api, #player {\
	-moz-transition: width,height,left 0.2s ease-in-out !important;\
	-o-transition: width,height,left 0.2s ease-in-out !important;\
	-webkit-transition: width,height,left 0.2s ease-in-out !important;\
	transition: width 0.2s ease-in-out,height 0.2s ease-in-out 0s,left 0.2s ease-in-out !important;\
} #player #moreUserVideos {\
	margin-left: auto !important;\
	margin-right: auto !important;\
} #player {\
	margin-left: 0px !important;\
	margin-right: 0px !important;\
}  #page #watch7-container.watch-medium #player-api, \
#page #watch7-container.watch-medium #player-api-rental-still-frame {\
	width: 854px !important; \
	height: 483px !important;\
}\
#content-container.watch6-full,\
#body-container.watch6-full {\
	box-sizing: auto !important;\
	padding-bottom: 0px !important;\
}\
body.watch6-playerFill #body-container.watch6-full #page-container,\
body.watch6-playerFill #body-container.watch6-full,\
body.watch6-playerFill #body-container.watch6-full #page-container #page,\
body.watch6-playerFill #body-container.watch6-full #page-container #page #player,\
body.watch6-playerFill #body-container.watch6-full #page-container #page #player #player-mole-container {\
height: 100% !important;\
max-height: 100% !important;\
box-sizing: auto !important;\
min-width: 0px !important;\
} body.watch6-originalFill #body-container.watch6-full #page-container,\
body.watch6-originalFill #body-container.watch6-full,\
body.watch6-originalFill #body-container.watch6-full #page-container #page,\
body.watch6-originalFill #body-container.watch6-full #page-container #page #player,\
body.watch6-originalFill #body-container.watch6-full #page-container #page #player #player-mole-container {\
}\
body.watch6-originalFill #page.watch6-full #watch-stage {\
  position: absolute !important;\
  z-index: 550 !important;\
  top: 60px !important;\
  bottom: 45px !important;\
  left: 0 !important;\
  width: 100% !important;\
  padding-top: 20px !important;\
}\
body.watch6-originalFill #page.watch6-full.watch6-playlist #watch-tray {\
  position: absolute !important;\
  z-index: 550 !important;/* Above watch-frame-top (500) */\
  height: 151px !important;\
  bottom: 0 !important;\
  left: 50% !important;\
  margin-left: -485px !important;\
  display: block !important;\
}\
body.watch6-originalFill #page.watch6-full.watch6-playlist #watch-stage #watch-video {\
  position: absolute !important;\
  top: 0 !important;\
  bottom: 151px !important;\
  left: 0 !important;\
  right: 0 !important;\
  width: auto !important;\
  height: auto !important;\
  margin: 0 !important;\
}\
body.watch6-originalFill #page.watch6-full #watch-stage #watch-video,\
body.watch6-originalFill #page.watch6-full #watch-stage #watch-player {\
height: 100% !important;\
width: 100% !important;\
}\
#page.watch6-originalFill.watch6-full #watch-tray {\
display: none !important;\
}\
#page.watch6-full #watch-prev,\
#page.watch6-full #watch-next {\
display: none !important;\
}\
body #body-container.watch6-full #masthead-positioner {\
position: absolute !important;\
} body.watch6-full {\
line-height: 0 !important;\
}\
#player[style*='margin-bottom: 28px'] + .yt-bar {\
margin-top: -28px !important;\
}\
body #body-container.watch6-full #player[style*='margin-bottom: 28px'] {\
}\
body #body-container.watch6-full #page-container #page #player {\
margin-top: 0px !important;\
}\
body#body.watch6, body, body.watch6 {\
min-height: 0px !important;\
} .watch6Stage #player {\
display: none !important;\
} #watch-stage #watch-video #watch-player #movie_player {\
height: 100% !important;\
width: 100% !important;\
}";
script.YouTubeCSS = GM_getResourceText("res-YouTubeCSS");
//script.commentCSS = GM_getResourceText("res-commentCSS");
script.PlayerCSS = GM_getResourceText("res-PlayerCSS");



var isWatch = 0;
if ($("#page").hasClass("watch")) {//run the code
isWatch = 1;
} else {
return;
}



if ($("body").hasClass("watch6")) { // already has class, do nothing
} else { // does not have class, add class
	$("body").addClass("watch6");
}

if ($("#page").hasClass("cosmicpanda")) { // already has class, do nothing
} else { // does not have class, add class
	$("#page").addClass("cosmicpanda");
}

if ($("#page").hasClass("watch6")) { // already has class, do nothing
} else { // does not have class, add class
	$("#page").addClass("watch6");
}

if (cssEllipsis === true) {
$("body").addClass("watch6-channel-button-ellipsis");
}

if (fullSugThumbs === true) {
$("body").addClass("watch6-full-related-thumb");
}




var plNum = 0;
var hasPl = 0;
plNum = $("#watch7-sidebar-playlist #watch-appbar-playlist .playlist-header").length;
if (plNum < 0) {
hasPl = 1;
$("body").addClass("watch6-playlist");
$("#page").addClass("watch6-playlist");
} else if (location.href.contains("list=")) {
hasPl = 1;
$("body").addClass("watch6-playlist");
$("#page").addClass("watch6-playlist");
} else {
hasPl = 0;
$("body").addClass("watch6-noPlaylist");
$("#page").addClass("watch6-noPlaylist");
}

if (ChngAct === true) {
	$("body").addClass("watch6-rearrange");
	$("#watch-like-dislike-buttons").insertBefore("#watch8-secondary-actions");
	$("#watch7-views-info").insertAfter("#watch8-secondary-actions");
	//$("#watch7-views-info").attr("id", "watch-viewcount");
	$(document.createElement("div"))
		.attr("id", "watch-viewcount")
		.insertAfter("#watch7-views-info");
	$("#watch7-views-info .watch-view-count").appendTo("#watch-viewcount");
	/*$("#watch7-views-info").remove();*/
	$("#watch7-views-info")
		.addClass("hid")
		.attr("style", "display: none !important;");

	if (fixLikeDislike === true) {
		var likeCount = $("#watch-like .yt-uix-button-content").text();
		var dislikeCount = $("#watch-dislike .yt-uix-button-content").text();
		$(document.createElement("div"))
			//.attr("id", "watch-actions-sparkbars")
			.attr("id", "watch-rating")
			.insertAfter("#watch8-secondary-actions");
		$("body").addClass("watch6-sparkbar-fix");
		$(".video-extras-sparkbars").appendTo("#watch-rating");
		$(".video-extras-sparkbars").addClass("watch-sparkbars");
		$(document.createElement("span"))
			.attr("class", "watch-likes-dislikes")
			.html("<span class='likes'>" + likeCount + "</span> likes, <span class='dislikes'>" + dislikeCount + "</span> dislikes")
			.insertAfter("#watch-rating .video-extras-sparkbars");
		$("#watch-viewcount").insertBefore("#watch-rating");
		$("#watch-viewcount").addClass("float-right");
		var viewCnt = $("#watch-viewcount .watch-view-count").text();
		$("#watch-viewcount .watch-view-count").addClass("deathrow");
		$(document.createElement("div"))
			.attr("class", "watch-view-count")
			.html("<strong>" + viewCnt + "</strong>")
			.insertAfter("#watch-viewcount .watch-view-count");
		$("#watch-viewcount .watch-view-count.deathrow").remove();
		//$("#watch-like .yt-uix-button-content").text("like");
		$("#watch-like .yt-uix-button-content").text("");//temporarily use CSS for label until I add function for it
		$("#watch-like").addClass("has-text");
		$("#watch-dislike .yt-uix-button-content").text("");
		$("#watch-viewcount .watch-view-count").attr("class", "watch6-view-count");






	}
}

if (tweakDesc === true) {
	$("body").addClass("watch6-tweak-desc");
	$(document.createElement("div"))
		.attr("id", "watch-description-toggle")
		.attr("class", "yt-uix-expander-head")
		.appendTo("#action-panel-details #watch-description");
	$(document.createElement("div"))
		.attr("id", "watch-description-expand")
		.attr("class", "expand")
		.appendTo("#watch-description-toggle");
	$(document.createElement("div"))
		.attr("id", "watch-description-collapse")
		.attr("class", "collapse")
		.appendTo("#watch-description-toggle");
	$("#action-panel-details > .yt-uix-expander-collapsed-body").appendTo("#watch-description-expand");
	$("#action-panel-details > .yt-uix-expander-body").appendTo("#watch-description-collapse");
	$(document.createElement("img"))
		.attr("alt", "Show more")
		.attr("class", "yt-uix-button-icon-watch-expand")
		.attr("src", "http://s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif")
		.insertBefore("#watch-description-expand .yt-uix-button-content");
	$(document.createElement("img"))
		.attr("alt", "Show less")
		.attr("class", "yt-uix-button-icon-watch-collapse")
		.attr("src", "http://s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif")
		.insertBefore("#watch-description-collapse .yt-uix-button-content");
	$(document.createElement("div"))
		.attr("id", "watch-description-flag")
		.attr("data-button-toggle-group", "optional")
		.attr("class", "yt-uix-button-group")
		.html("<span></span>")
		.insertBefore("#watch-description-toggle");
	$(".action-panel-trigger-report").parent().addClass("watch6-deathrow");
	$(".action-panel-trigger-report").appendTo("#watch-description-flag span");
	$(".action-panel-trigger-report")
		.attr("data-button-toggle", "true")
		.attr("onclick", ";return false;")
		.attr("data-upsell", "Report")
		.attr("id", "watch-flag")
		.addClass("yt-uix-videoactionmenu-button");
	$(".action-panel-trigger-report .yt-ui-menu-item-label")
		.addClass("yt-uix-button-content")
		.removeClass("yt-ui-menu-item-label");
	$("#watch-flag")
		.removeClass("has-icon")
		.removeClass("action-panel-trigger-report")
		.addClass("yt-uix-button-flag");
	$("#watch-flag .yt-uix-button-content").text("Flag as inappropriate");
	$(document.createElement("img"))
		.attr("class", "yt-uix-button-icon yt-uix-button-icon-watch-flag")
		.attr("src", "http://s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif")
		.attr("alt", "")
		.insertBefore("#watch-flag .yt-uix-button-content");
	$(".watch6-deathrow").remove();
	$("#watch-description")
		.addClass("yt-uix-expander")
		.addClass("yt-uix-expander-collapsed");
	$("#action-panel-details")
		.removeClass("yt-uix-expander")
		.removeClass("yt-uix-expander-collapsed");
	/*$("#action-panel-details")*/
	$(document.createElement("div"))
		.attr("id", "watch-actions")
		.appendTo("#watch8-action-buttons");
		/*$("#watch8-ytcenter-buttons").appendTo("#watch-actions");*/
		$("#watch-like-dislike-buttons").appendTo("#watch-actions");
		$("#watch8-secondary-actions").appendTo("#watch-actions");
		$("#watch-viewcount").appendTo("#watch-actions");
		$("#watch-rating").appendTo("#watch-actions");
		$("#watch8-sentiment-actions").appendTo("#watch-actions");
	$("#watch-action-panels").appendTo("#watch8-action-buttons");
	$("#watch-description").appendTo("#watch8-action-buttons");
	$("#watch-header").addClass("watch6-header");
	/*$("#watch-like-dislike-buttons").attr("id", "watch-like-unlike");*/
	$("#watch-like-dislike-buttons #watch-like")
		//.unwrap()
		.addClass("start")
		.addClass("yt-uix-tooltip-reverse");
	$("#watch-like-dislike-buttons #watch-dislike")
		//.unwrap()
		.addClass("end")
		.addClass("yt-uix-tooltip-reverse");
	
}





// start the main script code
// start the main code

// Set up debug mode
script.debugOn = false;
script.debugMessages = "";

if (checkForDebugMode()) {
	script.debugOn = true;
	debugModeStart();
	debug("Starting "+script.shortname+" debug log");
	debug(script.shortname+" version: " + script.version);
	debug("HTML lang: " + document.getElementsByTagName("html")[0].getAttribute("lang"));
	debug("Body class: " + document.getElementsByTagName('body')[0].getAttribute("class"));
	debug("Direction: " + document.getElementsByTagName("html")[0].getAttribute("dir"));
	debug("Page class: " + document.getElementById("page").getAttribute("class"));
}




debug("inserting watch6 function script");
var w6s = document.createElement("script");
w6s.id = "watch6"; //script tag's id
w6s.addClass = "watch6"; //script tag's class
w6s.src = "//s.ytimg.com/yt/jsbin/www-watch6.js";
document.getElementsByTagName("head")[0].appendChild(w6s);
debug("script inserted");



if (dynamicWatch == 1) {
$("body").addClass("watch6-playerFill");
$("#page").addClass("watch6-playerFill");
$("body").addClass("w6DynWidth");
$("#page").addClass("w6DynWidth");
} else if (dynamicWatch == 2) {
$("body").addClass("watch6-playerFill");
$("#page").addClass("watch6-playerFill");
$("body").addClass("w6DynHeight");
$("#page").addClass("w6DynHeight");
} else if (dynamicWatch == 3) {
$("body").addClass("watch6-originalFill");
$("#page").addClass("watch6-originalFill");
} else {
$("body").addClass("watch6-playerFill");
$("#page").addClass("watch6-playerFill");
}

if (useRemoteCss === true) {
	debug("Inserting YouTube CSS");
	insertCSS(script.YouTubeCSS);
	debug("YouTube CSS is now active");
}


	
// Insert Main CSS
debug("Inserting main CSS");
insertCSS(script.mainCSS);
debug("Main CSS is now active");

if (ytStage == 1) {
$(document.createElement("div"))
	.attr("id", "watch-stage")
	.attr("class", "yt-stage")
	.insertBefore("#player");
$(document.createElement("div"))
	.attr("id", "watch-video")
	.attr("class", "watch6 watch")
	.appendTo("#watch-stage");
$(document.createElement("div"))
	.attr("id", "watch-player")
	.attr("class", "flash-player")
	.appendTo("#watch-video");
} else {
// do nothing.
}


if (hasPl == 1) {
	var currentPlVid = $("#watch7-sidebar-playlist .currently-playing");
	var currentPlNumStr = currentPlVid.attr("data-index");
	var currentPlNum = parseInt(currentPlNumStr);
	if (ytStage == 1) {
		var plCont = $("#yt-stage");
		var theVid = $("#watch-video");
		var thePlayer = $("#watch-player");
	}
	else {
		var plCont = $("#player");
		var thePlayer = $("#player-api");
		var theVid = $("#player-api");
	}
	if (currentPlVid.is("li:first-child")) {//first video, do not include backwards
		var nextPlNum = currentPlNum + 1;
		var nextPlIndex = nextPlNum + 1;
		var nextPlNumStr = "" + nextPlNum;
		var nextPlIndexStr = "" + nextPlIndex;
		var nextPlLink = $(".yt-uix-scroller-scroll-unit[data-index='" + nextPlNumStr + "'] a");
		var nextPlUrl = "unknown url";
		nextPlUrl = nextPlLink.attr("href");
		$(document.createElement("button"))
			.attr("id", "watch-next")
			.attr("class", "")
			.attr("onclick", "window.location.href='" + nextPlUrl + "&index=" + nextPlIndexStr + "'")
			.insertAfter(thePlayer);
		$(document.createElement("img"))
			.attr("id", "")
			.attr("class", "yt-uix-button-icon-watch-next")
			.appendTo("#watch-next");
	} else if (currentPlVid.is("li:last-child")) {//last video, do not include forwards
		var prevPlNum = currentPlNum - 1;
		var prevPlIndex = nextPlNum + 1;
		var prevPlNumStr = "" + prevPlNum;
		var prevPlIndexStr = "" + nextPlIndex;
		var prevPlLink = $(".yt-uix-scroller-scroll-unit[data-index='" + prevPlNumStr + "'] a");
		var prevPlUrl = "unknown url";
		prevPlUrl = prevPlLink.attr("href");
		$(document.createElement("button"))
			.attr("id", "watch-prev")
			.attr("class", "")
			.attr("onclick", "window.location.href='" + prevPlUrl + "&index=" + prevPlIndexStr + "'")
			.insertBefore(thePlayer);
		$(document.createElement("img"))
			.attr("id", "")
			.attr("class", "yt-uix-button-icon-watch-prev")
			.appendTo("#watch-prev");
	} else {//neither first nor last, include both forward and backwards
		var prevPlNum = currentPlNum - 1;
		var prevPlIndex = nextPlNum + 1;
		var prevPlNumStr = "" + prevPlNum;
		var prevPlIndexStr = "" + nextPlIndex;
		var prevPlLink = $(".yt-uix-scroller-scroll-unit[data-index='" + prevPlNumStr + "'] a");
		var prevPlUrl = "unknown url";
		prevPlUrl = prevPlLink.attr("href");
		var nextPlNum = currentPlNum + 1;
		var prevPlIndex = nextPlNum + 1;
		var nextPlNumStr = "" + nextPlNum;
		var prevPlIndexStr = "" + nextPlIndex;
		var nextPlLink = $(".yt-uix-scroller-scroll-unit[data-index='" + nextPlNumStr + "'] a");
		var nextPlUrl = "unknown url";
		nextPlUrl = nextPlLink.attr("href");
		$(document.createElement("button"))
			.attr("id", "watch-prev")
			.attr("class", "")
			.attr("onclick", "window.location.href='" + prevPlUrl + "&index=" + prevPlIndexStr + "'")
			.insertBefore(thePlayer);
		$(document.createElement("img"))
			.attr("id", "")
			.attr("class", "yt-uix-button-icon-watch-prev")
			.appendTo("#watch-prev");
		$(document.createElement("button"))
			.attr("id", "watch-next")
			.attr("class", "")
			.attr("onclick", "window.location.href='" + nextPlUrl + "&index=" + nextPlIndexStr + "'")
			.insertAfter(thePlayer);
		$(document.createElement("img"))
			.attr("id", "")
			.attr("class", "yt-uix-button-icon-watch-next")
			.appendTo("#watch-next");
	}
	
}



// Check for HTML5 mode
debug("Check for HTML5 video");
var html5 = false;
if ($("#player").hasClass("html5-player")) {
	debug("Page has HTML5 video");
	//alert("html5");
	html5 = true;
} else if ($("#movie_player").hasClass("html5-video-player")) {
	debug("Page has HTML5 player");
	//alert("html5");
	html5 = true;
} else if (forceHtml5) {
	debug("HTML5 force enabled");
	html5 = true;
} else {
	debug("No HTML5 video");
	//alert("is flash");
}

if (cosmicvids === true) {
	var related = $("#watch-related .video-list-item");
	related.each(function(index, li) {
		var relateditem = $(this),
		    relatedlnk,
		    relatedhref,
		    relatedsplit,
		    relatedid,
		    relatedencode;
		relatedlnk = $(".thumb-link", this);
		relatedhref = "/watch?v=null";
		relatedhref = relatedlnk.attr("href");
		relatedencode = encodeURIComponent(relatedhref);
		relatedsplit = relatedencode.split("%3D", 2);
		relatedid = relatedsplit[1];
		$("span", relatedlnk).remove();
		$(document.createElement("span"))
			.attr("class", "ux-thumb-260 video-thumb")
			.attr("id", "thumb-" + relatedid)
			.html("<span class='clip'></span>")
			.appendTo(relatedlnk);
		$(document.createElement("img"))
			.attr("class", "watch6-related-img")
			.attr("src", "//i.ytimg.com/vi/" + relatedid + "/mqdefault.jpg")
			.attr("data-thumb", "//i.ytimg.com/vi/" + relatedid + "/mqdefault.jpg")
			.attr("aria-hidden", "true")
			.attr("alt", "Thumbnail")
			.appendTo("#thumb-" + relatedid + " .clip");
		relateditem.addClass("watch6-video-list-item");
		$(".thumb-wrapper", this).insertBefore(".content-wraper", this);
	           
	          




		//alert("img changed");

		/*$('#watch-more-related').bind('DOMNodeInserted', function() {
			alert('more videos loaded');
			$(this).unbind(DOMNodeInserted);
		});*/
            
            /*var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            var imgObserver = new MutationObserver(function(mutations) {
            alert("7")
			// Re-apply the chosen player if something changes it
			     if (img.src != imgsrc) {
				    debug("image has been reverted!");
				    img.src = imgsrc;
				    img.removeAttribute("data-thumb");
				    debug("image now back to mq");
			}
		alert("8");
		debug("creating observer");
		imgObserver.observe(img, {attributes:true,childList:true});
		debug("observing done");
		alert("9")
		});*//*
		
    });*/
    });
}

if (!html5 && !noChngPlr) {
	debug("Change video player");
	
	var playerContainer = $("#player #player-api");
	var playerContainer2 = $("#watch-video #watch-player");
	var playerElement = $("#movie_player");
	var flvars = playerElement.attr("flashvars");
	var plsrc = playerElement.attr("src");
	var plidA = plsrc.replace("https://s.ytimg.com/yts/swfbin/player-", "");
	var plid = plidA.replace("/watch_as3.swf", "");
	
	if (pltype == 2012) { // add Player 2012
//		plsrc = "//s.ytimg.com/yts/swfbin/watch_as3-vflZIEzVt.swf"; //follow the frog (DEC 4th)

//		plsrc = "//s.ytimg.com/yt/swfbin/watch_as3-vflIwG_Wv.swf"; // cosmic player?

//		plsrc = "//s.ytimg.com/yts/swfbin/watch_as3-vflawXYEN.swf"; // 1

//		plsrc = "//s.ytimg.com/yts/swfbin/watch_as3-vflwwB2FL.swf";

//		plsrc = "//s.ytimg.com/yts/swfbin/watch_as3-vflLZZ_gv.swf"; // 2

//		plsrc = "//s.ytimg.com/yts/swfbin/watch_as3-vfl1ubMZd.swf" // playlist player?
		
//		plsrc = "//s.ytimg.com//yts/swfbin/watch_as3-vflry7sRc.swf";// better tooltips

//		plsrc = "//ythistory.weebly.com/uploads/4/3/8/6/4386415/watch_as3-vflnvjh4s.swf";

//		plsrc = "//s.ytimg.com/yt/swfbin/watch_as3-vfl86LUNM.swf"; // august 17th 12


//		plsrc = "//s.ytimg.com/yt/swfbin/watch_as3.swf";

//		plsrc = "//s.ytimg.com/yts/swfbin/watch_as3-vflwwB2FL.swf";

//		flvars = flvars.replace("&ad3_module=", "&null_null=");
//		flvars = flvars.replace("&prefetch_ad_live_stream=true", "&prefetch_ad_live_stream=false");
//		flvars = flvars.replace("ad_", "null_");
//		flvars = flvars.replace("movie_id=", "null_id=");
		flvars = flvars.replace("&iv_invideo_url=https%3A%2F%2F", "&iv_read_url=http%3A%2F%2F");
		flvars = flvars.replace("&iv_invideo_url=http%3A%2F%2F", "&iv_read_url=http%3A%2F%2F");
		flvars = flvars.replace("&iv_read_url=https%3A%2F%2F", "&iv_read_url=http%3A%2F%2F");

		flvars = flvars.replace("&storyboard_spec=https%3A%2F%2F", "&storyboard_spec=http%3A%2F%2F");

		flvars = flvars.replace("&endscreen_module=", "&rfrf_hngn=");
//		flvars += "&endscreen_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fendscreen-vfl4DQN7R.swf"; // original

//		flvars += "&endscreen_module=http%3A%2F%2Fs.ytimg.com%2Fyt%2Fswfbin%2Fendscreen-vflMj0P3x.swf"; // 1

		flvars += "&endscreen_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fendscreen-vfl-GkD9i.swf"; // 2 AKA early november

//		flvars = flvars.replace("&iv3_module=", "&thth_mhrt=");
//		flvars = flvars.replace("&iv3_module=", "&iv3_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fiv3_module-vflgs83IY.swf&gfft_dgbhyj="); // 1
		flvars = flvars.replace("&iv3_module=", "&iv3_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fiv3_module-vflXIO4K1.swf&gfft_dgbhyj="); // 2 AKA early november
//		flvars += "&iv3_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fiv3_module-vflgs83IY.swf";
//		flvars = flvars.replace("&iv_module=", "&mjmj_hgfd=");
//		flvars = flvars.replace("&iv_module=", "&iv_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fiv_module-vfljxz_WC.swf&mjmj_hgfd="); // 1
		flvars = flvars.replace("&iv_module=", "&iv_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fiv_module-vflHAxI0-.swf&mjmj_hgfd="); // 2 AKA early nov.
//		flvars += "&iv_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fiv_module-vfljxz_WC.swf";
//		flvars = flvars.replace("&st_module=", "&jdut_ntoy=");
		flvars = flvars.replace("&st_module=", "&st_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fst_module-vflIsgKWt.swf&jdut_ntoy=");
//		flvars = flvars.replace("&st_module=", "&st_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fst_module-vflPuFCVy.swf&jdut_ntoy="); //FTF

//		flvars = flvars.replace("&st_module=", "&st_module=https%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fst_module-vflwdM8Ik.swf&jdut_ntoy="); // 2

//		flvars += "&st_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fst_module-vflIsgKWt.swf";
//		flvars = flvars.replace("&ad3_module=", "&lroy_mnoe=");
//		flvars = flvars.replace("&ad3_module=", "&ad3_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fad3-vfln2TPdx.swf&lroy_mnoe=");
		flvars = flvars.replace("&ad3_module=", "&ad3_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fad3-vflsgnzC6.swf&blehbity=");
//		flvars += "&ad3_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fad3-vfln2TPdx.swf";

//		flvars = flvars.replace("&cc3_module=", "&hrff_jhgh=");
//		flvars = flvars.replace("&cc3_module=", "&cc3_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fsubtitles3_module-vflDz6XJ2.swf&jfjg_nfnh="); //newer
		flvars = flvars.replace("&cc3_module=", "&cc3_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fsubtitles3_module-vflTYBwbs.swf&jfjg_nfnh=");
//		flvars += "cc3_module=http%3A%2F%2Fs.ytimg.com%2Fyt%2Fswfbin%2Fsubtitles3_module-vflmMm3sj.swf";
//		flvars = flvars.replace("&cc_module=", "&dnjd_hfhf=");
		flvars = flvars.replace("&cc_module=", "&cc_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fsubtitle_module-vfleHzMHS.swf&mffg_kfbng=");
//		flvars += "&cc_module=http%3A%2F%2Fs.ytimg.com%2Fyt%2Fswfbin%2Fsubtitle_module-vflka7Em1.swf";
		flvars = flvars.replace("&watermark=%2Chttps%3A%2F%2F", "&watermark=%2Chttp%3A%2F%2F");
		flvars = flvars.replace("%2Chttps%3A%2F%2Fs.ytimg.com", "%2Chttp%3A%2F%2Fs.ytimg.com");
		flvars = flvars.replace("&ttsurl=https%3A%2F%2F", "&ttsurl=http%3A%2F%2F");
//		flvars = flvars.replace("&playlist_module=", "&playlist_module=https%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fplaylist_module-vfljaQTJh.swf&listType=playlist&sfgsfg_gfdsg=");
		flvars = flvars.replace("&playlist_module=", "&playlist_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fplaylist_module-vfljaQTJh.swf&sfgsfg_gfdsg=");
//		flvars = flvars.replace("&playlist_module=", "&playlist_module=null&sfgsfg_gfdsg=");
//		flvars = flvars.replace("&playlist_module=", "&playlifgfdhst_modhfgdule=");
		flvars = flvars.replace("&share_icons=https%3A%2F%2F", "&share_icons=http%3A%2F%2F");
//		flvars += "&autohide=1";
//		flvars = flvars.replace("&csi_page_type=", "&gsg_sgs_jreg=");
//		flvars += "&csi_page_type=watch5";
		flvars = flvars.replace("&autohide=", "&nullaafdr=");
		flvars += "&autohide=3";
		flvars = flvars.replace("&threed_module=", "&threed_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fthreed-vflh30-zs.swf&ad3_module=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fad3-vflFe0oUf.swf&sgdfg_fstfrs=");
////		flvars = flvars.replace("&ptk=", "&ptk=Fremantle_Funded_Originals&hdgstg=")
//		flvars = flvars.replace("&inactive_skippable_threshold=", "&inactive_skippable_threshold=900000000000000&rwfgs_sgdfsg_sgsg=")
////		flvars = flvars.replace("&focEnabled=", "&rfrfHngn=");
//		flvars += "&focEnabled=1";
	//	flvars = flvars.replace("&rmkt=", "&rfrfHngn=");
	//	flvars += "&rmkt=1";
//		flvars = flvars.replace("&feature=", "&feature=list_other&sgffdg=");
//		flvars += "&feature=list_other";
		flvars = flvars.replace("&csi_page_type=watch7", "&csi_page_type=watch5");
		flvars = flvars.replace("csi_page_type=watch%2Cwatch7", "csi_page_type=watch%2Cwatch5");
		flvars = flvars.replace("csi_page_type=watch%2Cwatch7ad", "csi_page_type=watch%2Cwatch5ad");
//		flvars = flvars.replace("&source_id=", "&sgffh_hjdg=");
//		flvars += "&source_id=yw";
//		flvars = flvars.replace("cafe_experiment_id=", "cafe_experiment_id=56702377&null_sfg=");
//		flvars = flvars.replace("pyv_in_related_cafe_experiment_id=", "pyv_in_related_cafe_experiment_id=56702379&null_sfg_null_sadg=");
//		flvars = flvars.replace("hqdefault.jpg", "maxresdefault.jpg");
////		flvars = flvars.replace("&el=", "&asdgfa=");
/*		flvars = flvars.replace("advideo=1", "&advideo=0");
		flvars = flvars.replace("&ad_channel_code=", "&no_ad_channel_code=");
		flvars = flvars.replace("&prefetch_ad_=", "&asdgfa_=");
		flvars = flvars.replace("&ad_eurl=", "&ag_JUSTNO=");
		flvars = flvars.replace("&ad_tag=", "&no_ad_tag_show=");
		flvars = flvars.replace("&el=", "&asdgfa=");
		flvars = flvars.replace("&ad_video=", "&asdgfa=");*/
//		flvars = flvars.replace("detailpage", "watchpage");
//		flvars = flvars.replace("detailpage", "watchpage");
//		flvars = flvars.replace("detailpage", "watchpage");
//		flvars = flvars.replace("detailpage", "watchpage");
//		flvars = flvars.replace("&el=", "&NOadgsag=");
//		flvars = flvars.replace("&list=", "&null_var=");
		flvars = flvars.replace("&sl=", "&blahblah=");
		flvars = flvars.replace("&tpas_video_id=", "&blah_blibity_blah=");
		flvars = flvars.replace("&fw=", "&blahblah=");
		flvars = flvars.replace("&index=", "&blahblah=");
		flvars = flvars.replace("&rmkt=", "&blahblah=");
		flvars = flvars.replace("&feature=", "&blahblah=");
		flvars = flvars.replace("&source_id=", "&blahblah=");
		flvars = flvars.replace("pltype=", "pltype=watch&null=");
		
//		flvars += "&video_wall=1";
		flvars += "&el=profilepage";
//		flvars += "&el=watch6"
//		flvars += "&el=watchpage"
//		flvars += "&showinfo=0";
		

//		$("body").addClass("player2012");

	} else if (pltype == 2011) { // add Player 2011 cospan

		plsrc = "http://s.ytimg.com/yt/swfbin/watch_as3-vflszX2PY.swf"; // nov 20 2011

//		plsrc = "http://s.ytimg.com/yt/swfbin/watch_as3-vflMmYdk4.swf"; // jan 1 2012, annotations, shaded size w/ settings link

//		plsrc = "http://s.ytimg.com/yt/swfbin/watch_as3-vfl6_tSPt.swf"; // gear, sept 30 2012 w/ 3D

//		plsrc = "http://s.ytimg.com/yt/swfbin/watch_as3-vflGGuOtl.swf"; // jan 13, last w/o gear, non-shaded size




		flvars = flvars.replace("&endscreen_module=", "&endscreen_module=http%3A%2F%2Fs.ytimg.com%2Fyt%2Fswfbin%2Fendscreen-vflQbC3GU.swf&gsagf_sfsdg=");

		flvars = flvars.replace("&iv3_module=", "&iv3_module=http%3A%2F%2Fs.ytimg.com%2Fyt%2Fswfbin%2Fiv3_module-vflVIYXve.swf&fggs_sgrdg="); // jan 1

		flvars += "&iv_storage_server=http%3A%2F%2Fwww.youtube.com%2Fannotations%2F";		

		flvars = flvars.replace("&iv_module=", "&iv_module=http%3A%2F%2Fs.ytimg.com%2Fyt%2Fswfbin%2Fiv_module-vfl9DomWV.swf&fgsg_sdfgs=");



		flvars = flvars.replace("&iv_invideo_url=https%3A%2F%2F", "&iv_read_url=http%3A%2F%2F");
		flvars = flvars.replace("&iv_invideo_url=http%3A%2F%2F", "&iv_read_url=http%3A%2F%2F");
		flvars = flvars.replace("&iv_read_url=https%3A%2F%2F", "&iv_read_url=http%3A%2F%2F");


		flvars = flvars.replace("&watermark=", "&afsadf_asdfa=");

		flvars += "&watermark=%2Chttp%3A%2F%2Fs.ytimg.com%2Fyt%2Fimg%2Fwatermark%2Fyoutube_watermark-vflHX6b6E.png%2Chttp%3A%2F%2Fs.ytimg.com%2Fyt%2Fimg%2Fwatermark%2Fyoutube_hd_watermark-vflAzLcD6.png";

		flvars = flvars.replace("&autohide=", "&nullaafdr=");
		flvars += "&autohide=3";

		flvars = flvars.replace("&ttsurl=https%3A%2F%2F", "&ttsurl=http%3A%2F%2F");
		flvars = flvars.replace("&cc3_module=", "&hrff_jhgh=");
		flvars = flvars.replace("&cc_module=", "&dnjd_hfhf=");
		flvars = flvars.replace("&ad3_module=", "&null_null=");
		flvars = flvars.replace("&prefetch_ad_live_stream=true", "&prefetch_ad_live_stream=false");
		flvars = flvars.replace("ad_", "null_");





	} else if (pltype == 2013) { // add Player 2013
		flvars = flvars.replace("&el=", "&gsf=");
//		flvars += "&el=profilepage";
		flvars += "&el=watch6";
		flvars = flvars.replace("&autohide=", "&nullaafdr=");
		flvars += "&autohide=3";
		flvars = flvars.replace("&list=", "&listtype=playlist&list=");
	} else if (pltype == 2) { // Player 3
		//debug("Using Player 3");
		//alert("using player 3");
		// example ad module: http://s.ytimg.com/yts/swfbin/player-vfl4nHN8A/ad.swf
		//plsrc = "//s.ytimg.com/yt/swfbin/watch.swf";
		plsrc = plsrc.replace("watch_as3", "watch");
		flvars = flvars.replace("watermark=", "watermark=0&null=");
		flvars += "&watermark=0";
		flvars = flvars.replace("&autohide=", "&nullaafdr=");
		flvars += "&autohide=1";
		flvars += "&invideo=true";
		flvars = flvars.replace("&afv_invideo_ad_tag=", "&ad_tag");
		flvars = flvars.replace("&sourceid=ys", "&sourceid=y");
		flvars += "&ad_module=https%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fplayer-" + plid + "%2Fad.swf";
		$("body").addClass("player3");
	} else if (pltype == 3) { // Player 3 (V8 version)
		//debug("Using Player 3 (V8 version)");
		//alert("using player 3 (V8 version)");
		//plsrc = "//s.ytimg.com/yt/swfbin/watch_v8.swf";
		plsrc = plsrc.replace("watch_as3", "watch_v8");
		flvars = flvars.replace("watermark=", "watermark=0&null=");
		flvars += "&watermark=0";
		flvars = flvars.replace("&autohide=", "&nullaafdr=");
		flvars += "&autohide=1";
		flvars += "&invideo=true";
		flvars = flvars.replace("&afv_invideo_ad_tag=", "&ad_tag");
		flvars = flvars.replace("&sourceid=ys", "&sourceid=y");
		flvars += "&ad_module=https%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fplayer-" + plid + "%2Fad.swf";
		flvars += "&iv_storage_server=http://www.google.com/reviews/y/";
		$("body").addClass("player3");
	} else { //player type not recognized, so do nothing
		
		}
	if (ytStage == 1) {
	playerContainer = playerContainer2;
	$("#page").addClass("watch6Stage");
	$("body").addClass("watch6Stage");
	}
	// Apply the settings
	debug("Applying player settings");
	playerElement.attr("wmode", "transparent");
		debug("Refresh the player");
		playerElement.attr("flashvars", flvars);
		playerElement.attr("src", plsrc);
		playerElement.appendTo(playerContainer);
		debug("changing player done");
		
		var MutationObserver1 = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
		var vidObserver = new MutationObserver1(function(mutations) {
			// Re-apply the chosen player if something changes it
			if ($("#movie_player").attr("src") != plsrc) {
				debug("Player has been reverted by YT. Now setting back to chosen player");
				$("#movie_player").attr("flashvars", flvars);
				$("#movie_player").attr("src", plsrc);
				$("#movie_player").appendTo(playerContainer);
				debug("Player now back to chosen player");
			}
		});
		debug("creating observer");
		vidObserver.observe(playerContainer[0], {attributes:true,childList:true});
		debug("observing done");
	
} else if (noChngPlr) {
ytStage = 0; //force disable of ytstage since it requires player changing.

} else if (html5) {
	//alert("html5 is on");
	var playerContainer = $("#player #player-api");
	var playerContainer2 = $("#watch-video #watch-player");
	var playerElement = $("#movie_player");
	var plsrc = "hello_world";

	if (ytStage == 1) {
		playerContainer = playerContainer2;
		$("#page").addClass("watch6Stage");
		$("body").addClass("watch6Stage");
	}

	if (HTML5Style == 1) { // add cosmic panda-style player
		debug("Inserting Player CSS");
		insertCSS(script.PlayerCSS);
		debug("Player CSS is now active");
		if (YTCenterColors === false) {
			playerContainer.addClass("dark-theme");
		}
		//playerElement.removeClass("dark-theme");
		//playerElement.addClass("dark-theme");
	} else if (HTML5Style == 2) { // add white style player overrides dark player
		debug("Inserting Player CSS");
		insertCSS(script.PlayerCSS);
		debug("Player CSS is now active");
		if (YTCenterColors === false) {
			playerContainer.addClass("light-theme");
		}
		//playerElement.removeClass("light-theme");
		//playerElement.addClass("light-theme");
	} else {
		
	}

	debug("Applying player settings");
	playerElement.attr("wmode", "transparent");
		debug("Refresh the player");
		//playerElement.attr("flashvars", flvars);
		playerElement.attr("src", plsrc);
		playerElement.appendTo(playerContainer);
		debug("changing player done");
		
		var MutationObserver1 = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
		var vidObserver = new MutationObserver1(function(mutations) {
			// Re-apply the chosen player if something changes it
			if ($("#movie_player").attr("src") != plsrc) {
				debug("Player has been reverted by YT. Now setting back to chosen player");
				//$("#movie_player").attr("flashvars", flvars);
				$("#movie_player").attr("src", plsrc);
				$("#movie_player").appendTo(playerContainer);
				debug("Player now back to chosen player");
			}
		});
		debug("creating observer");
		vidObserver.observe(playerContainer[0], {attributes:true,childList:true});
		debug("observing done");

	$(document.createElement("div"))
		.attr("class", "yt-uix-button-icon")
		.attr("src", "http://s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif")
		.appendTo("#movie_player .html5-player-chrome .ytp-button[tabindex='6000']");
	$(document.createElement("div"))
		.attr("class", "yt-uix-button-icon")
		.attr("src", "http://s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif")
		.appendTo("#movie_player .html5-player-chrome .ytp-button[tabindex='6100']");
	$(document.createElement("div"))
		.attr("class", "yt-uix-button-icon")
		.attr("src", "http://s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif")
		.appendTo("#movie_player .html5-player-chrome .ytp-button[tabindex='6900']");
	$(document.createElement("div"))
		.attr("class", "yt-uix-button-icon")
		.attr("src", "http://s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif")
		.appendTo("#movie_player .html5-player-chrome .ytp-button[tabindex='6800']");
	$(document.createElement("div"))
		.attr("class", "yt-uix-button-icon")
		.attr("src", "http://s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif")
		.appendTo("#movie_player .html5-player-chrome .ytp-button[tabindex='6300']");
	$(document.createElement("div"))
		.attr("class", "yt-uix-button-icon")
		.attr("src", "http://s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif")
		.appendTo("#movie_player .html5-player-chrome .ytp-button[tabindex='6600']");
	$(document.createElement("div"))
		.attr("class", "yt-uix-button-icon")
		.attr("src", "http://s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif")
		.appendTo("#movie_player .html5-player-chrome .ytp-button[tabindex='6400']");
	$(document.createElement("div"))
		.attr("class", "yt-uix-button-icon")
		.attr("src", "http://s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif")
		.appendTo("#movie_player .html5-player-chrome .ytp-button[tabindex='6500']");
	$("#movie_player .html5-player-chrome .ytp-button[tabindex='6800']")
		.attr("aria-hidden", "true")
		.attr("style", "display: none;");
	
}















// creates video name between player and watch bar
var vidName = "<i>Video Name Unknown</i>";

vidName = $("meta[name='title']").attr("content");

if (ytStage == 1) {
debug("making the watch tray");
$(document.createElement("div"))
	.attr("id", "watch-tray")
	.insertAfter("#watch-video");
debug("watch6 tray done");
} else {
debug("making the watch tray");
$(document.createElement("div"))
	.attr("id", "watch-tray")
	.insertAfter("#player-api");
debug("watch6 tray done");
}

debug("making the watch tray title");
$(document.createElement("div"))
	.attr("id", "watch-title")
	.appendTo("#watch-tray");
debug("watch6 tray title done");


debug("making the long title");
$(document.createElement("span"))
	.attr("class", "long-title")
	.html("" + vidName + "")
	.appendTo("#watch-title");
debug("watch6 long title done");

var plTitle = $("#watch-appbar-playlist .playlist-header .playlist-title a").html();
if (hasPl == 1 && enablePlTitle == 1) {
	$(document.createElement("span"))
		.attr("id", "playlist-title")
		.html(plTitle)
		.insertBefore("#watch-title .long-title");
	$(document.createElement("img"))
		.attr("class", "yt-uix-button-icon-watch-next")
		.insertAfter("#playlist-title");
}
if (hasPl == 1 && fixPlaylists === true) {
	//watch6-playlist class or id
	$(document.createElement("div"))
		.attr("id", "watch-tray-playlist")
		.appendTo("#watch-tray");
	$(document.createElement("div"))
		.attr("class", "yt-uix-slider")
		.appendTo("#watch-tray-playlist");
	$(document.createElement("div"))
		.attr("class", "yt-uix-slider-body")
		.appendTo("#watch-tray-playlist .yt-uix-slider");
	$(document.createElement("div"))
		.attr("id", "watch-tray-playlist-content")
		.attr("class", "yt-uix-slider-slide")
		.attr("style", "")
		.appendTo("#watch-tray-playlist .yt-uix-slider-body");
	$(document.createElement("ol"))
		.attr("class", "video-list")
		.appendTo("#watch-tray-playlist-content");
	
	
	var PlItems = $("#playlist-autoscroll-list .yt-uix-scroller-scroll-unit");
	var ListId = getQueryVariable("list");
	var PlayingIndex = 0;
	
	PlItems.each(function(index, li) {
		var PlVid = $(this),
		    PlVidId,
		    PlVidTitle,
		    PlVidIndex,
		    PlVidUser,
		    PlVidPlaying,
		    PlVidNumInit,
		    PlVidNumInt,
		    PlVidNum,
		    PlVidNew;
		PlVidId = PlVid.attr("data-video-id");
		PlVidPlaying = PlVid.hasClass("currently-playing");
		PlVidTitle = PlVid.attr("data-video-title");
		//alert(PlVidTitle);
		PlVidIndex = PlVid.attr("data-index");
		PlVidUser = PlVid.attr("data-video-username");
		PlVidNumInit = parseInt(PlVidIndex);
		PlVidNumInt = PlVidNumInit + 1;
		PlVidNum = "" + PlVidNumInt;
		PlVidNew = $(document.createElement("li"))
			.attr("id", "playlist-item-" + PlVidId)
			.attr("class", "watch-tray-playlist-item yt-uix-slider-slide-unit")
			.attr("data-video-id", PlVidId)
			.appendTo("#watch-tray-playlist-content .video-list");
		$(document.createElement("a"))
			.attr("title", "")
			.attr("href", "/watch?v=" + PlVidId + "&feature=BFa&list=" + ListId + "&index=" + PlVidIndex)
			.appendTo(PlVidNew);
		$(document.createElement("span"))
			.attr("class", "video-thumb ux-thumb-")
			.appendTo("#playlist-item-" + PlVidId + " a");
		$(document.createElement("span"))
			.attr("class", "clip")
			.appendTo("#playlist-item-" + PlVidId + " .video-thumb");
		$(document.createElement("img"))
			.attr("data-thumb", "//i.ytimg.com/vi/" + PlVidId + "/mqdefault.jpg")
			.attr("data-thumb-manual", "true")
			.attr("alt", "")
			.attr("src", "//i.ytimg.com/vi/" + PlVidId + "/mqdefault.jpg")
			.appendTo("#playlist-item-" + PlVidId + " .clip");
		$(document.createElement("span"))
			.attr("class", "meta")
			.appendTo("#playlist-item-" + PlVidId + " a");
		if (PlVidPlaying === true) {
			PlVidNew.addClass("playlist-bar-item-playing");
			$(document.createElement("span"))
				.attr("class", "meta-playing playing")
				.html("Now Playing")
				.appendTo("#playlist-item-" + PlVidId + " .meta");
		}
		$(document.createElement("span"))
			.attr("class", "meta-title")
			.attr("title", PlVidTitle)
			.html("<strong>" + PlVidTitle + "</strong>")
			.appendTo("#playlist-item-" + PlVidId + " .meta");
		$(document.createElement("span"))
			.attr("class", "meta-uploader")
			.html("by " + PlVidUser)
			.appendTo("#playlist-item-" + PlVidId + " .meta");
		$(document.createElement("span"))
			.attr("class", "count-number count")
			.html("<strong>" + PlVidNum + "</strong>")
			.appendTo("#playlist-item-" + PlVidId + " .meta");

		
		
		if (PlVidPlaying === true) {
			PlVidNew.addClass("playlist-bar-item-playing");
			PlayingIndex = PlVidNumInit;
		}
		
		
	});

	
	$("body").addClass("watch6-playlist-bar");
	var PlItemSize = 452;
	var PlScroll = 152 * PlayingIndex;
	$("#watch-tray-playlist .yt-uix-slider-body").scrollLeft(PlScroll);
	
	
	
	
	
}


if (ytStage == 1) {
debug("Making the .yt-bar in stage");
$(document.createElement("div"))
	.attr("class", "yt-bar")
	.attr("id", "watch-bar-container")
	//.appendTo("#watch-stage");
	.insertAfter("#watch-stage");
debug("yt-bar done");
} else {
// creates  the command bar
debug("Making the .yt-bar");
$(document.createElement("div"))
	.attr("class", "yt-bar")
	.attr("id", "watch-bar-container")
	.insertAfter("#player");
debug("yt-bar done");
}

/*debug("Making the #watch-bar-container");
$(document.createElement("div"))
	.attr("id", "watch-bar-container")
	.appendTo(".yt-bar");
debug("#watch-bar-container done");*/


debug("Making the #watch-bar");
$(document.createElement("div"))
	.attr("id", "watch-bar")
	.appendTo("#watch-bar-container");
debug("#watch-bar done");

// make the channel button
// get the info
var userName = "<i>User Unknown</i>";
var userUrl = "";
//userName = $("#watch7-user-header .yt-user-name").text();
userName = $("#watch7-user-header .yt-user-info a").text();
userUrl = $("#watch7-user-header a.yt-user-photo").attr("href");
var userImgUrl = "";
//userImgUrl = $("img[alt='" + userName + "']").attr("src");
userImgUrl = $("#watch7-main #watch7-content #watch-header #watch7-user-header a.yt-user-photo .video-thumb .yt-thumb-square .yt-thumb-clip img").attr("src");
userImgUrl = $("#watch7-main #watch7-content #watch-header #watch7-user-header a.yt-user-photo .video-thumb .yt-thumb-square .yt-thumb-clip img").attr("data-thumb");

//fix the upload info
uploadInfoElem = $("#watch-uploader-info");
uploadInfoElemInner = $("#watch-uploader-info strong");
uploadInfo = uploadInfoElemInner.html();
if (uploadInfo.indexOf("Uploaded") >= 0) {
	uploadInfoNew = uploadInfo.replace("Uploaded on", "Uploaded by <a class='author' href='" + userUrl + "' rel='author'>" + userName + "</a> on <span id='eow-date' class='watch-video-date'>");
	uploadInfoNew += "</span>";
	$("#watch-uploader-info").html(uploadInfoNew);
} else if (uploadInfo.indexOf("Published") >= 0) {
	uploadInfoNew = uploadInfo.replace("Published on", "Uploaded by <a class='author' href='" + userUrl + "' rel='author'>" + userName + "</a> on <span id='eow-date' class='watch-video-date'>");
	uploadInfoNew += "</span>";
	$("#watch-uploader-info").html(uploadInfoNew);
}





//get sub button info
var subBtn = $("#watch7-subscription-container .yt-uix-subscription-button");
var isSub = subBtn.attr("data-is-subscribed");
//var hasSubClass = subBtn.hasClass("");
var extId = subBtn.attr("data-channel-external-id");
var subId = subBtn.attr("data-subscription-id");
var subHref = subBtn.attr("data-href");
//sessionLnk = subBtn.attr("data-sessionLink");

//make the container
debug("Making the #watch-bar-channel");
$(document.createElement("div"))
	.attr("id", "watch-bar-channel")
    .attr("class", "yt-uix-button-group")
	.appendTo("#watch-bar");
debug("#watch-bar-channel done");

// make the channel button

$(document.createElement("button"))
	.attr("id", "watch-channel-button")
	.attr("class", "watch6-button yt-uix-button-dark start")
	.attr("onclick", "window.location.href='"/*/user"*/ + userUrl + "?feature=watch'")
	.appendTo("#watch-bar-channel");

$(document.createElement("span"))
	.attr("class", "ux6-thumb")
	.attr("id", "channel-button-ux-thumb")
	.appendTo("#watch-channel-button");

$(document.createElement("img"))
	.attr("src", "" + userImgUrl + "")
	.appendTo("#channel-button-ux-thumb");



$(document.createElement("span"))
	.attr("class", "yt-uix-button-content")
	.html("" + userName + "")
	.appendTo("#watch-channel-button");




// make the subscribe button
if(isSub !== "false" && isSub !== undefined) {
	$(document.createElement("button"))
		.attr("id", "watch6-subscribe")
		.attr("class", "watch6-button yt-uix-button-dark yt-uix-subscription-button yt-subscription-button end yt-can-buffer yt-uix-button-subscribed-watch6")
		.attr("data-sessionlink", "itct=")
		.attr("data-style-type", "watch6")
		.attr("data-is-subscribed", "true")
		.attr("type", "button")
		.attr("data-subscription-id", subId)
		.attr("data-channel-external-id", extId)
		.attr("onclick", ";return false;")
		.attr("aria-live", "polite")
		.attr("aria-busy", "false")
		.appendTo("#watch-bar-channel");
	$(document.createElement("div"))
		.attr("class", "yt-uix-button-content")
		.attr("id", "watch6-subscribe-content")
		.html("subscribed")
		.appendTo("#watch6-subscribe");
} else if (subHref !== "false" || subHref !== undefined) {
	$(document.createElement("button"))
		.attr("id", "watch6-subscribe")
		.attr("class", "watch6-button yt-uix-button-dark yt-uix-subscription-button end yt-can-buffer yt-uix-button-subscribe-watch6")
		.attr("data-sessionlink", "itct=")
		.attr("data-style-type", "watch6")
		.attr("type", "button")
		.attr("data-channel-external-id", extId)
		.attr("onclick", ";return false;")
		.attr("data-href", subHref)
		.appendTo("#watch-bar-channel");
	$(document.createElement("div"))
		.attr("class", "yt-uix-button-content")
		.attr("id", "watch6-subscribe-content")
		.html("subscribe")
		.appendTo("#watch6-subscribe");
} else {
	$(document.createElement("button"))
		.attr("id", "watch6-subscribe")
		.attr("class", "watch6-button yt-uix-button-dark yt-uix-subscription-button end yt-can-buffer yt-uix-button-subscribe-watch6")
		.attr("data-sessionlink", "itct=")
		.attr("data-style-type", "watch6")
		.attr("type", "button")
		.attr("data-channel-external-id", extId)
		.attr("onclick", ";return false;")
		.appendTo("#watch-bar-channel");
	$(document.createElement("div"))
		.attr("class", "yt-uix-button-content")
		.attr("id", "watch6-subscribe-content")
		.html("subscribe")
		.appendTo("#watch6-subscribe");
}








// stuff
// switcher (might not be used)
debug("Making the #watch-bar-switcher");
$(document.createElement("div"))
	.attr("id", "watch-bar-switcher")
    .attr("class", "yt-uix-button-group")
	.appendTo("#watch-bar");
debug("#watch-bar-switcher done");


$(document.createElement("button"))
	.attr("id", "watch-switcher-button-comments")
	.attr("class", "watch6-button yt-uix-button-dark start yt-uix-button-toggled")
	.html("<span class='yt-uix-button-content'>Comments</span>")
	.click(function() {
		$("#watch7-main").removeClass("watch-3col");
		$("#watch-switcher-button-comments").removeClass("yt-uix-button-toggled");
		$("#watch-switcher-button-comments").addClass("yt-uix-button-toggled");
		$("#watch-switcher-button-suggested").removeClass("yt-uix-button-toggled");
	})
	.appendTo("#watch-bar-switcher");
$(document.createElement("button"))
	.attr("id", "watch-switcher-button-suggested")
	.attr("class", "watch6-button yt-uix-button-dark end")
	.html("<span class='yt-uix-button-content'>Suggested Videos</span>")
	.click(function() {
		$("#watch7-main").removeClass("watch-3col");
		$("#watch7-main").addClass("watch-3col");
		$("#watch-switcher-button-suggested").removeClass("yt-uix-button-toggled");
		$("#watch-switcher-button-suggested").addClass("yt-uix-button-toggled");
		$("#watch-switcher-button-comments").removeClass("yt-uix-button-toggled");
	})
	.appendTo("#watch-bar-switcher");




// actions (resizers)
debug("Making the #watch-bar-actions");
$(document.createElement("div"))
	.attr("id", "watch-bar-actions")
    .attr("class", "yt-uix-button-group")
	.appendTo("#watch-bar");
debug("#watch-bar-actions done");

// make the small button

// make an h5
$(document.createElement("h5"))
	.html("Video Size:")
	.appendTo("#watch-bar-actions");

$(document.createElement("button"))
	.attr("id", "watch-button-size-small")
	.attr("class", "watch6-button yt-uix-button-dark yt-uix-button-watch6-small yt-uix-tooltip start")
	.attr("onclick", ";return false;")
	.attr("title", "Small")
	.click(function() {
		$("#watch-button-size-small").removeClass("yt-uix-button-toggled");
//		if (3Dsizes == 1) {
        if (threeDsizes == 1) {
		$("#watch-button-size-small-3D").removeClass("yt-uix-button-toggled");
		}
		if (standardsizes == 1) {
		$("#watch-button-size-small-standard").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-medium-standard").removeClass("yt-uix-button-toggled");
		}
		$("#watch-button-size-full").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-large").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-medium").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-small").addClass("yt-uix-button-toggled");
		//setPlayer6Small();
		setPlayer6("Small", "Wide");
	})
	.appendTo("#watch-bar-actions");

$(document.createElement("span"))
	.attr("class", "watch6-icon yt-uix-button-span-watch6-small yt-uix-button-icon-wrapper")
	.attr("id", "watch6-small-icon-wrapper")
	.appendTo("#watch-button-size-small");
	
 $(document.createElement("img"))
	.attr("class", "yt-uix-button-icon yt-uix-button-icon-watch6-small")
	.attr("id", "watch6-small-icon")
	.appendTo("#watch6-small-icon-wrapper");

//TODO: standard small
if (standardsizes == 1) {
$(document.createElement("button"))
	.attr("id", "watch-button-size-small-standard")
	.attr("class", "watch6-button yt-uix-button-dark yt-uix-button-watch6-small-standard yt-uix-tooltip middle")
	.attr("onclick", ";return false;")
	.attr("title", "Small 4&#58;3")
	.click(function() {
		$("#watch-button-size-small").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-small-standard").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-medium-standard").removeClass("yt-uix-button-toggled");
//		if (3Dsizes == 1) {
        if (threeDsizes == 1) {
		$("#watch-button-size-small-3D").removeClass("yt-uix-button-toggled");
		}
		$("#watch-button-size-full").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-large").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-medium").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-small-standard").addClass("yt-uix-button-toggled");
		//setPlayer6SmallStandard();
		setPlayer6("Small", "Standard");
	})
	.appendTo("#watch-bar-actions");

$(document.createElement("span"))
	.attr("class", "watch6-icon yt-uix-button-span-watch6-small-standard yt-uix-button-icon-wrapper")
	.attr("id", "watch6-small-standard-icon-wrapper")
	.appendTo("#watch-button-size-small-standard");
	
 $(document.createElement("img"))
	.attr("class", "yt-uix-button-icon yt-uix-button-icon-watch6-small-standard")
	.attr("id", "watch6-small-standard-icon")
	.appendTo("#watch6-small-standard-icon-wrapper");


}


// TODO: 3D small

if (threeDsizes == 1) {
    
$(document.createElement("button"))
	.attr("id", "watch-button-size-small-3D")
	.attr("class", "watch6-button yt-uix-button-dark yt-uix-button-watch6-small-3D yt-uix-tooltip middle")
	.attr("onclick", ";return false;")
	.attr("title", "Small 3D")
	.click(function() {
		$("#watch-button-size-small").removeClass("yt-uix-button-toggled");
		if (standardsizes == 1) {
		$("#watch-button-size-small-standard").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-medium-standard").removeClass("yt-uix-button-toggled");
		}
		$("#watch-button-size-small-3D").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-full").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-large").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-medium").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-small-3D").addClass("yt-uix-button-toggled");
		//setPlayer6Small3D();
		setPlayer6("Small", "Wide-3D");
	})
	.appendTo("#watch-bar-actions");

$(document.createElement("span"))
	.attr("class", "watch6-icon yt-uix-button-span-watch6-small-3D yt-uix-button-icon-wrapper")
	.attr("id", "watch6-small-3D-icon-wrapper")
	.appendTo("#watch-button-size-small-3D");
	
 $(document.createElement("img"))
	.attr("class", "yt-uix-button-icon yt-uix-button-icon-watch6-small-3D")
	.attr("id", "watch6-small-icon-3D")
	.appendTo("#watch6-small-3D-icon-wrapper");
    
}


// make the medium button

$(document.createElement("button"))
	.attr("id", "watch-button-size-medium")
	.attr("class", "watch6-button yt-uix-button-dark yt-uix-button-watch6-medium yt-uix-tooltip middle")
	.attr("onclick", ";return false;")
	.attr("title", "Medium")
	.click(function() {
		$("#watch-button-size-medium").removeClass("yt-uix-button-toggled");
		if (threeDsizes == 1) {
		$("#watch-button-size-small-3D").removeClass("yt-uix-button-toggled");
		}
		if (standardsizes == 1) {
		$("#watch-button-size-small-standard").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-medium-standard").removeClass("yt-uix-button-toggled");
		}
		$("#watch-button-size-full").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-large").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-small").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-medium").addClass("yt-uix-button-toggled");
		//setPlayer6Medium();
		setPlayer6("Medium", "Wide");
	})
	.appendTo("#watch-bar-actions");

$(document.createElement("span"))
	.attr("class", "watch6-icon-wrapper yt-uix-button-icon-wrapper-watch6-medium yt-uix-button-icon-wrapper")
	.attr("id", "watch6-medium-icon-wrapper")
	.appendTo("#watch-button-size-medium");
	
 $(document.createElement("img"))
	.attr("class", "yt-uix-button-icon yt-uix-button-icon-watch6-medium")
	.attr("id", "watch6-medium-icon")
	.appendTo("#watch6-medium-icon-wrapper");

//TODO: standard medium
if (standardsizes == 1) {
$(document.createElement("button"))
	.attr("id", "watch-button-size-medium-standard")
	.attr("class", "watch6-button yt-uix-button-dark yt-uix-button-watch6-medium-standard yt-uix-tooltip middle")
	.attr("onclick", ";return false;")
	.attr("title", "Medium 4&#58;3")
	.click(function() {
		$("#watch-button-size-medium").removeClass("yt-uix-button-toggled");
		if (threeDsizes == 1) {
		$("#watch-button-size-small-3D").removeClass("yt-uix-button-toggled");
		}
		$("#watch-button-size-small-standard").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-medium-standard").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-full").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-large").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-small").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-medium-standard").addClass("yt-uix-button-toggled");
		//setPlayer6MediumStandard();
		setPlayer6("Medium", "Standard");
	})
	.appendTo("#watch-bar-actions");

$(document.createElement("span"))
	.attr("class", "watch6-icon-wrapper yt-uix-button-icon-wrapper-watch6-medium-standard yt-uix-button-icon-wrapper")
	.attr("id", "watch6-medium-standard-icon-wrapper")
	.appendTo("#watch-button-size-medium-standard");
	
 $(document.createElement("img"))
	.attr("class", "yt-uix-button-icon yt-uix-button-icon-watch6-medium-standard")
	.attr("id", "watch6-medium-standard-icon")
	.appendTo("#watch6-medium-standard-icon-wrapper");
}

// TODO: 3D medium

if (threeDsizes == 1) {
    
}

// make the large button

$(document.createElement("button"))
	.attr("id", "watch-button-size-large")
	.attr("class", "watch6-button yt-uix-button-dark yt-uix-button-watch6-large yt-uix-tooltip middle")
	.attr("onclick", ";return false;")
	.attr("title", "Large")
	.click(function() {
		$("#watch-button-size-large").removeClass("yt-uix-button-toggled");
		if (threeDsizes == 1) {
		$("#watch-button-size-small-3D").removeClass("yt-uix-button-toggled");
		}
		if (standardsizes == 1) {
		$("#watch-button-size-small-standard").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-medium-standard").removeClass("yt-uix-button-toggled");
		}
		$("#watch-button-size-full").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-small").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-medium").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-large").addClass("yt-uix-button-toggled");
		//setPlayer6Large();
		setPlayer6("Large", "Wide");
	})
	.appendTo("#watch-bar-actions");

$(document.createElement("span"))
	.attr("class", "watch6-icon yt-uix-button-span-watch6-large yt-uix-button-icon-wrapper")
	.attr("id", "watch6-large-icon-wrapper")
	.appendTo("#watch-button-size-large");
	
 $(document.createElement("img"))
	.attr("class", "yt-uix-button-icon yt-uix-button-icon-watch6-large")
	.attr("id", "watch6-large-icon")
	.appendTo("#watch6-large-icon-wrapper");

// TODO:3D large

if (threeDsizes == 1) {
    
}

// make the full button

$(document.createElement("button"))
	.attr("id", "watch-button-size-full")
	.attr("class", "watch6-button yt-uix-button-dark yt-uix-button-watch6-full yt-uix-tooltip end")
	.attr("onclick", ";return false;")
	.attr("title", "Fill screen")
	.click(function() {
		$("#watch-button-size-full").removeClass("yt-uix-button-toggled");
		if (threeDsizes == 1) {
		$("#watch-button-size-small-3D").removeClass("yt-uix-button-toggled");
		}
		if (standardsizes == 1) {
		$("#watch-button-size-small-standard").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-medium-standard").removeClass("yt-uix-button-toggled");
		}
		$("#watch-button-size-large").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-small").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-medium").removeClass("yt-uix-button-toggled");
		$("#watch-button-size-full").addClass("yt-uix-button-toggled");
		//setPlayer6Full();
		setPlayer6("Full", "Wide");
	})
	.appendTo("#watch-bar-actions");

$(document.createElement("span"))
	.attr("class", "watch6-icon yt-uix-button-span-watch6-full yt-uix-button-icon-wrapper")
	.attr("id", "watch6-full-icon-wrapper")
	.appendTo("#watch-button-size-full");
	
 $(document.createElement("img"))
	.attr("class", "yt-uix-button-icon yt-uix-button-icon-watch6-full")
	.attr("id", "watch6-full-icon")
	.appendTo("#watch6-full-icon-wrapper");


if (saveSize === true) {
	//alert("size set initiated");
	newSize = GM_getValue("lastSize", "Small");
	newSizeBtn = GM_getValue("lastSizeBtn", "small");
	//newSize = "Small";


	setPlayer6(newSize, "wide");
	$("#watch-button-size-" + newSizeBtn).addClass("yt-uix-button-toggled");



}



// Remove Crash notice
debug("Removing crash notice");
insertCSS("#bwpCrash {display:none !important;} ");






// ---------------------------------------------------------------------------------------------
// FUNCTIONS



/*function onYouTubePlayerReady(playerId) {
ytplayer = document.getElementById('movie_player');
//ytplayer = $("#movie_player");
//setInterval(updateytplayerInfo, 250);
//updateytplayerInfo();
ytplayer.addEventListener('onStateChange', 'www_watch6_onPlayerStateChange');
ytplayer.addEventListener('SIZE_CLICKED', 'www_watch6_onPlayerSizeClicked');
}

function www_watch6_onPlayerStateChange(newstate) {

}
function www_watch6_onPlayerSizeClicked(playsize) {

	if (playsize === true) {
		setPlayer6("Medium", "Wide");
	}
	else {
		setPlayer6("Small", "Wide");
	}

}*/




function doAlert(text) {
	if (alertsEnabled === true) {
		alert(text);
	}
	else {
		//do nothing, alerts aren't enabled.
	}
}




function setPlayer6(size, type) {
	$("#watch7-container")
		.removeClass("watch6-wide")
		.removeClass("watch6-wide-3D")
		.removeClass("watch6-standard")
		.removeClass("watch6-small")
		.removeClass("watch6-medium")
		.removeClass("watch6-large")
		.removeClass("watch6-full");
	$("#page")
		.removeClass("watch6-wide")
		.removeClass("watch6-wide-3D")
		.removeClass("watch6-standard")
		.removeClass("watch6-small")
		.removeClass("watch6-medium")
		.removeClass("watch6-large")
		.removeClass("watch6-full");
	$("#body-container")
		.removeClass("watch6-fill")
		.removeClass("watch6-full");
	$("#footer-container")
		.removeClass("watch6-fill")
		.removeClass("watch6-full");
	$("body")
		.removeClass("watch6-full");
	$("#player")
		.removeClass("watch-small")
		.removeClass("watch-medium")
		.removeClass("watch-large")
		.removeClass("watch-wide")
		.removeAttr("style");
	$("#player-api")
		.removeAttr("style");
	if (size == "Small") {
		debug("Function: setPlayerSize");
		$("#watch7-container")
			.addClass("watch6-small");
		$("#page")
			.addClass("watch6-small");
		GM_setValue("lastSize", "Small");
		GM_setValue("lastSizeBtn", "small");
		debug("End function: setPlayer6small");
	} else if (size == "Medium") {
		debug("Function: setPlayerSize");
		$("#watch7-container")
			.addClass("watch6-medium");
		$("#page")
			.addClass("watch6-medium");
		GM_setValue("lastSize", "Medium");
		GM_setValue("lastSizeBtn", "medium");
		debug("End function: setPlayer6medium");
	} else if (size == "Large") {
		debug("Function: setPlayerSize");
		$("#watch7-container")
			.addClass("watch6-large");
		$("#page")
			.addClass("watch6-large");
		GM_setValue("lastSize", "Large");
		GM_setValue("lastSizeBtn", "large");
		debug("End function: setPlayer6large");
	} else if (size == "Full") {
		debug("Function: setPlayerSize");
		$("#watch7-container")
			.addClass("watch6-full");
		$("#body-container")
			.addClass("watch6-fill")
			.addClass("watch6-full");
		$("#footer-container")
			.addClass("watch6-fill")
			.addClass("watch6-full");
		$("#page")
			.addClass("watch6-full");
		$("body")
			.addClass("watch6-full");
		GM_setValue("lastSize", "Full");
		GM_setValue("lastSizeBtn", "full");
		debug("End function: setPlayer6full");
	} else { //invalid size was set, so return an error and set to small...
	debug("Error! Invalid size! Setting player to small.");
		$("#watch7-container")
			//.attr("class", "watch6-wide watch6-small");
			.addClass("watch6-wide")
			.addClass("watch6-small");
		$("#page")
			.addClass("watch6-small");
	}

	
	if (type == "Wide") {
		$("#watch7-container")
			.addClass("watch6-wide");
		$("#page")
			.addClass("watch6-wide");
	} else if (type == "Standard") {
		$("#watch7-container")
			.addClass("watch6-standard");
		$("#page")
			.addClass("watch6-standard");
	} else if (type == "Wide-3D") {
		$("#watch7-container")
			.addClass("watch6-wide-3D");
		$("#page")
			.addClass("watch6-wide-3D");
	} else { //no or invalid type specified, assume wide, but don't throw error
		$("#watch7-container")
			.addClass("watch6-wide");
		$("#page")
			.addClass("watch6-wide");
	}
	
}










function debugDisable() {
	var currentPage = window.location.toString();
	currentPage = currentPage.substring(0, currentPage.indexOf("&debug=1"));
	window.location = currentPage;
}

function debugEnable() {
	var currentPage = window.location.toString();
	currentPage = currentPage + "&debug=1";
	window.location = currentPage;
}

function debugModeStart() {
	if (script.debugOn) {
		alert("\""+script.name+"\" Script - Debug Mode \n\nDebug Mode has been enabled. \n\nAfter you click \"OK\" on this message, please wait 5 seconds and another message (like this one) should appear with further instructions. \n\nIf no message appears please copy the \"debug log\" text from the box in YouTube's header, and paste it in a message on this script's page on Userscripts.org so the script author can help you.\n");
		var debugBox = document.createElement("div");
		debugBox.innerHTML = "<h1>\""+script.name+"\" Debug Log</h1> <textarea id='bwpDebugLog' style='border:4px solid red !important; width:500px !important; height:150px !important;' readonly='readonly'>DEBUG LOG</textarea> <br/> <input type='button' value='Reload page without debug' id='bwpDebugDisable' /> - Pressing this button will also remove the debug log, so please copy/paste the debug log before pressing the button.";
		document.body.insertBefore(debugBox, document.body.children[0]);
		document.getElementById("bwpDebugDisable").addEventListener("click", debugDisable, true);
	}
}

function debugModeEnd() {
	if (script.debugOn) {
		debug("Ending Debug Process");
		alert("\""+script.name+"\" Script - Debug Mode \n\nDebugging has been completed. \n\nThere is now a \"debug log\" in YouTube's header. Please copy the debug log and paste it in a message on this script's page on Userscripts.org \n\nAfter you've posted the debug log, click \"Reload page without debug\" which will turn off debug mode and will reload the page.");
		document.getElementById("bwpDebugLog").focus();
		document.getElementById("bwpDebugLog").select();
	}
}

function debug(message) {
	if (script.debugOn) {
		script.debugMessages = script.debugMessages + message + "\n";
		try {
			document.getElementById("bwpDebugLog").value = script.debugMessages;
		} catch (ex) {
		}
	}
}

function checkForDebugMode() {
	var currentPage = window.location.toString();
	if (currentPage.indexOf("debug=1") > -1) {
		return true;
	}
	return false;
}



debug("Constructing crash notification");
$(document.createElement("div"))
	.attr("id", "bwpCrash")
	.attr("style", "font-size:12px !important; border:1px solid black !important; padding:2px !important; margin:2px !important; font-weight:bold !important;")
	.html("'" + script.name + "' has crashed. Refresh the page if this is the first time. If it still crashes, try 'debug mode' and <a href='"+script.discussion+"' target='_window'>report</a> the error to the script developer. <a class='debugLink' href='" + window.location + "&debug=1'>Click here</a> to load debug mode (page will reload). Already running debug mode? The debug log should be displayed above.")
	.insertBefore("#page");

if (!script.debugOn) {
	GM_registerMenuCommand("Enable Debug Mode for \"" + script.name + "\"", debugEnable, "D");
}


function insertCSS(cssToInsert) {
	var head=document.getElementsByTagName('head')[0];
	if(!head)
		return;
	var style=document.createElement('style');
	style.setAttribute('type','text/css');
	style.appendChild(document.createTextNode(cssToInsert));
	head.appendChild(style);
}


function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}




/*
function insertAfter(new_node, existing_node) {
	// if the existing node has a following sibling, insert the current
	// node before it. otherwise appending it to the parent node
	// will correctly place it just after the existing node.

	if (existing_node.nextSibling) {
		// there is a next sibling. insert before it using the mutual
		// parent's insertBefore() method.
		existing_node.parentNode.insertBefore(new_node, existing_node.nextSibling);
	} else {
		// there is no next sibling. append to the end of the parent's
		// node list.
		existing_node.parentNode.appendChild(new_node);
	}

} // insertAfter()*/






// Wrapper for GM_xmlhttpRequest
/*function GM_XHR() {
    this.type = null;
    this.url = null;
    this.async = null;
    this.username = null;
    this.password = null;
    this.status = null;
    this.headers = {};
    this.readyState = null;

    this.open = function(type, url, async, username, password) {
        this.type = type ? type : null;
        this.url = url ? url : null;
        this.async = async ? async : null;
        this.username = username ? username : null;
        this.password = password ? password : null;
        this.readyState = 1;
    };

    this.setRequestHeader = function(name, value) {
        this.headers[name] = value;
    };

    this.abort = function() {
        this.readyState = 0;
    };

    this.getResponseHeader = function(name) {
        return this.headers[name];
    };

    this.send = function(data) {
        this.data = data;
        var that = this;
        GM_xmlhttpRequest({
            method: this.type,
            url: this.url,
            headers: this.headers,
            data: this.data,
            onload: function(rsp) {
                // Populate wrapper object with returned data
                for (k in rsp) {
                    that[k] = rsp[k];
                }
            },
            onerror: function(rsp) {
                for (k in rsp) {
                    that[k] = rsp[k];
                }
            },
            onreadystatechange: function(rsp) {
                for (k in rsp) {
                    that[k] = rsp[k];
                }
            }
        });
    };
};

$.ajaxSetup({
    xhr: function(){return new GM_XHR;}
});*/









debug("Reached sequential end of script");
debugModeEnd();	
// End of script





debug("Reached sequential end of script");
debugModeEnd();	
// End of script














