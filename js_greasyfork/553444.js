// ==UserScript==
// @name        eCampus - Dark Theme
// @name:fr     eCampus - Thème Sombre
// @namespace   AntoineProost
// @match       https://ecampus.heh.be/*
// @grant       none
// @version     1.1.2
// @author      Antoine Proost
// @description Applies a dark theme to ecampus.
// @description:fr Applique un thème sombre à ecampus.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553444/eCampus%20-%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/553444/eCampus%20-%20Dark%20Theme.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Rajoute le tag <link> à la <head> du document.
    function addGoogleFontsLinks() {
        var linkPreconnect1 = document.createElement('link');
        linkPreconnect1.rel = 'preconnect';
        // linkPreconnect1.href = 'https://fonts.bunny.net';
        linkPreconnect1.href = 'https://api.fonts.coollabs.io';
        document.head.appendChild(linkPreconnect1);

        var linkStylesheet = document.createElement('link');
        linkStylesheet.rel = 'stylesheet';
        // linkStylesheet.href = 'https://fonts.bunny.net/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap';
        linkStylesheet.href = 'https://api.fonts.coollabs.io/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap';
        document.head.appendChild(linkStylesheet);
    }

    // Injecte du code CSS Custom sur la page.
    function addCustomFontStyles() {
        var style = document.createElement('style');
        style.textContent = `
            body, .drawercontent {
                color: #FFF;
                background-color: #111;
                font-family: "Lato", sans-serif !important;
            }
            .login-container {
                background-color: rgb(0 0 0 / 0%);
            }
            .img-fluid {
                border-radius: 25px;
                padding: 8px;
            }
            .login-container .login-divider {
                border-top: 0px;
            }
            div#learnrpage, form, .format-tiles .course-content ul.tiles .tile, .drawerheader, .courseindex .courseindex-section, .popover-region-container, .message-app {
                background-color: #222;
            }
            .secondary-navigation .navigation, .card, .moremenu .nav-tabs, .course-content ul.topics li.section, .course-content ul.weeks li.section, .course-content ul.cards li.section, .dropdown-menu, .btn.btn-icon:focus, .format-tiles .course-content ul li.section.main:not(.delegated-section), .page-link, .path-mod .activity-header:not(:empty), .course-section.hidden .section-item, .course-section.orphaned .section-item, .path-grade-report-user .user-report-container, .grade-report-user .user-report-container, .content-item-container.unread, .popover-region-footer-container {
                background-color: #333;
            }
            .nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link, .course-section .sectionname>a, .block .block-cards span.categoryname, .table, .btn-outline-secondary, .block .block-cards .progress-text, .dropdown-item, .format-tiles ul.tiles .tile h3, .generaltable, .path-mod-assign td.submissionnotgraded, .format-tiles .sectiontitle h2, .tertiary-navigation .tertiary-navigation-selector .dropdown-toggle, .courseindex .courseindex-item .courseindex-link, .courseindex .courseindex-item .courseindex-chevron, .courseindex .courseindex-item.dimmed .courseindex-link, .courseindex .courseindex-item.dimmed .courseindex-chevron {
                color: #DDD;
            }
            div#learnrpage {
                border: 1px solid #343A40;
            }
            .course-section .section-item, .activity-item:not(.activityinline), .path-grade-report-user .user-grade th.category, .grade-report-user .user-grade th.category, .courseindex .courseindex-section, .courseindex .courseindex-item, .popover-region-container, .content-item-container.unread {
                border: 1px solid #555;
                border-radius: 0rem;
            }
            .activity {
                border-top: 0px;
            }
            .path-grade-report-user .user-grade thead th, .grade-report-user .user-grade thead th, .path-grade-report-user .user-grade th.category, .grade-report-user .user-grade th.category, .path-grade-report-user .user-grade td, .grade-report-user .user-grade td, .path-grade-report-user .user-grade .baggt, .path-grade-report-user .user-grade .baggb, .grade-report-user .user-grade .baggt, .grade-report-user .user-grade .baggb, .message-app, .message-app .list-group, .message-app .list-group .list-group-item.list-group-item-action {
                background-color: #444;
            }
            .generaltable thead .sticky-column, .generaltable tbody tr:nth-of-type(even), .format-tiles .sectionbutton {
                background-color: #555;
            }
            btn-group course-request, .course-section .availabilityinfo {
                color: #000;
            }
            .card-footer {
                padding: 0rem 0.5rem;
            }
            .card-footer:last-child {
                //filter: invert(80%);
            }
            .block .block-cards .icon, .course_category_tree .category.with_children.collapsed>.info>.categoryname, .course_category_tree .category.with_children>.info>.categoryname, .fa-xmark::before, .fa-ellipsis-v::before {
                filter: invert(80%);
            }
            .bg-white {
                background-color: rgba(0, 0, 0, 0) !important;
            }
            .btn.btn-icon:focus {
                //height: 50rem;
            }
            .block .block-cards span.categoryname {
                line-height: 0.9;
            }
            .course_category_tree .category .numberofcourse, .list-group-item-action:hover, .list-group-item-action:focus {
                color: #777;
            }
            .format-tiles .course-content ul.tiles .tile.tilestyle-1 {
                border-top-color: var(--primary);
            }
            .format-tiles .course-content ul.tiles .tile {
                box-shadow: 2px 4px 5px 0 #111;
            }
            #page.drawers {
                scrollbar-color: #6a737b #333;
            }
            .nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link, .courseindex .courseindex-item:hover .courseindex-link, .courseindex .courseindex-item:hover .courseindex-chevron, .courseindex .courseindex-item:focus .courseindex-link, .courseindex .courseindex-item:focus .courseindex-chevron, .courseindex .courseindex-item:hover.dimmed .courseindex-link, .courseindex .courseindex-item:hover.dimmed .courseindex-chevron, .courseindex .courseindex-item:focus.dimmed .courseindex-link, .courseindex .courseindex-item:focus.dimmed .courseindex-chevron {
                color: #999;
            }
            .bg-light {
                background-color: #222 !important;
            }
            .bg-light, .page-link {
                border: 1px solid #444 !important;
            }
            .breadcrumb {
                background-color: #779;
            }
            .activity-item .activity-completion button.btn-success, .activity-item .activity-completion a[role="button"].btn-success {
                background-color: #97c496;
            }
        `;
        document.head.appendChild(style);
    }

    // Execute tout ça
    addGoogleFontsLinks();
    addCustomFontStyles();
})();