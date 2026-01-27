// ==UserScript==
// @name         LOGS МП чекер
// @namespace    https://tampermonkey.net/
// @version      1.3
// @description  Подсчет созданных МП
// @author       Ярослав Колмогорцев || Jaroslav_Grasso
// @match        https://logs.blackrussia.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563918/LOGS%20%D0%9C%D0%9F%20%D1%87%D0%B5%D0%BA%D0%B5%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/563918/LOGS%20%D0%9C%D0%9F%20%D1%87%D0%B5%D0%BA%D0%B5%D1%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BOX_ID = 'admin-mp-counter-box';
    const FILTER_TEXTAREA_ID = 'log-filter-form__transaction-desc';
    const FILTER_TEXT = '%Создал мероприятие%';
    const statsByDay = {};
    const overallStats = {};
    const processedLogs = new Set();
    let totalMP = 0;
    let isRunning = false;

    // Функция для извлечения даты из строки времени
    function extractDateFromTime(timeString) {
        if (!timeString) return 'Неизвестная дата';

        const dateMatch = timeString.match(/^(\d{2}\/\d{2}\/\d{4})/);
        if (dateMatch && dateMatch[1]) {
            return dateMatch[1];
        }

        const altFormats = [
            /^(\d{1,2}\.\d{1,2}\.\d{4})/,
            /^(\d{4}-\d{2}-\d{2})/,
            /^(\d{1,2}\/\d{1,2}\/\d{2})/
        ];

        for (const format of altFormats) {
            const match = timeString.match(format);
            if (match && match[1]) {
                return match[1];
            }
        }

        return 'Неизвестная дата';
    }

    // Главная функция для вставки текста в фильтр
    function applyMPFilter() {
        const textarea = document.getElementById(FILTER_TEXTAREA_ID);

        if (!textarea) {
            const alternativeTextarea = document.querySelector('textarea[name="transaction_desc__ilike"]');
            if (alternativeTextarea) {
                alternativeTextarea.value = FILTER_TEXT;
                alternativeTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                return;
            }
            return;
        }

        textarea.value = FILTER_TEXT;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Добавление кнопок под строкой с кнопкой "Применить"
    function addButtonsUnderApplyButton() {
        const applyButton = document.querySelector('button.btn-primary[type="submit"]');
        if (!applyButton) return;

        // Проверяем, не добавлены ли уже наши кнопки
        if (applyButton.closest('form')?.querySelector('.mp-custom-buttons-container')) return;

        // Находим родительский контейнер кнопок
        const buttonRow = applyButton.closest('.form-group') || applyButton.closest('.d-flex') || applyButton.parentNode;
        if (!buttonRow) return;

        // Создаем контейнер для наших кнопок
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'mp-custom-buttons-container';
        buttonContainer.style.marginTop = '10px';
        buttonContainer.style.paddingTop = '10px';
        buttonContainer.style.borderTop = '1px solid #dee2e6';

        // Создаем строку для кнопок
        const buttonRowDiv = document.createElement('div');
        buttonRowDiv.style.display = 'flex';
        buttonRowDiv.style.gap = '10px';
        buttonRowDiv.style.alignItems = 'center';

        // Кнопка фильтра МП
        const filterBtn = document.createElement('button');
        filterBtn.textContent = '🔍 Фильтр МП';
        filterBtn.className = 'btn btn-success';
        filterBtn.style.padding = '6px 12px';
        filterBtn.style.fontSize = '14px';
        filterBtn.style.flex = '1';

        filterBtn.onclick = (e) => {
            e.preventDefault();
            applyMPFilter();

            // Небольшая задержка перед кликом на "Применить"
            setTimeout(() => {
                if (applyButton) applyButton.click();
            }, 100);
        };

        // Кнопка подсчета МП
        const countBtn = document.createElement('button');
        countBtn.textContent = '📊 Подсчитать МП';
        countBtn.className = 'btn btn-primary';
        countBtn.style.padding = '6px 12px';
        countBtn.style.fontSize = '14px';
        countBtn.style.backgroundColor = '#007bff';
        countBtn.style.flex = '1';

        countBtn.onclick = (e) => {
            e.preventDefault();
            start();
        };

        // Добавляем кнопки в строку
        buttonRowDiv.appendChild(filterBtn);
        buttonRowDiv.appendChild(countBtn);

        // Добавляем строку в контейнер
        buttonContainer.appendChild(buttonRowDiv);

        // Добавляем небольшое описание
        const description = document.createElement('div');
        description.textContent = 'Для верного отображения данных настроить даты!';
        description.style.fontSize = '11px';
        description.style.color = '#6c757d';
        description.style.marginTop = '5px';
        description.style.textAlign = 'center';
        buttonContainer.appendChild(description);

        // Вставляем контейнер после строки с кнопками
        buttonRow.parentNode.insertBefore(buttonContainer, buttonRow.nextSibling);
    }

    // Проверка, является ли строка мероприятием
    function isMPEvent(desc) {
        return desc && desc.includes('Создал мероприятие');
    }

    function processCurrentPage() {
        const rows = document.querySelectorAll('tr.first-row');

        rows.forEach(firstRow => {
            const category = firstRow.querySelector('.td-category a')?.innerText.trim();
            if (category !== 'Админ-действия') return;

            const admin = firstRow.querySelector('.td-player-name a')?.innerText.trim();
            const time = firstRow.querySelector('.td-time')?.innerText.trim();

            const secondRow = firstRow.nextElementSibling;
            if (!secondRow || !secondRow.classList.contains('second-row')) return;

            const desc = secondRow.querySelector('.td-transaction-desc')?.innerText.trim();
            if (!isMPEvent(desc)) return;

            const logKey = `${time}|${admin}|${desc}`;

            if (processedLogs.has(logKey)) return;
            processedLogs.add(logKey);

            const date = extractDateFromTime(time);

            if (!statsByDay[date]) {
                statsByDay[date] = {};
            }

            statsByDay[date][admin] = (statsByDay[date][admin] || 0) + 1;
            overallStats[admin] = (overallStats[admin] || 0) + 1;
            totalMP += 1;
        });
    }

    function goNextPage() {
        const nextBtn = document.getElementById('next-page-btn');

        if (!nextBtn || nextBtn.style.display === 'none' || nextBtn.disabled) {
            showResult();
            isRunning = false;
            return;
        }

        nextBtn.click();

        waitForPageChange().then(() => {
            processCurrentPage();
            goNextPage();
        });
    }

    function waitForPageChange() {
        return new Promise(resolve => {
            const table = document.querySelector('table');
            const observer = new MutationObserver(() => {
                observer.disconnect();
                resolve();
            });
            observer.observe(table, { childList: true, subtree: true });
        });
    }

    function showResult() {
        document.getElementById(BOX_ID)?.remove();

        const box = document.createElement('div');
        box.id = BOX_ID;
        box.style.position = 'fixed';
        box.style.top = '20px';
        box.style.right = '20px';
        box.style.zIndex = '99999';
        box.style.background = '#111';
        box.style.color = '#0f0';
        box.style.padding = '15px';
        box.style.border = '2px solid #0f0';
        box.style.fontFamily = 'monospace';
        box.style.maxHeight = '80vh';
        box.style.overflowY = 'auto';
        box.style.minWidth = '350px';
        box.style.maxWidth = '450px';
        box.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.3)';

        let html = `<div style="margin-bottom: 15px;">
            <b style="font-size: 16px;">📊 Статистика МП</b><br>
            <small>Всего: <b style="color: #0ff;">${totalMP}</b></small>
        </div>`;

        const dates = Object.keys(statsByDay);

        if (dates.length === 0) {
            html += '<div style="color: #888; padding: 10px 0;"><i>МП не найдены</i></div>';
        } else {
            dates.sort((a, b) => {
                if (a === 'Неизвестная дата') return 1;
                if (b === 'Неизвестная дата') return -1;

                try {
                    const dateA = a.split('/').reverse().join('-');
                    const dateB = b.split('/').reverse().join('-');
                    return new Date(dateB) - new Date(dateA);
                } catch (e) {
                    return b.localeCompare(a);
                }
            });

            dates.forEach(date => {
                const dayStats = statsByDay[date];
                const dayTotal = Object.values(dayStats).reduce((sum, count) => sum + count, 0);

                html += `<div style="margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #333;">`;
                html += `<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <b>📅 ${date}</b>
                    <span style="color: #0ff; font-size: 0.9em;">${dayTotal}</span>
                </div>`;

                const sortedAdmins = Object.entries(dayStats).sort((a, b) => b[1] - a[1]);

                sortedAdmins.forEach(([admin, count]) => {
                    html += `<div style="margin-left: 10px; margin-bottom: 2px; font-size: 0.9em;">`;
                    html += `<span style="color: #aaa;">•</span> ${admin}: <b>${count}</b>`;
                    html += `</div>`;
                });

                html += `</div>`;
            });

            html += `<hr style="border: 1px solid #333; margin: 15px 0;">`;

            // ОБЩАЯ СТАТИСТИКА
            html += `<div style="margin-bottom: 10px;">
                <b>📈 Общая статистика</b>
            </div>`;

            const sortedOverallStats = Object.entries(overallStats).sort((a, b) => b[1] - a[1]);

            sortedOverallStats.forEach(([admin, count], index) => {
                const percentage = totalMP > 0 ? ((count / totalMP) * 100).toFixed(1) : 0;

                let medal = '';
                if (index === 0) medal = '🥇 ';
                else if (index === 1) medal = '🥈 ';
                else if (index === 2) medal = '🥉 ';

                html += `<div style="display: flex; justify-content: space-between; margin-bottom: 6px; padding: 3px 0;">
                    <div style="flex: 1;">
                        <span style="color: #aaa; display: inline-block; width: 20px;">${index + 1}.</span>
                        ${medal}<span style="color: #0ff;">${admin}</span>
                    </div>
                    <div>
                        <b>${count}</b> <small style="color: #888;">(${percentage}%)</small>
                    </div>
                </div>`;
            });

            // Сводка
            html += `<div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #333; font-size: 0.9em;">`;
            html += `<div style="display: flex; justify-content: space-between;">
                <span>Всего админов:</span>
                <b>${sortedOverallStats.length}</b>
            </div>`;

            if (sortedOverallStats.length > 0) {
                const topAdmin = sortedOverallStats[0][0];
                const topCount = sortedOverallStats[0][1];
                html += `<div style="display: flex; justify-content: space-between; margin-top: 3px;">
                    <span>Топ админ:</span>
                    <b>${topAdmin}</b> <small style="color: #888;">(${topCount} МП)</small>
                </div>`;
            }

            html += `</div>`;
        }

        html += `<div style="margin-top: 15px; display: flex; justify-content: space-between;">
            <button id="mp-copy" style="padding: 6px 12px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 13px;">📋 Копировать</button>
            <button id="mp-close" style="padding: 6px 12px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 13px;">✖ Закрыть</button>
        </div>`;

        box.innerHTML = html;
        document.body.appendChild(box);

        // Функция копирования
        document.getElementById('mp-copy').onclick = () => {
            let copyText = `Статистика созданных МП\n`;
            copyText += `Всего МП: ${totalMP}\n\n`;

            copyText += `По дням:\n`;
            dates.forEach(date => {
                const dayStats = statsByDay[date];
                const dayTotal = Object.values(dayStats).reduce((sum, count) => sum + count, 0);
                copyText += `${date} (Всего: ${dayTotal})\n`;

                Object.entries(dayStats)
                    .sort((a, b) => b[1] - a[1])
                    .forEach(([admin, count]) => {
                        copyText += `  ${admin}: ${count}\n`;
                    });
                copyText += '\n';
            });

            copyText += `Общая статистика:\n`;
            Object.entries(overallStats)
                .sort((a, b) => b[1] - a[1])
                .forEach(([admin, count], index) => {
                    copyText += `${index + 1}. ${admin}: ${count}\n`;
                });

            copyText += `\nВсего админов: ${Object.keys(overallStats).length}`;
            if (Object.keys(overallStats).length > 0) {
                const topAdmin = Object.entries(overallStats).sort((a, b) => b[1] - a[1])[0][0];
                const topCount = Object.entries(overallStats).sort((a, b) => b[1] - a[1])[0][1];
                copyText += `\nТоп админ по МП: ${topAdmin} (${topCount} МП)`;
            }

            navigator.clipboard.writeText(copyText).then(() => {
                const copyBtn = document.getElementById('mp-copy');
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✓ Скопировано!';
                copyBtn.style.background = '#20c997';

                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = '#28a745';
                }, 2000);
            });
        };

        document.getElementById('mp-close').onclick = () => box.remove();
    }

    function start() {
        if (isRunning) return;
        isRunning = true;

        totalMP = 0;
        processedLogs.clear();
        Object.keys(statsByDay).forEach(k => delete statsByDay[k]);
        Object.keys(overallStats).forEach(k => delete overallStats[k]);

        processCurrentPage();
        goNextPage();
    }

    // Инициализация
    function initialize() {
        // Ищем кнопку "Применить" и добавляем наши кнопки под ней
        const observer = new MutationObserver(() => {
            addButtonsUnderApplyButton();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Попытка сразу добавить кнопки
        setTimeout(() => {
            addButtonsUnderApplyButton();
        }, 1000);

        // Горячая клавиша для фильтра
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                applyMPFilter();

                // Автоклик на "Применить" через небольшой интервал
                setTimeout(() => {
                    const applyButton = document.querySelector('button.btn-primary[type="submit"]');
                    if (applyButton) applyButton.click();
                }, 100);
            }
        });

        console.log('МП чекер BLACKLOG запущен');
    }

    // Запускаем инициализацию
    setTimeout(initialize, 500);
})();