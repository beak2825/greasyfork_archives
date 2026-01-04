// ==UserScript==
// @name             Steam Currency Converter
// @name:ru          Конвертер валют в Steam
// @version          0.8.9
// @namespace        https://store.steampowered.com/
// @description      Convert Steam prices between any currencies with commission support.
// @description:ru   Конвертирует цены Steam между любой валютой с поддержкой комиссии.
// @author           NeTan
// @license          MIT
// @match            https://store.steampowered.com/*
// @match            https://steamcommunity.com/*
// @match            https://checkout.steampowered.com/*
// @icon             https://icons.duckduckgo.com/ip3/steampowered.com.ico
// @grant            GM_xmlhttpRequest
// @grant            GM_getValue
// @grant            GM_setValue
// @grant            GM_deleteValue
// @grant            GM_addStyle
// @grant            GM_registerMenuCommand
// @connect          cdn.jsdelivr.net
// @downloadURL https://update.greasyfork.org/scripts/554182/Steam%20Currency%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/554182/Steam%20Currency%20Converter.meta.js
// ==/UserScript==

// --- DEBUG LOGGER ---
// (чтобы включить подробный лог, измените false на true)
const DEBUG_MODE = false;
const log = (message, ...args) => {
    if (DEBUG_MODE) {
        console.log("SCC DEBUG:", message, ...args);
    }
};
const warn = (message, ...args) => {
    if (DEBUG_MODE) {
        console.warn("SCC WARN:", message, ...args);
    }
};
const error = (message, ...args) => {
    console.error("SCC ERROR:", message, ...args);
};
// --- END LOGGER ---

// Language configuration
const LANGUAGES = {
    en: {
        noConversions: "No active conversions.\n\n",
        currentConversions: "Current conversions:\n",
        clearAll: '- "clear" or "0" to remove all\n',
        enterAbbr: "Enter abbreviation or clear/0:\n\n",
        available: "Available (abbr.): ",
        invalidAbbr: abbr => `Invalid abbreviation: ${abbr}`,
        commissionPrompt: (abbr, sym, current) => `Commission for ${abbr} (${sym}) in % (0 for no commission, "del" to remove):\nCurrent: ${current}%`,
        allRemoved: "All conversions removed.",
        removed: abbr => `Conversion to ${abbr} removed.`,
        invalidValue: 'Invalid value. Enter non-negative number or "del".',
        setCommission: (abbr, comm) => `Conversion to ${abbr} set to ${comm}%.`,
        hideToggle: status => `Hide original price ${status}.\nReloading page...`,
        menuConversions: (num) => num > 0 ? `Edit conversions (${num} currencies)` : "Select currency for conversion",
        menuHide: (enabled) => `Hide original price: ${enabled ? "on" : "off"}`,
        addMissing: "Add missing price selector",
        enterMissingPrice: "Enter the text of the unconverted price (e.g., '123.45₽'):",
        priceNotFound: "Could not generate a useful selector for this element.",
        selectorAlreadyAdded: "Selector already added.",
        selectorAdded: "Added selector: ",
        addMissingInstructions: "Click on the unconverted price. The page will reload.",
        invalidPriceClick: "The selected element does not contain a price with the active currency symbol. Please try again.",
        menuManageSelectors: "Manage custom selectors",
        currentSelectors: "Current custom selectors:",
        noSelectors: "No custom selectors added.",
        removeSelectorPrompt: "Enter the number of the selector to remove (or 0/cancel to exit):",
        selectorRemoved: sel => `Removed selector: ${sel}`,
    },
    ru: {
        noConversions: "Нет активных конвертаций.\n\n",
        currentConversions: "Текущие конвертации:\n",
        clearAll: '- "clear" или "0" для удаления всех\n',
        enterAbbr: "Введите аббревиатуру или clear/0:\n\n",
        available: "Доступные (аббр.): ",
        invalidAbbr: abbr => `Неверная аббревиатура: ${abbr}`,
        commissionPrompt: (abbr, sym, current) => `Комиссия для ${abbr} (${sym}) в % (0 для конвертации без комиссии, "del" для удаления):\nТекущее: ${current}%`,
        allRemoved: "Все конвертации удалены.",
        removed: abbr => `Конвертация в ${abbr} удалена.`,
        invalidValue: `Неверное значение.\nВведите неотрицательное число или "del".`,
        setCommission: (abbr, comm) => `Конвертация в ${abbr} установлена на ${comm}%.`,
        hideToggle: status => `Скрытие оригинальной цены ${status}.\nПерезагрузка страницы...`,
        menuConversions: (num) => num > 0 ? `Изменить конвертации (${num} валют)` : "Выбрать валюту для конвертации",
        menuHide: (enabled) => `Скрывать оригинальную цену: ${enabled ? "вкл" : "выкл"}`,
        addMissing: "Добавить пропущенную цену",
        enterMissingPrice: "Введите текст неконвертированной цены (например, '123.45₽'):",
        priceNotFound: "Не удалось создать полезный селектор для этого элемента.",
        selectorAlreadyAdded: "Селектор уже добавлен.",
        selectorAdded: "Добавлен селектор: ",
        addMissingInstructions: "Нажмите на неконвертированную цену. Страница перезагрузится.",
        invalidPriceClick: "Выбранный элемент не содержит цену с символом активной валюты. Пожалуйста, попробуйте еще раз.",
        menuManageSelectors: "Управление селекторами",
        currentSelectors: "Текущие добавленные селекторы:",
        noSelectors: "Нет добавленных селекторов.",
        removeSelectorPrompt: "Введите номер селектора для удаления (или 0/отмена для выхода):",
        selectorRemoved: sel => `Удален селектор: ${sel}`,
    }
};

