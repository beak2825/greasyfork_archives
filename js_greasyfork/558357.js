// ==UserScript==
// @name         FetLife Designer Suite (Home Feed + Filters)
// @namespace    http://tampermonkey.net/
// @version      16.0
// @description  Masonry & Avatars on /home and all feed filters (All Posts, Groups, etc.).
// @author       Rysta
// @match        https://fetlife.com/home*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558357/FetLife%20Designer%20Suite%20%28Home%20Feed%20%2B%20Filters%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558357/FetLife%20Designer%20Suite%20%28Home%20Feed%20%2B%20Filters%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. THEME ENGINE ---
    function getThemeStyles() {
        const bodyStyle = window.getComputedStyle(document.body);
        const rgb = bodyStyle.backgroundColor.match(/\d+/g);
        let isDark = true;
        if (rgb) isDark = (parseInt(rgb[0])*0.299 + parseInt(rgb[1])*0.587 + parseInt(rgb[2])*0.114) < 128;

        if (isDark) {
            return `
                --card-bg: #121212;
                --card-border: none;
                --card-shadow: none;
                --avatar-border: 2px solid #333;
            `;
        } else {
            return `
                --card-bg: #f0f0f0;
                --card-border: 1px solid #e2e8f0;
                --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0);
                --avatar-border: 2px solid #e2e8f0;
            `;
        }
    }

    // --- 2. CSS INJECTION ---
    const css = `
        /* THEME VARIABLES */
        body.fl-home-active {
            ${getThemeStyles()}
        }

        /* WIDTH UNLOCK */
        body.fl-home-active .max-w-screen-xl {
            max-width: 98vw !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
        }
        body.fl-home-active .mx-auto.max-w-3xl {
            max-width: 100% !important;
            margin: 0 !important;
        }

        /* MASONRY GRID */
        body.fl-home-active #stories-list {
            display: block !important;
            column-gap: 1.5rem;
            width: 100%;
            column-count: 2;
        }
        @media (min-width: 1200px) { body.fl-home-active #stories-list { column-count: 3; } }
        @media (min-width: 2400px) { body.fl-home-active #stories-list { column-count: 4; } }

        /* CARD STYLING */
        body.fl-home-active #stories-list > div {
            break-inside: avoid;
            margin-bottom: 1.5rem;
            border-radius: 12px;
            padding: 0rem 1.5rem !important;
            background-color: var(--card-bg) !important;
            border: var(--card-border) !important;
            box-shadow: var(--card-shadow) !important;
        }

        /* AVATARS (72px) */
        body.fl-home-active #stories-list > div header a.flex-none {
            width: 72px !important;
            height: 72px !important;
            margin-right: 1.25rem !important;
        }
        body.fl-home-active #stories-list > div header a.flex-none img {
            width: 100% !important;
            height: 100% !important;
            border-radius: 50% !important;
            object-fit: cover;
            border: var(--avatar-border) !important;
        }

        /* TEXT FIXES */
        body.fl-home-active #stories-list .pr-8 { padding-right: 0 !important; }
        body.fl-home-active #stories-list > div header { align-items: center !important; margin-bottom: 0.5rem; }
        body.fl-home-active #stories-list > div header .leading-normal { font-size: 1.15em; font-weight: 700; }

        /* ROUNDED IMAGES */
        body.fl-home-active #stories-list > div article .overflow-hidden,
        body.fl-home-active #stories-list > div article img {
            border-radius: 8px !important;
        }

        /* UI CLEANUP */
        body.fl-home-active aside.hidden.lg\\:block { opacity: 0.1; transition: opacity 0.3s; }
        body.fl-home-active aside.hidden.lg\\:block:hover { opacity: 1; }
        body.fl-home-active header.flex.h-14 { position: sticky !important; top: 0; z-index: 50; }
    `;
    GM_addStyle(css);

    // --- 3. URL WATCHER (Expanded Logic) ---
    // Checks if URL starts with /home (covers /home/all-posts, /home/groups etc.)
    setInterval(() => {
        if (window.location.pathname.startsWith('/home')) {
            document.body.classList.add('fl-home-active');
        } else {
            document.body.classList.remove('fl-home-active');
        }
    }, 500);

})();