// ==UserScript==
// @name         HHClub批量处理邮件
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  HHClub批量已读/删除邮件脚本，支持按类型筛选
// @author       Assistant
// @match        https://hhanclub.top/messages.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550514/HHClub%E6%89%B9%E9%87%8F%E5%A4%84%E7%90%86%E9%82%AE%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/550514/HHClub%E6%89%B9%E9%87%8F%E5%A4%84%E7%90%86%E9%82%AE%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 邮件类型映射
    const MESSAGE_TYPES = {
        'all': '全部',
        'luckydraw': '幸运大转盘',
        'seeddeleted': '种子被删除'
    };

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'hhclub-batch-panel';
        panel.innerHTML = `
            <div style="
                position: fixed;
                top: 80px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                z-index: 10000;
                font-family: 'Microsoft YaHei', sans-serif;
                min-width: 280px;
                backdrop-filter: blur(10px);
            ">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    border-bottom: 1px solid rgba(255,255,255,0.3);
                    padding-bottom: 10px;
                ">
                    <h3 style="margin: 0; font-size: 16px;">📧 批量处理邮件</h3>
                    <button id="close-panel" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 18px;
                        cursor: pointer;
                        padding: 0;
                        width: 24px;
                        height: 24px;
                    ">×</button>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">📋 选择邮件类型：</label>
                    <select id="message-type-select" style="
                        width: 100%;
                        padding: 8px;
                        border: none;
                        border-radius: 6px;
                        background: rgba(255,255,255,0.9);
                        color: #333;
                        font-size: 14px;
                    ">
                        ${Object.entries(MESSAGE_TYPES).map(([key, value]) =>
                            `<option value="${key}">${value}</option>`
                        ).join('')}
                    </select>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">⚙️ 选择操作：</label>
                    <select id="action-select" style="
                        width: 100%;
                        padding: 8px;
                        border: none;
                        border-radius: 6px;
                        background: rgba(255,255,255,0.9);
                        color: #333;
                        font-size: 14px;
                    ">
                        <option value="read">标记为已读</option>
                        <option value="delete">删除邮件</option>
                    </select>
                </div>

                <div style="margin-bottom: 15px;">
                    <div id="message-count" style="
                        text-align: center;
                        font-size: 12px;
                        color: rgba(255,255,255,0.8);
                        padding: 8px;
                        background: rgba(255,255,255,0.1);
                        border-radius: 6px;
                    ">检测到: 0 封符合条件的邮件</div>
                    <div id="page-info" style="
                        text-align: center;
                        font-size: 11px;
                        color: rgba(255,255,255,0.7);
                        margin-top: 5px;
                    ">当前页: 1/1</div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">🔄 处理范围：</label>
                    <select id="page-range-select" style="
                        width: 100%;
                        padding: 8px;
                        border: none;
                        border-radius: 6px;
                        background: rgba(255,255,255,0.9);
                        color: #333;
                        font-size: 14px;
                    ">
                        <option value="current">仅当前页</option>
                        <option value="all">所有页面</option>
                        <option value="range">指定页面范围</option>
                    </select>
                </div>

                <div id="page-range-input" style="margin-bottom: 15px; display: none;">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input id="start-page" type="number" min="1" value="1" style="
                            flex: 1;
                            padding: 6px;
                            border: none;
                            border-radius: 4px;
                            background: rgba(255,255,255,0.9);
                            color: #333;
                            font-size: 12px;
                        " placeholder="起始页">
                        <span style="color: rgba(255,255,255,0.8);">至</span>
                        <input id="end-page" type="number" min="1" value="1" style="
                            flex: 1;
                            padding: 6px;
                            border: none;
                            border-radius: 4px;
                            background: rgba(255,255,255,0.9);
                            color: #333;
                            font-size: 12px;
                        " placeholder="结束页">
                    </div>
                </div>

                <div style="display: flex; gap: 10px;">
                    <button id="execute-btn" style="
                        flex: 1;
                        padding: 12px;
                        background: linear-gradient(45deg, #ff6b6b, #ee5a52);
                        border: none;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 14px;
                        transition: all 0.3s;
                    ">🚀 自动执行</button>
                    <button id="stop-btn" style="
                        flex: 1;
                        padding: 12px;
                        background: linear-gradient(45deg, #6c757d, #5a6268);
                        border: none;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 14px;
                        transition: all 0.3s;
                        display: none;
                    ">⏹️ 停止执行</button>
                </div>

                <div id="progress-bar" style="
                    width: 100%;
                    height: 4px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 2px;
                    margin-top: 15px;
                    overflow: hidden;
                    display: none;
                ">
                    <div id="progress-fill" style="
                        height: 100%;
                        background: linear-gradient(90deg, #00ff88, #00cc6a);
                        width: 0%;
                        transition: width 0.3s;
                    "></div>
                </div>

                <div id="status-text" style="
                    margin-top: 10px;
                    text-align: center;
                    font-size: 12px;
                    color: rgba(255,255,255,0.8);
                "></div>
            </div>
        `;

        document.body.appendChild(panel);
        return panel;
    }

    // 获取所有邮件行
    function getMessageRows() {
        // 根据实际HTML结构，邮件行在 #mail-table-display 容器内
        const container = document.getElementById('mail-table-display');
        if (!container) {
            console.log('未找到邮件容器 #mail-table-display');
            return [];
        }

        // 每行邮件是一个 div，使用 grid 布局
        const rows = container.querySelectorAll('div.grid');
        console.log(`找到 ${rows.length} 行邮件`);

        return Array.from(rows).filter(row => {
            // 确保是邮件行，包含复选框
            const checkbox = row.querySelector('input[type="checkbox"]');
            return checkbox !== null;
        });
    }

    // 获取邮件类型
    function getMessageType(row) {
        // 在grid布局中，主题链接在第三个div中
        const divs = row.querySelectorAll('div');
        if (divs.length < 3) return 'other';

        // 第三个div包含主题链接
        const subjectDiv = divs[2];
        const subjectLink = subjectDiv.querySelector('a');
        const text = subjectLink ? subjectLink.textContent.toLowerCase() : subjectDiv.textContent.toLowerCase();

        console.log(`邮件主题: ${text}`);

        if (text.includes('幸运') && text.includes('转盘')) return 'luckydraw';
        if (text.includes('种子') && (text.includes('删除') || text.includes('被删'))) return 'seeddeleted';
        if (text.includes('系统') || text.includes('system')) return 'system';
        if (text.includes('魔力') || text.includes('bonus')) return 'bonus';
        if (text.includes('邀请') || text.includes('invitation')) return 'invitation';

        return 'other';
    }

    // 获取符合条件的邮件行
    function getFilteredMessageRows() {
        const selectedType = document.getElementById('message-type-select').value;
        const rows = getMessageRows();

        return rows.filter(row => {
            const messageType = getMessageType(row);
            return selectedType === 'all' || messageType === selectedType;
        });
    }

    // 获取当前页码和总页数
    function getCurrentPageInfo() {
        const pageSelect = document.querySelector('select[onchange="switchPage(this)"]');
        if (!pageSelect) return { currentPage: 1, totalPages: 1 };

        // 尝试多种方式获取当前页码
        let currentPage = 1;

        // 方法1：查找selected属性
        const selectedOption = pageSelect.querySelector('option[selected]');
        if (selectedOption) {
            currentPage = parseInt(selectedOption.value) + 1;
        } else {
            // 方法2：使用selectedIndex
            currentPage = pageSelect.selectedIndex + 1;
        }

        // 方法3：从URL参数获取（备用）
        const urlParams = new URLSearchParams(window.location.search);
        const urlPage = urlParams.get('page');
        if (urlPage !== null) {
            const urlPageNum = parseInt(urlPage) + 1;
            if (urlPageNum > 0) {
                currentPage = urlPageNum;
            }
        }

        const totalPages = pageSelect.options.length;

        console.log(`当前页面信息 - 当前页: ${currentPage}, 总页数: ${totalPages}`);
        return { currentPage, totalPages };
    }

    // 保存脚本执行状态
    function saveExecutionState(state) {
        localStorage.setItem('hhclub_batch_state', JSON.stringify({
            ...state,
            timestamp: Date.now()
        }));
    }

    // 获取脚本执行状态
    function getExecutionState() {
        try {
            const saved = localStorage.getItem('hhclub_batch_state');
            if (!saved) return null;

            const state = JSON.parse(saved);
            // 检查状态是否过期（30分钟）
            if (Date.now() - state.timestamp > 30 * 60 * 1000) {
                localStorage.removeItem('hhclub_batch_state');
                return null;
            }
            return state;
        } catch (error) {
            console.error('获取执行状态失败:', error);
            return null;
        }
    }

    // 清除执行状态
    function clearExecutionState() {
        localStorage.removeItem('hhclub_batch_state');
    }

    // 使用URL直接跳转到指定页面
    function goToPageByUrl(pageNumber) {
        const baseUrl = window.location.href.split('?')[0]; // 获取基础URL
        const targetUrl = `${baseUrl}?action=viewmailbox&box=1&page=${pageNumber - 1}`;

        console.log(`通过URL跳转到第 ${pageNumber} 页: ${targetUrl}`);

        // 保存当前执行状态
        const state = getExecutionState();
        if (state && state.isExecuting) {
            saveExecutionState({
                ...state,
                currentPage: pageNumber,
                lastAction: 'page_jump'
            });
        }

        // 直接跳转
        window.location.href = targetUrl;
    }

    // 跳转到第一页的专用函数
    function goToFirstPage() {
        const baseUrl = window.location.href.split('?')[0];
        const firstPageUrl = `${baseUrl}?action=viewmailbox&box=1&page=0`;

        console.log(`当前URL: ${window.location.href}`);
        console.log(`目标第一页URL: ${firstPageUrl}`);

        // 如果已经在第一页，不需要跳转
        if (window.location.href === firstPageUrl) {
            console.log('已经在第一页，无需跳转');
            return false;
        }

        console.log('执行跳转到第一页...');

        // 直接跳转
        window.location.href = firstPageUrl;
        return true;
    }

    // 处理当前页面的邮件（不跳转）
    async function processCurrentPageOnly(selectedAction, selectedType) {
        const filteredRows = getFilteredMessageRows();
        const messageIds = [];

        console.log(`开始处理当前页，找到 ${filteredRows.length} 封符合条件的邮件`);

        // 收集邮件ID
        for (const row of filteredRows) {
            try {
                const checkbox = row.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    messageIds.push(checkbox.value);
                    row.style.opacity = '0.5';
                    row.style.backgroundColor = 'rgba(0,255,0,0.1)';
                }
            } catch (error) {
                console.error('处理邮件行时出错:', error);
                row.style.backgroundColor = 'rgba(255,0,0,0.1)';
            }
        }

        // 使用AJAX执行操作
        if (messageIds.length > 0) {
            const success = await executeMailAction(messageIds, selectedAction);
            if (success) {
                console.log(`成功处理 ${messageIds.length} 封邮件`);
                return messageIds.length;
            } else {
                console.error('AJAX操作失败');
                return 0;
            }
        }

        return 0;
    }

    // 更新邮件计数和页面信息
    function updateMessageCount() {
        const filteredRows = getFilteredMessageRows();
        const countElement = document.getElementById('message-count');
        const pageInfoElement = document.getElementById('page-info');

        if (countElement) {
            countElement.textContent = `检测到: ${filteredRows.length} 封符合条件的邮件`;
        }

        if (pageInfoElement) {
            const { currentPage, totalPages } = getCurrentPageInfo();
            pageInfoElement.textContent = `当前页: ${currentPage}/${totalPages}`;

            // 更新页面范围输入框的最大值
            const endPageInput = document.getElementById('end-page');
            if (endPageInput) {
                endPageInput.max = totalPages;
                endPageInput.value = Math.min(parseInt(endPageInput.value) || totalPages, totalPages);
            }
            const startPageInput = document.getElementById('start-page');
            if (startPageInput) {
                startPageInput.max = totalPages;
            }
        }
    }

    // 根据类型筛选邮件（仅更新计数显示）
    function filterMessagesByType() {
        updateMessageCount();
    }

    // 更新UI状态（执行中/空闲）
    function updateUIState(isExecuting) {
        const executeBtn = document.getElementById('execute-btn');
        const stopBtn = document.getElementById('stop-btn');

        if (executeBtn && stopBtn) {
            if (isExecuting) {
                executeBtn.style.display = 'none';
                stopBtn.style.display = 'block';
            } else {
                executeBtn.style.display = 'block';
                stopBtn.style.display = 'none';
            }
        }
    }

    // 从状态恢复UI选择
    function restoreUIFromState(state) {
        if (!state) return;

        // 恢复邮件类型选择
        const typeSelect = document.getElementById('message-type-select');
        if (typeSelect && state.selectedType) {
            typeSelect.value = state.selectedType;
        }

        // 恢复操作选择
        const actionSelect = document.getElementById('action-select');
        if (actionSelect && state.selectedAction) {
            actionSelect.value = state.selectedAction;
        }

        // 恢复页面范围选择
        if (state.pagesToProcess) {
            const { currentPage, totalPages } = getCurrentPageInfo();
            const pageRangeSelect = document.getElementById('page-range-select');

            if (state.pagesToProcess.length === 1) {
                pageRangeSelect.value = 'current';
            } else if (state.pagesToProcess.length === totalPages) {
                pageRangeSelect.value = 'all';
            } else {
                pageRangeSelect.value = 'range';
                // 显示范围输入框
                const rangeInput = document.getElementById('page-range-input');
                if (rangeInput) {
                    rangeInput.style.display = 'block';
                    const startPage = Math.min(...state.pagesToProcess);
                    const endPage = Math.max(...state.pagesToProcess);
                    document.getElementById('start-page').value = startPage;
                    document.getElementById('end-page').value = endPage;
                }
            }
        }

        console.log('已恢复UI状态:', {
            selectedType: state.selectedType,
            selectedAction: state.selectedAction,
            pageRange: state.pagesToProcess ? `${state.pagesToProcess.length}页` : '未知'
        });
    }

    // 绑定所有事件
    function bindEvents(panel) {
        // 关闭按钮
        const closeBtn = document.getElementById('close-panel');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                // 如果正在执行，先确认
                const state = getExecutionState();
                if (state && state.isExecuting) {
                    if (confirm('正在执行批量处理任务，确定要关闭面板吗？\n任务将继续在后台运行。')) {
                        panel.remove();
                    }
                } else {
                    panel.remove();
                }
            });
        }

        // 邮件类型选择
        const typeSelect = document.getElementById('message-type-select');
        if (typeSelect) {
            typeSelect.addEventListener('change', filterMessagesByType);
        }

        // 页面范围选择
        const pageRangeSelect = document.getElementById('page-range-select');
        if (pageRangeSelect) {
            pageRangeSelect.addEventListener('change', function() {
                const rangeInput = document.getElementById('page-range-input');
                if (this.value === 'range') {
                    rangeInput.style.display = 'block';
                    const { totalPages } = getCurrentPageInfo();
                    document.getElementById('end-page').value = totalPages;
                } else {
                    rangeInput.style.display = 'none';
                }
            });
        }

        // 执行按钮
        const executeBtn = document.getElementById('execute-btn');
        if (executeBtn) {
            executeBtn.addEventListener('click', executeBatchOperation);
        }

        // 停止按钮
        const stopBtn = document.getElementById('stop-btn');
        if (stopBtn) {
            stopBtn.addEventListener('click', function() {
                if (confirm('确定要停止当前的批量处理任务吗？')) {
                    clearExecutionState();
                    updateUIState(false);
                    const statusText = document.getElementById('status-text');
                    const progressBar = document.getElementById('progress-bar');
                    if (statusText) statusText.textContent = '❌ 用户停止了执行';
                    if (progressBar) {
                        setTimeout(() => {
                            progressBar.style.display = 'none';
                            statusText.textContent = '';
                        }, 2000);
                    }
                    console.log('用户停止了批量处理任务');
                }
            });
        }
    }

    // 使用AJAX执行邮件操作
    async function executeMailAction(messageIds, action) {
        try {
            const formData = new FormData();
            formData.append('action', 'moveordel');

            // 添加邮件ID
            messageIds.forEach(id => {
                formData.append('messages[]', id);
            });

            if (action === 'read') {
                formData.append('markread', '设为已读');
            } else if (action === 'delete') {
                formData.append('delete', '删除');
            }

            const response = await fetch('messages.php', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.ok) {
                console.log(`成功${action === 'read' ? '标记已读' : '删除'} ${messageIds.length} 封邮件`);
                return true;
            } else {
                console.error('操作失败:', response.status, response.statusText);
                return false;
            }
        } catch (error) {
            console.error('AJAX请求失败:', error);
            return false;
        }
    }

    // 处理单页邮件
    async function processSinglePage(selectedAction, selectedType) {
        const filteredRows = getFilteredMessageRows();
        let successful = 0;
        const messageIds = [];

        // 收集符合条件的邮件ID
        for (const row of filteredRows) {
            try {
                const checkbox = row.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    const messageId = checkbox.value;
                    messageIds.push(messageId);
                    successful++;
                    row.style.opacity = '0.5';
                    row.style.backgroundColor = 'rgba(0,255,0,0.1)';
                } else {
                    row.style.backgroundColor = 'rgba(255,0,0,0.1)';
                }
            } catch (error) {
                console.error('处理邮件时出错:', error);
                row.style.backgroundColor = 'rgba(255,0,0,0.1)';
            }
        }

        // 使用AJAX执行操作
        if (messageIds.length > 0) {
            const success = await executeMailAction(messageIds, selectedAction);
            if (!success) {
                console.error('AJAX操作失败，尝试传统方式');
                // 如果AJAX失败，回退到传统方式（但会刷新页面）
                return await processSinglePageTraditional(selectedAction, messageIds);
            }
        }

        return successful;
    }

    // 传统方式处理（备用方案）
    async function processSinglePageTraditional(selectedAction, messageIds) {
        // 选中复选框
        messageIds.forEach(id => {
            const checkbox = document.querySelector(`input[value="${id}"]`);
            if (checkbox) checkbox.checked = true;
        });

        // 点击按钮
        if (selectedAction === 'read') {
            const readButton = document.querySelector('input[name="markread"]');
            if (readButton) {
                readButton.click();
                await sleep(2000); // 等待页面刷新和重新加载
            }
        } else if (selectedAction === 'delete') {
            const deleteButton = document.querySelector('input[name="delete"]');
            if (deleteButton) {
                deleteButton.click();
                await sleep(2000); // 等待页面刷新和重新加载
            }
        }

        return messageIds.length;
    }

    // 执行批量操作
    async function executeBatchOperation() {
        const selectedAction = document.getElementById('action-select').value;
        const selectedType = document.getElementById('message-type-select').value;
        const pageRange = document.getElementById('page-range-select').value;

        // 获取要处理的页面范围
        let pagesToProcess = [];
        const { currentPage, totalPages } = getCurrentPageInfo();

        if (pageRange === 'current') {
            pagesToProcess = [currentPage];
        } else if (pageRange === 'all') {
            for (let i = 1; i <= totalPages; i++) {
                pagesToProcess.push(i);
            }
        } else if (pageRange === 'range') {
            const startPage = parseInt(document.getElementById('start-page').value) || 1;
            const endPage = parseInt(document.getElementById('end-page').value) || totalPages;
            for (let i = Math.max(1, startPage); i <= Math.min(totalPages, endPage); i++) {
                pagesToProcess.push(i);
            }
        }

        if (pagesToProcess.length === 0) {
            alert('没有找到要处理的页面！');
            return;
        }

        // 如果只有一页，直接处理不跳转
        if (pagesToProcess.length === 1 && pagesToProcess[0] === currentPage) {
            await processSinglePageInPlace(selectedAction, selectedType);
            return;
        }

        const typeText = MESSAGE_TYPES[selectedType] || '全部';
        const actionText = selectedAction === 'read' ? '标记为已读' : '删除';
        const confirmMsg = `确定要${actionText}所有「${typeText}」类型的邮件吗？\n\n将处理 ${pagesToProcess.length} 页邮件。\n\n注意：脚本将通过页面跳转来处理多页邮件。`;

        if (!confirm(confirmMsg)) {
            return;
        }

        // 更新UI状态
        updateUIState(true);

        // 根据操作类型选择不同的处理模式
        if (selectedAction === 'delete' && pageRange !== 'current') {
            // 删除模式：使用循环扫描
            await startDeleteScanMode(selectedAction, selectedType, pagesToProcess);
        } else {
            // 标记已读模式：使用传统序列模式
            const executionState = {
                isExecuting: true,
                selectedAction,
                selectedType,
                pagesToProcess,
                currentPageIndex: 0,
                totalProcessed: 0,
                startTime: Date.now()
            };

            saveExecutionState(executionState);
            await processNextPageInSequence();
        }
    }

    // 删除模式的循环扫描处理
    async function startDeleteScanMode(selectedAction, selectedType, originalPages) {
        console.log('启动删除扫描模式');

        const statusText = document.getElementById('status-text');
        const progressBar = document.getElementById('progress-bar');
        const progressFill = document.getElementById('progress-fill');

        progressBar.style.display = 'block';

        // 保存删除模式的执行状态
        const executionState = {
            isExecuting: true,
            mode: 'delete_scan',
            selectedAction,
            selectedType,
            originalPages,
            currentScanRound: 1,
            currentScanPage: 1,
            totalProcessed: 0,
            currentRoundProcessed: 0, // 当前轮已处理的邮件数
            hasProcessedInCurrentRound: false, // 当前轮是否处理过邮件
            startTime: Date.now()
        };

        saveExecutionState(executionState);

        // 开始第一轮扫描
        await performDeleteScan();
    }

    // 执行删除扫描
    async function performDeleteScan() {
        console.log('=== 开始执行删除扫描 ===');

        const state = getExecutionState();
        if (!state || !state.isExecuting || state.mode !== 'delete_scan') {
            console.log('删除扫描被停止或状态异常');
            console.log('当前状态:', state);
            updateUIState(false);
            return;
        }

        const { currentPage, totalPages } = getCurrentPageInfo();
        const statusText = document.getElementById('status-text');
        const progressFill = document.getElementById('progress-fill');

        console.log(`=== 第 ${state.currentScanRound} 轮扫描 ===`);
        console.log(`当前页: ${currentPage}, 总页数: ${totalPages}, 目标页: ${state.currentScanPage}`);
        console.log(`本轮已处理: ${state.currentRoundProcessed}, 本轮是否有处理: ${state.hasProcessedInCurrentRound}`);

        // 检查是否需要跳转到目标页面
        if (currentPage !== state.currentScanPage) {
            console.log(`需要跳转到第 ${state.currentScanPage} 页`);
            saveExecutionState(state);
            goToPageByUrl(state.currentScanPage);
            return; // 跳转后会重新进入这个函数
        }

        // 更新进度显示
        const progress = ((state.currentScanPage - 1) / totalPages) * 100;
        progressFill.style.width = progress + '%';
        statusText.textContent = `第 ${state.currentScanRound} 轮扫描 - 处理第 ${state.currentScanPage}/${totalPages} 页`;

        // 处理当前页面
        const processed = await processCurrentPageOnly(state.selectedAction, state.selectedType);
        console.log(`第 ${state.currentScanPage} 页处理了 ${processed} 封邮件`);

        // 更新状态
        state.currentRoundProcessed += processed;
        if (processed > 0) {
            state.hasProcessedInCurrentRound = true;
        }

        // 检查是否到达最后一页
        if (state.currentScanPage >= totalPages) {
            console.log(`到达最后一页 (第${totalPages}页)`);
            console.log(`本轮总共处理了 ${state.currentRoundProcessed} 封邮件`);
            console.log(`本轮是否有处理过邮件: ${state.hasProcessedInCurrentRound}`);

            // 更新总处理数
            state.totalProcessed += state.currentRoundProcessed;

            if (state.hasProcessedInCurrentRound) {
                // 本轮有处理过邮件，需要开始新一轮
                console.log('本轮有处理过邮件，开始新一轮扫描');

                // 准备新一轮
                state.currentScanRound++;
                state.currentScanPage = 1;
                state.currentRoundProcessed = 0;
                state.hasProcessedInCurrentRound = false;

                saveExecutionState(state);

                // 跳转到第一页开始新一轮
                console.log(`开始第 ${state.currentScanRound} 轮扫描`);
                const jumped = goToFirstPage();
                if (!jumped) {
                    // 已经在第一页，延迟后继续
                    setTimeout(() => {
                        performDeleteScan();
                    }, 1000);
                }
            } else {
                // 本轮没有处理任何邮件，删除完成
                console.log('本轮没有处理任何邮件，删除完成！');

                clearExecutionState();
                updateUIState(false);

                progressFill.style.width = '100%';
                statusText.textContent = `✅ 删除完成！总共处理了 ${state.totalProcessed} 封邮件（${state.currentScanRound} 轮扫描）`;

                setTimeout(() => {
                    const progressBar = document.getElementById('progress-bar');
                    if (progressBar) {
                        progressBar.style.display = 'none';
                        statusText.textContent = '';
                    }
                }, 5000);

                console.log(`删除完成！总共 ${state.currentScanRound} 轮扫描，处理了 ${state.totalProcessed} 封邮件`);
            }
        } else {
            // 还没到最后一页，继续下一页
            state.currentScanPage++;
            console.log(`继续扫描下一页: ${state.currentScanPage}`);

            saveExecutionState(state);

            // 延迟一点再继续，给用户停止的机会
            setTimeout(() => {
                const currentState = getExecutionState();
                if (currentState && currentState.isExecuting) {
                    performDeleteScan();
                } else {
                    console.log('扫描被停止');
                    updateUIState(false);
                }
            }, 500);
        }
    }

    // 处理单页（就地处理，不跳转）
    async function processSinglePageInPlace(selectedAction, selectedType) {
        const statusText = document.getElementById('status-text');
        const progressBar = document.getElementById('progress-bar');
        const progressFill = document.getElementById('progress-fill');

        progressBar.style.display = 'block';
        statusText.textContent = '正在处理当前页...';
        progressFill.style.width = '50%';

        const processed = await processCurrentPageOnly(selectedAction, selectedType);

        progressFill.style.width = '100%';
        statusText.textContent = `✅ 完成！成功处理了 ${processed} 封邮件`;

        setTimeout(() => {
            progressBar.style.display = 'none';
            statusText.textContent = '';
        }, 3000);
    }

    // 按序处理下一页
    async function processNextPageInSequence() {
        const state = getExecutionState();
        if (!state || !state.isExecuting) {
            console.log('没有找到执行状态或已被停止，停止处理');
            updateUIState(false);
            return;
        }

        const { currentPage } = getCurrentPageInfo();
        const targetPage = state.pagesToProcess[state.currentPageIndex];

        console.log(`处理序列：当前页=${currentPage}, 目标页=${targetPage}, 进度=${state.currentPageIndex + 1}/${state.pagesToProcess.length}`);

        // 更新UI
        const statusText = document.getElementById('status-text');
        const progressBar = document.getElementById('progress-bar');
        const progressFill = document.getElementById('progress-fill');

        if (statusText) {
            progressBar.style.display = 'block';
            const progress = (state.currentPageIndex / state.pagesToProcess.length) * 100;
            progressFill.style.width = progress + '%';
            statusText.textContent = `正在处理第 ${targetPage} 页... (${state.currentPageIndex + 1}/${state.pagesToProcess.length})`;
        }

        // 如果当前页就是目标页，直接处理
        if (currentPage === targetPage) {
            // 再次检查是否被停止
            const currentState = getExecutionState();
            if (!currentState || !currentState.isExecuting) {
                console.log('任务已被停止');
                updateUIState(false);
                return;
            }

            const processed = await processCurrentPageOnly(state.selectedAction, state.selectedType);
            console.log(`第 ${targetPage} 页处理完成，处理了 ${processed} 封邮件`);

            // 更新状态
            state.currentPageIndex++;
            state.totalProcessed += processed;

            // 再次检查是否被停止（处理过程中可能被停止）
            const finalState = getExecutionState();
            if (!finalState || !finalState.isExecuting) {
                console.log('任务在处理过程中被停止');
                updateUIState(false);
                return;
            }

            // 检查是否还有更多页面要处理
            if (state.currentPageIndex < state.pagesToProcess.length) {
                // 还有更多页面，跳转到下一页
                saveExecutionState(state);
                const nextPage = state.pagesToProcess[state.currentPageIndex];

                // 延迟一点再跳转，给用户停止的机会
                setTimeout(() => {
                    const checkState = getExecutionState();
                    if (checkState && checkState.isExecuting) {
                        goToPageByUrl(nextPage);
                    } else {
                        console.log('跳转前检查发现任务已停止');
                        updateUIState(false);
                    }
                }, 500);
            } else {
                // 所有页面处理完成
                clearExecutionState();
                updateUIState(false);
                if (statusText) {
                    progressFill.style.width = '100%';
                    statusText.textContent = `✅ 完成！总共处理了 ${state.totalProcessed} 封邮件`;
                    setTimeout(() => {
                        progressBar.style.display = 'none';
                        statusText.textContent = '';
                    }, 3000);
                }
                console.log(`批量处理完成！总共处理了 ${state.totalProcessed} 封邮件`);
            }
        } else {
            // 需要跳转到目标页
            console.log(`需要跳转到第 ${targetPage} 页`);
            goToPageByUrl(targetPage);
        }
    }

    // 睡眠函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 初始化脚本
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 检查是否有未完成的执行状态
        const savedState = getExecutionState();
        if (savedState && savedState.isExecuting) {
            console.log('检测到未完成的批量处理任务，继续执行...');
            console.log('执行状态:', savedState);

            // 延迟一点时间让页面完全加载
            setTimeout(() => {
                // 创建控制面板
                const panel = createControlPanel();

                // 恢复UI状态
                restoreUIFromState(savedState);
                updateMessageCount();
                updateUIState(true); // 显示停止按钮

                // 绑定事件
                bindEvents(panel);

                // 根据模式继续执行
                setTimeout(() => {
                    console.log('页面加载完成，恢复执行状态');
                    console.log('保存的状态:', savedState);
                    console.log('当前URL:', window.location.href);

                    if (savedState.mode === 'delete_scan') {
                        console.log('恢复删除扫描模式');
                        performDeleteScan();
                    } else {
                        console.log('恢复序列处理模式');
                        processNextPageInSequence();
                    }
                }, 1500);
            }, 1000);
            return;
        }

        // 正常初始化
        const panel = createControlPanel();

        // 初始化邮件计数
        setTimeout(() => {
            updateMessageCount();
        }, 1000);

        // 绑定事件
        bindEvents(panel);

        // 添加样式增强
        const style = document.createElement('style');
        style.textContent = `
            #hhclub-batch-panel button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }

            tr[style*="opacity: 0.5"] {
                transition: all 0.3s ease;
            }
        `;
        document.head.appendChild(style);

        console.log('🚀 HHClub批量邮件处理脚本已加载');
    }

    // 启动脚本
    init();

})();
