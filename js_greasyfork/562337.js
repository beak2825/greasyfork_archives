// ==UserScript==
// @name         AO3 Journey: English Edition
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @author       No21-lqz
// @description  Track your complete AO3 journey as both creator and reader. Now with local caching for faster subsequent scans!
// @match        https://archiveofourown.org/*
// @match        https://www.archiveofourown.org/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/562337/AO3%20Journey%3A%20English%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/562337/AO3%20Journey%3A%20English%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        REQUEST_DELAY: 1300, // Delay between requests (ms) to respect AO3's servers
        MAX_INBOX_PAGES: 100, // Maximum inbox pages to scan
        DEBUG_MODE: false, // Set to true to see detailed logs in console
        CACHE_KEY: 'ao3_journey_cache', // localStorage key for cached data
        CACHE_VERSION: 2, // Increment this to invalidate old caches (v2: added topWork tracking)
        PROGRESS_KEY: 'ao3_journey_progress', // localStorage key for scan progress
        SAVE_INTERVAL: 5, // Save progress every N pages
    };
    
    // Debug logging helper
    function debugLog(...args) {
        if (CONFIG.DEBUG_MODE) {
            console.log('[AO3 Journey]', ...args);
        }
    }

    // ==================== STATE ====================
    let isScanning = false; 
    let yearlyStats = {};
    let allWorksDebug = []; // Store all works with their parsed dates for debugging
    let hasConfirmedAnnualReport = false; // Track if user has already seen confirmation
    let isIncrementalScan = false; // Track if this is a partial scan (using cache)
    let cachedYears = []; // Years loaded from cache
    
    // Tags to exclude from "other tags" (these are archive warnings, not tropes)
    const ARCHIVE_WARNINGS = [
        "Creator Chose Not To Use Archive Warnings",
        "Graphic Depictions Of Violence", 
        "Major Character Death",
        "No Archive Warnings Apply",
        "Rape/Non-Con",
        "Underage"
    ];

    // ==================== STYLES ====================
    const styles = `
        #floating-journey-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #990000 0%, #660000 100%);
            color: white;
            border: 2px solid rgba(255,255,255,0.3);
            padding: 14px 24px;
            border-radius: 50px;
            font-weight: bold;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 999999;
            cursor: pointer;
            font-size: 15px;
            font-family: 'Segoe UI', system-ui, sans-serif;
            transition: all 0.2s ease;
        }
        #floating-journey-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(0,0,0,0.6);
        }
        
        #journey-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(ellipse at center, 
                rgba(249, 249, 249, 1) 0%,
                rgba(249, 249, 249, 1) 50%,
                rgba(249, 249, 249, 0.97) 60%,
                rgba(249, 249, 249, 0.9) 70%,
                rgba(249, 249, 249, 0.75) 80%,
                rgba(249, 249, 249, 0.5) 90%,
                rgba(249, 249, 249, 0.2) 100%
            );
            z-index: 1000000;
            display: none;
            flex-direction: column;
            align-items: center;
            font-family: 'Segoe UI', system-ui, sans-serif;
            color: #111;
            overflow-y: auto;
            box-sizing: border-box;
            padding: 0;
        }
        
        #journey-wrapper {
            width: 100%;
            max-width: 650px;
            margin: 80px auto 20px auto;
            background: rgba(255, 255, 255, 0.98);
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }
        
        #journey-header {
            position: relative;
            top: 0;
            background: transparent !important;
            backdrop-filter: none;
            padding: 15px 15px 15px 15px;
            z-index: 100;
            border-bottom: none;
            border-radius: 20px 20px 0 0;
        }
        
        /* Mobile: smaller header */
        @media (max-width: 480px) {
            #journey-header {
                padding: 10px 10px 10px 10px;
            }
        }
        
        #journey-header.hidden {
            display: none;
        }
        
        #journey-header-buttons {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
        }
        
        #journey-title {
            color: #990000;
            margin: 0;
            font-family: 'Times New Roman', Times, serif;
            font-size: 1.4em;
            font-weight: normal;
            letter-spacing: -0.5px;
            text-align: left;
        }
        
        #journey-title-container {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 12px;
            margin-bottom: 10px;
            padding-left: 10px;
        }
        
        #ao3-header-logo {
            height: 36px;
            width: auto;
        }
        
        @media (max-width: 480px) {
            #journey-header-buttons {
                margin-bottom: 8px;
            }
            #journey-title {
                font-size: 1.1em;
            }
            #journey-title-container {
                gap: 8px;
                margin-bottom: 8px;
                padding-left: 5px;
            }
            #ao3-header-logo {
                height: 28px;
            }
        }
        
        #close-journey,
        #export-journey,
        #refresh-journey {
            background: #990000 !important;
            background-color: #990000 !important;
            background-image: none !important;
            color: #ffffff !important;
            border: none !important;
            border-color: transparent !important;
            padding: 10px 20px !important;
            border-radius: 50px !important;
            font-weight: bold !important;
            font-size: 13px !important;
            cursor: pointer !important;
            transition: all 0.2s ease;
            box-shadow: none !important;
            text-shadow: none !important;
        }
        #close-journey:hover,
        #close-journey:active,
        #close-journey:focus,
        #export-journey:hover,
        #export-journey:active,
        #export-journey:focus,
        #refresh-journey:hover,
        #refresh-journey:active,
        #refresh-journey:focus {
            background: #bb0000 !important;
            background-color: #bb0000 !important;
            color: #ffffff !important;
        }
        #export-journey,
        #refresh-journey {
            display: none;
            margin-right: 8px !important;
        }
        #export-journey.visible,
        #refresh-journey.visible {
            display: inline-block;
        }
        #export-journey:disabled,
        #refresh-journey:disabled {
            opacity: 0.6 !important;
            cursor: wait !important;
        }
        
        @media (max-width: 480px) {
            #close-journey,
            #export-journey,
            #refresh-journey {
                padding: 8px 12px !important;
                font-size: 11px !important;
            }
        }
        
        #annual-report-banner {
            margin: 15px 0;
            padding: 0 20px;
            text-align: center;
        }
        
        .annual-report-tab {
            display: inline-block;
            padding: 12px 28px !important;
            background: linear-gradient(135deg, #990000 0%, #cc3333 50%, #990000 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 25px !important;
            font-weight: 700 !important;
            font-size: 15px !important;
            cursor: pointer;
            animation: tabGlow 2s ease-in-out infinite;
            box-shadow: 0 4px 15px rgba(153, 0, 0, 0.3);
            transition: all 0.2s ease;
        }
        
        .annual-report-tab:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(153, 0, 0, 0.4);
        }
        
        /* Mobile: smaller annual tab */
        @media (max-width: 480px) {
            .annual-report-tab {
                padding: 6px 12px !important;
                font-size: 11px !important;
                border-radius: 15px !important;
            }
            #annual-report-banner {
                margin: 5px 0;
                padding: 0 10px !important;
            }
        }
        
        #year-tabs {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            padding: 0 20px 10px 20px;
        }
        
        .year-tab {
            padding: 10px 18px;
            background: #fff;
            color: #666;
            border: 1px solid #ddd;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
        }
        .year-tab:hover {
            background: #f5f5f5;
            color: #333;
        }
        .year-tab.active {
            background: linear-gradient(135deg, #990000 0%, #cc0000 100%);
            color: white;
            border-color: #990000;
        }
        
        #journey-content {
            padding: 20px;
            padding-bottom: 30px;
            width: 100%;
            box-sizing: border-box;
        }
        
        .year-view {
            display: none;
            animation: fadeIn 0.3s ease;
            padding-bottom: 20px;
        }
        .year-view.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .section-card {
            background: #fff;
            padding: 20px;
            border-radius: 16px;
            border: 1px solid #e0e0e0;
            margin-bottom: 15px;
            box-sizing: border-box;
            box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.1);
        }
        .section-card:last-child {
            margin-bottom: 0;
        }
        .section-card.creator {
            border-left: 4px solid #990000;
            background: linear-gradient(135deg, #fff 0%, #fff5f5 100%);
        }
        .section-card.reader {
            border-left: 4px solid #2a9d8f;
            background: linear-gradient(135deg, #fff 0%, #f5fffd 100%);
        }
        
        .section-title {
            font-size: 16px;
            font-weight: 700;
            text-transform: none;
            letter-spacing: 0.5px;
            margin: 0 0 20px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .section-card.creator .section-title { color: #990000; }
        .section-card.reader .section-title { color: #2a9d8f; }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 25px;
        }
        
        .stat-box {
            background: rgba(0,0,0,0.04);
            padding: 15px;
            border-radius: 12px;
        }
        .stat-label {
            font-size: 12px;
            color: #555;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
            font-weight: 600;
        }
        .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #111;
            line-height: 1;
        }
        
        .subsection-label {
            font-size: 14px;
            font-weight: 600;
            color: #444;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 20px 0 10px 0;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .subsection-label:first-of-type {
            margin-top: 0;
            padding-top: 0;
            border-top: none;
        }
        
        .list-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
            font-size: 13px;
        }
        .list-item:last-child {
            border-bottom: none;
        }
        
        .list-item-title {
            color: #111;
            font-weight: 600;
            flex: 1;
            margin-right: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .list-item-value {
            color: #990000;
            font-weight: 700;
            white-space: nowrap;
        }
        .section-card.reader .list-item-value {
            color: #2a9d8f;
        }
        
        .work-link {
            color: #111 !important;
            font-weight: 600;
            text-decoration: none;
            transition: color 0.2s;
        }
        .work-link:hover {
            color: #990000 !important;
        }
        
        .empty-state {
            color: #888;
            font-size: 12px;
            font-style: italic;
            padding: 10px 0;
        }
        
        #progress-view {
            text-align: center;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 50vh;
        }
        #progress-title {
            font-size: 1.3em;
            font-weight: 700;
            margin-bottom: 20px;
            color: #990000;
        }
        #progress-title .dots {
            display: inline-block;
        }
        #progress-title .dots::after {
            content: '';
            animation: dots 1.5s steps(4, end) infinite;
        }
        @keyframes dots {
            0% { content: ''; }
            25% { content: '.'; }
            50% { content: '..'; }
            75% { content: '...'; }
            100% { content: ''; }
        }
        #progress-status {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
        }
        #progress-bar-container {
            background: #ddd;
            border-radius: 10px;
            height: 8px;
            overflow: hidden;
            margin: 0 auto 10px auto;
            width: 80%;
            max-width: 300px;
        }
        #progress-bar {
            background: linear-gradient(90deg, #990000 0%, #cc3333 100%);
            height: 100%;
            width: 0%;
            transition: width 0.3s ease;
            border-radius: 10px;
        }
        #progress-detail {
            color: #888;
            font-size: 12px;
        }
        
        #results-view {
            display: none;
        }
        
        /* ==================== ANNUAL REPORT STYLES ==================== */
        
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap');
        
        @keyframes tabGlow {
            0%, 100% { box-shadow: 0 4px 15px rgba(153, 0, 0, 0.3); }
            50% { box-shadow: 0 4px 25px rgba(204, 51, 51, 0.5); }
        }
        
        .annual-report-view {
            display: none;
            font-family: 'Georgia', 'Times New Roman', serif !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
        }
        .annual-report-view.active {
            display: block;
            animation: fadeIn 0.5s ease;
        }
        
        /* Desktop wrapper - clean white background */
        .annual-report-wrapper {
            width: 100%;
            min-height: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 0;
            box-sizing: border-box;
            background: #fff;
        }
        
        .annual-report-container {
            background: linear-gradient(180deg, 
                #ffffff 0%, 
                #fff8f8 15%, 
                #fff5f5 30%, 
                #fff0f0 50%, 
                #fff5f5 70%, 
                #fff8f8 85%, 
                #ffffff 100%);
            padding: 15px 15px 10px 15px;
            position: relative;
            overflow: hidden;
            /* Auto height based on content */
            width: 100%;
            min-height: auto;
            display: block;
            box-sizing: border-box;
        }
        
        /* AO3 Branding in annual report */
        .report-branding {
            position: absolute;
            top: 3px;
            left: 3px;
            display: flex;
            align-items: center;
            gap: 6px;
            z-index: 10;
        }
        
        .report-branding-logo {
            height: 20px;
            width: auto;
        }
        
        .report-branding-text {
            font-family: 'Times New Roman', Times, serif;
            font-size: 16px;
            font-weight: normal;
            color: #990000;
            line-height: 20px;
        }
        
        /* Carousel wrapper */
        .report-carousel {
            position: relative;
            overflow: hidden;
            touch-action: pan-x;
        }
        
        .report-carousel-track {
            display: flex;
            transition: transform 0.3s ease-in-out;
            will-change: transform;
        }
        
        .report-page {
            width: 100%;
            min-width: 100%;
            flex-shrink: 0;
            padding: 0 10px;
            box-sizing: border-box;
        }
        
        .report-page .report-section {
            flex: none;
            display: block;
            height: auto;
        }
        
        /* Page indicators */
        .page-indicators {
            display: flex;
            justify-content: center;
            gap: 12px;
            padding: 12px 0 8px 0;
            flex-shrink: 0;
        }
        
        .page-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ddd;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            padding: 0;
        }
        
        .page-dot.active {
            background: #8B0000;
            transform: scale(1.2);
        }
        
        .page-dot:hover {
            background: #cc6666;
        }
        
        /* Swipe hint */
        .swipe-hint {
            text-align: center;
            color: #999;
            font-size: 12px;
            padding: 5px 0;
            opacity: 1;
            transition: opacity 0.5s ease;
            flex-shrink: 0;
        }
        
        .swipe-hint.hidden {
            opacity: 0;
            height: 0;
            padding: 0;
        }
        
        /* Page title label */
        .page-label {
            text-align: center;
            font-size: 16px;
            color: #990000;
            font-weight: 700;
            margin-top: 5px;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 3px;
            flex-shrink: 0;
        }
        
        @media (max-width: 480px) {
            .page-label {
                margin-top: 0;
                margin-bottom: 6px;
            }
        }
        
        @media (min-width: 768px) {
            .page-label {
                font-size: 18px;
                margin-top: 8px;
                margin-bottom: 15px;
            }
        }
        
        /* Subtle floating particles - light theme */
        /* NOTE: This pseudo-element causes issues with html2canvas export */
        /* The export function injects styles to disable it during capture */
        .annual-report-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                radial-gradient(2px 2px at 20px 30px, rgba(153,0,0,0.08), transparent),
                radial-gradient(2px 2px at 40px 70px, rgba(204,51,51,0.06), transparent),
                radial-gradient(2px 2px at 50px 160px, rgba(153,0,0,0.06), transparent),
                radial-gradient(2px 2px at 90px 40px, rgba(153,0,0,0.08), transparent),
                radial-gradient(2px 2px at 130px 80px, rgba(204,51,51,0.06), transparent),
                radial-gradient(2px 2px at 160px 120px, rgba(153,0,0,0.06), transparent);
            background-size: 200px 200px;
            pointer-events: none;
        }
        
        /* Hide particles in export mode - prevents html2canvas createPattern error */
        .export-mode .annual-report-container::before {
            content: none !important;
            display: none !important;
            background: none !important;
            background-image: none !important;
        }
        
        .report-header {
            text-align: center;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }
        
        .report-year {
            font-size: 60px;
            font-weight: 700;
            background: linear-gradient(135deg, #990000 0%, #cc3333 50%, #990000 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
            margin-bottom: 8px;
        }
        
        .report-subtitle {
            font-size: 16px;
            color: #666;
            letter-spacing: 4px;
            margin-bottom: 25px;
        }
        
        .report-section {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 18px;
            margin-bottom: 15px;
            border: 1px solid rgba(153, 0, 0, 0.1);
            box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.15);
            position: relative;
            z-index: 1;
        }
        
        .report-section.creator {
            border-left: 4px solid #990000;
        }
        
        .report-section.reader {
            border-left: 4px solid #cc3333;
        }
        
        .report-text {
            font-size: 17px;
            line-height: 1.8;
            color: #111;
            text-align: justify;
            margin-bottom: 12px;
        }
        
        .report-text:last-child {
            margin-bottom: 0;
        }
        
        .nowrap {
            white-space: nowrap;
            display: inline;
        }
        
        .report-highlight {
            color: #b8860b;
            font-weight: 700;
            font-size: 1.35em;
        }
        
        .report-highlight.pink {
            color: #990000;
        }
        
        .report-highlight.blue {
            color: #cc3333;
        }
        
        .report-highlight.green {
            color: #228b22;
        }
        
        .report-number {
            font-size: 1.5em;
            font-weight: 700;
            color: #990000;
        }
        
        .report-emoji {
            font-size: 1.1em;
            margin: 0 2px;
        }
        
        .report-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(153,0,0,0.2), transparent);
            margin: 14px 0;
        }
        
        .report-footer {
            text-align: center;
            margin-top: 20px;
            padding: 15px 20px 20px 20px;
            position: relative;
            z-index: 1;
        }
        
        
        .report-quote {
            font-size: 17px;
            color: #444;
            font-style: italic;
            margin-bottom: 12px;
            padding: 0 10px;
        }
        
        .report-blessing {
            font-size: 22px;
            font-weight: 700;
            background: linear-gradient(135deg, #990000 0%, #cc3333 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .report-decoration {
            font-size: 16px;
            color: rgba(153, 0, 0, 0.4);
            margin-bottom: 6px;
            letter-spacing: 8px;
        }
        
        .report-decoration-end {
            font-size: 20px;
            margin-top: 8px;
            opacity: 0.8;
        }
        
        .years-badge {
            display: inline-block;
            background: linear-gradient(135deg, #990000 0%, #cc3333 100%);
            color: white;
            padding: 10px 22px;
            border-radius: 50px;
            font-size: 17px;
            margin-bottom: 20px;
            box-shadow: 0 4px 15px rgba(153, 0, 0, 0.4);
            text-align: center;
        }
        
        .years-badge .report-number {
            color: #fff;
            font-weight: 700;
            font-size: 1.3em;
        }
        
        /* ==================== CONFIRMATION UI (AO3 Exact Style) ==================== */
        
        .report-confirm-view {
            display: none;
            background: transparent;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
        }
        .report-confirm-view.active {
            display: block;
        }
        
        .confirm-container {
            padding: 40px 5px;
            max-width: 95%;
            width: 100%;
            margin: 0 auto;
            font-family: Georgia, serif;
            font-size: 14px;
            color: #333;
            background: #fff;
            border-radius: 12px;
            box-sizing: border-box;
        }
        
        .confirm-branding {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 8px;
            margin-bottom: 15px;
            padding-left: 5px;
        }
        
        .confirm-branding-logo {
            height: 30px;
            width: auto;
        }
        
        .confirm-branding-text {
            font-family: 'Times New Roman', Times, serif;
            font-size: 20px;
            font-weight: normal;
            color: #990000;
            line-height: 30px;
        }
        
        .confirm-warning-box {
            background: #ffe34e;
            border: 1px solid #d89e36;
            border-radius: 8px;
            padding: 3px;
            margin-bottom: 15px;
            box-shadow: inset 1px 1px 0 #4e4518, inset 2px 2px 0 #b39f37;
        }
        
        .confirm-warning-text {
            color: #333;
            font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
            font-size: 0.875em;
            line-height: 1.286;
            font-weight: normal;
            margin: 0;
            padding: 0;
        }
        
        .confirm-buttons {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }
        
        .confirm-btn {
            padding: 5px 15px !important;
            font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif !important;
            font-size: 0.875em !important;
            font-weight: normal !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            text-decoration: none !important;
            color: #333 !important;
        }
        
        .confirm-btn.yes {
            background: #eee !important;
            background-color: #eee !important;
            background-image: linear-gradient(to bottom, #fff 0%, #ddd 100%) !important;
            border: 1px solid #bbb !important;
            box-shadow: inset 0 -2px 3px #aaaaaa !important;
        }
        .confirm-btn.yes:hover {
            background: #ddd !important;
            background-image: linear-gradient(to bottom, #eee 0%, #ccc 100%) !important;
        }
        
        .confirm-btn.no {
            background: #ddd !important;
            background-color: #ddd !important;
            background-image: linear-gradient(to bottom, #ddd 0%, #ccc 100%) !important;
            border: 1px solid #bbb !important;
            box-shadow: inset 0 -2px 3px #aaaaaa !important;
        }
        .confirm-btn.no:hover {
            background: #ccc !important;
            background-image: linear-gradient(to bottom, #ccc 0%, #bbb 100%) !important;
        }
        
        /* Mobile: ensure warning text is not bold */
        @media (max-width: 480px) {
            .confirm-warning-text {
                font-weight: normal !important;
            }
        }
        
        .confirm-subtitle {
            color: #666;
            font-size: 11px;
            line-height: 1.5;
        }
        
        /* ==================== EXPORT-SAFE STYLES ==================== */
        /* When .export-mode is added, switch to html2canvas-friendly styles */
        
        .export-mode, 
        .export-mode * {
            /* Remove all problematic effects globally */
            -webkit-backdrop-filter: none !important;
            backdrop-filter: none !important;
            animation: none !important;
            transition: none !important;
        }
        
        /* Remove all pseudo-elements in export mode */
        .export-mode *::before,
        .export-mode *::after {
            display: none !important;
            content: '' !important;
            background: none !important;
        }
        
        /* Solid backgrounds instead of gradients */
        .export-mode #journey-overlay {
            background: #f9f9f9 !important;
        }
        
        .export-mode #journey-wrapper {
            background: #ffffff !important;
            box-shadow: none !important;
        }
        
        .export-mode .annual-report-container {
            background: #fff5f5 !important;
            margin: 0 !important;
            border-radius: 0 !important;
        }
        
        .export-mode .report-branding {
            position: absolute !important;
            top: 8px !important;
            left: 8px !important;
            display: flex !important;
            gap: 8px !important;
            z-index: 10 !important;
        }
        
        .export-mode .report-branding-logo {
            height: 24px !important;
            width: auto !important;
        }
        
        .export-mode .report-branding-text {
            font-family: 'Times New Roman', Times, serif !important;
            font-size: 20px !important;
            font-weight: normal !important;
            color: #990000 !important;
            line-height: 24px !important;
        }
        
        .export-mode .annual-report-wrapper {
            padding: 0 !important;
            margin: 0 !important;
        }
        
        .export-mode .annual-report-view {
            padding: 0 !important;
            margin: 0 !important;
        }
        
        .export-mode .report-section {
            background: #ffffff !important;
            opacity: 1 !important;
        }
        
        .export-mode .section-card {
            background: #ffffff !important;
        }
        
        .export-mode .section-card.creator {
            background: #fff5f5 !important;
        }
        
        .export-mode .section-card.reader {
            background: #f5fffd !important;
        }
        
        .export-mode .stat-box {
            background: #ffffff !important;
            border: 1px solid #eee !important;
        }
        
        .export-mode .list-item {
            background: #ffffff !important;
            border: 1px solid #eee !important;
        }
        
        /* Fix gradient text - use solid color */
        .export-mode .report-year,
        .export-mode .report-blessing {
            background: none !important;
            -webkit-background-clip: unset !important;
            background-clip: unset !important;
            -webkit-text-fill-color: #990000 !important;
            color: #990000 !important;
        }
        
        /* Solid button backgrounds */
        .export-mode .years-badge {
            background: #990000 !important;
        }
        
        .export-mode .year-tab {
            background: #ffffff !important;
        }
        
        .export-mode .year-tab.active,
        .export-mode .annual-report-tab {
            background: #990000 !important;
            box-shadow: none !important;
        }
        
        .export-mode #floating-journey-btn,
        .export-mode #close-journey,
        .export-mode #export-journey,
        .export-mode #journey-header-buttons {
            display: none !important;
        }
        
        /* Keep nowrap in export mode */
        .export-mode .nowrap {
            white-space: nowrap !important;
        }
        
        /* Hide inactive views */
        .export-mode .year-view:not(.active),
        .export-mode .annual-report-view:not(.active),
        .export-mode .report-confirm-view {
            display: none !important;
            height: 0 !important;
            overflow: hidden !important;
        }
        
        /* Mobile: smaller text for annual report */
        @media (max-width: 480px) {
            .report-year {
                font-size: 42px !important;
            }
            .report-subtitle {
                font-size: 13px !important;
                letter-spacing: 2px !important;
                margin-bottom: 15px !important;
            }
            .years-badge {
                font-size: 13px !important;
                padding: 8px 16px !important;
                margin-bottom: 12px !important;
            }
            .years-badge .report-number {
                font-size: 1.2em !important;
            }
            .report-section {
                padding: 12px !important;
                margin-bottom: 10px !important;
            }
            .report-text {
                font-size: 14px !important;
                line-height: 1.7 !important;
                margin-bottom: 8px !important;
            }
            .report-highlight {
                font-size: 1.15em !important;
            }
            .report-number {
                font-size: 1.2em !important;
            }
            .report-emoji {
                font-size: 1em !important;
            }
            .report-divider {
                margin: 10px 0 !important;
            }
            .report-footer {
                margin-top: 12px !important;
                padding: 10px 15px 15px 15px !important;
            }
            .report-quote {
                font-size: 14px !important;
            }
            .report-blessing {
                font-size: 18px !important;
            }
            .annual-report-wrapper {
                padding: 0 !important;
                background: #fff !important;
            }
            .annual-report-container {
                padding: 10px 10px 8px 10px !important;
                min-height: auto !important;
            }
            .report-header {
                padding-top: 10px !important;
            }
            .report-carousel {
                margin: 0;
            }
            .report-page {
                padding: 0 5px;
            }
            .page-label {
                font-size: 14px !important;
                margin-top: 0 !important;
                margin-bottom: 6px !important;
            }
            .page-indicators {
                padding: 8px 0 5px 0 !important;
            }
            .page-dot {
                width: 8px !important;
                height: 8px !important;
            }
            .swipe-hint {
                font-size: 10px !important;
                padding: 3px 0 !important;
            }
            .report-text {
                font-size: 15px !important;
                line-height: 1.7 !important;
                margin-bottom: 10px !important;
            }
            .report-divider {
                margin: 12px 0 !important;
            }
            
            /* Year tabs smaller */
            .year-tab {
                padding: 6px 12px !important;
                font-size: 12px !important;
            }
            #year-tabs {
                gap: 5px !important;
                padding: 0 10px 8px 10px !important;
            }
            
            /* Section cards smaller */
            .section-card {
                padding: 12px !important;
                margin-bottom: 10px !important;
            }
            .section-title {
                font-size: 14px !important;
                margin-bottom: 12px !important;
            }
            .stats-grid {
                gap: 8px !important;
                margin-bottom: 15px !important;
            }
            .stat-box {
                padding: 10px !important;
            }
            .stat-label {
                font-size: 10px !important;
            }
            .stat-value {
                font-size: 22px !important;
            }
            .list-item {
                font-size: 12px !important;
                padding: 8px 0 !important;
            }
            .subsection-label {
                font-size: 12px !important;
                font-weight: 600 !important;
                color: #444 !important;
                margin: 12px 0 8px 0 !important;
            }
        }
    `;

    // ==================== UTILITIES ====================

    /**
     * Get the current logged-in username from the page
     */
    function getLoggedInUsername() {
        // Method 1: Look for "Hi, username!" pattern in greeting (most reliable)
        const greeting = document.getElementById('greeting');
        if (greeting) {
            const text = greeting.textContent || '';
            const hiMatch = text.match(/Hi,\s*([A-Za-z0-9_-]+)/i);
            if (hiMatch && hiMatch[1].length > 1 && hiMatch[1].length < 50) {
                debugLog('Found username via Hi greeting:', hiMatch[1]);
                return hiMatch[1];
            }
        }
        
        // Method 2: Search header area only for "Hi, username" pattern (optimized fallback)
        const headerArea = document.querySelector('header, #header, .header, nav, .navigation');
        if (headerArea) {
            const text = headerArea.textContent || '';
            const match = text.match(/Hi,\s*([A-Za-z0-9_-]+)/i);
            if (match && match[1].length > 1 && match[1].length < 50) {
                debugLog('Found username via header search:', match[1]);
                return match[1];
            }
        }
        
        // Method 3: Try selectors for user links
        const selectors = [
            '#greeting .user a[href^="/users/"]',
            '#greeting a[href^="/users/"]',
            'a.user[href^="/users/"]',
            '.navigation a[href^="/users/"]',
            'a[href*="/users/"][href*="/pseuds/"]'
        ];
        
        for (const selector of selectors) {
            const userMenu = document.querySelector(selector);
            if (userMenu) {
                const href = userMenu.getAttribute('href');
                const match = href.match(/\/users\/([^/]+)/);
                if (match) {
                    debugLog('Found username via selector:', selector, '→', match[1]);
                    return decodeURIComponent(match[1]);
                }
            }
        }
        
        debugLog('⚠️ Could not find username. Available links:', 
            Array.from(document.querySelectorAll('a[href*="/users/"]')).slice(0, 5).map(a => a.href));
        return null;
    }

    /**
     * Sleep for a specified duration
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Fetch a page and parse it as HTML
     */
    async function fetchPage(url) {
        const response = await fetch(url, {
            credentials: 'include',
            headers: { 'Accept': 'text/html' }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        return parser.parseFromString(text, 'text/html');
    }

    /**
     * Get total pages from pagination element
     */
    function getTotalPages(doc) {
        const pagination = doc.querySelector('ol.pagination');
        if (!pagination) return 1;

        const pageLinks = pagination.querySelectorAll('li a');
        let maxPage = 1;
        
        pageLinks.forEach(link => {
            const num = parseInt(link.textContent, 10);
            if (!isNaN(num) && num > maxPage) {
                maxPage = num;
            }
        });
        
        return maxPage;
    }

    /**
     * Parse a date string and extract the year reliably
     * Handles formats like "31 Dec 2025", "Dec 31, 2025", "2025-12-31"
     */
    function extractYear(dateStr) {
        if (!dateStr) return null;
        
        // Try to find a 4-digit year directly in the string
        const yearMatch = dateStr.match(/\b(20\d{2}|19\d{2})\b/);
        if (yearMatch) {
            return parseInt(yearMatch[1], 10);
        }
        
        return null;
    }

    /**
     * Parse AO3 date format reliably
     * AO3 uses formats like "31 Dec 2025" or "2025-12-31"
     */
    function parseAO3Date(dateStr) {
        if (!dateStr) return null;
        
        // First, try to extract year directly
        const year = extractYear(dateStr);
        if (!year) return null;
        
        // Try to parse month and day
        // Format: "31 Dec 2025" or "Dec 31, 2025"
        const months = {
            'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
            'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
        };
        
        const monthMatch = dateStr.toLowerCase().match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*/);
        const dayMatch = dateStr.match(/\b(\d{1,2})\b/);
        
        if (monthMatch && dayMatch) {
            const month = months[monthMatch[1].substring(0, 3)];
            const day = parseInt(dayMatch[1], 10);
            return new Date(year, month, day);
        }
        
        // Fallback: just return a date with the year
        return new Date(year, 0, 1);
    }

    /**
     * Convert relative time string to year
     * Handles "5 days ago", "2 months ago", "1 year ago", etc.
     */
    function parseRelativeTime(relativeStr) {
        if (!relativeStr) return null;
        
        const now = new Date();
        const str = relativeStr.toLowerCase().trim();
        
        // Check for "X days ago"
        let match = str.match(/(\d+)\s*days?\s*ago/);
        if (match) {
            const days = parseInt(match[1], 10);
            const date = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
            return date.getFullYear();
        }
        
        // Check for "X weeks ago"
        match = str.match(/(\d+)\s*weeks?\s*ago/);
        if (match) {
            const weeks = parseInt(match[1], 10);
            const date = new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);
            return date.getFullYear();
        }
        
        // Check for "X months ago"
        match = str.match(/(\d+)\s*months?\s*ago/);
        if (match) {
            const months = parseInt(match[1], 10);
            const date = new Date(now);
            date.setMonth(date.getMonth() - months);
            return date.getFullYear();
        }
        
        // Check for "X years ago"
        match = str.match(/(\d+)\s*years?\s*ago/);
        if (match) {
            const years = parseInt(match[1], 10);
            return now.getFullYear() - years;
        }
        
        // Check for "a day ago", "a week ago", "a month ago", "a year ago"
        if (str.includes('a day ago') || str.includes('1 day ago') || str.includes('yesterday')) {
            const date = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            return date.getFullYear();
        }
        if (str.includes('a week ago')) {
            const date = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return date.getFullYear();
        }
        if (str.includes('a month ago')) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - 1);
            return date.getFullYear();
        }
        if (str.includes('a year ago')) {
            return now.getFullYear() - 1;
        }
        
        // Check for "today" or "less than"
        if (str.includes('today') || str.includes('less than') || str.includes('hour') || str.includes('minute') || str.includes('second')) {
            return now.getFullYear();
        }
        
        // Try to find a year directly in the string as fallback
        return extractYear(relativeStr);
    }

    /**
     * Initialize yearly stats structure for a year
     */
    function initYear(year) {
        if (!yearlyStats[year]) {
            yearlyStats[year] = {
                creator: {
                    works: 0,
                    words: 0,
                    kudos: 0,
                    comments: 0,
                    hits: 0,
                    fandoms: {},
                    relationships: {},
                    tags: {},
                    topWorks: [],
                    commenters: {},
                    kudosGivers: {} // Track who gave kudos
                },
                reader: {
                    fics: 0,
                    words: 0,
                    matureClicks: 0,
                    fandoms: {},
                    relationships: {},
                    tags: {},
                    workVisits: {},
                    authors: {} // Track authors: { authorName: { works: 0, visits: 0 } }
                }
            };
        }
    }
    
    /**
     * Parse AO3 date string to Date object
     * Handles "01 Apr 2025", "2025-04-01", etc.
     */
    function parseAO3DateToDate(dateStr) {
        if (!dateStr) return null;
        
        const months = {
            'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
            'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
        };
        
        // Try format: "01 Apr 2025" or "Apr 01, 2025"
        const match1 = dateStr.match(/(\d{1,2})\s+(\w{3})\w*\s+(\d{4})/);
        if (match1) {
            const day = parseInt(match1[1], 10);
            const month = months[match1[2].toLowerCase().substring(0, 3)];
            const year = parseInt(match1[3], 10);
            if (month !== undefined) {
                return new Date(year, month, day);
            }
        }
        
        // Try format: "Apr 01, 2025"
        const match2 = dateStr.match(/(\w{3})\w*\s+(\d{1,2}),?\s+(\d{4})/);
        if (match2) {
            const month = months[match2[1].toLowerCase().substring(0, 3)];
            const day = parseInt(match2[2], 10);
            const year = parseInt(match2[3], 10);
            if (month !== undefined) {
                return new Date(year, month, day);
            }
        }
        
        // Try ISO format: "2025-04-01"
        const match3 = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (match3) {
            return new Date(parseInt(match3[1], 10), parseInt(match3[2], 10) - 1, parseInt(match3[3], 10));
        }
        
        // Fallback to extracting just the year
        const year = extractYear(dateStr);
        if (year) {
            return new Date(year, 0, 1); // Jan 1 of that year
        }
        
        return null;
    }
    
    /**
     * Calculate days in each year between two dates
     * Returns an object like { 2025: 275, 2026: 10 }
     */
    // Optimized: O(years) instead of O(days) - no day-by-day iteration
    function calculateDaysPerYear(startDate, endDate) {
        const result = {};
        
        if (!startDate || !endDate || startDate > endDate) {
            // Fallback: if dates are invalid, use the year from startDate
            if (startDate) {
                result[startDate.getFullYear()] = 1;
            }
            return result;
        }
        
        const startYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();
        
        for (let year = startYear; year <= endYear; year++) {
            const yearStart = new Date(year, 0, 1);
            const yearEnd = new Date(year, 11, 31);
            
            const rangeStart = year === startYear ? startDate : yearStart;
            const rangeEnd = year === endYear ? endDate : yearEnd;
            
            const days = Math.floor((rangeEnd - rangeStart) / (1000 * 60 * 60 * 24)) + 1;
            if (days > 0) {
                result[year] = days;
            }
        }
        
        return result;
    }

    /**
     * Add to object counter
     */
    function addToCounter(obj, key, value = 1) {
        if (!key || key.trim() === '') return;
        const cleanKey = key.trim();
        obj[cleanKey] = (obj[cleanKey] || 0) + value;
    }
    
    /**
     * Clean relationship tag - remove "- Relationship" suffix
     */
    function cleanRelationshipTag(tag) {
        if (!tag) return tag;
        return tag.replace(/\s*-\s*Relationship$/i, '').trim();
    }
    
    /**
     * Extract AO3 logo from page and display in Journey header
     */
    function extractAO3Logo() {
        const logoContainer = document.getElementById('ao3-logo-container');
        if (!logoContainer) return;
        
        // Clear any existing content
        logoContainer.innerHTML = '';
        
        // Use AO3's logo URL directly (more reliable than cloning)
        const logoImg = document.createElement('img');
        logoImg.src = 'https://archiveofourown.org/images/ao3_logos/logo_42.png';
        logoImg.alt = 'AO3';
        logoImg.style.height = '36px';
        logoImg.style.width = 'auto';
        logoContainer.appendChild(logoImg);
    }

    /**
     * Update progress display
     */
    function updateProgress(status, detail = '', percent = null) {
        const statusEl = document.getElementById('progress-status');
        const detailEl = document.getElementById('progress-detail');
        const barEl = document.getElementById('progress-bar');
        
        if (statusEl) statusEl.textContent = status;
        if (detailEl) detailEl.textContent = detail;
        if (barEl && percent !== null) barEl.style.width = `${percent}%`;
    }

    // ==================== LOCAL STORAGE CACHE ====================
    
    /**
     * Get cache data from localStorage
     * Returns null if no cache, cache is invalid, or belongs to different user
     */
    function loadCache(username) {
        try {
            const raw = localStorage.getItem(CONFIG.CACHE_KEY);
            if (!raw) {
                debugLog('No cache found in localStorage');
                return null;
            }
            
            const cache = JSON.parse(raw);
            
            // Validate cache structure and version
            if (!cache || cache.version !== CONFIG.CACHE_VERSION) {
                debugLog('Cache version mismatch, invalidating');
                localStorage.removeItem(CONFIG.CACHE_KEY);
                return null;
            }
            
            // Check if cache belongs to same user
            if (cache.username !== username) {
                debugLog('Cache belongs to different user:', cache.username, 'vs', username);
                localStorage.removeItem(CONFIG.CACHE_KEY);
                return null;
            }
            
            debugLog('Loaded cache for user:', username, '| Years:', Object.keys(cache.data || {}));
            return cache;
        } catch (e) {
            console.warn('[AO3 Journey] Failed to load cache:', e);
            localStorage.removeItem(CONFIG.CACHE_KEY);
            return null;
        }
    }
    
    /**
     * Save yearly stats to localStorage
     */
    function saveCache(username, stats) {
        try {
            const cache = {
                version: CONFIG.CACHE_VERSION,
                username: username,
                savedAt: new Date().toISOString(),
                currentYear: new Date().getFullYear(),
                data: stats
            };
            
            const json = JSON.stringify(cache);
            
            // Check size before saving (localStorage limit is ~5MB)
            const sizeKB = new Blob([json]).size / 1024;
            debugLog('Cache size:', sizeKB.toFixed(2), 'KB');
            
            if (sizeKB > 4000) {
                console.warn('[AO3 Journey] Cache too large, not saving');
                return false;
            }
            
            localStorage.setItem(CONFIG.CACHE_KEY, json);
            debugLog('Cache saved successfully for user:', username);
            return true;
        } catch (e) {
            console.warn('[AO3 Journey] Failed to save cache:', e);
            return false;
        }
    }
    
    /**
     * Clear the cache
     */
    function clearCache() {
        localStorage.removeItem(CONFIG.CACHE_KEY);
        localStorage.removeItem(CONFIG.PROGRESS_KEY);
        debugLog('Cache cleared');
    }
    
    /**
     * Save scan progress for recovery
     * @param {string} username - The username
     * @param {string} stage - 'works', 'inbox', or 'history'
     * @param {number} pageNum - Current page number (or work index for works stage)
     * @param {object} stats - Current yearlyStats data
     * @param {object} extra - Extra data for works stage (workUrls array)
     */
    function saveProgress(username, stage, pageNum, stats, extra = null) {
        try {
            const progress = {
                version: CONFIG.CACHE_VERSION,
                username: username,
                savedAt: new Date().toISOString(),
                stage: stage, // 'works', 'inbox', 'history'
                lastPage: pageNum,
                data: stats,
                extra: extra // For works stage: { workUrls: [...], workIndex: n }
            };
            localStorage.setItem(CONFIG.PROGRESS_KEY, JSON.stringify(progress));
            debugLog(`Progress saved: ${stage} page/index ${pageNum}`);
        } catch (e) {
            console.warn('[AO3 Journey] Failed to save progress:', e);
        }
    }
    
    /**
     * Load incomplete scan progress
     */
    function loadProgress(username) {
        try {
            const raw = localStorage.getItem(CONFIG.PROGRESS_KEY);
            if (!raw) return null;
            
            const progress = JSON.parse(raw);
            
            // Validate
            if (!progress || progress.version !== CONFIG.CACHE_VERSION) {
                localStorage.removeItem(CONFIG.PROGRESS_KEY);
                return null;
            }
            
            if (progress.username !== username) {
                localStorage.removeItem(CONFIG.PROGRESS_KEY);
                return null;
            }
            
            // Check if progress is recent (within 24 hours)
            const savedTime = new Date(progress.savedAt).getTime();
            const now = Date.now();
            const hoursSinceSave = (now - savedTime) / (1000 * 60 * 60);
            
            if (hoursSinceSave > 24) {
                debugLog('Progress too old, discarding');
                localStorage.removeItem(CONFIG.PROGRESS_KEY);
                return null;
            }
            
            debugLog('Found incomplete scan:', progress.stage, 'page', progress.lastPage);
            return progress;
        } catch (e) {
            localStorage.removeItem(CONFIG.PROGRESS_KEY);
            return null;
        }
    }
    
    /**
     * Clear progress (call when scan completes successfully)
     */
    function clearProgress() {
        localStorage.removeItem(CONFIG.PROGRESS_KEY);
        debugLog('Progress cleared');
    }
    
    /**
     * Get years that should be scanned (current year only if cache exists)
     * Returns: { cachedYears: [], yearsToScan: [] }
     */
    function determineScanScope(username) {
        const currentYear = new Date().getFullYear();
        const cache = loadCache(username);
        
        if (!cache || !cache.data) {
            // No cache - need full scan
            return {
                cachedYears: [],
                yearsToScan: 'all',
                cachedData: null
            };
        }
        
        const cachedYearsList = Object.keys(cache.data).map(y => parseInt(y, 10));
        
        // We have cache - only scan current year
        debugLog('Cache found with years:', cachedYearsList);
        debugLog('Will scan only current year:', currentYear);
        
        return {
            cachedYears: cachedYearsList.filter(y => y !== currentYear),
            yearsToScan: [currentYear],
            cachedData: cache.data
        };
    }

    // ==================== DATA FETCHERS ====================

    /**
     * Fetch and process creator's works
     * Now visits each individual work page to get accurate published dates
     */
    /**
     * Fetch and process creator's works
     * @param {string} username - The username to fetch works for
     * @param {number|null} targetYear - If set, only process works updated in this year
     */
    async function fetchCreatorWorks(username, targetYear = null, resumeData = null) {
        const baseUrl = `https://archiveofourown.org/users/${username}/works`;
        
        const yearLabel = targetYear ? ` (${targetYear} only)` : '';
        
        let workUrls = [];
        let startIndex = 0;
        
        // Check if resuming from saved work URLs
        if (resumeData && resumeData.workUrls && resumeData.workIndex !== undefined) {
            workUrls = resumeData.workUrls;
            startIndex = resumeData.workIndex + 1; // Start from next work
            debugLog(`📚 Resuming works scan from index ${startIndex} of ${workUrls.length}`);
            updateProgress('Resuming works scan...', `Starting from work ${startIndex + 1} of ${workUrls.length}${yearLabel}`, 5);
        } else {
            // Fresh scan - collect all work URLs
            updateProgress('Finding your works...', `Fetching works list${yearLabel}`, 2);
            
            const firstPage = await fetchPage(`${baseUrl}?page=1`);
            const totalPages = getTotalPages(firstPage);
            
            // Collect work URLs from first page, with year info if available
            collectWorkUrlsWithDates(firstPage, workUrls, targetYear);
            
            // Collect from remaining pages
            for (let page = 2; page <= totalPages; page++) {
                await sleep(CONFIG.REQUEST_DELAY);
                updateProgress('Finding your works...', `Scanning page ${page} of ${totalPages}${yearLabel}`, 2 + (page / totalPages) * 3);
                const doc = await fetchPage(`${baseUrl}?page=${page}`);
                collectWorkUrlsWithDates(doc, workUrls, targetYear);
            }
            
            debugLog(`📚 Found ${workUrls.length} works to scan${yearLabel}`);
            
            // Save initial progress with work URLs
            if (workUrls.length > 0) {
                saveProgress(username, 'works', -1, yearlyStats, { workUrls: workUrls, workIndex: -1 });
            }
        }
        
        // Now visit each work's individual page to get accurate dates
        for (let i = startIndex; i < workUrls.length; i++) {
            const workUrl = workUrls[i];
            await sleep(CONFIG.REQUEST_DELAY);
            
            const progress = 5 + (i / workUrls.length) * 15;
            updateProgress('Scanning your works...', `Work ${i + 1} of ${workUrls.length}${yearLabel}`, progress);
            
            try {
                await processIndividualWork(workUrl, targetYear);
            } catch (e) {
                console.warn(`[AO3 Journey] Failed to process work: ${workUrl}`, e);
            }
            
            // Save progress periodically (every SAVE_INTERVAL works)
            if ((i + 1) % CONFIG.SAVE_INTERVAL === 0) {
                saveProgress(username, 'works', i, yearlyStats, { workUrls: workUrls, workIndex: i });
            }
        }
        
        // Mark works stage complete by saving progress for next stage
        debugLog('✅ Works scan complete');
    }
    
    /**
     * Collect work URLs from a works listing page (legacy - no filtering)
     */
    function collectWorkUrls(doc, urlArray) {
        const workItems = doc.querySelectorAll('li.work.blurb');
        workItems.forEach(item => {
            const link = item.querySelector('h4.heading a:first-child');
            if (link && link.href) {
                urlArray.push(link.href);
            }
        });
    }
    
    /**
     * Collect work URLs with date filtering for incremental scans
     * @param {Document} doc - The page document
     * @param {Array} urlArray - Array to push URLs to
     * @param {number|null} targetYear - If set, only include works updated in this year
     */
    function collectWorkUrlsWithDates(doc, urlArray, targetYear = null) {
        const workItems = doc.querySelectorAll('li.work.blurb');
        workItems.forEach(item => {
            const link = item.querySelector('h4.heading a:first-child');
            if (!link || !link.href) return;
            
            // If no target year filter, include all
            if (!targetYear) {
                urlArray.push(link.href);
                return;
            }
            
            // Check the date on the work blurb
            // AO3 shows the last updated date in the datetime element
            const dateEl = item.querySelector('p.datetime');
            const dateText = dateEl?.textContent?.trim() || '';
            const workYear = extractYear(dateText);
            
            // Include work if it was updated in the target year
            // We'll do more precise filtering in processIndividualWork
            if (workYear && workYear >= targetYear) {
                urlArray.push(link.href);
                debugLog('   Including work (updated', workYear, '):', link.href);
            }
        });
    }
    
    /**
     * Process an individual work page to get accurate dates
     */
    /**
     * Process an individual work page to get accurate dates
     * @param {string} workUrl - URL of the work page
     * @param {number|null} targetYear - If set, only record stats for this year
     */
    async function processIndividualWork(workUrl, targetYear = null) {
        const doc = await fetchPage(workUrl);
        
        // Get the stats section
        const statsSection = doc.querySelector('dl.work.meta.group, dl.stats');
        
        // Get published date - this is the ACTUAL published date
        const publishedEl = doc.querySelector('dd.published');
        const pubDateStr = publishedEl?.textContent?.trim() || '';
        
        // Get status/updated date
        const statusEl = doc.querySelector('dd.status');
        const statusDateStr = statusEl?.textContent?.trim() || pubDateStr;
        
        // Extract years
        const pubYear = extractYear(pubDateStr);
        const statusYear = extractYear(statusDateStr) || pubYear;
        
        if (!pubYear) {
            debugLog('⚠️ Could not find published date for:', workUrl);
            return;
        }
        
        // Get work title
        const titleEl = doc.querySelector('h2.title');
        const title = titleEl?.textContent?.trim() || 'Unknown Work';
        
        // Get stats from the stats section on the work page
        const wordsEl = doc.querySelector('dd.words');
        const kudosEl = doc.querySelector('dd.kudos');
        const commentsEl = doc.querySelector('dd.comments');
        const hitsEl = doc.querySelector('dd.hits');
        
        const words = parseInt(wordsEl?.textContent?.replace(/,/g, '') || '0', 10);
        const kudos = parseInt(kudosEl?.textContent?.replace(/,/g, '') || '0', 10);
        const comments = parseInt(commentsEl?.textContent?.replace(/,/g, '') || '0', 10);
        const hits = parseInt(hitsEl?.textContent?.replace(/,/g, '') || '0', 10);
        
        // Get tags from the work page (more reliable)
        const fandoms = Array.from(doc.querySelectorAll('dd.fandom a.tag')).map(a => a.textContent?.trim());
        const relationships = Array.from(doc.querySelectorAll('dd.relationship a.tag')).map(a => a.textContent?.trim());
        const freeformTags = Array.from(doc.querySelectorAll('dd.freeform a.tag'))
            .map(a => a.textContent?.trim())
            .filter(tag => !ARCHIVE_WARNINGS.includes(tag));
        
        // BONUS: Get kudos givers for potential "loyal readers" data
        // AO3 has the kudos list in various places - try multiple selectors
        let kudosGivers = [];
        
        // Try the #kudos paragraph (most common location at bottom of work page)
        const kudosP = doc.querySelector('#kudos');
        if (kudosP) {
            kudosGivers = Array.from(kudosP.querySelectorAll('a[href*="/users/"]'))
                .map(a => a.textContent?.trim())
                .filter(name => name && name.length > 0);
            debugLog('   Kudos section found via #kudos, found', kudosGivers.length, 'givers');
        }
        
        // Try p.kudos or span.kudos
        if (kudosGivers.length === 0) {
            const kudosAlt = doc.querySelector('p.kudos, span.kudos, div.kudos');
            if (kudosAlt) {
                kudosGivers = Array.from(kudosAlt.querySelectorAll('a[href*="/users/"]'))
                    .map(a => a.textContent?.trim())
                    .filter(name => name && name.length > 0);
                debugLog('   Kudos section found via .kudos class, found', kudosGivers.length, 'givers');
            }
        }
        
        // Try looking for kudos section by finding "left kudos" text
        if (kudosGivers.length === 0) {
            const allPs = doc.querySelectorAll('p');
            for (const p of allPs) {
                if (p.textContent?.includes('left kudos on this work')) {
                    kudosGivers = Array.from(p.querySelectorAll('a[href*="/users/"]'))
                        .map(a => a.textContent?.trim())
                        .filter(name => name && name.length > 0);
                    debugLog('   Kudos section found via "left kudos" text, found', kudosGivers.length, 'givers');
                    break;
                }
            }
        }
        
        // Debug: log what we found for the kudos section
        if (kudosGivers.length === 0) {
            debugLog('   ⚠️ No kudos givers found - checking if #kudos element exists:', !!doc.querySelector('#kudos'));
            const kudosEl = doc.querySelector('#kudos');
            if (kudosEl) {
                debugLog('   #kudos element HTML preview:', kudosEl.innerHTML.substring(0, 200));
            }
        }
        
        // DEBUG: Log the dates being extracted
        debugLog('📝 WORK:', title);
        debugLog('   URL:', workUrl);
        debugLog('   Published:', `"${pubDateStr}"`, '→ Year:', pubYear);
        debugLog('   Updated:', `"${statusDateStr}"`, '→ Year:', statusYear);
        debugLog('   Years span:', pubYear, 'to', statusYear);
        debugLog('   Stats:', { words, kudos, comments, hits });
        debugLog('   Kudos givers found:', kudosGivers.length, '/', kudos, '(tracked/total)');
        if (kudosGivers.length > 0) {
            debugLog('   Kudos from:', kudosGivers.join(', '));
        } else if (kudos > 0) {
            debugLog('   ⚠️ Work has', kudos, 'kudos but no givers were found in the page!');
        }
        
        // Parse actual dates for proportional allocation
        const pubDate = parseAO3DateToDate(pubDateStr);
        const statusDate = parseAO3DateToDate(statusDateStr) || pubDate;
        
        // Calculate days in each year for proportional allocation
        const daysPerYear = calculateDaysPerYear(pubDate, statusDate);
        const totalDays = Object.values(daysPerYear).reduce((sum, d) => sum + d, 0);
        
        debugLog('   Days per year:', daysPerYear, '| Total:', totalDays, 'days');
        
        // Only store debug info when debugging is enabled
        if (CONFIG.DEBUG_MODE) {
            allWorksDebug.push({
                title,
                url: workUrl,
                publishedRaw: pubDateStr,
                publishedYear: pubYear,
                publishedDate: pubDate?.toISOString()?.split('T')[0],
                statusRaw: statusDateStr,
                statusYear: statusYear,
                statusDate: statusDate?.toISOString()?.split('T')[0],
                daysPerYear: JSON.stringify(daysPerYear),
                totalDays,
                words,
                kudos,
                comments,
                hits
            });
        }
        
        // Allocate stats proportionally based on days in each year
        Object.entries(daysPerYear).forEach(([yearStr, days]) => {
            const year = parseInt(yearStr, 10);
            
            // Skip years we're not interested in (for incremental scans)
            if (targetYear !== null && year !== targetYear) {
                debugLog(`   → Year ${year}: SKIPPED (not target year ${targetYear})`);
                return;
            }
            
            const proportion = days / totalDays;
            
            initYear(year);
            const c = yearlyStats[year].creator;
            
            // Allocate words proportionally by duration
            const allocatedWords = Math.round(words * proportion);
            const allocatedKudos = Math.round(kudos * proportion);
            const allocatedComments = Math.round(comments * proportion);
            const allocatedHits = Math.round(hits * proportion);
            
            debugLog(`   → Year ${year}: ${days} days (${(proportion * 100).toFixed(1)}%) = ${allocatedWords} words`);
            
            c.works++;
            c.words += allocatedWords;
            c.kudos += allocatedKudos;
            c.comments += allocatedComments;
            c.hits += allocatedHits;
            
                // Track top works (store full stats for sorting later)
                c.topWorks.push({
                    title,
                    url: workUrl,
                    kudos,
                    comments,
                    hits,
                    score: kudos + comments * 2
                });
            
            // Allocate tag counts proportionally
            fandoms.forEach(f => addToCounter(c.fandoms, f, allocatedWords));
            relationships.forEach(r => addToCounter(c.relationships, r, allocatedWords));
            freeformTags.forEach(t => addToCounter(c.tags, t, 1));
            
            // Track kudos givers for this year
            // We attribute kudos givers to the year the work was most active
            // For simplicity, we add them to all years the work spans
            kudosGivers.forEach(giver => addToCounter(c.kudosGivers, giver, 1));
        });
    }

    /**
     * Fetch and process inbox comments for loyal readers
     * @param {string} username - The username to fetch inbox for
     * @param {number|null} targetYear - If set, only count comments from this year
     */
    async function fetchInboxComments(username, targetYear = null, startPage = 1) {
        const baseUrl = `https://archiveofourown.org/users/${username}/inbox`;
        
        const yearLabel = targetYear ? ` (${targetYear} only)` : '';
        const resumeLabel = startPage > 1 ? ` (resuming from page ${startPage})` : '';
        updateProgress('Scanning your inbox...', `Fetching page ${startPage}${yearLabel}${resumeLabel}`, 25);
        
        try {
            const firstPage = await fetchPage(`${baseUrl}?page=${startPage}`);
            const totalPages = Math.min(getTotalPages(firstPage), CONFIG.MAX_INBOX_PAGES);
            
            let shouldStop = processInboxPage(firstPage, username, targetYear);
            
            // Save initial progress
            if (startPage === 1) {
                saveProgress(username, 'inbox', 1, yearlyStats);
            }
            
            for (let page = startPage + 1; page <= totalPages; page++) {
                // Early termination: stop scanning if we've hit entries older than target year
                if (shouldStop && targetYear) {
                    debugLog(`💬 Stopping inbox scan at page ${page} - found entries older than ${targetYear}`);
                    break;
                }
                
                await sleep(CONFIG.REQUEST_DELAY);
                updateProgress('Scanning your inbox...', `Fetching page ${page} of ${totalPages}${yearLabel}`, 25 + (page / totalPages) * 15);
                
                const doc = await fetchPage(`${baseUrl}?page=${page}`);
                shouldStop = processInboxPage(doc, username, targetYear);
                
                // Save progress periodically
                if (page % CONFIG.SAVE_INTERVAL === 0) {
                    saveProgress(username, 'inbox', page, yearlyStats);
                }
            }
        } catch (e) {
            console.warn('[AO3 Journey] Inbox scan failed:', e);
        }
    }

    /**
     * Process inbox page to extract commenter data
     * @param {Document} doc - The page document
     * @param {string} myUsername - Current user's username
     * @param {number|null} targetYear - If set, only count comments from this year
     * @returns {boolean} - True if we found entries older than targetYear (signal to stop scanning)
     */
    function processInboxPage(doc, myUsername, targetYear = null) {
        let foundOlderEntry = false;
        // Try multiple selectors for inbox items
        const commentItems = doc.querySelectorAll('li.comment, li[role="article"], #inbox li, .inbox li');
        
        // If nothing found, try getting all list items in the main content area
        const items = commentItems.length > 0 ? commentItems : doc.querySelectorAll('#main li');
        
        // Words that are definitely NOT usernames (UI elements, navigation, etc.)
        const BLOCKED_NAMES = [
            'Reply', 'Delete', 'Edit', 'Spam', 'Select', 'Mark Read', 'Mark Unread',
            'Delete From Inbox', 'Select All', 'Select None',
            'Dashboard', 'Profile', 'Preferences', 'Skins', 'Works', 'Drafts', 
            'Series', 'Bookmarks', 'Collections', 'Inbox', 'Statistics', 
            'History', 'Subscriptions', 'Sign-ups', 'Assignments', 'Claims',
            'Previous', 'Next', 'Log In', 'Log Out', 'Sign Up',
            'Anonymous', 'Guest', // Also exclude anonymous
        ];
        
        items.forEach(item => {
            // Get commenter name - be more specific: look for the FIRST user link in the heading
            // The heading format is: "Username on Chapter X of WorkTitle"
            const headingEl = item.querySelector('h4.heading');
            if (!headingEl) return;
            
            // Get the first link that goes to /users/ in the heading (this should be the commenter)
            const authorLink = headingEl.querySelector('a[href*="/users/"]');
            if (!authorLink) return;
            
            const commenterName = authorLink.textContent?.trim();
            
            // Skip if no name or it's yourself
            if (!commenterName || commenterName === myUsername) return;
            
            // Skip blocked names (UI elements, navigation, etc.)
            if (BLOCKED_NAMES.some(blocked => 
                commenterName.toLowerCase() === blocked.toLowerCase())) {
                return;
            }
            
            // Extra validation: real usernames shouldn't be very short common words
            if (commenterName.length < 2) return;
            
            // Get date - AO3 inbox shows relative times like "5 days ago"
            const timeText = item.textContent || '';
            
            // Try to find relative time patterns anywhere in the item
            const relativeTimeMatch = timeText.match(/(\d+\s*(?:second|minute|hour|day|week|month|year)s?\s*ago|yesterday|today|a\s+(?:day|week|month|year)\s*ago|less than)/i);
            
            let year = null;
            
            if (relativeTimeMatch) {
                year = parseRelativeTime(relativeTimeMatch[0]);
            } else {
                year = extractYear(timeText);
            }
            
            if (!year) {
                year = new Date().getFullYear();
            }
            
            // Skip if not in target year (for incremental scans)
            if (targetYear !== null && year !== targetYear) {
                // If this entry is older than target year, mark for early termination
                if (year < targetYear) {
                    foundOlderEntry = true;
                }
                return;
            }
            
            debugLog('💬 INBOX COMMENT:', commenterName, '| Year:', year);
            
            initYear(year);
            addToCounter(yearlyStats[year].creator.commenters, commenterName, 1);
        });
        
        return foundOlderEntry;
    }

    /**
     * Fetch and process reading history
     */
    /**
     * Fetch and process reading history
     * @param {string} username - The username to fetch reading history for
     * @param {number|null} targetYear - If set, only count readings from this year and stop when hitting older entries
     */
    async function fetchReadingHistory(username, targetYear = null, startPage = 1) {
        const baseUrl = `https://archiveofourown.org/users/${username}/readings`;
        
        const yearLabel = targetYear ? ` (${targetYear} only)` : '';
        const resumeLabel = startPage > 1 ? ` (resuming from page ${startPage})` : '';
        updateProgress('Scanning reading history...', `Fetching page ${startPage}${yearLabel}${resumeLabel}`, 45);
        
        const firstPage = await fetchPage(`${baseUrl}?page=${startPage}`);
        const totalPages = getTotalPages(firstPage);
        
        let shouldStop = processReadingsPage(firstPage, targetYear);
        
        // Save initial progress
        if (startPage === 1) {
            saveProgress(username, 'history', 1, yearlyStats);
        }
        
        for (let page = startPage + 1; page <= totalPages; page++) {
            // Early termination: stop scanning if we've hit entries older than target year
            if (shouldStop && targetYear) {
                debugLog(`📖 Stopping reading history scan at page ${page} - found entries older than ${targetYear}`);
                updateProgress('Scanning reading history...', `Done! Stopped at page ${page-1} (older entries skipped)`, 95);
                break;
            }
            
            await sleep(CONFIG.REQUEST_DELAY);
            updateProgress('Scanning reading history...', `Fetching page ${page} of ${totalPages}${yearLabel}`, 45 + (page / totalPages) * 50);
            
            const doc = await fetchPage(`${baseUrl}?page=${page}`);
            shouldStop = processReadingsPage(doc, targetYear);
            
            // Save progress periodically
            if (page % CONFIG.SAVE_INTERVAL === 0) {
                saveProgress(username, 'history', page, yearlyStats);
        }
    }
    }

    /**
     * Process reading history page
     * @param {Document} doc - The page document
     * @param {number|null} targetYear - If set, only count readings from this year
     * @returns {boolean} - True if we found entries older than targetYear (signal to stop scanning)
     */
    function processReadingsPage(doc, targetYear = null) {
        const items = doc.querySelectorAll('li.reading');
        let foundOlderEntry = false;
        
        items.forEach(item => {
            // Get the "Last visited" heading which contains the date
            const viewedHeading = item.querySelector('h4.viewed.heading');
            const viewedText = viewedHeading?.textContent || '';
            
            // Extract year from "Last visited: 25 Dec 2024"
            const year = extractYear(viewedText);
            if (!year) return;
            
            // Skip if not in target year (for incremental scans)
            if (targetYear !== null && year !== targetYear) {
                // If this entry is older than target year, mark for early termination
                if (year < targetYear) {
                    foundOlderEntry = true;
                }
                return;
            }
            
            initYear(year);
            const r = yearlyStats[year].reader;
            
            // Count this fic
                    r.fics++;
            
            // Get visit count from "Visited 3 times"
            const visitMatch = viewedText.match(/Visited\s+(\d+)\s+time/i);
            const visits = visitMatch ? parseInt(visitMatch[1], 10) : 1;
            
            // Get word count
            const words = parseInt(item.querySelector('dd.words')?.textContent?.replace(/,/g, '') || '0', 10);
            r.words += words;
            
            // Check for Mature/Explicit rating (Yes, Continue clicks)
            const ratingTag = item.querySelector('span.rating');
            const ratingText = ratingTag?.textContent?.trim()?.toLowerCase() || '';
            const isMatureOrExplicit = ratingText.includes('mature') || ratingText.includes('explicit') ||
                                       item.textContent?.includes('Mature') || item.textContent?.includes('Explicit');
            if (isMatureOrExplicit) {
                r.matureClicks += visits;
            }
            
            // Get work info for revisited tracking
            const titleLink = item.querySelector('h4.heading a:first-child');
            const title = titleLink?.textContent?.trim() || 'Unknown Work';
            const workUrl = titleLink?.href || '#';
            
            if (!r.workVisits[title]) {
                r.workVisits[title] = { visits: 0, url: workUrl };
            }
            r.workVisits[title].visits += visits;
            
            // Get author info - look for "by AuthorName" link
            const authorLink = item.querySelector('h4.heading a[rel="author"]');
            const authorName = authorLink?.textContent?.trim();
            if (authorName) {
                if (!r.authors[authorName]) {
                    r.authors[authorName] = { works: 0, visits: 0, topWork: null, topWorkVisits: 0 };
                }
                r.authors[authorName].works++;
                r.authors[authorName].visits += visits;
                
                // Track the most viewed work by this author
                // Use (|| 0) to handle old cached data that doesn't have topWorkVisits
                if (visits > (r.authors[authorName].topWorkVisits || 0)) {
                    r.authors[authorName].topWork = title;
                    r.authors[authorName].topWorkVisits = visits;
                }
            }
            
            // Get tags
            const fandoms = Array.from(item.querySelectorAll('h5.fandoms a.tag')).map(a => a.textContent?.trim());
            const relationships = Array.from(item.querySelectorAll('li.relationships a.tag')).map(a => a.textContent?.trim());
            const freeformTags = Array.from(item.querySelectorAll('li.freeforms a.tag'))
                .map(a => a.textContent?.trim())
                .filter(tag => !ARCHIVE_WARNINGS.includes(tag));
            
            fandoms.forEach(f => addToCounter(r.fandoms, f, 1));
            relationships.forEach(rel => addToCounter(r.relationships, rel, 1));
            freeformTags.forEach(t => addToCounter(r.tags, t, 1));
        });
        
        return foundOlderEntry;
    }

    // ==================== MAIN SCAN ====================

    /**
     * Start scanning - supports incremental scan with cache
     * @param {boolean} forceFullScan - If true, ignore cache and scan everything
     */
    async function startScan(forceFullScan = false) {
        if (isScanning) return;
        isScanning = true;
        isIncrementalScan = false;
        cachedYears = [];
        
        debugLog('🚀 Starting scan...', forceFullScan ? '(FULL)' : '(checking cache)');
        updateProgress('Preparing...', 'Preparing scan...', 1);
        
        // Reset stats
        yearlyStats = {};
        allWorksDebug = [];
        
        // Small delay to ensure UI updates
        await sleep(100);
        
        const username = getLoggedInUsername();
        debugLog('Username found:', username);
        
        // Update the title with username
        const titleEl = document.getElementById('journey-title');
        if (titleEl && username) {
            titleEl.textContent = `AO3 Journey for ${username}`;
        }
        
        if (!username) {
            // Show a user-friendly error for not logged in
            const progressView = document.getElementById('progress-view');
            if (progressView) {
                progressView.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">🔐</div>
                        <div style="font-size: 1.3em; font-weight: 700; color: #990000; margin-bottom: 15px;">
                            Please Log In to AO3
                        </div>
                        <div style="color: #666; font-size: 14px; margin-bottom: 20px; line-height: 1.6;">
                            Please log in to AO3 first to view your journey.<br>
                            Click "Log In" at the top right to continue.
                        </div>
                        <a href="https://archiveofourown.org/users/login" 
                           style="display: inline-block; background: linear-gradient(135deg, #990000 0%, #cc0000 100%); 
                                  color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; 
                                  font-weight: bold; font-size: 14px;">
                            Log In to AO3
                        </a>
                    </div>
                `;
            }
            debugLog('❌ No username found - user is not logged in');
            isScanning = false;
            return;
        }
        
        try {
            const currentYear = new Date().getFullYear();
            let scanScope;
            let resumeProgress = null;
            let resumeStartPage = 1;
            let resumeStage = null;
            
            // Check for incomplete scan progress (unless forcing full scan)
            if (!forceFullScan) {
                resumeProgress = loadProgress(username);
                
                if (resumeProgress) {
                    // Found incomplete scan - offer to resume
                    const resumeChoice = confirm(
                        `🔄 Found incomplete scan from ${new Date(resumeProgress.savedAt).toLocaleString()}\n\n` +
                        `Stage: ${resumeProgress.stage}, Page: ${resumeProgress.lastPage}\n\n` +
                        `Click "OK" to resume, or "Cancel" to start fresh\n` +
                        `Click OK to resume, or Cancel to start fresh`
                    );
                    
                    if (resumeChoice) {
                        // Resume from saved progress
                        debugLog('📥 Resuming from saved progress:', resumeProgress.stage, 'page', resumeProgress.lastPage);
                        yearlyStats = resumeProgress.data || {};
                        resumeStage = resumeProgress.stage;
                        resumeStartPage = resumeProgress.lastPage + 1; // Start from next page
                        updateProgress('Resuming scan...', `Resuming from ${resumeProgress.stage} page ${resumeProgress.lastPage}...`, 10);
                        await sleep(300);
                    } else {
                        // User chose to start fresh
                        clearProgress();
                        resumeProgress = null;
                    }
                }
            }
            
            // Check cache unless forcing full scan or resuming
            if (!forceFullScan && !resumeProgress) {
                scanScope = determineScanScope(username);
                
                if (scanScope.cachedData) {
                    // Load cached data for past years
                    debugLog('📦 Loading cached data for years:', scanScope.cachedYears);
                    updateProgress('Loading cached data...', 'Loading cached data...', 5);
                    
                    // Copy cached years into yearlyStats
                    for (const year of scanScope.cachedYears) {
                        if (scanScope.cachedData[year]) {
                            yearlyStats[year] = scanScope.cachedData[year];
                        }
                    }
                    
                    cachedYears = scanScope.cachedYears;
                    isIncrementalScan = true;
                    
                    debugLog('✅ Loaded', cachedYears.length, 'years from cache');
                    debugLog('🔄 Will scan current year:', currentYear);
                    
                    await sleep(300);
                }
            } else if (forceFullScan) {
                debugLog('🔄 Force full scan requested - ignoring cache');
                clearCache();
            }
            
            // Update progress message based on scan type
            if (isIncrementalScan) {
                updateProgress(`Scanning ${currentYear} data...`, `Scanning ${currentYear} data (${cachedYears.length} years cached)`, 10);
            } else if (!resumeProgress) {
                updateProgress('Scanning all data...', 'Scanning all data...', 5);
            }
            
            // Determine which stages to run based on resume state
            // Stage order: works -> inbox -> history
            // If resuming from a stage, skip all previous stages (they're complete)
            const targetYear = isIncrementalScan ? currentYear : null;
            
            // Fetch creator works (skip if resuming from inbox or history)
            if (!resumeStage || resumeStage === 'works') {
                // Check if resuming works stage with saved work URLs
                const worksResumeData = (resumeStage === 'works' && resumeProgress?.extra) 
                    ? resumeProgress.extra 
                    : null;
                await fetchCreatorWorks(username, targetYear, worksResumeData);
            } else {
                debugLog(`⏭️ Skipping works stage (resuming from ${resumeStage})`);
            }
            
            // Fetch inbox comments (skip if resuming from history)
            if (!resumeStage || resumeStage === 'works' || resumeStage === 'inbox') {
                const inboxStartPage = (resumeStage === 'inbox') ? resumeStartPage : 1;
                await fetchInboxComments(username, targetYear, inboxStartPage);
            } else if (resumeStage === 'history') {
                debugLog('⏭️ Skipping inbox stage (resuming from history)');
            }
            
            // Fetch reading history (always run, may resume from specific page)
            const historyStartPage = (resumeStage === 'history') ? resumeStartPage : 1;
            await fetchReadingHistory(username, targetYear, historyStartPage);
            
            updateProgress('Building your journey...', 'Almost done!', 98);
            await sleep(500);
            
            // Save to cache after successful scan
            saveCache(username, yearlyStats);
            clearProgress(); // Clear incremental progress - scan completed successfully
            debugLog('💾 Data saved to cache');
            
            // DEBUG: Print summary of what was collected
            if (CONFIG.DEBUG_MODE) {
                console.log('═══════════════════════════════════════════════════════════');
                console.log('[AO3 Journey] SCAN COMPLETE - DATA SUMMARY');
                console.log('═══════════════════════════════════════════════════════════');
                console.log('Scan type:', isIncrementalScan ? 'INCREMENTAL' : 'FULL');
                console.log('Cached years:', cachedYears);
                
                console.log('\n📚 ALL YOUR WORKS (with parsed dates):');
                console.table(allWorksDebug);
                
                Object.keys(yearlyStats).sort().forEach(year => {
                    const s = yearlyStats[year];
                    const isCached = cachedYears.includes(parseInt(year, 10));
                    console.log(`\n📅 YEAR ${year}:`, isCached ? '(cached)' : '(fresh)');
                    console.log(`   Creator: ${s.creator.works} works, ${s.creator.words.toLocaleString()} words`);
                    console.log(`   Reader: ${s.reader.fics} fics read`);
                    console.log(`   Top Commenters:`, Object.entries(s.creator.commenters).sort((a,b) => b[1]-a[1]).slice(0,5));
                    console.log(`   Top Kudos Givers:`, Object.entries(s.creator.kudosGivers || {}).sort((a,b) => b[1]-a[1]).slice(0,5));
                });
                
                console.log('\n═══════════════════════════════════════════════════════════');
                console.log('Debug data available in console:');
                console.log('  window.ao3JourneyData - Yearly stats');
                console.log('  window.ao3WorksDebug - All works with dates');
                window.ao3JourneyData = yearlyStats;
                window.ao3WorksDebug = allWorksDebug;
            }
            
            renderResults();
        } catch (error) {
            console.error('[AO3 Journey] Scan failed:', error);
            updateProgress('Error during scan', error.message);
        }
        
        isScanning = false;
    }
    
    // Alias for backwards compatibility
    async function startFullScan() {
        return startScan(false);
    }

    // ==================== RENDERING ====================

    function renderTopItems(obj, limit = 3, formatValue = null) {
        const sorted = Object.entries(obj)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit);
        
        if (sorted.length === 0) {
            return '<div class="empty-state">No data yet</div>';
        }
        
        return sorted.map(([name, value]) => {
            const displayValue = formatValue ? formatValue(value) : value;
            return `<div class="list-item">
                <span class="list-item-title">${escapeHtml(name)}</span>
                <span class="list-item-value">${displayValue}</span>
            </div>`;
        }).join('');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatWords(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    }

    /**
     * Render the confirmation UI (mimics AO3's adult content warning exactly)
     */
    function renderConfirmationUI(year = 2025) {
        return `
            <div class="report-confirm-view active" data-year="confirm-${year}">
                <div class="confirm-container">
                    <div class="confirm-branding">
                        <img src="https://archiveofourown.org/images/ao3_logos/logo_42.png" alt="AO3" class="confirm-branding-logo">
                        <span class="confirm-branding-text">Archive of Our Own</span>
                    </div>
                    <div class="confirm-warning-box">
                        <div class="confirm-warning-text">
                            This work could have adult content. If you continue, you have agreed that you are willing to see such content.
                        </div>
                    </div>
                    
                    <div class="confirm-buttons">
                        <button class="confirm-btn yes" id="confirm-yes-btn">Yes, Continue</button>
                        <button class="confirm-btn no" id="confirm-no-btn">No, Go Back</button>
                    </div>
                    
                    <div class="confirm-subtitle">
                        If you accept cookies from our site and you choose "Yes, Continue", you will not be asked again during this session (that is, until you close your browser). If you log in you can store your preference and never be asked again.
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render the 2025 Annual Report
     */
    function renderAnnualReport(year = 2025, username = '') {
        const stats = yearlyStats[year];
        if (!stats) return '';
        
        const c = stats.creator;
        const r = stats.reader;
        
        // Calculate Q - years on AO3
        const allYears = Object.keys(yearlyStats).map(y => parseInt(y, 10)).sort((a, b) => a - b);
        const firstYear = allYears[0];
        const currentYear = new Date().getFullYear();
        const yearsOnAO3 = currentYear - firstYear + 1; // Q
        
        // Creator stats
        const hasCreatorData = c && c.works > 0;
        let A = '—', B = 0, C = 0, D = '0.0', E = 0, F = 0, G = '—', H = 0, I = 0;
        let R = 0, S = 0, T = '0.0'; // R = works for top relationship, S = words for it, T = books equivalent
        
        if (hasCreatorData) {
            // A - Top relationship (by words), cleaned
            const topRelationship = Object.entries(c.relationships || {}).sort((a, b) => b[1] - a[1])[0];
            A = topRelationship ? cleanRelationshipTag(topRelationship[0]) : '—';
            S = topRelationship ? topRelationship[1] : 0; // Words for this relationship
            T = (S / 27000).toFixed(1); // Books equivalent (The Old Man and the Sea)
            
            // R - Count works with this relationship (estimate from ratio)
            // Since we track words per relationship, estimate works count
            if (topRelationship && c.words > 0) {
                R = Math.max(1, Math.round(c.works * (S / c.words)));
            }
            
            B = c.works; // # works
            C = c.words; // # words
            D = (C / 60000).toFixed(1); // Books equivalent (novels)
            E = c.kudos; // # kudos received
            F = c.comments; // # comments received
            
            // G - Top commenter
            const topCommenter = Object.entries(c.commenters || {}).sort((a, b) => b[1] - a[1])[0];
            G = topCommenter ? topCommenter[0] : '—';
            I = topCommenter ? topCommenter[1] : 0; // Comments by G
            
            // H - Kudos by G (check kudosGivers)
            H = (c.kudosGivers && c.kudosGivers[G]) ? c.kudosGivers[G] : 0;
        }
        
        // U, V, W, X - Most popular work (by kudos)
        let U = '—', V = 0, W = 0, X = 0;
        if (hasCreatorData && c.topWorks && c.topWorks.length > 0) {
            // Deduplicate works and find the one with most kudos
            const worksMap = new Map();
            c.topWorks.forEach(w => {
                if (!worksMap.has(w.title) || worksMap.get(w.title).kudos < w.kudos) {
                    worksMap.set(w.title, w);
                }
            });
            const sortedByKudos = Array.from(worksMap.values()).sort((a, b) => b.kudos - a.kudos);
            if (sortedByKudos.length > 0) {
                const topWork = sortedByKudos[0];
                U = topWork.title;
                V = topWork.hits || 0;
                W = topWork.kudos || 0;
                X = topWork.comments || 0;
            }
        }
        
        // Reader stats
        const J = r.fics; // # works read
        const K = r.words; // # words read
        const L = (K / 1000000).toFixed(1); // Books equivalent
        const M = r.matureClicks; // Yes, continue clicks
        const N = (M / 5354).toFixed(1); // Parking lots
        
        // O - Top relationship (reader), cleaned
        const topReaderRelationship = Object.entries(r.relationships || {}).sort((a, b) => b[1] - a[1])[0];
        const O = topReaderRelationship ? cleanRelationshipTag(topReaderRelationship[0]) : '—';
        const P = topReaderRelationship ? topReaderRelationship[1] : 0;
        
        // Y, Z, AA, AB, AC - Favorite author (most visits)
        let Y = '—', Z = 0, AA = 0, AB = '—', AC = 0;
        const topAuthor = Object.entries(r.authors || {}).sort((a, b) => b[1].visits - a[1].visits)[0];
        if (topAuthor) {
            Y = topAuthor[0]; // Author name
            Z = topAuthor[1].works; // # works by this author
            AA = topAuthor[1].visits; // # visits to this author's works
            AB = topAuthor[1].topWork || '—'; // Most viewed work by this author
            AC = topAuthor[1].topWorkVisits || 0; // Views of that work
        }
        
        // Build Page 1 content (Creator or Reader if no creator)
        const page1Content = hasCreatorData ? `
            <div class="page-label">✍️ Creator Report</div>
            <div class="report-section creator" style="flex: 1;">
                <div class="report-text">
                    <span class="report-emoji">✍️</span> In ${year}, you created <span class="nowrap"><span class="report-highlight pink">${B}</span> works</span> and wrote <span class="nowrap"><span class="report-number">${C.toLocaleString()}</span> words</span>!
                </div>
                
                <div class="report-divider"></div>
                
                <div class="report-text">
                    <span class="report-emoji">💕</span> Your most beloved ship is <span class="report-highlight pink">${escapeHtml(A)}</span>. You wrote <span class="nowrap"><span class="report-highlight">${R}</span> stories</span> for them, totaling <span class="nowrap"><span class="report-number">${S.toLocaleString()}</span> words</span>!
                </div>
                
                ${(E > 0 || F > 0) ? `
                <div class="report-divider"></div>
                
                <div class="report-text">
                    <span class="report-emoji">❤️</span> ${F > 0 
                        ? `You received <span class="nowrap"><span class="report-number">${E.toLocaleString()}</span> kudos</span> and <span class="nowrap"><span class="report-number">${F.toLocaleString()}</span> comments</span>!`
                        : `You received <span class="nowrap"><span class="report-number">${E.toLocaleString()}</span> kudos</span>!`}
                </div>
                ` : ''}
                
                ${U !== '—' ? `
                <div class="report-text">
                    <span class="report-emoji">🏆</span> Your most popular work is "<span class="report-highlight pink">${escapeHtml(U)}</span>" — it was read <span class="nowrap"><span class="report-number">${V.toLocaleString()}</span> times</span>, ${X > 0 
                        ? `<span class="nowrap">with <span class="report-highlight">${W}</span> kudos</span> and <span class="nowrap"><span class="report-highlight">${X}</span> comments</span>!`
                        : `<span class="nowrap">and <span class="report-highlight">${W}</span> readers left kudos</span>!`}
                </div>
                ` : ''}
                
                ${G !== '—' ? `
                <div class="report-text">
                    <span class="report-emoji">🥰</span> Your biggest fan is <span class="report-highlight green">${escapeHtml(G)}</span> — they left${H > 0 ? ` <span class="nowrap"><span class="report-highlight">${H}</span> kudos</span> and` : ''} <span class="nowrap"><span class="report-highlight">${I}</span> comments</span>!
                </div>
                ` : ''}
                
                <div class="report-divider"></div>
                
                <div class="report-text" style="text-align: center; font-size: 17px;">
                    <span class="report-emoji">🏠</span> This year, you helped build this fandom! <span class="report-emoji">🏠</span>
                </div>
            </div>
            <div class="report-footer" style="margin-top: auto;">
                <div class="report-decoration">✦ ✦ ✦</div>
                <div class="report-quote">Keep writing fanfic until you're 80!</div>
                <div class="report-blessing">May you always love, always be free</div>
                <div class="report-decoration-end">🌸</div>
            </div>
        ` : `
            <div class="page-label">📖 Reader Report</div>
            <div class="report-section reader" style="flex: 1;">
                <div class="report-text">
                    <span class="report-emoji">📚</span> In ${year}, you read <span class="nowrap"><span class="report-number">${J.toLocaleString()}</span> works</span> totaling <span class="nowrap"><span class="report-number">${K.toLocaleString()}</span> words</span>!
                </div>
                
                <div class="report-divider"></div>
                
                <div class="report-text">
                    <span class="report-emoji">🚗</span> You clicked <span style="font-weight:700; color:#000; font-size:1.1em;">"Yes, Continue"</span> <span class="nowrap"><span class="report-number">${M.toLocaleString()}</span> times</span>${M >= 600 ? ` — enough to fill <span class="nowrap"><span class="report-highlight">${N}</span> parking lots</span>!` : `!`}
                </div>
                
                ${O !== '—' ? `
                <div class="report-divider"></div>
                <div class="report-text" style="font-size: 18px;">
                    <span class="report-emoji">💘</span> Your ship of the year is <span class="report-highlight pink">${escapeHtml(O)}</span> — you read their stories <span class="nowrap"><span class="report-number">${P}</span> times</span>. Do you still love them?
                </div>
                ` : ''}
                
                ${Y !== '—' ? `
                <div class="report-divider"></div>
                <div class="report-text">
                    <span class="report-emoji">👩‍🏫</span> Your favorite author is <span class="report-highlight green">${escapeHtml(Y)}</span> — you read their <span class="nowrap"><span class="report-highlight">${Z}</span> works</span> a total of <span class="nowrap"><span class="report-number">${AA}</span> times</span>. Your favorite is "<span class="report-highlight pink">${escapeHtml(AB)}</span>", which you revisited <span class="nowrap"><span class="report-number">${AC}</span> times</span>!
                </div>
                ` : ''}
                
                <div class="report-divider"></div>
                
                <div class="report-text" style="text-align: center; font-size: 17px;">
                    <span class="report-emoji">💪</span> Reading is self-care! Keep feeding your soul! <span class="report-emoji">💪</span>
                </div>
            </div>
            <div class="report-footer" style="margin-top: auto;">
                <div class="report-decoration">✦ ✦ ✦</div>
                <div class="report-quote">Keep writing fanfic until you're 80!</div>
                <div class="report-blessing">May you always love, always be free</div>
                <div class="report-decoration-end">🌸</div>
            </div>
        `;
        
        // Build Page 2 content (Reader if has creator, or empty)
        const page2Content = hasCreatorData ? `
            <div class="page-label">📖 Reader Report</div>
            <div class="report-section reader" style="flex: 1;">
                <div class="report-text">
                    <span class="report-emoji">📚</span> In ${year}, you read <span class="nowrap"><span class="report-number">${J.toLocaleString()}</span> works</span> totaling <span class="nowrap"><span class="report-number">${K.toLocaleString()}</span> words</span>!
                </div>
                
                <div class="report-divider"></div>
                
                <div class="report-text">
                    <span class="report-emoji">🚗</span> You clicked <span style="font-weight:700; color:#000; font-size:1.1em;">"Yes, Continue"</span> <span class="nowrap"><span class="report-number">${M.toLocaleString()}</span> times</span>${M >= 600 ? ` — enough to fill <span class="nowrap"><span class="report-highlight">${N}</span> parking lots</span>!` : `!`}
                </div>
                
                ${O !== '—' ? `
                <div class="report-divider"></div>
                <div class="report-text" style="font-size: 18px;">
                    <span class="report-emoji">💘</span> Your ship of the year is <span class="report-highlight pink">${escapeHtml(O)}</span> — you read their stories <span class="nowrap"><span class="report-number">${P}</span> times</span>. Do you still love them?
                </div>
                ` : ''}
                
                ${Y !== '—' ? `
                <div class="report-divider"></div>
                <div class="report-text">
                    <span class="report-emoji">👩‍🏫</span> Your favorite author is <span class="report-highlight green">${escapeHtml(Y)}</span> — you read their <span class="nowrap"><span class="report-highlight">${Z}</span> works</span> a total of <span class="nowrap"><span class="report-number">${AA}</span> times</span>. Your favorite is "<span class="report-highlight pink">${escapeHtml(AB)}</span>", which you revisited <span class="nowrap"><span class="report-number">${AC}</span> times</span>!
                </div>
                ` : ''}
                
                <div class="report-divider"></div>
                
                <div class="report-text" style="text-align: center; font-size: 17px;">
                    <span class="report-emoji">💪</span> Reading is self-care! Keep feeding your soul! <span class="report-emoji">💪</span>
                </div>
            </div>
            <div class="report-footer" style="margin-top: auto;">
                <div class="report-decoration">✦ ✦ ✦</div>
                <div class="report-quote">Keep writing fanfic until you're 80!</div>
                <div class="report-blessing">May you always love, always be free</div>
                <div class="report-decoration-end">🌸</div>
            </div>
        ` : '';
        
        // Determine if we need 2 pages
        const hasTwoPages = hasCreatorData;
        
        return `
            <div class="annual-report-view" data-year="annual-${year}">
                <div class="annual-report-wrapper">
                    <div class="annual-report-container" tabindex="0">
                        <!-- AO3 Branding -->
                        <div class="report-branding">
                            <img src="https://archiveofourown.org/images/ao3_logos/logo_42.png" alt="AO3" class="report-branding-logo">
                            <span class="report-branding-text">Archive of Our Own</span>
                        </div>
                        <!-- Fixed Header -->
                        <div class="report-header">
                            <div class="report-year">${year}</div>
                            <div class="report-subtitle">Annual Report</div>
                            <div class="years-badge">
                                <span class="report-emoji">✨</span>
                                ${username ? `<strong>${username}</strong>, ` : ''}This is your <span class="report-number">${yearsOnAO3}</span>${yearsOnAO3 === 1 ? 'st' : yearsOnAO3 === 2 ? 'nd' : yearsOnAO3 === 3 ? 'rd' : 'th'} year on AO3!
                                <span class="report-emoji">✨</span>
                            </div>
                        </div>
                        
                        <!-- Swipeable Carousel -->
                        <div class="report-carousel" data-pages="${hasTwoPages ? 2 : 1}">
                        <div class="report-carousel-track">
                            <div class="report-page" data-page="1">
                                ${page1Content}
                            </div>
                            ${hasTwoPages ? `
                            <div class="report-page" data-page="2">
                                ${page2Content}
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${hasTwoPages ? `
                    <!-- Page Indicators -->
                    <div class="page-indicators">
                        <div class="page-dot active" data-page="1"></div>
                        <div class="page-dot" data-page="2"></div>
                    </div>
                    
                        <!-- Swipe Hint (Page 1 only) -->
                        <div class="swipe-hint">→ Swipe for reader stats</div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Initialize carousel swipe functionality
     */
    function initCarouselSwipe() {
        const carousel = document.querySelector('.report-carousel');
        const container = document.querySelector('.annual-report-container');
        if (!carousel) return;
        
        const track = carousel.querySelector('.report-carousel-track');
        const dots = document.querySelectorAll('.page-dot');
        const hint = document.querySelector('.swipe-hint');
        const pageCount = parseInt(carousel.dataset.pages) || 1;
        
        if (pageCount < 2) return;
        
        let currentPage = 1;
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        // Hide hint after 3 seconds
        if (hint) {
            setTimeout(() => {
                hint.classList.add('hidden');
            }, 3000);
        }
        
        function goToPage(page) {
            currentPage = Math.max(1, Math.min(page, pageCount));
            const offset = (currentPage - 1) * -100;
            track.style.transform = `translateX(${offset}%)`;
            
            // Update dots
            dots.forEach(dot => {
                dot.classList.toggle('active', parseInt(dot.dataset.page) === currentPage);
            });
            
            // Hide hint when leaving page 1
            if (currentPage > 1 && hint) {
                hint.classList.add('hidden');
            }
        }
        
        // Touch events
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            track.style.transition = 'none';
        }, { passive: true });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            const offset = (currentPage - 1) * -100 + (diff / carousel.offsetWidth) * 100;
            track.style.transform = `translateX(${offset}%)`;
        }, { passive: true });
        
        carousel.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = 'transform 0.3s ease-in-out';
            
            const diff = currentX - startX;
            const threshold = carousel.offsetWidth * 0.2; // 20% threshold
            
            if (diff < -threshold && currentPage < pageCount) {
                goToPage(currentPage + 1);
            } else if (diff > threshold && currentPage > 1) {
                goToPage(currentPage - 1);
            } else {
                goToPage(currentPage); // Snap back
            }
            
            startX = 0;
            currentX = 0;
        });
        
        // Click on dots
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goToPage(parseInt(dot.dataset.page));
            });
        });
        
        // Mouse events for desktop
        carousel.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
            track.style.transition = 'none';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            currentX = e.clientX;
            const diff = currentX - startX;
            const offset = (currentPage - 1) * -100 + (diff / carousel.offsetWidth) * 100;
            track.style.transform = `translateX(${offset}%)`;
        });
        
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = 'transform 0.3s ease-in-out';
            
            const diff = currentX - startX;
            const threshold = carousel.offsetWidth * 0.2;
            
            if (diff < -threshold && currentPage < pageCount) {
                goToPage(currentPage + 1);
            } else if (diff > threshold && currentPage > 1) {
                goToPage(currentPage - 1);
            } else {
                goToPage(currentPage);
            }
            
            startX = 0;
            currentX = 0;
        });
        
        // Keyboard navigation
        if (container) {
            container.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    goToPage(currentPage + 1);
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    goToPage(currentPage - 1);
                }
            });
            // Focus container for keyboard navigation
            container.focus();
        }
    }

    function renderResults() {
        document.getElementById('progress-view').style.display = 'none';
        document.getElementById('results-view').style.display = 'block';
        
        // Show export and refresh buttons when results are ready
        const exportBtn = document.getElementById('export-journey');
        const refreshBtn = document.getElementById('refresh-journey');
        if (exportBtn) {
            exportBtn.classList.add('visible');
        }
        if (refreshBtn) {
            refreshBtn.classList.add('visible');
        }
        
        const sortedYears = Object.keys(yearlyStats).sort((a, b) => b - a);
        
        if (sortedYears.length === 0) {
            document.getElementById('year-tabs').innerHTML = '';
            document.getElementById('year-content').innerHTML = `
                <div class="empty-state" style="text-align:center;padding:40px;color:#666;">
                    <div style="font-size:48px;margin-bottom:20px;">📭</div>
                    <div style="font-size:18px;font-weight:600;margin-bottom:15px;color:#990000;">No Data Found</div>
                    <div style="font-size:14px;line-height:1.6;max-width:400px;margin:0 auto;">
                        <p>We couldn't find any reading history or published works.</p>
                        <p style="margin-top:15px;"><strong>To enable history tracking:</strong></p>
                        <p>Go to <strong>My Dashboard → Preferences → Misc</strong>, then click <strong>"Turn on History"</strong> to enable future tracking.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        // Check if we have 2025 data for the annual report
        const has2025 = yearlyStats['2025'] !== undefined;
        
        // Render annual report banner separately (if 2025 exists)
        const bannerEl = document.getElementById('annual-report-banner');
        if (has2025 && bannerEl) {
            bannerEl.innerHTML = `<div class="annual-report-tab active" data-year="annual-2025">✨ 2025 Annual Report</div>`;
        } else if (bannerEl) {
            bannerEl.innerHTML = '';
        }
        
        // Render year tabs (all years including 2025)
        const tabsHtml = sortedYears.map((year, i) => 
            `<div class="year-tab ${!has2025 && i === 0 ? 'active' : ''}" data-year="${year}">${year}</div>`
        ).join('');
        document.getElementById('year-tabs').innerHTML = tabsHtml;
        
        // Get username for the annual report
        const username = getLoggedInUsername() || '';
        
        // Render year content with confirmation + annual report first
        let contentHtml = '';
        if (has2025) {
            contentHtml += renderConfirmationUI(2025);
            contentHtml += renderAnnualReport(2025, username);
        }
        // When annual report exists, NO year view should be active initially
        contentHtml += sortedYears.map((year, i) => {
            const stats = yearlyStats[year];
            const c = stats.creator;
            const r = stats.reader;
            // Only set active if no annual report AND this is the first year
            const isActive = !has2025 && i === 0;
            
            // Get top works (deduplicate and sort)
            const topWorksMap = new Map();
            c.topWorks.forEach(w => {
                if (!topWorksMap.has(w.title) || topWorksMap.get(w.title).score < w.score) {
                    topWorksMap.set(w.title, w);
                }
            });
            const topWorks = Array.from(topWorksMap.values())
                .sort((a, b) => b.score - a.score)
                .slice(0, 3);
            
            // Get top commenters
            const topCommenters = Object.entries(c.commenters)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);
            
            // Get top kudos givers
            const topKudosGivers = Object.entries(c.kudosGivers || {})
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);
            
            // Get top revisited works
            const topRevisited = Object.entries(r.workVisits)
                .sort((a, b) => b[1].visits - a[1].visits)
                .slice(0, 5);
            
            const hasCreatorData = c.works > 0;
            const hasReaderData = r.fics > 0;
            
            return `
                <div class="year-view ${isActive ? 'active' : ''}" data-year="${year}">
                    ${hasCreatorData ? `
                    <div class="section-card creator">
                        <h3 class="section-title">✍️ ${username ? username + "'s " : ''}Journey as Creator in ${year}</h3>
                        
                        <div class="stats-grid">
                            <div class="stat-box">
                                <div class="stat-label">Works Active</div>
                                <div class="stat-value">${c.works}</div>
                        </div>
                            <div class="stat-box">
                                <div class="stat-label">Words Written</div>
                                <div class="stat-value">${c.words.toLocaleString()}</div>
                        </div>
                            <div class="stat-box">
                                <div class="stat-label">Kudos Received</div>
                                <div class="stat-value">${c.kudos.toLocaleString()}</div>
                    </div>
                            <div class="stat-box">
                                <div class="stat-label">Comments</div>
                                <div class="stat-value">${c.comments.toLocaleString()}</div>
                            </div>
                        </div>
                        
                        <div class="subsection-label">🏆 Popular Works</div>
                        ${topWorks.length > 0 ? topWorks.map(w => `
                            <div class="list-item">
                                <a href="${w.url}" class="work-link list-item-title" target="_blank">${escapeHtml(w.title)}</a>
                                <span class="list-item-value">❤️${w.kudos} 💬${w.comments}</span>
                            </div>
                        `).join('') : '<div class="empty-state">No works yet</div>'}
                        
                        ${topCommenters.length > 0 || topKudosGivers.length > 0 ? `
                        <div class="subsection-label">💕 Loyal Readers</div>
                        ${(() => {
                            // Combine commenters and kudos givers
                            const allSupporters = new Map();
                            // Add top commenters, look up their kudos from the FULL kudosGivers data
                            topCommenters.forEach(([name, count]) => {
                                const kudosCount = (c.kudosGivers && c.kudosGivers[name]) ? c.kudosGivers[name] : 0;
                                allSupporters.set(name, { comments: count, kudos: kudosCount });
                            });
                            // Add top kudos givers who aren't already in the list
                            topKudosGivers.forEach(([name, count]) => {
                                if (!allSupporters.has(name)) {
                                    const commentCount = (c.commenters && c.commenters[name]) ? c.commenters[name] : 0;
                                    allSupporters.set(name, { comments: commentCount, kudos: count });
                                }
                            });
                            // Sort by comments descending, then by kudos
                            const sorted = Array.from(allSupporters.entries())
                                .sort((a, b) => b[1].comments - a[1].comments || b[1].kudos - a[1].kudos)
                                .slice(0, 3);
                            return sorted.map(([name, stats]) => `
                                <div class="list-item">
                                    <span class="list-item-title">${escapeHtml(name)}</span>
                                    <span class="list-item-value">💬${stats.comments} | ❤️${stats.kudos}</span>
                                </div>
                            `).join('');
                        })()}
                        ` : ''}
                        
                        <div class="subsection-label">🎭 Top Fandoms</div>
                        ${renderTopItems(c.fandoms, 3, v => formatWords(v) + ' words')}
                        
                        <div class="subsection-label">💑 Top Relationships</div>
                        ${renderTopItems(c.relationships, 3, v => formatWords(v) + ' words')}
                        
                        <div class="subsection-label">🏷️ Top Tags</div>
                        ${renderTopItems(c.tags, 5)}
                    </div>
                    ` : ''}
                    
                    ${hasReaderData ? `
                    <div class="section-card reader">
                        <h3 class="section-title">📖 ${username ? username + "'s " : ''}Journey as Reader in ${year}</h3>
                        
                        <div class="stats-grid">
                            <div class="stat-box">
                                <div class="stat-label">Fics Read</div>
                                <div class="stat-value">${r.fics.toLocaleString()}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">Words Read</div>
                                <div class="stat-value">${r.words.toLocaleString()}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">"Yes, Continue" Clicks</div>
                                <div class="stat-value">${r.matureClicks.toLocaleString()}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">Total Visits</div>
                                <div class="stat-value">${Object.values(r.workVisits).reduce((sum, w) => sum + w.visits, 0).toLocaleString()}</div>
                            </div>
                        </div>
                        
                        <div class="subsection-label">🎭 Top Fandoms</div>
                        ${renderTopItems(r.fandoms, 3)}
                        
                        <div class="subsection-label">💑 Top Relationships</div>
                        ${renderTopItems(r.relationships, 3)}
                        
                        <div class="subsection-label">👀 Most Revisited Works</div>
                        ${topRevisited.length > 0 ? topRevisited.map(([title, data]) => `
                            <div class="list-item">
                                <a href="${data.url}" class="work-link list-item-title" target="_blank">${escapeHtml(title)}</a>
                                <span class="list-item-value">${data.visits} visits</span>
                            </div>
                        `).join('') : '<div class="empty-state">No works visited</div>'}
                        
                        <div class="subsection-label">🏷️ Top Tropes</div>
                        ${renderTopItems(r.tags, 5)}
                    </div>
                    ` : ''}
                    
                    ${!hasCreatorData && !hasReaderData ? `
                    <div class="section-card">
                        <div class="empty-state" style="text-align:center;padding:20px;">No activity recorded for ${year}</div>
                    </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        document.getElementById('year-content').innerHTML = contentHtml;
        
        // Set up tab switching for both year tabs and annual report banner
        const allClickableTabs = document.querySelectorAll('.year-tab, .annual-report-tab');
        allClickableTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active from all tabs (both year tabs and annual report)
                document.querySelectorAll('.year-tab, .annual-report-tab').forEach(t => t.classList.remove('active'));
                
                // Hide all views (both classList and style.display)
                document.querySelectorAll('.year-view, .annual-report-view, .report-confirm-view').forEach(v => {
                    v.classList.remove('active');
                    v.style.display = 'none';
                });
                
                tab.classList.add('active');
                
                // Handle both regular year views and annual report view
                const targetYear = tab.dataset.year;
                const header = document.getElementById('journey-header');
                
                // If clicking annual report tab
                if (targetYear.startsWith('annual-')) {
                    // If already confirmed, go directly to report
                    if (hasConfirmedAnnualReport) {
                        const annualView = document.querySelector('.annual-report-view');
                        if (annualView) {
                            annualView.classList.add('active');
                            annualView.style.display = 'block';
                        }
                        header?.classList.remove('hidden');
                        // Re-initialize carousel
                        setTimeout(() => initCarouselSwipe(), 100);
                    } else {
                        // Show confirmation first
                        const confirmView = document.querySelector(`.report-confirm-view[data-year="confirm-2025"]`);
                        if (confirmView) {
                            confirmView.classList.add('active');
                            confirmView.style.display = 'block';
                            header?.classList.add('hidden');
                        }
                    }
                } else {
                    // Regular year tab - show year view and header
                    const targetView = document.querySelector(`.year-view[data-year="${targetYear}"]`);
                    if (targetView) {
                        targetView.classList.add('active');
                        targetView.style.display = 'block';
                    }
                    header?.classList.remove('hidden');
                }
            });
        });
        
        // Set up confirmation buttons
        const yesBtn = document.getElementById('confirm-yes-btn');
        const noBtn = document.getElementById('confirm-no-btn');
        const header = document.getElementById('journey-header');
        
        // Initially hide header if confirmation is shown
        if (has2025 && header) {
            header.classList.add('hidden');
        }
        
        if (yesBtn) {
            yesBtn.addEventListener('click', () => {
                // Mark as confirmed so it won't show again
                hasConfirmedAnnualReport = true;
                
                // Hide confirmation view completely
                const confirmView = document.querySelector('.report-confirm-view');
                if (confirmView) {
                    confirmView.classList.remove('active');
                    confirmView.style.display = 'none';
                }
                
                // Show annual report view
                const annualReportView = document.querySelector('.annual-report-view');
                if (annualReportView) {
                    annualReportView.classList.add('active');
                    annualReportView.style.display = 'block';
                }
                
                // Show header
                header?.classList.remove('hidden');
                
                // Initialize carousel swipe
                initCarouselSwipe();
            });
        }
        
        if (noBtn) {
            noBtn.addEventListener('click', () => {
                // Close the overlay (same as close button)
                const overlay = document.getElementById('journey-overlay');
                if (overlay) {
                    overlay.style.display = 'none';
                }
                
                // Reset UI state completely but preserve yearlyStats data
                const confirmView = document.querySelector('.report-confirm-view');
                if (confirmView) {
                    confirmView.classList.remove('active');
                    confirmView.style.display = 'none';
                }
                
                // Reset header visibility
                header?.classList.remove('hidden');
                
                // Data is preserved in yearlyStats and cache - user can reopen anytime
                debugLog('User clicked "No, Go Back" - overlay closed, data preserved');
            });
        }
    }

    // ==================== EXPORT UTILITIES ====================
    
    /**
     * Export configuration
     */
    const EXPORT_CONFIG = {
        scale: 2,              // Image quality multiplier for annual report
        format: 'png',         // 'png' or 'jpeg'
        quality: 0.95,         // JPEG quality (0-1)
        watermark: true,       // Add username watermark
        cdnUrl: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
        // Annual Report fixed dimensions - 1242px × 1660px output
        annualReport: {
            width: 621,        // 621px × 2 scale = 1242px output
            height: 830,       // 830px × 2 scale = 1660px output
        },
        // Year View - higher scale for sharper export
        yearView: {
            scale: 3,          // Higher scale for sharper year view export
            width: 540,        // 540px width
            }
    };
        
    /**
     * Load html2canvas library dynamically
     */
    async function loadHtml2Canvas() {
        if (window.html2canvas) return window.html2canvas;
        
        debugLog('Loading html2canvas from CDN...');
        return new Promise((resolve, reject) => {
                        const script = document.createElement('script');
            script.src = EXPORT_CONFIG.cdnUrl;
            script.onload = () => {
                debugLog('html2canvas loaded successfully');
                resolve(window.html2canvas);
            };
            script.onerror = () => reject(new Error('Failed to load html2canvas'));
                        document.head.appendChild(script);
                    });
                }
                
    /**
     * Find the best element to capture for export
     */
    function findExportTarget() {
        // Priority order for what to capture
        const candidates = [
            { selector: '.annual-report-view.active', name: 'annual-report' },
            { selector: '.year-view.active', name: 'year-view' },
            { selector: '#results-view', name: 'results' },
            { selector: '#journey-wrapper', name: 'wrapper' }
        ];
        
        for (const { selector, name } of candidates) {
            const el = document.querySelector(selector);
            if (el && el.offsetWidth > 50 && el.offsetHeight > 50) {
                // For annual report, capture the container directly for cleaner export (no white edge)
                if (name === 'annual-report') {
                    const container = document.querySelector('.annual-report-container');
                    if (container && container.offsetWidth > 50) {
                        return { element: container, type: name };
                    }
                }
                // For year views, capture the active year view directly
                if (name === 'year-view') {
                    // Return the year-view.active directly for cleaner export
                    return { element: el, type: name };
                }
                return { element: el, type: name };
                    }
                }
        return null;
    }
    
    /**
     * Add watermark to canvas
     */
    function addWatermark(canvas, username) {
        if (!EXPORT_CONFIG.watermark) return;
        
        const ctx = canvas.getContext('2d');
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const watermark = `${username || 'user'}@${dateStr}`;
        
        ctx.save();
        ctx.font = `${24 * EXPORT_CONFIG.scale}px Arial, sans-serif`;
        ctx.fillStyle = 'rgba(153, 0, 0, 0.5)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(watermark, canvas.width - 20 * EXPORT_CONFIG.scale, canvas.height - 15 * EXPORT_CONFIG.scale);
        ctx.restore();
                }
                
    /**
     * Download canvas as image file
     */
    function downloadCanvas(canvas, filename) {
        const mimeType = EXPORT_CONFIG.format === 'jpeg' ? 'image/jpeg' : 'image/png';
        const quality = EXPORT_CONFIG.format === 'jpeg' ? EXPORT_CONFIG.quality : undefined;
        
        canvas.toBlob((blob) => {
            if (!blob) {
                throw new Error('Failed to create image blob');
            }
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = filename;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            debugLog('Export complete:', filename);
        }, mimeType, quality);
    }
    
    /**
     * Inject export-safe styles into cloned document
     * This is critical because html2canvas clones the DOM and we need to ensure
     * all problematic CSS features are disabled in the clone
     */
    function injectExportStyles(clonedDoc) {
        const styleEl = clonedDoc.createElement('style');
        styleEl.id = 'export-override-styles';
        styleEl.textContent = `
            /* CRITICAL: Completely disable ALL pseudo-elements to prevent createPattern errors */
            *::before, *::after,
            .annual-report-container::before,
            .annual-report-container::after,
            .report-footer::before, 
            .report-footer::after,
            .report-header::before,
            .report-header::after {
                                display: none !important;
                visibility: hidden !important;
                                content: '' !important;
                                background: transparent !important;
                                background-image: none !important;
                background-color: transparent !important;
                                width: 0 !important;
                                height: 0 !important;
                max-width: 0 !important;
                max-height: 0 !important;
                                opacity: 0 !important;
                pointer-events: none !important;
                position: absolute !important;
                z-index: -9999 !important;
                            }
            
            /* Remove all effects that html2canvas can't handle */
                            * {
                                -webkit-backdrop-filter: none !important;
                                backdrop-filter: none !important;
                animation: none !important;
                transition: none !important;
                            }
            
            /* Force solid backgrounds - no gradients */
            #journey-overlay,
            #journey-wrapper,
            #journey-header,
            #journey-content,
            #results-view,
            #year-content {
                                background: #ffffff !important;
                                background-image: none !important;
                            }
            
                            .annual-report-wrapper {
                                background: #ffffff !important;
                            }
            
                            .annual-report-container {
                                background: #fff5f5 !important;
                                background-image: none !important;
                margin: 0 !important;
                border-radius: 0 !important;
            }
            
            .annual-report-wrapper,
            .annual-report-view {
                padding: 0 !important;
                margin: 0 !important;
                background: #fff5f5 !important;
                height: 100% !important;
                min-height: 830px !important;
            }
            
            /* Fix text layout consistency for export */
            .report-text {
                word-break: keep-all !important;
                overflow-wrap: break-word !important;
                white-space: normal !important;
                line-height: 1.8 !important;
                font-family: 'Noto Serif SC', 'KaiTi', 'STKaiti', serif !important;
                text-rendering: geometricPrecision !important;
                -webkit-font-smoothing: antialiased !important;
                            }
            
            .report-text .report-highlight,
            .report-text .report-number {
                display: inline !important;
                text-rendering: geometricPrecision !important;
            }
            
            /* Prevent book title brackets from breaking */
            .report-text .report-highlight.pink {
                word-break: break-all !important;
            }
            
            .report-section {
                width: 100% !important;
                box-sizing: border-box !important;
            }
            
            .report-carousel-track {
                display: block !important;
                transform: none !important;
            }
            
            .report-carousel {
                overflow: visible !important;
                position: static !important;
            }
            
            /* Hide page indicators and swipe hint during export */
            .page-indicators,
            .swipe-hint {
                display: none !important;
            }
            
                            .report-section {
                                background: #ffffff !important;
                                background-image: none !important;
                                opacity: 1 !important;
                            }
            
            .section-card {
                                background: #ffffff !important;
                                background-image: none !important;
                                opacity: 1 !important;
                box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.08) !important;
            }
            
            .section-card.creator {
                background: #fffafa !important;
                background-image: none !important;
                border-left: 4px solid #990000 !important;
            }
            
            .section-card.reader {
                background: #f8fffd !important;
                background-image: none !important;
                border-left: 4px solid #2a9d8f !important;
            }
            
            .stat-box {
                background: #fafafa !important;
                                background-image: none !important;
                                opacity: 1 !important;
                border: 1px solid #eee !important;
            }
            
            .list-item {
                background: transparent !important;
                background-image: none !important;
                opacity: 1 !important;
                border: none !important;
                border-bottom: 1px solid #eee !important;
                border-radius: 0 !important;
                margin-bottom: 0 !important;
                padding: 8px 0 !important;
                            }
            
            /* Fix gradient text */
                            .report-year, .report-blessing {
                                background: none !important;
                -webkit-background-clip: unset !important;
                background-clip: unset !important;
                                -webkit-text-fill-color: #990000 !important;
                                color: #990000 !important;
                            }
            
            /* Solid button backgrounds */
            .years-badge {
                background: #990000 !important;
                                background-image: none !important;
                            }
            
            .year-tab {
                background: #ffffff !important;
                                background-image: none !important;
                            }
                        
            .year-tab.active {
                background: #990000 !important;
                background-image: none !important;
            }
            
            .annual-report-tab {
                background: #990000 !important;
                background-image: none !important;
                box-shadow: none !important;
                            }
                        
            #floating-journey-btn,
            #close-journey,
            #export-journey,
            #journey-header-buttons,
            #journey-title {
                display: none !important;
            }
            
            /* Hide inactive views */
            .year-view:not(.active),
            .annual-report-view:not(.active),
            .report-confirm-view {
                display: none !important;
                height: 0 !important;
                            }
                        
            /* Ensure active content is visible with solid backgrounds */
            .year-view.active {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                                background: #ffffff !important;
                background-image: none !important;
            }
            
            .annual-report-view.active {
                display: block !important;
                visibility: visible !important;
                                opacity: 1 !important;
                            }
            
            /* LAYERED LAYOUT FOR FIXED 1242x1660 EXPORT */
            /* Container uses flexbox with space-between to push footer to bottom */
            .annual-report-container {
                padding: 40px 12px 30px 12px !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: space-between !important;
                height: 830px !important;
                min-height: 830px !important;
                box-sizing: border-box !important;
                position: relative !important;
            }
            
            /* CRITICAL: Only show the active page during export */
            .report-page {
                display: none !important;
            }
            
            /* Layer 2: Content box (centered in middle area) */
            .report-page.export-active {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: flex-start !important;
                width: 100% !important;
                            }
            
            /* Layer 1: Header (at top) */
            .report-header {
                flex-shrink: 0 !important;
                margin-bottom: 0 !important;
                text-align: center !important;
            }
            
            /* Carousel takes flexible space in middle */
            .report-carousel {
                flex: 1 !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                position: static !important;
                overflow: visible !important;
            }
            
            .report-year {
                font-size: 52px !important;
                margin-bottom: 3px !important;
            }
            
            .report-subtitle {
                font-size: 22px !important;
                margin-bottom: 15px !important;
            }
            
            .report-user-info {
                font-size: 17px !important;
                margin-bottom: 8px !important;
                            }
            
                            .years-badge {
                font-size: 18px !important;
                padding: 6px 14px !important;
                margin-bottom: 0 !important;
                text-align: center !important;
            }
            
            .report-section {
                padding: 14px 12px !important;
                margin-bottom: 0 !important;
            }
            
            .page-label {
                font-size: 22px !important;
                margin-bottom: 15px !important;
            }
            
            .report-text {
                font-size: 16px !important;
                line-height: 1.5 !important;
                margin-bottom: 10px !important;
                padding-left: 1.5em !important;
                text-indent: -1.5em !important;
            }
            
            .report-divider {
                display: block !important;
                visibility: visible !important;
                height: 2px !important;
                min-height: 2px !important;
                margin: 12px 0 !important;
                background: linear-gradient(90deg, transparent 0%, rgba(153,0,0,0.3) 20%, rgba(153,0,0,0.3) 80%, transparent 100%) !important;
                background-color: transparent !important;
                border: none !important;
                opacity: 1 !important;
            }
            
            .report-highlight {
                font-size: 1.15em !important;
            }
            
            .report-number {
                font-size: 1.2em !important;
            }
            
            /* Hide all footers inside report-pages (we clone one to container level) */
            .report-page .report-footer {
                display: none !important;
                        }
                        
            /* Layer 3: Footer (at bottom via flexbox - direct child of container) */
            .annual-report-container > .report-footer {
                display: block !important;
                flex-shrink: 0 !important;
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                text-align: center !important;
            }
            
            .report-quote {
                font-size: 17px !important;
                margin-bottom: 6px !important;
            }
            
            .report-blessing {
                font-size: 22px !important;
            }
            
            .report-decoration {
                font-size: 16px !important;
                color: rgba(153, 0, 0, 0.4) !important;
                margin-bottom: 6px !important;
                margin-top: 0 !important;
                letter-spacing: 8px !important;
                display: block !important;
                visibility: visible !important;
            }
            
            .report-decoration-end {
                font-size: 20px !important;
                margin-top: 8px !important;
                opacity: 0.8 !important;
                display: block !important;
                visibility: visible !important;
            }
            
            .report-closing {
                font-size: 16px !important;
                margin-top: 8px !important;
                        }
                        
            /* Ensure footer, blessing, and decorations are visible */
            .report-footer, .report-blessing, .report-decoration, .report-decoration-end {
                display: block !important;
                visibility: visible !important;
            }
        `;
        clonedDoc.head.appendChild(styleEl);
    }
    
    /**
     * Main export function - simplified with export-mode class
     */
    async function exportJourney(exportBtn) {
        exportBtn.disabled = true;
        exportBtn.textContent = '⏳ Exporting...';
        
        const wrapper = document.getElementById('journey-wrapper');
        
        try {
            // Check if on confirmation page
            if (document.querySelector('.report-confirm-view.active')) {
                alert('Please click "Yes, Continue" first to view the report');
                return;
            }
            
            // Load html2canvas
            await loadHtml2Canvas();
                        
            // Find target element
            const target = findExportTarget();
            if (!target) {
                alert('No content to export');
                return;
                        }
                        
            debugLog('Export target:', target.type, target.element);
            
            // Scroll to top and wait for render
            const overlay = document.getElementById('journey-overlay');
            if (overlay) overlay.scrollTop = 0;
            
            // Enable export mode on live document (for visual feedback)
            wrapper?.classList.add('export-mode');
            
            // Wait for CSS to apply and layout to stabilize
            await sleep(300);
            
            // Ensure fonts are loaded before capturing
            if (document.fonts && document.fonts.ready) {
                await document.fonts.ready;
            }
            
            // Get dimensions AFTER export mode is applied
            const rect = target.element.getBoundingClientRect();
            let width, height;
            
            // Use fixed 3:4 dimensions for annual report
            const isAnnualReport = target.type === 'annual-report';
            if (isAnnualReport && EXPORT_CONFIG.annualReport) {
                width = EXPORT_CONFIG.annualReport.width;   // 621px → 1242px output
                height = EXPORT_CONFIG.annualReport.height; // 828px → 1656px output
                debugLog('Annual report FIXED dimensions (3:4):', width, 'x', height, '(output:', width*2, 'x', height*2, ')');
            } else {
                // Year view - fixed width, dynamic height with minimal buffer
                width = EXPORT_CONFIG.yearView.width || 540;
                const contentHeight = Math.max(rect.height, target.element.scrollHeight);
                height = contentHeight + 20; // Small 20px buffer only
                debugLog('Year view dimensions:', width, 'x', height, '(output:', width*3, 'x', height*3, ')');
            }
            
            if (width < 50 || height < 50) {
                throw new Error('Content area too small to export');
            }
            
            // Capture with html2canvas (pink background for annual report, white for others)
            const bgColor = isAnnualReport ? '#fff5f5' : '#ffffff';
            const exportScale = isAnnualReport ? EXPORT_CONFIG.scale : (EXPORT_CONFIG.yearView.scale || 3);
            const canvas = await window.html2canvas(target.element, {
                backgroundColor: bgColor,
                scale: exportScale, // Higher scale for year view for sharper export
                width: width,
                height: height,
                useCORS: true,
                allowTaint: true,
                logging: CONFIG.DEBUG_MODE,
                imageTimeout: 15000,
                // Ignore problematic elements entirely
                ignoreElements: (element) => {
                    // Ignore the floating button
                    if (element.id === 'floating-journey-btn') return true;
                    // Ignore any element with data-html2canvas-ignore
                    if (element.hasAttribute('data-html2canvas-ignore')) return true;
                    return false;
                },
                onclone: (clonedDoc) => {
                    // CRITICAL: Inject export-safe styles into the cloned document
                    injectExportStyles(clonedDoc);
                        
                    // Also add export-mode class to cloned wrapper
                    const clonedWrapper = clonedDoc.getElementById('journey-wrapper');
                    if (clonedWrapper) {
                        clonedWrapper.classList.add('export-mode');
                        }
                        
                    // Get original element widths before cloning affects layout
                    const originalPage = document.querySelector('.report-page');
                    const originalSection = document.querySelector('.report-section');
                    const originalText = document.querySelector('.report-text');
                    const pageWidth = originalPage ? originalPage.offsetWidth : width;
                    const sectionWidth = originalSection ? originalSection.offsetWidth : (width - 20);
                    const textWidth = originalText ? originalText.offsetWidth : (sectionWidth - 20);
                    
                    // Determine which page is currently visible (check active dot)
                    const activeDot = document.querySelector('.page-dot.active');
                    const currentPageNum = activeDot ? activeDot.dataset.page : '1';
                    
                    // Mark the current page as export-active in cloned doc
                    const clonedPages = clonedDoc.querySelectorAll('.report-page');
                    clonedPages.forEach(page => {
                        if (page.dataset.page === currentPageNum) {
                            page.classList.add('export-active');
                        }
                    });
                    // Fallback: if no pages marked, mark the first one
                    if (clonedDoc.querySelectorAll('.report-page.export-active').length === 0 && clonedPages.length > 0) {
                        clonedPages[0].classList.add('export-active');
                        }
                        
                    // Fix text layout - ensure container has same width as original
                    const clonedContainer = clonedDoc.querySelector('.annual-report-container');
                    if (clonedContainer) {
                        clonedContainer.style.width = width + 'px';
                        clonedContainer.style.maxWidth = width + 'px';
                        clonedContainer.style.minWidth = width + 'px';
                        clonedContainer.style.boxSizing = 'border-box';
                    }
                        
                    // Also fix report-page and report-section widths with EXACT pixel values
                    clonedDoc.querySelectorAll('.report-page').forEach(el => {
                        el.style.width = pageWidth + 'px';
                        el.style.maxWidth = pageWidth + 'px';
                        el.style.minWidth = pageWidth + 'px';
                        el.style.boxSizing = 'border-box';
                        });
                    
                    clonedDoc.querySelectorAll('.report-section').forEach(el => {
                        el.style.width = sectionWidth + 'px';
                        el.style.maxWidth = sectionWidth + 'px';
                        el.style.boxSizing = 'border-box';
                        });
                    
                    // Fix report-text elements to prevent text reflow - use EXACT pixel widths
                    clonedDoc.querySelectorAll('.report-text').forEach(el => {
                        el.style.wordBreak = 'keep-all';
                        el.style.overflowWrap = 'break-word';
                        el.style.whiteSpace = 'normal';
                        el.style.width = textWidth + 'px';
                        el.style.maxWidth = textWidth + 'px';
                        el.style.boxSizing = 'border-box';
                        });
                        
                    // AGGRESSIVE CLEANUP: Remove ALL gradient backgrounds
                    // This prevents the createPattern error from ANY element
                        clonedDoc.querySelectorAll('*').forEach(el => {
                        const computed = window.getComputedStyle(el);
                        const bgImage = computed.backgroundImage;
                        
                        // Remove any background with gradients
                        if (bgImage && bgImage !== 'none' && 
                            (bgImage.includes('gradient') || bgImage.includes('radial'))) {
                            el.style.backgroundImage = 'none';
                        }
                        
                        // Remove backdrop-filter
                        if (computed.backdropFilter !== 'none') {
                                el.style.backdropFilter = 'none';
                                el.style.webkitBackdropFilter = 'none';
                        }
                        });
                        
                    // Force remove background-image from annual-report-container
                    // This is the main culprit causing createPattern errors
                    const container = clonedDoc.querySelector('.annual-report-container');
                    if (container) {
                        container.style.cssText += 'background: #fff5f5 !important; background-image: none !important;';
                    }
                        
                    // Also fix the report sections
                    clonedDoc.querySelectorAll('.report-section').forEach(el => {
                            el.style.background = '#ffffff';
                            el.style.backgroundImage = 'none';
                        el.style.backdropFilter = 'none';
                            el.style.opacity = '1';
                        });
                    
                    // Ensure active views are visible with proper dimensions
                    clonedDoc.querySelectorAll('.annual-report-view.active').forEach(el => {
                        el.style.display = 'block';
                        el.style.visibility = 'visible';
                            el.style.opacity = '1';
                        el.style.minHeight = '100px';
                        });
                        
                    // Year view specific styling - solid white background, reduced padding
                    clonedDoc.querySelectorAll('.year-view.active').forEach(el => {
                        el.style.cssText = `
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                            background: #ffffff !important;
                            background-color: #ffffff !important;
                            background-image: none !important;
                            width: ${width}px !important;
                            max-width: ${width}px !important;
                            padding: 8px !important;
                            box-sizing: border-box !important;
                        `;
                        });
                        
                    // Fix section cards in year view - reduced margin
                    clonedDoc.querySelectorAll('.year-view.active .section-card').forEach(el => {
                        let bgColor = '#ffffff';
                        let borderColor = '#e0e0e0';
                        if (el.classList.contains('creator')) {
                            bgColor = '#fffafa';
                            borderColor = '#990000';
                        } else if (el.classList.contains('reader')) {
                            bgColor = '#f8fffd';
                            borderColor = '#2a9d8f';
                        }
                        el.style.cssText = `
                            background: ${bgColor} !important;
                            background-image: none !important;
                            opacity: 1 !important;
                            border-left: 4px solid ${borderColor} !important;
                            box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.08) !important;
                            border-radius: 12px !important;
                            padding: 15px !important;
                            margin-bottom: 10px !important;
                        `;
                        });
                        
                    // Fix stat boxes and list items in year view
                    clonedDoc.querySelectorAll('.year-view.active .stat-box').forEach(el => {
                        el.style.cssText = `
                            background: #fafafa !important;
                            background-image: none !important;
                            opacity: 1 !important;
                            border: 1px solid #eee !important;
                            border-radius: 8px !important;
                            padding: 12px !important;
                        `;
                        });
                    
                    clonedDoc.querySelectorAll('.year-view.active .list-item').forEach(el => {
                        el.style.cssText = `
                            background: transparent !important;
                            background-image: none !important;
                            opacity: 1 !important;
                            border: none !important;
                            border-bottom: 1px solid #eee !important;
                            border-radius: 0 !important;
                            padding: 8px 0 !important;
                            margin-bottom: 0 !important;
                        `;
                    });
                    
                    // CRITICAL: For annual report, physically move footer to be direct child of container
                    const annualContainer = clonedDoc.querySelector('.annual-report-container');
                    if (annualContainer) {
                        // Set container to use flexbox with space-between
                        annualContainer.style.cssText = `
                            display: flex !important;
                            flex-direction: column !important;
                            justify-content: space-between !important;
                            align-items: center !important;
                            height: ${height}px !important;
                            min-height: ${height}px !important;
                            padding: 40px 12px 30px 12px !important;
                            box-sizing: border-box !important;
                            background: #fff5f5 !important;
                            background-image: none !important;
                            position: relative !important;
                        `;
                        
                        // First, hide ALL footers inside report-pages
                        clonedDoc.querySelectorAll('.report-page .report-footer').forEach(f => {
                            f.style.display = 'none';
                        });
                
                        // Find footer from the ACTIVE page only
                        const activePage = clonedDoc.querySelector('.report-page.export-active');
                        const footer = activePage ? activePage.querySelector('.report-footer') : clonedDoc.querySelector('.report-footer');
                        
                        if (footer) {
                            // Clone the footer (don't move, to avoid issues)
                            const footerClone = footer.cloneNode(true);
                            // Append cloned footer to container as last child
                            annualContainer.appendChild(footerClone);
                            // Style the footer
                            footerClone.style.cssText = `
                                display: block !important;
                                flex-shrink: 0 !important;
                                width: 100% !important;
                                text-align: center !important;
                                padding: 0 !important;
                                margin: 0 !important;
                            `;
                        }
                        
                        // Wrap header and content in a flex-grow section
                        const header = clonedDoc.querySelector('.report-header');
                        const carousel = clonedDoc.querySelector('.report-carousel');
                        if (header && carousel) {
                            header.style.flexShrink = '0';
                            carousel.style.cssText = `
                                flex: 1 !important;
                                display: flex !important;
                                flex-direction: column !important;
                                justify-content: center !important;
                                position: static !important;
                                overflow: visible !important;
                            `;
                        }
                    }
                    
                    // Ensure dividers are visible with gradient
                    clonedDoc.querySelectorAll('.report-divider').forEach(el => {
                        el.style.cssText = `
                            display: block !important;
                            visibility: visible !important;
                            height: 2px !important;
                            min-height: 2px !important;
                            margin: 12px 0 !important;
                            background: linear-gradient(90deg, transparent 0%, rgba(153,0,0,0.3) 20%, rgba(153,0,0,0.3) 80%, transparent 100%) !important;
                            opacity: 1 !important;
                        `;
                    });
                    
                    // Remove position:relative from carousel to prevent stacking context issues
                    clonedDoc.querySelectorAll('.report-carousel').forEach(el => {
                        el.style.position = 'static';
                    });
                
                    debugLog('Cloned document prepared for export');
                }
            });
            
            // Disable export mode
            wrapper?.classList.remove('export-mode');
                
            if (!canvas || canvas.width === 0 || canvas.height === 0) {
                throw new Error('Canvas is empty - capture failed');
            }
            
            debugLog('Canvas created:', canvas.width, 'x', canvas.height);
            
            // Add watermark
            addWatermark(canvas, getLoggedInUsername());
                
            // Generate filename
                const year = document.querySelector('.year-tab.active')?.dataset?.year || 
                             document.querySelector('.annual-report-tab.active')?.dataset?.year?.replace('annual-', '') || 
                         new Date().getFullYear();
            const ext = EXPORT_CONFIG.format === 'jpeg' ? 'jpg' : 'png';
            
            // Download
            downloadCanvas(canvas, `AO3-Journey-${year}.${ext}`);
                
            } catch (err) {
            console.error('[AO3 Journey] Export failed:', err);
            debugLog('Export error details:', err.message, err.stack);
                alert('Export failed: ' + err.message);
            } finally {
            // Always clean up export mode
            wrapper?.classList.remove('export-mode');
                exportBtn.disabled = false;
                exportBtn.textContent = '📷 Export';
            }
    }

    // ==================== UI CREATION ====================

    function createUI() {
        // Add styles
        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
        
        // Create floating button
        const fab = document.createElement('button');
        fab.id = 'floating-journey-btn';
        fab.textContent = '📖 My AO3 Journey';
        document.body.appendChild(fab);
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'journey-overlay';
        overlay.innerHTML = `
            <div id="journey-wrapper">
                <div id="journey-header">
                    <div id="journey-title-container">
                        <img src="https://archiveofourown.org/images/ao3_logos/logo_42.png" alt="AO3" id="ao3-header-logo">
                        <h2 id="journey-title">AO3 Journey</h2>
                    </div>
                    <div id="journey-header-buttons">
                        <button id="refresh-journey" title="Refresh all data (ignore cache)">🔄 Refresh</button>
                        <button id="export-journey">📷 Export</button>
                        <button id="close-journey">✕ Close</button>
                    </div>
                    <div id="annual-report-banner"></div>
                    <div id="year-tabs"></div>
                </div>
                
                <div id="journey-content">
                    <div id="progress-view">
                        <div id="progress-title">Creating your AO3 Annual Report<span class="dots"></span></div>
                        <div id="progress-status">Initializing...</div>
                        <div id="progress-bar-container">
                            <div id="progress-bar"></div>
                        </div>
                        <div id="progress-detail"></div>
                    </div>
                    
                    <div id="results-view">
                        <div id="year-content"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // Event handlers
        fab.addEventListener('click', () => {
            overlay.style.display = 'flex';
            
            // Step 1: Check if data is available
            const hasData = Object.keys(yearlyStats).length > 0 && yearlyStats['2025'];
            
            if (!isScanning && !hasData) {
                // Step 3: No data - start scanning
                document.getElementById('progress-view').style.display = 'block';
                document.getElementById('results-view').style.display = 'none';
                document.getElementById('export-journey')?.classList.remove('visible');
                document.getElementById('refresh-journey')?.classList.remove('visible');
                updateProgress('Initializing...', '', 0);
                startFullScan();
            } else if (hasData) {
                // Step 2: Data available - check confirmation status
                const header = document.getElementById('journey-header');
                
                // Hide all views first (clean slate)
                document.querySelectorAll('.year-view').forEach(v => {
                    v.classList.remove('active');
                    v.style.display = 'none';
                });
                document.querySelectorAll('.annual-report-view').forEach(v => {
                    v.classList.remove('active');
                    v.style.display = 'none';
                });
                const confirmView = document.querySelector('.report-confirm-view');
                if (confirmView) {
                    confirmView.classList.remove('active');
                    confirmView.style.display = 'none';
                }
                
                if (hasConfirmedAnnualReport) {
                    // Step 2a: Already confirmed - show annual report directly
                    header?.classList.remove('hidden');
                    const annualReportView = document.querySelector('.annual-report-view');
                    if (annualReportView) {
                        annualReportView.classList.add('active');
                        annualReportView.style.display = 'block';
                    }
                    document.querySelectorAll('.year-tab').forEach(t => t.classList.remove('active'));
                    document.querySelector('.annual-report-tab')?.classList.add('active');
                    initCarouselSwipe();
                } else {
                    // Step 2b: Not confirmed - show confirmation page
                    header?.classList.add('hidden');
                    if (confirmView) {
                        confirmView.classList.add('active');
                        confirmView.style.display = 'block';
                    }
                    document.querySelectorAll('.year-tab').forEach(t => t.classList.remove('active'));
                    document.querySelector('.annual-report-tab')?.classList.add('active');
                }
            }
        });
        
        document.getElementById('close-journey').addEventListener('click', () => {
            overlay.style.display = 'none';
        });
        
        // Handle export button click
        const exportBtn = document.getElementById('export-journey');
        exportBtn.addEventListener('click', () => exportJourney(exportBtn));
        
        // Handle refresh button click (force full scan)
        const refreshBtn = document.getElementById('refresh-journey');
        refreshBtn.addEventListener('click', async () => {
            if (isScanning) return;
            
            // Show confirmation
            if (!confirm('This will refresh all data and may take several minutes. Continue?')) {
                return;
            }
            
            // Reset UI to progress view
            document.getElementById('progress-view').style.display = 'block';
            document.getElementById('results-view').style.display = 'none';
            exportBtn.classList.remove('visible');
            refreshBtn.classList.remove('visible');
            
            // Start full scan (ignore cache)
            await startScan(true);
        });
    }

    // ==================== INITIALIZATION ====================

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
    createUI();
    }
})();
