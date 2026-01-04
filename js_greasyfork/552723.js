// ==UserScript==
// @name         Button to assist bookmarking FF.net works on AO3
// @license   MIT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a button to submit FanFiction.net works to AO3 external works page
// @author       The17thColossus
// @match        https://www.fanfiction.net/s/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/552723/Button%20to%20assist%20bookmarking%20FFnet%20works%20on%20AO3.user.js
// @updateURL https://update.greasyfork.org/scripts/552723/Button%20to%20assist%20bookmarking%20FFnet%20works%20on%20AO3.meta.js
// ==/UserScript==

//this is an updated test line
(function() {
    'use strict';

    // Extracting story details
    let storyURL = window.location.href;
    let titleElement = document.querySelector(".storytextp a");
    let rawTitle = titleElement ? titleElement.innerText.trim() : document.title;
    let title = rawTitle.split("Chapter")[0].trim(); // Remove 'Chapter' and anything after it

    let authorElement = document.querySelector("a[href*='/u/']");
    let author = authorElement ? authorElement.innerText.trim() : 'Unknown';

    // Get fandom (second link in div#pre_story_links)
    let fandomElements = document.querySelectorAll("div#pre_story_links a");
    let fandom = (fandomElements.length > 1) ? fandomElements[1].innerText.trim() : 'Unknown';

    let ratingElement = document.querySelector("div#profile_top a.xcontrast_txt[href='https://www.fictionratings.com/']");
    let rating = ratingElement ? ratingElement.innerText.trim() : 'Unknown';

    // Create the button
    let button = document.createElement('button');
    button.innerText = `Submit to Ao3\nTitle: ${title}\nAuthor: ${author}\nFandom: ${fandom}\nRating: ${rating}`;
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.padding = '10px';
    button.style.backgroundColor = '#ff4500';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';

    document.body.appendChild(button);

    //url_from_external=https%3A%2F%2FstoryURL=${encodeIROComponent(storyURL)}&title_from_external=

    button.addEventListener('click', function() {

        // AO3 rating mapping
        let ratingMap = {
            'Fiction K': 'General Audiences',
            'Fiction K+': 'General Audiences',
            'Fiction T': 'Teen And Up Audiences',
            'Fiction M': 'Mature'
        };

        let mappedRating = ratingMap[rating] || '';

        // Open AO3 submission page with variables appended to URL
        let ao3Window = window.open(`https://archiveofourown.org/external_works/new?url_from_external=${encodeURIComponent(storyURL)}`, "AO3Window", "width=" + window.screen.width / 2.5 + ",height=" + window.screen.height + ",left=" + window.screen.width / 2 + ",top=0");
        let infoWindow = window.open("Window", "InfoWindow", "width=" + window.screen.width / (2.5) + ",height=" + window.screen.height + ",left=0,top=0");

        // Wait for the info window to load and display information
        setTimeout(() => {
            if (infoWindow) {
                infoWindow.document.body.innerHTML = `<strong>Story Information:</strong><br>
                                                     <strong>Author:</strong> ${author}<br>
                                                     <strong>Fandom:</strong> ${fandom}<br>
                                                     <strong>Rating:</strong> ${rating}<br>`;
            } else {
                alert('Failed to open info window.');
            }
        }, 3000);
    });
})();