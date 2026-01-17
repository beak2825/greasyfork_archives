// ==UserScript==
// @name         ElderFinch Bulk Installer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to ElderFinch's profile to open installation tabs for all their scripts.
// @author       Gemini
// @match        https://greasyfork.org/*/users/1500121-elderfinch*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563038/ElderFinch%20Bulk%20Installer.user.js
// @updateURL https://update.greasyfork.org/scripts/563038/ElderFinch%20Bulk%20Installer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Create the button
    const btn = document.createElement('button');
    btn.innerText = '⬇️ Install All ElderFinch Scripts';
    btn.style.marginTop = '15px';
    btn.style.width = '100%';
    btn.style.padding = '12px';
    btn.style.backgroundColor = '#2ecc71'; // Green for specific user
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = 'bold';
    btn.style.borderRadius = '5px';
    btn.style.fontSize = '14px';

    // 2. Find the sidebar to attach the button
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.appendChild(btn);
    }

    // 3. Define the click action
    btn.addEventListener('click', function() {
        // Find the list of scripts
        const scriptItems = document.querySelectorAll('ol.script-list > li');

        if (scriptItems.length === 0) {
            alert('No scripts found on the list.');
            return;
        }

        const confirmed = confirm(`Found ${scriptItems.length} scripts from ElderFinch.\n\nClick OK to open ${scriptItems.length} installation tabs.`);

        if (confirmed) {
            scriptItems.forEach((li, index) => {
                const linkTag = li.querySelector('a.script-link');
                if (linkTag) {
                    // Extract ID to build the direct install link
                    const href = linkTag.getAttribute('href');
                    const match = href.match(/\/scripts\/(\d+)/);

                    if (match && match[1]) {
                        const scriptId = match[1];
                        const installUrl = `https://${window.location.hostname}/scripts/${scriptId}/code/script.user.js`;

                        // Small delay prevents browser from missing clicks
                        setTimeout(() => {
                            window.open(installUrl, '_blank');
                        }, index * 8000);
                    }
                }
            });
        }
    });
})();