// ==UserScript==
// @name         AnimeStars Card Master
// @namespace    AnimeStars.org
// @version      2.1
// @description  1)Показывает спрос на карты
// @description  2)Показывает дубликаты карт.
// @description  3)Отправляет карты в Не нужное.
// @description  4)Собирает карты с просмотра видео.
// @description  5)Собирает кристаллы на странице Аниме.
// @description  6)Собирает карты для анализа с других аккаунтов.
// @description  7)Автоматически вносит карты в клуб.
// @description  8)Защищает в паках от выбора менее редкого ранга.
// @description  9)Добавляет Фон.
// @description  10)Добавляет кнопку клуба.
// @description  11)Добавляет кнопки на карты в модальном окне.
// @description  12)Добавляет увеличение размеров карт на странице.
// @description  13)Добавляет на карты индикатор новизны.
// @description  14)Заменяет все стандартные сообщения сайта на кастомные.
// @description  15)Добавляет панель закладок.

// @author       Jericho

// @match        https://asstars.tv/*
// @match        https://animestars.org/*
// @match        https://astars.club/*
// @match        https://asstars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://as1.astars.club/*
// @match        https://as1.asstars.tv/*
// @match        https://as2.asstars.tv/*
// @match        https://asstars.online/*

// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @exclude      *://*/*emotions.php*
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @connect      self
// @connect      docs.google.com
// @license MIT
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/556891/AnimeStars%20Card%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/556891/AnimeStars%20Card%20Master.meta.js
// ==/UserScript==

async function runMainScript() {
// ##############################################################################################################################################
// # БЛОК ОПОВЕЩЕНИЯ ОБ ОБНОВЛЕНИИ ВЕРСИИ
// ##############################################################################################################################################
    function setGlos(name, value) {
        document.cookie = `${name}=${value}; path=/`;
    }
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i=0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    function getCurrentes() {
        const el = document.querySelector('.lgn__name span');
        return el ? el.textContent.trim() : null;
    }
    const SCRIPT_VERSION_KEY = 'ascm_script_version_v2';
    const currentVersion = GM_info.script.version;
    const lastRunVersion = await GM_getValue(SCRIPT_VERSION_KEY, null);
    if (currentVersion !== lastRunVersion) {
        const notificationEl = document.createElement('div');
        Object.assign(notificationEl.style, {
            position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
            padding: '12px 28px', color: 'white', borderRadius: '10px',
            background: 'linear-gradient(145deg, #007bff, #0056b3)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.5)', zIndex: '2147483639',
            fontSize: '15px', fontWeight: 'bold', textAlign: 'center',
            transition: 'opacity 0.5s ease',
            whiteSpace: 'pre-line'
        });
        notificationEl.textContent = 'AnimeStars Card Master\nСкрипт обновлен до версии ' + currentVersion + '!';
        document.body.appendChild(notificationEl);
        setTimeout(() => {
            notificationEl.style.opacity = '0';
            setTimeout(() => notificationEl.remove(), 500);
        }, 10000);
        console.log(`[ACM] Обнаружено обновление скрипта с версии ${lastRunVersion || 'N/A'} до ${currentVersion}.`);
        await GM_setValue(SCRIPT_VERSION_KEY, currentVersion);
    }
// ##############################################################################################################################################
// # КОНЕЦ БЛОКА ОПОВЕЩЕНИЯ ОБ ОБНОВЛЕНИИ ВЕРСИИ
// ##############################################################################################################################################


// ##############################################################################################################################################
// БЛОК ГЛОБАЛЬНЫХ ПЕРЕМЕННЫХ И НАСТРОЕК СКРИПТА!
// ##############################################################################################################################################
    // -------------------- МОДУЛЬ: ВНЕШНЯЯ БАЗА ДАННЫХ КАРТ --------------------
    const CARD_DATABASE_GIST_URL = 'https://raw.githubusercontent.com/JerichoDestory/animestars-card-db/main/animestars_cards_database.json';
    const CARD_DATABASE_KEY = 'ascm_externalCardDatabase_v1';
    const CARD_DATABASE_TTL_HOURS = 8; // Как часто обновлять базу (в часах).
    const GITHUB_CHECK_ENABLED_KEY = 'ascm_githubCheckEnabled';
    const SCRAPE_STATE_KEY = 'ascm_scrapeState';
    let cardDatabaseMap = null; // Изначально null, будет загружаться лениво
    let cardImageIndex = null;
    let isDatabaseReady = false;
    let databaseReadyPromise = null;
    const PAGE_SCAN_ENABLED_KEY = 'ascm_pageScanEnabled';
    let animeInfoTooltip = null; // Переменная для хранения элемента tooltip'а
    let lastDbUnloadLogTimestamp = 0; // Отслеживает время последнего лога о выгрузке базы

    // -------------------- МОДУЛЬ: СКАНЕР ЛИСТА ЖЕЛАНИЙ --------------------
    const WISHLIST_DB_STORE_NAME = 'wishlist_cache_v1';
    const WISHLIST_TARGET_USER_KEY = 'ascm_wishlistTargetUser_v1';
    const WISHLIST_SCAN_STATE_KEY = 'ascm_wishlistScanState_v1'; // Для хранения прогресса
    const WISHLIST_SCAN_STOP_KEY = 'ascm_wishlistScanStopFlag_v1'; // Флаг для остановки
    const WISHLIST_PRE_SCAN_TARGET_KEY = 'ascm_wishlistPreScanTarget_v1'; // Для отката
    const OWNED_CARD_GLOW_ENABLED_KEY = 'ascm_ownedCardGlowEnabled';
    const NO_S_RANK_GLOW_PACKS_KEY = 'ascm_noSRankGlow_packs_v1';
    const NO_S_RANK_GLOW_INVENTORY_KEY = 'ascm_noSRankGlow_inventory_v1';
    const NO_S_RANK_GLOW_TRADES_KEY = 'ascm_noSRankGlow_trades_v1';
    const NO_S_RANK_GLOW_CARDBASE_KEY = 'ascm_noSRankGlow_cardbase_v1';
    const NO_S_RANK_GLOW_OFFERS_KEY = 'ascm_noSRankGlow_offers_v1';
    const NO_S_RANK_GLOW_COLOR_KEY = 'ascm_noSRankGlowColor_v1';
    const DEFAULT_NO_S_RANK_GLOW_COLOR = '#ffe747'; // Стандартный желтый цвет
    const SMALL_DECK_NO_S_RANK_GLOW_COLOR_KEY = 'ascm_smallDeckNoSRankGlowColor_v1';
    const DEFAULT_SMALL_DECK_NO_S_RANK_GLOW_COLOR = '#ffffff'; // Стандартный белый цвет
    const S_RANK_DECK_GLOW_COLOR_KEY = 'ascm_sRankDeckGlowColor_v1';
    const DEFAULT_S_RANK_DECK_GLOW_COLOR = '#ff4d4d'; // Стандартный красный цвет
    const LARGE_DECK_GLOW_ENABLED_KEY = 'ascm_largeDeckGlowEnabled_v1';
    const SMALL_DECK_GLOW_ENABLED_KEY = 'ascm_smallDeckGlowEnabled_v1';
    const S_RANK_DECK_GLOW_ENABLED_KEY = 'ascm_sRankDeckGlowEnabled_v1';
    const WISHLIST_HIGHLIGHT_PACKS_ENABLED_KEY = 'ascm_wishlistHighlightPacksEnabled_v1';
    const WISHLIST_HIGHLIGHT_INVENTORY_ENABLED_KEY = 'ascm_wishlistHighlightInventoryEnabled_v1';
    const WISHLIST_HIGHLIGHT_TRADES_ENABLED_KEY = 'ascm_wishlistHighlightTradesEnabled_v1';
    const WISHLIST_PROTECTION_ENABLED_KEY = 'ascm_wishlistProtectionEnabled_v1';
    let activeWishlistSet = null; // Будет содержать Set с ID карт из списка желаний
    let isHighlightingWishlist = false;
    let isWishlistScanning = false; // Флаг для предотвращения одновременного запуска сканирования
    let unloadDbTimeoutId = null; // ID таймера для выгрузки базы из ОЗУ
    const DB_UNLOAD_DELAY_MINUTES = 1; // Через сколько минут бездействия выгружать базу

    // -------------------- ОБЩИЕ КОНСТАНТЫ --------------------
    const DELAY = 60; // Общая задержка в миллисекундах (мс), используемая в различных частях скрипта для пауз.
    const NOTIFICATION_ANIMATION_DURATION_MS = 400; // Задает длительность анимации (в мс) для появления и скрытия кастомных уведомлений.
    const CARD_CLASSES_SELECTORS = '.remelt__inventory-item, .lootbox__card, .anime-cards__item, .trade__inventory-item, .trade__main-item, .card-filter-list__card, .deck__item, .history__body-item, .card-show__placeholder, .stone__inventory-item, .card-awakening-list__card, .card-awakening-list__card__s'; // CSS-селектор, который находит все возможные DOM-элементы карточек на разных страницах.
    let lastCrystalVerificationTimestamp = 0; // Отслеживает время последней проверки
    const CRYSTAL_VERIFICATION_INTERVAL = 180000; // 180000 мс = 3 минуты

    // -------------------- ОПРЕДЕЛЕНИЕ СТРАНИЦ --------------------
    const isTradeCreationPage = () => /^\/cards\/\d+\/trade\/?$/.test(window.location.pathname);
    const isTradeOfferPage = () => window.location.pathname.startsWith('/trades/');
    const ANIME_PLAYER_BUTTON_SELECTOR = '.anime-player__fullscreen-btn';
    const ANIME_PAGE_PATH_IDENTIFIER = '/aniserials/';
    const isAnimePage = () => document.getElementById('anime-data') !== null;
    const isRemeltPage = () => window.location.pathname.startsWith('/cards_remelt/');
    const isCardBasePage = () => /^\/cards\/?($|page\/)/.test(window.location.pathname);
    const isCardPage = () => {
        const path = window.location.pathname;
        return path.startsWith('/user/cards/') || path.startsWith('/trades/') || path.startsWith('/cards/') || path.startsWith('/history/');
    };

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

    // -------------------- РАЗРЕШЕНИЕ ДЛЯ АУДИО --------------------
    let audioContext = null;
    let keepAwakeInterval = null;

    // -------------------- МОДУЛЬ: КАСТОМНЫЕ УВЕДОМЛЕНИЯ --------------------
    let currentNotificationElement = null; // Ссылка на DOM-элемент текущего активного кастомного уведомления для управления им.
    let currentNotificationTimeout = null; // ID таймера (setTimeout) для автоматического скрытия текущего уведомления. Позволяет отменять его.
    let isStickyNotificationActive = false; // Флаг для "липкого" уведомления

    // -------------------- МОДУЛЬ: АВТО-ПРОВЕРКА ПАКОВ И СПРОСА --------------------
    let autoPackCheckEnabled = localStorage.getItem('autoPackCheckEnabledState') === 'true'; // Состояние (вкл/выкл) функции автоматической проверки дубликатов на странице паков.
    let autoDemandCheckEnabled = localStorage.getItem('autoDemandCheckEnabledState') === 'true'; // Состояние (вкл/выкл) функции автоматической проверки спроса на A/S карты на странице паков.
    let autoDemandTradeEnabled = localStorage.getItem('autoDemandTradeEnabledState') === 'true'; // Состояние вкл/выкл для страниц обмена
    let lastProcessedPackIdForAutoCheck = null; // Хранит ID последнего пака, для которого была запущена авто-проверка дублей, чтобы избежать повторных запусков.
    let lastProcessedPackIdForDemandCheck = null; // Хранит ID последнего пака, для которого была запущена авто-проверка спроса, чтобы избежать повторных запусков.
    let autoPackCheckButtonElement = null; // Ссылка на DOM-элемент кнопки включения/выключения авто-проверки дублей.
    let packPageObserver = null; // Экземпляр MutationObserver, который следит за появлением новых паков на странице.
    let isProcessingBuyClick = false; // Флаг-блокировщик, который становится `true` сразу после клика на покупку пака, чтобы приостановить другие проверки.

    // -------------------- МОДУЛЬ: АВТО-ФАРМ ПАКОВ --------------------
    let autoSelectionTimeoutId = null; // ID таймера для отложенного выбора карты.
    let isAutoSelectingCard = false; // Флаг, чтобы глобальная защита игнорировала клики авто-фарма
    const AUTO_CARD_SELECTION_ENABLED_KEY = 'ascm_autoCardSelectionEnabled_v1';
    const AUTO_FARM_DELAY_BETWEEN_CLICKS_MS = 2000; // <<< ЗАДЕРЖКА В МИЛЛИСЕКУНДАХ (2000 = 2 секунды)

    // -------------------- МОДУЛЬ: МАССОВАЯ ПРОВЕРКА СПРОСА --------------------
    let isProcessCardsRunning = false; // Флаг, показывающий, что в данный момент уже запущена массовая проверка спроса.
    let shouldStopProcessCards = false; // Флаг, который устанавливается в `true`, чтобы остановить текущий цикл проверки спроса.
    let originalProcessCardsColor = ''; // Хранит исходный цвет кнопки проверки спроса, чтобы вернуть его после завершения процесса.
    let isPausedByAnotherTab = false;
    let currentDemandCheckInstanceId = 0; // Идентификатор для текущего запуска массовой проверки спроса
    const DEMAND_TASK_STACK_KEY = 'demand_check_task_stack_v2';

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
    const CRYSTAL_FORCE_CHECK_KEY = 'ascm_forceCrystalCheck'; // Ключ для "пинка" лидеру
    const CRYSTAL_PENDING_CHECK_KEY = 'ascm_crystalPendingCheck'; // Ключ для НАДЕЖНОГО запроса на проверку
    const CRYSTAL_STATE_SYNC_KEY = 'ascm_crystalStateSync';
    const CRYSTAL_RESET_BROADCAST_KEY = 'ascm_crystalResetBroadcast';

    // -------------------- МОДУЛЬ: СБОР КРИСТАЛЛОВ (СЧЕТЧИКИ И СОСТОЯНИЕ) --------------------
    const CRYSTAL_CACHE_LIMIT = 1000; // Ограничиваем кэш ID сообщений до 1000 записей
    let lastClickedIds = new Set(); // Используем Set для быстрого поиска ID (O(1) вместо O(n))
    let lastClickedQueue = []; // Очередь для отслеживания старых ID и их удаления
    let afkButtonObserver = null; // Переменная для нашего нового наблюдателя за чатом
    let clickedCrystals = 0; // Счетчик кликов по кристаллам за сессию.
    let collectedStones = 0; // Счетчик подтвержденных собранных камней за сессию.
    let soundEnabled = false; // Состояние (вкл/выкл) звукового уведомления при сборе.
    let isCrystalScriptCurrentlyRunning = false; // Запоминает, активен ли сбор прямо сейчас.
    let isProcessingReset = false; // Флаг для блокировки на время сброса
    let isVerificationScheduled = false; // Флаг, чтобы избежать дублирования таймеров проверки

    // -------------------- МОДУЛЬ: АВТО-СБОР КАРТ С ПРОСМОТРА (Auto-Watch) --------------------
    let autoCollectButtonCounter = null; // Ссылка на DOM-элемент счетчика на главной кнопке.
    let manualCardCountCheckInProgress = false; // Флаг для защиты от частых кликов по счетчику.
    const CARD_COUNT_CACHE_KEY = 'avw_cardCountCache'; // Ключ для хранения счетчика в GM.
    const CARD_COUNT_SYNC_KEY = 'avw_cardCountSync'; // <-- НОВЫЙ КЛЮЧ для синхронизации
    const CARD_COUNT_CACHE_TTL = 30 * 60 * 1000; // 30 минут - время жизни кэша счетчика.
    let cardCountElement = null; // Ссылка на DOM-элемент счетчика карт.
    let lastCardCountCheckTime = 0; // Время последней проверки счетчика карт.
    let hasLoggedPauseMessage = false;
    const CARD_COUNT_UPDATE_INTERVAL = 30 * 60 * 1000; // 30 минут для фоновой проверки.
    const STORAGE_KEY_WATCH = 'scriptEnabled'; // Ключ в localStorage для состояния вкл/выкл модуля.
    const LEADER_KEY_WATCH = 'scriptLeader_avw'; // Ключ в localStorage для определения "лидера" среди вкладок.
    const HEARTBEAT_INTERVAL_WATCH = 5000; // Интервал проверки "пульса" для не-лидеров.
    const LEADER_HEARTBEAT_INTERVAL_WATCH = 2500; // Интервал обновления "пульса" для лидера.
    const LEADER_TIMEOUT_WATCH = LEADER_HEARTBEAT_INTERVAL_WATCH * 4; // Лидер "мертв", если пропустил 4 пульса (20 секунд)
    const LEADER_CHALLENGE_KEY = 'avw_leaderChallenge'; // Ключ для "пинка"
    const LEADER_CHALLENGE_TIMEOUT = 4000; // 4 секунды на ответ лидера
    const HOURLY_PAUSE_KEY_PREFIX_WATCH = 'avw_cardCheckPaused_'; // Префикс ключа в GM для часовой паузы.
    const CHECK_NEW_CARD_INTERVAL = 192000; // Основной интервал между запросами на получение карты.
    const LAST_SUCCESSFUL_REQUEST_KEY_WATCH = 'avw_lastSuccessfulRequestTime'; // Ключ в GM для глобального таймера запросов.
    const NOTIFY_NEW_CARD_KEY_WATCH = 'avw_notifyNewCard'; // Ключ в GM для межвкладочных уведомлений о картах.
    const KICK_LEADER_TO_CHECK_KEY = 'avw_kickLeaderToCheck';
    let scriptEnabledWatch = localStorage.getItem(STORAGE_KEY_WATCH) === 'true'; // Текущее состояние (вкл/выкл) авто-сбора.
    let heartbeatIntervalId = null; // ID интервала для "пульса" лидерства.
    let checkNewCardTimeoutId = null; // ID таймаута для основного цикла проверки карт.
    let lastNotificationTimestamp = 0; // Временная метка последнего показанного уведомления о карте.
    const PAUSE_ON_LIMIT_ENABLED_KEY = 'avw_pauseOnLimitEnabled'; // Ключ для GM: включена ли функция паузы
    const COLLECTION_PAUSED_KEY = 'avw_collectionPaused'; // Ключ для GM: активна ли сейчас пауза
    const PAUSE_DATE_KEY = 'avw_pauseDate'; // Ключ для GM: дата в МСК, когда была включена пауза
    let pauseOnLimitEnabled = false; // Состояние (вкл/выкл) функции паузы при лимите карт
    let isCollectionPaused = false; // Текущее состояние паузы

    // ===== НОВЫЕ ПЕРЕМЕННЫЕ ДЛЯ НОВОГО ДНЯ =====
    const NEW_DAY_CHECK_KEY = 'ascm_lastNewDayCheckDate'; // Ключ для GM: дата последней проверки нового дня
    const AUTO_NEW_DAY_RESET_ENABLED_KEY = 'ascm_autoNewDayResetEnabled';

    // -------------------- МОДУЛЬ: НАСТРОЙКИ АВТО-ПРОВЕРКИ ДУБЛЕЙ (ПАКИ) --------------------
    const AUTO_DUP_SETTINGS_KEY = 'autoDuplicateCheckSettings_v1'; // Ключ в GM для хранения настроек.
    const checkableRanks = ['a', 'b', 'c', 'd', 'e']; // Ранги, доступные для настройки.
    const defaultSettings = { a: false, b: false, c: true, d: true, e: true }; // Настройки по умолчанию.
    let settingsModalWrapper = null; // Ссылка на DOM-элемент обертки модального окна настроек.
    let isCardInPackSelected = false; // Флаг для отслеживания выбора карты в паке

    // -------------------- МОДУЛЬ: НАСТРОЙКИ АВТО-ПРОВЕРКИ СПРОСА (ПАКИ) --------------------
    const AUTO_DEMAND_SETTINGS_KEY = 'autoDemandCheckSettings_v1';
    const checkableDemandRanks = ['ass', 'sss', 's', 'a', 'b', 'c', 'd', 'e'];
    const defaultDemandSettings = { ass: true, sss: true, s: true, a: true, b: false, c: false, d: false, e: false };

    // -------------------- МОДУЛЬ: НАСТРОЙКИ АВТО-ПРОВЕРКИ СПРОСА (ТРЕЙДЫ) --------------------
    const AUTO_DEMAND_TRADE_SETTINGS_KEY = 'autoDemandTradeSettings_v1';
    const checkableDemandTradeRanks = ['ass', 'sss', 's', 'a', 'b', 'c', 'd', 'e'];
    const defaultDemandTradeSettings = { ass: true, sss: true, s: true, a: true, b: false, c: false, d: false, e: false };

    // -------------------- МОДУЛЬ: КАСТОМНЫЕ ЗАКЛАДКИ (ASBM) --------------------
    const ASBM_FEATURE_ENABLED_KEY = 'asbm_feature_enabled'; // Ключ в GM для состояния вкл/выкл модуля.
    const ASBM_HEADER_SELECTOR = 'header.header'; // CSS-селектор шапки сайта для позиционирования панели.
    const ASBM_USER_BOOKMARKS_STORAGE_KEY = 'asbm_user_bookmarks_v13'; // Ключ в GM для хранения пользовательских закладок.
    const GO_TO_CLUBS_BTN_ENABLED_KEY = 'acm_goToClubsButtonEnabled';
    const LOCK_BUTTON_ENABLED_KEY = 'acm_lockButtonEnabled'; // Ключ для вкл/выкл кнопки блокировки
    const LEADER_LOCK_BTN_ENABLED_KEY = 'acm_leaderLockBtnEnabled';
    const STAR_BUTTON_ENABLED_KEY = 'acm_starButtonEnabled'; // Ключ для вкл/выкл кнопки-звезды
    const ASBM_RESPONSIVE_BREAKPOINT_PX = 800; // Ширина экрана, при которой скрываются текстовые метки.

    // -------------------- МОДУЛЬ: УПРАВЛЕНИЕ ВИДИМОСТЬЮ КНОПОК --------------------
    const INDIVIDUAL_DEMAND_BTN_ENABLED_KEY = 'acm_individualDemandBtnEnabled'; // Ключ для вкл/выкл кнопок спроса
    const INDIVIDUAL_DUP_BTN_ENABLED_KEY = 'acm_individualDupBtnEnabled'; // Ключ для вкл/выкл кнопок дублей
    const ACM_ANIME_INFO_BTN_ENABLED_KEY = 'ascm_animeInfoButtonEnabled'; // Ключ для вкл/выкл кнопки информации об аниме (i)
    let areActionButtonsHidden = localStorage.getItem('actionButtonsHiddenState') === 'true'; // Состояние (скрыты/показаны) боковых кнопок управления.
    const managedButtonSelectors = ['#turboBoosterBtn','#processCards', '#processAllPagesBtn', '#clearPageCacheBtn', '#readyToCharge', '#toggleScriptButton',
                                    '#promoButton', '#check-all-duplicates-btn', '#autoPackCheckButton', '#autoDemandCheckButton','#toggleCrystalScript', '#maxWidthSliderContainer', '#leaderLockButton', '#card-aggregator-toggle-btn', '#checkFreshnessBtn',];
    let toggleButtonElement = null; // Ссылка на DOM-элемент самой кнопки-переключателя видимости.

    // -------------------- МОДУЛЬ: БЛОКИРОВКА ЛИДЕРА --------------------
    const LEADER_LOCK_KEY = 'ascm_leaderLock'; // Ключ в GM_storage, где хранится ID заблокированной вкладки-лидера.
    let isLeaderManuallyLocked = false; // Локальный флаг, показывающий, что текущая вкладка является заблокированным лидером.
    let leaderLockButtonElement = null; // Ссылка на DOM-элемент кнопки-замка.

    // -------------------- МОДУЛЬ: СЛАЙДЕР ШИРИНЫ СТРАНИЦЫ --------------------
    const MAX_WIDTH_SLIDER_ENABLED_KEY = 'acm_maxWidthSliderEnabled';
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
    const PROTECTOR_RANK_HIERARCHY = { 'ass': 8, 'sss': 7, 's': 6, 'a': 5, 'b': 4, 'c': 3, 'd': 2, 'e': 1 };
    const PROTECTOR_PROTECTABLE_RANKS = ['ass', 'sss', 's', 'a', 'b', 'c', 'd'];
    const PROTECTOR_DEFAULT_SETTINGS = { ass: false, sss: false, s: false, a: true, b: false, c: false, d: false };

    // -------------------- МОДУЛЬ: ПРОВЕРКА ДУБЛИКАТОВ (ВНУТРЕННИЙ КЭШ) --------------------
    const cardInfoCache = new Map(); // Кэш для данных карт (имя, Аниме) при проверке дублей.
    const duplicatesCache = new Map(); // Кэш количества дубликатов для своего инвентаря.
    let showDuplicateCheckNotifications = true; // Флаг, разрешающий показ уведомлений при массовой проверке дублей.

    // -------------------- МОДУЛЬ: СЧЕТЧИК СООБЩЕНИЙ НА АВАТАРЕ --------------------
    const MESSAGE_BADGE_ID = 'avatar-message-badge'; // ID для элемента-счетчика на аватаре, чтобы избежать дублирования.

    // -------------------- МОДУЛЬ: ОВЕРЛЕЙ НОВИЗНЫ КАРТ --------------------
    const FRESHNESS_OVERLAY_ENABLED_KEY = 'ascm_freshnessOverlayEnabled_v1';
    const FRESHNESS_TRADE_ACTIVE_KEY = 'ascm_freshnessTradeActive_v1'; // Ключ для GM_storage
    const FRESHNESS_REMELT_ACTIVE_KEY = 'ascm_freshnessRemeltActive_v1'; // Ключ для страницы переплавки
    const FRESHNESS_PROTECTION_ENABLED_KEY = 'ascm_freshnessProtectionEnabled_v1';
    const FRESHNESS_PROTECTION_THRESHOLD_KEY = 'ascm_freshnessProtectionThreshold_v1';
    let isFreshnessCheckActive = false; // Отслеживает состояние кнопки новизны (вкл/выкл)
    const FRESHNESS_DATA_LOCAL_KEY = 'ascm_freshnessData_sharedCache'; // Изменено
    const FRESHNESS_LOCK_KEY = 'ascm_freshnessData_lock';
    let freshnessOverlayEnabled = false; // Состояние вкл/выкл модуля
    let freshnessData = null; // Здесь будут храниться min/max ID для каждого ранга
    let sessionID = null; // ID текущей сессии браузера
    // ##############################################################################################################################################
    // КОНЕЦ БЛОКА ГЛОБАЛЬНЫХ ПЕРЕМЕННЫХ И НАСТРОЕК СКРИПТА!
    // ##############################################################################################################################################

    // ##############################################################################################################################################
    // БЛОК КАСТОМНЫХ УВЕДОМЛЕНИЙ!
    // ##############################################################################################################################################
    // #######################################################################
    // # Отображает кастомное уведомление вверху экрана с заданным сообщением и типом.
    // #######################################################################
    function showNotification(message, type = 'info', isSticky = false, customBg = null) {
        if (isStickyNotificationActive && !isSticky) {
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
                position: 'fixed', left: '50%', transform: 'translateX(-50%)',
                color: 'white', padding: '12px 28px', borderRadius: '10px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.5)', zIndex: '2147483640',
                fontSize: '15px', fontWeight: 'bold', textAlign: 'center',
                maxWidth: '90%', whiteSpace: 'pre-wrap',
                transition: `top ${NOTIFICATION_ANIMATION_DURATION_MS}ms cubic-bezier(0.68, -0.55, 0.27, 1.55)`
            });
            currentNotificationElement.style.top = '-150px';
            document.body.appendChild(currentNotificationElement);
        }
        if (isSticky) isStickyNotificationActive = true;
        currentNotificationElement.textContent = String(message);
        let bgColor;
        if(customBg) {
            bgColor = customBg;
        } else {
            switch (type) {
                case 'success': bgColor = 'linear-gradient(145deg, LawnGreen, SeaGreen)'; break;
                case 'error': bgColor = 'linear-gradient(145deg, Tomato, Crimson)'; break;
                case 'warning': bgColor = 'linear-gradient(145deg, Gold, DarkOrange)'; break;
                case 'custom': bgColor = 'linear-gradient(145deg, #a35f19, #b36a1e)'; break;
                case 'info':
                default: bgColor = 'linear-gradient(145deg, DodgerBlue, RoyalBlue)'; break;
            }
        }
        currentNotificationElement.style.background = bgColor;
        currentNotificationElement.dataset.lastShowTime = Date.now().toString();
        if (currentNotificationElement.style.top !== '20px') {
            currentNotificationElement.style.transition = `top ${NOTIFICATION_ANIMATION_DURATION_MS}ms cubic-bezier(0.68, -0.55, 0.27, 1.55)`;
            currentNotificationElement.style.top = '20px';
        } else {
            currentNotificationElement.style.transition = 'opacity 0.1s ease-out';
            currentNotificationElement.style.opacity = '0.85';
            setTimeout(() => { if (currentNotificationElement) currentNotificationElement.style.opacity = '1'; }, 100);
        }
        const displayDuration = type === 'error' ? 5000 : (type === 'warning' ? 4000 : 3500);
        currentNotificationTimeout = setTimeout(() => {
            if (currentNotificationElement) {
                currentNotificationElement.style.transition = `top ${NOTIFICATION_ANIMATION_DURATION_MS}ms cubic-bezier(0.68, -0.55, 0.27, 1.55)`;
                currentNotificationElement.style.top = '-150px';
            }
            if (isSticky) isStickyNotificationActive = false;
            currentNotificationTimeout = null;
        }, displayDuration);
    }

    // #######################################################################
    // УВЕДОМЛЕНИЯ О ПОЛУЧЕННЫХ КАРТАХ (С АВТОПРОСМОТРА)
    // #######################################################################
    function showCardReceivedNotification(card) {
        if (!card || !card.rank) return;
        const rank = card.rank.toLowerCase();
        const cardName = card.name || 'без имени';
        const message = `✨ Получена карта: ${cardName} [${rank.toUpperCase()}]`;
        let bgColor;
        switch (rank) {
            case 'e': bgColor = 'rgb(156, 111, 81)'; break;
            case 'd': bgColor = 'rgb(153, 151, 151)'; break;
            case 'c': bgColor = 'rgb(11, 91, 65)'; break;
            case 'b': bgColor = 'rgb(32, 148, 228)'; break;
            case 'a': bgColor = 'rgb(217, 49, 52)'; break;
            case 's': bgColor = 'rgb(167, 76, 207)'; break;
            case 'ass': bgColor = 'rgb(119, 44, 232)'; break;
            default: bgColor = 'linear-gradient(145deg, DodgerBlue, RoyalBlue)'; break;
        }
        showNotification(message, 'custom_bg', false, bgColor);
    }

    // #######################################################################
    // УВЕДОМЛЕНИЯ О РЕДКИХ КАРТАХ
    // #######################################################################
    function showHighRankCardNotification(rank) {
        let message = '';
        let bgColor = '';
        const rankLower = rank.toLowerCase();
        if (rankLower === 'ass') {
            message = `💎 НЕВЕРОЯТНО! Вам выпала карта ранга ASS! 💎`;
            bgColor = 'linear-gradient(145deg, rgb(119, 44, 232), rgb(80, 20, 180))';
        } else if (rankLower === 's') {
            message = `🌟 ПОЗДРАВЛЯЕМ! Вам выпала карта ранга S! 🌟`;
            bgColor = 'linear-gradient(145deg, rgb(167, 76, 207), rgb(140, 60, 180))';
        } else if (rankLower === 'a') {
            message = `✨ Поздравляем! Вам выпала карта ранга A! ✨`;
            bgColor = 'linear-gradient(145deg, rgb(217, 49, 52), rgb(180, 40, 45))';
        } else {
            return;
        }
        showNotification(message, 'custom_bg', false, bgColor);
    }

    // #######################################################################
    // # API для вызова уведомлений ИЗНУТРИ СКРИПТА.
    // #######################################################################
    function getEffectiveDLEPush() {
        return {
            info: (message) => showNotification(String(message), 'info'),
            success: (message) => showNotification(String(message), 'success'),
            stickySuccess: (message) => showNotification(String(message), 'success', true),
            error: (message) => showNotification(String(message), 'error'),
            warning: (message) => showNotification(String(message), 'warning'),
            warn: (message) => showNotification(String(message), 'warning'),
            custom: (message) => showNotification(String(message), 'custom')
        };
    }

    // #######################################################################
    // # Безопасная функция-обертка для вызова уведомлений ИЗНУТРИ СКРИПТА.
    // #######################################################################
    function safeDLEPushCall(methodName, message) {
        const DLEPushAPI = getEffectiveDLEPush();
        const messageString = (message === undefined || message === null) ? `(Сообщение не определено)` : String(message);
        if (typeof DLEPushAPI[methodName] === 'function') {
            DLEPushAPI[methodName](messageString);
        } else {
            console.error(`[ACM] Критическая ошибка: DLEPushAPI.${methodName} не является функцией. Сообщение: ${messageString}`);
        }
    }
    unsafeWindow.safeDLEPushCall = safeDLEPushCall;

    // #######################################################################
    // # КОМПЛЕКСНЫЙ ПЕРЕХВАТЧИК УВЕДОМЛЕНИЙ САЙТА (2 уровня защиты)
    // #######################################################################
    function setupSiteNotificationInterceptor() {
        const handleSiteNotification = (message, type) => {
            if (!message) return;
            if (message.includes('Недостаточно камней духа')) {
                console.log('[ACM] Перехвачено сообщение о нехватке камней. Остановка авто-фарма...');
                if (typeof unsafeWindow.forceStopAutoFarm === 'function') {
                    unsafeWindow.forceStopAutoFarm('Недостаточно камней духа');
                }
            }
            if (message.includes('за первый вход за сегодня')) {
                (async () => {
                    const isPaused = await GM_getValue(COLLECTION_PAUSED_KEY, false);
                    if (isPaused) {
                        console.log('[ACM] Перехвачено уведомление о бонусе нового дня! Сбрасываю паузу сбора карт.');
                        await GM_setValue(COLLECTION_PAUSED_KEY, false);
                        await GM_deleteValue(PAUSE_DATE_KEY);
                        if (typeof unsafeWindow.updateFullToggleButtonState === 'function') {
                            unsafeWindow.updateFullToggleButtonState(document.getElementById('toggleScriptButton'));
                        }
                    }
                    await GM_setValue(KICK_LEADER_TO_CHECK_KEY, Date.now());
                })();
            }
            showNotification(message, type);
        };

        // #######################################################################
        // --- УРОВЕНЬ 1: Прямой перехват объекта DLEPush (самый быстрый) ---
        // #######################################################################
        (function overrideDLEPushObject() {
            const createOverriddenNotifier = (type) => (message) => {
                handleSiteNotification(String(message), type);
            };
            const customDLEPushMethods = {
                info: createOverriddenNotifier('info'),
                success: createOverriddenNotifier('success'),
                error: createOverriddenNotifier('error'),
                warning: createOverriddenNotifier('warning'),
                warn: createOverriddenNotifier('warning')
            };
            let dlePushTarget = (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.DLEPush === 'object' && unsafeWindow.DLEPush !== null)
            ? unsafeWindow.DLEPush
            : (typeof window.DLEPush === 'object' && window.DLEPush !== null ? window.DLEPush : null);
            if (dlePushTarget) {
                Object.assign(dlePushTarget, customDLEPushMethods);
            } else {
                const target = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
                target.DLEPush = customDLEPushMethods;
            }
        })();
        if (isAnimePage()) {
            return;
        }
        if (isAnimePage()) {
            return;
        }
        const observerTarget = document.getElementById('DLEPush');
        if (observerTarget) {
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        for (const addedNode of mutation.addedNodes) {
                            if (addedNode.nodeType !== Node.ELEMENT_NODE) continue;
                            const processNode = (node) => {
                                if (node.dataset.userscriptHidden) return;
                                node.dataset.userscriptHidden = "true";
                                Object.assign(node.style, { display: 'none', visibility: 'hidden', opacity: '0', position: 'absolute' });
                                const messageElement = node.querySelector('.DLEPush-message');
                                const message = messageElement ? messageElement.textContent.trim() : null;
                                let type = 'info';
                                if (node.classList.contains('push-success')) type = 'success';
                                else if (node.classList.contains('push-error') || node.classList.contains('push-danger')) type = 'error';
                                else if (node.classList.contains('push-warning')) type = 'warning';
                                handleSiteNotification(message, type);
                            };
                            if (addedNode.matches && addedNode.matches('.DLEPush-notification.wrapper')) {
                                processNode(addedNode);
                            }
                            else if (addedNode.querySelectorAll) {
                                addedNode.querySelectorAll('.DLEPush-notification.wrapper').forEach(processNode);
                            }
                        }
                    }
                }
            });
            observer.observe(observerTarget, { childList: true, subtree: true });
        } else {
        }
    }
    // ##############################################################################################################################################
    // Конец ФУНКЦИЯ КАСТОМНЫХ СООБЩЕНИЙ
    // ##############################################################################################################################################

    // ##############################################################################################################################################
    // БЛОК ЕДИНЫХ СТИЛЕЙ ДЛЯ ВСЕХ МОДАЛЬНЫХ ОКОН
    // ##############################################################################################################################################
    GM_addStyle(`
        .lock-meta-item[data-status="initial"]::after {
        content: '?';
        position: absolute;
        top: -2px;
        right: -3px;
        background: ;
        color: yellow;
        font-weight: bold;
        font-size: 10px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: sans-serif;
        border: 1px solid white;
        box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
        .lock-meta-item {
        position: relative;
        }
        /* --- ОБЩИЕ СТИЛИ ДЛЯ ВСЕХ ОКОН --- */
        .acm-modal-backdrop {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.75);
        z-index: 1000000 !important;
        }
        .acm-modal {
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 420px; max-width: 95%; background: #1e1f22; color: #b0b0b0;
        border-radius: 8px; border: 1px solid #4a2f3a;
        box-shadow: 0 0 15px rgba(180, 40, 70, 0.25);
        font-family: Arial, sans-serif; display: flex; flex-direction: column;
        z-index: 1000001 !important;
        max-height: 90vh;
        }
        .acm-modal .modal-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 12px 18px; border-bottom: 1px solid #33353a;
        flex-shrink: 0;
        }
        .acm-modal .modal-header h2 { margin: 0; font-size: 1.05em; font-weight: 500; color: #d4506a; }

        .acm-modal .modal-body {
        padding: 18px; background-color: #27292d;
        overflow-y: auto;
        flex: 1;
        }
        .acm-modal .modal-footer {
        display: flex !important;
        justify-content: flex-end; align-items: center; gap: 10px;
        padding: 12px 18px; border-top: 1px solid #33353a;
        background-color: #1e1f22;
        flex-shrink: 0;
        flex-wrap: wrap;
        row-gap: 8px;
        }
        .acm-modal .action-btn {
        color: #dadada; background-color: #424549; border: 1px solid #555;
        padding: 8px 18px; border-radius: 4px; cursor: pointer;
        font-weight: 500; font-size: 0.9em;
        transition: background-color 0.2s, border-color 0.2s;
        }
        .acm-modal .action-btn:hover { background-color: #52565a; border-color: #666; }
        .acm-modal .action-btn.save-btn { background-color: #43b581; border-color: #3aa070; }
        .acm-modal .action-btn.save-btn:hover { background-color: #3aa070; }
        .acm-modal .action-btn.close-btn { background-color: #c83a54; border-color: #b02c44; }
        .acm-modal .action-btn.close-btn:hover { background-color: #b02c44; }
        .acm-modal .action-btn.back-btn { margin-right: auto; }
        #cache_settings_modal .modal-footer {
        justify-content: space-between !important;
        }
        #cache_settings_modal .action-btn.back-btn {
        margin-right: 0 !important;
        }
        #ready_to_trade_settings_modal .modal-footer {
        justify-content: space-between !important;
        }
        #ready_to_trade_settings_modal .action-btn.back-btn {
        margin-right: 0 !important;
        }
        #master_settings_modal .master-setting-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
        }
        #master_settings_modal .master-settings-button {
        flex-grow: 1;
        display: flex; align-items: center; justify-content: space-between;
        width: 100%; text-align: left; background-color: #424549; color: #dadada;
        border: none; padding: 12px 15px; border-radius: 4px; cursor: pointer;
        font-size: 0.95em; margin: 0; transition: background-color 0.2s;
        }
        #master_settings_modal .master-settings-button:hover { background-color: #52565a; }
        #master_settings_modal .master-settings-button .btn-state { font-weight: bold; }
        #master_settings_modal .master-settings-button .btn-state.enabled { color: #43b581; }
        #master_settings_modal .master-settings-button .btn-state.disabled { color: #ed4245; }
        #master_settings_modal .info-icon {
        flex-shrink: 0; display: flex; align-items: center; justify-content: center;
        width: 22px; height: 22px; border: 1.5px solid #000000; color: #ffffff;
        border-radius: 50%; font-size: 12px; font-weight: 900; font-family: serif;
        cursor: help; transition: all 0.2s ease;
        }
        #master_settings_modal .info-icon:hover { background-color: #55595f; color: #fff; border-color: #fff; }
        .info-tooltip-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000002; background: transparent; }
        .info-tooltip { position: fixed; background-color: #18191c; color: #dcddde; padding: 12px; border-radius: 5px; border: 1px solid #000; box-shadow: 0 4px 10px rgba(0,0,0,0.4); font-size: 14px; line-height: 1.4; max-width: 280px; z-index: 1000003; pointer-events: auto; }
        .info-tooltip::after { content: ''; position: absolute; left: 50%; top: 100%; transform: translateX(-50%); border-width: 6px; border-style: solid; border-color: #18191c transparent transparent transparent; }
        #master_settings_modal .modal-footer {
        justify-content: center;
        }
        .acm-modal .setting-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0;}
        .acm-modal .setting-row span { color: #ccc; }
        .protector-toggle-switch { position: relative; display: inline-block; width: 38px; height: 20px; }
        .protector-toggle-switch input { opacity: 0; width: 0; height: 0; }
        .protector-toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #424549; transition: .3s; border-radius: 20px; }
        .protector-toggle-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
        input:checked + .protector-toggle-slider { background-color: #43b581; }
        input:checked + .protector-toggle-slider:before { transform: translateX(18px); }
        .acm-modal .modal-header .setting-row { padding: 0; margin: 0; }
        .acm-modal .modal-header .asbm-toggle-switch-label { font-size: 0.9em; margin-right: 10px; color: #b0b0b0; }
        #protector_confirm_modal.acm-modal .modal-body p { margin: 0; line-height: 1.5; font-size: 1em; text-align: center; color: #e0e0e0; }
        #protector_confirm_modal.acm-modal .protector_confirm_yes { background-color: #43b581; border-color: #3aa070;}
        #protector_confirm_modal.acm-modal .protector_confirm_yes:hover { background-color: #3aa070;}
        #protector_confirm_modal.acm-modal .protector_confirm_no { background-color: #c83a54; border-color: #b02c44;}
        #protector_confirm_modal.acm-modal .protector_confirm_no:hover { background-color: #b02c44;}
        `);

    // #######################################################################
    // Мощная пульсация + исправленный счетчик на кнопке сбора кристаллов
    // #######################################################################
    GM_addStyle(`
        #toggleCrystalScript {
        position: relative;
        }
        @keyframes powerful-pulse-success {
        0%, 100% {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
        }
        50% {
        box-shadow: 0 0 15px 5px rgba(100, 255, 180, 0.8);
        }
        }
        @keyframes powerful-pulse-fail {
        0%, 100% {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
        }
        50% {
        box-shadow: 0 0 15px 5px rgba(255, 80, 80, 0.8);
        }
        }
        #toggleCrystalScript.crystal-glow-success {
        animation: powerful-pulse-success 2s ease-in-out infinite;
        }
        #toggleCrystalScript.crystal-glow-fail {
        animation: powerful-pulse-fail 2s ease-in-out infinite;
        }

        /* --- Стили для счетчика --- */
        #crystal_counter {
        display: none;
        position: absolute;
        top: -1px;
        right: -3px;
        background: red;
        color: white;
        border-radius: 40%;
        padding: 2px 1px;
        font-size: 10px;
        line-height: 1;
        min-width: 15px;
        text-align: center;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        }
        `);

    // #######################################################################
    // #######################################################################
    GM_addStyle(`
        @media (hover: hover) {
        .acm-card-container .check-demand-btn,
        .acm-card-container .check-duplicates-btn,
        .acm-card-container .show-card-info-btn { /* ИЗМЕНЕНИЕ: ДОБАВЛЕН СЕЛЕКТОР */
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease;
        }
        }
        .acm-card-container:hover .check-demand-btn,
        .acm-card-container:hover .check-duplicates-btn,
        .acm-card-container:hover .show-card-info-btn { /* ИЗМЕНЕНИЕ: ДОБАВЛЕН СЕЛЕКТОР */
        opacity: 1;
        visibility: visible;
        }
        @media (hover: none) {
        .acm-card-container .check-demand-btn,
        .acm-card-container .check-duplicates-btn,
        .acm-card-container .show-card-info-btn { /* ИЗМЕНЕНИЕ: ДОБАВЛЕН СЕЛЕКТОР */
        opacity: 0.8 !important;
        visibility: visible !important;
        }
        }
        .check-demand-btn:has(.fa-spinner),
        .check-demand-btn:has(.fa-exclamation-triangle),
        .check-duplicates-btn.checked {
        opacity: 1 !important;
        visibility: visible !important;
        }
        `);

    GM_addStyle(`
        body.ascm-on-boost-page #maxWidthSliderContainer {
        bottom: 190px !important;
        }
        body.ascm-on-boost-page #leaderLockButton {
        bottom: 217px !important;
        }
        body.ascm-on-boost-page #toggleCrystalScript {
        bottom: 230px !important;
        }
        body.ascm-on-boost-page #toggleScriptButton {
        bottom: 280px !important;
        }
        body.ascm-on-boost-page #toggleActionButtonsVisibility {
        bottom: 310px !important;
        }
        body.ascm-on-boost-page #turboBoosterBtn {
        bottom: 330px !important;
        }
        `);

        GM_addStyle(`
            @keyframes acm-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
            }
            `);
        GM_addStyle(`
            .lootbox__card.wishlist-highlight-pack {
            box-shadow: 0 0 15px 5px #ffeb3b, inset 0 0 10px 2px #ffeb3b !important;
            border: 2px solid #ffd700 !important;
            outline: none !important;
            transition: none !important;
                }
            .anime-cards__item.wishlist-highlight-inventory,
            .trade__inventory-item.wishlist-highlight-inventory,
            .trade__main-item.wishlist-highlight-inventory {
                outline: 3px solid #ffd700 !important;
                outline-offset: -3px;
                transition: none !important;
            }
           .lootbox__card.wishlist-card-glow {
                    box-shadow: 0 0 15px 10px #4CAF50, inset 0 0 0px 0px #4CAF50;
                    border: 0px solid #4CAF50 !important;
                    transition: none !important;
            }
        `);
        // =================================================================================================
        // НОВЫЕ СТИЛИ ДЛЯ ВСПЛЫВАЮЩЕГО TOOLTIP'А (АКТИВАЦИЯ ПО КЛИКУ)
        // =================================================================================================
        GM_addStyle(`
            .acm-info-tooltip-popup {
                position: absolute; /* Позиционируем относительно всего документа */
                width: 250px;
                background: rgba(30, 31, 34, 0.95);
                color: #ddd;
                border: 1px solid #555;
                border-radius: 6px;
                padding: 12px 15px;
                font-size: 13px;
                line-height: 1.7;
                z-index: 2147483647; /* Максимальный z-index */
                box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                white-space: pre-wrap;
                backdrop-filter: blur(5px);
                /* Изначально скрыт и не мешает */
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease-out;
            }
            #acm-subscription-toggle-btn {
        width: auto !important;
        display: inline-block !important;
        padding: 1px 6px !important;
        font-size: 9px !important;
        height: auto !important;
        min-height: unset !important;
        line-height: 1.4 !important;
        }
        #acm-subscription-toggle-btn > i {
            font-size: 8px !important;
        }
            /* "Хвостик" или стрелочка, указывающая вниз на кнопку */
            .acm-info-tooltip-popup::before {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border-width: 8px;
                border-style: solid;
                border-color: #555 transparent transparent transparent;
            }
            /* --- НОВЫЙ СТИЛЬ ДЛЯ СВЕЧЕНИЯ --- */
            .acm-info-tooltip-popup.collection-complete-glow {
                border: 1px solid #43b581;
                box-shadow: 0 0 15px rgba(67, 181, 129, 0.5);
            }
            .acm-info-tooltip-popup.collection-incomplete-glow {
                border: 1px solid #c83a54;
                box-shadow: 0 0 15px rgba(200, 58, 84, 0.5);
            }
            .acm-info-tooltip-popup.collection-no-s-rank-glow {
                border: 1px solid #ffd700;
                box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
            }
            /* Стили для перевернутой подсказки и ее стрелки */
            .acm-info-tooltip-popup.flipped::before {
                top: auto;
                bottom: 100%;
                border-color: transparent transparent #555 transparent; /* Треугольник, указывающий вверх */
            }
            .acm-info-tooltip-popup strong.title {
                color: #d4506a;
                font-size: 1.1em;
                display: block;
                margin-bottom: 8px;
            }
            .acm-info-tooltip-popup .rank-info {
                display: block; /* Каждый ранг с новой строки */
            }
            /* Стили для всех ссылок внутри подсказки */
            .acm-info-tooltip-popup a {
                text-decoration: none;
                color: inherit; /* Наследует цвет родителя */
            }

            /* Подчеркивание при наведении для заголовка и инфо-строк */
            .acm-info-tooltip-popup a.title-link:hover .title,
            .acm-info-tooltip-popup a.info-line-link:hover {
                text-decoration: underline;
            }
     `);

    // ##############################################################################################################################################
    // БЛОК ОБЩЕГО ОКНА НАСТРОЕК
    // ##############################################################################################################################################
    unsafeWindow.openMasterSettingsModal = async function(updatedSettings = {}) {
        const MODAL_WRAPPER_ID = 'acm_modal_wrapper';
        const existingWrapper = document.getElementById(MODAL_WRAPPER_ID);
        if (existingWrapper) existingWrapper.remove();
        const wrapper = document.createElement('div');
        wrapper.id = MODAL_WRAPPER_ID;
        wrapper.innerHTML = `
            <div class="acm-modal-backdrop"></div>
            <div class="acm-modal" id="master_settings_modal">
            <div class="modal-header">
            <h2>AnimeStars Card Master - Настройки</h2>
            </div>
            <div class="modal-body" id="master_settings_body">
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_open_bg">ФОН</button>
            <span class="info-icon" data-info="Настройка фона для страниц профиля, инвентаря, трейдов и т.д.">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_open_bookmarks">ЗАКЛАДКИ</button>
            <span class="info-icon" data-info="Добавляет панель с быстрыми ссылками под шапкой сайта.">i</span>
            </div>
            <div class="master-setting-row">
                 <button class="master-settings-button" id="master_open_wishlist_settings">
                    <span>ПОДСВЕТКА КАРТ</span>
                 </button>
                 <span class="info-icon" data-info="Настройки подсветки и защиты карт из вашего и чужого списка желаний в паках, инвентарях и обменах.">i</span>
            </div>
            <div class="master-setting-row">
                <button class="master-settings-button" id="master_open_freshness_settings">
                    <span>НОВИЗНА КАРТ (ID)</span>
                </button>
                <span class="info-icon" data-info="Настройки отображения индикатора новизны и защиты новых карт в паках.">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_open_protector">ЗАЩИТА КАРТ (ПАКИ)</button>
            <span class="info-icon" data-info="Предотвращает случайный выбор дешевой карты из пака, если в нем есть более ценная.">i</span>
            </div>
            <div class="master-setting-row">
                <button class="master-settings-button" id="master_toggle_anti_blur">
                    <span>УБРАТЬ РАЗМЫТИЕ В ПАКАХ</span>
                    <span class="btn-state"></span>
                </button>
                <span class="info-icon" data-info="Убирает эффект 'размытия' (blur) с карт во время анимации их прокрутки в паке.">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_open_autodup">АВТО-ДУБЛИ (ПАКИ)</button>
            <span class="info-icon" data-info="Автоматическая проверка на дубликаты карт определенных рангов сразу после открытия пака.">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_open_autodemand_pack">АВТО-СПРОС (ПАКИ)</button>
            <span class="info-icon" data-info="Настройка авто-проверки спроса для карт, выпадающих из паков.">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_open_autodemand_trade">АВТО-СПРОС (ОБМЕНЫ)</button>
            <span class="info-icon" data-info="Настройка авто-проверки спроса для карт на страницах обменов.">i</span>
            </div>
            <div class="master-setting-row">
                <button class="master-settings-button" id="master_toggle_auto_select">
                    <span>АВТО-ФАРМ ПАКОВ</span>
                    <span class="btn-state"></span>
                </button>
                <span class="info-icon" data-info="Автоматически покупает паки (x20) и выбирает карту по приоритетам. Работает в режиме переключателя.">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_open_cache">КЭШ КАРТ</button>
            <span class="info-icon" data-info="Настройка времени хранения данных о спросе на карты.">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_open_db_settings">НАСТРОЙКИ БАЗЫ КАРТ</button>
            <span class="info-icon" data-info="Управление локальной базой данных: сканирование, импорт, экспорт и очистка.">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_open_display">ЦВЕТ И РАЗМЕР ШРИФТА (СПРОС)</button>
            <span class="info-icon" data-info="Настройка размера шрифта и иконок в блоке статистики на карточках.">i</span>
            </div>
            <div class="master-setting-row">
                <button class="master-settings-button" id="master_open_card_buttons_settings">
                    <span>Размеры кнопок на картах</span>
                </button>
                <span class="info-icon" data-info="Настройка видимости и размера кнопок информации (i), дубликатов и спроса на карточках.">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_open_ready_to_charge">
            <span>ГОТОВ ПОМЕНЯТЬ</span>
            <span class="btn-state" id="rdy_to_charge_mode_display"></span>
            </button>
            <span class="info-icon" data-info="Настройка режима для массовой отправки карт в 'Не нужное'.">i</span>
            </div>
            <div class="master-setting-row">
                <button class="master-settings-button" id="master_toggle_demand_sorting">
                    <span>СОРТИРОВКА ПО СПРОСУ</span>
                    <span class="btn-state"></span>
                </button>
                <span class="info-icon" data-info="Добавляет опцию 'По спросу' в сортировку на странице инвентаря и кнопку на странице обмена.">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_toggle_pause">
            <span>ПАУЗА СБОРА КАРТ</span>
            <span class="btn-state"></span>
            </button>
            <span class="info-icon" data-info="Автоматически ставит на паузу сбор карт с видео, когда достигнут дневной лимит.">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_toggle_new_day_reset">
            <span>АВТО-ЗАПУСК НОВОГО ДНЯ</span>
            <span class="btn-state"></span>
            </button>
            <span class="info-icon" data-info="Если авто-сбор карт стоит на паузе из-за дневного лимита, эта функция автоматически сбросит его в 00:01 по МСК. И возобновляет сбор карт.">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_toggle_slider">
            <span>СЛАЙДЕР ШИРИНЫ</span>
            <span class="btn-state"></span>
            </button>
            <span class="info-icon" data-info="Добавляет ползунок для ручной регулировки ширины контента на страницах инвентаря, профиля и т.д.">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_toggle_leader_lock_btn">
            <span>ЗАМОК ЛИДЕРА</span>
            <span class="btn-state"></span>
            </button>
            <span class="info-icon" data-info="Кнопка которая фиксирует лидера на определенной вкладке (только лидер может автоматически собирать карты/кристаллы).">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_toggle_lock_btn">
            <span>КНОПКА ФИКСАЦИИ КОЛОДЫ</span>
            <span class="btn-state"></span>
            </button>
            <span class="info-icon" data-info="Добавляет кнопку-замок в окно информации о карте для быстрой фиксации/разфиксации всей колоды.">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_toggle_star_btn">
            <span>КНОПКА ПЕРЕХОДА К ЗВЕЗДАМ</span>
            <span class="btn-state"></span>
            </button>
            <span class="info-icon" data-info="Добавляет кнопку-звезду в окно информации о карте для быстрого перехода на страницу звезд этого персонажа.">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_toggle_clubs_btn">
            <span>КНОПКА КЛУБА</span>
            <span class="btn-state"></span>
            </button>
            <span class="info-icon" data-info="Добавляет кнопку-логотип клуба 'Legendary Immortal Order' для быстрого перехода.">i</span>
            </div>
            <div class="master-setting-row">
            <button class="master-settings-button" id="master_toggle_scc_feature">
            <span>СБОРЩИК КАРТ</span>
            <span class="btn-state"></span>
            </button>
            <span class="info-icon" data-info="Собирает карты с нескольких аккаунтов и отображает в удобном интерфейсе.">i</span>
            </div>
            <button class="action-btn close-btn" id="master_settings_close_btn" style="width: 100%; margin-top: 15px; padding: 10px; font-size: 1em; display: block;">
            Закрыть
            </button>
            </div>
            </div>`;
        document.body.appendChild(wrapper);
        const READY_TO_TRADE_MODE_KEY = 'readyToTradeMode_v2';
        const SCC_FEATURE_ENABLED_KEY = 'scc_feature_enabled';
        document.getElementById('master_open_card_buttons_settings').onclick = () => {
                closeModal();
                unsafeWindow.openCardButtonSettingsModal();
            };
        const sccEnabled = await GM_getValue(SCC_FEATURE_ENABLED_KEY, false);
        const sccBtnState = wrapper.querySelector('#master_toggle_scc_feature .btn-state');
        sccBtnState.textContent = sccEnabled ? 'ВКЛ' : 'ВЫКЛ';
        sccBtnState.className = `btn-state ${sccEnabled ? 'enabled' : 'disabled'}`;
        document.getElementById('master_toggle_scc_feature').onclick = async () => {
            const newState = !(await GM_getValue(SCC_FEATURE_ENABLED_KEY, false));
            await GM_setValue(SCC_FEATURE_ENABLED_KEY, newState);
            sccBtnState.textContent = newState ? 'ВКЛ' : 'ВЫКЛ';
            sccBtnState.className = `btn-state ${newState ? 'enabled' : 'disabled'}`;
            if (typeof unsafeWindow.safeDLEPushCall === 'function') {
                unsafeWindow.safeDLEPushCall('info', `Сборщик карт ${newState ? 'включен' : 'выключен'}. Перезагрузка...`);
            }
            setTimeout(() => window.location.reload(), 1500);
        };
        document.getElementById('master_open_wishlist_settings').onclick = () => {
            closeModal();
            openWishlistSettingsModal(unsafeWindow.highlightNoSRankDecks);
        };
        const rdyToChargeMode = updatedSettings.rdyToChargeMode ?? await GM_getValue(READY_TO_TRADE_MODE_KEY, 'add_only');
        const rdyToChargeDisplay = wrapper.querySelector('#rdy_to_charge_mode_display');
        rdyToChargeDisplay.textContent = rdyToChargeMode === 'add_only' ? 'ДОБАВЛЕНИЕ' : 'С УДАЛЕНИЕМ';
        rdyToChargeDisplay.className = `btn-state enabled`;
        document.getElementById('master_open_ready_to_charge').onclick = () => {
            closeModal();
            unsafeWindow.openReadyToChargeSubModal();
        };
        const DEMAND_SORTING_ENABLED_KEY = 'acm_demandSortingEnabled';
        const demandSortingEnabled = await GM_getValue(DEMAND_SORTING_ENABLED_KEY, true);
        const demandSortingBtnState = wrapper.querySelector('#master_toggle_demand_sorting .btn-state');
        demandSortingBtnState.textContent = demandSortingEnabled ? 'ВКЛ' : 'ВЫКЛ';
        demandSortingBtnState.className = `btn-state ${demandSortingEnabled ? 'enabled' : 'disabled'}`;

        document.getElementById('master_toggle_demand_sorting').onclick = async () => {
            const newState = !(await GM_getValue(DEMAND_SORTING_ENABLED_KEY, true));
            await GM_setValue(DEMAND_SORTING_ENABLED_KEY, newState);
            demandSortingBtnState.textContent = newState ? 'ВКЛ' : 'ВЫКЛ';
            demandSortingBtnState.className = `btn-state ${newState ? 'enabled' : 'disabled'}`;
            if (typeof unsafeWindow.safeDLEPushCall === 'function') {
                unsafeWindow.safeDLEPushCall('info', `Сортировка по спросу ${newState ? 'включена' : 'выключена'}. Перезагрузка...`);
            }
            setTimeout(() => window.location.reload(), 1500);
        };
        const pauseEnabled = await GM_getValue(PAUSE_ON_LIMIT_ENABLED_KEY, true);
        const pauseBtnState = wrapper.querySelector('#master_toggle_pause .btn-state');
        pauseBtnState.textContent = pauseEnabled ? 'ВКЛ' : 'ВЫКЛ';
        pauseBtnState.className = `btn-state ${pauseEnabled ? 'enabled' : 'disabled'}`;
        const clubsBtnEnabled = await GM_getValue(GO_TO_CLUBS_BTN_ENABLED_KEY, false);
        const clubsBtnState = wrapper.querySelector('#master_toggle_clubs_btn .btn-state');
        clubsBtnState.textContent = clubsBtnEnabled ? 'ВКЛ' : 'ВЫКЛ';
        clubsBtnState.className = `btn-state ${clubsBtnEnabled ? 'enabled' : 'disabled'}`;
        const sliderEnabled = await GM_getValue(MAX_WIDTH_SLIDER_ENABLED_KEY, true);
        const sliderBtnState = wrapper.querySelector('#master_toggle_slider .btn-state');
        sliderBtnState.textContent = sliderEnabled ? 'ВКЛ' : 'ВЫКЛ';
        sliderBtnState.className = `btn-state ${sliderEnabled ? 'enabled' : 'disabled'}`;
        const ANTI_BLUR_ENABLED_KEY = 'ascm_antiBlurInPacksEnabled';
        const antiBlurEnabled = await GM_getValue(ANTI_BLUR_ENABLED_KEY, true);
        const antiBlurBtnState = wrapper.querySelector('#master_toggle_anti_blur .btn-state');
        antiBlurBtnState.textContent = antiBlurEnabled ? 'ВКЛ' : 'ВЫКЛ';
        antiBlurBtnState.className = `btn-state ${antiBlurEnabled ? 'enabled' : 'disabled'}`;
        document.getElementById('master_toggle_anti_blur').onclick = async () => {
            const newState = !(await GM_getValue(ANTI_BLUR_ENABLED_KEY, true));
            await GM_setValue(ANTI_BLUR_ENABLED_KEY, newState);
            antiBlurBtnState.textContent = newState ? 'ВКЛ' : 'ВЫКЛ';
            antiBlurBtnState.className = `btn-state ${newState ? 'enabled' : 'disabled'}`;
            if (typeof unsafeWindow.safeDLEPushCall === 'function') {
                unsafeWindow.safeDLEPushCall('info', `Отключение размытия в паках ${newState ? 'включено' : 'выключено'}. Перезагрузка...`);
            }
            setTimeout(() => window.location.reload(), 1500);
        };
        const closeModal = () => wrapper.remove();
        wrapper.querySelector('#master_settings_close_btn').onclick = closeModal;
        wrapper.querySelector('.acm-modal-backdrop').onclick = closeModal;
        document.getElementById('master_open_bg').onclick = () => { closeModal(); if (typeof unsafeWindow.toggleControlPanel === 'function') unsafeWindow.toggleControlPanel(); };
        document.getElementById('master_open_bookmarks').onclick = () => { closeModal(); if (typeof unsafeWindow.asbm_openSettingsModal === 'function') unsafeWindow.asbm_openSettingsModal(); };
        document.getElementById('master_open_cache').onclick = () => { closeModal(); if (typeof unsafeWindow.openCacheSettingsModal === 'function') unsafeWindow.openCacheSettingsModal(); };
        document.getElementById('master_open_autodup').onclick = () => { closeModal(); if (typeof unsafeWindow.autoDup_openSettingsModal === 'function') unsafeWindow.autoDup_openSettingsModal(); };
        document.getElementById('master_open_protector').onclick = () => { closeModal(); if (typeof unsafeWindow.protector_openSettingsModal === 'function') unsafeWindow.protector_openSettingsModal(); };
        document.getElementById('master_open_autodemand_pack').onclick = () => { closeModal(); if (typeof unsafeWindow.autoDemand_openSettingsModal === 'function') unsafeWindow.autoDemand_openSettingsModal(); };
        document.getElementById('master_open_autodemand_trade').onclick = () => { closeModal(); if (typeof unsafeWindow.autoDemandTrade_openSettingsModal === 'function') unsafeWindow.autoDemandTrade_openSettingsModal(); };
        document.getElementById('master_open_display').onclick = () => { closeModal(); if (typeof unsafeWindow.openDisplaySettingsModal === 'function') unsafeWindow.openDisplaySettingsModal(); };
        document.getElementById('master_toggle_clubs_btn').onclick = async () => {
            const newState = !(await GM_getValue(GO_TO_CLUBS_BTN_ENABLED_KEY, false));
            await GM_setValue(GO_TO_CLUBS_BTN_ENABLED_KEY, newState);
            clubsBtnState.textContent = newState ? 'ВКЛ' : 'ВЫКЛ';
            clubsBtnState.className = `btn-state ${newState ? 'enabled' : 'disabled'}`;
            if (typeof unsafeWindow.safeDLEPushCall === 'function') {
                unsafeWindow.safeDLEPushCall('info', `Кнопка клуба ${newState ? 'включена' : 'выключена'}. Перезагрузка...`);
            }
            setTimeout(() => window.location.reload(), 1500);
        };
        const lockBtnEnabled = await GM_getValue(LOCK_BUTTON_ENABLED_KEY, false);
        const lockBtnState = wrapper.querySelector('#master_toggle_lock_btn .btn-state');
        lockBtnState.textContent = lockBtnEnabled ? 'ВКЛ' : 'ВЫКЛ';
        lockBtnState.className = `btn-state ${lockBtnEnabled ? 'enabled' : 'disabled'}`;
        document.getElementById('master_toggle_lock_btn').onclick = async () => {
            const newState = !(await GM_getValue(LOCK_BUTTON_ENABLED_KEY, false));
            await GM_setValue(LOCK_BUTTON_ENABLED_KEY, newState);
            lockBtnState.textContent = newState ? 'ВКЛ' : 'ВЫКЛ';
            lockBtnState.className = `btn-state ${newState ? 'enabled' : 'disabled'}`;
            if (typeof unsafeWindow.safeDLEPushCall === 'function') {
                unsafeWindow.safeDLEPushCall('info', `Кнопка блокировки колоды ${newState ? 'включена' : 'выключена'}.`);
            }
        };
        const starBtnEnabled = await GM_getValue(STAR_BUTTON_ENABLED_KEY, false);
        const starBtnState = wrapper.querySelector('#master_toggle_star_btn .btn-state');
        starBtnState.textContent = starBtnEnabled ? 'ВКЛ' : 'ВЫКЛ';
        starBtnState.className = `btn-state ${starBtnEnabled ? 'enabled' : 'disabled'}`;

        document.getElementById('master_toggle_star_btn').onclick = async () => {
            const newState = !(await GM_getValue(STAR_BUTTON_ENABLED_KEY, false));
            await GM_setValue(STAR_BUTTON_ENABLED_KEY, newState);
            starBtnState.textContent = newState ? 'ВКЛ' : 'ВЫКЛ';
            starBtnState.className = `btn-state ${newState ? 'enabled' : 'disabled'}`;
            if (typeof unsafeWindow.safeDLEPushCall === 'function') {
                unsafeWindow.safeDLEPushCall('info', `Кнопка-звезда ${newState ? 'включена' : 'выключена'}.`);
            }
        };
        document.getElementById('master_toggle_pause').onclick = async () => {
            const newState = !(await GM_getValue(PAUSE_ON_LIMIT_ENABLED_KEY, true));
            await GM_setValue(PAUSE_ON_LIMIT_ENABLED_KEY, newState);
            if (newState === false) {
                console.log('Отправляю "пинок" лидеру для возобновления сбора.');
                await GM_setValue(KICK_LEADER_TO_CHECK_KEY, Date.now());
                if (isLeaderWatch) {
                    if (typeof unsafeWindow.triggerImmediateCardCheck === 'function') {
                        console.log('Запускаю проверку.');
                        unsafeWindow.triggerImmediateCardCheck();
                    }
                }
            }
            if (typeof unsafeWindow.safeDLEPushCall === 'function') {
                unsafeWindow.safeDLEPushCall('info', `Настройка паузы обновлена.`);
            }
            pauseBtnState.textContent = newState ? 'ВКЛ' : 'ВЫКЛ';
            pauseBtnState.className = `btn-state ${newState ? 'enabled' : 'disabled'}`;
        };
        document.getElementById('master_toggle_slider').onclick = async () => {
            const newState = !(await GM_getValue(MAX_WIDTH_SLIDER_ENABLED_KEY, true));
            await GM_setValue(MAX_WIDTH_SLIDER_ENABLED_KEY, newState);
            if (typeof unsafeWindow.safeDLEPushCall === 'function') {
                unsafeWindow.safeDLEPushCall('info', `Слайдер ширины ${newState ? 'включен' : 'выключен'}. Перезагрузка...`);
            }
            sliderBtnState.textContent = newState ? 'ВКЛ' : 'ВЫКЛ';
            sliderBtnState.className = `btn-state ${newState ? 'enabled' : 'disabled'}`;
            setTimeout(() => window.location.reload(), 1500);
        };
        const leaderLockBtnEnabled = await GM_getValue(LEADER_LOCK_BTN_ENABLED_KEY, true);
        const leaderLockBtnState = wrapper.querySelector('#master_toggle_leader_lock_btn .btn-state');
        leaderLockBtnState.textContent = leaderLockBtnEnabled ? 'ВКЛ' : 'ВЫКЛ';
        leaderLockBtnState.className = `btn-state ${leaderLockBtnEnabled ? 'enabled' : 'disabled'}`;
        document.getElementById('master_toggle_leader_lock_btn').onclick = async () => {
            const newState = !(await GM_getValue(LEADER_LOCK_BTN_ENABLED_KEY, true));
            await GM_setValue(LEADER_LOCK_BTN_ENABLED_KEY, newState);
            leaderLockBtnState.textContent = newState ? 'ВКЛ' : 'ВЫКЛ';
            leaderLockBtnState.className = `btn-state ${newState ? 'enabled' : 'disabled'}`;
            if (typeof unsafeWindow.safeDLEPushCall === 'function') {
                unsafeWindow.safeDLEPushCall('info', `Кнопка замка лидера ${newState ? 'включена' : 'выключена'}. Перезагрузка...`);
            }
            setTimeout(() => window.location.reload(), 1500);
        };
        wrapper.querySelector('#master_settings_body').addEventListener('click', (event) => {
            if (event.target.classList.contains('info-icon')) {
                const icon = event.target;
                if (icon.dataset.info && typeof showInfoTooltip === 'function') {
                    showInfoTooltip(icon.dataset.info, icon);
                }
            }
        });
        const newDayResetEnabled = await GM_getValue(AUTO_NEW_DAY_RESET_ENABLED_KEY, true);
        const newDayResetBtnState = wrapper.querySelector('#master_toggle_new_day_reset .btn-state');
        newDayResetBtnState.textContent = newDayResetEnabled ? 'ВКЛ' : 'ВЫКЛ';
        newDayResetBtnState.className = `btn-state ${newDayResetEnabled ? 'enabled' : 'disabled'}`;
        document.getElementById('master_toggle_new_day_reset').onclick = async () => {
            const newState = !(await GM_getValue(AUTO_NEW_DAY_RESET_ENABLED_KEY, true));
            await GM_setValue(AUTO_NEW_DAY_RESET_ENABLED_KEY, newState);
            newDayResetBtnState.textContent = newState ? 'ВКЛ' : 'ВЫКЛ';
            newDayResetBtnState.className = `btn-state ${newState ? 'enabled' : 'disabled'}`;
            if (typeof unsafeWindow.safeDLEPushCall === 'function') {
                unsafeWindow.safeDLEPushCall('info', `Авто-сброс лимита ${newState ? 'включен' : 'выключен'}.`);
            }
        };
        document.getElementById('master_open_db_settings').onclick = () => {
            closeModal();
            unsafeWindow.openDatabaseSettingsModal();
        };
        startDbUpdateTimer();
        const originalCloseModal = closeModal;
        const closeModalWithCleanup = () => {
            if (dbUpdateIntervalId) clearInterval(dbUpdateIntervalId);
            dbUpdateIntervalId = null;
            originalCloseModal();
        };
        wrapper.querySelector('#master_settings_close_btn').onclick = closeModalWithCleanup;
        wrapper.querySelector('.acm-modal-backdrop').onclick = closeModalWithCleanup;
        document.getElementById('master_open_freshness_settings').onclick = () => {
            closeModal();
            openFreshnessSettingsModal();
        };
        const autoSelectEnabled = await GM_getValue(AUTO_CARD_SELECTION_ENABLED_KEY, false);
        const autoSelectBtnState = wrapper.querySelector('#master_toggle_auto_select .btn-state');
        autoSelectBtnState.textContent = autoSelectEnabled ? 'ВКЛ' : 'ВЫКЛ';
        autoSelectBtnState.className = `btn-state ${autoSelectEnabled ? 'enabled' : 'disabled'}`;

        document.getElementById('master_toggle_auto_select').onclick = async () => {
            const newState = !(await GM_getValue(AUTO_CARD_SELECTION_ENABLED_KEY, false));
            await GM_setValue(AUTO_CARD_SELECTION_ENABLED_KEY, newState);
            autoSelectBtnState.textContent = newState ? 'ВКЛ' : 'ВЫКЛ';
            autoSelectBtnState.className = `btn-state ${newState ? 'enabled' : 'disabled'}`;
            if (typeof unsafeWindow.safeDLEPushCall === 'function') {
                unsafeWindow.safeDLEPushCall('info', `Авто-фарм паков ${newState ? 'включен' : 'выключен'}. Перезагрузите страницу с паками.`);
            }
            setTimeout(() => window.location.reload(), 1500);
        };
    }

    // ##############################################################################################################################################
    // # КОНЕЦ БЛОКА ОКНА НАСТРОЕК
    // ##############################################################################################################################################

    // ##############################################################################################################################################
    // # БЛОК: МОДАЛЬНОЕ ОКНО НАСТРОЕК КНОПОК НА КАРТАХ
    // ##############################################################################################################################################
    unsafeWindow.openCardButtonSettingsModal = async function() {
        const INFO_BTN_SIZE_KEY = 'acm_infoButtonSizeFactor';
        const DEMAND_BTN_SIZE_KEY = 'acm_demandButtonSizeFactor';
        const DUP_BTN_SIZE_KEY = 'acm_dupButtonSizeFactor';
        const isInfoEnabled = await GM_getValue(ACM_ANIME_INFO_BTN_ENABLED_KEY, true);
        const isDemandEnabled = await GM_getValue(INDIVIDUAL_DEMAND_BTN_ENABLED_KEY, true);
        const isDupEnabled = await GM_getValue(INDIVIDUAL_DUP_BTN_ENABLED_KEY, true);
        const infoSizeFactor = await GM_getValue(INFO_BTN_SIZE_KEY, 0.12);
        const demandSizeFactor = await GM_getValue(DEMAND_BTN_SIZE_KEY, 0.13);
        const dupSizeFactor = await GM_getValue(DUP_BTN_SIZE_KEY, 0.13);
        const MODAL_WRAPPER_ID = 'acm_modal_wrapper';
        if (document.getElementById(MODAL_WRAPPER_ID)) return;
        const wrapper = document.createElement('div');
        wrapper.id = MODAL_WRAPPER_ID;
        wrapper.innerHTML = `
            <div class="acm-modal-backdrop"></div>
            <div class="acm-modal" id="card_button_settings_modal" style="width: 500px;">
                <div class="modal-header">
                    <h2>Настройки кнопок на картах</h2>
                </div>
                <div class="modal-body" style="display: flex; flex-direction: column; gap: 20px;">
                    <!-- Секция кнопки Информации (i) -->
                    <div class="setting-section" style="border-bottom: 1px solid #33353a; padding-bottom: 15px;">
                        <div class="setting-row">
                            <span>Кнопка Информации (i)</span>
                            <label class="protector-toggle-switch">
                                <input type="checkbox" id="info-btn-enable-toggle" ${isInfoEnabled ? 'checked' : ''}>
                                <span class="protector-toggle-slider"></span>
                            </label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                            <label style="font-size: 0.9em; color: #ccc; flex-basis: 120px;">Размер (% ширины):</label>
                            <input type="range" class="size-slider" data-target="info" min="8" max="20" step="1" value="${infoSizeFactor * 100}" style="flex-grow: 1;">
                            <span class="size-display" id="info-size-display">${Math.round(infoSizeFactor * 100)}%</span>
                        </div>
                    </div>
                    <!-- Секция кнопки Спроса -->
                    <div class="setting-section" style="border-bottom: 1px solid #33353a; padding-bottom: 15px;">
                        <div class="setting-row">
                            <span>Кнопка Спроса (<i class="fas fa-chart-line"></i>)</span>
                            <label class="protector-toggle-switch">
                                <input type="checkbox" id="demand-btn-enable-toggle" ${isDemandEnabled ? 'checked' : ''}>
                                <span class="protector-toggle-slider"></span>
                            </label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                            <label style="font-size: 0.9em; color: #ccc; flex-basis: 120px;">Размер (% ширины):</label>
                            <input type="range" class="size-slider" data-target="demand" min="8" max="20" step="1" value="${demandSizeFactor * 100}" style="flex-grow: 1;">
                            <span class="size-display" id="demand-size-display">${Math.round(demandSizeFactor * 100)}%</span>
                        </div>
                    </div>
                    <!-- Секция кнопки Дубликатов -->
                    <div class="setting-section">
                        <div class="setting-row">
                            <span>Кнопка Дубликатов (🔍)</span>
                            <label class="protector-toggle-switch">
                                <input type="checkbox" id="dup-btn-enable-toggle" ${isDupEnabled ? 'checked' : ''}>
                                <span class="protector-toggle-slider"></span>
                            </label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                            <label style="font-size: 0.9em; color: #ccc; flex-basis: 120px;">Размер (% ширины):</label>
                            <input type="range" class="size-slider" data-target="dup" min="8" max="20" step="1" value="${dupSizeFactor * 100}" style="flex-grow: 1;">
                            <span class="size-display" id="dup-size-display">${Math.round(dupSizeFactor * 100)}%</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="justify-content: space-between !important;">
                    <button id="card-buttons-back-btn" class="action-btn back-btn">Назад</button>
                    <button id="card-buttons-save-btn" class="action-btn save-btn">Сохранить</button>
                </div>
            </div>`;
        document.body.appendChild(wrapper);
        const closeModal = () => wrapper.remove();
        wrapper.querySelectorAll('.size-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const targetId = e.target.dataset.target;
                const display = document.getElementById(`${targetId}-size-display`);
                if (display) {
                    display.textContent = `${e.target.value}%`;
                }
            });
        });
        wrapper.querySelector('#card-buttons-back-btn').onclick = () => {
            closeModal();
            unsafeWindow.openMasterSettingsModal();
        };
        wrapper.querySelector('#card-buttons-save-btn').onclick = async () => {
            const promises = [];
            promises.push(GM_setValue(ACM_ANIME_INFO_BTN_ENABLED_KEY, document.getElementById('info-btn-enable-toggle').checked));
            promises.push(GM_setValue(INDIVIDUAL_DEMAND_BTN_ENABLED_KEY, document.getElementById('demand-btn-enable-toggle').checked));
            promises.push(GM_setValue(INDIVIDUAL_DUP_BTN_ENABLED_KEY, document.getElementById('dup-btn-enable-toggle').checked));
            promises.push(GM_setValue(INFO_BTN_SIZE_KEY, parseFloat(wrapper.querySelector('[data-target="info"]').value) / 100));
            promises.push(GM_setValue(DEMAND_BTN_SIZE_KEY, parseFloat(wrapper.querySelector('[data-target="demand"]').value) / 100));
            promises.push(GM_setValue(DUP_BTN_SIZE_KEY, parseFloat(wrapper.querySelector('[data-target="dup"]').value) / 100));
            await Promise.all(promises);
            closeModal();
            safeDLEPushCall('success', 'Настройки кнопок сохранены! Перезагрузка...');
            setTimeout(() => window.location.reload(), 1500);
        };
        wrapper.querySelector('.acm-modal-backdrop').onclick = closeModal;
    }

    // #######################################################################
    // # Гарантированное удаление флага обновления при закрытии/перезагрузке вкладки
    // #######################################################################
    window.addEventListener('beforeunload', async () => {
        const UPDATE_FLAG_KEY = 'ascm_db_update_in_progress';
        const updateInfo = await GM_getValue(UPDATE_FLAG_KEY, null);
        if (updateInfo && updateInfo.tabId === unsafeWindow.tabIdWatch) {
            await GM_deleteValue(UPDATE_FLAG_KEY);
            console.log('[Card DB] Флаг обновления очищен перед уходом со страницы.');
        }
    });

    // ##############################################################################################################################################
    // # БЛОК ТАЙМЕРА ОБНОВЛЕНИЯ БАЗЫ ДАННЫХ
    // ##############################################################################################################################################
    let dbUpdateIntervalId = null;
    async function updateDbButtonTimer() {
        const btn = document.getElementById('master_open_db_settings');
        if (!btn) {
            if (dbUpdateIntervalId) clearInterval(dbUpdateIntervalId);
            dbUpdateIntervalId = null;
            return;
        }
        const LAST_DB_UPDATE_KEY = 'ascm_db_last_update_ts';
        const lastUpdateTime = await GM_getValue(LAST_DB_UPDATE_KEY, 0);
        const now = Date.now();
        const ttlMs = CARD_DATABASE_TTL_HOURS * 3600 * 1000;
        const nextUpdateTime = lastUpdateTime + ttlMs;
        const timeLeftMs = nextUpdateTime - now;
        if (timeLeftMs > 0) {
            const hours = Math.floor(timeLeftMs / (3600 * 1000));
            const minutes = Math.floor((timeLeftMs % (3600 * 1000)) / (60 * 1000));
            const seconds = Math.floor((timeLeftMs % (60 * 1000)) / 1000);
            const hStr = hours.toString().padStart(2, '0');
            const mStr = minutes.toString().padStart(2, '0');
            const sStr = seconds.toString().padStart(2, '0');
            btn.innerHTML = `<span>ОБНОВЛЕНИЕ БАЗЫ КАРТ</span> <span style="color: #999; font-size: 0.9em;">(${hStr}:${mStr}:${sStr})</span>`;
        } else {
            btn.innerHTML = `<span>ОБНОВЛЕНИЕ БАЗЫ КАРТ</span> <span style="color: #43b581; font-size: 0.9em;">(Обновите!)</span>`;
            if (dbUpdateIntervalId) clearInterval(dbUpdateIntervalId);
            dbUpdateIntervalId = null;
        }
    }
    // #######################################################################
    // #######################################################################
    function startDbUpdateTimer() {
        if (dbUpdateIntervalId) clearInterval(dbUpdateIntervalId);
        updateDbButtonTimer();
        dbUpdateIntervalId = setInterval(updateDbButtonTimer, 1000);
    }
    // ##############################################################################################################################################
    // # КОНЕЦ БЛОКА ТАЙМЕРА ОБНОВЛЕНИЯ БАЗЫ ДАННЫХ
    // ##############################################################################################################################################

    // #######################################################################
    // Показывает кастомную подсказку над элементом.
    // #######################################################################
    function showInfoTooltip(text, targetElement) {
        const closeTooltip = () => {
            document.querySelector('.info-tooltip-backdrop')?.remove();
            document.querySelector('.info-tooltip')?.remove();
        };
        closeTooltip();
        const backdrop = document.createElement('div');
        backdrop.className = 'info-tooltip-backdrop';
        const tooltip = document.createElement('div');
        tooltip.className = 'info-tooltip';
        tooltip.innerHTML = text;
        document.body.appendChild(backdrop);
        document.body.appendChild(tooltip);
        const targetRect = targetElement.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
        let top = targetRect.top - tooltipRect.height - 10;
        if (left < 10) {
            left = 10;
        }
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        backdrop.addEventListener('click', closeTooltip);
    }
    GM_registerMenuCommand("Настройки скрипта ⚙️", unsafeWindow.openMasterSettingsModal);

    // #######################################################################
    // СТИЛИ ДЛЯ СЧЕТЧИКА СООБЩЕНИЙ НА АВАТАРЕ
    // #######################################################################
    GM_addStyle(`
        .header__ava {
        position: relative !important;
        }
        #${MESSAGE_BADGE_ID} {
        position: absolute;
        top: -6px;
        right: -6px;
        z-index: 10;
        min-width: 15px;
        height: 15px;
        padding: 0 4px;
        border-radius: 50%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Manrope', sans-serif;
        font-size: 9px;
        font-weight: 430;
        letter-spacing: 0.02em;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-synthesis: none;
        line-height: 1;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        background-color: var(--accent, #9e294f);
        vertical-align: baseline;
        }
        `);

    // #######################################################################
    // # Инициализирует модуль счетчика сообщений (гибридный подход)
    // #######################################################################
    function initMessageCounterModule() {
        const updateAvatarBadge = (count) => {
            const avatarContainer = document.querySelector('.header__ava.js-show-login');
            if (!avatarContainer) return;
            let badge = document.getElementById(MESSAGE_BADGE_ID);
            if (count > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.id = MESSAGE_BADGE_ID;
                    avatarContainer.appendChild(badge);
                }
                badge.textContent = count;
            } else {
                if (badge) badge.remove();
            }
        };
        const performInitialDomCheck = () => {
            const messageElement = document.querySelector('.lgn__menu a[href="/pm/"] span:last-of-type');
            if (messageElement) {
                const messageText = messageElement.textContent || '';
                const match = messageText.match(/\((\d+)\)/);
                const messageCount = match ? parseInt(match[1], 10) : null;

                if (messageCount !== null) {
                    updateAvatarBadge(messageCount);
                    return true;
                }
            }
            return false;
        };
        const originalXhrSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(...args) {
            this.addEventListener("load", () => {
                if (this.responseURL && this.responseURL.includes("mod=notifications")) {
                    try {
                        const response = JSON.parse(this.responseText);
                        if (response && typeof response.new_pm !== 'undefined') {
                            updateAvatarBadge(parseInt(response.new_pm, 10));
                        }
                    } catch (e) { /* Игнорируем ошибки */ }
                }
            });
            return originalXhrSend.apply(this, args);
        };
        if (!performInitialDomCheck()) {
            let attempts = 0;
            const maxAttempts = 20;
            const intervalId = setInterval(() => {
                attempts++;
                if (performInitialDomCheck() || attempts >= maxAttempts) {
                    clearInterval(intervalId);
                }
            }, 500);
        }
    }

    // #######################################################################
    // ПРЕВЕНТИВНЫЙ ФИКСЕР ПЛЕЕРА (COOKIE + NO_DATA)
    // #######################################################################
    (function() {
        'use strict';
        const isAnimePageByURL = /^\/\d+-[a-z0-9-]+\.html$/.test(window.location.pathname);
        if (!isAnimePageByURL) {
            return;
        }
        const currentCookie = document.cookie;
        const isNewPlayerSelectedInCookie = currentCookie.includes('dle_player_fhd=cdn-tab-player');
        let pageReloaded = false;
        const observer = new MutationObserver(() => {
            const newPlayerTab = document.querySelector('.new-cdn-player');
            const kodikPlayerTab = document.getElementById('kodik-tab');
            if (kodikPlayerTab) {
                if (!newPlayerTab && isNewPlayerSelectedInCookie) {
                    console.warn('Cookie указывает на Новый плеер, но его нет на странице. Исправляю и перезагружаю...');
                    document.cookie = "dle_player_kodik=kodik-tab-player; path=/";
                    document.cookie = "dle_player_fhd=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                    pageReloaded = true;
                    window.location.reload();
                }
                observer.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
        document.addEventListener('DOMContentLoaded', () => {
            if (pageReloaded) return;

            const playerElement = document.getElementById('myPlayer');
            if (playerElement) {
                const noDataHandler = () => {
                    console.warn('Плеер неисправен.');
                    const kodikTab = document.getElementById('kodik-tab');
                    if (kodikTab && !kodikTab.classList.contains('is-active')) {
                        console.log('Принудительно переключаюсь на "Кодик плеер".');
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

    // #######################################################################
    // Глобальные стили для режима кинотеатра (fscr-active)
    // #######################################################################
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
        body.fscr-active #toggleActionButtonsVisibility,
        body.fscr-active #leaderLockButton {
        z-index: 100001 !important;
        }
        body.fscr-active #leaderLockButton { top: auto !important; bottom: 136px !important; }
        body.fscr-active #toggleScriptButton { top: auto !important; bottom: 200px !important; }
        body.fscr-active #toggleCrystalScript { top: auto !important; bottom: 150px !important; }
        body.fscr-active #toggleActionButtonsVisibility { top: auto !important; bottom: 310px !important; }
        `);

    // ##############################################################################################################################################
    // БЛОК ДЛЯ AS CARD CONTROL (ПРЕВЬЮ)
    // ##############################################################################################################################################
    if (isTradePreviewIframe && window.innerWidth >= 500) {
        GM_addStyle(`
        .trade__main-item {
            width: 135px !important;
        }
        .trade__main-item .acm-card-stats {
            padding: 5px !important;
            bottom: 2px !important;
            left: 2px !important;
            right: 2px !important;
        }
        .trade__main-item .acm-card-stats span {
            padding: 0 2px !important;
        }
        .trade__main-item .acm-card-stats i {
            font-size: 10px !important;
        }
        .trade__main-item .acm-card-stats span > span {
            font-size: 11px !important;
        }
        #check-all-duplicates-btn {
            bottom: 220px !important;
        }
        body, .wrapper-as { background: transparent !important; }
        .wrapper-as { padding-top: 0 !important; }
        .header, footer.footer, .speedbar, .ncard-list, #asbm_bar, .cbtns,
        #notebookToggleButton, #deckToggleBtn, #maxWidthSliderContainer,
        #bg-control-panel, #toggleCrystalScript,
        #toggleActionButtonsVisibility, #toggleScriptButton, #leaderLockButton,
        #card-aggregator-toggle-btn {
            display: none !important;
        }
    `);
    }
    if (window.self === window.top || isTradePreviewIframe) {
    // ##############################################################################################################################################
    // КОНЕЦ БЛОКА ДЛЯ AS CARD CONTROL (ПРЕВЬЮ)
    // ##############################################################################################################################################

    // ##############################################################################################################################################
    // # БЛОК СТИЛЕЙ ДЛЯ КНОПКИ ПОИСКА КАРТ У ПОЛЬЗОВАТЕЛЯ
    // ##############################################################################################################################################
    GM_addStyle(`
        a.card-show__owner {
            position: relative; /* Необходимо для позиционирования кнопки внутри */
        }
        .rank-search-btn {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 22px;
            height: 22px;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            border: 1px solid rgba(255, 255, 255, 0.5);
            transition: opacity 0.2s, transform 0.2s;
            z-index: 2;
        }
        .rank-search-btn:hover {
            opacity: 0.8;
            transform: scale(1.1);
        }
        .rank-search-btn i {
            font-size: 12px;
        }
    `);
        // #######################################################################
        // # Добавляет кнопки для поиска карт определенного ранга у пользователей
        // #######################################################################
        async function addRankSearchButtonsToUserLinks() {
            const pathname = window.location.pathname;
            const isRelevantPage = pathname.includes('/cards/users/need/') || pathname.includes('/cards/users/trade/');
            if (!isRelevantPage) return;
            const cardId = new URLSearchParams(window.location.search).get('id');
            if (!cardId) return;
            await ensureDbLoaded();
            if (!cardDatabaseMap || cardDatabaseMap.size === 0) return;
            const cardData = cardDatabaseMap.get(cardId);
            if (!cardData || !cardData.rank) {
                return;
            }
            const cardRank = cardData.rank.toLowerCase();
            const rankColors = {
                e: 'rgb(156, 111, 81)', d: 'rgb(160, 155, 145)', c: 'rgb(1, 145, 69)',
                b: 'rgb(32, 148, 228)', a: 'rgb(217, 49, 52)', s: 'rgb(167, 76, 207)',
                ass: 'rgb(119, 44, 232)', sss: 'rgb(207, 207, 207)'
            };
            const buttonColor = rankColors[cardRank] || '#6c757d';
            const userLinks = document.querySelectorAll('a.card-show__owner');
            userLinks.forEach(userLink => {
                if (userLink.querySelector('.rank-search-btn')) return;
                const usernameMatch = userLink.href.match(/\/user\/([^/]+)\/?$/);
                if (!usernameMatch || !usernameMatch[1]) return;
                const username = decodeURIComponent(usernameMatch[1]);
                const searchLink = document.createElement('a');
                searchLink.href = `/user/cards/?name=${username}&rank=${cardRank}&locked=0`;
                searchLink.title = `Найти разблокированные ${cardRank.toUpperCase()}-карты у пользователя ${username}`;
                searchLink.className = 'rank-search-btn';
                searchLink.style.backgroundColor = buttonColor;
                searchLink.innerHTML = '<i class="fal fa-search"></i>';
                searchLink.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.location.href = searchLink.href;
                });
                userLink.appendChild(searchLink);
            });
        }

        // #######################################################################
        // --- Утилиты для работы с IndexedDB ---
        // #######################################################################
        const DB_NAME = 'ASCM_CardDatabase';
        const DB_VERSION = 14;
        const GIST_DB_STORE_NAME = 'cards';
        const DEMAND_CACHE_STORE_NAME = 'demand_cache';
        const OWNER_MAP_STORE_NAME = 'owner_to_type_map';
        let dbPromise = null;

        // #######################################################################
        // #######################################################################
        function openDb() {
            if (dbPromise) return dbPromise;
            dbPromise = new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                request.onerror = (event) => {
                    console.error("Критическая ошибка открытия IndexedDB:", event.target.error);
                    reject("Ошибка открытия IndexedDB: " + event.target.errorCode);
                };
                request.onsuccess = () => {
                    const db = request.result;
                    db.onversionchange = () => {
                        console.log("Получен запрос на обновление версии базы данных. Закрываю текущее соединение.");
                        db.close();
                    };
                    resolve(db);
                };
                request.onblocked = (event) => {
                    console.error("Обновление IndexedDB заблокировано! Скорее всего, открыты другие вкладки с сайтом.");
                    safeDLEPushCall('error', 'Ошибка обновления базы! Закройте ВСЕ остальные вкладки с этим сайтом и перезагрузите страницу.');
                    reject("Database upgrade is blocked by other connections.");
                };
                request.onupgradeneeded = (event) => {
                    console.log("Выполняется обновление структуры IndexedDB...");
                    const db = event.target.result;
                    if (db.objectStoreNames.contains(GIST_DB_STORE_NAME)) {
                        try {
                            db.deleteObjectStore(GIST_DB_STORE_NAME);
                            console.log(`Удалено старое хранилище "${GIST_DB_STORE_NAME}" для обновления.`);
                        } catch (e) {
                             console.error(`Не удалось удалить хранилище "${GIST_DB_STORE_NAME}":`, e);
                        }
                    }
                    db.createObjectStore(GIST_DB_STORE_NAME, { keyPath: 'id' });
                    console.log(`Создано хранилище для Gist DB: "${GIST_DB_STORE_NAME}"`);

                    if (!db.objectStoreNames.contains(DEMAND_CACHE_STORE_NAME)) {
                        db.createObjectStore(DEMAND_CACHE_STORE_NAME);
                        console.log(`Создано хранилище для кэша спроса: "${DEMAND_CACHE_STORE_NAME}"`);
                    }
                    if (!db.objectStoreNames.contains(OWNER_MAP_STORE_NAME)) {
                        db.createObjectStore(OWNER_MAP_STORE_NAME, { keyPath: 'ownerId' });
                         console.log(`Создано хранилище для кэша ownerId -> typeId: "${OWNER_MAP_STORE_NAME}"`);
                    }
                    if (!db.objectStoreNames.contains('scc_settings')) {
                        db.createObjectStore('scc_settings');
                        console.log(`Создано хранилище для настроек сборщика: "scc_settings"`);
                    }
                    if (!db.objectStoreNames.contains('scc_profiles')) {
                        db.createObjectStore('scc_profiles');
                         console.log(`Создано хранилище для профилей сборщика: "scc_profiles"`);
                    }
                    if (!db.objectStoreNames.contains('scc_card_cache')) {
                        db.createObjectStore('scc_card_cache');
                        console.log(`Создано хранилище для кеша карт сборщика: "scc_card_cache"`);
                    }
                    if (!db.objectStoreNames.contains(WISHLIST_DB_STORE_NAME)) {
                        db.createObjectStore(WISHLIST_DB_STORE_NAME);
                        console.log(`Создано хранилище для списков желаний: "${WISHLIST_DB_STORE_NAME}"`);
                    }
                };
            });
            return dbPromise;
        }

        // #######################################################################
        // #######################################################################
        async function populateDb(cards) {
            const db = await openDb();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(GIST_DB_STORE_NAME, 'readwrite');
                const store = transaction.objectStore(GIST_DB_STORE_NAME);
                store.clear();
                const uniqueCardsMap = new Map(cards.map(card => [card.id, card]));
                uniqueCardsMap.forEach(card => store.put(card));
                transaction.oncomplete = () => resolve();
                transaction.onerror = (event) => reject("Ошибка при заполнении IndexedDB (Gist DB): " + event.target.error);
            });
        }

        // #######################################################################
        // #######################################################################
        async function getCardByUrl(imageUrl) {
            const db = await openDb();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(GIST_DB_STORE_NAME, 'readonly');
                const store = transaction.objectStore(GIST_DB_STORE_NAME);
                const request = store.get(imageUrl);
                request.onsuccess = () => resolve(request.result);
                request.onerror = (event) => reject("Ошибка при чтении из IndexedDB (Gist DB): " + event.target.error);
            });
        }

        // #######################################################################
        // --- Универсальные хелперы для IndexedDB ---
        // #######################################################################
        async function dbSet(storeName, key, value) {
            const db = await openDb();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.put(value, key);
                transaction.oncomplete = () => resolve();
                transaction.onerror = (event) => reject(`Ошибка записи в ${storeName}: ${event.target.error}`);
            });
        }
        unsafeWindow.dbSet = dbSet;

        // #######################################################################
        // #######################################################################
        async function dbGet(storeName, key) {
            const db = await openDb();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(storeName, 'readonly');
                const store = transaction.objectStore(storeName);
                const request = store.get(key);
                request.onsuccess = () => resolve(request.result);
                request.onerror = (event) => reject(`Ошибка чтения из ${storeName}: ${event.target.error}`);
            });
        }
        unsafeWindow.dbGet = dbGet;

        // #######################################################################
        // #######################################################################
        async function dbDelete(storeName, key) {
            const db = await openDb();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.delete(key);
                transaction.oncomplete = () => resolve();
                transaction.onerror = (event) => reject(`Ошибка удаления из ${storeName}: ${event.target.error}`);
            });
        }

        // ##############################################################################################################################################
        // # БЛОК: МОДАЛЬНОЕ ОКНО НАСТРОЕК БАЗЫ ДАННЫХ
        // ##############################################################################################################################################
        // #######################################################################
        // --- Вспомогательная функция для получения всех карт из IndexedDB ---
        // #######################################################################
        async function getAllCardsFromDB() {
            const db = await openDb();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(GIST_DB_STORE_NAME, 'readonly');
                const store = transaction.objectStore(GIST_DB_STORE_NAME);
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = (event) => reject(event.target.error);
            });
        }

        // #######################################################################
        // --- Вспомогательная функция для получения КОЛИЧЕСТВА карт из IndexedDB ---
        // #######################################################################
        async function getCardCountFromDB() {
            try {
                const db = await openDb();
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction(GIST_DB_STORE_NAME, 'readonly');
                    const store = transaction.objectStore(GIST_DB_STORE_NAME);
                    const request = store.count();
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = (event) => reject(event.target.error);
                });
            } catch (error) {
                console.error("[Card DB] Ошибка при получении количества карт из IndexedDB:", error);
                return 0;
            }
        }

        // #######################################################################
        // --- Функция для скачивания локальной базы ---
        // #######################################################################
        async function downloadLocalDatabase() {
            safeDLEPushCall('info', 'Подготовка данных для скачивания...');
            const dataArray = await getAllCardsFromDB();
            if (dataArray.length === 0) {
                safeDLEPushCall('warning', 'Локальная база данных пуста. Нечего скачивать.');
                return;
            }
            dataArray.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
            const dataStr = JSON.stringify(dataArray, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'animestars_cards_database_local.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            safeDLEPushCall('success', `${dataArray.length} карт было сохранено в файл.`);
        }

        // #######################################################################
        // --- Функция для очистки локальной базы ---
        // #######################################################################
        async function clearLocalDatabase() {
            const confirmation = await protector_customConfirm('Вы уверены, что хотите ПОЛНОСТЬЮ очистить локальную базу карт?<br>Это действие необратимо.');
            if (confirmation) {
                safeDLEPushCall('info', 'Очистка базы данных...');
                const db = await openDb();
                const transaction = db.transaction(GIST_DB_STORE_NAME, 'readwrite');
                const store = transaction.objectStore(GIST_DB_STORE_NAME);
                const request = store.clear();
                request.onsuccess = () => {
                    if (cardDatabaseMap) {
                        cardDatabaseMap.clear();
                    }
                    if (cardImageIndex) {
                        cardImageIndex.clear();
                    }
                    safeDLEPushCall('success', 'Локальная база данных успешно очищена!');
                    updateDatabaseStatusDisplay();
                };
                request.onerror = () => {
                    safeDLEPushCall('error', 'Ошибка при очистке базы данных.');
                };
            }
        }

        // #######################################################################
        // --- Функция-обработчик импорта файла ---
        // #######################################################################
        async function handleImportDatabase(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (!Array.isArray(data)) throw new Error("Файл не является валидным массивом.");
                    await ensureDbLoaded();
                    const confirmation = await protector_customConfirm(`Заменить текущую базу (${cardDatabaseMap.size} карт) на данные из файла (${data.length} карт)?`);
                    if (confirmation) {
                        safeDLEPushCall('info', 'Импорт данных, это может занять некоторое время...');
                        await clearLocalDatabase();
                        await scraper_addCardsToDb(data);
                        safeDLEPushCall('success', 'База данных успешно импортирована из файла!');
                        updateDatabaseStatusDisplay();
                    }
                } catch (error) {
                    safeDLEPushCall('error', `Ошибка импорта: ${error.message}`);
                } finally {
                    event.target.value = '';
                }
            };
            reader.readAsText(file);
        }

        // #######################################################################
        // --- Функция для обновления статуса в модальном окне ---
        // #######################################################################
        async function updateDatabaseStatusDisplay() {
            const statusEl = document.getElementById('db-status-display');
            if (statusEl) {
                let count = 0;
                if (cardDatabaseMap) {
                    count = cardDatabaseMap.size;
                } else {
                    count = await getCardCountFromDB();
                }
                statusEl.innerHTML = `В локальной базе: <b>${count}</b> карт.`;
            }
        }

        // #######################################################################
        // --- Главная функция создания модального окна настроек базы ---
        // #######################################################################
        function updateDbModalUI(isRunning, state = null) {
            const modal = document.getElementById('db_settings_modal');
            if (!modal) return;
            const mainBtn = modal.querySelector('#db-main-control-btn');
            const customScanBtn = modal.querySelector('#db-custom-scan-btn');
            const downloadBtn = modal.querySelector('#db-download-btn');
            const importBtn = modal.querySelector('#db-import-btn');
            const clearBtn = modal.querySelector('#db-clear-btn');
            const customPagesInput = modal.querySelector('#db-custom-pages-input');
            const statusEl = modal.querySelector('#db-status-display');
            if (isRunning) {
                mainBtn.textContent = 'Остановить';
                mainBtn.style.background = 'linear-gradient(145deg, #e74c3c, #c0392b)';
                mainBtn.style.border = '1px solid #a93226';
                [customScanBtn, downloadBtn, importBtn, clearBtn, customPagesInput].forEach(el => { el.disabled = true; });
                if (state) {
                    statusEl.innerHTML = `Сбор... Обработано <b>${state.currentPage} из ${state.totalPages}</b> стр.`;
                }
            } else {
                mainBtn.innerHTML = '<i class="fas fa-globe-americas"></i> Начать полный сбор';
                mainBtn.style.background = 'linear-gradient(145deg, #27ae60, #229954)';
                mainBtn.style.border = '1px solid #1e8449';
                [customScanBtn, downloadBtn, importBtn, clearBtn, customPagesInput].forEach(el => { el.disabled = false; });
                updateDatabaseStatusDisplay();
            }
        }

        // #######################################################################
        // --- Главная функция создания модального окна настроек базы ---
        // #######################################################################
        unsafeWindow.openDatabaseSettingsModal = async function() {
            const MODAL_WRAPPER_ID = 'acm_modal_wrapper';
            if (document.getElementById(MODAL_WRAPPER_ID)) return;
            const isGithubCheckEnabled = await GM_getValue(GITHUB_CHECK_ENABLED_KEY, true);
            const isPageScanEnabled = await GM_getValue(PAGE_SCAN_ENABLED_KEY, true);
            const wrapper = document.createElement('div');
            wrapper.id = MODAL_WRAPPER_ID;
            wrapper.innerHTML = `
            <div class="acm-modal-backdrop"></div>
            <div class="acm-modal" id="db_settings_modal" style="background-color: rgba(30, 31, 34, 0.9); border: 1px solid #c83a54; box-shadow: 0 0 20px rgba(200, 58, 84, 0.5); backdrop-filter: blur(5px);">
                <div class="modal-header" style="border-bottom: 1px solid #4a2f3a;">
                    <h2 style="color: #d4506a;">Настройки Базы Карт</h2>
                </div>
                <div class="modal-body" style="background-color: transparent;">
                    <div id="db-status-display" style="text-align: center; color: #ccc; margin-bottom: 20px; font-size: 1.1em; text-shadow: 0 0 5px #000;">Загрузка...</div>
                    <div style="border: 1px solid #4a2f3a; border-radius: 5px; padding: 12px; margin-bottom: 15px;">
                         <div class="setting-row" style="padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid #33353a;">
                            <span style="color: #ccc;">Авто-обновление с Gist:</span>
                            <label class="protector-toggle-switch"><input type="checkbox" id="db-github-toggle" ${isGithubCheckEnabled ? 'checked' : ''}><span class="protector-toggle-slider"></span></label>
                        </div>
                        <div class="setting-row" id="db-page-scan-row">
                            <span style="color: #ccc;">Авто-проверка 2-х страниц сайта:</span>
                            <label class="protector-toggle-switch"><input type="checkbox" id="db-page-scan-toggle" ${isPageScanEnabled ? 'checked' : ''}><span class="protector-toggle-slider"></span></label>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
                        <button id="db-force-gist-update-btn" class="action-btn" style="background: linear-gradient(145deg, #8e44ad, #7d3c98); border: 1px solid #6c3483;"><i class="fas fa-cloud-download-alt"></i> Принудительно обновить с Gist</button>
                        <button id="db-main-control-btn" class="action-btn start-btn"><i class="fas fa-globe-americas"></i> Начать полный сбор</button>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <input type="number" id="db-custom-pages-input" value="2" min="1" placeholder="Стр." style="width: 80px; text-align: center; padding: 8px; background-color: #2c3e50; border: 1px solid #34495e; color: #ecf0f1; border-radius: 5px;">
                            <button id="db-custom-scan-btn" class="action-btn quick-btn"><i class="fas fa-fast-forward"></i> Проверить N страниц</button>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <button id="db-download-btn" class="action-btn download-btn"><i class="fas fa-download"></i> Скачать базу</button>
                            <button id="db-import-btn" class="action-btn upload-btn"><i class="fas fa-upload"></i> Загрузить базу</button>
                            <input type="file" id="db-import-file-input" style="display: none;" accept=".json">
                        </div>
                        <button id="db-clear-btn" class="action-btn clear-btn"><i class="fas fa-trash-alt"></i> Очистить локальную базу</button>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #4a2f3a;">
                    <button id="db-back-btn" class="action-btn back-btn">Назад</button>
                </div>
            </div>`;
            document.body.appendChild(wrapper);
            updateDatabaseStatusDisplay();
            const closeModal = () => wrapper.remove();
            wrapper.querySelector('.acm-modal-backdrop').onclick = closeModal;
            wrapper.querySelector('#db-back-btn').onclick = () => {
                closeModal();
                unsafeWindow.openMasterSettingsModal();
            };
            const githubToggle = wrapper.querySelector('#db-github-toggle');
            const pageScanToggle = wrapper.querySelector('#db-page-scan-toggle');
            const pageScanRow = wrapper.querySelector('#db-page-scan-row');
            wrapper.querySelector('#db-force-gist-update-btn').onclick = () => { closeModal(); unsafeWindow.updateLocalDatabase(true); };
            const mainControlButton = wrapper.querySelector('#db-main-control-btn');
            mainControlButton.onclick = () => {
                if (isScraping) {
                    stopScraping();
                } else {
                    unsafeWindow.runFullCardScrape();
                }
            };
            wrapper.querySelector('#db-custom-scan-btn').onclick = () => {
                if (isScraping) return;
                const pages = parseInt(wrapper.querySelector('#db-custom-pages-input').value, 10);
                if (pages > 0) unsafeWindow.runFallbackCardScrape(pages);
                else safeDLEPushCall('warning', 'Введите корректное число страниц.');
            };
            wrapper.querySelector('#db-download-btn').onclick = downloadLocalDatabase;
            wrapper.querySelector('#db-import-btn').onclick = () => wrapper.querySelector('#db-import-file-input').click();
            wrapper.querySelector('#db-import-file-input').onchange = handleImportDatabase;
            wrapper.querySelector('#db-clear-btn').onclick = clearLocalDatabase;
            if (isScraping) {
                updateDbModalUI(true, await GM_getValue(SCRAPE_STATE_KEY));
            }
        }

        // #######################################################################
        // --- Функция для принудительной остановки сбора ---
        // #######################################################################
        async function stopScraping() {
            console.log('[Fallback Scraper] Получена команда на остановку.');
            isScraping = false;
            await GM_deleteValue(SCRAPE_STATE_KEY);
            if (document.getElementById('db_settings_modal')) {
                updateDbModalUI(false);
            }
        }
        unsafeWindow.stopScraping = stopScraping;

        // #######################################################################
        // --- Функция для проверки и возобновления прерванного сбора ---
        // #######################################################################
        async function checkForInterruptedScrape() {
            const savedState = await GM_getValue(SCRAPE_STATE_KEY, null);
            if (savedState && savedState.isRunning) {
                console.warn('[Fallback Scraper] Обнаружен незавершенный сеанс сбора. Возобновляю...');
                safeDLEPushCall('warning', 'Обнаружен прерванный сбор. Возобновляю процесс...');
                await scraper_runScan(null, savedState);
            }
        }

        // ##############################################################################################################################################
        // # КОНЕЦ БЛОКА: МОДАЛЬНОЕ ОКНО НАСТРОЕК БАЗЫ ДАННЫХ
        // ##############################################################################################################################################

        // ##############################################################################################################################################
        // # БЛОК: ФУНКЦИИ ЛЕНИВОЙ ЗАГРУЗКИ И ВЫГРУЗКИ БАЗЫ ДАННЫХ
        // ##############################################################################################################################################

        // #######################################################################
        // Выгружает базу данных из оперативной памяти для экономии ресурсов
        // #######################################################################
        function unloadDatabaseFromMemory() {
            cardDatabaseMap = null;
            cardImageIndex = null;
            isDatabaseReady = false;
            databaseReadyPromise = null;
            unloadDbTimeoutId = null;
            console.log(`База данных выгружена из ОЗУ.`);
        }

        // #######################################################################
        // Планирует выгрузку базы данных через определенное время
        // #######################################################################
        function resetGlobalDbUnloadTimer() {
            if (isScraping) {
                return;
            }
            if (unloadDbTimeoutId) {
                clearTimeout(unloadDbTimeoutId);
            }
            const unloadDelayMs = DB_UNLOAD_DELAY_MINUTES * 60 * 1000;
            const now = Date.now();
            if (now - lastDbUnloadLogTimestamp > 30000) {
                console.log(`База данных будет выгружена из ОЗУ через ${DB_UNLOAD_DELAY_MINUTES} мин. бездействия.`);
                lastDbUnloadLogTimestamp = now;
            }
            unloadDbTimeoutId = setTimeout(unloadDatabaseFromMemory, unloadDelayMs);
        }

        // #######################################################################
        // Гарантирует, что база данных загружена в память. Если нет - загружает.
        // #######################################################################
        function ensureDbLoaded() {
            if (isDatabaseReady && databaseReadyPromise) {
                return databaseReadyPromise;
                resetGlobalDbUnloadTimer();
            }
            if (databaseReadyPromise) {
                return databaseReadyPromise;
            }
            databaseReadyPromise = new Promise(async (resolve, reject) => {
                try {
                    const db = await openDb();
                    const transaction = db.transaction(GIST_DB_STORE_NAME, 'readonly');
                    const store = transaction.objectStore(GIST_DB_STORE_NAME);
                    const allRecordsReq = store.getAll();
                    allRecordsReq.onsuccess = () => {
                        const allCards = allRecordsReq.result;
                        if (allCards && allCards.length > 0) {
                            cardDatabaseMap = new Map(allCards.map(card => [card.id, card]));
                            cardImageIndex = new Map();
                            allCards.forEach(card => {
                                const compositeKey = normalizeImagePath(card.image);
                                if (compositeKey) {
                                    cardImageIndex.set(compositeKey, card.id);
                                }
                            });
                            isDatabaseReady = true;
                            console.log(`Успешно загружено ${cardDatabaseMap.size} карт из IndexedDB в память.`);
                            resetGlobalDbUnloadTimer();
                            resolve();
                        } else {
                            console.warn('[ensureDbLoaded] IndexedDB пуста. Ожидаю фонового обновления от главного инициализатора...');
                            let attempts = 0;
                            const maxAttempts = 120;
                            const interval = setInterval(async () => {
                                attempts++;
                                const cardCount = await getCardCountFromDB();
                                if (cardCount > 0) {
                                    clearInterval(interval);
                                    console.log('[ensureDbLoaded] Данные появились в IndexedDB. Перезапускаю загрузку в память.');
                                    databaseReadyPromise = null;
                                    ensureDbLoaded().then(resolve).catch(reject);
                                } else if (attempts >= maxAttempts) {
                                    clearInterval(interval);
                                    const updateInProgress = await GM_getValue('ascm_db_update_in_progress', null);
                                    if (updateInProgress) {
                                        console.error('[ensureDbLoaded] База данных осталась пустой после ожидания, но обновление все еще "в процессе". Вероятно, зависло.');
                                        showNotification('Обновление базы карт зависло!', 'error');
                                    } else {
                                        console.error('[ensureDbLoaded] База данных осталась пустой после ожидания. Процесс прерван.');
                                        showNotification('Не удалось загрузить базу карт!', 'error');
                                    }
                                    reject(new Error('DB remained empty after waiting period.'));
                                }
                            }, 500);
                        }
                    };
                    allRecordsReq.onerror = (event) => {
                        console.error('Ошибка загрузки при чтении из IndexedDB:', event.target.error);
                        showNotification('Ошибка при чтении локальной базы карт!', 'error');
                        reject(event.target.error);
                    };
                } catch (error) {
                    console.error('Критическая ошибка при загрузке:', error);
                    showNotification('Критическая ошибка при загрузке базы!', 'error');
                    reject(error);
                }
            });
            return databaseReadyPromise;
        }
        unsafeWindow.ensureDbLoaded = ensureDbLoaded;
        // ##############################################################################################################################################
        // # КОНЕЦ БЛОКА ЛЕНИВОЙ ЗАГРУЗКИ И ВЫГРУЗКИ БАЗЫ ДАННЫХ
        // ##############################################################################################################################################

        // ##############################################################################################################################################
        // # БЛОК ОВЕРЛЕЯ НОВИЗНЫ КАРТ (CARD FRESHNESS)
        // ##############################################################################################################################################

        // #######################################################################
        // # Инициализирует или получает ID текущей сессии браузера (через cookie).
        // #######################################################################
        function initializeSession() {
            const SESSION_ID_COOKIE = 'ascm_freshness_session_id';
            let id = getCookie(SESSION_ID_COOKIE);
            if (!id) {
                id = Date.now().toString(36) + Math.random().toString(36).substring(2);
                setGlos(SESSION_ID_COOKIE, id);
            } else {
            }
            sessionID = id;
        }

        // #######################################################################
        // # Подготовка данных для новых карт
        // #######################################################################
        async function prepareFreshnessData() {
            if (!freshnessOverlayEnabled || freshnessData) return;
            try {
                const cached = localStorage.getItem(FRESHNESS_DATA_LOCAL_KEY);
                if (cached) {
                    const parsed = JSON.parse(cached);
                    if (parsed.sessionID === sessionID) {
                        freshnessData = new Map(Object.entries(parsed.data));
                        return;
                    }
                }
            } catch (e) { console.error('[Freshness] Ошибка чтения общего кэша:', e); }
            if (localStorage.getItem(FRESHNESS_LOCK_KEY)) {
                await waitForFreshnessData();
                return;
            }
            localStorage.setItem(FRESHNESS_LOCK_KEY, 'true');
            try {
                await ensureDbLoaded();
                if (!cardDatabaseMap || cardDatabaseMap.size === 0) throw new Error('База данных карт не загружена.');
                const allCards = Array.from(cardDatabaseMap.values()).filter(card => card.rank.toLowerCase() !== 'sss');
                allCards.sort((a, b) => b.id - a.id);
                const absoluteMaxId = allCards.length > 0 ? allCards[0].id : 0;
                const latestCards1260 = allCards.slice(0, 1260);
                const redZoneThresholdId_ass = allCards.length > 10000 ? allCards[9999].id : 0;
                const redZoneThresholdId_s = allCards.length > 5000 ? allCards[4999].id : 0;
                const redZoneThresholdId_a = allCards.length > 3000 ? allCards[2999].id : 0;
                const redZoneThresholdId_b = allCards.length > 1600 ? allCards[1599].id : 0;
                const redZoneThresholdId_c = allCards.length > 1850 ? allCards[1849].id : 0;
                const redZoneThresholdId_d = allCards.length > 1800 ? allCards[1799].id : 0;
                const redZoneThresholdId_e = allCards.length > 2300 ? allCards[2299].id : 0;
                const redZoneThresholdId_default = redZoneThresholdId_c;
                if (latestCards1260.length === 0) {
                    localStorage.removeItem(FRESHNESS_LOCK_KEY);
                    return;
                }
                const idToOrdinalMap = new Map();
                idToOrdinalMap.set('_absoluteMinId', latestCards1260[latestCards1260.length - 1].id);
                idToOrdinalMap.set('_absoluteMaxId', absoluteMaxId);
                idToOrdinalMap.set('_redZoneThresholdId_ass', redZoneThresholdId_ass);
                idToOrdinalMap.set('_redZoneThresholdId_s', redZoneThresholdId_s);
                idToOrdinalMap.set('_redZoneThresholdId_a', redZoneThresholdId_a);
                idToOrdinalMap.set('_redZoneThresholdId_b', redZoneThresholdId_b);
                idToOrdinalMap.set('_redZoneThresholdId_c', redZoneThresholdId_c);
                idToOrdinalMap.set('_redZoneThresholdId_d', redZoneThresholdId_d);
                idToOrdinalMap.set('_redZoneThresholdId_e', redZoneThresholdId_e);
                idToOrdinalMap.set('_redZoneThresholdId_default', redZoneThresholdId_default);
                latestCards1260.forEach((card, index) => {
                    idToOrdinalMap.set(card.id.toString(), index + 1);
                });
                freshnessData = idToOrdinalMap;
                const dataToStore = {
                    sessionID: sessionID,
                    data: Object.fromEntries(idToOrdinalMap)
                };
                localStorage.setItem(FRESHNESS_DATA_LOCAL_KEY, JSON.stringify(dataToStore));

            } catch (error) {
                console.error('[Freshness] Ошибка при подготовке данных:', error);
            } finally {
                localStorage.removeItem(FRESHNESS_LOCK_KEY);
            }
        }

        // #######################################################################
        // # Вспомогательная функция для ожидания данных, если их генерирует другая вкладка.
        // #######################################################################
        async function waitForFreshnessData() {
            return new Promise(resolve => {
                let attempts = 0;
                const maxAttempts = 20;
                const interval = setInterval(() => {
                    const cached = localStorage.getItem(FRESHNESS_DATA_LOCAL_KEY);
                    if (cached) {
                        const parsed = JSON.parse(cached);
                        if (parsed.sessionID === sessionID) {
                            freshnessData = new Map(Object.entries(parsed.data));
                            clearInterval(interval);
                            resolve();
                            return;
                        }
                    }
                    attempts++;
                    if (attempts > maxAttempts) {
                        localStorage.removeItem(FRESHNESS_LOCK_KEY);
                        clearInterval(interval);
                        resolve();
                    }
                }, 1000);
            });
        }

        // #######################################################################
        // # Рассчитывает цвет с глобальным порогом новизны в 5000 карт.
        // #######################################################################
        function idToFreshnessStyle(id, rank) {
            const numericId = parseInt(id, 10);
            if (isNaN(numericId)) {
                return { color: 'hsl(0, 100%, 45%)', freshnessPercent: 0 };
            }
            if (!freshnessOverlayEnabled || !freshnessData || freshnessData.size === 0) {
                return { color: 'hsl(0, 100%, 45%)', freshnessPercent: 0 };
            }
            const absoluteMaxId = freshnessData.get('_absoluteMaxId');
            const absoluteMinId = freshnessData.get('_absoluteMinId');
            const isCardInDatabase = freshnessData.has(id.toString());
            if ((typeof absoluteMaxId !== 'undefined' && numericId > absoluteMaxId) ||
                (!isCardInDatabase && typeof absoluteMinId !== 'undefined' && numericId > absoluteMinId))
            {
                return { color: '#00ffee', freshnessPercent: 100 };
            }
            const ordinal = freshnessData.get(id.toString());
            const freshnessPercent = ordinal ? ((1260 - ordinal) / 1260) * 100 : 0;

            let redZoneThresholdId;
            if (rank === 'ass') {
                redZoneThresholdId = freshnessData.get('_redZoneThresholdId_ass');
            } else if (rank === 's') {
                redZoneThresholdId = freshnessData.get('_redZoneThresholdId_s');
            } else if (rank === 'a') {
                redZoneThresholdId = freshnessData.get('_redZoneThresholdId_a');
            } else if (rank === 'b') {
                redZoneThresholdId = freshnessData.get('_redZoneThresholdId_b');
            } else if (rank === 'c') {
                redZoneThresholdId = freshnessData.get('_redZoneThresholdId_c');
            } else if (rank === 'd') {
                redZoneThresholdId = freshnessData.get('_redZoneThresholdId_d');
            } else if (rank === 'e') {
                redZoneThresholdId = freshnessData.get('_redZoneThresholdId_e');
            }
            if (typeof redZoneThresholdId === 'undefined' || numericId < redZoneThresholdId) {
                return { color: 'hsl(0, 100%, 10%)', freshnessPercent: 0 };
            }
            let hue;
            const gradientZoneStart = redZoneThresholdId;
            const gradientZoneEnd = absoluteMaxId;
            const gradientZoneSize = gradientZoneEnd - gradientZoneStart;
            const GRADIENT_CURVE_FACTOR = 2;
            if (gradientZoneSize <= 0) {
                hue = 120;
            } else {
                const positionInGradient = numericId - gradientZoneStart;
                const ratio = Math.min(1, Math.max(0, positionInGradient / gradientZoneSize));
                const curvedRatio = Math.pow(ratio, GRADIENT_CURVE_FACTOR);
                hue = curvedRatio * 120;
            }
            return {
                color: `hsl(${Math.round(hue)}, 100%, 45%)`,
                freshnessPercent: freshnessPercent
            };
        }

        // #######################################################################
        // # Создает или обновляет значок (badge) на элементе карты.
        // #######################################################################
        function setFreshnessBadge(cardEl, id, rank) {
            if (rank === 'sss') {
                const existingBadge = cardEl.querySelector('.acm-freshness-badge');
                if (existingBadge) {
                    existingBadge.remove();
                }
                return;
            }
            const BADGE_CLASS = 'acm-freshness-badge';
            let badge = cardEl.querySelector(`.${BADGE_CLASS}`);
            const { color, freshnessPercent } = idToFreshnessStyle(id, rank);
            if (!badge) {
                const size = '35px';
                badge = document.createElement('div');
                badge.className = BADGE_CLASS;
                Object.assign(badge.style, {
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    width: size,
                    height: size,
                    zIndex: '1',
                    background: `radial-gradient(circle at 0 100%, transparent ${size}, ${color} ${size})`,
                    borderRadius: '0 10px 0 0'
                });
                const container = cardEl.querySelector('.anime-cards__image') || cardEl;
                if (getComputedStyle(container).position === 'static') {
                    container.style.position = 'relative';
                }
                container.appendChild(badge);
            }
            const size = badge.style.width;
            badge.style.background = `radial-gradient(circle at 0 100%, transparent ${size}, ${color} calc(${size} + 0.5px))`;
            badge.title = `ID:${id}\nНовизна первых\n20стр базы: ${freshnessPercent.toFixed(1)}%`;
        }


        // #######################################################################
        // # Запускает обновление оверлеев для всех карт на странице.
        // #######################################################################
        async function updateFreshnessOverlays(forceUpdate = false) {
            if (!freshnessOverlayEnabled) return;
            if ((isSpecificTradeOfferPage() || isRemeltPage()) && !isFreshnessCheckActive) {
                removeFreshnessOverlays();
                return;
            }
            if (!freshnessData) {
                await prepareFreshnessData();
            }
            if (!freshnessData) {
                console.warn('[Freshness] Данные о новинках недоступны, обновление оверлеев пропущено.');
                return;
            }
            const cards = document.querySelectorAll('.lootbox__card, .anime-cards__item, a.trade__main-item[href*="id="], .trade__inventory-item, .stone__inventory-item, .remelt__inventory-item');
            for (const el of cards) {
                if (!forceUpdate && el.querySelector('.acm-freshness-badge')) continue;
                let rank = el.dataset.rank ? el.dataset.rank.toLowerCase() : null;
                if (!rank) {
                    const img = el.querySelector('img');
                    if (img) {
                        const imageUrl = img.dataset.src || img.src;
                        if (imageUrl) {
                            const match = imageUrl.match(/\/cards_image\/\d+\/([a-z]+)\//);
                            if (match && match[1]) {
                                rank = match[1];
                            }
                        }
                    }
                }
                const typeId = await getCardId(el, 'type', true);
                if (typeId > 0 && rank) {
                    setFreshnessBadge(el, typeId, rank);
                }
            };
        }

        // #######################################################################
        // # Удаляет все оверлеи новизны с карточек на странице.
        // #######################################################################
        function removeFreshnessOverlays() {
            document.querySelectorAll('.acm-freshness-badge').forEach(badge => badge.remove());
        }

        // #######################################################################
        // # Обновляет UI кнопки проверки новизны (цвет, иконка, подсказка).
        // #######################################################################
        function updateFreshnessButtonUI() {
            const btn = document.getElementById('checkFreshnessBtn');
            if (!btn) return;
            const icon = btn.querySelector('span:first-child');
            if (isFreshnessCheckActive) {
                btn.style.background = 'linear-gradient(145deg, rgb(50, 222, 50), rgb(50, 122, 50))';
                btn.title = 'Скрыть индикаторы новизны';
                if (icon) icon.className = 'fal fa-eye-slash';
            } else {
                btn.style.background = 'linear-gradient(145deg, rgb(166, 100, 110), rgb(222, 0, 5))';
                btn.title = 'Проверить новизну карт';
                if (icon) icon.className = 'fal fa-leaf';
            }
        }

        // ##############################################################################################################################################
        // # КОНЕЦ БЛОКА ОВЕРЛЕЯ НОВИЗНЫ КАРТ
        // ##############################################################################################################################################

        // #######################################################################
        // # Активирует проверку новизны (загружает базу и отображает индикаторы).
        // #######################################################################
        async function activateFreshnessCheckLogic() {
            if (freshnessData) {
                await updateFreshnessOverlays(true);
                return;
            }
            try {
                await ensureDbLoaded();
                if (!isDatabaseReady) throw new Error('Не удалось загрузить базу данных карт.');
                await prepareFreshnessData();
                await updateFreshnessOverlays(true);
            } catch (error) {
                console.error('[Freshness Check] Произошла ошибка:', error);
                isFreshnessCheckActive = false;
                await GM_setValue(FRESHNESS_TRADE_ACTIVE_KEY, false);
                updateFreshnessButtonUI();
            }
        }

        // #######################################################################
        // # Запускает проверку новизны карт по клику на кнопку (только для страниц обмена).
        // #######################################################################
        async function toggleFreshnessCheck() {
            if (!freshnessOverlayEnabled) {
                return;
            }
            isFreshnessCheckActive = !isFreshnessCheckActive;
            const activeKey = isRemeltPage() ? FRESHNESS_REMELT_ACTIVE_KEY : FRESHNESS_TRADE_ACTIVE_KEY;
            await GM_setValue(activeKey, isFreshnessCheckActive);
            updateFreshnessButtonUI();
            if (isFreshnessCheckActive) {
                await activateFreshnessCheckLogic();
            } else {
                removeFreshnessOverlays();
            }
        }

        // ##############################################################################################################################################
        // # БЛОК УПРАВЛЕНИЯ ВНЕШНЕЙ БАЗОЙ ДАННЫХ КАРТ (ИЗ GIST)
        // ##############################################################################################################################################
        // #######################################################################
        // Загружает базу данных карт с Gist.
        // #######################################################################
        unsafeWindow.fetchCardDatabase = function() {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: CARD_DATABASE_GIST_URL,
                    headers: {
                        'Cache-Control': 'no-cache'
                    },
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (Array.isArray(data)) {
                                    resolve(data);
                                } else {
                                    console.error('Данные не являются массивом.', data);
                                    reject(new Error('Неверный формат данных.'));
                                }
                            } catch (error) {
                                console.error('Ошибка парсинга JSON:', error);
                                reject(error);
                            }
                        } else {
                            console.error(`Ошибка сети: ${response.status}`);
                            reject(new Error(`Ошибка сети: ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        console.error('Критическая ошибка GM_xmlhttpRequest:', error);
                        reject(error);
                    }
                });
            });
        };

        // #######################################################################
        // Обновляет локальную копию базы данных, если кэш устарел или требуется принудительное обновление.
        // #######################################################################
        unsafeWindow.updateLocalDatabase = async function(force = false) {
            await sleep(1000);
            const UPDATE_FLAG_KEY = 'ascm_db_update_in_progress';
            const LAST_DB_UPDATE_KEY = 'ascm_db_last_update_ts';
            const MAX_UPDATE_DURATION_MS = 1 * 60 * 1000;
            const now = Date.now();
            const updateInfo = await GM_getValue(UPDATE_FLAG_KEY, null);
            if (updateInfo && updateInfo.timestamp && (now - updateInfo.timestamp < MAX_UPDATE_DURATION_MS)) {
                console.log(`[Card DB] Обновление уже запущено в другой вкладке (ID: ${updateInfo.tabId}). Пропускаю.`);
                return;
            } else if (updateInfo) {
                console.warn(`[Card DB] Обнаружен "зависший" флаг обновления. Сбрасываю и продолжаю проверку.`);
                await GM_deleteValue(UPDATE_FLAG_KEY);
            }
            let needsUpdate = false;
            let updateReason = "";
            if (force) {
                needsUpdate = true;
                updateReason = "Принудительный запуск.";
            } else {
                let cardCount = await getCardCountFromDB();
                if (cardCount === 0) {
                    await sleep(1000);
                    cardCount = await getCardCountFromDB();
                }
                if (cardCount === 0) {
                    needsUpdate = true;
                    updateReason = "Локальная база данных пуста.";
                } else {
                    const lastUpdateTime = await GM_getValue(LAST_DB_UPDATE_KEY, 0);
                    if ((now - lastUpdateTime) >= CARD_DATABASE_TTL_HOURS * 3600 * 1000) {
                        needsUpdate = true;
                        updateReason = "Срок действия локального кэша истек.";
                    }
                }
            }
            if (!needsUpdate) {
                return;
            }
            console.log(`[Card DB] Требуется обновление. Причина: ${updateReason}`);
            await GM_setValue(UPDATE_FLAG_KEY, { tabId: unsafeWindow.tabIdWatch, timestamp: now });
            try {
                const isGithubCheckEnabled = await GM_getValue(GITHUB_CHECK_ENABLED_KEY, true);
                const isPageScanEnabled = await GM_getValue(PAGE_SCAN_ENABLED_KEY, true);
                if (!isGithubCheckEnabled && !isPageScanEnabled && !force) {
                    console.log('[Card DB] Все методы обновления отключены в настройках.');
                    const finalUpdateInfo = await GM_getValue(UPDATE_FLAG_KEY, null);
                    if (finalUpdateInfo && finalUpdateInfo.tabId === unsafeWindow.tabIdWatch) {
                        await GM_deleteValue(UPDATE_FLAG_KEY);
                    }
                    return;
                }
                let updateSuccessful = false;
                if (isGithubCheckEnabled || force) {
                    try {
                        console.log('[Card DB] Запускаю обновление с Gist...');
                        const fetchedData = await unsafeWindow.fetchCardDatabase();
                        if (fetchedData && fetchedData.length > 0) {
                            await populateDb(fetchedData);
                            if (!cardDatabaseMap) cardDatabaseMap = new Map(); else cardDatabaseMap.clear();
                            if (!cardImageIndex) cardImageIndex = new Map(); else cardImageIndex.clear();
                            fetchedData.forEach(card => {
                                cardDatabaseMap.set(card.id, card);
                                const compositeKey = normalizeImagePath(card.image);
                                if (compositeKey) cardImageIndex.set(compositeKey, card.id);
                            });
                            isDatabaseReady = true;
                            resetGlobalDbUnloadTimer();
                            console.log(`[Card DB] Данные немедленно загружены в ОЗУ: ${cardDatabaseMap.size} карт.`);
                            const successMessage = `База данных успешно обновлена с Gist! ${fetchedData.length} карт.`;
                            unsafeWindow.safeDLEPushCall('success', successMessage);
                            console.log(`[Card DB] ${successMessage}`);
                            updateSuccessful = true;
                        } else {
                            throw new Error("Ответ от Gist пуст.");
                        }
                    } catch (e) {
                        console.error('[Card DB] Ошибка обновления с Gist:', e.message);
                        if (!force) {
                            unsafeWindow.safeDLEPushCall('error', 'Gist недоступен. Запускаю резервную проверку...');
                        }
                    }
                }
                if (!updateSuccessful && isPageScanEnabled) {
                    if (typeof unsafeWindow.runFallbackCardScrape === 'function') {
                        console.log('[Card DB] Запускаю резервную проверку 2-х страниц сайта...');
                        await unsafeWindow.runFallbackCardScrape(2);
                        updateSuccessful = true;
                    }
                }
                if (updateSuccessful) {
                    await GM_setValue(LAST_DB_UPDATE_KEY, Date.now());
                    localStorage.removeItem('ascm_freshnessData_sharedCache');
                    freshnessData = null;
                    await prepareFreshnessData();
                    await updateFreshnessOverlays(true);
                    console.log('[Card DB] Процесс обновления успешно завершен.');
                } else if (!force) {
                    console.warn('[Card DB] Ни один из методов обновления не был выполнен.');
                }
            } catch (e) {
                console.error('[Card DB] Непредвиденная ошибка в процессе обновления:', e);
            } finally {
                const finalUpdateInfo = await GM_getValue(UPDATE_FLAG_KEY, null);
                if (finalUpdateInfo && finalUpdateInfo.tabId === unsafeWindow.tabIdWatch) {
                    await GM_deleteValue(UPDATE_FLAG_KEY);
                }
            }
        }

        // #######################################################################
        // Инициализация базы данных при старте скрипта.
        // #######################################################################
        unsafeWindow.initializeDatabase = async function() {
            const UPDATE_FLAG_KEY = 'ascm_db_update_in_progress';
            try {
                const updateInfo = await GM_getValue(UPDATE_FLAG_KEY, null);
                if (updateInfo && updateInfo.timestamp) {
                    console.warn('[Card DB] Обнаружен незавершенный процесс обновления! Перезапускаю...');
                    await unsafeWindow.updateLocalDatabase(true);
                } else {
                    await unsafeWindow.updateLocalDatabase(false);
                }
            } catch (error) {
                console.error('[Card DB] Критическая ошибка при инициализации базы данных:', error);
                await GM_deleteValue(UPDATE_FLAG_KEY);
            }
        }

        // ##############################################################################################################################################
        // # БЛОК: РЕЗЕРВНЫЙ СБОРЩИК КАРТ (FALLBACK SCRAPER)
        // ##############################################################################################################################################
        let isScraping = false;

        // #######################################################################
        // --- Вспомогательная функция для добавления новых карт в существующую базу ---
        // #######################################################################
        async function scraper_addCardsToDb(cards) {
            if (!cards || cards.length === 0) return;
            const db = await openDb();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(GIST_DB_STORE_NAME, 'readwrite');
                const store = transaction.objectStore(GIST_DB_STORE_NAME);
                cards.forEach(card => store.put(card));
                transaction.oncomplete = async () => {
                    if (!cardDatabaseMap) cardDatabaseMap = new Map();
                    if (!cardImageIndex) cardImageIndex = new Map();
                    cards.forEach(card => {
                        cardDatabaseMap.set(card.id, card);
                        const compositeKey = normalizeImagePath(card.image);
                        if (compositeKey) {
                            cardImageIndex.set(compositeKey, card.id);
                        }
                    });
                    isDatabaseReady = true;
                    resetGlobalDbUnloadTimer();
                    console.log(`[Fallback Scraper] Данные немедленно добавлены в ОЗУ: ${cards.length} новых карт.`);
                    localStorage.removeItem('ascm_freshnessData_sharedCache');
                    console.log('[Fallback Scraper] Кэш новизны (freshness) очищен после добавления новых карт.');
                    freshnessData = null;
                    await prepareFreshnessData();
                    await updateFreshnessOverlays(true);
                    resolve();
                };
                transaction.onerror = (event) => reject(event.target.error);
            });
        }

        // #######################################################################
        // --- Функция для парсинга HTML-страницы с картами ---
        // #######################################################################
        async function scraper_parseHtmlPage(doc) {
            const cardWrappers = doc.querySelectorAll('.anime-cards--full-page .anime-cards__item-wrapper');
            if (cardWrappers.length === 0) return 0;
            const newCards = [];
            await ensureDbLoaded();
            for (const wrapper of cardWrappers) {
                const card = wrapper.querySelector('.anime-cards__item');
                if (!card || !card.dataset.id) continue;
                const id = card.dataset.id;
                if (!cardDatabaseMap.has(id)) {
                    newCards.push({
                        id: id,
                        name: card.dataset.name || 'N/A',
                        rank: card.dataset.rank || 'N/A',
                        animeName: card.dataset.animeName || 'N/A',
                        animeLink: card.dataset.animeLink || '',
                        image: card.dataset.image || ''
                    });
                }
            }
            if (newCards.length > 0) {
                await scraper_addCardsToDb(newCards);
            }
            return newCards.length;
        }

        // #######################################################################
        // --- Функция для определения общего количества страниц ---
        // #######################################################################
        async function scraper_getTotalPages() {
            try {
                const response = await fetch('/cards/');
                const text = await response.text();
                const doc = new DOMParser().parseFromString(text, 'text/html');
                const lastPageLink = doc.querySelector('.pagination__pages a[href*="/cards/page/"]:last-of-type');
                return lastPageLink ? parseInt(lastPageLink.href.split('/page/')[1].replace('/', ''), 10) : 1;
            } catch (error) {
                console.error("[Fallback Scraper] Ошибка при получении количества страниц:", error);
                return 0;
            }
        }

        // #######################################################################
        // --- Главная функция, управляющая процессом сбора ---
        // #######################################################################
        async function scraper_runScan(pagesToScan = null, resumeState = null) {
            if (isScraping && !resumeState) {
                safeDLEPushCall('warning', 'Процесс сбора уже запущен.');
                return;
            }
            isScraping = true;
            let state;
            try {
                if (resumeState) {
                    state = resumeState;
                } else {
                    let totalPages = pagesToScan;
                    if (!totalPages) {
                        const confirmation = await protector_customConfirm('Запустить полный сбор данных со всех страниц?<br>Это может занять много времени.');
                        if (!confirmation) { isScraping = false; return; }
                        safeDLEPushCall('info', 'Определяю общее количество страниц...');
                        totalPages = await scraper_getTotalPages();
                        if (totalPages === 0) {
                            safeDLEPushCall('error', 'Не удалось определить количество страниц. Сбор отменен.');
                            isScraping = false; return;
                        }
                    }
                    state = { isRunning: true, totalPages: totalPages, currentPage: 0, totalNewCards: 0 };
                }
                const scanType = (state.totalPages === pagesToScan) ? `Резервная проверка (${state.totalPages} стр.)` : "Полный сбор";
                if (!resumeState) {
                    safeDLEPushCall('info', `${scanType} запущен...`);
                }
                console.log(`[Fallback Scraper] ${scanType} запущен... Всего страниц: ${state.totalPages}. Начинаем с ${state.currentPage + 1}.`);
                updateDbModalUI(true);
                for (let i = state.currentPage + 1; i <= state.totalPages; i++) {
                    if (!isScraping) {
                        console.log('[Fallback Scraper] Процесс прерван вручную.');
                        safeDLEPushCall('info', 'Сбор остановлен пользователем.');
                        break;
                    }
                    state.currentPage = i;
                    await GM_setValue(SCRAPE_STATE_KEY, state);
                    updateDbModalUI(true, state);
                    const url = `/cards/page/${i}/`;
                    try {
                        const response = await fetch(url);
                        const htmlText = await response.text();
                        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
                        const foundCount = await scraper_parseHtmlPage(doc);
                        state.totalNewCards += foundCount;
                        if(foundCount > 0) console.log(`[Fallback Scraper] Страница ${i}: Найдено ${foundCount} новых карт.`);
                    } catch (error) {
                        console.error(`[Fallback Scraper] Ошибка при обработке страницы ${i}:`, error);
                        safeDLEPushCall('error', `Ошибка при обработке страницы ${i}.`);
                    }
                    await sleep(1000 + Math.random() * 500);
                }
                if (isScraping) {
                    const finalMessage = (state.totalNewCards > 0)
                    ? `${scanType} завершен! Найдено и добавлено ${state.totalNewCards} новых карт.`
                    : `${scanType} завершен. Новых карт не найдено.`;
                    safeDLEPushCall('success', finalMessage.replace(/\n/g, ' '));
                    console.log(`[Fallback Scraper] ${finalMessage}`);
                    await scraper_sortAndRewriteDatabase();
                }
            } catch(e) {
                safeDLEPushCall('error', 'Произошла критическая ошибка во время сбора.');
                console.error('[Fallback Scraper] Критическая ошибка:', e);
            } finally {
                isScraping = false;
                await GM_deleteValue(SCRAPE_STATE_KEY);
                if (state && state.totalNewCards > 0 && !document.getElementById('db_settings_modal')) {
                    console.log(`[Fallback Scraper] Процесс прерван, найдено ${state.totalNewCards} новых карт. Запускаю фоновую сортировку...`);
                    await scraper_sortAndRewriteDatabase();
                } else if (state && state.totalNewCards > 0) {
                    updateDbModalUI(true, { ...state, currentPage: state.totalPages, totalPages: state.totalPages });
                    await scraper_sortAndRewriteDatabase();
                }
                updateDbModalUI(false);
                resetGlobalDbUnloadTimer();
            }
        }
        unsafeWindow.runFullCardScrape = () => scraper_runScan();
        unsafeWindow.runFallbackCardScrape = (pages) => scraper_runScan(pages);

        // #######################################################################
        // --- ФУНКЦИЯ: Сортирует и полностью перезаписывает базу данных ---
        // #######################################################################
        async function scraper_sortAndRewriteDatabase() {
            const DB_SORT_LOCK_KEY = 'ascm_db_sort_lock';
            const DB_SORT_LOCK_TTL_MS = 1 * 60 * 1000;
            const now = Date.now();
            const currentLock = await GM_getValue(DB_SORT_LOCK_KEY, null);
            if (currentLock && (now - currentLock.timestamp < DB_SORT_LOCK_TTL_MS)) {
                console.log(`[DB Sort] Сортировка пропущена, так как процесс уже запущен в другой вкладке (ID: ${currentLock.tabId}).`);
                return;
            }
            await GM_setValue(DB_SORT_LOCK_KEY, { tabId: unsafeWindow.tabIdWatch, timestamp: now });
            console.log('[DB Sort] Блокировка установлена. Начало полной сортировки локальной базы данных...');
            safeDLEPushCall('info', 'Сортировка локальной базы...');
            try {
                const allCards = await getAllCardsFromDB();
                if (allCards.length === 0) {
                    console.log('[DB Sort] База пуста, сортировка не требуется.');
                    return;
                }
                allCards.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
                const db = await openDb();
                const transaction = db.transaction(GIST_DB_STORE_NAME, 'readwrite');
                const store = transaction.objectStore(GIST_DB_STORE_NAME);
                await new Promise((resolve, reject) => {
                    const req = store.clear();
                    req.onsuccess = resolve;
                    req.onerror = reject;
                });
                for (const card of allCards) {
                    store.put(card);
                }
                await new Promise((resolve, reject) => {
                    transaction.oncomplete = resolve;
                    transaction.onerror = reject;
                });
                console.log(`[DB Sort] База данных успешно отсортирована и перезаписана. Всего карт: ${allCards.length}.`);
                safeDLEPushCall('success', 'Локальная база успешно отсортирована!');
            } catch (error) {
                console.error('[DB Sort] Критическая ошибка во время сортировки базы:', error);
                safeDLEPushCall('error', 'Ошибка при сортировке локальной базы!');
            } finally {
                const finalLock = await GM_getValue(DB_SORT_LOCK_KEY);
                if (finalLock && finalLock.tabId === unsafeWindow.tabIdWatch) {
                    await GM_deleteValue(DB_SORT_LOCK_KEY);
                    console.log('[DB Sort] Сортировка завершена, блокировка снята.');
                }
            }
        }

        // ##############################################################################################################################################
        // # КОНЕЦ БЛОКА: РЕЗЕРВНЫЙ СБОРЩИК КАРТ (FALLBACK SCRAPER)
        // ##############################################################################################################################################

        // ##############################################################################################################################################
        // # БЛОК: ПОДСВЕТКА КОЛОД БЕЗ S-РАНГА
        // ##############################################################################################################################################
        unsafeWindow.applyNoSRankGlowStyle = async function() {
            const DYNAMIC_STYLE_ID = 'no-s-rank-glow-dynamic-style';
            let styleElement = document.getElementById(DYNAMIC_STYLE_ID);
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = DYNAMIC_STYLE_ID;
                document.head.appendChild(styleElement);
            }
            const [largeDeckColor, smallDeckColor, sRankDeckColor] = await Promise.all([
                GM_getValue(NO_S_RANK_GLOW_COLOR_KEY, DEFAULT_NO_S_RANK_GLOW_COLOR),
                GM_getValue(SMALL_DECK_NO_S_RANK_GLOW_COLOR_KEY, DEFAULT_SMALL_DECK_NO_S_RANK_GLOW_COLOR),
                GM_getValue(S_RANK_DECK_GLOW_COLOR_KEY, DEFAULT_S_RANK_DECK_GLOW_COLOR)
            ]);
            styleElement.textContent = `
                    /* Подготовка элементов для ВНУТРЕННЕЙ подсветки колод */
                    .anime-cards__item.no-s-rank-glow, .anime-cards__item.small-deck-no-s-rank-glow, .anime-cards__item.s-rank-deck-glow,
                    .trade__inventory-item.no-s-rank-glow, .trade__inventory-item.small-deck-no-s-rank-glow, .trade__inventory-item.s-rank-deck-glow,
                    .trade__main-item.no-s-rank-glow, .trade__main-item.small-deck-no-s-rank-glow, .trade__main-item.s-rank-deck-glow,
                    .lootbox__card.no-s-rank-glow, .lootbox__card.small-deck-no-s-rank-glow, .lootbox__card.s-rank-deck-glow {
                        position: relative;
                    }
                    /* Псевдо-элемент для ВСЕХ страниц, КРОМЕ паков (отступ 3px) */
                    .anime-cards__item.no-s-rank-glow::before, .anime-cards__item.small-deck-no-s-rank-glow::before, .anime-cards__item.s-rank-deck-glow::before,
                    .trade__inventory-item.no-s-rank-glow::before, .trade__inventory-item.small-deck-no-s-rank-glow::before, .trade__inventory-item.s-rank-deck-glow::before,
                    .trade__main-item.no-s-rank-glow::before, .trade__main-item.small-deck-no-s-rank-glow::before, .trade__main-item.s-rank-deck-glow::before {
                        content: '';
                        position: absolute;
                        top: 3px; left: 3px; right: 3px; bottom: 3px;
                        border-radius: 10px;
                        pointer-events: none;
                        z-index: 1;
                    }
                    /* Псевдо-элемент ТОЛЬКО для паков (отступ 1px) */
                    .lootbox__card.no-s-rank-glow::before, .lootbox__card.small-deck-no-s-rank-glow::before, .lootbox__card.s-rank-deck-glow::before {
                        content: '';
                        position: absolute;
                        top: 1px; left: 1px; right: 1px; bottom: 1px;
                        border-radius: 10px;
                        pointer-events: none;
                        z-index: 1;
                    }
                    /* Свечение для больших колод (10+) БЕЗ S */
                    .anime-cards__item.no-s-rank-glow::before, .trade__inventory-item.no-s-rank-glow::before, .trade__main-item.no-s-rank-glow::before, .lootbox__card.no-s-rank-glow::before {
                        box-shadow: inset 0 0 15px 1px ${largeDeckColor} !important;
                    }
                    /* Свечение для малых колод (1-9) БЕЗ S */
                    .anime-cards__item.small-deck-no-s-rank-glow::before, .trade__inventory-item.small-deck-no-s-rank-glow::before, .trade__main-item.small-deck-no-s-rank-glow::before, .lootbox__card.small-deck-no-s-rank-glow::before {
                        box-shadow: inset 0 0 15px 1px ${smallDeckColor} !important;
                    }
                    /* Свечение для колод С S-рангом */
                    .anime-cards__item.s-rank-deck-glow::before, .trade__inventory-item.s-rank-deck-glow::before, .trade__main-item.s-rank-deck-glow::before, .lootbox__card.s-rank-deck-glow::before {
                        box-shadow: inset 0 0 15px 1px ${sRankDeckColor} !important;
                    }
                `;
        }
        const animeDeckCache = new Map();
        const animeSRankCache = new Map();
        unsafeWindow.highlightNoSRankDecks = async function() {
            const glowOnPacks = await GM_getValue(NO_S_RANK_GLOW_PACKS_KEY, false);
            const glowOnInventory = await GM_getValue(NO_S_RANK_GLOW_INVENTORY_KEY, false);
            const glowOnTrades = await GM_getValue(NO_S_RANK_GLOW_TRADES_KEY, false);
            const glowOnOffers = await GM_getValue(NO_S_RANK_GLOW_OFFERS_KEY, false);
            const glowOnCardBase = await GM_getValue(NO_S_RANK_GLOW_CARDBASE_KEY, false);
            const isLargeDeckGlowEnabled = await GM_getValue(LARGE_DECK_GLOW_ENABLED_KEY, true);
            const isSmallDeckGlowEnabled = await GM_getValue(SMALL_DECK_GLOW_ENABLED_KEY, true);
            const isSRankDeckGlowEnabled = await GM_getValue(S_RANK_DECK_GLOW_ENABLED_KEY, true);
            const isAnyGlowEnabledOnThisPage =
                (isCardPackPage() && glowOnPacks) ||
                (isMyCardPage() && glowOnInventory) ||
                (isTradeCreationPage() && glowOnTrades) ||
                (isTradeOfferPage() && glowOnOffers) ||
                (isCardBasePage() && glowOnCardBase);
            if (!isAnyGlowEnabledOnThisPage) {
                document.querySelectorAll('.no-s-rank-glow, .small-deck-no-s-rank-glow, .s-rank-deck-glow').forEach(el => {
                    el.classList.remove('no-s-rank-glow', 'small-deck-no-s-rank-glow', 's-rank-deck-glow');
                });
                return;
            }
            try {
                await ensureDbLoaded();
                if (!isDatabaseReady || !cardDatabaseMap || cardDatabaseMap.size === 0) {
                    return;
                }
                const cardsOnPage = getCardsOnPage();
                for (const cardEl of cardsOnPage) {
                    const shouldProcess =
                        (cardEl.matches('.lootbox__card') && glowOnPacks) ||
                        (cardEl.matches('.anime-cards__item') && (isMyCardPage() ? glowOnInventory : isCardBasePage() && glowOnCardBase)) ||
                        (cardEl.matches('.trade__inventory-item') && isTradeCreationPage() && glowOnTrades) ||
                        (cardEl.matches('.trade__main-item') && isTradeOfferPage() && glowOnOffers);
                    if (!shouldProcess) {
                        cardEl.classList.remove('no-s-rank-glow', 'small-deck-no-s-rank-glow', 's-rank-deck-glow');
                        continue;
                    }
                    const typeId = await getCardId(cardEl, 'type', true);
                    if (!typeId) continue;
                    const cardFromDb = cardDatabaseMap.get(typeId);
                    if (!cardFromDb || !cardFromDb.animeName) continue;
                    const animeName = cardFromDb.animeName;
                    if (!animeDeckCache.has(animeName)) {
                        let count = 0;
                        let hasSRank = false;
                        for (const dbCard of cardDatabaseMap.values()) {
                            if (dbCard.animeName === animeName) {
                                if (dbCard.rank.toLowerCase() !== 'sss' && dbCard.rank.toLowerCase() !== 'ass') {
                                    count++;
                                }
                                if (dbCard.rank.toLowerCase() === 's') {
                                    hasSRank = true;
                                }
                            }
                        }
                        animeDeckCache.set(animeName, count);
                        animeSRankCache.set(animeName, hasSRank);
                    }
                    const deckSize = animeDeckCache.get(animeName);
                    const hasS = animeSRankCache.get(animeName);
                    cardEl.classList.remove('no-s-rank-glow', 'small-deck-no-s-rank-glow', 's-rank-deck-glow');
                    if (!hasS) {
                        if (deckSize >= 10 && isLargeDeckGlowEnabled) {
                            cardEl.classList.add('no-s-rank-glow');
                        } else if (deckSize >= 1 && deckSize <= 9 && isSmallDeckGlowEnabled) {
                            cardEl.classList.add('small-deck-no-s-rank-glow');
                        }
                    } else {
                        if (deckSize >= 10 && isSRankDeckGlowEnabled) {
                            cardEl.classList.add('s-rank-deck-glow');
                        }
                    }
                }
            } catch (error) {
                console.error('[No-S Glow] Ошибка при подсветке колод:', error);
            }
        }
        // ##############################################################################################################################################
        // # КОНЕЦ БЛОКА
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
        const sleep = ms => {
            return new Promise(resolve => setTimeout(resolve, ms));
        };
        unsafeWindow.sleep = sleep;

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
        // # Получает полный домен текущей страницы
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
            const db = await openDb();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(OWNER_MAP_STORE_NAME, 'readwrite');
                const store = transaction.objectStore(OWNER_MAP_STORE_NAME);
                const key = 'o_' + ownerId;
                const data = { ownerId: key, typeId: typeId, lastUpdated: Date.now() };
                store.put(data);
                transaction.oncomplete = () => resolve();
                transaction.onerror = (event) => {
                    console.error(`Ошибка IndexedDB при записи ownerId "${key}":`, event.target.error);
                    reject(event.target.error);
                };
            });
        }

        // #######################################################################
        // # Получает ID типа карты из кеша по ID ее экземпляра.
        // #######################################################################
        async function getTypeIdFromOwnerCache(ownerId) {
            if (!ownerId) return null;
            const db = await openDb();
            return new Promise(async (resolve) => {
                const transaction = db.transaction(OWNER_MAP_STORE_NAME, 'readwrite');
                const store = transaction.objectStore(OWNER_MAP_STORE_NAME);
                const key = 'o_' + ownerId;
                const request = store.get(key);
                request.onsuccess = () => {
                    const entry = request.result;
                    if (entry && entry.typeId) {
                        if (Date.now() - entry.lastUpdated > OWNER_ID_CACHE_TTL_HOURS * 3600000) {
                            store.delete(key);
                            resolve(null);
                        } else {
                            resolve(entry.typeId);
                        }
                    } else {
                        resolve(null);
                    }
                };
                request.onerror = () => resolve(null);
            });
        }


        // #######################################################################
        // # Сохраняет данные в кеш GM с указанным временем жизни (TTL).
        // #######################################################################
        async function setCache(key, data, ttlInSeconds) {
            const db = await openDb();
            return new Promise((resolve, reject) => {
                const expires = Date.now() + ttlInSeconds * 1000;
                const cacheData = { data, expires };
                const transaction = db.transaction(DEMAND_CACHE_STORE_NAME, 'readwrite');
                const store = transaction.objectStore(DEMAND_CACHE_STORE_NAME);
                const request = store.put(cacheData, key);
                transaction.oncomplete = () => resolve();
                transaction.onerror = (event) => {
                    console.error(`Ошибка IndexedDB при записи ключа "${key}":`, event.target.error);
                    reject(event.target.error);
                };
            });
        }

        // #######################################################################
        // # Извлекает данные из кеша GM, если срок их жизни еще не истек.
        // #######################################################################
        async function getCache(key) {
            const db = await openDb();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(DEMAND_CACHE_STORE_NAME, 'readwrite');
                const store = transaction.objectStore(DEMAND_CACHE_STORE_NAME);
                const request = store.get(key);
                request.onsuccess = () => {
                    const cacheData = request.result;
                    if (!cacheData) {
                        resolve(null);
                        return;
                    }
                    if (Date.now() > cacheData.expires) {
                        store.delete(key);
                        resolve(null);
                    } else {
                        resolve(cacheData.data);
                    }
                };
                request.onerror = (event) => {
                    console.error(`Ошибка IndexedDB при чтении ключа "${key}":`, event.target.error);
                    resolve(null);
                };
            });
        }
        unsafeWindow.getCache = getCache;
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
            const db = await openDb();
            const transaction = db.transaction([DEMAND_CACHE_STORE_NAME, OWNER_MAP_STORE_NAME], 'readwrite');
            const demandStore = transaction.objectStore(DEMAND_CACHE_STORE_NAME);
            const ownerMapStore = transaction.objectStore(OWNER_MAP_STORE_NAME);
            let clearedCount = 0;
            await new Promise(resolve => {
                const req1 = demandStore.clear();
                const req2 = ownerMapStore.clear();
                let completed = 0;
                const checkCompletion = () => {
                    completed++;
                    if (completed === 2) resolve();
                };
                req1.onsuccess = () => { clearedCount++; checkCompletion(); };
                req2.onsuccess = () => { clearedCount++; checkCompletion(); };
                req1.onerror = checkCompletion;
                req2.onerror = checkCompletion;
            });
            if (clearedCount > 0) {
                safeDLEPushCall('success', `Кэш очищен: кэш спроса, кэш связей ID.`);
            } else {
                safeDLEPushCall('info', 'Нет данных для очистки в кэше.');
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
            for (const cardElement of cardsOnPage) {
                const typeId = await getCardId(cardElement, 'type', true);
                if (typeId) {
                    uniqueCardIds.add(typeId);
                }
            }
            if (uniqueCardIds.size === 0) {
                safeDLEPushCall('info', 'Не удалось определить ID карт для очистки кэша.');
                return;
            }
            console.log(`Очистка кэша спроса для карт:`, Array.from(uniqueCardIds));
            const db = await openDb();
            const transaction = db.transaction(DEMAND_CACHE_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(DEMAND_CACHE_STORE_NAME);
            let clearedCount = 0;
            const deletePromises = Array.from(uniqueCardIds).map(cardId => {
                return new Promise(resolve => {
                    const cacheKey = 'cardId: ' + cardId;
                    const request = store.delete(cacheKey);
                    request.onsuccess = () => {
                        const checkReq = store.get(cacheKey);
                        checkReq.onsuccess = () => {
                            if (checkReq.result === undefined) {
                                clearedCount++;
                            }
                            resolve();
                        };
                        checkReq.onerror = resolve;
                    };
                    request.onerror = resolve;
                });
            });
            await Promise.all(deletePromises);
            if (clearedCount > 0) {
                safeDLEPushCall('success', `Кэш для ${clearedCount} уникальных карт на странице очищен.`);
                for (const cardEl of cardsOnPage) {
                    const typeId = await getCardId(cardEl, 'type', true);
                    if (typeId && uniqueCardIds.has(typeId)) {
                        cardEl.querySelector('.acm-stats-wrapper')?.remove();
                        cardEl.querySelector('.acm-card-stats')?.remove();
                        removeCheckMarkOrDemandButton(cardEl);
                    }
                }
                await addDemandCheckButtonsToCards();
            } else {
                safeDLEPushCall('info', 'В кэше не найдено записей для карт на этой странице.');
            }
        }

        // #######################################################################
        // # Добавляет на страницу кнопку для очистки кэша только для карт на текущей странице.
        // #######################################################################
        function addClearPageCacheFeature() {
            if (window.location.pathname.includes('/clubs/boost/')) return;
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
        // # КНОПКА ДЛЯ ПРОВЕРКИ НОВИЗНЫ КАРТ НА СТРАНИЦАХ ОБМЕНА
        // #######################################################################
        const isSpecificTradeOfferPage = () => /^\/cards\/\d+\/trade\/?$/i.test(window.location.pathname);
        (async () => {
            const isFreshnessFeatureEnabled = await GM_getValue(FRESHNESS_OVERLAY_ENABLED_KEY, true);
            if ((isSpecificTradeOfferPage() || isRemeltPage()) && isFreshnessFeatureEnabled) {
                const freshnessButton = getButton(
                    'checkFreshnessBtn',
                    'leaf',
                    330,
                    'Проверить новизну карт',
                    toggleFreshnessCheck
                );
                document.body.appendChild(freshnessButton);
                const activeKey = isRemeltPage() ? FRESHNESS_REMELT_ACTIVE_KEY : FRESHNESS_TRADE_ACTIVE_KEY;
                isFreshnessCheckActive = await GM_getValue(activeKey, false);
                updateFreshnessButtonUI();
                if (isFreshnessCheckActive) {
                    await activateFreshnessCheckLogic();
                }
            }
        })();

        // #######################################################################
        // # Проверяет, является ли страница страницей ИСТОРИИ обменов
        // #######################################################################
        const isTradeHistoryPage = () => window.location.pathname.startsWith('/trades/history/');

        // #######################################################################
        // # Загружает статистику карты (спрос, предложение, владельцы) с ее страницы, используя кэш.
        // #######################################################################
        const pendingDemandRequests = new Map();
        unsafeWindow.loadCard = async function(cardId) {
            if (pendingDemandRequests.has(cardId)) {
                console.log(`Спрос для ID ${cardId} уже запрашивается. Ожидаю завершения...`);
                return pendingDemandRequests.get(cardId);
            }
            const cacheKey = 'cardId: ' + cardId;
            const cachedCard = await getCard(cacheKey);
            if (cachedCard && Object.keys(cachedCard).length) {
                console.log(`Спрос для ID ${cardId} найден в кэше.`);
                return cachedCard;
            }
            const requestPromise = (async () => {
                console.log(`Кэш спроса пуст для ID ${cardId}.\nДелаю запрос на получение спроса...`);
                const currentDomain = getCurrentDomain();
                const cardUsersUrl = `${currentDomain}/cards/users/?id=${cardId}/`;
                const MAX_FETCH_ATTEMPTS = 2;
                const FETCH_RETRY_DELAY = 1000;
                for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt++) {
                    try {
                        const response = await fetch(cardUsersUrl);
                        if (response.ok) {
                            const html = await response.text();
                            const doc = new DOMParser().parseFromString(html, 'text/html');
                            const needCount = parseInt(doc.querySelector('#owners-need')?.textContent.trim(), 10) || 0;
                            const tradeCount = parseInt(doc.querySelector('#owners-trade')?.textContent.trim(), 10) || 0;
                            const popularityCount = parseInt(doc.querySelector('#owners-count')?.textContent.trim(), 10) || 0;

                            const card = { popularityCount, needCount, tradeCount };
                            await cacheCard(cacheKey, card);
                            return card;
                        }
                        console.error(`Попытка ${attempt}/${MAX_FETCH_ATTEMPTS}: Не удалось загрузить страницу /users/: ${response.status} для карты ${cardId}`);
                        if (attempt < MAX_FETCH_ATTEMPTS) await sleep(FETCH_RETRY_DELAY);

                    } catch (error) {
                        console.error(`Попытка ${attempt}/${MAX_FETCH_ATTEMPTS}: Ошибка при запросе к карте ${cardId}:`, error);
                        if (attempt < MAX_FETCH_ATTEMPTS) await sleep(FETCH_RETRY_DELAY);
                    }
                }
                return { popularityCount: 0, needCount: 0, tradeCount: 0 };
            })();
            pendingDemandRequests.set(cardId, requestPromise);
            requestPromise.finally(() => {
                pendingDemandRequests.delete(cardId);
            });
            return requestPromise;
        };

        // #######################################################################
        // # Обновляет DOM-элемент карты, добавляя в него блок со статистикой (спрос, предложение).
        // #######################################################################
        async function updateCardInfo(cardId, element, triggeredByIndividualButton = false) {
            if (!cardId || !element) return;
            const cardWidth = element.offsetWidth;
            const baseIconSize = await GM_getValue('ascm_statsIconSize', 11);
            const baseFontSize = await GM_getValue('ascm_statsFontSize', 12);
            const standardCardWidth = 150;
            const scaleFactor = cardWidth / standardCardWidth;
            let finalFontSize = Math.round(Math.max(9, Math.min(20, baseFontSize * scaleFactor)));
            let finalIconSize = Math.round(Math.max(8, Math.min(19, baseIconSize * scaleFactor)));
            const isCollectorCard = element.classList.contains('ca-card-item');
            const demandButton = element.querySelector(isCollectorCard ? '.ca-check-demand-btn' : '.check-demand-btn');
            if (demandButton && triggeredByIndividualButton) {
                demandButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                demandButton.style.pointerEvents = 'none';
            }
            try {
                const card = await unsafeWindow.loadCard(cardId);
                if (card && typeof card.needCount !== 'undefined') {
                    element.dataset.needCount = card.needCount;
                }
                const DEFAULT_RANK_COLORS = { e: 'rgb(156, 111, 81)', d: 'rgb(160, 155, 145)', c: 'rgb(1, 145, 69)', b: 'rgb(32, 148, 228)', a: 'rgb(217, 49, 52)', s: 'rgb(167, 76, 207)', ass: 'rgb(119, 44, 232)', sss: 'rgb(207, 207, 207)' };
                const DEFAULT_ICON_COLORS = { need: '#43b581', trade: '#faa61a', owners: '#54a8ee' };
                const [rankColors, iconColors] = await Promise.all([
                    (async () => {
                        const colors = {};
                        for (const rankKey of Object.keys(DEFAULT_RANK_COLORS)) {
                            colors[rankKey] = await GM_getValue(`ascm_rankColor_${rankKey}`, DEFAULT_RANK_COLORS[rankKey]);
                        }
                        return colors;
                    })(),
                    (async () => {
                        const colors = {};
                        for (const iconKey of Object.keys(DEFAULT_ICON_COLORS)) {
                            colors[iconKey] = await GM_getValue(`ascm_iconColor_${iconKey}`, DEFAULT_ICON_COLORS[iconKey]);
                        }
                        return colors;
                    })()
                ]);
                let rank = element.dataset.rank?.toLowerCase();
                if (!rank) {
                    const imgElement = element.querySelector('img');
                    if (imgElement) {
                        const imageUrl = imgElement.dataset.src || imgElement.src;
                        if (imageUrl) {
                            const match = imageUrl.match(/\/cards_image\/\d+\/([a-z]+)\//);
                            if (match && match[1]) {
                                rank = match[1];
                            }
                        }
                    }
                }
                const color = rankColors[rank] || 'inherit';
                element.querySelector('.acm-stats-wrapper')?.remove();
                element.closest('.ca-card-wrapper')?.querySelector('.ca-card-demand-stats')?.remove();
                const statsHTML = `
                    <span title="Хотят получить"><i class="fas fa-shopping-cart" style="color: ${iconColors.need}; font-size: ${finalIconSize}px !important; line-height: 0;"></i> <span style="position: relative; z-index: 2; color: ${color} !important; text-shadow: 1.5px 0 0 #1b1b1b, -1px 0 0 #1b1b1b, 0 1px 0 #1b1b1b, 0 -1px 0 #1b1b1b, 0 0 4px #1b1b1b !important; font-size: ${finalFontSize}px !important; line-height: 0;">${card.needCount}</span></span>
                    <span title="Готовы обменять"><i class="fas fa-sync-alt" style="color: ${iconColors.trade}; font-size: ${finalIconSize}px !important; line-height: 0;"></i> <span style="position: relative; z-index: 2; color: ${color} !important; text-shadow: 1.5px 0 0 #1b1b1b, -1px 0 0 #1b1b1b, 0 1px 0 #1b1b1b, 0 -1px 0 #1b1b1b, 0 0 4px #1b1b1b !important; font-size: ${finalFontSize}px !important; line-height: 0;">${card.tradeCount}</span></span>
                    <span title="Владельцев"><i class="fas fa-users" style="color: ${iconColors.owners}; font-size: ${finalIconSize}px !important; line-height: 0;"></i> <span style="position: relative; z-index: 2; color: ${color} !important; text-shadow: 1.5px 0 0 #1b1b1b, -1px 0 0 #1b1b1b, 0 1px 0 #1b1b1b, 0 -1px 0 #1b1b1b, 0 0 4px #1b1b1b !important; font-size: ${finalFontSize}px !important; line-height: 0;">${card.popularityCount}</span></span>
                    `;
                if (isCollectorCard) {
                    const wrapper = element.closest('.ca-card-wrapper');
                    if (wrapper) {
                        const ownerDiv = wrapper.querySelector('.ca-card-owner');
                        if (ownerDiv) {
                            const statsDiv = document.createElement('div');
                            statsDiv.className = 'ca-card-demand-stats';
                            statsDiv.innerHTML = statsHTML;
                            Object.assign(statsDiv.style, {
                                padding: '6px 0', textAlign: 'center', fontSize: '0.9em',
                                backgroundColor: 'var(--panel-bg)'
                            });
                            wrapper.insertBefore(statsDiv, ownerDiv);
                        }
                    }
                    if (demandButton) demandButton.remove();
                } else if (element.classList.contains('noffer')) {
                    const stats = document.createElement('div');
                    stats.className = 'acm-card-stats';
                    stats.innerHTML = statsHTML;
                    const nofferLeft = element.querySelector('.noffer__left');
                    const nofferMain = nofferLeft ? nofferLeft.querySelector('.noffer__main') : null;
                    if (nofferMain) {
                        nofferMain.insertAdjacentElement('afterend', stats);
                    } else if (nofferLeft) {
                        nofferLeft.appendChild(stats);
                    } else {
                        element.appendChild(stats);
                    }
                    if (demandButton) demandButton.remove();
                } else {
                    const statsWrapper = document.createElement('div');
                    statsWrapper.className = 'acm-stats-wrapper';
                    const stats = document.createElement('div');
                    stats.className = 'acm-card-stats';
                    stats.innerHTML = statsHTML;
                    statsWrapper.appendChild(stats);
                    element.appendChild(statsWrapper);
                if (card.needCount !== undefined) {
                    removeCheckMarkOrDemandButton(element);
                }
            }
            if (triggeredByIndividualButton) {
                }
            } catch (error) {
                console.error(`Ошибка обновления информации о карте ${cardId}:`, error);
                if (demandButton && triggeredByIndividualButton) {
                    demandButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                    demandButton.style.pointerEvents = 'auto';
                    safeDLEPushCall('error', `Не удалось загрузить спрос для карты ID ${cardId}`);
                }
            }
        }
        unsafeWindow.updateCardInfo = updateCardInfo;

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
            const filteredCards = allPotentialCards.filter(card => !card.classList.contains('club-boost__image'));
            let visibleCards = [];
            if (isCardPackPage()) {
                const lootboxRow = document.querySelector('.lootbox__row');
                if (lootboxRow) {
                    if (lootboxRow.offsetParent !== null) {
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
                filteredCards.forEach(card => {
                    if (!card.closest('.lootbox__row') && card.offsetParent !== null && !card.closest('#cards-carousel')) {
                        if (!visibleCards.includes(card)) {
                            visibleCards.push(card);
                        }
                    }
                });
            } else {
                visibleCards = filteredCards.filter(card => {
                    if (card.offsetParent === null) {
                        return false;
                    }
                    if (card.closest('.owl-item')) {
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
                console.log('[AnimeStars Card Master] Массовая проверка дубликатов принудительно остановлена.');
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
        // ГЛОБАЛЬНЫЙ МЕХАНИЗМ ВОЗОБНОВЛЕНИЯ ПРОВЕРКИ СПРОСА ("БУДИЛЬНИК")
        // #######################################################################
        let globalResumeIntervalId = null;
        function startResumeWatcher() {
            if (globalResumeIntervalId) return;
            console.log('[Demand Watcher] Глобальный наблюдатель за возобновлением активирован.');
            globalResumeIntervalId = setInterval(async () => {
                if (isProcessCardsRunning || !isPausedByAnotherTab) {
                    return;
                }
                const tasks = await GM_getValue(DEMAND_TASK_STACK_KEY, []);
                const activeTask = tasks[0];
                if (activeTask && activeTask.tabId === unsafeWindow.tabIdWatch) {
                    console.log('[Demand Watcher] Моя задача стала активной! Возобновляю...');
                    isPausedByAnotherTab = false;
                }
                else if (tasks.length === 0) {
                    console.log('[Demand Watcher] Стек задач пуст. Выхожу из режима паузы.');
                    isPausedByAnotherTab = false;
                }
            }, 2000);
        }

        // #######################################################################
        // #######################################################################
        function stopResumeWatcher() {
            if (globalResumeIntervalId) {
                clearInterval(globalResumeIntervalId);
                globalResumeIntervalId = null;
                console.log('[Demand Watcher] Глобальный наблюдатель остановлен.');
            }
        }

        // #######################################################################
        // Вспомогательная функция для асинхронного ожидания выполнения условия
        // #######################################################################
        async function waitUntil(conditionFunction, checkInterval = 500) {
            while (!conditionFunction()) {
                await sleep(checkInterval);
            }
        }

        // #######################################################################
        // # Основная функция для массовой проверки спроса на карты (текущая страница или все страницы с пагинацией).
        // #######################################################################
        async function processCards(checkAllPages = false, isAutoTriggered = false) {
            const thisCheckInstanceId = ++currentDemandCheckInstanceId;
            if (window.location.pathname.includes('/clubs/boost/')) {
                console.log('[ACM] Проверка спроса отключена на странице вкладов.');
                return;
            }
            if (isAutoTriggered) {
                const settings = await unsafeWindow.autoDemandTrade_loadSettings();
                const ranksToCheck = Object.keys(settings).filter(rank => settings[rank]);
                if (ranksToCheck.length === 0) return;
                let cardsForAutoCheck = [];
                if (isCardPackPage()) {
                    cardsForAutoCheck = Array.from(document.querySelectorAll('.lootbox__row .lootbox__card'));
                } else if (window.location.pathname.startsWith('/trades/')) {
                    cardsForAutoCheck = Array.from(document.querySelectorAll('.trade__main-item'));
                }
                if (cardsForAutoCheck.length === 0) return;
                const processingPromises = cardsForAutoCheck.map(async (cardElement) => {
                    const typeCardId = await getCardId(cardElement, 'type');
                    if (!typeCardId) return;
                    let rank = cardElement.dataset.rank?.toLowerCase();
                    if (!rank) {
                        const img = cardElement.querySelector('img');
                        if (img) {
                            const imageUrl = img.dataset.src || img.src;
                            if (imageUrl) {
                                const match = imageUrl.match(/\/cards_image\/\d+\/([a-z]+)\//);
                                if (match && match[1]) {
                                    rank = match[1];
                                }
                            }
                        }
                    }
                    if (rank && ranksToCheck.includes(rank)) {
                        try {
                            await updateCardInfo(typeCardId, cardElement, false);
                        } catch (e) {
                            console.error(`Ошибка при авто-проверке спроса для карты ${typeCardId}:`, e);
                        }
                    }
                });
                await Promise.all(processingPromises);
                return;
            }
            const myTask = { tabId: unsafeWindow.tabIdWatch, checkAllPages: checkAllPages, timestamp: Date.now() };
            if (isProcessCardsRunning) {
                shouldStopProcessCards = true;
                sessionStorage.setItem('stopDemandCheck', 'true');
                console.log('[processCards] Пользователь нажал "Стоп". Устанавливаю флаг остановки.');
                safeDLEPushCall('warning', 'Массовая проверка спроса прервана пользователем.');
                const btnSinglePage = document.getElementById('processCards');
                const btnAllPages = document.getElementById('processAllPagesBtn');
                const activeBtn = (btnSinglePage && btnSinglePage.style.background.includes('rgb(50, 200, 50)')) ? btnSinglePage : btnAllPages;
                if (activeBtn) {
                    const icon = activeBtn.querySelector('span:first-child');
                    if (icon) {
                        icon.className = 'fas fa-spinner';
                        icon.style.animation = 'acm-spin 1s linear infinite';
                    }
                    activeBtn.style.background = 'linear-gradient(145deg, #e67e22, #d35400)';
                    activeBtn.title = "Остановка...";
                    if (btnSinglePage) btnSinglePage.disabled = true;
                    if (btnAllPages) btnAllPages.disabled = true;
                }

                return;
            }
            isProcessCardsRunning = true;
            if (isPausedByAnotherTab) {
                safeDLEPushCall('info', 'Попытка возобновить проверку отменена пользователем.');
                isPausedByAnotherTab = false;
                let tasks = await GM_getValue(DEMAND_TASK_STACK_KEY, []);
                tasks = tasks.filter(task => task.tabId !== unsafeWindow.tabIdWatch);
                await GM_setValue(DEMAND_TASK_STACK_KEY, tasks);
                isProcessCardsRunning = false;
                return;
            }
            let tasks = await GM_getValue(DEMAND_TASK_STACK_KEY, []);
            tasks = tasks.filter(task => task.tabId !== unsafeWindow.tabIdWatch);
            tasks.unshift(myTask);
            await GM_setValue(DEMAND_TASK_STACK_KEY, tasks);
            let resumeCheckIntervalId = null;
            try {
                shouldStopProcessCards = false;
                const buttonId = checkAllPages ? 'processAllPagesBtn' : 'processCards';
                const mainProcessBtn = document.getElementById(buttonId);
                if (mainProcessBtn && !originalProcessCardsColor) {
                    originalProcessCardsColor = mainProcessBtn.style.background;
                }
                while (!shouldStopProcessCards) {
                    tasks = await GM_getValue(DEMAND_TASK_STACK_KEY, []);
                    const activeTask = tasks[0];
                    if (!activeTask || activeTask.tabId !== unsafeWindow.tabIdWatch) {
                        if (!isPausedByAnotherTab) {
                            safeDLEPushCall('warning', 'Проверка приостановлена другой вкладкой...');
                            isPausedByAnotherTab = true;
                            if (mainProcessBtn) mainProcessBtn.style.background = 'linear-gradient(145deg, #e67e22, #d35400)';
                        }
                        await sleep(2000);
                        continue;
                    }
                    if (isPausedByAnotherTab) {
                        safeDLEPushCall('success', 'Возобновляю проверку спроса...');
                        isPausedByAnotherTab = false;
                    }
                    if (mainProcessBtn) mainProcessBtn.style.background = 'linear-gradient(145deg, rgb(50, 200, 50), rgb(0, 150, 0))';
                    if (isCardPackPage()) { /* ... */ }
                    const currentPathname = window.location.pathname;
                    let posterProcessed = false;
                    if (currentPathname.match(/^\/cards\/\d+\/trade\/?$/i) || currentPathname.startsWith('/trades/')) {
                        const nofferElement = document.querySelector('.noffer.cards--container');
                        const posterImageLink = nofferElement ? nofferElement.querySelector('a.noffer__img') : null;
                        if (nofferElement && posterImageLink && nofferElement.dataset.originalId) {
                            const posterCardId = nofferElement.dataset.originalId;
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
                    if (currentPathname.match(/^\/cards\/\d+\/trade\/?$/i) || currentPathname.startsWith('/trades/')) { /* ... */ }
                    if (shouldStopProcessCards) break;
                    await sleep(200);
                    let cardsToProcessInLoop = getCardsOnPage().filter(cardEl => !cardEl.querySelector('.card-stats') && !cardEl.classList.contains('trade__inventory-item--lock') && !cardEl.classList.contains('remelt__inventory-item--lock') && !cardEl.classList.contains('card-show__placeholder') && !cardEl.classList.contains('noffer'));
                    let counter = cardsToProcessInLoop.length;
                    if (counter === 0 && !posterProcessed) {
                        safeDLEPushCall('info', 'Нет карт для проверки спроса.');
                        break;
                    }
                    const totalCardsToProcess = cardsToProcessInLoop.length;
                    if (!isPausedByAnotherTab) safeDLEPushCall('info', `Начинаю проверку спроса для ${totalCardsToProcess} карт...`);
                    if (mainProcessBtn) { updateSpecialButtonCounterText(buttonId, counter); showSpecialButtonCounter(buttonId); startAnimation(buttonId); }
                    if (isCardPackPage()) {
                        const batchSize = 3;
                        for (let i = 0; i < cardsToProcessInLoop.length; i += batchSize) {
                            if (shouldStopProcessCards || thisCheckInstanceId !== currentDemandCheckInstanceId) break;
                            const currentTasks = await GM_getValue(DEMAND_TASK_STACK_KEY, []);
                            if (!currentTasks[0] || currentTasks[0].tabId !== unsafeWindow.tabIdWatch) {
                                break;
                            }
                            const batch = cardsToProcessInLoop.slice(i, i + batchSize);
                            const processPromises = batch.map(async (cardElement) => {
                                let typeCardId = await getCardId(cardElement, 'type');
                                if (typeCardId) {
                                    await updateCardInfo(typeCardId, cardElement, false);
                                }
                            });
                            await Promise.all(processPromises);
                            counter -= batch.length;
                            if (mainProcessBtn) updateSpecialButtonCounterText(buttonId, counter);
                            const processedCountPack = totalCardsToProcess - counter;
                            if (!isPausedByAnotherTab) safeDLEPushCall('info', `Проверка спроса... (${processedCountPack} из ${totalCardsToProcess})`);
                            if (i + batchSize < cardsToProcessInLoop.length && !shouldStopProcessCards) {
                                await sleep(2000);
                            }
                        }
                    }
                    else if (currentPathname.startsWith('/trades/') && !currentPathname.startsWith('/trades/history/')) {
                        const batchSize = 4;
                        for (let i = 0; i < cardsToProcessInLoop.length; i += batchSize) {
                            if (shouldStopProcessCards || thisCheckInstanceId !== currentDemandCheckInstanceId) break;
                            const currentTasks = await GM_getValue(DEMAND_TASK_STACK_KEY, []);
                            if (!currentTasks[0] || currentTasks[0].tabId !== unsafeWindow.tabIdWatch) {
                                break;
                            }
                            const batch = cardsToProcessInLoop.slice(i, i + batchSize);
                            const processPromises = batch.map(async (cardElement) => {
                                let typeCardId = await getCardId(cardElement, 'type');
                                if (typeCardId) {
                                    await updateCardInfo(typeCardId, cardElement, false);
                                }
                            });
                            await Promise.all(processPromises);
                            counter -= batch.length;
                            if (mainProcessBtn) updateSpecialButtonCounterText(buttonId, counter);
                            const processedCountPack = totalCardsToProcess - counter;
                            if (!isPausedByAnotherTab) safeDLEPushCall('info', `Проверка спроса... (${processedCountPack} из ${totalCardsToProcess})`);
                            if (i + batchSize < cardsToProcessInLoop.length && !shouldStopProcessCards) {
                                await sleep(2500);
                            }
                        }
                    } else {
                        for (const cardElement of cardsToProcessInLoop) {
                            if (shouldStopProcessCards || thisCheckInstanceId !== currentDemandCheckInstanceId) break;
                            const currentTasks = await GM_getValue(DEMAND_TASK_STACK_KEY, []);
                            if (!currentTasks[0] || currentTasks[0].tabId !== unsafeWindow.tabIdWatch) {
                                break;
                            }
                            let typeCardId = await getCardId(cardElement, 'type');
                            if (typeCardId) {
                                const cachedCard = await getCard('cardId: ' + typeCardId);
                                if (cachedCard) {
                                    await updateCardInfo(typeCardId, cardElement, false);
                                } else {
                                    await sleep(1900);
                                    await updateCardInfo(typeCardId, cardElement, false);
                                }
                            }
                            counter--;
                            if (mainProcessBtn) updateSpecialButtonCounterText(buttonId, counter);
                            const processedCountPack = totalCardsToProcess - counter;
                            if (!isPausedByAnotherTab) safeDLEPushCall('info', `Проверка спроса... (${processedCountPack} из ${totalCardsToProcess})`);
                        }
                    }
                    if (mainProcessBtn) { stopAnimation(buttonId); hideSpecialButtonCounter(buttonId); }
                    if (thisCheckInstanceId !== currentDemandCheckInstanceId) {
                        if (typeof unsafeWindow.safeDLEPushCall === 'function') {
                        }
                        break;
                    }
                    const finalTasks = await GM_getValue(DEMAND_TASK_STACK_KEY, []);
                    if (!finalTasks[0] || finalTasks[0].tabId !== unsafeWindow.tabIdWatch) {
                        continue;
                    }
                    if (shouldStopProcessCards) break;

                    if (checkAllPages && isMyCardPage() && cardsToProcessInLoop.length > 0) {
                        await goToNextPageForDemand();
                        return;
                    } else {
                        sessionStorage.removeItem('shouldAutoProcessDemand');
                    }

                    safeDLEPushCall('success', 'Проверка спроса завершена.');
                    break;
                }
            } finally {
                isProcessCardsRunning = false;
                isPausedByAnotherTab = false;
                const btnSinglePage = document.getElementById('processCards');
                const btnAllPages = document.getElementById('processAllPagesBtn');
                const defaultBackground = originalProcessCardsColor || 'linear-gradient(145deg, rgb(166, 100, 110), rgb(222, 0, 5))';
                if (btnSinglePage) {
                    btnSinglePage.style.background = defaultBackground;
                    const icon = btnSinglePage.querySelector('span:first-child');
                    if (icon) {
                        icon.className = 'fal fa-rocket';
                    }
                    btnSinglePage.title = 'Проверить спрос (текущая страница)';
                    btnSinglePage.disabled = false;
                }
                if (btnAllPages) {
                    btnAllPages.style.background = defaultBackground;
                    const icon = btnAllPages.querySelector('span:first-child');
                    if (icon) {
                        icon.className = 'fal fa-rocket';
                        icon.style.animation = '';
                    }
                    btnAllPages.title = 'Проверить спрос (ВСЕ страницы)';
                    btnAllPages.disabled = false;
                }
                if (btnAllPages) {
                    btnAllPages.style.background = defaultBackground;
                    const icon = btnAllPages.querySelector('span:first-child');
                    if (icon) icon.className = 'fal fa-rocket';
                    btnAllPages.title = 'Проверить спрос (ВСЕ страницы)';
                    btnAllPages.disabled = false;
                }
                originalProcessCardsColor = '';
                const isGoingToNextPage = sessionStorage.getItem('shouldAutoProcessDemand') === 'true';
                if (!isGoingToNextPage) {
                    let tasks = await GM_getValue(DEMAND_TASK_STACK_KEY, []);
                    if (tasks[0] && tasks[0].tabId === unsafeWindow.tabIdWatch) {
                        tasks.shift();
                        await GM_setValue(DEMAND_TASK_STACK_KEY, tasks);
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
        // # Создает и стилизует кнопку для индивидуальной проверки спроса, которая появляется при наведении на карту.
        // #######################################################################
        function createDemandCheckButton() {
            const btn = document.createElement('div');
            btn.innerHTML = '<i class="fas fa-chart-line"></i>';
            btn.className = 'check-demand-btn';
            if (window.location.pathname.startsWith('/pm/')) {
                btn.setAttribute('data-mce-bogus', '1');
            }
            btn.title = 'Проверить спрос на эту карту';
            Object.assign(btn.style, {
                position: 'absolute',
                zIndex: '11',
                background: 'rgba(0, 123, 255, 0.7)',
                color: 'white',
                border: '1px solid rgba(0, 80, 170, 0.9)',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease, transform 0.2s ease, background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
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
            if (toggleButtonElement) {
                toggleButtonElement.style.display = buttonsExistOnPage ? 'flex' : 'none';
            }
            managedButtonSelectors.forEach(selector => {
                const btn = document.querySelector(selector);
                if (btn) {
                    const isHidden = areActionButtonsHidden;
                    const activeTransition = 'opacity 0.3s ease, transform 0.3s ease';

                    if (isInitialLoad && isHidden) {
                        btn.style.transition = 'none';
                    } else {
                        btn.style.transition = activeTransition;
                    }
                    if (isHidden) {
                        btn.style.opacity = '0';
                        btn.style.transform = 'translateX(calc(100% + 20px))';
                        btn.style.pointerEvents = 'none';
                    } else {
                        btn.style.opacity = '1';
                        btn.style.transform = 'translateX(0)';
                        btn.style.pointerEvents = 'auto';
                    }

                    if (isInitialLoad && isHidden) {
                        setTimeout(() => {
                            if (btn) btn.style.transition = activeTransition;
                        }, 50);
                    }
                }
            });
        }
        unsafeWindow.applyManagedButtonsVisibility = applyManagedButtonsVisibility;

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
        unsafeWindow.isMyCardPage = isMyCardPage;

        // #######################################################################
        // # Проверяет, является ли страница страницей открытия паков.
        // #######################################################################
        function isCardPackPage() {
            return window.location.pathname === '/cards/pack/';
        }
        unsafeWindow.isCardPackPage = isCardPackPage;

        // #######################################################################
        // # БЛОК: Отключение размытия при анимации открытия паков (Версия 6, Финал)
        // #######################################################################
        async function initializeAntiBlurFeature() {
            const ANTI_BLUR_ENABLED_KEY = 'ascm_antiBlurInPacksEnabled';
            const isEnabled = await GM_getValue(ANTI_BLUR_ENABLED_KEY, true);
            if (!isEnabled || !isCardPackPage()) return;
            GM_addStyle(`
                .lootbox__list.step1.step2 .cd::after {
                    display: none !important;
                }
                .lootbox__list.step1.step2 .cd img {
                    filter: brightness(0.75) contrast(0.85) !important;
                    -webkit-filter: brightness(0.75) contrast(0.95) !important;
                }
            `);

            console.log('[Anti-Blur] Функция отключения размытия в паках активна.');
        }

        // #######################################################################
        // # Проверяет, является ли текущая страница страницей конкретного Аниме.
        // #######################################################################
        function isAnimePage() { return document.getElementById('anime-data') !== null; }

        // #######################################################################
        // # Создает уникальный составной ключ из URL изображения, устойчивый к cache-busting.
        // #######################################################################
        function normalizeImagePath(imageUrl) {
            if (!imageUrl || imageUrl.startsWith('data:')) return null;
            try {
                const path = new URL(imageUrl, location.origin).pathname;
                const match = path.match(/\/cards_image\/(\d+)\/([a-z]+)\/([a-z0-9-.]+?)(?:-\d+.*)?\.webp/);
                if (match && match[1] && match[2] && match[3]) {
                    const animeId = match[1];
                    const rank = match[2];
                    const charNameSlug = match[3];
                    return `${animeId}/${rank}/${charNameSlug}`;
                }
                console.warn("Не удалось создать составной ключ для URL, возвращаю исходный путь:", path);
                return path;
            } catch (e) {
                console.error("Критическая ошибка нормализации URL:", imageUrl, e);
                return imageUrl;
            }
        }

        // #######################################################################
        // # Извлекает ID карты (типа или экземпляра) из DOM-элемента, используя разные атрибуты и контекст.
        // #######################################################################
        async function getCardId(cardElement, targetIdType = 'type', isSilent = false) {
            if (!cardElement) return null;
            let typeId;
            let ownerId;
            if (cardElement.matches('.trade__main-item') && cardElement.hasAttribute('href')) {
                const href = cardElement.getAttribute('href');
                const match = href.match(/[?&]id=(\d+)/);
                if (match && match[1]) {
                    typeId = match[1];
                }
            }
            if (cardElement.matches('.trade__inventory-item')) {
                typeId = cardElement.dataset.cardId;
                ownerId = cardElement.dataset.id;
            }
            if (!typeId) {
                 typeId = cardElement.dataset.cardId ||
                    ((cardElement.matches('.anime-cards__item') || cardElement.matches('.lootbox__card')) ? cardElement.dataset.id : null) ||
                    (cardElement.matches('.trade__main-item') ? cardElement.dataset.id : null);
            }
             if (!ownerId) {
                ownerId = cardElement.dataset.ownerId ||
                    ((cardElement.matches('.remelt__inventory-item') || cardElement.matches('.stone__inventory-item') || cardElement.matches('.card-awakening-list__card') || cardElement.matches('.card-awakening-list__card__s')) ? cardElement.dataset.id : null);
            }
            if (targetIdType === 'owner') return ownerId || null;
            if (typeId) {
                if (ownerId) await saveOwnerToTypeMapping(ownerId, typeId);
                return typeId;
            }
            if (ownerId) {
                const cachedTypeId = await getTypeIdFromOwnerCache(ownerId);
                if (cachedTypeId) {
                    if (!isSilent) {
                        console.log(`ID найден в кэше по ownerId: ${ownerId} -> ${cachedTypeId}`);
                    }
                    return cachedTypeId;
                }
            }
            let imageSrc = cardElement.dataset.image;
            if (!imageSrc) {
                const imgTag = cardElement.querySelector('img');
                if (imgTag) {
                    imageSrc = imgTag.dataset.src || imgTag.getAttribute('src');
                }
            }
            if (imageSrc && imageSrc.includes('empty-card.png')) {
                return null;
            }
            if (imageSrc && ((isSpecificTradeOfferPage() || isTradeHistoryPage() || isRemeltPage()) || (ownerId && !typeId))) {
                if (!isSilent) {
                    console.warn(`ID не найден в DOM/кэше.\nЗапускаю поиск по картинке: ${imageSrc.split('/').pop()}`);
                }
                try {
                    await ensureDbLoaded();
                    if (!isDatabaseReady || !cardDatabaseMap) {
                        if (!isSilent) {
                            console.error('База данных не загружена или пуста, поиск по картинке невозможен.');
                        }
                        return null;
                    }
                    const compositeKey = normalizeImagePath(imageSrc);
                    if (compositeKey && cardImageIndex && cardImageIndex.has(compositeKey)) {
                        const foundCardId = cardImageIndex.get(compositeKey);
                        const dbEntry = cardDatabaseMap.get(foundCardId);
                        if (dbEntry && dbEntry.id) {
                            if (!isSilent) {
                                console.log(`ID (${dbEntry.id}) найден в базе по составному ключу.`);
                            }
                            if (ownerId) await saveOwnerToTypeMapping(ownerId, dbEntry.id);
                            return dbEntry.id;
                        }
                    }
                } catch (e) {
                    if (!isSilent) {
                        console.error(`Ошибка при обработке URL картинки "${imageSrc}":`, e);
                    }
                }
            }
            if (!isSilent) {
                console.error('Не удалось определить typeId для элемента:', cardElement);
            }
            return null;
        }
        unsafeWindow.getCardId = getCardId;

        // #######################################################################
        // # Находит и осуществляет переход на следующую страницу пагинации (для массовой отправки в "Не нужное").
        // #######################################################################
        async function goToNextPage(mode) {
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
                const stepMessage = (mode === 'delete_then_add')
                ? '[Шаг 3/3] Переход на следующую страницу...'
                : '[Шаг 2/2] Переход на следующую страницу...';
                safeDLEPushCall('info', stepMessage);
                sessionStorage.setItem('shouldAutoCharge', 'true');
                await sleep(1000);
                if (!shouldStopProcessing) {
                    window.location.href = nextPageLinkElement.href;
                    return true;
                } else {
                    sessionStorage.removeItem('shouldAutoCharge');
                }
            }
            safeDLEPushCall('info', 'Достигнута последняя страница или не найдена кнопка перехода.');
            sessionStorage.removeItem('shouldAutoCharge');
            return false;
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
        // #######################################################################
        async function sendUnwantedPageRequest(action, ids) {
            const user_hash = unsafeWindow.dle_login_hash;
            if (!user_hash) {
                safeDLEPushCall('error', 'Ошибка: не найден хеш пользователя.');
                return false;
            }
            const body = new URLSearchParams();
            body.append('action', action);
            ids.forEach(id => body.append('ids[]', id));
            body.append('user_hash', user_hash);

            try {
                const response = await fetch("/engine/ajax/controller.php?mod=cards_ajax", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    body: body.toString()
                });

                if (!response.ok) {
                    throw new Error(`Сетевая ошибка: ${response.status}`);
                }
                return true;
            } catch (error) {
                console.error(`Ошибка при выполнении действия "${action}":`, error);
                safeDLEPushCall('error', `Ошибка запроса: ${action}. Процесс остановлен.`);
                shouldStopProcessing = true;
                return false;
            }
        }

        // #######################################################################
        // # Отправляет запрос на полную очистку списка "Готов обменять" ("Не нужное").
        // #######################################################################
        unsafeWindow.sendFullClearRequest = async function() {
            const user_hash = unsafeWindow.dle_login_hash;
            if (!user_hash) {
                safeDLEPushCall('error', 'Ошибка: не найден хеш пользователя для очистки.');
                return false;
            }
            const body = new URLSearchParams();
            body.append('action', 'full_clear_list');
            body.append('kind', 'trade');
            body.append('user_hash', user_hash);
            try {
                const response = await fetch("/engine/ajax/controller.php?mod=cards_ajax", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    body: body.toString()
                });
                if (!response.ok) throw new Error(`Сетевая ошибка: ${response.status}`);
                safeDLEPushCall('success', 'Список "Не нужное" полностью очищен!');
                return true;
            } catch (error) {
                console.error('Ошибка при полной очистке:', error);
                safeDLEPushCall('error', 'Ошибка при полной очистке списка.');
                return false;
            }
        }

        // #######################################################################
        // # Открывает ПОД-МЕНЮ настроек для кнопки "Готов поменять".
        // #######################################################################
        unsafeWindow.openReadyToChargeSubModal = async function() {
            const READY_TO_TRADE_MODE_KEY = 'readyToTradeMode_v2';
            const currentMode = await GM_getValue(READY_TO_TRADE_MODE_KEY, 'add_only');
            const wrapper = document.createElement('div');
            wrapper.id = 'acm_modal_wrapper';
            wrapper.innerHTML = `
                <div class="acm-modal-backdrop"></div>
                <div class="acm-modal" id="ready_to_trade_settings_modal" style="width: 550px;">
                <div class="modal-header">
                <h2>Настройки "Готов поменять"</h2>
                </div>
                <div class="modal-body">
                <p style="font-size: 13px; color: #999; text-align: center; margin-bottom: 15px;">Выберите режим работы кнопки "Готов поменять".</p>
                <div style="display: flex; flex-direction: column; gap: 15px;">
                <label style="display: block; cursor: pointer; padding: 10px; border-radius: 5px; background-color: #2c2f33;">
                <input type="radio" name="rtt_mode" value="add_only" ${currentMode === 'add_only' ? 'checked' : ''}>
                <strong style="color: #43b581;">Добавление в "Не нужное"</strong>
                <div style="font-size: 12px; color: #999; margin-top: 5px;">Все карты из вашего инвентаря (постранично) будут добавляться в список. Не добавляет уже добавленные карты.</div>
                </label>
                <label style="display: block; cursor: pointer; padding: 10px; border-radius: 5px; background-color: #2c2f33;">
                <input type="radio" name="rtt_mode" value="delete_then_add" ${currentMode === 'delete_then_add' ? 'checked' : ''}>
                <strong style="color: #faa61a;">Удалить, затем добавить</strong>
                <div style="font-size: 12px; color: #999; margin-top: 5px;">На каждой странице карты сначала удаляются из списка, затем добавляются. Процесс происходит медленее и запросов больше.</div>
                </label>
                </div>
                </div>
                <div class="modal-footer">
                <button id="rtt_back_btn" class="action-btn back-btn">НАЗАД</button>
                <button id="rtt_full_clear_btn" class="action-btn" style="background-color: #d65a28;">Очистить все Не нужное</button>
                <button id="rtt_save_btn" class="action-btn save-btn">СОХРАНИТЬ</button>
                </div>
                </div>`;
            document.body.appendChild(wrapper);
            const closeModal = () => wrapper.remove();
            wrapper.querySelector('.acm-modal-backdrop').onclick = closeModal;
            wrapper.querySelector('#rtt_back_btn').onclick = () => {
                closeModal();
                unsafeWindow.openMasterSettingsModal();
            };
            wrapper.querySelector('#rtt_full_clear_btn').onclick = async () => {
                const confirmation = await protector_customConfirm('Вы уверены, что хотите ПОЛНОСТЬЮ очистить ваш список "Не нужное"?<br>Это действие необратимо.');
                if (confirmation) {
                    await unsafeWindow.sendFullClearRequest();
                }
            };
            wrapper.querySelector('#rtt_save_btn').onclick = async () => {
                const selectedMode = wrapper.querySelector('input[name="rtt_mode"]:checked').value;
                await GM_setValue(READY_TO_TRADE_MODE_KEY, selectedMode);
                safeDLEPushCall('success', 'Настройки сохранены!');
                closeModal();
                unsafeWindow.openMasterSettingsModal({ rdyToChargeMode: selectedMode });
            };
        }

        // #######################################################################
        // # Запускает процесс массового добавления карт со страницы в список "Готов обменять".
        // #######################################################################
        async function readyToCharge() {
            const READY_TO_TRADE_MODE_KEY = 'readyToTradeMode_v2';
            const mode = await GM_getValue(READY_TO_TRADE_MODE_KEY, 'add_only');
            const buttonId = 'readyToCharge';
            const readyToChargeBtn = document.getElementById(buttonId);
            if (isAutoChargeRunning) {
                shouldStopProcessing = true;
                sessionStorage.removeItem('shouldAutoCharge');
                safeDLEPushCall('info', 'Процесс будет остановлен после текущей страницы.');
                if (readyToChargeBtn) {
                    readyToChargeBtn.style.background = 'linear-gradient(145deg, #e67e22, #d35400)';
                    readyToChargeBtn.innerHTML = '<span class="fas fa-stop" style="font-size: 10px;"></span>';
                    readyToChargeBtn.disabled = true;
                }
                return;
            }
            isAutoChargeRunning = true;
            shouldStopProcessing = false;
            sessionStorage.setItem('shouldAutoCharge', 'true');
            if (readyToChargeBtn) {
                if (!originalReadyToChargeColor) originalReadyToChargeColor = readyToChargeBtn.style.background;
                readyToChargeBtn.style.background = 'linear-gradient(145deg, rgb(50, 222, 50), rgb(50, 122, 50))';
                readyToChargeBtn.innerHTML = '<span class="fas fa-stop" style="font-size: 10px;"></span>';
                readyToChargeBtn.title = "Остановить процесс";
            }
            while (true) {
                const cards = getCardsOnPage();
                const ownerIds = (await Promise.all(cards.map(card => getCardId(card, 'owner')))).filter(Boolean);
                if (ownerIds.length === 0) {
                    safeDLEPushCall('info', 'На странице нет карт для обработки. Завершение.');
                    break;
                }
                if (mode === 'delete_then_add') {
                    safeDLEPushCall('info', `[Шаг 1/3] Удаление ${ownerIds.length} карт из ненужных...`);
                    await sendUnwantedPageRequest('delete_no_need', ownerIds);
                    await sleep(1000);
                }
                const step = (mode === 'delete_then_add') ? '2/3' : '1/2';
                safeDLEPushCall('info', `[Шаг ${step}] Добавление ${ownerIds.length} карт в ненужные...`);
                await sendUnwantedPageRequest('add_no_need', ownerIds);
                await sleep(1000);
                if (shouldStopProcessing) {
                    safeDLEPushCall('info', 'Процесс остановлен пользователем. Переход на следующую страницу отменен.');
                    break;
                }
                const hasNextPage = await goToNextPage(mode);
                if (!hasNextPage) {
                    break;
                }
                return;
            }
            isAutoChargeRunning = false;
            shouldStopProcessing = false;
            sessionStorage.removeItem('shouldAutoCharge');
            if (readyToChargeBtn) {
                readyToChargeBtn.style.background = originalReadyToChargeColor;
                readyToChargeBtn.innerHTML = '<span class="fal fa-circle-check" style="font-size: 14px;"></span>';
                readyToChargeBtn.title = "Готов поменять";
                readyToChargeBtn.disabled = false;
            }
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
            if (sessionStorage.getItem('stopDemandCheck') === 'true') {
                sessionStorage.removeItem('shouldAutoProcessDemand');
                sessionStorage.removeItem('stopDemandCheck');
                safeDLEPushCall('info', 'Массовая проверка спроса успешно остановлена.');
                return;
            }
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
        // # Добавляет на страницу кнопку-ссылку для быстрого перехода в клуб "Legendary Immortal Order".
        // #######################################################################
        async function addGoToClubsButton() {
            const isEnabled = await GM_getValue(GO_TO_CLUBS_BTN_ENABLED_KEY, false);
            if (!isEnabled) {
                return;
            }
            if (window.location.pathname.startsWith('/cards/') || window.location.pathname.startsWith('/trades/')) {
                return;
            }
            const filterControls = document.querySelector('.ncard__tabs');
            if (!filterControls) {
                return;
            }
            if (document.querySelector('.go-to-clubs-btn')) {
                return;
            }
            const goToClubsLink = document.createElement('a');
            goToClubsLink.className = 'go-to-clubs-btn';
            goToClubsLink.title = 'Legendary Immortal Order';
            goToClubsLink.href = '/clubs/20/';
            goToClubsLink.innerHTML = '<img src="/uploads/clubs/avatar_20.webp?v=1747841055" style="width: 100%; height: 100%; object-fit: cover; border-radius: 55px;"/>';
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
        async function addDemandCheckButtonsToCards() {
            const isEnabled = await GM_getValue(INDIVIDUAL_DEMAND_BTN_ENABLED_KEY, true);
            if (!isEnabled) {
                return;
            }
            const cards = getCardsOnPage();
            for (const cardElement of cards) {
                if (cardElement.querySelector('.acm-stats-wrapper, .acm-card-stats') || cardElement.classList.contains('card-show__placeholder') || cardElement.classList.contains('noffer') || cardElement.classList.contains('trade__inventory-item--lock') || cardElement.classList.contains('remelt__inventory-item--lock') || cardElement.classList.contains('div-checked') || cardElement.querySelector('.check-demand-btn')) {
                    continue;
                }
                const demandBtn = createDemandCheckButton();
                const cardWidth = cardElement.offsetWidth;
                const smallCardThreshold = 140;
                const verySmallCardThreshold = 100;
                const baseScaleFactor = await GM_getValue('acm_demandButtonSizeFactor', 0.13);
                let buttonSize;
                if (cardWidth < verySmallCardThreshold) {
                    buttonSize = 18;
                } else {
                    let scaleFactor = baseScaleFactor;
                    if (cardElement.classList.contains('lootbox__card')) {
                        const lootboxRow = cardElement.closest('.lootbox__row');
                        if (lootboxRow && lootboxRow.offsetWidth > 600) {
                            scaleFactor *= 0.8;
                        } else {
                            scaleFactor *= 1.3;
                        }
                    } else if (cardWidth < smallCardThreshold) {
                        scaleFactor *= 1.3;
                    }
                    buttonSize = Math.max(16, Math.min(50, cardWidth * scaleFactor));
                }
                const iconSize = buttonSize * 0.5;
                const positionOffset = Math.max(2, Math.min(5, cardWidth * 0.02));
                Object.assign(demandBtn.style, {
                    width: `${buttonSize}px`,
                    height: `${buttonSize}px`,
                    bottom: `${positionOffset}px`,
                    right: `${positionOffset}px`
                });
                const icon = demandBtn.querySelector('i');
                if (icon) {
                    icon.style.fontSize = `${iconSize}px`;
                }
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
                cardElement.classList.add('acm-card-container');
                if (window.getComputedStyle(cardElement).position === 'static') {
                    cardElement.style.position = 'relative';
                }
                cardElement.appendChild(demandBtn);
            }
        }

// ##############################################################################################################################################
// БЛОК: ИНФОРМАЦИОННЫЙ TOOLTIP ПО КЛИКУ
// ##############################################################################################################################################
        let currentInfoTooltip = null;
        // #######################################################################
        // Получает "базовое" название аниме, убирая номера сезонов, фильмы и т.д.
        // #######################################################################
        function getBaseAnimeName(animeName) {
            if (!animeName) return 'Без названия';
            return animeName
                .replace(/((\s+)?(\d+)(\s+)?(сезон|saison|season))$/i, '')
                .replace(/((\s+)?(фильм|movie|film|ova|ona|спешл|special))$/i, '')
                .replace(/(\s+\d+)$/, '')
                .trim();
        }

        // #######################################################################
        // Создает и управляет отображением всплывающего окна с информацией об аниме.
        // #######################################################################
        unsafeWindow.toggleAnimeInfoTooltip = async function(event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            const button = event.currentTarget;
            const cardSelectors = ['.anime-cards__item', '.trade__inventory-item', '.trade__main-item', '.history__body-item', '.lootbox__card', '.remelt__inventory-item', '.stone__inventory-item', '.card-awakening-list__card', '.card-awakening-list__card__s', '.ca-card-item'];
            let cardElement = null;
            for (const selector of cardSelectors) {
                const found = button.closest(selector);
                if (found) {
                    cardElement = found;
                    break;
                }
            }
            if (!cardElement) {
                console.error("Не удалось найти родительский элемент карты для кнопки 'i'.");
                return;
            }
            if (!button.dataset.uniqueId) button.dataset.uniqueId = `info-btn-${Math.random()}`;
            const buttonId = button.dataset.uniqueId;
            const existingTooltip = document.querySelector('.acm-info-tooltip-popup');
            if (existingTooltip && existingTooltip.dataset.openerId === buttonId) {
                existingTooltip.remove();
                return;
            }
            if (existingTooltip) {
                existingTooltip.remove();
            }
            const tooltip = document.createElement('div');
            tooltip.className = 'acm-info-tooltip-popup';
            tooltip.dataset.openerId = buttonId;
            tooltip.innerHTML = 'Загрузка...';
            document.body.appendChild(tooltip);
            const positionTooltip = () => {
                const btnRect = button.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                const margin = 12;
                let top;
                if (btnRect.top < tooltipRect.height + margin) {
                    top = btnRect.bottom + window.scrollY + margin;
                    tooltip.classList.add('flipped');
                } else {
                    top = btnRect.top + window.scrollY - tooltipRect.height - margin;
                    tooltip.classList.remove('flipped');
                }
                let left = btnRect.left + window.scrollX + (btnRect.width / 2) - (tooltipRect.width / 2);
                if (left < 10) left = 10;
                if (left + tooltipRect.width > window.innerWidth - 10) {
                    left = window.innerWidth - tooltipRect.width - 10;
                }
                tooltip.style.top = `${top}px`;
                tooltip.style.left = `${left}px`;
                tooltip.style.opacity = '1';
                tooltip.style.pointerEvents = 'auto';
            };
            positionTooltip();
            const closeListener = (e) => {
                if (!tooltip.contains(e.target) && e.target !== button) {
                    tooltip.remove();
                    document.removeEventListener('click', closeListener, true);
                }
            };
            setTimeout(() => document.addEventListener('click', closeListener, true), 0);
            let cardFromDb;
            const cardId = await getCardId(cardElement, 'type');
            const cardRank = cardElement.dataset.rank?.toLowerCase();
            if (cardRank === 'sss') {
                await ensureDbLoaded();
                cardFromDb = {
                    id: cardId,
                    name: cardElement.dataset.name || 'N/A',
                    rank: 'sss',
                    animeName: cardElement.dataset.animeName || 'N/A',
                    animeLink: cardElement.dataset.animeLink || ''
                };
                if (!cardFromDb.animeName || cardFromDb.animeName === 'N/A') {
                     tooltip.innerHTML = '<strong>Ошибка:</strong><br>Нет данных об аниме для этой SSS карты.';
                     positionTooltip();
                     return;
                }
            } else {
                await ensureDbLoaded();
                if (!cardId) {
                    tooltip.innerHTML = '<strong>Ошибка:</strong><br>Не удалось определить ID карты.';
                    positionTooltip();
                    return;
                }
                if (!isDatabaseReady || !cardDatabaseMap.has(cardId)) {
                    tooltip.innerHTML = 'Карта не найдена в базе.<br>Запускаю быстрое обновление...';
                    positionTooltip();
                    if (typeof unsafeWindow.runFallbackCardScrape === 'function') {
                        if (isScraping) {
                            tooltip.innerHTML = '<strong>Внимание:</strong><br>Обновление базы уже идет. Попробуйте позже.';
                            positionTooltip();
                            return;
                        }
                        await unsafeWindow.runFallbackCardScrape(2);
                        if (!cardDatabaseMap.has(cardId)) {
                            tooltip.innerHTML = '<strong>Ошибка:</strong><br>Карта не найдена даже после обновления базы.';
                            positionTooltip();
                            return;
                        }
                    } else {
                        tooltip.innerHTML = '<strong>Ошибка:</strong><br>Функция обновления не найдена.';
                        positionTooltip();
                        return;
                    }
                }
                cardFromDb = cardDatabaseMap.get(cardId);
            }
            if (!cardFromDb || !cardFromDb.animeName) {
                tooltip.innerHTML = '<strong>Ошибка:</strong><br>Нет данных об аниме в базе.';
                positionTooltip();
                return;
            }
            const fullAnimeName = cardFromDb.animeName;
            let totalCount = 0;
            let assCount = 0;
            let sssCount = 0;
            const rankCounts = { sss: 0, ass: 0, s: 0, a: 0, b: 0, c: 0, d: 0, e: 0 };
            for (const card of cardDatabaseMap.values()) {
                if (card.animeName === fullAnimeName) {
                    const rank = card.rank.toLowerCase();
                    if (rank === 'ass') {
                        assCount++;
                    } else if (rank === 'sss') {
                        sssCount++;
                    } else {
                        totalCount++;
                    }
                    if (rankCounts.hasOwnProperty(rank)) {
                        rankCounts[rank]++;
                    }
                }
            }
            let rewardStatusColor = 'Grey';
            const username = asbm_getUsername();
            let myRankCounts = { sss: 0, ass: 0, s: 0, a: 0, b: 0, c: 0, d: 0, e: 0 };
            let collectedInfoString = '';
            if (totalCount < 10) {
                collectedInfoString = 'Собрано карт: <b style="color: #96989d;">0</b><br>';
                if (username) {
                    try {
                        const inventorySearchUrl = `${window.location.origin}/user/cards/?name=${encodeURIComponent(username)}&search=${encodeURIComponent(fullAnimeName)}&sort=duplicates`;
                        const response = await fetch(inventorySearchUrl);
                        if (!response.ok) throw new Error(`Ошибка HTTP ${response.status}`);
                        const text = await response.text();
                        const doc = new DOMParser().parseFromString(text, 'text/html');
                        const cardsOnPage = doc.querySelectorAll('.anime-cards__item-wrapper');
                        cardsOnPage.forEach(cardWrapper => {
                            const cardEl = cardWrapper.querySelector('.anime-cards__item');
                            if (cardEl && getBaseAnimeName(cardEl.dataset.animeName) === getBaseAnimeName(fullAnimeName)) {
                                const rank = cardEl.dataset.rank.toLowerCase();
                                if (myRankCounts.hasOwnProperty(rank)) {
                                    myRankCounts[rank]++;
                                }
                            }
                        });
                        const myTotalCollectedCount = Object.values(myRankCounts).reduce((sum, count) => sum + count, 0);
                        const collectedColor = myTotalCollectedCount > 0 ? '#faa61a' : '#96989d';
                        collectedInfoString = `<span style="color: ${collectedColor};">Собрано карт: <b>${myTotalCollectedCount}</b></span><br>`;
                    } catch (e) {
                        console.error("[ACM] Ошибка при получении данных из инвентаря для неполной колоды:", e);
                        collectedInfoString = 'Собрано карт: <span style="color: #ed4245;">Ошибка</span><br>';
                    }
                }
            } else {
                if (username) {
                    try {
                        const progressSearchUrl = `${window.location.origin}/user/${encodeURIComponent(username)}/cards_progress/?search=${encodeURIComponent(fullAnimeName)}`;
                        const response = await fetch(progressSearchUrl);
                        if (!response.ok) throw new Error(`Ошибка HTTP ${response.status}`);
                        const text = await response.text();
                        const doc = new DOMParser().parseFromString(text, 'text/html');
                        const deckContainer = Array.from(doc.querySelectorAll('.user-anime')).find(el => {
                            const titleLink = el.querySelector('.user-anime__title');
                            return titleLink && titleLink.textContent.trim() === fullAnimeName;
                        });
                        if (deckContainer) {
                            const rewardButton = deckContainer.querySelector('.glav-s');
                            if (rewardButton) {
                                if (rewardButton.classList.contains('completed')) {
                                    rewardStatusColor = '#019145';
                                } else {
                                    rewardStatusColor = '#2094e4';
                                }
                            }
                            deckContainer.querySelectorAll('.user-anime__cards-list a[href*="/cards/users/?id="]').forEach(link => {
                                const match = link.href.match(/id=(\d+)/);
                                if (match && match[1]) {
                                    const ownedCard = cardDatabaseMap.get(match[1]);
                                    if (ownedCard) {
                                        const rank = ownedCard.rank.toLowerCase();
                                        if (myRankCounts.hasOwnProperty(rank)) {
                                            myRankCounts[rank]++;
                                        }
                                    }
                                }
                            });
                        }
                    } catch (e) {
                        console.error("[ACM] Ошибка при получении прогресса колоды:", e);
                    }
                }
                const myTotalCollectedCount = Object.values(myRankCounts).reduce((sum, count) => sum + count, 0);
                if (totalCount >= 10) {
                    if (myTotalCollectedCount === totalCount) {
                        tooltip.classList.add('collection-complete-glow');
                    } else {
                        if (rankCounts.s === 0) {
                            tooltip.classList.add('collection-no-s-rank-glow');
                        } else {
                            tooltip.classList.add('collection-incomplete-glow');
                        }
                    }
                }
                const collectedColor = myTotalCollectedCount === totalCount ? '#43b581' : '#faa61a';
                collectedInfoString = `<span style="color: ${collectedColor};">Собрано карт: <b>${myTotalCollectedCount}</b></span><br>`;
            }
            const rankColors = {
                s: 'rgb(167, 76, 207)',
                a: 'rgb(217, 49, 52)',
                b: 'rgb(32, 148, 228)',
                c: 'rgb(11, 91, 65)',
                d: 'rgb(153, 151, 151)',
                e: 'rgb(156, 111, 81)'
            };
            const rankInfoString = Object.entries(rankCounts)
            .filter(([, totalCount]) => totalCount > 0)
            .map(([rank, totalCount]) => {
                if (rank === 'ass' || rank === 'sss') {
                    return '';
                }
                const myCount = myRankCounts[rank];
                const numberColor = myCount === totalCount ? '#43b581' : (myCount > 0 ? '#faa61a' : '#96989d');
                const letterColor = rankColors[rank] || '#dcddde';
                const searchUrl = username ? `${window.location.origin}/user/cards/?name=${encodeURIComponent(username)}&rank=${rank}&search=${encodeURIComponent(fullAnimeName)}&sort=name` : '#';
                const linkTitle = username ? `Посмотреть карты ранга ${rank.toUpperCase()} из этого аниме в инвентаре` : 'Войдите, чтобы использовать эту ссылку';
                return `<a href="${searchUrl}" class="info-line-link" title="${linkTitle}" target="_blank"><span class="rank-info" style="color: ${numberColor};"><b style="color: ${letterColor};">${rank.toUpperCase()}</b> ${myCount}/${totalCount}</span></a>`;
            })
            .join('');
            const animeIdMatch = cardFromDb.animeLink.match(/\/(\d+)-/);
            const animeId = animeIdMatch ? animeIdMatch[1] : null;
            let subscriptionButtonHtml = '';
            let buttonsHtml = '';
            let metaButtonsHtml = '';
            if (animeId) {
                subscriptionButtonHtml = `<button id="acm-subscription-toggle-btn" data-anime="${animeId}">
                                              <i class="fas fa-rss"></i>&nbsp;Управление подпиской
                                          </button>`;
                const addMissingButtonHtml = `<button class="card-anime-list__add-btn" data-anime="${animeId}" title="Добавить недостающие карты из этого аниме в список 'Хочу'" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #6aad6d; background-color: rgba(67, 181, 129, 0.7); color: #fff; cursor: pointer; transition: all 0.2s ease;">
                                                <i class="ass-cards"></i> Добавить карты в "Хочу"
                                            </button>`;
                const deleteMissingButtonHtml = `<button class="card-anime-list__delete-btn" data-anime="${animeId}" title="Удалить все карты из этого аниме из списка 'Хочу'" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #c83a54; background-color: rgba(200, 58, 84, 0.5); color: #fff; cursor: pointer; transition: all 0.2s ease;">
                                                    <i class="fal fa-trash"></i> Удалить карты из "Хочу"
                                                 </button>`;
                buttonsHtml = `<div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
                                   ${addMissingButtonHtml}
                                   ${deleteMissingButtonHtml}
                               </div>`;
                const cardRank = cardFromDb.rank.toLowerCase();
                const cardName = cardFromDb.name;
                const encodedName = encodeURIComponent(cardName);
                const starUrl = `/update_stars/?rank=${cardRank}&search=${encodedName}`;
                const searchUrl = `/user/cards/?name=${username}&card_id=${cardId}`;
                const starButtonHtml = `<a href="${starUrl}" title="Перейти на страницу звезд для '${cardName}'" class="ncard__meta-item star-meta-item" style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; text-decoration: none; padding: 0px; box-sizing: border-box; background-color: transparent; border: 1px solid rgb(85, 85, 85); transition: all 0.2s ease;"><i class="fas fa-star" style="color: gold; font-size: 20px;"></i></a>`;
                const lockButtonHtml = `<button class="ncard__meta-item lock-meta-item" data-anime-id="${animeId}" data-anime-name="${fullAnimeName}" data-status="initial" style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; text-decoration: none; padding: 0px; box-sizing: border-box; background-color: transparent; border: 1px solid rgb(85, 85, 85); transition: all 0.2s ease; cursor: pointer;"><i class="fas fa-lock" style="font-size: 18px; color: rgb(160, 179, 193);"></i></button>`;
                const searchButtonHtml = `<a href="${searchUrl}" title="Поиск всех дубликатов среди своих карт" class="ncard__meta-item dubl-search-card" style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; text-decoration: none; padding: 0px; box-sizing: border-box; background-color: transparent; border: 1px solid rgb(85, 85, 85); transition: all 0.2s ease;"><i class="fas fa-search" style="font-size: 16px; color: transparent; -webkit-text-stroke: 1px #9e294f;"></i></a>`;
                metaButtonsHtml = `<div class="tooltip-meta-buttons" style="display: flex; gap: 8px; margin: 12px 0 10px 0; justify-content: space-between;">${lockButtonHtml}${starButtonHtml}${searchButtonHtml}</div>`;
            }
            const animePageUrl = cardFromDb.animeLink;
            const titleHtml = `<a href="${animePageUrl}" class="title-link" title="Перейти на страницу аниме '${fullAnimeName}'" target="_blank"><strong class="title">${fullAnimeName}</strong></a>`;
            const deckProgressUrl = username ? `${window.location.origin}/user/${encodeURIComponent(username)}/cards_progress/?search=${encodeURIComponent(fullAnimeName)}` : '#';
            let specialRanks = [];
            if (assCount > 0) specialRanks.push(`${assCount}ASS`);
            if (sssCount > 0) specialRanks.push(`${sssCount}SSS`);
            const totalCountString = specialRanks.length > 0 ? `${totalCount}+${specialRanks.join('+')}` : totalCount;
            let totalCardsText = `Карт в колоде: ${totalCountString}`;
            if (totalCount < 10) {
                totalCardsText += ' <span style="color: #96989d;">(Не колода)</span>';
            }
            let deckStatusTitle = '';
            switch (rewardStatusColor) {
                case '#019145':
                    deckStatusTitle = 'Награда собрана';
                    break;
                case '#2094e4':
                    deckStatusTitle = 'Награда не собрана';
                    break;
                default:
                    deckStatusTitle = 'Вы еще не собрали колоду';
                    break;
            }
            const totalCardsHtml = `<a href="${deckProgressUrl}" class="info-line-link" title="${deckStatusTitle}" style="color: ${rewardStatusColor};">${totalCardsText}</a>`;
            const myCardsUrl = username ? `${window.location.origin}/user/cards/?name=${encodeURIComponent(username)}&search=${encodeURIComponent(fullAnimeName)}&sort=name` : '#';
            collectedInfoString = collectedInfoString.replace('Собрано карт:', `<a href="${myCardsUrl}" class="info-line-link" title="Посмотреть собранные карты в инвентаре">Собрано карт:`);
            if (collectedInfoString.includes('</a>') === false) {
                collectedInfoString += '</a>';
            }
            tooltip.innerHTML = `<div style="display: flex; flex-direction: column; align-items: left; gap: 4px;">${titleHtml}${subscriptionButtonHtml}</div>${totalCardsHtml}<br>${collectedInfoString}${rankInfoString || 'Нет данных о рангах'}${metaButtonsHtml}${buttonsHtml}`;
            const tooltipLockButton = tooltip.querySelector('.lock-meta-item');
            if (tooltipLockButton) {
                const updateTooltipButtonView = (status) => {
                    const lockIcon = tooltipLockButton.querySelector('i');
                    tooltipLockButton.dataset.status = status;
                    lockIcon.className = 'fas';
                    tooltipLockButton.disabled = false;
                    tooltipLockButton.style.pointerEvents = 'auto';
                    switch (status) {
                        case 'locked': lockIcon.classList.add('fa-lock'); lockIcon.style.color = 'lightgreen'; tooltipLockButton.title = `Колода ЗАФИКСИРОВАНА.\nНажмите, чтобы снять фиксацию.`; break;
                        case 'partially_locked': lockIcon.classList.add('fa-unlock'); lockIcon.style.color = 'orange'; tooltipLockButton.title = `Колода зафиксирована, но не полностью!\nНажмите для фиксации новых карт.`; break;
                        case 'unlocked': lockIcon.classList.add('fa-lock-open'); lockIcon.style.color = '#a0b3c1'; tooltipLockButton.title = `Колода НЕ зафиксирована.\nНажмите для фиксации.`; break;
                        case 'not_collected': lockIcon.classList.add('fa-trophy'); lockIcon.style.color = '#999'; tooltipLockButton.title = `Колода еще не была собрана\n(нет всех карт для фиксации).`; tooltipLockButton.disabled = true; break;
                        case 'not_found': lockIcon.classList.add('fa-times-circle'); lockIcon.style.color = '#ff6b6b'; tooltipLockButton.title = `В колоде еще нет 10 карт\nили у вас нет ни одной карты из неё.`; tooltipLockButton.disabled = true; break;
                        case 'loading': lockIcon.classList.add('fa-spinner', 'fa-spin'); lockIcon.style.color = 'white'; tooltipLockButton.title = 'Загрузка...'; tooltipLockButton.style.pointerEvents = 'none'; break;
                        default: lockIcon.classList.add('fa-lock'); lockIcon.style.color = '#a0b3c1'; tooltipLockButton.title = `Узнать статус блокировки колоды\n"${fullAnimeName}"`; break;
                    }
                };
                tooltipLockButton.addEventListener('click', async () => {
                    const currentStatus = tooltipLockButton.dataset.status;
                    const animeId = tooltipLockButton.dataset.animeId;
                    const animeName = tooltipLockButton.dataset.animeName;
                    const user_hash = unsafeWindow.dle_login_hash;
                    const username = asbm_getUsername();
                    if (!user_hash || !username) { unsafeWindow.safeDLEPushCall('error', 'Ошибка: не найден хэш или имя пользователя.'); return; }
                    updateTooltipButtonView('loading');
                    const sendFixRequest = async () => {
                        const response = await fetch("/engine/ajax/controller.php?mod=cards_ajax", {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                            body: new URLSearchParams({ action: 'progress_fix', anime_id: animeId, user_hash: user_hash }).toString()
                        });
                        if (!response.ok) throw new Error(`Сетевая ошибка: ${response.status}`);
                    };
                    if (currentStatus === 'initial') {
                        try {
                            const searchUrl = `/user/${username}/cards_progress/?search=${encodeURIComponent(animeName)}`;
                            const response = await fetch(searchUrl);
                            const text = await response.text();
                            const doc = new DOMParser().parseFromString(text, 'text/html');
                            if (!doc.querySelector('.card-list .user-anime')) { updateTooltipButtonView('not_found');
                                                                              } else {
                                                                                  const deckButton = doc.querySelector(`.fix-my-progress[onclick*="'${animeId}'"]`);
                                                                                  if (deckButton) {
                                                                                      const iconInButton = deckButton.querySelector('i');
                                                                                      if (iconInButton?.classList.contains('fa-lock')) { updateTooltipButtonView('locked'); }
                                                                                      else if (iconInButton?.classList.contains('fa-unlock')) { updateTooltipButtonView('partially_locked'); }
                                                                                      else { updateTooltipButtonView('unlocked'); }
                                                                                  } else { updateTooltipButtonView('not_collected'); }
                                                                              }
                        } catch (e) {
                            console.error('[ACM LockButton Tooltip] Ошибка при проверке статуса:', e);
                            unsafeWindow.safeDLEPushCall('error', 'Ошибка при проверке статуса колоды.');
                            updateTooltipButtonView('initial');
                        }
                    } else if (['locked', 'unlocked', 'partially_locked'].includes(currentStatus)) {
                        try {
                            await sendFixRequest();
                            const successMessage = (currentStatus !== 'locked') ? `Колода "${animeName}" успешно зафиксирована!` : `Фиксация с колоды "${animeName}" успешно снята!`;
                            unsafeWindow.safeDLEPushCall('success', successMessage);
                            setTimeout(() => updateTooltipButtonView('initial'), 500);
                        } catch (error) {
                            console.error('[ACM LockButton Tooltip] Ошибка при отправке запроса:', error);
                            unsafeWindow.safeDLEPushCall('error', 'Не удалось выполнить действие.');
                            updateTooltipButtonView(currentStatus);
                        }
                    }
                });
            }
            if (animeId) {
                const subButton = document.getElementById('acm-subscription-toggle-btn');
                if (subButton) {
                    const updateSubButton = (isSubscribed) => {
                        if (isSubscribed) {
                            subButton.innerHTML = '<i class="fas fa-bell-slash"></i> Отписаться';
                            subButton.style.backgroundColor = 'rgba(200, 58, 84, 0.7)';
                            subButton.style.borderColor = '#c83a54';
                        } else {
                            subButton.innerHTML = '<i class="fas fa-bell"></i> Подписаться';
                            subButton.style.backgroundColor = 'rgba(67, 181, 129, 0.7)';
                            subButton.style.borderColor = '#43b581';
                        }
                        subButton.disabled = false;
                    };
                    subButton.onclick = async () => {
                        subButton.disabled = true;
                        subButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обновление...';
                        const result = await toggleAnimeSubscription(animeId);
                        if (result && typeof result.text === 'string') {
                            const isNowSubscribed = result.text.includes('Вы подписались');
                            updateSubButton(isNowSubscribed);
                            if (isNowSubscribed) {
                                unsafeWindow.safeDLEPushCall('success', 'Вы подписались на новые карты!');
                            } else if (result.text.includes('Подписка удалена')) {
                                unsafeWindow.safeDLEPushCall('info', 'Вы отписались от новых карт.');
                            }
                        } else {
                            subButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ошибка ответа';
                            console.error("[ACM] Неожиданный ответ от сервера:", result);
                            setTimeout(() => {
                                if(subButton) {
                                    subButton.innerHTML = '<i class="fas fa-rss"></i> Управление подпиской';
                                    subButton.disabled = false;
                                    subButton.style.backgroundColor = '#4f545c';
                                    subButton.style.borderColor = '#888';
                                }
                            }, 2500);
                        }
                    };
                }
            }
            positionTooltip();
        }

        // #######################################################################
        // Создает HTML-элемент для новой кнопки информации (i).
        // #######################################################################
        unsafeWindow.createInfoButton = function() {
            const btn = document.createElement('div');
            btn.innerHTML = 'i';
            btn.className = 'show-card-info-btn';
            btn.title = 'Информация о картах этого аниме';
            btn.style.cssText = `
                position: absolute;
                top: 4px;
                left: 30%;
                transform: translateX(-50%);
                z-index: 100;
                background: rgba(90, 90, 255, 0.6);
                border: 1px solid #888; border-radius: 50%;
                cursor: pointer;
                transition: all 0.2s ease, transform 0.2s ease;
                font-weight: bold; color: white;
                display: flex; align-items: center; justify-content: center;
                font-family: 'Georgia', serif; font-style: italic;
                box-sizing: border-box;`;
                    return btn;
        }

        // #######################################################################
        // Добавляет кнопки информации (i) на все видимые карточки на странице.
        // #######################################################################
        async function addInfoButtonsToCards() {
            const isEnabled = await GM_getValue(ACM_ANIME_INFO_BTN_ENABLED_KEY, true);
            if (!isEnabled) {
                return;
            }
            const cards = getCardsOnPage();
            for (const cardElement of cards) {
                if (cardElement.querySelector('.show-card-info-btn') || cardElement.classList.contains('card-show__placeholder') || cardElement.classList.contains('noffer')) {
                    continue;
                }
                const infoBtn = unsafeWindow.createInfoButton();
                const cardWidth = cardElement.offsetWidth;
                const smallCardThreshold = 140;
                const verySmallCardThreshold = 100;
                const baseScaleFactor = await GM_getValue('acm_infoButtonSizeFactor', 0.12);
                let buttonSize;
                if (cardWidth < verySmallCardThreshold) {
                    buttonSize = 18;
                } else {
                    let scaleFactor = baseScaleFactor;
                    if (cardElement.classList.contains('lootbox__card')) {
                        const lootboxRow = cardElement.closest('.lootbox__row');
                        if (lootboxRow && lootboxRow.offsetWidth > 600) {
                            scaleFactor *= 0.8;
                        } else {
                            scaleFactor *= 1.3;
                        }
                    } else if (cardWidth < smallCardThreshold) {
                        scaleFactor *= 1.3;
                    }
                    buttonSize = Math.max(16, Math.min(50, cardWidth * scaleFactor));
                }
                const fontSize = buttonSize * 0.5;
                Object.assign(infoBtn.style, {
                    width: `${buttonSize}px`,
                    height: `${buttonSize}px`,
                    fontSize: `${fontSize}px`,
                    padding: `${buttonSize * 0.15}px`
                });
                infoBtn.addEventListener('click', unsafeWindow.toggleAnimeInfoTooltip);
                cardElement.classList.add('acm-card-container');
                if (window.getComputedStyle(cardElement).position === 'static') {
                    cardElement.style.position = 'relative';
                }
                cardElement.appendChild(infoBtn);
            }
        }

        // #######################################################################
        // * Отправляет запрос на переключение подписки и возвращает ответ от сервера.
        // #######################################################################
        async function toggleAnimeSubscription(animeId) {
            const user_hash = unsafeWindow.dle_login_hash;
            if (!user_hash || !animeId) {
                unsafeWindow.safeDLEPushCall('error', 'Ошибка: не найден хеш пользователя.');
                return null;
            }
            try {
                const response = await fetch("/engine/ajax/controller.php?mod=cards_ajax", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    body: new URLSearchParams({
                        action: 'anime_cards_subscribe',
                        anime_id: animeId,
                        user_hash: user_hash
                    }).toString()
                });
                if (!response.ok) throw new Error(`Сетевая ошибка: ${response.status}`);
                return await response.json();
            } catch (error) {
                console.error('[ACM] Ошибка при переключении подписки:', error);
                unsafeWindow.safeDLEPushCall('error', 'Ошибка запроса на подписку.');
                return null;
            }
        }
// ##############################################################################################################################################
// КОНЕЦ БЛОКА: ИНФОРМАЦИОННЫЙ TOOLTIP ПО КЛИКУ
// ##############################################################################################################################################

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
                    .wrapper-container.wrapper-main,
                    header.header,
                    #asbm_container {
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
                    .anime-cards.anime-cards--full-page > h2.ncard__main-title {
                    flex-basis: 100% !important;
                    text-align: center !important;
                    margin-bottom: 15px !important;
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
                    background-color: transparent;
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
                    background-color: transparent;
                    }
                    }
                    `;
                        } else {
                            mainContainerMaxWidthStyle = `
                    @media (min-width: 0px) {
                    .wrapper-container.wrapper-main,
                    header.header,
                    #asbm_container {
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
        async function createMaxWidthControlSlider() {
            const isEnabled = await GM_getValue(MAX_WIDTH_SLIDER_ENABLED_KEY, true);
            if (!isEnabled) {
                return;
            }
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
            maxWidthSliderElement.min = '1285'; maxWidthSliderElement.max = '4005'; maxWidthSliderElement.step = '85';
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
        async function initDuplicateChecker() {
            const ALL_CARD_SELECTORS_ARRAY = ['.anime-cards__item', '.card-item', '.card','a.trade__main-item[href^="/cards/"]','.history__body-item a[href^="/cards/"]','.lootbox__card'];
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
                    position: absolute; z-index: 10;
                    background: rgba(211, 211, 211, 0.6);
                    border: 1px solid #ccc; border-radius: 15px;
                    cursor: pointer;
                    transition: all 0.2s ease; font-weight: bold; color: black;
                    text-align: center; line-height: 1.3;
                    display: flex; align-items: center; justify-content: center;
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
                    const response = await fetch(searchUrl, { credentials: 'include' });
                    if (!response.ok) {
                        console.error(`[Dups Fetch] Ошибка HTTP ${response.status} при запросе дубликатов: ${searchUrl}`);
                        safeDLEPushCall('error', `Ошибка ${response.status} при поиске дубликатов для card_id ${targetCardId}`);
                        return 0;
                    }
                    const htmlText = await response.text();
                    const doc = new DOMParser().parseFromString(htmlText, 'text/html');
                    const titleElement = doc.querySelector('.ncard__main-title-2.as-center span');
                    if (titleElement && titleElement.textContent) {
                        const match = titleElement.textContent.match(/\((\d+)\s+шт\.\)/);
                        if (match && match[1]) {
                            return parseInt(match[1], 10);
                        }
                    }
                    const foundOnPage = doc.querySelectorAll(`.anime-cards__item[data-id="${targetCardId}"], .lootbox__card[data-id="${targetCardId}"]`);
                    return foundOnPage.length;
                } catch (err) {
                    console.error(`[Dups Fetch] Ошибка сети при запросе дубликатов (${targetCardId}): ${searchUrl}`, err);
                    safeDLEPushCall('error', `Сетевая ошибка при поиске дубликатов для card_id ${targetCardId}`);
                    return 0;
                }
            }

            // #######################################################################
            // # Проверяет наличие дубликатов для одной конкретной карты и обновляет ее кнопку.
            // #######################################################################
            function checkCardDuplicates(cardElement, triggeredByMassCheck = false) {
                return new Promise(async (resolve) => {
                    let btn = cardElement.querySelector('.check-duplicates-btn');
                    const cardId = await getCardId(cardElement, 'type', true);
                    const loggedInUserName = getLoggedUserName();
                    if (!btn && triggeredByMassCheck) {
                        btn = document.createElement('div');
                        btn.className = 'check-duplicates-btn';
                        btn.style.opacity = '0';
                        btn.style.pointerEvents = 'none';
                        if (window.getComputedStyle(cardElement).position === 'static') {
                            cardElement.style.position = 'relative';
                        }
                        cardElement.appendChild(btn);
                    }
                    if (!btn) {
                        resolve();
                        return;
                    }
                    if (!cardId || !loggedInUserName) {
                        await updateButtonContent(btn, '❓');
                        btn.classList.add('checked');
                        resolve();
                        return;
                    }
                    if (isCardPackPage() && !cardElement.classList.contains('anime-cards__owned-by-user')) {
                        await updateButtonContent(btn, 0);
                        btn.classList.add('checked');
                        resolve();
                        return;
                    }
                    const cacheKeyForDuplicates = `${loggedInUserName}_${cardId}`;
                    if (triggeredByMassCheck && duplicatesCache.has(cacheKeyForDuplicates)) {
                        const duplicateCount = duplicatesCache.get(cacheKeyForDuplicates);
                        await updateButtonContent(btn, duplicateCount);
                        btn.classList.add('checked');
                        resolve();
                        return;
                    }
                    await updateButtonContent(btn, '⏳');
                    btn.style.pointerEvents = 'none';
                    btn.classList.remove('checked');
                    try {
                        const searchUrlObject = new URL(`${location.origin}/user/cards/`);
                        searchUrlObject.searchParams.set('name', loggedInUserName);
                        searchUrlObject.searchParams.set('card_id', cardId);
                        const duplicateCount = await fetchAllPagesUniversal(searchUrlObject.toString(), cardId);
                        duplicatesCache.set(cacheKeyForDuplicates, duplicateCount);
                        await updateButtonContent(btn, duplicateCount);
                        btn.classList.add('checked');
                    } catch (err) {
                        console.error(`[Dups Check] Ошибка при проверке дубликатов для card_id ${cardId}:`, err);
                        await updateButtonContent(btn, '❌');
                        btn.classList.add('checked');
                    } finally {
                        if (btn.style.pointerEvents !== 'none' || !triggeredByMassCheck) {
                           btn.style.pointerEvents = 'auto';
                        }
                        resolve();
                    }
                });
            }

            // #######################################################################
            // # Обновляет вид и содержимое индивидуальной кнопки (счетчик, иконку, цвет).
            // #######################################################################
            function updateButtonContent(btn, content) {
                btn.textContent = '';
                btn.className = 'check-duplicates-btn';
                if (content === '🔒' || content === '❓' || content === '❌' || content === '⏳' || content === '...') {
                    btn.textContent = content;
                    btn.style.background = (content === '⏳' || content === '...') ? 'LightGray' : 'rgba(255, 100, 100, 0.8)';
                    btn.style.color = (content === '⏳' || content === '...') ? 'black' : 'white';
                } else {
                    const count = Number(content);
                    btn.textContent = `×${count}`;
                    btn.style.background = count > 1 ? 'rgba(255, 0, 0, 0.7)' :
                    (count === 1 ? 'rgba(0, 150, 0, 0.7)' : 'rgba(0, 0, 0, 0.7)');
                    btn.style.color = 'white';
                }
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
                btn.style.transform = 'translateY(0)';
            }

            // #######################################################################
            // # Находит все карточки на странице и добавляет на них кнопки для проверки.
            // #######################################################################
            async function addCheckButtons() {
                const isEnabled = await GM_getValue(INDIVIDUAL_DUP_BTN_ENABLED_KEY, true);
                const userId = getLoggedUserName();
                const cards = getCardsOnPage();
                for (const cardEl of cards) {
                    if (cardEl.querySelector('.check-duplicates-btn') || cardEl.classList.contains('card-show__placeholder')) {
                        continue;
                    }
                    const newBtn = createDupBtn();
                    const cardWidth = cardEl.offsetWidth;
                    if (cardWidth === 0) continue;
                    const smallCardThreshold = 140;
                    const verySmallCardThreshold = 100;
                    const baseScaleFactor = await GM_getValue('acm_dupButtonSizeFactor', 0.13);
                    let buttonSize;
                    if (cardWidth < verySmallCardThreshold) {
                        buttonSize = 18;
                    } else {
                        let scaleFactor = baseScaleFactor;
                        if (cardEl.classList.contains('lootbox__card')) {
                            const lootboxRow = cardEl.closest('.lootbox__row');
                            if (lootboxRow && lootboxRow.offsetWidth > 600) {
                                scaleFactor *= 0.8;
                            } else {
                                scaleFactor *= 1.3;
                            }
                        } else if (cardWidth < smallCardThreshold) {
                            scaleFactor *= 1.3;
                        }
                        buttonSize = Math.max(16, Math.min(50, cardWidth * scaleFactor));
                    }
                    const fontSize = buttonSize * 0.5;
                    const positionOffsetY = buttonSize * 1.5;
                    const positionOffsetX = Math.max(2, Math.min(5, cardWidth * 0.02));
                    Object.assign(newBtn.style, {
                        width: `${buttonSize}px`,
                        height: `${buttonSize}px`,
                        fontSize: `${fontSize}px`,
                        borderRadius: '50%',
                        padding: '0',
                        bottom: `${positionOffsetY}px`,
                        right: `${positionOffsetX}px`
                    });
                    if (!isEnabled) {
                        newBtn.style.opacity = '0';
                        newBtn.style.visibility = 'hidden';
                        newBtn.style.pointerEvents = 'none';
                    }
                    newBtn.addEventListener('click', (e) => {
                        e.stopPropagation(); e.preventDefault();
                        if (!userId) {
                            updateButtonContent(newBtn, '🔒');
                            newBtn.classList.add('checked');
                            return;
                        }
                        checkCardDuplicates(cardEl);
                    });
                    cardEl.classList.add('acm-card-container');
                    if (window.getComputedStyle(cardEl).position === 'static') {
                        cardEl.style.position = 'relative';
                    }
                    cardEl.appendChild(newBtn);
                }
            }

            // #######################################################################
            // #######################################################################
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
                    if (isCardInPackSelected) {
                        console.log('[AutoPackCheck] Выбор сделан, проверка дубликатов прервана.');
                        массоваяПроверкаДублейЗапущена = false;
                        isProcessingAutoPackCheck = false;
                        индексПоследнейПровереннойКарты = 0;
                        массивКартДляПроверки = [];
                        updateMainButtonUI();
                        return;
                    }
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
                    if (isProcessingAutoPackCheck) {
                        const cardToProcess = массивКартДляПроверки[индексПоследнейПровереннойКарты];
                        checkCardDuplicates(cardToProcess, true);
                        индексПоследнейПровереннойКарты++;
                        if (индексПоследнейПровереннойКарты < массивКартДляПроверки.length) {
                            const delay = GM_getValue('autoDup_delay_ms', 150);
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
                    isCardInPackSelected = false;
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
                        duplicatesCache.clear();
                        массоваяПроверкаДублейЗапущена = true;
                        массоваяПроверкаДублейНаПаузе = false;
                        индексПоследнейПровереннойКарты = 0;
                        if (showDuplicateCheckNotifications) {
                            safeDLEPushCall('info', "Начата массовая проверка дубликатов...");
                        }
                        массивКартДляПроверки = [];
                        const allVisibleCards = getCardsOnPage();
                        for (const element of allVisibleCards) {
                            if (element.closest('#cards-carousel') || element.closest('.owl-item') || element.classList.contains('card-show__placeholder')) {
                                continue;
                            }
                            if (wasAutoTriggered && isCardPackPage()) {
                                const settings = unsafeWindow.autoDup_loadSettings();
                                const rank = element.dataset.rank?.toLowerCase();
                                if (!rank || settings[rank] !== true) {
                                    continue;
                                }
                            }
                            if (element.dataset.id || element.dataset.cardId || element.getAttribute('href')) {
                                массивКартДляПроверки.push(element);
                            }
                        }
                        if (массивКартДляПроверки.length === 0) {
                            массоваяПроверкаДублейЗапущена = false;
                            if (showDuplicateCheckNotifications) {
                                safeDLEPushCall('info', "Нет карт для проверки.");
                            }
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
                updateMainButtonUI();
            }
            createMainCheckButton();
            unsafeWindow.addCheckButtons = addCheckButtons;
        }

        // ##############################################################################################################################################
        // НАЧАЛО БЛОКА: АВТО-ПРОВЕРКИ СПРОСА ПАКОВ
        // ##############################################################################################################################################

        // #######################################################################
        // # Создает кнопку и MutationObserver для автоматической проверки дубликатов на странице открытия паков.
        // #######################################################################
        async function createAutoPackCheckFeature() {
            if (!isCardPackPage()) return;
            const settings = await unsafeWindow.autoDup_loadSettings();
            const isAnyRankEnabled = Object.values(settings).some(isEnabled => isEnabled);
            if (!isAnyRankEnabled) {
                return;
            }
            const button = document.createElement('button');
            button.id = 'autoPackCheckButton';
            if (window.location.pathname.startsWith('/pm/')) {
                button.setAttribute('data-mce-bogus', '1');
            }
            const mainDupBtnRight = 10;
            const mainDupBtnWidth = 35;
            const gapBetweenButtons = 8;
            const newBtnWidth = 11;
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
                    button.style.background = 'linear-gradient(145deg, #28a745, #1e7e34)';
                    button.title = 'Авто-проверка паков: ВКЛЮЧЕНА (Нажмите для выключения)';
                    icon.style.animation = 'packCheckSpin 2s linear infinite';
                } else {
                    button.style.background = 'linear-gradient(145deg, rgba(100, 50, 50, 0.65), rgba(50, 50, 50, 0.65))';
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
                    isCheckingPack = true;
                    const cardsToClean = lootboxRow.querySelectorAll('.lootbox__card');
                    cardsToClean.forEach(card => {
                        card.classList.remove('div-checked');
                        const checkMark = card.querySelector('.div-marked.fa-check');
                        if (checkMark) checkMark.remove();
                    });
                    lastProcessedPackIdForAutoCheck = currentPackId;
                    setTimeout(() => {
                        const finalCheckRow = document.querySelector('.lootbox__row');
                        if (finalCheckRow && finalCheckRow.dataset.packId === currentPackId) {
                            triggerMassDuplicateCheckForPackPage(currentPackId);
                        } else {
                        }
                        isCheckingPack = false;
                    }, GM_getValue('autoPackCheck_initialDelay_ms', 1400));
                }
            });
            packPageObserver.observe(observerTargetNode, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'data-pack-id', 'class']
            });
        }

        // #######################################################################
        // # Наблюдатель специально для подсветки карт из списка желаний в паках
        // #######################################################################
        async function initPackWishlistGlowObserver() {
            if (!isCardPackPage()) return;
            const isEnabled = await GM_getValue('ascm_wishlistGlowEnabled', true);
            if (!isEnabled) return;
            const observerTargetNode = document.querySelector('.ncard-pack.lootbox');
            if (!observerTargetNode) return;
            const wishlistGlowObserver = new MutationObserver(() => {
                if (isProcessingBuyClick) return;
                const lootboxRow = document.querySelector('.lootbox__row');
                if (!lootboxRow || !lootboxRow.dataset.packId || lootboxRow.offsetParent === null) return;

                const currentPackId = lootboxRow.dataset.packId;
                if (currentPackId && currentPackId !== (unsafeWindow.lastProcessedPackForGlowHighlight || null)) {
                    unsafeWindow.lastProcessedPackForGlowHighlight = currentPackId;
                    setTimeout(() => {
                        const finalCheckRow = document.querySelector('.lootbox__row');
                        if (finalCheckRow && finalCheckRow.dataset.packId === currentPackId) {
                           highlightWishlistCardsInPack();
                        }
                    }, 300);
                }
            });
            wishlistGlowObserver.observe(observerTargetNode, {
                childList: true, subtree: true, attributes: true,
                attributeFilter: ['style', 'data-pack-id', 'class']
            });
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
                unsafeWindow.isAutoDuplicateCheckTriggered = true;
                isProcessingAutoPackCheck = true;
                massCheckBtn.click();
            } else {
            }
        }

        // #######################################################################
        // # Запускает массовую проверку спроса для карт A/S ранга из открытого пака.
        // #######################################################################
        async function triggerMassDemandCheckForPackPage(packId) {
            if (!autoDemandCheckEnabled) return;
            const settings = await unsafeWindow.autoDemand_loadSettings();
            const ranksToCheck = Object.keys(settings).filter(rank => settings[rank]);
            if (ranksToCheck.length === 0) {
                return;
            }
            const lootboxRow = document.querySelector('.lootbox__row');
            if (!lootboxRow) return;
            const cardsInPack = Array.from(lootboxRow.querySelectorAll('.lootbox__list .lootbox__card'));
            if (cardsInPack.length === 0) return;
            let highestNotifyRank = null;
            cardsInPack.forEach(card => {
                const rank = card.dataset.rank?.toLowerCase();
                if (rank === 'ass') {
                    highestNotifyRank = 'ass';
                } else if (rank === 's' && highestNotifyRank !== 'ass') {
                    highestNotifyRank = 's';
                } else if (rank === 'a' && highestNotifyRank !== 'ass' && highestNotifyRank !== 's') {
                    highestNotifyRank = 'a';
                }
            });
            if (highestNotifyRank) {
                showHighRankCardNotification(highestNotifyRank);
            }
            const promises = [];
            cardsInPack.forEach(card => {
                const rank = card.dataset.rank?.toLowerCase();
                if (rank && ranksToCheck.includes(rank)) {
                    promises.push(async () => {
                        const typeCardId = await getCardId(card, 'type');
                        if (typeCardId) {
                            await updateCardInfo(typeCardId, card, false);
                        }
                    });
                }
            });
            if (promises.length > 0) {
                for (const promiseFunc of promises) {
                    await promiseFunc();
                    await sleep(200);
                }
            }
        }

        // #######################################################################
        // # Создает кнопку и MutationObserver для автоматической проверки спроса на A/S карты на странице паков.
        // #######################################################################
        async function createAutoDemandCheckFeature() {
            if (!isCardPackPage()) return;
            const settings = await unsafeWindow.autoDemand_loadSettings();
            const isAnyRankEnabled = Object.values(settings).some(isEnabled => isEnabled);
            if (!isAnyRankEnabled) {
                return;
            }
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
                    button.style.background = 'linear-gradient(145deg, #28a745, #1e7e34)';
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
                if (autoDemandCheckEnabled) {
                    const lootboxRow = document.querySelector('.lootbox__row');
                    if (lootboxRow && lootboxRow.offsetParent !== null) {
                        const currentPackId = lootboxRow.dataset.packId;
                        if (currentPackId && currentPackId !== lastProcessedPackIdForDemandCheck) {
                            console.log('[AutoDemandCheck] Запуск проверки при включении для видимого пака ID:', currentPackId);
                            triggerMassDemandCheckForPackPage(currentPackId);
                        }
                    }
                }
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
                            triggerMassDemandCheckForPackPage(currentPackId);
                        } else {
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
        // ##############################################################################################################################################
        // КОНЕЦ БЛОКА: АВТО-ПРОВЕРКА СПРОСА ПАКОВ
        // ##############################################################################################################################################


        function initDemandCheckObserver() {
            const cardContainerSelectors = [
                '.trade__inventory-list',
                '.remelt__inventory-list',
            ];
            const observerCallback = (mutationsList, observer) => {
                const hasContentChanged = mutationsList.some(mutation =>
                                                             mutation.type === 'childList' &&
                                                             (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
                                                            );
                if (hasContentChanged) {
                    currentDemandCheckInstanceId++;
                    if (isProcessCardsRunning) {
                        shouldStopProcessCards = true;
                        isProcessCardsRunning = false;
                        const btnSinglePage = document.getElementById('processCards');
                        const btnAllPages = document.getElementById('processAllPagesBtn');
                        const defaultBackground = originalProcessCardsColor || 'linear-gradient(145deg, rgb(166, 100, 110), rgb(222, 0, 5))';
                        if (btnSinglePage) {
                            btnSinglePage.style.background = defaultBackground;
                            const icon = btnSinglePage.querySelector('span:first-child');
                            if (icon) icon.className = 'fal fa-rocket';
                            btnSinglePage.title = 'Проверить спрос (текущая страница)';
                            btnSinglePage.disabled = false;
                        }
                        if (btnAllPages) {
                            btnAllPages.style.background = defaultBackground;
                            const icon = btnAllPages.querySelector('span:first-child');
                            if (icon) {
                                icon.className = 'fal fa-rocket';
                                icon.style.animation = '';
                            }
                            btnAllPages.title = 'Проверить спрос (ВСЕ страницы)';
                            btnAllPages.disabled = false;
                        }
                        originalProcessCardsColor = '';
                    }
                }
            };
            const observer = new MutationObserver(observerCallback);
            cardContainerSelectors.forEach(selector => {
                const targetNode = document.querySelector(selector);
                if (targetNode) {
                    observer.observe(targetNode, { childList: true });
                    console.log(`[Demand Check Observer] Наблюдатель установлен на: ${selector}`);
                }
            });
        }

        // #######################################################################
        // # Создает кнопку для авто-проверки спроса на страницах ОБМЕНА
        // #######################################################################
        async function createAutoDemandTradeButtonFeature() {
            if (!window.location.pathname.startsWith('/trades/')) return;
            const settings = await unsafeWindow.autoDemandTrade_loadSettings();
            const isAnyRankEnabled = Object.values(settings).some(isEnabled => isEnabled);
            if (!isAnyRankEnabled) {
                return;
            }
            const button = document.createElement('button');
            button.id = 'autoDemandTradeButton';
            button.style.cssText = `
                position: fixed; bottom: 390px; right: 27px; z-index: 100;
                width: 40px; height: 40px; border-radius: 50%;
                mask: radial-gradient(circle at 80% 50%, transparent 20px, black 0px);
                -webkit-mask: radial-gradient(circle at 80% 50%, transparent 20px, black 0px);
                justify-content: flex-start; padding: 0 0 0 1px;
                border: none; cursor: pointer; box-shadow: 0 0 10px rgba(0,0,0,0.7);
                display: flex; align-items: center; transition: all 0.3s ease; color: black;
            `;
            const icon = document.createElement('span');
            icon.className = 'fal fa-rocket';
            icon.style.fontSize = '10px';
            button.appendChild(icon);

            // #######################################################################
            // #######################################################################
            function updateButtonStateVisuals() {
                if (autoDemandTradeEnabled) {
                    button.style.background = 'linear-gradient(145deg, #28a745, #1e7e34)';
                    button.title = 'Авто-проверка спроса: ВКЛЮЧЕНА';
                    icon.style.animation = 'acm-spin 2s linear infinite';
                } else {
                    button.style.background = 'linear-gradient(145deg, rgba(166, 100, 110), rgba(222, 0, 5))';
                    button.title = 'Авто-проверка спроса: ВЫКЛЮЧЕНА';
                    icon.style.animation = 'none';
                }
            }
            updateButtonStateVisuals();
            button.addEventListener('click', () => {
                autoDemandTradeEnabled = !autoDemandTradeEnabled;
                localStorage.setItem('autoDemandTradeEnabledState', autoDemandTradeEnabled.toString());
                updateButtonStateVisuals();
                safeDLEPushCall('info', `Авто-проверка спроса на страницах обмена ${autoDemandTradeEnabled ? 'включена' : 'выключена'}.`);
                if (autoDemandTradeEnabled) {
                    processCards(false, true);
                }
            });
            document.body.appendChild(button);
            if (!managedButtonSelectors.includes('#autoDemandTradeButton')) {
                managedButtonSelectors.push('#autoDemandTradeButton');
            }
        }

        // #######################################################################
        // # Добавляет на страницу глобальные CSS-стили, необходимые для работы скрипта.
        // #######################################################################
        function addCustomStyles() {
            const styleId = 'asstars-card-master-styles';
            if (document.getElementById(styleId)) return;
            const customStyle = document.createElement('style');
            customStyle.id = styleId;
            customStyle.innerHTML = `
                /* Стиль для страниц трейда */
                .noffer .acm-card-stats {
                    display: flex;
                    justify-content: center; /* Центрируем */
                    align-items: center;
                    gap: 5px; /* Уменьшаем расстояние между элементами */
                    padding: 10px 0;
                }

                .noffer .acm-card-stats span {
                    font-size: 0.8em;
                    color: rgb(0, 120, 50);
                    font-weight: bold;
                }
                /* ===== ОСНОВНЫЕ СТИЛИ ДЛЯ БЛОКА ПОД КАРТОЙ (ДЛЯ ШИРОКИХ ЭКРАНОВ) ===== */
                .acm-stats-wrapper {
                    width: 100%;
                    background: #252525;
                    padding: 5px 0;
                    margin-top: -4px;
                    border-radius: 0 0 8px 8px;
                    box-sizing: border-box;
                }
                .acm-card-stats {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    align-items: center;
                    width: 100%;
                    white-space: nowrap;
                }
                /* По умолчанию: иконка РЯДОМ с цифрой */
                .acm-card-stats > span {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                }
                .acm-card-stats > span > i,
                .acm-card-stats > span > span {
                    line-height: 1.1 !important;
                }

                /* ===== ИСПРАВЛЕНИЕ ДЛЯ СТРАНИЦЫ ИСТОРИИ ОБМЕНОВ ===== */
                .history__body-item.acm-card-container {
                    display: inline-flex;
                    flex-direction: column;
                    vertical-align: top; /* Предотвращает "прыжки" карточек разной высоты */
                }
                .history__body-item .acm-stats-wrapper {
                    margin-top: 0;
                }
                .history__body-item .acm-card-stats {
                    flex-wrap: wrap; /* Разрешаем перенос элементов */
                    justify-content: center; /* Центрируем, если они перенеслись */
                    gap: 8px; /* Добавляем отступ между элементами */
                    padding: 2px;
                }
                /* Уменьшаем шрифт и иконки только для истории, чтобы они лучше помещались */
                .history__body-item .acm-card-stats span > i {
                    font-size: 11px !important;
                }
                .history__body-item .acm-card-stats span > span {
                    font-size: 12px !important;
                }
                /* ===== АДАПТИВНЫЕ СТИЛИ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ (ЭКРАНЫ 650px И МЕНЬШЕ) ===== */
                @media (max-width: 650px) {
                    /* На маленьких экранах делаем иконку НАД цифрой */
                    .acm-card-stats > span {
                        flex-direction: column !important; /* Ставим в колонку */
                        gap: 1px !important;              /* Уменьшаем отступ */
                    }
                    /* Также немного уменьшаем шрифт, чтобы всё гарантированно поместилось */
                    .acm-card-stats > span > i {
                        font-size: 1em !important;   /* Размер иконки */
                    }
                    .acm-card-stats > span > span {
                        font-size: 0.9em !important; /* Размер цифр */
                    }
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
            let userEl = document.querySelector('.lgn__name span');
            if (userEl && userEl.textContent) {
                return userEl.textContent.trim();
            }
            userEl = document.querySelector('.header__ava.js-show-login img, .lgn__ava.usn__ava img');
            if (userEl) {
                const username = userEl.getAttribute('title') || userEl.getAttribute('alt');
                if (username) return username.trim();
            }
            userEl = document.querySelector('.lgn__name a[href*="/user/"]');
            if (userEl && userEl.href) {
                const match = userEl.href.match(/\/user\/([^/]+)\/?/);
                if (match && match[1]) {
                    return decodeURIComponent(match[1]);
                }
            }
            userEl = document.querySelector('#vm-custom-buttons-container a[href*="/user/"]');
            if (userEl && userEl.href) {
                const match = userEl.href.match(/\/user\/cards\/\?name=([^&]+)/);
                if (match && match[1]) {
                    return decodeURIComponent(match[1]);
                }
            }
            return null;
        }

        // #######################################################################
        // # Обновляет все визуальные элементы счетчиков.
        // #######################################################################
        function updateAllCardCountDisplays(text, className) {
            const match = text.match(/(\d+)/);
            const currentCount = match ? parseInt(match[1], 10) : 0;
            if (cardCountElement) {
                cardCountElement.textContent = text;
                if (className) {
                    cardCountElement.className = className;
                }
            }
            if (autoCollectButtonCounter) {
                if (currentCount > 0) {
                    autoCollectButtonCounter.textContent = currentCount;
                    autoCollectButtonCounter.style.display = 'flex';
                } else {
                    autoCollectButtonCounter.style.display = 'none';
                }
            }
        }

        // #######################################################################
        // Загружает счетчик с полной страницы профиля.
        // #######################################################################
        async function updateCardCounter(forceUpdate = false) {
            const now = Date.now();
            const cachedData = await GM_getValue(CARD_COUNT_CACHE_KEY, null);
            if (cachedData) {
                updateAllCardCountDisplays(cachedData.text, cachedData.className);
            }
            if (!isLeaderWatch) {
                return;
            }
            if (!forceUpdate && cachedData && (now - cachedData.timestamp < CARD_COUNT_CACHE_TTL)) {
                return;
            }
            const username = asbm_getUsername();
            if (!username) return;
            console.log(`Обновляю счетчик карт с профиля (полная страница)...`);
            try {
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
                            const isCurrentlyPaused = await GM_getValue(COLLECTION_PAUSED_KEY, false);
                            if (current === 0 && isCurrentlyPaused) {
                                console.log(`Счетчик карт 0/${limit}, а сбор был на паузе. Сбрасываю паузу.`);
                                safeDLEPushCall('info', 'Счетчик карт сброшен. Пауза авто-сбора снята.');
                                await GM_setValue(COLLECTION_PAUSED_KEY, false);
                                await GM_deleteValue(PAUSE_DATE_KEY);
                                const toggleButton = document.getElementById('toggleScriptButton');
                                if (toggleButton) {
                                    unsafeWindow.updateFullToggleButtonState(toggleButton);
                                }
                                if (typeof unsafeWindow.triggerImmediateCardCheck === 'function') {
                                    unsafeWindow.triggerImmediateCardCheck();
                                }
                            }
                            const newText = `${current} / ${limit}`;
                            const newClassName = current >= limit ? 'limit-reached' : 'in-progress';
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
                if (!found) console.warn('Не удалось найти счетчик карт на странице профиля.');
            } catch (error) {
                console.error('Ошибка при обновлении счетчика карт (полная страница):', error);
            }
        }
        unsafeWindow.updateCardCounter = updateCardCounter;

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
                asbm_renderOrUpdateElements();
            }

            // #######################################################################
            // # Создает и отображает модальное окно для настройки (добавления/редактирования/удаления) закладок.
            // #######################################################################
            function asbm_openSettingsModal() {
                let currentUserBookmarks = asbm_loadUserBookmarks();
                const isCurrentlyEnabled = GM_getValue(ASBM_FEATURE_ENABLED_KEY, true);
                const MODAL_WRAPPER_ID = 'acm_modal_wrapper';
                const existingWrapper = document.getElementById(MODAL_WRAPPER_ID);
                if (existingWrapper) existingWrapper.remove();
                const wrapper = document.createElement('div');
                wrapper.id = MODAL_WRAPPER_ID;
                wrapper.innerHTML = `
                    <div class="acm-modal-backdrop"></div>
                    <div class="acm-modal" id="asbm_settings_modal">
                    <div class="modal-header">
                    <h2>Настройка закладок</h2>
                    <div class="setting-row">
                    <label class="asbm-toggle-switch-label">Панель:</label>
                    <label class="protector-toggle-switch">
                    <input type="checkbox" id="asbm-enable-checkbox" ${isCurrentlyEnabled ? 'checked' : ''}>
                    <span class="protector-toggle-slider"></span>
                    </label>
                    </div>
                    </div>
                    <div class="modal-body">
                    <div class="bookmarks-list"></div>
                    </div>
                    <div class="modal-footer">
                    <button id="asbm-back-to-main" class="action-btn back-btn">Назад</button>
                    <button id="gm-add-bookmark" class="action-btn">Добавить</button>
                    <button id="gm-save-settings" class="action-btn save-btn">Сохранить</button>
                    </div>
                    </div>`;
                document.body.appendChild(wrapper);
                const modal = wrapper.querySelector('#asbm_settings_modal');

                // #######################################################################
                // #######################################################################
                function redrawModalList() {
                    let listHtml = '';
                    if (currentUserBookmarks.length === 0) {
                        listHtml = '<p style="text-align: center; color: #99aab5;">Вы еще не добавили свои закладки.</p>';
                    } else {
                        currentUserBookmarks.forEach((bm, index) => {
                            listHtml += `<div class="bookmark-entry" style="display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 8px 12px; background-color: #1e1f22; border: 1px solid #33353a; border-radius: 4px; overflow: hidden; margin-bottom: 6px;">
                            <div style="flex-grow: 1; flex-shrink: 1; min-width: 0;">
                            <span class="bookmark-name" style="font-weight: 500; color: #ccc; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${bm.name}</span>
                            <span class="bookmark-url" style="color: #888; font-size: 11px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${bm.url}</span>
                            </div>
                            <div class="bookmark-actions" style="display: flex; gap: 6px; flex-shrink: 0;">
                            <button data-index="${index}" class="edit-btn action-btn" style="padding: 5px 10px; font-size: 11px;">Ред.</button>
                            <button data-index="${index}" class="delete-btn action-btn" style="padding: 5px 10px; font-size: 11px; background-color: #c83a54;">Удл.</button>
                            </div>
                            </div>`;
                        });
                    }
                    modal.querySelector('.bookmarks-list').innerHTML = listHtml;
                    attachModalEventListeners();
                }

                // #######################################################################
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
                        btn.onclick = async e => {
                            const index = e.target.dataset.index;
                            const message = `Вы уверены, что хотите удалить закладку "<b style="color: #d4506a;">${currentUserBookmarks[index].name}</b>"?`;
                            const confirmation = await protector_customConfirm(message);
                            if (confirmation) {
                                currentUserBookmarks.splice(index, 1);
                                redrawModalList();
                            }
                        };
                    });
                }
                redrawModalList();
                modal.querySelector('#gm-add-bookmark').onclick = () => {
                    const name = prompt('Введите название новой закладки:');
                    if (!name) return;
                    const url = prompt('Введите URL новой закладки:', window.location.href);
                    if (!url) return;
                    currentUserBookmarks.unshift({ name: name.trim(), url: url.trim() });
                    redrawModalList();
                };
                const closeModal = () => wrapper.remove();
                modal.querySelector('#asbm-back-to-main').onclick = () => {
                    closeModal();
                    unsafeWindow.openMasterSettingsModal();
                };
                modal.querySelector('#gm-save-settings').onclick = () => {
                    asbm_saveUserBookmarks(currentUserBookmarks);
                    const newIsEnabled = modal.querySelector('#asbm-enable-checkbox').checked;
                    if (newIsEnabled !== isCurrentlyEnabled) {
                        GM_setValue(ASBM_FEATURE_ENABLED_KEY, newIsEnabled);
                        safeDLEPushCall('info', `Панель закладок теперь ${newIsEnabled ? 'ВКЛЮЧЕНА' : 'ВЫКЛЮЧЕНА'}. Перезагрузка...`);
                        setTimeout(() => { window.location.reload(); }, 2000);
                    } else {
                        safeDLEPushCall('success', 'Настройки закладок сохранены!');
                    }
                    closeModal();
                };
                wrapper.querySelector('.acm-modal-backdrop').onclick = closeModal;
            }
            unsafeWindow.asbm_openSettingsModal = asbm_openSettingsModal;

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
            const isAsbmFeatureEnabled = GM_getValue(ASBM_FEATURE_ENABLED_KEY, true);
            if (!isAsbmFeatureEnabled) {
                return;
            }
            // #######################################################################
            //СТИЛЬ ДЛЯ КНОПКИ СПРОСА С ПЕРЕХОДОМ
            // #######################################################################
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

            // #######################################################################
            // # Генерирует массив 'защищенных' (системных) закладок по-умолчанию (База, Трейды и т.д.).
            // #######################################################################
            function asbm_generateProtectedBookmarks(username) {
                const domain = window.location.origin;
                const myCardsUrl = username ? `${domain}/user/cards/?name=${username}` : `${domain}/user/`;
                return [
                    { name: "База", url: `${domain}/cards/`, icon: "fa-database" },
                    { name: "Обмены", url: `${domain}/trades/`, icon: "fa-exchange-alt" },
                    { name: "Карты", url: myCardsUrl, icon: "fa-layer-group" },
                    { name: "Паки", url: `${domain}/cards/pack/`, icon: "fa-box-open" },
                    { name: "Промо", url: `${domain}/promo_codes/`, icon: "fa-gift" }
                ];
            }
            // #######################################################################
            // Стили для кнопок (закладки)
            // #######################################################################
            GM_addStyle(`
            #asbm_bar { position: fixed; left: 0; right: 0; z-index: 21; padding: 10px 0; display: flex; justify-content: center; pointer-events: none; }
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
        // ##############################################################################################################################################
        // КОНЕЦ БЛОКА: Кастомных закладок
        // ##############################################################################################################################################

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
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `
                <div class="acm-modal-backdrop"></div>
                <div class="acm-modal" id="cache_settings_modal" style="width: 500px;">
                <div class="modal-header">
                <h2>Настройки кэша (спроса карт)</h2>
                </div>
                <div class="modal-body">
                <div style="display: flex; flex-direction: column; gap: 20px;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <label for="cache-days-slider" style="font-size: 0.9em; color: #ccc;">Дни:</label>
                <input type="range" id="cache-days-slider" min="0" max="30" step="1" style="width: 80%;">
                <span id="cache-days-display" style="font-weight: bold; color: #a0a0a0; font-size: 0.9em;"></span>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <label for="cache-hours-slider" style="font-size: 0.9em; color: #ccc;">Часы:</label>
                <input type="range" id="cache-hours-slider" min="0" max="23" step="1" style="width: 80%;">
                <span id="cache-hours-display" style="font-weight: bold; color: #a0a0a0; font-size: 0.9em;"></span>
                </div>
                </div>
                <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #33353a;">
                <span style="font-size: 0.9em; color: #ccc;">Итого хранить:</span>
                <div id="cache-total-display" style="font-weight: bold; color: white; font-family: monospace; font-size: 1.2em; margin-top: 5px;"></div>
                </div>
                </div>
                <div class="modal-footer">
                <button id="gm-back-to-main" class="action-btn back-btn">Назад</button>
                <button id="gm-clear-cache-in-modal-btn" class="action-btn close-btn">Очистить кэш</button>
                <button id="gm-save-cache-settings" class="action-btn save-btn">Сохранить</button>
                </div>
                </div>`;
            document.body.appendChild(wrapper);
            const daySlider = wrapper.querySelector('#cache-days-slider');
            const hourSlider = wrapper.querySelector('#cache-hours-slider');
            const dayDisplay = wrapper.querySelector('#cache-days-display');
            const hourDisplay = wrapper.querySelector('#cache-hours-display');
            const totalDisplay = wrapper.querySelector('#cache-total-display');
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
            const closeModal = () => wrapper.remove();
            wrapper.querySelector('#gm-back-to-main').onclick = () => {
                closeModal();
                unsafeWindow.openMasterSettingsModal();
            };
            wrapper.querySelector('#gm-clear-cache-in-modal-btn').onclick = async () => {
                const confirmation = await protector_customConfirm('Вы точно хотите очистить кэш всех карт?');
                if (confirmation) {
                    clearCardCache();
                    closeModal();
                }
            };
            wrapper.querySelector('#gm-save-cache-settings').onclick = () => {
                const days = parseInt(daySlider.value, 10);
                const hours = parseInt(hourSlider.value, 10);
                const newTotalHours = (days * 24) + hours;
                GM_setValue(CACHE_TTL_STORAGE_KEY, newTotalHours);
                safeDLEPushCall('success', `Настройки кэша сохранены: ${convertHoursToReadableString(newTotalHours)}.`);
                closeModal();
            };
            wrapper.querySelector('.acm-modal-backdrop').onclick = closeModal;
        }
        unsafeWindow.openCacheSettingsModal = openCacheSettingsModal;

        // #######################################################################
        // # Открывает модальное окно для настройки отображения статистики карт.
        // #######################################################################
        async function openDisplaySettingsModal() {
            const DEFAULT_ICON_SIZE = 11;
            const DEFAULT_FONT_SIZE = 12;
            const DEFAULT_RANK_COLORS = {
                sss: '#cfcfcf', e: '#9c6f51', d: '#a09b91', c: '#019145',
                b: '#2094e4', a: '#d93134', s: '#a74ccf',
                ass: '#772ce8'
            };
            const DEFAULT_ICON_COLORS = {
                need: '#43b581',
                trade: '#faa61a',
                owners: '#54a8ee'
            };
            const ICON_LABELS = {
                need: 'Хотят получить',
                trade: 'Готовы обменять',
                owners: 'Владельцев'
            };
            const wrapper = document.createElement('div');
            wrapper.id = 'acm_modal_wrapper';
            wrapper.innerHTML = `
                <div class="acm-modal-backdrop"></div>
                <div class="acm-modal" id="display_settings_modal" style="width: 550px;">
                    <div class="modal-header">
                        <h2>Настройки отображения спроса</h2>
                    </div>
                    <div class="modal-body" style="display: flex; flex-direction: column; gap: 20px;">
                        <!-- Секция размеров -->
                        <div>
                            <p style="font-size: 13px; color: #999; text-align: center; margin-bottom: 15px;">Настройте размер иконок и текста.</p>
                            <div style="display: flex; flex-direction: column; gap: 15px;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <label for="icon-size-slider" style="font-size: 0.9em; color: #ccc; flex-basis: 100px;">Иконки:</label>
                                    <input type="range" id="icon-size-slider" min="8" max="20" step="1" style="flex-grow: 1;">
                                    <span id="icon-size-display" style="font-weight: bold; color: #a0a0a0; font-size: 0.9em; min-width: 40px; text-align: right;"></span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <label for="font-size-slider" style="font-size: 0.9em; color: #ccc; flex-basis: 100px;">Текст:</label>
                                    <input type="range" id="font-size-slider" min="8" max="20" step="1" style="flex-grow: 1;">
                                    <span id="font-size-display" style="font-weight: bold; color: #a0a0a0; font-size: 0.9em; min-width: 40px; text-align: right;"></span>
                                </div>
                            </div>
                        </div>
                        <!-- Секция цветов иконок -->
                        <div style="border-top: 1px solid #33353a; padding-top: 20px;">
                            <p style="font-size: 13px; color: #999; text-align: center; margin-bottom: 15px;">Настройте цвета иконок.</p>
                            <div id="icon-color-settings" style="display: grid; grid-template-columns: 1fr; gap: 10px;"></div>
                        </div>
                        <!-- Секция цветов рангов -->
                        <div style="border-top: 1px solid #33353a; padding-top: 20px;">
                            <p style="font-size: 13px; color: #999; text-align: center; margin-bottom: 15px;">Настройте цвета для каждого ранга.</p>
                            <div id="rank-color-settings" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;"></div>
                        </div>
                    </div>
                    <div class="modal-footer" style="justify-content: space-between !important;">
                        <button id="display-back-btn" class="action-btn back-btn">Назад</button>
                        <div>
                            <button id="display-reset-btn" class="action-btn" style="background-color: #d65a28;">Сбросить</button>
                            <button id="display-save-btn" class="action-btn save-btn">Сохранить</button>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(wrapper);
            const iconSlider = wrapper.querySelector('#icon-size-slider');
            const fontSlider = wrapper.querySelector('#font-size-slider');
            const iconDisplay = wrapper.querySelector('#icon-size-display');
            const fontDisplay = wrapper.querySelector('#font-size-display');
            const updateSizeDisplays = () => {
                iconDisplay.textContent = `${iconSlider.value}px`;
                fontDisplay.textContent = `${fontSlider.value}px`;
            };
            iconSlider.value = await GM_getValue('ascm_statsIconSize', DEFAULT_ICON_SIZE);
            fontSlider.value = await GM_getValue('ascm_statsFontSize', DEFAULT_FONT_SIZE);
            updateSizeDisplays();
            iconSlider.addEventListener('input', updateSizeDisplays);
            fontSlider.addEventListener('input', updateSizeDisplays);
            const iconColorContainer = wrapper.querySelector('#icon-color-settings');
            for (const [key, label] of Object.entries(ICON_LABELS)) {
                const savedColor = await GM_getValue(`ascm_iconColor_${key}`, DEFAULT_ICON_COLORS[key]);
                const settingRow = document.createElement('div');
                settingRow.style.cssText = `display: flex; align-items: center; gap: 8px;`;
                settingRow.innerHTML = `
                    <label style="flex-basis: 150px; color: #ccc;">${label}:</label>
                    <input type="color" data-icon-key="${key}" value="${savedColor}" style="border: none; padding: 0; width: 30px; height: 30px; background: none; cursor: pointer;">
                    <input type="text" data-icon-text-key="${key}" value="${savedColor}" style="flex-grow: 1; font-family: monospace; padding: 5px 8px; border-radius: 3px; border: 1px solid #33353a; background-color: #27292d; color: #b0b0b0;">
                `;
                iconColorContainer.appendChild(settingRow);
            }
            const rankColorContainer = wrapper.querySelector('#rank-color-settings');
            const orderedRanks = ['ass', 'sss', 's', 'a', 'b', 'c', 'd', 'e'];
            for (const rank of orderedRanks) {
                if (!DEFAULT_RANK_COLORS.hasOwnProperty(rank)) continue;
                const savedColor = await GM_getValue(`ascm_rankColor_${rank}`, DEFAULT_RANK_COLORS[rank]);
                const settingRow = document.createElement('div');
                settingRow.style.cssText = `display: flex; align-items: center; gap: 8px;`;
                settingRow.innerHTML = `
                    <label style="flex-basis: 70px; text-transform: uppercase; font-weight: bold; color: #ccc;">Ранг ${rank}:</label>
                    <input type="color" data-rank-key="${rank}" value="${savedColor}" style="border: none; padding: 0; width: 30px; height: 30px; background: none; cursor: pointer;">
                    <input type="text" data-rank-text-key="${rank}" value="${savedColor}" style="flex-grow: 1; font-family: monospace; padding: 5px 8px; border-radius: 3px; border: 1px solid #33353a; background-color: #27292d; color: #b0b0b0;">
                `;
                rankColorContainer.appendChild(settingRow);
            }
            wrapper.querySelectorAll('input[type="color"]').forEach(colorInput => {
                colorInput.addEventListener('input', (e) => {
                    const key = e.target.dataset.rankKey || e.target.dataset.iconKey;
                    const textInput = wrapper.querySelector(`input[data-rank-text-key="${key}"], input[data-icon-text-key="${key}"]`);
                    if (textInput) textInput.value = e.target.value;
                });
            });
            wrapper.querySelectorAll('input[type="text"]').forEach(textInput => {
                textInput.addEventListener('input', (e) => {
                    const key = e.target.dataset.rankTextKey || e.target.dataset.iconTextKey;
                    const colorInput = wrapper.querySelector(`input[data-rank-key="${key}"], input[data-icon-key="${key}"]`);
                    if (colorInput && /^#[0-9A-F]{6}$/i.test(e.target.value)) {
                        colorInput.value = e.target.value;
                    }
                });
            });
            const closeModal = () => wrapper.remove();
            wrapper.querySelector('#display-back-btn').onclick = () => {
                closeModal();
                unsafeWindow.openMasterSettingsModal();
            };
            wrapper.querySelector('#display-reset-btn').onclick = async () => {
                iconSlider.value = DEFAULT_ICON_SIZE;
                fontSlider.value = DEFAULT_FONT_SIZE;
                updateSizeDisplays();
                const orderedRanksForReset = ['ass', 'sss', 's', 'a', 'b', 'c', 'd', 'e'];
                for (const rank of orderedRanksForReset) {
                    if (!DEFAULT_RANK_COLORS.hasOwnProperty(rank)) continue;
                    wrapper.querySelector(`input[data-rank-key="${rank}"]`).value = DEFAULT_RANK_COLORS[rank];
                    wrapper.querySelector(`input[data-rank-text-key="${rank}"]`).value = DEFAULT_RANK_COLORS[rank];
                }
                for (const key of Object.keys(DEFAULT_ICON_COLORS)) {
                    wrapper.querySelector(`input[data-icon-key="${key}"]`).value = DEFAULT_ICON_COLORS[key];
                    wrapper.querySelector(`input[data-icon-text-key="${key}"]`).value = DEFAULT_ICON_COLORS[key];
                }
                safeDLEPushCall('info', 'Настройки сброшены. Нажмите "Сохранить" для применения.');
            };
            wrapper.querySelector('#display-save-btn').onclick = async () => {
                const promises = [];
                promises.push(GM_setValue('ascm_statsIconSize', parseInt(iconSlider.value, 10)));
                promises.push(GM_setValue('ascm_statsFontSize', parseInt(fontSlider.value, 10)));

                const orderedRanksForSave = ['ass', 'sss', 's', 'a', 'b', 'c', 'd', 'e'];
                for (const rank of orderedRanksForSave) {
                    if (!DEFAULT_RANK_COLORS.hasOwnProperty(rank)) continue;
                    const textInput = wrapper.querySelector(`input[data-rank-text-key="${rank}"]`);
                    promises.push(GM_setValue(`ascm_rankColor_${rank}`, textInput.value));
                }
                for (const key of Object.keys(DEFAULT_ICON_COLORS)) {
                    const textInput = wrapper.querySelector(`input[data-icon-text-key="${key}"]`);
                    promises.push(GM_setValue(`ascm_iconColor_${key}`, textInput.value));
                }
                await Promise.all(promises);
                safeDLEPushCall('success', 'Настройки отображения сохранены! Перезагрузка...');
                setTimeout(() => window.location.reload(), 1500);
            };
            wrapper.querySelector('.acm-modal-backdrop').onclick = closeModal;
        }
        unsafeWindow.openDisplaySettingsModal = openDisplaySettingsModal;

        // #######################################################################
        // --- Модальное окно для управления кристаллами ---
        // #######################################################################
        async function openCrystalControlModal() {
            const wrapper = document.createElement('div');
            wrapper.id = 'acm_modal_wrapper';
            wrapper.innerHTML = `
                <div class="acm-modal-backdrop"></div>
                <div class="acm-modal" id="crystal_control_modal" style="width: 380px;">
                <div class="modal-header">
                <h2>Управление сбором кристаллов</h2>
                </div>
                <div class="modal-body">
                <p style="text-align: center; color: #99aab5; margin-bottom: 20px;">
                Текущий счет: <b style="color: white;">${clickedCrystals}</b> кликов / <b style="color: white;">${collectedStones}</b> сборов
                </p>
                <div class="setting-row" style="margin-bottom: 10px;">
                <span>Звуковое уведомление при сборе</span>
                <label class="protector-toggle-switch">
                <input type="checkbox" id="crystal-sound-toggle">
                <span class="protector-toggle-slider"></span>
                </label>
                </div>
                <div id="crystal-reset-row" class="setting-row" style="cursor: pointer; padding: 8px; border-radius: 4px; transition: background-color 0.2s;">
                <span style="color: #ed4245; font-weight: 500;">Сбросить все счетчики</span>
                <!-- Иконка для наглядности -->
                <i class="fal fa-trash-alt" style="color: #ed4245;"></i>
                </div>
                </div>
                <div class="modal-footer" style="justify-content: flex-end;">
                <button id="crystal-close-btn" class="action-btn">Закрыть</button>
                </div>
                </div>`;
            document.body.appendChild(wrapper);
            const closeModal = () => wrapper.remove();
            const soundToggle = wrapper.querySelector('#crystal-sound-toggle');
            soundToggle.checked = await GM_getValue('gm_crystalSoundEnabled', false);
            soundToggle.addEventListener('change', () => {
                soundEnabled = soundToggle.checked;
                GM_setValue('gm_crystalSoundEnabled', soundEnabled);
            });
            const resetRow = wrapper.querySelector('#crystal-reset-row');
            resetRow.addEventListener('click', async () => {
                const confirmation = await protector_customConfirm('Вы уверены, что хотите сбросить счетчики кликов и сборов?');
                if (confirmation) {
                    if (typeof unsafeWindow.handleFullCrystalReset === 'function') {
                        await unsafeWindow.handleFullCrystalReset();
                        await GM_setValue('gm_lastClickedResetTimestamp', Date.now());
                        await GM_setValue(CRYSTAL_RESET_BROADCAST_KEY, Date.now());
                        safeDLEPushCall('success', 'Счетчики кристаллов сброшены!');
                        closeModal();
                    } else {
                        safeDLEPushCall('error', 'Функция сброса не найдена!');
                    }
                }
            });
            resetRow.addEventListener('mouseenter', () => { resetRow.style.backgroundColor = 'rgba(237, 66, 69, 0.1)'; });
            resetRow.addEventListener('mouseleave', () => { resetRow.style.backgroundColor = 'transparent'; });
            wrapper.querySelector('#crystal-close-btn').onclick = closeModal;
            wrapper.querySelector('.acm-modal-backdrop').onclick = closeModal;
        }
        unsafeWindow.openCrystalControlModal = openCrystalControlModal;
        // ##############################################################################################################################################
        // КОНЕЦ БЛОКА
        // ##############################################################################################################################################

        // #######################################################################
        // # Создает и инициализирует UI-компонент (кнопку-замок) для управления блокировкой лидера.
        // #######################################################################
        async function createLeaderLockButton() {
            const isEnabled = await GM_getValue(LEADER_LOCK_BTN_ENABLED_KEY, true);
            if (!isEnabled) {
                return;
            }
            if (document.getElementById('leaderLockButton')) return;
            leaderLockButtonElement = document.createElement('button');
            leaderLockButtonElement.id = 'leaderLockButton';
            Object.assign(leaderLockButtonElement.style, {
                position: 'fixed',
                bottom: '166px',
                right: '12px',
                zIndex: '101',
                width: '40px',
                height: '20px',
                background: 'linear-gradient(145deg, #4f545c, #36393f)',
                border: 'none',
                borderRadius: '0 0 20px 20px',
                transition: 'all 0.2s ease',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0',
                mask: 'radial-gradient(circle at 50% -75%, transparent 24px, black 0px)',
                '-webkit-mask': 'radial-gradient(circle at 50% -75%, transparent 24px, black 0px)',
            });
            const icon = document.createElement('i');
            icon.style.fontSize = '12px';
            icon.style.marginBottom = '-10px';
            leaderLockButtonElement.appendChild(icon);
            const updateButtonView = (isLocked, isThisTabLocked) => {
                if (!leaderLockButtonElement) return;
                if (isLocked) {
                    icon.className = 'fas fa-lock';
                    if (isThisTabLocked) {
                        leaderLockButtonElement.style.background = 'linear-gradient(145deg, #43b581, #388e3c)';
                        leaderLockButtonElement.title = 'Лидерство ЗАБЛОКИРОВАНО.\nНажмите, чтобы снять фиксацию.';
                        isLeaderManuallyLocked = true;
                    } else {
                        leaderLockButtonElement.style.background = 'linear-gradient(145deg, #faa61a, #f57c00)';
                        leaderLockButtonElement.title = 'Лидерство заблокировано другой вкладкой.\nНажмите, чтобы снять фиксацию.';
                        isLeaderManuallyLocked = false;
                    }
                } else {
                    icon.className = 'fas fa-lock-open';
                    leaderLockButtonElement.style.background = 'linear-gradient(145deg, #4f545c, #36393f)';
                    leaderLockButtonElement.title = 'Заблокировать лидерство на ЭТОЙ вкладке.\nДругие вкладки не смогут его перехватить.';
                    isLeaderManuallyLocked = false;
                }
            };
            const lockedId = await GM_getValue(LEADER_LOCK_KEY, null);
            updateButtonView(!!lockedId, lockedId === unsafeWindow.tabIdWatch);
            GM_addValueChangeListener(LEADER_LOCK_KEY, (key, oldVal, newVal, remote) => {
                if (remote) {
                    console.log(`[Замок] Статус блокировки изменен в другой вкладке. Новый ID: ${newVal}`);
                    updateButtonView(!!newVal, newVal === unsafeWindow.tabIdWatch);
                    if (typeof unsafeWindow.tryToBecomeLeaderWatch === 'function') {
                        unsafeWindow.tryToBecomeLeaderWatch();
                    }
                }
            });
            leaderLockButtonElement.addEventListener('click', async () => {
                const currentlyLockedId = await GM_getValue(LEADER_LOCK_KEY, null);
                if (!currentlyLockedId) {
                    await GM_setValue(LEADER_LOCK_KEY, unsafeWindow.tabIdWatch);
                    isLeaderManuallyLocked = true;
                    updateButtonView(true, true);
                    safeDLEPushCall('success', 'Лидерство заблокировано на ЭТОЙ вкладке!');
                } else {
                    await GM_deleteValue(LEADER_LOCK_KEY);
                    isLeaderManuallyLocked = false;
                    updateButtonView(false, false);
                    safeDLEPushCall('info', 'Блокировка лидера снята. Идут перевыборы...');
                }
                localStorage.removeItem(LEADER_KEY_WATCH);
                if (typeof unsafeWindow.tryToBecomeLeaderWatch === 'function') {
                    unsafeWindow.tryToBecomeLeaderWatch();
                }
            });
            document.body.appendChild(leaderLockButtonElement);
        }

// ##############################################################################################################################################
// НАЧАЛО БЛОКА СОРТИРОВКИ ПО СПРОСУ (ИНВЕНТАРЬ/ТРЕЙДЫ)
// ##############################################################################################################################################
        // #######################################################################
        // #######################################################################
        async function initDemandSorting() {
            if (window.location.pathname.startsWith('/trades/history/')) {
                return;
            }
            const DEMAND_SORTING_ENABLED_KEY = 'acm_demandSortingEnabled';
            const isEnabled = await GM_getValue(DEMAND_SORTING_ENABLED_KEY, true);
            if (!isEnabled) return;
            const sortSelect = document.getElementById('cards_order');
            if (!sortSelect) return;
            if (!sortSelect.querySelector('option[value="demand"]')) {
                const newOption = document.createElement('option');
                newOption.value = 'demand';
                newOption.textContent = 'По спросу на странице';
                sortSelect.appendChild(newOption);
            }
            sortSelect.addEventListener('change', async (event) => {
                if (event.target.value !== 'demand') {
                    return;
                }
                event.preventDefault();
                event.stopImmediatePropagation();
                safeDLEPushCall('info', 'Сортировка по спросу... Собираю данные...');
                const cardContainer = document.querySelector('.anime-cards--full-page');
                if (!cardContainer) {
                    safeDLEPushCall('error', 'Не найден контейнер с картами.');
                    return;
                }
                const cards = Array.from(cardContainer.querySelectorAll('.anime-cards__item-wrapper'));
                const cardsToFetch = [];
                const cardDataPromises = cards.map(async (cardWrapper) => {
                    const cardEl = cardWrapper.querySelector('.anime-cards__item');
                    if (!cardEl) return null;
                    let needCount = cardEl.dataset.needCount;
                    if (typeof needCount === 'undefined') {
                        cardsToFetch.push(cardEl);
                        return { wrapper: cardWrapper, el: cardEl, needCount: -1 };
                    }
                    return { wrapper: cardWrapper, el: cardEl, needCount: parseInt(needCount, 10) };
                });
                let cardDataList = (await Promise.all(cardDataPromises)).filter(Boolean);
                if (cardsToFetch.length > 0) {
                    let fetchedCount = 0;
                    for (const cardEl of cardsToFetch) {
                        if (document.getElementById('cards_order').value !== 'demand') {
                            safeDLEPushCall('info', 'Сортировка отменена пользователем.');
                            return;
                        }
                        fetchedCount++;
                        safeDLEPushCall('info', `Сортировка по спросу... (${fetchedCount}/${cardsToFetch.length})`);
                        const cardId = await getCardId(cardEl, 'type', true);
                        if (cardId) {
                            const isCached = await getCache('cardId: ' + cardId);
                            if (!isCached) {
                                await sleep(1900);
                            }
                            await updateCardInfo(cardId, cardEl, false);
                        }
                        const itemToUpdate = cardDataList.find(item => item.el === cardEl);
                        if (itemToUpdate && cardEl.dataset.needCount) {
                            itemToUpdate.needCount = parseInt(cardEl.dataset.needCount, 10);
                        }
                        cardDataList.sort((a, b) => b.needCount - a.needCount);
                        cardDataList.forEach(item => {
                            cardContainer.appendChild(item.wrapper);
                        });
                    }
                } else {
                    cardDataList.sort((a, b) => b.needCount - a.needCount);
                    cardDataList.forEach(item => cardContainer.appendChild(item.wrapper));
                }
                safeDLEPushCall('success', 'Сортировка по спросу завершена!');
            }, true);
        }

        // #######################################################################
        // #######################################################################
        async function initTradePageSorting() {
            const DEMAND_SORTING_ENABLED_KEY = 'acm_demandSortingEnabled';
            const isEnabled = await GM_getValue(DEMAND_SORTING_ENABLED_KEY, true);
            if (!isEnabled) return;
            const tradeContainer = document.querySelector('.noffer.cards--container');
            if (!tradeContainer) return;
            const form = document.querySelector('.trade__search .form-block-send');
            const paginationContainer = document.querySelector('.card-trade-list__pagination');
            if (!form || document.getElementById('trade-sort-by-demand-btn')) return;
            const sortButton = document.createElement('button');
            sortButton.type = 'button';
            sortButton.id = 'trade-sort-by-demand-btn';
            sortButton.className = 'tabs__item';
            sortButton.textContent = 'По спросу ↓';
            sortButton.style.width = 'auto';
            const wantsButton = form.querySelector('.tabs__want__card');
            if (wantsButton) {
                form.insertBefore(sortButton, wantsButton);
            } else {
                form.appendChild(sortButton);
            }
            let tradeSortState = null;
            let originalCardOrder = [];
            let cardDataList = [];
            let restartDirection = null;
            const stopSortingProcess = (restoreDOM = true) => {
                if (tradeSortState === null) return false;
                tradeSortState = null;
                sortButton.textContent = 'По спросу ↓';
                sortButton.classList.remove('active');
                sortButton.style.background = '';
                sortButton.style.borderColor = '';
                sortButton.disabled = false;
                if (restoreDOM) {
                    safeDLEPushCall('info', 'Сортировка сброшена.\nВосстанавливаю порядок...');
                    if (originalCardOrder.length > 0) {
                        const cardContainer = document.querySelector('.trade__inventory-list');
                        if (cardContainer) {
                            const fragment = document.createDocumentFragment();
                            originalCardOrder.forEach(cardWrapper => fragment.appendChild(cardWrapper));
                            cardContainer.innerHTML = '';
                            cardContainer.appendChild(fragment);
                        }
                    }
                } else {
                    safeDLEPushCall('info', 'Сортировка прервана.');
                }
                originalCardOrder = [];
                cardDataList = [];
                return true;
            };
            form.addEventListener('click', (event) => {
                if (event.target.closest('#trade-sort-by-demand-btn')) return;
                if (event.target.closest('button, label.checkbox')) {
                    const lastSortState = tradeSortState;
                    const wasStopped = stopSortingProcess(false);
                    if (wasStopped) {
                        restartDirection = lastSortState;
                        setTimeout(() => sortButton.click(), 1000);
                    }
                }
            }, true);
            const searchInput = form.querySelector('#trade_search');
            if(searchInput) {
                searchInput.addEventListener('keydown', (e) => {
                    if(e.key === 'Enter') {
                        const lastSortState = tradeSortState;
                        const wasStopped = stopSortingProcess(false);
                        if (wasStopped) {
                            restartDirection = lastSortState;
                            setTimeout(() => sortButton.click(), 1000);
                        }
                    }
                });
            }
            if (paginationContainer) {
                paginationContainer.addEventListener('click', (event) => {
                    if (event.target.closest('button')) {
                        const lastSortState = tradeSortState;
                        const wasStopped = stopSortingProcess(false);
                        if (wasStopped) {
                            restartDirection = lastSortState;
                            setTimeout(() => sortButton.click(), 1000);
                        }
                    }
                }, true);
                const pageSelect = paginationContainer.querySelector('#choose_trade_page');
                if (pageSelect) {
                    pageSelect.addEventListener('change', () => {
                        const lastSortState = tradeSortState;
                        const wasStopped = stopSortingProcess(false);
                        if (wasStopped) {
                            restartDirection = lastSortState;
                            setTimeout(() => sortButton.click(), 1000);
                        }
                    });
                }
            }
            sortButton.addEventListener('click', async () => {
                const cardContainer = document.querySelector('.trade__inventory-list');
                if (!cardContainer) {
                    safeDLEPushCall('error', 'Не найден инвентарь для сортировки.');
                    return;
                }
                const performSortAndRedraw = () => {
                    if (tradeSortState === null) return;
                    cardDataList.sort((a, b) => {
                        const needA = a.needCount ?? -1;
                        const needB = b.needCount ?? -1;
                        if (needA === -1) return 1;
                        if (needB === -1) return -1;
                        return tradeSortState === 'asc'
                            ? needA - needB
                        : needB - needA;
                    });
                    const fragment = document.createDocumentFragment();
                    cardDataList.forEach(item => fragment.appendChild(item.wrapper));
                    cardContainer.innerHTML = '';
                    cardContainer.appendChild(fragment);
                };
                if (tradeSortState === null) {
                    const nofferElement = document.querySelector('.noffer.cards--container');
                    if (nofferElement && !nofferElement.querySelector('.acm-card-stats')) {
                        safeDLEPushCall('info', 'Проверяю спрос на основную карту...');
                        if (nofferElement.dataset.originalId) {
                            const posterCardId = nofferElement.dataset.originalId;
                            try {
                                await updateCardInfo(posterCardId, nofferElement, false);
                            } catch (e) {
                                console.error("Ошибка при проверке спроса на постер:", e);
                                safeDLEPushCall('error', 'Не удалось проверить спрос на основную карту.');
                            }
                        }
                    }
                    originalCardOrder = Array.from(cardContainer.querySelectorAll('.trade__inventory-item'));

                    if (restartDirection) {
                        tradeSortState = restartDirection;
                        restartDirection = null;
                    } else {
                        tradeSortState = 'desc';
                    }

                    if (tradeSortState === 'asc') {
                        sortButton.textContent = 'СТОП!';
                        sortButton.style.background = 'linear-gradient(145deg, #e74c3c, #c0392b)';
                        sortButton.style.borderColor = '#a93226';
                    } else {
                        sortButton.textContent = 'По спросу ↑';
                    }
                    sortButton.classList.add('active');
                    try {
                        const cardsToFetch = [];
                        cardDataList = originalCardOrder.map(wrapper => {
                            let needCount = wrapper.dataset.needCount;
                            if (typeof needCount === 'undefined') {
                                cardsToFetch.push(wrapper);
                                return { wrapper: wrapper, needCount: -1 };
                            }
                            return { wrapper: wrapper, needCount: parseInt(needCount, 10) };
                        });
                        performSortAndRedraw();
                        if (cardsToFetch.length > 0) {
                            for (const [index, cardEl] of cardsToFetch.entries()) {
                                if (tradeSortState === null) break;
                                safeDLEPushCall('info', `Сортировка по спросу... (${index + 1}/${cardsToFetch.length})`);
                                const cardId = await getCardId(cardEl, 'type', true);
                                if (cardId) {
                                    const isCached = await getCache('cardId: ' + cardId);
                                    if (!isCached) await sleep(1900);
                                    await updateCardInfo(cardId, cardEl, false);
                                }
                                const itemToUpdate = cardDataList.find(item => item.wrapper === cardEl);
                                if (itemToUpdate && cardEl.dataset.needCount) {
                                    itemToUpdate.needCount = parseInt(cardEl.dataset.needCount, 10);
                                }
                                if (tradeSortState === null) break;
                                performSortAndRedraw();
                            }
                        }
                        if (tradeSortState !== null) {
                            safeDLEPushCall('success', 'Сортировка по убыванию завершена!');
                        }
                    } catch (error) {
                        safeDLEPushCall('error', error.message);
                        stopSortingProcess(true);
                    }
                } else if (tradeSortState === 'desc') {
                    tradeSortState = 'asc';
                    sortButton.textContent = 'СТОП!';
                    sortButton.style.background = 'linear-gradient(145deg, #e74c3c, #c0392b)';
                    sortButton.style.borderColor = '#a93226';
                    performSortAndRedraw();
                } else if (tradeSortState === 'asc') {
                    stopSortingProcess(true);
                }
            });
        }

        // #######################################################################
        // == СОРТИРОВКИ ДЛЯ ПЕРЕПЛАВКИ ==
        // #######################################################################
        async function initRemeltPageSorting() {
            const DEMAND_SORTING_ENABLED_KEY = 'acm_demandSortingEnabled';
            const isEnabled = await GM_getValue(DEMAND_SORTING_ENABLED_KEY, true);
            if (!isEnabled || !isRemeltPage()) return;
            const sortBlock = document.querySelector('.sort-block.sort-block--btn');
            if (!sortBlock || document.getElementById('remelt-sort-by-demand-btn')) return;
            const sortButton = document.createElement('button');
            sortButton.type = 'button';
            sortButton.id = 'remelt-sort-by-demand-btn';
            sortButton.className = 'tabs__item';
            sortButton.textContent = 'По спросу ↓';
            sortButton.style.width = 'auto';
            sortButton.style.marginLeft = '10px';
            sortBlock.insertAdjacentElement('afterend', sortButton);
            let remeltSortState = null;
            let originalCardOrder = [];
            let cardDataList = [];
            let restartDirection = null;
            let currentSortInstanceId = 0;
            const stopSortingProcess = (restoreDOM = true) => {
                currentSortInstanceId++;
                if (remeltSortState === null) return false;
                const lastState = remeltSortState;
                remeltSortState = null;
                sortButton.textContent = 'По спросу ↓';
                sortButton.classList.remove('active');
                sortButton.style.background = '';
                sortButton.style.borderColor = '';
                sortButton.disabled = false;
                if (restoreDOM) {
                    safeDLEPushCall('info', 'Сортировка сброшена.\nВосстанавливаю порядок...');
                    if (originalCardOrder.length > 0) {
                        const cardContainer = document.querySelector('.remelt__inventory-list');
                        if (cardContainer) {
                            const fragment = document.createDocumentFragment();
                            originalCardOrder.forEach(cardWrapper => fragment.appendChild(cardWrapper));
                            cardContainer.innerHTML = '';
                            cardContainer.appendChild(fragment);
                        }
                    }
                }
                originalCardOrder = [];
                cardDataList = [];
                return lastState;
            };
            const setupRestartListeners = () => {
                const filterContainer = document.querySelector('.remelt__inner');
                if (!filterContainer) return;
                const restartHandler = () => {
                    const lastSortState = stopSortingProcess(false);
                    if (lastSortState) {
                        restartDirection = lastSortState;
                        setTimeout(() => {
                            if (document.getElementById('remelt-sort-by-demand-btn')) {
                                sortButton.click();
                            }
                        }, 1500);
                    }
                };
                filterContainer.addEventListener('click', (event) => {
                    if (event.target.closest('#remelt-sort-by-demand-btn')) return;

                    if (event.target.closest('.remelt__rank-item, .remelt__lock-item, .remelt__search-btn, .card-filter-list__pagination button')) {
                        restartHandler();
                    }
                    if (event.target.closest('.remelt__start-btn')) {
                        const lastSortState = stopSortingProcess(false);
                        if (lastSortState) {
                            restartDirection = lastSortState;
                            setTimeout(() => {
                                if (document.getElementById('remelt-sort-by-demand-btn')) {
                                    sortButton.click();
                                }
                            }, 2500);
                        }
                    }
                });
                const mainSortSelect = filterContainer.querySelector('.slim-select.category-type');
                if (mainSortSelect) {
                    mainSortSelect.addEventListener('change', restartHandler);
                }
                const searchInput = filterContainer.querySelector('#remelt_search');
                if (searchInput) {
                    searchInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            restartHandler();
                        }
                    });
                }
                const paginationContainer = document.querySelector('.card-filter-list__pagination');
                if(paginationContainer) {
                    const pageSelect = paginationContainer.querySelector('#choose_filter_page');
                    if (pageSelect) {
                        pageSelect.addEventListener('change', restartHandler);
                    }
                }
            };
            setupRestartListeners();
            sortButton.addEventListener('click', async () => {
                const cardContainer = document.querySelector('.remelt__inventory-list');
                if (!cardContainer) {
                    safeDLEPushCall('error', 'Не найден инвентарь для сортировки.');
                    return;
                }
                const performSortAndRedraw = () => {
                    if (remeltSortState === null || !cardContainer) return;
                    cardDataList.sort((a, b) => {
                        const needA = a.needCount ?? -1;
                        const needB = b.needCount ?? -1;
                        if (needA === -1 && needB === -1) return 0;
                        if (needA === -1) return 1;
                        if (needB === -1) return -1;
                        return remeltSortState === 'asc' ? needA - needB : needB - needA;
                    });
                    cardDataList.forEach(item => {
                        cardContainer.appendChild(item.wrapper);
                    });
                };
                if (remeltSortState === null) {
                    const thisSortInstanceId = ++currentSortInstanceId;
                    originalCardOrder = Array.from(cardContainer.querySelectorAll('.remelt__inventory-item'));
                    if (originalCardOrder.length === 0) {
                        safeDLEPushCall('info', 'Нет карт для сортировки.');
                        currentSortInstanceId++;
                        return;
                    }
                    remeltSortState = restartDirection ? restartDirection : 'desc';
                    restartDirection = null;
                    sortButton.textContent = remeltSortState === 'desc' ? 'По спросу ↑' : 'СТОП!';
                    sortButton.style.background = remeltSortState === 'asc' ? 'linear-gradient(145deg, #e74c3c, #c0392b)' : '';
                    sortButton.style.borderColor = remeltSortState === 'asc' ? '#a93226' : '';
                    sortButton.classList.add('active');
                    try {
                        const cardsToFetch = [];
                        cardDataList = originalCardOrder.map(wrapper => {
                            const needCount = wrapper.dataset.needCount;
                            const item = { wrapper: wrapper, needCount: typeof needCount !== 'undefined' ? parseInt(needCount, 10) : -1 };
                            if (item.needCount === -1) cardsToFetch.push(wrapper);
                            return item;
                        });
                        performSortAndRedraw();
                        if (cardsToFetch.length > 0) {
                            for (const [index, cardEl] of cardsToFetch.entries()) {
                                if (thisSortInstanceId !== currentSortInstanceId) {
                                    return;
                                }
                                safeDLEPushCall('info', `Сортировка по спросу... (${index + 1}/${cardsToFetch.length})`);
                                const typeId = await getCardId(cardEl, 'type');
                                if (typeId) {
                                    const isCached = await getCache('cardId: ' + typeId);
                                    if (!isCached) await sleep(1900);

                                    if (thisSortInstanceId !== currentSortInstanceId) {
                                        safeDLEPushCall('info', 'Сортировка прервана.');
                                        return;
                                    }

                                    await updateCardInfo(typeId, cardEl, false);
                                }
                                const itemToUpdate = cardDataList.find(item => item.wrapper === cardEl);
                                if (itemToUpdate && cardEl.dataset.needCount) {
                                    itemToUpdate.needCount = parseInt(cardEl.dataset.needCount, 10);
                                }
                                if (thisSortInstanceId !== currentSortInstanceId) return;
                                performSortAndRedraw();
                            }
                        }
                        if (thisSortInstanceId === currentSortInstanceId) {
                            safeDLEPushCall('success', 'Сортировка по убыванию завершена!');
                        }
                    } catch (error) {
                        safeDLEPushCall('error', error.message);
                        stopSortingProcess(true);
                    }
                } else if (remeltSortState === 'desc') {
                    remeltSortState = 'asc';
                    sortButton.textContent = 'СТОП!';
                    sortButton.style.background = 'linear-gradient(145deg, #e74c3c, #c0392b)';
                    sortButton.style.borderColor = '#a93226';
                    performSortAndRedraw();
                } else if (remeltSortState === 'asc') {
                    stopSortingProcess(true);
                }
            });
        }


        async function initStonePageSorting() {
            if (!document.querySelector('h1.ncard__main-title')?.textContent.includes('Небесный кирпич')) return;
            const DEMAND_SORTING_ENABLED_KEY = 'acm_demandSortingEnabled';
            const isEnabled = await GM_getValue(DEMAND_SORTING_ENABLED_KEY, true);
            if (!isEnabled) return;
            const sortBlock = document.querySelector('.sort-block.sort-block--btn');
            if (!sortBlock || document.getElementById('stone-sort-by-demand-btn')) return;
            const sortButton = document.createElement('button');
            sortButton.type = 'button';
            sortButton.id = 'stone-sort-by-demand-btn';
            sortButton.className = 'stone__rank-item';
            sortButton.textContent = 'По спросу ↓';
            Object.assign(sortButton.style, { width: 'auto', paddingLeft: '12px', paddingRight: '12px' });
            sortBlock.insertAdjacentElement('afterend', sortButton);
            let stoneSortState = null;
            let originalCardOrder = [];
            let cardDataList = [];
            let restartDirection = null;
            let currentSortInstanceId = 0;
            const stopSortingProcess = (restoreDOM = true) => {
                currentSortInstanceId++;
                if (stoneSortState === null) return false;

                const lastState = stoneSortState;
                stoneSortState = null;
                sortButton.textContent = 'По спросу ↓';
                sortButton.classList.remove('stone__rank-item--active');
                sortButton.style.background = '';
                sortButton.style.borderColor = '';
                sortButton.disabled = false;
                if (restoreDOM) {
                    safeDLEPushCall('info', 'Сортировка сброшена.\nВосстанавливаю порядок...');
                    if (originalCardOrder.length > 0) {
                        const cardContainer = document.querySelector('.stone__inventory-list');
                        if (cardContainer) {
                            const fragment = document.createDocumentFragment();
                            originalCardOrder.forEach(cardWrapper => fragment.appendChild(cardWrapper));
                            cardContainer.innerHTML = '';
                            cardContainer.appendChild(fragment);
                        }
                    }
                }
                originalCardOrder = [];
                cardDataList = [];
                return lastState;
            };
            const setupRestartListeners = () => {
                const filterContainer = document.querySelector('.stone__inner');
                if (!filterContainer) return;

                const restartHandler = (delay = 1500) => {
                    const lastSortState = stopSortingProcess(false);
                    if (lastSortState) {
                        restartDirection = lastSortState;
                        setTimeout(() => {
                            const newSortButton = document.getElementById('stone-sort-by-demand-btn');
                            if (newSortButton) newSortButton.click();
                        }, delay);
                    }
                };
                filterContainer.addEventListener('click', (event) => {
                    if (event.target.closest('#stone-sort-by-demand-btn')) return;
                    if (event.target.closest('.stone__rank-item, .stone__lock-item, .stone__search-btn, .card-filter-list__pagination button, .stone__all-item')) {
                        restartHandler();
                    }
                });
                const exchangeButton = document.querySelector('.stone__send-trade-btn');
                if (exchangeButton) exchangeButton.addEventListener('click', () => restartHandler(2500));
                const mainSortSelect = filterContainer.querySelector('.slim-select.category-type');
                if (mainSortSelect) mainSortSelect.addEventListener('change', () => restartHandler());
                const pageSelect = document.querySelector('#choose_stone_filter_page');
                if(pageSelect) pageSelect.addEventListener('change', () => restartHandler());
                const searchInput = filterContainer.querySelector('#stone_search');
                if (searchInput) searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); restartHandler(); } });
            };
            setupRestartListeners();
            sortButton.addEventListener('click', async () => {
                let thisSortInstanceId = currentSortInstanceId;
                const cardContainer = document.querySelector('.stone__inventory-list');
                if (!cardContainer) { safeDLEPushCall('error', 'Не найден инвентарь для сортировки.'); return; }

                const performSortAndRedraw = () => {
                    if (stoneSortState === null || !cardContainer) return;
                    cardDataList.sort((a, b) => {
                        const needA = a.needCount ?? -1; const needB = b.needCount ?? -1;
                        if (needA === -1 && needB === -1) return 0;
                        if (needA === -1) return 1; if (needB === -1) return -1;
                        return stoneSortState === 'asc' ? needA - needB : needB - needA;
                    });
                    cardDataList.forEach(item => cardContainer.appendChild(item.wrapper));
                };
                if (stoneSortState === null) {
                    thisSortInstanceId = ++currentSortInstanceId;
                    originalCardOrder = Array.from(cardContainer.querySelectorAll('.stone__inventory-item'));
                    if (originalCardOrder.length === 0) { safeDLEPushCall('info', 'Нет карт для сортировки.'); currentSortInstanceId++; return; }
                    stoneSortState = restartDirection ? restartDirection : 'desc';
                    restartDirection = null;
                    sortButton.textContent = 'По спросу ↑';
                    sortButton.classList.add('stone__rank-item--active');
                    try {
                        const cardsToFetch = [];
                        cardDataList = originalCardOrder.map(wrapper => {
                            const needCount = wrapper.dataset.needCount;
                            const item = { wrapper: wrapper, needCount: typeof needCount !== 'undefined' ? parseInt(needCount, 10) : -1 };
                            if (item.needCount === -1) cardsToFetch.push(wrapper);
                            return item;
                        });
                        performSortAndRedraw();
                        if (cardsToFetch.length > 0) {
                            safeDLEPushCall('info', `Сортировка по спросу... Собираю данные для ${cardsToFetch.length} карт...`);
                            for (const cardEl of cardsToFetch) {
                                if (thisSortInstanceId !== currentSortInstanceId) {
                                    console.log(`[Сортировка] Процесс ${thisSortInstanceId} прерван, запущен новый (${currentSortInstanceId}).`);
                                    return;
                                }
                                const cardId = await getCardId(cardEl, 'type', true);
                                if (cardId) {
                                    if (!await unsafeWindow.getCache('cardId: ' + cardId)) await sleep(1900);
                                    if (thisSortInstanceId !== currentSortInstanceId) return;

                                    await updateCardInfo(cardId, cardEl, false);
                                }
                                const itemToUpdate = cardDataList.find(item => item.wrapper === cardEl);
                                if (itemToUpdate && cardEl.dataset.needCount) itemToUpdate.needCount = parseInt(cardEl.dataset.needCount, 10);

                                if (thisSortInstanceId !== currentSortInstanceId) return;
                                performSortAndRedraw();
                            }
                        }
                        if (thisSortInstanceId === currentSortInstanceId) safeDLEPushCall('success', 'Сортировка по убыванию завершена!');
                    } catch (error) {
                        safeDLEPushCall('error', error.message);
                        stopSortingProcess(true);
                    }
                } else if (stoneSortState === 'desc') {
                    stoneSortState = 'asc';
                    sortButton.textContent = 'СТОП!';
                    sortButton.style.background = 'linear-gradient(145deg, #e74c3c, #c0392b)';
                    sortButton.style.borderColor = '#a93226';
                    performSortAndRedraw();
                } else if (stoneSortState === 'asc') {
                    stopSortingProcess(true);
                }
            });
        }
// ##############################################################################################################################################
// КОНЕЦ БЛОКА СОРТИРОВКИ ПО СПРОСУ (ИНВЕНТАРЬ/ТРЕЙДЫ)
// ##############################################################################################################################################

        // #######################################################################
        // # Основная функция инициализации, которая запускает все модули и добавляет все элементы UI на страницу.
        // #######################################################################
        async function doActualInitialization() {
            unsafeWindow.applyNoSRankGlowStyle();
            addRankSearchButtonsToUserLinks();
            unsafeWindow.initializeDatabase();
            initializeAntiBlurFeature();
            initializeSession();
            freshnessOverlayEnabled = await GM_getValue(FRESHNESS_OVERLAY_ENABLED_KEY, true);
            const isPackHighlightEnabled = await GM_getValue(WISHLIST_HIGHLIGHT_PACKS_ENABLED_KEY, false);
            const isInventoryHighlightEnabled = await GM_getValue(WISHLIST_HIGHLIGHT_INVENTORY_ENABLED_KEY, false);
            const isTradeHighlightEnabled = await GM_getValue(WISHLIST_HIGHLIGHT_TRADES_ENABLED_KEY, false);
            const isTradePage = () => /^\/cards\/\d+\/trade\/?$/.test(window.location.pathname);
            const onRelevantPage = (unsafeWindow.isCardPackPage() && isPackHighlightEnabled) ||
                                   (unsafeWindow.isMyCardPage() && isInventoryHighlightEnabled) ||
                                   (isTradePage() && isTradeHighlightEnabled);
            if (onRelevantPage) {
                const targetUserForWishlist = await GM_getValue(WISHLIST_TARGET_USER_KEY);
                if (targetUserForWishlist) {
                    const wishlistData = await unsafeWindow.dbGet(WISHLIST_DB_STORE_NAME, targetUserForWishlist);
                    if (wishlistData?.cardIds) {
                        activeWishlistSet = new Set(wishlistData.cardIds);
                        console.log(`[Wishlist] Загружен активный список желаний для "${targetUserForWishlist}" (${activeWishlistSet.size} карт).`);
                    }
                }
            }
            const isFreshnessCheckActive = await GM_getValue(FRESHNESS_TRADE_ACTIVE_KEY, false);
            if (freshnessOverlayEnabled && (!isSpecificTradeOfferPage() || isFreshnessCheckActive)) {
                prepareFreshnessData().then(() => {
                    updateFreshnessOverlays();
                }).catch(error => {
                    console.error('[Freshness] Ошибка во время фоновой подготовки данных:', error);
                });
            }
            const SCC_FEATURE_ENABLED_KEY = 'scc_feature_enabled';
            const isSccEnabled = await GM_getValue(SCC_FEATURE_ENABLED_KEY, false);
            if (isSccEnabled) {
                initializeSuperCardCollectorModule(dbGet, dbSet, dbDelete);
            }
            if (window.location.pathname.includes('/clubs/boost/')) {
                document.body.classList.add('ascm-on-boost-page');
            }
            initializeNotificationHandler();
            let demandObserver = null;
            const currentUrlParams = new URLSearchParams(window.location.search);
            const isTradePreviewIframe = currentUrlParams.get('as_preview_iframe') === 'true';
            if (window.self !== window.top && !isTradePreviewIframe) {
                console.log('[AnimeStars Card Master] Обнаружен сторонний iframe, инициализация UI пропущена.');
                return;
            }
            initializePlayerFixerOnNoData();
            addCustomStyles();

            // #######################################################################
            // # УМНЫЙ ЕДИНЫЙ НАБЛЮДАТЕЛЬ ЗА КАРТОЧКАМИ
            // #######################################################################
            let smartObservers = [];
            let smartObserverTimeout;
            function initializeSmartCardObserver() {
                const processCardChanges = async () => {
                    addDemandCheckButtonsToCards();
                    addInfoButtonsToCards();
                    if (typeof unsafeWindow.addCheckButtons === 'function') {
                        unsafeWindow.addCheckButtons();
                    }
                    if (freshnessOverlayEnabled) {
                        if (!isSpecificTradeOfferPage() || (isSpecificTradeOfferPage() && isFreshnessCheckActive)) {
                            if (freshnessData) {
                                await updateFreshnessOverlays();
                            }
                        }
                    }
                    if (typeof highlightTargetUserWishlist === 'function') {
                        highlightTargetUserWishlist();
                        unsafeWindow.highlightNoSRankDecks();
                    }
                };
                setTimeout(processCardChanges);
                const targetSelectors = [
                    '.anime-cards--full-page', // Инвентарь, база карт
                    '.trade__main', // Основные карты в обмене
                    '.trade__inventory', // Инвентарь на странице обмена
                    '.lootbox__row', // Карты, выпадающие из пака
                    '.history__inner', // История обменов
                    '.remelt__inventory-list', // Инвентарь на странице переплавки
                    '.dpm-dialog-list', // Карты в личных сообщениях
                    '.deck__list', // Карты в колоде на странице аниме
                    '.sect.pmovie__related', // Контейнер, где карусель заменяется на все карты
                    '.stone__inventory', // Инвентарь для пробуждения
                    '.card-awakening-list' // Список карт для пробуждения
                ];
                const observerCallback = (mutationsList) => {
                    const hasRelevantChanges = mutationsList.some(m => m.type === 'childList' && (m.addedNodes.length > 0 || m.removedNodes.length > 0));
                    if (hasRelevantChanges) {
                        clearTimeout(smartObserverTimeout);
                        smartObserverTimeout = setTimeout(processCardChanges);
                    }
                };
                targetSelectors.forEach(selector => {
                    const targetNode = document.querySelector(selector);
                    if (targetNode) {
                        const observer = new MutationObserver(observerCallback);
                        observer.observe(targetNode, {
                            childList: true,
                            subtree: true
                        });
                        smartObservers.push(observer);
                    }
                });
                window.addEventListener('beforeunload', () => {
                    smartObservers.forEach(observer => observer.disconnect());
                    clearTimeout(smartObserverTimeout);
                });
            }
            initializeSmartCardObserver();

            // #######################################################################
            // # СПЕЦИАЛЬНЫЙ ФИКС ДЛЯ ПРЕДПРОСМОТРА В IFRAME
            // #######################################################################
            if (isTradePreviewIframe) {
                const tradeMainContainer = document.querySelector('.trade__main');
                if (tradeMainContainer) {
                    const tradeObserver = new MutationObserver((mutationsList, observer) => {
                        const tradeBlocks = tradeMainContainer.querySelectorAll('.trade__main-items');
                        if (tradeBlocks.length >= 2) {
                            setTimeout(() => {
                                updateFreshnessOverlays(true);
                            }, 300);
                            observer.disconnect();
                        }
                    });
                    tradeObserver.observe(tradeMainContainer, {
                        childList: true
                    });
                    if (tradeMainContainer.querySelectorAll('.trade__main-items').length >= 2) {
                         setTimeout(() => {
                             updateFreshnessOverlays(true);
                         }, 300);
                         tradeObserver.disconnect();
                    }
                } else {
                }
            }

            // #######################################################################
            // # Убираем подсветку в паках сразу после клика, чтобы избежать "прыжка"
            // #######################################################################
            if (unsafeWindow.isCardPackPage()) {
                document.body.addEventListener('click', (event) => {
                    if (event.target.closest('.lootbox__row .lootbox__card')) {
                        const currentlyHighlighted = document.querySelectorAll(
                            '.lootbox__row .lootbox__card.wishlist-highlight-pack, ' +
                            '.lootbox__row .lootbox__card.wishlist-card-glow'
                        );
                        currentlyHighlighted.forEach(card => {
                            card.classList.remove('wishlist-highlight-pack', 'wishlist-card-glow');
                        });
                    }
                }, true);
            }

            // #######################################################################
            // # УМНОЕ ОЖИДАНИЕ ПАКА ПОСЛЕ ПОКУПКИ
            // #######################################################################
            function waitForNewPackAndProcess() {
                let attempts = 0;
                const maxAttempts = 200;
                const checkInterval = setInterval(() => {
                    attempts++;
                    const lootboxRow = document.querySelector('.lootbox__row');
                    if (lootboxRow && lootboxRow.offsetParent !== null && lootboxRow.dataset.packId) {
                        const firstCardImage = lootboxRow.querySelector('.lootbox__card img');
                        if (firstCardImage && firstCardImage.src && !firstCardImage.src.includes('empty-card.png')) {
                            clearInterval(checkInterval);
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
                        isProcessingBuyClick = false;
                    }
                }, 50);
            }
            document.body.addEventListener('click', function(event) {
                const buyButton = event.target.closest('.lootbox__open-btn');
                if (!isCardPackPage() || !buyButton) {
                    return;
                }
                isCardInPackSelected = false;
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
                stopMassDuplicateCheck();
                lastProcessedPackIdForAutoCheck = null;
                lastProcessedPackIdForDemandCheck = null;
            });
            const isSliderEnabled = await GM_getValue(MAX_WIDTH_SLIDER_ENABLED_KEY, true);
            if (isSliderEnabled) {
                createMaxWidthControlSlider();
            }
            createLeaderLockButton();
            addGoToClubsButton();
            await addDemandCheckButtonsToCards();
            const element = document.querySelector('.page-padding');
            let bgSettingsFromStorage = JSON.parse(localStorage.getItem('bgSettings'));
            const protectedBackground = {
                id: 'protected_lio_cover',
                name: 'Legendary Immortal Order',
                url: '/uploads/clubs/cover_20.png?v=1747841055',
                type: 'image',
                isProtected: true
            };
            const defaultVideoURL = 'https://v1.pinimg.com/videos/mc/720p/01/95/b7/0195b75a59c8fc7f0f0abe1d69ea062a.mp4';

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
                        padding: 8px 10px; margin-bottom: 6px; background: #2c2f33;
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
                    if (bg.url.startsWith('data:')) {
                        nameSpan.title = 'Локальный файл (URL нельзя скопировать)';
                        nameSpan.style.cursor = 'default';
                        nameSpan.removeEventListener('click', nameSpan._copyUrlListener);
                    } else {
                        nameSpan.title = `Нажмите, чтобы скопировать URL:\n${bg.url}`;
                        nameSpan.style.cursor = 'pointer';
                        const copyUrlListener = async () => {
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
                        };
                        if (nameSpan._copyUrlListener) {
                            nameSpan.removeEventListener('click', nameSpan._copyUrlListener);
                        }
                        nameSpan._copyUrlListener = copyUrlListener;
                        nameSpan.addEventListener('click', nameSpan._copyUrlListener);
                    }
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
                const fileInput = document.getElementById('new-bg-file');
                const file = fileInput.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const fileUrl = e.target.result;
                        const fileType = file.type.startsWith('video') ? 'video' : 'image';
                        const newBg = {
                            id: generateUniqueId(),
                            name: nameInput.value.trim() || file.name,
                            url: fileUrl,
                            type: fileType
                        };
                        if (!bgSettings.sources) bgSettings.sources = [];
                        bgSettings.sources.push(newBg);
                        saveBgSettingsToLocalStorage();
                        renderSavedBackgroundsList();
                        nameInput.value = '';
                        urlInput.value = '';
                        fileInput.value = '';
                        safeDLEPushCall('Локальный фон добавлен!', 'success');
                    };
                    reader.onerror = function() {
                        safeDLEPushCall('Ошибка при чтении файла.', 'error');
                    };
                    reader.readAsDataURL(file);

                } else {
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
                let wrapper = document.getElementById('bg-control-panel-wrapper');
                if (wrapper) wrapper.remove();
                wrapper = document.createElement('div');
                wrapper.id = 'bg-control-panel-wrapper';
                wrapper.style.display = 'none';
                wrapper.innerHTML = `
                    <div class="acm-modal-backdrop"></div>
                    <div id="bg-control-panel" class="acm-modal">
                        <div class="modal-header">
                             <h2>Настройки фона</h2>
                        </div>
                        <div class="modal-body">
                            <div class="bg-toggle-switch-container setting-row">
                                <span class="bg-toggle-switch-label">Отображение фона:</span>
                                <label class="protector-toggle-switch">
                                    <input type="checkbox" id="bg-styles-enabled-toggle">
                                    <span class="protector-toggle-slider"></span>
                                </label>
                            </div>
                            <h4 style="margin-top: 15px; margin-bottom: 8px; font-weight: normal; font-size: 0.8em; color: #909090; text-transform: uppercase;">Добавить новый фон:</h4>
                            <div class="input-group" style="margin-bottom: 8px;"><input type="text" id="new-bg-name" placeholder="Название фона (например, Лес)"></div>
                            <div class="input-group" style="margin-bottom: 8px;"><input type="text" id="new-bg-url" placeholder="URL (https://.../image.jpg или .mp4)"></div>
                            <div class="input-group">
                                <select id="new-bg-type" style="width: 100%; padding: 7px 8px; border-radius: 3px; border: 1px solid #33353a; background-color: #27292d; color: #b0b0b0;">
                                    <option value="image">Картинка / GIF</option>
                                    <option value="video">Видео</option>
                                </select>
                            </div>
                            <div style="text-align: center; color: #888; margin: 10px 0;">- ИЛИ -</div>
                            <div class="input-group" style="margin-bottom: 8px;">
                                <input type="file" id="new-bg-file" accept="image/*,video/mp4,video/webm" style="width: 100%; color: #b0b0b0;">
                            </div>
                            <small class="catbox-promo" style="display: block; margin-top: 6px; font-size: 0.7em; color: #777; text-align: center;">Для локальных файлов есть ограничение по размеру (~5MB).<br>Видео лучше загружать на <a href="https://catbox.moe/" target="_blank" style="color: #c83a54; text-decoration: none;">catbox.moe</a></small><button id="add-new-bg-btn" class="action-btn" style="width: 100%; margin-top: 15px; background-color: #5865f2;">Добавить в список</button>
                            <h4 style="margin-top: 20px; margin-bottom: 8px; font-weight: normal; font-size: 0.8em; color: #909090; text-transform: uppercase;">Сохраненные фоны:</h4>
                            <div id="saved-bgs-list-container" style="max-height: 150px; overflow-y: auto; border: 1px solid #33353a; padding: 5px; background: #1e1f22; border-radius: 3px;"></div>
                        </div>
                        <div class="modal-footer">
                            <button id="bg-back-to-main" class="action-btn back-btn">Назад</button>
                            <button id="bg-close-panel-btn" class="action-btn close-btn">Закрыть</button>
                        </div>
                    </div>
                    `;
                document.body.appendChild(wrapper);
                document.getElementById('add-new-bg-btn').addEventListener('click', handleAddBackground);
                document.getElementById('bg-back-to-main').onclick = () => {
                    toggleControlPanel();
                    unsafeWindow.openMasterSettingsModal();
                };
                document.getElementById('bg-close-panel-btn').addEventListener('click', toggleControlPanel);
                wrapper.querySelector('.acm-modal-backdrop').onclick = toggleControlPanel;
                const toggleCheckbox = document.getElementById('bg-styles-enabled-toggle');
                if (toggleCheckbox) {
                    toggleCheckbox.checked = stylesEnabled;
                    toggleCheckbox.addEventListener('change', () => {
                        toggleStyles();
                    });
                }
            }

            // #######################################################################
            // # Применяет стили для отображения активного фона (видео или изображения) на странице.
            // #######################################################################
            function applyStyles() {
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
                const wrapper = document.getElementById('bg-control-panel-wrapper');
                if (wrapper) {
                    wrapper.remove();
                } else {
                    createUI();
                    const newWrapper = document.getElementById('bg-control-panel-wrapper');
                    if (newWrapper) {
                        renderSavedBackgroundsList();
                        newWrapper.style.display = 'block';
                    }
                }
            }
            unsafeWindow.toggleControlPanel = toggleControlPanel;

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
            } else if (!window.location.pathname.includes('/clubs/boost/')) {
                document.body.appendChild(getButton('processCards', 'rocket', 390, 'Проверить спрос (текущая страница)', () => processCards(false)));
            }
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
            const crystalIcon = document.createElement('span');
            crystalIcon.textContent = '💎';
            crystalBtn.appendChild(crystalIcon);
            const crystalCounter = document.createElement('span');
            crystalCounter.id = 'crystal_counter';
            crystalCounter.style.display = 'none';
            crystalBtn.appendChild(crystalCounter);
            crystalCounter.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (typeof unsafeWindow.openCrystalControlModal === 'function') {
                    unsafeWindow.openCrystalControlModal();
                }
            });

            // #######################################################################
            // #######################################################################
            async function applyCrystalScriptState() {
                const newState = await GM_getValue(CRYSTAL_SCRIPT_ENABLED_KEY, false);
                crystalScriptEnabled = newState;
                updateCrystalButtonStyle();
                if (typeof unsafeWindow.updateCrystalButtonCounter === 'function') {
                    unsafeWindow.updateCrystalButtonCounter();
                }
                if (crystalScriptEnabled && isAnimePage()) {
                    startAutoClickCrystalScript();
                } else {
                    stopAutoClickCrystalScript();
                }
                if (typeof unsafeWindow.tryToBecomeLeaderWatch === 'function') {
                    unsafeWindow.tryToBecomeLeaderWatch();
                }
            }

            // #######################################################################
            // # Обновляет стиль кнопки сбора кристаллов (цвет) в зависимости от того, включен ли сбор.
            // #######################################################################
            function updateCrystalButtonStyle() {
                crystalBtn.style.background = crystalScriptEnabled ? 'linear-gradient(145deg, rgb(50, 222, 50), rgb(50, 122, 50))' : 'linear-gradient(145deg, rgb(166, 100, 110), rgb(222, 0, 5))';
            }
            crystalBtn.addEventListener('click', async () => {
                await GM_setValue(CRYSTAL_SCRIPT_ENABLED_KEY, !crystalScriptEnabled);
                await applyCrystalScriptState();
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
                if (remote) {
                    applyCrystalScriptState();
                }
            });
            await initializeCrystalState();

            // #######################################################################
            // # Асинхронная самовызывающаяся функция для инициализации состояния сбора кристаллов при загрузке.
            // #######################################################################
            async function initializeCrystalState() {
                scriptEnabledWatch = localStorage.getItem(STORAGE_KEY_WATCH) === 'true';
                crystalScriptEnabled = await GM_getValue(CRYSTAL_SCRIPT_ENABLED_KEY, false);
                updateCrystalButtonStyle();
                clickedCrystals = await GM_getValue('gm_clickedCrystals', 0);
                collectedStones = await GM_getValue('gm_collectedStones', 0);
                soundEnabled = await GM_getValue('gm_crystalSoundEnabled', false);
                if (typeof unsafeWindow.updateCrystalButtonCounter === 'function') {
                    unsafeWindow.updateCrystalButtonCounter();
                }
                if (crystalScriptEnabled && isAnimePage()) {
                    await startAutoClickCrystalScript();
                } else {
                    stopActiveCrystalOperations();
                }
                if (scriptEnabledWatch || crystalScriptEnabled) {
                    if (scriptEnabledWatch && typeof unsafeWindow.updateCardCounter === 'function') {
                        unsafeWindow.updateCardCounter();
                    }
                    if (typeof unsafeWindow.tryToBecomeLeaderWatch === 'function') {
                        unsafeWindow.tryToBecomeLeaderWatch();
                    }
                } else {
                    if (typeof unsafeWindow.stopMainCardCheckLogic === 'function') {
                        unsafeWindow.stopMainCardCheckLogic();
                    }
                    const leaderDataJSON = localStorage.getItem(LEADER_KEY_WATCH);
                    if (leaderDataJSON) {
                        try {
                            const leader = JSON.parse(leaderDataJSON);
                            if (unsafeWindow.tabIdWatch && leader.id === unsafeWindow.tabIdWatch) {
                                localStorage.removeItem(LEADER_KEY_WATCH);
                                console.log("[Лидерство] Освобождено при инициализации (оба модуля выключены).");
                            }
                        } catch (e) { /* молчим */ }
                    }
                    isLeaderWatch = false;
                    if (heartbeatIntervalId) {
                        clearInterval(heartbeatIntervalId);
                        heartbeatIntervalId = null;
                    }
                }
            }
            if (!window.location.pathname.includes('/clubs/boost/')) {
                await initDuplicateChecker();
            }
            if (isCardPackPage()) {
                await createAutoPackCheckFeature();
                await createAutoDemandCheckFeature();
            } else if (window.location.pathname.startsWith('/trades/')) {
                await createAutoDemandTradeButtonFeature();
                if (autoDemandTradeEnabled) {
                    setTimeout(() => processCards(false, true), 200);
                }
            }
            addClearButton();
            const filterFormEl = document.querySelector('.card-filter-form');
            if (filterFormEl && filterFormEl.parentElement) {
                new MutationObserver(() => {
                    if (!document.querySelector('.clear-search-btn')) addClearButton();
                }).observe(filterFormEl.parentElement, { childList: true, subtree: true });
            }
            createToggleVisibilityButton();
            addClearPageCacheFeature();
            applyManagedButtonsVisibility(true);
            setupSiteNotificationInterceptor();
            initAutoCharge();
            initAutoProcessDemand();
            asbm_initializeModule();
            initMessageCounterModule();
            initTurboBoosterModule(getButton, safeDLEPushCall);
            createWishlistScannerFeature();
            initPackWishlistGlowObserver();
            initDemandSorting();
            initTradePageSorting();
            initRemeltPageSorting();
            initStonePageSorting();
            initDemandCheckObserver();
            let isGlobalListenerAdded = false;
            if (!isGlobalListenerAdded) {
                isGlobalListenerAdded = true;
                if (typeof unsafeWindow.initializeLeadership === 'function') {
                    unsafeWindow.initializeLeadership();
                }
            }
            GM_addValueChangeListener(CRYSTAL_RESET_BROADCAST_KEY, (key, o, n, remote) => {
                if (remote && !isProcessingReset) {
                    console.log("Получен сигнал о полном сбросе от другой вкладки. Выполняю синхронный сброс...");
                    if (typeof unsafeWindow.handleFullCrystalReset === 'function') {
                        unsafeWindow.handleFullCrystalReset();
                    }
                }
            });
            highlightWishlistCardsInPack();
            unsafeWindow.highlightNoSRankDecks();

            // ##############################################################################################################################################
            // # БЛОК: АВТО-ФАРМ ПАКОВ (АВТО-ПОКУПКА И АВТО-ВЫБОР)
            // ##############################################################################################################################################
            (function initAutoFarmModule() {
                let isAutoFarming = false;
                let stopAutoFarming = false;
                function forceStopAutoFarming(reason) {
                    if (!isAutoFarming) return;
                    console.log(`[AutoFarm] Принудительная остановка. Причина: ${reason}`);
                    isAutoFarming = false;
                    stopAutoFarming = true;
                    if (autoSelectionTimeoutId) clearTimeout(autoSelectionTimeoutId);
                    updateButtonUI();
                }
                unsafeWindow.forceStopAutoFarm = forceStopAutoFarming;

                // #######################################################################
                // #######################################################################
                function updateButtonUI() {
                    const button = document.getElementById('auto-farm-pack-btn');
                    if (!button) return;
                    const icon = button.querySelector('i');
                    if (isAutoFarming) {
                        button.style.background = 'linear-gradient(145deg, #4CAF50, #388E3C)';
                        button.title = 'Авто-фарм паков ВКЛЮЧЕН (Нажмите, чтобы остановить)';
                        if (icon) icon.className = 'fas fa-spinner fa-spin';
                    } else {
                        button.style.background = 'linear-gradient(145deg, #4D2D79, #2C1E4A)';
                        button.title = 'Авто-фарм паков ВЫКЛЮЧЕН (Нажмите, чтобы запустить)';
                        if (icon) icon.className = 'fas fa-magic';
                    }
                }

                // #######################################################################
                // #######################################################################
                async function selectBestCard(lootboxRow) {
                    if (autoSelectionTimeoutId) clearTimeout(autoSelectionTimeoutId);
                    async function protectionCheck(chosenCard, allCardsInPack, highestRankCardInPack) {
                        const settings = loadSettings();
                        const isProtectionEnabledForHighestRank = settings[highestRankCardInPack.rank.toLowerCase()];
                        if (isProtectionEnabledForHighestRank && chosenCard.rankValue < highestRankCardInPack.rankValue) {
                            const message = `АВТО-ФАРМ: В паке есть карта ранга <b>${highestRankCardInPack.rank.toUpperCase()}</b>.<br>Вы уверены, что хотите выбрать карту ранга <b>${chosenCard.rank.toUpperCase()}</b>?`;
                            const confirmation = await protector_customConfirm(message);
                            if (!confirmation) {
                                safeDLEPushCall('info', 'Авто-фарм на паузе. Сделайте выбор вручную.');
                                throw new Error('MANUAL_SELECTION_REQUIRED');
                            }
                        }
                        const isOwnWishlistProtectionEnabled = await GM_getValue('ascm_ownWishlistProtectionEnabled', true);
                        if (isOwnWishlistProtectionEnabled) {
                            const wantedCardsInPack = allCardsInPack.filter(c => c.isWanted);
                            if (wantedCardsInPack.length > 0 && !chosenCard.isWanted) {
                                const WISHLIST_PROTECTION_RANKS_KEY = 'ascm_wishlistProtectionRanks_v1';
                                const defaultWishlistRanks = { ass: false, s: false, a: true, b: true, c: true, d: true, e: true };
                                const wishlistProtectionRanks = await GM_getValue(WISHLIST_PROTECTION_RANKS_KEY, defaultWishlistRanks);
                                const isWantedCardProtected = wantedCardsInPack.some(wlCard => wishlistProtectionRanks[wlCard.rank] === true);
                                const isClickedCardProtected = wishlistProtectionRanks[chosenCard.rank] === true;
                                if (isWantedCardProtected && isClickedCardProtected) {
                                    const message = `АВТО-ФАРМ: В паке есть карта из ВАШЕГО списка желаний!<br>Вы уверены, что хотите выбрать другую?`;
                                    const confirmation = await protector_customConfirm(message);
                                    if (!confirmation) {
                                        safeDLEPushCall('info', 'Авто-фарм на паузе. Сделайте выбор вручную.');
                                        throw new Error('MANUAL_SELECTION_REQUIRED');
                                    }
                                }
                            }
                        }
                        return true;
                    }
                    const packCards = Array.from(lootboxRow.querySelectorAll('.lootbox__card'));
                    if (packCards.length === 0) return;
                    const cardsInfo = await Promise.all(packCards.map(async el => {
                        const id = await getCardId(el, 'type', true);
                        let freshness = 0;
                        if (id) {
                            const { freshnessPercent } = idToFreshnessStyle(id, el.dataset.rank);
                            freshness = freshnessPercent;
                        }
                        return {
                            el: el, id: id, rank: el.dataset.rank,
                            rankValue: PROTECTOR_RANK_HIERARCHY[el.dataset.rank] || 0,
                            isOwned: el.classList.contains('anime-cards__owned-by-user'),
                            isWanted: el.classList.contains('anime-cards__owned-by-user-want'),
                            freshness: freshness,
                        };
                    }));
                    cardsInfo.sort((a, b) => b.rankValue - a.rankValue);
                    const highestRankCardInPack = cardsInfo[0];
                    const highestRank = highestRankCardInPack.rank;
                    console.log(`[AutoSelect] Высший ранг в паке: ${highestRank.toUpperCase()}`);
                    if (highestRank === 'ass' || highestRank === 's') {
                        const highRankCards = cardsInfo.filter(c => c.rank === highestRank);
                        if (highRankCards.length > 1) {
                            safeDLEPushCall('error', `В паке несколько ${highestRank.toUpperCase()} карт! Выбор остановлен.`);
                            throw new Error('Multiple high-rank cards found');
                        }
                        const delay = highestRank === 'ass' ? 60000 : 20000;
                        safeDLEPushCall('info', `В паке ${highestRank.toUpperCase()} карта! Выбор через ${delay / 1000} сек. (Нажмите стоп для отмены)`);
                        const startTime = Date.now();
                    while (Date.now() - startTime < delay) {
                        if (stopAutoFarming) {
                            console.log('[AutoSelect] Остановка во время ожидания S/ASS-карты.');
                            throw new Error('Остановлено');
                        }
                        if (isCardInPackSelected) {
                            console.log(`[AutoSelect] Обнаружен ручной выбор. Жду ${AUTO_FARM_DELAY_BETWEEN_CLICKS_MS / 1000} сек и продолжаю...`);
                            await sleep(AUTO_FARM_DELAY_BETWEEN_CLICKS_MS);
                            return;
                        }
                        await sleep(500);
                    }
                    console.log(`[AutoSelect] Время вышло. Выбираю ${highestRank.toUpperCase()} карту.`);
                        isAutoSelectingCard = true;
                        try {
                            highRankCards[0].el.click();
                        } finally {
                            isAutoSelectingCard = false;
                        }
                        return;
                    }
                    if (highestRank === 'a') {
                        const aCards = cardsInfo.filter(c => c.rank === 'a');
                        console.log(`[AutoSelect] Обнаружено ${aCards.length} A-карт(ы). Проверяю...`);
                        try {
                            if (aCards.length === 1) {
                                const theCard = aCards[0];
                                const demandData = await unsafeWindow.loadCard(theCard.id);
                                if (demandData && demandData.popularityCount > 0 && demandData.popularityCount < 40) {
                                    safeDLEPushCall('error', `РЕДКАЯ A-КАРТА! Владельцев: ${demandData.popularityCount}. Выбор за вами!`);
                                    throw new Error('MANUAL_SELECTION_REQUIRED');
                                } else {
                                    console.log(`[AutoSelect] A-карта не является редкой. Выбираю ее.`);
                                    isAutoSelectingCard = true;
                                    try {
                                        theCard.el.click();
                                    } finally {
                                        isAutoSelectingCard = false;
                                    }
                                }
                            } else {
                                const hasNewCards = aCards.some(c => c.freshness > 0);
                                const hasWantedCards = aCards.some(c => c.isWanted);

                                if (hasNewCards || hasWantedCards) {
                                    safeDLEPushCall('error', 'В паке есть новые карты или карты из списка желаний! Выбор за вами.');
                                    throw new Error('MANUAL_SELECTION_REQUIRED');
                                }
                                safeDLEPushCall('info', 'Несколько A-карт (обычные). Проверка на редкость и спрос...');
                                const aCardsWithData = await Promise.all(aCards.map(async info => {
                                    await updateCardInfo(info.id, info.el);
                                    const demandData = {
                                        needCount: parseInt(info.el.dataset.needCount || '0', 10),
                                        popularityCount: parseInt(info.el.dataset.popularityCount || '0', 10)
                                    };
                                    return { ...info, demandData };
                                }));
                                const rareCard = aCardsWithData.find(c => c.demandData && c.demandData.popularityCount > 0 && c.demandData.popularityCount < 40);
                                if (rareCard) {
                                    safeDLEPushCall('error', `РЕДКАЯ A-КАРТА! Владельцев: ${rareCard.demandData.popularityCount}. Выбор за вами!`);
                                    throw new Error('MANUAL_SELECTION_REQUIRED');
                                }
                                console.log('[AutoSelect] Редких/новых/желанных A-карт нет. Выбираю по спросу.');
                                const bestCardByDemand = aCardsWithData.reduce((a, b) => ((b.demandData?.needCount || 0) > (a.demandData?.needCount || 0)) ? b : a);
                                isAutoSelectingCard = true;
                                try {
                                    bestCardByDemand.el.click();
                                } finally {
                                    isAutoSelectingCard = false;
                                }
                            }
                        } catch(e) {
                            if (e.message === 'MANUAL_SELECTION_REQUIRED') throw e;
                            console.error('[AutoSelect] Ошибка при обработке A-карт, выбираю первую:', e);
                            await protectionCheck(aCards[0], cardsInfo, highestRankCardInPack);
                            isAutoSelectingCard = true;
                            try {
                                aCards[0].el.click();
                            } finally {
                                isAutoSelectingCard = false;
                            }
                        }
                        return;
                    }
                    if (highestRank === 'b') {
                        const bCards = cardsInfo.filter(c => c.rank === 'b');
                        if (bCards.length > 0) {
                            let chosenB_Card;
                            if (bCards.length === 1) {
                                chosenB_Card = bCards[0];
                            } else {
                                console.log('[AutoSelect] Обнаружено несколько B-карт. Анализ...');
                                await Promise.all(bCards.map(info => updateCardInfo(info.id, info.el)));
                                const highestDemandCard = bCards.reduce((a, b) => (parseInt(b.el.dataset.needCount || '0') > parseInt(a.el.dataset.needCount || '0')) ? b : a);
                                const newestCard = bCards.reduce((a, b) => (b.freshness > a.freshness) ? b : a);
                                const areAllDemandsLow = bCards.every(card => (parseInt(card.el.dataset.needCount || '0') < 99));

                                if (areAllDemandsLow && newestCard.freshness > 0) {
                                    chosenB_Card = newestCard;
                                } else {
                                    chosenB_Card = highestDemandCard;
                                }
                            }
                            await protectionCheck(chosenB_Card, cardsInfo, highestRankCardInPack);
                            isAutoSelectingCard = true;
                            try {
                                chosenB_Card.el.click();
                            } finally {
                                isAutoSelectingCard = false;
                            }
                            return;
                        }
                    }
                    const veryNewCards = cardsInfo.filter(c => c.freshness >= 80);
                    if (veryNewCards.length > 0) {
                        const chosenCard = veryNewCards.sort((a, b) => b.freshness - a.freshness)[0];
                        console.log(`[AutoSelect] Приоритет 4: Выбираю сверхновую карту ${chosenCard.rank.toUpperCase()} (${chosenCard.freshness.toFixed(1)}%)`);
                        await protectionCheck(chosenCard, cardsInfo, highestRankCardInPack);
                        isAutoSelectingCard = true;
                        try {
                            chosenCard.el.click();
                        } finally {
                            isAutoSelectingCard = false;
                        }
                        return;
                    }
                    const wantedCards = cardsInfo.filter(c => c.isWanted);
                    if (wantedCards.length > 0) {
                        const chosenCard = wantedCards.sort((a, b) => b.freshness - a.freshness)[0];
                        console.log(`[AutoSelect] Приоритет 5: Выбираю карту из листа желаний (${chosenCard.rank.toUpperCase()}-ранг).`);
                        await protectionCheck(chosenCard, cardsInfo, highestRankCardInPack);
                        isAutoSelectingCard = true;
                        try {
                            chosenCard.el.click();
                        } finally {
                            isAutoSelectingCard = false;
                        }
                        return;
                    }
                    const sortedByFreshness = [...cardsInfo].sort((a, b) => b.freshness - a.freshness);
                    if (sortedByFreshness[0].freshness > 0) {
                        const chosenCard = sortedByFreshness[0];
                        console.log(`[AutoSelect] Приоритет 7: Выбираю самую новую карту: ${chosenCard.rank.toUpperCase()} (${chosenCard.freshness.toFixed(1)}%)`);
                        await protectionCheck(chosenCard, cardsInfo, highestRankCardInPack);
                        isAutoSelectingCard = true;
                        try {
                            chosenCard.el.click();
                        } finally {
                            isAutoSelectingCard = false;
                        }
                        return;
                    }
                    const notOwnedCards = cardsInfo.filter(c => !c.isOwned);
                    if (notOwnedCards.length > 0) {
                        const chosenCard = notOwnedCards.sort((a, b) => b.rankValue - a.rankValue)[0];
                        console.log(`[AutoSelect] Приоритет 6: Все карты старые. Выбираю "Не владеет" (${chosenCard.rank.toUpperCase()}-ранг).`);
                        await protectionCheck(chosenCard, cardsInfo, highestRankCardInPack);
                        isAutoSelectingCard = true;
                        try {
                            chosenCard.el.click();
                        } finally {
                            isAutoSelectingCard = false;
                        }
                        return;
                    }
                    const chosenCard = cardsInfo.sort((a, b) => b.rankValue - a.rankValue)[0];
                    console.log(`[AutoSelect] Приоритет 8: Все критерии не подошли. Выбираю по старшему рангу (${chosenCard.rank.toUpperCase()}-ранг).`);
                    await protectionCheck(chosenCard, cardsInfo, highestRankCardInPack);
                    isAutoSelectingCard = true;
                    try {
                        chosenCard.el.click();
                    } finally {
                        isAutoSelectingCard = false;
                    }
                }

                // #######################################################################
                // #######################################################################
                async function autoFarmLoop() {
                    if (!isAutoFarming || stopAutoFarming) {
                        isAutoFarming = false;
                        stopAutoFarming = false;
                        updateButtonUI();
                        console.log('[AutoFarm] Цикл штатно завершен или был остановлен.');
                        return;
                    }
                    try {
                        const existingLootboxRow = document.querySelector('.lootbox__row');
                        if (existingLootboxRow && existingLootboxRow.offsetParent !== null) {
                            await selectBestCard(existingLootboxRow);
                        } else {
                            console.log('[AutoFarm] Открытых паков нет. Начинаю процесс покупки...');
                            const pack20Button = document.querySelector('.lootbox__middle-item[data-count="20"]');
                            const buyButton = document.querySelector('.lootbox__open-btn');
                            if (!pack20Button || !buyButton) throw new Error('Кнопки покупки не найдены.');
                            pack20Button.click();
                            await sleep(500);
                            if (stopAutoFarming) throw new Error('Остановлено');
                            if (buyButton.disabled) throw new Error('Недостаточно камней или покупка недоступна.');
                            buyButton.click();
                            console.log('[AutoFarm] Покупка совершена. Ожидание карт для выбора...');
                            const newLootboxRow = await new Promise((resolve, reject) => {
                                const checkInterval = setInterval(() => {
                                    if (stopAutoFarming) {
                                        clearInterval(checkInterval);
                                        reject(new Error('Остановлено'));
                                        return;
                                    }
                                    const row = document.querySelector('.lootbox__row');
                                    if (row && row.offsetParent !== null && row.querySelectorAll('.lootbox__card').length > 0) {
                                        const img = row.querySelector('.lootbox__card img');
                                        if (img && !img.src.includes('empty-card.png')) {
                                            clearInterval(checkInterval);
                                            resolve(row);
                                        }
                                    }
                                }, 100);
                            });
                            await sleep(AUTO_FARM_DELAY_BETWEEN_CLICKS_MS);
                            if (stopAutoFarming) throw new Error('Остановлено');
                            await selectBestCard(newLootboxRow);
                        }
                        if (isAutoFarming && !stopAutoFarming) {
                            setTimeout(autoFarmLoop, AUTO_FARM_DELAY_BETWEEN_CLICKS_MS);
                        } else {
                            autoFarmLoop();
                        }
                    } catch (error) {
                        if (error.message === 'MANUAL_SELECTION_REQUIRED') {
                            console.log('[AutoFarm] Пауза. Ожидание ручного выбора карты.');
                            const lootboxRow = document.querySelector('.lootbox__row');
                            if (lootboxRow) {
                                lootboxRow.addEventListener('click', function onManualSelection(event) {
                                    if (event.target.closest('.lootbox__card')) {
                                        console.log('[AutoFarm] Ручной выбор сделан. Возобновление цикла...');
                                        setTimeout(autoFarmLoop, AUTO_FARM_DELAY_BETWEEN_CLICKS_MS);
                                    }
                                }, { once: true });
                            } else {
                                safeDLEPushCall('error', 'Ошибка: пак исчез. Фарм остановлен.');
                                isAutoFarming = false; stopAutoFarming = false; updateButtonUI();
                            }
                        } else if (error.message === 'Остановлено') {
                            console.log('[AutoFarm] Цикл прерван по команде "стоп".');
                            isAutoFarming = false; stopAutoFarming = false; updateButtonUI();
                        } else {
                            safeDLEPushCall('error', `Ошибка фарма: ${error.message}.`);
                            isAutoFarming = false; stopAutoFarming = false; updateButtonUI();
                        }
                    }
                }

                // #######################################################################
                // #######################################################################
                function toggleAutoFarming() {
                    if (isAutoFarming) {
                        isAutoFarming = false;
                        stopAutoFarming = true;
                        if (autoSelectionTimeoutId) clearTimeout(autoSelectionTimeoutId);
                        updateButtonUI();
                        safeDLEPushCall('info', 'Авто-фарм остановлен.');
                        console.log('[AutoFarm] Получена команда на остановку.');
                    } else {
                        isAutoFarming = true;
                        stopAutoFarming = false;
                        safeDLEPushCall('success', 'Авто-фарм паков запущен!');
                        updateButtonUI();
                        autoFarmLoop();
                    }
                }

                // #######################################################################
                // #######################################################################
                async function createToggleButton() {
                    if (!isCardPackPage()) return;
                    if (!(await GM_getValue(AUTO_CARD_SELECTION_ENABLED_KEY, false))) return;
                    if (document.getElementById('auto-farm-pack-btn')) return;
                    const button = document.createElement('button');
                    button.id = 'auto-farm-pack-btn';
                    button.innerHTML = '<i class="fas fa-magic" style="font-size: 14px;"></i>';
                    Object.assign(button.style, {
                        position: 'fixed', bottom: '445px', right: '12px', zIndex: '102',
                        width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer',
                        boxShadow: '0 0 10px rgba(0,0,0,0.7)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', padding: '0',
                        transition: 'all 0.2s ease', border: '1px solid #6A4A9C'
                    });
                    button.onclick = toggleAutoFarming;
                    document.body.appendChild(button);
                    updateButtonUI();
                    if (!managedButtonSelectors.includes('#auto-farm-pack-btn')) {
                        managedButtonSelectors.push('#auto-farm-pack-btn');
                    }
                }
                createToggleButton();
            })();
        }


        // #######################################################################
        // # Обертка для предотвращения повторной инициализации скрипта.
        // #######################################################################
        async function initializeScriptWrapper() {
            if (scriptInitialized) {
                return;
            }
            // #######################################################################
            // # ПЕРЕХВАТ ФУНКЦИИ AllAnimeCards ДЛЯ ГАРАНТИРОВАННОГО ОБНОВЛЕНИЯ КНОПОК
            // #######################################################################
            if (typeof unsafeWindow.AllAnimeCards === 'function') {
                const originalAllAnimeCards = unsafeWindow.AllAnimeCards;
                unsafeWindow.AllAnimeCards = function(...args) {
                    const result = originalAllAnimeCards.apply(this, args);
                    setTimeout(() => {
                        addDemandCheckButtonsToCards();
                        if (typeof unsafeWindow.addCheckButtons === 'function') {
                            unsafeWindow.addCheckButtons();
                        }
                    }, 500);
                    return result;
                };
            }
            scriptInitialized = true;
            await checkForInterruptedScrape();
            doActualInitialization();
            if (window.self === window.top) {
                const currentPathname = window.location.pathname;
                if (currentPathname.match(/^\/cards\/\d+\/trade\/?$/i) || currentPathname.startsWith('/trades/')) {
                    setTimeout(handleTradePagePoster, 200);
                }
            }
        }
        (async () => {
            const currentUrlParams = new URLSearchParams(window.location.search);
            const isTradePreviewIframe = currentUrlParams.get('as_preview_iframe') === 'true';
            if (window.self === window.top) {
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', initializeScriptWrapper);
                } else {
                    initializeScriptWrapper();
                }
            } else if (isTradePreviewIframe) {
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', initializeScriptWrapper);
                } else {
                    initializeScriptWrapper();
                }
            }
        })();

        // ##############################################################################################################################################
        // # БЛОК "Auto Click Crystal"
        // ##############################################################################################################################################
        let crystalPanelColorResetTimeout = null;
        let isFastCheckAfterClick = false;
        // #######################################################################
        // # Подсвечивает панель информации о кристаллах при успешном сборе.
        // #######################################################################
        function highlightCrystalPanel(isSuccess) {
            if (crystalPanelColorResetTimeout) {
                clearTimeout(crystalPanelColorResetTimeout);
            }
            const crystalBtn = document.getElementById('toggleCrystalScript');
            if (crystalBtn) {
                crystalBtn.classList.remove('crystal-glow-success', 'crystal-glow-fail');
                void crystalBtn.offsetWidth;
                crystalBtn.classList.add(isSuccess ? 'crystal-glow-success' : 'crystal-glow-fail');
            }
            const duration = 240000;
            crystalPanelColorResetTimeout = setTimeout(() => {
                if (crystalBtn) {
                    crystalBtn.classList.remove('crystal-glow-success', 'crystal-glow-fail');
                }
            }, duration);
        }
        unsafeWindow.highlightCrystalPanel = highlightCrystalPanel;

        // #######################################################################
        // --- Функция для обновления счетчика на главной кнопке ---
        // #######################################################################
        function updateCrystalButtonCounter() {
            const counterElement = document.getElementById('crystal_counter');
            if (!counterElement) return;

            if (crystalScriptEnabled) {
                counterElement.textContent = `${clickedCrystals}/${collectedStones}`;
                counterElement.style.display = 'flex';
            } else {
                counterElement.style.display = 'none';
            }
        }
        unsafeWindow.updateCrystalButtonCounter = updateCrystalButtonCounter;

        // #######################################################################
        // # Фиксер плеера по событию noData (Запускается один раз при инициализации)
        // #######################################################################
        function initializePlayerFixerOnNoData() {
            if (!isAnimePage()) return;
            const playerElement = document.getElementById('myPlayer');
            if (!playerElement) return;
            unsafeWindow.playerFixedPromise = new Promise(resolve => {
                const noDataHandler = () => {
                    const kodikTab = document.getElementById('kodik-tab');
                    if (kodikTab) {
                        console.log('Принудительно переключаюсь на "Кодик плеер"...');
                        if (typeof unsafeWindow.$ === 'function') {
                            unsafeWindow.$('#kodik-tab').trigger('click');
                        } else {
                            kodikTab.click();
                        }
                        setTimeout(resolve, 300);
                    } else {
                        console.error('[ACM Player Fix] Плеер сломан, но вкладка "Кодик" не найдена!');
                        resolve();
                    }
                };
                playerElement.addEventListener('noData', noDataHandler, { once: true });
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
            if (unsafeWindow.playerFixedPromise) {
                await unsafeWindow.playerFixedPromise;
            }
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
                cinemaButton.click();
                setTimeout(() => {
                    const buttonAfterFirstClick = document.querySelector('.anime-player__fullscreen-btn');
                    if (buttonAfterFirstClick) {
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
        let chatObserver = null;

        // #######################################################################
        // ФУНКЦИЯ для создания точки отсчета
        // #######################################################################
        async function createInitialTransactionBaseline() {
            console.log("ACC: Первый запуск или сброс. Создание точки отсчета из истории транзакций...");
            try {
                const response = await fetch('/transactions/', { cache: 'no-cache' });
                if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
                const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
                const newVerifiedTransactions = {};
                doc.querySelectorAll('.ncard-transactions__table tbody tr.new-tr-item').forEach(row => {
                    const descCell = row.querySelector('td:nth-child(4)');
                    const dateCell = row.querySelector('td:nth-child(3)');
                    if (descCell?.textContent.trim() === "Найден небесный камень" && dateCell) {
                        newVerifiedTransactions[dateCell.textContent.trim()] = true;
                    }
                });
                await GM_setValue('gm_verifiedCrystalTransactions', newVerifiedTransactions);
                console.log(`ACC: Точка отсчета успешно создана. ${Object.keys(newVerifiedTransactions).length} старых транзакций будут игнорироваться.`);
                if (typeof unsafeWindow.safeDLEPushCall === 'function') {
                    unsafeWindow.safeDLEPushCall('info', 'Синхронизация со страницей собранных кристаллов.');
                }
            } catch(error) {
                console.error("ACC: Ошибка при создании начальной точки отсчета.", error);
            }
        }

        // #######################################################################
        // # Модуль сбора кристаллов
        // #######################################################################
        async function saveClickedCache() {
            const cacheToSave = {
                ids: [...lastClickedIds],
                queue: lastClickedQueue
            };
            await GM_setValue('gm_crystalClickedCache_v2', cacheToSave);
        }
        // #######################################################################
        // Загружает кэш кликнутых ID из хранилища
        // #######################################################################
        async function loadClickedCache() {
            const cachedData = await GM_getValue('gm_crystalClickedCache_v2', null);
            if (cachedData && Array.isArray(cachedData.ids) && Array.isArray(cachedData.queue)) {
                lastClickedIds = new Set(cachedData.ids);
                lastClickedQueue = cachedData.queue;
            }
        }
        // #######################################################################
        // Добавляет ID в кэш и управляет его размером
        // #######################################################################
        function addIdToClickedCache(messageId) {
            if (lastClickedIds.has(messageId)) return;
            lastClickedIds.add(messageId);
            lastClickedQueue.push(messageId);
            while (lastClickedQueue.length > CRYSTAL_CACHE_LIMIT) {
                const oldId = lastClickedQueue.shift();
                lastClickedIds.delete(oldId);
            }
        }

        // #######################################################################
        // # Планирует проверку транзакций с задержкой (единая точка входа)
        // #######################################################################
        function scheduleVerificationByLeader() {
            if (!isLeaderWatch || isVerificationScheduled) {
                if (isVerificationScheduled) console.log("Проверка уже запланирована, новый запуск пропущен.");
                return;
            }
            console.log(`Планирую проверку транзакций через 5 секунд...`);
            isVerificationScheduled = true;
            isFastCheckAfterClick = true;
            checkHeavenlyStoneIntervalIds.forEach(id => clearTimeout(id));
            checkHeavenlyStoneIntervalIds = [];
            checkHeavenlyStoneIntervalIds.push(setTimeout(verifyAndCountCrystal, 3000));
        }

        // #######################################################################
        // Функция проверки транзакций
        // #######################################################################
        async function verifyAndCountCrystal() {
            if (!isLeaderWatch || !crystalScriptEnabled) return;
            console.log("Проверяю транзакции...");
            let success = false;
            let newStonesFoundThisCheck = 0;
            let shouldBroadcast = false;
            try {
                const response = await fetch('/transactions/', { cache: 'no-cache' });
                if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
                const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
                let verifiedTransactions = await GM_getValue('gm_verifiedCrystalTransactions', {});
                doc.querySelectorAll('.ncard-transactions__table tbody tr.new-tr-item').forEach(row => {
                    const descCell = row.querySelector('td:nth-child(4)');
                    const dateCell = row.querySelector('td:nth-child(3)');
                    if (descCell?.textContent.trim() === "Найден небесный камень" && dateCell && !verifiedTransactions[dateCell.textContent.trim()]) {
                        newStonesFoundThisCheck++;
                        verifiedTransactions[dateCell.textContent.trim()] = true;
                    }
                });
                if (newStonesFoundThisCheck > 0) {
                    collectedStones += newStonesFoundThisCheck;
                    await GM_setValue('gm_collectedStones', collectedStones);
                    await GM_setValue('gm_verifiedCrystalTransactions', verifiedTransactions);
                    success = true;
                    shouldBroadcast = true;
                } else if (isFastCheckAfterClick) {
                    success = false;
                    shouldBroadcast = true;
                }
            } catch (error) {
                console.error("🚫 Ошибка при проверке /transactions/:", error);
                success = false;
                if (isFastCheckAfterClick) {
                    shouldBroadcast = true;
                }
            } finally {
                if (shouldBroadcast) {
                    const finalStatePayload = {
                        clicked: clickedCrystals,
                        collected: collectedStones,
                        success: success,
                        timestamp: Date.now()
                    };
                    await GM_setValue(CRYSTAL_STATE_SYNC_KEY, finalStatePayload);
                    updateUiFromState(finalStatePayload);
                }
                isFastCheckAfterClick = false;
                isVerificationScheduled = false;
            }
        }

        // #######################################################################
        // #######################################################################
        function updateUiFromState(state) {
            clickedCrystals = state.clicked;
            collectedStones = state.collected;
            if (typeof unsafeWindow.updateCrystalButtonCounter === 'function') {
                unsafeWindow.updateCrystalButtonCounter();
            }
            if (state.success === 'reset_glow') {
                const crystalBtn = document.getElementById('toggleCrystalScript');
                if (crystalBtn) {
                    crystalBtn.classList.remove('crystal-glow-success', 'crystal-glow-fail');
                }
                if (crystalPanelColorResetTimeout) {
                    clearTimeout(crystalPanelColorResetTimeout);
                }
            } else if (state.success !== null) {
                if (typeof unsafeWindow.highlightCrystalPanel === 'function') {
                    unsafeWindow.highlightCrystalPanel(state.success);
                }
                if (state.success && soundEnabled) {
                    notificationSound.play().catch(e => {});
                }
            }
        }

        // #######################################################################
        // --- Функция полного сброса---
        // #######################################################################
        async function handleFullCrystalReset() {
            if (isProcessingReset) return;
            isProcessingReset = true;
            try {
                console.log("Запущен процесс полной очистки и создания новой точки отсчёта...");
                const resetState = {
                    clicked: 0,
                    collected: 0,
                    success: 'reset_glow',
                    timestamp: Date.now()
                };
                lastClickedIds.clear();
                lastClickedQueue = [];
                await Promise.all([
                    GM_deleteValue('gm_crystalClickedCache_v2'),
                    GM_deleteValue('gm_clickedCrystals'),
                    GM_deleteValue('gm_collectedStones'),
                    GM_deleteValue('gm_verifiedCrystalTransactions')
                ]);
                await createInitialTransactionBaseline();
                await GM_setValue(CRYSTAL_STATE_SYNC_KEY, resetState);
                updateUiFromState(resetState);

                console.log("Сброс и синхронизация завершены.");
            } finally {
                isProcessingReset = false;
            }
        }
        unsafeWindow.handleFullCrystalReset = handleFullCrystalReset;

        // #######################################################################
        // Запускает и инициализирует весь модуль автоматического сбора кристаллов.
        // #######################################################################
        async function startAutoClickCrystalScript() {
            if (isCrystalScriptCurrentlyRunning || !isAnimePage()) return;
            isCrystalScriptCurrentlyRunning = true;
            forceActivateChatForCrystals();
            await loadClickedCache();
            clickedCrystals = await GM_getValue('gm_clickedCrystals', 0);
            collectedStones = await GM_getValue('gm_collectedStones', 0);
            updateCrystalButtonCounter();
            soundEnabled = await GM_getValue('gm_crystalSoundEnabled', false);
            const existingBaseline = await GM_getValue('gm_verifiedCrystalTransactions', null);
            if (existingBaseline === null) {
                await createInitialTransactionBaseline();
            }
            const lastResetTimestamp = await GM_getValue('gm_lastClickedResetTimestamp', 0);
            if (Date.now() - lastResetTimestamp > CRYSTAL_RESET_INTERVAL_DAYS * 24 * 60 * 60 * 1000) {
                console.log(`Прошло более ${CRYSTAL_RESET_INTERVAL_DAYS} дней. Автоматический сброс данных.`);
                safeDLEPushCall('info', `Прошло ${CRYSTAL_RESET_INTERVAL_DAYS} дней.\nВыполняется плановый сброс счетчиков кристаллов.`);
                await handleFullCrystalReset();
                await GM_setValue('gm_lastClickedResetTimestamp', Date.now());
            }
            GM_addValueChangeListener(CRYSTAL_FORCE_CHECK_KEY, async (key, o, n, remote) => {
                if (remote && isLeaderWatch) {
                    console.log("Получен сигнал на проверку. Удаляю флаг ожидания и планирую проверку.");
                    await GM_deleteValue(CRYSTAL_PENDING_CHECK_KEY);
                    scheduleVerificationByLeader();
                }
            });

            // #######################################################################
            // --- Обработчик для одного узла (сообщение или кнопка AFK) ---
            // #######################################################################
            async function processNode(node) {
                const diamond = node.querySelector("#diamonds-chat");
                if (diamond) {
                    const messageNode = node.closest('.lc_chat_li');
                    const messageId = messageNode?.dataset.id;
                    if (messageId && !lastClickedIds.has(messageId) && isLeaderWatch) {
                        console.log(`👑💎 [Лидер] Найден кристалл! ID: ${messageId}. Кликаю...`);
                        diamond.click();
                        addIdToClickedCache(messageId);
                        clickedCrystals++;
                        const statePayload = {
                            clicked: clickedCrystals,
                            collected: collectedStones,
                            success: null,
                            timestamp: Date.now()
                        };
                        await GM_setValue(CRYSTAL_STATE_SYNC_KEY, statePayload);
                        await GM_setValue('gm_clickedCrystals', clickedCrystals);
                        await saveClickedCache();
                        scheduleVerificationByLeader();
                    } else if (messageId && !lastClickedIds.has(messageId) && !isLeaderWatch) {
                        console.log(`💎 [Не-лидер] Вижу кристалл (ID: ${messageId}), но не кликаю. Жду действий от лидера.`);
                    }
                }

                const afkButton = node.matches('.lc_chat_timeout_imback') ? node : node.querySelector('.lc_chat_timeout_imback');
                if (afkButton && afkButton.offsetParent !== null) {
                    console.log('[ACC] Обнаружена кнопка AFK. Нажимаю...');
                    afkButton.click();
                }
            }
            // #######################################################################
            // --- Главная функция активации (UI и наблюдатель) ---
            // #######################################################################
            function activateCrystalLogic() {
                const chatContainer = document.getElementById('chat-place');
                if (!chatContainer) {
                    console.error("[ACC] Не найден главный контейнер чата #chat-place. Наблюдатель не запущен.");
                    return;
                }
                chatContainer.querySelectorAll(".lc_chat_li, .lc_chat_timeout_imback").forEach(processNode);
                if (afkButtonObserver) afkButtonObserver.disconnect();
                afkButtonObserver = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(node => {
                                if (node.nodeType === 1) processNode(node);
                            });
                        }
                    }
                });
                afkButtonObserver.observe(chatContainer, { childList: true, subtree: true });
            }
            activateCrystalLogic();
        }
        // #######################################################################
        // Останавливает все активные операции сбора кристаллов
        // #######################################################################
        function stopActiveCrystalOperations() {
            if (afkButtonObserver) {
                afkButtonObserver.disconnect();
                afkButtonObserver = null;
                console.log("[ACC] Единый наблюдатель остановлен.");
            }
            checkHeavenlyStoneIntervalIds.forEach(id => clearTimeout(id));
            checkHeavenlyStoneIntervalIds = [];
        }
        // #######################################################################
        // Полностью останавливает работу модуля сбора кристаллов.
        // #######################################################################
        async function stopAutoClickCrystalScript() {
            if (isCrystalScriptCurrentlyRunning) {
                console.log("[ACC] Сбор кристаллов остановлен!");
                await saveClickedCache();
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
            let tabIdWatch = sessionStorage.getItem('ascm_tabId');
            if (!tabIdWatch) {
                const tabTimestamp = Date.now();
                tabIdWatch = tabTimestamp.toString() + "_" + Math.random().toString(36).substr(2, 5);
                sessionStorage.setItem('ascm_tabId', tabIdWatch);
            } else {
            }
            const tabTimestamp = parseInt(tabIdWatch.split('_')[0], 10);
            unsafeWindow.tabIdWatch = tabIdWatch;
            let dleHashCheckAttemptsWatch = 0;
            const MAX_DLE_HASH_CHECK_ATTEMPTS_WATCH = 5;
            const DLE_HASH_CHECK_INTERVAL_WATCH = 20000;
            let initialLeaderCheckDoneWatch = false;
            let leaderFirstCheckLogDone = false;

            // #######################################################################
            // # Проверяет, является ли текущая страница страницей просмотра видео (Аниме).
            // #######################################################################
            function isVideoPageWatchInternal() {
                return isAnimePage();
            }

            // #######################################################################
            // # Обновляет вид и подсказку кнопки авто-сбора в зависимости от состояния (вкл/выкл, лидер/ожидание).
            // #######################################################################
            function updateFullToggleButtonState(button, externalPauseState = null) {
                if (!button) button = document.getElementById('toggleScriptButton');
                if (!button) return;
                (async () => {
                    let isPaused = externalPauseState !== null ? externalPauseState : await GM_getValue(COLLECTION_PAUSED_KEY, false);
                    isCollectionPaused = isPaused;
                    if (isPaused && scriptEnabledWatch) {
                        button.style.setProperty('background', 'linear-gradient(145deg, #e67e22, #d35400)', 'important');
                        button.title = 'Пауза: достигнут лимит карт (сброс по клику на счетчик)';
                    } else if (scriptEnabledWatch) {
                        if (isLeaderWatch) {
                            button.style.setProperty('background', 'linear-gradient(145deg, rgb(50, 222, 50), rgb(50, 122, 50))', 'important'); // Зеленый
                            button.title = 'Авто-сбор карт ВКЛ (Лидер)';
                        } else {
                            button.style.setProperty('background', 'linear-gradient(145deg, rgb(255, 193, 7), rgb(255, 160, 0))', 'important'); // Желто-оранжевый
                            button.title = 'Авто-сбор карт ВКЛ (Ожидание)';
                        }
                    } else {
                        button.style.setProperty('background', 'linear-gradient(145deg, rgb(166, 100, 110), rgb(222, 0, 5))', 'important'); // Красный
                        button.title = 'Авто-сбор карт ВЫКЛ';
                        if (autoCollectButtonCounter) {
                            autoCollectButtonCounter.style.display = 'none';
                        }
                    }
                    button.style.setProperty('color', 'white', 'important');
                })();
            }
            unsafeWindow.updateFullToggleButtonState = updateFullToggleButtonState;


            // #######################################################################
            // Запускает "аудио-будильник", чтобы предотвратить засыпание вкладки.
            // #######################################################################
            function startKeepAwake() {
                if (keepAwakeInterval) return;
                console.log("🔊 Будильник от зависания - активирован.");
                const playSilence = () => {
                    if (!isLeaderWatch) {
                        stopKeepAwake();
                        return;
                    }
                    try {
                        if (!audioContext) {
                            audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        }
                        if (audioContext.state !== 'running') {
                            return;
                        }
                        const buffer = audioContext.createBuffer(1, 1, 22050);
                        const source = audioContext.createBufferSource();
                        source.buffer = buffer;
                        source.connect(audioContext.destination);
                        source.start();

                    } catch (e) {
                        console.warn("Ошибка воспроизведения тишины.", e.message);
                        stopKeepAwake();
                    }
                };

                keepAwakeInterval = setInterval(playSilence, 20000);
            }

            // #######################################################################
            // Останавливает "аудио-будильник".
            // #######################################################################
            function stopKeepAwake() {
                if (keepAwakeInterval) {
                    clearInterval(keepAwakeInterval);
                    keepAwakeInterval = null;
                    console.log("🔇 [Будильник] Деактивирован.");
                }
                if (audioContext && audioContext.state !== 'closed') {
                    audioContext.close();
                    audioContext = null;
                }
                window.removeEventListener('click', universalAudioUnlock, { capture: true });
                window.removeEventListener('keydown', universalAudioUnlock, { capture: true });
            }

            // #######################################################################
            // Эта функция будет вызвана один раз при первом клике/нажатии клавиши на странице.
            // Она "разблокирует" и AudioContext для будильника, и тег <audio> для уведомлений.
            // #######################################################################
            function universalAudioUnlock(event) {
                const isUserGesture = event && event.isTrusted;
                if (!isUserGesture) return;
                if (audioContext && audioContext.state === 'suspended') {
                    audioContext.resume().then(() => {
                        console.log("🔊 AudioContext для будильника - разблокирован.");
                    }).catch(e => console.warn("Не удалось разблокировать AudioContext:", e.message));
                }
                if (typeof notificationSound !== 'undefined' && notificationSound) {
                    if (!notificationSound.dataset.unlocked) {
                        notificationSound.load();
                        notificationSound.dataset.unlocked = "true";
                        console.log("🔔 Звук уведомлений - разблокирован.");
                    }
                }
                window.removeEventListener('click', universalAudioUnlock, { capture: true });
                window.removeEventListener('keydown', universalAudioUnlock, { capture: true });
            }
            window.addEventListener('click', universalAudioUnlock, { capture: true });
            window.addEventListener('keydown', universalAudioUnlock, { capture: true });

            // #######################################################################
            // # Реализует логику "выборов": проверяет текущего лидера в localStorage и пытается стать им, отдавая приоритет вкладкам на странице видео.
            // #######################################################################
            async function tryToBecomeLeaderWatch() {
                if (unsafeWindow.isElectionInProgress) return;
                unsafeWindow.isElectionInProgress = true;
                const lockedLeaderId = await GM_getValue(LEADER_LOCK_KEY, null);
                if (lockedLeaderId) {
                    const currentLeaderJSON = localStorage.getItem(LEADER_KEY_WATCH);
                    let currentLeaderId = null;
                    if (currentLeaderJSON) {
                        try { currentLeaderId = JSON.parse(currentLeaderJSON).id; } catch(e) {}
                    }
                    if (lockedLeaderId === tabIdWatch) {
                        if (currentLeaderId !== lockedLeaderId) {
                            console.log("👑 [Замок] Эта вкладка является заблокированным лидером. Захватываю лидерство.");
                            becomeLeader();
                        }
                    } else {
                        if (isLeaderWatch) {
                            console.log(`[Замок] Другая вкладка (${lockedLeaderId}) заблокировала лидерство. Уступаю.`);
                            stopBeingLeader();
                        }
                    }
                    updateFullToggleButtonState();
                    unsafeWindow.isElectionInProgress = false;
                    return;
                }
                if (!scriptEnabledWatch && !crystalScriptEnabled) {
                    if (isLeaderWatch) {
                        const currentLeaderJSON = localStorage.getItem(LEADER_KEY_WATCH);
                        if (currentLeaderJSON) { try { if (JSON.parse(currentLeaderJSON).id === tabIdWatch) { localStorage.removeItem(LEADER_KEY_WATCH); } } catch(e) {} }
                        stopBeingLeader();
                    }
                    updateFullToggleButtonState();
                    unsafeWindow.isElectionInProgress = false;
                    return;
                }
                const currentTabIsVideo = isAnimePage();
                const currentLeaderJSON = localStorage.getItem(LEADER_KEY_WATCH);
                let currentLeader = null;
                let leaderIsAlive = false;
                if (currentLeaderJSON) {
                    try {
                        currentLeader = JSON.parse(currentLeaderJSON);
                        leaderIsAlive = (Date.now() - currentLeader.time) <= LEADER_TIMEOUT_WATCH;
                    } catch (e) { currentLeader = null; }
                }
                if (leaderIsAlive) {
                    if (currentLeader.id === tabIdWatch) {
                        if (!isLeaderWatch) { isLeaderWatch = true; console.log("Я (Лидер) - подтверждаю свой статус."); }
                        ensureMainLogicIsRunning(); startKeepAwake();
                    } else {
                        if (currentTabIsVideo && !currentLeader.isVideo) {
                            console.log(`[Выборы] Обнаружен лидер без приоритета (НЕ Аниме). Запускаю перевыборы...`);
                            leaderIsAlive = false;
                        } else {
                            if (isLeaderWatch) stopBeingLeader();
                        }
                    }
                }
                if (!leaderIsAlive) {
                    const electionDelay = Math.random() * 750 + 250;
                    console.log(`[Выборы] ${currentLeaderJSON ? 'Лидер не отвечает или не имеет приоритета.' : 'Лидера нет.'} Пытаюсь стать им через ${Math.round(electionDelay)} мс...`);
                    setTimeout(async () => {
                        const lockIdBeforeSeize = await GM_getValue(LEADER_LOCK_KEY, null);
                        if (lockIdBeforeSeize) {
                            console.log("[Выборы] Во время ожидания был установлен замок. Отменяю попытку захвата.");
                            unsafeWindow.isElectionInProgress = false;
                            tryToBecomeLeaderWatch();
                            return;
                        }
                        const leaderNowJSON = localStorage.getItem(LEADER_KEY_WATCH);
                        let leaderNow = null;
                        if (leaderNowJSON) {
                            try {
                                leaderNow = JSON.parse(leaderNowJSON);
                                if ((Date.now() - leaderNow.time) > LEADER_TIMEOUT_WATCH) {
                                    leaderNow = null;
                                }
                            } catch(e) {
                                leaderNow = null;
                            }
                        }
                        const canBecomeLeader = !leaderNow ||
                              (tabTimestamp < leaderNow.timestamp) ||
                              (currentTabIsVideo && !leaderNow.isVideo);
                        if (canBecomeLeader) {
                            console.log("[Выборы] Проверка пройдена. Становлюсь лидером.");
                            becomeLeader();
                        } else {
                            console.log(`[Выборы] Другая, более подходящая вкладка (ID: ${leaderNow.id}) успела стать лидером. Отступаю.`);
                        }
                        unsafeWindow.isElectionInProgress = false;
                    }, electionDelay);
                    return;
                }
                updateFullToggleButtonState();
                unsafeWindow.isElectionInProgress = false;
            }
            unsafeWindow.tryToBecomeLeaderWatch = tryToBecomeLeaderWatch;

            // #######################################################################
            // # Новая функция для правильной и приоритетной инициализации лидерства (v2)
            // #######################################################################
            unsafeWindow.initializeLeadership = async function() {
                const lockedLeaderId = await GM_getValue(LEADER_LOCK_KEY, null);
                if (lockedLeaderId && lockedLeaderId === unsafeWindow.tabIdWatch) {
                    console.log("Лидерство заблокировано этой вкладкой.");
                    if (unsafeWindow.isElectionInProgress) return;
                    unsafeWindow.isElectionInProgress = true;
                    becomeLeader();
                    unsafeWindow.isElectionInProgress = false;
                } else {
                    console.log("Другая вкладка заблокировала лидерство.");
                    if (typeof unsafeWindow.tryToBecomeLeaderWatch === 'function') {
                        await unsafeWindow.tryToBecomeLeaderWatch();
                    }
                }
                if (typeof unsafeWindow.startHeartbeatWatch === 'function') {
                    unsafeWindow.startHeartbeatWatch();
                }
            }

            // #######################################################################
            //Вспомогательная функция для атомарного захвата лидерства.
            // #######################################################################
            function becomeLeader() {
                const payload = JSON.stringify({
                    id: tabIdWatch,
                    time: Date.now(),
                    timestamp: tabTimestamp,
                    isVideo: isAnimePage(),
                    isPaused: isCollectionPaused
                });
                localStorage.setItem(LEADER_KEY_WATCH, payload);
                localStorage.removeItem(LEADER_CHALLENGE_KEY);
                if (!isLeaderWatch) {
                    console.log(`Я (${isAnimePage() ? 'Аниме' : 'НЕ Аниме'}) становлюсь лидером.`);
                }
                isLeaderWatch = true;
                updateFullToggleButtonState();
                ensureMainLogicIsRunning();
                startKeepAwake();
            }
            function ensureMainLogicIsRunning() {
                if (isLeaderWatch && (scriptEnabledWatch || crystalScriptEnabled) && !checkNewCardTimeoutId) {
                    setTimeout(mainCardCheckLogic, 500);
                }
            }
            // #######################################################################
            // Вспомогательная функция для прекращения лидерства.
            // #######################################################################
            function stopBeingLeader() {
                isLeaderWatch = false;
                stopMainCardCheckLogic();
                updateFullToggleButtonState();
                stopKeepAwake();
            }

            // #######################################################################
            // # Запускает "пульс" (setInterval): обновляет метку времени лидера или проверяет его активность, если вкладка не лидер.
            // #######################################################################
            function startHeartbeatWatch() {
                if (heartbeatIntervalId) {
                    clearInterval(heartbeatIntervalId);
                }
                if (!scriptEnabledWatch && !crystalScriptEnabled) {
                    heartbeatIntervalId = null;
                    return;
                }
                heartbeatIntervalId = setInterval(() => {
                    if (!scriptEnabledWatch && !crystalScriptEnabled) {
                        clearInterval(heartbeatIntervalId);
                        heartbeatIntervalId = null;
                        return;
                    }
                    if (isLeaderWatch) {
                        checkAndTriggerNewDay();
                        const leaderDataJSON = localStorage.getItem(LEADER_KEY_WATCH);
                        try {
                            const leaderData = JSON.parse(leaderDataJSON || '{}');
                            if (leaderData && leaderData.id === tabIdWatch) {
                                leaderData.time = Date.now();
                                leaderData.isPaused = isCollectionPaused;
                                localStorage.setItem(LEADER_KEY_WATCH, JSON.stringify(leaderData));
                            } else {
                                console.log("[Heartbeat] Обнаружена потеря лидерства. Уступаю.");
                                stopBeingLeader();
                            }
                        } catch (e) { /* Игнорируем ошибки парсинга */ }
                    } else {
                        const leaderDataJSON = localStorage.getItem(LEADER_KEY_WATCH);
                        if (!leaderDataJSON) {
                            tryToBecomeLeaderWatch();
                            return;
                        }
                        try {
                            const leader = JSON.parse(leaderDataJSON);
                            if ((Date.now() - leader.time) > LEADER_TIMEOUT_WATCH) {
                                tryToBecomeLeaderWatch();
                            }
                        } catch (e) {
                            tryToBecomeLeaderWatch();
                        }
                    }
                }, HEARTBEAT_INTERVAL_WATCH);
            }

            // #######################################################################
            // # Слушатель события storage для синхронизации состояния (вкл/выкл, смена лидера) между вкладками.
            // #######################################################################
            function checkLeaderStorageEventWatch(e) {
                if (e.key === LEADER_CHALLENGE_KEY && isLeaderWatch) {
                    if (e.newValue) {
                        try {
                            const challenge = JSON.parse(e.newValue);
                            if (challenge.id !== tabIdWatch) {
                                console.log(`Получен "пинок" от вкладки-кандидата ${challenge.id}.\nНемедленно обновляю свой пульс!`);
                                const currentTabIsVideo = isAnimePage();
                                const payload = JSON.stringify({
                                    id: tabIdWatch,
                                    time: Date.now(),
                                    timestamp: tabTimestamp,
                                    isVideo: currentTabIsVideo,
                                    isPaused: isCollectionPaused
                                });
                                localStorage.setItem(LEADER_KEY_WATCH, payload);
                            }
                        } catch(err) {}
                    }
                }
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
                if (!scriptEnabledWatch && !crystalScriptEnabled) {
                    return;
                }
                if (e.key === LEADER_KEY_WATCH) {
                    const currentIsLeaderBeforeCheck = isLeaderWatch;
                    if (!e.newValue) {
                        if (currentIsLeaderBeforeCheck) {
                            console.log(`Ключ лидера удален.\nЭта вкладка перестает быть лидером.`);
                            isLeaderWatch = false; stopMainCardCheckLogic(); updateFullToggleButtonState();
                        }
                        setTimeout(tryToBecomeLeaderWatch, Math.random() * 200 + 100); return;
                    }
                    try {
                        const newLeaderOnStorage = JSON.parse(e.newValue);
                        if (newLeaderOnStorage && newLeaderOnStorage.id) {
                            if (newLeaderOnStorage.id === tabIdWatch) {
                                if (!currentIsLeaderBeforeCheck) {
                                    console.log(`Вкладка ${tabIdWatch} (${isVideoPageWatchInternal() ? '(Аниме)' : '(НЕ Аниме)'})\nподтверждает/восстанавливает лидерство.`);
                                    isLeaderWatch = true; updateFullToggleButtonState(); startHeartbeatWatch(true);
                                    if (scriptEnabledWatch && !checkNewCardTimeoutId) { mainCardCheckLogic(); }
                                }
                            } else {
                                if (currentIsLeaderBeforeCheck) {
                                    console.log(`Лидерство перехвачено вкладкой:${newLeaderOnStorage.isVideo ? '(Аниме)' : '(НЕ Аниме)'}.\nЭта вкладка перестает быть лидером.`);
                                    isLeaderWatch = false; stopMainCardCheckLogic(); updateFullToggleButtonState(); startHeartbeatWatch(false);
                                }
                            }
                            if (newLeaderOnStorage.id !== tabIdWatch) {
                                const leaderIsPaused = newLeaderOnStorage.isPaused === true;
                                updateFullToggleButtonState(null, leaderIsPaused);
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
            GM_addValueChangeListener(NOTIFY_NEW_CARD_KEY_WATCH, (key, oldValue, newValue, remote) => {
                if (newValue && newValue.timestamp > lastNotificationTimestamp) {
                    lastNotificationTimestamp = newValue.timestamp;
                    if (typeof showCardReceivedNotification === 'function' && newValue.card) {
                        showCardReceivedNotification(newValue.card);
                    } else if (newValue.message) {
                        safeDLEPushCall('success', newValue.message);
                    }
                }
            });

            // #######################################################################
            // ===== ТРИГГЕР ДЛЯ НЕМЕДЛЕННОГО ЗАПУСКА ПРОВЕРКИ =====
            // #######################################################################
            function triggerImmediateCheck() {
                if (!isLeaderWatch || !scriptEnabledWatch) return;
                console.log('Получен внешний триггер для немедленной проверки карты.');
                if (checkNewCardTimeoutId) {
                    clearTimeout(checkNewCardTimeoutId);
                    checkNewCardTimeoutId = null;
                }
                mainCardCheckLogic();
            }
            unsafeWindow.triggerImmediateCardCheck = triggerImmediateCheck;


            // #######################################################################
            // # ПРОВЕРКА И ЗАПУСК НОВОГО ДНЯ
            // #######################################################################
            async function checkAndTriggerNewDay() {
                const isEnabled = await GM_getValue(AUTO_NEW_DAY_RESET_ENABLED_KEY, true);
                if (!isEnabled) {
                    return;
                }
                const moscowTime = new Date(new Date().getTime() + (3 * 60 * 60 * 1000));
                const todayDateStr = moscowTime.toISOString().split('T')[0];
                const lastCheckDate = await GM_getValue(NEW_DAY_CHECK_KEY, '');
                if (lastCheckDate === todayDateStr) {
                    return;
                }
                const hours = moscowTime.getUTCHours();
                const minutes = moscowTime.getUTCMinutes();
                if (hours === 0 && minutes >= 1) {
                    const isCollectionActuallyPaused = await GM_getValue(COLLECTION_PAUSED_KEY, false);
                    const isPauseFeatureEnabledInSettings = await GM_getValue(PAUSE_ON_LIMIT_ENABLED_KEY, true);
                    const shouldTrigger = (isPauseFeatureEnabledInSettings && isCollectionActuallyPaused) || !isPauseFeatureEnabledInSettings;
                    if (shouldTrigger) {
                        if (!isPauseFeatureEnabledInSettings) {
                            console.log('[New Day] Наступил новый день. Функция паузы отключена, выполняю проверку бонуса.');
                        } else {
                            console.log('[New Day] Наступил новый день и сбор на паузе. Выполняю проверку бонуса и сброс паузы.');
                        }
                        await GM_setValue(NEW_DAY_CHECK_KEY, todayDateStr);
                        await triggerDailyBonusCheck();
                    } else {
                        await GM_setValue(NEW_DAY_CHECK_KEY, todayDateStr);
                        console.log('[New Day] Наступил новый день, но сбор еще не достиг лимита для паузы. Действий не требуется.');
                    }
                }
            }

            // #######################################################################
            // # Отправляет прямой запрос на сервер для проверки и получения ежедневного бонуса.
            // #######################################################################
            async function triggerDailyBonusCheck() {
                console.log('[New Day] Отправляю прямой запрос на проверку ежедневного бонуса...');
                if (typeof safeDLEPushCall === 'function') {
                    safeDLEPushCall('info', 'Запускаю процедуру сброса дневного лимита...');
                }
                try {
                    const user_hash = unsafeWindow.dle_login_hash;
                    if (!user_hash) {
                        console.error('[New Day] Не найден user_hash для запроса.');
                        return;
                    }
                    const formData = new URLSearchParams();
                    formData.append('mod', 'check_login_days');
                    formData.append('user_hash', user_hash);
                    const response = await fetch(`${getCurrentDomain()}/engine/ajax/controller.php?mod=check_login_days`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: formData
                    });
                    if (!response.ok) {
                        throw new Error(`Сетевая ошибка: ${response.status}`);
                    }
                    const responseText = await response.text();
                    console.log('[New Day] Ответ от сервера:', responseText);
                    const successMessage = responseText.toLowerCase();
                    if (successMessage.includes('бонус') || successMessage.includes('получили') || successMessage.includes('начислено')) {
                        console.log('[New Day] Запрос успешен! Бонус получен. Снимаю паузу сбора карт.');
                        if (typeof safeDLEPushCall === 'function') {
                            safeDLEPushCall('success', 'Дневной бонус получен! Авто-сбор карт возобновлен.');
                        }
                        await GM_setValue(COLLECTION_PAUSED_KEY, false);
                        await GM_deleteValue(PAUSE_DATE_KEY);
                        await GM_setValue(KICK_LEADER_TO_CHECK_KEY, Date.now());
                    } else {
                        console.warn('[New Day] Запрос выполнен, но ответ не похож на успешное получение бонуса. Возможно, он уже был получен ранее.');
                        await GM_setValue(COLLECTION_PAUSED_KEY, false);
                        await GM_deleteValue(PAUSE_DATE_KEY);
                        await GM_setValue(KICK_LEADER_TO_CHECK_KEY, Date.now());
                    }
                } catch (error) {
                    console.error('[New Day] Ошибка при выполнении прямого запроса на бонус:', error);
                    if (typeof safeDLEPushCall === 'function') {
                        safeDLEPushCall('error', 'Ошибка при попытке получить дневной бонус.');
                    }
                }
            }

            // #######################################################################
            // # Основная логика: проверяет все условия (лидерство, страница видео, хеш, паузы) и отправляет запрос на сервер для получения карты.
            // #######################################################################
            async function mainCardCheckLogic() {
                if (!isLeaderWatch) {
                    if (checkNewCardTimeoutId) clearTimeout(checkNewCardTimeoutId);
                    checkNewCardTimeoutId = null;
                    dleHashCheckAttemptsWatch = 0;
                    return;
                }
                if (crystalScriptEnabled) {
                    const pendingCheckTimestamp = await GM_getValue(CRYSTAL_PENDING_CHECK_KEY, 0);
                    if (pendingCheckTimestamp > 0 && (Date.now() - pendingCheckTimestamp < 120000)) {
                        console.log('👑 [Лидер] Обнаружен ожидающий запрос на проверку кристалла от другой вкладки.');
                        const lastState = await GM_getValue(CRYSTAL_STATE_SYNC_KEY, null);
                        if (lastState && lastState.timestamp >= pendingCheckTimestamp) {
                            console.log(`👑 [Лидер] Синхронизирую свои счетчики с последними данными: ${lastState.clicked}/${lastState.collected}`);
                            clickedCrystals = lastState.clicked;
                            collectedStones = lastState.collected;
                        }
                        await GM_deleteValue(CRYSTAL_PENDING_CHECK_KEY);
                        scheduleVerificationByLeader();
                    } else if (pendingCheckTimestamp > 0) {
                        console.log('👑 [Лидер] Обнаружен устаревший запрос на проверку. Удаляю.');
                        await GM_deleteValue(CRYSTAL_PENDING_CHECK_KEY);
                    }
                }
                if (scriptEnabledWatch) {
                    updateFullToggleButtonState();
                    isCollectionPaused = await GM_getValue(COLLECTION_PAUSED_KEY, false);
                    pauseOnLimitEnabled = await GM_getValue(PAUSE_ON_LIMIT_ENABLED_KEY, true);

                    if (isCollectionPaused && pauseOnLimitEnabled) {
                        if (!hasLoggedPauseMessage) {
                            console.log('Сбор карт на паузе.\nОжидаю внешний "пинок" (сброс нового дня или ручной).');
                            hasLoggedPauseMessage = true;
                        }
                        stopMainCardCheckLogic();
                        return;
                    }
                    hasLoggedPauseMessage = false;
                    if (isCollectionPaused && !pauseOnLimitEnabled) {
                        console.log(`Возобновляю сбор немедленно. Причина: Функция паузы была отключена в настройках.`);
                        safeDLEPushCall('info', 'Возобновлен авто-сбор карт.');
                        await GM_setValue(COLLECTION_PAUSED_KEY, false);
                        await GM_deleteValue(PAUSE_DATE_KEY);
                        isCollectionPaused = false;
                        updateFullToggleButtonState();
                    }
                    const userHash = typeof unsafeWindow !== 'undefined' ? unsafeWindow.dle_login_hash : window.dle_login_hash;
                    if (!userHash) {
                        dleHashCheckAttemptsWatch++;
                        if (dleHashCheckAttemptsWatch <= MAX_DLE_HASH_CHECK_ATTEMPTS_WATCH) {
                            checkNewCardTimeoutId = setTimeout(mainCardCheckLogic, DLE_HASH_CHECK_INTERVAL_WATCH);
                        } else {
                            safeDLEPushCall('error', 'Не удалось получить идентификатор сессии (dle_login_hash).');
                            dleHashCheckAttemptsWatch = 0;
                        }
                        return;
                    }
                    if (dleHashCheckAttemptsWatch > 0) dleHashCheckAttemptsWatch = 0;
                    const now = Date.now();
                    const globalLastRequestTime = await GM_getValue(LAST_SUCCESSFUL_REQUEST_KEY_WATCH, 0);
                    const timeSinceGlobalLastRequest = now - globalLastRequestTime;

                    if (timeSinceGlobalLastRequest < CHECK_NEW_CARD_INTERVAL) {
                        const timeLeft = CHECK_NEW_CARD_INTERVAL - timeSinceGlobalLastRequest;
                        console.log(`Следующий запрос на карты через ${Math.round(timeLeft / 1000)} сек.`);
                        if (checkNewCardTimeoutId) clearTimeout(checkNewCardTimeoutId);
                        checkNewCardTimeoutId = setTimeout(mainCardCheckLogic, timeLeft);
                        return;
                    }
                    await GM_setValue(LAST_SUCCESSFUL_REQUEST_KEY_WATCH, now);
                    try {
                        const currentDomain = getCurrentDomain();

                        // ==========================================================================================
                        // НАСТРОЙКИ "УМНОГО" АВТО-ПРОСМОТРА (Smart Rotation: 4 карты -> +1 серия, 11 серий -> +1 аниме)
                        // ==========================================================================================
                        const ANIME_POOL = [
                            { id: '2125', ep: '1', s: '1', t_title: 'AnimeVost' },
                            { id: '2743', ep: '1', s: '5', t_title: 'HORIZON' },
                            { id: '3100', ep: '1', s: '1', t_title: 'AniLiberty (AniLibria)' },
                            { id: '2770', ep: '1', s: '1', t_title: 'AniBaza' },
                            { id: '3103', ep: '1', s: '1', t_title: 'AnimeVost' },
                            { id: '3102', ep: '1', s: '1', t_title: 'AniBaza' },
                            { id: '208', ep: '1', s: '1', t_title: 'AniDUB' },
                            { id: '3098', ep: '1', s: '1', t_title: 'AniMaunt' },
                            { id: '2765', ep: '1', s: '1', t_title: 'AniBaza' },
                            { id: '2766', ep: '1', s: '1', t_title: 'AniDUB' },
                            { id: '2744', ep: '1', s: '1', t_title: 'AniDUB' },
                            { id: '2770', ep: '1', s: '1', t_title: 'AniBaza' },
                            { id: '2678', ep: '1', s: '1', t_title: 'AnimeVost' },
                            { id: '2748', ep: '1', s: '1', t_title: 'AnimeVost' },
                            { id: '2410', ep: '4', s: '1', t_title: 'AniFilm' },
                            { id: '2757', ep: '1', s: '1', t_title: 'AnimeVost' },
                            { id: '2755', ep: '1', s: '1', t_title: 'Dream Cast' },
                            { id: '2649', ep: '1', s: '1', t_title: 'AnimeVost' },
                            { id: '1748', ep: '1', s: '1', t_title: 'AniDUB' },
                            { id: '2827', ep: '1', s: '1', t_title: 'AniDUB' }
                        ];
                        const STATE_KEY = 'ascm_smart_progression_v1';
                        let state = await GM_getValue(STATE_KEY, {
                            index: Math.floor(Math.random() * ANIME_POOL.length),
                            ep_offset: 0,
                            cards_collected: 0
                        });
                        if (!ANIME_POOL[state.index]) {
                            state.index = 0; state.ep_offset = 0; state.cards_collected = 0;
                        }
                        const baseAnime = ANIME_POOL[state.index];
                        const currentEpisodeNumber = parseInt(baseAnime.ep, 10) + state.ep_offset;
                        console.log(`[AutoFarm] Аниме ID: ${baseAnime.id} | Серия: ${currentEpisodeNumber} | Карт с серии: ${state.cards_collected}/4`);
                        const requestParams = new URLSearchParams();
                        requestParams.append('user_hash', userHash);
                        requestParams.append('news_id', baseAnime.id);
                        requestParams.append('kodik_data[episode]', currentEpisodeNumber.toString());
                        requestParams.append('kodik_data[season]', baseAnime.s);
                        requestParams.append('kodik_data[translation][id]', '3861');
                        requestParams.append('kodik_data[translation][title]', baseAnime.t_title);
                        try {
                            await fetch(`${currentDomain}/ajax/calculate_series_watch/`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                    'X-Requested-With': 'XMLHttpRequest',
                                    'Referer': window.location.href
                                },
                                body: requestParams
                            });
                        } catch (calcError) {
                            console.warn("Ошибка при имитации просмотра:", calcError);
                        }
                        try {
                            await fetch(`${currentDomain}/ajax/calculate_time_watch/`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                    'X-Requested-With': 'XMLHttpRequest',
                                    'Referer': window.location.href
                                },
                                body: requestParams
                            });
                        } catch (calcError) {
                            console.warn("Ошибка при имитации времени просмотра:", calcError);
                        }
                        console.log("Отправляю запрос на получение карты...");
                        const response = await fetch(`${currentDomain}/ajax/card_for_watch/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                'X-Requested-With': 'XMLHttpRequest',
                                'Referer': window.location.href
                            },
                            body: requestParams
                        });
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        const responseText = await response.text();
                        let jsonData;
                        try {
                            jsonData = JSON.parse(responseText.startsWith("cards{") ? responseText.substring(5) : responseText);
                        } catch (e) {
                            console.error("Не удалось распарсить ответ сервера:", responseText);
                            return;
                        }
                        if (jsonData && jsonData.cards && jsonData.cards.id) {
                            const card = jsonData.cards;
                            console.log(`✅ Успех! Получена карта: "${card.name}" (Ранг: ${card.rank.toUpperCase()})`);
                            state.cards_collected++;
                            if (state.cards_collected >= 4) {
                                state.cards_collected = 0;
                                state.ep_offset++;
                                console.log(`🎉 Собрано 4 карты! Переход к следующей серии (+1).`);

                                if (state.ep_offset >= 8) {
                                    state.ep_offset = 0;
                                    let newIndex;
                                    do {
                                        newIndex = Math.floor(Math.random() * ANIME_POOL.length);
                                    } while (newIndex === state.index && ANIME_POOL.length > 1);

                                    state.index = newIndex;
                                    console.log(`🎬 Просмотрено 11 серий! Смена аниме на новое (ID: ${ANIME_POOL[state.index].id})`);
                                }
                            }
                            await GM_setValue(STATE_KEY, state);
                            await GM_setValue(NOTIFY_NEW_CARD_KEY_WATCH, {
                                card: jsonData.cards,
                                timestamp: Date.now()
                            });
                            await unsafeWindow.updateCardCounter(true);
                        } else if (jsonData && jsonData.reason) {
                            console.log(`ℹ️ Информация от сервера: ${jsonData.reason}`);
                            const reason = jsonData.reason || '(причина не указана)';
                            if (pauseOnLimitEnabled && /Пользователь сегодня получил свои \d+ карт/.test(reason)) {
                                await unsafeWindow.updateCardCounter(true);
                                console.log("Лимит карт достигнут. Ставлю сбор на паузу.");
                                safeDLEPushCall('warning', 'Достигнут дневной лимит карт. Сбор на паузе.');
                                isCollectionPaused = true;
                                await GM_setValue(COLLECTION_PAUSED_KEY, true);
                                const moscowTime = new Date(new Date().getTime() + (3 * 60 * 60 * 1000));
                                await GM_setValue(PAUSE_DATE_KEY, moscowTime.toISOString().split('T')[0]);
                                updateFullToggleButtonState();
                                const leaderDataJSON = localStorage.getItem(LEADER_KEY_WATCH);
                                if (leaderDataJSON) {
                                    try {
                                        const leaderData = JSON.parse(leaderDataJSON);
                                        if (leaderData.id === tabIdWatch) {
                                            leaderData.time = Date.now();
                                            leaderData.isPaused = true;
                                            localStorage.setItem(LEADER_KEY_WATCH, JSON.stringify(leaderData));
                                        }
                                    } catch(e) {}
                                }
                            }
                        } else {
                            console.log("⚠️ Получен неизвестный ответ от сервера:", jsonData);
                        }
                    } catch (e) {
                        console.error('Ошибка при запросе карты:', e);
                    } finally {
                        if (isLeaderWatch) {
                            await unsafeWindow.updateCardCounter();
                        }
                    }
                }
                const nextRunDelay = scriptEnabledWatch ? CHECK_NEW_CARD_INTERVAL : CRYSTAL_VERIFICATION_INTERVAL;
                if (checkNewCardTimeoutId) clearTimeout(checkNewCardTimeoutId);
                checkNewCardTimeoutId = setTimeout(mainCardCheckLogic, nextRunDelay);

                if (checkNewCardTimeoutId && scriptEnabledWatch) {
                    console.log(`Следующая проверка через ${Math.round(nextRunDelay / 1000)} сек.`);
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
            // # НОВОЕ МЕНЮ: Управление авто-фармом (Сброс + Смена аниме)
            // #######################################################################
            unsafeWindow.openAutoFarmMenu = async function() {
                const MODAL_ID = 'autofarm_control_modal';
                if (document.getElementById(MODAL_ID)) return;
                const ANIME_POOL_REF = [
                    { id: '2125', ep: '1', s: '1', t_title: 'AnimeVost' },
                    { id: '2743', ep: '1', s: '5', t_title: 'HORIZON' },
                    { id: '3100', ep: '1', s: '1', t_title: 'AniLiberty (AniLibria)' },
                    { id: '2770', ep: '1', s: '1', t_title: 'AniBaza' },
                    { id: '3103', ep: '1', s: '1', t_title: 'AnimeVost' },
                    { id: '3102', ep: '1', s: '1', t_title: 'AniBaza' },
                    { id: '208', ep: '1', s: '1', t_title: 'AniDUB' },
                    { id: '3098', ep: '1', s: '1', t_title: 'AniMaunt' },
                    { id: '2765', ep: '1', s: '1', t_title: 'AniBaza' },
                    { id: '2766', ep: '1', s: '1', t_title: 'AniDUB' },
                    { id: '2744', ep: '1', s: '1', t_title: 'AniDUB' },
                    { id: '2770', ep: '1', s: '1', t_title: 'AniBaza' },
                    { id: '2678', ep: '1', s: '1', t_title: 'AnimeVost' },
                    { id: '2748', ep: '1', s: '1', t_title: 'AnimeVost' },
                    { id: '2410', ep: '4', s: '1', t_title: 'AniFilm' },
                    { id: '2757', ep: '1', s: '1', t_title: 'AnimeVost' },
                    { id: '2755', ep: '1', s: '1', t_title: 'Dream Cast' },
                    { id: '2649', ep: '1', s: '1', t_title: 'AnimeVost' },
                    { id: '1748', ep: '1', s: '1', t_title: 'AniDUB' },
                    { id: '2827', ep: '1', s: '1', t_title: 'AniDUB' }
                ];
                const STATE_KEY = 'ascm_smart_progression_v1';
                let state = await GM_getValue(STATE_KEY, { index: 0, ep_offset: 0, cards_collected: 0 });
                if (!ANIME_POOL_REF[state.index]) state.index = 0;
                const currentAnime = ANIME_POOL_REF[state.index];
                const currentEp = parseInt(currentAnime.ep, 10) + state.ep_offset;
                const wrapper = document.createElement('div');
                wrapper.id = 'acm_modal_wrapper';
                wrapper.innerHTML = `
                <div class="acm-modal-backdrop"></div>
                <div class="acm-modal" id="${MODAL_ID}" style="width: 400px;">
                    <div class="modal-header">
                        <h2>Управление Авто-просмотром</h2>
                    </div>
                    <div class="modal-body" style="display: flex; flex-direction: column; gap: 15px;">

                        <!-- Информация о текущем состоянии -->
                        <div style="background: #27292d; padding: 10px; border-radius: 5px; border: 1px solid #33353a; text-align: center;">
                            <div style="color: #999; font-size: 12px;">Сейчас смотрит:</div>
                            <div style="color: #fff; font-weight: bold; font-size: 14px; margin: 5px 0;">ID: ${currentAnime.id} <span style="color: #666;">(Index: ${state.index})</span></div>
                            <div style="display: flex; justify-content: center; gap: 15px; font-size: 13px;">
                                <span style="color: #43b581;">Серия: <b>${currentEp}</b></span>
                                <span style="color: #faa61a;">Карт с серии: <b>${state.cards_collected}/4</b></span>
                            </div>
                        </div>

                        <!-- Кнопка смены аниме -->
                        <button id="af-random-anime-btn" class="action-btn" style="width: 100%; background: linear-gradient(145deg, #5865F2, #4752C4); border-color: #5865F2; padding: 12px;">
                            <i class="fas fa-random"></i> Сменить Аниме (Рандом)
                        </button>

                        <!-- Кнопка сброса лимита -->
                        <button id="af-reset-limit-btn" class="action-btn" style="width: 100%; background: linear-gradient(145deg, #e67e22, #d35400); border-color: #d35400; padding: 12px;">
                            <i class="fas fa-bolt"></i> Сброс Паузы/Лимита
                        </button>

                    </div>
                    <div class="modal-footer">
                        <button id="af-close-btn" class="action-btn close-btn">Закрыть</button>
                    </div>
                </div>`;

                document.body.appendChild(wrapper);
                const closeModal = () => wrapper.remove();
                wrapper.querySelector('.acm-modal-backdrop').onclick = closeModal;
                wrapper.querySelector('#af-close-btn').onclick = closeModal;
                wrapper.querySelector('#af-random-anime-btn').onclick = async () => {
                    let newIndex;
                    do {
                        newIndex = Math.floor(Math.random() * ANIME_POOL_REF.length);
                    } while (newIndex === state.index && ANIME_POOL_REF.length > 1);
                    const newState = {
                        index: newIndex,
                        ep_offset: 0,
                        cards_collected: 0
                    };
                    await GM_setValue(STATE_KEY, newState);
                    safeDLEPushCall('success', `Аниме изменено на ID: ${ANIME_POOL_REF[newIndex].id}`);
                    closeModal();
                    if (typeof unsafeWindow.triggerImmediateCardCheck === 'function') {
                        unsafeWindow.triggerImmediateCardCheck();
                    }
                };
                wrapper.querySelector('#af-reset-limit-btn').onclick = async () => {
                    const confirmation = await protector_customConfirm('Принудительно сбросить паузу сбора карт и запустить проверку?');
                    if (confirmation) {
                        safeDLEPushCall('info', 'Сбрасываю состояние паузы...');
                        await GM_setValue(COLLECTION_PAUSED_KEY, false);
                        await GM_deleteValue(PAUSE_DATE_KEY);
                        isCollectionPaused = false;

                        if (typeof unsafeWindow.updateFullToggleButtonState === 'function') {
                            unsafeWindow.updateFullToggleButtonState();
                        }
                        if (typeof unsafeWindow.triggerImmediateCardCheck === 'function') {
                            unsafeWindow.triggerImmediateCardCheck();
                        }
                        safeDLEPushCall('success', 'Сброс выполнен! Запущена проверка...');
                        closeModal();
                    }
                };
            };

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
                Object.assign(autoCollectButtonCounter.style, {
                    display: 'none', position: 'absolute', top: '-1px', right: '-1px', background: 'red',
                    color: 'white', borderRadius: '50%', padding: '2px 5px', fontSize: '10px',
                    lineHeight: '1', minWidth: '16px', textAlign: 'center'
                });
                button.appendChild(autoCollectButtonCounter);
                if (window.location.pathname.startsWith('/pm/')) {
                    button.setAttribute('data-mce-bogus', '1');
                }
                unsafeWindow.updateFullToggleButtonState(button);
                button.style.transition = 'opacity 0.3s ease, transform 0.3s ease, visibility 0s linear 0s';

                button.addEventListener('click', async function() {
                    scriptEnabledWatch = !scriptEnabledWatch;
                    localStorage.setItem(STORAGE_KEY_WATCH, scriptEnabledWatch.toString());
                    updateFullToggleButtonState(button);

                    if (scriptEnabledWatch) {
                        safeDLEPushCall('info', 'Авто-сбор карт включен.');
                        const cachedData = await GM_getValue(CARD_COUNT_CACHE_KEY, null);
                        if (cachedData && cachedData.text) {
                            updateAllCardCountDisplays(cachedData.text, cachedData.className);
                        }
                    } else {
                        safeDLEPushCall('info', "Авто-сбор карт выключен.");
                    }
                    unsafeWindow.tryToBecomeLeaderWatch();
                });
                autoCollectButtonCounter.addEventListener('click', async function(event) {
                    event.stopPropagation();
                    if (typeof unsafeWindow.openAutoFarmMenu === 'function') {
                        unsafeWindow.openAutoFarmMenu();
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
            unsafeWindow.tryToBecomeLeaderWatch = tryToBecomeLeaderWatch;
            unsafeWindow.startHeartbeatWatch = startHeartbeatWatch;
        })();

        // #######################################################################
        // # Инициализирует перехватчик уведомлений и добавляет кнопки "Прочитать все".
        // #######################################################################
        function initializeNotificationHandler() {
            'use strict';
            // #######################################################################
            // Стили для нового счетчика карт
            // #######################################################################
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

            // #######################################################################
            // ПЕРЕХВАТ И ЗАМЕНА СТАНДАРТНОЙ ФУНКЦИИ САЙТА
            // #######################################################################
            if (typeof unsafeWindow.DLE_Notifications !== 'function') {
                console.warn('AnimeStars Card Master: Функция DLE_Notifications не найдена. Кнопка "Прочитать все" может не работать.');
                return;
            }
            const original_DLE_Notifications = unsafeWindow.DLE_Notifications;
            unsafeWindow.DLE_Notifications = function(action, id) {
                if (action === 'full_read') {
                    unsafeWindow.$.post(unsafeWindow.dle_root + "engine/ajax/controller.php?mod=notifications", { action: 'full_read', user_hash: unsafeWindow.dle_login_hash }, function(data) {
                        const counter = document.getElementById('MainBadgeCounter');
                        if (counter) {
                            counter.textContent = '0';
                            counter.style.display = 'none';
                        }
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
                    original_DLE_Notifications.apply(this, arguments);
                }
            };

            // #######################################################################
            // ДОБАВЛЕНИЕ КНОПОК И СТИЛЕЙ
            // #######################################################################
            GM_addStyle(`
                #vm-read-all-btn { display: inline-flex; align-items: center; justify-content: center; width: 33px !important; height: 33px !important; min-width: 33px !important; min-height: 33px !important; padding: 0 !important; box-sizing: border-box; flex-shrink: 0; border-radius: 50%; background-color: rgba(255, 255, 255, 0.05); color: #b0b0b0; font-size: 16px; border: none; cursor: pointer; margin-left: 8px; transition: all 0.2s; }
                #vm-read-all-btn:hover { background-color: rgba(255, 255, 255, 0.15); color: #fff; }
                .lc_buttons {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    gap: 5px;
                }
                .lc_add {
                margin-right: 0;
                }
                #avw_card_counter {
                margin-right: 2px !important;
                }
                #vm-custom-buttons-container {
                display: none;
                align-items: center;
                gap: 0px;
                margin: 0 0px;
                margin-right: auto;
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
                const username = asbm_getUsername();
                const myCardsUrl = username ? `/user/cards/?name=${username}` : '/user/';
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
                const promoButton = document.createElement('a');
                promoButton.id = 'vm-promo-btn-chat';
                promoButton.className = 'asbm_button';
                promoButton.href = '/promo_codes/';
                promoButton.title = 'Промо';
                promoButton.innerHTML = `<span class="fal fa-gift"></span>`;
                const readAllButtonChat = document.createElement('button');
                readAllButtonChat.id = 'vm-read-all-btn-chat';
                readAllButtonChat.className = 'fal fa-check-circle';
                readAllButtonChat.title = 'Отметить все уведомления как прочитанные';
                readAllButtonChat.addEventListener('click', handleReadAllClick);
                if (!document.getElementById('avw_card_counter')) {
                    cardCountElement = document.createElement('span');
                    cardCountElement.id = 'avw_card_counter';
                    cardCountElement.textContent = '? / ?';
                    cardCountElement.title = 'При получении карты и раз в 30 минут. \nНажмите для обновления. ';
                    cardCountElement.addEventListener('click', async () => {
                        if (typeof unsafeWindow.openAutoFarmMenu === 'function') {
                            unsafeWindow.openAutoFarmMenu();
                        }
                        if (!manualCardCountCheckInProgress) {
                            manualCardCountCheckInProgress = true;
                            if (typeof unsafeWindow.updateCardCounter === 'function') {
                                unsafeWindow.updateCardCounter(true);
                            }
                            setTimeout(() => { manualCardCountCheckInProgress = false; }, 3000);
                        }
                    });
                    customContainer.appendChild(cardCountElement);
                }
                customContainer.appendChild(promoButton);
                customContainer.appendChild(cardsButton);
                customContainer.appendChild(packsButton);
                customContainer.appendChild(tradesButton);
                customContainer.appendChild(readAllButtonChat);
                targetContainer.insertBefore(customContainer, charCounter);
            };
            const dropdownList = document.getElementById('alertsDropdownList');
            if (dropdownList) {
                const dropdownObserver = new MutationObserver(() => {
                    const targetPanel = document.querySelector('#alertsDropdownList .dropdown-header .d-flex');
                    const buttonExists = document.getElementById('vm-read-all-btn');
                    if (targetPanel && !buttonExists) {
                        addDropdownButton();
                    }
                });
                dropdownObserver.observe(dropdownList, { childList: true, subtree: true });
            } else {
            }
            const chatObserver = new MutationObserver(() => {
                const chatButtonsContainer = document.querySelector('.lc_buttons');
                if (chatButtonsContainer && !document.getElementById('vm-custom-buttons-container')) {
                    addChatButton();
                }
            });
            const sideCol = document.querySelector('aside.col-side');
            if (sideCol) {
                chatObserver.observe(sideCol, { childList: true, subtree: true });
            } else {
            }
            addChatButton();
        }

        // #######################################################################
        // # Синхронизация счетчика карт между вкладками
        // #######################################################################
        (function() {
            'use strict';
            GM_addValueChangeListener(CARD_COUNT_SYNC_KEY, (key, oldValue, newValue, remote) => {
                if (remote && newValue) {
                    console.log('🔄 Получено обновление счетчика карт от лидера.');
                    updateAllCardCountDisplays(newValue.text, newValue.className);
                }
            });
            GM_addValueChangeListener(KICK_LEADER_TO_CHECK_KEY, (key, oldValue, newValue, remote) => {
                if (newValue && isLeaderWatch) {
                    console.log('Получен "пинок" для немедленной проверки!');
                    if (typeof unsafeWindow.triggerImmediateCardCheck === 'function') {
                        unsafeWindow.triggerImmediateCardCheck();
                    }
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
            const starIcon = document.createElement('i');
            starIcon.className = 'fas fa-star';
            starIcon.style.color = 'gold';
            starIcon.style.fontSize = '20px';
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

        // #######################################################################
        // # Наблюдатель за появлением модального окна карты
        // #######################################################################
        const modalObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.matches('.ui-dialog')) {
                        const addButtonsToModal = async (content) => {
                            const isStarEnabled = await GM_getValue(STAR_BUTTON_ENABLED_KEY, true);
                            if (isStarEnabled) addStarButton(content);

                            const isLockEnabled = await GM_getValue(LOCK_BUTTON_ENABLED_KEY, true);
                            if (isLockEnabled) addLockButton(content);
                        };
                        const contentObserver = new MutationObserver((innerMutations, observer) => {
                            const modalContent = addedNode.querySelector('#card-modal .modal__content');
                            if (modalContent) {
                                addButtonsToModal(modalContent);
                                observer.disconnect();
                            }
                        });
                        contentObserver.observe(addedNode, { childList: true, subtree: true });
                        const initialContent = addedNode.querySelector('#card-modal .modal__content');
                        if (initialContent) {
                            addButtonsToModal(initialContent);
                            contentObserver.disconnect();
                        }
                    }
                }
            }
        });
        modalObserver.observe(document.body, { childList: true });

        let isGlobalListenerAdded = false;
        if (!isGlobalListenerAdded) {
            isGlobalListenerAdded = true;
            GM_addValueChangeListener(CRYSTAL_STATE_SYNC_KEY, (key, o, newValue, remote) => {
                if (remote && newValue && newValue.timestamp > (o?.timestamp || 0)) {
                    console.log(`🔄 Получена синхронизация: ${newValue.clicked} кликов, ${newValue.collected} сборов, успех: ${newValue.success}.`);
                    updateUiFromState(newValue);
                }
            });
        }
    }

    // #######################################################################
    // # Добавляет кнопку-замок в модальное окно. Статус проверяется по клику.
    // #######################################################################
    async function addLockButton(modalContent) {
        if (modalContent.querySelector('.lock-meta-item')) return;
        const metaContainer = modalContent.querySelector('.ncard__meta');
        if (!metaContainer) return;
        const animeLinkElement = modalContent.querySelector('.anime-cards__link');
        if (!animeLinkElement || !animeLinkElement.href) return;
        const href = animeLinkElement.getAttribute('href');
        const animeName = animeLinkElement.textContent.trim();
        const match = href.match(/\/(\d+)-/);
        if (!match || !match[1]) return;
        const animeId = match[1];
        const lockButton = document.createElement('button');
        lockButton.className = 'ncard__meta-item lock-meta-item';
        lockButton.dataset.status = 'initial';
        Object.assign(lockButton.style, {
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '50%', textDecoration: 'none',
            padding: '0', boxSizing: 'border-box', backgroundColor: 'transparent',
            border: `1px solid #555`, transition: 'all 0.2s ease', cursor: 'pointer'
        });
        const lockIcon = document.createElement('i');
        lockIcon.style.fontSize = '18px';
        lockButton.appendChild(lockIcon);
        const updateButtonView = (status) => {
            lockButton.dataset.status = status;
            lockIcon.className = 'fas';
            lockButton.disabled = false;
            lockButton.style.pointerEvents = 'auto';
            switch (status) {
                case 'locked':
                    lockIcon.classList.add('fa-lock');
                    lockIcon.style.color = 'lightgreen';
                    lockButton.title = `Колода ЗАФИКСИРОВАНА.\nНажмите, чтобы снять фиксацию.`;
                    break;
                case 'partially_locked':
                    lockIcon.classList.add('fa-unlock');
                    lockIcon.style.color = 'orange';
                    lockButton.title = `Колода зафиксирована, но не полностью!\nНажмите для фиксации новых карт.`;
                    break;
                case 'unlocked':
                    lockIcon.classList.add('fa-lock-open');
                    lockIcon.style.color = '#a0b3c1';
                    lockButton.title = `Колода НЕ зафиксирована.\nНажмите для фиксации.`;
                    break;
                case 'not_collected':
                    lockIcon.classList.add('fa-trophy');
                    lockIcon.style.color = '#999';
                    lockButton.title = `Колода еще не была собрана\n(нет всех карт для фиксации).`;
                    lockButton.disabled = true;
                    break;
                case 'not_found':
                    lockIcon.classList.add('fa-times-circle');
                    lockIcon.style.color = '#ff6b6b';
                    lockButton.title = `В колоде еще нет 10 карт\nили у вас нет ни одной карты из неё.`;
                    lockButton.disabled = true;
                    break;
                case 'loading':
                    lockIcon.classList.add('fa-spinner', 'fa-spin');
                    lockIcon.style.color = 'white';
                    lockButton.title = 'Загрузка...';
                    lockButton.style.pointerEvents = 'none';
                    break;
                case 'initial':
                default:
                    lockIcon.classList.add('fa-lock');
                    lockIcon.style.color = '#a0b3c1';
                    lockButton.title = `Узнать статус блокировки колоды\n"${animeName}"`;
                    break;
            }
        };
        lockButton.addEventListener('click', async () => {
            const currentStatus = lockButton.dataset.status;
            const user_hash = unsafeWindow.dle_login_hash;
            const username = getCurrentes();
            if (!user_hash || !username) {
                unsafeWindow.safeDLEPushCall('error', 'Ошибка: не найден хэш или имя пользователя.');
                return;
            }
            updateButtonView('loading');
            const sendFixRequest = async () => {
                const response = await fetch("/engine/ajax/controller.php?mod=cards_ajax", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    body: new URLSearchParams({ action: 'progress_fix', anime_id: animeId, user_hash: user_hash }).toString()
                });
                if (!response.ok) throw new Error(`Сетевая ошибка: ${response.status}`);
            };
            if (currentStatus === 'initial') {
                try {
                    const searchUrl = `/user/${username}/cards_progress/?search=${encodeURIComponent(animeName)}`;
                    const response = await fetch(searchUrl);
                    const text = await response.text();
                    const doc = new DOMParser().parseFromString(text, 'text/html');
                    const hasAnyDeckResult = doc.querySelector('.card-list .user-anime');
                    if (!hasAnyDeckResult) {
                        updateButtonView('not_found');
                        unsafeWindow.safeDLEPushCall('custom', `В колоде\n"${animeName}"\nеще нет 10 карт\nили у вас нет ни одной карты.`);
                    } else {
                        const deckButton = doc.querySelector(`.fix-my-progress[onclick*="'${animeId}'"]`);
                        if (deckButton) {
                            const iconInButton = deckButton.querySelector('i');
                            if (iconInButton && iconInButton.classList.contains('fa-lock')) {
                                updateButtonView('locked');
                                unsafeWindow.safeDLEPushCall('custom', `Колода\n"${animeName}"\nзафиксирована.`);
                            } else if (iconInButton && iconInButton.classList.contains('fa-unlock')) {
                                updateButtonView('partially_locked');
                                unsafeWindow.safeDLEPushCall('custom', `Колода\n"${animeName}"\nзафиксирована не полностью.`);
                            } else {
                                updateButtonView('unlocked');
                                unsafeWindow.safeDLEPushCall('custom', `Колода\n"${animeName}"\nне зафиксирована.`);
                            }
                        } else {
                            updateButtonView('not_collected');
                            unsafeWindow.safeDLEPushCall('custom', `Колода\n"${animeName}"\nеще не была собрана.`);
                        }
                    }
                } catch (e) {
                    console.error('[ACM LockButton] Ошибка при проверке статуса:', e);
                    unsafeWindow.safeDLEPushCall('error', 'Ошибка при проверке статуса колоды.');
                    updateButtonView('initial');
                }
            } else if (currentStatus === 'locked' || currentStatus === 'unlocked' || currentStatus === 'partially_locked') {
                try {
                    await sendFixRequest();
                    const successMessage = (currentStatus === 'unlocked' || currentStatus === 'partially_locked')
                    ? `Колода\n"${animeName}"\nуспешно зафиксирована!`
                    : `Фиксация с колоды\n"${animeName}"\nуспешно снята!`;

                    unsafeWindow.safeDLEPushCall('success', successMessage);
                    setTimeout(() => updateButtonView('initial'), 500);

                } catch (error) {
                    console.error('[ACM LockButton] Ошибка при отправке запроса:', error);
                    unsafeWindow.safeDLEPushCall('error', 'Не удалось выполнить действие.');
                    updateButtonView(currentStatus);
                }
            }
            setTimeout(() => { lockButton.style.pointerEvents = 'auto'; }, 1500);
        });
        const starButton = metaContainer.querySelector('.star-meta-item');
        if (starButton) {
            metaContainer.insertBefore(lockButton, starButton);
        } else {
            const rankElement = metaContainer.querySelector('.ncard__meta-item.ncard__rank');
            if (rankElement) metaContainer.insertBefore(lockButton, rankElement);
            else metaContainer.appendChild(lockButton);
        }
        updateButtonView('initial');
    }

    // #######################################################################
    // # Функция, реализующая "Настройки авто-проверки дублей"
    // #######################################################################
    (function() {
        'use strict';
        function autoDup_loadSettings() {
            return { ...defaultSettings, ...GM_getValue(AUTO_DUP_SETTINGS_KEY, {}) };
        }
        function autoDup_saveSettings(settings) {
            GM_setValue(AUTO_DUP_SETTINGS_KEY, settings);
        }
        function autoDup_createSettingsModal() {
            const MODAL_WRAPPER_ID = 'acm_modal_wrapper';
            if (document.getElementById(MODAL_WRAPPER_ID)) return;
            const wrapper = document.createElement('div');
            wrapper.id = MODAL_WRAPPER_ID;
            wrapper.innerHTML = `
                <div class="acm-modal-backdrop"></div>
                <div class="acm-modal" id="autoDup_settings_modal">
                <div class="modal-header">
                <h2>Настройки авто-проверки дублей</h2>
                </div>
                <div class="modal-body">
                <p style="font-size: 13px; color: #999; text-align: center; margin-bottom: 15px;">Выберите ранги, которые будут автоматически проверяться на дубликаты при открытии пака.</p>
                <div id="autoDup_settings_list"></div>
                <div style="border-top: 1px solid #33353a; margin-top: 20px; padding-top: 15px; text-align: center;">
                <label for="autoPackCheck_initialDelay_slider" style="display: block; font-size: 13px; color: #999; margin-bottom: 10px;">
                Задержка пока крутится анимация
                </label>
                <input type="range" id="autoPackCheck_initialDelay_slider" min="0" max="5000" step="50" style="width: 80%;">
                <div id="autoPackCheck_initialDelay_value" style="margin-top: 5px; font-weight: bold; color: #ddd; font-family: monospace;"></div>
                <label for="autoDup_delay_slider" style="display: block; font-size: 13px; color: #999; margin-bottom: 10px; margin-top: 15px;">
                Задержка между проверкой карт
                </label>
                <input type="range" id="autoDup_delay_slider" min="0" max="3000" step="50" style="width: 80%;">
                <div id="autoDup_delay_value" style="margin-top: 5px; font-weight: bold; color: #ddd; font-family: monospace;"></div>
                </div>
                </div>
                <div class="modal-footer">
                <button id="autodup-back-to-main" class="action-btn back-btn">Назад</button>
                <button class="action-btn save-btn autoDup_save_settings">Сохранить</button>
                </div>
                </div>`;
            document.body.appendChild(wrapper);
            const settingsList = wrapper.querySelector('#autoDup_settings_list');
            checkableRanks.forEach(rank => {
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
            const updateDelayDisplay = () => { delayValueDisplay.textContent = `${delaySlider.value} мс (${(delaySlider.value / 1000).toFixed(2)} сек)`; };
            delaySlider.addEventListener('input', updateDelayDisplay);
            const initialDelaySlider = wrapper.querySelector('#autoPackCheck_initialDelay_slider');
            const initialDelayValueDisplay = wrapper.querySelector('#autoPackCheck_initialDelay_value');
            const updateInitialDelayDisplay = () => { initialDelayValueDisplay.textContent = `${initialDelaySlider.value} мс (${(initialDelaySlider.value / 1000).toFixed(2)} сек)`; };
            initialDelaySlider.addEventListener('input', updateInitialDelayDisplay);
            const closeModal = () => wrapper.remove();
            wrapper.querySelector('#autodup-back-to-main').onclick = () => {
                closeModal();
                unsafeWindow.openMasterSettingsModal();
            };
            wrapper.querySelector('.acm-modal-backdrop').onclick = closeModal;
            wrapper.querySelector('.autoDup_save_settings').onclick = () => {
                const newSettings = {};
                wrapper.querySelectorAll('input[type="checkbox"]').forEach(cb => { newSettings[cb.dataset.rank] = cb.checked; });
                autoDup_saveSettings(newSettings);
                GM_setValue('autoDup_delay_ms', parseInt(wrapper.querySelector('#autoDup_delay_slider').value, 10));
                GM_setValue('autoPackCheck_initialDelay_ms', parseInt(wrapper.querySelector('#autoPackCheck_initialDelay_slider').value, 10));
                closeModal();
                if (typeof safeDLEPushCall === 'function') {
                    unsafeWindow.safeDLEPushCall('success', 'Настройки авто-проверки дублей сохранены!');
                }
            };
            return wrapper;
        }
        // #######################################################################
        // Открывает модальное окно и заполняет его данными
        // #######################################################################
        function autoDup_openSettingsModal() {
            const wrapper = autoDup_createSettingsModal();
            if(!wrapper) return;
            const settings = autoDup_loadSettings();
            wrapper.querySelectorAll('#autoDup_settings_list input[type="checkbox"]').forEach(cb => {
                cb.checked = settings[cb.dataset.rank] === true;
            });
            const initialDelaySlider = wrapper.querySelector('#autoPackCheck_initialDelay_slider');
            const initialDelayValueDisplay = wrapper.querySelector('#autoPackCheck_initialDelay_value');
            initialDelaySlider.value = GM_getValue('autoPackCheck_initialDelay_ms', 1400);
            initialDelayValueDisplay.textContent = `${initialDelaySlider.value} мс (${(initialDelaySlider.value / 1000).toFixed(2)} сек)`;
            const delaySlider = wrapper.querySelector('#autoDup_delay_slider');
            const delayValueDisplay = wrapper.querySelector('#autoDup_delay_value');
            delaySlider.value = GM_getValue('autoDup_delay_ms', 150);
            delayValueDisplay.textContent = `${delaySlider.value} мс (${(delaySlider.value / 1000).toFixed(2)} сек)`;
        }
        unsafeWindow.autoDup_loadSettings = autoDup_loadSettings;
        unsafeWindow.autoDup_openSettingsModal = autoDup_openSettingsModal;
    })();

    // #######################################################################
    // # БЛОК: Настройки авто-проверки СПРОСА (ПАКИ)
    // #######################################################################
    (function() {
        'use strict';
        function autoDemand_loadSettings() {
            return { ...defaultDemandSettings, ...GM_getValue(AUTO_DEMAND_SETTINGS_KEY, {}) };
        }
        function autoDemand_saveSettings(settings) {
            GM_setValue(AUTO_DEMAND_SETTINGS_KEY, settings);
        }
        function autoDemand_createSettingsModal() {
            const MODAL_WRAPPER_ID = 'acm_modal_wrapper';
            if (document.getElementById(MODAL_WRAPPER_ID)) return;
            const wrapper = document.createElement('div');
            wrapper.id = MODAL_WRAPPER_ID;
            wrapper.innerHTML = `
                <div class="acm-modal-backdrop"></div>
                <div class="acm-modal" id="autoDemand_settings_modal">
                <div class="modal-header"><h2>Авто-проверка спроса (Паки)</h2></div>
                <div class="modal-body">
                <p style="font-size: 13px; color: #999; text-align: center; margin-bottom: 15px;">Выберите ранги, для которых будет проверяться спрос при открытии пака.</p>
                <div style="padding: 10px; border: 1px solid #c0392b; background-color: rgba(192, 57, 43, 0.15); border-radius: 5px; margin-top: 5px; margin-bottom: 20px; text-align: center;">
                    <strong style="color: #e74c3c; font-size: 13px;">Внимание:</strong>
                    <p style="color: #f1a9a2; font-size: 12px; margin: 5px 0 0 0; line-height: 1.4;">Увеличение количества проверяемых рангов может привести к временной блокировке из-за частых запросов!</p>
                </div>
                <div id="autoDemand_settings_list"></div>
                </div>
                <div class="modal-footer">
                <button id="autodemand-back-to-main" class="action-btn back-btn">Назад</button>
                <button class="action-btn save-btn autoDemand_save_settings">Сохранить</button>
                </div></div>`;
            document.body.appendChild(wrapper);
            const settingsList = wrapper.querySelector('#autoDemand_settings_list');
            checkableDemandRanks.forEach(rank => {
                settingsList.innerHTML += `<div class="setting-row"><span>Проверять спрос для ранга <b>${rank.toUpperCase()}</b></span><label class="protector-toggle-switch"><input type="checkbox" data-rank="${rank}"><span class="protector-toggle-slider"></span></label></div>`;
            });
            const closeModal = () => wrapper.remove();
            wrapper.querySelector('#autodemand-back-to-main').onclick = () => { closeModal(); unsafeWindow.openMasterSettingsModal(); };
            wrapper.querySelector('.acm-modal-backdrop').onclick = closeModal;
            wrapper.querySelector('.autoDemand_save_settings').onclick = () => {
                const newSettings = {};
                wrapper.querySelectorAll('input[type="checkbox"]').forEach(cb => { newSettings[cb.dataset.rank] = cb.checked; });
                autoDemand_saveSettings(newSettings);
                closeModal();
                if (typeof safeDLEPushCall === 'function') safeDLEPushCall('success', 'Настройки для паков сохранены!');
            };
            return wrapper;
        }
        function autoDemand_openSettingsModal() {
            const wrapper = autoDemand_createSettingsModal();
            if(!wrapper) return;
            const settings = autoDemand_loadSettings();
            wrapper.querySelectorAll('#autoDemand_settings_list input[type="checkbox"]').forEach(cb => { cb.checked = settings[cb.dataset.rank] === true; });
        }
        unsafeWindow.autoDemand_loadSettings = autoDemand_loadSettings;
        unsafeWindow.autoDemand_openSettingsModal = autoDemand_openSettingsModal;
    })();

    // #######################################################################
    // # БЛОК: Настройки авто-проверки СПРОСА (ТРЕЙДЫ)
    // #######################################################################
    (function() {
        'use strict';
        function autoDemandTrade_loadSettings() {
            return { ...defaultDemandTradeSettings, ...GM_getValue(AUTO_DEMAND_TRADE_SETTINGS_KEY, {}) };
        }
        function autoDemandTrade_saveSettings(settings) {
            GM_setValue(AUTO_DEMAND_TRADE_SETTINGS_KEY, settings);
        }
        function autoDemandTrade_createSettingsModal() {
            const MODAL_WRAPPER_ID = 'acm_modal_wrapper';
            if (document.getElementById(MODAL_WRAPPER_ID)) return;
            const wrapper = document.createElement('div');
            wrapper.id = MODAL_WRAPPER_ID;
            wrapper.innerHTML = `
                <div class="acm-modal-backdrop"></div>
                <div class="acm-modal" id="autoDemandTrade_settings_modal">
                <div class="modal-header"><h2>Авто-проверка спроса (Обмены)</h2></div>
                <div class="modal-body">
                <p style="font-size: 13px; color: #999; text-align: center; margin-bottom: 15px;">Выберите ранги, для которых будет автоматически проверяться спрос при заходе на страницу обмена.</p>
                <div style="padding: 10px; border: 1px solid #c0392b; background-color: rgba(192, 57, 43, 0.15); border-radius: 5px; margin-top: 5px; margin-bottom: 20px; text-align: center;">
                    <strong style="color: #e74c3c; font-size: 13px;">Внимание:</strong>
                    <p style="color: #f1a9a2; font-size: 12px; margin: 5px 0 0 0; line-height: 1.4;">Увеличение количества проверяемых рангов может привести к временной блокировке из-за частых запросов!</p>
                </div>
                <div id="autoDemandTrade_settings_list"></div>
                </div>
                <div class="modal-footer">
                <button id="autodemandtrade-back-to-main" class="action-btn back-btn">Назад</button>
                <button class="action-btn save-btn autoDemandTrade_save_settings">Сохранить</button>
                </div></div>`;
            document.body.appendChild(wrapper);
            const settingsList = wrapper.querySelector('#autoDemandTrade_settings_list');
            checkableDemandTradeRanks.forEach(rank => {
                settingsList.innerHTML += `<div class="setting-row"><span>Проверять спрос для ранга <b>${rank.toUpperCase()}</b></span><label class="protector-toggle-switch"><input type="checkbox" data-rank="${rank}"><span class="protector-toggle-slider"></span></label></div>`;
            });
            const closeModal = () => wrapper.remove();
            wrapper.querySelector('#autodemandtrade-back-to-main').onclick = () => { closeModal(); unsafeWindow.openMasterSettingsModal(); };
            wrapper.querySelector('.acm-modal-backdrop').onclick = closeModal;
            wrapper.querySelector('.autoDemandTrade_save_settings').onclick = () => {
                const newSettings = {};
                wrapper.querySelectorAll('input[type="checkbox"]').forEach(cb => { newSettings[cb.dataset.rank] = cb.checked; });
                autoDemandTrade_saveSettings(newSettings);
                closeModal();
                if (typeof safeDLEPushCall === 'function') safeDLEPushCall('success', 'Настройки для обменов сохранены!');
            };
            return wrapper;
        }
        function autoDemandTrade_openSettingsModal() {
            const wrapper = autoDemandTrade_createSettingsModal();
            if(!wrapper) return;
            const settings = autoDemandTrade_loadSettings();
            wrapper.querySelectorAll('#autoDemandTrade_settings_list input[type="checkbox"]').forEach(cb => { cb.checked = settings[cb.dataset.rank] === true; });
        }
        unsafeWindow.autoDemandTrade_loadSettings = autoDemandTrade_loadSettings;
        unsafeWindow.autoDemandTrade_openSettingsModal = autoDemandTrade_openSettingsModal;
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
    // # Основная логика: перехватывает клик по карте в паке...
    // #######################################################################
    async function handleCardClick(event) {
        if (isAutoSelectingCard) return;
        if (event.target.closest('.check-demand-btn, .check-duplicates-btn, .show-card-info-btn')) {
            return;
        }
        const clickedCard = event.target.closest('.lootbox__card');
        if (clickedCard) {
            isCardInPackSelected = true;
        }
        if (!clickedCard || clickedCard.dataset.confirmedClick === 'true') {
            if (clickedCard) delete clickedCard.dataset.confirmedClick;
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const cardContainer = clickedCard.closest('.lootbox__list');
        if (!cardContainer) return;
        const allCards = Array.from(cardContainer.querySelectorAll('.lootbox__card'));
        let highestRankValueInitial = 0;
        let highestRankNameInitial = '';
        allCards.forEach(card => {
            const rank = card.dataset.rank;
            const rankValue = PROTECTOR_RANK_HIERARCHY[rank] || 0;
            if (rankValue > highestRankValueInitial) {
                highestRankValueInitial = rankValue;
                highestRankNameInitial = rank;
            }
        });
        const isSuperRankPresent = (highestRankNameInitial === 's' || highestRankNameInitial === 'ass');
        if (!isSuperRankPresent) {
            const WISHLIST_PROTECTION_RANKS_KEY = 'ascm_wishlistProtectionRanks_v1';
            const defaultWishlistRanks = { ass: false, s: false, a: true, b: true, c: true, d: true, e: true };
            const wishlistProtectionRanks = await GM_getValue(WISHLIST_PROTECTION_RANKS_KEY, defaultWishlistRanks);
            const isWishlistProtectionEnabled = await GM_getValue(WISHLIST_PROTECTION_ENABLED_KEY, false);
            if (isWishlistProtectionEnabled && activeWishlistSet && activeWishlistSet.size > 0) {
                const wishlistCardsInPack = [];
                for (const card of allCards) {
                    const cardId = await unsafeWindow.getCardId(card, 'type', true);
                    if (cardId && activeWishlistSet.has(cardId)) {
                        wishlistCardsInPack.push(card);
                    }
                }
                if (wishlistCardsInPack.length > 0 && !wishlistCardsInPack.includes(clickedCard)) {
                    const isWishlistCardProtected = wishlistCardsInPack.some(wlCard =>
                        wishlistProtectionRanks[wlCard.dataset.rank] === true
                    );

                    const clickedCardRank = clickedCard.dataset.rank;
                    const isClickedCardProtected = wishlistProtectionRanks[clickedCardRank] === true;
                    if (isWishlistCardProtected && isClickedCardProtected) {
                        const message = `В паке есть карта из списка желаний!<br>Вы уверены, что хотите выбрать другую?`;
                        const confirmation = await protector_customConfirm(message);
                        if (!confirmation) return;
                    }
                }
            }
            const isOwnWishlistProtectionEnabled = await GM_getValue('ascm_ownWishlistProtectionEnabled', true);
            if (isOwnWishlistProtectionEnabled) {
                const wantedCardsInPack = allCards.filter(card => card.classList.contains('anime-cards__owned-by-user-want'));
                if (wantedCardsInPack.length > 0 && !wantedCardsInPack.includes(clickedCard)) {
                    const isWantedCardProtected = wantedCardsInPack.some(wlCard =>
                        wishlistProtectionRanks[wlCard.dataset.rank] === true
                    );
                    const clickedCardRank = clickedCard.dataset.rank;
                    const isClickedCardProtected = wishlistProtectionRanks[clickedCardRank] === true;
                    if (isWantedCardProtected && isClickedCardProtected) {
                        const message = `В паке есть карта из ВАШЕГО списка желаний!<br>Вы уверены, что хотите выбрать другую?`;
                        const confirmation = await protector_customConfirm(message);
                        if (!confirmation) return;
                    }
                }
            }
        }
        const isFreshnessProtectionEnabled = await GM_getValue(FRESHNESS_PROTECTION_ENABLED_KEY, true);
        if (isFreshnessProtectionEnabled && freshnessData) {
            const FRESHNESS_PROTECTION_RANKS_KEY = 'ascm_freshnessProtectionRanks_v1';
            const defaultFreshnessRanks = { ass: false, s: false, a: false, b: true, c: true, d: true, e: true };
            const freshnessProtectionRanks = await GM_getValue(FRESHNESS_PROTECTION_RANKS_KEY, defaultFreshnessRanks);
            const threshold = await GM_getValue(FRESHNESS_PROTECTION_THRESHOLD_KEY, 200);
            const absoluteMinId = freshnessData.get('_absoluteMinId');
            const newCardsInPack = new Set();
            for (const card of allCards) {
                const cardId = await unsafeWindow.getCardId(card, 'type', true);
                if (cardId) {
                    const ordinal = freshnessData.get(cardId.toString());
                    const isCardTrulyNew = (
                        (ordinal !== undefined && ordinal <= threshold) ||
                        (ordinal === undefined && absoluteMinId && parseInt(cardId, 10) > absoluteMinId)
                    );
                    if (isCardTrulyNew) {
                        newCardsInPack.add(card);
                    }
                }
            }
            const clickedCardRank = clickedCard.dataset.rank;
            if (newCardsInPack.size > 0 && !newCardsInPack.has(clickedCard) && clickedCardRank !== 's' && clickedCardRank !== 'ass') {
                const aNewCard = newCardsInPack.values().next().value;
                const rankOfNewCard = aNewCard.dataset.rank;
                if (freshnessProtectionRanks[rankOfNewCard]) {
                    const message = `В паке есть очень новая карта!<br>Вы уверены, что хотите выбрать другую?`;
                    const confirmation = await protector_customConfirm(message);
                    if (!confirmation) return;
                }
            }
        }
        const clickedRank = clickedCard.dataset.rank;
        const clickedRankValue = PROTECTOR_RANK_HIERARCHY[clickedRank] || 0;
        const settings = loadSettings();
        const isRankProtectionEnabled = settings[highestRankNameInitial.toLowerCase()];
        if (isRankProtectionEnabled && clickedRankValue < highestRankValueInitial) {
            const message = `В паке есть карта ранга <b>${highestRankNameInitial.toUpperCase()}</b>.<br>Вы уверены, что хотите выбрать карту ранга <b>${clickedRank.toUpperCase()}</b>?`;
            const confirmation = await protector_customConfirm(message);
            if (!confirmation) return;
        }
        clickedCard.dataset.confirmedClick = 'true';
        clickedCard.click();
    }

    // #######################################################################
    // # Создает и отображает кастомное модальное окно подтверждения.
    // #######################################################################
    function protector_customConfirm(message) {
        return new Promise(resolve => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `
                <div class="acm-modal-backdrop protector_backdrop" style="z-index: 2147483647 !important;"></div>
                <div class="acm-modal" id="protector_confirm_modal" style="z-index: 2147483648 !important;">
                <div class="modal-header"><h2>Подтверждение</h2></div>
                <div class="modal-body"><p>${message}</p></div>
                <div class="modal-footer">
                <button class="action-btn protector_confirm_yes">Да</button>
                <button class="action-btn protector_confirm_no">Нет</button>
                </div>
                </div>`;
            document.body.appendChild(wrapper);
            const cleanup = () => wrapper.remove();
            wrapper.querySelector('.protector_confirm_yes').onclick = () => { cleanup(); resolve(true); };
            wrapper.querySelector('.protector_confirm_no').onclick = () => { cleanup(); resolve(false); };
            wrapper.querySelector('.protector_backdrop').onclick = () => { cleanup(); resolve(false); };
        });
    }
    window.protector_customConfirm = protector_customConfirm;


    // #######################################################################
    // # Создает HTML-структуру для модального окна настроек защиты.
    // #######################################################################
    function protector_createSettingsModal() {
        const MODAL_WRAPPER_ID = 'acm_modal_wrapper';
        if (document.getElementById(MODAL_WRAPPER_ID)) return null;
        const wrapper = document.createElement('div');
        wrapper.id = MODAL_WRAPPER_ID;
        wrapper.innerHTML = `
            <div class="acm-modal-backdrop"></div>
            <div class="acm-modal" id="protector_settings_modal">
            <div class="modal-header">
            <h2>Защита карт</h2>
            </div>
            <div class="modal-body">
            <p style="font-size: 13px; color: #999; text-align: center; margin-bottom: 15px;">Выберите ранги, при наличии которых в паке будет появляться предупреждение, если вы попытаетесь выбрать карту меньшего ранга.</p>
            <div id="protector_settings_list"></div>
            </div>
            <div class="modal-footer">
            <button id="protector-back-to-main" class="action-btn back-btn">Назад</button>
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
        const closeModal = () => wrapper.remove();
        wrapper.querySelector('#protector-back-to-main').onclick = () => {
            closeModal();
            unsafeWindow.openMasterSettingsModal();
        };
        wrapper.querySelector('.acm-modal-backdrop').onclick = closeModal;
        wrapper.querySelector('.protector_save_settings').onclick = () => {
            const newSettings = {};
            wrapper.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                newSettings[cb.dataset.rank] = cb.checked;
            });
            saveSettings(newSettings);
            closeModal();
            unsafeWindow.safeDLEPushCall('success', 'Настройки защиты карт успешно сохранены!');
        };
        return wrapper;
    }

    // #######################################################################
    // # Открывает модальное окно настроек защиты и заполняет его текущими значениями.
    // #######################################################################
    function protector_openSettingsModal() {
        const wrapper = protector_createSettingsModal();
        if (!wrapper) return;

        const settings = loadSettings();
        wrapper.querySelectorAll('#protector_settings_list input[type="checkbox"]').forEach(cb => {
            cb.checked = settings[cb.dataset.rank] === true;
        });
    }
    unsafeWindow.protector_openSettingsModal = protector_openSettingsModal;

    // #######################################################################
    // # Инициализирует модуль защиты карт.
    // #######################################################################
    function initProtectorModule() {
        if (window.location.pathname === '/cards/pack/') {
            document.body.addEventListener('click', handleCardClick, true);
        }
    }
    initProtectorModule();
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof unsafeWindow.getButton === 'function' && typeof unsafeWindow.safeDLEPushCall === 'function') {
            initTurboBoosterModule(unsafeWindow.getButton, unsafeWindow.safeDLEPushCall);
        } else {
            setTimeout(() => {
                if (typeof getButton === 'function' && typeof safeDLEPushCall === 'function') {
                } else {
                    console.error('[TurboBooster] Не удалось получить доступ к функциям getButton и safeDLEPushCall.');
                }
            }, 500);
        }
    });


    // #######################################################################
    // # МОДУЛЬ: AS Club Turbo-Booster
    // #######################################################################
    function initTurboBoosterModule(getButtonFunc, notifyFunc) {
        if (!window.location.pathname.includes('/clubs/boost/')) {
            return;
        }
        const clickInterval = 15; // ИНТЕРВАЛ КЛИКОВ в миллисекундах. 25 мс = 40 кликов в секунду. Не ставьте ниже 20.
        const gracePeriodDuration = 120000; // 120000 мс = 1 минута для грейс-периода.
        let isBoosterActive = GM_getValue('boosterState', false);
        let clickerIntervalId = null;
        let controlButton = null;
        let isInGracePeriod = false;
        let gracePeriodTimeoutId = null;
        // #######################################################################
        // #######################################################################
        function updateButtonState() {
            if (!controlButton) return;
            if (isBoosterActive) {
                controlButton.title = 'ТУРБО-ВКЛАД: ВКЛ (Нажмите, чтобы выключить)';
                controlButton.style.background = 'linear-gradient(145deg, #4CAF50, #388E3C)';
            } else {
                controlButton.title = 'ТУРБО-ВКЛАД: ВЫКЛ (Нажмите, чтобы включить)';
                controlButton.style.background = 'linear-gradient(145deg, rgb(166, 100, 110), rgb(222, 0, 5))';
            }
        }
        // #######################################################################
        // #######################################################################
        function toggleBooster() {
            isBoosterActive = !isBoosterActive;
            GM_setValue('boosterState', isBoosterActive);
            updateButtonState();
            if (isBoosterActive) {
                notifyFunc('stickySuccess', 'Турбо-вклад ВКЛЮЧЕН\n(если лимит не сбросится в течение 2 минут, он остановится)');
                startClicker();
            } else {
                notifyFunc('info', 'Турбо-вклад ВЫКЛЮЧЕН.');
                stopClicker();
            }
        }
        // #######################################################################
        // #######################################################################
        function startClicker() {
            if (clickerIntervalId) return;
            console.log(`[AS Turbo-Booster] Запущен с интервалом ${clickInterval} мс.`);
            isInGracePeriod = true;
            console.log(`[AS Turbo-Booster] Активирован ${gracePeriodDuration / 1000}-секундный грейс-период. Кликер будет работать даже при достигнутом лимите.`);
            gracePeriodTimeoutId = setTimeout(() => {
                isInGracePeriod = false;
                gracePeriodTimeoutId = null;
                console.log('[AS Turbo-Booster] Грейс-период завершен. Теперь кликер будет останавливаться при достижении лимита.');
            }, gracePeriodDuration);

            clickerIntervalId = setInterval(performClick, clickInterval);
        }
        // #######################################################################
        // #######################################################################
        function stopClicker() {
            if (!clickerIntervalId) return;
            clearInterval(clickerIntervalId);
            clickerIntervalId = null;
            if (gracePeriodTimeoutId) {
                clearTimeout(gracePeriodTimeoutId);
                gracePeriodTimeoutId = null;
            }
            isInGracePeriod = false;
            console.log('[AS Turbo-Booster] Остановлен.');
        }
        // #######################################################################
        // #######################################################################
        function performClick() {
            const limitElement = document.querySelector('.boost-limit');
            if (limitElement && limitElement.parentElement) {
                const fullText = limitElement.parentElement.textContent;
                const match = fullText.match(/(\d+)\s*\/\s*(\d+)/);
                if (match) {
                    const current = parseInt(match[1], 10);
                    const max = parseInt(match[2], 10);
                    if (isInGracePeriod && current < max) {
                        console.log('[AS Turbo-Booster] Обнаружен сброс лимита. Грейс-период отменен досрочно.');
                        isInGracePeriod = false;
                        if (gracePeriodTimeoutId) {
                            clearTimeout(gracePeriodTimeoutId);
                            gracePeriodTimeoutId = null;
                        }
                    }
                    if (current >= max && !isInGracePeriod) {
                        console.log('[AS Turbo-Booster] Дневной лимит достигнут (вне грейс-периода). Автоматическая остановка.');
                        notifyFunc('warning', 'Лимит вклада не сбросился. Бустер остановлен.');
                        isBoosterActive = false;
                        GM_setValue('boosterState', false);
                        updateButtonState();
                        stopClicker();
                        return;
                    }
                }
            }
            const donateButton = document.querySelector('.club__boost-btn');
            const refreshButton = document.querySelector('.club__boost__refresh-btn');
            if (donateButton && donateButton.offsetParent !== null) {
                donateButton.click();
                return;
            }
            if (refreshButton && refreshButton.offsetParent !== null) {
                refreshButton.click();
                return;
            }
        }
        controlButton = getButtonFunc(
            'turboBoosterBtn',
            'bolt',
            460,
            'ТУРБО-ВКЛАД',
            toggleBooster
        );
        document.body.appendChild(controlButton);
        updateButtonState();
        if (isBoosterActive) {
            startClicker();
        }
    }

    // ##############################################################################################################################################
    // # БЛОК: AnimeStars Super Card Collector
    // ##############################################################################################################################################
    function initializeSuperCardCollectorModule(dbGet, dbSet, dbDelete) {
        'use strict';
        let isMassDemandChecking = false;
        let isPausedByAnotherTab = false;
        let sccDemandFetchingIsInProgress = false;
        let sccDemandStatusTimeoutId = null;
        let sccDemandFetchingShouldStop = false;
        let isDemandFetchPaused = false;
        let totalDemandToFetch = 0;
        let demandFetchedCount = 0;
        const CURRENT_DOMAIN = window.location.origin;
        const FETCH_DELAY = 1200;
        const CARDS_PER_PAGE = 196;
        const DEFAULT_USERS = [];
        let allCardsData = [];
        let isFetching = false;
        let shouldStopFetching = false;
        let currentSort;
        let selectedUserFilter = null;
        let currentPage = 1;
        let currentProfileName;
        let deckStatsMap = new Map();
        (async () => {
            currentSort = await dbGet('scc_settings', 'sort') || { key: 'date', direction: 'asc' };
            currentProfileName = await dbGet('scc_settings', 'last_profile') || 'Default';
        })();
        const ICONS = {
            locked: '<i class="fas fa-lock" style="color: #ff4d4d;" title="Заблокирована"></i>',
            inTrade: '<i class="fas fa-exchange-alt" style="color: #4d94ff;" title="В обмене"></i>',
            inDeck: '<i class="fas fa-trophy" style="color: #ffd700;" title="В колоде"></i>',
            starred: '<i class="fas fa-star" style="color: #ffd700;" title="Есть звезды"></i>',
            hasStars: (count) => `<span style="color: #f7d000; font-weight: bold; text-shadow: 1px 1px 2px black;" title="Звезд: ${count}">${count} <i class="fas fa-star"></i></span>`,
        };

        // #######################################################################
        // #######################################################################
        async function saveCurrentProfileName(name) { await dbSet('scc_settings', 'last_profile', name); }
        function initializeMinimalUI() {
            GM_addStyle(`
                    #ca-demand-sort-status {
                  font-size: 0.8em;
                  color: #a0b3c1;
                  text-align: center;
                  margin-top: 5px;
                  display: none; /* Скрыт по умолчанию */
                }
                #ca-page-selector:hover {
                    background-color: var(--btn-hover);
                }
                :root {
                --main-bg: #2c2f33; --panel-bg: #23272a; --header-bg: #1e2124;
                --accent-color: #9e294f; --accent-hover: #7a1f3d; --btn-bg: #40444b;
                --btn-hover: #52575e; --btn-active: var(--accent-color); --text-color: #dcddde;
                --border-color: #4f545c; /* --card-width: 152px; - ЭТА СТРОКА УДАЛЕНА */
                }
                #card-aggregator-toggle-btn {
                position: fixed;
                bottom: 90px;
                right: 12px;
                z-index: 102;
                width: 40px;
                height: 40px;
                background: linear-gradient(145deg, #4D2D79, #2C1E4A);
                color: white;
                border: 1px solid #6A4A9C;
                border-radius: 50%;
                transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.3s ease;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                font-size: 14px;
                }
                #ca-main-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.85);
                z-index: 999;
                display: none;
                }
                #card-aggregator-container {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 90vw; height: 90vh; max-width: 1450px;
                background-color: var(--main-bg); border: 2px solid var(--accent-color);
                border-radius: 10px;
                z-index: 1000;
                display: none;
                flex-direction: row;
                color: var(--text-color);
                box-shadow: 0 5px 20px rgba(0,0,0,0.5);
                }
                #card-aggregator-container.visible { display: flex; }
                #ca-left-panel {
                flex: 0 0 260px; background-color: var(--panel-bg); padding: 15px;
                display: flex; flex-direction: column; gap: 2px; overflow-y: auto;
                border-right: 1px solid var(--border-color);
                transition: all 0.3s ease-in-out;
                position: relative;
                }
                #ca-right-panel { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; }
                /* --- СТИЛИ ДЛЯ СВОРАЧИВАНИЯ ПАНЕЛИ --- */
                #ca-toggle-panel-btn {
                display: none; /* Скрыта по умолчанию */
                background: var(--btn-bg);
                color: var(--text-color);
                border: 1px solid var(--border-color);
                border-radius: 5px;
                cursor: pointer;
                width: 38px;
                height: 38px;
                font-size: 16px;
                align-items: center;
                justify-content: center;
                }
                #ca-pagination-controls {
                    padding: 10px 60px 10px 15px; /* Увеличиваем отступ справа до 60px */
                    background-color: var(--header-bg);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: nowrap;
                    position: relative;
                    box-sizing: border-box; /* Важно, чтобы padding не увеличивал общую ширину */
                }
                #ca-page-selector {
                    background-color: var(--main-bg);
                    border: 1px solid var(--border-color);
                    color: var(--text-color);
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 0.9em;
                    height: 32px;
                    max-width: 60px;
                    min-width: 40px;
                    text-align: center;
                    text-align-last: center;
                    font-weight: bold;

                    /* Убираем стандартную стрелку браузера */
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;

                    /* Добавляем свою стрелку как фоновое изображение и позиционируем ее справа */
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23dcddde' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 8px center; /* Позиция: 8px от правого края, по центру по вертикали */
                    background-size: 10px; /* Размер стрелки */

                    /* Добавляем отступ справа, чтобы текст не наезжал на нашу новую стрелку */
                    padding: 5px 25px 5px 5px;
                }
                #ca-page-selector option {
                    background-color: var(--main-bg); /* Темный фон для каждой опции */
                    color: var(--text-color); /* Светлый цвет текста */
                    text-align: center;
                    -moz-text-align-last: center; /* Для Firefox */
                    font-weight: bold;
                }

                /* Стиль для опции при наведении курсора */
                #ca-page-selector option:hover {
                     background-color: var(--btn-hover);
                }

                /* Стиль для выбранной в данный момент опции (заменяет синий цвет по умолчанию) */
                #ca-page-selector option:checked {
                    background-color: var(--accent-color);
                    color: white;
                }
                @media (max-width: 800px) {
                    #ca-left-panel {
                        position: absolute;
                        left: 0;
                        top: 0;
                        height: 100%;
                        z-index: 15; /* Левая панель выше кнопок */
                        transform: translateX(-100%);
                        transition: transform 0.3s ease-in-out;
                    }
                    #ca-left-panel.visible {
                        transform: translateX(0);
                        box-shadow: 5px 0 15px rgba(0,0,0,0.5);
                    }
                    #ca-toggle-panel-btn {
                        display: flex; /* Показываем кнопку на мобильных */
                        position: absolute; /* Позиционируем относительно #ca-pagination-controls */
                        left: 15px;
                        top: 50%;
                        transform: translateY(-50%);
                        z-index: 16; /* Кнопка ДОЛЖНА БЫТЬ ВЫШЕ выезжающей панели */
                    }
                    /* --- НОВЫЙ БЛОК ДЛЯ ИСПРАВЛЕНИЯ ПЕРЕКРЫТИЯ --- */
                    .ca-page-numbers-wrapper {
                        padding-left: 60px; /* Создаем "безопасную зону" слева, равную ширине кнопки + отступы */
                    }
                }
                /* highlight-start */
                .ca-page-numbers-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px; /* Немного увеличим отступ для красоты */
                    flex-grow: 1; /* Позволяем блоку занимать доступное место */
                    min-width: 0; /* Важное правило для flex-элементов */
                }
                /* highlight-end */
                .ca-panel-section h3 {
                color: var(--accent-color); margin-top: 0; margin-bottom: 10px; padding-bottom: 5px;
                border-bottom: 1px solid var(--border-color); cursor: default;
                }
                #ca-users-header { cursor: pointer; }
                .ca-panel-section button:not(.toggle-user-visibility-btn):not(.delete-user-btn), .ca-panel-section input {
                width: 100%; padding: 10px; border-radius: 5px; border: 1px solid var(--border-color);
                background-color: var(--btn-bg); color: var(--text-color); margin-bottom: 8px; box-sizing: border-box;
                }
                .ca-panel-section button { cursor: pointer; transition: background-color 0.2s; }
                .ca-panel-section button:hover { background-color: var(--btn-hover); }
                .ca-panel-section button.active:not(.toggle-user-visibility-btn):not(.delete-user-btn), .ca-panel-section button.sort-active:not(.toggle-user-visibility-btn):not(.delete-user-btn) { background-color: var(--btn-active); border-color: var(--accent-hover); }
                #ca-users-list .user-item {
                display: flex; align-items: center; background-color: var(--btn-bg);
                padding: 8px; border-radius: 5px; margin-bottom: 5px; transition: background-color 0.2s;
                }
                #ca-users-list .user-item:hover { background-color: var(--btn-hover); }
                #ca-users-list .user-item.selected { background-color: var(--accent-color); }
                #ca-users-list .user-item span {
                flex: 1; min-width: 0; cursor: pointer; padding: 0 8px;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .toggle-user-visibility-btn {
                background: none; border: none; cursor: pointer; font-size: 1em;
                padding: 0; margin: 0; flex-shrink: 0;
                width: 22px; height: 22px; line-height: 22px; text-align: center;
                transition: color 0.2s, transform 0.2s;
                }
                .toggle-user-visibility-btn:hover { transform: scale(1.1); }
                .toggle-user-visibility-btn.included {
                color: #4caf50;
                }
                .toggle-user-visibility-btn.excluded {
                color: #f44336;
                }
                #ca-users-list .user-item .delete-user-btn {
                background: transparent; border: 1px solid #ff6b6b; color: #ff6b6b; padding: 0; margin: 0;
                font-size: 1em; cursor: pointer; width: 22px; height: 22px; line-height: 22px;
                border-radius: 50%; flex-shrink: 0; transition: all 0.2s;
                }
                #ca-users-list .user-item .delete-user-btn:hover { background-color: #ff6b6b; color: white; }
                #ca-right-panel { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; }
                .ca-header {
                padding: 10px 15px; background-color: var(--header-bg);
                display: flex; justify-content: space-between; align-items: center;
                }
                .ca-header h2 { margin: 0; font-size: 1.2em; }
                .ca-close-btn {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.2s ease-in-out;
                color: #CD5C5C;
                background-color: transparent;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                }
                .ca-close-btn:hover {
                color: #DC143C;
                background-color: rgba(255, 255, 255, 0.1);
                transform: rotate(90deg);
                }
                .ca-status-bar { padding: 8px 15px; font-size: 0.9em; background-color: var(--panel-bg); }
                .ca-card-grid { flex-grow: 1; overflow-y: auto; padding: 15px; display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; align-content: flex-start; }
                .ca-card-wrapper { display: flex; flex-direction: column; }
                .ca-card-item { position: relative; cursor: pointer; border-radius: 8px; overflow: hidden; background-color: #202225; transition: transform 0.2s ease-in-out; }
                .ca-card-item::before { content: ""; display: block; padding-top: 150%; }
                .ca-card-item:hover { transform: scale(1.05); box-shadow: 0 0 10px var(--accent-color); }
                .ca-card-item img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
                .ca-card-statuses { position: absolute; top: 5px; right: 5px; display: flex; flex-direction: column; align-items: flex-end; gap: 5px; text-shadow: 1px 1px 3px black; z-index: 3; }
                .ca-card-owner { padding: 6px; text-align: center; font-size: 0.9em; background-color: var(--panel-bg); border-radius: 0 0 8px 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .ca-card-overlay-icon {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center;
                pointer-events: none; z-index: 2; background-color: rgba(0,0,0,0.2);
                }
                .ca-card-overlay-icon i { font-size: 60px; text-shadow: 0 0 10px rgba(0,0,0,0.9), 0 0 5px rgba(0,0,0,0.9); opacity: 0.9; }
                .ca-card-duplicates {
                position: absolute; top: 5px; right: 5px; /* Изменили bottom на top */ background: rgba(210, 40, 40, 0.85);
                color: white; padding: 2px 6px; border-radius: 5px; font-size: 0.85em; font-weight: bold; z-index: 3;
                border: 1px solid rgba(255,255,255,0.3); text-shadow: 1px 1px 2px black;
                }
                .ca-card-demand-stats span { padding: 0 3px; }
                .ca-card-demand-stats .fa-users { color: #54A8EE; }
                .ca-card-demand-stats .fa-shopping-cart { color: #43b581; }
                .ca-card-demand-stats .fa-sync-alt { color: #FAA61A; }
                .ca-check-demand-btn {
                position: absolute; bottom: 5px; right: 5px; z-index: 4;
                background: rgba(0, 123, 255, 0.7); color: white;
                border: 1px solid rgba(0, 80, 170, 0.9); border-radius: 50%;
                width: 22px; height: 22px; font-size: 10px; cursor: pointer;
                transition: all 0.2s; display: flex; align-items: center;
                justify-content: center; opacity: 0.8;
                }
                .ca-card-item:hover .ca-check-demand-btn { opacity: 1; }
                .ca-check-demand-btn:hover { background: rgba(0, 100, 220, 0.9); }
                #ca-rank-selector { display: flex; gap: 8px; justify-content: space-between; }
                #ca-rank-selector .rank-toggle-btn { flex: 1; margin-bottom: 0; }
                #ca-rank-filter-container { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
                .rank-filter-btn {
                background-color: var(--btn-bg); border: 1px solid var(--border-color); color: var(--text-color);
                padding: 10px; border-radius: 5px; cursor: pointer; font-size: 0.9em;
                transition: background-color 0.2s, border-color 0.2s; margin: 0; width: 100%; box-sizing: border-box;
                }
                .rank-filter-btn:hover { background-color: var(--btn-hover); }
                .rank-filter-btn.active { background-color: var(--accent-color); border-color: var(--accent-hover); color: white; }
                #ca-mass-demand-btn {
                position: absolute;
                bottom: 10px;
                right: 10px;
                z-index: 10;
                width: 40px;
                height: 40px;
                background: linear-gradient(145deg, rgb(166, 100, 110), rgb(222, 0, 5));
                border: none;
                border-radius: 50%;
                transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.3s ease;
                color: black;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                }
                #ca-mass-demand-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                }
                #ca-mass-demand-btn .ca-btn-icon {
                font-size: 14px;
                }
                #ca-pagination-controls #ca-mass-demand-btn:hover:not(:disabled) { background-color: var(--btn-hover); }
                #ca-pagination-controls #ca-mass-demand-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                #ca-pagination-controls #ca-mass-demand-btn .fa-stop { color: #f44336; }
                .ca-page-btn {
                background-color: var(--btn-bg); border: 1px solid var(--border-color); color: var(--text-color);
                padding: 5px 10px; min-width: 35px; text-align: center;
                border-radius: 5px; cursor: pointer; transition: background-color 0.2s;
                }
                .ca-page-btn:hover:not(:disabled) { background-color: var(--btn-hover); }
                .ca-page-btn.active {
                background-color: var(--accent-color); border-color: var(--accent-hover);
                color: white; cursor: default;
                }
                .ca-page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .ca-page-ellipsis { padding: 5px 0; color: var(--text-color); }
                #ca-profile-controls {
                display: grid;
                grid-template-columns: 1fr; /* Изменено для одного элемента во всю ширину */
                gap: 8px;
                align-items: center;
                margin-bottom: 8px;
                }
                #ca-profile-selector {
                width: 100%;
                padding: 8px 10px;
                border-radius: 5px;
                border: 1px solid var(--border-color);
                background-color: var(--btn-bg);
                color: var(--text-color);
                box-sizing: border-box;
                height: 40px;
                }
                #ca-profile-actions { display: flex; gap: 8px; }
                #ca-profile-actions button { margin: 0; padding: 10px; flex: 1; }
                /* --- СТИЛИ ДЛЯ ПЛАВНОЙ СМЕНЫ КАРТОЧЕК --- */
                        .ca-card-wrapper {
                    transition: opacity 300ms ease-out;
                }
                .ca-card-fade-out {
                    opacity: 0;
                    pointer-events: none;
                }
                `);
            const toggleButton = document.createElement('button');
            toggleButton.id = 'card-aggregator-toggle-btn';
            toggleButton.innerHTML = '<i class="fas fa-layer-group"></i>';
            toggleButton.title = "Сборщик Карт";
            toggleButton.onclick = toggleMainContainer;
            document.body.appendChild(toggleButton);
            if (!document.getElementById('ca-fscr-styles')) {
                const style = document.createElement('style');
                style.id = 'ca-fscr-styles';
                style.textContent = `body.fscr-active #card-aggregator-toggle-btn { display: none !important; }`;
                document.head.appendChild(style);
            }
        }

        // #######################################################################
        // #######################################################################
        async function ensureDemandData(filteredCards) {
            if (sccDemandStatusTimeoutId) clearTimeout(sccDemandStatusTimeoutId);
            sccDemandFetchingIsInProgress = true;
            sccDemandFetchingShouldStop = false;
            isDemandFetchPaused = false;
            updateRocketButtonUI('running');
            const demandStatusEl = document.getElementById('ca-demand-sort-status');
            const cardsToFetch = filteredCards.filter(card => typeof card.needCount === 'undefined');
            let isPausedByAnotherTab = false;
            try {
                if (cardsToFetch.length === 0) {
                    liveSortAndRedraw(filteredCards);
                    return;
                }
                if (demandStatusEl) demandStatusEl.style.display = 'block';
                for (let i = 0; i < cardsToFetch.length; i++) {
                    while(true) {
                        const tasks = await GM_getValue(DEMAND_TASK_STACK_KEY, []);
                        const activeTask = tasks[0];
                        if (activeTask && activeTask.tabId === unsafeWindow.tabIdWatch) {
                            if (isPausedByAnotherTab) {
                                isPausedByAnotherTab = false;
                                updateRocketButtonUI('running');
                            }
                            break;
                        } else {
                            if (!isPausedByAnotherTab) {
                                isPausedByAnotherTab = true;
                                demandStatusEl.textContent = 'Пауза (другая вкладка)...';
                                updateRocketButtonUI('paused');
                            }
                            await sleep(2000);
                        }
                    }
                    if (sccDemandFetchingShouldStop || currentSort.key !== 'demand') {
                        if (demandStatusEl) demandStatusEl.textContent = "Отменено.";
                        break;
                    }
                    while (isDemandFetchPaused && !sccDemandFetchingShouldStop) {
                        await sleep(500);
                        if (sccDemandFetchingShouldStop || currentSort.key !== 'demand') break;
                    }
                    if (sccDemandFetchingShouldStop || currentSort.key !== 'demand') break;

                    const card = cardsToFetch[i];
                    if (demandStatusEl) demandStatusEl.textContent = `Осталось: ${i + 1}/${cardsToFetch.length}...`;

                    const isCached = await unsafeWindow.getCache('cardId: ' + card.id);
                    if (!isCached) { await sleep(1900); }
                    if (sccDemandFetchingShouldStop || currentSort.key !== 'demand') break;
                    const demandData = await unsafeWindow.loadCard(card.id);
                    card.needCount = demandData?.needCount ?? 0;
                    card.tradeCount = demandData?.tradeCount ?? 0;
                    card.popularityCount = demandData?.popularityCount ?? 0;

                    liveSortAndRedraw(filteredCards);
                }
            } finally {
                sccDemandFetchingIsInProgress = false;
                updateRocketButtonUI('idle');
                if (demandStatusEl) {
                    if (!sccDemandFetchingShouldStop && currentSort.key === 'demand') {
                        demandStatusEl.textContent = "Завершено.";
                    }
                    sccDemandStatusTimeoutId = setTimeout(() => {
                        if (demandStatusEl) {
                            demandStatusEl.style.display = 'none';
                            demandStatusEl.textContent = '';
                        }
                    }, 1500);
                }
            }
        }

        // #######################################################################
        // #######################################################################
        function updateRocketButtonUI(state) {
            const btn = document.getElementById('ca-mass-demand-btn');
            if (!btn) return;
            const icon = btn.querySelector('.ca-btn-icon');

            switch (state) {
                case 'running':
                    btn.title = 'Поставить на паузу проверку спроса';
                    btn.style.background = 'linear-gradient(145deg, rgb(50, 200, 50), rgb(0, 150, 0))';
                    icon.className = 'ca-btn-icon fas fa-pause';
                    break;
                case 'paused':
                    btn.title = 'Возобновить проверку спроса';
                    btn.style.background = 'linear-gradient(145deg, #e67e22, #d35400)';
                    icon.className = 'ca-btn-icon fas fa-play';
                    break;
                case 'idle':
                default:
                    btn.title = 'Проверить спрос (видимые)';
                    btn.style.background = 'linear-gradient(145deg, rgb(166, 100, 110), rgb(222, 0, 5))';
                    icon.className = 'ca-btn-icon fal fa-rocket';
                    break;
            }
        }

        // #######################################################################
        // #######################################################################
        async function handleRocketButtonClick() {
            if (sccDemandFetchingIsInProgress) {
                isDemandFetchPaused = !isDemandFetchPaused;
                if (isDemandFetchPaused) {
                    updateRocketButtonUI('paused');
                    document.getElementById('ca-demand-sort-status').textContent = 'Пауза...';
                } else {
                    updateRocketButtonUI('running');
                }
            } else {
                await startMassDemandCheck();
            }
        }

        // #######################################################################
        // #######################################################################
        async function buildMainUI() {
            const overlay = document.createElement('div');
            overlay.id = 'ca-main-overlay';
            document.body.appendChild(overlay);
            const container = document.createElement('div');
            container.id = 'card-aggregator-container';
            container.innerHTML = `
                <div id="ca-left-panel">
                 <div class="ca-panel-section">
                <h3>Профили</h3>
                <select id="ca-profile-selector"></select>
                 <div id="ca-profile-controls" style="margin-top: 8px;">
                <input type="text" id="ca-new-profile-name" placeholder="Имя нового профиля" style="margin: 0;">
                </div>
                <div id="ca-profile-actions">
                <button id="ca-create-profile-btn" title="Создать профиль с текущими настройками">Создать</button>
                <button id="ca-delete-profile-btn" title="Удалить выбранный профиль">Удалить</button>
                </div>
                <div id="ca-profile-import-export" style="display: flex; gap: 8px; margin-top: 8px;">
                     <button id="ca-export-profile-btn" title="Экспорт текущего профиля (настройки + кеш карт)" style="flex: 1;">Экспорт</button>
                     <button id="ca-import-profile-btn" title="Импорт профиля из файла" style="flex: 1;">Импорт</button>
                     <input type="file" id="ca-import-file-input" style="display: none;" accept=".json">
                </div>
                 </div>
                <div class="ca-panel-section">
                <h3>Сортировка</h3>
                <button class="sort-btn" data-sort="date">По дате получения</button>
                <button class="sort-btn" data-sort="name">По названию карты</button>
                <button class="sort-btn" data-sort="anime">По названию аниме</button>
                <button class="sort-btn" data-sort="owner">По пользователю</button>
                <button class="sort-btn" data-sort="demand">По спросу (хотят)</button>
                <div id="ca-demand-sort-status"></div>
                </div>
                <div class="ca-panel-section">
                <h3>Фильтр</h3>
                <input type="text" id="ca-search-input" placeholder="Поиск...">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <button class="filter-btn" data-filter="closed" data-exclusive-group="access">Закрытые</button>
                <button class="filter-btn" data-filter="open" data-exclusive-group="access">Открытые</button>
                <button class="filter-btn" data-filter="with_stars" data-exclusive-group="stars">Со звёздами</button>
                <button class="filter-btn" data-filter="no_stars" data-exclusive-group="stars">Без звёзд</button>
                </div>
                <button class="filter-btn" data-filter="trade">В трейде</button>
                <button class="filter-btn" data-filter="duplicates">Дубликаты</button>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
                    <button class="filter-btn" data-filter="no_s" data-exclusive-group="s-rank">Без S</button>
                    <button class="filter-btn" data-filter="one_s" data-exclusive-group="s-rank">С одной S</button>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 8px;">
                    <button class="filter-btn" data-filter="wishlist" style="flex: 1; margin: 0;"><i class="fas fa-heart" style="color: #ffeb3b;"></i> Сканер желаний</button>
                    <button id="ca-open-wishlist-settings" title="Настройки сканера желаний" style="flex: 0 0 auto; width: 40px; padding: 10px; margin: 0; background-color: var(--btn-bg); border: 1px solid var(--border-color); color: var(--text-color); border-radius: 5px; cursor: pointer;"><i class="fas fa-cog"></i></button>
                </div>
                <div style="margin-top: 15px; border-top: 1px solid var(--border-color); padding-top: 15px;">
                <div id="ca-rank-filter-container">
                <button class="rank-filter-btn" data-rank="ass">ASS</button>
                <button class="rank-filter-btn" data-rank="s">S</button>
                <button class="rank-filter-btn" data-rank="a">A</button>
                </div>
                </div>
                </div>
                <div class="ca-panel-section">
                <h3>Управление</h3>
                <button id="ca-refresh-btn"><i class="fas fa-sync-alt"></i> Обновить данные</button>
                <div id="ca-fetch-status" style="font-size:0.8em; text-align:center; margin-top:8px;">Готов.</div>
                <div id="ca-rank-selector-container" style="margin-top: 10px;">
                <span style="font-size: 0.9em; margin-bottom: 5px; display: block;">Собирать ранги:</span>
                <div id="ca-rank-selector">
                <button class="rank-toggle-btn" data-rank="ass">ASS</button>
                <button class="rank-toggle-btn" data-rank="s">S</button>
                <button class="rank-toggle-btn" data-rank="a">A</button>
                </div>
                </div>
                </div>
                <div class="ca-panel-section"><h3 id="ca-users-header">Пользователи</h3><div id="ca-users-list"></div><input type="text" id="ca-new-user-input" placeholder="Никнейм нового пользователя"><button id="ca-add-user-btn">Добавить</button></div>
                <div class="ca-panel-section">
                    <button id="ca-clear-profile-cache-btn" title="Удалить все сохраненные карты для текущего профиля" style="background-color: #d65a28; width: 100%;">
                        <i class="fas fa-trash-alt"></i> Удалить карты профиля
                    </button>
                </div>
                </div>
                <div id="ca-right-panel">
                    <div class="ca-header"><h2>Сборщик Карт</h2><span class="ca-close-btn"><i class="fas fa-times"></i></span></div>
                    <div class="ca-status-bar"><span id="ca-card-counter">Всего карт: 0 | Найдено: 0 | Показано: 0</span></div>
                    <div class="ca-card-grid"></div>
                    <button id="ca-mass-demand-btn" title="Проверить спрос (видимые)">
                    <span class="ca-btn-icon fal fa-rocket"></span>
                    </button>
                    <div id="ca-pagination-controls">
                        <button id="ca-toggle-panel-btn"><i class="fas fa-bars"></i></button>
                        <div class="ca-page-numbers-wrapper"></div>
                    </div>
                </div>`;
            document.body.appendChild(container);
            setupEventListeners();
            updateSortButtonsUI();
            await renderUsersList();
            await loadAndApplySavedFilters();
            await updateRankButtonsUI();
            await updateRankFilterButtonsUI();
            await renderProfileSelector();
            await tryLoadFromCache();
        }

        // #######################################################################
        // Новая функция для экспорта
        // #######################################################################
        async function exportProfile() {
            try {
                const profiles = await getProfiles();
                const profileSettings = profiles[currentProfileName];
                if (!profileSettings) {
                    alert('Текущий профиль не найден для экспорта.');
                    return;
                }
                const cardCache = await dbGet('scc_card_cache', currentProfileName) || [];
                const exportData = {
                    profileName: currentProfileName,
                    profileSettings,
                    cardCache
                };
                const jsonString = JSON.stringify(exportData, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `SCC_Profile_${currentProfileName}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                alert(`Профиль "${currentProfileName}" успешно экспортирован!`);
            } catch (error) {
                console.error('Ошибка экспорта профиля:', error);
                alert('Произошла ошибка при экспорте профиля.');
            }
        }

        // #######################################################################
        // Новая функция для импорта (обработчик выбора файла)
        // #######################################################################
        function handleProfileImport(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    if (!importData.profileName || !importData.profileSettings || !importData.cardCache) {
                        throw new Error('Неверный формат файла профиля.');
                    }
                    let newProfileName = prompt(`Файл содержит профиль "${importData.profileName}".\nВведите новое имя для импортируемого профиля или оставьте пустым, чтобы использовать старое.`, importData.profileName);
                    if (newProfileName === null) return;
                    newProfileName = newProfileName.trim() || importData.profileName;

                    const profiles = await getProfiles();
                    if (profiles[newProfileName]) {
                        const overwrite = confirm(`Профиль "${newProfileName}" уже существует. Перезаписать его?`);
                        if (!overwrite) return;
                    }
                    profiles[newProfileName] = importData.profileSettings;
                    await saveProfiles(profiles);
                    await dbSet('scc_card_cache', newProfileName, importData.cardCache);
                    currentProfileName = newProfileName;
                    await saveCurrentProfileName(currentProfileName);
                    await renderProfileSelector();
                    await loadProfile();
                    alert(`Профиль "${newProfileName}" успешно импортирован!`);
                } catch (error) {
                    console.error('Ошибка импорта профиля:', error);
                    alert(`Ошибка импорта: ${error.message}`);
                } finally {
                    event.target.value = '';
                }
            };
            reader.readAsText(file);
        }

        // #######################################################################
        // #######################################################################
        async function toggleMainContainer() {
            const container = document.getElementById('card-aggregator-container');
            if (container) {
                if (isFetching || sccDemandFetchingIsInProgress || isMassDemandChecking) {
                    const confirmation = await protector_customConfirm('Идет процесс обновления/проверки.<br>Вы уверены, что хотите остановить и закрыть окно?');
                    if (!confirmation) {
                        return;
                    }
                }
                shouldStopFetching = true;
                sccDemandFetchingShouldStop = true;
                if (isMassDemandChecking) {
                    stopMassDemandCheck();
                }
                document.getElementById('ca-main-overlay')?.remove();
                document.getElementById('ca-confirm-modal-overlay')?.remove();
                container.remove();
                document.body.style.overflow = '';
                isFetching = false;
                sccDemandFetchingIsInProgress = false;
                sccDemandFetchingShouldStop = false;
                isMassDemandChecking = false;

            } else {
                sccDemandFetchingShouldStop = false;
                isMassDemandChecking = false;
                buildMainUI();
                await unsafeWindow.ensureDbLoaded();
                deckStatsMap = precomputeDeckStats(cardDatabaseMap);
                const newContainer = document.getElementById('card-aggregator-container');
                const newOverlay = document.getElementById('ca-main-overlay');
                if (newContainer && newOverlay) {
                    newContainer.classList.add('visible');
                    newOverlay.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                    if (allCardsData.length > 0) {
                        applyFiltersAndSort();
                    }
                }
            }
        }

        // #######################################################################
        // #######################################################################
        function stopMassDemandCheck() {
            isMassDemandChecking = false;
            const btn = document.getElementById('ca-mass-demand-btn');
            const statusEl = document.getElementById('ca-fetch-status');
            if (btn) {
                const icon = btn.querySelector('.ca-btn-icon');
                btn.title = 'Проверить спрос (видимые)';
                btn.style.background = 'linear-gradient(145deg, rgb(166, 100, 110), rgb(222, 0, 5))';
                if (icon) {
                    icon.className = 'ca-btn-icon fal fa-rocket';
                }
                btn.disabled = false;
            }
            if (statusEl && (statusEl.textContent.includes('Проверка') || statusEl.textContent.includes('Пауза'))) {
                statusEl.textContent = 'Проверка отменена.';
            }
        }

        // #######################################################################
        // #######################################################################
        async function startMassDemandCheck() {
            if (isMassDemandChecking) {
                stopMassDemandCheck();
                return;
            }
            isMassDemandChecking = true;
            const btn = document.getElementById('ca-mass-demand-btn');
            const icon = btn.querySelector('.ca-btn-icon');
            const statusEl = document.getElementById('ca-fetch-status');
            const runningBackground = 'linear-gradient(145deg, rgb(50, 200, 50), rgb(0, 150, 0))';
            const pausedBackground = 'linear-gradient(145deg, #e67e22, #d35400)';
            btn.title = 'Остановить проверку';
            btn.style.background = runningBackground;
            icon.className = 'ca-btn-icon fas fa-stop';
            const myTask = { tabId: unsafeWindow.tabIdWatch, source: 'SCC_Mass' };
            let cardsChecked = 0;
            let isPausedByAnotherTab = false;
            try {
                let tasks = await GM_getValue(DEMAND_TASK_STACK_KEY, []);
                tasks.unshift(myTask);
                await GM_setValue(DEMAND_TASK_STACK_KEY, tasks);
                const cardsToActuallyCheck = Array.from(document.querySelectorAll('.ca-card-grid .ca-card-item'))
                .filter(card => !card.closest('.ca-card-wrapper')?.querySelector('.ca-card-demand-stats'));
                if (cardsToActuallyCheck.length === 0) {
                    statusEl.textContent = "Все видимые карты уже проверены.";
                    return;
                }
                while (cardsChecked < cardsToActuallyCheck.length && isMassDemandChecking) {
                    const currentTasks = await GM_getValue(DEMAND_TASK_STACK_KEY, []);
                    if (currentTasks[0]?.tabId !== unsafeWindow.tabIdWatch) {
                        if (!isPausedByAnotherTab) {
                            isPausedByAnotherTab = true;
                            statusEl.textContent = 'Пауза: проверка запущена в другой вкладке...';
                            btn.style.background = pausedBackground;
                            icon.className = 'ca-btn-icon fas fa-pause';
                        }
                        await sleep(2000);
                        continue;
                    }
                    if (isPausedByAnotherTab) {
                        isPausedByAnotherTab = false;
                        btn.style.background = runningBackground;
                        icon.className = 'ca-btn-icon fas fa-stop';
                    }
                    const cardElement = cardsToActuallyCheck[cardsChecked];
                    statusEl.textContent = `Проверка ${cardsChecked + 1} / ${cardsToActuallyCheck.length}...`;
                    const cardId = cardElement.dataset.cardId;
                    if (cardId) {
                        const isCached = await unsafeWindow.getCache('cardId: ' + cardId);
                        if (!isCached) await sleep(1900);
                        if (!isMassDemandChecking) break;
                        await unsafeWindow.updateCardInfo(cardId, cardElement, true);
                    }
                    cardsChecked++;
                }
            } finally {
                let finalTasks = await GM_getValue(DEMAND_TASK_STACK_KEY, []);
                finalTasks = finalTasks.filter(t => !(t.tabId === myTask.tabId && t.source === myTask.source));
                await GM_setValue(DEMAND_TASK_STACK_KEY, finalTasks);
                stopMassDemandCheck();
            }
        }

        // #######################################################################
        // #######################################################################
        function handleRefreshButtonClick() {
            if (isFetching) {
                shouldStopFetching = true;
                const refreshBtn = document.getElementById('ca-refresh-btn');
                refreshBtn.disabled = true;
                refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Остановка...';
                document.getElementById('ca-fetch-status').textContent = 'Остановка по запросу пользователя...';
            } else {
                fetchAllCards(true);
            }
        }

        // #######################################################################
        // #######################################################################
        function toggleLeftPanel() {
            const leftPanel = document.getElementById('ca-left-panel');
            leftPanel.classList.toggle('visible');
        }

        // #######################################################################
        // #######################################################################
        function setupEventListeners() {
            document.querySelector('.ca-close-btn').onclick = toggleMainContainer;
            document.getElementById('ca-toggle-panel-btn').onclick = toggleLeftPanel;
            document.getElementById('ca-refresh-btn').onclick = handleRefreshButtonClick;
            document.getElementById('ca-mass-demand-btn').onclick = handleRocketButtonClick;
            document.getElementById('ca-add-user-btn').onclick = addUser;
            document.getElementById('ca-new-user-input').onkeydown = async (e) => { if (e.key === 'Enter') await addUser(); };
            document.getElementById('ca-users-header').onclick = async () => { selectedUserFilter = null; await renderUsersList(); await applyAndSaveFilters(); };
            document.getElementById('ca-search-input').oninput = () => applyAndSaveFilters();
            document.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', (e) => handleFilterClick(e.currentTarget)));
            document.querySelectorAll('.sort-btn').forEach(btn => btn.addEventListener('click', (e) => handleSort(e.currentTarget.dataset.sort)));
            document.querySelectorAll('.rank-toggle-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.currentTarget.classList.toggle('active');
                    const newSelectedRanks = Array.from(document.querySelectorAll('.rank-toggle-btn.active')).map(b => b.dataset.rank);
                    await saveSelectedRanks(newSelectedRanks);
                    await saveProfile(true);
                });
            });
            document.querySelectorAll('.rank-filter-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.currentTarget.classList.toggle('active');
                    const newActiveFilters = Array.from(document.querySelectorAll('.rank-filter-btn.active')).map(b => b.dataset.rank);
                    await saveActiveRankFilters(newActiveFilters);
                    await applyAndSaveFilters();
                });
            });
            document.getElementById('ca-profile-selector').onchange = loadProfile;
            document.getElementById('ca-create-profile-btn').onclick = createProfile;
            document.getElementById('ca-delete-profile-btn').onclick = deleteProfile;
            document.getElementById('ca-new-profile-name').onkeydown = async (e) => { if (e.key === 'Enter') await createProfile(); };
            document.getElementById('ca-clear-profile-cache-btn').onclick = clearCurrentProfileCache;
            document.getElementById('ca-export-profile-btn').onclick = exportProfile;
            document.getElementById('ca-import-profile-btn').onclick = () => document.getElementById('ca-import-file-input').click();
            document.getElementById('ca-import-file-input').onchange = handleProfileImport;
            document.getElementById('ca-open-wishlist-settings').onclick = () => {
                if (typeof unsafeWindow.openWishlistSettingsModal === 'function') {
                    unsafeWindow.openWishlistSettingsModal();
                }
            };
        }

        // #######################################################################
        // #######################################################################
        async function getActiveRankFilters() { return await dbGet('scc_settings', 'active_rank_filters') || ['ass', 's', 'a']; }
        async function saveActiveRankFilters(ranks) { await dbSet('scc_settings', 'active_rank_filters', ranks); }
        async function updateRankFilterButtonsUI() {
            const activeFilters = await getActiveRankFilters();
            document.querySelectorAll('.rank-filter-btn').forEach(btn => { btn.classList.toggle('active', activeFilters.includes(btn.dataset.rank)); });
        }
        async function getSelectedRanks() { return await dbGet('scc_settings', 'selected_ranks') || ['s']; }
        async function saveSelectedRanks(ranks) { await dbSet('scc_settings', 'selected_ranks', ranks); }
        async function updateRankButtonsUI() {
            const selectedRanks = await getSelectedRanks();
            document.querySelectorAll('.rank-toggle-btn').forEach(btn => { btn.classList.toggle('active', selectedRanks.includes(btn.dataset.rank)); });
        }

        // #######################################################################
        // #######################################################################
        function processCardData(cards) {
            cards.forEach((card, index) => { card.receivedIndex = index; });
            return cards;
        }

        // #######################################################################
        // #######################################################################
        async function fetchAllCards(forceRefresh = false) {
            if (isFetching) return;
            const ranksToFetch = await getSelectedRanks();
            if (ranksToFetch.length === 0) {
                document.getElementById('ca-fetch-status').textContent = 'Ошибка: Выберите хотя бы один ранг для сбора.';
                return;
            }
            if (!forceRefresh) {
                const cachedData = await dbGet('scc_card_cache', currentProfileName);
                if (cachedData) {
                    allCardsData = processCardData(cachedData);
                    await applyFiltersAndSort();
                    document.getElementById('ca-fetch-status').textContent = 'Данные из кеша.';
                    return;
                }
            }
            const previousAllCardsData = [...allCardsData];
            isFetching = true;
            shouldStopFetching = false;
            let newCardsData = [];
            const allUsers = await getUsers();
            const excludedUsers = await getExcludedUsers();
            const usersToFetch = allUsers.filter(user => !excludedUsers.includes(user));
            const statusEl = document.getElementById('ca-fetch-status');
            const refreshBtn = document.getElementById('ca-refresh-btn');
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '<i class="fas fa-stop"></i> Остановить';
            refreshBtn.style.background = 'linear-gradient(145deg, #e67e22, #d35400)';
            renderCards([], {});
            updateCounters(0, 0);
            try {
                for (let i = 0; i < usersToFetch.length; i++) {
                    if (shouldStopFetching) break;
                    const user = usersToFetch[i];
                    const userCounter = `(${(i + 1)}/${usersToFetch.length})`;
                    for (const rank of ranksToFetch) {
                        if (shouldStopFetching) break;
                        let page = 1;
                        let hasMorePages = true;
                        let totalPagesForRank = 0;
                        while (hasMorePages) {
                            if (shouldStopFetching) break;
                            if (totalPagesForRank > 0) {
                                statusEl.textContent = `Загрузка: ${user} ${userCounter} (ранг ${rank.toUpperCase()}, ${page} из ${totalPagesForRank})`;
                            } else {
                                statusEl.textContent = `Загрузка: ${user} ${userCounter} (ранг ${rank.toUpperCase()}, стр. ${page})`;
                            }
                            const url = `${CURRENT_DOMAIN}/user/cards/?name=${user}&rank=${rank}&page=${page}`;
                            try {
                                const response = await fetch(url);
                                await sleep(FETCH_DELAY);
                                const htmlText = await response.text();
                                const doc = new DOMParser().parseFromString(htmlText, 'text/html');
                                if (page === 1) {
                                    const pageLinks = doc.querySelectorAll('.pagination__pages a[href*="page="]');
                                    if (pageLinks.length > 0) {
                                        const pageNumbers = Array.from(pageLinks).map(link => {
                                            const pageNumText = link.textContent.trim();
                                            if (/\d+/.test(pageNumText)) {
                                                return parseInt(pageNumText, 10);
                                            }
                                            try {
                                                const urlParams = new URL(link.href, CURRENT_DOMAIN).searchParams;
                                                return parseInt(urlParams.get('page'), 10);
                                            } catch (e) { return 0; }
                                        }).filter(num => !isNaN(num) && num > 0);
                                        totalPagesForRank = Math.max(...pageNumbers, 1);
                                    } else {
                                        totalPagesForRank = 1;
                                    }
                                    statusEl.textContent = `Загрузка: ${user} ${userCounter} (ранг ${rank.toUpperCase()}, ${page} из ${totalPagesForRank})`;
                                }
                                const cardsOnPage = parsePage(doc, user);
                                if (cardsOnPage.length > 0) newCardsData.push(...cardsOnPage);
                                if (page < totalPagesForRank) {
                                    page++;
                                } else {
                                    hasMorePages = false;
                                }
                            } catch (error) {
                                console.error(`Ошибка сети для ${user} (ранг ${rank}):`, error);
                                statusEl.textContent = `Ошибка сети для ${user}.`;
                                hasMorePages = false;
                            }
                        }
                    }
                }
            } finally {
                const wasStoppedByUser = shouldStopFetching;
                isFetching = false;
                shouldStopFetching = false;
                if (wasStoppedByUser) {
                    allCardsData = previousAllCardsData;
                } else {
                    await dbSet('scc_card_cache', currentProfileName, newCardsData);
                    allCardsData = processCardData(newCardsData);
                }
                const container = document.getElementById('card-aggregator-container');
                if (container) {
                    const statusEl = document.getElementById('ca-fetch-status');
                    const refreshBtn = document.getElementById('ca-refresh-btn');
                    if (wasStoppedByUser) {
                        statusEl.textContent = `Остановлено. Возврат к предыдущим данным (${allCardsData.length} карт).`;
                    } else {
                        statusEl.textContent = `Готово! Собрано ${allCardsData.length} карт.`;
                    }
                    refreshBtn.disabled = false;
                    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить данные';
                    refreshBtn.style.background = '';
                    await applyFiltersAndSort();
                }
            }
        }

        // #######################################################################
        // #######################################################################
        function parsePage(doc, owner) {
            const cards = [];
            const loggedInUser = doc.body.innerHTML.match(/var visitor_name = '(.+?)';/)?.[1] || '';
            doc.querySelectorAll('.anime-cards__item').forEach(el => {
                let imageUrl = el.querySelector('video')?.poster || el.dataset.image || el.querySelector('img')?.dataset.src || el.querySelector('img')?.src;
                if (!imageUrl) return;
                const cardData = {
                    id: el.dataset.id,
                    instanceId: el.dataset.ownerId,
                    owner,
                    name: el.dataset.name,
                    anime: el.dataset.animeName,
                    rank: el.dataset.rank,
                    image: imageUrl,
                    mp4: el.dataset.mp4,
                    webm: el.dataset.webm,
                    stars: parseInt(el.dataset.stars) || 0,
                    isLocked: false,
                    isInTrade: false,
                    isInDeck: false,
                };
                if (owner === loggedInUser) {
                    const myLockBtn = el.querySelector('.lock-card-btn');
                    if (myLockBtn) {
                        if (myLockBtn.querySelector('.fa-arrow-right-arrow-left')) cardData.isInTrade = true;
                        else if (myLockBtn.querySelector('.fa-trophy-alt')) cardData.isInDeck = true;
                        else if (myLockBtn.querySelector('.fa-lock')) cardData.isLocked = true;
                    }
                } else {
                    const otherUserBtn = el.querySelector('.lock-trade-btn');
                    if (otherUserBtn) {
                        if (otherUserBtn.querySelector('.fa-exchange-alt, .fa-exchange')) cardData.isInTrade = true;
                        if (otherUserBtn.querySelector('.fa-lock')) cardData.isLocked = true;
                    }
                    if (el.dataset.proposed === '1') cardData.isInTrade = true;
                }
                cards.push(cardData);
            });
            return cards;
        }

        // #######################################################################
        // # Предварительно вычисляет статистику по S-картам для каждой колоды, используя ПОЛНУЮ базу карт
        // #######################################################################
        function precomputeDeckStats(fullCardDatabase) {
            const stats = new Map();
            if (!fullCardDatabase || fullCardDatabase.size === 0) return stats;
            for (const card of fullCardDatabase.values()) {
                if (!stats.has(card.animeName)) {
                    stats.set(card.animeName, { sCount: 0 });
                }
                if (card.rank.toLowerCase() === 's') {
                    stats.get(card.animeName).sCount++;
                }
            }
            return stats;
        }

        // #######################################################################
        // #######################################################################
        async function handleFilterClick(clickedButton) {
            const group = clickedButton.dataset.exclusiveGroup;
            if (clickedButton.classList.contains('active')) {
                clickedButton.classList.remove('active');
            } else {
                if (group) document.querySelectorAll(`.filter-btn[data-exclusive-group="${group}"]`).forEach(btn => btn.classList.remove('active'));
                clickedButton.classList.add('active');
            }
            await applyAndSaveFilters();
        }

        // #######################################################################
        // #######################################################################
        async function handleSort(key) {
            if (isFetching) {
                shouldStopFetching = true;
                while(isFetching) { await sleep(50); }
            }
            if (isMassDemandChecking) {
                console.log('Остановка проверки спроса!');
                stopMassDemandCheck();
            }
            if (key === 'demand') {
                updateRocketButtonUI('running');
            } else if (currentSort.key === 'demand' && key !== 'demand') {
                updateRocketButtonUI('idle');
            }
            if (currentSort.key === key) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.key = key;
                currentSort.direction = (key === 'demand') ? 'desc' : 'asc';
            }
            updateSortButtonsUI();
            await applyAndSaveFilters();
        }

        // #######################################################################
        // #######################################################################
        async function applyAndSaveFilters(resetPage = true) {
            if (isMassDemandChecking) {
                console.log('Остановка проверки спроса!');
                stopMassDemandCheck();
            }
            await saveFilters();
            await saveProfile(true);
            await applyFiltersAndSort(resetPage);
        }

        // #######################################################################
        // НОВАЯ ФУНКЦИЯ для плавной сортировки и перерисовки
        // #######################################################################
        function liveSortAndRedraw(filteredData) {
            const grid = document.querySelector('.ca-card-grid');
            if (!grid) return;
            filteredData.sort((a, b) => {
                const key = currentSort.key;
                if (key === 'demand') {
                    const demandA = a.needCount ?? -1;
                    const demandB = b.needCount ?? -1;
                    if (demandA === -1 && demandB === -1) return 0;
                    if (demandA === -1) return 1;
                    if (demandB === -1) return -1;
                    return currentSort.direction === 'asc' ? demandA - demandB : demandB - demandA;
                }
                return 0;
            });
            const totalPages = Math.ceil(filteredData.length / CARDS_PER_PAGE);
            if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
            const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
            const endIndex = startIndex + CARDS_PER_PAGE;
            const cardsForPage = filteredData.slice(startIndex, endIndex);
            const existingWrappers = Array.from(grid.children);
            const newOrderWrappers = [];
            cardsForPage.forEach(cardData => {
                const internalId = cardData.instanceId || `generated-${cardData.receivedIndex}`;
                let wrapper = existingWrappers.find(w => w.dataset.internalId === internalId);
                if (!wrapper) {
                    wrapper = createCardWrapper(cardData, getActiveFilters());
                } else {
                    let statsDiv = wrapper.querySelector('.ca-card-demand-stats');
                    if (currentSort.key === 'demand' && !statsDiv) {
                        statsDiv = document.createElement('div');
                        statsDiv.className = 'ca-card-demand-stats';
                        statsDiv.style.cssText = `padding: 6px 0; text-align: center; font-size: 0.9em; background-color: var(--panel-bg); min-height: 25px;`;
                        const ownerEl = wrapper.querySelector('.ca-card-owner');
                        if (ownerEl) {
                            wrapper.insertBefore(statsDiv, ownerEl);
                            ownerEl.style.borderRadius = '0 0 8px 8px';
                        } else {
                            wrapper.appendChild(statsDiv);
                        }
                    }
                    if (statsDiv) {
                        if (typeof cardData.needCount !== 'undefined' && cardData.needCount >= 0) {
                            statsDiv.innerHTML = `
                                <span title="Хотят получить"><i class="fas fa-shopping-cart"></i> ${cardData.needCount}</span>
                                <span title="Готовы обменять"><i class="fas fa-sync-alt"></i> ${cardData.tradeCount}</span>
                                <span title="Владельцев"><i class="fas fa-users"></i> ${cardData.popularityCount}</span>
                            `;
                        } else {
                            statsDiv.innerHTML = `<span style="color: #666;">...</span>`;
                        }
                    }
                }
                newOrderWrappers.push(wrapper);
            });
            existingWrappers.forEach(w => {
                if (!newOrderWrappers.includes(w)) {
                    w.remove();
                }
            });
            newOrderWrappers.forEach(w => {
                grid.appendChild(w);
            });
        }

        // #######################################################################
        // #######################################################################
        async function applyFiltersAndSort(resetPage = true) {
            if (sccDemandFetchingIsInProgress) {
                sccDemandFetchingShouldStop = true;
                while (sccDemandFetchingIsInProgress) { await sleep(50); }
            }
            if (resetPage) { currentPage = 1; }
            const filters = await getActiveFilters();
            if (filters.wishlist) {
                const targetUser = await GM_getValue(WISHLIST_TARGET_USER_KEY);
                if (targetUser) {
                    const wishlistData = await unsafeWindow.dbGet(WISHLIST_DB_STORE_NAME, targetUser);
                    if (wishlistData?.cardIds) {
                        activeWishlistSet = new Set(wishlistData.cardIds);
                    } else {
                        activeWishlistSet = new Set();
                    }
                } else {
                    activeWishlistSet = new Set();
                }
            }
            const excludedUsers = await getExcludedUsers();
            const activeRanks = await getActiveRankFilters();
            let filtered = allCardsData.filter(card => {
                if (excludedUsers.includes(card.owner)) return false;
                if (activeRanks.length > 0 && !activeRanks.includes(card.rank)) return false;
                if (selectedUserFilter && card.owner !== selectedUserFilter) return false;
                const isClosed = card.isLocked || card.isInDeck || card.stars > 0;
                if (filters.closed && !isClosed) return false;
                if (filters.open && isClosed) return false;
                if (filters.with_stars && card.stars === 0) return false;
                if (filters.no_stars && card.stars > 0) return false;
                if (filters.trade && !card.isInTrade) return false;
                const nameMatch = card.name.toLowerCase().includes(filters.search);
                const animeMatch = card.anime.toLowerCase().includes(filters.search);
                if (filters.search && !nameMatch && !animeMatch) return false;

                if (filters.no_s) {
                    const stats = deckStatsMap.get(card.anime);
                    if (!stats || stats.sCount !== 0) return false;
                }
                if (filters.one_s) {
                    const stats = deckStatsMap.get(card.anime);
                    if (!stats || stats.sCount !== 1) return false;
                }

                if (filters.wishlist) {
                    if (!activeWishlistSet || !activeWishlistSet.has(card.id)) {
                        return false;
                    }
                }

                return true;
            });
            const counts = {};
            filtered.forEach(card => {
                const key = `${card.name}|${card.anime}|${card.rank}`;
                counts[key] = (counts[key] || 0) + 1;
            });
            filtered.forEach(card => {
                const key = `${card.name}|${card.anime}|${card.rank}`;
                card.duplicateCount = counts[key];
            });
            if (filters.duplicates) {
                const seen = new Set();
                filtered = filtered.filter(card => {
                    const uniqueKey = `${card.name}|${card.anime}|${card.rank}`;
                    if (seen.has(uniqueKey)) { return false; }
                    seen.add(uniqueKey);
                    return true;
                });
            }
            if (filters.duplicates) {
                filtered.sort((a, b) => {
                    const duplicateDiff = b.duplicateCount - a.duplicateCount;
                    if (duplicateDiff !== 0) {
                        return duplicateDiff;
                    }
                    return a.name.localeCompare(b.name);
                });
            } else {
                filtered.sort((a, b) => {
                    const key = currentSort.key;
                    const dir = currentSort.direction === 'asc' ? 1 : -1;
                    if (key === 'demand') {
                        const demandA = a.needCount ?? -1;
                        const demandB = b.needCount ?? -1;
                        if (demandA === -1 && demandB === -1) return 0;
                        if (demandA === -1) return 1;
                        if (demandB === -1) return -1;
                        return (demandA - demandB) * dir;
                    }
                    let valA, valB;
                    switch (key) {
                        case 'name':
                            valA = a.name;
                            valB = b.name;
                            break;
                        case 'anime':
                            valA = a.anime;
                            valB = b.anime;
                            break;
                        case 'owner':
                            valA = a.owner;
                            valB = b.owner;
                            break;
                        case 'date':
                        default:
                            valA = a.receivedIndex;
                            valB = b.receivedIndex;
                            break;
                    }
                    if (typeof valA === 'string') {
                        return valA.localeCompare(valB) * dir;
                    }
                    return (valA - valB) * dir;
                });
            }
            const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);
            if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
            const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
            const endIndex = startIndex + CARDS_PER_PAGE;
            const cardsForPage = filtered.slice(startIndex, endIndex);
            renderCards(cardsForPage, filters);
            renderPagination(totalPages, filtered.length);
            updateCounters(filtered.length, cardsForPage.length);
            if (currentSort.key === 'demand') {
                const myTask = { tabId: unsafeWindow.tabIdWatch, source: 'SCC_LiveSort' };
                let tasks = await GM_getValue(DEMAND_TASK_STACK_KEY, []);
                if (!tasks.some(t => t.tabId === myTask.tabId && t.source === myTask.source)) {
                    tasks.unshift(myTask);
                    await GM_setValue(DEMAND_TASK_STACK_KEY, tasks);
                }
                try {
                    await ensureDemandData(filtered);
                } finally {
                    let finalTasks = await GM_getValue(DEMAND_TASK_STACK_KEY, []);
                    finalTasks = finalTasks.filter(t => !(t.tabId === myTask.tabId && t.source === myTask.source));
                    await GM_setValue(DEMAND_TASK_STACK_KEY, finalTasks);
                }
            } else {
                sccDemandFetchingShouldStop = true;
            }
        }


        // #######################################################################
        // #######################################################################
        async function saveFilters() {
            await dbSet('scc_settings', 'filters', await getActiveFilters());
            await dbSet('scc_settings', 'sort', currentSort);
        }

        // #######################################################################
        // #######################################################################
        async function loadAndApplySavedFilters() {
            const savedFilters = await dbGet('scc_settings', 'filters') || {};
            document.getElementById('ca-search-input').value = savedFilters.search || '';
            document.querySelectorAll('.filter-btn').forEach(btn => {
                if (savedFilters[btn.dataset.filter]) btn.classList.add('active'); else btn.classList.remove('active');
            });
            updateSortButtonsUI();
        }

        // #######################################################################
        // #######################################################################
        async function getActiveFilters() {
            const filters = { search: document.getElementById('ca-search-input').value.toLowerCase() };
            document.querySelectorAll('.filter-btn').forEach(btn => { filters[btn.dataset.filter] = btn.classList.contains('active'); });
            return filters;
        }

        // #######################################################################
        // #######################################################################
        function updateSortButtonsUI() {
            document.querySelectorAll('.sort-btn').forEach(btn => {
                btn.classList.remove('sort-active');
                btn.textContent = btn.textContent.replace(/ (↑|↓)$/, '');
                if (btn.dataset.sort === currentSort.key) {
                    btn.classList.add('sort-active');
                    btn.textContent += currentSort.direction === 'asc' ? ' ↑' : ' ↓';
                }
            });
        }
        // #######################################################################
        // ФУНКЦИЯ для создания DOM-элемента одной карточки
        // #######################################################################
        function createCardWrapper(card, filters) {
            const wrapper = document.createElement('div');
            wrapper.className = 'ca-card-wrapper';
            wrapper.dataset.internalId = card.instanceId || `generated-${card.receivedIndex}`;
            const cardEl = document.createElement('a');
            cardEl.className = 'ca-card-item';
            cardEl.href = `${CURRENT_DOMAIN}/user/cards/?name=${card.owner}&card_id=${card.id}`;
            cardEl.dataset.cardId = card.id;
            const handleCardClickInteraction = async (event) => {
                if (event.target.closest('.ca-check-demand-btn')) {
                    event.preventDefault();
                    return;
                }
                const activeFilters = await getActiveFilters();
                const isDuplicatesMode = activeFilters.duplicates;
                if (isDuplicatesMode && card.duplicateCount > 1) {
                    event.preventDefault();
                    event.stopPropagation();
                    const allInstances = allCardsData.filter(c => c.name === card.name && c.anime === card.anime && c.rank === card.rank);
                    const ownersMap = new Map();
                    allInstances.forEach(instance => {
                        ownersMap.set(instance.owner, (ownersMap.get(instance.owner) || 0) + 1);
                    });
                    if (event.button === 0 || event.button === 1) {
                        showOwnerSelectionModal(ownersMap, card.id, card.name);
                    }
                } else {
                    if (event.button === 0) {
                        sessionStorage.setItem('ca_should_reopen_aggregator', 'true');
                        window.location.href = cardEl.href;
                    }
                }
            };
            cardEl.addEventListener('mousedown', handleCardClickInteraction);
            cardEl.addEventListener('click', (e) => e.preventDefault());
            let overlayIconHTML = '';
            if (card.isLocked) overlayIconHTML = `<div class="ca-card-overlay-icon">${ICONS.locked}</div>`;
            else if (card.isInDeck) overlayIconHTML = `<div class="ca-card-overlay-icon">${ICONS.inDeck}</div>`;
            else if (card.isInTrade) overlayIconHTML = `<div class="ca-card-overlay-icon">${ICONS.inTrade}</div>`;
            else if (card.stars > 0) overlayIconHTML = `<div class="ca-card-overlay-icon">${ICONS.starred}</div>`;
            const statusesHTML = `<div class="ca-card-statuses">${card.stars > 0 ? ICONS.hasStars(card.stars) : ''}</div>`;
            let duplicatesHTML = (card.duplicateCount > 1 && filters.duplicates) ? `<div class="ca-card-duplicates">x${card.duplicateCount}</div>` : '';
            const demandCheckBtn = document.createElement('div');
            demandCheckBtn.className = 'ca-check-demand-btn';
            demandCheckBtn.title = 'Проверить спрос';
            demandCheckBtn.innerHTML = '<i class="fas fa-chart-line"></i>';
            demandCheckBtn.onclick = async (e) => {
                e.preventDefault(); e.stopPropagation();
                const cardNode = e.currentTarget.closest('.ca-card-item');
                const cardId = cardNode.dataset.cardId;
                if (cardId) { await unsafeWindow.updateCardInfo(cardId, cardNode, true); }
            };
            let mediaHTML = '';
            if (card.rank === 'ass' && card.webm && card.mp4) {
                mediaHTML = `<video poster="${card.image}" pip="false" webkit-playsinline="true" playsinline="true" autoplay="true" muted="muted" loop="true" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 8px 8px 0 0;"><source src="${card.webm}" type="video/webm"><source src="${card.mp4}" type="video/mp4"></video>`;
            } else {
                mediaHTML = `<img src="${card.image}" loading="lazy" alt="${card.name}" style="border-radius: 8px 8px 0 0;">`;
            }
            cardEl.style.borderRadius = '8px 8px 0 0';
            cardEl.innerHTML = `${mediaHTML}${statusesHTML}${overlayIconHTML}${duplicatesHTML}`;
            cardEl.appendChild(demandCheckBtn);
            (async () => {
                const isInfoEnabled = await GM_getValue(ACM_ANIME_INFO_BTN_ENABLED_KEY, true);
                if (!isInfoEnabled) return;
                const infoBtn = unsafeWindow.createInfoButton();
                const cardWidth = 140;
                const baseScaleFactor = await GM_getValue('acm_infoButtonSizeFactor', 0.12);
                const buttonSize = Math.max(16, Math.min(50, cardWidth * baseScaleFactor * 1.3));
                const fontSize = buttonSize * 0.5;
                Object.assign(infoBtn.style, {
                    width: `${buttonSize}px`,
                    height: `${buttonSize}px`,
                    fontSize: `${fontSize}px`,
                    padding: `${buttonSize * 0.15}px`,
                    top: '4px',
                    left: '30%',
                    transform: 'translateX(-50%)'
                });

                infoBtn.addEventListener('click', unsafeWindow.toggleAnimeInfoTooltip);
                infoBtn.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                });
                cardEl.classList.add('acm-card-container');
                cardEl.appendChild(infoBtn);
            })();
            wrapper.appendChild(cardEl);
            if (currentSort.key === 'demand') {
                const statsDiv = document.createElement('div');
                statsDiv.className = 'ca-card-demand-stats';
                statsDiv.style.cssText = `padding: 6px 0; text-align: center; font-size: 0.9em; background-color: var(--panel-bg); min-height: 25px;`;
                if (typeof card.needCount !== 'undefined' && card.needCount >= 0) {
                    statsDiv.innerHTML = `
                        <span title="Хотят получить"><i class="fas fa-shopping-cart"></i> ${card.needCount}</span>
                        <span title="Готовы обменять"><i class="fas fa-sync-alt"></i> ${card.tradeCount}</span>
                        <span title="Владельцев"><i class="fas fa-users"></i> ${card.popularityCount}</span>
                    `;
                } else {
                    statsDiv.innerHTML = `<span style="color: #666;">...</span>`;
                }
                wrapper.appendChild(statsDiv);
            }
            const ownerEl = document.createElement('div');
            ownerEl.className = 'ca-card-owner';
            ownerEl.textContent = card.owner;
            ownerEl.style.borderRadius = '0 0 8px 8px';
            wrapper.appendChild(ownerEl);
            return wrapper;
        }

        // #######################################################################
        // #######################################################################
        function showOwnerSelectionModal(ownersMap, cardId, cardName) {
            const existingOverlay = document.getElementById('ca-confirm-modal-overlay');
            if (existingOverlay) existingOverlay.remove();
            const overlay = document.createElement('div');
            overlay.id = 'ca-confirm-modal-overlay';
            overlay.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0, 0, 0, 0.8); z-index: 1001; display: flex;
                align-items: center; justify-content: center;
            `;
            const modal = document.createElement('div');
            modal.className = 'acm-modal';
            modal.style.cssText = `
                position: relative; top: auto; left: auto; transform: none; width: 400px;
                z-index: 1002;
            `;
            let userListHTML = '';
            const sortedOwners = [...ownersMap.entries()].sort((a, b) => b[1] - a[1]);
            sortedOwners.forEach(([owner, count]) => {
                const url = `${CURRENT_DOMAIN}/user/cards/?name=${owner}&card_id=${cardId}`;
                userListHTML += `
                    <a href="${url}" class="owner-link-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: var(--btn-bg); border-radius: 5px; text-decoration: none; color: var(--text-color); margin-bottom: 5px; transition: background-color 0.2s;">
                        <span>${owner}</span>
                        <span style="font-weight: bold; color: var(--accent-color);">x${count}</span>
                    </a>
                `;
            });
            modal.innerHTML = `
                <div class="modal-header">
                    <h2>Владельцы "${cardName}"</h2>
                </div>
                <div class="modal-body" style="max-height: 400px; overflow-y: auto;">
                    ${userListHTML}
                </div>
                <div class="modal-footer" style="justify-content: flex-end;">
                    <button class="action-btn close-btn">Закрыть</button>
                </div>
            `;
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            const closeModal = () => overlay.remove();
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeModal();
            });
            modal.querySelector('.close-btn').onclick = closeModal;
            modal.querySelectorAll('.owner-link-item').forEach(link => {
                link.onclick = (e) => {
                    if (e.button === 0) {
                        e.preventDefault();
                        sessionStorage.setItem('ca_should_reopen_aggregator', 'true');
                        window.location.href = link.href;
                    }
                };
            });
        }

        // #######################################################################
        // #######################################################################
        function renderCards(cardsToRender, filters) {
            const grid = document.querySelector('.ca-card-grid');
            grid.innerHTML = '';
            const fragment = document.createDocumentFragment();
            cardsToRender.forEach(card => {
                const wrapper = createCardWrapper(card, filters);
                fragment.appendChild(wrapper);
            });
            grid.appendChild(fragment);
            grid.scrollTop = 0;
        }

        // #######################################################################
        // #######################################################################
        function updateCounters(totalFiltered, displayedCount) {
            document.getElementById('ca-card-counter').textContent = `Всего карт: ${allCardsData.length} | Найдено: ${totalFiltered} | Показано: ${displayedCount}`;
        }

        // #######################################################################
        // #######################################################################
        function renderPagination(totalPages, totalFiltered) {
            const controls = document.getElementById('ca-pagination-controls').querySelector('.ca-page-numbers-wrapper');
            if (!controls) return;
            controls.innerHTML = '';
            if (totalPages <= 1) {
                const singlePageBtn = document.createElement('button');
                singlePageBtn.className = 'ca-page-btn active';
                singlePageBtn.textContent = '1';
                singlePageBtn.disabled = true;
                controls.appendChild(singlePageBtn);
                return;
            }
            const prevBtn = document.createElement('button');
            prevBtn.className = 'ca-page-btn';
            prevBtn.innerHTML = '&laquo;';
            prevBtn.disabled = currentPage === 1;
            prevBtn.onclick = () => changePage(currentPage - 1);
            controls.appendChild(prevBtn);
            const pageSelector = document.createElement('select');
            pageSelector.id = 'ca-page-selector';
            for (let i = 1; i <= totalPages; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                if (i === currentPage) {
                    option.selected = true;
                }
                pageSelector.appendChild(option);
            }
            pageSelector.onchange = (e) => changePage(parseInt(e.target.value, 10));
            controls.appendChild(pageSelector);
            const nextBtn = document.createElement('button');
            nextBtn.className = 'ca-page-btn';
            nextBtn.innerHTML = '&raquo;';
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.onclick = () => changePage(currentPage + 1);
            controls.appendChild(nextBtn);
        }

        // #######################################################################
        // #######################################################################
        async function changePage(newPage) {
            if (isMassDemandChecking) {
                stopMassDemandCheck();
            }
            currentPage = newPage;
            await applyFiltersAndSort(false);
        }

        // #######################################################################
        // #######################################################################
        async function tryLoadFromCache() {
            const cachedData = await dbGet('scc_card_cache', currentProfileName);
            if (cachedData && cachedData.length > 0) {
                allCardsData = processCardData(cachedData);
                document.getElementById('ca-fetch-status').textContent = `Загружены данные из кеша профиля "${currentProfileName}".`;
                await applyFiltersAndSort();
            } else {
                document.getElementById('ca-fetch-status').textContent = `Нет данных для профиля "${currentProfileName}". Нажмите "Обновить".`;
            }
        }

        // #######################################################################
        // #######################################################################
        async function getUsers() {
            const profiles = await getProfiles();
            const currentProfile = profiles[currentProfileName] || profiles.Default;
            return currentProfile.users || DEFAULT_USERS;
        }
        async function saveUsers(users) {
            const profiles = await getProfiles();
            if (profiles[currentProfileName]) {
                profiles[currentProfileName].users = users;
                await saveProfiles(profiles);
            }
        }
        async function getExcludedUsers() {
            const profiles = await getProfiles();
            const currentProfile = profiles[currentProfileName] || profiles.Default;
            return currentProfile.excludedUsers || [];
        }
        async function saveExcludedUsers(users) {
            const profiles = await getProfiles();
            if (profiles[currentProfileName]) {
                profiles[currentProfileName].excludedUsers = users;
                await saveProfiles(profiles);
            }
        }
        async function toggleUserVisibility(userToToggle) {
            const excludedUsers = await getExcludedUsers();
            const userIndex = excludedUsers.indexOf(userToToggle);
            if (userIndex > -1) { excludedUsers.splice(userIndex, 1); } else { excludedUsers.push(userToToggle); }
            await saveExcludedUsers(excludedUsers);
            await saveProfile(true);
            await renderUsersList();
            await applyFiltersAndSort();
        }

        // #######################################################################
        // #######################################################################
        async function renderUsersList() {
            const listEl = document.getElementById('ca-users-list');
            const fragment = document.createDocumentFragment();
            const excludedUsers = await getExcludedUsers();
            const users = await getUsers();
            users.forEach(user => {
                const isExcluded = excludedUsers.includes(user);
                const item = document.createElement('div');
                item.className = 'user-item';
                if (user === selectedUserFilter) item.classList.add('selected');
                const iconClass = isExcluded ? 'fa-times-circle' : 'fa-check-circle';
                const buttonClass = isExcluded ? 'excluded' : 'included';
                const title = isExcluded ? 'Включить пользователя в поиск' : 'Исключить пользователя из поиска';
                item.innerHTML = `<button class="toggle-user-visibility-btn ${buttonClass}" data-user="${user}" title="${title}"><i class="fas ${iconClass}"></i></button><span>${user}</span><button class="delete-user-btn" data-user="${user}" title="Удалить пользователя навсегда">&times;</button>`;
                item.querySelector('span').onclick = async () => { selectedUserFilter = selectedUserFilter === user ? null : user; await renderUsersList(); await applyAndSaveFilters(); };
                item.querySelector('.toggle-user-visibility-btn').onclick = async (e) => { e.stopPropagation(); await toggleUserVisibility(user); };
                item.querySelector('.delete-user-btn').onclick = async (e) => {
                    e.stopPropagation();
                    const message = `Вы уверены, что хотите удалить пользователя <b style="color: #d4506a;">${user}</b>?`;
                    const confirmation = await protector_customConfirm(message);
                    if (confirmation) {
                        await removeUser(user);
                    }
                };
                fragment.appendChild(item);
            });
            listEl.innerHTML = '';
            listEl.appendChild(fragment);
        }

        // #######################################################################
        // #######################################################################
        async function addUser() {
            const input = document.getElementById('ca-new-user-input');
            const newUser = input.value.trim();
            if (!newUser) return;
            const users = await getUsers();
            if (!users.includes(newUser)) {
                users.push(newUser);
                await saveUsers(users);
                await saveProfile(true);
                await renderUsersList();
                input.value = '';
            } else {
                alert('Пользователь уже в списке.');
            }
        }

        // #######################################################################
        // #######################################################################
        async function removeUser(userToRemove) {
            let users = await getUsers();
            users = users.filter(u => u !== userToRemove);
            await saveUsers(users);
            let excluded = await getExcludedUsers();
            excluded = excluded.filter(u => u !== userToRemove);
            await saveExcludedUsers(excluded);
            await saveProfile(true);
            await renderUsersList();
            allCardsData = allCardsData.filter(card => card.owner !== userToRemove);
            if (selectedUserFilter === userToRemove) selectedUserFilter = null;
            await applyFiltersAndSort();
        }
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        initializeMinimalUI();

        // #######################################################################
        // #######################################################################
        async function getProfiles() {
            return await dbGet('scc_settings', 'profiles') || {
                'Default': {
                    selectedRanks: ['s'],
                    activeRankFilters: ['ass', 's', 'a'],
                    filters: {},
                    sort: { key: 'date', direction: 'asc' },
                    users: DEFAULT_USERS,
                    excludedUsers: []
                }
            };
        }

        // #######################################################################
        // #######################################################################
        async function saveProfiles(profiles) {
            await dbSet('scc_settings', 'profiles', profiles);
        }

        // #######################################################################
        // #######################################################################
        async function renderProfileSelector() {
            const profiles = await getProfiles();
            const selector = document.getElementById('ca-profile-selector');
            selector.innerHTML = '';
            const profileNames = Object.keys(profiles);
            profileNames.sort((a, b) => {
                if (a === 'Default') return 1;
                if (b === 'Default') return -1;
                return a.localeCompare(b);
            });
            profileNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                selector.appendChild(option);
            });
            selector.value = currentProfileName;
            document.getElementById('ca-delete-profile-btn').disabled = (currentProfileName === 'Default');
        }

        // #######################################################################
        // #######################################################################
        async function getSettingsForProfile() {
            return {
                selectedRanks: await getSelectedRanks(),
                activeRankFilters: await getActiveRankFilters(),
                filters: await getActiveFilters(),
                sort: currentSort,
                users: await getUsers(),
                excludedUsers: await getExcludedUsers()
            };
        }

        // #######################################################################
        // #######################################################################
        async function applySettingsFromProfile(settings) {
            await saveSelectedRanks(settings.selectedRanks || ['s']);
            await saveActiveRankFilters(settings.activeRankFilters || ['ass', 's', 'a']);
            await saveUsers(settings.users || DEFAULT_USERS);
            await saveExcludedUsers(settings.excludedUsers || []);
            await dbSet('scc_settings', 'filters', settings.filters || {});
            currentSort = settings.sort || { key: 'date', direction: 'asc' };
            await dbSet('scc_settings', 'sort', currentSort);
            await updateRankButtonsUI();
            await updateRankFilterButtonsUI();
            await loadAndApplySavedFilters();
            await renderUsersList();
        }

        // #######################################################################
        // #######################################################################
        async function loadProfile() {
            const selector = document.getElementById('ca-profile-selector');
            const newProfileName = selector.value;
            const profiles = await getProfiles();
            if (profiles[newProfileName]) {
                currentProfileName = newProfileName;
                await saveCurrentProfileName(currentProfileName);
                await applySettingsFromProfile(profiles[newProfileName]);
                document.getElementById('ca-delete-profile-btn').disabled = (currentProfileName === 'Default');
                const cachedData = await dbGet('scc_card_cache', newProfileName);
                if (cachedData && cachedData.length > 0) {
                    allCardsData = processCardData(cachedData);
                    document.getElementById('ca-fetch-status').textContent = `Загружены данные из кеша профиля "${newProfileName}".`;
                    await applyFiltersAndSort();
                } else {
                    allCardsData = [];
                    renderCards([], {});
                    updateCounters(0, 0);
                    renderPagination(0, 0);
                    document.getElementById('ca-fetch-status').textContent = `Нет данных для профиля "${newProfileName}". Нажмите "Обновить".`;
                }
            }
        }

        // #######################################################################
        // #######################################################################
        async function saveProfile(isSilent = false) {
            const profiles = await getProfiles();
            profiles[currentProfileName] = await getSettingsForProfile();
            await saveProfiles(profiles);
            if (!isSilent) {
                alert(`Профиль "${currentProfileName}" сохранен!`);
            }
        }

        // #######################################################################
        // #######################################################################
        async function createProfile() {
            const input = document.getElementById('ca-new-profile-name');
            const newName = input.value.trim();
            if (!newName) {
                alert('Введите имя профиля.');
                return;
            }
            const profiles = await getProfiles();
            if (profiles[newName]) {
                alert('Профиль с таким именем уже существует.');
                return;
            }
            const newProfileSettings = {
                selectedRanks: ['s'],
                activeRankFilters: ['ass', 's', 'a'],
                filters: {},
                sort: { key: 'date', direction: 'asc' },
                users: [],
                excludedUsers: []
            };
            profiles[newName] = newProfileSettings;
            await saveProfiles(profiles);
            currentProfileName = newName;
            await saveCurrentProfileName(currentProfileName);
            await renderProfileSelector();
            input.value = '';
            await applySettingsFromProfile(newProfileSettings);
            allCardsData = [];
            renderCards([], {});
            updateCounters(0, 0);
            renderPagination(0, 0);
            document.getElementById('ca-fetch-status').textContent = `Создан профиль "${newName}". Нажмите "Обновить".`;
        }

        // #######################################################################
        // # Очищает кеш карт для текущего активного профиля
        // #######################################################################
        async function clearCurrentProfileCache() {
            const profileNameToClear = currentProfileName;
            const message = `Вы уверены, что хотите очистить кеш карт для профиля <b style="color: #d4506a;">${profileNameToClear}</b>?<br>Все данные о картах для него будут удалены.`;
            const confirmation = await protector_customConfirm(message);
            if (confirmation) {
                await dbDelete('scc_card_cache', profileNameToClear);
                allCardsData = [];
                renderCards([], {});
                updateCounters(0, 0);
                renderPagination(0, 0);
                document.getElementById('ca-fetch-status').textContent = `Кеш для профиля "${profileNameToClear}" очищен.`;
                alert(`Кеш для профиля "${profileNameToClear}" успешно очищен!`);
            }
        }

        // #######################################################################
        // #######################################################################
        async function deleteProfile() {
            if (currentProfileName === 'Default') {
                alert('Нельзя удалить профиль по умолчанию.');
                return;
            }
            const profileNameToDelete = currentProfileName;
            const message = `Вы уверены, что хотите удалить профиль <b style="color: #d4506a;">${profileNameToDelete}</b>?`;
            const confirmation = await protector_customConfirm(message);
            if (confirmation) {
                const profiles = await getProfiles();
                delete profiles[profileNameToDelete];
                await saveProfiles(profiles);
                await dbDelete('scc_card_cache', profileNameToDelete);
                currentProfileName = 'Default';
                await saveCurrentProfileName(currentProfileName);
                await renderProfileSelector();
                await loadProfile();
            }
        }
        // #######################################################################
        // #######################################################################
        (function checkAndReopen() {
            if (sessionStorage.getItem('ca_should_reopen_aggregator') === 'true') {
                sessionStorage.removeItem('ca_should_reopen_aggregator');
                setTimeout(toggleMainContainer, 100);
            }
        })();

    }
    // ##############################################################################################################################################
    // КОНЕЦ БЛОКА AnimeStars Super Card Collector
    // ##############################################################################################################################################

    // #######################################################################
    // # Гарантированное удаление задачи из стека при закрытии вкладки
    // #######################################################################
    window.addEventListener('beforeunload', async () => {
        let tasks = await GM_getValue(DEMAND_TASK_STACK_KEY, []);
        const initialLength = tasks.length;
        tasks = tasks.filter(task => task.tabId !== unsafeWindow.tabIdWatch);
        if (tasks.length < initialLength) {
            await GM_setValue(DEMAND_TASK_STACK_KEY, tasks);
        }
    });

    // ##############################################################################################################################################
    // БЛОК ПОДСЧЕТА ПРОСВЕТЛЕНИЯ КЛУБОВ
    // ##############################################################################################################################################
    (function() {
        'use strict';
        function waitForElement(selector, callback) {
            const element = document.querySelector(selector);
            if (element) {
                callback();
            } else {
                setTimeout(() => waitForElement(selector, callback), 500);
            }
        }

        // #######################################################################
        // #######################################################################
        function sortAndDisplayTopClans() {
            const now = new Date();
            const utcHour = now.getUTCHours();
            const utcDay = now.getUTCDay();
            const mskHour = (utcHour + 3) % 24;
            const mskDay = (utcHour + 3 >= 24) ? (utcDay + 1) % 7 : utcDay;
            const isBonusTime = (mskDay === 6 && mskHour >= 21) || (mskDay === 0 && mskHour < 21);
            const clubs = [];
            const clubItems = document.querySelectorAll('.club-top-list__item');
            clubItems.forEach(item => {
                const nameElement = item.querySelector('.club-top-list__name');
                const enlightenmentElement = item.querySelector('.club-top-list__count > div:first-child');
                if (nameElement && enlightenmentElement) {
                    const name = nameElement.innerText.trim();
                    const enlightenmentText = enlightenmentElement.innerText.trim();
                    const match = enlightenmentText.match(/(\d+)\s\(\+\s(\d+)\)/);
                    if (match && match.length === 3) {
                        const currentEnlightenment = parseInt(match[1], 10);
                        let addedEnlightenment = parseInt(match[2], 10);
                        if (isBonusTime && addedEnlightenment <= 60) {
                            addedEnlightenment *= 3;
                        }
                        const totalEnlightenment = currentEnlightenment + addedEnlightenment;
                        clubs.push({ name, totalEnlightenment });
                    }
                }
            });
            clubs.sort((a, b) => b.totalEnlightenment - a.totalEnlightenment);
            const carouselContainer = document.querySelector('.nclub__top-carou');
            if (!carouselContainer) return;
            const oldTop5 = document.getElementById('top5-enlightenment-row');
            if (oldTop5) oldTop5.remove();
            const top5Container = document.createElement('div');
            top5Container.id = 'top5-enlightenment-row';
            Object.assign(top5Container.style, {
                marginTop: '15px', padding: '10px', backgroundColor: 'black',
                color: 'white', borderRadius: '8px', display: 'flex',
                justifyContent: 'space-around', alignItems: 'center',
                flexWrap: 'wrap', gap: '15px'
            });
            let top5Html = '';
            if (isBonusTime) {
                top5Html += `<div style="width: 100%; text-align: center; font-size: 12px; color: #ffd700; margin-bottom: 5px; font-weight: bold;">Субботний бонус (MSK): Просветление x3 активно!</div>`;
            }
            clubs.slice(0, 5).forEach((club, index) => {
                top5Html += `
        <div style="font-size: 14px; text-align: center;">
            <span style="opacity: 0.8;">№${index + 1}</span>
            <strong style="margin: 0 5px;">${club.name}</strong>:
            <span style="font-weight: bold; color: #a5d6a7;">${club.totalEnlightenment}</span>
        </div>`;
            });
            top5Container.innerHTML = top5Html;
            carouselContainer.appendChild(top5Container);
        }
        waitForElement('.nclub__top-carou .club-top-list__item', sortAndDisplayTopClans);
    })();
    // ##############################################################################################################################################
    // КОНЕЦ БЛОКА ПОДСЧЕТА ПРОСВЕТЛЕНИЯ КЛУБОВ
    // ##############################################################################################################################################

    // #######################################################################
    // # Гарантированно очищает состояние сканера при обновлении/закрытии страницы
    // #######################################################################
    window.addEventListener('beforeunload', () => {
        if (isWishlistScanning) {
            GM_deleteValue(WISHLIST_SCAN_STATE_KEY);
        }
    });

    // ##############################################################################################################################################
    // # БЛОК: СКАНЕР ЛИСТА ЖЕЛАНИЙ
    // ##############################################################################################################################################
    async function scanWishlist(username) {
        if (isWishlistScanning) {
            console.warn('[Wishlist Scanner] Попытка запустить сканирование, когда оно уже идет. Отменено.');
            safeDLEPushCall('warning', 'Сканирование уже запущено.');
            return;
        }
        isWishlistScanning = true;
        console.log(`[Wishlist Scanner] Запуск сканирования для пользователя: ${username}`);
        await GM_deleteValue(WISHLIST_SCAN_STOP_KEY);
        const previousTarget = await GM_getValue(WISHLIST_TARGET_USER_KEY, null);
        await GM_setValue(WISHLIST_PRE_SCAN_TARGET_KEY, previousTarget);
        let cardIdSet = new Set();
        let currentPage = 1;
        let totalPages = 1;
        const DELAY = 2000;
        try {
            while (true) {
                if (await GM_getValue(WISHLIST_SCAN_STOP_KEY)) {
                    console.log('[Wishlist Scanner] Получен сигнал на остановку.');
                    safeDLEPushCall('warning', 'Сканирование остановлено пользователем.');
                    break;
                }
                await GM_setValue(WISHLIST_SCAN_STATE_KEY, {
                    username: username,
                    currentPage: currentPage,
                    totalPages: totalPages,
                    foundCount: cardIdSet.size
                });
                const url = `/user/cards/need/?name=${encodeURIComponent(username)}&page=${currentPage}`;
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
                const htmlText = await response.text();
                const doc = new DOMParser().parseFromString(htmlText, 'text/html');
                const cardsOnPage = doc.querySelectorAll('.anime-cards__item');
                if (currentPage === 1 && cardsOnPage.length === 0) {
                    throw new Error('У пользователя пустой список желаний или такого пользователя не существует.');
                }
                cardsOnPage.forEach(cardEl => { if (cardEl.dataset.id) cardIdSet.add(cardEl.dataset.id); });
                if (currentPage === 1) {
                    const pageLinks = doc.querySelectorAll('.pagination__pages a, .pagination__pages span');
                    const pageNumbers = Array.from(pageLinks).map(el => parseInt(el.textContent.trim(), 10)).filter(num => !isNaN(num));
                    totalPages = pageNumbers.length > 0 ? Math.max(...pageNumbers) : 1;
                }
                if (currentPage >= totalPages) break;
                currentPage++;
                await unsafeWindow.sleep(DELAY);
            }
            const wasStopped = await GM_getValue(WISHLIST_SCAN_STOP_KEY);
            if (!wasStopped) {
                const wishlistData = { cardIds: Array.from(cardIdSet), timestamp: Date.now() };
                await unsafeWindow.dbSet(WISHLIST_DB_STORE_NAME, username, wishlistData);
                await GM_setValue(WISHLIST_TARGET_USER_KEY, username);
                activeWishlistSet = new Set(wishlistData.cardIds);
                console.log(`[Wishlist Scanner] Данные для "${username}" (${cardIdSet.size} карт) сохранены.`);
                safeDLEPushCall('success', `Список желаний для "${username}" успешно отсканирован.`);
                const button = document.getElementById('wishlistScannerBtn');
                if (button) {
                    button.style.background = 'linear-gradient(145deg, #28a745, #1e7e34)';
                }
            } else {
                const rollbackTarget = await GM_getValue(WISHLIST_PRE_SCAN_TARGET_KEY, null);
                if (rollbackTarget) {
                    await GM_setValue(WISHLIST_TARGET_USER_KEY, rollbackTarget);
                    const rollbackData = await unsafeWindow.dbGet(WISHLIST_DB_STORE_NAME, rollbackTarget);
                    activeWishlistSet = new Set(rollbackData?.cardIds || []);
                    console.log(`[Wishlist Scanner] Цель возвращена на: ${rollbackTarget}`);
                } else {
                    await GM_deleteValue(WISHLIST_TARGET_USER_KEY);
                    activeWishlistSet = null;
                }
            }
        } catch (error) {
            console.error('[Wishlist Scanner] Ошибка сканирования:', error);
            safeDLEPushCall('error', `Ошибка: ${error.message}`);
        } finally {
            isWishlistScanning = false;
            await GM_deleteValue(WISHLIST_SCAN_STATE_KEY);
            await GM_deleteValue(WISHLIST_SCAN_STOP_KEY);
            await GM_deleteValue(WISHLIST_PRE_SCAN_TARGET_KEY);
            highlightTargetUserWishlist();
        }
    }

    // #######################################################################
    // #######################################################################
    async function openWishlistSettingsModal(highlightFunction) {
        const MODAL_WRAPPER_ID = 'acm_modal_wrapper';
        if (document.getElementById(MODAL_WRAPPER_ID)) return;
        let progressIntervalId = null;
        const isPackHighlightEnabled = await GM_getValue(WISHLIST_HIGHLIGHT_PACKS_ENABLED_KEY, false);
        const isInventoryHighlightEnabled = await GM_getValue(WISHLIST_HIGHLIGHT_INVENTORY_ENABLED_KEY, false);
        const isTradeHighlightEnabled = await GM_getValue(WISHLIST_HIGHLIGHT_TRADES_ENABLED_KEY, false);
        const isLargeDeckGlowEnabled = await GM_getValue(LARGE_DECK_GLOW_ENABLED_KEY, true);
        const isSmallDeckGlowEnabled = await GM_getValue(SMALL_DECK_GLOW_ENABLED_KEY, true);
        const isSRankDeckGlowEnabled = await GM_getValue(S_RANK_DECK_GLOW_ENABLED_KEY, true);
        const isProtectionEnabled = await GM_getValue(WISHLIST_PROTECTION_ENABLED_KEY, false);
        const isGlowEnabled = await GM_getValue('ascm_wishlistGlowEnabled', true);
        const isOwnProtectionEnabled = await GM_getValue('ascm_ownWishlistProtectionEnabled', true);
        const wrapper = document.createElement('div');
        wrapper.id = MODAL_WRAPPER_ID;
        wrapper.innerHTML = `
                    <div class="acm-modal-backdrop"></div>
                    <div class="acm-modal" id="wishlist_settings_modal" style="width: 480px;">
                    <div class="modal-header"><h2>Настройки подсветки карт</h2></div>
                    <div class="modal-body">
                        <!-- Секция для сканера чужого списка желаний -->
                        <p style="font-size: 13px; color: #999; text-align: center; margin-bottom: 10px;">Никнейм пользователя, чей лист желаний отслеживать:</p>
                        <div class="input-group" style="margin-bottom: 10px;">
                            <input type="text" id="wishlist-username-input" placeholder="Никнейм пользователя">
                        </div>
                        <div id="wishlist-scan-status" style="font-size: 12px; color: #888; text-align: center; min-height: 40px; padding: 5px; border-radius: 3px; background: #1e1f22;"></div>
                        <div style="display: flex; gap: 10px; margin-top: 10px;">
                            <button id="start-wishlist-scan" class="action-btn save-btn" style="flex: 1;">Сканировать и Установить</button>
                            <button id="wishlist-clear-btn" class="action-btn" style="background-color: #d65a28; flex: 1;">Очистить цель</button>
                        </div>
                        <div style="border-top: 1px solid #33353a; margin-top: 10px; padding-top: 10px;">
                            <p style="font-size: 13px; color: #999; text-align: center; margin-bottom: 10px;">Где будет работать подсветка карт сканера:</p>
                            <div class="setting-row" style="margin-bottom: 10px;">
                                <span>Подсветка в паках</span>
                                <label class="protector-toggle-switch">
                                    <input type="checkbox" id="wishlist-packs-toggle" ${isPackHighlightEnabled ? 'checked' : ''}>
                                    <span class="protector-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="setting-row">
                                <span>Защита выбора в паках</span>
                                <label class="protector-toggle-switch">
                                    <input type="checkbox" id="wishlist-protection-toggle" ${isProtectionEnabled ? 'checked' : ''}>
                                    <span class="protector-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="setting-row" style="margin-bottom: 10px;">
                                <span>Подсветка в инвентарях</span>
                                <label class="protector-toggle-switch">
                                    <input type="checkbox" id="wishlist-inventory-toggle" ${isInventoryHighlightEnabled ? 'checked' : ''}>
                                    <span class="protector-toggle-slider"></span>
                                </label>
                            </div>
                             <div class="setting-row" style="margin-bottom: 10px;">
                                <span>Подсветка в обменах</span>
                                <label class="protector-toggle-switch">
                                    <input type="checkbox" id="wishlist-trades-toggle" ${isTradeHighlightEnabled ? 'checked' : ''}>
                                    <span class="protector-toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                         <!-- Секция для всех остальных настроек -->
                        <div style="border-top: 1px solid #4a2f3a; margin-top: 10px; padding-top: 10px;">
                             <p style="font-size: 13px; color: #999; text-align: center; margin-bottom: 10px;">Настройки для <b>вашего</b> списка желаний (карты с зеленой рамкой).</p>
                             <div class="setting-row" style="margin-bottom: 10px;">
                                <span>Подсветка в паках (свечение)</span>
                                <label class="protector-toggle-switch">
                                    <input type="checkbox" id="own-wishlist-glow-toggle" ${isGlowEnabled ? 'checked' : ''}>
                                    <span class="protector-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="setting-row">
                                <span>Защита выбора в паках</span>
                                <label class="protector-toggle-switch">
                                    <input type="checkbox" id="own-wishlist-protection-toggle" ${isOwnProtectionEnabled ? 'checked' : ''}>
                                    <span class="protector-toggle-slider"></span>
                                </label>
                            </div>
                            <div style="border-top: 1px solid #33353a; margin-top: 10px; padding-top: 10px;">
                                <p style="text-align: center; font-size: 13px; color: #999; margin-bottom: 10px;">Защита/Предупреждение о карте из листа для рангов:</p>
                                <div id="wishlist-protection-ranks" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;"></div>
                            </div>
                        </div>
                            <div style="border-top: 1px solid #33353a; margin-top: 10px; padding-top: 10px;">
                                     <p style="text-align: center; font-size: 13px; color: #999; margin-bottom: 10px;">Доп. подсветка: Колоды S/Без S</p>
                                 <div class="setting-row" style="margin-bottom: 10px;">
                                    <span>Для колод (10+ карт)</span>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <label class="protector-toggle-switch">
                                            <input type="checkbox" id="large-deck-glow-toggle">
                                            <span class="protector-toggle-slider"></span>
                                        </label>
                                        <input type="color" id="no-s-rank-color-picker" style="border: none; padding: 0; width: 40px; height: 30px; background: none; cursor: pointer;">
                                        <button id="no-s-rank-color-reset-btn" class="action-btn" style="padding: 5px 10px; font-size: 12px;" title="Сбросить цвет по умолчанию">Сброс</button>
                                    </div>
                                </div>
                        <div class="setting-row" style="margin-bottom: 10px;">
                            <span>Для не полных колод (1-9 карт)</span>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <label class="protector-toggle-switch">
                                    <input type="checkbox" id="small-deck-glow-toggle">
                                    <span class="protector-toggle-slider"></span>
                                </label>
                                <input type="color" id="small-deck-no-s-rank-color-picker" style="border: none; padding: 0; width: 40px; height: 30px; background: none; cursor: pointer;">
                                <button id="small-deck-no-s-rank-color-reset-btn" class="action-btn" style="padding: 5px 10px; font-size: 12px;" title="Сбросить цвет по умолчанию">Сброс</button>
                            </div>
                        </div>
                        <div class="setting-row" style="margin-bottom: 10px;">
                            <span>Для колод (с S-рангом)</span>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <label class="protector-toggle-switch">
                                    <input type="checkbox" id="s-rank-deck-glow-toggle">
                                    <span class="protector-toggle-slider"></span>
                                </label>
                                <input type="color" id="s-rank-deck-color-picker" style="border: none; padding: 0; width: 40px; height: 30px; background: none; cursor: pointer;">
                                <button id="s-rank-deck-color-reset-btn" class="action-btn" style="padding: 5px 10px; font-size: 12px;" title="Сбросить цвет по умолчанию">Сброс</button>
                            </div>
                        </div>
                        <div id="no-s-rank-locations-container">
                        <div class="setting-row">
                            <span>Подсвечивать в паках</span>
                            <label class="protector-toggle-switch">
                                <input type="checkbox" data-location="packs" id="no-s-glow-packs-toggle">
                                <span class="protector-toggle-slider"></span>
                            </label>
                        </div>
                        <div class="setting-row">
                            <span>Подсвечивать в инвентаре</span>
                            <label class="protector-toggle-switch">
                                <input type="checkbox" data-location="inventory" id="no-s-glow-inventory-toggle">
                                <span class="protector-toggle-slider"></span>
                            </label>
                        </div>
                         <div class="setting-row">
                            <span>Подсвечивать в трейдах</span>
                            <label class="protector-toggle-switch">
                                <input type="checkbox" data-location="trades" id="no-s-glow-trades-toggle">
                                <span class="protector-toggle-slider"></span>
                            </label>
                        </div>
                        <div class="setting-row">
                            <span>Подсвечивать в обменах (предложения)</span>
                            <label class="protector-toggle-switch">
                                <input type="checkbox" data-location="offers" id="no-s-glow-offers-toggle">
                                <span class="protector-toggle-slider"></span>
                            </label>
                        </div>
                        <div class="setting-row">
                            <span>Подсвечивать в базе карт</span>
                            <label class="protector-toggle-switch">
                                <input type="checkbox" data-location="cardbase" id="no-s-glow-cardbase-toggle">
                                <span class="protector-toggle-slider"></span>
                            </label>
                        </div>
                        </div>
                        </div>
                        </div>
                        <div class="modal-footer" style="justify-content: flex-start;">
                            <button id="wishlist-back-btn" class="action-btn back-btn">Назад</button>
                        </div>
                    </div>`;
        document.body.appendChild(wrapper);
        const scanButton = wrapper.querySelector('#start-wishlist-scan');
        const clearButton = wrapper.querySelector('#wishlist-clear-btn');
        const usernameInput = wrapper.querySelector('#wishlist-username-input');
        const statusEl = wrapper.querySelector('#wishlist-scan-status');
        const closeModal = () => {
            clearInterval(progressIntervalId);
            wrapper.remove();
        };
        const setIdleState = async () => {
            const targetUser = await GM_getValue(WISHLIST_TARGET_USER_KEY, '');
            const wishlistData = targetUser ? await unsafeWindow.dbGet(WISHLIST_DB_STORE_NAME, targetUser) : null;
            if (document.activeElement !== usernameInput) {
                usernameInput.value = targetUser;
            }
            usernameInput.disabled = false;
            let statusHTML = `Текущая цель: <b>${targetUser || 'не задана'}</b><br>Отслеживается карт: <b>${wishlistData?.cardIds?.length || 0}</b>`;
            if (wishlistData && wishlistData.timestamp) {
                const scanDate = new Date(wishlistData.timestamp);
                statusHTML += `<br>Последнее сканирование: ${scanDate.toLocaleString()}`;
            }
            statusEl.innerHTML = statusHTML;
            scanButton.textContent = 'Сканировать и Установить';
            scanButton.style.background = '';
            scanButton.disabled = false;
            scanButton.onclick = async () => {
                if (isWishlistScanning) return;
                const userInput = usernameInput.value.trim();
                if (!userInput) { safeDLEPushCall('error', 'Введите имя пользователя.'); return; }
                scanButton.disabled = true;
                scanButton.textContent = 'Запуск...';
                scanButton.style.background = 'linear-gradient(145deg, #e67e22, #d35400)';
                await scanWishlist(userInput);
            };
            clearButton.disabled = false;
        };
        const updateScanProgress = (scanState) => {
            usernameInput.value = scanState.username;
            usernameInput.disabled = true;
            statusEl.innerHTML = `Сканирую: <b>${scanState.username}</b>...<br>Стр. ${scanState.currentPage} / ${scanState.totalPages} | Найдено: ${scanState.foundCount}`;
            scanButton.textContent = 'Остановить';
            scanButton.style.background = 'linear-gradient(145deg, #e74c3c, #c0392b)';
            scanButton.disabled = false;
            scanButton.onclick = async () => {
                await GM_setValue(WISHLIST_SCAN_STOP_KEY, true);
                scanButton.disabled = true;
                scanButton.textContent = 'Остановка...';
            };
            clearButton.disabled = true;
        };
        const checkAndUpdateStatus = async () => {
            const scanState = await GM_getValue(WISHLIST_SCAN_STATE_KEY);
            if (scanState) {
                updateScanProgress(scanState);
            } else {
                if (usernameInput.disabled) {
                    await setIdleState();
                }
            }
        };
        wrapper.querySelector('.acm-modal-backdrop').onclick = closeModal;
        wrapper.querySelector('#wishlist-back-btn').onclick = () => {
            closeModal();
            unsafeWindow.openMasterSettingsModal();
        };
        const WISHLIST_PROTECTION_RANKS_KEY = 'ascm_wishlistProtectionRanks_v1';
        const defaultWishlistRanks = { ass: false, s: false, a: true, b: true, c: true, d: true, e: true };
        const savedWishlistRanks = await GM_getValue(WISHLIST_PROTECTION_RANKS_KEY, defaultWishlistRanks);
        const ranksContainer = wrapper.querySelector('#wishlist-protection-ranks');
        ['ass', 's', 'a', 'b', 'c', 'd', 'e'].forEach(rank => {
            const rankDiv = document.createElement('div');
            rankDiv.className = 'setting-row';
            rankDiv.style.flexDirection = 'column';
            rankDiv.innerHTML = `
                <span><b>${rank.toUpperCase()}</b></span>
                <label class="protector-toggle-switch" style="margin-top: 5px;">
                    <input type="checkbox" data-rank="${rank}" ${savedWishlistRanks[rank] ? 'checked' : ''}>
                    <span class="protector-toggle-slider"></span>
                </label>
            `;
            ranksContainer.appendChild(rankDiv);
        });
        wrapper.querySelector('#wishlist-clear-btn').onclick = async () => {
            const confirmation = await protector_customConfirm('Вы уверены, что хотите очистить текущую цель сканера?');
            if (confirmation) {
                await GM_deleteValue(WISHLIST_TARGET_USER_KEY);
                activeWishlistSet = null;
                safeDLEPushCall('info', 'Цель для сканера желаний очищена.');
                document.querySelectorAll('.wishlist-highlight-pack, .wishlist-highlight-inventory').forEach(card => {
                    card.classList.remove('wishlist-highlight-pack', 'wishlist-highlight-inventory');
                    card.querySelector('.wishlist-indicator-icon')?.remove();
                });
                const button = document.getElementById('wishlistScannerBtn');
                if (button) button.style.background = 'linear-gradient(145deg, rgb(166, 100, 110), rgb(222, 0, 5))';
                await setIdleState();
            }
        };
        const allToggles = wrapper.querySelectorAll('input[type="checkbox"]');
        allToggles.forEach(toggle => {
            toggle.addEventListener('change', async (event) => {
                const target = event.target;
                const keyMap = {
                    'own-wishlist-glow-toggle': 'ascm_wishlistGlowEnabled',
                    'own-wishlist-protection-toggle': 'ascm_ownWishlistProtectionEnabled',
                    'wishlist-packs-toggle': WISHLIST_HIGHLIGHT_PACKS_ENABLED_KEY,
                    'wishlist-inventory-toggle': WISHLIST_HIGHLIGHT_INVENTORY_ENABLED_KEY,
                    'wishlist-trades-toggle': WISHLIST_HIGHLIGHT_TRADES_ENABLED_KEY,
                    'wishlist-protection-toggle': WISHLIST_PROTECTION_ENABLED_KEY,
                };
                if (keyMap[target.id]) {
                    await GM_setValue(keyMap[target.id], target.checked);
                    safeDLEPushCall('info', 'Настройка сохранена!');
                    if (target.id === 'wishlist-packs-toggle') {
                        if (target.checked) {
                            createWishlistScannerFeature();
                        } else {
                            const buttonToRemove = document.getElementById('wishlistScannerBtn');
                            if (buttonToRemove) {
                                buttonToRemove.remove();
                            }
                        }
                    }
                    if (target.id === 'own-wishlist-glow-toggle') {
                        highlightWishlistCardsInPack();
                    } else if (['wishlist-packs-toggle', 'wishlist-inventory-toggle', 'wishlist-trades-toggle'].includes(target.id)) {
                        if (target.checked) {
                            if (!activeWishlistSet || activeWishlistSet.size === 0) {
                                const targetUserForWishlist = await GM_getValue(WISHLIST_TARGET_USER_KEY);
                                if (targetUserForWishlist) {
                                    const wishlistData = await unsafeWindow.dbGet(WISHLIST_DB_STORE_NAME, targetUserForWishlist);
                                    if (wishlistData?.cardIds) {
                                        activeWishlistSet = new Set(wishlistData.cardIds);
                                    }
                                }
                            }
                            highlightTargetUserWishlist();
                        } else {
                            removeWishlistHighlights();
                        }
                    }
                } else if (target.dataset.rank) {
                    const newWishlistRanks = {};
                    wrapper.querySelectorAll('#wishlist-protection-ranks input[type="checkbox"]').forEach(cb => {
                        newWishlistRanks[cb.dataset.rank] = cb.checked;
                    });
                    await GM_setValue(WISHLIST_PROTECTION_RANKS_KEY, newWishlistRanks);
                    safeDLEPushCall('info', 'Настройки рангов сохранены!');
                }
            });
        });
        const colorPicker = wrapper.querySelector('#no-s-rank-color-picker');
        colorPicker.value = await GM_getValue(NO_S_RANK_GLOW_COLOR_KEY, DEFAULT_NO_S_RANK_GLOW_COLOR);
        colorPicker.addEventListener('change', async (event) => {
            const newColor = event.target.value;
            await GM_setValue(NO_S_RANK_GLOW_COLOR_KEY, newColor);
            await unsafeWindow.applyNoSRankGlowStyle();
            if (typeof safeDLEPushCall === 'function') safeDLEPushCall('info', `Цвет подсветки обновлен!`);
        });
        const resetButton = wrapper.querySelector('#no-s-rank-color-reset-btn');
        resetButton.addEventListener('click', async () => {
            colorPicker.value = DEFAULT_NO_S_RANK_GLOW_COLOR;
            await GM_setValue(NO_S_RANK_GLOW_COLOR_KEY, DEFAULT_NO_S_RANK_GLOW_COLOR);
            await unsafeWindow.applyNoSRankGlowStyle();
            if (typeof safeDLEPushCall === 'function') safeDLEPushCall('info', 'Цвет сброшен по умолчанию!');
        });
        const smallDeckColorPicker = wrapper.querySelector('#small-deck-no-s-rank-color-picker');
        smallDeckColorPicker.value = await GM_getValue(SMALL_DECK_NO_S_RANK_GLOW_COLOR_KEY, DEFAULT_SMALL_DECK_NO_S_RANK_GLOW_COLOR);
        smallDeckColorPicker.addEventListener('change', async (event) => {
            const newColor = event.target.value;
            await GM_setValue(SMALL_DECK_NO_S_RANK_GLOW_COLOR_KEY, newColor);
            await unsafeWindow.applyNoSRankGlowStyle();
            if (typeof safeDLEPushCall === 'function') safeDLEPushCall('info', `Цвет подсветки малых колод обновлен!`);
        });
        const smallDeckResetButton = wrapper.querySelector('#small-deck-no-s-rank-color-reset-btn');
        smallDeckResetButton.addEventListener('click', async () => {
            smallDeckColorPicker.value = DEFAULT_SMALL_DECK_NO_S_RANK_GLOW_COLOR;
            await GM_setValue(SMALL_DECK_NO_S_RANK_GLOW_COLOR_KEY, DEFAULT_SMALL_DECK_NO_S_RANK_GLOW_COLOR);
            await unsafeWindow.applyNoSRankGlowStyle();
            if (typeof safeDLEPushCall === 'function') safeDLEPushCall('info', 'Цвет для малых колод сброшен!');
        });
        wrapper.querySelector('#no-s-glow-packs-toggle').checked = await GM_getValue(NO_S_RANK_GLOW_PACKS_KEY, false);
        wrapper.querySelector('#no-s-glow-inventory-toggle').checked = await GM_getValue(NO_S_RANK_GLOW_INVENTORY_KEY, false);
        wrapper.querySelector('#no-s-glow-trades-toggle').checked = await GM_getValue(NO_S_RANK_GLOW_TRADES_KEY, false);
        wrapper.querySelector('#no-s-glow-offers-toggle').checked = await GM_getValue(NO_S_RANK_GLOW_OFFERS_KEY, false);
        wrapper.querySelector('#no-s-glow-cardbase-toggle').checked = await GM_getValue(NO_S_RANK_GLOW_CARDBASE_KEY, false);
        const locationsContainer = wrapper.querySelector('#no-s-rank-locations-container');
        const sRankColorPicker = wrapper.querySelector('#s-rank-deck-color-picker');
        wrapper.querySelector('#large-deck-glow-toggle').checked = isLargeDeckGlowEnabled;
        wrapper.querySelector('#small-deck-glow-toggle').checked = isSmallDeckGlowEnabled;
        wrapper.querySelector('#s-rank-deck-glow-toggle').checked = isSRankDeckGlowEnabled;
        sRankColorPicker.value = await GM_getValue(S_RANK_DECK_GLOW_COLOR_KEY, DEFAULT_S_RANK_DECK_GLOW_COLOR);
        sRankColorPicker.addEventListener('change', async (event) => {
            const newColor = event.target.value;
            await GM_setValue(S_RANK_DECK_GLOW_COLOR_KEY, newColor);
            await unsafeWindow.applyNoSRankGlowStyle();
            if (typeof safeDLEPushCall === 'function') safeDLEPushCall('info', `Цвет подсветки S-колод обновлен!`);
        });
        const sRankResetButton = wrapper.querySelector('#s-rank-deck-color-reset-btn');
        sRankResetButton.addEventListener('click', async () => {
            sRankColorPicker.value = DEFAULT_S_RANK_DECK_GLOW_COLOR;
            await GM_setValue(S_RANK_DECK_GLOW_COLOR_KEY, DEFAULT_S_RANK_DECK_GLOW_COLOR);
            await unsafeWindow.applyNoSRankGlowStyle();
            if (typeof safeDLEPushCall === 'function') safeDLEPushCall('info', 'Цвет для S-колод сброшен!');
        });
        wrapper.querySelectorAll('#large-deck-glow-toggle, #small-deck-glow-toggle, #s-rank-deck-glow-toggle').forEach(toggle => {
            toggle.addEventListener('change', async (event) => {
                const map = {
                    'large-deck-glow-toggle': LARGE_DECK_GLOW_ENABLED_KEY,
                    'small-deck-glow-toggle': SMALL_DECK_GLOW_ENABLED_KEY,
                    's-rank-deck-glow-toggle': S_RANK_DECK_GLOW_ENABLED_KEY
                };
                const key = map[event.target.id];
                await GM_setValue(key, event.target.checked);
                await unsafeWindow.highlightNoSRankDecks();
                if (typeof safeDLEPushCall === 'function') safeDLEPushCall('info', `Подсветка для колод ${event.target.checked ? 'включена' : 'выключена'}!`);
            });
        });
        locationsContainer.addEventListener('change', async (event) => {
            if (event.target.matches('input[type="checkbox"]')) {
                const location = event.target.dataset.location;
                const newState = event.target.checked;
                let keyToSave;
                if (location === 'packs') {
                    keyToSave = NO_S_RANK_GLOW_PACKS_KEY;
                } else if (location === 'inventory') {
                    keyToSave = NO_S_RANK_GLOW_INVENTORY_KEY;
                } else if (location === 'trades') {
                    keyToSave = NO_S_RANK_GLOW_TRADES_KEY;
                } else if (location === 'offers') {
                    keyToSave = NO_S_RANK_GLOW_OFFERS_KEY;
                } else if (location === 'cardbase') {
                    keyToSave = NO_S_RANK_GLOW_CARDBASE_KEY;
                }
                if (keyToSave) {
                    await GM_setValue(keyToSave, newState);
                }
                if (typeof unsafeWindow.highlightNoSRankDecks === 'function') {
                    await unsafeWindow.highlightNoSRankDecks();
                }
                if (typeof safeDLEPushCall === 'function') {
                    safeDLEPushCall('info', `Настройка подсветки применена!`);
                }
            }
        });
        setIdleState();
        progressIntervalId = setInterval(checkAndUpdateStatus, 1000);
    }
    unsafeWindow.openWishlistSettingsModal = openWishlistSettingsModal;

    // #######################################################################
    // #######################################################################
    async function openFreshnessSettingsModal() {
        const MODAL_WRAPPER_ID = 'acm_modal_wrapper';
        if (document.getElementById(MODAL_WRAPPER_ID)) return;
        const isOverlayEnabled = await GM_getValue(FRESHNESS_OVERLAY_ENABLED_KEY, true);
        const isProtectionEnabled = await GM_getValue(FRESHNESS_PROTECTION_ENABLED_KEY, true);
        const threshold = await GM_getValue(FRESHNESS_PROTECTION_THRESHOLD_KEY, 200);
        const wrapper = document.createElement('div');
        wrapper.id = MODAL_WRAPPER_ID;
        wrapper.innerHTML = `
        <div class="acm-modal-backdrop"></div>
        <div class="acm-modal" id="freshness_settings_modal" style="width: 480px;">
            <div class="modal-header"><h2>Настройки Новизны Карт</h2></div>
            <div class="modal-body">
                <div class="setting-row" style="margin-bottom: 25px;">
                    <span>Включить индикатор новизны на картах (ID)</span>
                    <label class="protector-toggle-switch">
                        <input type="checkbox" id="freshness-overlay-toggle" ${isOverlayEnabled ? 'checked' : ''}>
                        <span class="protector-toggle-slider"></span>
                    </label>
                </div>
                <!-- Контейнер для настроек защиты, который мы будем включать/выключать -->
                <div id="freshness-protection-container" style="border-top: 1px solid #33353a; padding-top: 15px; transition: opacity 0.3s ease;">
                    <div class="setting-row" style="margin-bottom: 25px;">
                        <span>Включить защиту новизны в паках</span>
                        <label class="protector-toggle-switch">
                            <input type="checkbox" id="freshness-protection-toggle" ${isProtectionEnabled ? 'checked' : ''}>
                            <span class="protector-toggle-slider"></span>
                        </label>
                    </div>
                    <div style="text-align: center;">
                        <label for="freshness-threshold-slider" style="display: block; font-size: 13px; color: #999; margin-bottom: 10px;">
                            Защищать последние N карт добавленные в базу:
                        </label>
                        <input type="range" id="freshness-threshold-slider" min="10" max="1000" step="10" value="${threshold}" style="width: 80%;">
                        <div id="freshness-threshold-value" style="margin-top: 5px; font-weight: bold; color: #ddd; font-family: monospace;">${threshold}</div>
                    </div>
                    <!-- НОВЫЙ БЛОК ДЛЯ РАНГОВ -->
                    <div id="freshness-ranks-container" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #33353a;">
                        <p style="text-align: center; font-size: 13px; color: #999; margin-bottom: 5px;">Защищать для рангов:</p>
                        <div id="freshness-protection-ranks" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;"></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="justify-content: space-between;">
                <button id="freshness-back-btn" class="action-btn back-btn">Назад</button>
                <button id="freshness-save-btn" class="action-btn save-btn">Сохранить</button>
            </div>
        </div>`;
        document.body.appendChild(wrapper);
        const overlayToggle = wrapper.querySelector('#freshness-overlay-toggle');
        const protectionContainer = wrapper.querySelector('#freshness-protection-container');
        const slider = wrapper.querySelector('#freshness-threshold-slider');
        const display = wrapper.querySelector('#freshness-threshold-value');
        const updateProtectionBlockState = () => {
            const isEnabled = overlayToggle.checked;
            protectionContainer.style.opacity = isEnabled ? '1' : '0.4';
            protectionContainer.style.pointerEvents = isEnabled ? 'auto' : 'none';
        };
        updateProtectionBlockState();
        overlayToggle.addEventListener('change', updateProtectionBlockState);

        slider.addEventListener('input', () => {
            display.textContent = slider.value;
        });
        const closeModal = () => wrapper.remove();
        wrapper.querySelector('.acm-modal-backdrop').onclick = closeModal;
        wrapper.querySelector('#freshness-back-btn').onclick = () => {
            closeModal();
            unsafeWindow.openMasterSettingsModal();
        };
        const FRESHNESS_PROTECTION_RANKS_KEY = 'ascm_freshnessProtectionRanks_v1';
        const defaultFreshnessRanks = { ass: false, s: false, a: true, b: true, c: true, d: true, e: true };
        const savedFreshnessRanks = await GM_getValue(FRESHNESS_PROTECTION_RANKS_KEY, defaultFreshnessRanks);
        const ranksContainerFreshness = wrapper.querySelector('#freshness-protection-ranks');
        ['ass', 's', 'a', 'b', 'c', 'd', 'e'].forEach(rank => {
            const rankDiv = document.createElement('div');
            rankDiv.className = 'setting-row';
            rankDiv.style.flexDirection = 'column';
            rankDiv.innerHTML = `
                <span><b>${rank.toUpperCase()}</b></span>
                <label class="protector-toggle-switch" style="margin-top: 5px;">
                    <input type="checkbox" data-rank="${rank}" ${savedFreshnessRanks[rank] ? 'checked' : ''}>
                    <span class="protector-toggle-slider"></span>
                </label>
            `;
            ranksContainerFreshness.appendChild(rankDiv);
        });
        wrapper.querySelector('#freshness-save-btn').onclick = async () => {
            const newIsOverlayEnabled = overlayToggle.checked;
            const newIsProtectionEnabled = newIsOverlayEnabled && wrapper.querySelector('#freshness-protection-toggle').checked;
            const newFreshnessRanks = {};
            wrapper.querySelectorAll('#freshness-protection-ranks input[type="checkbox"]').forEach(cb => {
                newFreshnessRanks[cb.dataset.rank] = cb.checked;
            });
            await GM_setValue(FRESHNESS_PROTECTION_RANKS_KEY, newFreshnessRanks);
            const newThreshold = parseInt(slider.value, 10);
            let shouldReload = false;
            if (newIsOverlayEnabled !== isOverlayEnabled) {
                await GM_setValue(FRESHNESS_OVERLAY_ENABLED_KEY, newIsOverlayEnabled);
                shouldReload = true;
            }
            await GM_setValue(FRESHNESS_PROTECTION_ENABLED_KEY, newIsProtectionEnabled);
            await GM_setValue(FRESHNESS_PROTECTION_THRESHOLD_KEY, newThreshold);
            closeModal();
            if (shouldReload) {
                safeDLEPushCall('success', 'Настройки новизны сохранены! Перезагрузка...');
                setTimeout(() => window.location.reload(), 1500);
            } else {
                safeDLEPushCall('success', 'Настройки защиты новизны сохранены!');
            }
        };
    }

    // #######################################################################
    // # Принудительно удаляет все виды подсветки вишлиста с карт
    // #######################################################################
    function removeWishlistHighlights() {
        document.querySelectorAll('.wishlist-highlight-pack, .wishlist-highlight-inventory, .wishlist-card-glow').forEach(card => {
            card.classList.remove('wishlist-highlight-pack', 'wishlist-highlight-inventory', 'wishlist-card-glow');
            card.querySelector('.wishlist-indicator-icon')?.remove();
        });
        // Специально для подсветки своего вишлиста в паках
        if (typeof highlightWishlistCardsInPack === 'function') {
            highlightWishlistCardsInPack();
        }
    }

    // #######################################################################
    // #######################################################################
    async function highlightTargetUserWishlist() {
        if (isHighlightingWishlist) return;
        if (!activeWishlistSet || activeWishlistSet.size === 0) {
            return;
        }
        isHighlightingWishlist = true;
        try {
            let cardsToScan = [];
            let classToApply = '';
            const isTradePage = () => window.location.pathname.startsWith('/trades/') || /^\/cards\/\d+\/trade\/?$/.test(window.location.pathname);
            if (unsafeWindow.isCardPackPage()) {
                const isPackHighlightEnabled = await GM_getValue(WISHLIST_HIGHLIGHT_PACKS_ENABLED_KEY, false);
                if (isPackHighlightEnabled) {
                    cardsToScan = document.querySelectorAll('.lootbox__row .lootbox__card');
                    classToApply = 'wishlist-highlight-pack';
                }
            } else if (isTradePage()) {
                const isTradeHighlightEnabled = await GM_getValue(WISHLIST_HIGHLIGHT_TRADES_ENABLED_KEY, false);
                if (isTradeHighlightEnabled) {
                    cardsToScan = document.querySelectorAll('.trade__inventory-item, .trade__main-item');
                    classToApply = 'wishlist-highlight-inventory';
                }
            } else if (unsafeWindow.isMyCardPage()) {
                const isInventoryHighlightEnabled = await GM_getValue(WISHLIST_HIGHLIGHT_INVENTORY_ENABLED_KEY, false);
                if (isInventoryHighlightEnabled) {
                    const mainContainer = document.querySelector('.anime-cards--full-page');
                    if (mainContainer) {
                        cardsToScan = mainContainer.querySelectorAll('.anime-cards__item');
                    }
                    classToApply = 'wishlist-highlight-inventory';
                }
            }
            if (!classToApply) {
                document.querySelectorAll('.wishlist-highlight-pack, .wishlist-highlight-inventory').forEach(card => {
                    card.classList.remove('wishlist-highlight-pack', 'wishlist-highlight-inventory');
                    card.querySelector('.wishlist-indicator-icon')?.remove();
                });
                return;
            }
            if (cardsToScan.length === 0) {
                return;
            }
            for (const card of cardsToScan) {
                const cardId = await unsafeWindow.getCardId(card, 'type', true);
                const cardIsInWishlist = cardId && activeWishlistSet.has(cardId);
                card.classList.remove('wishlist-highlight-pack', 'wishlist-highlight-inventory');
                if (cardIsInWishlist) {
                    card.classList.add(classToApply);
                    if (!card.querySelector('.wishlist-indicator-icon')) {
                        const indicator = document.createElement('div');
                        indicator.className = 'wishlist-indicator-icon';
                        indicator.innerHTML = '<i class="fas fa-heart" style="color: #ffeb3b; text-shadow: 0 0 5px black;"></i>';
                        indicator.title = 'Эта карта в отслеживаемом списке желаний!';
                        Object.assign(indicator.style, {
                            position: 'absolute', top: '5px', left: '5px',
                            zIndex: '15', fontSize: '16px'
                        });
                        card.appendChild(indicator);
                    }
                } else {
                    card.querySelector('.wishlist-indicator-icon')?.remove();
                }
            }
        } finally {
            isHighlightingWishlist = false;
        }
    }

    // #######################################################################
    // #######################################################################
    async function createWishlistScannerFeature() {
        if (!unsafeWindow.isCardPackPage()) return;
        const isPackHighlightEnabled = await GM_getValue(WISHLIST_HIGHLIGHT_PACKS_ENABLED_KEY, false);
        if (!isPackHighlightEnabled) {
            return;
        }
        const button = document.createElement('button');
        button.id = 'wishlistScannerBtn';
        button.title = 'Сканер листа желаний';
        Object.assign(button.style, {
            position: 'fixed', bottom: '423px', right: '12px', zIndex: '102',
            width: '40px', height: '20px',
            background: 'linear-gradient(145deg, rgb(166, 100, 110), rgb(222, 0, 5))',
            color: 'white', border: 'none', borderRadius: '20px 20px 0 0',
            transition: 'all 0.2s ease', cursor: 'pointer',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)', padding: '0',
            mask: 'radial-gradient(circle at 50% 175%, transparent 24px, black 0px)',
            '-webkit-mask': 'radial-gradient(circle at 50% 175%, transparent 24px, black 0px)',
        });
        const targetUser = await GM_getValue(WISHLIST_TARGET_USER_KEY, null);
        if (targetUser) {
            button.style.background = 'linear-gradient(145deg, #28a745, #1e7e34)';
        }
        const iconWrapper = document.createElement('div');
        Object.assign(iconWrapper.style, {
            position: 'absolute', top: '0', left: '0',
            width: '100%', height: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
        });
        iconWrapper.innerHTML = '<span class="fal fa-heart" style="font-size: 14px; color: black; transform: translateY(-3px);"></span>';
        button.appendChild(iconWrapper);
        button.onclick = openWishlistSettingsModal;
        document.body.appendChild(button);
        if (!managedButtonSelectors.includes('#wishlistScannerBtn')) {
            managedButtonSelectors.push('#wishlistScannerBtn');
        }
        if (typeof unsafeWindow.applyManagedButtonsVisibility === 'function') {
            unsafeWindow.applyManagedButtonsVisibility();
        }
        if (typeof unsafeWindow.applyManagedButtonsVisibility === 'function') {
            unsafeWindow.applyManagedButtonsVisibility();
        }
        const observerTargetNode = document.querySelector('.ncard-pack.lootbox');
        if (!observerTargetNode) return;
        const wishlistObserver = new MutationObserver(() => {
            const lootboxRow = document.querySelector('.lootbox__row');
            if (!lootboxRow || !lootboxRow.dataset.packId || lootboxRow.offsetParent === null) return;
            const currentPackId = lootboxRow.dataset.packId;
            if (currentPackId && currentPackId !== (unsafeWindow.lastProcessedPackIdForWishlist || null)) {
                unsafeWindow.lastProcessedPackIdForWishlist = currentPackId;
                setTimeout(highlightTargetUserWishlist, 300);
            }
        });
        wishlistObserver.observe(observerTargetNode, {
            childList: true, subtree: true, attributes: true,
            attributeFilter: ['style', 'data-pack-id', 'class']
        });
    }
    // ##############################################################################################################################################
    // # КОНЕЦ БЛОКА: СКАНЕР ЛИСТА ЖЕЛАНИЙ
    // ##############################################################################################################################################

    // ##############################################################################################################################################
    // # БЛОК: ПОДСВЕТКА КАРТ ИЗ СПИСКА ЖЕЛАНИЙ В ПАКАХ
    // ##############################################################################################################################################
    let packLoadingObserverIsSetup = false;
    async function highlightWishlistCardsInPack() {
        if (!unsafeWindow.isCardPackPage()) return;
        if (!packLoadingObserverIsSetup) {
            document.body.addEventListener('click', (event) => {
                if (event.target.closest('.lootbox__row .lootbox__card')) {
                    const currentlyHighlighted = document.querySelectorAll('.lootbox__row .lootbox__card.wishlist-card-glow');
                    currentlyHighlighted.forEach(card => {
                        card.classList.remove('wishlist-card-glow');
                    });
                }
            }, true);
            packLoadingObserverIsSetup = true;
        }
        const isEnabled = await GM_getValue('ascm_wishlistGlowEnabled', true);
        if (!isEnabled) {
            document.querySelectorAll('.lootbox__row .lootbox__card.wishlist-card-glow').forEach(card => {
                card.classList.remove('wishlist-card-glow');
            });
            return;
        }
        const wishlistCards = document.querySelectorAll('.lootbox__row .lootbox__card.anime-cards__owned-by-user-want');
        wishlistCards.forEach(card => {
            card.classList.add('wishlist-card-glow');
        });
    }
    // ##############################################################################################################################################
    // # КОНЕЦ БЛОКА: ПОДСВЕТКА КАРТ ИЗ СПИСКА ЖЕЛАНИЙ В ПАКАХ
    // ##############################################################################################################################################

}
runMainScript();