// ==UserScript==
// @name         Hide Watched or Premium Videos on iXXX
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скрывает просмотренные или премиум-видео на iXXX.com. Добавляет кнопку для переключения. Сохраняет состояние в cookie.
// @author       OpenAI
// @match        *://www.ixxx.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548997/Hide%20Watched%20or%20Premium%20Videos%20on%20iXXX.user.js
// @updateURL https://update.greasyfork.org/scripts/548997/Hide%20Watched%20or%20Premium%20Videos%20on%20iXXX.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Кнопка включения/выключения
    const button = document.createElement('button');
    button.textContent = 'Hide On';
    button.style.position = 'fixed';
    button.style.top = '60px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#e91e63';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    document.body.appendChild(button);

    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === name) return value;
        }
        return null;
    }

    let hideEnabled = getCookie('ixxxHide') === 'true';

    function updateButtonText() {
        button.textContent = hideEnabled ? 'Hide On' : 'Hide Off';
    }

    function toggleVideos() {
        const cards = document.querySelectorAll('div.card.sub.group');
        cards.forEach(card => {
            let hide = false;

            // 1. Проверка на премиум
            if (card.querySelector('span.item-premium-container')) {
                hide = true;
            }

            // 2. Проверка на формат "0:39 / 27:50" — наличие слэша
            const durationBadge = card.querySelector('span.badge.float-right');
            if (durationBadge && durationBadge.textContent.includes('/')) {
                hide = true;
            }

            // Применяем отображение
            card.style.display = (hideEnabled && hide) ? 'none' : '';
        });
    }

    button.addEventListener('click', () => {
        hideEnabled = !hideEnabled;
        setCookie('ixxxHide', hideEnabled, 30);
        updateButtonText();
        toggleVideos();
    });

    updateButtonText();
    toggleVideos();

    const observer = new MutationObserver(() => {
        toggleVideos();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
