// ==UserScript==
// @name         Boosty Отписка (API)
// @version      0.16
// @description  Добавляет кнопку 'Отписаться' в один клик, использующую официальный API Boosty (Bearer Token).
// @match        https://boosty.to/*
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/553906/Boosty%20%D0%9E%D1%82%D0%BF%D0%B8%D1%81%D0%BA%D0%B0%20%28API%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553906/Boosty%20%D0%9E%D1%82%D0%BF%D0%B8%D1%81%D0%BA%D0%B0%20%28API%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- КАТЕГОРИЯ: ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И НАСТРОЙКИ ---
    // Этот раздел содержит глобальные переменные, используемые скриптом.
    // - observer: Экземпляр MutationObserver для отслеживания изменений DOM (например, при загрузке контента или SPA-переходах).
    //           Используется для повторного поиска места для вставки кнопки.
    let observer = null;

    // Объект с текстами для локализации (RU/EN)
    const TEXTS = {
        unsubscribe: {
            ru: 'Отписаться',
            en: 'Unsubscribe'
        },
        loading: {
            ru: 'Отписка...',
            en: 'Unsubscribing...'
        },
        success: {
            ru: 'Отписан!',
            en: 'Unsubscribed!'
        },
        error: {
            ru: 'Ошибка!',
            en: 'Error!'
        }
    };

    // --- КАТЕГОРИЯ: СТИЛИЗАЦИЯ ---
    // Этот раздел определяет внешний вид кнопки "Отписаться" и ее состояний (обычное, наведение, загрузка, ошибка).
    // Стили подобраны для максимального соответствия интерфейсу Boosty.
    const styles = `
        .unsubscribe-button {
            /* Базовые стили кнопки, включая шрифт, отступы, скругление, цвет */
            font-family: Inter, Arial, sans-serif;
            font-weight: 600;
            font-size: 14px;
            line-height: 20px;
            padding: 9px 20px;
            border-radius: 8px;
            text-transform: uppercase;
            cursor: pointer;
            border: none;
            text-decoration: none;
            display: inline-flex; /* Для выравнивания иконки и текста */
            align-items: center;
            justify-content: center;
            transition: background-color .2s, color .2s, border-color .2s, box-shadow .2s; /* Плавные переходы */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Тень кнопки */
            color: #ffffff; /* Белый цвет текста */
            background-color: #f15f2c; /* Оранжевый цвет фона Boosty */

            /* Растягивание кнопки */
            width: 100%; /* Занимает всю доступную ширину */
            flex-grow: 0; /* Отменяет растягивание через flex, если оно было у родителя */
            margin-left: 0; /* Убирает левый отступ при растягивании */
        }
        .unsubscribe-button:hover {
            /* Стиль при наведении курсора */
            background-color: #c45424; /* Более темный оранжевый */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Тень остается прежней */
        }
        /* Стиль во время выполнения запроса */
        .unsubscribe-button.loading {
            background-color: #ccc; /* Серый фон */
            color: #666; /* Серый текст */
            cursor: wait; /* Курсор ожидания */
            box-shadow: none; /* Убираем тень */
        }
        /* Стиль при ошибке */
        .unsubscribe-button.error {
            background-color: #e74c3c; /* Красный фон */
            color: white; /* Белый текст */
            box-shadow: none; /* Убираем тень */
        }
        /* Стили для SVG иконки внутри кнопки */
        .unsubscribe-button .icon-unsubscribe {
            margin-right: 0.5rem; /* Отступ справа от иконки */
            width: 1em; /* Ширина иконки относительно шрифта */
            height: 1em; /* Высота иконки относительно шрифта */
            fill: currentColor; /* Цвет иконки как у текста */
            vertical-align: -0.125em; /* Небольшая корректировка вертикального выравнивания */
        }
    `;

    // --- КАТЕГОРИЯ: ЛОГГИРОВАНИЕ ---
    // Функция для вывода сообщений в консоль разработчика с временной меткой и типом сообщения.
    // - message: Текст сообщения для вывода.
    // - type: Тип сообщения ('info', 'success', 'warn', 'error', 'api').
    function log(message, type = 'info') {
        const logEntry = `[${new Date().toLocaleTimeString()}] [${type.toUpperCase()}] ${message}`;
        console.log(logEntry);
    }

    // --- КАТЕГОРИЯ: ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
    // Этот раздел содержит функции, выполняющие вспомогательные задачи.

    // Функция getAuthorSlugFromUrl:
    // Извлекает уникальный идентификатор (slug) автора блога из текущего URL страницы.
    // Учитывает разные форматы URL (прямой slug, с префиксом языка /en/, страницы постов).
    // Возвращает строку slug или null, если определить не удалось.
    function getAuthorSlugFromUrl() {
        const pathParts = window.location.pathname.split('/');
        const ignoredSegments = ['app', 'en', 'settings', 'dev', 'messages', 'feed', 'subscribers', 'income']; // Сегменты URL, не являющиеся slug'ами

        // Проверка паттерна /authorname/...
        if (pathParts.length >= 2 && pathParts[1] && !ignoredSegments.includes(pathParts[1])) {
             // Обработка /authorname/posts/postid
             if (pathParts.length >= 4 && pathParts[2] === 'posts') return pathParts[1];
             // Обработка /authorname (без /posts/)
             if (pathParts.length < 4 || pathParts[2] !== 'posts') return pathParts[1];
        }
        // Проверка паттерна /en/authorname/...
        if (pathParts.length >= 3 && ['en'].includes(pathParts[1]) && pathParts[2] && !ignoredSegments.includes(pathParts[2])) {
         // Обработка /en/authorname/posts/postid
             if (pathParts.length >= 5 && pathParts[3] === 'posts') return pathParts[2];
             // Обработка /en/authorname (без /posts/)
             if (pathParts.length < 5 || pathParts[3] !== 'posts') return pathParts[2];
        }

        log('Could not determine author slug from current URL.', 'warn');
        return null;
    }

    // Функция getAccessToken:
    // Извлекает токен доступа ('accessToken') пользователя из localStorage.
    // Необходим для аутентификации API-запросов.
    // Выбрасывает ошибку, если данные авторизации не найдены или имеют неверный формат.
    // Возвращает строку токена.
    function getAccessToken() {
        log('Attempting to retrieve accessToken from localStorage...', 'info');
        const authDataString = localStorage.getItem('auth'); // Получаем данные авторизации
        if (!authDataString) {
            throw new Error('Could not find "auth" data in localStorage. Ensure you are logged in.');
        }
        try {
            const authData = JSON.parse(authDataString); // Парсим JSON
            const accessToken = authData.accessToken; // Извлекаем токен
            if (!accessToken) {
                throw new Error('Could not extract "accessToken" from localStorage "auth" data. Structure might have changed.');
            }
            log('AccessToken retrieved successfully.', 'success');
            return accessToken;
        } catch (e) {
            // Обработка ошибок парсинга
            throw new Error(`Error parsing "auth" data from localStorage: ${e.message}`);
        }
    }

    // Функция getTextForLang:
    // Определяет язык страницы (ru/en) и возвращает соответствующий текст из объекта TEXTS.
    // Самый надежный метод: проверяет текст *самого* элемента,
    // к которому привязывается кнопка.
    // - key: Ключ текста ('unsubscribe', 'loading', 'success', 'error').
    // - targetElement: Элемент [data-test-id="SUBSCRIPTION_STATUS:Active"]
    // Возвращает строку.
    function getTextForLang(key, targetElement) {
        let lang = 'ru'; // По умолчанию русский

        try {
            if (targetElement && targetElement.textContent.includes('My subscription level')) {
                lang = 'en';
            }
        } catch (e) {
            log('Could not detect lang from target element, defaulting to ru.', 'warn');
        }

        // Возвращаем текст для определенного языка, или 'ru' как запасной
        return TEXTS[key][lang] || TEXTS[key]['ru'];
    }

    // --- КАТЕГОРИЯ: ОСНОВНАЯ ЛОГИКА ---
    // Функция startUnsubscribeProcess:
    // Асинхронно выполняет процесс отписки через API Boosty.
    // - button: DOM-элемент кнопки, инициировавшей процесс (для обновления ее состояния).
    // 1. Устанавливает состояние загрузки для кнопки.
    // 2. Получает slug автора и токен доступа.
    // 3. Формирует и отправляет POST-запрос к API Boosty.
    // 4. Обрабатывает ответ: при успехе перезагружает страницу, при ошибке показывает сообщение на кнопке.
    // 5. Обрабатывает исключения (ошибки сети, ошибки получения токена/slug'а).
    async function startUnsubscribeProcess(button) {
        log('Initiating unsubscribe process...', 'info');

        // Получаем язык из родительского элемента, т.к. сам 'button' может еще не иметь 'myLevelBlock'
        const myLevelBlock = document.querySelector('[data-test-id="SUBSCRIPTION_STATUS:Active"]');

        // Установка состояния загрузки
        button.classList.add('loading');
        button.disabled = true;
        const originalHTML = button.innerHTML; // Сохраняем исходное содержимое кнопки
        button.innerHTML = getTextForLang('loading', myLevelBlock); // Текст во время загрузки (EN/RU)

        try {
            // Получение необходимых данных
            const authorSlug = getAuthorSlugFromUrl();
            if (!authorSlug) {
                throw new Error('Could not get author slug for the API request.');
            }
            log(`Author slug identified: ${authorSlug}`, 'info');

            const accessToken = getAccessToken(); // Получаем токен
            const apiUrl = `https://api.boosty.to/v1/blog/${authorSlug}/unsubscribe`; // URL API
            const apiBody = 'keep_follow=true'; // Параметр API (остаться наблюдателем)

            log(`Sending POST request to ${apiUrl}`, 'api');

            // Отправка запроса
            const response = await fetch(apiUrl, {
                method: 'POST',
                credentials: 'include', // Важно для отправки cookies (включая HttpOnly)
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Authorization': `Bearer ${accessToken}` // Заголовок авторизации с токеном
                },
                body: apiBody
            });

            // Обработка ответа
            if (response.ok) {
                // Успешная отписка
                log('SUCCESS! Unsubscribed successfully.', 'success');
                button.textContent = getTextForLang('success', myLevelBlock); // Текст при успехе (EN/RU)
                if (observer) {
                    observer.disconnect(); // Останавливаем наблюдение за DOM
                    log('Observer stopped.', 'info');
                }
                window.location.reload(); // Перезагрузка страницы для обновления интерфейса Boosty
            } else {
                // Ошибка API
                const errorText = await response.text();
                throw new Error(`API Error: ${response.status} ${response.statusText}. Response: ${errorText}`);
            }

        } catch (error) {
            // Обработка любых ошибок в процессе
            log(error.message, 'error');
            button.classList.remove('loading');
            button.classList.add('error');
            button.disabled = false;
            // Восстановление кнопки с сообщением об ошибке
             button.innerHTML = `
                 <span class="icon-unsubscribe">
                     <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                         <path d="M19 13H5v-2h14v2Z"/>
                     </svg>
                 </span>
                 <span>${getTextForLang('error', myLevelBlock)}</span>
             `;
             // Сброс состояния ошибки через 3 секунды
            setTimeout(() => {
                if(button.classList.contains('error')) {
                    button.classList.remove('error');
                    button.innerHTML = originalHTML; // Возвращаем исходное содержимое
                }
            }, 3000);
        }
    }


    // --- КАТЕГОРИЯ: РАБОТА С DOM ---
    // Функция addUnsubscribeButton:
    // Вызывается при каждом изменении DOM.
    // 1. Проверяет, не находимся ли мы на страницах, где кнопка не нужна.
    // 2. Ищет место для кнопки (`myLevelBlock`).
    // 3. Ищет существующую кнопку (`existingButton`).
    // 4. Если МЕСТО ЕСТЬ:
    //    - Получает правильный текст, основываясь на тексте `myLevelBlock`.
    //    - Если КНОПКА ЕСТЬ: Сравнивает текст. Если не совпадает - ОБНОВЛЯЕТ ТЕКСТ.
    //    - Если КНОПКИ НЕТ: СОЗДАЕТ кнопку.
    // 5. Если МЕСТА НЕТ:
    //    - Если КНОПКА ЕСТЬ (осталась от прошлой страницы): УДАЛЯЕТ кнопку.
    function addUnsubscribeButton() {
        // Страницы, где кнопка не нужна
        const nonBlogPages = ['/settings', '/dev', '/app/messages', '/feed', '/subscribers', 'income'];
        if (nonBlogPages.some(page => window.location.pathname.startsWith(page))) {
            return;
        }

        const existingButton = document.getElementById('unsubscribe-button');

        // Ищем блок "Мой уровень подписки" (теперь по data-test-id, что не зависит от языка)
        const myLevelBlock = document.querySelector('[data-test-id="SUBSCRIPTION_STATUS:Active"]');

        if (myLevelBlock) {
            // --- МЕСТО ДЛЯ КНОПКИ НАЙДЕНО ---

            // Проверка на наличие кнопки "Возобновить"
            const parentContainer = myLevelBlock.closest('[data-test-id="SUBSCRIPTION_LEVEL:Root"]');
            if (parentContainer && parentContainer.querySelector('[data-test-id="ACTIVE_TO_BLOCK:Resubscribe"]')) {
                log('Found "Resubscribe" button. Unsubscribe button will not be added.', 'info');
                // Если кнопка "Возобновить" есть, а наша кнопка все еще висит, удаляем ее
                if (existingButton) {
                    existingButton.remove();
                }
                return; // Не добавляем кнопку, если есть "Возобновить"
            }

            const container = myLevelBlock.closest('[data-test-id="SUBSCRIPTION_STATUS:Root"]');
            // Получаем ПРАВИЛЬНЫЙ текст, передавая сам элемент
            const currentLangText = getTextForLang('unsubscribe', myLevelBlock);

            if (existingButton) {
                // Кнопка уже есть. Просто проверим и обновим текст, если он не совпадает.
                const buttonSpan = existingButton.querySelector('span:last-child');
                if (buttonSpan && buttonSpan.textContent !== currentLangText) {
                    log('Language change detected. Updating button text.', 'info');
                    buttonSpan.textContent = currentLangText;
                }
                // Убедимся, что кнопка в правильном контейнере (на всякий случай)
                if (existingButton.parentElement !== container) {
                    myLevelBlock.insertAdjacentElement('afterend', existingButton);
                }
                return; // Больше ничего делать не надо
            }

            // Кнопки нет, создаем ее
            log('Found "My subscription level" block. Creating button.', 'info');

            // Создаем новую кнопку
            const unsubButton = document.createElement('button');
            unsubButton.type = 'button';
            unsubButton.id = 'unsubscribe-button';
            unsubButton.className = 'unsubscribe-button';
            // Добавляем иконку и текст (EN/RU)
            unsubButton.innerHTML = `
                <span class="icon-unsubscribe">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 13H5v-2h14v2Z"/>
                    </svg>
                </span>
                <span>${currentLangText}</span>
            `;
            unsubButton.onclick = () => startUnsubscribeProcess(unsubButton); // Назначаем действие

            // Вставляем кнопку после блока с текстом
            myLevelBlock.insertAdjacentElement('afterend', unsubButton);

             // Применяем flex-стили к контейнеру для выравнивания
            if (container) {
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.gap = '10px'; // Отступ между текстом и кнопкой
            }

            log('Unsubscribe button (API) added successfully.', 'success');

        } else {
            // --- МЕСТО ДЛЯ КНОПКИ НЕ НАЙДЕНО ---

            // Если место не найдено, а кнопка все еще висит, удаляем ее.
            if (existingButton) {
                log('Button location no longer exists (e.g., navigation or unsubscription). Removing button.', 'info');
                existingButton.remove();
            }
        }
    }

    // --- КАТЕГОРИЯ: ИНИЦИАЛИЗАЦИЯ И НАБЛЮДЕНИЕ ---

    // Функция init:
    // Выполняет первоначальную настройку скрипта.
    // 1. Внедряет CSS-стили кнопки в <head> документа.
    // 2. Отключает предыдущий экземпляр MutationObserver, если он существует.
    // 3. Создает и запускает новый MutationObserver для отслеживания изменений в DOM.
    //    При изменениях вызывает `addUnsubscribeButton`, чтобы добавить/обновить/удалить кнопку.
    // 4. Вызывает `addUnsubscribeButton` через небольшую задержку для первоначальной попытки.
    function init() {
        // Внедрение стилей
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
        log('Custom styles injected.', 'info');

        // Остановка предыдущего наблюдателя
        if (observer) {
            observer.disconnect();
        }

        // Создание и запуск нового наблюдателя
        observer = new MutationObserver((mutations) => {
            // Эта функция теперь обрабатывает все:
            // создание, обновление языка и удаление.
            addUnsubscribeButton();
        });

        // Наблюдаем за 'body', а не 'documentElement'.
        // Нам не нужны 'attributes', так как мы смотрим на 'textContent',
        // который покрывается 'childList' и 'subtree'.
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Первоначальная попытка добавить кнопку после загрузки скрипта
        setTimeout(addUnsubscribeButton, 500); // Небольшая задержка для рендеринга страницы
    }


    // --- КАТЕГОРИЯ: ТОЧКА ВХОДА СКРИПТА ---
    // Определяет, когда запускать функцию `init`.
    // Если DOM еще загружается, ждет события 'DOMContentLoaded'.
    // Если DOM уже загружен, запускает `init` немедленно.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init(); // Запустить сразу, если DOM уже готов
    }

})();