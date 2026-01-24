// ==UserScript==
// @name         Letterboxd to Multi-Search (v5.0)
// @namespace    http://tampermonkey.net/
// @version      4.8.0
// @description  Injects search buttons into Letterboxd. Shows title-based buttons even when IMDb ID is missing.
// @author       Gemini
// @match        *://letterboxd.com/film/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563942/Letterboxd%20to%20Multi-Search%20%28v50%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563942/Letterboxd%20to%20Multi-Search%20%28v50%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injectButtons() {
        if (document.getElementById('kg-btn-wrapper')) return;

        // 1. Collect Data (don't exit if one is missing)
        const imdbLink = document.querySelector('a[href*="imdb.com/title/tt"]');
        const imdbId = imdbLink ? imdbLink.getAttribute('href').match(/tt\d+/)[0] : null;

        const dirElement = document.querySelector('span[itemprop="director"] a span') ||
                           document.querySelector('a[href^="/director/"]');
        const director = dirElement ? dirElement.innerText.trim() : "";

        const titleElement = document.querySelector('.headline-1');
        const filmTitle = titleElement ? titleElement.innerText.trim() : "";

        // 2. Find the injection point
        const target = document.querySelector('.sidebar .actions-panel') ||
                       document.querySelector('.poster-container');

        if (target) {
            const btnWrapper = document.createElement('div');
            btnWrapper.id = 'kg-btn-wrapper';
            btnWrapper.style = "margin-top: 10px; display: flex; flex-direction: column; gap: 5px; width: 100%; clear: both;";

            const btnBaseStyle = "color: #fff; text-align: center; border-radius: 3px; padding: 7px 0; font-size: 11px; font-weight: bold; text-decoration: none; display: block; width: 100%; font-family: 'Graphik-Bold-Web', sans-serif; text-transform: uppercase;";

            let buttonsHtml = "";

            // --- IMDb Dependent Buttons ---
            if (imdbId) {
                buttonsHtml += `
                    <a href="https://karagarga.in/browse.php?search=${imdbId}&search_type=imdb" target="_blank" style="${btnBaseStyle} background: #005a3c;">KG - IMDB</a>
                    <a href="https://movieparadise.org/?s=${imdbId}" target="_blank" style="${btnBaseStyle} background: #3b5998;">MovieParadise</a>
                    <a href="https://ext.to/browse/?with_adult=1&imdb_id=${imdbId}" target="_blank" style="${btnBaseStyle} background: #d35400;">ext.to</a>
                    <a href="https://www.opensubtitles.org/en/search/sublanguageid-all/imdbid-${imdbId}/" target="_blank" style="${btnBaseStyle} background: #f39c12;">OpenSubtitles</a>
                    <a href="https://search.rlsbb.to/?s=${imdbId}" target="_blank" style="${btnBaseStyle} background: #222;">RLSBB</a>
                `;
            }

            // --- Director Dependent Buttons ---
            if (director) {
                buttonsHtml += `
                    <a href="https://karagarga.in/browse.php?search=${encodeURIComponent(director)}&search_type=director" target="_blank" style="${btnBaseStyle} background: #445566;">KG - Director</a>
                `;
            }

            // --- Title Dependent Buttons (Always show if title exists) ---
            if (filmTitle) {
                const encodedTitle = encodeURIComponent(filmTitle);
                buttonsHtml += `
                    <a href="https://karagarga.in/browse.php?search=${encodedTitle}&search_type=title&cat=1" target="_blank" style="${btnBaseStyle} background: #556677;">KG - Title</a>
                `;
            }

            btnWrapper.innerHTML = buttonsHtml;
            target.parentNode.insertBefore(btnWrapper, target.nextSibling);
        }
    }

    const observer = new MutationObserver((mutations) => {
        if (document.querySelector('.sidebar')) {
            injectButtons();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    injectButtons();
})();