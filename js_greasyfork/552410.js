// ==UserScript==
// @name         Интерфейс
// @namespace    http://tampermonkey.net/
// @version      3.4
// @author       Невезение (166)
// @match        *://patron.kinwoods.com/game/*
// @match        *://patron.kinwoods.com/settings
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @description Тёмный компактный интерфейс
// @downloadURL https://update.greasyfork.org/scripts/552410/%D0%98%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/552410/%D0%98%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const isGamePage = window.location.href.includes('/game/');
    const isSettingsPage = window.location.href.includes('/settings');

    // ==================== ПРОВЕРКА И СОЗДАНИЕ ПЕРЕКЛЮЧАТЕЛЯ ====================
    if (!window.themeSwitchCreated && window.location.href.includes('/settings')) {
        window.themeSwitchCreated = true;

        (function() {
            if (document.getElementById('theme-select')) return;

            // 1. Создаем заголовок
            const title = document.createElement('h2');
            title.textContent = 'Настройки тем скриптов';

            // 2. Создаем label
            const label = document.createElement('label');
            label.htmlFor = 'theme-select';
            label.textContent = 'Тема интерфейса ';

            // 3. Создаем select
            const select = document.createElement('select');
            select.id = 'theme-select';
            select.style.cssText = `
                padding: 2px;
                border: 1px solid #767676;
                border-radius: 3px;
            `;

            // 4. Добавляем опции
            const themes = [
                { value: 'dark', name: '🌙 Тёмная' },
                { value: 'light', name: '☀️ Светлая' }
            ];

            themes.forEach(theme => {
                const option = document.createElement('option');
                option.value = theme.value;
                option.textContent = theme.name;
                select.appendChild(option);
            });

            select.value = GM_getValue ? GM_getValue('globalTheme', 'dark') : 'dark';

            select.addEventListener('change', function() {
                if (GM_setValue) {
                    GM_setValue('globalTheme', this.value);
                    alert('Тема сохранена! Обновите страницу игры.');
                }
            });

            // 5. Вставляем элементы
            setTimeout(() => {
                const fightLabel = document.querySelector('label[for="fightNotif"]');
                if (fightLabel && fightLabel.parentNode) {
                    const parent = fightLabel.parentNode;

                    // Добавляем переносы строк
                    parent.appendChild(document.createElement('br'));
                    parent.appendChild(document.createElement('br'));

                    // Добавляем заголовок
                    parent.appendChild(title);

                    // Добавляем label и select напрямую
                    parent.appendChild(label);
                    parent.appendChild(select);
                } else {
                    // Запасной вариант
                    document.body.appendChild(title);
                    document.body.appendChild(label);
                    document.body.appendChild(select);
                }
            }, 500);
            })();
        }

    if (isGamePage) {
            GM_addStyle(`

                /* ===== ЦВЕТА ===== */

                :root {
                    --color-shadow: #00000026;
                }

                /* ===== СКРОЛЛБАР ===== */

                body::-webkit-scrollbar {
                    width: 0px !important;
                    height: 0 !important;
                }

                game-container::-webkit-scrollbar {
                    width: 0px !important;
                }

                game-container::-webkit-scrollbar-thumb:horizontal {
                    border-radius: 4px !important;
                }

                game-container::-webkit-scrollbar-thumb:horizontal:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 4px var(--color-shadow) !important;
                }

                /* ===== ТУЛТИПЫ ===== */

                .cell-tooltip {
                    left: auto !important;
                    z-index: 9999999 !important;
                }

                .fightInfo div#tooltip-panel {
                    width: max-content !important;
                    justify-self: center;
                    z-index: 9999999 !important;
                }

                .abils-list div#tooltip-panel {
                    justify-self: center;
                    z-index: 9999999 !important;
                }

                /* ===== ГЛАВНЫЕ КОНТЕЙНЕРЫ ===== */

                .game-left,
                .game-right {
                    z-index: unset !important;
                    min-width: 100% !important;
                    height: fit-content !important;
                }

                .game-container {
                    transform: scale(0.9) !important;
                    transform-origin: top center;
                    place-items: center;
                    margin-top: 0 !important;
                    margin-bottom: -15% !important;
                }

                /* ===== ИГРОВОЕ ПОЛЕ ===== */

                .game.desktop {
                    display: grid !important;
                    grid-template-columns: 26.5% 47% 26.5%;
                }

                .field-container {
                    border-radius: 15px;
                }

                .cell-move-name:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 4px var(--color-shadow) !important;
                }

                /* ===== ССЫЛКИ, ЛОКАЦИЯ И ВРЕМЯ ===== */

                .links {
                    display: flex;
                    flex-wrap: wrap;
                    text-align: left;
                    padding: 1px !important;
                    max-width: unset !important;
                    flex-direction: unset !important;
                    gap: 2px;
                }

                .links a {
                    padding: 0 3px;
                    border-radius: 10px;
                    text-decoration: none;
                }

                .links a:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 4px var(--color-shadow) !important;
                }

                .infoline {
                    display: grid !important;
                    grid-template-columns: 26.5% 47% 26.5%;
                    height: unset !important;
                }

                img#time-icon {
                    position: relative !important;
                    justify-self: end;
                    align-self: center;
                }

                #loc-name {
                    margin: 0 !important;
                    align-content: center;
                }

                .fightline {
                    height: max-content !important;
                    padding: 10px 7px 10px 3px !important;
                }

                .activitypanel {
                    height: auto !important;
                }

                /* ===== НИЖНЯЯ ПАНЕЛЬ НАВЫКОВ ===== */

                .bottom {
                    z-index: 10;
                    position: sticky !important;
                    bottom: -10% !important;
                    margin-top: 150px;
                }

                /* ===== ПАРАМЕТРЫ ===== */

                .parameters.desktop {
                    top: auto !important;
                    position: relative !important;
                }

                .parameter {
                    margin-bottom: 0 !important;
                }

                .parameter-bar.width100 {
                    border-radius: 7px !important;
                }

                .bar {
                    border-radius: 7px !important;
                }

                /* ===== ДЕЙСТВИЯ ===== */

                button.action {
                    width: 70px !important;
                    height: 70px !important;
                    margin: 0 !important;
                    box-sizing: content-box;
                    border-radius: 12px;
                    cursor: pointer;
                    box-shadow: 0 4px 4px var(--color-shadow), 0 4px 4px var(--color-shadow) inset;
                }

                button.action:hover {
                    transform: scale(1.05) !important;
                    box-shadow: 0 4px 4px var(--color-shadow);
                }

                .action-wrap {
                    width: max-content !important;
                    height: max-content !important;
                }

                .actions-desktop {
                    position: relative !important;
                    top: 0 !important;
                    right: 0 !important;
                    justify-content: flex-start !important;
                }

                .actions-buttons {
                    grid-template-columns: repeat(5, 1fr) !important;
                    gap: 20px !important;
                    direction: rtl;
                }

                /* ===== ИНВЕНТАРЬ, СУМКИ, ЗЕМЛЯ, ПРЕДМЕТЫ ===== */

                .items-desktop {
                    position: relative !important;
                    top: auto !important;
                    right: auto !important;
                    justify-self: right;
                }

                .items-panel {
                    height: auto !important;
                    gap: 35px !important
                }

                .cell-items {
                    margin-top: auto !important;
                }

                button.craftButton {
                    margin-top: 0 !important;
                }

                button.slot-item:hover {

                    box-shadow: 0 4px 4px var(--color-shadow) !important;
                }

                button.eatButton {
                    margin-top: 15px !important;
                }

                button.eatButton:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 4px var(--color-shadow) !important;
                }

                /* ===== СПОСОБНОСТИ, ИНИЦИАТИВА, МОМЕНТУМ ===== */

                .abilities {
                    width: max-content !important;
                }

                .basic_attack_wrapper {
                    position: relative !important;
                    margin: 0 !important;
                    top: auto !important;
                    height: auto !important;
                    width: auto !important;
                    left: auto !important;
                    transform: unset !important;
                    padding: 8px 8px 0 8px !important
                }

                .fightInfo {
                    position: relative !important;
                    margin: 0 !important;
                    height: auto !important;
                    top: auto !important;
                    width: fit-content;
                    margin-bottom: 5px !important;
                }

                .abilities {
                    position: relative !important;
                    margin: 0 !important;
                    top: auto !important;
                    border-radius: 10px !important;
                    padding: 8px !important;
                    box-shadow: 0 4px 4px var(--color-shadow);
                }

                button.slot.size100 {
                    border-radius: 8px;
                    box-shadow: inset 0 4px 4px var(--color-shadow) !important;
                }

                .abils-list div {
                    border-radius: 8px;
                }

                button.slot.size100:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 4px var(--color-shadow) !important;
                }

                .effects_wrap.desktop {
                    top: unset !important;
                }

                /* ===== ЧАТ ===== */

                div#gamechat-input {
                    display: grid;
                    grid-template-columns: 50% 15% 35%;
                    place-items: center;
                    gap: 0 !important;
                }

                div#gamechat-messages {
                    height: 250px !important;
                }

                textarea {
                    width: 100% !important;
                }

                span.max {
                    text-align: center;
                }

                .buttons {
                    width: 100%;
                    justify-content: center;
                }

                .buttons.flex-row button:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 4px var(--color-shadow) !important;
                }

                button.answer_next:hover {
                    transform: scale(1.05) !important;
                    box-shadow: 0 4px 4px var(--color-shadow);
                }

                /* Диалог */

                select.size100 {
                    padding: 0 10px;
                    border-radius: 5px;
                }

                .answers.flex-row.gap5 > div:first-child {
                    margin-top: 5px;
                }

                .mess-container.dialogue {
                    padding: 10px !important;
                }

                .mess-container.info {
                    padding: 0 10px !important;
                }

                .mess-container.error {
                    padding: 0 10px !important;
                }

                button.answer_next {
                    margin-top: 5px;
                    border-radius: 5px;
                }

                img.report-img {
                    width: 11px;
                }

                /* ===== ПАНЕЛЬ АКТИВНОСТИ ===== */

                button.finish:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 4px var(--color-shadow) !important;
                }

                button.timer-cancel:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 4px var(--color-shadow) !important;
                }

                .game-right .divide-line {
                    margin-bottom: 100px !important;
                }

                /* ===== ОБЪЕДИНИТЕЛИ ===== */

                .combat-container {
                    display: grid;
                    justify-items: center;
                    justify-content: start;
                }

                .leftWrapper {
                    height: 570px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    flex-direction: column;
                    margin: 20px;
                }

                .actionsParameters {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .rightWrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin: 20px;
                    height: 720px;
                }

                /* ===== ФИКСЫ ===== */

                .test {
                    height: 0 !important;
                }
        `)

        // ==================== ВЫБОР ТЕМЫ ====================
        const currentTheme = GM_getValue ? GM_getValue('globalTheme', 'dark') : 'dark';
        const themeStyleId = 'current-theme-styles';

        // Удаляем старые стили темы если есть
        const oldThemeStyle = document.getElementById(themeStyleId);
        if (oldThemeStyle) oldThemeStyle.remove();

        if (currentTheme === 'dark') {
            const darkThemeCSS = `
                /* ==== ТЕМНАЯ ТЕМА ==== */

                :root {
                    /* Фоновые цвета */
                    --color-bg-1: #12120f;          /* basic-attack - чёрный оливковый */
                    --color-bg-2: #161414;          /* границы, divide-line - тёмный кофейный */
                    --color-bg-3: #1c1c16;          /* инфолиния, кнопки - тёмный оливковый */
                    --color-bg-4: #22231b;          /* body, ячейки - светло-оливковый */
                    --color-bg-5: #2a2b20;          /* бордеры 1 - серо-оливковый */
                    --color-bg-6: #161611;          /* бордеры 2 - чёрный зелёный */
                    --color-bg-7: #303226;          /* ховер - серо-зелёный */
                    --color-bg-8: #36372a;          /* фон чата - светло-серо-зелёный */

                    /* Акцентные цвета */
                    --color-accent-1: #401010;      /* бой, ошибки - тёмный бордовый */
                    --color-accent-2: #632209;      /* активные флаги - коричнево-красный */
                    --color-accent-3: #3e4a1a;      /* диалоги, действия - тёмный оливково-зелёный */
                    --color-accent-4: #698f19;      /* активные кнопки чата - яркий зелёный */
                    --color-accent-5: #0d5652;      /* информационные сообщения - тёмный бирюзовый */
                    --color-accent-6: #cd8532;      /* рамка мастерства способностей - золотисто-оранжевый */

                    /* Цвета текста */
                    --color-text-1: #b5af94;        /* основной текст - светлый бежево-серый */
                    --color-text-2: #87826c;        /* второстепенный текст - серо-бежевый */

                    /* Градиенты */
                    --gradient-1: linear-gradient(135deg, #632209, #8b3323);  /* акцентный красно-коричневый */
                    --gradient-2: linear-gradient(135deg, #8c7a2d, #cd8532);  /* золотистый */
                    --gradient-3: linear-gradient(90deg, #7aa99a, #196f32);   /* природный зелено-бирюзовый */
                    --gradient-4: linear-gradient(90deg, #b08930, #874725);   /* медно-коричневый */
                    --gradient-5: linear-gradient(90deg, #c8f738, #5e8f04);   /* ярко-зелёный */
                    --gradient-6: radial-gradient(#231d1a, #352515, #000);    /* тёмный радиальный */
                    --gradient-7: radial-gradient(#1a1f23, #202f3b, #000);    /* синеватый радиальный */

                    /* Цвета из градиентов */
                    --color-gradient-1: #8b3323;    /* тёмно-красный */
                    --color-gradient-2: #8c7a2d;    /* оливковый */
                    --color-gradient-3: #7aa99a;    /* бирюзовый */
                    --color-gradient-4: #196f32;    /* тёмно-зелёный */
                    --color-gradient-5: #b08930;    /* золотой */
                    --color-gradient-6: #874725;    /* коричневый */
                    --color-gradient-7: #18af2b;    /* ярко-зелёный */
                    --color-gradient-8: #306f19;    /* травяной зелёный */
                    --color-gradient-9: #231d1a;    /* тёмно-коричневый */
                    --color-gradient-10: #352515;   /* коричневый средний */
                    --color-gradient-11: #1a1f23;   /* тёмный синеватый */
                    --color-gradient-12: #202f3b;   /* синевато-серый */

                    /* Фильтр для иконок */
                    --filter-icon: brightness(0) saturate(100%) invert(88%) sepia(11%) saturate(384%) hue-rotate(5deg) brightness(91%) contrast(93%); /* цвет иконок */

                    /* Замена базовых */
                    --text-primary: var(--color-text-1) !important;
                    --smell-light: var(--color-bg-3) !important;
                }

                body {
                    background-color: var(--color-bg-4) !important;
                }

                .game-left, .game-right {
                    background-color: unset !important;
                }

                .divide-line {
                    border-color: var(--color-bg-2) !important;
                }

                /* ==== Инфолиния: Быстрые ссылки, Локация, Время ==== */

                .infoline {
                    background-color: var(--color-bg-3) !important;
                    outline: 3px solid var(--color-bg-3) !important;
                }

                img#time-icon {
                    filter: var(--filter-icon);
                }

                p#loc-name {
                    color: var(--color-text-1);
                }

                .links a {
                    color: var(--color-text-2);
                    background: var(--color-bg-4);
                    border: 1px solid var(--color-bg-5);
                }

                /* ==== Строка действий: Переходов, Боя; Активность фракции ==== */

                .flag.active {
                    background-color: var(--color-accent-2) !important;
                }

                img.width100 {
                    filter: var(--filter-icon);
                }

                .actionline.flex-row {
                    background-color: var(--color-accent-3) !important;
                }

                .actionline.flex-row p {
                    color: var(--color-text-1);
                }

                .fightline.flex-row {
                    background-color: var(--color-accent-1) !important;
                }

                .fightline.flex-row p {
                    color: var(--color-text-1);
                }

                .basic-attack.selected, .basic-attack.noninteractive {
                    background-color: var(--color-accent-1) !important;
                }

                button.timer-cancel {
                    background-color: var(--color-bg-3) !important;
                    color: var(--color-text-1);
                    border: 1px solid var(--color-bg-5) !important;
                }

                button.finish {
                    background-color: var(--color-bg-3) !important;
                    color: var(--color-text-1);
                    border: 1px solid var(--color-bg-5) !important;
                }

                /* ==== Игровое поле ==== */

                .cell-move-name {
                    background-color: var(--color-bg-4) !important;
                    color: var(--color-text-1) !important;
                    box-shadow: unset !important;
                    border: 2px solid var(--color-bg-3) !important;
                    font-family: Inter, monospace !important;
                }

                /* ==== Чат, диалоговые окна ==== */

                div#gamechat-input {
                    border-top: solid 1px var(--color-bg-2) !important;
                    background-color: var(--color-bg-3) !important;
                }

                .dialogue {
                    background-color: var(--color-accent-3) !important;
                }

                .mess-container.flex-row {
                    padding: 0 10px !important;
                }

                .mess-container:nth-of-type(2n):not(.mess-container.error):not(.mess-container.info) {
                    background-color: var(--color-bg-8) !important;
                }

                .mess-container:not(:first-of-type) {
                    border-bottom: solid 1px var(--color-bg-2) !important;
                }

                .mess-container.info {
                    background-color: var(--color-accent-5) !important;
                }

                .mess-container.error {
                    background-color: var(--color-accent-1) !important;
                }

                span.sendTime {
                    color: var(--color-text-1) !important;
                    filter: contrast(1) brightness(1) !important;
                    opacity: .6 !important;
                }

                img.report-img {
                    filter: contrast(1) brightness(1) !important;
                    opacity: .6 !important;
                }

                select.size100 {
                    background-color: var(--color-text-1);
                }

                textarea {
                    background: var(--color-text-1) !important;
                    border: 1px solid var(--color-bg-5) !important;
                }

                textarea::placeholder {
                    color: var(--color-bg-3) !important;
                }

                select.size100 {
                    color: var(--color-bg-3) !important;
                }

                .answer_next {
                    background-color: var(--color-accent-4) !important;
                }

                #gamechat-input button, button.eatButton, button.craftButton {
                    background-color: var(--color-bg-3) !important;
                    color: var(--color-text-1);
                    border: 1px solid var(--color-bg-5) !important;
                }

                #gamechat-input button:hover, button.eatButton:hover, button.craftButton:hover {
                    background-color: var(--color-bg-7) !important;
                }

                #gamechat-input button.mode-active {
                    background-color: var(--color-accent-4) !important;
                    color: var(--color-bg-3);
                }

                option {
                    background-color: var(--color-bg-4);
                    color: var(--color-text-1);
                }

                span.max {
                    color: var(--color-text-2);
                }

                span.sendTime {
                    color: var(--color-text-1);
                    filter: contrast(1) brightness(0.5);
                    opacity: .3;
                }

                /* ==== Меню действий ==== */

                button.action {
                    background-color: var(--color-bg-4) !important;
                    border: 5px solid var(--color-bg-3) !important;
                }

                .action-wrap .tooltip-anchor.size100 {
                    border: 1px solid var(--color-bg-5) !important;
                    border-radius: 12px;
                }

                img.action-img {
                    border: 1px solid var(--color-bg-5) !important;
                    border-radius: 12px;
                }

                /* ==== Меню предметов ==== */

                button.slot-item.relative {
                    background-color: var(--color-bg-4) !important;
                    border: 1px solid var(--color-bg-5);
                }

                button.slot-item.relative.selected {
                    background-color: var(--color-bg-7) !important;
                }

                .slots.flex-row {
                    background-color: var(--color-bg-3) !important;
                    border: 1px solid var(--color-bg-5);
                }

                .my-items p, .bag-items p, .cell-items p {
                    background-color: var(--color-bg-3) !important;
                    color: var(--color-text-1);
                    border: 1px solid var(--color-bg-5);
                }

                button.craft-flag {
                    background-color: var(--color-bg-3) !important;
                }

                button.craft-flag.active {
                    background-color: var(--color-bg-7) !important;
                }

                button.craft-flag img.size100 {
                    filter: var(--filter-icon);
                }

                /* ==== Меню способностей ==== */

                .abilities {
                    background-color: var(--color-bg-3) !important;
                    border: 1px solid var(--color-bg-5);
                }

                .basic_attack_wrapper {
                    background-color: var(--color-bg-3) !important;
                    border: 1px solid var(--color-bg-5);
                }

                button.basic-attack {
                    background-color: var(--color-bg-1) !important;
                }

                .initiative {
                    background: var(--gradient-6) !important;
                    border: 1px solid var(--color-bg-5);
                }

                .momentum {
                    background: var(--gradient-7) !important;
                    border: 1px solid var(--color-bg-5);
                }

                .slot {
                    border: 1px solid var(--color-bg-5) !important;
                    background-color: var(--color-bg-4) !important;
                }

                .master-wrapper {
                    outline: 2px solid var(--color-accent-6) !important;
                }

                .slot.master {
                    border: 1px solid var(--color-bg-6) !important;
                    background-color: var(--color-bg-4) !important;
                }

                button.slot.size100.selected {
                    border: 1px solid #ffffff !important;
                }

                p.abils-title {
                    color: var(--color-text-1) !important;
                }

                /* ==== Тултипы ==== */

                div#tooltip-panel {
                    background-color: var(--color-bg-3) !important;
                    color: var(--color-text-1);
                }

                .cell-tooltip.cell-tooltip .clan-keeper, .clan-exile, .clan-bots, .clan-wanderer {
                    background-color: var(--color-bg-3) !important;
                }

                /* ==== Бары. Параметры навыки ==== */

                .parameter-bar {
                    background-color: var(--color-bg-5) !important;
                    border: 1px solid var(--color-bg-5) !important;
                }

                .bar {
                    background-color: var(--color-bg-3) !important;
                }

                .bar-number {
                    color: white !important;
                    font-weight: 300 !important;
                }

                .skill-bar.width100 {
                    border: 1px solid var(--color-bg-5) !important;
                    border-radius: 7px !important;
                }

                .parameters .parameter:nth-child(1) .bar-progress {
                    background: var(--gradient-1) !important;
                }

                .parameters .parameter:nth-child(2) .bar-progress {
                    background: var(--gradient-2) !important;
                }

                .parameters .parameter:nth-child(3) .bar-progress {
                    background: var(--gradient-3) !important;
                }

                .bar-progress {
                    background: var(--gradient-4) !important;
                }

                img.parameter-icon.icon-view {
                    background-color: var(--color-bg-3) !important;
                    border: 1px solid var(--color-bg-5);
                }

                .cat-fight-health .bar .bar-progress {
                    background: var(--gradient-5) !important;
                }
            `;

            const style = document.createElement('style');
            style.id = themeStyleId;
            style.textContent = darkThemeCSS;
            document.head.appendChild(style);

        } else if (currentTheme === 'light') {
            const lightThemeCSS = `
                /* ===== СВЕТЛАЯ ТЕМА ===== */

                :root {
                    --color-bg: #e9eadb;
                    --color-action-bg: #dadbcc;
                    --color-black: #000000;
                    --color-border-light: #c1bca9;
                }

                body {
                    background-color: var(--color-bg) !important;;
                }

                .game-left, .game-right {
                    background-color: unset !important;
                }

                .infoline {
                    background-color: var(--bg-light) !important;
                    outline: 3px solid var(--bg-light) !important;
                }

                button.action {
                    border: 5px solid var(--color-border-light);
                }

                button.action {
                    background-color: var(--color-action-bg);
                }

                span.sendTime {
                    filter: contrast(1) brightness(0.5);
                    opacity: .3;
                }

                img.report-img {
                    filter: contrast(1) brightness(0.5);
                    opacity: .3;
                }

                .links a {
                    color: var(--color-black);
                    background: var(--color-bg);
                    border-radius: 5px;
                    border: 1px solid var(--color-border-light);
                }
            `;

            const style = document.createElement('style');
            style.id = themeStyleId;
            style.textContent = lightThemeCSS;
            document.head.appendChild(style);
        }

        // ========= ПЕРЕМЕЩЕНИЕ ЭЛЕМЕНТОВ ИНТЕРФЕЙСА =========
        setTimeout(() => {
            const bodyDiv = document.querySelector('body div');
            const info = document.querySelector('.infoline');
            const links = document.querySelector('.links');
            const divideLine = document.querySelector('.divide-line');
            const game = document.querySelector('.game');
            const gameLeft = document.querySelector('.game-left');
            const gameRight = document.querySelector('.game-right');
            const chat = document.getElementById('gamechat');
            const activityPanel = document.querySelector('.activitypanel');
            const fightInfo = document.querySelector('.fightInfo');
            const abilities = document.querySelector('.abilities');
            const basicAttack = document.querySelector('.basic_attack_wrapper');
            const actions = document.querySelector('.actions');
            const items = document.querySelector('.items-desktop');
            const parameters = document.querySelector('.parameters');
            const effectsWrap = document.querySelector('.effects_wrap.desktop');

            // Infoline в body div перед .game
            bodyDiv.insertBefore(info, game);

            // Divide-line перед .game
            bodyDiv.insertBefore(divideLine, game);

            // Links в начало infoline
            info.insertBefore(links, info.firstChild);

            // Gamechat в левую панель
            gameLeft.insertBefore(chat, gameLeft.firstChild);

            // Activity panel в правую панель
            gameRight.insertBefore(activityPanel, gameRight.firstChild);

            // Вставляем клон Divide-line под activitypanel
            const clonedDivideLine = divideLine.cloneNode(true);
            activityPanel.parentNode.insertBefore(clonedDivideLine, activityPanel.nextSibling);

            // Боевой контейнер
            const combatContainer = document.createElement('div');
            combatContainer.className = 'combat-container';
            if(basicAttack.parentElement === abilities) abilities.removeChild(basicAttack);
            combatContainer.appendChild(fightInfo);
            combatContainer.appendChild(basicAttack);
            combatContainer.appendChild(abilities);
            gameRight.insertBefore(combatContainer, parameters);

            // Левый контейнер
            const leftWrapper = document.createElement('div');
            leftWrapper.className = 'leftWrapper';
            leftWrapper.appendChild(actions);
            leftWrapper.appendChild(combatContainer);
            leftWrapper.appendChild(effectsWrap);
            gameLeft.appendChild(leftWrapper);

            // Правый контейнер
            const rightWrapper = document.createElement('div');
            rightWrapper.className = 'rightWrapper';
            rightWrapper.appendChild(items);
            rightWrapper.appendChild(parameters);
            gameRight.appendChild(rightWrapper);
        }, 1000);
    }
})();