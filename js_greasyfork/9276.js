// ==UserScript==
// @name         [UPPDATERAS INTE LÄNGRE OCH ÄR 100% TRASIG] SweClockers YouTube > JWPlayer
// @namespace    fXndFLHN4hq3ntiSL5q7
// @author       LemonIllusion
// @version      1.6.7
// @match        http://www.sweclockers.com/artikel/*
// @match        http://www.sweclockers.com/nyhet/*
// @match        http://www.sweclockers.com/recension/*
// @description  Ersätter JWPlayer i artiklar med YouTubes egna spelare
// @downloadURL https://update.greasyfork.org/scripts/9276/%5BUPPDATERAS%20INTE%20L%C3%84NGRE%20OCH%20%C3%84R%20100%25%20TRASIG%5D%20SweClockers%20YouTube%20%3E%20JWPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/9276/%5BUPPDATERAS%20INTE%20L%C3%84NGRE%20OCH%20%C3%84R%20100%25%20TRASIG%5D%20SweClockers%20YouTube%20%3E%20JWPlayer.meta.js
// ==/UserScript==

function insertVideo(videoID) {
    var autoPlay = "";
    if (window.location.hash == "#autoplay" && window.location.href.split("?")[1] != "noautoplay#autoplay") {
        autoPlay = "?autoplay=1";
    }
    document.getElementsByClassName("bbvideo-inner")[0].innerHTML = '<iframe type="text/html" width="643" height="362" src="https://www.youtube.com/embed/'+videoID+autoPlay+'" frameborder="0" allowfullscreen></iframe>';
}

if (document.getElementsByClassName("bbvideo-inner")[0] !== undefined) {
    if (document.getElementsByClassName("bbvideo-inner")[0].getElementsByTagName("div")[0].style.cssText == "position: relative; width: auto; height: auto;" || document.getElementsByClassName("bbvideo-inner")[0].getElementsByTagName("div")[0].style.cssText == "position: relative; width: 320px; height: 200px;") {
        insertVideo(document.getElementsByClassName("bbvideo-inner")[0].getElementsByTagName("param")[4].value.split("youtube.com%2Fwatch%2Fv%2F")[1].split("&")[0]);
    } else {
        if (window.location.hash != "#autoplay") {
            window.location.href = window.location.href.split("#")[0]+"?noautoplay#autoplay";
        }
        setTimeout(function(){ insertVideo(document.getElementsByClassName("bbvideo-inner")[0].getElementsByTagName("param")[0].value.split("youtube.com/v/")[1].split("&")[0]); }, 1000);
    }
}