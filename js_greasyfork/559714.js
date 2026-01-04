// ==UserScript==
// @name         Nearby Items & Chests Sound Alert
// @namespace    https://torn.com/
// @version      1.2
// @description  You need "Christmas town helper" script first. Plays a clear sound notification on Nearby Items or Chests
// @match        https://www.torn.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559714/Nearby%20Items%20%20Chests%20Sound%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/559714/Nearby%20Items%20%20Chests%20Sound%20Alert.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastItems = 0;
    let lastChests = 0;
    let audioCtx;

    function playSound(freq = 880, duration = 0.35) {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = freq;
        gain.gain.value = 0.08;

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    }

    function checkNearby() {
        const labels = document.querySelectorAll('label');

        for (const label of labels) {
            const text = label.textContent;

            let match;

            // Nearby Items
            match = text.match(/Nearby Items\((\d+)\)/);
            if (match) {
                const count = parseInt(match[1], 10);
                if (lastItems === 0 && count > 0) {
                    playSound(880); // higher tone
                    console.log('🔔 Nearby Items detected:', count);
                }
                lastItems = count;
            }

            // Nearby Chests
            match = text.match(/Nearby Chests\((\d+)\)/);
            if (match) {
                const count = parseInt(match[1], 10);
                if (lastChests === 0 && count > 0) {
                    playSound(660); // lower tone
                    console.log('🧰 Nearby Chests detected:', count);
                }
                lastChests = count;
            }
        }
    }

    const observer = new MutationObserver(checkNearby);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    checkNearby();
})();