// ==UserScript==
// @name         安全微课自动点击器
// @namespace    https://greasyfork.org/users/1524821-荧熄
// @version      25.10.11
// @description  [自动学习] 适用于大学安全微课 weiban.mycourse.cn 的自动点击脚本。自动点击所有可见的开始、下一页等按钮。
// @author       荧熄 & Gemini
// @license      MIT
// @match        https://mcwk.mycourse.cn/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/iconify-icon@1.0.8/dist/iconify-icon.min.js
// @supportURL   https://github.com/LYCaikano/University-Safety-Micro-Course-Script/issues
// @downloadURL https://update.greasyfork.org/scripts/552146/%E5%AE%89%E5%85%A8%E5%BE%AE%E8%AF%BE%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552146/%E5%AE%89%E5%85%A8%E5%BE%AE%E8%AF%BE%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const START_SELECTORS = [
        'a.an-position.base-an.btn-start',
        'span.page-content-common.page-start-btn'
    ];
    const NEXT_SELECTORS = [
        'a.base-an.btn-base.btn-next[href="javascript:;"]',
        'div.page-content-common.btn-next'
    ];
    const NEXT_END_SELECTORS = [
        'a.base-an.btn-base.btn-next-end[href="javascript:;"]'
    ];

    const DEFAULT_INTERVAL = 3;

    let clickIntervalId = null;
    let isClicking = false;

    // --- 核心逻辑 ---

    function updateLog(message, color = 'black') {
        const logElement = document.getElementById('ac_last_status');
        if (logElement) {
            logElement.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            logElement.style.color = color;
        }
    }

    function isElementVisible(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    }

    function findAndClickButton() {
        if (!isClicking) return;

        let targetButton = null;
        let buttonName = '未知按钮';

        // 遍历选择器查找可见元素
        const findVisibleButtonBySelectors = (selectors, name) => {
            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                for (const el of elements) {
                    if (isElementVisible(el)) {
                        buttonName = name;
                        return el;
                    }
                }
            }
            return null;
        };

        targetButton = findVisibleButtonBySelectors(START_SELECTORS, 'btn-start');

        if (!targetButton) {
            targetButton = findVisibleButtonBySelectors(NEXT_SELECTORS, 'btn-next');
        }

        if (!targetButton) {
            targetButton = findVisibleButtonBySelectors(NEXT_END_SELECTORS, 'btn-next-end');
        }

        // --- 执行点击 ---
        if (targetButton) {
            updateLog(`找到 ${buttonName} 按钮，正在点击...`, '#4CAF50');

            try {
                targetButton.click();
                updateLog('点击执行成功。', '#007bff');

                // 移除 isStopOnSuccess 逻辑

            } catch (error) {
                updateLog('尝试点击失败。', '#f44336');
                console.error(`[AutoClicker] 尝试点击失败:`, error);
            }

        } else {
            updateLog(`未找到可点击按钮（所有类型均不可见或不可点击）。`, 'gray');
        }
    }

    function startClicker(intervalSeconds) {
        stopClicker();

        if (intervalSeconds <= 0 || isNaN(intervalSeconds)) {
            intervalSeconds = DEFAULT_INTERVAL;
        }

        const intervalMs = intervalSeconds * 1000;
        isClicking = true;

        findAndClickButton();
        clickIntervalId = setInterval(findAndClickButton, intervalMs);

        updateLog(`自动点击已启动，间隔: ${intervalSeconds} 秒。`, '#007bff');
        document.getElementById('ac_status').textContent = '运行中';
        document.getElementById('ac_status').style.backgroundColor = '#4CAF50';
        document.getElementById('ac_toggle_btn').textContent = '停止自动点击';
    }

    function stopClicker() {
        if (clickIntervalId !== null) {
            clearInterval(clickIntervalId);
            clickIntervalId = null;
        }
        isClicking = false;
        updateLog('自动点击已停止。', '#f44336');
        document.getElementById('ac_status').textContent = '已停止';
        document.getElementById('ac_status').style.backgroundColor = '#f44336';
        document.getElementById('ac_toggle_btn').textContent = '启动自动点击';
    }


    // --- GUI ---

    function initGUI() {
        GM_addStyle(`
            #autoClickerPanel {
                position: fixed; top: 50px; right: 50px; z-index: 99999;
                padding: 15px; background-color: #f9f9f9; border: 1px solid #ccc;
                border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                font-family: Arial, sans-serif; font-size: 14px; width: 280px;
            }
            #autoClickerPanel h3 { margin-top: 0; margin-bottom: 10px; font-size: 16px; }
            #autoClickerPanel label { display: block; margin-bottom: 5px; font-weight: bold; }
            #autoClickerPanel input[type="number"] {
                width: 60px; padding: 5px; margin-right: 5px; border: 1px solid #ddd; border-radius: 4px;
            }
            #ac_toggle_btn {
                padding: 8px 15px; background-color: #007bff; color: white; border: none;
                border-radius: 4px; cursor: pointer; transition: background-color 0.3s; margin-top: 10px;
                width: 100%; box-sizing: border-box;
            }
            #ac_toggle_btn:hover { background-color: #0056b3; }
            #ac_status {
                display: inline-block; padding: 2px 8px; margin-left: 10px;
                border-radius: 4px; color: white; font-weight: bold; font-size: 12px;
            }
            #ac_last_status {
                margin-top: 10px; padding: 8px; border: 1px solid #eee; background-color: #fff;
                min-height: 20px; font-size: 12px; overflow: hidden;
            }
            .ac-row { margin-bottom: 10px; }
            /* 移除 ac-row input[type="checkbox"] 样式 */
            #ac_github_link {
                display: flex; align-items: center; gap: 8px; margin-top: 10px; padding-top: 8px; border-top: 1px solid #eee;
                font-size: 12px; color: #555;
            }
            #ac_github_link a { text-decoration: none; color: inherit; }
        `);

        const panel = document.createElement('div');
        panel.id = 'autoClickerPanel';
        panel.innerHTML = `
            <h3>自动点击控制器</h3>
            <div class="ac-row">
                <label for="ac_interval">间隔时间 (秒):</label>
                <input type="number" id="ac_interval" min="0.1" step="0.1" value="${GM_getValue('ac_interval', DEFAULT_INTERVAL)}">
                <span id="ac_status">已停止</span>
            </div>

            <button id="ac_toggle_btn">启动自动点击</button>

            <div id="ac_last_status_container">
                <strong>最近状态:</strong>
                <div id="ac_last_status">等待启动...</div>
            </div>

            <div id="ac_github_link">
                <span>原项目请访问:</span>
                <a href="https://github.com/LYCaikano/University-Safety-Micro-Course-Script" target="_blank" title="GitHub 项目地址">
                    <img src="https://api.iconify.design/codicon:github-inverted.svg" alt="GitHub" width="20" height="20" />
                </a>
            </div>
        `;

        document.body.appendChild(panel);

        const toggleButton = document.getElementById('ac_toggle_btn');
        const intervalInput = document.getElementById('ac_interval');

        toggleButton.addEventListener('click', () => {
            if (isClicking) {
                stopClicker();
            } else {
                const interval = parseFloat(intervalInput.value);
                GM_setValue('ac_interval', interval);
                startClicker(interval);
            }
        });

        intervalInput.addEventListener('change', () => {
            const interval = parseFloat(intervalInput.value);
            GM_setValue('ac_interval', interval);
            if (isClicking) {
                startClicker(interval);
            }
        });

        stopClicker();
    }

    initGUI();

})();