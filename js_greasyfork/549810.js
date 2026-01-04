// ==UserScript==
// @name         Помощник блокировки оценок | a24admin
// @namespace    Violentmonkey Scripts
// @version      1.3
// @description  Автозаполнение и всплывающие подсказки для страницы gradesList, а также быстрая обработка оценок
// @author       Bekker
// @match        https://a24.biz/admin_new/gradesList*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/549810/%D0%9F%D0%BE%D0%BC%D0%BE%D1%89%D0%BD%D0%B8%D0%BA%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B8%20%D0%BE%D1%86%D0%B5%D0%BD%D0%BE%D0%BA%20%7C%20a24admin.user.js
// @updateURL https://update.greasyfork.org/scripts/549810/%D0%9F%D0%BE%D0%BC%D0%BE%D1%89%D0%BD%D0%B8%D0%BA%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B8%20%D0%BE%D1%86%D0%B5%D0%BD%D0%BE%D0%BA%20%7C%20a24admin.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Имя для хранения состояния чекбокса
    const AUTO_FILL_SETTING = 'autoFillEnabled';

    // Получаем состояние чекбокса из памяти (по умолчанию включено)
    let autoFillEnabled = GM_getValue(AUTO_FILL_SETTING, true);

    // Добавляем стили для прогресс бара
    GM_addStyle(`
        .block-progress-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10px 0;
        }
        .block-progress-bar {
            width: 200px;
            height: 20px;
            background-color: #f0f0f0;
            border-radius: 10px;
            overflow: hidden;
        }
        .block-progress-fill {
            height: 100%;
            background-color: #4CAF50;
            width: 0%;
            transition: width 0.3s ease;
        }
        .block-progress-text {
            font-size: 14px;
            min-width: 60px;
        }
        .auto-fill-checkbox {
            margin: 0px 0;
            padding: 0px;
            background-color: #f5f5f5;
            border-radius: 4px;
        }
        .auto-fill-checkbox label {
            display: flex;
            padding: 9px;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }
    `);

    // Ждём появления формы
    const waitForElements = (selector, callback, interval = 500, timeout = 10000) => {
        const startTime = Date.now();
        const intervalId = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(intervalId);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(intervalId);
                console.warn(`Элемент ${selector} не найден за отведённое время.`);
            }
        }, interval);
    };

    // Основная логика
    waitForElements('form#filtersForm', (form) => {
        console.log('Форма найдена, запускаем скрипт...');

        // === Добавляем чекбокс автоматического заполнения ===
        const firstSection = form.querySelector('section');
        if (firstSection) {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'auto-fill-checkbox';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'autoFillCheckbox';
            checkbox.checked = autoFillEnabled;

            const label = document.createElement('label');
            label.htmlFor = 'autoFillCheckbox';
            label.textContent = 'Автоматическое заполнение данных формы для блокировки отзывов';

            checkboxContainer.appendChild(label);
            label.prepend(checkbox);
            firstSection.parentNode.insertBefore(checkboxContainer, firstSection.nextSibling);

            // Обработчик изменения состояния чекбокса
            checkbox.addEventListener('change', () => {
                autoFillEnabled = checkbox.checked;
                GM_setValue(AUTO_FILL_SETTING, autoFillEnabled);
                console.log('Автозаполнение:', autoFillEnabled ? 'включено' : 'выключено');
            });
        }

        // === 1. performer_nick с подсказками ===
        const performerInput = form.querySelector('input[type="text"][name="performer_nick"]');
        if (performerInput) {
            // Создаём контейнер для подсказок
            const suggestionsBox = document.createElement('div');
            suggestionsBox.style.cssText = `
                position: absolute;
                background: white;
                border: 1px solid #ccc;
                z-index: 1000;
                display: none;
                width: 200px;
            `;
            document.body.appendChild(suggestionsBox);

            // Позиционирование подсказок
            const positionSuggestions = () => {
                const rect = performerInput.getBoundingClientRect();
                suggestionsBox.style.top = `${rect.bottom + window.scrollY}px`;
                suggestionsBox.style.left = `${rect.left + window.scrollX}px`;
            };

            // Данные подсказок
            const performers = [
                { name: "Маша", value: "MariaMorozovaA2" },
                { name: "Стёпа", value: "EvgeniylisakovA2" },
                { name: "Надя", value: "user6292415" }
            ];

            // Заполнение подсказок
            performers.forEach(item => {
                const div = document.createElement('div');
                div.textContent = item.name;
                div.style.cssText = `
                    padding: 5px;
                    cursor: pointer;
                `;
                div.addEventListener('click', () => {
                    performerInput.value = item.value;
                    suggestionsBox.style.display = 'none';
                });
                suggestionsBox.appendChild(div);
            });

            // Показ подсказок при фокусе
            performerInput.addEventListener('focus', () => {
                positionSuggestions();
                suggestionsBox.style.display = 'block';
            });

            // Скрытие при клике вне поля
            document.addEventListener('click', (e) => {
                if (!performerInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
                    suggestionsBox.style.display = 'none';
                }
            });
        }

        // === 2. Очистка остальных полей (только если автозаполнение включено) ===
        if (autoFillEnabled) {
            const fieldsToClear = [
                'customer_nick',
                'order_id',
                'text',
                'dateFrom',
                'dateTo'
            ];

            fieldsToClear.forEach(name => {
                const input = form.querySelector(`input[type="text"][name="${name}"]`);
                if (input) input.value = '';
            });

            // === 3. Установка даты в dateTo ===
            const dateToInput = form.querySelector('input[type="text"][name="dateTo"]');
            if (dateToInput) {
                const date = new Date();
                date.setDate(date.getDate() - 15);
                const formatted = [
                    String(date.getDate()).padStart(2, '0'),
                    String(date.getMonth() + 1).padStart(2, '0'),
                    date.getFullYear()
                ].join('-');
                dateToInput.value = formatted;
            }

            // === 4. Установка select value_rating ===
            const ratingSelect = form.querySelector('select[name="value_rating"][id="value_rating"]');
            if (ratingSelect) {
                ratingSelect.value = "1";
                const event = new Event('change', { bubbles: true });
                ratingSelect.dispatchEvent(event);
            }

            // === 5. Установка select status_rating ===
            const statusSelect = form.querySelector('select[name="status_rating"][id="status_rating"]');
            if (statusSelect) {
                statusSelect.value = "0";
                const event = new Event('change', { bubbles: true });
                statusSelect.dispatchEvent(event);
            }
        }

        // === 6. Добавляем кнопку блокировки отзывов ===
        waitForElements('div.widget.sortable', (paginateDiv) => {
            // Создаем контейнер для прогресса
            const progressContainer = document.createElement('div');
            progressContainer.className = 'block-progress-container';
            progressContainer.style.display = 'flex';
            progressContainer.style.padding = '5px';
            progressContainer.style.justifyContent = "center";

            // Создаем текст прогресса
            const progressText = document.createElement('div');
            progressText.className = 'block-progress-text';
            progressText.textContent = '0%';
            progressText.style.display = 'none';
            progressText.style.fontSize = '1.5em'; // Увеличиваем в 1.5 раза

            // Создаем кнопку
            const blockButton = document.createElement('button');
            blockButton.textContent = 'Заблокировать все отзывы на данной странице';
            blockButton.style.cssText = `
                margin: 0px 0;
                padding: 8px 16px;
                background-color: #ff4444;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;

            // Добавляем элементы в контейнер
            progressContainer.appendChild(blockButton);
            progressContainer.appendChild(progressText);

            // Вставляем контейнер в paginateDiv
            paginateDiv.appendChild(progressContainer);

            // Обработчик клика по кнопке
            blockButton.addEventListener('click', async () => {
                // Скрываем кнопку и показываем прогресс
                blockButton.style.display = 'none';
                progressText.style.display = 'block';

                await blockAllReviews(blockButton, progressText);

                // После завершения показываем кнопку снова
                blockButton.style.display = 'flex';
            });
        });

        console.log('Скрипт выполнен. Автозаполнение:', autoFillEnabled ? 'включено' : 'выключено');
    });

    // Функция блокировки всех отзывов
    async function blockAllReviews(button, progressText) {
        button.disabled = true;

        // Находим все ссылки на редактирование отзывов
        const editLinks = Array.from(document.querySelectorAll('a[href*="https://a24.biz/admin_new/gradeEdit/"]'));

        if (editLinks.length === 0) {
            alert('Отзывы не найдены');
            button.disabled = false;
            progressText.style.display = 'none';
            return;
        }

        let processed = 0;
        const total = editLinks.length;

        // Обрабатываем каждый отзыв
        for (const link of editLinks) {
            try {
                await processReview(link.href);
                processed++;

                // Обновляем прогресс
                const progress = Math.round((processed / total) * 100);
                progressText.textContent = `${progress}%`;

                // Небольшая задержка между запросами
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error('Ошибка при обработке отзыва:', error);
            }
        }

        // Завершаем
        progressText.textContent = 'Обработано ${processed} из ${total} отзывов. Готово!';
        setTimeout(() => {
            button.disabled = false;
            progressText.style.display = 'none';
            progressText.textContent = '0%';
        }, 2000);
    }

    // Функция обработки одного отзыва
    function processReview(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    try {
                        // Парсим HTML ответа
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        // Находим форму
                        const form = doc.querySelector('form#filtersForm');
                        if (!form) {
                            reject(new Error('Форма не найдена'));
                            return;
                        }

                        // Если автозаполнение включено, устанавливаем значения
                        if (autoFillEnabled) {
                            // Находим и заполняем поля формы
                            const fieldsToClear = [
                                'customer_nick',
                                'order_id',
                                'text',
                                'dateFrom'
                            ];

                            fieldsToClear.forEach(name => {
                                const input = form.querySelector(`input[type="text"][name="${name}"]`);
                                if (input) input.value = '';
                            });

                            // Устанавливаем dateTo на 15 дней назад
                            const dateToInput = form.querySelector('input[type="text"][name="dateTo"]');
                            if (dateToInput) {
                                const date = new Date();
                                date.setDate(date.getDate() - 15);
                                const formatted = [
                                    String(date.getDate()).padStart(2, '0'),
                                    String(date.getMonth() + 1).padStart(2, '0'),
                                    date.getFullYear()
                                ].join('-');
                                dateToInput.value = formatted;
                            }

                            // Устанавливаем value_rating = 1
                            const ratingSelect = form.querySelector('select[name="value_rating"][id="value_rating"]');
                            if (ratingSelect) {
                                ratingSelect.value = "1";
                            }

                            // Устанавливаем status_rating = 0
                            const statusSelect = form.querySelector('select[name="status_rating"][id="status_rating"]');
                            if (statusSelect) {
                                statusSelect.value = "0";
                            }
                        }

                        // Находим select блокировки и устанавливаем значение "1"
                        const blockSelect = form.querySelector('select[name="block"]');
                        if (!blockSelect) {
                            reject(new Error('Select блокировки не найден'));
                            return;
                        }

                        blockSelect.value = "1";

                        // Создаем FormData для отправки
                        const formData = new FormData(form);
                        const formAction = form.action || url;

                        // Отправляем форму
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: formAction,
                            data: new URLSearchParams(formData).toString(),
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            onload: function() {
                                resolve();
                            },
                            onerror: function(error) {
                                reject(error);
                            }
                        });
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }
})();