// ==UserScript==
// @name         jumpscare
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  explosion gif that jumpscares you randomly
// @author       leongfn
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555550/jumpscare.user.js
// @updateURL https://update.greasyfork.org/scripts/555550/jumpscare.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function jumpscare() {

        // Remove any previous overlay that might still exist
        const old = document.getElementById("tm-jumpscare-overlay");
        if (old) old.remove();

        const overlay = document.createElement("div");
        overlay.id = "tm-jumpscare-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.background = "black";
        overlay.style.zIndex = 999999999;
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";

        const img = document.createElement("img");
        img.src = "https://tenor.com/view/%D0%B2%D0%B7%D1%80%D1%8B%D0%B2-gif-7558130608446330958.gif";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";

        overlay.appendChild(img);
        document.body.appendChild(overlay);

        const audio = new Audio("https://www.myinstants.com/media/sounds/explosion.mp3");
        audio.volume = 1.0;

        img.onload = () => {
            audio.play();
            // Remove overlay after GIF finishes (~3 seconds)
            setTimeout(() => overlay.remove(), 3000);
        };

        randomTimer();
    }

    function randomTimer() {
        const time = Math.floor(Math.random() * (30000 - 1000)) + 1000;
        setTimeout(jumpscare, time);
    }

    randomTimer();
})();
