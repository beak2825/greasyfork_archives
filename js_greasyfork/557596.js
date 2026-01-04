// ==UserScript==
// @name         Pikabu Quick Ignore Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Быстрый пожизненный игнор через кнопку kill рядом с каждым постом
// @match        https://pikabu.ru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557596/Pikabu%20Quick%20Ignore%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/557596/Pikabu%20Quick%20Ignore%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const show_debug_window = false;

    function getOutputArea() {
        if (!show_debug_window) return { value: "", appendChild(){}, style:{} };

        let textarea = document.getElementById('ignore-output');
        if (!textarea) {
            textarea = document.createElement('textarea');
            textarea.id = 'ignore-output';
            textarea.style.cssText = 'position:fixed;bottom:10px;left:10px;width:400px;height:200px;z-index:9999;background:#fff;color:#000;border:1px solid #ccc;padding:5px;resize:both;';
            document.body.appendChild(textarea);
        }
        return textarea;
    }

    const output = getOutputArea();

    function getCSRF() {
        try {
            const configScript = document.querySelector('script.app__config[data-entry="initParams"]') ||
                                 document.querySelector('script.app__config');
            return JSON.parse(configScript.textContent).csrfToken;
        } catch (e) {
            if (show_debug_window) output.value += 'CSRF токен не найден\n';
            return null;
        }
    }

    function getUserData(header) {
        const link = header.querySelector('a.story__user-link');
        if (!link) return null;
        const username = link.dataset.name || link.textContent.trim();
        const userID = link.dataset.id;
        return { username, userID };
    }

    function handleIgnore(header) {
        const user = getUserData(header);
        if (!user || !user.userID) {
            if (show_debug_window) output.value += 'Не удалось получить данные пользователя\n';
            return;
        }

        const csrf = getCSRF();
        if (!csrf) return;

        const params = new URLSearchParams();
        params.append('authors', user.userID);
        params.append('period', 'forever');
        params.append('action', 'add_rule');

        fetch('https://pikabu.ru/ajax/ignore_actions.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-CSRF-Token': csrf,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: params.toString(),
            credentials: 'include'
        })
        .then(r => r.json().catch(() => r.text()))
        .then(data => {
            if (show_debug_window) {
                output.value += `Имя: ${user.username}\nID: ${user.userID}\nОтвет сервера:\n${JSON.stringify(data, null, 2)}\n\n`;
            }
        })
        .catch(err => {
            if (show_debug_window) {
                output.value += `Ошибка при добавлении ${user.username} в игнор:\n${err}\n\n`;
            }
        });
    }

    function addButtonToPost(header) {
        if (header.querySelector('.ignore_button')) return;

        const h2 = header.querySelector('h2.story__title');
        if (!h2) return;

        const btn = document.createElement('button');
        btn.textContent = 'kill';
        btn.className = 'ignore_button';
        btn.style.cssText = `
            margin-left:5px;
            padding:2px 6px;
            font-size:12px;
            cursor:pointer;
            background-color:#333333;
            color:#FFFFFF;
            border:1px solid #444;
            border-radius:3px;
        `;

        h2.appendChild(btn);
        btn.addEventListener('click', () => handleIgnore(header));
    }

    function insertButtons() {
        document.querySelectorAll('header.story__header').forEach(addButtonToPost);
    }

    insertButtons();

    const observer = new MutationObserver(insertButtons);
    observer.observe(document.body, { childList: true, subtree: true });

})();
