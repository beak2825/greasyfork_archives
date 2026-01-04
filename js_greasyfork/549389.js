// ==UserScript==
// @name         FunPay: Сумма выводов
// @namespace    FunPay: Сумма выводов
// @version      1.0
// @description  Показывает суммы выводов по годам и итоговой суммой
// @author       Maesta_Nequitia
// @match        *://funpay.com/account/balance*
// @grant        GM_addStyle
// @icon         https://funpay.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549389/FunPay%3A%20%D0%A1%D1%83%D0%BC%D0%BC%D0%B0%20%D0%B2%D1%8B%D0%B2%D0%BE%D0%B4%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/549389/FunPay%3A%20%D0%A1%D1%83%D0%BC%D0%BC%D0%B0%20%D0%B2%D1%8B%D0%B2%D0%BE%D0%B4%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 1. Переключение на "Выводы" =====
    (function() {
        const withdrawLink = document.querySelector('ul.dropdown-menu a[data-value="withdraw"]');
        const filterText = document.querySelector('.filter-text');
        if (withdrawLink && filterText) {
            withdrawLink.click();
            filterText.textContent = 'Выводы';
        }
    })();

    // ===== 2. Кнопка "Показать больше операций" =====
    (function() {
        function clickShowMoreButton() {
            const button = document.querySelector('.dyn-table-continue:not(.hidden)');
            if (button) {
                button.click();
                console.log('Нажата кнопка "Показать больше операций"');
            } else {
                console.log('Кнопка "Показать больше операций" скрыта или не найдена');
                clearInterval(autoClickInterval);
            }
        }
        const autoClickInterval = setInterval(clickShowMoreButton, 1000);
    })();

    // ===== 3. Удаление отменённых транзакций =====
    (function() {
        function removeCancelledTransactions(parent = document) {
            const transactions = parent.querySelectorAll('.tc-item');
            transactions.forEach(tx => {
                const status = tx.querySelector('.tc-status.transaction-status');
                const title = tx.querySelector('.tc-title');
                if ((status && status.textContent.includes('Отмен')) ||
                    (title && title.textContent.includes('Отмена'))) {
                    tx.remove();
                }
            });
        }
        removeCancelledTransactions();
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.classList.contains('tc-item')) {
                            const status = node.querySelector('.tc-status.transaction-status');
                            const title = node.querySelector('.tc-title');
                            if ((status && status.textContent.includes('Отмен')) ||
                                (title && title.textContent.includes('Отмена'))) {
                                node.remove();
                            }
                        } else {
                            removeCancelledTransactions(node);
                        }
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    })();

    // ===== 4. Добавление года к дате =====
    (function() {
        const currentYear = new Date().getFullYear();
        const months = [
            'января','февраля','марта','апреля','мая','июня',
            'июля','августа','сентября','октября','ноября','декабря'
        ];

        function addYear() {
            const dateSpans = document.querySelectorAll('.tc-date-time');
            dateSpans.forEach(span => {
                let text = span.textContent.trim();
                if (!/\b\d{4}\b/.test(text)) {
                    const match = text.match(/(\d{1,2})\s([а-яё]+),?\s*(\d{1,2}:\d{2})/i);
                    if (match) {
                        const day = match[1];
                        const month = match[2].toLowerCase();
                        const time = match[3];
                        if (months.includes(month)) {
                            span.textContent = `${day} ${month} ${currentYear}, ${time}`;
                        }
                    }
                }
            });
        }

        addYear();
        const observer = new MutationObserver(addYear);
        observer.observe(document.body, { childList: true, subtree: true });
    })();

    // ===== 5. Сумма выводов =====
    (function() {
        function updateWithdrawals() {
            const transactions = document.querySelectorAll('.tc-item');
            const totalsByYear = {};
            let totalSum = 0;

            transactions.forEach(tx => {
                const title = tx.querySelector('.tc-title')?.textContent.trim();
                if (!title || !title.includes('Вывод денег')) return;

                const dateText = tx.querySelector('.tc-date-time')?.textContent.trim();
                const amountText = tx.querySelector('.tc-price')?.textContent.trim();
                if (!dateText || !amountText) return;

                const amount = parseFloat(amountText.replace(/[^\d.-]/g, ''));
                const yearMatch = dateText.match(/(\d{4})/);
                const year = yearMatch ? yearMatch[1] : new Date().getFullYear();

                if (!totalsByYear[year]) totalsByYear[year] = 0;
                totalsByYear[year] += amount;
                totalSum += amount;
            });

            const sortedYears = Object.keys(totalsByYear).sort((a,b)=>a-b);
            const yearStrings = sortedYears.map(year =>
                `${year} (<span style="color:#f5a623">${totalsByYear[year].toLocaleString('ru-RU')} ₽</span>)`
            );

            const summaryText = yearStrings.join(', ') +
                (yearStrings.length
                    ? `. Сумма выводов: <span style="color:#7ed320">${totalSum.toLocaleString('ru-RU')} ₽</span>`
                    : ''
                );

            let withdrawalDiv = document.querySelector('.withdrawal-sums');
            if (!withdrawalDiv) {
                withdrawalDiv = document.createElement('div');
                withdrawalDiv.className = 'withdrawal-sums';
                withdrawalDiv.style.marginTop = '10px';
                withdrawalDiv.style.fontSize = '14px';
                withdrawalDiv.style.color = 'rgb(51, 51, 51)';

                const balancesHeader = document.querySelector('.page-header.balances-header');
                if (balancesHeader) {
                    balancesHeader.appendChild(withdrawalDiv);
                }
            }
            withdrawalDiv.innerHTML = summaryText;
        }

        const tableBody = document.querySelector('.dyn-table-body');
        if (tableBody) {
            const observer = new MutationObserver(updateWithdrawals);
            observer.observe(tableBody, { childList: true, subtree: true });
        }

        updateWithdrawals();
    })();

})();
