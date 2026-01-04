// ==UserScript==
// @name         MWI - Real life networth
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Shows you how much your networth is valued in your local currency using live Cowbell rates and real exchange conversions from USD to your locale currency.
// @author       Defenestration
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554704/MWI%20-%20Real%20life%20networth.user.js
// @updateURL https://update.greasyfork.org/scripts/554704/MWI%20-%20Real%20life%20networth.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cowbell pack data
    const packRates = [
        { cost: 100, packs: 1150 },
        { cost: 50, packs: 550 },
        { cost: 10, packs: 105 },
        { cost: 5, packs: 50 }
    ];

    // API endpoints
    const MARKET_API_URL = "https://www.milkywayidle.com/game_data/marketplace.json";
    const EXCHANGE_API_URL = "https://api.exchangerate.host/latest?base=USD";

    let MARKET_VALUES = { ask: 620000, bid: 600000 };
    let EXCHANGE_RATES = { USD: 1 };
    let TARGET_CURRENCY = "USD";

    function detectCurrencyFromLocale() {
        const locale = navigator.language || "en-US";
        if (locale.startsWith("en-GB")) return "GBP";
        if (locale.startsWith("en-CA")) return "CAD";
        if (locale.startsWith("en-AU")) return "AUD";
        if (locale.startsWith("de") || locale.startsWith("fr") || locale.startsWith("es") || locale.startsWith("it")) return "EUR";
        if (locale.startsWith("ja")) return "JPY";
        if (locale.startsWith("ko")) return "KRW";
        if (locale.startsWith("zh")) return "CNY";
        return "USD";
    }

    async function fetchMarketValues() {
        try {
            const response = await fetch(MARKET_API_URL, { cache: "no-cache" });
            if (!response.ok) throw new Error("Market API unavailable.");
            const data = await response.json();
            const cowbell = data["/items/bag_of_10_cowbells"]?.["0"];
            if (cowbell) {
                MARKET_VALUES.ask = cowbell.a;
                MARKET_VALUES.bid = cowbell.b;
                console.log(`[MWI Networth] Market values updated: Ask ${MARKET_VALUES.ask}, Bid ${MARKET_VALUES.bid}`);
            }
        } catch (err) {
            console.warn("[MWI Networth] Using fallback market values:", err);
        }
    }

    async function fetchExchangeRates() {
        try {
            const response = await fetch(EXCHANGE_API_URL, { cache: "no-cache" });
            if (!response.ok) throw new Error("Exchange API unavailable.");
            const data = await response.json();
            EXCHANGE_RATES = data.rates || { USD: 1 };
            console.log("[MWI Networth] Exchange rates updated.");
        } catch (err) {
            console.warn("[MWI Networth] Using fallback USD=1:", err);
        }
    }

    function calculateRealValue(packs) {
        let remaining = packs, usd = 0;
        for (const p of packRates) {
            const count = Math.floor(remaining / p.packs);
            usd += count * p.cost;
            remaining -= count * p.packs;
        }
        const smallest = packRates[packRates.length - 1];
        usd += (remaining / smallest.packs) * smallest.cost;
        return usd;
    }

    function parseNetWorth(text) {
        const m = text.match(/([\d.,]+)\s*([KMBT]?)/i);
        if (!m) return 0;
        let val = parseFloat(m[1].replace(/,/g, ''));
        const suffix = m[2].toUpperCase();
        const mult = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 };
        if (mult[suffix]) val *= mult[suffix];
        return val;
    }

    function formatCurrency(valueUSD) {
        const rate = EXCHANGE_RATES[TARGET_CURRENCY] || 1;
        const converted = valueUSD * rate;
        return converted.toLocaleString(undefined, {
            style: "currency",
            currency: TARGET_CURRENCY,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function updateDisplay(netWorthText) {
        const elem = document.getElementById('toggleNetWorth');
        if (!elem) return;

        const netWorth = parseNetWorth(netWorthText);
        if (!netWorth) return;

        const packsAsk = netWorth / MARKET_VALUES.ask;
        const packsBid = netWorth / MARKET_VALUES.bid;
        const usdAsk = calculateRealValue(packsAsk);
        const usdBid = calculateRealValue(packsBid);

        const cowbellsAsk = Math.ceil(packsAsk * 10);
        const cowbellsBid = Math.ceil(packsBid * 10);

        let usdEl = document.getElementById('realValueDisplay');
        if (!usdEl) {
            usdEl = document.createElement('div');
            usdEl.id = 'realValueDisplay';
            usdEl.style.fontSize = '0.9em';
            usdEl.style.color = '#90ee90';
            usdEl.style.marginTop = '2px';
            usdEl.style.userSelect = 'none';
            elem.insertAdjacentElement('afterend', usdEl);
        }

        usdEl.innerHTML =
            `≈ <span style="color:#98fb98;">${formatCurrency(usdBid)} (bid)</span>` +
            ` — <span style="color:#ffd700;">${formatCurrency(usdAsk)} (ask)</span>`;

        let cowbellEl = document.getElementById('cowbellValueDisplay');
        if (!cowbellEl) {
            cowbellEl = document.createElement('div');
            cowbellEl.id = 'cowbellValueDisplay';
            cowbellEl.style.fontSize = '0.85em';
            cowbellEl.style.color = '#aaaaff';
            cowbellEl.style.marginTop = '2px';
            cowbellEl.style.userSelect = 'none';
            usdEl.insertAdjacentElement('afterend', cowbellEl);
        }

        cowbellEl.textContent =
            `Total Cowbells: ${cowbellsBid.toLocaleString()} (bid) — ${cowbellsAsk.toLocaleString()} (ask)`;
    }

    function attachNetWorthObserver(el) {
        if (!el) return;
        updateDisplay(el.textContent);
        const observer = new MutationObserver(() => updateDisplay(el.textContent));
        observer.observe(el, { childList: true, characterData: true, subtree: true });
    }

    function globalWatcher() {
        const existing = document.getElementById('toggleNetWorth');
        if (existing && !existing.dataset.observed) {
            existing.dataset.observed = 'true';
            attachNetWorthObserver(existing);
        }
    }

    const rootObserver = new MutationObserver(() => globalWatcher());
    rootObserver.observe(document.body, { childList: true, subtree: true });
    const interval = setInterval(globalWatcher, 1000);

    window.addEventListener('beforeunload', () => {
        rootObserver.disconnect();
        clearInterval(interval);
    });

    // Init
    TARGET_CURRENCY = detectCurrencyFromLocale();
    fetchExchangeRates();
    fetchMarketValues();
    setInterval(fetchExchangeRates, 86400000); // refresh exchange daily
    setInterval(fetchMarketValues, 3600000); // refresh market hourly
})();
