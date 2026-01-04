// ==UserScript==
// @license      MIT
// @name         B4U 幸运抽奖自动执行助手 (专业版)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  专为您定制的自动化抽奖脚本。自动检测“开始抽奖”状态，智能处理“欧气加成”逻辑，支持循环执行。
// @author       您的专属高级程序员
// @match        https://tw.b4u.qzz.io/luckydraw*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560033/B4U%20%E5%B9%B8%E8%BF%90%E6%8A%BD%E5%A5%96%E8%87%AA%E5%8A%A8%E6%89%A7%E8%A1%8C%E5%8A%A9%E6%89%8B%20%28%E4%B8%93%E4%B8%9A%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560033/B4U%20%E5%B9%B8%E8%BF%90%E6%8A%BD%E5%A5%96%E8%87%AA%E5%8A%A8%E6%89%A7%E8%A1%8C%E5%8A%A9%E6%89%8B%20%28%E4%B8%93%E4%B8%9A%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================
    const CONFIG = {
        retryInterval: 1000,    // 找不到按钮时的重试间隔 (毫秒)
        loopInterval: 10000,    // 成功点击后的循环等待时间 (毫秒)
        boostWaitTime: 3000,    // 点击欧气加成后的等待时间 (毫秒)
        selectors: {
            // 使用 XPath 精准匹配包含 "开始抽奖" 文本的按钮
            startBtnXPath: "//button[contains(., '开始抽奖')]",
            // 欧气加成按钮
            boostBtn: 'button[aria-label="获取欧气加成"]',
            // 全局文本检测
            boostText: "前来助力"
        }
    };

    // ================= UI 辅助功能 =================
    // 创建一个美观的状态面板，向老板汇报工作进度
    const statusPanel = document.createElement('div');
    statusPanel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.85);
        color: #00ff00;
        padding: 15px;
        border-radius: 8px;
        font-family: 'Consolas', monospace;
        font-size: 13px;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 300px;
        border: 1px solid #333;
    `;
    document.body.appendChild(statusPanel);

    function log(msg, type = 'info') {
        const time = new Date().toLocaleTimeString();
        let color = '#fff';
        if (type === 'error') color = '#ff4444';
        if (type === 'success') color = '#00ff00';
        if (type === 'warn') color = '#ffdd00';

        statusPanel.innerHTML = `
            <div style="color: #888; margin-bottom: 5px;">[系统状态]</div>
            <div style="color: ${color}; line-height: 1.5;">[${time}] ${msg}</div>
        `;
        console.log(`[抽奖助手] ${msg}`);
    }

    // ================= 工具函数 =================
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 使用 XPath 查找元素
    function getElementByXPath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // 检查按钮是否被禁用
    function isButtonDisabled(btn) {
        if (!btn) return true;
        return btn.disabled ||
               btn.classList.contains('disabled') ||
               btn.getAttribute('aria-disabled') === 'true';
    }

    // 检查全局是否有特定文本
    function hasText(text) {
        return document.body.innerText.includes(text);
    }

    // ================= 核心逻辑 =================

    async function mainLogic() {
        log("开始新一轮检查...", 'info');

        // 1. 查找 "开始抽奖" 按钮
        const startBtn = getElementByXPath(CONFIG.selectors.startBtnXPath);

        if (!startBtn) {
            log("未找到'开始抽奖'按钮，页面可能未加载完成，1秒后重试...", 'warn');
            setTimeout(mainLogic, CONFIG.retryInterval);
            return;
        }

        // 2. 检查按钮是否 Disabled
        // 需求：如果按钮 disabled，return 不再执行
        if (isButtonDisabled(startBtn)) {
            log("检测到按钮处于禁用状态 (Disabled)。根据指令，停止脚本运行。", 'error');
            return; // 严格执行：不再执行
        }

        // 3. 检查全局是否有 "前来助力"
        const boostTextExists = hasText(CONFIG.selectors.boostText);
        let readyToClick = false;

        if (boostTextExists) {
            log(`检测到 "${CONFIG.selectors.boostText}"，准备直接抽奖。`, 'success');
            readyToClick = true;
        } else {
            log(`未检测到 "${CONFIG.selectors.boostText}"，尝试获取欧气加成...`, 'warn');

            // 尝试点击 "获取欧气加成"
            const boostBtn = document.querySelector(CONFIG.selectors.boostBtn);
            if (boostBtn) {
                boostBtn.click();
                log(`已点击加成按钮，等待 ${CONFIG.boostWaitTime/1000} 秒...`, 'info');
                await sleep(CONFIG.boostWaitTime);

                // 再次点击前的检查逻辑
                log("等待结束，准备再次尝试点击主按钮...", 'info');
                const btnRetry = getElementByXPath(CONFIG.selectors.startBtnXPath);

                // 再次检查 Disabled
                if (isButtonDisabled(btnRetry)) {
                    log("再次检查：按钮已禁用。停止运行。", 'error');
                    return;
                }

                // 再次检查文本 (虽然需求说要检查，但没说检查失败后是否终止，通常意味着记录状态后继续尝试点击)
                const textRetry = hasText(CONFIG.selectors.boostText);
                if (!textRetry) {
                    log(`再次检查：仍未发现 "${CONFIG.selectors.boostText}"，但继续尝试点击。`, 'warn');
                } else {
                    log(`再次检查：成功发现 "${CONFIG.selectors.boostText}"。`, 'success');
                }

                readyToClick = true;
            } else {
                log("未找到'获取欧气加成'按钮，跳过加成步骤，直接尝试抽奖。", 'warn');
                readyToClick = true;
            }
        }

        // 4. 执行点击动作
        if (readyToClick) {
            // 重新获取最新的按钮引用，防止DOM刷新导致引用失效
            const finalBtn = getElementByXPath(CONFIG.selectors.startBtnXPath);
            if (finalBtn && !isButtonDisabled(finalBtn)) {
                finalBtn.click();
                log(">>> 成功点击 '开始抽奖' <<<", 'success');

                // 5. 成功后等待 10s 再次执行
                log(`进入冷却周期，将在 ${CONFIG.loopInterval/1000} 秒后开始下一轮...`, 'info');
                setTimeout(mainLogic, CONFIG.loopInterval);
            } else {
                log("点击前最后一刻发现按钮不可用，停止。", 'error');
                return;
            }
        }
    }

    // ================= 启动脚本 =================
    window.addEventListener('load', () => {
        log("页面加载完毕，脚本启动中...");
        // 延迟一小会儿确保动态内容渲染
        setTimeout(mainLogic, 2000);
    });

})();
