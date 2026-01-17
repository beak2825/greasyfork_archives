// ==UserScript==
// @name         триплЭсс Card Master
// @namespace    asstars.tv
// @version      21
// @description  1)Показывает спрос на карты
// @description  2)Показывает дубликаты карт
// @description  3)Отправляет карты в Ненужное
// @description  4)Собирает карты с просмотра видео.
// @description  5)Собирает кристаллы на странице Аниме.


// @match        https://asstars.tv/*
// @match        https://animestars.org/*
// @match        https://astars.club/*
// @match        https://asstars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://as1.astars.club/*
// @match        https://as1.asstars.tv/*
// @match        https://as2.asstars.tv/*
// @match        https://asstars.online/*
// @match        https://animesss.tv/*
// @match        https://animesss.com/*

// @grant        GM_getValue
// @grant         GM_setValue
// @grant        GM_addStyle
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @exclude      *://*/*emotions.php*
// @grant        GM_openInTab

// @license MIT
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/553688/%D1%82%D1%80%D0%B8%D0%BF%D0%BB%D0%AD%D1%81%D1%81%20Card%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/553688/%D1%82%D1%80%D0%B8%D0%BF%D0%BB%D0%AD%D1%81%D1%81%20Card%20Master.meta.js
// ==/UserScript==

// --- getAssTarsCardMasterRequestCount() --- прописать в консоле что-бы узнать общее кол-во запросов.

// =========================================================================
// БЛОК ГЛОБАЛЬНЫХ ПЕРЕМЕННЫХ И НАСТРОЕК СКРИПТА!
// =========================================================================

// -------------------- ОБЩИЕ КОНСТАНТЫ --------------------
const DELAY = 60; // Общая задержка в миллисекундах (мс), используемая в различных частях скрипта для пауз.
const NOTIFICATION_ANIMATION_DURATION_MS = 400; // Задает длительность анимации (в мс) для появления и скрытия кастомных уведомлений.
const CARD_CLASSES_SELECTORS = '.remelt__inventory-item, .lootbox__card, .anime-cards__item, .trade__inventory-item, .trade__main-item, .card-filter-list__card, .deck__item, .history__body-item, .card-show__placeholder'; // CSS-селектор, который находит все возможные DOM-элементы карточек на разных страницах.

// -------------------- ОПРЕДЕЛЕНИЕ СТРАНИЦ --------------------
const ANIME_PLAYER_BUTTON_SELECTOR = '.anime-player__fullscreen-btn'; // CSS-селектор для определения страницы просмотра аниме.
const ANIME_PAGE_PATH_IDENTIFIER = '/aniserials/'; // Часть URL для самой ранней проверки страницы (в фиксере плеера).
const isAnimePage = () => document.querySelector(ANIME_PLAYER_BUTTON_SELECTOR) !== null; // Функция, проверяющая, является ли страница страницей аниме.

// -------------------- КОНСТАНТЫ КЭША И ХРАНИЛИЩА --------------------
const OWNER_TO_TYPE_CACHE_KEY = 'ownerToTypeMapCache_GM'; // Ключ для хранения в GM_storage кэша, связывающего ID экземпляра карты (ownerId) с ID её типа (typeId).
const CACHE_TTL_STORAGE_KEY = 'ascm_cache_ttl_hours'; // Ключ для хранения в GM_storage настройки времени жизни (TTL) кэша спроса на карты в часах.
const DEFAULT_CACHE_TTL_HOURS = 72; // Время жизни кэша по умолчанию в часах (72 часа = 3 дня), если не задано пользователем.
const OWNER_ID_CACHE_TTL_HOURS = 720; // Время жизни кэша для связей ID экземпляра и типа карты. 30 дней * 24 часа = 720 часов.

// -------------------- ОБЩИЕ ПЕРЕМЕННЫЕ СОСТОЯНИЯ --------------------
let scriptInitialized = false; // Флаг, предотвращающий повторную инициализацию всего скрипта, если он уже был запущен.
let isLeaderWatch = false; // Флаг, показывающий, является ли текущая вкладка "лидером" для выполнения фоновых задач (например, авто-сбора карт с просмотра видео).
const currentUrlParams = new URLSearchParams(window.location.search); // Объект для удобного доступа к GET-параметрам текущего URL.
const isTradePreviewIframe = currentUrlParams.get('as_preview_iframe') === 'true'; // Флаг, определяющий, является ли страница специальным iframe для предпросмотра трейда.

// -------------------- МОДУЛЬ: КАСТОМНЫЕ УВЕДОМЛЕНИЯ --------------------
let currentNotificationElement = null; // Ссылка на DOM-элемент текущего активного кастомного уведомления для управления им.
let currentNotificationTimeout = null; // ID таймера (setTimeout) для автоматического скрытия текущего уведомления. Позволяет отменять его.

// -------------------- МОДУЛЬ: АВТО-ПРОВЕРКА ПАКОВ И СПРОСА --------------------
let autoPackCheckEnabled = localStorage.getItem('autoPackCheckEnabledState') === 'true'; // Состояние (вкл/выкл) функции автоматической проверки дубликатов на странице паков.
let autoDemandCheckEnabled = localStorage.getItem('autoDemandCheckEnabledState') === 'true'; // Состояние (вкл/выкл) функции автоматической проверки спроса на A/S карты на странице паков.
let lastProcessedPackIdForAutoCheck = null; // Хранит ID последнего пака, для которого была запущена авто-проверка дублей, чтобы избежать повторных запусков.
let lastProcessedPackIdForDemandCheck = null; // Хранит ID последнего пака, для которого была запущена авто-проверка спроса, чтобы избежать повторных запусков.
let autoPackCheckButtonElement = null; // Ссылка на DOM-элемент кнопки включения/выключения авто-проверки дублей.
let packPageObserver = null; // Экземпляр MutationObserver, который следит за появлением новых паков на странице.
let isProcessingBuyClick = false; // Флаг-блокировщик, который становится `true` сразу после клика на покупку пака, чтобы приостановить другие проверки.

// -------------------- МОДУЛЬ: МАССОВАЯ ПРОВЕРКА СПРОСА --------------------
let isProcessCardsRunning = false; // Флаг, показывающий, что в данный момент уже запущена массовая проверка спроса.
let shouldStopProcessCards = false; // Флаг, который устанавливается в `true`, чтобы остановить текущий цикл проверки спроса.
let originalProcessCardsColor = ''; // Хранит исходный цвет кнопки проверки спроса, чтобы вернуть его после завершения процесса.

// -------------------- МОДУЛЬ: МАССОВАЯ ПРОВЕРКА ДУБЛИКАТОВ --------------------
let массоваяПроверкаДублейЗапущена = false; // Флаг, показывающий, что запущена массовая проверка дубликатов.
let массоваяПроверкаДублейНаПаузе = false; // Флаг для постановки на паузу массовой проверки дубликатов.
let индексПоследнейПровереннойКарты = 0; // Счетчик, отслеживающий, сколько карт уже было проверено в текущей сессии.
let массивКартДляПроверки = []; // Массив DOM-элементов карт, которые нужно проверить на дубликаты.
let idТаймаутаСледующегоБатча = null; // ID таймера для запуска проверки следующей порции (batch) карт.
let isProcessingAutoPackCheck = false; // Флаг, который указывает, что проверка дублей была вызвана автоматически на странице паков.

// -------------------- МОДУЛЬ: ОТПРАВКА В "НЕ НУЖНОЕ" --------------------
let isAutoChargeRunning = false; // Флаг, показывающий, что в данный момент запущена массовая отправка карт в "Не нужное".
let shouldStopProcessing = false; // Флаг, который устанавливается в `true`, чтобы остановить текущий цикл отправки карт.
let originalReadyToChargeColor = ''; // Хранит исходный цвет кнопки отправки, чтобы вернуть его после завершения.

// -------------------- МОДУЛЬ: СБОР КРИСТАЛЛОВ --------------------
const CRYSTAL_RESET_INTERVAL_DAYS = 30; // Период авто-сброса счетчиков в днях.
const CRYSTAL_SCRIPT_ENABLED_KEY = 'gm_crystalScriptEnabled'; // Ключ для хранения в GM_storage состояния (вкл/выкл) сбора кристаллов.
const notificationSound = new Audio('/uploads/asss.mp3'); // Объект аудио для звукового уведомления при сборе.
let crystalScriptEnabled = false; // Текущее состояние (вкл/выкл) модуля сбора кристаллов.
let clickOnCrystalsTimeoutId = null; // ID таймера для периодического поиска и клика по кристаллам в чате.
let preventTimeoutTimeoutId = null; // ID таймера для предотвращения выхода из чата по тайм-ауту (AFK).
let checkHeavenlyStoneIntervalIds = []; // Массив ID интервалов для проверки зачисления камней через страницу транзакций.
let crystalInfoPanel = null; // Ссылка на DOM-элемент панели с информацией о собранных кристаллах.
let crystalPanelColorResetTimeout = null; // ID таймера для сброса подсветки панели кристаллов.

// -------------------- МОДУЛЬ: СБОР КРИСТАЛЛОВ (СЧЕТЧИКИ И СОСТОЯНИЕ) --------------------
// --- НОВЫЕ ПЕРЕМЕННЫЕ ДЛЯ ОПТИМИЗАЦИИ ---
const CRYSTAL_CACHE_LIMIT = 2000; // Ограничиваем кэш ID сообщений до 2000 записей
let lastClickedIds = new Set(); // Используем Set для быстрого поиска ID (O(1) вместо O(n))
let lastClickedQueue = []; // Очередь для отслеживания старых ID и их удаления
let chatObserver = null; // Переменная для нашего нового наблюдателя за чатом
// --- СТАРЫЕ ПЕРЕМЕННЫЕ ---
let clickedCrystals = 0; // Счетчик кликов по кристаллам за сессию.
let collectedStones = 0; // Счетчик подтвержденных собранных камней за сессию.
let soundEnabled = false; // Состояние (вкл/выкл) звукового уведомления при сборе.
let isCrystalScriptCurrentlyRunning = false; // Запоминает, активен ли сбор прямо сейчас.

// -------------------- МОДУЛЬ: АВТО-СБОР КАРТ С ПРОСМОТРА (Auto-Watch) --------------------
let autoCollectButtonCounter = null; // Ссылка на DOM-элемент счетчика на главной кнопке.
let manualCardCountCheckInProgress = false; // Флаг для защиты от частых кликов по счетчику.
const CARD_COUNT_CACHE_KEY = 'avw_cardCountCache'; // Ключ для хранения счетчика в GM.
const CARD_COUNT_SYNC_KEY = 'avw_cardCountSync'; // <-- НОВЫЙ КЛЮЧ для синхронизации
const CARD_COUNT_CACHE_TTL = 30 * 60 * 1000; // 30 минут - время жизни кэша счетчика.
let cardCountElement = null; // Ссылка на DOM-элемент счетчика карт.
let lastCardCountCheckTime = 0; // Время последней проверки счетчика карт.
const CARD_COUNT_UPDATE_INTERVAL = 30 * 60 * 1000; // 30 минут для фоновой проверки.
const STORAGE_KEY_WATCH = 'scriptEnabled'; // Ключ в localStorage для состояния вкл/выкл модуля.
const LEADER_KEY_WATCH = 'scriptLeader_avw'; // Ключ в localStorage для определения "лидера" среди вкладок.
const HEARTBEAT_INTERVAL_WATCH = 5000; // Интервал проверки "пульса" для не-лидеров.
const LEADER_HEARTBEAT_INTERVAL_WATCH = 5000; // Интервал обновления "пульса" для лидера.
const LEADER_TIMEOUT_WATCH = 10000; // Время, после которого лидер считается "мертвым".
const HOURLY_PAUSE_KEY_PREFIX_WATCH = 'avw_cardCheckPaused_'; // Префикс ключа в GM для часовой паузы.
const CHECK_NEW_CARD_INTERVAL = 90000; // Основной интервал между запросами на получение карты.
const LAST_SUCCESSFUL_REQUEST_KEY_WATCH = 'avw_lastSuccessfulRequestTime'; // Ключ в GM для глобального таймера запросов.
const NOTIFY_NEW_CARD_KEY_WATCH = 'avw_notifyNewCard'; // Ключ в GM для межвкладочных уведомлений о картах.
let scriptEnabledWatch = localStorage.getItem(STORAGE_KEY_WATCH) === 'true'; // Текущее состояние (вкл/выкл) авто-сбора.
let heartbeatIntervalId = null; // ID интервала для "пульса" лидерства.
let checkNewCardTimeoutId = null; // ID таймаута для основного цикла проверки карт.
let lastNotificationTimestamp = 0; // Временная метка последнего показанного уведомления о карте.

// -------------------- МОДУЛЬ: НАСТРОЙКИ АВТО-ПРОВЕРКИ ДУБЛЕЙ (ПАКИ) --------------------
const AUTO_DUP_SETTINGS_KEY = 'autoDuplicateCheckSettings_v1'; // Ключ в GM для хранения настроек.
const checkableRanks = ['a', 'b', 'c', 'd', 'e']; // Ранги, доступные для настройки.
const defaultSettings = { a: false, b: false, c: true, d: true, e: true }; // Настройки по умолчанию.
let settingsModalWrapper = null; // Ссылка на DOM-элемент обертки модального окна настроек.

// -------------------- МОДУЛЬ: КАСТОМНЫЕ ЗАКЛАДКИ (ASBM) --------------------
const ASBM_FEATURE_ENABLED_KEY = 'asbm_feature_enabled'; // Ключ в GM для состояния вкл/выкл модуля.
const ASBM_HEADER_SELECTOR = 'header.header'; // CSS-селектор шапки сайта для позиционирования панели.
const ASBM_USER_BOOKMARKS_STORAGE_KEY = 'asbm_user_bookmarks_v13'; // Ключ в GM для хранения пользовательских закладок.
const ASBM_RESPONSIVE_BREAKPOINT_PX = 800; // Ширина экрана, при которой скрываются текстовые метки.

// -------------------- МОДУЛЬ: УПРАВЛЕНИЕ ВИДИМОСТЬЮ КНОПОК --------------------
let areActionButtonsHidden = localStorage.getItem('actionButtonsHiddenState') === 'true'; // Состояние (скрыты/показаны) боковых кнопок управления.
const managedButtonSelectors = [ // Массив CSS-селекторов всех кнопок, управляемых переключателем видимости.
    '#processCards', '#processAllPagesBtn', '#clearPageCacheBtn', '#readyToCharge', '#toggleScriptButton',
    '#promoButton', '#check-all-duplicates-btn', '#autoPackCheckButton', '#autoDemandCheckButton',
    '#toggleCrystalScript', '#maxWidthSliderContainer', '#crystal-info-panel'
];
let toggleButtonElement = null; // Ссылка на DOM-элемент самой кнопки-переключателя видимости.

// -------------------- МОДУЛЬ: СЛАЙДЕР ШИРИНЫ СТРАНИЦЫ --------------------
const DEFAULT_MAX_WIDTH_SLIDER = 1285; // Значение ширины страницы по умолчанию в пикселях.
const MAX_WIDTH_STORAGE_KEY_SLIDER = 'pageMaxWidthSettingSlider'; // Ключ для хранения в localStorage выбранной ширины страницы.
let maxWidthSliderElement = null; // Ссылка на DOM-элемент самого ползунка (input type="range").
let maxWidthValueDisplayElement = null; // Ссылка на DOM-элемент, где отображается текущее значение ширины (e.g., "1285px").
let dynamicPageStylesElement = null; // Ссылка на DOM-элемент <style>, куда динамически добавляются CSS-правила для изменения ширины.

// -------------------- МОДУЛЬ: КАСТОМНЫЙ ФОН --------------------
let bgSettings = null; // Объект настроек фона (активный, список источников). Инициализируется позже.
let stylesEnabled = localStorage.getItem('stylesEnabled') !== 'false'; // Состояние (вкл/выкл) кастомного фона.

// -------------------- МОДУЛЬ: ЗАЩИТА КАРТ В ПАКАХ --------------------
const PROTECTOR_SETTINGS_KEY = 'cardPackProtectorSettings_v3'; // Ключ для хранения в GM_storage настроек защиты карт.
const PROTECTOR_RANK_HIERARCHY = { 'ass': 7, 's': 6, 'a': 5, 'b': 4, 'c': 3, 'd': 2, 'e': 1 }; // Иерархия рангов для определения "ценности" карты.
const PROTECTOR_PROTECTABLE_RANKS = ['ass', 's', 'a', 'b', 'c', 'd']; // Список рангов, для которых можно включить защиту.
const PROTECTOR_DEFAULT_SETTINGS = { ass: true, s: true, a: false, b: false, c: false, d: false }; // Настройки защиты по умолчанию.

// -------------------- МОДУЛЬ: ПРОВЕРКА ДУБЛИКАТОВ (ВНУТРЕННИЙ КЭШ) --------------------
const cardInfoCache = new Map(); // Кэш для данных карт (имя, Аниме) при проверке дублей.
const duplicatesCache = new Map(); // Кэш количества дубликатов для своего инвентаря.
let showDuplicateCheckNotifications = true; // Флаг, разрешающий показ уведомлений при массовой проверке дублей.
// =========================================================================
// КОНЕЦ БЛОКА ГЛОБАЛЬНЫХ ПЕРЕМЕННЫХ
// =========================================================================

// =========================================================================
// ПРЕВЕНТИВНЫЙ ФИКСЕР ПЛЕЕРА (COOKIE + NO_DATA)
// =========================================================================
(function() {
    'use strict';
    const isAnimePageByURL = /^\/\d+-[a-z0-9-]+\.html$/.test(window.location.pathname);
    if (!isAnimePageByURL) {
        return;
    }

    // --- ЧАСТЬ 1: Немедленная проверка Cookie ---
    // Этот код выполняется до полной загрузки страницы
    const currentCookie = document.cookie;
    const isNewPlayerSelectedInCookie = currentCookie.includes('dle_player_fhd=cdn-tab-player');

    let pageReloaded = false;

    // MutationObserver для ранней проверки DOM
    const observer = new MutationObserver(() => {
        const newPlayerTab = document.querySelector('.new-cdn-player');
        const kodikPlayerTab = document.getElementById('kodik-tab');

        // Если элементы плеера появились, мы можем сделать вывод
        if (kodikPlayerTab) {
            // Если нового плеера нет на странице, а в cookie он выбран - это проблема.
            if (!newPlayerTab && isNewPlayerSelectedInCookie) {
                console.warn('[ACM Player Fix] Cookie указывает на Новый плеер, но его нет на странице. Исправляю и перезагружаю...');
                document.cookie = "dle_player_kodik=kodik-tab-player; path=/"; // Выбираем Кодик
                document.cookie = "dle_player_fhd=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"; // Удаляем сломанный
                pageReloaded = true;
                window.location.reload();
            }
            // Если все в порядке, отключаемся
            observer.disconnect();
        }
    });

    // Начинаем следить как можно раньше
    observer.observe(document.documentElement, { childList: true, subtree: true });


    // --- ЧАСТЬ 2: Страховка через событие noData ---
    // Этот код сработает, если проверка cookie не выявила проблему, но она все равно возникла
    document.addEventListener('DOMContentLoaded', () => {
        // Если страница уже была перезагружена, ничего не делаем
        if (pageReloaded) return;

        const playerElement = document.getElementById('myPlayer');
        if (playerElement) {
            const noDataHandler = () => {
                console.warn('[ACM Player Fix] Получен сигнал "noData". Плеер неисправен.');
                const kodikTab = document.getElementById('kodik-tab');
                if (kodikTab && !kodikTab.classList.contains('is-active')) {
                    console.log('[ACM Player Fix] Принудительно переключаюсь на "Кодик плеер" через jQuery.');
                    if (typeof unsafeWindow.$ === 'function') {
                        unsafeWindow.$('#kodik-tab').trigger('click');
                    } else {
                        kodikTab.click();
                    }
                }
            };
            playerElement.addEventListener('noData', noDataHandler, { once: true });
        }
    });
})();

// Глобальные стили для режима кинотеатра (fscr-active)
// Эти стили вынесены из модуля закладок, чтобы они работали всегда,
// даже если закладки отключены в настройках. Это решает проблему
// с исчезновением панели кристаллов.
GM_addStyle(`
    body.fscr-active #clearPageCacheBtn,
    body.fscr-active #asbm_bar,
    body.fscr-active #processCards,
    body.fscr-active #readyToCharge,
    body.fscr-active #clearCacheButton,
    body.fscr-active #check-all-duplicates-btn,
    body.fscr-active #autoPackCheckButton,
    body.fscr-active #maxWidthSliderContainer,
    body.fscr-active #bg-control-panel {
        display: none !important;
    }

    body.fscr-active #toggleScriptButton,
    body.fscr-active #toggleCrystalScript,
    body.fscr-active #crystal-info-panel,
    body.fscr-active #toggleActionButtonsVisibility {
        z-index: 100001 !important;
    }

    body.fscr-active #crystal-info-panel {
        position: fixed !important;
        bottom: auto !important;
        top: 2px !important;
        right: 2px !important;
    }

    body.fscr-active #toggleScriptButton { top: auto !important; bottom: 200px !important; }
    body.fscr-active #toggleCrystalScript { top: auto !important; bottom: 150px !important; }
    body.fscr-active #toggleActionButtonsVisibility { top: auto !important; bottom: 310px !important; }
`);

// #######################################################################
// БЛОК ДЛЯ AS CARD CONTROL (ПРЕВЬЮ)
// #######################################################################
if (isTradePreviewIframe) {
    GM_addStyle(`
    /* Устанавливаем ширину для карточек в блоках "Вам предлагают" и "Вы отдадите" */
    .trade__main-item {
        width: 140px !important; /* Можете изменить это значение. Стандартное - 160px */
    }
    /*
     * Поднимаем кнопку проверки дубликатов на 100px выше в окне превью,
     * чтобы она не мешала и не перекрывала другие элементы.
     */
    #check-all-duplicates-btn {
        bottom: 220px !important; /* Стандартная позиция 120px + 100px */
    }

    /* Скрываем все ненужные элементы интерфейса в окне превью */
    body, .wrapper-as { background: transparent !important; }
    .wrapper-as { padding-top: 0 !important; }
    .header, footer.footer, .speedbar, .ncard-list, #asbm_bar, .cbtns,
    #notebookToggleButton, #deckToggleBtn, #maxWidthSliderContainer,
    #bg-control-panel, #toggleCrystalScript,
    #toggleActionButtonsVisibility, #toggleScriptButton {
        display: none !important;
    }
`);
}
if (window.self === window.top || isTradePreviewIframe) {


    // #######################################################################
    // Функция перехвата сообщений (запросы в консоле)
    // #######################################################################
    (function() {
    'use strict';
    // =========================================================================
    // ПЕРЕКЛЮЧАТЕЛЬ: true - показывать логи запросов, false - выключить
    const ENABLE_REQUEST_LOGGING = false;
    // =========================================================================
    if (!ENABLE_REQUEST_LOGGING) {
        return;
    }
    let totalRequestsByUnsafeWindow = 0;
    let totalRequestsByWindow = 0;
    const scriptNamePrefix = "Запрос:";
    if (typeof unsafeWindow.fetch === 'function') {
        const originalUnsafeFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = function(...args) {
            totalRequestsByUnsafeWindow++;
            let url = args[0] instanceof Request ? args[0].url : (typeof args[0] === 'string' ? args[0] : '');
            let method = (args[0] instanceof Request ? args[0].method : (args[1] && args[1].method ? args[1].method : 'GET'));
            console.log(`${scriptNamePrefix} [unsafeWindow.FETCH] #${totalRequestsByUnsafeWindow}: ${method} ${url.toString().substring(0, 200)}`);
            return originalUnsafeFetch.apply(this, args);
        };
    } else {
        console.warn(`${scriptNamePrefix} unsafeWindow.fetch не является функцией.`);
    }
    if (typeof window.fetch === 'function' && window.fetch !== unsafeWindow.fetch) {
        const originalWindowFetch = window.fetch;
        window.fetch = function(...args) {
            totalRequestsByWindow++;
            let url = args[0] instanceof Request ? args[0].url : (typeof args[0] === 'string' ? args[0] : '');
            let method = (args[0] instanceof Request ? args[0].method : (args[1] && args[1].method ? args[1].method : 'GET'));
            console.log(`${scriptNamePrefix} [window.FETCH] #${totalRequestsByWindow}: ${method} ${url.toString().substring(0, 200)}`);
            return originalWindowFetch.apply(this, args);
        };
    } else if (typeof window.fetch === 'function' && window.fetch === unsafeWindow.fetch) {
    }
    const xhrUnsafeDataMap = new WeakMap();
    if (typeof unsafeWindow.XMLHttpRequest === 'function') {
        const originalUnsafeXhrOpen = unsafeWindow.XMLHttpRequest.prototype.open;
        const originalUnsafeXhrSend = unsafeWindow.XMLHttpRequest.prototype.send;

        unsafeWindow.XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            xhrUnsafeDataMap.set(this, { method: method, url: url });
            return originalUnsafeXhrOpen.apply(this, [method, url, ...rest]);
        };
        unsafeWindow.XMLHttpRequest.prototype.send = function(...args) {
            const requestData = xhrUnsafeDataMap.get(this);
            if (requestData) {
                totalRequestsByUnsafeWindow++;
                console.log(`${scriptNamePrefix} [unsafeWindow.XHR] #${totalRequestsByUnsafeWindow}: ${requestData.method} ${requestData.url.toString().substring(0,200)}`);
            } else {
                totalRequestsByUnsafeWindow++;
                console.log(`${scriptNamePrefix} [unsafeWindow.XHR] #${totalRequestsByUnsafeWindow}: (Метод/URL не перехвачены через open)`);
            }
            return originalUnsafeXhrSend.apply(this, args);
        };
    } else {
        console.warn(`${scriptNamePrefix} unsafeWindow.XMLHttpRequest не является функцией.`);
    }
    const xhrWindowDataMap = new WeakMap();
    if (typeof window.XMLHttpRequest === 'function' &&
        (typeof unsafeWindow.XMLHttpRequest !== 'function' || window.XMLHttpRequest.prototype.send !== unsafeWindow.XMLHttpRequest.prototype.send)) {
        const originalWindowXhrOpen = window.XMLHttpRequest.prototype.open;
        const originalWindowXhrSend = window.XMLHttpRequest.prototype.send;
        window.XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            xhrWindowDataMap.set(this, { method: method, url: url });
            return originalWindowXhrOpen.apply(this, [method, url, ...rest]);
        };
        window.XMLHttpRequest.prototype.send = function(...args) {
            const requestData = xhrWindowDataMap.get(this);
            if (requestData) {
                totalRequestsByWindow++;
                console.log(`${scriptNamePrefix} [window.XHR] #${totalRequestsByWindow}: ${requestData.method} ${requestData.url.toString().substring(0,200)}`);
            } else {
                totalRequestsByWindow++;
                console.log(`${scriptNamePrefix} [window.XHR] #${totalRequestsByWindow}: (Метод/URL не перехвачены через open)`);
            }
            return originalWindowXhrSend.apply(this, args);
        };
    } else if (typeof window.XMLHttpRequest === 'function' && typeof unsafeWindow.XMLHttpRequest === 'function' && window.XMLHttpRequest.prototype.send === unsafeWindow.XMLHttpRequest.prototype.send) {
    }
    unsafeWindow.getAssTarsCardMasterRequestCount = () => ({
        unsafeWindowRequests: totalRequestsByUnsafeWindow,
        windowRequests: totalRequestsByWindow,
        total: totalRequestsByUnsafeWindow + totalRequestsByWindow
    });
    if (typeof window !== 'undefined') {
        window.getAssTarsCardMasterRequestCountFromWindow = () => ({
            unsafeWindowRequests: totalRequestsByUnsafeWindow,
            windowRequests: totalRequestsByWindow,
            total: totalRequestsByUnsafeWindow + totalRequestsByWindow
        });
    }

})();

// #######################################################################
// КАСТОМНЫЕ СООБЩЕНИЯ
// #######################################################################
    // =======================================================================================
    // УВЕДОМЛЕНИЯ О ПОЛУЧЕННЫХ КАРТАХ (С АВТОПРОСМОТРА)
    // =======================================================================================
    function showCardReceivedNotification(card) {
        if (!card || !card.rank) return;

        const rank = card.rank.toLowerCase();
        const cardName = card.name || 'без имени';
        const message = `✨ Получена карта: ${cardName} [${rank.toUpperCase()}]`;

        let bgColor;
        // Используем ваши цвета
        switch (rank) {
            case 'e': bgColor = 'rgb(156, 111, 81)'; break;
            case 'd': bgColor = 'rgb(153, 151, 151)'; break;
            case 'c': bgColor = 'rgb(11, 91, 65)'; break;
            case 'b': bgColor = 'rgb(32, 148, 228)'; break;
            case 'a': bgColor = 'rgb(217, 49, 52)'; break;
            case 's': bgColor = 'rgb(167, 76, 207)'; break;
            case 'ass': bgColor = 'rgb(119, 44, 232)'; break;
            default: bgColor = 'linear-gradient(145deg, DodgerBlue, RoyalBlue)'; break; // Стандартный цвет для непредвиденных случаев
        }
        if (currentNotificationTimeout) {
            clearTimeout(currentNotificationTimeout);
            currentNotificationTimeout = null;
        }
        if (!currentNotificationElement) {
            currentNotificationElement = document.createElement('div');
            currentNotificationElement.className = 'custom-card-notification';
            Object.assign(currentNotificationElement.style, {
                position: 'fixed',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                padding: '12px 28px',
                borderRadius: '10px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                zIndex: '2147483640',
                fontSize: '15px',
                fontWeight: 'bold',
                textAlign: 'center',
                maxWidth: '90%',
                whiteSpace: 'pre-wrap',
                transition: `top 400ms cubic-bezier(0.68, -0.55, 0.27, 1.55)`
        });
            currentNotificationElement.style.top = '-150px';
            document.body.appendChild(currentNotificationElement);
        }
        currentNotificationElement.textContent = String(message);
        currentNotificationElement.style.background = bgColor;
        currentNotificationElement.dataset.lastShowTime = Date.now().toString();
        if (currentNotificationElement.style.top !== '20px') {
            currentNotificationElement.style.top = '20px';
        } else {
            currentNotificationElement.style.transition = 'opacity 0.1s ease-out';
            currentNotificationElement.style.opacity = '0.85';
            setTimeout(() => { if (currentNotificationElement) currentNotificationElement.style.opacity = '1'; }, 100);
        }
        currentNotificationTimeout = setTimeout(() => {
            if (currentNotificationElement) {
                currentNotificationElement.style.top = '-150px';
            }
            currentNotificationTimeout = null;
        }, 4000);
    }

    // =======================================================================================
    // УВЕДОМЛЕНИЯ О РЕДКИХ КАРТАХ
    // =======================================================================================
    function showHighRankCardNotification(rank) {
        let message = '';
        let bgColor = '';
        if (rank.toLowerCase() === 'a') {
            message = `✨ Поздравляем! Вам выпала карта ранга A! ✨`;
            bgColor = 'linear-gradient(145deg, rgb(217, 49, 52), rgb(180, 40, 45))';
        } else if (rank.toLowerCase() === 's') {
            message = `🌟 ПОЗДРАВЛЯЕМ! Вам выпала карта ранга S! 🌟`;
            bgColor = 'linear-gradient(145deg, rgb(167, 76, 207), rgb(140, 60, 180))';
        } else {
            return;
        }
        if (currentNotificationTimeout) {
            clearTimeout(currentNotificationTimeout);
            currentNotificationTimeout = null;
        }
        if (!currentNotificationElement) {
            currentNotificationElement = document.createElement('div');
            currentNotificationElement.className = 'custom-card-notification';
            Object.assign(currentNotificationElement.style, {
                position: 'fixed',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                padding: '12px 28px',
                borderRadius: '10px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                zIndex: '2147483640',
                fontSize: '15px',
                fontWeight: 'bold',
                textAlign: 'center',
                maxWidth: '90%',
                whiteSpace: 'pre-wrap',
                transition: `top 400ms cubic-bezier(0.68, -0.55, 0.27, 1.55)`
        });
            currentNotificationElement.style.top = '-150px';
            document.body.appendChild(currentNotificationElement);
        }
        currentNotificationElement.textContent = String(message);
        currentNotificationElement.style.background = bgColor;
        currentNotificationElement.dataset.lastShowTime = Date.now().toString();
        if (currentNotificationElement.style.top !== '20px') {
            currentNotificationElement.style.top = '20px';
        } else {
            currentNotificationElement.style.transition = 'opacity 0.1s ease-out';
            currentNotificationElement.style.opacity = '0.85';
            setTimeout(() => { if (currentNotificationElement) currentNotificationElement.style.opacity = '1'; }, 100);
        }
        currentNotificationTimeout = setTimeout(() => {
            if (currentNotificationElement) {
                currentNotificationElement.style.top = '-150px';
            }
            currentNotificationTimeout = null;
        }, 4000); //Время которое будет висеть уведомление
    }

    // #######################################################################
    // # Отображает кастомное уведомление вверху экрана с заданным сообщением и типом.
    // #######################################################################
    function showNotification(message, type = 'info') {
        if (currentNotificationTimeout) {
            clearTimeout(currentNotificationTimeout);
            currentNotificationTimeout = null;
        }
        if (!currentNotificationElement) {
            currentNotificationElement = document.createElement('div');
            currentNotificationElement.className = 'custom-card-notification';
            Object.assign(currentNotificationElement.style, {
                position: 'fixed',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                padding: '12px 28px',
                borderRadius: '10px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                zIndex: '100000',
                fontSize: '15px',
                fontWeight: 'bold',
                textAlign: 'center',
                maxWidth: '90%',
                whiteSpace: 'pre-wrap',
                transition: `top ${NOTIFICATION_ANIMATION_DURATION_MS}ms cubic-bezier(0.68, -0.55, 0.27, 1.55)`
    });
            currentNotificationElement.style.top = '-150px';
            document.body.appendChild(currentNotificationElement);
        }
        currentNotificationElement.textContent = String(message);
        let bgColor;
        switch (type) {
            case 'success': bgColor = 'linear-gradient(145deg, LawnGreen, SeaGreen)'; break;
            case 'error': bgColor = 'linear-gradient(145deg, Tomato, Crimson)'; break;
            case 'warning': bgColor = 'linear-gradient(145deg, Gold, DarkOrange)'; break;
            case 'info':
            default: bgColor = 'linear-gradient(145deg, DodgerBlue, RoyalBlue)'; break;
        }
        currentNotificationElement.style.background = bgColor;
        currentNotificationElement.dataset.lastShowTime = Date.now().toString();
        if (currentNotificationElement.style.top !== '20px') {
            currentNotificationElement.style.transition = `top ${NOTIFICATION_ANIMATION_DURATION_MS}ms cubic-bezier(0.68, -0.55, 0.27, 1.55)`;
            currentNotificationElement.style.top = '20px';
        } else {
            currentNotificationElement.style.transition = 'opacity 0.1s ease-out';
            currentNotificationElement.style.opacity = '0.85';
            setTimeout(() => {
                if (currentNotificationElement) currentNotificationElement.style.opacity = '1';
            }, 100);
        }
        const displayDuration = type === 'error' ? 5000 : (type === 'warning' ? 4000 : 3500);
        currentNotificationTimeout = setTimeout(() => {
            if (currentNotificationElement) {
                currentNotificationElement.style.transition = `top ${NOTIFICATION_ANIMATION_DURATION_MS}ms cubic-bezier(0.68, -0.55, 0.27, 1.55)`;
                currentNotificationElement.style.top = '-150px';
            }
            currentNotificationTimeout = null;
        }, displayDuration);
    }

    // #######################################################################
    // # Создает "безопасный" объект для вызова уведомлений, который использует кастомные уведомления или console.log в качестве запасного варианта.
    // #######################################################################
    function getEffectiveDLEPush() {
        return {
            info: (message) => {
                if (typeof showNotification === 'function') showNotification(String(message), 'info');
                else console.info("[FALLBACK_INFO]", message);
            },
            success: (message) => {
                if (typeof showNotification === 'function') showNotification(String(message), 'success');
                else console.info("[FALLBACK_SUCCESS]", message);
            },
            error: (message) => {
                if (typeof showNotification === 'function') showNotification(String(message), 'error');
                else console.error("[FALLBACK_ERROR]", message);
            },
            warning: (message) => {
                if (typeof showNotification === 'function') showNotification(String(message), 'warning');
                else console.warn("[FALLBACK_WARNING]", message);
            },
            warn: (message) => { // Псевдоним
                if (typeof showNotification === 'function') showNotification(String(message), 'warning');
                else console.warn("[FALLBACK_WARN]", message);
            }
        };
    }

    // #######################################################################
    // # Безопасно вызывает метод кастомной системы уведомлений, предотвращая ошибки.
    // #######################################################################
    function safeDLEPushCall(methodName, message) {
        const DLEPushAPI = getEffectiveDLEPush();
        const messageString = (typeof message === 'undefined' || message === null) ? `(Сообщение не определено)` : String(message);
        let actualMethodName = methodName;
        if (methodName === 'warning' && typeof DLEPushAPI.warning !== 'function' && typeof DLEPushAPI.warn === 'function') {
            actualMethodName = 'warn';
        } else if (methodName === 'warn' && typeof DLEPushAPI.warn !== 'function' && typeof DLEPushAPI.warning === 'function') {
            actualMethodName = 'warning';
        }
        if (typeof DLEPushAPI[actualMethodName] === 'function') {
            DLEPushAPI[actualMethodName](messageString);
        } else {
            console.error(`[AssTars Card Master] Критическая ошибка: DLEPushAPI.${actualMethodName} не является функцией. Сообщение: ${messageString}`);
            console.log(`[RAW_FALLBACK ${methodName}]: ${messageString}`);
        }
    }
    unsafeWindow.safeDLEPushCall = safeDLEPushCall;

