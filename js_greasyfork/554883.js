// ==UserScript==
// @name         Flingster Auto Skip
// @namespace    Flingster Auto Skip
// @description  Automatically skips males, couples, ads, removes the loading blur, and beeps when a female appears.
// @version      1.4
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flingster.com
// @match        *://*.flingster.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554883/Flingster%20Auto%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/554883/Flingster%20Auto%20Skip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- BEEP FUNCTION ---
    function playBeep() {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A4 note
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
    }

    // This function handles skipping, blur removal, and the beep sound.
    const performActions = () => {
        // --- Skip Logic ---
        const isMale = document.querySelector('.rlt-gender.gndr_male');
        const isCouple = document.querySelector('.rlt-gender.gndr_couple');
        const isHidden = document.querySelector('.rlt-gender.gndr_hidden');
        const isAd = document.querySelector('.flag.rlt-flag.flag-sponsored, .girls-btn.red-btn.trns');

        if (isMale || isCouple || isHidden || isAd) {
            const nextButton = document.querySelector('.mrb-next.mobile-arrows__btn');
            if (nextButton) {
                nextButton.click();
            }
        }

        // --- Female Detection and Beep Logic ---
        const isFemale = document.querySelector('.rlt-gender.gndr_female');
        if (isFemale) {
            playBeep();
        }

        // --- Blur Removal Logic ---
        const remoteVideo = document.getElementById('remoteVideo');
        if (remoteVideo) {
            remoteVideo.style.transition = 'none';
            remoteVideo.style.filter = 'none';
        }
    };

    // A MutationObserver watches for changes in the webpage's content.
    const observer = new MutationObserver((mutations) => {
        performActions();
    });

    // We tell the observer to watch the entire body of the page for any changes.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // We also run the actions once right after the script loads.
    performActions();
})();