// ==UserScript==
// @name         Douban Dark Mode
// @name:zh-CN   豆瓣暗黑模式
// @name:zh-TW   豆瓣暗黑模式
// @namespace    https://douban.com/
// @version      0.0.5
// @description  Automatically applies dark mode to douban.com when browser dark mode is detected
// @description:zh-CN 自动应用暗黑模式到 douban.com 当浏览器暗黑模式被检测到时
// @description:zh-TW 自動應用暗黑模式到 douban.com 時，當瀏覽器暗黑模式被檢測到時
// @author       hxueh
// @match        *://www.douban.com/*
// @match        *://m.douban.com/*
// @match        *://movie.douban.com/*
// @match        *://music.douban.com/*
// @match        *://book.douban.com/*
// @match        *://read.douban.com/*
// @match        *://market.douban.com/*
// @match        *://accounts.douban.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://douban.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561152/Douban%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/561152/Douban%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Check if dark mode is preferred
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (!prefersDark) {
    return;
  }

  // Define dark mode color scheme
  const darkModeStyles = `
        /* CSS Variables for dark mode */
        :root {
            --db-bg-primary: #1e1e1e;
            --db-bg-secondary: #2d2d2d;
            --db-bg-tertiary: #3a3a3a;
            --db-text-primary: #e0e0e0;
            --db-text-secondary: #b0b0b0;
            --db-text-tertiary: #808080;
            --db-border: #404040;
            --db-link: #5ba3d0;
            --db-link-visited: #9575cd;
        }

        /* Body and main containers */
        body,
        html {
            background-color: var(--db-bg-primary) !important;
            color: var(--db-text-primary) !important;
        }

        /* Main content areas */
        #content,
        #wrapper,
        .wrapper,
        .container,
        .main-container,
        main {
            background-color: var(--db-bg-primary) !important;
            color: var(--db-text-primary) !important;
        }

        /* Sidebar and secondary content */
        #sidebar,
        .sidebar,
        aside,
        .aside {
            background-color: var(--db-bg-secondary) !important;
            color: var(--db-text-primary) !important;
        }

        /* Cards and item containers */
        .item,
        .card,
        .subject-item,
        .movie-item,
        .book-item,
        .music-item,
        [class*='item'],
        [class*='card'] {
            background-color: var(--db-bg-secondary) !important;
            color: var(--db-text-primary) !important;
            border-color: var(--db-border) !important;
        }

        /* Headers and titles */
        h1, h2, h3, h4, h5, h6,
        .title,
        .heading {
            color: var(--db-text-primary) !important;
        }

        /* Links */
        a,
        [role="link"] {
            color: var(--db-link) !important;
        }

        a:visited {
            color: var(--db-link-visited) !important;
        }

        a:hover {
            color: #6cb3e0 !important;
        }

        /* Navigation */
        nav,
        .nav,
        .navbar,
        .navigation,
        .header,
        .top-nav {
            background-color: var(--db-bg-secondary) !important;
            color: var(--db-text-primary) !important;
            border-color: var(--db-border) !important;
        }

        /* Buttons */
        button,
        .button,
        input[type="button"],
        input[type="submit"],
        input[type="reset"],
        [role="button"] {
            background-color: var(--db-bg-tertiary) !important;
            color: var(--db-text-primary) !important;
            border-color: var(--db-border) !important;
        }

        button:hover,
        .button:hover,
        input[type="button"]:hover,
        input[type="submit"]:hover,
        input[type="reset"]:hover {
            background-color: var(--db-border) !important;
        }

        /* Input fields and forms */
        input,
        textarea,
        select,
        [contenteditable],
        .input,
        .form-control {
            background-color: var(--db-bg-tertiary) !important;
            color: var(--db-text-primary) !important;
            border-color: var(--db-border) !important;
        }

        input::placeholder,
        textarea::placeholder {
            color: var(--db-text-tertiary) !important;
        }

        /* Borders and dividers */
        hr,
        .separator,
        [class*="divider"] {
            border-color: var(--db-border) !important;
        }

        /* Tables */
        table,
        tr,
        td,
        th {
            border-color: var(--db-border) !important;
        }

        td,
        th {
            background-color: var(--db-bg-secondary) !important;
            color: var(--db-text-primary) !important;
        }

        thead {
            background-color: var(--db-bg-tertiary) !important;
        }

        /* Code blocks */
        code,
        pre,
        .code,
        [class*="code"] {
            background-color: var(--db-bg-tertiary) !important;
            color: var(--db-text-primary) !important;
            border-color: var(--db-border) !important;
        }

        /* Quotes and blockquotes */
        blockquote,
        .quote,
        [class*="quote"] {
            background-color: var(--db-bg-secondary) !important;
            color: var(--db-text-secondary) !important;
            border-color: var(--db-border) !important;
        }

        /* Modals and overlays */
        [role="dialog"],
        .modal,
        .dialog,
        .overlay {
            background-color: var(--db-bg-primary) !important;
        }

        .modal-content,
        .dialog-content {
            background-color: var(--db-bg-secondary) !important;
            color: var(--db-text-primary) !important;
            border-color: var(--db-border) !important;
        }

        /* Dropdowns and menus */
        [role="menu"],
        [role="listbox"],
        .dropdown,
        .menu {
            background-color: var(--db-bg-secondary) !important;
            border-color: var(--db-border) !important;
        }

        [role="option"],
        .menu-item,
        .dropdown-item {
            color: var(--db-text-primary) !important;
        }

        [role="option"]:hover,
        .menu-item:hover,
        .dropdown-item:hover {
            background-color: var(--db-bg-tertiary) !important;
        }

        /* Comments and discussions */
        .comment,
        .review,
        [class*="comment"],
        [class*="review"] {
            background-color: var(--db-bg-secondary) !important;
            border-color: var(--db-border) !important;
            color: var(--db-text-primary) !important;
        }

        /* Remove images brightness if desired (optional - can cause issues)
        img {
            filter: brightness(0.8) !important;
        }
        */

        /* Fix specific Douban elements */
        .top-nav,
        #db-global-nav {
            background-color: var(--db-bg-tertiary) !important;
            border-bottom-color: var(--db-border) !important;
        }

        .subject,
        .item-root {
            background-color: var(--db-bg-secondary) !important;
        }

        .bnormal,
        .bno {
            color: var(--db-text-primary) !important;
        }

        .pl,
        [class*="rating"] {
            color: var(--db-text-secondary) !important;
        }

        /* Status and rating elements */
        .rating_nums,
        .bigrating {
            color: var(--db-link) !important;
        }

        /* Tags */
        .tag,
        [class*="tag"],
        .badge,
        [class*="badge"] {
            background-color: var(--db-bg-tertiary) !important;
            color: var(--db-text-primary) !important;
            border-color: var(--db-border) !important;
        }

        /* Douban specific - movie/book related */
        .subject-item-pic,
        .pic {
            border-color: var(--db-border) !important;
        }

        .pic img {
            border-color: var(--db-border) !important;
        }

        /* Footer */
        footer,
        .footer {
            background-color: var(--db-bg-secondary) !important;
            color: var(--db-text-secondary) !important;
            border-color: var(--db-border) !important;
        }

        /* Mobile specific */
        .app-container,
        .mob-mask {
            background-color: var(--db-bg-primary) !important;
        }

        /* Status and alert elements */
        .alert,
        [role="alert"],
        .success,
        .error,
        .warning,
        .info {
            background-color: var(--db-bg-tertiary) !important;
            border-color: var(--db-border) !important;
            color: var(--db-text-primary) !important;
        }
    `;

  // Inject CSS
  const style = document.createElement("style");
  style.textContent = darkModeStyles;

  // Use document-start to apply ASAP
  if (document.head) {
    document.head.appendChild(style);
  } else {
    document.documentElement.appendChild(style);
  }

  // Listen for changes to dark mode preference
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  darkModeMediaQuery.addListener((e) => {
    if (e.matches) {
      style.textContent = darkModeStyles;
    } else {
      style.textContent = "";
    }
  });
})();
