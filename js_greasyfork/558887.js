// ==UserScript==
// @name         Yandex Video: Только Прямой Эфир + Авто-загрузка
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Скрывает все видео кроме прямых эфиров и сам нажимает кнопку "Ещё видео"
// @author       torch
// @match        https://yandex.ru/video/*
// @match        https://yandex.com/video/*
// @match        https://ya.ru/video/*
// @icon         https://yastatic.net/s3/home-static/_/37/37a02b5dc7a51abac55d8a5b6c865f0e.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558887/Yandex%20Video%3A%20%D0%A2%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D0%9F%D1%80%D1%8F%D0%BC%D0%BE%D0%B9%20%D0%AD%D1%84%D0%B8%D1%80%20%2B%20%D0%90%D0%B2%D1%82%D0%BE-%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/558887/Yandex%20Video%3A%20%D0%A2%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D0%9F%D1%80%D1%8F%D0%BC%D0%BE%D0%B9%20%D0%AD%D1%84%D0%B8%D1%80%20%2B%20%D0%90%D0%B2%D1%82%D0%BE-%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- НАСТРОЙКИ СЕЛЕКТОРОВ ---
    const VIDEO_ITEM_SELECTOR = '.VideoSnippetSerpFeature';
    const LIVE_BADGE_SELECTOR = '.BadgeLive.BadgeLive_onAir';
    // Селектор кнопки "Ещё видео" (содержит тот самый SpinnerContainer)
    const LOAD_MORE_SELECTOR = '.NextPageButton';

    // Ключ для сохранения настроек
    const STORAGE_KEY = 'yandex_live_filter_enabled';

    let isEnabled = localStorage.getItem(STORAGE_KEY) !== 'false';

    // --- СОЗДАНИЕ КНОПКИ УПРАВЛЕНИЯ ---
    const button = document.createElement('div');
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '99999',
        padding: '12px 20px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        userSelect: 'none',
        transition: 'background 0.3s, transform 0.1s'
    });

    function updateButtonVisuals() {
        if (isEnabled) {
            button.innerText = '🔴 LIVE + AUTOLOAD: ВКЛ';
            button.style.backgroundColor = '#ff3333';
            button.style.color = 'white';
        } else {
            button.innerText = '⚪ LIVE: ВЫКЛ';
            button.style.backgroundColor = '#dddddd';
            button.style.color = '#333';
        }
    }

    button.onclick = function() {
        isEnabled = !isEnabled;
        localStorage.setItem(STORAGE_KEY, isEnabled);
        updateButtonVisuals();
        button.style.transform = 'scale(0.95)';
        setTimeout(() => button.style.transform = 'scale(1)', 100);
        applyFilter();
    };

    updateButtonVisuals();
    document.body.appendChild(button);

    // --- ЛОГИКА ФИЛЬТРАЦИИ ---
    function applyFilter() {
        const videoItems = document.querySelectorAll(VIDEO_ITEM_SELECTOR);
        videoItems.forEach(item => {
            if (!isEnabled) {
                item.style.display = '';
                return;
            }
            const hasLiveBadge = item.querySelector(LIVE_BADGE_SELECTOR);
            item.style.display = hasLiveBadge ? '' : 'none';
        });
    }

    // --- ЛОГИКА АВТО-КЛИКА ---
    function tryClickLoadMore() {
        // Нажимаем только если скрипт включен
        if (!isEnabled) return;

        const loadMoreBtn = document.querySelector(LOAD_MORE_SELECTOR);

        // Проверяем:
        // 1. Кнопка существует
        // 2. Кнопка не скрыта (display none)
        // 3. Яндекс не поставил атрибут disabled (пока идет загрузка)
        if (loadMoreBtn &&
            loadMoreBtn.offsetParent !== null &&
            !loadMoreBtn.disabled &&
            loadMoreBtn.getAttribute('aria-disabled') !== 'true') {

            // Проверяем, мало ли видео на экране.
            // Если на экране много пустого места из-за скрытых видео, жмем кнопку.
            // Или просто жмем периодически, чтобы список рос.
            loadMoreBtn.click();
            // console.log('Скрипт нажал кнопку "Ещё видео"');
        }
    }

    // --- ЗАПУСК ---

    // 1. Фильтруем при загрузке
    applyFilter();

    // 2. Наблюдаем за изменениями DOM (для фильтрации новых видео)
    const observer = new MutationObserver((mutations) => {
        let nodesAdded = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                nodesAdded = true;
                break;
            }
        }
        if (nodesAdded) {
            applyFilter();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 3. Запускаем интервал для проверки кнопки "Ещё"
    // Проверяем каждые 1.5 секунды. Это достаточно быстро, но не повесит браузер.
    setInterval(tryClickLoadMore, 1500);

})();