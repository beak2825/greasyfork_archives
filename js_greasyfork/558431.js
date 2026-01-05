// ==UserScript==
// @name         Dark Theme for Bar-I
// @version      1.01
// @description  Optimized
// @author       Nicolai Mihaic
// @license      MIT
// @match        https://app.bar-i.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bar-i.com
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1516265
// @downloadURL https://update.greasyfork.org/scripts/558431/Dark%20Theme%20for%20Bar-I.user.js
// @updateURL https://update.greasyfork.org/scripts/558431/Dark%20Theme%20for%20Bar-I.meta.js
// ==/UserScript==
 
// Dark Theme Module for Conservative Unified Bar-I Suite
// This module can be loaded separately or integrated into the main userscript
 
(function() {
    'use strict';
 
    // Dark theme state
    let darkThemeEnabled = localStorage.getItem('nxtweaks_dark_theme') === 'true';
 
    // Initialize dark theme
    function initDarkTheme() {
        console.log('[NxTweaks Dark Theme] Initializing...');
 
        // Apply dark theme styles
        GM_addStyle(`
            /* Dark Theme Toggle Button */
            #nxtweaks-dark-theme-toggle {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 2147483647;
                width: 38px;
                height: 38px;
                border-radius: 50%;
                border: 2px solid #ddd;
                background: #fff;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
            }
            #nxtweaks-dark-theme-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(0,0,0,0.25);
            }
            body.nxtweaks-dark-theme #nxtweaks-dark-theme-toggle {
                background: #2a2a2a;
                border-color: #444;
            }
 
            /* Dark Theme Styles */
            body.nxtweaks-dark-theme {
                background: #1a1a1a !important;
                color: #e0e0e0 !important;
            }
            body.nxtweaks-dark-theme * {
                border-color: #444 !important;
            }
            body.nxtweaks-dark-theme .main-container,
            body.nxtweaks-dark-theme .content-wrapper,
            body.nxtweaks-dark-theme .card,
            body.nxtweaks-dark-theme .modal-content,
            body.nxtweaks-dark-theme .table-responsive,
            body.nxtweaks-dark-theme app-root {
                background: #1a1a1a !important;
                color: #e0e0e0 !important;
            }
            body.nxtweaks-dark-theme .left-sidebar,
            body.nxtweaks-dark-theme .sidebar {
                background: #252525 !important;
            }
            body.nxtweaks-dark-theme .left-sidebar ul li a {
                color: #b0b0b0 !important;
            }
            body.nxtweaks-dark-theme .left-sidebar ul li a:hover,
            body.nxtweaks-dark-theme .left-sidebar ul li a.active {
                background: #333 !important;
                color: #fff !important;
            }
            body.nxtweaks-dark-theme .left-sidebar ul li a[aria-expanded=true] {
                background: #333 !important;
                color: #ca302d !important;
            }
            body.nxtweaks-dark-theme table,
            body.nxtweaks-dark-theme thead,
            body.nxtweaks-dark-theme tbody {
                background: #1a1a1a !important;
                color: #e0e0e0 !important;
            }
            body.nxtweaks-dark-theme th {
                background: #2a2a2a !important;
                color: #fff !important;
            }
            body.nxtweaks-dark-theme td {
                color: #e0e0e0 !important;
            }
            /* Preserve alternating row colors in dark theme */
            body.nxtweaks-dark-theme tbody tr:nth-child(odd) td {
                background: #1a1a1a !important;
            }
            body.nxtweaks-dark-theme tbody tr:nth-child(even) td {
                background: #222 !important;
            }
            body.nxtweaks-dark-theme tbody tr:hover td {
                background: #2a2a2a !important;
            }
            /* Preserve step highlighting colors in dark theme */
            body.nxtweaks-dark-theme .conservative-ubies-step1-invoices {
                color: #28a745 !important;
            }
            body.nxtweaks-dark-theme .conservative-ubies-step2-count {
                color: #dc3545 !important;
            }
            body.nxtweaks-dark-theme .conservative-ubies-step3-sales {
                color: #fa7d34 !important;
            }
            body.nxtweaks-dark-theme .conservative-ubies-step4-communication {
                color: #34ccfa !important;
            }
            body.nxtweaks-dark-theme .conservative-ubies-step5-variance {
                color: #f0bd18 !important;
            }
            body.nxtweaks-dark-theme .conservative-ubies-step234-done {
                color: #5b96f5 !important;
            }
            body.nxtweaks-dark-theme h1,
            body.nxtweaks-dark-theme h2,
            body.nxtweaks-dark-theme h3,
            body.nxtweaks-dark-theme h4,
            body.nxtweaks-dark-theme h5,
            body.nxtweaks-dark-theme h6 {
                color: #e0e0e0 !important;
            }
            body.nxtweaks-dark-theme .sub-cat-analysis .content-head {
                background: #2a2a2a !important;
                color: #e0e0e0 !important;
            }
            body.nxtweaks-dark-theme input,
            body.nxtweaks-dark-theme textarea,
            body.nxtweaks-dark-theme select {
                background: #2a2a2a !important;
                color: #e0e0e0 !important;
                border-color: #444 !important;
            }
            body.nxtweaks-dark-theme .search-box input.bg-fa {
                background: #2a2a2a !important;
                color: #e0e0e0 !important;
            }
            body.nxtweaks-dark-theme .modal-backdrop {
                background: rgba(0, 0, 0, 0.8) !important;
            }
            body.nxtweaks-dark-theme .dropdown-menu {
                background: #2a2a2a !important;
                color: #e0e0e0 !important;
            }
            body.nxtweaks-dark-theme .dropdown-item {
                color: #e0e0e0 !important;
            }
            body.nxtweaks-dark-theme .dropdown-item:hover {
                background: #333 !important;
            }
            body.nxtweaks-dark-theme .nav-tabs .nav-link {
                background: #2a2a2a !important;
                color: #b0b0b0 !important;
            }
            body.nxtweaks-dark-theme .nav-tabs .nav-link.active {
                background: #1a1a1a !important;
                color: #fff !important;
            }
            /* Quick filters toolbar dark theme */
            body.nxtweaks-dark-theme #conservative_ubies_qf_toolbar {
                background: #2a2a2a !important;
            }
            body.nxtweaks-dark-theme .qf-filter-btn {
                background: #333 !important;
                color: #e0e0e0 !important;
                border-color: #555 !important;
            }
            body.nxtweaks-dark-theme .qf-filter-btn.active {
                background: #007bff !important;
                color: white !important;
                border-color: #0056b3 !important;
            }
            /* Pagination dark theme */
            body.nxtweaks-dark-theme .pagination .page-item .page-link {
                background: #2a2a2a !important;
                color: #e0e0e0 !important;
                border-color: #444 !important;
            }
            body.nxtweaks-dark-theme .pagination .page-item.active .page-link {
                background: #007bff !important;
                border-color: #0056b3 !important;
            }
            body.nxtweaks-dark-theme .pagination .page-item:hover .page-link {
                background: #333 !important;
            }
            /* Logo dark theme */
            body.nxtweaks-dark-theme #conservative_ubies_top_logo,
            body.nxtweaks-dark-theme .logo-area {
                background: #2a2a2a !important;
            }
            /* Bottom button area dark theme */
            body.nxtweaks-dark-theme .bottom-btn-area {
                background: #2a2a2a !important;
                border-color: #444 !important;
            }
            body.nxtweaks-dark-theme .bottom-btn-area .container-fluid {
                background: #2a2a2a !important;
            }
            body.nxtweaks-dark-theme .btn,
            body.nxtweaks-dark-theme button {
                background: #333 !important;
                color: #e0e0e0 !important;
                border-color: #555 !important;
            }
            body.nxtweaks-dark-theme .btn-primary,
            body.nxtweaks-dark-theme .btn.btn-primary {
                background: #0066cc !important;
                color: #fff !important;
                border-color: #0052a3 !important;
            }
            body.nxtweaks-dark-theme .btn-primary:hover,
            body.nxtweaks-dark-theme .btn.btn-primary:hover {
                background: #0052a3 !important;
            }
            body.nxtweaks-dark-theme .btn-o,
            body.nxtweaks-dark-theme .btn.btn-o {
                background: transparent !important;
                color: #0066cc !important;
                border-color: #0066cc !important;
            }
            body.nxtweaks-dark-theme .btn-o:hover {
                background: #0066cc !important;
                color: #fff !important;
            }
            /* Radio buttons dark theme */
            body.nxtweaks-dark-theme .inline-radio,
            body.nxtweaks-dark-theme .button-radio {
                background: #2a2a2a !important;
            }
            body.nxtweaks-dark-theme .custom-radio {
                color: #e0e0e0 !important;
            }
            body.nxtweaks-dark-theme .custom-radio span {
                color: #b0b0b0 !important;
                background: #333 !important;
                border-color: #555 !important;
            }
            body.nxtweaks-dark-theme .custom-radio input:checked + span,
            body.nxtweaks-dark-theme .custom-radio .selectedTab {
                color: #fff !important;
                background: #0066cc !important;
                border-color: #0052a3 !important;
            }
            body.nxtweaks-dark-theme .custom-radio:hover span {
                color: #e0e0e0 !important;
            }
            body.nxtweaks-dark-theme label {
                color: #e0e0e0 !important;
            }
            /* List items dark theme */
            body.nxtweaks-dark-theme .set {
                background: #2a2a2a !important;
                border-color: #444 !important;
            }
            body.nxtweaks-dark-theme .list-no,
            body.nxtweaks-dark-theme .list-title,
            body.nxtweaks-dark-theme .mid-content,
            body.nxtweaks-dark-theme .list-action {
                color: #e0e0e0 !important;
                background: transparent !important;
            }
            body.nxtweaks-dark-theme .list-status {
                color: #e0e0e0 !important;
            }
            body.nxtweaks-dark-theme .list-status.complete {
                color: #4caf50 !important;
            }
            body.nxtweaks-dark-theme .icon-check-icon {
                filter: brightness(1.2);
            }
            body.nxtweaks-dark-theme .badge {
                filter: brightness(0.8);
            }
            body.nxtweaks-dark-theme img:not([src*="logo"]) {
                opacity: 0.9;
            }
        `);
 
        // Create toggle button
        createDarkThemeToggle();
 
        // Apply initial theme state
        if (darkThemeEnabled) {
            document.body.classList.add('nxtweaks-dark-theme');
        }
 
        console.log('[NxTweaks Dark Theme] Initialized with state:', darkThemeEnabled);
    }
 
    function createDarkThemeToggle() {
        // Check if toggle already exists
        if (document.getElementById('nxtweaks-dark-theme-toggle')) {
            return;
        }
 
        const toggle = document.createElement('button');
        toggle.id = 'nxtweaks-dark-theme-toggle';
        toggle.innerHTML = darkThemeEnabled ? '🌙' : '☀️';
        toggle.title = 'Toggle Dark Theme';
 
        toggle.addEventListener('click', () => {
            darkThemeEnabled = !darkThemeEnabled;
            localStorage.setItem('nxtweaks_dark_theme', darkThemeEnabled.toString());
            document.body.classList.toggle('nxtweaks-dark-theme', darkThemeEnabled);
            toggle.innerHTML = darkThemeEnabled ? '🌙' : '☀️';
            console.log('[NxTweaks Dark Theme] Toggled to:', darkThemeEnabled);
        });
 
        document.body.appendChild(toggle);
    }
 
    // Export initialization function
    if (typeof window !== 'undefined') {
        window.NxTweaksDarkTheme = {
            init: initDarkTheme,
            isEnabled: () => darkThemeEnabled,
            toggle: () => {
                const toggleBtn = document.getElementById('nxtweaks-dark-theme-toggle');
                if (toggleBtn) toggleBtn.click();
            }
        };
    }
 
    // Auto-initialize if GM_addStyle is available (running as userscript)
    if (typeof GM_addStyle !== 'undefined') {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDarkTheme);
        } else {
            initDarkTheme();
        }
    }
 
})();