// ==UserScript==
// @name         Investopedia Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Dark mode for Investopedia.com
// @author       You
// @match        https://www.investopedia.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549138/Investopedia%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/549138/Investopedia%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and inject dark mode CSS
    const darkModeCSS = `
        /* Global dark mode styles */
        * {
            scrollbar-width: thin;
            scrollbar-color: #555 #2a2a2a;
        }

        *::-webkit-scrollbar {
            width: 8px;
        }

        *::-webkit-scrollbar-track {
            background: #2a2a2a;
        }

        *::-webkit-scrollbar-thumb {
            background-color: #555;
            border-radius: 4px;
        }

        /* Main background and text */
        body,
        html {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
        }

        /* Headers */
        h1, h2, h3, h4, h5, h6 {
            color: #ffffff !important;
        }

        /* Links */
        a {
            color: #4a9eff !important;
        }

        a:hover {
            color: #66b3ff !important;
        }

        a:visited {
            color: #9a7bff !important;
        }

        /* Navigation and header */
        .header,
        .navbar,
        .nav,
        nav,
        [class*="header"],
        [class*="nav"] {
            background-color: #2d2d2d !important;
            border-color: #404040 !important;
        }

        /* Main content areas */
        .main,
        .content,
        .article,
        [class*="content"],
        [class*="article"],
        [class*="main"] {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
        }

        /* Sidebars and secondary content */
        .sidebar,
        .aside,
        aside,
        [class*="sidebar"],
        [class*="aside"] {
            background-color: #242424 !important;
            color: #e0e0e0 !important;
        }

        /* Cards and containers */
        .card,
        .box,
        .container,
        .panel,
        [class*="card"],
        [class*="box"],
        [class*="panel"] {
            background-color: #242424 !important;
            border-color: #404040 !important;
            color: #e0e0e0 !important;
        }

        /* Forms and inputs */
        input,
        textarea,
        select,
        button {
            background-color: #2d2d2d !important;
            color: #e0e0e0 !important;
            border-color: #404040 !important;
        }

        input:focus,
        textarea:focus,
        select:focus {
            border-color: #4a9eff !important;
            box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.2) !important;
        }

        button:hover {
            background-color: #3a3a3a !important;
        }

        /* Tables */
        table {
            background-color: #242424 !important;
            color: #e0e0e0 !important;
        }

        th {
            background-color: #2d2d2d !important;
            color: #ffffff !important;
            border-color: #404040 !important;
        }

        td {
            background-color: #242424 !important;
            color: #e0e0e0 !important;
            border-color: #404040 !important;
        }

        tr:nth-child(even) {
            background-color: #2a2a2a !important;
        }

        /* Quotes and blockquotes */
        blockquote,
        .quote,
        [class*="quote"] {
            background-color: #2d2d2d !important;
            border-left-color: #4a9eff !important;
            color: #e0e0e0 !important;
        }

        /* Code blocks */
        code,
        pre,
        .code,
        [class*="code"] {
            background-color: #1e1e1e !important;
            color: #f8f8f2 !important;
            border-color: #404040 !important;
        }

        /* Alerts and notifications */
        .alert,
        .notification,
        .message,
        [class*="alert"],
        [class*="notification"],
        [class*="message"] {
            background-color: #2d2d2d !important;
            color: #e0e0e0 !important;
            border-color: #404040 !important;
        }

        /* Specific Investopedia elements */
        .mntl-sc-block,
        .comp,
        .article-content,
        .article-body {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
        }

        /* Footer */
        .footer,
        footer,
        [class*="footer"] {
            background-color: #2d2d2d !important;
            color: #e0e0e0 !important;
            border-color: #404040 !important;
        }

        /* Dropdown menus */
        .dropdown-menu,
        .menu,
        [class*="dropdown"],
        [class*="menu"] {
            background-color: #2d2d2d !important;
            color: #e0e0e0 !important;
            border-color: #404040 !important;
        }

        /* Tooltips */
        .tooltip,
        [class*="tooltip"] {
            background-color: #2d2d2d !important;
            color: #e0e0e0 !important;
        }

        /* Images - add subtle border for better visibility */
        img {
            border: 1px solid #404040;
            border-radius: 4px;
        }

        /* Override any white backgrounds */
        [style*="background-color: white"],
        [style*="background-color: #fff"],
        [style*="background-color: #ffffff"],
        [style*="background: white"],
        [style*="background: #fff"],
        [style*="background: #ffffff"] {
            background-color: #242424 !important;
        }

        /* Override any black text on light backgrounds */
        [style*="color: black"],
        [style*="color: #000"],
        [style*="color: #000000"] {
            color: #e0e0e0 !important;
        }

        /* Special handling for specific Investopedia components */
        .mntl-breadcrumbs {
            background-color: #2d2d2d !important;
        }

        .mntl-sc-block-adslot {
            background-color: #2d2d2d !important;
        }

        /* Search box styling */
        .search-form input {
            background-color: #2d2d2d !important;
            color: #e0e0e0 !important;
        }
    `;

    // Create style element and inject CSS
    const style = document.createElement('style');
    style.textContent = darkModeCSS;
    document.head.appendChild(style);

    // Function to apply dark mode to dynamically loaded content
    function applyDarkModeToNewElements() {
        // This will handle any new elements that are added after page load
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Force dark styling on new elements if needed
                        if (node.style && node.style.backgroundColor === 'white') {
                            node.style.backgroundColor = '#242424';
                        }
                        if (node.style && node.style.color === 'black') {
                            node.style.color = '#e0e0e0';
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyDarkModeToNewElements);
    } else {
        applyDarkModeToNewElements();
    }

    // Apply additional fixes after a short delay to catch any delayed loading
    setTimeout(function() {
        // Force any remaining white backgrounds to dark
        const whiteElements = document.querySelectorAll('[style*="background-color: white"], [style*="background-color: #fff"], [style*="background-color: #ffffff"]');
        whiteElements.forEach(el => {
            el.style.backgroundColor = '#242424';
        });

        // Force any remaining black text to light
        const blackTextElements = document.querySelectorAll('[style*="color: black"], [style*="color: #000"], [style*="color: #000000"]');
        blackTextElements.forEach(el => {
            el.style.color = '#e0e0e0';
        });
    }, 1000);

})();