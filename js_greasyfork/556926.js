// ==UserScript==
// @name         AS Watcher
// @namespace    https://animestars.org/
// @version      1.3
// @description  Скрипт для отслеживания выпадения новых карт по id, с уведомлениями
// @author       Sandr
// @match        *://*.animestars.org/*
// @match        *://*.animesss.com/*
// @match        *://*.animesss.tv/*
// @match        *://*.asstars.tv/*
// @match        *://*.astars.club/*
// @match        *://*.asstars.online/*

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @noframes
// @grant        window.focus
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556926/AS%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/556926/AS%20Watcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === КОНФИГУРАЦИЯ ===
    const COOLDOWN_MS = 5 * 60 * 1000; // кд на один ID
    const HISTORY_LIMIT = 50;

    // Ключи хранилища
    const KEY_IDS = 'as_ids';
    const KEY_HISTORY = 'as_history';
    const KEY_COOLDOWNS = 'as_cooldowns';
    const KEY_NOTIFY_MODE = 'as_notify_mode';
    const KEY_NOTIFY_TRIGGER = 'as_notify_trigger';

    // === СОСТОЯНИЕ ===
    let WATCH_IDS = load(KEY_IDS, []);
    let HISTORY = load(KEY_HISTORY, []);
    let COOLDOWNS = load(KEY_COOLDOWNS, {});
    let NOTIFY_MODE = load(KEY_NOTIFY_MODE, 'custom');

    let LOCAL_COOLDOWNS = {};

    // === УТИЛИТЫ ===
    function load(key, def) {
        try { return JSON.parse(GM_getValue(key, JSON.stringify(def))); } catch (e) { return def; }
    }
    function save(key, val) {
        GM_setValue(key, JSON.stringify(val));
    }
    function formatTime(ms) {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}м ${seconds}с`;
    }

    function getBaseCardUrl() {
        return window.location.origin + '/cards/users/?id=';
    }

    // === АУДИО УТИЛИТЫ ===
    function playBeepSound() {
        try {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            if (!context) return;

            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, context.currentTime);

            gainNode.gain.setValueAtTime(0.5, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.15);

            oscillator.start();
            oscillator.stop(context.currentTime + 0.15);
        } catch (e) {
            console.error("Ошибка воспроизведения Web Audio API:", e);
        }
    }

    // === СИНХРОНИЗАЦИЯ ===
    GM_addValueChangeListener(KEY_IDS, (n, o, newVal) => { WATCH_IDS = JSON.parse(newVal || '[]'); updateIDListUI(); });
    GM_addValueChangeListener(KEY_HISTORY, (n, o, newVal) => { HISTORY = JSON.parse(newVal || '[]'); updateHistoryUI(); });
    GM_addValueChangeListener(KEY_COOLDOWNS, (n, o, newVal) => { COOLDOWNS = JSON.parse(newVal || '{}'); updateHistoryUI(); });
    GM_addValueChangeListener(KEY_NOTIFY_MODE, (n, o, newVal) => {
        NOTIFY_MODE = JSON.parse(newVal || '"custom"');
        updateNotifyModeUI();
    });

    GM_addValueChangeListener(KEY_NOTIFY_TRIGGER, (n, o, newVal) => {
        const item = JSON.parse(newVal || 'null');
        if (item && item.time > (Date.now() - 1000) && NOTIFY_MODE === 'custom') {
            showCustomNotification(item);
        }
    });

    // === ЛОГИКА ПОИСКА ===
    function getCardData(node) {
        let item = node.classList && node.classList.contains('anime-cards__item') ? node : null;
        if (!item) item = node.querySelector ? node.querySelector('.anime-cards__item') : null;
        if (!item) return null;

        // допустимая карточка — без доп. ограничений, но ваш код ранее требовал обертку owl-stage и wrapper-gl
        // Сохраним проверку на owl-stage и wrapper-gl чтобы не ловить лишние элементы
        if (!item.closest('.owl-stage')) return null;
        const wrapper = item.closest('.anime-cards__item-wrapper-gl');
        if (!wrapper) return null;

        let image = item.dataset.image || '';
        if (image && !image.startsWith('http')) {
            image = window.location.origin + image;
        }

        const cardUrl = getBaseCardUrl() + item.dataset.id;

        return {
            id: parseInt(item.dataset.id, 10),
            name: item.dataset.name,
            image: image,
            element: item,
            url: cardUrl
        };
    }

    function processCard(node) {
        const card = getCardData(node);
        const isWatched = WATCH_IDS.some(item => (typeof item === 'object' ? item.id : item) === card.id);
        if (!card || !card.id || !isWatched || (card.image && card.image.includes('_stars_'))) return;

        if (card.element.dataset.asMonitored === '1') return;
        card.element.dataset.asMonitored = '1';

        const now = Date.now();

        if (now - (LOCAL_COOLDOWNS[card.id] || 0) < COOLDOWN_MS) return;

        COOLDOWNS = load(KEY_COOLDOWNS, {});
        const lastTime = COOLDOWNS[card.id] || 0;

        if (now - lastTime < COOLDOWN_MS) return;

        triggerFound(card);
    }

    function triggerFound(card) {
        const now = Date.now();

        LOCAL_COOLDOWNS[card.id] = now;
        COOLDOWNS[card.id] = now;
        save(KEY_COOLDOWNS, COOLDOWNS);

        const historyItem = {
            id: card.id,
            name: card.name,
            image: card.image,
            time: now,
            url: card.url
        };
        HISTORY.unshift(historyItem);
        if (HISTORY.length > HISTORY_LIMIT) HISTORY.pop();
        save(KEY_HISTORY, HISTORY);

        if (NOTIFY_MODE === 'system') {
            showSystemNotification(historyItem);
        } else {
            showCustomNotification(historyItem);
            save(KEY_NOTIFY_TRIGGER, historyItem);
        }

        updateHistoryUI();
    }

    function showSystemNotification(item) {
        GM_notification({
            title: `Найдена карта: ${item.name}`,
            text: `ID: ${item.id}. Кликните для перехода.`,
            image: item.image,
            timeout: 5000,
            onclick: () => {
                window.open(item.url, '_blank');
                window.focus();
            }
        });
    }

    function showCustomNotification(item) {
        playBeepSound();
        ensureToastContainer();
        const container = document.getElementById('asw-toast-container');

        const toast = document.createElement('div');
        toast.className = 'asw-toast';
        toast.innerHTML = `
            <div class="asw-toast-img-wrap"><img src="${item.image}" alt="${item.name}"></div>
            <div class="asw-toast-text">
                <div class="asw-toast-title" title="${item.name}">${item.name}</div>
                <div class="asw-toast-body">ID: ${item.id}<br>Клик для перехода</div>
            </div>
        `;
        toast.onclick = () => window.open(item.url, '_blank');

        if (container.querySelector(`.asw-toast-title[title="${item.name}"]`)) return;

        container.prepend(toast);
        requestAnimationFrame(() => toast.classList.add('asw-toast-visible'));

        setTimeout(() => {
            toast.classList.remove('asw-toast-visible');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    function ensureToastContainer() {
        if (!document.getElementById('asw-toast-container')) {
            const div = document.createElement('div');
            div.id = 'asw-toast-container';
            document.body.appendChild(div);
        }
    }
    function highlightDuplicates() {
        const input = document.getElementById('asw-add-input');
        if (!input) return;

        // Получаем ID из строки ввода
        const raw = input.value;
        const inputIds = raw.split(/[,;\s]+/).map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));

        // Ищем все элементы в списке и проверяем их ID
        const pills = document.querySelectorAll('.asw-pill');
        pills.forEach(pill => {
            const pillId = parseInt(pill.dataset.id, 10);
            if (inputIds.includes(pillId)) {
                pill.classList.add('asw-pill-highlight');
            } else {
                pill.classList.remove('asw-pill-highlight');
            }
        });
    }
    // === UI ИНТЕРФЕЙС ===
    function createUI() {
        // Кнопка (FAB)
        const fab = document.createElement('button');
        fab.id = 'asw-fab';
        fab.innerHTML = '<i class="fal fa-bell"></i>';
        fab.title = 'Сканер карт';
        fab.onclick = openPanel;
        document.body.appendChild(fab);

        // Модальное окно
        const modal = document.createElement('div');
        modal.id = 'asw-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div id="asw-overlay"></div>
            <div id="asw-panel">
                <div class="asw-header">
                    <span class="asw-title">AS Watcher</span>

                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="color: #aaa; font-size: 14px;">Уведомления:</span>
                        <div class="asw-mode-switch">
                            <span data-mode="system" class="asw-mode-btn">Системные</span>
                            <span data-mode="custom" class="asw-mode-btn">Встроенные</span>
                        </div>
                    </div>

                    <button id="asw-close-btn">×</button>
                </div>
                <div class="asw-body">
                    <div class="asw-column">
                        <h3>Отслеживаемые ID</h3>
                        <div class="asw-add-row">
                            <input type="text" id="asw-add-input" placeholder="ID через запятую (напр: 1051, 3256)">
                            <button id="asw-add-btn">ДОБАВИТЬ</button>
                            <button id="asw-add-all-btn" title="Добавляет все карты S ранга с листа, нужно открыть лист и выбрать ранг">С листа</button>
                        </div>
                        <div class="asw-ids-container">
                            <div id="asw-ids-list" class="asw-pill-list"></div>
                        </div>
                        <button id="asw-clear-btn" class="danger">ОЧИСТИТЬ СПИСОК</button>
                    </div>
                    <div class="asw-column">
                        <h3>История</h3>
                        <div id="asw-history-list" class="asw-history-list">
                            <div class="asw-history-empty">Пусто</div>
                        </div>
                        <button id="asw-history-clear" class="danger small">ОЧИСТИТЬ ИСТОРИЮ</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('asw-add-input').addEventListener('input', highlightDuplicates);
        // События UI
        document.getElementById('asw-close-btn').onclick = closePanel;
        document.getElementById('asw-overlay').onclick = closePanel;

        // МАССОВОЕ ДОБАВЛЕНИЕ из поля ввода
        document.getElementById('asw-add-btn').onclick = () => {
            const input = document.getElementById('asw-add-input');
            const raw = input.value;
            const parts = raw.split(/[,;\s]+/).map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);

            let addedCount = 0;
            parts.forEach(id => {
                if (!WATCH_IDS.includes(id)) {
                    WATCH_IDS.push(id);
                    addedCount++;
                }
            });

            if (addedCount > 0) {
                save(KEY_IDS, WATCH_IDS);
                updateIDListUI();
            }
            input.value = '';
        };

        document.getElementById('asw-clear-btn').onclick = () => {
            if (confirm('Удалить все ID, кроме избранных?')) {
                // Оставляем только те элементы, у которых fav === true
                WATCH_IDS = WATCH_IDS.filter(item => typeof item === 'object' && item.fav === true);
                save(KEY_IDS, WATCH_IDS);
                updateIDListUI();
            }
        };

        document.getElementById('asw-history-clear').onclick = () => {
            if (confirm('Очистить историю?')) { HISTORY = []; save(KEY_HISTORY, []); updateHistoryUI(); }
        };

        // ПЕРЕКЛЮЧЕНИЕ УВЕДОМЛЕНИЙ
        document.querySelectorAll('.asw-mode-btn').forEach(btn => {
            btn.onclick = () => {
                const mode = btn.dataset.mode;
                NOTIFY_MODE = mode;
                save(KEY_NOTIFY_MODE, mode);
                updateNotifyModeUI();
            };
        });

        // СТИЛИ
        const style = document.createElement('style');
        style.innerHTML = `
