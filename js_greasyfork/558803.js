// ==UserScript==
// @name         Criticker-OFDb-Titel
// @namespace    https://criticker.com/
// @version      2025-12-14
// @description  Ruft deutsche Filmtitel von ofdb.de ab und zeigt sie auf Criticker als Untertitel an.
// @author       Alsweider
// @match        https://www.criticker.com/film/*
// @match        https://www.criticker.com/tv/*
// @icon         https://www.criticker.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      www.ofdb.de
// @downloadURL https://update.greasyfork.org/scripts/558803/Criticker-OFDb-Titel.user.js
// @updateURL https://update.greasyfork.org/scripts/558803/Criticker-OFDb-Titel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let imdbLink = document.querySelector('.tip_sidebar_action a[href*="imdb.com/title/"]');
    if (!imdbLink) return;

    let imdbID = imdbLink.href.match(/tt\d+/)[0];
    let searchURL = `https://www.ofdb.de/suchergebnis/?${imdbID}`;

    GM_xmlhttpRequest({
        method: "GET",
        url: searchURL,
        onload: function(response) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(response.responseText, "text/html");

            let filmLink = doc.querySelector('#TabelleBody a');
            if (!filmLink) return;

            let filmURL = filmLink.href;

            GM_xmlhttpRequest({
                method: "GET",
                url: filmURL,
                onload: function(resp) {
                    let doc2 = parser.parseFromString(resp.responseText, "text/html");
                    let titleElement = doc2.querySelector('h1[itemprop="name"]');
                    if (!titleElement) return;

                    let germanTitle = titleElement.textContent.trim();

                    // Unter dem Originaltitel einfügen
                    let mainTitleDiv = document.querySelector('.tip_title_maininfo h1');
                    if (mainTitleDiv) {
                        let span = document.createElement('span');
                        span.style.display = 'block';
                        span.style.fontSize = '1.0em';
                        span.style.color = '#555';

                        // Link erstellen
                        let link = document.createElement('a');
                        link.href = filmURL;
                        link.target = "_blank";
                        link.textContent = `OFDb: ${germanTitle}`;
                        link.style.color = '#555';
                        link.style.textDecoration = 'underline';

                        span.appendChild(link);
                        mainTitleDiv.parentNode.insertBefore(span, mainTitleDiv.nextSibling);
                    }
                }
            });
        }
    });
})();
