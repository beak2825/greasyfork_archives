// ==UserScript==
// @name         Мои подписки: добавление скроллбар поведения
// @version      0.2
// @description  Добавляет скроллбар, автоскролл (СКМ) и убирает "длинные" ссылки в блоке "Мои подписки"
// @match        https://boosty.to/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/553908/%D0%9C%D0%BE%D0%B8%20%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%BA%D0%B8%3A%20%D0%B4%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D0%BA%D1%80%D0%BE%D0%BB%D0%BB%D0%B1%D0%B0%D1%80%20%D0%BF%D0%BE%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/553908/%D0%9C%D0%BE%D0%B8%20%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%BA%D0%B8%3A%20%D0%B4%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D0%BA%D1%80%D0%BE%D0%BB%D0%BB%D0%B1%D0%B0%D1%80%20%D0%BF%D0%BE%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- КАТЕГОРИЯ: КОНСТАНТЫ И СЕЛЕКТОРЫ ---
    // Этот раздел содержит все константы, используемые для поиска
    // необходимых DOM-элементов на странице.
    // Мы определяем селекторы для ОБОИХ блоков (правого и левого).
    //
    // --- Общие префиксы классов (используются для обхода динамических хэшей в именах классов) ---
    // - scrollableClassPrefix: Префикс класса для прокручиваемого контейнера.
    // - listClassPrefix: Префикс класса для *конкретного* списка подписок (из выпадающего меню).
    // - rightPanelClassPrefix: Префикс класса для контейнера правой панели.
    // - linkClassPrefix: Префикс класса для ссылок подписок.
    // - avatarClassPrefix: Префикс класса для аватаров.
    // - infoClassPrefix: Префикс класса для блока с информацией (имя, скидка).
    // - nameClassPrefix: Префикс класса для имени (span).
    // - discountClassPrefix: Префикс класса для блока скидки.
    //
    // --- Cелекторы для правой панели ---
    // - columnId: Стабильный ID колонки, в которой находится правый блок.
    // - targetSelectorRightCSS: Полный CSS-селектор для `GM_addStyle` (правая панель).
    // - jsTargetSelectorRight: Альтернативный, более надежный селектор для `document.querySelector` (правая панель).
    //
    // --- Cелекторы для левого выпадающего списка ---
    // - targetSelectorLeftCSS: Полный CSS-селектор для `GM_addStyle` (левый список).
    // - jsTargetSelectorLeft: Альтернативный, более надежный селектор для `document.querySelector` (левый список).
    //
    // --- Общие селекторы для вложенных элементов ---
    // - linkSelector: CSS-селектор для ссылок внутри блока.
    // - avatarSelector: CSS-селектор для аватаров.
    // - infoSelector: CSS-селектор для блока информации.
    // - nameSelector: CSS-селектор для имени.
    // - discountSelector: CSS-селектор для скидки.

    // --- Общие префиксы классов ---
    const scrollableClassPrefix = 'ScrollableComponent-scss--module_root_';
    const listClassPrefix = 'Subscriptions-scss--module_list_'; // Для левого списка
    const rightPanelClassPrefix = 'MainFeed-scss--module_subscriptions_'; // Для правой панели
    const linkClassPrefix = 'SubscriptionsMenu-scss--module_subscription_';
    const avatarClassPrefix = 'Avatar-scss--module_root_';
    const infoClassPrefix = 'SubscriptionsMenu-scss--module_info_';
    const nameClassPrefix = 'SubscriptionsMenu-scss--module_name_';
    const discountClassPrefix = 'SubscriptionsMenu-scss--module_discount_';

    // --- Селекторы для правой панели ---
    const columnId = 'column-2';
    const targetSelectorRightCSS = `#${columnId} div[class*="${scrollableClassPrefix}"][class*="${rightPanelClassPrefix}"]`;
    const jsTargetSelectorRight = `#${columnId} div[class*="ScrollableComponent"][class*="MainFeed-scss--module_subscriptions"]`;

    // --- Селекторы для левого выпадающего списка ---
    const targetSelectorLeftCSS = `div[class*="${scrollableClassPrefix}"][class*="${listClassPrefix}"]`;
    const jsTargetSelectorLeft = `div[class*="ScrollableComponent"][class*="Subscriptions-scss--module_list_"]`;

    // --- Общие селекторы для CSS (для вложенных элементов) ---
    // Они будут применяться внутри обоих родительских блоков
    const linkSelector = `a[class*="${linkClassPrefix}"]`;
    const avatarSelector = `div[class*="${avatarClassPrefix}"]`;
    const infoSelector = `div[class*="${infoClassPrefix}"]`;
    const nameSelector = `span[class*="${nameClassPrefix}"]`;
    const discountSelector = `div[class*="${discountClassPrefix}"]`;

    // --- КАТЕГОРИЯ: НАСТРОЙКИ АВТОСКРОЛЛА ---
    // Этот раздел содержит параметры, управляющие поведением
    // автоматической прокрутки при нажатии средней кнопки мыши (СКМ).
    // - deadZone: "Мертвая зона" в пикселях. Если курсор сместился меньше этого значения, прокрутка не начнется.
    // - speedFactor: Множитель скорости. Влияет на итоговую скорость прокрутки.
    // - acceleration: Степень ускорения (pow). Значение 2.0 означает квадратичную кривую ускорения.
    const deadZone = 15;     // 15px "мертвая зона" (скролл не начнется)
    const speedFactor = 300;
    const acceleration = 2.0; // Степень ускорения (квадратичная кривая)
    // -------------------


    // --- КАТЕГОРИЯ: ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ (СОСТОЯНИЕ АВТОСКРОЛЛА) ---
    // Этот раздел содержит переменные, которые отслеживают текущее состояние
    // режима автопрокрутки. Они изменяются в ходе выполнения скрипта.
    // - isAutoScrolling: Флаг (boolean), указывающий, активен ли в данный момент режим автоскролла.
    // - anchorY: "Якорь" (число). Позиция курсора по оси Y в момент нажатия СКМ.
    // - scrollElem: DOM-элемент, который в данный момент прокручивается.
    // - animationFrameId: Идентификатор таймера `requestAnimationFrame` для цикла прокрутки. Используется для его отмены.
    // - currentMouseY: Текущая позиция курсора по оси Y. Обновляется при 'mousemove'.
    let isAutoScrolling = false;
    let anchorY = 0;
    let scrollElem = null;
    let animationFrameId = null;
    let currentMouseY = 0;

    // --- КАТЕГОРИЯ: ВНЕДРЕНИЕ СТИЛЕЙ (GM_addStyle) ---
    // Этот раздел использует функцию @grant `GM_addStyle` для динамического
    // добавления CSS на страницу. Стили отвечают за:
    // 1. Отображение принудительного скроллбара у ОБЕИХ панелей.
    // 2. Корректировку `pointer-events` для вложенных элементов.
    // 3. Утолщение и стилизацию самого скроллбара.
    // 4. Визуальную обратную связь (курсор `all-scroll`) при активном автоскролле.
    //
    // Стили применяются ОТДЕЛЬНО к каждому блоку,
    // чтобы избежать ошибок с CSS-комбинаторами (>, ::-webkit-scrollbar)
    // при группировке селекторов.

    GM_addStyle(`
        /* --- СТИЛИ ДЛЯ ПРАВОЙ ПАНЕЛИ --- */

        /* 1. Сам блок-контейнер: */
        ${targetSelectorRightCSS} {
            max-height: 90vh; /* Высота для скролла */
            overflow-y: auto !important; /* Принудительный скроллбар */
            pointer-events: auto !important;
            /* Фон нужен, чтобы 'pointer-events: auto' было на что ловить клик */
            background-color: var(--substrate_color, #ffffff);
        }

        /* 2. Ссылки внутри: (Бэкап-фикс) */
        ${targetSelectorRightCSS} > ${linkSelector} {
            pointer-events: none !important;
        }

        /* 3. Контент - АВАТАР: */
        ${targetSelectorRightCSS} > ${linkSelector} ${avatarSelector} {
            pointer-events: auto !important;
        }

        /* 4. Контент - КОНТЕЙНЕР ТЕКСТА: */
        ${targetSelectorRightCSS} > ${linkSelector} ${infoSelector} {
            display: inline-block !important;
            vertical-align: middle;
        }

        /* 5. Контент - ТЕКСТ (внутри): */
        ${targetSelectorRightCSS} > ${linkSelector} ${nameSelector} {
            pointer-events: auto !important;
        }

        /* 6. Скидка (если есть): */
        ${targetSelectorRightCSS} > ${linkSelector} ${discountSelector} {
            pointer-events: auto !important;
            display: inline-block !important;
            vertical-align: middle;
        }

        /* 7. Кастомный скроллбар (УТОЛЩЕННЫЙ) */
        ${targetSelectorRightCSS}::-webkit-scrollbar {
            width: 12px;
        }
        ${targetSelectorRightCSS}::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 6px;
        }
        ${targetSelectorRightCSS}::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 6px;
        }
        ${targetSelectorRightCSS}::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
        ${targetSelectorRightCSS} {
            scrollbar-width: auto;
            scrollbar-color: #c1c1c1 #f1f1f1;
        }


        /* --- СТИЛИ ДЛЯ ЛЕВОЙ ВЫПАДАЮЩЕЙ ПАНЕЛИ --- */

        /* 1. Сам блок-контейнер: */
        ${targetSelectorLeftCSS} {
            max-height: 90vh; /* Высота для скролла */
            overflow-y: auto !important; /* Принудительный скроллбар */
            pointer-events: auto !important;
            /* Фон нужен, чтобы 'pointer-events: auto' было на что ловить клик */
            background-color: var(--substrate_color, #ffffff);
        }

        /* 2. Ссылки внутри: (Бэкап-фикс) */
        ${targetSelectorLeftCSS} > ${linkSelector} {
            pointer-events: none !important;
        }

        /* 3. Контент - АВАТАР: */
        ${targetSelectorLeftCSS} > ${linkSelector} ${avatarSelector} {
            pointer-events: auto !important;
        }

        /* 4. Контент - КОНТЕЙНЕР ТЕКСТА: */
        ${targetSelectorLeftCSS} > ${linkSelector} ${infoSelector} {
            display: inline-block !important;
            vertical-align: middle;
        }

        /* 5. Контент - ТЕКСТ (внутри): */
        ${targetSelectorLeftCSS} > ${linkSelector} ${nameSelector} {
            pointer-events: auto !important;
        }

        /* 6. Скидка (если есть): */
        ${targetSelectorLeftCSS} > ${linkSelector} ${discountSelector} {
            pointer-events: auto !important;
            display: inline-block !important;
            vertical-align: middle;
        }

        /* 7. Кастомный скроллбар (УТОЛЩЕННЫЙ) */
        ${targetSelectorLeftCSS}::-webkit-scrollbar {
            width: 12px;
        }
        ${targetSelectorLeftCSS}::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 6px;
        }
        ${targetSelectorLeftCSS}::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 6px;
        }
        ${targetSelectorLeftCSS}::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
        ${targetSelectorLeftCSS} {
            scrollbar-width: auto;
            scrollbar-color: #c1c1c1 #f1f1f1;
        }


        /* 8. Визуальная обратная связь для СКМ (Общий стиль) */
        body.mb-autoscroll-active {
            cursor: all-scroll, auto !important;
            user-select: none; /* Отключаем выделение текста */
        }
    `);

    // --- КАТЕГОРИЯ: ФУНКЦИИ УПРАВЛЕНИЯ АВТОСКРОЛЛОМ ---
    // Этот раздел содержит все функции, отвечающие за запуск, остановку и
    // выполнение цикла автоматической прокрутки (при нажатии СКМ).
    // - scrollLoop: Основной цикл, вызываемый через requestAnimationFrame. Рассчитывает скорость и применяет ее.
    // - updateMousePos: Обновляет глобальную переменную currentMouseY при движении мыши.
    // - stopAutoScroll: Останавливает цикл, сбрасывает флаги и удаляет глобальные слушатели.
    // - startAutoScroll: Запускает цикл, устанавливает флаги, 'якорь' и добавляет глобальные слушатели.

    /**
     * Плавный цикл прокрутки (с нелинейным ускорением)
     */
    function scrollLoop() {
        if (!isAutoScrolling || !scrollElem) return;

        const deltaY = currentMouseY - anchorY;
        let scrollAmount = 0;
        const absDelta = Math.abs(deltaY);

        // Ускорение теперь рассчитывается относительно высоты
        // прокручиваемого элемента, а не в абсолютных пикселях.
        const elemHeight = scrollElem.clientHeight;

        if (elemHeight > 0) {
            // 1. Нормализуем 'мертвую зону' (переводим в %)
            const deadZonePercent = deadZone / elemHeight;
            // 2. Нормализуем смещение мыши (переводим в %)
            const deltaPercent = absDelta / elemHeight;

            if (deltaPercent > deadZonePercent) {
                // 3. Находим 'эффективное' смещение в процентах
                const effectiveDeltaPercent = deltaPercent - deadZonePercent;

                // 4. Применяем ускорение к процентному значению
                const effectiveSpeed = Math.pow(effectiveDeltaPercent, acceleration);

                // 5. Высчитываем итоговое смещение (в пикселях)
                scrollAmount = Math.sign(deltaY) * effectiveSpeed * speedFactor;
            }
        }

        scrollElem.scrollTop += scrollAmount;
        animationFrameId = requestAnimationFrame(scrollLoop);
    }

    /**
     * Обновляет текущую позицию мыши
     */
    function updateMousePos(e) {
        currentMouseY = e.clientY;
    }

    /**
     * Останавливает режим автоскролла
     */
    function stopAutoScroll(e) {
        if (isAutoScrolling) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            isAutoScrolling = false;
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            scrollElem = null;

            document.body.classList.remove('mb-autoscroll-active');

            window.removeEventListener('mousemove', updateMousePos);
            window.removeEventListener('mousedown', stopAutoScroll, true);
        }
    }

    /**
     * Запускает режим автоскролла
     */
    function startAutoScroll(elem, e) {
        isAutoScrolling = true;
        scrollElem = elem;
        anchorY = e.clientY;
        currentMouseY = e.clientY;

        document.body.classList.add('mb-autoscroll-active');

        window.addEventListener('mousemove', updateMousePos);
        window.addEventListener('mousedown', stopAutoScroll, true);

        animationFrameId = requestAnimationFrame(scrollLoop);
    }

    // --- КАТЕГОРИЯ: ИНИЦИАЛИЗАЦИЯ БЛОКА ПОДПИСОК ---
    // Этот раздел содержит функцию, которая "оживляет" найденный блок,
    // добавляя к нему необходимые слушатели событий.
    // - initPan: Главная функция инициализации.
    // - (внутри) elem.addEventListener('mousedown', ...): Слушатель нажатия мыши.
    //  - Проверяет, что нажата СКМ (e.button === 1).
    //  - Проверяет, что клик был на сам контейнер, а не на его контент (e.target === e.currentTarget),
    //     чтобы не мешать открытию ссылок в новой вкладке.
    //  - Запускает или останавливает автоскролл.
    // - (внутри) elem.addEventListener('wheel', ...): Слушатель колеса мыши.
    //  - Перехватывает событие (e.stopPropagation()), чтобы прокручивался
    //     только блок подписок, а не вся страница.
    //  - Отпускает событие, если блок уже докручен доверху или донизу.

    /**
     * Инициализирует слушателей на целевом элементе
     */
    const initPan = (elem) => {
        if (elem.dataset.panInitialized) return;
        elem.dataset.panInitialized = 'true';

        elem.addEventListener('mousedown', function(e) {
            // 1 = средняя кнопка мыши (колесико)
            if (e.button !== 1) {
                return;
            }

            // e.target - это то, на что *реально* кликнули (напр. аватар)
            // e.currentTarget - это 'elem', на котором висит слушатель (контейнер)
            //
            // Если клик был НЕ на сам контейнер (т.е. на контент ссылки),
            // то НЕ запускаем автоскролл, а даем браузеру
            // выполнить действие по умолчанию (открыть ссылку в новой вкладке).
            if (e.target !== e.currentTarget) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            if (isAutoScrolling) {
                stopAutoScroll();
            } else {
                startAutoScroll(elem, e);
            }
        });

        // Остановка прокрутки основной страницы (колесом мыши)
        elem.addEventListener('wheel', function(e) {
            const hasScroll = elem.scrollHeight > elem.clientHeight;

            // Проверяем, достигнут ли верх или низ
            if ((e.deltaY < 0 && elem.scrollTop === 0) ||
                (e.deltaY > 0 && elem.scrollTop >= elem.scrollHeight - elem.clientHeight - 1)) {
                return;
            }

            if (hasScroll) {
                e.stopPropagation();
            }
        }, { passive: false });
    };

    // --- КАТЕГОРИЯ: ПОИСК ЭЛЕМЕНТОВ И ЗАПУСК СКРИПТА ---
    // Этот раздел отвечает за обнаружение ОБЕИХ целевых панелей,
    // которые могут загружаться динамически (SPA).
    // - findAndInitBlocks: Функция, которая ищет оба блока по селекторам `allJsTargetSelectors`
    //   и, если находит, передает их в `initPan` для инициализации.
    // - observer: Экземпляр `MutationObserver`, который следит за изменениями
    //   в `document.body` (добавлением новых узлов).
    // - (логика observer'a): При любом добавлении узлов в DOM,
    //   запускает `findAndInitBlocks`, чтобы найти и инициализировать новые элементы.
    // - findAndInitBlocks() (вызов): Первый, немедленный запуск
    //   на случай, если элементы уже есть на странице в момент старта скрипта.
    // - observer.observe(...): Запуск наблюдения за DOM.

    // Объединяем JS-селекторы для поиска
    const allJsTargetSelectors = `${jsTargetSelectorRight}, ${jsTargetSelectorLeft}`;

    const findAndInitBlocks = () => {
        // Используем querySelectorAll для поиска ВСЕХ подходящих блоков
        const scrollableBlocks = document.querySelectorAll(allJsTargetSelectors);

        scrollableBlocks.forEach(block => {
            if (block && !block.dataset.panInitialized) {
                initPan(block);
            }
        });
    };

    // Наблюдатель за изменениями в DOM
    const observer = new MutationObserver((mutations) => {
        let nodesAdded = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                nodesAdded = true;
                break;
            }
        }

        // Если в DOM что-то добавилось, просто перезапускаем поиск и инициализацию.
        // Функция findAndInitBlocks сама проверит, что уже было инициализировано,
        // и добавит слушатели только к новым элементам.
        if (nodesAdded) {
            findAndInitBlocks();
        }
    });

    // Первый запуск (на случай, если элементы уже есть на странице)
    findAndInitBlocks();

    // Начинаем наблюдение
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();