// Currency symbol to abbreviation mapping
const CURRENCY_SYMBOLS = {
    "₸": "KZT",
    "TL": "TRY",
    "€": "EUR",
    "£": "GBP",
    "ARS$": "ARS",
    "₴": "UAH",
    "$": "USD", // Примечание: $ используется для USD, CAD, AUD, MXN и др. USD является запасным вариантом.
    "₽": "RUB",
    "Br": "BYN",
    "฿": "THB",
    "zł": "PLN",
    "R$": "BRL",
    "¥": "JPY", // Примечание: JPY и CNY используют ¥. JPY более вероятен без префикса.
    "CNY ¥": "CNY",
    "₩": "KRW",
    "A$": "AUD",
    "CDN$": "CAD",
    "CHF": "CHF",
    "kr": "NOK", // Также используется DKK, SEK. NOK - базовый вариант.
    "MXN$": "MXN",
    "₹": "INR",
    "AED": "AED",
    "SAR": "SAR",
    "R": "ZAR",
    "CLP$": "CLP",
    "S/.": "PEN",
    "COL$": "COP",
    "$U": "UYU",
    "₡": "CRC",
    "₪": "ILS",
    "KWD": "KWD",
    "QR": "QAR",
    "HK$": "HKD",
    "NT$": "TWD",
    "S$": "SGD",
    "Rp": "IDR",
    "RM": "MYR",
    "₱": "PHP",
    "₫": "VND"
};
// Abbreviation to symbol mapping
const ABBREVIATION_SYMBOLS = {};
Object.entries(CURRENCY_SYMBOLS).forEach(([symbol, abbr]) => {
    // Не перезаписываем $ -> USD, если уже есть
    if (!ABBREVIATION_SYMBOLS[abbr]) {
        ABBREVIATION_SYMBOLS[abbr] = symbol;
    }
});
// Добавляем $ вручную для валют, которые могут его использовать
ABBREVIATION_SYMBOLS["USD"] = "$";
ABBREVIATION_SYMBOLS["CAD"] = "CDN$";
ABBREVIATION_SYMBOLS["AUD"] = "A$";
ABBREVIATION_SYMBOLS["MXN"] = "MXN$";


// Supported Steam currencies
const SUPPORTED_CURRENCIES = [
    // Основные (из старого списка)
    { id: 1, code: "USD", sign: "$", description: "United States Dollars" },
    { id: 5, code: "RUB", sign: "₽", description: "Russian Rouble" },
    { id: 17, code: "TRY", sign: "TL", description: "Turkish Lira" },
    { id: 18, code: "UAH", sign: "₴", description: "Ukrainian Hryvnia" },
    { id: 29, code: "THB", sign: "฿", description: "Thai Baht" },
    { id: 34, code: "ARS", sign: "ARS$", description: "Argentine Peso" },
    { id: 37, code: "KZT", sign: "₸", description: "Kazakhstani Tenge" },
    { id: 42, code: "BYN", sign: "Br", description: "Belarusian Ruble" },

    // Добавленные
    { id: 2, code: "GBP", sign: "£", description: "British Pound" },
    { id: 3, code: "EUR", sign: "€", description: "European Union Euro" },
    { id: 6, code: "PLN", sign: "zł", description: "Polish Złoty" },
    { id: 7, code: "BRL", sign: "R$", description: "Brazilian Real" },
    { id: 8, code: "JPY", sign: "¥", description: "Japanese Yen" },
    { id: 9, code: "NOK", sign: "kr", description: "Norwegian Krone" },
    { id: 10, code: "CAD", sign: "CDN$", description: "Canadian Dollar" },
    { id: 11, code: "AUD", sign: "A$", description: "Australian Dollar" },
    { id: 12, code: "CHF", sign: "CHF", description: "Swiss Franc" },
    { id: 19, code: "MXN", sign: "MXN$", description: "Mexican Peso" },
    { id: 20, code: "INR", sign: "₹", description: "Indian Rupee" },
    { id: 21, code: "CLP", sign: "CLP$", description: "Chilean Peso" },
    { id: 22, code: "PEN", sign: "S/.", description: "Peruvian Sol" },
    { id: 23, code: "KRW", sign: "₩", description: "South Korean Won" },
    { id: 24, code: "COP", sign: "COL$", description: "Colombian Peso" },
    { id: 25, code: "CNY", sign: "CNY ¥", description: "Chinese Yuan" },
    { id: 26, code: "ZAR", sign: "R", description: "South African Rand" },
    { id: 27, code: "AED", sign: "AED", description: "United Arab Emirates Dirham" },
    { id: 28, code: "SAR", sign: "SAR", description: "Saudi Riyal" },
    { id: 30, code: "UYU", sign: "$U", description: "Uruguayan Peso" },
    { id: 31, code: "CRC", sign: "₡", description: "Costa Rican Colón" },
    { id: 32, code: "ILS", sign: "₪", description: "Israeli New Shekel" },
    { id: 33, code: "KWD", sign: "KWD", description: "Kuwaiti Dinar" },
    { id: 35, code: "QAR", sign: "QR", description: "Qatari Riyal" },
    { id: 36, code: "HKD", sign: "HK$", description: "Hong Kong Dollar" },
    { id: 38, code: "TWD", sign: "NT$", description: "New Taiwan Dollar" },
    { id: 39, code: "SGD", sign: "S$", description: "Singapore Dollar" },
    { id: 40, code: "IDR", sign: "Rp", description: "Indonesian Rupiah" },
    { id: 41, code: "MYR", sign: "RM", description: "Malaysian Ringgit" },
    { id: 43, code: "PHP", sign: "₱", description: "Philippine Peso" },
    { id: 44, code: "VND", sign: "₫", description: "Vietnamese Đồng" }
];
// Currencies using COMMA as decimal separator
const COMMA_DECIMAL_CURRENCIES = [
    "KZT", "TRY", "EUR", "ARS", "UAH", "RUB", "BYN", "PLN", "BRL",
    "NOK", "CHF", "CLP", "PEN", "COP", "UYU", "CRC", "IDR", "VND"
];

