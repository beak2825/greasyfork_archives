// ==UserScript==
// @name         Criticker-Translated-Titles
// @namespace    https://criticker.com/
// @version      2025-12-14
// @description  Displays the translated film title on Criticker film pages in the preferred browser language.
// @author       Alsweider
// @match        https://www.criticker.com/film/*
// @match        https://www.criticker.com/tv/*
// @icon         https://www.criticker.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      query.wikidata.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558838/Criticker-Translated-Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/558838/Criticker-Translated-Titles.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const imdbLink = document.querySelector('.tip_sidebar_action a[href*="imdb.com/title/"]');
    if (!imdbLink) return;

    const imdbID = imdbLink.href.match(/tt\d+/)?.[0];
    if (!imdbID) return;

    const lang = (navigator.language || 'en').split('-')[0];

    const sparql = `
        SELECT ?label WHERE {
          ?film wdt:P345 "${imdbID}" .
          ?film rdfs:label ?label .
          FILTER (lang(?label) = "${lang}")
        }
        LIMIT 1
    `;

    const url =
        'https://query.wikidata.org/sparql?format=json&query=' +
        encodeURIComponent(sparql);

    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: { 'Accept': 'application/sparql+json' },
        onload: function (response) {
            let data;
            try {
                data = JSON.parse(response.responseText);
            } catch {
                return;
            }

            const result = data.results.bindings[0];
            if (!result) return;

            const localizedTitle = result.label.value;

            const mainTitle = document.querySelector('.tip_title_maininfo h1');
            if (!mainTitle) return;
            if (document.getElementById('wikidata-local-title')) return;

            const span = document.createElement('span');
            span.id = 'wikidata-local-title';
            span.style.display = 'block';
            span.style.fontSize = '0.8em';
            span.style.color = '#555';
            span.textContent = localizedTitle;

            mainTitle.after(span);
        }
    });
})();
