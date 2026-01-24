// ==UserScript==
// @name         TMDB to Letterboxd Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a Letterboxd button next to the User Score on TMDB movie pages.
// @author       Gemini
// @match        https://www.themoviedb.org/movie/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=letterboxd.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563881/TMDB%20to%20Letterboxd%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/563881/TMDB%20to%20Letterboxd%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addLetterboxdButton() {
        // 1. Extract the TMDB ID from the URL
        const match = window.location.pathname.match(/\/movie\/(\d+)/);
        if (!match) return;
        const tmdbId = match[1];

        // 2. Find the actions list where the User Score and action icons live
        const actionsList = document.querySelector('ul.actions');
        
        // Only proceed if the list exists and we haven't already added the button
        if (!actionsList || document.querySelector('#letterboxd-btn-link')) return;

        // 3. Create the list item element
        const li = document.createElement('li');
        li.id = 'letterboxd-btn-wrapper';
        li.className = 'tooltip'; // TMDB uses this for their tooltip system
        li.style.marginLeft = '20px'; // Space it out from the score label

        // 4. Create the anchor link
        const a = document.createElement('a');
        a.id = 'letterboxd-btn-link';
        a.href = `http://letterboxd.com/tmdb/${tmdbId}`;
        a.target = '_blank';
        a.title = 'View on Letterboxd';
        
        // Styling to match TMDB's circular action buttons
        a.style.display = 'flex';
        a.style.alignItems = 'center';
        a.style.justifyContent = 'center';
        a.style.width = '46px';
        a.style.height = '46px';
        a.style.borderRadius = '50%';
        a.style.backgroundColor = '#032541'; // TMDB dark blue background
        a.style.transition = 'transform 0.1s ease-in-out';

        // Add hover effect
        a.onmouseover = () => a.style.transform = 'scale(1.1)';
        a.onmouseout = () => a.style.transform = 'scale(1.0)';

        // 5. Letterboxd Logo (Three Circles SVG)
        a.innerHTML = `
            <svg viewBox="0 0 100 100" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
                <circle cx="22" cy="50" r="18" fill="#ff8000" />
                <circle cx="50" cy="50" r="18" fill="#00e054" />
                <circle cx="78" cy="50" r="18" fill="#40bcf4" />
            </svg>
        `;

        li.appendChild(a);

        // 6. Insert next to the "User Score" plank
        // On TMDB, the score is usually inside 'li.chart'
        const scoreElement = actionsList.querySelector('li.chart');
        if (scoreElement) {
            scoreElement.after(li);
        } else {
            actionsList.prepend(li);
        }
    }

    // TMDB uses client-side navigation; use an observer to catch page changes
    const observer = new MutationObserver(() => {
        if (!document.querySelector('#letterboxd-btn-link')) {
            addLetterboxdButton();
        }
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    addLetterboxdButton();
})();