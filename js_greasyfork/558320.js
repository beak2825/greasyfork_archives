// ==UserScript==
// @name         小米自動五星好評 (V11 - 全自動完成版)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  快速自動點亮五星、強制寫入評論、勾選匿名，並在最後自動點擊提交。
// @author       Gemini
// @match        *://www.mi.com/tw/comment/postreview/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=mi.com
// @grant        none
// @license MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558320/%E5%B0%8F%E7%B1%B3%E8%87%AA%E5%8B%95%E4%BA%94%E6%98%9F%E5%A5%BD%E8%A9%95%20%28V11%20-%20%E5%85%A8%E8%87%AA%E5%8B%95%E5%AE%8C%E6%88%90%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558320/%E5%B0%8F%E7%B1%B3%E8%87%AA%E5%8B%95%E4%BA%94%E6%98%9F%E5%A5%BD%E8%A9%95%20%28V11%20-%20%E5%85%A8%E8%87%AA%E5%8B%95%E5%AE%8C%E6%88%90%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 設定 ---
    const reviewText = "商品質量好，CP值高";
    const initialDelay = 1000; // 初始等待 1 秒
    const stepDelay = 20;      // 動作間隔 0.02 秒
    const submitDelay = 500;   // 全部填完後，等待 0.5 秒再提交 (緩衝)
    const maxAttempts = 30;
    const intervalTime = 300;
    let attempts = 0;
    let timer = null;

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * 【核心函數】強制寫入 React/Vue 控制的輸入框
     */
    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, "value").set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    /**
     * 模擬鍵盤操作來激活五星
     */
    function simulateKeyboardActivation(element, key = 'Enter') {
        if (!element) return;
        element.focus();
        const opts = { bubbles: true, cancelable: true, key: key, keyCode: key === 'Enter' ? 13 : 32 };
        element.dispatchEvent(new KeyboardEvent('keydown', opts));
        element.dispatchEvent(new KeyboardEvent('keyup', opts));
        element.click();
    }

    // 核心執行函數
    async function autoReview() {
        attempts++;

        const reviewCards = document.querySelectorAll('div.post__review--card');

        if (reviewCards.length > 0) {
            console.log(`**已找到 ${reviewCards.length} 個評價項目，全自動模式啟動...**`);
            clearInterval(timer);

            await delay(initialDelay);

            for (let i = 0; i < reviewCards.length; i++) {
                const card = reviewCards[i];

                // --- 1. 極速點亮五星 ---
                const fiveStar = card.querySelector('li.rating-stars__item[aria-label="5 star"]');
                const starList = card.querySelector('ul.rating-stars__list');

                if (fiveStar && starList && starList.getAttribute('aria-label') !== '5 star, 極佳') {
                    simulateKeyboardActivation(fiveStar, 'Space');
                    // 視覺強制覆蓋
                    const allStars = starList.querySelectorAll('li.rating-stars__item');
                    allStars.forEach(star => {
                        const starTop = star.querySelector('.rating-stars__star--top');
                        if (starTop) starTop.style.width = '100%';
                        star.setAttribute('aria-checked', 'false');
                    });
                    fiveStar.setAttribute('aria-checked', 'true');
                    starList.setAttribute('aria-label', '5 star, 極佳');
                    const feedbackText = card.querySelector('.rating-stars__text');
                    if (feedbackText) feedbackText.textContent = '極佳';
                }
                await delay(stepDelay);

                // --- 2. 極速寫入評論 ---
                const textarea = card.querySelector('textarea.mi-textarea__text');
                if (textarea && textarea.value !== reviewText) {
                    setNativeValue(textarea, reviewText);
                }
                await delay(stepDelay);

                // --- 3. 匿名點擊 ---
                const anonymityWrapper = card.querySelector('.post__review--anonymity .checkbox-wrapper');
                const anonymityInput = card.querySelector('.post__review--anonymity input[type="checkbox"]');

                // 檢查是否已勾選
                const isChecked = (anonymityInput && anonymityInput.getAttribute('aria-checked') === 'true') ||
                                  (anonymityWrapper && anonymityWrapper.querySelector('.micon-checkbox-checked'));

                if (anonymityWrapper && !isChecked) {
                    anonymityWrapper.click();
                }

                await delay(stepDelay);
            }

            console.log("--- 所有欄位填寫完畢，準備提交 ---");

            // --- 4. 自動提交 ---
            await delay(submitDelay); // 給予最後一個動作一點緩衝時間

            // 尋找可用的提交按鈕
            const submitButton = document.querySelector('button.mi-btn.mi-btn--primary:not([aria-disabled="true"])');

            if (submitButton) {
                console.log("正在點擊提交按鈕...");
                submitButton.click();
            } else {
                console.warn("未找到可用的提交按鈕 (可能已提交或按鈕仍被禁用)");
            }

        } else if (attempts >= maxAttempts) {
            console.error("未找到評價項目，停止運行。");
            clearInterval(timer);
        }
    }

    timer = setInterval(autoReview, intervalTime);

})();