// Application state
let activeCurrencyCode = null;
let activeCurrencySign = null;
let exchangeData = null;
let baseRateFromRub = null;
let targetCurrencies = {}; // { code: commission }
let suppressOriginal = false;
let userLanguage = 'ru';
let userAddedSelectors = [];
let finalPriceSelectorString = "";
let conversionLogicStarted = false; // Флаг, что логика конвертации уже запущена

// Storage identifiers
const RATE_EXPIRY_ID = "rate_expiry_v2";
const RATE_DATA_ID = "rate_data_v2";
const TARGETS_ID = "targets";
const SUPPRESS_ID = "suppress_original";
const LANG_ID = "user_lang";
const USER_SELECTORS_ID = "user_selectors_v1";

// Network utilities
const fetchData = url => new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: { "Content-Type": "application/json" },
        onload: response => resolve(response.responseText),
        onerror: reject,
    });
});
const refreshRates = async () => {
    const cacheBuster = Math.random();
    const endpoint = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/rub.json?${cacheBuster}`;
    log("Refreshing rates from:", endpoint);
    const response = await fetchData(endpoint);
    const parsedRates = JSON.parse(response);
    const expiry = Date.now() + 6 * 60 * 60 * 1000; // 6 hours
    GM_setValue(RATE_EXPIRY_ID, expiry);
    GM_setValue(RATE_DATA_ID, parsedRates);
    log("Rates refreshed and stored.");
    return parsedRates;
};
const loadRates = async () => {
    if (exchangeData) return;
    const expiry = GM_getValue(RATE_EXPIRY_ID, null);
    const storedRates = GM_getValue(RATE_DATA_ID, null);
    const rateTimestamp = storedRates ? Date.parse(storedRates.date) : Date.now();
    const needsRefresh = !storedRates || !expiry || expiry <= Date.now() ||
        (rateTimestamp + 24 * 60 * 60 * 1000) <= Date.now();
    if (needsRefresh) {
        log("Rate cache expired or missing, fetching new rates...");
        exchangeData = await refreshRates();
    } else {
        log("Loading rates from cache.");
        exchangeData = storedRates;
    }
};
// Value formatting utilities
const renderValue = (value, code) => {
    const lowValue = value < 100;
    let adjustedValue;
    if (code === "RUB") {
        adjustedValue = lowValue ?
            Math.ceil(value * 10) / 10 : Math.ceil(value);
    } else {
        adjustedValue = lowValue ?
            Math.ceil(value * 10) / 10 : Math.ceil(value);
    }
    const region = code === "RUB" ?
        "ru-RU" : "en-US";
    const formatOptions = lowValue ? { maximumFractionDigits: 1 } : {};
    return adjustedValue.toLocaleString(region, formatOptions);
};

// Price extraction utilities (fallback)
const extractValue = element => {
    if (element.dataset?.priceFinal) {
        return {
            value: parseFloat(element.dataset.priceFinal) / 100,
            textToReplace: element.innerText.trim()
        };
    }

    const crossedOut = element.querySelector("span > strike");
    if (crossedOut) {
        crossedOut.remove();
        element.classList.remove("discounted");
        element.style.color = "#BEEE11";
    }

    let rawText = element.innerText.trim();
    if (!activeCurrencySign) {
         warn("extractValue called before activeCurrencySign is set.");
         return { value: NaN, textToReplace: rawText };
    }
    const escapedSign = activeCurrencySign.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Добавлена поддержка \u00A0 (неразрывный пробел) и (USD)
    const prefixPostfixRegex = new RegExp(`(${escapedSign}\\s*[\\d\\s.,\u00A0]*?|[\\d\\s.,\u00A0]*?\\s*${escapedSign})(\\s*USD)?`);
    const priceMatch = rawText.match(prefixPostfixRegex);

    if (!priceMatch) {
        let fallbackText = rawText.split(/\r?\n|\r|\n/g)[0];
        let cleanedText = fallbackText.replace(/[^0-9.,-]+/g, "");
        if (COMMA_DECIMAL_CURRENCIES.includes(activeCurrencyCode)) {
            cleanedText = cleanedText.replace(/\./g, "").replace(/,/g, ".");
        } else {
            cleanedText = cleanedText.replace(/,/g, "");
        }
        cleanedText = cleanedText.replace(/[\s\u00A0]/g, '');
        return { value: parseFloat(cleanedText), textToReplace: fallbackText };
    }

    const priceString = priceMatch[1].trim();
    let cleanedText = priceString.replace(new RegExp(escapedSign, 'g'), '');
    cleanedText = cleanedText.replace(/[\s\u00A0]/g, ''); // Удаляем пробелы и неразрывные пробелы

    if (COMMA_DECIMAL_CURRENCIES.includes(activeCurrencyCode)) {
        cleanedText = cleanedText.replace(/\./g, "").replace(/,/g, ".");
    } else {
        cleanedText = cleanedText.replace(/,/g, "");
    }

    cleanedText = cleanedText.replace(/[\s\u00A0]/g, '');

    return {
        value: parseFloat(cleanedText),
        textToReplace: priceString
    };
};

// *** ИСПРАВЛЕННАЯ ФУНКЦИЯ: Price modification routine (v1.0.15) ***
const applyConversion = async element => {
    const elementClasses = element.classList.value;

    // --- ИСПРАВЛЕНИЕ v0.8.15: Предотвращение бесконечного цикла React ---
    // Если React перезаписывает наш .done, проверяем, не содержит ли элемент уже нашу конвертацию.
    if (element.classList.contains("done") || element.innerText.includes("≈")) {
        return;
    }
    // --- КОНЕЦ ИСПРАВЛЕНИЯ v0.8.15 ---

    const isWalletBalance = element.id === "header_wallet_balance";

    // Ранние проверки на выход
    if (!activeCurrencySign ||
        // Проверяем наличие символа валюты, только если это НЕ баланс кошелька
        (!isWalletBalance && !element.innerText.includes(activeCurrencySign)) ||
        elementClasses.includes("es-regprice") || elementClasses.includes("es-converted") ||
        elementClasses.includes("discount_original_price")) {
        element.classList.add("done"); // Помечаем, чтобы не проверять снова
        return;
    }

    if (Object.keys(targetCurrencies).length === 0 || !baseRateFromRub || !exchangeData) {
         warn("Bailed applyConversion. Reason: missing targets, rate, or data.", {
             targets: Object.keys(targetCurrencies).length,
             baseRate: baseRateFromRub,
             data: !!exchangeData,
             element: element.cloneNode(true)
         });
        return;
    }

    element.classList.add("done");
    log("applyConversion running on element:", element.cloneNode(true));

    // Предварительная чистка (для зачеркнутых цен)
    extractValue(element);

    let originalHTML = element.innerHTML;
    const escapedSign = activeCurrencySign.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Улучшенный Regex для поддержки пробелов в KZT и "USD" в USD
    const priceTagPattern = new RegExp(
        `(<[a-z]+[^>]*>)?` + // Optional opening tag (group 1)
        // Группа 2 (priceTextWithSign): Захватываем всю строку с ценой
        `(\\s*` +
            // Группа 3 (innerPrice):
            `(${escapedSign}\\s*[\\d.,]+(?:\\s*USD)?|[\\d.,\\s\u00A0]+\\s*${escapedSign})` +
        `\\s*)` +
        `(<\\/[a-z]+>)?`, // Optional closing tag (group 4)
        'gi'
    );


    let replaced = false;

    const newHTML = originalHTML.replace(priceTagPattern, (match, openTag, priceTextWithSign, innerPrice, closeTag) => {
        log(`Match found: '${match}'`);

        const rawPriceString = priceTextWithSign.trim(); // e.g., "$1.79 USD" или "26 155,13₸"
        let cleanedText = rawPriceString.replace(new RegExp(escapedSign, 'g'), ''); // e.g., " 1.79 USD" или "26 155,13"

        // Удаляем "USD" и все пробелы (включая неразрывные)
        cleanedText = cleanedText.replace(/USD/gi, '');
        cleanedText = cleanedText.replace(/[\s\u00A0]/g, '');

        if (COMMA_DECIMAL_CURRENCIES.includes(activeCurrencyCode)) {
            // Если используется запятая как разделитель, убираем точки, заменяем запятую на точку
            cleanedText = cleanedText.replace(/\./g, "").replace(/,/g, ".");
        } else {
            // Если используется точка как разделитель (USD, THB, GBP...), убираем все запятые
            cleanedText = cleanedText.replace(/,/g, "");
        }

        const originalValue = parseFloat(cleanedText);

        log(`Parsed Value: ${originalValue} (from '${cleanedText}')`);

        if (isNaN(originalValue)) {
            warn("Parsing failed (NaN) for:", cleanedText, "from:", rawPriceString);
            return match; // Возвращаем оригинальное совпадение, если парсинг не удался
        }

        const rubEquivalent = originalValue / baseRateFromRub;
        log(`RUB Equivalent: ${rubEquivalent} (${originalValue} / ${baseRateFromRub})`);

        const currentConvertedDisplays = [];

        for (const [targetCode, fee] of Object.entries(targetCurrencies)) {
            if (targetCode === activeCurrencyCode) {
                log(`Skipping conversion: Target (${targetCode}) is same as Active (${activeCurrencyCode})`);
                continue;
            }

            let rateToTarget = exchangeData.rub[targetCode.toLowerCase()];
            if (rateToTarget === undefined) {
                if (targetCode.toLowerCase() === 'rub') {
                    rateToTarget = 1;
                } else {
                    warn(`No rate found for target currency: ${targetCode}`);
                    continue;
                }
            }
            const convertedValue = rubEquivalent * rateToTarget * (1 + fee / 100);
            const displayedValue = renderValue(convertedValue, targetCode);
            const sign = getCurrencySign(targetCode);
            currentConvertedDisplays.push(`${displayedValue}${sign}`);
        }

        if (currentConvertedDisplays.length === 0) {
            warn("No converted displays generated (all targets might be same as active or no rates found).");
            if (!suppressOriginal) {
                 return match;
            }
        }

        replaced = true;
        const newPrice = currentConvertedDisplays.join(" ≈ ");
        log(`Converted Strings: ${newPrice}`);

        // Используем захваченные теги или пустую строку, чтобы сохранить форматирование
        const tagToUse = openTag ? openTag : '';
        const closingTagToUse = closeTag ? closeTag : '';

        let contentToInsert;

        if (suppressOriginal) {
            contentToInsert = (newPrice.length > 0) ? newPrice : "";
        } else {
            // Используем 'innerPrice' (Group 3), который содержит только цену (напр. $1.79 USD или 26 155,13₸)
            const displayPrice = innerPrice.trim();
            contentToInsert = (newPrice.length > 0) ? `${displayPrice} ≈ ${newPrice}` : displayPrice;
        }

        return `${tagToUse}${contentToInsert}${closingTagToUse}`;
    });

    if (replaced) {
        log("Replacing HTML for element:", element);
        element.innerHTML = newHTML;
    }
};

// *** ИСПРАВЛЕННАЯ ФУНКЦИЯ: Currency identification (v1.0.14 fix) ***
const identifyActiveCurrency = () => {
    if (activeCurrencyCode) return; // Не запускать дважды

    // 1. GStoreItemData (Надежно, если есть)
    try {
        const formattedSample = GStoreItemData.fnFormatCurrency(12345); // "$123.45 USD" or "123,45 ₸"

        if (formattedSample.includes('USD')) {
            activeCurrencyCode = "USD";
            activeCurrencySign = "$"; // Используем базовый символ $
            log(`Currency via GStoreItemData (USD Fix): ${activeCurrencyCode} (${activeCurrencySign})`);
            return;
        }

        const cleanedSample = formattedSample
            .replace("123,45", "").replace("123.45", "").trim(); // "₸"

        activeCurrencyCode = CURRENCY_SYMBOLS[cleanedSample];
        activeCurrencySign = cleanedSample;

        if (activeCurrencyCode && !activeCurrencySign) {
             activeCurrencySign = ABBREVIATION_SYMBOLS[activeCurrencyCode];
        }

        log(`Currency via GStoreItemData (Legacy): ${activeCurrencyCode} (${activeCurrencySign})`);
        return;
    } catch (err) {}

    // 2. Wallet Info (Надежно, если залогинен)
    try {
        const walletCode = getCurrencyById(g_rgWalletInfo?.wallet_currency);
        if (walletCode) {
            activeCurrencyCode = walletCode.code;
            activeCurrencySign = walletCode.sign;
            log(`Currency via Wallet Info: ${activeCurrencyCode} (${activeCurrencySign})`);
            return;
        }
    } catch (err) {}

    // 3. Meta tag (Надежный, но не всегда есть)
    const priceMeta = document.querySelector('meta[itemprop="priceCurrency"]');
    if (priceMeta?.content) {
        activeCurrencyCode = priceMeta.content;
        activeCurrencySign = ABBREVIATION_SYMBOLS[activeCurrencyCode];
        if (!activeCurrencySign) {
            warn(`Found currency code ${activeCurrencyCode} from meta, but no matching SIGN in ABBREVIATION_SYMBOLS.`);
            const curr = getCurrencyByCode(activeCurrencyCode);
            if (curr) activeCurrencySign = curr.sign;
        }
        log(`Currency via Meta Tag: ${activeCurrencyCode} (${activeCurrencySign})`);
        return;
    }


    // 4. Page Scrape (Резервный метод для динамических страниц)
    log("Using Page Scrape fallback to find currency...");
    const sortedSymbols = Object.entries(CURRENCY_SYMBOLS).sort((a, b) => b[0].length - a[0].length);

    // Сканируем *только* селекторы цен, а не все div
    const candidateElements = document.querySelectorAll(BASE_PRICE_TARGETS.join(','));
    if (candidateElements.length === 0) {
        log("Page Scrape: No price elements found yet.");
        return; // Не найдено, выходим (повторный запуск будет из observe)
    }

    for (const [sign, code] of sortedSymbols) {
        for (const candidate of candidateElements) {
            if (sign === "$" && candidate.innerText.includes("USD")) {
                 activeCurrencySign = "$";
                 activeCurrencyCode = "USD";
                 log(`Currency via Page Scrape (USD Fix): ${activeCurrencyCode} (${activeCurrencySign})`);
                 return;
            }

            if (candidate.innerText.includes(sign)) {
                activeCurrencySign = sign;
                activeCurrencyCode = code;
                log(`Currency via Page Scrape (Legacy): ${activeCurrencyCode} (${activeCurrencySign})`);
                return;
            }
        }
    }

    warn("Could not identify active currency.");
};

// *** ИСПРАВЛЕННЫЙ СПИСОК: Price element selectors (v0.8.15) ***
const BASE_PRICE_TARGETS = [
    "#header_wallet_balance",
    "div[class*=StoreSalePriceBox]",
    "div[class*='StoreSalePriceWidget_']",
    "div[class*='StoreOriginalPrice_']",
    ".game_purchase_price",
    // --- Селекторы Списка желаемого ---
    "div._3j4dI1yA7cRfCvK8h406OB",
    "div.DOnsaVcV0Is-",
    "div._79DIT7RUQ5g-",
    // --- Селекторы Корзины (Новые) ---
    "._2WLaY5TxjBGVyuWe_6KS3N", // Итого (total)
    ".k2r-13oII_503_1b0Bf",     // Подытог (subtotal)
    "._38-m1g-YVkf-nCAcHJ1NbP", // Цена элемента (item price)
    // ---
    ".steamdb_prices_top",
    ".discount_final_price:not(:has(> .your_price_label))",
    ".discount_final_price > div:not([class])",
    ".search_price",
    ".price:not(.spotlight_body):not(.similar_grid_price)",
    ".match_subtitle",
    ".game_area_dlc_price:not(:has(> *))",
    ".savings.bundle_savings",
    ".wallet_column",
    ".wht_total",
    ".normal_price:not(.market_table_value)",
    ".sale_price",
    ".StoreSalePriceWidgetContainer:not(.Discounted) div",
    ".StoreSalePriceWidgetContainer.Discounted div:nth-child(2) > div:nth-child(2)",
    "#marketWalletBalanceAmount",
    ".market_commodity_order_summary > span:nth-child(2)",
    ".market_commodity_orders_table tr > td:first-child",
    ".market_listing_price_with_fee",
    ".market_activity_price",
    ".item_market_actions > div > div:nth-child(2)",
    ".wishlist_row .discount_final_price",
    ".wishlist_row .discount_original_price",
    ".wishlist_row .normal_price",
    ".wishlist_row .price",
    ".ws_row_bold .price",
    "[class*='wishlist'] .price",
    ".wishlist_row div",
];
// Price application handler
const processPrices = async elements => {
    if (!elements?.length) {
        return;
    }
    const elementsToProcess = Array.from(elements).filter(el => !el.classList.contains('done') && !el.innerText.includes('≈'));
    if (elementsToProcess.length > 0) {
        log(`Processing ${elementsToProcess.length} new elements...`);
        for (const elem of elementsToProcess) {
            await applyConversion(elem);
        }
    }
};

// DOM mutation watcher
const initializeWatcher = () => {
    log("Initializing MutationObserver...");
    const watcher = new MutationObserver(async mutations => {
        try {
            let addedNodes = [];
            for (const change of mutations) {
                if (change.addedNodes) {
                     addedNodes.push(...Array.from(change.addedNodes));
                }
            }
            if (addedNodes.length === 0) return;

            // Повторное определение, если валюта не найдена
            if (!activeCurrencyCode) {
                log("Watcher trying to find active currency...");
                identifyActiveCurrency(); // Повторный вызов
                if (activeCurrencyCode) {
                    // Валюта найдена, запускаем логику конвертации
                    await startConversionLogic();
                }
            }

            // Стандартная логика обработки (сработает, только если валюта уже известна)
            if (activeCurrencyCode) {
                let foundPriceNodes = [];
                for (const added of addedNodes) {
                    if (added.nodeType === Node.ELEMENT_NODE) {
                        if (added.matches && added.matches(finalPriceSelectorString)) {
                            foundPriceNodes.push(added);
                        }
                        if (added.querySelectorAll) {
                            foundPriceNodes.push(...Array.from(added.querySelectorAll(finalPriceSelectorString)));
                        }
                    }
                }
                if (foundPriceNodes.length > 0) {
                    await processPrices(foundPriceNodes);
                }
            }

        } catch (err) {
            error("Error in MutationObserver:", err);
        }
    });
    watcher.observe(document.body, { childList: true, subtree: true });
};

// CSS selector generation
const generateSelectorForElement = (el) => {
    if ((!el.classList || el.classList.length === 0) && el.parentElement) {
        el = el.parentElement;
    }
    if (!el || el === document.body) return null;
    if (el.id) {
        const selector = `#${el.id}`;
        if (document.querySelectorAll(selector).length === 1) {
            return selector;
        }
    }
    const classes = Array.from(el.classList).filter(c => c !== 'done');
    if (classes.length > 0) {
        return `${el.tagName.toLowerCase()}.${classes.join('.')}`;
    }
    if (el.parentElement && el.parentElement !== document.body) {
        const parentClasses = Array.from(el.parentElement.classList).filter(c => c !== 'done');
        if (parentClasses.length > 0) {
            return `${el.parentElement.tagName.toLowerCase()}.${parentClasses.join('.')} > ${el.tagName.toLowerCase()}`;
        }
    }
    return null;
};
// Add selector by click
const findAndAddSelector = () => {
    alert(LANGUAGES[userLanguage].addMissingInstructions);
    const clickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.body.removeEventListener('click', clickHandler, true);
        const targetElement = e.target;
        // Ослабляем проверку: проверяем только наличие активного символа
        if (!activeCurrencySign || !targetElement.innerText || !targetElement.innerText.includes(activeCurrencySign)) {
            error("Invalid click", { activeSign: activeCurrencySign, text: targetElement.innerText });
            alert(LANGUAGES[userLanguage].invalidPriceClick);
            return;
        }
        const newSelector = generateSelectorForElement(targetElement);
        if (newSelector) {
            let currentSelectors = GM_getValue(USER_SELECTORS_ID, []);
            if (currentSelectors.includes(newSelector)) {
                alert(LANGUAGES[userLanguage].selectorAlreadyAdded);
                return;
            }
            currentSelectors.push(newSelector);
            GM_setValue(USER_SELECTORS_ID, currentSelectors);
            alert(LANGUAGES[userLanguage].selectorAdded + newSelector);
            setTimeout(() => location.reload(), 1000);
        } else {
            alert(LANGUAGES[userLanguage].priceNotFound);
        }
    };
    document.body.addEventListener('click', clickHandler, true);
};

