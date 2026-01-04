// ==UserScript==
// @name         F95Zone Enhanced Page Loader
// @version      0.1
// @description  Раскрывает спойлеры, загружает изображения, нажимает "загрузить еще", проходит страницы-маски и ОЧИЩАЕТ ЗАГОЛОВОК, добавляя в него инфо-список
// @match        https://f95zone.to/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/554744/F95Zone%20Enhanced%20Page%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/554744/F95Zone%20Enhanced%20Page%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict'; // Включаем "строгий режим" JavaScript.

    /**
     * Вспомогательная функция для вывода сообщений в консоль разработчика (F12).
     * @param {string} message - Сообщение для вывода.
     */
    const log = (message) => console.log(`[F95Zone Loader] ${message}`);

    // --- Глобальные переменные для управления заголовком ---
    // Переменная для хранения оригинального "чистого" заголовка
    let originalBaseTitle = null;
    // Переменная для хранения последнего заголовка, который МЫ установили
    let lastSetTitle = null;

    // --- ФУНКЦИЯ ДЛЯ СТРАНИЦЫ-МАСКИ ---
    /**
     * Ищет и нажимает на ссылку "Продолжить" (a.host_link) на страницах-масках.
     * @returns {boolean} - true, если ссылка была найдена и нажата, иначе false.
     */
    function clickContinueLink() {
        // Ищем ссылку по классу 'host_link'
        const continueLink = document.querySelector('a.host_link');

        if (continueLink) {
            log('Страница-маска обнаружена. Нажимаем "Продолжить"...');
            // Немедленно нажимаем на ссылку
            continueLink.click();
            return true;
        }
        return false;
    }

    // --- ГЛАВНАЯ ФУНКЦИЯ-ОРКЕСТРАТОР (ДЛЯ СТРАНИЦ ТЕМ) ---
    /**
     * Эта функция является центральной точкой управления. Она вызывает все остальные
     * функции в правильном порядке для полной обработки страницы.
     */
    function processPageElements() {
        log('Запуск комплексной обработки элементов...');
        expandSpoilers();      // Сначала раскрываем спойлеры, чтобы сделать изображения видимыми.
        loadLazyImages();      // Затем загружаем все "ленивые" изображения.
        clickLoadMoreButton(); // Ищем кнопку "загрузить еще".
        cleanPageTitle();      // Обновляем заголовок (на случай, если теги загрузились динамически).
    }

    // --- ФУНКЦИЯ ДЛЯ РАСКРЫТИЯ СПОЙЛЕРОВ ---
    /**
     * Находит на странице все скрытые спойлеры и программно нажимает на них,
     * чтобы показать их содержимое.
     */
    function expandSpoilers() {
        // Ищем все элементы с классом '.bbCodeSpoiler-button', которые еще не были нами обработаны.
        const spoilerButtons = document.querySelectorAll('.bbCodeSpoiler-button:not([data-processed="true"])');

        if (spoilerButtons.length > 0) {
            log(`Найдено ${spoilerButtons.length} новых спойлеров для раскрытия.`);
            spoilerButtons.forEach(button => {
                button.click(); // Имитируем клик мышью по кнопке спойлера.
                button.setAttribute('data-processed', 'true');
            });
        }
    }

    // --- ФУНКЦИЯ ДЛЯ ЗАГРУЗКИ "ЛЕНИВЫХ" ИЗОБРАЖЕНИЙ ---
    /**
     * Находит все изображения, которые используют механизм "ленивой загрузки" (lazy loading),
     * и заставляет их загрузиться немедленно.
     */
    function loadLazyImages() {
        // Ищем все теги <img> с классом 'lazyload', которые еще не были нами обработаны.
        const lazyImages = document.querySelectorAll('img.lazyload:not([data-processed="true"])');

        if (lazyImages.length > 0) {
            log(`Найдено ${lazyImages.length} "ленивых" изображений для загрузки.`);
            lazyImages.forEach(img => {
                const dataSrc = img.getAttribute('data-src');

                // Проверяем, что 'data-src' существует и что он еще не присвоен в 'src'.
                if (dataSrc && img.src !== dataSrc) {
                    img.src = dataSrc;
                    img.classList.remove('lazyload');
                }
                img.setAttribute('data-processed', 'true');
            });
        }
    }

    // --- ФУНКЦИЯ ДЛЯ НАЖАТИЯ КНОПКИ "ЗАГРУЗИТЬ ЕЩЕ" ---
    /**
     * Ищет и нажимает на ссылки/кнопки, которые динамически подгружают
     * дополнительный контент на страницу (например, старые комментарии).
     */
    function clickLoadMoreButton() {
        // Ищем ссылку с классом 'js-loadMore'.
        const loadMoreLink = document.querySelector('a.js-loadMore:not([data-processed="true"])');

        if (loadMoreLink) {
            log('Найдена кнопка "загрузить еще", нажимаем...');
            loadMoreLink.click();
            loadMoreLink.setAttribute('data-processed', 'true');
        }
    }

    /**
     * ФУНКЦИЯ: Собирает текст из элементов списка 'listInline--bullet' в одну строку.
     * @returns {string} - Отформатированная строка (например, "Item 1, Item 2") или пустая строка.
     */
    function getListItemsAsText() {
        // Ищем НЕ <li>, а сразу <a class="tagItem"> (ссылки тегов)
        // которые находятся внутри списков с нужными классами.
        // Это предотвращает попадание "Автор темы" и "Дата начала" в список.
        const listItems = document.querySelectorAll('.listInline.listInline--bullet a.tagItem');

        if (listItems.length > 0) {
            const texts = Array.from(listItems).map(item => {
                // .textContent.trim() - получаем текст и убираем лишние пробелы по краям
                return item.textContent.trim();
            });
            // Соединяем все найденные теги в одну строку через запятую и пробел.
            return texts.join(', ');
        }
        return ""; // Возвращаем пустую строку, если ничего не найдено.
    }


    /**
     * ФУНКЦИЯ: Очищает заголовок, добавляя в него информацию из списков.
     * Предотвращает бесконечный цикл, используя 'originalBaseTitle'.
     * @returns {boolean} - true, если заголовок был изменен, иначе false.
     */
    function cleanPageTitle() {
        const titleElement = document.querySelector('title');
        if (!titleElement) return false;

        const currentTitle = titleElement.textContent;

        // --- 1. Находим "чистый" базовый заголовок (только один раз) ---
        // Если мы еще не сохраняли базовый заголовок, делаем это.
        if (originalBaseTitle === null) {
            originalBaseTitle = currentTitle; // По умолчанию, базовый - это текущий

            // Ищем разделитель в *текущем* (который = оригинальному) заголовке
            let separatorIndex = currentTitle.indexOf(" | F95zone");
            if (separatorIndex === -1) separatorIndex = currentTitle.indexOf("| F95zone");
            if (separatorIndex === -1) separatorIndex = currentTitle.indexOf(" _ F95zone"); // с неразрывным пробелом
            if (separatorIndex === -1) separatorIndex = currentTitle.indexOf(" _ F95zone"); // с обычным пробелом

            // Если нашли разделитель, отсекаем суффикс и сохраняем.
            if (separatorIndex !== -1) {
                originalBaseTitle = currentTitle.substring(0, separatorIndex);
            }
        }

        // --- 2. Получаем текст из списков ---
        const listItemsText = getListItemsAsText();

        // --- 3. Собираем новый заголовок ---
        // Всегда строим заголовок на основе *оригинального* базового
        let newTitle = originalBaseTitle;
        if (listItemsText) {
            // Если текст из списков найден, добавляем его БЕЗ ДЕФИСА
            newTitle = `${originalBaseTitle} ${listItemsText}`;
        }

        // --- 4. Обновляем заголовок, если он отличается от текущего ---
        if (newTitle !== currentTitle) {
            document.title = newTitle; // Установка document.title изменит titleElement.textContent
            lastSetTitle = newTitle; // Сохраняем то, что мы установили
            log(`Заголовок страницы обновлен: "${newTitle}"`);
            return true;
        }

        // Если заголовок уже правильный, просто обновляем lastSetTitle
        lastSetTitle = newTitle;
        return false;
    }

    /**
     * Наблюдатель за основным контентом (новые посты и т.д.).
     */
    const contentObserver = new MutationObserver((mutationsList) => {
        // Эта функция будет вызываться каждый раз, когда на странице что-то меняется.
        for (const mutation of mutationsList) {
            // Нас интересуют только те изменения, где были добавлены новые элементы (узлы).
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // "Debounce": используем задержку, чтобы не запускать функцию 100 раз в секунду
                // во время активной подгрузки.
                clearTimeout(contentObserver.debounce);
                contentObserver.debounce = setTimeout(() => {
                    log('Обнаружен новый контент на странице, запускаем повторную обработку...');
                    processPageElements();
                }, 500);
                return; // Выходим из цикла, т.к. мы уже установили таймер.
            }
        }
    });

    /**
     * Наблюдатель специально для заголовка <title>.
     * Предотвращает бесконечный цикл, сравнивая с 'lastSetTitle'.
     */
    const titleObserver = new MutationObserver(() => {
        const currentTitle = document.title;

        // ЕСЛИ (мы уже устанавливали заголовок) И (текущий заголовок НЕ равен тому, что мы установили)
        // Это значит, что-то *другое* (другой скрипт) изменило заголовок.
        if (lastSetTitle && currentTitle !== lastSetTitle) {
            log('Обнаружено стороннее изменение заголовка. Восстанавливаем...');
            // Перезапускаем нашу функцию, чтобы она все исправила.
            cleanPageTitle();
        }
    });

    // --- ЗАПУСК СКРИПTA ---
    log('Скрипт F95Zone Enhanced Loader v3.2 инициализирован.');

    /**
     * Функция для первоначального сканирования страницы после ее полной загрузки.
     */
    const runInitialScan = () => {
        // 1. Сначала пытаемся нажать "Продолжить" (для страниц-масок)
        const clickedContinue = clickContinueLink();

        // 2. Если это НЕ была страница-маска, проверяем, не страница ли это темы
        if (!clickedContinue && window.location.href.includes('/threads/')) {
            log('Страница темы обнаружена. Запускаем полный набор функций.');

            // Запускаем первую проверку элементов
            processPageElements();

            // Активируем наблюдателя за контентом
            contentObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Активируем наблюдателя за заголовком
            const titleElement = document.querySelector('title');
            if (titleElement) {
                titleObserver.observe(titleElement, {
                    childList: true
                });
            }
        } else if (!clickedContinue) {
            log('Это не страница темы и не страница-маска. Скрипт в режиме ожидания.');
        }
    };

    // Ждем, пока вся страница (включая скрипты) полностью загрузится.
    if (document.readyState === 'complete') {
        runInitialScan();
    } else {
        window.addEventListener('load', runInitialScan, { once: true });
    }

})();