// ==UserScript==
// @name         Скрипт фон forum
// @namespace    https://forum.blackrussia.online
// @version      0.1.0.5
// @description  Для модерирования и работы на форуме
// @author       teddy
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @icon         https://icons.iconarchive.com/icons/arturo-wibawa/akar/256/bluetooth-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554137/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D1%84%D0%BE%D0%BD%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/554137/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D1%84%D0%BE%D0%BD%20forum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NO_PREFIX = 0;
    const V_PREFIX = 1; // Префикс "Важно"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const RELEASE_PREFIX = 5; // Префикс "Реализовано"
    const DECIDED_PREFIX = 6; // Префикс "Решено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const SPEC_PREFIX = 11; // Префикс "Специальному администратору"
    const GA_PREFIX = 12; // Префикс "ГА"
    const TEX_PREFIX = 13; // Префикс "Техническому специалисту"
    const EXPECTATION_PREFIX = 14; // Префикс "Ожидание"
    const QA_PREFIX = 15; // Префикс "Проверено контролем качества"
    const REP_PREFIX = 18; // Префикс "Жалоба"
    const OBJ_PREFIX = 19; // Префикс "Обжалование"

    scriptInit();

    function applyNewFonts() {
        const fontStyles = document.createElement('style');
        fontStyles.id = 'import-fonts';
        fontStyles.textContent = `@import url('https://fonts.googleapis.com/css2?family=Bad+Script&family=Comfortaa&family=Fira+Sans&family=Marmelad&family=Montserrat&family=Neucha&family=Play&family=Roboto:ital@1&family=Sofia+Sans&family=Ubuntu&display=swap');`;
        document.head.appendChild(fontStyles);
    }

    function applyBodyStyle() {
        const bodyStyle = document.createElement('style');
        bodyStyle.id = 'main-body-theme';
        bodyStyle.textContent = `

        h2,
        h3,
        h4,
        h5,
        h6,
        span {
            color: #fff;
            text-shadow: 0px 0px 1px #000;
        }
        a, h1 {
            color: #fff;
            text-shadow: 0px 0px 10px #000;
        }

        .p-body-sidebar .block-minorHeader {
            border-bottom: 1px solid #ffffff !important;
        }

        .block-tabHeader .tabs-tab.is-active, .block-tabHeader .tabs>input:checked+.tabs-tab--radio {
            color: #fff;
            border-color: #fff;
            text-shadow: 0px 0px 10px #fff;
        }

        .message-cell.message-cell--user, .message-cell.message-cell--action {
            background: none;
            border-right: 1px solid #fff;
        }

        .block--messages.block .message, .js-quickReply.block .message, .block--messages .block-row, .js-quickReply .block-row {
            border-radius: 0;
            background: none;
            box-shadow: 0 0 0 2px #fff;
        }

        .node-stats>dl.pairs.pairs--rows {
            border-right: 1px solid #ffffff !important;
        }

        .node-body, .node--depth2:nth-child(even) .node-body {
            background: none;
        }

        html {
            background-image: url(https://avatars.mds.yandex.net/i?id=15ba377c408ad2c5fb89d88ed025f691_l-12900429-images-thumbs&n=13); # ФОТО
            background-repeat: no-repeat;
            background-position: center center;
            background-attachment: fixed;
            background-size: cover;
        }

        .block-container, .DC_LinkProxy, .bbCodeBlock {
            background: linear-gradient(90deg, rgba(51, 51, 51, 0.8) 0%, rgba(17, 17, 17, 0.8) 100%) !important;
            box-shadow: 0 0 0 2px #fff;
            border-radius: 15px;
        }

        .message-responseRow, .fr-box.fr-basic, .pageNav-jump {
            background: linear-gradient(90deg, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 100%) !important;
            box-shadow: 0 0 0 2px #fff;
        }

        .block-minorHeader.uix_threadListSeparator, .blockStatus {
            background: linear-gradient(90deg, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 100%) !important;
        }

        .bbTable>table>thead>tr>td, .bbTable>table>tbody>tr>td, .bbTable>table>thead>tr>th, .bbTable>table>tbody>tr>th {
            background: rgb(51 51 51 / 80%);
        }

        .fr-toolbar .fr-command.fr-btn.fr-open:not(:hover):not(:focus):not(:active), .blockMessage, .blockLink, .button.button--link,button.button a.button.button--link, .message.is-mod-selected .message-cell--user, .block--messages .message.is-mod-selected .message-cell--user, .message.is-mod-selected .message-cell--main, .block--messages .message.is-mod-selected .message-cell--main, .message.is-mod-selected .message-cell--vote, .block--messages .message.is-mod-selected .message-cell--vote, .block-filterBar {
            background: none;
        }

        .inputGroup.inputGroup--joined .inputGroup-text, .structItem:nth-child(even), .formRow>dt {
            background: none;
        }

        .avatar img, .avatar.avatar--default.avatar--default--image {
            background-color: none;
        }

        .fr-toolbar .fr-more-toolbar {
            background: none;
            border-bottom: 1px solid #fff;
        }

        .overlay {
            box-shadow: 0 0 0 1px #fff;
            border-radius: 10px;
            background: linear-gradient(90deg, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 100%) !important;
        }

        .overlay-title, .dataList-row.dataList-row--header .dataList-cell, .dataList-cell.dataList-cell--alt, .dataList-cell.dataList-cell--action {
            background: none;
        }

        .pageNav-page.pageNav-page--current {
            color: #fff;
            box-shadow: 0 -2px #fff inset;
        }

        .block-tabHeader .tabs-tab:not(.is-readonly):hover {
            color: #fff;
            background: rgb(255 255 255 / 10%);
        }

        .pageNav-page {
            background: #111;
        }

        .inlineModButton.is-mod-active {
            color: #fff;
        }

        .input {
            background: rgba(51, 51, 51, 1) !important;
            box-shadow: 0 0 0 2px #fff;
        }

        a.uix_logo img,
        a.uix_logo img:focus,
        a.uix_logo img:hover {
            color: #fff;
            font-weight: 900;
            transition-duration: 0.5s;
        }

        .p-staffBar, .p-header {
            background: linear-gradient(90deg, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 100%) !important;
            border-bottom: 1px solid #fff;
        }

        .button.button--scroll, button.button a.button.button--scroll {
            background: linear-gradient(90deg, rgba(51, 51, 51, 0.8) 0%, rgba(17, 17, 17, 0.8) 100%) !important;
        }

        .alert.is-unread {
            background: linear-gradient(90deg, rgb(71 71 71) 0%, rgb(37 37 37) 100%) !important;
        }

        .subNodeLink.subNodeLink--unread:before, .subNodeLink.subNodeLink--unread .subNodeLink-icon {
            color: #fff;
        }

        body::-webkit-scrollbar {
            width: 16px;
        }

        body::-webkit-scrollbar-track {
            background: #222;
        }

        body::-webkit-scrollbar-thumb {
            background: #fff;
        }

        body::-webkit-scrollbar-track {
            background: #808080 !important;
        }

        body::-webkit-scrollbar-thumb {
            background: linear-gradient(#808080, #fff, #808080) !important;
        }

        .p-footer-copyrightRow, .p-footer-inner {
            background: linear-gradient(90deg, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 100%) !important;
            border-top: 1px solid #fff;
        }

        .menu-header {
            background: linear-gradient(90deg, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 100%) !important;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }

        .menu-content, .memberTooltip-info, .memberTooltip-actions, .memberTooltip-header {
            box-shadow: 0 0 0 1px #fff;
            border-radius: 10px;
            background: linear-gradient(90deg, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 100%) !important;
        }

        .menu-footer, .menu-tabHeader, .menu-row.menu-row--alt, .memberHeader-main {
            background: none;
        }

        .memberHeader-avatar .avatar {
            border-radius: 50%;
        }

        .button.button--link, button.button a.button.button--link {
            color: #fff;
            box-shadow: 0 0 0 1px #fff;
            border-radius: 5px;
            background: linear-gradient(90deg, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 100%) !important;
        }

        .p-nav {
            background: linear-gradient(90deg, rgba(51, 51, 51, 0.8) 0%, rgba(17, 17, 17, 0.8) 100%) !important;
            border-bottom: 1px solid #fff;
        }

        .button.button--cta, button.button a.button.button--cta {
            color: #fff;
            box-shadow: 0 0 0 1px #fff;
            border-radius: 10px;
            background: linear-gradient(90deg, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 100%) !important;
        }

        .uix_extendedFooter {
            background: rgba(17, 17, 17, 0.8);
            border-top: 1px solid #fff;
        }

        .uix_extendedFooter .uix_extendedFooterRow>.block .block-container {
            padding: 10px;
        }

        .block-footer {
            background: none;
        }

        .button.button--primary, button.button a.button.button--primary {
            box-shadow: 0 0 0 1px #fff;
            border-radius: 10px;
            background: linear-gradient(90deg, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 100%) !important;
        }

        .p-nav-list .p-navEl.is-selected {
            background: linear-gradient(90deg, rgba(51, 51, 51, 0.5) 0%, rgba(17, 17, 17, 0.5) 100%) !important;
            color: #fff;
        }

        .p-staffBar .pageContent a {
            color: #ccc;
            font-weight: 900;
            transition-duration: 0.5s;
            font-style: italic;
            text-decoration: none;
            text-shadow: 0px 0px 10px #888;
        }

        body .uix_searchBar .uix_searchBarInner .uix_searchForm .input {
            background: #111;
            border: 0;
            box-sizing: border-box;
            color: #fff;
            outline: none;
            width: 100%;
            border: 2px solid #FFFFFF !important;
            border-radius: 4px;
        }

        .username--style3, .username--style6 {
            text-shadow: 0px 0px 10px #ffca00;
        }

        .username--style8, .username--style29 {
            text-shadow: 0px 0px 10px #CC0000;
        }

        .username--style11, .username--style12 {
            text-shadow: 0px 0px 10px #4169e2;
        }

        .username--style13, .username--style17, .username--style24 {
            text-shadow: 0px 0px 10px #1ac61b;
        }

        .username--style15 {
            text-shadow: 0px 0px 10px #73c6e6;
        }

        .username--style16, .username--style51 {
            text-shadow: 0px 0px 10px #FF0000;
        }

        .username--style18 {
            text-shadow: 0px 0px 10px #FF4500;
        }

        .username--style38 {
            text-shadow: 0px 0px 10px #a000a0;
        }

        .username--style39, .username--style40, .username--style41, .username--style42, .username--style43, .username--style44 {
            text-shadow: 0px 0px 10px #00FFFF;
        }

        .username--style52, .username--style53 {
            text-shadow: 0px 0px 10px #0087ff;
        }

        .username--style96 {
            text-shadow: 0px 0px 10px #FD4806;
        }

        .uix_nodeList .block-container {
            box-shadow: 0 0 0 1px #fff;
        }

        .uix_nodeList .block-body {
            box-shadow: 0 0 0 1px #fff;
            border-radius: 20px;
        }

        .node--unread .node-icon i:before {
            color: #fff;
        }

        .p-sectionLinks {
            visibility: hidden;
        }

        `;
        document.head.appendChild(bodyStyle);
    }

    function scriptInit() {

        applyNewFonts();

        applyBodyStyle();

    }
})();