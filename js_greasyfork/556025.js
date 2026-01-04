// ==UserScript==
// @name         12306余票票价显示与最低价高亮
// @name:en      12306 Ticket Price Display & Lowest Fare Highlight
// @namespace    xrr
// @version      1.0.1
// @license      MIT
// @description  为12306所有座席显示票价（分两行），并高亮每列最低价格（不含候补）
// @description:en Enhance 12306 ticket availability page: show prices, two-line layout, highlight lowest column fare.
// @match        https://kyfw.12306.cn/otn/*
// @match        https://www.12306.cn/otn/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556025/12306%E4%BD%99%E7%A5%A8%E7%A5%A8%E4%BB%B7%E6%98%BE%E7%A4%BA%E4%B8%8E%E6%9C%80%E4%BD%8E%E4%BB%B7%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/556025/12306%E4%BD%99%E7%A5%A8%E7%A5%A8%E4%BB%B7%E6%98%BE%E7%A4%BA%E4%B8%8E%E6%9C%80%E4%BD%8E%E4%BB%B7%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
      .lowest-price {
        background-color: #ffeb3b !important;
        font-weight: bold !important;
        color: #000 !important;
      }
      .price-line {
        color: #000 !important;
        font-size: 12px;
        line-height: 12px;
        display: block;
        margin-top: 2px;
      }
    `;
    document.head.appendChild(style);

    function extractPrice(label) {
        const m = label.match(/票价\s*(\d+(?:\.\d+)?)\s*元/);
        if (!m) return null;
        return parseFloat(m[1]);
    }

    function addPrices() {
        document.querySelectorAll('td[id*="_"]').forEach(td => {
            const label = td.getAttribute("aria-label");
            if (!label) return;

            const price = extractPrice(label);
            if (price == null) return;

            const originalText = td.innerText.trim();

            if (/^(无|--)/.test(originalText)) return;
            if (td.querySelector('.price-line')) return;

            td.innerHTML = `
                <span class="first-line">${originalText}</span>
                <span class="price-line">¥${price}</span>
            `;
        });
    }

    function highlightLowest() {
        const table = document.querySelector("#queryLeftTable");
        if (!table) return;

        table.querySelectorAll(".lowest-price").forEach(td =>
            td.classList.remove("lowest-price")
        );

        const colMin = new Map();

        table.querySelectorAll('td[id*="_"]').forEach(td => {
            const label = td.getAttribute("aria-label");
            if (!label || label.includes("候补")) return;

            const price = extractPrice(label);
            if (price == null) return;

            const firstLine = td.querySelector(".first-line");
            if (!firstLine) return;

            const text = firstLine.innerText.trim();
            if (!/^(有|\d)/.test(text)) return;

            const col = td.cellIndex;
            const e = colMin.get(col);

            if (!e || price < e.price) {
                colMin.set(col, { price, cells: [td] });
            } else if (price === e.price) {
                e.cells.push(td);
            }
        });

        for (const { cells } of colMin.values()) {
            cells.forEach(td => td.classList.add("lowest-price"));
        }
    }

    function mainLoop() {
        addPrices();
        highlightLowest();
    }

    mainLoop();
    setInterval(mainLoop, 1000);
})();
