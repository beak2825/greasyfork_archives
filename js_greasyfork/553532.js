// ==UserScript==
// @name         wuwatracker每up角色抽數計算（優化版）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  計算每抽一隻up角色的平均抽數並顯示在頁面上
// @match        https://wuwatracker.com/zh-TW/tracker
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wuwatracker.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553532/wuwatracker%E6%AF%8Fup%E8%A7%92%E8%89%B2%E6%8A%BD%E6%95%B8%E8%A8%88%E7%AE%97%EF%BC%88%E5%84%AA%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553532/wuwatracker%E6%AF%8Fup%E8%A7%92%E8%89%B2%E6%8A%BD%E6%95%B8%E8%A8%88%E7%AE%97%EF%BC%88%E5%84%AA%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOSS_NAMES = ["维里奈", "卡卡羅", "凌陽", "鑒心", "安可"];
    const RESULT_BLOCK_ID = "avgResultBlock";
    const TARGET_CONTAINER_SELECTOR = 'div.px-6.py-6.pt-0.grid.gap-3.text-sm';
    const ROLE_DIV_SELECTOR = 'div[title].relative.h-16.w-16';
    const CAROUSEL_SELECTOR = 'div[aria-roledescription="carousel"].relative.h-64';

    /** 計算平均抽數 **/
    function calculateAverage() {
        const roleDivs = document.querySelectorAll(ROLE_DIV_SELECTOR);
        if (!roleDivs.length) return console.log("⏳ 尚未找到角色容器，等待中...");

        const data = Array.from(roleDivs)
            .map(div => {
                const name = div.getAttribute('title');
                const numEl = div.querySelector('div.absolute.-bottom-1.flex.aspect-square.w-7.items-center.justify-center.rounded-full.text-xs.font-medium');
                const num = numEl ? parseFloat(numEl.textContent.trim()) : null;
                return num ? { name, num } : null;
            })
            .filter(Boolean);

        if (!data.length) return console.log("❌ 沒有讀取到任何角色數字");

        // 計算抽數平均
        let lossSum = 0;
        const results = [];

        [...data].reverse().forEach(({ name, num }) => {
            if (LOSS_NAMES.includes(name)) {
                lossSum += num;
            } else {
                results.push(num + lossSum);
                lossSum = 0;
            }
        });

        const avg = results.length ? (results.reduce((a, b) => a + b, 0) / results.length).toFixed(2) : "0.00";
        console.log(`📊 平均每隻 up 角色抽數：${avg}`);
        updateUI(avg);
    }

    /** 更新或插入結果區塊 **/
    function updateUI(avgResult) {
        const container = document.querySelector(TARGET_CONTAINER_SELECTOR);
        if (!container) return;

        let block = document.getElementById(RESULT_BLOCK_ID);
        if (!block) {
            block = document.createElement("div");
            block.id = RESULT_BLOCK_ID;
            block.innerHTML = `
                <div class="flex cursor-help justify-between gap-4 text-sm" data-state="closed" data-slot="tooltip-trigger">
                    <p class="max-w-[20ch] truncate">每up角色需要幾抽</p>
                    <p class="text-foreground/75 hover:text-foreground transition-colors">${avgResult}</p>
                </div>`;
            container.appendChild(block);
            console.log("✅ 已新增平均抽數結果區塊");
        } else {
            block.querySelector("p:last-child").textContent = avgResult;
            console.log("🔁 已更新平均抽數結果");
        }
    }

    /** 修改 carousel 與卡片高度 **/
    function adjustCardHeights() {
        const carouselDivs = document.querySelectorAll(CAROUSEL_SELECTOR);
        carouselDivs.forEach(div => div.classList.replace('h-64', 'h-80'));

        const cards = document.querySelectorAll(
            'div.bg-card.text-card-foreground.rounded-md.border.shadow-sm.transition-shadow.ease-in-out.hover\\:shadow.dark\\:border-none.group.relative.flex.h-64.flex-1.flex-col'
        );
        cards.forEach(div => div.classList.replace('h-64', 'h-80'));

        if (carouselDivs.length || cards.length)
            console.log(`🧱 已調整 ${carouselDivs.length + cards.length} 個元素高度為 h-80`);
    }

    /** 初始化：用 MutationObserver 偵測頁面載入 **/
    function initObserver() {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector(ROLE_DIV_SELECTOR)) {
                calculateAverage();
                adjustCardHeights();
                obs.disconnect(); // 只執行一次
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', initObserver);
})();
