// ==UserScript==
// @name         Кастомный форум для евгеши
// @namespace    https://forum.blackrussia.online
// @version      0.1.0.6
// @description  Красота
// @author       Netplix
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @icon         https://icons.iconarchive.com/icons/arturo-wibawa/akar/256/bluetooth-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556416/%D0%9A%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%20%D0%B4%D0%BB%D1%8F%20%D0%B5%D0%B2%D0%B3%D0%B5%D1%88%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/556416/%D0%9A%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%20%D0%B4%D0%BB%D1%8F%20%D0%B5%D0%B2%D0%B3%D0%B5%D1%88%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    scriptInit();

    function applyBodyStyle() {
        const bodyStyle = document.createElement('style');
        bodyStyle.id = 'main-body-theme';
        bodyStyle.textContent = `
        /* ЧЕРНЫЙ ФОН */
        html, body {
            background: #000000 !important;
        }

        /* СВЕТЯЩИЕСЯ НИКИ */
        .username {
            text-shadow: 0px 0px 10px #ffffff !important;
            color: #ffffff !important;
            font-weight: bold;
        }

        /* СВЕТЯЩИЕСЯ НИКИ РАЗНЫХ СТИЛЕЙ */
        .username--style3, .username--style6 {
            text-shadow: 0px 0px 15px #ffca00 !important;
            color: #ffca00 !important;
        }

        .username--style8, .username--style29 {
            text-shadow: 0px 0px 15px #FF0000 !important;
            color: #FF0000 !important;
        }

        .username--style11, .username--style12 {
            text-shadow: 0px 0px 15px #4169e2 !important;
            color: #4169e2 !important;
        }

        .username--style13, .username--style17, .username--style24 {
            text-shadow: 0px 0px 15px #00FF00 !important;
            color: #00FF00 !important;
        }

        .username--style15 {
            text-shadow: 0px 0px 15px #00FFFF !important;
            color: #00FFFF !important;
        }

        .username--style16, .username--style51 {
            text-shadow: 0px 0px 15px #FF0000 !important;
            color: #FF0000 !important;
        }

        .username--style18 {
            text-shadow: 0px 0px 15px #FF4500 !important;
            color: #FF4500 !important;
        }

        .username--style38 {
            text-shadow: 0px 0px 15px #FF00FF !important;
            color: #FF00FF !important;
        }

        .username--style39, .username--style40, .username--style41, .username--style42, .username--style43, .username--style44 {
            text-shadow: 0px 0px 15px #00FFFF !important;
            color: #00FFFF !important;
        }

        .username--style52, .username--style53 {
            text-shadow: 0px 0px 15px #0087ff !important;
            color: #0087ff !important;
        }

        .username--style96 {
            text-shadow: 0px 0px 15px #FD4806 !important;
            color: #FD4806 !important;
        }

        /* СКРУГЛЕННЫЕ СООБЩЕНИЯ */
        .message {
            border-radius: 15px !important;
            background: rgba(0, 0, 0, 0.8) !important;
            border: 1px solid #333 !important;
        }

        .message-body {
            border-radius: 12px !important;
        }

        .message-content {
            border-radius: 10px !important;
            color: #ffffff !important;
        }

        /* ТЕМНЫЕ БЛОКИ */
        .block-container, 
        .p-body, 
        .p-nav, 
        .p-header,
        .message-cell,
        .block--messages,
        .structItem {
            background: rgba(0, 0, 0, 0.9) !important;
            border: 1px solid #333 !important;
            border-radius: 10px !important;
        }

        /* БЕЛЫЙ ТЕКСТ ВЕЗДЕ */
        body, 
        div, 
        span, 
        p, 
        a, 
        h1, 
        h2, 
        h3, 
        h4, 
        h5, 
        h6,
        .message-text,
        .bbWrapper,
        .block-minorHeader,
        .node-title {
            color: #ffffff !important;
        }

        /* СКРЫТЬ ЛИШНИЕ ЭЛЕМЕНТЫ */
        .p-sectionLinks {
            display: none !important;
        }
        `;
        document.head.appendChild(bodyStyle);
    }

    function scriptInit() {
        applyBodyStyle();
    }
})();