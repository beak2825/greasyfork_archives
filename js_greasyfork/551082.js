// ==UserScript==
// @name        Дополнительные ссылки с настройками
// @namespace   http://tampermonkey.net/
// @match       https://patron.kinwoods.com/game
// @match       https://patron.kinwoods.com/settings
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @license      CC BY-NC-ND 4.0
// @version     1.5
// @author      Шумелка (347). ВК - https://vk.com/oleg_rennege
// @description Добавляет новые ссылки в быстрый доступ и настройки для их управления.
// @downloadURL https://update.greasyfork.org/scripts/551082/%D0%94%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D1%81%20%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%D0%BC%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/551082/%D0%94%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D1%81%20%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%D0%BC%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Добавляем стили для вертикального расположения ссылок
    GM_addStyle(`
        .links {
            display: flex !important;
            flex-direction: column !important;
            gap: 5px !important;
            align-items: flex-start !important;
        }
        .links a {
            display: block !important;
            margin: 2px 0 !important;
        }
    `);

    // Настройки по умолчанию
    const defaultSettings = {
        showMain: true,
        showPlayers: true,
        showAchievements: true,
        showSettings: true
    };

    // Получаем текущие настройки
    function getSettings() {
        const saved = GM_getValue('linkSettings');
        return saved ? {...defaultSettings, ...saved} : defaultSettings;
    }

    // Сохраняем настройки
    function saveSettings(settings) {
        GM_setValue('linkSettings', settings);
    }

    // Функция для добавления ссылок в игре
    function addLinksToGame() {
        const linksContainer = document.querySelector('.links');

        if (!linksContainer) {
            console.log('Блок ссылок не найден');
            return;
        }

        const settings = getSettings();

        // Удаляем все ссылки, которые могли быть добавлены ранее нашим скриптом
        // Это нужно чтобы при изменении настроек ссылки обновлялись правильно
        const existingCustomLinks = linksContainer.querySelectorAll('a[href="/"], a[href="/list"], a[href="/achieves"], a[href="/settings"]');
        existingCustomLinks.forEach(link => {
            // Удаляем только если это не оригинальные ссылки игры
            const prevSibling = link.previousSibling;
            if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE && prevSibling.textContent === ' ') {
                link.remove();
                prevSibling.remove();
            }
        });

        // Добавляем ссылки согласно настройкам
        if (settings.showMain) {
            addLink(linksContainer, '/', 'Главная');
        }

        if (settings.showPlayers) {
            addLink(linksContainer, '/list', 'Игроки');
        }

        if (settings.showAchievements) {
            addLink(linksContainer, '/achieves', 'Достижения');
        }

        if (settings.showSettings) {
            addLink(linksContainer, '/settings', 'Настройки');
        }
    }

    // Вспомогательная функция для добавления одной ссылки
    function addLink(container, href, text) {
        // Проверяем, нет ли уже такой ссылки
        if (container.querySelector(`a[href="${href}"]`)) {
            return;
        }

        const link = document.createElement('a');
        link.href = href;
        link.target = '_blank';
        link.textContent = text;

        // Добавляем ссылку в контейнер
        container.appendChild(link);

        console.log(`Ссылка "${text}" добавлена`);
    }

    // Функция для добавления настроек на страницу настроек
    function addSettingsToSettingsPage() {
        // Ищем контейнер настроек по классу из вашего HTML
        const settingsContainer = document.querySelector('.container.svelte-9mefjq');

        if (!settingsContainer) {
            console.log('Контейнер настроек не найден');
            // Попробуем найти через несколько секунд, если страница еще загружается
            setTimeout(addSettingsToSettingsPage, 1000);
            return;
        }

        // Проверяем, не добавлены ли уже наши настройки
        if (settingsContainer.querySelector('#custom-links-settings')) {
            return;
        }

        const settings = getSettings();

        // Создаем HTML для наших настроек
        const settingsHTML = `
            <div id="custom-links-settings" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                <h3 style="margin-bottom: 15px; color: #333;">Настройки быстрых ссылок</h3>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="showMain" ${settings.showMain ? 'checked' : ''} class="svelte-9mefjq">
                        Показывать ссылку "Главная"
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="showPlayers" ${settings.showPlayers ? 'checked' : ''} class="svelte-9mefjq">
                        Показывать ссылку "Игроки"
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="showAchievements" ${settings.showAchievements ? 'checked' : ''} class="svelte-9mefjq">
                        Показывать ссылку "Достижения"
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="showSettings" ${settings.showSettings ? 'checked' : ''} class="svelte-9mefjq">
                        Показывать ссылку "Настройки"
                    </label>
                </div>
                <button id="saveLinkSettings" style="margin-top: 15px; padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                    Сохранить настройки ссылок
                </button>
                <div id="saveMessage" style="margin-top: 10px; color: #4CAF50; font-size: 12px; display: none;">
                    Настройки сохранены! Обновите страницу игры для применения изменений.
                </div>
            </div>
        `;

        // Добавляем наши настройки в конец контейнера настроек
        settingsContainer.insertAdjacentHTML('beforeend', settingsHTML);

        // Добавляем обработчик для кнопки сохранения
        document.getElementById('saveLinkSettings').addEventListener('click', function() {
            const newSettings = {
                showMain: document.getElementById('showMain').checked,
                showPlayers: document.getElementById('showPlayers').checked,
                showAchievements: document.getElementById('showAchievements').checked,
                showSettings: document.getElementById('showSettings').checked
            };

            saveSettings(newSettings);

            // Показываем сообщение об успехе
            const message = document.getElementById('saveMessage');
            message.style.display = 'block';
            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);
        });

        console.log('Настройки быстрых ссылок добавлены на страницу настроек');
    }

    // Определяем, на какой странице мы находимся и запускаем соответствующую функциональность
    if (window.location.pathname === '/game') {
        // На странице игры - добавляем ссылки
        if (document.querySelector('.links')) {
            addLinksToGame();
        } else {
            // Если блок еще не загружен, ждем его появления
            const observer = new MutationObserver(() => {
                if (document.querySelector('.links')) {
                    observer.disconnect();
                    addLinksToGame();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    } else if (window.location.pathname === '/settings') {
        // На странице настроек - добавляем наши настройки
        // Ждем полной загрузки страницы
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                // Даем странице немного времени для полной инициализации
                setTimeout(addSettingsToSettingsPage, 500);
            });
        } else {
            setTimeout(addSettingsToSettingsPage, 500);
        }
    }

})();