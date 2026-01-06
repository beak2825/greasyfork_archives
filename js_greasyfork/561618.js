// ==UserScript==
// @name         Редактор быстрых ссылок
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Для добавления своего набора ссылок в раздел быстрых ссылок
// @author       Невезение (166)
// @match        *://patron.kinwoods.com/game/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561618/%D0%A0%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%BE%D1%80%20%D0%B1%D1%8B%D1%81%D1%82%D1%80%D1%8B%D1%85%20%D1%81%D1%81%D1%8B%D0%BB%D0%BE%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/561618/%D0%A0%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%BE%D1%80%20%D0%B1%D1%8B%D1%81%D1%82%D1%80%D1%8B%D1%85%20%D1%81%D1%81%D1%8B%D0%BB%D0%BE%D0%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Вставляем стили
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --color-shadow: #00000040;
        }

        .custom-link-input {
            width: 100%;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            resize: vertical;
            font-family: Inter, monospace;
        }

        .custom-link-input::placeholder {
            opacity: 0.7;
        }

        .quick-links-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--color-shadow);
            z-index: 9998;
        }

        .quick-links-menu {
            position: absolute;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%);
            border-radius: 12px !important;
            padding: 20px !important;
            z-index: 9999 !important;
        }

        .quick-links-title {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 5px;
            font-family: Inter, monospace;
        }

        .quick-link-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            margin: 6px 0;
            border-radius: 6px;
        }

        .quick-link-label {
            font-size: 14px;
        }

        .quick-link-toggle {
            position: relative;
            width: 40px;
            height: 20px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .quick-link-toggle::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            transition: transform 0.3s;
        }

        .quick-link-toggle.active::after {
            transform: translateX(20px);
        }

        .custom-url-label {
            text-align: center;
            margin: 15px 0 5px 0;
            padding-top: 5px;
            font-family: Inter, monospace;
        }

        .links-plus {
            opacity: 0;
            padding: 0 3px;
            border-radius: 10px;
            cursor: pointer;
        }

        .links-plus:hover {
            opacity: 1;
            transition: all 0.3s ease;
            transform: translateY(-1px);
            box-shadow: 0 4px 4px var(--color-shadow);
        }

        /* ===== СВЕТЛАЯ ТЕМА ===== */

        :root {
            --color-bg: #e9eadb;               /* границы меню и разделители - серо-бежевый */
            --color-border-light: #c1bca9;     /* границы меню и разделители - серо-бежевый */
            --color-toggle-inactive: #c1bca9;  /* неактивный переключатель - серо-коричневый */
            --color-toggle-active: #98c045;    /* активный переключатель - яркий зелёный */
        }

        .quick-links-menu {
            background: var(--color-bg);
            border: 2px solid var(--color-border-light);
        }

        .quick-links-title {
            border-bottom: 1px solid var(--color-border-light);
        }

        .quick-link-item {
            background: var(--bg-light);
        }

        .quick-link-toggle {
            background: var(--color-toggle-inactive);
        }

        .quick-link-toggle.active {
            background: var(--color-toggle-active);
        }

        .quick-link-toggle::after {
            background: var(--bg-light);
            box-shadow: 0 4px 4px var(--color-shadow);
        }

        .quick-link-toggle.active::after {
            background: var(--bg-light);
            box-shadow: 0 4px 4px var(--color-shadow);
        }

        .custom-url-label {
            border-top: 1px solid var(--color-border-light);
        }

        .custom-link-input {
            background: var(--bg-light) !important;
            border: 1px solid var(--color-border-light) !important;
        }

        .links-plus {
            background: var(--color-bg);
            border: 1px solid var(--color-border-light);
        }

        /* ===== ТЕМНАЯ ТЕМА ===== */

        :root {
            --color-toggle-knob: #faf2de;   /* внутренний кружок переключателя - светло-бежевый */

            /* Используются в другом скрипте*/
            --color-bg-1: #0a0a08;          /* фон переключателя - чёрный оливковый */
            --color-bg-3: #1c1c16;          /* фон меню - тёмный оливковый */
            --color-bg-4: #22231b;          /* фон элементов и полей ввода - светло-оливковый */
            --color-bg-5: #2a2b20;          /* границы и разделители - серо-оливковый */

            --color-accent-3: #3e4a1a;      /* активный переключатель - тёмный оливково-зелёный */

            --color-text-1: #b5af94;        /* основной текст - светлый бежево-серый */
            --color-text-2: #87826c;        /* второстепенный текст - серо-бежевый */
        }

        .quick-links-menu {
            background: var(--color-bg-3);
            border: 2px solid var(--color-bg-5);
        }

        .quick-links-title {
            color: var(--color-text-1);
            border-bottom: 1px solid var(--color-bg-5);
        }

        .quick-link-item {
            background: var(--color-bg-4);
        }

        .quick-link-label {
            color: var(--color-text-2);
        }

        .quick-link-toggle {
            background: var(--color-bg-1);
        }

        .quick-link-toggle.active {
            background: var(--color-accent-3);
        }

        .quick-link-toggle::after {
            background: #faf2de;
        }

        .quick-link-toggle.active::after {
            background: #faf2de;
        }

        .custom-url-label {
            color: var(--color-text-1);
            border-top: 1px solid var(--color-bg-5);
        }

        .custom-link-input {
            background: var(--color-bg-4) !important;
            border: 1px solid var(--color-bg-5) !important;
            color: var(--color-text-1);
        }

        .custom-link-input::placeholder {
            color: var(--color-text-1) !important;
        }

        .links-plus {
            color: var(--color-text-2);
            background: var(--color-bg-4);
            border: 1px solid var(--color-bg-5);
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        const linksData = {
            'Профиль': { enabled: true, url: '/profile' },
            'Способности': { enabled: true, url: '/abilities' },
            'Фракция': { enabled: true, url: '/faction' },
            'Главная': { enabled: false, url: '/' },
            'Игроки': { enabled: false, url: '/list' },
            'Достижения': { enabled: false, url: '/achieves' },
            'Подписка': { enabled: false, url: 'https://vk.com/topic-221871708_49531506' },
            'Обучение': { enabled: false, url: 'https://vk.com/@-222281771-gaid-po-nachalu-igry' },
            'Настройки': { enabled: false, url: '/settings' },
            'Багрепорт': { enabled: false, url: 'https://vk.com/topic-222281771_50163116' }
        };

        let customLinks = [];
        let menuVisible = false;

        // Загружаем сохраненное
        const saved = localStorage.getItem('kinwoods-quick-links');
        if (saved) {
            const settings = JSON.parse(saved);

            Object.keys(linksData).forEach(name => {
                if (settings.enabledStates && settings.enabledStates[name] !== undefined) {
                    linksData[name].enabled = settings.enabledStates[name];
                }
            });

            if (settings.customLinks) {
                customLinks = settings.customLinks;
            }
        }

        // Добавляем кнопку +
        const linksContainer = document.querySelector('.links');
        const plus = document.createElement('span');
        plus.className = 'links-plus';
        plus.textContent = '+';
        plus.onclick = toggleMenu;
        linksContainer.appendChild(plus);

        // Обновляем ссылки
        function updateLinks() {
            linksContainer.innerHTML = '';

            Object.entries(linksData).forEach(([name, data]) => {
                if (data.enabled) {
                    const a = document.createElement('a');
                    a.href = data.url;
                    a.target = '_blank';
                    a.textContent = name;
                    linksContainer.append(a, ' ');
                }
            });

            customLinks.forEach(link => {
                if (link.enabled) {
                    const a = document.createElement('a');
                    a.href = link.url;
                    a.target = '_blank';
                    a.textContent = link.name;
                    linksContainer.append(a, ' ');
                }
            });

            linksContainer.appendChild(plus);
        }

        // Парсим кастомные ссылки
        function parseCustomLink(text) {
            const links = [];
            const regex = /"([^"]+)"\s+([^,]+)(?:,\s*|$)/g;
            let match;

            while ((match = regex.exec(text)) !== null) {
                const name = match[1];
                let url = match[2].trim();

                if (url.endsWith(',')) url = url.slice(0, -1).trim();

                if (name && url) {
                    if (!url.includes('://')) {
                        url = '//' + url;
                    }
                    links.push({ name, url, enabled: true });
                }
            }

            return links;
        }

        // Сохраняем
        function saveSettings() {
            const enabledStates = {};
            Object.keys(linksData).forEach(name => {
                enabledStates[name] = linksData[name].enabled;
            });

            localStorage.setItem('kinwoods-quick-links', JSON.stringify({
                enabledStates,
                customLinks
            }));
        }

        // Показываем меню
        function showMenu() {
            menuVisible = true;

            const overlay = document.createElement('div');
            overlay.className = 'quick-links-overlay';
            overlay.onclick = hideMenu;

            const menu = document.createElement('div');
            menu.className = 'quick-links-menu';

            const title = document.createElement('div');
            title.className = 'quick-links-title';
            title.textContent = 'Добавление или удаление быстрых ссылок';
            menu.appendChild(title);

            Object.entries(linksData).forEach(([name, data]) => {
                const item = document.createElement('div');
                item.className = 'quick-link-item';

                const label = document.createElement('span');
                label.className = 'quick-link-label';
                label.textContent = name;
                item.appendChild(label);

                const toggle = document.createElement('div');
                toggle.className = `quick-link-toggle ${data.enabled ? 'active' : ''}`;
                toggle.onclick = () => {
                    linksData[name].enabled = !linksData[name].enabled;
                    toggle.classList.toggle('active');
                    saveSettings();
                    updateLinks();
                };
                item.appendChild(toggle);
                menu.appendChild(item);
            });

            const customSection = document.createElement('div');

            const label = document.createElement('div');
            label.className = 'custom-url-label';
            label.textContent = 'Собственные ссылки';
            customSection.appendChild(label);

            const textarea = document.createElement('textarea');
            textarea.className = 'custom-link-input';
            textarea.rows = 3;
            textarea.placeholder = '"Название 1" URL, "Название 2" URL';
            textarea.value = customLinks.map(l => {
                let displayUrl = l.url;
                if (displayUrl.startsWith('//')) {
                    displayUrl = displayUrl.substring(2);
                }
                return `"${l.name}" ${displayUrl}`;
            }).join(', ');

            textarea.oninput = (e) => {
                customLinks = parseCustomLink(e.target.value);
                saveSettings();
                updateLinks();
            };

            customSection.appendChild(textarea);
            menu.appendChild(customSection);
            document.body.append(overlay, menu);

            setTimeout(() => textarea.focus(), 100);
        }

        // Скрываем меню
        function hideMenu() {
            menuVisible = false;
            document.querySelectorAll('.quick-links-overlay, .quick-links-menu').forEach(el => el.remove());
        }

        // Переключаем меню
        function toggleMenu() {
            menuVisible ? hideMenu() : showMenu();
        }

        // Стартуем
        updateLinks();

    }, 1000);
})();