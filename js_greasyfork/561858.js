// ==UserScript==
// @name         PSDeals Regional Price Convertor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convert prices to local region and switch regions via dropdown
// @author       chdml
// @license      MIT
// @match        https://psdeals.net/*-store*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.exchangerate-api.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561858/PSDeals%20Regional%20Price%20Convertor.user.js
// @updateURL https://update.greasyfork.org/scripts/561858/PSDeals%20Regional%20Price%20Convertor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CACHE_DURATION = 14 * 24 * 60 * 60 * 1000; // 2 Weeks

    const regionCurrencies = {
        'ar': { name: 'Argentina', currency: 'USD' }, 'au': { name: 'Australia', currency: 'AUD' },
        'at': { name: 'Austria', currency: 'EUR' }, 'be': { name: 'Belgium', currency: 'EUR' },
        'br': { name: 'Brazil', currency: 'BRL' }, 'bg': { name: 'Bulgaria', currency: 'BGN' },
        'ca': { name: 'Canada', currency: 'CAD' }, 'cl': { name: 'Chile', currency: 'USD' },
        'cz': { name: 'Czech Republic', currency: 'CZK' }, 'dk': { name: 'Denmark', currency: 'DKK' },
        'de': { name: 'Germany', currency: 'EUR' }, 'gr': { name: 'Greece', currency: 'EUR' },
        'fi': { name: 'Finland', currency: 'EUR' }, 'fr': { name: 'France', currency: 'EUR' },
        'hk': { name: 'Hong Kong', currency: 'HKD' }, 'hu': { name: 'Hungary', currency: 'HUF' },
        'is': { name: 'Iceland', currency: 'EUR' }, 'in': { name: 'India', currency: 'INR' },
        'id': { name: 'Indonesia', currency: 'IDR' }, 'ie': { name: 'Ireland', currency: 'EUR' },
        'il': { name: 'Israel', currency: 'ILS' }, 'it': { name: 'Italy', currency: 'EUR' },
        'jp': { name: 'Japan', currency: 'JPY' }, 'kr': { name: 'South Korea', currency: 'KRW' },
        'my': { name: 'Malaysia', currency: 'MYR' }, 'mx': { name: 'Mexico', currency: 'USD' },
        'nl': { name: 'Netherlands', currency: 'EUR' }, 'nz': { name: 'New Zealand', currency: 'NZD' },
        'no': { name: 'Norway', currency: 'NOK' }, 'pl': { name: 'Poland', currency: 'PLN' },
        'pt': { name: 'Portugal', currency: 'EUR' }, 'ro': { name: 'Romania', currency: 'RON' },
        'ru': { name: 'Russia', currency: 'RUB' }, 'sa': { name: 'Saudi Arabia', currency: 'USD' },
        'sg': { name: 'Singapore', currency: 'SGD' }, 'sk': { name: 'Slovakia', currency: 'EUR' },
        'za': { name: 'South Africa', currency: 'ZAR' }, 'es': { name: 'Spain', currency: 'EUR' },
        'se': { name: 'Sweden', currency: 'SEK' }, 'ch': { name: 'Switzerland', currency: 'CHF' },
        'tw': { name: 'Taiwan', currency: 'TWD' }, 'th': { name: 'Thailand', currency: 'THB' },
        'tr': { name: 'Turkey', currency: 'TRY' }, 'ua': { name: 'Ukraine', currency: 'UAH' },
        'ae': { name: 'UAE', currency: 'USD' }, 'gb': { name: 'UK', currency: 'GBP' },
        'us': { name: 'USA', currency: 'USD' }
    };

    const countryToRegion = {
        'Argentina': 'ar', 'Australia': 'au', 'Austria': 'at', 'Belgium': 'be',
        'Brazil': 'br', 'Bulgaria': 'bg', 'Canada': 'ca', 'Chile': 'cl',
        'Czech Republic': 'cz', 'Denmark': 'dk', 'Germany': 'de', 'Greece': 'gr',
        'Finland': 'fi', 'France': 'fr', 'Hong Kong': 'hk', 'Hungary': 'hu',
        'Iceland': 'is', 'India': 'in', 'Indonesia': 'id', 'Ireland': 'ie',
        'Israel': 'il', 'Italy': 'it', 'Japan': 'jp', 'South Korea': 'kr',
        'Malaysia': 'my', 'Mexico': 'mx', 'Netherlands': 'nl', 'New Zealand': 'nz',
        'Norway': 'no', 'Poland': 'pl', 'Portugal': 'pt', 'Romania': 'ro',
        'Russia': 'ru', 'Saudi Arabia': 'sa', 'Singapore': 'sg', 'Slovakia': 'sk',
        'South Africa': 'za', 'Spain': 'es', 'Sweden': 'se', 'Switzerland': 'ch',
        'Taiwan': 'tw', 'Thailand': 'th', 'Turkey': 'tr', 'Ukraine': 'ua',
        'UAE': 'ae', 'UK': 'gb', 'USA': 'us'
    };

    const currencySymbols = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'AUD': 'A$',
        'CAD': 'C$', 'CHF': 'CHF', 'SEK': 'kr', 'NZD': 'NZ$',
        'NOK': 'kr', 'KRW': '₩', 'TRY': '₺', 'RUB': '₽', 'INR': '₹',
        'BRL': 'R$', 'ZAR': 'R', 'SAR': 'ر.س', 'PLN': 'zł', 'THB': '฿',
        'IDR': 'Rp', 'MYR': 'RM', 'DKK': 'kr', 'ILS': '₪', 'TWD': 'NT$',
        'UAH': '₴', 'HKD': 'HK$', 'SGD': 'S$', 'AED': '$'
    };

    let exchangeRates = {};

    function getCachedRates() {
        const cached = GM_getValue('exchange_rates', null);
        const timestamp = GM_getValue('exchange_rates_timestamp', 0);
        if (cached && (Date.now() - timestamp < CACHE_DURATION)) {
            exchangeRates = JSON.parse(cached);
            return true;
        }
        return false;
    }

    async function fetchExchangeRates() {
        if (getCachedRates()) return true;
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://api.exchangerate-api.com/v4/latest/SAR',
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        exchangeRates = data.rates;
                        GM_setValue('exchange_rates', JSON.stringify(data.rates));
                        GM_setValue('exchange_rates_timestamp', Date.now());
                        resolve(true);
                    } catch (e) { resolve(false); }
                },
                onerror: () => resolve(false)
            });
        });
    }

    function extractPrice(text) {
        if(text.toLowerCase() === "free") return 0
        let cleaned = text.replace(/USD|US\$|AED|SAR/g, '').replace(/[^\d.,]/g, '');
        if (cleaned.includes(',') && cleaned.includes('.')) {
            cleaned = (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) ?
                cleaned.replace(/\./g, '').replace(',', '.') : cleaned.replace(/,/g, '');
        } else if (cleaned.includes(',')) {
            cleaned = (cleaned.split(',')[1]?.length <= 2) ? cleaned.replace(',', '.') : cleaned.replace(/,/g, '');
        }
        return parseFloat(cleaned) || 0;
    }

    async function createPriceTable() {
        if (document.getElementById('sar-price-table')) return;
        const priceContainer = document.getElementById('compare-prices');
        if (!priceContainer) return;

        const pathMatch = window.location.pathname.match(/\/([a-z]{2})-store/);
        const currentCode = pathMatch ? pathMatch[1] : 'us';
        const currentRegion = regionCurrencies[currentCode] || { currency: 'USD', name: 'USA' };

        await fetchExchangeRates();

        const priceLinks = priceContainer.querySelectorAll('a[title]');
        const priceData = [];

        priceLinks.forEach(link => {
            const country = link.getAttribute('title');
            const code = countryToRegion[country];
            if (!code) return;

            const info = regionCurrencies[code];
            const pSpan = link.querySelector('.compare-prices-bonus-price') || link.querySelector('.compare-prices-price');
            if (!pSpan) return;
            const rawPrice = extractPrice(pSpan.textContent);
            if (rawPrice >= 0) {
                const sarValue = rawPrice / (exchangeRates[info.currency] || 1);
                priceData.push({
                    region: info.name,
                    code: code.toUpperCase(),
                    original: pSpan.textContent.trim(),
                    currency: info.currency,
                    sarValue: sarValue,
                    converted: (sarValue * (exchangeRates[currentRegion.currency] || 1))
                });
            }
        });

        if (priceData.length === 0) return;
        const countrySelected = document.querySelector('meta[itemprop="price"]');
            if (countrySelected) {
                const rawPrice = parseFloat(countrySelected.getAttribute('content'));
                const sarValue = rawPrice / (exchangeRates[currentRegion.currency] || 1);

const priceOffer = document.querySelector('[itemprop="offers"]');
const bonusEl = priceOffer?.querySelector('.game-buy-button-price-bonus'); // New priority
const discountEl = priceOffer?.querySelector('.game-buy-button-price-discount');
const normalEl = priceOffer?.querySelector('.game-buy-button-price');

// Priority: Bonus Price > Discount Price > Normal Price > Fallback
const originalText = rawPrice === 0 ? "Free" : (bonusEl || discountEl || normalEl)?.textContent.trim() || `${rawPrice} ${currentRegion.currency}`;
                priceData.push({
                    region: currentRegion.name,
                    code: currentCode,
                    original: originalText,
                    currency: currentRegion.currency,
                    sarValue: sarValue,
                    converted: (sarValue * (exchangeRates[currentRegion.currency] || 1))
                });
            }
        priceData.sort((a, b) => a.sarValue - b.sarValue);

        // Build Dropdown Options
        let dropdownOptions = Object.entries(regionCurrencies)
            .sort((a, b) => a[1].name.localeCompare(b[1].name))
            .map(([code, info]) => `<option value="${code}" ${code === currentCode ? 'selected' : ''}>${info.name}</option>`)
            .join('');

        const baseSym = currencySymbols[currentRegion.currency] || currentRegion.currency;
        let rows = priceData.map((item, i) => {
            const isBest = i === 0;
            const diff = item.converted === 0 ? "0%" : isBest ? '✨ BEST' : `+${((item.sarValue - priceData[0].sarValue) / priceData[0].sarValue * 100).toFixed(1)}%`;
            const highlightOwnCountry = item.code.toLowerCase() === currentCode.toLowerCase();
            return `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05); background:${isBest ? 'rgba(255, 215, 0, 0.12)' : (highlightOwnCountry ? "rgba(255, 255, 255, 0.1)" : "transparent")}">
                    <td style="padding:10px; text-align:center;">${isBest ? '🥇' : i+1}</td>
                    <td style="padding:10px;"><strong>${highlightOwnCountry ? item.region+" (Original)" : item.region}</strong></td>
                    <td style="padding:10px; text-align:right; font-family:monospace;">${item.original}</td>
                    <td style="padding:10px; text-align:right; font-weight:bold; color:${isBest ? '#22c55e' : '#fff'};">${baseSym}${item.converted.toFixed(2)}</td>
                    <td style="padding:10px; text-align:center; font-size:12px;">${diff}</td>
                </tr>`;
        }).join('');

        const tableHTML = `
            <div id="sar-price-table" style="margin:20px 0; padding:20px; background:#16213e; border-radius:12px; color:#fff; font-family: sans-serif;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3 style="margin:0;">💰 Prices in ${currentRegion.currency}</h3>
                    <select id="region-switcher" style="padding:5px 10px; border-radius:5px; background:#0f3460; color:#fff; border:1px solid #00d4ff; cursor:pointer;">
                        ${dropdownOptions}
                    </select>
                </div>
                <table style="width:100%; border-collapse:collapse;">
                    <thead>
                        <tr style="border-bottom:2px solid #00d4ff; color:#00d4ff;">
                            <th style="padding:10px;">#</th><th style="padding:10px; text-align:left;">Region</th>
                            <th style="padding:10px; text-align:right;">Original</th><th style="padding:10px; text-align:right;">In ${currentRegion.currency}</th>
                            <th style="padding:10px;">Diff</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>`;

        const target = document.querySelector('.compare-prices-link-row') || priceContainer;
        target.insertAdjacentHTML('beforebegin', tableHTML);

        // Dropdown Redirect Logic
        document.getElementById('region-switcher').addEventListener('change', (e) => {
            const newRegion = e.target.value;
            const currentPath = window.location.pathname;
            // Replaces the "/us-store/" part with the new region
            const newPath = currentPath.replace(/\/[a-z]{2}-store/, `/${newRegion}-store`);
            window.location.href = window.location.origin + newPath;
        });
    }

    const observer = new MutationObserver(() => {
        if (document.getElementById('compare-prices') && !document.getElementById('sar-price-table')) {
            createPriceTable();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();