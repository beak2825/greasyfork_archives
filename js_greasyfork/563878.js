// ==UserScript==
// @name         Letterboxd Average Rating (2026 Fix)
// @namespace    https://github.com/rcalderong/userscripts
// @description  Displays the numerical average rating (e.g., 3.8) next to the rating histogram.
// @version      2.0
// @match        *://letterboxd.com/film/*
// @exclude      *://letterboxd.com/film/*/views/*
// @exclude      *://letterboxd.com/film/*/lists/*
// @exclude      *://letterboxd.com/film/*/likes/*
// @exclude      *://letterboxd.com/film/*/fans/*
// @exclude      *://letterboxd.com/film/*/ratings/*
// @exclude      *://letterboxd.com/film/*/reviews/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563878/Letterboxd%20Average%20Rating%20%282026%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563878/Letterboxd%20Average%20Rating%20%282026%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        // 1. Find the histogram section
        const sectionElt = document.querySelector(".ratings-histogram-chart");
        if (!sectionElt || document.getElementById('lb-avg-rating')) return;

        // 2. Get the rating data from Letterboxd's JSON metadata
        // Letterboxd stores this in a <script type="application/ld+json"> tag
        let averageRating = 0;
        try {
            const jsonLd = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
            // Search for the rating value in the JSON object
            const graph = jsonLd['@graph'] || [jsonLd];
            const movieData = graph.find(item => item['@type'] === 'Movie');
            averageRating = movieData.aggregateRating.ratingValue;
        } catch (e) {
            // Fallback: Try to find it in the meta tags if JSON fails
            const metaRating = document.querySelector('meta[name="twitter:data2"]');
            if (metaRating) {
                averageRating = parseFloat(metaRating.getAttribute('content').split(' ')[0]);
            }
        }

        if (!averageRating) return;

        // 3. Create the display element
        const displayRating = parseFloat(averageRating).toFixed(2);
        const ratingLink = sectionElt.querySelector("a") ? sectionElt.querySelector("a").href : window.location.href + "ratings/";

        const ratingWrapper = document.createElement("div");
        ratingWrapper.id = "lb-avg-rating";
        ratingWrapper.style = `
            text-align: center;
            margin-top: 5px;
            font-weight: bold;
            font-size: 15px;
            color: #9ab;
        `;

        ratingWrapper.innerHTML = `
            <a href="${ratingLink}" style="text-decoration: none; color: inherit;" title="Average of ${displayRating} / 5">
                <span style="color: #00e054;">★</span> ${displayRating}
            </a>
        `;

        // 4. Insert it at the bottom of the histogram section
        sectionElt.appendChild(ratingWrapper);
    }

    // Run on load
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();