// ==UserScript==
// @name         Google → Yandex Search Button
// @namespace    https://greasyfork.org/en/users/1442738-matthewseat449
// @version      1.1
// @description  Adds a button on Google search results page to rerun the search on Yandex.com
// @author       github.com/matthewseat449
// @match        https://www.google.*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552631/Google%20%E2%86%92%20Yandex%20Search%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/552631/Google%20%E2%86%92%20Yandex%20Search%20Button.meta.js
// ==/UserScript==

// the button will appear on the left side 

(function() {
    'use strict';

    function addButton() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (!query) {
            // no search query; no need to add
            return;
        }
        if (document.getElementById('yandex-search-button')) {
            // already added
            return;
        }

        // Create the button
        const btn = document.createElement('button');
        btn.id = 'yandex-search-button';
        btn.textContent = 'Search on Yandex';
        btn.style.marginLeft = '8px';
        btn.style.padding = '5px 10px';
        btn.style.backgroundColor = '#f8f9fa';
        btn.style.border = '1px solid #dadce0';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.style.fontFamily = 'Arial, sans-serif';
        btn.style.color = '#202124';

        btn.onclick = () => {
            const yandexUrl = 'https://yandex.com/search/?text=' + encodeURIComponent(query);
            window.open(yandexUrl, '_blank');
        };

        // Possible insertion points in the Google results page
        // 1. In the “tools / settings / etc” bar (hdtb)
        const hdtb = document.getElementById('hdtb');  // top Google menu bar
        if (hdtb) {
            // try to insert near the right side
            hdtb.appendChild(btn);
            return;
        }

        // 2. In the search form area (just after input)
        const searchForm = document.querySelector('form[role="search"]');
        if (searchForm) {
            searchForm.appendChild(btn);
            return;
        }

        // 3. As fallback, at top of body
        document.body.insertBefore(btn, document.body.firstChild);
    }

    // Try adding after initial load
    window.addEventListener('load', addButton);

    // Also try after DOM changes (since Google sometimes lazy-loads or dynamically updates)
    const observer = new MutationObserver((mutations) => {
        addButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();