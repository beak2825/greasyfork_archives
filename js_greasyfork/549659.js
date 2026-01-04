// ==UserScript==
// @name         Rubiks AI Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a dark mode toggle to Rubiks.AI, with persistent preference, tailored to specific image elements.
// @author       YouTubeDrawaria
// @match        https://*.rubiks.ai/*
// @icon https://img.freepik.com/free-vector/like-button-thumbs-up-cartoon-style_78370-1159.jpg
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/549659/Rubiks%20AI%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/549659/Rubiks%20AI%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DARK_MODE_CLASS = 'dark-mode';
    const STORAGE_KEY = 'rubiksAIDarkMode';

    // 1. Dark Mode CSS
    // This CSS selectively overrides the existing styles for dark mode.
    // Tailwind-like classes with special characters like [] and / need to be escaped in CSS.
    // For example, `bg-[#f4f4f4]` becomes `bg-\\[\\#f4f4f4\\]` in the JS string literal.
    // `bg-black/50` becomes `bg-black\\/50`.
    const darkModeCss = `
        /* General Dark Mode Variables & Body Background */
        body.dark-mode {
            --primary-colour: #5E9BFF; /* Lighter blue for better contrast in dark mode */
            --text-colour: #E0E0E0;
            --placeholder-colour: #A0A0A0;
            --background-colour: #1A1A1A;
            --border-colour: #333333;
            --hover-colour: #3A3A3A;
            --footer-text-colour: #777777;
            --footer-text-hover-colour: #BBBBBB;

            background: #121212 !important; /* Main app background as per image */
        }

        /* Core Layout Components */
        body.dark-mode .navbar {
            background-color: #222222;
            border-bottom-color: #333333;
        }
        body.dark-mode .title {
            color: #B0B0B0;
        }
        body.dark-mode .sidebar {
            background: #222222;
            border-right-color: #333333;
        }
        body.dark-mode .content {
            background: #1C1C1C; /* Main content area background */
        }

        /* "Rubik's AI" Logo Text */
        body.dark-mode .logo {
            color: var(--text-colour); /* Make the logo text white as requested */
        }

        /* "Get 1-Month Free Premium" Button - Requires specific HTML to target reliably.
           This element is not covered by the provided CSS classes and exact HTML is unknown.
           If it's a general button, its appearance might be influenced by default browser styles or other scripts.
           You might need to inspect its HTML in your browser to find a unique class/ID for precise targeting.
           Example (if it had a class like 'premium-promo-button'):
           body.dark-mode .premium-promo-button {
               background-color: #2D2D2D;
               color: var(--text-colour);
               border-color: #4A4A4A;
           }
        */



        /* "Auto" Dropdown Button Text */
        body.dark-mode .button-container .text-primary {
            color: white !important; /* Make "Auto" text white as requested */
        }
        /* "Auto" button border, if any */
        body.dark-mode .button-container button.dropdown-toggle {
            border-color: #4A4A4A; /* Adjust border color for dark mode */
        }
        body.dark-mode .button-container button.dropdown-toggle:hover {
            background-color: #3A3A3A; /* Adjust hover state */
        }

        /* Send Button (Blue Arrow) */
        body.dark-mode .submit {
            background: var(--primary-colour) !important; /* Make button the dark mode primary blue */
        }
        /* SVG within submit button already has inline color: white from HTML */
        body.dark-mode .submit.active {
            background: #4A8AE6 !important; /* Slightly different shade when active */
        }

        /* General Chat Bubbles / Output Area */
        body.dark-mode * {
            scrollbar-color: #4A4A4A transparent;
        }
        body.dark-mode .text-token-text-primary {
            color: var(--text-colour);
        }
        body.dark-mode .text-token-link {
            color: var(--primary-colour);
        }

        /* Image Grids/Carousels */
        body.dark-mode .border-token-border-light {
            border-color: rgba(255, 255, 255, 0.1);
        }
        body.dark-mode .bg-token-main-surface-tertiary {
            background-color: #3A3A3A;
        }
        body.dark-mode .bg-black\\/50 { /* For the "more images" overlay button */
            background-color: rgba(255, 255, 255, 0.2);
        }
        body.dark-mode .text-white { /* Text on "more images" button */
            color: #E0E0E0;
        }
        body.dark-mode .hover\\:bg-black\\/80:hover {
            background-color: rgba(255, 255, 255, 0.3);
        }
        body.dark-mode .bg-black\\/95 { /* Fullscreen image viewer background */
            background-color: rgba(0, 0, 0, 0.95); /* Keep very dark for image popups */
        }
        body.dark-mode .text-token-text-tertiary,
        body.dark-mode .text-gray-400 {
            color: #A0A0A0;
        }

        /* Bottom Result Cards (e.g., related searches) */
        body.dark-mode .result {
            background: #2D2D2D;
        }
        body.dark-mode .result:hover {
            background: #3A3A3A;
        }
        body.dark-mode .resultheading {
            color: #E0E0E0;
        }
        body.dark-mode .resulttitle {
            color: #A0A0A0;
        }

        /* Skeleton Loading States */
        body.dark-mode .skeleton-line {
            background: linear-gradient(90deg, #3A3A3A, #4A4A4A, #3A3A3A);
        }

        /* Follow-up Questions */
        body.dark-mode .bg-\\[\\#f4f4f4\\] { /* Tailwind class for followup questions */
            background-color: #2D2D2D;
            color: var(--text-colour);
        }

        /* "In the Grey" sections (main app layout) */
        body.dark-mode .sidebar {
            background: #1C1C1C;
        }
        body.dark-mode .content {
            background: #222222;
        }

        /* Navbar specific styles (from second 'NavBar' section in original CSS) */
        body.dark-mode .border-borderMain\\/60 {
            border-color: #333333;
        }
        body.dark-mode .divide-borderMain\\/60 {
            border-color: #333333;
        }
        body.dark-mode .ring-borderMain {
            --tw-ring-color: #333333;
        }
        body.dark-mode .text-textMain {
            color: var(--text-colour);
        }
        body.dark-mode .text-textOff {
            color: #A0A0A0;
        }
        body.dark-mode .md\\:hover\\:text-textOff:hover {
            color: #D0D0D0 !important;
        }
        body.dark-mode .md\\:hover\\:bg-offsetPlus:hover {
            background-color: #3A3A3A !important;
        }
        body.dark-mode .bg-background { /* Navbar background */
            background: #222222;
        }

        /* Bottom Chat Buttons (model selection etc.) */
        body.dark-mode .text-token-text-secondary {
            color: #A0A0A0;
        }
        body.dark-mode .hover\\:bg-token-main-surface-secondary:hover {
            background: #3A3A3A;
        }
        body.dark-mode .modelname {
            color: var(--text-colour);
        }
        body.dark-mode .hover\\:bg-token-main-surface-secondary:hover .modelname {
            color: var(--text-colour);
        }

        /* Sidebar Navigation Items (e.g., "Getting Started") */
        body.dark-mode .getting-started-dialog-contents {
            background: #1C1C1C;
        }
        body.dark-mode .getting-started-dialog-navigation-button {
            color: #E0E0E0;
        }
        body.dark-mode .getting-started-dialog-navigation-button-selected:not(.getting-started-dialog-navigation-button-disabled),
        body.dark-mode .getting-started-dialog-navigation-button-selected:not(.getting-started-dialog-navigation-button-disabled) .iconSVG {
            color: var(--primary-colour);
            fill: var(--primary-colour);
        }
        body.dark-mode .getting-started-dialog-navigation-button-selected:not(.getting-started-dialog-navigation-button-disabled) .getting-started-dialog-navigation-button-icon {
            background: #3A3A3A;
        }
        body.dark-mode .getting-started-dialog-navigation-button:not(.getting-started-dialog-navigation-button-selected):hover .getting-started-dialog-navigation-button-icon {
            background: #333333;
        }

        /* Tables within output */
        body.dark-mode .output table,
        body.dark-mode .output th,
        body.dark-mode .output td {
            border: 1px solid #444444;
        }
        body.dark-mode .output thead tr:first-child {
            background-color: #333333;
            color: var(--text-colour);
        }

        /* Code Blocks */
        body.dark-mode codeblock-header > svg {
            background-color: #555555;
            color: #E0E0E0;
        }
        body.dark-mode .code {
            background-color: #2D2D2D;
        }
        body.dark-mode code {
            background-color: #3A3A3A;
            color: #E0E0E0;
        }
        body.dark-mode code.inline {
            color: var(--text-colour);
            background: #3A3A3A !important;
        }
        body.dark-mode code:not([class]) {
            color: var(--text-colour);
            background-color: #3A3A3A !important;
        }
        /* Highlight.js theme overrides for code syntax highlighting */
        body.dark-mode .hljs{color:#E0E0E0;background:#333333;}
        body.dark-mode .hljs-keyword,.hljs-link,.hljs-literal,.hljs-section,.hljs-selector-tag{color:#E0E0E0;}
        body.dark-mode .hljs-addition,.hljs-attribute,.hljs-built_in,.hljs-bullet,.hljs-name,.hljs-string,.hljs-symbol,.hljs-template-tag,.hljs-template-variable,.hljs-title,.hljs-type,.hljs-variable{color:#FFA0A0;} /* Lighter red/orange for contrast */
        body.dark-mode .hljs-comment,.hljs-deletion,.hljs-meta,.hljs-quote{color:#909090;}
        body.dark-mode .hljs-doctag,.hljs-keyword,.hljs-literal,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-strong,.hljs-title,.hljs-type{font-weight:700;}
        body.dark-mode .hljs-emphasis{font-style:italic;}
        body.dark-mode .hljs-string {
            color: rgb(153, 204, 153);
        }
        body.dark-mode .hljs-built_in {
            color: rgb(204, 153, 204);
        }

        /* Dropdown Menus (e.g., model selection) */
        body.dark-mode #semo {
            background: #2D2D2D;
            border-color: #444444;
            box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 4px;
        }
        body.dark-mode .selectbtn {
            color: var(--text-colour);
        }
        body.dark-mode .selectbtn:hover {
            background: #3A3A3A !important;
        }
        body.dark-mode .selectbtn.active {
            background: #3A3A3A;
        }
        body.dark-mode .selectbtn.active .activeb {
            color: var(--primary-colour);
        }
        body.dark-mode .activeb {
            color: var(--text-colour);
        }

        /* Mobile Navigation Bar */
        @media (max-width: 768px) {
            body.dark-mode .mnav {
                background: #222222;
                border-top-color: #333333;
            }
        }

        /* Copilot / Deep Search Interface */
        body.dark-mode .segment-assistant[data-v-b80c1281] .segment-content {
            background-color: #1C1C1C;
        }
        body.dark-mode .k1-research[data-v-3730e423] {
            --bg: linear-gradient(180deg, #2D2D2D 21.69%, #1C1C1C 100%);
            --done-bg: #2D2D2D;
            /* Update SVG background for done icon with new primary color and background for checkmark */
            --show-finish-icon: url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2740%27%20height=%2740%27%20fill=%27none%27%3e%3ccircle%20cx=%2720%27%20cy=%2720%27%20r=%2715%27%20fill=%27%235E9BFF%27/%3e%3cpath%20fill=%27%231A1A1A%27%20d=%27M18%2025.2l-5.6-5.6a.94.94%200%200%201%200-1.34l1.34-1.34a.94.94%200%200%201%201.34%200l3.9%203.9%208.4-8.4a.94.94%200%200%201%201.34%200l1.34%201.34a.94.94%200%200%201%200%201.34L18%2025.2Z%27/%3e%3c/svg%3e'); /* Larger SVG if needed, adjust path and fill */
        }
        body.dark-mode .k1-research-title[data-v-3730e423] {
            color: var(--text-colour);
        }
        body.dark-mode .researchItem[data-v-86b76042] {
            --title-bg-hover: #3A3A3A;
            --done-icon: var(--primary-colour);
            --empty-icon: #555555;
            --target-bg: #3A3A3A;
            --target-color: #D0D0D0;
            --target-bg-hover: #4A4A4A;
            --loading-text: #888888;
            --loading-block: #E0E0E0;
            --line-bg: linear-gradient(180deg, #555555 0%, rgba(85, 85, 85, .2) 100%);
            --expand-text-color: #888888;
            --expand-text-hover-color: #E0E0E0;
            --tag-color: var(--primary-colour);
            --tag-bg-color: rgba(94, 155, 255, .2);
            --caret-bg: #A0A0A0;
        }
        body.dark-mode .researchItem-status-icon[data-v-86b76042]:before {
            background-color: var(--done-icon);
        }
        body.dark-mode .researchItem-status.is-done .researchItem-status-icon[data-v-86b76042]:before {
            /* Updated SVG for active icon: blue circle, dark checkmark */
            background: url("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='none'%3e%3ccircle%20cx=%278%27%20cy=%278%27%20r=%275%27%20fill=%27%235E9BFF%27/%3e%3cpath%20fill=%27%23222222%27%20d=%27m7.279%209.79-1.6-1.6a.266.266%200%200%201%200-.378l.377-.377a.266.266%200%200%201%20.377%200l1.034%201.034%202.368-2.367a.266.266%200%200%201%20.377%200l.377.377a.266.266%200%200%201%200%20.377L7.656%209.789a.266.266%200%200%201-.377%200Z%27/%3e%3c/svg%3e") no-repeat center center;
        }
        body.dark-mode .researchItem-status[data-v-86b76042]:after {
            background: var(--line-bg);
        }
        body.dark-mode .researchItem-status.is-done[data-v-86b76042]:after {
            background: var(--empty-icon);
        }
        body.dark-mode .researchItem-summary-text[data-v-86b76042] {
            color: var(--text-colour);
        }
        body.dark-mode .researchItem-summary-action[data-v-86b76042] {
            background-color: var(--caret-bg);
            /* Updated SVG mask for caret icon: dark grey fill */
            -webkit-mask: url("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='20'%20height='20'%20fill='none'%3e%3cpath%20fill='%23A0A0A0'%20fill-rule='evenodd'%20d='M6.01%207.7944a.595.595%200%200%201%20.8414%200l3.1493%203.1493L13.15%207.7944a.595.595%200%201%201%20.8414.8414l-3.57%203.57a.595.595%200%200%201-.8414%200l-3.57-3.57a.595.595%200%200%201%200-.8414Z'%20clip-rule='evenodd'%20opacity='.7'/%3e%3c/svg%3e") no-repeat center center;
            mask: url("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='20'%20height='20'%20fill='none'%3e%3cpath%20fill='%23A0A0A0'%20fill-rule='evenodd'%20d='M6.01%207.7944a.595.595%200%200%201%20.8414%200l3.1493%203.1493L13.15%207.7944a.595.595%200%201%201%20.8414.8414l-3.57%203.57a.595.595%200%200%201-.8414%200l-3.57-3.57a.595.595%200%200%201%200-.8414Z'%20clip-rule='evenodd'%20opacity='.7'/%3e%3c/svg%3e") no-repeat center center;
        }
        body.dark-mode .researchItem-target-item[data-v-86b76042] {
            background: var(--target-bg);
            color: var(--target-color);
        }
        body.dark-mode .researchItem-target-item[data-v-86b76042]:hover {
            background-color: var(--target-bg-hover);
        }
        body.dark-mode .researchItem-target-item.has-search-icon[data-v-86b76042]:before {
            /* Updated SVG mask for search icon: dark grey stroke */
            -webkit-mask: url("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='14'%20height='14'%20fill='none'%3e%3cpath%20stroke='%23A0A0A0'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='1.167'%20d='m8.102%208.102%203.273%203.273M5.833%209.042a3.208%203.208%200%201%200%200-6.417%203.208%203.208%200%200%200%200%206.417Z'/%3e%3c/svg%3e") no-repeat center center;
            mask: url("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='14'%20height='14'%20fill='none'%3e%3cpath%20stroke='%23A0A0A0'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='1.167'%20d='m8.102%208.102%203.273%203.273M5.833%209.042a3.208%203.208%200%201%200%200-6.417%203.208%203.208%200%200%200%200%206.417Z'/%3e%3c/svg%3e") no-repeat center center;
        }
        body.dark-mode .researchItem-text[data-v-86b76042] {
            --text-primary: var(--text-colour);
        }
        body.dark-mode :root .markdown[data-v-53cd9be5] {
            --table-border-color: #444444;
            --table-header-bg: #333333;
            --text-tertiary: #A0A0A0;
        }
        body.dark-mode .markdown {
            color: var(--text-colour);
        }
        body.dark-mode .researchItem-result-item[data-v-86b76042] {
            background: var(--target-bg);
            color: var(--target-color);
        }
        body.dark-mode .researchItem-result-item[data-v-86b76042]:hover {
            background-color: var(--target-bg-hover);
        }

        /* Deep Search specific elements */
        body.dark-mode .r-x572qd { /* Background for deep search container */
            background-color: #2D2D2D;
        }
        body.dark-mode .r-1hmrgzh { /* Chevron color */
            color: #A0A0A0;
        }
        body.dark-mode .r-14j79pv { /* Text in deep search items */
            color: #D0D0D0;
        }
        body.dark-mode .r-j0xqu1 { /* Spinner/line color */
            color: #555555;
        }
        body.dark-mode .r-1bimlpy { /* Vertical line in deep search */
            background-color: #555555;
        }
        body.dark-mode .r-1soe94j { /* Small square icon */
            background-color: #A0A0A0;
        }
        body.dark-mode a.css-175oi2r.r-18kxxzh.r-1wbh5a2.r-dnmrzs.r-1udh08x.r-1udbk01.r-1loqt21.r-1ny4l3l {
            color: var(--text-colour); /* Ensure links are visible */
        }
        body.dark-mode a.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3.r-1loqt21 {
            color: var(--primary-colour); /* Ensure links are visible */
        }
        body.dark-mode .thinkingText {
            border-left-color: #555555;
            color: #D0D0D0;
            background-color: #2D2D2D;
        }

        /* Pricing Modal */
        body.dark-mode .s4d5f6 { /* modal-overlay */
            background-color: rgba(0, 0, 0, 0.85);
        }
        body.dark-mode .k1l2m3 { /* modal-content */
            background-color: #1C1C1C;
            color: var(--text-colour);
        }
        body.dark-mode .n4p5q6:hover {
            background-color: #3A3A3A;
        }
        body.dark-mode .n4p5q6 svg {
            stroke: #A0A0A0;
        }
        body.dark-mode .n4p5q6:hover svg {
            stroke: var(--text-colour);
        }
        body.dark-mode .r7s8t9 {
            color: var(--text-colour);
        }
        body.dark-mode .u1v2w3 { /* pricing-card */
            background-color: #2D2D2D;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15);
        }
        body.dark-mode .u1v2w3.x4y5z6 { /* pricing-card.featured */
            border-color: var(--primary-colour);
        }
        body.dark-mode .k7l8m9 { /* plan-name */
            color: var(--text-colour);
        }
        body.dark-mode .n1p2q3 { /* price */
            color: var(--primary-colour);
        }
        body.dark-mode .r4s5t6 { /* section-title */
            color: #A0A0A0;
        }
        body.dark-mode .u7v8w9 { /* popular-badge */
            color: #D0D0D0;
            background-color: #3A3A3A;
            border-color: #4A4A4A;
        }
        body.dark-mode .x1y2z3 { /* cta-button */
            background-color: var(--primary-colour);
            color: #1A1A1A; /* Dark text on primary button */
        }
        body.dark-mode .x1y2z3:hover:not(:disabled) {
            background-color: #4A8AE6; /* Slightly lighter primary on hover */
        }
        body.dark-mode .c4d5e6, .f7g8h9, .j1k2l3 { /* model-item, feature-item, included-features */
            color: var(--text-colour);
        }
        body.dark-mode .q7r8s9, .j1k2l3 span {
            color: var(--text-colour);
        }
        body.dark-mode .t1u2v3, .w4x5y6 {
            color: #A0A0A0;
        }
        body.dark-mode .t1u2v3.z7a8b9 {
            color: #FFB080; /* Darker orange for exclusive */
        }
        body.dark-mode .o9p1q2 { /* feature-icon */
            color: #A0A0A0;
        }
    `;

    // Inject the dark mode CSS into the page
    GM_addStyle(darkModeCss);

    /**
     * Toggles the dark mode class on the body and saves the preference.
     * @param {boolean} isDark - True to enable dark mode, false to disable.
     */
    function setDarkMode(isDark) {
        if (isDark) {
            document.body.classList.add(DARK_MODE_CLASS);
            localStorage.setItem(STORAGE_KEY, 'dark');
        } else {
            document.body.classList.remove(DARK_MODE_CLASS);
            localStorage.setItem(STORAGE_KEY, 'light');
        }
        // Update the icon appearance immediately
        updateToggleButtonIcon();
    }

    /**
     * Updates the moon/sun icon based on the current dark mode state.
     */
    function updateToggleButtonIcon() {
        const toggleButton = document.getElementById('rubiks-ai-dark-mode-toggle');
        if (!toggleButton) return;

        const isDark = document.body.classList.contains(DARK_MODE_CLASS);
        const svgPath = toggleButton.querySelector('path');
        const visuallyHiddenSpan = toggleButton.querySelector('.visually-hidden');

        if (isDark) {
            svgPath.setAttribute('d', 'M12 3v1m0 16v1m9-9h1M3 12h1m1.83-5.07l.7-.7a1 1 0 0 1 1.41 0l.7.7a1 1 0 0 1 0 1.41l-.7.7a1 1 0 0 1-1.41 0l-.7-.7a1 1 0 0 1 0-1.41zM18.17 18.17l-.7.7a1 1 0 0 1-1.41 0l-.7-.7a1 1 0 0 1 0-1.41l.7-.7a1 1 0 0 1 1.41 0l.7.7a1 1 0 0 1 0 1.41zM4.93 18.17l.7-.7a1 1 0 0 0 0-1.41l-.7-.7a1 1 0 0 0-1.41 0l-.7.7a1 1 0 0 0 0 1.41l.7.7a1 1 0 0 0 1.41 0zM19.07 4.93l-.7-.7a1 1 0 0 0-1.41 0l-.7.7a1 1 0 0 0 0 1.41l.7.7a1 1 0 0 0 1.41 0l.7-.7a1 1 0 0 0 0-1.41z'); // Sun icon
            svgPath.setAttribute('fill', '#E0E0E0');
            svgPath.setAttribute('stroke', '#E0E0E0');
            visuallyHiddenSpan.textContent = 'Toggle Light Mode';
        } else {
            svgPath.setAttribute('d', 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'); // Moon icon
            svgPath.setAttribute('fill', 'none');
            svgPath.setAttribute('stroke', '#9B9B9B');
            visuallyHiddenSpan.textContent = 'Toggle Dark Mode';
        }
    }

    /**
     * Adds the dark mode toggle button to the UI.
     * It tries to find the sidebar first, then the mobile navigation bar.
     */
    function addToggleButton() {
        if (document.getElementById('rubiks-ai-dark-mode-toggle')) {
            // Button already exists
            return;
        }

        let targetContainer = document.querySelector('.sidebar .icon-container');
        if (!targetContainer) {
            // Fallback for mobile or if .icon-container is not present
            targetContainer = document.querySelector('.mnav');
        }
        if (!targetContainer) {
            targetContainer = document.querySelector('.sidebar');
        }

        if (targetContainer) {
            const toggleButton = document.createElement('div');
            toggleButton.id = 'rubiks-ai-dark-mode-toggle'; // Add an ID for easy lookup
            toggleButton.classList.add('sicon'); // Re-use existing styling
            toggleButton.style.cursor = 'pointer';
            toggleButton.style.marginTop = '20px'; // Add some space

            // SVG for the icon (will be updated by updateToggleButtonIcon)
            toggleButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path></path>
                </svg>
                <span class="visually-hidden"></span>
            `;

            toggleButton.addEventListener('click', () => {
                const isDark = document.body.classList.contains(DARK_MODE_CLASS);
                setDarkMode(!isDark);
            });

            targetContainer.appendChild(toggleButton);
            updateToggleButtonIcon(); // Initial update of the icon

            // Observe changes to the body's class attribute to keep the icon in sync
            // (e.g., if another script or dev tools change the mode)
            const observer = new MutationObserver(updateToggleButtonIcon);
            observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        } else {
            console.warn('Rubiks AI Dark Mode: Could not find a suitable container (.sidebar .icon-container, .mnav, or .sidebar) to add the dark mode toggle.');
        }
    }

    // Apply saved preference on page load
    const savedMode = localStorage.getItem(STORAGE_KEY);
    if (savedMode === 'dark') {
        setDarkMode(true);
    } else if (savedMode === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // If no preference saved, check system preference and apply dark mode if system prefers it
        setDarkMode(true);
    } else {
        // Default to light mode if no preference or explicitly set to light
        setDarkMode(false);
    }

    // Use a MutationObserver to ensure the button is added once the target element is available
    const observer = new MutationObserver((mutationsList, observer) => {
        const sidebar = document.querySelector('.sidebar');
        const mnav = document.querySelector('.mnav');
        if (sidebar || mnav) {
            addToggleButton();
            observer.disconnect(); // Stop observing once the button is added
        }
    });
    // Start observing the body for child list changes (new elements being added)
    observer.observe(document.body, { childList: true, subtree: true });

    // Also try adding on load event as a fallback for simpler pages
    window.addEventListener('load', addToggleButton);

})();