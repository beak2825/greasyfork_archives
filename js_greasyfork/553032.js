// ==UserScript==
// @name         YouTube - Lazy Load Comments
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Загружает комментарии на YouTube только по клику.
// @author       You
// @match        https://www.youtube.com/watch*
// @grant        GM_addStyle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/553032/YouTube%20-%20Lazy%20Load%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/553032/YouTube%20-%20Lazy%20Load%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Сразу скрываем комментарии
    GM_addStyle('#comments { display: none; }');

    function createLoadButton() {
        const commentsSection = document.querySelector('#comments');
        if (!commentsSection || document.getElementById('load-comments-btn')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'load-comments-btn';
        button.textContent = '👇 Показать комментарии';
        button.style.cssText = `
            width: 100%;
            padding: 15px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            border: 1px solid #ccc;
            border-radius: 8px;
            margin: 20px 0;
            background-color: #f0f0f0;
        `;
        // Стили для темной темы
        if (document.documentElement.hasAttribute('dark')) {
            button.style.backgroundColor = '#272727';
            button.style.borderColor = '#444';
            button.style.color = '#fff';
        }


        commentsSection.parentNode.insertBefore(button, commentsSection);

        button.addEventListener('click', () => {
            commentsSection.style.display = 'block';
            button.remove();
        }, { once: true }); // Обработчик сработает только один раз
    }

    // YouTube - одностраничное приложение, поэтому нужно следить за изменениями
    const observer = new MutationObserver(() => {
        // Мы ищем не сам блок #comments, а его "окрестности", чтобы вставить кнопку
        if (document.querySelector('#below')) {
            createLoadButton();
        }
    });

    // Начинаем наблюдение после загрузки основной части страницы
    window.addEventListener('yt-navigate-finish', () => {
        // Даем небольшую задержку, чтобы элементы успели появиться
        setTimeout(createLoadButton, 500);
        observer.observe(document.body, { childList: true, subtree: true });
    });

    // Для первой загрузки страницы
    setTimeout(createLoadButton, 1000);

})();