// Management functions
const manageSelectors = () => {
    let currentSelectors = GM_getValue(USER_SELECTORS_ID, []);
    if (currentSelectors.length === 0) {
        alert(LANGUAGES[userLanguage].noSelectors);
        return;
    }
    let dialog = LANGUAGES[userLanguage].currentSelectors + "\n\n";
    currentSelectors.forEach((sel, index) => {
        dialog += `${index + 1}: ${sel}\n`;
    });
    dialog += "\n" + LANGUAGES[userLanguage].removeSelectorPrompt;
    const response = prompt(dialog);
    if (response === null) return;
    const indexToRemove = parseInt(response, 10) - 1;
    if (indexToRemove >= 0 && indexToRemove < currentSelectors.length) {
        const removed = currentSelectors.splice(indexToRemove, 1);
        GM_setValue(USER_SELECTORS_ID, currentSelectors);
        alert(LANGUAGES[userLanguage].selectorRemoved(removed[0]));
        setTimeout(() => location.reload(), 1000);
    } else if (response.trim() !== "0" && response.trim() !== "") {
        alert(LANGUAGES[userLanguage].invalidValue);
    }
};
const manageTargets = () => {
    const snapshot = { ...targetCurrencies };
    const count = Object.keys(snapshot).length;
    let dialog = LANGUAGES[userLanguage].currentConversions;
    if (count === 0) {
        dialog += LANGUAGES[userLanguage].noConversions;
    } else {
        for (const [code, fee] of Object.entries(snapshot)) {
            const sign = getCurrencySign(code);
            dialog += `${code} (${sign}): ${fee}%\n`;
        }
        dialog += "\n";
    }
    dialog += LANGUAGES[userLanguage].clearAll;
    dialog += LANGUAGES[userLanguage].enterAbbr;
    const favorites = ["RUB", "USD", "EUR", "KZT", "UAH", "BYN", "TRY", "THB", "PLN", "BRL", "CNY", "JPY"];
    const options = SUPPORTED_CURRENCIES
        .map(c => c.code)
        .sort((a, b) => {
            const ia = favorites.indexOf(a);
            const ib = favorites.indexOf(b);
            return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
        });
    dialog += `${LANGUAGES[userLanguage].available}${options.join(", ")}`;
    const response = prompt(dialog);
    if (response === null) return;
    const cleaned = response.trim().toUpperCase();
    if (cleaned === "CLEAR" || cleaned === "0") {
        GM_setValue(TARGETS_ID, {});
        targetCurrencies = {};
        alert(LANGUAGES[userLanguage].allRemoved);
        setTimeout(() => location.reload(), 1000);
        return;
    }
    const chosen = getCurrencyByCode(cleaned);
    if (!chosen) {
        alert(LANGUAGES[userLanguage].invalidAbbr(cleaned));
        manageTargets();
        return;
    }
    const chosenCode = chosen.code;
    const existingFee = snapshot[chosenCode] || 0;
    const feeDialog = LANGUAGES[userLanguage].commissionPrompt(chosenCode, getCurrencySign(chosenCode), existingFee);
    const feeResponse = prompt(feeDialog, existingFee.toString());
    if (feeResponse === null) {
        manageTargets();
        return;
    }
    const feeCleaned = feeResponse.trim().toLowerCase();
    if (feeCleaned === "del") {
        const updated = { ...snapshot };
        delete updated[chosenCode];
        GM_setValue(TARGETS_ID, updated);
        targetCurrencies = updated;
        alert(LANGUAGES[userLanguage].removed(chosenCode));
        setTimeout(() => location.reload(), 1000);
        return;
    }
    const feeValue = parseFloat(feeResponse);
    if (isNaN(feeValue) || feeValue < 0) {
        alert(LANGUAGES[userLanguage].invalidValue);
        manageTargets();
        return;
    }
    const updatedTargets = { ...snapshot, [chosenCode]: feeValue };
    GM_setValue(TARGETS_ID, updatedTargets);
    targetCurrencies = updatedTargets;
    alert(LANGUAGES[userLanguage].setCommission(chosenCode, feeValue));
    setTimeout(() => location.reload(), 1000);
};
const switchSuppression = () => {
    suppressOriginal = !suppressOriginal;
    GM_setValue(SUPPRESS_ID, suppressOriginal);
    const state = suppressOriginal ? "enabled" : "disabled";
    alert(LANGUAGES[userLanguage].hideToggle(state));
    setTimeout(() => location.reload(), 1000);
};
const switchLanguage = () => {
    userLanguage = userLanguage === 'ru' ? 'en' : 'ru';
    GM_setValue(LANG_ID, userLanguage);
    const langName = userLanguage === 'ru' ? "русский" : "английский";
    alert(`Язык изменён на ${langName}. Перезагрузка страницы...`);
    setTimeout(() => location.reload(), 1000);
};
const configureMenus = () => {
    const targetCount = Object.keys(targetCurrencies).length;
    const targetLabel = LANGUAGES[userLanguage].menuConversions(targetCount);

    GM_registerMenuCommand(targetLabel, manageTargets);
    GM_registerMenuCommand(LANGUAGES[userLanguage].menuHide(suppressOriginal), switchSuppression);
    GM_registerMenuCommand(LANGUAGES[userLanguage].addMissing, findAndAddSelector);
    GM_registerMenuCommand(LANGUAGES[userLanguage].menuManageSelectors, manageSelectors);
    GM_registerMenuCommand(`Язык: ${userLanguage === 'ru' ? 'RU' : 'EN'}`, switchLanguage);
};
const applyStyles = () => {
    const styles = `
    .tab_item_discount { width: 160px !important; }
    .tab_item_discount .discount_prices { width: 100% !important; }
    .tab_item_discount .discount_final_price { padding: 0 !important; }
    .home_marketing_message.small .discount_block { height: auto !important; }
    .discount_block_inline { white-space: nowrap !important; }
    .curator #RecommendationsRows .store_capsule.price_inline .discount_block { min-width: 200px !important; }
    .market_listing_their_price { min-width: 130px !important; }
  `;
    GM_addStyle(styles);
};
const getCurrencyById = id => SUPPORTED_CURRENCIES.find(c => c.id === id);
const getCurrencyByCode = code => SUPPORTED_CURRENCIES.find(c => c.code === code);
const getCurrencySign = code => {
    const currency = getCurrencyByCode(code);
    return currency ?
        (currency.sign || code) : code;
};

