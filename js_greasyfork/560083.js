// ==UserScript==
// @name         PStream Title Copier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Click the title to copy it to clipboard, works for movies and episodes, enjoy
// @author       You
// @match        https://pstream.mov/*
// @match        https://www.pstream.mov/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560083/PStream%20Title%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/560083/PStream%20Title%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', function(e) {
        // 1. Look for the container div with class "flex gap-3"
        const targetDiv = e.target.closest('div.flex.gap-3');

        if (targetDiv) {
            // 2. verify it contains the specific spans to avoid clicking other random flex divs
            const epNum = targetDiv.querySelector('.text-white.font-medium');
            const epTitle = targetDiv.querySelector('.text-type-secondary.font-medium');

            if (epNum && epTitle) {
                // 3. Construct the text
                const fullText = `${epNum.innerText} ${epTitle.innerText}`;

                // 4. Copy to clipboard
                navigator.clipboard.writeText(fullText).then(() => {
                    // Visual feedback: Flash green
                    const originalColor = targetDiv.style.color;
                    targetDiv.style.transition = "color 0.2s";
                    epNum.style.color = "#4ade80"; // Green
                    epTitle.style.color = "#4ade80"; // Green

                    // Reset color after 500ms
                    setTimeout(() => {
                       epNum.style.color = "";
                       epTitle.style.color = "";
                    }, 500);

                    console.log('Copied to clipboard:', fullText);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            }
        }
    });
})();
// --- MOVIE TITLE HANDLER ---
// Targets the <p> tag that usually tries to "Copy Link"
document.addEventListener('click', function(e) {
    const movieTitle = e.target.closest('p.cursor-copy.hover\\:scale-105');

    if (movieTitle) {
        // Stop the website's own script from copying the URL
        e.preventDefault();
        e.stopImmediatePropagation();

        const textToCopy = movieTitle.innerText.trim();

        navigator.clipboard.writeText(textToCopy).then(() => {
            // Visual feedback: brief flash
            const originalColor = movieTitle.style.color;
            movieTitle.style.color = "#4ade80"; // Green

            // Change the hover title temporarily
            const originalTooltip = movieTitle.getAttribute('title');
            movieTitle.setAttribute('title', 'Copied Title!');

            setTimeout(() => {
                movieTitle.style.color = originalColor;
                movieTitle.setAttribute('title', originalTooltip);
            }, 800);

            console.log('Intercepted! Copied title instead of link:', textToCopy);
        });
    }
}, true); // The "true" here helps us catch the click before the site does