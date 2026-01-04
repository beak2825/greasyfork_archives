// ==UserScript==
// @name         Pupupu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Нажимает «Подтверждаю», а затем «Закрыть» в окнах контроля присутствия
// @author       c0lbarator, OpenAI o3
// @match        https://*.webinar.ru/*, https://*.mts-link.ru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549610/Pupupu.user.js
// @updateURL https://update.greasyfork.org/scripts/549610/Pupupu.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Универсальная утилита для «наблюдения» за DOM-элементами
    function waitForElement(selector, {root = document, timeout = 30_000} = {}) {
        return new Promise((resolve, reject) => {
            // Проверяем, есть ли элемент уже
            const elem = root.querySelector(selector);
            if (elem) return resolve(elem);

            // Создаём MutationObserver
            const observer = new MutationObserver(() => {
                const el = root.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(root, {childList: true, subtree: true});

            // Защита от «вечного ожидания»
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`waitForElement: "${selector}" not found within ${timeout} ms`));
            }, timeout);
        });
    }

    // Обработчик первой модалки — «Контроль присутствия»
    async function handleAttentionControl() {
        try {
            const confirmBtn = await waitForElement('[data-testid="AttentionControlModal.action.submit.Button"]');
            confirmBtn.click();
            console.log('[AutoConfirm] Клик «Подтверждаю» выполнен');
        } catch (e) {
            console.warn('[AutoConfirm] Кнопка «Подтверждаю» не найдена:', e.message);
        }
    }

    // Обработчик второй модалки — успешное подтверждение
    async function handleSuccessModal() {
        try {
            const closeBtn = await waitForElement('[data-testid="AttentionControlSuccessModal.action.cancel"]');
            closeBtn.click();
            console.log('[AutoConfirm] Клик «Закрыть» выполнен');
        } catch (e) {
            console.warn('[AutoConfirm] Кнопка «Закрыть» не найдена:', e.message);
        }
    }

    // Главный цикл: отслеживаем появление конкретных модалок
    const observer = new MutationObserver(() => {
        // Если появилась первая модалка
        if (document.querySelector('[data-testid="AttentionControlModal"]')) {
            handleAttentionControl();
        }
        // Если появилась вторая модалка
        if (document.querySelector('[data-testid="AttentionControlSuccessModal"]')) {
            handleSuccessModal();
        }
    });

    // Запускаем наблюдение за всем документом
    observer.observe(document.documentElement, {childList: true, subtree: true});

    console.log('[AutoConfirm] Tampermonkey скрипт активирован');
})();
