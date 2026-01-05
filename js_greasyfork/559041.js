// ==UserScript==
// @name         Its Raining Ducks!
// @namespace    http://tampermonkey.net/
// @version      2025-12-16
// @description  Makes Ducks appear on your Screen
// @author       Wolfylein
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @license      Wolfylein
// @downloadURL https://update.greasyfork.org/scripts/559041/Its%20Raining%20Ducks%21.user.js
// @updateURL https://update.greasyfork.org/scripts/559041/Its%20Raining%20Ducks%21.meta.js
// ==/UserScript==
    GM_addStyle(`.raindrop{
            position: absolute;
            width: 100px;
            height: 100px;
            z-index: 10;
            opacity: 70%;
            background-repeat: no-repeat;
            background-size: contain;
            animation: fall linear infinite;
            transform: rotate(45deg);
            top: -15px;
        }
        @keyframes fall{
            from{
                transform: translateY(0);
            }
            to{
                transform: translateY(110vh);
            }
        }`);

(function() {
    'use strict';
    let interval = 150;
    //Returns a Random in up to the Max Value
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    //plays the Quacks
    function playAudio(){
        var audio = new Audio('https://www.wolfhaven.at/quack.mp3');
        audio.play();
    }
    setInterval(playAudio, interval);
    //Starts creating the Ducks!
    function createRainDrop(){

        const raindrop = document.createElement("div");
        raindrop.classList.add('raindrop');

        raindrop.style.left = Math.random() * window.innerWidth + "px";

        const duration = Math.random() * 3 + 0.5;
        const rotation = getRandomInt(360) + "deg";
        raindrop.style.rotate = rotation;
        raindrop.style.animationDuration = duration + 's';

        raindrop.style.backgroundImage = 'url("https://www.wolfhaven.at/images/duck'+(getRandomInt(6)+1)+'.png")';
        document.body.appendChild(raindrop);

        setTimeout(() => {
            raindrop.remove();
        }, duration * 1000);
    }
    setInterval(createRainDrop, 10);
})();