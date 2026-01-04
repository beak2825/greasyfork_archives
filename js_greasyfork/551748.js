// ==UserScript==
// @name         AI extra warning
// @namespace    https://store.steampowered.com/app/
// @version      2025-10-07
// @description  erm actually
// @author       Me
// @run-at       document-idle
// @match        https://store.steampowered.com/app/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551748/AI%20extra%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/551748/AI%20extra%20warning.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Check if target element exists
    let targetElement = document.getElementById('queueCtn');
    let headers = document.querySelectorAll('h2');

    // Check if any <h2> has the exact text
    let exists = Array.from(headers).some(h2 => h2.textContent.trim() === 'AI Generated Content Disclosure');

    if (exists) {
        let container = document.createElement('div');
        container.innerHTML = `
            <div class="mature_content_notice">
                <p>This game uses AI Generated Content.</p>
                <a href="#game_area_content_descriptors" class="btnv6_blue_hoverfade btn_medium"><span>Go to Disclosure</span></a>
            </div>
        `;
        targetElement.parentNode.insertBefore(container.firstElementChild, targetElement);
    }
})();