/* Кнопка открытия */
#asw-fab {
    position: fixed;
    bottom: 92px;
    left: 0;
    width: 45px;
    height: 45px;
    border-radius: 0;
    backdrop-filter: blur(8px);
    background: rgba(52, 152, 219, 0.25);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    z-index: 99990;
}
#asw-fab:hover { background: #81d4fa; }

/* Модалка */
#asw-modal { position: fixed; inset: 0; z-index: 99995; }
#asw-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); }
#asw-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 700px; max-width: 95vw; max-height: 80vh; background: #1e1e1e; color: #fff; border-radius: 12px; box-shadow: 0 0 20px #000; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
.asw-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; border-bottom: 1px solid #444; background: #263238; border-radius: 12px 12px 0 0; }
.asw-title { font-size: 16px; font-weight: bold; color: #4fc3f7; }
#asw-close-btn { border: none; background: transparent; color: #fff; font-size: 20px; cursor: pointer; }

/* Тело */
.asw-body { display: flex; padding: 12px; gap: 12px; overflow: hidden; height: 100%; }
.asw-column { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.asw-column h3 { margin: 4px 0 8px; font-size: 14px; border-bottom: 1px solid #444; padding-bottom: 4px; color: #aaa; }

/* Ввод - исправлен стиль чтобы кнопка не сдвигала input */
.asw-add-row { display: flex; gap: 6px; margin-bottom: 8px; align-items: center; }
#asw-add-input { flex: 1 1 auto; padding: 6px; border-radius: 6px; border: 1px solid #555; background: #2d2d2d; color: #fff; min-width: 0; }
#asw-add-btn { flex: 0 0 auto; padding: 6px 10px; border-radius: 6px; border: none; cursor: pointer; background: #4fc3f7; color: #000; font-weight: bold; }
#asw-add-all-btn { flex: 0 0 auto; padding: 6px 10px; border-radius: 6px; border: none; cursor: pointer; background: #d84c79; color: #fff; font-weight: bold; }

/* Списки */
.asw-ids-container, .asw-history-list { flex: 1; overflow-y: auto; border-radius: 6px; border: 1px solid #444; background: #252525; padding: 6px; }
.asw-pill-list { display: flex; flex-wrap: wrap; gap: 6px; }

/* ID Pill */
.asw-pill {
    padding: 3px 0 3px 7px;
    background: #37474f;
    border-radius: 12px;
    border: 1px solid #607d8b;
    font-size: 12px;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 5px;
}
.asw-pill:hover { background: #455a64; border-color: #455a64; }
.asw-pill-id { cursor: pointer; text-decoration: underline; text-underline-offset: 2px; color: #fff; white-space: nowrap; }
.asw-pill-delete { background: #ef5350; color: #fff; border-radius: 50%; width: 18px; height: 18px; display: flex; justify-content: center; align-items: center; font-size: 12px; cursor: pointer; font-weight: bold; line-height: 1; margin-right: 3px; }
.asw-pill-delete:hover { background: #c62828; }

/* История */
.asw-history-item { display: flex; gap: 8px; padding: 5px; margin-bottom: 4px; border-radius: 4px; background: #303030; align-items: center; cursor: pointer; position: relative; }
.asw-history-item:hover { background: #444; }
.asw-history-item img { width: 40px; height: 60px; border-radius: 4px; object-fit: contain; background: #000; }
.asw-h-info { display: flex; flex-direction: column; justify-content: center; flex-grow: 1; }
.asw-h-link { color: #4fc3f7; text-decoration: none; font-size: 13px; font-weight: bold; }
.asw-h-meta { font-size: 11px; color: #999; margin-top: 2px; }
.asw-h-action { font-size: 10px; color: #81d4fa; font-weight: bold; }
.asw-h-actions { display: flex; align-items: center; gap: 5px; margin-left: 10px; white-space: nowrap; }
.asw-h-delete { background: #c62828; color: #fff; border: none; border-radius: 4px; padding: 2px 6px; font-size: 10px; cursor: pointer; opacity: 0.8; line-height: 1; }
.asw-h-delete:hover { opacity: 1; background: #ef5350; }
.asw-history-empty, .asw-empty { color: #aaa; font-size: 12px; padding: 5px; }

/* Переключатель уведомлений */
.asw-mode-switch { display: flex; gap: 5px; background: #222; padding: 2px; border-radius: 6px; }
.asw-mode-btn { padding: 2px 8px; font-size: 11px; cursor: pointer; border-radius: 4px; color: #888; transition: all 0.2s; user-select: none; }
.asw-mode-btn:hover { color: #fff; }
.asw-mode-btn.active { background: #4fc3f7; color: #000; font-weight: bold; }

/* Тоасты */
#asw-toast-container { position: fixed; right: 20px; bottom: 20px; z-index: 100000; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
.asw-toast { pointer-events: auto; background: #1e1e1e; color: #fff; width: 300px; display: flex; gap: 10px; padding: 10px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); transform: translateX(120%); transition: transform 0.3s ease-out; cursor: pointer; border-left: 4px solid #4fc3f7; }
.asw-toast-visible { transform: translateX(0); }
.asw-toast-img-wrap img { width: 60px; height: 90px; object-fit: contain; border-radius: 4px; }
.asw-toast-text { display: flex; flex-direction: column; justify-content: center; }
.asw-toast-title { font-weight: bold; font-size: 14px; color: #4fc3f7; margin-bottom: 2px; }
.asw-toast-body { font-size: 12px; color: #bbb; }

/* 1. Стиль для ИЗБРАННОГО (постоянный статус) */
.asw-pill.is-favorite {
    border-color: #ffa000 !important; /* Насыщенный оранжевый */
    background: #3e2723 !important; /* Темно-коричневый фон */
}
.asw-pill.is-favorite .asw-pill-fav {
    color: #ffca28; /* Золотая звезда */
}

/* 2. Стиль для ПОДСВЕТКИ (когда вводишь ID в строку) */
.asw-pill-highlight {
    background: #0091ea !important; /* Ярко-голубой */
    color: #fff !important;
    transform: scale(1.1);
    box-shadow: 0 0 12px #00b0ff;
    border-color: #fff !important;
    z-index: 10;
}
        `;
        document.head.appendChild(style);

        // ИНИЦИАЛИЗАЦИЯ UI-СПИСКОВ
        updateIDListUI();
        updateHistoryUI();
        updateNotifyModeUI();

        // Вставляем и привязываем функцию addAll (берёт карточки с data-rank="s" на странице)
        injectAddAllHandler();
    }

    function openPanel() {
        document.getElementById('asw-modal').style.display = 'block';
        updateIDListUI();
        updateHistoryUI();
        updateNotifyModeUI();
    }
    function closePanel() {
        document.getElementById('asw-modal').style.display = 'none';
    }

    function updateIDListUI() {
        const list = document.getElementById('asw-ids-list');
        if (!list) return;
        if (!WATCH_IDS.length) { list.innerHTML = '<div class="asw-empty">Список пуст</div>'; return; }

        list.innerHTML = WATCH_IDS.map((item, idx) => {
            // Поддержка и старого формата (число), и нового (объект)
            const id = typeof item === 'object' ? item.id : item;
            const isFav = typeof item === 'object' ? item.fav : false;

            return `
            <div class="asw-pill ${isFav ? 'is-favorite' : ''}" data-id="${id}" data-idx="${idx}">
                <span class="asw-pill-fav" title="В избранное">${isFav ? '★' : '☆'}</span>
                <span class="asw-pill-id" title="Клик для перехода">${id}</span>
                <span class="asw-pill-delete" title="Удалить">&times;</span>
            </div>
        `;
        }).join('');

        // Обработка кликов
        list.querySelectorAll('.asw-pill').forEach(pill => {
            const idx = pill.dataset.idx;
            const id = parseInt(pill.dataset.id);

            // Клик по звезде (Избранное)
            pill.querySelector('.asw-pill-fav').onclick = (e) => {
                e.stopPropagation();
                if (typeof WATCH_IDS[idx] !== 'object') {
                    WATCH_IDS[idx] = { id: id, fav: true };
                } else {
                    WATCH_IDS[idx].fav = !WATCH_IDS[idx].fav;
                }
                save(KEY_IDS, WATCH_IDS);
                updateIDListUI();
            };

            // Клик по удалению (удаляет всегда)
            pill.querySelector('.asw-pill-delete').onclick = (e) => {
                e.stopPropagation();
                WATCH_IDS.splice(idx, 1);
                save(KEY_IDS, WATCH_IDS);
                updateIDListUI();
            };

            // Клик по тексту (переход)
            pill.querySelector('.asw-pill-id').onclick = (e) => {
                e.stopPropagation();
                window.open(getBaseCardUrl() + id, '_blank');
            };
        });
    }

    function updateHistoryUI() {
        const list = document.getElementById('asw-history-list');
        if (!list) return;
        if (!HISTORY.length) { list.innerHTML = '<div class="asw-history-empty">Пусто</div>'; return; }

        list.innerHTML = HISTORY.map((h, index) => {
            return `
                <div class="asw-history-item" data-index="${index}" title="Клик для перехода к владельцам">
                    <img src="${h.image}">
                    <div class="asw-h-info">
                        <span class="asw-h-link">${h.name}</span>
                        <span class="asw-h-meta">ID: ${h.id} • ${new Date(h.time).toLocaleTimeString()}</span>
                        <span class="asw-h-action">Клик для перехода</span>
                    </div>
                    <div class="asw-h-actions">
                        <button class="asw-h-delete" data-index="${index}" title="Удалить запись">[X]</button>
                    </div>
                </div>
            `;
        }).join('');

        Array.from(list.querySelectorAll('.asw-history-item')).forEach(itemEl => {
            const index = parseInt(itemEl.dataset.index, 10);
            const item = HISTORY[index];

            itemEl.onclick = () => window.open(item.url, '_blank');

            const deleteBtn = itemEl.querySelector('.asw-h-delete');
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                HISTORY.splice(index, 1);
                save(KEY_HISTORY, HISTORY);
                updateHistoryUI();
            };
        });
    }

    function updateNotifyModeUI() {
        document.querySelectorAll('.asw-mode-btn').forEach(btn => {
            if (btn.dataset.mode === NOTIFY_MODE) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }

    // === Добавление всех ID с страницы — инжектируем отдельно, с проверкой URL ===
    function injectAddAllHandler() {
        // смысл: функция добавления срабатывает ТОЛЬКО если текущая страница соответствует:
        // host in allowedHosts && path == /user/cards/need && param 'name' присутствует
        if (window.__asw_addAll_injected) return;
        window.__asw_addAll_injected = true;

        let __asw_add_all_lock = 0;

        function isAddAllAllowedOnThisPage() {
            try {
                const url = new URL(window.location.href);
                const host = url.hostname.replace(/^www\./, '');
                const allowedHosts = ['animestars.org', 'asstars.tv'];
                if (!allowedHosts.includes(host)) return false;

                const pathname = url.pathname.replace(/\/+$/, ''); // trim trailing slashes
                if (pathname !== '/user/cards/need') return false;

                if (!url.searchParams.has('name')) return false;

                return true;
            } catch (e) {
                console.warn('AS Watcher: URL parse failed in isAddAllAllowedOnThisPage', e);
                return false;
            }
        }

        function addAllFromPage() {
            if (!isAddAllAllowedOnThisPage()) {
                console.info('AS Watcher: addAllFromPage skipped — not allowed on this page');
                return;
            }

            const now = Date.now();
            if (now - __asw_add_all_lock < 1000) return;
            __asw_add_all_lock = now;

            const nodes = Array.from(document.querySelectorAll('.anime-cards__item[data-rank="s"]'));
            if (!nodes.length) {
                alert('Выберети ранг S, перед добавлением в список.');
                return;
            }

            const idsOnPage = Array.from(new Set(nodes.map(n => {
                const id = parseInt(n.dataset.id, 10);
                return (isNaN(id) ? null : id);
            }).filter(Boolean)));

            const newIds = idsOnPage.filter(id => !WATCH_IDS.includes(id));

            if (newIds.length === 0) {
                alert('Новых ID не найдено (все уже в списке).');
                return;
            }

            newIds.forEach(id => WATCH_IDS.push(id));
            save(KEY_IDS, WATCH_IDS);
            updateIDListUI();

            alert(`Добавлено ${newIds.length} новых ID в список отслеживания.`);
        }

        // привязка кнопки
        const addAllBtn = document.getElementById('asw-add-all-btn');
        if (addAllBtn) {
            addAllBtn.onclick = null;
            addAllBtn.addEventListener('click', addAllFromPage, { passive: true });
        }
    }

    // === START ===
    function startObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((m) => {
                m.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        processCard(node);
                        const children = node.querySelectorAll ? node.querySelectorAll('.anime-cards__item') : [];
                        children.forEach(processCard);
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        document.querySelectorAll('.anime-cards__item').forEach(processCard);
    }

    // Чистка старых кулдаунов
    (function cleanupCooldowns() {
        const now = Date.now();
        let changed = false;
        for (let id in COOLDOWNS) {
            if (now - COOLDOWNS[id] > COOLDOWN_MS * 2) { delete COOLDOWNS[id]; changed = true; }
        }
        if (changed) save(KEY_COOLDOWNS, COOLDOWNS);
    })();

    // Инициализация UI и наблюдателя
    createUI();
    startObserver();

})();
