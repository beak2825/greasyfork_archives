// ==UserScript==
// @name         WSJ Dark Mode
// @namespace    https://www.wsj.com
// @version      0.0.4
// @description  Elegant dark mode for Wall Street Journal when system dark mode is enabled
// @author       hxueh
// @match        *://*.wsj.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://s.wsj.net/img/meta/wsj_favicon.svg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560962/WSJ%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/560962/WSJ%20Dark%20Mode.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
 
  // Color palette - elegant dark theme
  const colors = {
    bg: '#000000',
    bgElevated: '#000000',
    bgCard: '#000000',
    bgHover: '#0a0a0a',
    text: '#e8e6e3',
    textMuted: '#a8a5a0',
    textSubtle: '#888888',
    accent: '#d4a853',
    accentHover: '#e6bc6a',
    link: '#7eb8da',
    linkHover: '#a3d0eb',
    border: '#1a1a1a',
    borderSubtle: '#111111',
  };
 
  const darkModeCSS = `
    /*========================================
      WSJ Dark Mode - Base Styles
    ========================================*/
 
    :root {
      color-scheme: dark;
    }
 
    /* Global resets */
    html, body {
      background-color: ${colors.bg} !important;
      color: ${colors.text} !important;
    }
 
    /* Main content areas */
    body,
    main,
    article,
    section,
    div,
    header,
    footer,
    nav,
    aside {
      background-color: transparent !important;
    }
 
    /* Override specific WSJ containers */
    .WSJTheme--page-container--,
    .WSJTheme--pageWrapper--,
    [class*="PageWrapper"],
    [class*="page-container"],
    [class*="MainContent"],
    [class*="ArticleBody"],
    [class*="wrapper"],
    #root,
    #__next,
    .container {
      background-color: ${colors.bg} !important;
    }
 
    /*========================================
      Typography
    ========================================*/
 
    /* Headings */
    h1, h2, h3, h4, h5, h6,
    [class*="Headline"],
    [class*="headline"],
    [class*="Title"],
    [class*="title"] {
      color: ${colors.text} !important;
    }
 
    /* Body text */
    p, span, li, td, th, label,
    [class*="Paragraph"],
    [class*="paragraph"],
    [class*="Body"],
    [class*="Summary"],
    [class*="summary"],
    [class*="Description"],
    [class*="description"] {
      color: ${colors.text} !important;
    }
 
    /* Muted text */
    [class*="Byline"],
    [class*="byline"],
    [class*="Timestamp"],
    [class*="timestamp"],
    [class*="Meta"],
    [class*="meta"],
    time,
    figcaption,
    .caption,
    [class*="Caption"] {
      color: ${colors.textMuted} !important;
    }
 
    /* Subtle text */
    [class*="Label"],
    [class*="Tag"],
    small {
      color: ${colors.textSubtle} !important;
    }
 
    /*========================================
      Links
    ========================================*/
 
    a {
      color: ${colors.link} !important;
      transition: color 0.15s ease !important;
    }
 
    a:hover {
      color: ${colors.linkHover} !important;
    }
 
    /* Article headlines as links */
    a h1, a h2, a h3, a h4,
    h1 a, h2 a, h3 a, h4 a,
    [class*="Headline"] a,
    a[class*="Headline"] {
      color: ${colors.text} !important;
    }
 
    a:hover h1, a:hover h2, a:hover h3, a:hover h4,
    h1 a:hover, h2 a:hover, h3 a:hover, h4 a:hover {
      color: ${colors.accent} !important;
    }
 
    /*========================================
      Cards & Containers
    ========================================*/
 
    [class*="Card"],
    [class*="card"],
    [class*="Module"],
    [class*="module"],
    [class*="Story"],
    [class*="story"],
    [class*="Item"],
    [class*="Promo"],
    [class*="promo"] {
      background-color: ${colors.bgCard} !important;
      border-color: ${colors.border} !important;
      border-radius: 8px !important;
    }
 
    /* Elevated surfaces */
    [class*="Modal"],
    [class*="modal"],
    [class*="Popup"],
    [class*="popup"],
    [class*="Tooltip"],
    [class*="tooltip"] {
      background-color: #000000 !important;
      border-color: ${colors.border} !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8) !important;
    }
 
    /* Menu-specific styles - high specificity */
    [class*="Menu"],
    [class*="menu"],
    div[class*="Menu"],
    div[class*="menu"],
    ul[class*="Menu"],
    ul[class*="menu"] {
      background-color: #000000 !important;
      border: 1px solid ${colors.border} !important;
    }
 
    /* Menu items */
    [class*="Menu"] > *,
    [class*="menu"] > *,
    [class*="Menu"] li,
    [class*="menu"] li,
    [class*="Menu"] a,
    [class*="menu"] a {
      background-color: #000000 !important;
    }
 
    [class*="Menu"] a:hover,
    [class*="menu"] a:hover,
    [class*="Menu"] li:hover,
    [class*="menu"] li:hover {
      background-color: ${colors.bgHover} !important;
    }
 
    /*========================================
      Navigation & Header
    ========================================*/
 
    header,
    nav,
    [class*="Header"],
    [class*="header"],
    [class*="Nav"],
    [class*="nav"],
    [class*="Masthead"],
    [class*="masthead"],
    [class*="TopBar"],
    [class*="topbar"] {
      background-color: ${colors.bgElevated} !important;
      border-bottom-color: ${colors.border} !important;
    }
 
    /* Navigation dropdown menus */
    [class*="Dropdown"],
    [class*="dropdown"],
    [class*="Flyout"],
    [class*="flyout"],
    [class*="Submenu"],
    [class*="submenu"],
    [class*="SubNav"],
    [class*="subnav"],
    [class*="MenuPanel"],
    [class*="menu-panel"],
    [class*="NavPanel"],
    [class*="nav-panel"],
    [class*="DropdownMenu"],
    [class*="dropdown-menu"],
    nav ul ul,
    nav > div > div,
    [role="menu"],
    [aria-expanded="true"] + div,
    [aria-expanded="true"] + ul,
    header [class*="expanded"],
    header [class*="open"],
    header [class*="active"] > div,
    header [class*="hover"] > div {
      background-color: #000000 !important;
      border: 1px solid ${colors.border} !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.9) !important;
    }
 
    /* Nested navigation links in dropdowns */
    nav a,
    [class*="Nav"] a,
    [class*="nav"] a,
    header a {
      background-color: transparent !important;
    }
 
    nav li,
    [class*="Nav"] li,
    header li {
      background-color: transparent !important;
    }
 
    /* Dropdown container backgrounds */
    nav [class*="container"],
    nav [class*="wrapper"],
    nav [class*="content"],
    header [class*="container"],
    header [class*="wrapper"] {
      background-color: #000000 !important;
    }
 
    /* WSJ Logo - invert images for dark mode */
    [class*="Logo"] img,
    [class*="logo"] img,
    .wsj-logo img {
      filter: brightness(0) invert(1) !important;
    }

    /* WSJ Logo - SVG logos */
    [class*="Logo"] svg,
    [class*="logo"] svg,
    [class*="WSJLogo"] svg,
    [class*="wsj-logo"] svg,
    [class*="Masthead"] svg,
    [class*="masthead"] svg,
    header svg[class*="logo" i],
    nav svg[class*="logo" i] {
      filter: brightness(0) invert(1) !important;
    }

    /* WSJ specific logo classes */
    [class*="WSJLogo"],
    [class*="wsj-logo"],
    [class*="wsjLogo"],
    [class*="WSJTheme--logo"],
    [class*="SiteLogo"],
    [class*="site-logo"],
    [class*="BrandLogo"],
    [class*="brand-logo"] {
      filter: brightness(0) invert(1) !important;
    }

    /* Header logo links - target the logo container */
    header [class*="Logo"],
    header [class*="logo"],
    nav [class*="Logo"],
    nav [class*="logo"],
    [class*="Masthead"] [class*="Logo"],
    [class*="masthead"] [class*="logo"] {
      filter: brightness(0) invert(1) !important;
    }

    /* Ensure child elements of logo also get inverted */
    [class*="Logo"] *,
    [class*="logo"][class*="wsj" i] *,
    [class*="WSJLogo"] *,
    [class*="wsj-logo"] * {
      filter: inherit !important;
    }

    /* Reset filter for non-logo header elements */
    header a:not([class*="logo" i]):not([class*="Logo"]),
    nav a:not([class*="logo" i]):not([class*="Logo"]) {
      filter: none !important;
    }
 
    /*========================================
      Footer
    ========================================*/
 
    footer,
    [class*="Footer"],
    [class*="footer"] {
      background-color: ${colors.bgElevated} !important;
      border-top-color: ${colors.border} !important;
    }
 
    /*========================================
      Sidebar & Secondary Content
    ========================================*/
 
    aside,
    [class*="Sidebar"],
    [class*="sidebar"],
    [class*="Rail"],
    [class*="rail"],
    [class*="Secondary"],
    [class*="secondary"] {
      background-color: ${colors.bg} !important;
    }
 
    /*========================================
      Forms & Inputs
    ========================================*/
 
    input,
    textarea,
    select {
      background-color: ${colors.bgCard} !important;
      color: ${colors.text} !important;
      border-color: ${colors.border} !important;
      border-radius: 6px !important;
    }
 
    input:focus,
    textarea:focus,
    select:focus {
      border-color: ${colors.accent} !important;
      outline: none !important;
      box-shadow: 0 0 0 2px rgba(212, 168, 83, 0.2) !important;
    }
 
    input::placeholder,
    textarea::placeholder {
      color: ${colors.textSubtle} !important;
    }
 
    /*========================================
      Buttons
    ========================================*/
 
    button,
    [class*="Button"],
    [class*="button"],
    [class*="Btn"],
    [class*="btn"],
    [role="button"] {
      background-color: ${colors.bgCard} !important;
      color: ${colors.text} !important;
      border-color: ${colors.border} !important;
      transition: all 0.15s ease !important;
    }
 
    button:hover,
    [class*="Button"]:hover,
    [class*="button"]:hover,
    [class*="Btn"]:hover,
    [class*="btn"]:hover,
    [role="button"]:hover {
      background-color: ${colors.bgHover} !important;
      border-color: ${colors.accent} !important;
    }
 
    /* Primary buttons */
    [class*="Primary"],
    [class*="primary"],
    button[class*="subscribe" i],
    button[class*="Subscribe" i] {
      background-color: ${colors.accent} !important;
      color: ${colors.bg} !important;
      border-color: ${colors.accent} !important;
    }
 
    [class*="Primary"]:hover,
    [class*="primary"]:hover {
      background-color: ${colors.accentHover} !important;
      border-color: ${colors.accentHover} !important;
    }
 
    /*========================================
      Tables
    ========================================*/
 
    table {
      background-color: ${colors.bg} !important;
      border-color: ${colors.border} !important;
    }
 
    th {
      background-color: ${colors.bgElevated} !important;
      color: ${colors.text} !important;
      border-color: ${colors.border} !important;
    }
 
    td {
      background-color: ${colors.bg} !important;
      color: ${colors.text} !important;
      border-color: ${colors.borderSubtle} !important;
    }
 
    tr:hover td {
      background-color: ${colors.bgHover} !important;
    }
 
    /*========================================
      Borders & Dividers
    ========================================*/
 
    hr,
    [class*="Divider"],
    [class*="divider"],
    [class*="Border"],
    [class*="border"],
    [class*="Separator"],
    [class*="separator"] {
      border-color: ${colors.border} !important;
      background-color: ${colors.border} !important;
    }
 
    /*========================================
      Images & Media
    ========================================*/
 
    img {
      opacity: 0.92;
      transition: opacity 0.2s ease;
    }
 
    img:hover {
      opacity: 1;
    }
 
    figure {
      background-color: transparent !important;
    }
 
    /* Video containers */
    [class*="Video"],
    [class*="video"],
    [class*="Player"],
    [class*="player"] {
      background-color: ${colors.bgCard} !important;
    }
 
    /*========================================
      Article Specific
    ========================================*/
 
    /* Article body */
    article,
    [class*="Article"],
    [class*="article"] {
      background-color: ${colors.bg} !important;
    }
 
    /* Blockquotes */
    blockquote,
    [class*="Quote"],
    [class*="quote"],
    [class*="Pullquote"],
    [class*="pullquote"] {
      background-color: ${colors.bgCard} !important;
      border-left-color: ${colors.accent} !important;
      color: ${colors.text} !important;
      border-radius: 0 8px 8px 0 !important;
      padding: 1rem 1.5rem !important;
    }
 
    /* Code blocks */
    pre, code {
      background-color: ${colors.bgCard} !important;
      color: ${colors.text} !important;
      border-color: ${colors.border} !important;
    }
 
    /*========================================
      Ads & Promotions (dim them)
    ========================================*/
 
    [class*="Ad"],
    [class*="ad-"],
    [id*="ad-"],
    [class*="Advertisement"],
    [class*="advertisement"],
    [class*="Promo"],
    [data-ad],
    iframe[src*="ad"] {
      opacity: 0.7 !important;
      filter: brightness(0.85) !important;
    }
 
    /*========================================
      Scrollbar
    ========================================*/
 
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
 
    ::-webkit-scrollbar-track {
      background: ${colors.bg};
    }
 
    ::-webkit-scrollbar-thumb {
      background: ${colors.border};
      border-radius: 5px;
    }
 
    ::-webkit-scrollbar-thumb:hover {
      background: ${colors.textSubtle};
    }
 
    /* Firefox scrollbar */
    * {
      scrollbar-width: thin;
      scrollbar-color: ${colors.border} ${colors.bg};
    }
 
    /*========================================
      Selection
    ========================================*/
 
    ::selection {
      background-color: ${colors.accent} !important;
      color: ${colors.bg} !important;
    }
 
    ::-moz-selection {
      background-color: ${colors.accent} !important;
      color: ${colors.bg} !important;
    }
 
    /*========================================
      Override inline styles (nuclear option)
    ========================================*/
 
    [style*="background-color: rgb(255"],
    [style*="background-color: #fff"],
    [style*="background-color: white"],
    [style*="background: rgb(255"],
    [style*="background: #fff"],
    [style*="background: white"] {
      background-color: ${colors.bg} !important;
    }
 
    [style*="color: rgb(0"],
    [style*="color: #000"],
    [style*="color: black"] {
      color: ${colors.text} !important;
    }
 
    /*========================================
      WSJ-Specific Overrides
    ========================================*/
 
    /* Market data colors - keep green/red for stocks */
    [class*="positive"],
    [class*="Positive"],
    [class*="gain"],
    [class*="Gain"],
    [class*="up"] {
      color: #4ade80 !important;
    }
 
    [class*="negative"],
    [class*="Negative"],
    [class*="loss"],
    [class*="Loss"],
    [class*="down"] {
      color: #f87171 !important;
    }
 
    /* Paywall/subscription modals */
    [class*="Paywall"],
    [class*="paywall"],
    [class*="Subscribe"],
    [class*="subscribe"] {
      background-color: ${colors.bgElevated} !important;
    }
 
    /* Search results */
    [class*="Search"],
    [class*="search"] {
      background-color: ${colors.bg} !important;
    }
 
    /* Comments section */
    [class*="Comment"],
    [class*="comment"] {
      background-color: ${colors.bgCard} !important;
      border-color: ${colors.border} !important;
    }
 
    /*========================================
      Smooth transitions for dynamic content
    ========================================*/
 
    * {
      transition: background-color 0.1s ease, border-color 0.1s ease;
    }
 
    /* Disable transitions for specific elements */
    a, button, input, img, video {
      transition: none;
    }
 
    a {
      transition: color 0.15s ease !important;
    }
  `;
 
  // Check for dark mode preference
  function isDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
 
  // Apply or remove dark mode styles
  let styleElement = null;
 
  function applyDarkMode() {
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'wsj-dark-mode-styles';
      styleElement.textContent = darkModeCSS;
    }
    if (!document.getElementById('wsj-dark-mode-styles')) {
      (document.head || document.documentElement).appendChild(styleElement);
    }
  }
 
  function removeDarkMode() {
    const existing = document.getElementById('wsj-dark-mode-styles');
    if (existing) {
      existing.remove();
    }
  }
 
  function updateTheme() {
    if (isDarkMode()) {
      applyDarkMode();
    } else {
      removeDarkMode();
    }
  }
 
  // Initial application
  updateTheme();
 
  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
  }
 
  // Re-apply styles when DOM is ready (for dynamic content)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateTheme);
  }
 
  // Observe for dynamic content changes
  const observer = new MutationObserver((mutations) => {
    if (isDarkMode() && !document.getElementById('wsj-dark-mode-styles')) {
      applyDarkMode();
    }
  });
 
  // Start observing when body is available
  function startObserver() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    } else {
      requestAnimationFrame(startObserver);
    }
  }
 
  startObserver();
 
  console.log('🌙 WSJ Dark Mode loaded - respects system preference');
})();