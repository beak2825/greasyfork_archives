// ==UserScript==
// @name        Быстрый вход | BBW
// @namespace   Violentmonkey Scripts
// @match       https://a24.biz/
// @match       https://a24.biz/login
// @match       https://avtor24.ru/
// @match       https://avtor24.ru/login
// @grant       none
// @version     1
// @author      Семён
// @description Быстрый вход с динамической загрузкой аккаунтов из GAS
// @downloadURL https://update.greasyfork.org/scripts/555817/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B2%D1%85%D0%BE%D0%B4%20%7C%20BBW.user.js
// @updateURL https://update.greasyfork.org/scripts/555817/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B2%D1%85%D0%BE%D0%B4%20%7C%20BBW.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GAS_URL = 'https://script.google.com/macros/s/AKfycbwViulD8QsScjsJbuZkjMWGarWt3UTDGbBCF9ZrUZoWXtpCkYbAs2kMvTvcTbq0N4sg/exec'; // <- сюда вставить ссылку на GAS, возвращающую массив объектов

    // --- Основной запуск ---
    loadAccounts().then(accounts => {
        if (!accounts || !accounts.length) return;
        initUI(accounts);
    });

    // ==========================
    //    ЗАГРУЗКА АККАУНТОВ
    // ==========================
    async function loadAccounts() {
        try {
            const savedData = localStorage.getItem('bbw_accounts');
            let oldAccounts = savedData ? JSON.parse(savedData) : null;

            const response = await fetch(GAS_URL);
            const newAccounts = await response.json(); // [{Логин:"", Пароль:"", Имя:""}]

            // Если нет сохранённых или данные изменились — обновляем localStorage
            if (!oldAccounts || JSON.stringify(oldAccounts) !== JSON.stringify(newAccounts)) {
                localStorage.setItem('bbw_accounts', JSON.stringify(newAccounts));
                oldAccounts = newAccounts;
            }

            return oldAccounts;

        } catch (err) {
            console.error('Ошибка загрузки аккаунтов из GAS:', err);
            const savedData = localStorage.getItem('bbw_accounts');
            return savedData ? JSON.parse(savedData) : [];
        }
    }

    // ==========================
    //      ОТРИСОВКА КНОПОК
    // ==========================
    function initUI(accounts) {
        const form = document.querySelector('form.redesign-auth__form');
        if (!form) return;

        const oldContainer = document.getElementById('bbw-buttons-container');
        if (oldContainer) oldContainer.remove();

        const container = document.createElement('div');
        container.id = 'bbw-buttons-container';
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.justifyContent = 'center';
        container.style.gap = '10px';
        container.style.padding = '20px 0';
        container.style.backgroundColor = '#f8f9fa';
        container.style.borderRadius = '8px';
        container.style.marginBottom = '20px';
        container.style.width = '100%';
        container.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

        accounts.forEach(acc => {
            const btn = document.createElement('button');
            btn.textContent = acc["Имя"];
            btn.style.padding = '10px 18px';
            btn.style.backgroundColor = 'rgb(129, 49, 235)';
            btn.style.color = 'white';
            btn.style.border = 'none';
            btn.style.borderRadius = '6px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '15px';
            btn.style.fontWeight = '500';
            btn.style.transition = 'background-color 0.3s, transform 0.2s';
            btn.style.flex = '1 1 calc(33% - 20px)';
            btn.style.maxWidth = '200px';

            btn.addEventListener('mouseover', () => {
                btn.style.backgroundColor = 'rgb(100, 30, 200)';
                btn.style.transform = 'scale(1.05)';
            });
            btn.addEventListener('mouseout', () => {
                btn.style.backgroundColor = 'rgb(129, 49, 235)';
                btn.style.transform = 'scale(1)';
            });

            btn.addEventListener('click', () => autofillAndSubmit(acc));

            container.appendChild(btn);
        });

        form.insertBefore(container, form.firstChild);
    }

    // ==========================
    //    АВТОЗАПОЛНЕНИЕ ФОРМЫ
    // ==========================
    function autofillAndSubmit(acc) {
        const form = document.querySelector('form.redesign-auth__form');
        if (!form) return;

        const emailInput = form.querySelector('input[name="email"]');
        const passwordInput = form.querySelector('input[name="password"]');

        if (emailInput && passwordInput) {
            emailInput.value = acc["Логин"];
            passwordInput.value = acc["Пароль"];

            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) submitButton.click();
        }
    }

})();
