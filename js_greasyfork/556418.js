// ==UserScript==
// @name         Кастомный форум Mihail_Galandets
// @namespace    https://forum.blackrussia.online
// @version      0.1.0.8
// @description  Для модерирования и работы на форуме
// @author       teddy
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @icon         https://icons.iconarchive.com/icons/arturo-wibawa/akar/256/bluetooth-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556418/%D0%9A%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%20Mihail_Galandets.user.js
// @updateURL https://update.greasyfork.org/scripts/556418/%D0%9A%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%20Mihail_Galandets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    scriptInit();

    function applyBodyStyle() {
        const bodyStyle = document.createElement('style');
        bodyStyle.id = 'main-body-theme';
        bodyStyle.textContent = `
        /* ПРОЗРАЧНЫЕ БЛОКИ */
        .block-container, 
        .p-body, 
        .p-nav, 
        .p-header,
        .message-cell,
        .block--messages,
        .structItem,
        .message,
        .bbCodeBlock,
        .fr-box,
        .menu-content,
        .overlay,
        .alert,
        .blockStatus,
        .blockMessage {
            background: transparent !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 15px !important;
        }

        /* ПРОЗРАЧНЫЕ СООБЩЕНИЯ */
        .message {
            background: transparent !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            margin-bottom: 10px;
        }

        .message-body {
            background: transparent !important;
        }

        .message-content {
            background: transparent !important;
            color: #ffffff !important;
        }

        /* СВЕТЯЩИЕСЯ НИКИ */
        .username {
            text-shadow: 0px 0px 10px #ffffff, 0px 0px 20px #ffffff !important;
            color: #ffffff !important;
            font-weight: bold;
        }

        /* СВЕТЯЩИЕСЯ НИКИ РАЗНЫХ СТИЛЕЙ */
        .username--style3, .username--style6 {
            text-shadow: 0px 0px 10px #ffca00, 0px 0px 20px #ffca00 !important;
            color: #ffca00 !important;
        }

        .username--style8, .username--style29 {
            text-shadow: 0px 0px 10px #FF0000, 0px 0px 20px #FF0000 !important;
            color: #FF0000 !important;
        }

        .username--style11, .username--style12 {
            text-shadow: 0px 0px 10px #4169e2, 0px 0px 20px #4169e2 !important;
            color: #4169e2 !important;
        }

        .username--style13, .username--style17, .username--style24 {
            text-shadow: 0px 0px 10px #00FF00, 0px 0px 20px #00FF00 !important;
            color: #00FF00 !important;
        }

        .username--style15 {
            text-shadow: 0px 0px 10px #00FFFF, 0px 0px 20px #00FFFF !important;
            color: #00FFFF !important;
        }

        .username--style16, .username--style51 {
            text-shadow: 0px 0px 10px #FF0000, 0px 0px 20px #FF0000 !important;
            color: #FF0000 !important;
        }

        .username--style18 {
            text-shadow: 0px 0px 10px #FF4500, 0px 0px 20px #FF4500 !important;
            color: #FF4500 !important;
        }

        .username--style38 {
            text-shadow: 0px 0px 10px #FF00FF, 0px 0px 20px #FF00FF !important;
            color: #FF00FF !important;
        }

        .username--style39, .username--style40, .username--style41, .username--style42, .username--style43, .username--style44 {
            text-shadow: 0px 0px 10px #00FFFF, 0px 0px 20px #00FFFF !important;
            color: #00FFFF !important;
        }

        .username--style52, .username--style53 {
            text-shadow: 0px 0px 10px #0087ff, 0px 0px 20px #0087ff !important;
            color: #0087ff !important;
        }

        .username--style96 {
            text-shadow: 0px 0px 10px #FD4806, 0px 0px 20px #FD4806 !important;
            color: #FD4806 !important;
        }

        /* БЕЛЫЙ ТЕКСТ */
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
        .node-title,
        .structItem-title,
        .block-row--header,
        .p-description,
        .p-navEl-link {
            color: #ffffff !important;
            text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5) !important;
        }

        /* ПРОЗРАЧНЫЕ КНОПКИ */
        .button,
        button,
        .button--primary,
        .button--cta {
            background: transparent !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            color: #ffffff !important;
            border-radius: 8px !important;
        }

        .button:hover,
        button:hover {
            background: rgba(255, 255, 255, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.5) !important;
        }

        /* СКРЫТЬ ЛИШНИЕ ЭЛЕМЕНТЫ */
        .p-sectionLinks {
            display: none !important;
        }

        /* СКРУГЛЕНИЯ */
        .avatar img {
            border-radius: 50% !important;
            border: 2px solid rgba(255, 255, 255, 0.3) !important;
        }

        .message-cell.message-cell--user {
            border-radius: 15px 0 0 15px !important;
        }

        .message-cell.message-cell--main {
            border-radius: 0 15px 15px 0 !important;
        }

        /* ПРОЗРАЧНЫЙ ФУТЕР И ХЕДЕР */
        .p-footer,
        .p-staffBar {
            background: transparent !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        /* ПРОЗРАЧНЫЕ INPUT */
        .input,
        input,
        textarea {
            background: transparent !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            color: #ffffff !important;
            border-radius: 8px !important;
        }

        .input:focus,
        input:focus,
        textarea:focus {
            background: rgba(255, 255, 255, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.5) !important;
        }
        `;
        document.head.appendChild(bodyStyle);
    }

    function scriptInit() {
        applyBodyStyle();
    }
})();