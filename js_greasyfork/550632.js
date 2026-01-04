// ==UserScript==
// @name         Steam 市场 — CS 批量出售按钮（Bulk sell）
// @namespace    https://github.com/yourname
// @version      0.9
// @description  在 Steam 市场物品页面注入「批量出售」按钮，点击后跳转到批量出售该物品页面。需要登录 Steam。使用风险自担。仅供个人使用和学习。
// @author       Dwy
// @match        https://steamcommunity.com/market/listings/730/*
// @grant        none
// @license      MIT    
// @run-at       document-header
// @downloadURL https://update.greasyfork.org/scripts/550632/Steam%20%E5%B8%82%E5%9C%BA%20%E2%80%94%20CS%20%E6%89%B9%E9%87%8F%E5%87%BA%E5%94%AE%E6%8C%89%E9%92%AE%EF%BC%88Bulk%20sell%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550632/Steam%20%E5%B8%82%E5%9C%BA%20%E2%80%94%20CS%20%E6%89%B9%E9%87%8F%E5%87%BA%E5%94%AE%E6%8C%89%E9%92%AE%EF%BC%88Bulk%20sell%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- 插入按钮 ---------- */
    function createBulkButton() {
        const btn = document.createElement('button');
        btn.textContent = '批量出售';
        btn.id = 'bulkSellButton';
        btn.style.cursor = 'pointer';
        btn.style.padding = '6px 10px';
        btn.style.margin = '6px';
        btn.style.borderRadius = '4px';
        btn.style.border = '1px solid rgba(0,0,0,0.2)';
        btn.style.background = 'linear-gradient(#f6f6f6,#eaeaea)';
        btn.style.fontWeight = '600';
        btn.title = '批量出售';
        return btn;
    }

    function insertButtonNearSell() {
        // 尝试把按钮插入到页面中“出售”按钮的上方 / 旁边；如果没找到，插入到 header
        const existingSellBtn = document.querySelector('.market_commodity_buy_button')
        const target = existingSellBtn || document.querySelector('#largeiteminfo_item_actions') || document.querySelector('.market_listing_nav') || document.body;
        if (!document.querySelector('#bulkSellButton')) {
            const btn = createBulkButton();
            if (existingSellBtn && existingSellBtn.parentNode) {
                existingSellBtn.parentNode.insertBefore(btn, existingSellBtn);
            } else {
                target.insertBefore(btn, target.firstChild);
            }
            return btn;
        }
        return document.querySelector('#bulkSellButton');
    }

    // 提取地址栏中最后一个 / 后的内容
    function extractLastSegment(url) {
        const parts = url.split('/');
        return parts.pop() || parts.pop();
    }

    // 脚本启用时的功能
    function runScript() {
        const item = extractLastSegment(window.location.href);
        const steamUrl = `https://steamcommunity.com/market/multisell?appid=730&contextid=2&items[]=${item}`;
        window.open(steamUrl, '_blank');
    }

    /* ---------- 启动注入并绑定事件 ---------- */
    function bind() {
        const btn = insertButtonNearSell();
        if (!btn) return;
        console.log('add button success;');
        btn.addEventListener('click', async (e) => {
            runScript()
        });
    }

    bind();

})();
