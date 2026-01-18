// ==UserScript==
// @name         SexStories Modern Aesthetic
// @namespace    https://sleazyfork.org/users/YOUR_USER_ID
// @version      2.7
// @description  A modern dark theme for sexstories.com featuring improved typography, better readability, and a clean UI overhaul
// @author       YOUR_USERNAME
// @license      MIT
// @match        https://sexstories.com/*
// @match        https://www.sexstories.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sexstories.com
// @grant        GM_addStyle
// @run-at       document-start
// @supportURL   https://sleazyfork.org/scripts/YOUR_SCRIPT_ID/feedback
// @homepageURL  https://sleazyfork.org/scripts/YOUR_SCRIPT_ID
// @downloadURL https://update.greasyfork.org/scripts/563108/SexStories%20Modern%20Aesthetic.user.js
// @updateURL https://update.greasyfork.org/scripts/563108/SexStories%20Modern%20Aesthetic.meta.js
// ==/UserScript==
/**
 * SexStories Modern Aesthetic
 * ==========================
 * 
 * A complete visual overhaul for sexstories.com featuring:
 * 
 * ✓ Modern dark theme with teal accents
 * ✓ Improved typography using Inter (UI) and Georgia (reading) fonts
 * ✓ Card-based story listings with hover effects
 * ✓ Better readability with optimized font sizes and line heights
 * ✓ Sticky sidebar navigation
 * ✓ Responsive design for mobile devices
 * ✓ Floating scroll-to-top button on story pages
 * ✓ Keyboard shortcuts: T (top), B (bottom)
 * ✓ Custom scrollbar styling
 * ✓ Ad hiding
 * 
 * Changelog:
 * - v2.2: Fixed story page styling, comprehensive selectors
 * - v2.1: Optimized code, reduced file size
 * - v2.0: Removed purple boxes from section headers
 * - v1.9: Fixed story card scoping for tables
 * - v1.8: Author profile page fixes
 * - v1.7: Wider story content, smaller font
 * - v1.6: Sidebar inline layout for genre/numbers
 * - v1.5: Sidebar number counts muted
 * - v1.4: Font controls and floating button fixes
 * - v1.3: Genre highlighting fix
 * - v1.2: Story box width increased
 * - v1.1: Blue header fixes, form styling
 * - v1.0: Initial release
 */
