// ==UserScript==
// @name         Audible to MAM Search
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add buttons to search MAM for Audible books
// @author       TG
// @match        https://www.audible.com/*
// @match        https://www.audible.es/*
// @match        https://www.audible.co.uk/*
// @match        https://www.audible.fr/*
// @match        https://www.audible.de/*
// @match        https://www.audible.it/*
// @match        https://www.audible.ca/*
// @match        https://www.audible.com.au/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554483/Audible%20to%20MAM%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/554483/Audible%20to%20MAM%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractBookInfo(bookElement) {
        try {
            const titleElement = bookElement.querySelector('h3.bc-heading a, h2.bc-heading');
            if (!titleElement) return null;

            let title = titleElement.textContent.trim();
            const fontElements = titleElement.querySelectorAll('font');
            if (fontElements.length > 0) {
                title = fontElements[fontElements.length - 1].textContent.trim();
            }

            const colonIndex = title.indexOf(':');
            if (colonIndex > 0) {
                title = title.substring(0, colonIndex).trim();
            }

            const authorElement = bookElement.querySelector('.authorLabel a');
            if (!authorElement) return null;

            let authorText = authorElement.textContent.trim();
            const authorFontElements = authorElement.querySelectorAll('font');
            if (authorFontElements.length > 0) {
                authorText = authorFontElements[authorFontElements.length - 1].textContent.trim();
            }

            const nameParts = authorText.split(' ');
            const lastName = nameParts[nameParts.length - 1].toLowerCase();

            return {
                title: title.toLowerCase(),
                authorLastName: lastName
            };
        } catch (error) {
            console.error('Error extracting book info:', error);
            return null;
        }
    }

    function createSearchURL(title, authorLastName) {
        const query = encodeURIComponent(`${title} ${authorLastName}`);
        return `https://www.myanonamouse.net/tor/browse.php?tor%5Btext%5D=${query}&tor%5BsrchIn%5D%5Btitle%5D=true&tor%5BsrchIn%5D%5Bauthor%5D=true&tor%5BsrchIn%5D%5Bseries%5D=true&tor%5BsearchType%5D=all&tor%5BsearchIn%5D=torrents&tor%5Bcat%5D%5B%5D=0&tor%5BbrowseFlagsHideVsShow%5D=0&tor%5Bunit%5D=1&tor%5BsortType%5D=dateDesc&tor%5BstartNumber%5D=0&thumbnail=true`;
    }

    function createMAMButton(bookInfo) {
        const button = document.createElement('button');
        button.innerHTML = '🔍 MAM';
        button.title = `Search MyAnonaMouse for "${bookInfo.title} ${bookInfo.authorLastName}"`;
        button.style.cssText = `
            background: #ff6600;
            color: white;
            border: none;
            padding: 4px 8px;
            margin: 2px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            vertical-align: middle;
        `;

        button.addEventListener('mouseover', function() {
            this.style.background = '#e55a00';
        });

        button.addEventListener('mouseout', function() {
            this.style.background = '#ff6600';
        });

        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const searchURL = createSearchURL(bookInfo.title, bookInfo.authorLastName);
            window.open(searchURL, '_blank');
        });

        return button;
    }

    function addButtonsToBooks() {
        const bookItems = document.querySelectorAll('.productListItem');

        bookItems.forEach(bookItem => {
            // skip if button already added
            if (bookItem.querySelector('.mam-search-button')) {
                return;
            }

            const bookInfo = extractBookInfo(bookItem);
            if (!bookInfo) {
                return;
            }

            let insertLocation = bookItem.querySelector('.authorLabel');
            if (!insertLocation) {
                insertLocation = bookItem.querySelector('h3.bc-heading');
            }
            if (!insertLocation) {
                insertLocation = bookItem.querySelector('.bc-list-item');
            }

            if (insertLocation) {
                const button = createMAMButton(bookInfo);
                button.classList.add('mam-search-button');
                insertLocation.parentNode.insertBefore(button, insertLocation.nextSibling);
            }
        });
    }

    // Function to observe DOM changes
    function observeChanges() {
        const observer = new MutationObserver(function(mutations) {
            let shouldAddButtons = false;
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    shouldAddButtons = true;
                }
            });

            if (shouldAddButtons) {
                setTimeout(addButtonsToBooks, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function init() {
        addButtonsToBooks();
        observeChanges();
        // Also run periodically as a fallback
        // for up to 10 seconds after page load
        setInterval(addButtonsToBooks, 3000);
        setTimeout(() => clearInterval(addButtonsToBooks), 10000);
    }

    // Wait for the page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();