// ==UserScript==
// @name          AS Авто-плавка
// @namespace     https://animestars.org
// @version       1.4
// @description   Плавит карты, оставляя выбранное количество дублей (0–5). Ограничивает количество авто-плавок. Увеличенные, плоские контролы.
// @author        Sandr
// @match         https://astars.club/cards_remelt/*
// @match         https://asstars1.astars.club/cards_remelt/*
// @match         https://animestars.org/cards_remelt/*
// @match         https://as1.astars.club/cards_remelt/*
// @match         https://asstars.tv/cards_remelt/*
// @license MIT
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/550232/AS%20%D0%90%D0%B2%D1%82%D0%BE-%D0%BF%D0%BB%D0%B0%D0%B2%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/550232/AS%20%D0%90%D0%B2%D1%82%D0%BE-%D0%BF%D0%BB%D0%B0%D0%B2%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isRunning = false;
    let keepDuplicates = 1;
    let maxRemelts = 0; // 0 - безлимит
    let remeltsDone = 0;
    let selectedCount = 0;

    // Главный контейнер для размещения рядом с кнопкой
    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = `
        display: flex;
        align-items: center; /* Выравнивание по центру */
        gap: 10px;
    `;

    // Панель для контролов (справа от кнопки)
    const controlsWrapper = document.createElement('div');
    controlsWrapper.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        height: 40px;
        justify-content: center;
    `;

    function createFlatSwitcher(initialValue, labelText, min, max, step = 1, onChange, useInfinityForZero = false) {
        const switcherContainer = document.createElement('div');
        switcherContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
        `;

        const switcher = document.createElement('div');
        switcher.style.cssText = `
            display: flex;
            align-items: center;
            gap: 2px;
            background: #222;
            padding: 2px;
            border-radius: 4px;
            color: white;
            font-size: 14px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            height: 24px;
        `;

        const btnStyle = `
            background: #444;
            color: white;
            border: none;
            border-radius: 3px;
            width: 24px;
            height: 100%;
            cursor: pointer;
            transition: background 0.2s ease;
            font-size: 14px;
            padding: 0;
            line-height: 1;
        `;

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '<';
        minusBtn.style.cssText = btnStyle;
        minusBtn.addEventListener('mouseenter', () => minusBtn.style.background = '#555');
        minusBtn.addEventListener('mouseleave', () => minusBtn.style.background = '#444');

        const valueText = document.createElement('span');
        // Установка начального значения: '∞' только если useInfinityForZero = true
        valueText.textContent = (initialValue === 0 && useInfinityForZero) ? '∞' : initialValue;
        valueText.style.cssText = `min-width: 20px; text-align: center; font-weight: bold;`;

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '>';
        plusBtn.style.cssText = btnStyle;
        plusBtn.addEventListener('mouseenter', () => plusBtn.style.background = '#555');
        plusBtn.addEventListener('mouseleave', () => plusBtn.style.background = '#444');

        const label = document.createElement('span');
        label.textContent = labelText;
        label.style.cssText = `color: #3b82f6; font-size: 14px; line-height: 1;`;

        switcher.appendChild(minusBtn);
        switcher.appendChild(valueText);
        switcher.appendChild(plusBtn);
        switcherContainer.appendChild(switcher);
        switcherContainer.appendChild(label);

        minusBtn.addEventListener('click', () => {
            let currentValue = parseInt(valueText.textContent) || 0;

            if (useInfinityForZero && currentValue === 0) {
                 currentValue = min;
            }

            if (currentValue > min) {
                currentValue -= step;
                // Отображение: '∞' только если useInfinityForZero = true и значение = 0
                valueText.textContent = (currentValue === 0 && useInfinityForZero) ? '∞' : currentValue;
                onChange(currentValue);
            } else if (currentValue === min && min === 0 && useInfinityForZero) {
                 valueText.textContent = '∞';
                 onChange(0);
            }
        });

        plusBtn.addEventListener('click', () => {
            let currentValue = parseInt(valueText.textContent) || 0;

            if (currentValue < max) {
                currentValue += step;
                valueText.textContent = currentValue;
                onChange(currentValue);
            }
        });

        return {
            element: switcherContainer,
            valueText: valueText,
            updateValue: (val) => {
                valueText.textContent = (val === 0 && useInfinityForZero) ? '∞' : val;
            }
        };
    }

    // --- Создание элементов управления ---

    const controlButton = document.createElement('button');
    controlButton.classList.add('as-auto-remelt-legacy');
    controlButton.innerHTML = '⭐ Начать плавить';
    controlButton.style.cssText = `
        padding: 8px 14px;
        background: #6aa84f;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        height: 40px;
    `;

    // Свитчер для лимита плавок - используем '∞'
    const remeltLimitSwitcher = createFlatSwitcher(maxRemelts, 'Лимит плавок', 0, 1000, 10, (value) => {
        maxRemelts = value;
        showNotification(`Лимит плавок установлен: ${maxRemelts === 0 ? 'Безлимит' : maxRemelts}`);
    }, true); // <-- УСТАНОВЛЕНО: useInfinityForZero = true

    // Свитчер для дублей - используем '0'
    const duplicateSwitcher = createFlatSwitcher(keepDuplicates, 'Оставить дублей', 0, 5, 1, (value) => {
        keepDuplicates = value;
        showNotification(`Оставляем ${keepDuplicates} дубля(ей)`);
    }, false); // <-- УСТАНОВЛЕНО: useInfinityForZero = false (или можно опустить)

    // --- Сборка панели и Размещение ---

    controlsWrapper.appendChild(remeltLimitSwitcher.element);
    controlsWrapper.appendChild(duplicateSwitcher.element);

    mainContainer.appendChild(controlButton);
    mainContainer.appendChild(controlsWrapper);

    const targetElement = document.querySelector('.remelt__rank-list');
    const originalControlPanel = document.querySelector('.remelt__controls');

    if (originalControlPanel) {
        const filterControls = originalControlPanel.querySelector('div:first-child');

        if (filterControls) {
            filterControls.style.display = 'flex';
            filterControls.style.gap = '10px';
            filterControls.appendChild(mainContainer);
        }
    } else if (targetElement && targetElement.parentNode) {
        const parentDiv = targetElement.parentNode;
        parentDiv.style.display = 'flex';
        parentDiv.style.justifyContent = 'flex-end';
        parentDiv.appendChild(mainContainer);
    }

    // --- Обработчик кнопки "Начать плавить" ---

    controlButton.addEventListener('click', function () {
        isRunning = !isRunning;
        this.innerHTML = isRunning ? `⭐ Стоп (${remeltsDone}/${maxRemelts === 0 ? '∞' : maxRemelts})` : '⭐ Начать плавить';
        this.style.background = isRunning ? '#f44336' : '#6aa84f';
        if (isRunning) {
            remeltsDone = 0;
            selectedCount = 0;
            updateControlText();
            processNextBatch();
        } else {
            showNotification('Остановлено пользователем.');
        }
    });

    // Функция обновления текста на кнопке
    function updateControlText() {
        controlButton.innerHTML = isRunning ? `⭐ Стоп (${remeltsDone}/${maxRemelts === 0 ? '∞' : maxRemelts})` : '⭐ Начать плавить';
    }

    // --- Уведомления ---

    let notificationElement = null;
    function showNotification(message) {
        if (notificationElement) {
            notificationElement.textContent = '⭐ ' + message;
            clearTimeout(notificationElement.hideTimeout);
        } else {
            notificationElement = document.createElement('div');
            notificationElement.className = 'custom-card-notification';
            notificationElement.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(45deg, #f21db2, #db0b81);
                color: white;
                padding: 10px 24px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.2);
                z-index: 2147483647;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                max-width: 90%;
                transition: opacity 0.3s ease-in-out;
            `;
            notificationElement.textContent = '⭐ ' + message;
            document.body.appendChild(notificationElement);
        }

        notificationElement.style.opacity = '1';
        notificationElement.hideTimeout = setTimeout(() => {
            if (notificationElement) {
                notificationElement.style.opacity = '0';
                setTimeout(() => {
                    if (notificationElement) {
                        notificationElement.remove();
                        notificationElement = null;
                    }
                }, 300);
            }
        }, 1500);
    }

    function updateNotification(message) {
        if (notificationElement) {
            notificationElement.textContent = '⭐ ' + message;
            clearTimeout(notificationElement.hideTimeout);
            notificationElement.style.opacity = '1';
        } else {
            showNotification(message);
        }
    }

    function stopScript(message) {
        isRunning = false;
        controlButton.innerHTML = '⭐ Начать плавить';
        controlButton.style.background = '#6aa84f';
        if (message) showNotification(message);
    }

    // --- Загрузка всех карт ---

    function loadAllCards(callback) {
        const container = document.querySelector('.remelt__inventory-list');
        if (!container) {
            showNotification('Контейнер с картами не найден. Повторная попытка...');
            setTimeout(() => loadAllCards(callback), 800);
            return;
        }

        let lastHeight = -1;
        let lastCount = -1;
        let consecutiveSameCount = 0;
        const maxConsecutiveSameCount = 2;

        function checkAndScroll() {
            if (!isRunning) return;
            container.scrollTop = container.scrollHeight;

            setTimeout(() => {
                const currentHeight = container.scrollHeight;
                const currentCount = container.querySelectorAll('.remelt__inventory-item').length;

                if (currentHeight === lastHeight && currentCount === lastCount) {
                    consecutiveSameCount++;
                    if (consecutiveSameCount >= maxConsecutiveSameCount) {
                        updateNotification('Загрузка всех карт завершена.');
                        container.scrollTop = 0;
                        setTimeout(callback, 300);
                        return;
                    }
                } else {
                    consecutiveSameCount = 0;
                }

                lastHeight = currentHeight;
                lastCount = currentCount;
                checkAndScroll();

            }, 300);
        }

        checkAndScroll();
    }

    // --- Основной процесс ---

    async function processNextBatch() {
        if (!isRunning) return;

        if (maxRemelts > 0 && remeltsDone >= maxRemelts) {
            stopScript(`Лимит плавок (${maxRemelts}) достигнут. Останавливаю.`);
            return;
        }

        if (selectedCount === 3) {
            updateNotification(`3 карты выбраны. Запускаем плавку...`);
            startRemelt();
            return;
        }

        updateNotification('Загрузка карт...');
        await new Promise(resolve => loadAllCards(resolve));

        const container = document.querySelector('.remelt__inventory-list');
        const availableCards = Array.from(container.querySelectorAll('.remelt__inventory-item')).filter(card => {
            const isLocked = card.classList.contains('remelt__inventory-item--lock');
            const isSelected = card.classList.contains('remelt__inventory-item--selected');
            return card.offsetParent !== null && !isLocked && !isSelected;
        });

        const groups = {};
        availableCards.forEach(card => {
            const img = card.querySelector('img');
            if (!img) return;
            const key = img.getAttribute('src') || img.src;
            if (!groups[key]) groups[key] = [];
            groups[key].push(card);
        });

        let cardToMelt = null;
        for (const key in groups) {
            const cards = groups[key];
            if (cards.length > keepDuplicates) {
                cardToMelt = cards[0];
                break;
            }
        }

        if (cardToMelt && selectedCount < 3) {
            selectedCount++;
            updateNotification(`Выбираю карту. Выбрано: ${selectedCount}/3. Сделано плавок: ${remeltsDone}/${maxRemelts === 0 ? '∞' : maxRemelts}`);
            cardToMelt.click();
            setTimeout(processNextBatch, 100);
            return;
        }

        if (!cardToMelt && selectedCount < 3) {
            const prevBtn = document.querySelector('#prev_filter_page button');
            const pageInfoText = document.querySelector('#info_filter_page span')?.textContent?.trim();
            let currentPage = null;
            if (pageInfoText) {
                const parts = pageInfoText.split('/');
                currentPage = parseInt(parts[0], 10);
            }

            if (prevBtn && (currentPage === null || currentPage > 1)) {
                showNotification('На этой странице лишних карт нет. Переход на предыдущую...');
                prevBtn.click();
                setTimeout(processNextBatch, 1500);
            } else {
                stopScript('Лишних карт больше нет, всё обработано.');
            }
        }
    }

    // --- startRemelt через MutationObserver ---

    function startRemelt() {
        if (!isRunning) return;

        const remeltButton = document.querySelector('.remelt__start-btn');
        if (remeltButton) {
            showNotification('Нажимаю кнопку плавки...');
            remeltButton.click();

            const observer = new MutationObserver((mutations, obs) => {
                for (const mutation of mutations) {
                    if (
                        (mutation.target.matches('.remelt__row.remelt__result') && mutation.attributeName === 'data-rank') ||
                        (mutation.target.matches('.remelt__start-btn') && mutation.attributeName === 'disabled' && !mutation.target.disabled)
                    ) {
                        const closeButton = document.querySelector('.ui-dialog-titlebar-close');
                        if (closeButton) closeButton.click();

                        obs.disconnect();

                        remeltsDone++;
                        updateControlText();

                        selectedCount = 0;

                        if (maxRemelts > 0 && remeltsDone >= maxRemelts) {
                            stopScript(`Лимит плавок (${maxRemelts}) достигнут. Останавливаю.`);
                            return;
                        }

                        setTimeout(processNextBatch, 300);
                        return;
                    }
                }
            });

            observer.observe(document.body, {
                attributes: true,
                subtree: true
            });
        } else {
            setTimeout(processNextBatch, 500);
        }
    }

})();