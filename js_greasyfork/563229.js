// ==UserScript==
// @name         Highlight External Links
// @namespace    https://greasyfork.org/users/example
// @version      1.0.0
// @description  Highlights external links on the current page so users can easily identify links that lead to other websites.
// @author       YourName
// @match        http://*/*
// @match        https://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563229/Highlight%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/563229/Highlight%20External%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Get the current site's hostname
     */
    const currentHost = window.location.hostname;

    /**
     * Find all anchor elements with href
     */
    const links = document.querySelectorAll('a[href]');

    links.forEach(link => {
        try {
            const linkUrl = new URL(link.href, window.location.href);

            // Check if the link is external
            if (linkUrl.hostname && linkUrl.hostname !== currentHost) {
                highlightExternalLink(link);
            }
        } catch (error) {
            // Ignore invalid URLs
        }
    });

    /**
     * Apply styles to external links
     * @param {HTMLAnchorElement} link
     */
    function highlightExternalLink(link) {
        link.style.borderBottom = '2px dotted red';
        link.title = 'External link: ' + link.href;
    }
})();
