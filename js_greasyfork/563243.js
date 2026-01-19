// ==UserScript==
// @name         Google SERP Top Quick Links
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a single toolbar at the top of Google results with links to search in site, GitHub, Reddit, and reverse image search if available.
// @author       </j0tsarup>
// @match        https://www.google.com/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563243/Google%20SERP%20Top%20Quick%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/563243/Google%20SERP%20Top%20Quick%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createToolbar(links) {
        const toolbar = document.createElement('div');
        toolbar.style.padding = '10px';
        toolbar.style.marginBottom = '10px';
        toolbar.style.border = '1px solid #ccc';
        toolbar.style.borderRadius = '8px';
        toolbar.style.background = '#f8f9fa';
        toolbar.style.display = 'flex';
        toolbar.style.flexWrap = 'wrap';
        toolbar.style.gap = '10px';
        toolbar.style.alignItems = 'center';

        links.forEach(link => toolbar.appendChild(link));

        const container = document.querySelector('div#search');
        if (container) {
            container.insertBefore(toolbar, container.firstChild);
        }
    }

    function createLink(href, text) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        a.target = '_blank';
        a.style.fontSize = '14px';
        a.style.color = '#1a0dab';
        a.style.textDecoration = 'none';
        a.style.padding = '5px 10px';
        a.style.border = '1px solid #1a0dab';
        a.style.borderRadius = '5px';
        a.style.backgroundColor = '#fff';
        a.addEventListener('mouseover', () => a.style.backgroundColor = '#e8f0fe');
        a.addEventListener('mouseout', () => a.style.backgroundColor = '#fff');
        return a;
    }

    function initToolbar() {
        const query = new URLSearchParams(window.location.search).get('q');
        if (!query) return;

        const results = document.querySelectorAll('div.MjjYud');
        if (results.length === 0) return;

        const firstLink = results[0].querySelector('a');
        if (!firstLink || !firstLink.href.includes('http')) return;

        const url = new URL(firstLink.href);
        const domain = url.hostname.replace(/^www\./, '');

        const links = [];
        links.push(createLink(`https://www.google.com/search?q=site:${domain}+${query}`, '🔍 In Site'));
        links.push(createLink(`https://github.com/search?q=${encodeURIComponent(query)}`, '🐙 GitHub'));
        links.push(createLink(`https://www.reddit.com/search/?q=${encodeURIComponent(query)}`, '👽 Reddit'));

        // Check for reverse image candidate
        const img = document.querySelector('div.MjjYud img');
        if (img && img.src && img.naturalWidth > 50) {
            links.push(createLink(`https://www.google.com/searchbyimage?image_url=${encodeURIComponent(img.src)}`, '🖼 Reverse Image'));
        }

        createToolbar(links);
    }

    window.addEventListener('load', () => setTimeout(initToolbar, 1200));
})();