// #######################################################################
// # Скрипт перехвата DLEPush
// #######################################################################
    (function() {
        'use strict';
        const createOverriddenNotifier = (type) => (message) => {
            if (typeof message === 'undefined') {
                console.warn(`[UserScript Intercept] DLEPush.${type} вызван с undefined. Уведомление не показано.`);
                return;
            }
            const dlePushContainer = document.getElementById('DLEPush');
            if (dlePushContainer) {
                const originalNotifications = Array.from(dlePushContainer.querySelectorAll('.DLEPush-notification.wrapper'));
                originalNotifications.forEach(originalNode => {
                    if (originalNode.style.display !== 'none' && !originalNode.dataset.userscriptHidden) {
                        originalNode.style.display = 'none';
                        originalNode.style.visibility = 'hidden';
                        originalNode.style.opacity = '0';
                        originalNode.style.height = '0px';
                        originalNode.style.overflow = 'hidden';
                        originalNode.dataset.userscriptHidden = "true";
                    }
                });
            }
            if (typeof showNotification === 'function') {
                showNotification(String(message), type);
            } else {
                console.warn(`[UserScript Intercept] Функция showNotification недоступна при вызове DLEPush.${type}.`);
                const fallbackPrefix = type.toUpperCase();
                console.log(`[${fallbackPrefix}_FALLBACK_NOTIF]: ${String(message)}`);
            }
        };
        const customDLEPushMethods = {
            info: createOverriddenNotifier('info'),
            success: createOverriddenNotifier('success'),
            error: createOverriddenNotifier('error'),
            warning: createOverriddenNotifier('warning'),
            warn: createOverriddenNotifier('warning')
        };
        let dlePushTarget = null;
        if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.DLEPush === 'object' && unsafeWindow.DLEPush !== null) {
            dlePushTarget = unsafeWindow.DLEPush;
        } else if (typeof window.DLEPush === 'object' && window.DLEPush !== null) {
            dlePushTarget = window.DLEPush;
        }
        if (dlePushTarget) {
            for (const methodName in customDLEPushMethods) {
                if (Object.prototype.hasOwnProperty.call(customDLEPushMethods, methodName)) {
                    dlePushTarget[methodName] = customDLEPushMethods[methodName];
                }
            }
        } else {
            if (typeof unsafeWindow !== 'undefined') {
                unsafeWindow.DLEPush = customDLEPushMethods;
            } else {
                window.DLEPush = customDLEPushMethods;
            }
        }
    })();

    // #######################################################################
    // # Прикрепляет MutationObserver к стандартному контейнеру уведомлений сайта (#DLEPush) для их перехвата.
    // #######################################################################
    function attachObserverToDLEPush(dlePushContainerElement) {
        const extractDataFromOriginalNodeForMO = (node) => {
            if (!node || node.nodeType !== Node.ELEMENT_NODE) {
                return { message: null, type: 'info' };
            }
            const messageElement = node.querySelector('.DLEPush-message');
            const messageText = messageElement ? messageElement.textContent.trim() : null;
            if (!messageText) {
                return { message: null, type: 'info' };
            }
            let type = 'info';
            if (node.classList.contains('push-error') || node.classList.contains('push-danger')) type = 'error';
            else if (node.classList.contains('push-success')) type = 'success';
            else if (node.classList.contains('push-warning')) type = 'warning';
            else if (node.classList.contains('push-info')) type = 'info';
            return { message: messageText, type };
        };
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                let nodeToProcess = null;
                if (mutation.type === 'childList') {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType === Node.ELEMENT_NODE &&
                            addedNode.matches &&
                            addedNode.matches('.DLEPush-notification.wrapper') &&
                            addedNode.style.display !== 'none' &&
                            !addedNode.dataset.userscriptHidden) {
                            nodeToProcess = addedNode;
                            break;
                        }
                    }
                } else if (mutation.type === 'attributes') {
                    const target = mutation.target;
                    if (target.nodeType === Node.ELEMENT_NODE &&
                        target.matches &&
                        target.matches('.DLEPush-notification.wrapper') &&
                        !target.dataset.userscriptHidden) {
                        const computedStyle = window.getComputedStyle(target);
                        if (computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden' && parseFloat(computedStyle.opacity) > 0) {
                            nodeToProcess = target;
                        }
                    }
                }
                if (nodeToProcess) {
                    nodeToProcess.dataset.userscriptHidden = "true";
                    const { message, type } = extractDataFromOriginalNodeForMO(nodeToProcess);
                    if (message && typeof showNotification === 'function') {
                        showNotification(message, type);
                    }
                    nodeToProcess.style.display = 'none';
                    nodeToProcess.style.visibility = 'hidden';
                    nodeToProcess.style.opacity = '0';
                    nodeToProcess.style.height = '0px';
                    nodeToProcess.style.overflow = 'hidden';
                }
            }
        });
        observer.observe(dlePushContainerElement, {
            childList: true,
            attributes: true,
            subtree: true,
            attributeFilter: ['style', 'class']
        });
    }

    // #######################################################################
    // # Инициализирует перехват стандартных уведомлений сайта.
    // #######################################################################
    function setupSiteNotificationInterceptor() {
        let dlePushContainer = document.getElementById('DLEPush');
        if (dlePushContainer) {
            attachObserverToDLEPush(dlePushContainer);
        } else {
            const waitForBodyAndObserve = () => {
                if (document.body) {
                    const bodyObserver = new MutationObserver((mutationsList, observerInstance) => {
                        let foundDLEPushInMutation = false;
                        for (const mutation of mutationsList) {
                            if (mutation.type === 'childList') {
                                for (const addedNode of mutation.addedNodes) {
                                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                                        if (addedNode.id === 'DLEPush') {
                                            dlePushContainer = addedNode;
                                            foundDLEPushInMutation = true;
                                            break;
                                        }
                                        const deepSearch = addedNode.querySelector('#DLEPush');
                                        if (deepSearch) {
                                            dlePushContainer = deepSearch;
                                            foundDLEPushInMutation = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (foundDLEPushInMutation) break;
                        }
                        if (!foundDLEPushInMutation) {
                            dlePushContainer = document.getElementById('DLEPush');
                        }
                        if (dlePushContainer) {
                            observerInstance.disconnect();
                            attachObserverToDLEPush(dlePushContainer);
                        }
                    });
                    bodyObserver.observe(document.body, { childList: true, subtree: true });
                    setTimeout(() => {
                        if (!dlePushContainer) {
                            const dlePushAfterTimeout = document.getElementById('DLEPush');
                            if (dlePushAfterTimeout) {
                                bodyObserver.disconnect();
                                attachObserverToDLEPush(dlePushAfterTimeout);
                            }
                        }
                    }, 500);
                } else {
                    setTimeout(waitForBodyAndObserve, 50);
                }
            };
            waitForBodyAndObserve();
        }
    }
// ##############################################################################################################################################
// Конец ФУНКЦИЯ КАСТОМНЫХ СООБЩЕНИЙ
// ##############################################################################################################################################

    // #######################################################################
    // # Проверяет, находится ли пользователь на странице личных сообщений (/pm/).
    // #######################################################################
    function isOnPmPage() {
        return window.location.pathname.startsWith('/pm/');
    }

    // #######################################################################
    // # Приостанавливает выполнение кода на указанное количество миллисекунд (асинхронная пауза).
    // #######################################################################
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    // #######################################################################
    // # Извлекает имя пользователя из URL, если текущая страница является инвентарем карт другого пользователя.
    // #######################################################################
    function getCurrentInventoryUsernameFromUrl() {
        if (/^\/user\/cards\//.test(window.location.pathname)) {
            const params = new URLSearchParams(window.location.search);
            return params.get('name');
        }
        return null;
    }

    // #######################################################################
    // # Получает полный домен текущей страницы (например, 'https://asstars.tv').
    // #######################################################################
    function getCurrentDomain() {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        return `${protocol}//${hostname}`;
    }

    // #######################################################################
    // # Сохраняет в кеш GM соотношение между ID экземпляра карты (ownerId) и ID ее типа (typeId).
    // #######################################################################
    async function saveOwnerToTypeMapping(ownerId, typeId) {
        if (!ownerId || !typeId) {
            return;
        }
        let cache = await GM_getValue(OWNER_TO_TYPE_CACHE_KEY, {});
        const key = 'o_' + ownerId;
        cache[key] = { typeId: typeId, lastUpdated: Date.now() };
        await GM_setValue(OWNER_TO_TYPE_CACHE_KEY, cache);
    }

    // #######################################################################
    // # Получает ID типа карты из кеша по ID ее экземпляра.
    // #######################################################################
    async function getTypeIdFromOwnerCache(ownerId) {
    if (!ownerId) return null;
    let cache = await GM_getValue(OWNER_TO_TYPE_CACHE_KEY, null);
    if (!cache) return null;
    const key = 'o_' + ownerId;
    const entry = cache[key];
    if (entry && entry.typeId) {
        if (Date.now() - entry.lastUpdated > OWNER_ID_CACHE_TTL_HOURS * 3600000) {
            return null;
        }
        return entry.typeId;
    }
    return null;
}


    // #######################################################################
    // # Сохраняет данные в кеш GM с указанным временем жизни (TTL).
    // #######################################################################
    async function setCache(key, data, ttlInSeconds) {
        const expires = Date.now() + ttlInSeconds * 1000;
        const cacheData = { data, expires };
        await GM_setValue(key, cacheData);
    }

    // #######################################################################
    // # Извлекает данные из кеша GM, если срок их жизни еще не истек.
    // #######################################################################
    async function getCache(key) {
        const cacheData = await GM_getValue(key, null);
        if (!cacheData) return null;
        if (Date.now() > cacheData.expires) {
            await GM_deleteValue(key);
            return null;
        }
        return cacheData.data;
    }

    // #######################################################################
    // # Кэширует данные о статистике карты с использованием глобальных настроек времени жизни кэша.
    // #######################################################################
    async function cacheCard(key, data) {
        if (data) {
            const ttlInHours = await GM_getValue(CACHE_TTL_STORAGE_KEY, DEFAULT_CACHE_TTL_HOURS);
            const ttlInSeconds = ttlInHours * 3600;
            await setCache(key, data, ttlInSeconds);
        }
    }

    // #######################################################################
    // # Получает данные о статистике карты из кеша.
    // #######################################################################
    async function getCard(key) {
        return await getCache(key);
    }

    // #######################################################################
    // # Полностью очищает кэш статистики карт и связей ID, хранящийся в Greasemonkey.
    // #######################################################################
    async function clearCardCache() {
        let clearedIndividualStatsCount = 0;
        let ownerToTypeCacheCleared = false;
        const allKeys = await GM_listValues();
        const deletePromises = [];
        for (const key of allKeys) {
            if (key.startsWith('cardId: ')) {
                deletePromises.push(GM_deleteValue(key));
                clearedIndividualStatsCount++;
            }
            if (key === OWNER_TO_TYPE_CACHE_KEY) {
                deletePromises.push(GM_deleteValue(key));
                ownerToTypeCacheCleared = true;
            }
        }
        await Promise.all(deletePromises);
        let messageParts = [];
        if (clearedIndividualStatsCount > 0) {
            messageParts.push(`${clearedIndividualStatsCount} записей статистики`);
        }
        if (ownerToTypeCacheCleared) {
            messageParts.push(`кэш связей ID`);
        }
        if (messageParts.length > 0) {
            safeDLEPushCall('success', `Кэш GM очищен: ${messageParts.join(', ')}.`);
        } else {
            safeDLEPushCall('info', 'Нет данных для очистки в кэше GM.');
        }
    }

    // #######################################################################
    // # Очищает кэш только для тех карт, которые в данный момент отображаются на странице.
    // #######################################################################
    async function clearPageCache() {
        const cardsOnPage = getCardsOnPage();
        if (cardsOnPage.length === 0) {
            safeDLEPushCall('info', 'На странице не найдено карт для очистки кэша.');
            return;
        }
        const uniqueCardIds = new Set();
        const allCardIdsOnPage = [];
        let cardsWithIdCount = 0;
        for (const cardElement of cardsOnPage) {
            if (cardElement.dataset.id) {
                cardsWithIdCount++;
                const typeId = await getCardId(cardElement, 'type');
                if (typeId) {
                    uniqueCardIds.add(typeId);
                    allCardIdsOnPage.push(typeId);
                }
            }
        }
        if (uniqueCardIds.size === 0) {
            safeDLEPushCall('info', 'Не удалось определить ID карт для очистки кэша.');
            return;
        }
        const deletePromises = [];
        const clearedCardIds = new Set();
        const allKeys = await GM_listValues();
        for (const cardId of uniqueCardIds) {
            const cacheKey = 'cardId: ' + cardId;
            if (allKeys.includes(cacheKey)) {
                deletePromises.push(GM_deleteValue(cacheKey));
                clearedCardIds.add(cardId);
            }
        }
        if (clearedCardIds.size > 0) {
            await Promise.all(deletePromises);
            let relevantDuplicatesCount = 0;
            const processedForDupCount = new Set();
            allCardIdsOnPage.forEach(cardId => {
                if (clearedCardIds.has(cardId)) {
                    if (processedForDupCount.has(cardId)) {
                        relevantDuplicatesCount++;
                    } else {
                        processedForDupCount.add(cardId);
                    }
                }
            });
            let message = `Кэш для ${clearedCardIds.size} карт очищен.`;
            if (relevantDuplicatesCount > 0) {
                message += ` И ${relevantDuplicatesCount} дубликат(а)`;
            }
            safeDLEPushCall('success', message);
        } else {
            safeDLEPushCall('info', 'В кэше не найдено записей для карт на этой странице.');
            return;
        }
        cardsOnPage.forEach(cardEl => {
            const cardId = cardEl.dataset.id;
            if (cardId && clearedCardIds.has(cardId)) {
                cardEl.querySelector('.card-stats')?.remove();
                removeCheckMarkOrDemandButton(cardEl);
            }
        });
        addDemandCheckButtonsToCards();
    }

    // #######################################################################
    // # Добавляет на страницу кнопку для очистки кэша только для карт на текущей странице.
    // #######################################################################
    function addClearPageCacheFeature() {
        const button = document.createElement('button');
        button.id = 'clearPageCacheBtn';
        button.title = 'Очистить кэш для карт на странице';
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '376px',
            right: '12px',
            zIndex: '101',
            width: '40px',
            height: '20px',
            background: 'linear-gradient(145deg, rgb(166, 100, 110), rgb(222, 0, 5))',
            border: 'none',
            borderRadius: '0 0 20px 20px',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease, opacity 0.3s ease, visibility 0s linear 0s',
            color: 'black',
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            mask: 'radial-gradient(circle at 50% -75%, transparent 24px, black 0px)',
            '-webkit-mask': 'radial-gradient(circle at 50% -75%, transparent 24px, black 0px)',
        });
        const icon = document.createElement('span');
        icon.className = 'fas fa-trash-alt';
        icon.style.fontSize = '12px';
        icon.style.fontWeight = '300';
        icon.style.marginBottom = '-10px';
        button.appendChild(icon);

        button.addEventListener('click', async () => {
            const confirmation = await protector_customConfirm('Вы уверены, что хотите выполнить очистку кэша карт на этой странице?');
            if (confirmation) {
                clearPageCache();
            }
        });
        document.body.appendChild(button);
    }

    // #######################################################################
    // # Загружает статистику карты (спрос, предложение, владельцы) с ее страницы, используя кэш.
    // #######################################################################
    async function loadCard(cardId) {
        const cacheKey = 'cardId: ' + cardId;
        let card = await getCard(cacheKey) ?? {};
        if (Object.keys(card).length) {
            return card;
        }
        const currentDomain = getCurrentDomain();
        const cardUsersUrl = `${currentDomain}/cards/users/?id=${cardId}/`;
        let popularityCount = 0, needCount = 0, tradeCount = 0;
        const MAX_FETCH_ATTEMPTS = 2;
        const FETCH_RETRY_DELAY = 1000;
        for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt++) {
            try {
                await sleep(0);
                const response = await fetch(cardUsersUrl);
                if (response.ok) {
                    const html = await response.text();
                    const doc = new DOMParser().parseFromString(html, 'text/html');
                    needCount = parseInt(doc.querySelector('#owners-need')?.textContent.trim(), 10) || 0;
                    tradeCount = parseInt(doc.querySelector('#owners-trade')?.textContent.trim(), 10) || 0;
                    popularityCount = parseInt(doc.querySelector('#owners-count')?.textContent.trim(), 10) || 0;
                    card = { popularityCount, needCount, tradeCount };
                    await cacheCard(cacheKey, card);
                    return card;
                }
                console.error(`Попытка ${attempt}/${MAX_FETCH_ATTEMPTS}: Не удалось загрузить страницу /users/: ${response.status} для карты ${cardId}`);
                if (attempt < MAX_FETCH_ATTEMPTS) {
                    await sleep(FETCH_RETRY_DELAY);
                } else {
                    return { popularityCount: 0, needCount: 0, tradeCount: 0 };
                }

            } catch (error) {
                console.error(`Попытка ${attempt}/${MAX_FETCH_ATTEMPTS}: Ошибка при запросе к карте ${cardId}:`, error);
                if (attempt < MAX_FETCH_ATTEMPTS) {
                    await sleep(FETCH_RETRY_DELAY);
                } else {
                    return { popularityCount: 0, needCount: 0, tradeCount: 0 };
                }
            }
        }
        return { popularityCount: 0, needCount: 0, tradeCount: 0 };
    }

    // #######################################################################
    // # Обновляет DOM-элемент карты, добавляя в него блок со статистикой (спрос, предложение).
    // #######################################################################
    async function updateCardInfo(cardId, element, triggeredByIndividualButton = false) {
        if (!cardId || !element) return;
        const demandButton = element.querySelector('.check-demand-btn');
        if (demandButton && triggeredByIndividualButton) {
            demandButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            demandButton.style.pointerEvents = 'none';
        }
        try {
            const card = await loadCard(cardId);
            element.querySelector('.card-stats')?.remove();
            if (element.classList.contains('noffer')) {
                const nofferLeftContainer = element.querySelector('.noffer__left');
                nofferLeftContainer?.querySelector('.card-stats')?.remove();
            }
            const stats = document.createElement('div');
            stats.className = 'card-stats';
            stats.innerHTML = `
        <span title="Хотят получить"><i class="fas fa-shopping-cart"></i> ${card.needCount}</span>
        <span title="Готовы обменять"><i class="fas fa-sync-alt"></i> ${card.tradeCount}</span>
        <span title="Владельцев"><i class="fas fa-users"></i> ${card.popularityCount}</span>`;
            if (element.classList.contains('noffer')) {
                const nofferLeft = element.querySelector('.noffer__left');
                const nofferMain = nofferLeft ? nofferLeft.querySelector('.noffer__main') : null;
                if (nofferMain) nofferMain.insertAdjacentElement('afterend', stats);
                else if (nofferLeft) nofferLeft.appendChild(stats);
                else element.appendChild(stats);
            } else if (element.classList.contains('card-show__header')) {
                const nameWrapper = element.querySelector('.card-show__name-wrapper');
                if (nameWrapper) nameWrapper.insertAdjacentElement('beforebegin', stats);
                else element.insertBefore(stats, element.firstChild);
            } else {
                element.appendChild(stats);
            }
            if (card.needCount !== undefined) {
                if (!element.classList.contains('card-show__placeholder') && !element.classList.contains('noffer')) {
                    addCheckMark(element);
                } else if (demandButton) {
                    demandButton.remove();
                }
            }
            if (element.classList.contains('card-show__placeholder') && element.querySelector('img[alt="Постер"]') && !document.getElementById('card-show-wrapper-style-mod')) {
                const style = document.createElement('style');
                style.id = 'card-show-wrapper-style-mod';
                style.innerHTML = `.card-show__wrapper { margin-bottom: 55px !important; }`;
                document.head.appendChild(style);
            }
        } catch (error) {
            console.error(`Ошибка обновления информации о карте ${cardId}:`, error);
            if (demandButton && triggeredByIndividualButton) {
                demandButton.innerHTML = '<i class="fas fa-chart-line"></i>';
                demandButton.style.pointerEvents = 'auto';
                safeDLEPushCall('error', `Не удалось загрузить спрос для карты ID ${cardId}`);
            }
        }
    }

    // #######################################################################
    // # Удаляет все визуальные отметки (элементы с классом 'div-marked') с карточек.
    // #######################################################################
    function clearMarkFromCards() { cleanByClass('div-marked'); }

    // #######################################################################
    // # Удаляет все иконки-ссылки (элементы с классом 'link-icon'), которые могут быть добавлены скриптом.
    // #######################################################################
    function removeAllLinkIcons() { cleanByClass('link-icon'); }

    // #######################################################################
    // # Удаляет с DOM все элементы с указанным классом. Вспомогательная функция.
    // #######################################################################
    function cleanByClass(className) { document.querySelectorAll('.' + className).forEach(item => item.remove()); }

    // #######################################################################
    // # Извлекает из элемента карты оба ID: ID типа и ID экземпляра (ownerId).
    // #######################################################################
    function getBothCardIds(cardElement) {
        if (!cardElement) return { typeId: null, ownerId: null };
        let typeId = null;
        let ownerId = null;
        if (cardElement.matches('.anime-cards__item')) {
            typeId = cardElement.dataset.id;
            ownerId = cardElement.dataset.ownerId;
        }
        else if (cardElement.matches('.trade__inventory-item')) {
            typeId = cardElement.dataset.cardId;
            ownerId = cardElement.dataset.id;
        }
        if (typeId && ownerId) {
            return { typeId, ownerId };
        }
        return { typeId, ownerId };
    }


    // #######################################################################
    // # Собирает и возвращает массив всех видимых на странице DOM-элементов карточек.
    // #######################################################################
    function getCardsOnPage() {
        const pageType = isCardPackPage() ? "PackPage" : "OtherPage";
        const allPotentialCards = Array.from(document.querySelectorAll(CARD_CLASSES_SELECTORS));
        let visibleCards = [];
        if (isCardPackPage()) {
            const lootboxRow = document.querySelector('.lootbox__row');
            if (lootboxRow) {
                if (lootboxRow.offsetParent !== null) { // Если контейнер пака видим
                    const cardsInPack = Array.from(lootboxRow.querySelectorAll('.lootbox__card'));
                    cardsInPack.forEach((card, index) => {
                        const cardIdForLog = card.dataset.id || `PackCard-${index}`;
                        if (card.offsetParent !== null && !card.closest('#cards-carousel')) {
                            visibleCards.push(card);
                        } else {
                        }
                    });
                } else {
                }
            } else {
            }
            allPotentialCards.forEach(card => {
                if (!card.closest('.lootbox__row') && card.offsetParent !== null && !card.closest('#cards-carousel')) {
                    if (!visibleCards.includes(card)) {
                        visibleCards.push(card);
                    }
                }
            });
        } else {
            visibleCards = allPotentialCards.filter(card => {
                if (card.offsetParent === null) {
                    return false;
                }
                if (card.closest('#cards-carousel')) {
                    return false;
                }
                return true;
            });
        }
        return visibleCards;
    }

    // #######################################################################
    // # Принудительно останавливает и сбрасывает состояние массовой проверки дубликатов.
    // #######################################################################
    function stopMassDuplicateCheck() {
        if (idТаймаутаСледующегоБатча) {
            clearTimeout(idТаймаутаСледующегоБатча);
            idТаймаутаСледующегоБатча = null;
        }
        if (массоваяПроверкаДублейЗапущена) {
            console.log('[AssTars Card Master] Массовая проверка дубликатов принудительно остановлена.');
            isProcessingAutoPackCheck = false;
            массоваяПроверкаДублейЗапущена = false;
            массоваяПроверкаДублейНаПаузе = false;
            индексПоследнейПровереннойКарты = 0;
            массивКартДляПроверки = [];
            hideSpecialButtonCounter('check-all-duplicates-btn');
            const mainButton = document.getElementById('check-all-duplicates-btn');
            if (mainButton) {
                const icon = mainButton.querySelector('span:first-child');
                if (icon) icon.className = 'fal fa-search';
                mainButton.title = "Проверить дубликаты карт";
            }
        }
    }

    // #######################################################################
    // # Основная функция для массовой проверки спроса на карты (текущая страница или все страницы с пагинацией).
    // #######################################################################
    async function processCards(checkAllPages = false, isAutoTriggered = false) {
        const buttonId = checkAllPages ? 'processAllPagesBtn' : 'processCards';
        const mainProcessBtn = document.getElementById(buttonId);
        if (isProcessCardsRunning) {
            shouldStopProcessCards = true;
            if (!isAutoTriggered) {
                safeDLEPushCall('info', 'Массовая проверка спроса остановлена.');
            }
            return;
        }

        let showDemandCheckNotifications = !isAutoTriggered;
        isProcessCardsRunning = true;
        shouldStopProcessCards = false;
        if (mainProcessBtn && !originalProcessCardsColor) {
            originalProcessCardsColor = mainProcessBtn.style.background;
        }
        if (mainProcessBtn) {
            mainProcessBtn.style.background = 'linear-gradient(145deg, rgb(50, 200, 50), rgb(0, 150, 0))';
        }
        if (isCardPackPage()) {
            const cardsInLootbox = document.querySelectorAll('.lootbox__row .lootbox__card');
            cardsInLootbox.forEach(cardEl => {
                cardEl.classList.remove('div-checked');
                removeCheckMarkOrDemandButton(cardEl);
            });
            await sleep(100);
        }
        const currentPathname = window.location.pathname;
        let posterProcessed = false;
        let posterCardId = null;
        if (currentPathname.match(/^\/cards\/\d+\/trade\/?$/i) || currentPathname.startsWith('/trades/')) {
            const nofferElement = document.querySelector('.noffer.cards--container');
            const posterImageLink = nofferElement ? nofferElement.querySelector('a.noffer__img') : null;
            if (nofferElement && posterImageLink && nofferElement.dataset.originalId) {
                posterCardId = nofferElement.dataset.originalId;
                const existingStats = nofferElement.querySelector('.noffer__left .card-stats');
                const existingButtonOnPoster = posterImageLink.querySelector('.check-demand-btn');
                if (posterCardId && !existingStats && existingButtonOnPoster) {
                    await updateCardInfo(posterCardId, nofferElement, true);
                    posterProcessed = true;
                } else if (posterCardId && existingStats) {
                    posterProcessed = true;
                }
            }
        }
        if (shouldStopProcessCards) { isProcessCardsRunning = false; return; }
        addDemandCheckButtonsToCards();
        await sleep(200);
        let cardsToProcessInLoop = getCardsOnPage().filter(cardEl =>
                                                           !cardEl.classList.contains('div-checked') &&
                                                           !cardEl.classList.contains('trade__inventory-item--lock') &&
                                                           !cardEl.classList.contains('remelt__inventory-item--lock') &&
                                                           !cardEl.classList.contains('card-show__placeholder') &&
                                                           !cardEl.classList.contains('noffer')
                                                          );
        let counter = cardsToProcessInLoop.length;
        let processedSuccessfully = 0;
        let notFoundIdCount = 0;
        if (counter === 0 && !posterProcessed) {
            if (showDemandCheckNotifications) {
                safeDLEPushCall('info', 'Нет карт для проверки спроса.');
            }
            isProcessCardsRunning = false;
            if (mainProcessBtn && originalProcessCardsColor) mainProcessBtn.style.background = originalProcessCardsColor;
            return;
        }
        if (showDemandCheckNotifications) {
            safeDLEPushCall('info', `Начинаю обработку ${counter} карт...`);
        }
        if(mainProcessBtn) {
            updateSpecialButtonCounterText(buttonId, counter);
            showSpecialButtonCounter(buttonId);
            startAnimation(buttonId);
        }
        const isFastPage = isCardPackPage() || currentPathname.startsWith('/trades/');
        if (isFastPage && cardsToProcessInLoop.length > 0) {
            const processingPromises = cardsToProcessInLoop.map(async (cardElement) => {
                const typeCardId = await getCardId(cardElement, 'type');
                if (typeCardId) {
                    try {
                        await sleep(Math.random() * 200 + 100);
                        await updateCardInfo(typeCardId, cardElement, false);
                        return { status: 'success' };
                    } catch (e) {
                        return { status: 'error' };
                    }
                } else {
                    return { status: 'no_id' };
                }
            });
            const results = await Promise.all(processingPromises);
            processedSuccessfully = results.filter(r => r.status === 'success').length;
            notFoundIdCount = results.filter(r => r.status === 'no_id').length;
        } else if (cardsToProcessInLoop.length > 0) {
            for (const cardElement of cardsToProcessInLoop) {
                if (shouldStopProcessCards) {
                    safeDLEPushCall('info', 'Обработка прервана.');
                    break;
                }
                let typeCardId = await getCardId(cardElement, 'type');
                if (typeCardId) {
                    const cachedCard = await getCard('cardId: ' + typeCardId);
                    // >>> ОПТИМИЗАЦИЯ: если карта уже в кэше, обрабатываем ее без задержки
                    if (cachedCard) {
                        await updateCardInfo(typeCardId, cardElement, false);
                    } else {
                        // Если карты нет в кэше, делаем задержку и потом загружаем
                        await sleep(1900);
                        await updateCardInfo(typeCardId, cardElement, false);
                    }
                    processedSuccessfully++;
                } else {
                    notFoundIdCount++;
                }
                counter--;
                if(mainProcessBtn) updateSpecialButtonCounterText(buttonId, counter);
            }
        }
        if(mainProcessBtn) {
            stopAnimation(buttonId);
            hideSpecialButtonCounter(buttonId);
        }
        if (mainProcessBtn && originalProcessCardsColor) mainProcessBtn.style.background = originalProcessCardsColor;
        isProcessCardsRunning = false;
        if (checkAllPages && isMyCardPage() && !shouldStopProcessCards && cardsToProcessInLoop.length > 0) {
            await goToNextPageForDemand();
            return;
        } else {
            sessionStorage.removeItem('shouldAutoProcessDemand');
        }
        if (!shouldStopProcessCards) {
            if (showDemandCheckNotifications) {
                let finalMessage = "Проверка спроса завершена. ";
                if (posterProcessed) finalMessage += "Постер обработан. ";
                if (processedSuccessfully > 0) finalMessage += `Карт проверено: ${processedSuccessfully}. `;
                if (notFoundIdCount > 0) finalMessage += `Не удалось найти ID для ${notFoundIdCount} карт.`;
                const finalMessageType = notFoundIdCount > 0 ? 'warning' : 'success';
                if (processedSuccessfully > 0 || notFoundIdCount > 0 || posterProcessed) {
                    safeDLEPushCall(finalMessageType, finalMessage.trim());
                }
            }
        }
    }

    // #######################################################################
    // # Запускает CSS-анимацию для иконки на кнопке по ее ID.
    // #######################################################################
    function startAnimation(id) {
        const btnIcon = document.querySelector('#' + id + ' span:first-child');
        if (btnIcon) btnIcon.style.animation = 'pulseIcon 1s ease-in-out infinite';
    }

    // #######################################################################
    // # Останавливает CSS-анимацию для иконки на кнопке по ее ID.
    // #######################################################################
    function stopAnimation(id) {
        const btnIcon = document.querySelector('#' + id + ' span:first-child');
        if (btnIcon) btnIcon.style.animation = '';
    }

    // #######################################################################
    // # Удаляет с элемента карты либо зеленую галочку проверки, либо кнопку индивидуального запроса спроса.
    // #######################################################################
    function removeCheckMarkOrDemandButton(element) {
        element.querySelector('.div-marked.fa-check')?.remove();
        element.querySelector('.check-demand-btn')?.remove();
        element.classList.remove('div-checked');
    }

    // #######################################################################
    // # Добавляет на элемент карты визуальную отметку (зеленую галочку), означающую, что она обработана.
    // #######################################################################
    function addCheckMark(element) {
        if (!element) return;
        removeCheckMarkOrDemandButton(element); // Сначала удаляем старую отметку или кнопку
        const checkMark = document.createElement('i');
        checkMark.className = 'fas fa-check div-marked';
        Object.assign(checkMark.style, {
            position: 'absolute', top: '2px', right: '2px', background: 'green', color: 'black',
            borderRadius: '50%', padding: '5px', fontSize: '10px',
            width: '20px', height: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box',
            zIndex: '10'
        });
        element.classList.add('div-checked');
        if (window.getComputedStyle(element).position === 'static') element.style.position = 'relative';
        element.appendChild(checkMark);
    }

    // #######################################################################
    // # Добавляет на элемент карты отметку с числом (используется для отображения количества дубликатов).
    // #######################################################################
    function addInCardMark(element, count) {
        if (!element) return;
        const mark = document.createElement('div');
        mark.className = 'div-marked';
        Object.assign(mark.style, {
            position: 'absolute', bottom: '1px', right: '1px', background: 'silver', color: 'black',
            borderRadius: '50%', padding: '5px', fontSize: '10px', width: '20px', height: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'
        });
        mark.title = 'Карт в корзине';
        mark.textContent = String(count);
        if (window.getComputedStyle(element).position === 'static') element.style.position = 'relative';
        element.appendChild(mark);
    }

    // #######################################################################
    // # Создает и стилизует кнопку для индивидуальной проверки спроса, которая появляется при наведении на карту.
    // #######################################################################
    function createDemandCheckButton() {
        const btn = document.createElement('div');
        btn.innerHTML = '<i class="fas fa-chart-line"></i>';
        btn.className = 'check-demand-btn';
        if (window.location.pathname.startsWith('/pm/')) {
            btn.setAttribute('data-mce-bogus', '1');
            const icon = btn.querySelector('i');
            if (icon) icon.setAttribute('data-mce-bogus', '1');
        }
        btn.title = 'Проверить спрос на эту карту';
        Object.assign(btn.style, {
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            zIndex: '11',
            background: 'rgba(0, 123, 255, 0.7)',
            color: 'white',
            border: '1px solid rgba(0, 80, 170, 0.9)',
            borderRadius: '50%',
            width: '22px',
            height: '22px',
            fontSize: '10px',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            opacity: '0',
            visibility: 'hidden',
            transform: 'translateY(0px)'
        });
        btn.addEventListener('mouseenter', () => { btn.style.background = 'rgba(0, 100, 220, 0.9)'; });
        btn.addEventListener('mouseleave', () => { btn.style.background = 'rgba(0, 123, 255, 0.7)'; });
        return btn;
    }

    // #######################################################################
    // # Фабричная функция для создания стандартных круглых кнопок управления скриптом.
    // #######################################################################
    function getButton(id, iconClass, bottomValue, titleText, clickFunction) {
        const button = document.createElement('button');
        button.id = id; button.title = titleText;
        Object.assign(button.style, {
            position: 'fixed', bottom: bottomValue + 'px', right: '12px', zIndex: '102',
            fontSize: '12px', width: '40px', height: '40px',
            background: 'linear-gradient(145deg, rgb(166, 100, 110), rgb(222, 0, 5))',
            border: 'none', borderRadius: '50%',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease, opacity 0.3s ease, visibility 0s linear 0s',
            color: 'black', cursor: 'pointer', boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0'
        });
        const icon = document.createElement('span');
        icon.className = 'fal fa-' + iconClass; icon.style.fontSize = '14px';
        button.appendChild(icon);
        const infoCounter = document.createElement('span');
        infoCounter.id = id + '_counter'; infoCounter.className = 'guest__notification';
        Object.assign(infoCounter.style, {
            display: 'none', position: 'absolute', top: '-5px', right: '-5px', background: 'red',
            color: 'white', borderRadius: '50%', padding: '2px 5px', fontSize: '10px',
            lineHeight: '1', minWidth: '16px', textAlign: 'center'
        });
        button.appendChild(infoCounter);
        button.addEventListener('click', clickFunction);
        ['mousedown', 'mouseup', 'mouseleave'].forEach(eventType => {
            button.addEventListener(eventType, () => {
                if (eventType === 'mousedown') {
                    button.style.transform = 'translateY(2px) scale(0.95)';
                    button.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
                } else {
                    button.style.transform = 'translateY(0) scale(1)';
                    button.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.7)';
                }
            });
        });
        if (window.location.pathname.startsWith('/pm/')) {
            button.setAttribute('data-mce-bogus', '1');
            icon.setAttribute('data-mce-bogus', '1');
            infoCounter.setAttribute('data-mce-bogus', '1');
        }
        return button;
    }

    // #######################################################################
    // # Показывает счетчик-уведомление на кнопке.
    // #######################################################################
    function showSpecialButtonCounter(buttonId) {
        const el = document.getElementById(buttonId + '_counter'); if (el) el.style.display = 'flex';
    }

    // #######################################################################
    // # Скрывает счетчик-уведомление на кнопке.
    // #######################################################################
    function hideSpecialButtonCounter(buttonId) {
        const el = document.getElementById(buttonId + '_counter'); if (el) el.style.display = 'none';
    }

    // #######################################################################
    // # Обновляет текст в счетчике-уведомлении на кнопке.
    // #######################################################################
    function updateSpecialButtonCounterText(buttonId, value) {
        const el = document.getElementById(buttonId + '_counter'); if (el) el.textContent = value;
    }

    // #######################################################################
    // # Обновляет состояние и значение счетчика на кнопке.
    // #######################################################################
    function updateButtonCounter(id, counter) {
        const c = document.getElementById(id + '_counter');
        if (c) { c.style.display = counter > 0 ? 'flex' : 'none'; c.textContent = counter; }
    }

    // #######################################################################
    // # Применяет текущее состояние видимости (скрыты/показаны) ко всем управляемым кнопкам скрипта.
    // #######################################################################
    function applyManagedButtonsVisibility(isInitialLoad = false) {
        const buttonsExistOnPage = managedButtonSelectors.some(selector => document.querySelector(selector));
        if (toggleButtonElement) toggleButtonElement.style.display = buttonsExistOnPage ? 'flex' : 'none';

        managedButtonSelectors.forEach(selector => {
            const btn = document.querySelector(selector);
            if (btn) {
                const isHidden = areActionButtonsHidden;
                if (isHidden && isInitialLoad) {
                    btn.style.transition = 'none';
                    btn.style.opacity = '0';
                    btn.style.transform = 'translateX(calc(100% + 20px))';
                    btn.style.pointerEvents = 'none';
                    btn.style.visibility = 'hidden';
                    setTimeout(() => {
                        btn.style.transition = 'opacity 0.3s ease, transform 0.3s ease, visibility 0s linear 0s';
                    }, 50);

                } else {
                    btn.style.transition = `opacity 0.3s ease, transform 0.3s ease, visibility 0s linear ${isHidden ? '0.3s' : '0s'}`;
                    if (isHidden) {
                        btn.style.opacity = '0';
                        btn.style.transform = 'translateX(calc(100% + 20px))';
                        btn.style.pointerEvents = 'none';
                        btn.style.visibility = 'hidden';
                    } else {
                        btn.style.visibility = 'visible';
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                btn.style.opacity = '1';
                                btn.style.transform = 'translateX(0)';
                                btn.style.pointerEvents = 'auto';
                            });
                        });
                    }
                }
            }
        });
    }

    // #######################################################################
    // # Переключает видимость боковых кнопок и сохраняет состояние в localStorage.
    // #######################################################################
    function toggleManagedButtonsVisibility() {
        areActionButtonsHidden = !areActionButtonsHidden;
        localStorage.setItem('actionButtonsHiddenState', areActionButtonsHidden);
        if (toggleButtonElement) {
            const icon = toggleButtonElement.querySelector('i');
            icon.className = areActionButtonsHidden ? 'fas fa-chevron-left' : 'fas fa-chevron-right';
            toggleButtonElement.title = areActionButtonsHidden ? 'Показать боковые кнопки' : 'Скрыть боковые кнопки';
        }
        applyManagedButtonsVisibility();
    }

    // #######################################################################
    // # Создает и добавляет кнопку-переключатель для скрытия/отображения панели с основными кнопками.
    // #######################################################################
    function createToggleVisibilityButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'toggleActionButtonsVisibility';
        if (window.location.pathname.startsWith('/pm/')) {
            toggleBtn.setAttribute('data-mce-bogus', '1');
        }
        toggleBtn.title = areActionButtonsHidden ? 'Показать боковые кнопки' : 'Скрыть боковые кнопки';
        Object.assign(toggleBtn.style, {
            position: 'fixed',
            bottom: '310px',
            right: '1px',
            zIndex: '100',
            width: '10px',
            height: '55px',
            background: 'linear-gradient(145deg, #6e7f80, #536872)',
            border: 'none',
            borderRadius: '5px 0 0 5px',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 1px',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease, background 0.2s ease'
        });
        const icon = document.createElement('i');
        icon.className = areActionButtonsHidden ? 'fas fa-chevron-left' : 'fas fa-chevron-right';
        icon.style.fontSize = '8px';
        toggleBtn.appendChild(icon);
        toggleBtn.addEventListener('click', toggleManagedButtonsVisibility);
        ['mousedown', 'mouseup', 'mouseleave'].forEach(eventType => {
            toggleBtn.addEventListener(eventType, () => {
                if (eventType === 'mousedown') {
                    toggleBtn.style.transform = 'translateY(2px) scale(0.95)';
                    toggleBtn.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
                } else {
                    toggleBtn.style.transform = 'translateY(0) scale(1)';
                    toggleBtn.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
                }
            });
        });
        document.body.appendChild(toggleBtn);
        toggleButtonElement = toggleBtn;
    }

    // #######################################################################
    // # Проверяет, является ли текущая страница инвентарем карт пользователя.
    // #######################################################################
    function isMyCardPage() {
        return /^\/user\/cards\//.test(window.location.pathname) &&
            new URLSearchParams(window.location.search).has('name');
    }

    // #######################################################################
    // # Проверяет, является ли страница страницей открытия паков.
    // #######################################################################
    function isCardPackPage() {
        return window.location.pathname === '/cards/pack/';
    }

    // #######################################################################
    // # Проверяет, является ли текущая страница страницей конкретного Аниме.
    // #######################################################################
    function isAnimePage() { return document.getElementById('anime-data') !== null; }

    // #######################################################################
    // # Извлекает ID карты (типа или экземпляра) из DOM-элемента, используя разные атрибуты и контекст.
    // #######################################################################
    async function getCardId(cardElement, targetIdType = 'type') {
        if (!cardElement) return null;
        let typeId = cardElement.dataset.cardId || // Приоритет для 'data-card-id' (трейды)
            ((cardElement.matches('.anime-cards__item') || cardElement.matches('.lootbox__card')) ? cardElement.dataset.id : null) || // 'data-id' в инвентаре
            (cardElement.matches('.trade__main-item') ? cardElement.dataset.id : null); // 'data-id' на странице просмотра трейда
        let ownerId = cardElement.dataset.ownerId || // 'data-owner-id' в инвентаре
            ((cardElement.matches('.trade__inventory-item') || cardElement.matches('.remelt__inventory-item')) ? cardElement.dataset.id : null); // 'data-id' в инвентаре для трейда и ПЕРЕПЛАВКИ
        if (!typeId) {
            const href = cardElement.getAttribute('href') || cardElement.querySelector('a')?.href;
            if (href) {
                const match = href.match(/\/cards\/users\/\?id=(\d+)/);
                if (match && match[1]) {
                    typeId = match[1];
                }
            }
        }
        if (targetIdType === 'owner') {
            return ownerId || null;
        }
        if (typeId) {
            if (ownerId) {
                await saveOwnerToTypeMapping(ownerId, typeId);
            }
            return typeId;
        }
        if (ownerId) {
            const cachedTypeId = await getTypeIdFromOwnerCache(ownerId);
            if (cachedTypeId) {
                return cachedTypeId;
            }
        }
        return null;
    }

    // #######################################################################
    // # Находит и осуществляет переход на следующую страницу пагинации (для массовой отправки в "Не нужное").
    // #######################################################################
    async function goToNextPage() {
        if (shouldStopProcessing) { sessionStorage.removeItem('shouldAutoCharge'); return; }
        if (!/^\/user\/cards\//.test(window.location.pathname) || !new URLSearchParams(window.location.search).has('name')) {
            sessionStorage.removeItem('shouldAutoCharge');
            return;
        }
        const nextPageSelectors = [
            '.pagination__item--next a:not(.disabled)',
            '.pagination a[rel="next"]:not([aria-disabled="true"])',
            'a.pagination__next:not(.disabled)',
            '.pagination li.active + li:not(.disabled) a',
            '.pages a.swchPgs:not(.active) + a.swchPgs',
            '.pagination_wrapper a:last-of-type:not(.current)'
        ];
        let nextPageLinkElement = null;
        for (const selector of nextPageSelectors) {
            const element = document.querySelector(selector);
            if (element?.href && !element.closest('.disabled') && !element.classList.contains('disabled') && element.getAttribute('aria-disabled') !== 'true') {
                if (selector.includes(':last-of-type')) {
                    const currentPageTextEl = document.querySelector('.pagination .current, .pagination li.active span, .pagination li.active a');
                    if (currentPageTextEl && element.textContent.trim() === currentPageTextEl.textContent.trim()) continue;
                }
                nextPageLinkElement = element;
                break;
            }
        }
        if (!nextPageLinkElement) {
            const currentUrl = new URL(window.location.href);
            const params = currentUrl.searchParams;
            const currentPageNum = parseInt(params.get('page') || '1', 10);
            const nextPageNum = currentPageNum + 1;
            const foundNextPageLinkByText = Array.from(document.querySelectorAll('.pagination a[href]'))
            .find(link => {
                return link.textContent.trim() === String(nextPageNum) &&
                    !link.closest('.disabled') && !link.classList.contains('disabled') &&
                    link.getAttribute('aria-disabled') !== 'true';
            });
            if (foundNextPageLinkByText) {
                nextPageLinkElement = foundNextPageLinkByText;
            } else {
                const foundNextPageLinkByUrlParam = Array.from(document.querySelectorAll('.pagination a[href*="page="]'))
                .find(link => {
                    try {
                        const linkUrl = new URL(link.href, window.location.origin);
                        const linkPageNum = parseInt(linkUrl.searchParams.get('page'), 10);
                        return linkPageNum === nextPageNum &&
                            !link.closest('.disabled') && !link.classList.contains('disabled') &&
                            link.getAttribute('aria-disabled') !== 'true';
                    } catch (e) { return false; }
                });
                if (foundNextPageLinkByUrlParam) nextPageLinkElement = foundNextPageLinkByUrlParam;
            }
        }
        if (nextPageLinkElement && (new URL(nextPageLinkElement.href).pathname + new URL(nextPageLinkElement.href).search !== window.location.pathname + window.location.search)) {
            safeDLEPushCall('info', 'Переход на следующую страницу...');
            sessionStorage.setItem('shouldAutoCharge', 'true');
            await sleep(1000);
            if (!shouldStopProcessing) {
                window.location.href = nextPageLinkElement.href;
            } else {
                sessionStorage.removeItem('shouldAutoCharge');
            }
            return;
        }
        safeDLEPushCall('info', 'Достигнута последняя страница или не найдена кнопка перехода.');
        sessionStorage.removeItem('shouldAutoCharge');
    }

    // #######################################################################
    // # Находит и осуществляет переход на следующую страницу пагинации (для массовой проверки спроса).
    // #######################################################################
    async function goToNextPageForDemand() {
        if (shouldStopProcessCards) {
            sessionStorage.removeItem('shouldAutoProcessDemand');
            return;
        }
        if (!/^\/user\/cards\//.test(window.location.pathname) || !new URLSearchParams(window.location.search).has('name')) {
            sessionStorage.removeItem('shouldAutoProcessDemand');
            return;
        }
        const nextPageSelectors = [
            '.pagination__item--next a:not(.disabled)',
            '.pagination a[rel="next"]:not([aria-disabled="true"])',
            'a.pagination__next:not(.disabled)',
            '.pagination li.active + li:not(.disabled) a',
            '.pages a.swchPgs:not(.active) + a.swchPgs',
            '.pagination_wrapper a:last-of-type:not(.current)'
        ];
        let nextPageLinkElement = null;
        for (const selector of nextPageSelectors) {
            const element = document.querySelector(selector);
            if (element?.href && !element.closest('.disabled') && !element.classList.contains('disabled') && element.getAttribute('aria-disabled') !== 'true') {
                nextPageLinkElement = element;
                break;
            }
        }
        if (!nextPageLinkElement) {
            const currentUrl = new URL(window.location.href);
            const params = currentUrl.searchParams;
            const currentPageNum = parseInt(params.get('page') || '1', 10);
            const nextPageNum = currentPageNum + 1;
            const foundNextPageLinkByText = Array.from(document.querySelectorAll('.pagination a[href]'))
            .find(link => link.textContent.trim() === String(nextPageNum) && !link.closest('.disabled') && !link.classList.contains('disabled') && link.getAttribute('aria-disabled') !== 'true');
            if (foundNextPageLinkByText) nextPageLinkElement = foundNextPageLinkByText;
        }
        if (nextPageLinkElement && (new URL(nextPageLinkElement.href).pathname + new URL(nextPageLinkElement.href).search !== window.location.pathname + window.location.search)) {
            safeDLEPushCall('info', 'Переход на следующую страницу...');
            sessionStorage.setItem('shouldAutoProcessDemand', 'true');

            await sleep(1000);

            if (!shouldStopProcessCards) {
                window.location.href = nextPageLinkElement.href;
            } else {
                sessionStorage.removeItem('shouldAutoProcessDemand');
            }
            return;
        }
        safeDLEPushCall('success', 'Достигнута последняя страница. Проверка спроса завершена.');
        sessionStorage.removeItem('shouldAutoProcessDemand');
    }

    // #######################################################################
    // # Отправляет AJAX-запрос для добавления карты в список "Готов обменять" ("Не нужное").
    // #######################################################################
    const readyToChargeCard = async (cardId, cardName = `Карта ${cardId}`) => {
        const $ = typeof unsafeWindow !== 'undefined' ? unsafeWindow.$ : window.$;
        if (typeof $ === 'undefined' || typeof $.ajax !== 'function') {
            console.error('jQuery или $.ajax недоступны на странице или через unsafeWindow.');
            safeDLEPushCall('error','Ошибка: jQuery не доступен для выполнения запросов.');
            return false;
        }
        if (shouldStopProcessing) return false;
        try {
            await sleep(DELAY * 2);
            if (shouldStopProcessing) return false;
            const data = await new Promise((resolve, reject) => {
                if (shouldStopProcessing) { reject(new Error('Process stopped by user before AJAX call')); return; }
                $.ajax({
                    url: "/engine/ajax/controller.php?mod=trade_ajax",
                    type: "post",
                    data: { action: "propose_add", type: 1, card_id: cardId, user_hash: (typeof unsafeWindow !== 'undefined' ? unsafeWindow.dle_login_hash : window.dle_login_hash) },
                    dataType: "json", cache: false,
                    success: resolve,
                    error: (jqXHR, textStatus, errorThrown) => {
                        console.error(`AJAX Error for "${cardName}" (ID: ${cardId}) in readyToChargeCard: ${textStatus}, ${errorThrown}`);
                        if (jqXHR.status === 502 || jqXHR.status === 503 || jqXHR.status === 504) {
                            safeDLEPushCall('info', `Сервер перегружен (ошибка ${jqXHR.status}) для "${cardName}". Повтор через 5 секунд...`);
                            if (!shouldStopProcessing) {
                                sleep(5000).then(() => readyToChargeCard(cardId, cardName).then(resolve).catch(reject)); // Рекурсивный вызов
                            } else { reject(new Error('Process stopped by user during AJAX error handling')); }
                            return;
                        }
                        reject(jqXHR);
                    }
                });
            });
            if (shouldStopProcessing) return false;
            if (data?.error) {
                if (data.error === 'Слишком часто, подождите и повторите действие' || data.error.toLowerCase().includes('слишком часто')) {
                    safeDLEPushCall('info', `"Слишком часто" для "${cardName}". Повтор через 2 секунды...`);
                    await sleep(2000);
                    return shouldStopProcessing ? false : await readyToChargeCard(cardId, cardName); // Рекурсивный вызов
                }
                if (data.error.includes('уже добавлена вами в предложения')) {
                    return true;
                }
                safeDLEPushCall('error',`Карта "${cardName}" в блоке`);
                return false;
            }
            if (data?.status == "added") {
                safeDLEPushCall('info', `Карта "${cardName}" добавлена.`);
                return true;
            }
            if (data?.status == "deleted") {
                safeDLEPushCall('info', `Карта "${cardName}" удалена`);
                await sleep(800);
                return shouldStopProcessing ? false : await readyToChargeCard(cardId, cardName);
            }
            if (data?.message) {
                safeDLEPushCall('info', `Сообщение от сервера для "${cardName}": ${data.message}`);
            }
            return false;
        } catch (e) {
            if (e && (e.message === 'Process stopped by user before AJAX call' || e.message === 'Process stopped by user during AJAX error handling' || e.message === 'Process stopped by user')) {
                return false;
            }
            console.error(`Критическая ошибка запроса readyToChargeCard для "${cardName}" (ID: ${cardId}):`, e);
            if (e.status === 502 || e.status === 503 || e.status === 504) {
                safeDLEPushCall('info', `Серверная ошибка ${e.status} для "${cardName}" (catch). Ждите 5 секунд...`);
                await sleep(5000);
                return shouldStopProcessing ? false : await readyToChargeCard(cardId, cardName);
            }
            return false;
        }
    };


    // #######################################################################
    // # Запускает процесс массового добавления карт со страницы в список "Готов обменять".
    // #######################################################################
    async function readyToCharge() {
        const buttonId = 'readyToCharge';
        const readyToChargeBtn = document.getElementById(buttonId);
        if (isAutoChargeRunning) {
            shouldStopProcessing = true; sessionStorage.removeItem('shouldAutoCharge');
            safeDLEPushCall('info', 'Процесс "Готов обменять" остановлен.');
            hideSpecialButtonCounter(buttonId);
            if (readyToChargeBtn && originalReadyToChargeColor) readyToChargeBtn.style.background = originalReadyToChargeColor;
            return;
        }
        isAutoChargeRunning = true; shouldStopProcessing = false;
        sessionStorage.setItem('shouldAutoCharge', 'true');
        if (readyToChargeBtn && !originalReadyToChargeColor) originalReadyToChargeColor = readyToChargeBtn.style.background;
        if (readyToChargeBtn) readyToChargeBtn.style.background = 'linear-gradient(145deg, rgb(50, 200, 50), rgb(0, 150, 0))';
        safeDLEPushCall('info', 'Добавляем в "Не нужное" (кроме заблокированных).');
        await sleep(200);
        let cards = getCardsOnPage(); let counter = cards.length; const initialCardCountForPage = cards.length;
        let processedOnPage = 0;
        if (!counter) {
            safeDLEPushCall('info', 'Нет карт для обработки на странице.');
            isAutoChargeRunning = false; sessionStorage.removeItem('shouldAutoCharge');
            if (readyToChargeBtn && originalReadyToChargeColor) readyToChargeBtn.style.background = originalReadyToChargeColor;
            hideSpecialButtonCounter(buttonId); return;
        }
        updateSpecialButtonCounterText(buttonId, counter); showSpecialButtonCounter(buttonId);
        startAnimation(buttonId); clearMarkFromCards();
        for (const cardElement of cards) {
            if (cardElement.classList.contains('trade__inventory-item--lock')) {
                safeDLEPushCall('info', `Карта "${cardElement.dataset.name || 'без имени'}" пропущена (заблокирована).`);
                counter--; updateSpecialButtonCounterText(buttonId, counter); continue;
            }
            const instanceCardId = await getCardId(cardElement, 'owner');
            if (instanceCardId) {
                const cardName = cardElement.dataset.name || `ID ${instanceCardId}`;
                const success = await readyToChargeCard(instanceCardId, cardName);
                if (shouldStopProcessing) break;
                if (success) { processedOnPage++; addCheckMark(cardElement); }
            } else {
                safeDLEPushCall('warning', `Пропуск карты: не найден ID экземпляра для "${cardElement.getAttribute('data-name') || `(тип ID ${await getCardId(cardElement, 'type') || 'неизвестен'})`}".`);
            }
            counter--; updateSpecialButtonCounterText(buttonId, counter);
            if (!shouldStopProcessing) await sleep(1000);
        }
        stopAnimation(buttonId); hideSpecialButtonCounter(buttonId);
        if (readyToChargeBtn && originalReadyToChargeColor) readyToChargeBtn.style.background = originalReadyToChargeColor;
        if (initialCardCountForPage > 0 && !shouldStopProcessing) {
            safeDLEPushCall('info', `На этой странице обработано ${processedOnPage} карт(ы). Переход на следующую...`);
            await goToNextPage();
        } else if (shouldStopProcessing) {
            sessionStorage.removeItem('shouldAutoCharge');
        } else {
            const nextPageExists = !!(document.querySelector('.pagination__item--next a:not(.disabled), .pagination a[rel="next"]:not([aria-disabled="true"])') ||
                                      Array.from(document.querySelectorAll('.pagination a[href*="/page/"]')).find(link => {
                const pageNumMatch = link.href.match(/\/page\/(\d+)/);
                const currentPageNum = parseInt((window.location.pathname.match(/\/page\/(\d+)/) || [,'1'])[1]);
                return pageNumMatch && parseInt(pageNumMatch[1]) === currentPageNum + 1 && !link.closest('.disabled') && !link.classList.contains('disabled') && link.getAttribute('aria-disabled') !== 'true';
            }));
            if (!nextPageExists && initialCardCountForPage > 0) {
                safeDLEPushCall('success','Обработка всех карт на всех страницах завершена.');
            }
            sessionStorage.removeItem('shouldAutoCharge');
        }
        isAutoChargeRunning = false;
    }

    // #######################################################################
    // # Инициализирует автоматическое продолжение процесса "Готов обменять" при переходе на новую страницу.
    // #######################################################################
    function initAutoCharge() {
        if (sessionStorage.getItem('shouldAutoCharge') === 'true') {
            sessionStorage.removeItem('shouldAutoCharge');
            const execCharge = async () => {
                await sleep(1000);
                if (!shouldStopProcessing) {
                    safeDLEPushCall('info', 'Автоматический запуск обработки карт...');
                    await readyToCharge();
                }
            };
            if (document.readyState === 'complete') {
                execCharge();
            } else {
                window.addEventListener('load', execCharge);
            }
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoCharge);
    } else {
        initAutoCharge();
    }

    // #######################################################################
    // # Инициализирует автоматическое продолжение проверки спроса при переходе на новую страницу.
    // #######################################################################
    function initAutoProcessDemand() {
        if (sessionStorage.getItem('shouldAutoProcessDemand') === 'true') {
            const execDemandCheck = async () => {
                await sleep(1500);
                if (!shouldStopProcessCards) {
                    safeDLEPushCall('info', 'Автоматическое продолжение проверки спроса...');
                    await processCards(true);
                } else {
                    sessionStorage.removeItem('shouldAutoProcessDemand');
                }
            };
            if (document.readyState === 'complete') {
                execDemandCheck();
            } else {
                window.addEventListener('load', execDemandCheck);
            }
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoProcessDemand);
    } else {
        initAutoProcessDemand();
    }

    // #######################################################################
    // # Скрывает первое стандартное уведомление на странице, симулируя клик по нему.
    // #######################################################################
    function clearIcons() {
        const firstNotification = document.querySelector('.card-notification:first-child');
        if (firstNotification) firstNotification.click();
    }

    // #######################################################################
    // # Добавляет кнопку "Очистить" к полю поиска карт.
    // #######################################################################
    function addClearButton() {
        const filterControls = document.querySelector('.card-filter-form__controls');
        if (!filterControls) {
            return;
        }
        if (document.querySelector('.clear-search-btn')) {
            return;
        }
        const inputField = filterControls.querySelector('.card-filter-form__search');
        if (!inputField) {
            return;
        }
        // Создаем кнопку "Очистить поиск по картам"
        const clearButton = document.createElement('button');
        clearButton.className = 'clear-search-btn';
        clearButton.title = 'Очистить поиск по картам';
        clearButton.innerHTML = '<i class="fal fa-eraser" style="font-size: 13px;"></i>';
        clearButton.style.position = 'absolute';
        clearButton.style.top = '50%';
        clearButton.style.left = '-32px';
        clearButton.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        clearButton.style.color = '#fff';
        clearButton.style.border = 'none';
        clearButton.style.padding = '10px 10px';
        clearButton.style.borderRadius = '5px';
        clearButton.style.cursor = 'pointer';
        clearButton.style.transform = 'translateY(-50%)';
        clearButton.style.width = '32px';
        clearButton.style.height = '35px';
        clearButton.addEventListener('click', function () {
            inputField.value = '';
            inputField.focus();
            const currentUrlObject = new URL(window.location.href);
            const searchParams = currentUrlObject.searchParams;
            let basePath = currentUrlObject.pathname.split('/page/')[0];
            if (!basePath.endsWith('/')) {
                basePath += '/';
            }
            const newCleanUrl = new URL(basePath, currentUrlObject.origin);
            const nameValue = searchParams.get('name');
            if (nameValue) {
                newCleanUrl.searchParams.set('name', nameValue);
            }
            window.location.href = newCleanUrl.href;
        });
        if (window.getComputedStyle(filterControls).position === 'static') {
            filterControls.style.position = 'relative';
        }
        filterControls.appendChild(clearButton);
    }


    // #######################################################################
    // # Добавляет на страницу кнопку-ссылку для быстрого перехода в библиотеку карт.
    // #######################################################################
    function addGoToClubsButton() {
        const filterControls = document.querySelector('.ncard__tabs');
        if (!filterControls) {
            return;
        }
        if (document.querySelector('.go-to-clubs-btn')) {
            return;
        }
        const goToClubsLink = document.createElement('a');
        goToClubsLink.className = 'go-to-clubs-btn';
        goToClubsLink.title = 'база карт';
        goToClubsLink.href = 'https://animestars.org/cards/';
        goToClubsLink.innerHTML = '<img src="https://media.tenor.com/K7MNEhS8nwUAAAAM/demon-slayer-inosuke.gif" style="width: 100%; height: 100%; object-fit: cover; border-radius: 55px;"/>';
        goToClubsLink.style.display = 'block';
        goToClubsLink.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        goToClubsLink.style.color = '#fff';
        goToClubsLink.style.border = 'none';
        goToClubsLink.style.padding = '0';
        goToClubsLink.style.borderRadius = '50px';
        goToClubsLink.style.cursor = 'pointer';
        goToClubsLink.style.width = '100px';
        goToClubsLink.style.height = '100px';
        goToClubsLink.style.textDecoration = 'none';
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.marginBottom = '-30px';
        buttonContainer.style.marginTop = '-30px';
        buttonContainer.appendChild(goToClubsLink);
        filterControls.parentNode.insertBefore(buttonContainer, filterControls);
    }

    // #######################################################################
    // # Добавляет кнопки индивидуальной проверки спроса на все карты, которые еще не были проверены.
    // #######################################################################
    function addDemandCheckButtonsToCards() {
        const cards = getCardsOnPage();
        cards.forEach((cardElement, index) => {
            const cardIdForLog = cardElement.dataset.id || `Card-${index}`;
            if (cardElement.classList.contains('card-show__placeholder') || cardElement.classList.contains('noffer')) {
                return;
            }
            if (cardElement.classList.contains('trade__inventory-item--lock') || cardElement.classList.contains('remelt__inventory-item--lock')) {
                return;
            }
            if (cardElement.classList.contains('div-checked')) {
                return;
            }
            if (cardElement.querySelector('.check-demand-btn')) {
                return;
            }
            const demandBtn = createDemandCheckButton();
            demandBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                const typeCardId = await getCardId(cardElement, 'type');
                if (typeCardId) {
                    await updateCardInfo(typeCardId, cardElement, true);
                } else {
                    safeDLEPushCall('warning', 'Не удалось получить ID карты для проверки спроса.');
                    demandBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                    demandBtn.style.background = 'rgba(255, 100, 100, 0.8)';
                    Object.assign(demandBtn.style, { opacity: '1', visibility: 'visible', transform: 'translateY(0)'});
                }
            });
            if (window.getComputedStyle(cardElement).position === 'static') {
                cardElement.style.position = 'relative';
            }
            cardElement.appendChild(demandBtn);
            cardElement.addEventListener('mouseenter', () => {
                if (!cardElement.classList.contains('div-checked') &&
                    !demandBtn.querySelector('.fa-spinner') &&
                    !demandBtn.querySelector('.fa-exclamation-triangle')) {
                    demandBtn.style.opacity = '0.8';
                    demandBtn.style.visibility = 'visible';
                    demandBtn.style.transform = 'translateY(0)';
                }
            });
            cardElement.addEventListener('mouseleave', () => {
                if (!cardElement.classList.contains('div-checked') &&
                    !demandBtn.querySelector('.fa-spinner') &&
                    !demandBtn.querySelector('.fa-exclamation-triangle')) {
                    demandBtn.style.opacity = '0';
                    demandBtn.style.visibility = 'hidden';
                    demandBtn.style.transform = 'translateY(0px)';
                }
            });
        });
    }

    // #######################################################################
    // # Применяет стили для изменения максимальной ширины страницы и пересчета сетки карт.
    // #######################################################################
    function applyMaxWidthToPageViaSlider(widthValue) {
        if (!dynamicPageStylesElement) {
            dynamicPageStylesElement = document.createElement('style');
            dynamicPageStylesElement.id = 'dynamicPageMaxWidthStylesBySlider';
            document.head.appendChild(dynamicPageStylesElement);
        }
        const cardsPerRow = 7;
        const cardGap = 3;
        const existingParentHorizontalPadding = 3;
        let mainContainerMaxWidthStyle = '';
        let cardLayoutStyles = '';
        if (widthValue < 4000) {
            mainContainerMaxWidthStyle = `
        @media (min-width: 0px) {
          .wrapper-container.wrapper-main {
             max-width: ${widthValue}px !important;
             margin-left: auto !important;
             margin-right: auto !important;
          }
        }`;
            const effectiveWidthForCardsContainerContent = widthValue - existingParentHorizontalPadding;
            const cardWidthPx = (effectiveWidthForCardsContainerContent - ((cardsPerRow - 1) * cardGap)) / cardsPerRow;
            const roundedCardWidth = Math.floor(cardWidthPx);
            const totalWidthOfCardsInRow = (cardsPerRow * roundedCardWidth) + ((cardsPerRow - 1) * cardGap);
            const remainingSpaceForSidePaddings = effectiveWidthForCardsContainerContent - totalWidthOfCardsInRow;
            const sidePaddingForCardsContainer = Math.max(0, Math.floor(remainingSpaceForSidePaddings / 2));
            const cardAspectRatioPaddingBottom = '150%';
            cardLayoutStyles = `
        @media (min-width: 0px) {
            .anime-cards.anime-cards--full-page {
                display: flex !important;
                flex-wrap: wrap !important;
                gap: ${cardGap}px !important;
                justify-content: center !important;
                padding-left: ${sidePaddingForCardsContainer}px !important;
                padding-right: ${sidePaddingForCardsContainer}px !important;
                box-sizing: border-box !important;
            }
            .anime-cards__item-wrapper {
                flex: 0 0 ${roundedCardWidth}px !important;
                max-width: ${roundedCardWidth}px !important;
                margin: 0 !important;
                box-sizing: border-box !important;
            }
            .anime-cards__item .anime-cards__image {
                width: 100% !important;
                height: 0 !important;
                padding-bottom: ${cardAspectRatioPaddingBottom} !important;
                position: relative !important;
                overflow: hidden !important;
                background-color: transparent; /* Устанавливаем прозрачный фон */
            }
            .anime-cards__item .anime-cards__image img {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
            }
            .anime-cards__item {
                display: flex !important;
                flex-direction: column !important;
                height: 100% !important;
                position: relative;
                background-color: transparent; /* Прозрачный фон для карточек */
            }
        }
    `;
        } else {
            mainContainerMaxWidthStyle = `
        @media (min-width: 0px) {
          .wrapper-container.wrapper-main {
              max-width: none !important;
          }
        }`;
            cardLayoutStyles = `
        @media (min-width: 0px) {
            .anime-cards.anime-cards--full-page {
                display: '' !important;
                flex-wrap: '' !important;
                gap: '' !important;
                justify-content: '' !important;
                padding-left: '' !important;
                padding-right: '' !important;
                box-sizing: '' !important;
            }
            .anime-cards__item-wrapper {
                flex: '' !important;
                max-width: '' !important;
                margin: '' !important;
            }
            .anime-cards__item .anime-cards__image {
                width: '' !important;
                height: '' !important;
                padding-bottom: '' !important;
                position: '' !important;
                overflow: '' !important;
            }
            .anime-cards__item .anime-cards__image img {
                position: '' !important;
                object-fit: '' !important;
            }
            .anime-cards__item {
                display: '' !important;
                flex-direction: '' !important;
                height: '' !important;
            }
        }
    `;
        }

        dynamicPageStylesElement.textContent = mainContainerMaxWidthStyle + cardLayoutStyles;
        if (maxWidthValueDisplayElement) {
            maxWidthValueDisplayElement.textContent = (widthValue < 4000) ? `${widthValue}px` : 'Авто';
        }
    }

    // Обработчик события загрузки изображений
    window.addEventListener('load', () => {
        document.querySelectorAll('.anime-cards__item').forEach(item => {
            item.style.backgroundColor = 'transparent';
        });
    });

    // #######################################################################
    // # Сохраняет выбранное значение ширины страницы в localStorage.
    // #######################################################################
    function saveMaxWidthPreferenceSlider(widthValue) {
        localStorage.setItem(MAX_WIDTH_STORAGE_KEY_SLIDER, String(widthValue));
    }

    // #######################################################################
    // # Загружает сохраненное значение ширины страницы и применяет его при инициализации.
    // #######################################################################
    function loadAndApplyMaxWidthPreferenceSlider() {
        let storedWidth = localStorage.getItem(MAX_WIDTH_STORAGE_KEY_SLIDER);
        let initialWidth = storedWidth ? parseInt(storedWidth, 10) : DEFAULT_MAX_WIDTH_SLIDER;
        if (maxWidthSliderElement) maxWidthSliderElement.value = initialWidth;
        applyMaxWidthToPageViaSlider(initialWidth);
    }

    // #######################################################################
    // # Создает и инициализирует UI-компонент (слайдер) для управления максимальной шириной страницы.
    // #######################################################################
    function createMaxWidthControlSlider() {
        const sliderContainer = document.createElement('div');
        sliderContainer.id = 'maxWidthSliderContainer';
        if (window.location.pathname.startsWith('/pm/')) {
            sliderContainer.setAttribute('data-mce-bogus', '1');
        }
        Object.assign(sliderContainer.style, {
            position: 'fixed', right: '11px', bottom: '135px', zIndex: '100',
            background: 'rgba(60, 30, 30, 0.9)', padding: '0px 0px',
            borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px',
            transition: 'opacity 0.3s ease, transform 0.3s ease, visibility 0s linear 0s'
        });
        const label = document.createElement('label');
        label.htmlFor = 'maxWidthSliderInputElement';
        Object.assign(label.style, { color: '#e0e0e0', fontSize: '12px', fontWeight: '500', fontFamily: 'Arial, sans-serif' });
        maxWidthSliderElement = document.createElement('input');
        maxWidthSliderElement.type = 'range'; maxWidthSliderElement.id = 'maxWidthSliderInputElement';
        maxWidthSliderElement.min = '1285'; maxWidthSliderElement.max = '4005'; maxWidthSliderElement.step = '85'; // Стандартный диапазон
        Object.assign(maxWidthSliderElement.style, { width: '40px', cursor: 'ew-resize', margin: '0px 0' });
        maxWidthValueDisplayElement = document.createElement('span');
        maxWidthValueDisplayElement.id = 'maxWidthValueDisplayElement';
        Object.assign(maxWidthValueDisplayElement.style, {
            color: 'white', fontSize: '8px', fontWeight: 'bold', fontFamily: 'monospace',
            minWidth: '40px', textAlign: 'center', padding: '0px 0px',
            background: 'rgba(0,0,0,0.2)', borderRadius: '0px'
        });
        maxWidthSliderElement.addEventListener('input', () => applyMaxWidthToPageViaSlider(parseInt(maxWidthSliderElement.value, 10)));
        maxWidthSliderElement.addEventListener('change', () => saveMaxWidthPreferenceSlider(parseInt(maxWidthSliderElement.value, 10)));
        sliderContainer.appendChild(label); sliderContainer.appendChild(maxWidthSliderElement); sliderContainer.appendChild(maxWidthValueDisplayElement);
        document.body.appendChild(sliderContainer);
        loadAndApplyMaxWidthPreferenceSlider();
        if (!managedButtonSelectors.includes('#maxWidthSliderContainer')) {
            managedButtonSelectors.push('#maxWidthSliderContainer');
        }
        if (!document.getElementById('maxWidthSliderMobileHideStyle')) {
            const sliderHideStyle = document.createElement('style');
            sliderHideStyle.id = 'maxWidthSliderMobileHideStyle';
            sliderHideStyle.textContent = `@media (max-width: 0px) { #maxWidthSliderContainer { display: none !important; } }`;
            document.head.appendChild(sliderHideStyle);
        }
    }

    // #######################################################################
    // # Инициализирует всю логику проверки дубликатов карт: добавление индивидуальных и массовой кнопок, обработчики, наблюдатели.
    // #######################################################################
    function initDuplicateChecker() {
        const ALL_CARD_SELECTORS_ARRAY = [
            '.anime-cards__item', '.card-item', '.card',
            'a.trade__main-item[href^="/cards/"]',
            '.history__body-item a[href^="/cards/"]',
            '.lootbox__card'
        ];
        const CARD_SELECTORS_FOR_QUERY = ALL_CARD_SELECTORS_ARRAY.join(', ');

        // #######################################################################
        // # Получает имя залогиненного пользователя со страницы.
        // #######################################################################
        function getLoggedUserName() {
            const el = document.querySelector('.lgn__name span');
            return el ? el.textContent.trim() : null;
        }

        // #######################################################################
        // # Создает и стилизует HTML-элемент кнопки для проверки одной карты.
        // #######################################################################
        function createDupBtn() {
            const btn = document.createElement('div');
            btn.textContent = '🔍';
            btn.className = 'check-duplicates-btn';
            if (window.location.pathname.startsWith('/pm/')) {
                btn.setAttribute('data-mce-bogus', '1');
            }
            btn.title = 'Проверить дубликаты по ID';
            btn.style.cssText = `
  position: absolute; bottom: 30px; right: 2px; z-index: 10;
  background: rgba(211, 211, 211, 0.6);
  border: 1px solid #ccc; border-radius: 15px;
  font-size: 10px; padding: 3px 3px; cursor: pointer;
  transition: all 0.2s ease; font-weight: bold; color: black;
  opacity: 0;
  visibility: hidden;
  transform: translateY(0px);
  min-width: 18px; text-align: center; line-height: 1.3;
  box-sizing: border-box;`;
            return btn;
        }

        // #######################################################################
        // # Запрашивает имя персонажа со страницы /need/ по ID карты (с кэшированием).
        // #######################################################################
        async function fetchCharacterNameFromNeedPage(cardId) {
            const cacheKey = `name_${cardId}`;
            if (cardInfoCache.has(cacheKey)) return cardInfoCache.get(cacheKey);
            try {
                const res = await fetch(`${location.origin}/cards/users/need/?id=${cardId}`, { credentials: 'include' });
                if (!res.ok) { cardInfoCache.set(cacheKey, null); return null; }
                const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
                const titleEl = doc.querySelector('.ncard__main-title.as-center a[href^="/cards/"]');
                if (titleEl?.textContent) {
                    const name = titleEl.textContent.trim();
                    cardInfoCache.set(cacheKey, name);
                    return name;
                }
                cardInfoCache.set(cacheKey, null); return null;
            } catch (err) { cardInfoCache.set(cacheKey, null); return null; }
        }

        // #######################################################################
        // # Запрашивает ссылку на Аниме со страницы /users/ по ID карты (с кэшированием).
        // #######################################################################
        async function fetchAnimeLinkFromUsersPage(cardId) {
            const cacheKey = `animeLink_${cardId}`;
            if (cardInfoCache.has(cacheKey)) return cardInfoCache.get(cacheKey);
            try {
                const res = await fetch(`${location.origin}/cards/users/?id=${cardId}`, { credentials: 'include' });
                if (!res.ok) { cardInfoCache.set(cacheKey, null); return null; }
                const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
                const animeLinkEl = doc.querySelector('a.ncard__img');
                if (animeLinkEl?.hasAttribute('href')) {
                    const hrefVal = animeLinkEl.getAttribute('href');
                    if (hrefVal.includes('/aniserials/')) {
                        const link = new URL(hrefVal, location.origin).href;
                        cardInfoCache.set(cacheKey, link);
                        return link;
                    }
                }
                cardInfoCache.set(cacheKey, null); return null;
            } catch (err) { cardInfoCache.set(cacheKey, null); return null; }
        }

        // #######################################################################
        // # Запрашивает название Аниме с его страницы по URL (с кэшированием).
        // #######################################################################
        async function fetchAnimeNameFromAnimePage(animePageUrl, cardId) {
            const cacheKey = `animeName_${animePageUrl}`;
            if (cardInfoCache.has(cacheKey)) return cardInfoCache.get(cacheKey);
            try {
                const res = await fetch(animePageUrl, { credentials: 'include' });
                if (!res.ok) { cardInfoCache.set(cacheKey, null); return null; }
                const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
                const titleH1 = doc.querySelector('h1[itemprop="name"]');
                const origTitleDiv = doc.querySelector('.pmovie__original-title');
                let animeName = null;
                if (titleH1?.textContent) {
                    animeName = titleH1.textContent.replace(/(Аниме)$/i, '').trim();
                } else if (origTitleDiv?.textContent) {
                    animeName = origTitleDiv.textContent.trim();
                }
                if (animeName) {
                    cardInfoCache.set(cacheKey, animeName);
                    return animeName;
                }
                cardInfoCache.set(cacheKey, null); return null;
            } catch (err) { cardInfoCache.set(cacheKey, null); return null; }
        }

        // #######################################################################
        // # Запрашивает страницу поиска по URL и находит на ней все дубликаты указанной карты.
        // #######################################################################
        async function fetchAllPagesUniversal(searchUrl, targetCardId) {
            try {
                const matchingCards = [];
                const response = await fetch(searchUrl, { credentials: 'include' });
                if (!response.ok) {
                    console.error(`[Dups Fetch] Ошибка HTTP ${response.status} при запросе дубликатов: ${searchUrl}`);
                    safeDLEPushCall('error', `Ошибка ${response.status} при поиске дубликатов для card_id ${targetCardId}`);
                    return [];
                }
                const htmlText = await response.text();
                const doc = new DOMParser().parseFromString(htmlText, 'text/html');
                const foundOnPage = doc.querySelectorAll(`.anime-cards__item[data-id="${targetCardId}"], .lootbox__card[data-id="${targetCardId}"]`);
                matchingCards.push(...foundOnPage);
                return matchingCards;
            } catch (err) {
                console.error(`[Dups Fetch] Ошибка сети при запросе дубликатов (${targetCardId}): ${searchUrl}`, err);
                safeDLEPushCall('error', `Сетевая ошибка при поиске дубликатов для card_id ${targetCardId}`);
                return [];
            }
        }

        // #######################################################################
        // # Проверяет наличие дубликатов для одной конкретной карты и обновляет ее кнопку.
        // #######################################################################
        function checkCardDuplicates(cardElement, triggeredByMassCheck = false) {
            return new Promise(async (resolve) => {
                const btn = cardElement.querySelector('.check-duplicates-btn');
                if (!btn) {
                    resolve();
                    return;
                }

                // >>> НОВАЯ ОПТИМИЗАЦИЯ: ПРОВЕРКА КЭША В САМОМ НАЧАЛЕ <<<
                const cardId = cardElement.dataset.id;
                const loggedInUserName = getLoggedUserName();
                if (cardId && loggedInUserName) {
                    const cacheKeyForDuplicates = `${loggedInUserName}_${cardId}`;
                    if (duplicatesCache.has(cacheKeyForDuplicates)) {
                        const duplicateCount = duplicatesCache.get(cacheKeyForDuplicates);
                        updateButtonContent(btn, duplicateCount);
                        btn.classList.add('checked');
                        resolve(); // Завершаем, так как данные уже есть
                        return;
                    }
                }
                // >>> КОНЕЦ ОПТИМИЗАЦИИ <<<

                if (массоваяПроверкаДублейЗапущена && !массоваяПроверкаДублейНаПаузе && !triggeredByMassCheck) {
                    updateButtonContent(btn, '...');
                    btn.classList.add('checked');
                    await sleep(1000);
                    if (btn.textContent === '...') {
                        updateButtonContent(btn, '🔍');
                        btn.classList.remove('checked');
                    }
                    resolve();
                    return;
                }
                if (btn.classList.contains('checked') && btn.textContent !== '⏳' && btn.textContent !== '🔍') {
                    if (triggeredByMassCheck) {
                        resolve();
                        return;
                    }
                }
                btn.style.opacity = '1'; btn.style.visibility = 'visible'; btn.style.transform = 'translateY(0)';
                updateButtonContent(btn, '⏳');
                btn.style.pointerEvents = 'none';
                btn.classList.remove('checked');
                try {
                    const loggedInUserName = getLoggedUserName();
                    const inventoryOwnerOnPage = getCurrentInventoryUsernameFromUrl();
                    const inventoryOwnerForSearch = loggedInUserName;
                    if (!inventoryOwnerForSearch) {
                        safeDLEPushCall('warning', 'Не удалось определить владельца инвентаря для поиска дубликатов.');
                        updateButtonContent(btn, '❓'); btn.classList.add('checked'); btn.style.pointerEvents = 'auto';
                        resolve();
                        return;
                    }
                    if (!loggedInUserName && inventoryOwnerOnPage && inventoryOwnerOnPage !== loggedInUserName && !triggeredByMassCheck) {
                        updateButtonContent(btn, '🔒'); btn.classList.add('checked'); btn.style.pointerEvents = 'auto';
                        resolve();
                        return;
                    }
                    if (loggedInUserName && inventoryOwnerOnPage && inventoryOwnerOnPage !== loggedInUserName && !triggeredByMassCheck) {
                    }
                    const cardId = cardElement.dataset.id;
                    if (!cardId) {
                        safeDLEPushCall('warning', 'Не найден ID карты для проверки дубликатов.');
                        updateButtonContent(btn, '❓'); btn.classList.add('checked'); btn.style.pointerEvents = 'auto';
                        resolve();
                        return;
                    }
                    const cacheKeyForDuplicates = `${inventoryOwnerForSearch}_${cardId}`;
                    if (duplicatesCache.has(cacheKeyForDuplicates) && !triggeredByMassCheck && inventoryOwnerForSearch === loggedInUserName) {
                        updateButtonContent(btn, duplicatesCache.get(cacheKeyForDuplicates));
                        btn.classList.add('checked'); btn.style.pointerEvents = 'auto';
                        resolve();
                        return;
                    }
                    const searchUrlObject = new URL(`${location.origin}/user/cards/`);
                    searchUrlObject.searchParams.set('name', inventoryOwnerForSearch);
                    searchUrlObject.searchParams.set('card_id', cardId);
                    const searchUrl = searchUrlObject.toString();
                    const matches = await fetchAllPagesUniversal(searchUrl, cardId);
                    const duplicateCount = matches.length;
                    updateButtonContent(btn, duplicateCount);
                    if (inventoryOwnerForSearch === loggedInUserName) {
                        duplicatesCache.set(cacheKeyForDuplicates, duplicateCount);
                    }
                    btn.classList.add('checked');
                } catch (err) {
                    console.error(`[Dups Check] Ошибка при проверке дубликатов для card_id ${cardElement.dataset.id}:`, err);
                    safeDLEPushCall('error', `Ошибка проверки дубликатов для ID ${cardElement.dataset.id}`);
                    updateButtonContent(btn, '❌');
                    btn.classList.add('checked');
                } finally {
                    btn.style.pointerEvents = 'auto';
                    resolve();
                }
            });
        }

        // #######################################################################
        // # Обновляет вид и содержимое индивидуальной кнопки (счетчик, иконку, цвет).
        // #######################################################################
        function updateButtonContent(btn, content) {
            btn.textContent = '';
            if (content === '🔒' || content === '❓' || content === '❌' || content === '⏳' || content === '...') {
                btn.textContent = content;
                btn.style.background = (content === '⏳' || content === '...') ? 'LightGray' : 'rgba(255, 100, 100, 0.8)';
                btn.style.color = (content === '⏳' || content === '...') ? 'black' : 'white';
                btn.style.fontSize = '11px';
            } else {
                const count = Number(content);
                btn.textContent = `×${count}`;
                btn.style.background = count > 1 ? 'rgba(255, 0, 0, 0.7)' :
                (count === 1 ? 'rgba(0, 150, 0, 0.7)' :
                 'rgba(0, 0, 0, 0.7)');
                btn.style.color = 'white';
                btn.style.fontSize = '10px';
            }
            btn.style.opacity = '1'; btn.style.visibility = 'visible'; btn.style.transform = 'translateY(0)';
        }

        // #######################################################################
        // # Находит все карточки на странице и добавляет на них кнопки для проверки.
        // #######################################################################
        function addCheckButtons() {
            const userId = getLoggedUserName();
            if (!userId && !isMyCardPage() && !location.pathname.startsWith('/trades/') && !location.pathname.startsWith('/history/') && !isCardPackPage()) {
                return;
            }
            ALL_CARD_SELECTORS_ARRAY.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    let cardEl = el;
                    let pCardId = null;
                    if (sel === 'a.trade__main-item[href^="/cards/"]') {
                        const idMatch = el.getAttribute('href').match(/[?&]id=(\d+)/);
                        if (idMatch?.[1]) {
                            pCardId = idMatch[1];
                            if (!cardEl.dataset.id) cardEl.dataset.id = pCardId;
                        } else return;
                    }
                    else if (sel === '.history__body-item a[href^="/cards/"]') {
                        const parentItem = el.closest('.history__body-item');
                        if (!parentItem) return;
                        cardEl = parentItem;
                        const idMatch = el.getAttribute('href').match(/[?&]id=(\d+)/);
                        if (idMatch?.[1]) {
                            pCardId = idMatch[1];
                            if (!cardEl.dataset.id) cardEl.dataset.id = pCardId;
                        } else return;
                    }
                    if (!pCardId && cardEl.dataset.id) pCardId = cardEl.dataset.id;
                    if (!pCardId) return;
                    if (!cardEl.dataset.id) cardEl.dataset.id = pCardId;
                    if (cardEl.querySelector('.check-duplicates-btn') || cardEl.closest('.owl-item') || cardEl.offsetParent === null) return;
                    const newBtn = createDupBtn();
                    newBtn.addEventListener('click', (e) => {
                        e.stopPropagation(); e.preventDefault();
                        if (!getLoggedUserName()) {
                            updateButtonContent(newBtn, '🔒');
                            newBtn.classList.add('checked');
                            return;
                        }
                        checkCardDuplicates(cardEl);
                    });
                    if (window.getComputedStyle(cardEl).position === 'static') {
                        cardEl.style.position = 'relative';
                    }
                    cardEl.appendChild(newBtn);
                    cardEl.addEventListener('mouseenter', () => {
                        if (!newBtn.classList.contains('checked') || newBtn.textContent === '🔍') {
                            Object.assign(newBtn.style, { opacity: '1', visibility: 'visible', transform: 'translateY(0)' });
                        }
                    });
                    cardEl.addEventListener('mouseleave', () => {
                        if (!newBtn.classList.contains('checked')) {
                            Object.assign(newBtn.style, { opacity: '0', visibility: 'hidden', transform: 'translateY(0px)' });
                        }
                    });
                });
            });
        }

        function createMainCheckButton() {
            if (document.getElementById('check-all-duplicates-btn')) return;
            const mainButton = document.getElementById('check-all-duplicates-btn') || document.createElement('button');
            if (!mainButton.id) mainButton.id = 'check-all-duplicates-btn';
            mainButton.title = "Проверить дубликаты карт";
            let duplicatesIcon = mainButton.querySelector('span');
            if (!duplicatesIcon) {
                duplicatesIcon = document.createElement('span');
                mainButton.appendChild(duplicatesIcon);
            }
            Object.assign(mainButton.style, {
                position:'fixed', right:'12px', bottom:'180px', zIndex:'102',
                width:'40px', height:'40px', border:'none', borderRadius:'50%',
                transition:'transform 0.1s ease, box-shadow 0.1s ease, background 0.3s ease, opacity 0.3s ease, visibility 0s linear 0s',
                color:'white', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', padding:'0'
            });

            // #######################################################################
            // # (внутри createMainCheckButton) Обновляет иконку и состояние главной кнопки (старт, пауза, загрузка).
            // #######################################################################
            function updateMainButtonUI() {
                mainButton.disabled = false;
                if (массоваяПроверкаДублейНаПаузе) {
                    duplicatesIcon.className = 'fal fa-play';
                    mainButton.style.background = 'linear-gradient(145deg, rgb(100, 50, 50), rgb(50, 50, 50))';
                    mainButton.title = "Возобновить проверку дубликатов";
                } else if (массоваяПроверкаДублейЗапущена) {
                    duplicatesIcon.className = 'fal fa-spinner fa-spin';
                    mainButton.style.background = 'linear-gradient(145deg, rgb(100, 50, 50), rgb(50, 50, 50))';
                    mainButton.title = "Поставить проверку дубликатов на паузу";
                } else {
                    duplicatesIcon.className = 'fal fa-search';
                    mainButton.style.background = 'linear-gradient(145deg, rgb(100, 50, 50), rgb(50, 50, 50))';
                    mainButton.title = "Проверить дубликаты карт";
                }
                duplicatesIcon.style.fontSize = '18px';
            }

            // #######################################################################
            // # (внутри createMainCheckButton) Обрабатывает следующую порцию (batch) карт при массовой проверке.
            // #######################################################################
            async function processNextBatch() {
                if (idТаймаутаСледующегоБатча) clearTimeout(idТаймаутаСледующегоБатча);
                idТаймаутаСледующегоБатча = null;
                if (массоваяПроверкаДублейНаПаузе) {
                    safeDLEPushCall('info', "Проверка дубликатов поставлена на паузу.");
                    updateMainButtonUI();
                    return;
                }
                if (!массоваяПроверкаДублейЗапущена) {
                    updateMainButtonUI();
                    return;
                }
                updateMainButtonUI();

                // ЛОГИКА ВЫБОРА РЕЖИМА ПРОВЕРКИ
                if (isProcessingAutoPackCheck) {
                    const cardToProcess = массивКартДляПроверки[индексПоследнейПровереннойКарты];
                    checkCardDuplicates(cardToProcess, true);
                    индексПоследнейПровереннойКарты++;
                    if (индексПоследнейПровереннойКарты < массивКартДляПроверки.length) {
                        const delay = GM_getValue('autoDup_delay_ms', 50);
                        if (массоваяПроверкаДублейЗапущена && !массоваяПроверкаДублейНаПаузе) {
                            idТаймаутаСледующегоБатча = setTimeout(processNextBatch, delay);
                        } else {
                            updateMainButtonUI();
                        }
                    } else {
                        if (массоваяПроверкаДублейЗапущена && showDuplicateCheckNotifications) {
                            safeDLEPushCall('success', "Массовая проверка дубликатов завершена.");
                        }
                        массоваяПроверкаДублейЗапущена = false;
                        isProcessingAutoPackCheck = false;
                        индексПоследнейПровереннойКарты = 0;
                        массивКартДляПроверки = [];
                        updateMainButtonUI();
                    }
                } else {
                    const batchSize = 4;
                    const batch = массивКартДляПроверки.slice(индексПоследнейПровереннойКарты, индексПоследнейПровереннойКарты + batchSize);

                    if (batch.length === 0) {
                        if (массоваяПроверкаДублейЗапущена && showDuplicateCheckNotifications) {
                            safeDLEPushCall('success', "Массовая проверка дубликатов завершена.");
                        }
                        массоваяПроверкаДублейЗапущена = false;
                        isProcessingAutoPackCheck = false;
                        индексПоследнейПровереннойКарты = 0;
                        массивКартДляПроверки = [];
                        updateMainButtonUI();
                        return;
                    }
                    await Promise.all(batch.map(card => checkCardDuplicates(card, true)));
                    индексПоследнейПровереннойКарты += batch.length;
                    if (индексПоследнейПровереннойКарты < массивКартДляПроверки.length) {
                        const delay = 4000;
                        if (массоваяПроверкаДублейЗапущена && !массоваяПроверкаДублейНаПаузе) {
                            idТаймаутаСледующегоБатча = setTimeout(processNextBatch, delay);
                        } else {
                            updateMainButtonUI();
                        }
                    } else {
                        if (массоваяПроверкаДублейЗапущена && showDuplicateCheckNotifications) {
                            safeDLEPushCall('success', "Массовая проверка дубликатов завершена.");
                        }
                        массоваяПроверкаДублейЗапущена = false;
                        isProcessingAutoPackCheck = false;
                        индексПоследнейПровереннойКарты = 0;
                        массивКартДляПроверки = [];
                        updateMainButtonUI();
                    }
                }
            }
            mainButton.addEventListener('click', async (event) => {
                const wasAutoTriggered = unsafeWindow.isAutoDuplicateCheckTriggered === true;
                if (wasAutoTriggered) unsafeWindow.isAutoDuplicateCheckTriggered = false;
                showDuplicateCheckNotifications = event.isTrusted;
                const userId = getLoggedUserName();
                if (!userId) {
                    safeDLEPushCall('info', "Для массовой проверки дубликатов необходимо войти в систему.");
                    return;
                }
                if (массоваяПроверкаДублейЗапущена) {
                    if (массоваяПроверкаДублейНаПаузе) {
                        массоваяПроверкаДублейНаПаузе = false;
                        safeDLEPushCall('info', "Проверка дубликатов возобновлена.");
                        processNextBatch();
                    } else {
                        массоваяПроверкаДублейНаПаузе = true;
                        if (idТаймаутаСледующегоБатча) {
                            clearTimeout(idТаймаутаСледующегоБатча);
                            idТаймаутаСледующегоБатча = null;
                        }
                        safeDLEPushCall('info', "Запрос на паузу проверки...");
                        updateMainButtonUI();
                    }
                } else {
                    массоваяПроверкаДублейЗапущена = true;
                    массоваяПроверкаДублейНаПаузе = false;
                    индексПоследнейПровереннойКарты = 0;
                    if (showDuplicateCheckNotifications) {
                        safeDLEPushCall('info', "Начата массовая проверка дубликатов...");
                    }
                    массивКартДляПроверки = [];
                    const processedElements = new Set();
                    ALL_CARD_SELECTORS_ARRAY.forEach(selector => {
                        document.querySelectorAll(selector).forEach(element => {
                            let effectiveCardElement = element;
                            if (selector === '.history__body-item a[href^="/cards/"]') {
                                const parentItem = element.closest('.history__body-item');
                                if (parentItem) effectiveCardElement = parentItem;
                                else return;
                            }
                            if (effectiveCardElement.offsetParent === null) return;
                            if (effectiveCardElement.closest('#cards-carousel') || effectiveCardElement.closest('.owl-carousel')) {
                                return;
                            }
                            if (processedElements.has(effectiveCardElement)) return;
                            if (wasAutoTriggered && isCardPackPage()) {
                                const settings = unsafeWindow.autoDup_loadSettings();
                                const rank = effectiveCardElement.dataset.rank?.toLowerCase();
                                if (!rank || settings[rank] !== true) {
                                    return;
                                }
                            }
                            if (
                                effectiveCardElement.dataset.id) {
                                массивКартДляПроверки.push(effectiveCardElement);
                                processedElements.add(effectiveCardElement);
                            }
                        });
                    });
                    if (массивКартДляПроверки.length === 0) {
                        массоваяПроверкаДублейЗапущена = false;
                        updateMainButtonUI();
                        return;
                    }
                    processNextBatch();
                }
            });
            mainButton.addEventListener('mousedown', () => { if (!mainButton.disabled) { mainButton.style.transform = 'translateY(2px) scale(0.95)'; mainButton.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)'; }});
            mainButton.addEventListener('mouseup', () => { if (!mainButton.disabled) { mainButton.style.transform = 'translateY(0) scale(1)'; mainButton.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.7)'; }});
            mainButton.addEventListener('mouseleave', () => { if (!mainButton.disabled) { mainButton.style.transform = 'translateY(0) scale(1)'; mainButton.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.7)'; }});
            if (!document.getElementById('check-all-duplicates-btn')) {
                document.body.appendChild(mainButton);
            }
            if (typeof areActionButtonsHidden !== 'undefined' && areActionButtonsHidden) {
                Object.assign(mainButton.style, {
                    transition:'opacity 0.3s ease, transform 0.3s ease, visibility 0s linear 0.3s',
                    opacity:'0', transform:'translateX(calc(100% + 20px))',
                    pointerEvents:'none', visibility:'hidden'
                });
            }
            updateMainButtonUI();
        }
        let observerTimeout;

        // #######################################################################
        // # Наблюдатель (MutationObserver), который отслеживает добавление новых карт на страницу для добавления кнопок.
        // #######################################################################
        const observer = new MutationObserver((mutationsList) => {
            let relevantChange = false;
            for (const mut of mutationsList) {
                // >>> ДОБАВЛЕНО: Если изменение произошло внутри чата, игнорируем его <<<
                if (mut.target.closest && mut.target.closest('#chat-place')) {
                    continue; // Переходим к следующему изменению, не делая ничего
                }
                if (mut.type === 'childList' && mut.addedNodes.length > 0) {
                    for (const node of mut.addedNodes) {
                        if (node.nodeType === 1 && (node.matches(CARD_SELECTORS_FOR_QUERY) || node.querySelector(CARD_SELECTORS_FOR_QUERY) || node.matches('.lootbox__list,.lootbox__row') || node.querySelector('.lootbox__list,.lootbox__row'))) {
                            relevantChange = true; break;
                        }
                    }
                } else if (mut.type === 'attributes') {
                    const target = mut.target;
                    if (target.nodeType === 1 && (target.matches(CARD_SELECTORS_FOR_QUERY) || target.querySelector(CARD_SELECTORS_FOR_QUERY) || target.closest(CARD_SELECTORS_FOR_QUERY) || target.matches('.lootbox__list,.lootbox__row,.modal,.overlay') || target.querySelector('.lootbox__list,.lootbox__row'))) {
                        relevantChange = true;
                    }
                }
                if (relevantChange) break;
            }
            if (relevantChange) {
                clearTimeout(observerTimeout);
                observerTimeout = setTimeout(addCheckButtons, 500);
            }
        });
        addCheckButtons();
        createMainCheckButton();
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

        // #######################################################################
        // # Очистка ресурсов (отключение наблюдателя, таймеров) перед закрытием страницы.
        // #######################################################################
        window.addEventListener('beforeunload', () => {
            observer.disconnect();
            clearTimeout(observerTimeout);
            if (idТаймаутаСледующегоБатча) clearTimeout(idТаймаутаСледующегоБатча);
        });
    }


    // #######################################################################
    // # Создает кнопку и MutationObserver для автоматической проверки дубликатов на странице открытия паков.
    // #######################################################################
    function createAutoPackCheckFeature() {
        if (!isCardPackPage()) return;
        const button = document.createElement('button');
        button.id = 'autoPackCheckButton';
        if (window.location.pathname.startsWith('/pm/')) {
            button.setAttribute('data-mce-bogus', '1');
        }
        const mainDupBtnRight = 10; // px
        const mainDupBtnWidth = 35; // px
        const gapBetweenButtons = 8; // px
        const newBtnWidth = 11; // px
        Object.assign(button.style, {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            position: 'fixed',
            bottom: '180px',
            right: '27px',
            mask: 'radial-gradient(circle at 80% 50%, transparent 20px, black 0px)',
            '-webkit-mask': 'radial-gradient(circle at 80% 50%, transparent 20px, black 0px)',
            justifyContent: 'flex-start',
            padding: '0 0 0 0px',
            zIndex: '100',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease, background 0.3s ease, opacity 0.3s ease, visibility 0s linear 0s',
            color: 'white'
        });
        const icon = document.createElement('span');
        icon.className = 'fal fa-sync-alt';
        icon.style.fontSize = '10px';
        button.appendChild(icon);
        if (!document.getElementById('custom-spin-animation-for-pack-check')) {
            const styleSheet = document.createElement("style");
            styleSheet.id = 'custom-spin-animation-for-pack-check';
            styleSheet.innerText = "@keyframes packCheckSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
            document.head.appendChild(styleSheet);
        }

        // #######################################################################
        // # Обновляет вид кнопки авто-проверки (цвет, подсказку, анимацию) в зависимости от её состояния (вкл/выкл).
        // #######################################################################
        function updateButtonStateVisuals() {
            if (autoPackCheckEnabled) {
                button.style.background = 'linear-gradient(145deg, #28a745, #1e7e34)'; // Зеленый
                button.title = 'Авто-проверка паков: ВКЛЮЧЕНА (Нажмите для выключения)';
                icon.style.animation = 'packCheckSpin 2s linear infinite';
            } else {
                button.style.background = 'linear-gradient(145deg, rgba(100, 50, 50, 0.65), rgba(50, 50, 50, 0.65))'; // Серый
                button.title = 'Авто-проверка паков: ВЫКЛЮЧЕНА (Нажмите для включения)';
                icon.style.animation = 'none';
            }
        }
        updateButtonStateVisuals();
        button.addEventListener('click', () => {
            autoPackCheckEnabled = !autoPackCheckEnabled;
            localStorage.setItem('autoPackCheckEnabledState', autoPackCheckEnabled.toString());
            updateButtonStateVisuals();
            safeDLEPushCall('info', `Авто-проверка дубликатов для паков ${autoPackCheckEnabled ? 'включена' : 'выключена'}.`);
            if (autoPackCheckEnabled) {
                const lootboxRow = document.querySelector('.lootbox__row');
                if (lootboxRow && lootboxRow.offsetParent !== null && (lootboxRow.style.display === '' || lootboxRow.style.display !== 'none')) {
                    const currentPackId = lootboxRow.dataset.packId;
                    if (currentPackId && currentPackId !== lastProcessedPackIdForAutoCheck) {
                        console.log('[AutoPackCheck] Запуск проверки при включении для видимого пака ID:', currentPackId);
                        triggerMassDuplicateCheckForPackPage(currentPackId);
                    }
                }
            }
        });
        ['mousedown', 'mouseup', 'mouseleave'].forEach(eventType => {
            button.addEventListener(eventType, () => {
                const isManagedHidden = areActionButtonsHidden && managedButtonSelectors.includes('#autoPackCheckButton');
                const baseTransform = isManagedHidden ? `translateX(calc(100% + ${newBtnWidth + gapBetweenButtons + mainDupBtnWidth + mainDupBtnRight}px))` : 'translateX(0px)';
                if (eventType === 'mousedown') {
                    button.style.transform = `${baseTransform} translateY(2px) scale(0.95)`;
                    button.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
                } else {
                    button.style.transform = `${baseTransform} translateY(0) scale(1)`;
                    button.style.boxShadow = '0 0 10px rgba(0,0,0,0.7)';
                }
            });
        });
        document.body.appendChild(button);
        autoPackCheckButtonElement = button;
        if (!managedButtonSelectors.includes('#autoPackCheckButton')) {
            managedButtonSelectors.push('#autoPackCheckButton');
        }
        const observerTargetNode = document.querySelector('.ncard-pack.lootbox');
        if (!observerTargetNode) {
            console.warn('[AutoPackCheck] Целевой узел для наблюдателя (.ncard-pack.lootbox) не найден.');
            return;
        }
        let isCheckingPack = false;
        packPageObserver = new MutationObserver(() => {
            if (isProcessingBuyClick) return;
            if (!autoPackCheckEnabled || isCheckingPack) {
                return;
            }
            const lootboxRow = document.querySelector('.lootbox__row');
            if (!lootboxRow) return;
            const currentPackId = lootboxRow.dataset.packId;
            if (currentPackId && currentPackId !== lastProcessedPackIdForAutoCheck && lootboxRow.offsetParent !== null) {
                console.log(`[AutoPackCheck] Обнаружен новый видимый пак: ${currentPackId}. Запускаю проверку через 1.5 секунды...`);
                isCheckingPack = true;
                // Принудительная очистка состояния предыдущих карт
                const cardsToClean = lootboxRow.querySelectorAll('.lootbox__card');
                cardsToClean.forEach(card => {
                    card.classList.remove('div-checked');
                    const checkMark = card.querySelector('.div-marked.fa-check');
                    if (checkMark) checkMark.remove();
                });
                console.log(`[AutoPackCheck] Состояние для ${cardsToClean.length} карточек очищено.`);
                lastProcessedPackIdForAutoCheck = currentPackId;
                setTimeout(() => {
                    const finalCheckRow = document.querySelector('.lootbox__row');
                    if (finalCheckRow && finalCheckRow.dataset.packId === currentPackId) {
                        console.log(`[AutoPackCheck] Время вышло. Пак ${currentPackId} на месте. Запускаю проверку дублей.`);
                        triggerMassDuplicateCheckForPackPage(currentPackId);
                    } else {
                        console.warn(`[AutoPackCheck] Пак ${currentPackId} исчез со страницы до начала проверки.`);
                    }
                    isCheckingPack = false;
                }, GM_getValue('autoPackCheck_initialDelay_ms', 600));
            }
        });
        packPageObserver.observe(observerTargetNode, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'data-pack-id', 'class']
        });
        console.log('[AutoPackCheck] Автоматическая кнопка проверки дублей появилась на странице паков.');
    }

    // #######################################################################
    // # Запускает массовую проверку дубликатов для карт из только что открытого пака.
    // #######################################################################
    async function triggerMassDuplicateCheckForPackPage(packId) {
        if (!autoPackCheckEnabled) return;
        stopMassDuplicateCheck();
        await sleep(50);
        if (!autoPackCheckEnabled) return;
        const massCheckBtn = document.getElementById('check-all-duplicates-btn');
        if (massCheckBtn) {
            console.log(`[AutoPackCheck] Запускаю новую АВТОМАТИЧЕСКУЮ проверку для пака ${packId} согласно настройкам.`);
            unsafeWindow.isAutoDuplicateCheckTriggered = true;
            isProcessingAutoPackCheck = true;
            massCheckBtn.click();
        } else {
            console.error('[AutoPackCheck] Кнопка #check-all-duplicates-btn не найдена.');
        }
    }

    // #######################################################################
    // # Запускает массовую проверку спроса для карт A/S ранга из открытого пака.
    // #######################################################################
    async function triggerMassDemandCheckForPackPage(packId) {
        if (!autoDemandCheckEnabled) return;
        const lootboxRow = document.querySelector('.lootbox__row');
        if (!lootboxRow) return;
        const cardsInPack = Array.from(lootboxRow.querySelectorAll('.lootbox__list .lootbox__card'));
        if (cardsInPack.length === 0) return;
        let highestRank = null;
        cardsInPack.forEach(card => {
            const rank = card.dataset.rank?.toLowerCase();
            if (rank === 's') highestRank = 's';
            else if (rank === 'a' && highestRank !== 's') highestRank = 'a';
        });
        if (highestRank) {
            showHighRankCardNotification(highestRank);
        }
        const hasHighRankCard = highestRank !== null;

        if (!hasHighRankCard) {
            console.log(`[AutoDemandCheck] В паке ${packId} нет карт A/S ранга. Проверка спроса пропущена.`);
            return;
        }
        if (isProcessCardsRunning) {
            console.log(`[AutoDemandCheck] Проверка спроса уже запущена. Пропуск автоматического вызова для пака ${packId}.`);
            return;
        }
        console.log(`[AutoDemandCheck] Найдены карты A/S. Запускаю новую "тихую" проверку спроса для пака ${packId}.`);
        await processCards(false, true);
    }
    // #######################################################################
    // # Создает кнопку и MutationObserver для автоматической проверки спроса на A/S карты на странице паков.
    // #######################################################################
    function createAutoDemandCheckFeature() {
        if (!isCardPackPage()) return;
        const button = document.createElement('button');
        button.id = 'autoDemandCheckButton';
        Object.assign(button.style, {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            position: 'fixed',
            bottom: '390px',
            right: '27px',
            mask: 'radial-gradient(circle at 80% 50%, transparent 20px, black 0px)',
            '-webkit-mask': 'radial-gradient(circle at 80% 50%, transparent 20px, black 0px)',
            justifyContent: 'flex-start',
            padding: '0 0 0 1px',
            zIndex: '100',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            color: 'black'
        });
        const icon = document.createElement('span');
        icon.className = 'fal fa-rocket';
        icon.style.fontSize = '10px';
        button.appendChild(icon);

        // #######################################################################
        // # Обновляет вид кнопки авто-проверки спроса (цвет, подсказку, анимацию) в зависимости от её состояния (вкл/выкл).
        // #######################################################################
        function updateButtonStateVisuals() {
            if (autoDemandCheckEnabled) {
                button.style.background = 'linear-gradient(145deg, #28a745, #1e7e34)'; // Зеленый
                button.title = 'Авто-проверка спроса (A/S): ВКЛЮЧЕНА';
                icon.style.animation = 'packCheckSpin 2s linear infinite';
            } else {
                button.style.background = 'linear-gradient(145deg, rgba(166, 100, 110), rgba(222, 0, 5))';
                button.title = 'Авто-проверка спроса (A/S): ВЫКЛЮЧЕНА';
                icon.style.animation = 'none';
            }
        }
        updateButtonStateVisuals();
        button.addEventListener('click', () => {
            autoDemandCheckEnabled = !autoDemandCheckEnabled;
            localStorage.setItem('autoDemandCheckEnabledState', autoDemandCheckEnabled.toString());
            updateButtonStateVisuals();
            safeDLEPushCall('info', `Авто-проверка спроса (для A/S) ${autoDemandCheckEnabled ? 'включена' : 'выключена'}.`);
        });
        document.body.appendChild(button);
        if (!managedButtonSelectors.includes('#autoDemandCheckButton')) {
            managedButtonSelectors.push('#autoDemandCheckButton');
        }
        const observerTargetNode = document.querySelector('.ncard-pack.lootbox');
        if (!observerTargetNode) return;
        let isCheckingDemand = false;
        const demandObserver = new MutationObserver(() => {
            if (isProcessingBuyClick) return;
            if (!autoDemandCheckEnabled || isCheckingDemand) {
                return;
            }
            const lootboxRow = document.querySelector('.lootbox__row');
            if (!lootboxRow) return;
            const currentPackId = lootboxRow.dataset.packId;
            if (currentPackId && currentPackId !== lastProcessedPackIdForDemandCheck && lootboxRow.offsetParent !== null) {
                console.log(`[AutoDemandCheck] Обнаружен новый видимый пак: ${currentPackId}. Запускаю проверку спроса через 1.6 секунды...`);
                isCheckingDemand = true;
                const cardsToClean = lootboxRow.querySelectorAll('.lootbox__card');
                cardsToClean.forEach(card => {
                    card.classList.remove('div-checked');
                    const checkMark = card.querySelector('.div-marked.fa-check');
                    if (checkMark) checkMark.remove();
                });
                lastProcessedPackIdForDemandCheck = currentPackId;
                setTimeout(() => {
                    const finalCheckRow = document.querySelector('.lootbox__row');
                    if (finalCheckRow && finalCheckRow.dataset.packId === currentPackId) {
                        console.log(`[AutoDemandCheck] Время вышло. Пак ${currentPackId} на месте. Запускаю проверку спроса.`);
                        triggerMassDemandCheckForPackPage(currentPackId);
                    } else {
                        console.warn(`[AutoDemandCheck] Пак ${currentPackId} исчез со страницы до начала проверки спроса.`);
                    }

                    isCheckingDemand = false;
                }, 50);
            }
        });
        demandObserver.observe(observerTargetNode, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'data-pack-id', 'class']
        });
    }
    // =======================================================================================
    // КОНЕЦ БЛОКА: АВТО-ПРОВЕРКА СПРОСА ПАКОВ
    // =======================================================================================

    // #######################################################################
    // # Добавляет на страницу глобальные CSS-стили, необходимые для работы скрипта.
    // #######################################################################
    function addCustomStyles() {
        const styleId = 'asstars-card-master-styles';
        if (document.getElementById(styleId)) return;
        const customStyle = document.createElement('style');
        customStyle.id = styleId;
        customStyle.innerHTML = `
    .noffer .card-stats span {
        font-size: 0.8em;
        color: rgb(0, 120, 50);
        font-weight: bold;
    }
`;
        document.head.appendChild(customStyle);
    }

    // #######################################################################
    // # Обрабатывает постер на странице трейда, добавляя на него кнопку проверки спроса.
    // #######################################################################
    function handleTradePagePoster() {
        const nofferElement = document.querySelector('.noffer.cards--container');
        const posterImageLink = nofferElement ? nofferElement.querySelector('a.noffer__img') : null;
        if (nofferElement && posterImageLink && nofferElement.dataset.originalId) {
            const cardId = nofferElement.dataset.originalId;
            if (posterImageLink.querySelector('.check-demand-btn')) {
                return;
            }
            const demandBtn = createDemandCheckButton();
            Object.assign(demandBtn.style, {
                zIndex: '15',
                width: '30px',
                height: '30px',
                opacity: '0',
                visibility: 'hidden',
                transform: 'translateY(0px)'
            });
            demandBtn.style.setProperty('bottom', '10px', 'important');
            demandBtn.style.setProperty('right', '10px', 'important');
            demandBtn.style.setProperty('top', 'auto', 'important');
            demandBtn.style.setProperty('left', 'auto', 'important');
            const iconInBtn = demandBtn.querySelector('i');
            if (iconInBtn) {
                iconInBtn.style.fontSize = '14px';
            }
            demandBtn.addEventListener('click', async (e) => {
                e.stopPropagation(); e.preventDefault();
                await updateCardInfo(cardId, nofferElement, true);
            });
            if (window.getComputedStyle(posterImageLink).position === 'static') {
                posterImageLink.style.position = 'relative';
            }
            posterImageLink.style.display = 'block';
            posterImageLink.appendChild(demandBtn);
            posterImageLink.addEventListener('mouseenter', () => {
                if (!demandBtn.querySelector('.fa-spinner') && !demandBtn.querySelector('.fa-exclamation-triangle')) {
                    demandBtn.style.opacity = '0.8';
                    demandBtn.style.visibility = 'visible';
                    demandBtn.style.transform = 'translateY(0)';
                }
            });
            posterImageLink.addEventListener('mouseleave', () => {
                if (!demandBtn.querySelector('.fa-spinner') && !demandBtn.querySelector('.fa-exclamation-triangle')) {
                    demandBtn.style.opacity = '0';
                    demandBtn.style.visibility = 'hidden';
                    demandBtn.style.transform = 'translateY(0px)';
                }
            });
        }
    }

    // #######################################################################
    // # Получает имя текущего залогиненного пользователя из разных мест на странице.
    // #######################################################################
    function asbm_getUsername() {
        // 1. Приоритетный поиск по основному блоку профиля (работает почти везде)
        let userEl = document.querySelector('.lgn__name span');
        if (userEl && userEl.textContent) {
            return userEl.textContent.trim();
        }

        // 2. Поиск по аватару в шапке (на случай, если структура изменится)
        userEl = document.querySelector('.header__ava.js-show-login img, .lgn__ava.usn__ava img');
        if (userEl) {
            const username = userEl.getAttribute('title') || userEl.getAttribute('alt');
            if (username) return username.trim();
        }

        // 3. Поиск по ссылке на профиль (самый надежный способ, если первые два не сработали)
        userEl = document.querySelector('.lgn__name a[href*="/user/"]');
        if (userEl && userEl.href) {
            const match = userEl.href.match(/\/user\/([^/]+)\/?/);
            if (match && match[1]) {
                return decodeURIComponent(match[1]); // decode на случай не-латинских ников
            }
        }

        // 4. Резервный поиск для кнопок в чате, если вдруг другие методы не сработали
        userEl = document.querySelector('#vm-custom-buttons-container a[href*="/user/"]');
        if (userEl && userEl.href) {
            const match = userEl.href.match(/\/user\/cards\/\?name=([^&]+)/);
            if (match && match[1]) {
                return decodeURIComponent(match[1]);
            }
        }

        return null; // Если ничего не найдено
    }

    // #######################################################################
    // # (НОВАЯ ГЛОБАЛЬНАЯ ФУНКЦИЯ) Обновляет все визуальные элементы счетчиков.
    // #######################################################################
    function updateAllCardCountDisplays(text, className) {
        const match = text.match(/(\d+)/); // Находим первое число (текущее количество)
        const currentCount = match ? parseInt(match[1], 10) : 0;

        // Обновляем счетчик в чате
        if (cardCountElement) {
            cardCountElement.textContent = text;
            if (className) { // className может не передаваться при первом вызове
                 cardCountElement.className = className;
            }
        }

        // Обновляем счетчик на кнопке
        if (autoCollectButtonCounter) {
            if (currentCount > 0) {
                autoCollectButtonCounter.textContent = currentCount;
                autoCollectButtonCounter.style.display = 'flex';
            } else {
                autoCollectButtonCounter.style.display = 'none';
            }
        }
    }

    // =======================================================================================
    // ВОССТАНОВЛЕННАЯ ВЕРСИЯ v2.1: Загружает счетчик с полной страницы профиля (стабильный метод).
    // =======================================================================================
    async function updateCardCounter(forceUpdate = false) {
        const now = Date.now();
        const cachedData = await GM_getValue(CARD_COUNT_CACHE_KEY, null);

        // 1. Сначала всегда пытаемся обновить отображение из кэша.
        if (cachedData) {
            updateAllCardCountDisplays(cachedData.text, cachedData.className);
        }

        // 2. Только лидер делает запрос на обновление.
        if (!isLeaderWatch) {
            return;
        }

        // 3. Лидер решает, пора ли обновлять кэш.
        if (!forceUpdate && cachedData && (now - cachedData.timestamp < CARD_COUNT_CACHE_TTL)) {
            return;
        }

        const username = asbm_getUsername();
        if (!username) return;

        console.log(`👑 [Лидер] Обновляю счетчик карт с профиля (полная страница)...`);
        try {
            // --- ВОЗВРАЩАЕМ СТАРЫЙ, НАДЕЖНЫЙ FETCH ---
            const response = await fetch(`/user/${username}/`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            const questList = doc.querySelectorAll('.shop__get-coins li');
            let found = false;

            for (const li of questList) {
                if (li.textContent.includes('Получено карточек за просмотр аниме')) {
                    const match = li.textContent.trim().match(/(\d+)\s+из\s+(\d+)/);
                    if (match) {
                        const current = parseInt(match[1], 10);
                        const limit = parseInt(match[2], 10);
                        const newText = `${current} / ${limit}`;
                        const newClassName = current >= limit ? 'limit-reached' : 'in-progress';

                        // 4. Лидер сохраняет свежие данные и рассылает их.
                        const payload = {
                            text: newText,
                            className: newClassName,
                            timestamp: now
                        };
                        await GM_setValue(CARD_COUNT_CACHE_KEY, payload);
                        await GM_setValue(CARD_COUNT_SYNC_KEY, payload);

                        updateAllCardCountDisplays(newText, newClassName);
                        found = true;
                        break;
                    }
                }
            }
            if (!found) console.warn('👑 [Лидер] Не удалось найти счетчик карт на странице профиля.');

        } catch (error) {
            console.error('👑 [Лидер] Ошибка при обновлении счетчика карт (полная страница):', error);
        }
    }

    // #######################################################################
    // # Инициализирует модуль кастомных закладок (добавление кнопок-ссылок под шапкой сайта).
    // #######################################################################
    function asbm_initializeModule() {
        'use strict';
        // #######################################################################
        // # Загружает пользовательские закладки из хранилища скрипта (Greasemonkey).
        // #######################################################################
        function asbm_loadUserBookmarks() {
            const saved = GM_getValue(ASBM_USER_BOOKMARKS_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        }

        // #######################################################################
        // # Сохраняет массив закладок в хранилище скрипта и вызывает их перерисовку.
        // #######################################################################
        function asbm_saveUserBookmarks(bookmarks) {
            GM_setValue(ASBM_USER_BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
            // Вызываем рендер, который внутри себя проверит, включена ли панель
            asbm_renderOrUpdateElements();
        }

        // #######################################################################
        // # Создает и отображает модальное окно для настройки (добавления/редактирования/удаления) закладок.
        // #######################################################################
        function asbm_openSettingsModal() {
            let currentUserBookmarks = asbm_loadUserBookmarks();
            const isCurrentlyEnabled = GM_getValue(ASBM_FEATURE_ENABLED_KEY, true);
            const backdrop = document.createElement('div');
            backdrop.id = 'asbm_settings_backdrop';
            const modal = document.createElement('div');
            modal.id = 'asbm_settings_modal';

            // #######################################################################
            // # (внутри asbm_openSettingsModal) Перерисовывает список закладок внутри модального окна.
            // #######################################################################
            function redrawModalList() {
                let listHtml = '';
                if (currentUserBookmarks.length === 0) {
                    listHtml = '<p style="text-align: center; color: #99aab5;">Вы еще не добавили свои закладки.</p>';
                }
                currentUserBookmarks.forEach((bm, index) => {
                    listHtml += `<div class="bookmark-entry"><div><span class="bookmark-name">${bm.name}</span><span class="bookmark-url">${bm.url}</span></div><div class="bookmark-actions"><button data-index="${index}" class="edit-btn">Ред.</button><button data-index="${index}" class="delete-btn">Удл.</button></div></div>`;
                });
                modal.querySelector('.bookmarks-list').innerHTML = listHtml;
                attachModalEventListeners();
            }
            modal.innerHTML = `
    <div class="modal-header"><h2>Настройка закладок</h2><button id="gm-close-modal" class="close-btn">×</button></div>
    <div class="modal-body"><div class="bookmarks-list"></div></div>
    <div class="modal-footer">
        <div class="asbm-toggle-switch-container">
            <label class="asbm-toggle-switch">
                <input type="checkbox" id="asbm-enable-checkbox" ${isCurrentlyEnabled ? 'checked' : ''}>
                <span class="asbm-toggle-slider"></span>
            </label>
        </div>
        <button id="gm-add-bookmark" class="action-btn">Добавить</button>
        <button id="gm-save-settings" class="action-btn save-btn">Сохранить</button>
    </div>`;
            document.body.appendChild(backdrop);
            document.body.appendChild(modal);
            redrawModalList();

            // #######################################################################
            // # (внутри asbm_openSettingsModal) Назначает обработчики кликов на кнопки "Ред." и "Удл.".
            // #######################################################################
            function attachModalEventListeners() {
                modal.querySelectorAll('.edit-btn').forEach(btn => {
                    btn.onclick = e => {
                        const index = e.target.dataset.index, oldName = currentUserBookmarks[index].name, oldUrl = currentUserBookmarks[index].url, newName = prompt('Введите новое название закладки:', oldName);
                        if (newName === null) return;
                        const newUrl = prompt('Введите новый URL:', oldUrl);
                        if (newUrl === null) return;
                        currentUserBookmarks[index] = { name: newName.trim(), url: newUrl.trim() };
                        redrawModalList();
                    };
                });
                modal.querySelectorAll('.delete-btn').forEach(btn => {
                    // Делаем обработчик асинхронным, чтобы использовать await
                    btn.onclick = async e => {
                        const index = e.target.dataset.index;

                        // Формируем сообщение для кастомного окна
                        const message = `Вы уверены, что хотите удалить закладку "<b style="color: #d4506a;">${currentUserBookmarks[index].name}</b>"?`;

                        // Вызываем общее окно подтверждения и ждем результат
                        const confirmation = await protector_customConfirm(message);

                        // Если пользователь нажал "Да", удаляем закладку
                        if (confirmation) {
                            currentUserBookmarks.splice(index, 1);
                            redrawModalList();
                        }
                    };
                });
            }
            modal.querySelector('#gm-add-bookmark').onclick = () => {
                const name = prompt('Введите название новой закладки:');
                if (!name) return;
                const url = prompt('Введите URL новой закладки:', window.location.href);
                if (!url) return;
                currentUserBookmarks.unshift({ name: name.trim(), url: url.trim() });
                redrawModalList();
            };

            // #######################################################################
            // # (внутри asbm_openSettingsModal) Закрывает модальное окно настроек и его фон.
            // #######################################################################
            const closeModal = () => { document.body.removeChild(modal); document.body.removeChild(backdrop); };
            modal.querySelector('#gm-save-settings').onclick = () => {
                asbm_saveUserBookmarks(currentUserBookmarks);
                const newIsEnabled = modal.querySelector('#asbm-enable-checkbox').checked;

                if (newIsEnabled !== isCurrentlyEnabled) {
                    // --- НАЧАЛО ИЗМЕНЕНИЙ ---
                    closeModal();
                    GM_setValue(ASBM_FEATURE_ENABLED_KEY, newIsEnabled);

                    // Показываем push-уведомление
                    safeDLEPushCall('info', `Панель закладок теперь ${newIsEnabled ? 'ВКЛЮЧЕНА' : 'ВЫКЛЮЧЕНА'}. Перезагрузка...`);

                    // Запускаем перезагрузку страницы через 2 секунды
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                    // --- КОНЕЦ ИЗМЕНЕНИЙ ---
                } else {
                    safeDLEPushCall('success', 'Настройки закладок сохранены!');
                    closeModal();
                }
            };
            modal.querySelector('#gm-close-modal').onclick = closeModal;
            backdrop.onclick = closeModal;
        }

        // #######################################################################
        // # Отображает кастомное диалоговое окно (аналог alert) с сообщением и кнопкой OK.
        // #######################################################################
        function asbm_customAlert(message, callback, position) {
            const backdrop = document.createElement('div');
            backdrop.id = 'asbm_alert_backdrop';
            const modal = document.createElement('div');
            modal.id = 'asbm_alert_modal';
            modal.innerHTML = `
    <div class="alert-body">
        <p>${message}</p>
    </div>
    <div class="alert-footer">
        <button id="asbm-alert-ok-btn">OK</button>
    </div>
`;
            if (position) {
                modal.style.top = `${position.top}px`;
                modal.style.left = `${position.left}px`;
                modal.style.transform = 'none';
            }
            document.body.appendChild(backdrop);
            document.body.appendChild(modal);

            // #######################################################################
            // # (внутри asbm_customAlert) Закрывает кастомный алерт и выполняет переданную callback-функцию.
            // #######################################################################
            const closeAndCallback = () => {
                document.body.removeChild(modal);
                document.body.removeChild(backdrop);
                if (typeof callback === 'function') {
                    callback();
                }
            };
            modal.querySelector('#asbm-alert-ok-btn').onclick = closeAndCallback;
            backdrop.onclick = closeAndCallback;
        }
        //СТИЛЬ ДЛЯ КНОПКИ СПРОСА С ПЕРЕХОДОМ
        GM_addStyle(`
#processAllPagesBtn {
    mask: radial-gradient(circle at 50% 175%, transparent 24px, black 0px);
    -webkit-mask: radial-gradient(circle at 50% 175%, transparent 24px, black 0px);
}
#processAllPagesBtn_counter {
    top: 2px !important;
    right: 2px !important;
}
`);

        // Стили для меню настроек (закладок)
        GM_addStyle(`
    /* --- CSS-переменные для легкой настройки темы --- */
    :root {
        --asbm-bg-primary: #1e1f22; --asbm-bg-secondary: #27292d; --asbm-bg-tertiary: #424549;
        --asbm-border-color: #33353a; --asbm-border-accent: #4a2f3a;
        --asbm-text-primary: #e0e0e0; --asbm-text-secondary: #b0b0b0; --asbm-text-muted: #888;
        --asbm-accent-primary: #d4506a; --asbm-accent-primary-hover: #b02c44;
        --asbm-color-danger: #ed4245; --asbm-color-danger-hover: #c7383a;
        --asbm-color-success: #43b581; --asbm-color-success-hover: #3aa070;
        --asbm-color-info: #5865f2; --asbm-color-info-hover: #4752c4;
        --asbm-font-family: Arial, sans-serif; --asbm-border-radius: 6px;
        --asbm-shadow: 0 0 15px rgba(180, 40, 70, 0.25), 0 0 5px rgba(180, 40, 70, 0.15);
    }

    /* --- Общие стили для модальных окон и их фона --- */
    #asbm_settings_backdrop, #asbm_alert_backdrop {
        position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.75);
    }
    #asbm_settings_modal, #asbm_alert_modal {
        position: fixed; left: 50%; transform: translate(-50%, -50%);
        display: flex; flex-direction: column; max-width: 90%;
        background: var(--asbm-bg-primary); color: var(--asbm-text-secondary);
        border: 1px solid var(--asbm-border-accent); border-radius: var(--asbm-border-radius);
        box-shadow: var(--asbm-shadow); font-family: var(--asbm-font-family);
    }

    /* --- Окно настроек --- */
    #asbm_settings_backdrop { z-index: 9998; }
    #asbm_settings_modal { top: 50%; width: 400px; z-index: 9999; }

    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; border-bottom: 1px solid var(--asbm-border-color); }
    .modal-header h2 { margin: 0; font-size: 1em; font-weight: 500; color: var(--asbm-accent-primary); }
    .modal-header .close-btn { background: none; border: none; font-size: 22px; color: var(--asbm-text-muted); cursor: pointer; transition: color 0.2s; }
    .modal-header .close-btn:hover { color: var(--asbm-text-primary); }

    .modal-body { padding: 15px; max-height: 60vh; overflow-y: auto; background-color: var(--asbm-bg-secondary); }

    .modal-footer { display: flex; justify-content: flex-end; align-items: center; gap: 10px; padding: 10px 15px; border-top: 1px solid var(--asbm-border-color); }
    .modal-footer .action-btn { color: #dadada; background-color: #c83a54; border: none; padding: 8px 15px; border-radius: 3px; cursor: pointer; font-weight: normal; font-size: 0.9em; transition: background-color 0.2s; }
    .modal-footer .action-btn:hover { background-color: var(--asbm-accent-primary-hover); }
    .modal-footer .action-btn.save-btn { background-color: var(--asbm-color-success); }
    .modal-footer .action-btn.save-btn:hover { background-color: var(--asbm-color-success-hover); }
    .modal-footer .action-btn.clear-btn { background-color: var(--asbm-color-danger); margin-right: auto; }
    .modal-footer .action-btn.clear-btn:hover { background-color: var(--asbm-color-danger-hover); }

    /* --- Элементы управления (переключатели) --- */
    #asbm-enable-toggle-container { display: flex; align-items: center; margin-right: auto; gap: 8px; font-size: 0.9em; }
    #asbm-enable-toggle-container label { cursor: pointer; user-select: none; }
    #asbm-enable-checkbox { cursor: pointer; accent-color: var(--asbm-accent-primary); }

    .asbm-toggle-switch-container { display: flex; align-items: center; gap: 10px; margin-right: auto; user-select: none; }
    .asbm-toggle-switch-label { font-size: 0.9em; color: #a0a0a0; }
    .asbm-toggle-switch { position: relative; display: inline-block; width: 38px; height: 20px; }
    .asbm-toggle-switch input { opacity: 0; width: 0; height: 0; }
    .asbm-toggle-slider { position: absolute; cursor: pointer; inset: 0; background-color: var(--asbm-bg-tertiary); border-radius: 20px; transition: background-color .3s; }
    .asbm-toggle-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; border-radius: 50%; transition: transform .3s; }
    input:checked + .asbm-toggle-slider { background-color: #c83a54; }
    input:checked + .asbm-toggle-slider:before { transform: translateX(18px); }

    /* --- Список закладок --- */
    .bookmarks-list { display: flex; flex-direction: column; gap: 8px; }
    .bookmark-entry { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 8px 12px; background-color: var(--asbm-bg-primary); border: 1px solid var(--asbm-border-color); border-radius: 4px; overflow: hidden; }
    .bookmark-entry > div:first-child { display: flex; flex-direction: column; overflow: hidden; }
    .bookmark-name { font-weight: 500; color: #ccc; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
    .bookmark-url { color: var(--asbm-text-muted); font-size: 11px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }

    .bookmark-actions { display: flex; gap: 6px; flex-shrink: 0; }
    .bookmark-actions button { background-color: var(--asbm-bg-tertiary); border: none; color: var(--asbm-text-secondary); padding: 5px 10px; font-size: 11px; border-radius: 3px; cursor: pointer; transition: background-color 0.2s, color 0.2s; }
    .bookmark-actions button:hover { color: white; }
    .bookmark-actions button.edit-btn:hover { background-color: var(--asbm-color-info); }
    .bookmark-actions button.delete-btn:hover { background-color: var(--asbm-color-danger); }

    /* --- Окно простого уведомления (Alert) --- */
    #asbm_alert_backdrop { z-index: 10000; }
    #asbm_alert_modal { top: 30%; width: 380px; z-index: 10001; padding: 20px; text-align: center; color: var(--asbm-text-primary); }
    #asbm_alert_modal .alert-body p { margin: 0; line-height: 1.5; font-size: 1em; }
    #asbm_alert_modal .alert-footer { margin-top: 20px; }
    #asbm_alert_modal #asbm-alert-ok-btn { color: #fff; background-color: var(--asbm-color-info); border: none; padding: 10px 35px; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 0.9em; transition: background-color 0.2s; }
    #asbm_alert_modal #asbm-alert-ok-btn:hover { background-color: var(--asbm-color-info-hover); }
`);
        GM_registerMenuCommand("Настройки закладок (доп. кнопки)", asbm_openSettingsModal);
        GM_registerMenuCommand("Настройки кэш карт (данные спроса)", openCacheSettingsModal);
        const isAsbmFeatureEnabled = GM_getValue(ASBM_FEATURE_ENABLED_KEY, true);
        if (!isAsbmFeatureEnabled) {
            return;
        }

        // #######################################################################
        // # Генерирует массив 'защищенных' (системных) закладок по-умолчанию (База, Трейды и т.д.).
        // #######################################################################
        function asbm_generateProtectedBookmarks(username) {
            const domain = window.location.origin;
            const myCardsUrl = username ? `${domain}/user/cards/?name=${username}` : `${domain}/user/`;
            return [
                { name: "База", url: `${domain}/cards/`, icon: "fa-database" },
                { name: "Трейды", url: `${domain}/trades/`, icon: "fa-exchange-alt" },
                { name: "Карты", url: myCardsUrl, icon: "fa-layer-group" },
                { name: "Паки", url: `${domain}/cards/pack/`, icon: "fa-box-open" },
                { name: "Промо", url: `${domain}/promo_codes/`, icon: "fa-gift" }
            ];
        }
        // Стили для кнопок (закладки)
        GM_addStyle(`
    #asbm_bar { position: fixed; left: 0; right: 0; z-index: 998; padding: 10px 0; display: flex; justify-content: center; pointer-events: none; }
    #asbm_container { pointer-events: auto; max-width: 1285px; width: 100%; justify-content: flex-end; margin: 0 auto; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; background: linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 50%), linear-gradient(90deg, rgba(115, 48, 68, 0.15) 0%, rgba(70, 40, 52, 0.9) 50%, rgba(48, 28, 38, 0.95) 100%); padding: 2px 15px; border-radius: 8px; box-sizing: border-box; }
    .asbm_button { text-decoration: none !important; color: #e0e0e0 !important; background-color: transparent; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 6px 12px; font-size: 13px; font-weight: 500; transition: background-color 0.2s, border-color 0.2s; display: inline-flex; align-items: center; gap: 8px; }
    .asbm_button:hover { background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3); }
    .asbm_icon_fallback { font-weight: bold; display: inline; }
    .asbm_text_label.asbm_is_user_bookmark { display: none; }
    @media (max-width: ${ASBM_RESPONSIVE_BREAKPOINT_PX}px) { .asbm_text_label.asbm_is_protected_bookmark { display: none; } }
    #vm-trades-btn-chat { display: none; margin: 0 5px 0 0; vertical-align: middle; padding: 3px 8px !important; font-size: 12px !important; height: 28px !important; }
    body.fscr-active #vm-trades-btn-chat { display: inline-flex !important; }
    body.fscr-active #vm-trades-btn-chat .asbm_text_label { display: none; }
`);

        // #######################################################################
        // # Отрисовывает или обновляет всю панель закладок под шапкой сайта.
        // #######################################################################
        function asbm_renderOrUpdateElements() {
            const oldBar = document.getElementById('asbm_bar');
            if (oldBar) oldBar.remove();
            if (!GM_getValue(ASBM_FEATURE_ENABLED_KEY, true)) {
                return;
            }
            const header = document.querySelector(ASBM_HEADER_SELECTOR);
            if (!header) return;
            const username = asbm_getUsername();
            const protectedBookmarks = asbm_generateProtectedBookmarks(username);
            const userBookmarks = asbm_loadUserBookmarks();
            const allBookmarks = [...userBookmarks, ...protectedBookmarks];
            if (allBookmarks.length === 0) return;
            const bar = document.createElement('div');
            bar.id = 'asbm_bar';
            const buttonContainer = document.createElement('div');
            buttonContainer.id = 'asbm_container';
            bar.appendChild(buttonContainer);
            allBookmarks.forEach(bookmark => {
                const button = document.createElement('a');
                button.href = bookmark.url;
                button.className = 'asbm_button';
                button.title = bookmark.name;
                if (bookmark.icon) {
                    const iconSpan = document.createElement('span');
                    iconSpan.className = `fal ${bookmark.icon}`;
                    button.appendChild(iconSpan);
                    const textSpan = document.createElement('span');
                    textSpan.className = 'asbm_text_label asbm_is_protected_bookmark';
                    textSpan.textContent = bookmark.name;
                    button.appendChild(textSpan);
                } else {
                    const fallbackSpan = document.createElement('span');
                    fallbackSpan.className = 'asbm_icon_fallback';
                    fallbackSpan.textContent = bookmark.name.charAt(0).toUpperCase();
                    button.appendChild(fallbackSpan);
                    const textSpan = document.createElement('span');
                    textSpan.className = 'asbm_text_label asbm_is_user_bookmark';
                    textSpan.textContent = bookmark.name;
                    button.appendChild(textSpan);
                }
                buttonContainer.appendChild(button);
            });
            document.body.appendChild(bar);

            // #######################################################################
            // # (внутри asbm_renderOrUpdateElements) Корректно позиционирует панель закладок относительно шапки сайта.
            // #######################################################################
            function positionBar() {
                bar.style.top = `${header.offsetHeight - 10}px`;
            }
            positionBar();
            window.removeEventListener('resize', positionBar);
            window.addEventListener('resize', positionBar);
        }
        asbm_renderOrUpdateElements();
    }
    // =======================================================================================
    // КОНЕЦ БЛОКА: Кастомных закладок
    // =======================================================================================

    // #######################################################################
    // # Возвращает правильное склонение слова (час, часа, часов) в зависимости от числа.
    // #######################################################################
    function getPlural(number, one, two, five) {
        let n = Math.abs(number);
        n %= 100;
        if (n >= 5 && n <= 20) return five;
        n %= 10;
        if (n === 1) return one;
        if (n >= 2 && n <= 4) return two;
        return five;
    }

    // #######################################################################
    // # Конвертирует часы в удобочитаемый формат (например, "1 день и 5 часов").
    // #######################################################################
    function convertHoursToReadableString(totalHours) {
        if (totalHours === 0) return "0 часов (без кэша)";
        const days = Math.floor(totalHours / 24);
        const remainingHours = totalHours % 24;
        let parts = [];
        if (days > 0) {
            parts.push(`${days} ${getPlural(days, 'день', 'дня', 'дней')}`);
        }
        if (remainingHours > 0) {
            parts.push(`${remainingHours} ${getPlural(remainingHours, 'час', 'часа', 'часов')}`);
        }
        return parts.join(' и ');
    }

    // #######################################################################
    // # Открывает модальное окно для настройки времени жизни кэша спроса карт.
    // #######################################################################
    function openCacheSettingsModal() {
        const backdrop = document.createElement('div');
        backdrop.id = 'asbm_settings_backdrop';
        const modal = document.createElement('div');
        modal.id = 'asbm_settings_modal';
        modal.innerHTML = `
    <div class="modal-header">
        <h2>Настройки кэша (спроса карт)</h2>
        <button id="gm-close-cache-modal" class="close-btn">×</button>
    </div>
    <div class="modal-body">
        <div style="display: flex; flex-direction: column; gap: 20px;">
            <!-- Ползунок для дней -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <label for="cache-days-slider" style="font-size: 0.9em; color: #ccc;">Дни:</label>
                <input type="range" id="cache-days-slider" min="0" max="30" step="1" style="width: 80%;">
                <span id="cache-days-display" style="font-weight: bold; color: #a0a0a0; font-size: 0.9em;"></span>
            </div>
            <!-- Ползунок для часов -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <label for="cache-hours-slider" style="font-size: 0.9em; color: #ccc;">Часы:</label>
                <input type="range" id="cache-hours-slider" min="0" max="23" step="1" style="width: 80%;">
                <span id="cache-hours-display" style="font-weight: bold; color: #a0a0a0; font-size: 0.9em;"></span>
            </div>
        </div>
        <!-- Общий результат -->
        <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #33353a;">
            <span style="font-size: 0.9em; color: #ccc;">Итого хранить:</span>
            <div id="cache-total-display" style="font-weight: bold; color: white; font-family: monospace; font-size: 1.2em; margin-top: 5px;"></div>
        </div>
    </div>
    <div class="modal-footer">
<button id="gm-clear-cache-in-modal-btn" class="action-btn clear-btn">Очистить кэш</button>
<button id="gm-save-cache-settings" class="action-btn save-btn">Сохранить</button>
</div>
`;

        document.body.appendChild(backdrop);
        document.body.appendChild(modal);
        const daySlider = modal.querySelector('#cache-days-slider');
        const hourSlider = modal.querySelector('#cache-hours-slider');
        const dayDisplay = modal.querySelector('#cache-days-display');
        const hourDisplay = modal.querySelector('#cache-hours-display');
        const totalDisplay = modal.querySelector('#cache-total-display');
        const updateDisplays = () => {
            const days = parseInt(daySlider.value, 10);
            const hours = parseInt(hourSlider.value, 10);
            const totalHours = (days * 24) + hours;
            dayDisplay.textContent = `${days} ${getPlural(days, 'день', 'дня', 'дней')}`;
            hourDisplay.textContent = `${hours} ${getPlural(hours, 'час', 'часа', 'часов')}`;
            totalDisplay.textContent = convertHoursToReadableString(totalHours);
        };
        const savedTotalHours = GM_getValue(CACHE_TTL_STORAGE_KEY, DEFAULT_CACHE_TTL_HOURS);
        daySlider.value = Math.floor(savedTotalHours / 24);
        hourSlider.value = savedTotalHours % 24;
        updateDisplays();
        daySlider.addEventListener('input', updateDisplays);
        hourSlider.addEventListener('input', updateDisplays);
        const closeModal = () => {
            document.body.removeChild(modal);
            document.body.removeChild(backdrop);
        };
        // Кнопка очистки кеша
         modal.querySelector('#gm-clear-cache-in-modal-btn').onclick = async () => {
            // Вызываем общее окно подтверждения с нужным текстом
            const confirmation = await protector_customConfirm('Вы точно хотите очистить кэш всех карт?');

            // Если пользователь нажал "Да", выполняем очистку
            if (confirmation) {
                clearCardCache();
                closeModal();
            }
        };
        // Кнопка сохранения
        modal.querySelector('#gm-save-cache-settings').onclick = () => {
            const days = parseInt(daySlider.value, 10);
            const hours = parseInt(hourSlider.value, 10);
            const newTotalHours = (days * 24) + hours;
            GM_setValue(CACHE_TTL_STORAGE_KEY, newTotalHours);
            safeDLEPushCall('success', `Настройки кэша сохранены: ${convertHoursToReadableString(newTotalHours)}.`);
            closeModal();
        };
        // Кнопки закрытия
        modal.querySelector('#gm-close-cache-modal').onclick = closeModal;
        backdrop.onclick = closeModal;
    }
    // =======================================================================================
    // КОНЕЦ БЛОКА
    // =======================================================================================


    // #######################################################################
    // # Основная функция инициализации, которая запускает все модули и добавляет все элементы UI на страницу.
    // #######################################################################
    function doActualInitialization() {
        // Проверяем, наш ли это специальный iframe
        const currentUrlParams = new URLSearchParams(window.location.search);
        const isTradePreviewIframe = currentUrlParams.get('as_preview_iframe') === 'true';
        if (window.self !== window.top && !isTradePreviewIframe) {
            console.log('[AssTars Card Master] Обнаружен сторонний iframe, инициализация UI пропущена.');
            return;
        }
        initializePlayerFixerOnNoData();
        addCustomStyles();

        // =======================================================================================
        // # УМНОЕ ОЖИДАНИЕ ПАКА ПОСЛЕ ПОКУПКИ
        // =======================================================================================
        function waitForNewPackAndProcess() {
            let attempts = 0;
            const maxAttempts = 200; // Ждем максимум 10 секунд (200 * 50ms)
            const checkInterval = setInterval(() => {
                attempts++;
                const lootboxRow = document.querySelector('.lootbox__row');
                if (lootboxRow && lootboxRow.offsetParent !== null && lootboxRow.dataset.packId) {
                    const firstCardImage = lootboxRow.querySelector('.lootbox__card img');
                    if (firstCardImage && firstCardImage.src && !firstCardImage.src.includes('empty-card.png')) {
                        clearInterval(checkInterval);
                        console.log(`[AssTars Card Master] Пак ${lootboxRow.dataset.packId} полностью готов к обработке!`);
                        setTimeout(() => {
                            if (autoPackCheckEnabled) {
                                triggerMassDuplicateCheckForPackPage(lootboxRow.dataset.packId);
                            }
                            if (autoDemandCheckEnabled) {
                                triggerMassDemandCheckForPackPage(lootboxRow.dataset.packId);
                            }
                            isProcessingBuyClick = false;
                        }, 250);
                        return;
                    }
                }
                if (attempts > maxAttempts) {
                    clearInterval(checkInterval);
                    console.warn('[AssTars Card Master] Таймаут ожидания нового пака. Проверка не будет запущена автоматически. Снимаю блокировку.');
                    isProcessingBuyClick = false;
                }
            }, 50);
        }
        document.body.addEventListener('click', function(event) {
            const buyButton = event.target.closest('.lootbox__open-btn');
            if (!isCardPackPage() || !buyButton) {
                return;
            }
            console.log('[AssTars Card Master] Нажата кнопка "Купить". Включаю режим ожидания нового пака.');
            isProcessingBuyClick = true;
            stopMassDuplicateCheck();
            if (isProcessCardsRunning) {
                const processBtn = document.getElementById('processCards');
                if (processBtn) processBtn.click();
            }
            lastProcessedPackIdForAutoCheck = null;
            lastProcessedPackIdForDemandCheck = null;
            waitForNewPackAndProcess();
        }, true);

        document.body.addEventListener('click', function(event) {
            const buyButton = event.target.closest('.lootbox__open-btn');
            if (!isCardPackPage() || !buyButton) {
                return;
            }
            console.log('[AssTars Card Master] Нажата кнопка "Купить". Сбрасываю ID последнего пака.');
            stopMassDuplicateCheck();
            lastProcessedPackIdForAutoCheck = null;
            lastProcessedPackIdForDemandCheck = null;
        });
        createMaxWidthControlSlider();
        addGoToClubsButton();
        addDemandCheckButtonsToCards();
        let demandObserverTimeout;

        // #######################################################################
        // # (внутри doActualInitialization) Наблюдатель (MutationObserver), отслеживающий появление новых карт для добавления кнопок проверки спроса.
        // #######################################################################
        const demandObserver = new MutationObserver((mutationsList) => {
            let relevantChange = false;
            for (const mut of mutationsList) {
                // >>> ДОБАВЛЕНО: Если изменение произошло внутри чата, игнорируем его <<<
                if (mut.target.closest && mut.target.closest('#chat-place')) {
                    continue; // Переходим к следующему изменению, не делая ничего
                }
                if (mut.type === 'childList' && mut.addedNodes.length > 0) {
                    for (const node of mut.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (CARD_CLASSES_SELECTORS.split(',').some(sel => node.matches(sel.trim()) || node.querySelector(sel.trim()))) {
                                relevantChange = true; break;
                            }
                            if (isCardPackPage() && (node.classList.contains('lootbox__row') || node.closest('.lootbox__row'))) {
                                relevantChange = true; break;
                            }
                        }
                    }
                }
                else if (mut.type === 'attributes' && isCardPackPage() && mut.target.matches('.lootbox__row') && mut.attributeName === 'data-pack-id') {
                    relevantChange = true;
                }
                if (relevantChange) break;
            }
            if (relevantChange) {
                clearTimeout(demandObserverTimeout);
                demandObserverTimeout = setTimeout(() => {
                    addDemandCheckButtonsToCards();
                }, 50);
            }
        });
        demandObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'data-pack-id'] });

        // #######################################################################
        // # (внутри doActualInitialization) Очищает наблюдателя и таймер перед закрытием/перезагрузкой страницы.
        // #######################################################################
        window.addEventListener('beforeunload', () => {
            demandObserver.disconnect();
            clearTimeout(demandObserverTimeout);
        });
        const element = document.querySelector('.page-padding');

        // НАЧАЛО ЛОГИКИ ФОНА
        let bgSettingsFromStorage = JSON.parse(localStorage.getItem('bgSettings'));
        const protectedBackground = {
            id: 'protected_cover',
            name: 'basic banner',
            url: 'https://i.pinimg.com/1200x/a6/11/fe/a611fefe7083e52ac1a0409b7e2d5050.jpg',
            type: 'image',
            isProtected: true
        };
        const defaultVideoURL = 'https://i.pinimg.com/1200x/a6/11/fe/a611fefe7083e52ac1a0409b7e2d5050.jpg';

        // #######################################################################
        // # Генерирует уникальный ID на основе времени и случайного числа.
        // #######################################################################
        function generateUniqueId() {
            return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
        }

        // #######################################################################
        // # Гарантирует, что защищенный фон по умолчанию присутствует в списке источников.
        // #######################################################################
        function ensureProtectedBackgroundExists(settings) {
            if (!settings.sources.find(bg => bg.id === protectedBackground.id)) {
                settings.sources.unshift({ ...protectedBackground });
            }
        }

        // #######################################################################
        // # Создает объект с настройками фона по умолчанию, если они отсутствуют.
        // #######################################################################
        function initializeDefaultBgSettings() {
            const defaultVidId = generateUniqueId();
            bgSettings = {
                activeBackgroundId: protectedBackground.id,
                sources: [
                    { ...protectedBackground },
                    { id: defaultVidId, name: 'Pinterest Видео (стандарт)', url: defaultVideoURL, type: 'video' }
                ]
            };
        }
        if (bgSettingsFromStorage) {
            if (Array.isArray(bgSettingsFromStorage.sources) && typeof bgSettingsFromStorage.activeBackgroundId !== 'undefined') {
                bgSettings = bgSettingsFromStorage;
                ensureProtectedBackgroundExists(bgSettings);
                bgSettings.sources = bgSettings.sources.filter(src => src && src.url && typeof src.url === 'string' && src.url.trim() !== '');
                bgSettings.sources.forEach(src => {
                    if (!src.id && !src.isProtected) src.id = generateUniqueId();
                    else if (src.isProtected && src.id !== protectedBackground.id) src.id = protectedBackground.id;
                });
                if (bgSettings.sources.length > 0 && bgSettings.activeBackgroundId && !bgSettings.sources.find(s => s.id === bgSettings.activeBackgroundId)) {
                    bgSettings.activeBackgroundId = protectedBackground.id;
                } else if (bgSettings.sources.length > 0 && !bgSettings.activeBackgroundId) {
                    bgSettings.activeBackgroundId = protectedBackground.id;
                } else if (bgSettings.sources.length === 0) {
                    initializeDefaultBgSettings();
                }
            } else if (bgSettingsFromStorage.sources && (bgSettingsFromStorage.sources.image || bgSettingsFromStorage.sources.video)) {
                bgSettings = { activeBackgroundId: null, sources: [] };
                ensureProtectedBackgroundExists(bgSettings);
                const oldImageUrl = bgSettingsFromStorage.sources.image;
                const oldVideoUrl = bgSettingsFromStorage.sources.video;
                const oldType = bgSettingsFromStorage.type;
                if (oldImageUrl && oldImageUrl.trim() !== '' && oldImageUrl !== protectedBackground.url) {
                    const imgId = generateUniqueId();
                    bgSettings.sources.push({ id: imgId, name: 'Старая картинка (мигр.)', url: oldImageUrl, type: 'image' });
                    if (oldType === 'image' && !bgSettings.activeBackgroundId) bgSettings.activeBackgroundId = imgId;
                }
                if (oldVideoUrl && oldVideoUrl.trim() !== '') {
                    const videoId = generateUniqueId();
                    bgSettings.sources.push({ id: videoId, name: 'Старое видео (мигр.)', url: oldVideoUrl, type: 'video' });
                    if (oldType === 'video' && !bgSettings.activeBackgroundId) bgSettings.activeBackgroundId = videoId;
                }
                if (!bgSettings.activeBackgroundId && bgSettings.sources.length > 0) {
                    bgSettings.activeBackgroundId = bgSettings.sources[0].id;
                } else if (bgSettings.sources.length === 0) {
                    initializeDefaultBgSettings();
                }
            } else {
                initializeDefaultBgSettings();
            }
        } else {
            initializeDefaultBgSettings();
        }
        saveBgSettingsToLocalStorage();

        // #######################################################################
        // # Сохраняет текущие настройки фона в localStorage.
        // #######################################################################
        function saveBgSettingsToLocalStorage() {
            localStorage.setItem('bgSettings', JSON.stringify(bgSettings));
        }

        // #######################################################################
        // # Отрисовывает (перерисовывает) список сохраненных фонов в панели управления.
        // #######################################################################
        function renderSavedBackgroundsList() {
            const container = document.getElementById('saved-bgs-list-container');
            if (!container) {
                return;
            }
            container.innerHTML = '';
            if (!bgSettings || !Array.isArray(bgSettings.sources) || bgSettings.sources.length === 0) {
                container.innerHTML = '<p style="text-align:center; color: #888; padding: 10px 0;">Список пуст. Добавьте фон выше.</p>';
                return;
            }
            bgSettings.sources.forEach(bg => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'saved-bg-item';
                itemDiv.dataset.id = bg.id;
                itemDiv.style.cssText = `
            padding: 8px 10px; margin-bottom: 6px; background: #2c2f33; /* Чуть светлее фон элемента */
            border: 1px solid #3a3e42; /* Чуть светлее граница */
            border-radius: 5px; /* Немного больше скругление */
            display: flex; justify-content: space-between; align-items: center;
            transition: border-color 0.2s, box-shadow 0.2s; word-break: break-word;
        `;
                if (bg.id === bgSettings.activeBackgroundId) {
                    itemDiv.style.borderColor = '#5865f2';
                    itemDiv.style.boxShadow = '0 0 6px rgba(88, 101, 242, 0.4)';
                }
                const nameAndTypeWrapper = document.createElement('div');
                nameAndTypeWrapper.style.display = 'flex';
                nameAndTypeWrapper.style.flexDirection = 'column';
                nameAndTypeWrapper.style.marginRight = '10px';
                nameAndTypeWrapper.style.flexGrow = '1';
                const nameSpan = document.createElement('span');
                nameSpan.className = 'bg-item-name';
                nameSpan.textContent = bg.name || 'Без имени';
                if (bg.isProtected) nameSpan.textContent += " 🛡️";
                nameSpan.style.fontWeight = '500';
                nameSpan.style.cursor = 'pointer';
                nameSpan.title = `Нажмите, чтобы скопировать URL:\n${bg.url}`;
                nameSpan.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(bg.url);
                        safeDLEPushCall('success', `URL скопирован: ${bg.url.substring(0,50)}...`);
                        const originalText = nameSpan.textContent;
                        const shieldIcon = bg.isProtected ? " 🛡️" : "";
                        nameSpan.innerHTML = `Скопировано! ${shieldIcon}`;
                        nameSpan.style.color = '#43b581';
                        setTimeout(() => {
                            nameSpan.textContent = (bg.name || 'Без имени') + shieldIcon;
                            nameSpan.style.color = '';
                        }, 2000);
                    } catch (err) {
                        console.error('Ошибка копирования URL: ', err);
                        safeDLEPushCall('error', 'Не удалось скопировать URL. Проверьте разрешения консоли.');
                    }
                });
                const typeSpan = document.createElement('span');
                typeSpan.className = 'bg-item-type';
                typeSpan.textContent = (bg.type === 'image' ? 'Картинка/GIF' : 'Видео');
                typeSpan.style.fontSize = '0.8em';
                typeSpan.style.color = '#96989d';
                nameAndTypeWrapper.appendChild(nameSpan);
                nameAndTypeWrapper.appendChild(typeSpan);
                const controlsDiv = document.createElement('div');
                controlsDiv.style.display = 'flex';
                controlsDiv.style.alignItems = 'center';
                controlsDiv.style.gap = '6px';
                const buttonBaseStyle = `
            padding: 0; font-size: 1.1em; border: none; border-radius: 5px;
            cursor: pointer; width: 28px; height: 28px; /* Уменьшенные кнопки */
            display: flex; align-items: center; justify-content: center;
            line-height: 1; transition: background-color 0.2s ease, opacity 0.2s ease;
        `;
                const applyBtn = document.createElement('button');
                applyBtn.innerHTML = '▶';
                applyBtn.title = 'Применить';
                applyBtn.className = 'apply-bg-btn';
                applyBtn.style.cssText = buttonBaseStyle + 'background-color: #5865f2; color: white;';
                if (bg.id === bgSettings.activeBackgroundId && stylesEnabled) {
                    applyBtn.disabled = true;
                    applyBtn.style.opacity = '0.5';
                    applyBtn.style.cursor = 'not-allowed';
                    applyBtn.style.backgroundColor = '#4e5d94';
                }
                applyBtn.onmouseenter = () => { if (!applyBtn.disabled) applyBtn.style.backgroundColor = '#4752c4'; };
                applyBtn.onmouseleave = () => { if (!applyBtn.disabled) applyBtn.style.backgroundColor = '#5865f2'; };
                applyBtn.onclick = () => handleApplyBackground(bg.id);
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '✕';
                deleteBtn.title = 'Удалить';
                deleteBtn.className = 'delete-bg-btn';
                deleteBtn.style.cssText = buttonBaseStyle + 'background-color: #ed4245; color: white;';
                if (bg.isProtected) {
                    deleteBtn.disabled = true;
                    deleteBtn.style.opacity = '0.4';
                    deleteBtn.style.cursor = 'not-allowed';
                    deleteBtn.title = 'Этот фон защищен от удаления';
                    deleteBtn.style.backgroundColor = '#a13638';
                } else {
                    deleteBtn.onmouseenter = () => { deleteBtn.style.backgroundColor = '#c7383a'; };
                    deleteBtn.onmouseleave = () => { deleteBtn.style.backgroundColor = '#ed4245'; };
                    deleteBtn.onclick = () => handleDeleteBackground(bg.id);
                }
                itemDiv.appendChild(nameAndTypeWrapper);
                controlsDiv.appendChild(applyBtn);
                controlsDiv.appendChild(deleteBtn);
                itemDiv.appendChild(controlsDiv);
                container.appendChild(itemDiv);
            });
        }

        // #######################################################################
        // # Обрабатывает добавление нового фона из полей ввода в панели управления.
        // #######################################################################
        function handleAddBackground() {
            const nameInput = document.getElementById('new-bg-name');
            const urlInput = document.getElementById('new-bg-url');
            const typeSelect = document.getElementById('new-bg-type');
            const name = nameInput.value.trim();
            const url = urlInput.value.trim();
            const type = typeSelect.value;
            if (!url) {
                safeDLEPushCall('URL фона не может быть пустым.', 'error'); return;
            }
            const isValidUrl = /^(https?:)?\/\/.+\..+/i.test(url) || /^\/[^\/\s].*/i.test(url);
            if (!isValidUrl) {
                safeDLEPushCall('Введите корректный URL (например, https://... или /путь/к/файлу.jpg).', 'error'); return;
            }
            const newBg = {
                id: generateUniqueId(),
                name: name || `Фон #${(bgSettings.sources ? bgSettings.sources.length : 0) + 1}`,
                url: url, type: type
            };
            if (!bgSettings.sources) bgSettings.sources = [];
            bgSettings.sources.push(newBg);
            saveBgSettingsToLocalStorage();
            renderSavedBackgroundsList();
            nameInput.value = ''; urlInput.value = '';
            safeDLEPushCall('Фон добавлен в список!', 'success');
        }

        // #######################################################################
        // # Применяет выбранный фон по его ID, делая его активным.
        // #######################################################################
        function handleApplyBackground(id) {
            bgSettings.activeBackgroundId = id;
            saveBgSettingsToLocalStorage();
            if (!stylesEnabled) {
                stylesEnabled = true;
                localStorage.setItem('stylesEnabled', 'true');
            }
            applyStyles();
            renderSavedBackgroundsList();
            safeDLEPushCall('Фон применен!', 'success');
        }

        // #######################################################################
        // # Удаляет фон из списка по его ID и обновляет активный фон, если необходимо.
        // #######################################################################
        function handleDeleteBackground(id) {
            const bgToDelete = bgSettings.sources.find(bg => bg.id === id);
            if (bgToDelete && bgToDelete.isProtected) {
                safeDLEPushCall('Этот фон защищен и не может быть удален.', 'warning'); return;
            }
            const initialSourceCount = bgSettings.sources ? bgSettings.sources.length : 0;
            bgSettings.sources = bgSettings.sources.filter(bg => bg.id !== id);
            if (bgSettings.sources.length < initialSourceCount) {
                if (bgSettings.activeBackgroundId === id) {
                    bgSettings.activeBackgroundId = bgSettings.sources.length > 0 ? (bgSettings.sources.find(bg_ => bg_.id === protectedBackground.id) ? protectedBackground.id : bgSettings.sources[0].id) : null;
                    if (stylesEnabled) applyStyles();
                }
                saveBgSettingsToLocalStorage();
                renderSavedBackgroundsList();
                safeDLEPushCall('Фон удален.', 'info');
            }
        }

        // #######################################################################
        // # Создает и добавляет на страницу HTML-структуру и стили для панели управления фоном.
        // #######################################################################
        function createUI() {
            const style = document.createElement('style');
            style.textContent = `
#bg-control-panel {
            position: fixed; bottom: 60px; right: 8px; /* Еще немного сдвинем и поднимем */
            z-index: 10001;
            background: #1e1f22;
            padding: 12px; /* Уменьшенный padding */
            border-radius: 6px;
            border: 1px solid #4a2f3a; /* Темнее граница */
            box-shadow: 0 0 10px rgba(180, 40, 70, 0.2), 0 0 3px rgba(180, 40, 70, 0.1); /* Меньше свечение */
            display: none; width: 280px; /* Значительно уменьшенная ширина */
            color: #b0b0b0; /* Чуть светлее основной текст */
            font-family: Arial, sans-serif;
        }
        #bg-control-panel h3 { /* Заголовок панели */
            text-align: center; margin-top: 0; margin-bottom: 15px;
            font-weight: 500; font-size: 1em; /* Уменьшен шрифт */
            color: #d4506a; /* Немного приглушенный акцент */
        }
        #bg-control-panel h4 { /* Подзаголовки секций */
            margin-top: 12px; margin-bottom: 6px; font-weight: normal; /* Убрали жирность */
            font-size: 0.75em; color: #909090; /* Тусклее */
            text-transform: uppercase; letter-spacing: 0.4px;
        }
        #bg-control-panel .input-group { margin-bottom: 8px; }
        #bg-control-panel input[type="text"], #bg-control-panel select {
            width: 100%; padding: 7px 8px; /* Уменьшен padding */
            border-radius: 3px;
            border: 1px solid #33353a; background-color: #27292d;
            color: #b0b0b0; box-sizing: border-box; font-size: 0.8em; /* Уменьшен шрифт */
        }
        #bg-control-panel input[type="text"]:focus, #bg-control-panel select:focus {
            border-color: #d4506a; outline: none;
        }
        #bg-control-panel select {
            appearance: none;
            background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M4%206l4%204%204-4z%22%20fill%3D%22%23b0b0b0%22/%3E%3C/svg%3E');
            background-repeat: no-repeat; background-position: right 6px center; padding-right: 24px;
        }
        #bg-control-panel .panel-action-button {
            color: #dadada; background-color: #c83a54; /* Основной акцентный */
            border: none; padding: 7px 12px; /* Уменьшен padding */
            border-radius: 3px; cursor: pointer; font-weight: normal; font-size: 0.85em; /* Уменьшен шрифт */
            width: 100%; margin-top: 6px;
        }
        #bg-control-panel .panel-action-button:hover { background-color: #b02c44; box-shadow: none; }
        #bg-control-panel #bg-close-panel-btn { background-color: #424549; }
        #bg-control-panel #bg-close-panel-btn:hover { background-color: #52565a; }
        #saved-bgs-list-container {
            max-height: 120px; /* Значительно уменьшена высота списка */
            overflow-y: auto; border: 1px solid #33353a;
            padding: 5px; margin-bottom: 12px; background: #27292d; border-radius: 3px;
        }
        #bg-control-panel small.catbox-promo {
            display: block; margin-top: 6px; font-size: 0.7em; /* Уменьшен шрифт */
            color: #777; text-align: center;
        }
        #bg-control-panel small.catbox-promo a { color: #c83a54; text-decoration: none; }
        /* Стили для переключателя фона */
        .bg-toggle-switch-container { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; margin-bottom: 8px; }
        .bg-toggle-switch-label { font-size: 0.8em; /* Уменьшен */ color: #a0a0a0; }
        .bg-toggle-switch { position: relative; display: inline-block; width: 38px; /* Уменьшена ширина */ height: 20px; /* Уменьшена высота */ }
        .bg-toggle-switch input { opacity: 0; width: 0; height: 0; }
        .bg-toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #424549; transition: .3s; border-radius: 20px; }
        .bg-toggle-slider:before { position: absolute; content: ""; height: 14px; /* Уменьшен кружок */ width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
        input:checked + .bg-toggle-slider { background-color: #c83a54; }
        input:focus + .bg-toggle-slider { box-shadow: 0 0 1px #c83a54; }
        input:checked + .bg-toggle-slider:before { transform: translateX(18px); /* Адаптирован сдвиг */ }
    `;
            document.head.appendChild(style);
            const controlPanel = document.createElement('div');
            controlPanel.id = 'bg-control-panel';
            if (window.location.pathname.startsWith('/pm/')) {
                controlPanel.setAttribute('data-mce-bogus', '1');
            }
            controlPanel.innerHTML = `
        <h3>Настройки фона (</h3>
        <div class="bg-toggle-switch-container">
            <span class="bg-toggle-switch-label">Отображение фона:</span>
            <label class="bg-toggle-switch">
                <input type="checkbox" id="bg-styles-enabled-toggle">
                <span class="bg-toggle-slider"></span>
            </label>
        </div>
        <h4>Добавить новый фон:</h4>
        <div class="input-group"><input type="text" id="new-bg-name" placeholder="Название фона (например, Лес)"></div>
        <div class="input-group"><input type="text" id="new-bg-url" placeholder="URL (https://.../image.jpg или .mp4)"></div>
        <div class="input-group">
            <select id="new-bg-type">
                <option value="image">Картинка / GIF</option>
                <option value="video">Видео</option>
            </select>
        </div>
        <small class="catbox-promo">Рекомендуемый хостинг: <a href="https://catbox.moe/" target="_blank">catbox.moe</a></small>
        <div style="margin-top: 15px; margin-bottom: 20px;">
            <button id="add-new-bg-btn" class="panel-action-button">Добавить в список</button>
        </div>
        <h4>Сохраненные фоны:</h4>
        <div id="saved-bgs-list-container"></div>
        <div style="margin-top: 20px;">
            <button id="bg-close-panel-btn" class="panel-action-button">Закрыть</button>
        </div>
    `;
            document.body.appendChild(controlPanel);
            document.getElementById('add-new-bg-btn').addEventListener('click', handleAddBackground);
            document.getElementById('bg-close-panel-btn').addEventListener('click', toggleControlPanel);
            const toggleCheckbox = document.getElementById('bg-styles-enabled-toggle');
            if (toggleCheckbox) {
                toggleCheckbox.checked = stylesEnabled;
                toggleCheckbox.addEventListener('change', () => {
                    toggleStyles();
                });
            }
            renderSavedBackgroundsList();
        }

        // #######################################################################
        // # Применяет стили для отображения активного фона (видео или изображения) на странице.
        // #######################################################################
        // #######################################################################
        // # Применяет стили для отображения активного фона (видео или изображения) на странице.
        // #######################################################################
        function applyStyles() {
            // ИСПРАВЛЕНИЕ 1: Добавляем проверку через isVideoPage().
            // Теперь фон не будет применяться на любой странице с плеером.
            if (isAnimePage()) {
                resetStyles();
                return;
            }

            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/user/')) {
                const pathSegments = currentPath.split('/').filter(segment => segment.length > 0);
                const knownUserSystemSubpaths = ['cards', 'settings', 'inventory', 'messages', 'notifications', 'bookmarks', 'friends', 'ignored', 'trades', 'auctions', 'collection', 'wishlist', 'achievements', 'history', 'balance', 'security', 'api', 'apps', 'subscriptions', 'referrals', 'logout', 'admin', 'moderator'];
                if (pathSegments.length === 2 && pathSegments[0] === 'user' && !knownUserSystemSubpaths.includes(pathSegments[1])) { resetStyles(); return; }
            }
            if (!element) { resetStyles(); return; }
            resetStyles();
            if (!stylesEnabled) return;
            if (!bgSettings || !bgSettings.activeBackgroundId) return;
            const activeBg = bgSettings.sources.find(s => s.id === bgSettings.activeBackgroundId);
            if (!activeBg || !activeBg.url || activeBg.url.trim() === '') return;
            const fixedBackgroundHeight = '500px';
            const borderRadiusValue = '15px';
            element.style.position = 'relative';
            element.style.minHeight = fixedBackgroundHeight;
            element.style.overflow = 'hidden';
            element.style.borderRadius = borderRadiusValue;
            let bgContainer = element.querySelector('.script-background-container');
            if (!bgContainer) {
                bgContainer = document.createElement('div');
                bgContainer.className = 'script-background-container';
                element.prepend(bgContainer);
            }
            Object.assign(bgContainer.style, { position: 'absolute', top: '0', left: '0', width: '100%', height: fixedBackgroundHeight, overflow: 'hidden', zIndex: '-1' });
            bgContainer.innerHTML = '';
            bgContainer.style.backgroundImage = '';
            if (activeBg.type === 'video') {
                element.style.backgroundColor = 'transparent';
                const video = document.createElement('video');
                video.src = activeBg.url;
                video.autoplay = true; video.loop = true; video.muted = true;
                Object.assign(video.style, { width: '100%', height: '100%', objectFit: 'cover' });
                bgContainer.appendChild(video);
            } else {
                bgContainer.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.65)), url('${activeBg.url}')`;
                bgContainer.style.backgroundSize = 'cover';
                bgContainer.style.backgroundPosition = 'center top';
                bgContainer.style.backgroundRepeat = 'no-repeat';
            }
            if (document.getElementById('bg-control-panel')) {
                renderSavedBackgroundsList();
            }
        }

        // #######################################################################
        // # Сбрасывает все стили, примененные для фона, возвращая странице исходный вид.
        // #######################################################################
        function resetStyles() {
            const bgContainer = element ? element.querySelector('.script-background-container') : null;
            if (bgContainer) { bgContainer.remove(); }
            if (element) {
                element.style.position = ''; element.style.overflow = ''; element.style.backgroundColor = '';
                element.style.borderRadius = ''; element.style.minHeight = '';
            }
            document.body.style.backgroundImage = '';
            if (document.getElementById('bg-control-panel')) {
                renderSavedBackgroundsList();
            }
        }

        // #######################################################################
        // # Переключает видимость (показывает/скрывает) панели управления фоном.
        // #######################################################################
        function toggleControlPanel() {
            let panel = document.getElementById('bg-control-panel');
            if (!panel) {
                createUI();
                panel = document.getElementById('bg-control-panel');
            }
            if (!panel) {
                return;
            }
            const isOpen = panel.style.display === 'block';
            panel.style.display = isOpen ? 'none' : 'block';
            if (!isOpen) {
                renderSavedBackgroundsList();
            }
        }

        // #######################################################################
        // # Включает или отключает отображение кастомного фона и сохраняет состояние.
        // #######################################################################
        function toggleStyles() {
            stylesEnabled = !stylesEnabled;
            localStorage.setItem('stylesEnabled', stylesEnabled.toString());
            if (stylesEnabled) applyStyles();
            else resetStyles();
            const toggleCheckbox = document.getElementById('bg-styles-enabled-toggle');
            if (toggleCheckbox) {
                toggleCheckbox.checked = stylesEnabled;
            }
        }

        // #######################################################################
        // # Инициализирует всю функциональность кастомного фона: UI, стили и обработчики.
        // #######################################################################
        function initializeBackgroundFeatures() {
            if (!document.getElementById('bg-control-panel')) {
                createUI();
            }
            if (document.getElementById('bg-control-panel')) {
                renderSavedBackgroundsList();
            } else {
            }
            if (stylesEnabled) {
                applyStyles();
            } else {
                resetStyles();
            }
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeBackgroundFeatures);
        } else {
            initializeBackgroundFeatures();
        }
        try {
            GM_registerMenuCommand("Настройки фона", toggleControlPanel);
        } catch (e) {
            console.error('Ошибка при регистрации команд GM для фона:', e);
        }
        if (isMyCardPage()) {
            const processAllPagesBtn = getButton(
                'processAllPagesBtn',
                'rocket',
                424,
                'Проверить спрос (ВСЕ страницы)',
                () => processCards(true)
            );
            processAllPagesBtn.style.height = '20px';
            processAllPagesBtn.style.borderRadius = '20px 20px 0 0';
            document.body.appendChild(processAllPagesBtn);
            document.body.appendChild(getButton(
                'processCards',
                'rocket',
                390,
                'Проверить спрос (текущая страница)',
                () => processCards(false, false)
            ));
            document.body.appendChild(getButton('readyToCharge', 'circle-check', 330, 'Готов поменять', readyToCharge));
        } else {
            document.body.appendChild(getButton('processCards', 'rocket', 390, 'Проверить спрос (текущая страница)', () => processCards(false)));
        }
        // --- Модифицированный блок для кнопки и логики кристаллов (с GM API) ---
            const crystalBtn = document.createElement('button');
            crystalBtn.id = 'toggleCrystalScript';
            crystalBtn.title = 'Включить/Выключить сбор кристаллов';
            Object.assign(crystalBtn.style, {
                position: 'fixed', bottom: '230px', right: '12px', zIndex: '100',
                fontSize: '15px', width: '40px', height: '40px', border: 'none', borderRadius: '50%',
                transition: 'transform 0.1s ease, box-shadow 0.1s ease, background 0.3s ease, opacity 0.3s ease, visibility 0s linear 0s',
                color: 'white', cursor: 'pointer', boxShadow: '0 0 10px rgba(0,0,0,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0'
            });
            crystalBtn.textContent = '💎';

            // #######################################################################
            // # Обновляет стиль кнопки сбора кристаллов (цвет) в зависимости от того, включен ли сбор.
            // #######################################################################
            function updateCrystalButtonStyle() {
                crystalBtn.style.background = crystalScriptEnabled ? 'linear-gradient(145deg, rgb(50, 222, 50), rgb(50, 122, 50))' : 'linear-gradient(145deg, rgb(166, 100, 110), rgb(222, 0, 5))';
            }
crystalBtn.addEventListener('click', async () => {
    crystalScriptEnabled = !crystalScriptEnabled;
    await GM_setValue(CRYSTAL_SCRIPT_ENABLED_KEY, crystalScriptEnabled);
    updateCrystalButtonStyle();
    if (crystalScriptEnabled) {
        if (isAnimePage()) {
            startAutoClickCrystalScript();
        } else {
            safeDLEPushCall('info', "Сбор кристаллов включен.");
        }
    }
    else {
        stopAutoClickCrystalScript();
        safeDLEPushCall('info', "Сбор кристаллов выключен.");
    }
});
            ['mousedown', 'mouseup', 'mouseleave'].forEach(eventType => {
                crystalBtn.addEventListener(eventType, () => {
                    const currentTransform = (areActionButtonsHidden && managedButtonSelectors.includes('#toggleCrystalScript')) ? 'translateX(calc(100% + 20px))' : 'translateX(0px)';
                    if (eventType === 'mousedown') { crystalBtn.style.transform = `${currentTransform} translateY(2px) scale(0.95)`; crystalBtn.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)'; }
                    else { crystalBtn.style.transform = `${currentTransform} translateY(0) scale(1)`; crystalBtn.style.boxShadow = '0 0 10px rgba(0,0,0,0.7)'; }
                });
            });
            document.body.appendChild(crystalBtn);
            GM_addValueChangeListener(CRYSTAL_SCRIPT_ENABLED_KEY, (key, oldValue, newValue, remote) => {
                if (remote && crystalScriptEnabled !== newValue) {
                    crystalScriptEnabled = newValue;
                    updateCrystalButtonStyle();
                    if (crystalScriptEnabled && isAnimePage()) {
                        startAutoClickCrystalScript();
                    } else {
                        stopAutoClickCrystalScript();
                    }
                }
            });

            // #######################################################################
            // # Асинхронная самовызывающаяся функция для инициализации состояния сбора кристаллов при загрузке.
            // #######################################################################
            (async function initializeCrystalState() {
                crystalScriptEnabled = await GM_getValue(CRYSTAL_SCRIPT_ENABLED_KEY, false);
                updateCrystalButtonStyle();
                if (crystalScriptEnabled && isAnimePage()) {
                    startAutoClickCrystalScript();
                } else {
                    stopActiveCrystalOperations();
                }
            })();
        initDuplicateChecker();
        if (isCardPackPage()) {
            createAutoPackCheckFeature();
            createAutoDemandCheckFeature();
        }
        addClearButton();
        const filterFormEl = document.querySelector('.card-filter-form');
        if (filterFormEl) {
            new MutationObserver(() => {
                if (!document.querySelector('.clear-search-btn')) addClearButton();
            }).observe(filterFormEl.parentElement || document.body, { childList: true, subtree: true });
        }
        createToggleVisibilityButton();
        addClearPageCacheFeature();
        applyManagedButtonsVisibility(true);
        setupSiteNotificationInterceptor();
        initAutoCharge();
        asbm_initializeModule();
        initializeNotificationHandler();
    }

    // #######################################################################
    // # Обертка для предотвращения повторной инициализации скрипта.
    // #######################################################################
    function initializeScriptWrapper() {
        if (scriptInitialized) {
            return;
        }
        scriptInitialized = true;
        doActualInitialization();
        if (window.self === window.top) {
            const currentPathname = window.location.pathname;
            if (currentPathname.match(/^\/cards\/\d+\/trade\/?$/i) || currentPathname.startsWith('/trades/')) {
                setTimeout(handleTradePagePoster, 200);
            }
        }
    }
    const currentUrlParams = new URLSearchParams(window.location.search);
    const isTradePreviewIframe = currentUrlParams.get('as_preview_iframe') === 'true';
    if (window.self === window.top) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeScriptWrapper);
        } else {
            initializeScriptWrapper();
        }
    } else if (isTradePreviewIframe) {
        console.log('AssTars Card Master: Обнаружен iframe превью обмена, запускаю инициализацию кнопок...');
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeScriptWrapper);
        } else {
            initializeScriptWrapper();
        }
    }

    // #######################################################################
    // # "Auto Click Crystal"
    // #######################################################################
    let crystalPanelColorResetTimeout = null;
    let isFastCheckAfterClick = false;

    // #######################################################################
    // # Подсвечивает панель информации о кристаллах при успешном сборе.
    // #######################################################################
    function highlightCrystalPanel(isSuccess) {
        if (crystalInfoPanel) {
            if (crystalPanelColorResetTimeout) {
                clearTimeout(crystalPanelColorResetTimeout);
            }
            if (isSuccess) {
                // Зеленая подсветка при успехе
                crystalInfoPanel.style.backgroundColor = 'rgba(0, 80, 20, 0.8)';
                crystalInfoPanel.style.boxShadow = '0 0 10px rgba(0, 255, 100, 0.5)';
            } else {
                // Красная подсветка при неудаче
                crystalInfoPanel.style.backgroundColor = 'rgba(120, 20, 20, 0.8)';
                crystalInfoPanel.style.boxShadow = '0 0 10px rgba(255, 50, 50, 0.5)';
            }
            // Через 5мин возвращаем стандартный цвет
            crystalPanelColorResetTimeout = setTimeout(() => {
                if (crystalInfoPanel) {
                    crystalInfoPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    crystalInfoPanel.style.boxShadow = 'none';
                }
            }, 300000);
        }
    }


    // #######################################################################
    // # Фиксер плеера по событию noData (Запускается один раз при инициализации)
    // #######################################################################
    function initializePlayerFixerOnNoData() {
        if (!isAnimePage()) return;
        const playerElement = document.getElementById('myPlayer');
        if (!playerElement) return;

        // Создаем "обещание", которое разрешится, когда страница будет исправлена.
        unsafeWindow.playerFixedPromise = new Promise(resolve => {
            const noDataHandler = () => {
                console.warn('[ACM Player Fix] Получен сигнал "noData". Плеер неисправен.');
                const kodikTab = document.getElementById('kodik-tab');
                if (kodikTab) {
                    console.log('[ACM Player Fix] Принудительно переключаюсь на "Кодик плеер"...');

                    // УПРОЩЕННАЯ ЛОГИКА: Просто кликаем, без лишних проверок.
                    if (typeof unsafeWindow.$ === 'function') {
                        unsafeWindow.$('#kodik-tab').trigger('click');
                        console.log('[ACM Player Fix] Команда на переключение плеера отправлена.');
                    } else {
                        kodikTab.click();
                    }

                    // Даем 300мс на переключение и сообщаем, что исправление завершено.
                    setTimeout(resolve, 300);
                } else {
                    console.error('[ACM Player Fix] Плеер сломан, но вкладка "Кодик" не найдена!');
                    resolve(); // Все равно разрешаем promise, чтобы не блокировать скрипт
                }
            };

            playerElement.addEventListener('noData', noDataHandler, { once: true });

            // Если событие noData не произойдет в течение 1 секунды, считаем, что страница в порядке.
            setTimeout(resolve, 1000);
        });
    }
    // #######################################################################
    // # Функция открытия и закрытия режима Кинотеатра (теперь ждет фиксер)
    // #######################################################################
    async function forceActivateChatForCrystals() {
        const chatContainer = document.getElementById('chat-place');
        if (chatContainer && window.getComputedStyle(chatContainer).display !== 'none') {
            console.log('Чат уже активен, активация не требуется.');
            return;
        }

        // --- ОЖИДАНИЕ ЗАВЕРШЕНИЯ ФИКСЕРА ---
        console.log('Ожидаю завершения работы фиксера плеера...');
        if (unsafeWindow.playerFixedPromise) {
            await unsafeWindow.playerFixedPromise;
        }
        console.log('Фиксер завершил работу. Запускаю активацию чата...');
        // ------------------------------------

        const cinemaButton = document.querySelector('.anime-player__fullscreen-btn');
        if (!cinemaButton || cinemaButton.offsetParent === null) {
            console.warn('Кнопка кинотеатра не найдена. Активация чата невозможна.');
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'acm-init-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            backgroundColor: 'rgb(30, 31, 34)', zIndex: '2147483647',
            transition: 'opacity 0.25s ease-out'
        });
        document.documentElement.appendChild(overlay);

        requestAnimationFrame(() => {
            console.log('Клик #1 (вход в кинотеатр)');
            cinemaButton.click();

            setTimeout(() => {
                const buttonAfterFirstClick = document.querySelector('.anime-player__fullscreen-btn');
                if (buttonAfterFirstClick) {
                    console.log('Клик #2 (выход из кинотеатра)');
                    buttonAfterFirstClick.click();
                } else {
                    console.warn('Кнопка кинотеатра исчезла после первого клика.');
                }

                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.remove();
                    }
                    console.log('Активация чата завершена.');
                }, 250);
            }, 150);
        });
    }

    // #######################################################################
    // # Запускает и инициализирует весь модуль автоматического сбора кристаллов.
    // #######################################################################
   async function startAutoClickCrystalScript() {
        if (isCrystalScriptCurrentlyRunning || !isAnimePage()) return;
        isCrystalScriptCurrentlyRunning = true;

        forceActivateChatForCrystals();

        console.log("Сбор кристаллов (v2.2: Scope Fix) запущен!");

        // =======================================================================================
        // >>> ИСПРАВЛЕНИЕ: Функция теперь определена ВНУТРИ основной функции <<<
        // Это гарантирует, что она будет доступна для MutationObserver.
        // =======================================================================================
        async function processNewChatMessageNode(messageNode) {
            if (!messageNode || messageNode.nodeType !== Node.ELEMENT_NODE || !messageNode.matches('.lc_chat_li')) {
                return;
            }
            const diamond = messageNode.querySelector("#diamonds-chat");
            if (!diamond) {
                return;
            }
            const messageId = messageNode.dataset.id;
            if (!messageId || lastClickedIds.has(messageId)) {
                return;
            }
            if (lastClickedQueue.length >= CRYSTAL_CACHE_LIMIT) {
                const oldestId = lastClickedQueue.shift();
                lastClickedIds.delete(oldestId);
            }
            lastClickedIds.add(messageId);
            lastClickedQueue.push(messageId);
            const timeForLog = messageNode.querySelector(".lc_chat_li_date")?.textContent.trim() || 'неизвестное время';
            console.log(`💎 [Observer] Найден кристалл! ID: ${messageId}, время: ${timeForLog}. Кликаю...`);
            diamond.click();
            clickedCrystals++;
            const cDispUpd = document.getElementById('clickedCrystals');
            if (cDispUpd) cDispUpd.textContent = clickedCrystals;
            await GM_setValue('gm_clickedCrystals', clickedCrystals);
            console.log(`[Observer] Запланирована проверка транзакций через 2 минуты...`);
            if (checkHeavenlyStoneIntervalIds.length > 0) {
                clearTimeout(checkHeavenlyStoneIntervalIds[0]); // Отменяем предыдущий запланированный вызов
                checkHeavenlyStoneIntervalIds = [];
            }
            checkHeavenlyStoneIntervalIds.push(setTimeout(verifyAndCountCrystal, 120000)); // 120000 мс = 2 минуты
        }

        // --- Инициализация и сброс счетчиков ---
        clickedCrystals = await GM_getValue('gm_clickedCrystals', 0);
        collectedStones = await GM_getValue('gm_collectedStones', 0);
        soundEnabled = false;

        async function handleClearButtonClick() {
            console.log("Запущен процесс полной очистки и создания точки отсчёта...");
            clickedCrystals = 0;
            collectedStones = 0;
            lastClickedIds.clear();
            lastClickedQueue = [];
            const cDisp = document.getElementById('clickedCrystals'); if(cDisp)cDisp.textContent = 0;
            const sDisp = document.getElementById('collectedStones'); if(sDisp)sDisp.textContent = 0;
            await GM_deleteValue('gm_clickedCrystals');
            await GM_deleteValue('gm_collectedStones');
            await GM_deleteValue('gm_verifiedCrystalTransactions');
            try {
                const response = await fetch('/transactions/', { cache: 'no-cache' });
                if (!response.ok) throw new Error(`Ошибка HTTP при создании точки отсчета: ${response.status}`);
                const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
                const newVerifiedTransactions = {};
                const transactionRows = doc.querySelectorAll('.ncard-transactions__table tbody tr.new-tr-item');
                for (const row of transactionRows) {
                    const descCell = row.querySelector('td:nth-child(3)');
                    const dateCell = row.querySelector('td.new-tr-date');
                    if (descCell && dateCell && descCell.textContent.trim() === "Найден небесный камень") {
                        const transactionId = dateCell.textContent.trim();
                        newVerifiedTransactions[transactionId] = true;
                    }
                }
                await GM_setValue('gm_verifiedCrystalTransactions', newVerifiedTransactions);
                console.log(`Точка отсчета создана. ${Object.keys(newVerifiedTransactions).length} старых транзакций будут проигнорированы.`);
            } catch(error) {
                console.error("Ошибка при создании точки отсчета.", error);
            }
        }

        const lastResetTimestamp = await GM_getValue('gm_lastClickedResetTimestamp', 0);
        const resetIntervalMs = CRYSTAL_RESET_INTERVAL_DAYS * 24 * 60 * 60 * 1000;
        if (Date.now() - lastResetTimestamp > resetIntervalMs) {
            console.log(`Прошло более ${CRYSTAL_RESET_INTERVAL_DAYS} дней. Автоматический сброс данных.`);
            await handleClearButtonClick();
            await GM_setValue('gm_lastClickedResetTimestamp', Date.now());
        } else {
            clickedCrystals = await GM_getValue('gm_clickedCrystals', 0);
            collectedStones = await GM_getValue('gm_collectedStones', 0);
        }

        GM_addValueChangeListener('gm_collectedStones', (key, oldValue, newValue, remote) => {
            if (remote && collectedStones !== newValue) {
                collectedStones = newValue;
                const sDisp = document.getElementById('collectedStones');
                if (sDisp) sDisp.textContent = collectedStones;
            }
        });

        // --- Функция проверки транзакций ---
        async function verifyAndCountCrystal() {
            if (!isLeaderWatch || !crystalScriptEnabled || !isAnimePage()) {
                return;
            }
            console.log("ACC (Лидер): 👑 Проверяю транзакции (v1: Full Page)...");
            try {
                // --- ВОЗВРАЩАЕМ НАДЕЖНЫЙ МЕТОД: Загрузка полной страницы ---
                const response = await fetch('/transactions/', { cache: 'no-cache' });
                if (!response.ok) throw new Error(`Ошибка HTTP ${response.status}`);

                const htmlText = await response.text();
                const doc = new DOMParser().parseFromString(htmlText, 'text/html');

                let verifiedTransactions = await GM_getValue('gm_verifiedCrystalTransactions', {});
                const transactionRows = doc.querySelectorAll('.ncard-transactions__table tbody tr.new-tr-item');
                let newStonesFoundThisCheck = 0;

                for (const row of transactionRows) {
                    const descCell = row.querySelector('td:nth-child(3)');
                    const dateCell = row.querySelector('td.new-tr-date');
                    if (descCell && dateCell && descCell.textContent.trim() === "Найден небесный камень") {
                        const transactionId = dateCell.textContent.trim();
                        if (!verifiedTransactions[transactionId]) {
                            newStonesFoundThisCheck++;
                            verifiedTransactions[transactionId] = true;
                        }
                    }
                }

                if (newStonesFoundThisCheck > 0) {
                    console.log(`ACC (Лидер): ✅ Найдено и подтверждено ${newStonesFoundThisCheck} новых камней (Full Page).`);
                    collectedStones += newStonesFoundThisCheck;
                    await GM_setValue('gm_collectedStones', collectedStones);
                    await GM_setValue('gm_verifiedCrystalTransactions', verifiedTransactions);

                    const stonesDisplay = document.getElementById('collectedStones');
                    if (stonesDisplay) stonesDisplay.textContent = collectedStones;

                    highlightCrystalPanel(true);
                    if (soundEnabled) notificationSound.play().catch(e => {});
                } else {
                    // Если новых камней не найдено, подсвечиваем панель красным,
                    // так как эта проверка всегда следует за кликом.
                    console.log("ACC (Лидер): ❌ Проверка не нашла новых камней (Full Page). Сбор не удался.");
                    highlightCrystalPanel(false);
                }

            } catch (error) {
                console.error("ACC (Лидер): 🚫 Ошибка при проверке /transactions/ (Full Page):", error);
            }
            // `finally` блок больше не нужен
        }

        // --- Функция активации UI и логики ---
        function activateCrystalLogic() {
            if (crystalInfoPanel && crystalInfoPanel.parentNode) crystalInfoPanel.remove();
            crystalInfoPanel = document.createElement('div');
            crystalInfoPanel.id = 'crystal-info-panel';
            Object.assign(crystalInfoPanel.style, { position: 'absolute', top: '2px', right: '2px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', padding: '5px 8px', borderRadius: '8px', zIndex: '100', textAlign: 'center', fontSize: '11px', lineHeight: '1.4', minWidth: '110px', transition: 'background-color 0.5s ease, box-shadow 0.5s ease' });

            const crystalsContainer = document.createElement('div');
            crystalsContainer.innerHTML = `Кликнул <span id="clickedCrystals" style="font-weight: bold;">${clickedCrystals}</span> р.`;
            const stonesContainer = document.createElement('div');
            stonesContainer.innerHTML = `Собрал <span id="collectedStones" style="font-weight: bold;">${collectedStones}</span> шт.`;
            const soundToggleButton = document.createElement('button');
            Object.assign(soundToggleButton.style, { marginLeft: '5px', backgroundColor: soundEnabled ? '#4CAF50':'#ff4d4d', color:'#fff', border:'none',padding:'0',borderRadius:'11px',cursor:'pointer', fontSize:'14px', lineHeight:'1',height:'20px',width:'20px' });
            soundToggleButton.innerHTML = soundEnabled ? '🔊':'🔇';
            soundToggleButton.onclick = () => { soundEnabled = !soundEnabled; soundToggleButton.style.backgroundColor = soundEnabled ? '#4CAF50':'#ff4d4d'; soundToggleButton.innerHTML = soundEnabled ? '🔊':'🔇'; };
            stonesContainer.appendChild(soundToggleButton);
            const clearButton = document.createElement('button');
            clearButton.textContent = 'х';
            Object.assign(clearButton.style, { marginLeft:'5px',backgroundColor:'#ff4d4d',color:'#fff',border:'none',padding:'0', borderRadius:'11px',cursor:'pointer',fontSize:'10px', lineHeight:'1',height:'20px',width:'20px' });
            clearButton.addEventListener('click', handleClearButtonClick);
            crystalsContainer.appendChild(clearButton);
            crystalInfoPanel.append(crystalsContainer, stonesContainer);

            const playerCont = document.querySelector('#dle-player') || document.querySelector('.player-area') || document.querySelector('.video-player');
            if(playerCont){ playerCont.style.position='relative'; playerCont.appendChild(crystalInfoPanel); }
            else if(document.body){ document.body.appendChild(crystalInfoPanel); }

            // --- Логика с Mutation Observer ---
            const chatListElement = document.getElementById('lc_chat');
            if (!chatListElement) {
                console.error("Не удалось найти контейнер чата (#lc_chat) для наблюдения.");
                return;
            }
            if (chatObserver) chatObserver.disconnect();
            chatObserver = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(processNewChatMessageNode);
                    }
                }
            });
            chatObserver.observe(chatListElement, { childList: true });
            console.log("Наблюдатель за чатом успешно запущен.");

            function preventTimeout() {
                if (!crystalScriptEnabled || !isAnimePage()) { if (preventTimeoutTimeoutId) clearTimeout(preventTimeoutTimeoutId); return; }
                const afkBtn = document.querySelector(".lc_chat_timeout_imback,.timeout-button,.afk-return-button");
                if(afkBtn) afkBtn.click();
                preventTimeoutTimeoutId = setTimeout(preventTimeout, 10000);
            }
            if (preventTimeoutTimeoutId) clearTimeout(preventTimeoutTimeoutId);
            preventTimeoutTimeoutId = setTimeout(preventTimeout, 1000);

            // >>> ИЗМЕНЕНИЕ: УДАЛЯЕМ БЕСКОНЕЧНЫЙ setInterval <<<
            // Теперь проверка будет запускаться только по необходимости после клика.
            checkHeavenlyStoneIntervalIds.forEach(id => clearTimeout(id)); // Используем clearTimeout на всякий случай
            checkHeavenlyStoneIntervalIds = [];
        }
        activateCrystalLogic();
    }

    // #######################################################################
    // # Останавливает все активные операции сбора кристаллов (таймауты, интервалы) и удаляет UI.
    // #######################################################################
    function stopActiveCrystalOperations() {
        if (clickOnCrystalsTimeoutId) {
            clearTimeout(clickOnCrystalsTimeoutId);
            clickOnCrystalsTimeoutId = null;
        }
        if (preventTimeoutTimeoutId) {
            clearTimeout(preventTimeoutTimeoutId);
            preventTimeoutTimeoutId = null;
        }
        if (crystalPanelColorResetTimeout) {
            clearTimeout(crystalPanelColorResetTimeout);
            crystalPanelColorResetTimeout = null;
        }

        // >>> ДОБАВЛЕНО <<<
        if (chatObserver) {
            chatObserver.disconnect();
            chatObserver = null;
            console.log("Наблюдатель за чатом остановлен.");
        }
        // >>> КОНЕЦ ДОБАВЛЕНИЯ <<<

        checkHeavenlyStoneIntervalIds.forEach(id => clearInterval(id));
        checkHeavenlyStoneIntervalIds = [];
        if (crystalInfoPanel && crystalInfoPanel.parentNode) {
            crystalInfoPanel.parentNode.removeChild(crystalInfoPanel);
            crystalInfoPanel = null;
        }
    }

    // #######################################################################
    // # Полностью останавливает работу модуля сбора кристаллов.
    // #######################################################################
    function stopAutoClickCrystalScript() {
        if (isCrystalScriptCurrentlyRunning) {
            console.log("Сбор кристаллов остановлен!");
        }
        stopActiveCrystalOperations();
        isCrystalScriptCurrentlyRunning = false;
    }


    // #######################################################################
    // # Скрипт для автоматического просмотра (Аниме) и сбора карт с него.
    // #######################################################################
    (function() {
        'use strict';
        if (window.self !== window.top) {
            return;
        }
        const _globalGetCurrentDomain = typeof getCurrentDomain === 'function' ? getCurrentDomain : () => window.location.origin;
        const tabTimestamp = Date.now();
        const tabIdWatch = tabTimestamp.toString() + "_" + Math.random().toString(36).substr(2, 5);
        let dleHashCheckAttemptsWatch = 0;
        const MAX_DLE_HASH_CHECK_ATTEMPTS_WATCH = 5;
        const DLE_HASH_CHECK_INTERVAL_WATCH = 20000;
        let initialLeaderCheckDoneWatch = false;
        let leaderFirstCheckLogDone = false;

        // #######################################################################
        // # Проверяет, является ли текущая страница страницей просмотра видео (Аниме).
        // #######################################################################
        function isVideoPageWatchInternal() {
    // Используем глобальную функцию для консистентности
    return isAnimePage();
}

        // #######################################################################
        // # Обновляет вид и подсказку кнопки авто-сбора в зависимости от состояния (вкл/выкл, лидер/ожидание).
        // #######################################################################
        function updateFullToggleButtonState(button) {
            if (!button) button = document.getElementById('toggleScriptButton');
            if (!button) return;

            if (scriptEnabledWatch) {
                // Когда скрипт включен (зеленая/желтая кнопка), видимость счетчика
                // определяется наличием карт (в функции updateAllCardCountDisplays).
                if (isLeaderWatch) {
                    button.style.setProperty('background', 'linear-gradient(145deg, rgb(50, 222, 50), rgb(50, 122, 50))', 'important'); // Зеленый
                    button.title = 'Авто-сбор карт ВКЛ (Лидер)';
                } else {
                    button.style.setProperty('background', 'linear-gradient(145deg, rgb(255, 193, 7), rgb(255, 160, 0))', 'important'); // Желто-оранжевый
                    button.title = 'Авто-сбор карт ВКЛ (Ожидание)';
                }
            } else {
                // Когда скрипт выключен (красная кнопка), меняем цвет и принудительно скрываем счетчик.
                button.style.setProperty('background', 'linear-gradient(145deg, rgb(166, 100, 110), rgb(222, 0, 5))', 'important'); // Красный
                button.title = 'Авто-сбор карт ВЫКЛ';
                if (autoCollectButtonCounter) {
                    autoCollectButtonCounter.style.display = 'none';
                }
            }
            button.style.setProperty('color', 'white', 'important');
        }

        // #######################################################################
        // # Реализует логику "выборов": проверяет текущего лидера в localStorage и пытается стать им, отдавая приоритет вкладкам на странице видео.
        // #######################################################################
        function tryToBecomeLeaderWatch() {
            if (!scriptEnabledWatch) {
                if (isLeaderWatch) {
                    isLeaderWatch = false;
                    updateFullToggleButtonState();
                    stopMainCardCheckLogic();
                }
                if (heartbeatIntervalId) {
                    clearInterval(heartbeatIntervalId);
                    heartbeatIntervalId = null;
                }
                return;
            }
            const currentTabIsVideo = isVideoPageWatchInternal();
            const currentLeaderJSON = localStorage.getItem(LEADER_KEY_WATCH);
            let currentLeader = null;
            let leaderIsAlive = false;
            if (currentLeaderJSON) {
                try {
                    currentLeader = JSON.parse(currentLeaderJSON);
                    if (currentLeader && typeof currentLeader.time === 'number' &&
                        typeof currentLeader.id === 'string' &&
                        typeof currentLeader.timestamp === 'number' &&
                        typeof currentLeader.isVideo === 'boolean') {
                        leaderIsAlive = (Date.now() - currentLeader.time <= LEADER_TIMEOUT_WATCH);
                    } else {
                        localStorage.removeItem(LEADER_KEY_WATCH);
                        currentLeader = null;
                    }
                } catch (e) {
                    console.error('Ошибка парсинга данных лидера (tryToBecomeLeaderWatch), считаем, что лидера нет.', e);
                    localStorage.removeItem(LEADER_KEY_WATCH);
                    currentLeader = null;
                }
            }
            let shouldThisTabBeLeader = false;
            if (!currentLeader || !leaderIsAlive) {
                shouldThisTabBeLeader = true;
                if (leaderIsAlive === false && currentLeader) {
                    console.log(`Предыдущий лидер ${currentLeader.isVideo ? '(Аниме)' : '(НЕ Аниме)'} больше не активен. Эта вкладка ${currentTabIsVideo ? '(Аниме)' : '(НЕ Аниме)'} претендует на лидерство.`);
                }
            } else {
                if (currentLeader.id === tabIdWatch) {
                    shouldThisTabBeLeader = true;
                } else if (currentTabIsVideo && !currentLeader.isVideo) {
                    shouldThisTabBeLeader = true;
                    console.log(`Эта вкладка ${currentTabIsVideo ? '(Аниме)' : ''} перехватывает лидерство у вкладки (НЕ Аниме).`);
                } else if (!currentTabIsVideo && currentLeader.isVideo) {
                    shouldThisTabBeLeader = false;
                    if (!initialLeaderCheckDoneWatch) {
                        console.log(`Я не лидер! Лидер уже есть, вкладка (Аниме).`);
                    }
                } else {
                    if (tabTimestamp < currentLeader.timestamp) {
                        shouldThisTabBeLeader = true;
                        console.log(`Эта вкладка (${currentTabIsVideo ? '(Аниме)' : '(НЕ Аниме)'}, ts: ${tabTimestamp}) старше и перехватывает лидерство у (id=${currentLeader.id}, ts: ${currentLeader.timestamp}).`);
                    } else if (tabTimestamp === currentLeader.timestamp && tabIdWatch < currentLeader.id) {
                        shouldThisTabBeLeader = true;
                        console.log(`Timestamp одинаковый, вкладка (${currentTabIsVideo ? '(Аниме)' : '(НЕ Аниме)'}) перехватывает лидерство.`);
                    } else {
                        shouldThisTabBeLeader = false;
                        if (!initialLeaderCheckDoneWatch && currentLeader) {
                            console.log(`Я не лидер! Лидер уже есть - вкладка ${currentLeader.isVideo ? '(Аниме)' : '(НЕ Аниме)'}.`);
                        }
                    }
                }
            }

            const oldIsLeaderWatch = isLeaderWatch;
            if (shouldThisTabBeLeader) {
                const payload = JSON.stringify({
                    id: tabIdWatch,
                    time: Date.now(),
                    timestamp: tabTimestamp,
                    isVideo: currentTabIsVideo
                });
                const existingLeaderPayload = localStorage.getItem(LEADER_KEY_WATCH);
                if (existingLeaderPayload !== payload || !existingLeaderPayload) {
                    localStorage.setItem(LEADER_KEY_WATCH, payload);
                }
                if (!oldIsLeaderWatch) {
                    isLeaderWatch = true;
                    console.log(`Эта вкладка ${currentTabIsVideo ? '(Аниме)' : '(НЕ Аниме)'} Стала лидером.`);
                    updateFullToggleButtonState();
                    startHeartbeatWatch(true);
                    if (scriptEnabledWatch) {
                        setTimeout(() => updateCardCounter(), 1000); // Первичная загрузка счетчика
                        setTimeout(mainCardCheckLogic, 500);
                    }
                } else {
                    isLeaderWatch = true;
                    if (currentLeader && currentLeader.id === tabIdWatch && currentTabIsVideo !== currentLeader.isVideo) {
                        updateFullToggleButtonState();
                    }
                }
            } else {
                if (oldIsLeaderWatch) {
                    isLeaderWatch = false;
                    console.log(`Вкладка (id=${tabIdWatch}) УСТУПИЛА лидерство (текущий лидер в storage: id=${currentLeader ? currentLeader.id : 'неизвестен'}, ${currentLeader ? (currentLeader.isVideo ? '(Аниме)' : '(НЕ Аниме)') : 'неизвестен'}).`);
                    updateFullToggleButtonState();
                    stopMainCardCheckLogic();
                    startHeartbeatWatch(false);
                } else {
                    isLeaderWatch = false;
                    if (!heartbeatIntervalId && scriptEnabledWatch) {
                        startHeartbeatWatch(false);
                    }
                }
            }
            initialLeaderCheckDoneWatch = true;
        }

        // #######################################################################
        // # Запускает "пульс" (setInterval): обновляет метку времени лидера или проверяет его активность, если вкладка не лидер.
        // #######################################################################
        function startHeartbeatWatch(isCurrentlyLeader) {
            if (heartbeatIntervalId) {
                clearInterval(heartbeatIntervalId);
            }
            heartbeatIntervalId = null;
            if (!scriptEnabledWatch) {
                return;
            }
            const interval = isCurrentlyLeader ? LEADER_HEARTBEAT_INTERVAL_WATCH : HEARTBEAT_INTERVAL_WATCH;
            heartbeatIntervalId = setInterval(() => {
                if (!scriptEnabledWatch) {
                    clearInterval(heartbeatIntervalId);
                    heartbeatIntervalId = null;
                    return;
                }
                if (isLeaderWatch) {
                    const currentTabIsVideo = isVideoPageWatchInternal();
                    let leaderDataInStorage = null;
                    const leaderDataJSON = localStorage.getItem(LEADER_KEY_WATCH);
                    if (leaderDataJSON) {
                        try { leaderDataInStorage = JSON.parse(leaderDataJSON); } catch (e) { /* молчим */ }
                    }
                    if (!leaderDataInStorage || leaderDataInStorage.id !== tabIdWatch || leaderDataInStorage.isVideo !== currentTabIsVideo) {
                        const payload = JSON.stringify({ id: tabIdWatch, time: Date.now(), timestamp: tabTimestamp, isVideo: currentTabIsVideo });
                        localStorage.setItem(LEADER_KEY_WATCH, payload);
                        if (leaderDataInStorage && leaderDataInStorage.id === tabIdWatch && leaderDataInStorage.isVideo !== currentTabIsVideo) {
                            updateFullToggleButtonState();
                        }
                    } else {
                        leaderDataInStorage.time = Date.now();
                        localStorage.setItem(LEADER_KEY_WATCH, JSON.stringify(leaderDataInStorage));
                    }
                } else {
                    const leaderDataJSON = localStorage.getItem(LEADER_KEY_WATCH);
                    if (!leaderDataJSON) {
                        tryToBecomeLeaderWatch();
                    } else {
                        try {
                            const leader = JSON.parse(leaderDataJSON);
                            const currentTabIsVideoForPriorityCheck = isVideoPageWatchInternal();

                            if (!leader || !leader.time || (Date.now() - leader.time > LEADER_TIMEOUT_WATCH)) {
                                tryToBecomeLeaderWatch();
                            } else if (currentTabIsVideoForPriorityCheck && leader.id !== tabIdWatch && !leader.isVideo) {
                                console.log(`Я (Аниме) вижу лидера - (НЕ Аниме). Пытаюсь перехватить.`);
                                tryToBecomeLeaderWatch();
                            } else {
                            }
                        } catch(e) {
                            localStorage.removeItem(LEADER_KEY_WATCH);
                            tryToBecomeLeaderWatch();
                        }
                    }
                }
            }, interval);
        }

        // #######################################################################
        // # Слушатель события storage для синхронизации состояния (вкл/выкл, смена лидера) между вкладками.
        // #######################################################################
        function checkLeaderStorageEventWatch(e) {
            if (e.key === STORAGE_KEY_WATCH) {
                const newState = e.newValue === 'true';
                if (scriptEnabledWatch !== newState) {
                    scriptEnabledWatch = newState;
                    console.log(`Состояние авто-сбора изменено из другой вкладки: ${scriptEnabledWatch ? 'ВКЛ' : 'ВЫКЛ'}`);
                    updateFullToggleButtonState();
                    if (scriptEnabledWatch) {
                        tryToBecomeLeaderWatch();
                    } else {
                        stopMainCardCheckLogic();
                        dleHashCheckAttemptsWatch = 0;
                        if (isLeaderWatch) {
                            const currentLeaderData = localStorage.getItem(LEADER_KEY_WATCH);
                            if (currentLeaderData) {
                                try {
                                    if (JSON.parse(currentLeaderData).id === tabIdWatch) {
                                        localStorage.removeItem(LEADER_KEY_WATCH);
                                    }
                                } catch (err) { /* молчим */ }
                            }
                            isLeaderWatch = false;
                        }
                        if (heartbeatIntervalId) {
                            clearInterval(heartbeatIntervalId);
                            heartbeatIntervalId = null;
                        }
                    }
                }
            }
            if (!scriptEnabledWatch) {
                return;
            }
            if (e.key === LEADER_KEY_WATCH) {
                const currentIsLeaderBeforeCheck = isLeaderWatch;
                if (!e.newValue) {
                    if (currentIsLeaderBeforeCheck) {
                        console.log(`Ключ лидера удален. Эта вкладка перестает быть лидером.`);
                        isLeaderWatch = false; stopMainCardCheckLogic(); updateFullToggleButtonState();
                    }
                    setTimeout(tryToBecomeLeaderWatch, Math.random() * 200 + 100); return;
                }
                try {
                    const newLeaderOnStorage = JSON.parse(e.newValue);
                    if (newLeaderOnStorage && newLeaderOnStorage.id) {
                        if (newLeaderOnStorage.id === tabIdWatch) {
                            if (!currentIsLeaderBeforeCheck) {
                                console.log(`Вкладка ${tabIdWatch} (${isVideoPageWatchInternal() ? '(Аниме)' : '(НЕ Аниме)'}) подтверждает/восстанавливает лидерство.`);
                                isLeaderWatch = true; updateFullToggleButtonState(); startHeartbeatWatch(true);
                                if (scriptEnabledWatch && !checkNewCardTimeoutId) { mainCardCheckLogic(); }
                            }
                        } else {
                            if (currentIsLeaderBeforeCheck) {
                                console.log(`Лидерство перехвачено вкладкой - ${newLeaderOnStorage.isVideo ? '(Аниме)' : '(НЕ Аниме)'}. Эта вкладка перестает быть лидером.`);
                                isLeaderWatch = false; stopMainCardCheckLogic(); updateFullToggleButtonState(); startHeartbeatWatch(false);
                            }
                        }
                    }
                } catch (err) {
                    console.error("Ошибка парсинга нового лидера:", err);
                    if (currentIsLeaderBeforeCheck) {
                        isLeaderWatch = false; stopMainCardCheckLogic(); updateFullToggleButtonState();
                    }
                    setTimeout(tryToBecomeLeaderWatch, Math.random() * 200 + 150);
                }
            }
        }
        window.addEventListener('storage', checkLeaderStorageEventWatch);
        let lastNotificationTimestamp = 0;

        // #######################################################################
        // # Слушатель (GM) для отображения уведомления о получении новой карты (даже из другой вкладки).
        // #######################################################################
        GM_addValueChangeListener(NOTIFY_NEW_CARD_KEY_WATCH, (key, oldValue, newValue, remote) => {
            if (newValue && newValue.timestamp > lastNotificationTimestamp) {
                lastNotificationTimestamp = newValue.timestamp;
                // Вызываем новую функцию для цветного уведомления
                if (typeof showCardReceivedNotification === 'function' && newValue.card) {
                    showCardReceivedNotification(newValue.card);
                } else if (newValue.message) {
                    // Резервный вариант, если что-то пойдет не так
                    safeDLEPushCall('success', newValue.message);
                }
            }
        });


        // #######################################################################
        // # Основная логика: проверяет все условия (лидерство, страница видео, хеш, паузы) и отправляет запрос на сервер для получения карты.
        // #######################################################################
        async function mainCardCheckLogic() {
            if (!scriptEnabledWatch || !isLeaderWatch) {
                if (checkNewCardTimeoutId) clearTimeout(checkNewCardTimeoutId);
                checkNewCardTimeoutId = null;
                dleHashCheckAttemptsWatch = 0;
                return;
            }
            const userHash = typeof unsafeWindow !== 'undefined' ? unsafeWindow.dle_login_hash : window.dle_login_hash;
            if (!userHash) {
                dleHashCheckAttemptsWatch++;
                if (dleHashCheckAttemptsWatch <= MAX_DLE_HASH_CHECK_ATTEMPTS_WATCH) {
                    console.warn(`dle_login_hash не найден. Попытка ${dleHashCheckAttemptsWatch}/${MAX_DLE_HASH_CHECK_ATTEMPTS_WATCH}. Следующая через ${DLE_HASH_CHECK_INTERVAL_WATCH / 1000} сек.`);
                    checkNewCardTimeoutId = setTimeout(mainCardCheckLogic, DLE_HASH_CHECK_INTERVAL_WATCH);
                } else {
                    console.error(`dle_login_hash не найден после ${MAX_DLE_HASH_CHECK_ATTEMPTS_WATCH} попыток. Авто-сбор неактивен.`);
                    safeDLEPushCall('error', 'Не удалось получить идентификатор сессии (dle_login_hash).');
                    dleHashCheckAttemptsWatch = 0;
                }
                return;
            }
            if (dleHashCheckAttemptsWatch > 0) dleHashCheckAttemptsWatch = 0;
            const hourlyPauseKey = HOURLY_PAUSE_KEY_PREFIX_WATCH + userHash;
            const currentHourMarker = new Date().toISOString().slice(0, 13);
            if (await GM_getValue(hourlyPauseKey, null) === currentHourMarker) {
                if (isLeaderWatch && !leaderFirstCheckLogDone) {
                    console.log(`Сбор карт на часовой паузе. Следующая попытка проверки через ${CHECK_NEW_CARD_INTERVAL / 1000} сек.`);
                    leaderFirstCheckLogDone = true;
                }
                if (checkNewCardTimeoutId) clearTimeout(checkNewCardTimeoutId);
                checkNewCardTimeoutId = setTimeout(mainCardCheckLogic, CHECK_NEW_CARD_INTERVAL);
                return;
            } else if (await GM_getValue(hourlyPauseKey, null) && await GM_getValue(hourlyPauseKey, null) !== currentHourMarker) {
                await GM_deleteValue(hourlyPauseKey);
                safeDLEPushCall("info", "Возобновлен авто-сбор карт.");
                leaderFirstCheckLogDone = false;
            }
            const now = Date.now();
            const globalLastRequestTime = await GM_getValue(LAST_SUCCESSFUL_REQUEST_KEY_WATCH, 0);
            const timeSinceGlobalLastRequest = now - globalLastRequestTime;
            if (timeSinceGlobalLastRequest < CHECK_NEW_CARD_INTERVAL) {
                const timeLeft = CHECK_NEW_CARD_INTERVAL - timeSinceGlobalLastRequest;
                if (isLeaderWatch && !leaderFirstCheckLogDone) {
                    console.log(`Следующий запрос на карты через ${Math.round(timeLeft / 1000)} сек.`);
                    leaderFirstCheckLogDone = true;
                }
                if (checkNewCardTimeoutId) clearTimeout(checkNewCardTimeoutId);
                checkNewCardTimeoutId = setTimeout(mainCardCheckLogic, timeLeft);
                return;
            }
            await GM_setValue(LAST_SUCCESSFUL_REQUEST_KEY_WATCH, now);
            if(isLeaderWatch) console.log("Отправка запроса на получение карты...");
            leaderFirstCheckLogDone = false;
            const currentDomain = _globalGetCurrentDomain();
            try {
                const response = await fetch(`${currentDomain}/ajax/card_for_watch/`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8','X-Requested-With': 'XMLHttpRequest','Referer': window.location.href},
                    body: new URLSearchParams({ user_hash: userHash })
                });
                if (!response.ok) {
                    console.error(`Ошибка при запросе карты, статус: ${response.status}`);
                    if (response.status >= 500 && response.status < 600) {
                        safeDLEPushCall('error', `Серверная ошибка ${response.status} при проверке карт.`);
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const responseText = await response.text();
                let jsonData;
                try {
                    jsonData = JSON.parse(responseText.startsWith("cards{") ? responseText.substring(5) : responseText);
                } catch (e) {
                    console.error('Ошибка парсинга JSON ответа:', e, responseText);
                    safeDLEPushCall("error", "Ошибка обработки ответа сервера.");
                    if (scriptEnabledWatch && isLeaderWatch) {
                        if (checkNewCardTimeoutId) clearTimeout(checkNewCardTimeoutId);
                        checkNewCardTimeoutId = setTimeout(mainCardCheckLogic, CHECK_NEW_CARD_INTERVAL);
                    }
                    return;
                }
                // #######################################################################
                // # Функция уведомлений о получении карточки
                // #######################################################################
                if (jsonData && jsonData.cards && typeof jsonData.cards === 'object' && jsonData.cards.id) {
                    const cardName = jsonData.cards.name || 'без имени';
                    console.log(`Карта "${cardName}" успешно получена!`);
                    // Изменяем payload, чтобы передать весь объект карты
                    const notificationPayload = {
                        card: jsonData.cards,
                        timestamp: Date.now()
                    };
                    await GM_setValue(NOTIFY_NEW_CARD_KEY_WATCH, notificationPayload);
                    updateCardCounter(true); // Принудительное обновление после получения карты
                } else {
                    const reason = jsonData.reason || '(причина не указана)';
                    console.log(`Карта не получена. Причина от сервера: "${reason}"`);
                }
            } catch (e) {
            } finally {
                if (isLeaderWatch) updateCardCounter(); // Обычная проверка по таймеру
                if (scriptEnabledWatch && isLeaderWatch) {
                    if (checkNewCardTimeoutId) clearTimeout(checkNewCardTimeoutId);
                    checkNewCardTimeoutId = setTimeout(mainCardCheckLogic, CHECK_NEW_CARD_INTERVAL);
                }
            }
        }

        // #######################################################################
        // # Останавливает цикл проверки/получения карт (очищает таймер).
        // #######################################################################
        function stopMainCardCheckLogic() {
            if (checkNewCardTimeoutId) {
                clearTimeout(checkNewCardTimeoutId);
                checkNewCardTimeoutId = null;
            }
        }

        // #######################################################################
        // # Инициализирует логику модуля: запускает процесс выборов лидера или останавливает всю активность, если скрипт выключен.
        // #######################################################################
        function initializeWatchScript() {
            if (scriptEnabledWatch) {
                updateCardCounter();
                tryToBecomeLeaderWatch();
            } else {
                stopMainCardCheckLogic();
                const leaderDataJSON = localStorage.getItem(LEADER_KEY_WATCH);
                if (leaderDataJSON) {
                    try {
                        const leader = JSON.parse(leaderDataJSON);
                        if (leader.id === tabIdWatch) {
                            localStorage.removeItem(LEADER_KEY_WATCH);
                            console.log("Лидерство (self) освобождено при инициализации (скрипт выключен).");
                        }
                    } catch (e) { /* молчим, если данные повреждены */ }
                }
                isLeaderWatch = false;
                if (heartbeatIntervalId) {
                    clearInterval(heartbeatIntervalId);
                    heartbeatIntervalId = null;
                }
            }
        }

        // #######################################################################
        // # Создает и настраивает 'плавающую' кнопку для включения/выключения авто-сбора карт.
        // #######################################################################
        function createToggleButtonWatch() {
            const button = document.createElement('button');
            button.id = 'toggleScriptButton';
            Object.assign(button.style, {
                position: 'fixed', bottom: '280px', right: '12px', zIndex: '100',
                fontSize: '15px', width: '40px', height: '40px',
                border: 'none', borderRadius: '50%', cursor: 'pointer',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0'
            });
            button.textContent = '🎥';
            autoCollectButtonCounter = document.createElement('span');
            autoCollectButtonCounter.id = 'toggleScriptButton_counter';
            // Стилизуем его так же, как и другие счетчики
            Object.assign(autoCollectButtonCounter.style, {
                display: 'none', position: 'absolute', top: '-1px', right: '-1px', background: 'red',
                color: 'white', borderRadius: '50%', padding: '2px 5px', fontSize: '10px',
                lineHeight: '1', minWidth: '16px', textAlign: 'center'
            });
            button.appendChild(autoCollectButtonCounter);
            if (window.location.pathname.startsWith('/pm/')) {
                button.setAttribute('data-mce-bogus', '1');
            }
            updateFullToggleButtonState(button);
            button.style.transition = 'opacity 0.3s ease, transform 0.3s ease, visibility 0s linear 0s';
            if (typeof areActionButtonsHidden !== 'undefined' && areActionButtonsHidden &&
                typeof managedButtonSelectors !== 'undefined' && managedButtonSelectors.includes('#' + button.id)) {
                button.style.opacity = '0';
                button.style.transform = 'translateX(calc(100% + 20px))';
                button.style.pointerEvents = 'none';
                button.style.transition = `opacity 0.3s ease, transform 0.3s ease, visibility 0s linear 0.3s`;
                button.style.visibility = 'hidden';
            } else {
                button.style.opacity = '1';
                button.style.transform = 'translateX(0px)';
                button.style.pointerEvents = 'auto';
                button.style.visibility = 'visible';
                button.style.transition = 'opacity 0.3s ease, transform 0.3s ease, visibility 0s linear 0s';
            }
            button.addEventListener('click', async function() {
                scriptEnabledWatch = !scriptEnabledWatch;
                localStorage.setItem(STORAGE_KEY_WATCH, scriptEnabledWatch.toString());
                updateFullToggleButtonState(button);

                if (scriptEnabledWatch) {
                    safeDLEPushCall('info', 'Авто-сбор карт включен.');

                    // --- НАЧАЛО НОВОГО БЛОКА ---
                    // Немедленно пытаемся отобразить счетчик из кэша, не дожидаясь лидера.
                    const cachedData = await GM_getValue(CARD_COUNT_CACHE_KEY, null);
                    if (cachedData && cachedData.text) {
                        console.log('Отображаю счетчик из кэша при включении.');
                        updateAllCardCountDisplays(cachedData.text, cachedData.className);
                    }
                    // --- КОНЕЦ НОВОГО БЛОКА ---

                    leaderFirstCheckLogDone = false;
                    setTimeout(tryToBecomeLeaderWatch, Math.random() * 200 + 100);
                } else {
                    safeDLEPushCall('info', "Авто-сбор карт выключен.");
                    stopMainCardCheckLogic();
                    dleHashCheckAttemptsWatch = 0;
                    if (isLeaderWatch) {
                        const currentLeaderData = localStorage.getItem(LEADER_KEY_WATCH);
                        if (currentLeaderData) {
                            try {
                                const leader = JSON.parse(currentLeaderData);
                                if (leader.id === tabIdWatch) {
                                    localStorage.removeItem(LEADER_KEY_WATCH);
                                    console.log("Лидерство освобождено при выключении скрипта кнопкой.");
                                }
                            } catch (e) { console.error("Ошибка при удалении ключа лидера при выключении", e); }
                        }
                        isLeaderWatch = false;
                    }
                    if (heartbeatIntervalId) {
                        clearInterval(heartbeatIntervalId);
                        heartbeatIntervalId = null;
                    }
                }
            });
            ['mousedown', 'mouseup', 'mouseleave'].forEach(eventType => {
                button.addEventListener(eventType, () => {
                    let currentTransformValue = 'translateX(0px)';
                    if (typeof areActionButtonsHidden !== 'undefined' && areActionButtonsHidden &&
                        typeof managedButtonSelectors !== 'undefined' && managedButtonSelectors.includes('#' + button.id)) {
                        currentTransformValue = 'translateX(calc(100% + 20px))';
                    }
                    if (eventType === 'mousedown') {
                        button.style.transform = `${currentTransformValue} translateY(2px) scale(0.95)`;
                        button.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
                    } else {
                        button.style.transform = `${currentTransformValue} translateY(0) scale(1)`;
                        button.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.7)';
                    }
                });
            });
            document.body.appendChild(button);
        }
            createToggleButtonWatch();
            initializeWatchScript();
    })();

// #######################################################################
// # Инициализирует перехватчик уведомлений и добавляет кнопки "Прочитать все".
// #######################################################################
function initializeNotificationHandler() {
    'use strict';
    // Стили для нового счетчика карт
    GM_addStyle(`
        #avw_card_counter {
            color: #fff;
            font-size: 13px;
            font-weight: bold;
            margin: 0 8px 0 0;
            padding: 4px 8px;
            border-radius: 6px;
            background-color: rgba(0, 0, 0, 0.2);
            border: 1px solid transparent;
            vertical-align: middle;
            transition: all 0.3s ease;
            cursor: help;
        }
        #avw_card_counter.limit-reached {
            color: #90ee90; /* Светло-зеленый */
            border-color: #28a745;
            text-shadow: 0 0 5px #28a745;
        }
        #avw_card_counter.in-progress {
            color: #ffcccb; /* Светло-красный */
            border-color: #dc3545;
            text-shadow: 0 0 5px #dc3545;
        }
    `);

    // =================================================================================
    // ШАГ 1: ПЕРЕХВАТ И ЗАМЕНА СТАНДАРТНОЙ ФУНКЦИИ САЙТА
    // =================================================================================
    // Проверяем наличие оригинальной функции. Если ее нет, ничего не делаем.
    if (typeof unsafeWindow.DLE_Notifications !== 'function') {
        console.warn('AssTars Card Master: Функция DLE_Notifications не найдена. Кнопка "Прочитать все" может не работать.');
        return; // Выходим, если перехватывать нечего
    }

    const original_DLE_Notifications = unsafeWindow.DLE_Notifications;

    // Перезаписываем функцию
    unsafeWindow.DLE_Notifications = function(action, id) {
        if (action === 'full_read') {
            // Используем unsafeWindow.$ для гарантии доступа к jQuery сайта
            unsafeWindow.$.post(unsafeWindow.dle_root + "engine/ajax/controller.php?mod=notifications", { action: 'full_read', user_hash: unsafeWindow.dle_login_hash }, function(data) {
                // Обновляем счетчик
                const counter = document.getElementById('MainBadgeCounter');
                if (counter) {
                    counter.textContent = '0';
                    counter.style.display = 'none';
                }
                // Очищаем выпадающий список
                const dropdownList = document.querySelector('#alertsDropdownList');
                if (dropdownList) {
                    dropdownList.querySelectorAll('.dropdown-item.d-flex2').forEach(item => item.remove());
                    const showAllLink = dropdownList.querySelector('.dropdown-item.text-center');
                    if (showAllLink && !dropdownList.querySelector('.no-notifications-msg')) {
                        const noNotificationsMsg = document.createElement('div');
                        noNotificationsMsg.className = 'no-notifications-msg';
                        noNotificationsMsg.textContent = "Новых уведомлений нет";
                        Object.assign(noNotificationsMsg.style, { textAlign: 'center', padding: '15px', color: '#888' });
                        dropdownList.insertBefore(noNotificationsMsg, showAllLink);
                    }
                }
                // Очищаем список в режиме кинотеатра
                const fscrCardsList = document.querySelector('#fscr__cards.dropdown-list');
                if (fscrCardsList) {
                    fscrCardsList.innerHTML = '';
                    const noNotificationsMsgFscr = document.createElement('div');
                    noNotificationsMsgFscr.className = 'no-notifications-msg';
                    noNotificationsMsgFscr.textContent = "Новых уведомлений нет";
                    Object.assign(noNotificationsMsgFscr.style, { textAlign: 'center', padding: '15px', color: '#888' });
                    fscrCardsList.appendChild(noNotificationsMsgFscr);
                }
            });

        } else {
            // Для всех остальных действий вызываем оригинальную функцию
            original_DLE_Notifications.apply(this, arguments);
        }
    };

    // =================================================================================
    // ШАГ 2: ДОБАВЛЕНИЕ КНОПОК И СТИЛЕЙ
    // =================================================================================
    GM_addStyle(`
        #vm-read-all-btn { display: inline-flex; align-items: center; justify-content: center; width: 33px !important; height: 33px !important; min-width: 33px !important; min-height: 33px !important; padding: 0 !important; box-sizing: border-box; flex-shrink: 0; border-radius: 50%; background-color: rgba(255, 255, 255, 0.05); color: #b0b0b0; font-size: 16px; border: none; cursor: pointer; margin-left: 8px; transition: all 0.2s; }
        #vm-read-all-btn:hover { background-color: rgba(255, 255, 255, 0.15); color: #fff; }
        .lc_buttons {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .lc_add {
            margin-right: auto;
        }
        #avw_card_counter {
            margin-right: 2px !important;
        }
        #vm-custom-buttons-container {
            display: none;
            align-items: center;
            gap: 0px;
            margin: 0 -16px;
        }
        body.fscr-active #vm-custom-buttons-container { display: inline-flex; }
        #vm-custom-buttons-container .asbm_button { padding: 0 6px !important; height: 28px !important; min-width: auto !important; border-radius: 6px !important; vertical-align: middle; font-size: 14px; }
        #vm-custom-buttons-container .asbm_button .asbm_text_label { display: none !important; }
        #vm-custom-buttons-container #vm-read-all-btn-chat { background: transparent; border: none; color: #b0b0b0; cursor: pointer; font-size: 18px; padding: 0; transition: color 0.2s; vertical-align: middle; }
        #vm-custom-buttons-container #vm-read-all-btn-chat:hover { color: #fff; }
    `);

    const handleReadAllClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (typeof unsafeWindow.DLEconfirm === 'function') {
            unsafeWindow.DLEconfirm('Вы уверены, что хотите отметить все уведомления как прочитанные?', 'Подтвердите действие', () => {
                // Вызываем нашу новую, перехваченную функцию
                unsafeWindow.DLE_Notifications('full_read');
            });
        } else {
            if (confirm('Вы уверены, что хотите отметить все уведомления как прочитанные?')) {
                unsafeWindow.DLE_Notifications('full_read');
            }
        }
    };

    const addDropdownButton = () => {
        const targetPanel = document.querySelector('#alertsDropdownList .dropdown-header .d-flex');
        if (targetPanel && !document.getElementById('vm-read-all-btn')) {
            const readAllButton = document.createElement('button');
            readAllButton.id = 'vm-read-all-btn';
            readAllButton.className = 'fal fa-check-circle';
            readAllButton.title = 'Отметить все уведомления как прочитанные';
            readAllButton.addEventListener('click', handleReadAllClick);
            targetPanel.appendChild(readAllButton);
        }
    };

    const addChatButton = () => {
        const targetContainer = document.querySelector('.lc_buttons');

        if (!targetContainer) return;
        const charCounter = targetContainer.querySelector('.lc_symb_left');
        if (!charCounter) return;
        if (document.getElementById('vm-custom-buttons-container')) return;

        const customContainer = document.createElement('div');
        customContainer.id = 'vm-custom-buttons-container';

        const username = asbm_getUsername(); // <-- Эта функция у вас есть глобально
        const myCardsUrl = username ? `/user/cards/?name=${username}` : '/user/';

        // Создаем все кнопки, как и раньше
        const cardsButton = document.createElement('a');
        cardsButton.id = 'vm-cards-btn-chat';
        cardsButton.className = 'asbm_button';
        cardsButton.href = myCardsUrl;
        cardsButton.title = 'Карты';
        cardsButton.innerHTML = `<span class="fal fa-layer-group"></span>`;

        const packsButton = document.createElement('a');
        packsButton.id = 'vm-packs-btn-chat';
        packsButton.className = 'asbm_button';
        packsButton.href = '/cards/pack/';
        packsButton.title = 'Паки';
        packsButton.innerHTML = `<span class="fal fa-box-open"></span>`;

        const tradesButton = document.createElement('a');
        tradesButton.id = 'vm-trades-btn-chat';
        tradesButton.className = 'asbm_button';
        tradesButton.href = '/trades/';
        tradesButton.title = 'Трейды';
        tradesButton.innerHTML = `<span class="fal fa-exchange-alt"></span>`;

        const readAllButtonChat = document.createElement('button');
        readAllButtonChat.id = 'vm-read-all-btn-chat';
        readAllButtonChat.className = 'fal fa-check-circle';
        readAllButtonChat.title = 'Отметить все уведомления как прочитанные';
        readAllButtonChat.addEventListener('click', handleReadAllClick);

        // Создаем и добавляем счетчик карт
        if (!document.getElementById('avw_card_counter')) {
            cardCountElement = document.createElement('span');
            cardCountElement.id = 'avw_card_counter';
            cardCountElement.textContent = '? / ?';
            cardCountElement.title = 'При получении карты и раз в 30 минут. \nНажмите для обновления. ';

            // Добавляем обработчик клика
            cardCountElement.addEventListener('click', () => {
                if (manualCardCountCheckInProgress) {
                    safeDLEPushCall('info', 'Подождите немного перед следующим обновлением.');
                    return;
                }
                manualCardCountCheckInProgress = true;

                const originalText = cardCountElement.textContent;
                cardCountElement.textContent = '...'; // Показываем загрузку

                updateCardCounter(true).then(() => {
                    // Эта часть выполнится после того, как updateCardCounter завершит свою работу
                    setTimeout(() => {
                        manualCardCountCheckInProgress = false;
                        // Если текст не обновился (например, из-за ошибки), вернем старый
                        if (cardCountElement.textContent === '...') {
                            cardCountElement.textContent = originalText;
                        }
                    }, 5000); // 5-секундная задержка
                });
            });

            customContainer.appendChild(cardCountElement);
        }

        // Добавляем их в контейнер
        customContainer.appendChild(cardsButton);
        customContainer.appendChild(packsButton);
        customContainer.appendChild(tradesButton);
        customContainer.appendChild(readAllButtonChat);

        // Вставляем контейнер в правильное место
        targetContainer.insertBefore(customContainer, charCounter);
    };

    const observer = new MutationObserver(() => {
        addDropdownButton();
        addChatButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// #######################################################################
// # Синхронизация счетчика карт между вкладками
// #######################################################################
(function() {
    'use strict';
    GM_addValueChangeListener(CARD_COUNT_SYNC_KEY, (key, oldValue, newValue, remote) => {
        // Срабатывает, когда лидер обновляет значение
        if (remote && newValue) { // Убираем проверку на cardCountElement, т.к. функция сама это сделает
            console.log('🔄 Получено обновление счетчика карт от лидера.');
            updateAllCardCountDisplays(newValue.text, newValue.className);
        }
    });
})();

    // #######################################################################
    // # Обработчик нажатия средней кнопки мыши (СКМ) на кнопке поиска дубликатов для открытия ссылки в новой фоновой вкладке.
    // #######################################################################
    document.body.addEventListener('mousedown', function(event) {
        if (event.button !== 1) {
            return;
        }
        const button = event.target.closest('button.all-owners.dubl-search-card');
        if (!button) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/window\.location\s*=\s*'([^']+)'/);
            if (match && match[1]) {
                const relativeUrl = match[1];
                const absoluteUrl = window.location.origin + relativeUrl;
                GM_openInTab(absoluteUrl, { active: false });
            }
        }
    });


    // #######################################################################
    // # Добавляет кнопку-звезду в модальное окно карты для быстрого перехода на страницу звезд.
    // #######################################################################
    function addStarButton(modalContent) {
        const metaContainer = modalContent.querySelector('.ncard__meta');
        if (!metaContainer || metaContainer.querySelector('.star-meta-item')) {
            return;
        }
        metaContainer.style.columnGap = '5px';
        const rankElement = metaContainer.querySelector('.ncard__meta-item.ncard__rank');
        if (!rankElement) {
            return;
        }
        let rank = null;
        const rankClass = Array.from(rankElement.classList).find(c => c.startsWith('rank-'));
        if (rankClass) rank = rankClass.split('-')[1];
        const nameElement = modalContent.querySelector('div.anime-cards__name');
        let cardName = null;
        if (nameElement) cardName = nameElement.textContent.trim();
        if (!rank || !cardName) return;
        const encodedName = encodeURIComponent(cardName);
        const url = `/update_stars/?rank=${rank}&search=${encodedName}`;
        const starLink = document.createElement('a');
        starLink.href = url;
        starLink.title = `Перейти на страницу звезд для "${cardName}"`;
        starLink.className = 'ncard__meta-item star-meta-item';
        const initialBorderColor = '#555';
        const hoverBackgroundColor = 'rgba(158, 41, 79, 0.9)';
        // 1. Стили для кружка-рамки в обычном состоянии
        starLink.style.display = 'flex';
        starLink.style.alignItems = 'center';
        starLink.style.justifyContent = 'center';
        starLink.style.width = '36px';
        starLink.style.height = '36px';
        starLink.style.borderRadius = '50%';
        starLink.style.textDecoration = 'none';
        starLink.style.padding = '0';
        starLink.style.boxSizing = 'border-box';
        starLink.style.backgroundColor = 'transparent';
        starLink.style.border = `1px solid ${initialBorderColor}`;
        starLink.style.transition = 'background-color 0.2s ease, border-color 0.2s ease';
        // 2. Стили для иконки звезды
        const starIcon = document.createElement('i');
        starIcon.className = 'fas fa-star';
        starIcon.style.color = 'gold';
        starIcon.style.fontSize = '20px';
        // 3. Логика подсветки
        starLink.addEventListener('mouseover', () => {
            starLink.style.backgroundColor = hoverBackgroundColor;
            starLink.style.borderColor = hoverBackgroundColor;
        });
        starLink.addEventListener('mouseout', () => {
            starLink.style.backgroundColor = 'transparent';
            starLink.style.borderColor = initialBorderColor;
        });
        starLink.appendChild(starIcon);
        metaContainer.insertBefore(starLink, rankElement);
    }
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('ui-dialog')) {
                        const modalContent = node.querySelector('#card-modal .modal__content');
                        if (modalContent) {
                            setTimeout(() => addStarButton(modalContent), 50);
                        }
                    }
                });
            }
        });
    });
    observer.observe(document.body, { childList: true });
}

// #######################################################################
// # Функция, реализующая "Настройки авто-проверки дублей"
// #######################################################################
(function() {
    'use strict';
    // --- Функции для работы с хранилищем ---
    function autoDup_loadSettings() {
        // Загружаем настройки, объединяя их с дефолтными на случай отсутствия
        return { ...defaultSettings, ...GM_getValue(AUTO_DUP_SETTINGS_KEY, {}) };
    }

    function autoDup_saveSettings(settings) {
        GM_setValue(AUTO_DUP_SETTINGS_KEY, settings);
    }
    let settingsModalWrapper = null;

    // Создает HTML-структуру окна настроек
    function createSettingsModal() {
        if (document.getElementById('autoDup_settings_modal_wrapper')) return; // Не создавать, если уже есть
        const wrapper = document.createElement('div');
        wrapper.id = 'autoDup_settings_modal_wrapper';
        wrapper.style.display = 'none';
        wrapper.innerHTML = `
        <div class="protector_backdrop"></div>
        <div class="protector_modal" id="autoDup_settings_modal">
            <div class="modal-header">
                <h2>Настройки авто-проверки дублей</h2>
                <button class="close-btn autoDup_close_modal">×</button>
            </div>
            <div class="modal-body">
                <p style="font-size: 13px; color: #999; text-align: center; margin-bottom: 15px;">Выберите ранги, которые будут автоматически проверяться на дубликаты при открытии пака.</p>
                <div id="autoDup_settings_list"></div>
                <div style="border-top: 1px solid #33353a; margin-top: 20px; padding-top: 15px; text-align: center;">
    <!-- НОВЫЙ ПОЛЗУНОК -->
    <label for="autoPackCheck_initialDelay_slider" style="display: block; font-size: 13px; color: #999; margin-bottom: 10px;">
        Задержка пока крутится анимация
    </label>
    <input type="range" id="autoPackCheck_initialDelay_slider" min="0" max="5000" step="50" style="width: 80%;">
    <div id="autoPackCheck_initialDelay_value" style="margin-top: 5px; font-weight: bold; color: #ddd; font-family: monospace;"></div>

    <!-- СТАРЫЙ ПОЛЗУНОК (с новой подписью) -->
    <label for="autoDup_delay_slider" style="display: block; font-size: 13px; color: #999; margin-bottom: 10px; margin-top: 15px;">
        Задержка между проверкой карт
    </label>
    <input type="range" id="autoDup_delay_slider" min="0" max="3000" step="50" style="width: 80%;">
    <div id="autoDup_delay_value" style="margin-top: 5px; font-weight: bold; color: #ddd; font-family: monospace;"></div>
