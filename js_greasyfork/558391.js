// ==UserScript==
// @name         Genius Lyrics Copier
// @namespace    genius-lyrics-copier
// @version      1.1
// @description  Adds a button to copy lyrics from Genius website to clipboard
// @match        https://genius.com/*
// @grant        GM_setClipboard
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/558391/Genius%20Lyrics%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/558391/Genius%20Lyrics%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Skip for regular MusicBee pages
    const isMusicPage = !!document.querySelector("[class^='SongPage__Container-sc']");
    if(!isMusicPage) return;

    // Create the button element
    const button = document.createElement('button');
    button.innerHTML = 'Copy Lyrics';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.padding = '10px';
    button.style.fontSize = '16px';
    button.style.border = 'none';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.cursor = 'pointer';
    button.style.zIndex = '99999';
    button.id = 'lyric-copy-btn';

    // Add the button to the body
    document.body.appendChild(button);

    // Add a click event listener to the button
    button.addEventListener('click', function() {
        const lyricsContainers = document.querySelectorAll("[class^='Lyrics__Container']");
        const header = document.querySelector("[class^='LyricsHeader__Container-sc']");

        if (lyricsContainers?.length > 0 && header) {

            let lyrics = "";

            lyricsContainers.forEach(lyricsContainer => {
                lyrics += lyricsContainer.innerText
                    .replace(header.innerText + "\n", "")
                    .trim();
            });

            GM_setClipboard(lyrics);
            alert("Lyrics copied to the clipboard");
        } else {
            console.log("No matching container found.");
        }
    });
})();