// ==UserScript==
// @name         Yandex Infinite Scroll
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Бесконечный скролл
// @author       torch
// @match        https://yandex.ru/search/*
// @match        https://yandex.by/search/*
// @match        https://yandex.kz/search/*
// @match        https://yandex.com/search/*
// @match        https://ya.ru/search/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561032/Yandex%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/561032/Yandex%20Infinite%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Yandex Scroll v3: Запущен');

    const CONFIG = {
        container: '#search-result', // Основной список
        item: '.serp-item',          // Элементы
        // Селекторы кнопки "Дальше"
        nextLinkSelectors: [
            '.Pager-ListItem_type_next a',
            'a[aria-label="Следующая страница"]',
            '.Pager-Item_type_next',
            '.pager__item_kind_next' // Иногда бывает такой класс
        ],
        pager: '.Pager',             // Пагинация
        distance: 400,               // Грузить, когда осталось 400px до низа
        minDelay: 1000,              // Мин. задержка (мс)
        maxDelay: 2500               // Макс. задержка (мс)
    };

    let isLoading = false;
    let isFinished = false;
    let isScheduled = false; // Флаг планирования загрузки

    // Стиль лоадера
    const loader = document.createElement('div');
    loader.style.cssText = `
        background: #f5f5f5;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        padding: 12px;
        margin: 20px auto;
        width: 80%;
        text-align: center;
        color: #555;
        font-family: Arial, sans-serif;
        font-size: 14px;
        display: none;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    `;
    loader.innerHTML = '⟳ Подготовка к загрузке...';

    function init() {
        const container = document.querySelector(CONFIG.container);
        if (!container) return;

        container.parentNode.appendChild(loader);

        // Слушаем скролл
        window.addEventListener('scroll', () => {
            if (isLoading || isFinished || isScheduled) return;

            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const clientHeight = window.innerHeight;

            // Если до низа осталось мало места
            if (scrollTop + clientHeight >= scrollHeight - CONFIG.distance) {
                scheduleLoad();
            }
        });
    }

    // Планировщик с задержкой (чтобы не злить Яндекс)
    function scheduleLoad() {
        isScheduled = true;

        // Генерируем случайную задержку
        const delay = Math.floor(Math.random() * (CONFIG.maxDelay - CONFIG.minDelay + 1)) + CONFIG.minDelay;

        loader.innerHTML = `⏳ <b>Пауза ${Math.round(delay/100)/10} сек</b> (защита от капчи)...`;
        loader.style.display = 'block';

        setTimeout(() => {
            loadNextPage();
        }, delay);
    }

    function getNextUrl() {
        for (let selector of CONFIG.nextLinkSelectors) {
            const link = document.querySelector(selector);
            if (link && link.href) return link.href;
        }
        return null;
    }

    async function loadNextPage() {
        const url = getNextUrl();
        if (!url) {
            isFinished = true;
            loader.innerHTML = '🏁 Результаты закончились';
            return;
        }

        isLoading = true;
        loader.innerHTML = '🚀 Загрузка данных...';

        try {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            // Проверка на капчу
            if (doc.querySelector('.CheckboxCaptcha') || doc.querySelector('.SmartCaptcha') || doc.title.includes('Ой!')) {
                loader.innerHTML = `
                    <div style="color:red; font-weight:bold;">⚠️ Яндекс запросил капчу!</div>
                    <div style="margin-top:5px;">Скрипт остановлен. Нажмите на <a href="${url}" style="color:blue; text-decoration:underline;">эту ссылку</a>, чтобы пройти проверку вручную.</div>
                `;
                isFinished = true; // Останавливаем скрипт, пока пользователь не решит проблему
                return;
            }

            // Добавление элементов
            const newItems = doc.querySelectorAll(`${CONFIG.container} > ${CONFIG.item}`);
            const container = document.querySelector(CONFIG.container);

            if (newItems.length > 0) {
                newItems.forEach(item => container.appendChild(item));
            } else {
                isFinished = true;
                loader.style.display = 'none';
            }

            // Обновление пагинации
            const currentPager = document.querySelector(CONFIG.pager);
            const newPager = doc.querySelector(CONFIG.pager);

            if (currentPager && newPager) {
                currentPager.innerHTML = newPager.innerHTML;
            } else if (!newPager) {
                if (currentPager) currentPager.style.display = 'none';
                isFinished = true;
            }

        } catch (error) {
            console.error(error);
            loader.innerHTML = '❌ Ошибка сети. Попробуйте прокрутить чуть вверх и вниз.';
        } finally {
            isLoading = false;
            isScheduled = false; // Разрешаем планировать следующую загрузку
            if (!isFinished) loader.style.display = 'none';
        }
    }

    init();
})();