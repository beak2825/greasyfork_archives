// ==UserScript==
// @name         Display Onclick Events as Links (Configurable)
// @namespace    http://tampermonkey.net/
// @version      0.8.3
// @description  Finds onclick attributes, displays them as links with an option to open in the same tab.
// @author       You
// @match        *angusnicneven.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551934/Display%20Onclick%20Events%20as%20Links%20%28Configurable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551934/Display%20Onclick%20Events%20as%20Links%20%28Configurable%29.meta.js
// ==/UserScript==

// --- SCRIPT CONFIGURATION ---
// Set this to 'true' to open links in a new tab.
// Set this to 'false' to open links in the same tab.
const openLinksInNewTab = false;
// --- END CONFIGURATION ---

(function() {
    'use strict';

    // A debounce function to prevent the script from running too often and freezing the page.
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const findAndDisplayOnclicks = () => {
        // Find or create the display container.
        let container = document.getElementById('onclick-display-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'onclick-display-container';
            container.style.position = 'fixed';
            container.style.bottom = '10px';
            container.style.right = '10px';
            container.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            container.style.border = '1px solid black';
            container.style.padding = '10px';
            container.style.zIndex = '9999';
            container.style.maxHeight = '300px';
            container.style.overflowY = 'auto';
            document.body.appendChild(container);
        }

        const elementsWithOnclick = document.querySelectorAll('[onclick]');

        // Clear previous results.
        container.innerHTML = '';

        if (elementsWithOnclick.length > 0) {
            const heading = document.createElement('h3');
            heading.textContent = `Onclick Events Found: (${elementsWithOnclick.length})`;
            heading.style.marginTop = '0';
            heading.style.marginBottom = '10px';
            heading.style.color = 'black';
            heading.style.fontFamily = 'Arial';
            container.appendChild(heading);

            elementsWithOnclick.forEach((element, index) => {
                const onclickValue = element.getAttribute('onclick');

                // Sanitize the value for the URL.
                const sanitizedOnclickValue = onclickValue
                    .replace(/window\.location=/g, '')
                    .replace(/'/g, '')
                    .replace(/window\.location = /g,'');



                const url = `https://www.angusnicneven.com/${sanitizedOnclickValue}`;

                const linkElement = document.createElement('a');
                linkElement.href = url;
                linkElement.textContent = onclickValue;

                // --- MODIFICATION START ---
                // Set the link target based on the configuration option at the top of the script.
                if (openLinksInNewTab) {
                    linkElement.target = '_blank';
                }
                // --- MODIFICATION END ---

                linkElement.style.color = 'black';
                linkElement.style.fontFamily = 'monospace';
                linkElement.style.fontSize = '16px';
                linkElement.style.wordBreak = 'break-all';

                const lineContainer = document.createElement('div');
                lineContainer.style.borderBottom = '1px solid #ccc';
                lineContainer.style.paddingBottom = '5px';
                lineContainer.style.marginBottom = '5px';

                lineContainer.appendChild(document.createTextNode(`${index + 1}: `));
                lineContainer.appendChild(linkElement);

                container.appendChild(lineContainer);
            });
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    };

    const debouncedFind = debounce(findAndDisplayOnclicks, 250);

    const observer = new MutationObserver(() => {
        debouncedFind();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });

    document.addEventListener('DOMContentLoaded', findAndDisplayOnclicks);
    window.addEventListener('load', findAndDisplayOnclicks);

})();