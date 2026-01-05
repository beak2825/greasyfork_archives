// ==UserScript==
// @name        youtuberepeat
// @namespace   qqboxy
// @description Youtube Repeat Tool
// @match     http://www.youtube.com/*
// @match     https://www.youtube.com/*
// @version     2.3.3
// @downloadURL https://update.greasyfork.org/scripts/8651/youtuberepeat.user.js
// @updateURL https://update.greasyfork.org/scripts/8651/youtuberepeat.meta.js
// ==/UserScript==
(function () {
    window.onload = function() {
        var BUTTON_TEXT = {
            'zh-TW':'重複播放',
            'en' : 'Repeat'
        };
        var BUTTON_TOOLTIP = {
            'zh-TW':'自動重複播放此影片',
            'en' : 'Repeat videos automatically'
        };
        var url = "http://youtuberepeat.blogspot.com/?" + location.href;
        var language = document.documentElement.getAttribute('lang');
        var buttonText = (BUTTON_TEXT[language])?BUTTON_TEXT[language]:BUTTON_TEXT['en'];
        var buttonTootip = (BUTTON_TOOLTIP[language])?BUTTON_TOOLTIP[language]:BUTTON_TOOLTIP['en'];
        //document.getElementById("top-level-buttons").innerHTML += "<span><a href=\""+url+"\"><button class=\"yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-tooltip\" data-tooltip-text=\""+buttonTootip+"\" title=\""+buttonTootip+"\"><span class=\"yt-uix-button-content\">↺ "+buttonText+"</span></button></a></span>";
        var span = document.createElement("span");
        span.innerHTML = "<a href=\""+url+"\"><button title=\""+buttonTootip+"\"><span>↺ "+buttonText+"</span></button></a>";
        document.getElementById("count").appendChild(span);
    };
})();