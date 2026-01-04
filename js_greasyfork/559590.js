// ==UserScript==
// @name         YouTube Filter: Home Only + Master Switch
// @namespace    http://tampermonkey.net/
// @version      13.0
// @description  Фильтр по просмотрам в рекомендациях
// @author       You
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559590/YouTube%20Filter%3A%20Home%20Only%20%2B%20Master%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/559590/YouTube%20Filter%3A%20Home%20Only%20%2B%20Master%20Switch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- НАСТРОЙКИ ---
    let IS_DEBUG = false;

    // --- 1. СТИЛИ ---
    const style = document.createElement('style');
    style.textContent = `
        /* КНОПКА ОТКРЫТИЯ МЕНЮ */
        #yt-filter-toggle-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
            background: #212121;
            border: 2px solid #3ea6ff;
            border-radius: 50%;
            cursor: pointer;
            z-index: 2147483648;
            display: none; /* Скрыта по умолчанию (покажем JS-ом) */
            justify-content: center;
            align-items: center;
            font-size: 24px;
            color: #3ea6ff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            transition: transform 0.2s, background 0.2s, opacity 0.3s;
        }
        #yt-filter-toggle-btn:hover {
            background: #3ea6ff;
            color: #000;
            transform: scale(1.1);
        }
        #yt-filter-toggle-btn.hidden-page {
            display: none !important;
        }

        /* МЕНЮ */
        #yt-view-filter-panel {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: #181818;
            color: #eee;
            padding: 15px;
            border-radius: 12px;
            z-index: 2147483647;
            box-shadow: 0 4px 25px rgba(0,0,0,0.9);
            border: 1px solid #333;
            font-family: Roboto, Arial, sans-serif;
            width: 220px;
            display: none;
            flex-direction: column;
            gap: 10px;
        }
        #yt-view-filter-panel.visible { display: flex; }

        /* Элементы меню */
        .yt-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
        .yt-row-check { display: flex; justify-content: flex-start; align-items: center; gap: 8px; font-size: 13px; margin-top:2px; }
        .yt-row-check label { cursor: pointer; }
        .yt-inp {
            background: #0f0f0f;
            border: 1px solid #444;
            color: white;
            padding: 5px;
            border-radius: 4px;
            width: 80px;
            font-size: 13px;
        }
        .yt-btn {
            background: #3ea6ff;
            color: #000;
            border: none;
            padding: 8px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            font-size: 13px;
            margin-top: 5px;
        }
        .yt-btn:hover { background: #65b8ff; }

        /* Master Switch */
        .yt-master-switch {
            width: 100%;
            padding: 8px;
            border-radius: 6px;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
            border: 1px solid #444;
            margin-bottom: 5px;
        }
        .yt-master-on { background: #1b3a1e; color: #4caf50; border-color: #2e5c32; }
        .yt-master-off { background: #3a1b1b; color: #f44336; border-color: #5c2e2e; }

        .yt-filter-hidden { display: none !important; }

        /* Рамки отладки */
        .yt-dbg-shorts { border: 4px solid #00bbff !important; box-sizing: border-box; position: relative; z-index: 5000; }
        .yt-dbg-mix { border: 4px solid #ff00ff !important; box-sizing: border-box; position: relative; z-index: 5000; }
        .yt-dbg-views { border: 4px solid #ff0000 !important; box-sizing: border-box; position: relative; z-index: 5000; opacity: 0.7; }
        .yt-dbg-ok { border: 2px solid #00ff00 !important; box-sizing: border-box; position: relative; z-index: 5000; opacity: 0.3; }
    `;
    document.head.appendChild(style);

    // --- 2. ПАРСИНГ ---
    function parseStringViewCount(text) {
        if (!text) return -1;
        let clean = text.toLowerCase()
            .replace(/&nbsp;/g, ' ')
            .replace(/\u00A0/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (clean.includes('зрител') || clean.includes('watching') || clean.includes('ждет')) return -2;
        if (clean.includes('нет просмотров') || clean.includes('no views')) return 0;

        const strictMatch = clean.match(/(\d+[.,]?\d*)\s*(тыс\.?|млн\.?|млрд\.?|k|m|b)?\s*(просмотр|view)/);
        if (!strictMatch) return -1;

        let numStr = strictMatch[1].replace(',', '.');
        let num = parseFloat(numStr);
        const multStr = strictMatch[2] || '';

        let multiplier = 1;
        if (multStr.startsWith('тыс') || multStr === 'k') multiplier = 1000;
        else if (multStr.startsWith('млн') || multStr === 'm') multiplier = 1000000;
        else if (multStr.startsWith('млрд') || multStr === 'b') multiplier = 1000000000;

        return Math.round(num * multiplier);
    }

    // --- 3. ФИЛЬТРАЦИЯ ---
    let isRunning = false;

    // Вспомогательная функция очистки (показывает всё обратно)
    function cleanUp() {
        const hidden = document.querySelectorAll('.yt-filter-hidden');
        hidden.forEach(el => el.classList.remove('yt-filter-hidden'));

        if (IS_DEBUG) {
            const debugged = document.querySelectorAll('.yt-dbg-shorts, .yt-dbg-mix, .yt-dbg-views, .yt-dbg-ok');
            debugged.forEach(el => el.classList.remove('yt-dbg-shorts', 'yt-dbg-mix', 'yt-dbg-views', 'yt-dbg-ok'));
        }
    }

    function isHomePage() {
        return window.location.pathname === '/' || window.location.pathname === '';
    }

    function runFilter() {
        if (isRunning) return;
        isRunning = true;

        // 1. Проверка главного переключателя
        const masterEnabled = GM_getValue('masterEnabled', true);
        if (!masterEnabled) {
            cleanUp();
            isRunning = false;
            return;
        }

        // 2. Проверка: Мы на главной?
        if (!isHomePage()) {
            cleanUp(); // Если ушли с главной - чистим фильтры
            isRunning = false;
            return;
        }

        const uiMin = document.getElementById('yt-inp-min');
        const min = uiMin ? parseInt(uiMin.value) : GM_getValue('minViews', 0);
        const max = document.getElementById('yt-inp-max') ? parseInt(document.getElementById('yt-inp-max').value) : GM_getValue('maxViews', 1000);

        const removeShorts = document.getElementById('yt-cb-shorts') ? document.getElementById('yt-cb-shorts').checked : GM_getValue('removeShorts', false);
        const removeMixes = document.getElementById('yt-cb-mixes') ? document.getElementById('yt-cb-mixes').checked : GM_getValue('removeMixes', false);
        const removeTopics = document.getElementById('yt-cb-topics') ? document.getElementById('yt-cb-topics').checked : GM_getValue('removeTopics', false);

        // --- Обработка Секций ---
        const sections = document.querySelectorAll('ytd-rich-section-renderer');
        sections.forEach(section => {
            if (!IS_DEBUG && section.classList.contains('yt-filter-hidden')) return;
            if (IS_DEBUG) section.classList.remove('yt-dbg-shorts', 'yt-dbg-topics');

            let shouldHide = false;
            let hideType = '';

            if (removeShorts) {
                const titleSpan = section.querySelector('#title-text span#title');
                const isShortsTag = section.querySelector('ytd-rich-shelf-renderer[is-shorts]');
                const hasShortsIcon = section.innerHTML.includes('M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33');

                if ((titleSpan && titleSpan.textContent.trim() === 'Shorts') || isShortsTag || hasShortsIcon) {
                    shouldHide = true;
                    hideType = 'shorts';
                }
            }

            if (removeTopics && !shouldHide) {
                if (section.querySelector('ytd-chips-shelf-with-video-shelf-renderer')) {
                    shouldHide = true;
                    hideType = 'topics';
                }
                const headerTitle = section.querySelector('h2 span');
                if (headerTitle && (headerTitle.textContent.includes('Ещё темы') || headerTitle.textContent.includes('More topics'))) {
                    shouldHide = true;
                    hideType = 'topics';
                }
            }

            if (shouldHide) {
                section.classList.add('yt-filter-hidden');
                if (IS_DEBUG) {
                    section.classList.remove('yt-filter-hidden');
                    if (hideType === 'shorts') section.classList.add('yt-dbg-shorts');
                    if (hideType === 'topics') section.classList.add('yt-dbg-topics');
                }
            }
        });

        // --- Обработка Карточек ---
        const items = document.querySelectorAll('ytd-rich-item-renderer'); // На главной в основном они
        let hiddenCount = 0;

        items.forEach(el => {
            if (!IS_DEBUG && el.classList.contains('yt-filter-hidden')) {
                hiddenCount++;
                return;
            }
            if (IS_DEBUG) el.classList.remove('yt-dbg-ok', 'yt-dbg-views', 'yt-dbg-shorts', 'yt-dbg-mix');

            let shouldHide = false;
            let hideReason = '';

            if (removeMixes && !shouldHide) {
                const badges = el.querySelectorAll('.yt-badge-shape__text');
                for (const badge of badges) {
                    const txt = badge.textContent.trim().toLowerCase();
                    if (txt === 'джем' || txt === 'микс' || txt === 'mix') {
                        shouldHide = true;
                        hideReason = 'mix';
                        break;
                    }
                }
                if (!shouldHide) {
                    if (el.querySelector('yt-collections-stack') || el.querySelector('.yt-lockup-view-model--collection-stack-2') || el.querySelector('a[href*="start_radio=1"]')) {
                        shouldHide = true;
                        hideReason = 'mix';
                    }
                }
            }

            if (removeShorts && !shouldHide) {
                if (el.querySelector('a[href*="/shorts/"]')) {
                    shouldHide = true;
                    hideReason = 'shorts';
                }
            }

            if (!shouldHide && hideReason === '') {
                if (el.closest('.yt-filter-hidden')) return;

                let views = -1;
                const metaBlocks = el.querySelectorAll('.inline-metadata-item, #metadata-line span, .yt-core-attributed-string, .yt-content-metadata-view-model');

                for (const block of metaBlocks) {
                    const txt = block.textContent;
                    const parsed = parseStringViewCount(txt);
                    if (parsed !== -1) {
                        views = parsed;
                        break;
                    }
                }

                if (views === -1) {
                    const lines = el.innerText.split(/\r?\n/);
                    for (const line of lines) {
                        const parsed = parseStringViewCount(line);
                        if (parsed !== -1) {
                            views = parsed;
                            break;
                        }
                    }
                }

                if (views !== -1 && views !== -2) {
                    if (views < min || (max > 0 && views > max)) {
                        shouldHide = true;
                        hideReason = 'views';
                    }
                }
            }

            if (shouldHide) {
                el.classList.add('yt-filter-hidden');
                if (IS_DEBUG) {
                    el.classList.remove('yt-filter-hidden');
                    if (hideReason === 'mix') el.classList.add('yt-dbg-mix');
                    else if (hideReason === 'shorts') el.classList.add('yt-dbg-shorts');
                    else el.classList.add('yt-dbg-views');
                }
                hiddenCount++;
            } else {
                el.classList.remove('yt-filter-hidden');
                if (IS_DEBUG && el.tagName.toLowerCase() !== 'ytd-rich-section-renderer') el.classList.add('yt-dbg-ok');
            }
        });

        const stat = document.getElementById('yt-status');
        if (stat) stat.textContent = `Скрыто: ${hiddenCount}`;

        isRunning = false;
    }

    // --- 4. УПРАВЛЕНИЕ ВИДИМОСТЬЮ КНОПКИ ---
    function updateButtonVisibility() {
        const btn = document.getElementById('yt-filter-toggle-btn');
        const panel = document.getElementById('yt-view-filter-panel');

        if (!btn) return;

        if (isHomePage()) {
            btn.style.display = 'flex'; // Показываем на главной
        } else {
            btn.style.display = 'none'; // Скрываем везде, кроме главной
            if (panel) panel.classList.remove('visible'); // Закрываем меню, если ушли с главной
        }
    }

    // --- 5. ИНТЕРФЕЙС ---
    function createUI() {
        if (document.getElementById('yt-filter-toggle-btn')) return;

        // 1. Кнопка
        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'yt-filter-toggle-btn';
        toggleBtn.textContent = '⚙️';
        toggleBtn.title = 'Фильтр YouTube';
        document.body.appendChild(toggleBtn);

        // 2. Панель
        const panel = document.createElement('div');
        panel.id = 'yt-view-filter-panel';

        const createEl = (tag, text = '', className = '', id = '') => {
            const el = document.createElement(tag);
            if (text) el.textContent = text;
            if (className) el.className = className;
            if (id) el.id = id;
            return el;
        };

        const title = createEl('div', 'Настройки фильтра', '', '');
        title.style.textAlign = 'center';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '5px';
        title.style.color = '#3ea6ff';
        panel.appendChild(title);

        // --- ГЛАВНЫЙ ПЕРЕКЛЮЧАТЕЛЬ ---
        const masterSwitch = createEl('div', '', 'yt-master-switch', 'yt-master-switch-btn');
        const isMaster = GM_getValue('masterEnabled', true);
        masterSwitch.textContent = isMaster ? '🟢 ФИЛЬТР ВКЛЮЧЕН' : '🔴 ФИЛЬТР ВЫКЛЮЧЕН';
        masterSwitch.className = `yt-master-switch ${isMaster ? 'yt-master-on' : 'yt-master-off'}`;
        masterSwitch.onclick = () => {
            const newState = !GM_getValue('masterEnabled', true);
            GM_setValue('masterEnabled', newState);
            masterSwitch.textContent = newState ? '🟢 ФИЛЬТР ВКЛЮЧЕН' : '🔴 ФИЛЬТР ВЫКЛЮЧЕН';
            masterSwitch.className = `yt-master-switch ${newState ? 'yt-master-on' : 'yt-master-off'}`;
            runFilter();
        };
        panel.appendChild(masterSwitch);
        // ------------------------------

        const rowMin = createEl('div', '', 'yt-row');
        rowMin.appendChild(createEl('label', 'Мин:'));
        const inpMin = createEl('input', '', 'yt-inp', 'yt-inp-min');
        inpMin.type = 'number';
        inpMin.value = GM_getValue('minViews', 0);
        rowMin.appendChild(inpMin);
        panel.appendChild(rowMin);

        const rowMax = createEl('div', '', 'yt-row');
        rowMax.appendChild(createEl('label', 'Макс:'));
        const inpMax = createEl('input', '', 'yt-inp', 'yt-inp-max');
        inpMax.type = 'number';
        inpMax.value = GM_getValue('maxViews', 1000);
        rowMax.appendChild(inpMax);
        panel.appendChild(rowMax);

        const addCheckbox = (labelTxt, id, checked) => {
            const row = createEl('div', '', 'yt-row-check');
            const cb = createEl('input', '', '', id);
            cb.type = 'checkbox';
            cb.checked = checked;
            const lbl = createEl('label', labelTxt);
            lbl.htmlFor = id;
            row.appendChild(cb);
            row.appendChild(lbl);
            panel.appendChild(row);

            cb.addEventListener('change', () => {
                saveSettings();
                runFilter();
            });
        };

        addCheckbox('Скрыть Shorts', 'yt-cb-shorts', GM_getValue('removeShorts', false));
        addCheckbox('Скрыть Миксы', 'yt-cb-mixes', GM_getValue('removeMixes', false));
        addCheckbox('Скрыть "Ещё темы"', 'yt-cb-topics', GM_getValue('removeTopics', false));
        addCheckbox('Debug Mode', 'yt-cb-debug', false);

        const btn = createEl('button', 'Применить', 'yt-btn');
        btn.onclick = () => {
            saveSettings();
            runFilter();
        };
        panel.appendChild(btn);

        const stat = createEl('div', '...', '', 'yt-status');
        stat.style.textAlign = 'center';
        stat.style.color = '#777';
        stat.style.fontSize = '10px';
        stat.style.marginTop = '5px';
        panel.appendChild(stat);

        document.body.appendChild(panel);

        // Логика открытия меню
        toggleBtn.addEventListener('click', () => {
            if (panel.classList.contains('visible')) {
                panel.classList.remove('visible');
            } else {
                panel.classList.add('visible');
            }
        });

        // Сразу проверяем, нужно ли показывать кнопку
        updateButtonVisibility();
    }

    function saveSettings() {
        const iMin = document.getElementById('yt-inp-min');
        const iMax = document.getElementById('yt-inp-max');
        const cShorts = document.getElementById('yt-cb-shorts');
        const cMix = document.getElementById('yt-cb-mixes');
        const cTopics = document.getElementById('yt-cb-topics');
        const cDebug = document.getElementById('yt-cb-debug');

        if (iMin) GM_setValue('minViews', iMin.value);
        if (iMax) GM_setValue('maxViews', iMax.value);
        if (cShorts) GM_setValue('removeShorts', cShorts.checked);
        if (cMix) GM_setValue('removeMixes', cMix.checked);
        if (cTopics) GM_setValue('removeTopics', cTopics.checked);
        if (cDebug) IS_DEBUG = cDebug.checked;
    }

    // --- 6. ЗАПУСК И НАВИГАЦИЯ ---

    // Событие перехода по страницам внутри YouTube (SPA)
    window.addEventListener('yt-navigate-finish', () => {
        updateButtonVisibility();
        runFilter();
    });

    const initInt = setInterval(() => {
        if (document.body) {
            createUI();
            clearInterval(initInt);
            updateButtonVisibility();
            runFilter();
        }
    }, 1000);

    let scrollTimer;
    const observer = new MutationObserver((mutations) => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            updateButtonVisibility(); // Проверяем на всякий случай
            runFilter();
        }, 100);
    });

    setTimeout(() => {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }, 1500);

    setInterval(() => {
        if (!document.hidden) runFilter();
    }, 2000);

})();