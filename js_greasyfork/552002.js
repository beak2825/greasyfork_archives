// ==UserScript==
// @name         Library Catalog URL Content Extractor
// @namespace    https://www.librarycat.org/lib/
// @version      1.0
// @description  Extracts and displays specific content from linked pages in the library catalog search results
// @author       Brandon Philips
// @match        https://www.librarycat.org/lib/*/search/text/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552002/Library%20Catalog%20URL%20Content%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/552002/Library%20Catalog%20URL%20Content%20Extractor.meta.js
// ==/UserScript==
 
(async function() {
    'use strict';
 
    // Define a mapping of colors to hex values
    const colorMap = {
        green: '#008000',
        red: '#FF0000',
        yellow: '#FFFF00',
        'hot pink': '#FF69B4',
        'light blue': '#ADD8E6',
        purple: '#800080',
        'light pink': '#FFB6C1',
        gray: '#808080',
        'dark blue': '#00008B',
        orange: '#FFA500',
        'yellow dot': '#FFFF00'
    };
 
    // Function to create and add the div structure to each minipac_sr_text div
    async function addDivStructureToItems() {
        const srTextDivs = document.querySelectorAll('.minipac_sr_text');
        for (const srTextDiv of srTextDivs) {
            const h2 = srTextDiv.querySelector('h2');
            if (h2) {
                const url = h2.querySelector('a')?.getAttribute('href');
                if (url) {
                    try {
                        const response = await fetch(url);
                        if (response.ok) {
                            const text = await response.text();
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(text, 'text/html');
 
                            const collectionsElement = doc.querySelector('.minipac_bibpage_collections');
                            if (collectionsElement) {
                                const anchorTags = collectionsElement.querySelectorAll('a');
                                for (const anchorTag of anchorTags) {
                                    const content = anchorTag.textContent.trim();
                                    if (!content.includes('Your library')) {
                                        // Extract color information using regular expression
                                        const colorMatch = content.match(/\(([^)]+)\)/);
                                        if (!colorMatch) {
                                            break; // Break if there is no color information
                                        }
                                        const colorName = colorMatch[1].trim();
                                        const hexColor = colorMap[colorName.toLowerCase()] || '';
 
                                        // Create and append the div structure
                                        const divStructure = `
                                            <div class="minipac_searchresults_section row  clearfix">
                                                <div class="minipac_biblabel col-lg-2 col-md-2 col-sm-3 col-xs-3">Collection</div>
                                                <div class="minipac_bibdata col-lg-7 col-md-8 col-sm-9 col-xs-10">
                                                    <a href="${url}">${content}</a>
                                                </div>
                                                <div style="background: ${hexColor};" class="minipac_bibdata col-lg-2 col-md-2 col-sm-2 col-xs-2">&nbsp;</div>
                                            </div>
                                        `;
 
                                        // Create a new div element and append the div structure to it
                                        const newDiv = document.createElement('div');
                                        newDiv.innerHTML = divStructure;
 
                                        // Append the new div to the minipac_sr_text div
                                        srTextDiv.appendChild(newDiv);
                                        break; // Stop after the first matching anchor tag
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Error fetching or parsing the page: ${url}`, error);
                    }
                }
            }
        }
    }
 
    // Call the function to add the div structure when the page loads
    addDivStructureToItems();
})();
