// ==UserScript==
// @name         Kotu.io Audio Replay
// @namespace    kotu-replay
// @author       Takemi
// @version      1.0
// @description  Press "r" to replay audio on kotu.io tests
// @match        https://kotu.io/tests/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548317/Kotuio%20Audio%20Replay.user.js
// @updateURL https://update.greasyfork.org/scripts/548317/Kotuio%20Audio%20Replay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("keydown", e => {
        if (e.code === "KeyR" && !e.repeat) {
            const audio = document.querySelector("audio");
            if (audio) {
                audio.currentTime = 0;
                audio.play();
            }
        }
    });
})();
