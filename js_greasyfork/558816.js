// ==UserScript==
// @name         YouTube Native Language Filter (Embedded)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Фильтр комментариев (Русский/Английский), встроенный в заголовок YouTube
// @author       torch
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558816/YouTube%20Native%20Language%20Filter%20%28Embedded%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558816/YouTube%20Native%20Language%20Filter%20%28Embedded%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Настройки стилей ---
    // Используем переменные YouTube для поддержки темной/светлой темы автоматически
    GM_addStyle(`
        #yt-lang-filter-group {
            display: flex;
            align-items: center;
            margin-left: 20px;
            gap: 8px;
        }
        .yt-lang-btn {
            background-color: var(--yt-spec-badge-chip-background, rgba(0, 0, 0, 0.05));
            color: var(--yt-spec-text-primary);
            border: 1px solid transparent;
            border-radius: 16px;
            padding: 0 12px;
            height: 32px;
            font-size: 14px;
            font-family: "Roboto", "Arial", sans-serif;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s, color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .yt-lang-btn:hover {
            background-color: var(--yt-spec-button-chip-background-hover, rgba(0, 0, 0, 0.1));
        }
        .yt-lang-btn.active {
            background-color: var(--yt-spec-brand-button-background, #cc0000);
            color: white;
        }
        /* Адаптация под темную тему, если переменные не сработают */
        html[dark] .yt-lang-btn {
            background-color: rgba(255, 255, 255, 0.1);
            color: #f1f1f1;
        }
        html[dark] .yt-lang-btn:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        html[dark] .yt-lang-btn.active {
            background-color: #ff4e45;
            color: black;
        }
    `);

    // --- Состояние фильтров ---
    const STATE = {
        hideRussian: false,
        hideEnglish: false
    };

    // --- Определение языка ---
    function detectLanguage(text) {
        if (!text) return 'unknown';
        // Считаем кириллицу и латиницу
        const ruCount = (text.match(/[а-яА-ЯёЁ]/g) || []).length;
        const enCount = (text.match(/[a-zA-Z]/g) || []).length;

        // Если есть кириллица, приоритет ей (даже если есть англ слова типа "wow")
        if (ruCount > 0 && ruCount >= enCount * 0.5) return 'ru'; // *0.5 дает вес русскому
        if (enCount > 0 && enCount > ruCount) return 'en';

        return 'other';
    }

    // --- Функция фильтрации ---
    function applyFilter() {
        // Ищем контейнеры комментариев (поддержка старого и нового дизайна)
        const commentThreads = document.querySelectorAll('ytd-comment-thread-renderer, ytd-comment-view-model');

        commentThreads.forEach(thread => {
            // Ищем сам текст комментария внутри блока
            const contentTextElement = thread.querySelector('#content-text');
            if (!contentTextElement) return;

            const text = contentTextElement.innerText;
            const lang = detectLanguage(text);

            let shouldHide = false;
            if (STATE.hideRussian && lang === 'ru') shouldHide = true;
            if (STATE.hideEnglish && lang === 'en') shouldHide = true;

            thread.style.display = shouldHide ? 'none' : '';
        });
    }

    // --- Создание кнопок ---
    function createButtons() {
        // Проверка, не созданы ли уже кнопки
        if (document.getElementById('yt-lang-filter-group')) return;

        // Находим целевой элемент из вашего HTML (#title)
        const headerTitle = document.querySelector('ytd-comments-header-renderer #title');

        if (!headerTitle) return; // Если заголовок еще не загрузился

        const container = document.createElement('div');
        container.id = 'yt-lang-filter-group';

        // Кнопка для Русского
        const btnRu = document.createElement('button');
        btnRu.className = 'yt-lang-btn';
        btnRu.innerText = 'Скрыть RU';
        btnRu.onclick = () => {
            STATE.hideRussian = !STATE.hideRussian;
            btnRu.classList.toggle('active', STATE.hideRussian);
            applyFilter();
        };

        // Кнопка для Английского
        const btnEn = document.createElement('button');
        btnEn.className = 'yt-lang-btn';
        btnEn.innerText = 'Скрыть EN';
        btnEn.onclick = () => {
            STATE.hideEnglish = !STATE.hideEnglish;
            btnEn.classList.toggle('active', STATE.hideEnglish);
            applyFilter();
        };

        container.appendChild(btnRu);
        container.appendChild(btnEn);

        // Вставляем контейнер в #title
        headerTitle.appendChild(container);
    }

    // --- Наблюдатель за изменениями DOM ---
    function initObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldRefilter = false;
            let headerFound = false;

            mutations.forEach(mutation => {
                // Если добавились узлы (подгрузка комментариев)
                if (mutation.addedNodes.length) {
                    shouldRefilter = true;
                    // Проверяем, появился ли заголовок, если кнопок еще нет
                    if (!document.getElementById('yt-lang-filter-group')) {
                        createButtons();
                    }
                }
            });

            if (shouldRefilter) {
                applyFilter();
            }
        });

        // Наблюдаем за всем body, так как YouTube - это SPA (Single Page App)
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- Запуск ---
    // Используем setInterval для надежности инициализации при навигации
    const intervalId = setInterval(() => {
        const header = document.querySelector('ytd-comments-header-renderer #title');
        if (header) {
            createButtons();
            // Как только нашли заголовок и создали кнопки, можно запускать Observer
            // Но лучше оставить setInterval или Observer работать всегда,
            // т.к. при переходе на другое видео заголовок перерисовывается.
        }
    }, 1000);

    initObserver();

})();