</div>
            </div>
            <div class="modal-footer">
                <button class="action-btn save-btn autoDup_save_settings">Сохранить</button>
            </div>
        </div>`;
        document.body.appendChild(wrapper);
        settingsModalWrapper = wrapper;
        const settingsList = wrapper.querySelector('#autoDup_settings_list');
        checkableRanks.forEach(rank => {
            // Используем стили от "Защиты карт"
            settingsList.innerHTML += `
            <div class="setting-row">
                <span>Проверять дубли для ранга <b>${rank.toUpperCase()}</b></span>
                <label class="protector-toggle-switch">
                    <input type="checkbox" data-rank="${rank}">
                    <span class="protector-toggle-slider"></span>
                </label>
            </div>`;
        });
        const delaySlider = wrapper.querySelector('#autoDup_delay_slider');
        const delayValueDisplay = wrapper.querySelector('#autoDup_delay_value');
        const updateDelayDisplay = () => {
            delayValueDisplay.textContent = `${delaySlider.value} мс (${(delaySlider.value / 1000).toFixed(2)} сек)`;
        };
        delaySlider.addEventListener('input', updateDelayDisplay);
        const initialDelaySlider = wrapper.querySelector('#autoPackCheck_initialDelay_slider');
        const initialDelayValueDisplay = wrapper.querySelector('#autoPackCheck_initialDelay_value');
        const updateInitialDelayDisplay = () => {
            initialDelayValueDisplay.textContent = `${initialDelaySlider.value} мс (${(initialDelaySlider.value / 1000).toFixed(2)} сек)`;
        };
        initialDelaySlider.addEventListener('input', updateInitialDelayDisplay);
        const closeModal = () => void(wrapper.style.display = 'none');
        wrapper.querySelector('.autoDup_close_modal').onclick = closeModal;
        wrapper.querySelector('.protector_backdrop').onclick = closeModal;
        wrapper.querySelector('.autoDup_save_settings').onclick = () => {
            const newSettings = {};
            wrapper.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                newSettings[cb.dataset.rank] = cb.checked;
            });
            autoDup_saveSettings(newSettings);
            GM_setValue('autoDup_delay_ms', parseInt(wrapper.querySelector('#autoDup_delay_slider').value, 10));
            GM_setValue('autoPackCheck_initialDelay_ms', parseInt(wrapper.querySelector('#autoPackCheck_initialDelay_slider').value, 10));
            closeModal();
            if (typeof safeDLEPushCall === 'function') {
                unsafeWindow.safeDLEPushCall('success', 'Настройки авто-проверки дублей сохранены!');
            }
        };
    }

    // Открывает модальное окно и заполняет его данными
    function openSettingsModal() {
        if (!settingsModalWrapper) {
            createSettingsModal();
        }
        const settings = autoDup_loadSettings();
        settingsModalWrapper.querySelectorAll('#autoDup_settings_list input[type="checkbox"]').forEach(cb => {
            cb.checked = settings[cb.dataset.rank] === true;
        });
        const initialDelaySlider = settingsModalWrapper.querySelector('#autoPackCheck_initialDelay_slider');
        const initialDelayValueDisplay = settingsModalWrapper.querySelector('#autoPackCheck_initialDelay_value');
        initialDelaySlider.value = GM_getValue('autoPackCheck_initialDelay_ms', 600);
        initialDelayValueDisplay.textContent = `${initialDelaySlider.value} мс (${(initialDelaySlider.value / 1000).toFixed(2)} сек)`;
        const delaySlider = settingsModalWrapper.querySelector('#autoDup_delay_slider');
        const delayValueDisplay = settingsModalWrapper.querySelector('#autoDup_delay_value');
        delaySlider.value = GM_getValue('autoDup_delay_ms', 50);
        delayValueDisplay.textContent = `${delaySlider.value} мс (${(delaySlider.value / 1000).toFixed(2)} сек)`;
        settingsModalWrapper.style.display = 'block';
    }

    // Делаем функцию загрузки настроек доступной глобально внутри скрипта
    unsafeWindow.autoDup_loadSettings = autoDup_loadSettings;

    // --- Инициализация ---
    GM_registerMenuCommand("Настройки авто-проверки дублей (паки)", openSettingsModal);

    // Создаем модальное окно при загрузке страницы, но не показываем его
    if (document.readyState === 'complete') {
        createSettingsModal();
    } else {
        window.addEventListener('load', createSettingsModal);
    }

})();

// #######################################################################
// # Загружает настройки защиты из хранилища Greasemonkey.
// #######################################################################
function loadSettings() {
    return { ...PROTECTOR_DEFAULT_SETTINGS, ...GM_getValue(PROTECTOR_SETTINGS_KEY, {}) };
}

// #######################################################################
// # Сохраняет настройки защиты в хранилище Greasemonkey.
// #######################################################################
function saveSettings(settings) {
    GM_setValue(PROTECTOR_SETTINGS_KEY, settings);
}

// #######################################################################
// # Основная логика: перехватывает клик по карте в паке... (ОТКАТ К v20.0)
// #######################################################################
async function handleCardClick(event) {
    if (event.target.closest('.check-demand-btn') || event.target.closest('.check-duplicates-btn')) {
        return;
    }
    const clickedCard = event.target.closest('.lootbox__card');
    if (!clickedCard || clickedCard.dataset.confirmedClick === 'true') {
        if (clickedCard) delete clickedCard.dataset.confirmedClick;
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    const cardContainer = clickedCard.closest('.lootbox__list');
    if (!cardContainer) return;

    const allCards = cardContainer.querySelectorAll('.lootbox__card');
    let highestRankValue = 0, highestRankName = '';
    allCards.forEach(card => {
        const rank = card.dataset.rank, rankValue = PROTECTOR_RANK_HIERARCHY[rank] || 0;
        if (rankValue > highestRankValue) {
            highestRankValue = rankValue;
            highestRankName = rank;
        }
    });
    const clickedRank = clickedCard.dataset.rank;
    const clickedRankValue = PROTECTOR_RANK_HIERARCHY[clickedRank] || 0;
    const settings = loadSettings();
    const isProtectionEnabledForThisRank = settings[highestRankName.toLowerCase()];
    if (isProtectionEnabledForThisRank && clickedRankValue < highestRankValue) {
        const message = `В паке есть карта ранга <b>${highestRankName.toUpperCase()}</b>.<br>Вы уверены, что хотите выбрать карту ранга <b>${clickedRank.toUpperCase()}</b>?`;
        const confirmation = await protector_customConfirm(message);
        if (confirmation) {
            clickedCard.dataset.confirmedClick = 'true';
            clickedCard.click();
        }
    } else {
        clickedCard.dataset.confirmedClick = 'true';
        clickedCard.click();
    }
}
// #######################################################################
// # Создает и отображает кастомное модальное окно подтверждения (аналог `confirm`).
// #######################################################################
function protector_customConfirm(message) {
    return new Promise(resolve => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="protector_backdrop"></div>
            <div class="protector_modal" id="protector_confirm_modal">
                <div class="modal-header"><h2>Подтверждение</h2></div>
                <div class="modal-body"><p>${message}</p></div>
                <div class="modal-footer">
                <button class="action-btn save-btn protector_confirm_yes">Да, выбрать</button>
                    <button class="action-btn protector_confirm_no">Нет</button>

                </div>
            </div>`;
        document.body.appendChild(wrapper);

        const cleanup = () => document.body.removeChild(wrapper);
        wrapper.querySelector('.protector_confirm_yes').onclick = () => { cleanup(); resolve(true); };
        wrapper.querySelector('.protector_confirm_no').onclick = () => { cleanup(); resolve(false); };
        wrapper.querySelector('.protector_backdrop').onclick = () => { cleanup(); resolve(false); };
    });
}

