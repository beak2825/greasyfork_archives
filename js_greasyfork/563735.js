// ==UserScript==
// @name         Shazam Search Buttons (Annotated Edition)
// @name:ru      Shazam Search Buttons (Annotated Edition)
// @namespace    https://tampermonkey.net/
// @version      2.3.1
// @description  Кнопки с адаптивным отступом и подробными комментариями.
// @description:ru  Кнопки с адаптивным отступом и подробными комментариями.
// @match        https://www.shazam.com/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563735/Shazam%20Search%20Buttons%20%28Annotated%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563735/Shazam%20Search%20Buttons%20%28Annotated%20Edition%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. ЧИТАЕМ НАСТРОЙКИ
    // Проверяем сохраненный режим (по умолчанию 'hover' - при наведении)
    const CURRENT_MODE = GM_getValue('shazam_btn_mode', 'hover');

    // Метка, которую мы ставим на уже обработанные треки, чтобы не добавлять кнопки по 100 раз
    const MARKER = 'tm-processed-track';

    // 2. ЦВЕТА И СТИЛИ КНОПОК
    const BTN_BG = 'rgba(10, 10, 10, 0.5)';        // Цвет фона кнопки (черный полупрозрачный)
    const BTN_BG_HOVER = 'rgba(0, 0, 0, 0.9)';  // Цвет фона при наведении (почти черный)
    const BTN_TEXT = '#ffffff';                 // Цвет текста (белый)
    const BTN_BORDER = 'rgba(255, 255, 255, 0.2)'; // Цвет рамки

    /**
     * Определяет горизонтальный отступ от правого края.
     */
    function getRightOffset() {
        const url = window.location.href;
        if (url.includes('/myshazam')) return '140px'; // В библиотеке отодвигаем от Apple Music
        if (url.includes('/charts'))   return '20px';  // В чартах прижимаем к краю
        return '80px';                                 // В остальных местах
    }

    /**
     * Определяет вертикальный отступ (теперь и для чартов).
     */
    function getTopOffset() {
        const url = window.location.href;
        if (url.includes('/charts')) return '70px'; // Ваша правка: сдвигаем ниже в чартах
        return '0px';                               // В библиотеке оставляем по центру
    }

    /**
     * Вспомогательная функция для создания самой кнопки.
     */
    const mkBtn = (text, url) => {
        const b = document.createElement('button');
        b.textContent = text;

        // Применяем стили оформления
        Object.assign(b.style, {
            fontSize: '10px',
            fontWeight: '600',
            padding: '4px 8px',
            background: BTN_BG,
            color: BTN_TEXT,
            border: `1px solid ${BTN_BORDER}`,
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            backdropFilter: 'blur(10px)', // Эффект размытия под кнопкой
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
        });

        // Эффекты при наведении курсора на саму кнопку
        b.onmouseover = () => {
            b.style.background = BTN_BG_HOVER;
            b.style.transform = 'scale(1.05)'; // Кнопка чуть увеличивается
        };
        b.onmouseout = () => {
            b.style.background = BTN_BG;
            b.style.transform = 'scale(1)';   // Возвращается в норму
        };

        // Клик по кнопке: открываем ссылку в новой вкладке
        b.onclick = e => {
            e.stopPropagation(); // Чтобы Shazam не подумал, что мы кликнули по песне
            e.preventDefault();
            GM_openInTab(url, { active: true, insert: true });
        };
        return b;
    };

    /**
     * ГЛАВНАЯ ФУНКЦИЯ: Поиск треков на странице и добавление кнопок
     */
    function addButtons() {
        // Ищем элементы с названиями песен (два разных селектора для разных страниц)
        const selectors = '.title[data-track-title], [data-test-id="charts_userevent_list_songTitle"]';

        document.querySelectorAll(selectors).forEach(titleEl => {
            // Ищем общий контейнер всей строки трека
            const trackRoot = titleEl.closest('article, li, [class*="SongItem-module_container"]');

            // Если контейнер не нашли или кнопки уже добавлены — идем дальше
            if (!trackRoot || trackRoot.classList.contains(MARKER)) return;

            // Ищем имя артиста внутри этого же контейнера
            const artistEl = trackRoot.querySelector('.artist[itemprop="byArtist"], [data-test-id="charts_userevent_list_artistName"]');
            if (!artistEl) return;

            const title = titleEl.textContent.trim();
            const artist = artistEl.textContent.trim();
            if (!title || !artist) return;

            // Формируем поисковый запрос
            const q = encodeURIComponent(`${artist} ${title}`);

            // Делаем контейнер трека "относительным", чтобы кнопки позиционировались внутри него
            trackRoot.style.position = 'relative';

            // Создаем невидимый блок (box), в котором будут лежать наши 3 кнопки
            const box = document.createElement('div');
            Object.assign(box.style, {
                position: 'absolute',
                top: '0',
                bottom: '0',
                right: getRightOffset(),    // Сдвиг вправо (зависит от страницы)
                marginTop: getTopOffset(),  // Сдвиг вниз (для чартов 55px)
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: '100',
                pointerEvents: 'none'       // Чтобы блок не мешал кликать по песне, когда он прозрачный
            });

            // Настраиваем видимость в зависимости от выбранного режима
            if (CURRENT_MODE === 'always') {
                box.style.opacity = '1';
                box.style.pointerEvents = 'auto';
            } else {
                box.style.opacity = '0';
                box.style.transition = 'opacity 0.25s ease';
            }

            // Добавляем кнопки в наш блок
            box.append(
                mkBtn('YouTube', `https://www.youtube.com/results?search_query=${q}`),
                mkBtn('YT Music', `https://music.youtube.com/search?q=${q}`),
                mkBtn('VK', `https://kissvk.top/?q=${q}`)
            );

            // Вставляем блок с кнопками в строку трека
            trackRoot.appendChild(box);

            // Если включен режим "При наведении", вешаем события
            if (CURRENT_MODE === 'hover') {
                let hideTimeout = null;
                const show = () => {
                    if (hideTimeout) clearTimeout(hideTimeout);
                    box.style.opacity = '1';
                    box.style.pointerEvents = 'auto';
                };
                const hide = () => {
                    hideTimeout = setTimeout(() => {
                        box.style.opacity = '0';
                        box.style.pointerEvents = 'none';
                    }, 0); // 500мс задержка перед исчезновением
                };

                trackRoot.addEventListener('mouseenter', show);
                trackRoot.addEventListener('mouseleave', hide);
                // Чтобы кнопки не мигали, если мышь внутри блока кнопок
                box.addEventListener('mouseenter', show);
                box.addEventListener('mouseleave', hide);
            }

            // Ставим метку, что этот трек мы уже обработали
            trackRoot.classList.add(MARKER);
        });
    }

    // 3. ЗАПУСК И НАБЛЮДЕНИЕ
    addButtons(); // Запускаем один раз при загрузке

    // Создаем наблюдатель: он будет запускать addButtons(), когда на странице появляются новые элементы
    // (например, при прокрутке списка вниз)
    new MutationObserver(addButtons).observe(document.body, { childList: true, subtree: true });

    // 4. КОМАНДА В МЕНЮ TAMPERMONKEY
    GM_registerMenuCommand('Переключить режим (Наведение / Всегда)', () => {
        const newMode = CURRENT_MODE === 'hover' ? 'always' : 'hover';
        GM_setValue('shazam_btn_mode', newMode);
        location.reload(); // Перезагружаем страницу, чтобы применить режим
    });

})();