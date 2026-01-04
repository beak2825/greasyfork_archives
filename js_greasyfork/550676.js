// ==UserScript==
// @name        Кнопки в заказах | Сайды
// @namespace   Violentmonkey Scripts
// @match       *://a24.biz/order/*
// @match       https://avtor24.ru/order/*
// @author      Семён
// @version     13
// @description При нажатии на кнопку с аттрибутом data-tab="2" скопирует номер заказа
// @downloadURL https://update.greasyfork.org/scripts/550676/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B2%20%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D1%85%20%7C%20%D0%A1%D0%B0%D0%B9%D0%B4%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550676/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B2%20%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D1%85%20%7C%20%D0%A1%D0%B0%D0%B9%D0%B4%D1%8B.meta.js
// ==/UserScript==

(function() {

      const body = document.body;
      if (body && body.classList.contains('is-author')) {

    let fight = 0;
    let timeoutId = null;

    // Список пользователей для тегирования
    const usersList = [
        { id: 9470, name: 'Богдан Тирик' },
        { id: 17637, name: 'Анастасия Кривошеева' },
        { id: 7706, name: 'Алексей Усольцев' },
        { id: 7589, name: 'Альберт Будтуев' },
        { id: 6433, name: 'Анастасия Игнатенко' },
        { id: 5763, name: 'Лидия Шекварданян' },
        { id: 6416, name: 'Андрей Кузьмин' },
        { id: 5766, name: 'Марина Михайлова' },
        { id: 5765, name: 'Давид Геворкян' },
        { id: 5762, name: 'Семён Беккер' },
        { id: 1940, name: 'Дарина Михайленко' },
        { id: 113, name: 'Кристина Верещак' },
        { id: 112, name: 'Федор Батинов' }
    ];

    // Define CSS for the buttons and modal
    const css = `
        .custom-buttons-container {
            display: flex;
            gap: 10px;
            width: 100%;
            justify-content: flex-end;
            padding: 0;
        }

        .custom-buttons {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px 12px;
            background-color: #f1f4f9;
            border: 1px solid #e3e8f2;
            border-radius: 8px;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            font-size: 14px;
            color: #0d1d4a;
            transition: background-color 0.2s ease, transform 0.1s ease;
        }

        .custom-buttons:hover {
            background-color: #e3e8f2;
            transform: translateY(-1px);
        }

        .custom-buttons:active {
            transform: translateY(0);
        }

        .custom-buttons span {
            font-size: 22px;
        }

        #b24-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.6);
            z-index: 1001;
            overflow: auto;
        }

        .modal-content {
            background-color: #ffffff;
            margin: 5% auto;
            padding: 30px;
            border-radius: 12px;
            width: 90%;
            max-width: 700px;
            max-height: 80vh;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            position: relative;
            font-family: Arial, sans-serif;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }

        .close {
            position: absolute;
            right: 20px;
            top: 15px;
            font-size: 28px;
            cursor: pointer;
            color: #555;
            transition: color 0.3s;
        }

        .close:hover {
            color: #000;
        }

        h2 {
            margin: 0 0 20px;
            font-size: 24px;
            color: #333;
        }

        #comments-container {
            flex: 1;
            overflow-y: auto;
            padding-right: 10px;
            margin-bottom: 20px;
        }

        .comment {
            margin-bottom: 15px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }

        .author {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
        }

        .timestamp {
            font-size: 0.85em;
            color: #777;
            margin-bottom: 8px;
        }

        .text {
            font-size: 1em;
            color: #444;
            line-height: 1.5;
        }

        .mention {
            color: #007bff;
            font-weight: 500;
        }

        .no-comments, .error {
            text-align: center;
            color: #777;
            font-style: italic;
            padding: 20px;
        }

        .error {
            color: #dc3545;
        }

        .files-section {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px dashed #ccc;
        }

        .file-item {
            margin-top: 5px;
            font-size: 0.9em;
        }

        .file-item a {
            color: #007bff;
            text-decoration: none;
        }

        .file-item a:hover {
            text-decoration: underline;
        }

        .add-comment {
            position: sticky;
            bottom: 0;
            background-color: #ffffff;
            padding-top: 10px;
            margin-top: 25px;
            border-top: 1px solid #ccc;
        }

        .comment-preview {
            min-height: 30px;
            padding: 10px;
            background-color: #f1f1f1;
            border: 1px solid #ccc;
            border-radius: 8px;
            margin-bottom: 10px;
            color: #555;
            font-size: 0.95em;
            line-height: 1.5;
        }

        #comment-editor {
            width: 100%;
            height: 120px;
            margin-bottom: 10px;
            box-sizing: border-box;
        }

        #comment-editor .ql-container {
            border: 1px solid #ccc;
            border-radius: 8px;
        }

        #comment-editor .ql-toolbar {
            border: 1px solid #ccc;
            border-bottom: none;
            border-radius: 8px 8px 0 0;
        }

        .autocomplete {
            position: absolute;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 8px;
            max-height: 200px;
            overflow-y: auto;
            width: 100%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 1003;
            display: none;
        }

        .autocomplete-item {
            padding: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            font-size: 0.95em;
            color: #333;
            transition: background-color 0.2s;
        }

        .autocomplete-item:hover {
            background-color: #e6f3ff;
        }

        .user-icon {
            margin-right: 8px;
            font-size: 1.2em;
        }

        .input-actions {
            display: flex;
            gap: 10px;
        }

        #mention-button {
            padding: 8px 12px;
            background-color: #6c757d;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            transition: background-color 0.3s;
        }

        #mention-button:hover {
            background-color: #5a6268;
        }

        #submit-comment {
            padding: 12px 24px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            transition: background-color 0.3s;
        }

        #submit-comment:hover {
            background-color: #218838;
        }
    `;

    // Create and append the style element
    const styleElement = document.createElement('style');
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
    console.log('Styles applied successfully');

    // Получение номера заказа из URL
    function getOrderNumber() {
        const currentUrl = window.location.href;
        const urlParts = currentUrl.split('/');
        return urlParts[urlParts.length - 1];
    }

    function addButtons() {
        if (fight === 0) {
            const topInfo = document.querySelector('div[class*="styled__TopInfoStyled-sc"]');
            if (!topInfo) {
                console.log('Элемент div[class*="styled__TopInfoStyled-sc"] не найден. Ожидаем появления.');
                return;
            }

            fight = 1;
            console.log('Элемент div[class*="styled__TopInfoStyled-sc"] найден.');
            topInfo.style.setProperty('grid-column', '1', 'important');
            console.log('Стиль grid-column установлен как пустой с !important для div[class*="styled__TopInfoStyled-sc"].');

            if (topInfo.parentNode.querySelector('.custom-buttons-container')) {
                console.log('Контейнер кнопок уже существует, пропускаем добавление.');
                return;
            }

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'custom-buttons-container';
            buttonContainer.setAttribute('data-custom-buttons', 'true');

            // Copy order number button
            const copyButton = document.createElement('button');
            copyButton.className = 'custom-buttons';
            copyButton.title = 'Копировать номер заказа';
            const copySpan = document.createElement('span');
            copySpan.textContent = '📋';
            copyButton.appendChild(copySpan);

            copyButton.addEventListener('click', function() {
                const currentUrl = window.location.href;
                const urlParts = currentUrl.split('/');
                const valueToCopy = urlParts[urlParts.length - 1];

                navigator.clipboard.writeText(valueToCopy).then(function() {
                    console.log('Номер заказа ' + valueToCopy + ' скопирован в буфер обмена');
                }).catch(function(error) {
                    console.error('Ошибка при копировании номера заказа: ', error);
                });
            });

            // Mirror order button
            const mirrorButton = document.createElement('button');
            mirrorButton.className = 'custom-buttons';
            mirrorButton.title = 'Отразить заказ';
            const mirrorSpan = document.createElement('span');
            mirrorSpan.textContent = '🪞';
            mirrorButton.appendChild(mirrorSpan);

            mirrorButton.addEventListener('click', function() {
                const currentUrl = window.location.href;
                const urlParts = currentUrl.split('/');
                const orderNumber = urlParts[urlParts.length - 1];
                const commands = [];
                const orderDataString = localStorage.getItem(`orderdata_${orderNumber}`);
                let FinalLetter = 'Ш ';
                let orderData;
                if (orderDataString) {
                    orderData = JSON.parse(orderDataString);
                }
                const isNumber = (val) => {
                    if (val === null || val === undefined || val === '') return false;
                    return !isNaN(val) && !isNaN(parseFloat(val));
                };
                const hasRussianText = (text) => /[А-Яа-яЁё]/.test(text);
                const text1 = orderData['ID Экспресс'] ? orderData['ID Экспресс'].textContent : '';
                const text2 = orderData['ID Аукцион'] ? orderData['ID Аукцион'].textContent : '';
                const isGpt = hasRussianText(text1) || hasRussianText(text2);
                if (orderData['Вид заказа'] == "772" || isGpt) {
                    commands.push(`Bitrix open ${orderData['ID Битрикс']}`);
                } else {
                    const isValue1Number = isNumber(orderData['ID Экспресс']);
                    const isValue2Number = isNumber(orderData['ID Аукцион']);
                    if ((isValue1Number && !isValue2Number) || (!isValue1Number && isValue2Number)) {
                        FinalLetter = 'Shmel';
                    }
                    if (isValue1Number && !isValue2Number) {
                        if (![832, null, 781].includes(Number(orderData['Статус Шмель']))) {
                            commands.push(`${FinalLetter} open ${orderData['ID Экспресс']}`);
                        } else {
                            console.log(`Bitrix open ${orderData['ID Битрикс']}`);
                            commands.push(`Bitrix open ${orderData['ID Битрикс']}`);
                        }
                    } else if (isValue2Number && !isValue1Number) {
                        if (![832, null, 781].includes(Number(orderData['Статус Шмель']))) {
                            commands.push(`${FinalLetter} open ${orderData['ID Аукцион']}`);
                        } else {
                            console.log(`Bitrix open ${orderData['ID Битрикс']}`);
                            commands.push(`Bitrix open ${orderData['ID Битрикс']}`);
                        }
                    } else {
                        commands.push(`Bitrix open ${orderData['ID Битрикс']}`);
                    }
                }
                if (commands.length > 0) {
                    unsafeWindow.sendSeleniumCommand(commands);
                }
            });

            // Open in Bitrix button
            const bitrixButton = document.createElement('button');
            bitrixButton.className = 'custom-buttons';
            bitrixButton.title = 'Открыть заказ в Битрикс';
            const bitrixSpan = document.createElement('span');
            bitrixSpan.textContent = '📰';
            bitrixButton.appendChild(bitrixSpan);

            bitrixButton.addEventListener('click', function() {
                unsafeWindow.bitrixApi.OpenBitrix();
            });

            // Close order button
            const closeButton = document.createElement('button');
            closeButton.className = 'custom-buttons';
            closeButton.title = 'Закрыть заказ везде (Кроме Битрикса)';
            const closeSpan = document.createElement('span');
            closeSpan.textContent = '✖';
            closeButton.appendChild(closeSpan);

            closeButton.addEventListener('click', function() {
                const currentUrl = window.location.href;
                const urlParts = currentUrl.split('/');
                const orderNumber = urlParts[urlParts.length - 1];
                const commands = [];
                const orderDataString = localStorage.getItem(`orderdata_${orderNumber}`);
                let orderData = orderDataString ? JSON.parse(orderDataString) : {};

                const isNumber = (val) => val && !isNaN(val) && !isNaN(parseFloat(val));
                const hasRussianText = (text) => /[А-Яа-яЁё]/.test(text);
                const text1 = orderData['ID Экспресс'] ? orderData['ID Экспресс'].textContent : '';
                const text2 = orderData['ID Аукцион'] ? orderData['ID Аукцион'].textContent : '';
                const isGpt = hasRussianText(text1) || hasRussianText(text2);

                if (orderData['Автор']) {
                    let finalLetter;
                    switch (orderData['Автор']) {
                        case '429': finalLetter = 'Masha'; break;
                        case '834': finalLetter = 'Nadya'; break;
                        case '430': finalLetter = 'Stepa'; break;
                    }
                    if (finalLetter) {
                        commands.push(`${finalLetter} close ${orderData['ID Автор']}`);
                    }
                } else {
                    let finalLetter = 'Shmel';
                    if (orderData['Вид заказа'] === '772' || isGpt) {
                        commands.push(`Bitrix close ${orderData['ID Битрикс']}`);
                    } else {
                        const isValue1Number = isNumber(orderData['ID Экспресс']);
                        const isValue2Number = isNumber(orderData['ID Аукцион']);
                        if ((isValue1Number && !isValue2Number) || (!isValue1Number && isValue2Number)) {
                            if (isValue1Number && !isValue2Number) {
                                if (![832, null, 781].includes(Number(orderData['Статус Шмель']))) {
                                    commands.push(`${finalLetter} close ${orderData['ID Экспресс']}`);
                                } else {
                                    commands.push(`Bitrix close ${orderData['ID Битрикс']}`);
                                }
                            } else if (isValue2Number && !isValue1Number) {
                                if (![832, null, 781].includes(Number(orderData['Статус Шмель']))) {
                                    commands.push(`${finalLetter} close ${orderData['ID Аукцион']}`);
                                } else {
                                    commands.push(`Bitrix close ${orderData['ID Битрикс']}`);
                                }
                            }
                        } else if (isValue1Number && isValue2Number) {
                            commands.push(`Bitrix close ${orderData['ID Битрикс']}`);
                            commands.push(`${finalLetter} close ${orderData['ID Аукцион']}`);
                            commands.push(`${finalLetter} close ${orderData['ID Экспресс']}`);
                        } else {
                            commands.push(`Bitrix close ${orderData['ID Битрикс']}`);
                        }
                    }
                }
                if (commands.length > 0) {
                    unsafeWindow.sendSeleniumCommand(commands);
                }
                window.close();
            });

            // Append all buttons to the container
            buttonContainer.appendChild(copyButton);
            buttonContainer.appendChild(bitrixButton);

            // Insert the button container after topInfo
            topInfo.parentNode.insertBefore(buttonContainer, topInfo.nextSibling);
            console.log('Кнопки успешно добавлены после div[class*="styled__TopInfoStyled-sc"].');

            // Replace "Чат с заказчиком" with "Чат"
            document.querySelectorAll('span').forEach(span => {
                if (span.textContent === 'Чат с заказчиком') {
                    span.textContent = 'Чат';
                    console.log('Текст "Чат с заказчиком" заменён на "Чат".');
                }
            });

            // Stop the MutationObserver and clear the timeout
            observer.disconnect();
            clearTimeout(timeoutId);
            console.log('MutationObserver остановлен, таймер очищен.');

            // Periodically check if buttons are still present
            const checkInterval = setInterval(() => {
                if (!document.querySelector('div[data-custom-buttons="true"]')) {
                    console.log('Контейнер кнопок отсутствует. Пытаемся добавить заново.');
                    fight = 0;
                    startButtonLogic();
                } else {
                }
            }, 1000);
        }
    }

    function startButtonLogic() {
        const targetTitles = ['Перерасчёт', 'На гарантии', 'В работе', 'Корректировка', 'Завершён'];
        const titleElements = document.querySelectorAll('div[class*="styled__Title-sc"]');
        let foundMatchingTitle = false;

        titleElements.forEach(element => {
            if (targetTitles.includes(element.textContent.trim())) {
                foundMatchingTitle = true;
            }
        });

        if (foundMatchingTitle) {
            console.log('Найден элемент div[class*="styled__Title-sc"] с текстом: ' + targetTitles.join(', ') + '. Выполняем addButtons.');
            addButtons();
        } else {
            timeoutId = setTimeout(() => {
                const titleElementsRetry = document.querySelectorAll('div[class*="styled__Title-sc"]');
                let foundOnRetry = false;

                titleElementsRetry.forEach(element => {
                    if (targetTitles.includes(element.textContent.trim())) {
                        foundOnRetry = true;
                    }
                });

                if (foundOnRetry) {
                    addButtons();
                } else {
                }
            }, 15000);
        }
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                console.log('Обнаружены изменения в DOM. Проверяем наличие div[class*="styled__Title-sc"].');
                startButtonLogic();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log('MutationObserver запущен. Ожидаем появления элементов.');
    startButtonLogic();
      } else {

  var clack = 0;
  var fight = 0;
  const css = `
    .Clones:hover {
      background-color: rgba(255, 255, 255) !important;
    }

    .ClonesSpecial:hover {
      background-color: rgba(255, 255, 255) !important;
    }

    .ClonesSpecial {
      background-color: transparent !important;
      all: unset !important;
        -webkit-text-size-adjust: 100% !important;
        --swiper-theme-color: #007aff !important;
        --vh: 8.4px !important;
        --color-black: #0d1d4a !important;
        --color-gray: #93a1c8 !important;
        --color-gray-normal: #e3e8f2 !important;
        --color-gray-light: #f1f4f9 !important;
        --color-white: #ffffff !important;
        --color-purple: #7d2aeb !important;
        --color-purple-secondary: #9646ff !important;
        --color-purple-light: #f2eafd !important;
        --color-purple-dark: #6435a5 !important;
        --color-pink: #f75db8 !important;
        --color-pink-light: #feeff8 !important;
        --color-green: #73ee00 !important;
        --color-green-light: #f1fde6 !important;
        --color-yellow: #ffd304 !important;
        --color-yellow-light: #fff6c9 !important;
        --color-yellow-dark: #fdc607 !important;
        --font-family: Circe, Helvetica, sans-serif !important;
        --font-text-normal: 400 0.875rem/1.125rem Circe, Helvetica, sans-serif !important;
        --font-text-normal-bold: 700 0.875rem/1.125rem Circe, Helvetica, sans-serif !important;
        --font-text-medium: 400 1rem/1.25rem Circe, Helvetica, sans-serif !important;
        --font-text-medium-secondary: 400 1.25rem/1.5rem Circe, Helvetica, sans-serif !important;
        --font-text-medium-bold: 700 1rem/1.25rem Circe, Helvetica, sans-serif !important;
        --font-text-extra-small: 400 0.6875rem/0.875rem Circe, Helvetica, sans-serif !important;
        --font-text-extra-small-bold: 700 0.6875rem/0.875rem Circe, Helvetica, sans-serif !important;
        --font-text-small: 400 0.75rem/1rem Circe, Helvetica, sans-serif !important;
        --font-text-small-bold: 700 0.75rem/1rem Circe, Helvetica, sans-serif !important;
        --font-header-big: 700 2.5rem/3rem Circe, Helvetica, sans-serif !important;
        --font-header-medium: 700 1.5625rem/1.9375rem Circe, Helvetica, sans-serif !important;
        --font-header-small: 700 1.125rem/1.375rem Circe, Helvetica, sans-serif !important;
        --font-header-medium-mobile: 700 1.0625rem/1.5625rem Circe, Helvetica, sans-serif !important;
        --font-header-small-mobile: 700 0.875rem/1.125rem Circe, Helvetica, sans-serif !important;
        scrollbar-color: rgb(204, 204, 204) transparent !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        overflow: visible !important;
        text-transform: none !important;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
        outline: none !important;
        border: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        user-select: none !important;
        appearance: none !important;
        font: var(--font-header-medium) !important;
        border-radius: 0.625rem 0.625rem 0px 0px !important;
        position: relative !important;
        background-color: transparent !important;
        transition: color 0.17s ease-in-out 0s !important;
        color: var(--color-gray) !important;
        font-size: 1.5rem !important;
        line-height: 1.375rem !important;
        padding: 0px 1.125rem !important;
        margin-left: auto !important;
        max-width: 11rem !important;
        text-align: center !important;
    }

    .Clones {
      background-color: transparent !important;
      all: unset !important;
        -webkit-text-size-adjust: 100% !important;
        --swiper-theme-color: #007aff !important;
        --vh: 8.4px !important;
        --color-black: #0d1d4a !important;
        --color-gray: #93a1c8 !important;
        --color-gray-normal: #e3e8f2 !important;
        --color-gray-light: #f1f4f9 !important;
        --color-white: #ffffff !important;
        --color-purple: #7d2aeb !important;
        --color-purple-secondary: #9646ff !important;
        --color-purple-light: #f2eafd !important;
        --color-purple-dark: #6435a5 !important;
        --color-pink: #f75db8 !important;
        --color-pink-light: #feeff8 !important;
        --color-green: #73ee00 !important;
        --color-green-light: #f1fde6 !important;
        --color-yellow: #ffd304 !important;
        --color-yellow-light: #fff6c9 !important;
        --color-yellow-dark: #fdc607 !important;
        --font-family: Circe, Helvetica, sans-serif !important;
        --font-text-normal: 400 0.875rem/1.125rem Circe, Helvetica, sans-serif !important;
        --font-text-normal-bold: 700 0.875rem/1.125rem Circe, Helvetica, sans-serif !important;
        --font-text-medium: 400 1rem/1.25rem Circe, Helvetica, sans-serif !important;
        --font-text-medium-secondary: 400 1.25rem/1.5rem Circe, Helvetica, sans-serif !important;
        --font-text-medium-bold: 700 1rem/1.25rem Circe, Helvetica, sans-serif !important;
        --font-text-extra-small: 400 0.6875rem/0.875rem Circe, Helvetica, sans-serif !important;
        --font-text-extra-small-bold: 700 0.6875rem/0.875rem Circe, Helvetica, sans-serif !important;
        --font-text-small: 400 0.75rem/1rem Circe, Helvetica, sans-serif !important;
        --font-text-small-bold: 700 0.75rem/1rem Circe, Helvetica, sans-serif !important;
        --font-header-big: 700 2.5rem/3rem Circe, Helvetica, sans-serif !important;
        --font-header-medium: 700 1.5625rem/1.9375rem Circe, Helvetica, sans-serif !important;
        --font-header-small: 700 1.125rem/1.375rem Circe, Helvetica, sans-serif !important;
        --font-header-medium-mobile: 700 1.0625rem/1.5625rem Circe, Helvetica, sans-serif !important;
        --font-header-small-mobile: 700 0.875rem/1.125rem Circe, Helvetica, sans-serif !important;
        scrollbar-color: rgb(204, 204, 204) transparent !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        overflow: visible !important;
        text-transform: none !important;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
        outline: none !important;
        border: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        user-select: none !important;
        appearance: none !important;
        font: var(--font-header-medium) !important;
        border-radius: 0.625rem 0.625rem 0px 0px !important;
        position: relative !important;
        background-color: transparent !important;
        transition: color 0.17s ease-in-out 0s !important;
        color: var(--color-gray) !important;
        font-size: 1.5rem !important;
        line-height: 1.375rem !important;
        padding: 0px 1.125rem !important;
        max-width: 11rem !important;
        text-align: center !important;
    }


  `;

    // Создаем элемент <style> и добавляем CSS
    const styleElement = document.createElement('style');
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
    console.log('Styles applied successfully');

    function addCopyButton() {
        if (fight == 0){
        var clay;
        clack++
        // Ищем кнопку с атрибутом data-tab="2" и span внутри
        var button = document.querySelector('button[data-tab="4"] span');
        if (!button){
          button = document.querySelector('button[data-tab="3"] span');
        }
        if (!button){
          button = document.querySelector('button[data-tab="2"] span');
        }
        if (!button){
          button = document.querySelector('button[data-tab="1"] span');
          clay = 1;
        }
        var button2 = document.querySelector('button[data-tab="in_work_reworks"] span');
        if (!button2) {
          button2 = document.querySelector('button[data-tab="in_work_files"] span');
        }
        if (!button2) {
          button2 = document.querySelector('button[data-tab="in_work_details"] span');
        }
        if (button) {
            fight = 1
            var parentButton = button.closest('button');
            var clonedButton = parentButton.cloneNode(true);
            clonedButton.removeAttribute('data-tab');
            // Изменяем текст  кнопки на "Копировать номер заказа"
              // Удаляем все <span> внутри клонированной кнопки
              var spans = clonedButton.querySelectorAll('span');
              spans.forEach(function(span) {
                  span.remove();
              });

              // Создаем новый <span> и добавляем его в кнопку
              var newSpan = document.createElement('span');
              newSpan.textContent = '📋';
              clonedButton.title = 'Копировать номер заказа';
              clonedButton.appendChild(newSpan);
          clonedButton.style.cssText = '';
          clonedButton.className = '';
          clonedButton.classList.add("ClonesSpecial");
          clonedButton.removeAttribute('style');


            // Добавляем обработчик события нажатия
            clonedButton.addEventListener('click', function() {
                var currentUrl = window.location.href;
                var urlParts = currentUrl.split('/');
                var valueToCopy = urlParts[urlParts.length - 1];

                navigator.clipboard.writeText(valueToCopy).then(function() {
                    console.log('Номер заказа ' + valueToCopy + ' скопирован в буфер обмена');
                }).catch(function(error) {
                    console.error('Ошибка при копировании номера заказа: ', error);
                });
            });


            // Клонируем кнопку для зеркалирования номера заказа
            var mirroredButton = clonedButton.cloneNode(true);
            mirroredButton.removeAttribute('data-tab');

            // Изменяем текст  кнопки на "Копировать номер заказа"
            var spanMirror = mirroredButton.querySelector('span');

            if (spanMirror) {
                spanMirror.textContent = '🪞';
            }
            mirroredButton.title = 'Отразить заказ';
            mirroredButton.className = '';
            mirroredButton.classList.add("Clones");
            mirroredButton.addEventListener('click', function() {
                unsafeWindow.bitrixApi.openOlyeca();
            });

          mirroredButton.addEventListener('mouseover', function() {
            mirroredButton.style.backgroundColor = 'rgba(255, 255, 255) !important'; // Set background to semi-transparent black
          });

          mirroredButton.addEventListener('mouseout', function() {
            mirroredButton.style.backgroundColor = 'transparent !important'; // Set background to transparent
          });


            var mirroredButton2 = mirroredButton.cloneNode(true);
            var spanMirror = mirroredButton2.querySelector('span');
            if (spanMirror) {
                spanMirror.textContent = '📰';
            }
            mirroredButton2.title = 'Открыть заказ в Битрикс';
            mirroredButton2.addEventListener('click', function() {
                unsafeWindow.bitrixApi.OpenBitrix();
            });

          var mirroredButton3 = mirroredButton2.cloneNode(true);
            var spanMirror = mirroredButton3.querySelector('span');
            if (spanMirror) {
                spanMirror.textContent = '✖';
            }
            mirroredButton3.title = 'Закрыть заказ везде (Кроме Битрикса)';
            mirroredButton3.addEventListener('click', function() {
                const commands = [];
                var currentUrl = window.location.href;
                var urlParts = currentUrl.split('/');
                var valueToCopy = "О " + urlParts[urlParts.length - 1];
                const orderDataString = localStorage.getItem(`orderdata_${urlParts[urlParts.length - 1]}`);
                let orderData;
                if (orderDataString) {
                    orderData = JSON.parse(orderDataString);
                }
                let finalLetter;
                if (orderData['Автор']) {
                    switch (orderData['Автор']) {
                        case '429': finalLetter = 'Masha'; break;
                        case '834': finalLetter = 'Nadya'; break;
                        case '430': finalLetter = 'Stepa'; break;
                    }
                }
                if (finalLetter) {
                    commands.push(`${finalLetter} close ${orderData['ID Автор']}`);
                }
                if (commands.length > 0) {
                    unsafeWindow.sendSeleniumCommand(commands);
                }
                window.close();
            });

            // Вставляем дублированные кнопки в DOM после оригинальной
            parentButton.parentNode.insertBefore(clonedButton, parentButton.nextSibling);
            parentButton.parentNode.insertBefore(mirroredButton, clonedButton.nextSibling);
            parentButton.parentNode.insertBefore(mirroredButton2, mirroredButton.nextSibling);

            console.log('Кнопка "Копировать номер заказа" добавлена.');
        } else if (button2) {
            fight = 1
            var parentButton = button2.closest('button');
            var clonedButton = parentButton.cloneNode(true);
            clonedButton.removeAttribute('data-tab');

            // Изменяем текст кнопки на "Копировать номер заказа"
            var span = clonedButton.querySelector('span');
            span.textContent = '📋';
            clonedButton.title = 'Копировать номер заказа';
            clonedButton.style.cssText = '';
            clonedButton.className = '';
            clonedButton.classList.add("ClonesSpecial");
            clonedButton.removeAttribute('style');

            // Добавляем обработчик события нажатия
            clonedButton.addEventListener('click', function() {
                var currentUrl = window.location.href;
                var urlParts = currentUrl.split('/');
                var valueToCopy = urlParts[urlParts.length - 1];

                navigator.clipboard.writeText(valueToCopy).then(function() {
                    console.log('Номер заказа ' + valueToCopy + ' скопирован в буфер обмена');
                }).catch(function(error) {
                    console.error('Ошибка при копировании номера заказа: ', error);
                });
            });

            // Клонируем кнопку для зеркалирования номера заказа
            var mirroredButton = parentButton.cloneNode(true);
            mirroredButton.removeAttribute('data-tab');
            var spanMirror = mirroredButton.querySelector('span');
            spanMirror.textContent = '🪞';
            mirroredButton.title = 'Отразить заказ';
            mirroredButton.style.cssText = '';
            mirroredButton.className = '';
            mirroredButton.classList.add("Clones");
            mirroredButton.removeAttribute('style');
            mirroredButton.addEventListener('click', function() {
                unsafeWindow.bitrixApi.openOlyeca();
            });

            var mirroredButton2 = mirroredButton.cloneNode(true);
            var spanMirror = mirroredButton2.querySelector('span');
            spanMirror.textContent = '📰';
            mirroredButton2.title = 'Открыть заказ в Битрикс';
            mirroredButton2.style.cssText = '';
            mirroredButton2.className = '';
            mirroredButton2.classList.add("Clones");
            mirroredButton2.removeAttribute('style');
            mirroredButton2.addEventListener('click', function() {
                unsafeWindow.bitrixApi.OpenBitrix();
            });

          var mirroredButton3 = mirroredButton2.cloneNode(true);
            var spanMirror = mirroredButton3.querySelector('span');
            spanMirror.textContent = '✖';
            mirroredButton3.title = 'Закрыть заказ везде (Кроме Битрикса)';
            mirroredButton3.style.cssText = '';
            mirroredButton3.className = '';
            mirroredButton3.classList.add("Clones");
            mirroredButton3.removeAttribute('style');
            mirroredButton3.addEventListener('click', function() {
                var currentUrl = window.location.href;
                var urlParts = currentUrl.split('/');
                const commands = [];
                var valueToCopy = "А " + urlParts[urlParts.length - 1];
                const orderDataString = localStorage.getItem(`orderdata_${urlParts[urlParts.length - 1]}`);
                let orderData;
                if (orderDataString) {
                    orderData = JSON.parse(orderDataString);
                }
                const isNumber = (val) => {
                    if (val === null || val === undefined || val === '') return false;
                    return !isNaN(val) && !isNaN(parseFloat(val));
                };

                // Проверка на русский текст (GPT)
                const hasRussianText = (text) => /[А-Яа-яЁё]/.test(text);
                const text1 = orderData['ID Экспресс'] ? orderData['ID Экспресс'].textContent : '';
                const text2 = orderData['ID Аукцион'] ? orderData['ID Аукцион'].textContent : '';
                const isGpt = hasRussianText(text1) || hasRussianText(text2);

                let FinalLetter = 'Shmel';

                // Если заказ 772 или GPT - закрываем только Битрикс
                if (orderData['Вид заказа'] == "772" || isGpt) {
                    commands.push(`Bitrix close ${orderData['ID Битрикс']}`);
                } else {
                    const isValue1Number = isNumber(orderData['ID Экспресс']);
                    const isValue2Number = isNumber(orderData['ID Аукцион']);

                    if ((isValue1Number && !isValue2Number) || (!isValue1Number && isValue2Number)) {
                        if (isValue1Number && !isValue2Number) {
                            // Добавляем проверку статуса Шмель, как при открытии
                            if (![832, null, 781].includes(Number(orderData['Статус Шмель']))) {
                                commands.push(`${FinalLetter} close ${orderData['ID Экспресс']}`);
                            } else {
                                commands.push(`Bitrix close ${orderData['ID Битрикс']}`);
                            }
                        } else if (isValue2Number && !isValue1Number) {
                            // Добавляем проверку статуса Шмель, как при открытии
                            if (![832, null, 781].includes(Number(orderData['Статус Шмель']))) {
                                commands.push(`${FinalLetter} close ${orderData['ID Аукцион']}`);
                            } else {
                                commands.push(`Bitrix close ${orderData['ID Битрикс']}`);
                            }
                        }
                    } else if (isValue1Number && isValue2Number) {
                      commands.push(`Bitrix close ${orderData['ID Битрикс']}`);
                      commands.push(`${FinalLetter} close ${orderData['ID Аукцион']}`);
                      commands.push(`${FinalLetter} close ${orderData['ID Экспресс']}`);
                    } else {
                      commands.push(`Bitrix close ${orderData['ID Битрикс']}`);
                    }
                }
                if (commands.length > 0) {
                    unsafeWindow.sendSeleniumCommand(commands);
                }
                window.close();
            });

            // Вставляем дублированные кнопки в DOM после оригинальной
            parentButton.parentNode.insertBefore(clonedButton, parentButton.nextSibling);
            parentButton.parentNode.insertBefore(mirroredButton, clonedButton.nextSibling);
            parentButton.parentNode.insertBefore(mirroredButton2, mirroredButton.nextSibling);

            console.log('Кнопка "Копировать номер заказа" добавлена.');
            // Находим все элементы <span> на странице
            const spans = document.querySelectorAll('span');

            // Перебираем все найденные элементы
            spans.forEach(span => {
              // Проверяем, содержит ли span текст "Чат с заказчиком"
              if (span.textContent === 'Чат с заказчиком') {
                // Заменяем текст на "Чат"
                span.textContent = 'Чат';
              }
            });
        } else {
            console.log('Кнопка с data-tab="2" и span не найдена. Повторный запуск через 500 мс.');
            setTimeout(addCopyButton, 500); // Пробуем еще раз через 500 мс
        }
        }
    }

    // Запускаем процесс добавления кнопки
    const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      // Проверка на наличие элемента с классом, содержащим "dialogMessage-content"
      const newElements = document.querySelectorAll('[class*="dialogMessage-content"]');
      if (newElements.length > 0) {
        addCopyButton(); // Вызов функции, если есть подходящие элементы
        observer.disconnect(); // Останавливаем наблюдатель после добавления кнопок
      }
    }
  });
});

// Наблюдение за изменениями в DOM
observer.observe(document.body, { childList: true, subtree: true });


      }


})();