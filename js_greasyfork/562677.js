// ==UserScript==
// @name         MÁV Karrier Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sötét mód a karrier.mavcsoport.hu oldalhoz
// @author       Frank
// @match        https://karrier.mavcsoport.hu/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562677/M%C3%81V%20Karrier%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/562677/M%C3%81V%20Karrier%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        /* Alap háttér és betűszín */
        html, body {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
        }

        /* --- VILÁGOS HÁTTEREK SÖTÉTÍTÉSE --- */

        /* Navbar, Fehér és .bg-gray200 -> Fő háttérszín (#1a1a1a) */
        .navbar, .bg-white, .bg-gray200 {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
            border-color: #333 !important;
        }

        /* .bg-gray300 és az Oldalsávok/Lábléc oszlopok -> Kicsit világosabb sötét (#222222) */
        .bg-gray300,
        .region-sidebar-first,
        .region-sidebar-second,
        .region-footer-first,
        .region-footer-second,
        .region-footer-third,
        .region-footer-fourth,
        .region-footer-fifth {
            background-color: #222222 !important;
            color: #e0e0e0 !important;
        }

        /* --- DROPDOWN MENÜK --- */
        .dropdown-menu.show, .dropdown-menu {
            background-color: #181818 !important;
            border-color: #333 !important;
            color: #e0e0e0 !important;
        }
        .dropdown-item {
            color: #e0e0e0 !important;
        }
        .dropdown-item:hover, .dropdown-item:focus {
            background-color: #333 !important;
            color: #fff !important;
        }

        /* --- KÖZEPES SÖTÉT ELEMEK (#272727) --- */

        /* Breadcrumb, Menü 1. szint, Details és Kereső gomb */
        .breadcrumb,
        nav[aria-label="breadcrumb"],
        .menu-level-1,
        details,
        #search-toggle.collapsed {
            background-color: #272727 !important;
            color: #e0e0e0 !important;
            border-radius: 4px;
        }

        /* --- CÍMKÉK ÉS BADGE-EK (#474747) --- */

        /* Munkaidő mező (Job Schedule) */
        .field--name-field-job-schedule {
            background-color: #474747 !important;
            color: #ffffff !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            display: inline-block !important;
        }

        /* Szakterület (Job Specialty) a listanézetben */
        .node--type-job-offer.node--view-mode-teaser .field--name-field-job-specialty .field__item {
            background-color: #474747 !important;
            color: #ffffff !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            display: inline-block !important;
        }

        /* --- JELENTKEZÉSI HATÁRIDŐ (FEKETE) --- */
        .field--name-field-job-expiration-date .field__label,
        .field--name-field-job-expiration-date .field__item {
            color: #000000 !important;
        }

        /* Details (lenyitható doboz) formázása */
        details {
            border: 1px solid #444 !important;
            padding: 5px !important;
        }
        details summary {
            color: #ffffff !important;
            cursor: pointer;
        }

        /* --- NAPTÁR --- */
        .view-display-id-block-calendar .calendar-view-table .calendar-view-day__row {
            background-color: #334f6f !important;
            color: #ffffff !important;
        }

        /* Fő konténerek */
        .main-container, .page-wrapper, .region-content, article, .block-system-main-block, .layout-container {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
        }

        /* Fejléc és Lábléc */
        header, footer, .site-header, .site-footer, #header, #footer {
            background-color: #111111 !important;
            border-bottom: 1px solid #333 !important;
        }

        /* --- MENÜK SZÖVEGSZÍNE (FEHÉR) --- */
        .menu-link-main,
        .menu-link-main a,
        .menu-link-sub-collapsible,
        .menu-link-sub-collapsible a {
            color: #ffffff !important;
        }

        .menu-link-main:hover,
        .menu-link-main a:hover,
        .menu-link-sub-collapsible:hover,
        .menu-link-sub-collapsible a:hover {
            color: #ffffff !important;
            text-decoration: underline !important;
        }

        /* Kártyák */
        .card, .job-offer-item, .view-content .views-row, .panel, .well, .box {
            background-color: #252525 !important;
            border: 1px solid #444 !important;
            color: #ddd !important;
            box-shadow: none !important;
        }

        /* --- GOMBOK ÉS LINKEK --- */

        /* Általános linkek színe (KÉK) - Kivéve a menüt */
        a, a:visited {
            color: #4da3ff !important;
        }

        /* Felülírjuk az általános link szabályt a menükre */
        .menu-link-main a,
        .menu-link-main a:visited,
        .menu-link-sub-collapsible a,
        .menu-link-sub-collapsible a:visited {
             color: #ffffff !important;
        }

        a:hover {
            color: #80c1ff !important;
            text-decoration: underline !important;
        }

        /* GOMBOK - Kiemelt (Primary) gombok */
        /* Itt biztosítjuk, hogy a szöveg FEHÉR legyen */
        .btn-primary,
        .button,
        input[type="submit"],
        a.btn-primary {
            background-color: #0056b3 !important;
            color: #ffffff !important;
            border: none !important;
        }

        /* Hover állapotban is maradjon fehér */
        .btn-primary:hover, a.btn-primary:hover {
            color: #ffffff !important;
            opacity: 0.9;
        }

        /* Címsorok */
        h1, h2, h3, h4, h5, h6, .page-title {
            color: #ffffff !important;
        }

        /* Input mezők */
        input, select, textarea, .form-control {
            background-color: #333 !important;
            color: #fff !important;
            border: 1px solid #555 !important;
        }

        /* Táblázatok */
        table, tr, td, th {
            background-color: transparent !important;
            border-color: #444 !important;
        }
        tr:nth-child(even) {
            background-color: #222 !important;
        }

        /* Egyéb világos részek sötétítése */
        .bg-light, .gray-bg, .section-gray {
            background-color: #1e1e1e !important;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 12px;
        }
        ::-webkit-scrollbar-track {
            background: #1a1a1a;
        }
        ::-webkit-scrollbar-thumb {
            background-color: #444;
            border-radius: 6px;
            border: 3px solid #1a1a1a;
        }
    `;

    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    }

})();