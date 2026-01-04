// ==UserScript==
// @name         Prado Oscuro
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Script que permite utilizar la plataforma de Prado UGR en modo oscuro, para mejorar la visualización. ¡Sólo cambios estéticos!
// @author       José de los Ríos
// @match        https://pradogrado2526.ugr.es/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ugr.es
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550778/Prado%20Oscuro.user.js
// @updateURL https://update.greasyfork.org/scripts/550778/Prado%20Oscuro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        :root{
            --dark-background-color: #1a1a1a;
            --bright-font-color: #eee;
            --link-font-color: #bac4d4;
            --dark-background-secondary: #444;
        }

        .drawer{
          background-color: var(--dark-background-color) !important;
          border-right: 1px solid #000;
         }

        body{
          background-color: var(--dark-background-color) !important;
        }

        #region-main{
          background-color: var(--dark-background-color);
        }

        .courseindex .courseindex-item .courseindex-link, .courseindex .courseindex-item .courseindex-chevron {
           color: var(--bright-font-color);
        }

        .moremenu .nav-tabs {
            background-color: var(--dark-background-color);
        }

        .nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link {
           color: var(--bright-font-color);
        }

        #page.drawers .main-inner {
          background-color: var(--dark-background-color);
        }

        .secondary-navigation .navigation {
          background-color: var(--dark-background-color);
        }

        a{
           color: var(--link-font-color);
        }

        a:hover{
          color: var(--link-font-color);
          opacity: 0.7;
         }

        .course-section .sectionname>a {
           color: #fff;
        }

        .moremenu .nav-link.active, .moremenu .nav-link.active:focus, .moremenu .nav-link.active:hover, .moremenu .nav-link:hover {
           border-bottom-color: var(--link-font-color);
        }

        .moremenu .nav-link.active:focus, .moremenu .nav-link.active:hover {
           background-color: var(--dark-background-secondary);
        }

        .moremenu .nav-link:hover, .moremenu .nav-link:focus {
             background-color: var(--dark-background-secondary);
        }

        .card{
          background-color: var(--dark-background-color);
          border: 1px solid var(--dark-background-secondary);
        }

        .block .block-cards span.categoryname, .block .block-cards .btn-link {
           color: var(--bright-font-color);
        }

        body{
          color: var(--bright-font-color);
        }

        .bg-white{
             background-color: var(--dark-background-color) !important;
        }

        .navbar{
           background-color: #CB2C30 !important;
        }

        .form-control {
             background-color: var(--dark-background-secondary);
             color: var(--bright-font-color);
        }

        .primary-navigation .navigation .nav-link:hover {
            color: #343a40;
            background-color: #fff;
         }

         .courseindex .courseindex-item:hover .courseindex-link{
           color: #fff9;
         }

         .bg-light {
            background-color: var(--dark-background-color) !important;
         }

         .generaltable tbody tr:nth-of-type(even){
            background-color: var(--dark-background-secondary);
         }

         .generaltable {
            color: #fff;
         }

         .generaltable tr:hover{
            color: #fff9 !important;
         }

         .page-link {
            background-color: var(--dark-background-secondary);
            color: var(--link-font-color);
         }

         .path-grade-report-user .user-report-container{
            background-color: var(--dark-background-color);
         }

         .path-grade-report-user .user-grade thead th{
            background-color: var(--dark-background-secondary);
            /*border-left: 1px solid var(--bright-font-color);*/
            /*border-right: 1px solid var(--bright-font-color);*/
         }

         .path-grade-report-user .user-grade thead th:not(.lastcol){
           border-right: 1px solid var(--bright-font-color);
         }

         .generaltable tbody tr:nth-of-type(odd) {
              background-color: var(--dark-background-color);
         }

         .generaltable tbody tr:nth-of-type(even) {
              background-color: var(--dark-background-secondary);
         }

         .path-grade-report-user .user-grade th.category{
              background-color: var(--dark-background-color);
              border: none;
         }

         .path-grade-report-user .user-grade td{
              background-color: var(--dark-background-color);
         }

         .path-grade-report-user .user-grade th.column-itemname:not(.header,.category,.baggt,.baggb){
             background-color: var(--dark-background-color);
         }

         .path-grade-report-user .user-grade td.item{
            background-color: var(--dark-background-color);
         }

         .path-grade-report-user .user-grade .baggt{
            background-color: var(--dark-background-secondary);
         }



         .btn{
           color: var(--bright-font-color);
         }

         .btn:hover{
           color: var(--bright-font-color);
           opacity: 0.7;
         }

         .btn-secondary{
            background-color: var(--dark-background-secondary);
         }

         .btn-secondary:hover{
            background-color: var(--dark-background-secondary);
            opacity: 0.7;
         }

         .custom-select:disabled{
            background-color: var(--dark-background-secondary);
         }

         .maincalendar .calendarmonth .clickable:hover {
            background-color: var(--dark-background-secondary);
         }

         .modal-content {
            background-color: var(--dark-background-color);
         }

         .form-control:focus{
            color: var(--bright-font-color);
            background-color: var(--dark-background-secondary);
         }

         .custom-select{
           color: var(--bright-font-color);
           background-color: var(--dark-background-secondary);
         }

         .tox .tox-statusbar {
           background-color: var(--dark-background-secondary) !important;
           color: var(--bright-font-color) !important;
         }

         .tox .tox-statusbar a, .tox .tox-statusbar__path-item, .tox .tox-statusbar__wordcount {
           color: var(--bright-font-color) !important;
         }

         tox .tox-statusbar__branding svg {
           fill: var(--bright-font-color);
         }

         .close, .btn-close{
           color: var(--bright-font-color);
         }

         .close, .btn-close:hover{
           color: var(--bright-font-color);
           opacity: 0.7;
         }

         .dropdown-item, .dropdown-menu {
           background-color: var(--dark-background-secondary);
           color: var(--bright-font-color);
         }

         .local-mail-navbar-popover.svelte-1aihbok.svelte-1aihbok, .list-group-item-action, .local-mail .dropdown-menu {
            background-color: var(--dark-background-secondary);
            color: var(--bright-font-color);
         }

         .list-group-item-action:hover, .local-mail .dropdown-menu .dropdown-item:hover {
            background-color: var(--dark-background-main);
            color: var(--bright-font-color);
            opacity: 0.8;
         }

         .popover-region-container {
            background-color: var(--dark-background-secondary);
         }

         .content-item-container.unread {
            background-color: var(--dark-background-color);
         }

         .popover-region-footer-container {
            background-color: var(--dark-background-secondary);
         }

         .message-app {
            background-color: var(--dark-background-color);
         }

         .message-app .message.received {
            background-color: var(--dark-background-secondary);
            color: var(--bright-font-color);
         }

         .message-app .day {
            color: var(--bright-font-color);
         }






    `)
})();
