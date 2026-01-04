// ==UserScript==
// @name         Greasy Fork Search Focus Hotkey + Site Filter
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Press Ctrl+/ to focus search box. Supports site:domain.com syntax in searches.
// @author       You
// @match        https://greasyfork.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559681/Greasy%20Fork%20Search%20Focus%20Hotkey%20%2B%20Site%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/559681/Greasy%20Fork%20Search%20Focus%20Hotkey%20%2B%20Site%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = 0;
    const logdebug = DEBUG ? console.log.bind(console) : (...a) => {};

    // Focus hotkey functionality
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            const searchBox = document.querySelector('form.home-search input[type="search"]');
            if (searchBox) {
                searchBox.focus();
                searchBox.select();
                logdebug('Focused search box');
            }
        }
    });

    // Intercept the main search form submission
    const searchForm = document.querySelector('form.home-search');
    if (searchForm) {
        logdebug('Found home-search form, attaching submit handler');

        searchForm.addEventListener('submit', function(e) {
            const searchInput = searchForm.querySelector('input[type="search"]');
            const searchContent = searchInput ? searchInput.value.trim() : '';

            logdebug('Submit fired, searchContent:', searchContent);

            if (!searchContent) {
                return;
            }

            // Parse the search content
            const components = searchContent.split(/\s+/);
            let keywords = [];
            let site = '';

            logdebug('Components:', components);

            for (const component of components) {
                if (component.startsWith('site:')) {
                    site = component.substring(5);
                } else {
                    keywords.push(component);
                }
            }

            logdebug('Parsed - site:', site, 'keywords:', keywords);

            // Only intercept if we found a site: syntax
            if (site) {
                e.preventDefault();

                const searchParams = new URLSearchParams();

                if (keywords.length > 0) {
                    searchParams.set('q', keywords.join(' '));
                }

                searchParams.set('site', site);

                const currentLang = window.location.pathname.split('/')[1] || 'en';
                const targetUrl = 'https://greasyfork.org/' + currentLang + '/scripts?' + searchParams.toString();

                logdebug('Redirecting to:', targetUrl);
                window.location.href = targetUrl;
            }
        });
    } else {
        logdebug('home-search form not found');
    }

    logdebug('Userscript loaded');
})();
