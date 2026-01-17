// ==UserScript==
// @name         「」モダナイザー
// @namespace    http://2chan.net/
// @version      0.0.18
// @description  ふたばちゃんねるのUIをモダン化し、NG機能、設定画面、自動リロード、どこでも投稿機能を追加しちゃう。
// @author       wamo
// @match        *://*.2chan.net/*/
// @match        *://*.2chan.net/*/*.htm
// @match        *://*.2chan.net/*/futaba.php*
// @match        *://*.2chan.net/*/res/*
// @match        *://kako.futakuro.com/futa/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2chan.net
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560520/%E3%80%8C%E3%80%8D%E3%83%A2%E3%83%80%E3%83%8A%E3%82%A4%E3%82%B6%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/560520/%E3%80%8C%E3%80%8D%E3%83%A2%E3%83%80%E3%83%8A%E3%82%A4%E3%82%B6%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------------------------------------------------------
    // 1. CSS Injection (Modern UI + Mobile Support)
    // ---------------------------------------------------------
    const THEME_KEY = 'futaba_theme_mode'; // 'classic', 'modern_light', 'modern_dark'
    const MODERN_UI_KEY_OLD = 'futaba_modern_ui_enabled';

    // ---------------------------------------------------------
    // 1. CSS Injection (Split into Core, Modern, and Dark)
    // ---------------------------------------------------------

    // CORE CSS: Functional, Essential Responsive, and Features independent of visual style (FAB, NG, Modals)
    const coreCSS = `
        /* Mobile/Responsive Base */
        @media (max-device-width: 799px) {
            #hdp {
                height: auto;
            }
            body {
                -webkit-text-size-adjust: auto;
                font-size: 100%;
                min-width: 0 !important;
            }
            img {
                max-width: 100% !important;
                height: auto !important;
            }
            table {
                width: 100% !important;
            }
            .rtd {
                border-radius: 8px !important;
                width: calc(100% - 20px) !important;
                min-width: 0 !important;
                max-width: 100% !important;
                padding: 10px;
            }
            .psen {
                margin: 0;
            }
            .psen tr {
                display: flex;
                flex-direction: column;
            }
            #cattable tr {
                display: grid;
                grid-template-columns: repeat(5, minmax(0, 1fr));
            }
            .cno {
                font-size: 1rem;
                margin: 0;
            }
            .sod {
                display: block;
            }
            blockquote {
                overflow-wrap: anywhere;
            }
            .spinnerDiv input {
                padding: 4px;
            }
            blockquote, .sod, .hsbn, .inputDiv, .spinnerDiv input {
                font-size: 1rem;
            }
            table:not(.ftbl):not(.ftb2):not(.menu) {
                max-width: 100% !important;
                min-width: 0 !important;
            }
            #tit, #hml {
                position: relative;
            }
        }

        /* Post Modal (Functionality) */
        #post-modal {
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10001;
            align-items: center;
            justify-content: center;
        }
        #post-modal-content {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            max-height: 90dvh;
            overflow-y: auto;
            overflow-x: hidden;
            position: relative;
        }
        #post-modal-close {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        #ftxa {
            width: 100%;
        }

        /* Settings Modal & Overlay */
        #settings-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 500px;
            max-height: 80dvh;
            background: #fff;
            border-radius: 8px;
            z-index: 10002;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            overflow-y: auto;
            color: #333;
            text-align: left;
        }
        .settings-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10001;
        }
        .settings-section { margin-bottom: 20px; }
        .settings-section h4 { margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 5px; }

        /* NG Functions */
        .ng-list {
            list-style: none;
            padding: 0;
            border: 1px solid #eee;
            max-height: 150px;
            overflow-y: auto;
        }
        .ng-list li {
            padding: 8px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
        }
        .remove-btn {
            background: #d9534f;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 2px 8px;
            cursor: pointer;
        }
        .ng-placeholder {
            padding: 10px;
            background: #eee;
            margin: 5px 0;
            border-radius: 5px;
            color: #888;
            font-size: 0.9em;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .ng-button { /* Minimal style for NG button even if modern is off */
            cursor: pointer;
            margin-left: 8px;
            color: #d9534f;
            font-size: 0.8em;
            font-weight: bold;
            border: 1px solid #d9534f;
            padding: 0 4px;
            border-radius: 4px;
        }

        /* FAB Container */
        #fab-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 10000;
        }
        .fab-btn {
            background-color: rgba(50, 50, 50, 0.8);
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            transition: all 0.2s;
            position: relative;
            user-select: none;
        }
        .fab-btn:hover {
            background-color: rgba(50, 50, 50, 1);
            transform: scale(1.05);
        }
        .fab-btn.active {
            background-color: #007bff !important;
        }
        .auto-reload-status {
            font-size: 0.8rem;
            position: absolute;
            top: -5px;
            right: -5px;
            background: red;
            color: white;
            border-radius: 50%;
            width: 15px;
            height: 15px;
            display: none;
        }
        .gotop, .gobtm {
            display: none!important;
        }

        /* adblock */
        html body #rightadc, html body .footfix {
            display: none!important;
        }
    `;

    // MODERN CSS: Visual Overhaul
    const modernCSS = `
        /* Base improvements */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.5;
            background-color: #fbfbfb;
            color: #333;
            margin: 0;
            padding: 10px;
            padding-bottom: 80px;
            overflow-x: hidden;
        }

        /* Hide legacy/clutter elements */
        iframe, .tue, .tue2, #akahuku_bottom_status, div[style*="width:728px"], hr {
            display: none !important;
        }

        /* Hide default form (handled by FAB) */
        #fm { display: none; }

        /* Top Navigation Styling */
        #hdp {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fff;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 15px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            flex-wrap: wrap;
            gap: 10px;
            height: auto;
        }
        #tit {
            width: auto;
            position: relative;
            font-size: 1.2rem;
            font-weight: bold;
            color: #d9534f;
            display: inline-block;
        }
        #hml {
            position: relative;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        #hml input[type="text"] {
            padding: 6px 12px;
            border: 1px solid #ddd;
            border-radius: 20px;
            width: 160px;
            font-size: 0.9rem;
            outline: none;
            transition: all 0.2s;
            background: #fdfdfd;
        }
        #hml input[type="text"]:focus {
            border-color: #d9534f;
            background: #fff;
            box-shadow: 0 0 5px rgba(217, 83, 79, 0.2);
        }
        #hml input[type="submit"] {
            cursor: pointer;
            background: #d9534f;
            color: #fff;
            border: none;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: bold;
            transition: background 0.2s;
            margin-right: 0;
        }
        #hml input[type="submit"]:hover {
            background: #c9302c;
        }
        a[href$="futaba.htm"] {
            margin-bottom: 15px;
        }
        a[href*="2chan.net/"], a[href$="futaba.htm"] {
            display: inline-block;
            text-decoration: none;
            color: #555;
            background: #e9e9e9;
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 0.85rem;
            transition: background 0.2s;
        }
        a[href*="2chan.net/"]:hover, a[href$="futaba.htm"]:hover {
            background: #d0d0d0;
            color: #000;
        }

        /* Bottom Reload Styling */
        #contres {
            display: block;
            margin-top: 20px;
            text-align: center;
            font-size: 1rem;
        }
        #contres a {
            display: inline-block;
            background: #d9534f;
            color: #fff;
            padding: 10px 30px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: transform 0.1s;
        }
        #contres a:active { transform: scale(0.95); }

        /* Container adjustments */
        .thre {
            background: #fff;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            margin-bottom: 20px;
            max-width: 100%;
            overflow: hidden;
        }

        /* Modern Table Cards */
        table:not(.ftbl):not(.ftb2):not(.menu)[width="100%"] {
            width: 100% !important;
            max-width: 100%;
        }
        table:not(.ftbl):not(.ftb2):not(.menu) th[bgcolor] {
            width: 100% !important;
            display: block;
        }
        table:not(.ftbl):not(.ftb2):not(.menu) {
            display: block;
            background: #fff;
            margin-bottom: 10px !important;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            width: 100% !important;
            max-width: 800px;
        }
        table:not(.ftbl):not(.ftb2) tbody,
        table:not(.ftbl):not(.ftb2) tr,
        table:not(.ftbl):not(.ftb2) td {
            display: block;
            width: 100%;
        }
        .rtd {
            background-color: transparent !important;
            padding: 10px !important;
        }
        table:not(.ftbl):not(.ftb2) td.rts { display: none; }

        @media (max-device-width: 799px) {
            .sod {
                display: block;
            }
        }
        .sod {
            width: fit-content;
            font-size: 0.95rem;
            margin: 8px 0 4px 0;
            padding: 6px 14px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 16px;
            color: #444;
            text-decoration: none;
            line-height: 1.2;
        }
        .sod:active {
            background: #e0e0e0;
        }

        /* Default hide deleted posts */
        table:not(.ftbl):not(.ftb2):not(.menu).deleted { display: none; }

        /* Form tables spacing */
        .ftbl, .ftb2 {
            display: table !important;
            width: 100% !important;
            max-width: 100% !important;
            background: transparent !important;
            box-shadow: none !important;
        }
        .ftbl tbody, .ftb2 tbody { display: table-row-group !important; }
        .ftbl tr, .ftb2 tr { display: table-row !important; }
        .ftbl td, .ftb2 td {
            display: table-cell !important;
            width: auto !important;
            padding: 5px;
            vertical-align: middle;
        }

        .cnw { font-size: 0.85rem; color: #666; }
        blockquote {
            margin: 10px 0 !important;
            font-size: 1rem;
            color: #222;
            max-width: 780px;
        }

        /* Thumbnails: Modern styling */
        img[src*="/b/thumb/"] {
            display: block !important;
            float: none !important;
            margin: 0 0 10px 0 !important;
            max-width: 100% !important;
            height: auto !important;
        }
        img[align="left"], img[align="right"] { float: none !important; }
        .ng-button:hover { background-color: #d9534f; color: #fff; }
        #id-modal-list a[href*="/b/src/"] {
            padding: 0 !important;
            background: none;
            border-radius: 0;
        }

        /* Media Queries for Modern Layout Adjustments (Overrides) */
        @media (max-width: 600px) {
            .thre, table {
                margin-bottom: 15px;
            }
            #hdp {
                flex-direction: row;
                align-items: stretch;
            }
        }

        /* Header Menu (Extracted from catlink) */
        #custom-header-menu {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 10px;
            width: 100%;
        }
        #custom-header-menu a {
            display: inline-block;
            background: #fff;
            border: 1px solid #ddd;
            padding: 4px 10px;
            border-radius: 15px;
            text-decoration: none;
            font-size: 0.85rem;
            color: #555;
            transition: all 0.2s;
        }
        #custom-header-menu a:hover {
            background: #d9534f;
            color: #fff;
            border-color: #d9534f;
        }
        #custom-header-menu a.active {
            background: #d9534f;
            color: #fff;
            border-color: #d9534f;
            font-weight: bold;
        }

        /* Pagination Modernization */
        .psen {
            display: flex !important;
            flex-wrap: wrap;
            justify-content: start;
            align-items: center;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            margin: 20px auto !important;
            padding: 0 !important;
            gap: 5px;
        }
        .psen tbody, .psen tr {
            display: contents !important;
        }
        .psen td {
            display: flex !important;
            align-items: center;
            flex-wrap: wrap;
            gap: 5px;
            padding: 0 !important;
            border: none !important;
            background: transparent !important;
            justify-content: start;
        }

        .psen a, .psen b {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            min-width: 32px;
            height: 32px;
            padding: 0 6px;
            border-radius: 4px;
            text-decoration: none;
            background: #fff;
            color: #333;
            border: 1px solid #ddd;
            font-size: 0.9rem;
            transition: all 0.2s;
            margin: 0 !important;
        }
        .psen a:hover {
            background: #d9534f;
            color: white;
            border-color: #d9534f;
        }
        .psen b {
            background: #d9534f;
            color: white;
            border-color: #d9534f;
            font-weight: bold;
        }

        .psen form {
            margin: 0 !important;
            display: inline-block;
        }
        .psei {
            cursor: pointer;
            background: #fff;
            border: 1px solid #ddd;
            padding: 6px 12px;
            border-radius: 4px;
            color: #333;
            font-size: 0.9rem;
            transition: all 0.2s;
            appearance: none;
            height: 34px; /* match link height approx */
        }
        .psei:hover {
            background: #d9534f;
            color: white;
            border-color: #d9534f;
        }

        /* Catalog Grid Styling */
        #catalog-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 15px;
            padding: 10px;
            margin-top: 15px;
        }
        .catalog-item {
            position: relative;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            transition: transform 0.2s, box-shadow 0.2s;
            overflow: hidden;
            text-decoration: none;
            color: inherit;
        }
        .catalog-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border-color: #d9534f;
        }
        .catalog-item img {
            aspect-ratio: 1;
            width: auto !important;
            max-width: 100% !important;
            height: auto !important;
            border-radius: 4px;
            margin-bottom: 5px;
            object-fit: contain;
        }
        .catalog-item a {
            text-decoration: none;
            color: #333;
            display: block;
            width: 100%;
        }
        .catalog-item font {
            font-size: 0.8rem;
            color: #666;
        }

        /* popup */
        .pdmm, .slp {
            border: none;
            background: #fff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .pdms {
            margin: 10px 5px;
        }
        .pdms:nth-child(4) {
            color: #d9534f;
        }
        .qtd {
            background: #fff;
        }
    `;

    // DARK MODE OVERRIDES
    const darkThemeOverrides = `
        :root {
            --dark-bg-main: #121212;
            --dark-bg-panel: #1e1e1e;
            --dark-bg-input: #2a2a2a;
            --dark-border: #333333;
            --dark-text-main: #e0e0e0;
            --dark-text-sub: #a0a0a0;
            --dark-link: #8daaff;
            --dark-link-visited: #b08dff;
            --dark-link-hover: #ff8d8d;
            --dark-accent: #d9534f;
            --dark-quote: #aacc55;
        }

        body {
            background-color: var(--dark-bg-main) !important;
            color: var(--dark-text-main) !important;
        }

        /* Panels & Containers */
        .thre, #hdp, table:not(.ftbl):not(.ftb2):not(.menu) {
            background-color: var(--dark-bg-panel) !important;
            border: 1px solid var(--dark-border) !important;
            color: var(--dark-text-main) !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4) !important;
        }

        /* Headers & Navigation */
        #tit { color: var(--dark-accent) !important; text-shadow: none !important; }

        #hml input[type="text"], #hml input[type="submit"] {
            background-color: var(--dark-bg-input) !important;
            border-color: var(--dark-border) !important;
            color: var(--dark-text-main) !important;
        }

        #custom-header-menu a, .psen a, .psen b, a[href*="2chan.net/"], a[href$="futaba.htm"] {
            background-color: var(--dark-bg-input) !important;
            border-color: var(--dark-border) !important;
            color: var(--dark-text-main) !important;
        }
        #custom-header-menu a:hover, .psen a:hover {
            background-color: var(--dark-accent) !important;
            color: #fff !important;
        }

        /* Post Content */
        blockquote { color: #d0d0d0 !important; }
        font[color="#789922"] { color: var(--dark-quote) !important; }
        .cnw { color: var(--dark-text-sub) !important; }
        .cno { color: var(--dark-text-sub) !important; }

        /* Links */
        a { color: var(--dark-link) !important; }
        a:visited { color: var(--dark-link-visited) !important; }
        a:hover { color: var(--dark-link-hover) !important; }
        #contres a {
            color: var(--dark-text-main) !important;
        }

        /* Images */
        /* Slightly dim images until hovered to reduce eye strain */
        img:not(:hover) { filter: brightness(0.85); transition: filter 0.2s; }

        /* Catalog */
        .catalog-item {
            background-color: var(--dark-bg-panel) !important;
            border-color: var(--dark-border) !important;
            color: var(--dark-text-main) !important;
        }
        .catalog-item:hover {
            border-color: var(--dark-accent) !important;
            background-color: #252525 !important;
        }
        .catalog-item a { color: var(--dark-text-main) !important; }
        .catalog-item font { color: var(--dark-text-sub) !important; }

        /* Forms & Interactive */
        input[type="text"], textarea, select {
            background-color: var(--dark-bg-input) !important;
            border: 1px solid var(--dark-border) !important;
            color: var(--dark-text-main) !important;
        }
        input[type="submit"], button {
            background-color: #333 !important;
            color: #eee !important;
            border: 1px solid #555 !important;
        }
        input[type="submit"]:hover, button:hover {
            background-color: #444 !important;
        }

        /* Modals */
        #settings-modal, #post-modal-content, #id-modal-content {
            background-color: var(--dark-bg-panel) !important;
            color: var(--dark-text-main) !important;
            border: 1px solid #444 !important;
        }
        .settings-section h4 { border-bottom-color: var(--dark-border) !important; }

        /* NG area */
        .ng-placeholder {
            background-color: #222 !important;
            color: #666 !important;
        }
        .ng-list { border-color: var(--dark-border) !important; }
        .ng-list li { border-bottom-color: var(--dark-border) !important; }

        /* SOD/Delete Buttons */
        .sod {
            background-color: var(--dark-bg-input) !important;
            border-color: var(--dark-border) !important;
            color: var(--dark-text-sub) !important;
        }
        .sod:hover {
            color: var(--dark-accent) !important;
        }

        /* Table cleanup */
        .rtd { background: transparent !important; }
        .rts { display: none !important; }

        /* Form Specifics */
        .ftdc {
            background-color: #ED6724 !important;
            color: #eee !important;
            border: none;
        }
        th[bgcolor] {
            color: #eee !important;
        }
        th font { color: #eee !important; }

        /* Misc */
        /* Legacy Popups and Floating Elements */
        .pdmm, .pdmmc, .pdd, .pddtip, .pddtipc, .slp, .ama {
            background-color: var(--dark-bg-panel) !important;
            border: 1px solid var(--dark-border) !important;
            color: var(--dark-text-main) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
        }

        /* Legacy Text Colors */
        .delform, .delform2, .chui {
            color: var(--dark-text-sub) !important;
        }

        /* Spinner Inputs */
        .spinnerDiv input {
            background-color: var(--dark-bg-input) !important;
            color: var(--dark-text-main) !important;
            border: 1px solid var(--dark-border) !important;
        }

        /* Catalog Pagination */
        #cattable {
            background-color: transparent !important;
        }

        /* Restore HR */
        hr {
            border: 0;
            border-top: 1px solid var(--dark-border);
            height: 1px;
            background: transparent;
        }

        /* Scrollbars */
        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }
        ::-webkit-scrollbar-track {
            background: var(--dark-bg-main);
        }
        ::-webkit-scrollbar-thumb {
            background-color: #444;
            border-radius: 6px;
            border: 3px solid var(--dark-bg-main);
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: #666;
        }

        /* Popup */
        .pdmm {
            background: var(--dark-bg-main);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .qtd {
            background: var(--dark-bg-main);
        }
    `;

    function addStyle(css) {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.append(style);
        }
    }

    // ---------------------------------------------------------
    // Utilities
    // ---------------------------------------------------------
    // Thread ID extraction from URL or DOM
    const urlMatch = location.href.match(/res\/(\d+)/);
    const kakoMatch = location.href.match(/futa\/.*\/(\d+)/);
    const threadId = urlMatch ? urlMatch[1] : kakoMatch ? kakoMatch[1] : null;

    // Storage Wrappers
    function getData(key, def) {
        if (typeof GM_getValue !== 'undefined') return GM_getValue(key, def);
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : def;
    }
    function setData(key, val) {
        if (typeof GM_setValue !== 'undefined') GM_setValue(key, val);
        else localStorage.setItem(key, JSON.stringify(val));
    }
    function getPageType() {
        const urlMatch = location.href.match(/futaba\.php/);
        return threadId ? 'thread' : urlMatch ? 'other' : 'index';
    }

    // ---------------------------------------------------------
    // NG Logic
    // ---------------------------------------------------------
    const NG_IDS_KEY = 'futaba_ng_ids';
    const NG_WORDS_KEY = 'futaba_ng_words';

    function getNgIds() { return getData(NG_IDS_KEY, {}); } // { threadId: [id1, id2] }
    function getNgWords() { return getData(NG_WORDS_KEY, []); }

    function addNgId(id) {
        const data = getNgIds();
        if (!data[threadId]) data[threadId] = [];
        if (!data[threadId].includes(id)) {
            data[threadId].push(id);
            setData(NG_IDS_KEY, data);
            applyNg();
        }
    }

    function removeNgId(id) {
        const data = getNgIds();
        if (data[threadId]) {
            data[threadId] = data[threadId].filter(x => x !== id);
            setData(NG_IDS_KEY, data);
            applyNg();
            renderSettings();
        }
    }

    function addNgWord(word) {
        if (!word) return;
        const list = getNgWords();
        if (!list.includes(word)) {
            list.push(word);
            setData(NG_WORDS_KEY, list);
            applyNg();
            renderSettings();
        }
    }

    function removeNgWord(word) {
        const list = getNgWords();
        const newList = list.filter(w => w !== word);
        setData(NG_WORDS_KEY, newList);
        applyNg();
        renderSettings();
    }

    function extractId(el) {
        // Find text node matching ID:xxxx
        if (!el) return null;
        for (const node of el.childNodes) {
            const match = node.textContent.match(/ID:([a-zA-Z0-9\.\+\/]+)/);
            if (match) {
                return match[1];
            }
        }
        return null;
    }

    function extractBody(el) {
        const bq = el.querySelector('blockquote');
        return bq ? bq.textContent : "";
    }

    function removeBrackets() {
        // Targeted areas for bracket removal (avoiding content)
        const selectors = [
            '#hdp', '#hml', 'center', '.catlink', '#contres', '.psen'
        ];

        selectors.forEach(sel => {
            const el = document.querySelector(sel);
            if (!el) return;

            const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
            let node;
            const toRemove = [];

            while (node = walk.nextNode()) {
                // Only remove brackets that are part of the UI decoration, not inside user text
                // Check if the parent is blockquote or inside one
                if (node.parentElement.closest('blockquote')) continue;

                if (node.nodeValue.includes('[') || node.nodeValue.includes(']')) {
                    const newVal = node.nodeValue.replace(/[\[\]]/g, '');
                    if (newVal.trim() === '' && node.nodeValue !== newVal) {
                        // If it's just brackets, we can mark for cleanup
                        // But let's just replace the text for safety
                    }
                    node.nodeValue = newVal;
                }

                if (sel === ".psen" && node.nodeValue.includes('\u00a0')) {
                    node.nodeValue = node.nodeValue.replace(/\u00a0/g, '');
                }
            }
        });

        // Also specific cleanup for "掲示板に戻る" area which is often just floating
        document.body.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && !node.parentElement.closest('.thre, table')) {
                node.nodeValue = node.nodeValue.replace(/[\[\]]/g, '');
            }
        });
    }

    function getOpId() {
        if (getPageType() !== 'thread') return null;
        const thre = document.querySelector('.thre');
        if (!thre) return null;
        const cnw = thre.querySelector('.cnw');
        return extractId(cnw);
    }

    function getScroll(){
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
        var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
        return {x: x, y: y};
    }

    function getPosition(elm) {
        if(typeof elm.getBoundingClientRect == 'function'){
            return {x: elm.getBoundingClientRect().left,
                            y: elm.getBoundingClientRect().top};
        }else{
            var xPos = 0, yPos = 0;
            while(elm) {
                xPos += (elm.offsetLeft + elm.clientLeft);
                yPos += (elm.offsetTop  + elm.clientTop);
                elm = elm.offsetParent;
            }
            var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
            xPos -= (isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft);
            yPos -= (isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop);
            return { x: xPos, y: yPos };
        }
    }

    function getScrollPosition(elm){
        var xy=getPosition(elm);
        var scroll=getScroll();
        return {x: scroll.x+xy.x, y: scroll.y+xy.y};
    }

    function applyNg() {
        if (getPageType() !== 'thread') return;
        const ids = getNgIds()[threadId] || [];
        const words = getNgWords();
        const opId = getOpId();

        const process = (postRoot, idEl) => {
            const id = extractId(idEl);
            const body = extractBody(postRoot);

            let isNg = false;
            let reason = '';

            // OP Protection
            if (opId && id === opId) {
                // Is OP, do not NG
            } else if (id && ids.includes(id)) {
                isNg = true;
                reason = `ID:${id}`;
            } else if (words.some(w => body.includes(w))) {
                isNg = true;
                reason = 'NG Word';
            }

            // Check if already processed
            let placeholder = postRoot.previousElementSibling;
            if (placeholder && placeholder.classList.contains('ng-placeholder')) {
                // If it was NG but now isn't (e.g. removed), unhide
                if (!isNg) {
                    placeholder.remove();
                    postRoot.style.display = '';
                }
                return; // Already has placeholder, assume hidden
            }

            if (isNg) {
                placeholder = document.createElement('div');
                placeholder.className = 'ng-placeholder';
                placeholder.innerHTML = `<span>NG(${reason})</span> <span class="chk-link" style="text-decoration:underline; cursor:pointer; color:#239DEB;">表示</span>`;

                placeholder.querySelector('.chk-link').onclick = function() {
                    this.parentElement.style.display = 'none';
                    postRoot.style.display = '';
                };

                postRoot.parentNode.insertBefore(placeholder, postRoot);
                postRoot.style.display = 'none';
            }
        };

        // Main Thread
        const thre = document.querySelector('.thre');
        if (thre) process(thre, thre.querySelector('.cnw'));

        // Replies (Tables)
        document.querySelectorAll('table').forEach(tbl => {
            process(tbl, tbl.querySelector('.cnw'));
        });
    }

    // ---------------------------------------------------------
    // ID Popup Logic
    // ---------------------------------------------------------
    function injectIdLinks() {
        if (getPageType() !== 'thread') return;
        const theme = getData(THEME_KEY, 'modern_light');

        // Helper to wrap ID text
        const processCnw = (container) => {
            const cnws = container.querySelectorAll('.cnw');
            cnws.forEach(cnw => {
                if (cnw.dataset.processedId) return; // Skip if already processed
                const id = extractId(cnw);
                if (id) {
                    // Find the text node containing the ID
                    for (const node of cnw.childNodes) {
                        if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('ID:' + id)) {
                            const parts = node.textContent.split('ID:' + id);
                            const frag = document.createDocumentFragment();

                            frag.appendChild(document.createTextNode(parts[0]));

                            const span = document.createElement('span');
                            span.innerHTML = `ID:${id}`;
                            span.className = 'clickable-id';
                            span.style.cursor = 'pointer';
                            // Apply style based on theme (though CSS class handles it mostly)
                            // if (theme !== 'classic') span.style.color = '#00f'; // Modern css handles colors
                            span.title = 'このIDの投稿をまとめて表示';

                            span.onclick = (e) => {
                                e.stopPropagation();
                                openIdModal(id);
                            };

                            frag.appendChild(span);
                            if (parts[1]) frag.appendChild(document.createTextNode(parts[1]));

                            cnw.replaceChild(frag, node);
                            cnw.dataset.processedId = "true";
                            break;
                        }
                    }
                }
            });
        };

        const thre = document.querySelector('.thre');
        if (thre) processCnw(thre);
        document.querySelectorAll('table').forEach(tbl => processCnw(tbl));
    }

    function openIdModal(targetId) {
        // Collect posts
        const posts = [];

        const extractPostData = (root) => {
            const cnw = root.querySelector('.cnw');
            const id = extractId(cnw);
            if (id === targetId) {
                const numberEl = root.querySelector('.cno');
                const number = numberEl ? numberEl.textContent : '???';
                const rscEl = root.querySelector('.rsc');
                const rsc = rscEl ? rscEl.textContent : '???';
                const timeMatch = cnw.textContent.match(/(\d{2}\/\d{2}\/\d{2}\(.\)\d{2}:\d{2}:\d{2})/);
                const time = timeMatch ? timeMatch[1] : '';

                // Content (Image + Body)
                const body = root.querySelector('blockquote').cloneNode(true);
                // Fix links in clone if needed

                let imgHTML = '';
                // Check if thread OP image
                if (root.classList.contains('thre')) {
                    const img = root.querySelector('a > img');
                    if (img && img.parentNode.href) imgHTML = `<a href="${img.parentNode.href}" target="_blank"><img src="${img.src}" style="max-height:100px; max-width:100px;"></a><br>`;
                } else {
                    // Check local image
                    const table = root.closest('table'); // If root is td actually
                    // In standard structure, root is table or thre
                    const img = root.querySelector('img[src*="/b/thumb/"]');
                    if (img && img.parentNode.href) {
                         imgHTML = `<a href="${img.parentNode.href}" target="_blank"><img src="${img.src}" style="max-height:100px; max-width:100px;"></a><br>`;
                    }
                }

                posts.push({ rsc, number, time, body: body.innerHTML, imgHTML });
            }
        };

        // Scan OP
        const thre = document.querySelector('.thre');
        if (thre) extractPostData(thre);
        // Scan Replies
        document.querySelectorAll('table').forEach(tbl => extractPostData(tbl));

        // Create Modal
        let modal = document.getElementById('id-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'id-modal';
            modal.style.cssText = `
                display:none; position:fixed; top:0; left:0; right:0; bottom:0;
                background:rgba(0,0,0,0.5); z-index:10003; align-items:center; justify-content:center;
            `;
            modal.innerHTML = `
                <div id="id-modal-content" style="
                    background:#fff; padding:20px; border-radius:8px; width:90%; max-width:600px;
                    max-height:90dvh; overflow-y:auto; position:relative;
                ">
                    <span id="id-modal-close" style="position:absolute; top:10px; right:15px; font-size:1.5rem; cursor:pointer;">&times;</span>
                    <h3>ID:${targetId} の投稿 (${posts.length}件)</h3>
                    <div id="id-modal-list"></div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('#id-modal-close').onclick = () => modal.style.display = 'none';
            modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };
        } else {
            modal.innerHTML = `
                <div id="id-modal-content" style="
                    background:#fff; padding:20px; border-radius:8px; width:90%; max-width:600px;
                    max-height:90dvh; overflow-y:auto; position:relative;
                ">
                    <span id="id-modal-close" style="position:absolute; top:10px; right:15px; font-size:1.5rem; cursor:pointer;">&times;</span>
                    <h3>ID:${targetId} の投稿 (${posts.length}件)</h3>
                    <div id="id-modal-list"></div>
                </div>
            `;
        }

        // Render Posts
        const list = modal.querySelector('#id-modal-list');
        list.innerHTML = '';
        const theme = getData(THEME_KEY, 'modern_light');
        const isDark = theme === 'modern_dark';

        // Update modal style for theme
        const content = modal.querySelector('#id-modal-content');
        if (isDark) {
            content.style.background = '#2d2d2d';
            content.style.color = '#fff';
        } else {
            content.style.background = '#fff';
            content.style.color = '#333';
        }

        posts.forEach(p => {
            const item = document.createElement('div');
            item.style.cssText = `border-bottom:1px solid ${isDark?'#444':'#eee'}; padding:10px 0;`;
            item.innerHTML = `
                <div style="font-size:0.85em; color:${isDark?'#aaa':'#666'}; margin-bottom:5px;">
                    <span class="qtjmp">${p.rsc}</span> ${p.number} - ${p.time}
                </div>
                <div>${p.imgHTML} ${p.body}</div>
            `;
            const qtjmp = item.querySelector(".qtjmp");
            qtjmp.onclick = (e) => {
                document.getElementById('id-modal').style.display = 'none';
                window.scroll(0,getScrollPosition(document.getElementById(`delcheck${p.number.slice(3)}`).parentNode).y);
            }
            list.appendChild(item);
        });

        modal.style.display = 'flex';
    }

    function injectNgButtons() {
        if (getPageType() !== 'thread') return;
        const opId = getOpId();

        // Add [NG] button next to IDs
        const attach = (el) => {
            const cnw = el.querySelector('.cnw');
            if (cnw && !cnw.querySelector('.ng-button')) {
                const id = extractId(cnw);
                if (id) {
                    if (opId && id === opId) return;

                    const btn = document.createElement('span');
                    btn.className = 'ng-button';
                    btn.textContent = 'NG';
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        if(confirm(`ID:${id} をNGにしますか？`)) {
                            addNgId(id);
                        }
                    };
                    cnw.appendChild(btn);
                }
            }
        };

        const thre = document.querySelector('.thre');
        if (thre) attach(thre);

        document.querySelectorAll('table').forEach(tbl => attach(tbl));
    }

    // ---------------------------------------------------------
    // Auto Reload Logic
    // ---------------------------------------------------------
    let reloadInterval = null;
    const RELOAD_KEY = 'futaba_autoreload_enabled';
    const RELOAD_INTERVAL_KEY = 'futaba_autoreload_interval';

    function toggleAutoReload() {
        const current = getData(RELOAD_KEY, false);
        const next = !current;
        setData(RELOAD_KEY, next);
        applyAutoReload();
        return next;
    }

    function applyAutoReload() {
        if (getPageType() !== 'thread') return;
        const enabled = getData(RELOAD_KEY, false);
        const intervalTime = parseInt(getData(RELOAD_INTERVAL_KEY, 60000), 10);
        const btn = document.getElementById('fab-reload');
        if (intervalBadge) intervalBadge.style.display = enabled ? 'block' : 'none';

        // Clear existing interval always
        if (reloadInterval) {
            clearInterval(reloadInterval);
            reloadInterval = null;
        }

        if (enabled) {
            reloadInterval = setInterval(() => {
                const reloadButton = document.querySelector("span#contres a");
                if (reloadButton) reloadButton.click();
            }, intervalTime);
            if(btn) btn.classList.add('active');
        } else {
            if(btn) btn.classList.remove('active');
        }
    }

    let intervalBadge;

    // ---------------------------------------------------------
    // Post Form Modal
    // ---------------------------------------------------------
    let originalFormParent = null;
    let originalFormNextSibling = null;

    function initPostModal() {
        const modal = document.createElement('div');
        modal.id = 'post-modal';
        modal.innerHTML = `
            <div id="post-modal-content">
                <span id="post-modal-close">&times;</span>
                <h3 style="margin-top:0">${getPageType() === 'thread' ? '返信する' : '新規スレッド'}</h3>
                <div id="original-form-placeholder"></div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#post-modal-close').onclick = () => {
            modal.style.display = 'none';

            // If Modern UI is disabled, return form to original place
            const theme = getData(THEME_KEY, 'modern_light');
            if (theme === 'classic' && originalFormParent) {
                const form = document.getElementById('fm');
                if(form) {
                    originalFormParent.insertBefore(form, originalFormNextSibling);
                }
            }
        };

        return modal;
    }

    function openPostModal() {
        const modal = document.getElementById('post-modal') || initPostModal();
        const form = document.getElementById('fm'); // Standard Futaba form ID

        if (form) {
            const container = modal.querySelector('#original-form-placeholder');
            if (!container.contains(form)) {
                // Save original location if we are moving it from the page
                if (form.parentNode !== container) {
                    originalFormParent = form.parentNode;
                    originalFormNextSibling = form.nextSibling;
                }

                form.style.display = 'block';
                form.style.position = 'static';
                container.appendChild(form);
            } else {
                form.style.display = 'block';
            }
        }

        modal.style.display = 'flex';
    }


    // ---------------------------------------------------------
    // UI Construction
    // ---------------------------------------------------------
    function createFab() {
        const container = document.createElement('div');
        container.id = 'fab-container';

        // Post Button
        if (getPageType() !== 'other') {
            const postBtn = document.createElement('button');
            postBtn.className = 'fab-btn';
            postBtn.innerHTML = '✐'; // Pencil
            postBtn.title = '投稿する';
            postBtn.onclick = openPostModal;
            container.appendChild(postBtn);
        }

        if (getPageType() === 'thread') {
            // Reload / Auto-Reload Button
            const reloadBtn = document.createElement('button');
            reloadBtn.className = 'fab-btn';
            reloadBtn.id = 'fab-reload';
            reloadBtn.innerHTML = '↻';
            reloadBtn.title = 'リロード (長押しで自動ON/OFF)';

            // Badge
            intervalBadge = document.createElement('div');
            intervalBadge.className = 'auto-reload-status';
            reloadBtn.appendChild(intervalBadge);

            // Click = One time reload
            let pressTimer;
            let isLongPress = false;

            const startPress = (e) => {
                isLongPress = false;
                pressTimer = setTimeout(() => {
                    isLongPress = true;
                    if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback if available
                    toggleAutoReload();
                }, 600);
            };

            const endPress = (e) => {
                clearTimeout(pressTimer);
            };

            reloadBtn.addEventListener('mousedown', startPress);
            reloadBtn.addEventListener('touchstart', startPress, {passive: true});
            reloadBtn.addEventListener('mouseup', endPress);
            reloadBtn.addEventListener('touchend', (e) => {
                endPress();
                if (isLongPress) {
                    e.preventDefault();
                }
            });
            reloadBtn.addEventListener('touchcancel', endPress);

            reloadBtn.onclick = (e) => {
                if (isLongPress) {
                    isLongPress = false; // Reset for next time
                    return;
                }
                const reloadButton = document.querySelector("span#contres a");
                if (reloadButton) reloadButton.click();
            };

            // Right Click = Toggle Auto
            reloadBtn.oncontextmenu = (e) => {
                e.preventDefault();
                toggleAutoReload();
                return false;
            };

            container.appendChild(reloadBtn);
        }

        // Settings Button
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'fab-btn';
        settingsBtn.innerHTML = '⚙';
        settingsBtn.title = '設定';
        settingsBtn.onclick = openSettings;
        container.appendChild(settingsBtn);

        // Scroll Top
        const topBtn = document.createElement('button');
        topBtn.className = 'fab-btn';
        topBtn.innerHTML = '▲';
        topBtn.onclick = () => window.scrollTo({ top:0, behavior:'smooth' });
        container.appendChild(topBtn);

        // Scroll Bottom
        const botBtn = document.createElement('button');
        botBtn.className = 'fab-btn';
        botBtn.innerHTML = '▼';
        botBtn.onclick = () => window.scrollTo({ top:document.body.scrollHeight, behavior:'smooth' });
        container.appendChild(botBtn);

        document.body.appendChild(container);
    }

    // ---------------------------------------------------------
    // Settings UI
    // ---------------------------------------------------------
    function createSettingsModal() {
        const overlay = document.createElement('div');
        overlay.className = 'settings-overlay';
        overlay.onclick = () => {
            overlay.style.display = 'none';
            document.getElementById('settings-modal').style.display = 'none';
        };

        const modal = document.createElement('div');
        modal.id = 'settings-modal';
        modal.innerHTML = `
            <h3>「」モダナイザー 設定</h3>

            <div class="settings-section">
                <h4>全般</h4>
                <label style="display:flex; align-items:center; margin-bottom:10px;">
                    テーマ選択:
                    <select id="theme-selector" style="margin-left:10px; padding:5px; border-radius:4px; border:1px solid #ccc;">
                        <option value="classic">クラシック</option>
                        <option value="modern_light">モダン (ライト)</option>
                        <option value="modern_dark">モダン (ダーク)</option>
                    </select>
                </label>
                <div style="font-size:0.85em; color:#888; margin-bottom:10px;">※変更はリロード後に反映されます</div>

                <label style="display:flex; align-items:center;">
                    自動リロード間隔 (秒):
                    <input type="number" id="reload-interval" min="10" step="10" style="margin-left:10px; width:60px; padding:3px;">
                </label>
            </div>

            <div class="settings-section">
                <h4>NG IDs (このスレッド)</h4>
                <ul id="ng-id-list" class="ng-list"></ul>
            </div>

            <div class="settings-section">
                <h4>NG Words (全体)</h4>
                <div style="display:flex; gap:5px; margin-bottom:5px;">
                    <input type="text" id="ng-word-input" style="flex:1; padding:5px;" placeholder="単語を追加...">
                    <button id="ng-word-add" style="padding:5px 10px;">追加</button>
                </div>
                <ul id="ng-word-list" class="ng-list"></ul>
            </div>

            <div style="text-align:right">
                <button id="settings-close" style="padding:8px 16px;">閉じる</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        // Bind Events
        document.getElementById('settings-close').onclick = () => {
            overlay.style.display = 'none';
            modal.style.display = 'none';
        };

        const addWord = () => {
            const inp = document.getElementById('ng-word-input');
            const val = inp.value.trim();
            if (val) {
                addNgWord(val);
                inp.value = '';
            }
        };
        document.getElementById('ng-word-add').onclick = addWord;
    }

    function renderSettings() {
        const idList = document.getElementById('ng-id-list');
        const wordList = document.getElementById('ng-word-list');
        const modernUiCb = document.getElementById('toggle-modern-ui');

        if (!idList) return;

        // Theme Selector
        const themeSel = document.getElementById('theme-selector');
        if (themeSel) {
            themeSel.value = getData(THEME_KEY, 'modern_light');
            themeSel.onchange = (e) => {
                setData(THEME_KEY, e.target.value);
                if(confirm('設定を反映するにはリロードが必要です。リロードしますか？')) {
                    location.reload();
                }
            };
        }

        // Reload Interval
        const intervalInp = document.getElementById('reload-interval');
        if (intervalInp) {
            const currentMs = getData(RELOAD_INTERVAL_KEY, 60000);
            intervalInp.value = currentMs / 1000;
            intervalInp.onchange = (e) => {
                const val = parseInt(e.target.value, 10);
                if (val && val >= 5) {
                    setData(RELOAD_INTERVAL_KEY, val * 1000);
                    if (getData(RELOAD_KEY, false)) {
                        applyAutoReload(); // Update immediately if active
                    }
                }
            };
        }

        // Render IDs
        idList.innerHTML = '';
        const currentIds = getNgIds()[threadId] || [];
        if (currentIds.length === 0) idList.innerHTML = '<li style="color:#aaa">なし</li>';
        else {
            currentIds.forEach(id => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${id}</span> <button class="remove-btn" data-type="id" data-val="${id}">解除</button>`;
                idList.appendChild(li);
            });
        }

        // Render Words
        wordList.innerHTML = '';
        const words = getNgWords();
        if (words.length === 0) wordList.innerHTML = '<li style="color:#aaa">なし</li>';
        else {
            words.forEach(w => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${w}</span> <button class="remove-btn" data-type="word" data-val="${w}">解除</button>`;
                wordList.appendChild(li);
            });
        }

        // Bind Remove events
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.onclick = (e) => {
                const type = e.target.dataset.type;
                const val = e.target.dataset.val;
                if (type === 'id') removeNgId(val);
                if (type === 'word') removeNgWord(val);
            };
        });
    }

    function openSettings() {
        let modal = document.getElementById('settings-modal');
        if (!modal) {
            createSettingsModal();
            modal = document.getElementById('settings-modal');
        }
        renderSettings();
        document.querySelector('.settings-overlay').style.display = 'block';
        modal.style.display = 'block';
    }


    // ---------------------------------------------------------
    // Image Preview Utility (simplified from futaba-image-preview.js)
    // ---------------------------------------------------------
    const ImagePreview = {
        init: function() {
            // Delay slightly to ensure DOM is ready and other scripts might have run
            setTimeout(() => {
                this.processBlockquotes();
                this.observeMutations();
            }, 1000);
        },

        processBlockquotes: function(scope) {
            const targets = scope ? [scope] : document.querySelectorAll('blockquote');
            targets.forEach(bq => this.createAnchorLinks(bq));
        },

        createAnchorLinks: function(node) {
            // Recursively find text nodes and replace patterns
            const regex = /((?<!<a[^>]*>)(fu?)([0-9]{5,8})\.(jpe?g|png|webp|gif|bmp|mp4|webm)(?![^<]*<\/a>))/g;

            const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
            let textNode;

            while(textNode = walk.nextNode()) {
                if (textNode.parentNode.nodeName === 'A') continue;

                const text = textNode.data;
                let match;

                // Note: Handling multiple matches in one text node by splitting
                if ((match = regex.exec(text)) !== null) {
                    const [fullMatch, _, type, digits, ext] = match;
                    const url = `//dec.2chan.net/${type === 'fu' ? 'up2' : 'up'}/src/${type}${digits}.${ext}`;

                    const anchor = document.createElement('a');
                    anchor.href = url;
                    anchor.textContent = fullMatch;
                    anchor.target = "_blank";
                    anchor.style.color = "#00f";
                    anchor.onclick = (e) => {
                        e.preventDefault();
                        this.togglePreview(anchor, url, ext);
                    };

                    const afterText = textNode.splitText(match.index);
                    afterText.data = afterText.data.substring(fullMatch.length);
                    textNode.parentNode.insertBefore(anchor, afterText);
                }
            }
        },

        togglePreview: function(anchor, url, ext) {
            let next = anchor.nextElementSibling;
            if (next && next.classList.contains('inline-preview')) {
                next.remove();
                return;
            }

            let el;
            const videoExt = ["mp4", "webm"]
            if (videoExt.includes(ext)) {
                el = document.createElement('video');
                el.controls = true;
                el.autoplay = true;
                el.loop = true;
                el.muted = true; // Autoplay usually requires muted
            } else {
                el = document.createElement('img');
                el.onclick = () => window.open(url, '_blank').focus();
            }

            el.src = url;
            el.className = 'inline-preview';
            el.style.maxWidth = '100%';
            el.style.height = 'auto';
            el.style.display = 'block';
            el.style.marginTop = '5px';
            el.style.cursor = 'pointer';

            anchor.parentNode.insertBefore(el, anchor.nextSibling);
        },

        observeMutations: function() {
            const thread = document.querySelector('.thre');
            if(!thread) return;

            const obs = new MutationObserver(mutations => {
                mutations.forEach(m => {
                    m.addedNodes.forEach(n => {
                        if(n.nodeType === 1) {
                            const bqs = n.querySelectorAll('blockquote');
                            bqs.forEach(bq => this.createAnchorLinks(bq));
                        }
                    });
                });
            });
            obs.observe(thread, { childList: true, subtree: true });
        }
    };

    // ---------------------------------------------------------
    // Header Menu Extraction (Modern UI)
    // ---------------------------------------------------------
    function optimizeHeaderMenu() {
        const hdp = document.getElementById('hdp');
        if (!hdp) return;

        const links = [];
        const pageType = getPageType();

        // 1. Thread/Index pages: Extract from .catlink
        const catlinks = document.querySelectorAll('.catlink');
        catlinks.forEach(cl => {
            cl.querySelectorAll('a').forEach(a => {
                if (!links.some(l => l.href === a.href)) {
                    links.push(a.cloneNode(true));
                }
            });
            cl.style.display = 'none';
        });

        // 2. Catalog page: Extract loose links
        if (pageType === 'other') {
            // specifically target catalog navigation
            // usually: <b><a ...>Catalog</a></b> <a ...>Sort</a>
            // We look for any link containing 'mode=cat'
            const allLinks = document.querySelectorAll('body a');

            allLinks.forEach(a => {
                // Check if it's a catalog-related navigation link
                if (a.href.includes('mode=cat') && !a.href.includes('mode=catset')) {
                    // Check if parent is <b> (active page)
                    const isBold = a.parentElement.tagName === 'B';
                    if (isBold) {
                        // We clone the link, but styles active
                        const clone = a.cloneNode(true);
                        clone.classList.add('active');
                        links.push(clone);

                        // Hide original
                        a.parentElement.style.display = 'none';
                    } else if (a.parentNode === document.body || a.parentNode.tagName === 'FONT' || a.parentNode === hdp || a.parentNode.id === 'hml') {
                        // Only target top-level-ish links, avoid links inside the table/grid
                        const clone = a.cloneNode(true);
                        links.push(clone);

                        // Hide original
                        a.style.display = 'none';
                    }
                }

                // Settings link separately
                if (a.href.includes('mode=catset')) {
                    const clone = a.cloneNode(true);
                    links.push(clone);
                    a.style.display = 'none';
                }
            });
        }

        if (links.length === 0) return;

        const menuBar = document.createElement('div');
        menuBar.id = 'custom-header-menu';

        links.forEach(a => {
            // Dedupe in case of overlap
            if (menuBar.querySelector(`a[href="${a.getAttribute('href')}"]`)) return;
            menuBar.appendChild(a);
        });

        hdp.appendChild(menuBar);
    }

    // ---------------------------------------------------------
    // Catalog Modernization
    // ---------------------------------------------------------
    function optimizeCatalog() {
        if (getPageType() !== 'other') return;
        const catTable = document.getElementById('cattable');
        if (!catTable) return;

        // Create Grid Container
        const grid = document.createElement('div');
        grid.id = 'catalog-grid';

        // Process cells
        const cells = catTable.querySelectorAll('td');
        cells.forEach(td => {
            const item = document.createElement('div');
            item.className = 'catalog-item';

            // Extract content
            // Structure is usually: <a><img ...></a><br><font>...</font>

            // 1. Image Replacement
            const img = td.querySelector('img');
            if (img) {
                if (img.src.match(/\/cat\//)) {
                    img.src = img.src.replace(/\/cat\//, '/thumb/');
                }
                // Optional: Force https if mixed content
                if (img.src.startsWith('http:')) {
                    img.src = img.src.replace(/^http:/, 'https:');
                }
            }

            // Move children to new item
            while (td.firstChild) {
                // Skip <br> as flex column handles layout
                if (td.firstChild.tagName === 'BR') {
                    td.removeChild(td.firstChild);
                    continue;
                }
                item.appendChild(td.firstChild);
            }

            grid.appendChild(item);
        });

        // Hide original table
        catTable.style.display = 'none';

        // Insert grid after the table (or where table was)
        catTable.parentNode.insertBefore(grid, catTable.nextSibling);
    }

    // ---------------------------------------------------------
    // Dynamic Updates Observer
    // ---------------------------------------------------------
    function observeUpdates() {
        const observer = new MutationObserver(mutations => {
            let shouldUpdate = false;
            mutations.forEach(m => {
                m.addedNodes.forEach(n => {
                    if (n.nodeType === 1) {
                        if (
                            (n.tagName === 'TABLE' && !n.classList.contains('ftbl') && !n.classList.contains('menu')) ||
                            (n.classList && n.classList.contains('thre')) ||
                            (n.querySelector && n.querySelector('table:not(.ftbl):not(.menu)'))
                        ) {
                            shouldUpdate = true;
                        }
                    }
                });
            });

            if (shouldUpdate) {
                injectNgButtons();
                injectIdLinks(); // New ID links
                applyNg();

                const theme = getData(THEME_KEY, 'modern_light');
                if (theme !== 'classic') {
                    removeBrackets();
                }
            }
        });

        const target = document.querySelector('.thre') || document.body;
        if (target) {
            observer.observe(target, { childList: true, subtree: true });
        }
    }

    // ---------------------------------------------------------
    // Main Init
    // ---------------------------------------------------------
    function setupViewport() {
        // Only force viewport on modern themes to respect classic feel if desired,
        // OR keep it for all. Let's keep for all as it improves mobile regardless of theme.
        // But the user request implies theme affects "Modern UI".
        // Let's stick to doing it for all as CORE css needs it.
        let meta = document.querySelector('meta[name="viewport"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'viewport';
            document.head.appendChild(meta);
        }
        meta.content = 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=yes';
    }

    function init() {
        setupViewport(); // Ensure correct scaling on mobile

        // Migration: Old Boolean -> New String
        if (getData(MODERN_UI_KEY_OLD, null) !== null) {
            // Migrate only if old key exists
            const oldVal = getData(MODERN_UI_KEY_OLD, true);
            setData(THEME_KEY, oldVal ? 'modern_light' : 'classic');
            // Remove old key (optional, or just ignore)
            if (typeof GM_deleteValue !== 'undefined') GM_deleteValue(MODERN_UI_KEY_OLD);
            else localStorage.removeItem(MODERN_UI_KEY_OLD);
        }

        // Determine Theme
        const theme = getData(THEME_KEY, 'modern_light'); // Default to modern light

        // ALWAYS apply CORE css
        addStyle(coreCSS);

        // CONDITIONALLY apply MODERN / DARK css
        if (theme === 'modern_light' || theme === 'modern_dark') {
            addStyle(modernCSS);

            if (theme === 'modern_dark') {
                addStyle(darkThemeOverrides);
            }

            // Modern tweaks that manipulate DOM heavily
            removeBrackets();
            optimizeHeaderMenu();
            optimizeCatalog();
        }

        // ALWAYS initialize Functionality
        createFab();
        injectNgButtons();
        injectIdLinks(); // Initial scan
        applyNg(); // Hiding posts works regardless of UI
        applyAutoReload();
        observeUpdates();

        // Image Preview
        ImagePreview.init();
    }

    init();

})();
