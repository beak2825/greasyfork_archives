//
// Written by Glenn Wiking
// Script Version: 1.0.2a
// Date of issue: 05/12/14
// Date of resolution: 06/12/14
//
// ==UserScript==
// @name        ShadeRoot YT
// @namespace   YT
// @description Eye-friendly magic in your browser for Youtube
// @version     1.0.2a
// @icon        https://i.imgur.com/mAM2cWm.png

// @include        http://*.youtube.*
// @include        https://*.youtube.*
// @include        http://*plus.google.*
// @include        https://*plus.google.*
// @include        http://*apis.google.*
// @include        https://*apis.google.*
// @include        http://*.appspot.*
// @include        https://*.appspot.*

// @exclude        http://*.apiblog.*
// @exclude        https://*.apiblog.*
// @downloadURL https://update.greasyfork.org/scripts/6810/ShadeRoot%20YT.user.js
// @updateURL https://update.greasyfork.org/scripts/6810/ShadeRoot%20YT.meta.js
// ==/UserScript==

function ShadeRootYT(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootYT(
  'html, iframe html {background: rgba(33, 20, 20, 1) !important;}'
  +
  'body, .t3, .Bha, .Nn {background: #1B1715 !important; color: #B2B2B2 !important;}'
  +
  '*::-moz-selection {background-color: #6E170C !important;}'
// HOMEBODY
  +
  '#yt-masthead-container {background: none repeat scroll 0% 0% rgba(30, 24, 24, 1); border-bottom: 1px solid rgba(62, 22, 22, 1);}'
  +
  '#masthead-appbar {background-color: rgba(66, 38, 38, 1); border-bottom: 1px solid rgba(84, 34, 34, 1);}'
  +
  '.guide-pinned .guide-pinning-enabled #appbar-guide-menu {border-right: 1px solid rgba(99, 27, 27, 1);}'
  +
  '.branded-page-v2-primary-col .branded-page-box, .section-list li .item-section .branded-page-box {border-bottom: 1px solid #591515; background: #1B1715 !important;}'
  +
  '.yt-uix-expander-collapsed .yt-ui-ellipsis {background: #1B1715 !important;}'
  +
  '.shelf-item .branded-page-module-title .branded-page-module-title-text, a.yt-uix-button-epic-nav-item.selected, a.yt-uix-button-epic-nav-item.yt-uix-button-toggled, button.yt-uix-button-epic-nav-item.selected, button.yt-uix-button-epic-nav-item.yt-uix-button-toggled, .epic-nav-item.selected, .epic-nav-item.yt-uix-button-toggled, .epic-nav-item-heading, #appbar-onebar-upload-group #upload-btn .yt-uix-button-content {color: #EDD !important;}'
  +
  '#masthead-positioner:hover #appbar-guide-button {border-color: rgba(134, 23, 23, 1); background: none repeat scroll 0% 0% rgba(189, 21, 27, 1);}'
  +
  '.yt-uix-button-default, .yt-uix-button-default[disabled], .yt-uix-button-default[disabled]:hover, .yt-uix-button-default[disabled]:active, .yt-uix-button-default[disabled]:focus {border-color: rgba(144, 14, 14, 1); background: none repeat scroll 0% 0% rgba(156, 20, 20, 1); color: #EDD !important;}'
  +
  '.guide-pinned.show-guide .guide-pinning-enabled #page, .guide-pinned.show-guide .guide-pinning-enabled #appbar-content {background: rgba(39, 30, 30, 1) !important;}'
  +
  '.vm-list-view .vm-video-title .vm-video-title-content {color: #D4C8C8 !important;}'
  +
  '#guide-container {background: rgba(45, 21, 21, 1) !important;}'
  +
  '.guide-section-separator {border-bottom: 1px solid #542222;}'
  +
  '#guide-subscriptions-promo.default-promo {border: 1px solid #542222;}'
  +
  '.guide-toplevel span {color: #EDD !important;}'
  +
  '.guide-pinned .guide-pinning-enabled #appbar-guide-menu {border-right: 1px solid #2D1515;}'
  +
  '#appbar-guide-menu, .guide-flyout {box-sizing: border-box; background: none repeat scroll 0% 0% #2D1515;}'
  +
  '.shelf-description {background: #1B1715;}'
  +
  '.yt-ui-ellipsis {background-color: #1B1715;}'
  +
  '.yt-lockup-title a, .yt-lockup-meta a, .yt-lockup-description a {color: rgba(156, 31, 11, 1);}'
  +
  '.yt-lockup .yt-lockup-meta a, .yt-lockup .yt-lockup-description a {color: rgba(113, 22, 25, 1);}'
  +
  '.yt-lockup:hover a, .yt-lockup:hover a, .yt-lockup:hover .yt-lockup-meta a {color: rgba(209, 98, 79, 1);}'
  +
  '.yt-uix-button-primary {border-color: rgba(186, 49, 27, 1); background: none repeat scroll 0% 0% rgba(195, 61, 39, 1);}'
  +
  '.compact-shelf .yt-uix-button-shelf-slider-pager {background: none repeat scroll 0% 0% rgba(110, 18, 18, 1);}'
  +
  '.browse-list-item-container:hover .compact-shelf .yt-uix-button-shelf-slider-pager, .compact-shelf:hover .yt-uix-button-shelf-slider-pager {border: 1px solid rgba(128, 17, 17, 1); box-shadow: 1px 1px 3px rgba(128, 19, 19, 0.2);}'
  +
  '.guide-subscriptions-promo-tooltip {border-color: rgba(167, 49, 29, 1) rgba(146, 47, 31, 1) rgba(156, 40, 21, 1) !important; background: none repeat scroll 0% 0% rgba(114, 30, 16, 1);}'
  +
  '.yt-subscription-button-subscriber-count-branded-horizontal, .yt-subscription-button-subscriber-count-unbranded-horizontal {border: 1px solid rgba(114, 16, 16, 1); background-color: rgba(95, 29, 29, 1);}'
  +
  '.yt-thumb {background: none repeat scroll 0% 0% rgba(32, 3, 3, 1); opacity: 0.8;}'
  +
  '.yt-uix-button-primary:hover {background: none repeat scroll 0% 0% rgba(144, 42, 25, 1) !important;}'
  +
  '.aac {background-color: rgba(62, 31, 31, 1);}'
  +
  '.MNn0h {background: none repeat scroll 0% 0% rgba(101, 9, 9, 1);}'
  +
  '.sb-card-border {background: none repeat scroll 0px 0px rgba(71, 14, 14, 1); border: 1px solid rgba(95, 9, 9, 1); box-shadow: 0px 0px 5px rgba(60, 15, 15, 0.47);}'
  +
  '.Kza:after {border-color: rgba(105, 26, 26, 1) rgba(107, 29, 29, 0) rgba(255, 255, 255, 0);}'
  +
  '.Kza {background-color: #650909;}'
  +
  '.MNn0h.RATVS, .MNn0h:hover {background: none repeat scroll 0% 0% rgba(156, 44, 44, 1);}'
  +
  '#masthead-search-terms input {background: none repeat scroll 0% 0% rgba(74, 53, 53, 1);}'
  +
  '#masthead-search-terms {background-color: rgba(80, 34, 34, 1);}'
  +
  '.yt-uix-button-default:hover, .yt-uix-button-text:hover {border-color: rgba(149, 15, 15, 1) !important; background: none repeat scroll 0% 0% rgba(131, 24, 24, 1) !important;}'
  +
  '.masthead-search-terms-border {border: 1px solid rgba(83, 25, 25, 1) !important; box-shadow: 0px 1px 2px rgba(50, 9, 9, 1) inset !important;}'
  +
  '.guide-flyout-trigger.on-hover, .guide-item:hover, .guide-item:hover .yt-deemphasized-text, .guide-collection-item:hover .guide-item, .guide-collapsible-item .yt-uix-expander-head:hover {background: none repeat scroll 0% 0% rgba(69, 15, 15, 1);}'
  +
  '.yt-card {background: none repeat scroll 0% 0% rgba(62, 15, 15, 1);}'
  +
  '.feed-header {border-bottom: 1px solid rgba(50, 15, 15, 1);}'
  +
  '.branded-page-module-title a, .branded-page-related-channels h3 a, .branded-page-related-channels h3, .yt-alert-default .yt-alert-content, .yt-dialog-title, .dialog-description, .dialog-description p {color: #EDD !important;}'
  +
  '.branded-page-related-channels h3 a:hover, .branded-page-related-channels-item .yt-uix-button-link:hover {color: rgba(198, 41, 22, 1);}'
  +
  '.yt-alert-default.yt-alert-info, .yt-alert-actionable.yt-alert-info, .yt-alert-naked.yt-alert-info .yt-alert-icon, .yt-alert-small.yt-alert-info {background: none repeat scroll 0% 0% rgba(128, 30, 14, 1);}'
  +
  '.yt-dialog-fg {border: 1px solid rgba(140, 19, 19, 1) !important;}'
  +
  '.yt-dialog-fg, .yt-uix-overlay-fg, #feed-privacy-lb .feed-item-container {background: none repeat scroll 0% 0% rgba(84, 17, 17, 1) !important;}'
  +
  '#feed-privacy-lb .feed-item-container a, #footer-links-primary li a, #footer-links-primary a, #footer-links-secondary a {color: rgba(174, 42, 21, 1);}'
  +
  '#watch7-headline h1 .long-title, .actionable #watch-like.yt-uix-button-toggled .yt-uix-button-content, .yt-uix-button-content, #yt-uix-videoactionmenu-menu, #yt-uix-videoactionmenu-menu h3, .add-to-widget .playlist-name, .xN .d-y-r-c-ha {color: #EDD !important;}'
  +
  '#ytf-main-div {border-color: rgba(59, 8, 8, 1) !important;}'
  +
  '#watch8-action-buttons {border-top: 1px solid rgba(26, 26, 26, 1) !important;}'
  +
  '.video-extras-sparkbar-dislikes {background: none repeat scroll 0% 0% rgba(74, 56, 56, 1) !important;}'
  +
  '.video-extras-sparkbar-likes {background: none repeat scroll 0% 0% rgba(168, 38, 17, 1) !important;}'
  +
  '.yt-ui-menu-content {background: none repeat scroll 0% 0% rgba(48, 34, 34, 1) !important; border: 1px solid rgba(60, 25, 25, 1) !important;}'
  +
  '.add-to-widget .playlists {border-bottom: 1px solid rgba(57, 23, 23, 1);}'
  +
  '.add-to-widget .create-playlist-item:focus, .add-to-widget .create-playlist-item:hover {background-color: rgba(87, 11, 11, 1);}'
  +
  '.yJa, .mj, .BJa, .DJa, .E5, .Jea {background-color: #3E0F0F !important;}'
  +
  '.E5, .e4 {border-color: rgba(126, 19, 19, 1) rgba(135, 24, 24, 1) rgba(98, 26, 26, 1) !important;}'
  +
  '.xN.d-y-r-c, .xN.d-y-r-c.d-y-r-c-eb {background-color: rgba(159, 19, 19, 1) !important;}'
  +
  '.Ub, .Ub:hover .bmd, .Rg:hover, .Rg.o-U-s:hover, .video-list .video-list-item .title:hover {color: rgba(173, 34, 11, 1) !important;}'
  +
  '.dn, .video-list .video-list-item .title, #watch-description, #watch7-user-header .yt-user-info a {color: #EDD !important;}'
  +
  '.yt-card .yt-uix-button-expander {border-top: 1px solid rgba(90, 13, 13, 1) !important;}'
  +
  '.mj {background-color: #3E0F0F !important;}'
  +
  '#footer-main {border-bottom: 1px solid rgba(75, 15, 15, 1);}'
  +
  '#footer-links-primary a:hover {color: rgba(162, 39, 18, 1);}'
  +
  '#footer-container {background-color: rgba(36, 9, 9, 1) !important; border-top: 1px solid rgba(53, 8, 8, 1) !important;}'
  +
  '#appbar-nav .appbar-nav-avatar, .c4-banner-promo {opacity: .8;}'
  +
  '.yt-dialog-base {background: none repeat scroll 0% 0% rgba(26, 4, 4, 0.75);}'
  +
  '.yt-uix-button-subscribe-unbranded, .yt-uix-button-subscribe-unbranded[disabled], .yt-uix-button-subscribe-unbranded[disabled]:hover, .yt-uix-button-subscribe-unbranded[disabled]:active, .yt-uix-button-subscribe-unbranded[disabled]:focus {border: 1px solid rgba(111, 14, 14, 1); background-color: rgba(135, 14, 14, 1); color: #333;}'
  +
  '.branded-page-v2-primary-col .branded-page-box, .section-list li .item-section .branded-page-box {border-bottom: 1px solid rgba(65, 13, 13, 1);}'
  +
  '.yt-card {background: none repeat scroll 0% 0% rgba(26, 17, 17, 1);}'
  +
  '.yt-lockup-notifications-container {border: 1px solid rgba(87, 10, 10, 1) !important;}'
  +
  '.branded-page-v2-subnav-container {border-bottom: 1px solid rgba(75, 17, 17, 1) !important;}'
  +
  '.channel-header .secondary-header-contents {background-color: #1A1111 !important; border-bottom: 1px solid #4D0E0E !important;}'
  +
  '.secondary-header-contents, .secondary-header-contents .nav-text, .yt-uix-tooltip, .about-stats, .joined-date, .about-stat {color: #EDD !important;}'
  +
  '.yt-uix-button-c4-view-action {border-color: -moz-use-text-color -moz-use-text-color rgba(137, 13, 13, 1) rgba(123, 11, 11, 1) !important; background-color: #9C1414 !important;}'
  +
  '#view-as-notification {background-color: rgba(99, 37, 27, 1) !important;}'
  +
  '.about-channel-link-text {color: rgba(173, 35, 12, 1) !important;}'
  +
  '#channel-search .search-field {color: #EDD !important;}'
  +
  '.yt-uix-form-input-select:hover, .yt-uix-form-input-text:hover, .yt-uix-form-input-textarea:hover {border-color: rgba(80, 12, 12, 1) !important;}'
  +
  '.yt-uix-form-input-text, .yt-uix-form-input-textarea {border: 1px solid rgba(90, 16, 16, 1) !important;}'
  +
  '.aac {background-color: rgba(89, 12, 12, 1) !important;}'
  +
  '.Kza:after {border-color: rgba(75, 42, 42, 1) rgba(255, 255, 255, 0) rgba(255, 255, 255, 0) !important;}'
  +
  '.Kza {background-color: rgba(72, 49, 49, 1) !important; color: rgba(81, 18, 18, 1) !important;}'
  +
  '.Xwb, .DQb, .ob, #abuse-link {color: rgba(198, 46, 21, 1) !important;}'
  +
  '.MNn0h {background: none repeat scroll 0% 0% rgba(50, 32, 32, 1) !important;}'
  +
  '.MNn0h:hover {background: none repeat scroll 0% 0% rgba(122, 9, 9, 1) !important; color: #EDD !important;}'
  +
  '.c4-checklist-module {background: none repeat scroll 0% 0% #1A1111 !important; border: 1px solid rgba(63, 13, 13, 1) !important;}'
  +
  '.c4-checklist-module .checklist-item-title-text, .DJa, #creator-subheader h3, #creator-sidebar .creator-sidebar-section a {color: #EDD !important;}'
  +
  '#other-channels-sidebar:hover, .related-channels-editor:hover {background-color: rgba(56, 5, 5, 1) !important;}'
  +
  '.c4-checklist-module .checklist-item:hover .checklist-item-title-text .todo-title-text, .c4-checklist-module .view-all-link a:hover {color: rgba(168, 39, 18, 1) !important;}'
  +
  '.Jea {border: 6px solid rgba(120, 27, 27, 1) !important;}'
  +
  '.Mga {display: none;}'
  +
  '#vm-myvideos-search-box, #vm-playlists-search-box, #vm-tags-search-box, #non-appbar-vm-video-actions-bar .vm-video-actions-inner #vm-view-filter-label, #creator-sidebar .creator-sidebar-branding h2 {color: #EDD !important;}'
  +
  '#non-appbar-vm-video-actions-bar .vm-video-actions-inner {border-bottom: 1px solid rgba(108, 22, 22, 1) !important;}'
  +
  '#non-appbar-vm-video-actions-bar, #non-appbar-vm-video-actions-bar .vm-video-actions-bar {background-color: rgba(90, 10, 10, 1) !important;}'
  +
  '#creator-sidebar .creator-sidebar-section a:hover {color: #EDD; background: none repeat scroll 0% 0% rgba(68, 23, 23, 1);}'
  +
  '#vm-pagination {background: none repeat scroll 0% 0% #1A1111;}'
  +
  '.yt-uix-button-menu .yt-uix-button-menu-item.menu-subheading-notice {border-top: 1px solid rgba(84, 17, 17, 1); background: none repeat scroll 0% 0% rgba(63, 34, 34, 1);}'
  +
  '#dashboard-no-videos-overlay {background: none repeat scroll 0% 0% rgba(44, 32, 32, 0.85) !important;}'
  +
  '#creator-sidebar > #creator-sidebar-section-id-dashboard.selected > h3 a {background-color: rgba(83, 14, 14, 1) !important;}'
  +
  '.modal-dialog-title, .modal-dialog-content {background-color: #3F0D0D !important; color: #EDD !important;}'
  +
  '.modal-dialog, .Jub, .Hub, .dashboard-widget.notification .notification-title, #dashboard-header h1 a, .analytics-sparkline-card .infos .total, .analytics-sparkline-card .infos .title, .dashboard-widget.notification {color: #EDD !important;}'
  +
  '.modal-dialog-buttons button:focus {border: 1px solid rgba(125, 32, 16, 1);}'
  +
  '.modal-dialog-buttons button {background-color: rgba(119, 14, 14, 1); background-image: -moz-linear-gradient(center top , rgba(135, 16, 16, 1), rgba(95, 13, 13, 1)); color: #EDD !important;}'
  +
  '.f4a {background-color: rgba(60, 42, 42, 1) !important;}'
  +
  '.dashboard-widget.notification, .dashboard-widget .dashboard-widget-content, .dashboard-widget .dashboard-widget-config {background-color: rgba(44, 10, 10, 1) !important;}'
  +
  '.dashboard-channel-link {color: rgba(186, 31, 20, 1) !important;}'
  +
  '.analytics-card {opacity: .8;}'
  +
  '.dashboard-widget-footer .dashboard-widget-view-all-link {color: rgba(183, 35, 10, 1) !important;}'
  +
  '.dashboard-widget-footer .dashboard-widget-view-all-link:hover {background: none repeat scroll 0% 0% rgba(68, 23, 23, 1) !important;}'
  +
  '.video-list-item a:hover {background: none repeat scroll 0% 0% rgba(77, 19, 19, 1) !important;}'
  +
  '.add-widget-menu-content li {border-top: 1px solid rgba(111, 24, 24, 1) !important;}'
// UPLOAD
  +
  '.upload-sidebar-header, .upload-option-text, .upload-footer-header, #loading-message, #upload-hub-privacy-settings, #hub-sharebox-settings, .upload-informational-footer, .upload-drag-drop-description {color: #EDD !important;}'
  +
  '.upload-informational-footer a, upload-informational-footer, upload-informational-footer a {color: rgba(185, 43, 20, 1) !important;}'
  +
  '.upload-help-link-item, .first-upload-help-link-item {border-left: 1px solid rgba(107, 12, 12, 1) !important;}'
  +
  '.upload-option-icon-wrapper, init-upload-action-icon-small {opacity: .8;}'
  +
  '#dialog {background-color: rgba(63, 13, 13, 1) !important; border-color: rgba(138, 21, 21, 1) rgba(105, 19, 19, 1) rgba(105, 16, 16, 1) !important;}'
  +
  '.search-panel .suggestions-container {background-color: #3F0D0D !important;}'
  +
  '.header {background-color: rgba(53, 33, 33, 1) !important; border-color: rgba(72, 14, 14, 1) !important;}'
  +
  '.external-link {color: rgba(165, 38, 18, 1) !important;}'
  +
  '.jfk-textinput:focus {border: 1px solid rgba(164, 38, 17, 1) !important;}'
  +
  '.jfk-textinput {border-color: rgba(156, 21, 21, 1) rgba(119, 23, 23, 1) rgba(122, 14, 14, 1) !important; background: rgba(69, 38, 38, 1) !important; color: #EDD !important;}'
  +
  '.jfk-button-action {background-color: rgba(158, 36, 16, 1) !important; background-image: -moz-linear-gradient(center top , rgba(155, 33, 14, 1), rgba(116, 29, 15, 1)) !important; border: 1px solid rgba(138, 28, 10, 1) !important;}'
  +
  '.yt-uix-button-menu {background: none repeat scroll 0% 0% rgba(51, 30, 30, 1) !important; border: 1px solid rgba(113, 20, 20, 1) !important; color: #EDD !important;}'
  +
  '.yt-uix-button-menu .yt-uix-button-menu-item, #upload-button-text, .yt-masthead-account-picker.yt-uix-clickcard-card-content, .yt-masthead-account-picker.yt-uix-clickcard-card-content, .yt-masthead-picker-name {color: #EDD !important;}'
  +
  '.yt-uix-clickcard-card-border, .yt-uix-hovercard-card-border, .yt-masthead-picker-footer {background: none repeat scroll 0% 0% rgba(51, 33, 33, 1) !important; border: 1px solid rgba(81, 15, 15, 1) !important; border-top: 1px solid rgba(81, 15, 15, 1) !important;}'
  +
  '.yt-masthead-account-picker-option, .yt-masthead-account-picker-option:hover {border-top: 1px solid rgba(77, 11, 11, 0.25) !important; background: none repeat scroll 0% 0% rgba(86, 13, 13, 1) !important;}'
  +
  '.watch-stage-mode #theater-background {background-color: rgba(18, 14, 14, 1) !important;}'
  +
  'h1.yt, .watch-sidebar-head, .watch-view-count, .share-panel, .add-to-widget .create-playlist-item {color: #EDD !important;}'
  +
  '.mj, .Mza {background-color: rgba(45, 26, 26, 1) !important;}'
  +
  '.watch-sidebar-separation-line {border-bottom: 1px solid #1A1A1A !important;}'
  +
  '.comments-iframe-container {opacity: .65;}'
  +
  '#eow-description a, .g-hovercard {color: rgba(165, 38, 18, 1) !important;}'
  +
  '.yt-uix-button-default.yt-uix-button-active, .yt-uix-button-default.yt-uix-button-active:focus {border-color: rgba(156, 9, 9, 1) !important; background: none repeat scroll 0% 0% rgba(165, 13, 13, 1) !important; box-shadow: 0px 1px 0px rgba(150, 18, 18, 1) inset !important;}'
  +
  '.yt-card .yt-uix-tabs {border-bottom: 1px solid #1A1A1A !important;}'
  +
  '.yt-uix-form-input-text:focus, .yt-uix-form-input-textarea:focus {border-color: rgba(108, 29, 16, 1) !important;}'
  +
  '.yt-uix-form-input-text, .yt-uix-form-input-textarea, .Bn {background: none repeat scroll 0% 0% rgba(36, 25, 25, 1) !important;}'
  +
  '.guide-section-separator {border-bottom: 1px solid rgba(90, 19, 19, 1) !important;}'
  +
  '#guide-subscriptions-promo.default-promo {border: 1px solid rgba(119, 34, 34, 1) !important;}'
  +
  '.guide-subscriptions-promo-tooltip {background: none repeat scroll 0% 0% rgba(120, 54, 43, 1) !important;}'
  +
  '.channel-header .branded-page-header-title .branded-page-header-title-link, .branded-page-base-bold-titles .branded-page-module-title {color: #EDD !important;}'
  +
  '#c4-header-bg-container {border-bottom: 1px solid rgba(77, 14, 14, 1) !important;}'
  +
  '.branded-page-v2-primary-col .branded-page-box, .section-list li .item-section .branded-page-box, .branded-page-v2-primary-col .branded-page-box.video-player-view-component:last-child {border-bottom: 1px solid rgba(75, 15, 15, 1) !important;}'
  +
  '.yt-uix-expander-ellipsis {background-color: #1B1715 !important;}'
  +
  '.video-player-view-component .video-detail a {color: rgba(165, 41, 21, 1) !important;}'
  +
  '.yt-uix-button-subscribe-branded.ypc-enabled {background-color: rgba(173, 42, 21, 1) !important;}'
  +
  '.yt-gb-shelf-main-content:hover {box-shadow: 0px 2px 3px rgba(119, 7, 7, 1) !important;}'
  +
  '.yt-uix-form-input-text:focus, .yt-uix-form-input-textarea:focus {border-color: rgba(171, 36, 13, 1) !important; box-shadow: 0px 0px 1px rgba(197, 17, 17, 0.2) inset !important;}'
  +
  '.yt-gb-shelf-main-content {border: 1px solid rgba(111, 21, 21, 1) !important; box-shadow: 0px 1px 2px rgba(32, 6, 6, 1) !important;}'
  +
  '#watch7-headline h1 .long-title, .yt-ui-menu-item, .Aq {color: #EDD !important;}'
  +
  '.yt-lockup:hover .yt-lockup-description a, .yt-lockup:hover a {color: rgba(119, 38, 28, 1);}'
  +
  '.yt-gb-shelf-main-content {border: 1px solid rgba(50, 36, 36, 1) !important; box-shadow: 0px 1px 2px rgba(29, 23, 23, 1) !important;}'
  +
  '.yt-gb-shelf-paddle {background-color: rgba(125, 16, 16, 1) !important; border: 1px solid rgba(95, 12, 12, 1) !important;}'
  +
  '.yt-gb-shelf .yt-gb-shelf-paddle:hover {box-shadow: 0px 0px 10px 1px rgba(38, 9, 9, 0.7) !important;}'
  +
  '.yt-uix-sessionlink {color: rgba(183, 36, 18, 1) !important;}'
  +
  '.multirow-shelf .yt-uix-expander-head {color: rgba(170, 36, 14, 1) !important;}'
  +
  '.yt-ui-menu-item:hover {background: none repeat scroll 0% 0% rgba(107, 8, 8, 1);}'
  +
  '.channel-header-profile-image {background-color: rgba(71, 16, 7, 1); opacity: .8;}'
  +
  '.channel-header .branded-page-header-title .branded-page-header-title-link, .yt-uix-button-content, .branded-page-base-bold-titles .branded-page-module-title, .yt-uix-button-content {color: #EDD !important;}'
  +
  '.category-header .category-title, .branded-page-base-bold-titles .branded-page-module-title, .zvd, .subscription-label-email, .subscription-label-upload, .subscription-sort-cell, .yt-picker-header h3.yt, .yt-notes li {color: #EDD !important;}'
  +
  '.d-s, .o-U-s, .bmd, .action-panel-loading, .action-panel-error {color: rgba(189, 55, 19, 1) !important;}'
  +
  '.r3 .r0 {background-color: rgba(63, 23, 23, 1) !important; background-image: -moz-linear-gradient(center top , rgba(60, 8, 8, 1) 0px, rgba(44, 7, 7, 1) 100%) !important; border: 1px solid rgba(56, 10, 10, 1) !important;}'
  +
  '.yt-uix-button-subscribe-unbranded:hover {border-color: rgba(80, 23, 23, 1); background-color: rgba(84, 25, 25, 1);}'
  +
  '.nbc {background-color: #541919 !important; border: 1px solid #591111 !important;}'
  +
  '#subscription-manager-container .empty-message {border-top: 1px solid rgba(60, 12, 12, 1) !important;}'
  +
  '.subscription-table-header {border-top: 1px solid #3C0C0C;}'
  +
  '#subscription-manager-container .subscription-item, #subscription-manager-container .collection-item {border-top: 1px solid #3C0C0C;}'
  +
  '.yt-uix-button-subscribed-unbranded {border: 1px solid rgba(99, 24, 24, 1); background-color: rgba(134, 21, 21, 1);}'
  +
  '.subscriptions-filter .filter-field-container {border: 1px solid rgba(60, 10, 10, 1) !important;}'
  +
  '.subscriptions-filter .filter-field-container {background: none; border: 1px solid #3C0A0A;}'
  +
  '.yt-ui-menu-content:hover > .selected:hover, .selected {background-color: rgba(99, 14, 14, 1) !important;}'
  +
  '.yt-uix-form-input-radio-element, .yt-uix-form-input-checkbox-element {border: 1px solid rgba(89, 19, 19, 1);}'
  +
  '.info-popup {border: 1px solid rgba(78, 24, 24, 1); background-color: rgba(68, 30, 30, 1); box-shadow: 0px 4px 16px rgba(50, 17, 17, 1);}'
  +
  '#subscription-loading-indicator .yt-spinner, .subscription-loader-body, .subscription-loader {color: #EDD !important; background: none repeat scroll 0% 0% #433 !important; border: 1px solid #433 !important;}'
  +
  '#yt-picker-country-footer, #yt-picker-language-footer, #yt-picker-safetymode-footer {background: none repeat scroll 0% 0% #240909 !important; color: #EDD !important;}'
  +
  '.yt-picker-header {border-bottom: 1px solid rgba(63, 17, 17, 1) !important;}'
  +
  '#safety-form p.safety-submit {border-top: 1px solid #3F1111 !important;}'
  +
  '.yt-uix-button-default:active, .yt-uix-button-default.yt-uix-button-toggled, .yt-uix-button-default.yt-uix-button-active, .yt-uix-button-default.yt-uix-button-active:focus, .yt-uix-button-text:active {border-color: rgba(74, 7, 7, 1) !important; background: none repeat scroll 0% 0% rgba(80, 8, 8, 1); box-shadow: 0px 1px 0px rgba(59, 4, 4, 1) inset !important;}'
  +
  '#masthead-container {background: none repeat scroll 0% 0% #1E1818; border-bottom: 1px solid #3E1616;}'
  +
  '#yt-microsite h2, #yt-microsite h3, #yt-microsite h4, #yt-microsite h5, .yt-tile-static a, .yt-tile-visible:hover a, .yt-tile-default:hover a {color: rgba(146, 21, 21, 1); text-shadow: 0px 0px 0px transparent, 0px 1px 1px rgba(50, 23, 23, 1);}'
  +
  '.yt-tile-static, .yt-tile-visible, .yt-tile-default:hover {background: none repeat scroll 0% 0% rgba(66, 8, 8, 1); box-shadow: 0px 1px 1px rgba(75, 22, 22, 1);}'
  +
  '.yt-tile-default, .yt-tile-static, .yt-tile-visible {border: 1px solid rgba(86, 13, 13, 1) !important;}'
  +
  '#yt-sidebar ul a, #yt-microsite-features p, .footer-secondary a {color: #EDD !important;}'
  +
  '.footer-container {background-color: rgba(56, 9, 9, 1); border-top: 1px solid rgba(71, 9, 9, 1) !important;}'
  +
  '.footer-main {border-bottom: 1px solid rgba(72, 21, 21, 1) !important;}'
  +
  '.footer-secondary li {text-shadow: 0px 1px 1px rgba(107, 62, 62, 1) !important;}'
  +
  '#masthead-search-term {background-color: rgba(69, 53, 53, 1) !important; border: 1px solid rgba(92, 26, 26, 1) !important;}'
  +
  '#masthead-search-term input, #masthead-search-term input:focus, #yt-microsite .yt-advertise-featured-home h2, #yt-microsite-features h2.yt-advertise-cta-title, h2.yt-advertise-cta-title {color: #EDD !important;}'
  +
  '#yt-microsite-features .yt-microsite-spotlight, .yt-advertise-cta-container {background: none repeat scroll 0% 0% rgba(51, 15, 15, 1) !important;}'
  +
  '.yt-advertise-cta-container {border: 1px solid rgba(102, 12, 12, 1) !important;}'
  +
  '.yt-microsite-spotlight a, .yt-microsite-spotlight a, #yt-js-advertise-lightbox, .yt-js-advertise-param-anchors, #yt-js-advertise-lightbox {color: rgba(146, 21, 21, 1) !important;}'
  +
  '.yt-form-input-select-content, .yt-form-input-select-container {background-color: rgba(89, 12, 12, 1); border: 1px solid rgba(122, 10, 10, 1);}'
  +
  '.yt-advertise-incentive-widget html {background: none repeat scroll 0% 0% #330F0F !important;}'
  +
  '.maia-button:hover, .maia-button:focus, .maia-button, .maia-button {background-color: rgba(153, 41, 23, 1) !important; background-image: -moz-linear-gradient(center top , rgba(147, 42, 25, 1), rgba(129, 31, 15, 1)) !important;}'
  +
  '.yt-microsite-spotlight p a {color: rgba(146, 21, 21, 1) !important;}'
  +
  '.yt-advertise-whyitworks-header {background-color: #1B1715 !important; background-image: linear-gradient(to bottom, rgba(41, 4, 4, 1) 50%, rgba(14, 1, 1, 1) 100%) !important;}'
  +
  '.yt-advertise-whyitworks-fade-left {opacity: .68;}'
  +
  '.yt-advertise-whyitworks-hero-container, .yt-advertise-image-split.yt-advertise-image-split-mobile {border-bottom: 1px solid rgba(41, 13, 13, 1) !important;}'
  +
  '.yt-horizontal-rule {border-top: 1px solid rgba(56, 8, 8, 1);}'
  +
  '#yt-microsite .yt-advertise-image-split-text h2, #yt-microsite .yt-advertise-featured-home h2, #yt-microsite .yt-advertise-whyitworks-subheader h2 {color: rgba(144, 27, 27, 1) !important;}'
  +
  '.gweb-lightbox {background: none repeat scroll 0% 0% rgba(81, 29, 29, 1) !important; border: 14px solid rgba(59, 16, 16, 1) !important; box-shadow: 0px 4px 16px rgba(68, 16, 16, 0.2) !important; color: #EDD !important;}'
  +
  '.gweb-lightbox-title, .gweb-lightbox-fragment, .gweb-lightbox-content iframe {background: none repeat scroll 0% 0% #3B1010 !important;}'
  +
  '#gweb-lightbox-yt-advertise-js-lightbox-group-1 p, #yts-nav ol li.top-level a, #yts-nav .top-level a, #yts-article #header, .ytg-box p, .yt-picker-region-name a, .yt-picker-region-name {color: #EDD !important;}'
  +
  '.gweb-lightbox-bg, .yt-js-lightbox-bg {background-image: radial-gradient(circle closest-corner at center 10% , rgba(45, 9, 9, 1) 125px, #4C4C4C 800px) !important;}'
  +
  '#yts-nav {border-right: 1px solid rgba(62, 7, 7, 1);}'
  +
  '#yts-article #header, #yts-article #header {border-color: #3E0707 !important;}'
  +
  '.yt-alert-actionable .yt-uix-button-alert-info:hover {background: none repeat scroll 0% 0% rgba(113, 26, 12, 1) !important;}'
  +
  '.yt-picker-hr {border-color: #4B0F0F -moz-use-text-color -moz-use-text-color !important;}'
  +
  '#page {background-color: rgba(30, 15, 15, 1);}'
  +
  '.yt-card-light, .yt-card-dark {background-color: rgba(47, 6, 6, 1);}'
  +
  '#yt-microsite .yt-card-light:hover a, #yt-microsite .yt-card-dark:hover a, .yt-creator-benefits-table:hover a {color: rgba(167, 33, 11, 1) !important;}'
  +
  '.yt-dev-demos-upload-header-container.background-color-1, .yt-dev-demo-upload-carousel-container-box, .yt-dev-demo-upload-container-box {background-color: rgba(39, 5, 7, 1) !important;}'
  +
  '.yt-dev-demos-sidebar-documentation-btn, .yt-dev-demos-sidebar-content-container {background: rgba(30, 17, 17, 1) !important;}'
  +
  '.yt-dev-demos-sidebar-title, .yt-copyright-index-anchors ul li strong a {color: rgba(164, 19, 19, 1) !important;}'
  +
  '.yt-dev-demos-sidebar-tabs-container, .yt-dev-demos-sidebar-resources-container {background-color: rgba(84, 14, 14, 1) !important;}'
  +
  '.yt-dev-demos-sidebar-tabs-container {border-bottom: 1px solid rgba(101, 18, 18, 1) !important;}'
  +
  '.yt-dev-demos-sidebar-tabs span {border-right: 1px solid rgba(129, 17, 17, 1) !important; color: #EDD !important;}'
  +
  '.yt-dev-demo-upload-question-box, .yt-dev-demo-upload-section-title, #yt-microsite-features .yt-card-light h2.yt-card-title, .yt-card-light .yt-card-title a {color: #EDD !important;}'
  +
  '.yt-dev-demos-sidebar-resources-container {border-top: 1px solid rgba(108, 13, 13, 1);}'
  +
  '.yt-dev-demos-sidebar-tabs.yt-dev-demos-sidebar-tabs-highlighted, .yt-dev-demos-sidebar-tabs.yt-dev-demos-sidebar-tabs-highlighted:hover {border-bottom: 3px solid rgba(155, 11, 11, 1) !important; background-color: rgba(122, 65, 65, 1) !important;}'
  +
  '.yt-dev-demos-sidebar {background-color: rgba(41, 20, 20, 1) !important;}'
  +
  '.yt-dev-demos-sidebar-tabs:hover {background-color: rgba(48, 29, 29, 1); border-bottom: 3px solid rgba(84, 45, 45, 1);}'
  +
  '.yt-dev-api-resources-header-container, .yt-dev-showcase-header-container, .yt-card-image-left img {opacity: .8 !important;}'
  +
  '.yt-dev-footer {background-color: rgba(29, 14, 14, 1) !important;}'
  +
  '.yt-dev-footer-cell {border-right: 1px solid rgba(57, 9, 9, 1) !important;}'
  +
  '#yt-microsite a img, .yt-card-light a img, .yt-copyright-feature-item-img {opacity: .8;}'
  +
  '.yt-press-media-card, .yt-press-index-card {border: 1px solid rgba(89, 9, 9, 1) !important; box-shadow: 0px 1px 1px rgba(69, 28, 28, 1) !important;}'
  +
  '.yt-microsite-feature-item h3 a, .account-section a {color: #A5280D !important;}'
  +
  '#yt-microsite-features .yt-microsite-framed {box-shadow: 0px 1px 1px rgba(42, 14, 14, 1) !important;}'
  +
  '.yt-cardified #page {background-color: rgba(27, 18, 18, 1) !important;}'
  +
  '#yt-microsite .yt-card-light .yt-card-title h2, #yt-microsite .yt-card-light h2.yt-card-title {color: #EDD !important;}'
  +
  '.yt-creators-home-hero, .yt-creators-programs-tools-header-container, .yt-creators-support-header-container, .yt-creators-creator-benefits-header-container {opacity: 0.8 !important;}'
  +
  '.yt-card-full-bleed-image, #yt-creators-home-working-together-swiffy div {opacity: .72 !important;}'
  +
  '.yt-creators-new-footer-container, .yt-creators-new-footer {background-color: rgba(29, 15, 15, 1) !important;}'
  +
  '.yt-creators-creator-benefits-table-status-verified-channels {background-color: rgba(78, 17, 17, 1) !important;}'
  +
  '.yt-creators-creator-benefits-table tr > td {border-bottom: 1px solid rgba(86, 26, 26, 1) !important;}'
  +
  '.yt-creators-creator-benefits-table-wwg-header, #yt-microsite .yt-card-light, .yt-card-light .yt-card-title a, #yt-microsite-header p, ol.yt, ul.yt, .yt-text ol, .yt-text ul, #yt-microsite-features .yt-press-media-card .yt-card-text p, #yt-microsite-features .yt-card-light a {color: #EDD !important;}'
  +
  '.yt-microsite-features h2 a, .yt-press-campaigns-content h2 a, .yt-microsite-features p a, .yt-press-campaigns-content p a, .yt-text ul li a {color: rgba(150, 33, 19, 1) !important;}'
  +
  'h1.yt, h2.yt, h3.yt, .yt-text h1, .yt-text h2, .yt-text h3 {text-shadow: 0px 0px 0px transparent, 0px 1px 1px rgba(78, 20, 20, 1) !important; color: rgba(150, 33, 19, 1) !important;}'
  +
  '.ytg-box p a, .ytg-box h2, #article-container p a, #article-container h2, #article-container h4, .disc li a, .proflink, .empty-upsell-messages p a {color: rgba(174, 39, 16, 1) !important;}'
  +
  '#page ol.upper-alpha, #article-container p, #yts-nav .indented .sub-level a, .disc li, .arrowHead, .d-A, .d-Kl, .creator-sidebar-section h3, h3.account-section-header, .account-ad-preferences-list li, .account-section-setting, .account-section {color: #EDD !important;}'
  +
  '#yts-nav {border-right: 1px solid #3E0707 !important;}'
  +
  '.separator {border-top: 1px solid rgba(96, 25, 25, 1); border-color: rgba(83, 14, 14, 1) !important;}'
  +
  '#yts-article .with-separator {border-top: 1px solid #530E0E !important;}'
  +
  '.yt-uix-button-subscribed-branded {border: 1px solid rgba(113, 12, 12, 1) !important; background-color: rgba(89, 17, 17, 1) !important;}'
  +
  '.d-y-r-c {border: 1px solid rgba(86, 11, 11, 1) !important;}'
  +
  '.d-r {background: none repeat scroll 0% 0% rgba(89, 30, 30, 1) !imporant; border: 1px solid rgba(93, 12, 12, 0.2) !important;}'
  +
  '.d-A-yb {background-color: rgba(78, 17, 17, 1) !important;}'
  +
  '#watch7-creator-bar {border: 1px solid rgba(114, 19, 19, 1) !important; background: none repeat scroll 0% 0% rgba(95, 14, 14, 1) !important;}'
  +
  '.pl-video, .yt-uix-tile, .yt-uix-dragdrop-draggable-item {border-bottom: 1px solid #4B0F0F !important;}'
  +
  '.pl-header-inlineedit .c4-module-is-editable:hover, .pl-header-inlineedit .c4-module-is-editable {background-color: #1B1715 !important; color: #EDD !important;}'
  +
  '.account-container {background: none repeat scroll 0% 0% rgba(53, 13, 13, 1);}'
  +
  '.yt-uix-form-input-radio-element, .yt-uix-form-input-checkbox-element {border: 1px solid rgba(90, 14, 14, 1) !important;}'
  +
  '#footer-links-secondary a:hover, #footer-links-primary a:hover, #masthead-search.consolidated-form input, .empty-upsell-messages h2, .empty-upsell-messages p {color: #EDD !important;}'
  +
  '.feed-author-bubble {opacity: .65;}'
  +
  '.feed-item-container.legacy-style .feed-item-main {border-bottom: 1px solid #4B1111 !important;}'
  +
  '.guide-flyout {border: 1px solid rgba(105, 14, 14, 1) !important; box-shadow: 5px 10px 15px 5px rgba(98, 27, 27, 0.25) !important;}'
  +
  '.feed-item-container .feed-item-main, .yt-lockup-meta, .yt-lockup-description, .overlay-confirmation-display-name, .checkbox-label {color: #EDD !important;}'
  +
  '.yt-ui-ellipsis {background-color: #1A1111 !important;}'
  +
  '.yt-uix-overlay-primary .yt-dialog-header {background-color: #541111;}'
  +
  '.yt-uix-overlay-actions {background: none repeat scroll 0% 0% rgba(45, 21, 21, 1) !important;}'
  +
  '#c4-header-bg-container {opacity: .72;}'
  +
  '#ytf-conf-dialog {background-color: rgba(41, 14, 14, 1) !important; color: #EDD !important;}'
  +
  '#ytf-conf-dialog input, #ytf-conf-dialog button, #ytf-conf-video-size-sel, #ytf-conf-remove-disable-sel, #ytf-conf-default-video-quality-sel, .yt-uix-simple-thumb-wrap img, .yt-uix-simple-thumb-related img {opacity: .8;}'
  +
  '#watch-appbar-playlist:not(.watch-queue-nav) .playlist-videos-list > li.currently-playing .yt-ui-ellipsis {background-color: #3A3A3A !important;}'
  +
  '#watch-appbar-playlist .playlist-videos-list .yt-ui-ellipsis {background-color: #222222 !important;}'
  +
  '#watch-appbar-playlist .playlist-videos-list > li:hover {background-color: #525252 !important;}'
  +
  '.yt-scrollable-text-container {background: none repeat scroll 0% 0% rgba(41, 31, 31, 1) !important; border: 1px solid rgba(110, 23, 23, 1) !important;}'
  +
  '.no-adsense .yt-dialog-fg-content, .yt-scrollable-text-container, .terms-of-agreement-within-overlay, .yt-dialog-fg-content, .yt-uix-overlay-fg-content {color: #EDD !important;}'
  +
  '.yt-scrollable-text-container a, .terms-of-agreement-within-overlay a, .no-adsense-review-disclaimer a, .upload-failure a, .hid a {color: #B3200F !important;}'
  +
  '.yt-uix-button-primary, .yt-uix-button-primary[disabled], .yt-uix-button-primary[disabled]:hover, .yt-uix-button-primary[disabled]:active, .yt-uix-button-primary[disabled]:focus {border-color: rgba(129, 24, 7, 1) !important; background: none repeat scroll 0% 0% rgba(150, 35, 16, 1) !important;}'
  +
  '.no-adsense .overlay-content-container {border-bottom: 1px solid rgba(84, 20, 20, 1) !important; border-color: #541414 !important;}'
  +
  '.upload-item {border: 1px solid rgba(93, 12, 12, 1) !important;}'
  +
  '.upload-thumb {border: 1px solid rgba(89, 9, 9, 1) !important; background: none repeat scroll 0% 0% rgba(54, 13, 13, 1) !important;}'
  +
  '.metadata-editor-container .video-settings-form {background: none repeat scroll 0% 0% #1A1111 !important;}'
  +
  '.metadata-editor-container .subnav {border-bottom: 1px solid rgba(65, 10, 10, 1) !important;}'
  +
  '.progress-bar-uploading .progress-bar-progress {border: 1px solid #6F261A !important; opacity: .8 !important;}'
  +
  '.progress-bar-background {border: 1px solid rgba(110, 20, 20, 1) !important;}'
  +
  '.upload-time-remaining, .yt-alert-message, .yt-uix-form-input-select, .yt-uix-form-input-select:focus {color: #EDD !important;}'
  +
  '.yt-uix-form-input-select {background-color: rgba(110, 25, 25, 1) !important; background-image: linear-gradient(to bottom, rgba(113, 11, 11, 1) 0px, rgba(86, 14, 14, 1) 100%) !important;}'
  +
  '.yt-uix-form-input-select, .yt-uix-form-input-text, .yt-uix-form-input-textarea {border: 1px solid rgba(113, 11, 11, 1) !important;}'
  +
  '.video-settings-add-tag {background: #241919 !important; color: #EDD !important;}'
  +
  '#yt-masthead-user .sb-notif-on .yt-uix-button-content {border-bottom: 1px solid rgba(80, 19, 19, 1) !important; border-left: 1px solid rgba(84, 30, 30, 1) !important; background: none repeat scroll 0% 0% rgba(161, 28, 15, 1) !important;}'
  +
  '.progress-bar-text, .upload-item-sidebar-text h3, .watch-page-link a, .vm-search-history-info a, #creator-subheader h3, #creator-subheader a, #creator-subheader h3 a, #creator-subheader .vm-separator, .account-features-content a, #verify-phone-page h3, #verify-phone-page a, #verify-phone-page p a, #main-title, .GCJJMQ4DK5, .gwt-InlineLabel, .GCJJMQ4DLQ, .GCJJMQ4DH4 a, .GCJJMQ4DFJ a {color: #A43330 !important;}'
  +
  '.progress-bar-processing {background-color: rgba(173, 64, 41, 1) !important;}'
  +
  '.progress-bar-text, .progress-bar-text-done, .progress-bar-text-upload-queued, .yt-uix-form-input-text, .yt-uix-clickcard-card-body, .yt-uix-hovercard-card-body, .tabs .tab-header.selected a, .tabs .tab-header a:hover, .tabs .tab-header:hover a, .tabs .tab-header a:focus, .metadata-container h4, .vm-confirmation-overlay .vm-video-actions-delete-warning, .yt-badge, .vm-processing-progress-message, .yt-uix-form-legend, .yt-uix-form-label, #verify-phone-page, #verify-phone-page p, .yt-default ol, .yt-default ul, #main-description {color: #EDD !important;}'
  +
  '.sharing-balloon:after, .sharing-balloon:before {border-right: 11px solid rgba(89, 18, 18, 1) !important;}'
  +
  '.sharing-balloon {border: 1px solid rgba(17, 7, 7, 0) !important;}'
  +
  '.progress-bar-text {text-shadow: 2px 2px 2px 2px #622 !important;}'
  +
  '.menu-item-top-divider {border-top: 1px solid rgba(57, 5, 5, 1) !important;}'
  +
  '.vm-confirmation-overlay .vm-confirmation-overlay-header {border-bottom: 1px solid rgba(69, 19, 19, 1) !important; background-image: linear-gradient(to bottom, rgba(69, 8, 8, 1) 0px, rgba(59, 17, 17, 1) 100%) !important;}'
  +
  '.vm-video-item-content {background: rgba(48, 26, 26, 1) !important;}'
  +
  '.vm-list-view .vm-video-title .vm-video-privacy-draft-badge, .ng-scope {color: #EDD !important; background-color: rgba(141, 11, 11, 1) !important;}'
  +
  '.yt-badge {border: 1px solid rgba(98, 27, 27, 1) !important;}'
  +
  '.advanced-search-footer {background: none repeat scroll 0% 0% rgba(27, 9, 9, 1) !important;}'
  +
  '.vm-beauty-view .vm-video-item-content {box-shadow: 0px 2px 5px rgba(60, 17, 17, 1) !important;}'
  +
  '.vm-beauty-view .vm-video-item:hover .vm-video-item-content {box-shadow: 0px 2px 5px rgba(12, 1, 1, 1) !important;}'
  +
  '.yt-sprite {opacity: .8;}'
  +
  '.account-features-content {color: #EDD !important;}'
  +
  '.account-features-list tr {border-bottom: 1px solid #380808 !important;}'
  +
  '#verify-phone-page {border-color: -moz-use-text-color rgba(74, 7, 7, 1) rgba(27, 5, 5, 1) !important;}'
  +
  '.tabbed-page .tabs-area {border-bottom: 1px solid #3E1616 !important;}'
  +
  '.tabbed-page .tab.active {border-top: 3px solid rgba(150, 16, 20, 1) !important; border-bottom: 1px solid rgba(113, 32, 32, 1) !important; background-color: rgba(63, 43, 43, 1) !important; color: #EDD !important;}'
  +
  '.tabbed-page .tab {border-top: 1px solid rgba(132, 16, 16, 1) !important; border-right: 1px solid rgba(126, 23, 23, 1) !important; border-bottom: 1px solid rgba(69, 9, 9, 1); background-color: rgba(57, 29, 29, 1) !important; color: #EDD !important;}'
  +
  '.tabbed-page .tabs-wrapper {border-left: 1px solid rgba(101, 24, 24, 1) !important;}'
  +
  '.track-list li.track {background-color: rgba(44, 15, 15, 1) !important; border-bottom: 1px solid rgba(78, 18, 18, 1);}'
  +
  '.audiolibrary-column-title, .audiolibrary-column-title-expand, .GCJJMQ4DIV .GCJJMQ4DJV, .GCJJMQ4DOP, input.GCJJMQ4DIGB, .GCJJMQ4DOR, .GCJJMQ4DJS, .GCJJMQ4DK3 .GCJJMQ4DH4, .GCJJMQ4DO3 div span {color: #EDD !important;}'
  +
  '.top-menu {border-bottom: 1px solid rgba(83, 14, 14, 1) !important;}'
  +
  '.track-list li.track:hover {background-color: rgba(71, 15, 15, 1) !important;}'
  +
  '.GCJJMQ4DDLB, .GCJJMQ4DFLB, .GCJJMQ4DI3, .GCJJMQ4DD3 {background: rgba(57, 28, 28, 1) !important;}'
  +
  '.GCJJMQ4DAMB, .GCJJMQ4DIJ {border-top: 1px solid rgba(104, 25, 25, 1) !important;}'
  +
  '.GCJJMQ4DKQ {border-top: 1px solid #681919 !important;}'
  +
  '.GCJJMQ4DKLB {border-bottom: 1px solid #681919 !important;}'
  +
  '.GCJJMQ4DOS {border-right: 1px solid rgba(126, 19, 19, 1) !important; border-left: 1px solid rgba(36, 7, 7, 1) !important;}'
  +
  '.GCJJMQ4DI3 tr:nth-child(2n) {background-color: rgba(72, 15, 15, 1) !important;}'
  +
  '.GCJJMQ4DI3 td, .GCJJMQ4DD3 td {border-bottom: 1px solid rgba(83, 19, 19, 1) !important;}'
  +
  '.GCJJMQ4DGQ {background-color: rgba(68, 10, 10, 1) !important;}'
  +
  '.GCJJMQ4DGQ:hover, .GCJJMQ4DDR:hover, .GCJJMQ4DDR, .GCJJMQ4DDR, .GCJJMQ4DNP, .GCJJMQ4DAR, .GCJJMQ4DPP, .GCJJMQ4DGQ {background-color: rgba(52, 7, 7, 1) !important;}'
  +
  '.GCJJMQ4DAIB {background: none repeat scroll 0% 0% #391C1C !important;}'
  +
  '.GCJJMQ4DHQ .GCJJMQ4DHIB .GCJJMQ4DFIB {color: rgba(165, 33, 28, 1) !important;}'
  +
  '.GCJJMQ4DIGB, .GCJJMQ4DBDB, .GCJJMQ4DBEB, .GCJJMQ4DCEB, .GCJJMQ4DBDB:focus, .GCJJMQ4DBEB:focus, .GCJJMQ4DCEB:focus {border-right: 1px solid rgba(152, 24, 24, 1) !important; border-color: rgba(141, 19, 19, 1) rgba(165, 23, 23, 1) rgba(141, 27, 27, 1) !important; background: rgba(68, 52, 52, 1) !important; color: #EDD !important; text-shadow: none !important;}'
  +
  '.GCJJMQ4DDR:hover .GCJJMQ4DOS, .GCJJMQ4DDR:active .GCJJMQ4DOS {border-top: 1px solid rgba(81, 14, 14, 1) !important; background-color: rgba(101, 26, 26, 1) !important;}'
  +
  '.GCJJMQ4DMO {border-top: 1px solid rgba(108, 11, 11, 1) !important;}'
  +
  '.GCJJMQ4DHN .GCJJMQ4DMN, .GCJJMQ4DLU, .GCJJMQ4DMU, .GCJJMQ4DNHB, .GCJJMQ4DNU div {color: #EDD !important;}'
  +
  '.GCJJMQ4DDN:first-child {border-right: 1px solid rgba(101, 17, 17, 1) !important;}'
  +
  '.GCJJMQ4DON {opacity: .62;}'
  +
  '.GCJJMQ4DIHB {border: 1px solid rgba(62, 12, 12, 1) !important; background: none repeat scroll 0% 0% rgba(38, 20, 20, 1) !important;}'
  +
  '.GCJJMQ4DPHB {border-top: 1px solid rgba(74, 12, 12, 1) !important;}'
  +
  '.GCJJMQ4DFU {border-top: 1px solid rgba(99, 12, 12, 1) !important; background-image: linear-gradient(-90deg, rgba(60, 22, 22, 1) 0%, rgba(32, 21, 21, 1) 100%) !important;}'
  +
  '.GCJJMQ4DEU {border-bottom: 1px solid rgba(68, 24, 24, 1) !important; background-color: rgba(51, 31, 31, 1) !important;}'
  +
  '.GCJJMQ4DAU {border-top: 1px solid rgba(48, 13, 13, 1) !important;}'
  +
  '.GCJJMQ4DLW li.GCJJMQ4DMW {box-shadow: 0px 1px 2px rgba(47, 8, 8, 0.3) inset !important; background-color: rgba(108, 17, 17, 1) !important;}'
  +
  '.GCJJMQ4DLW li {background-color: rgba(77, 25, 25, 1) !important; border-bottom: 1px solid rgba(45, 29, 29, 1) !important; border-right: 1px solid rgba(119, 13, 13, 1) !important;}'
  +
  '.GCJJMQ4DLW {background-color: #331F1F !important; border-right: 1px solid rgba(80, 18, 18, 1) !important;}'
  +
  '.GCJJMQ4DBU {background-color: #331F1F !important;}'
  +
  '.GCJJMQ4DJMB {opacity: .8 !important;}'
  +
  '.GCJJMQ4DLMB {opacity: .75 !important;}'
  +
  '.GCJJMQ4DI3 .GCJJMQ4DP3 td {background: none repeat scroll 0% 0% #270B0B !important;}'
  +
  '.GCJJMQ4DI3 td.GCJJMQ4DE4 td, .GCJJMQ4DD3 td.GCJJMQ4DE4 td, .tabbed-page .tab.active .title, .tabbed-page .tab .title, .display-mode-text {color: #EDD !important;}'
  +
  '.GCJJMQ4DLW li:hover {background-image: -moz-linear-gradient(center top , rgba(152, 30, 30, 1) 0px, rgba(129, 19, 19, 1) 100%) !important;}'
  +
  '.GCJJMQ4DBDB:focus, .GCJJMQ4DBEB:focus, .GCJJMQ4DCEB:focus {box-shadow: 0px 0px 5px rgba(183, 80, 63, 0.5), 0px 0px 10px rgba(116, 17, 17, 1) inset !important;}'
  +
  '.GCJJMQ4DFK {color: rgba(171, 36, 14, 1) !important;}'
  +
  '.GCJJMQ4DFX .datePickerMonthSelector {background-color: #261414 !important;}'
  +
  '.GCJJMQ4DFX {color: #EDD !important; border-left: 1px solid rgba(120, 22, 22, 1) !important; border-right: 1px solid rgba(137, 21, 21, 1) !important; border-bottom: 1px solid rgba(90, 15, 15, 1) !important;}'
  +
  '.GCJJMQ4DFX .datePickerDayIsWeekend {background-color: rgba(77, 32, 32, 1) !important;}'
  +
  '.GCJJMQ4DFX .datePickerWeekdayLabel, .GCJJMQ4DFX .datePickerWeekendLabel {background-color: rgba(104, 8, 8, 1) !important; border-bottom: 1px solid rgba(69, 12, 12, 1) !important;}'
  +
  '.GCJJMQ4DPDB {color: #EDD !important; background-color: rgba(140, 34, 11, 1) !important; border-color: rgba(120, 26, 11, 1) !important; background-image: linear-gradient(to bottom, rgba(140, 35, 17, 1) 0px, rgba(114, 32, 19, 1) 100%) !important;}'
  +
  '.GCJJMQ4DFX .datePickerDayIsValue {background-color: rgba(173, 47, 26, 1) !important; box-shadow: 0px 1px 2px rgba(119, 27, 27, 1) inset !important;}'
  +
  '.comments .comment-item .user-photo {background-color: rgba(38, 15, 15, 1) !important;}'
  +
  '.user-photo a img {opacity: .8 !important;}'
  +
  '.comments .comment-entry:hover .thumb-title, .comments .comment-entry:hover .vis-inspect-link, .comments .comment-footer-action, .ytcb-text a, .queue-footer-helptext a {color: rgba(189, 40, 15, 1) !important;}'
  +
  '.yt-commentbox-text {border: 1px solid rgba(99, 19, 19, 1) !important; background-color: rgba(60, 16, 16, 1) !important;}'
  +
  '.tabbed-page .options-bar {border-bottom: 1px solid rgba(56, 9, 9, 1) !important;}'
  +
  '.video-dds .topline {background-color: #3C1010 !important;}'
  +
  '.video-dds {border: 1px solid #631313 !important;}'
  +
  '.comments .comment-item:hover .mod-buttonbar, .comments .comment-item:hover .mod-buttonbar .mod-button {border-color: rgba(86, 18, 18, 1) !important; color: #EDD !important; background: #433 !important;}'
  +
  '.commenthub .comments .mod-buttonbar .mod-button-content:hover {background-color: rgba(101, 11, 11, 1) !important;}'
  +
  '.yt-uix-button-menu li.yt-uix-button-menu-new-section-separator {border-top: 1px solid rgba(113, 20, 20, 1) !important;}'
  +
  '.Rzc {background-color: #590C0C !important;}'
  +
  '.video-dds .list {background-color: rgba(45, 18, 18, 1) !important; border: 1px solid rgba(95, 15, 15, 1) !important;}'
  +
  '.video-dds .entry:hover .highlight {background-color: rgba(78, 8, 8, 1) !important;}'
  +
  '#body-container #footer-container {margin-top: -191px !important; height: 200px !important;}'
  +
  '#identity-prompt-lb #button-container {background-color: rgba(56, 11, 11, 1) !important;}'
  +
  '#identity-prompt-lb #identity-prompt-account-list li {border-bottom: 1px solid rgba(120, 14, 14, 1) !important;}'
  +
  '.identity-prompt-account-public-name, .signin-card #reauthEmail, .banner h2, .banner h1 {color: #EDD !important;}'
  +
  '.wrapper .google-footer-bar {border-top: 1px solid rgba(77, 21, 21, 1) !important;}'
  +
  '.wrapper .content .card {background-color: rgba(69, 9, 9, 1);}'
  +
  '.wrapper input[type="email"]:focus, .wrapper input[type="number"]:focus, .wrapper input[type="password"]:focus, .wrapper input[type="tel"]:focus, .wrapper input[type="text"]:focus, .wrapper input[type="url"]:focus, .signin-card #Passwd, .signin-card #Passwd:focus {border: 1px solid rgba(167, 37, 16, 1) !important; background: #422 !important; color: #EDD !important;}'
  +
  '.need-help, #account-chooser-link {color: rgba(188, 38, 13, 1) !important;}'
  +
  '.rc-button-submit, .rc-button-submit:visited {border: 1px solid rgba(158, 30, 10, 1) !important; color: #EDD !important; background-color: rgba(149, 30, 16, 1) !important; background-image: -moz-linear-gradient(center top , rgba(165, 31, 9, 1), rgba(129, 26, 9, 1)) !important;}'
  +
  '.search-header {border-bottom: 1px solid #591515 !important;}'
  +
  '.yt-lockup-playlist-item {border-bottom: 1px solid rgba(74, 23, 23, 1) !important;}'
  +
  '.gssb_m {background: none repeat scroll 0% 0% #422D2D !important; color: #EDD;}'
  +
  '.gssb_e {border-color: rgba(102, 13, 13, 1) rgba(134, 13, 13, 1) rgba(66, 13, 13, 1) !important; color: #EDD !important;}'
  +
  '.gssb_i, .gssb_a, .gsfs, .gssb_i:hover {background: #722F2D !important; color: #EDD !important;}'
  +
  '.gssb_m tbody tr {color: #EDD !important;}'
  +
  '.search-exploratory-line {border-top: 1px solid #4B0F0F !important;}'
  +
  '.yt-alert-actionable.yt-alert-warn, .yt-alert-default.yt-alert-warn, .yt-alert-naked.yt-alert-warn .yt-alert-icon, .yt-alert-small.yt-alert-warn {background-color: rgba(99, 26, 14, 1) !important;}'
  +
  '.gssb_i td {background: none repeat scroll 0% 0% rgba(153, 24, 24, 1) !important;}'
  +
  '.yt-channel-msg-dialog .yt-dialog-footer {background-color: rgba(41, 18, 18, 1) !important;}'
  +
  '.all-comments, .all-comments a {background-color: #1A1111 !important;}'
  +
  '#yt-comments-sb-standin .box {border-color: rgba(75, 6, 6, 1) rgba(69, 5, 5, 1) rgba(63, 5, 5, 1) !important; background-color: #1E0F0F !important;}'
  +
  '#yt-comments-sb-standin .callout-inner {border: 7px solid #1A1111 !important;}'
  +
  '#yt-comments-sb-standin .callout-outer {border: 6px solid #1A1111 !important;}'
  +
  '.videoblocker-inner {background: rgba(56, 10, 10, 1) !important;}'
  +
  '.videoblocker-inner hr {background-color: #000 !important; border: 1px solid rgba(80, 8, 8, 1) !important;}'
  +
  'p img.screenshot {border: 1px solid rgba(107, 21, 21, 1) !important; opacity: .8 !important;}'
  +
  '.comments .paginator {background-color: rgba(83, 13, 13, 1) !important; border: 1px solid rgba(77, 8, 8, 1) !important; background-image: linear-gradient(to top, rgba(83, 7, 7, 1) 0px, rgba(111, 6, 6, 1) 100%) !important; color: #EDD !important;}'
  +
  '.comments .paginator:hover {background-color: rgba(123, 13, 13, 1) !important; border-color: rgba(98, 10, 10, 1) !important; background-image: linear-gradient(to top, rgba(120, 8, 8, 1) 0px, rgba(143, 22, 22, 1) 100%) !important;}'
  +
  '.compact-shelf .yt-uix-button-shelf-slider-pager {background: none repeat scroll 0% 0% rgba(140, 22, 22, 1) !important;}'
  +
  '.browse-list-item-container:hover .compact-shelf .yt-uix-button-shelf-slider-pager, .compact-shelf:hover .yt-uix-button-shelf-slider-pager {border: 1px solid rgba(147, 17, 17, 1) !important;}'
  +
  '.yt-commentbox-text, .yt-simplebox-text {border: 1px solid #531717 !important; background-color: #360F0E !important;}'
  +
  '.yt-commentbox-arrow-inner, .yt-simplebox-arrow-inner, .yt-commentbox-arrow-outer, .yt-simplebox-arrow-outer {border-color: #681212 #540F0F transparent transparent !important;}'
  +
  '.yt-commentbox-text {color: #EDD !important;}'
  +
  '#creator-sidebar .creator-sidebar-branding h1 {color: #DDCFCF !important;}'
  +
  '.vm-list-view .vm-video-list .vm-video-item, .vm-list-view .vm-video-item-content-horizontal-divider {background: #531515 !important;}'
  +
  '.vm-list-view .vm-video-side-view-count a {color: #DDCFCF !important;}'
  +
  '.yt-ui-menu-content .yt-ui-menu-item.menu-subheading, .yt-ui-menu-content .yt-ui-menu-item.menu-subheading-notice {background: #302222 !important;}'
  +
  '.creator-editor-content {background: #361717 !important;}'
  +
  '.creator-editor-header {border-bottom: 1px solid #5A2F2F !important;}'
  +
  '.creator-editor-nav {border-bottom: 1px solid #451919 !important; background: #471010 !important;}'
  +
  '#creator-editor-container {background: #361717 !important;}'
  +
  '.yt-uix-form-input-textarea, .video-settings-description, #audio-ui {color: #EDD !important;}'
  +
  '#player-and-info-pane #video-info dd, .single-field, .metadata-container h3 {color: #EDD !important;}'
  +
  '#player-and-info-pane #video-info h2, #player-and-info-pane #video-info dt {color: #D54545 !important;}'
  +
  '.creator-editor-nav-tabs li a, .creator-editor-title a, .annotator-clickcard-item .annotator-clickcard-title, .timeline-ruler .rulabel {color: #EDD !important;}'
  +
  '#player-and-info-pane #video-info dt {color: #B90909 !important;}'
  +
  '.metadata-user-warning a, .learn-annotations a, .annotator-learn-more-container a {color: rgb(198, 22, 22) !important;}'
  +
  '.translation-editor-header .translation-editor-column-half, .translation-editor-header .translation-editor-column-divider {border-bottom: 1px solid #351D1D !important;}'
  +
  '.creator-editor-content #inline-editor-header {border-bottom: 1px solid #622727 !important;}'
  +
  '#featured-tracks-header {border-color: #631313 !important; background: #630E0E !important;}'
  +
  '.audio-ui-featured-row {border: 1px solid #602A2A !important; box-shadow: 0px 1px 0px #301010 !important;}'
  +
  '.audio-ui-featured-row:hover {background-color: #4B1414 !important;}'
  +
  '#audio-ui-search-input-field {background-color: #721414 !important; border: 1px solid #841A1A !important;}'
  +
  '.audio-ui-featured-tracks-header-title p.header-subtitle {color: #DA5656 !important;}'
  +
  '#audio-ui-pagefold {border-top: 1px solid #923030 !important; border-bottom: 1px solid #3C1919 !important;}'
  +
  '.audio-ui-featured-row-len span {background-color: #8C1515 !important;}'
  +
  '#audio-ui-selection {border: 1px solid #862222 !important; background-color: #721414 !important;}'
  +
  '#audio-ui-mixer .slider-readout {color: #E3D2D2 !important;}'
  +
  '#annotator-div {background: #361717 !important; border: 1px solid #541111 !important;}'
  +
  '.timeline-playhead .timeline-playhead-line {border-left: 1px solid #892A2A !important; border-right: 1px solid rgba(74, 23, 23, 0.3) !important;}'
  +
  '#annotator-add-div, #annotator-select-div {border-bottom: 1px solid #712B2B !important;}'
  +
  '#annotator-select-menu tr.yt-uix-button-menu-item {background-color: #6E1515 !important;}'
  +
  '#annotator-select-menu .yt-uix-button-menu-item td {border-bottom: 1px solid #360909 !important;}'
  +
  '.tab-container {border-bottom: 1px solid #6E2828 !important;}'
  +
  '.annotator-clickcard-item {border-bottom: 1px solid #511A1A !important;}'
  +
  '.multitrack-timeline {background-color: #241414 !important;}'
  +
  '.timeline-row {background-color: #3F1717 !important;}'
  +
  '.timeline-ruler .stick {background-color: #7E2525 !important;}'
  +
  '.timeline-ruler .hline, .timeline-ruler .mtick {background-color: #801919 !important;}'
  +
  '.timeline-playhead .timeline-playhead-line {background-color: #B31D12 !important;}'
  +
  '.timeline-playhead .timeline-playhead-time {background-color: #B31812 !important;}'
  +
  '.timeline-playhead .timeline-playhead-thumb {background: rgba(0,0,0,0) !important;}'
  +
  '.yt-default p, p.yt {color: #D73030 !important;}'
  +
  '.yt-uix-languagepicker-search-container {border-top: 1px solid #692929 !important;}'
  +
  '.timedtext-content {background-color: #630E0E !important;}'
  +
  '#add-captions-section {border-bottom: 1px solid #441616 !important;}'
  +
  '#video-settings-section {border-top: 1px solid #3E0F0F !important;}'
  +
  '#video-settings-section, .select-method-instructions h4, .comment-renderer-text-content {color: #EDD !important;}'
  +
  '#video-settings-audio-language, #timedtext-feedback-button {color: #C62216 !important;}'
  +
  '#bottom-notes-section {border-top: 1px solid #6E1818 !important;}'
  +
  '.pl-video-list-editable .pl-video:hover .pl-video-handle, .yt-uix-dragdrop-cursor-follower .pl-video-handle {background: #5D1616 !important; border-left: 1px solid #3E1010 !important; border-right: 1px solid #360E0E !important;}'
  +
  '.about-description-editor .c4-module-is-editable:hover, .about-business-email-editor .c4-module-is-editable:hover, .about-metadata-editor .c4-module-is-editable:hover {background-color: #350E0E !important; color: #EDD !important;}'
  +
  '.about-description, .about-metadata-label span, .business-email-label, .country-label, .about-metadata-label span {color: #EDD !important;}'
  +
  '.about-metadata-label-border-top {border-top: 1px solid #4D1616 !important;}'
  +
  '.comment-simplebox-renderer-collapsed-content {border-color: #5C1212 #501414 #571414 !important;}'
  +
  '.comment-simplebox-arrow .arrow-inner {border: 7px solid #5D0F0F !important;}'
  +
  '.comment-simplebox-arrow .arrow-outer {border: 6px solid #5D1818 !important;}'
  +
  '.comment-simplebox-renderer {border-bottom: 1px solid #3E1A1A !important;}'
  +
  '.comment-section-header-renderer {color: #BF1D1D !important;}'
  +
  '.PNL6KCC-b-a {background: #351818 !important;}'
  +
  '.PNL6KCC-a-a {background: #290E0E !important;}'
  +
  '.PNL6KCC-b-d {background-color: #290E0E !important;}'
  +
  '.PNL6KCC-t-a {border-bottom: 1px solid #541C1C !important;}'
  +
  'input.PNL6KCC-l-f {border-color: #712121 #692525 #6E2727 !important; background: #682828 !important; color: #EDD !important;}'
  +
  'input.PNL6KCC-l-f:focus, input.PNL6KCC-l-f:active {border-color: #B92B2B #991D1D #A72424 !important;}'
  +
  '.PNL6KCC-ab-c {border: 1px solid #6C1818 !important; background: #471B1B !important;}'
  +
  '.PNL6KCC-ab-a:first-child > ul {border-right: 1px solid #7A2121 !important;}'
  +
  '.PNL6KCC-r-h {border-top: 1px solid #2A1616 !important;}'
  +
  '.PNL6KCC-r-f, .PNL6KCC-T-s .PNL6KCC-T-B, .PNL6KCC-T-w, .PNL6KCC-T-b, .PNL6KCC-T-l .PNL6KCC-f-c:hover .PNL6KCC-f-f, .PNL6KCC-T-l .PNL6KCC-f-h .PNL6KCC-f-f {color: #EDD !important;}'
  +
  '.PNL6KCC-r-e {background: #5F1919 !important;}'
  +
  '.PNL6KCC-T-C .PNL6KCC-T-x {border-bottom: 1px solid #5A1717 !important;}'
  +
  '.PNL6KCC-T-m {border-top: 1px solid #3E1919 !important;}'
  +
  '.PNL6KCC-T-x, .PNL6KCC-T-c {border-color: transparent #5D1717 !important; background: #321A1A !important;}'
  +
  '.PNL6KCC-T-z {border-right: 1px solid #5F1B1B !important;}'
  +
  '.PNL6KCC-T-D {background: #321111 !important;}'
  +
  '.PNL6KCC-f-a {background: #8F2121 !important;}'
  +
  '.PNL6KCC-Y-n th, .PNL6KCC-Y-n td, .PNL6KCC-Y-c th, .PNL6KCC-Y-c td {border-bottom: 1px solid #7B1A1A !important;}'
  +
  '.PNL6KCC-Y-y.PNL6KCC-Y-D, .PNL6KCC-Y-D, .PNL6KCC-Y-C, .PNL6KCC-Y-a, .PNL6KCC-Y-u, .PNL6KCC-Y-a, .PNL6KCC-Y-C {background: #511919 !important;}'
  +
  '.PNL6KCC-Eb-b {background: #271717 !important;}'
  +
  '.PNL6KCC-Y-p .PNL6KCC-Y-E, .PNL6KCC-b-c a, .PNL6KCC-b-c, .PNL6KCC-M-n, .PNL6KCC-M-p {Color: #EDD !important;}'
  +
  '.PNL6KCC-T-e, .PNL6KCC-T-o:hover {color: #BC3030 !important;}'
  +
  '.PNL6KCC-eb-e .PNL6KCC-a-a {border-top: 1px solid rgb(38, 12, 12) !important;}'
  +
  '.PNL6KCC-g-f.PNL6KCC-g-y {border-color: #441616 !important; background-color: #501111 !important;}'
  +
  '.PNL6KCC-g-v:hover, .PNL6KCC-g-f:hover, .PNL6KCC-g-w:hover {background-image: -moz-linear-gradient(center top , #B62525 0px, #6F0F0F 100%) !important; border-color: #591111 !important;}'
  +
  '.PNL6KCC-g-f:focus, .PNL6KCC-g-v:focus, .PNL6KCC-g-w:focus {border-color: #C63929 !important; box-shadow: 0px 0px 5px rgba(179, 61, 41, 0.5), 0px 0px 10px #8D2020 inset !important;}'
  +
  '.PNL6KCC-g-f {border-color: #780A0A !important; background-image: -moz-linear-gradient(center top , #9B2828 0px, #751111 100%) !important; color: #EDD !important;}'
  +
  '.PNL6KCC-eb-e, .PNL6KCC-a-a {border-top: 1px solid rgb(24, 5, 5) !important;}'
  +
  '.PNL6KCC-kb-a {background-color: #391F1F !important; border-right: 1px solid #692121 !important;}'
  +
  '.PNL6KCC-M-i {border-top: 1px solid #5C1D1D !important; background-color: #2A0E0E !important; background-image: linear-gradient(-90deg, #390E0E 0%, #441313 100%) !important;}'
  +
  '.PNL6KCC-N-a {border-top: 1px solid #5A0F0F !important;}'
  +
  '.PNL6KCC-M-j.PNL6KCC-g-y, .PNL6KCC-M-j.PNL6KCC-g-y:hover {background-color: #661414 !important;}'
  +
  '.PNL6KCC-M-j:hover {background-color: #771818 !important; background-image: linear-gradient(-180deg, #2C1515 0%, #2C1111 100%) !important;}'
  +
  '.PNL6KCC-M-j {border-right: 1px solid #5F1D1D !important;}'
  +
  '.PNL6KCC-N-e {border-bottom: 1px solid #571A1A !important;}'
  +
  '.PNL6KCC-kb-a li {border-bottom: 1px solid #6F1616 !important; border-right: 1px solid #3E0C0C !important; background-color: #5F3D3D !important;}'
  +
  '.PNL6KCC-kb-a li.PNL6KCC-kb-b {background-color: #802121 !important;}'
  +
  '.PNL6KCC-kb-a li:hover {background-image: -moz-linear-gradient(center top , #861818 0px, #902F2F 100%) !important;}'
  +
  '.gwt-viz-container rect {opacity: .60;}'
  +
  '.PNL6KCC-Y-n .PNL6KCC-Y-v td {background: #360909 !important;}'
  +
  '.PNL6KCC-g-f {text-shadow: 0px 1px 0px rgba(44, 11, 11, 0.5) !important;}'
  +
  '.PNL6KCC-mb-b, .PNL6KCC-mb-b .gwt-viz-container {background-color: #260D0D !important;}'
  +
  '.PNL6KCC-ib-c {border-bottom: 1px solid #531616 !important;}'
  +
  '.PNL6KCC-ub-a tr {border-bottom: 1px solid #541D1D !important;}'
  +
  '.PNL6KCC-ub-a td:nth-child(3):hover, .PNL6KCC-ub-a td:nth-child(4):hover {background: #571515 !important;}'
  +
  '.PNL6KCC-F-e.PNL6KCC-F-m, .PNL6KCC-F-k.PNL6KCC-F-m {background-color: #8F2017 !important;}'
  +
  '.PNL6KCC-F-j {background: #2A1C1C !important;}'
  +
  '.PNL6KCC-r-a {border: 1px solid #5D1515 !important; background: #4A1212 !important;}'
  +
  '.PNL6KCC-L-h .datePickerMonthSelector {background-color: #9E1F1F !important;}'
  +
  '.PNL6KCC-L-h {border-left: 1px solid #7E2727 !important; border-right: 1px solid #781D1D !important; border-bottom: 1px solid #7A2424 !important;}'
  +
  '.PNL6KCC-L-h .datePickerWeekdayLabel, .PNL6KCC-L-h .datePickerWeekendLabel {background-color: #8F1414 !important; border-bottom: 1px solid #631C1C !important;}'
  +
  '.PNL6KCC-L-h .datePickerDayIsWeekend {background-color: #890606 !important;}'
  +
  '.PNL6KCC-L-h, .PNL6KCC-n-d th, .PNL6KCC-s-o {color: #EDD !important;}'
  +
  '.PNL6KCC-L-h .datePickerDayIsValue {color: #EDD !important; background-color: #AA3022 !important; box-shadow: 0px 1px 2px #450707 inset !important;}'
  +
  '.PNL6KCC-g-t, .PNL6KCC-g-t[disabled] {background-color: #C62216 !important;}'
  +
  '.PNL6KCC-s-n {background-color: rgba(23, 15, 15, 0.8) !important;}'
  +
  '.PNL6KCC-s-f .PNL6KCC-s-p {border-bottom: 1px solid #501515 !important;}'
  +
  '.PNL6KCC-s-f {background-color: #292121 !important;}'
  +
  '.PNL6KCC-s-g {border: 1px solid #531E1E !important;}'
  +
  '.PNL6KCC-s-f .PNL6KCC-s-i {background: #531818 !important;}'
  +
  '#dashboard-header h2 a, #dashboard-header .dashboard-stat-value, .add-widget-menu-content h3, .dashboard-widget-header h2, .dashboard-widget-display-title h2 {color: #EDD !important;}'
  +
  '#dashboard-header h2, #dashboard-header h3, #dashboard-header .dashboard-stat-value, #dashboard-header .dashboard-stat-name, #dashboard-header .add-widget-button-label {text-shadow: 0px 1px 0px #2C1111 !important;}'
  +
  '.dashboard-widget-display-title {background: #511010 !important;}'
  +
  '.dashboard-widget:hover .dashboard-widget-display-title, .dashboard-widget.yt-uix-dragdrop-dragged-item .dashboard-widget-display-title, .dashboard-widget.yt-uix-dragdrop-cursor-follower .dashboard-widget-display-title {border-right: 1px solid #741717 !important;}'
  +
  '.dashboard-widget-header:hover, .dashboard-widget .dashboard-widget-config .dashboard-widget-header, .dashboard-widget.yt-uix-dragdrop-dragged-item .dashboard-widget-header, .dashboard-widget.yt-uix-dragdrop-cursor-follower .dashboard-widget-header {background-color: #802121 !important; border-bottom: 1px solid #651C1C !important;}'
  +
  '.dashboard-widget-header:hover .dashboard-widget-overlay-icon, .dashboard-widget.yt-uix-dragdrop-dragged-item .dashboard-widget-header .dashboard-widget-header-controls, .dashboard-widget.yt-uix-dragdrop-cursor-follower .dashboard-widget-header .dashboard-widget-header-controls {border-left: 1px solid #561111 !important;}'
  +
  '.promo-content a {color: #C62F16 !important;}'
  +
  '.dashboard-widget-promos .new-promo h3, .dashboard-widget-promos .new-promo .promo-content, .dashboard-widget-header h2 a, .clearfix label {color: #EDD !important;}'
  +
  '.dashboard-widget-comments .comment-comment {color: #EDD !important;}'
  +
  '#dashboard-header-stats li {border-right: 1px solid #7D2222 !important;}'
  /*+
  '#c4-header-bg-container {border-bottom: 1px solid rgba(87, 23, 23, 1);}'
  +
  '.branded-page-v2-subnav-container {border-bottom: 1px solid rgba(78, 12, 12, 1) !important;}'
  +
  '#masthead-search.consolidated-form input:focus, #masthead-search-term:focus {border-color: rgba(80, 9, 9, 1) !important;}'
  +
  '#subscription-manager-container .empty-message {border-top: 1px solid rgba(95, 13, 13, 1);}'
  +
  '#footer-container {background-color: #2D1515; border-top: 1px solid rgba(35, 5, 5, 1);}'
  +
  '#footer-main {border-bottom: 1px solid rgba(66, 14, 14, 1) !important; display: none;}'
  +
  '.yt-masthead-picker-footer {border-top: 1px solid rgba(98, 13, 13, 0.1); background: none repeat scroll 0% 0% rgba(56, 26, 26, 1); display: none !important;}'
  +
  '#collections-container {display: none !important;}'*/
);