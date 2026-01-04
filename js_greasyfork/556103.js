// ==UserScript==
// @name         VGMdb Metadata Format
// @namespace    https://vgmdb.net/
// @version      2.1
// @description  Copy album metadata as a formatted string to clipboard
// @author       kahpaibe
// @match        https://vgmdb.net/album/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556103/VGMdb%20Metadata%20Format.user.js
// @updateURL https://update.greasyfork.org/scripts/556103/VGMdb%20Metadata%20Format.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const COPY_BUTTON_TEXT = 'Copy All Metadata';
    const COPIED_TEXT = '✔ COPIED!';

// ------------------------------------------------------------------
// --- Button Styling and Helper Functions (Unchanged) ---
// ------------------------------------------------------------------

    const styleButton = (button) => {
        button.style.cursor = 'pointer';
        button.style.marginLeft = '8px';
        button.style.padding = '1px 6px';
        button.style.fontSize = '0.75em';
        button.style.color = '#FFD700';
        button.style.background = 'transparent';
        button.style.border = '1px solid #FFD700';
        button.style.transition = 'background 0.3s, color 0.3s';
        button.style.verticalAlign = 'middle';
    };

    const copyToClipboard = (text, button) => {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.innerText;
            button.innerText = COPIED_TEXT;
            setTimeout(() => button.innerText = originalText, 1500);
        }).catch(err => {
            console.error('Could not copy text: ', err);
            alert('Failed to copy metadata.');
        });
    };

// ------------------------------------------------------------------
// --- Metadata Retrieval Functions (UPDATED: getFieldText) ---
// ------------------------------------------------------------------

    /**
     * Extracts a single text field (e.g., Catalog Number, Publisher) from the info table.
     */
    const getFieldText = (labelText) => {
        const rows = document.querySelectorAll('#album_infobit_large tr');
        const row = Array.from(rows).find(r => {
            const labelCell = r.querySelector('td span.label b');
            return labelCell && labelCell.textContent.trim() === labelText;
        });

        if (row && row.cells.length > 1) {
            const valueCell = row.cells[1];

            // For Publisher, we often want the linked text, if it exists
            if (labelText === 'Publisher') {
                const link = valueCell.querySelector('a.productname');
                if (link) {
                    return link.textContent.trim();
                }
            }
            // For Catalog Number and fallback, use the entire cell text
            return valueCell.textContent.trim();
        }
        return 'N/A';
    };

    const getAlbumTitle = () => {
        let mainTitleSpan = null;
        const innermain = document.querySelector('#innermain');
        if (!innermain) return 'N/A';

        // 1. Try to find a visible Japanese title span first
        const jaTitles = innermain.querySelectorAll('.albumtitle[lang="ja"]');
        mainTitleSpan = Array.from(jaTitles).find(span => {
            const computedStyle = window.getComputedStyle(span);
            return computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';
        });

        // 2. If no visible Japanese title, fall back to the first general .albumtitle
        if (!mainTitleSpan) {
             mainTitleSpan = innermain.querySelector('.albumtitle');
        }

        if (mainTitleSpan) {
            // To get text content while ignoring buttons, clone the element and remove them.
            const temp = mainTitleSpan.cloneNode(true);
            temp.querySelectorAll('button').forEach(btn => btn.remove());
            const titleText = temp.textContent;
            return titleText.trim().replace(/(\s\/\s){2,}/g, ' / ').replace(/ {2,}/g, ' ');
        }
        return 'N/A';
    };

    const getFormattedTracklist = () => {
        const tracklistContainer = document.querySelector('#tracklist');
        if (!tracklistContainer) return 'Tracklist data not found.';

        const spans = tracklistContainer.querySelectorAll('span');
        let result = '';

        spans.forEach(span => {
            if (!/Disc \d+/.test(span.textContent)) return;

            let sibling = span.nextElementSibling;
            while (sibling && sibling.tagName !== 'TABLE') {
                sibling = sibling.nextElementSibling;
            }
            if (!sibling) return;

            const trackTable = sibling;
            const trackRows = trackTable.querySelectorAll('tr.rolebit');
            if (trackRows.length === 0) return;

            const discTitleMatch = span.textContent.match(/Disc \d+/);
            const discTitle = discTitleMatch ? discTitleMatch[0] : 'Unknown Disc';

            result += `\n**${discTitle}**:\n`;

            trackRows.forEach(row => {
                const number = row.querySelector('td .label')?.textContent.trim();
                const title = row.querySelectorAll('td')[1]?.textContent.trim();
                const duration = row.querySelectorAll('td')[2]?.textContent.trim();

                if (number && title && duration) {
                    result += `${number}. ${title} [${duration}]\n`;
                } else if (number && title) {
                    result += `${number}. ${title}\n`;
                }
            });
        });

        // Fallback for single-disc albums without a "Disc 1" header
        if (!result) {
            const directTable = tracklistContainer.querySelector('table');
            if (directTable) {
                result += `\n**Disc 1**:\n`;
                directTable.querySelectorAll('tr.rolebit').forEach(row => {
                    const number = row.querySelector('td .label')?.textContent.trim();
                    const title = row.querySelectorAll('td')[1]?.textContent.trim();
                    const duration = row.querySelectorAll('td')[2]?.textContent.trim();

                    if (number && title && duration) {
                        result += `${number}. ${title} [${duration}]\n`;
                    } else if (number && title) {
                        result += `${number}. ${title}\n`;
                    }
                });
            }
        }

        return result.trim() || 'Tracklist data not found.';
    };

// ------------------------------------------------------------------
// --- Final Metadata Generation and Execution (UPDATED) ---
// ------------------------------------------------------------------

    const generateMetadataText = () => {
        const url = window.location.href;
        const title = getAlbumTitle();
        const catalogNumber = getFieldText('Catalog Number');
        const artist = getFieldText('Publisher'); // Get Publisher to use as Artist
        const tracklist = getFormattedTracklist();

        let output = `Title: ${title}\n`;
        output += `Artist: ${artist}\n`; // NEW: Artist line
        output += `Catalog: ${catalogNumber}\n`;
        output += `Info: ${url}\n`;
        output += '\nTracklist:\n';
        output += tracklist;

        return output;
    };

    const initializeUnifiedButton = () => {
        const albumToolsSpan = document.getElementById('albumtools');
        const outerContainer = albumToolsSpan ? albumToolsSpan.parentElement : null;
        if (!outerContainer) return;

        const newButton = document.createElement('span');
        newButton.style.cursor = 'pointer';
        newButton.innerText = COPY_BUTTON_TEXT;
        styleButton(newButton);

        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const metadataText = generateMetadataText();
            copyToClipboard(metadataText, newButton);
        });

        // 1. Create a pipe separator for the button's right side
        const rightPipe = document.createElement('span');
        rightPipe.style.color = 'rgb(206, 255, 255)';
        rightPipe.innerText = ' | ';
        rightPipe.style.marginLeft = '8px';

        // 2. Insert the button and its pipe immediately before the existing albumtools span
        outerContainer.insertBefore(rightPipe, albumToolsSpan);
        outerContainer.insertBefore(newButton, rightPipe);
    };

    // Defer initialization slightly to ensure all page content has rendered.
    setTimeout(initializeUnifiedButton, 500);

})();