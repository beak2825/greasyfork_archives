// ==UserScript==
// @name         Перевод названия и описания на YouTube Studio по клику
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Добавляет кнопку для перевода названия и описания видео на все языки DeepL, с поддержкой RU/EN интерфейса, запросом API-ключа, проверкой лимитов и уведомлением о неподдерживаемых языках
// @author       You
// @match        https://studio.youtube.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/553509/%D0%9F%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%B8%20%D0%BE%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%BD%D0%B0%20YouTube%20Studio%20%D0%BF%D0%BE%20%D0%BA%D0%BB%D0%B8%D0%BA%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/553509/%D0%9F%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%B8%20%D0%BE%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%BD%D0%B0%20YouTube%20Studio%20%D0%BF%D0%BE%20%D0%BA%D0%BB%D0%B8%D0%BA%D1%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL для API Free
    const DEEPL_API_URL = 'https://api-free.deepl.com/v2';

    // Маппинг названий языков (RU + EN) на коды DeepL
    const languageMap = {
        // Русский интерфейс
        'Арабский': 'AR',
        'Болгарский': 'BG',
        'Чешский': 'CS',
        'Датский': 'DA',
        'Немецкий': 'DE',
        'Немецкий (Австрия)': 'DE',
        'Немецкий (Германия)': 'DE',
        'Немецкий (Швейцария)': 'DE',
        'Греческий': 'EL',
        'Английский': 'EN',
        'Английский (Австралия)': 'EN-GB',
        'Английский (Великобритания)': 'EN-GB',
        'Английский (Индия)': 'EN',
        'Английский (Ирландия)': 'EN-GB',
        'Английский (Канада)': 'EN-US',
        'Английский (Соединенные Штаты)': 'EN-US',
        'Испанский': 'ES',
        'Испанский (Испания)': 'ES',
        'Испанский (Латинская Америка)': 'ES-419',
        'Испанский (Мексика)': 'ES-419',
        'Испанский (Соединенные Штаты)': 'ES-419',
        'Эстонский': 'ET',
        'Финский': 'FI',
        'Французский': 'FR',
        'Французский (Бельгия)': 'FR',
        'Французский (Канада)': 'FR',
        'Французский (Франция)': 'FR',
        'Французский (Швейцария)': 'FR',
        'Иврит': 'HE',
        'Венгерский': 'HU',
        'Индонезийский': 'ID',
        'Итальянский': 'IT',
        'Японский': 'JA',
        'Корейский': 'KO',
        'Литовский': 'LT',
        'Латышский': 'LV',
        'Норвежский': 'NB',
        'Нидерландский': 'NL',
        'Нидерландский (Бельгия)': 'NL',
        'Нидерландский (Нидерланды)': 'NL',
        'Польский': 'PL',
        'Португальский': 'PT',
        'Португальский (Бразилия)': 'PT-BR',
        'Португальский (Португалия)': 'PT-PT',
        'Румынский': 'RO',
        'Румынский (Молдова)': 'RO',
        'Русский': 'RU',
        'Русский (латиница)': 'RU',
        'Словацкий': 'SK',
        'Словенский': 'SL',
        'Шведский': 'SV',
        'Тайский': 'TH',
        'Турецкий': 'TR',
        'Украинский': 'UK',
        'Вьетнамский': 'VI',
        'Китайский': 'ZH',
        'Китайский (Гонконг)': 'ZH-HANT',
        'Китайский (Китай)': 'ZH-HANS',
        'Китайский (Сингапур)': 'ZH-HANS',
        'Китайский (Тайвань)': 'ZH-HANT',
        'Китайский (традиционная)': 'ZH-HANT',
        'Китайский (упрощенная)': 'ZH-HANS',

        // Английский интерфейс
        'Arabic': 'AR',
        'Bulgarian': 'BG',
        'Czech': 'CS',
        'Danish': 'DA',
        'German': 'DE',
        'German (Austria)': 'DE',
        'German (Germany)': 'DE',
        'German (Switzerland)': 'DE',
        'Greek': 'EL',
        'English': 'EN',
        'English (Australia)': 'EN-GB',
        'English (Canada)': 'EN-US',
        'English (India)': 'EN',
        'English (Ireland)': 'EN-GB',
        'English (United Kingdom)': 'EN-GB',
        'English (United States)': 'EN-US',
        'Spanish': 'ES',
        'Spanish (Spain)': 'ES',
        'Spanish (Latin America)': 'ES-419',
        'Spanish (Mexico)': 'ES-419',
        'Spanish (United States)': 'ES-419',
        'Estonian': 'ET',
        'Finnish': 'FI',
        'French': 'FR',
        'French (Belgium)': 'FR',
        'French (Canada)': 'FR',
        'French (France)': 'FR',
        'French (Switzerland)': 'FR',
        'Hebrew': 'HE',
        'Hungarian': 'HU',
        'Indonesian': 'ID',
        'Italian': 'IT',
        'Japanese': 'JA',
        'Korean': 'KO',
        'Lithuanian': 'LT',
        'Latvian': 'LV',
        'Norwegian': 'NB',
        'Dutch': 'NL',
        'Dutch (Belgium)': 'NL',
        'Dutch (Netherlands)': 'NL',
        'Polish': 'PL',
        'Portuguese': 'PT',
        'Portuguese (Brazil)': 'PT-BR',
        'Portuguese (Portugal)': 'PT-PT',
        'Romanian': 'RO',
        'Romanian (Moldova)': 'RO',
        'Russian': 'RU',
        'Russian (Latin)': 'RU',
        'Slovak': 'SK',
        'Slovenian': 'SL',
        'Swedish': 'SV',
        'Thai': 'TH',
        'Turkish': 'TR',
        'Ukrainian': 'UK',
        'Vietnamese': 'VI',
        'Chinese': 'ZH',
        'Chinese (China)': 'ZH-HANS',
        'Chinese (Hong Kong)': 'ZH-HANT',
        'Chinese (Singapore)': 'ZH-HANS',
        'Chinese (Taiwan)': 'ZH-HANT',
        'Chinese (Simplified)': 'ZH-HANS',
        'Chinese (Traditional)': 'ZH-HANT',

        // Резервный код для неподдерживаемых языков
        'default': 'EN'
    };

    // Функция для создания кастомного уведомления
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#333';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0.9';
        notification.style.transition = 'opacity 0.5s ease-out';
        document.body.appendChild(notification);

        // Исчезновение через 5 секунд
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 5000);

        GM_log(`Показ уведомления: ${message}`);
    }

    // Флаг для предотвращения множественных инициализаций
    let isInitializing = false;

    // Функция для запроса и сохранения API-ключа
    function getApiKey() {
        let apiKey = GM_getValue('deepl_api_key', '');
        if (!apiKey) {
            apiKey = prompt('Введите ваш DeepL API-ключ (https://www.deepl.com/pro-api):');
            if (apiKey) {
                GM_setValue('deepl_api_key', apiKey);
                GM_log('API-ключ сохранен.');
            } else {
                alert('API-ключ не введен. Скрипт не будет работать без ключа.');
                GM_log('API-ключ не введен.');
            }
        }
        return apiKey;
    }

    // Функция для проверки валидности ключа и лимитов
    function checkApiKey(apiKey, callback) {
        if (!apiKey) {
            callback(false, 'API-ключ не указан.');
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: `${DEEPL_API_URL}/usage`,
            headers: {
                'Authorization': `DeepL-Auth-Key ${apiKey}`
            },
            onload: function(response) {
                try {
                    let result = JSON.parse(response.responseText);
                    GM_log(`Ответ от DeepL /usage: ${response.responseText}`);
                    if (result.character_count !== undefined && result.character_limit !== undefined) {
                        let remaining = result.character_limit - result.character_count;
                        GM_log(`Лимит символов: ${result.character_count} использовано из ${result.character_limit}. Доступно: ${remaining}`);
                        if (remaining > 0) {
                            callback(true, `Доступно ${remaining} символов из ${result.character_limit}`);
                        } else {
                            callback(false, 'Лимит символов исчерпан. Получите новый API-ключ.');
                        }
                    } else {
                        callback(false, 'Ошибка проверки API-ключа: неверный формат ответа.');
                    }
                } catch (e) {
                    GM_log('Ошибка парсинга ответа /usage: ' + e.message);
                    callback(false, 'Ошибка проверки API-ключа: ' + e.message);
                }
            },
            onerror: function() {
                GM_log('Ошибка запроса к DeepL /usage.');
                callback(false, 'Ошибка проверки API-ключа: не удалось подключиться к DeepL.');
            }
        });
    }

    // Функция для получения кода языка
    function getLanguageCode(languageText) {
        const trimmed = languageText.trim();
        const lang = languageMap[trimmed] || languageMap['default'];
        if (!languageMap[trimmed]) {
            showNotification(`Язык "${trimmed}" не поддерживается DeepL. Перевод будет выполнен на английский.`);
        }
        GM_log(`Преобразование языка: "${trimmed}" -> ${lang}`);
        return lang;
    }

    // Функция для разбиения текста на части
    function splitText(text) {
        const regex = /^(.+?)(\s*\([^)]+\))?\s*(\[.+?\])?$/;
        const match = text.match(regex);
        if (!match) {
            return { main: text, parentheses: '', brackets: '' };
        }
        return {
            main: match[1] || '',
            parentheses: match[2] || '',
            brackets: match[3] || ''
        };
    }

    // Функция для отправки текста на перевод через DeepL
    function translateText(text, sourceLang, targetLang, apiKey, callback) {
        if (!text.trim()) {
            GM_log('Текст для перевода пустой.');
            callback('');
            return;
        }

        GM_log(`Отправка текста на перевод: "${text}" (с ${sourceLang} на ${targetLang})`);

        let url = `${DEEPL_API_URL}/translate?auth_key=${apiKey}&text=${encodeURIComponent(text)}&target_lang=${targetLang}&preserve_formatting=1`;
        if (sourceLang) {
            url += `&source_lang=${sourceLang}`;
        }

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function(response) {
                try {
                    let result = JSON.parse(response.responseText);
                    GM_log(`Ответ от DeepL: ${response.responseText}`);
                    if (result.translations && result.translations[0]) {
                        callback(result.translations[0].text);
                    } else {
                        GM_log('Ошибка: Не удалось получить перевод.');
                        callback('');
                    }
                } catch (e) {
                    GM_log('Ошибка парсинга ответа DeepL: ' + e.message);
                    callback('');
                }
            },
            onerror: function() {
                GM_log('Ошибка запроса к DeepL API.');
                callback('');
            }
        });
    }

    // Функция для проверки, находится ли элемент в видимой части DOM
    function isElementVisible(element) {
        return element.offsetParent !== null;
    }

    // Функция для проверки Shadow DOM
    function hasShadowRoot(element) {
        return !!element.shadowRoot;
    }

    // Функция для добавления кнопки перевода
    function addTranslateButton(originalContainer, translatedContainer, buttonText, wrapper, apiKey, attempt = 1, maxAttempts = 3) {
        if (!originalContainer || !translatedContainer || !wrapper) {
            GM_log(`Контейнеры не найдены (попытка ${attempt}): original=${!!originalContainer}, translated=${!!translatedContainer}, wrapper=${!!wrapper}`);
            if (attempt < maxAttempts) {
                setTimeout(() => addTranslateButton(originalContainer, translatedContainer, buttonText, wrapper, apiKey, attempt + 1, maxAttempts), 500);
            }
            return;
        }

        // Проверяем наличие полей ввода
        let originalField = originalContainer.querySelector('textarea');
        let translatedField = translatedContainer.querySelector('textarea');
        let textContainer = originalContainer.querySelector('.text-container');

        if (!originalField || !translatedField || !textContainer) {
            GM_log(`Элементы не найдены (попытка ${attempt}): originalField=${!!originalField}, translatedField=${!!translatedField}, textContainer=${!!textContainer}`);
            if (attempt < maxAttempts) {
                setTimeout(() => addTranslateButton(originalContainer, translatedContainer, buttonText, wrapper, apiKey, attempt + 1, maxAttempts), 500);
            }
            return;
        }

        // Проверяем видимость text-container
        const isTextContainerVisible = isElementVisible(textContainer);
        GM_log(`text-container видим: ${isTextContainerVisible}`);

        // Проверяем наличие Shadow DOM
        GM_log(`Shadow DOM в text-container: ${hasShadowRoot(textContainer)}`);
        GM_log(`Shadow DOM в originalContainer: ${hasShadowRoot(originalContainer)}`);

        // Извлекаем языки из текущего wrapper
        let originalLangElement = wrapper.querySelector('.metadata-editor-original .language-header');
        let translatedLangElement = wrapper.querySelector('.metadata-editor-translated .language-header');
        if (!originalLangElement || !translatedLangElement) {
            GM_log(`Не удалось найти заголовки языков в wrapper (попытка ${attempt}).`);
            if (attempt < maxAttempts) {
                setTimeout(() => addTranslateButton(originalContainer, translatedContainer, buttonText, wrapper, apiKey, attempt + 1, maxAttempts), 500);
            }
            return;
        }

        // Проверяем видимость языковых элементов
        GM_log(`originalLangElement видим: ${isElementVisible(originalLangElement)}`);
        GM_log(`translatedLangElement видим: ${isElementVisible(translatedLangElement)}`);

        // Логируем все language-header в DOM
        const allLangHeaders = document.querySelectorAll('.language-header');
        GM_log(`Найдено ${allLangHeaders.length} элементов .language-header в DOM:`);
        allLangHeaders.forEach((header, index) => {
            GM_log(`language-header ${index + 1}: text="${header.textContent}", visible=${isElementVisible(header)}`);
        });

        // Удаляем старую кнопку
        const existingButton = textContainer.querySelector('.translate-button');
        if (existingButton) {
            GM_log(`Удаляем старую кнопку "${buttonText}"`);
            existingButton.remove();
        }

        // Создаем новую кнопку
        let button = document.createElement('button');
        button.textContent = buttonText;
        button.className = 'translate-button';
        button.style.marginTop = '10px';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#1a73e8';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
        button.style.position = 'relative';
        button.style.display = 'block';

        // Логируем CSS-свойства
        const computedStyle = window.getComputedStyle(textContainer);
        GM_log(`CSS text-container: display=${computedStyle.display}, visibility=${computedStyle.visibility}, position=${computedStyle.position}, zIndex=${computedStyle.zIndex}`);

        // Добавляем кнопку
        textContainer.appendChild(button);
        GM_log(`Добавлена кнопка "${buttonText}" (попытка ${attempt})`);

        // Проверяем видимость кнопки
        const isButtonVisible = isElementVisible(button);
        GM_log(`Кнопка "${buttonText}" видима: ${isButtonVisible}`);
        if (!isButtonVisible && attempt < maxAttempts) {
            GM_log(`Кнопка не видима, повторяем попытку ${attempt + 1}`);
            button.remove();
            setTimeout(() => addTranslateButton(originalContainer, translatedContainer, buttonText, wrapper, apiKey, attempt + 1, maxAttempts), 500);
            return;
        }

        // Функция для обновления перевода
        function performTranslation() {
            if (!apiKey) {
                alert('API-ключ не указан. Введите ключ в настройках скрипта.');
                return;
            }

            // Проверяем ключ перед переводом
            checkApiKey(apiKey, (isValid, message) => {
                if (!isValid) {
                    alert(message + ' Пожалуйста, введите новый API-ключ.');
                    GM_setValue('deepl_api_key', ''); // Сбрасываем ключ
                    let newKey = getApiKey();
                    if (newKey) {
                        checkApiKey(newKey, (newValid, newMessage) => {
                            if (newValid) {
                                performTranslation(); // Повторяем перевод с новым ключом
                            } else {
                                alert(newMessage);
                            }
                        });
                    }
                    return;
                }

                let sourceLang = getLanguageCode(originalLangElement.textContent);
                let targetLang = getLanguageCode(translatedLangElement.textContent);
                let text = originalField.value.trim();
                if (text) {
                    button.textContent = 'Перевод...';
                    button.disabled = true;

                    // Разбиваем текст на части
                    const parts = splitText(text);
                    GM_log(`Разбиение текста: main="${parts.main}", parentheses="${parts.parentheses}", brackets="${parts.brackets}"`);

                    // Переводим основную часть текста
                    translateText(parts.main, sourceLang, targetLang, apiKey, (translatedMain) => {
                        if (translatedMain) {
                            // Собираем переведенный текст
                            let translatedText = translatedMain;
                            if (parts.parentheses) {
                                translatedText += parts.parentheses;
                            }
                            if (parts.brackets) {
                                translatedText += parts.brackets;
                            }
                            translatedField.value = translatedText;
                            translatedField.dispatchEvent(new Event('input', { bubbles: true }));
                            GM_log(`Итоговый переведенный текст: "${translatedText}"`);
                        } else {
                            alert('Ошибка перевода. Проверьте лимиты API или соединение.');
                        }
                        button.textContent = buttonText;
                        button.disabled = false;
                    });
                } else {
                    alert('Введите текст для перевода!');
                    button.textContent = buttonText;
                    button.disabled = false;
                }
            });
        }

        // Обработчик клика на кнопку
        button.addEventListener('click', performTranslation);

        // Наблюдатель за изменением целевого языка
        let langObserver = new MutationObserver(() => {
            GM_log('Обнаружено изменение целевого языка.');
            button.textContent = buttonText;
            button.disabled = false;
        });

        langObserver.observe(translatedLangElement, { childList: true, characterData: true, subtree: true });
    }

    // Функция для инициализации
    function initialize() {
        if (isInitializing) {
            GM_log('Инициализация уже выполняется, пропускаем.');
            return;
        }
        isInitializing = true;

        // Получаем или запрашиваем API-ключ
        let apiKey = getApiKey();
        if (!apiKey) {
            isInitializing = false;
            return;
        }

        // Проверяем API-ключ
        checkApiKey(apiKey, (isValid, message) => {
            if (!isValid) {
                alert(message + ' Пожалуйста, введите новый API-ключ.');
                GM_setValue('deepl_api_key', '');
                apiKey = getApiKey();
                if (!apiKey) {
                    isInitializing = false;
                    return;
                }
            }

            // Удаляем все старые кнопки из DOM
            const oldButtons = document.querySelectorAll('.translate-button');
            oldButtons.forEach(button => {
                GM_log('Удаляем старую кнопку из DOM');
                button.remove();
            });

            // Находим последний metadata-editor-wrapper
            const wrappers = document.querySelectorAll('#metadata-editor-wrapper');
            const wrapper = wrappers[wrappers.length - 1];
            if (!wrapper) {
                GM_log('metadata-editor-wrapper не найден, ждем появления.');
                isInitializing = false;
                return;
            }

            // Проверяем количество metadata-editor-original
            const originalContainers = document.querySelectorAll('.metadata-editor-original.style-scope.ytgn-metadata-editor');
            GM_log(`Найдено ${originalContainers.length} элементов metadata-editor-original`);

            // Логируем все ytcp-form-textarea
            const textAreas = wrapper.querySelectorAll('ytcp-form-textarea');
            GM_log(`Найдено ${textAreas.length} элементов ytcp-form-textarea в metadata-editor-wrapper:`);
            textAreas.forEach((area, index) => {
                GM_log(`Элемент ${index + 1}: id=${area.id}, parent=${area.parentElement.className}`);
            });

            // Проверяем наличие контейнеров
            const originalTitle = wrapper.querySelector('.metadata-editor-original ytcp-form-textarea#original-title');
            const translatedTitle = wrapper.querySelector('.metadata-editor-translated ytcp-form-textarea#translated-title');
            const originalDesc = wrapper.querySelector('.metadata-editor-original ytcp-form-textarea#original-description');
            const translatedDesc = wrapper.querySelector('.metadata-editor-translated ytcp-form-textarea#translated-description');

            GM_log(`Проверка: original-title=${!!originalTitle}, translated-title=${!!translatedTitle}, original-description=${!!originalDesc}, translated-description=${!!translatedDesc}`);

            // Добавляем кнопки с задержкой
            setTimeout(() => {
                if (originalTitle && translatedTitle) {
                    addTranslateButton(originalTitle, translatedTitle, 'Перевести название', wrapper, apiKey);
                }
                if (originalDesc && translatedDesc) {
                    addTranslateButton(originalDesc, translatedDesc, 'Перевести описание', wrapper, apiKey);
                }
                isInitializing = false;
            }, 1000);
        });
    }

    // Наблюдатель за появлением или изменением metadata-editor-wrapper
    let domObserver = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && (node.id === 'metadata-editor-wrapper' || node.querySelector('#metadata-editor-wrapper'))) {
                        GM_log('Обнаружен metadata-editor-wrapper, запускаем инициализацию.');
                        initialize();
                        break;
                    }
                }
            }
            if (mutation.removedNodes.length) {
                for (let node of mutation.removedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && (node.id === 'metadata-editor-wrapper' || node.querySelector('#metadata-editor-wrapper'))) {
                        GM_log('metadata-editor-wrapper удален, ожидаем повторного появления.');
                        break;
                    }
                }
            }
        }
    });

    // Наблюдатель за изменениями в списке языков и кликами
    let listObserver = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.matches('ytgn-video-translation-row')) {
                        GM_log('Обнаружено добавление нового языка в ytgn-video-translations-list.');
                        initialize();
                        break;
                    }
                }
            }
        }
    });

    // Обработчик кликов на ячейки метаданных
    function handleMetadataClick(event) {
        if (event.target.closest('ytgn-video-translation-cell-metadata')) {
            GM_log('Обнаружен клик на ytgn-video-translation-cell-metadata, запускаем инициализацию.');
            initialize();
        }
    }

    // Запускаем наблюдатели и обработчик кликов
    document.addEventListener('click', handleMetadataClick);
    domObserver.observe(document.body, { childList: true, subtree: true });
    const translationsList = document.querySelector('tbody.style-scope.ytgn-video-translations-list');
    if (translationsList) {
        listObserver.observe(translationsList, { childList: true, subtree: true });
    }

    // Проверяем сразу, если страница уже загружена
    window.addEventListener('load', () => {
        initialize();
        const translationsList = document.querySelector('tbody.style-scope.ytgn-video-translations-list');
        if (translationsList) {
            listObserver.observe(translationsList, { childList: true, subtree: true });
        }
    });
})();