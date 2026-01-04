// ==UserScript==
// @name         YouTube Filter: Home Only + Master Switch + Smart History (v15.0)
// @namespace    http://tampermonkey.net/
// @version      15.0
// @description  Фильтр по просмотрам на главной
// @author       You
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561132/YouTube%20Filter%3A%20Home%20Only%20%2B%20Master%20Switch%20%2B%20Smart%20History%20%28v150%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561132/YouTube%20Filter%3A%20Home%20Only%20%2B%20Master%20Switch%20%2B%20Smart%20History%20%28v150%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- НАСТРОЙКИ ---
    let IS_DEBUG = false;
    const MAX_HISTORY = 3000; // Помнить последние 3000 видео

    // --- 1. СТИЛИ ---
    const style = document.createElement('style');
    style.textContent = `
        /* КНОПКА */
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
            display: none;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            color: #3ea6ff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            transition: transform 0.2s, background 0.2s;
        }
        #yt-filter-toggle-btn:hover { background: #3ea6ff; color: #000; transform: scale(1.1); }

        /* МЕНЮ */
        #yt-view-filter-panel {
            position: fixed; bottom: 80px; right: 20px; background: #181818; color: #eee;
            padding: 15px; border-radius: 12px; z-index: 2147483647;
            box-shadow: 0 4px 25px rgba(0,0,0,0.9); border: 1px solid #333;
            font-family: Roboto, Arial, sans-serif; width: 230px; display: none;
            flex-direction: column; gap: 10px;
        }
        #yt-view-filter-panel.visible { display: flex; }

        .yt-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
        .yt-row-check { display: flex; justify-content: flex-start; align-items: center; gap: 8px; font-size: 13px; margin-top:2px; }
        .yt-row-check label { cursor: pointer; }
        .yt-inp { background: #0f0f0f; border: 1px solid #444; color: white; padding: 5px; border-radius: 4px; width: 80px; font-size: 13px; }
        .yt-btn { background: #3ea6ff; color: #000; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px; margin-top: 5px; }
        .yt-btn:hover { background: #65b8ff; }

        .yt-master-switch { width: 100%; padding: 8px; border-radius: 6px; font-weight: bold; text-align: center; cursor: pointer; border: 1px solid #444; margin-bottom: 5px; }
        .yt-master-on { background: #1b3a1e; color: #4caf50; border-color: #2e5c32; }
        .yt-master-off { background: #3a1b1b; color: #f44336; border-color: #5c2e2e; }

        .yt-filter-hidden { display: none !important; }

        /* ВАЖНО: Flex для контейнера, чтобы работал order */
        #contents.ytd-rich-grid-renderer {
            display: flex !important;
            flex-wrap: wrap !important;
        }

        /* Новые - Зеленая рамка, порядок по умолчанию (0) */
        .yt-is-new {
            border: 2px solid #00e676 !important;
            box-sizing: border-box;
            border-radius: 12px;
        }

        /* Старые - Красная рамка, полупрозрачность, ВНИЗ СПИСКА */
        .yt-is-old {
            border: 2px solid #ff1744 !important;
            box-sizing: border-box;
            border-radius: 12px;
            opacity: 0.6;
            order: 99999 !important; /* CSS магия: кидает вниз без изменения DOM */
        }
        .yt-is-old:hover { opacity: 1; } /* При наведении полная яркость */
    `;
    document.head.appendChild(style);

    // --- 2. ИСТОРИЯ ---
    // Загружаем историю один раз при старте
    let seenVideos = GM_getValue('seenVideos', []);

    // Функция проверки и обновления истории
    function checkHistory(id) {
        if (!id) return false;
        // Если уже есть в истории
        if (seenVideos.includes(id)) {
            return true; // Это старое видео
        }
        return false; // Это новое видео
    }

    function addToHistory(id) {
        if (!id || seenVideos.includes(id)) return;
        seenVideos.push(id);
        if (seenVideos.length > MAX_HISTORY) seenVideos.shift();
        GM_setValue('seenVideos', seenVideos);
    }

    // --- 3. ПАРСИНГ ---
    function parseStringViewCount(text) {
        if (!text) return -1;
        let clean = text.toLowerCase().replace(/&nbsp;|\u00A0|\s+/g, ' ').trim();
        if (clean.includes('зрител') || clean.includes('watching') || clean.includes('ждет')) return -2;
        if (clean.includes('нет просмотров') || clean.includes('no views')) return 0;
        const match = clean.match(/(\d+[.,]?\d*)\s*(тыс\.?|млн\.?|млрд\.?|k|m|b)?\s*(просмотр|view)/);
        if (!match) return -1;
        let num = parseFloat(match[1].replace(',', '.'));
        const m = match[2] || '';
        let mult = 1;
        if (m.startsWith('тыс') || m === 'k') mult = 1000;
        else if (m.startsWith('млн') || m === 'm') mult = 1000000;
        else if (m.startsWith('млрд') || m === 'b') mult = 1000000000;
        return Math.round(num * mult);
    }

    function getVideoID(el) {
        const link = el.querySelector('a#thumbnail[href*="/watch?v="], a[href^="/watch?v="]');
        if (link) {
            const m = link.getAttribute('href').match(/v=([^&]+)/);
            if (m) return m[1];
        }
        return null;
    }

    // --- 4. ФИЛЬТР ---
    let isRunning = false;

    function cleanUp() {
        document.querySelectorAll('.yt-filter-hidden').forEach(el => el.classList.remove('yt-filter-hidden'));
        document.querySelectorAll('.yt-is-new, .yt-is-old').forEach(el => {
            el.classList.remove('yt-is-new', 'yt-is-old');
            el.style.order = ''; // Сброс порядка
        });
    }

    function isHomePage() {
        return window.location.pathname === '/' || window.location.pathname === '';
    }

    function runFilter() {
        if (isRunning) return;
        isRunning = true;

        const masterEnabled = GM_getValue('masterEnabled', true);
        if (!masterEnabled || !isHomePage()) {
            if (!masterEnabled) cleanUp();
            isRunning = false;
            return;
        }

        // Получаем настройки
        const uiMin = document.getElementById('yt-inp-min');
        const min = uiMin ? parseInt(uiMin.value) : GM_getValue('minViews', 0);
        const max = document.getElementById('yt-inp-max') ? parseInt(document.getElementById('yt-inp-max').value) : GM_getValue('maxViews', 1000);
        const removeShorts = GM_getValue('removeShorts', false);
        const removeMixes = GM_getValue('removeMixes', false);
        const removeTopics = GM_getValue('removeTopics', false);
        const highlightHistory = GM_getValue('highlightHistory', true);

        // Скрываем секции (Shorts/Topics)
        const sections = document.querySelectorAll('ytd-rich-section-renderer');
        sections.forEach(section => {
            let shouldHide = false;
            if (removeShorts && (section.innerHTML.includes('M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33') || section.innerText.includes('Shorts'))) shouldHide = true;
            if (removeTopics && !shouldHide && section.querySelector('ytd-chips-shelf-with-video-shelf-renderer')) shouldHide = true;
            if (shouldHide) section.classList.add('yt-filter-hidden');
        });

        // Обработка видео
        const items = document.querySelectorAll('ytd-rich-item-renderer:not(.yt-filter-hidden)');
        let hiddenCount = 0;

        items.forEach(el => {
            let shouldHide = false;

            // Проверки на скрытие (Shorts, Mixes, Views)
            if (removeShorts && el.querySelector('a[href*="/shorts/"]')) shouldHide = true;
            if (!shouldHide && removeMixes && (el.querySelector('a[href*="start_radio=1"]') || el.innerText.toLowerCase().includes('микс'))) shouldHide = true;

            if (!shouldHide) {
                let views = -1;
                const meta = el.querySelectorAll('.inline-metadata-item, #metadata-line span, .yt-core-attributed-string');
                for (let m of meta) {
                    let v = parseStringViewCount(m.textContent);
                    if (v !== -1) { views = v; break; }
                }
                if (views !== -1 && views !== -2 && (views < min || (max > 0 && views > max))) shouldHide = true;
            }

            if (shouldHide) {
                el.classList.add('yt-filter-hidden');
                hiddenCount++;
            } else {
                // ЛОГИКА ИСТОРИИ (ТОЛЬКО ЕСЛИ НЕ СКРЫТО)
                if (highlightHistory) {
                    // Если мы уже обработали этот элемент (есть класс new или old), пропускаем
                    if (el.classList.contains('yt-is-new') || el.classList.contains('yt-is-old')) {
                        // Ничего не делаем, экономим ресурсы
                    } else {
                        const vidId = getVideoID(el);
                        if (vidId) {
                            const isOld = checkHistory(vidId);
                            if (isOld) {
                                // ЭТО СТАРОЕ ВИДЕО
                                el.classList.add('yt-is-old');
                                // Мы НЕ добавляем его в seenVideos, оно уже там
                            } else {
                                // ЭТО НОВОЕ ВИДЕО
                                el.classList.add('yt-is-new');
                                addToHistory(vidId); // Теперь запоминаем его
                            }
                        }
                    }
                } else {
                    // Если галочка снята - чистим классы
                    el.classList.remove('yt-is-new', 'yt-is-old');
                    el.style.order = '';
                }
            }
        });

        const stat = document.getElementById('yt-status');
        if (stat) stat.textContent = `Скрыто: ${hiddenCount} | База: ${seenVideos.length}`;

        isRunning = false;
    }

    // --- 5. UI ---
    function updateButtonVisibility() {
        const btn = document.getElementById('yt-filter-toggle-btn');
        if (btn) btn.style.display = isHomePage() ? 'flex' : 'none';
    }

    function createUI() {
        if (document.getElementById('yt-filter-toggle-btn')) return;

        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'yt-filter-toggle-btn';
        toggleBtn.textContent = '⚙️';
        document.body.appendChild(toggleBtn);

        const panel = document.createElement('div');
        panel.id = 'yt-view-filter-panel';

        const createEl = (tag, txt, cls, id) => {
            const el = document.createElement(tag);
            if (txt) el.textContent = txt;
            if (cls) el.className = cls;
            if (id) el.id = id;
            return el;
        };

        panel.appendChild(createEl('div', 'Настройки фильтра', '', '')).style.cssText = 'text-align:center; font-weight:bold; color:#3ea6ff; margin-bottom:5px;';

        const ms = createEl('div', '', 'yt-master-switch');
        const updateMs = () => {
            const s = GM_getValue('masterEnabled', true);
            ms.textContent = s ? '🟢 ВКЛЮЧЕН' : '🔴 ВЫКЛЮЧЕН';
            ms.className = `yt-master-switch ${s ? 'yt-master-on' : 'yt-master-off'}`;
        };
        updateMs();
        ms.onclick = () => { GM_setValue('masterEnabled', !GM_getValue('masterEnabled', true)); updateMs(); runFilter(); };
        panel.appendChild(ms);

        const rowMin = createEl('div', '', 'yt-row');
        rowMin.appendChild(createEl('label', 'Мин:'));
        const inpMin = createEl('input', '', 'yt-inp', 'yt-inp-min');
        inpMin.type = 'number'; inpMin.value = GM_getValue('minViews', 0);
        rowMin.appendChild(inpMin);
        panel.appendChild(rowMin);

        const rowMax = createEl('div', '', 'yt-row');
        rowMax.appendChild(createEl('label', 'Макс:'));
        const inpMax = createEl('input', '', 'yt-inp', 'yt-inp-max');
        inpMax.type = 'number'; inpMax.value = GM_getValue('maxViews', 1000);
        rowMax.appendChild(inpMax);
        panel.appendChild(rowMax);

        const addCb = (txt, id, val) => {
            const r = createEl('div', '', 'yt-row-check');
            const c = createEl('input', '', '', id);
            c.type = 'checkbox'; c.checked = val;
            const l = createEl('label', txt); l.htmlFor = id;
            r.append(c, l); panel.appendChild(r);
            c.onchange = () => { saveSettings(); runFilter(); };
        };

        addCb('Скрыть Shorts', 'yt-cb-shorts', GM_getValue('removeShorts', false));
        addCb('Скрыть Миксы', 'yt-cb-mixes', GM_getValue('removeMixes', false));
        addCb('Скрыть Темы', 'yt-cb-topics', GM_getValue('removeTopics', false));
        addCb('Выделять New/Old', 'yt-cb-history', GM_getValue('highlightHistory', true));

        const btn = createEl('button', 'Применить', 'yt-btn');
        btn.onclick = () => { saveSettings(); runFilter(); };
        panel.appendChild(btn);
        panel.appendChild(createEl('div', '...', '', 'yt-status'));

        document.body.appendChild(panel);
        toggleBtn.onclick = () => panel.classList.toggle('visible');
        updateButtonVisibility();
    }

    function saveSettings() {
        GM_setValue('minViews', document.getElementById('yt-inp-min').value);
        GM_setValue('maxViews', document.getElementById('yt-inp-max').value);
        GM_setValue('removeShorts', document.getElementById('yt-cb-shorts').checked);
        GM_setValue('removeMixes', document.getElementById('yt-cb-mixes').checked);
        GM_setValue('removeTopics', document.getElementById('yt-cb-topics').checked);
        GM_setValue('highlightHistory', document.getElementById('yt-cb-history').checked);
    }

    // --- 6. ЗАПУСК ---
    window.addEventListener('yt-navigate-finish', () => { updateButtonVisibility(); runFilter(); });
    setInterval(() => { if (!document.getElementById('yt-filter-toggle-btn') && document.body) createUI(); }, 1000);
    const observer = new MutationObserver(() => { setTimeout(runFilter, 100); });
    setTimeout(() => { if (document.body) observer.observe(document.body, { childList: true, subtree: true }); }, 1500);

})();