window.protector_customConfirm = protector_customConfirm;

// #######################################################################
// # Создает и отображает кастомное модальное окно уведомления (аналог `alert`).
// #######################################################################
function protector_customAlert(message) {
    return new Promise(resolve => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="protector_backdrop"></div>
            <div class="protector_modal" id="protector_alert_modal">
                <div class="alert-body"><p>${message}</p></div>
                <div class="alert-footer"><button id="protector_alert_ok_btn">OK</button></div>
            </div>`;
        document.body.appendChild(wrapper);
        const closeAndCallback = () => { document.body.removeChild(wrapper); resolve(); };
        wrapper.querySelector('#protector_alert_ok_btn').onclick = closeAndCallback;
        wrapper.querySelector('.protector_backdrop').onclick = closeAndCallback;
    });
}

// #######################################################################
// # Создает HTML-структуру для модального окна настроек защиты.
// #######################################################################
function createSettingsModal() {
    const wrapper = document.createElement('div');
    wrapper.id = 'protector_settings_modal_wrapper';
    wrapper.style.display = 'none';
    wrapper.innerHTML = `
        <div class="protector_backdrop"></div>
        <div class="protector_modal" id="protector_settings_modal">
            <div class="modal-header">
                <h2>Настройки защита карт</h2>
                <button class="close-btn protector_close_modal">×</button>
            </div>
            <div class="modal-body">
                <div id="protector_settings_list"></div>
            </div>
            <div class="modal-footer">
                <button class="action-btn save-btn protector_save_settings">Сохранить</button>
            </div>
        </div>`;
    document.body.appendChild(wrapper);
    const settingsList = wrapper.querySelector('#protector_settings_list');
    PROTECTOR_PROTECTABLE_RANKS.forEach(rank => {
        settingsList.innerHTML += `
            <div class="setting-row">
                <span>Предупреждать для ранга <b>${rank.toUpperCase()}</b></span>
                <label class="protector-toggle-switch">
                    <input type="checkbox" data-rank="${rank}">
                    <span class="protector-toggle-slider"></span>
                </label>
            </div>`;
    });

     const closeModal = () => { wrapper.style.display = 'none'; };
    wrapper.querySelector('.protector_close_modal').onclick = closeModal;
    wrapper.querySelector('.protector_backdrop').onclick = closeModal;

    // --- НАЧАЛО ИЗМЕНЕНИЙ ---
    wrapper.querySelector('.protector_save_settings').onclick = () => { // Убираем async, он больше не нужен
        const newSettings = {};
        wrapper.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            newSettings[cb.dataset.rank] = cb.checked;
        });
        saveSettings(newSettings);
        closeModal();

        // Заменяем модальное окно на стандартное уведомление
        safeDLEPushCall('success', 'Настройки защиты карт успешно сохранены!');
    };
}

// #######################################################################
// # Открывает модальное окно настроек защиты и заполняет его текущими значениями.
// #######################################################################
function openSettingsModal() {
    const settings = loadSettings();
    const wrapper = document.getElementById('protector_settings_modal_wrapper');
    wrapper.querySelectorAll('#protector_settings_list input[type="checkbox"]').forEach(cb => {
        cb.checked = settings[cb.dataset.rank] === true;
    });
    wrapper.style.display = 'block';
}

// #######################################################################
// # Добавляет CSS-стили для всех UI-элементов модуля защиты (модальные окна, переключатели).
// #######################################################################
function addGlobalStyles() {
    GM_addStyle(`
        /* --- ОБЩИЕ СТИЛИ ДЛЯ ВСЕХ ОКОН --- */
        .protector_backdrop {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.75);
            z-index: 999998; /* ИСПРАВЛЕНО: Очень высокий z-index */
        }
        .protector_modal {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 400px; max-width: 90%; background: #1e1f22; color: #b0b0b0;
            border-radius: 6px; border: 1px solid #4a2f3a;
            box-shadow: 0 0 15px rgba(180, 40, 70, 0.25), 0 0 5px rgba(180, 40, 70, 0.15);
            font-family: Arial, sans-serif; display: flex; flex-direction: column;
            z-index: 999999; /* ИСПРАВЛЕНО: Очень высокий z-index */
        }
        .protector_modal .modal-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 10px 15px; border-bottom: 1px solid #33353a;
        }
        .protector_modal .modal-header h2 { margin: 0; font-size: 1em; font-weight: 500; color: #d4506a; }
        .protector_modal .close-btn { background: transparent; border: none; font-size: 22px; color: #888; cursor: pointer; transition: color 0.2s; }
        .protector_modal .close-btn:hover { color: #fff; }
        .protector_modal .modal-body { padding: 15px; background-color: #27292d; max-height: 70vh; overflow-y: auto;}
        .protector_modal .modal-footer {
            display: flex; justify-content: flex-end; align-items: center; gap: 10px;
            padding: 10px 15px; border-top: 1px solid #33353a;
        }
        .protector_modal .action-btn {
            color: #dadada; background-color: #c83a54; border: none; padding: 8px 15px;
            border-radius: 3px; cursor: pointer; font-weight: normal; font-size: 0.9em;
            transition: background-color 0.2s;
        }
        .protector_modal .action-btn:hover { background-color: #b02c44; }
        .protector_modal .action-btn.save-btn { background-color: #43b581; }
        .protector_modal .action-btn.save-btn:hover { background-color: #3aa070; }

        /* --- СТИЛИ ДЛЯ ОКНА НАСТРОЕК --- */
        #protector_settings_list { display: flex; flex-direction: column; gap: 12px; }
        #protector_settings_list .setting-row { display: flex; justify-content: space-between; align-items: center; }
        #protector_settings_list span { color: #ccc; }
        .protector-toggle-switch { position: relative; display: inline-block; width: 38px; height: 20px; }
        .protector-toggle-switch input { opacity: 0; width: 0; height: 0; }
        .protector-toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #424549; transition: .3s; border-radius: 20px; }
        .protector-toggle-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
        input:checked + .protector-toggle-slider { background-color: #43b581; }
        input:checked + .protector-toggle-slider:before { transform: translateX(18px); }

        /* --- СТИЛИ ДЛЯ ОКНА ПОДТВЕРЖДЕНИЯ --- */
        #protector_confirm_modal .modal-body p { margin: 0; line-height: 1.5; font-size: 1em; text-align: center; color: #e0e0e0; }

        /* --- СТИЛИ ДЛЯ ОКНА УВЕДОМЛЕНИЯ --- */
        #protector_alert_modal { text-align: center; padding: 20px; }
        #protector_alert_modal .alert-body p { margin: 0; line-height: 1.5; font-size: 1em; color: #e0e0e0; }
        #protector_alert_modal .alert-footer { margin-top: 20px; justify-content: center; }
        #protector_alert_ok_btn { color: #fff; background-color: #5865f2; border: none; padding: 10px 35px; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 0.9em; transition: background-color 0.2s; }
        #protector_alert_ok_btn:hover { background-color: #4752c4; }
    `);
}

// #######################################################################
// # Инициализирует модуль защиты карт: добавляет стили, создает модальное окно и вешает обработчик клика.
// #######################################################################
function init() {
    addGlobalStyles();
    createSettingsModal();
    GM_registerMenuCommand("Настройки защиты карт (паки)", openSettingsModal);
    if (window.location.pathname !== '/cards/pack/') {
        return;
    }
    document.body.addEventListener('click', handleCardClick, true);
    console.log('Скрипт защиты выбора карт успешно запущен!');
}
init();