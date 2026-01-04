// ==UserScript==
// @name         FV - Item Locator (Item Museum)
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.1
// @description  Adds a LOCATION under every item in the Item Museum.
// @author       necroam
// @match        https://www.furvilla.com/museum/item/*
// @grant        GM_xmlhttpRequest
// @connect      furvilla.com
// @downloadURL https://update.greasyfork.org/scripts/556034/FV%20-%20Item%20Locator%20%28Item%20Museum%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556034/FV%20-%20Item%20Locator%20%28Item%20Museum%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Extract the current museum item ID from the URL
    const itemId = window.location.pathname.match(/\/item\/(\d+)/)?.[1];
    if (!itemId) return;

    // Fetch the villager 56068 page to extract location in About
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://www.furvilla.com/villager/56068',
        onload: ({ responseText }) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(responseText, 'text/html');
            const block = doc.querySelector('.villager-data-info-wide .profanity-filter');
            if (!block) return;

            const lines = block.innerHTML.split(/<br\s*\/?>/i).map(l => l.trim());
            const locationLines = [];

            // Search for the matching museum item ID
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes(`museum/item/${itemId}`)) {

                    for (let j = i + 1; j < lines.length; j++) {
                        if (lines[j].startsWith('Location:')) {
                            for (let k = j + 1; k < lines.length; k++) {
                                const line = lines[k].trim();
                                if (!line || line.startsWith('https://')) break;
                                locationLines.push(line);
                            }
                            break;
                        }
                        if (lines[j].startsWith('https://')) break;
                    }
                    break;
                }
            }

            const container = document.querySelector('.form-horizontal');
            if (!container) return;

           // Create a new form-group block for the location info
            const group = document.createElement('div');
            group.className = 'form-group';

            const label = document.createElement('label');
            label.className = 'control-label col-xs-4';
            label.textContent = 'Location';

            const contentDiv = document.createElement('div');
            contentDiv.className = 'col-xs-8';

            // If location found
            if (locationLines.length > 0) {
                locationLines.forEach(line => {
                    const p = document.createElement('p');
                    p.className = 'form-control-static';
                    p.textContent = line;
                    contentDiv.appendChild(p);
                });
            } else {
             // If location NOT found
                const p = document.createElement('p');
                p.className = 'form-control-static';
                p.textContent = 'No Location Found';
                contentDiv.appendChild(p);
            }

            group.appendChild(label);
            group.appendChild(contentDiv);
            container.appendChild(group);
        }
    });
})();

