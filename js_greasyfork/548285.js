// ==UserScript==
// @name         AssTars Whitelist Hasher
// @namespace    asstars.tv
// @version      1.1
// @description  Добавляет на asstars кнопку для массового создания SHA-256 хешей из файла.
// @author       You
// @match        https://asstars.tv/*
// @match        https://animestars.org/*
// @match        https://astars.club/*
// @match        https://asstars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://as1.astars.club/*
// @match        https://as1.asstars.tv/*
// @match        https://as2.asstars.tv/*
// @match        https://asstars.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548285/AssTars%20Whitelist%20Hasher.user.js
// @updateURL https://update.greasyfork.org/scripts/548285/AssTars%20Whitelist%20Hasher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function sha256(message) {
        const cleanMessage = message.trim();
        if (cleanMessage === '') return null;
        const msgBuffer = new TextEncoder().encode(cleanMessage);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    async function processFile(file) {
        if (!file) {
            alert('Файл не выбран.');
            return;
        }
        try {
            const text = await file.text();
            const usernames = text.split(/\r?\n/);
            const hashPromises = usernames.map(name => sha256(name));
            const allHashes = await Promise.all(hashPromises);
            const outputString = allHashes.filter(h => h !== null).join('\n');

            downloadFile('hashes.txt', outputString);
        } catch (error) {
            console.error('Ошибка при обработке файла:', error);
            alert('Произошла ошибка при обработке файла. Подробности в консоли (F12).');
        }
    }

    // --- Функция для скачивания файла ---
    function downloadFile(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    // --- Создание и вставка кнопки на страницу ---
    function createUI() {
        // Ищем подвал сайта
        const footer = document.querySelector('footer.footer');
        if (!footer) {
            // Если подвал не найден сразу, попробуем позже
            setTimeout(createUI, 500);
            return;
        }

        // Проверяем, не была ли кнопка уже добавлена
        if (document.getElementById('as-hasher-btn')) return;

        // Создаем скрытый элемент для выбора файла
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt,text/plain';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', (event) => {
            processFile(event.target.files[0]);
            // Сбрасываем значение, чтобы можно было выбрать тот же файл еще раз
            event.target.value = '';
        });

        // Создаем видимую кнопку
        const button = document.createElement('a');
        button.id = 'as-hasher-btn';
        button.href = '#';
        button.className = 'footer__btn btn'; // Используем стили кнопок сайта
        button.textContent = '⚙️ Генерировать хеши';
        button.style.marginLeft = '10px';
        button.onclick = (e) => {
            e.preventDefault();
            fileInput.click(); // По клику на кнопку открываем диалог выбора файла
        };

        // Добавляем элементы на страницу
        document.body.appendChild(fileInput);
        footer.appendChild(button);
    }

    // Запускаем создание UI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }
})();