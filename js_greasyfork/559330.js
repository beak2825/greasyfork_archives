// ==UserScript==
// @name         焦作工贸智慧职教MOOC自动随机设置精华
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  在列表页每页随机设置精华，用户自定义次数和数量
// @author       YourName
// @match        https://ai.icve.com.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559330/%E7%84%A6%E4%BD%9C%E5%B7%A5%E8%B4%B8%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99MOOC%E8%87%AA%E5%8A%A8%E9%9A%8F%E6%9C%BA%E8%AE%BE%E7%BD%AE%E7%B2%BE%E5%8D%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/559330/%E7%84%A6%E4%BD%9C%E5%B7%A5%E8%B4%B8%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99MOOC%E8%87%AA%E5%8A%A8%E9%9A%8F%E6%9C%BA%E8%AE%BE%E7%BD%AE%E7%B2%BE%E5%8D%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ----- 配置部分 -----
    let TARGET_CLICKS = parseInt(GM_getValue('targetClicks', 420)); // 目标点击次数，从存储读取
    let CLICKS_PER_PAGE = parseInt(GM_getValue('clicksPerPage', 1)); // 每页点击数量，从存储读取
    const NEXT_PAGE_BUTTON_SELECTOR = 'li.ivu-page-next'; // 下一页按钮
    const SET_ESSENCE_BUTTON_SELECTOR = 'label[data-v-52c715e2]'; // 精华按钮
    const DELAY_BETWEEN_ACTIONS = 500; // 操作间延迟（毫秒）
    const DELAY_AFTER_PAGELOAD = 1500; // 页面加载后等待时间（毫秒）

    // ----- 状态控制 -----
    let isRunning = false;
    let completedClicks = GM_getValue('completedClicks', 0) || 0;
    let currentTimer = null;
    let retryCount = 0;
    const MAX_RETRIES = 5; // 未找到精华按钮最大重试次数

    // ----- 创建控制面板 -----
    function createControlPanel() {
        if (document.getElementById('autoEssencePanel')) return;

        // 添加样式 - 修改为蓝紫色渐变边框
        GM_addStyle(`
            #autoEssencePanel {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border: 2px solid;
                border-image: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                border-image-slice: 1;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: Arial, sans-serif;
                min-width: 320px;
                max-width: 350px;
            }
            #autoEssencePanel h3 {
                margin-top: 0;
                margin-bottom: 15px;
                color: #6a11cb;
                font-size: 16px;
                text-align: center;
            }
            #autoEssencePanel .config-item {
                margin-bottom: 12px;
                font-size: 14px;
            }
            #autoEssencePanel .config-item label {
                display: block;
                margin-bottom: 4px;
                color: #555;
                font-weight: bold;
            }
            #autoEssencePanel .config-item input {
                width: 100%;
                padding: 6px 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-sizing: border-box;
            }
            #autoEssencePanel .status-item {
                margin-bottom: 8px;
                font-size: 14px;
            }
            #autoEssencePanel .progress-bar {
                height: 20px;
                background: #f0f0f0;
                border-radius: 10px;
                margin: 10px 0;
                overflow: hidden;
            }
            #autoEssencePanel .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #6a11cb, #2575fc);
                width: 0%;
                transition: width 0.3s;
            }
            #autoEssencePanel .button-group {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 15px;
            }
            #autoEssencePanel button {
                flex: 1;
                min-width: 70px;
                padding: 8px 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                transition: opacity 0.2s, transform 0.1s;
            }
            #autoEssencePanel button:hover {
                opacity: 0.9;
                transform: translateY(-1px);
            }
            #autoEssencePanel button:active {
                transform: translateY(0);
            }
            #autoEssencePanel button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }
            #startBtn { background: linear-gradient(135deg, #6a11cb, #2575fc); color: white; }
            #stopBtn { background: linear-gradient(135deg, #ff416c, #ff4b2b); color: white; }
            #resetBtn { background: linear-gradient(135deg, #FF9800, #FF5722); color: white; }
            #testBtn { background: linear-gradient(135deg, #2196F3, #21CBF3); color: white; }
            #saveBtn { background: linear-gradient(135deg, #4CAF50, #8BC34A); color: white; }
            #autoEssencePanel .log {
                margin-top: 15px;
                font-size: 12px;
                color: #666;
                max-height: 120px;
                overflow-y: auto;
                border-top: 1px solid #eee;
                padding-top: 8px;
            }
            .error-notification {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ff416c, #ff4b2b);
                color: white;
                padding: 20px 30px;
                border-radius: 10px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                z-index: 10001;
                text-align: center;
                max-width: 400px;
                animation: fadeIn 0.5s;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -40%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }
        `);

        const panel = document.createElement('div');
        panel.id = 'autoEssencePanel';

        // 计算进度百分比
        const progressPercent = Math.min(100, (completedClicks / TARGET_CLICKS * 100));

        panel.innerHTML = `
            <h3>✨ 自动设置精华</h3>

            <div class="config-item">
                <label>目标设置次数:</label>
                <input type="number" id="targetInput" min="1" max="1000" value="${TARGET_CLICKS}">
            </div>

            <div class="config-item">
                <label>每页随机设置数量:</label>
                <input type="number" id="perPageInput" min="1" max="10" value="${CLICKS_PER_PAGE}">
            </div>

            <div class="status-item">
                <strong>已完成:</strong> <span id="progressCount">${completedClicks}</span> / <span id="targetDisplay">${TARGET_CLICKS}</span> 次
            </div>
            <div class="status-item">
                <strong>状态:</strong> <span id="statusText" style="color: #d32f2f;">已停止</span>
            </div>

            <div class="progress-bar">
                <div id="progressFill" class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>

            <div class="button-group">
                <button id="saveBtn">💾 保存设置</button>
                <button id="startBtn">▶ 开始</button>
                <button id="stopBtn" disabled>■ 停止</button>
                <button id="resetBtn">↺ 重置</button>
                <button id="testBtn">🔍 测试</button>
            </div>

            <div class="log">
                <div><strong>操作日志:</strong></div>
                <div id="logContent" style="margin-top: 5px; font-family: monospace; font-size: 11px;"></div>
            </div>

            <div style="margin-top: 8px; font-size: 11px; color: #888;">
                配置: 精华按钮 → ${SET_ESSENCE_BUTTON_SELECTOR}<br>
                下一页 → ${NEXT_PAGE_BUTTON_SELECTOR}
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定按钮事件
        document.getElementById('startBtn').addEventListener('click', startProcess);
        document.getElementById('stopBtn').addEventListener('click', stopProcess);
        document.getElementById('resetBtn').addEventListener('click', resetProcess);
        document.getElementById('testBtn').addEventListener('click', testSelectors);
        document.getElementById('saveBtn').addEventListener('click', saveSettings);

        // 输入框变化时实时更新显示
        document.getElementById('targetInput').addEventListener('input', updateTargetDisplay);
        document.getElementById('perPageInput').addEventListener('input', function() {
            addLog(`每页设置数量更新为: ${this.value}`);
        });

        addLog('控制面板已加载');
        if (completedClicks > 0) {
            addLog(`恢复进度: ${completedClicks}/${TARGET_CLICKS}`);
        }
    }

    // ----- 核心功能函数 -----
    function startProcess() {
        if (isRunning) {
            addLog('脚本已在运行中');
            return;
        }

        // 获取最新的目标值
        updateTargetFromInput();

        if (completedClicks >= TARGET_CLICKS) {
            showErrorNotification(`🎉 任务已完成！已累计设置精华 ${TARGET_CLICKS} 次。`);
            addLog('任务已完成，请重置后重新开始');
            return;
        }

        // 测试选择器是否有效
        const essenceButtons = document.querySelectorAll(SET_ESSENCE_BUTTON_SELECTOR);
        const nextButton = document.querySelector(NEXT_PAGE_BUTTON_SELECTOR);

        if (essenceButtons.length === 0) {
            addLog('❌ 错误: 未找到精华按钮');
            return;
        }

        if (!nextButton) {
            addLog('❌ 错误: 未找到下一页按钮');
            return;
        }

        isRunning = true;
        retryCount = 0; // 重置重试计数器
        updateStatus('运行中', '#6a11cb');
        document.getElementById('startBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
        document.getElementById('testBtn').disabled = true;
        document.getElementById('saveBtn').disabled = true;

        addLog('✅ 开始自动设置精华任务...');
        addLog(`目标: ${TARGET_CLICKS} 次，每页: ${CLICKS_PER_PAGE} 个`);
        addLog(`当前页找到 ${essenceButtons.length} 个精华按钮`);

        // 执行一次完整的"点击-翻页"循环
        performClickAndTurnPage();
    }

    function stopProcess() {
        if (!isRunning) return;

        isRunning = false;
        if (currentTimer) {
            clearTimeout(currentTimer);
            currentTimer = null;
        }

        updateStatus('已停止', '#d32f2f');
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
        document.getElementById('testBtn').disabled = false;
        document.getElementById('saveBtn').disabled = false;
        GM_setValue('completedClicks', completedClicks);

        addLog('⏸️ 已停止任务');
        addLog(`当前进度: ${completedClicks}/${TARGET_CLICKS}`);
    }

    function resetProcess() {
        if (isRunning) {
            if (!confirm('任务正在运行中，确定要重置吗？')) return;
            stopProcess();
        }

        completedClicks = 0;
        GM_setValue('completedClicks', 0);
        updateProgress();
        updateStatus('已重置', '#FF9800');
        addLog('🔄 已重置进度');

        setTimeout(() => {
            if (!isRunning) updateStatus('已停止', '#d32f2f');
        }, 2000);
    }

    // 保存设置
    function saveSettings() {
        updateTargetFromInput();
        const perPageInput = document.getElementById('perPageInput');
        CLICKS_PER_PAGE = parseInt(perPageInput.value) || 1;
        if (CLICKS_PER_PAGE < 1) CLICKS_PER_PAGE = 1;
        if (CLICKS_PER_PAGE > 10) CLICKS_PER_PAGE = 10;

        GM_setValue('targetClicks', TARGET_CLICKS);
        GM_setValue('clicksPerPage', CLICKS_PER_PAGE);

        addLog('✅ 设置已保存');
        addLog(`目标次数: ${TARGET_CLICKS}, 每页数量: ${CLICKS_PER_PAGE}`);

        // 显示保存成功提示
        const saveBtn = document.getElementById('saveBtn');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '✅ 已保存';
        saveBtn.style.background = 'linear-gradient(135deg, #4CAF50, #8BC34A)';

        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = 'linear-gradient(135deg, #4CAF50, #8BC34A)';
        }, 1500);
    }

    // 更新目标值从输入框
    function updateTargetFromInput() {
        const targetInput = document.getElementById('targetInput');
        TARGET_CLICKS = parseInt(targetInput.value) || 420;
        if (TARGET_CLICKS < 1) TARGET_CLICKS = 1;
        if (TARGET_CLICKS > 1000) TARGET_CLICKS = 1000;
        targetInput.value = TARGET_CLICKS;

        // 更新显示
        const targetDisplay = document.getElementById('targetDisplay');
        if (targetDisplay) {
            targetDisplay.textContent = TARGET_CLICKS;
        }
    }

    function updateTargetDisplay() {
        updateTargetFromInput();
        updateProgress(); // 更新进度条
    }

    // 测试选择器
    function testSelectors() {
        addLog('正在测试选择器...');

        const essenceButtons = document.querySelectorAll(SET_ESSENCE_BUTTON_SELECTOR);
        const nextButton = document.querySelector(NEXT_PAGE_BUTTON_SELECTOR);

        addLog(`精华按钮: 找到 ${essenceButtons.length} 个`);

        if (essenceButtons.length > 0) {
            essenceButtons.forEach((btn, i) => {
                const text = btn.textContent.trim();
                addLog(`  按钮${i+1}: "${text}" ${text === '设置精华' ? '✅' : ''}`);
            });
        }

        if (nextButton) {
            addLog(`下一页按钮: 找到 ✅`);
            // 高亮显示下一页按钮
            nextButton.style.outline = '2px solid #6a11cb';
            nextButton.style.outlineOffset = '2px';
            setTimeout(() => {
                if (nextButton) nextButton.style.outline = '';
            }, 3000);
        } else {
            addLog(`下一页按钮: 未找到 ❌`);
        }

        if (essenceButtons.length > 0 && nextButton) {
            addLog('✅ 选择器测试通过，可以开始任务');
        } else {
            addLog('❌ 选择器测试失败，请检查配置');
        }
    }

    // 执行随机点击并翻页
    function performClickAndTurnPage() {
        if (!isRunning) return;

        // 1. 随机点击精华按钮
        const buttons = document.querySelectorAll(SET_ESSENCE_BUTTON_SELECTOR);

        if (buttons.length === 0) {
            retryCount++;
            addLog(`⚠️ 未找到精华按钮 (重试 ${retryCount}/${MAX_RETRIES})`);

            if (retryCount >= MAX_RETRIES) {
                handleMaxRetriesReached();
                return;
            }

            // 等待后重试
            currentTimer = setTimeout(() => {
                performClickAndTurnPage();
            }, 1000);
            return;
        }

        // 重置重试计数器
        retryCount = 0;

        // 获取可用的"设置精华"按钮
        let availableButtons = [];
        buttons.forEach((btn, index) => {
            if (btn.textContent.includes('设置精华')) {
                availableButtons.push({btn, index});
            }
        });

        // 如果可用按钮不足，添加所有按钮
        if (availableButtons.length < CLICKS_PER_PAGE) {
            buttons.forEach((btn, index) => {
                // 避免重复添加
                if (!availableButtons.some(item => item.index === index)) {
                    availableButtons.push({btn, index});
                }
            });
        }

        // 随机选择指定数量的按钮
        const selectedButtons = [];
        const clicksThisPage = Math.min(CLICKS_PER_PAGE, availableButtons.length);

        for (let i = 0; i < clicksThisPage; i++) {
            if (availableButtons.length === 0) break;

            const randomIndex = Math.floor(Math.random() * availableButtons.length);
            selectedButtons.push(availableButtons[randomIndex]);
            availableButtons.splice(randomIndex, 1); // 移除已选的，避免重复
        }

        // 点击选中的按钮
        selectedButtons.forEach(({btn, index}) => {
            const buttonText = btn.textContent.trim();
            btn.click();
            completedClicks++;
            addLog(`✅ 点击了第 ${index + 1} 个按钮 ("${buttonText}")`);
        });

        updateProgress();
        addLog(`本页设置了 ${selectedButtons.length} 个，进度: ${completedClicks}/${TARGET_CLICKS}`);

        // 检查是否完成目标
        if (completedClicks >= TARGET_CLICKS) {
            stopProcess();
            setTimeout(() => {
                showErrorNotification(`🎉 恭喜！任务完成！\n已累计设置精华 ${TARGET_CLICKS} 次。`);
            }, 500);
            return;
        }

        // 2. 延迟后翻到下一页
        currentTimer = setTimeout(() => {
            const nextPageButton = document.querySelector(NEXT_PAGE_BUTTON_SELECTOR);

            if (nextPageButton) {
                addLog('➡️ 正在翻到下一页...');
                nextPageButton.click();

                // 等待新页面加载
                currentTimer = setTimeout(() => {
                    if (isRunning) {
                        addLog('🔄 新页面已加载，继续执行...');
                        performClickAndTurnPage();
                    }
                }, DELAY_AFTER_PAGELOAD);
            } else {
                addLog('❌ 未找到下一页按钮，已停止');
                stopProcess();
                showErrorNotification('未找到下一页按钮，脚本已停止。\n可能已到最后一页或选择器有误。');
            }
        }, DELAY_BETWEEN_ACTIONS);
    }

    // 处理达到最大重试次数
    function handleMaxRetriesReached() {
        addLog('❌ 连续5次未找到精华按钮，任务终止');
        showErrorNotification(
            '已完成或未知错误<br>' +
            '请检查：<br>' +
            '1. 是否在当前页面<br>' +
            '2. 精华按钮是否存在<br>' +
            '3. 选择器是否正确<br><br>' +
            '如需帮助，请联系：3535944909@qq.com'
        );
        stopProcess();
    }

    // 显示错误通知
    function showErrorNotification(message) {
        // 移除现有的通知
        const existingNotification = document.querySelector('.error-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = message.replace(/\n/g, '<br>');

        document.body.appendChild(notification);

        // 5秒后自动移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);

        // 点击也可移除
        notification.addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    // ----- 辅助函数 -----
    function updateStatus(text, color) {
        const statusEl = document.getElementById('statusText');
        if (statusEl) {
            statusEl.textContent = text;
            statusEl.style.color = color;
        }
    }

    function updateProgress() {
        const progressCount = document.getElementById('progressCount');
        const progressFill = document.getElementById('progressFill');

        if (progressCount) progressCount.textContent = completedClicks;
        if (progressFill) {
            const percent = Math.min(100, (completedClicks / TARGET_CLICKS * 100));
            progressFill.style.width = percent + '%';
        }
    }

    function addLog(message) {
        const logContent = document.getElementById('logContent');
        if (logContent) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.textContent = `[${timestamp}] ${message}`;
            logContent.appendChild(logEntry);

            // 保持日志在最新
            logContent.scrollTop = logContent.scrollHeight;

            // 限制日志数量
            if (logContent.children.length > 20) {
                logContent.removeChild(logContent.firstChild);
            }
        }
        console.log(`[自动精华脚本] ${message}`);
    }

    // ----- 初始化 -----
    function init() {
        // 确保页面主体已加载
        if (document.body) {
            setTimeout(createControlPanel, 1000);
        } else {
            setTimeout(init, 100);
        }
    }

    // 启动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();