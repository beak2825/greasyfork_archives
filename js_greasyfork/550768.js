// ==UserScript==
// @name         ayy lmao utility
// @namespace    http://tampermonkey.net/
// @version      13.37
// @description  time adjust+esc bind
// @author       ayylmao1337
// @match        https://admin.4rabetsite.com/players/list*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550768/ayy%20lmao%20utility.user.js
// @updateURL https://update.greasyfork.org/scripts/550768/ayy%20lmao%20utility.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // date time parsing
    function adjustTime(dateString, minutesToAdd) {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('.').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        const date = new Date(year, month - 1, day, hours, minutes, seconds);
        date.setMinutes(date.getMinutes() + minutesToAdd);
        const adjustedDay = String(date.getDate()).padStart(2, '0');
        const adjustedMonth = String(date.getMonth() + 1).padStart(2, '0');
        const adjustedYear = date.getFullYear();
        const adjustedHours = String(date.getHours()).padStart(2, '0');
        const adjustedMinutes = String(date.getMinutes()).padStart(2, '0');
        const adjustedSeconds = String(date.getSeconds()).padStart(2, '0');
        return `${adjustedDay}.${adjustedMonth}.${adjustedYear} ${adjustedHours}:${adjustedMinutes}:${adjustedSeconds}`;
    }

    // find table by header
    function findTableByHeader(headerText, dateHeaderText) {
        const header = Array.from(document.querySelectorAll('h3, .d-flex.title')).find(el => el.textContent.includes(headerText));
        if (!header) {
            console.log(`Header "${headerText}" not found`);
            return null;
        }

        const table = header.closest('.v-card__title, .row')?.nextElementSibling?.querySelector('table') ||
                      header.parentElement?.nextElementSibling?.querySelector('table');
        if (!table) {
            console.log(`Table after header "${headerText}" not found`);
            return null;
        }

        const headers = table.querySelectorAll('thead th span');
        const hasDateHeader = Array.from(headers).some(header => header.textContent.trim() === dateHeaderText);
        if (!hasDateHeader) {
            console.log(`Table does not contain "${dateHeaderText}" header`);
            return null;
        }

        return table;
    }

    // clear existing time
    function clearAdjustedTimes(table) {
        if (!table) return;
        const adjustedTimes = table.querySelectorAll('span.adjusted-time');
        adjustedTimes.forEach(span => span.remove());
    }

    // single table processing by params
    function processTable(table, dateColumnIndices, minutesToAdd) {
        if (!table) return;

        clearAdjustedTimes(table);

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            dateColumnIndices.forEach(index => {
                const dateCell = row.querySelector(`td:nth-child(${index}) span`);
                if (dateCell && dateCell.textContent) {
                    if (!dateCell.querySelector('span.adjusted-time')) {
                        const originalTime = dateCell.textContent.trim();
                        const adjustedTime = adjustTime(originalTime, minutesToAdd);
                        const adjustedTimeSpan = document.createElement('span');
                        adjustedTimeSpan.className = 'adjusted-time';
                        adjustedTimeSpan.textContent = ` (${adjustedTime})`;
                        adjustedTimeSpan.style.color = 'green';
                        dateCell.appendChild(adjustedTimeSpan);
                    }
                }
            });
        });
    }

    // all tables processing
    function processTables() {
        const allTables = document.querySelectorAll('table');
        allTables.forEach(table => clearAdjustedTimes(table));

        const depositsTable = findTableByHeader('Депозиты', 'Дата');
        processTable(depositsTable, [5], 330);

        const withdrawalsTable = findTableByHeader('Выплаты', 'Дата создания выплаты');
        processTable(withdrawalsTable, [6, 7], 330);

        const userLogsTable = findTableByHeader('Логи пользователя', 'Дата');
        processTable(userLogsTable, [2, 3], 150);

        const depositAttemptsTable = findTableByHeader('Попытки Депозитов для игрока по', 'Дата создания');
        processTable(depositAttemptsTable, [4], 330);
    }

    // refresh button add(govnishe)
    function addRefreshButton() {
        const paginationContainers = document.querySelectorAll('.row .mt-2.px-0.py-0.text-center.col');
        paginationContainers.forEach(container => {
            if (!container.querySelector('.refresh-button')) {
                const refreshButton = document.createElement('button');
                refreshButton.type = 'button';
                refreshButton.className = 'ml-1 v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default';
                refreshButton.innerHTML = '<span class="v-btn__content">Обновить</span>';
                refreshButton.classList.add('refresh-button');

                refreshButton.addEventListener('click', () => {
                    const closestCard = container.closest('.v-card, .row');
                    const header = closestCard?.querySelector('h3, .d-flex.title');
                    if (header) {
                        const headerText = header.textContent.trim();
                        let table, columns, minutesToAdd;

                        if (headerText.includes('Депозиты')) {
                            table = findTableByHeader('Депозиты', 'Дата');
                            columns = [4];
                            minutesToAdd = 330;
                        } else if (headerText.includes('Выплаты')) {
                            table = findTableByHeader('Выплаты', 'Дата создания выплаты');
                            columns = [8, 9];
                            minutesToAdd = 330;
                        } else if (headerText.includes('Логи пользователя')) {
                            table = findTableByHeader('Логи пользователя', 'Дата');
                            columns = [2, 3];
                            minutesToAdd = 150;
                        } else if (headerText.includes('Попытки Депозитов для игрока по')) {
                            table = findTableByHeader('Попытки Депозитов для игрока по', 'Дата создания');
                            columns = [5];
                            minutesToAdd = 330;
                        }

                        if (table) {
                            clearAdjustedTimes(table);
                            processTable(table, columns, minutesToAdd);
                            console.log(`Обновлено время для таблицы "${headerText}"`);
                        }
                    }
                });

                const forwardButton = container.querySelector('.v-btn span:not(.refresh-button)');
                if (forwardButton) {
                    forwardButton.closest('button').insertAdjacentElement('afterend', refreshButton);
                } else {
                    container.appendChild(refreshButton);
                }
            }
        });

        // refresh button dep attempts
        const depositAttemptsFooter = document.querySelector('.v-data-table .v-data-footer');
        if (depositAttemptsFooter && !depositAttemptsFooter.querySelector('.refresh-button')) {
            const refreshButton = document.createElement('button');
            refreshButton.type = 'button';
            refreshButton.className = 'ml-1 v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default';
            refreshButton.innerHTML = '<span class="v-btn__content">Обновить</span>';
            refreshButton.classList.add('refresh-button');

            refreshButton.addEventListener('click', () => {
                const table = findTableByHeader('Попытки Депозитов для игрока по', 'Дата создания');
                if (table) {
                    clearAdjustedTimes(table);
                    processTable(table, [5], 330);
                    console.log('Обновлено время для таблицы "Попытки Депозитов для игрока по"');
                }
            });

            const nextButton = depositAttemptsFooter.querySelector('.v-btn[aria-label="Next page"]');
            if (nextButton) {
                nextButton.insertAdjacentElement('afterend', refreshButton);
            } else {
                depositAttemptsFooter.appendChild(refreshButton);
            }
        }
    }

    // OBSERVE
    function observeDOM() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        const callback = (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const relevantChange = Array.from(mutation.addedNodes).some(node =>
                        node.nodeType === Node.ELEMENT_NODE &&
                        (node.matches('table, .v-data-table, .v-card, .row') ||
                         node.querySelector('table, .v-data-table, .v-card, .row'))
                    ) || Array.from(mutation.removedNodes).some(node =>
                        node.nodeType === Node.ELEMENT_NODE &&
                        (node.matches('table, .v-data-table, .v-card, .row') ||
                         node.querySelector('table, .v-data-table, .v-card, .row'))
                    );

                    if (relevantChange) {
                        setTimeout(() => {
                            processTables();
                            addRefreshButton();
                        }, 1500);
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    // esc to .mdi-close bind
    function simulateCloseClick() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                const closeButton = document.querySelector('.mdi-close');
                if (closeButton) {
                    const clickEvent = new Event('click', { bubbles: true });
                    closeButton.dispatchEvent(clickEvent);
                    console.log('Clicking .mdi-close');
                } else {
                    console.log('Element .mdi-close not found');
                }
            }
        });
    }

    // init lmao
    function initialize() {
        setTimeout(() => {
            processTables();
            addRefreshButton();
        }, 1500);
        observeDOM();
        simulateCloseClick();
    }

    // init on page load
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initialize();
    } else {
        document.addEventListener('DOMContentLoaded', initialize);
        window.addEventListener('load', initialize);
    }

    // even listen for buttons clicks
    document.addEventListener('click', (event) => {
        const paginationButtons = document.querySelectorAll('.v-btn span, .v-btn[aria-label="Previous page"], .v-btn[aria-label="Next page"]');
        if (Array.from(paginationButtons).some(el =>
            (el.tagName === 'SPAN' && (el.textContent.includes('Назад') || el.textContent.includes('Вперед'))) ||
            (el.tagName === 'BUTTON' && (el.getAttribute('aria-label') === 'Previous page' || el.getAttribute('aria-label') === 'Next page'))
        ) && event.target.closest('button')) {
            setTimeout(() => {
                const allTables = document.querySelectorAll('table');
                allTables.forEach(table => clearAdjustedTimes(table));
                processTables();
                addRefreshButton();
            }, 1500);
        }
    });
})();