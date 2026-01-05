// ==UserScript==
// @name         YouTube Lite
// @icon         http://s.ytimg.com/yts/img/favicon_144-vflWmzoXw.png
// @namespace    x4_ytlite
// @version      0.5.15
// @description  Makes YouTube fancier
// @author       x4fab
// @match        http://www.youtube.com/*
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/9470/YouTube%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/9470/YouTube%20Lite.meta.js
// ==/UserScript==

if (window.top != window.self){
    return;
}

if (location.protocol === 'http:'){
    location.replace(location.href.replace(/^http:/, 'https:')); 
}

window.addEventListener('load', function (){
    var styleNode = document.createElement('style');
    styleNode.innerHTML = ''.slice.call(function(){/*
        #appbar-guide-menu{
            height:100vh;
            opacity:1;
            visibility:visible;
            left:-230px;
            margin-top:0;
            transition:opacity .25s cubic-bezier(0.4,0,0.2,1),left .25s cubic-bezier(0.4,0,0.2,1);
            transition-delay:.4s;border-right:1px solid #e3e3e3;
        }
        #appbar-guide-menu:hover, #appbar-guide-menu.e-active  {
            left: 0;
            opacity: 1;
            transition-delay: 0s;
        }
        #appbar-guide-button-container  {
            visibility: hidden;
        }
        
        #masthead-positioner  {
            position: fixed;
            top: -52px;
            opacity: 1;
            transition: opacity .25s cubic-bezier(0.4,0,0.2,1), top .25s cubic-bezier(0.4,0,0.2,1);
            transition-delay: .4s;
            box-shadow: none;
        }
        #masthead-positioner:hover, #masthead-positioner.e-active {
            top: 0;
            opacity: 1;
            transition-delay: 0s;
        }
        #masthead-positioner-height-offset {
            display: none;
        }
        
        .yt-card, .guide-flyout {
            box-shadow: none;
        }
        #content {
            margin-top: calc(100vh + 10px);
        }
        #placeholder-player {
            display: none;
        }
        #watch7-main {
            position: static;
        }
        #watch7-content {
            z-index: 100;
            position: relative;
        }
        #watch7-sidebar {
            z-index: 5;
        }
        
        #footer-container {
            width: auto;
            min-width: 1003px;
            max-width: 1066px;
            margin: 0 auto;
            padding: 0 30px;
            z-index: 5;
            position: relative;
            box-sizing: border-box;
        }
        @media screen and (min-height: 630px) and (min-width: 1294px){ #footer-container {
            max-width: 1280px;
        } }
        @media screen and (min-height: 980px) and (min-width: 1720px){ #footer-container {
            max-width: 1706px;
        } }
        #footer {
            padding-bottom: 0;
        }
        #footer-logo {
            display: none;
        }
        
        .yt-uix-expander-collapsed #watch-description-text {
            max-height: none;
        }
        .yt-uix-expander-collapsed .yt-uix-expander-body {
            display: block !important;
        }
        .yt-card.yt-uix-expander .yt-uix-button-expander, .yt-card .yt-uix-expander .yt-uix-button-expander {
            display: none !important;
        }
        
        #player {
            top: 0;
        }
        #player-api {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 100vh !important;
            margin: 0 auto;
        }
        .video-stream.html5-main-video {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 100vh !important;
            width: 100vw !important;
        }
        .html5-video-player {
            overflow: visible;
        }
        .html5-video-content {
            __z-index: 799;
        }
        body, .watch-stage-mode #theater-background {
            background-color: #000;
        }
        
        .html5-video-controls {
            opacity: 0;
            transition-delay: .4s;
        }
        .html5-video-controls:hover, .html5-video-controls.e-active {
            opacity: 1 !important;
            transition-delay: 0s;
        }
        
        .ytp-player-content.ytp-iv-player-content {
            width: 0;
            right: 0;
            left: auto;
            position: fixed;
            bottom: 0 !important;
        }
        .videowall-endscreen.html5-endscreen {
            width: 100vw;
            position: fixed;
            height: 100vh;
            top: 0;
            left: 0;
        }
        
        .us_box {
            position: fixed;
            border-radius: 0;
            border: 1px solid #e3e3e3;
            padding: 15px;
        }
        .us_box h3, .us_submitbuttons {
            background-color: #fff;
            color: #333;
            border: none;
            padding-left: 0;
            padding-right: 0;
        }

        #us_infobox {
            position: fixed;
            border-radius: 0;
            border: 1px solid #e3e3e3;
            padding: 15px;
            background: white;
        }
        
        .us_error {
            color: red;
            border: none;
            background: none;
            color: #333 !important;
            font-size: 12px;
        }
        
        .watch-stage-mode #player .player-api {
            margin: 0 auto !important;
        }
        .watch-wide #watch7-sidebar, .watch-wide #watch7-preview {
            z-index:  5;
        }
        
        #player-playlist {
            margin-top: calc(100vh + 12px);
        }
        #watch-appbar-playlist {
            z-index: 6 !important;
            top: 0 !important;
            transform: none !important;
            transition: none !important;
        }
        #content {
            top: 0 !important;
        }

        #player-unavailable {
            position: fixed;
            top: 0;
            height: 100vh;
            left: 0;
            width: 100vw;
            z-index: 0;
            margin: 0;
        }
        .player-api {
            background: transparent;
        }
    */}, 14, -3);
    
    function onMouseMove(e){ 
        var m = null; 
        if (e.clientY < 5){
            m = document.querySelector('#masthead-positioner');
        } else if (e.clientX < 5){
            m = document.querySelector('#appbar-guide-menu');
        } else if (e.target.tagName == 'DIV' && e.clientY > document.body.clientHeight - 5){
            m = document.querySelector('.html5-video-controls');
        }
        if (m && (m = m.classList)){
            m.add('e-active');
            clearTimeout(m.e_t);
            m.e_t = setTimeout(m.remove.bind(m,'e-active'), 1e3);
        }
    }

    function onResize(){
        var v = document.querySelector('.video-stream.html5-main-video'),
            c = document.querySelector('.html5-video-content');
        if (v && c){
            var h = v.offsetHeight / c.offsetHeight,
                k = Math.min(h, v.offsetWidth / c.offsetWidth);
            c.style.transform = 'translate(0,' + Math.round(c.offsetHeight * Math.max(h - 1, 0) * .5) + 
                    'px) scale(' + k + ',' + k + ')';
        }
    }
    
    document.onmousemove = document.onmouseout = onMouseMove;
    window.onresize = onResize;

    setTimeout(function (){
        document.querySelector('#appbar-guide-button').click();
        var wide = document.querySelector('.ytp-size-button.ytp-button[title="Theater mode"]');
        if (wide) wide.click();
    }, 50);

    var previousLocation = null;
    setInterval(function (){
        if (document.body.scrollTop == 52){
            document.body.scrollTop = 0;
        }

        if (previousLocation != location.href){
            if (location.href.indexOf('/watch?') != -1){
                if (!styleNode.parentNode){
                    document.body.appendChild(styleNode);
                }
            } else if (styleNode.parentNode){
                document.body.removeChild(styleNode);
            }

            onResize();
            previousLocation = location.href;
        }
    }, 50);
}, false);