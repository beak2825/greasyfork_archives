// ==UserScript==
// @name         Bing to Google Tab
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a Google button to Bing search header
// @author       Your Name
// @match        https://www.bing.com/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559722/Bing%20to%20Google%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/559722/Bing%20to%20Google%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Get the current search query from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    if (query) {
        // 2. Find the Bing navigation menu (where "Images", "Videos", etc. are)
        const navBar = document.querySelector('#b_header .b_scopebar ul') || document.querySelector('.b_scopebar ul');

        if (navBar) {
            // 3. Create the new list item and link
            const googleLi = document.createElement('li');
            const googleLink = document.createElement('a');

            googleLink.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            googleLink.target = "_blank"; // Opens in a new tab
            googleLink.innerText = "Google";
            googleLink.style.color = "#4285F4"; // Google Blue
            googleLink.style.fontWeight = "bold";

            googleLi.appendChild(googleLink);
            navBar.appendChild(googleLi);
        }
    }
})();