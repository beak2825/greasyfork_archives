// ==UserScript==
// @name         Dcard Mobile View Enforcer
// @namespace    NoNameSpace
// @version      1.0
// @description  Forces full-width mobile layout on desktop and removes sidebars/grids.
// @match        https://www.dcard.tw/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.dcard.tw
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558429/Dcard%20Mobile%20View%20Enforcer.user.js
// @updateURL https://update.greasyfork.org/scripts/558429/Dcard%20Mobile%20View%20Enforcer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Inject Viewport Meta Tag (Simulate mobile device)
    const meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes";
    if (document.head) document.head.appendChild(meta);

    // 2. CSS Layout Overrides
    const css = `
        /* --- Global Reset --- */
        html, body {
            overflow-x: hidden !important;
            width: 100vw !important;
            min-width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            /* Note: Background color removed to allow Dark Reader to control it */
        }

        /* --- Main Container Layout Override --- */
        #__next > div,
        div[class*="Layout__Container"],
        div[class*="MainLayout"] {
            display: block !important;
            grid-template-columns: none !important;
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        /* --- Hide Sidebars and Right Columns --- */
        nav[aria-label="forum-list-section"],
        aside,
        div[class*="Sidebar"],
        div[class*="RightColumn"],
        div[class*="PostPage__Right"],
        div[style*="width: 2"],
        div[style*="width:3"] {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* --- Header Fixes --- */
        header[role="banner"],
        div[class*="Header__Container"] {
            position: sticky !important;
            top: 0;
            width: 100% !important;
            padding: 0 10px !important;
            box-sizing: border-box !important;
            z-index: 999;
        }
        div[class*="Header__Right"] { display: none !important; }

        /* --- Full-width Content Layout --- */
        div[role="main"],
        article,
        div[class*="PostList"],
        div[class*="PostPage__Content"] {
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100vw !important;
            margin: 0 !important;
            padding: 10px 15px !important;
            box-sizing: border-box !important;
            flex: none !important;

            /* Transparent background ensures Dark Reader compatibility */
            background-color: transparent !important;
        }

        div[class*="PostContent"],
        div[class*="CommentList"],
        div[class*="CommentEntry"] {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
        }

        /* --- Responsive Media --- */
        img, video, iframe {
            max-width: 100% !important;
            height: auto !important;
        }
    `;

    GM_addStyle(css);
})();