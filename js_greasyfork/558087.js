// ==UserScript==
// @name         Kemono Auto-Uncheck
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  針對頑固的前端框架，強制取消 auto_import
// @author       Chung Paul
// @match        https://kemono.su/importer*
// @match        https://kemono.cr/importer*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558087/Kemono%20Auto-Uncheck.user.js
// @updateURL https://update.greasyfork.org/scripts/558087/Kemono%20Auto-Uncheck.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function forceUncheck() {
        const checkbox = document.getElementById('auto_import');

        // 只有當找到元素且它仍然是「勾選」狀態時才執行
        if (checkbox && checkbox.checked) {
            console.log("【腳本觸發】發現頑固的勾選框，正在執行強制取消...");

            // --- 策略 A: 點擊 Label ---
            // 很多網站只監聽 Label 的點擊，而不是 Input 本身
            const label = document.querySelector('label[for="auto_import"]');
            if (label) {
                label.click();
            }

            // --- 策略 B: React/Vue 專用滲透法 ---
            // 如果點擊 Label 之後還是勾選狀態（或是被框架改回來了），我們用底層方法
            if (checkbox.checked) {
                // 獲取 HTML 原生的屬性設定器，繞過框架的攔截
                const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'checked').set;

                if (nativeSetter) {
                    // 強制設定為 false
                    nativeSetter.call(checkbox, false);

                    // 偽造一系列事件，騙過框架讓它以為是用戶操作的
                    const eventOptions = { bubbles: true, cancelable: true, view: window };
                    checkbox.dispatchEvent(new MouseEvent('click', eventOptions));
                    checkbox.dispatchEvent(new Event('input', eventOptions));
                    checkbox.dispatchEvent(new Event('change', eventOptions));
                    checkbox.dispatchEvent(new Event('blur', eventOptions));
                }
            }
        }
    }

    // --- 執行策略：持續監控 ---
    // 網頁載入後，網站的程式碼可能會延遲 1~2 秒才去讀取 cookies 並把框勾起來
    // 所以我們要在前 5 秒內，只要看到它亮起來就立刻打下去
    let attempts = 0;
    const timer = setInterval(() => {
        forceUncheck();
        attempts++;
        if (attempts > 20) { // 監控約 10 秒後停止，節省資源
            clearInterval(timer);
        }
    }, 500); // 每 0.5 秒檢查一次

})();