// Вынесено в отдельную функцию
const startConversionLogic = async () => {
    if (conversionLogicStarted) {
        log("Conversion logic already started, skipping.");
        return;
    }
    conversionLogicStarted = true;
    log("Starting conversion logic...");

    if (Object.keys(targetCurrencies).length === 0) {
        warn("No target currencies set. Exiting conversion logic.");
        return;
    }

    await loadRates();
    log("Exchange rates loaded.");

    if (!activeCurrencyCode) {
         error("Conversion logic started but activeCurrencyCode is missing!");
         return;
    }

    baseRateFromRub = exchangeData.rub[activeCurrencyCode.toLowerCase()];
    if (activeCurrencyCode.toLowerCase() === 'rub') {
        baseRateFromRub = 1;
    }

    log(`Base Rate (1 RUB to ${activeCurrencyCode}): ${baseRateFromRub}`);

    if (!exchangeData || !baseRateFromRub) {
        error(`FAILED to find base rate for ${activeCurrencyCode}. Exiting.`);
        return;
    }

    // Первоначальный прогон
    await processPrices(document.querySelectorAll(finalPriceSelectorString));

    // Дополнительные проверки для динамического контента
    setTimeout(() => {
        log("Running delayed scan (2s)...");
        processPrices(document.querySelectorAll(finalPriceSelectorString));
    }, 2000);
    setTimeout(() => {
        log("Running delayed scan (5s)...");
        processPrices(document.querySelectorAll(finalPriceSelectorString));
    }, 5000);
    setTimeout(() => {
        log("Running delayed scan (10s)...");
        processPrices(document.querySelectorAll(finalPriceSelectorString));
    }, 10000);
}


