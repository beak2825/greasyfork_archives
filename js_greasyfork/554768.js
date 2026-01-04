// ==UserScript==
// @name         Cheat Engine Forum Modernizer - Dark Theme Compact
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Modern dark theme for Cheat Engine forum with compact buttons
// @author       Kakuzu
// @match        https://forum.cheatengine.org/*
// @grant        none
// @icon         https://i.ibb.co/YFgmRWL8/CEFM.png
// @downloadURL https://update.greasyfork.org/scripts/554768/Cheat%20Engine%20Forum%20Modernizer%20-%20Dark%20Theme%20Compact.user.js
// @updateURL https://update.greasyfork.org/scripts/554768/Cheat%20Engine%20Forum%20Modernizer%20-%20Dark%20Theme%20Compact.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add modern font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Modern Dark Theme CSS styles with compact buttons
    const modernStyles = `
        /* Reset and base styles - Dark Theme */
        body {
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%) fixed !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            color: #e2e8f0 !important;
            line-height: 1.6 !important;
        }

        /* Main container */
        .bodyline {
            background: #1e293b !important;
            border: none !important;
            border-radius: 16px !important;
            box-shadow: 0 25px 50px rgba(0,0,0,0.3) !important;
            margin: 20px auto !important;
            max-width: 1400px !important;
            padding: 0 !important;
        }

        /* Custom Logo */
        .bodyline img[src*="logo_phpBB.gif"] {
            content: url("https://i.ibb.co/YFgmRWL8/CEFM.png") !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
            transition: transform 0.3s ease !important;
            max-width: 250px !important;
            height: auto !important;
        }

        .bodyline img[src*="logo_phpBB.gif"]:hover {
            transform: scale(1.05) !important;
        }

        /* Header improvements */
        .maintitle {
            font-size: 2.5rem !important;
            font-weight: 700 !important;
            color: #60a5fa !important;
            text-shadow: 0 2px 10px rgba(96, 165, 250, 0.3) !important;
            letter-spacing: -0.5px !important;
        }

        /* Main menu navigation - Compact horizontal layout */
        .mainmenu {
            font-size: 0.8rem !important;
            font-weight: 500 !important;
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 4px !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 8px 0 !important;
        }

        .mainmenu a {
            background: linear-gradient(135deg, #334155, #475569) !important;
            padding: 6px 12px !important;
            border-radius: 8px !important;
            margin: 1px !important;
            transition: all 0.2s ease !important;
            border: 1px solid #475569 !important;
            display: inline-flex !important;
            align-items: center !important;
            text-decoration: none !important;
            white-space: nowrap !important;
            color: #e2e8f0 !important;
            box-shadow: 0 1px 4px rgba(0,0,0,0.2) !important;
            font-size: 0.75rem !important;
            min-height: auto !important;
            line-height: 1.2 !important;
        }

        .mainmenu a:hover {
            background: linear-gradient(135deg, #60a5fa, #3b82f6) !important;
            color: white !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 3px 12px rgba(59, 130, 246, 0.4) !important;
            border-color: #3b82f6 !important;
        }

        .mainmenu img {
            margin-right: 4px !important;
            filter: brightness(0) invert(1) !important;
            width: 10px !important;
            height: 10px !important;
        }

        /* Fix table cell layout for main menu */
        td[align="center"][valign="top"] {
            display: block !important;
            width: 100% !important;
            padding: 5px 0 !important;
        }

        /* Compact navigation breadcrumb */
        .nav {
            font-weight: 500 !important;
            font-size: 0.75rem !important;
        }

        .nav a {
            background: linear-gradient(135deg, #475569, #374151) !important;
            padding: 4px 10px !important;
            border-radius: 6px !important;
            margin: 0 2px !important;
            transition: all 0.2s ease !important;
            color: #e2e8f0 !important;
            text-decoration: none !important;
            border: 1px solid #4b5563 !important;
            font-size: 0.75rem !important;
            display: inline-block !important;
        }

        .nav a:hover {
            background: linear-gradient(135deg, #60a5fa, #3b82f6) !important;
            color: white !important;
            transform: translateY(-1px) !important;
        }

        /* Category headers - Compact layout */
        .catLeft, .cattitle {
            background: linear-gradient(135deg, #7e22ce, #6b21a8) !important;
            color: white !important;
            font-size: 1.1rem !important;
            font-weight: 700 !important;
            padding: 12px 20px !important;
            border: none !important;
            border-radius: 10px !important;
            margin: 8px 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            height: auto !important;
            box-shadow: 0 3px 10px rgba(126, 34, 206, 0.3) !important;
        }

        .cattitle a {
            color: white !important;
            text-decoration: none !important;
            text-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
        }

        .cattitle a:hover {
            color: #fbbf24 !important;
        }

        .rowpic {
            display: none !important;
        }

        /* Profile page improvements - Fixed layout */
        table.forumline[width="100%"] {
            background: transparent !important;
            border: none !important;
            border-spacing: 0 !important;
        }

        .thHead {
            background: linear-gradient(135deg, #059669, #047857) !important;
            color: white !important;
            border-radius: 10px 10px 0 0 !important;
            border: none !important;
            font-size: 1.1rem !important;
            padding: 16px !important;
            text-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
        }

        /* Profile section headers - Same size and font */
        .catLeft, .catRight {
            background: linear-gradient(135deg, #7e22ce, #6b21a8) !important;
            color: white !important;
            font-size: 1.1rem !important;
            font-weight: 700 !important;
            padding: 12px 20px !important;
            border: none !important;
            border-radius: 10px !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 28px !important;
            box-shadow: 0 3px 10px rgba(126, 34, 206, 0.3) !important;
            text-align: center !important;
        }

        .catRight {
            background: linear-gradient(135deg, #7e22ce, #6b21a8) !important;
            justify-content: center !important;
        }

        .catLeft .gen, .catRight .gen {
            color: white !important;
            font-size: 1.1rem !important;
            font-weight: 700 !important;
            text-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
        }

        /* Fix profile table layout */
        table.forumline[width="100%"] > tbody > tr:nth-child(3) {
            display: flex !important;
            flex-direction: column !important;
        }

        table.forumline[width="100%"] > tbody > tr:nth-child(3) > td {
            width: 100% !important;
            display: block !important;
        }

        /* Avatar section - Move title below avatar */
        td.row1[height="6"][valign="top"] {
            background: linear-gradient(135deg, #334155, #1e293b) !important;
            border: 1px solid #475569 !important;
            border-radius: 10px !important;
            padding: 25px !important;
            text-align: center !important;
            height: auto !important;
            margin: 10px 0 !important;
            width: 100% !important;
            display: block !important;
            box-sizing: border-box !important;
            order: 1 !important;
        }

        td.row1[height="6"][valign="top"] img {
            max-width: 140px !important;
            max-height: 140px !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4) !important;
            border: 3px solid #60a5fa !important;
            margin-bottom: 15px !important;
        }

        td.row1[height="6"][valign="top"] .postdetails {
            background: linear-gradient(135deg, #7e22ce, #6b21a8) !important;
            color: white !important;
            padding: 10px 20px !important;
            border-radius: 20px !important;
            font-weight: 600 !important;
            font-size: 0.85rem !important;
            display: inline-block !important;
            margin-top: 10px !important;
            box-shadow: 0 2px 8px rgba(126, 34, 206, 0.3) !important;
            order: 2 !important;
        }

        /* Profile info section */
        td.row1[valign="top"][rowspan] {
            background: linear-gradient(135deg, #334155, #1e293b) !important;
            border: 1px solid #475569 !important;
            border-radius: 10px !important;
            padding: 25px !important;
            margin: 10px 0 !important;
            width: 100% !important;
            display: block !important;
            box-sizing: border-box !important;
            order: 3 !important;
        }

        td.row1[valign="top"][rowspan] table {
            width: 100% !important;
            border-collapse: separate !important;
            border-spacing: 10px !important;
        }

        td.row1[valign="top"][rowspan] td {
            background: #1e293b !important;
            padding: 12px 15px !important;
            border-radius: 8px !important;
            border: 1px solid #475569 !important;
            transition: all 0.3s ease !important;
        }

        td.row1[valign="top"][rowspan] td:hover {
            background: #475569 !important;
            transform: translateY(-2px) !important;
        }

        td.row1[valign="top"][rowspan] td[align="right"] {
            background: linear-gradient(135deg, #475569, #374151) !important;
            color: #e2e8f0 !important;
            font-weight: 600 !important;
            min-width: 140px !important;
            text-align: right !important;
        }

        td.row1[valign="top"][rowspan] td[width="100%"] {
            background: #1e293b !important;
            color: #e2e8f0 !important;
            font-weight: 500 !important;
        }

        /* Contact section */
        td.catLeft[align="center"] {
            background: linear-gradient(135deg, #f59e0b, #d97706) !important;
            color: white !important;
            border-radius: 10px !important;
            margin: 15px 0 8px 0 !important;
            padding: 12px !important;
            height: 28px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            order: 4 !important;
        }

        /* Contact info table */
        td.row1[valign="top"]:not([rowspan]) {
            background: linear-gradient(135deg, #334155, #1e293b) !important;
            border: 1px solid #475569 !important;
            border-radius: 10px !important;
            padding: 20px !important;
            margin: 10px 0 !important;
            width: 100% !important;
            display: block !important;
            box-sizing: border-box !important;
            order: 5 !important;
        }

        td.row1[valign="top"]:not([rowspan]) table {
            width: 100% !important;
            border-collapse: separate !important;
            border-spacing: 8px !important;
        }

        /* Modern Google Search Results */
        .gsc-results {
            background: linear-gradient(135deg, #334155, #1e293b) !important;
            border-radius: 12px !important;
            padding: 20px !important;
            margin-top: 20px !important;
            border: 1px solid #475569 !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
        }

        .gsc-webResult {
            background: #1e293b !important;
            border: 1px solid #475569 !important;
            border-radius: 10px !important;
            margin-bottom: 16px !important;
            padding: 20px !important;
            transition: all 0.3s ease !important;
        }

        .gsc-webResult:hover {
            background: #475569 !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 25px rgba(0,0,0,0.4) !important;
            border-color: #60a5fa !important;
        }

        .gs-title {
            color: #60a5fa !important;
            font-size: 1.1rem !important;
            font-weight: 600 !important;
            text-decoration: none !important;
            line-height: 1.4 !important;
        }

        .gs-title:hover {
            color: #fbbf24 !important;
            text-decoration: underline !important;
        }

        .gs-snippet {
            color: #cbd5e1 !important;
            font-size: 0.9rem !important;
            line-height: 1.5 !important;
            margin: 8px 0 !important;
        }

        .gs-visibleUrl {
            color: #94a3b8 !important;
            font-size: 0.8rem !important;
            margin-bottom: 8px !important;
        }

        .gsc-cursor-page {
            background: linear-gradient(135deg, #475569, #374151) !important;
            color: #e2e8f0 !important;
            border: 1px solid #475569 !important;
            border-radius: 6px !important;
            padding: 8px 12px !important;
            margin: 0 4px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }

        .gsc-cursor-page:hover {
            background: linear-gradient(135deg, #60a5fa, #3b82f6) !important;
            color: white !important;
            transform: translateY(-1px) !important;
        }

        .gsc-cursor-current-page {
            background: linear-gradient(135deg, #7e22ce, #6b21a8) !important;
            color: white !important;
            border-color: #7e22ce !important;
        }

        .gcsc-find-more-on-google {
            background: linear-gradient(135deg, #059669, #047857) !important;
            border-radius: 8px !important;
            padding: 12px 16px !important;
            margin-top: 20px !important;
            color: white !important;
            text-decoration: none !important;
            display: inline-flex !important;
            align-items: center !important;
            transition: all 0.3s ease !important;
        }

        .gcsc-find-more-on-google:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 15px rgba(5, 150, 105, 0.4) !important;
        }

        /* Forum table styling */
        .forumline {
            background: transparent !important;
            border: none !important;
            border-collapse: separate !important;
            border-spacing: 0 8px !important;
        }

        th {
            background: linear-gradient(135deg, #475569, #334155) !important;
            color: #f1f5f9 !important;
            font-weight: 600 !important;
            font-size: 0.9rem !important;
            border: none !important;
            padding: 14px !important;
            height: auto !important;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3) !important;
        }

        th.thCornerL {
            border-radius: 10px 0 0 10px !important;
        }

        th.thCornerR {
            border-radius: 0 10px 10px 0 !important;
        }

        /* Forum rows - Dark Cards */
        td.row1, td.row2, td.row3 {
            background: linear-gradient(135deg, #334155, #1e293b) !important;
            border: 1px solid #475569 !important;
            padding: 18px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 3px 15px rgba(0,0,0,0.25) !important;
            border-radius: 10px !important;
            margin-bottom: 8px !important;
            color: #e2e8f0 !important;
        }

        td.row1:hover, td.row2:hover, td.row3:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 25px rgba(0,0,0,0.4) !important;
            border-color: #60a5fa !important;
            background: linear-gradient(135deg, #475569, #334155) !important;
        }

        /* Forum links */
        .forumlink a {
            font-size: 1.1rem !important;
            font-weight: 600 !important;
            color: #60a5fa !important;
            text-decoration: none !important;
            transition: all 0.3s ease !important;
            text-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
        }

        .forumlink a:hover {
            color: #fbbf24 !important;
            text-shadow: 0 2px 6px rgba(251, 191, 36, 0.4) !important;
        }

        .genmed {
            color: #cbd5e1 !important;
            font-size: 0.9rem !important;
            line-height: 1.5 !important;
        }

        /* Stats and numbers */
        .gensmall {
            font-size: 0.8rem !important;
            color: #94a3b8 !important;
        }

        /* Last post info */
        td.row2 .gensmall a {
            color: #60a5fa !important;
            font-weight: 500 !important;
            text-decoration: none !important;
        }

        td.row2 .gensmall a:hover {
            color: #fbbf24 !important;
        }

        /* Google Search Customization for Dark Theme */
        .gsc-control-cse {
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
        }

        .gsc-search-box {
            margin: 16px 0 !important;
        }

        .gsc-input {
            background: #1e293b !important;
            border: 2px solid #475569 !important;
            border-radius: 8px !important;
            color: #e2e8f0 !important;
            padding: 10px !important;
            font-size: 0.9rem !important;
        }

        .gsc-input:focus {
            border-color: #60a5fa !important;
            box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2) !important;
        }

        .gsc-search-button {
            background: linear-gradient(135deg, #60a5fa, #3b82f6) !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 10px 20px !important;
            margin-left: 8px !important;
            color: white !important;
            font-weight: 600 !important;
            font-size: 0.85rem !important;
        }

        .gsc-search-button:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 3px 12px rgba(59, 130, 246, 0.4) !important;
        }

        /* Information box on search page */
        table[width="100%"][cellspacing="1"][cellpadding="4"] {
            background: transparent !important;
            border: none !important;
        }

        table[width="100%"][cellspacing="1"][cellpadding="4"] .row1 {
            background: linear-gradient(135deg, #334155, #1e293b) !important;
            border-radius: 10px !important;
            padding: 20px !important;
            text-align: center !important;
            border: 1px solid #475569 !important;
            color: #e2e8f0 !important;
        }

        /* Login form */
        form[method="post"] table {
            background: linear-gradient(135deg, #334155, #1e293b) !important;
            border-radius: 10px !important;
            border: 1px solid #475569 !important;
        }

        input[type="text"], input[type="password"] {
            background: #1e293b !important;
            border: 1px solid #475569 !important;
            border-radius: 6px !important;
            padding: 8px 12px !important;
            font-size: 0.85rem !important;
            transition: all 0.2s ease !important;
            color: #e2e8f0 !important;
        }

        input[type="text"]:focus, input[type="password"]:focus {
            border-color: #60a5fa !important;
            box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2) !important;
            outline: none !important;
        }

        input[type="submit"] {
            background: linear-gradient(135deg, #10b981, #059669) !important;
            color: white !important;
            border: none !important;
            padding: 8px 20px !important;
            border-radius: 6px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            font-size: 0.85rem !important;
        }

        input[type="submit"]:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 3px 12px rgba(16, 185, 129, 0.4) !important;
        }

        /* Who is online section */
        .catHead {
            background: linear-gradient(135deg, #f59e0b, #d97706) !important;
            color: white !important;
            border-radius: 10px 10px 0 0 !important;
            border: none !important;
            padding: 12px !important;
        }

        /* Footer */
        .copyright {
            color: #94a3b8 !important;
            font-size: 0.8rem !important;
        }

        .copyright a {
            color: #60a5fa !important;
            text-decoration: none !important;
        }

        .copyright a:hover {
            color: #fbbf24 !important;
        }

        /* Icons and images */
        img[src*="folder_big"], img[src*="folder_new_big"] {
            filter: brightness(0) invert(1) !important;
            border-radius: 4px !important;
        }

        /* Responsive improvements */
        @media (max-width: 768px) {
            .bodyline {
                margin: 10px !important;
                border-radius: 12px !important;
            }

            .maintitle {
                font-size: 2rem !important;
            }

            td.row1, td.row2, td.row3 {
                padding: 14px !important;
            }

            .forumlink a {
                font-size: 1rem !important;
            }

            .mainmenu {
                flex-direction: row !important;
                flex-wrap: wrap !important;
                gap: 3px !important;
            }

            .mainmenu a {
                padding: 5px 8px !important;
                font-size: 0.7rem !important;
                flex: 1 !important;
                min-width: 0 !important;
                justify-content: center !important;
                text-align: center !important;
            }

            .catLeft, .cattitle {
                padding: 10px 16px !important;
                font-size: 1rem !important;
            }

            .nav a {
                padding: 3px 8px !important;
                font-size: 0.7rem !important;
            }

            /* Adjust logo size on mobile */
            .bodyline img[src*="logo_phpBB.gif"] {
                max-width: 200px !important;
            }

            /* Profile mobile adjustments */
            td.row1[height="6"][valign="top"] img {
                max-width: 120px !important;
                max-height: 120px !important;
            }

            td.row1[valign="top"][rowspan] table {
                border-spacing: 6px !important;
            }

            td.row1[valign="top"][rowspan] td {
                padding: 8px 10px !important;
            }

            .catLeft, .catRight {
                font-size: 1rem !important;
                padding: 10px 16px !important;
            }

            /* Search results mobile */
            .gsc-webResult {
                padding: 16px !important;
            }

            .gs-title {
                font-size: 1rem !important;
            }
        }

        @media (max-width: 480px) {
            .mainmenu a {
                font-size: 0.65rem !important;
                padding: 4px 6px !important;
            }

            .mainmenu img {
                width: 8px !important;
                height: 8px !important;
                margin-right: 3px !important;
            }

            .nav a {
                padding: 2px 6px !important;
                font-size: 0.65rem !important;
            }

            .bodyline img[src*="logo_phpBB.gif"] {
                max-width: 150px !important;
            }

            td.row1[height="6"][valign="top"] img {
                max-width: 100px !important;
                max-height: 100px !important;
            }

            td.row1[valign="top"][rowspan] td[align="right"] {
                min-width: 120px !important;
                font-size: 0.75rem !important;
            }

            .catLeft, .catRight {
                font-size: 0.9rem !important;
                padding: 8px 12px !important;
            }
        }

        /* Smooth animations */
        * {
            transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease !important;
        }

        /* Additional fixes for search page layout */
        td[align="center"] span.gen {
            font-size: 1rem !important;
            color: #e2e8f0 !important;
            line-height: 1.6 !important;
        }

        /* Center align the Google search box */
        gcse\:search {
            display: block !important;
            text-align: center !important;
            margin: 16px 0 !important;
        }

        /* Code and quote blocks for dark theme */
        .code, .quote {
            background: #1e293b !important;
            border: 1px solid #475569 !important;
            border-radius: 6px !important;
            color: #e2e8f0 !important;
            padding: 10px !important;
        }

        .code {
            color: #fbbf24 !important;
        }
    `;

    // Add the styles to the page
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modernStyles;
    document.head.appendChild(styleSheet);

    // JavaScript enhancements
    document.addEventListener('DOMContentLoaded', function() {
        // Add loading animation
        const tables = document.querySelectorAll('table.forumline');
        tables.forEach(table => {
            table.style.opacity = '0';
            table.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                table.style.opacity = '1';
            }, 50);
        });

        // Enhance category headers
        const categoryHeaders = document.querySelectorAll('.catLeft, .cattitle');
        categoryHeaders.forEach(header => {
            header.style.display = 'flex';
            header.style.alignItems = 'center';
            header.style.justifyContent = 'flex-start';
        });

        // Fix main menu layout
        const mainMenuCells = document.querySelectorAll('td[align="center"][valign="top"]');
        mainMenuCells.forEach(cell => {
            cell.style.display = 'block';
            cell.style.width = '100%';
        });

        // Replace logo with custom one
        const logo = document.querySelector('img[src*="logo_phpBB.gif"]');
        if (logo) {
            logo.src = 'https://i.ibb.co/YFgmRWL8/CEFM.png';
            logo.style.maxWidth = '250px';
            logo.style.height = 'auto';
        }

        // Fix profile page layout
        if (window.location.href.includes('profile.php')) {
            setTimeout(() => {
                const profileTable = document.querySelector('table.forumline[width="100%"]');
                if (profileTable) {
                    // Convert table rows to block layout
                    const rows = profileTable.querySelectorAll('tbody > tr');
                    rows.forEach(row => {
                        if (row.cells.length > 0) {
                            row.style.display = 'block';
                            row.style.width = '100%';

                            Array.from(row.cells).forEach(cell => {
                                cell.style.display = 'block';
                                cell.style.width = '100%';
                                cell.style.boxSizing = 'border-box';
                            });
                        }
                    });

                    // Ensure profile headers have same styling
                    const catLeft = document.querySelector('.catLeft');
                    const catRight = document.querySelector('.catRight');

                    if (catLeft && catRight) {
                        catRight.style.background = catLeft.style.background;
                        catRight.style.fontSize = catLeft.style.fontSize;
                        catRight.style.padding = catLeft.style.padding;
                        catRight.style.height = catLeft.style.height;
                        catRight.style.display = 'flex';
                        catRight.style.alignItems = 'center';
                        catRight.style.justifyContent = 'center';
                    }
                }
            }, 100);
        }

        // Add subtle improvements to search page
        if (window.location.href.includes('search.php')) {
            const infoText = document.querySelector('td.row1 span.gen');
            if (infoText) {
                infoText.innerHTML = infoText.innerHTML.replace(
                    'Use google search for the best results:',
                    '<strong>🔍 Enhanced Search</strong><br>Use Google search for the best results:'
                );
            }
        }

        console.log('Cheat Engine Forum Modernizer - Compact Dark Theme by Kakuzu loaded successfully!');
    });

    // Additional function to enhance Google Search results for dark theme
    function enhanceGoogleSearch() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    const googleSearch = document.querySelector('.gsc-results');
                    if (googleSearch) {
                        googleSearch.style.borderRadius = '12px';
                        googleSearch.style.overflow = 'hidden';
                    }

                    // Style individual search results
                    const searchResults = document.querySelectorAll('.gsc-webResult');
                    searchResults.forEach(result => {
                        result.style.borderRadius = '10px';
                        result.style.marginBottom = '16px';
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize Google Search enhancement
    enhanceGoogleSearch();
})();