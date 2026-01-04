// ==UserScript==
// @name         Programming Hero - Video Page Enhancements
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Programming Hero video page enhancements.
// @author       Shamim
// @match        https://web.programming-hero.com/*/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=programming-hero.com
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/555490/Programming%20Hero%20-%20Video%20Page%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/555490/Programming%20Hero%20-%20Video%20Page%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Custom CSS (Bigger view)
    const customCSS = `
        html, .course-content-list {
            scrollbar-width: thin;
            scrollbar-color: #2B1B42 transparent;
        }

        #plyr-logo {
            left: 99999px !important;
        }

        .course-layout .container {
            max-width: 1800px;
        }

        .course-layout .container .row .col-lg-8{
            flex: 0 0 75%;
            max-width: 75%;
        }

        .course-layout .container .row .col-lg-4{
            flex: 0 0 25%;
            max-width: 25%;
        }

        .course-layout .container .row .col-lg-4 .course-content-list{
            max-height: 630px !important;
        }
    `;
    const styleElement = document.createElement('style');
    styleElement.setAttribute("id", "custom-css");
    styleElement.innerHTML = customCSS;
    window.addEventListener("load", (event) => {
        document.head.appendChild(styleElement);
        console.log("Style Injected");
    });



    // Prev/Next Shortcut
    const prevButton = document.getElementsByClassName("btn previous-button mr-2");
    const nextButton = document.getElementsByClassName("btn next-button text-white");
    window.addEventListener("keydown", (e) => {
        // Previous Shortcut
        if((e.shiftKey && e.keyCode === 80)){
            console.log("Previous Shortcut Clicked");
            prevButton[0].click();
        }
        
        // Next Shortcut
        if((e.shiftKey && e.keyCode === 78)){
            console.log("Next Shortcut Clicked");
            nextButton[0].click();
        }
    });



    // Auto Speed Set
    let flag = 0;
    setInterval(() => {
        // ---------- Shaka Player ----------
        let playbackRate = document.getElementsByClassName("shaka-playbackrate-button");
        let shakaSpeed = document.getElementsByClassName("shaka-playback-rates");
        let shakaMenu = document.getElementsByClassName("shaka-settings-menu");
        let controlsVisibility = document.getElementsByClassName("shaka-controls-container");

        if(playbackRate.length!=0){playbackRate[0].onmouseover = () => {flag = 1;}}
        if(shakaMenu.length!=0){shakaMenu[0].onmouseover = () => {flag = 1;}}
        if(shakaMenu.length!=0){shakaMenu[1].onmouseover = () => {flag = 1;}}
        if(controlsVisibility.length!=0 && controlsVisibility[0].getAttribute("shown")=='true'){flag = 1;}

        if(playbackRate.length!=0){playbackRate[0].onmouseout = () => {flag = 0;}}
        if(shakaMenu.length!=0){shakaMenu[0].onmouseout = () => {flag = 0;}}
        if(shakaMenu.length!=0){shakaMenu[1].onmouseout = () => {flag = 0;}}
        if(controlsVisibility.length!=0 && controlsVisibility[0].getAttribute("shown")!='true'){flag = 0;}

        if(shakaSpeed.length!=0 && shakaSpeed[0].children.length != 0){
            shakaSpeed[0].children[1].onclick = () => {localStorage.setItem("autoVidSpeedParam", 1);}
            shakaSpeed[0].children[2].onclick = () => {localStorage.setItem("autoVidSpeedParam", 2);}
            shakaSpeed[0].children[3].onclick = () => {localStorage.setItem("autoVidSpeedParam", 3);}
            shakaSpeed[0].children[4].onclick = () => {localStorage.setItem("autoVidSpeedParam", 4);}
            shakaSpeed[0].children[5].onclick = () => {localStorage.setItem("autoVidSpeedParam", 5);}
            shakaSpeed[0].children[6].onclick = () => {localStorage.setItem("autoVidSpeedParam", 6);}
            shakaSpeed[0].children[7].onclick = () => {localStorage.setItem("autoVidSpeedParam", 7);}
            shakaSpeed[0].children[8].onclick = () => {localStorage.setItem("autoVidSpeedParam", 8);}
            shakaSpeed[0].children[9].onclick = () => {localStorage.setItem("autoVidSpeedParam", 9);}
        }

        if(shakaSpeed.length!=0 && flag === 0){
            let prevSpeed = localStorage.getItem("autoVidSpeedParam");
            if(shakaSpeed[0].children.length!=0){shakaSpeed[0].children[prevSpeed].click();}
        }
        // ---------- Shaka Player ----------
    },500);
})();