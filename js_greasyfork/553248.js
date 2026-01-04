// ==UserScript==
// @name         GeoGuessr Random Map
// @namespace    https://github.com/asmodeo
// @icon         https://parmageo.vercel.app/gg.ico
// @version      1.1
// @description  Adds a button on the Community Maps page (and a menu command) that redirects to a Random Map.
// @author       Parma
// @match        https://www.geoguessr.com/*
// @grant        GM_registerMenuCommand
// @connect      www.geoguessr.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553248/GeoGuessr%20Random%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/553248/GeoGuessr%20Random%20Map.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentPath = window.location.pathname;

    // Fetch random map URL
    async function getRandomMapUrl() {
        try {
            const response = await fetch('https://www.geoguessr.com/api/v3/social/maps/browse/random');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const map = await response.json();
            return 'https://www.geoguessr.com' + map.url.trim();
        } catch (error) {
            console.error('Random Map error:', error);
            alert('Failed to load a random map.');
            return null;
        }
    }

    // Redirect to map URL
    function redirectToMap(mapUrl) {
        if (mapUrl) {
            window.location.href = mapUrl;
        }
    }

    // Menu command
    GM_registerMenuCommand('Random Map', async function() {
        const mapUrl = await getRandomMapUrl();
        if (mapUrl) redirectToMap(mapUrl);
    });

    // Link creation
    function createStyledLink() {
        const link = document.createElement('a');
        link.id = 'geoguessr-random-map-btn';
        link.className = 'button_button__aR6_e button_link__LWagc button_variantPurple__qyK6c';
        link.title = 'Load a random community map';
        link.style.minWidth = '140px';
        link.style.textDecoration = 'none';
        link.style.display = 'flex';
        link.style.alignItems = 'center';
        link.style.justifyContent = 'center';
        link.innerHTML = '<span class="button_label__2JvUx" style="line-height: 1;">Random Map</span>';        
        link.href = '#';
        link.target = '_blank';

        // Handle all clicks - always fetch a new random map
        link.addEventListener('click', async function(e) {
            e.preventDefault();

            const mapUrl = await getRandomMapUrl();
            if (!mapUrl) return;

            // For left-click without modifiers, open in current tab
            if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                redirectToMap(mapUrl);
            }
            // For middle-click and other modifiers, use window.open which works reliably
            else {
                window.open(mapUrl, '_blank');
            }
        });

        // Handle middle-clicks specifically
        link.addEventListener('auxclick', async function(e) {
            if (e.button === 1) { // Middle click
                e.preventDefault();
                const mapUrl = await getRandomMapUrl();
                if (mapUrl) {
                    window.open(mapUrl, '_blank');
                }
            }
        });

        return link;
    }

    // Mounting logic
    function isCommunityMapsPage() {
        return window.location.pathname === '/maps/community';
    }

    function mountButton() {
        if (!isCommunityMapsPage()) return;

        const header = document.querySelector('.page-title_header__AHcKq.page-title_collapseOnMobile__n_EP_');
        if (!header) return;

        // Avoid duplicates
        if (header.querySelector(`#geoguessr-random-map-btn`)) return;

        const categoryMenu = header.querySelector('.tag-nav_categoryMenu__AUXWy');
        if (!categoryMenu) return;

        const link = createStyledLink();
        categoryMenu.parentNode.insertBefore(link, categoryMenu.nextSibling);
    }

    function unmountButton() {
        const btn = document.getElementById('geoguessr-random-map-btn');
        if (btn) btn.remove();
    }

    // Navigation handling
    function handleNavigation() {
        const newPath = window.location.pathname;
        if (newPath !== currentPath) {
            currentPath = newPath;
            if (!isCommunityMapsPage()) {
                unmountButton();
            }
        }
        if (isCommunityMapsPage()) {
            mountButton();
        }
    }

    const observer = new MutationObserver(handleNavigation);
    observer.observe(document, { subtree: true, childList: true });
    handleNavigation();
    setInterval(handleNavigation, 800);
})();