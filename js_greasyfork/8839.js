// ==UserScript==
// @name         Youtube Video Controls Manager
// @version      0.18
// @description  Manages the video controls overlay on a youtube video, to prevent it blocking 30-40 pixels on the bottom of the video
// @include      http*://www.youtube.com/watch?*
// @author       D.Slee
// @require      http://code.jquery.com/jquery-1.11.0.min.js

// @namespace http://your.homepage/
// @downloadURL https://update.greasyfork.org/scripts/8839/Youtube%20Video%20Controls%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/8839/Youtube%20Video%20Controls%20Manager.meta.js
// ==/UserScript==
//Known bugs
//- Having inspect element open sometimes breaks cursor functions and make animations laggy
//- Using some screen capture programs such as OBS break cursor functionality

//Fading Parameters
var fs = 0;
var fadeState = 1;
var tempTooltip = null;
var inPar = ["", "scaleY(1)", "translateY(0px) scale(1)", 1];                                           //Fading parameters (tooltip, progBar, scrubBtn, fades)
var outPar = ["", "scaleY(0.375)", "translateY(2.5px) scale(0)", 0];
var timeoutPar = ["none", "scaleY(0.375)", "translateY(2.5px) scale(0)", 0];

//Objects
var playerAPI = document.getElementById("player-api");                                                  //Entire player Wrapper
var movie_player = document.getElementById("movie_player");                                             //Entire player (child of playerAPI)
var vidContWrap = document.getElementsByClassName("html5-video-controls")[0];                           //All the video controls
var vidCont = document.getElementsByClassName("html5-player-chrome")[0];                                //All the video controls (not including progress bar)
var progBar = document.getElementsByClassName("ytp-progress-bar-container")[0];                         //Progress Bar
var progList = document.getElementsByClassName("ytp-progress-list")[0];                                 //Progress Bar (child of progBar)
var scrubBn = document.getElementsByClassName("html5-scrubber-button")[0];                              //Circle Button (on progress bar)
var tooltip = document.getElementsByClassName("ytp-progress-tooltip")[0];                               //Tooltip on scrubBtn
var vidHeader = document.getElementsByClassName("html5-info-bar ytp-can-share ytp-can-sentiment")[0];   //Video header, synchronises fullscreen

//Feel free to edit these parameters (experimental)
var timeout = 1500;                                                                                     //Change the length of time before it fades on idle (in ms)
var fadeOutInterval = setTimeout(Fade, timeout, timeoutPar);                                            //Interval used to fade out when inactive

//Make it always visible to override script
vidContWrap.style.setProperty("opacity", 1, "important");                                               //Disables youtube's opacity fade script on the progress bar
progList.style.setProperty("transform", "scaley(1)", "important");                                      //Disables youtube's height script
movie_player.style.setProperty("cursor", "default", "important");                                       //Fixes youtube script that makes the cursor property none when idle

progList.style.transition = "0.25s cubic-bezier(0.4,0,0.2,1)";                                           //Sets animation properties
scrubBn.style.transition = "all 0.25s cubic-bezier(0.4,0,0.2,1), left 1ms";

//Handles mouse events and fades
MainProgram();
function MainProgram(){
    playerAPI.addEventListener("mousemove", HandleMouseMove);                                           //The event listener needs to be on playerAPI otherwise it would not trigger when the cursor is hidden (on it's child, movie_player)
    playerAPI.addEventListener("mouseout", HandleMouseOut);
    scrubBn.addEventListener("mouseenter", HandleScrubEnter);
    scrubBn.addEventListener("mouseout", HandleScrubOut);
    $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', Fullscreen);
}

function HandleMouseMove(){
    if (fadeState === 0){
        Fade(inPar);
        clearTimeout(fadeOutInterval);
        fadeOutInterval = setTimeout(Fade, timeout, timeoutPar);
    }
}

function HandleMouseOut(){
    if (fadeState === 1){
        Fade(outPar);
    }
}

function Fade(parameters){
    clearTimeout(fadeOutInterval);
    movie_player.style.setProperty("cursor", parameters[0], "important");
    if (tempTooltip !== null){
        tooltip.style.setProperty("display", tempTooltip, null);
        tempTooltip = null;
    }
    if (parameters[0].length > 1){
        tempTooltip = GetStyle(tooltip, "display");
        tooltip.style.setProperty("display", parameters[0], null);
    }
    if (parameters[0] == "none"){
        scrubBn.style.setProperty("background", "#aeaeae", "important");
    }
    if (fs === 0){
        progList.style.setProperty("transform", parameters[1], "important");        
        scrubBn.style.setProperty("transform", parameters[2], "important");
    } else {
        vidHeader.style.setProperty("opacity", parameters[3], "important");
        vidContWrap.style.setProperty("opacity", parameters[3], "important");
    }
    fadeState = parameters[3];
}

function GetStyle(el,styleProp){
    var y;
    if (el.currentStyle){
		y = el.currentStyle[styleProp];
    } else if (window.getComputedStyle){
		y = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
    }
	return y;
}

function HandleScrubEnter(){
    scrubBn.style.setProperty("background", "#cc181e", "important");
}

function HandleScrubOut(){
    scrubBn.style.setProperty("background", "#aeaeae", "important");
}

function Fullscreen(){
    fs = (fs + 1) % 2;
    if (fs === 0){
        vidContWrap.style.setProperty("opacity", "1", "important");
        vidHeader.style.setProperty("display", "none", "important");
    }
    if (fs === 1){
        vidHeader.style.setProperty("display", "block", "important");
    }
}