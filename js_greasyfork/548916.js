// ==UserScript==
// @name         工匠放置小工具之3：市场助手
// @namespace    http://tampermonkey.net/
// @version      1.06
// @description  调整市场UI顺序 + 出售物品快速定价按钮
// @match        https://idleartisan.com/*
// @grant        none
// @author       Stella
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/548916/%E5%B7%A5%E5%8C%A0%E6%94%BE%E7%BD%AE%E5%B0%8F%E5%B7%A5%E5%85%B7%E4%B9%8B3%EF%BC%9A%E5%B8%82%E5%9C%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/548916/%E5%B7%A5%E5%8C%A0%E6%94%BE%E7%BD%AE%E5%B0%8F%E5%B7%A5%E5%85%B7%E4%B9%8B3%EF%BC%9A%E5%B8%82%E5%9C%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const mapping = {
        "Iron Ore": "iron_ore",
        "Iron Bars": "iron_bars",
        "Logs": "logs",
        "Planks": "planks",
        "Gold Bars": "gold_bars",
        "Boss Tokens": "boss_tokens",
        "Treant Resin": "treant_resin",
    };

    // 设置出售价格为市场最低价 -1
    function setSellPriceToLowestMinus1() {
        const priceInput = document.querySelector('#sellPrice');
        const marketTable = document.querySelector('#marketListingsDisplay table tbody');
        if (!priceInput || !marketTable) return;

        const firstRow = marketTable.querySelector('tr');
        if (firstRow) {
            const priceCell = firstRow.querySelector('td:nth-child(3)');
            if (priceCell) {
                const priceText = priceCell.textContent.trim();
                const priceValue = parseFloat(priceText.replace(/,/g, ''));
                if (!isNaN(priceValue)) {
                    let newPrice = priceValue - 0.01;
                    if (newPrice < 0.01) newPrice = 0.01;
                    priceInput.value = newPrice.toFixed(2);
                }
            }
        }
    }

    // 设置固定价格 13.7
    function setSellPriceFixed() {
        const priceInput = document.querySelector('#sellPrice');
        if (priceInput) {
            priceInput.value = 13.70.toFixed(2);
        }
    }

    // 给发布按钮旁边加两个新按钮
    function addQuickPriceButtons() {
        const postBtn = document.querySelector('#sellForm button[onclick="postListing()"]');
        if (!postBtn || postBtn.dataset.extended) return;

        const btn1 = document.createElement('button');
        btn1.type = 'button';
        btn1.textContent = '最低-1';
        btn1.style.marginLeft = '5px';
        btn1.onclick = setSellPriceToLowestMinus1;

        const btn2 = document.createElement('button');
        btn2.type = 'button';
        btn2.textContent = '固定13.7';
        btn2.style.marginLeft = '5px';
        btn2.onclick = setSellPriceFixed;

        postBtn.insertAdjacentElement('afterend', btn2);
        postBtn.insertAdjacentElement('afterend', btn1);

        postBtn.dataset.extended = "true";
    }

    // 调整 UI：顺序为 出售物品 → 卖单清单 → 买单清单 → 市场列表
    function reorderMarketUI() {
        const marketContainer = document.querySelector('#marketContainer');
        const sellSection = document.querySelector('#sellForm')?.parentElement;
        const yourSellSection = document.querySelector('#yourListingsDisplay')?.parentElement;
        const filterSection = document.querySelector('#marketItemFilter')?.parentElement;
        const marketTable = document.querySelector('#marketListingsDisplay');
        const yourBuySection = document.querySelector('#yourBuyOrdersDisplay')?.parentElement;

        if (!marketContainer || !sellSection || !yourSellSection || !filterSection || !marketTable) return;

        // 出售物品
        if (!sellSection.dataset.moved) {
            marketContainer.insertBefore(sellSection, marketContainer.firstChild);
            sellSection.dataset.moved = "true";
        }

        // 卖单清单
        if (!yourSellSection.dataset.moved) {
            marketContainer.insertBefore(yourSellSection, sellSection.nextSibling);
            yourSellSection.dataset.moved = "true";
        }

        // 买单清单（如果有）
        if (yourBuySection && !yourBuySection.dataset.moved) {
            marketContainer.insertBefore(yourBuySection, yourSellSection.nextSibling);
            yourBuySection.dataset.moved = "true";
        }

        // 查看清单筛选器
        if (!filterSection.dataset.moved) {
            if (yourBuySection) {
                marketContainer.insertBefore(filterSection, yourBuySection.nextSibling);
            } else {
                marketContainer.insertBefore(filterSection, yourSellSection.nextSibling);
            }
            filterSection.dataset.moved = "true";
        }

        // 市场列表
        if (!marketTable.dataset.moved) {
            marketContainer.insertBefore(marketTable, filterSection.nextSibling);
            marketTable.dataset.moved = "true";
        }
    }

    function init() {
        const sellSelect = document.querySelector('#sellItemSelect');
        const viewSelect = document.querySelector('#marketItemFilter');
        if (!sellSelect || !viewSelect) return;

        // 绑定 sell 下拉同步事件
        if (!sellSelect.dataset.bound) {
            sellSelect.addEventListener('change', () => {
                const sellVal = sellSelect.value;
                const mappedVal = mapping[sellVal];
                if (mappedVal) {
                    viewSelect.value = mappedVal;
                    viewSelect.dispatchEvent(new Event('change')); // 触发市场刷新
                }
            });
            sellSelect.dataset.bound = "true";
        }

        // 调整顺序
        reorderMarketUI();

        // 添加快速定价按钮
        addQuickPriceButtons();
    }

    // 页面异步加载元素，轮询直到所有关键元素出现
    const interval = setInterval(() => {
        if (document.querySelector('#marketContainer')) {
            init();
            clearInterval(interval);
        }
    }, 500);
})();
