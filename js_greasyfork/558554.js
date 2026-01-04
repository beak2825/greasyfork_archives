// ==UserScript==
// @name         Letterboxd to Aither Link
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a button with a logo to find movies on Aither from Letterboxd using the TMDB ID
// @author       Augi
// @match        *://letterboxd.com/film/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/558554/Letterboxd%20to%20Aither%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/558554/Letterboxd%20to%20Aither%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function runWhenReady(readySelector, callback) {
        let numAttempts = 0;
        const tryNow = function() {
            const elem = document.querySelector(readySelector);
            if (elem) {
                callback(elem);
            } else {
                numAttempts++;
                if (numAttempts >= 34) {
                    console.warn(`[Aither Button] Giving up after 34 attempts. Could not find: ${readySelector}`);
                } else {
                    setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
                }
            }
        };
        tryNow();
    }

    function createAitherLinkButton(tmdbId) {
        const listItem = document.createElement('li');
        const aitherButton = document.createElement('a');

        aitherButton.href = `https://aither.cc/torrents/similar/1.${tmdbId}`;
        aitherButton.target = '_blank';
        aitherButton.className = 'button -action -has-icon'; // Use Letterboxd's button styling for icons

        // --- Added styles for vertical alignment ---
        aitherButton.style.display = 'inline-flex';
        aitherButton.style.alignItems = 'center';

        // Custom styling for the button
        const neutralColor = '#445566';
        const hoverColor = '#556677';
        aitherButton.style.backgroundColor = neutralColor;
        aitherButton.style.color = '#9ab';
        aitherButton.style.textShadow = 'none';
        aitherButton.style.backgroundImage = 'none';
        aitherButton.style.boxShadow = 'none';
        aitherButton.style.borderColor = 'transparent';

        // Add hover effects
        aitherButton.addEventListener('mouseover', () => {
            aitherButton.style.backgroundColor = hoverColor;
        });
        aitherButton.addEventListener('mouseout', () => {
            aitherButton.style.backgroundColor = neutralColor;
        });

        // --- Create and style the logo icon ---
        const logo = document.createElement('img');
        logo.src = 'https://aither.cc/favicon/favicon.svg';
        logo.alt = 'Aither Logo';
        logo.style.marginRight = '0.5em';
        logo.style.width = '16px';
        logo.style.height = '16px';

        // --- Create the text element ---
        const buttonText = document.createElement('span');
        buttonText.textContent = 'View on Aither';

        // Append logo and text to the button
        aitherButton.appendChild(logo);
        aitherButton.appendChild(buttonText);

        listItem.appendChild(aitherButton);
        return listItem;
    }

    const tmdbLinkElement = document.querySelector('a[href*="themoviedb.org/movie"]');
    let tmdbId = null;

    if (tmdbLinkElement) {
        const match = tmdbLinkElement.href.match(/\/movie\/(\d+)/);
        if (match && match[1]) {
            tmdbId = match[1];
        }
    }

    const selector = ".js-actions-panel";

    function appendButton() {
        const targetContainer = document.querySelector(selector);
        if (targetContainer && tmdbId) {
            const aitherButton = createAitherLinkButton(tmdbId);
            targetContainer.appendChild(aitherButton);
        } else if (!tmdbId) {
            console.warn('[Aither Button] Could not find TMDB ID on the page.');
        }
    }

    runWhenReady(selector, appendButton);
})();