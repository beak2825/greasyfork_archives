// ==UserScript==
// @name         Binance BTC Fixed Display
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Показва фиксирано BTC количество и смята реална USD стойност
// @author       You
// @match        https://www.binance.com/en/my/wallet/account/overview
// @match        https://www.binance.com/en/my/wallet/account/main
// @grant        GM_xmlhttpRequest
// @connect      api.binance.com
// ==/UserScript==


(function() {
    'use strict';

    const FIXED_BTC = 8.97;
    const FIXED_USD = 968429.90;

    function replaceDisplay() {
        // --- BTC ---
        const btcElem = document.querySelector('.typography-Headline4');
        if (btcElem) {
            btcElem.style.color = 'transparent';
            btcElem.style.position = 'relative';
            if (!btcElem.querySelector('.fixed-btc')) {
                const fixedBTC = document.createElement('span');
                fixedBTC.className = 'fixed-btc';
                fixedBTC.style.position = 'absolute';
                fixedBTC.style.left = '0';
                fixedBTC.style.top = '0';
                fixedBTC.style.color = '#fff';
                fixedBTC.textContent = FIXED_BTC.toFixed(8);
                btcElem.appendChild(fixedBTC);
            }
        }

        // --- USD (обща сума с дневната промяна) ---
        const usdElem = document.querySelector('.body3.mt-2');
        if (usdElem) {
            usdElem.style.color = 'transparent';
            usdElem.style.position = 'relative';
            if (!usdElem.querySelector('.fixed-usd')) {
                const fixedUSD = document.createElement('span');
                fixedUSD.className = 'fixed-usd';
                fixedUSD.style.position = 'absolute';
                fixedUSD.style.left = '0';
                fixedUSD.style.top = '0';
                fixedUSD.style.color = '#fff';
                usdElem.appendChild(fixedUSD);
            }

            // Взимаме процента от SELL или BUY
            let adjustedTotal = FIXED_USD;
            let percent = null;

            const sellElem = document.querySelector('.text-t-sell');
            const buyElem = document.querySelector('.text-t-buy');

            let match = null;
            if (sellElem) {
                match = sellElem.textContent.match(/\(([-+]?[0-9]*\.?[0-9]+)%\)/);
            }
            if ((!match || !match[1]) && buyElem) {
                match = buyElem.textContent.match(/\(([-+]?[0-9]*\.?[0-9]+)%\)/);
            }

            if (match) {
                percent = parseFloat(match[1]);
                const delta = FIXED_USD * (percent / 100);
                adjustedTotal = FIXED_USD + delta;
            }

            usdElem.querySelector('.fixed-usd').textContent =
                `≈ $${adjustedTotal.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
        }

        // --- SELL / дневна промяна ---
        const sellElem = document.querySelector('.text-t-sell');
        if (sellElem) {
            const text = sellElem.textContent;
            const match = text.match(/\(([-+]?[0-9]*\.?[0-9]+)%\)/);
            if (match) {
                const percent = parseFloat(match[1]);
                const delta = FIXED_USD * (percent / 100);
                const color = percent < 0 ? 'red' : '#2ebd85';
                sellElem.innerHTML =
                    `<span style="font-size:0.85em; color:${color}">≈ $${delta.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })} (${percent.toFixed(2)}%)</span>`;
            } else {
                sellElem.innerHTML = '-';
            }
        }

        // --- BUY / дневна промяна ---
        const buyElem = document.querySelector('.text-t-buy');
        if (buyElem) {
            const text = buyElem.textContent;
            const match = text.match(/\(([-+]?[0-9]*\.?[0-9]+)%\)/);
            if (match) {
                const percent = parseFloat(match[1]);
                const delta = FIXED_USD * (percent / 100);
                const color = percent < 0 ? 'red' : '#2ebd85';
                buyElem.innerHTML =
                    `<span style="font-size:0.85em; color:${color}">≈ $${delta.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })} (${percent.toFixed(2)}%)</span>`;
            } else {
                buyElem.innerHTML = '-';
            }
        }
    }

    replaceDisplay();
    setInterval(replaceDisplay, 500);

})();