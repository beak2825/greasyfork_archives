// ==UserScript==
// @name         ❤️ Favicon Preview for External Links
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Show favicon previews next to external links using DuckDuckGo's API
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558861/%E2%9D%A4%EF%B8%8F%20Favicon%20Preview%20for%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/558861/%E2%9D%A4%EF%B8%8F%20Favicon%20Preview%20for%20External%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const currentDomain = window.location.hostname;

    function resolveURL(href) {
        try {
            return new URL(href, window.location.href);
        } catch {
            return null;
        }
    }

    function isExternalLink(url) {
        return url && url.hostname !== currentDomain;
    }

    function createFaviconElement(domain, fontSize) {
        const img = document.createElement('img');
        img.src = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
        img.style.width = fontSize;
        img.style.height = fontSize;
        img.style.marginRight = '4px';
        img.style.verticalAlign = 'middle';
        img.style.objectFit = 'contain';
        img.onerror = () => img.remove(); // Remove if favicon fails to load
        return img;
    }

    function addFaviconsToLinks() {
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || link.querySelector('img')) return;

            const url = resolveURL(href);
            if (isExternalLink(url)) {
                const domain = url.hostname;
                const fontSize = window.getComputedStyle(link).fontSize || '16px';
                const favicon = createFaviconElement(domain, fontSize);
                link.prepend(favicon);
            }
        });
    }

    // Run after full page load to catch dynamic content
    window.addEventListener('load', () => {
        setTimeout(addFaviconsToLinks, 500);
    });
})();