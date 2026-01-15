// ==UserScript==
// @name         Danbooru Dark Mode
// @namespace    danbooru.darkmode
// @version      1.0
// @description  Complete dark mode for Danbooru with proper contrast and eye strain reduction
// @match        https://kagamihara.donmai.us/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562593/Danbooru%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/562593/Danbooru%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    GM_addStyle(`
        /* Root variables for easy color management */
        :root {
            --bg-primary: #121212;
            --bg-secondary: #1e1e1e;
            --bg-tertiary: #252525;
            --bg-hover: #2a2a2a;
            --text-primary: #e0e0e0;
            --text-secondary: #b0b0b0;
            --text-muted: #808080;
            --border-color: #333333;
            --accent-color: #4a7ab7;
            --accent-hover: #5a8bc7;
            --link-color: #8ab4f8;
            --link-visited: #c58af9;
            --success-color: #81c995;
            --warning-color: #fbbc04;
            --error-color: #f28b82;
            --shadow: rgba(0, 0, 0, 0.3);
        }

        /* Base styles */
        html, body {
            background-color: var(--bg-primary) !important;
            color: var(--text-primary) !important;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* All text elements */
        body, div, p, span, a, h1, h2, h3, h4, h5, h6, 
        li, td, th, label, input, textarea, select {
            color: var(--text-primary);
            border-color: var(--border-color) !important;
        }

        /* Links */
        a:link {
            color: var(--link-color) !important;
            transition: color 0.2s ease;
        }
        a:visited {
            color: var(--link-visited) !important;
        }
        a:hover {
            color: var(--accent-hover) !important;
            background-color: var(--bg-hover) !important;
        }

        /* Navigation and headers */
        #nav, header, .header, #header, .navbar, .top-menu {
            background-color: var(--bg-secondary) !important;
            border-bottom: 1px solid var(--border-color) !important;
            box-shadow: 0 2px 4px var(--shadow) !important;
        }

        /* Main content areas */
        #content, .content, main, .container, .page-container {
            background-color: var(--bg-primary) !important;
        }

        /* Posts and images */
        .post, .post-preview, .post-container, #image-container,
        #c-posts, #a-index, #a-show {
            background-color: var(--bg-secondary) !important;
            border-color: var(--border-color) !important;
        }

        /* Keep images and videos untouched */
        img, video, canvas, .image, #image, #canvas {
            filter: none !important;
            background-color: transparent !important;
            mix-blend-mode: normal !important;
        }

        /* Tables */
        table, th, td, tr, tbody, thead {
            background-color: var(--bg-secondary) !important;
            color: var(--text-primary) !important;
            border-color: var(--border-color) !important;
        }
        tr:hover td {
            background-color: var(--bg-hover) !important;
        }

        /* Forms and inputs */
        input, textarea, select, button, .button, .btn,
        #tags, #post_tag_string, #quick_search_box {
            background-color: var(--bg-tertiary) !important;
            color: var(--text-primary) !important;
            border: 1px solid var(--border-color) !important;
            border-radius: 4px !important;
            transition: all 0.2s ease !important;
        }
        input:focus, textarea:focus, select:focus {
            border-color: var(--accent-color) !important;
            outline: none !important;
            box-shadow: 0 0 0 2px rgba(74, 122, 183, 0.2) !important;
        }
        button:hover, .button:hover, .btn:hover {
            background-color: var(--accent-color) !important;
            color: var(--bg-primary) !important;
        }

        /* Sidebars and panels */
        aside, .sidebar, .panel, .modal, .dialog,
        #sidebar, .notice, .help, .wiki-page-box {
            background-color: var(--bg-secondary) !important;
            border: 1px solid var(--border-color) !important;
            box-shadow: 0 4px 8px var(--shadow) !important;
        }

        /* Code blocks and preformatted text */
        pre, code, .code, .syntax-highlight {
            background-color: var(--bg-tertiary) !important;
            color: var(--text-primary) !important;
            border: 1px solid var(--border-color) !important;
        }

        /* Comments section */
        .comment, .comment-box, #comments, .comment-list,
        .forum-post, .forum-topic {
            background-color: var(--bg-secondary) !important;
            border-color: var(--border-color) !important;
        }

        /* Tags */
        .tag, .tag-link, .tag-type-general {
            background-color: var(--bg-tertiary) !important;
            color: var(--text-secondary) !important;
            border-radius: 3px !important;
            padding: 2px 6px !important;
        }
        .tag-type-general:hover {
            background-color: var(--accent-color) !important;
            color: var(--bg-primary) !important;
        }

        /* Remove white flashes */
        #page, #app, .application {
            background-color: var(--bg-primary) !important;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }
        ::-webkit-scrollbar-track {
            background: var(--bg-primary);
        }
        ::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 6px;
            border: 3px solid var(--bg-primary);
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--text-muted);
        }

        /* Force background on all elements */
        * {
            background-color: var(--bg-primary) !important;
        }

        /* Reset specific elements that need different colors */
        img, video, canvas, iframe, embed, object,
        a img, .post img, #image-container img,
        [style*="background-image"] {
            background: transparent !important;
            background-color: transparent !important;
        }

        /* Keep transparent gifs/pngs working */
        img[src*=".png"], img[src*=".gif"] {
            background: transparent !important;
        }

        /* Special handling for artist commentary and notes */
        .artist-commentary, .translation, .note-box,
        .note-container, .note-body {
            background-color: var(--bg-tertiary) !important;
            border-left: 3px solid var(--accent-color) !important;
            padding: 12px !important;
            margin: 8px 0 !important;
        }

        /* Footer */
        footer, .footer, #footer {
            background-color: var(--bg-secondary) !important;
            border-top: 1px solid var(--border-color) !important;
            color: var(--text-secondary) !important;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
            body, .container, #content {
                background-color: var(--bg-primary) !important;
            }
        }
    `);
})();