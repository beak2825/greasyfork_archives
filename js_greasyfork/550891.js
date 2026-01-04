// ==UserScript==
// @name         Ozon Auto Sorter
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  Автоматически сортирует по "Новинкам" через URL и добавляет плавающую кнопку для включения/выключения.
// @author       You
// @match        https://www.ozon.ru/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550891/Ozon%20Auto%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/550891/Ozon%20Auto%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Управление состоянием (ВКЛ/ВЫКЛ) ---
    const STORAGE_KEY = 'ozonSorterIsEnabled';
    let isEnabled = localStorage.getItem(STORAGE_KEY) !== 'false'; // По умолчанию включено

    // --- Создание плавающей кнопки ---
    let toggleButton = document.createElement('button');
    toggleButton.id = 'ozon-sorter-toggle';
    document.body.appendChild(toggleButton);

    function updateButtonState() {
        if (isEnabled) {
            toggleButton.textContent = 'Автосортировка: ВКЛ';
            toggleButton.style.backgroundColor = '#4CAF50'; // Зеленый
            toggleButton.style.color = 'white';
        } else {
            toggleButton.textContent = 'Автосортировка: ВЫКЛ';
            toggleButton.style.backgroundColor = '#f44336'; // Красный
            toggleButton.style.color = 'white';
        }
    }

    // При клике на кнопку меняем состояние и сохраняем его
    toggleButton.addEventListener('click', () => {
        isEnabled = !isEnabled;
        localStorage.setItem(STORAGE_KEY, isEnabled);
        updateButtonState();
        console.log(`Ozon Sorter: Автосортировка теперь ${isEnabled ? 'ВКЛЮЧЕНА' : 'ВЫКЛЮЧЕНА'}.`);
    });

    // Стили для кнопки (можно менять по вкусу)
    GM_addStyle(`
        #ozon-sorter-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            border: none;
            outline: none;
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-family: sans-serif;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        }
    `);

    // --- Основная логика сортировки ---
    let lastCheckedUrl = '';

    const sortPageByUrl = () => {
        // Главный переключатель: если функция выключена, ничего не делаем
        if (!isEnabled) {
            return;
        }

        const currentUrl = window.location.href;
        if (currentUrl === lastCheckedUrl) return;
        lastCheckedUrl = currentUrl;

        try {
            const urlObject = new URL(currentUrl);
            const path = urlObject.pathname;
            const params = urlObject.searchParams;

            const isSortablePage = path.includes('/category/') || path.includes('/search/') || path.includes('/seller/');
            const isAlreadySorted = params.get('sorting') === 'new';

            if (isSortablePage && !isAlreadySorted) {
                console.log("Ozon Sorter: Сортировка включена и требуется. Перезагружаю страницу с параметром `sorting=new`.");
                params.set('sorting', 'new');
                window.location.search = params.toString();
            }

        } catch (e) {
            // Игнорируем ошибки для невалидных URL (например, 'about:blank')
        }
    };

    // --- Запуск и отслеживание ---

    // Устанавливаем начальное состояние кнопки
    updateButtonState();

    // Наблюдатель для отслеживания переходов внутри сайта
    const observer = new MutationObserver(() => sortPageByUrl());
    observer.observe(document.body, { childList: true, subtree: true });

    // Первоначальный запуск
    sortPageByUrl();
})();