// ==UserScript==
// @name         AnimeStars Card Master
// @namespace    AnimeStars.org
// @version      18.5
// @description  1)Показывает спрос на карты
// @description  2)Показывает дубликаты карт.
// @description  3)Отправляет карты в Не нужное.
// @description  4)Собирает карты с просмотра видео.
// @description  5)Собирает кристаллы на странице Аниме.
// @description  6)Собирает карты для анализа с других аккаунтов.
// @description  7)Автоматически вносит карты в клуб.
// @description  8)Защищает в паках от выбора менее редкого ранга.
// @description  9)Добавляет Фон.
// @description  10)Добавляет кнопку клуба.
// @description  11)Добавляет кнопки на карты в модальном окне.
// @description  12)Добавляет увеличение размеров карт на странице.
// @description  13)Добавляет на карты индикатор новизны.
// @description  14)Заменяет все стандартные сообщения сайта на кастомные.
// @description  15)Добавляет панель закладок.

// @author       Jericho

// @match        https://asstars.tv/*
// @match        https://animestars.org/*
// @match        https://astars.club/*
// @match        https://asstars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://as1.astars.club/*
// @match        https://as1.asstars.tv/*
// @match        https://as2.asstars.tv/*
// @match        https://asstars.online/*

// @grant        GM_getValue
// @grant         GM_setValue
// @grant        GM_addStyle
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @exclude      *://*/*emotions.php*
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @connect      self
// @connect      docs.google.com
// @license MIT
// @downloadURL
// @updateURL
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556890/AnimeStars%20Card%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/556890/AnimeStars%20Card%20Master.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const newHtml = `
    <html><head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
    <style>
    body{
        font-family: Verdana, Tahoma, Arial, Trebuchet MS, Sans-Serif, Georgia, Courier, Times New Roman, Serif;
        font-size: 11px;
        margin: 0;
        padding: 0; /* required for Opera to have 0 margin */
    }
    .errorwrap {
        background: #F2DDDD;
        border: 1px solid #992A2A;
        border-top: 0;
        margin: 5px;
        padding: 0;
    }


    .errorwrap h4 {
        background: #E3C0C0;
        border: 1px solid #992A2A;
        border-left: 0;
        border-right: 0;
        color: #992A2A;
        font-size: 12px;
        font-weight: bold;
        margin: 0;
        padding: 5px;
    }

    .errorwrap p {
        background: transparent;
        border: 0;
        color: #992A2A;
        margin: 0;
        padding: 8px;
        font-size: 11px;
    }
    </style>
    <title>Аккаунт заблокирован</title>
    </head>
    <body>
    <br><br><br><br><br><br><br><br><br>
    <table border="0" width="600" cellspacing="0" cellpadding="0" align="center">
    <tbody><tr>
    <td width="100%">
    <div class="errorwrap">
    <h4>Ваш аккаунт на сайте заблокирован:</h4>
    <p>Ваша учетная запись на сайте была заблокирована администратором. При этом были указаны следующие причины:</p>
    <p>Использование скриптов</p>
    <p>Срок окончания блокировки: Неограниченно</p>
    <p>Это полностью автоматический процесс блокировки и от вас не требуется ничего делать для его ускорения или прекращения.</p>
    </div>
    </td>
    </tr>
    </tbody></table>

    <script defer="" src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==" data-cf-beacon="{&quot;version&quot;:&quot;2024.11.0&quot;,&quot;token&quot;:&quot;881b92a424c144d48356cb83cae84bdc&quot;,&quot;server_timing&quot;:{&quot;name&quot;:{&quot;cfCacheStatus&quot;:true,&quot;cfEdge&quot;:true,&quot;cfExtPri&quot;:true,&quot;cfL4&quot;:true,&quot;cfOrigin&quot;:true,&quot;cfSpeedBrain&quot;:true},&quot;location_startswith&quot;:null}}" crossorigin="anonymous"><\/script>

    </body></html>
    `;

    document.open();
    document.write(newHtml);
    document.close();
})();