// Core initialization
const bootstrap = async () => {
    "use strict";
    log("Bootstrapping script...");
    // Restore persistent state
    targetCurrencies = GM_getValue(TARGETS_ID, {});
    suppressOriginal = GM_getValue(SUPPRESS_ID, false);
    userLanguage = GM_getValue(LANG_ID, 'ru');
    userAddedSelectors = GM_getValue(USER_SELECTORS_ID, []);

    // Собираем финальную строку селекторов
    finalPriceSelectorString = [...BASE_PRICE_TARGETS, ...userAddedSelectors]
        .map(sel => `${sel}:not(.done)`)
        .join(", ");
    log("Final selector string:", finalPriceSelectorString);

    // Определение валюты (Методы 1, 2, 3 и безопасный 4)
    identifyActiveCurrency();
    log(`Active Currency: ${activeCurrencyCode} (Sign: ${activeCurrencySign})`);

    // Настраиваем меню и стили в любом случае
    configureMenus();
    applyStyles();

    if (!activeCurrencyCode) {
        warn("No currency found on initial load. Initializing watcher for dynamic detection...");
        initializeWatcher(); // Запускаем наблюдатель, который будет *ждать* появления валюты
        return;
    }

    // Валюта найдена сразу, запускаем основную логику
    await startConversionLogic();
    initializeWatcher(); // Запускаем наблюдатель для отслеживания *будущих* изменений
};

// Start on page load
window.addEventListener("load", bootstrap);