// ==UserScript==
// @name         新版百度贴吧深色模式
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  初步适配新版百度贴吧深色模式，旧版贴吧不可用。
// @author       Li
// @match        https://tieba.baidu.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561749/%E6%96%B0%E7%89%88%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/561749/%E6%96%B0%E7%89%88%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const darkModeCSS = `
        html, body {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
        }

        .header-wrapper, .nav-wrapper {
            background-color: #1e1e1e !important;
        }

        .forum-card-wrapper, .list-item, .forum-info-wrapper {
            background-color: #1e1e1e !important;
            border-color: #333 !important;
        }

        .forum-name, .forum-suffix {
            color: #ffffff !important;
        }

        a, .text, .name-info {
            color: #bbdefb !important;
        }

        a:hover {
            color: #ffffff !important;
        }

        svg use {
            fill: #e0e0e0 !important;
        }

        .list-load-more, .normal-style {
            background-color: #333 !important;
            color: #e0e0e0 !important;
        }

        .vue-cropper, .cropper-modal {
            background-color: #000 !important;
        }

        .cropper-view-box {
            outline-color: rgba(51, 153, 255, 0.75) !important;
        }

        div, span, p, h1, h2, h3, h4, h5, h6 {
            color: #e0e0e0 !important;
            background-color: transparent !important;
        }

        .tieba-login-wrapper {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
            opacity: 1 !important;
        }
        .tieba-login-wrapper div,
        .tieba-login-wrapper span,
        .tieba-login-wrapper p,
        .tieba-login-wrapper h1,
        .tieba-login-wrapper h2,
        .tieba-login-wrapper h3,
        .tieba-login-wrapper h4,
        .tieba-login-wrapper h5,
        .tieba-login-wrapper h6 {
            background-color: inherit !important;
            color: inherit !important;
        }

        .name-info-wrapper, .forum-avatar {
            background-color: #1e1e1e !important;
        }

        .level-icon, .sign-icon {
            fill: #ffd700 !important;
        }

        .tooltip__popper {
            background-color: #333 !important;
            color: #e0e0e0 !important;
        }

        [data-v-879ae25e], [data-v-5ff837be] {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
        }

        .fixed-bottom, .reply-area {
            background-color: #1e1e1e !important;
            opacity: 1 !important;
        }

        .search-box {
            background-color: #333 !important;
            border-color: #555 !important;
            color: #e0e0e0 !important;
        }

        .pb-title-wrap, .pc-pb-title, .fixed, .bottom-border {
            background-color: #1e1e1e !important;
            border-bottom-color: #333 !important;
            opacity: 1 !important;
        }

        .add-post svg, .add-post i {
            fill: #e0e0e0 !important;
            color: #e0e0e0 !important;
            filter: brightness(1.5) !important;
        }

        .menu-list svg, .menu-list i {
            filter: invert(1) !important;
        }

        .arrow-wrapper.left-arrow, .arrow-wrapper.right-arrow {
            background-color: transparent !important;
            background: transparent !important;
        }

        .arrow-wrapper.left-arrow .arrow-bg, .arrow-wrapper.right-arrow .arrow-bg {
            background-color: transparent !important;
            background: transparent !important;
        }

        .arrow-wrapper.left-arrow svg, .arrow-wrapper.right-arrow svg {
            fill: #e0e0e0 !important;
        }

        .card-header img, .card-header .img {
            filter: invert(1) hue-rotate(180deg) !important;
        }

        .main, .main-content, .post-content, .thread-list, .left-nav-wrapper {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
            border-color: #333 !important;
        }

        .post-item, .comment, .thread-item {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
        }

        img:not(.card-header img) {
            filter: brightness(0.9) contrast(1.1) !important;
        }

        .hover-forum-main {
            background-color: #1e1e1e !important;
            opacity: 1 !important;
        }

        .hover-forum-card, .popover {
            background-color: #1e1e1e !important;
            border-color: #333 !important;
        }

        .menu-item svg {
            filter: invert(1) !important;
        }

        .active-item svg {
            filter: invert(1) !important;
        }

        .forum-status-right, .add-btn, .button-wrapper, .button-wrapper--add-post-min {
            background-color: #333 !important;
            border: 1px solid #555 !important;
            color: #e0e0e0 !important;
            border-radius: 4px !important;
            overflow: hidden !important;
        }

        .button-wrapper--primary-tiny {
            background-color: #4070FF !important;
            border: 1px solid #4070FF !important;
            color: #ffffff !important;
            border-radius: 4px !important;
            overflow: hidden !important;
        }

        .follow-person-btn {
            background-color: #4070FF !important;
            border: 1px solid #4070FF !important;
            color: #ffffff !important;
            border-radius: 4px !important;
            overflow: hidden !important;
        }

        .forum-status-right svg, .add-btn svg, .button-wrapper svg, .button-wrapper--add-post-min svg {
            fill: #e0e0e0 !important;
        }

        .main .menu-item {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
        }

        .main .menu-item:hover {
            background-color: #333 !important;
        }

        .main .avtive-item {
            background-color: #444 !important;
            color: #ffffff !important;
        }

        .more-action-icon svg {
            filter: invert(1) !important;
        }

        .action-buttons .action-btn .action-icon svg {
            filter: invert(1) !important;
        }

        .action-btn svg {
            filter: invert(1) !important;
        }

        .close svg {
            filter: invert(1) !important;
        }

        .flex-right svg {
            filter: invert(1) !important;
        }

        .publisher-container {
            background-color: #1e1e1e !important;
            border: 1px solid #333 !important;
            opacity: 1 !important;
        }

        .publisher-nav, .main-content, .form-section, .post-title-wrapper, .content-box, .action-buttons, .footer-safe-issue {
            background-color: #1e1e1e !important;
            border-color: #333 !important;
        }

        .publisher-container svg {
            fill: #e0e0e0 !important;
        }

        .ql-container, .ql-editor {
            background-color: #222 !important;
            color: #e0e0e0 !important;
            border-color: #555 !important;
        }

        .message-main{
            background-color: #222 !important;
            color: #e0e0e0 !important;
            border-color: #555 !important;
        }

        .ql-editor.ql-blank::before {
            color: #888 !important;
        }

        .selector-list, .dropdown, .search-bottom, .forum-list {
            background-color: #1e1e1e !important;
            border: 1px solid #333 !important;
            color: #e0e0e0 !important;
        }

        .selector-item, .forum-item {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
        }

        .selector-item:hover, .forum-item:hover {
            background-color: #333 !important;
        }

        .confirm-popup {
            background-color: #1e1e1e !important;
            border: 1px solid #333 !important;
            opacity: 1 !important;
        }

        .card-tab, .card-tab-wrapper {
            background-color: #1e1e1e !important;
            border-color: #333 !important;
        }

        .tab-item {
            color: #e0e0e0 !important;
        }

        .tab-item.active, .tab-item.active-line-type {
            color: #ffffff !important;
            border-bottom-color: #4070FF !important;
        }

        .under-line-type::after, .active-line-type::after {
            background-color: #4070FF !important;
        }

        .user-list, #at-user-list-panel {
            background-color: #1e1e1e !important;
            border: 1px solid #333 !important;
            color: #e0e0e0 !important;
        }

        .diy-user, .user-name {
            background-color: transparent !important;
            color: #e0e0e0 !important;
        }

        .toast {
            background-color: rgba(30, 30, 30, 0.9) !important;
            border: 1px solid #444 !important;
            color: #e0e0e0 !important;
            backdrop-filter: blur(4px) !important;
        }

        .toast__icon, .toast__content {
            color: #e0e0e0 !important;
        }

        .more-action-card, .action-card {
            background-color: #1e1e1e !important;
            border: 1px solid #333 !important;
            color: #e0e0e0 !important;
            opacity: 1 !important;
        }

        .menu-list, .menu-list .menu-item {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
            border-color: #333 !important;
        }

        .menu-list .menu-item:hover {
            background-color: #333 !important;
            color: #ffffff !important;
        }

        .dialog-wrapper-container {
            background-color: #1e1e1e !important;
            border: 1px solid #333 !important;
            color: #e0e0e0 !important;
            opacity: 1 !important;
        }

        .dialog-title, .main-wrapper, .edit-content, .form-item, .form-item-content {
            background-color: transparent !important;
            color: #e0e0e0 !important;
        }

        .btn-wrapper, .dialog-btn {
            background-color: #333 !important;
            border-radius: 4px !important;
            overflow: hidden !important;
        }

        .dialog-mask {
            background-color: rgba(0, 0, 0, 0.6) !important;
            opacity: 1 !important;
        }
    `;

    let styleElement = null;

    function enableDarkMode() {
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.innerHTML = darkModeCSS;
            document.head.appendChild(styleElement);
        }
        GM_setValue('darkModeEnabled', true);
    }

    function disableDarkMode() {
        if (styleElement) {
            styleElement.remove();
            styleElement = null;
        }
        GM_setValue('darkModeEnabled', false);
    }

    function toggleDarkMode() {
        const isEnabled = GM_getValue('darkModeEnabled', false);
        if (isEnabled) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    }

    const isDarkModeEnabled = GM_getValue('darkModeEnabled', false);
    if (isDarkModeEnabled) {
        enableDarkMode();
    }

    GM_registerMenuCommand('切换深色模式', toggleDarkMode);
})();