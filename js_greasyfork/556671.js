// ==UserScript==
// @name         Momo SCM 自動勾選與填寫 (v1.4 - 專注多列表單)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在 scm.momoshop.com.tw 自動勾選 delyGbChecked 並填寫所有列的包材資訊
// @author       Gemini AI
// @match        https://scm.momoshop.com.tw/A1102Servlet.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=momoshop.com.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556671/Momo%20SCM%20%E8%87%AA%E5%8B%95%E5%8B%BE%E9%81%B8%E8%88%87%E5%A1%AB%E5%AF%AB%20%28v14%20-%20%E5%B0%88%E6%B3%A8%E5%A4%9A%E5%88%97%E8%A1%A8%E5%96%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556671/Momo%20SCM%20%E8%87%AA%E5%8B%95%E5%8B%BE%E9%81%B8%E8%88%87%E5%A1%AB%E5%AF%AB%20%28v14%20-%20%E5%B0%88%E6%B3%A8%E5%A4%9A%E5%88%97%E8%A1%A8%E5%96%AE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 輔助函式：觸發 'change' 事件，模擬使用者操作 (用於表單)
    function dispatchChangeEvent(element) {
        if (element) {
            // 觸發 'change' 和 'input' 事件，確保所有可能的監聽器都被觸發
            const changeEvent = new Event('change', { bubbles: true });
            const inputEvent = new Event('input', { bubbles: true });
            element.dispatchEvent(changeEvent);
            element.dispatchEvent(inputEvent);
        }
    }


    // 定義自動處理表單的核心功能
    function autoProcessForm() {
        // console.log('[Momo Auto Form] 開始處理頁面自動化...');

        // ------------------------------------
        // I. 處理 SELECT 下拉式選單 (多列)
        // ------------------------------------

        // 1. 處理 <select name="shippingPackage"> => "自有包材"
        const targetShippingPackage = "自有包材";
        const shippingPackageSelects = document.querySelectorAll('select[name="shippingPackage"]');

        shippingPackageSelects.forEach(shippingPackageSelect => {
            const targetOption = Array.from(shippingPackageSelect.options).find(option => option.textContent.includes(targetShippingPackage));

            if (targetOption && shippingPackageSelect.value !== targetOption.value) {
                shippingPackageSelect.value = targetOption.value;
                dispatchChangeEvent(shippingPackageSelect);
            }
        });

        // 2. 處理 <select name="packageType"> => "紙箱(袋)"
        const targetPackageType = "紙箱(袋)";
        const packageTypeSelects = document.querySelectorAll('select[name="packageType"]');

        packageTypeSelects.forEach(packageTypeSelect => {
            const targetOption = Array.from(packageTypeSelect.options).find(option => option.textContent.includes(targetPackageType));

            if (targetOption && packageTypeSelect.value !== targetOption.value) {
                packageTypeSelect.value = targetOption.value;
                dispatchChangeEvent(packageTypeSelect);
            }
        });

        // ------------------------------------
        // II. 處理 INPUT 輸入欄位 (多列)
        // ------------------------------------

        // 3. 處理 <input name="packingUnit"> => "50"
        const targetValue = "50";
        const packingUnitInputs = document.querySelectorAll('input[name="packingUnit"]');

        packingUnitInputs.forEach(packingUnitInput => {
            if (packingUnitInput.value !== targetValue) {
                packingUnitInput.value = targetValue;
                dispatchChangeEvent(packingUnitInput);
            }
        });

        // ------------------------------------
        // III. 處理 CHECKBOX 勾選 (多列)
        // ------------------------------------

        // 4. 尋找所有 name 為 delyGbChecked 且尚未被勾選的 input
        const checkboxes = document.querySelectorAll('input[name="delyGbChecked"][type="checkbox"]:not(:checked)');

        if (checkboxes.length > 0) {
            // console.log(`[Momo Auto Form] 發現 ${checkboxes.length} 個未勾選項目，正在勾選...`);
            checkboxes.forEach(box => {
                box.checked = true;
                dispatchChangeEvent(box);
            });
        }
    }


    // --- 腳本啟動機制 ---

    // 1. 頁面載入時先執行一次
    window.addEventListener('load', autoProcessForm);

    // 2. 使用 MutationObserver 監聽 DOM 變化 (應對動態內容/換頁/篩選)
    const observer = new MutationObserver((mutations) => {
        autoProcessForm();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 3. 間隔檢查：每 3 秒檢查一次 (額外保險)
    setInterval(autoProcessForm, 3000);

})();