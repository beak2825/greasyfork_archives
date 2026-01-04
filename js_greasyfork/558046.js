// ==UserScript==
// @name         Canvas Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A dark mode theme for canvas
// @author       r-hiland
// @match        *://*.instructure.com/*
// @include      *://canvas.*.edu/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558046/Canvas%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/558046/Canvas%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const darkModeCSS = `
        body, .ic-app-header, .ic-app-nav-toggle-and-crumbs, .ic-nav-global, .ic-nav-global__menu-list, .ic-app-nav-toggle-and-crumbs__icon, .ic-app-header__main-navigation, .ic-app-header__secondary-navigation, .ic-app-header__main-navigation a, .ic-app-header__main-navigation span, .ic-NavMenu-list-item, .ic-NavMenu-list-item__text, .ic-NavMenu-list-item__badge, .ic-notification, .ic-notification__icon, .ic-notification__text, .ic-notification__content, input, select, textarea, button, .Button, .btn, a, .ui-widget-content, #content-wrapper, .ic-Layout-contentWrapper, .header-bar, .assignment_group, .ig-header, .ig-row {
            background-color: #2c2c2c !important;
            color: #cfcfcf !important;
        }
        .ic-app-header__main-navigation, .ic-app-header__secondary-navigation, .ic-nav-global__menu-list, .ic-app-nav-toggle-and-crumbs, .ic-notification, .header-bar, .assignment_group, .ig-header, .ig-row {
            background-color: #1a1a1a !important;
        }
        .ic-app-header__main-navigation a:hover, .ic-app-nav-toggle-and-crumbs__icon:hover, .ic-NavMenu-list-item__text:hover, .ic-NavMenu-list-item__badge:hover, .ic-notification:hover, button:hover, .Button:hover, .btn:hover, a:hover, .assignment_group:hover, .ig-row:hover {
            color: #fff !important;
        }
        input, select, textarea {
            background-color: #1a1a1a !important;
            border: 1px solid #444 !important;
        }
        input:focus, select:focus, textarea:focus {
            border-color: #666 !important;
            outline: none !important;
        }
        button, .Button, .btn {
            background-color: #444 !important;
            border: none !important;
        }
        .ic-NavMenu-list-item {
            background-color: #1a1a1a !important;
        }
        .ic-NavMenu-list-item:hover {
            background-color: #333 !important;
        }
        .ui-widget-content {
            background: #2c2c2c !important;
        }
        .ic-DashboardCard {
            background: #ffffff00;
        }
        .ic-DashboardCard__header_content {
            background: #00000000;
        }
        .ic-app-header__main-navigation a, .ic-app-header__main-navigation span, .ic-nav-global__menu-list a {
            color: #cfcfcf !important;
        }
        .ic-nav-global__menu-list a:hover {
            color: #fff !important;
        }
        .ic-app-header__main-navigation a:hover {
            color: #fff !important;
        }
        .item-group-container  {
            background: #ffffff00 !important;
        }
        .css-1gto5tw-tray {
            background-color: #2c2c2c !important;
        }
        #breadcrumbs {
            background-color: #ffffff00 !important;
        }
        a {
            background-color: #ffffff00 !important;
        }
        table.summary td, table.summary tbody th {
            background-color: #ffffff00 !important;
        }
        .ic-Dashboard-header__layout {
            background-color: #ffffff00 !important;
        }
        .ig-header .name {
            color: #bbbbbb;
            text-shadow: 1px 1px 0 rgb(255 255 255 / 14%);
        }
        .item-group-condensed .ig-header {
            border: 1px solid #c7cdd13b;
        }
        .item-group-condensed .ig-row {
            border-bottom: 1px solid #c7cdd13b;
        }
        .ig-list .ig-row {
        border: 1px solid #c7cdd13b;
        }
        .css-vxe90h-view--inlineBlock {
            background: #ffffff00 !important;
            border-color: #ffffff00 !important;
        }
        .css-kryo2y-view-listItem {
            color: rgb(118 123 127) !important;
        }
        #calendar-app .fc-month-view .fc-body, #calendar-drag-and-drop-container .fc-month-view .fc-body {
            background-color: #ffffff00;
        }
        #calendar-app .fc-month-view .fc-today, #calendar-drag-and-drop-container .fc-month-view .fc-today {
            background: #212121;
        }
        #minical {
            background-color: #292929;
            --ic-brand-font-color-dark-lightened-28: 3f3f3f;
        }
        #minical .fc-widget-content {
            color: #616161;
        }
        #minical .fc-widget-content {
            border: 1px solid #292929;
        }
        #calendar-list-holder, #other-calendars-list-holder, #undated-events {
            background-color: #00000000;
        }
        .ic-app-header__main-navigation, .ic-app-header__secondary-navigation, .ic-nav-global__menu-list, .ic-app-nav-toggle-and-crumbs, .ic-notification, .header-bar, .assignment_group, .ig-header, .ig-row {
            background-color: #1a1a1a00 !important;
        }
        .ic-Table.ic-Table--hover-row tbody tr:hover, .ic-Table.ic-Table--hover-row tbody tr.ic-Table__row--bg-neutral:hover, .ic-Table.ic-Table--hover-row tbody tr.ic-Table__row--bg-success:hover, .ic-Table.ic-Table--hover-row tbody tr.ic-Table__row--bg-alert:hover, .ic-Table.ic-Table--hover-row tbody tr.ic-Table__row--bg-danger:hover {
            background-color: #3f3f3f;
        }
        #grades_summary th.title .context {
            color: #4c6271;
        }
        .css-2bn4c9-view--inlineBlock-inlineListItem {
            color: #4c6271 !important;
        }
        .context_module_item.context_module_item_hover {
            background: #3F3F3F;
        }
        .module-sequence-footer .module-sequence-footer-content {
            background: #00000000;
        }
        .ic-Table.ic-Table--striped tbody tr:nth-child(odd) {
            background-color: #373737;
        }
        .ui-tabs .ui-tabs-nav li.ui-tabs-active, .ui-tabs .ui-tabs-nav li.ui-tabs-active.ui-state-hover, .ui-tabs .ui-tabs-nav li.ui-tabs-active:hover {
            background: #2b2b2b;
        }
        .css-g2dic8-textInput__facade {
            border: 0 !important;
            background: rgb(101 101 101) !important;
            color: rgb(255 255 255) !important;
        }
        .ef-item-row.ef-item-selected {
            background-color: #494949;
        }
        .ef-item-row:hover {
            background-color: #494949;
        }
        #syllabus tr.date.date_passed td, #syllabus tr.date.date_passed th {
            background-color: #3F3F3F !important;
        }
        .mini_calendar .day.today {
            background-color: #212112;
        }
        .mini_calendar .day.has_event {
            background-color: #818181;
        }
        .mini_calendar .day {
            color: #616161;
        }
        .item-group-expandable .emptyMessage {
            color: #979797;
            background: #232323;
        }
        .item-group-condensed .item-group-expandable {
            background-color: #fd494900;
            border: 1px solid #575757;
        }
        #calendars-context-list .context_list_context:hover, #other-calendars-context-list .context_list_context:hover {
            background: #434343;
        }
        #undated-events .event {
            background-color: #5d5d5d00;
        }
        .ui-dialog .ui-dialog-titlebar.ui-widget-header, .ui-dialog .ui-datepicker .ui-widget-header.ui-datepicker-header, .ui-datepicker .ui-dialog .ui-widget-header.ui-datepicker-header {
            background: #232323;
        }
        .ui-widget-overlay {
            background-color: rgb(37 37 37 / 92%);
        }
        .css-j68kdy-formFieldLabel {
            color: #4c6271 !important;
        }
        .css-pkzi3c-view-alert {
            color: rgb(207 207 207) !important;
            background: rgb(91 91 91) !important;
            border-color: rgb(187 187 187) !important;
        }
        .css-1lvqnn0-head {
            background: #00000000 !important;
        }
        .css-v9mxmy-view-table {
            background: #00000000 !important;
        }
        .css-pcp0di-colHeader {
            background: rgb(2 1 1 / 0%) !important;
            color: rgb(223 223 223) !important;

        }
        .css-uysa3a-view-row {
            background: rgb(235 9 9 / 0%) !important;
        }
        .css-1lvqnn0-head {
            background: rgb(255 0 0 / 0%) !important;
        }
        .css-1lx4ap9-colHeader {
            background: rgb(255 255 255 / 0%) !important;
            color: rgb(223 223 223) !important;
        }
        .css-71iz6n-view-rowHeader {
            color: rgb(129 129 129) !important;
            background: #2C2C2C !important;
        }
        .css-1orhfp7-toggleFacade__label {
            color: rgb(111 111 111) !important;
        }
        .css-b30avf-view-cell {
            background: #2C2C2C !important;
        }
        .css-1eaecfq-baseButton__content {
            color: rgb(125 125 125) !important;
        }
        .css-1nz9urh {
            border-right: 0.125rem solid rgb(143 0 0);
            background: rgb(143 0 0);
        }
`;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(darkModeCSS));

    document.head.appendChild(style);
})();
