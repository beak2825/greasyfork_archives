// ==UserScript==
// @name         YouTube Comment Language Filter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Фильтр комментариев по языку (Русский/Английский) с плавающей кнопкой
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558814/YouTube%20Comment%20Language%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/558814/YouTube%20Comment%20Language%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Настройки ---
    const STATE = {
        hideRussian: false,
        hideEnglish: false
    };

    // --- Создание интерфейса (UI) ---
    function createUI() {
        const container = document.createElement('div');
        container.id = 'yt-lang-filter-panel';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #212121;
            color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            z-index: 9999;
            font-family: Roboto, Arial, sans-serif;
            font-size: 14px;
            border: 1px solid #3e3e3e;
            display: flex;
            flex-direction: column;
            gap: 10px;
            opacity: 0.9;
            transition: opacity 0.3s;
        `;

        // Заголовок
        const title = document.createElement('div');
        title.innerText = 'Скрыть комментарии:';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '5px';
        container.appendChild(title);

        // Чекбокс для Русского
        const ruLabel = createCheckbox('Русский', (checked) => {
            STATE.hideRussian = checked;
            applyFilter();
        });
        container.appendChild(ruLabel);

        // Чекбокс для Английского
        const enLabel = createCheckbox('English', (checked) => {
            STATE.hideEnglish = checked;
            applyFilter();
        });
        container.appendChild(enLabel);

        // Hover эффект для прозрачности
        container.onmouseenter = () => { container.style.opacity = '1'; };
        container.onmouseleave = () => { container.style.opacity = '0.5'; }; // Полупрозрачный, когда не используется

        document.body.appendChild(container);
    }

    function createCheckbox(labelText, onChange) {
        const label = document.createElement('label');
        label.style.cssText = `
            display: flex;
            align-items: center;
            cursor: pointer;
            gap: 8px;
        `;

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.style.cursor = 'pointer';
        input.onchange = (e) => onChange(e.target.checked);

        const text = document.createElement('span');
        text.innerText = labelText;

        label.appendChild(input);
        label.appendChild(text);
        return label;
    }

    // --- Логика определения языка ---
    function detectLanguage(text) {
        if (!text) return 'unknown';

        // Простая эвристика: считаем количество букв
        const ruCount = (text.match(/[а-яА-ЯёЁ]/g) || []).length;
        const enCount = (text.match(/[a-zA-Z]/g) || []).length;

        if (ruCount > 0 && ruCount >= enCount) return 'ru';
        if (enCount > 0 && enCount > ruCount) return 'en';

        return 'other';
    }

    // --- Применение фильтра ---
    function applyFilter() {
        // Находим все контейнеры комментариев (основные и ответы)
        const comments = document.querySelectorAll('ytd-comment-thread-renderer, ytd-comment-view-model');

        comments.forEach(comment => {
            // Ищем текст комментария
            const contentTextElement = comment.querySelector('#content-text');
            if (!contentTextElement) return;

            const text = contentTextElement.innerText;
            const lang = detectLanguage(text);

            let shouldHide = false;

            if (STATE.hideRussian && lang === 'ru') shouldHide = true;
            if (STATE.hideEnglish && lang === 'en') shouldHide = true;

            // Скрываем или показываем
            if (shouldHide) {
                comment.style.display = 'none';
            } else {
                comment.style.display = '';
            }
        });
    }

    // --- Наблюдатель (Observer) ---
    // Следит за изменениями на странице, чтобы фильтровать новые подгруженные комментарии
    function initObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    shouldUpdate = true;
                    break;
                }
            }
            if (shouldUpdate) {
                applyFilter();
            }
        });

        // Наблюдаем за основным контейнером приложения
        const app = document.querySelector('ytd-app');
        if (app) {
            observer.observe(app, { childList: true, subtree: true });
        } else {
            // Если ytd-app еще нет, пробуем body
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // --- Запуск ---
    window.addEventListener('load', () => {
        // Небольшая задержка, чтобы интерфейс YouTube прогрузился
        setTimeout(() => {
            createUI();
            initObserver();
            // Периодическая проверка на всякий случай (для SPA переходов)
            setInterval(applyFilter, 2000);
        }, 1500);
    });

})();