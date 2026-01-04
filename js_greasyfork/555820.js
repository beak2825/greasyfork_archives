// ==UserScript==
// @name         HumbleBundle Search Action Buttons + Copy for Humble Bundle
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds Copy, Google search, and Steam search buttons next to game/book titles. Google search is optimized for Books (Title BY Author).
// @author       mcbyte
// @license      GPL-2.0
// @match        *://www.humblebundle.com/games/*
// @match        *://www.humblebundle.com/books/*
// @match        *://www.humblebundle.com/software/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555820/HumbleBundle%20Search%20Action%20Buttons%20%2B%20Copy%20for%20Humble%20Bundle.user.js
// @updateURL https://update.greasyfork.org/scripts/555820/HumbleBundle%20Search%20Action%20Buttons%20%2B%20Copy%20for%20Humble%20Bundle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetSelector = 'div.tier-item-details-view h2.heading-medium';
    const processedClass = 'mcbyte-processed-h2';

    const googleSearchBaseUrl = 'https://www.google.com/search?q=';
    const steamSearchBaseUrl = 'https://store.steampowered.com/search/?term=';

    const isGamesBundle = window.location.pathname.includes('/games/');
    const isBooksBundle = window.location.pathname.includes('/books/');

    const selectionFixSelectors = [
        'div.tier-item-details-view h2.heading-medium', // Titles
        'section.description'                         // Main Description Text
    ];

    function fixTextSelection() {
        selectionFixSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.userSelect = 'text';
                element.style.webkitUserSelect = 'text';

                // Prevent drag event from interfering with selection
                element.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                }, true);
            });
        });
    }

  function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
            textArea.remove();
        }
    }

    function getAuthor(h2Element) {
        const detailsView = h2Element.closest('.tier-item-details-view');
        if (!detailsView) return null;

        const authorDivs = detailsView.querySelectorAll('.publishers-and-developers');
        for (const div of authorDivs) {
            if (div.textContent.trim().startsWith('Author:')) {
                const authorSpan = div.querySelector('span');
                if (authorSpan) {
                    return authorSpan.textContent.trim();
                }
            }
        }
        return null;
    }

    function createActionElements() {
        const headings = document.querySelectorAll(targetSelector);

        headings.forEach(h2 => {
            if (h2.classList.contains(processedClass)) {
                return;
            }

            const title = h2.textContent.trim();

            if (title.length > 0) {
                let googleQuery;
                if (isBooksBundle) {
                    const author = getAuthor(h2);
                    if (author) {
                        googleQuery = `${title} BY ${author}`;
                    } else {
                        googleQuery = title + ' book';
                    }
                } else {
                    googleQuery = title;
                }

                const encodedGoogleQuery = encodeURIComponent(googleQuery);
                const encodedSteamQuery = encodeURIComponent(title);

                // 1. CREATE WRAPPER for H2 and action elements
                const titleButtonWrapper = document.createElement('div');
                titleButtonWrapper.className = 'mcbyte-title-button-wrapper';
                titleButtonWrapper.style.cssText = `
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                `;

                const parentSection = h2.parentNode;

                parentSection.insertBefore(titleButtonWrapper, h2);
                titleButtonWrapper.appendChild(h2);

                /*h2.style.userSelect = 'text';
                h2.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                }, true);*/

                const elementStyle = `
                    display: inline-block;
                    text-decoration: none;
                    padding: 4px 8px;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 0.8em;
                    font-family: inherit;
                    font-weight: bold;
                    line-height: normal;
                    transition: background-color 0.2s;
                `;

                // --- 1. Copy Button ---
                const copyButton = document.createElement('button');
                copyButton.innerHTML = '<i class="hb hb-clipboard"></i>';
                copyButton.title = 'Copy Name: ' + title;
                copyButton.className = 'copy-name-button';
                copyButton.style.cssText = elementStyle + 'background-color: #6c757d; color: white;';

                copyButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    copyToClipboard(title);

                    const originalHTML = copyButton.innerHTML;
                    copyButton.innerHTML = ' ✅ ';
                    copyButton.style.backgroundColor = '#28a745';
                    setTimeout(() => {
                        copyButton.innerHTML = originalHTML;
                        copyButton.style.backgroundColor = '#6c757d';
                    }, 1000);
                });

                titleButtonWrapper.appendChild(copyButton);

                // --- 2. Google Link ---
                const googleAnchor = document.createElement('a');
                googleAnchor.innerHTML = '<i class="hb hb-search"></i> Google';
                // Use the smart query in the tooltip
                googleAnchor.title = `Google Search for: ${googleQuery}`;
                googleAnchor.className = 'google-search-button';
                googleAnchor.href = googleSearchBaseUrl + encodedGoogleQuery;
                googleAnchor.target = '_blank';
                googleAnchor.style.cssText = elementStyle + 'background-color: #4285F4; color: white;';

                titleButtonWrapper.appendChild(googleAnchor);

                // --- 3. Steam Link (CONDITIONAL) ---
                if (isGamesBundle) {
                    const steamAnchor = document.createElement('a');
                    steamAnchor.innerHTML = '<i class="hb hb-steam"></i> Steam';
                    steamAnchor.title = 'Search Steam';
                    steamAnchor.className = 'steam-search-button';
                    steamAnchor.href = steamSearchBaseUrl + encodedSteamQuery;
                    steamAnchor.target = '_blank';
                    steamAnchor.style.cssText = elementStyle + 'background-color: #1a9fff; color: white;';

                    titleButtonWrapper.appendChild(steamAnchor);
                }

                h2.classList.add(processedClass);
            }
        });

        fixTextSelection();
    }

    // --- Dynamic Content Handling (MutationObserver) ---
    const observer = new MutationObserver(() => {
        createActionElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    createActionElements();
})();