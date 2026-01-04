// ==UserScript==
// @name         YouTube Keyword Filter
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Фильтр видео (белый список)
// @author       torch
// @match        *://www.youtube.com/@*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556515/YouTube%20Keyword%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/556515/YouTube%20Keyword%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY_WORDS = 'yt_filter_keywords';
    const STORAGE_KEY_ACTIVE = 'yt_filter_active';

    let keywords = (localStorage.getItem(STORAGE_KEY_WORDS) || '').toLowerCase().split(',').map(k => k.trim()).filter(k => k);
    let isActive = localStorage.getItem(STORAGE_KEY_ACTIVE) === 'true';

    // --- Стили ---
    const styles = `
        #yt-safe-btn {
            position: fixed;
            bottom: 30px;
            right: 80px; /* Чуть левее чата */
            width: 50px;
            height: 50px;
            background: #065fd4;
            border: 2px solid #fff;
            border-radius: 50%;
            color: white;
            font-size: 24px;
            cursor: pointer;
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            transition: transform 0.2s;
            user-select: none;
        }
        #yt-safe-btn:hover { transform: scale(1.1); }
        #yt-safe-panel {
            position: fixed;
            bottom: 90px;
            right: 80px;
            width: 300px;
            background: #212121;
            border: 1px solid #444;
            padding: 15px;
            border-radius: 10px;
            z-index: 2147483647;
            box-shadow: 0 10px 30px rgba(0,0,0,0.7);
            display: none;
            color: #fff;
            font-family: Roboto, Arial, sans-serif;
        }
        #yt-safe-title { margin: 0 0 10px 0; font-size: 16px; font-weight: bold; }
        #yt-safe-textarea {
            width: 100%;
            height: 80px;
            background: #121212;
            color: #fff;
            border: 1px solid #555;
            border-radius: 4px;
            padding: 5px;
            box-sizing: border-box;
            margin-bottom: 10px;
            resize: vertical;
        }
        .yt-safe-row { display: flex; justify-content: space-between; gap: 10px; }
        .yt-safe-btn-ui {
            flex: 1;
            padding: 8px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            color: #fff;
        }
        #yt-btn-toggle { background: #cc0000; }
        #yt-btn-toggle.active { background: #2ba640; }
        #yt-btn-save { background: #3ea6ff; color: #000; }
        .yt-safe-desc { font-size: 11px; color: #aaa; margin-top: 8px; line-height: 1.3; }
    `;

    // Добавляем стили безопасным методом
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // --- Создание интерфейса через DOM API (без innerHTML) ---
    function createSafeInterface() {
        if (document.getElementById('yt-safe-btn')) return;

        // 1. Кнопка
        const btn = document.createElement('div');
        btn.id = 'yt-safe-btn';
        btn.textContent = '🛡️';
        btn.title = 'Настроить фильтр';
        btn.onclick = (e) => {
            e.stopPropagation();
            const panel = document.getElementById('yt-safe-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        };
        document.body.appendChild(btn);

        // 2. Панель
        const panel = document.createElement('div');
        panel.id = 'yt-safe-panel';

        // Заголовок
        const title = document.createElement('div');
        title.id = 'yt-safe-title';
        title.textContent = 'Фильтр (Белый список)';
        panel.appendChild(title);

        // Текстовое поле
        const textarea = document.createElement('textarea');
        textarea.id = 'yt-safe-textarea';
        textarea.value = localStorage.getItem(STORAGE_KEY_WORDS) || '';
        textarea.placeholder = 'Слова через запятую (пример: майнкрафт, asmr)';
        panel.appendChild(textarea);

        // Кнопки
        const btnRow = document.createElement('div');
        btnRow.className = 'yt-safe-row';

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'yt-btn-toggle';
        toggleBtn.className = 'yt-safe-btn-ui';
        toggleBtn.textContent = isActive ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН';
        if (isActive) toggleBtn.classList.add('active');

        toggleBtn.onclick = () => {
            isActive = !isActive;
            localStorage.setItem(STORAGE_KEY_ACTIVE, isActive);
            toggleBtn.textContent = isActive ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН';
            toggleBtn.classList.toggle('active', isActive);
            console.log('[Фильтр] Статус:', isActive);
            runFilter();
        };

        const saveBtn = document.createElement('button');
        saveBtn.id = 'yt-btn-save';
        saveBtn.className = 'yt-safe-btn-ui';
        saveBtn.textContent = 'Применить';

        saveBtn.onclick = () => {
            const text = textarea.value;
            localStorage.setItem(STORAGE_KEY_WORDS, text);
            keywords = text.toLowerCase().split(',').map(k => k.trim()).filter(k => k);
            console.log('[Фильтр] Новые слова:', keywords);
            runFilter();
            saveBtn.textContent = 'OK!';
            setTimeout(() => saveBtn.textContent = 'Применить', 1000);
        };

        btnRow.appendChild(toggleBtn);
        btnRow.appendChild(saveBtn);
        panel.appendChild(btnRow);

        // Описание
        const desc = document.createElement('div');
        desc.className = 'yt-safe-desc';
        desc.textContent = 'Оставляет только видео, содержащие эти слова. Пустое поле = показывает всё.';
        panel.appendChild(desc);

        document.body.appendChild(panel);

        // Скрытие при клике вне
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && e.target !== btn) {
                panel.style.display = 'none';
            }
        });
    }

    // --- Логика фильтрации ---
    function runFilter() {
        // Селекторы для видео на главной, в поиске, в плейлистах и шортс
        const selectors = [
            'ytd-rich-item-renderer',
            'ytd-video-renderer',
            'ytd-grid-video-renderer',
            'ytd-compact-video-renderer',
            'ytd-reel-item-renderer',
            'ytd-playlist-video-renderer'
        ];

        const videos = document.querySelectorAll(selectors.join(','));

        videos.forEach(video => {
            // Если выключено или список пуст - сбрасываем скрытие
            if (!isActive || keywords.length === 0) {
                video.style.display = '';
                return;
            }

            // Ищем элементы с текстом заголовка
            const titleEl = video.querySelector('#video-title, #video-title-link');
            if (!titleEl) return;

            // Получаем текст (и aria-label, т.к. там часто полное название)
            const text = (titleEl.innerText + ' ' + (titleEl.getAttribute('aria-label') || '')).toLowerCase();

            // Проверяем совпадение
            const match = keywords.some(word => text.includes(word));

            if (match) {
                video.style.display = ''; // Показать
            } else {
                video.style.display = 'none'; // Скрыть
            }
        });
    }

    // --- Запуск ---
    const observer = new MutationObserver(() => {
        // Гарантируем наличие кнопки
        if (!document.getElementById('yt-safe-btn')) {
            createSafeInterface();
        }
        // Запускаем фильтр (с задержкой для производительности)
        runFilter();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Первый запуск
    setTimeout(() => {
        createSafeInterface();
        runFilter();
    }, 1000);

    console.log('[Фильтр] Скрипт v4.0 загружен (Trusted Types Fix)');

})();