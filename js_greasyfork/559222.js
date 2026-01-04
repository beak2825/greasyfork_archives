// ==UserScript==
// @name         Letterboxd to Ext.to
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add Ext.to links to Letterboxd film pages using IMDb ID
// @author       CypherpunkSamurai
// @match        https://letterboxd.com/film/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=letterboxd.com
// @downloadURL https://update.greasyfork.org/scripts/559222/Letterboxd%20to%20Extto.user.js
// @updateURL https://update.greasyfork.org/scripts/559222/Letterboxd%20to%20Extto.meta.js
// ==/UserScript==

// Credits:
// This script is a rewrite of the "Letterboxd to P-Stream" userscript by archiivv
// and incorporates IMDb ID extraction logic from the "Letterboxd IMDb Code Extractor" by You.

(function() {
    'use strict';

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Wait a bit for dynamic content to load
        setTimeout(addExtToButton, 1000);
    }

    function addExtToButton() {
        // Extract IMDb ID from the page
        const imdbLinkElement = document.querySelector('a[href*="imdb.com/title/tt"]');
        if (!imdbLinkElement) {
            console.log('No IMDb link found');
            return;
        }

        const imdbUrl = imdbLinkElement.href;
        const imdbCodeMatch = imdbUrl.match(/title\/(tt\d+)/);
        if (!imdbCodeMatch || !imdbCodeMatch[1]) {
            console.log('Could not extract IMDb ID');
            return;
        }

        const imdbId = imdbCodeMatch[1].replace('tt', ''); // Remove 'tt' prefix, keep numeric part
        console.log('Found IMDb ID:', imdbId);

        // Create Ext.to URL
        const extToUrl = `https://ext.to/browse/?with_adult=1&imdb_id=${imdbId}`;

        addButtonToPage(extToUrl, 'Browse on Ext.to');
    }

    function addButtonToPage(url, text) {
        // Find the actions panel ul
        const actionsList = document.querySelector('.actions-panel ul, .js-actions-panel ul');

        if (!actionsList) {
            console.log('Could not find actions panel list');
            return;
        }

        // Create li element to match Letterboxd structure
        const listItem = document.createElement('li');
        listItem.className = 'extto-action';

        // Create the link
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.textContent = text;

        // Add the link to the list item
        listItem.appendChild(link);

        // Add to the actions list
        actionsList.appendChild(listItem);

        console.log('Added Ext.to button:', url);
    }

    // Add CSS to match Letterboxd's design (adapted from original)
    const style = document.createElement('style');
    style.textContent = `
        .extto-action {
            color: var(--content-color) !important;
            background-color: #456 !important;
            text-align: center !important;
            border-bottom: 1px solid #2C3440 !important;
            padding: 10px 0 !important;
            box-sizing: border-box !important;
        }

        .extto-action a {
            color: var(--content-color) !important;
            text-decoration: none !important;
            display: block !important;
            width: 100% !important;
            height: 100% !important;
        }

        .extto-action a:hover {
            color: var(--content-color) !important;
        }
    `;
    document.head.appendChild(style);

})();