(function () {
    'use strict';
    // ========================================
    // CSS STYLES
    // ========================================
    const styles = `
    /* CSS Variables - Design Tokens */
    :root {
        --bg-primary: #0a0a0f;
        --bg-secondary: #111118;
        --bg-card: #18181f;
        --bg-card-hover: #1f1f28;
        --bg-sidebar: #0d0d12;
        --accent: #14b8a6;
        --accent-light: #2dd4bf;
        --accent-glow: rgba(20, 184, 166, 0.2);
        --text-primary: #f0f0f5;
        --text-secondary: #9ca3af;
        --text-muted: #6b7280;
        --border: rgba(255, 255, 255, 0.05);
        --border-light: rgba(255, 255, 255, 0.08);
        --success: #22c55e;
        --radius: 6px;
        --shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        --transition: 0.15s ease;
        --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        --font-read: 'Georgia', serif;
        --max-width: 1000px;
        --sidebar-width: 220px;
    }
    /* Font Import */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    /* Base Reset */
    *, *::before, *::after { box-sizing: border-box; }
    body {
        background: var(--bg-primary) !important;
        color: var(--text-primary) !important;
        font: 15px/1.6 var(--font-ui) !important;
        margin: 0 !important;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    /* ========== LINKS ========== */
    a {
        color: var(--accent-light) !important;
        text-decoration: none !important;
        transition: color var(--transition) !important;
    }
    a:hover { color: var(--accent) !important; }
    /* ========== SIDEBAR ========== */
    td[valign="top"]:first-child {
        background: var(--bg-sidebar) !important;
        border-right: 1px solid var(--border) !important;
        padding: 16px 12px !important;
        width: var(--sidebar-width) !important;
        min-width: var(--sidebar-width) !important;
        max-width: var(--sidebar-width) !important;
        max-height: 100vh !important;
        overflow-y: auto !important;
        position: sticky !important;
        top: 0 !important;
        color: var(--text-muted) !important;
        font-size: 13px !important;
        line-height: 1.8 !important;
    }
    td[valign="top"]:first-child a {
        display: inline !important;
        color: var(--text-secondary) !important;
        font-size: 13px !important;
    }
    td[valign="top"]:first-child a:hover { color: var(--text-primary) !important; }
    /* Sidebar Section Headers */
    td[valign="top"]:first-child b {
        display: block !important;
        color: var(--accent-light) !important;
        font-size: 11px !important;
        text-transform: uppercase !important;
        letter-spacing: 1.2px !important;
        padding: 12px 10px 6px !important;
        margin-top: 8px !important;
        border-top: 1px solid var(--border) !important;
    }
    td[valign="top"]:first-child b:first-of-type {
        border-top: none !important;
        margin-top: 0 !important;
    }
    /* Mute Story Count Numbers */
    td[valign="top"]:first-child .color2,
    td[valign="top"]:first-child font[color] {
        color: var(--text-muted) !important;
        font-size: 12px !important;
    }
    /* ========== MAIN CONTENT ========== */
    td[valign="top"]:not(:first-child) {
        background: var(--bg-primary) !important;
        padding: 32px 40px !important;
    }
    /* Site Title */
    h1 {
        font-size: 28px !important;
        background: linear-gradient(135deg, var(--accent), var(--accent-light)) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
    }
    /* ========== STORY CARDS (Homepage) ========== */
    td[valign="top"]:not(:first-child) > a[href^="/story/"] {
        display: block !important;
        background: var(--bg-card) !important;
        border: 1px solid var(--border) !important;
        border-radius: 10px !important;
        padding: 20px 24px !important;
        margin: 8px 0 !important;
        color: var(--text-primary) !important;
        font-size: 17px !important;
        font-weight: 600 !important;
        transition: all 0.25s ease !important;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
    }
    td[valign="top"]:not(:first-child) > a[href^="/story/"]:hover {
        background: var(--bg-card-hover) !important;
        border-color: var(--accent) !important;
        transform: translateY(-2px) !important;
        box-shadow: var(--shadow), 0 0 20px var(--accent-glow) !important;
    }
    /* Story Links in Tables - Plain Text */
    table a[href^="/story/"] {
        display: inline !important;
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        font-size: inherit !important;
        font-weight: 500 !important;
        box-shadow: none !important;
    }
    table a[href^="/story/"]:hover { text-decoration: underline !important; }
    /* Author Links */
    a[href^="/profile/"] { font-size: 13px !important; }
    a[href^="/profile/"]:hover { text-decoration: underline !important; }
    /* Tags (Content Area Only) */
    td[valign="top"]:not(:first-child) a[href^="/genre/"],
    td[valign="top"]:not(:first-child) a[href^="/theme/"] {
        display: inline-block !important;
        background: rgba(124, 93, 250, 0.15) !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        padding: 4px 10px !important;
        border-radius: 20px !important;
        margin: 3px 4px 3px 0 !important;
    }
    /* ========== STORY READING PAGE ========== */
    #story_center_panel, .story_text, .story_content,
    div[style*="text-align: justify"],
    td[valign="top"]:not(:first-child) > div:not(:first-child),
    td[width="100%"] > div[style*="justify"] {
        max-width: var(--max-width) !important;
        width: 100% !important;
        margin: 24px auto !important;
        padding: 40px 48px !important;
        background: var(--bg-card) !important;
        border-radius: 16px !important;
        border: 1px solid var(--border) !important;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
    }
    /* Story Text Styling */
    #story_center_panel, #story_center_panel p,
    .story_text, .story_text p,
    div[style*="text-align: justify"],
    div[style*="text-align: justify"] p,
    td[valign="top"]:not(:first-child) > div:not(:first-child) {
        font-family: var(--font-read) !important;
        font-size: 16px !important;
        line-height: 1.8 !important;
        color: var(--text-primary) !important;
        text-align: justify !important;
    }
    #story_center_panel p, .story_text p {
        margin-bottom: 1.5em !important;
        text-indent: 1.5em !important;
    }
    #story_center_panel p:first-of-type,
    .story_text p:first-of-type {
        text-indent: 0 !important;
    }
    /* Drop Cap Effect */
    #story_center_panel p:first-of-type::first-letter,
    .story_text p:first-of-type::first-letter {
        font-size: 3.5em !important;
        float: left !important;
        line-height: 0.8 !important;
        padding-right: 8px !important;
        color: var(--accent) !important;
        font-weight: 700 !important;
    }
    /* Nested Content Reset */
    td[valign="top"]:not(:first-child) > div > div,
    td[width="100%"] > div > div {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    /* ========== TABLES ========== */
    table {
        border-collapse: collapse !important;
        background: transparent !important;
    }
    td, th {
        background: transparent !important;
        border: none !important;
        padding: 8px !important;
    }
    /* ========== FORM ELEMENTS ========== */
    input, textarea, select {
        background: var(--bg-card) !important;
        border: 1px solid var(--border-light) !important;
        border-radius: var(--radius) !important;
        color: var(--text-primary) !important;
        padding: 10px 14px !important;
        font: 14px var(--font-ui) !important;
    }
    input:focus, textarea:focus, select:focus {
        outline: none !important;
        border-color: var(--accent) !important;
        box-shadow: 0 0 0 3px var(--accent-glow) !important;
    }
    button, input[type="submit"], input[type="button"] {
        background: linear-gradient(135deg, var(--accent), var(--accent-light)) !important;
        color: white !important;
        border: none !important;
        border-radius: var(--radius) !important;
        padding: 12px 24px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
    }
    button:hover, input[type="submit"]:hover {
        transform: translateY(-1px) !important;
        box-shadow: var(--shadow) !important;
    }
    /* Font Size Controls */
    a[href*="font_size"] {
        display: inline-block !important;
        width: 28px !important;
        height: 28px !important;
        line-height: 26px !important;
        text-align: center !important;
        background: rgba(255, 255, 255, 0.2) !important;
        border: 1px solid rgba(255, 255, 255, 0.4) !important;
        border-radius: 4px !important;
        color: white !important;
        font-size: 16px !important;
        font-weight: 700 !important;
        margin: 0 2px !important;
        vertical-align: middle !important;
    }
    a[href*="font_size"]:hover {
        background: rgba(255, 255, 255, 0.35) !important;
        transform: scale(1.1) !important;
    }
    /* Story Header Box */
    td[valign="top"]:not(:first-child) > table:first-of-type {
        background: linear-gradient(135deg, var(--accent), var(--accent-light)) !important;
        border-radius: 10px !important;
        padding: 16px 20px !important;
        margin-bottom: 24px !important;
    }
    td[valign="top"]:not(:first-child) > table:first-of-type td {
        background: transparent !important;
        color: white !important;
        padding: 6px 8px !important;
        vertical-align: middle !important;
    }
    /* ========== SCROLLBAR ========== */
    ::-webkit-scrollbar { width: 12px; height: 12px; }
    ::-webkit-scrollbar-track { background: var(--bg-primary); }
    ::-webkit-scrollbar-thumb { 
        background: #3a3a4a; 
        border-radius: 6px; 
        border: 3px solid var(--bg-primary);
    }
    ::-webkit-scrollbar-thumb:hover { background: var(--accent); }
    /* Text Selection */
    ::selection { background: var(--accent); color: white; }
    /* ========== AD HIDING ========== */
    iframe,
    [id*="ad"],
    [class*="ad-"],
    [class*="advertisement"] {
        display: none !important;
    }
    /* ========== LEGACY ELEMENT FIXES ========== */
    /* Blue Headers -> Simple Text */
    [bgcolor="#0000FF"], [bgcolor="#0000ff"], [bgcolor="blue"],
    td[bgcolor="#0000FF"], td[bgcolor="#0000ff"], .color4 {
        background: transparent !important;
        color: var(--accent-light) !important;
        font-weight: 600 !important;
        font-size: 16px !important;
        padding: 16px 0 8px !important;
        border-bottom: 1px solid var(--border) !important;
    }
    /* Profile/Author Page Tables */
    table[width="100%"][cellspacing="0"] {
        border-collapse: separate !important;
        border-spacing: 0 2px !important;
    }
    table[width="100%"][cellspacing="0"] tr:first-child td {
        background: var(--bg-secondary) !important;
        color: var(--text-muted) !important;
        font-size: 11px !important;
        text-transform: uppercase !important;
        padding: 8px 12px !important;
    }
    table[width="100%"] tr td {
        padding: 10px 12px !important;
        border-bottom: 1px solid var(--border) !important;
        font-size: 13px !important;
    }
    table[width="100%"] tr:nth-child(even) td {
        background: rgba(255, 255, 255, 0.02) !important;
    }
    table[width="100%"] tr:hover td {
        background: var(--bg-card) !important;
    }
    table[width="100%"] td {
        color: var(--text-secondary) !important;
    }
    table[width="100%"] td:nth-child(2) {
        color: var(--accent-light) !important;
    }
    table[width="100%"] td:last-child {
        font-size: 11px !important;
        color: var(--text-muted) !important;
        max-width: 300px !important;
    }
    /* Search Form */
    form {
        background: var(--bg-card) !important;
        padding: 24px !important;
        border-radius: 10px !important;
        border: 1px solid var(--border) !important;
    }
    input[type="checkbox"], input[type="radio"] {
        width: 18px !important;
        height: 18px !important;
        accent-color: var(--accent) !important;
    }
    label {
        color: var(--text-primary) !important;
        font-size: 14px !important;
    }
    /* Sort Buttons */
    a[href*="sort="], a[href*="order="] {
        display: inline-block !important;
        background: var(--bg-card) !important;
        color: var(--text-secondary) !important;
        padding: 8px 16px !important;
        border-radius: var(--radius) !important;
        border: 1px solid var(--border-light) !important;
        margin: 4px !important;
        font-size: 13px !important;
    }
    a[href*="sort="]:hover, a[href*="order="]:hover {
        background: var(--accent) !important;
        color: white !important;
    }
    /* Misc Fixes */
    font[color] { color: inherit !important; }
    [border="1"], [border="2"] { border: none !important; }
    small, font[size="1"], font[size="-1"] {
        color: var(--text-muted) !important;
        font-size: 12px !important;
    }
    hr {
        border: none !important;
        height: 1px !important;
        background: linear-gradient(90deg, transparent, var(--border-light), transparent) !important;
        margin: 32px 0 !important;
    }
    i, em { color: var(--text-secondary) !important; }
    b, strong { color: var(--text-primary) !important; font-weight: 600 !important; }
    /* Rating Colors */
    span[style*="color: green"] { color: var(--success) !important; }
    /* ========== FLOATING CONTROLS ========== */
    .ss-scroll-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        width: 48px;
        height: 48px;
        border-radius: 50% !important;
        padding: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 20px !important;
        box-shadow: var(--shadow) !important;
        cursor: pointer !important;
        opacity: 0.9;
        transition: opacity var(--transition), transform var(--transition) !important;
    }
    .ss-scroll-btn:hover {
        opacity: 1;
        transform: scale(1.1) !important;
    }
    /* ========== RESPONSIVE ========== */
    @media (max-width: 768px) {
        td[valign="top"]:first-child { display: none !important; }
        td[valign="top"]:not(:first-child) { padding: 16px !important; }
        #story_center_panel, .story_text { padding: 24px 16px !important; }
    }
    /* ========== ANIMATIONS ========== */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    #content, .story_text, #story_center_panel {
        animation: fadeIn 0.4s ease-out !important;
    }
    `;
    // ========================================
    // INJECT STYLES
    // ========================================
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(styles);
    } else {
        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        (document.head || document.documentElement).appendChild(styleEl);
    }
    // ========================================
    // DYNAMIC TAB TITLES & FAVICON
    // ========================================
    // Helper: Format URL slug to readable title
    function formatSlug(slug) {
        if (!slug) return '';
        return slug
            .replace(/[-_]/g, ' ')           // Replace hyphens/underscores with spaces
            .replace(/\b\w/g, c => c.toUpperCase()) // Capitalize each word
            .replace(/039/g, "'")            // Fix apostrophe encoding
            .replace(/\s+/g, ' ')            // Clean up multiple spaces
            .trim();
    }
    function updateTitle() {
        const path = window.location.pathname;
        const parts = path.split('/').filter(p => p && !/^\d+$/.test(p)); // Filter out empty and pure numeric parts
        const suffix = ' | SexStories';
        let newTitle = '';
        // Get the last meaningful slug from the URL
        const slug = parts[parts.length - 1];
        const pageType = parts[0]; // story, profile, genre, theme, etc.
        switch (pageType) {
            case 'story':
                newTitle = formatSlug(slug) + suffix;
                break;
            case 'profile':
            case 'profile1':
                newTitle = formatSlug(slug) + "'s Profile" + suffix;
                break;
            case 'genre':
            case 'genres':
                newTitle = formatSlug(slug) + ' Stories' + suffix;
                break;
            case 'theme':
            case 'themes':
                newTitle = formatSlug(slug) + ' Stories' + suffix;
                break;
            case 'search':
                newTitle = 'Search' + suffix;
                break;
            case 'update':
            case 'updates':
                newTitle = 'Latest Updates' + suffix;
                break;
            case 'author':
            case 'authors':
                newTitle = 'Authors' + suffix;
                break;
            default:
                // Homepage or unknown
                if (path === '/' || path === '' || path === '/index.php') {
                    newTitle = 'Home' + suffix;
                }
        }
        if (newTitle) {
            document.title = newTitle;
        }
    }
    function setFavicon() {
        // Remove existing favicons
        const existingIcons = document.querySelectorAll('link[rel*="icon"]');
        existingIcons.forEach(icon => icon.remove());
        // Add XNXX favicon (sexstories is part of XNXX network)
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/x-icon';
        link.href = 'https://www.xnxx.com/favicon.ico';
        document.head.appendChild(link);
    }
    // ========================================
    // DOM ENHANCEMENTS
    // ========================================
    function init() {
        // Update page title and favicon
        updateTitle();
        setFavicon();
        // Add scroll-to-top button on story pages
        if (window.location.pathname.includes('/story/')) {
            const btn = document.createElement('button');
            btn.className = 'ss-scroll-btn';
            btn.title = 'Scroll to Top (T)';
            btn.textContent = '↑';
            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            document.body.appendChild(btn);
        }
        // Enable smooth scrolling
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    // ========================================
    // KEYBOARD SHORTCUTS
    // ========================================
    document.addEventListener('keydown', (e) => {
        // Ignore if modifier keys are pressed or typing in input
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        const activeTag = document.activeElement.tagName;
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;
        switch (e.key.toLowerCase()) {
            case 't':
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'b':
                e.preventDefault();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                break;
        }
    });
    // ========================================
    // INITIALIZE
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
