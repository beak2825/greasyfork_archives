// ==UserScript==
// @name         YouTube Music Volume Control
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  유튜브 뮤직에서만 볼륨을 조절합니다
// @author       YourName
// @match        https://music.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556682/YouTube%20Music%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/556682/YouTube%20Music%20Volume%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetVolume = 0.3; // 볼륨 30%

    function setVolume() {
        const audio = document.querySelector('video');
        if (audio && audio.volume !== targetVolume) {
            audio.volume = targetVolume;
            console.log(`Volume set to ${targetVolume * 100}%`);
        }
    }

    setInterval(setVolume, 1000);
})();
