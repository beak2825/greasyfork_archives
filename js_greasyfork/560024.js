// ==UserScript==
// @name         MCPEDL.com - Bypass Download Link Slop
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  You can do better, guys
// @author       Threeskimo
// @match        https://mcpedl.com/mutant-creatures-addon/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mcpedl.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560024/MCPEDLcom%20-%20Bypass%20Download%20Link%20Slop.user.js
// @updateURL https://update.greasyfork.org/scripts/560024/MCPEDLcom%20-%20Bypass%20Download%20Link%20Slop.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BYPASS_LABEL = ' (BYPASS)';

    // Domains we want to bypass
    const BYPASS_DOMAINS = [
        'loot-link.com',
        'lootdest.org',
        'link-hub.net',
        'link-target.net'
    ];

    function isBypassTarget(url) {
        try {
            const u = new URL(url);
            return BYPASS_DOMAINS.some(domain => u.hostname.endsWith(domain));
        } catch {
            return false;
        }
    }

    function rewriteLink(anchor) {
        if (!anchor?.href) return;

        try {
            const url = new URL(anchor.href);

            // Only MCPEDL leaving redirects
            if (url.hostname !== 'mcpedl.com' || !url.pathname.startsWith('/leaving/')) return;

            const embeddedUrl = url.searchParams.get('url');
            if (!embeddedUrl) return;

            if (!isBypassTarget(embeddedUrl)) return;

            // Rewrite href to bypass.city
            anchor.href =
                `https://bypass.city/bypass?bypass=${encodeURIComponent(embeddedUrl)}`;

            // Append label once
            if (!anchor.textContent.includes(BYPASS_LABEL)) {
                anchor.textContent += BYPASS_LABEL;
            }

        } catch {
            // If parsing fails, we shrug and continue
        }
    }

    function scanPage() {
        document.querySelectorAll('a[href]').forEach(rewriteLink);
    }

    // Initial scan
    scanPage();

    // Observe dynamically added links
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue;

                if (node.tagName === 'A') {
                    rewriteLink(node);
                } else {
                    node.querySelectorAll?.('a[href]').forEach(rewriteLink);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();