// ==UserScript==
// @name         Rutracker Sort by Size
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Добавляет сортировку по размеру файла на страницах разделов Rutracker
// @author       You
// @match        https://rutracker.org/forum/viewforum.php?f=*
// @match        https://rutracker.net/forum/viewforum.php?f=*
// @match        https://rutracker.nl/forum/viewforum.php?f=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rutracker.org
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/564367/Rutracker%20Sort%20by%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/564367/Rutracker%20Sort%20by%20Size.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для перевода размера из текста (например "4.17 GB") в байты
    function parseSize(sizeStr) {
        if (!sizeStr) return -1;

        // Удаляем лишние пробелы и nbsp
        sizeStr = sizeStr.replace(/&nbsp;/g, ' ').trim();

        const match = sizeStr.match(/([\d.]+)\s*([a-zA-Z]+)/);
        if (!match) return -1;

        const num = parseFloat(match[1]);
        const unit = match[2].toUpperCase();

        const units = {
            'KB': 1024,
            'MB': 1024 ** 2,
            'GB': 1024 ** 3,
            'TB': 1024 ** 4,
            'PB': 1024 ** 5
        };

        // Если единицы нет в списке (например, просто байты), считаем как есть
        return num * (units[unit] || 1);
    }

    // Основная функция сортировки
    function initSort() {
        const table = document.querySelector('table.vf-table.vf-tor');
        if (!table) return;

        // Находим заголовок столбца "Торрент"
        const headerCell = table.querySelector('th.vf-col-tor');
        if (!headerCell) return;

        // Стилизуем заголовок
        headerCell.style.cursor = 'pointer';
        headerCell.style.userSelect = 'none';
        headerCell.title = 'Нажмите для сортировки по размеру';

        // Добавляем индикатор
        const originalText = headerCell.innerText;
        headerCell.innerHTML = `${originalText} <span id="sort-arrow" style="font-size: 0.8em;">↕</span>`;

        let sortDirection = 1; // 1 = по убыванию (сначала большие), -1 = по возрастанию

        headerCell.addEventListener('click', () => {
            const tbody = table.querySelector('tbody');
            // Получаем все строки с раздачами (игнорируем заголовки разделов)
            const rows = Array.from(tbody.querySelectorAll('tr.hl-tr'));

            // Находим строки-разделители (Важное, Темы и т.д.), чтобы скрыть их при сортировке
            const separators = tbody.querySelectorAll('tr.topicSep');
            separators.forEach(sep => sep.style.display = 'none');

            // Сортируем
            rows.sort((rowA, rowB) => {
                const elA = rowA.querySelector('.f-dl');
                const elB = rowB.querySelector('.f-dl');

                const sizeA = elA ? parseSize(elA.innerText) : -1;
                const sizeB = elB ? parseSize(elB.innerText) : -1;

                return (sizeB - sizeA) * sortDirection;
            });

            // Обновляем стрелочку
            const arrow = document.getElementById('sort-arrow');
            arrow.innerText = sortDirection === 1 ? '▼' : '▲';

            // Возвращаем отсортированные строки в таблицу
            // Примечание: appendChild перемещает существующие элементы, а не копирует их
            rows.forEach(row => tbody.appendChild(row));

            // Инвертируем направление для следующего клика
            sortDirection *= -1;
        });
    }

    // Запуск после загрузки страницы
    window.addEventListener('load', initSort);
    // На случай, если скрипт запустится позже
    if (document.readyState === 'complete') {
        initSort();
    }

})();