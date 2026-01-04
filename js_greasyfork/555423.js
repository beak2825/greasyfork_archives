// ==UserScript==
// @name         Sorceryntax 隊列行動系統 + 智慧休息(final)
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  可拖曳設定的行動隊列系統，支援循環執行、錯誤處理和智慧休息功能
// @match        https://sorceryntax3.onrender.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555423/Sorceryntax%20%E9%9A%8A%E5%88%97%E8%A1%8C%E5%8B%95%E7%B3%BB%E7%B5%B1%20%2B%20%E6%99%BA%E6%85%A7%E4%BC%91%E6%81%AF%28final%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555423/Sorceryntax%20%E9%9A%8A%E5%88%97%E8%A1%8C%E5%8B%95%E7%B3%BB%E7%B5%B1%20%2B%20%E6%99%BA%E6%85%A7%E4%BC%91%E6%81%AF%28final%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待DOM完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlugin);
    } else {
        setTimeout(initPlugin, 1000);
    }

    function initPlugin() {
        // 检查是否已经存在面板，避免重复创建
        if (document.getElementById('queuePanel')) {
            console.log('插件面板已存在，跳过初始化');
            return;
        }

        console.log('开始初始化插件面板...');

        // 创建面板容器
        const panel = document.createElement('div');
        panel.id = 'queuePanel';
        panel.innerHTML = `
            <div id="queuePanelHeader">
                <span id="panelTitle">🔄 Sorceryntax 隊列行動系統 v1.3</span>
                <div id="panelControls">
                    <button id="minimizeBtn" class="control-btn" title="最小化">−</button>
                    <button id="closeBtn" class="control-btn" title="關閉">×</button>
                </div>
            </div>
            <div class="content">
                <div class="section">
                    <b>📋 行動隊列設定 (最多5個)</b>
                    <div id="queueContainer" class="queue-container" style="min-height: 60px; border: 1px dashed #666; padding: 5px; margin: 5px 0; border-radius: 4px;">
                        <div style="text-align: center; color: #999; font-size: 12px; padding: 10px;">
                            點擊下方按鈕添加行動隊列
                        </div>
                    </div>
                    <button id="addQueueBtn" class="add-btn" style="width: 100%;">+ 添加行動</button>
                </div>

                <div class="section">
                    <b>⚙️ 控制設定</b>
                    <div style="margin-top:8px;">
                        <label style="display: block; margin: 5px 0;">
                            <input type="checkbox" id="loopQueue" checked> 循環執行隊列
                        </label>
                        <label style="display: block; margin: 5px 0;">
                            <input type="checkbox" id="stopOnError"> 錯誤時終止全部行動隊列
                        </label>
                    </div>
                    <div style="margin-top:8px; display:flex; gap:6px;">
                        <button id="startQueue" class="green-btn" style="flex: 1;">開始執行</button>
                        <button id="stopQueue" class="red-btn" style="flex: 1;" disabled>停止執行</button>
                    </div>
                </div>

                <div class="section">
                    <b>💤 智慧休息設定</b>
                    <div style="margin-top:6px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <span style="font-size: 12px; min-width: 120px;">閒置等待時間：</span>
                            <input id="idleWaitTime" type="number" value="5" min="10" step="10" style="width: 80px;">
                            <span style="font-size: 12px;">秒</span>
                        </div>
                    </div>
                    <div style="margin-top:8px; display:flex; gap:6px;">
                        <button id="startIdleRest" class="green-btn" style="flex: 1;">開啟休息</button>
                        <button id="stopIdleRest" class="red-btn" style="flex: 1;" disabled>關閉休息</button>
                    </div>
                    <div id="queueStatus" class="status" style="margin-top: 8px; padding: 8px; background: #333; border-radius: 4px; font-size: 12px;">
                        狀態：系統就緒，等待設定
                    </div>
                    <div id="queueDetails" class="status" style="margin-top: 5px; padding: 5px; background: #222; border-radius: 3px; font-size: 11px; color: #ccc;">
                        當前隊列：無
                    </div>
                </div>
            </div>
        `;

        // 添加CSS样式
        const style = document.createElement('style');
        style.textContent = `
            #queuePanel {
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                width: 400px !important;
                background: #2a2a2a !important;
                border: 2px solid #444 !important;
                border-radius: 10px !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
                z-index: 10000 !important;
                font-family: "Microsoft JhengHei", "微軟正黑體", Arial, sans-serif !important;
                color: #fff !important;
                resize: both !important;
                overflow: hidden !important;
                transition: all 0.3s ease !important;
            }

            #queuePanel.minimized {
                height: 40px !important;
                min-height: 40px !important;
                width: 300px !important;
            }

            #queuePanel.minimized .content {
                display: none !important;
            }

            #queuePanelHeader {
                background: #333 !important;
                padding: 12px 15px !important;
                border-bottom: 2px solid #444 !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                cursor: move !important;
                user-select: none !important;
                height: 40px !important;
                box-sizing: border-box !important;
            }

            #panelTitle {
                font-size: 14px !important;
                font-weight: bold !important;
                color: #4CAF50 !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
            }

            #panelControls {
                display: flex !important;
                gap: 5px !important;
            }

            .control-btn {
                width: 24px !important;
                height: 24px !important;
                border: none !important;
                border-radius: 3px !important;
                color: white !important;
                cursor: pointer !important;
                font-size: 16px !important;
                font-weight: bold !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: background 0.2s !important;
            }

            #minimizeBtn {
                background: #ff9800 !important;
            }

            #minimizeBtn:hover {
                background: #e68900 !important;
            }

            #closeBtn {
                background: #f44336 !important;
            }

            #closeBtn:hover {
                background: #da190b !important;
            }

            .content {
                padding: 15px !important;
                background: #2a2a2a !important;
                max-height: 500px !important;
                overflow-y: auto !important;
                transition: all 0.3s ease !important;
            }

            .section {
                margin-bottom: 20px !important;
                padding-bottom: 15px !important;
                border-bottom: 1px solid #444 !important;
            }

            .section:last-child {
                border-bottom: none !important;
                margin-bottom: 0 !important;
            }

            .section b {
                display: block !important;
                font-size: 13px !important;
                margin-bottom: 10px !important;
                color: #4CAF50 !important;
            }

            .queue-item {
                background: #333 !important;
                border: 1px solid #444 !important;
                border-radius: 5px !important;
                padding: 8px !important;
                margin: 5px 0 !important;
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                transition: background 0.2s !important;
            }

            .queue-item:hover {
                background: #3a3a3a !important;
            }

            .queue-item-handle {
                cursor: grab !important;
                color: #888 !important;
                font-size: 16px !important;
                padding: 0 5px !important;
            }

            .queue-item select {
                background: #222 !important;
                color: #fff !important;
                border: 1px solid #555 !important;
                border-radius: 3px !important;
                padding: 4px !important;
                font-size: 12px !important;
                min-width: 80px !important;
            }

            .queue-item input {
                background: #222 !important;
                color: #fff !important;
                border: 1px solid #555 !important;
                border-radius: 3px !important;
                padding: 4px !important;
                width: 70px !important;
                font-size: 12px !important;
            }

            .remove-queue {
                background: #f44336 !important;
                border: none !important;
                border-radius: 3px !important;
                color: white !important;
                cursor: pointer !important;
                width: 20px !important;
                height: 20px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 12px !important;
            }

            .remove-queue:hover {
                background: #da190b !important;
            }

            .add-btn {
                background: #4CAF50 !important;
                border: none !important;
                border-radius: 5px !important;
                color: white !important;
                cursor: pointer !important;
                padding: 8px !important;
                font-size: 12px !important;
                transition: background 0.2s !important;
            }

            .add-btn:hover:not(:disabled) {
                background: #45a049 !important;
            }

            .add-btn:disabled {
                background: #666 !important;
                cursor: not-allowed !important;
                opacity: 0.5 !important;
            }

            .green-btn {
                background: #4CAF50 !important;
                border: none !important;
                border-radius: 5px !important;
                color: white !important;
                cursor: pointer !important;
                padding: 8px 12px !important;
                font-size: 12px !important;
                transition: background 0.2s !important;
            }

            .green-btn:hover:not(:disabled) {
                background: #45a049 !important;
            }

            .green-btn:disabled {
                background: #666 !important;
                cursor: not-allowed !important;
                opacity: 0.5 !important;
            }

            .red-btn {
                background: #f44336 !important;
                border: none !important;
                border-radius: 5px !important;
                color: white !important;
                cursor: pointer !important;
                padding: 8px 12px !important;
                font-size: 12px !important;
                transition: background 0.2s !important;
            }

            .red-btn:hover:not(:disabled) {
                background: #da190b !important;
            }

            .red-btn:disabled {
                background: #666 !important;
                cursor: not-allowed !important;
                opacity: 0.5 !important;
            }

            input[type="number"] {
                background: #222 !important;
                color: #fff !important;
                border: 1px solid #555 !important;
                border-radius: 3px !important;
                padding: 4px 8px !important;
                font-size: 12px !important;
            }

            input[type="checkbox"] {
                margin-right: 8px !important;
            }

            label {
                display: flex !important;
                align-items: center !important;
                font-size: 12px !important;
                cursor: pointer !important;
                margin: 5px 0 !important;
            }

            .status {
                background: #333 !important;
                border: 1px solid #444 !important;
                border-radius: 4px !important;
                padding: 8px !important;
                font-size: 11px !important;
                min-height: 16px !important;
                word-break: break-all !important;
            }
        `;

        // 将样式和面板添加到文档
        document.head.appendChild(style);
        document.body.appendChild(panel);

        console.log('插件面板已创建，开始初始化功能...');

        // 初始化功能
        initializeFunctions();

        // 确保面板可见
        panel.style.display = 'block';
        panel.style.visibility = 'visible';
        panel.style.opacity = '1';

        console.log('插件初始化完成，面板应该可见');
    }

    function initializeFunctions() {
        // 队列数据和执行状态
        let queueItems = [];
        let isQueueRunning = false;
        let isIdleRestRunning = false;
        let currentQueueIndex = 0;
        let currentActionCount = 0;
        let errorCount = 0;
        let executionTimer = null;
        let idleMonitorTimer = null;

        // 初始化队列容器
        const queueContainer = document.getElementById('queueContainer');
        const addQueueBtn = document.getElementById('addQueueBtn');
        const panel = document.getElementById('queuePanel');

        // 修复最小化功能
        function setupMinimizeButton() {
            const minimizeBtn = document.getElementById('minimizeBtn');
            if (!minimizeBtn) return;

            minimizeBtn.addEventListener('click', function() {
                const isMinimized = panel.classList.contains('minimized');

                if (isMinimized) {
                    // 展开面板
                    panel.classList.remove('minimized');
                    updateStatus('面板已展開');
                } else {
                    // 最小化面板
                    panel.classList.add('minimized');
                    updateStatus('面板已最小化');
                }
            });
        }

        // 添加队列项目函数
        function addQueueItem() {
            if (queueItems.length >= 5) {
                updateStatus('已達到最大隊列數量 (5個)', true);
                return;
            }

            const itemId = Date.now();
            const queueItem = {
                id: itemId,
                action: '狩獵',
                count: -1
            };

            queueItems.push(queueItem);
            renderQueueItems();
            updateStatus(`已添加行動隊列 (${queueItems.length}/5)`);
            updateQueueDetails();
        }

        // 渲染队列项目
        function renderQueueItems() {
            const container = document.getElementById('queueContainer');

            if (queueItems.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: #999; font-size: 12px; padding: 10px;">點擊下方按鈕添加行動隊列</div>';
                addQueueBtn.disabled = false;
                return;
            }

            container.innerHTML = '';

            queueItems.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'queue-item';
                itemElement.innerHTML = `
                    <span class="queue-item-handle" title="拖曳排序">⋮⋮</span>
                    <select class="queue-action">
                        <option value="狩獵" ${item.action === '狩獵' ? 'selected' : ''}>狩獵</option>
                        <option value="採集" ${item.action === '採集' ? 'selected' : ''}>採集</option>
                        <option value="挖礦" ${item.action === '挖礦' ? 'selected' : ''}>挖礦</option>
                        <option value="休息" ${item.action === '休息' ? 'selected' : ''}>休息</option>
                    </select>
                    <input type="number" class="queue-count" value="${item.count}" min="-1" max="9999" title="-1表示無限次執行">
                    <button class="remove-queue" title="移除">×</button>
                `;

                // 添加事件监听
                const actionSelect = itemElement.querySelector('.queue-action');
                const countInput = itemElement.querySelector('.queue-count');
                const removeBtn = itemElement.querySelector('.remove-queue');

                actionSelect.addEventListener('change', function() {
                    item.action = this.value;
                    updateStatus(`已更新行動: ${this.value}`);
                    updateQueueDetails();
                });

                countInput.addEventListener('change', function() {
                    const value = parseInt(this.value);
                    item.count = isNaN(value) ? 1 : value;
                    updateStatus(`已更新次數: ${item.count}`);
                    updateQueueDetails();
                });

                removeBtn.addEventListener('click', function() {
                    queueItems = queueItems.filter(q => q.id !== item.id);
                    renderQueueItems();
                    updateStatus(`已移除行動隊列 (${queueItems.length}/5)`);
                    updateQueueDetails();
                });

                container.appendChild(itemElement);
            });

            addQueueBtn.disabled = queueItems.length >= 5;
        }

        // 更新状态显示
        function updateStatus(message, isError = false) {
            const statusEl = document.getElementById('queueStatus');
            if (statusEl) {
                statusEl.textContent = `狀態：${message}`;
                statusEl.style.color = isError ? '#ff6b6b' : '#4CAF50';
            }
        }

        // 更新队列详情显示
        function updateQueueDetails() {
            const detailsEl = document.getElementById('queueDetails');
            if (detailsEl && queueItems.length > 0) {
                const details = queueItems.map((item, index) =>
                                               `${index + 1}. ${item.action}${item.count === -1 ? '∞' : `×${item.count}`}`
                ).join(' | ');
                detailsEl.textContent = `當前隊列：${details}`;
            } else {
                detailsEl.textContent = '當前隊列：無';
            }
        }

        // 查找特定动作按钮
        function findActionButton(actionText) {
            const buttons = document.querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.textContent.trim() === actionText) {
                    return btn;
                }
            }
            return null;
        }

        // 查找中断行动按钮
        function findInterruptButton() {
            return findActionButton('中斷行動');
        }

        // 获取体力值
        function getStamina() {
            try {
                // 尝试多种方式查找体力元素
                const elements = document.querySelectorAll('dd, .chakra-stat__valueText, [class*="stamina"], [class*="energy"]');
                for (let el of elements) {
                    const text = el.textContent.trim();
                    const match = text.match(/(\d+)\s*\/\s*(\d+)/);
                    if (match) {
                        return {
                            current: parseInt(match[1]),
                            max: parseInt(match[2])
                        };
                    }
                }
                return null;
            } catch (error) {
                console.error('获取体力值错误:', error);
                return null;
            }
        }

        // 模拟点击按钮
        function simulateButtonClick(button) {
            if (!button) return false;

            try {
                button.click();
                return true;
            } catch (error) {
                console.error('点击按钮错误:', error);
                return false;
            }
        }

        // 等待函数
        function wait(ms) {
            return new Promise(resolve => {
                setTimeout(resolve, ms);
            });
        }

        // 检查页面元素是否存在
        async function checkPageElements(actionText) {
            let attempts = 0;
            const maxAttempts = 10;

            while (attempts < maxAttempts && isQueueRunning) {
                const actionButton = findActionButton(actionText);
                const interruptButton = findInterruptButton();
                const stamina = getStamina();

                if (actionButton && interruptButton && stamina) {
                    return { actionButton, interruptButton, stamina, success: true };
                }

                attempts++;
                updateStatus(`等待遊戲元素加載... (${attempts}/${maxAttempts})`, true);
                await wait(1500);
            }

            return { success: false };
        }

        // 执行普通动作
        async function executeNormalAction(actionText, maxCount) {
            let executedCount = 0;
            errorCount = 0;

            while (executedCount < maxCount && isQueueRunning) {
                const elements = await checkPageElements(actionText);
                if (!elements.success) {
                    handleActionError(`無法找到${actionText}按鈕或遊戲元素`);
                    return executedCount;
                }

                const { actionButton } = elements;

                if (actionButton.disabled) {
                    updateStatus(`${actionText}按鈕不可用，等待中...`, true);
                    await wait(1500);
                    continue;
                }

                let clickAttempts = 0;
                let clickSuccess = false;

                while (clickAttempts < 3 && isQueueRunning) {
                    if (simulateButtonClick(actionButton)) {
                        clickSuccess = true;
                        break;
                    }
                    clickAttempts++;
                    await wait(1000);
                }

                if (!clickSuccess) {
                    errorCount++;
                    if (errorCount >= 3) {
                        handleActionError(`連續3次點擊${actionText}失敗`);
                        return executedCount;
                    }
                    continue;
                }

                errorCount = 0;
                executedCount++;
                currentActionCount = executedCount;

                updateStatus(`執行 ${actionText} (${executedCount}/${maxCount === -1 ? '∞' : maxCount})`);
                updateExecutionDetails(actionText, executedCount, maxCount);

                if (executedCount < maxCount || maxCount === -1) {
                    await waitForActionCompletion(actionText);
                }
            }

            return executedCount;
        }

        // 执行休息动作
        async function executeRestAction(maxCount) {
            let restCompleted = 0;
            errorCount = 0;
            const startStamina = getStamina();

            if (!startStamina) {
                handleActionError('無法獲取起始體力值');
                return 0;
            }

            while ((restCompleted < maxCount || maxCount === -1) && isQueueRunning) {
                const elements = await checkPageElements('休息');
                if (!elements.success) {
                    handleActionError('無法找到休息按鈕或遊戲元素');
                    return restCompleted;
                }

                const { actionButton, interruptButton, stamina } = elements;

                if (maxCount === -1) {
                    if (stamina.current >= stamina.max) {
                        if (simulateButtonClick(interruptButton)) {
                            restCompleted++;
                            updateStatus(`休息完成，體力已恢復滿值`);
                            break;
                        }
                    }
                } else {
                    const targetStamina = startStamina.current + maxCount;
                    if (stamina.current >= targetStamina) {
                        if (simulateButtonClick(interruptButton)) {
                            restCompleted = maxCount;
                            updateStatus(`休息完成，達到目標體力`);
                            break;
                        }
                    }
                }

                if (!actionButton.disabled) {
                    if (simulateButtonClick(actionButton)) {
                        updateStatus(`開始休息... (${restCompleted}/${maxCount === -1 ? '∞' : maxCount})`);
                    }
                }

                await wait(3000);

                const currentStamina = getStamina();
                if (maxCount === -1 && currentStamina && currentStamina.current >= currentStamina.max) {
                    if (simulateButtonClick(interruptButton)) {
                        restCompleted++;
                        updateStatus(`休息完成，體力已滿`);
                        break;
                    }
                }
            }

            return restCompleted;
        }

        // 等待动作完成
        async function waitForActionCompletion(actionText) {
            let waitAttempts = 0;
            const maxWaitAttempts = 20;

            while (waitAttempts < maxWaitAttempts && isQueueRunning) {
                const actionButton = findActionButton(actionText);
                if (actionButton && !actionButton.disabled) {
                    await wait(1500);
                    return true;
                }

                waitAttempts++;
                await wait(1500);
            }

            return false;
        }

        // 处理动作错误
        function handleActionError(errorMessage) {
            errorCount++;
            updateStatus(errorMessage, true);

            const stopOnError = document.getElementById('stopOnError').checked;
            if (stopOnError) {
                stopQueueExecution();
                updateStatus('因錯誤終止全部行動', true);
            } else {
                updateStatus('跳過當前行動，繼續下一個', true);
                moveToNextQueueItem();
            }
        }

        // 更新执行详情
        function updateExecutionDetails(actionText, current, total) {
            const detailsEl = document.getElementById('queueDetails');
            if (detailsEl) {
                detailsEl.textContent = `執行中: ${actionText} (${current}/${total === -1 ? '∞' : total})`;
                detailsEl.style.color = '#4CAF50';
            }
        }

        // 移动到下一个队列项目
        function moveToNextQueueItem() {
            currentQueueIndex++;
            currentActionCount = 0;
            errorCount = 0;

            if (currentQueueIndex >= queueItems.length) {
                const shouldLoop = document.getElementById('loopQueue').checked;
                if (shouldLoop) {
                    currentQueueIndex = 0;
                    updateStatus('隊列完成，開始新一輪循環');
                    executeQueue();
                } else {
                    stopQueueExecution();
                    updateStatus('隊列執行完成');
                }
            } else {
                executeQueue();
            }
        }

        // 执行队列
        async function executeQueue() {
            if (!isQueueRunning || queueItems.length === 0) return;

            if (currentQueueIndex >= queueItems.length) {
                moveToNextQueueItem();
                return;
            }

            const currentItem = queueItems[currentQueueIndex];
            const actionText = currentItem.action;
            const maxCount = currentItem.count === -1 ? Infinity : currentItem.count;

            updateStatus(`開始執行: ${actionText}`);
            updateExecutionDetails(actionText, 0, currentItem.count);

            try {
                let executedCount = 0;

                if (actionText === '休息') {
                    executedCount = await executeRestAction(currentItem.count);
                } else {
                    executedCount = await executeNormalAction(actionText, maxCount);
                }

                if (executedCount >= (currentItem.count === -1 ? 1 : currentItem.count) && isQueueRunning) {
                    moveToNextQueueItem();
                }

            } catch (error) {
                console.error('执行队列错误:', error);
                handleActionError(`執行錯誤: ${error.message}`);
            }
        }

        // 開始隊列執行
        function startQueueExecution() {
            if (queueItems.length === 0) {
                updateStatus('請先添加行動隊列', true);
                return;
            }

            isQueueRunning = true;
            currentQueueIndex = 0;
            currentActionCount = 0;
            errorCount = 0;

            document.getElementById('startQueue').disabled = true;
            document.getElementById('stopQueue').disabled = false;

            updateStatus('開始執行隊列...');
            executeQueue();
        }

        // 停止隊列執行
        function stopQueueExecution() {
            isQueueRunning = false;
            currentQueueIndex = 0;
            currentActionCount = 0;
            errorCount = 0;

            if (executionTimer) {
                clearTimeout(executionTimer);
                executionTimer = null;
            }

            document.getElementById('startQueue').disabled = false;
            document.getElementById('stopQueue').disabled = true;

            updateStatus('已停止執行');
            updateQueueDetails();
        }

        // 智慧休息功能
        function startIdleRest() {
            if (isIdleRestRunning) return;

            isIdleRestRunning = true;
            document.getElementById('startIdleRest').disabled = true;
            document.getElementById('stopIdleRest').disabled = false;

            updateStatus('智慧休息功能已開啟');
            monitorIdleRest();
        }

        function stopIdleRest() {
            isIdleRestRunning = false;
            document.getElementById('startIdleRest').disabled = false;
            document.getElementById('stopIdleRest').disabled = true;

            if (idleMonitorTimer) {
                clearTimeout(idleMonitorTimer);
                idleMonitorTimer = null;
            }

            updateStatus('智慧休息功能已關閉');
        }

        // 監控閒置狀態
        async function monitorIdleRest() {
            if (!isIdleRestRunning) return;

            let idleStartTime = null;
            let lastActionState = null;

            while (isIdleRestRunning) {
                // 檢查所有可能的行動按鈕狀態
                const actionButtons = [];
                const actions = ['狩獵', '採集', '挖礦'];

                for (const action of actions) {
                    const btn = findActionButton(action);
                    if (btn) {
                        actionButtons.push(btn);
                    }
                }

                // 檢查是否有任何行動按鈕可用
                const currentState = actionButtons.some(btn => !btn.disabled);

                if (currentState === true && lastActionState === false) {
                    // 按鈕從禁用變為可用，開始計時
                    idleStartTime = Date.now();
                    const waitTime = parseInt(document.getElementById('idleWaitTime').value) || 20;
                    updateStatus(`檢測到行動完成，${waitTime}秒後如無行動將自動休息`);
                }

                if (idleStartTime !== null && currentState === true) {
                    const elapsed = (Date.now() - idleStartTime) / 1000;
                    const waitTime = parseInt(document.getElementById('idleWaitTime').value) || 20;

                    if (elapsed >= waitTime) {
                        // 時間到達，執行休息
                        const restButton = findActionButton('休息');
                        if (restButton && !restButton.disabled) {
                            simulateButtonClick(restButton);
                            updateStatus('閒置時間到達，自動休息中...');
                            idleStartTime = null;
                        }
                    } else {
                        updateStatus(`閒置計時: ${Math.floor(elapsed)}/${waitTime}秒`);
                    }
                }

                lastActionState = currentState;

                // 使用計時器而不是直接等待，避免阻塞
                await new Promise(resolve => {
                    idleMonitorTimer = setTimeout(resolve, 3000);
                });
            }
        }

        // 事件監聽
        addQueueBtn.addEventListener('click', addQueueItem);
        document.getElementById('startQueue').addEventListener('click', startQueueExecution);
        document.getElementById('stopQueue').addEventListener('click', stopQueueExecution);
        document.getElementById('startIdleRest').addEventListener('click', startIdleRest);
        document.getElementById('stopIdleRest').addEventListener('click', stopIdleRest);

        // 修復最小化按鈕功能
        function setupMinimizeButton() {
            const minimizeBtn = document.getElementById('minimizeBtn');
            if (!minimizeBtn) return;

            minimizeBtn.addEventListener('click', function() {
                const isMinimized = panel.classList.contains('minimized');

                if (isMinimized) {
                    // 展開面板
                    panel.classList.remove('minimized');
                    updateStatus('面板已展開');
                } else {
                    // 最小化面板
                    panel.classList.add('minimized');
                    updateStatus('面板已最小化');
                }
            });
        }

        // 關閉按鈕功能
        document.getElementById('closeBtn').addEventListener('click', function() {
            if (confirm('確定要關閉插件面板嗎？')) {
                // 停止所有執行
                stopQueueExecution();
                stopIdleRest();
                document.getElementById('queuePanel').style.display = 'none';
                updateStatus('面板已關閉');
            }
        });

        // 初始化拖曳功能
        function initializeDrag() {
            const panel = document.getElementById('queuePanel');
            const header = document.getElementById('queuePanelHeader');

            if (!panel || !header) return;

            let isDragging = false;
            let startX, startY, initialLeft, initialTop;

            header.addEventListener('mousedown', startDrag);

            function startDrag(e) {
                if (e.target.closest('#panelControls')) return;

                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;

                initialLeft = parseInt(panel.style.left) || panel.offsetLeft;
                initialTop = parseInt(panel.style.top) || panel.offsetTop;

                panel.style.cursor = 'grabbing';
                document.addEventListener('mousemove', handleDrag);
                document.addEventListener('mouseup', stopDrag);

                e.preventDefault();
            }

            function handleDrag(e) {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                let newLeft = initialLeft + deltaX;
                let newTop = initialTop + deltaY;

                // 限制在視窗範圍內
                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - panel.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - panel.offsetHeight));

                panel.style.left = newLeft + 'px';
                panel.style.top = newTop + 'px';
            }

            function stopDrag() {
                isDragging = false;
                panel.style.cursor = 'default';
                document.removeEventListener('mousemove', handleDrag);
                document.removeEventListener('mouseup', stopDrag);
            }
        }

        // 初始化一個示例隊列項目
        addQueueItem();

        // 設置最小化按鈕
        setupMinimizeButton();

        // 初始化拖曳功能
        initializeDrag();

        console.log('插件功能初始化完成');
    }

    // 添加錯誤處理
    window.addEventListener('error', function(e) {
        console.error('插件錯誤:', e.error);
    });

    console.log('Sorceryntax 隊列行動系統插件已載入');
})();