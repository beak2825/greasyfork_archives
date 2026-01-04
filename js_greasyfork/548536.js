// ==UserScript==
// @name         Chub AI Gemini Stats Tracker (DLC)
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      6.5
// @description  Adds a pro RPG panel.
// @author       Ko16aska
// @match        *://chub.ai/*
// @icon         https://avatars.charhub.io/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/548536/Chub%20AI%20Gemini%20Stats%20Tracker%20%28DLC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548536/Chub%20AI%20Gemini%20Stats%20Tracker%20%28DLC%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_COLUMNS = 4;
    const BASE_PANEL_WIDTH = 350;
    const BASE_MODAL_COLUMN_WIDTH = 400;

    const STORAGE_KEYS = {
        STATS_DATA: 'chubGeminiStatsData',
        PANEL_STATE: 'chubGeminiPanelState',
        PRESETS: 'chubGeminiStatsPresets',
        TEXTAREA_HEIGHTS: 'chubGeminiTextareaHeights'
    };

    const PROMPT_TEMPLATES = {
        en: {
            languageName: "English",
            systemInstruction: `(OOC: CRITICAL ROLE-PLAY INSTRUCTION! You are the Game Master and narrator. Your primary task is to seamlessly weave a dynamic state-tracking system into our story. I will provide the current state of all tracked parameters. Your response MUST follow this sequence:
1. Write your narrative reply based on my actions and the current parameter state: {stats}.
2. Logically and realistically update these parameters based on the events in your narrative.
3. Append the *complete* and updated set of parameters in a special block at the very end of your message.
This is not optional; it is essential for our game to function.
{addons})`,
            formatInstruction: `(OOC: FINAL CHECK! After your entire narrative response, you MUST append the updated parameters in a single, clean <STATS> block. Use this EXACT JSON format, including all tracked parameters, even if their values haven't changed:
<STATS>{template}</STATS>)`,
            resource: { current: "<integer>", min: "<integer>", max: "<integer>" },
            numeric: "<integer>",
            status: { example: "<a descriptive status, e.g., 'Energized', 'Slightly Intoxicated', 'Inspired'>" },
            inventory: { example: "<item name, e.g., 'Bottle of Water', 'Keys to the Apartment'>" },
            quests: { example: "<a task or goal, e.g., '[✓] Buy milk', '[Active] Finish the report', 'Find the missing cat'>" },
            time: { example: "<new time/date value, e.g., 'Tuesday, 15:00', '2 days remaining', '3 hours elapsed'>" },
            my_thoughts: "<a brief, first-person internal thought reflecting the current situation>",
            others_thoughts: ["<a brief, first-person thought for character 1>", "<thought for char 2>"],
            dice: { check: "A skill/action check is required. The relevant die is d{die}. You MUST internally determine the Difficulty Class (DC) to decide the outcome. Based on the roll, describe what happens directly in your main narrative. DO NOT mention the DC or 'Success'/'Failure'. The <STATS> block should ONLY contain the numerical result of the roll.", roll: "<integer result of 1d{die}>" },
            addons: {
                canChangeMinMax: "For 'Resource' or 'Progress' trackers, you can modify 'min' or 'max' values if the story justifies it. Examples: an energy drink temporarily increases max 'Stamina'; getting a raise increases the 'Credit Card Limit'.",
                boundaryReactions: "CRITICAL RULE: When a parameter *first reaches* its 'min' or 'max' value, you MUST trigger a significant narrative event. Examples: 'Energy' hitting min causes sleepiness; 'Relationship' with a character hitting max leads to a heartfelt conversation.",
                progressReactions: "For 'Progress' trackers: Reaching 'max' MUST trigger a one-time completion event. Examples: 'Cooking' progress finishes, and the meal is ready; 'Report Writing' progress completes, and the document is sent. Afterwards, decide the tracker's fate: reset it, remove it, or leave it completed.",
                gradualChanges: "IMPORTANT: Parameter changes should be gradual and logical. A small compliment shouldn't max out a 'Relationship' meter instantly. Reflect the magnitude of actions in the magnitude of changes.",
                questUpdates: "You MUST maintain the list of tasks/goals. Add new tasks as they appear, and update existing ones (e.g., by adding a '[✓]' prefix when completed).",
                timeUpdates: "For 'Date & Time' trackers, you MUST advance time based on narrative events ('a few hours passed', 'the sun set').",
                thoughts: "If tracking thoughts, you MUST generate a brief internal monologue reflecting the character's immediate feelings, plans, or reactions.",
                statuses: "You MUST update statuses as an array of strings. Add new statuses from events (e.g., getting caught in the rain -> 'Soaked') and remove statuses when they expire.",
                inventories: "You MUST update inventories as an array of strings. Add items when acquired, remove them when used or lost.",
                languageRule: "IMPORTANT: All keys and values inside the <STATS> block MUST be in {lang}."
            }
        },
        ru: {
            languageName: "русском языке",
            systemInstruction: `(OOC: КЛЮЧЕВАЯ ИНСТРУКЦИЯ ДЛЯ РОЛЕВОЙ ИГРЫ! Ты — Мастер Игры и рассказчик. Твоя главная задача — органично вплести динамическую систему отслеживания параметров в нашу историю. Я предоставлю тебе текущее состояние всех отслеживаемых параметров. Твой ответ ОБЯЗАН следовать этой последовательности:
1. Напиши свой нарративный ответ, основываясь на моих действиях и текущем состоянии параметров: {stats}.
2. Логично и реалистично обнови эти параметры в соответствии с событиями, произошедшими в твоем ответе.
3. В самом конце своего сообщения добавь ПОЛНЫЙ и обновленный набор параметров в специальном блоке.
Это не опционально, это абсолютно необходимо для функционирования нашей игры.
{addons})`,
            formatInstruction: `(OOC: ФИНАЛЬНАЯ ПРОВЕРКА! После всего своего художественного ответа ты ОБЯЗАН приложить обновленные параметры в едином, чистом блоке <STATS>. Используй ТОЧНО ЭТОТ формат JSON, включая все отслеживаемые параметры, даже если их значения не изменились:
<STATS>{template}</STATS>)`,
            resource: { current: "<целое число>", min: "<целое число>", max: "<целое число>" },
            numeric: "<целое число>",
            status: { example: "<описательный статус, например: 'Вдохновлен', 'Слегка пьян', 'Промокший'>" },
            inventory: { example: "<название предмета, например: 'Бутылка воды', 'Ключи от квартиры'>" },
            quests: { example: "<задача или цель, например: '[✓] Купить молоко', '[В процессе] Закончить отчет', 'Найти пропавшего кота'>" },
            time: { example: "<новое значение времени/даты, например: 'Вторник, 15:00', 'осталось 2 дня', 'прошло 3 часа'>" },
            my_thoughts: "<краткая внутренняя мысль от первого лица, отражающая текущую ситуацию>",
            others_thoughts: ["<краткая мысль от первого лица для персонажа 1>", "<мысль для персонажа 2>"],
            dice: { check: "Требуется проверка навыка/действия. Используемый кубик — d{die}. Ты ОБЯЗАН внутренне определить Класс Сложности (КС) для решения исхода. На основе броска художественно опиши, что произошло, прямо в основном повествовании. НИКОГДА не упоминай КС или 'Успех'/'Неудача'. В блок <STATS> верни ТОЛЬКО числовой результат броска.", roll: "<результат 1d{die} числом>" },
            addons: {
                canChangeMinMax: "Для трекеров 'Ресурс' или 'Прогресс' ты можешь изменять 'min' или 'max', если это оправдано сюжетом. Примеры: энергетик временно повышает макс. 'Бодрость'; повышение зарплаты увеличивает 'Лимит по кредитке'.",
                boundaryReactions: "КРИТИЧЕСКОЕ ПРАВИЛО: Когда параметр *впервые достигает* своего значения 'min' или 'max', ты ОБЯЗАН запустить значимое сюжетное событие. Примеры: 'Энергия' на минимуме вызывает сонливость; 'Отношения' с персонажем на максимуме ведут к душевному разговору.",
                progressReactions: "Для трекеров 'Прогресс': Достижение 'max' ОБЯЗАТЕЛЬНО запускает событие завершения. Примеры: прогресс 'Готовки' завершен — ужин готов; прогресс 'Написания отчета' завершен — документ отправлен. После этого реши судьбу трекера: обнули, удали или оставь завершенным.",
                gradualChanges: "ВАЖНО: Изменения параметров должны быть постепенными и логичными. Небольшой комплимент не должен мгновенно заполнять шкалу 'Отношений'. Отражай масштаб действий в масштабе изменений.",
                questUpdates: "Ты ОБЯЗАН поддерживать список задач/целей. Добавляй новые задачи по мере их появления и обновляй существующие (например, добавляя префикс '[✓]' при выполнении).",
                timeUpdates: "Для трекеров 'Дата и Время' ты ОБЯЗАН передвигать время в соответствии с событиями ('прошло несколько часов', 'наступил закат').",
                thoughts: "Если отслеживаются мысли, ты ОБЯЗАН сгенерировать краткий внутренний монолог, отражающий чувства, планы или реакции персонажа.",
                statuses: "Ты ОБЯЗАН обновлять статусы как массив строк. Добавляй новые статусы после событий (например, попал под дождь -> 'Промокший') и убирай статусы, когда их действие заканчивается.",
                inventories: "Ты ОБЯЗАН обновлять инвентарь как массив строк. Добавляй полученные предметы и убирай использованные или потерянные.",
                languageRule: "ВАЖНО: Все ключи и значения внутри блока <STATS> ДОЛЖНЫ быть на {lang}."
            }
        }
    };


    let emojiData = new Map();
    let statsData = {};
    let panelState = {};
    let presets = {};
    let textareaHeights = {};

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    function levenshtein(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        const matrix = [];
        for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
        for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
                }
            }
        }
        return matrix[b.length][a.length];
    }

    async function loadState() {
        statsData = JSON.parse(await GM_getValue(STORAGE_KEYS.STATS_DATA, '{}'));
        const defaultPanelState = { collapsed: true, trackingEnabled: true, position: 'top', left: null, height: null };
        panelState = { ...defaultPanelState, ...JSON.parse(await GM_getValue(STORAGE_KEYS.PANEL_STATE, '{}')) };
        presets = JSON.parse(await GM_getValue(STORAGE_KEYS.PRESETS, '{}'));
        textareaHeights = JSON.parse(await GM_getValue(STORAGE_KEYS.TEXTAREA_HEIGHTS, '{}'));
    }

    async function saveState() {
        await Promise.all([
            GM_setValue(STORAGE_KEYS.STATS_DATA, JSON.stringify(statsData)),
            GM_setValue(STORAGE_KEYS.PANEL_STATE, JSON.stringify(panelState)),
            GM_setValue(STORAGE_KEYS.PRESETS, JSON.stringify(presets))
        ]);
    }

    async function initializeEmojiDatabase() {
        const lang = navigator.language.split('-')[0] || 'en';
        const fetchedLangs = new Set();
        try {
            const response = await fetch('https://cdn.jsdelivr.net/npm/emojibase-data/en/data.json');
            const data = await response.json();
            for (const emoji of data) {
                const search = `${emoji.label} ${emoji.tags ? emoji.tags.join(' ') : ''}`.toLowerCase();
                emojiData.set(emoji.emoji || emoji.unicode, { emoji: emoji.emoji || emoji.unicode, label: emoji.label, search });
            }
            fetchedLangs.add('en');
        } catch (e) { console.error("Stats DLC: Failed to load English emoji database.", e); return; }

        if (lang !== 'en') {
            try {
                const response = await fetch(`https://cdn.jsdelivr.net/npm/emojibase-data/${lang}/data.json`);
                if (!response.ok) throw new Error(`Language '${lang}' not supported by emojibase.`);
                const data = await response.json();
                for (const emoji of data) {
                    const key = emoji.emoji || emoji.unicode;
                    if (emojiData.has(key)) {
                        const existing = emojiData.get(key);
                        existing.search += ` ${emoji.label} ${emoji.tags ? emoji.tags.join(' ') : ''}`.toLowerCase();
                    }
                }
                fetchedLangs.add(lang);
            } catch (e) { console.warn(`Stats DLC: ${e.message}`); }
        }
    }

    function getCurrentChatId() {
        const match = window.location.pathname.match(/\/chats\/([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    }

    function getChatStats(chatId) {
        if (!chatId) return { config: [], values: {}, history: [], historyIndex: -1 };
        if (!statsData[chatId]) {
            statsData[chatId] = { config: [], values: {} };
        }
        if (!statsData[chatId].history || !Array.isArray(statsData[chatId].history)) {
            statsData[chatId].history = [];
            statsData[chatId].historyIndex = -1;
        }
        statsData[chatId].config.forEach(stat => {
            stat.isActive = stat.isActive ?? true;
            if (stat.type === 'dice') stat.showLastRoll = stat.showLastRoll ?? false;
            stat.column = stat.column ?? 0;
        });
        return statsData[chatId];
    }

    function updatePanelWidth() {
        const panel = document.getElementById('gemini-stats-panel');
        const modalContent = document.querySelector('#stats-config-modal .modal-content');
        if (!panel || !modalContent) return;

        const displayArea = document.getElementById('stats-display-area');
        const numColumns = displayArea.querySelectorAll('.stats-column').length || 1;
        panel.style.width = `calc(${(BASE_PANEL_WIDTH * numColumns) + (10 * (numColumns - 1))}px * var(--scale-factor))`;

        const configList = document.getElementById('stats-config-list');
        const modalNumColumns = configList.querySelectorAll('.config-column').length || 1;
        modalContent.style.width = `calc(${(BASE_MODAL_COLUMN_WIDTH * modalNumColumns) + (10 * (modalNumColumns - 1)) + 40}px * var(--scale-factor))`;
    }

    function buildHtml() {
        const panel = document.createElement('div');
        panel.id = 'gemini-stats-panel';
        panel.innerHTML = `
        <div class="panel-content">
        <div id="stats-header" class="draggable-header">
            <label class="toggle-switch-label">
                <input type="checkbox" id="toggle-tracking-enabled" />
                <span class="slider round"></span>
                Enable Tracking
            </label>
        <div class="history-controls">
            <button id="btn-undo-stats" title="Undo Last Change (Ctrl+Z)">↶</button>
            <button id="btn-commit-state" title="Commit current state and clear history">🗑️</button>
            <button id="btn-redo-stats" title="Redo Last Change (Ctrl+Y)">↷</button>
        </div>
            <button id="btn-manage-stats">Manage Trackers</button>
        </div>
            <div id="stats-display-area"></div>
        </div>
        <div class="panel-buttons-container">
            <div id="stats-main-toggle" class="toggle-button" title="Show/Hide Stats Panel">▼</div>
            <div id="btn-toggle-position" class="position-toggle-button" title="Move to Top/Bottom">↕</div>
        </div>
        <div class="resize-handle"></div>`;
        document.body.appendChild(panel);

        const modal = document.createElement('div');
        modal.id = 'stats-config-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
        <div class="modal-content">
            <h4>Manage Stat Trackers</h4>
            <div class="preset-controls">
                <select id="stats-preset-select"><option value="">Select Preset...</option></select>
                <button id="stats-btn-load-preset" class="preset-btn">Load</button>
                <button id="stats-btn-add-preset" class="preset-btn">Add New</button>
                <button id="stats-btn-save-preset" class="preset-btn" disabled>Save</button>
                <button id="stats-btn-delete-preset" class="preset-btn btn-preset-delete" disabled>Del</button>
            </div>
            <div id="stats-config-list"></div>
            <button id="btn-add-tracker" class="small-green-button">+ Add New Tracker</button>
            <div class="modal-buttons">
                <button id="btn-cancel-stats-config">Cancel</button>
                <button id="btn-save-stats-config">Save & Close</button>
            </div>
        </div>`;
        document.body.appendChild(modal);
    }

    function getStyles() {
        GM_addStyle(`
        :root { --scale-factor: 1; --accent-green: #81C784; --accent-red: #E57373; }
        #gemini-stats-panel { position: fixed; background: rgba(30, 30, 30, 0.85); color: #eee; padding: 0; box-shadow: 0 calc(4px * var(--scale-factor)) calc(16px * var(--scale-factor)) rgba(0,0,0,.7); font-family: Arial, sans-serif; font-size: calc(14px * var(--scale-factor)); z-index: 9999; user-select: none; box-sizing: border-box; display: flex; flex-direction: column; transition: transform 0.4s ease-out; }
        #gemini-stats-panel.position-top { top: 0; transform: translateY(-100%); border-bottom-left-radius: calc(8px * var(--scale-factor)); border-bottom-right-radius: calc(8px * var(--scale-factor)); }
        #gemini-stats-panel.position-bottom { bottom: 0; top: auto; transform: translateY(100%); border-top-left-radius: calc(8px * var(--scale-factor)); border-top-right-radius: calc(8px * var(--scale-factor)); }
        #gemini-stats-panel:not(.collapsed) { transform: translateY(0); }
        .resize-handle { position: absolute; left: 0; width: 100%; height: 5px; cursor: ns-resize; }
        .position-top .resize-handle { bottom: -2px; }
        .position-bottom .resize-handle { top: -2px; }
        .draggable-header { cursor: move; }
        .panel-content { padding: calc(8px * var(--scale-factor)) calc(12px * var(--scale-factor)); flex-grow: 1; display: flex; flex-direction: column; min-height: 0; }
        .panel-buttons-container { display: flex; justify-content: center; position: absolute; left: 50%; transform: translateX(-50%); }
        .position-top .panel-buttons-container { bottom: calc(-28px * var(--scale-factor)); }
        .position-bottom .panel-buttons-container { top: calc(-28px * var(--scale-factor)); }
        .toggle-button, .position-toggle-button { width: calc(30px * var(--scale-factor)); height: calc(28px * var(--scale-factor)); background: rgba(30,30,30,.85); border: calc(1px * var(--scale-factor)) solid #444; color: #eee; text-align: center; line-height: calc(28px * var(--scale-factor)); font-size: calc(20px * var(--scale-factor)); cursor: pointer; }
        .position-top .toggle-button { border-bottom-left-radius: calc(8px * var(--scale-factor)); border-top: none; }
        .position-top .position-toggle-button { border-bottom-right-radius: calc(8px * var(--scale-factor)); border-top: none; }
        .position-bottom .toggle-button { border-top-left-radius: calc(8px * var(--scale-factor)); border-top: calc(1px * var(--scale-factor)) solid #444; border-bottom: none; }
        .position-bottom .position-toggle-button { border-top-right-radius: calc(8px * var(--scale-factor)); border-top: calc(1px * var(--scale-factor)) solid #444; border-bottom: none; }
        #stats-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: calc(8px * var(--scale-factor)); margin-bottom: calc(8px * var(--scale-factor)); border-bottom: calc(1px * var(--scale-factor)) solid #444; }
        #stats-display-area { display: grid; gap: calc(10px * var(--scale-factor)); align-items: start; overflow-y: auto; padding-right: 5px; }
        #stats-display-area::-webkit-scrollbar { width: 8px; } #stats-display-area::-webkit-scrollbar-track { background: transparent; } #stats-display-area::-webkit-scrollbar-thumb { background-color: #555; border-radius: 4px; border: 2px solid rgba(0,0,0,0); }
        .stats-column { display: flex; flex-direction: column; gap: inherit; min-height: 50px; border-radius: 4px; padding: 2px; transition: background-color 0.2s ease; }
        .stats-column.drag-over { background-color: rgba(255, 255, 255, 0.1); }
        .stat-container { background: #2a2a2a; padding: calc(8px * var(--scale-factor)); border-radius: calc(4px * var(--scale-factor)); position: relative; transition: filter 0.3s ease; cursor: grab; }
        .stat-container.inactive-tracker { filter: grayscale(1) brightness(0.8); }
        .stat-container.dragging { opacity: 0.4; }
        .tracker-toggle-indicator { position: absolute; top: 5px; right: 5px; width: 10px; height: 10px; border-radius: 50%; background-color: #4caf50; cursor: pointer; border: 1px solid #222; z-index: 2; }
        .inactive-tracker .tracker-toggle-indicator { background-color: #666; }
        .stat-label-container { display: flex; align-items: baseline; gap: 8px; }
        .stat-delta { font-weight: bold; font-size: 1em; animation: pulse-and-fade 5s ease-out forwards; text-shadow: 0 0 5px black; }
        .stat-delta.positive { color: var(--accent-green); }
        .stat-delta.negative { color: var(--accent-red); }
        @keyframes pulse-and-fade { 0% { transform: scale(0.5); opacity: 0; } 10% { transform: scale(1.2); opacity: 1; } 20% { transform: scale(1); } 30% { transform: scale(1.1); } 40% { transform: scale(1); } 50% { transform: scale(1.1); } 60% { transform: scale(1); } 80% { transform: scale(1); opacity: 1; } 100% { transform: scale(0.8); opacity: 0; } }
        .stat-container label { font-weight: bold; font-size: calc(13px * var(--scale-factor)); color: #ddd; margin-bottom: calc(5px * var(--scale-factor)); display: block; }
        .stat-bar-bg { background: #1a1a1a; height: calc(18px * var(--scale-factor)); border-radius: calc(4px * var(--scale-factor)); overflow: hidden; position: relative; }
        .stat-bar-fg { background: #4caf50; height: 100%; transition: width 1.2s cubic-bezier(0.25, 1, 0.5, 1); position: relative; overflow: hidden; }
        .stat-bar-fg.shine-animation::after { content: ''; position: absolute; top: -50%; left: -50%; width: 20%; height: 200%; background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%); transform: skewX(-25deg); animation: bar-shine 1.5s ease-in-out 1; }
        @keyframes bar-shine { from { left: -50%; } to { left: 130%; } }
        .stat-bar-text { position: absolute; top: 0; left: 0; width: 100%; height: 100%; text-align: center; line-height: calc(18px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor)); color: white; text-shadow: calc(1px * var(--scale-factor)) calc(1px * var(--scale-factor)) calc(1px * var(--scale-factor)) #000; }
        .stat-emoji-container { display: flex; align-items: center; justify-content: space-between; }
        .stat-emoji-display { font-size: calc(16px * var(--scale-factor)); letter-spacing: calc(2px * var(--scale-factor)); }
        .stat-emoji-display .empty { opacity: 0.3; }
        .stat-emoji-display span { transition: transform 0.2s ease-out, opacity 0.2s ease-in-out; display: inline-block; }
        .emoji-pop { animation: juicy-pop 0.8s cubic-bezier(0.5, 2, 0.5, 1); }
        @keyframes juicy-pop { 0% { transform: scale(1); } 30% { transform: scale(1.6) rotate(-10deg); } 60% { transform: scale(0.8) rotate(5deg); } 100% { transform: scale(1) rotate(0); } }
        .stat-value-toggle { background: none; border: none; font-size: 0.9em; color: #ccc; cursor: pointer; padding: calc(2px * var(--scale-factor)) calc(4px * var(--scale-factor)); border-radius: calc(3px * var(--scale-factor)); min-width: calc(50px * var(--scale-factor)); text-align: right; transition: color 0.3s, transform 0.3s; }
        .stat-value-toggle.dice-reveal { animation: dice-slam 1s cubic-bezier(0.17, 0.67, 0, 1.39); color: var(--accent-green); font-weight: bold; }
        @keyframes dice-slam { 0% { transform: scale(2.5) rotate(15deg); opacity: 0; } 50% { transform: scale(0.9) rotate(-5deg); opacity: 1; } 80% { transform: scale(1.2) rotate(2deg); } 100% { transform: scale(1) rotate(0); } }
        .stat-numeric-container { display: flex; align-items: center; gap: calc(8px * var(--scale-factor)); }
        .stat-numeric { font-size: calc(16px * var(--scale-factor)); font-weight: bold; color: white; transition: color 0.1s, transform 0.1s; }
        .stat-text-area {
            width: 100%;
            background: #222;
            border: calc(1px * var(--scale-factor)) solid #555;
            color: #eee;
            border-radius: calc(4px * var(--scale-factor));
            padding: calc(8px * var(--scale-factor));
            height: calc(60px * var(--scale-factor));
            resize: vertical;
            box-sizing: border-box;
            transition: box-shadow 0.3s, border-color 0.3s;
            font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
            font-size: calc(13px * var(--scale-factor));
            line-height: 1.5;
            white-space: pre-wrap;
        }
        .stat-text-area.text-updated { animation: text-area-glow 2s ease-out; }
        .stat-text-area.text-updated { animation: text-area-glow 2s ease-out; }
        @keyframes text-area-glow { 0% { box-shadow: 0 0 10px var(--accent-green); border-color: var(--accent-green); } 100% { box-shadow: 0 0 0 transparent; border-color: #555; } }
        .dice-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
        .die-button { background: #3a3a3a; border: 1px solid #555; color: #eee; padding: 5px; border-radius: 4px; cursor: pointer; text-align: center; transition: background-color 0.2s; }
        .die-button:nth-child(n+5) { grid-column: span 1; }
        .die-button.selected-die { background-color: #4caf50; border-color: #81C784; }
        .dice-result-container { position: absolute; bottom: 5px; right: 5px; display: flex; align-items: center; gap: 5px; }
        #btn-manage-stats { padding: calc(4px * var(--scale-factor)); border: none; border-radius: calc(5px * var(--scale-factor)); background: #555; color: #fff; font-weight: 600; cursor: pointer; transition: background-color .3s ease; }
        #btn-manage-stats:hover { background: #666; }
        #stats-config-modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,.7); display:none; justify-content:center; align-items:center; z-index:10001; }
        #stats-config-modal .modal-content { background:#333; padding: calc(15px * var(--scale-factor)); border-radius: calc(8px * var(--scale-factor)); max-height: 90vh; display:flex; flex-direction:column; gap: calc(10px * var(--scale-factor)); }
        #stats-config-list { min-height: 100px; max-height: 50vh; overflow-y: auto; padding-right: 10px; display: grid; gap: calc(10px * var(--scale-factor)); align-items: start; }
        .config-column { display: flex; flex-direction: column; gap: calc(8px * var(--scale-factor)); min-height: 50px; border-radius: 4px; padding: 4px; transition: background-color 0.2s ease; }
        .config-column.drag-over { background-color: rgba(255, 255, 255, 0.1); }
        .preset-controls { display: flex; gap: calc(8px * var(--scale-factor)); border-bottom: calc(1px * var(--scale-factor)) solid #555; padding-bottom: calc(10px * var(--scale-factor)); }
        .preset-controls select { flex-grow: 1; }
        .preset-controls .preset-btn { padding: calc(4px * var(--scale-factor)) calc(8px * var(--scale-factor)); border: none; border-radius: calc(5px * var(--scale-factor)); color: #fff; font-weight: 600; cursor: pointer; transition: background-color .3s ease, opacity .3s ease; font-size: calc(13px * var(--scale-factor)); }
        .preset-controls button:disabled { background: #555; cursor: not-allowed; opacity: .7; }
        #stats-preset-select { background: #222 !important; border: calc(1px * var(--scale-factor)) solid #555 !important; border-radius: calc(4px * var(--scale-factor)) !important; color: #eee !important; padding: calc(5px * var(--scale-factor)) !important; }
        #stats-btn-load-preset, #stats-btn-save-preset, #stats-btn-add-preset { background: #4caf50; }
        #stats-btn-load-preset:hover:not(:disabled), #stats-btn-save-preset:hover:not(:disabled), #stats-btn-add-preset:hover:not(:disabled) { background: #388e3c; }
        .btn-preset-delete { background: #c0392b; }
        .btn-preset-delete:hover:not(:disabled) { background: #a93226; }
        #stats-config-list .tracker-config { display: grid; grid-template-columns: auto 1fr auto auto auto; gap: calc(8px * var(--scale-factor)); align-items: center; background: #2a2a2a; padding: calc(8px * var(--scale-factor)); border-radius: calc(4px * var(--scale-factor)); position: relative; }
        .drag-handle { cursor: grab; color: #888; font-size: calc(20px * var(--scale-factor)); padding-right: calc(5px * var(--scale-factor)); user-select: none; }
        .tracker-config.dragging { opacity: 0.5; background: #555; }
        #stats-config-list .sub-config { display: flex; gap: calc(8px * var(--scale-factor)); align-items: center; margin-top: calc(5px * var(--scale-factor)); grid-column: 1 / -1; }
        .sub-config-item { display: flex; flex-direction: column; flex: 1; } .sub-config-item span { font-size: calc(11px * var(--scale-factor)); color: #aaa; margin-bottom: calc(2px * var(--scale-factor)); }
        #stats-config-modal #stats-config-list input, #stats-config-modal #stats-config-list select, #stats-config-modal #stats-config-list textarea { background: #222 !important; border: calc(1px * var(--scale-factor)) solid #555 !important; border-radius: calc(4px * var(--scale-factor)) !important; color: #eee !important; padding: calc(5px * var(--scale-factor)) !important; width: 100% !important; font-size: calc(14px * var(--scale-factor)); font-family: inherit; box-sizing: border-box; }
        #stats-config-modal #stats-config-list input, #stats-config-modal #stats-config-list select { height: calc(30px * var(--scale-factor)); }
        #stats-config-modal #stats-config-list textarea { resize: vertical; min-height: calc(40px * var(--scale-factor)); }
        #stats-config-list .btn-pick-emoji { font-size: calc(16px * var(--scale-factor)); padding: 0; cursor: pointer; background: #3a3a3a; border: calc(1px * var(--scale-factor)) solid #555; border-radius: calc(4px * var(--scale-factor)); height: calc(30px * var(--scale-factor)); width: calc(35px * var(--scale-factor)); display: inline-flex; justify-content: center; align-items: center; line-height: 1; }
        #stats-config-list .btn-delete-tracker { background: #c0392b; color: white; border: none; cursor: pointer; border-radius: calc(4px * var(--scale-factor)); height: calc(30px * var(--scale-factor)); width: calc(35px * var(--scale-factor)); padding: 0; display: inline-flex; justify-content: center; align-items: center; }
        .emoji-suggestion-box { position: absolute; top: 100%; margin-top: calc(2px * var(--scale-factor)); left: 0; background: #444; border-radius: calc(4px * var(--scale-factor)); padding: calc(4px * var(--scale-factor)); display: flex; gap: calc(4px * var(--scale-factor)); z-index: 10; box-shadow: 0 calc(2px * var(--scale-factor)) calc(5px * var(--scale-factor)) rgba(0,0,0,.5); max-width: 100%; overflow-x: auto; }
        .emoji-suggestion-box button { background: #555; border: none; color: #fff; padding: calc(2px * var(--scale-factor)) calc(6px * var(--scale-factor)); border-radius: calc(3px * var(--scale-factor)); cursor: pointer; font-size: calc(20px * var(--scale-factor)); }
        #stats-config-modal .modal-buttons { display:flex; justify-content:flex-end; gap: calc(8px * var(--scale-factor)); }
        #stats-config-modal .modal-buttons button { padding: 5px 10px; border: none; border-radius: 5px; color: #fff; font-weight: 600; cursor: pointer; transition: background-color .3s ease; }
        #btn-save-stats-config { background: #4caf50; } #btn-cancel-stats-config { background: #888; } #btn-add-tracker.small-green-button { background: #388e3c; align-self: flex-start; }
        .toggle-switch-label { position: relative; display: flex; align-items: center; margin: 0; font-size: calc(12px * var(--scale-factor)); padding-left: calc(35px * var(--scale-factor)); cursor: pointer; min-height: calc(18px * var(--scale-factor)); }
        .toggle-switch-label input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; height: calc(18px * var(--scale-factor)); width: calc(32px * var(--scale-factor)); background-color: #ccc; transition: .4s; border-radius: calc(9px * var(--scale-factor)); }
        .slider:before { position: absolute; content: ""; height: calc(13px * var(--scale-factor)); width: calc(13px * var(--scale-factor)); left: calc(2.5px * var(--scale-factor)); bottom: calc(2.5px * var(--scale-factor)); background-color: #fff; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #4caf50; } input:checked + .slider:before { transform: translateX(calc(14px * var(--scale-factor))); }
        .value-increase { color: var(--accent-green) !important; transform: scale(1.1); }
        .value-decrease { color: var(--accent-red) !important; transform: scale(1.1); }
        .history-controls { display: flex; gap: calc(5px * var(--scale-factor)); }
        .history-controls button {
            background: #3a3a3a;
            border: 1px solid #555;
            color: #eee;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: calc(16px * var(--scale-factor));
            width: calc(28px * var(--scale-factor));
            height: calc(24px * var(--scale-factor));
            line-height: calc(24px * var(--scale-factor));
            padding: 0;
            transition: background-color 0.2s, color 0.2s;
        }
        .history-controls button:hover:not(:disabled) { background-color: #4caf50; }
        .history-controls button:disabled { background: #2a2a2a; color: #666; cursor: not-allowed; }
        #btn-clear-stats:hover:not(:disabled) { background-color: #c0392b; }
    `);
    }

    const HISTORY_LIMIT = 10;

    function updateUndoRedoButtons(chatId) {
        if (!chatId) return;
        const undoBtn = document.getElementById('btn-undo-stats');
        const redoBtn = document.getElementById('btn-redo-stats');
        if (!undoBtn || !redoBtn) return;

        const chatStats = getChatStats(chatId);
        const history = chatStats.history || [];
        const index = chatStats.historyIndex ?? -1;

        undoBtn.disabled = index <= 0;
        redoBtn.disabled = index >= history.length - 1;
    }

    function pushStateToHistory(chatId) {
        const chatStats = getChatStats(chatId);
        if (!chatStats.config) return;

        if (!chatStats.history) {
            chatStats.history = [];
            chatStats.historyIndex = -1;
        }

        const currentState = JSON.parse(JSON.stringify(chatStats.values));

        const veryLastState = chatStats.history[chatStats.history.length - 1];
        if (veryLastState && JSON.stringify(veryLastState) === JSON.stringify(currentState)) {
            chatStats.historyIndex = chatStats.history.length - 1;
            updateUndoRedoButtons(chatId);
            return;
        }

        chatStats.history.push(currentState);

        if (chatStats.history.length > HISTORY_LIMIT) {
            chatStats.history.shift();
        }

        chatStats.historyIndex = chatStats.history.length - 1;

        updateUndoRedoButtons(chatId);
    }

    function applyStateValues(chatId, newValues) {
        const chatStats = getChatStats(chatId);
        chatStats.values = JSON.parse(JSON.stringify(newValues));

        chatStats.config.forEach(statConfig => {
            const container = document.querySelector(`[data-stat-id="${statConfig.id}"]`);
            if (!container) return;
            const value = chatStats.values[statConfig.id];

            switch (statConfig.type) {
                case 'time':
                    container.querySelector('.time-display').textContent = value || '';
                    break;
                case 'dice':
                    if (statConfig.showLastRoll) {
                        const toggleButton = container.querySelector('.stat-value-toggle');
                        if (toggleButton) {
                            const lastRoll = chatStats.values[statConfig.id + "_lastRoll"];
                            toggleButton.textContent = `Last: ${lastRoll === undefined ? 'N/A' : lastRoll}`;
                        }
                    }
                    break;
                case 'resource':
                case 'progress': {
                    const max = statConfig.max || 100;
                    if (statConfig.style === 'bar') {
                        container.querySelector('.stat-bar-fg').style.width = `${max > 0 ? ((value || 0) / max) * 100 : 0}%`;
                        container.querySelector('.stat-bar-text').textContent = `${value || 0} / ${max}`;
                    } else {
                        const displayCount = Math.min(max, 10);
                        const filledCount = max > 0 ? Math.round(((value || 0) / max) * displayCount) : 0;
                        container.querySelectorAll('.stat-emoji-display span').forEach((span, i) => span.classList.toggle('empty', i >= filledCount));
                        if (container.querySelector('.stat-value-toggle').textContent !== '👁️') {
                            container.querySelector('.stat-value-toggle').textContent = `(${value || 0}/${max})`;
                        }
                    }
                    break;
                }
                case 'numeric':
                    container.querySelector('.stat-numeric').textContent = value;
                    break;
                default:
                    if(container.querySelector('textarea')) container.querySelector('textarea').value = String(value || '');
                    break;
            }
        });
        updateUndoRedoButtons(chatId);
        saveState();
    }

    function loadStateFromHistory(chatId) {
        const chatStats = getChatStats(chatId);
        const stateToLoad = chatStats.history[chatStats.historyIndex];
        if (stateToLoad) {
            applyStateValues(chatId, stateToLoad);
        }
        updateUndoRedoButtons(chatId);
    }

    function createStatElement(stat, value, preservedHeight) {
        const container = document.createElement('div');
        container.className = 'stat-container';
        container.classList.toggle('inactive-tracker', !stat.isActive);
        container.dataset.statId = stat.id;
        container.setAttribute('draggable', 'true');

        const showEmojiInLabel = !(['resource', 'progress'].includes(stat.type) && stat.style === 'emoji');
        const labelEmoji = stat.emoji && showEmojiInLabel ? `${stat.emoji} ` : '';
        const charName = stat.characterName ? ` (${stat.characterName})` : '';
        const labelHtml = `<div class="stat-label-container"><label>${labelEmoji}${stat.name}${charName}</label></div>`;

        let contentHtml = '<div class="tracker-toggle-indicator"></div>';

        switch (stat.type) {
            case 'time':
                contentHtml += `${labelHtml}<div class="stat-numeric-container"><span class="stat-numeric time-display">${value}</span></div>`;
                break;
            case 'dice':{
                const dice = [2, 3, 6, 8, 10, 20, 100];
                const lastRoll = getChatStats(getCurrentChatId()).values[stat.id + "_lastRoll"];
                const diceValueDisplay = stat.showLastRoll ? `Last: ${lastRoll === undefined ? 'N/A' : lastRoll}` : '👁️';
                contentHtml += `${labelHtml}
                <div class="dice-grid">${dice.map(d => `<button class="die-button ${value === d ? 'selected-die' : ''}" data-die-value="${d}">d${d}</button>`).join('')}</div>
                <div class="dice-result-container"><button class="stat-value-toggle">${diceValueDisplay}</button></div>`;
                break;
            }
            case 'resource':
            case 'progress':{
                const max = stat.max || 100;
                contentHtml += labelHtml;
                if (stat.style === 'bar') {
                    contentHtml += `<div class="stat-bar-bg"><div class="stat-bar-fg" style="width: ${max > 0 ? ((value || 0) / max) * 100 : 0}%;"></div><div class="stat-bar-text">${value || 0} / ${max}</div></div>`;
                } else {
                    const displayCount = Math.min(max, 10);
                    const filledCount = max > 0 ? Math.round(((value || 0) / max) * displayCount) : 0;
                    let emojis = Array.from({ length: displayCount }, (_, i) => `<span class="${i < filledCount ? '' : 'empty'}">${stat.emoji || '❤️'}</span>`).join('');
                    const valueDisplay = stat.showValue ? `(${value || 0}/${max})` : '👁️';
                    contentHtml += `<div class="stat-emoji-container"><div class="stat-emoji-display">${emojis}</div><button class="stat-value-toggle">${valueDisplay}</button></div>`;
                }
                break;
            }
            case 'numeric':
                contentHtml += `${labelHtml}<div class="stat-numeric-container"><span class="stat-numeric">${value}</span></div>`;
                break;
            default:{
                const placeholders = {
                    my_thoughts: 'AI will generate this...',
                    others_thoughts: 'AI will generate this...',
                    status: 'No active statuses...',
                    inventory: 'Inventory is empty...',
                    quests: 'No active quests or tasks...'
                };
                contentHtml += `${labelHtml}<textarea class="stat-text-area" readonly placeholder="${placeholders[stat.type] || 'Empty...'}">${value || ''}</textarea>`;
                break;
            }
        }
        container.innerHTML = contentHtml;
        if (preservedHeight) {
            const textarea = container.querySelector('.stat-text-area');
            if (textarea) textarea.style.height = preservedHeight;
        }

        return container;
    }

    function renderStatsDisplay(chatId) {
        const displayArea = document.getElementById('stats-display-area');
        if (!displayArea) return;

        const preservedHeights = new Map();
        const savedChatHeights = textareaHeights[chatId] || {};
        for (const statId in savedChatHeights) {
            preservedHeights.set(statId, savedChatHeights[statId]);
        }
        displayArea.querySelectorAll('.stat-text-area').forEach(textarea => {
            const container = textarea.closest('.stat-container');
            if (container?.dataset.statId && textarea.style.height) {
                preservedHeights.set(container.dataset.statId, textarea.style.height);
            }
        });

        displayArea.innerHTML = '';
        const chatStats = getChatStats(chatId);
        const { config, values } = chatStats;

        if (!config || config.length === 0) {
            displayArea.innerHTML = `<p style="color: #888;">No trackers configured. Click "Manage Trackers".</p>`;
            displayArea.style.gridTemplateColumns = '1fr';
            const colDiv = document.createElement('div');
            colDiv.className = 'stats-column';
            colDiv.dataset.columnIndex = 0;
            displayArea.appendChild(colDiv);

            updateUndoRedoButtons(chatId);
            updatePanelWidth();
            return;
        }

        const numColumns = config.reduce((max, stat) => Math.max(max, stat.column || 0), 0) + 1;
        displayArea.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;

        const columns = Array.from({ length: numColumns }, (_, i) => {
            const colDiv = document.createElement('div');
            colDiv.className = 'stats-column';
            colDiv.dataset.columnIndex = i;
            return colDiv;
        });

        config.forEach(stat => {
            const value = values[stat.id] ?? (stat.type === 'time' ? stat.initialTimeValue : '');
            const preservedHeight = preservedHeights.get(stat.id);
            const statElement = createStatElement(stat, value, preservedHeight);
            const columnIndex = stat.column || 0;
            if (columns[columnIndex]) columns[columnIndex].appendChild(statElement);
        });

        const fragment = document.createDocumentFragment();
        columns.forEach(col => fragment.appendChild(col));
        displayArea.appendChild(fragment);

        updatePanelWidth();
        updateUndoRedoButtons(chatId);
    }

    function animateCounter(start, end, duration, onUpdate) {
        let startTime = null;
        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            onUpdate(start + (end - start) * progress);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    function updateStatsUI(chatId, newValues) {
        const chatStats = getChatStats(chatId);
        Object.keys(newValues).forEach(key => {
            const isLastRoll = key.endsWith('_lastRoll');
            const statId = isLastRoll ? key.replace('_lastRoll', '') : key;
            const statConfig = chatStats.config.find(c => c.id === statId);
            if (!statConfig) return;

            const container = document.querySelector(`[data-stat-id="${statId}"]`);
            if (!container) return;

            if (isLastRoll && statConfig.showLastRoll) {
                const toggleButton = container.querySelector('.stat-value-toggle');
                if (toggleButton) {
                    toggleButton.textContent = `Last: ${newValues[key]}`;
                    toggleButton.classList.remove('dice-reveal');
                    void toggleButton.offsetWidth;
                    toggleButton.classList.add('dice-reveal');
                    setTimeout(() => toggleButton.classList.remove('dice-reveal'), 1000);
                }
                return;
            }

            const oldValue = parseFloat(chatStats.values[statId]) || 0;
            const newValue = parseFloat(newValues[statId]) || 0;
            const delta = newValue - oldValue;

            if (delta !== 0 && ['resource', 'progress', 'numeric'].includes(statConfig.type)) {
                const labelContainer = container.querySelector('.stat-label-container');
                if (labelContainer) {
                    labelContainer.querySelector('.stat-delta')?.remove();
                    const deltaEl = document.createElement('span');
                    deltaEl.className = 'stat-delta';
                    deltaEl.textContent = `(${delta > 0 ? '+' : ''}${Math.round(delta * 10) / 10})`;
                    deltaEl.classList.add(delta > 0 ? 'positive' : 'negative');
                    labelContainer.appendChild(deltaEl);
                }
            }

            switch (statConfig.type) {
                case 'time':
                    container.querySelector('.time-display').textContent = newValues[statId] || '';
                    chatStats.values[statId] = newValues[statId];
                    break;
                case 'resource':
                case 'progress':{
                    const max = statConfig.max || 100;
                    const clampedValue = Math.max(statConfig.min ?? 0, Math.min(newValue, max));
                    if (statConfig.style === 'bar') {
                        const barFg = container.querySelector('.stat-bar-fg');
                        barFg.style.width = `${max > 0 ? (clampedValue / max) * 100 : 0}%`;
                        animateCounter(oldValue, clampedValue, 1200, (val) => container.querySelector('.stat-bar-text').textContent = `${Math.round(val)} / ${max}`);
                        barFg.classList.remove('shine-animation');
                        void barFg.offsetWidth;
                        barFg.classList.add('shine-animation');
                    } else {
                        const displayCount = Math.min(max, 10);
                        const oldFilled = max > 0 ? Math.round((oldValue / max) * displayCount) : 0;
                        const newFilled = max > 0 ? Math.round((clampedValue / max) * displayCount) : 0;
                        container.querySelectorAll('.stat-emoji-display span').forEach((span, i) => {
                            const shouldBeFilled = i < newFilled;
                            if (shouldBeFilled && i >= oldFilled) {
                                span.classList.remove('empty');
                                span.classList.add('emoji-pop');
                                setTimeout(() => span.classList.remove('emoji-pop'), 800);
                            } else {
                                span.classList.toggle('empty', !shouldBeFilled);
                            }
                        });
                        const toggle = container.querySelector('.stat-value-toggle');
                        if (toggle.textContent !== '👁️') {
                            animateCounter(oldValue, clampedValue, 1200, (val) => toggle.textContent = `(${Math.round(val)}/${max})`);
                        }
                    }
                    chatStats.values[statId] = clampedValue;
                    break;
                }
                case 'numeric':{
                    animateCounter(oldValue, newValue, 1200, (val) => container.querySelector('.stat-numeric').textContent = Math.round(val));
                    chatStats.values[statId] = newValue;
                    break;
                }
                default:{
                    const textarea = container.querySelector('textarea');
                    textarea.value = String(newValues[statId] || '');
                    chatStats.values[statId] = textarea.value;
                    textarea.classList.remove('text-updated');
                    void textarea.offsetWidth;
                    textarea.classList.add('text-updated');
                    break;
                }
            }
        });
        saveState();
    }

    function readConfigFromModal() {
        const config = [];
        document.querySelectorAll('#stats-config-list .config-column').forEach((column, colIndex) => {
            column.querySelectorAll('.tracker-config').forEach(div => {
                const statId = div.dataset.id;
                const oldConfig = getChatStats(getCurrentChatId()).config.find(c => c.id === statId) || {};
                const currentValStr = div.querySelector('.tracker-current')?.value;
                const type = div.querySelector('.tracker-type').value;

                let newStat = {
                    id: statId,
                    name: div.querySelector('.tracker-name').value.trim(),
                    type: type,
                    emoji: div.querySelector('.btn-pick-emoji')?.textContent.trim() || '❤️',
                    column: colIndex,
                    isActive: oldConfig.isActive ?? true,
                };

                if (['resource', 'progress'].includes(type)) {
                    Object.assign(newStat, {
                        min: parseInt(div.querySelector('.tracker-min')?.value, 10) || 0,
                        max: parseInt(div.querySelector('.tracker-max')?.value, 10) || 100,
                        style: div.querySelector('.tracker-style')?.value || 'bar',
                        current: currentValStr ? parseInt(currentValStr, 10) : null,
                    });
                } else if (type === 'numeric') {
                    newStat.current = currentValStr ? parseInt(currentValStr, 10) : null;
                } else if (['status', 'inventory', 'quests', 'my_thoughts', 'others_thoughts'].includes(type)) {
                    newStat.initialTextValue = div.querySelector('.tracker-text-initial')?.value || '';
                    if (['status', 'inventory', 'quests'].includes(type)) {
                        newStat.characterName = div.querySelector('.tracker-character-name')?.value.trim() || '';
                    }
                } else if (type === 'time') {
                    newStat.timeMode = div.querySelector('.tracker-time-mode')?.value || 'clock';
                    newStat.initialTimeValue = div.querySelector('.tracker-time-initial')?.value.trim() || '';
                } else if (type === 'dice') {
                    newStat.showLastRoll = oldConfig.showLastRoll || false;
                }
                config.push(newStat);
            });
        });
        return config;
    }

    function validateTrackerConfig(config) {
        const counts = config.reduce((acc, stat) => {
            acc[stat.type] = (acc[stat.type] || 0) + 1;
            return acc;
        }, {});
        if (counts.my_thoughts > 1) return "You can only have one 'My Thoughts' tracker.";
        if (counts.others_thoughts > 1) return "You can only have one 'Others' Thoughts' tracker.";
        if (counts.dice > 1) return "You can only have one 'Dice' tracker.";
        return null;
    }

    function renderConfigModal(configData) {
        const listArea = document.getElementById('stats-config-list');
        listArea.innerHTML = '';
        const chatId = getCurrentChatId();
        const config = configData || getChatStats(getCurrentChatId()).config;
        const values = getChatStats(getCurrentChatId()).values;
        const savedHeights = textareaHeights[chatId] || {};

        const numColumns = config.length > 0 ? config.reduce((max, stat) => Math.max(max, stat.column || 0), 0) + 1 : 1;
        listArea.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;

        const columns = Array.from({ length: numColumns }, (_, i) => {
            const colDiv = document.createElement('div');
            colDiv.className = 'config-column';
            colDiv.dataset.columnIndex = i;
            return colDiv;
        });

        config.forEach(stat => {
            const div = document.createElement('div');
            div.className = 'tracker-config';
            div.dataset.id = stat.id;
            const type = stat.type;

            const isResourceOrProgress = ['resource', 'progress'].includes(type);
            const isNumeric = type === 'numeric';
            const isCharBound = ['status', 'inventory', 'quests'].includes(type);
            const isTime = type === 'time';
            const isTextBased = isCharBound || ['my_thoughts', 'others_thoughts'].includes(type);

            div.innerHTML = `
            <span class="drag-handle" draggable="true">⠿</span>
            <input type="text" class="tracker-name" placeholder="Name" value="${stat.name || ''}">
            <select class="tracker-type">
                <option value="resource" ${type === 'resource' ? 'selected' : ''}>Resource</option>
                <option value="progress" ${type === 'progress' ? 'selected' : ''}>Progress</option>
                <option value="numeric" ${isNumeric ? 'selected' : ''}>Numeric</option>
                <option value="status" ${type === 'status' ? 'selected' : ''}>Status</option>
                <option value="inventory" ${type === 'inventory' ? 'selected' : ''}>Inventory</option>
                <option value="quests" ${type === 'quests' ? 'selected' : ''}>Quests/Tasks</option>
                <option value="time" ${isTime ? 'selected' : ''}>Date & Time</option>
                <option value="dice" ${type === 'dice' ? 'selected' : ''}>Dice</option>
                <option value="my_thoughts" ${type === 'my_thoughts' ? 'selected' : ''}>My Thoughts</option>
                <option value="others_thoughts" ${type === 'others_thoughts' ? 'selected' : ''}>Others' Thoughts</option>
            </select>
            <button class="btn-pick-emoji">${stat.emoji || '📅'}</button>
            <button class="btn-delete-tracker">X</button>
            <div class="sub-config" style="grid-column: 1 / -1; display: flex; flex-wrap: wrap;">
                <div class="sub-config-item" style="display: ${isResourceOrProgress ? 'flex' : 'none'};"><span>Min</span><input type="number" class="tracker-min" value="${stat.min ?? 0}"></div>
                <div class="sub-config-item" style="display: ${isResourceOrProgress || isNumeric ? 'flex' : 'none'};"><span>Current</span><input type="number" class="tracker-current" value="${configData ? (stat.current ?? 0) : (values[stat.id] ?? stat.current ?? 0)}"></div>
                <div class="sub-config-item" style="display: ${isResourceOrProgress ? 'flex' : 'none'};"><span>Max</span><input type="number" class="tracker-max" value="${stat.max ?? 100}"></div>
                <div class="sub-config-item" style="display: ${isResourceOrProgress ? 'flex' : 'none'};"><span>Style</span><select class="tracker-style"><option value="bar" ${stat.style === 'bar' ? 'selected' : ''}>Bar</option><option value="emoji" ${stat.style === 'emoji' ? 'selected' : ''}>Emoji</option></select></div>
                <div class="sub-config-item" style="display: ${isCharBound ? 'flex' : 'none'};"><span>Character Name</span><input type="text" class="tracker-character-name" value="${stat.characterName || ''}"></div>
                <div class="sub-config-item" style="display: ${isTime ? 'flex' : 'none'};">
                    <span>Mode</span>
                    <select class="tracker-time-mode">
                        <option value="clock" ${stat.timeMode === 'clock' ? 'selected' : ''}>Clock & Calendar</option>
                        <option value="countdown" ${stat.timeMode === 'countdown' ? 'selected' : ''}>Countdown</option>
                        <option value="stopwatch" ${stat.timeMode === 'stopwatch' ? 'selected' : ''}>Stopwatch</option>
                    </select>
                </div>
                <div class="sub-config-item" style="display: ${isTime ? 'flex' : 'none'};">
                    <span>Current Value</span>
                    <input type="text" class="tracker-time-initial" placeholder="e.g., ПН, 14:30 or 2d 12h" value="${configData ? (stat.initialTimeValue ?? '') : (values[stat.id] ?? stat.initialTimeValue ?? '')}">
                </div>
                <div class="sub-config-item" style="display: ${isTextBased ? 'flex' : 'none'}; flex-basis: 100%;">
                    <span>Initial Content</span>
                    <textarea class="tracker-text-initial">${configData ? (stat.initialTextValue ?? '') : (values[stat.id] ?? stat.initialTextValue ?? '')}</textarea>
                </div>
            </div>`;

            if (isTextBased) {
                const textarea = div.querySelector('.tracker-text-initial');
                const savedHeight = savedHeights[stat.id];
                if (textarea && savedHeight) {
                    textarea.style.height = savedHeight;
                }
            }

            const columnIndex = Math.min(stat.column || 0, numColumns - 1);
            if (columns[columnIndex]) columns[columnIndex].appendChild(div);
        });

        const fragment = document.createDocumentFragment();
        columns.forEach(col => fragment.appendChild(col));
        listArea.appendChild(fragment);

        updatePanelWidth();
    }

    function saveConfigFromModal(chatId) {
        const textareaHeights = new Map();
        document.querySelectorAll('#stats-display-area .stat-text-area').forEach(textarea => {
            const container = textarea.closest('.stat-container');
            if (container?.dataset.statId && textarea.style.height) {
                textareaHeights.set(container.dataset.statId, textarea.style.height);
            }
        });

        const newConfig = readConfigFromModal();
        const validationError = validateTrackerConfig(newConfig);
        if (validationError) { alert(validationError); return; }

        const chatStats = getChatStats(chatId);
        const newValues = {};
        const oldValues = { ...chatStats.values };

        newConfig.forEach(stat => {
            if (stat.type === 'time') {
                newValues[stat.id] = stat.initialTimeValue;
            } else if (['my_thoughts', 'others_thoughts', 'status', 'inventory', 'quests'].includes(stat.type)) {

                newValues[stat.id] = stat.initialTextValue;
            } else if (stat.type === 'dice') {
                newValues[stat.id] = oldValues[stat.id] ?? 20;
            } else if (['resource', 'progress', 'numeric'].includes(stat.type)) {
                newValues[stat.id] = (stat.current !== null && !isNaN(stat.current)) ? stat.current : (oldValues[stat.id] ?? (stat.type === 'numeric' ? 0 : stat.max));
            }
        });

        chatStats.config = newConfig;
        chatStats.values = newValues;

        const lastStateInHistory = chatStats.history[chatStats.history.length - 1];
        if (!lastStateInHistory || JSON.stringify(lastStateInHistory) !== JSON.stringify(newValues)) {
            chatStats.history.push(JSON.parse(JSON.stringify(newValues)));
        }
        chatStats.historyIndex = chatStats.history.length - 1;

        updateUndoRedoButtons(chatId);
        saveState();
        renderStatsDisplay(chatId, textareaHeights);
        document.getElementById('stats-config-modal').style.display = 'none'
    }

    function createSuperPrompt(body, chatStats) {
        const { config, values } = chatStats;
        if (config.length === 0 || !body.contents || body.contents.length === 0) return;

        const userMessages = body.contents.filter(c => c.role === 'user' && c.parts?.[0]?.text);
        const lastUserText = userMessages.length > 0 ? userMessages[userMessages.length - 1].parts[0].text : '';
        const lang = /[а-яА-ЯёЁ]/.test(lastUserText) ? 'ru' : 'en';
        const template = PROMPT_TEMPLATES[lang];

        const currentStats = {}, outputTemplate = {};
        let promptAddons = '';
        const activeConfig = config.filter(stat => stat.isActive);

        activeConfig.forEach(stat => {
            if (['resource', 'progress'].includes(stat.type)) {
                currentStats[stat.name] = { current: values[stat.id] || 0, min: stat.min, max: stat.max };
                outputTemplate[stat.name] = template.resource;
            } else if (stat.type === 'numeric') {
                currentStats[stat.name] = values[stat.id] || 0;
                outputTemplate[stat.name] = template.numeric;
            } else if (stat.type === 'quests') {
                const charName = stat.characterName ? ` (${stat.characterName})` : '';
                currentStats[`${stat.name}${charName}`] = values[stat.id] || (lang === 'ru' ? 'Нет активных заданий' : 'No active quests');
                outputTemplate[stat.name] = [template.quests.example];
            } else if (stat.type === 'time') {
                currentStats[`${stat.name} (${stat.timeMode})`] = values[stat.id] || stat.initialTimeValue || (stat.timeMode === 'clock' ? 'Понедельник, 12:00' : '0');
                outputTemplate[stat.name] = template.time.example;
            } else if (['status', 'inventory'].includes(stat.type)) {
                const charName = stat.characterName ? ` (${stat.characterName})` : '';
                currentStats[`${stat.name}${charName}`] = values[stat.id] || '';
                outputTemplate[stat.name] = [template[stat.type].example];
            } else if (['my_thoughts', 'others_thoughts'].includes(stat.type)) {
                currentStats[stat.name] = values[stat.id] || "";
                outputTemplate[stat.name] = template[stat.type];
            } else if (stat.type === 'dice') {
                const selectedDie = values[stat.id] || 20;
                promptAddons += ` ${template.dice.check.replace('{die}', String(selectedDie))}`;
                outputTemplate[stat.name] = template.dice.roll.replace('{die}', String(selectedDie));
            }
        });

        const addonMap = {
            resource: 'canChangeMinMax',
            progress: 'progressReactions',
            quests: 'questUpdates',
            time: 'timeUpdates',
            status: 'statuses',
            inventory: 'inventories',
        };
        const activeTypes = new Set(activeConfig.map(s => s.type));
        if (activeTypes.has('resource') || activeTypes.has('progress')) promptAddons += ` ${template.addons.boundaryReactions}`;
        if (activeTypes.has('my_thoughts') || activeTypes.has('others_thoughts')) promptAddons += ` ${template.addons.thoughts}`;

        Object.keys(addonMap).forEach(type => {
            if (activeTypes.has(type)) promptAddons += ` ${template.addons[addonMap[type]]}`;
        });
        promptAddons += ` ${template.addons.languageRule.replace('{lang}', template.languageName)}`;

        const systemInstructionText = template.systemInstruction.replace('{stats}', JSON.stringify(currentStats)).replace('{addons}', promptAddons);
        const formatInstructionText = template.formatInstruction.replace('{template}', JSON.stringify(outputTemplate));

        const systemInstruction = { role: "user", parts: [{ text: systemInstructionText }] };
        const formatInstruction = { role: "user", parts: [{ text: `OOC: Remember to use the exact keys from the template in your <STATS> block.${formatInstructionText}` }] };

        const lastUserMessageIndex = body.contents.map(c => c.role).lastIndexOf('user');
        if (lastUserMessageIndex !== -1) {
            body.contents.splice(lastUserMessageIndex, 0, systemInstruction);
        } else {
            body.contents.push(systemInstruction);
        }
        body.contents.push(formatInstruction);
    }

    function parseAndCleanResponse(data, chatStats) {
        const lastPart = data.candidates?.[0]?.content?.parts?.slice(-1)[0];
        if (!lastPart?.text) return;

        const statsRegex = /<STATS>([\s\S]*?)<\/STATS>/s;
        const match = lastPart.text.match(statsRegex);
        if (!match) return;

        lastPart.text = lastPart.text.replace(statsRegex, "").trim();
        let newValues = {};
        let configChanged = false;

        try {
            const cleanedJsonString = match[1].replace(/[\u2000-\u200F\u2028-\u202F\uFEFF]/g, ' ');
            const parsedStats = JSON.parse(cleanedJsonString);
            let availableStats = [...chatStats.config];

            const normalizeString = (str) => {
                if (typeof str !== 'string') return '';
                return str.toLowerCase().replace(/[\s\u2000-\u200F\u2028-\u202F\uFEFF()]/g, ' ').replace(/\s+/g, ' ').trim();
            };

            for (const responseKey in parsedStats) {
                if (availableStats.length === 0) break;
                const foundValue = parsedStats[responseKey];
                let bestMatchStat = null;

                let bestMatch = { stat: null, score: Infinity };
                const normalizedResponseKey = normalizeString(responseKey);

                for (const stat of availableStats) {
                    const normalizedStatName = normalizeString(`${stat.name} ${stat.characterName || ''}`);
                    if (!normalizedStatName || !normalizedResponseKey) continue;

                    const score = levenshtein(normalizedResponseKey, normalizedStatName);
                    if (score < bestMatch.score) {
                        bestMatch = { stat, score };
                    }
                }

                if (bestMatch.stat && bestMatch.score < 3) {
                    bestMatchStat = bestMatch.stat;
                }

                if (!bestMatchStat) {
                    const keyLower = responseKey.toLowerCase().trim();
                    const typeMap = {
                        'dice': 'dice', 'кубик': 'dice', 'бросок': 'dice',
                        'status': 'status', 'статус': 'status',
                        'inventory': 'inventory', 'инвентарь': 'inventory',
                        'quests': 'quests', 'tasks': 'quests', 'задачи': 'quests', 'квесты': 'quests',
                        'my_thoughts': 'my_thoughts', 'thoughts': 'my_thoughts', 'мысли': 'my_thoughts',
                        'others_thoughts': 'others_thoughts'
                    };
                    const mappedType = typeMap[keyLower];
                    if (mappedType) {
                        const statOfType = availableStats.find(s => s.type === mappedType);
                        if (statOfType) bestMatchStat = statOfType;
                    }
                }

                if (bestMatchStat) {
                    const stat = bestMatchStat;

                    switch (stat.type) {
                        case 'quests':
                            newValues[stat.id] = Array.isArray(foundValue) ? foundValue.join('\n') : String(foundValue);
                            break;
                        case 'dice': {
                            let rollResult = parseInt(foundValue, 10);
                            if (!isNaN(rollResult)) {
                                newValues[stat.id + "_lastRoll"] = rollResult;
                                chatStats.values[stat.id + "_lastRoll"] = rollResult;
                            }
                            break;
                        }
                        case 'resource':
                        case 'progress':
                            if (typeof foundValue === 'object' && foundValue !== null) {
                                if (foundValue.hasOwnProperty('min')) { stat.min = parseInt(foundValue.min, 10) || 0; configChanged = true; }
                                if (foundValue.hasOwnProperty('max')) { stat.max = parseInt(foundValue.max, 10) || 100; configChanged = true; }
                                const currentVal = parseInt(foundValue.current, 10);
                                if (!isNaN(currentVal)) newValues[stat.id] = currentVal;
                            } else {
                                const numValue = parseInt(String(foundValue).split('/')[0].trim(), 10);
                                if (!isNaN(numValue)) newValues[stat.id] = numValue;
                            }
                            break;
                        case 'numeric': {
                            const numValue = parseInt(foundValue, 10);
                            if (!isNaN(numValue)) newValues[stat.id] = numValue;
                            break;
                        }
                        default:
                            newValues[stat.id] = Array.isArray(foundValue) ? foundValue.join('\n') : String(foundValue);
                            break;
                    }
                    availableStats = availableStats.filter(s => s.id !== stat.id);
                }
            }
        } catch (e) { console.error("Stats DLC: Failed to parse stats JSON.", e); }

        if (Object.keys(newValues).length > 0) {
            updateStatsUI(getCurrentChatId(), newValues);
            pushStateToHistory(getCurrentChatId());
        }

        if (configChanged) {
            saveState();
            setTimeout(() => {
                const preservedHeights = new Map();
                document.querySelectorAll('#stats-display-area .stat-text-area').forEach(textarea => {
                    const container = textarea.closest('.stat-container');
                    if (container?.dataset.statId) {
                        preservedHeights.set(container.dataset.statId, textarea.style.height || getComputedStyle(textarea).height);
                    }
                });
                renderStatsDisplay(getCurrentChatId(), preservedHeights);
            }, 1300);
        }
    }

    function openEmojiPicker(triggerButton) {
        document.querySelector('emoji-picker')?.remove();
        const picker = document.createElement('emoji-picker');
        document.body.appendChild(picker);
        Object.assign(picker.style, { position: 'fixed', zIndex: '10002', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' });

        const onEmojiClick = (e) => {
            triggerButton.textContent = e.detail.unicode;
            cleanup();
        };
        const onOutsideClick = (e) => {
            if (!picker.contains(e.target) && e.target !== triggerButton) {
                cleanup();
            }
        };
        const cleanup = () => {
            picker.remove();
            document.removeEventListener('click', onOutsideClick);
        };

        picker.addEventListener('emoji-click', onEmojiClick, { once: true });
        setTimeout(() => document.addEventListener('click', onOutsideClick), 0);
    }

    function populatePresetSelect() {
        const select = document.getElementById('stats-preset-select');
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select Preset...</option>';
        Object.keys(presets).sort().forEach(name => select.add(new Option(name, name)));
        select.value = currentValue;
    }

    function showEmojiSuggestions(inputElement) {
        document.querySelector('.emoji-suggestion-box')?.remove();
        const value = inputElement.value.toLowerCase().trim();
        if (value.length < 2 || emojiData.size === 0) return;
        const terms = value.split(' ').filter(t => t.length > 1);
        const suggestions = [];
        for (const emoji of emojiData.values()) {
            if (suggestions.length >= 15) break;
            if (terms.every(term => emoji.search.includes(term))) { suggestions.push(emoji); }
        }
        if (suggestions.length === 0) return;

        const suggestionBox = document.createElement('div');
        suggestionBox.className = 'emoji-suggestion-box';
        const parentConfig = inputElement.closest('.tracker-config');
        parentConfig.appendChild(suggestionBox);
        suggestions.forEach(emoji => {
            const btn = document.createElement('button');
            btn.textContent = emoji.emoji;
            btn.onmousedown = (e) => {
                e.preventDefault();
                e.target.closest('.tracker-config').querySelector('.btn-pick-emoji').textContent = emoji.emoji;
                document.querySelector('.emoji-suggestion-box')?.remove();
            };
            suggestionBox.appendChild(btn);
        });
    }

    function registerEventListeners() {
        const panel = document.getElementById('gemini-stats-panel');
        const modal = document.getElementById('stats-config-modal');
        const displayArea = document.getElementById('stats-display-area');
        const configList = document.getElementById('stats-config-list');
        const presetSelect = document.getElementById('stats-preset-select');

        document.getElementById('toggle-tracking-enabled').addEventListener('change', (e) => {
            panelState.trackingEnabled = e.target.checked;
            saveState();
        });

        document.getElementById('stats-main-toggle').addEventListener('click', () => {
            panelState.collapsed = !panelState.collapsed;
            panel.classList.toggle('collapsed');
            saveState();
        });

        document.getElementById('btn-toggle-position').addEventListener('click', () => {
            panelState.position = (panelState.position === 'top') ? 'bottom' : 'top';
            applyPanelPosition();
            saveState();
        });

        document.getElementById('btn-manage-stats').addEventListener('click', () => {
            if (!getCurrentChatId()) {
                alert("Please open a chat first.");
                return;
            }
            modal.style.display = 'flex';
            requestAnimationFrame(() => {
                renderConfigModal();
                updatePanelWidth();
                populatePresetSelect();
                presetSelect.dispatchEvent(new Event('change'));
            });
        });

        document.getElementById('btn-save-stats-config').addEventListener('click', () => saveConfigFromModal(getCurrentChatId()));
        document.getElementById('btn-cancel-stats-config').addEventListener('click', () => {
            modal.style.display = 'none';
            document.querySelector('.emoji-suggestion-box')?.remove();
        });

        document.getElementById('btn-add-tracker').addEventListener('click', () => {
            const conf = readConfigFromModal();
            conf.push({ id: `stat_${Date.now()}`, name: '', type: 'resource', max: 100, min: 0, style: 'bar', emoji: '❤️', isActive: true, column: 0 });
            renderConfigModal(conf);
        });

        document.getElementById('btn-undo-stats').addEventListener('click', () => {
            const chatId = getCurrentChatId();
            if (!chatId) return;
            const chatStats = getChatStats(chatId);
            if (chatStats.historyIndex > 0) {
                chatStats.historyIndex--;
                loadStateFromHistory(chatId);
            }
        });

        document.getElementById('btn-redo-stats').addEventListener('click', () => {
            const chatId = getCurrentChatId();
            if (!chatId) return;
            const chatStats = getChatStats(chatId);
            if (chatStats.historyIndex < chatStats.history.length - 1) {
                chatStats.historyIndex++;
                loadStateFromHistory(chatId);
            }
        });

        document.getElementById('btn-commit-state').addEventListener('click', () => {
            const chatId = getCurrentChatId();
            if (!chatId || !confirm("This will clear the undo/redo history and set the current tracker values as the new starting point. Are you sure?")) return;

            const chatStats = getChatStats(chatId);
            const currentState = JSON.parse(JSON.stringify(chatStats.values));

            chatStats.history = [currentState];
            chatStats.historyIndex = 0;

            updateUndoRedoButtons(chatId);

            saveState();
        });

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                document.getElementById('btn-undo-stats').click();
            }
            if (e.ctrlKey && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                document.getElementById('btn-redo-stats').click();
            }
        });

        presetSelect.addEventListener('change', () => {
            const isSelected = !!presetSelect.value;
            document.getElementById('stats-btn-save-preset').disabled = !isSelected;
            document.getElementById('stats-btn-delete-preset').disabled = !isSelected;
        });

        document.getElementById('stats-btn-add-preset').addEventListener('click', async () => {
            const presetConfig = readConfigFromModal();
            if (validateTrackerConfig(presetConfig)) return alert(validateTrackerConfig(presetConfig));
            const name = prompt("Enter a name for the new preset:");
            if (name?.trim()) {
                presets[name.trim()] = presetConfig;
                await saveState();
                populatePresetSelect();
                presetSelect.value = name.trim();
                presetSelect.dispatchEvent(new Event('change'));
            }
        });

        document.getElementById('stats-btn-save-preset').addEventListener('click', async () => {
            const name = presetSelect.value;
            if (!name) return;
            const presetConfig = readConfigFromModal();
            if (validateTrackerConfig(presetConfig)) return alert(validateTrackerConfig(presetConfig));
            if (confirm(`Overwrite preset "${name}"?`)) {
                presets[name] = presetConfig;
                await saveState();
            }
        });

        document.getElementById('stats-btn-load-preset').addEventListener('click', () => {
            const name = presetSelect.value;
            if (name && presets[name]) renderConfigModal(JSON.parse(JSON.stringify(presets[name])));
        });

        document.getElementById('stats-btn-delete-preset').addEventListener('click', async () => {
            const name = presetSelect.value;
            if (name && presets[name] && confirm(`Delete preset "${name}"?`)) {
                delete presets[name];
                await saveState();
                populatePresetSelect();
                presetSelect.dispatchEvent(new Event('change'));
            }
        });


        let dragState = {
            isInteracting: false,
            isDragging: false,
            isResizing: false,
            startX: 0,
            startY: 0,
            initialLeft: 0,
            initialHeight: 0,
            panelWidth: 0,
            minResizeHeight: 0,
            overlay: null
        };

        function createOverlay() {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.zIndex = '10000';
            overlay.style.userSelect = 'none';
            overlay.style.cursor = dragState.isResizing ? 'ns-resize' : 'move';
            document.body.appendChild(overlay);
            return overlay;
        }

        function startInteraction(e) {
            const isDragHandle = e.target.id === 'stats-header';
            const isResizeHandle = e.target.classList.contains('resize-handle');
            if (!isDragHandle && !isResizeHandle) return;

            e.preventDefault();
            dragState.isInteracting = true;
            dragState.isDragging = isDragHandle;
            dragState.isResizing = isResizeHandle;

            dragState.startX = e.clientX;
            dragState.startY = e.clientY;
            dragState.initialLeft = panel.offsetLeft;
            dragState.initialHeight = panel.offsetHeight;
            dragState.panelWidth = panel.offsetWidth;
            dragState.minResizeHeight = document.getElementById('stats-header').offsetHeight + 20;

            panel.style.transition = 'none';
            panel.style.willChange = 'transform, height';

            dragState.overlay = createOverlay();

            dragState.overlay.addEventListener('mousemove', onInteractionMove);
            dragState.overlay.addEventListener('mouseup', stopInteraction, { once: true });
            dragState.overlay.addEventListener('mouseleave', stopInteraction, { once: true });
        }

        function onInteractionMove(e) {
            if (!dragState.isInteracting) return;

            if (dragState.isDragging) {
                const deltaX = e.clientX - dragState.startX;
                const newLeft = Math.max(0, Math.min(dragState.initialLeft + deltaX, window.innerWidth - dragState.panelWidth));
                panel.style.transform = `translate3d(${newLeft - dragState.initialLeft}px, 0, 0)`;
            }

            if (dragState.isResizing) {
                const deltaY = panelState.position === 'top' ? e.clientY - dragState.startY : dragState.startY - e.clientY;
                const newHeight = Math.max(dragState.minResizeHeight, dragState.initialHeight + deltaY);
                panel.style.height = `${newHeight}px`;
            }
        }

        function stopInteraction(e) {
            if (!dragState.isInteracting) return;

            panel.style.willChange = 'auto';
            panel.style.transition = 'none';

            if (dragState.isDragging) {
                const finalDeltaX = e.clientX - dragState.startX;
                const finalLeft = Math.max(0, Math.min(dragState.initialLeft + finalDeltaX, window.innerWidth - dragState.panelWidth));

                panel.style.transform = '';
                panel.style.left = `${finalLeft}px`;
                panelState.left = panel.style.left;
            }
            setTimeout(() => {
                panel.style.transition = 'transform 0.4s ease-out';
            }, 0);
            if (dragState.isResizing) {
                panelState.height = panel.style.height;
            }

            if (dragState.overlay) {
                document.body.removeChild(dragState.overlay);
                dragState.overlay = null;
            }

            dragState.isInteracting = false;
            dragState.isDragging = false;
            dragState.isResizing = false;

            saveState();
        }

        panel.addEventListener('mousedown', startInteraction);


        let draggedElement = null;
        let isThrottled = false;

        const handleDragOver = (e) => {
            if (!draggedElement) return;
            e.preventDefault();
            if (isThrottled) return;
            isThrottled = true;

            requestAnimationFrame(() => {
                if (!draggedElement) {
                    isThrottled = false;
                    return;
                }

                const container = draggedElement.closest('#stats-display-area, #stats-config-list');
                if (!container) {
                    isThrottled = false;
                    return;
                }

                const isDisplayArea = container.id === 'stats-display-area';
                const itemSelector = isDisplayArea ? '.stat-container' : '.tracker-config';
                const columnSelector = isDisplayArea ? '.stats-column' : '.config-column';

                const columns = [...container.querySelectorAll(columnSelector)];
                let targetColumnEl = null;
                for (const col of columns) {
                    const colRect = col.getBoundingClientRect();
                    if (e.clientX >= colRect.left && e.clientX <= colRect.right) {
                        targetColumnEl = col;
                        break;
                    }
                }
                if (!targetColumnEl && columns.length > 0) {
                    const firstColumnRect = columns[0].getBoundingClientRect();
                    const lastColumnRect = columns[columns.length - 1].getBoundingClientRect();
                    if (e.clientX < firstColumnRect.left) {
                        targetColumnEl = columns[0];
                    } else if (e.clientX > lastColumnRect.right) {
                        targetColumnEl = columns[columns.length - 1];
                    }
                }
                if (!targetColumnEl) {
                    isThrottled = false;
                    return;
                }

                container.querySelectorAll(`${columnSelector}.drag-over`).forEach(c => c.classList.remove('drag-over'));
                targetColumnEl.classList.add('drag-over');

                const afterElement = [...targetColumnEl.querySelectorAll(`${itemSelector}:not(.dragging)`)]
                .find(child => e.clientY < child.getBoundingClientRect().top + child.getBoundingClientRect().height / 2);

                if (afterElement) {
                    targetColumnEl.insertBefore(draggedElement, afterElement);
                } else {
                    targetColumnEl.appendChild(draggedElement);
                }

                const panelElement = isDisplayArea ? panel : modal.querySelector('.modal-content');
                const columnCount = container.querySelectorAll(columnSelector).length;
                if (columnCount < MAX_COLUMNS && e.clientX > panelElement.getBoundingClientRect().right - 40 && !container.querySelector(`[data-column-index="${columnCount}"]`)) {
                    const newCol = document.createElement('div');
                    newCol.className = columnSelector.substring(1);
                    newCol.dataset.columnIndex = columnCount;
                    container.appendChild(newCol);
                    container.style.gridTemplateColumns = `repeat(${columnCount + 1}, 1fr)`;
                    updatePanelWidth();
                }
                isThrottled = false;
            });
        };

        document.addEventListener('dragstart', (e) => {
            const statContainer = e.target.closest('.stat-container');
            const configContainer = e.target.closest('.tracker-config');
            const isDragHandle = e.target.classList.contains('drag-handle');

            let target = null;
            if (statContainer && !e.target.closest('.draggable-header')) {
                target = statContainer;
            } else if (configContainer && isDragHandle) {
                target = configContainer;
            }

            if (target) {
                draggedElement = target;
                setTimeout(() => draggedElement.classList.add('dragging'), 0);
            }
        });

        document.addEventListener('dragend', (e) => {
            if (!draggedElement) return;
            const container = draggedElement.closest('#stats-display-area, #stats-config-list');

            draggedElement.classList.remove('dragging');
            if (container) {
                container.querySelectorAll('.drag-over').forEach(c => c.classList.remove('drag-over'));
            }
            if (container && container.id === 'stats-display-area') {
                const chatId = getCurrentChatId();
                if (chatId) {
                    const chatStats = getChatStats(chatId);
                    const newConfig = [];
                    displayArea.querySelectorAll('.stats-column').forEach((column, colIndex) => {
                        column.querySelectorAll('.stat-container').forEach(trackerEl => {
                            const stat = chatStats.config.find(s => s.id === trackerEl.dataset.statId);
                            if (stat) {
                                stat.column = colIndex;
                                newConfig.push(stat);
                            }
                        });
                    });
                    chatStats.config = newConfig;
                    saveState().then(() => renderStatsDisplay(chatId));
                }
            } else if (container && container.id === 'stats-config-list') {
                renderConfigModal(readConfigFromModal());
            }

            draggedElement = null;
        });

        document.addEventListener('dragover', handleDragOver);

        configList.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete-tracker')) {
                e.target.closest('.tracker-config').remove();
                renderConfigModal(readConfigFromModal());
            } else if (e.target.classList.contains('btn-pick-emoji')) {
                openEmojiPicker(e.target);
            }
        });

        configList.addEventListener('change', (e) => { if (e.target.classList.contains('tracker-type')) renderConfigModal(readConfigFromModal()); });
        const debouncedShowEmojiSuggestions = debounce(showEmojiSuggestions, 300);
        configList.addEventListener('input', (e) => {
            if (e.target.classList.contains('tracker-name')) {
                debouncedShowEmojiSuggestions(e.target);
            }
        });
        configList.addEventListener('focusout', (e) => { if (e.target.classList.contains('tracker-name')) setTimeout(() => document.querySelector('.emoji-suggestion-box')?.remove(), 200); });

        displayArea.addEventListener('click', (e) => {
            const chatId = getCurrentChatId();
            if (!chatId) return;
            const container = e.target.closest('.stat-container');
            if (!container) return;
            const chatStats = getChatStats(chatId);
            const stat = chatStats.config.find(s => s.id === container.dataset.statId);
            if (!stat) return;

            if (e.target.classList.contains('tracker-toggle-indicator')) {
                stat.isActive = !stat.isActive;
                container.classList.toggle('inactive-tracker', !stat.isActive);
                saveState();
            } else if (e.target.classList.contains('die-button')) {
                chatStats.values[stat.id] = parseInt(e.target.dataset.dieValue, 10);
                saveState().then(() => renderStatsDisplay(chatId));
            } else if (e.target.closest('.stat-value-toggle')) {
                const toggleButton = e.target.closest('.stat-value-toggle');
                if (['resource', 'progress'].includes(stat.type)) {
                    stat.showValue = !stat.showValue;
                    toggleButton.textContent = stat.showValue ? `(${chatStats.values[stat.id] || 0}/${stat.max})` : '👁️';
                } else if (stat.type === 'dice') {
                    stat.showLastRoll = !stat.showLastRoll;
                    const lastRoll = chatStats.values[stat.id + "_lastRoll"];
                    toggleButton.textContent = stat.showLastRoll ? `Last: ${lastRoll === undefined ? 'N/A' : lastRoll}` : '👁️';
                }
                saveState();
            }
        });

        let lastChatId = null;
        setInterval(() => {
            const chatId = getCurrentChatId();
            if (chatId !== lastChatId) {
                lastChatId = chatId;
                if (chatId) renderStatsDisplay(chatId);
            }
        }, 1000);

        document.addEventListener('gemini:modifyRequest', (e) => {
            if (panelState.trackingEnabled) {
                const id = getCurrentChatId();
                if (id && getChatStats(id).config.length > 0) createSuperPrompt(e.detail.body, getChatStats(id));
            }
        });

        document.addEventListener('gemini:processResponse', (e) => {
            if (panelState.trackingEnabled) {
                const id = getCurrentChatId();
                if (id && getChatStats(id).config.length > 0 && e.detail.data.candidates) parseAndCleanResponse(e.detail.data, getChatStats(id));
            }
        });

        displayArea.addEventListener('mouseup', (e) => {
            if (e.target.classList.contains('stat-text-area')) {
                const textarea = e.target;
                const container = textarea.closest('.stat-container');
                const chatId = getCurrentChatId();
                if (chatId && container?.dataset.statId) {
                    if (!textareaHeights[chatId]) {
                        textareaHeights[chatId] = {};
                    }
                    textareaHeights[chatId][container.dataset.statId] = textarea.style.height;
                    GM_setValue(STORAGE_KEYS.TEXTAREA_HEIGHTS, JSON.stringify(textareaHeights));
                }
            }
        });

        configList.addEventListener('mouseup', (e) => {
            if (e.target.classList.contains('tracker-text-initial')) {
                const textarea = e.target;
                const container = textarea.closest('.tracker-config');
                const chatId = getCurrentChatId();
                if (chatId && container?.dataset.id) {
                    if (!textareaHeights[chatId]) {
                        textareaHeights[chatId] = {};
                    }
                    textareaHeights[chatId][container.dataset.id] = textarea.style.height;
                    GM_setValue(STORAGE_KEYS.TEXTAREA_HEIGHTS, JSON.stringify(textareaHeights));
                }
            }
        });

    }



    function applyPanelPosition() {
        const panel = document.getElementById('gemini-stats-panel');
        const isTop = panelState.position === 'top';
        panel.classList.toggle('position-top', isTop);
        panel.classList.toggle('position-bottom', !isTop);
        document.getElementById('stats-main-toggle').textContent = isTop ? '▼' : '▲';
        updatePanelWidth();

        panel.style.left = panelState.left ?? `${(window.innerWidth / 2) - (panel.offsetWidth / 2)}px`;
        if (panelState.height) panel.style.height = panelState.height;
    }

    async function main() {
        const emojiPickerScript = document.createElement('script');
        emojiPickerScript.type = 'module';
        emojiPickerScript.src = 'https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js';
        document.head.appendChild(emojiPickerScript);

        let dpr = window.devicePixelRatio;
        const updateScale = () => document.documentElement.style.setProperty('--scale-factor', 1 / window.devicePixelRatio);
        const checkDpr = () => {
            if (window.devicePixelRatio !== dpr) {
                dpr = window.devicePixelRatio;
                updateScale();
            }
            requestAnimationFrame(checkDpr);
        };
        updateScale();
        checkDpr();

        await initializeEmojiDatabase();
        await loadState();

        buildHtml();
        getStyles();

        const initialChatId = getCurrentChatId();
        if (initialChatId) {
            const chatStats = getChatStats(initialChatId);
            if (chatStats.history.length === 0 && Object.keys(chatStats.values).length > 0) {
                const initialState = JSON.parse(JSON.stringify(chatStats.values));
                chatStats.history = [initialState];
                chatStats.historyIndex = 0;
                saveState();
            }
        }

        const panel = document.getElementById('gemini-stats-panel');
        panel.classList.toggle('collapsed', panelState.collapsed);
        document.getElementById('toggle-tracking-enabled').checked = panelState.trackingEnabled;

        applyPanelPosition();
        renderStatsDisplay(getCurrentChatId());
        registerEventListeners();
        document.dispatchEvent(new CustomEvent('gemini-dlc:stats:loaded'));
    }

    main();

})();