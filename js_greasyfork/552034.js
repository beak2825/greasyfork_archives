// ==UserScript==
// @name         WS EdgeA24 Rework | БитриксА24
// @namespace    http://tampermonkey.net/
// @version      2
// @description  При нажатии заголовка номера заказа копирует номер заказа
// @match        https://bx.cloudguru.us/crm/deal/details/*
// @match        https://bx.cloudguru.us/crm/kanban/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552034/WS%20EdgeA24%20Rework%20%7C%20%D0%91%D0%B8%D1%82%D1%80%D0%B8%D0%BA%D1%81%D0%9024.user.js
// @updateURL https://update.greasyfork.org/scripts/552034/WS%20EdgeA24%20Rework%20%7C%20%D0%91%D0%B8%D1%82%D1%80%D0%B8%D0%BA%D1%81%D0%9024.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var GPTSelected = false;

    const usersList = [
        { id: 5766, name: 'Марина Михайлова', icon: 'https://bx.cloudguru.us/upload/resize_cache/main/4f1/0q63t852doj39r60frt4zd4bdz1c4m8l/200_200_2/Y1loiozw3pk.png' },
        { id: 5763, name: 'Лидия Шекварданян', icon: 'https://bx.cloudguru.us/upload/resize_cache/main/a7c/k24g31gy01k6998sckowsfzg44qe7wde/200_200_2/photo_2023-09-25_20-29-10.png' },
        { id: 113, name: 'Кристина Верещак', icon: 'https://bx.cloudguru.us/upload/resize_cache/main/44c/l246yz3zv1rlzcrsgfdpkxk4zn61hk4g/200_200_2/pX-sFIZV0sM.png' },
        { id: 9470, name: 'Богдан Тирик', icon: 'https://bx.cloudguru.us/upload/resize_cache/main/165/gu8wifq37um89n0rihqqank6gqddb8d0/200_200_2/2024-12-30%2011.14.54.jpg.png' },
        { id: 17637, name: 'Анастасия Кривошеева', icon: 'https://bx.cloudguru.us/upload/resize_cache/main/313/0j62nppo3g7nfbicb6xpz567tzpw1qcm/200_200_2/QfGTaSy1Bjk.jpg.png' },
        { id: 7706, name: 'Алексей Усольцев', icon: 'https://bx.cloudguru.us/upload/resize_cache/main/b49/6kjlhgtzeh0wu2gz4ho9bqgjh60zz1fc/200_200_2/%D1%84%D0%BC%D1%84.jpg.png' },
        { id: 7589, name: 'Альберт Будтуев', icon: 'https://bx.cloudguru.us/upload/resize_cache/main/a38/axxtvm247rrzbp844bpevqlry779fkhu/200_200_2/%D1%84%D0%BE%D1%82%D0%BE1.jpg.png' },
        { id: 6433, name: 'Анастасия Игнатенко', icon: 'https://bx.cloudguru.us/upload/resize_cache/main/e49/k05mpu5ydjuw381qayo4fsi5frgaj6k5/200_200_2/8CscQfZRwN0.png' },
        { id: 6416, name: 'Андрей Кузьмин', icon: 'https://bx.cloudguru.us/upload/resize_cache/main/27b/lkvo9x3srvhqhq7ii7e0rdo16nbux7mu/200_200_2/photo_2024-08-26_19-14-33.png' },
        { id: 5765, name: 'Давид Геворкян', icon: 'https://bx.cloudguru.us/upload/resize_cache/main/53e/o5fcv6t319djwi5r8514k0vvgk1hnjbj/200_200_2/IMG_0775.png' },
        { id: 5762, name: 'Семён Беккер', icon: 'https://bx.cloudguru.us/upload/resize_cache/main/3b9/jnuvu4l62h1fprc8t840i053pv26o96l/200_200_2/%D0%A1%D0%B5%D0%BC%D1%91%D0%BD%20%D0%91%D0%B5%D0%BA%D0%BA%D0%B5%D1%80.png' },
        { id: 1940, name: 'Дарина Михайленко', icon: 'https://bx.cloudguru.us/upload/resize_cache/main/fa7/co1omhuumaf0af700epdfuq8wgdmjv77/200_200_2/photo_2024-03-20_14-05-11.png' },
        { id: 32751, name: 'Борис Савенко', icon: '' },
        { id: 112, name: 'Фёдор Батинов', icon: 'https://bx.cloudguru.us/upload/resize_cache/main/a04/0brirn50bgrfffid5vldp7r8q7d6aa9h/200_200_2/20221117_153702.png' }
    ];

    // Маппинг имен
    const nameMapping = [
        { shortName: 'Алексей', fullName: 'Алексей Усольцев', id: '7706' },
        { shortName: 'Давид', fullName: 'Давид Геворкян', id: '5765' },
        { shortName: 'Альберт', fullName: 'Альберт Будтуев', id: '7589' },
        { shortName: 'Анастасия', fullName: 'Анастасия Игнатенко', id: '6433' },
        { shortName: 'Богдан', fullName: 'Богдан Тирик', id: '9470' },
        { shortName: 'Андрей', fullName: 'Андрей Кузьмин', id: '6416' },
        { shortName: 'Борис', fullName: 'Борис Савенко', id: '32751' },
    ];

    // Функция для нормализации строки
    function normalizeString(str) {
        return str ? str.trim().replace(/\s+/g, ' ').toLowerCase() : '';
    }

    // Функция для получения имени из поля
    function getTargetName() {
        let fieldDiv = document.querySelector('div[data-cid="UF_CRM_1712653581"]');
        if (fieldDiv) {
            const nameSpan = fieldDiv.querySelector('span.fields.string.field-item');
            return nameSpan ? normalizeString(nameSpan.textContent) : null;
        } else {
            fieldDiv = document.querySelector('div[data-cid="UF_CRM_1712653604"]');
            if (fieldDiv) {
                const nameSpan = fieldDiv.querySelector('span.fields.string.field-item');
                return nameSpan ? normalizeString(nameSpan.textContent) : null;
            }
        }
        return null;
    }

    // Функция для создания кнопок (оригинальная логика остается без изменений)
    function createButtons({ data3, data1, data2, firstLetter, isGpt }) {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            gap: 10px;
            margin-top: 10px;
        `;
        buttonsContainer.classList.add("wsbutton");
        console.log('Проверка E24 ', data3, " ", data1);
        if (!isGpt) {
            if ((data1 && data3 == '') || (data1 == '' && data3)) {
                const button1 = document.createElement('button');
                button1.textContent = isGpt ? 'Заказ делает ГПТ' : 'Открыть на Шмеле';
                button1.style.cssText = `
                    flex: 1;
                    width: calc(100% - 4px);
                    margin: 10px 10px;
                    padding: 8px;
                    background: ${isGpt ? 'rgba(255, 102, 153, 0.8)' : 'rgba(108, 79, 119, 0.8)'};
                    border: 2px solid ${isGpt ? 'rgba(207, 75, 110, 0.8)' : 'rgba(77, 55, 85, 0.8)'};
                    color: #f0f0f0;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                `;
                button1.addEventListener('click', () => {
                    if (isGpt) {
                        alert('Заказ делает ГПТ, напишите оператору в личку');
                    } else if (data3) {
                        window.sendSeleniumCommand(`Shmel open ${data3}`);
                    } else if (data1) {
                        window.sendSeleniumCommand(`Shmel open ${data1}`);
                    }
                });
                buttonsContainer.appendChild(button1);
            } else {
                const button1 = document.createElement('button');
                button1.textContent = isGpt ? 'Заказ делает ГПТ' : 'Открыть Аукцион';
                button1.style.cssText = `
                    flex: 1;
                    width: calc(100% - 4px);
                    margin: 10px 10px;
                    padding: 8px;
                    background: ${isGpt ? 'rgba(255, 102, 153, 0.8)' : 'rgba(108, 79, 119, 0.8)'};
                    border: 2px solid ${isGpt ? 'rgba(207, 75, 110, 0.8)' : 'rgba(77, 55, 85, 0.8)'};
                    color: #f0f0f0;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                `;
                button1.addEventListener('click', () => {
                    if (isGpt) {
                        alert('Заказ делает ГПТ, напишите оператору в личку');
                    } else if (data3) {
                        window.sendSeleniumCommand(`Shmel open ${data3}`);
                    }
                });
                buttonsContainer.appendChild(button1);

                const button3 = document.createElement('button');
                button3.textContent = isGpt ? 'Заказ делает ГПТ' : 'Открыть Экспресс';
                button3.style.cssText = `
                    flex: 1;
                    width: calc(100% - 4px);
                    margin: 10px 10px;
                    padding: 8px;
                    background: ${isGpt ? 'rgba(255, 102, 153, 0.8)' : 'rgba(108, 79, 119, 0.8)'};
                    border: 2px solid ${isGpt ? 'rgba(207, 75, 110, 0.8)' : 'rgba(77, 55, 85, 0.8)'};
                    color: #f0f0f0;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                `;
                button3.addEventListener('click', () => {
                    if (isGpt) {
                        alert('Заказ делает ГПТ, напишите оператору в личку');
                    } else if (data1) {
                        window.sendSeleniumCommand(`Shmel open ${data1}`);
                    }
                });
                buttonsContainer.appendChild(button3);
            }
        } else if (isGpt && ((data1 && data3 == '') || (data1 == '' && data3))) {
            const gptButton = document.createElement('button');
            gptButton.textContent = 'Заказ связан с ГПТ';
            gptButton.style.cssText = `
                flex: 1;
                width: calc(100% - 4px);
                margin: 10px 10px;
                padding: 8px;
                background: rgba(255, 102, 153, 0.8);
                border: 2px solid rgba(207, 75, 110, 0.8);
                color: #f0f0f0;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
            `;
            gptButton.addEventListener('click', () => {
                alert('Заказ связан с ГПТ, напишите оператору в личку');
            });
            buttonsContainer.appendChild(gptButton);
            if (data3 || data1) {
                const orderButton = document.createElement('button');
                orderButton.textContent = data3 ? 'Открыть Аукцион' : 'Открыть Экспресс';
                orderButton.style.cssText = `
                    flex: 1;
                    width: calc(100% - 4px);
                    margin: 10px 10px;
                    padding: 8px;
                    background: rgba(108, 79, 119, 0.8);
                    border: 2px solid rgba(77, 55, 85, 0.8);
                    color: #f0f0f0;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                `;
                orderButton.addEventListener('click', () => {
                    if (data3) {
                        window.sendSeleniumCommand(`Shmel open ${data3}`);
                    } else if (data1) {
                        window.sendSeleniumCommand(`Shmel open ${data1}`);
                    }
                });
                buttonsContainer.appendChild(orderButton);
            }
        }

        if (data2) {
            const button2 = document.createElement('button');
            const buttonConfigs = {
                'Н': { text: 'Открыть на Стёпе', bg: 'rgba(51, 102, 255, 0.8)', border: 'rgba(39, 77, 204, 0.8)' },
                'З': { text: 'Открыть на Маше', bg: 'rgba(255, 102, 102, 0.8)', border: 'rgba(204, 77, 77, 0.8)' },
                'Ж': { text: 'Открыть на Наде', bg: 'rgba(30, 255, 30, 0.8)', border: 'rgba(0, 150, 0, 0.8)' }
            };
            const config = buttonConfigs[firstLetter] || { text: 'Открыть (другое)', bg: 'rgba(108, 79, 119, 0.8)', border: 'rgba(77, 55, 85, 0.8)' };
            button2.textContent = config.text;
            button2.style.cssText = `
                flex: 1;
                width: calc(100% - 8px);
                margin: 10px 10px;
                padding: 8px;
                background: ${config.bg};
                border: 2px solid ${config.border};
                color: #f0f0f0;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
            `;
            const sendConfigs = {
                'Н': { text: 'Stepa' },
                'З': { text: 'Masha' },
                'Ж': { text: 'Nadya' }
            };
            button2.addEventListener('click', () => {
                console.log(sendConfigs[firstLetter].text);
                console.log(data2);
                window.sendSeleniumCommand(`${sendConfigs[firstLetter].text} open ${data2}`);
            });
            buttonsContainer.appendChild(button2);
        }

        return buttonsContainer;
    }

    // Основная функция для добавления контейнеров
    function addButtonsToContainer() {
        const container = document.querySelector('.crm-entity-stream-container-list');
        if (!container) {
            console.error('Контейнер .crm-entity-stream-container-list не найден');
            return;
        }

        // Проверяем и создаём контейнер с кнопками (без изменений)
        let buttonsDiv = container.querySelector('.custom-buttons-div');
        if (!buttonsDiv) {
            buttonsDiv = document.createElement('div');
            buttonsDiv.classList.add('custom-buttons-div');
            buttonsDiv.style.cssText = `
                --ui-font-family-helvetica: "Helvetica Neue",Helvetica,Arial,sans-serif;
                --ui-font-family-system-mono: ui-monospace,SFMono-Regular,"SF Mono",Consolas,"Liberation Mono",Menlo,monospace;
                --ui-font-family-system: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';
                color: #333;
                font-size: 14px;
                -webkit-font-smoothing: antialiased;
                position: relative;
                z-index: 500;
                box-sizing: border-box;
                width: 100%;
                border-radius: var(--crm-entity-stream-section-border-radius,var(--ui-border-radius-md,2px));
                background-color: #fff;
                box-shadow: 0 1px 1px 0 rgba(0,0,0,.04);
                font-family: var(--ui-font-family-primary,var(--ui-font-family-helvetica));
                transition: all 300ms ease,1000ms background-color linear;
                overflow: hidden;
                margin-bottom: 5px;
                margin-top: 5px;
            `;
            container.insertBefore(buttonsDiv, container.firstElementChild);
        }

        // Проверяем и создаём новый контейнер для создания задачи
        let taskCreationDiv = container.querySelector('.task-creation-div');
        if (!taskCreationDiv) {
            taskCreationDiv = document.createElement('div');
            taskCreationDiv.classList.add('task-creation-div');
            taskCreationDiv.style.cssText = `
                --ui-font-family-helvetica: "Helvetica Neue",Helvetica,Arial,sans-serif;
                --ui-font-family-system-mono: ui-monospace,SFMono-Regular,"SF Mono",Consolas,"Liberation Mono",Menlo,monospace;
                --ui-font-family-system: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';
                color: #333;
                font-size: 14px;
                -webkit-font-smoothing: antialiased;
                position: relative;
                z-index: 500;
                box-sizing: border-box;
                width: 100%;
                border-radius: var(--crm-entity-stream-section-border-radius,var(--ui-border-radius-md,2px));
                background-color: #fff;
                box-shadow: 0 1px 1px 0 rgba(0,0,0,.04);
                font-family: var(--ui-font-family-primary,var(--ui-font-family-helvetica));
                transition: all 300ms ease,1000ms background-color linear;
                overflow: hidden;
                margin-bottom: 5px;
                margin-top: 5px;
                padding: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
            `;

            // Создаём дропдаун
            const dropdown = document.createElement('select');
            nameMapping.forEach(person => {
                const option = document.createElement('option');
                option.value = person.id;
                option.textContent = person.shortName;
                dropdown.appendChild(option);
            });
            dropdown.style.cssText = `
                padding: 5px 10px;
                max-width: 30px;
                border: 1px solid #ccc;
                border-radius: 4px;
                background-color: #f9f9f9;
                font-size: 14px;
            `;

            // Создаём аватар
            const avatarImg = document.createElement('img');
            avatarImg.classList.add('avatar-img');
            avatarImg.style.cssText = `
                width: 30px;
                height: 30px;
                border-radius: 50%;
            `;
            // Устанавливаем начальный аватар на основе первого выбранного значения
            const initialId = dropdown.value; // Первая опция по умолчанию
            const initialUser = usersList.find(user => user.id.toString() === initialId);
            if (initialUser) {
                avatarImg.src = initialUser.icon;
            }

            // Создаём выбор даты и времени
            const datePicker = document.createElement('input');
            datePicker.type = 'datetime-local';
            const today = new Date();
            const threeDaysAhead = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
            datePicker.value = threeDaysAhead.toISOString().slice(0, 16);
            datePicker.style.cssText = `
                padding: 5px 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                background-color: #f9f9f9;
                font-size: 14px;
            `;

            // Создаём чекбокс для срочности
            const urgentCheckbox = document.createElement('input');
            urgentCheckbox.type = 'checkbox';
            urgentCheckbox.id = 'urgent-checkbox';
            urgentCheckbox.style.cssText = `
                width: 18px;
                height: 18px;
                margin: 0;
                cursor: pointer;
                accent-color: #ff6b6b;
                transform: scale(1.1);
            `;

            // Создаём лейбл для чекбокса
            const urgentLabel = document.createElement('label');
            urgentLabel.htmlFor = 'urgent-checkbox';
            urgentLabel.textContent = 'Срочно';
            urgentLabel.style.cssText = `
                font-size: 14px;
                color: #ff6b6b;
                cursor: pointer;
                display: flex;
                align-items: center;
                font-weight: 600;
                text-shadow: 0 1px 2px rgba(255, 107, 107, 0.3);
                transition: all 0.2s ease;
            `;

            // Создаём контейнер для чекбокса и лейбла
            const urgentContainer = document.createElement('div');
            urgentContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 107, 107, 0.05));
                border: 1px solid rgba(255, 107, 107, 0.2);
                border-radius: 8px;
                transition: all 0.3s ease;
                backdrop-filter: blur(5px);
            `;
            urgentContainer.appendChild(urgentCheckbox);
            urgentContainer.appendChild(urgentLabel);

            // Добавляем эффекты при наведении
            urgentContainer.addEventListener('mouseenter', () => {
                urgentContainer.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.15), rgba(255, 107, 107, 0.08))';
                urgentContainer.style.borderColor = 'rgba(255, 107, 107, 0.3)';
                urgentLabel.style.color = '#ff5252';
            });

            urgentContainer.addEventListener('mouseleave', () => {
                urgentContainer.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 107, 107, 0.05))';
                urgentContainer.style.borderColor = 'rgba(255, 107, 107, 0.2)';
                urgentLabel.style.color = '#ff6b6b';
            });

            // Добавляем эффект при изменении состояния чекбокса
            urgentCheckbox.addEventListener('change', () => {
                if (urgentCheckbox.checked) {
                    urgentContainer.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(255, 107, 107, 0.1))';
                    urgentContainer.style.borderColor = 'rgba(255, 107, 107, 0.4)';
                    urgentLabel.style.color = '#ff5252';
                    urgentLabel.style.fontWeight = '700';
                } else {
                    urgentContainer.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 107, 107, 0.05))';
                    urgentContainer.style.borderColor = 'rgba(255, 107, 107, 0.2)';
                    urgentLabel.style.color = '#ff6b6b';
                    urgentLabel.style.fontWeight = '600';
                }
            });

            // Создаём кнопку "Создать"
            const createButton = document.createElement('button');
            createButton.textContent = 'Создать';
            createButton.style.cssText = `
                padding: 5px 0px;
                max-width: 150px;
                background: rgba(108, 79, 119, 0.8);
                border: 2px solid rgba(77, 55, 85, 0.8);
                color: #f0f0f0;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                margin-left: auto;
            `;
            createButton.addEventListener('click', () => {
                const pathParts = window.location.pathname.split('/');
                const dealId = pathParts[pathParts.length - 2];
                const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
                const isUrgent = urgentCheckbox.checked;
                const title = isUrgent ? `Корректировка_${dealId}_${randomDigits} [Срочно!]` : `Корректировка_${dealId}_${randomDigits}`;
                const description = '';
                const ufCrmTask = ['D_' + dealId];
                const responsibleId = dropdown.value;
                const auditors = [5762, 1940, 113, 17637];
                const todayISO = new Date().toISOString();
                const deadlineDate = new Date(datePicker.value + ':00');
                const deadlineISO = deadlineDate.toISOString();

                BX.rest.callMethod('tasks.task.add', {
                    fields: {
                        TITLE: title,
                        DESCRIPTION: description,
                        UF_CRM_TASK: ufCrmTask,
                        RESPONSIBLE_ID: responsibleId,
                        AUDITORS: auditors,
                        DATE_START: todayISO,
                        DEADLINE: deadlineISO
                    }
                }).then(function(result) {
                    console.log(result);
                }).catch(function(error) {
                    console.error(error);
                });
            });

            // Добавляем элементы в контейнер
            taskCreationDiv.appendChild(dropdown);
            taskCreationDiv.appendChild(avatarImg);
            taskCreationDiv.appendChild(datePicker);
            taskCreationDiv.appendChild(urgentContainer);
            taskCreationDiv.appendChild(createButton);

            // Обновляем аватар при изменении выбора в дропдауне
            dropdown.addEventListener('change', () => {
                const selectedId = dropdown.value;
                const selectedUser = usersList.find(user => user.id.toString() === selectedId);
                if (selectedUser) {
                    avatarImg.src = selectedUser.icon;
                }
            });

            // Вставляем после buttonsDiv
            container.insertBefore(taskCreationDiv, buttonsDiv.nextSibling);
        }

        // Логика интервала для кнопок и автозаполнения дропдауна
        let isGpt, gptCheck, letterContainer, numberElement;
        let interval;
        let found = false;

        console.log('Начинаю поиск элементов каждую секунду...');
        interval = setInterval(() => {
            letterContainer = document.querySelector('div[data-cid="UF_CRM_1712651039"] .ui-entity-editor-content-block .field-wrap .field-item');
            numberElement = document.querySelector('div[data-cid="UF_CRM_1712649592"] .ui-entity-editor-content-block .fields.string.field-wrap .fields.string.field-item');
            gptCheck = document.querySelector('div[data-cid="UF_CRM_1712650245"] .ui-entity-editor-content-block');
            if (!document.querySelector('.wsbutton')) {
                if (letterContainer && gptCheck && numberElement && !found) {
                    console.log('Все элементы найдены!');
                    found = true;
                    clearInterval(interval);
                    isGpt = gptCheck && gptCheck.innerText === 'ГПТ';
                    let firstLetter = letterContainer.textContent.trim().charAt(0).replace(/\s+/g, '');
                    const number = numberElement.textContent.replace(/\D/g, '');

                    let data, data2, displayLetter, data3, data1;
                    const numberElement1 = document.querySelector('div[data-cid="UF_CRM_1712653604"] .ui-entity-editor-content-block .fields.string.field-wrap .fields.string.field-item');
                    const numberElement2 = document.querySelector('div[data-cid="UF_CRM_1712653581"] .ui-entity-editor-content-block .fields.string.field-wrap .fields.string.field-item');
                    const numberSPECIAL = numberElement1 ? numberElement1.textContent.replace(/\D/g, '') : numberElement2 ? numberElement2.textContent.replace(/\D/g, '') : '';
                    data = numberSPECIAL ? `${numberSPECIAL}` : `${firstLetter} ${number}`.trim();
                    data1 = numberElement1 ? numberElement1.textContent.replace(/\D/g, '') : '';
                    data3 = numberElement2 ? numberElement2.textContent.replace(/\D/g, '') : '';
                    displayLetter = firstLetter === 'Н' ? 'Ж' : firstLetter === 'М' ? 'З' : firstLetter === 'С' ? 'Н' : firstLetter;
                    data2 = `${number}`.trim();
                    if (!isGpt) {
                        const hasRussianText = (text) => /[А-Яа-яЁё]/.test(text);
                        const text1 = numberElement1 ? numberElement1.textContent : '';
                        const text2 = numberElement2 ? numberElement2.textContent : '';
                        isGpt = hasRussianText(text1) || hasRussianText(text2);
                    }

                    const buttonsContainer = createButtons({ data3, data1, data2, firstLetter: displayLetter, isGpt });
                    buttonsDiv.appendChild(buttonsContainer);
                }
            }

            // Обновляем дропдаун и аватар в taskCreationDiv
            const taskCreationDiv = container.querySelector('.task-creation-div');
            if (taskCreationDiv && !GPTSelected) {
                const dropdown = taskCreationDiv.querySelector('select');
                const avatarImg = taskCreationDiv.querySelector('.avatar-img');
                if (dropdown && avatarImg) {
                    const targetName = getTargetName();
                    if (targetName) {
                        const selectedPerson = nameMapping.find(person => normalizeString(person.shortName) === targetName);
                        if (selectedPerson) {
                            dropdown.value = selectedPerson.id;
                            GPTSelected = true
                            const selectedUser = usersList.find(user => user.id.toString() === selectedPerson.id);
                            if (selectedUser) {
                                avatarImg.src = selectedUser.icon;
                            }
                        }
                    }
                }
            }
        }, 200);
    }

    // Наблюдение за изменениями в DOM
    const observer = new MutationObserver(() => {
        addButtonsToContainer();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Выполняем сразу при загрузке
    window.addEventListener('load', addButtonsToContainer);
    addButtonsToContainer();
})();