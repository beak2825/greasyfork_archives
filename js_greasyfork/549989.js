// ==UserScript==
// @name         Amazon Orders - Stats
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Counts the number of orders and the total spent on Amazon.fr
// @author       MERCRED
// @match        https://www.amazon.fr/your-orders/orders*
// @match        https://www.amazon.us/your-orders/orders*
// @match        https://www.amazon.de/your-orders/orders*
// @match        https://www.amazon.it/your-orders/orders*
// @match        https://www.amazon.es/your-orders/orders*
// @match        https://www.amazon.nl/your-orders/orders*
// @match        https://www.amazon.se/your-orders/orders*
// @match        https://www.amazon.pl/your-orders/orders*
// @match        https://www.amazon.in/your-orders/orders*
// @match        https://www.amazon.com/your-orders/orders*
// @match        https://www.amazon.com.mx/your-orders/orders*
// @match        https://www.amazon.co.uk/your-orders/orders*
// @match        https://www.amazon.co.jp/your-orders/orders*
// @match        https://www.amazon.com.au/your-orders/orders*
// @match        https://www.amazon.com.be/your-orders/orders*
// @grant        none
// @icon         https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549989/Amazon%20Orders%20-%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/549989/Amazon%20Orders%20-%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currency = '€';

    function parsePrice(text) {
        if (!text) return 0;
        let matchCurrency = text.match(/[€$£]/);
        if (matchCurrency) currency = matchCurrency[0];

        text = text.replace(/[\s€$£]/g, '').replace(',', '.');
        let value = parseFloat(text);
        return isNaN(value) ? 0 : value;
    }

    function analyzeOrders() {
        let orders = document.querySelectorAll("div.order-card.js-order-card");
        let total = 0;

        orders.forEach(order => {
            let priceEl = Array.from(order.querySelectorAll("span.a-size-base.a-color-secondary.aok-break-word"))
                .find(el => /[€$£]/.test(el.innerText));

            if (priceEl) {
                let text = priceEl.innerText.trim();
                let numbers = text.match(/[\d.,]+/g);
                if (numbers && numbers.length > 0) {
                    let num = numbers[numbers.length - 1];
                    total += parsePrice(num);
                }
            }
        });

        return { count: orders.length, total };
    }

    function createUI(stats) {
        let ui = document.createElement("div");
        ui.id = "amazon-orders-stats";
        ui.style.position = "fixed";
        ui.style.top = "150px";
        ui.style.left = "10px";
        ui.style.background = "white";
        ui.style.border = "2px solid #232f3e";
        ui.style.borderRadius = "8px";
        ui.style.padding = "10px";
        ui.style.zIndex = "9999";
        ui.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        ui.style.fontSize = "14px";
        ui.style.fontFamily = "Arial, sans-serif";
        ui.innerHTML = `
            <b>📦 Amazon Stats</b><br>
            Orders : ${stats.count}<br>
            Total : ${stats.total.toFixed(2)} ${currency}
        `;
        document.body.appendChild(ui);
    }

    function init() {
        let tries = 0;
        let timer = setInterval(() => {
            let orders = document.querySelectorAll("div.order-card.js-order-card");
            if (orders.length > 0) {
                clearInterval(timer);
                let stats = analyzeOrders();
                createUI(stats);
            } else {
                tries++;
                if (tries > 40) clearInterval(timer);
            }
        }, 500);
    }

    init();
})();