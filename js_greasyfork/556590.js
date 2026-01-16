// ==UserScript==
// @name         Wikipedia Nord Dark Theme
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Applies the Nord color palette (https://www.nordtheme.com/) to Wikipedia pages
// @author       jizhou-wu and Gemini
// @match        https://*.wikipedia.org/*
// @match        https://*.wikimedia.org/*
// @match        https://*.wiktionary.org/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/556590/Wikipedia%20Nord%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/556590/Wikipedia%20Nord%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const nordCss = `
        /* Nord Color Palette Variables */
        :root {
            /* Polar Night - Backgrounds */
            --nord0: #2E3440;
            --nord1: #3B4252;
            --nord2: #434C5E;
            --nord3: #4C566A;

            /* Snow Storm - Text */
            --nord4: #D8DEE9;
            --nord5: #E5E9F0;
            --nord6: #ECEFF4;

            /* Frost - Accents */
            --nord7: #8FBCBB;
            --nord8: #88C0D0;
            --nord9: #81A1C1;
            --nord10: #5E81AC;

            /* Aurora - Status/Alerts */
            --nord11: #BF616A; /* Red */
            --nord12: #D08770; /* Orange */
            --nord13: #EBCB8B; /* Yellow */
            --nord14: #A3BE8C; /* Green */
            --nord15: #B48EAD; /* Purple */

            /* --- OVERRIDES FOR WIKIPEDIA BETA / DARK MODE VARIABLES --- */
            /* This forces the site to use Nord variables regardless of the "Light/Dark/Auto" setting */
            --background-color-base: var(--nord0) !important;
            --background-color-neutral: var(--nord1) !important;
            --background-color-neutral-subtle: var(--nord2) !important;
            --background-color-interactive: var(--nord2) !important;
            --background-color-interactive-subtle: var(--nord1) !important;
            
            --color-base: var(--nord4) !important;
            --color-emphasized: var(--nord6) !important;
            --color-subtle: var(--nord4) !important;
            
            --border-color-base: var(--nord2) !important;
            --border-color-subtle: var(--nord2) !important;
            --border-color-muted: var(--nord2) !important;
        }

        /* --- Global Backgrounds & Text --- */
        /* Added .mw-page-container for Vector 2022 coverage */
        body, html, .mw-page-container {
            background-color: var(--nord0) !important;
            color: var(--nord4) !important;
        }

        /* Main content area */
        .mw-body, #content {
            background-color: var(--nord0) !important;
            border: none !important;
            box-shadow: none !important;
            color: var(--nord4) !important;
        }

        /* Title & Headings */
        h1, h2, h3, h4, h5, h6 {
            color: var(--nord6) !important;
            border-bottom-color: var(--nord2) !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .mw-body h1, .mw-body h2 {
             font-family: 'Linux Libertine', 'Georgia', 'Times', serif;
        }

        /* --- Links --- */
        a, .mw-body-content a.external.text, .mw-body-content a.extiw {
            color: var(--nord8) !important; /* Frost Blue */
        }
        a:visited {
            color: var(--nord9) !important; /* Slightly darker Frost */
        }
        a:hover, a:active {
            color: var(--nord7) !important; /* Teal */
            text-decoration: underline;
        }
        a.new, #p-personal a.new {
            color: var(--nord11) !important; /* Red for missing pages */
        }

        /* --- Interface Elements / Layout --- */

        /* Top Header & Sidebar background */
        #mw-page-base, #mw-head-base, #mw-head, #mw-panel {
            background-color: var(--nord1) !important;
            background-image: none !important;
        }

        /* Sidebar items */
        .portal .body li a {
            color: var(--nord4) !important;
        }
        .portal h3 {
            color: var(--nord5) !important;
            background-image: none !important; /* Remove gradient divider */
        }

        /* Top User Menu (top right) */
        #p-personal li a {
             color: var(--nord4) !important;
        }

        /* --- Search Bar --- */
        #simpleSearch {
            background-color: var(--nord2) !important;
            border-color: var(--nord3) !important;
        }
        #simpleSearch input {
            background-color: transparent !important;
            color: var(--nord6) !important;
        }
        #simpleSearch #searchButton {
            filter: invert(1); /* Invert icon to make it white */
        }

        /* --- Tables & Infoboxes --- */
        table.wikitable, .infobox, .tright, .toc, .thumbinner {
            background-color: var(--nord1) !important;
            color: var(--nord4) !important;
            border-color: var(--nord2) !important;
        }

        table.wikitable > tr > th, table.wikitable > tr > td,
        table.wikitable > * > tr > th, table.wikitable > * > tr > td {
            border-color: var(--nord2) !important;
            background-color: var(--nord1) !important;
        }

        /* Zebra striping for tables (optional, using nord2) */
        table.wikitable > tr:nth-child(odd) > td,
        table.wikitable > * > tr:nth-child(odd) > td {
             background-color: var(--nord0) !important;
        }

        table.wikitable > tr > th {
            background-color: var(--nord2) !important;
            color: var(--nord6) !important;
        }

        /* Table of Contents */
        .toc {
            background-color: var(--nord1) !important;
            border: 1px solid var(--nord3) !important;
        }
        .toc h2 {
            color: var(--nord6) !important;
        }

        /* --- Code & Preformatted Text --- */
        pre, code, .mw-code {
            background-color: var(--nord2) !important;
            color: var(--nord6) !important;
            border: 1px solid var(--nord3) !important;
        }

        /* --- Images & Thumbnails --- */
        .thumbinner {
            background-color: var(--nord1) !important;
            border-color: var(--nord2) !important;
        }
        .thumbcaption {
            color: var(--nord4) !important;
        }
        /* Make transparent images readable */
        img.thumbimage {
            background-color: var(--nord4) !important; /* Light bg for transparency */
            border: 1px solid var(--nord2) !important;
        }
        
        /* Specific fix for math images (LaTeX) to invert them to white */
        .mwe-math-fallback-image-inline, 
        .mwe-math-fallback-image-display,
        img[src*="latex"] {
            filter: invert(1) hue-rotate(180deg);
        }

        /* Support for native MathML (if enabled in settings) */
        math, .mwe-math-element {
            color: var(--nord6) !important;
            fill: var(--nord6) !important;
        }

        /* --- Categories Box (bottom) --- */
        #catlinks {
            background-color: var(--nord1) !important;
            border-color: var(--nord2) !important;
        }

        /* --- Diff Views (History) --- */
        td.diff-context {
            background-color: var(--nord1) !important;
            color: var(--nord4) !important;
        }
        td.diff-addedline {
            background-color: rgba(163, 190, 140, 0.2) !important; /* Nord14 Green tint */
            border-color: var(--nord14) !important;
        }
        td.diff-deletedline {
            background-color: rgba(191, 97, 106, 0.2) !important; /* Nord11 Red tint */
            border-color: var(--nord11) !important;
        }

        /* --- Vector 2022 Skin Fixes (Modern Wikipedia) --- */
        .vector-header-container {
             background-color: var(--nord1) !important;
        }
        .vector-search-box-input {
             background-color: var(--nord2) !important;
             color: var(--nord6) !important;
        }
        .vector-menu-tabs .selected {
             background-color: var(--nord0) !important;
             border-bottom: 0 !important;
        }
        .vector-menu-tabs li {
             background-image: none !important;
        }
        .mw-logo-icon {
             filter: invert(1) grayscale(1); /* Make Wikipedia logo white */
        }

        /* Scrollbars (Chrome/Webkit) */
        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }
        ::-webkit-scrollbar-track {
            background: var(--nord0);
        }
        ::-webkit-scrollbar-thumb {
            background: var(--nord3);
            border-radius: 6px;
            border: 3px solid var(--nord0);
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--nord9);
        }
    `;

    // Function to inject the CSS
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    // Use GM_addStyle if available, otherwise fallback to standard injection
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(nordCss);
    } else {
        addGlobalStyle(nordCss);
    }

})();
