// ==UserScript==
// @name         Crunchyroll Skip Intro (Keyboard)
// @namespace   Mohd Zaid
// @namespace    https://crunchyroll.com
// @version      2.0
// @description  Press "S" to skip intros on Crunchyroll
// @author      Mohd Zaid
// @match        *://static.crunchyroll.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548962/Crunchyroll%20Skip%20Intro%20%28Keyboard%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548962/Crunchyroll%20Skip%20Intro%20%28Keyboard%29.meta.js
// ==/UserScript==


document.body.addEventListener('keydown', (event) => {
    // We only care about the 'S' key. Ignore all other keys.
    if (event.key.toLowerCase() !== 's') {
        return;
    }

    // Stop the event from reaching Crunchyroll's scripts to prevent any double actions.
    event.stopPropagation();
    event.preventDefault();

    const skipButton = document.querySelector(
        '[data-testid="skipButton"] > *'
    );

    if (skipButton) {
        // FIXED: If the button is found, this block now CLICKS it.
        console.log('Skip button clicked.');
        skipButton.click();
    } else {
        // If no button is found, fast-forward the video by 85 seconds.
        const videoPlayer = document.querySelector('#player0');
        if (videoPlayer) {
            console.log('No skip button found. Skipping forward 85 seconds.');
            videoPlayer.currentTime += 85;
        }
    }
}, true);