// ==UserScript==
// @name         Infinite Scroll for RetroGameTalk Repository
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds endless scrolling to https://retrogametalk.com/repository by loading the next .games-loop content when near the bottom. Also removes interfering elements like sidebar, footer, and Ko-Fi widget.
// @author       HoodlumOG
// @match        https://retrogametalk.con/repository*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552661/Infinite%20Scroll%20for%20RetroGameTalk%20Repository.user.js
// @updateURL https://update.greasyfork.org/scripts/552661/Infinite%20Scroll%20for%20RetroGameTalk%20Repository.meta.js
// ==/UserScript==

(function() {
    'use strict';
   
    // Remove interfering elements (equivalent to uBlock filters)
    document.querySelector('#custom_html-22 > .textwidget.custom-html-widget')?.remove(); // Ko-Fi/support widget
    document.querySelector('.sidebar.widget-area')?.remove(); // Entire sidebar
    document.querySelector('.site-footer.site-info')?.remove(); // Footer

    let loading = false;
    let nextLink = document.querySelector('a.page-numbers.next');

    if (!nextLink) {
        console.log('No pagination found on initial load.');
        return;
    }

    function loadNextPage() {
        if (loading || !nextLink) return;
        loading = true;
        console.log('Loading next page:', nextLink.href);

        const url = nextLink.href;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Fetch failed: ' + response.status);
                return response.text();
            })
            .then(text => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const newContent = doc.querySelector('.games-loop');
                if (newContent) {
                    // Append children to avoid nesting
                    document.querySelector('.games-loop').append(...newContent.children);
                    console.log('Appended new games from page.');
                } else {
                    console.warn('No .games-loop found in fetched page.');
                }
                const newNext = doc.querySelector('a.page-numbers.next');
                if (newNext) {
                    nextLink.href = newNext.href;
                    console.log('Updated next link to:', newNext.href);
                } else {
                    nextLink.remove();
                    nextLink = null;
                    console.log('No more pages - removed next link.');
                }
                loading = false;
            })
            .catch(error => {
                console.error('Error loading next page:', error);
                loading = false;
            });
    }

    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
            if (nextLink) {
                loadNextPage();
            }
        }
    });

    // Initial check in case already at bottom
    if (window.innerHeight >= document.body.offsetHeight - 800) {
        loadNextPage();
    }
})();