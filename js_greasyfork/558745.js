// ==UserScript==
// @name         Yandex Music Downloader
// @version      0.3
// @description  Добавляет кнопку для скачивания треков на Яндекс.Музыке. Использует гибридный метод (API или скрытый iframe) для получения аудиопотока и сохраняет файлы с корректным названием (Исполнитель - Трек). Работает в SPA-режиме.
// @match        https://music.yandex.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=music.yandex.ru
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/558745/Yandex%20Music%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/558745/Yandex%20Music%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- КАТЕГОРИЯ: ИНИЦИАЛИЗАЦИЯ ОКРУЖЕНИЯ ---
    // Получение доступа к глобальному объекту window, даже если скрипт запущен в песочнице Tampermonkey.
    // Это необходимо для доступа к внутренним объектам Яндекс.Музыки (Mu, externalAPI).
    // - win: Ссылка на глобальный контекст окна (window или unsafeWindow).
    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // --- КАТЕГОРИЯ: КОНФИГУРАЦИЯ ---
    // Настройки селекторов и визуального оформления кнопки.
    // Позволяет легко адаптировать скрипт при изменении верстки Яндекса без переписывания логики.
    // - containerSelectors: Список CSS-селекторов, где может находиться панель управления плеером.
    // - buttonId: Уникальный ID кнопки, чтобы избежать дублирования.
    // - iconSvg: SVG-код иконки "Скачать" (стрелка вниз).
    // - loadingSvg: SVG-код иконки загрузки (спиннер).
    const CONFIG = {
        // Ищем контейнеры по частичному совпадению класса, так как в SPA они меняются (хеши в названиях классов).
        // Скрипт будет перебирать их по очереди, пока не найдет существующий на странице.
        containerSelectors: [
            '[class*="PlayerBarDesktop_meta"]',
            '[class*="PlayerBarDesktopWithBackgroundProgressBar_meta"]',
            '.player-controls__track-controls',
            '.d-track__actions',
            '[class*="PlayerBar_root"]' // Глобальный контейнер (футер плеера)
        ],
        
        // Селекторы для шапки альбома/плейлиста, куда добавим кнопку "Скачать всё"
        albumHeaderSelectors: [
            '[class*="PageHeaderPlaylist_mainControls"]', // Новый дизайн
            '[class*="EntityHeader_controls"]',           // Старый дизайн
            '.d-generic-page-head__main-actions'
        ],

        buttonId: 'ym-iframe-dl-btn',
        albumButtonId: 'ym-album-dl-btn',
        iconSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>',
        albumIconSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/><path d="M22 20H2v2h20v-2z"/></svg>', // Иконка с подчеркиванием
        loadingSvg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="spin"><path d="M12 4V2C6.48 2 2 6.48 2 12h2c0-4.41 3.59-8 8-8zm0 14c4.41 0 8-3.59 8-8h-2c0 3.31-2.69 6-6 6v2zm8-6h2c0 5.52-4.48 10-10 10v-2c4.41 0 8-3.59 8-8z"/></svg>',

        // Метод скачивания:
        // 'iframe' - перехват запроса через скрытый фрейм (старый надежный метод)
        // 'api'    - прямой запрос к API с подписью (быстрее, но требует валидной "соли")
        // 'auto'   - сначала пробует основной, при ошибке переключается на запасной. API (быстрее) → Попытка 2: Iframe (медленнее, но надежнее).
        downloadMethod: 'auto'
    };

    // --- КАТЕГОРИЯ: СТИЛИЗАЦИЯ ---
    // Добавление CSS-стилей для анимации загрузки и курсора.
    // Создается элемент <style> и внедряется в <head> страницы.
    // - @keyframes spin: Анимация вращения на 360 градусов.
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        #${CONFIG.buttonId}.loading, #${CONFIG.albumButtonId}.loading { opacity: 0.7; cursor: wait; }
        #${CONFIG.buttonId} { margin-right: 8px; cursor: pointer; }
        #${CONFIG.albumButtonId} { margin-left: 10px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }

        /* Стили для модального окна массовой загрузки */
        .ym-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; justify-content: center; align-items: center; }
        .ym-modal { background: #fff; color: #000; width: 600px; max-width: 95%; height: 80%; display: flex; flex-direction: column; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); font-family: var(--yandex-sans-display-regular); overflow: hidden; }
        .ym-modal-header { padding: 16px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #f9f9f9; }
        .ym-modal-title { font-size: 18px; font-weight: bold; }
        .ym-modal-close { background: none; border: none; font-size: 24px; cursor: pointer; line-height: 1; padding: 0 5px; opacity: 0.6; }
        .ym-modal-close:hover { opacity: 1; }
        
        .ym-toolbar { padding: 10px 20px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 15px; font-size: 14px; background: #fff; }
        .ym-checkbox-label { display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; }
        
        .ym-track-list { flex: 1; overflow-y: auto; padding: 0; }
        .ym-track-item { display: flex; align-items: center; padding: 8px 20px; border-bottom: 1px solid #f0f0f0; gap: 10px; transition: background 0.2s; }
        .ym-track-item:hover { background: #f5f5f5; }
        .ym-track-item.downloaded { background: #e8f5e9; opacity: 0.6; }
        .ym-track-item.error { background: #ffebee; }
        
        /* Анимация для режима сбора (пульсация) */
        @keyframes pulse-rec { 0% { color: #f00; } 50% { color: #800; } 100% { color: #f00; } }
        .ym-recording { animation: pulse-rec 2s infinite; font-weight: bold; border-color: #f00 !important; }
        
        .ym-track-info { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; }
        .ym-track-id { font-size: 11px; color: #999; font-family: monospace; min-width: 60px; text-align: right; }
        
        .ym-modal-footer { padding: 16px 20px; border-top: 1px solid #eee; background: #f9f9f9; display: flex; justify-content: space-between; align-items: center; }
        .ym-status-text { font-size: 13px; color: #666; }
        .ym-actions { display: flex; gap: 10px; }
        
        .ym-btn { padding: 8px 20px; border: none; border-radius: 20px; cursor: pointer; font-weight: 500; font-size: 14px; transition: opacity 0.2s; }
        .ym-btn:hover { opacity: 0.8; }
        .ym-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .ym-btn-primary { background: #ffcc00; color: #000; }
        .ym-btn-secondary { background: #e0e0e0; color: #000; }

        /* Темная тема (автоопределение через классы body яндекса) */
        body.theme-black .ym-modal, body.theme-dark .ym-modal { background: #222; color: #fff; }
        body.theme-black .ym-modal-header, body.theme-dark .ym-modal-header,
        body.theme-black .ym-modal-footer, body.theme-dark .ym-modal-footer { background: #2a2a2a; border-color: #333; }
        body.theme-black .ym-toolbar, body.theme-dark .ym-toolbar { background: #222; border-color: #333; }
        body.theme-black .ym-track-item, body.theme-dark .ym-track-item { border-color: #333; }
        body.theme-black .ym-track-item:hover, body.theme-dark .ym-track-item:hover { background: #333; }
        body.theme-black .ym-btn-secondary, body.theme-dark .ym-btn-secondary { background: #444; color: #fff; }
        body.theme-black .ym-track-item.downloaded, body.theme-dark .ym-track-item.downloaded { background: #1b3320; }
    `;
    document.head.appendChild(style);

    // --- КАТЕГОРИЯ: ОТСЛЕЖИВАНИЕ ИЗМЕНЕНИЙ DOM ---
    // Запуск наблюдателя за изменениями на странице.
    // Яндекс.Музыка — это SPA (Single Page Application), элементы перерисовываются без перезагрузки.
    // Нам нужно постоянно следить, не исчезла ли кнопка, и добавлять её снова.
    // - observer: Экземпляр MutationObserver, реагирующий на изменения в document.body.
    
    // Глобальное состояние сессии сбора (Listeners Mode)
    const collectionSession = {
        active: false,
        tracks: new Map(), // Map гарантирует уникальность треков по ID
        observer: null
    };

    // --- ГЛОБАЛЬНЫЙ DEBOUNCE-ТАЙМЕР ---
    // Без debounce MutationObserver срабатывает сотни раз в секунду при прокрутке,
    // что блокирует основной поток и ломает подгрузку SPA.
    let globalDebounceTimer = null;

    function init() {
        const observer = new MutationObserver((mutations) => {
            // Debounce: ждём 100мс после последнего изменения DOM
            if (globalDebounceTimer) clearTimeout(globalDebounceTimer);
            globalDebounceTimer = setTimeout(() => {
                addCustomButton(); // Пробуем добавить кнопку при любом изменении DOM
                addAlbumDownloadButton(); // Пробуем добавить кнопку "Скачать всё"
            }, 100);
        });

        // Наблюдаем за всем телом документа, включая дочерние элементы
        observer.observe(document.body, { childList: true, subtree: true });

        // Первая попытка добавления сразу после запуска скрипта
        addCustomButton();
        addAlbumDownloadButton();
    }

    // --- КАТЕГОРИЯ: ИНТЕРФЕЙС (UI) ---
    // Функция создания и внедрения кнопки скачивания в интерфейс плеера.
    // Она ищет подходящее место, копирует стили у существующих кнопок (чтобы выглядеть нативно) и вешает обработчик клика.
    // - container: Найденный HTML-элемент панели плеера.
    // - refBtn: Существующая кнопка (например, "Лайк"), используемая как образец для стилей.
    function addCustomButton() {
        // Проверка: если кнопка уже существует, прерываем выполнение, чтобы не плодить дубликаты.
        if (document.getElementById(CONFIG.buttonId)) return;

        // Поиск контейнера: перебираем все селекторы из конфига.
        let container = null;
        for (const selector of CONFIG.containerSelectors) {
            // querySelectorAll находит все совпадения.
            const found = document.querySelectorAll(selector);
            if (found.length > 0) {
                 // Берем последний найденный элемент, так как на странице могут быть скрытые плееры,
                 // а активный бар обычно находится внизу DOM-дерева.
                 container = found[found.length - 1];
                 break;
            }
        }

        // Если контейнер не найден, выходим (возможно, плеер еще не загрузился).
        if (!container) return;

        // Ищем любую кнопку внутри контейнера, чтобы скопировать её классы (CSS).
        const refBtn = container.querySelector('button');

        // Создаем нашу кнопку
        const btn = document.createElement('button');
        btn.id = CONFIG.buttonId;

        // Применяем стили: если нашли кнопку-образец, берем её классы, иначе ставим дефолтные.
        if (refBtn) {
            btn.className = refBtn.className;
            // Некоторые кнопки Яндекса имеют иконку внутри <span>, копируем и эту структуру.
            const refSpan = refBtn.querySelector('span');
            if (refSpan) {
                btn.innerHTML = `<span class="${refSpan.className}">${CONFIG.iconSvg}</span>`;
            } else {
                btn.innerHTML = `<span>${CONFIG.iconSvg}</span>`;
            }
        } else {
            // Fallback стили, если скопировать не удалось
            btn.style.background = 'transparent';
            btn.style.border = 'none';
            btn.style.color = 'inherit';
            btn.innerHTML = `<span>${CONFIG.iconSvg}</span>`;
        }

        btn.type = "button";
        btn.title = `Скачать (${CONFIG.downloadMethod})`;

        // --- ОБРАБОТЧИК КЛИКА ---
        btn.onclick = async (e) => {
            e.stopPropagation(); // Предотвращаем всплытие события (чтобы не сработал клик по плееру)
            if (btn.classList.contains('loading')) return; // Защита от повторного клика во время загрузки

            // Получаем данные о треке (ID, Название, Исполнитель).
            // Передаем саму кнопку (btn), чтобы функция могла искать данные "рядом" с ней в DOM.
            const trackInfo = getCurrentTrackInfo(btn);

            if (!trackInfo || !trackInfo.trackId) {
                console.error("[DL] ID не найден. Debug:", trackInfo);
                alert("Не удалось определить трек. Проверьте консоль или попробуйте перезагрузить страницу.");
                return;
            }

            // Включаем анимацию загрузки
            setLoading(btn, true);

            try {
                console.log(`[DL] Старт: ${trackInfo.title} - ${trackInfo.artist} (ID: ${trackInfo.trackId})`);

                // ЗАПУСК МЕНЕДЖЕРА ЗАГРУЗКИ (с управлением методами и фоллбеком)
                const url = await downloadManager(trackInfo);

                if (url) {
                    // Определяем расширение файла по URL (обычно mp3 или aac)
                    let ext = "mp3";
                    if (url.includes("aac") || url.includes("mp4")) ext = "aac";

                    // Формируем красивое имя файла
                    let filename = `${trackInfo.title}`;
                    if (trackInfo.artist) {
                        filename += ` - ${trackInfo.artist}`;
                    }
                    filename += `.${ext}`;

                    // Скачиваем файл
                    await downloadFile(url, filename);
                } else {
                    console.error("URL не получен ни одним из методов.");
                    alert("Ошибка: Не удалось получить ссылку на трек.");
                }
            } catch (err) {
                console.error("[DL] Критическая ошибка:", err);
                alert("Ошибка при скачивании: " + err.message);
            } finally {
                // Выключаем анимацию загрузки
                setLoading(btn, false);
            }
        };

        // Вставляем кнопку в начало контейнера (слева), чтобы она была на виду.
        if (container.firstChild) {
            container.insertBefore(btn, container.firstChild);
        } else {
            container.appendChild(btn);
        }
    }

    // Добавление кнопки "Скачать всё" в шапку альбома/плейлиста
    function addAlbumDownloadButton() {
        if (document.getElementById(CONFIG.albumButtonId)) return;

        let container = null;
        for (const selector of CONFIG.albumHeaderSelectors) {
            const found = document.querySelector(selector);
            if (found) {
                container = found;
                break;
            }
        }

        if (!container) return;

        // Ищем кнопку-образец (обычно "Слушать")
        const refBtn = container.querySelector('button');

        const btn = document.createElement('button');
        btn.id = CONFIG.albumButtonId;
        
        // Шаблон обычной кнопки
        const defaultContent = `<span>${CONFIG.albumIconSvg}</span><span style="margin-left:6px;">Сбор треков</span>`;

        if (refBtn) {
            btn.className = refBtn.className;
            btn.innerHTML = defaultContent;
        } else {
            btn.innerHTML = "Сбор треков";
        }

        btn.type = "button";
        btn.title = "Клик 1: Начать сбор (листайте страницу)\nКлик 2: Закончить и скачать";

        // ЛОГИКА "СЛУШАТЕЛЯ"
        btn.onclick = async (e) => {
            e.stopPropagation();
            
            // Переключение состояния
            collectionSession.active = !collectionSession.active;

            if (collectionSession.active) {
                // --- СТАРТ СБОРА ---
                collectionSession.tracks.clear(); // Очищаем прошлый сбор
                btn.classList.add('ym-recording');
                
                // Функция сканирования: ищет треки в текущем DOM и добавляет в Map
                const scan = () => {
                    const found = parseTracksFromDOM();
                    let addedCount = 0;
                    found.forEach(t => {
                        if (!collectionSession.tracks.has(t.trackId)) {
                            collectionSession.tracks.set(t.trackId, t);
                            addedCount++;
                        }
                    });
                    
                    // Обновляем счетчик на кнопке в реальном времени
                    const total = collectionSession.tracks.size;
                    btn.innerHTML = `<span class="spin">${CONFIG.loadingSvg}</span><span style="margin-left:6px;">Найдено: ${total}</span>`;
                };

                // Запускаем первый скан немедленно
                scan();

                // Запускаем локальный Observer, чтобы ловить подгрузку контента при скролле
                if (collectionSession.observer) collectionSession.observer.disconnect();
                
                // Debounce-таймер для режима сбора (scan тяжелее, ставим 200мс)
                let scanDebounce = null;
                collectionSession.observer = new MutationObserver((mutations) => {
                    // Debounce: не сканируем чаще чем раз в 200мс
                    if (scanDebounce) clearTimeout(scanDebounce);
                    scanDebounce = setTimeout(() => {
                        scan();
                    }, 200);
                });
                
                // Следим за изменениями в теле документа (подгрузка списка)
                collectionSession.observer.observe(document.body, { childList: true, subtree: true });

            } else {
                // --- СТОП СБОРА ---
                btn.classList.remove('ym-recording');
                btn.innerHTML = defaultContent;
                
                // Отключаем слежку
                if (collectionSession.observer) {
                    collectionSession.observer.disconnect();
                    collectionSession.observer = null;
                }

                // Открываем модальное окно с накопленным результатом
                const finalTracks = Array.from(collectionSession.tracks.values());
                openMassDownloadModal(finalTracks);
            }
        };

        container.appendChild(btn);
    }

    // --- КАТЕГОРИЯ: МАССОВОЕ СКАЧИВАНИЕ (MODAL UI) ---

    // 1. Парсинг треков с текущей страницы
    function parseTracksFromDOM() {
        const links = Array.from(document.querySelectorAll('a[href*="/track/"]'));
        const uniqueTracks = new Map();
        
        links.forEach(a => {
            const href = a.getAttribute('href');
            // Парсим ссылки вида /album/123/track/456 или /track/456
            const match = href.match(/(?:album\/(\d+)\/)?track\/(\d+)/);
            
            if (match) {
                const albumId = match[1] || null; // Может быть null если ссылка просто /track/
                const trackId = match[2];
                
                // Пропускаем дубликаты
                if (!uniqueTracks.has(trackId)) {
                    // Пытаемся найти название и артиста для отображения в списке
                    let title = a.textContent.trim();
                    let artist = "";
                    
                    // Поиск артиста: поднимаемся к контейнеру трека и ищем там ссылки на артиста.
                    // Обновлено для поддержки нового дизайна (CommonTrack_root, HorizontalCardContainer и т.д.)
                    let parent = a.closest('.d-track') || 
                                 a.closest('.entity-item') || 
                                 a.closest('[class*="CommonTrack_root"]') || 
                                 a.closest('[class*="HorizontalCardContainer_root"]');
                    
                    // Если специфичные классы не найдены, ищем контекстно поднимаясь вверх (fallback)
                    if (!parent) {
                        let curr = a.parentElement;
                        // Поднимаемся до 5 уровней, чтобы найти общий контейнер с артистом
                        // В новом дизайне нужно ~3-4 уровня (Meta_text -> TitleCont -> MetaCont)
                        for (let k = 0; k < 5; k++) { 
                            if (!curr) break;
                            if (curr.querySelector('a[href*="/artist/"]')) {
                                parent = curr;
                                break;
                            }
                            curr = curr.parentElement;
                        }
                    }

                    if (parent) {
                        // Пробуем найти название отдельно (если ссылка была на контейнер, а не текст)
                        const titleEl = parent.querySelector('.d-track__title, .entity-item__title, [class*="Meta_title"]');
                        if (titleEl) title = titleEl.textContent.trim();

                        const artistLinks = parent.querySelectorAll('a[href*="/artist/"]');
                        artist = Array.from(artistLinks).map(el => el.textContent.trim()).join(", ");
                    }

                    if (!title) title = `Track ${trackId}`;

                    uniqueTracks.set(trackId, {
                        trackId: trackId,
                        albumId: albumId,
                        title: title,
                        artist: artist,
                        element: null // Ссылка на DOM элемент в модальном окне (заполнится позже)
                    });
                }
            }
        });
        
        return Array.from(uniqueTracks.values());
    }

    // 2. Отображение модального окна
    function openMassDownloadModal(tracksInput) {
        // Удаляем старое окно если есть
        const oldModal = document.querySelector('.ym-modal-overlay');
        if (oldModal) oldModal.remove();

        // Если передали список (из режима сбора), используем его. 
        // Если нет (например, прямой вызов) - парсим текущий вид.
        const tracks = tracksInput || parseTracksFromDOM();
        
        if (tracks.length === 0) {
            alert("Список пуст. Включите режим сбора и пролистайте страницу для загрузки треков.");
            return;
        }

        // Создаем структуру
        const overlay = document.createElement('div');
        overlay.className = 'ym-modal-overlay';
        
        overlay.innerHTML = `
            <div class="ym-modal">
                <div class="ym-modal-header">
                    <div class="ym-modal-title">Скачивание треков</div>
                    <button class="ym-modal-close" title="Закрыть">&times;</button>
                </div>
                <div class="ym-toolbar">
                    <label class="ym-checkbox-label">
                        <input type="checkbox" id="ym-select-all" checked>
                        <span>Выбрать все (${tracks.length})</span>
                    </label>
                    <div style="flex:1"></div>
                    <span style="color:#888; font-size:12px;">Прокрутите страницу сайта, чтобы найти больше</span>
                </div>
                <div class="ym-track-list" id="ym-track-list-container"></div>
                <div class="ym-modal-footer">
                    <div class="ym-status-text" id="ym-status-text">Готов к скачиванию</div>
                    <div class="ym-actions">
                        <button class="ym-btn ym-btn-secondary" id="ym-cancel-btn">Отмена</button>
                        <button class="ym-btn ym-btn-primary" id="ym-start-btn">Скачать выбранные</button>
                    </div>
                </div>
            </div>
        `;

        // Заполняем список
        const listContainer = overlay.querySelector('#ym-track-list-container');
        
        tracks.forEach(track => {
            const item = document.createElement('div');
            item.className = 'ym-track-item';
            item.innerHTML = `
                <input type="checkbox" class="ym-item-checkbox" checked value="${track.trackId}">
                <div class="ym-track-info">
                    <span style="font-weight:bold;">${track.title}</span>
                    ${track.artist ? `<span style="color:#888"> — ${track.artist}</span>` : ''}
                </div>
                <div class="ym-track-id">${track.trackId}</div>
            `;
            listContainer.appendChild(item);
            track.checkboxElement = item.querySelector('input');
            track.rowElement = item;
        });

        // --- Логика событий ---
        
        // Закрытие
        const close = () => overlay.remove();
        overlay.querySelector('.ym-modal-close').onclick = close;
        overlay.querySelector('#ym-cancel-btn').onclick = close;
        overlay.onclick = (e) => { if (e.target === overlay) close(); };

        // Чекбокс "Выбрать все"
        const selectAllCb = overlay.querySelector('#ym-select-all');
        selectAllCb.onchange = (e) => {
            const checked = e.target.checked;
            tracks.forEach(t => {
                if (t.checkboxElement) t.checkboxElement.checked = checked;
            });
            updateStatus();
        };

        // Обновление статуса при клике на отдельные чекбоксы
        listContainer.onchange = updateStatus;

        function updateStatus() {
            const count = tracks.filter(t => t.checkboxElement && t.checkboxElement.checked).length;
            const btn = overlay.querySelector('#ym-start-btn');
            btn.textContent = `Скачать выбранные (${count})`;
            btn.disabled = count === 0;
        }

        // Кнопка "Скачать"
        overlay.querySelector('#ym-start-btn').onclick = async function() {
            const selectedTracks = tracks.filter(t => t.checkboxElement && t.checkboxElement.checked);
            if (selectedTracks.length === 0) return;

            // Блокируем интерфейс
            this.disabled = true;
            selectAllCb.disabled = true;
            const cancelBtn = overlay.querySelector('#ym-cancel-btn');
            cancelBtn.textContent = 'Стоп'; // Меняем отмену на стоп
            
            let shouldStop = false;
            cancelBtn.onclick = () => { shouldStop = true; };

            const statusText = overlay.querySelector('#ym-status-text');
            
            let success = 0;
            let errors = 0;

            for (let i = 0; i < selectedTracks.length; i++) {
                if (shouldStop) {
                    statusText.textContent = "Остановлено пользователем.";
                    break;
                }

                const track = selectedTracks[i];
                const row = track.rowElement;
                
                // Визуализация процесса
                row.style.background = "#fff8e1"; // Подсветка текущего (светло-желтый)
                row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                statusText.textContent = `Скачивание ${i + 1} из ${selectedTracks.length}...`;

                try {
                    // Пауза перед запросом (анти-спам)
                    await new Promise(r => setTimeout(r, 1500));

                    const url = await downloadManager(track);
                    if (url) {
                        // Формируем имя
                        let filename = track.title.trim();
                        if (track.artist) filename += ` - ${track.artist}`;
                        filename = filename || `track-${track.trackId}`;
                        
                        await downloadFile(url, `${filename}.mp3`);
                        
                        row.classList.add('downloaded');
                        row.style.background = ""; // Сброс инлайн стиля
                        // Убираем галочку, чтобы при повторном нажатии не качать снова
                        track.checkboxElement.checked = false;
                        success++;
                    } else {
                        throw new Error("No URL");
                    }
                } catch (e) {
                    console.error(e);
                    row.classList.add('error');
                    row.style.background = "";
                    row.title = "Ошибка скачивания: " + e.message;
                    errors++;
                }
            }

            if (!shouldStop) {
                statusText.textContent = `Готово! Скачано: ${success}, Ошибок: ${errors}`;
                this.textContent = "Скачать (повтор)";
                this.disabled = false;
                selectAllCb.disabled = false;
                cancelBtn.textContent = 'Закрыть';
                cancelBtn.onclick = close;
            }
        };

        document.body.appendChild(overlay);
        updateStatus(); // Инициализация текста кнопки
    }

    // --- КАТЕГОРИЯ: СБОР ДАННЫХ (ПАРСИНГ) ---
    // Функция пытается найти ID трека, альбом, название и исполнителя всеми возможными способами.
    // Использует каскадную логику: от самых надежных методов (API) к парсингу HTML.
    // - btnElement: Ссылка на кнопку скачивания, используется как точка отсчета для поиска в DOM.
    function getCurrentTrackInfo(btnElement) {

        // 1. Попытка через внутренний глобальный объект Яндекс.Музыки (Mu).
        // Это самый надежный способ для SPA, так как объект содержит актуальное состояние плеера.
        try {
            if (win.Mu && win.Mu.Flow && win.Mu.Flow.player && win.Mu.Flow.player.currentTrack) {
                const t = win.Mu.Flow.player.currentTrack;
                console.log("[DL] Взят из Mu.Flow.player");
                // Собираем имена всех артистов через запятую
                const artists = (t.artists || []).map(a => a.name).join(", ");
                return {
                    trackId: t.id,
                    albumId: t.albumId || (t.albums && t.albums[0] ? t.albums[0].id : null),
                    title: t.title,
                    artist: artists
                };
            }
        } catch (e) { console.warn("[DL] Mu access failed", e); }

        // 2. Попытка через официальный externalAPI (используется внешними расширениями).
        try {
            if (win.externalAPI && win.externalAPI.getCurrentTrack) {
                const t = win.externalAPI.getCurrentTrack();
                if (t) {
                    console.log("[DL] Взят из externalAPI");
                    const artists = (t.artists || []).map(a => a.title).join(", ");
                    return {
                        trackId: t.id,
                        albumId: t.album ? t.album.id : null,
                        title: t.title,
                        artist: artists
                    };
                }
            }
        } catch (e) { console.warn("[DL] externalAPI failed", e); }

        // 3. Попытка через URL браузера.
        // Работает, только если пользователь находится непосредственно на странице трека (/album/X/track/Y).
        const urlMatch = window.location.href.match(/album\/(\d+)\/track\/(\d+)/);
        if (urlMatch) {
            // Парсим заголовок вкладки (Title), убирая лишнее " — Яндекс Музыка"
            let pageTitle = document.title.replace(/\s*—\s*Яндекс\s*Музыка.*/, "").trim();
            // Обычно формат "Название — Исполнитель"
            let parts = pageTitle.split(" — ");
            console.log("[DL] Взят из URL");
            return {
                albumId: urlMatch[1],
                trackId: urlMatch[2],
                title: parts[0] || "Track",
                artist: parts[1] || ""
            };
        }

        // 4. Попытка через DOM (Контекстный поиск).
        // Если API недоступны, ищем ссылки <a href="/track/..."> рядом с кнопкой скачивания.
        if (btnElement) {
            // А. Локальный поиск: поднимаемся вверх по родителям кнопки и ищем ссылку внутри них.
            let parent = btnElement.parentElement;
            let foundLink = null;

            // Итерируемся вверх на 7 уровней вложенности
            for (let i = 0; i < 7; i++) {
                if (!parent) break;
                foundLink = parent.querySelector('a[href*="/track/"]');
                if (foundLink) break;
                parent = parent.parentElement;
            }

            // Б. Глобальный поиск в плеере: если рядом не нашли, ищем во всем футере.
            if (!foundLink) {
                const playerRoot = document.querySelector('[class*="PlayerBar_root"]') ||
                                   document.querySelector('.bar') ||
                                   document.querySelector('footer');
                if (playerRoot) {
                     foundLink = playerRoot.querySelector('a[href*="/track/"]');
                }
            }

            // Если ссылка найдена, извлекаем из нее ID
            if (foundLink) {
                const href = foundLink.getAttribute('href');
                const trackMatch = href.match(/track\/(\d+)/);
                const albumMatch = href.match(/album\/(\d+)/);

                let artistName = "";

                // === ПОИСК АРТИСТА ===
                // Пытаемся найти ссылки на артистов (/artist/...) в том же контексте, где нашли трек.
                // Поднимаемся от ссылки трека вверх, чтобы найти общий контейнер с артистами.
                let context = foundLink.parentElement;
                for (let k = 0; k < 6; k++) {
                    if (!context) break;

                    // Ищем ВСЕ ссылки на артистов
                    const artistLinks = context.querySelectorAll('a[href*="/artist/"]');
                    if (artistLinks.length > 0) {
                        // Собираем текст из всех найденных ссылок
                        artistName = Array.from(artistLinks)
                            .map(link => link.textContent.trim())
                            .join(", ");
                        break;
                    }
                    context = context.parentElement;
                }

                if (trackMatch) {
                    console.log("[DL] Взят из DOM (Deep Search)");
                    return {
                        trackId: trackMatch[1],
                        albumId: albumMatch ? albumMatch[1] : null,
                        title: foundLink.textContent,
                        artist: artistName
                    };
                }
            }
        }

        return null;
    }

    // --- КАТЕГОРИЯ: ПЕРЕХВАТ СЕТЕВЫХ ЗАПРОСОВ ---
    // Основная логика получения прямой ссылки. Мы создаем невидимый iframe с отдельным плеером трека,
    // подменяем в нем методы браузера и ловим ссылку, которую Яндекс пытается воспроизвести.
    // - albumId, trackId: ID необходимых для формирования URL iframe.
    function getDirectLinkViaIframe(albumId, trackId) {
        return new Promise((resolve, reject) => {
            // Формируем URL для iframe. Используем "легкую" версию плеера /iframe/.
            let src = `https://music.yandex.ru/iframe/track/${trackId}`;
            if (albumId) {
                src = `https://music.yandex.ru/iframe/album/${albumId}/track/${trackId}`;
            }

            // Создаем DOM-элемент iframe
            const iframe = document.createElement('iframe');
            // Прячем его за пределами экрана
            Object.assign(iframe.style, { position: 'absolute', left: '-9999px', top: '-9999px' });
            iframe.width = "614"; // Размеры важны для корректной инициализации скриптов Яндекса
            iframe.height = "244";
            iframe.src = src;

            // Ставим тайм-аут 10 секунд: если за это время ссылка не поймана, считаем ошибкой.
            const timeout = setTimeout(() => {
                cleanup();
                reject("Timeout: Iframe молчит");
            }, 10000);

            // Функция очистки: удаляет iframe и таймер.
            function cleanup() {
                if (iframe.parentNode) document.body.removeChild(iframe);
                clearTimeout(timeout);
            }

            // Событие срабатывает, когда iframe загрузил HTML и начал выполнять скрипты.
            iframe.onload = function() {
                try {
                    const iWin = iframe.contentWindow;
                    const iDoc = iframe.contentDocument;

                    // === ГЛАВНЫЙ ПЕРЕХВАТЧИК ===
                    // Мы переопределяем сеттер свойства .src у прототипа HTMLMediaElement.
                    // Это значит, что ЛЮБОЙ аудио или видео элемент в этом iframe, которому попытаются
                    // присвоить ссылку (через audio.src = "..." или setAttribute), попадет в нашу ловушку.
                    const proto = iWin.HTMLMediaElement.prototype;
                    const originalSrcDescriptor = Object.getOwnPropertyDescriptor(proto, 'src');

                    Object.defineProperty(proto, 'src', {
                        get: function() {
                            // Возвращаем реальное значение, если кто-то читает свойство
                            return originalSrcDescriptor ? originalSrcDescriptor.get.call(this) : this.getAttribute('src');
                        },
                        set: function(val) {
                            // val — это ссылка, которую Яндекс пытается поставить в плеер.

                            // Проверяем, похожа ли ссылка на стриминговый поток (содержит 'strm' или 'storage.yandex').
                            if (val && (val.includes('strm') || val.includes('storage.yandex'))) {
                                // ПОПАЛСЯ! Это ссылка на mp3/aac.
                                resolve(val); // Возвращаем ссылку
                                cleanup(); // Сразу уничтожаем iframe, чтобы звук не начал играть
                                return;
                            }

                            // Если это не аудио-поток (например, картинка или пустая строка),
                            // пробрасываем вызов оригинальному методу, чтобы не сломать логику плеера.
                            if (originalSrcDescriptor) {
                                originalSrcDescriptor.set.call(this, val);
                            } else {
                                this.setAttribute('src', val);
                            }
                        },
                        configurable: true
                    });

                    // === ЭМУЛЯЦИЯ ДЕЙСТВИЙ ПОЛЬЗОВАТЕЛЯ ===
                    // Чтобы Яндекс начал загружать трек, нужно нажать Play.
                    // Ищем кнопку Play по разным селекторам.
                    const playBtn = iDoc.querySelector('.player-controls__btn_play')
                                 || iDoc.querySelector('[class*="play"]')
                                 || iDoc.querySelector('.button-play');

                    if (playBtn) {
                        playBtn.click();
                    } else if (iWin.externalAPI) {
                         // Если кнопки нет в DOM, пробуем API
                         iWin.externalAPI.togglePause(true);
                    } else {
                         // Поиск по SVG иконке (треугольник Play), если классы изменились
                         const svgPlay = iDoc.querySelector('svg path[d*="M8 5v14l11-7z"]');
                         if(svgPlay) {
                             // Кликаем по кнопке-родителю SVG
                             let p = svgPlay.parentNode;
                             while(p && p.tagName !== 'BUTTON') p = p.parentNode;
                             if(p) p.click();
                         }
                    }

                } catch (e) {
                    cleanup();
                    reject(e);
                }
            };

            // Добавляем iframe в документ, чтобы он начал загружаться
            document.body.appendChild(iframe);
        });
    }

    // --- КАТЕГОРИЯ: ЗАГРУЗКА ЧЕРЕЗ API (API MODE) ---
    // Получение ссылки через официальное (но закрытое) API мобильных приложений.
    // Требует правильной подписи запроса (sign) и соли.
    async function getDirectLinkViaAPI(trackId) {
        // 1. Формируем запрос на получение информации о файле
        const ts = Math.floor(Date.now() / 1000); // Текущий timestamp
        const path = `/handlers/track/${trackId}/web-album_track-track-track-main/download/m?ts=${ts}`;
        const signVal = sign(path); // Генерируем подпись: MD5(SALT + path)

        const apiUrl = `https://music.yandex.ru/api/v2.1${path}&sign=${signVal}&external-domain=music.yandex.ru&overembed=no&__t=${ts}`;
        console.log(`[DL-API] Requesting JSON: ${apiUrl}`);

        try {
            const resp = await fetch(apiUrl, {
                headers: {
                    'X-Retpath-Y': 'https://music.yandex.ru/',
                    'X-Yandex-Music-Client': 'YandexMusic/4820', // Имитируем клиент
                }
            });
            if (!resp.ok) throw new Error(`API Info Error: ${resp.status}`);

            const data = await resp.json();
            // API возвращает ссылку на XML/JSON, где лежит реальный путь к mp3.
            // Пример: src: "https://storage.mds.yandex.net/get-mp3/..."
            if (!data.src) throw new Error("API не вернул src");

            const storageUrl = data.src + "&format=json";
            console.log(`[DL-API] Storage URL: ${storageUrl}`);

            // 2. Запрашиваем реальный адрес файла у storage-сервера
            const storageResp = await fetch(storageUrl);
            if (!storageResp.ok) throw new Error(`Storage Error: ${storageResp.status}`);
            const storageData = await storageResp.json();

            // 3. Формируем финальную ссылку на скачивание (защищенную солью storage-сервера)
            // Формат: https://{host}/get-mp3/{hash}/{ts}/{path}
            // Хеш считается от конкатенации полей, плюс секретная соль "XGRlBW9FXlekgbPrRHuSiA" (она тут тоже работает).
            // NOTE: Обычно соль для storage отличается, но попробуем стандартную хеш-функцию.
            // Хеш = MD5("XGRlBW9FXlekgbPrRHuSiA" + path.substr(1) + s)

            const salt = "XGRlBW9FXlekgbPrRHuSiA";
            const hash = MD5(salt + storageData.path.substring(1) + storageData.s);

            const finalUrl = `https://${storageData.host}/get-mp3/${hash}/${storageData.ts}${storageData.path}`;
            console.log(`[DL-API] Final URL: ${finalUrl}`);

            return finalUrl;

        } catch (e) {
            console.error("[DL-API] Fail:", e);
            throw e;
        }
    }

    // --- КАТЕГОРИЯ: УПРАВЛЕНИЕ ЗАГРУЗКОЙ (Dual Mode Manager) ---
    // Управляет выбором метода (iframe или api) и логикой переключения при ошибках.
    async function downloadManager(trackInfo) {
        let method = CONFIG.downloadMethod;

        // Определяем приоритетный метод.
        // Меняем 'iframe' на 'api', чтобы в режиме auto сначала пробовался API.
        let primary = 'api';
        if (method === 'iframe') primary = 'iframe';

        // Массив попыток: [первый метод, второй метод (если нужен fallback)]
        let attemptOrder = [primary];
        if (method === 'auto') {
            attemptOrder.push(primary === 'iframe' ? 'api' : 'iframe');
        }

        for (const currentMethod of attemptOrder) {
            console.log(`[DL] Попытка метода: ${currentMethod}`);
            try {
                if (currentMethod === 'iframe') {
                    // Iframe работает через промис с тайм-аутом внутри
                    return await getDirectLinkViaIframe(trackInfo.albumId, trackInfo.trackId);
                } else {
                    // API метод
                    return await getDirectLinkViaAPI(trackInfo.trackId);
                }
            } catch (err) {
                 console.warn(`[DL] Метод ${currentMethod} не сработал:`, err);
                 // Если это была последняя попытка, пробрасываем ошибку дальше
                 if (currentMethod === attemptOrder[attemptOrder.length - 1]) {
                     throw err;
                 }
                 console.log("[DL] Fallback -> переключаемся на следующий метод...");
            }
        }
        return null;
    }

    // Скачивание полученной ссылки. Используется Fetch API для создания Blob,
    // чтобы браузер позволил сохранить файл с нужным нам именем (Исполнитель - Трек).
    // - url: Прямая ссылка на аудиофайл.
    // - filename: Желаемое имя файла.
    async function downloadFile(url, filename) {
        // Убираем запрещенные символы из имени файла
        const cleanFilename = filename.replace(/[<>:"/\\|?*]/g, '');
        console.log(`[DL] Saving as: ${cleanFilename}`);

        try {
            // Загружаем файл в память браузера
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            // Создаем объект Blob (бинарные данные)
            const blob = await response.blob();
            // Создаем временную ссылку на этот Blob
            const blobUrl = window.URL.createObjectURL(blob);

            // Создаем невидимую ссылку <a> для инициации скачивания
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = cleanFilename; // Атрибут download работает корректно с blob-ссылками
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();

            // Чистим мусор через 2 секунды
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(blobUrl);
            }, 2000);

        } catch (e) {
            console.error("[DL] Blob method failed, fallback:", e);
            // Если Fetch не сработал (например, CORS), пробуем просто открыть ссылку.
            // Имя файла в этом случае может быть некорректным (как на сервере).
            const a = document.createElement('a');
            a.href = url;
            a.download = cleanFilename;
            a.target = '_blank';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => document.body.removeChild(a), 1000);
        }
    }

    // --- КАТЕГОРИЯ: ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
    // Управление состоянием кнопки (иконка скачивания <-> спиннер загрузки).
    function setLoading(btn, isLoading) {
        if (isLoading) {
            btn.classList.add('loading');
            btn.querySelector('span').innerHTML = CONFIG.loadingSvg;
        } else {
            btn.classList.remove('loading');
            btn.querySelector('span').innerHTML = CONFIG.iconSvg;
        }
    }

    // --- КАТЕГОРИЯ: КРИПТОГРАФИЯ (MD5 & Sign) ---
    // Реализация алгоритма MD5 и функции подписи запросов.
    // "Соль" (SALT) — это секретная строка, которая добавляется к пути запроса перед хешированием.
    // Она необходима, чтобы сервер Яндекса принял запрос как легитимный (от официального клиента/браузера).
    const SALT = "XGRlBW9FXlekgbPrRHuSiA"; // Стандартная соль для веб-версии

    // Функция подписи. Принимает путь к ресурсу (например, "/get-track-info/...")
    // Возвращает MD5-хеш от строки "соль + путь + длина_пути(если нужно, но обычно просто соль+строка)".
    // В данном случае стандартная подпись: MD5(salt + path).
    function sign(path) {
        return MD5(SALT + path);
    }

    // Реализация алгоритма MD5.
    // Используется для формирования параметра `sign`.
    var MD5 = function (string) {
        function RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }
        function AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000); lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000); lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            if (lX4 | lY4) {
                if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            } else return (lResult ^ lX8 ^ lY8);
        }
        function F(x, y, z) { return (x & y) | ((~x) & z); }
        function G(x, y, z) { return (x & z) | (y & (~z)); }
        function H(x, y, z) { return (x ^ y ^ z); }
        function I(x, y, z) { return (y ^ (x | (~z))); }
        function FF(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }
        function GG(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }
        function HH(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }
        function II(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }
        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        }
        function WordToHex(lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        }
        var x = ConvertToWordArray(string);
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
            AA = a; BB = b; CC = c; DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x02441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x04881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }
        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
        return temp.toLowerCase();
    };

    // Пример использования (для отладки):
    // console.log("[MD5 Test] Salted sign for 'info':", sign("info"));

    // Запуск скрипта
    init();

})();