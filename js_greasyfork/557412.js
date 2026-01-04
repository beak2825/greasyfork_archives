// ==UserScript==
// @name        AllwinCard 自动二次验证
// @namespace   http://tampermonkey.net/
// @version     2.1.1
// @description 脚本会持续扫描直到找到验证框，执行一次单次赋值操作后  间隔5秒后重新循环扫描。
// @author      Gemini
// @license     MIT
// @match       *://*.allwincard.com/*
// @grant       window.setTimeout
// @grant       GM_log
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/557412/AllwinCard%20%E8%87%AA%E5%8A%A8%E4%BA%8C%E6%AC%A1%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/557412/AllwinCard%20%E8%87%AA%E5%8A%A8%E4%BA%8C%E6%AC%A1%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // *** 配置区域 ***
    const TARGET_PASSWORD = "142857";       // 您要求输入的密码
    const SCAN_INTERVAL_MS = 1000;          // 每秒扫描一次 (1000ms)
    const DELAY_MS = 500;                   // 延迟时间 (0.5秒)
    const INPUT_ASSIGN_DELAY = 10;          // 逐个赋值之间的极短延迟 (10ms)

    // 🆕 冷却时间 (5秒)
    const COOLDOWN_INTERVAL_MS = 5000;

    // *** 精确元素选择器 (沿用你的原版，因为你确认它有效) ***
    const DIALOG_CONTAINER_SELECTOR = 'div.n-card.n-modal';
    const VERIFICATION_TITLE = '二次验证';
    const PAYMENT_PASSWORD_TAB_SELECTOR = 'div.n-tabs-tab[data-name="payPassword"]';

    const BASE_INPUT_CONTAINER_XPATH = 'body > div.n-modal-container > div > div > div.n-scrollbar-container > div > div.n-card.n-modal > div.n-card__content > div > div.n-tabs-pane-wrapper > div > form > div:nth-child(1) > div.n-form-item-blank > div';

    const INPUT_FIELD_SELECTORS = [
        `${BASE_INPUT_CONTAINER_XPATH} > div:nth-child(1) > div.n-input-wrapper > div > input`, // 1
        `${BASE_INPUT_CONTAINER_XPATH} > div:nth-child(2) > div.n-input-wrapper > div > input`, // 4
        `${BASE_INPUT_CONTAINER_XPATH} > div:nth-child(3) > div.n-input-wrapper > div > input`, // 2
        `${BASE_INPUT_CONTAINER_XPATH} > div:nth-child(4) > div.n-input-wrapper > div > input`, // 8
        `${BASE_INPUT_CONTAINER_XPATH} > div:nth-child(5) > div.n-input-wrapper > div > input`, // 5
        `${BASE_INPUT_CONTAINER_XPATH} > div:nth-child(6) > div.n-input-wrapper > div > input`  // 7
    ];

    // 关键变量：用于控制和存储定时器的 ID
    // 必须在赋值前声明，以便 checkAndOperate 可以访问它
    let scanInterval;

    /**
     * 启动定时扫描 (只在冷却结束后或脚本启动时调用)
     */
    function startScanning() {
        // 只有当 scanInterval 没有被设置时，才创建新的定时器
        if (typeof scanInterval === 'undefined' || scanInterval === null) {
            scanInterval = setInterval(checkAndOperate, SCAN_INTERVAL_MS);
            GM_log(`✅ AllwinCard 自动二次验证脚本已重新启动/启动，每 ${SCAN_INTERVAL_MS}ms 扫描一次...`);
        }
    }


    /**
     * 逐个定位输入框，并赋值、触发事件。
     */
    function assignPasswordByField() {
        let allInputsFound = true;

        // 确保所有输入框元素都能被找到
        const inputElements = INPUT_FIELD_SELECTORS.map(selector => {
            const el = document.querySelector(selector);
            if (!el || el.offsetParent === null) {
                allInputsFound = false;
                GM_log(`❌ 致命错误：未找到输入框元素或不可见: ${selector}`);
            }
            return el;
        });

        if (!allInputsFound) {
            // 如果赋值失败，不进入冷却，但也不需要手动重启，因为 checkAndOperate 还没有停止循环
            return;
        }

        GM_log(`🔑 找到所有 ${inputElements.length} 个输入框，开始逐格赋值...`);

        // 使用 setTimeout 链式调用，确保赋值和事件触发是连续的
        const passwordArray = TARGET_PASSWORD.split('');
        let currentTimeout = 0;

        inputElements.forEach((inputEl, index) => {
            currentTimeout += INPUT_ASSIGN_DELAY;

            window.setTimeout(() => {
                const char = passwordArray[index];

                // 1. 赋值
                inputEl.value = char;

                // 2. 触发事件 (Input 是关键，因为它通常用于数据绑定)
                inputEl.dispatchEvent(new Event('input', { bubbles: true }));

                GM_log(`✅ 成功赋值 [${index + 1}/${inputElements.length}]： ${char}`);

                // 只有在最后一个输入框完成后，才触发最终的 change 事件
                if (index === inputElements.length - 1) {
                    inputEl.dispatchEvent(new Event('change', { bubbles: true }));

                    // 🆕 关键修改：操作完成后，进入冷却期
                    GM_log(`☑️ 任务完成，开始进入 ${COOLDOWN_INTERVAL_MS / 60000} 分钟冷却期...`);
                    // 清除 scanInterval 的引用，确保 startScanning 能创建新的定时器
                    scanInterval = null;

                    window.setTimeout(() => {
                        startScanning(); // 冷却期结束后，重新启动扫描
                    }, COOLDOWN_INTERVAL_MS);
                }
            }, DELAY_MS + currentTimeout); // 基础延迟 + 每次赋值的微小延迟
        });
    }

    /**
     * 核心逻辑函数：检查窗口并执行操作
     */
    function checkAndOperate() {
        // 1. 查找弹窗容器
        const dialogContainer = document.querySelector(DIALOG_CONTAINER_SELECTOR);

        if (dialogContainer && dialogContainer.textContent.includes(VERIFICATION_TITLE)) {
            GM_log("✅ 发现二次验证窗口，开始执行自动化操作...");

            // 2. 查找并点击 "支付密码" Tab
            const paymentPasswordTab = document.querySelector(PAYMENT_PASSWORD_TAB_SELECTOR);

            if (paymentPasswordTab) {
                // *** 关键修改：一旦找到目标并准备开始输入，立即停止定时扫描 ***
                clearInterval(scanInterval);
                scanInterval = undefined; // 标记定时器已停止
                GM_log("🛑 已停止定时扫描，开始执行单次输入流程。");
                // ******************************************************

                // 延迟 0.5 秒后点击
                window.setTimeout(() => {
                    paymentPasswordTab.click();
                    GM_log(`➡️ 延迟 ${DELAY_MS}ms 后，已点击 '支付密码' Tab。`);

                    // 延迟 0.5 秒后执行赋值操作 (给 Tab 切换留出渲染时间)
                    window.setTimeout(() => {
                        assignPasswordByField();
                    }, DELAY_MS);

                }, DELAY_MS);

            } else {
                GM_log("❌ 找到二次验证窗口，但未找到 '支付密码' Tab。继续扫描...");
            }
        }
    }

    // 启动定时扫描
    startScanning();
})();