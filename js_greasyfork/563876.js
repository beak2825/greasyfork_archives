// ==UserScript==
// @name         Letterboxd to Multi-Search
// @namespace    http://tampermonkey.net/
// @version      4.6.2
// @description  Injects KG, MovieParadise, ext.to, OpenSubtitles and RLSBB buttons into Letterboxd sidebar.
// @author       Gemini
// @match        *://letterboxd.com/film/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563876/Letterboxd%20to%20Multi-Search.user.js
// @updateURL https://update.greasyfork.org/scripts/563876/Letterboxd%20to%20Multi-Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injectButtons() {
        if (document.getElementById('kg-btn-wrapper')) return;

        // 1. Find the IMDb ID
        const imdbLink = document.querySelector('a[href*="imdb.com/title/tt"]');
        if (!imdbLink) return;
        const imdbId = imdbLink.getAttribute('href').match(/tt\d+/)[0];

        // 2. Find Director
        const dirElement = document.querySelector('span[itemprop="director"] a span') ||
                           document.querySelector('a[href^="/director/"]');
        const director = dirElement ? dirElement.innerText.trim() : "";

        // 3. Find the injection point
        const target = document.querySelector('.sidebar .actions-panel') ||
                       document.querySelector('.poster-container');

        if (target) {
            const btnWrapper = document.createElement('div');
            btnWrapper.id = 'kg-btn-wrapper';
            btnWrapper.style = "margin-top: 10px; display: flex; flex-direction: column; gap: 5px; width: 100%; clear: both;";

            // URL Definitions
            const urls = {
                kgImdb: `https://karagarga.in/browse.php?search=${imdbId}&search_type=imdb`,
                kgDir: `https://karagarga.in/browse.php?search=${encodeURIComponent(director)}&search_type=director`,
                movieParadise: `https://movieparadise.org/?s=${imdbId}`,
                extTo: `https://ext.to/browse/?with_adult=1&imdb_id=${imdbId}`,
                openSubs: `https://www.opensubtitles.org/en/search/sublanguageid-all/imdbid-${imdbId}/`,
                rlsbb: `https://search.rlsbb.to/?s=${imdbId}`,
            };

            // Common Button Style
            const btnBaseStyle = "color: #fff; text-align: center; border-radius: 3px; padding: 7px 0; font-size: 11px; font-weight: bold; text-decoration: none; display: block; width: 100%; font-family: 'Graphik-Bold-Web', sans-serif; text-transform: uppercase;";

            btnWrapper.innerHTML = `
                <a href="${urls.kgImdb}" target="_blank" style="${btnBaseStyle} background: #005a3c;">KG - IMDB</a>
                <a href="${urls.kgDir}" target="_blank" style="${btnBaseStyle} background: #445566;">KG - Director</a>
                <a href="${urls.movieParadise}" target="_blank" style="${btnBaseStyle} background: #3b5998;">MovieParadise</a>
                <a href="${urls.extTo}" target="_blank" style="${btnBaseStyle} background: #d35400;">ext.to</a>
                <a href="${urls.openSubs}" target="_blank" style="${btnBaseStyle} background: #f39c12;">OpenSubtitles</a>
                <a href="${urls.rlsbb}" target="_blank" style="${btnBaseStyle} background: #222;">RLSBB</a>
            `;

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