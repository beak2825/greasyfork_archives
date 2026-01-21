// ==UserScript==
// @name         Torn ACI Member Badge (Indonesia)
// @namespace    https://greasyfork.org/users/aci-indonesia
// @version      1.4.1
// @description  Shows ACI MEMBER badge with Indonesian flag icon for verified users.
// @author       Altec64
// @license      All Rights Reserved
// @match        https://www.torn.com/profiles.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563332/Torn%20ACI%20Member%20Badge%20%28Indonesia%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563332/Torn%20ACI%20Member%20Badge%20%28Indonesia%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ✅ VERIFIED ACI MEMBERS (Torn IDs)
    const ACI_MEMBERS = new Set([
        "2392722"
    ]);

    // 🇮🇩 Indonesian flag icon (CDN, reliable)
    const FLAG_ICON_URL = 'https://flagcdn.com/w20/id.png';

    function injectAciBadge() {
        const nameHeader = document.querySelector('h4#skip-to-content');
        if (!nameHeader) return;

        if (document.getElementById('aci-member-container')) return;

        const match = nameHeader.textContent.match(/\[(\d+)\]/);
        if (!match) return;

        const userId = match[1];
        if (!ACI_MEMBERS.has(userId)) return;

        const container = document.createElement('span');
        container.id = 'aci-member-container';
        container.style.marginLeft = '10px';
        container.style.display = 'inline-flex';
        container.style.alignItems = 'center';
        container.style.gap = '6px';

        // 🔴 ACI MEMBER badge
        const badge = document.createElement('span');
        badge.textContent = 'ACI MEMBER';
        badge.style.padding = '4px 8px';
        badge.style.backgroundColor = '#c62828';
        badge.style.color = '#ffffff';
        badge.style.fontSize = '12px';
        badge.style.fontWeight = 'bold';
        badge.style.borderRadius = '4px';
        badge.title = 'ACI Discord Verified Member';

        // 🇮🇩 Flag icon (no background, no text)
        const flag = document.createElement('img');
        flag.src = FLAG_ICON_URL;
        flag.alt = 'Indonesia';
        flag.title = 'Indonesia';
        flag.style.width = '16px';
        flag.style.height = '16px';
        flag.style.objectFit = 'cover';

        container.appendChild(badge);
        container.appendChild(flag);
        nameHeader.appendChild(container);
    }

    injectAciBadge();

    const observer = new MutationObserver(injectAciBadge);
    observer.observe(document.body, { childList: true, subtree: true });

})();